
var PI      = Math.PI;
var min     = Math.min;
var max     = Math.max;
var cos     = Math.cos;
var sin     = Math.sin;
var abs     = Math.abs;
var sign    = Math.sign;

var KAPPA90 = 0.5522847493;

function arc (ctx, cx, cy, r, startAngle, endAngle, counterclockwise) {
    counterclockwise = counterclockwise || false;

    var a = 0, da = 0, hda = 0, kappa = 0;
    var dx = 0, dy = 0, x = 0, y = 0, tanx = 0, tany = 0;
    var px = 0, py = 0, ptanx = 0, ptany = 0;
    var i, ndivs;

    // Clamp angles
    da = endAngle - startAngle;
    if (counterclockwise) {
        if (abs(da) >= PI * 2) {
            da = PI * 2;
        } else {
            while (da < 0) da += PI * 2;
        }
    } else {
        if (abs(da) >= PI * 2) {
            da = -PI * 2;
        } else {
            while (da > 0) da -= PI * 2;
        }
    }

    // Split arc into max 90 degree segments.
    ndivs = max(1, min(abs(da) / (PI * 0.5) + 0.5, 5)) | 0;
    hda = da / ndivs / 2.0;
    kappa = abs(4.0 / 3.0 * (1 - cos(hda)) / sin(hda));

    if (!counterclockwise) kappa = -kappa;

    for (i = 0; i <= ndivs; i++) {
        a = startAngle + da * (i / ndivs);
        dx = cos(a);
        dy = sin(a);
        x = cx + dx * r;
        y = cy + dy * r;
        tanx = -dy * r * kappa;
        tany = dx * r * kappa;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.bezierCurveTo(px + ptanx, py + ptany, x - tanx, y - tany, x, y);
        }
        px = x;
        py = y;
        ptanx = tanx;
        ptany = tany;
    }
}

function ellipse (ctx, cx, cy, rx, ry) {
    ctx.moveTo(cx - rx, cy);
    ctx.bezierCurveTo(cx - rx, cy + ry * KAPPA90, cx - rx * KAPPA90, cy + ry, cx, cy + ry);
    ctx.bezierCurveTo(cx + rx * KAPPA90, cy + ry, cx + rx, cy + ry * KAPPA90, cx + rx, cy);
    ctx.bezierCurveTo(cx + rx, cy - ry * KAPPA90, cx + rx * KAPPA90, cy - ry, cx, cy - ry);
    ctx.bezierCurveTo(cx - rx * KAPPA90, cy - ry, cx - rx, cy - ry * KAPPA90, cx - rx, cy);
    ctx.close();
}

function roundRect (ctx, x, y, w, h, r) {
    if (r < 0.1) {
        ctx.rect(x, y, w, h);
        return;
    } else {
        var rx = min(r, abs(w) * 0.5) * sign(w),
            ry = min(r, abs(h) * 0.5) * sign(h);

        ctx.moveTo(x, y + ry);
        ctx.lineTo(x, y + h - ry);
        ctx.bezierCurveTo(x, y + h - ry * (1 - KAPPA90), x + rx * (1 - KAPPA90), y + h, x + rx, y + h);
        ctx.lineTo(x + w - rx, y + h);
        ctx.bezierCurveTo(x + w - rx * (1 - KAPPA90), y + h, x + w, y + h - ry * (1 - KAPPA90), x + w, y + h - ry);
        ctx.lineTo(x + w, y + ry);
        ctx.bezierCurveTo(x + w, y + ry * (1 - KAPPA90), x + w - rx * (1 - KAPPA90), y, x + w - rx, y);
        ctx.lineTo(x + rx, y);
        ctx.bezierCurveTo(x + rx * (1 - KAPPA90), y, x, y + ry * (1 - KAPPA90), x, y + ry);
        ctx.close();
    }
}


module.exports =  {
    arc: arc,
    ellipse: ellipse,
    roundRect: roundRect,
};
