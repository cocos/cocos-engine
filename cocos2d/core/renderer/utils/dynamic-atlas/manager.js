const Atlas = require('./atlas');

let _atlases = [];
let _atlasIndex = -1;

let _maxAtlasCount = 5;
let _textureSize = 2048;
// Smaller frame is more likely to be affected by linear filter
let _minFrameSize = 8;
let _maxFrameSize = 512;


let _debugNode = null;

function newAtlas () {
    let atlas = _atlases[++_atlasIndex]
    if (!atlas) {
        atlas = new Atlas(_textureSize, _textureSize);
        _atlases.push(atlas);
    }
    return atlas;
}

function beforeSceneLoad () {
    dynamicAtlasManager.reset();
}

let _enabled = false;

/**
 * !#en Manager the dynamic atlas.
 * !#zh 管理动态图集。
 * @class DynamicAtlasManager
 */
let dynamicAtlasManager = {
    Atlas: Atlas,
    
    /**
     * !#en Enabled or Disabled dynamic atlas.
     * !#zh 开启或者关闭动态图集。
     * @property enabled
     * @type {Boolean}
     */
    get enabled () {
        return _enabled;
    },
    set enabled (value) {
        if (_enabled === value) return;

        if (value) {
            this.reset();
            cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, beforeSceneLoad);
        }
        else {
            cc.director.off(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, beforeSceneLoad);
        }

        _enabled = value;
    },

    /**
     * !#en The maximum number of atlas that can be created.
     * !#zh 可以创建的最大图集数量。
     * @property maxAtlasCount
     * @type {Number}
     */
    get maxAtlasCount () {
        return _maxAtlasCount;
    },
    set maxAtlasCount (value) {
        _maxAtlasCount = value;
    },

    /**
     * !#en The size of the atlas that was created
     * !#zh 创建的图集的宽高
     * @property textureSize
     * @type {Number}
     */
    get textureSize () {
        return _textureSize;
    },
    set textureSize (value) {
        _textureSize = value;
    },

    /**
     * !#en The maximum size of the picture that can be added to the atlas.
     * !#zh 可以添加进图集的图片的最大尺寸。
     * @property maxFrameSize
     * @type {Number}
     */
    get maxFrameSize () {
        return _maxFrameSize;
    },
    set maxFrameSize (value) {
        _maxFrameSize = value;
    },

    /**
     * !#en The minimum size of the picture that can be added to the atlas.
     * !#zh 可以添加进图集的图片的最小尺寸。
     * @property minFrameSize
     * @type {Number}
     */
    get minFrameSize () {
        return _minFrameSize;
    },
    set minFrameSize (value) {
        _minFrameSize = value;
    },
    
    /**
     * !#en Append a sprite frame into the dynamic atlas.
     * !#zh 添加碎图进入动态图集。
     * @method insertSpriteFrame
     * @param {SpriteFrame} spriteFrame 
     */
    insertSpriteFrame (spriteFrame) {
        if (CC_EDITOR) return null;
        if (!_enabled || _atlasIndex === _maxAtlasCount ||
            !spriteFrame || spriteFrame._original) return null;
        
        if (!spriteFrame._texture.packable) return null;

        let atlas = _atlases[_atlasIndex];
        if (!atlas) {
            atlas = newAtlas();
        }

        let frame = atlas.insertSpriteFrame(spriteFrame);
        if (!frame && _atlasIndex !== _maxAtlasCount) {
            atlas = newAtlas();
            return atlas.insertSpriteFrame(spriteFrame);
        }
        return frame;
    },

    /** 
     * !#en Resets all dynamic atlas, and the existing ones will be destroyed.
     * !#zh 重置所有动态图集，已有的动态图集会被销毁。
     * @method reset
    */
    reset () {
        for (let i = 0, l = _atlases.length; i < l; i++) {
            _atlases[i].destroy();
        }
        _atlases.length = 0;
        _atlasIndex = -1;
    },

    deleteAtlasTexture (spriteFrame) {
        if (!spriteFrame._original) return;

        let texture = spriteFrame._original._texture;
        if (texture) {
            for (let i = 0, l = _atlases.length; i < l; i++) {
                _atlases[i].deleteInnerTexture(texture);
            }
        }
    },

    /**
     * !#en Displays all the dynamic atlas in the current scene, which you can use to view the current atlas state.
     * !#zh 在当前场景中显示所有动态图集，可以用来查看当前的合图状态。
     * @method showDebug
     * @param {Boolean} show
     */
    showDebug: CC_DEV && function (show) {
        if (show) {
            if (!_debugNode || !_debugNode.isValid) {
                let width = cc.visibleRect.width;
                let height = cc.visibleRect.height;

                _debugNode = new cc.Node('DYNAMIC_ATLAS_DEBUG_NODE');
                _debugNode.width = width;
                _debugNode.height = height;
                _debugNode.x = width/2;
                _debugNode.y = height/2;
                _debugNode.zIndex = cc.macro.MAX_ZINDEX;
                _debugNode.parent = cc.director.getScene();

                _debugNode.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG;
                cc.Camera._setupDebugCamera();

                let scroll = _debugNode.addComponent(cc.ScrollView);

                let content = new cc.Node('CONTENT');
                let layout = content.addComponent(cc.Layout);
                layout.type = cc.Layout.Type.VERTICAL;
                layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
                content.parent = _debugNode;
                content.width = _textureSize;
                content.anchorY = 1;
                content.x = _textureSize;

                scroll.content = content;

                for (let i = 0; i <= _atlasIndex; i++) {
                    let node = new cc.Node('ATLAS');
                    
                    let texture = _atlases[i]._texture;
                    let spriteFrame = new cc.SpriteFrame();
                    spriteFrame.setTexture(_atlases[i]._texture);

                    let sprite = node.addComponent(cc.Sprite)
                    sprite.spriteFrame = spriteFrame;

                    node.parent = content;
                }
            }
        }
        else {
            if (_debugNode) {
                _debugNode.parent = null;
                _debugNode = null;
            }
        }
    },

    update () {
        if (!this.enabled) return;

        for (let i = 0; i <= _atlasIndex; i++) {
            _atlases[i].update();
        }
    },
};

/**
 * @module cc
 */

/**
 * @property dynamicAtlasManager
 * @type DynamicAtlasManager
 */
module.exports = cc.dynamicAtlasManager = dynamicAtlasManager;