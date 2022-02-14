/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

#pragma once

#include <string>
#include <unordered_map>
#include <vector>
#include "base/Ptr.h"
#include "cocos/base/Optional.h"
#include "cocos/base/Variant.h"
#include "core/assets/EffectAsset.h"

namespace cc {

//class RenderableComponent;

namespace scene {
class Pass;
}

/**
 * @en The basic infos for material initialization.
 * @zh 用来初始化材质的基本信息。
 */
struct IMaterialInfo {
    /**
     * @en The EffectAsset to use. Must provide if `effectName` is not specified.
     * @zh
     * 这个材质将使用的 EffectAsset，直接提供资源引用，和 `effectName` 至少要指定一个。
     */
    EffectAsset *effectAsset{nullptr};
    /**
     * @en
     * The name of the EffectAsset to use. Must provide if `effectAsset` is not specified.
     * @zh
     * 这个材质将使用的 EffectAsset，通过 effect 名指定，和 `effectAsset` 至少要指定一个。
     */
    cc::optional<std::string> effectName;
    /**
     * @en
     * The index of the technique to use.
     * @zh
     * 这个材质将使用第几个 technique，默认为 0。
     */
    cc::optional<uint32_t> technique;

    using DefinesType = cc::variant<MacroRecord, std::vector<MacroRecord>>;
    /**
     * @en
     * The shader macro definitions. Default to 0 or the specified value in [[EffectAsset]].
     * @zh
     * 这个材质定义的预处理宏，默认全为 0，或 [[EffectAsset]] 中的指定值。
     */
    cc::optional<DefinesType> defines;

    using PassOverridesType = cc::variant<PassOverrides, std::vector<PassOverrides>>;
    /**
     * @en
     * The override values on top of the pipeline states specified in [[EffectAsset]].
     * @zh
     * 这个材质的自定义管线状态，将覆盖 effect 中的属性。<br>
     * 注意在可能的情况下请尽量少的自定义管线状态，以减小对渲染效率的影响。
     */
    cc::optional<PassOverridesType> states;
};

class Material : public Asset {
public:
    using Super = Asset;
    /**
     * @en Get hash for a material
     * @zh 获取一个材质的哈希值
     * @param material
     */
    static uint64_t      getHashForMaterial(Material *material);
    inline static double getHashForMaterialForJS(Material *material) {
        return static_cast<double>(getHashForMaterial(material));
    }

    Material();
    ~Material() override;

    /**
     * @en Initialize this material with the given information.
     * @zh 根据所给信息初始化这个材质，初始化正常结束后材质即可立即用于渲染。
     * @param info Material description info.
     */
    void initialize(const IMaterialInfo &info);
    void reset(const IMaterialInfo &info);

    void initDefault(const cc::optional<std::string> &uuid) override;
    bool validate() const override;

    /**
     * @en
     * Destroy the material definitively.<br>
     * Cannot re-initialize after destroy.<br>
     * Modifications on active materials can be acheived by<br>
     * creating a new Material, invoke the `copy` function<br>
     * with the desired overrides, and assigning it to the target components.
     * @zh
     * 彻底销毁材质，注意销毁后无法重新初始化。<br>
     * 如需修改现有材质，请创建一个新材质，<br>
     * 调用 copy 函数传入需要的 overrides 并赋给目标组件。
     */
    bool destroy() override;

    /**
     * @en Recompile the shader with the specified macro overrides. Allowed only on material instances.
     * @zh 使用指定预处理宏重新编译当前 pass（数组）中的 shader。只允许对材质实例执行。
     * @param overrides The shader macro override values.
     * @param passIdx The pass to apply to. Will apply to all passes if not specified.
     */
    virtual void recompileShaders(const MacroRecord &overrides) {
        Material::recompileShaders(overrides, CC_INVALID_INDEX);
    }
    virtual void recompileShaders(const MacroRecord &overrides, index_t passIdx);

