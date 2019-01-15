import { Root } from '../../core/root';
import { RenderView } from '../../pipeline/render-view';
import { RenderScene } from '../scene/render-scene';
import { UIWidget } from './ui-widget';

export class UI {

    public get root (): Root {
        return this._root;
    }

    public get scene (): RenderScene {
        return this._scene;
    }

    private _root: Root;
    private _scene: RenderScene;
    private _widgets: UIWidget[] = [];

    constructor (root: Root) {
        this._root = root;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });
    }

    public initialize (): boolean {
        return true;
    }

    public destroy () {
        this.destroyWidgets();
    }

    public render (view: RenderView) {

    }

    public createWidget<T extends UIWidget> (clazz: new () => T): T {
        const widget = new clazz();
        this._widgets.push(widget);
        return widget;
    }

    public destroyWidget (widget: UIWidget) {
        for (let i = 0; i < this._widgets.length; ++i) {
            if (this._widgets[i] === widget) {
                this._widgets.splice(i);
                return;
            }
        }
    }

    public destroyWidgets () {
        this._widgets = [];
    }
}
