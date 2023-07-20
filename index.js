const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/", require("./api/health"));
app.use("/simulate", require("./api/simulate"));

app.use((err, req, res, next) => {
	res.status(500).json({ error: "Internal Server Error", details: err });
});

app.listen(PORT, (err) => {
	if (!err) {
		console.log(`Server running on port ${PORT}`);
	} else {
		console.log(`Error occured: ${err}`);
	}
});
