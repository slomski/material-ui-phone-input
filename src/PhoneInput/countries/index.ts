import countryNames from './countries.json';
import { ICountry } from '../../types';

const countries: ICountry[] = [];

countryNames.forEach(country => {
  countries.push(country);
});

export default countries;
