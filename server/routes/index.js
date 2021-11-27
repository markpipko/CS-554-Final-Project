const jobsRoutes = require("./jobs");
const imageRoute = require("./image");
const constructorMethod = (app) => {
	app.use("/jobs", jobsRoutes);
	app.use("/image", imageRoute);
	app.use("*", (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;
