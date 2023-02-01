#pragma once

#include "MaterialInstance.h"
#include "base/Log.h"
#include "base/Ptr.h"
#include "base/std/container/vector.h"
#include "base/std/variant.h"
#include "core/assets/Material.h"
#include "core/data/Object.h"
#include "core/scene-graph/ComponentProxy.h"

namespace cc {
#if defined(CCR_ARR_ELE_OR_NULL) || defined(CCR_ARR_SET)
    #error "CCR_ARR_ELE_OR_NULL is already defined"
#endif
#define CCR_ARR_GET(arr, idx) ((idx < 0 || idx >= arr.size()) ? nullptr: arr[idx])
#define CCR_ARR_SET(arr, idx, value) \
    do {                            \
        if (idx >= arr.size()) {    \
            arr.resize(idx + 1);    \
        }                           \
        arr[idx] = value;           \
       } while (false)

class Renderer : public ComponentProxy {
public:
    template <typename M>
    using PtrVector = ccstd::vector<IntrusivePtr<M>>;

    template <typename T>
    using Ptr = IntrusivePtr<T>;

    Material* getSharedMaterial() const {
        return _getMaterial(0);
    }

    PtrVector<Material>& getSharedMaterials() {
        return _materials;
    }

    void setSharedMaterials(const PtrVector<Material>& val) {
        for (auto i = 0; i < val.size(); i++) {
            if (val[i] != CCR_ARR_GET(_materials, i)) {
                _setMaterial(val[i], i);
            }
        }
        if (val.size() < _materials.size()) {
            for (auto i = val.size(); i < _materials.size(); i++) {
                _setMaterial(nullptr, i);
            }
            _materials.resize(val.size());
        }
    }

    MaterialInstance* getMaterial() {
        return _getMaterialInstance(0);
    }

    void setMaterial(Material* material) {
        if (_materials.size() == 1 && !_materialInstances[0] && _materials[0] == material) {
            return;
        }
        _setMaterialInstance(material, 0);
    }

    const PtrVector<MaterialInstance>& getMaterials() {
        for (auto i = 0; i < _materials.size(); i++) {
            CCR_ARR_SET(_materialInstances, i,  _getMaterialInstance(i));
        }
        return _materialInstances;
    }

    void setMaterials(const PtrVector<Material>& val) {
        auto newLength = val.size();
        auto oldLength = _materials.size();
        for (auto i = newLength; i < oldLength; i++) {
            _setMaterialInstance(nullptr, i);
        }
        _materials.resize(newLength);
        _materialInstances.resize(newLength);
        for (auto i = 0; i < newLength; i++) {
            // they could be either undefined or null
            // eslint-disable-next-line eqeqeq
            if (_materialInstances[i] != val[i]) {
                _setMaterialInstance(val[i], i);
            }
        }
    }

    Material* _getMaterial(index_t idx) const {
        return CCR_ARR_GET(_materials, idx);
    }

    void _setMaterial(Material* material, index_t index) {
        if (material && dynamic_cast<const MaterialInstance*>(material)) {
            CC_LOG_ERROR("Can't set a materail instance to a sharedMaterial slot");
        }
        CC_ASSERT_NOT_NULL(material);
        CCR_ARR_SET(_materials, index, material);
        auto inst = CCR_ARR_GET(_materialInstances, index);
        if (inst) {
            inst->destroy();
            _materialInstances[index] = nullptr;
        }
        _onMaterialModified(index, _materials[index]);
    }

    MaterialInstance* _getMaterialInstance(index_t index) {
        Material* mat = CCR_ARR_GET(_materials, index);
        if (!mat) return nullptr;

        MaterialInstance* matInst = CCR_ARR_GET(_materialInstances, index);
        if (!matInst) {
            IMaterialInstanceInfo instInfo;
            instInfo.parent = _materials[index];
            instInfo.owner = this;
            instInfo.subModelIdx = index;
            auto* inst = new MaterialInstance(instInfo);
            _setMaterialInstance(inst, index);
        }
        return CCR_ARR_GET(_materialInstances, index);
    }

    void _setMaterialInstance(Material* material, index_t index) {
        MaterialInstance* currInst = CCR_ARR_GET(_materialInstances, index);

        // If the new material is an MaterialInstance
        if (material && material->getParent()) {
            if (material != currInst) {
                CCR_ARR_SET(_materialInstances, index, dynamic_cast<MaterialInstance*>(material));
                CC_ASSERTF(_materialInstances[index], "failed to convert argument to MaterialInstance");
                _onMaterialModified(index, material);
            }
            return;
        }
        // Skip identity check if it's a Material property
        // Or if there is a MaterialInstance already
        if (material != CCR_ARR_GET(_materials, index) || currInst) {
            _setMaterial(material, index);
        }
    }

    Material* getRenderMaterial(index_t index) {
        return CCR_ARR_GET(_materialInstances, index) ? CCR_ARR_GET(_materialInstances, index).get() : CCR_ARR_GET(_materials, index).get();
    }

protected:
    virtual void _onMaterialModified(index_t index, Material* material) {}
    virtual void _onRebuildPSO(index_t index, Material* material) {}
    virtual void _clearMaterials() {}

public:
    PtrVector<Material> _materials;
    PtrVector<MaterialInstance> _materialInstances;
};
} // namespace cc
