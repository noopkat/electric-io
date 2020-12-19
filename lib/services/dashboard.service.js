const debug = require("debug")("server");
const fs = require("fs");
const path = require("path");

const DASHBOARD_EDIT_MODE = process.env.EDIT_MODE || "unlocked";
const EXCLUDED_DASHBOARD_MODES = ["locked", "demo"];
const PROJECT_DASHBOARD_FILE_PATH = path.join(".data", "dashboard.json");
const DASHBOARD_FILE_PATH = path.join(
  __dirname,
  "../..",
  PROJECT_DASHBOARD_FILE_PATH
);

module.exports = {
  getDashboardSettings() {
    return new Promise((resolve, reject) => {
      fs.readFile(DASHBOARD_FILE_PATH, { encoding: "utf8" }, (error, data) => {
        debug(data, error);

        if (error) {
          const message = `Could not read from file “${PROJECT_DASHBOARD_FILE_PATH}”.`;
          reject(message);
        } else {
          try {
            let dashboardSettings = JSON.parse(data);
            dashboardSettings.dashboard.editMode = DASHBOARD_EDIT_MODE;

            resolve(dashboardSettings);
          } catch (error) {
            const message = `Could not parse the contents of “${PROJECT_DASHBOARD_FILE_PATH}” as JSON.`;
            reject(message);
          }
        }
      });
    });
  },

  saveDashboardSettings(dashboardSettings) {
    return new Promise((resolve, reject) => {
      if (EXCLUDED_DASHBOARD_MODES.includes(DASHBOARD_EDIT_MODE)) {
        const message = `Can’t save dashboard in ${DASHBOARD_EDIT_MODE} mode.`;
        debug(message);
        reject(message);
      } else {
        const fileContents = JSON.stringify(dashboardSettings);

        fs.writeFile(DASHBOARD_FILE_PATH, fileContents, "utf8", error => {
          if (error) {
            const message = `Could not write to “${PROJECT_DASHBOARD_FILE_PATH}”.`;
            debug(message);
            reject(message);
          } else {
            const message = "Dashboard successfully saved.";
            debug(message);
            resolve(dashboardSettings);
          }
        });
      }
    });
  }
};
