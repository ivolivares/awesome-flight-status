const fs = require('./flightStatus/index');
const w = require('./weather/index');
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

  fs.get(operator, number, date).then(function(argument) {
    res.setHeader('Content-Type', 'application/json');
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.status(200);
    const originWeather = w.get(
      argument.origin.city,
      argument.origin.departureDate,
      "origin")
    const destinationWeather = w.get(
      argument.destination.city,
      argument.destination.arrivalDate,
      "destination")

    Promise.all([originWeather, destinationWeather]).then((weatherResults) => {
      res.send(
        _.merge(
          response,
          argument, {
            weather: _.merge(
              _.first(weatherResults),
              _.last(weatherResults)
            )
          }
        ));
    });
  })


}