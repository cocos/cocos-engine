Vue.component('cc-studio-component', {
    template: `
    <ui-prop v-prop="target.type"></ui-prop>

    <div v-show="_isCheckbox()">
      <ui-prop v-prop="target.checkNormalBackFrame"></ui-prop>
      <ui-prop v-prop="target.checkPressedBackFrame"></ui-prop>
      <ui-prop v-prop="target.checkDisableBackFrame"></ui-prop>
      <ui-prop v-prop="target.checkNormalFrame"></ui-prop>
      <ui-prop v-prop="target.checkDisableFrame"></ui-prop>
      <ui-prop v-prop="target.checkInteractable"></ui-prop>
      <ui-prop v-prop="target.isChecked"></ui-prop>
    </div>

    <div v-show="_isTextAtlas()">
      <ui-prop v-prop="target.atlasFrame"></ui-prop>
      <ui-prop v-prop="target.firstChar"></ui-prop>
      <ui-prop v-prop="target.charWidth"></ui-prop>
      <ui-prop v-prop="target.charHeight"></ui-prop>
      <ui-prop v-prop="target.string"></ui-prop>
    </div>

    <div v-show="_isSliderBar()">
      <ui-prop v-prop="target.sliderBackFrame"></ui-prop>
      <ui-prop v-prop="target.sliderBarFrame"></ui-prop>
      <ui-prop v-prop="target.sliderBtnNormalFrame"></ui-prop>
      <ui-prop v-prop="target.sliderBtnPressedFrame"></ui-prop>
      <ui-prop v-prop="target.sliderBtnDisabledFrame"></ui-prop>
      <ui-prop v-prop="target.sliderInteractable"></ui-prop>
      <ui-prop v-prop="target.sliderProgress"></ui-prop>
    </div>

    <div v-show="_isListView()">
      <ui-prop v-prop="target.listInertia"></ui-prop>
      <ui-prop v-prop="target.listDirection"></ui-prop>
      <ui-prop v-prop="target.listVerticalAlign" v-show="_isHList()"></ui-prop>
      <ui-prop v-prop="target.listHorizontalAlign" v-show="_isVList()"></ui-prop>
      <ui-prop v-prop="target.listPadding"></ui-prop>
    </div>
  `,

    props: {
        target: {
            twoWay: true,
            type: Object,
        },
    },

    methods: {
        _isCheckbox() {
            let type = this.target.type.value;
            return type === cc.StudioComponent.ComponentType.CHECKBOX;
        },

        _isTextAtlas() {
            let type = this.target.type.value;
            return type === cc.StudioComponent.ComponentType.TEXT_ATLAS;
        },

        _isSliderBar() {
            let type = this.target.type.value;
            return type === cc.StudioComponent.ComponentType.SLIDER_BAR;
        },

        _isListView() {
            let type = this.target.type.value;
            return type === cc.StudioComponent.ComponentType.LIST_VIEW;
        },

        _isHList() {
            let dir = this.target.listDirection.value;
            return dir === cc.StudioComponent.ListDirection.HORIZONTAL;
        },

        _isVList() {
            let dir = this.target.listDirection.value;
            return dir === cc.StudioComponent.ListDirection.VERTICAL;
        },
    }
});
