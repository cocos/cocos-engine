#include "Slot.h"
#include "../model/DragonBonesData.h"
#include "../model/UserData.h"
#include "../model/SkinData.h"
#include "../model/DisplayData.h"
#include "../model/BoundingBoxData.h"
#include "../model/TextureAtlasData.h"
#include "Armature.h"
#include "Bone.h"
#include "DeformVertices.h"
#include "../animation/Animation.h"
#include "../event/EventObject.h"

DRAGONBONES_NAMESPACE_BEGIN

void Slot::_onClear()
{
    TransformObject::_onClear();

    std::vector<std::pair<void*, DisplayType>> disposeDisplayList;
    for (const auto& pair : this->_displayList)
    {
        if (
            pair.first != nullptr && pair.first != _rawDisplay && pair.first != _meshDisplay &&
            std::find(disposeDisplayList.cbegin(), disposeDisplayList.cend(), pair) == disposeDisplayList.cend()
        )
        {
            disposeDisplayList.push_back(pair);
        }
    }

    for (const auto& pair : disposeDisplayList)
    {
        if (pair.second == DisplayType::Armature)
        {
            static_cast<Armature*>(pair.first)->returnToPool();
        }
        else
        {
            _disposeDisplay(pair.first, true);
        }
    }

    if (_deformVertices != nullptr)
    {
        _deformVertices->returnToPool();
    }

    if (_meshDisplay && _meshDisplay != _rawDisplay) 
    {
        _disposeDisplay(_meshDisplay, false);
    }

    if (_rawDisplay) {
        _disposeDisplay(_rawDisplay, false);
    }

    displayController = "";

    _displayDirty = false;
    _zOrderDirty = false;
    _blendModeDirty = false;
    _colorDirty = false;
    _transformDirty = false;
    _visible = true;
    _blendMode = BlendMode::Normal;
    _displayIndex = -1;
    _animationDisplayIndex = -1;
    _zOrder = 0;
    _cachedFrameIndex = -1;
    _pivotX = 0.0f;
    _pivotY = 0.0f;
    _localMatrix.identity();
    _colorTransform.identity();
    _displayList.clear();
    _displayDatas.clear();
    _slotData = nullptr;
    _rawDisplayDatas = nullptr; //
    _displayData = nullptr;
    _boundingBoxData = nullptr;
    _textureData = nullptr;
    _deformVertices = nullptr;
    _rawDisplay = nullptr;
    _meshDisplay = nullptr;
    _display = nullptr;
    _childArmature = nullptr;
    _parent = nullptr;
    _cachedFrameIndices = nullptr;
}

DisplayData* Slot::_getDefaultRawDisplayData(unsigned displayIndex) const
{
    const auto defaultSkin = _armature->_armatureData->defaultSkin;
    if (defaultSkin != nullptr) 
    {
        const auto defaultRawDisplayDatas = defaultSkin->getDisplays(_slotData->name);
        if (defaultRawDisplayDatas != nullptr) 
        {
            return displayIndex < defaultRawDisplayDatas->size() ? (*defaultRawDisplayDatas)[displayIndex] : nullptr;
        }
    }

    return nullptr;
}

