/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
*/

/**
 * @category ui
 */

import { SpriteFrame } from '../../../assets';
import { Component } from '../../../components';
import { ccclass, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { Color, Size } from '../../../core/math';
import { ccenum } from '../../../core/value-types/enum';
import { Node } from '../../../scene-graph';
import { LayoutComponent } from './layout-component';
import { PageViewComponent } from './page-view-component';
import { SpriteComponent } from './sprite-component';
import { UIRenderComponent } from './ui-render-component';
import { INode } from '../../../core/utils/interfaces';

const _color = new Color();

/**
 * @en Enum for PageView Indicator direction
 * @zh 页面视图指示器的摆放方向
 * @enum PageViewIndicator.Direction
 */
enum Direction {
  /**
   * @en The horizontal direction.
   * @zh 水平方向
   */
  HORIZONTAL = 0,

  /**
   * @en The vertical direction.
   * @zh 垂直方向
   */
  VERTICAL = 1,
}

ccenum(Direction);

/**
 * @en The Page View Indicator Component
 * @zh 页面视图每页标记组件
 */
@ccclass('cc.PageViewIndicatorComponent')
@executionOrder(110)
@menu('UI/PageViewIndicator')
export class PageViewIndicatorComponent extends Component {
  /**
   * @en The spriteFrame for each element.
   * @zh 每个页面标记显示的图片
   */
  @property({
    type: SpriteFrame,
  })
  get spriteFrame () {
    return this._spriteFrame;
  }

  set spriteFrame (value) {
    if (this._spriteFrame === value) {
      return;
    }

    this._spriteFrame = value;
  }

  /**
   * @en The location direction of PageViewIndicator.
   * @zh 页面标记摆放方向
   * @param direction 摆放方向
   */
  @property({
    type: Direction,
  })
  get direction () {
    return this._direction;
  }

  set direction (value) {
    if (this._direction === value) {
      return;
    }

    this._direction = value;
  }

  /**
   * @en The cellSize for each element.
   * @zh 每个页面标记的大小
   */
  @property({
    type: Size,
  })
  get cellSize () {
    return this._cellSize;
  }

  set cellSize (value) {
    if (this._cellSize === value) {
      return;
    }

    this._cellSize = value;
  }

  public static Direction = Direction;

  /**
   * @en The distance between each element.
   * @zh 每个页面标记之间的边距
   */
  @property
  public spacing = 0;
  @property
  public _spriteFrame: SpriteFrame | null = null;
  @property
  public _direction: Direction = Direction.HORIZONTAL;
  @property
  public _cellSize = new Size(20, 20);
  private _layout: LayoutComponent | null = null;
  private _pageView: PageViewComponent | null = null;
  private _indicators: Node[] = [];

  public onLoad () {
    this._updateLayout();
  }

  /**
   * @en Set Page View
   * @zh 设置页面视图
   * @param target 页面视图对象
   */
  public setPageView (target: PageViewComponent) {
    this._pageView = target;
    this._refresh();
  }

  public _updateLayout () {
    this._layout = this.getComponent(LayoutComponent);
    if (!this._layout) {
      this._layout = this.addComponent(LayoutComponent);
    }

    const layout = this._layout!;
    if (this.direction === Direction.HORIZONTAL) {
      layout.type = LayoutComponent.Type.HORIZONTAL;
      layout.spacingX = this.spacing;
    }
    else if (this.direction === Direction.VERTICAL) {
      layout.type = LayoutComponent.Type.VERTICAL;
      layout.spacingY = this.spacing;
    }
    layout.resizeMode = LayoutComponent.ResizeMode.CONTAINER;
  }

  public _createIndicator () {
    const node = new Node();
    const sprite = node.addComponent(SpriteComponent);
    sprite!.spriteFrame = this.spriteFrame;
    node.parent = this.node as unknown as Node;
    node.width = this.cellSize.width;
    node.height = this.cellSize.height;
    return node;
  }

  public _changedState () {
    const indicators = this._indicators;
    if (indicators.length === 0 || !this._pageView) { return; }
    const idx = this._pageView.curPageIdx;
    if (idx >= indicators.length) { return; }
    for (let i = 0; i < indicators.length; ++i) {
      const node = indicators[i];
      if (!node._uiComp) {
        continue;
      }

      const uiComp = node._uiComp as UIRenderComponent;
      _color.set(uiComp.color);
      _color.a = 255 / 2;
      uiComp.color = _color;
    }

    if (indicators[idx]._uiComp) {
      const comp = indicators[idx]._uiComp as UIRenderComponent;
      _color.set(comp.color);
      _color.a = 255;
      comp.color = _color;
    }
  }

  public _refresh () {
    if (!this._pageView) { return; }
    const indicators = this._indicators;
    const pages = this._pageView.getPages();
    if (pages.length === indicators.length) {
      return;
    }
    let i = 0;
    if (pages.length > indicators.length) {
      for (i = 0; i < pages.length; ++i) {
        if (!indicators[i]) {
          indicators[i] = this._createIndicator();
        }
      }
    }
    else {
      const count = indicators.length - pages.length;
      for (i = count; i > 0; --i) {
        const node = indicators[i - 1];
        this.node.removeChild(node);
        indicators.splice(i - 1, 1);
      }
    }
    if (this._layout && this._layout.enabledInHierarchy) {
      this._layout.updateLayout();
    }
    this._changedState();
  }
}

cc.PageViewIndicatorComponent = PageViewIndicatorComponent;
