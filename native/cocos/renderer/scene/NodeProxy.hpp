/****************************************************************************
 LICENSING AGREEMENT
 
 Xiamen Yaji Software Co., Ltd., (the “Licensor”) grants the user (the “Licensee”) non-exclusive and non-transferable rights to use the software according to the following conditions:
 a.  The Licensee shall pay royalties to the Licensor, and the amount of those royalties and the payment method are subject to separate negotiations between the parties.
 b.  The software is licensed for use rather than sold, and the Licensor reserves all rights over the software that are not expressly granted (whether by implication, reservation or prohibition).
 c.  The open source codes contained in the software are subject to the MIT Open Source Licensing Agreement (see the attached for the details);
 d.  The Licensee acknowledges and consents to the possibility that errors may occur during the operation of the software for one or more technical reasons, and the Licensee shall take precautions and prepare remedies for such events. In such circumstance, the Licensor shall provide software patches or updates according to the agreement between the two parties. The Licensor will not assume any liability beyond the explicit wording of this Licensing Agreement.
 e.  Where the Licensor must assume liability for the software according to relevant laws, the Licensor’s entire liability is limited to the annual royalty payable by the Licensee.
 f.  The Licensor owns the portions listed in the root directory and subdirectory (if any) in the software and enjoys the intellectual property rights over those portions. As for the portions owned by the Licensor, the Licensee shall not:
 - i. Bypass or avoid any relevant technical protection measures in the products or services;
 - ii. Release the source codes to any other parties;
 - iii. Disassemble, decompile, decipher, attack, emulate, exploit or reverse-engineer these portion of code;
 - iv. Apply it to any third-party products or services without Licensor’s permission;
 - v. Publish, copy, rent, lease, sell, export, import, distribute or lend any products containing these portions of code;
 - vi. Allow others to use any services relevant to the technology of these codes;
 - vii. Conduct any other act beyond the scope of this Licensing Agreement.
 g.  This Licensing Agreement terminates immediately if the Licensee breaches this Agreement. The Licensor may claim compensation from the Licensee where the Licensee’s breach causes any damage to the Licensor.
 h.  The laws of the People's Republic of China apply to this Licensing Agreement.
 i.  This Agreement is made in both Chinese and English, and the Chinese version shall prevail the event of conflict.
 ****************************************************************************/

#pragma once

#include <string>
#include <map>

#include "../Macro.h"
#include "base/CCRef.h"
#include "base/ccTypes.h"
#include "base/CCVector.h"
#include "math/CCMath.h"
#include "SystemHandle.hpp"

namespace se {
    class Object;
}

RENDERER_BEGIN

class ModelBatcher;
class Scene;

/**
 * @addtogroup scene
 * @{
 */

/**
 * @brief NodeProxy is a cpp delegator of js Node.\n
 * It synchronize the hierarchy from js node tree, update the transform each frame, and manages system handles like RenderHandle which represent the render component.\n
 * JS API: renderer.NodeProxy
 @code
 let node = new cc.Node();
 // NodeProxy is automatically created by cc.Node
 let proxy = node._proxy;
 
 // You can also create NodeProxy manually, but you also need to bind it manually
 let proxy = new renderer.NodeProxy();
 proxy.bind(node);
 @endcode
 */
class NodeProxy : public Ref
{
public:
    /*
     * @brief The default constructor.
     */
    NodeProxy();
    /*
     * @brief The destructor.
     */
    ~NodeProxy();
    
    /**
     * @brief Resets all states.
     */
    void reset();

    /// @{
    /// @name Hierarchy

    /**
     *  @brief Adds child node proxy to the node proxy.
     *  @param[in] child A child node proxy pointer.
     */
    void addChild(NodeProxy * child);
    /**
     *  @brief Removes child node proxy from the node proxy.
     *  @param[in] child A child node proxy pointer.
     */
    void removeChild(NodeProxy* child);
    /**
     *  @brief Removes all child node proxies from the current one.
     */
    void removeAllChildren();
    
    /**
     *  @brief Sets the node proxy parent.
     *  @param[in] parent.
     */
    inline void setParent(NodeProxy* parent) { _parent = parent; };
    /**
     *  @brief Gets the node proxy parent.
     *  @return Parent.
     */
    inline NodeProxy* getParent() const { return _parent; };
    /**
     *  @brief Gets the node proxy all children.
     *  @return Children container.
     */
    inline const Vector<NodeProxy*>& getChildren() const { return _children; };
    /**
     *  @brief Gets the node proxy child count.
     *  @return Child count.
     */
    inline size_t getChildrenCount() const { return _children.size(); };
    /**
     *  @brief Sets the node proxy's local zorder.
     *  @param[in] zOrder The value of zorder.
     */
    void setLocalZOrder(int zOrder);
    /**
     *  @brief Sets children order dirty, then children will get sorted during visit process.
     */
    inline void setChildrenOrderDirty() { _childrenOrderDirty = true; };

