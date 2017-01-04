cc3d.extend(cc3d, function () {
    'use strict';

    /**
     * @name cc3d.VertexBuffer
     * @class A vertex buffer is the mechanism via which the application specifies vertex
     * data to the graphics hardware.
     * @description Creates a new vertex buffer object.
     * @param {cc3d.GraphicsDevice} graphicsDevice The graphics device used to manage this vertex buffer.
     * @param {cc3d.VertexFormat} format The vertex format of this vertex buffer.
     * @param {Number} numVertices The number of vertices that this vertex buffer will hold.
     * @param {Number} [usage] The usage type of the vertex buffer (see cc3d.BUFFER_*).
     */
    var VertexBuffer = function (graphicsDevice, format, numVertices, usage, initialData) {
        // Initialize optional parameters
        // By default, vertex buffers are static (better for performance since buffer data can be cached in VRAM)
        this.usage = usage || cc3d.BUFFER_STATIC;

        // Store the vertex format
        this.format = format;

        // Store the number of vertices
        this.numVertices = numVertices;

        // Calculate the size
        this.numBytes = format.size * numVertices;
        graphicsDevice._vram.vb += this.numBytes;

        // Create the WebGL vertex buffer object
        this.device = graphicsDevice;

        var gl = this.device.gl;
        this.bufferId = gl.createBuffer();

        // Allocate the storage
        if (initialData && this.setData(initialData)) {
            return;
        } else {
            this.storage = new ArrayBuffer(this.numBytes);
        }
    };

    VertexBuffer.prototype = {
        /**
         * @function
         * @name cc3d.VertexBuffer#destroy
         * @description Frees resources associated with this vertex buffer.
         */
        destroy: function () {
            var gl = this.device.gl;
            gl.deleteBuffer(this.bufferId);
            this.device._vram.vb -= this.storage.byteLength;
        },

        /**
         * @function
         * @name cc3d.VertexBuffer#getFormat
         * @description Returns the data format of the specified vertex buffer.
         * @returns {cc3d.VertexFormat} The data format of the specified vertex buffer.
         */
        getFormat: function () {
            return this.format;
        },

        /**
         * @function
         * @name cc3d.VertexBuffer#getUsage
         * @description Returns the usage type of the specified vertex buffer. This indicates
         * whether the buffer can be modified once and used many times (cc3d.BUFFER_STATIC),
         * modified repeatedly and used many times (cc3d.BUFFER_DYNAMIC) or modified once
         * and used at most a few times (cc3d.BUFFER_STREAM).
         * @returns {Number} The usage type of the vertex buffer (see cc3d.BUFFER_*).
         */
        getUsage: function () {
            return this.usage;
        },

        /**
         * @function
         * @name cc3d.VertexBuffer#getNumVertices
         * @description Returns the number of vertices stored in the specified vertex buffer.
         * @returns {Number} The number of vertices stored in the vertex buffer.
         */
        getNumVertices: function () {
            return this.numVertices;
        },

        /**
         * @function
         * @name cc3d.VertexBuffer#lock
         * @description Returns a mapped memory block representing the content of the vertex buffer.
         * @returns {ArrayBuffer} An array containing the byte data stored in the vertex buffer.
         */
        lock: function () {
            return this.storage;
        },

        /**
         * @function
         * @name cc3d.VertexBuffer#unlock
         * @description Notifies the graphics engine that the client side copy of the vertex buffer's
         * memory can be returned to the control of the graphics driver.
         */
        unlock: function () {
            // Upload the new vertex data
            var gl = this.device.gl;
            var glUsage;
            switch (this.usage) {
                case cc3d.BUFFER_STATIC:
                    glUsage = gl.STATIC_DRAW;
                    break;
                case cc3d.BUFFER_DYNAMIC:
                    glUsage = gl.DYNAMIC_DRAW;
                    break;
                case cc3d.BUFFER_STREAM:
                    glUsage = gl.STREAM_DRAW;
                    break;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
            gl.bufferData(gl.ARRAY_BUFFER, this.storage, glUsage);
        },

        setData: function (data) {
            if (data.byteLength !== this.numBytes) {
                console.error("VertexBuffer: wrong initial data size: expected " + this.numBytes + ", got " + data.byteLength);
                return false;
            }
            this.storage = data;
            this.unlock();
            return true;
        }
    };

    return {
        VertexBuffer: VertexBuffer
    };
}());