void Slot::_updateDisplayData()
{
    const auto prevDisplayData = _displayData;
    const auto prevVerticesData = _deformVertices != nullptr ? _deformVertices->verticesData : nullptr;
    const auto prevTextureData = _textureData;

    DisplayData* rawDisplayData = nullptr;
    VerticesData* currentVerticesData = nullptr;

    _displayData = nullptr;
    _boundingBoxData = nullptr;
    _textureData = nullptr;

    if (_displayIndex >= 0)
    {
        if (_rawDisplayDatas != nullptr) 
        {
            rawDisplayData = (unsigned)_displayIndex < _rawDisplayDatas->size() ? (*_rawDisplayDatas)[_displayIndex] : nullptr;
        }

        if (rawDisplayData == nullptr)
        {
            rawDisplayData = _getDefaultRawDisplayData(_displayIndex);
        }

        if ((unsigned)_displayIndex < _displayDatas.size())
        {
            _displayData = _displayDatas[_displayIndex];
        }
    }

    // Update texture and mesh data.
    if (_displayData != nullptr)
    {
        if (_displayData->type == DisplayType::Mesh) 
        {
            currentVerticesData = &static_cast<MeshDisplayData*>(_displayData)->vertices;
        }
        else if (_displayData->type == DisplayType::Path) 
        {
            // TODO
        }
        else if (rawDisplayData != nullptr) 
        {
            if (rawDisplayData->type == DisplayType::Mesh) 
            {
                currentVerticesData = &static_cast<MeshDisplayData*>(rawDisplayData)->vertices;
            }
            else if (rawDisplayData->type == DisplayType::Path) 
            {
                // TODO
            }
        }

        if (_displayData->type == DisplayType::BoundingBox) 
        {
            _boundingBoxData = static_cast<BoundingBoxDisplayData*>(_displayData)->boundingBox;
        }
        else if (rawDisplayData != nullptr) 
        {
            if (rawDisplayData->type == DisplayType::BoundingBox) 
            {
                _boundingBoxData = static_cast<BoundingBoxDisplayData*>(rawDisplayData)->boundingBox;
            }
        }

        if (_displayData->type == DisplayType::Image) 
        {
            _textureData = static_cast<ImageDisplayData*>(_displayData)->texture;
        }
        else if (_displayData->type == DisplayType::Mesh) 
        {
            _textureData = static_cast<MeshDisplayData*>(_displayData)->texture;
        }
    }

    // Update bounding box data.
    if (_displayData != nullptr && _displayData->type == DisplayType::BoundingBox)
    {
        _boundingBoxData = static_cast<BoundingBoxDisplayData*>(_displayData)->boundingBox;
    }
    else if (rawDisplayData != nullptr && rawDisplayData->type == DisplayType::BoundingBox)
    {
        _boundingBoxData = static_cast<BoundingBoxDisplayData*>(rawDisplayData)->boundingBox;
    }
    else
    {
        _boundingBoxData = nullptr;
    }

    if (_displayData != prevDisplayData || currentVerticesData != prevVerticesData || _textureData != prevTextureData)
    {
        if (currentVerticesData == nullptr && _textureData != nullptr)
        {
            const auto imageDisplayData = static_cast<ImageDisplayData*>(_displayData);
            const auto scale = _textureData->parent->scale * _armature->_armatureData->scale;
            const auto frame = _textureData->frame;

            _pivotX = imageDisplayData->pivot.x;
            _pivotY = imageDisplayData->pivot.y;

            const auto& rect = frame != nullptr ? *frame : _textureData->region;
            float width = rect.width;
            float height = rect.height;

            if (_textureData->rotated && frame == nullptr) 
            {
                width = rect.height;
                height = rect.width;
            }

            _pivotX *= width * scale;
            _pivotY *= height * scale;

            if (frame != nullptr)
            {
                _pivotX += frame->x * scale;
                _pivotY += frame->y * scale;
            }

            // Update replace pivot.
            if (_displayData != nullptr && rawDisplayData != nullptr && _displayData != rawDisplayData)
            {
                rawDisplayData->transform.toMatrix(_helpMatrix);
                _helpMatrix.invert();
                _helpMatrix.transformPoint(0.0f, 0.0f, _helpPoint);
                _pivotX -= _helpPoint.x;
                _pivotY -= _helpPoint.y;

                _displayData->transform.toMatrix(_helpMatrix);
                _helpMatrix.invert();
                _helpMatrix.transformPoint(0.0f, 0.0f, _helpPoint);
                _pivotX += _helpPoint.x;
                _pivotY += _helpPoint.y;
            }

            if (!DragonBones::yDown)
            {
                _pivotY = (_textureData->rotated ? _textureData->region.width : _textureData->region.height) * scale - _pivotY;
            }
        }
        else
        {
            _pivotX = 0.0f;
            _pivotY = 0.0f;
        }

        // Update original transform.
        if (rawDisplayData != nullptr)
        {
            origin = &rawDisplayData->transform;
        }
        else if (_displayData != nullptr)
        {
            origin = &_displayData->transform;
        }
        else
        {
            origin = nullptr;
        }

        // Update vertices.
        if (currentVerticesData != prevVerticesData) 
        {
            if (_deformVertices == nullptr)
            {
                _deformVertices = BaseObject::borrowObject<DeformVertices>();
            }

            _deformVertices->init(currentVerticesData, _armature);
        }
        else if (_deformVertices != nullptr && _textureData != prevTextureData) // Update mesh after update frame.
        { 
            _deformVertices->verticesDirty = true;
        }

        _displayDirty = true;
        _transformDirty = true;
    }
}

