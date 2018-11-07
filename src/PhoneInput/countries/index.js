import countryNames from './countries.json';

const countries = [];

countryNames.forEach(country => {
  countries.push(country);
});

export default countries;
