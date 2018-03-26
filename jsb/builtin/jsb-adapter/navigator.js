let { noop } = require('./util');

// TODO 需要 wx.getSystemInfo 获取更详细信息
// cjh const { platform } = wx.getSystemInfoSync()
const navigator = {
  platform: 'wx', //cjh added wx
  language: 'zh-cn',
  appVersion: '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/6.6.0 MiniGame NetType/WIFI Language/zh_CN',
  onLine: true, // TODO 用 wx.getNetworkStateChange 和 wx.onNetworkStateChange 来返回真实的状态

  // TODO 用 wx.getLocation 来封装 geolocation
  geolocation: {
    getCurrentPosition: noop,
    watchPosition: noop,
    clearWatch: noop
  }
}

module.exports = navigator;
