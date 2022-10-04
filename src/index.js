import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  resetMarkup();

  const searchContry = evt.target.value;

  if (searchContry === '') {
    return;
  }

  const normalizedSearchCountry = searchContry.trim();
  fetchCountries(normalizedSearchCountry)
    .then(countries => renderMarkupCountry(countries))
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function renderMarkupCountry(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length > 1) {
    const markup = countries
      .map(({ flags, name }) => {
        return `
        <li class = "country-item">
            <img class = "country-img" src="${flags.svg}" alt="${name.official}" width="60" height="40" />
            <p class="country-label">${name.official}</p> 
        </li>`;
      })
      .join('');

    refs.countryList.innerHTML = markup;
  } else if (countries.length === 1) {
    const markup = countries
      .map(({ flags, name, capital, population, languages }) => {
        return `
        <div class="country-info-header">
            <img class="country-info-img" src="${flags.svg}" alt="${
          name.common
        }" width="100" height="60"/>
            <h2 class="country-info-title">${name.official}</h2>
        </div>
        <ul class="country-info-list">
          <li class="country-info-item">
            <p class="country-info-subtitle">Capital: <span class="country-info-text">${
              capital[0]
            }</span></p>
            
          </li>
          <li class="country-info-item">
            <p class="country-info-subtitle">Population: <span class="country-info-text">${population}</span></p>
            
          </li>
          <li class="country-info-item">
            <p class="country-info-subtitle">Languages: <span class="country-info-text">${Object.values(
              languages
            )}</span></p>
          </li>
        </ul>`;
      })
      .join('');

    refs.countryInfo.innerHTML = markup;
  }
}

function resetMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
