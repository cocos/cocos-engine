const { join } = require('path');

module.exports = {
    // 'cc.UITransform': join(__dirname, './components/class.js'),
    'cc.PolygonCollider2D': join(__dirname, './components/polygon-collider.js'),
    'cc.PrefabLink': join(__dirname, './components/prefab-link.js'),
    'cc.PageView': join(__dirname, './components/page-view.js'),
    'cc.Terrain': join(__dirname, './components/terrain.js'),
    'cc.Sprite': join(__dirname, './components/sprite.js'),
    'cc.SafeArea': join(__dirname, './components/safe-area.js'),
    'cc.SphereLight': join(__dirname, './components/sphere-light.js'),
    'cc.Slider': join(__dirname, './components/slider.js'),
    'cc.RichText': join(__dirname, './components/rich-text.js'),
    'cc.VideoPlayer': join(__dirname, './components/video-player.js'),
};
