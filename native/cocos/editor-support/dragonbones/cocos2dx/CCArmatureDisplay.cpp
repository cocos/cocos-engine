#include "CCArmatureDisplay.h"
#include "editor-support/creator/CCCameraNode.h"

DRAGONBONES_NAMESPACE_BEGIN

CCArmatureDisplay* CCArmatureDisplay::create()
{
    CCArmatureDisplay* displayContainer = new (std::nothrow) CCArmatureDisplay();

    if (displayContainer && displayContainer->init())
    {
        displayContainer->autorelease();
    }
    else
    {
        CC_SAFE_DELETE(displayContainer);
    }

    return displayContainer;
}

CCArmatureDisplay::CCArmatureDisplay() :
    _armature(nullptr),
    _dispatcher(nullptr),
    _eventCallback(nullptr)
{
    _dispatcher = new cocos2d::EventDispatcher();
    this->setEventDispatcher(_dispatcher);
    _dispatcher->setEnabled(true);
}
CCArmatureDisplay::~CCArmatureDisplay() {}

// cleared by armature
void CCArmatureDisplay::_onClear()
{
    this->setEventDispatcher(cocos2d::Director::getInstance()->getEventDispatcher());
    clearEventCallback();
    _armature = nullptr;
    this->release();
}

void CCArmatureDisplay::_dispatchEvent(EventObject* value)
{
    if (_eventCallback) {
        _eventCallback(value);
    }
    
    if (_dispatcher->isEnabled()) {
        _dispatcher->dispatchCustomEvent(value->type, value);
    }
}

void CCArmatureDisplay::dispose()
{
    if (_armature) 
    {
        advanceTimeBySelf(false);
        _armature->dispose();
        _armature = nullptr;
    }
}

void CCArmatureDisplay::update(float passedTime)
{
    _armature->advanceTime(passedTime);
}

void CCArmatureDisplay::advanceTimeBySelf(bool on)
{
    if (on)
    {
        scheduleUpdate();
    }
    else 
    {
        unscheduleUpdate();
    }
}

void CCArmatureDisplay::addEvent(const std::string& type, const std::function<void(EventObject*)>& callback)
{
    auto lambda = [callback](cocos2d::EventCustom* event) -> void {
        callback(static_cast<EventObject*>(event->getUserData()));
    };
    _dispatcher->addCustomEventListener(type, lambda);
}

void CCArmatureDisplay::removeEvent(const std::string& type)
{
    _dispatcher->removeCustomEventListeners(type);
}

DBCCSprite* DBCCSprite::create()
{
    DBCCSprite* sprite = new (std::nothrow) DBCCSprite();

    if (sprite && sprite->init())
    {
        sprite->autorelease();
    }
    else
    {
        CC_SAFE_DELETE(sprite);
    }

    return sprite;
}

DBCCSprite::DBCCSprite()
{
}
DBCCSprite::~DBCCSprite() {}

cocos2d::Vec2 DBCCSprite::projectGL(const cocos2d::Vec3& src) const
{
    cocos2d::Vec2 screenPos;
    
    auto director = cocos2d::Director::getInstance();
    auto viewport = director->getWinSize();
    cocos2d::Vec4 clipPos;
    auto projMatrix = director->getMatrix(cocos2d::MATRIX_STACK_TYPE::MATRIX_STACK_PROJECTION);
    projMatrix.transformVector(cocos2d::Vec4(src.x, src.y, src.z, 1.0f), &clipPos);
    
    CCASSERT(clipPos.w != 0.0f, "clipPos.w can't be 0.0f!");
    float ndcX = clipPos.x / clipPos.w;
    float ndcY = clipPos.y / clipPos.w;
    
    screenPos.x = (ndcX + 1.0f) * 0.5f * viewport.width;
    screenPos.y = (ndcY + 1.0f) * 0.5f * viewport.height;
    return screenPos;
}

bool DBCCSprite::_checkVisibility(const cocos2d::Mat4& transform, const cocos2d::Size& size, const cocos2d::Rect& rect)
{
    auto director = cocos2d::Director::getInstance();
    
    creator::CameraNode* camera = creator::CameraNode::getInstance();
    cocos2d::Rect visibleRect;
    if (!camera || camera->visitingIndex <= 0) {
        visibleRect.origin = director->getVisibleOrigin();
        visibleRect.size = director->getVisibleSize();
    }
    else {
        visibleRect = camera->getVisibleRect();
    }

    // transform center point to screen space
    float hSizeX = size.width / 2;
    float hSizeY = size.height / 2;

    cocos2d::Vec3 v3p(hSizeX + rect.origin.x, hSizeY + rect.origin.y, 0);

    transform.transformPoint(&v3p);
    cocos2d::Vec2 v2p = projectGL(v3p);

    // convert content size to world coordinates
    float wshw = std::max(fabsf(hSizeX * transform.m[0] + hSizeY * transform.m[4]), fabsf(hSizeX * transform.m[0] - hSizeY * transform.m[4]));
    float wshh = std::max(fabsf(hSizeX * transform.m[1] + hSizeY * transform.m[5]), fabsf(hSizeX * transform.m[1] - hSizeY * transform.m[5]));

    // enlarge visible rect half size in screen coord
    visibleRect.origin.x -= wshw;
    visibleRect.origin.y -= wshh;
    visibleRect.size.width += wshw * 2;
    visibleRect.size.height += wshh * 2;
    bool ret = visibleRect.containsPoint(v2p);
    return ret;
}

void DBCCSprite::draw(cocos2d::Renderer* renderer, const cocos2d::Mat4& transform, uint32_t flags)
{
#if CC_USE_CULLING
    const auto& rect = this->_polyInfo.rect;

    if ((flags & FLAGS_TRANSFORM_DIRTY))
    {
        _insideBounds = _checkVisibility(transform, _contentSize, rect);
    }

    if (_insideBounds)
#endif
    {
        _trianglesCommand.init(_globalZOrder, _texture->getName(), getGLProgramState(), _blendFunc, _polyInfo.triangles, transform, flags);
        renderer->addCommand(&_trianglesCommand);

#if CC_SPRITE_DEBUG_DRAW
        _debugDrawNode->clear();
        auto count = _polyInfo.triangles.indexCount / 3;
        auto indices = _polyInfo.triangles.indices;
        auto verts = _polyInfo.triangles.verts;
        for (ssize_t i = 0; i < count; i++)
        {
            //draw 3 lines
            auto from = verts[indices[i * 3]].vertices;
            auto to = verts[indices[i * 3 + 1]].vertices;
            _debugDrawNode->drawLine(cocos2d::Vec2(from.x, from.y), cocos2d::Vec2(to.x, to.y), cocos2d::Color4F::WHITE);

            from = verts[indices[i * 3 + 1]].vertices;
            to = verts[indices[i * 3 + 2]].vertices;
            _debugDrawNode->drawLine(cocos2d::Vec2(from.x, from.y), cocos2d::Vec2(to.x, to.y), cocos2d::Color4F::WHITE);

            from = verts[indices[i * 3 + 2]].vertices;
            to = verts[indices[i * 3]].vertices;
            _debugDrawNode->drawLine(cocos2d::Vec2(from.x, from.y), cocos2d::Vec2(to.x, to.y), cocos2d::Color4F::WHITE);
        }
#endif //CC_SPRITE_DEBUG_DRAW
    }
}

cocos2d::PolygonInfo& DBCCSprite::getPolygonInfoModify()
{
    return this->_polyInfo;
}

DRAGONBONES_NAMESPACE_END
