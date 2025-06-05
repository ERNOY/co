
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

let stakes = [];
let insurances = [];
let exchangeRates = {
  BUBO_USD: 0.18,
  USD_EUR: 0.95,
  BUBO_EUR: 0.18 * 0.95
};

app.post('/api/stake', (req, res) => {
  const { user, amount, durationMonths } = req.body;
  if (!user || !amount || !durationMonths) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  const stake = {
    id: stakes.length + 1,
    user,
    amount,
    durationMonths,
    startDate: new Date(),
    status: 'active',
  };
  stakes.push(stake);
  res.json({ message: 'Stake successful', stake });
});

app.post('/api/insurance', (req, res) => {
  const { user, coverageAmount } = req.body;
  if (!user || !coverageAmount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  const insurance = {
    id: insurances.length + 1,
    user,
    coverageAmount,
    startDate: new Date(),
    status: 'active',
  };
  insurances.push(insurance);
  res.json({ message: 'Insurance purchased', insurance });
});

app.post('/api/exchange', (req, res) => {
  const { fromCurrency, toCurrency, amount } = req.body;
  if (!fromCurrency || !toCurrency || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  let rateKey = `${fromCurrency}_${toCurrency}`;
  let rate = exchangeRates[rateKey];
  if (!rate) {
    return res.status(400).json({ error: 'Exchange rate not found for this pair' });
  }
  const exchangedAmount = amount * rate;
  res.json({ fromCurrency, toCurrency, originalAmount: amount, exchangedAmount, rate });
});

app.get('/api/stakes', (req, res) => {
  res.json(stakes);
});

app.get('/api/insurances', (req, res) => {
  res.json(insurances);
});

app.listen(port, () => {
  console.log(`Mock backend listening at http://localhost:${port}`);
});
