const inputManager = cc.internal.inputManager;
const renderer = cc.renderer;
const game = cc.game;
let _frameRate = 60;


Object.assign(game, {
    setFrameRate (frameRate) {
        _frameRate = frameRate;
        if (__globalAdapter.setPreferredFramesPerSecond) {
            __globalAdapter.setPreferredFramesPerSecond(frameRate);
        }
        else {
            this._paused = true;
            this._setAnimFrame();
            this._runMainLoop();
        }
    },

    getFrameRate () {
        return _frameRate;
    },

    _initEvents () {
        let hidden = false;

        function onHidden () {
            if (!hidden) {
                hidden = true;
                cc.game.emit(cc.Game.EVENT_HIDE);
            }
        }
        function onShown () {
            if (hidden) {
                hidden = false;
                cc.game.emit(cc.Game.EVENT_SHOW);
            }
        }

        __globalAdapter.onAudioInterruptionEnd && __globalAdapter.onAudioInterruptionEnd(function () {
            if (cc.audioEngine) cc.audioEngine._restore();
            
        });
        __globalAdapter.onAudioInterruptionBegin && __globalAdapter.onAudioInterruptionBegin(function () {
            if (cc.audioEngine) cc.audioEngine._break();
        });

        __globalAdapter.onShow && __globalAdapter.onShow(onShown);
        __globalAdapter.onHide && __globalAdapter.onHide(onHidden);

        this.on(cc.Game.EVENT_HIDE, () => {
            cc.game.pause();
        });
        this.on(cc.Game.EVENT_SHOW, () => {
            cc.game.resume();
        });
    },

    end () { },  // mini game platform not support this api

});

//  Small game in the screen log
function onErrorMessageHandler (info) {
    // off error event
    __globalAdapter.offError && __globalAdapter.offError(onErrorMessageHandler);

    var allowTrigger = Math.random() < 0.001;
    if (__globalAdapter.isSubContext || !allowTrigger) {
        return;
    }

    var env = __globalAdapter.getSystemInfoSync();
    if (!env) {
        return;
    }
    var root = cc.Canvas.instance.node;
    if (!root) {
        return;
    }

    var offset = 60;
    var node = new cc.Node();
    node.color = cc.Color.BLACK;
    node.parent = root;

    var label = node.addComponent(cc.Label);
    node.height = root.height - offset;
    node.width = root.width - offset;
    label.overflow = cc.Label.Overflow.SHRINK;
    label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
    label.verticalAlign = cc.Label.VerticalAlign.TOP;
    label.fontSize = 24;

    if (cc.LabelOutline) {
        var outline = node.addComponent(cc.LabelOutline);
        outline.color = cc.Color.WHITE;
    }

    label.string = '请截屏发送以下信息反馈给游戏开发者（Please send this screen shot to the game developer）\n';
    label.string += 'Device: ' + env.brand + ' ' + env.model + '\n' + 'System: ' + env.system + '\n' + 'Platform: WeChat ' + env.version + '\n' + 'Engine: Cocos Creator v' + window.CocosEngine + '\n' + 'Error:\n' + info.message;

    cc.director.pause();

    node.once('touchend', function () {
        node.destroy();
        setTimeout(function () {
            cc.director.resume();
        }, 1000)
    })
}

__globalAdapter.onError && __globalAdapter.onError(onErrorMessageHandler);
