/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @hidden
 */

import { CanvasComponent } from '../../core/components/ui-base/canvas-component';
import { Director, director } from '../../core/director';
import { Vec2, Vec3 } from '../../core/math';
import { sys } from '../../core/platform/sys';
import { View } from '../../core/platform/view';
import visibleRect from '../../core/platform/visible-rect';
import { Scene } from '../../core/scene-graph';
import { Node } from '../../core/scene-graph/node';
import { array } from '../../core/utils/js';
import { AlignFlags, AlignMode, computeInverseTransForTarget, getReadonlyNodeSize, WidgetComponent } from './widget-component';
import { UITransformComponent } from '../../core/components';
import { EDITOR, DEV } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';
import { warnID } from '../../core/platform/debug';

const _tempPos = new Vec3();
const _defaultAnchor = new Vec2();

const tInverseTranslate = new Vec3();
const tInverseScale = new Vec3(1, 1, 1);

// align to borders by adjusting node's position and size (ignore rotation)
function align (node: Node, widget: WidgetComponent) {
    const hasTarget = widget.target;
    let target: any;
    const inverseTranslate = tInverseTranslate;
    const inverseScale = tInverseScale;
    if (hasTarget) {
        target = hasTarget;
        // inverseTranslate = tInverseTranslate;
        // inverseScale = tInverseScale;
        computeInverseTransForTarget(node, target, inverseTranslate, inverseScale);
    } else {
        target = node.parent;
    }
    if (!target.getComponent (UITransformComponent)) {
        return;
    }
    const targetSize = getReadonlyNodeSize(target);
    const isScene = target instanceof Scene;
    const targetAnchor = isScene ? _defaultAnchor : target.getAnchorPoint();

    // @ts-ignore
    const isRoot = !EDITOR && isScene;
    node.getPosition(_tempPos);
    let x = _tempPos.x;
    let y = _tempPos.y;
    const anchor = node.getAnchorPoint();
    const scale = node.getScale();

    if (widget.alignFlags & AlignFlags.HORIZONTAL) {
        let localLeft = 0;
        let localRight = 0;
        const targetWidth = targetSize.width;
        if (isRoot) {
            localLeft = visibleRect.left.x;
            localRight = visibleRect.right.x;
        } else {
            localLeft = -targetAnchor.x * targetWidth;
            localRight = localLeft + targetWidth;
        }

        // adjust borders according to offsets
        localLeft += widget.isAbsoluteLeft ? widget.left : widget.left * targetWidth;
        localRight -= widget.isAbsoluteRight ? widget.right : widget.right * targetWidth;

        if (hasTarget) {
            localLeft += inverseTranslate.x;
            localLeft *= inverseScale.x;
            localRight += inverseTranslate.x;
            localRight *= inverseScale.x;
        }

        let width = 0;
        let anchorX = anchor.x;
        let scaleX = scale.x;
        if (scaleX < 0) {
            anchorX = 1.0 - anchorX;
            scaleX = -scaleX;
        }
        if (widget.isStretchWidth) {
            width = localRight - localLeft;
            if (scaleX !== 0) {
                node.width = width / scaleX;
            }
            x = localLeft + anchorX * width;
        } else {
            width = node.width * scaleX;
            if (widget.isAlignHorizontalCenter) {
                let localHorizontalCenter = widget.isAbsoluteHorizontalCenter ?
                widget.horizontalCenter : widget.horizontalCenter * targetWidth;
                let targetCenter = (0.5 - targetAnchor.x) * targetSize.width;
                if (hasTarget) {
                    localHorizontalCenter *= inverseScale.x;
                    targetCenter += inverseTranslate.x;
                    targetCenter *= inverseScale.x;
                }
                x = targetCenter + (anchorX - 0.5) * width + localHorizontalCenter;
            } else if (widget.isAlignLeft) {
                x = localLeft + anchorX * width;
            } else {
                x = localRight + (anchorX - 1) * width;
            }
        }

        widget._lastSize.width = width;
    }

    if (widget.alignFlags & AlignFlags.VERTICAL) {

        let localTop = 0;
        let localBottom = 0;
        const targetHeight = targetSize.height;
        if (isRoot) {
            localBottom = visibleRect.bottom.y;
            localTop = visibleRect.top.y;
        } else {
            localBottom = -targetAnchor.y * targetHeight;
            localTop = localBottom + targetHeight;
        }

        // adjust borders according to offsets
        localBottom += widget.isAbsoluteBottom ? widget.bottom : widget.bottom * targetHeight;
        localTop -= widget.isAbsoluteTop ? widget.top : widget.top * targetHeight;

        if (hasTarget) {
            // transform
            localBottom += inverseTranslate.y;
            localBottom *= inverseScale.y;
            localTop += inverseTranslate.y;
            localTop *= inverseScale.y;
        }

        let height = 0;
        let anchorY = anchor.y;
        let scaleY = scale.y;
        if (scaleY < 0) {
            anchorY = 1.0 - anchorY;
            scaleY = -scaleY;
        }
        if (widget.isStretchHeight) {
            height = localTop - localBottom;
            if (scaleY !== 0) {
                node.height = height / scaleY;
            }
            y = localBottom + anchorY * height;
        } else {
            height = node.height * scaleY;
            if (widget.isAlignVerticalCenter) {
                let localVerticalCenter = widget.isAbsoluteVerticalCenter ?
                widget.verticalCenter : widget.verticalCenter * targetHeight;
                let targetMiddle = (0.5 - targetAnchor.y) * targetSize.height;
                if (hasTarget) {
                    localVerticalCenter *= inverseScale.y;
                    targetMiddle += inverseTranslate.y;
                    targetMiddle *= inverseScale.y;
                }
                y = targetMiddle + (anchorY - 0.5) * height + localVerticalCenter;
            } else if (widget.isAlignBottom) {
                y = localBottom + anchorY * height;
            } else {
                y = localTop + (anchorY - 1) * height;
            }
        }

        widget._lastSize.height = height;
    }

    node.setPosition(x, y, _tempPos.z);
    Vec3.set(widget._lastPos, x, y, _tempPos.z);
}

