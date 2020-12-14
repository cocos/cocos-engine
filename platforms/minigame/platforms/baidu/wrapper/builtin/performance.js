/* eslint-disable */
import isDevtool from './util/isDevtool';

let performance

if (swan.getPerformance) {
  const swanPerf = swan.getPerformance()
  const initTime = swanPerf.now()

  const clientPerfAdapter = Object.assign({}, swanPerf, {
    now: function() {
      return (swanPerf.now() - initTime) / 1000
    }
  })

  performance = isDevtool() ? swanPerf : clientPerfAdapter
}
else {
  performance = {};
  performance.now = Date.now;
}

export default performance
