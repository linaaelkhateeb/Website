// middleware/ensureAgency.js
function ensureAgency(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'agency') return next()
    return res.status(403).json({ message: 'Agencies only' })
}

module.exports = ensureAgency
