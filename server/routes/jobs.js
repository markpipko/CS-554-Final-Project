const express = require("express");
const bluebird = require("bluebird");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const data = require("../data");
const jobsData = data.jobs;
const applyData = data.apply;
const {
	getUserById,
	authenticate,
	apply,
	updateStatus,
} = require("../firebase/firebase");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.post("/search", authenticate, async (req, res, next) => {
	let uid = await getUserById(req.headers.token);
	if (!uid) {
		return res.status(403).json({ error: "User is not authenticated" });
	}
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

router.post("/search", authenticate, async (req, res) => {
	let uid = await getUserById(req.headers.token);
	if (!uid) {
		return res.status(403).json({ error: "User is not authenticated" });
	}
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

router.post("/apply", authenticate, async (req, res) => {
	let applyReq = req.body;
	let uid = await getUserById(req.headers.token);
	if (!uid) {
		return res.status(403).json({ error: "User is not authenticated" });
	}

	if (
		!applyReq.jobUid ||
		typeof applyReq.jobUid !== "string" ||
		!applyReq.jobUid.trim()
	) {
		return res
			.status(400)
			.json({ error: "Job uid not provided or not of proper type" });
	}

	try {
		let companyEmail = await apply(uid, applyReq.jobUid);

		let status = await applyData.sendEmail(
			companyEmail,
			"New Application Received",
			"A user on Jobaroo has just applied to your job post. Check Jobaroo for more details"
		);
		return res.status(200).json({ message: "success" });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: e });
	}
});

router.post("/changeStatus", authenticate, async (req, res) => {
	let statusReq = req.body;
	let uid = await getUserById(req.headers.token);
	if (!uid) {
		return res.status(403).json({ error: "User is not authenticated" });
	}

	if (
		!statusReq.jobUid ||
		typeof statusReq.jobUid !== "string" ||
		!statusReq.jobUid.trim()
	) {
		return res
			.status(400)
			.json({ error: "Job uid not provided or not of proper type" });
	}

	if (
		!statusReq.userUid ||
		typeof statusReq.userUid !== "string" ||
		!statusReq.userUid.trim()
	) {
		return res
			.status(400)
			.json({ error: "User uid not provided or not of proper type" });
	}

	if (
		!statusReq.decision ||
		typeof statusReq.decision !== "string" ||
		!statusReq.decision.trim()
	) {
		return res
			.status(400)
			.json({ error: "Decision not provided or not of proper type" });
	}
	if (statusReq.decision != "accept" && statusReq.decision != "deny") {
		return res.status(400).json({ error: "Decision not specified" });
	}

	try {
		let userEmail = await updateStatus(
			statusReq.jobUid,
			statusReq.userUid,
			statusReq.decision
		);

		let status = await applyData.sendEmail(
			userEmail,
			"Application Update",
			"One of your applications recently had a status update. Check Jobaroo for more details"
		);
		return res.status(200).json({ message: "success" });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

module.exports = router;
