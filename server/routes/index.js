const jobsRoutes = require("./jobs");

const constructorMethod = (app) => {
	app.use("/jobs", jobsRoutes);
	app.use("*", (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;
