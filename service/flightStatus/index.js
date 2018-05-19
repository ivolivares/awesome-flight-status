const request = require("request");
const serviceUrl = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/";
const appId = "9fd95901";
const appKey = "c7f308860f972865cd4fd963295de362";
const utc = "false";
const statuCode = require("./statusCode");

/**
 * Responds a flight status with weather data.
 *
 * @param {!String} airLineCode Two letters air line code.
 * @param {!Number} flightNumber flight number.
 * @param {!String} arrivalDate arrival date in format yyyy/mm/dd.
 */

exports.status = {
	get: (airLineCode, flightNumber, arrivalDate) => {
		return new Promise((resolve, reject) => {
			request({
				url: `serviceUrl${airLineCode}/${flightNumber}/arr/${arrivalDate}` ,
				qs: {
					appId,
					appKey,
					utc
				}
			}, (error, response, body) => {
				var result = JSON.parse(body);
				resolve(result);
			});
		});
	}
};
