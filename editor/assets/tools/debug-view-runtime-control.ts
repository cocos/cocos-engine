import { instantiate, math, Toggle, TextureCube, _decorator, Component, Button, labelAssembler, game, director, Node, Scene, renderer, CameraComponent, Label, ForwardPipeline, RichText } from 'cc';
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
    start() {
        // single
        let x = -400, y = 300, height = 20, currentItem = 0;
        for (let i = 0; i < this.strSingle.length; i++, currentItem++) {
            if (i === this.strSingle.length >> 1) {
                x = -200; y = 300;
                currentItem = 0;
            }
            const newNode = i ? instantiate(this.singleModeToggle) : this.singleModeToggle;
            newNode.setPosition(x, y - height * currentItem, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = this.singleModeToggle.parent;

            const textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strSingle[i];

            newNode.on(Toggle.EventType.TOGGLE, this.toggleSingleMode, this);

            this.singleModeToggleList[i] = newNode;
        }

        // restore button
        x = 0; y = 200;
        this.EnableAllCompositeModeButton.setPosition(x + 25, y + 100, 0.0);
        this.EnableAllCompositeModeButton.setScale(0.5, 0.5, 0.5);
        this.EnableAllCompositeModeButton.on(Button.EventType.CLICK, this.enableAllCompositeMode, this);

        // misc
        const miscNode = this.node.getChildByName('MiscMode');
        x = 0; y = 270; height = 20;
        for (let i = 0; i < this.strMisc.length; i++) {
            const newNode = instantiate(this.compositeModeToggle);
            newNode.setPosition(x, y - height * i, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = miscNode;
            const textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strMisc[i];
            const toggleComponent = newNode.getComponent(Toggle);
            toggleComponent.isChecked = i ? true : false;
            newNode.on(Toggle.EventType.TOGGLE, i ? this.toggleLightingWithAlbedo : this.toggleCSMColoration, this);
            this.miscModeToggleList[i] = newNode;
        }

        // composite
        x = 0; y = 130; height = 20;
        for (let i = 0; i < this.strComposite.length; i++) {
            const newNode = i ? instantiate(this.compositeModeToggle) : this.compositeModeToggle;
            newNode.setPosition(x, y - height * i, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = this.compositeModeToggle.parent;

            const textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strComposite[i];

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

    onLoad() {
    }
    update(deltaTime: number) {
    }
}
