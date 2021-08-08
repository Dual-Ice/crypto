const API_KEY =
	"f0f1310977798a0f65fdfd650d57f6e36c453a03d90e358ea1834d873a451c38";
const AGGREGATE_INDEX = "5";
const MESSAGE = "INVALID_SUB";
const ERROR_INDEX = "500";

const tickersHandlers = new Map();
const socket = new WebSocket(
	`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", (event) => {
	const {
		TYPE: type,
		PRICE: newPrice,
		MESSAGE: message,
		FROMSYMBOL: currency
	} = JSON.parse(event.data);

	if (type === ERROR_INDEX && message === MESSAGE) {
		const {
			PARAMETER: pair
		} = JSON.parse(event.data)

		const currency = pair.match(/\d+~[A-Z]{1,6}~(?<coin>[A-Z]+)~USD/).groups.coin;
		const handlers = tickersHandlers.get(currency) ?? [];
		handlers.forEach((handler) => handler('-', false));
		return;
	}

	if (type !== AGGREGATE_INDEX || !newPrice) {
		return;
	}

	const handlers = tickersHandlers.get(currency) ?? [];
	handlers.forEach((handler) => handler(newPrice));
});

export const loadCoins = () =>
	fetch(
		"https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
	).then((r) => r.json());


// TODO: Broadcast channel чтобы работало более чем  одной вкладке
function sendMessageToWS(message) {
	const stringifiedMessage = JSON.stringify(message);

	if (socket.readyState === WebSocket.OPEN) {
		socket.send(stringifiedMessage);
		return;
	}

	socket.addEventListener("open", () => socket.send(stringifiedMessage), {
		once: true
	});
}

function subscribeToTickerOnWS(ticker) {
	const message = {
		action: "SubAdd",
		subs: [`5~CCCAGG~${ticker}~USD`]
	};
	sendMessageToWS(message);
}

function unSubscribeFromTickerOnWS(ticker) {
	const message = {
		action: "SubRemove",
		subs: [`5~CCCAGG~${ticker}~USD`]
	};

	sendMessageToWS(message);
}

export const subscribeToTicker = (ticker, cb) => {
	const subscribers = tickersHandlers.get(ticker) || [];
	tickersHandlers.set(ticker, [...subscribers, cb]);
	subscribeToTickerOnWS(ticker);
};

export const unSubscribeFromTicker = (ticker) => {
	tickersHandlers.delete(ticker);
	unSubscribeFromTickerOnWS(ticker);
};