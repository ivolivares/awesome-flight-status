const runtimeConfig = require('cloud-functions-runtime-config')

let instance = null

module.exports = () => {
  return new Promise((resolve, reject) => {
    const config = {
      app: {
        projectId: 'gcp-meetup-204422',
        flightStatus: {
          serviceUrl: 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/',
          utc: 'false'
        },
        weather: {
          serviceUrl: 'http://api.openweathermap.org/data/2.5/forecast',
          iconUrl: 'http://openweathermap.org/img/w/',
          kelvinConversion: 273.15
        },
        keys: {
          fs: {},
          w: {}
        }
      }
    }

    if (!instance) {
      instance = config
      if (!config.app.keys.fs.appId || !config.app.keys.fs.appKey || !config.app.keys.w.appId) {
        return runtimeConfig.getVariables('awesomeConfig', ['fsAppId', 'fsAppKey', 'wAppId'])
          .then(runtimeData => {
            console.log(runtimeData)
            config.app.keys.fs.appId = runtimeData[0]
            config.app.keys.fs.appKey = runtimeData[1]
            config.app.keys.w.appId = runtimeData[2]
            resolve(instance)
          }).catch(e => {
            console.log(e)
            return reject(e)
          })
      }
    }

    return resolve(instance)
  })
}