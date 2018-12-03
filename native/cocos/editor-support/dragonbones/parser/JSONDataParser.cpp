#include "JSONDataParser.h"

DRAGONBONES_NAMESPACE_BEGIN

void JSONDataParser::_getCurvePoint(
    float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4,
    float t,
    Point& result
)
{
    const auto l_t = 1.0f - t;
    const auto powA = l_t * l_t;
    const auto powB = t * t;
    const auto kA = l_t * powA;
    const auto kB = 3.0f * t * powA;
    const auto kC = 3.0f * l_t * powB;
    const auto kD = t * powB;

    result.x = kA * x1 + kB * x2 + kC * x3 + kD * x4;
    result.y = kA * y1 + kB * y2 + kC * y3 + kD * y4;
}

void JSONDataParser::_samplingEasingCurve(const rapidjson::Value& curve, std::vector<float>& samples)
{
    int curveCount = curve.Size();
    int stepIndex = -2;
    for (std::size_t i = 0, l = samples.size(); i < l; ++i) 
    {
        float t = (float)(i + 1) / (l + 1); // float
        while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6].GetDouble() : 1) < t) // stepIndex + 3 * 2
        {
            stepIndex += 6;
        }

        const auto isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
        const auto x1 = isInCurve ? curve[stepIndex].GetDouble() : 0.0f;
        const auto y1 = isInCurve ? curve[stepIndex + 1].GetDouble() : 0.0f;
        const auto x2 = curve[stepIndex + 2].GetDouble();
        const auto y2 = curve[stepIndex + 3].GetDouble();
        const auto x3 = curve[stepIndex + 4].GetDouble();
        const auto y3 = curve[stepIndex + 5].GetDouble();
        const auto x4 = isInCurve ? curve[stepIndex + 6].GetDouble() : 1.0f;
        const auto y4 = isInCurve ? curve[stepIndex + 7].GetDouble() : 1.0f;

        float lower = 0.0f;
        float higher = 1.0f;
        while (higher - lower > 0.0001f) 
        {
            const auto percentage = (higher + lower) * 0.5f;
            _getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, _helpPoint);
            if (t - _helpPoint.x > 0.0f) 
            {
                lower = percentage;
            }
            else {
                higher = percentage;
            }
        }

        samples[i] = _helpPoint.y;
    }
}

void JSONDataParser::_parseActionDataInFrame(const rapidjson::Value& rawData, unsigned frameStart, BoneData* bone, SlotData* slot)
{
    if (rawData.HasMember(EVENT))
    {
        _mergeActionFrame(rawData[EVENT], frameStart, ActionType::Frame, bone, slot);
    }

    if (rawData.HasMember(SOUND))
    {
        _mergeActionFrame(rawData[SOUND], frameStart, ActionType::Sound, bone, slot);
    }

    if (rawData.HasMember(ACTION))
    {
        _mergeActionFrame(rawData[ACTION], frameStart, ActionType::Play, bone, slot);
    }
    
    if (rawData.HasMember(EVENTS))
    {
        _mergeActionFrame(rawData[EVENTS], frameStart, ActionType::Frame, bone, slot);
    }

    if (rawData.HasMember(ACTIONS))
    {
        _mergeActionFrame(rawData[ACTIONS], frameStart, ActionType::Play, bone, slot);
    }
}

void JSONDataParser::_mergeActionFrame(const rapidjson::Value& rawData, unsigned frameStart, ActionType type, BoneData* bone, SlotData* slot)
{
    const auto actionOffset = _armature->actions.size();
    const auto& actions = _parseActionData(rawData, type, bone, slot);
    ActionFrame* frame = nullptr;

    for (const auto action : actions) 
    {
        _armature->addAction(action, false);
    }

    if (_actionFrames.empty()) // First frame.
    {
        _actionFrames.resize(1);
        _actionFrames[0].frameStart = 0;
    }

    for (auto& eachFrame : _actionFrames) // Get same frame.
    {
        if (eachFrame.frameStart == frameStart) 
        {
            frame = &eachFrame;
            break;
        }
    }

    if (frame == nullptr) // Create and cache frame.
    {
        const auto frameCount = _actionFrames.size();
        _actionFrames.resize(frameCount + 1);
        frame = &_actionFrames[frameCount];
        frame->frameStart = frameStart;
    }

    for (std::size_t i = 0; i < actions.size(); ++i) // Cache action offsets.
    {
        frame->actions.push_back(actionOffset + i);
    }
}

unsigned JSONDataParser::_parseCacheActionFrame(ActionFrame& frame)
{
    const auto frameOffset = _frameArray.size();
    const auto actionCount = frame.actions.size();
    _frameArray.resize(_frameArray.size() + 1 + 1 + actionCount);
    _frameArray[frameOffset + (unsigned)BinaryOffset::FramePosition] = frame.frameStart;
    _frameArray[frameOffset + (unsigned)BinaryOffset::FramePosition + 1] = actionCount; // Action count.

    for (std::size_t i = 0; i < actionCount; ++i) // Action offsets.
    {
        _frameArray[frameOffset + (unsigned)BinaryOffset::FramePosition + 2 + i] = frame.actions[i];
    }

    return frameOffset;
}

ArmatureData* JSONDataParser::_parseArmature(const rapidjson::Value& rawData, float scale)
{
    const auto armature = BaseObject::borrowObject<ArmatureData>();
    armature->name = _getString(rawData, NAME, "");
    armature->frameRate = _getNumber(rawData, FRAME_RATE, _data->frameRate);
    armature->scale = scale;

    if (rawData.HasMember(TYPE) && rawData[TYPE].IsString())
    {
        armature->type = _getArmatureType(rawData[TYPE].GetString());
    }
    else
    {
        armature->type = (ArmatureType)_getNumber(rawData, TYPE, (int)ArmatureType::Armature);
    }

    if (armature->frameRate == 0) // Data error.
    {
        armature->frameRate = 24;
    }

    _armature = armature;

    if (rawData.HasMember(CANVAS))
    {
        const auto& rawCanvas = rawData[CANVAS];
        const auto canvas = BaseObject::borrowObject<CanvasData>();
        canvas->hasBackground = rawCanvas.HasMember(COLOR);
        canvas->color = _getNumber(rawCanvas, COLOR, 0);
        canvas->aabb.x = _getNumber(rawCanvas, X, 0.0f) * armature->scale;
        canvas->aabb.y = _getNumber(rawCanvas, Y, 0.0f) * armature->scale;
        canvas->aabb.width = _getNumber(rawCanvas, WIDTH, 0.0f) * armature->scale;
        canvas->aabb.height = _getNumber(rawCanvas, HEIGHT, 0.0f) * armature->scale;
        //
        armature->canvas = canvas;
    }

    if (rawData.HasMember(AABB))
    {
        const auto& rawAABB = rawData[AABB];
        armature->aabb.x = _getNumber(rawAABB, X, 0.0f) * armature->scale;
        armature->aabb.y = _getNumber(rawAABB, Y, 0.0f) * armature->scale;
        armature->aabb.width = _getNumber(rawAABB, WIDTH, 0.0f) * armature->scale;
        armature->aabb.height = _getNumber(rawAABB, HEIGHT, 0.0f) * armature->scale;
    }

    if (rawData.HasMember(BONE))
    {
        const auto& rawBones = rawData[BONE];
        for (std::size_t i = 0, l = rawBones.Size(); i < l; ++i)
        {
            const auto& rawBone = rawBones[i];
            const auto& parentName = _getString(rawBone, PARENT, "");
            const auto bone = _parseBone(rawBone);

            if (!parentName.empty()) // Get bone parent.
            {
                const auto parent = armature->getBone(parentName);
                if (parent != nullptr) 
                {
                    bone->parent = parent;
                }
                else // Cache.
                {
                    auto& cacheBones = _cacheBones[parentName];
                    cacheBones.push_back(bone);
                }
            }
            
            auto iterator = _cacheBones.find(bone->name);
            if (iterator != _cacheBones.end())
            {
                for (const auto child : _cacheBones[bone->name]) 
                {
                    child->parent = bone;
                }

                _cacheBones.erase(iterator);
            }

            armature->addBone(bone);
            _rawBones.push_back(bone); // Cache raw bones sort.
        }
    }

    if (rawData.HasMember(IK))
    {
        const auto& rawIKS = rawData[IK];
        for (std::size_t i = 0, l = rawIKS.Size(); i < l; ++i)
        {
            const auto constraint = _parseIKConstraint(rawIKS[i]);
            if (constraint)
            {
                armature->addConstraint(constraint);
            }
        }
    }

    armature->sortBones();

    if (rawData.HasMember(SLOT))
    {
        int zOrder = 0;
        const auto& rawSlots = rawData[SLOT];
        for (std::size_t i = 0, l = rawSlots.Size(); i < l; ++i)
        {
            armature->addSlot(_parseSlot(rawSlots[i], zOrder++));
        }
    }

    if (rawData.HasMember(SKIN))
    {
        const auto& rawSkins = rawData[SKIN];
        for (std::size_t i = 0, l = rawSkins.Size(); i < l; ++i)
        {
            armature->addSkin(_parseSkin(rawSkins[i]));
        }
    }

    for (std::size_t i = 0, l = _cacheRawMeshes.size(); i < l; ++i) // Link mesh.
    { 
        const auto rawMeshData = _cacheRawMeshes[i];
        const auto& shareName = _getString(*rawMeshData, SHARE, "");
        if (shareName.empty()) {
            continue;
        }

        auto skinName = _getString(*rawMeshData, SKIN, DEFAULT_NAME);
        if (skinName.empty()) //
        {
            skinName = DEFAULT_NAME;
        }

        const auto shareMesh = armature->getMesh(skinName, "", shareName); // TODO slot;
        if (shareMesh == nullptr) {
            continue; // Error.
        }

        const auto mesh = _cacheMeshes[i];
        mesh->vertices.shareFrom(shareMesh->vertices);
    }

    if (rawData.HasMember(ANIMATION))
    {
        const auto& rawAnimations = rawData[ANIMATION];
        for (std::size_t i = 0, l = rawAnimations.Size(); i < l; ++i)
        {
            armature->addAnimation(_parseAnimation(rawAnimations[i]));
        }
    }

    if (rawData.HasMember(DEFAULT_ACTIONS))
    {
        const auto& actions = _parseActionData(rawData[DEFAULT_ACTIONS], ActionType::Play, nullptr, nullptr);
        for (const auto action : actions) 
        {
            armature->addAction(action, true);

            if (action->type == ActionType::Play) // Set default animation from default action.
            { 
                const auto animation = armature->getAnimation(action->name);
                if (animation != nullptr)
                {
                    armature->defaultAnimation = animation;
                }
            }
        }
    }

    if (rawData.HasMember(ACTIONS))
    {
        const auto& actions = _parseActionData(rawData[ACTIONS], ActionType::Play, nullptr, nullptr);

        for (const auto action : actions)
        {
            armature->addAction(action, false);
        }
    }

    // Clear helper.
    _rawBones.clear();
    _cacheRawMeshes.clear();
    _cacheMeshes.clear();
    _armature = nullptr;

    _weightSlotPose.clear();
    _weightBonePoses.clear();
    _cacheBones.clear();
    _slotChildActions.clear();

    return armature;
}

