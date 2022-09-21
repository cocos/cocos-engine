var touchstartCB;
var touchcancelCB;
var touchendCB;
var touchmoveCB;

function handleTouchEvent (event) {
	if (my.isIDE) {
		return;
	}
	let changedTouches = event.changedTouches;
	if (changedTouches) {
		for (let touch of changedTouches) {
			touch.clientX = touch.x;
			touch.clientY = touch.y;
		}
	}
}

Page({
	onReady () {
		my.onTouchStart = function (cb) {
			touchstartCB = cb;
		}
		my.onTouchCancel = function (cb) {
			touchcancelCB = cb;
		}
		my.onTouchEnd = function (cb) {
			touchendCB = cb;
		}
		my.onTouchMove = function (cb) {
			touchmoveCB = cb;
		}
		my.createCanvas({
			id:'GameCanvas', 
			success(canvas){
				$global.screencanvas = canvas;
				if (!canvas.addEventListener) {
					// fix: undefined addEventListener
					canvas.addEventListener = function () {}
				}
				$global.__cocosCallback();
			},
			fail (err) {
				console.error('failed to init on screen canvas', err)
			}
		});
	},
	onError (err) {
		console.error('error in page: ', err);
	},
	onTouchStart (event) {
		handleTouchEvent(event);
		touchstartCB && touchstartCB(event);
	},
	onTouchCancel (event) {
		handleTouchEvent(event);
		touchcancelCB && touchcancelCB(event);
	},
	onTouchEnd (event) {
		handleTouchEvent(event);
		touchendCB && touchendCB(event);
	},
	onTouchMove (event) {
		handleTouchEvent(event);
		touchmoveCB && touchmoveCB(event);
	},
	canvasOnReady () {
	}
});
