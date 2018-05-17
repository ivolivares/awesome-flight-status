/**
 * Responds a dummy
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.flightStatus = (req, res) => {
  res.send('Awesome Flight Status!')
}
