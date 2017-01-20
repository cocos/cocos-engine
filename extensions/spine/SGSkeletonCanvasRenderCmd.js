/****************************************************************************
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

var spine = sp.spine;

sp._SGSkeleton.CanvasRenderCmd = function(renderableObject){
    this._rootCtor(renderableObject);
    this._needDraw = true;
};

var proto = sp._SGSkeleton.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
proto.constructor = sp._SGSkeleton.CanvasRenderCmd;

proto.rendering = function (wrapper, scaleX, scaleY) {
    var node = this._node, i, n, slot, slotNode;
    wrapper = wrapper || cc._renderContext;

    var locSkeleton = node._skeleton, drawOrder = locSkeleton.drawOrder;
    for(i = 0, n = drawOrder.length; i < n; i++){
        slot = drawOrder[i];
        slotNode = slot._slotNode;
        if(slotNode._visible && slotNode._renderCmd && slot.currentSprite){
            slotNode._renderCmd.transform(this, true);
            slot.currentSprite._renderCmd.rendering(wrapper, scaleX, scaleY);
            slotNode._renderCmd._dirtyFlag = slot.currentSprite._renderCmd._dirtyFlag = 0;
        }
    }

    if (!node._debugSlots && !node._debugBones)
        return;

    wrapper.setTransform(this._worldTransform, scaleX, scaleY);
    wrapper.setGlobalAlpha(1);
    var attachment, drawingUtil = cc._drawingUtil;
    if (node._debugSlots) {
        // Slots.
        drawingUtil.setDrawColor(0, 0, 255, 255);
        drawingUtil.setLineWidth(1);

        var points = [];
        for (i = 0, n = locSkeleton.slots.length; i < n; i++) {
            slot = locSkeleton.drawOrder[i];
            if (!slot.attachment || !(slot.attachment instanceof spine.RegionAttachment))
                continue;
            attachment = slot.attachment;
            this._updateRegionAttachmentSlot(attachment, slot, points);
            drawingUtil.drawPoly(points, 4, true);
        }
    }

    if (node._debugBones) {
        // Bone lengths.
        var bone;
        drawingUtil.setLineWidth(2);
        drawingUtil.setDrawColor(255, 0, 0, 255);

        for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
            bone = locSkeleton.bones[i];
            var x = bone.data.length * bone.a + bone.worldX;
            var y = bone.data.length * bone.c + bone.worldY;
            drawingUtil.drawLine(
                {x: bone.worldX, y: bone.worldY},
                {x: x, y: y});
        }

        // Bone origins.
        drawingUtil.setPointSize(4);
        drawingUtil.setDrawColor(0, 0, 255, 255); // Root bone is blue.

        for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
            bone = locSkeleton.bones[i];
            drawingUtil.drawPoint({x: bone.worldX, y: bone.worldY});
            if (i === 0)
                drawingUtil.setDrawColor(0, 255, 0, 255);
        }
    }
};

proto.updateStatus = function() {
    _ccsg.Node.CanvasRenderCmd.prototype.updateStatus.call(this);
    this._updateCurrentRegions();
    this._regionFlag = _ccsg.Node.CanvasRenderCmd.RegionStatus.DirtyDouble;
    this._dirtyFlag &= ~_ccsg.Node._dirtyFlags.contentDirty;
};

proto.getLocalBB = function() {
    return this._node.getBoundingBox();
};

proto._updateRegionAttachmentSlot = function(attachment, slot, points) {
    if(!points)
        return;

    var vertices = attachment.updateWorldVertices(slot, false);
    var VERTEX = spine.RegionAttachment;
    points.length = 0;
    points.push(cc.p(vertices[VERTEX.X1], vertices[VERTEX.Y1]));
    points.push(cc.p(vertices[VERTEX.X4], vertices[VERTEX.Y4]));
    points.push(cc.p(vertices[VERTEX.X3], vertices[VERTEX.Y3]));
    points.push(cc.p(vertices[VERTEX.X2], vertices[VERTEX.Y2]));
};

proto._createChildFormSkeletonData = function(){
    var node = this._node;
    var locSkeleton = node._skeleton, spriteName, sprite;
    for (var i = 0, n = locSkeleton.slots.length; i < n; i++) {
        var slot = locSkeleton.slots[i], attachment = slot.attachment;
        var slotNode = new _ccsg.Node();
        slot._slotNode = slotNode;

        if(attachment instanceof spine.RegionAttachment){
            spriteName = attachment.region.name;
            sprite = this._createSprite(slot, attachment);
            slot.currentSprite = sprite;
            slot.currentSpriteName = spriteName;
            slotNode.addChild(sprite);
        } else if(attachment instanceof spine.MeshAttachment){
            //todo for mesh
        }
    }
};

proto._createSprite = function(slot, attachment){
    var rendererObject = attachment.region;
    var texture = rendererObject.texture.getRealTexture();
    var rect = new cc.Rect(rendererObject.x, rendererObject.y, rendererObject.width, rendererObject.height);
    var sprite = new _ccsg.Sprite();
    sprite.initWithTexture(texture, rect, rendererObject.rotate, false);
    sprite._rect.width = attachment.width;
    sprite._rect.height = attachment.height;
    sprite.setContentSize(attachment.width, attachment.height);
    sprite.setRotation(-attachment.rotation);
    sprite.setScale(rendererObject.width / rendererObject.originalWidth * attachment.scaleX,
        rendererObject.height / rendererObject.originalHeight * attachment.scaleY);

    slot.sprites = slot.sprites || {};
    slot.sprites[rendererObject.name] = sprite;

    return sprite;
};

proto._updateChild = function(){
    var locSkeleton = this._node._skeleton, slots = locSkeleton.slots;
    var color = this._displayedColor, opacity = this._displayedOpacity;
    var i, n, selSprite, ax, ay;

    var slot, attachment, slotNode;
    for(i = 0, n = slots.length; i < n; i++){
        slot = slots[i];
        attachment = slot.attachment;
        slotNode = slot._slotNode;
        if(!attachment){
            slotNode.setVisible(false);
            continue;
        }
        if (attachment instanceof spine.RegionAttachment){
            if(attachment.region){
                if(!slot.currentSpriteName || slot.currentSpriteName !== attachment.name){
                     var spriteName = attachment.region.name;
                    if(slot.currentSprite !== undefined)
                        slot.currentSprite.setVisible(false);
                    slot.sprites = slot.sprites ||{};
                    if(slot.sprites[spriteName] !== undefined)
                        slot.sprites[spriteName].setVisible(true);
                    else{
                        var sprite = this._createSprite(slot, attachment);
                        slotNode.addChild(sprite);
                    }
                    slot.currentSprite = slot.sprites[spriteName];
                    slot.currentSpriteName = spriteName;
                }
            }
            var bone = slot.bone;
            if (attachment.region.offsetX === 0 && attachment.region.offsetY === 0) {
                ax = attachment.x;
                ay = attachment.y;
            }
            else {
                //var regionScaleX = attachment.width / attachment.regionOriginalWidth * attachment.scaleX;
                //ax = attachment.x + attachment.regionOffsetX * regionScaleX - (attachment.width * attachment.scaleX - attachment.regionWidth * regionScaleX) / 2;
                ax = (attachment.offset[0] + attachment.offset[4]) * 0.5;
                ay = (attachment.offset[1] + attachment.offset[5]) * 0.5;
            }
            slotNode.setPosition(bone.worldX + ax * bone.a + ay * bone.b, bone.worldY + ax * bone.c + ay * bone.d);
            slotNode.setScale(bone.getWorldScaleX(), bone.getWorldScaleY());

            //set the color and opacity
            selSprite = slot.currentSprite;
            selSprite._flippedX = bone.skeleton.flipX;
            selSprite._flippedY = bone.skeleton.flipY;
            if(selSprite._flippedY || selSprite._flippedX){
                slotNode.setRotation(bone.getWorldRotationX());
                selSprite.setRotation(attachment.rotation);
            }else{
                slotNode.setRotation(-bone.getWorldRotationX());
                selSprite.setRotation(-attachment.rotation);
            }

            //hack for sprite
            selSprite._renderCmd._displayedOpacity = 0 | (opacity * slot.color.a);
            var r = 0 | (color.r * slot.color.r), g = 0 | (color.g * slot.color.g), b = 0 | (color.b * slot.color.b);
            selSprite.setColor(cc.color(r,g,b));
            selSprite._renderCmd._updateColor();
        } else if (attachment instanceof spine.MeshAttachment) {
            //todo for mesh
        } else {
            slotNode.setVisible(false);
            continue;
        }
        slotNode.setVisible(true);
    }
};
