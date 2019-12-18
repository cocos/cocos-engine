/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import Assembler2D from '../../../../assembler-2d';

export default class TiledAssembler extends Assembler2D {
    initData (sprite) {
        this.verticesCount = 0;
        this.contentWidth = 0;
        this.contentHeight = 0;
        this.rectWidth = 0;
        this.rectHeight = 0;
        this.hRepeat = 0;
        this.vRepeat = 0;
        this.row = 0;
        this.col = 0;

        this._renderData.createFlexData(0, 4, 6, this.getVfmt());
        this._updateIndices();
    }

    initLocal () {
        this._local = { x: [], y: []};
    }

    _updateIndices () {
        let iData = this._renderData.iDatas[0];
        for (let i = 0, vid = 0, l = iData.length; i < l; i += 6, vid += 4) {
            iData[i] = vid;
            iData[i + 1] = vid + 1;
            iData[i + 2] = vid + 2;
            iData[i + 3] = vid + 1;
            iData[i + 4] = vid + 3;
            iData[i + 5] = vid + 2;
        }
    }

    updateRenderData (sprite) {
      let frame = sprite._spriteFrame;
      this.packToDynamicAtlas(sprite, frame);

      let node = sprite.node;

      let contentWidth = this.contentWidth = Math.abs(node.width);
      let contentHeight = this.contentHeight = Math.abs(node.height);
      let rect = frame._rect;
      let rectWidth = this.rectWidth = rect.width;
      let rectHeight = this.rectHeight = rect.height;
      let leftWidth = frame.insetLeft, rightWidth = frame.insetRight, centerWidth = rect.width - leftWidth - rightWidth,
          topHeight = frame.insetTop, bottomHeight = frame.insetBottom, centerHeight = rect.height - topHeight - bottomHeight;
      if (frame.insetBottom > 0 || frame.insetTop > 0) {
        if (contentHeight >= rectHeight) {
          contentHeight -= topHeight;
          rectHeight = centerHeight;
        }
      }
      if (frame.insetLeft > 0 || frame.insetRight > 0) {
        if (contentWidth >= rectWidth) {
          contentWidth -= rightWidth;
          rectWidth = centerWidth;
        }
      }
      let hRepeat = this.hRepeat = contentWidth / rectWidth;
      let vRepeat = this.vRepeat = contentHeight / rectHeight;
      let row = this.row = Math.ceil(vRepeat);
      let col = this.col = Math.ceil(hRepeat);

      // update data property
      let count = row * col;
      this.verticesCount = count * 4;
      this.indicesCount = count * 6;

      let renderData = this._renderData;
      let flexBuffer = renderData._flexBuffer;
      if (flexBuffer.reserve(this.verticesCount, this.indicesCount)) {
        this._updateIndices();
        this.updateColor(sprite);
      }
      flexBuffer.used(this.verticesCount, this.indicesCount);

      if (sprite._vertsDirty) {
        this.updateUVs(sprite);
        this.updateVerts(sprite);
        sprite._vertsDirty = false;
      }
    }

    updateVerts (sprite) {
      let frame = sprite._spriteFrame;
      let rect = frame._rect;
      let node = sprite.node,
          appx = node.anchorX * node.width, appy = node.anchorY * node.height;

      let { row, col, rectWidth, rectHeight, contentWidth, contentHeight } = this;
      let { x, y } = this._local;
      x.length = y.length = 0;

      let leftWidth = frame.insetLeft, rightWidth = frame.insetRight, centerWidth = rect.width - leftWidth - rightWidth,
          topHeight = frame.insetTop, bottomHeight = frame.insetBottom, centerHeight = rect.height - topHeight - bottomHeight;
      for (let i = 0; i <= col; ++i) {
        if (contentWidth <= rectWidth) {
            x[i] = Math.min(rectWidth * i , contentWidth) - appx;
        } else {
            if (i === 0) {
              x[i] =  - appx;
            } else if (i > 0 && i < col){
              x[i] = Math.min(leftWidth + centerWidth * i, contentWidth) - appx;
            } else if (i === col) {
              x[i] = Math.min(leftWidth + centerWidth * i + rightWidth, contentWidth) - appx;
            }
        }
      }
      for (let _i = 0; _i <= row; ++_i) {
        if (contentHeight <= rectHeight) {
            y[_i] = Math.min(rectHeight * _i, contentHeight) - appy;
        } else {
            if (_i === 0) {
              y[_i] = - appy;
            } else if (_i > 0 && _i < row) {
              y[_i] = Math.min(bottomHeight + centerHeight * _i, contentHeight) - appy;
            } else if (_i === row) {
              y[_i] = Math.min(bottomHeight + centerHeight * _i + topHeight, contentHeight) - appy;
            }
        }
      }

      this.updateWorldVerts(sprite);
    }
    
