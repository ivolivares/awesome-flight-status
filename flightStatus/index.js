const request = require("request");
const serviceUrl = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/";
const appId = "9fd95901";
const appKey = "c7f308860f972865cd4fd963295de362";
const utc = "false";
const statuCode = require("./statusCode");
const _ = require("lodash");
const moment = require("moment");
/**
 * Responds a flight status with weather data.
 *
 * @param {!String} airLineCode Two letters air line code.
 * @param {!Number} flightNumber flight number.
 * @param {!String} arrivalDate arrival date in format yyyy/mm/dd.
 */

module.exports = {
	get: (airLineCode, flightNumber, arrivalDate) => {
		return new Promise((resolve, reject) => {
			const url = `${serviceUrl}${airLineCode}/${flightNumber}/arr/${arrivalDate}`
			
			request({
				url,
				qs: {
					appId,
					appKey,
					utc
				}
			}, (error, response, body) => {

				const result = JSON.parse(body);

				let status = _.maxBy(
					result.flightStatuses
					.map((f) => statuCode[f.status]),
					(f) => f.weight).text;

				const origin = _.first(result.flightStatuses);
				const destination = _.last(result.flightStatuses);
				const departureAirport = _.first(result.appendix.airports.filter(
					(a) => a.iata == origin.departureAirportFsCode
				));
				const arrivalAirport = _.first(result.appendix.airports.filter(
					(a) => a.iata == destination.arrivalAirportFsCode
				));

				const objResponse = {
					status,
					origin: {
						code: origin.departureAirportFsCode,
						status: statuCode[origin.status].text,
						city: departureAirport.city,
						fullAirport: departureAirport.name,
						departureDate : moment(origin.departureDate.dateLocal).format("DD/MM/YYYY HH:00:00")
					},
					destination: {
						code: destination.arrivalAirportFsCode,
						status: statuCode[destination.status].text,
						city: arrivalAirport.city,
						fullAirport: arrivalAirport.name,
						arrivalDate : moment(destination.arrivalDate.dateLocal).format("DD/MM/YYYY HH:00:00")
					}
				}

				resolve(objResponse);
			});
		});
	}
};