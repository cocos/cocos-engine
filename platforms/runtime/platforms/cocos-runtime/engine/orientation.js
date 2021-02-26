let fs = jsb.getFileSystemManager();
let gameConfig = JSON.parse(fs.readFileSync('./game.config.json', 'utf8'));
jsb._isLandscape = gameConfig.deviceOrientation === 'landscape';