    /**
     * @en Override the passes with the specified pipeline states. Allowed only on material instances.
     * @zh 使用指定管线状态重载当前的 pass（数组）。只允许对材质实例执行。
     * @param overrides The pipeline state override values.
     * @param passIdx The pass to apply to. Will apply to all passes if not specified.
     */
    virtual void overridePipelineStates(const PassOverrides &overrides) {
        Material::overridePipelineStates(overrides, CC_INVALID_INDEX);
    }
    virtual void overridePipelineStates(const PassOverrides &overrides, index_t passIdx);

    /**
     * @en Callback function after material is loaded in [[Loader]]. Initialize the resources automatically.
     * @zh 通过 [[Loader]] 加载完成时的回调，将自动初始化材质资源。
     */
    void onLoaded() override;

    /**
     * @en Reset all the uniforms to the default value specified in [[EffectAsset]].
     * @zh 重置材质的所有 uniform 参数数据为 [[EffectAsset]] 中的默认初始值。
     * @param clearPasses Will the rendering data be cleared too?
     */
    void resetUniforms(bool clearPasses = true);

    /**
     * @en
     * Convenient property setter provided for quick material setup.<br>
     * [[Pass.setUniform]] should be used instead if you need to do per-frame uniform update.
     * @zh
     * 设置材质 uniform 参数的统一入口。<br>
     * 注意如果需要每帧更新 uniform，建议使用 [[Pass.setUniform]] 以获得更好的性能。
     * @param name The target uniform name.
     * @param val The target value.
     * @param passIdx The pass to apply to. Will apply to all passes if not specified.
     */
    void setProperty(const std::string &name, const MaterialPropertyVariant &val, index_t passIdx = CC_INVALID_INDEX);

