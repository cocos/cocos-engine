class DOMRect {
	constructor(x, y, width, height) {
		this.x = x ? x : 0;
		this.y = y ? y : 0;
		this.width = width ? width : 0;
		this.height = height ? height : 0;
		this.left = this.x;
		this.top = this.y;
		this.right = this.x + this.width;
		this.bottom = this.y + this.height;
	}
}

module.exports = DOMRect;