// TODO: type is hack, Change to the type actually used (Node or BaseNode) when BaseNode complete
function visitNode (node: any) {
    const widget = node.getComponent(WidgetComponent);
    if (widget) {
        // @ts-ignore
        if (DEV) {
            widget._validateTargetInDEV();
        }
        align(node, widget);
        // @ts-ignore
        if ((!EDITOR || widgetManager.animationState!.animatedSinceLastFrame) && widget.alignMode !== AlignMode.ALWAYS) {
            widget.enabled = false;
        } else {
            if (legacyCC.isValid(node, true)) {
                activeWidgets.push(widget);
            } else {
                return;
            }
        }
    }
    const children = node.children;
    for (const child of children) {
        if (child.active) {
            visitNode(child);
        }
    }
}

// if (EDITOR) {
//     const animationState = {
//         previewing: false,
//         time: 0,
//         animatedSinceLastFrame: false,
//     };
// }

function refreshScene () {
    // check animation editor
    // if (EDITOR && !Editor.isBuilder) {
        // var AnimUtils = Editor.require('scene://utils/animation');
        // var EditMode = Editor.require('scene://edit-mode');
        // if (AnimUtils && EditMode) {
        //     var nowPreviewing = (EditMode.curMode().name === 'animation' && !!AnimUtils.Cache.animation);
        //     if (nowPreviewing !== animationState.previewing) {
        //         animationState.previewing = nowPreviewing;
        //         if (nowPreviewing) {
        //             animationState.animatedSinceLastFrame = true;
        //             let component = cc.engine.getInstanceById(AnimUtils.Cache.component);
        //             if (component) {
        //                 let animation = component.getAnimationState(AnimUtils.Cache.animation);
        //                 animationState.time = animation.time;
        //             }
        //         }
        //         else {
        //             animationState.animatedSinceLastFrame = false;
        //         }
        //     }
        //     else if (nowPreviewing) {
        //         let component = cc.engine.getInstanceById(AnimUtils.Cache.component);
        //         if (component) {
        //             let animation = component.getAnimationState(AnimUtils.Cache.animation);
        //             if (animationState.time !== animation.time) {
        //                 animationState.animatedSinceLastFrame = true;
        //                 animationState.time = AnimUtils.Cache.animation.time;
        //             }
        //         }
        //     }
        // }
    // }

    const scene = director.getScene();
    if (scene) {
        widgetManager.isAligning = true;
        if (widgetManager._nodesOrderDirty) {
            activeWidgets.length = 0;
            visitNode(scene);
            widgetManager._nodesOrderDirty = false;
        }
        else {
            const i = 0;
            let widget: WidgetComponent | null = null;
            const iterator = widgetManager._activeWidgetsIterator;
            // var AnimUtils;
            // if (EDITOR &&
            //     (AnimUtils = Editor.require('scene://utils/animation')) &&
            //     AnimUtils.Cache.animation) {
            //     var editingNode = cc.engine.getInstanceById(AnimUtils.Cache.rNode);
            //     if (editingNode) {
            //         for (i = activeWidgets.length - 1; i >= 0; i--) {
            //             widget = activeWidgets[i];
            //             var node = widget.node;
            //             if (widget.alignMode !== AlignMode.ALWAYS &&
            //                 animationState.animatedSinceLastFrame &&
            //                 node.isChildOf(editingNode)
            //             ) {
            //                 // widget contains in activeWidgets should aligned at least once
            //                 widget.enabled = false;
            //             }
            //             else {
            //                 align(node, widget);
            //             }
            //         }
            //     }
            // }
            // else {
                // loop reversely will not help to prevent out of sync
                // because user may remove more than one item during a step.
            for (iterator.i = 0; iterator.i < activeWidgets.length; ++iterator.i) {
                widget = activeWidgets[iterator.i];
                if (widget._dirty) {
                    align(widget.node, widget);
                    widget._dirty = false;
                }
            }
            // }
        }
        widgetManager.isAligning = false;
    }

    // check animation editor
    if (EDITOR) {
        widgetManager.animationState!.animatedSinceLastFrame = false;
    }
}