void Slot::_updateDisplay()
{
    const auto prevDisplay = _display != nullptr ? _display : _rawDisplay;
    const auto prevChildArmature = _childArmature;

    // Update display and child armature.
    if (_displayIndex >= 0 && (std::size_t)_displayIndex < _displayList.size())
    {
        const auto& displayPair = _displayList[_displayIndex];
        _display = displayPair.first;
        if (_display != nullptr && displayPair.second == DisplayType::Armature)
        {
            _childArmature = static_cast<Armature*>(displayPair.first);
            _display = _childArmature->getDisplay();
        }
        else
        {
            _childArmature = nullptr;
        }
    }
    else
    {
        _display = nullptr;
        _childArmature = nullptr;
    }

    const auto currentDisplay = _display != nullptr ? _display : _rawDisplay;
    if (currentDisplay != prevDisplay)
    {
        _onUpdateDisplay();
        _replaceDisplay(prevDisplay, prevChildArmature != nullptr);

        _transformDirty = true;
        _visibleDirty = true;
        _blendModeDirty = true;
        _colorDirty = true;
    }

    // Update frame.
    if (currentDisplay == _rawDisplay || currentDisplay == _meshDisplay)
    {
        _updateFrame();
    }

    // Update child armature.
    if (_childArmature != prevChildArmature)
    {
        if (prevChildArmature != nullptr)
        {
            prevChildArmature->_parent = nullptr; // Update child armature parent.
            prevChildArmature->setClock(nullptr);
            if (prevChildArmature->inheritAnimation)
            {
                prevChildArmature->getAnimation()->reset();
            }
        }

        if (_childArmature != nullptr)
        {
            _childArmature->_parent = this; // Update child armature parent.
            _childArmature->setClock(_armature->getClock());
            if (_childArmature->inheritAnimation) // Set child armature cache frameRate.
            {
                if (_childArmature->getCacheFrameRate() == 0)
                {
                    const auto chacheFrameRate = this->_armature->getCacheFrameRate();
                    if (chacheFrameRate != 0)
                    {
                        _childArmature->setCacheFrameRate(chacheFrameRate);
                    }
                }

                // Child armature action.
                std::vector<ActionData*>* actions = nullptr;
                if (_displayData != nullptr && _displayData->type == DisplayType::Armature) 
                {
                    actions = &(static_cast<ArmatureDisplayData*>(_displayData)->actions);
                }
                else if(_displayIndex >= 0 && _rawDisplayDatas != nullptr)
                {
                    auto rawDisplayData = (unsigned)_displayIndex < _rawDisplayDatas->size() ? (*_rawDisplayDatas)[_displayIndex] : nullptr;

                    if (rawDisplayData == nullptr)
                    {
                        rawDisplayData = _getDefaultRawDisplayData(_displayIndex);
                    }

                    if (rawDisplayData != nullptr && rawDisplayData->type == DisplayType::Armature) 
                    {
                        actions = &(static_cast<ArmatureDisplayData*>(rawDisplayData)->actions);
                    }
                }

                if (actions != nullptr && !actions->empty())
                {
                    for (const auto action : *actions)
                    {
                        const auto eventObject = BaseObject::borrowObject<EventObject>();
                        EventObject::actionDataToInstance(action, eventObject, _armature);
                        eventObject->slot = this;
                        _armature->_bufferAction(eventObject, false);
                    }
                }
                else
                {
                    _childArmature->getAnimation()->play();
                }
            }
        }
    }
}

void Slot::_updateGlobalTransformMatrix(bool isCache)
{
    const auto& parentMatrix = _parent->globalTransformMatrix;
    globalTransformMatrix = _localMatrix; // Copy.
    globalTransformMatrix.concat(parentMatrix);

    if (isCache)
    {
        global.fromMatrix(globalTransformMatrix);
    }
    else
    {
        _globalDirty = true;
    }
}