BoneData* JSONDataParser::_parseBone(const rapidjson::Value& rawData)
{
    const auto bone = BaseObject::borrowObject<BoneData>();
    bone->inheritTranslation = _getBoolean(rawData, INHERIT_TRANSLATION, true);
    bone->inheritRotation = _getBoolean(rawData, INHERIT_ROTATION, true);
    bone->inheritScale = _getBoolean(rawData, INHERIT_SCALE, true);
    bone->inheritReflection = _getBoolean(rawData, INHERIT_REFLECTION, true);
    bone->length = _getNumber(rawData, LENGTH, 0.0f) * _armature->scale;
    bone->name = _getString(rawData, NAME, "");

    if (rawData.HasMember(TRANSFORM))
    {
        _parseTransform(rawData[TRANSFORM], bone->transform, _armature->scale);
    }

    return bone;
}

ConstraintData* JSONDataParser::_parseIKConstraint(const rapidjson::Value& rawData)
{
    const auto bone = _armature->getBone(_getString(rawData, BONE, ""));
    if (bone == nullptr)
    {
        return nullptr;
    }

    const auto target = _armature->getBone(_getString(rawData, TARGET, ""));
    if (target == nullptr)
    {
        return nullptr;
    }

    const auto constraint = BaseObject::borrowObject<IKConstraintData>();
    constraint->scaleEnabled = _getBoolean(rawData, SCALE, false);
    constraint->bendPositive = _getBoolean(rawData, BEND_POSITIVE, true);
    constraint->weight = _getNumber(rawData, WEIGHT, 1.0f);
    constraint->name = _getString(rawData, NAME, "");
    constraint->bone = bone;
    constraint->target = target;

    const auto chain = _getNumber(rawData, CHAIN, (unsigned)0);
    if (chain > 0 && bone->parent != nullptr) 
    {
        constraint->root = bone->parent;
        constraint->bone = bone;
    }
    else 
    {
        constraint->root = bone;
        constraint->bone = nullptr;
    }

    return constraint;
}

SlotData* JSONDataParser::_parseSlot(const rapidjson::Value& rawData, int zOrder)
{
    const auto slot = BaseObject::borrowObject<SlotData>();
    slot->displayIndex = _getNumber(rawData, DISPLAY_INDEX, (int)0);
    slot->zOrder = zOrder;
    slot->name = _getString(rawData, NAME, "");
    slot->parent = _armature->getBone(_getString(rawData, PARENT, ""));

    if (rawData.HasMember(BLEND_MODE) && rawData[BLEND_MODE].IsString())
    {
        slot->blendMode = _getBlendMode(rawData[BLEND_MODE].GetString());
    }
    else
    {
        slot->blendMode = (BlendMode)_getNumber(rawData, BLEND_MODE, (int)BlendMode::Normal);
    }

    if (rawData.HasMember(COLOR))
    {
        slot->color = SlotData::createColor();
        _parseColorTransform(rawData[COLOR], *slot->color);
    }
    else
    {
        slot->color = &SlotData::DEFAULT_COLOR;
    }

    if (rawData.HasMember(ACTIONS))
    {
        _slotChildActions[slot->name] = _parseActionData(rawData[ACTIONS], ActionType::Play, nullptr, nullptr);
    }

    return slot;
}

SkinData * JSONDataParser::_parseSkin(const rapidjson::Value& rawData)
{
    const auto skin = BaseObject::borrowObject<SkinData>();
    skin->name = _getString(rawData, NAME, DEFAULT_NAME);
    if (skin->name.empty())
    {
        skin->name = DEFAULT_NAME;
    }

    if (rawData.HasMember(SLOT))
    {
        const auto& rawSlots = rawData[SLOT];
        _skin = skin;

        for (std::size_t i = 0, l = rawSlots.Size(); i < l; ++i)
        {
            const auto& rawSlot = rawSlots[i];
            const auto& slotName = _getString(rawSlot, NAME, "");
            const auto slot = _armature->getSlot(slotName);
            if (slot != nullptr) 
            {
                _slot = slot;

                if (rawSlot.HasMember(DISPLAY)) 
                {
                    const auto& rawDisplays = rawSlot[DISPLAY];
                    for (std::size_t j = 0, lJ = rawDisplays.Size(); j < lJ; ++j)
                    {
                        const auto& rawDisplay = rawDisplays[j];
                        if (!rawDisplay.IsNull()) 
                        {
                            skin->addDisplay(slotName, _parseDisplay(rawDisplay));
                        }
                        else 
                        {
                            skin->addDisplay(slotName, nullptr);
                        }
                    }
                }

                _slot = nullptr;
            }
        }

        _skin = nullptr;
    }

    return skin;
}

DisplayData* JSONDataParser::_parseDisplay(const rapidjson::Value& rawData)
{
    const auto& name = _getString(rawData, NAME, "");
    const auto& path = _getString(rawData, PATH, "");
    auto type = DisplayType::Image;
    DisplayData* display = nullptr;

    if (rawData.HasMember(TYPE) && rawData[TYPE].IsString())
    {
        type = _getDisplayType(rawData[TYPE].GetString());
    }
    else
    {
        type = (DisplayType)_getNumber(rawData, TYPE, (int)DisplayType::Image);
    }

    switch (type)
    {
        case dragonBones::DisplayType::Image:
        {
            const auto imageDisplay = BaseObject::borrowObject<ImageDisplayData>();
            imageDisplay->name = name;
            imageDisplay->path = !path.empty() ? path : name;
            _parsePivot(rawData, *imageDisplay);

            display = imageDisplay;
            break;
        }

        case dragonBones::DisplayType::Armature:
        {
            const auto armatureDisplay = BaseObject::borrowObject<ArmatureDisplayData>();
            armatureDisplay->name = name;
            armatureDisplay->path = !path.empty() ? path : name;
            armatureDisplay->inheritAnimation = true;

            if (rawData.HasMember(ACTIONS))
            {
                const auto& actions = _parseActionData(rawData[ACTIONS], ActionType::Play, nullptr, nullptr);

                for (const auto action : actions) 
                {
                    armatureDisplay->addAction(action);
                }
            }
            else if (_slotChildActions.find(_slot->name) != _slotChildActions.cend())
            {
                const auto displays = _skin->getDisplays(_slot->name);
                if (displays == nullptr ? _slot->displayIndex == 0 : (std::size_t)_slot->displayIndex == displays->size())
                {
                    for (const auto action : _slotChildActions[_slot->name])
                    {
                        armatureDisplay->addAction(action);
                    }

                    _slotChildActions.erase(_slotChildActions.find(_slot->name));
                }
            }

            display = armatureDisplay;
            break;
        }

        case dragonBones::DisplayType::Mesh:
        {
            const auto meshDisplay = BaseObject::borrowObject<MeshDisplayData>();
            meshDisplay->vertices.inheritDeform = _getBoolean(rawData, INHERIT_DEFORM, true);
            meshDisplay->name = name;
            meshDisplay->path = !path.empty() ? path : name;
            meshDisplay->vertices.data = _data;

            if (rawData.HasMember(SHARE))
            {
                _cacheRawMeshes.push_back(&rawData);
                _cacheMeshes.push_back(meshDisplay);
            }
            else
            {
                _parseMesh(rawData, *meshDisplay);
            }

            display = meshDisplay;
            break;
        }

        case dragonBones::DisplayType::BoundingBox:
        {
            const auto boundingBox = _parseBoundingBox(rawData);
            if (boundingBox != nullptr)
            {
                const auto boundingBoxDisplay = BaseObject::borrowObject<BoundingBoxDisplayData>();
                boundingBoxDisplay->name = name;
                boundingBoxDisplay->path = !path.empty() ? path : name;
                boundingBoxDisplay->boundingBox = boundingBox;

                display = boundingBoxDisplay;
            }
            break;
        }
    }

    if (display != nullptr && rawData.HasMember(TRANSFORM))
    {
        _parseTransform(rawData[TRANSFORM], display->transform, _armature->scale);
    }

    return display;
}

