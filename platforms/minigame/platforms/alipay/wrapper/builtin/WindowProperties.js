
var { screenWidth, screenHeight, pixelRatio, windowHeight, windowWidth} = my.getSystemInfoSync();

export var innerHeight = windowHeight;
export var innerWidth = windowWidth;
export var devicePixelRatio = pixelRatio;
export var screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: innerWidth,
  availHeight: innerHeight,
  availLeft: 0,
  availTop: 0
};
