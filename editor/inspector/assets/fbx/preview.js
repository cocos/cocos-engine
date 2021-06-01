const animation = require('./animation');

exports.template = `
<div class="preview">
    <div class="animation-info">
        <ui-button class="button" id="playButton" tooltip="Play">
            <ui-icon value="play" id="playButtonIcon"></ui-icon>
        </ui-button>
        <ui-button class="button" id="stopButton" tooltip="Stop">
            <ui-icon value="stop"></ui-icon>
        </ui-button>
        <ui-slider class="slider" tooltip="Frame"
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
    padding-top: 5px;
    display: none;
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
.preview .animation-info {
    display: flex;
    margin-top: 10px;
}
.preview .animation-info .button {
    padding: 0 5px;
    line-height: 25px;
    margin-right: 10px;
}
.preview .animation-info .slider {
    flex: 1;
}
`;

const PLAY_STATE = {
    STOP: 0,
    PLAYING: 1,
    PAUSE: 2,
};

exports.$ = {
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
        ready() {
            this.$.playButton.addEventListener('confirm', this.onPlayButtonClick.bind(this));
        },
    },
    stopButton: {
        ready() {
            this.$.stopButton.addEventListener('confirm', this.onStopButtonClick.bind(this));
        },
    },
    animationTimeSlider: {
        ready() {
            const slider = this.$.animationTimeSlider;
            slider.addEventListener('change', this.onAnimationTimeSliderChange.bind(this));
        },
    },
    preview: {
        ready() {
            const panel = this;

            panel.$.canvas.addEventListener('mousedown', async (event) => {
                await Editor.Message.request('scene', 'on-model-preview-mouse-down', { x: event.x, y: event.y });

                async function mousemove(event) {
                    await Editor.Message.request('scene', 'on-model-preview-mouse-move', {
                        movementX: event.movementX,
                        movementY: event.movementY,
                    });

                    panel.isPreviewDataDirty = true;
                }

                async function mouseup(event) {
                    await Editor.Message.request('scene', 'on-model-preview-mouse-up', {
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
        async update() {
            const panel = this;

            if (!panel.$.canvas) {
                return;
            }

            await panel.glPreview.init({ width: panel.$.canvas.clientWidth, height: panel.$.canvas.clientHeight });
            if (panel.asset.redirect) {
                const info = await Editor.Message.request('scene', 'set-model-preview-model', panel.asset.redirect.uuid);
                panel.infoUpdate(info);
            }

            panel.refreshPreview();
        },
    },
    modelInfo: {
        ready() {
            this.infoUpdate = Elements.modelInfo.update.bind(this);
        },
        update(info) {
            if (!info) {
                return;
            }
            this.$.vertices.value = `Vertices:${info.vertices}`;
            this.$.triangles.value = `Triangles:${info.polygons}`;
            this.isPreviewDataDirty = true;
        },
        close() {
            Editor.Message.send('scene', 'hide-model-preview');
        },
    },
};

exports.update = async function(assetList, metaList) {
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
    animation.methods.initAnimationNameToUUIDMap.call(this);
    animation.methods.initAnimationInfos.call(this);
    if (this.animationInfos) {
        this.rawClipIndex = 0;
        this.splitClipIndex = 0;
        const clipInfo = animation.methods.getCurClipInfo.call(this);
        await this.onEditClipInfoChanged(clipInfo);
    }
    this.setCurPlayState(PLAY_STATE.STOP);
    this.isPreviewDataDirty = true;
    this.refreshPreview();
};

exports.ready = function() {
    const panel = this;

    this.gridWidth = 0;
    this.gridTableWith = 0;
    this.activeTab = 'animation';
    this.isPreviewDataDirty = true;
    this.curEditClipInfo = null;
    this.curPlayState = PLAY_STATE.STOP;
    this.curTotalFrames = 0;
    this.onTabChangedBind = this.onTabChanged.bind(this);
    this.onModelAnimationUpdateBind = this.onModelAnimationUpdate.bind(this);
    this.onAnimationPlayStateChangedBind = this.onAnimationPlayStateChanged.bind(this);
    this.onEditClipInfoChanged = async (clipInfo) => {
        if (clipInfo) {
            await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'setEditClip', clipInfo.clipUUID);
            this.setCurEditClipInfo(clipInfo);
        }
    };

    Editor.Message.addBroadcastListener('scene:model-preview-animation-time-change', this.onModelAnimationUpdateBind);
    Editor.Message.addBroadcastListener('scene:model-preview-animation-state-change', this.onAnimationPlayStateChangedBind);
    Editor.Message.addBroadcastListener('fbx-inspector:change-tab', this.onTabChangedBind);
    Editor.Message.addBroadcastListener('fbx-inspector:animation-change', this.onEditClipInfoChanged);

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }

    function observer() {
        panel.isPreviewDataDirty = true;
    }

    panel.resizeObserver = new window.ResizeObserver(observer);
    panel.resizeObserver.observe(panel.$.container);
};

exports.close = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }

    Editor.Message.removeBroadcastListener('scene:model-preview-animation-time-change', this.onModelAnimationUpdateBind);
    Editor.Message.removeBroadcastListener('scene:model-preview-animation-state-change', this.onAnimationPlayStateChangedBind);
    Editor.Message.removeBroadcastListener('fbx-inspector:change-tab', this.onTabChangedBind);
    Editor.Message.removeBroadcastListener('fbx-inspector:animation-change', this.onEditClipInfoChanged);

    this.resizeObserver.unobserve(this.$.container);
};

exports.methods = {
    async refreshPreview() {
        const panel = this;

        // After await, the panel no longer exists
        if (!panel.$.canvas) {
            return;
        }

        if (panel.isPreviewDataDirty || this.curPlayState === PLAY_STATE.PLAYING) {
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
    async onTabChanged(activeTab) {
        if (typeof activeTab === 'string') {
            this.activeTab = activeTab;
            this.$.animationInfo.style.display = this.activeTab === 'animation' ? 'flex' : 'none';
            this.$.modelInfo.style.display = this.activeTab === 'model' ? 'block' : 'none';
            await this.stopAnimation();
        }
    },
    async onStopButtonClick(event) {
        event.stopPropagation();
        if (!this.curEditClipInfo) {
            return;
        }

        await this.stopAnimation();
    },
    async stopAnimation() {
        if (!this.curEditClipInfo) {
            return;
        }

        await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'stop');
    },
    async onPlayButtonClick(event) {
        event.stopPropagation();
        if (!this.curEditClipInfo) {
            return;
        }
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
    },
    async onAnimationTimeSliderChange(event) {
        event.stopPropagation();
        if (!this.curEditClipInfo) {
            return;
        }

        const frame = event.target.value;
        const curTime = (frame / this.curTotalFrames) * this.curEditClipInfo.duration;
        await Editor.Message.request('scene', 'execute-model-preview-animation-operation', 'setCurEditTime', curTime);
        this.isPreviewDataDirty = true;
    },

    onModelAnimationUpdate(time) {
        if (!this.curEditClipInfo) {
            return;
        }

        if (this.$.animationTimeSlider) {
            this.$.animationTimeSlider.value = Math.round((time - this.curEditClipInfo.from) * this.curEditClipInfo.fps);
        }
        if (this.$.timeLabel) {
            this.$.timeLabel.value = `Time:${(time - this.curEditClipInfo.from).toFixed(2)}(s)`;
        }

        this.isPreviewDataDirty = true;
    },
    setCurPlayState(state) {
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
    async setCurEditClipInfo(clipInfo) {
        this.curEditClipInfo = clipInfo;
        if (clipInfo) {
            this.curTotalFrames = Math.round(clipInfo.duration * clipInfo.fps);
            if (this.$.animationTimeSlider) {
                this.$.animationTimeSlider.max = this.curTotalFrames;
            }
            await Editor.Message.request(
                'scene',
                'execute-model-preview-animation-operation',
                'setPlaybackRange',
                clipInfo.from,
                clipInfo.to,
            );
            await this.stopAnimation();
        }
    },
    onAnimationPlayStateChanged(state) {
        this.setCurPlayState(state);
    },
};
