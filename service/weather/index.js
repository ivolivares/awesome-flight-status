const request = require("request");
const serviceUrl = "http://api.openweathermap.org/data/2.5/forecast";
const appid="4280784848e86fecab85725d3bed2c5c";
const kelvinConversion = 273.15;
const _ = require("lodash");
const moment = require("moment");







/**
 * Responds the weather data.
 *
 * @param {!String} city airport city name.
 * @param {!String} date flight date.
 */

module.exports = {
	get: (city, date, oD) => {
				
		return new Promise((resolve, reject) => {
			
			request({url: serviceUrl, 
				qs : {
					q:city,
					appid
				}
			}, (error, response, body) => {
				
				const result = JSON.parse(body);

				const day = _.first(result.list.filter((d) => moment(date, "DD/MM/YYYY hh:mm:ss").unix() > d.dt ));
				

				const weather = result
				const objResult = {};
				objResult[oD] = {
					temperature: (day.main.temp - kelvinConversion).toFixed(1),
					description: _.first(day.weather).description,
					icon: _.first(day.weather).icon

				}
				console.log(objResult);
				resolve(objResult);
			});
		});
	}
}; 





