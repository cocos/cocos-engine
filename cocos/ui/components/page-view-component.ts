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

import { EventHandler as ComponentEventHandler } from '../../../components';
import { ccclass, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { EventTouch, SystemEventType } from '../../../core/platform';
import { Vec2, Vec3 } from '../../../core/math';
import { ccenum } from '../../../core/value-types/enum';
import { LayoutComponent } from './layout-component';
import { PageViewIndicatorComponent } from './page-view-indicator-component';
import { ScrollViewComponent } from './scroll-view-component';
import { ScrollBarComponent } from './scroll-bar-component';
import { INode } from '../../../core/utils/interfaces';

const _temp_vec2 = new Vec2();

/**
 * @en The Page View Size Mode
 * @zh 页面视图每个页面统一的大小类型
 * @enum PageView.SizeMode
 */
enum SizeMode {
  /**
   * @en Each page is unified in size
   * @zh 每个页面统一大小
   */
  Unified = 0,
  /**
   * @en Each page is in free size
   * @zh 每个页面大小随意
   */
  Free = 1,
}

ccenum(SizeMode);

/**
 * @en The Page View Direction
 * @zh 页面视图滚动类型
 */
enum Direction {
  /**
   * @en Horizontal scroll.
   * @zh 水平滚动
   */
  Horizontal = 0,
  /**
   * @en Vertical scroll.
   * @zh 垂直滚动
   */
  Vertical = 1,
}

ccenum(Direction);

/**
 * @en Enum for ScrollView event type.
 * @zh 滚动视图事件类型
 * @enum PageView.EventType
 */
enum PageViewEventType {
  /**
   * @en The page turning event
   * @zh 翻页事件
   * @property {Number} PAGE_TURNING
   */
  PAGE_TURNING = 0,

}

ccenum(PageViewEventType);

/**
 * @en The PageView control
 * @zh 页面视图组件
 */
@ccclass('cc.PageViewComponent')
@executionOrder(110)
@menu('UI/PageView')
// @ts-ignore
export class PageViewComponent extends ScrollViewComponent {
  /**
   * @en Specify the size type of each page in PageView.
   * @zh 页面视图中每个页面大小类型
   */
  @property({
    type: SizeMode,
  })
  get sizeMode () {
    return this._sizeMode;
  }

  set sizeMode (value) {
    if (this._sizeMode === value) {
      return;
    }

    this._sizeMode = value;
    this._syncSizeMode();
  }

  /**
   * @en The page view direction
   * @zh 页面视图滚动类型
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
    this._syncScrollDirection();
  }

  /**
   * @en
   * The scroll threshold value, when drag exceeds this value,
   * release the next page will automatically scroll, less than the restore
   * @zh 滚动临界值，默认单位百分比，当拖拽超出该数值时，松开会自动滚动下一页，小于时则还原。
   */
  @property({
    slide: true,
    range: [0, 1, 0.01],
  })
  get scrollThreshold () {
    return this._scrollThreshold;
  }

  set scrollThreshold (value) {
    if (this._scrollThreshold === value) {
      return;
    }

    this._scrollThreshold = value;
  }

  /**
   * @en Change the PageTurning event timing of PageView.
   * @zh 设置 PageView PageTurning 事件的发送时机。
   */
  @property({
    slide: true,
    range: [0, 1, 0.01],
  })
  get pageTurningEventTiming () {
    return this._pageTurningEventTiming;
  }

  set pageTurningEventTiming (value) {
    if (this._pageTurningEventTiming === value) {
      return;
    }

    this._pageTurningEventTiming = value;
  }

  /**
   * @en The Page View Indicator
   * @zh 页面视图指示器组件
   */
  @property({
    type: PageViewIndicatorComponent,
  })
  get indicator () {
    return this._indicator;
  }

  set indicator (value) {
    if (this._indicator === value) {
      return;
    }

    this._indicator = value;
    if (this.indicator) {
      this.indicator.setPageView(this);
    }
  }

  get curPageIdx (){
    return this._curPageIdx;
  }

  public static SizeMode = SizeMode;
  public static Direction = Direction;
  public static EventType = PageViewEventType;

  /**
   * @en
   * Auto page turning velocity threshold. When users swipe the PageView quickly,
   * it will calculate a velocity based on the scroll distance and time,
   * if the calculated velocity is larger than the threshold, then it will trigger page turning.
   * @zh
   * 快速滑动翻页临界值。
   * 当用户快速滑动时，会根据滑动开始和结束的距离与时间计算出一个速度值，
   * 该值与此临界值相比较，如果大于临界值，则进行自动翻页。
   */
  @property
  public autoPageTurningThreshold = 100;

  // override visible false
  @property({
    type: ScrollBarComponent,
    visible: false,
    override: true,
  })
  get verticalScrollBar() {
    return this._verticalScrollBar;
  }

  @property({
    type: ScrollBarComponent,
    visible: false,
    override: true,
  })
  get horizontalScrollBar() {
    return this._horizontalScrollBar;
  }

  @property({
    visible: false,
    override: true,
  })
  public horizontal = true;

  @property({
    visible: false,
    override: true,
  })
  public vertical = true;

  @property({
    visible: false,
    override: true,
  })
  public cancelInnerEvents = true;

  @property({
    visible: false,
    override: true,
  })
  public scrollEvents: ComponentEventHandler[] = [];

  /**
   * @en The time required to turn over a page. unit: second
   * @zh 每个页面翻页时所需时间。单位：秒
   * @property {Number} pageTurningSpeed
   */
  @property
  public pageTurningSpeed = 0.3;

  /**
   * @en PageView events callback
   * @zh 滚动视图的事件回调函数
   */
  @property({
    type: ComponentEventHandler,
  })
  public pageEvents: ComponentEventHandler[] = [];

  @property
  private _sizeMode = SizeMode.Unified;
  @property
  private _direction = Direction.Horizontal;
  @property
  private _scrollThreshold = 0.5;
  @property
  private _pageTurningEventTiming = 0.1;
  @property
  private _indicator: PageViewIndicatorComponent | null = null;

  private _curPageIdx = 0;
  private _lastPageIdx = 0;
  private _pages: INode[] = [];
  private _initContentPos = new Vec3();
  private _scrollCenterOffsetX: number[] = []; // 每一个页面居中时需要的偏移量（X）
  private _scrollCenterOffsetY: number[] = []; // 每一个页面居中时需要的偏移量（Y）
  private _touchBeganPosition = new Vec3();
  private _touchEndPosition = new Vec3();

  public __preload () {
    this.node.on(SystemEventType.SIZE_CHANGED, this._updateAllPagesSize, this);
  }

  public onEnable () {
    super.onEnable();
    if (!CC_EDITOR) {
      this.node.on('scroll-ended-with-threshold', this._dispatchPageTurningEvent, this);
    }
  }

  public onDisable () {
   super.onDisable();
   if (!CC_EDITOR) {
      this.node.off('scroll-ended-with-threshold', this._dispatchPageTurningEvent, this);
    }
  }

  public onLoad () {
    this._initPages();
    if (this.indicator) {
      this.indicator.setPageView(this);
    }
  }

  public onDestroy () {
    this.node.off(SystemEventType.SIZE_CHANGED, this._updateAllPagesSize, this);
  }

  /**
   * @en Returns current page index.
   * @zh 返回当前页面索引。
   * @returns 当前页面索引。
   */
  public getCurrentPageIndex () {
    return this._curPageIdx;
  }

  /**
   * @en Set current page index.
   * @zh 设置当前页面索引。
   * @param index 索引。
   */
  public setCurrentPageIndex (index: number) {
    this.scrollToPage(index, 1);
  }

  /**
   * @en Returns all pages of pageview.
   * @zh 返回视图中的所有页面。
   * @returns 输=视图所有页面。
   */
  public getPages () {
    return this._pages;
  }

  /**
   * @en At the end of the current page view to insert a new view.
   * @zh 在当前页面视图的尾部插入一个新视图。
   * @param page 新视图。
   */
  public addPage (page: INode) {
    if (!page || this._pages.indexOf(page) !== -1 || !this.content) {
      return;
    }
    this.content.addChild(page);
    this._pages.push(page);
    this._updatePageView();
  }

  /**
   * @en Inserts a page in the specified location.
   * @zh 将页面插入指定位置中。
   * @param page 新视图。
   * @param index 指定位置。
   */
  public insertPage (page: INode, index: number) {
    if (index < 0 || !page || this._pages.indexOf(page) !== -1 || !this.content) {
      return;
    }
    const pageCount = this._pages.length;
    if (index >= pageCount) {
      this.addPage(page);
    }
    else {
      this._pages.splice(index, 0, page);
      this.content.insertChild(page, index);
      this._updatePageView();
    }
  }

  /**
   * @en Removes a page from PageView.
   * @zh 移除指定页面。
   * @param page 指定页面。
   */
  public removePage (page: INode) {
    if (!page || !this.content) { return; }
    const index = this._pages.indexOf(page);
    if (index === -1) {
      cc.warnID(4300, page.name);
      return;
    }
    this.removePageAtIndex(index);
  }

  /**
   * @en Removes a page at index of PageView.
   * @zh 移除指定下标的页面。
   * @param index 页面下标。
   */
  public removePageAtIndex (index: number) {
    const pageList = this._pages;
    if (index < 0 || index >= pageList.length) { return; }
    const page = pageList[index];
    if (!page || !this.content) { return; }
    this.content.removeChild(page);
    pageList.splice(index, 1);
    this._updatePageView();
  }

  /**
   * @en Removes all pages from PageView
   * @zh 移除所有页面。
   */
  public removeAllPages () {
    if (!this.content) { return; }
    const locPages = this._pages;
    for (let i = 0, len = locPages.length; i < len; i++) {
      this.content.removeChild(locPages[i]);
    }
    this._pages.length = 0;
    this._updatePageView();
  }

  /**
   * @en Scroll PageView to index.
   * @zh 滚动到指定页面
   * @param idx index of page.
   * @param timeInSecond scrolling time.
   */
  public scrollToPage (idx: number, timeInSecond = 0) {
    if (idx < 0 || idx >= this._pages.length) {
      return;
    }
    timeInSecond = timeInSecond !== undefined ? timeInSecond : 0.3;
    this._curPageIdx = idx;
    this.scrollToOffset(this._moveOffsetValue(idx), timeInSecond, true);
    if (this.indicator) {
      this.indicator._changedState();
    }
  }

  // override the method of ScrollView
  public getScrollEndedEventTiming () {
    return this.pageTurningEventTiming;
  }

  // 刷新页面视图
  protected _updatePageView () {
    // 当页面数组变化时修改 content 大小
    const layout = this.content!.getComponent(LayoutComponent);
    if (layout && layout.enabled) {
      layout.updateLayout();
    }

    const pageCount = this._pages.length;
    if (this._curPageIdx >= pageCount) {
      this._curPageIdx = pageCount === 0 ? 0 : pageCount - 1;
      this._lastPageIdx = this._curPageIdx;
    }
    // 进行排序
    const contentPos = this._initContentPos;
    for (let i = 0; i < pageCount; ++i) {
      const page = this._pages[i];
      // page.setSiblingIndex(i);
      const pos = page.position;
      if (this.direction === Direction.Horizontal) {
        this._scrollCenterOffsetX[i] = Math.abs(contentPos.x + pos.x);
      }
      else {
        this._scrollCenterOffsetY[i] = Math.abs(contentPos.y + pos.y);
      }
    }

    // 刷新 indicator 信息与状态
    if (this.indicator) {
      this.indicator._refresh();
    }
  }

  // 刷新所有页面的大小
  protected _updateAllPagesSize () {
    if(!this.content || !this.view){
      return;
    }

    if (this._sizeMode !== SizeMode.Unified) {
      return;
    }
    const locPages = CC_EDITOR ? this.content.children : this._pages;
    const selfSize = this.view.getContentSize();
    for (let i = 0, len = locPages.length; i < len; i++) {
      locPages[i].setContentSize(selfSize);
    }
  }

  protected _handleReleaseLogic () {
    this._autoScrollToPage();
    if (this._scrolling) {
      this._scrolling = false;
      if (!this._autoScrolling) {
        this._dispatchEvent('scroll-ended');
      }
    }
  }

  protected _onTouchBegan (event: EventTouch, captureListeners: any) {
    event.touch!.getUILocation(_temp_vec2);
    Vec3.set(this._touchBeganPosition, _temp_vec2.x, _temp_vec2.y, 0);
    super._onTouchBegan(event, captureListeners);
  }

  protected _onTouchMoved (event: EventTouch, captureListeners: any) {
    super._onTouchMoved(event, captureListeners);
  }

  protected _onTouchEnded (event: EventTouch, captureListeners: any) {
    event.touch!.getUILocation(_temp_vec2);
    Vec3.set(this._touchEndPosition, _temp_vec2.x, _temp_vec2.y, 0);
    super._onTouchEnded(event, captureListeners);
  }

  protected _onTouchCancelled (event: EventTouch, captureListeners: any) {
    event.touch!.getUILocation(_temp_vec2);
    Vec3.set(this._touchEndPosition, _temp_vec2.x, _temp_vec2.y, 0);
    super._onTouchCancelled(event, captureListeners);
  }

  protected _onMouseWheel () { }

  private _syncScrollDirection () {
    this.horizontal = this.direction === Direction.Horizontal;
    this.vertical = this.direction === Direction.Vertical;
  }

  private _syncSizeMode () {
    const view = this.view;
    if (!this.content || !view) { return; }
    const layout = this.content.getComponent(LayoutComponent);

    if (layout) {
      if (this._sizeMode === SizeMode.Free && this._pages.length > 0) {
        const lastPage = this._pages[this._pages.length - 1];
        if (this.direction === Direction.Horizontal) {
          layout.paddingLeft = (view.width - this._pages[0].width) / 2;
          layout.paddingRight = (view.width - lastPage.width) / 2;
        }
        else if (this.direction === Direction.Vertical) {
          layout.paddingTop = (view.height - this._pages[0].height) / 2;
          layout.paddingBottom = (view.height - lastPage.height) / 2;
        }
      }
      layout.updateLayout();
    }
  }

  // 初始化页面
  private _initPages () {
    if (!this.content) { return; }
    this._initContentPos = this.content.position;
    const children = this.content.children;
    for (let i = 0; i < children.length; ++i) {
      const page = children[i];
      if (this._pages.indexOf(page) >= 0) { continue; }
      this._pages.push(page);
    }
    this._syncScrollDirection();
    this._syncSizeMode();
    this._updatePageView();
  }

  private _dispatchPageTurningEvent () {
    if (this._lastPageIdx === this._curPageIdx) { return; }
    this._lastPageIdx = this._curPageIdx;
    ComponentEventHandler.emitEvents(this.pageEvents, this, PageViewEventType.PAGE_TURNING);
    this.node.emit('page-turning', this);
  }

  // 快速滑动
  private _isQuicklyScrollable (touchMoveVelocity: Vec3) {
    if (this.direction === Direction.Horizontal) {
      if (Math.abs(touchMoveVelocity.x) > this.autoPageTurningThreshold) {
        return true;
      }
    }
    else if (this.direction === Direction.Vertical) {
      if (Math.abs(touchMoveVelocity.y) > this.autoPageTurningThreshold) {
        return true;
      }
    }
    return false;
  }

  // 通过 idx 获取偏移值数值
  private _moveOffsetValue (idx: number) {
    const offset = new Vec3();
    if (this._sizeMode === SizeMode.Free) {
      if (this.direction === Direction.Horizontal) {
        offset.x = this._scrollCenterOffsetX[idx];
      }
      else if (this.direction === Direction.Vertical) {
        offset.y = this._scrollCenterOffsetY[idx];
      }
    } else {
      const view = this.view;
      if(!view){
        return offset;
      }
      if (this.direction === Direction.Horizontal) {
        offset.x = idx * view.width;
      }
      else if (this.direction === Direction.Vertical) {
        offset.y = idx * view.height;
      }
    }

    return offset;
  }

  private _getDragDirection(moveOffset: Vec3) {
    if (this._direction === Direction.Horizontal) {
      if (moveOffset.x === 0) {
        return 0;
      }

      return (moveOffset.x > 0 ? 1 : -1);
    }
    else {
      // 由于滚动 Y 轴的原点在在右上角所以应该是小于 0
      if (moveOffset.y === 0) {
        return 0;
      }

      return (moveOffset.y < 0 ? 1 : -1);
    }
  }

  // 是否超过自动滚动临界值
  private _isScrollable (offset: Vec3, index: number, nextIndex: number) {
    if (this._sizeMode === SizeMode.Free) {
      let curPageCenter = 0;
      let nextPageCenter = 0;
      if (this.direction === Direction.Horizontal) {
        curPageCenter = this._scrollCenterOffsetX[index];
        nextPageCenter = this._scrollCenterOffsetX[nextIndex];
        return Math.abs(offset.x) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
      }
      else if (this.direction === Direction.Vertical) {
        curPageCenter = this._scrollCenterOffsetY[index];
        nextPageCenter = this._scrollCenterOffsetY[nextIndex];
        return Math.abs(offset.y) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
      }
    }
    else {
      const view = this.view;
      if(!view){
        return;
      }
      if (this.direction === Direction.Horizontal) {
        return Math.abs(offset.x) >= view.width * this.scrollThreshold;
      }
      else if (this.direction === Direction.Vertical) {
        return Math.abs(offset.y) >= view.height * this.scrollThreshold;
      }
    }
  }

  private _autoScrollToPage () {
    const bounceBackStarted = this._startBounceBackIfNeeded();
    // Note:
    const moveOffset = new Vec3();
    Vec3.subtract(moveOffset, this._touchBeganPosition, this._touchEndPosition);
    // this._touchBeganPosition.subtract(this._touchEndPosition);
    if (bounceBackStarted) {
      const dragDirection = this._getDragDirection(moveOffset);
      if (dragDirection === 0) {
        return;
      }
      if (dragDirection > 0) {
        this._curPageIdx = this._pages.length - 1;
      }
      else {
        this._curPageIdx = 0;
      }
      if (this.indicator) {
        this.indicator._changedState();
      }
    }
    else {
      const index = this._curPageIdx;
      const nextIndex = index + this._getDragDirection(moveOffset);
      const timeInSecond = this.pageTurningSpeed * Math.abs(index - nextIndex);
      if (nextIndex < this._pages.length) {
        if (this._isScrollable(moveOffset, index, nextIndex)) {
          this.scrollToPage(nextIndex, timeInSecond);
          return;
        }
        else {
          const touchMoveVelocity = this._calculateTouchMoveVelocity();
          if (this._isQuicklyScrollable(touchMoveVelocity)) {
            this.scrollToPage(nextIndex, timeInSecond);
            return;
          }
        }
      }
      this.scrollToPage(index, timeInSecond);
    }
  }

}

cc.PageViewComponent = PageViewComponent;

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event page-turning
 * @param {Event.EventCustom} event
 * @param {PageView} pageView - The PageView component.
 */
