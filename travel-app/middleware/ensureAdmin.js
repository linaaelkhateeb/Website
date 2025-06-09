function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') return next()
    return res.status(403).json({ message: 'Admins only' })
}

module.exports = ensureAdmin
