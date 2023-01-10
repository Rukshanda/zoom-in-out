Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Slick = /** @class */ (function (_super) {
    __extends(Slick, _super);
    function Slick(props) {
        var _this = _super.call(this, props) || this;
        _this.addLoop = function () {
            clearInterval(_this.interval);
            var _a = _this.props, _b = _a.durationAutoPlay, durationAutoPlay = _b === void 0 ? 4000 : _b, _c = _a.durationAnimation, durationAnimation = _c === void 0 ? 300 : _c, _d = _a.images, images = _d === void 0 ? [] : _d, _e = _a.loop, loop = _e === void 0 ? true : _e;
            if (!loop)
                return;
            _this.interval = setInterval(function () {
                _this.allowMove = false;
                _this.mouse.x = 0;
                _this.mouse.x2 = -getSizeWidth(_this.ref);
                _this.translate(true);
                setTimeout(function () {
                    _this.i = _this.i + 1;
                    if (_this.i === images.length + 1) {
                        _this.i = 1;
                    }
                    else if (_this.i === 0) {
                        _this.i = images.length;
                    }
                    _this.allowMove = true;
                    _this.mouse = {};
                    _this.translate();
                }, durationAnimation);
            }, durationAutoPlay);
        };
        _this.resize = function () {
            var width = getSizeWidth(_this.ref);
            _this.appendSize(width);
            _this.translate();
        };
        _this.beginActive = function () {
            if (_this.ref)
                _this.ref.style.opacity = "1";
            var width = getSizeWidth(_this.ref);
            _this.appendSize(width);
            _this.translate();
        };
        _this.translate = function (animation) {
            var width = getSizeWidth(_this.ref);
            for (var i = 0; i < _this.refsImg.length; i++) {
                var ref = _this.refsImg[i];
                if (!ref)
                    continue;
                _this.enableTransition(ref, animation);
                var size = -width * _this.i;
                var xAdd = _this.getTranslateXMove(i);
                if ((i === _this.i - 1 && xAdd < 0) || (xAdd > 0 && i === _this.i)) {
                    _this.enableBackdrop(ref);
                }
                else
                    _this.removeBackdrop(ref);
                if (i < _this.i) {
                    var tran = size / 2 + (-width / 2) * i - xAdd;
                    ref.style.transform = "translateX(".concat(tran, "px)");
                }
                else {
                    ref.style.transform = "translateX(".concat(size - xAdd, "px)");
                }
            }
            _this.viewDot();
        };
        _this.getTranslateXMove = function (i) {
            var xTrans = (_this.mouse.x || 0) - (_this.mouse.x2 || 0);
            var xAdd = xTrans;
            if (i < _this.i) {
                xAdd = xTrans / 2;
            }
            else if (i === _this.i) {
                xAdd = xTrans > 0 ? xTrans / 2 : xTrans;
            }
            return xAdd;
        };
        _this.appendSize = function (width) {
            var _a;
            (_a = _this.refsImg) === null || _a === void 0 ? void 0 : _a.forEach(function (ref) {
                if (ref)
                    ref.style.width = "".concat(width, "px");
            });
        };
        _this.onMouseDown = function (_a) {
            var pageX = _a.pageX;
            if (!_this.allowMove)
                return;
            _this.mouse.x = pageX;
            clearInterval(_this.interval);
        };
        _this.onMouseMove = function (_a) {
            var pageX = _a.pageX;
            if (_this.mouse.x === undefined || !_this.allowMove)
                return;
            _this.mouse.x2 = pageX;
            _this.translate();
            _this.checkPercent();
        };
        _this.checkPercent = function () {
            if (_this.mouse.x === undefined || !_this.allowMove)
                return;
            var _a = _this.props, _b = _a.durationAnimation, durationAnimation = _b === void 0 ? 300 : _b, images = _a.images;
            var percent = _this.getPercent();
            if (Math.abs(percent) > 0.3) {
                _this.allowMove = false;
                var width = getSizeWidth(_this.ref);
                if (percent < 0) {
                    _this.mouse.x2 = width + _this.mouse.x;
                }
                else
                    _this.mouse.x2 = _this.mouse.x - width;
                _this.translate(true);
                setTimeout(function () {
                    _this.i = percent < 0 ? _this.i - 1 : _this.i + 1;
                    if (_this.i === images.length + 1) {
                        _this.i = 1;
                    }
                    else if (_this.i === 0) {
                        _this.i = images.length;
                    }
                    _this.mouse = {};
                    _this.translate();
                    _this.allowMove = true;
                    _this.addLoop();
                }, durationAnimation);
            }
        };
        _this.onMouseUp = function () {
            if (!_this.allowMove)
                return;
            _this.addLoop();
            var _a = _this.props, _b = _a.durationAnimation, durationAnimation = _b === void 0 ? 300 : _b, onClick = _a.onClick, images = _a.images;
            if (_this.mouse.x === undefined || _this.mouse.x2 === undefined) {
                _this.mouse = {};
                return onClick === null || onClick === void 0 ? void 0 : onClick(images[_this.i - 1]);
            }
            _this.mouse.x2 = _this.mouse.x;
            _this.allowMove = false;
            _this.translate(true);
            setTimeout(function () {
                _this.allowMove = true;
                _this.mouse = {};
            }, durationAnimation);
        };
        _this.enableTransition = function (element, animation) {
            if (!element)
                return;
            var _a = _this.props.durationAnimation, durationAnimation = _a === void 0 ? 300 : _a;
            element.style.transitionDuration = "".concat(animation ? durationAnimation : 0, "ms");
        };
        _this.getPercent = function () {
            var xTrans = (_this.mouse.x || 0) - (_this.mouse.x2 || 0);
            var width = getSizeWidth(_this.ref);
            var percent = xTrans / width;
            return percent;
        };
        _this.enableBackdrop = function (element) {
            var backdrop = element.querySelector("div.slider-slick__img__backdrop");
            var percent = _this.getPercent();
            if (backdrop) {
                backdrop.setAttribute("style", "opacity: ".concat(percent < 0 ? 1 - Math.abs(percent) : Math.abs(percent)));
            }
        };
        _this.removeBackdrop = function (element) {
            var backdrop = element.querySelector("div.slider-slick__img__backdrop");
            if (backdrop) {
                backdrop.setAttribute("style", "opacity: 0");
            }
        };
        _this.viewDot = function () {
            var _a = _this.props, dotColorActive = _a.dotColorActive, dotColorInActive = _a.dotColorInActive;
            for (var i = 0; i < _this.refsDot.length; i++) {
                var dot = _this.refsDot[i];
                if (!dot)
                    continue;
                if (i + 1 === _this.i) {
                    if (dotColorActive) {
                        dot.style.backgroundColor = dotColorActive;
                    }
                    else
                        dot.style.opacity = "1";
                }
                else {
                    if (dotColorInActive) {
                        dot.style.backgroundColor = dotColorInActive;
                    }
                    else
                        dot.style.opacity = "0.5";
                }
            }
        };
        _this.i = 1;
        _this.mouse = {};
        _this.refsImg = [];
        _this.refsDot = [];
        _this.allowMove = true;
        return _this;
    }
    Slick.prototype.componentDidMount = function () {
        this.listener = appendCss();
        this.beginActive();
        this.addLoop();
        window.addEventListener("resize", this.resize);
    };
    Slick.prototype.shouldComponentUpdate = function (nextProps) {
        if (nextProps.images.length !== this.props.images.length) {
            this.i = 1;
            this.mouse = {};
            this.refsImg = this.refsImg.filter(function (_, i) { return i < nextProps.images.length; });
            setTimeout(this.translate, 0);
        }
        return true;
    };
    Slick.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.listener) === null || _a === void 0 ? void 0 : _a.call(this);
        clearInterval(this.interval);
        window.removeEventListener("resize", this.resize);
    };
    Slick.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.images, images = _b === void 0 ? [] : _b, urlExtractor = _a.urlExtractor, keyExtractor = _a.keyExtractor, aspectRatio = _a.aspectRatio, styleImg = _a.styleImg, dotStyle = _a.dotStyle, dotColorInActive = _a.dotColorInActive;
        if (!(images === null || images === void 0 ? void 0 : images.length))
            return null;
        var imageEnd = images[images.length - 1];
        var imageStart = images[0];
        return (jsxRuntime.jsxs("div", __assign({ className: "slider-slick", ref: function (ref) { return (_this.ref = ref); }, onMouseDown: this.onMouseDown, onTouchStart: function (e) {
                _this.onMouseDown({ pageX: e.changedTouches[0].pageX });
            }, onMouseMove: this.onMouseMove, onTouchMove: function (e) {
                _this.onMouseMove({ pageX: e.changedTouches[0].pageX });
            }, onMouseUp: this.onMouseUp, onTouchEnd: this.onMouseUp }, { children: [__spreadArray(__spreadArray([imageEnd], images, true), [imageStart], false).map(function (e, i) { return (jsxRuntime.jsxs("div", __assign({ className: "slider-slick__img", ref: function (ref) { return (_this.refsImg[i] = ref); } }, { children: [jsxRuntime.jsx("img", { draggable: false, src: urlExtractor(e), alt: "", style: sxStyle(styleImg, { aspectRatio: aspectRatio }) }), jsxRuntime.jsx("div", { className: "slider-slick__img__backdrop" })] }), "".concat(keyExtractor === null || keyExtractor === void 0 ? void 0 : keyExtractor(e), "_").concat(i))); }), jsxRuntime.jsx("div", __assign({ className: "slider-slick__dot" }, { children: images.map(function (_, i) { return (jsxRuntime.jsx("div", { ref: function (ref) { return (_this.refsDot[i] = ref); }, style: sxStyle(dotStyle, { backgroundColor: dotColorInActive }) }, i)); }) }))] })));
    };
    return Slick;
}(react.Component));
var sxStyle = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var style = {};
    for (var i = 0; i < args.length; i++) {
        if (args[i] && typeof args[i] === "object") {
            style = __assign(__assign({}, style), args[i]);
        }
    }
    return style;
};
var css = "\n  .slider-slick {\n    width: 100%;\n    height: max-content;\n    display: flex;\n    align-items: center;\n    overflow: hidden;\n    user-select: none;\n    opacity: 0;\n    position: relative;\n  }\n\n  .slider-slick__img {\n    width: 100%;\n    position: relative;\n    display: flex;\n    align-items: center;\n    min-width: 100%;\n    flex: 1;\n  }\n\n  .slider-slick__img > img {\n    width: 100%;\n    min-width: 100%;\n  }\n\n  .slider-slick__img__backdrop {\n    opacity: 0;\n    background-color: rgba(0, 0, 0, 0.5);\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n  }\n  .slider-slick__dot {\n    position: absolute;\n    left: 0;\n    bottom: 10px;\n    width: 100%;\n    display: flex;\n    gap: 8px;\n    justify-content: center;\n  }\n\n  .slider-slick__dot > div {\n    width: 8px;\n    height: 8px;\n    border-radius: 8px;\n    background: white;\n    opacity: 1\n  }\n";
var appendCss = function () {
    var head = document.querySelector("head");
    if (!head)
        return;
    var styleExist = document.querySelector('style[id-style="slick-slider-import-css"]');
    if (styleExist)
        return;
    var style = document.createElement("style");
    style.setAttribute("id-style", "slick-slider-import-css");
    style.innerHTML = css;
    head.appendChild(style);
    return function () {
        head.removeChild(style);
    };
};
var getSizeWidth = function (element) {
    if (!element)
        return 0;
    return element.getBoundingClientRect().width;
};

exports.Slick = Slick;
//# sourceMappingURL=index.js.map
