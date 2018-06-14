const httpStatus = require('http-status')
const request = require("request")
const w = require('../weather/index')
const serviceUrl = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/"
const appId = "9fd95901"
const appKey = "c7f308860f972865cd4fd963295de362"
const utc = "false"
const statuCode = require("./statusCode")
const _ = require("lodash")
const moment = require("moment")
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
			const url = `${serviceUrl}${airLineCode}/${flightNumber}/arr/${moment(arrivalDate).format("YYYY/MM/DD")}`

			request({
				url,
				qs: {
					appId,
					appKey,
					utc
				}
			}, (error, response, body) => {

				if (error) {
					reject({
						status: {
							code: httpStatus.INTERNAL_SERVER_ERROR,
							message: httpStatus[500]
						},
						error
					})
					return
				}

				const result = JSON.parse(body)
				const airports = []
				const weatherPromises = []
				if (result.flightStatuses.length <= 0) {
					const message = "No flight statuses"
					console.log(`${message}: ${JSON.stringify(body)}`)
					reject({
						status: {
							code: httpStatus.NOT_FOUND,
							message
						}
					})
					return
				}

				let status = _.maxBy(result.flightStatuses.map((f) => statuCode[f.status]), (f) => f.weight).text

				result.flightStatuses.forEach((s) => {
					var o = airports.filter(a => s.departureAirportFsCode === a.code)
					var d = airports.filter(a => s.arrivalAirportFsCode === a.code)

					if (o.length === 0) {
						airports.push({
							code: s.departureAirportFsCode,
							status: statuCode[s.status].text,
							departureDate: moment(s.departureDate.dateLocal).format(),
						})
					}
					if (d.length === 0) {
						const nextSegment = _.head(result.flightStatuses.filter(st => st.departureAirportFsCode === s.arrivalAirportFsCode))
						const departureDate = nextSegment ? moment(nextSegment.departureDate.dateLocal).format() : undefined

						airports.push({
							code: s.arrivalAirportFsCode,
							status: statuCode[s.status].text,
							departureDate,
							arrivalDate: moment(s.arrivalDate.dateLocal).format()
						})
					}
				})

				const airportsList = airports.map((airport) => {
					const ato = _.head(result.appendix.airports.filter(a => a.iata === airport.code))
					const weatherPromise = w.get(ato.city, airport.departureDate || airport.arrivalDate, ato.iata)
					weatherPromises.push(weatherPromise)

					return {
						city: ato.city,
						fullAirport: ato.name,
						code: ato.iata,
						status: airport.status,
						departureDate: airport.departureDate,
						arrivalDate: airport.arrivalDate
					}
				})

				resolve({
					generalStatus: status,
					airports: airportsList,
					weatherPromises
				})
			})
		})
	}
}