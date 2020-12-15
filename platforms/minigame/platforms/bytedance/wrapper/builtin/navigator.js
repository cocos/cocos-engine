import { noop } from './util/index.js'

// TODO 需要 tt.getSystemInfo 获取更详细信息
const systemInfo = tt.getSystemInfoSync()
console.log(systemInfo)

const system = systemInfo.system;
const platform = systemInfo.platform;
const language = systemInfo.language;
const wechatVersioin = systemInfo.version;

const android = system.toLowerCase().indexOf('android') !== -1;

const uaDesc = android ? `Android; CPU ${system}` : `iPhone; CPU iPhone OS ${system} like Mac OS X`;
const ua = `Mozilla/5.0 (${uaDesc}) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/${wechatVersioin} MiniGame NetType/WIFI Language/${language}`;

const navigator = {
  platform,
  language: language,
  appVersion: `5.0 (${uaDesc}) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1`,
  userAgent: ua,
  onLine: true, // TODO 用 tt.getNetworkStateChange 和 tt.onNetworkStateChange 来返回真实的状态

  // TODO 用 tt.getLocation 来封装 geolocation
  geolocation: {
    getCurrentPosition: noop,
    watchPosition: noop,
    clearWatch: noop
  }
}

if (tt.onNetworkStatusChange) {
    tt.onNetworkStatusChange(function(event){
        navigator.onLine = event.isConnected;
    });
}

export default navigator