void JSONDataParser::_parsePivot(const rapidjson::Value& rawData, ImageDisplayData& display)
{
    if (rawData.HasMember(PIVOT))
    {
        const auto& rawPivot = rawData[PIVOT];
        display.pivot.x = _getNumber(rawPivot, X, 0.0f);
        display.pivot.y = _getNumber(rawPivot, Y, 0.0f);
    }
    else 
    {
        display.pivot.x = 0.5f;
        display.pivot.y = 0.5f;
    }
}

void JSONDataParser::_parseMesh(const rapidjson::Value& rawData, MeshDisplayData& mesh)
{
    const auto& rawVertices = rawData[VERTICES];
    const auto& rawUVs = rawData[UVS];
    const auto& rawTriangles = rawData[TRIANGLES];
    const auto vertexCount = rawVertices.Size() / 2;
    const auto triangleCount = rawTriangles.Size() / 3;
    const auto vertexOffset = _floatArray.size();
    const auto uvOffset = vertexOffset + vertexCount * 2;
    const auto meshOffset = _intArray.size();
    const auto meshName = _skin->name + "_" + _slot->name + "_" + mesh.name;  // Cache pose data.

    mesh.vertices.offset = meshOffset;
    _intArray.resize(_intArray.size() + 1 + 1 + 1 + 1 + triangleCount * 3);
    _intArray[meshOffset + (unsigned)BinaryOffset::MeshVertexCount] = vertexCount;
    _intArray[meshOffset + (unsigned)BinaryOffset::MeshTriangleCount] = triangleCount;
    _intArray[meshOffset + (unsigned)BinaryOffset::MeshFloatOffset] = vertexOffset;
    for (std::size_t i = 0, l = triangleCount * 3; i < l; ++i) 
    {
        _intArray[meshOffset + (unsigned)BinaryOffset::MeshVertexIndices + i] = rawTriangles[i].GetUint();
    }

    _floatArray.resize(_floatArray.size() + vertexCount * 2 + vertexCount * 2);
    for (std::size_t i = 0, l = vertexCount * 2; i < l; ++i) 
    {
        _floatArray[vertexOffset + i] = rawVertices[i].GetDouble();
        _floatArray[uvOffset + i] = rawUVs[i].GetDouble();
    }

    if (rawData.HasMember(WEIGHTS)) 
    {
        const auto& rawWeights = rawData[WEIGHTS];
        const auto& rawSlotPose = rawData[SLOT_POSE];
        const auto& rawBonePoses = rawData[BONE_POSE];
        const auto& sortedBones = _armature->sortedBones;
        std::vector<unsigned> weightBoneIndices;
        const unsigned weightBoneCount = rawBonePoses.Size() / 7;
        const auto floatOffset = _floatArray.size();
        const auto weightCount = (rawWeights.Size() - vertexCount) / 2; // uint
        const auto weightOffset = _intArray.size();
        const auto weight = BaseObject::borrowObject<WeightData>();

        weight->count = weightCount;
        weight->offset = weightOffset;
        weightBoneIndices.resize(weightBoneCount);
        _intArray.resize(_intArray.size() + 1 + 1 + weightBoneCount + vertexCount + weightCount);
        _intArray[weightOffset + (unsigned)BinaryOffset::WeigthFloatOffset] = floatOffset;

        for (std::size_t i = 0; i < weightBoneCount; ++i) 
        {
            const auto rawBoneIndex = rawBonePoses[i * 7].GetUint();
            const auto bone = _rawBones[rawBoneIndex];
            weight->addBone(bone);
            weightBoneIndices[i] = rawBoneIndex;
            _intArray[weightOffset + (unsigned)BinaryOffset::WeigthBoneIndices + i] = indexOf(sortedBones, bone);
        }

        _floatArray.resize(_floatArray.size() + weightCount * 3);

        _helpMatrixA.a = rawSlotPose[0].GetDouble();
        _helpMatrixA.b = rawSlotPose[1].GetDouble();
        _helpMatrixA.c = rawSlotPose[2].GetDouble();
        _helpMatrixA.d = rawSlotPose[3].GetDouble();
        _helpMatrixA.tx = rawSlotPose[4].GetDouble();
        _helpMatrixA.ty = rawSlotPose[5].GetDouble();

        for (
            std::size_t i = 0, iW = 0, iB = weightOffset + (unsigned)BinaryOffset::WeigthBoneIndices + weightBoneCount, iV = floatOffset;
            i < vertexCount;
            ++i
        ) 
        {
            const auto iD = i * 2;
            const auto vertexBoneCount = rawWeights[iW++].GetUint();
            _intArray[iB++] = vertexBoneCount;

            auto x = _floatArray[vertexOffset + iD];
            auto y = _floatArray[vertexOffset + iD + 1];
            _helpMatrixA.transformPoint(x, y, _helpPoint);

            x = _helpPoint.x;
            y = _helpPoint.y;

            for (std::size_t j = 0; j < vertexBoneCount; ++j)
            {
                const auto rawBoneIndex = rawWeights[iW++].GetUint();
                const auto boneIndex = indexOf(weightBoneIndices, rawBoneIndex);
                const auto matrixOffset = boneIndex * 7 + 1;

                _helpMatrixB.a = rawBonePoses[matrixOffset + 0].GetDouble();
                _helpMatrixB.b = rawBonePoses[matrixOffset + 1].GetDouble();
                _helpMatrixB.c = rawBonePoses[matrixOffset + 2].GetDouble();
                _helpMatrixB.d = rawBonePoses[matrixOffset + 3].GetDouble();
                _helpMatrixB.tx = rawBonePoses[matrixOffset + 4].GetDouble();
                _helpMatrixB.ty = rawBonePoses[matrixOffset + 5].GetDouble();
                _helpMatrixB.invert();
                _helpMatrixB.transformPoint(x, y, _helpPoint);

                _intArray[iB++] = boneIndex;
                _floatArray[iV++] = rawWeights[iW++].GetDouble();
                _floatArray[iV++] = _helpPoint.x;
                _floatArray[iV++] = _helpPoint.y;
            }
        }

        mesh.vertices.weight = weight;
        _weightSlotPose[meshName] = &rawSlotPose;
        _weightBonePoses[meshName] = &rawBonePoses;
    }
}

BoundingBoxData* JSONDataParser::_parseBoundingBox(const rapidjson::Value& rawData)
{
    BoundingBoxData* boundingBox = nullptr;
    BoundingBoxType type = BoundingBoxType::Rectangle;
    if (rawData.HasMember(SUB_TYPE) && rawData[SUB_TYPE].IsString())
    {
        type = _getBoundingBoxType(rawData[SUB_TYPE].GetString());
    }
    else 
    {
        type = (BoundingBoxType)_getNumber(rawData, SUB_TYPE, (int)type);
    }

    switch (type) 
    {
        case BoundingBoxType::Rectangle:
            boundingBox = BaseObject::borrowObject<RectangleBoundingBoxData>();
            break;

        case BoundingBoxType::Ellipse:
            boundingBox = BaseObject::borrowObject<EllipseBoundingBoxData>();
            break;

        case BoundingBoxType::Polygon:
            boundingBox = _parsePolygonBoundingBox(rawData);
            break;
    }

    if (boundingBox != nullptr) 
    {
        boundingBox->color = _getNumber(rawData, COLOR, 0x000000);
        if (boundingBox->type == BoundingBoxType::Rectangle || boundingBox->type == BoundingBoxType::Ellipse)
        {
            boundingBox->width = _getNumber(rawData, WIDTH, 0.0f);
            boundingBox->height = _getNumber(rawData, HEIGHT, 0.0f);
        }
    }

    return boundingBox;
}

