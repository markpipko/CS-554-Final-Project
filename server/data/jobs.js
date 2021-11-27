const axios = require("axios");
const indeed = require("indeed-scraper");
const zipcode = require("zipcode");
const exportedMethods = {
	async searchJobs(query, zip, jobType) {
		if (!query) {
			throw "Query not provided";
		}
		if (typeof query !== "string") {
			throw "Query not of type string";
		}
		query = query.trim();
		if (!query) {
			throw "Query is empty";
		}

		if (!zip) {
			throw "Zip not provided";
		}
		if (typeof zip !== "string") {
			throw "Zip not of type string";
		}
		zip = zip.trim();
		if (!zip) {
			throw "Zip is empty";
		}

		let location = zipcode.lookup(zip);
		if (!location) {
			throw "Cannot find your zip code";
		}

		if (!jobType) {
			throw "Job type not provided";
		}
		if (typeof jobType !== "string") {
			throw "Job type not of type string";
		}
		jobType = jobType.trim();
		if (!jobType) {
			throw "Job type is empty";
		}
		const queryOptions = {
			host: "www.indeed.com",
			query: query,
			city: `${location[0]}, ${location[1]}`,
			radius: "25",
			level: jobType,
			jobType: "fulltime",
			maxAge: "7",
			sort: "date",
			limit: 100,
		};

		let res = await indeed.query(queryOptions);
		if (!res) {
			throw "No results found";
		}
		return JSON.stringify(res);
	},
};

module.exports = exportedMethods;
