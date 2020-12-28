#include "EventObject.h"
#include "../model/UserData.h"
#include "../armature/Armature.h"

DRAGONBONES_NAMESPACE_BEGIN

const char* EventObject::START = "start";
const char* EventObject::LOOP_COMPLETE = "loopComplete";
const char* EventObject::COMPLETE = "complete";
const char* EventObject::FADE_IN = "fadeIn";
const char* EventObject::FADE_IN_COMPLETE = "fadeInComplete";
const char* EventObject::FADE_OUT = "fadeOut";
const char* EventObject::FADE_OUT_COMPLETE = "fadeOutComplete";
const char* EventObject::FRAME_EVENT = "frameEvent";
const char* EventObject::SOUND_EVENT = "soundEvent";

void EventObject::actionDataToInstance(const ActionData* data, EventObject* instance, Armature* armature)
{
    if (data->type == ActionType::Play) 
    {
        instance->type = EventObject::FRAME_EVENT;
    }
    else 
    {
        instance->type = data->type == ActionType::Frame ? EventObject::FRAME_EVENT : EventObject::SOUND_EVENT;
    }

    instance->name = data->name;
    instance->armature = armature;
    instance->actionData = data;
    instance->data = data->data;

    if (data->bone != nullptr) 
    {
        instance->bone = armature->getBone(data->bone->name);
    }

    if (data->slot != nullptr) 
    {
        instance->slot = armature->getSlot(data->slot->name);
    }
}

void EventObject::_onClear()
{
    time = 0.0f;
    type = "";
    name = "";
    armature = nullptr;
    bone = nullptr;
    slot = nullptr;
    animationState = nullptr;
    actionData = nullptr;
    data = nullptr;
}

DRAGONBONES_NAMESPACE_END
