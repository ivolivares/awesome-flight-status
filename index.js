const httpStatus = require('http-status')
const setHeaders = require('./middlewares/setHeaders')
const fs = require('./flightStatus/index')
const _ = require("lodash")

/**
 * Responds a flight status with weather data.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.flightStatus = (req, res) => 
  setHeaders(req, res, () => {
    const flight = req.query.flight
    const date = req.query.date
    const operator = flight.substring(0, 2)
    const number = flight.substring(2, flight.length)
    
    const responsePayload = { flight, date }

    return fs.get(operator, number, date)
      .then((flightsStatus) => {
        console.log(`General status: [${flight} - ${date} - ${flightsStatus.generalStatus}]`)

        return Promise.all(flightsStatus.weatherPromises)
          .then((weatherResults) => {
            delete flightsStatus.weatherPromises

            const airports = flightsStatus.airports.map((a) => {
              const weather = _.head(weatherResults.filter(w => w.airport === a.code))
              delete weather.airport 
              a.weather = weather
              return a
            })

            return res.status(httpStatus.OK).send(Object.assign(responsePayload, { airports }))
          }).catch(error => {
            console.log(`Error in weather request: ${JSON.stringify(error)}`)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
          })
      }).catch(error => {
        if (error.status.code) {
          return res.status(error.status.code).send(error)
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
      })
  })