const { screenWidth, screenHeight, devicePixelRatio } = tt.getSystemInfoSync()

export const innerWidth = screenWidth
export const innerHeight = screenHeight
export { devicePixelRatio }
export const screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: innerWidth,
  availHeight: innerHeight,
  availLeft: 0,
  availTop: 0,
}

export const performance = {
  now: Date.now
};

export const ontouchstart = null;
export const ontouchmove = null;
export const ontouchend = null;