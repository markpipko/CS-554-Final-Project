const express = require("express");
const bluebird = require("bluebird");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const data = require("../data");
const jobsData = data.jobs;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.post("/search", async (req, res, next) => {
	let searchReq = req.body;

	if (
		!searchReq.query ||
		typeof searchReq.query !== "string" ||
		!searchReq.query.trim()
	) {
		return res
			.status(400)
			.json({ error: "Query not provided or not of proper type" });
	}
	if (
		!searchReq.zip ||
		typeof searchReq.zip !== "string" ||
		!searchReq.zip.trim()
	) {
		return res
			.status(400)
			.json({ error: "Zip not provided or not of proper type" });
	}
	if (
		!searchReq.jobType ||
		typeof searchReq.jobType !== "string" ||
		!searchReq.jobType.trim()
	) {
		return res
			.status(400)
			.json({ error: "Job Type not provided or not of proper type" });
	}
	let cachedPage = await client.getAsync(
		`query: ${searchReq.query}, zip: ${searchReq.zip}, jobType: ${searchReq.jobType}`
	);
	if (cachedPage) {
		return res.status(200).send(JSON.parse(cachedPage));
	} else {
		next();
	}
});

router.post("/search", async (req, res) => {
	let searchReq = req.body;

	if (
		!searchReq.query ||
		typeof searchReq.query !== "string" ||
		!searchReq.query.trim()
	) {
		return res
			.status(400)
			.json({ error: "Query not provided or not of proper type" });
	}
	if (
		!searchReq.zip ||
		typeof searchReq.zip !== "string" ||
		!searchReq.zip.trim()
	) {
		return res
			.status(400)
			.json({ error: "Zip not provided or not of proper type" });
	}
	if (
		!searchReq.jobType ||
		typeof searchReq.jobType !== "string" ||
		!searchReq.jobType.trim()
	) {
		return res
			.status(400)
			.json({ error: "Job Type not provided or not of proper type" });
	}

	try {
		const jobsPage = await jobsData.searchJobs(
			searchReq.query,
			searchReq.zip,
			searchReq.jobType
		);
		let status = await client.setAsync(
			`query: ${searchReq.query}, zip: ${searchReq.zip}, jobType: ${searchReq.jobType}`,
			JSON.stringify(jobsPage),
			"EX",
			300
		);

		return res.status(200).send(jobsPage);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: e });
	}
});

module.exports = router;
