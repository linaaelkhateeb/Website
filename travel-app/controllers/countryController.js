const Country = require('../models/country');

const mongoose = require('mongoose');


const Attraction = require('../models/attraction');
const Location = require('../models/location');

exports.listCountries = async (req, res) => {
  const countries = await Country.find();
  res.render('countries/index', { countries });
};

exports.viewCountry = async (req, res) => {
  const country = await Country.findById(req.params.id);
  const attractions = await Attraction.find({ country: country._id });
  res.render('countries/show', { country, attractions });
};


exports.renderNewCountryForm = (req, res) => {
  res.render('admin/countries/new');
};

exports.createCountry = async (req, res) => {
  try {
    const { name, description, lat, lng } = req.body;

    const newCountry = new Country({
      name,
      
    });

    await newCountry.save();
    req.flash('success', 'Country added successfully');
    res.redirect('/admin/countries');
  } catch (error) {
    console.error('Error creating country:', error);
    req.flash('error', 'Failed to add country');
    res.redirect('/admin/countries/new');
  }
};
//exports.getLocationsByCountry = async (req, res) => {
//try {
//const countryId = req.params.id;
//const country = await Country.findById(countryId);
//const locations = await Location.find({ country: countryId, isApproved: true });
//res.render('countries/show', { country, locations });
//} catch (err) {
//res.status(500).send('Server error');
//}
//};
