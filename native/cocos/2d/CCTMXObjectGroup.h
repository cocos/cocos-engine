/****************************************************************************
Copyright (c) 2010      Neophit
Copyright (c) 2010      Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2016 Chukong Technologies Inc.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
#ifndef __CCTMX_OBJECT_GROUP_H__
#define __CCTMX_OBJECT_GROUP_H__

#include "math/CCGeometry.h"
#include "base/CCValue.h"
#include "base/CCRef.h"
#include "2d/CCSprite.h"
#include "2d/CCDrawNode.h"

NS_CC_BEGIN

enum class TMXObjectType {
    RECT,
    ELLIPSE,
    POLYGON,
    POLYLINE,
    IMAGE
};

class TMXMapInfo;
class TMXObjectGroupInfo;
class Color4F;

/**
 * @addtogroup _2d
 * @{
 */

/** @brief TMXObject represents the TMX object.
 * @since v3.12
 */
class CC_DLL TMXObject: public Ref
{
public:
    TMXObject(ValueMap objectInfo, TMXMapInfo* mapInfo, const Size& groupSize, const Color3B& color);
    virtual ~TMXObject();

    inline const std::string& getObjectName() { return _objectName; };
    inline void setObjectName(std::string& name) { _objectName = name; };
    
    Value getProperty(const std::string& propertyName) const;

    inline const ValueMap& getProperties() const { return _properties; };
    inline void setProperties(const ValueMap& properties) { _properties = properties; };
    
    inline TMXObjectType getType() { return _type; };
    inline int getId() { return _id; };
    inline uint32_t getGid() { return _gid; };
    inline Vec2 getOffset() { return _offset; };
    inline Size getObjectSize() { return _objectSize; };
    inline bool getObjectVisible() { return _objectVisible; };
    inline float getObjectRotation() { return _objectRotation; };

    inline Node* getNode() { return _node; };
    inline const Size& getGroupSize() { return _groupSize; };
    
protected:
    TMXObjectType _type;
    std::string   _objectName;
    Vec2          _offset;
    Size          _objectSize;
    uint32_t      _gid;
    int           _id;
    ValueMap      _properties;
    bool          _objectVisible;
    float         _objectRotation;

    Node*         _node;
    Size          _groupSize;
};

/** @brief TMXObjectImage represents the TMX object image.
 * @since v3.12
 */
class CC_DLL TMXObjectImage : public Sprite
{
public:
    TMXObjectImage(TMXObject* container, TMXMapInfo* mapInfo);
    virtual ~TMXObjectImage();

protected:
    bool _initWithMapInfo(TMXMapInfo* mapInfo);
    void _initPosWithMapInfo(TMXMapInfo* mapInfo);
    
    TMXObject* _container;
};

/** @brief TMXObjectShape represents the TMX object shapes.
 * @since v3.12
 */
class CC_DLL TMXObjectShape : public DrawNode
{
public:
    TMXObjectShape(TMXObject* container, TMXMapInfo* mapInfo, const Color3B& color);
    virtual ~TMXObjectShape();

protected:
    void _initShape();

    void _drawRect();
    void _drawEllipse();
    void _drawPoly(const Vec2& originPos, bool isPolygon);
    
    // internal methods for iso map
    Vec2 _getPosByOffset(const Vec2& offset);
    
    int _mapOrientation;
    Color4F _groupColor;
    TMXObject* _container;

private:
    TMXMapInfo* _mapInfo;
};

/**
 * @addtogroup _2d
 * @{
 */

/** @brief TMXObjectGroup represents the TMX object group.
 * @since v0.99.0
 */
class CC_DLL TMXObjectGroup : public Node
{
public:
    /**
     * @js ctor
     */
    TMXObjectGroup(TMXObjectGroupInfo* groupInfo, TMXMapInfo* mapInfo);
    /**
     * @js NA
     * @lua NA
     */
    virtual ~TMXObjectGroup();
    
    /** Get the group name. 
     *
     * @return The group name.
     */
    inline const std::string& getGroupName() const { return _groupName; }
    
    /** Set the group name. 
     *
     * @param groupName A string,it is used to set the group name.
     */
    inline void setGroupName(const std::string& groupName){ _groupName = groupName; }

    /** Return the value for the specific property name. 
     *
     * @param propertyName The specific property name.
     * @return Return the value for the specific property name.
     * @js NA
     */
    Value getProperty(const std::string& propertyName) const;
    
    CC_DEPRECATED_ATTRIBUTE Value propertyNamed(const std::string& propertyName) const { return getProperty(propertyName); };

    /** Return the dictionary for the specific object name.
     * It will return the 1st object found on the array for the given name.
     *
     * @return Return the dictionary for the specific object name.
     */
    TMXObject* getObject(const std::string& objectName);
    
    CC_DEPRECATED_ATTRIBUTE TMXObject* objectNamed(const std::string& objectName) { return getObject(objectName); };
    
    /** Gets the offset position of child objects. 
     *
     * @return The offset position of child objects.
     */
    inline const Vec2& getPositionOffset() const { return _positionOffset; };
    
    /** Sets the offset position of child objects. 
     *
     * @param offset The offset position of child objects.
     */
    inline void setPositionOffset(const Vec2& offset) { _positionOffset = offset; };
    
    /** Gets the list of properties stored in a dictionary. 
     *
     * @return The list of properties stored in a dictionary.
     */
    inline const ValueMap& getProperties() const { return _properties; };
    inline ValueMap& getProperties() { return _properties; };
    
    /** Sets the list of properties.
     *
     * @param properties The list of properties.
     */
    inline void setProperties(const ValueMap& properties) {
        _properties = properties;
    };
    
    /** Gets the array of the objects. 
     *
     * @return The array of the objects.
     */
    inline const Vector<TMXObject*>& getObjects() { return _objects; };

protected:
    void _initGroup(TMXObjectGroupInfo* groupInfo, TMXMapInfo* mapInfo);

    /** name of the group */
    std::string _groupName;
    /** offset position of child objects */
    Vec2 _positionOffset;
    /** list of properties stored in a dictionary */
    ValueMap _properties;
    
    Vector<TMXObject*> _objects;
};

// end of tilemap_parallax_nodes group
/** @} */

NS_CC_END

#endif //__CCTMX_OBJECT_GROUP_H__
