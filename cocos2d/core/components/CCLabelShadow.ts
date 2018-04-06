/*!
 *
 * Copyright 2018 - acrazing
 *
 * @author acrazing joking.young@gmail.com
 * @since 2018-04-03 11:33:16
 * @version 1.0.0
 * @desc LabelShadow.ts
 */

import ccclass = cc._decorator.ccclass
import property = cc._decorator.property

@ccclass
export default class LabelShadow extends cc.Component {
  @property private _shadowColor = cc.color(255, 255, 255, 255)
  @property private _shadowOffsetX = 0
  @property private _shadowOffsetY = 0
  @property private _shadowBlurRadius = 0

  @property
  get shadowColor() {
    return this._shadowColor
  }

  set shadowColor(value: cc.Color) {
    this._shadowColor = value
    this.enabled && this.onEnable()
  }

  @property
  get shadowOffsetX() {
    return this._shadowOffsetX
  }

  set shadowOffsetX(value: number) {
    this._shadowOffsetX = value
    this.enabled && this.onEnable()
  }

  @property
  get shadowOffsetY() {
    return this._shadowOffsetY
  }

  set shadowOffsetY(value: number) {
    this._shadowOffsetY = value
    this.enabled && this.onEnable()
  }

  @property
  get shadowBlurRadius() {
    return this._shadowBlurRadius
  }

  set shadowBlurRadius(value: number) {
    this._shadowBlurRadius = value
    this.enabled && this.onEnable()
  }

  enableShadow(
    color = this._shadowColor,
    offsetX = this._shadowOffsetX,
    offsetY = this._shadowOffsetY,
    blurRadius = this._shadowBlurRadius,
  ) {
    this._shadowColor = color
    this._shadowOffsetX = offsetX
    this._shadowOffsetY = offsetY
    this._shadowBlurRadius = blurRadius
    this.enabled && this.onEnable()
  }

  onEnable() {
    const label = this.node.getComponent(cc.Label)
    const node: cc.Label = label && label._sgNode
    if (!node || !node.enableShadow) {
      return
    }
    node.enableShadow(this._shadowColor, cc.size(this._shadowOffsetX, this._shadowOffsetY), this._shadowBlurRadius)
  }

  onDisable() {
    const label = this.node.getComponent(cc.Label)
    const node: cc.Label = label && label._sgNode
    if (!node || !node.disableShadow) {
      return
    }
    node.disableShadow()
  }
}