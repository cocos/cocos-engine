const { join } = require('path');

module.exports = {
    'cc.Button': join(__dirname, './components/button.js'),
    'cc.Label': join(__dirname, './components/label.js'),
    'cc.Layout': join(__dirname, './components/layout.js'),
    'cc.ParticleSystem': join(__dirname, './components/particle-system.js'),
    'cc.ParticleSystem2D': join(__dirname, './components/particle-system-2d.js'),
    'cc.PolygonCollider2D': join(__dirname, './components/polygon-collider.js'),
    'cc.PrefabLink': join(__dirname, './components/prefab-link.js'),
    'cc.RichText': join(__dirname, './components/rich-text.js'),
    'cc.SafeArea': join(__dirname, './components/safe-area.js'),
    'cc.ScrollView': join(__dirname, './components/scroll-view.js'),
    'cc.SkinnedMeshBatchRenderer': join(__dirname, './components/batched-skinning-model.js'),
    'cc.SphereLight': join(__dirname, './components/sphere-light.js'),
    'cc.SpotLight': join(__dirname, './components/spot-light.js'),
    'cc.Sprite': join(__dirname, './components/sprite.js'),
    'cc.Terrain': join(__dirname, './components/terrain.js'),
    'cc.Toggle': join(__dirname, './components/toggle.js'),
    'cc.VideoPlayer': join(__dirname, './components/video-player.js'),
    'cc.WebView': join(__dirname, './components/webview.js'),
    'cc.Widget': join(__dirname, './components/widget.js'),
};
