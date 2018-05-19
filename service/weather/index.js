const request = require("request");
const serviceUrl = "http://api.openweathermap.org/data/2.5/forecast";
const appid="4280784848e86fecab85725d3bed2c5c";
const kelvinConversion = 273.15;

/**
 * Responds the weather data.
 *
 * @param {!String} city airport city name.
 * @param {!String} date flight date.
 */

module.exports = {
	get: (city, date) => {
		return new Promise((resolve, reject) => {
			request({url: serviceUrl, 
				qs : {
					q:city,
					appid
				}
			}, (error, response, body) => {
				var result = JSON.parse(body);
				resolve(result);
			});
		});
	}
}; 