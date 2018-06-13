const fs = require('./flightStatus/index');
const Promise = require('bluebird');
const _ = require("lodash");

/**
 * Responds a flight status with weather data.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.flightStatus = (req, res) => {
  const flight = req.query.flight;
  const date = req.query.date;
  const operator = flight.substring(0, 2);
  const number = flight.substring(2, flight.length);
  const response = {
    flight,
    date
  }

  fs.get(operator, number, date).then(function (flightsStatus) {
    res.setHeader('Content-Type', 'application/json');
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.status(200);


    Promise.all(flightsStatus.weatherPromises).then((weatherResults) => {
      delete flightsStatus.weatherPromises;

      const airports = flightsStatus.airports.map((a) => {
        const w = _.head(weatherResults.filter(w => w.airport === a.code));
        delete w.airport;
        a.weather = w;
        return a
      });


      res.send(
        _.merge(
          response,{
            airports : airports
          }
        ));
    });
  })


}