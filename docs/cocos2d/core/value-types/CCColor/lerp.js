// Converts a white color to a black one trough time.
var oldColor = cc.Color.WHITE;
var ratio = 0;
update: function (dt) {
    if (oldColor.equals(cc.Color.BLACK)) {
        return;
    }
    ratio += dt * 0.1;
    oldColor = oldColor.lerp(cc.Color.BLACK, ratio);
}
