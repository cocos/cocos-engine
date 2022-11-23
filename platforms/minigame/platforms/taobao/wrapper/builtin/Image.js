// var screencanvas = $global.screencanvas;

function Image () {
    // empty constructor
}

// NOTE: Proxy not supported on iOS 8 and 9.
// let ImageProxy = new Proxy(Image, {
//     construct (target, args) {
//         let img =  screencanvas.createImage();
//         if (!img.addEventListener) {
//             img.addEventListener = function (eventName, eventCB) {
//                 if (eventName === 'load') {
//                     img.onload = eventCB;
//                 } else if (eventName === 'error') {
//                     // img.onerror = eventCB;
//                 }
//             };
//         }

//         if (!img.removeEventListener) {
//           img.removeEventListener = function (eventName) {
//             if (eventName === 'load') {
//               img.onload = null;
//             } else if (eventName === 'error') {
//               // img.onerror = null;
//             }
//           };
//         }
//         return img;
//     },
// });

// NOTE: this is a hack operation
// let img = new window.Image()
// console.error(img instanceof window.Image)  => false
// export default ImageProxy;


export default Image;