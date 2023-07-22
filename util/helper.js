const generateDeck = () => {
	const suits = ["S", "C", "D", "H"];
	const ranks = [2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K", "A"];

	return suits.map((suit) => ranks.map((rank) => rank + suit)).flat(1);
};

const getCardValue = (card) => {
	const rank = card[0].toUpperCase();
	switch (rank) {
		case "2":
			return 2;
		case "3":
			return 3;
		case "4":
			return 4;
		case "5":
			return 5;
		case "6":
			return 6;
		case "7":
			return 7;
		case "8":
			return 8;
		case "9":
			return 9;
		case "T":
			return 10;
		case "J":
			return 11;
		case "Q":
			return 12;
		case "K":
			return 13;
		case "A":
			return 14;
		default:
			throw Error(`Unknown rank: "${rank}"`);
	}
};

const getGroups = (hand) => {
	const groups = [];

	for (const card of hand) {
		let newGroup = true;
		// loop through all previous groups
		for (const group of groups) {
			// check if card has same value as first card in group
			if (getCardValue(card) === getCardValue(group[0])) {
				group.push(card);
				newGroup = false;
			}
		}
		// if card doesn't belong to group, create new group
		newGroup && groups.push([card]);
	}

	return groups;
};

const getNthGroup = (n, groups) => {
	const res = [];
	for (const group of groups) if (group.length === n) res.push(group);
	return res;
};

const sortHand = (hand) => {
	for (let i = 0; i < hand.length; i++) {
		for (let j = 0; j < hand.length; j++) {
			if (i !== j && getCardValue(hand[i]) < getCardValue(hand[j])) {
				const temp = hand[i];
				hand[i] = hand[j];
				hand[j] = temp;
			}
		}
	}

	// 5-high straight exception
	if (
		getCardValue(hand[0]) === 2 &&
		getCardValue(hand[1]) === 3 &&
		getCardValue(hand[2]) === 4 &&
		getCardValue(hand[3]) === 5 &&
		getCardValue(hand[4]) === 14
	) {
		const sorted = [hand[4]].concat([...hand.slice(0, 4)]);
		for (let i = 0; i < sorted.length; i++) hand[i] = sorted[i];
	}
};

const checkIsStraight = (hand) => {
	sortHand(hand);

	// 5-high straight exeption
	if (
		getCardValue(hand[0]) === 14 &&
		getCardValue(hand[1]) === 2 &&
		getCardValue(hand[2]) === 3 &&
		getCardValue(hand[3]) === 4 &&
		getCardValue(hand[4]) === 5
	)
		return true;

	// check if cards increment by 1
	for (let i = 0; i < hand.length - 1; i++)
		if (getCardValue(hand[i]) !== getCardValue(hand[i + 1]) - 1)
			return false;

	return true;
};

const checkIsFlush = (hand) => {
	for (let i = 1; i < hand.length; i++)
		if (hand[i][1].toUpperCase() !== hand[0][1].toUpperCase()) return false;
	return true;
};

const determineHand = (hand) => {
	const isStraight = checkIsStraight(hand);
	const isFlush = checkIsFlush(hand);
	const groups = getGroups(hand);
	const quads = getNthGroup(4, groups);
	const trips = getNthGroup(3, groups);
	const pairs = getNthGroup(2, groups);
	const singles = getNthGroup(1, groups);
	let score = -1;

	if (isStraight && isFlush) {
		// royal flush
		if (getCardValue(hand[3]) === 13 && getCardValue(hand[4]) === 14) {
			score = 10000;
			return {
				hand,
				result: "royal flush",
				score,
			};
		}

		// straight flush
		score = 9000 + getCardValue(hand[4]);
		return {
			hand,
			result: "straight flush",
			score,
		};
	}

	// quads
	if (quads.length === 1) {
		score = 8000 + getCardValue(hand[4]);
		return {
			hand,
			result: "four of a kind",
			score,
		};
	}

	// full house
	if (trips.length === 1 && pairs.length === 1) {
		score =
			7000 + 15 * getCardValue(trips[0][0]) + getCardValue(pairs[0][0]);
		return {
			hand,
			result: "full house",
			score,
		};
	}

	// flush
	if (isFlush) {
		score = 6000 + getCardValue(hand[4]);
		return {
			hand,
			result: "flush",
			score,
		};
	}

	// straight
	if (isStraight) {
		score = 5000 + getCardValue(hand[4]);
		return {
			hand,
			result: "straight",
			score,
		};
	}

	// trips
	if (trips.length === 1) {
		score =
			4000 +
			15 * getCardValue(trips[0][0]) +
			getCardValue(singles[1][0]) +
			getCardValue(singles[0][0]) / 15;
		return {
			hand,
			result: "three of a kind",
			score,
		};
	}

	// two pair
	if (pairs.length === 2) {
		score =
			3000 +
			15 * getCardValue(pairs[1][0]) +
			getCardValue(pairs[0][0]) +
			getCardValue(singles[0][0]) / 15;
		return {
			hand,
			result: "two pair",
			score,
		};
	}

	// one pair
	if (pairs.length === 1) {
		score =
			2000 +
			15 * getCardValue(pairs[0][0]) +
			getCardValue(singles[2][0]) +
			getCardValue(singles[1][0]) / 15 +
			getCardValue(singles[0][0]) / 225;
		return {
			hand,
			result: "one pair",
			score,
		};
	}

	// high card
	if (singles.length === 5) {
		score =
			1000 +
			15 * getCardValue(singles[4][0]) +
			getCardValue(singles[3][0]) +
			getCardValue(singles[2][0]) / 15 +
			getCardValue(singles[1][0]) / 225 +
			getCardValue(singles[0][0]) / 3375;
		return {
			hand,
			result: "high card",
			score,
		};
	}

	throw Error(`Unknown hand: ${hand}`);
};

const findCombinations = async (cards, k) => {
	const result = [];

	const backtrack = (start, currentCombo) => {
		if (currentCombo.length === k) {
			result.push([...currentCombo]);
			return;
		}

		for (let i = start; i < cards.length; i++) {
			currentCombo.push(cards[i]);
			backtrack(i + 1, currentCombo);
			currentCombo.pop();
		}
	};

	backtrack(0, []);
	return result;
};

const findPlayerBestHand = async (community, player) => {
	const combinations = await findCombinations([...community, ...player], 5);
	let best = determineHand(combinations[0]);

	for (const hand of combinations) {
		const res = determineHand(hand);
		if (res.score > best.score) best = res;
	}

	return best;
};

module.exports = {
	generateDeck,
	getCardValue,
	getGroups,
	sortHand,
	checkIsStraight,
	checkIsFlush,
	determineHand,
	findCombinations,
	findPlayerBestHand,
};
