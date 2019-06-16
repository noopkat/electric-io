import Vue from "vue";
const { Response, Request, Headers, fetch } = require("whatwg-fetch");

window.Vue = Vue;

// Mock for fetch calls
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.fetch = fetch;
