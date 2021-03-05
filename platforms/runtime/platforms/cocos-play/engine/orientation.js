let fs = ral.getFileSystemManager();
let gameConfig = JSON.parse(fs.readFileSync('./game.config.json', 'utf8'));
ral._isLandscape = gameConfig.deviceOrientation === 'landscape';