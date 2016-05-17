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


sp._SGSkeleton.WebGLRenderCmd = function (renderableObject) {
    _ccsg.Node.WebGLRenderCmd.call(this, renderableObject);
    this._needDraw = true;
    this.setShaderProgram(cc.shaderCache.programForKey(cc.macro.SHADER_POSITION_TEXTURECOLOR));
    this._capacity = 128;

    this._indices = new Uint16Array(this._capacity);
    var elementSize = cc.V3F_C4B_T2F.BYTES_PER_ELEMENT;
    this._elementArrayBuffer = new ArrayBuffer(elementSize * this._capacity);
    this._setupVBO()
};

var proto = sp._SGSkeleton.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
proto.constructor = sp._SGSkeleton.WebGLRenderCmd;
proto._setupVBO = function () {
    var gl = cc._renderContext;
    //create WebGLBuffer
    this._bufferVBO = gl.createBuffer();
    this._elementWebBuffer = gl.createBuffer();
}
proto._resizeCapacity = function(newCapacity){
  this._capacity = newCapacity
  this._indices = new Uint16Array(this._capacity);
  var elementSize = cc.V3F_C4B_T2F.BYTES_PER_ELEMENT;
  this._elementArrayBuffer = new ArrayBuffer(elementSize * this._capacity);
}
proto.rendering = function (ctx) {
    var self = this;
    var node = this._node;
    var color = node.getColor(), locSkeleton = node._skeleton;

    var blendMode, textureAtlas, attachment, slot, i, n;
    var locBlendFunc = node._blendFunc;
    var premultiAlpha = node._premultipliedAlpha;
    var elementCount = 0;
    var indiceIndex = 0;

    this._shaderProgram.use();
    this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
//        cc.gl.blendFunc(this._blendFunc.src, this._blendFunc.dst);
    locSkeleton.r = color.r / 255;
    locSkeleton.g = color.g / 255;
    locSkeleton.b = color.b / 255;
    locSkeleton.a = node.getOpacity() / 255;
    if (premultiAlpha) {
        locSkeleton.r *= locSkeleton.a;
        locSkeleton.g *= locSkeleton.a;
        locSkeleton.b *= locSkeleton.a;
    }

    //for (i = 0, n = locSkeleton.slots.length; i < n; i++) {
    for (i = 0, n = locSkeleton.drawOrder.length; i < n; i++) {
        slot = locSkeleton.drawOrder[i];
        if (!slot.attachment)
            continue;
        attachment = slot.attachment;
        var meshPoints = null;
        switch(slot.attachment.type) {
            case sp.ATTACHMENT_TYPE.REGION:
                meshPoints = this._updateRegionAttachmentQuad(attachment, slot, premultiAlpha);
                break;
            case sp.ATTACHMENT_TYPE.MESH:
                meshPoints = this._updateMeshAttachmentQuad(attachment, slot, premultiAlpha);
                break;
            case sp.ATTACHMENT_TYPE.SKINNED_MESH:
                meshPoints = this._updateSkinnedMeshAttachmentQuad(attachment, slot, premultiAlpha);
                break;
            default:
                continue;
        }

        var regionTextureAtlas = node.getTextureAtlas(attachment);

        if (slot.data.blendMode !== blendMode) {
            if (textureAtlas) {
              drawNow()
              elementCount=0;
              indiceIndex=0;
            }
            blendMode = slot.data.blendMode;
            switch (blendMode) {
            case spine.BlendMode.normal:
                cc.gl.blendFunc(premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA, cc.macro.ONE_MINUS_SRC_ALPHA);
                break;
            case spine.BlendMode.additive:
                cc.gl.blendFunc(premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA, cc.macro.ONE);
                break;
            case spine.BlendMode.multiply:
                cc.gl.blendFunc(cc.macro.DST_COLOR, cc.macro.ONE_MINUS_SRC_ALPHA);
                break;
            case spine.BlendMode.screen:
                cc.gl.blendFunc(cc.macro.ONE, cc.macro.ONE_MINUS_SRC_COLOR);
                break;
            default:
                cc.gl.blendFunc(locBlendFunc.src, locBlendFunc.dst);
            }
        }
        else if (regionTextureAtlas !== textureAtlas && textureAtlas) {
          drawNow()
          elementCount=0;
          indiceIndex=0;
        }
        textureAtlas = regionTextureAtlas;

        var need = 0;
        if(attachment.type==sp.ATTACHMENT_TYPE.REGION){
          need = 6;
        }
        else{
          need = attachment.triangles.length
        }
        if(this._capacity < indiceIndex + need){
          drawNow()
          elementCount=0;
          indiceIndex=0;
          this._resizeCapacity(this._capacity * 2);
          while(this._capacity < need){
            this._resizeCapacity(this._capacity * 2);
          }
        }

        var oldCount = elementCount;
        for(var j = 0;j<meshPoints.length;j++){
          var meshPoint = meshPoints[j]
          var temp = new cc.V3F_C4B_T2F(
             meshPoint.vertices
            ,meshPoint.colors
            ,meshPoint.texCoords
            ,this._elementArrayBuffer
            ,cc.V3F_C4B_T2F.BYTES_PER_ELEMENT * elementCount)

          elementCount++;
        }
        switch(slot.attachment.type) {
            case sp.ATTACHMENT_TYPE.REGION:
                this._indices[indiceIndex  ]= oldCount + 1;
                this._indices[indiceIndex+1]= oldCount + 2;
                this._indices[indiceIndex+2]= oldCount + 3;
                this._indices[indiceIndex+3]= oldCount + 1;
                this._indices[indiceIndex+4]= oldCount + 0;
                this._indices[indiceIndex+5]= oldCount + 3;
                indiceIndex+=6;
                break;
            case sp.ATTACHMENT_TYPE.MESH:
                var triangles = attachment.triangles
                for(var j = 0;j<triangles.length;j++){
                  this._indices[indiceIndex+j]=oldCount+triangles[j]
                }
                indiceIndex+=triangles.length;
                break;
            case sp.ATTACHMENT_TYPE.SKINNED_MESH:
                var triangles = attachment.triangles
                for(var j = 0;j<triangles.length;j++){
                  this._indices[indiceIndex+j]=oldCount+triangles[j]
                }
                indiceIndex+=triangles.length;
                break;
            default:
                continue;
        }
    }

    if (textureAtlas) {
        drawNow()
        elementCount=0;
        indiceIndex=0;
    }

    if (node._debugBones || node._debugSlots) {
        cc.math.glMatrixMode(cc.math.KM_GL_MODELVIEW);
        //cc.math.glPushMatrixWitMat4(this._stackMatrix);
        cc.current_stack.stack.push(cc.current_stack.top);
        cc.current_stack.top = this._stackMatrix;
        var drawingUtil = cc._drawingUtil;

        if (node._debugSlots) {
            // Slots.
            for (i = 0, n = locSkeleton.slots.length; i < n; i++) {
                slot = locSkeleton.drawOrder[i];
                drawingUtil.setLineWidth(1);
                if (!slot.attachment)
                    continue;
                if(slot.attachment.type == sp.ATTACHMENT_TYPE.REGION){
                  drawingUtil.setDrawColor(0, 0, 255, 255);
                  attachment = slot.attachment;
                  var points = this._updateRegionAttachmentQuad(attachment, slot);

                  var dbg_points = [];

                  for(var k = 0;k<points.length;k++){
                    dbg_points.push(cc.p(points[k].vertices.x,points[k].vertices.y));
                  }
                  drawingUtil.drawPoly(dbg_points, dbg_points.length, true);
                }
                else if(slot.attachment.type == sp.ATTACHMENT_TYPE.MESH){
                  drawingUtil.setDrawColor(0, 255, 0, 255);
                  attachment = slot.attachment;

                  var points = this._updateMeshAttachmentQuad(attachment, slot);

                  var dbg_points = [];

                  for(var k = 0;k<points.length;k++){
                     dbg_points.push(cc.p(points[k].vertices.x,points[k].vertices.y));
                  }
                  drawingUtil.drawPoly(dbg_points, dbg_points.length, true);
                }
                else if(slot.attachment.type == sp.ATTACHMENT_TYPE.SKINNED_MESH){
                  drawingUtil.setDrawColor(0, 255, 255, 255);
                  attachment = slot.attachment;
                  var points = this._updateSkinnedMeshAttachmentQuad(attachment, slot);

                  var dbg_points = [];

                  for(var k = 0;k<points.length;k++){
                     dbg_points.push(cc.p(points[k].vertices.x,points[k].vertices.y));
                  }
                  drawingUtil.drawPoly(dbg_points, dbg_points.length, true);
                }
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
                drawingUtil.drawLine(cc.p(bone.worldX, bone.worldY), cc.p(x, y));
            }

            // Bone origins.
            drawingUtil.setPointSize(4);
            drawingUtil.setDrawColor(0, 0, 255, 255); // Root bone is blue.

            for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
                bone = locSkeleton.bones[i];
                drawingUtil.drawPoint(cc.p(bone.worldX, bone.worldY));
                if (i == 0) {
                    drawingUtil.setDrawColor(0, 255, 0, 255);
                }
            }
        }
        cc.math.glPopMatrix();
    }
    function drawNow(){
      if(!textureAtlas || !textureAtlas.texture.isLoaded()){
        return;
      }
      var gl = cc._renderContext;
      cc.gl.bindTexture2D(textureAtlas.texture)
      cc.gl.enableVertexAttribs(cc.macro.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);

      gl.bindBuffer(gl.ARRAY_BUFFER,self._elementWebBuffer)
      gl.bufferData(gl.ARRAY_BUFFER,self._elementArrayBuffer,gl.DYNAMIC_DRAW)

      gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_POSITION,3,gl.FLOAT,false,24,0);
      gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);          // colors
      gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, 16);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self._bufferVBO);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, self._indices,gl.DYNAMIC_DRAW)

      gl.drawElements(gl.TRIANGLES, indiceIndex, gl.UNSIGNED_SHORT, 0);

      cc.g_NumberOfDraws++;
    }
};

