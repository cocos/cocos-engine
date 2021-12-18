const animation = require('./animation');
const events = require('./events');
const eventEditor = require('./event-editor');

exports.template = /* html */`
<div class="multiple tips">
    <ui-label class="big" value="i18n:ENGINE.assets.fbx.modelPreview"></ui-label>
    <ui-label value="i18n:ENGINE.assets.multipleWarning"></ui-label>
</div>
<ui-drag-area class="preview" droppable="cc.Asset">
    <div class= "noModel tips">
        <ui-label class="big" value="i18n:ENGINE.assets.fbx.no_model_tips"></ui-label>
        <ui-label value="i18n:ENGINE.assets.fbx.drag_model_tips"></ui-label>
    </div>    
    <div class="preview-container">
        <div class="animation-info">
            <div class="flex">
                <div class="toolbar" id="timeCtrl">
                    <ui-icon value="rewind" name="jump_first_frame"></ui-icon>
                    <ui-icon value="prev-play" name="jump_prev_frame"></ui-icon>
                    <ui-icon id="playButtonIcon" value="play" name="play"></ui-icon>
                    <ui-icon value="next-play" name="jump_next_frame"></ui-icon>
                    <ui-icon value="forward" name="jump_last_frame"></ui-icon>
                    <ui-icon value="stop" name="stop"></ui-icon>
                    <ui-icon value="event" name="add_event"></ui-icon>
                </div>
                <div class="time flex toolbar f1">
                    <ui-label value="Time"></ui-label>
                    <ui-num-input id="currentTime"></ui-num-input>
                    <div class="duration"></div>
                </div>
            </div>
            <div class="time-line">
                <ui-scale-plate tooltip="Frame" id="animationTime"></ui-scale-plate>
                <div class="events"></div>
            </div>
        </div>
        <div class="model-info">
            <ui-label value="Vertices:0" class="vertices"></ui-label>
            <ui-label value="Triangles:0" class="triangles"></ui-label>
        </div>

        <div class="event-editor">
        </div>

        <div class="image">
            <canvas class="canvas"></canvas>
        </div>
    </div>
</ui-drag-area>
`;

