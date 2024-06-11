/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

// console.log(locations);

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

// VALUES

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
}

const onSubmit = async e => {
  console.log('hi');
  e.preventDefault(); // this prevents from loading any other page
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  await login(email, password);
};

if (loginForm) loginForm.addEventListener('submit', onSubmit);

if (logOutBtn) logOutBtn.addEventListener('click', logout);
