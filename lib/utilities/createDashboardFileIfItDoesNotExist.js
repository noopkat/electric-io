const fs = require("fs");
const path = require("path");

const blankDashboard = require("../../.data/dashboard.blank.json");

const PROJECT_DASHBOARD_FILE_PATH = path.join(".data", "dashboard.json");
const DASHBOARD_FILE_PATH = path.join(
  __dirname,
  "../..",
  PROJECT_DASHBOARD_FILE_PATH
);

function createDashboardFileIfItDoesNotExist() {
  return new Promise((resolve, reject) => {
    fs.open(DASHBOARD_FILE_PATH, "wx", (error, fileDescriptor) => {
      if (error) {
        if (Number.isInteger(fileDescriptor)) {
          fs.close(fileDescriptor, () => undefined);
        }

        if (error.code === "EEXIST") {
          resolve({
            filePath: DASHBOARD_FILE_PATH,
            fileCreated: false,
            message: "Found a dashboard file. Let’s move on."
          });
        } else {
          reject(error);
        }
        return;
      }

      const fileContents = JSON.stringify(blankDashboard);
      fs.writeFile(fileDescriptor, fileContents, "utf8", error => {
        fs.close(fileDescriptor, () => undefined);

        if (error) {
          reject(error);
        } else {
          resolve({
            filePath: DASHBOARD_FILE_PATH,
            fileCreated: true,
            message: "Didn’t find a dashboard file so I created one for you. 🧚"
          });
        }
      });
    });
  });
}

module.exports = createDashboardFileIfItDoesNotExist;