bool Slot::_setDisplayIndex(int value, bool isAnimation)
{
    if (isAnimation)
    {
        if (_animationDisplayIndex == value)
        {
            return false;
        }

        _animationDisplayIndex = value;
    }

    if (_displayIndex == value)
    {
        return false;
    }

    _displayIndex = value;
    _displayDirty = true;

    _updateDisplayData();

    return _displayDirty;
}

bool Slot::_setZorder(int value)
{
    if (_zOrder == value)
    {
        //return false;
    }

    _zOrder = value;
    _zOrderDirty = true;

    return _zOrderDirty;
}

bool Slot::_setColor(const ColorTransform& value)
{
    _colorTransform = value; // copy
    _colorDirty = true;

    return true;
}

bool Slot::_setDisplayList(const std::vector<std::pair<void*, DisplayType>>& value)
{
    if (!value.empty())
    {
        if (_displayList.size() != value.size())
        {
            _displayList.resize(value.size());
        }

        for (std::size_t i = 0, l = value.size(); i < l; ++i)
        {
            const auto& eachPair = value[i];
            if (
                eachPair.first != nullptr && eachPair.first != _rawDisplay && eachPair.first != _meshDisplay &&
                eachPair.second != DisplayType::Armature && 
                std::find(_displayList.cbegin(), _displayList.cend(), eachPair) == _displayList.cend()
            )
            {
                _initDisplay(eachPair.first, true);
            }

            _displayList[i].first = eachPair.first;
            _displayList[i].second = eachPair.second;
        }
    }
    else if (!_displayList.empty())
    {
        _displayList.clear();
    }

    if (_displayIndex >= 0 && (std::size_t)_displayIndex < _displayList.size())
    {
        _displayDirty = _display != _displayList[_displayIndex].first;
    }
    else
    {
        _displayDirty = _display != nullptr;
    }

    _updateDisplayData();

    return _displayDirty;
}

void Slot::init(const SlotData* slotData, Armature* armatureValue, void* rawDisplay, void* meshDisplay)
{
    if (_slotData != nullptr)
    {
        return;
    }

    _slotData = slotData;
    //
    _visibleDirty = true;
    _blendModeDirty = true;
    _colorDirty = true;
    _blendMode = _slotData->blendMode;
    _zOrder = _slotData->zOrder;
    _colorTransform = *(_slotData->color);
    _rawDisplay = rawDisplay;
    _meshDisplay = meshDisplay;
    //
    _armature = armatureValue;
    //
    const auto slotParent = _armature->getBone(_slotData->parent->name);
    if (slotParent != nullptr) 
    {
        _parent = slotParent;
    }
    else 
    {
        // Never;
    }

    _armature->_addSlot(this);
    //
    _initDisplay(_rawDisplay, false);
    if (_rawDisplay != _meshDisplay) 
    {
        _initDisplay(_meshDisplay, false);
    }

    _onUpdateDisplay();
    _addDisplay();
}

