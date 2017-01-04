
cc3d.string = function () {
    return {
        ASCII_LOWERCASE: "abcdefghijklmnopqrstuvwxyz",

        ASCII_UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

        ASCII_LETTERS: this.ASCII_LOWERCASE + this.ASCII_UPPERCASE,

        format: function (s) {
            var i = 0,
                regexp,
                args = cc3d.makeArray(arguments);

            // drop first argument
            args.shift();

            for (i = 0; i < args.length; i++) {
                regexp = new RegExp('\\{' + i + '\\}', 'gi');
                s = s.replace(regexp, args[i]);
            }
            return s;
        },

        startsWith: function (s, subs) {
            console.warn("WARNING: startsWith: Function is deprecated. Use String.startsWith instead.");
            return s.startsWith(subs);
        },

        endsWith: function (s, subs) {
            console.warn("WARNING: endsWith: Function is deprecated. Use String.endsWith instead.");
            return s.endsWith(subs);
        },

        toBool: function (s, strict) {
            if (s === 'true') {
                return true;
            }

            if (strict) {
                if (s === 'false') {
                    return false;
                }

                throw new Error('Not a boolean string');
            }

            return false;
        }
    };
}();

