const request = require("request")
const _ = require("lodash")
const moment = require("moment")
const Config = require('../core/config')

/**
 * Responds the weather data.
 *
 * @param {!String} city airport city name.
 * @param {!String} date flight date.
 */

module.exports = {
	get: (city, date, airport) => {
		return Config().then((config) => (
			new Promise((resolve, reject) => {
				request({
					url: config.app.weather.serviceUrl,
					qs: {
						q: city,
						appid: config.app.keys.w.appId
					}
				}, (error, response, body) => {

					if (error) {
						reject(error)
						return
					}

					const result = JSON.parse(body)
					const day = _.first(result.list.filter((d) => moment(date).unix() > d.dt))

					const weather = result
					const objResult = {
						airport,
						temperature: (day.main.temp - config.app.weather.kelvinConversion).toFixed(1),
						description: _.first(day.weather).description,
						icon: `${config.app.weather.iconUrl}${_.first(day.weather).icon}.png`
					}
					resolve(objResult)
				})
			})
		)).catch((error) => {
			console.log(error)
			return new Promise((resolve, reject) =>
				reject({
					status: {
						code: httpStatus.INTERNAL_SERVER_ERROR,
						message: 'Config error flight weather'
					},
					error
				})
			)
		})
	}
} 