PolygonBoundingBoxData* JSONDataParser::_parsePolygonBoundingBox(const rapidjson::Value& rawData)
{
    const auto polygonBoundingBox = BaseObject::borrowObject<PolygonBoundingBoxData>();

    if (rawData.HasMember(VERTICES))
    {
        const auto& rawVertices = rawData[VERTICES];
        auto& vertices = polygonBoundingBox->vertices;

        polygonBoundingBox->vertices.resize(rawVertices.Size());

        for (std::size_t i = 0, l = rawVertices.Size(); i < l; i += 2)
        {
            const auto x = rawVertices[i].GetDouble();
            const auto y = rawVertices[i + 1].GetDouble();
            vertices[i] = x;
            vertices[i + 1] = y;

            // AABB.
            if (i == 0)
            {
                polygonBoundingBox->x = x;
                polygonBoundingBox->y = y;
                polygonBoundingBox->width = x;
                polygonBoundingBox->height = y;
            }
            else
            {
                if (x < polygonBoundingBox->x)
                {
                    polygonBoundingBox->x = x;
                }
                else if (x > polygonBoundingBox->width)
                {
                    polygonBoundingBox->width = x;
                }

                if (y < polygonBoundingBox->y)
                {
                    polygonBoundingBox->y = y;
                }
                else if (y > polygonBoundingBox->height)
                {
                    polygonBoundingBox->height = y;
                }
            }
        }

        polygonBoundingBox->width -= polygonBoundingBox->x;
        polygonBoundingBox->height -= polygonBoundingBox->y;
    }
    else 
    {
        DRAGONBONES_ASSERT(false, "Data error.\n Please reexport DragonBones Data to fixed the bug.");
    }

    return polygonBoundingBox;
}

AnimationData* JSONDataParser::_parseAnimation(const rapidjson::Value& rawData)
{
    const auto animation = BaseObject::borrowObject<AnimationData>();
    animation->frameCount = std::max(_getNumber(rawData, DURATION, (unsigned)1), (unsigned)1);
    animation->playTimes = _getNumber(rawData, PLAY_TIMES, (unsigned)1);
    animation->duration = (float)animation->frameCount / _armature->frameRate; // float
    animation->fadeInTime = _getNumber(rawData, FADE_IN_TIME, 0.0f);
    animation->scale = _getNumber(rawData, SCALE, 1.0f);
    animation->name = _getString(rawData, NAME, DEFAULT_NAME);

    if (animation->name.empty())
    {
        animation->name = DEFAULT_NAME;
    }

    animation->frameIntOffset = _frameIntArray.size();
    animation->frameFloatOffset = _frameFloatArray.size();
    animation->frameOffset = _frameArray.size();

    _animation = animation;

    if (rawData.HasMember(FRAME))
    {
        const auto& rawFrames = rawData[FRAME];
        const auto keyFrameCount = rawFrames.Size();
        if (keyFrameCount > 0) 
        {
            for (std::size_t i = 0, frameStart = 0; i < keyFrameCount; ++i) 
            {
                const auto& rawFrame = rawFrames[i];
                _parseActionDataInFrame(rawFrame, frameStart, nullptr, nullptr);
                frameStart += _getNumber(rawFrame, DURATION, (unsigned)1);
            }
        }
    }

    if (rawData.HasMember(Z_ORDER))
    {
        _animation->zOrderTimeline = _parseTimeline(
            rawData[Z_ORDER], FRAME, TimelineType::ZOrder,
            false, false, 0,
            std::bind(&JSONDataParser::_parseZOrderFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
        );
    }

    if (rawData.HasMember(BONE))
    {
        const auto& rawTimelines = rawData[BONE];
        for (std::size_t i = 0, l = rawTimelines.Size(); i < l; ++i)
        {
            _parseBoneTimeline(rawTimelines[i]);
        }
    }

    if (rawData.HasMember(SLOT))
    {
        const auto& rawTimelines = rawData[SLOT];
        for (std::size_t i = 0, l = rawTimelines.Size(); i < l; ++i)
        {
            _parseSlotTimeline(rawTimelines[i]);
        }
    }

    if (rawData.HasMember(FFD))
    {
        const auto& rawTimelines = rawData[FFD];
        for (std::size_t i = 0, l = rawTimelines.Size(); i < l; ++i)
        {
            const auto& rawTimeline = rawTimelines[i];
            auto skinName = _getString(rawTimeline, SKIN, DEFAULT_NAME);
            const auto& slotName = _getString(rawTimeline, SLOT, "");
            const auto& displayName = _getString(rawTimeline, NAME, "");

            if (skinName.empty()) //
            {
                skinName = DEFAULT_NAME;
            }

            _slot = _armature->getSlot(slotName);
            _mesh = _armature->getMesh(skinName, slotName, displayName);
            if (_slot == nullptr || _mesh == nullptr)
            {
                continue;
            }

            const auto timeline = _parseTimeline(
                rawTimeline, FRAME, TimelineType::SlotDeform, 
                false, true, 0, 
                std::bind(&JSONDataParser::_parseSlotFFDFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
            );
            if (timeline != nullptr)
            {
                _animation->addSlotTimeline(_slot, timeline);
            }

            _slot = nullptr;
            _mesh = nullptr;
        }
    }

    if (rawData.HasMember(IK))
    {
        const auto& rawTimelines = rawData[IK];
        for (std::size_t i = 0, l = rawTimelines.Size(); i < l; ++i)
        {
            const auto& rawTimeline = rawTimelines[i];
            const auto& constraintName = _getString(rawTimeline, NAME, "");
            const auto constraint = _armature->getConstraint(constraintName);
            if (constraint == nullptr)
            {
                continue;
            }

            const auto timeline = _parseTimeline(
                rawTimeline, FRAME, TimelineType::IKConstraint, 
                true, false, 2,
                std::bind(&JSONDataParser::_parseIKConstraintFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
            );

            if (timeline != nullptr)
            {
                _animation->addConstraintTimeline(constraint, timeline);
            }
        }
    }

    if (_actionFrames.size() > 0)
    {
        std::sort(_actionFrames.begin(), _actionFrames.end());

        const auto timeline = _animation->actionTimeline = BaseObject::borrowObject<TimelineData>();
        const auto keyFrameCount = _actionFrames.size();
        timeline->type = TimelineType::Action;
        timeline->offset = _timelineArray.size();
        _timelineArray.resize(_timelineArray.size() + 1 + 1 + 1 + 1 + 1 + keyFrameCount);
        _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineScale] = 100;
        _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineOffset] = 0;
        _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineKeyFrameCount] = keyFrameCount;
        _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameValueCount] = 0;
        _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameValueOffset] = 0;

        _timeline = timeline;

        if (keyFrameCount == 1)
        {
            timeline->frameIndicesOffset = -1;
            _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameOffset + 0] = _parseCacheActionFrame(_actionFrames[0]) - _animation->frameOffset;
        }
        else {
            const auto totalFrameCount = _animation->frameCount + 1; // One more frame than animation.
            auto& frameIndices = _data->frameIndices;
            timeline->frameIndicesOffset = frameIndices.size();
            frameIndices.resize(frameIndices.size() + totalFrameCount);

            for (
                std::size_t i = 0, iK = 0, frameStart = 0, frameCount = 0;
                i < totalFrameCount;
                ++i
                )
            {
                if (frameStart + frameCount <= i && iK < keyFrameCount)
                {
                    auto& frame = _actionFrames[iK];
                    frameStart = frame.frameStart;
                    if (iK == keyFrameCount - 1)
                    {
                        frameCount = _animation->frameCount - frameStart;
                    }
                    else {
                        frameCount = _actionFrames[iK + 1].frameStart - frameStart;
                    }

                    _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameOffset + iK] = _parseActionFrame(frame, frameStart, frameCount) - _animation->frameOffset;
                    iK++;
                }

                frameIndices[timeline->frameIndicesOffset + i] = iK - 1;
            }
        }

        _timeline = nullptr;
        _actionFrames.clear();
    }

    _animation = nullptr;

    return animation;
}

