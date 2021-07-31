const API_KEY = 'f0f1310977798a0f65fdfd650d57f6e36c453a03d90e358ea1834d873a451c38';
const tickersHandlers = new Map();

const loadTickers = () => {
	if (tickersHandlers.size === 0) {
		return
	}

	fetch(
	  `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(',')}&tsyms=USD&api_key=${API_KEY}`
	)
	.then(r =>r.json())
  .then(rawData => {
  	const updatedPrices =	Object.fromEntries(
  		Object.entries(rawData)
	  		.map(([key, value]) => [key, value.USD]))
  	Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
  		const handlers = tickersHandlers.get(currency) ?? [];
  		handlers.forEach(handler => handler(newPrice));
  	})
  });
}

// REST API	
// export const loadTickers = tickers => 
// 	fetch(
// 	  `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers}&tsyms=USD&api_key=${API_KEY}`
// 	)
// 	.then(r =>r.json())
//   .then(rawData => 
//   	Object.fromEntries(
//   		Object.entries(rawData)
// 	  		.map(([key, value]) => [key, value.USD]))
// 	);

export const loadCoins = () =>
	fetch(
      "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  )
  .then(r => r.json());

export const subscribeToTicker = (ticker, cb) => {
	const subscribers = tickersHandlers.get(ticker) || [];
	tickersHandlers.set(ticker, [...subscribers, cb]);
} 

export const unSubscribeFromTicker = (ticker) => {
	tickersHandlers.delete(ticker);
} 

setInterval(loadTickers, 3000);