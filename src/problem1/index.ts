
// loop use
const sum_to_n_a = (n: number): number => {
  if (n === 0) {
    return 0;
  }

  let sum = 0;
  const step = n > 0 ? 1 : -1;

  for (let i = 1; step > 0 ? i <= n : i >= n; i += step) {
    sum += i;
  }

  return sum;
};

// serial formula use
const sum_to_n_b = (n: number): number => {
  return (n * (n + (n > 0 ? 1 : -1))) / 2;
};

// recursive use
const sum_to_n_c = (n: number): number => {
  if (n === 0) {
    return 0;
  }

  const step = n > 0 ? 1 : -1;
  return n + sum_to_n_c(n - step);
};

export { sum_to_n_a, sum_to_n_b, sum_to_n_c };
