$global._touchstartCB = null;
$global._touchcancelCB = null;
$global._touchendCB = null;
$global._touchmoveCB = null;

// HACK: on some devices my.createCanvas is undefined
if (!my.createCanvas) {
	my.createCanvas = my._createCanvas;
}
if (!my.createOffscreenCanvas) {
	my.createOffscreenCanvas = my._createOffscreenCanvas;
}

Page({
	onReady () { },
	onError (err) {
		console.error('error in page: ', err);
	},
	onTouchStart (event) {
		$global._touchstartCB && $global._touchstartCB(event);
	},
	onTouchCancel (event) {
		$global._touchcancelCB && $global._touchcancelCB(event);
	},
	onTouchEnd (event) {
		$global._touchendCB && $global._touchendCB(event);
	},
	onTouchMove (event) {
		$global._touchmoveCB && $global._touchmoveCB(event);
	},
	canvasOnReady () {
		my.createCanvas({
			id:'GameCanvas', 
			success(canvas){
				$global.screencanvas = canvas;
				if (!canvas.addEventListener) {
					// fix: undefined addEventListener
					canvas.addEventListener = function () {}
				}
				$global.__onCanvasCreated();
			},
			fail (err) {
				console.error('failed to init on screen canvas', err)
			}
		});
	}
});
