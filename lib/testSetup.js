import Vue from "vue";
const sinon = require("sinon");

window.Vue = Vue;

// Standalone test spies, stubs and mocks for JavaScript.
// @link https://sinonjs.org/
global.sinon = sinon;
