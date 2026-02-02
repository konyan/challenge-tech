const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const ICON_BASE = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';
const state = {
  prices: {},
  tokens: [],
  from: null,
  to: null,
  activeMenu: null,
  loading: false,
  balances: {},
  hasError: false,
  lastUpdate: null
};

console.log('Token Swap App Initialized', state);
const el = {
  form: document.getElementById('swap-form'),
  fromSelect: document.getElementById('from-select'),
  toSelect: document.getElementById('to-select'),
  fromIcon: document.getElementById('from-icon'),
  toIcon: document.getElementById('to-icon'),
  fromSymbol: document.getElementById('from-symbol'),
  toSymbol: document.getElementById('to-symbol'),
  fromAmount: document.getElementById('from-amount'),
  toAmount: document.getElementById('to-amount'),
  fromError: document.getElementById('from-error'),
  toError: document.getElementById('to-error'),
  rateText: document.getElementById('rate-text'),
  usdValue: document.getElementById('usd-value'),
  feeValue: document.getElementById('fee-value'),
  submitBtn: document.getElementById('submit-btn'),
  submitText: document.querySelector('.btn-text'),
  formStatus: document.getElementById('form-status'),
  swapBtn: document.getElementById('swap-btn'),
  refreshBtn: document.getElementById('refresh-btn'),
  menu: document.getElementById('token-menu'),
  tokenList: document.getElementById('token-list'),
  tokenSearch: document.getElementById('token-search'),
  tokenChips: document.getElementById('token-chips'),
};
const formatNumber = (value, digits = 6) => {
  if (!Number.isFinite(value)) return '--';
  return value.toLocaleString('en-US', { maximumFractionDigits: digits });
};
const formatUSD = (value) => {
  if (!Number.isFinite(value)) return '$0.00';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
};
const loadPrices = async () => {
  try {
    const response = await fetch(PRICES_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const prices = {};
    data.forEach((item) => {
      if (item.price && item.currency) {
        prices[item.currency] = item.price;
      }
    });
    state.prices = prices;
    state.tokens = Object.keys(prices).sort();
    state.lastUpdate = new Date();
    state.hasError = false;

    // Initialize mock balances for demo
    state.balances = {};
    state.tokens.forEach(token => {
      state.balances[token] = Math.random() * 10000;
    });
  } catch (error) {
    console.error('Failed to load prices:', error);
    state.hasError = true;
    throw error;
  }
};
const tokenIcon = (symbol) => `${ICON_BASE}${symbol}.svg`;
const setToken = (side, symbol) => {
  console.log('Setting token', side, symbol);
  if (!symbol || !side) return;

  if (side === 'from') {
    state.from = symbol;
    if (el.fromSymbol) el.fromSymbol.textContent = symbol;
    if (el.fromIcon) {
      el.fromIcon.src = tokenIcon(symbol);
      el.fromIcon.alt = `${symbol} token`;
    }
    // Update balance display
    const balance = state.balances[symbol] || 0;
    const balanceEl = document.getElementById('from-balance');
    if (balanceEl) {
      balanceEl.textContent = `Balance: ${formatNumber(balance, 2)}`;
    }
  } else {
    state.to = symbol;
    if (el.toSymbol) el.toSymbol.textContent = symbol;
    if (el.toIcon) {
      el.toIcon.src = tokenIcon(symbol);
      el.toIcon.alt = `${symbol} token`;
    }
    // Update balance display
    const balance = state.balances[symbol] || 0;
    const balanceEl = document.getElementById('to-balance');
    if (balanceEl) {
      balanceEl.textContent = `Balance: ${formatNumber(balance, 2)}`;
    }
  }
  updateRate();
  updateOutputs();
  validate();
};
const updateRate = () => {
  const { from, to, prices } = state;
  if (!from || !to) {
    el.rateText.textContent = 'Rate: --';
    return;
  }
  const rate = prices[from] && prices[to] ? prices[from] / prices[to] : null;
  if (!rate) {
    el.rateText.textContent = 'Rate: --';
    return;
  }
  el.rateText.textContent = `Rate: 1 ${from} ≈ ${formatNumber(rate, 6)} ${to}`;
};
const parseAmount = (value) => {
  if (!value) return 0;
  const normalized = value.replace(/,/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};
const updateOutputs = () => {
  const { from, to, prices } = state;
  const fromValue = parseAmount(el.fromAmount.value);
  if (!from || !to || !prices[from] || !prices[to]) {
    el.toAmount.value = '';
    el.usdValue.textContent = '$0.00';
    el.feeValue.textContent = '0.00';
    return;
  }
  const rate = prices[from] / prices[to];
  const toValue = Number.isFinite(fromValue) ? fromValue * rate : 0;
  el.toAmount.value = fromValue ? formatNumber(toValue, 6) : '';
  const usdValue = fromValue * prices[from];
  const fee = usdValue * 0.002;
  el.usdValue.textContent = formatUSD(usdValue || 0);
  el.feeValue.textContent = `${formatNumber(fee || 0, 4)} USD`;
};
const validate = () => {
  let valid = true;
  const amount = parseAmount(el.fromAmount.value);

  // Clear previous errors
  el.fromError.textContent = '';
  el.toError.textContent = '';

  // Check if tokens are selected
  if (!state.from || !state.to) {
    el.fromError.textContent = '⚠️ Please select both tokens to continue';
    valid = false;
    return valid;
  }

  // Check if same token
  if (state.from === state.to) {
    el.fromError.textContent = '⚠️ Cannot swap same token. Please select different tokens';
    valid = false;
    return valid;
  }

  // Check amount validity
  if (!el.fromAmount.value || el.fromAmount.value.trim() === '') {
    el.fromError.textContent = '⚠️ Please enter an amount to swap';
    valid = false;
    return valid;
  }

  if (!amount || amount <= 0 || !Number.isFinite(amount)) {
    el.fromError.textContent = '⚠️ Please enter a valid positive number';
    valid = false;
    return valid;
  }

  // Check if amount is too small
  if (amount < 0.000001) {
    el.fromError.textContent = '⚠️ Amount is too small. Minimum: 0.000001';
    valid = false;
    return valid;
  }

  // Check balance
  const balance = state.balances[state.from] || 0;
  if (amount > balance) {
    el.fromError.textContent = `⚠️ Insufficient balance. Available: ${formatNumber(balance, 6)} ${state.from}`;
    valid = false;
    return valid;
  }

  // Check if prices are available
  if (!state.prices[state.from] || !state.prices[state.to]) {
    el.fromError.textContent = '⚠️ Price data unavailable. Please refresh';
    valid = false;
    return valid;
  }

  // Check maximum amount (prevent overflow)
  const MAX_AMOUNT = 1000000000;
  if (amount > MAX_AMOUNT) {
    el.fromError.textContent = `⚠️ Amount exceeds maximum. Max: ${formatNumber(MAX_AMOUNT)}`;
    valid = false;
    return valid;
  }

  return valid;
};
const setMenuPosition = (target) => {
  if (!target || !el.menu) return;

  const rect = target.getBoundingClientRect();
  const menuWidth = 320; // From CSS
  const menuHeight = 420; // Max height from CSS
  const padding = 16;

  // Calculate position
  let left = rect.left;
  let top = rect.bottom + 12;

  // Ensure menu doesn't go off screen horizontally
  if (left + menuWidth > window.innerWidth - padding) {
    left = window.innerWidth - menuWidth - padding;
  }
  left = Math.max(padding, left);

  // Ensure menu doesn't go off screen vertically
  if (top + menuHeight > window.innerHeight - padding) {
    top = rect.top - menuHeight - 12; // Show above if not enough space below
  }

  // Reset all position values
  el.menu.style.position = 'fixed';
  el.menu.style.inset = 'auto';
  el.menu.style.left = `${left}px`;
  el.menu.style.top = `${top}px`;
  el.menu.style.right = 'auto';
  el.menu.style.bottom = 'auto';
};
const renderMenu = (filter = '') => {
  if (!el.tokenList) {
    console.error('Token list element not found');
    return;
  }

  const query = filter.trim().toLowerCase();
  el.tokenList.innerHTML = '';

  const filteredTokens = state.tokens.filter((token) =>
    token.toLowerCase().includes(query)
  );

  if (filteredTokens.length === 0) {
    el.tokenList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);">No tokens found</div>';
    return;
  }

  filteredTokens.forEach((token) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'token-option';
    option.setAttribute('role', 'option');
    option.innerHTML = ` <img class="token-icon" src="${tokenIcon(token)}" alt="${token} token" /> <div> <strong>${token}</strong> <span>$${formatNumber(state.prices[token], 4)}</span> </div> `;
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentSide = state.activeMenu;
      setToken(currentSide, token);
      setTimeout(() => closeMenu(), 0);
    });
    el.tokenList.appendChild(option);
  });
};
const openMenu = (side, target) => {
  console.log('Opening menu for:', side);

  // Validate menu element exists
  if (!el.menu) {
    console.error('Menu element not found');
    return;
  }

  // Check if tokens are loaded
  if (!state.tokens || state.tokens.length === 0) {
    console.warn('No tokens available yet');
    return;
  }

  state.activeMenu = side;
  setMenuPosition(target);
  el.menu.classList.add('show');

  if (el.tokenSearch) {
    el.tokenSearch.value = '';
  }

  renderMenu();

  // Focus search input after a short delay to ensure menu is rendered
  setTimeout(() => {
    if (el.tokenSearch) {
      el.tokenSearch.focus();
    }
  }, 50);
};
const closeMenu = () => {
  el.menu.classList.remove('show');
  state.activeMenu = null;
};
const toggleLoading = (loading) => {
  state.loading = loading;
  el.submitBtn.classList.toggle('loading', loading);
  el.submitBtn.disabled = loading;
  el.submitText.textContent = loading ? 'Swapping...' : 'Confirm Swap';
};
const swapTokens = () => {
  const temp = state.from;
  state.from = state.to;
  state.to = temp;
  setToken('from', state.from);
  setToken('to', state.to);
};

