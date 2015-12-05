var echo = document.getElementById('echo');

function printResult(str) {
  console.log(str);
  echo.innerHTML += str + '<br>';
}

function printError(str) {
  console.log(str);
  echo.innerHTML += str + '<br>';
}

function printScore(str) {
  console.log(str);
  echo.innerHTML += str + '<br>';
}

var timeData = {
  labels: [],
  datasets: [
    {
      labels: 'Non-SIMD',
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: []
    },
    {
      labels: 'SIMD',
      fillColor: "rgba(151,187,205,0.5)",
      strokeColor: "rgba(151,187,205,0.8)",
      highlightFill: "rgba(151,187,205,0.75)",
      highlightStroke: "rgba(151,187,205,1)",
      data: []
    }
  ]
};

var speedupData ={
  labels: [],
  datasets: [
    {
      labels: 'SIMD',
      fillColor: "rgba(151,187,205,0.5)",
      strokeColor: "rgba(151,187,205,0.8)",
      highlightFill: "rgba(151,187,205,0.75)",
      highlightStroke: "rgba(151,187,205,1)",
      data: []
    }
  ]
};

window.onload = function() {
  if (typeof(SIMD) === 'undefined') {
    var head = document.getElementById('head');
    head.innerHTML = 'SIMD is not implemented in your browser, stops.';
    return;
  }
  console.log('Running benchmarks.');
  benchmarks.runAll({notifyResult: printResult,
                     notifyError:  printError,
                     notifyScore:  printScore,
                     timeData: timeData,
                     speedupData: speedupData}, true);
  document.getElementById('head').innerHTML = 'Results';
  document.getElementById('time').innerHTML = 'Time';
  document.getElementById('speedup').innerHTML = 'Speedup';
  var ctx1 = document.getElementById("canvasTime").getContext("2d");
  window.Bar1 = new Chart(ctx1).Bar(timeData, {
    scaleLabel: "<%=value%>ms",
    responsive: true
  });
  var ctx2 = document.getElementById("canvasSpeedup").getContext("2d");
  window.Bar2 = new Chart(ctx2).Bar(speedupData, {
    scaleLabel: " <%=value%>",
    responsive: true
  });
  console.log('Benchmarks completed.');
};
