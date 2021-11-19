const express = require("express");
const bluebird = require("bluebird");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const data = require("../data");
const jobsData = data.jobs;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// router.get("/page/:page", async (req, res, next) => {
// 	let page = req.params.page;
// 	if (!page) {
// 		return res.status(400).json({ error: "Page number not provided" });
// 	}
// 	let cachedPage = await client.getAsync(`job page: ${page}`);
// 	if (cachedPage) {
// 		return res.status(200).json(JSON.parse(cachedPage));
// 	} else {
// 		next();
// 	}
// });

router.post("/page/:page", async (req, res) => {
	let page = req.params.page;
	let searchReq = req.body;
	if (!page) {
		return res.status(400).json({ error: "Page number not provided" });
	}
	if (
		!searchReq.query ||
		typeof searchReq.query !== "string" ||
		!searchReq.query.trim()
	) {
		return res
			.status(400)
			.json({ error: "Query not provided or not of proper type" });
	}
	try {
		const jobsPage = await jobsData.getPage(
			page,
			searchReq.query,
			searchReq.zip,
			searchReq.jobType
		);
		let status = await client.setAsync(
			`job page: ${page}`,
			JSON.stringify(jobsPage)
		);
		return res.status(200).send(jobsPage);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: e });
	}
});

module.exports = router;