TimelineData* JSONDataParser::_parseTimeline(
    const rapidjson::Value& rawData, const char* framesKey, TimelineType type,
    bool addIntOffset, bool addFloatOffset, unsigned frameValueCount,
    const std::function<unsigned(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)>& frameParser
)
{
    if (!rawData.HasMember(framesKey))
    {
        return nullptr;
    }

    const auto& rawFrames = rawData[framesKey];
    const auto keyFrameCount = rawFrames.Size();
    if (keyFrameCount == 0) 
    {
        return nullptr;
    }

    const auto timeline = BaseObject::borrowObject<TimelineData>();
    timeline->type = type;
    timeline->offset = _timelineArray.size();
    _timelineArray.resize(_timelineArray.size() + 1 + 1 + 1 + 1 + 1 + keyFrameCount);
    _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineScale] = _getNumber(rawData, SCALE, 1.0f) * 100.f;
    _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineOffset] = _getNumber(rawData, OFFSET, 0.0f) * 100.f;
    _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineKeyFrameCount] = keyFrameCount;
    _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameValueCount] = frameValueCount;
    if (addIntOffset) 
    {
        _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameValueOffset] = _frameIntArray.size() - _animation->frameIntOffset;
    }
    else if (addFloatOffset) 
    {
        _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameValueOffset] = _frameFloatArray.size() - _animation->frameFloatOffset;
    }
    else 
    {
        _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameValueOffset] = 0;
    }

    _timeline = timeline;

    if (keyFrameCount == 1) // Only one frame.
    {
        timeline->frameIndicesOffset = -1;
        _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameOffset + 0] = frameParser(rawFrames[0], 0, 0) - _animation->frameOffset;
    }
    else {
        unsigned frameIndicesOffset = 0;
        auto& frameIndices = _data->frameIndices;
        const auto totalFrameCount = _animation->frameCount + 1; // One more frame than animation.
        frameIndicesOffset = frameIndices.size();
        frameIndices.resize(frameIndicesOffset + totalFrameCount);
        timeline->frameIndicesOffset = frameIndicesOffset;

        for (
            std::size_t i = 0, iK = 0, frameStart = 0, frameCount = 0;
            i < totalFrameCount;
            ++i
        )
        {
            if (frameStart + frameCount <= i && iK < keyFrameCount) 
            {
                const auto&  rawFrame = rawFrames[iK];
                frameStart = i;
                frameCount = _getNumber(rawFrame, DURATION, (unsigned)1);
                if (iK == keyFrameCount - 1) 
                {
                    frameCount = _animation->frameCount - frameStart;
                }

                _timelineArray[timeline->offset + (unsigned)BinaryOffset::TimelineFrameOffset + iK] = frameParser(rawFrame, frameStart, frameCount) - _animation->frameOffset;
                iK++;
            }

            frameIndices[frameIndicesOffset + i] = iK - 1;
        }
    }

    _timeline = nullptr;

    return timeline;
}

void JSONDataParser::_parseBoneTimeline(const rapidjson::Value& rawData)
{
    const auto bone = _armature->getBone(_getString(rawData, NAME, ""));
    if (bone == nullptr) 
    {
        return;
    }

    _bone = bone;
    _slot = _armature->getSlot(_bone->name);

    if (rawData.HasMember(TRANSLATE_FRAME))
    {
        const auto timeline = _parseTimeline(
            rawData, TRANSLATE_FRAME, TimelineType::BoneTranslate,
            false, true, 2,
            std::bind(&JSONDataParser::_parseBoneTranslateFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
        );
        if (timeline != nullptr)
        {
            _animation->addBoneTimeline(bone, timeline);
        }
    }

    if (rawData.HasMember(ROTATE_FRAME))
    {
        const auto timeline = _parseTimeline(
            rawData, ROTATE_FRAME, TimelineType::BoneRotate,
            false, true, 2,
            std::bind(&JSONDataParser::_parseBoneRotateFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
        );
        if (timeline != nullptr)
        {
            _animation->addBoneTimeline(bone, timeline);
        }
    }

    if (rawData.HasMember(SCALE_FRAME))
    {
        const auto timeline = _parseTimeline(
            rawData, SCALE_FRAME, TimelineType::BoneScale,
            false, true, 2,
            std::bind(&JSONDataParser::_parseBoneScaleFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
        );
        if (timeline != nullptr)
        {
            _animation->addBoneTimeline(bone, timeline);
        }
    }

    if (rawData.HasMember(FRAME))
    {
        const auto timeline = _parseTimeline(
            rawData, FRAME, TimelineType::BoneAll,
            false, true, 6,
            std::bind(&JSONDataParser::_parseBoneAllFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
        );
        if (timeline != nullptr)
        {
            _animation->addBoneTimeline(bone, timeline);
        }
    }

    _bone = nullptr;
    _slot = nullptr;
}

void JSONDataParser::_parseSlotTimeline(const rapidjson::Value& rawData)
{
    const auto slot = _armature->getSlot(_getString(rawData, NAME, ""));
    if (slot == nullptr) 
    {
        return;
    }

    TimelineData* displayTimeline = nullptr;
    TimelineData* colorTimeline = nullptr;
    _slot = slot;

    if (rawData.HasMember(DISPLAY_FRAME))
    {
        displayTimeline = _parseTimeline(
            rawData, DISPLAY_FRAME, TimelineType::SlotDisplay,
            false, false, 0,
            std::bind(&JSONDataParser::_parseSlotDisplayFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
        );
    }
    else
    {
        displayTimeline = _parseTimeline(
            rawData, FRAME, TimelineType::SlotDisplay,
            false, false, 0,
            std::bind(&JSONDataParser::_parseSlotDisplayFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
        );
    }

    if (rawData.HasMember(COLOR_FRAME))
    {
        colorTimeline = _parseTimeline(
            rawData, COLOR_FRAME, TimelineType::SlotColor,
            true, false, 1,
            std::bind(&JSONDataParser::_parseSlotColorFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
        );
    }
    else 
    {
        colorTimeline = _parseTimeline(
            rawData, FRAME, TimelineType::SlotColor,
            true, false, 1,
            std::bind(&JSONDataParser::_parseSlotColorFrame, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)
        );
    }

    if (displayTimeline != nullptr)
    {
        _animation->addSlotTimeline(slot, displayTimeline);
    }

    if (colorTimeline != nullptr) 
    {
        _animation->addSlotTimeline(slot, colorTimeline);
    }

    _slot = nullptr;
}

unsigned JSONDataParser::_parseFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    const auto frameOffset = _frameArray.size();
    _frameArray.resize(_frameArray.size() + 1);
    _frameArray[frameOffset + (unsigned)BinaryOffset::FramePosition] = frameStart;

    return frameOffset;
}

unsigned JSONDataParser::_parseTweenFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    const auto frameOffset = _parseFrame(rawData, frameStart, frameCount);

    if (frameCount > 0) 
    {
        if (rawData.HasMember(CURVE))
        {
            const auto sampleCount = frameCount + 1;
            _helpArray.resize(sampleCount);
            _samplingEasingCurve(rawData[CURVE], _helpArray);
            _frameArray.resize(_frameArray.size() + 1 + 1 + _helpArray.size());
            _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenType] = (int)TweenType::Curve;
            _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenEasingOrCurveSampleCount] = sampleCount;
            for (std::size_t i = 0; i < sampleCount; ++i)
            {
                _frameArray[frameOffset + (unsigned)BinaryOffset::FrameCurveSamples + i] = _helpArray[i] * 10000.0f;
            }
        }
        else 
        {
            const auto noTween = -2.0f;
            auto tweenEasing = noTween;
            if (rawData.HasMember(TWEEN_EASING))
            {
                tweenEasing = _getNumber(rawData, TWEEN_EASING, noTween);
            }

            if (tweenEasing == noTween) 
            {
                _frameArray.resize(_frameArray.size() + 1);
                _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenType] = (int16_t)TweenType::None;
            }
            else if (tweenEasing == 0.0f)
            {
                _frameArray.resize(_frameArray.size() + 1);
                _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenType] = (int16_t)TweenType::Line;
            }
            else if (tweenEasing < 0.0f) 
            {
                _frameArray.resize(_frameArray.size() + 1 + 1);
                _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenType] = (int16_t)TweenType::QuadIn;
                _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenEasingOrCurveSampleCount] = -tweenEasing * 100.0f;
            }
            else if (tweenEasing <= 1.0f) 
            {
                _frameArray.resize(_frameArray.size() + 1 + 1);
                _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenType] = (int16_t)TweenType::QuadOut;
                _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenEasingOrCurveSampleCount] = tweenEasing * 100.0f;
            }
            else 
            {
                _frameArray.resize(_frameArray.size() + 1 + 1);
                _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenType] = (int16_t)TweenType::QuadInOut;
                _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenEasingOrCurveSampleCount] = tweenEasing * 100.0f - 100.0f;
            }
        }
    }
    else 
    {
        _frameArray.resize(_frameArray.size() + 1);
        _frameArray[frameOffset + (unsigned)BinaryOffset::FrameTweenType] = (int16_t)TweenType::None;
    }

    return frameOffset;
}

unsigned JSONDataParser::_parseActionFrame(const ActionFrame& frame, unsigned frameStart, unsigned frameCount)
{
    const auto frameOffset = _frameArray.size();
    const auto actionCount = frame.actions.size();
    _frameArray.resize(_frameArray.size() + 1 + 1 + actionCount);
    _frameArray[frameOffset + (unsigned)BinaryOffset::FramePosition] = frameStart;
    _frameArray[frameOffset + (unsigned)BinaryOffset::FramePosition + 1] = actionCount; // Action count.

    for (std::size_t i = 0; i < actionCount; ++i) // Action offsets.
    {
        _frameArray[frameOffset + (unsigned)BinaryOffset::FramePosition + 2 + i] = frame.actions[i];
    }

    return frameOffset;
}

