const { generateDeck } = require("../util/helper");

class Deck {
	constructor() {
		this.cards = generateDeck();
	}

	deal() {
		if (this.cards.length === 0) throw Error("Deck is empty.");
		return this.cards.splice(
			Math.floor(Math.random() * this.cards.length),
			1
		);
	}

	select(target) {
		const card = this.cards.filter((card) => card === target);
		if (card.length === 0) throw Error("Card does not exist.");
		this.cards = this.cards.filter((card) => card !== target);
		return card[0];
	}
}

module.exports = Deck;