exports.style = /* css*/`
.tips {
    text-align: center;
    min-height: 200px;
    padding-top: 16px;
    border-top: 1px solid var(--color-normal-border);
}
.tips > ui-label {
    display: block;
}
.tips > ui-label.big {
    font-size: 14px;
}
.flex {
    display: flex;
}

.f1 {
    flex: 1;
}
.preview-container {
    min-height: 200px;
    margin-top: 10px;
    border-top: 1px solid var(--color-normal-border);
}
.preview[hoving] > .preview-container {
    outline: 2px solid var(--color-focus-fill-weaker);
    outline-offset: -1px;
}
.preview[hoving] > .tips {
    outline: 2px solid var(--color-focus-fill-weaker);
    outline-offset: -2px;
}
.preview-container > .model-info {
    padding-top: 5px;
    display: none;
}
.preview-container > .model-info > ui-label {
    margin-right: 6px;
}
.preview-container > .image {
    height: 200px;
    overflow: hidden;
    display: flex;
    flex: 1;
    margin: 2px;
}
.preview-container >.image > .canvas {
    flex: 1;
}
.preview-container .toolbar {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
}

.preview-container .toolbar ui-num-input {
    display: flex;
    flex: 1;
}
.preview-container .toolbar > * {
    line-height: 25px;
    margin-right: 5px;
}

ui-icon {
    cursor: pointer;
}

.time-line {
    position: relative;
}

.time-line .events {
    position: absolute;
    bottom: 5px;
    box-sizing: border-box;
    padding: 0 8px;
    width: 100%;
}
.time-line ui-scale-plate {
    width: 100%;
}

.events ui-icon {
    position: absolute;
    bottom: -4px;
}

.events ui-icon:hover {
    color: white;
    cursor: pointer;
}
.events ui-icon[active] {
    color: var(--color-focus-fill);
}
.mask {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100vh;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: var(--color-normal-fill);
    opacity: 0.3;
}

.event-editor {
    background: var(--color-normal-fill);
}
#event-editor {
    line-height: 24px;
    width: 100%;
    height: 70%;
    overflow: hidden;
    margin: 0 auto;
    background: #312f2f;
    display: flex;
    flex-direction: column;
    border: var(--color-normal-fill-emphasis) 1px solid;
    box-sizing: border-box;
  }
  #event-editor > header {
    display: flex;
    justify-content: space-between;
    height: 24px;
    background: var(--color-normal-fill-emphasis);
    padding: 5px;
  }
  #event-editor > .header .name {
    margin: 0 5px;
  }
  #event-editor > .header .dirty {
    color: var(--color-focus-fill);
    margin: 0 2px;
  }
  #event-editor > .functions {
    padding: 10px;
    overflow-y: auto;
    flex: 1;
    height: 100%;
    padding-top: 0;
    background: var(--color-normal-fill-normal);
    margin-bottom: 2px;
  }
  #event-editor > .functions .header,
  #event-editor > .functions .line {
    display: flex;
    justify-content: space-between;
    padding: 0 8px;
    flex: 1;
    background: unset;
  }
  #event-editor > .functions .line {
    margin-bottom: 4px;
  }
  #event-editor > .functions .line .name {
    min-width: 8px;
  }
  #event-editor > .functions .line > * {
    margin-right: 5px;
  }
  #event-editor > .functions .line .operate {
    visibility: hidden;
  }
  #event-editor > .functions .line:hover .operate {
    visibility: visible;
  }
  #event-editor > .functions .header ui-input {
    background-color: transparent;
    border-color: transparent;
    line-height: 18px;
  }
  #event-editor > .functions .header ui-input:hover {
    background-color: var(--color-normal-fill-emphasis);
  }
  #event-editor > .functions > * {
    margin-top: 10px;
  }
  #event-editor ui-input,
  #event-editor ui-checkbox,
  #event-editor ui-num-input {
    width: 100%;
    height: 25px;
  }
  #event-editor ui-section {
    width: 100%;
  }
  #event-editor ui-icon:hover {
    cursor: pointer;
    color: #cccccc;
  }
  #event-editor .tools {
    display: flex;
    border-bottom: 1px solid;
    padding: 10px 0;
  }
  #event-editor .tools ui-icon {
    margin: 0 5px;
  }
  #event-editor .params {
    border: 1px rgba(136, 136, 136, 0.35) dashed;
    border-radius: calc(var(--size-normal-radius) * 1px);
  }
  #event-editor .header ui-icon,
  #event-editor .params ui-icon {
    margin: 0 5px;
  }
  #event-editor .empty {
    font-style: italic;
    text-align: center;
  }
`;

const PLAY_STATE = {
    STOP: 0,
    PLAYING: 1,
    PAUSE: 2,
};

exports.$ = {
    noModel: '.noModel',
    multiple: '.multiple',
    container: '.preview',
    previewContainer: '.preview-container',
    vertices: '.vertices',
    triangles: '.triangles',
    image: '.image',
    canvas: '.canvas',
    animationInfo: '.animation-info',
    modelInfo: '.model-info',
    playButtonIcon: '#playButtonIcon',
    animationTime: '#animationTime',
    currentTime: '#currentTime',
    events: ".events",
    duration: ".duration",
    eventEditor: ".event-editor",
    timeCtrl: "#timeCtrl",
};

async function callModelPreviewFunction(funcName, ...args) {
    return await Editor.Message.request('scene', 'call-preview-function', 'scene:model-preview', funcName, ...args);
}