    void setPropertyFloat32(const std::string &name, float val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyInt32(const std::string &name, int32_t val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyVec2(const std::string &name, const Vec2 &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyVec3(const std::string &name, const Vec3 &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyVec4(const std::string &name, const Vec4 &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyColor(const std::string &name, const Color &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyMat3(const std::string &name, const Mat3 &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyMat4(const std::string &name, const Mat4 &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyQuaternion(const std::string &name, const Quaternion &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyTextureBase(const std::string &name, TextureBase *val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyGFXTexture(const std::string &name, gfx::Texture *val, index_t passIdx = CC_INVALID_INDEX);

    void setPropertyFloat32Array(const std::string &name, const std::vector<float> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyInt32Array(const std::string &name, const std::vector<int32_t> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyVec2Array(const std::string &name, const std::vector<Vec2> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyVec3Array(const std::string &name, const std::vector<Vec3> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyVec4Array(const std::string &name, const std::vector<Vec4> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyColorArray(const std::string &name, const std::vector<cc::Color> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyMat3Array(const std::string &name, const std::vector<Mat3> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyMat4Array(const std::string &name, const std::vector<Mat4> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyQuaternionArray(const std::string &name, const std::vector<Quaternion> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyTextureBaseArray(const std::string &name, const std::vector<TextureBase *> &val, index_t passIdx = CC_INVALID_INDEX);
    void setPropertyGFXTextureArray(const std::string &name, const std::vector<gfx::Texture *> &val, index_t passIdx = CC_INVALID_INDEX);

    /**
     * @en
     * Get the specified uniform value for this material.<br>
     * Note that only uniforms set through [[Material.setProperty]] can be acquired here.<br>
     * For the complete rendering data, use [[Pass.getUniform]] instead.
     * @zh
     * 获取当前材质的指定 uniform 参数的值。<br>
     * 注意只有通过 [[Material.setProperty]] 函数设置的参数才能从此函数取出，<br>
     * 如需取出完整的渲染数据，请使用 [[Pass.getUniform]]。
     * @param name The property or uniform name.
     * @param passIdx The target pass index. If not specified, return the first found value in all passes.
     */
    const MaterialPropertyVariant *getProperty(const std::string &name, index_t passIdx = CC_INVALID_INDEX) const;

    /**
     * @en Copy the target material, with optional overrides.
     * @zh 复制目标材质到当前实例，允许提供重载信息。。
     * @param mat The material to be copied.
     * @param overrides The overriding states on top of the original material.
     */
    void copy(const Material *mat, IMaterialInfo* overrides = nullptr);

    void fillInfo(const IMaterialInfo &info);

    // For deserialization, we need to make the following properties public
    /* @type(EffectAsset) */
    IntrusivePtr<EffectAsset> _effectAsset;

    /* @serializable */
    uint32_t _techIdx{0};

    /* @serializable */
    std::vector<MacroRecord> _defines;

    /* @serializable */
    std::vector<PassOverrides> _states;

    /* @serializable */
    std::vector<Record<std::string, MaterialPropertyVariant>> _props;
    //

protected:
    std::shared_ptr<std::vector<IntrusivePtr<scene::Pass>>> _passes;

    uint64_t _hash{0};

public:
    /**
     * @en Set current [[EffectAsset]].
     * @zh 设置使用的 [[EffectAsset]] 资源。
     */
    inline void setEffectAsset(EffectAsset *val) {
        _effectAsset = val;
    }

    /**
     * @en The current [[EffectAsset]].
     * @zh 当前使用的 [[EffectAsset]] 资源。
     */
    inline EffectAsset *getEffectAsset() const {
        return _effectAsset.get();
    }

    /**
     * @en Name of the current [[EffectAsset]].
     * @zh 当前使用的 [[EffectAsset]] 资源名。
     */
    inline std::string getEffectName() const {
        return _effectAsset ? _effectAsset->getName() : "";
    }

    /**
     * @en The current technique index.
     * @zh 当前的 technique 索引。
     */
    inline uint32_t getTechniqueIndex() const {
        return _techIdx;
    }

    /**
     * @en The passes defined in this material.
     * @zh 当前正在使用的 pass 数组。
     */
    std::shared_ptr<std::vector<IntrusivePtr<scene::Pass>>> &getPasses() {
        return _passes;
    }

    /**
     * @en The hash value of this material.
     * @zh 材质的 hash。
     */
    inline uint64_t getHash() const {
        return _hash;
    }

    inline double getHashForJS() const {
        return static_cast<double>(getHash());
    }

    /**
     * @en The parent material
     * @zh 父材质
     */
    virtual Material *getParent() const {
        return nullptr;
    }

    /**
     * @en The owner render component
     * @zh 该材质所归属的渲染组件
     */
    //    virtual RenderableComponent *getOwner() const {
    //        return nullptr;
    //    }

protected:
    void update(bool keepProps = true);
    bool uploadProperty(scene::Pass *pass, const std::string &name, const MaterialPropertyVariant &val);
    void bindTexture(scene::Pass *pass, uint32_t handle, const MaterialProperty &val, index_t index = CC_INVALID_INDEX);

    template <typename T1, typename T2>
    void prepareInfo(const T1 &patch, std::vector<T2> &cur) {
        auto *pOneElement = cc::get_if<T2>(&patch);
        if (pOneElement != nullptr) {
            size_t len = _effectAsset != nullptr ? _effectAsset->_techniques[_techIdx].passes.size() : 1;

            std::vector<T2> patchArray;
            patchArray.reserve(len);
            for (size_t i = 0; i < len; ++i) {
                patchArray.emplace_back(*pOneElement);
            }

            cur.resize(patchArray.size());

            for (size_t i = 0; i < len; ++i) {
                cur[i] = patchArray[i];
            }
        } else {
            auto *pPatchArray = cc::get_if<std::vector<T2>>(&patch);
            if (pPatchArray != nullptr) {
                const auto &patchArray = *pPatchArray;
                size_t      len        = patchArray.size();
                cur.resize(len);

                for (size_t i = 0; i < len; ++i) {
                    cur[i] = patchArray[i];
                }
            }
        }
    }

    virtual void doDestroy();

    virtual std::vector<IntrusivePtr<scene::Pass>> createPasses();

private:
    friend class MaterialDeserializer;

    CC_DISALLOW_COPY_MOVE_ASSIGN(Material);
};

} // namespace cc
