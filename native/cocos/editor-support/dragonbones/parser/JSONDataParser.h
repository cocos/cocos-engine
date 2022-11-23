#ifndef DRAGONBONES_JSON_DATA_PARSER_H
#define DRAGONBONES_JSON_DATA_PARSER_H

#include "DataParser.h"
#include "json/document.h"

DRAGONBONES_NAMESPACE_BEGIN

class ActionFrame {
public:
    unsigned frameStart;
    std::vector<unsigned> actions;

    bool operator<(const ActionFrame& b) const {
        return frameStart < b.frameStart;
    }
};

class JSONDataParser : public DataParser {
    DRAGONBONES_DISALLOW_COPY_AND_ASSIGN(JSONDataParser)

protected:
    inline static bool _getBoolean(const rapidjson::Value& rawData, const char* key, bool defaultValue) {
        if (rawData.HasMember(key)) {
            const auto& value = rawData[key];
            if (value.IsBool()) {
                return value.GetBool();
            } else if (value.IsString()) {
                const std::string stringValue = value.GetString();
                if (
                    stringValue == "0" ||
                    stringValue == "NaN" ||
                    stringValue == "" ||
                    stringValue == "false" ||
                    stringValue == "null" ||
                    stringValue == "undefined") {
                    return false;
                }

                return true;
            } else if (value.IsNumber()) {
                return value.GetInt() != 0;
            }
        }

        return defaultValue;
    }

    inline static unsigned _getNumber(const rapidjson::Value& rawData, const char* key, unsigned defaultValue) {
        if (rawData.HasMember(key)) {
            return rawData[key].GetUint();
        }

        return defaultValue;
    }

    inline static int _getNumber(const rapidjson::Value& rawData, const char* key, int defaultValue) {
        if (rawData.HasMember(key)) {
            return rawData[key].GetInt();
        }

        return defaultValue;
    }

    inline static float _getNumber(const rapidjson::Value& rawData, const char* key, float defaultValue) {
        if (rawData.HasMember(key) && rawData[key].IsNumber()) {
            return rawData[key].GetFloat(); // cocos can not support GetFloat();
        }

        return defaultValue;
    }

    inline static std::string _getString(const rapidjson::Value& rawData, const char* key, const std::string& defaultValue) {
        if (rawData.HasMember(key)) {
            if (rawData[key].IsString()) {
                return rawData[key].GetString();
            }

            return dragonBones::to_string(rawData[key].GetDouble());
        }

        return defaultValue;
    }

    inline static int _getParameter(const rapidjson::Value& rawData, std::size_t index, int defaultValue) {
        if (rawData.Size() > index) {
            return rawData[(int)index].GetInt();
        }

        return defaultValue;
    }

    inline static float _getParameter(const rapidjson::Value& rawData, std::size_t index, float defaultValue) {
        if (rawData.Size() > index) {
            return rawData[(int)index].GetFloat();
        }

        return defaultValue;
    }

    inline static std::string _getParameter(const rapidjson::Value& rawData, std::size_t index, const std::string& defaultValue) {
        if (rawData.Size() > index) {
            return rawData[(int)index].GetString();
        }

        return defaultValue;
    }

protected:
    unsigned _rawTextureAtlasIndex;
    std::vector<BoneData*> _rawBones;
    DragonBonesData* _data;
    ArmatureData* _armature;
    BoneData* _bone;
    SlotData* _slot;
    SkinData* _skin;
    MeshDisplayData* _mesh;
    AnimationData* _animation;
    TimelineData* _timeline;
    rapidjson::Value* _rawTextureAtlases;

private:
    int _defaultColorOffset;
    int _prevClockwise;
    float _prevRotation;
    Matrix _helpMatrixA;
    Matrix _helpMatrixB;
    Transform _helpTransform;
    ColorTransform _helpColorTransform;
    Point _helpPoint;
    std::vector<float> _helpArray;
    std::vector<std::int16_t> _intArray;
    std::vector<float> _floatArray;
    std::vector<std::int16_t> _frameIntArray;
    std::vector<float> _frameFloatArray;
    std::vector<std::int16_t> _frameArray;
    std::vector<std::uint16_t> _timelineArray;
    std::vector<const rapidjson::Value*> _cacheRawMeshes;
    std::vector<MeshDisplayData*> _cacheMeshes;
    std::vector<ActionFrame> _actionFrames;
    std::map<std::string, const rapidjson::Value*> _weightSlotPose;
    std::map<std::string, const rapidjson::Value*> _weightBonePoses;
    std::map<std::string, std::vector<BoneData*>> _cacheBones;
    std::map<std::string, std::vector<ActionData*>> _slotChildActions;

public:
    JSONDataParser() : _rawTextureAtlasIndex(0),
                       _rawBones(),
                       _data(nullptr),
                       _armature(nullptr),
                       _bone(nullptr),
                       _slot(nullptr),
                       _skin(nullptr),
                       _mesh(nullptr),
                       _animation(nullptr),
                       _timeline(nullptr),
                       _rawTextureAtlases(nullptr),