unsigned JSONDataParser::_parseZOrderFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    const auto frameOffset = _parseFrame(rawData, frameStart, frameCount);

    if (rawData.HasMember(Z_ORDER))
    {
        const auto& rawZOrder = rawData[Z_ORDER];
        if (!rawZOrder.Empty()) 
        {
            const auto slotCount = _armature->sortedSlots.size();
            std::vector<int> unchanged;
            std::vector<int> zOrders;
            unchanged.resize(slotCount - rawZOrder.Size() / 2);
            zOrders.resize(slotCount);

            for (std::size_t i = 0; i < unchanged.size(); ++i)
            {
                unchanged[i] = 0;
            }

            for (std::size_t i = 0; i < slotCount; ++i) 
            {
                zOrders[i] = -1;
            }

            unsigned originalIndex = 0;
            unsigned unchangedIndex = 0;
            for (std::size_t i = 0, l = rawZOrder.Size(); i < l; i += 2) 
            {
                const auto slotIndex = rawZOrder[i].GetInt();
                const auto zOrderOffset = rawZOrder[i + 1].GetInt();
                while (originalIndex != (unsigned)slotIndex)
                {
                    unchanged[unchangedIndex++] = originalIndex++;
                }
                
                unsigned index = originalIndex + zOrderOffset;
                zOrders[index] = originalIndex++;
            }

            while (originalIndex < slotCount) 
            {
                unchanged[unchangedIndex++] = originalIndex++;
            }

            _frameArray.resize(_frameArray.size() + 1 + slotCount);
            _frameArray[frameOffset + 1] = slotCount;

            int i = slotCount;
            while (i--) 
            {
                if (zOrders[i] == -1) 
                {
                    _frameArray[frameOffset + 2 + i] = unchanged[--unchangedIndex];
                }
                else {
                    _frameArray[frameOffset + 2 + i] = zOrders[i];
                }
            }

            return frameOffset;
        }
    }

    _frameArray.resize(_frameArray.size() + 1);
    _frameArray[frameOffset + 1] = 0;

    return frameOffset;
}

unsigned JSONDataParser::_parseBoneAllFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    _helpTransform.identity();
    if (rawData.HasMember(TRANSFORM))
    {
        _parseTransform(rawData[TRANSFORM], _helpTransform, 1.0f);
    }

    // Modify rotation.
    auto rotation = _helpTransform.rotation;
    if (frameStart != 0) 
    {
        if (_prevClockwise == 0) 
        {
            rotation = _prevRotation + Transform::normalizeRadian(rotation - _prevRotation);
        }
        else 
        {
            if (_prevClockwise > 0 ? rotation >= _prevRotation : rotation <= _prevRotation) 
            {
                _prevClockwise = _prevClockwise > 0 ? _prevClockwise - 1 : _prevClockwise + 1;
            }

            rotation = _prevRotation + rotation - _prevRotation + Transform::PI_D * _prevClockwise;
        }
    }

    _prevClockwise = _getNumber(rawData, TWEEN_ROTATE, 0.0f);
    _prevRotation = rotation;
    //
    const auto frameOffset = _parseTweenFrame(rawData, frameStart, frameCount);
    auto frameFloatOffset = _frameFloatArray.size();
    _frameFloatArray.resize(_frameFloatArray.size() + 6);
    _frameFloatArray[frameFloatOffset++] = _helpTransform.x;
    _frameFloatArray[frameFloatOffset++] = _helpTransform.y;
    _frameFloatArray[frameFloatOffset++] = rotation;
    _frameFloatArray[frameFloatOffset++] = _helpTransform.skew;
    _frameFloatArray[frameFloatOffset++] = _helpTransform.scaleX;
    _frameFloatArray[frameFloatOffset++] = _helpTransform.scaleY;
    _parseActionDataInFrame(rawData, frameStart, _bone, _slot);

    return frameOffset;
}

unsigned JSONDataParser::_parseBoneTranslateFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    const auto frameOffset = _parseTweenFrame(rawData, frameStart, frameCount);
    auto frameFloatOffset = _frameFloatArray.size();
    _frameFloatArray.resize(_frameFloatArray.size() + 2);
    _frameFloatArray[frameFloatOffset++] = _getNumber(rawData, X, 0.0f);
    _frameFloatArray[frameFloatOffset++] = _getNumber(rawData, Y, 0.0f);

    return frameOffset;
}

unsigned JSONDataParser::_parseBoneRotateFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    // Modify rotation.
    auto rotation = _getNumber(rawData, ROTATE, 0.0f) * Transform::DEG_RAD;
    if (frameStart != 0)
    {
        if (_prevClockwise == 0)
        {
            rotation = _prevRotation + Transform::normalizeRadian(rotation - _prevRotation);
        }
        else
        {
            if (_prevClockwise > 0 ? rotation >= _prevRotation : rotation <= _prevRotation)
            {
                _prevClockwise = _prevClockwise > 0 ? _prevClockwise - 1 : _prevClockwise + 1;
            }

            rotation = _prevRotation + rotation - _prevRotation + Transform::PI_D * _prevClockwise;
        }
    }

    _prevClockwise = _getNumber(rawData, CLOCK_WISE, 0.0f);
    _prevRotation = rotation;
    //
    const auto frameOffset = _parseTweenFrame(rawData, frameStart, frameCount);
    auto frameFloatOffset = _frameFloatArray.size();
    _frameFloatArray.resize(_frameFloatArray.size() + 2);
    _frameFloatArray[frameFloatOffset++] = rotation;
    _frameFloatArray[frameFloatOffset++] = _getNumber(rawData, SKEW, 0.0f) * Transform::DEG_RAD;

    return frameOffset;
}

unsigned JSONDataParser::_parseBoneScaleFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    const auto frameOffset = _parseTweenFrame(rawData, frameStart, frameCount);

    auto frameFloatOffset = _frameFloatArray.size();
    _frameFloatArray.resize(_frameFloatArray.size() + 2);
    _frameFloatArray[frameFloatOffset++] = _getNumber(rawData, X, 1.0f);
    _frameFloatArray[frameFloatOffset++] = _getNumber(rawData, Y, 1.0f);

    return frameOffset;
}

unsigned JSONDataParser::_parseSlotDisplayFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    const auto frameOffset = _parseFrame(rawData, frameStart, frameCount);

    _frameArray.resize(_frameArray.size() + 1);

    if (rawData.HasMember(VALUE))
    {
        _frameArray[frameOffset + 1] = _getNumber(rawData, VALUE, 0);
    }
    else 
    {
        _frameArray[frameOffset + 1] = _getNumber(rawData, DISPLAY_INDEX, 0);
    }

    _parseActionDataInFrame(rawData, frameStart, _slot->parent, _slot);

    return frameOffset;
}

unsigned JSONDataParser::_parseSlotColorFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    const auto frameOffset = _parseTweenFrame(rawData, frameStart, frameCount);
    auto colorOffset = -1;

    if (rawData.HasMember(VALUE) || rawData.HasMember(COLOR))
    {
        const auto& rawColor = rawData.HasMember(VALUE) ? rawData[VALUE] : rawData[COLOR];
        if (
            rawColor.HasMember(ALPHA_MULTIPLIER) ||
            rawColor.HasMember(RED_MULTIPLIER) ||
            rawColor.HasMember(GREEN_MULTIPLIER) ||
            rawColor.HasMember(BLUE_MULTIPLIER) ||
            rawColor.HasMember(ALPHA_OFFSET) ||
            rawColor.HasMember(RED_OFFSET) ||
            rawColor.HasMember(GREEN_OFFSET) ||
            rawColor.HasMember(BLUE_OFFSET)
        )
        {
            _parseColorTransform(rawColor, _helpColorTransform);
            colorOffset = _intArray.size();
            _intArray.resize(_intArray.size() + 8);
            _intArray[colorOffset++] = _helpColorTransform.alphaMultiplier * 100;
            _intArray[colorOffset++] = _helpColorTransform.redMultiplier * 100;
            _intArray[colorOffset++] = _helpColorTransform.greenMultiplier * 100;
            _intArray[colorOffset++] = _helpColorTransform.blueMultiplier * 100;
            _intArray[colorOffset++] = _helpColorTransform.alphaOffset;
            _intArray[colorOffset++] = _helpColorTransform.redOffset;
            _intArray[colorOffset++] = _helpColorTransform.greenOffset;
            _intArray[colorOffset++] = _helpColorTransform.blueOffset;
            colorOffset -= 8;
        }
    }

    if (colorOffset < 0) 
    {
        if (_defaultColorOffset < 0) 
        {
            _defaultColorOffset = colorOffset = _intArray.size();
            _intArray.resize(_intArray.size() + 8);
            _intArray[colorOffset++] = 100;
            _intArray[colorOffset++] = 100;
            _intArray[colorOffset++] = 100;
            _intArray[colorOffset++] = 100;
            _intArray[colorOffset++] = 0;
            _intArray[colorOffset++] = 0;
            _intArray[colorOffset++] = 0;
            _intArray[colorOffset++] = 0;
        }

        colorOffset = _defaultColorOffset;
    }

    const auto frameIntOffset = _frameIntArray.size();
    _frameIntArray.resize(_frameIntArray.size() + 1);
    _frameIntArray[frameIntOffset] = colorOffset;

    return frameOffset;
}

