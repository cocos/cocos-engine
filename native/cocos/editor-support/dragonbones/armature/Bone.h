#ifndef DRAGONBONES_BONE_H
#define DRAGONBONES_BONE_H

#include "TransformObject.h"

DRAGONBONES_NAMESPACE_BEGIN

class Bone final : public TransformObject
{
    BIND_CLASS_TYPE(Bone);

public:
    enum class BoneTransformDirty
    {
        None = 0,
        Self = 1,
        All = 2
    };

    bool inheritTranslation;
    bool inheritRotation;
    bool inheritScale;
    bool ikBendPositive;
    float ikWeight;
    float length;

public:
    BoneTransformDirty _transformDirty;
    int _blendIndex;
    std::vector<Matrix*>* _cacheFrames;
    Transform _animationPose;

private:
    bool _visible;
    unsigned _ikChain;
    unsigned _ikChainIndex;
    Bone* _ik;
    std::vector<Bone*> _bones;
    std::vector<Slot*> _slots;

public:
    Bone();
    ~Bone();

private:
    DRAGONBONES_DISALLOW_COPY_AND_ASSIGN(Bone);

    void _updateGlobalTransformMatrix();
    void _computeIKA();
    void _computeIKB();

protected:
    void _onClear() override;

public:
    virtual void _setArmature(Armature* value) override;
    void _setIK(Bone* value, unsigned chain, unsigned chainIndex);
    void _update(int cacheFrameIndex);

public:
    bool contains(const TransformObject* child) const;
    void setVisible(bool value);

    inline void invalidUpdate()
    {
        _transformDirty = BoneTransformDirty::All;
    }

    inline const std::vector<Bone*>& getBones() const
    {
        return _bones;
    }

    inline const std::vector<Slot*>& getSlots() const
    {
        return _slots;
    }

    inline unsigned getIKChain() const
    {
        return _ikChain;
    }

    inline unsigned getIKChainIndex() const
    {
        return _ikChainIndex;
    }

    inline Bone* getIK() const
    {
        return _ik;
    }

    inline bool getVisible() const
    {
        return _visible;
    }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_BONE_H
