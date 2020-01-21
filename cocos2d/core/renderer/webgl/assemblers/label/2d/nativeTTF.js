import RenderBuffer from '../../../../../../renderer/gfx/render-buffer';


const Label = require('../../../../../components/CCLabel');
const LabelShadow = require('../../../../../components/CCLabelShadow');
const LabelOutline = require('../../../../../components/CCLabelOutline');


export default class NativeTTF {


    init(comp) {
        this._label = comp;
        this._extendNative();
        comp.node._proxy.setAssembler(this);
        this._layout.bindNodeProxy(comp.node._proxy);
    }

    _extendNative() {
        renderer.CustomAssembler.prototype.ctor.call(this);
        this._layout = new jsb.LabelRenderer();
    }

    updateRenderData(comp) {

        if (!comp._vertsDirty) return;

        if (comp.font && comp.font.nativeUrl) {
            this._layout.setFontPath(comp.font.nativeUrl);
        }
        let layout = this._layout;
        let c = comp.node.color;
        let node = comp.node;

        let retinaSize = comp.fontSize;
        //TODO: retina font
        // since system font does not support this feature for now
        /*
        let node_camera = cc.Camera.findCamera(node);
        if (true && node_camera) {
            let camera = node_camera._camera;
            let canvas_width = cc.game.canvas.width;
            let canvas_height = cc.game.canvas.height;

            let origin = new cc.Vec3(0, 0, 0);
            let ref = new cc.Vec3(72, 72, 0);
            node.convertToWorldSpaceAR(origin, origin);
            node.convertToWorldSpaceAR(ref, ref);
            camera.worldToScreen(origin, origin, canvas_width, canvas_height);
            camera.worldToScreen(ref, ref, canvas_width, canvas_height);
            retinaSize = ref.sub(origin).mag();
        }
        */

        layout.setString(comp.string);
        layout.setFontSize(comp.fontSize, retinaSize / 72 * comp.fontSize);
        layout.setLineHeight(comp.lineHeight);
        layout.setEnableWrap(comp.enableWrapText);
        layout.setItalic(comp.enableItalic);
        layout.setUnderline(comp.enableUnderline);
        layout.setBold(comp.enableBold);
        layout.setOverFlow(comp.overflow);
        layout.setVerticalAlign(comp.verticalAlign);
        layout.setHorizontalAlign(comp.horizontalAlign);
        layout.setContentSize(node.getContentSize().width, node.getContentSize().height);
        layout.setAnchorPoint(node.anchorX, node.anchorY);
        layout.setColor(c.getR(), c.getG(), c.getB(), Math.ceil(c.getA() * node.opacity / 255));


        let shadow = node.getComponent(cc.LabelShadow);
        if (shadow && shadow.enabled) {
            let shadowColor = shadow.color;
            layout.setShadow(shadow.offset.x, shadow.offset.y, shadow.blur);
            layout.setShadowColor(shadowColor.getR(), shadowColor.getG(), shadowColor.getB(), Math.ceil(shadowColor.getA() * node.opacity / 255));
        } else {
            layout.setShadow(0, 0, -1);
        }

        let material = comp.getMaterial(0);
        if(material) {
            this._updateTTFMaterial(material, comp);
        }

        layout.render();
    }

    _updateTTFMaterial(material, comp) {
        
        let node = this._label.node;
        let layout = this._layout;
        let outline = node.getComponent(cc.LabelOutline);
        let outlineSize = 0;
        if (outline && outline.enabled && outline.width > 0) {
            outlineSize = Math.max(Math.min(outline.width / 10, 0.4), 0.1);
            let c = outline.color;
            layout.setOutlineColor(c.getR(), c.getG(), c.getB(), Math.ceil(c.getA() * node.opacity / 255));
        }
        layout.setOutline(outlineSize);
        material.define('CC_USE_MODEL', true);
        material.define('USE_TEXTURE_ALPHAONLY', true);
        material.define('USE_SDF', outlineSize > 0.0 || comp.enableBold );
        material.define('USE_SDF_EXTEND', comp.enableBold ? 1 : 0);
        layout.setEffect(material.effect._nativeObj);
    }

    fillBuffers (comp, renderer) {
        this._layout.render();
    }
    getVfmt () {
    }
}