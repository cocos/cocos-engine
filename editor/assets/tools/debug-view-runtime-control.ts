import { Color, Canvas, UITransform, instantiate, math, Toggle, TextureCube, _decorator, Component, Button, labelAssembler, game, director, Node, Scene, renderer, CameraComponent, Label, ForwardPipeline, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('internal.DebugViewRuntimeControl')
export class DebugViewRuntimeControl extends Component {
    @property(Node)
    compositeModeToggle: Node | null = null;
    @property(Node)
    singleModeToggle: Node | null = null;
    @property(Node)
    EnableAllCompositeModeButton: Node | null = null;
	_single: number = 0;

    private strSingle: string[] = [
        'No Single Debug',
        'Vertex Color',
        'Vertex Normal',
        'Vertex Tangent',
        'World Position',
        'Vertex Mirror',
        'Face Side',
        'UV0',
        'UV1',
        'UV Lightmap',
        'Project Depth',
        'Linear Depth',

        'Fragment Normal',
        'Fragment Tangent',
        'Fragment Binormal',
        'Base Color',
        'Diffuse Color',
        'Specular Color',
        'Transparency',
        'Metallic',
        'Roughness',
        'Specular Intensity',
        'IOR',

        'Direct Diffuse',
        'Direct Specular',
        'Direct All',
        'Env Diffuse',
        'Env Specular',
        'Env All',
        'Emissive',
        'Light Map',
        'Shadow',
        'AO',

        'Fresnel',
        'Direct Transmit Diffuse',
        'Direct Transmit Specular',
        'Env Transmit Diffuse',
        'Env Transmit Specular',
        'Transmit All',
        'Direct Internal Specular',
        'Env Internal Specular',
        'Internal All',

        'Fog',
    ];
    private strComposite: string[] = [
        'Direct Diffuse',
        'Direct Specular',
        'Env Diffuse',
        'Env Specular',
        'Emissive',
        'Light Map',
        'Shadow',
        'AO',

        'Normal Map',
        'Fog',

        'Tone Mapping',
        'Gamma Correction',

        'Fresnel',
        'Transmit Diffuse',
        'Transmit Specular',
        'Internal Specular',
        'TT',
    ];
    private strMisc: string[] = [
        'CSM Layer Coloration',
        'Lighting With Albedo',
    ];

    private compositeModeToggleList: Node[] = [];
    private singleModeToggleList: Node[] = [];
    private miscModeToggleList: Node[] = [];
    private textComponentList: RichText[] = [];
    private labelComponentList: Label[] = [];
    private textContentList: string[] = [];
    private hideButtonLabel: Label;
    start() {
        // get canvas resolution
        const canvas = this.node.parent.getComponent(Canvas);
        if (!canvas) {
            console.error('debug-view-runtime-control should be child of Canvas');
            return;
        }

        const uiTransform = this.node.parent.getComponent(UITransform);
        const halfScreenWidth = uiTransform.width * 0.5;
        const halfScreenHeight = uiTransform.height * 0.5;

        let x = -halfScreenWidth + halfScreenWidth * 0.1, y = halfScreenHeight - halfScreenHeight * 0.1;
        const width = 200, height = 20;

        // new nodes
        const miscNode = this.node.getChildByName('MiscMode');
        const buttonNode = instantiate(miscNode);
        buttonNode.parent = this.node;
        buttonNode.name = 'Buttons';
        const titleNode = instantiate(miscNode);
        titleNode.parent = this.node;
        titleNode.name = 'Titles';

        // title
        for (let i = 0; i < 2; i++) {
            const newLabel = instantiate(this.EnableAllCompositeModeButton.getChildByName('Label'));
            newLabel.setPosition(x + (i > 0 ? 50 + width * 2 : 150), y, 0.0);
            newLabel.setScale(0.75, 0.75, 0.75);
            newLabel.parent = titleNode;
            const labelComponent = newLabel.getComponent(Label);
            labelComponent.string = i ? '----------Composite Mode----------' : '----------Single Mode----------';
            labelComponent.color = Color.WHITE;
            labelComponent.overflow = 0;
            this.labelComponentList[this.labelComponentList.length] = labelComponent;
        }

        y -= height;
        // single
        let currentRow = 0;
        for (let i = 0; i < this.strSingle.length; i++, currentRow++) {
            if (i === this.strSingle.length >> 1) {
                x += width;
                currentRow = 0;
            }
            const newNode = i ? instantiate(this.singleModeToggle) : this.singleModeToggle;
            newNode.setPosition(x, y - height * currentRow, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = this.singleModeToggle.parent;

            const textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strSingle[i];
            this.textComponentList[this.textComponentList.length] = textComponent;
            this.textContentList[this.textContentList.length] = textComponent.string;

            newNode.on(Toggle.EventType.TOGGLE, this.toggleSingleMode, this);

            this.singleModeToggleList[i] = newNode;
        }

        x += width;
        // buttons
        this.EnableAllCompositeModeButton.setPosition(x + 15, y, 0.0);
        this.EnableAllCompositeModeButton.setScale(0.5, 0.5, 0.5);
        this.EnableAllCompositeModeButton.on(Button.EventType.CLICK, this.enableAllCompositeMode, this);
        this.EnableAllCompositeModeButton.parent = buttonNode;
        let labelComponent = this.EnableAllCompositeModeButton.getComponentInChildren(Label);
        this.labelComponentList[this.labelComponentList.length] = labelComponent;

        const changeColorButton = instantiate(this.EnableAllCompositeModeButton);
        changeColorButton.setPosition(x + 90, y, 0.0);
        changeColorButton.setScale(0.5, 0.5, 0.5);
        changeColorButton.on(Button.EventType.CLICK, this.changeTextColor, this);
        changeColorButton.parent = buttonNode;
        labelComponent = changeColorButton.getComponentInChildren(Label);
        labelComponent.string = 'TextColor';
        this.labelComponentList[this.labelComponentList.length] = labelComponent;

        const HideButton = instantiate(this.EnableAllCompositeModeButton);
        HideButton.setPosition(x + 200, y, 0.0);
        HideButton.setScale(0.5, 0.5, 0.5);
        HideButton.on(Button.EventType.CLICK, this.hideUI, this);
        HideButton.parent = this.node.parent;
        labelComponent = HideButton.getComponentInChildren(Label);
        labelComponent.string = 'Hide UI';
        this.labelComponentList[this.labelComponentList.length] = labelComponent;
        this.hideButtonLabel = labelComponent;

        // misc
        y -= 40;
        for (let i = 0; i < this.strMisc.length; i++) {
            const newNode = instantiate(this.compositeModeToggle);
            newNode.setPosition(x, y - height * i, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = miscNode;

            const textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strMisc[i];
            this.textComponentList[this.textComponentList.length] = textComponent;
            this.textContentList[this.textContentList.length] = textComponent.string;

            const toggleComponent = newNode.getComponent(Toggle);
            toggleComponent.isChecked = i ? true : false;
            newNode.on(Toggle.EventType.TOGGLE, i ? this.toggleLightingWithAlbedo : this.toggleCSMColoration, this);
            this.miscModeToggleList[i] = newNode;
        }

        // composite
        y -= 150;
        for (let i = 0; i < this.strComposite.length; i++) {
            const newNode = i ? instantiate(this.compositeModeToggle) : this.compositeModeToggle;
            newNode.setPosition(x, y - height * i, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = this.compositeModeToggle.parent;

            const textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strComposite[i];
            this.textComponentList[this.textComponentList.length] = textComponent;
            this.textContentList[this.textContentList.length] = textComponent.string;

            newNode.on(Toggle.EventType.TOGGLE, this.toggleCompositeMode, this);

            this.compositeModeToggleList[i] = newNode;
        }
    }

    isTextMatched(textUI, textDescription) : boolean {
        let tempText = new String(textUI);
        const findIndex = tempText.search('>');
        if (findIndex === -1) {
            return textUI === textDescription;
        } else {
            tempText = tempText.substr(findIndex + 1);
            tempText = tempText.substr(0, tempText.search('<'));
            return tempText === textDescription;
        }
    }
    toggleSingleMode(toggle: Toggle) {
        const debugView = director.root!.debugView;
        const textComponent = toggle.getComponentInChildren(RichText);
        for (let i = 0; i < this.strSingle.length; i++) {
            if (this.isTextMatched(textComponent.string, this.strSingle[i])) {
                debugView.singleMode = i;
            }
        }
    }
    toggleCompositeMode(toggle: Toggle) {
        const debugView = director.root!.debugView;
        const textComponent = toggle.getComponentInChildren(RichText);
        for (let i = 0; i < this.strComposite.length; i++) {
            if (this.isTextMatched(textComponent.string, this.strComposite[i])) {
                debugView.enableCompositeMode(i, toggle.isChecked);
            }
        }
    }
    toggleLightingWithAlbedo(toggle: Toggle) {
        const debugView = director.root!.debugView;
        debugView.lightingWithAlbedo = toggle.isChecked;
    }
    toggleCSMColoration(toggle: Toggle) {
        const debugView = director.root!.debugView;
        debugView.csmLayerColoration = toggle.isChecked;
    }
    enableAllCompositeMode(button: Button) {
        const debugView = director.root!.debugView;
        debugView.enableAllCompositeMode(true);
        for (let i = 0; i < this.compositeModeToggleList.length; i++) {
            const toggleComponent = this.compositeModeToggleList[i].getComponent(Toggle);
            toggleComponent.isChecked = true;
        }

        let toggleComponent = this.miscModeToggleList[0].getComponent(Toggle);
        toggleComponent.isChecked = false;
        debugView.csmLayerColoration = false;
        toggleComponent = this.miscModeToggleList[1].getComponent(Toggle);
        toggleComponent.isChecked = true;
        debugView.lightingWithAlbedo = true;
    }
    hideUI(button: Button) {
        const titleNode = this.node.getChildByName('Titles');
        const activeValue = !titleNode.active;
        this.singleModeToggleList[0].parent.active = activeValue;
        this.miscModeToggleList[0].parent.active = activeValue;
        this.compositeModeToggleList[0].parent.active = activeValue;
        this.EnableAllCompositeModeButton.parent.active = activeValue;
        titleNode.active = activeValue;
        this.hideButtonLabel.string = activeValue ? 'Hide UI' : 'Show UI';
    }

    private _currentColorIndex = 0;
    private strColor: string[] = [
        '<color=#ffffff>',
        '<color=#000000>',
        '<color=#ff0000>',
        '<color=#00ff00>',
        '<color=#0000ff>',
    ];
    private color: Color[] = [
        Color.WHITE,
        Color.BLACK,
        Color.RED,
        Color.GREEN,
        Color.BLUE,
    ];
    changeTextColor(button: Button) {
        this._currentColorIndex++;
        if (this._currentColorIndex >= this.strColor.length) {
            this._currentColorIndex = 0;
        }
        for (let i = 0; i < this.textComponentList.length; i++) {
            this.textComponentList[i].string = this.strColor[this._currentColorIndex] + this.textContentList[i] + '</color>';
        }
        for (let i = 0; i < this.labelComponentList.length; i++) {
            this.labelComponentList[i].color = this.color[this._currentColorIndex];
        }
    }

    onLoad() {
    }
    update(deltaTime: number) {
    }
}
