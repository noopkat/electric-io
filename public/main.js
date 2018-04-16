//$(function() {
  var ctx = document.getElementById("myChart");
  var ctx = document.getElementById("myChart").getContext("2d");
  var ctx = $("#myChart");
  var ctx = "myChart";
  
  var dataSet = [];
  var options =  {
      responsive: false,
      animation: {
            duration: 0, // general animation time
        },
        events: ['click'],
        scales: {
            yAxes: [{
              gridLines: {
              display: false
            },
                scaleLabel: {
                  display: true,
                  labelString: 'degrees celcius'
                },
                ticks: {
                  display: true,
                  max: 40,
                  min: -10
                }
            }],
            xAxes: [{
              gridLines: {
              display: false
            },
                type: 'time',
                distribution: 'linear',
                time: {
                  minUnit: 'second'
                }
            }]
        }
    };

    var data = {
        datasets: [{
            label: 'Temperature',
            data: dataSet,
            fill: false,
            borderColor: '#4286f4',
            lineTension: 0
        }]
    };

var myLineChart = new Chart(ctx, {type: 'line', data, options});

function renderChart() {
  var myLineChart = new Chart(ctx, {type: 'line', data, options});
};

  var socket = io();

  socket.on('hello', function (data) {
    console.log('server said hello');
  });
  
  socket.on('temp', function (data) {
    console.log('server said temp', data);
    if (dataSet.length > 20) dataSet.shift();
    dataSet.push({t: new Date(), y: data.temperature});
    myLineChart.update();
  });
  
//   setInterval(()=> {
//     console.log('adding data');
//     dataSet.push({x: new Date(), y: Math.random() * 28});
//     if (dataSet.length > 20) dataSet.shift();
//     myLineChart.update();

 
//   }, 1000);

// });