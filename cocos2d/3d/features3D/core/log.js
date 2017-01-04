cc3d.extend(cc3d, function () {
    var log = {
        write: function (text) {
            console.log(text);
        },

        open: function (text) {
            cc3d.log.write("Powered by PlayCanvas " + cc3d.version + " " + cc3d.revision);
        },

        info: function (text) {
            console.info("INFO:    " + text);
        },

        debug: function (text) {
            console.debug("DEBUG:   " + text);
        },

        error: function (text) {
            console.error("ERROR:   " + text);
        },

        warning: function (text) {
            console.warn("WARNING: " + text);
        },

        alert: function (text) {
            cc3d.log.write("ALERT:   " + text);
            alert(text);
        },

        assert: function (condition, text) {
            if (condition === false) {
                cc3d.log.write("ASSERT:  " + text);
                alert("ASSERT failed: " + text);
            }
        }
    };

    return {
        log: log
    };
}());

// Shortcuts to logging functions
var logINFO = cc3d.log.info;
var logDEBUG = cc3d.log.debug;
var logWARNING = cc3d.log.warning;
var logERROR = cc3d.log.error;

var logALERT = cc3d.log.alert;
var logASSERT = cc3d.log.assert;
