exports.template = `
<div class="preview">
    <div class="animation-info">
        <ui-button id="playButton">
            <ui-icon value="play" id="playButtonIcon"></ui-icon>
        </ui-button>
        <ui-button id="stopButton">
            <ui-icon value="stop"></ui-icon>
        </ui-button>
        <ui-slider 
            id="animationTimeSlider"
            step="1"
        >
        </ui-slider>
        <ui-label id="timeLabel" value="Time:0.00"></ui-label>
    </div>
    <div class="model-info">
        <ui-label value="Vertices:0" class="vertices"></ui-label>
        <ui-label value="Triangles:0" class="triangles"></ui-label>
    </div>

    <div class="image">
        <canvas class="canvas"></canvas>
    </div>
</div>
`;

exports.style = `
.preview {
    margin-top: 10px;
    border-top: 1px solid var(--color-normal-border);
}
.preview > .model-info {
    padding-top: 8px;
}
.preview > .model-info > ui-label {
    margin-right: 6px;
}
.preview > .image {
    height: 200px;
    overflow: hidden;
    display: flex;
    flex: 1;
    margin-right: 10px;
}
.preview >.image > .canvas {
    flex: 1;
}
`;

const PLAY_STATE = {
    STOP: 0, // 停止
    PLAYING: 1, // 播放中
    PAUSE: 2, // 暂停
};

exports.$ = {
    model: '.model',
    container: '.preview',
    vertices: '.vertices',
    triangles: '.triangles',
    image: '.image',
    canvas: '.canvas',
    animationInfo: '.animation-info',
    modelInfo: '.model-info',
    playButton: '#playButton',
    playButtonIcon: '#playButtonIcon',
    stopButton: '#stopButton',
    animationTimeSlider: '#animationTimeSlider',
    timeLabel: '#timeLabel',
};

const Elements = {
    playButton: {
        ready () {
            this.$.playButton.addEventListener('confirm', this.onPlayButtonClick.bind(this));
        },
    },
    stopButton: {
        ready () {
            this.$.stopButton.addEventListener('confirm', this.onStopButtonClick.bind(this));
        },
    },
    animationTimeSlider: {
        ready () {
            const slider = this.$.animationTimeSlider;
            slider.addEventListener('change', this.onAnimationTimeSliderChange.bind(this));
            slider.addEventListener('confirm', this.onAnimationTimeSliderConfirm.bind(this));
        },
    },
    preview: {
        ready () {
            const panel = this;

            panel.$.canvas.addEventListener('mousedown', (event) => {
                // event.target.requestPointerLock();
                Editor.Message.send('scene', 'on-model-preview-mouse-down', { x: event.x, y: event.y });
                function mousemove (event) {
                    Editor.Message.send('scene', 'on-model-preview-mouse-move', {
                        movementX: event.movementX,
                        movementY: event.movementY,
                    });

                    panel.isPreviewDataDirty = true;
                }

                function mouseup (event) {
                    // document.exitPointerLock();

                    Editor.Message.send('scene', 'on-model-preview-mouse-up', {
                        x: event.x,
                        y: event.y,
                    });

                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);

                    panel.isPreviewDataDirty = false;
                }

                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);

                panel.isPreviewDataDirty = true;
            });

            const GlPreview = Editor._Module.require('PreviewExtends').default;
            panel.glPreview = new GlPreview('scene:model-preview', 'query-model-preview-data');
            panel.isPreviewDataDirty = true;
        },
        async update () {
            const panel = this;

            await panel.glPreview.init({ width: panel.$.canvas.clientWidth, height: panel.$.canvas.clientHeight });
            if (panel.asset.redirect) {
                await Editor.Message.request('scene', 'set-model-preview-model', panel.asset.redirect.uuid);
            }

            // After await, the panel no longer exists
            if (!panel.$.canvas) {
                return;
            }

            panel.refreshPreview();
        },
    },
    modelInfo: {
        ready () {
            this.infoUpdate = Elements.modelInfo.update.bind(this);
            Editor.Message.addBroadcastListener('scene:model-preview-model-info', this.infoUpdate);
        },
        update (info) {
            if (!info) {
                return;
            }
            this.$.vertices.value = `Vertices:${info.vertices}`;
            this.$.triangles.value = `Triangles:${info.polygons}`;
            this.isPreviewDataDirty = true;
        },
        close () {
            Editor.Message.removeBroadcastListener('scene:model-preview-model-info', this.infoUpdate);
            Editor.Message.send('scene', 'hide-model-preview');
        },
    },
};

exports.update = function (assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }
    this.setCurPlayState(PLAY_STATE.STOP);
    this.refreshPreview();
};

