/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
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

#ifndef __CCSCENE_H__
#define __CCSCENE_H__

#include <string>
#include "2d/CCNode.h"

NS_CC_BEGIN

class Renderer;

/**
 * @addtogroup _2d
 * @{
 */

/** @class Scene
* @brief Scene is a subclass of Node that is used only as an abstract concept.

Scene and Node are almost identical with the difference that Scene has its
anchor point (by default) at the center of the screen.

For the moment Scene has no other logic than that, but in future releases it might have
additional logic.

It is a good practice to use a Scene as the parent of all your nodes.

*/
class CC_DLL Scene : public Node
{
public:
    /** Creates a new Scene object.
     *
     * @return An autoreleased Scene object.
     */
    static Scene *create();

    /** Creates a new Scene object with a predefined Size.
     *
     * @param size The predefined size of scene.
     * @return An autoreleased Scene object.
     * @js NA
     */
    static Scene *createWithSize(const Size& size);

    using Node::addChild;
    virtual std::string getDescription() const override;

    /** Render the scene.
     * @param renderer The renderer use to render the scene.
     * @js NA
     */
    virtual void render(Renderer* renderer, const Mat4& eyeTransform, const Mat4* eyeProjection = nullptr);

    /** override function */
    virtual void removeAllChildren() override;
    
    /** override function */
    virtual void cleanup() override;

CC_CONSTRUCTOR_ACCESS:
    Scene();
    virtual ~Scene();

    bool init() override;
    bool initWithSize(const Size& size);

protected:
    friend class Node;
    friend class ProtectedNode;
    friend class SpriteBatchNode;
    friend class Renderer;

private:
    CC_DISALLOW_COPY_AND_ASSIGN(Scene);
};

// end of _2d group
/// @}

NS_CC_END

#endif // __CCSCENE_H__

