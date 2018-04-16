const list  = [ 
  {deviceId: 'AZ3166'},
  {deviceId: 'Tessel2'},
  {deviceId: 'Jenn'}
];

const telemetry = {
  'AZ3166': {
    interval: 1000,
    properties: [
      {name: 'temperature', minmax: [0, 40]},
      {name: 'humidity', minmax: [0, 100]}
    ]
  },
  'Tessel2': {
    interval: 1000,
    properties: [
      {name: 'light', minmax: [0, 1]},
      {name: 'sound', minmax: [0, 1]}
    ]
  },
  'Jenn': {
    interval: 10356,
    properties: [
      {name: 'coolness', minmax: [95, 100]},
    ]
  }
};

module.exports = {telemetry, list};