proto._createChildFormSkeletonData = function(){};

proto._updateChild = function(){};

proto._updateRegionAttachmentQuad = function(attachment, slot, premultipliedAlpha) {
    var vertices = [];
    attachment.computeVertices(slot.bone.skeleton.x, slot.bone.skeleton.y, slot.bone, vertices);
    var r = slot.bone.skeleton.r * slot.r * 255;
    var g = slot.bone.skeleton.g * slot.g * 255;
    var b = slot.bone.skeleton.b * slot.b * 255;
    var normalizedAlpha = slot.bone.skeleton.a * slot.a;

    if (premultipliedAlpha) {
        r *= normalizedAlpha;
        g *= normalizedAlpha;
        b *= normalizedAlpha;
    }
    var a = normalizedAlpha * 255;

    var color = cc.color(r,g,b,a)
    var result = []
    for(var i = 0;i<vertices.length;i+=2){
      result.push({
         vertices:new cc.Vertex2F(vertices[i],vertices[i+1]),
         colors:color,
         texCoords:new cc.Tex2F(attachment.uvs[i],attachment.uvs[i+1])
      })
    }

    return result;
};

proto._updateMeshAttachmentQuad = function(attachment, slot, premultipliedAlpha) {
  var vertices = [];
  attachment.computeWorldVertices(slot.bone.skeleton.x, slot.bone.skeleton.y, slot, vertices);
  var r = slot.bone.skeleton.r * slot.r * 255;
  var g = slot.bone.skeleton.g * slot.g * 255;
  var b = slot.bone.skeleton.b * slot.b * 255;
  var normalizedAlpha = slot.bone.skeleton.a * slot.a;
  if (premultipliedAlpha) {
      r *= normalizedAlpha;
      g *= normalizedAlpha;
      b *= normalizedAlpha;
  }
  var a = normalizedAlpha * 255;

  var color = cc.color(r,g,b,a)
  var result = []
  for(var i = 0;i<vertices.length;i+=2){
    result.push({
       vertices:new cc.Vertex2F(vertices[i],vertices[i+1]),
       //vertices:new cc.Vertex2F(0,0),
       colors:color,
       texCoords:new cc.Tex2F(attachment.uvs[i],attachment.uvs[i+1])
    })
  }
  return result;
};
proto._updateSkinnedMeshAttachmentQuad = function(attachment, slot, premultipliedAlpha){
  var vertices = [];
  attachment.computeWorldVertices(slot.bone.skeleton.x, slot.bone.skeleton.y, slot, vertices);
  var r = slot.bone.skeleton.r * slot.r * 255;
  var g = slot.bone.skeleton.g * slot.g * 255;
  var b = slot.bone.skeleton.b * slot.b * 255;
  var normalizedAlpha = slot.bone.skeleton.a * slot.a;
  if (premultipliedAlpha) {
      r *= normalizedAlpha;
      g *= normalizedAlpha;
      b *= normalizedAlpha;
  }
  var a = normalizedAlpha * 255;
  var color = cc.color(r,g,b,a)
  var result = []
  for(var i = 0;i<vertices.length;i+=2){
    result.push({
       vertices:new cc.Vertex2F(vertices[i],vertices[i+1]),
       //vertices:new cc.Vertex2F(0,0),
       colors:color,
       texCoords:new cc.Tex2F(attachment.uvs[i],attachment.uvs[i+1])
    })
  }
  return result;
}
