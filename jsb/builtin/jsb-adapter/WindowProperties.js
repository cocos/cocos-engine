const { screenWidth, screenHeight, devicePixelRatio } = {screenWidth: window.innerWidth, screenHeight: window.innerHeight, devicePixelRatio: 1};//cjh wx.getSystemInfoSync()

const innerWidth = screenWidth
const innerHeight = screenHeight
const screen = {
  availWidth: innerWidth,
  availHeight: innerHeight
}
const performance = null//cjh wx.getPerformance()
const ontouchstart = null
const ontouchmove = null
const ontouchend = null

module.exports = {
    innerWidth: innerWidth,
    innerHeight: innerHeight,
    devicePixelRatio: devicePixelRatio,
    screen: screen,
    performance: performance,
    ontouchstart: ontouchstart,
    ontouchmove: ontouchmove,
    ontouchend: ontouchend
};
