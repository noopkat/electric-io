export default {
  responsive: false,
  animation: {
    duration: 0 // general animation time
  },
  events: ["click"],
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          color: "#ddd",
          display: false
        },
        scaleLabel: {
          display: false,
          labelString: ""
        },
        ticks: {
          fontColor: "#bbb",
          display: true
          //max: 40,
          //min: -10
        }
      }
    ],
    xAxes: [
      {
        display: false,
        gridLines: {
          display: false
        },
        type: "time",
        distribution: "linear",
        time: {
          minUnit: "second"
        }
      }
    ]
  }
};
