// Converts a white color to a black one trough time.
var oldColor = cc.Color.WHITE;
// Method 2
update: function (dt) {
    var outColor = oldColor.lerp(Color.BLACK, dt * 0.1);
    cc.log(outColor);
}
// Method 2
update: function (dt) {
    oldColor.lerp(Color.white, dt * 0.1, outColor);
    cc.log(outColor);
}