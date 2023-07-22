const Deck = require("../../deck/Deck");
const {
	determineHand,
	findCombinations,
	findPlayerBestHand,
} = require("../../util/helper");

const simulateHand = async (req, res) => {
	const { community: preCommunity, players: prePlayers } = req.body;

	// error handling
	if (!preCommunity || preCommunity.length !== 5) {
		return res.status(400).json({
			error: "Community cards error.",
			details: "Please provide 5 community cards.",
		});
	}
	if (!prePlayers || prePlayers.length === 0) {
		return res.status(400).json({
			error: "Player error.",
			details: "Please provide at least 1 player.",
		});
	}

	// format data
	const community = preCommunity.map((card) => card.toUpperCase());
	const players = prePlayers.map((player) =>
		player.map((card) => card.toUpperCase())
	);

	try {
		// by default, make community cards best hand
		const playerBestHands = [];

		// check all cards to see if valid
		const deck = new Deck();
		for (const card of community) {
			deck.select(card);
		}
		for (const player of players) {
			for (const card of player) {
				deck.select(card.toUpperCase());
			}
			// find best hand for each player
			const playerBestHand = await findPlayerBestHand(community, player);
			playerBestHands.push(playerBestHand);
		}

		// determine best hands overall
		const initialBest = playerBestHands[0];
		const best = [
			{
				cards: players[0],
				...initialBest,
			},
		];
		for (let i = 1; i < players.length; i++) {
			if (playerBestHands[i].score > best[0].score) {
				best = [
					{
						cards: players[i],
						...playerBestHands[i],
					},
				];
			} else if (playerBestHands[i].score === best[0].score) {
				best.push({
					cards: players[i],
					...playerBestHands[i],
				});
			}
		}

		return res.json({
			winners: best.map((hand) => ({
				cards: hand.cards,
				hand: hand.hand,
				result: hand.result,
			})),
			players: playerBestHands.map((hand, index) => ({
				cards: players[index],
				hand: hand.hand,
				result: hand.result,
			})),
		});
	} catch (err) {
		console.log("Error: " + err.message);
		return res.status(400).json({ message: "Invalid cards." });
	}
};

module.exports = {
	simulateHand,
};
