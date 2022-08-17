'use strict';

const path = require('path');

// Engine Module Configuration
const configList = [
    [ '2d.i', 'jsb_2d_auto.cpp' ],
    [ 'assets.i', 'jsb_assets_auto.cpp' ],
    [ 'audio.i', 'jsb_audio_auto.cpp' ],
    [ 'cocos.i', 'jsb_cocos_auto.cpp' ],
    [ 'dragonbones.i', 'jsb_dragonbones_auto.cpp' ],
    [ 'editor_support.i', 'jsb_editor_support_auto.cpp' ],
    [ 'extension.i', 'jsb_extension_auto.cpp' ],
    [ 'geometry.i', 'jsb_geometry_auto.cpp' ],
    [ 'gfx.i', 'jsb_gfx_auto.cpp' ],
    [ 'network.i', 'jsb_network_auto.cpp' ],
    [ 'physics.i', 'jsb_physics_auto.cpp' ],
    [ 'pipeline.i', 'jsb_pipeline_auto.cpp' ],
    [ 'scene.i', 'jsb_scene_auto.cpp' ],
    [ 'spine.i', 'jsb_spine_auto.cpp' ],
    [ 'webview.i', 'jsb_webview_auto.cpp' ],
    [ 'video.i', 'jsb_video_auto.cpp' ],
    [ 'renderer.i', 'jsb_render_auto.cpp' ],
];

const cocosNativeRoot = path.resolve(path.join(__dirname, '..', '..'));
const interfacesDir = path.join(cocosNativeRoot, 'tools', 'swig-config');
const bindingsOutDir = path.join(cocosNativeRoot, 'cocos', 'bindings', 'auto');

module.exports = {
    interfacesDir,
    bindingsOutDir,
    configList
};