unsigned JSONDataParser::_parseSlotFFDFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    const auto frameFloatOffset = _frameFloatArray.size();
    const auto frameOffset = _parseTweenFrame(rawData, frameStart, frameCount);
    const auto offset = _getNumber(rawData, OFFSET, (unsigned)0);
    const auto vertexCount = (unsigned)_intArray[_mesh->vertices.offset + (unsigned)BinaryOffset::MeshVertexCount];
    const auto meshName = _mesh->parent->name + "_" + _slot->name + "_" + _mesh->name;
    const auto weight = _mesh->vertices.weight;

    auto x = 0.0f;
    auto y = 0.0f;
    unsigned iB = 0;
    unsigned iV = 0;
    if (weight != nullptr)
    {
        const auto& rawSlotPose = *(_weightSlotPose[meshName]);

        _helpMatrixA.a = rawSlotPose[0].GetDouble();
        _helpMatrixA.b = rawSlotPose[1].GetDouble();
        _helpMatrixA.c = rawSlotPose[2].GetDouble();
        _helpMatrixA.d = rawSlotPose[3].GetDouble();
        _helpMatrixA.tx = rawSlotPose[4].GetDouble();
        _helpMatrixA.ty = rawSlotPose[5].GetDouble();

        _frameFloatArray.resize(_frameFloatArray.size() + weight->count * 2);
        iB = weight->offset + (unsigned)BinaryOffset::WeigthBoneIndices + weight->bones.size();
    }
    else 
    {
        _frameFloatArray.resize(_frameFloatArray.size() + vertexCount * 2);
    }

    for (
        std::size_t i = 0;
        i < vertexCount * 2;
        i += 2
    )
    {
        if (!rawData.HasMember(VERTICES)) // Fill 0.
        {
            x = 0.0f;
            y = 0.0f;
        }
        else 
        {
            if (i < offset || i - offset >= rawData[VERTICES].Size()) {
                x = 0.0f;
            }
            else 
            {
                x = rawData[VERTICES][i - offset].GetDouble();
            }

            if (i + 1 < offset || i + 1 - offset >= rawData[VERTICES].Size()) {
                y = 0.0f;
            }
            else 
            {
                y = rawData[VERTICES][i + 1 - offset].GetDouble();
            }
        }

        if (weight != nullptr) // If mesh is skinned, transform point by bone bind pose.
        {
            const auto& rawBonePoses = *(_weightBonePoses[meshName]);
            const unsigned vertexBoneCount = _intArray[iB++];

            _helpMatrixA.transformPoint(x, y, _helpPoint, true);
            x = _helpPoint.x;
            y = _helpPoint.y;

            for (std::size_t j = 0; j < vertexBoneCount; ++j)
            {
                const auto boneIndex = _intArray[iB++];
                const auto matrixOffset = boneIndex * 7 + 1;

                _helpMatrixB.a = rawBonePoses[matrixOffset + 0].GetDouble();
                _helpMatrixB.b = rawBonePoses[matrixOffset + 1].GetDouble();
                _helpMatrixB.c = rawBonePoses[matrixOffset + 2].GetDouble();
                _helpMatrixB.d = rawBonePoses[matrixOffset + 3].GetDouble();
                _helpMatrixB.tx = rawBonePoses[matrixOffset + 4].GetDouble();
                _helpMatrixB.ty = rawBonePoses[matrixOffset + 5].GetDouble();
                _helpMatrixB.invert();
                _helpMatrixB.transformPoint(x, y, _helpPoint, true);

                _frameFloatArray[frameFloatOffset + iV++] = _helpPoint.x;
                _frameFloatArray[frameFloatOffset + iV++] = _helpPoint.y;
            }
        }
        else 
        {
            _frameFloatArray[frameFloatOffset + i] = x;
            _frameFloatArray[frameFloatOffset + i + 1] = y;
        }
    }

    if (frameStart == 0) 
    {
        const auto frameIntOffset = _frameIntArray.size();
        _frameIntArray.resize(_frameIntArray.size() + 1 + 1 + 1 + 1 + 1);
        _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformVertexOffset] = _mesh->vertices.offset;
        _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformCount] = _frameFloatArray.size() - frameFloatOffset;
        _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformValueCount] = _frameFloatArray.size() - frameFloatOffset;
        _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformValueOffset] = 0;
        _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformFloatOffset] = frameFloatOffset;
        _timelineArray[_timeline->offset + (unsigned)BinaryOffset::TimelineFrameValueCount] = frameIntOffset - _animation->frameIntOffset;
    }

    return frameOffset;
}

unsigned JSONDataParser::_parseIKConstraintFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)
{
    const auto frameOffset = _parseTweenFrame(rawData, frameStart, frameCount);

    auto frameIntOffset = _frameIntArray.size();
    _frameIntArray.resize(_frameIntArray.size() + 2);
    _frameIntArray[frameIntOffset++] = _getBoolean(rawData, BEND_POSITIVE, true) ? 1 : 0;
    _frameIntArray[frameIntOffset++] = round(_getNumber(rawData, WEIGHT, 1.0f) * 100.0f);

    return frameOffset;
}

const std::vector<ActionData*>& JSONDataParser::_parseActionData(const rapidjson::Value& rawData, ActionType type, BoneData* bone, SlotData* slot)
{
    static std::vector<ActionData*> actions;
    actions.clear();

    if (rawData.IsString())
    {
        const auto action = BaseObject::borrowObject<ActionData>();
        action->type = type;
        action->name = rawData.GetString();
        action->bone = bone;
        action->slot = slot;
        actions.push_back(action);
    }
    else if (rawData.IsArray())
    {
        for (std::size_t iA = 0, lA = rawData.Size(); iA < lA; ++iA)
        {
            const auto& rawAction = rawData[iA];
            const auto action = BaseObject::borrowObject<ActionData>();

            if (rawAction.HasMember(GOTO_AND_PLAY))
            {
                action->type = ActionType::Play;
                action->name = _getString(rawAction, GOTO_AND_PLAY, "");
            }
            else 
            {
                if (rawAction.HasMember(TYPE) && rawAction[TYPE].IsString())
                {
                    action->type = _getActionType(rawAction[TYPE].GetString());
                }
                else 
                {
                    action->type = (ActionType)_getNumber(rawAction, TYPE, (int)type);
                }

                action->name = _getString(rawAction, NAME, "");
            }

            if (rawAction.HasMember(BONE))
            {
                const auto& boneName = _getString(rawAction, BONE, "");
                action->bone = _armature->getBone(boneName);
            }
            else {
                action->bone = bone;
            }

            if (rawAction.HasMember(SLOT))
            {
                const auto& slotName = _getString(rawAction, SLOT, "");
                action->slot = _armature->getSlot(slotName);
            }
            else 
            {
                action->slot = slot;
            }

            if (rawAction.HasMember(INTS))
            {
                if (action->data == nullptr) 
                {
                    action->data = BaseObject::borrowObject<UserData>();
                }

                const auto& rawInts = rawAction[INTS];
                for (std::size_t i = 0, l = rawInts.Size(); i < l; ++i)
                {
                    action->data->addInt(rawInts[i].GetInt());
                }
            }

            if (rawAction.HasMember(FLOATS))
            {
                if (action->data == nullptr)
                {
                    action->data = BaseObject::borrowObject<UserData>();
                }

                const auto& rawFloats = rawAction[FLOATS];
                for (std::size_t i = 0, l = rawFloats.Size(); i < l; ++i)
                {
                    action->data->addFloat(rawFloats[i].GetDouble());
                }
            }

            if (rawAction.HasMember(STRINGS))
            {
                if (action->data == nullptr)
                {
                    action->data = BaseObject::borrowObject<UserData>();
                }

                const auto& rawStrings = rawAction[STRINGS];
                for (std::size_t i = 0, l = rawStrings.Size(); i < l; ++i)
                {
                    action->data->addString(rawStrings[i].GetString());
                }
            }

            actions.push_back(action);
        }
    }

    return actions;
}

void JSONDataParser::_parseTransform(const rapidjson::Value& rawData, Transform& transform, float scale)
{
    transform.x = _getNumber(rawData, X, 0.0f) * scale;
    transform.y = _getNumber(rawData, Y, 0.0f) * scale;

    if (rawData.HasMember(ROTATE) || rawData.HasMember(SKEW))
    {
        transform.rotation = Transform::normalizeRadian(_getNumber(rawData, ROTATE, 0.0f) * Transform::DEG_RAD);
        transform.skew = Transform::normalizeRadian(_getNumber(rawData, SKEW, 0.0f) * Transform::DEG_RAD);
    }
    else if (rawData.HasMember(SKEW_X) || rawData.HasMember(SKEW_Y))
    {
        transform.rotation = Transform::normalizeRadian(_getNumber(rawData, SKEW_Y, 0.0f) * Transform::DEG_RAD);
        transform.skew = Transform::normalizeRadian(_getNumber(rawData, SKEW_X, 0.0f) * Transform::DEG_RAD) - transform.rotation;
    }

    transform.scaleX = _getNumber(rawData, SCALE_X, 1.0f);
    transform.scaleY = _getNumber(rawData, SCALE_Y, 1.0f);
}

