cc3d.extend(cc3d, function () {
    'use strict';

    /**
     * @name cc3d.IndexBuffer
     * @class An index buffer is the mechanism via which the application specifies primitive
     * index data to the graphics hardware.
     * @description Creates a new index buffer.
     * @example
     * // Create an index buffer holding 3 16-bit indices
     * // The buffer is marked as static, hinting that the buffer will never be modified
     * var indexBuffer = new cc3d.IndexBuffer(graphicsDevice, cc3d.INDEXFORMAT_UINT16, 3, cc3d.BUFFER_STATIC);
     * @param {cc3d.GraphicsDevice} graphicsDevice The graphics device used to manage this index buffer.
     * @param {Number} format The type of each index to be stored in the index buffer (see cc3d.INDEXFORMAT_*).
     * @param {Number} numIndices The number of indices to be stored in the index buffer.
     * @param {Number} [usage] The usage type of the vertex buffer (see cc3d.BUFFER_*).
     */
    var IndexBuffer = function (graphicsDevice, format, numIndices, usage) {
        // Initialize optional parameters
        // By default, index buffers are static (better for performance since buffer data can be cached in VRAM)
        this.usage = usage || cc3d.BUFFER_STATIC;

        // Store the index format
        this.format = format;

        // Store the number of indices
        this.numIndices = numIndices;

        // Create the WebGL buffer
        this.device = graphicsDevice;

        var gl = this.device.gl;
        this.bufferId = gl.createBuffer();

        // Allocate the storage
        var bytesPerIndex;
        if (format === cc3d.INDEXFORMAT_UINT8) {
            bytesPerIndex = 1;
            this.glFormat = gl.UNSIGNED_BYTE;
        } else if (format === cc3d.INDEXFORMAT_UINT16) {
            bytesPerIndex = 2;
            this.glFormat = gl.UNSIGNED_SHORT;
        } else if (format === cc3d.INDEXFORMAT_UINT32) {
            bytesPerIndex = 4;
            this.glFormat = gl.UNSIGNED_INT;
        }
        this.bytesPerIndex = bytesPerIndex;

        var numBytes = this.numIndices * bytesPerIndex;
        this.storage = new ArrayBuffer(numBytes);

        graphicsDevice._vram.ib += numBytes;
    };

    IndexBuffer.prototype = {
        /**
         * @function
         * @name cc3d.IndexBuffer#destroy
         * @description Frees resources associated with this index buffer.
         */
        destroy: function () {
            var gl = this.device.gl;
            gl.deleteBuffer(this.bufferId);
            this.device._vram.ib -= this.storage.byteLength;
        },

        /**
         * @function
         * @name cc3d.IndexBuffer#getFormat
         * @description Returns the data format of the specified index buffer.
         * @returns {Number} The data format of the specified index buffer (see cc3d.INDEXFORMAT_*).
         */
        getFormat: function () {
            return this.format;
        },

        /**
         * @function
         * @name cc3d.IndexBuffer#getNumIndices
         * @description Returns the number of indices stored in the specified index buffer.
         * @returns {Number} The number of indices stored in the specified index buffer.
         */
        getNumIndices: function () {
            return this.numIndices;
        },

        /**
         * @function
         * @name cc3d.IndexBuffer#lock
         * @description Gives access to the block of memory that stores the buffer's indices.
         * @returns {ArrayBuffer} A contiguous block of memory where index data can be written to.
         */
        lock: function () {
            return this.storage;
        },

        /**
         * @function
         * @name cc3d.IndexBuffer#unlock
         * @description Signals that the block of memory returned by a call to the lock function is
         * ready to be given to the graphics hardware. Only unlocked index buffers can be set on the
         * currently active device.
         */
        unlock: function () {
            // Upload the new index data
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

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferId);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.storage, glUsage);
        }
    };

    return {
        IndexBuffer: IndexBuffer
    };
}());
