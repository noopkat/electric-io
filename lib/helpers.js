const fs = require('fs');

const createDashboardFileIfNotExists = function(callback) {
  const dashboardFilePath = process.cwd() + '/.data/dashboard.json';

  fs.open(dashboardFilePath, 'wx', (err, fd) => {
    if (err) return callback();
    console.log('dashboard file does not exist, creating one...');

    const blankDashboard = {
      dashboard: {
        blockSize: [250, 200],
        bgColor: 'papayawhip',
        tiles: []
      }
    };

    const fileContents = JSON.stringify(blankDashboard);
    fs.writeFile(fd, fileContents, 'utf8', (error) => {
      console.log(error);
      return callback(error);
    });
  });
};

module.exports = {createDashboardFileIfNotExists};
