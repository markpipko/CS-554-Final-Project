const axios = require("axios");
const indeed = require("indeed-scraper");
const zipcode = require("zipcode");
const exportedMethods = {
	async getPage(page, query, zip, jobType) {
		if (!page) {
			throw "Page not provided";
		}
		if (typeof page !== "string") {
			throw "Page not of type string";
		}
		page = page.trim();
		if (!page) {
			throw "Page is empty";
		}
		if (page < 0) {
			throw "Page cannot be negative";
		}

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
			limit: 20,
		};

		let res = await indeed.query(queryOptions);
		if (!res) {
			throw "No results found";
		}
		return JSON.stringify(res);

		// let options = {
		// 	method: "GET",
		// 	url: "https://job-search4.p.rapidapi.com/monster/search",
		// 	params: { query: "Software Engineer", state: "NY", page: page },
		// 	headers: {
		// 		"x-rapidapi-host": "job-search4.p.rapidapi.com",
		// 		,
		// 	},
		// };

		// const { data } = await axios.request(options);
		// .then(function (response) {
		// 	const { data } = response;
		// 	if (data.status === "success") {
		// 		// console.log(data.jobs);
		// 		return data;
		// 	} else {
		// 		return [];
		// 	}
		// })
		// .catch(function (error) {
		// 	console.log(error);
		// });
		// return data;
	},
};

module.exports = exportedMethods;
