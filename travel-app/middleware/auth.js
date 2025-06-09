function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Please log in');
  return res.redirect('/login');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') return next();
  return res.status(403).render('error', { message: 'Admins only' });
}

function ensureAgency(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'agency') return next();
  return res.status(403).render('error', { message: 'Agencies only' });
}

module.exports = {
  ensureAuth,
  ensureAdmin,
  ensureAgency
};
