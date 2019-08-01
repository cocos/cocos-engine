
function deepClose(actual, expected, maxDifference, message) {
    if (actual instanceof cc.Rect) {
        close(actual.x, expected.x, maxDifference, message + ' x');
        close(actual.y, expected.y, maxDifference, message + ' y');
        close(actual.width, expected.width, maxDifference, message + ' w');
        close(actual.height, expected.height, maxDifference, message + ' h');
    }
    else if (actual instanceof cc.Vec2) {
        close(actual.x, expected.x, maxDifference, message + ' x');
        close(actual.y, expected.y, maxDifference, message + ' y');
    }
    //else if (actual instanceof cc.Matrix23) {
    //    close(actual.a, expected.a, maxDifference, message + ' a');
    //    close(actual.b, expected.b, maxDifference, message + ' b');
    //    close(actual.c, expected.c, maxDifference, message + ' c');
    //    close(actual.d, expected.d, maxDifference, message + ' d');
    //    close(actual.tx, expected.tx, maxDifference, message + ' tx');
    //    close(actual.ty, expected.ty, maxDifference, message + ' ty');
    //}
    else {
        close(actual, expected, maxDifference, message);
    }
}

QUnit.extend(QUnit.assert, {
    deepClose: deepClose,
});
