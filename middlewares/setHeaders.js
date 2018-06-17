const uuid = require('uuid')

module.exports = (req, res, next) => {
  res.set('Content-Type', 'application/json;charset=UTF-8')
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', 'GET')
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
  res.set('Accept-Encoding', 'compress, gzip')
  res.set('X-Powered-By', 'GCP Meetup')
  res.set('X-Request-Id', uuid.v4())
  next()
}