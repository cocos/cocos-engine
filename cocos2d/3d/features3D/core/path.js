
cc3d.path = function () {
    return {
        delimiter: "/",
        join: function () {
            var index;
            var num = arguments.length;
            var result = arguments[0];

            for (index = 0; index < num - 1; ++index) {
                var one = arguments[index];
                var two = arguments[index + 1];
                if (!cc3d.isDefined(one) || !cc3d.isDefined(two)) {
                    throw new Error("undefined argument to cc3d.path.join");
                }
                if (two[0] === cc3d.path.delimiter) {
                    result = two;
                    continue;
                }

                if (one && two && one[one.length - 1] !== cc3d.path.delimiter && two[0] !== cc3d.path.delimiter) {
                    result += (cc3d.path.delimiter + two);
                } else {
                    result += (two);
                }
            }

            return result;
        },

        split: function (path) {
            var parts = path.split(cc3d.path.delimiter);
            var tail = parts.slice(parts.length - 1)[0];
            var head = parts.slice(0, parts.length - 1).join(cc3d.path.delimiter);
            return [head, tail];
        },

        getBasename: function (path) {
            return cc3d.path.split(path)[1];
        },

        getDirectory: function (path) {
            var parts = path.split(cc3d.path.delimiter);
            return parts.slice(0, parts.length - 1).join(cc3d.path.delimiter);
        },

        getExtension: function (path) {
            var ext = path.split('?')[0].split('.').pop();
            if (ext !== path) {
                return "." + ext;
            } else {
                return "";
            }
        },

        isRelativePath: function (s) {
            return s.charAt(0) !== "/" && s.match(/:\/\//) === null;
        },

        extractPath: function (s) {
            var path = ".",
                parts = s.split("/"),
                i = 0;

            if (parts.length > 1) {
                if (cc3d.path.isRelativePath(s) === false) {
                    path = "";
                }
                for (i = 0; i < parts.length - 1; ++i) {
                    path += "/" + parts[i];
                }
            }
            return path;
        }
    };
}();




