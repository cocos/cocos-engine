/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "base/Macros.h"
#include "base/std/container/vector.h"

namespace cc {

/**
 * @zh 节点层管理器，层数据是以掩码数据方式存储在 [[Node.layer]] 中，用于射线检测、物理碰撞和用户自定义脚本逻辑。
 * 每个节点可属于一个或多个层，可通过 “包含式” 或 “排除式” 两种检测器进行层检测。
 * @en Node's layer manager, it's stored as bit mask data in [[Node.layer]].
 * Layer information is widely used in raycast, physics and user logic.
 * Every node can be assigned to multiple layers with different bit masks, you can setup layer with inclusive or exclusive operation.
 */
class Layers final {
public:
    Layers() = delete;
    ~Layers() = delete;

    // built-in layers, users can use 0~19 bits, 20~31 are system preserve bits.
    enum class LayerList : uint32_t {
        NONE = 0,
        IGNORE_RAYCAST = (1 << 20),
        GIZMOS = (1 << 21),
        EDITOR = (1 << 22),
        UI_3D = (1 << 23),
        SCENE_GIZMO = (1 << 24),
        UI_2D = (1 << 25),

        PROFILER = (1 << 28),
        DEFAULT = (1 << 30),
        ALL = 0xffffffff,
    };

    using Enum = LayerList;

    /**
     * @en
     * Make a layer mask accepting nothing but the listed layers
     * @zh
     * 创建一个包含式层检测器，只接受列表中的层
     * @param includes All accepted layers
     * @return A filter which can detect all accepted layers
     */
    static uint32_t makeMaskInclude(const ccstd::vector<uint32_t> &includes) {
        uint32_t mask = 0;
        for (uint32_t inc : includes) {
            mask |= inc;
        }
        return mask;
    }

    /**
     * @en
     * Make a layer mask accepting everything but the listed layers
     * @zh
     * 创建一个排除式层检测器，只拒绝列表中的层
     * @param excludes All excluded layers
     * @return A filter which can detect for excluded layers
     */
    static uint32_t makeMaskExclude(const ccstd::vector<uint32_t> &excludes) {
        return ~makeMaskInclude(excludes);
    }

    /**
     * @zh 添加一个新层，用户可编辑 0 - 19 位为用户自定义层
     * @en Add a new layer, user can use layers from bit position 0 to 19, other bits are reserved.
     * @param name Layer's name
     * @param bitNum Layer's bit position
     */
    static void addLayer(const std::string &name, uint32_t bitNum);

    /**
     * @en Remove a layer, user can remove layers from bit position 0 to 19, other bits are reserved.
     * @zh 移除一个层，用户可编辑 0 - 19 位为用户自定义层
     * @param bitNum Layer's bit position
     */
    static void deleteLayer(uint32_t bitNum);

    /**
     * @en Given a layer name, returns the layer index as defined by either a Builtin or a User Layer in the Tags and Layers manager.
     * @zh 给定层名称，返回由标记和层管理器中的内置层或用户层定义的层索引。
     * @param name layer's name
     */
    static uint32_t nameToLayer(const std::string &name);

    /**
     * @en Given a layer number, returns the name of the layer as defined in either a Builtin or a User Layer in the Tags and Layers manager.
     * @zh 给定层数，返回在标记和层管理器中的内置层或用户层中定义的层名称。
     * @param bitNum layer's value
     */
    static std::string layerToName(uint32_t bitNum);
};

CC_ENUM_BITWISE_OPERATORS(Layers::LayerList);

} // namespace cc
