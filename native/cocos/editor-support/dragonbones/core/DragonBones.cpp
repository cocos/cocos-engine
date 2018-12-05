#include "DragonBones.h"
#include "../armature/Armature.h"
#include "../animation/WorldClock.h"
#include "../animation/Animation.h"
#include "../event/EventObject.h"
#include "../event/IEventDispatcher.h"

DRAGONBONES_NAMESPACE_BEGIN

const std::string DragonBones::VEISION = "5.6.300";

bool DragonBones::yDown = true;
bool DragonBones::debug = false;
bool DragonBones::debugDraw = false;
bool DragonBones::webAssembly = false;
bool DragonBones::checkInPool = false;

DragonBones::DragonBones(IEventDispatcher* eventManager) :
    _events(),
    _objects(),
    _clock(nullptr),
    _eventManager(eventManager)
{
    _clock = new WorldClock();
    _eventManager = eventManager;
}

DragonBones::~DragonBones()
{
    if (_clock != nullptr)
    {
        delete _clock;
    }

    _clock = nullptr;
    _eventManager = nullptr;
}

void DragonBones::advanceTime(float passedTime)
{
    if (!_objects.empty())
    {
        for (const auto object : _objects)
        {
            object->returnToPool();
        }
        
        _objects.clear();
    }
    
    if (!_events.empty())
    {
        for (std::size_t i = 0; i < _events.size(); ++i)
        {
            const auto eventObject = _events[i];
            const auto armature = eventObject->armature;
            if (armature->_armatureData != nullptr)
            {
                armature->getProxy()->dispatchDBEvent(eventObject->type, eventObject);
                if (eventObject->type == EventObject::SOUND_EVENT)
                {
                    _eventManager->dispatchDBEvent(eventObject->type, eventObject);
                }
            }

            bufferObject(eventObject);
        }

        _events.clear();
    }

    _clock->advanceTime(passedTime);
}

void DragonBones::bufferEvent(EventObject* value)
{
    _events.push_back(value);
}

void DragonBones::bufferObject(BaseObject* object)
{
    if(object == nullptr || object->isInPool())return;
    auto it = std::find(_objects.begin(), _objects.end(), object);
    if (it != _objects.end())
    {
        _objects.push_back(object);
    }
}

WorldClock* DragonBones::getClock()
{
    return _clock;
}


DRAGONBONES_NAMESPACE_END
