const express = require("express");
const app = express();
const configRoutes = require("./routes");

app.use(express.json());

const port = 4000;

configRoutes(app);

app.listen(port, () => {
	console.log(`Your routes will now be running on http://localhost:${port}`);
});