void JSONDataParser::_parseColorTransform(const rapidjson::Value& rawData, ColorTransform& color)
{
    color.alphaMultiplier = _getNumber(rawData, ALPHA_MULTIPLIER, (int)100) * 0.01f;
    color.redMultiplier = _getNumber(rawData, RED_MULTIPLIER, (int)100) * 0.01f;
    color.greenMultiplier = _getNumber(rawData, GREEN_MULTIPLIER, (int)100) * 0.01f;
    color.blueMultiplier = _getNumber(rawData, BLUE_MULTIPLIER, (int)100) * 0.01f;
    color.alphaOffset = _getNumber(rawData, ALPHA_OFFSET, (int)0);
    color.redOffset = _getNumber(rawData, RED_OFFSET, (int)0);
    color.greenOffset = _getNumber(rawData, GREEN_OFFSET, (int)0);
    color.blueOffset = _getNumber(rawData, BLUE_OFFSET, (int)0);
}

void JSONDataParser::_parseArray(const rapidjson::Value& rawData)
{
    _intArray.clear();
    _floatArray.clear();
    _frameIntArray.clear();
    _frameFloatArray.clear();
    _frameArray.clear();
    _timelineArray.clear();
}

DragonBonesData* JSONDataParser::_parseDragonBonesData(const rapidjson::Value& rawData, float scale)
{
    const auto& version = _getString(rawData, VERSION, "");
    const auto& compatibleVersion = _getString(rawData, COMPATIBLE_VERSION, "");

    if (
        indexOf(DATA_VERSIONS, version) >= 0 ||
        indexOf(DATA_VERSIONS, compatibleVersion) >= 0
        )
    {
        const auto data = BaseObject::borrowObject<DragonBonesData>();
        data->version = version;
        data->name = _getString(rawData, NAME, "");
        data->frameRate = _getNumber(rawData, FRAME_RATE, 24);

        if (data->frameRate == 0) // Data error.
        {
            data->frameRate = 24;
        }

        if (rawData.HasMember(ARMATURE))
        {
            _data = data;
            _parseArray(rawData);

            const auto& rawArmatures = rawData[ARMATURE];
            for (std::size_t i = 0, l = rawArmatures.Size(); i < l; ++i)
            {
                data->addArmature(_parseArmature(rawArmatures[i], scale));
            }

            if (data->binary == nullptr)
            {
                // Align.
                if (fmod(_intArray.size(), 2) != 0)
                {
                    _intArray.push_back(0);
                }

                if (fmod(_frameIntArray.size(), 2) != 0)
                {
                    _frameIntArray.push_back(0);
                }

                if (fmod(_frameArray.size(), 2) != 0)
                {
                    _frameArray.push_back(0);
                }

                if (fmod(_timelineArray.size(), 2) != 0)
                {
                    _timelineArray.push_back(0);
                }

                const auto l1 = _intArray.size() * 2;
                const auto l2 = _floatArray.size() * 4;
                const auto l3 = _frameIntArray.size() * 2;
                const auto l4 = _frameFloatArray.size() * 4;
                const auto l5 = _frameArray.size() * 2;
                const auto l6 = _timelineArray.size() * 2;
                
                auto binary = new char[l1 + l2 + l3 + l4 + l5 + l6];
                auto intArray = (int16_t*)binary;
                auto floatArray = (float*)(binary + l1);
                auto frameIntArray = (int16_t*)(binary + l1 + l2);
                auto frameFloatArray = (float*)(binary + l1 + l2 + l3);
                auto frameArray = (int16_t*)(binary + l1 + l2 + l3 + l4);
                auto timelineArray = (uint16_t*)(binary + l1 + l2 + l3 + l4 + l5);

                for (std::size_t i = 0, l = _intArray.size(); i < l; ++i)
                {
                    intArray[i] = _intArray[i];
                }

                for (std::size_t i = 0, l = _floatArray.size(); i < l; ++i)
                {
                    floatArray[i] = _floatArray[i];
                }

                for (std::size_t i = 0, l = _frameIntArray.size(); i < l; ++i)
                {
                    frameIntArray[i] = _frameIntArray[i];
                }

                for (std::size_t i = 0, l = _frameFloatArray.size(); i < l; ++i)
                {
                    frameFloatArray[i] = _frameFloatArray[i];
                }

                for (std::size_t i = 0, l = _frameArray.size(); i < l; ++i)
                {
                    frameArray[i] = _frameArray[i];
                }

                for (std::size_t i = 0, l = _timelineArray.size(); i < l; ++i)
                {
                    timelineArray[i] = _timelineArray[i];
                }

                data->binary = binary;
                data->intArray = intArray;
                data->floatArray = floatArray;
                data->frameIntArray = frameIntArray;
                data->frameFloatArray = frameFloatArray;
                data->frameArray = frameArray;
                data->timelineArray = timelineArray;
            }

            _defaultColorOffset = -1;
            _data = nullptr;
        }

        if (rawData.HasMember(TEXTURE_ATLAS))
        {
            _rawTextureAtlases = (rapidjson::Value*)&(rawData[TEXTURE_ATLAS]);
        }

        return data;
    }
    else
    {
        DRAGONBONES_ASSERT(
            false,
            "Nonsupport data version: " + version + "\n" +
            "Please convert DragonBones data to support version.\n" +
            "Read more: https://github.com/DragonBones/Tools/"
        );
    }

    return nullptr;
}

void JSONDataParser::_parseTextureAtlasData(const rapidjson::Value& rawData, TextureAtlasData& textureAtlasData, float scale)
{
    textureAtlasData.format = _getTextureFormat(_getString(rawData, FORMAT, ""));
    textureAtlasData.width = _getNumber(rawData, WIDTH, (unsigned)0);
    textureAtlasData.height = _getNumber(rawData, HEIGHT, (unsigned)0);
    textureAtlasData.scale = scale == 1.0f ? 1.0f / _getNumber(rawData, SCALE, 1.0f) : scale;
    textureAtlasData.name = _getString(rawData, NAME, "");
    textureAtlasData.imagePath = _getString(rawData, IMAGE_PATH, "");

    if (rawData.HasMember(SUB_TEXTURE))
    {
        const auto& rawTextures = rawData[SUB_TEXTURE];
        for (std::size_t i = 0, l = rawTextures.Size(); i < l; ++i)
        {
            const auto& rawTexture = rawTextures[i];
            const auto textureData = textureAtlasData.createTexture();
            textureData->rotated = _getBoolean(rawTexture, ROTATED, false);
            textureData->name = _getString(rawTexture, NAME, "");
            textureData->region.x = _getNumber(rawTexture, X, 0.0f);
            textureData->region.y = _getNumber(rawTexture, Y, 0.0f);
            textureData->region.width = _getNumber(rawTexture, WIDTH, 0.0f);
            textureData->region.height = _getNumber(rawTexture, HEIGHT, 0.0f);

            const auto frameWidth = _getNumber(rawTexture, FRAME_WIDTH, -1.0f);
            const auto frameHeight = _getNumber(rawTexture, FRAME_HEIGHT, -1.0f);
            if (frameWidth > 0.0f && frameHeight > 0.0f)
            {
                textureData->frame = TextureData::createRectangle();
                textureData->frame->x = _getNumber(rawTexture, FRAME_X, 0.0f);
                textureData->frame->y = _getNumber(rawTexture, FRAME_Y, 0.0f);
                textureData->frame->width = frameWidth;
                textureData->frame->height = frameHeight;
            }

            textureAtlasData.addTexture(textureData);
        }
    }
}

DragonBonesData* JSONDataParser::parseDragonBonesData(const char* rawData, float scale)
{
    DRAGONBONES_ASSERT(rawData != nullptr, "");

    rapidjson::Document document;
    document.Parse(rawData);

    return _parseDragonBonesData(document, scale);
}

bool JSONDataParser::parseTextureAtlasData(const char* rawData, TextureAtlasData& textureAtlasData, float scale)
{
    if (rawData == nullptr)
    {
        if (_rawTextureAtlases == nullptr || _rawTextureAtlases->Empty())
        {
            return false;
        }

        const auto& rawTextureAtlas = (*_rawTextureAtlases)[_rawTextureAtlasIndex++];
        _parseTextureAtlasData(rawTextureAtlas, textureAtlasData, scale);
        if (_rawTextureAtlasIndex >= _rawTextureAtlases->Size()) 
        {
            _rawTextureAtlasIndex = 0;
            _rawTextureAtlases = nullptr;
        }

        return true;
    }

    rapidjson::Document document;
    document.Parse(rawData);
    _parseTextureAtlasData(document, textureAtlasData, scale);

    return true;
}

DRAGONBONES_NAMESPACE_END
