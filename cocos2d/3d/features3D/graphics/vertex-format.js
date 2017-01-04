cc3d.extend(cc3d, function () {
    'use strict';

    var _typeSize = [];
    _typeSize[cc3d.ELEMENTTYPE_INT8] = 1;
    _typeSize[cc3d.ELEMENTTYPE_UINT8] = 1;
    _typeSize[cc3d.ELEMENTTYPE_INT16] = 2;
    _typeSize[cc3d.ELEMENTTYPE_UINT16] = 2;
    _typeSize[cc3d.ELEMENTTYPE_INT32] = 4;
    _typeSize[cc3d.ELEMENTTYPE_UINT32] = 4;
    _typeSize[cc3d.ELEMENTTYPE_FLOAT32] = 4;

    /**
     * @name cc3d.VertexFormat
     * @class A vertex format is a descriptor that defines the layout of vertex data inside
     * a {@link cc3d.VertexBuffer}.
     * @description Returns a new cc3d.VertexFormat object.
     * @param {cc3d.GraphicsDevice} graphicsDevice The graphics device used to manage this vertex format.
     * @param {Object[]} description An array of vertex attribute descriptions.
     * @param {Number} description[].semantic The meaning of the vertex element. This is used to link
     * the vertex data to a shader input. Can be:
     * <ul>
     *     <li>cc3d.SEMANTIC_POSITION</li>
     *     <li>cc3d.SEMANTIC_NORMAL</li>
     *     <li>cc3d.SEMANTIC_TANGENT</li>
     *     <li>cc3d.SEMANTIC_BLENDWEIGHT</li>
     *     <li>cc3d.SEMANTIC_BLENDINDICES</li>
     *     <li>cc3d.SEMANTIC_COLOR</li>
     *     <li>cc3d.SEMANTIC_TEXCOORD0</li>
     *     <li>cc3d.SEMANTIC_TEXCOORD1</li>
     *     <li>cc3d.SEMANTIC_TEXCOORD2</li>
     *     <li>cc3d.SEMANTIC_TEXCOORD3</li>
     *     <li>cc3d.SEMANTIC_TEXCOORD4</li>
     *     <li>cc3d.SEMANTIC_TEXCOORD5</li>
     *     <li>cc3d.SEMANTIC_TEXCOORD6</li>
     *     <li>cc3d.SEMANTIC_TEXCOORD7</li>
     * </ul>
     * If vertex data has a meaning other that one of those listed above, use the user-defined
     * semantics: cc3d.SEMANTIC_ATTR0 to cc3d.SEMANTIC_ATTR15.
     * @param {Number} description[].components The number of components of the vertex attribute.
     * Can be 1, 2, 3 or 4.
     * @param {Number} description[].type The data type of the attribute. Can be:
     * <ul>
     *     <li>cc3d.ELEMENTTYPE_INT8</li>
     *     <li>cc3d.ELEMENTTYPE_UINT8</li>
     *     <li>cc3d.ELEMENTTYPE_INT16</li>
     *     <li>cc3d.ELEMENTTYPE_UINT16</li>
     *     <li>cc3d.ELEMENTTYPE_INT32</li>
     *     <li>cc3d.ELEMENTTYPE_UINT32</li>
     *     <li>cc3d.ELEMENTTYPE_FLOAT32</li>
     * </ul>
     * @param {Boolean} description[].normalize If true, vertex attribute data will be mapped from a
     * 0 to 255 range down to 0 to 1 when fed to a shader. If false, vertex attribute data is left
     * unchanged. If this property is unspecified, false is assumed.
     * @example
     * // Specify 3-component positions (x, y, z)
     * var vertexFormat = new cc3d.VertexFormat(graphicsDevice, [
     *     { semantic: cc3d.SEMANTIC_POSITION, components: 3, type: cc3d.ELEMENTTYPE_FLOAT32 },
     * ]);
     * @example
     * // Specify 2-component positions (x, y), a texture coordinate (u, v) and a vertex color (r, g, b, a)
     * var vertexFormat = new cc3d.VertexFormat(graphicsDevice, [
     *     { semantic: cc3d.SEMANTIC_POSITION, components: 2, type: cc3d.ELEMENTTYPE_FLOAT32 },
     *     { semantic: cc3d.SEMANTIC_TEXCOORD0, components: 2, type: cc3d.ELEMENTTYPE_FLOAT32 },
     *     { semantic: cc3d.SEMANTIC_COLOR, components: 4, type: cc3d.ELEMENTTYPE_UINT8, normalize: true }
     * ]);
     * @author Will Eastcott
     */
    var VertexFormat = function (graphicsDevice, description) {
        var i, len, element;

        this.elements = [];
        this.hasUv0 = false;
        this.hasUv1 = false;
        this.hasColor = false;

        this.size = 0;
        for (i = 0, len = description.length; i < len; i++) {
            var elementDesc = description[i];
            element = {
                name: elementDesc.semantic,
                offset: 0,
                stride: 0,
                stream: -1,
                scopeId: graphicsDevice.scope.resolve(elementDesc.semantic),
                dataType: elementDesc.type,
                numComponents: elementDesc.components,
                normalize: (elementDesc.normalize === undefined) ? false : elementDesc.normalize,
                size: elementDesc.components * _typeSize[elementDesc.type]
            };
            this.elements.push(element);

            this.size += element.size;
            if (elementDesc.semantic === cc3d.SEMANTIC_TEXCOORD0) {
                this.hasUv0 = true;
            } else if (elementDesc.semantic === cc3d.SEMANTIC_TEXCOORD1) {
                this.hasUv1 = true;
            } else if (elementDesc.semantic === cc3d.SEMANTIC_COLOR) {
                this.hasColor = true;
            }
        }

        var offset = 0;
        for (i = 0, len = this.elements.length; i < len; i++) {
            element = this.elements[i];

            element.offset = offset;
            element.stride = this.size;

            offset += element.size;
        }
    };

    return {
        VertexFormat: VertexFormat
    };
}());
