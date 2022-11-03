#pragma once
#include "base/RefCounted.h"
#include "LabSound/core/AudioParam.h"
#include "base/std/container/string.h"
namespace cc {
/*
* AudioParam is a class containning a lab::AudioParam.It represent a value with the specified name
*/

class AudioParam : public RefCounted {
public:
    //AudioParam(ccstd::string &name, ccstd::string &shortName, double defaultValue, double minValue, double maxValue);

    // AudioParam can only be used to set the internal value of lab::AudioParam of specified node.

    // AudioParam & operator=(const AudioParam& param) = default;
    AudioParam() = delete;
    ~AudioParam() = default;
    float defaultValue() { return _param->defaultValue(); }
    float maxValue() { return _param->maxValue(); };
    float minValue() { return _param->minValue(); }
    void setValue(float val) { _param->setValue(val); }
    float getValue() { return _param->value(); }

    // TODO(timlyeee): Methods are uncertained to add at current time, both are unnessecary or bad to use. 

    ///* Cancels all scheduled future changes to the AudioParam but holds its value at a given time until further changes are made using other methods. */
    //void cancelAndHoldAtTime(double cancelTime);
    //void cancelScheduledValues(double startTime);
    ///* Schedules a gradual exponential change in the value of the AudioParam */
    //void exponentialRampToValueAtTime(float value, double endTime);
    //void linearRampToValueAtTime(float val, double endTime);
    //void setTargetAtTime(double target, double startTime, float timeConstant);
    //void setValueAtTime(float val, double startTime);
    //void setValueCurveAtTime(std::vector<float> values, double startTime, double duration);
    static AudioParam* createParam(std::shared_ptr<lab::AudioParam> param);
    

private:
    AudioParam(std::shared_ptr<lab::AudioParam> param);
    friend class AudioNode;
    // All self defined audio param descriptor will be saved here. Normally there's no need to construct a desc yourself.
    std::shared_ptr<lab::AudioParam> _param{nullptr};
};
}
