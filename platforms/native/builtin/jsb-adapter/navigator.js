let { noop } = require('./util');

const navigator = {
  platform: __getOS(),
  language: __getCurrentLanguage(),
  appVersion: '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 NetType/WIFI Language/zh_CN',
  onLine: true, //FIXME:

  geolocation: {
    getCurrentPosition: noop,
    watchPosition: noop,
    clearWatch: noop
  },

  maxTouchPoints: 10 //FIXME: getting the number from OS.
}

module.exports = navigator;
