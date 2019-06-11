module.exports = {
  moduleNameMapper: {
    "^vue$": "vue/dist/vue.common.js"
  },
  moduleFileExtensions: ["js", "json", "vue"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.js$": "babel-jest"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "lib/**/*.js",
    "public/js/**/*.{js,vue}",
    "!public/js/dist/**",
    "!**/node_modules/**"
  ],
  roots: ["lib", "public/js"],
  setupFiles: ["./lib/testSetup.js"],
  testURL: "http://localhost/",
  globals: {
    SIMULATING: process.env.SIMULATING === "true"
  }
};