const renderTokenChips = (updatedTokens = []) => {
  if (!el.tokenChips) return;

  // Sort tokens by balance (highest first) and limit to top tokens
  const sortedTokens = [...state.tokens]
    .sort((a, b) => (state.balances[b] || 0) - (state.balances[a] || 0))
    .slice(0, 12); // Show top 12 tokens

  el.tokenChips.innerHTML = '';

  sortedTokens.forEach((token) => {
    const balance = state.balances[token] || 0;
    const chip = document.createElement('div');
    chip.className = 'token-chip';
    chip.setAttribute('data-token', token);

    // Add updated class if this token was just updated
    if (updatedTokens.includes(token)) {
      chip.classList.add('updated');
      // Remove updated class after animation
      setTimeout(() => chip.classList.remove('updated'), 600);
    }

    chip.innerHTML = `
      <img class="token-chip__icon" src="${tokenIcon(token)}" alt="${token}" />
      <span class="token-chip__name">${token}</span>
      <span class="token-chip__amount">${formatNumber(balance, 2)}</span>
    `;

    el.tokenChips.appendChild(chip);
  });
};
// Debounce helper
let validationTimeout;
const debounceValidation = (callback, delay = 300) => {
  return function (...args) {
    clearTimeout(validationTimeout);
    validationTimeout = setTimeout(() => callback.apply(this, args), delay);
  };
};

