let sysInfo = ral.getSystemInfoSync();
ral._isLandscape = sysInfo.screenWidth > sysInfo.screenHeight;