                       _defaultColorOffset(-1),
                       _prevClockwise(0),
                       _prevRotation(0.0f),
                       _helpMatrixA(),
                       _helpMatrixB(),
                       _helpTransform(),
                       _helpColorTransform(),
                       _helpPoint(),
                       _helpArray(),
                       _intArray(),
                       _floatArray(),
                       _frameIntArray(),
                       _frameFloatArray(),
                       _frameArray(),
                       _timelineArray(),
                       _cacheMeshes(),
                       _cacheRawMeshes(),
                       _actionFrames(),
                       _weightSlotPose(),
                       _weightBonePoses(),
                       _cacheBones(),
                       _slotChildActions() {
    }
    virtual ~JSONDataParser() {
    }

private:
    void _getCurvePoint(
        float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4,
        float t,
        Point& result);
    void _samplingEasingCurve(const rapidjson::Value& curve, std::vector<float>& samples);
    void _parseActionDataInFrame(const rapidjson::Value& rawData, unsigned frameStart, BoneData* bone, SlotData* slot);
    void _mergeActionFrame(const rapidjson::Value& rawData, unsigned frameStart, ActionType type, BoneData* bone, SlotData* slot);
    unsigned _parseCacheActionFrame(ActionFrame& frame);

protected:
    virtual ArmatureData* _parseArmature(const rapidjson::Value& rawData, float scale);
    virtual BoneData* _parseBone(const rapidjson::Value& rawData);
    virtual ConstraintData* _parseIKConstraint(const rapidjson::Value& rawData);
    virtual SlotData* _parseSlot(const rapidjson::Value& rawData, int zOrder);
    virtual SkinData* _parseSkin(const rapidjson::Value& rawData);
    virtual DisplayData* _parseDisplay(const rapidjson::Value& rawData);
    virtual void _parsePivot(const rapidjson::Value& rawData, ImageDisplayData& display);
    virtual void _parseMesh(const rapidjson::Value& rawData, MeshDisplayData& mesh);
    virtual BoundingBoxData* _parseBoundingBox(const rapidjson::Value& rawData);
    virtual PolygonBoundingBoxData* _parsePolygonBoundingBox(const rapidjson::Value& rawData);
    virtual AnimationData* _parseAnimation(const rapidjson::Value& rawData);
    virtual TimelineData* _parseTimeline(
        const rapidjson::Value& rawData, const char* framesKey, TimelineType type,
        bool addIntOffset, bool addFloatOffset, unsigned frameValueCount,
        const std::function<unsigned(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount)>& frameParser);
    virtual void _parseBoneTimeline(const rapidjson::Value& rawData);
    virtual void _parseSlotTimeline(const rapidjson::Value& rawData);
    virtual unsigned _parseFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseTweenFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseActionFrame(const ActionFrame& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseZOrderFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseBoneAllFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseBoneTranslateFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseBoneRotateFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseBoneScaleFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseSlotDisplayFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseSlotColorFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseSlotFFDFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual unsigned _parseIKConstraintFrame(const rapidjson::Value& rawData, unsigned frameStart, unsigned frameCount);
    virtual const std::vector<ActionData*>& _parseActionData(const rapidjson::Value& rawData, ActionType type, BoneData* bone, SlotData* slot);
    virtual void _parseTransform(const rapidjson::Value& rawData, Transform& transform, float scale);
    virtual void _parseColorTransform(const rapidjson::Value& rawData, ColorTransform& color);
    virtual void _parseArray(const rapidjson::Value& rawData);
    virtual DragonBonesData* _parseDragonBonesData(const rapidjson::Value& rawData, float scale = 1.0f);
    virtual void _parseTextureAtlasData(const rapidjson::Value& rawData, TextureAtlasData& textureAtlasData, float scale = 1.0f);

public:
    virtual DragonBonesData* parseDragonBonesData(const char* rawData, float scale = 1.0f) override;
    virtual bool parseTextureAtlasData(const char* rawData, TextureAtlasData& textureAtlasData, float scale = 1.0f) override;
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_JSON_DATA_PARSER_H
