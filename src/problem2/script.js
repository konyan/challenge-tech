const PRICES_URL = "https://interview.switcheo.com/prices.json";
const ICON_BASE = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

const state = {
  prices: {},
  tokens: [],
  from: null,
  to: null,
  activeMenu: null,
  loading: false,
};

const el = {
  form: document.getElementById("swap-form"),
  fromSelect: document.getElementById("from-select"),
  toSelect: document.getElementById("to-select"),
  fromIcon: document.getElementById("from-icon"),
  toIcon: document.getElementById("to-icon"),
  fromSymbol: document.getElementById("from-symbol"),
  toSymbol: document.getElementById("to-symbol"),
  fromAmount: document.getElementById("from-amount"),
  toAmount: document.getElementById("to-amount"),
  fromError: document.getElementById("from-error"),
  toError: document.getElementById("to-error"),
  rateText: document.getElementById("rate-text"),
  usdValue: document.getElementById("usd-value"),
  feeValue: document.getElementById("fee-value"),
  submitBtn: document.getElementById("submit-btn"),
  submitText: document.querySelector(".btn-text"),
  formStatus: document.getElementById("form-status"),
  swapBtn: document.getElementById("swap-btn"),
  refreshBtn: document.getElementById("refresh-btn"),
  menu: document.getElementById("token-menu"),
  tokenList: document.getElementById("token-list"),
  tokenSearch: document.getElementById("token-search"),
};

const formatNumber = (value, digits = 6) => {
  if (!Number.isFinite(value)) return "--";
  return value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
  });
};

const formatUSD = (value) => {
  if (!Number.isFinite(value)) return "$0.00";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
};

const loadPrices = async () => {
  const response = await fetch(PRICES_URL);
  const data = await response.json();
  const prices = {};
  data.forEach((item) => {
    if (item.price && item.currency) {
      prices[item.currency.toUpperCase()] = item.price;
    }
  });
  state.prices = prices;
  state.tokens = Object.keys(prices).sort();
};

const tokenIcon = (symbol) => `${ICON_BASE}${symbol}.svg`;

const setToken = (side, symbol) => {
  if (!symbol) return;
  if (side === "from") {
    state.from = symbol;
    el.fromSymbol.textContent = symbol;
    el.fromIcon.src = tokenIcon(symbol);
    el.fromIcon.alt = `${symbol} token`;
  } else {
    state.to = symbol;
    el.toSymbol.textContent = symbol;
    el.toIcon.src = tokenIcon(symbol);
    el.toIcon.alt = `${symbol} token`;
  }
  updateRate();
  updateOutputs();
};

const updateRate = () => {
  const { from, to, prices } = state;
  if (!from || !to) {
    el.rateText.textContent = "Rate: --";
    return;
  }
  const rate = prices[from] && prices[to] ? prices[from] / prices[to] : null;
  if (!rate) {
    el.rateText.textContent = "Rate: --";
    return;
  }
  el.rateText.textContent = `Rate: 1 ${from} ≈ ${formatNumber(rate, 6)} ${to}`;
};

const parseAmount = (value) => {
  if (!value) return 0;
  const normalized = value.replace(/,/g, "");
  return Number.parseFloat(normalized);
};

const updateOutputs = () => {
  const { from, to, prices } = state;
  const fromValue = parseAmount(el.fromAmount.value);
  if (!from || !to || !prices[from] || !prices[to]) {
    el.toAmount.value = "";
    el.usdValue.textContent = "$0.00";
    el.feeValue.textContent = "0.00";
    return;
  }
  const rate = prices[from] / prices[to];
  const toValue = Number.isFinite(fromValue) ? fromValue * rate : 0;
  el.toAmount.value = fromValue ? formatNumber(toValue, 6) : "";
  const usdValue = fromValue * prices[from];
  const fee = usdValue * 0.002;
  el.usdValue.textContent = formatUSD(usdValue || 0);
  el.feeValue.textContent = `${formatNumber(fee || 0, 4)} USD`;
};

