import './css/styles.css';
import { fetchCountries } from './fetchCountries'
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.searchBox.addEventListener("input", debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
    const form = e.target.value.trim();

    clearMarkup();

    fetchCountries(form)
        .then(renderCountryCard)
        .catch(fetchError)
}

function renderCountryCard(countries) {
    clearMarkup();

    if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countries.length >= 2) {
        renderCountriesList(countries);
    } else {
        renderCountryInfo(countries);
    }
}

function renderCountriesList(countries) {
    refs.countryList.innerHTML = countries
        .map(({ name: { official }, flags: { svg } }) =>
            `<li class="country-list__item" data-item="${official}">
          <img src="${svg}" alt="${official}" width=70 class="country-list__img">
          <p class="country-list__name"><b>${official}</b></p>
        </li>`)
        .join('');
}

function renderCountryInfo(countries) {
    const markup = countries
        .map(({ name: { official }, flags: { svg }, capital, population, languages }) => {
            return `<div class="country-info__head">
    <div class="country-info__wrap">
            <img src="${svg}" alt="Flag ${official}" width=100 class="country-info__img">
        <h2 class="country-info__name">${official}</h2>
    </div>
        <ul class="country-info__list">
            <li class="country-info__item">
                <span><b>Capital: </b></span>${capital}
            </li>
            <li class="country-info__item">
                <span><b>Population: </b></span>${population}
            </li>
            <li class="country-info__item">
                <span><b>Languages: </b></span>${Object.values(languages)}
            </li>
        </ul>
    </div>`;
        })
        .join("");

    refs.countryInfo.innerHTML = markup;
}

function fetchError() {
   Notify.failure('Oops, there is no country with that name');
    return
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
