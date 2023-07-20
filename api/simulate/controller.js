const Deck = require("../../deck/Deck");

const simulateHand = (req, res) => {
	const { community, players } = req.body;

	// error handling
	if (!community || community.length !== 5) {
		return res.status(400).json({
			error: "Community cards not found.",
			details: "Please provide 5 community cards.",
		});
	}
	if (!players || players.length === 0) {
		return res.status(400).json({
			error: "Player error.",
			details: "Please provide at least 1 player.",
		});
	}

	// create new deck
	const deck = new Deck();

	// check all cards to see if valid
	try {
		for (const card of community) deck.select(card.toUpperCase());
		for (const player of players)
			for (const card of player) deck.select(card.toUpperCase());
	} catch (err) {
		return res.status(400).json({ message: "Invalid cards." });
	}

	res.json({ ok: true });
};

module.exports = {
	simulateHand,
};
