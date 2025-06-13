const Country = require('../models/country');
const Attraction = require('../models/attraction');

exports.listCountries = async (req, res) => {
  const countries = await Country.find();
  res.render('countries/index', { countries });
};

exports.viewCountry = async (req, res) => {
  const country = await Country.findById(req.params.id);
  const attractions = await Attraction.find({ country: country._id });
  res.render('countries/show', { country, attractions });
};
