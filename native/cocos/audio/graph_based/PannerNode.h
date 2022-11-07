#pragma once
#include "audio/graph_based/AudioNode.h"
#include "LabSound/core/PannerNode.h"
namespace cc {
class AudioContext;
enum class PanningModelType {
    EQUALPOWER,
    HRTF
};
enum class DistanceModelType {
    LINEAR,
    INVERSE,
    EXPONENTIAL
};
struct PannerOptions :AudioNodeOptions {
    PanningModelType panningModel{PanningModelType::EQUALPOWER};
    DistanceModelType distanceModel{DistanceModelType::INVERSE};
    float positionX{0};
    float positionY{0};
    float positionZ{0};
    float orientationX{1};
    float orientationY{0};
    float orientationZ{0};
    double refDistance{1};
    double maxDistance{10000};
    double rolloffFactor{1};
    double coneInnerAngle{360};
    double coneOuterAngle{360};
    double coneOuterGain{0};
};
class PannerNode : AudioNode {
public:
    PannerNode(AudioContext* ctx, const PannerOptions& options = {});
    double coneInnerAngle();
    void setConeInnerAngle(double angle);
    double coneOuterAngle();
    void setConeOuterAngle(double angle);
    double coneOuterGain();
    void setConeOuterGain(double gain);
    DistanceModelType distanceModel();
    void setDistanceModel(DistanceModelType t);
    PanningModelType panningModel();
    void setPanningModel(PanningModelType t);
    double maxDistance();
    void setMaxDistance(double distance);
    double refDistance();
    void setRefDistance(double distance);
    double rolloffFactor();
    void setRolloffFactor(double factor);
    AudioParam& orientationX();
    AudioParam& orientationY();
    AudioParam& orientationZ();
    AudioParam& positionX();
    AudioParam& positionY();
    AudioParam& positionZ();
private:
};
}
