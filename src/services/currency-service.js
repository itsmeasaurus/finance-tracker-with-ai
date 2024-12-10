class CurrencyService {
  constructor() {
    this.apiKey = 'cur_live_tDwcggCIChnUxebP85IpQyzBgLmi8V7TnbugVYd1';
    this.symbols = {
      USD: '$',
      EUR: '€',
      CAD: 'CA$'
    };
  }

  async getExchangeRates() {
    try {
      const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${this.apiKey}&currencies=EUR,USD,CAD&base_currency=USD`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return null;
    }
  }

  getCurrencySymbol(currency) {
    return this.symbols[currency] || '$';
  }
}

export const currencyService = new CurrencyService(); 