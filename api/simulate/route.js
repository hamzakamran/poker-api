const { simulateHand } = require("./controller");

const router = require("express").Router();

router.post("/", simulateHand);

module.exports = router;