void Slot::update(int cacheFrameIndex)
{
    if (_displayDirty)
    {
        _displayDirty = false;
        _updateDisplay();

        // TODO remove slot offset.
        if (_transformDirty) // Update local matrix. (Only updated when both display and transform are dirty.)
        {
            if (origin != nullptr) 
            {
                global = *origin; // Copy.
                global.add(offset).toMatrix(_localMatrix);
            }
            else 
            {
                global = offset; // Copy.
                global.toMatrix(_localMatrix);
            }
        }
    }

    if (_zOrderDirty) 
    {
        _zOrderDirty = false;
        _updateZOrder();
    }

    if (cacheFrameIndex >= 0 && _cachedFrameIndices != nullptr)
    {
        const auto cachedFrameIndex = (*_cachedFrameIndices)[cacheFrameIndex];
        if (cachedFrameIndex >= 0 && _cachedFrameIndex == cachedFrameIndex) // Same cache.
        {
            _transformDirty = false;
        }
        else if (cachedFrameIndex >= 0) // Has been Cached.
        {
            _transformDirty = true;
            _cachedFrameIndex = cachedFrameIndex;
        }
        else if (_transformDirty || _parent->_childrenTransformDirty) // Dirty.
        {
            _transformDirty = true;
            _cachedFrameIndex = -1;
        }
        else if (_cachedFrameIndex >= 0) // Same cache, but not set index yet.
        {
            _transformDirty = false;
            (*_cachedFrameIndices)[cacheFrameIndex] = _cachedFrameIndex;
        }
        else // Dirty.
        {
            _transformDirty = true;
            _cachedFrameIndex = -1;
        }
    }
    else if (_transformDirty || this->_parent->_childrenTransformDirty)
    {
        cacheFrameIndex = -1;
        _transformDirty = true;
        _cachedFrameIndex = -1;
    }

    if (_display == nullptr)
    {
        return;
    }

    if (_visibleDirty)
    {
        _visibleDirty = false;
        _updateVisible();
    }

    if (_blendModeDirty)
    {
        _blendModeDirty = false;
        _updateBlendMode();
    }

    if (_colorDirty)
    {
        _colorDirty = false;
        _updateColor();
    }

    if (_deformVertices != nullptr && _deformVertices->verticesData != nullptr && _display == _meshDisplay)
    {
        const auto isSkinned = _deformVertices->verticesData->weight != nullptr;

        if (
            _deformVertices->verticesDirty ||
            (isSkinned && _deformVertices->isBonesUpdate())
        )
        {
            _deformVertices->verticesDirty = false;
            _updateMesh();
        }

        if (isSkinned) // Compatible.
        {
            return;
        }
    }

    if (_transformDirty)
    {
        _transformDirty = false;

        if (_cachedFrameIndex < 0)
        {
            const auto isCache = cacheFrameIndex >= 0;
            _updateGlobalTransformMatrix(isCache);

            if (isCache && _cachedFrameIndices != nullptr)
            {
                _cachedFrameIndex = (*_cachedFrameIndices)[cacheFrameIndex] = _armature->_armatureData->setCacheFrame(globalTransformMatrix, global);
            }
        }
        else
        {
            _armature->_armatureData->getCacheFrame(globalTransformMatrix, global, _cachedFrameIndex);
        }

        _updateTransform();
    }
}

void Slot::updateTransformAndMatrix()
{
    if (_transformDirty)
    {
        _transformDirty = false;
        _updateGlobalTransformMatrix(false);
    }
}

void Slot::replaceDisplayData(DisplayData *displayData, int displayIndex)
{
    if (displayIndex < 0) 
    {
        if (_displayIndex < 0) 
        {
            displayIndex = 0;
        }
        else 
        {
            displayIndex = _displayIndex;
        }
    }

    if (_displayDatas.size() <= (unsigned)displayIndex) {
        _displayDatas.resize(displayIndex + 1, nullptr);
    }

    _displayDatas[displayIndex] = displayData;
}

bool Slot::containsPoint(float x, float y)
{
    if (_boundingBoxData == nullptr) 
    {
        return false;
    }

    updateTransformAndMatrix();

    _helpMatrix = globalTransformMatrix; // Copy.
    _helpMatrix.invert();
    _helpMatrix.transformPoint(x, y, _helpPoint);

    return _boundingBoxData->containsPoint(_helpPoint.x, _helpPoint.y);
}

