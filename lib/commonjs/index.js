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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var __DEV__ = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
var DEFAULT_CDN_PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.189/pdf.min.mjs";
var DEFAULT_CDN_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.189/pdf.worker.mjs";
var PDFHighlight = /** @class */ (function (_super) {
    __extends(PDFHighlight, _super);
    function PDFHighlight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isObjectEqual = function (obj1, obj2) {
            if (obj1 === obj2)
                return true;
            if (typeof obj1 !== typeof obj2)
                return false;
            var obj1Keys = Object.keys(obj1);
            var obj2Keys = Object.keys(obj2);
            if (obj1Keys.length !== obj2Keys.length) {
                return false;
            }
            var isEqual = true;
            for (var _i = 0, obj1Keys_1 = obj1Keys; _i < obj1Keys_1.length; _i++) {
                var key = obj1Keys_1[_i];
                if (obj1[key] !== obj2[key]) {
                    isEqual = false;
                    break;
                }
            }
            return isEqual;
        };
        _this.isEqualKeyword = function (keywords, keywords2) {
            if (keywords === keywords2)
                return true;
            if ((keywords === null || keywords === void 0 ? void 0 : keywords.length) !== (keywords2 === null || keywords2 === void 0 ? void 0 : keywords2.length))
                return false;
            if (keywords2 === null || keywords2 === void 0 ? void 0 : keywords2.some(function (e) { return !(keywords === null || keywords === void 0 ? void 0 : keywords.includes(e)); }))
                return false;
            return true;
        };
        _this.appendScript = function (props) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var head, cdnPDFJS, cdn, script;
                var _a;
                return __generator(this, function (_b) {
                    head = document.querySelector("head");
                    cdnPDFJS = props.cdnPDFJS;
                    cdn = cdnPDFJS || DEFAULT_CDN_PDFJS;
                    if (!head) {
                        head = document.createElement("head");
                        (_a = document.querySelector("html")) === null || _a === void 0 ? void 0 : _a.appendChild(head);
                    }
                    if (!head)
                        return [2 /*return*/];
                    if (document.querySelector("script[src=\"".concat(cdn, "\"]"))) {
                        return [2 /*return*/, this.pdfLoaded()];
                    }
                    script = document.createElement("script");
                    script.src = cdn;
                    script.type = "module";
                    head.appendChild(script);
                    script.onload = this.pdfLoaded;
                    this.remove = function () { return head === null || head === void 0 ? void 0 : head.removeChild(script); };
                    return [2 /*return*/];
                });
            });
        };
        _this.pdfLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.initPdf();
                        return [4 /*yield*/, this.loadPDf()];
                    case 1:
                        _b.sent();
                        this.renderPage();
                        return [3 /*break*/, 3];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.loadResize = function () {
            if (_this.timeoutRender)
                clearTimeout(_this.timeoutRender);
            _this.timeoutRender = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var debug, onStartLoad;
                return __generator(this, function (_a) {
                    debug = this.props.debug;
                    if (debug && __DEV__) {
                        console.info("Resize PDF");
                    }
                    onStartLoad = this.props.onStartLoad;
                    onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
                    this.renderPage();
                    return [2 /*return*/];
                });
            }); }, 100);
        };
        _this.initPdf = function () {
            var pdfjsLib = window.globalThis.pdfjsLib;
            var cdnWorkerPDFJS = _this.props.cdnWorkerPDFJS;
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                cdnWorkerPDFJS || DEFAULT_CDN_WORKER;
        };
        _this.loadPDf = function (props) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var url;
                var _this = this;
                return __generator(this, function (_a) {
                    url = props.url;
                    if (!url)
                        return [2 /*return*/];
                    return [2 /*return*/, new Promise(function (res, rej) {
                            var pdfjsLib = window.globalThis.pdfjsLib;
                            var loadingTask = pdfjsLib.getDocument(url);
                            loadingTask.promise.then(function (pdf) { return _this.setPdf(pdf, res); }).catch(rej);
                        })];
                });
            });
        };
        _this.setPdf = function (pdf, callback) {
            if (_this.pdf)
                _this.pdf.destroy();
            _this.pdf = pdf;
            callback(pdf);
        };
        _this.renderPage = function (props) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var onLoaded, page, pagePdf, totalPages, i, pagePdf;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.pdf)
                                return [2 /*return*/];
                            if (this.refCanvasWrap)
                                this.refCanvasWrap.innerHTML = "";
                            onLoaded = props.onLoaded, page = props.page;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 9, , 10]);
                            if (!page) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.pdf.getPage(page)];
                        case 2:
                            pagePdf = _b.sent();
                            this.renderPdf(pagePdf, props, page);
                            return [3 /*break*/, 8];
                        case 3:
                            totalPages = this.pdf.numPages;
                            i = 1;
                            _b.label = 4;
                        case 4:
                            if (!(i <= totalPages)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.pdf.getPage(i)];
                        case 5:
                            pagePdf = _b.sent();
                            return [4 /*yield*/, this.renderPdf(pagePdf, props, i)];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            i++;
                            return [3 /*break*/, 4];
                        case 8:
                            onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded();
                            return [3 /*break*/, 10];
                        case 9:
                            _b.sent();
                            onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded();
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        _this.renderPdf = function (pagePdf, props, page) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var width, _a, keywords, _b, scale, pageSearch, allowHtml, div, id, canvas, ctx, viewport, size, newScale, promiseAll_1, renderTask, promiseAll;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.refCanvasWrap)
                                return [2 /*return*/];
                            width = this.refCanvasWrap.getBoundingClientRect().width;
                            _a = props.keywords, keywords = _a === void 0 ? [] : _a, _b = props.scale, scale = _b === void 0 ? 1 : _b, pageSearch = props.pageSearch, allowHtml = props.allowHtml;
                            div = document.createElement("div");
                            div.id = "wrap-canvas-page-".concat(page);
                            div.style.position = "relative";
                            id = "canvas-page-".concat(page);
                            canvas = document.createElement("canvas");
                            canvas.id = id;
                            div.appendChild(canvas);
                            ctx = canvas.getContext("2d");
                            if (!ctx)
                                return [2 /*return*/];
                            viewport = pagePdf.getViewport({ scale: 1 });
                            size = viewport;
                            newScale = Math.ceil(width / viewport.width);
                            if (newScale < scale) {
                                newScale = scale;
                            }
                            if (!document.querySelector("#".concat(id))) return [3 /*break*/, 2];
                            promiseAll_1 = keywords.map(function (keyword, index) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (keyword.length > 2000) {
                                        console.warn("Keywords are too big: " + keyword.length + " characters");
                                    }
                                    return [2 /*return*/, this.hightlightText(pagePdf, keyword, document.querySelector("#".concat(id)).getContext("2d"), __assign(__assign({}, size), { scale: newScale }), props)];
                                });
                            }); });
                            return [4 /*yield*/, Promise.all(promiseAll_1)];
                        case 1:
                            _c.sent();
                            _c.label = 2;
                        case 2:
                            this.refCanvasWrap.appendChild(div);
                            viewport = pagePdf.getViewport({ scale: newScale });
                            if (allowHtml) {
                                this.appendTextToCanvas(pagePdf, div, newScale, viewport.width / width);
                            }
                            canvas.style.width = "".concat(width, "px");
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            return [4 /*yield*/, pagePdf.render({ canvasContext: ctx, viewport: viewport })];
                        case 3:
                            renderTask = _c.sent();
                            if (pageSearch && pageSearch !== page)
                                return [2 /*return*/];
                            return [4 /*yield*/, renderTask.promise];
                        case 4:
                            _c.sent();
                            promiseAll = keywords.map(function (keyword, index) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (keyword.length > 2000) {
                                        console.warn("Keywords are too big: " + keyword.length + " characters");
                                    }
                                    return [2 /*return*/, this.hightlightText(pagePdf, keyword, ctx, __assign(__assign({}, size), { scale: newScale }), props)];
                                });
                            }); });
                            return [2 /*return*/, Promise.all(promiseAll)];
                    }
                });
            });
        };
        _this.appendTextToCanvas = function (pagePdf, parent, scale, scaleReal) { return __awaiter(_this, void 0, void 0, function () {
            var _a, items, styles, i, item, style, div;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pagePdf.getTextContent()];
                    case 1:
                        _a = _b.sent(), items = _a.items, styles = _a.styles;
                        for (i = 0; i < items.length; i++) {
                            item = items[i];
                            style = styles[item.fontName];
                            div = document.createElement("div");
                            div.style.position = "absolute";
                            div.style.color = "transparent";
                            div.style.fontFamily = style.fontFamily;
                            div.style.fontSize = "".concat((item.transform[3] * scale) / scaleReal, "px");
                            div.style.letterSpacing = "".concat(0.3, "px");
                            div.style.minWidth = "".concat((item.width * scale) / scaleReal, "px");
                            div.style.left = "".concat((item.transform[4] * scale) / scaleReal, "px");
                            div.style.bottom = "".concat((item.transform[5] * scale) / scaleReal, "px");
                            div.innerHTML = item.str;
                            parent.appendChild(div);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        _this.makeSpacing = function (width, str, scale, ctx, spacing) {
            var _a = _this.props.extractLetterSpacing, extractLetterSpacing = _a === void 0 ? 0.1 : _a;
            ctx.save();
            ctx.letterSpacing = "".concat(spacing * scale, "px");
            var w = ctx.measureText(str).width;
            ctx.restore();
            if (Math.floor(w / scale) - 3 * scale <= Math.floor(width) &&
                Math.floor(w / scale) + 3 * scale >= Math.floor(width)) {
                return spacing;
            }
            if (Math.floor(w / scale) > Math.floor(width)) {
                return _this.makeSpacing(width, str, scale, ctx, spacing - extractLetterSpacing);
            }
            return _this.makeSpacing(width, str, scale, ctx, spacing + extractLetterSpacing);
        };
        _this.hightlightText = function (pagePdf, keyword, ctx, viewport, props) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var _a, items, styles, findObject, objects, indexBegin, end, _b, colorHighlight, isBorderHighlight, indexSub;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!keyword)
                                return [2 /*return*/];
                            return [4 /*yield*/, pagePdf.getTextContent()];
                        case 1:
                            _a = _c.sent(), items = _a.items, styles = _a.styles;
                            findObject = this.findObjects(items, keyword);
                            objects = findObject.objects, indexBegin = findObject.begin, end = findObject.end;
                            if (indexBegin < 0)
                                return [2 /*return*/];
                            if (!objects.length)
                                return [2 /*return*/];
                            _b = props.colorHighlight, colorHighlight = _b === void 0 ? "yellow" : _b, isBorderHighlight = props.isBorderHighlight;
                            indexSub = indexBegin;
                            objects.forEach(function (object, index) {
                                var str = object.str;
                                var style = styles[object.fontName];
                                ctx.save();
                                ctx.beginPath();
                                ctx.font = "".concat(object.transform[3] * viewport.scale, "px ").concat(style.fontFamily);
                                var spacing = _this.makeSpacing(object.width, str, viewport.scale, ctx, 0);
                                ctx.letterSpacing = "".concat(spacing, "px");
                                var w1 = 0;
                                var w2 = 0;
                                if (!index) {
                                    w1 = ctx.measureText(str.substring(0, indexSub)).width;
                                    w2 = ctx.measureText(str.substring(indexSub + keyword.length, str.length)).width;
                                }
                                else if (index === objects.length - 1) {
                                    var textEnd = str.slice(end, str.length);
                                    w2 = ctx.measureText(textEnd).width;
                                }
                                var w = (object.width - (w1 + w2) / viewport.scale) * viewport.scale;
                                var x = Math.floor(object.transform[4] + w1 / viewport.scale);
                                if (isBorderHighlight) {
                                    ctx.strokeStyle = colorHighlight;
                                    ctx.lineWidth = 1;
                                }
                                else {
                                    ctx.fillStyle = colorHighlight;
                                    ctx.globalAlpha = 0.2;
                                }
                                var y = viewport.height -
                                    object.transform[5] -
                                    object.height +
                                    style.ascent -
                                    style.descent;
                                if (!isBorderHighlight) {
                                    ctx.fillRect(x * viewport.scale - viewport.scale / 2, y * viewport.scale, w, object.height * viewport.scale);
                                }
                                else {
                                    ctx.strokeRect(x * viewport.scale - viewport.scale / 2, y * viewport.scale, w, object.height * viewport.scale);
                                }
                                ctx.closePath();
                                ctx.restore();
                                indexSub += str.length;
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        _this.parseKeyword = function (word) {
            return word.replace(/ |\n/g, " ").trim();
        };
        _this.checkEndsWith = function (keyword, string, i, iLast) {
            if (i >= keyword.length) {
                if (string.includes(keyword))
                    return i;
                return iLast;
            }
            var key = keyword.substring(0, i).trim();
            if (!key || string.endsWith(key.trim())) {
                return _this.checkEndsWith(keyword, string, i + 1, i);
            }
            return _this.checkEndsWith(keyword, string, i + 1, iLast);
        };
        _this.checkStartsWith = function (keyword, string, i, iLast) {
            if (i >= keyword.length) {
                if (string.includes(keyword))
                    return i;
                return iLast;
            }
            var key = keyword.substring(0, i).trim();
            if (!key ||
                string.replaceAll(" ", "").startsWith(key.replaceAll(" ", ""))) {
                return _this.checkStartsWith(keyword, string, i + 1, i);
            }
            return _this.checkStartsWith(keyword, string, i + 1, iLast);
        };
        _this.getIndexOfLast = function (string, search) {
            var largestIndex = -1;
            var currentIndex = string.indexOf(search);
            while (currentIndex !== -1) {
                largestIndex = currentIndex;
                currentIndex = string.indexOf(search, currentIndex + 1);
            }
            return largestIndex;
        };
        _this.findObjects = function (contents, keyword) {
            var object = contents.find(function (e) { return e.str.includes(keyword); });
            if (object) {
                var begin = _this.getIndexOfLast(object.str, keyword);
                return {
                    objects: [object],
                    begin: begin,
                    end: keyword.length,
                    endBegin: keyword.length,
                };
            }
            var stringSearch = _this.parseKeyword(keyword).substring(0, 5000);
            var values = {
                objects: [],
                begin: -1,
                end: -1,
                endBegin: -1,
            };
            for (var i = 0; i < contents.length; i++) {
                var str = _this.parseKeyword(contents[i].str);
                if (!str.trim())
                    continue;
                if (!values.objects.length) {
                    var index = _this.checkEndsWith(stringSearch, str, 0, -1);
                    if (index > 0) {
                        values.objects.push(contents[i]);
                        values.endBegin = index;
                        var stringSearchLast = stringSearch.substring(0, index).trim();
                        var indexOfLast = _this.getIndexOfLast(str, stringSearchLast);
                        values.begin = indexOfLast;
                        stringSearch = stringSearch.substring(index, stringSearch.length);
                    }
                    continue;
                }
                if (!stringSearch.trim())
                    break;
                var indexStart = _this.checkStartsWith(stringSearch, str, 0, 0);
                if (indexStart <= 0) {
                    values.objects = [];
                    values.begin = -1;
                    values.end = -1;
                    values.endBegin = -1;
                    stringSearch = _this.parseKeyword(keyword);
                    continue;
                }
                values.end = indexStart;
                values.objects.push(contents[i]);
                stringSearch = stringSearch.substring(indexStart, stringSearch.length);
                if (!stringSearch) {
                    break;
                }
            }
            return values;
        };
        return _this;
    }
    PDFHighlight.prototype.componentDidMount = function () {
        var _this = this;
        var onStartLoad = this.props.onStartLoad;
        onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
        this.appendScript();
        window.addEventListener("resize", this.loadResize);
        this.removeResize = function () {
            window.removeEventListener("resize", _this.loadResize);
        };
    };
    PDFHighlight.prototype.shouldComponentUpdate = function (nProps) {
        var _this = this;
        var _a;
        var _b = this.props, cdnPDFJS = _b.cdnPDFJS, cdnWorkerPDFJS = _b.cdnWorkerPDFJS, width = _b.width, keywords = _b.keywords, onStartLoad = _b.onStartLoad, styleWrap = _b.styleWrap, debug = _b.debug, url = _b.url;
        var keys = [
            "scale",
            "page",
            "pageSearch",
            "isBorderHighlight",
            "colorHighlight",
        ];
        if (cdnPDFJS !== nProps.cdnPDFJS ||
            cdnWorkerPDFJS !== nProps.cdnWorkerPDFJS) {
            if (debug && __DEV__) {
                console.info("Reload CDN");
            }
            (_a = this.remove) === null || _a === void 0 ? void 0 : _a.call(this);
            this.appendScript(nProps);
        }
        else if (url !== nProps.url) {
            if (debug && __DEV__) {
                console.info("Reload key change => ", keys.find(function (key) { return _this.props[key] !== nProps[key]; }));
            }
            onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
            this.loadPDf(nProps).then(function () { return _this.renderPage(nProps); });
        }
        else if (!this.isEqualKeyword(nProps.keywords, keywords) ||
            !this.isObjectEqual(styleWrap, nProps.styleWrap) ||
            keys.some(function (key) { return _this.props[key] !== nProps[key]; })) {
            if (debug && __DEV__) {
                console.info("Reload keyword or style => ", "keyword ? ", this.isEqualKeyword(nProps.keywords, keywords), ", styleWrap ? ", this.isObjectEqual(styleWrap, nProps.styleWrap));
            }
            onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
            this.renderPage(nProps);
        }
        return width !== nProps.width;
    };
    PDFHighlight.prototype.componentWillUnmount = function () {
        var _a, _b;
        (_a = this.remove) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this.removeResize) === null || _b === void 0 ? void 0 : _b.call(this);
    };
    PDFHighlight.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.width, width = _b === void 0 ? "100%" : _b, styleWrap = _a.styleWrap;
        return (jsxRuntime.jsx("div", { ref: function (ref) { return (_this.refCanvasWrap = ref); }, style: __assign({ width: width, minHeight: "100%", overflow: "auto" }, (styleWrap || {})) }));
    };
    return PDFHighlight;
}(react.Component));

exports.PDFHighlight = PDFHighlight;
//# sourceMappingURL=index.js.map