const validate = () => {
  let valid = true;
  const amount = parseAmount(el.fromAmount.value);
  if (!state.from || !state.to) {
    el.fromError.textContent = "Select both tokens.";
    valid = false;
  } else if (state.from === state.to) {
    el.fromError.textContent = "Select two different tokens.";
    valid = false;
  } else if (!amount || amount <= 0) {
    el.fromError.textContent = "Enter a valid amount to swap.";
    valid = false;
  } else {
    el.fromError.textContent = "";
  }
  el.toError.textContent = valid ? "" : "";
  return valid;
};

const setMenuPosition = (target) => {
  const rect = target.getBoundingClientRect();
  el.menu.style.inset = "auto";
  el.menu.style.left = `${Math.max(16, rect.left)}px`;
  el.menu.style.top = `${rect.bottom + 12}px`;
};

const renderMenu = (filter = "") => {
  const query = filter.trim().toLowerCase();
  el.tokenList.innerHTML = "";
  state.tokens
    .filter((token) => token.toLowerCase().includes(query))
    .forEach((token) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "token-option";
      option.setAttribute("role", "option");
      option.innerHTML = `
				<img class="token-icon" src="${tokenIcon(token)}" alt="${token} token" />
				<div>
					<strong>${token}</strong>
					<span>$${formatNumber(state.prices[token], 4)}</span>
				</div>
			`;
      option.addEventListener("click", () => {
        setToken(state.activeMenu, token);
        closeMenu();
      });
      el.tokenList.appendChild(option);
    });
};

const openMenu = (side, target) => {
  state.activeMenu = side;
  setMenuPosition(target);
  el.menu.hidden = false;
  el.tokenSearch.value = "";
  renderMenu();
  el.tokenSearch.focus();
};

const closeMenu = () => {
  el.menu.hidden = true;
  state.activeMenu = null;
};

const toggleLoading = (loading) => {
  state.loading = loading;
  el.submitBtn.classList.toggle("loading", loading);
  el.submitBtn.disabled = loading;
  el.submitText.textContent = loading ? "Swapping..." : "Confirm Swap";
};

const swapTokens = () => {
  const temp = state.from;
  state.from = state.to;
  state.to = temp;
  setToken("from", state.from);
  setToken("to", state.to);
};

el.fromAmount.addEventListener("input", () => {
  updateOutputs();
  validate();
});

el.swapBtn.addEventListener("click", () => {
  swapTokens();
});

el.fromSelect.addEventListener("click", (event) => {
  openMenu("from", event.currentTarget);
});
el.toSelect.addEventListener("click", (event) => {
  openMenu("to", event.currentTarget);
});

el.fromSelect.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openMenu("from", event.currentTarget);
  }
});

el.toSelect.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openMenu("to", event.currentTarget);
  }
});

el.tokenSearch.addEventListener("input", (event) => {
  renderMenu(event.target.value);
});

document.addEventListener("click", (event) => {
  if (!el.menu.hidden && !el.menu.contains(event.target) && !event.target.closest(".select")) {
    closeMenu();
  }
});

el.form.addEventListener("submit", (event) => {
  event.preventDefault();
  el.formStatus.textContent = "";
  if (!validate()) return;
  toggleLoading(true);
  window.setTimeout(() => {
    toggleLoading(false);
    el.formStatus.textContent = `Swap submitted: ${el.fromAmount.value} ${state.from} → ${el.toAmount.value} ${state.to}.`;
  }, 1200);
});

el.refreshBtn.addEventListener("click", async () => {
  el.formStatus.textContent = "Refreshing prices...";
  await init();
  el.formStatus.textContent = "Prices updated.";
});

const init = async () => {
  await loadPrices();
  if (!state.tokens.length) return;
  const [first, second] = state.tokens;
  setToken("from", state.from || first);
  setToken("to", state.to || second || first);
  updateRate();
  updateOutputs();
};

init();
