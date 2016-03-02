/**
 * Created by Doma on 16/1/14.
 */
(function (window) {
    var _topics = {},
        _publish = function (type, args) {
            if (type && _topics[type]) {
                for (var i = 0; i < _topics[type].length; i++) {
                    setTimeout((function (act, self) {
                        return function () {
                            act.apply(self, args);
                        };
                    })(_topics[type][i], this), 0);
                }
            }
        },
        _subscribe = function (type, act) {
            if (typeof act === typeof function () {
                }) {

                if (!_topics[type]) {
                    _topics[type] = [];
                }
                _topics[type].push(act);
            }
        };

    window.P = function (type) {
        _publish(type, Array.prototype.slice.call(arguments, 1));
        return {
            p: P
        };
    };

    window.S = function (type, act) {
        _subscribe(type, act);
        return {
            s: S
        };
    };
})(window);