int Slot::intersectsSegment(
    float xA, float yA, float xB, float yB,
    Point* intersectionPointA,
    Point* intersectionPointB,
    Point* normalRadians
)
{
    if (_boundingBoxData == nullptr) 
    {
        return 0;
    }

    updateTransformAndMatrix();
    _helpMatrix = globalTransformMatrix;
    _helpMatrix.invert();
    _helpMatrix.transformPoint(xA, yA, _helpPoint);
    xA = _helpPoint.x;
    yA = _helpPoint.y;
    _helpMatrix.transformPoint(xB, yB, _helpPoint);
    xB = _helpPoint.x;
    yB = _helpPoint.y;

    const auto intersectionCount = _boundingBoxData->intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
    if (intersectionCount > 0)
    {
        if (intersectionCount == 1 || intersectionCount == 2) 
        {
            if (intersectionPointA != nullptr) 
            {
                globalTransformMatrix.transformPoint(intersectionPointA->x, intersectionPointA->y, *intersectionPointA);
                if (intersectionPointB != nullptr) 
                {
                    intersectionPointB->x = intersectionPointA->x;
                    intersectionPointB->y = intersectionPointA->y;
                }
            }
            else if (intersectionPointB != nullptr) 
            {
                globalTransformMatrix.transformPoint(intersectionPointB->x, intersectionPointB->y, *intersectionPointB);
            }
        }
        else 
        {
            if (intersectionPointA != nullptr) 
            {
                globalTransformMatrix.transformPoint(intersectionPointA->x, intersectionPointA->y, *intersectionPointA);
            }

            if (intersectionPointB != nullptr) 
            {
                globalTransformMatrix.transformPoint(intersectionPointB->x, intersectionPointB->y, *intersectionPointB);
            }
        }

        if (normalRadians != nullptr)
        {
            globalTransformMatrix.transformPoint(cos(normalRadians->x), sin(normalRadians->x), _helpPoint, true);
            normalRadians->x = atan2(_helpPoint.y, _helpPoint.x);

            globalTransformMatrix.transformPoint(cos(normalRadians->y), sin(normalRadians->y), _helpPoint, true);
            normalRadians->y = atan2(_helpPoint.y, _helpPoint.x);
        }
    }

    return intersectionCount;
}

void Slot::setVisible(bool value)
{
    if (_visible == value) 
    {
        return;
    }

    _visible = value;
    _updateVisible();
}

void Slot::setDisplayIndex(int value)
{
    if (_setDisplayIndex(value)) 
    {
        update(-1);
    }
}

//TODO lsc check
void Slot::setDisplayList(const std::vector<std::pair<void*, DisplayType>>& value)
{
    const auto backupDisplayList = _displayList; // copy
    auto disposeDisplayList = backupDisplayList; // copy
    disposeDisplayList.clear();

    if (_setDisplayList(value))
    {
        update(-1);
    }

    for (const auto& pair : backupDisplayList)
    {
        if (
            pair.first != nullptr && pair.first != _rawDisplay && pair.first != _meshDisplay &&
            std::find(_displayList.cbegin(), _displayList.cend(), pair) == _displayList.cend() &&
            std::find(disposeDisplayList.cbegin(), disposeDisplayList.cend(), pair) == disposeDisplayList.cend()
        )
        {
            disposeDisplayList.push_back(pair);
        }
    }

    for (const auto& pair : disposeDisplayList)
    {
        if (pair.second == DisplayType::Armature)
        {
            static_cast<Armature*>(pair.first)->returnToPool();
        }
        else
        {
            _disposeDisplay(pair.first, true);
        }
    }
}

void Slot::setRawDisplayDatas(const std::vector<DisplayData*>* value)
{
    if (_rawDisplayDatas == value)
    {
        return;
    }

    _displayDirty = true;
    _rawDisplayDatas = value;

    if (_rawDisplayDatas != nullptr)
    {
        _displayDatas.resize(_rawDisplayDatas->size());

        for (std::size_t i = 0, l = _displayDatas.size(); i < l; ++i)
        {
            auto rawDisplayData = (*_rawDisplayDatas)[i];

            if (rawDisplayData == nullptr)
            {
                rawDisplayData = _getDefaultRawDisplayData(i);
            }

            _displayDatas[i] = rawDisplayData;
        }
    }
    else 
    {
        _displayDatas.clear();
    }
}

void Slot::setDisplay(void* value, DisplayType displayType)
{
    if (_display == value)
    {
        return;
    }

    const auto displayListLength = _displayList.size();
    if (_displayIndex < 0 && displayListLength == 0)  // Emprty
    {
        _displayIndex = 0;
    }

    if (_displayIndex < 0)
    {
        return;
    }
    else
    {
        auto relpaceDisplayList = _displayList; // copy
        if (displayListLength <= (std::size_t)_displayIndex)
        {
            relpaceDisplayList.resize(_displayIndex + 1);
        }

        relpaceDisplayList[_displayIndex].first = value;
        relpaceDisplayList[_displayIndex].second = displayType;

        setDisplayList(relpaceDisplayList);
    }
}

void Slot::setChildArmature(Armature* value)
{
    if (_childArmature == value)
    {
        return;
    }

    setDisplay(value, DisplayType::Armature);
}

DRAGONBONES_NAMESPACE_END
