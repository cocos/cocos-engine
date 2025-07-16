const { pixelRatio, windowWidth, windowHeight } = my.getWindowInfoSync()
const devicePixelRatio = pixelRatio;

let width, height;
{
  width = windowWidth;
  height = windowHeight;
}

export { devicePixelRatio }
export const screen = {
  width,
  height,
  availWidth: width,
  availHeight: height,
  availLeft: 0,
  availTop: 0,
}

export const performance = {
  now: Date.now
};

export const ontouchstart = null;
export const ontouchmove = null;
export const ontouchend = null;
