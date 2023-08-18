
import MaterialVariant from '../../../../../assets/material/material-variant';

const Label = require('../../../../../components/CCLabel');
const LabelShadow = require('../../../../../components/CCLabelShadow');
const LabelOutline = require('../../../../../components/CCLabelOutline');
const Material = require('../../../../../assets/material/CCMaterial');



const UPDATE_CONTENT = 1 << 0;
const UPDATE_FONT = 1 << 1;
const UPDATE_EFFECT = 1 << 2;

export default class NativeTTF {


    init(comp) {
        this.labelMaterial = null;
        this._label = this._renderComp = comp;
        renderer.CustomAssembler.prototype.ctor.call(this);
        comp.node._proxy.setAssembler(this);
        this._layout = new jsb.LabelRenderer();
        this._layout.init(comp);
        this._cfg = new DataView(this._layout._cfg);
        this._layoutInfo = new DataView(this._layout._layout);

        this._cfgFields = "string" == typeof jsb.LabelRenderer._cfgFields ? JSON.parse(jsb.LabelRenderer._cfgFields) : jsb.LabelRenderer._cfgFields;
        this._layoutFields = "string" == typeof jsb.LabelRenderer._layoutFields ? JSON.parse(jsb.LabelRenderer._layoutFields) : jsb.LabelRenderer._layoutFields;
        this._layout.bindNodeProxy(comp.node._proxy);
        this._bindMaterial(comp);
    }


    _setBufferFlag(dv, offset, size,  type, flag){
        if ( type == "int8"  && size == 1) {
            let v = dv.getInt8(offset);
            dv.setInt8(offset, flag | v);
        } else if(type == "int32" && size == 4) {
            let v = dv.getInt32(offset, jsb.__isLittleEndian__);
            dv.setInt32(offset, flag|v , jsb.__isLittleEndian__);
        } else {
            cc.warn("flag storage type should be int8/int32 only, type/size -> " + type+"/"+size + ".");
        }
    }

    _updateCfgFlag(flag) {
        let field = this._cfgFields.updateFlags;
        this._setBufferFlag(this._cfg, field.offset, field.size, field.type, flag);
    }

    _setBufferValue(dv, offset, size, type, value) {
        if(type == "float" && size == 4) {
            dv.setFloat32(offset, value, jsb.__isLittleEndian__);
        } else if(type == "int32" && size == 4) {
            dv.setInt32(offset, value, jsb.__isLittleEndian__);
        } else if (type == "bool" && size == 1) {
            dv.setInt8(offset, !!value ? 1 : 0, jsb.__isLittleEndian__);
        } else if(type == "Color4B" && size == 4) {
            dv.setUint8(offset, value.r);
            dv.setUint8(offset + 1, value.g);
            dv.setUint8(offset + 2, value.b);
            dv.setUint8(offset + 3, value.a);
        } else if(type == "int8" && size == 1) {
            dv.setUint8(offset, value);
        } else {
            cc.warn("dont know how to set value to buffer, type/size -> " + type+"/"+size + ".");
        }
    }

    _setFieldValue(dv, desc, field_name, value) {
        let field = desc[field_name];
        this._setBufferValue(dv, field.offset, field.size, field.type, value);
    }

    _getBufferValue(dv, offset, size, type) {
        if(type == "float" && size == 4) {
            return dv.getFloat32(offset, jsb.__isLittleEndian__);
        } else if(type == "int32" && size == 4) {
            return dv.getInt32(offset, jsb.__isLittleEndian__);
        } else if (type == "bool" && size == 1) {
            return dv.getInt8(offset, jsb.__isLittleEndian__) != 0;
        } else if(type == "Color4B" && size == 4) {
            let r = dv.getUint8(offset);
            let g = dv.getUint8(offset + 1);
            let b = dv.getUint8(offset + 2);
            let a = dv.getUint8(offset + 3);
            return {r, g, b, a};
        } else if(type == "int8" && size == 1) {
            return dv.getUint8(offset);
        } else {
            cc.warn("dont know how to get value from buffer, type/size -> " + type+"/"+size + ".");
            return undefined;
        }
    }

    _getFieldValue(dv, desc, field_name) {
        let field = desc[field_name];
        return this._getBufferValue(dv, field.offset, field.size, field.type);
    }

    _getLayoutValue(field_name) {
        return this._getFieldValue(this._layoutInfo, this._layoutFields, field_name);
    }

    _setLayoutValue(field_name, value) {
        return this._setFieldValue(this._layoutInfo, this._layoutFields, field_name, value);
    }

