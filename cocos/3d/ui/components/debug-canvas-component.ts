import { Vec3 } from '../../../core/value-types';
import { CanvasComponent } from './canvas-component';

const _worldPos = new Vec3();
export class DebugCanvasComponent extends CanvasComponent{
    constructor (){
        super();
        this._thisOnResized = this.alignWithScreen.bind(this);
    }

    // don't remove
    public onEnable (){
    }

    // don't remove
    public onDisable (){
    }

    public onDestroy (){
        if (CC_EDITOR) {
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.alignWithScreen, this);
        }

        cc.view.off('design-resolution-changed', this._thisOnResized);
    }

    public alignWithScreen (){
        const canvasSize = cc.visibleRect;
        const nodeSize = canvasSize;
        const designSize = cc.view.getDesignResolutionSize();
        const clipTopRight = !this.fitHeight && !this.fitWidth;
        let offsetX = 0;
        let offsetY = 0;
        if (clipTopRight) {
            // offset the canvas to make it in the center of screen
            offsetX = (designSize.width - canvasSize.width) * 0.5;
            offsetY = (designSize.height - canvasSize.height) * 0.5;
        }
        this.node.setPosition(canvasSize.width * 0.5 + offsetX, canvasSize.height * 0.5 + offsetY, 1);

        if (this.node.width !== nodeSize.width) {
            this.node.width = nodeSize.width;
        }

        if (this.node.height !== nodeSize.height) {
            this.node.height = nodeSize.height;
        }

        this.node.getWorldPosition(_worldPos);
        if (this._camera) {
            const size = cc.view.getVisibleSize();
            this._camera.resize(size.width, size.height);
            this._camera.orthoHeight = this._camera.height / 2;
            this._camera.node.setPosition(_worldPos.x, _worldPos.y, 1000);
            this._camera.update();
        }
    }

    // don't remove
    public applySettings (){
    }

}