    /// @} end of Hierarchy
    
    /**
     *  @brief Update the TypedArray contains translation, rotation and scale data.
     *  @param[in] trs JS TypedArray object
     */
    void updateJSTRS(se::Object* trs);
    /*
     *  @brief Gets the world matrix.
     *  @return World matrix.
     */
    inline const cocos2d::Mat4& getWorldMatrix() const { return _worldMat; };
    
    /*
     *  @brief Gets the position.
     *  @param[out] out The position vector
     */
    void getPosition(cocos2d::Vec3* out) const;
    /*
     *  @brief Gets the rotation.
     *  @param[out] out The rotation quaternion.
     */
    void getRotation(cocos2d::Quaternion* out) const;
    /*
     *  @brief Gets the scale.
     *  @param[out] out The scale vector.
     */
    void getScale(cocos2d::Vec3* out) const;
    /*
     *  @brief Gets the position in world coordinates.
     *  @param[out] out The world position vector.
     */
    void getWorldPosition(cocos2d::Vec3* out) const;
    /*
     *  @brief Gets the matrix contains the world rotation and translation.
     *  @param[out] out The matrix to store datas.
     */
    void getWorldRT(cocos2d::Mat4* out) const;
    
    /**
     *  @brief Gets the node's opacity.
     */
    inline uint8_t getOpacity() const { return _opacity; };
    /**
     *  @brief Sets the node's opacity.
     */
    void setOpacity(uint8_t opacity);
    /**
     *  @brief Updates opacity from parent.
     */
    void updateRealOpacity();
    /**
     *  @brief Gets the node's realOpacity.
     */

    inline const uint8_t getRealOpacity() const {return _realOpacity;};
    /**
     *  @brief Gets the node's group id, this controls which camera can see the node.
     */
    inline int getCullingMask() const { return _cullingMask; };
    /**
     *  @brief Sets the node's group id.
     *  @param[in] groupID The group id
     */
    inline void setCullingMask(int cullingMask) { _cullingMask = cullingMask; };
    
    /**
     *  @brief Gets the node's name.
     *  This equals to the one in JS node, helps to debug in cpp.
     *  @return name
     */
    inline const std::string& getName() const { return _name; };
    /**
     *  @brief Sets the node's name.
     *  The name should be updated once JS node's name changes.
     *  @param[in] name
     */
    inline void setName(const std::string& name) { _name = name; };
    
    /**
     *  @brief Sets the node's 3D state.
     *  @param[in] is3DNode
     */
    inline void set3DNode(bool is3DNode) { _is3DNode = is3DNode; };
    
    /**
     *  @brief Adds a system handle to the node proxy, system handle will be invoked during node's visit process.
     *  @param[in] sysid The system id.
     *  @param[in] handle The system handle pointer.
     */
    void addHandle(const std::string& sysid, SystemHandle* handle);
    /**
     *  @brief Removes a system handle from node proxy by system id.
     *  @param[in] sysid The system id.
     */
    void removeHandle(const std::string& sysid);
    /**
     *  @brief Gets the system handle by system id.
     *  @param[in] sysid The system id.
     *  @return The system handle object or nullptr if not exist
     */
    SystemHandle* getHandle(const std::string& sysid);
    
    /*
     *  @brief Traverse all node proxy in the current node tree.
     */
    void visitAsRoot(ModelBatcher* batcher, Scene* scene);
    
protected:
    void visit(ModelBatcher* batcher, Scene* scene);
    void childrenAlloc();
    void detachChild(NodeProxy* child, ssize_t childIndex);
    void reorderChildren();
    
    void updateFromJS();
    void updateMatrix();

private:
    static int _worldMatDirty;
    static int _parentOpacityDirty;
    static const int _TRANSFORM = 1 << 0;
    static const int _UPDATE_RENDER_DATA = 1 << 1;
    static const int _OPACITY = 1 << 2;
    static const int _COLOR = 1 << 3;
    static const int _CHILDREN = 1 << 4;
    static const int _POST_UPDATE_RENDER_DATA = 1 << 5;
    
    bool _childrenOrderDirty = true;
    bool _matrixUpdated = false;
    bool _opacityUpdated = false;
    bool _is3DNode = false;
    
    uint8_t _opacity = 255;
    uint8_t _realOpacity = 255;
    int _localZOrder = 0;
    int _cullingMask = 1;

    cocos2d::Mat4 _localMat;
    cocos2d::Mat4 _worldMat;
    
    std::string _name;

    float* _jsTRSData;
    se::Object* _jsTRS;
    NodeProxy* _parent;                  ///< weak reference to parent node
    cocos2d::Vector<NodeProxy*> _children;        ///< array of children nodes
    
    std::map<std::string, SystemHandle*> _handles;
};

// end of scene group
/// @}

RENDERER_END
