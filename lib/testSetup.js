import Vue from "vue";
const sinon = require("sinon");

window.Vue = Vue;

// Standalone test spies, stubs and mocks for JavaScript. Works with any unit testing framework.
// @link https://sinonjs.org/
global.sinon = sinon;