const Elements = {
    container: {
        ready() {
            const panel = this;

            function observer() {
                panel.isPreviewDataDirty = true;
            }

            panel.resizeObserver = new window.ResizeObserver(observer);
            panel.resizeObserver.observe(panel.$.container);

            // Identify dragged FBX resources
            panel.$.container.addEventListener('drop', async (event) => {
                event.preventDefault();
                event.stopPropagation();
                // Multiple drag-and-drop options are not supported, and only the first value is taken
                const values = [];
                const { additional, value } = JSON.parse(JSON.stringify(Editor.UI.DragArea.currentDragInfo)) || {};
                if (additional) {
                    additional.forEach((info) => {
                        if (info.type === 'cc.Prefab') {
                            values.push(info.value);
                        }
                    });
                }

                if (value && !values.includes(value)) {
                    values.push(value);
                }

                if (!values.length) {
                    return;
                }
                const info = await callModelPreviewFunction('setModel', values[0]);
                panel.infoUpdate(info);
            });

        },
        close() {
            const panel = this;
            panel.resizeObserver.unobserve(panel.$.container);
        },
    },
    preview: {
        ready() {
            const panel = this;
            panel.$.canvas.addEventListener('mousedown', async (event) => {
                await callModelPreviewFunction('onMouseDown', { x: event.x, y: event.y });

                async function mousemove(event) {
                    await callModelPreviewFunction('onMouseMove', {
                        movementX: event.movementX,
                        movementY: event.movementY,
                    });

                    panel.isPreviewDataDirty = true;
                }

                async function mouseup(event) {
                    await callModelPreviewFunction('onMouseUp', {
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
                const info = await callModelPreviewFunction('setModel', panel.asset.redirect.uuid);
                panel.infoUpdate(info);
            } else {
                this.updatePanelHidden(false);
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
            this.updatePanelHidden(true);
        },
        close() {
            callModelPreviewFunction('hide');
        },
    },
    animationTime: {
        ready() {
            const timeline = this.$.animationTime;
            timeline.addEventListener('change', this.onAnimationTimeChange.bind(this));
            timeline.addEventListener('transform', this.updateEventInfo.bind(this));
        },
    },
    currentTime: {
        ready() {
            const currentTime = this.$.currentTime;
            currentTime.addEventListener('confirm', this.onAnimationTimeChange.bind(this));
        },
    },
    timeCtrl: {
        ready() {
            this.$.timeCtrl.addEventListener('click', this.onTimeCtrlClick.bind(this));
        },
    },
};

exports.update = async function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.isMultiple = this.assetList.length > 1;
    this.$.previewContainer.hidden = this.isMultiple;
    this.$.multiple.hidden = !this.isMultiple;
    this.$.noModel.hidden = true;
    if (this.isMultiple) {
        return;
    }
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
            await callModelPreviewFunction('setEditClip', clipInfo.rawClipUUID, clipInfo.rawClipIndex);
            await this.setCurEditClipInfo(clipInfo);
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

    this.onAssetChangeBind = this.onAssetChange.bind(this);
    this.addAssetChangeListener(true);

    this.events = events;
    this.events.ready.call(this);

    this.eventEditor = eventEditor;
    this.events.eventsMap = {};
    this.eventEditor.ready.call(this);
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

    this.addAssetChangeListener(false);
};

exports.methods = {
    /**
     * 
     * @param {boolean} hasModel 
     */
    updatePanelHidden(hasModel) {
        this.$.noModel.hidden = hasModel;
        this.$.previewContainer.hidden = this.isMultiple || !hasModel;
        this.$.multiple.hidden = !this.isMultiple;
    },
    async apply() {
        // save animation event info
        await this.events.apply.call(this);
    },
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
            this.$.animationInfo.style.display = this.activeTab === 'animation' ? 'block' : 'none';
            this.$.modelInfo.style.display = this.activeTab === 'model' ? 'block' : 'none';
            await this.stopAnimation();
        }
    },

    onTimeCtrlClick(event) {
        const name = event.target.getAttribute('name');
        if (!name || !this.curEditClipInfo) {
            return;
        }
        switch (name) {
            case 'play':
                this.onPlayButtonClick();
                break;
            case 'stop':
                this.stopAnimation();
                break;
            case 'jump_first_frame':
                this.setCurrentFrame(0);
                break;
            case 'jump_next_frame':
                this.setCurrentFrame(this.$.currentTime.value + 1);
                break;
            case 'jump_prev_frame':
                this.setCurrentFrame(this.$.currentTime.value - 1);
                break;
            case 'jump_last_frame':
                this.setCurrentFrame(this.curTotalFrames);
                break;
            case 'add_event':
                if (this.checkDisabledEditEvent()) {
                    return;
                }
                this.addEventToCurTime();
                break;
        }
    },

    checkDisabledEditEvent() {
        if (!this.curEditClipInfo.userData) {
            Editor.Dialog.info(Editor.I18n.t('ENGINE.assets.fbx.addEvent.shouldSave'), {
                buttons: [Editor.I18n.t('ENGINE.assets.fbx.addEvent.ok')],
            });
            return true;
        }
        return false;
    },

    addEventToCurTime() {
        this.events.addNewEvent.call(this, this.$.animationTime.value / this.curEditClipInfo.fps);
    },

    updateEventInfo() {
        const events = this.curEditClipInfo.userData.events;
        const eventInfos = events.map((info) => {
            return {
                ...info,
                x: this.$.animationTime.valueToPixel(info.frame * this.curEditClipInfo.fps),
            };
        });
        this.events.update.call(this, eventInfos);
    },

    async stopAnimation() {
        if (!this.curEditClipInfo) {
            return;
        }

        await callModelPreviewFunction('stop');
    },
    async onPlayButtonClick() {
        if (!this.curEditClipInfo) {
            return;
        }
        switch (this.curPlayState) {
            case PLAY_STATE.PAUSE:
                await callModelPreviewFunction('resume');
                break;
            case PLAY_STATE.PLAYING:
                await callModelPreviewFunction('pause');
                break;
            case PLAY_STATE.STOP:
                await callModelPreviewFunction('play', this.curEditClipInfo.rawClipUUID);
                break;
            default:
                break;
        }

        this.isPreviewDataDirty = true;
    },
    async onAnimationTimeChange(event) {
        event.stopPropagation();
        if (!this.curEditClipInfo) {
            return;
        }

        const frame = event.target.value;
        await this.setCurrentFrame(frame);
        this.isPreviewDataDirty = true;
    },

    async setCurrentFrame(frame) {
        frame = Editor.Utils.Math.clamp(frame, 0, this.curTotalFrames);

        const curTime = frame / this.curEditClipInfo.fps + this.curEditClipInfo.from;
        await callModelPreviewFunction('setCurEditTime', curTime);
    },

    onModelAnimationUpdate(time) {
        if (!this.curEditClipInfo) {
            return;
        }
        if (this.$.animationTime) {
            let timeFromRangeStart = Math.max(time - this.curEditClipInfo.from, 0);

            this.$.animationTime.value = Math.round(timeFromRangeStart * this.curEditClipInfo.fps);
            this.$.currentTime.value = this.$.animationTime.value;
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
            this.$.animationTime.setConfig({
                max: this.curTotalFrames,
            });
            this.$.duration.innerHTML = `Duration: ${this.curTotalFrames}`;
            // update animation events, clipInfo.clipUUID may be undefined
            if (clipInfo.clipUUID) {
                const subId = clipInfo.clipUUID.match(/@(.*)/)[1];
                this.curEditClipInfo.userData = this.meta.subMetas[subId] && this.meta.subMetas[subId].userData || {};
                this.updateEventInfo();
            }

            if (this.$.animationTimeSlider) {
                this.$.animationTimeSlider.max = this.curTotalFrames;
            }
            await callModelPreviewFunction(
                'setPlaybackRange',
                clipInfo.from,
                clipInfo.to,
            );

            await Editor.Message.request(
                'scene',
                'execute-model-preview-animation-operation',
                'setClipConfig',
                {
                    wrapMode: clipInfo.wrapMode,
                    speed: clipInfo.speed,
                }
            );

            await this.stopAnimation();
        }
    },
    onAnimationPlayStateChanged(state) {
        this.setCurPlayState(state);
    },

    addAssetChangeListener(add = true) {
        if (!add && this.hasListenAssetsChange) {
            Editor.Message.removeBroadcastListener('asset-db:asset-change', this.onAssetChangeBind);
            this.hasListenAssetsChange = false;
            return;
        }
        Editor.Message.addBroadcastListener('asset-db:asset-change', this.onAssetChangeBind);
        this.hasListenAssetsChange = true;
    },

    async onAssetChange(uuid) {
        if (this.asset.uuid === uuid) {
            // Update the animation dump when the parent assets changes
            this.meta = await Editor.Message.request('asset-db', 'query-asset-meta', this.asset.uuid);
            const clipInfo = animation.methods.getCurClipInfo.call(this);
            await this.onEditClipInfoChanged(clipInfo);
        }
    },
};