el.fromAmount.addEventListener('input', () => {
  updateOutputs();
  // Add visual feedback for typing
  el.fromAmount.parentElement.classList.add('input-active');
  setTimeout(() => {
    el.fromAmount.parentElement.classList.remove('input-active');
  }, 200);
});

el.fromAmount.addEventListener('input', debounceValidation(() => {
  validate();
}, 500));

el.fromAmount.addEventListener('blur', () => {
  validate();
});

// Prevent invalid input characters
el.fromAmount.addEventListener('keypress', (e) => {
  const char = e.key;
  const currentValue = e.target.value;

  // Allow: numbers, decimal point, backspace, delete, arrow keys
  if (!/[\d.]/.test(char) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
    e.preventDefault();
    return;
  }

  // Prevent multiple decimal points
  if (char === '.' && currentValue.includes('.')) {
    e.preventDefault();
    return;
  }

  // Prevent leading zeros (except for decimal numbers like 0.5)
  if (char === '0' && currentValue === '' && e.target.selectionStart === 0) {
    // Allow if next char will be decimal
    return;
  }
});
el.swapBtn.addEventListener('click', () => {
  swapTokens();
});
el.fromSelect.addEventListener('click', (event) => {
  event.stopPropagation();
  openMenu('from', event.currentTarget);
});
el.toSelect.addEventListener('click', (event) => {
  event.stopPropagation();
  openMenu('to', event.currentTarget);
});
el.fromSelect.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openMenu('from', event.currentTarget);
  }
});
el.toSelect.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openMenu('to', event.currentTarget);
  }
});
el.tokenSearch.addEventListener('input', (event) => {
  renderMenu(event.target.value);
});
el.menu.addEventListener('click', (event) => {
  event.stopPropagation();
});
document.addEventListener('click', () => {
  if (el.menu.classList.contains('show')) {
    closeMenu();
  }
});
el.form.addEventListener('submit', (event) => {
  event.preventDefault();
  el.formStatus.textContent = '';

  if (!validate()) {
    el.form.classList.add('shake');
    setTimeout(() => el.form.classList.remove('shake'), 500);
    return;
  }

  toggleLoading(true);

  // Simulate transaction
  window.setTimeout(() => {
    toggleLoading(false);

    // Update balances after swap
    const fromAmount = parseAmount(el.fromAmount.value);
    const toAmount = parseAmount(el.toAmount.value);

    if (state.balances[state.from] !== undefined) {
      state.balances[state.from] -= fromAmount;
    }
    if (state.balances[state.to] !== undefined) {
      state.balances[state.to] += toAmount;
    }

    // Update balance displays
    setToken('from', state.from);
    setToken('to', state.to);

    // Update token chips with animation for changed tokens
    renderTokenChips([state.from, state.to]);

    el.formStatus.textContent = `✅ Swap completed: ${formatNumber(fromAmount, 6)} ${state.from} → ${formatNumber(toAmount, 6)} ${state.to}`;
    el.formStatus.style.color = 'var(--success)';
    el.form.classList.add('success-pulse');

    // Clear form
    el.fromAmount.value = '';
    updateOutputs();

    setTimeout(() => {
      el.formStatus.textContent = '';
      el.form.classList.remove('success-pulse');
    }, 5000);
  }, 1500);
});
el.refreshBtn.addEventListener('click', async () => {
  el.refreshBtn.disabled = true;
  el.refreshBtn.classList.add('loading');
  el.formStatus.textContent = '🔄 Refreshing prices...';
  el.formStatus.style.color = 'var(--accent)';

  try {
    await init();
    el.formStatus.textContent = '✅ Prices updated successfully';
    el.formStatus.style.color = 'var(--success)';
    setTimeout(() => {
      el.formStatus.textContent = '';
    }, 3000);
  } catch (error) {
    el.formStatus.textContent = '❌ Failed to refresh prices. Please try again';
    el.formStatus.style.color = 'var(--danger)';
  } finally {
    el.refreshBtn.disabled = false;
    el.refreshBtn.classList.remove('loading');
  }
});
const init = async () => {
  try {
    await loadPrices();
    if (!state.tokens.length) {
      el.formStatus.textContent = '❌ No tokens available. Please check your connection.';
      el.formStatus.style.color = 'var(--danger)';
      return;
    }
    const [first, second] = state.tokens;
    setToken('from', state.from || first);
    setToken('to', state.to || second || state.tokens[1] || first);
    updateRate();
    updateOutputs();
    renderTokenChips();
  } catch (error) {
    el.formStatus.textContent = '❌ Failed to initialize. Please refresh the page.';
    el.formStatus.style.color = 'var(--danger)';
    console.error('Initialization error:', error);
  }
};

// Initialize app
init().catch(err => {
  console.error('Failed to initialize app:', err);
});
