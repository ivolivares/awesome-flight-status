const request = require("request");
const serviceUrl = "http://api.openweathermap.org/data/2.5/forecast";
const appid="4280784848e86fecab85725d3bed2c5c";
const kelvinConversion = 273.15;
const _ = require("lodash");
const moment = require("moment");
const iconUrl = "http://openweathermap.org/img/w/";






/**
 * Responds the weather data.
 *
 * @param {!String} city airport city name.
 * @param {!String} date flight date.
 */

module.exports = {
	get: (city, date, airport) => {
				
		return new Promise((resolve, reject) => {
			
			request({url: serviceUrl, 
				qs : {
					q:city,
					appid
				}
			}, (error, response, body) => {
				
				if(error) {
					reject(error)
					return;
				}

				const result = JSON.parse(body);

				const day = _.first(result.list.filter((d) => moment(date).unix() > d.dt ));
				

				const weather = result
				const objResult = {
					airport,
					temperature: (day.main.temp - kelvinConversion).toFixed(1),
					description: _.first(day.weather).description,
					icon: `${iconUrl}${_.first(day.weather).icon}.png`

				}
				resolve(objResult);
			});
		});
	}
}; 





