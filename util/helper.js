const generateDeck = () => {
	const suits = ["S", "C", "D", "H"];
	const ranks = [2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K", "A"];

	return suits.map((suit) => ranks.map((rank) => rank + suit)).flat(1);
};

const determineHand = (community, player) => {
	console.log(community, player);
};

module.exports = { generateDeck, determineHand };
