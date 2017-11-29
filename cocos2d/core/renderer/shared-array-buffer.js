function SharedArrayBuffer (byteLength) {
    this.byteLength = byteLength;
    this.data = new ArrayBuffer(this.byteLength);
    this._spaces = {
        0: this.byteLength
    };
}

SharedArrayBuffer.prototype = {
    constructor: SharedArrayBuffer,

    _alloc (offset, size) {
        var space = this._spaces[offset];
        if (space && space >= size) {
            // Remove the space
            delete this._spaces[offset];
            if (space > size) {
                var newOffset = offset + size;
                this._spaces[newOffset] = space - size;
            }
            return true;
        }
        else {
            return false;
        }
    },

    request (size) {
        var key, offset, available;
        for (key in this._spaces) {
            offset = parseInt(key);
            available = this._spaces[key];
            if (available >= size && this._alloc(offset, size)) {
                return offset;
            }
        }
        return -1;
    },

    free (offset, size) {
        var spaces = this._spaces;
        var i, key, end;
        // Merge with previous space
        for (key in spaces) {
            i = parseInt(key);
            if (i > offset) {
                break;
            }
            if (i + spaces[key] >= offset) {
                size = size + offset - i;
                offset = i;
                break;
            }
        }

        end = offset + size;
        // Merge with next space 
        if (this._spaces[end]) {
            size += this._spaces[end];
            delete this._spaces[end];
        }

        this._spaces[offset] = size;
    },

    reset () {
        this._spaces = {
            0: this.byteLength
        };
    }
};

module.exports = SharedArrayBuffer;