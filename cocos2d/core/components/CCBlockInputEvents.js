/****************************************************************************
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
 ****************************************************************************/

const BlockEvents = ['touchstart', 'touchmove', 'touchend',
                     'mousedown', 'mousemove', 'mouseup',
                     'mouseenter', 'mouseleave', 'mousewheel'];

function stopPropagation (event) {
    event.stopPropagation();
}

/**
 * !#en
 * This component will block all input events (mouse and touch) within the bounding box of the node, preventing the input from penetrating into the underlying node, typically for the background of the top UI.<br>
 * This component does not have any API interface and can be added directly to the scene to take effect.
 * !#zh
 * 该组件将拦截所属节点 bounding box 内的所有输入事件（鼠标和触摸），防止输入穿透到下层节点，一般用于上层 UI 的背景。<br>
 * 该组件没有任何 API 接口，直接添加到场景即可生效。
 *
 * @class BlockInputEvents
 * @extends Component
 */
const BlockInputEvents = cc.Class({
    name: 'cc.BlockInputEvents',
    extends: require('./CCComponent'),
    editor: {
        menu: 'i18n:MAIN_MENU.component.ui/Block Input Events',
        inspector: 'packages://inspector/inspectors/comps/block-input-events.js',
        help: 'i18n:COMPONENT.help_url.block_input_events',
    },

    onEnable () {
        for (var i = 0; i < BlockEvents.length; i++) {
            // supply the 'this' parameter so that the callback could be added and removed correctly,
            // even if the same component is added more than once to a Node.
            this.node.on(BlockEvents[i], stopPropagation, this);
        }
    },
    onDisable () {
        for (var i = 0; i < BlockEvents.length; i++) {
            this.node.off(BlockEvents[i], stopPropagation, this);
        }
    }
});

cc.BlockInputEvents = module.exports = BlockInputEvents;