    _updateCfgFlag_Content() {
        this._updateCfgFlag(UPDATE_CONTENT);
    }

    _updateCfgFlag_Font() {
        this._updateCfgFlag(UPDATE_FONT);
    }
    
    _colorEqual(a, b) {
        return a.r == b.r && a.g == b.g && a.b == b.b && a.a == b.a;
    } 

    _colorToObj(r, g, b, a) {
        return {r, g, b, a};
    }

    setString(str)
    {
        if(str != this._layout.string) {
            this._layout.string = str;
            this._updateCfgFlag_Content();
        }
    }

    setFontPath(path) {
        if(path != this._layout.fontPath) {
            this._layout.fontPath = path;
            this._updateCfgFlag_Font();
        }
    }

    setFontSize(fontSize, fontSizeRetina)
    {
        let oldfontsize = this._getFieldValue(this._cfg, this._cfgFields, "fontSize");
        if(oldfontsize != fontSize) {
            this._setFieldValue(this._cfg, this._cfgFields, "fontSize", fontSize);
            this._setFieldValue(this._cfg, this._cfgFields, "fontSizeRetina", fontSizeRetina);
            this._updateCfgFlag_Font();
        }
    }

    setOutline(outline) {
        let oldOutline = this._getLayoutValue("outlineSize");
        if((oldOutline > 0) != (outline > 0)) {
            this._updateCfgFlag_Font();
        }
        if(oldOutline != outline) {
            this._updateCfgFlag_Content();
            this._setLayoutValue("outlineSize", outline);
        }
    }

    setOutlineColor(color) {
        let oldColor = this._getLayoutValue( "outlineColor");
        if(!this._colorEqual(oldColor, color)) {
            this._setLayoutValue("outlineColor", color);
            this._updateCfgFlag_Content();
        }
    }

    setLineHeight(lineHeight) {
        let oldLineHeight = this._getLayoutValue("lineHeight");
        if(oldLineHeight != lineHeight) {
            this._setLayoutValue("lineHeight", lineHeight);
            this._updateCfgFlag_Content();
        }
    }

    setOverFlow(overflow) {
        let oldValue = this._getLayoutValue("overflow");
        if(oldValue != overflow) {
            this._setLayoutValue("overflow", overflow);
            this._updateCfgFlag_Content();
        }
    }

    setEnableWrap(value) {
        let oldValue = this._getLayoutValue("wrap");
        if(oldValue != value) {
            this._setLayoutValue("wrap", value);
            this._updateCfgFlag_Content();
        }
    }

    setVerticalAlign(value) {
        let oldValue = this._getLayoutValue("valign");
        if(oldValue != value) {
            this._setLayoutValue("valign", value);
            this._updateCfgFlag_Content();
        }
    }

    setHorizontalAlign(value) {
        let oldValue = this._getLayoutValue("halign");
        if(oldValue != value) {
            this._setLayoutValue("halign", value);
            this._updateCfgFlag_Content();
        }
    }

    setContentSize(width, height) {
        let oldWidth = this._getLayoutValue("width");
        let oldHeight = this._getLayoutValue("height");
        if(oldWidth != width || oldHeight != height) {
            this._setLayoutValue("height", height);
            this._setLayoutValue("width", width);
            this._updateCfgFlag_Content();
        }
    }

    setAnchorPoint(x, y) {
        let oldX = this._getLayoutValue("anchorX");
        let oldY = this._getLayoutValue("anchorY");
        if(oldX != x || oldY != y) {
            this._setLayoutValue("anchorX", x);
            this._setLayoutValue("anchorY", y);
            this._updateCfgFlag_Content();
        }
    }

    setColor(color) {
        let oldColor = this._getLayoutValue("color");
        if(!this._colorEqual(oldColor, color)) {
            this._setLayoutValue("color", color);
            this._updateCfgFlag_Content();
        }
    }

    setShadow( x, y, blur) {
        let oldBlur = this._getLayoutValue("shadowBlur");
        let oldX = this._getLayoutValue("shadowX");
        let oldY = this._getLayoutValue("shadowY");
        if((oldBlur > 0) != (blur > 0)) {
            this._updateCfgFlag_Font();
        }
        let updateContent = false;
        if(oldBlur != blur) {
            this._setLayoutValue("shadowBlur", blur);
            updateContent = true;
        }
        if(oldX != x) {
            this._setLayoutValue("shadowX", x);
            updateContent = true;
        }
        if(oldY != y) {
            this._setLayoutValue("shadowY", y);
            updateContent = true;
        }
        if(updateContent) {
            this._updateCfgFlag_Content();
        }
    }

