// routes/attractions.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/attractionController');
const { ensureAuth, ensureAdmin, ensureAgency } = require('../middleware/auth');

function ensureAdminOrAgency(req, res, next) {
  if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'agency')) {
    return next();
  }
  return res.status(403).render('error', { message: 'Admins or Agencies only' });
}


// Public routes
router.get('/', controller.getAllAttractions);
router.get('/:id', controller.getAttractionById);


// Allow only logged-in users with role "admin" OR "agency"
function ensureAdminOrAgency(req, res, next) {
  if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'agency')) {
    return next();
  }
  return res.status(403).render('error', { message: 'Admins or Agencies only' });
}

router.post('/', controller.createAttraction);


router.put(
  '/:id',
  ensureAuth,
  ensureAdminOrAgency,
  controller.updateAttraction
);

router.delete(
  '/:id',
  ensureAuth,
  ensureAdminOrAgency,
  controller.deleteAttraction
);


module.exports = router;