exports.ready = function () {
    function data () {
        return {
            gridWidth: 0,
            gridTableWith: 0,
            activeTab: 'animation',
            isPreviewDataDirty: true,
            curEditClipInfo: null,
            curPlayState: PLAY_STATE.STOP,
            curTotalFrames: 0,
        };
    }
    Object.assign(this, data());
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
    this.onTabChangedCallback = this.onTabChanged.bind(this);
    this.onModelAnimationUpdateCallback = this.onModelAnimationUpdate.bind(this);
    this.onAnimationPlayStateChangedCallback = this.onAnimationPlayStateChanged.bind(this);
    this.onEditClipInfoChanged = async (clipInfo) => {
        if (clipInfo) {
            await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'setEditClip', clipInfo.clipUUID);
            this.setCurEditClipInfo(clipInfo);
            console.log('clip info', clipInfo);
        }
    };
    Editor.Message.addBroadcastListener('scene:model-preview-animation-time-change', this.onModelAnimationUpdateCallback);
    Editor.Message.addBroadcastListener('scene:model-preview-animation-state-change', this.onAnimationPlayStateChangedCallback);
    Editor.Message.addBroadcastListener('fbx-inspector:change-tab', this.onTabChangedCallback);
    Editor.Message.addBroadcastListener('fbx-inspector:animation-change', this.onEditClipInfoChanged);
};

exports.close = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }

    Editor.Message.removeBroadcastListener('scene:model-preview-animation-time-change', this.onModelAnimationUpdateCallback);
    Editor.Message.removeBroadcastListener('scene:model-preview-animation-state-change', this.onAnimationPlayStateChangedCallback);
    Editor.Message.removeBroadcastListener('fbx-inspector:change-tab', this.onTabChangedCallback);
};

exports.methods = {
    async refreshPreview () {
        const panel = this;

        if (!panel.$.canvas) {
            return;
        }

        if (panel.isPreviewDataDirty) {
            try {
                const canvas = panel.$.canvas;
                const image = panel.$.image;

                const width = image.clientWidth;
                const height = image.clientHeight;
                if (canvas.width !== width || canvas.height !== height) {
                    canvas.width = width;
                    canvas.height = height;

                    panel.glPreview.initGL(canvas, { width, height });
                    panel.glPreview.resizeGL(width, height);
                }

                const info = await panel.glPreview.queryPreviewData({
                    width: canvas.width,
                    height: canvas.height,
                });

                panel.glPreview.drawGL(info.buffer, info.width, info.height);
            } catch (e) {
                console.warn(e);
            }

            panel.isPreviewDataDirty = false;
        }

        cancelAnimationFrame(panel.animationId);
        panel.animationId = requestAnimationFrame(() => {
            panel.refreshPreview();
        });
    },
    async onTabChanged (activeTab) {
        if (typeof activeTab === 'string') {
            this.activeTab = activeTab;
            this.$.animationInfo.style.display = this.activeTab === 'animation' ? '' : 'none';
            this.$.modelInfo.style.display = this.activeTab === 'model' ? '' : 'none';
            await this.stopAnimation();
        }
    },
    async onStopButtonClick (event) {
        event.stopPropagation();
        await this.stopAnimation();
    },
    async stopAnimation () {
        await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'stop');
    },
    async onPlayButtonClick (event) {
        event.stopPropagation();
        console.log('play button clicked', this.curEditClipInfo);
        if (this.curEditClipInfo) {
            switch (this.curPlayState) {
            case PLAY_STATE.PAUSE:
                await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'resume');
                break;
            case PLAY_STATE.PLAYING:
                await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'pause');
                break;
            case PLAY_STATE.STOP:
                await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'play', this.curEditClipInfo.clipUUID);
                break;
            default:
                break;
            }

            this.isPreviewDataDirty = true;
        }
    },
    async onAnimationTimeSliderChange (event) {
        event.stopPropagation();
        const frame = event.target.value;
        const curTime = (frame / this.curTotalFrames) * this.curEditClipInfo.duration;
        await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'setCurEditTime', curTime);
        this.isPreviewDataDirty = true;
    },

    onAnimationTimeSliderConfirm (event) {
        event.stopPropagation();
    },

    onModelAnimationUpdate (time) {
        if (this.$.animationTimeSlider) {
            this.$.animationTimeSlider.value = Math.round((time - this.curEditClipInfo.from) * this.curEditClipInfo.fps);
        }
        if (this.$.timeLabel) {
            this.$.timeLabel.value = `Time:${(time - this.curEditClipInfo.from).toFixed(2)}(s)`;
        }

        this.isPreviewDataDirty = true;
    },
    setCurPlayState (state) {
        this.curPlayState = state;
        let buttonIconName = '';
        switch (state) {
        case PLAY_STATE.STOP:
            buttonIconName = 'play';
            break;
        case PLAY_STATE.PLAYING:
            buttonIconName = 'pause';
            break;
        case PLAY_STATE.PAUSE:
            buttonIconName = 'play';
            break;
        default:
            break;
        }

        if (this.$.playButtonIcon) {
            this.$.playButtonIcon.value = buttonIconName;
        }
    },
    async setCurEditClipInfo (clipInfo) {
        this.curEditClipInfo = clipInfo;
        if (clipInfo) {
            this.curTotalFrames = Math.round(clipInfo.duration * clipInfo.fps);
            if (this.$.animationTimeSlider) {
                this.$.animationTimeSlider.max = this.curTotalFrames;
            }
            await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'setPlaybackRange', clipInfo.from, clipInfo.to);
            await this.stopAnimation();
        }
    },
    onAnimationPlayStateChanged (state) {
        this.setCurPlayState(state);
    },
};
