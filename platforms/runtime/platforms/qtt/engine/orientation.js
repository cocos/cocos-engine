let sysInfo = jsb.getSystemInfoSync();
jsb._isLandscape = sysInfo.screenWidth > sysInfo.screenHeight;