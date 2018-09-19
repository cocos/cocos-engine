'use strict';

Vue.component('cc-studio-widget', {
  dependencies: [
    'packages://inspector/share/alignment-preview.js',
  ],

  template: `
    <style>
      #outer {
        width: 235px;
        margin: 0 auto;
      }
      #upper {
        margin: 0 auto 12px auto;
      }
      #lower {
        margin-left: 6px;
      }
      .h-control-group {
        height: 26px;
        position: relative;
        margin-left: 90px;
      }
      .v-control-group {
        width: 47px;
        height: 40px;
      }
      .top-input {
        position: relative;
        margin-left: 18px
      }
      .bottom-input {
        margin-top: 4px;
      }
      .right-input {
        position: relative;
      }
      /*.bottom-input::shadow input {*/
        /*vertical-align: text-bottom;*/
        /*padding: 0.2em 0.4em;*/
      /*}*/
      /*.right-input::shadow input {*/
        /*vertical-align: text-bottom;*/
        /*padding: 0.2em 0.4em;*/
      /*}*/
      .v-checkbox {
        margin: 0px;
      }
      .centered-prop {
        height: 26px;
      }
      ui-input {
        width: 5.4em;
        margin: 0px;
      }
      hr {
        margin-top: 7px;
        margin-bottom: 5px;
      }
    </style>

    <div id="outer">
      <div id="upper">
        <div class="h-control-group layout horizontal center">
          <ui-checkbox
            v-value="target.isAlignTop.value"
            v-values="target.isAlignTop.values"
            :multi-values="_checkWidgetMulti(target.isAlignTop)"
            @change="_onTopBottomChecked"
            :title="T('COMPONENT.widget.align_top')"
          >Top</ui-checkbox>
          <ui-input class="top-input small"
            v-value="topValue"

            @confirm="_onTopChanged"
            :title="T('COMPONENT.widget.top')"
            v-show="_checkWidgetInput(target.isAlignTop, multi)"
          ></ui-input>
        </div>

        <div class="layout horizontal center">
          <div class="v-control-group layout vertical end">
            <ui-checkbox class="v-checkbox"
              v-value="target.isAlignLeft.value"
              v-values="target.isAlignLeft.values"
              :multi-values="_checkWidgetMulti(target.isAlignLeft)"
              @change="_onLeftRightChecked"
              :title="T('COMPONENT.widget.align_left')"
            >Left</ui-checkbox>
            <ui-input class="bottom-input small"
              :value="leftValue"
              @confirm="_onLeftChanged"
              :title="T('COMPONENT.widget.left')"
              v-show="_checkWidgetInput(target.isAlignLeft, multi)"
            ></ui-input>
          </div>

          <cc-alignment-preview :target.sync="target"></cc-alignment-preview>

          <div class="v-control-group layout vertical">
            <ui-checkbox class="v-checkbox"
              v-value="target.isAlignRight.value"
              v-values="target.isAlignRight.values"
              :multi-values="_checkWidgetMulti(target.isAlignRight)"
              @change="_onLeftRightChecked"
              :title="T('COMPONENT.widget.align_right')"
            >Right</ui-checkbox>
            <ui-input class="bottom-input small"
              :value="rightValue"
              @confirm="_onRightChanged"
              :title="T('COMPONENT.widget.right')"
              v-show="_checkWidgetInput(target.isAlignRight, multi)"
            ></ui-input>
          </div>
        </div>

        <div class="h-control-group layout horizontal center">
          <ui-checkbox class="h-checkbox"
            v-value="target.isAlignBottom.value"
            v-values="target.isAlignBottom.values"
            :multi-values="_checkWidgetMulti(target.isAlignBottom)"
            @change="_onTopBottomChecked"
            :title="T('COMPONENT.widget.align_bottom')"
          >Bottom</ui-checkbox>
          <ui-input class="right-input small"
            :value="bottomValue"
            @confirm="_onBottomChanged"
            :title="T('COMPONENT.widget.bottom')"
            v-show="_checkWidgetInput(target.isAlignBottom, multi)"
          ></ui-input>
        </div>
      </div>

      <div id="lower" class="layout vertical">
        <div class="centered-prop layout horizontal center">
          <ui-checkbox
            v-value="target.isAlignHorizontalCenter.value"
            v-values="target.isAlignHorizontalCenter.values"
            :multi-values="_checkWidgetMulti(target.isAlignHorizontalCenter)"
            @change="_onHorizontalCenterChecked"
            :title="T('COMPONENT.widget.align_h_center')"
          >Horizontal Center</ui-checkbox>
          <span class="flex-1"></span>
          <ui-input
            :value="horizontalCenterValue"
            v-values="horizontalCenterValues"
            :multi-values="_checkWidgetMulti(target.isAlignHorizontalCenter) && _checkWidgetMulti(horizontalCenterValues)"
            @confirm="_onHorizontalCenterChanged"
            :title="T('COMPONENT.widget.horizontal_center')"
            v-show="target.isAlignHorizontalCenter.value === true"
          ></ui-input>
        </div>
        <div class="centered-prop layout horizontal center">
          <ui-checkbox class="v-checkbox"
            v-value="target.isAlignVerticalCenter.value"
            v-values="target.isAlignVerticalCenter.values"
            :multi-values="_checkWidgetMulti(target.isAlignVerticalCenter)"
            @change="_onVerticalCenterChecked"
            :title="T('COMPONENT.widget.align_v_center')"
          >Vertical Center</ui-checkbox>
          <span class="flex-1"></span>
          <ui-input
            :value="verticalCenterValue"
            v-values="horizontalCenterValues"
            :multi-values="_checkWidgetMulti(target.isAlignVerticalCenter) && _checkWidgetMulti(verticalCenterValue)"
            @confirm="_onVerticalCenterChanged"
            :title="T('COMPONENT.widget.vertical_center')"
            v-show="target.isAlignVerticalCenter.value === true"
          ></ui-input>
        </div>
      </div>

      <hr/>
    </div>
    
    <ui-prop
      v-prop="target.topMargin"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.bottomMargin"
      :multi-values="multi"
    ></ui-prop>

    <ui-prop
      v-prop="target.leftMargin"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.rightMargin"
      :multi-values="multi"
    ></ui-prop>

    <ui-prop
      v-prop="target.target"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.alignMode"
      :multi-values="multi"
    ></ui-prop>
  `,

  props: {
    target: {
      twoWay: true,
      type: Object,
    },

    multi: {
      type: Boolean,
    }
  },

  computed: {
    horizontalCenterValue() {
      return this._compose(this.target.horizontalCenter, this.target.isAbsoluteHorizontalCenter.value);
    },

    horizontalCenterValues () {
      var values = this.target.isAbsoluteHorizontalCenter.values;
      return values.map((item) => {
        return this._compose(this.target.horizontalCenter, item);
      });
    },

    verticalCenterValue() {
      return this._compose(this.target.verticalCenter, this.target.isAbsoluteVerticalCenter.value);
    },

    topValue () {
      return this._compose(this.target.top, this.target.isAbsoluteTop.value);
    },

    leftValue () {
      return this._compose(this.target.left, this.target.isAbsoluteLeft.value);
    },

    rightValue () {
      return this._compose(this.target.right, this.target.isAbsoluteRight.value);
    },

    bottomValue () {
      return this._compose(this.target.bottom, this.target.isAbsoluteBottom.value);
    },
  },

  methods: {
    T: Editor.T,

    _compose (target, isAbsolute) {
      var value = target.value;
      var values = target.values;
      if (
        this.multi &&
        values.some((item) => {
          return values[0] !== item;
        })
      ) {
        return '-';
      }

      value = value || 0;
      if ( !isAbsolute ) {
        value *= 100;
      }
      let unit = isAbsolute ? 'px' : '%';
      // 为了不让他出现 -0
      if (value === 0) {
        value = +0;
      }
      return '' + value.toFixed(2) + unit;
    },

    _decompose (value) {
      let isAbs;
      if (value.endsWith('%') || value.endsWith('％')) {
        value = value.slice(0, -1);
        isAbs = false;
      }
      else {
        if (value.endsWith('px')) {
          value = value.slice(0, -2);
        }
        isAbs = true;
      }
      value = value === '' ? 0 : parseFloat(value);
      if ( !isAbs ) {
        value /= 100;
      }
      return {
        value: value,
        isAbsolute: isAbs
      };
    },

    _changeMargin (value, valProp, absProp) {
      if (this.target) {
        let res = this._decompose(value);
        if (isNaN(res.value)) {
          Editor.warn('Invalid input: "%s"', value);
          return false;
        }
        if (res.value !== this.target[valProp].value) {
          this.target[valProp].value = res.value;
        }
        if (res.isAbsolute !== this.target[absProp].value) {
          this.target[absProp].value = res.isAbsolute;
        }
      }
      return true;
    },

    _changePropValue (prop, propAbs) {
      Editor.UI.fire(this.$el, 'target-change', {
        bubbles: true,
        detail: {
          type: prop.type,
          path: prop.path,
          value: prop.value,
        }
      });
      Editor.UI.fire(this.$el, 'target-change', {
        bubbles: true,
        detail: {
          type: propAbs.type,
          path: propAbs.path,
          value: propAbs.value,
        }
      });
      Editor.UI.fire(this.$el, 'target-confirm', {
        bubbles: true,
        detail: {
          type: prop.type,
          path: prop.path,
          value: prop.value,
        }
      });
    },

    _onHorizontalCenterChanged (event) {
      this._changeMargin(event.detail.value, 'horizontalCenter', 'isAbsoluteHorizontalCenter');
      this._changePropValue(this.target.horizontalCenter, this.target.isAbsoluteHorizontalCenter);
    },

    _onVerticalCenterChanged (event) {
      this._changeMargin(event.detail.value, 'verticalCenter', 'isAbsoluteVerticalCenter');
      this._changePropValue(this.target.verticalCenter, this.target.isAbsoluteVerticalCenter);
    },

    _onTopChanged (event) {
      this._changeMargin(event.detail.value, 'top', 'isAbsoluteTop');
      this._changePropValue(this.target.top, this.target.isAbsoluteTop);
    },

    _onLeftChanged (event) {
      this._changeMargin(event.detail.value, 'left', 'isAbsoluteLeft');
      this._changePropValue(this.target.left, this.target.isAbsoluteLeft);
    },

    _onRightChanged (event) {
      this._changeMargin(event.detail.value, 'right', 'isAbsoluteRight');
      this._changePropValue(this.target.right, this.target.isAbsoluteRight);
    },

    _onBottomChanged (event) {
      this._changeMargin(event.detail.value, 'bottom', 'isAbsoluteBottom');
      this._changePropValue(this.target.bottom, this.target.isAbsoluteBottom);
    },

    // 属性改变时，关联项目立刻刷新 (否则要等 100ms)

    _onLeftRightChecked (event) {
      if (
        event.detail.value &&
        this.target &&
        this.target.isAlignHorizontalCenter.value
      ) {
        this.target.isAlignHorizontalCenter.value = false;
      }
    },

    _onTopBottomChecked (event) {
      if (
        event.detail.value &&
        this.target &&
        this.target.isAlignVerticalCenter.value
      ) {
        this.target.isAlignVerticalCenter.value = false;
      }
    },

    _onHorizontalCenterChecked (event) {
      if (
        event.detail.value &&
        this.target &&
        (this.target.isAlignLeft.value || this.target.isAlignRight.value)
      ) {
        // 立刻取消左右对齐,否则 inspector 要下 100ms 才会刷新
        this.target.isAlignLeft.value = false;
        this.target.isAlignRight.value = false;
      }
    },

    _onVerticalCenterChecked (event) {
      if (
        event.detail.value &&
        this.target &&
        (this.target.isAlignTop.value || this.target.isAlignBottom.value)
      ) {
        // 立刻取消上下对齐,否则 inspector 要下 100ms 才会刷新
        this.target.isAlignTop.value = false;
        this.target.isAlignBottom.value = false;
      }
    },

    _checkWidgetMulti (target) {
      var values = target.values ? target.values : target;
      var src = values[0];
      return !values.every((item) => {
        return item === src;
      });
    },

    _checkWidgetInput (target, multi) {
      if (multi) {
        return target.values.every((item) => {
          return item === true;
        });
      } else {
        return target.value === true;
      }
    },
  }
});
