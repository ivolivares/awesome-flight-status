const fs = require('./flightStatus');
const w = require('./weather');
const Promise = require('bluebird');

/**
 * Responds a flight status with weather data.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.flightStatus = (req, res) => {

  Promise.all([
    fs.get('LA', 600, '2018/05/19'),
    w.get('santiago', '2018/05/19')
  ]).then((responses) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(200, {
      responses,
      flight: 'LA2012',
      date: '2018-05-18',
      origin: {
        city: 'Santiago',
        fullAirport: 'Arturo Merino Benitez',
        code: 'SCL'
      },
      destination: {
        city: 'Antofagasta',
        fullAirport: 'Andres Sabella',
        code: 'ANF'
      },
      status: 'On-Time',
      weather: {
        origin: {
          description: 'Cloudy sky',
          temperature: '23',
          icon: '04n'
        },
        destination: {
          description: 'Cloudy sky',
          temperature: '24',
          icon: '04n'
        }
      }
    })
  });
}