    updateWorldVerts (sprite) {
      let renderData = this._renderData;
      let local = this._local;
      let localX = local.x, localY = local.y;
      let world = renderData.vDatas[0];
      let { row, col } = this;
      let matrix = sprite.node._worldMatrix;
      let matrixm = matrix.m;
      let a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
          tx = matrixm[12], ty = matrixm[13];

      let x, x1, y, y1;
      let floatsPerVert = this.floatsPerVert;
      let vertexOffset = 0;
      for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
          y = localY[yindex];
          y1 = localY[yindex + 1];
          for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
              x = localX[xindex];
              x1 = localX[xindex + 1];

              // lb
              world[vertexOffset] = x * a + y * c + tx;
              world[vertexOffset + 1] = x * b + y * d + ty;
              vertexOffset += floatsPerVert;
              // rb
              world[vertexOffset] = x1 * a + y * c + tx;
              world[vertexOffset + 1] = x1 * b + y * d + ty;
              vertexOffset += floatsPerVert;
              // lt
              world[vertexOffset] = x * a + y1 * c + tx;
              world[vertexOffset + 1] = x * b + y1 * d + ty;
              vertexOffset += floatsPerVert;
              // rt
              world[vertexOffset] = x1 * a + y1 * c + tx;
              world[vertexOffset + 1] = x1 * b + y1 * d + ty;
              vertexOffset += floatsPerVert;
          }
      }
    }

    updateUVs (sprite) {
      let verts = this._renderData.vDatas[0];
      if (!verts) return;
      
      let { row, col, hRepeat, vRepeat } = this;
      let uv = sprite.spriteFrame.uv;
      let uvSliced = sprite.spriteFrame.uvSliced;

      let hadTopOrBottomBorder = (sprite.spriteFrame.insetTop > 0 || sprite.spriteFrame.insetBottom > 0);
      let hadLeftOrRightBorder = (sprite.spriteFrame.insetLeft > 0 || sprite.spriteFrame.insetRight > 0);
      let rotated = sprite.spriteFrame._rotated;
      let floatsPerVert = this.floatsPerVert, uvOffset = this.uvOffset;

      for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
        var coefv = Math.min(1, vRepeat - yindex);
        for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
          var coefu = Math.min(1, hRepeat - xindex);

          // UV
          if (rotated) {
            // lb
            verts[uvOffset] = uv[0];
            verts[uvOffset + 1] = uv[1];
            uvOffset += floatsPerVert;
            // rb
            verts[uvOffset] = uv[0];
            verts[uvOffset + 1] = uv[1] + (uv[7] - uv[1]) * coefu;
            uvOffset += floatsPerVert;
            // lt
            verts[uvOffset] = uv[0] + (uv[6] - uv[0]) * coefv;
            verts[uvOffset + 1] = uv[1];
            uvOffset += floatsPerVert;
            // rt
            verts[uvOffset] = verts[uvOffset - floatsPerVert];
            verts[uvOffset + 1] = verts[uvOffset + 1 - floatsPerVert * 2];
            uvOffset += floatsPerVert;
          } else {
            // lb
            if (xindex === 0) {
              verts[uvOffset] = uvSliced[0].u;
            } else if (xindex > 0 && xindex < (col - 1)) {
              verts[uvOffset] = uvSliced[1].u;
            } else if (xindex === (col - 1)) {
              if (hadLeftOrRightBorder) {
                verts[uvOffset] = uvSliced[2].u;
              } else {
                verts[uvOffset] = uvSliced[0].u;
              }
            }
            if (yindex === 0) {
              verts[uvOffset + 1] = uvSliced[0].v;
            } else if(yindex > 0 && yindex < (row - 1)) {
              verts[uvOffset + 1] = uvSliced[4].v;
            } else if (yindex === (row - 1)){
              if (hadTopOrBottomBorder) {
                verts[uvOffset + 1] = uvSliced[8].v;
              } else {
                verts[uvOffset + 1] = uvSliced[0].v;
              }
            }
            uvOffset += floatsPerVert;
            // rb
            if (xindex === 0) {
              verts[uvOffset] = uvSliced[0].u + (uvSliced[3].u - uvSliced[0].u) * coefu;
            } else if(xindex > 0 && xindex < (col - 1)){
              verts[uvOffset] = uvSliced[0].u + (uvSliced[2].u - uvSliced[0].u) * coefu;
            } else if (xindex === (col - 1)) {
              verts[uvOffset - 4 * floatsPerVert * xindex] = uvSliced[2].u;
              if (hadLeftOrRightBorder) {
                verts[uvOffset] = uvSliced[3].u;
              } else {
                verts[uvOffset] = uvSliced[0].u + (uvSliced[3].u - uvSliced[0].u) * coefu;
              }
            }
            if (yindex === 0) {
              verts[uvOffset + 1] = uvSliced[0].v;
            } else if (yindex > 0 && yindex < (row - 1)) {
              verts[uvOffset + 1] = uvSliced[4].v;
            } else if (yindex === (row - 1)) {
              if (hadTopOrBottomBorder) {
                verts[uvOffset + 1] = uvSliced[8].v;
              } else {
                verts[uvOffset + 1] = uvSliced[0].v;
              }
            }
            uvOffset += floatsPerVert;
            // lt
            if (xindex === 0) {
              verts[uvOffset] = uvSliced[0].u;
            } else if (xindex > 0 && xindex < (col - 1)) {
              verts[uvOffset] = uvSliced[1].u;
            } else if (xindex === (col - 1)) {
              if (hadLeftOrRightBorder) {
                verts[uvOffset] = uvSliced[2].u;
              } else {
                verts[uvOffset] = uvSliced[0].u;
              }
            }
            if (yindex === 0) {
              verts[uvOffset + 1] = uvSliced[0].v + (uvSliced[12].v - uvSliced[0].v) * coefv;
            } else if (yindex > 0 && yindex < (row - 1)) {
              verts[uvOffset + 1] = uvSliced[0].v + (uvSliced[8].v - uvSliced[0].v) * coefv;
            } else if (yindex === (row - 1)) {
              verts[uvOffset + 1 - 4 * floatsPerVert * col * yindex] = uvSliced[8].v;
              if (hadTopOrBottomBorder) {
                verts[uvOffset + 1] = uvSliced[12].v;
              } else {
                verts[uvOffset + 1] = uvSliced[0].v + (uvSliced[12].v - uvSliced[0].v) * coefv;
              }
            }
            uvOffset += floatsPerVert;
            // rt
            if (xindex === 0) {
              verts[uvOffset] = verts[uvOffset - floatsPerVert * 2];
            } else if(xindex > 0 && xindex < (col - 1)){
              verts[uvOffset] = verts[uvOffset - floatsPerVert * 2]
            } else if (xindex === (col - 1)) {
              verts[uvOffset - 4 * floatsPerVert * xindex] = uvSliced[2].u;
              verts[uvOffset] = verts[uvOffset - floatsPerVert * 2];
            }
            if (yindex === 0) {
              verts[uvOffset + 1] = verts[uvOffset + 1 - floatsPerVert];
            } else if (yindex > 0 && yindex < (row - 1)) {
              verts[uvOffset + 1] = verts[uvOffset + 1 - floatsPerVert];
            } else if (yindex === (row - 1)) {
              verts[uvOffset + 1 - 4 * floatsPerVert * col * yindex] = uvSliced[8].v;
              verts[uvOffset + 1] = verts[uvOffset + 1 - floatsPerVert];
            }
            uvOffset += floatsPerVert;
          }
        }
      }
    }
}