    setShadowColor(color) {
        let oldColor = this._getLayoutValue("shadowColor");
        if(!this._colorEqual(oldColor, color)) {
            this._setLayoutValue("shadowColor", color);
            this._updateCfgFlag_Content();
        }
    }

    setItalic(enabled) {
        let oldItalic = this._getLayoutValue("italic");
        if(oldItalic!=enabled) {
            this._setLayoutValue("italic", enabled);
            this._updateCfgFlag_Content();
        }
    }

    setBold(bold) {
        let oldBold = this._getLayoutValue("bold");
        if(oldBold!=bold) {
            this._setLayoutValue("bold", bold);
            this._updateCfgFlag_Content();
            this._updateCfgFlag_Font(); //enable sdf
        }
    }

    setUnderline(underline)
    {
        let oldBold = this._getLayoutValue("underline");
        if(oldBold != underline) {
            this._setLayoutValue("underline", underline);
            this._updateCfgFlag_Content();
        }
    }

    setSpacingX(x) {
        let oldX = this._getLayoutValue("spaceX");
        if(oldX != x && typeof x == "number"  && ! isNaN(x)) {
            this._setLayoutValue("spaceX", x);
            this._updateCfgFlag_Content();
        }
    }

    updateRenderData(comp) {

        if (!comp._vertsDirty) return;

        if (comp.font && comp.font.nativeUrl) {
            this.setFontPath(cc.assetManager.cacheManager.getCache(comp.font.nativeUrl) || comp.font.nativeUrl);
        }
        let layout = this._layout;
        let c = comp.node.color;
        let node = comp.node;
        let retinaSize = comp.fontSize;

        this.setString(comp.string);
        this.setFontSize(comp.fontSize, retinaSize / 72 * comp.fontSize);
        this.setLineHeight(comp.lineHeight);
        this.setEnableWrap(comp.enableWrapText);
        this.setItalic(comp.enableItalic);
        this.setUnderline(comp.enableUnderline);
        this.setBold(comp.enableBold);
        this.setOverFlow(comp.overflow);
        this.setVerticalAlign(comp.verticalAlign);
        this.setHorizontalAlign(comp.horizontalAlign);
        this.setSpacingX(comp.spacingX);
        this.setContentSize(node.getContentSize().width, node.getContentSize().height);
        this.setAnchorPoint(node.anchorX, node.anchorY);
        this.setColor(this._colorToObj(c.getR(), c.getG(), c.getB(), Math.ceil(c.getA() * node.opacity / 255)));


        let shadow = node.getComponent(cc.LabelShadow);
        if (shadow && shadow.enabled) {
            let shadowColor = shadow.color;
            this.setShadow(shadow.offset.x, shadow.offset.y, shadow.blur);
            this.setShadowColor(this._colorToObj(shadowColor.getR(), shadowColor.getG(), shadowColor.getB(), Math.ceil(shadowColor.getA() * node.opacity / 255)));
        } else {
            this.setShadow(0, 0, -1);
        }

        this._updateTTFMaterial(comp);
        
        layout.render();
        //comp._vertsDirty = false;
    }

    _bindMaterial(comp) {
        let material = this.labelMaterial;
        if(!material) {
            material = MaterialVariant.createWithBuiltin("2d-label", comp);
            this.labelMaterial = material;
        }
        return material;
    }

    _updateTTFMaterial(comp) {
        let material = this._bindMaterial(comp)
        let node = this._label.node;
        let layout = this._layout;
        let outline = node.getComponent(cc.LabelOutline);
        let outlineSize = 0;
        if (outline && outline.enabled && outline.width > 0) {
            outlineSize = Math.max(Math.min(outline.width / 10, 0.4), 0.1);
            let c = outline.color;
            this.setOutlineColor(this._colorToObj(c.getR(), c.getG(), c.getB(), Math.ceil(c.getA() * node.opacity / 255)));
        }
        this.setOutline(outlineSize);
        material.define('CC_USE_MODEL', true);
        material.define('USE_TEXTURE_ALPHAONLY', true);
        material.define('USE_SDF', outlineSize > 0.0 || comp.enableBold );
        material.define('USE_SDF_EXTEND', comp.enableBold ? 1 : 0);
        if (material.getDefine('CC_SUPPORT_standard_derivatives') !== undefined && cc.sys.glExtension('OES_standard_derivatives')) {
            material.define('CC_SUPPORT_standard_derivatives', true);
        }
        layout.setEffect(material.effect._nativeObj);
    }

    fillBuffers (comp, renderer) {
        this._layout.render();
    }
    getVfmt() {
    }
}