const activeWidgets: WidgetComponent[] = [];

// updateAlignment from scene to node recursively
function updateAlignment (node: Node) {
    const parent = node.parent;
    if (parent && Node.isNode(parent)) {
        updateAlignment(parent);
    }

    // node._widget will be null when widget is disabled
    const widget = node.getComponent(WidgetComponent);
    if (widget && parent) {
        align(node, widget);
    }
}

const canvasList: CanvasComponent[] = [];

export const widgetManager = legacyCC._widgetManager = {
    isAligning: false,
    _nodesOrderDirty: false,
    _activeWidgetsIterator: new array.MutableForwardIterator(activeWidgets),
    // hack
    animationState: EDITOR ? {
        previewing: false,
        time: 0,
        animatedSinceLastFrame: false,
    } : null,

    init (director) {
        director.on(Director.EVENT_AFTER_UPDATE, refreshScene);

        if (EDITOR /*&& cc.engine*/) {

            // cc.engien extends eventTarget
            // cc.engine.on('design-resolution-changed', this.onResized.bind(this));
        } else {
            if (sys.isMobile) {
                window.addEventListener('resize', this.onResized.bind(this));
            } else {
                View.instance.on('design-resolution-changed', this.onResized, this);
            }
        }
    },
    add (widget: WidgetComponent) {
        this._nodesOrderDirty = true;
        const canvasComp = director.root!.ui.getScreen(widget.node._uiProps.uiTransformComp!.visibility);
        if (canvasComp && canvasList.indexOf(canvasComp) === -1) {
            canvasList.push(canvasComp);
            canvasComp.node.on('design-resolution-changed', this.onResized, this);
        }
    },
    remove (widget: WidgetComponent) {
        this._activeWidgetsIterator.remove(widget);
    },
    onResized () {
        const scene = director.getScene();
        if (scene) {
            this.refreshWidgetOnResized(scene);
        }
    },
    refreshWidgetOnResized (node: Node) {
        if (Node.isNode(node)){
            const widget = node.getComponent(WidgetComponent);
            if (widget && widget.alignMode === AlignMode.ON_WINDOW_RESIZE) {
                widget.enabled = true;
            }
        }

        const children = node.children;
        for (const child of children) {
            this.refreshWidgetOnResized(child);
        }
    },
    updateOffsetsToStayPut (widget: WidgetComponent, e?: AlignFlags) {
        function i (t: number, c: number) {
            return Math.abs(t - c) > 1e-10 ? c : t;
        }
        const widgetNode = widget.node;
        let widgetParent = widgetNode.parent;
        if (widgetParent) {
            const zero = new Vec3();
            const one = new Vec3(1, 1, 1);
            if (widget.target) {
                widgetParent = widget.target;
                computeInverseTransForTarget(widgetNode, widgetParent, zero, one);
            }

            if (!e) {
                return;
            }

            if (!widgetParent.getComponent(UITransformComponent)) {
                warnID(6501, widget.node.name);
                return;
            }

            const parentAP = widgetParent!.getAnchorPoint();
            const matchSize = getReadonlyNodeSize(widgetParent!);
            const myAP = widgetNode.getAnchorPoint();
            const pos = widgetNode.getPosition();
            const alignFlags = AlignFlags;
            const widgetNodeScale = widgetNode.getScale();

            let temp = 0;

            if (e & alignFlags.LEFT) {
                let l = -parentAP.x * matchSize.width;
                l += zero.x;
                l *= one.x;
                temp = pos.x - myAP.x * widgetNode.width! * widgetNodeScale.x - l;
                if (!widget.isAbsoluteLeft) {
                    temp /= matchSize.width;
                }

                temp /= one.x;
                widget.left = i(widget.left, temp);
            }

            if (e & alignFlags.RIGHT) {
                let r = (1 - parentAP.x) * matchSize.width;
                r += zero.x;
                temp = (r *= one.x) - (pos.x + (1 - myAP.x) * widgetNode.width! * widgetNodeScale.x);
                if (!widget.isAbsoluteRight) {
                    temp /= matchSize.width;
                }

                temp /= one.x;
                widget.right = i(widget.right, temp);
            }

            if (e & alignFlags.TOP) {
                let t = (1 - parentAP.y) * matchSize.height;
                t += zero.y;
                temp = (t *= one.y) - (pos.y + (1 - myAP.y) * widgetNode.height! * widgetNodeScale.y);
                if (!widget.isAbsoluteTop){
                    temp /= matchSize.height;
                }

                temp /= one.y;
                widget.top = i(widget.top, temp);
            }

            if (e & alignFlags.BOT) {
                let b = -parentAP.y * matchSize.height;
                b += zero.y;
                b *= one.y;
                temp = pos.y - myAP.y * widgetNode.height! * widgetNodeScale.y - b;
                if (!widget.isAbsoluteBottom){
                    temp /= matchSize.height;
                }

                temp /= one.y;
                widget.bottom = i(widget.bottom, temp);
            }
        }
    },
    updateAlignment,
    AlignMode,
    AlignFlags,
};

director.on(Director.EVENT_INIT, () => {
    widgetManager.init(director);
});
