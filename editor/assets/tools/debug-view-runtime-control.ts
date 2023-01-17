import { Canvas, instantiate, math, Toggle, TextureCube, _decorator, Component, Button, labelAssembler, game, director, Node, Scene, renderer, CameraComponent, Label, ForwardPipeline, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('debugViewRuntimeControl')
export class debugViewRuntimeControl extends Component {
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
        'Direct TRT',
        'Env TRT',
        'TRT All',

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
        'TRT',
    ];
    private strMisc: string[] = [
        'CSM Layer Coloration',
        'Lighting With Albedo',
    ];

    private compositeModeToggleList: Node[] = [];
    private singleModeToggleList: Node[] = [];
    private miscModeToggleList: Node[] = [];
    private textComponentList: RichText[] = [];
    private textContentList: string[] = [];
    start() {
        // get canvas resolution
        const canvas = this.node.parent.getComponent(Canvas);
        if (!canvas) {
            console.error('debug-view-runtime-control should be child of Canvas');
            return;
        }

        const halfWidth = 960 * 0.5;
        const halfHeight = 640 * 0.5;
        // single
        let x = -halfWidth + halfWidth * 0.1, y = halfHeight - halfHeight * 0.1, height = 20, currentRow = 0;
        for (let i = 0; i < this.strSingle.length; i++, currentRow++) {
            if (i === this.strSingle.length >> 1) {
                x += 200;
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

        // restore button
        x += 200;
        this.EnableAllCompositeModeButton.setPosition(x + 15, y, 0.0);
        this.EnableAllCompositeModeButton.setScale(0.5, 0.5, 0.5);
        this.EnableAllCompositeModeButton.on(Button.EventType.CLICK, this.enableAllCompositeMode, this);
        const changeColorButton = instantiate(this.EnableAllCompositeModeButton);
        changeColorButton.setPosition(x + 90, y, 0.0);
        changeColorButton.setScale(0.5, 0.5, 0.5);
        changeColorButton.on(Button.EventType.CLICK, this.changeTextColor, this);
        changeColorButton.parent = this.EnableAllCompositeModeButton.parent;
        const textComponent = changeColorButton.getComponentInChildren(Label);
        textComponent.string = 'TextColor';

        // misc
        const miscNode = this.node.getChildByName('MiscMode');
        y -= 40; height = 20;
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
        y -= 150; height = 20;
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

    toggleSingleMode(toggle: Toggle) {
        const debugView = director.root!.debugView;
        const textComponent = toggle.getComponentInChildren(RichText);
        for (let i = 0; i < this.strSingle.length; i++) {
            if (textComponent.string === this.strSingle[i]) {
                debugView.singleMode = i;
            }
        }
    }
    toggleCompositeMode(toggle: Toggle) {
        const debugView = director.root!.debugView;
        const textComponent = toggle.getComponentInChildren(RichText);
        for (let i = 0; i < this.strComposite.length; i++) {
            if (textComponent.string === this.strComposite[i]) {
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

    private _currentColorIndex = 0;
    private strColor: string[] = [
        '<color=#ffffff>',
        '<color=#000000>',
        '<color=#ff0000>',
        '<color=#00ff00>',
        '<color=#0000ff>',
    ];
    changeTextColor(button: Button) {
        this._currentColorIndex++;
        if (this._currentColorIndex >= this.strColor.length) {
            this._currentColorIndex = 0;
        }
        for (let i = 0; i < this.textComponentList.length; i++) {
            this.textComponentList[i].string = this.strColor[this._currentColorIndex] + this.textContentList[i] + '</color>';
        }
    }

    onLoad() {
    }
    update(deltaTime: number) {
    }
}
