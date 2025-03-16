function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const a1 = 0.31938153;
  const a2 = -0.356563782;
  const a3 = 1.781477937;
  const a4 = -1.821255978;
  const a5 = 1.330274429;
  let prob =
    1 -
    ((a1 * t +
      a2 * Math.pow(t, 2) +
      a3 * Math.pow(t, 3) +
      a4 * Math.pow(t, 4) +
      a5 * Math.pow(t, 5)) *
      Math.exp(-Math.pow(x, 2) / 2)) /
      Math.sqrt(2 * Math.PI);
  if (x < 0) {
    prob = 1 - prob;
  }
  return prob;
}

function blackScholes(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  optionType: 'call' | 'put',
): number {
  const d1 =
    (Math.log(S / K) + (r + Math.pow(sigma, 2) / 2) * T) /
    (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  if (optionType === 'call') {
    return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  } else if (optionType === 'put') {
    return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  } else {
    throw new Error("Invalid option type. Must be 'call' or 'put'.");
  }
}

// Example usage:
const S = 20.64; // Current stock price
const K = 21; // Strike price
const T = 6 / 52; // Time to expiration in years
const r = 0.05; // Risk-free interest rate
const sigma = 0.6; // Volatility
const callPrice = blackScholes(S, K, T, r, sigma, 'call');
const putPrice = blackScholes(S, K, T, r, sigma, 'put');

console.log('Call option price:', callPrice);
console.log('Put option price:', putPrice);
