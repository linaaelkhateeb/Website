function ensureTrustedAgency(req, res, next) {
    if (
        req.isAuthenticated() &&
        req.user.role === 'agency' &&
        req.user.isTrusted
    ) {
        return next()
    }
    return res
        .status(403)
        .json({ message: 'Only trusted agencies can add locations directly' })
}

module.exports = ensureTrustedAgency
