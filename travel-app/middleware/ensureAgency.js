function ensureAgency(req, res, next) {
    if (
        req.isAuthenticated &&
        req.isAuthenticated() &&
        req.user.role === 'agency'
    ) {
        return next()
    }
    req.flash('error', 'Only agency users can perform this action.')
    return res.redirect('/login')
}

module.exports = ensureAgency
