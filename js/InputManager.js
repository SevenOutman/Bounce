/**
 * Created by Doma on 15/12/27.
 */
function InputManager() {
    this.events = {};
    if (window.navigator.msPointerEnabled) {
        //Internet Explorer 10 style
        this.eventTouchstart = "MSPointerDown";
    } else {
        this.eventTouchstart = "touchstart";
    }
    this.listen();
}

InputManager.prototype.on = function (event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

InputManager.prototype.emit = function (event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (callback) {
            setTimeout(function () {
                callback(data);
            }, 0);
        });
    }
};

InputManager.prototype.listen = function () {
    var self = this;
    window.addEventListener(self.eventTouchstart, function (e) {
        e.preventDefault();
        self.emit("tapped");
    }, false);
    window.addEventListener("mousedown", function (e) {
        e.preventDefault();
        self.emit("tapped");
    }, false);

    var restart = document.querySelector(".btn-restart");
    restart.addEventListener(self.eventTouchstart, function (e) {
        e.preventDefault();
        e.stopPropagation();
        self.emit("restart");
    }, false);
    restart.addEventListener("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation();
        self.emit("restart");
    }, false);

};