const api_key = 'f0f1310977798a0f65fdfd650d57f6e36c453a03d90e358ea1834d873a451c38';


export const loadTickers = tickers => 
	fetch(
	  `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers}&tsyms=USD&api_key=${api_key}`
	)
	.then(r =>r.json())
  .then(rawData => 
  	Object.fromEntries(
  		Object.entries(rawData)
	  		.map(([key, value]) => [key, value.USD]))
	);

export const loadCoins = () =>
	fetch(
      "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  )
  .then(r => r.json());
