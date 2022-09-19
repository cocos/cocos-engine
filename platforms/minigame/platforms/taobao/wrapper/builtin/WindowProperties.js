const { pixelRatio, windowWidth, windowHeight } = my.getSystemInfoSync()
const devicePixelRatio = pixelRatio;

let width, height;
if ($global.screencanvas.getBoundingClientRect) {
  let rect = $global.screencanvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
} else {
  width = windowWidth;
  height = windowHeight;
}
export const innerWidth = width;
export const innerHeight = height;
export { devicePixelRatio }
export const screen = {
  width,
  height,
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