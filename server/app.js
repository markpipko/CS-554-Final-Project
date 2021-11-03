const express = require("express");
const app = express();
const configRoutes = require("./routes");

app.use(express.json());

const port = 5000;

configRoutes(app);

app.listen(port, () => {
	console.log("We've now got a server!");
	console.log(`Your routes will now be running on http://localhost:${port}`);
});
