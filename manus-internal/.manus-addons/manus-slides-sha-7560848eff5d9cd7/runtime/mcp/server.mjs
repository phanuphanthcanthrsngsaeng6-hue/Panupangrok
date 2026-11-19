import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/.pnpm/process-nextick-args@2.0.1/node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS((exports, module) => {
  if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
    module.exports = { nextTick };
  } else {
    module.exports = process;
  }
  function nextTick(fn, arg1, arg2, arg3) {
    if (typeof fn !== "function") {
      throw new TypeError('"callback" argument must be a function');
    }
    var len = arguments.length;
    var args, i;
    switch (len) {
      case 0:
      case 1:
        return process.nextTick(fn);
      case 2:
        return process.nextTick(function afterTickOne() {
          fn.call(null, arg1);
        });
      case 3:
        return process.nextTick(function afterTickTwo() {
          fn.call(null, arg1, arg2);
        });
      case 4:
        return process.nextTick(function afterTickThree() {
          fn.call(null, arg1, arg2, arg3);
        });
      default:
        args = new Array(len - 1);
        i = 0;
        while (i < args.length) {
          args[i++] = arguments[i];
        }
        return process.nextTick(function afterTick() {
          fn.apply(null, args);
        });
    }
  }
});

// node_modules/.pnpm/isarray@1.0.0/node_modules/isarray/index.js
var require_isarray = __commonJS((exports, module) => {
  var toString = {}.toString;
  module.exports = Array.isArray || function(arr) {
    return toString.call(arr) == "[object Array]";
  };
});

// node_modules/.pnpm/safe-buffer@5.1.2/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS((exports, module) => {
  var buffer = __require("buffer");
  var Buffer2 = buffer.Buffer;
  function copyProps(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  }
  if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
  }
  function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer2(arg, encodingOrOffset, length);
  }
  copyProps(Buffer2, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer2(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer2(size);
    if (fill !== undefined) {
      if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer2(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
});

// node_modules/.pnpm/core-util-is@1.0.3/node_modules/core-util-is/lib/util.js
var require_util = __commonJS((exports) => {
  function isArray(arg) {
    if (Array.isArray) {
      return Array.isArray(arg);
    }
    return objectToString(arg) === "[object Array]";
  }
  exports.isArray = isArray;
  function isBoolean(arg) {
    return typeof arg === "boolean";
  }
  exports.isBoolean = isBoolean;
  function isNull(arg) {
    return arg === null;
  }
  exports.isNull = isNull;
  function isNullOrUndefined(arg) {
    return arg == null;
  }
  exports.isNullOrUndefined = isNullOrUndefined;
  function isNumber(arg) {
    return typeof arg === "number";
  }
  exports.isNumber = isNumber;
  function isString(arg) {
    return typeof arg === "string";
  }
  exports.isString = isString;
  function isSymbol(arg) {
    return typeof arg === "symbol";
  }
  exports.isSymbol = isSymbol;
  function isUndefined(arg) {
    return arg === undefined;
  }
  exports.isUndefined = isUndefined;
  function isRegExp(re) {
    return objectToString(re) === "[object RegExp]";
  }
  exports.isRegExp = isRegExp;
  function isObject(arg) {
    return typeof arg === "object" && arg !== null;
  }
  exports.isObject = isObject;
  function isDate(d) {
    return objectToString(d) === "[object Date]";
  }
  exports.isDate = isDate;
  function isError(e) {
    return objectToString(e) === "[object Error]" || e instanceof Error;
  }
  exports.isError = isError;
  function isFunction(arg) {
    return typeof arg === "function";
  }
  exports.isFunction = isFunction;
  function isPrimitive(arg) {
    return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
  }
  exports.isPrimitive = isPrimitive;
  exports.isBuffer = __require("buffer").Buffer.isBuffer;
  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }
});

// node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS((exports, module) => {
  if (typeof Object.create === "function") {
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor;
        ctor.prototype.constructor = ctor;
      }
    };
  }
});

// node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js
var require_inherits = __commonJS((exports, module) => {
  try {
    util = __require("util");
    if (typeof util.inherits !== "function")
      throw "";
    module.exports = util.inherits;
  } catch (e) {
    module.exports = require_inherits_browser();
  }
  var util;
});

// node_modules/.pnpm/readable-stream@2.3.8/node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = __commonJS((exports, module) => {
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var Buffer2 = require_safe_buffer().Buffer;
  var util = __require("util");
  function copyBuffer(src, target, offset) {
    src.copy(target, offset);
  }
  module.exports = function() {
    function BufferList() {
      _classCallCheck(this, BufferList);
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    BufferList.prototype.push = function push(v) {
      var entry = { data: v, next: null };
      if (this.length > 0)
        this.tail.next = entry;
      else
        this.head = entry;
      this.tail = entry;
      ++this.length;
    };
    BufferList.prototype.unshift = function unshift(v) {
      var entry = { data: v, next: this.head };
      if (this.length === 0)
        this.tail = entry;
      this.head = entry;
      ++this.length;
    };
    BufferList.prototype.shift = function shift() {
      if (this.length === 0)
        return;
      var ret = this.head.data;
      if (this.length === 1)
        this.head = this.tail = null;
      else
        this.head = this.head.next;
      --this.length;
      return ret;
    };
    BufferList.prototype.clear = function clear() {
      this.head = this.tail = null;
      this.length = 0;
    };
    BufferList.prototype.join = function join(s) {
      if (this.length === 0)
        return "";
      var p = this.head;
      var ret = "" + p.data;
      while (p = p.next) {
        ret += s + p.data;
      }
      return ret;
    };
    BufferList.prototype.concat = function concat(n) {
      if (this.length === 0)
        return Buffer2.alloc(0);
      var ret = Buffer2.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    };
    return BufferList;
  }();
  if (util && util.inspect && util.inspect.custom) {
    module.exports.prototype[util.inspect.custom] = function() {
      var obj = util.inspect({ length: this.length });
      return this.constructor.name + " " + obj;
    };
  }
});

// node_modules/.pnpm/readable-stream@2.3.8/node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS((exports, module) => {
  var pna = require_process_nextick_args();
  function destroy(err, cb) {
    var _this = this;
    var readableDestroyed = this._readableState && this._readableState.destroyed;
    var writableDestroyed = this._writableState && this._writableState.destroyed;
    if (readableDestroyed || writableDestroyed) {
      if (cb) {
        cb(err);
      } else if (err) {
        if (!this._writableState) {
          pna.nextTick(emitErrorNT, this, err);
        } else if (!this._writableState.errorEmitted) {
          this._writableState.errorEmitted = true;
          pna.nextTick(emitErrorNT, this, err);
        }
      }
      return this;
    }
    if (this._readableState) {
      this._readableState.destroyed = true;
    }
    if (this._writableState) {
      this._writableState.destroyed = true;
    }
    this._destroy(err || null, function(err2) {
      if (!cb && err2) {
        if (!_this._writableState) {
          pna.nextTick(emitErrorNT, _this, err2);
        } else if (!_this._writableState.errorEmitted) {
          _this._writableState.errorEmitted = true;
          pna.nextTick(emitErrorNT, _this, err2);
        }
      } else if (cb) {
        cb(err2);
      }
    });
    return this;
  }
  function undestroy() {
    if (this._readableState) {
      this._readableState.destroyed = false;
      this._readableState.reading = false;
      this._readableState.ended = false;
      this._readableState.endEmitted = false;
    }
    if (this._writableState) {
      this._writableState.destroyed = false;
      this._writableState.ended = false;
      this._writableState.ending = false;
      this._writableState.finalCalled = false;
      this._writableState.prefinished = false;
      this._writableState.finished = false;
      this._writableState.errorEmitted = false;
    }
  }
  function emitErrorNT(self2, err) {
    self2.emit("error", err);
  }
  module.exports = {
    destroy,
    undestroy
  };
});

// node_modules/.pnpm/util-deprecate@1.0.2/node_modules/util-deprecate/node.js
var require_node = __commonJS((exports, module) => {
  module.exports = __require("util").deprecate;
});

// node_modules/.pnpm/readable-stream@2.3.8/node_modules/readable-stream/lib/_stream_writable.js
var require__stream_writable = __commonJS((exports, module) => {
  var pna = require_process_nextick_args();
  module.exports = Writable;
  function CorkedRequest(state) {
    var _this = this;
    this.next = null;
    this.entry = null;
    this.finish = function() {
      onCorkedFinish(_this, state);
    };
  }
  var asyncWrite = ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
  var Duplex;
  Writable.WritableState = WritableState;
  var util = Object.create(require_util());
  util.inherits = require_inherits();
  var internalUtil = {
    deprecate: require_node()
  };
  var Stream = __require("stream");
  var Buffer2 = require_safe_buffer().Buffer;
  var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {};
  function _uint8ArrayToBuffer(chunk) {
    return Buffer2.from(chunk);
  }
  function _isUint8Array(obj) {
    return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  var destroyImpl = require_destroy();
  util.inherits(Writable, Stream);
  function nop() {}
  function WritableState(options, stream) {
    Duplex = Duplex || require__stream_duplex();
    options = options || {};
    var isDuplex = stream instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex)
      this.objectMode = this.objectMode || !!options.writableObjectMode;
    var hwm = options.highWaterMark;
    var writableHwm = options.writableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0)
      this.highWaterMark = hwm;
    else if (isDuplex && (writableHwm || writableHwm === 0))
      this.highWaterMark = writableHwm;
    else
      this.highWaterMark = defaultHwm;
    this.highWaterMark = Math.floor(this.highWaterMark);
    this.finalCalled = false;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.destroyed = false;
    var noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.length = 0;
    this.writing = false;
    this.corked = 0;
    this.sync = true;
    this.bufferProcessing = false;
    this.onwrite = function(er) {
      onwrite(stream, er);
    };
    this.writecb = null;
    this.writelen = 0;
    this.bufferedRequest = null;
    this.lastBufferedRequest = null;
    this.pendingcb = 0;
    this.prefinished = false;
    this.errorEmitted = false;
    this.bufferedRequestCount = 0;
    this.corkedRequestsFree = new CorkedRequest(this);
  }
  WritableState.prototype.getBuffer = function getBuffer() {
    var current = this.bufferedRequest;
    var out = [];
    while (current) {
      out.push(current);
      current = current.next;
    }
    return out;
  };
  (function() {
    try {
      Object.defineProperty(WritableState.prototype, "buffer", {
        get: internalUtil.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer " + "instead.", "DEP0003")
      });
    } catch (_) {}
  })();
  var realHasInstance;
  if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
    realHasInstance = Function.prototype[Symbol.hasInstance];
    Object.defineProperty(Writable, Symbol.hasInstance, {
      value: function(object) {
        if (realHasInstance.call(this, object))
          return true;
        if (this !== Writable)
          return false;
        return object && object._writableState instanceof WritableState;
      }
    });
  } else {
    realHasInstance = function(object) {
      return object instanceof this;
    };
  }
  function Writable(options) {
    Duplex = Duplex || require__stream_duplex();
    if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
      return new Writable(options);
    }
    this._writableState = new WritableState(options, this);
    this.writable = true;
    if (options) {
      if (typeof options.write === "function")
        this._write = options.write;
      if (typeof options.writev === "function")
        this._writev = options.writev;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
      if (typeof options.final === "function")
        this._final = options.final;
    }
    Stream.call(this);
  }
  Writable.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function writeAfterEnd(stream, cb) {
    var er = new Error("write after end");
    stream.emit("error", er);
    pna.nextTick(cb, er);
  }
  function validChunk(stream, state, chunk, cb) {
    var valid = true;
    var er = false;
    if (chunk === null) {
      er = new TypeError("May not write null values to stream");
    } else if (typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
      er = new TypeError("Invalid non-string/buffer chunk");
    }
    if (er) {
      stream.emit("error", er);
      pna.nextTick(cb, er);
      valid = false;
    }
    return valid;
  }
  Writable.prototype.write = function(chunk, encoding, cb) {
    var state = this._writableState;
    var ret = false;
    var isBuf = !state.objectMode && _isUint8Array(chunk);
    if (isBuf && !Buffer2.isBuffer(chunk)) {
      chunk = _uint8ArrayToBuffer(chunk);
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (isBuf)
      encoding = "buffer";
    else if (!encoding)
      encoding = state.defaultEncoding;
    if (typeof cb !== "function")
      cb = nop;
    if (state.ended)
      writeAfterEnd(this, cb);
    else if (isBuf || validChunk(this, state, chunk, cb)) {
      state.pendingcb++;
      ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
    }
    return ret;
  };
  Writable.prototype.cork = function() {
    var state = this._writableState;
    state.corked++;
  };
  Writable.prototype.uncork = function() {
    var state = this._writableState;
    if (state.corked) {
      state.corked--;
      if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
        clearBuffer(this, state);
    }
  };
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    if (typeof encoding === "string")
      encoding = encoding.toLowerCase();
    if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
      throw new TypeError("Unknown encoding: " + encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
  };
  function decodeChunk(state, chunk, encoding) {
    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
      chunk = Buffer2.from(chunk, encoding);
    }
    return chunk;
  }
  Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
    if (!isBuf) {
      var newChunk = decodeChunk(state, chunk, encoding);
      if (chunk !== newChunk) {
        isBuf = true;
        encoding = "buffer";
        chunk = newChunk;
      }
    }
    var len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    var ret = state.length < state.highWaterMark;
    if (!ret)
      state.needDrain = true;
    if (state.writing || state.corked) {
      var last = state.lastBufferedRequest;
      state.lastBufferedRequest = {
        chunk,
        encoding,
        isBuf,
        callback: cb,
        next: null
      };
      if (last) {
        last.next = state.lastBufferedRequest;
      } else {
        state.bufferedRequest = state.lastBufferedRequest;
      }
      state.bufferedRequestCount += 1;
    } else {
      doWrite(stream, state, false, len, chunk, encoding, cb);
    }
    return ret;
  }
  function doWrite(stream, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (writev)
      stream._writev(chunk, state.onwrite);
    else
      stream._write(chunk, encoding, state.onwrite);
    state.sync = false;
  }
  function onwriteError(stream, state, sync, er, cb) {
    --state.pendingcb;
    if (sync) {
      pna.nextTick(cb, er);
      pna.nextTick(finishMaybe, stream, state);
      stream._writableState.errorEmitted = true;
      stream.emit("error", er);
    } else {
      cb(er);
      stream._writableState.errorEmitted = true;
      stream.emit("error", er);
      finishMaybe(stream, state);
    }
  }
  function onwriteStateUpdate(state) {
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
  }
  function onwrite(stream, er) {
    var state = stream._writableState;
    var sync = state.sync;
    var cb = state.writecb;
    onwriteStateUpdate(state);
    if (er)
      onwriteError(stream, state, sync, er, cb);
    else {
      var finished = needFinish(state);
      if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
        clearBuffer(stream, state);
      }
      if (sync) {
        asyncWrite(afterWrite, stream, state, finished, cb);
      } else {
        afterWrite(stream, state, finished, cb);
      }
    }
  }
  function afterWrite(stream, state, finished, cb) {
    if (!finished)
      onwriteDrain(stream, state);
    state.pendingcb--;
    cb();
    finishMaybe(stream, state);
  }
  function onwriteDrain(stream, state) {
    if (state.length === 0 && state.needDrain) {
      state.needDrain = false;
      stream.emit("drain");
    }
  }
  function clearBuffer(stream, state) {
    state.bufferProcessing = true;
    var entry = state.bufferedRequest;
    if (stream._writev && entry && entry.next) {
      var l = state.bufferedRequestCount;
      var buffer = new Array(l);
      var holder = state.corkedRequestsFree;
      holder.entry = entry;
      var count = 0;
      var allBuffers = true;
      while (entry) {
        buffer[count] = entry;
        if (!entry.isBuf)
          allBuffers = false;
        entry = entry.next;
        count += 1;
      }
      buffer.allBuffers = allBuffers;
      doWrite(stream, state, true, state.length, buffer, "", holder.finish);
      state.pendingcb++;
      state.lastBufferedRequest = null;
      if (holder.next) {
        state.corkedRequestsFree = holder.next;
        holder.next = null;
      } else {
        state.corkedRequestsFree = new CorkedRequest(state);
      }
      state.bufferedRequestCount = 0;
    } else {
      while (entry) {
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state.objectMode ? 1 : chunk.length;
        doWrite(stream, state, false, len, chunk, encoding, cb);
        entry = entry.next;
        state.bufferedRequestCount--;
        if (state.writing) {
          break;
        }
      }
      if (entry === null)
        state.lastBufferedRequest = null;
    }
    state.bufferedRequest = entry;
    state.bufferProcessing = false;
  }
  Writable.prototype._write = function(chunk, encoding, cb) {
    cb(new Error("_write() is not implemented"));
  };
  Writable.prototype._writev = null;
  Writable.prototype.end = function(chunk, encoding, cb) {
    var state = this._writableState;
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (chunk !== null && chunk !== undefined)
      this.write(chunk, encoding);
    if (state.corked) {
      state.corked = 1;
      this.uncork();
    }
    if (!state.ending)
      endWritable(this, state, cb);
  };
  function needFinish(state) {
    return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
  }
  function callFinal(stream, state) {
    stream._final(function(err) {
      state.pendingcb--;
      if (err) {
        stream.emit("error", err);
      }
      state.prefinished = true;
      stream.emit("prefinish");
      finishMaybe(stream, state);
    });
  }
  function prefinish(stream, state) {
    if (!state.prefinished && !state.finalCalled) {
      if (typeof stream._final === "function") {
        state.pendingcb++;
        state.finalCalled = true;
        pna.nextTick(callFinal, stream, state);
      } else {
        state.prefinished = true;
        stream.emit("prefinish");
      }
    }
  }
  function finishMaybe(stream, state) {
    var need = needFinish(state);
    if (need) {
      prefinish(stream, state);
      if (state.pendingcb === 0) {
        state.finished = true;
        stream.emit("finish");
      }
    }
    return need;
  }
  function endWritable(stream, state, cb) {
    state.ending = true;
    finishMaybe(stream, state);
    if (cb) {
      if (state.finished)
        pna.nextTick(cb);
      else
        stream.once("finish", cb);
    }
    state.ended = true;
    stream.writable = false;
  }
  function onCorkedFinish(corkReq, state, err) {
    var entry = corkReq.entry;
    corkReq.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    state.corkedRequestsFree.next = corkReq;
  }
  Object.defineProperty(Writable.prototype, "destroyed", {
    get: function() {
      if (this._writableState === undefined) {
        return false;
      }
      return this._writableState.destroyed;
    },
    set: function(value) {
      if (!this._writableState) {
        return;
      }
      this._writableState.destroyed = value;
    }
  });
  Writable.prototype.destroy = destroyImpl.destroy;
  Writable.prototype._undestroy = destroyImpl.undestroy;
  Writable.prototype._destroy = function(err, cb) {
    this.end();
    cb(err);
  };
});

// node_modules/.pnpm/readable-stream@2.3.8/node_modules/readable-stream/lib/_stream_duplex.js
var require__stream_duplex = __commonJS((exports, module) => {
  var pna = require_process_nextick_args();
  var objectKeys = Object.keys || function(obj) {
    var keys2 = [];
    for (var key in obj) {
      keys2.push(key);
    }
    return keys2;
  };
  module.exports = Duplex;
  var util = Object.create(require_util());
  util.inherits = require_inherits();
  var Readable = require__stream_readable();
  var Writable = require__stream_writable();
  util.inherits(Duplex, Readable);
  {
    keys = objectKeys(Writable.prototype);
    for (v = 0;v < keys.length; v++) {
      method = keys[v];
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    }
  }
  var keys;
  var method;
  var v;
  function Duplex(options) {
    if (!(this instanceof Duplex))
      return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    if (options && options.readable === false)
      this.readable = false;
    if (options && options.writable === false)
      this.writable = false;
    this.allowHalfOpen = true;
    if (options && options.allowHalfOpen === false)
      this.allowHalfOpen = false;
    this.once("end", onend);
  }
  Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function onend() {
    if (this.allowHalfOpen || this._writableState.ended)
      return;
    pna.nextTick(onEndNT, this);
  }
  function onEndNT(self2) {
    self2.end();
  }
  Object.defineProperty(Duplex.prototype, "destroyed", {
    get: function() {
      if (this._readableState === undefined || this._writableState === undefined) {
        return false;
      }
      return this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(value) {
      if (this._readableState === undefined || this._writableState === undefined) {
        return;
      }
      this._readableState.destroyed = value;
      this._writableState.destroyed = value;
    }
  });
  Duplex.prototype._destroy = function(err, cb) {
    this.push(null);
    this.end();
    pna.nextTick(cb, err);
  };
});

// node_modules/.pnpm/string_decoder@1.1.1/node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS((exports) => {
  var Buffer2 = require_safe_buffer().Buffer;
  var isEncoding = Buffer2.isEncoding || function(encoding) {
    encoding = "" + encoding;
    switch (encoding && encoding.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return true;
      default:
        return false;
    }
  };
  function _normalizeEncoding(enc) {
    if (!enc)
      return "utf8";
    var retried;
    while (true) {
      switch (enc) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return enc;
        default:
          if (retried)
            return;
          enc = ("" + enc).toLowerCase();
          retried = true;
      }
    }
  }
  function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc)))
      throw new Error("Unknown encoding: " + enc);
    return nenc || enc;
  }
  exports.StringDecoder = StringDecoder;
  function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch (this.encoding) {
      case "utf16le":
        this.text = utf16Text;
        this.end = utf16End;
        nb = 4;
        break;
      case "utf8":
        this.fillLast = utf8FillLast;
        nb = 4;
        break;
      case "base64":
        this.text = base64Text;
        this.end = base64End;
        nb = 3;
        break;
      default:
        this.write = simpleWrite;
        this.end = simpleEnd;
        return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer2.allocUnsafe(nb);
  }
  StringDecoder.prototype.write = function(buf) {
    if (buf.length === 0)
      return "";
    var r;
    var i;
    if (this.lastNeed) {
      r = this.fillLast(buf);
      if (r === undefined)
        return "";
      i = this.lastNeed;
      this.lastNeed = 0;
    } else {
      i = 0;
    }
    if (i < buf.length)
      return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || "";
  };
  StringDecoder.prototype.end = utf8End;
  StringDecoder.prototype.text = utf8Text;
  StringDecoder.prototype.fillLast = function(buf) {
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
  };
  function utf8CheckByte(byte) {
    if (byte <= 127)
      return 0;
    else if (byte >> 5 === 6)
      return 2;
    else if (byte >> 4 === 14)
      return 3;
    else if (byte >> 3 === 30)
      return 4;
    return byte >> 6 === 2 ? -1 : -2;
  }
  function utf8CheckIncomplete(self2, buf, i) {
    var j = buf.length - 1;
    if (j < i)
      return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0)
        self2.lastNeed = nb - 1;
      return nb;
    }
    if (--j < i || nb === -2)
      return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0)
        self2.lastNeed = nb - 2;
      return nb;
    }
    if (--j < i || nb === -2)
      return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) {
        if (nb === 2)
          nb = 0;
        else
          self2.lastNeed = nb - 3;
      }
      return nb;
    }
    return 0;
  }
  function utf8CheckExtraBytes(self2, buf, p) {
    if ((buf[0] & 192) !== 128) {
      self2.lastNeed = 0;
      return "�";
    }
    if (self2.lastNeed > 1 && buf.length > 1) {
      if ((buf[1] & 192) !== 128) {
        self2.lastNeed = 1;
        return "�";
      }
      if (self2.lastNeed > 2 && buf.length > 2) {
        if ((buf[2] & 192) !== 128) {
          self2.lastNeed = 2;
          return "�";
        }
      }
    }
  }
  function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf, p);
    if (r !== undefined)
      return r;
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, p, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
  }
  function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed)
      return buf.toString("utf8", i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString("utf8", i, end);
  }
  function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed)
      return r + "�";
    return r;
  }
  function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
      var r = buf.toString("utf16le", i);
      if (r) {
        var c = r.charCodeAt(r.length - 1);
        if (c >= 55296 && c <= 56319) {
          this.lastNeed = 2;
          this.lastTotal = 4;
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
          return r.slice(0, -1);
        }
      }
      return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString("utf16le", i, buf.length - 1);
  }
  function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) {
      var end = this.lastTotal - this.lastNeed;
      return r + this.lastChar.toString("utf16le", 0, end);
    }
    return r;
  }
  function base64Text(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0)
      return buf.toString("base64", i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
      this.lastChar[0] = buf[buf.length - 1];
    } else {
      this.lastChar[0] = buf[buf.length - 2];
      this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString("base64", i, buf.length - n);
  }
  function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed)
      return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
    return r;
  }
  function simpleWrite(buf) {
    return buf.toString(this.encoding);
  }
  function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : "";
  }
});

// node_modules/.pnpm/readable-stream@2.3.8/node_modules/readable-stream/lib/_stream_readable.js
var require__stream_readable = __commonJS((exports, module) => {
  var pna = require_process_nextick_args();
  module.exports = Readable;
  var isArray = require_isarray();
  var Duplex;
  Readable.ReadableState = ReadableState;
  var EE = __require("events").EventEmitter;
  var EElistenerCount = function(emitter, type) {
    return emitter.listeners(type).length;
  };
  var Stream = __require("stream");
  var Buffer2 = require_safe_buffer().Buffer;
  var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {};
  function _uint8ArrayToBuffer(chunk) {
    return Buffer2.from(chunk);
  }
  function _isUint8Array(obj) {
    return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  var util = Object.create(require_util());
  util.inherits = require_inherits();
  var debugUtil = __require("util");
  var debug = undefined;
  if (debugUtil && debugUtil.debuglog) {
    debug = debugUtil.debuglog("stream");
  } else {
    debug = function() {};
  }
  var BufferList = require_BufferList();
  var destroyImpl = require_destroy();
  var StringDecoder;
  util.inherits(Readable, Stream);
  var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
  function prependListener(emitter, event, fn) {
    if (typeof emitter.prependListener === "function")
      return emitter.prependListener(event, fn);
    if (!emitter._events || !emitter._events[event])
      emitter.on(event, fn);
    else if (isArray(emitter._events[event]))
      emitter._events[event].unshift(fn);
    else
      emitter._events[event] = [fn, emitter._events[event]];
  }
  function ReadableState(options, stream) {
    Duplex = Duplex || require__stream_duplex();
    options = options || {};
    var isDuplex = stream instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex)
      this.objectMode = this.objectMode || !!options.readableObjectMode;
    var hwm = options.highWaterMark;
    var readableHwm = options.readableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0)
      this.highWaterMark = hwm;
    else if (isDuplex && (readableHwm || readableHwm === 0))
      this.highWaterMark = readableHwm;
    else
      this.highWaterMark = defaultHwm;
    this.highWaterMark = Math.floor(this.highWaterMark);
    this.buffer = new BufferList;
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
    this.sync = true;
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false;
    this.destroyed = false;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.awaitDrain = 0;
    this.readingMore = false;
    this.decoder = null;
    this.encoding = null;
    if (options.encoding) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder().StringDecoder;
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  }
  function Readable(options) {
    Duplex = Duplex || require__stream_duplex();
    if (!(this instanceof Readable))
      return new Readable(options);
    this._readableState = new ReadableState(options, this);
    this.readable = true;
    if (options) {
      if (typeof options.read === "function")
        this._read = options.read;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
    }
    Stream.call(this);
  }
  Object.defineProperty(Readable.prototype, "destroyed", {
    get: function() {
      if (this._readableState === undefined) {
        return false;
      }
      return this._readableState.destroyed;
    },
    set: function(value) {
      if (!this._readableState) {
        return;
      }
      this._readableState.destroyed = value;
    }
  });
  Readable.prototype.destroy = destroyImpl.destroy;
  Readable.prototype._undestroy = destroyImpl.undestroy;
  Readable.prototype._destroy = function(err, cb) {
    this.push(null);
    cb(err);
  };
  Readable.prototype.push = function(chunk, encoding) {
    var state = this._readableState;
    var skipChunkCheck;
    if (!state.objectMode) {
      if (typeof chunk === "string") {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = Buffer2.from(chunk, encoding);
          encoding = "";
        }
        skipChunkCheck = true;
      }
    } else {
      skipChunkCheck = true;
    }
    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
  };
  Readable.prototype.unshift = function(chunk) {
    return readableAddChunk(this, chunk, null, true, false);
  };
  function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
    var state = stream._readableState;
    if (chunk === null) {
      state.reading = false;
      onEofChunk(stream, state);
    } else {
      var er;
      if (!skipChunkCheck)
        er = chunkInvalid(state, chunk);
      if (er) {
        stream.emit("error", er);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
          chunk = _uint8ArrayToBuffer(chunk);
        }
        if (addToFront) {
          if (state.endEmitted)
            stream.emit("error", new Error("stream.unshift() after end event"));
          else
            addChunk(stream, state, chunk, true);
        } else if (state.ended) {
          stream.emit("error", new Error("stream.push() after EOF"));
        } else {
          state.reading = false;
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk);
            if (state.objectMode || chunk.length !== 0)
              addChunk(stream, state, chunk, false);
            else
              maybeReadMore(stream, state);
          } else {
            addChunk(stream, state, chunk, false);
          }
        }
      } else if (!addToFront) {
        state.reading = false;
      }
    }
    return needMoreData(state);
  }
  function addChunk(stream, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync) {
      stream.emit("data", chunk);
      stream.read(0);
    } else {
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront)
        state.buffer.unshift(chunk);
      else
        state.buffer.push(chunk);
      if (state.needReadable)
        emitReadable(stream);
    }
    maybeReadMore(stream, state);
  }
  function chunkInvalid(state, chunk) {
    var er;
    if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
      er = new TypeError("Invalid non-string/buffer chunk");
    }
    return er;
  }
  function needMoreData(state) {
    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
  }
  Readable.prototype.isPaused = function() {
    return this._readableState.flowing === false;
  };
  Readable.prototype.setEncoding = function(enc) {
    if (!StringDecoder)
      StringDecoder = require_string_decoder().StringDecoder;
    this._readableState.decoder = new StringDecoder(enc);
    this._readableState.encoding = enc;
    return this;
  };
  var MAX_HWM = 8388608;
  function computeNewHighWaterMark(n) {
    if (n >= MAX_HWM) {
      n = MAX_HWM;
    } else {
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }
    return n;
  }
  function howMuchToRead(n, state) {
    if (n <= 0 || state.length === 0 && state.ended)
      return 0;
    if (state.objectMode)
      return 1;
    if (n !== n) {
      if (state.flowing && state.length)
        return state.buffer.head.data.length;
      else
        return state.length;
    }
    if (n > state.highWaterMark)
      state.highWaterMark = computeNewHighWaterMark(n);
    if (n <= state.length)
      return n;
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    }
    return state.length;
  }
  Readable.prototype.read = function(n) {
    debug("read", n);
    n = parseInt(n, 10);
    var state = this._readableState;
    var nOrig = n;
    if (n !== 0)
      state.emittedReadable = false;
    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
      debug("read: emitReadable", state.length, state.ended);
      if (state.length === 0 && state.ended)
        endReadable(this);
      else
        emitReadable(this);
      return null;
    }
    n = howMuchToRead(n, state);
    if (n === 0 && state.ended) {
      if (state.length === 0)
        endReadable(this);
      return null;
    }
    var doRead = state.needReadable;
    debug("need readable", doRead);
    if (state.length === 0 || state.length - n < state.highWaterMark) {
      doRead = true;
      debug("length less than watermark", doRead);
    }
    if (state.ended || state.reading) {
      doRead = false;
      debug("reading or ended", doRead);
    } else if (doRead) {
      debug("do read");
      state.reading = true;
      state.sync = true;
      if (state.length === 0)
        state.needReadable = true;
      this._read(state.highWaterMark);
      state.sync = false;
      if (!state.reading)
        n = howMuchToRead(nOrig, state);
    }
    var ret;
    if (n > 0)
      ret = fromList(n, state);
    else
      ret = null;
    if (ret === null) {
      state.needReadable = true;
      n = 0;
    } else {
      state.length -= n;
    }
    if (state.length === 0) {
      if (!state.ended)
        state.needReadable = true;
      if (nOrig !== n && state.ended)
        endReadable(this);
    }
    if (ret !== null)
      this.emit("data", ret);
    return ret;
  };
  function onEofChunk(stream, state) {
    if (state.ended)
      return;
    if (state.decoder) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) {
        state.buffer.push(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
      }
    }
    state.ended = true;
    emitReadable(stream);
  }
  function emitReadable(stream) {
    var state = stream._readableState;
    state.needReadable = false;
    if (!state.emittedReadable) {
      debug("emitReadable", state.flowing);
      state.emittedReadable = true;
      if (state.sync)
        pna.nextTick(emitReadable_, stream);
      else
        emitReadable_(stream);
    }
  }
  function emitReadable_(stream) {
    debug("emit readable");
    stream.emit("readable");
    flow(stream);
  }
  function maybeReadMore(stream, state) {
    if (!state.readingMore) {
      state.readingMore = true;
      pna.nextTick(maybeReadMore_, stream, state);
    }
  }
  function maybeReadMore_(stream, state) {
    var len = state.length;
    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
      debug("maybeReadMore read 0");
      stream.read(0);
      if (len === state.length)
        break;
      else
        len = state.length;
    }
    state.readingMore = false;
  }
  Readable.prototype._read = function(n) {
    this.emit("error", new Error("_read() is not implemented"));
  };
  Readable.prototype.pipe = function(dest, pipeOpts) {
    var src = this;
    var state = this._readableState;
    switch (state.pipesCount) {
      case 0:
        state.pipes = dest;
        break;
      case 1:
        state.pipes = [state.pipes, dest];
        break;
      default:
        state.pipes.push(dest);
        break;
    }
    state.pipesCount += 1;
    debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
    var endFn = doEnd ? onend : unpipe;
    if (state.endEmitted)
      pna.nextTick(endFn);
    else
      src.once("end", endFn);
    dest.on("unpipe", onunpipe);
    function onunpipe(readable, unpipeInfo) {
      debug("onunpipe");
      if (readable === src) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true;
          cleanup();
        }
      }
    }
    function onend() {
      debug("onend");
      dest.end();
    }
    var ondrain = pipeOnDrain(src);
    dest.on("drain", ondrain);
    var cleanedUp = false;
    function cleanup() {
      debug("cleanup");
      dest.removeListener("close", onclose);
      dest.removeListener("finish", onfinish);
      dest.removeListener("drain", ondrain);
      dest.removeListener("error", onerror);
      dest.removeListener("unpipe", onunpipe);
      src.removeListener("end", onend);
      src.removeListener("end", unpipe);
      src.removeListener("data", ondata);
      cleanedUp = true;
      if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
        ondrain();
    }
    var increasedAwaitDrain = false;
    src.on("data", ondata);
    function ondata(chunk) {
      debug("ondata");
      increasedAwaitDrain = false;
      var ret = dest.write(chunk);
      if (ret === false && !increasedAwaitDrain) {
        if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
          debug("false write response, pause", state.awaitDrain);
          state.awaitDrain++;
          increasedAwaitDrain = true;
        }
        src.pause();
      }
    }
    function onerror(er) {
      debug("onerror", er);
      unpipe();
      dest.removeListener("error", onerror);
      if (EElistenerCount(dest, "error") === 0)
        dest.emit("error", er);
    }
    prependListener(dest, "error", onerror);
    function onclose() {
      dest.removeListener("finish", onfinish);
      unpipe();
    }
    dest.once("close", onclose);
    function onfinish() {
      debug("onfinish");
      dest.removeListener("close", onclose);
      unpipe();
    }
    dest.once("finish", onfinish);
    function unpipe() {
      debug("unpipe");
      src.unpipe(dest);
    }
    dest.emit("pipe", src);
    if (!state.flowing) {
      debug("pipe resume");
      src.resume();
    }
    return dest;
  };
  function pipeOnDrain(src) {
    return function() {
      var state = src._readableState;
      debug("pipeOnDrain", state.awaitDrain);
      if (state.awaitDrain)
        state.awaitDrain--;
      if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
        state.flowing = true;
        flow(src);
      }
    };
  }
  Readable.prototype.unpipe = function(dest) {
    var state = this._readableState;
    var unpipeInfo = { hasUnpiped: false };
    if (state.pipesCount === 0)
      return this;
    if (state.pipesCount === 1) {
      if (dest && dest !== state.pipes)
        return this;
      if (!dest)
        dest = state.pipes;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      if (dest)
        dest.emit("unpipe", this, unpipeInfo);
      return this;
    }
    if (!dest) {
      var dests = state.pipes;
      var len = state.pipesCount;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      for (var i = 0;i < len; i++) {
        dests[i].emit("unpipe", this, { hasUnpiped: false });
      }
      return this;
    }
    var index = indexOf(state.pipes, dest);
    if (index === -1)
      return this;
    state.pipes.splice(index, 1);
    state.pipesCount -= 1;
    if (state.pipesCount === 1)
      state.pipes = state.pipes[0];
    dest.emit("unpipe", this, unpipeInfo);
    return this;
  };
  Readable.prototype.on = function(ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn);
    if (ev === "data") {
      if (this._readableState.flowing !== false)
        this.resume();
    } else if (ev === "readable") {
      var state = this._readableState;
      if (!state.endEmitted && !state.readableListening) {
        state.readableListening = state.needReadable = true;
        state.emittedReadable = false;
        if (!state.reading) {
          pna.nextTick(nReadingNextTick, this);
        } else if (state.length) {
          emitReadable(this);
        }
      }
    }
    return res;
  };
  Readable.prototype.addListener = Readable.prototype.on;
  function nReadingNextTick(self2) {
    debug("readable nexttick read 0");
    self2.read(0);
  }
  Readable.prototype.resume = function() {
    var state = this._readableState;
    if (!state.flowing) {
      debug("resume");
      state.flowing = true;
      resume(this, state);
    }
    return this;
  };
  function resume(stream, state) {
    if (!state.resumeScheduled) {
      state.resumeScheduled = true;
      pna.nextTick(resume_, stream, state);
    }
  }
  function resume_(stream, state) {
    if (!state.reading) {
      debug("resume read 0");
      stream.read(0);
    }
    state.resumeScheduled = false;
    state.awaitDrain = 0;
    stream.emit("resume");
    flow(stream);
    if (state.flowing && !state.reading)
      stream.read(0);
  }
  Readable.prototype.pause = function() {
    debug("call pause flowing=%j", this._readableState.flowing);
    if (this._readableState.flowing !== false) {
      debug("pause");
      this._readableState.flowing = false;
      this.emit("pause");
    }
    return this;
  };
  function flow(stream) {
    var state = stream._readableState;
    debug("flow", state.flowing);
    while (state.flowing && stream.read() !== null) {}
  }
  Readable.prototype.wrap = function(stream) {
    var _this = this;
    var state = this._readableState;
    var paused = false;
    stream.on("end", function() {
      debug("wrapped end");
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length)
          _this.push(chunk);
      }
      _this.push(null);
    });
    stream.on("data", function(chunk) {
      debug("wrapped data");
      if (state.decoder)
        chunk = state.decoder.write(chunk);
      if (state.objectMode && (chunk === null || chunk === undefined))
        return;
      else if (!state.objectMode && (!chunk || !chunk.length))
        return;
      var ret = _this.push(chunk);
      if (!ret) {
        paused = true;
        stream.pause();
      }
    });
    for (var i in stream) {
      if (this[i] === undefined && typeof stream[i] === "function") {
        this[i] = function(method) {
          return function() {
            return stream[method].apply(stream, arguments);
          };
        }(i);
      }
    }
    for (var n = 0;n < kProxyEvents.length; n++) {
      stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
    }
    this._read = function(n2) {
      debug("wrapped _read", n2);
      if (paused) {
        paused = false;
        stream.resume();
      }
    };
    return this;
  };
  Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._readableState.highWaterMark;
    }
  });
  Readable._fromList = fromList;
  function fromList(n, state) {
    if (state.length === 0)
      return null;
    var ret;
    if (state.objectMode)
      ret = state.buffer.shift();
    else if (!n || n >= state.length) {
      if (state.decoder)
        ret = state.buffer.join("");
      else if (state.buffer.length === 1)
        ret = state.buffer.head.data;
      else
        ret = state.buffer.concat(state.length);
      state.buffer.clear();
    } else {
      ret = fromListPartial(n, state.buffer, state.decoder);
    }
    return ret;
  }
  function fromListPartial(n, list, hasStrings) {
    var ret;
    if (n < list.head.data.length) {
      ret = list.head.data.slice(0, n);
      list.head.data = list.head.data.slice(n);
    } else if (n === list.head.data.length) {
      ret = list.shift();
    } else {
      ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
    }
    return ret;
  }
  function copyFromBufferString(n, list) {
    var p = list.head;
    var c = 1;
    var ret = p.data;
    n -= ret.length;
    while (p = p.next) {
      var str = p.data;
      var nb = n > str.length ? str.length : n;
      if (nb === str.length)
        ret += str;
      else
        ret += str.slice(0, n);
      n -= nb;
      if (n === 0) {
        if (nb === str.length) {
          ++c;
          if (p.next)
            list.head = p.next;
          else
            list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = str.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  }
  function copyFromBuffer(n, list) {
    var ret = Buffer2.allocUnsafe(n);
    var p = list.head;
    var c = 1;
    p.data.copy(ret);
    n -= p.data.length;
    while (p = p.next) {
      var buf = p.data;
      var nb = n > buf.length ? buf.length : n;
      buf.copy(ret, ret.length - n, 0, nb);
      n -= nb;
      if (n === 0) {
        if (nb === buf.length) {
          ++c;
          if (p.next)
            list.head = p.next;
          else
            list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = buf.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  }
  function endReadable(stream) {
    var state = stream._readableState;
    if (state.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');
    if (!state.endEmitted) {
      state.ended = true;
      pna.nextTick(endReadableNT, state, stream);
    }
  }
  function endReadableNT(state, stream) {
    if (!state.endEmitted && state.length === 0) {
      state.endEmitted = true;
      stream.readable = false;
      stream.emit("end");
    }
  }
  function indexOf(xs, x) {
    for (var i = 0, l = xs.length;i < l; i++) {
      if (xs[i] === x)
        return i;
    }
    return -1;
  }
});

// node_modules/.pnpm/readable-stream@2.3.8/node_modules/readable-stream/lib/_stream_transform.js
var require__stream_transform = __commonJS((exports, module) => {
  module.exports = Transform;
  var Duplex = require__stream_duplex();
  var util = Object.create(require_util());
  util.inherits = require_inherits();
  util.inherits(Transform, Duplex);
  function afterTransform(er, data) {
    var ts = this._transformState;
    ts.transforming = false;
    var cb = ts.writecb;
    if (!cb) {
      return this.emit("error", new Error("write callback called multiple times"));
    }
    ts.writechunk = null;
    ts.writecb = null;
    if (data != null)
      this.push(data);
    cb(er);
    var rs = this._readableState;
    rs.reading = false;
    if (rs.needReadable || rs.length < rs.highWaterMark) {
      this._read(rs.highWaterMark);
    }
  }
  function Transform(options) {
    if (!(this instanceof Transform))
      return new Transform(options);
    Duplex.call(this, options);
    this._transformState = {
      afterTransform: afterTransform.bind(this),
      needTransform: false,
      transforming: false,
      writecb: null,
      writechunk: null,
      writeencoding: null
    };
    this._readableState.needReadable = true;
    this._readableState.sync = false;
    if (options) {
      if (typeof options.transform === "function")
        this._transform = options.transform;
      if (typeof options.flush === "function")
        this._flush = options.flush;
    }
    this.on("prefinish", prefinish);
  }
  function prefinish() {
    var _this = this;
    if (typeof this._flush === "function") {
      this._flush(function(er, data) {
        done(_this, er, data);
      });
    } else {
      done(this, null, null);
    }
  }
  Transform.prototype.push = function(chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
  };
  Transform.prototype._transform = function(chunk, encoding, cb) {
    throw new Error("_transform() is not implemented");
  };
  Transform.prototype._write = function(chunk, encoding, cb) {
    var ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;
    if (!ts.transforming) {
      var rs = this._readableState;
      if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
        this._read(rs.highWaterMark);
    }
  };
  Transform.prototype._read = function(n) {
    var ts = this._transformState;
    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
      ts.transforming = true;
      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
      ts.needTransform = true;
    }
  };
  Transform.prototype._destroy = function(err, cb) {
    var _this2 = this;
    Duplex.prototype._destroy.call(this, err, function(err2) {
      cb(err2);
      _this2.emit("close");
    });
  };
  function done(stream, er, data) {
    if (er)
      return stream.emit("error", er);
    if (data != null)
      stream.push(data);
    if (stream._writableState.length)
      throw new Error("Calling transform done when ws.length != 0");
    if (stream._transformState.transforming)
      throw new Error("Calling transform done when still transforming");
    return stream.push(null);
  }
});

// node_modules/.pnpm/readable-stream@2.3.8/node_modules/readable-stream/lib/_stream_passthrough.js
var require__stream_passthrough = __commonJS((exports, module) => {
  module.exports = PassThrough;
  var Transform = require__stream_transform();
  var util = Object.create(require_util());
  util.inherits = require_inherits();
  util.inherits(PassThrough, Transform);
  function PassThrough(options) {
    if (!(this instanceof PassThrough))
      return new PassThrough(options);
    Transform.call(this, options);
  }
  PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
  };
});

// node_modules/.pnpm/readable-stream@2.3.8/node_modules/readable-stream/readable.js
var require_readable = __commonJS((exports, module) => {
  var Stream = __require("stream");
  if (process.env.READABLE_STREAM === "disable" && Stream) {
    module.exports = Stream;
    exports = module.exports = Stream.Readable;
    exports.Readable = Stream.Readable;
    exports.Writable = Stream.Writable;
    exports.Duplex = Stream.Duplex;
    exports.Transform = Stream.Transform;
    exports.PassThrough = Stream.PassThrough;
    exports.Stream = Stream;
  } else {
    exports = module.exports = require__stream_readable();
    exports.Stream = Stream || exports;
    exports.Readable = exports;
    exports.Writable = require__stream_writable();
    exports.Duplex = require__stream_duplex();
    exports.Transform = require__stream_transform();
    exports.PassThrough = require__stream_passthrough();
  }
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/support.js
var require_support = __commonJS((exports) => {
  exports.base64 = true;
  exports.array = true;
  exports.string = true;
  exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
  exports.nodebuffer = typeof Buffer !== "undefined";
  exports.uint8array = typeof Uint8Array !== "undefined";
  if (typeof ArrayBuffer === "undefined") {
    exports.blob = false;
  } else {
    buffer = new ArrayBuffer(0);
    try {
      exports.blob = new Blob([buffer], {
        type: "application/zip"
      }).size === 0;
    } catch (e) {
      try {
        Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
        builder = new Builder;
        builder.append(buffer);
        exports.blob = builder.getBlob("application/zip").size === 0;
      } catch (e2) {
        exports.blob = false;
      }
    }
  }
  var buffer;
  var Builder;
  var builder;
  try {
    exports.nodestream = !!require_readable().Readable;
  } catch (e) {
    exports.nodestream = false;
  }
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/base64.js
var require_base64 = __commonJS((exports) => {
  var utils = require_utils();
  var support = require_support();
  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  exports.encode = function(input) {
    var output = [];
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0, len = input.length, remainingBytes = len;
    var isArray = utils.getTypeOf(input) !== "string";
    while (i < input.length) {
      remainingBytes = len - i;
      if (!isArray) {
        chr1 = input.charCodeAt(i++);
        chr2 = i < len ? input.charCodeAt(i++) : 0;
        chr3 = i < len ? input.charCodeAt(i++) : 0;
      } else {
        chr1 = input[i++];
        chr2 = i < len ? input[i++] : 0;
        chr3 = i < len ? input[i++] : 0;
      }
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = remainingBytes > 1 ? (chr2 & 15) << 2 | chr3 >> 6 : 64;
      enc4 = remainingBytes > 2 ? chr3 & 63 : 64;
      output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));
    }
    return output.join("");
  };
  exports.decode = function(input) {
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0, resultIndex = 0;
    var dataUrlPrefix = "data:";
    if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix) {
      throw new Error("Invalid base64 input, it looks like a data url.");
    }
    input = input.replace(/[^A-Za-z0-9+/=]/g, "");
    var totalLength = input.length * 3 / 4;
    if (input.charAt(input.length - 1) === _keyStr.charAt(64)) {
      totalLength--;
    }
    if (input.charAt(input.length - 2) === _keyStr.charAt(64)) {
      totalLength--;
    }
    if (totalLength % 1 !== 0) {
      throw new Error("Invalid base64 input, bad content length.");
    }
    var output;
    if (support.uint8array) {
      output = new Uint8Array(totalLength | 0);
    } else {
      output = new Array(totalLength | 0);
    }
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output[resultIndex++] = chr1;
      if (enc3 !== 64) {
        output[resultIndex++] = chr2;
      }
      if (enc4 !== 64) {
        output[resultIndex++] = chr3;
      }
    }
    return output;
  };
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/nodejsUtils.js
var require_nodejsUtils = __commonJS((exports, module) => {
  module.exports = {
    isNode: typeof Buffer !== "undefined",
    newBufferFrom: function(data, encoding) {
      if (Buffer.from && Buffer.from !== Uint8Array.from) {
        return Buffer.from(data, encoding);
      } else {
        if (typeof data === "number") {
          throw new Error('The "data" argument must not be a number');
        }
        return new Buffer(data, encoding);
      }
    },
    allocBuffer: function(size) {
      if (Buffer.alloc) {
        return Buffer.alloc(size);
      } else {
        var buf = new Buffer(size);
        buf.fill(0);
        return buf;
      }
    },
    isBuffer: function(b) {
      return Buffer.isBuffer(b);
    },
    isStream: function(obj) {
      return obj && typeof obj.on === "function" && typeof obj.pause === "function" && typeof obj.resume === "function";
    }
  };
});

// node_modules/.pnpm/immediate@3.0.6/node_modules/immediate/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var Mutation = global.MutationObserver || global.WebKitMutationObserver;
  var scheduleDrain;
  if (false) {} else {
    scheduleDrain = function() {
      process.nextTick(nextTick);
    };
  }
  var called;
  var observer;
  var element;
  var channel;
  var draining;
  var queue = [];
  function nextTick() {
    draining = true;
    var i, oldQueue;
    var len = queue.length;
    while (len) {
      oldQueue = queue;
      queue = [];
      i = -1;
      while (++i < len) {
        oldQueue[i]();
      }
      len = queue.length;
    }
    draining = false;
  }
  module.exports = immediate;
  function immediate(task) {
    if (queue.push(task) === 1 && !draining) {
      scheduleDrain();
    }
  }
});

// node_modules/.pnpm/lie@3.3.0/node_modules/lie/lib/index.js
var require_lib2 = __commonJS((exports, module) => {
  var immediate = require_lib();
  function INTERNAL() {}
  var handlers = {};
  var REJECTED = ["REJECTED"];
  var FULFILLED = ["FULFILLED"];
  var PENDING = ["PENDING"];
  if (true) {
    UNHANDLED = ["UNHANDLED"];
  }
  var UNHANDLED;
  module.exports = Promise2;
  function Promise2(resolver) {
    if (typeof resolver !== "function") {
      throw new TypeError("resolver must be a function");
    }
    this.state = PENDING;
    this.queue = [];
    this.outcome = undefined;
    if (true) {
      this.handled = UNHANDLED;
    }
    if (resolver !== INTERNAL) {
      safelyResolveThenable(this, resolver);
    }
  }
  Promise2.prototype.finally = function(callback) {
    if (typeof callback !== "function") {
      return this;
    }
    var p = this.constructor;
    return this.then(resolve2, reject2);
    function resolve2(value) {
      function yes() {
        return value;
      }
      return p.resolve(callback()).then(yes);
    }
    function reject2(reason) {
      function no() {
        throw reason;
      }
      return p.resolve(callback()).then(no);
    }
  };
  Promise2.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
  };
  Promise2.prototype.then = function(onFulfilled, onRejected) {
    if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
      return this;
    }
    var promise = new this.constructor(INTERNAL);
    if (true) {
      if (this.handled === UNHANDLED) {
        this.handled = null;
      }
    }
    if (this.state !== PENDING) {
      var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
      unwrap(promise, resolver, this.outcome);
    } else {
      this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
    }
    return promise;
  };
  function QueueItem(promise, onFulfilled, onRejected) {
    this.promise = promise;
    if (typeof onFulfilled === "function") {
      this.onFulfilled = onFulfilled;
      this.callFulfilled = this.otherCallFulfilled;
    }
    if (typeof onRejected === "function") {
      this.onRejected = onRejected;
      this.callRejected = this.otherCallRejected;
    }
  }
  QueueItem.prototype.callFulfilled = function(value) {
    handlers.resolve(this.promise, value);
  };
  QueueItem.prototype.otherCallFulfilled = function(value) {
    unwrap(this.promise, this.onFulfilled, value);
  };
  QueueItem.prototype.callRejected = function(value) {
    handlers.reject(this.promise, value);
  };
  QueueItem.prototype.otherCallRejected = function(value) {
    unwrap(this.promise, this.onRejected, value);
  };
  function unwrap(promise, func, value) {
    immediate(function() {
      var returnValue;
      try {
        returnValue = func(value);
      } catch (e) {
        return handlers.reject(promise, e);
      }
      if (returnValue === promise) {
        handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
      } else {
        handlers.resolve(promise, returnValue);
      }
    });
  }
  handlers.resolve = function(self2, value) {
    var result = tryCatch(getThen, value);
    if (result.status === "error") {
      return handlers.reject(self2, result.value);
    }
    var thenable = result.value;
    if (thenable) {
      safelyResolveThenable(self2, thenable);
    } else {
      self2.state = FULFILLED;
      self2.outcome = value;
      var i = -1;
      var len = self2.queue.length;
      while (++i < len) {
        self2.queue[i].callFulfilled(value);
      }
    }
    return self2;
  };
  handlers.reject = function(self2, error) {
    self2.state = REJECTED;
    self2.outcome = error;
    if (true) {
      if (self2.handled === UNHANDLED) {
        immediate(function() {
          if (self2.handled === UNHANDLED) {
            process.emit("unhandledRejection", error, self2);
          }
        });
      }
    }
    var i = -1;
    var len = self2.queue.length;
    while (++i < len) {
      self2.queue[i].callRejected(error);
    }
    return self2;
  };
  function getThen(obj) {
    var then = obj && obj.then;
    if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
      return function appyThen() {
        then.apply(obj, arguments);
      };
    }
  }
  function safelyResolveThenable(self2, thenable) {
    var called = false;
    function onError(value) {
      if (called) {
        return;
      }
      called = true;
      handlers.reject(self2, value);
    }
    function onSuccess(value) {
      if (called) {
        return;
      }
      called = true;
      handlers.resolve(self2, value);
    }
    function tryToUnwrap() {
      thenable(onSuccess, onError);
    }
    var result = tryCatch(tryToUnwrap);
    if (result.status === "error") {
      onError(result.value);
    }
  }
  function tryCatch(func, value) {
    var out = {};
    try {
      out.value = func(value);
      out.status = "success";
    } catch (e) {
      out.status = "error";
      out.value = e;
    }
    return out;
  }
  Promise2.resolve = resolve;
  function resolve(value) {
    if (value instanceof this) {
      return value;
    }
    return handlers.resolve(new this(INTERNAL), value);
  }
  Promise2.reject = reject;
  function reject(reason) {
    var promise = new this(INTERNAL);
    return handlers.reject(promise, reason);
  }
  Promise2.all = all;
  function all(iterable) {
    var self2 = this;
    if (Object.prototype.toString.call(iterable) !== "[object Array]") {
      return this.reject(new TypeError("must be an array"));
    }
    var len = iterable.length;
    var called = false;
    if (!len) {
      return this.resolve([]);
    }
    var values = new Array(len);
    var resolved = 0;
    var i = -1;
    var promise = new this(INTERNAL);
    while (++i < len) {
      allResolver(iterable[i], i);
    }
    return promise;
    function allResolver(value, i2) {
      self2.resolve(value).then(resolveFromAll, function(error) {
        if (!called) {
          called = true;
          handlers.reject(promise, error);
        }
      });
      function resolveFromAll(outValue) {
        values[i2] = outValue;
        if (++resolved === len && !called) {
          called = true;
          handlers.resolve(promise, values);
        }
      }
    }
  }
  Promise2.race = race;
  function race(iterable) {
    var self2 = this;
    if (Object.prototype.toString.call(iterable) !== "[object Array]") {
      return this.reject(new TypeError("must be an array"));
    }
    var len = iterable.length;
    var called = false;
    if (!len) {
      return this.resolve([]);
    }
    var i = -1;
    var promise = new this(INTERNAL);
    while (++i < len) {
      resolver(iterable[i]);
    }
    return promise;
    function resolver(value) {
      self2.resolve(value).then(function(response) {
        if (!called) {
          called = true;
          handlers.resolve(promise, response);
        }
      }, function(error) {
        if (!called) {
          called = true;
          handlers.reject(promise, error);
        }
      });
    }
  }
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/external.js
var require_external = __commonJS((exports, module) => {
  var ES6Promise = null;
  if (typeof Promise !== "undefined") {
    ES6Promise = Promise;
  } else {
    ES6Promise = require_lib2();
  }
  module.exports = {
    Promise: ES6Promise
  };
});

// node_modules/.pnpm/setimmediate@1.0.5/node_modules/setimmediate/setImmediate.js
var require_setImmediate = __commonJS((exports) => {
  (function(global2, undefined2) {
    if (global2.setImmediate) {
      return;
    }
    var nextHandle = 1;
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global2.document;
    var registerImmediate;
    function setImmediate2(callback) {
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      var args = new Array(arguments.length - 1);
      for (var i = 0;i < args.length; i++) {
        args[i] = arguments[i + 1];
      }
      var task = { callback, args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }
    function clearImmediate(handle) {
      delete tasksByHandle[handle];
    }
    function run(task) {
      var callback = task.callback;
      var args = task.args;
      switch (args.length) {
        case 0:
          callback();
          break;
        case 1:
          callback(args[0]);
          break;
        case 2:
          callback(args[0], args[1]);
          break;
        case 3:
          callback(args[0], args[1], args[2]);
          break;
        default:
          callback.apply(undefined2, args);
          break;
      }
    }
    function runIfPresent(handle) {
      if (currentlyRunningATask) {
        setTimeout(runIfPresent, 0, handle);
      } else {
        var task = tasksByHandle[handle];
        if (task) {
          currentlyRunningATask = true;
          try {
            run(task);
          } finally {
            clearImmediate(handle);
            currentlyRunningATask = false;
          }
        }
      }
    }
    function installNextTickImplementation() {
      registerImmediate = function(handle) {
        process.nextTick(function() {
          runIfPresent(handle);
        });
      };
    }
    function canUsePostMessage() {
      if (global2.postMessage && !global2.importScripts) {
        var postMessageIsAsynchronous = true;
        var oldOnMessage = global2.onmessage;
        global2.onmessage = function() {
          postMessageIsAsynchronous = false;
        };
        global2.postMessage("", "*");
        global2.onmessage = oldOnMessage;
        return postMessageIsAsynchronous;
      }
    }
    function installPostMessageImplementation() {
      var messagePrefix = "setImmediate$" + Math.random() + "$";
      var onGlobalMessage = function(event) {
        if (event.source === global2 && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
          runIfPresent(+event.data.slice(messagePrefix.length));
        }
      };
      if (global2.addEventListener) {
        global2.addEventListener("message", onGlobalMessage, false);
      } else {
        global2.attachEvent("onmessage", onGlobalMessage);
      }
      registerImmediate = function(handle) {
        global2.postMessage(messagePrefix + handle, "*");
      };
    }
    function installMessageChannelImplementation() {
      var channel = new MessageChannel;
      channel.port1.onmessage = function(event) {
        var handle = event.data;
        runIfPresent(handle);
      };
      registerImmediate = function(handle) {
        channel.port2.postMessage(handle);
      };
    }
    function installReadyStateChangeImplementation() {
      var html = doc.documentElement;
      registerImmediate = function(handle) {
        var script = doc.createElement("script");
        script.onreadystatechange = function() {
          runIfPresent(handle);
          script.onreadystatechange = null;
          html.removeChild(script);
          script = null;
        };
        html.appendChild(script);
      };
    }
    function installSetTimeoutImplementation() {
      registerImmediate = function(handle) {
        setTimeout(runIfPresent, 0, handle);
      };
    }
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global2);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global2;
    if ({}.toString.call(global2.process) === "[object process]") {
      installNextTickImplementation();
    } else if (canUsePostMessage()) {
      installPostMessageImplementation();
    } else if (global2.MessageChannel) {
      installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
      installReadyStateChangeImplementation();
    } else {
      installSetTimeoutImplementation();
    }
    attachTo.setImmediate = setImmediate2;
    attachTo.clearImmediate = clearImmediate;
  })(typeof self === "undefined" ? typeof global === "undefined" ? exports : global : self);
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/utils.js
var require_utils = __commonJS((exports) => {
  var support = require_support();
  var base64 = require_base64();
  var nodejsUtils = require_nodejsUtils();
  var external = require_external();
  require_setImmediate();
  function string2binary(str) {
    var result = null;
    if (support.uint8array) {
      result = new Uint8Array(str.length);
    } else {
      result = new Array(str.length);
    }
    return stringToArrayLike(str, result);
  }
  exports.newBlob = function(part, type) {
    exports.checkSupport("blob");
    try {
      return new Blob([part], {
        type
      });
    } catch (e) {
      try {
        var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
        var builder = new Builder;
        builder.append(part);
        return builder.getBlob(type);
      } catch (e2) {
        throw new Error("Bug : can't construct the Blob.");
      }
    }
  };
  function identity(input) {
    return input;
  }
  function stringToArrayLike(str, array) {
    for (var i = 0;i < str.length; ++i) {
      array[i] = str.charCodeAt(i) & 255;
    }
    return array;
  }
  var arrayToStringHelper = {
    stringifyByChunk: function(array, type, chunk) {
      var result = [], k = 0, len = array.length;
      if (len <= chunk) {
        return String.fromCharCode.apply(null, array);
      }
      while (k < len) {
        if (type === "array" || type === "nodebuffer") {
          result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
        } else {
          result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
        }
        k += chunk;
      }
      return result.join("");
    },
    stringifyByChar: function(array) {
      var resultStr = "";
      for (var i = 0;i < array.length; i++) {
        resultStr += String.fromCharCode(array[i]);
      }
      return resultStr;
    },
    applyCanBeUsed: {
      uint8array: function() {
        try {
          return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
        } catch (e) {
          return false;
        }
      }(),
      nodebuffer: function() {
        try {
          return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
        } catch (e) {
          return false;
        }
      }()
    }
  };
  function arrayLikeToString(array) {
    var chunk = 65536, type = exports.getTypeOf(array), canUseApply = true;
    if (type === "uint8array") {
      canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
    } else if (type === "nodebuffer") {
      canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
    }
    if (canUseApply) {
      while (chunk > 1) {
        try {
          return arrayToStringHelper.stringifyByChunk(array, type, chunk);
        } catch (e) {
          chunk = Math.floor(chunk / 2);
        }
      }
    }
    return arrayToStringHelper.stringifyByChar(array);
  }
  exports.applyFromCharCode = arrayLikeToString;
  function arrayLikeToArrayLike(arrayFrom, arrayTo) {
    for (var i = 0;i < arrayFrom.length; i++) {
      arrayTo[i] = arrayFrom[i];
    }
    return arrayTo;
  }
  var transform = {};
  transform["string"] = {
    string: identity,
    array: function(input) {
      return stringToArrayLike(input, new Array(input.length));
    },
    arraybuffer: function(input) {
      return transform["string"]["uint8array"](input).buffer;
    },
    uint8array: function(input) {
      return stringToArrayLike(input, new Uint8Array(input.length));
    },
    nodebuffer: function(input) {
      return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
    }
  };
  transform["array"] = {
    string: arrayLikeToString,
    array: identity,
    arraybuffer: function(input) {
      return new Uint8Array(input).buffer;
    },
    uint8array: function(input) {
      return new Uint8Array(input);
    },
    nodebuffer: function(input) {
      return nodejsUtils.newBufferFrom(input);
    }
  };
  transform["arraybuffer"] = {
    string: function(input) {
      return arrayLikeToString(new Uint8Array(input));
    },
    array: function(input) {
      return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
    },
    arraybuffer: identity,
    uint8array: function(input) {
      return new Uint8Array(input);
    },
    nodebuffer: function(input) {
      return nodejsUtils.newBufferFrom(new Uint8Array(input));
    }
  };
  transform["uint8array"] = {
    string: arrayLikeToString,
    array: function(input) {
      return arrayLikeToArrayLike(input, new Array(input.length));
    },
    arraybuffer: function(input) {
      return input.buffer;
    },
    uint8array: identity,
    nodebuffer: function(input) {
      return nodejsUtils.newBufferFrom(input);
    }
  };
  transform["nodebuffer"] = {
    string: arrayLikeToString,
    array: function(input) {
      return arrayLikeToArrayLike(input, new Array(input.length));
    },
    arraybuffer: function(input) {
      return transform["nodebuffer"]["uint8array"](input).buffer;
    },
    uint8array: function(input) {
      return arrayLikeToArrayLike(input, new Uint8Array(input.length));
    },
    nodebuffer: identity
  };
  exports.transformTo = function(outputType, input) {
    if (!input) {
      input = "";
    }
    if (!outputType) {
      return input;
    }
    exports.checkSupport(outputType);
    var inputType = exports.getTypeOf(input);
    var result = transform[inputType][outputType](input);
    return result;
  };
  exports.resolve = function(path9) {
    var parts = path9.split("/");
    var result = [];
    for (var index = 0;index < parts.length; index++) {
      var part = parts[index];
      if (part === "." || part === "" && index !== 0 && index !== parts.length - 1) {
        continue;
      } else if (part === "..") {
        result.pop();
      } else {
        result.push(part);
      }
    }
    return result.join("/");
  };
  exports.getTypeOf = function(input) {
    if (typeof input === "string") {
      return "string";
    }
    if (Object.prototype.toString.call(input) === "[object Array]") {
      return "array";
    }
    if (support.nodebuffer && nodejsUtils.isBuffer(input)) {
      return "nodebuffer";
    }
    if (support.uint8array && input instanceof Uint8Array) {
      return "uint8array";
    }
    if (support.arraybuffer && input instanceof ArrayBuffer) {
      return "arraybuffer";
    }
  };
  exports.checkSupport = function(type) {
    var supported = support[type.toLowerCase()];
    if (!supported) {
      throw new Error(type + " is not supported by this platform");
    }
  };
  exports.MAX_VALUE_16BITS = 65535;
  exports.MAX_VALUE_32BITS = -1;
  exports.pretty = function(str) {
    var res = "", code, i;
    for (i = 0;i < (str || "").length; i++) {
      code = str.charCodeAt(i);
      res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
    }
    return res;
  };
  exports.delay = function(callback, args, self2) {
    setImmediate(function() {
      callback.apply(self2 || null, args || []);
    });
  };
  exports.inherits = function(ctor, superCtor) {
    var Obj = function() {};
    Obj.prototype = superCtor.prototype;
    ctor.prototype = new Obj;
  };
  exports.extend = function() {
    var result = {}, i, attr;
    for (i = 0;i < arguments.length; i++) {
      for (attr in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], attr) && typeof result[attr] === "undefined") {
          result[attr] = arguments[i][attr];
        }
      }
    }
    return result;
  };
  exports.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {
    var promise = external.Promise.resolve(inputData).then(function(data) {
      var isBlob = support.blob && (data instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(data)) !== -1);
      if (isBlob && typeof FileReader !== "undefined") {
        return new external.Promise(function(resolve, reject) {
          var reader = new FileReader;
          reader.onload = function(e) {
            resolve(e.target.result);
          };
          reader.onerror = function(e) {
            reject(e.target.error);
          };
          reader.readAsArrayBuffer(data);
        });
      } else {
        return data;
      }
    });
    return promise.then(function(data) {
      var dataType = exports.getTypeOf(data);
      if (!dataType) {
        return external.Promise.reject(new Error("Can't read the data of '" + name + "'. Is it " + "in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
      }
      if (dataType === "arraybuffer") {
        data = exports.transformTo("uint8array", data);
      } else if (dataType === "string") {
        if (isBase64) {
          data = base64.decode(data);
        } else if (isBinary) {
          if (isOptimizedBinaryString !== true) {
            data = string2binary(data);
          }
        }
      }
      return data;
    });
  };
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/stream/GenericWorker.js
var require_GenericWorker = __commonJS((exports, module) => {
  function GenericWorker(name) {
    this.name = name || "default";
    this.streamInfo = {};
    this.generatedError = null;
    this.extraStreamInfo = {};
    this.isPaused = true;
    this.isFinished = false;
    this.isLocked = false;
    this._listeners = {
      data: [],
      end: [],
      error: []
    };
    this.previous = null;
  }
  GenericWorker.prototype = {
    push: function(chunk) {
      this.emit("data", chunk);
    },
    end: function() {
      if (this.isFinished) {
        return false;
      }
      this.flush();
      try {
        this.emit("end");
        this.cleanUp();
        this.isFinished = true;
      } catch (e) {
        this.emit("error", e);
      }
      return true;
    },
    error: function(e) {
      if (this.isFinished) {
        return false;
      }
      if (this.isPaused) {
        this.generatedError = e;
      } else {
        this.isFinished = true;
        this.emit("error", e);
        if (this.previous) {
          this.previous.error(e);
        }
        this.cleanUp();
      }
      return true;
    },
    on: function(name, listener) {
      this._listeners[name].push(listener);
      return this;
    },
    cleanUp: function() {
      this.streamInfo = this.generatedError = this.extraStreamInfo = null;
      this._listeners = [];
    },
    emit: function(name, arg) {
      if (this._listeners[name]) {
        for (var i = 0;i < this._listeners[name].length; i++) {
          this._listeners[name][i].call(this, arg);
        }
      }
    },
    pipe: function(next) {
      return next.registerPrevious(this);
    },
    registerPrevious: function(previous) {
      if (this.isLocked) {
        throw new Error("The stream '" + this + "' has already been used.");
      }
      this.streamInfo = previous.streamInfo;
      this.mergeStreamInfo();
      this.previous = previous;
      var self2 = this;
      previous.on("data", function(chunk) {
        self2.processChunk(chunk);
      });
      previous.on("end", function() {
        self2.end();
      });
      previous.on("error", function(e) {
        self2.error(e);
      });
      return this;
    },
    pause: function() {
      if (this.isPaused || this.isFinished) {
        return false;
      }
      this.isPaused = true;
      if (this.previous) {
        this.previous.pause();
      }
      return true;
    },
    resume: function() {
      if (!this.isPaused || this.isFinished) {
        return false;
      }
      this.isPaused = false;
      var withError = false;
      if (this.generatedError) {
        this.error(this.generatedError);
        withError = true;
      }
      if (this.previous) {
        this.previous.resume();
      }
      return !withError;
    },
    flush: function() {},
    processChunk: function(chunk) {
      this.push(chunk);
    },
    withStreamInfo: function(key, value) {
      this.extraStreamInfo[key] = value;
      this.mergeStreamInfo();
      return this;
    },
    mergeStreamInfo: function() {
      for (var key in this.extraStreamInfo) {
        if (!Object.prototype.hasOwnProperty.call(this.extraStreamInfo, key)) {
          continue;
        }
        this.streamInfo[key] = this.extraStreamInfo[key];
      }
    },
    lock: function() {
      if (this.isLocked) {
        throw new Error("The stream '" + this + "' has already been used.");
      }
      this.isLocked = true;
      if (this.previous) {
        this.previous.lock();
      }
    },
    toString: function() {
      var me = "Worker " + this.name;
      if (this.previous) {
        return this.previous + " -> " + me;
      } else {
        return me;
      }
    }
  };
  module.exports = GenericWorker;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/utf8.js
var require_utf8 = __commonJS((exports) => {
  var utils = require_utils();
  var support = require_support();
  var nodejsUtils = require_nodejsUtils();
  var GenericWorker = require_GenericWorker();
  var _utf8len = new Array(256);
  for (i = 0;i < 256; i++) {
    _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
  }
  var i;
  _utf8len[254] = _utf8len[254] = 1;
  var string2buf = function(str) {
    var buf, c, c2, m_pos, i2, str_len = str.length, buf_len = 0;
    for (m_pos = 0;m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    if (support.uint8array) {
      buf = new Uint8Array(buf_len);
    } else {
      buf = new Array(buf_len);
    }
    for (i2 = 0, m_pos = 0;i2 < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      if (c < 128) {
        buf[i2++] = c;
      } else if (c < 2048) {
        buf[i2++] = 192 | c >>> 6;
        buf[i2++] = 128 | c & 63;
      } else if (c < 65536) {
        buf[i2++] = 224 | c >>> 12;
        buf[i2++] = 128 | c >>> 6 & 63;
        buf[i2++] = 128 | c & 63;
      } else {
        buf[i2++] = 240 | c >>> 18;
        buf[i2++] = 128 | c >>> 12 & 63;
        buf[i2++] = 128 | c >>> 6 & 63;
        buf[i2++] = 128 | c & 63;
      }
    }
    return buf;
  };
  var utf8border = function(buf, max) {
    var pos;
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    pos = max - 1;
    while (pos >= 0 && (buf[pos] & 192) === 128) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  };
  var buf2string = function(buf) {
    var i2, out, c, c_len;
    var len = buf.length;
    var utf16buf = new Array(len * 2);
    for (out = 0, i2 = 0;i2 < len; ) {
      c = buf[i2++];
      if (c < 128) {
        utf16buf[out++] = c;
        continue;
      }
      c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 65533;
        i2 += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
      while (c_len > 1 && i2 < len) {
        c = c << 6 | buf[i2++] & 63;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 65533;
        continue;
      }
      if (c < 65536) {
        utf16buf[out++] = c;
      } else {
        c -= 65536;
        utf16buf[out++] = 55296 | c >> 10 & 1023;
        utf16buf[out++] = 56320 | c & 1023;
      }
    }
    if (utf16buf.length !== out) {
      if (utf16buf.subarray) {
        utf16buf = utf16buf.subarray(0, out);
      } else {
        utf16buf.length = out;
      }
    }
    return utils.applyFromCharCode(utf16buf);
  };
  exports.utf8encode = function utf8encode(str) {
    if (support.nodebuffer) {
      return nodejsUtils.newBufferFrom(str, "utf-8");
    }
    return string2buf(str);
  };
  exports.utf8decode = function utf8decode(buf) {
    if (support.nodebuffer) {
      return utils.transformTo("nodebuffer", buf).toString("utf-8");
    }
    buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);
    return buf2string(buf);
  };
  function Utf8DecodeWorker() {
    GenericWorker.call(this, "utf-8 decode");
    this.leftOver = null;
  }
  utils.inherits(Utf8DecodeWorker, GenericWorker);
  Utf8DecodeWorker.prototype.processChunk = function(chunk) {
    var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);
    if (this.leftOver && this.leftOver.length) {
      if (support.uint8array) {
        var previousData = data;
        data = new Uint8Array(previousData.length + this.leftOver.length);
        data.set(this.leftOver, 0);
        data.set(previousData, this.leftOver.length);
      } else {
        data = this.leftOver.concat(data);
      }
      this.leftOver = null;
    }
    var nextBoundary = utf8border(data);
    var usableData = data;
    if (nextBoundary !== data.length) {
      if (support.uint8array) {
        usableData = data.subarray(0, nextBoundary);
        this.leftOver = data.subarray(nextBoundary, data.length);
      } else {
        usableData = data.slice(0, nextBoundary);
        this.leftOver = data.slice(nextBoundary, data.length);
      }
    }
    this.push({
      data: exports.utf8decode(usableData),
      meta: chunk.meta
    });
  };
  Utf8DecodeWorker.prototype.flush = function() {
    if (this.leftOver && this.leftOver.length) {
      this.push({
        data: exports.utf8decode(this.leftOver),
        meta: {}
      });
      this.leftOver = null;
    }
  };
  exports.Utf8DecodeWorker = Utf8DecodeWorker;
  function Utf8EncodeWorker() {
    GenericWorker.call(this, "utf-8 encode");
  }
  utils.inherits(Utf8EncodeWorker, GenericWorker);
  Utf8EncodeWorker.prototype.processChunk = function(chunk) {
    this.push({
      data: exports.utf8encode(chunk.data),
      meta: chunk.meta
    });
  };
  exports.Utf8EncodeWorker = Utf8EncodeWorker;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/stream/ConvertWorker.js
var require_ConvertWorker = __commonJS((exports, module) => {
  var GenericWorker = require_GenericWorker();
  var utils = require_utils();
  function ConvertWorker(destType) {
    GenericWorker.call(this, "ConvertWorker to " + destType);
    this.destType = destType;
  }
  utils.inherits(ConvertWorker, GenericWorker);
  ConvertWorker.prototype.processChunk = function(chunk) {
    this.push({
      data: utils.transformTo(this.destType, chunk.data),
      meta: chunk.meta
    });
  };
  module.exports = ConvertWorker;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js
var require_NodejsStreamOutputAdapter = __commonJS((exports, module) => {
  var Readable = require_readable().Readable;
  var utils = require_utils();
  utils.inherits(NodejsStreamOutputAdapter, Readable);
  function NodejsStreamOutputAdapter(helper, options, updateCb) {
    Readable.call(this, options);
    this._helper = helper;
    var self2 = this;
    helper.on("data", function(data, meta) {
      if (!self2.push(data)) {
        self2._helper.pause();
      }
      if (updateCb) {
        updateCb(meta);
      }
    }).on("error", function(e) {
      self2.emit("error", e);
    }).on("end", function() {
      self2.push(null);
    });
  }
  NodejsStreamOutputAdapter.prototype._read = function() {
    this._helper.resume();
  };
  module.exports = NodejsStreamOutputAdapter;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/stream/StreamHelper.js
var require_StreamHelper = __commonJS((exports, module) => {
  var utils = require_utils();
  var ConvertWorker = require_ConvertWorker();
  var GenericWorker = require_GenericWorker();
  var base64 = require_base64();
  var support = require_support();
  var external = require_external();
  var NodejsStreamOutputAdapter = null;
  if (support.nodestream) {
    try {
      NodejsStreamOutputAdapter = require_NodejsStreamOutputAdapter();
    } catch (e) {}
  }
  function transformZipOutput(type, content, mimeType) {
    switch (type) {
      case "blob":
        return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
      case "base64":
        return base64.encode(content);
      default:
        return utils.transformTo(type, content);
    }
  }
  function concat(type, dataArray) {
    var i, index = 0, res = null, totalLength = 0;
    for (i = 0;i < dataArray.length; i++) {
      totalLength += dataArray[i].length;
    }
    switch (type) {
      case "string":
        return dataArray.join("");
      case "array":
        return Array.prototype.concat.apply([], dataArray);
      case "uint8array":
        res = new Uint8Array(totalLength);
        for (i = 0;i < dataArray.length; i++) {
          res.set(dataArray[i], index);
          index += dataArray[i].length;
        }
        return res;
      case "nodebuffer":
        return Buffer.concat(dataArray);
      default:
        throw new Error("concat : unsupported type '" + type + "'");
    }
  }
  function accumulate(helper, updateCallback) {
    return new external.Promise(function(resolve, reject) {
      var dataArray = [];
      var { _internalType: chunkType, _outputType: resultType, _mimeType: mimeType } = helper;
      helper.on("data", function(data, meta) {
        dataArray.push(data);
        if (updateCallback) {
          updateCallback(meta);
        }
      }).on("error", function(err) {
        dataArray = [];
        reject(err);
      }).on("end", function() {
        try {
          var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);
          resolve(result);
        } catch (e) {
          reject(e);
        }
        dataArray = [];
      }).resume();
    });
  }
  function StreamHelper(worker, outputType, mimeType) {
    var internalType = outputType;
    switch (outputType) {
      case "blob":
      case "arraybuffer":
        internalType = "uint8array";
        break;
      case "base64":
        internalType = "string";
        break;
    }
    try {
      this._internalType = internalType;
      this._outputType = outputType;
      this._mimeType = mimeType;
      utils.checkSupport(internalType);
      this._worker = worker.pipe(new ConvertWorker(internalType));
      worker.lock();
    } catch (e) {
      this._worker = new GenericWorker("error");
      this._worker.error(e);
    }
  }
  StreamHelper.prototype = {
    accumulate: function(updateCb) {
      return accumulate(this, updateCb);
    },
    on: function(evt, fn) {
      var self2 = this;
      if (evt === "data") {
        this._worker.on(evt, function(chunk) {
          fn.call(self2, chunk.data, chunk.meta);
        });
      } else {
        this._worker.on(evt, function() {
          utils.delay(fn, arguments, self2);
        });
      }
      return this;
    },
    resume: function() {
      utils.delay(this._worker.resume, [], this._worker);
      return this;
    },
    pause: function() {
      this._worker.pause();
      return this;
    },
    toNodejsStream: function(updateCb) {
      utils.checkSupport("nodestream");
      if (this._outputType !== "nodebuffer") {
        throw new Error(this._outputType + " is not supported by this method");
      }
      return new NodejsStreamOutputAdapter(this, {
        objectMode: this._outputType !== "nodebuffer"
      }, updateCb);
    }
  };
  module.exports = StreamHelper;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/defaults.js
var require_defaults = __commonJS((exports) => {
  exports.base64 = false;
  exports.binary = false;
  exports.dir = false;
  exports.createFolders = true;
  exports.date = null;
  exports.compression = null;
  exports.compressionOptions = null;
  exports.comment = null;
  exports.unixPermissions = null;
  exports.dosPermissions = null;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/stream/DataWorker.js
var require_DataWorker = __commonJS((exports, module) => {
  var utils = require_utils();
  var GenericWorker = require_GenericWorker();
  var DEFAULT_BLOCK_SIZE = 16 * 1024;
  function DataWorker(dataP) {
    GenericWorker.call(this, "DataWorker");
    var self2 = this;
    this.dataIsReady = false;
    this.index = 0;
    this.max = 0;
    this.data = null;
    this.type = "";
    this._tickScheduled = false;
    dataP.then(function(data) {
      self2.dataIsReady = true;
      self2.data = data;
      self2.max = data && data.length || 0;
      self2.type = utils.getTypeOf(data);
      if (!self2.isPaused) {
        self2._tickAndRepeat();
      }
    }, function(e) {
      self2.error(e);
    });
  }
  utils.inherits(DataWorker, GenericWorker);
  DataWorker.prototype.cleanUp = function() {
    GenericWorker.prototype.cleanUp.call(this);
    this.data = null;
  };
  DataWorker.prototype.resume = function() {
    if (!GenericWorker.prototype.resume.call(this)) {
      return false;
    }
    if (!this._tickScheduled && this.dataIsReady) {
      this._tickScheduled = true;
      utils.delay(this._tickAndRepeat, [], this);
    }
    return true;
  };
  DataWorker.prototype._tickAndRepeat = function() {
    this._tickScheduled = false;
    if (this.isPaused || this.isFinished) {
      return;
    }
    this._tick();
    if (!this.isFinished) {
      utils.delay(this._tickAndRepeat, [], this);
      this._tickScheduled = true;
    }
  };
  DataWorker.prototype._tick = function() {
    if (this.isPaused || this.isFinished) {
      return false;
    }
    var size = DEFAULT_BLOCK_SIZE;
    var data = null, nextIndex = Math.min(this.max, this.index + size);
    if (this.index >= this.max) {
      return this.end();
    } else {
      switch (this.type) {
        case "string":
          data = this.data.substring(this.index, nextIndex);
          break;
        case "uint8array":
          data = this.data.subarray(this.index, nextIndex);
          break;
        case "array":
        case "nodebuffer":
          data = this.data.slice(this.index, nextIndex);
          break;
      }
      this.index = nextIndex;
      return this.push({
        data,
        meta: {
          percent: this.max ? this.index / this.max * 100 : 0
        }
      });
    }
  };
  module.exports = DataWorker;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/crc32.js
var require_crc32 = __commonJS((exports, module) => {
  var utils = require_utils();
  function makeTable() {
    var c, table = [];
    for (var n = 0;n < 256; n++) {
      c = n;
      for (var k = 0;k < 8; k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  }
  var crcTable = makeTable();
  function crc32(crc, buf, len, pos) {
    var t = crcTable, end = pos + len;
    crc = crc ^ -1;
    for (var i = pos;i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    }
    return crc ^ -1;
  }
  function crc32str(crc, str, len, pos) {
    var t = crcTable, end = pos + len;
    crc = crc ^ -1;
    for (var i = pos;i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ str.charCodeAt(i)) & 255];
    }
    return crc ^ -1;
  }
  module.exports = function crc32wrapper(input, crc) {
    if (typeof input === "undefined" || !input.length) {
      return 0;
    }
    var isArray = utils.getTypeOf(input) !== "string";
    if (isArray) {
      return crc32(crc | 0, input, input.length, 0);
    } else {
      return crc32str(crc | 0, input, input.length, 0);
    }
  };
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/stream/Crc32Probe.js
var require_Crc32Probe = __commonJS((exports, module) => {
  var GenericWorker = require_GenericWorker();
  var crc32 = require_crc32();
  var utils = require_utils();
  function Crc32Probe() {
    GenericWorker.call(this, "Crc32Probe");
    this.withStreamInfo("crc32", 0);
  }
  utils.inherits(Crc32Probe, GenericWorker);
  Crc32Probe.prototype.processChunk = function(chunk) {
    this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
    this.push(chunk);
  };
  module.exports = Crc32Probe;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/stream/DataLengthProbe.js
var require_DataLengthProbe = __commonJS((exports, module) => {
  var utils = require_utils();
  var GenericWorker = require_GenericWorker();
  function DataLengthProbe(propName) {
    GenericWorker.call(this, "DataLengthProbe for " + propName);
    this.propName = propName;
    this.withStreamInfo(propName, 0);
  }
  utils.inherits(DataLengthProbe, GenericWorker);
  DataLengthProbe.prototype.processChunk = function(chunk) {
    if (chunk) {
      var length = this.streamInfo[this.propName] || 0;
      this.streamInfo[this.propName] = length + chunk.data.length;
    }
    GenericWorker.prototype.processChunk.call(this, chunk);
  };
  module.exports = DataLengthProbe;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/compressedObject.js
var require_compressedObject = __commonJS((exports, module) => {
  var external = require_external();
  var DataWorker = require_DataWorker();
  var Crc32Probe = require_Crc32Probe();
  var DataLengthProbe = require_DataLengthProbe();
  function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
    this.compressedSize = compressedSize;
    this.uncompressedSize = uncompressedSize;
    this.crc32 = crc32;
    this.compression = compression;
    this.compressedContent = data;
  }
  CompressedObject.prototype = {
    getContentWorker: function() {
      var worker = new DataWorker(external.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new DataLengthProbe("data_length"));
      var that = this;
      worker.on("end", function() {
        if (this.streamInfo["data_length"] !== that.uncompressedSize) {
          throw new Error("Bug : uncompressed data size mismatch");
        }
      });
      return worker;
    },
    getCompressedWorker: function() {
      return new DataWorker(external.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
    }
  };
  CompressedObject.createWorkerFrom = function(uncompressedWorker, compression, compressionOptions) {
    return uncompressedWorker.pipe(new Crc32Probe).pipe(new DataLengthProbe("uncompressedSize")).pipe(compression.compressWorker(compressionOptions)).pipe(new DataLengthProbe("compressedSize")).withStreamInfo("compression", compression);
  };
  module.exports = CompressedObject;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/zipObject.js
var require_zipObject = __commonJS((exports, module) => {
  var StreamHelper = require_StreamHelper();
  var DataWorker = require_DataWorker();
  var utf8 = require_utf8();
  var CompressedObject = require_compressedObject();
  var GenericWorker = require_GenericWorker();
  var ZipObject = function(name, data, options) {
    this.name = name;
    this.dir = options.dir;
    this.date = options.date;
    this.comment = options.comment;
    this.unixPermissions = options.unixPermissions;
    this.dosPermissions = options.dosPermissions;
    this._data = data;
    this._dataBinary = options.binary;
    this.options = {
      compression: options.compression,
      compressionOptions: options.compressionOptions
    };
  };
  ZipObject.prototype = {
    internalStream: function(type) {
      var result = null, outputType = "string";
      try {
        if (!type) {
          throw new Error("No output type specified.");
        }
        outputType = type.toLowerCase();
        var askUnicodeString = outputType === "string" || outputType === "text";
        if (outputType === "binarystring" || outputType === "text") {
          outputType = "string";
        }
        result = this._decompressWorker();
        var isUnicodeString = !this._dataBinary;
        if (isUnicodeString && !askUnicodeString) {
          result = result.pipe(new utf8.Utf8EncodeWorker);
        }
        if (!isUnicodeString && askUnicodeString) {
          result = result.pipe(new utf8.Utf8DecodeWorker);
        }
      } catch (e) {
        result = new GenericWorker("error");
        result.error(e);
      }
      return new StreamHelper(result, outputType, "");
    },
    async: function(type, onUpdate) {
      return this.internalStream(type).accumulate(onUpdate);
    },
    nodeStream: function(type, onUpdate) {
      return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
    },
    _compressWorker: function(compression, compressionOptions) {
      if (this._data instanceof CompressedObject && this._data.compression.magic === compression.magic) {
        return this._data.getCompressedWorker();
      } else {
        var result = this._decompressWorker();
        if (!this._dataBinary) {
          result = result.pipe(new utf8.Utf8EncodeWorker);
        }
        return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
      }
    },
    _decompressWorker: function() {
      if (this._data instanceof CompressedObject) {
        return this._data.getContentWorker();
      } else if (this._data instanceof GenericWorker) {
        return this._data;
      } else {
        return new DataWorker(this._data);
      }
    }
  };
  var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"];
  var removedFn = function() {
    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
  };
  for (i = 0;i < removedMethods.length; i++) {
    ZipObject.prototype[removedMethods[i]] = removedFn;
  }
  var i;
  module.exports = ZipObject;
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/utils/common.js
var require_common = __commonJS((exports) => {
  var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
  function _has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  exports.assign = function(obj) {
    var sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      var source = sources.shift();
      if (!source) {
        continue;
      }
      if (typeof source !== "object") {
        throw new TypeError(source + "must be non-object");
      }
      for (var p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  };
  exports.shrinkBuf = function(buf, size) {
    if (buf.length === size) {
      return buf;
    }
    if (buf.subarray) {
      return buf.subarray(0, size);
    }
    buf.length = size;
    return buf;
  };
  var fnTyped = {
    arraySet: function(dest, src, src_offs, len, dest_offs) {
      if (src.subarray && dest.subarray) {
        dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
        return;
      }
      for (var i = 0;i < len; i++) {
        dest[dest_offs + i] = src[src_offs + i];
      }
    },
    flattenChunks: function(chunks) {
      var i, l, len, pos, chunk, result;
      len = 0;
      for (i = 0, l = chunks.length;i < l; i++) {
        len += chunks[i].length;
      }
      result = new Uint8Array(len);
      pos = 0;
      for (i = 0, l = chunks.length;i < l; i++) {
        chunk = chunks[i];
        result.set(chunk, pos);
        pos += chunk.length;
      }
      return result;
    }
  };
  var fnUntyped = {
    arraySet: function(dest, src, src_offs, len, dest_offs) {
      for (var i = 0;i < len; i++) {
        dest[dest_offs + i] = src[src_offs + i];
      }
    },
    flattenChunks: function(chunks) {
      return [].concat.apply([], chunks);
    }
  };
  exports.setTyped = function(on) {
    if (on) {
      exports.Buf8 = Uint8Array;
      exports.Buf16 = Uint16Array;
      exports.Buf32 = Int32Array;
      exports.assign(exports, fnTyped);
    } else {
      exports.Buf8 = Array;
      exports.Buf16 = Array;
      exports.Buf32 = Array;
      exports.assign(exports, fnUntyped);
    }
  };
  exports.setTyped(TYPED_OK);
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/trees.js
var require_trees = __commonJS((exports) => {
  var utils = require_common();
  var Z_FIXED = 4;
  var Z_BINARY = 0;
  var Z_TEXT = 1;
  var Z_UNKNOWN = 2;
  function zero(buf) {
    var len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var MAX_BITS = 15;
  var Buf_size = 16;
  var MAX_BL_BITS = 7;
  var END_BLOCK = 256;
  var REP_3_6 = 16;
  var REPZ_3_10 = 17;
  var REPZ_11_138 = 18;
  var extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  var extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  var extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
  var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  var DIST_CODE_LEN = 512;
  var static_ltree = new Array((L_CODES + 2) * 2);
  zero(static_ltree);
  var static_dtree = new Array(D_CODES * 2);
  zero(static_dtree);
  var _dist_code = new Array(DIST_CODE_LEN);
  zero(_dist_code);
  var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
  zero(_length_code);
  var base_length = new Array(LENGTH_CODES);
  zero(base_length);
  var base_dist = new Array(D_CODES);
  zero(base_dist);
  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
  }
  var static_l_desc;
  var static_d_desc;
  var static_bl_desc;
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this.stat_desc = stat_desc;
  }
  function d_code(dist) {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  }
  function put_short(s, w) {
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
  }
  function send_bits(s, value, length) {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 65535;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 65535;
      s.bi_valid += length;
    }
  }
  function send_code(s, c, tree) {
    send_bits(s, tree[c * 2], tree[c * 2 + 1]);
  }
  function bi_reverse(code, len) {
    var res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  }
  function bi_flush(s) {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 255;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  }
  function gen_bitlen(s, desc) {
    var tree = desc.dyn_tree;
    var max_code = desc.max_code;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var extra = desc.stat_desc.extra_bits;
    var base = desc.stat_desc.extra_base;
    var max_length = desc.stat_desc.max_length;
    var h;
    var n, m;
    var bits;
    var xbits;
    var f;
    var overflow = 0;
    for (bits = 0;bits <= MAX_BITS; bits++) {
      s.bl_count[bits] = 0;
    }
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1;h < HEAP_SIZE; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] = bits;
      if (n > max_code) {
        continue;
      }
      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) {
        xbits = extra[n - base];
      }
      f = tree[n * 2];
      s.opt_len += f * (bits + xbits);
      if (has_stree) {
        s.static_len += f * (stree[n * 2 + 1] + xbits);
      }
    }
    if (overflow === 0) {
      return;
    }
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) {
        bits--;
      }
      s.bl_count[bits]--;
      s.bl_count[bits + 1] += 2;
      s.bl_count[max_length]--;
      overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length;bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) {
          continue;
        }
        if (tree[m * 2 + 1] !== bits) {
          s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
          tree[m * 2 + 1] = bits;
        }
        n--;
      }
    }
  }
  function gen_codes(tree, max_code, bl_count) {
    var next_code = new Array(MAX_BITS + 1);
    var code = 0;
    var bits;
    var n;
    for (bits = 1;bits <= MAX_BITS; bits++) {
      next_code[bits] = code = code + bl_count[bits - 1] << 1;
    }
    for (n = 0;n <= max_code; n++) {
      var len = tree[n * 2 + 1];
      if (len === 0) {
        continue;
      }
      tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
  }
  function tr_static_init() {
    var n;
    var bits;
    var length;
    var code;
    var dist;
    var bl_count = new Array(MAX_BITS + 1);
    length = 0;
    for (code = 0;code < LENGTH_CODES - 1; code++) {
      base_length[code] = length;
      for (n = 0;n < 1 << extra_lbits[code]; n++) {
        _length_code[length++] = code;
      }
    }
    _length_code[length - 1] = code;
    dist = 0;
    for (code = 0;code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0;n < 1 << extra_dbits[code]; n++) {
        _dist_code[dist++] = code;
      }
    }
    dist >>= 7;
    for (;code < D_CODES; code++) {
      base_dist[code] = dist << 7;
      for (n = 0;n < 1 << extra_dbits[code] - 7; n++) {
        _dist_code[256 + dist++] = code;
      }
    }
    for (bits = 0;bits <= MAX_BITS; bits++) {
      bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    gen_codes(static_ltree, L_CODES + 1, bl_count);
    for (n = 0;n < D_CODES; n++) {
      static_dtree[n * 2 + 1] = 5;
      static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
  }
  function init_block(s) {
    var n;
    for (n = 0;n < L_CODES; n++) {
      s.dyn_ltree[n * 2] = 0;
    }
    for (n = 0;n < D_CODES; n++) {
      s.dyn_dtree[n * 2] = 0;
    }
    for (n = 0;n < BL_CODES; n++) {
      s.bl_tree[n * 2] = 0;
    }
    s.dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.last_lit = s.matches = 0;
  }
  function bi_windup(s) {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  }
  function copy_block(s, buf, len, header) {
    bi_windup(s);
    if (header) {
      put_short(s, len);
      put_short(s, ~len);
    }
    utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
    s.pending += len;
  }
  function smaller(tree, n, m, depth) {
    var _n2 = n * 2;
    var _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
  }
  function pqdownheap(s, tree, k) {
    var v = s.heap[k];
    var j = k << 1;
    while (j <= s.heap_len) {
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      if (smaller(tree, v, s.heap[j], s.depth)) {
        break;
      }
      s.heap[k] = s.heap[j];
      k = j;
      j <<= 1;
    }
    s.heap[k] = v;
  }
  function compress_block(s, ltree, dtree) {
    var dist;
    var lc;
    var lx = 0;
    var code;
    var extra;
    if (s.last_lit !== 0) {
      do {
        dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
        lc = s.pending_buf[s.l_buf + lx];
        lx++;
        if (dist === 0) {
          send_code(s, lc, ltree);
        } else {
          code = _length_code[lc];
          send_code(s, code + LITERALS + 1, ltree);
          extra = extra_lbits[code];
          if (extra !== 0) {
            lc -= base_length[code];
            send_bits(s, lc, extra);
          }
          dist--;
          code = d_code(dist);
          send_code(s, code, dtree);
          extra = extra_dbits[code];
          if (extra !== 0) {
            dist -= base_dist[code];
            send_bits(s, dist, extra);
          }
        }
      } while (lx < s.last_lit);
    }
    send_code(s, END_BLOCK, ltree);
  }
  function build_tree(s, desc) {
    var tree = desc.dyn_tree;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var elems = desc.stat_desc.elems;
    var n, m;
    var max_code = -1;
    var node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE;
    for (n = 0;n < elems; n++) {
      if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
      } else {
        tree[n * 2 + 1] = 0;
      }
    }
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) {
        s.static_len -= stree[node * 2 + 1];
      }
    }
    desc.max_code = max_code;
    for (n = s.heap_len >> 1;n >= 1; n--) {
      pqdownheap(s, tree, n);
    }
    node = elems;
    do {
      n = s.heap[1];
      s.heap[1] = s.heap[s.heap_len--];
      pqdownheap(s, tree, 1);
      m = s.heap[1];
      s.heap[--s.heap_max] = n;
      s.heap[--s.heap_max] = m;
      tree[node * 2] = tree[n * 2] + tree[m * 2];
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] = tree[m * 2 + 1] = node;
      s.heap[1] = node++;
      pqdownheap(s, tree, 1);
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[1];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
  }
  function scan_tree(s, tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0 * 2 + 1];
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535;
    for (n = 0;n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        s.bl_tree[curlen * 2] += count;
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          s.bl_tree[curlen * 2]++;
        }
        s.bl_tree[REP_3_6 * 2]++;
      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2]++;
      } else {
        s.bl_tree[REPZ_11_138 * 2]++;
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  }
  function send_tree(s, tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0 * 2 + 1];
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0;n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        do {
          send_code(s, curlen, s.bl_tree);
        } while (--count !== 0);
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  }
  function build_bl_tree(s) {
    var max_blindex;
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES - 1;max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
        break;
      }
    }
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
  }
  function send_all_trees(s, lcodes, dcodes, blcodes) {
    var rank;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank = 0;rank < blcodes; rank++) {
      send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
    }
    send_tree(s, s.dyn_ltree, lcodes - 1);
    send_tree(s, s.dyn_dtree, dcodes - 1);
  }
  function detect_data_type(s) {
    var black_mask = 4093624447;
    var n;
    for (n = 0;n <= 31; n++, black_mask >>>= 1) {
      if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
        return Z_BINARY;
      }
    }
    if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
      return Z_TEXT;
    }
    for (n = 32;n < LITERALS; n++) {
      if (s.dyn_ltree[n * 2] !== 0) {
        return Z_TEXT;
      }
    }
    return Z_BINARY;
  }
  var static_init_done = false;
  function _tr_init(s) {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    init_block(s);
  }
  function _tr_stored_block(s, buf, stored_len, last) {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    copy_block(s, buf, stored_len, true);
  }
  function _tr_align(s) {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  }
  function _tr_flush_block(s, buf, stored_len, last) {
    var opt_lenb, static_lenb;
    var max_blindex = 0;
    if (s.level > 0) {
      if (s.strm.data_type === Z_UNKNOWN) {
        s.strm.data_type = detect_data_type(s);
      }
      build_tree(s, s.l_desc);
      build_tree(s, s.d_desc);
      max_blindex = build_bl_tree(s);
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;
      if (static_lenb <= opt_lenb) {
        opt_lenb = static_lenb;
      }
    } else {
      opt_lenb = static_lenb = stored_len + 5;
    }
    if (stored_len + 4 <= opt_lenb && buf !== -1) {
      _tr_stored_block(s, buf, stored_len, last);
    } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    init_block(s);
    if (last) {
      bi_windup(s);
    }
  }
  function _tr_tally(s, dist, lc) {
    s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
    s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
    s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
    s.last_lit++;
    if (dist === 0) {
      s.dyn_ltree[lc * 2]++;
    } else {
      s.matches++;
      dist--;
      s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
      s.dyn_dtree[d_code(dist) * 2]++;
    }
    return s.last_lit === s.lit_bufsize - 1;
  }
  exports._tr_init = _tr_init;
  exports._tr_stored_block = _tr_stored_block;
  exports._tr_flush_block = _tr_flush_block;
  exports._tr_tally = _tr_tally;
  exports._tr_align = _tr_align;
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/adler32.js
var require_adler32 = __commonJS((exports, module) => {
  function adler32(adler, buf, len, pos) {
    var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while (len !== 0) {
      n = len > 2000 ? 2000 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  }
  module.exports = adler32;
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/crc32.js
var require_crc322 = __commonJS((exports, module) => {
  function makeTable() {
    var c, table = [];
    for (var n = 0;n < 256; n++) {
      c = n;
      for (var k = 0;k < 8; k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  }
  var crcTable = makeTable();
  function crc32(crc, buf, len, pos) {
    var t = crcTable, end = pos + len;
    crc ^= -1;
    for (var i = pos;i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    }
    return crc ^ -1;
  }
  module.exports = crc32;
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/messages.js
var require_messages = __commonJS((exports, module) => {
  module.exports = {
    2: "need dictionary",
    1: "stream end",
    0: "",
    "-1": "file error",
    "-2": "stream error",
    "-3": "data error",
    "-4": "insufficient memory",
    "-5": "buffer error",
    "-6": "incompatible version"
  };
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/deflate.js
var require_deflate = __commonJS((exports) => {
  var utils = require_common();
  var trees = require_trees();
  var adler32 = require_adler32();
  var crc32 = require_crc322();
  var msg = require_messages();
  var Z_NO_FLUSH = 0;
  var Z_PARTIAL_FLUSH = 1;
  var Z_FULL_FLUSH = 3;
  var Z_FINISH = 4;
  var Z_BLOCK = 5;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_STREAM_ERROR = -2;
  var Z_DATA_ERROR = -3;
  var Z_BUF_ERROR = -5;
  var Z_DEFAULT_COMPRESSION = -1;
  var Z_FILTERED = 1;
  var Z_HUFFMAN_ONLY = 2;
  var Z_RLE = 3;
  var Z_FIXED = 4;
  var Z_DEFAULT_STRATEGY = 0;
  var Z_UNKNOWN = 2;
  var Z_DEFLATED = 8;
  var MAX_MEM_LEVEL = 9;
  var MAX_WBITS = 15;
  var DEF_MEM_LEVEL = 8;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var MAX_BITS = 15;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
  var PRESET_DICT = 32;
  var INIT_STATE = 42;
  var EXTRA_STATE = 69;
  var NAME_STATE = 73;
  var COMMENT_STATE = 91;
  var HCRC_STATE = 103;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666;
  var BS_NEED_MORE = 1;
  var BS_BLOCK_DONE = 2;
  var BS_FINISH_STARTED = 3;
  var BS_FINISH_DONE = 4;
  var OS_CODE = 3;
  function err(strm, errorCode) {
    strm.msg = msg[errorCode];
    return errorCode;
  }
  function rank(f) {
    return (f << 1) - (f > 4 ? 9 : 0);
  }
  function zero(buf) {
    var len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  function flush_pending(strm) {
    var s = strm.state;
    var len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) {
      return;
    }
    utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  }
  function flush_block_only(s, last) {
    trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  }
  function put_byte(s, b) {
    s.pending_buf[s.pending++] = b;
  }
  function putShortMSB(s, b) {
    s.pending_buf[s.pending++] = b >>> 8 & 255;
    s.pending_buf[s.pending++] = b & 255;
  }
  function read_buf(strm, buf, start, size) {
    var len = strm.avail_in;
    if (len > size) {
      len = size;
    }
    if (len === 0) {
      return 0;
    }
    strm.avail_in -= len;
    utils.arraySet(buf, strm.input, strm.next_in, len, start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32(strm.adler, buf, len, start);
    } else if (strm.state.wrap === 2) {
      strm.adler = crc32(strm.adler, buf, len, start);
    }
    strm.next_in += len;
    strm.total_in += len;
    return len;
  }
  function longest_match(s, cur_match) {
    var chain_length = s.max_chain_length;
    var scan = s.strstart;
    var match;
    var len;
    var best_len = s.prev_length;
    var nice_match = s.nice_match;
    var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    var _win = s.window;
    var wmask = s.w_mask;
    var prev = s.prev;
    var strend = s.strstart + MAX_MATCH;
    var scan_end1 = _win[scan + best_len - 1];
    var scan_end = _win[scan + best_len];
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    if (nice_match > s.lookahead) {
      nice_match = s.lookahead;
    }
    do {
      match = cur_match;
      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
        continue;
      }
      scan += 2;
      match++;
      do {} while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
      len = MAX_MATCH - (strend - scan);
      scan = strend - MAX_MATCH;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  }
  function fill_window(s) {
    var _w_size = s.w_size;
    var p, n, m, more, str;
    do {
      more = s.window_size - s.lookahead - s.strstart;
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        s.block_start -= _w_size;
        n = s.hash_size;
        p = n;
        do {
          m = s.head[--p];
          s.head[p] = m >= _w_size ? m - _w_size : 0;
        } while (--n);
        n = _w_size;
        p = n;
        do {
          m = s.prev[--p];
          s.prev[p] = m >= _w_size ? m - _w_size : 0;
        } while (--n);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;
      if (s.lookahead + s.insert >= MIN_MATCH) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
        while (s.insert) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH) {
            break;
          }
        }
      }
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  }
  function deflate_stored(s, flush) {
    var max_block_size = 65535;
    if (max_block_size > s.pending_buf_size - 5) {
      max_block_size = s.pending_buf_size - 5;
    }
    for (;; ) {
      if (s.lookahead <= 1) {
        fill_window(s);
        if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.strstart += s.lookahead;
      s.lookahead = 0;
      var max_start = s.block_start + max_block_size;
      if (s.strstart === 0 || s.strstart >= max_start) {
        s.lookahead = s.strstart - max_start;
        s.strstart = max_start;
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.strstart > s.block_start) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_NEED_MORE;
  }
  function deflate_fast(s, flush) {
    var hash_head;
    var bflush;
    for (;; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
          s.match_length--;
          do {
            s.strstart++;
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
        }
      } else {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function deflate_slow(s, flush) {
    var hash_head;
    var bflush;
    var max_insert;
    for (;; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH - 1;
      if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
          s.match_length = MIN_MATCH - 1;
        }
      }
      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH;
        bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH - 1;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      } else if (s.match_available) {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush) {
          flush_block_only(s, false);
        }
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    if (s.match_available) {
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function deflate_rle(s, flush) {
    var bflush;
    var prev;
    var scan, strend;
    var _win = s.window;
    for (;; ) {
      if (s.lookahead <= MAX_MATCH) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH;
          do {} while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function deflate_huff(s, flush) {
    var bflush;
    for (;; ) {
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          break;
        }
      }
      s.match_length = 0;
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  var configuration_table;
  configuration_table = [
    new Config(0, 0, 0, 0, deflate_stored),
    new Config(4, 4, 8, 4, deflate_fast),
    new Config(4, 5, 16, 8, deflate_fast),
    new Config(4, 6, 32, 32, deflate_fast),
    new Config(4, 4, 16, 16, deflate_slow),
    new Config(8, 16, 32, 32, deflate_slow),
    new Config(8, 16, 128, 128, deflate_slow),
    new Config(8, 32, 128, 256, deflate_slow),
    new Config(32, 128, 258, 1024, deflate_slow),
    new Config(32, 258, 258, 4096, deflate_slow)
  ];
  function lm_init(s) {
    s.window_size = 2 * s.w_size;
    zero(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
  }
  function DeflateState() {
    this.strm = null;
    this.status = 0;
    this.pending_buf = null;
    this.pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.gzhead = null;
    this.gzindex = 0;
    this.method = Z_DEFLATED;
    this.last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this.window = null;
    this.window_size = 0;
    this.prev = null;
    this.head = null;
    this.ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this.block_start = 0;
    this.match_length = 0;
    this.prev_match = 0;
    this.match_available = 0;
    this.strstart = 0;
    this.match_start = 0;
    this.lookahead = 0;
    this.prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
    this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
    this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
    zero(this.dyn_ltree);
    zero(this.dyn_dtree);
    zero(this.bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new utils.Buf16(MAX_BITS + 1);
    this.heap = new utils.Buf16(2 * L_CODES + 1);
    zero(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new utils.Buf16(2 * L_CODES + 1);
    zero(this.depth);
    this.l_buf = 0;
    this.lit_bufsize = 0;
    this.last_lit = 0;
    this.d_buf = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this.bi_valid = 0;
  }
  function deflateResetKeep(strm) {
    var s;
    if (!strm || !strm.state) {
      return err(strm, Z_STREAM_ERROR);
    }
    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN;
    s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
      s.wrap = -s.wrap;
    }
    s.status = s.wrap ? INIT_STATE : BUSY_STATE;
    strm.adler = s.wrap === 2 ? 0 : 1;
    s.last_flush = Z_NO_FLUSH;
    trees._tr_init(s);
    return Z_OK;
  }
  function deflateReset(strm) {
    var ret = deflateResetKeep(strm);
    if (ret === Z_OK) {
      lm_init(strm.state);
    }
    return ret;
  }
  function deflateSetHeader(strm, head) {
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    if (strm.state.wrap !== 2) {
      return Z_STREAM_ERROR;
    }
    strm.state.gzhead = head;
    return Z_OK;
  }
  function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
    if (!strm) {
      return Z_STREAM_ERROR;
    }
    var wrap = 1;
    if (level === Z_DEFAULT_COMPRESSION) {
      level = 6;
    }
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2;
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
      return err(strm, Z_STREAM_ERROR);
    }
    if (windowBits === 8) {
      windowBits = 9;
    }
    var s = new DeflateState;
    strm.state = s;
    s.strm = strm;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s.window = new utils.Buf8(s.w_size * 2);
    s.head = new utils.Buf16(s.hash_size);
    s.prev = new utils.Buf16(s.w_size);
    s.lit_bufsize = 1 << memLevel + 6;
    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new utils.Buf8(s.pending_buf_size);
    s.d_buf = 1 * s.lit_bufsize;
    s.l_buf = (1 + 2) * s.lit_bufsize;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  }
  function deflateInit(strm, level) {
    return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
  }
  function deflate(strm, flush) {
    var old_flush, s;
    var beg, val;
    if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
    }
    s = strm.state;
    if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
    }
    s.strm = strm;
    old_flush = s.last_flush;
    s.last_flush = flush;
    if (s.status === INIT_STATE) {
      if (s.wrap === 2) {
        strm.adler = 0;
        put_byte(s, 31);
        put_byte(s, 139);
        put_byte(s, 8);
        if (!s.gzhead) {
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, OS_CODE);
          s.status = BUSY_STATE;
        } else {
          put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
          put_byte(s, s.gzhead.time & 255);
          put_byte(s, s.gzhead.time >> 8 & 255);
          put_byte(s, s.gzhead.time >> 16 & 255);
          put_byte(s, s.gzhead.time >> 24 & 255);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, s.gzhead.os & 255);
          if (s.gzhead.extra && s.gzhead.extra.length) {
            put_byte(s, s.gzhead.extra.length & 255);
            put_byte(s, s.gzhead.extra.length >> 8 & 255);
          }
          if (s.gzhead.hcrc) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
          }
          s.gzindex = 0;
          s.status = EXTRA_STATE;
        }
      } else {
        var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
        var level_flags = -1;
        if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
          level_flags = 0;
        } else if (s.level < 6) {
          level_flags = 1;
        } else if (s.level === 6) {
          level_flags = 2;
        } else {
          level_flags = 3;
        }
        header |= level_flags << 6;
        if (s.strstart !== 0) {
          header |= PRESET_DICT;
        }
        header += 31 - header % 31;
        s.status = BUSY_STATE;
        putShortMSB(s, header);
        if (s.strstart !== 0) {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 65535);
        }
        strm.adler = 1;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra) {
        beg = s.pending;
        while (s.gzindex < (s.gzhead.extra.length & 65535)) {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              break;
            }
          }
          put_byte(s, s.gzhead.extra[s.gzindex] & 255);
          s.gzindex++;
        }
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (s.gzindex === s.gzhead.extra.length) {
          s.gzindex = 0;
          s.status = NAME_STATE;
        }
      } else {
        s.status = NAME_STATE;
      }
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name) {
        beg = s.pending;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.gzindex = 0;
          s.status = COMMENT_STATE;
        }
      } else {
        s.status = COMMENT_STATE;
      }
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment) {
        beg = s.pending;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.status = HCRC_STATE;
        }
      } else {
        s.status = HCRC_STATE;
      }
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
        }
        if (s.pending + 2 <= s.pending_buf_size) {
          put_byte(s, strm.adler & 255);
          put_byte(s, strm.adler >> 8 & 255);
          strm.adler = 0;
          s.status = BUSY_STATE;
        }
      } else {
        s.status = BUSY_STATE;
      }
    }
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK;
      }
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
      return err(strm, Z_BUF_ERROR);
    }
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR);
    }
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
      var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
        }
        return Z_OK;
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          trees._tr_align(s);
        } else if (flush !== Z_BLOCK) {
          trees._tr_stored_block(s, 0, 0, false);
          if (flush === Z_FULL_FLUSH) {
            zero(s.head);
            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      }
    }
    if (flush !== Z_FINISH) {
      return Z_OK;
    }
    if (s.wrap <= 0) {
      return Z_STREAM_END;
    }
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      put_byte(s, strm.adler >> 16 & 255);
      put_byte(s, strm.adler >> 24 & 255);
      put_byte(s, strm.total_in & 255);
      put_byte(s, strm.total_in >> 8 & 255);
      put_byte(s, strm.total_in >> 16 & 255);
      put_byte(s, strm.total_in >> 24 & 255);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    flush_pending(strm);
    if (s.wrap > 0) {
      s.wrap = -s.wrap;
    }
    return s.pending !== 0 ? Z_OK : Z_STREAM_END;
  }
  function deflateEnd(strm) {
    var status;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    status = strm.state.status;
    if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
      return err(strm, Z_STREAM_ERROR);
    }
    strm.state = null;
    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
  }
  function deflateSetDictionary(strm, dictionary) {
    var dictLength = dictionary.length;
    var s;
    var str, n;
    var wrap;
    var avail;
    var next;
    var input;
    var tmpDict;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    s = strm.state;
    wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
      return Z_STREAM_ERROR;
    }
    if (wrap === 1) {
      strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
    }
    s.wrap = 0;
    if (dictLength >= s.w_size) {
      if (wrap === 0) {
        zero(s.head);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      tmpDict = new utils.Buf8(s.w_size);
      utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    avail = strm.avail_in;
    next = strm.next_in;
    input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH) {
      str = s.strstart;
      n = s.lookahead - (MIN_MATCH - 1);
      do {
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return Z_OK;
  }
  exports.deflateInit = deflateInit;
  exports.deflateInit2 = deflateInit2;
  exports.deflateReset = deflateReset;
  exports.deflateResetKeep = deflateResetKeep;
  exports.deflateSetHeader = deflateSetHeader;
  exports.deflate = deflate;
  exports.deflateEnd = deflateEnd;
  exports.deflateSetDictionary = deflateSetDictionary;
  exports.deflateInfo = "pako deflate (from Nodeca project)";
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/utils/strings.js
var require_strings = __commonJS((exports) => {
  var utils = require_common();
  var STR_APPLY_OK = true;
  var STR_APPLY_UIA_OK = true;
  try {
    String.fromCharCode.apply(null, [0]);
  } catch (__) {
    STR_APPLY_OK = false;
  }
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (__) {
    STR_APPLY_UIA_OK = false;
  }
  var _utf8len = new utils.Buf8(256);
  for (q = 0;q < 256; q++) {
    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  var q;
  _utf8len[254] = _utf8len[254] = 1;
  exports.string2buf = function(str) {
    var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    for (m_pos = 0;m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    buf = new utils.Buf8(buf_len);
    for (i = 0, m_pos = 0;i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      if (c < 128) {
        buf[i++] = c;
      } else if (c < 2048) {
        buf[i++] = 192 | c >>> 6;
        buf[i++] = 128 | c & 63;
      } else if (c < 65536) {
        buf[i++] = 224 | c >>> 12;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      } else {
        buf[i++] = 240 | c >>> 18;
        buf[i++] = 128 | c >>> 12 & 63;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      }
    }
    return buf;
  };
  function buf2binstring(buf, len) {
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) {
        return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
      }
    }
    var result = "";
    for (var i = 0;i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  }
  exports.buf2binstring = function(buf) {
    return buf2binstring(buf, buf.length);
  };
  exports.binstring2buf = function(str) {
    var buf = new utils.Buf8(str.length);
    for (var i = 0, len = buf.length;i < len; i++) {
      buf[i] = str.charCodeAt(i);
    }
    return buf;
  };
  exports.buf2string = function(buf, max) {
    var i, out, c, c_len;
    var len = max || buf.length;
    var utf16buf = new Array(len * 2);
    for (out = 0, i = 0;i < len; ) {
      c = buf[i++];
      if (c < 128) {
        utf16buf[out++] = c;
        continue;
      }
      c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 65533;
        i += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 63;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 65533;
        continue;
      }
      if (c < 65536) {
        utf16buf[out++] = c;
      } else {
        c -= 65536;
        utf16buf[out++] = 55296 | c >> 10 & 1023;
        utf16buf[out++] = 56320 | c & 1023;
      }
    }
    return buf2binstring(utf16buf, out);
  };
  exports.utf8border = function(buf, max) {
    var pos;
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    pos = max - 1;
    while (pos >= 0 && (buf[pos] & 192) === 128) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  };
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/zstream.js
var require_zstream = __commonJS((exports, module) => {
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }
  module.exports = ZStream;
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/deflate.js
var require_deflate2 = __commonJS((exports) => {
  var zlib_deflate = require_deflate();
  var utils = require_common();
  var strings = require_strings();
  var msg = require_messages();
  var ZStream = require_zstream();
  var toString = Object.prototype.toString;
  var Z_NO_FLUSH = 0;
  var Z_FINISH = 4;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_SYNC_FLUSH = 2;
  var Z_DEFAULT_COMPRESSION = -1;
  var Z_DEFAULT_STRATEGY = 0;
  var Z_DEFLATED = 8;
  function Deflate(options) {
    if (!(this instanceof Deflate))
      return new Deflate(options);
    this.options = utils.assign({
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY,
      to: ""
    }, options || {});
    var opt = this.options;
    if (opt.raw && opt.windowBits > 0) {
      opt.windowBits = -opt.windowBits;
    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
      opt.windowBits += 16;
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new ZStream;
    this.strm.avail_out = 0;
    var status = zlib_deflate.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);
    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }
    if (opt.header) {
      zlib_deflate.deflateSetHeader(this.strm, opt.header);
    }
    if (opt.dictionary) {
      var dict;
      if (typeof opt.dictionary === "string") {
        dict = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }
      status = zlib_deflate.deflateSetDictionary(this.strm, dict);
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
      this._dict_set = true;
    }
  }
  Deflate.prototype.push = function(data, mode) {
    var strm = this.strm;
    var chunkSize = this.options.chunkSize;
    var status, _mode;
    if (this.ended) {
      return false;
    }
    _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
    if (typeof data === "string") {
      strm.input = strings.string2buf(data);
    } else if (toString.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    do {
      if (strm.avail_out === 0) {
        strm.output = new utils.Buf8(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = zlib_deflate.deflate(strm, _mode);
      if (status !== Z_STREAM_END && status !== Z_OK) {
        this.onEnd(status);
        this.ended = true;
        return false;
      }
      if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
        if (this.options.to === "string") {
          this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
        } else {
          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
        }
      }
    } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
    if (_mode === Z_FINISH) {
      status = zlib_deflate.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK;
    }
    if (_mode === Z_SYNC_FLUSH) {
      this.onEnd(Z_OK);
      strm.avail_out = 0;
      return true;
    }
    return true;
  };
  Deflate.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Deflate.prototype.onEnd = function(status) {
    if (status === Z_OK) {
      if (this.options.to === "string") {
        this.result = this.chunks.join("");
      } else {
        this.result = utils.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function deflate(input, options) {
    var deflator = new Deflate(options);
    deflator.push(input, true);
    if (deflator.err) {
      throw deflator.msg || msg[deflator.err];
    }
    return deflator.result;
  }
  function deflateRaw(input, options) {
    options = options || {};
    options.raw = true;
    return deflate(input, options);
  }
  function gzip(input, options) {
    options = options || {};
    options.gzip = true;
    return deflate(input, options);
  }
  exports.Deflate = Deflate;
  exports.deflate = deflate;
  exports.deflateRaw = deflateRaw;
  exports.gzip = gzip;
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inffast.js
var require_inffast = __commonJS((exports, module) => {
  var BAD = 30;
  var TYPE = 12;
  module.exports = function inflate_fast(strm, start) {
    var state;
    var _in;
    var last;
    var _out;
    var beg;
    var end;
    var dmax;
    var wsize;
    var whave;
    var wnext;
    var s_window;
    var hold;
    var bits;
    var lcode;
    var dcode;
    var lmask;
    var dmask;
    var here;
    var op;
    var len;
    var dist;
    var from;
    var from_source;
    var input, output;
    state = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top:
      do {
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = lcode[hold & lmask];
        dolen:
          for (;; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op === 0) {
              output[_out++] = here & 65535;
            } else if (op & 16) {
              len = here & 65535;
              op &= 15;
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                len += hold & (1 << op) - 1;
                hold >>>= op;
                bits -= op;
              }
              if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
              }
              here = dcode[hold & dmask];
              dodist:
                for (;; ) {
                  op = here >>> 24;
                  hold >>>= op;
                  bits -= op;
                  op = here >>> 16 & 255;
                  if (op & 16) {
                    dist = here & 65535;
                    op &= 15;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                      }
                    }
                    dist += hold & (1 << op) - 1;
                    if (dist > dmax) {
                      strm.msg = "invalid distance too far back";
                      state.mode = BAD;
                      break top;
                    }
                    hold >>>= op;
                    bits -= op;
                    op = _out - beg;
                    if (dist > op) {
                      op = dist - op;
                      if (op > whave) {
                        if (state.sane) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD;
                          break top;
                        }
                      }
                      from = 0;
                      from_source = s_window;
                      if (wnext === 0) {
                        from += wsize - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      } else if (wnext < op) {
                        from += wsize + wnext - op;
                        op -= wnext;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = 0;
                          if (wnext < len) {
                            op = wnext;
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                      } else {
                        from += wnext - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                      while (len > 2) {
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        len -= 3;
                      }
                      if (len) {
                        output[_out++] = from_source[from++];
                        if (len > 1) {
                          output[_out++] = from_source[from++];
                        }
                      }
                    } else {
                      from = _out - dist;
                      do {
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        len -= 3;
                      } while (len > 2);
                      if (len) {
                        output[_out++] = output[from++];
                        if (len > 1) {
                          output[_out++] = output[from++];
                        }
                      }
                    }
                  } else if ((op & 64) === 0) {
                    here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                    continue dodist;
                  } else {
                    strm.msg = "invalid distance code";
                    state.mode = BAD;
                    break top;
                  }
                  break;
                }
            } else if ((op & 64) === 0) {
              here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dolen;
            } else if (op & 32) {
              state.mode = TYPE;
              break top;
            } else {
              strm.msg = "invalid literal/length code";
              state.mode = BAD;
              break top;
            }
            break;
          }
      } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  };
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = __commonJS((exports, module) => {
  var utils = require_common();
  var MAXBITS = 15;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var lbase = [
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ];
  var lext = [
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ];
  var dbase = [
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ];
  var dext = [
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ];
  module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
    var bits = opts.bits;
    var len = 0;
    var sym = 0;
    var min = 0, max = 0;
    var root = 0;
    var curr = 0;
    var drop = 0;
    var left = 0;
    var used = 0;
    var huff = 0;
    var incr;
    var fill;
    var low;
    var mask;
    var next;
    var base = null;
    var base_index = 0;
    var end;
    var count = new utils.Buf16(MAXBITS + 1);
    var offs = new utils.Buf16(MAXBITS + 1);
    var extra = null;
    var extra_index = 0;
    var here_bits, here_op, here_val;
    for (len = 0;len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0;sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS;max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0;
    }
    for (min = 1;min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }
    left = 1;
    for (len = 1;len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }
    }
    if (left > 0 && (type === CODES || max !== 1)) {
      return -1;
    }
    offs[1] = 0;
    for (len = 1;len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0;sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }
    if (type === CODES) {
      base = extra = work;
      end = 19;
    } else if (type === LENS) {
      base = lbase;
      base_index -= 257;
      extra = lext;
      extra_index -= 257;
      end = 256;
    } else {
      base = dbase;
      extra = dext;
      end = -1;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
      return 1;
    }
    for (;; ) {
      here_bits = len - drop;
      if (work[sym] < end) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] > end) {
        here_op = extra[extra_index + work[sym]];
        here_val = base[base_index + work[sym]];
      } else {
        here_op = 32 + 64;
        here_val = 0;
      }
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop === 0) {
          drop = root;
        }
        next += min;
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
          return 1;
        }
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) {
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }
    opts.bits = root;
    return 0;
  };
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inflate.js
var require_inflate = __commonJS((exports) => {
  var utils = require_common();
  var adler32 = require_adler32();
  var crc32 = require_crc322();
  var inflate_fast = require_inffast();
  var inflate_table = require_inftrees();
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var Z_FINISH = 4;
  var Z_BLOCK = 5;
  var Z_TREES = 6;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_NEED_DICT = 2;
  var Z_STREAM_ERROR = -2;
  var Z_DATA_ERROR = -3;
  var Z_MEM_ERROR = -4;
  var Z_BUF_ERROR = -5;
  var Z_DEFLATED = 8;
  var HEAD = 1;
  var FLAGS = 2;
  var TIME = 3;
  var OS = 4;
  var EXLEN = 5;
  var EXTRA = 6;
  var NAME = 7;
  var COMMENT = 8;
  var HCRC = 9;
  var DICTID = 10;
  var DICT = 11;
  var TYPE = 12;
  var TYPEDO = 13;
  var STORED = 14;
  var COPY_ = 15;
  var COPY = 16;
  var TABLE = 17;
  var LENLENS = 18;
  var CODELENS = 19;
  var LEN_ = 20;
  var LEN = 21;
  var LENEXT = 22;
  var DIST = 23;
  var DISTEXT = 24;
  var MATCH = 25;
  var LIT = 26;
  var CHECK = 27;
  var LENGTH = 28;
  var DONE = 29;
  var BAD = 30;
  var MEM = 31;
  var SYNC = 32;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var MAX_WBITS = 15;
  var DEF_WBITS = MAX_WBITS;
  function zswap32(q) {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
  }
  function InflateState() {
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new utils.Buf16(320);
    this.work = new utils.Buf16(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  function inflateResetKeep(strm) {
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = "";
    if (state.wrap) {
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.dmax = 32768;
    state.head = null;
    state.hold = 0;
    state.bits = 0;
    state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
    state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    return Z_OK;
  }
  function inflateReset(strm) {
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  }
  function inflateReset2(strm, windowBits) {
    var wrap;
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 1;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  }
  function inflateInit2(strm, windowBits) {
    var ret;
    var state;
    if (!strm) {
      return Z_STREAM_ERROR;
    }
    state = new InflateState;
    strm.state = state;
    state.window = null;
    ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK) {
      strm.state = null;
    }
    return ret;
  }
  function inflateInit(strm) {
    return inflateInit2(strm, DEF_WBITS);
  }
  var virgin = true;
  var lenfix;
  var distfix;
  function fixedtables(state) {
    if (virgin) {
      var sym;
      lenfix = new utils.Buf32(512);
      distfix = new utils.Buf32(32);
      sym = 0;
      while (sym < 144) {
        state.lens[sym++] = 8;
      }
      while (sym < 256) {
        state.lens[sym++] = 9;
      }
      while (sym < 280) {
        state.lens[sym++] = 7;
      }
      while (sym < 288) {
        state.lens[sym++] = 8;
      }
      inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
      sym = 0;
      while (sym < 32) {
        state.lens[sym++] = 5;
      }
      inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  }
  function updatewindow(strm, src, end, copy) {
    var dist;
    var state = strm.state;
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
      state.window = new utils.Buf8(state.wsize);
    }
    if (copy >= state.wsize) {
      utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      utils.arraySet(state.window, src, end - copy, dist, state.wnext);
      copy -= dist;
      if (copy) {
        utils.arraySet(state.window, src, end - copy, copy, 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) {
          state.wnext = 0;
        }
        if (state.whave < state.wsize) {
          state.whave += dist;
        }
      }
    }
    return 0;
  }
  function inflate(strm, flush) {
    var state;
    var input, output;
    var next;
    var put;
    var have, left;
    var hold;
    var bits;
    var _in, _out;
    var copy;
    var from;
    var from_source;
    var here = 0;
    var here_bits, here_op, here_val;
    var last_bits, last_op, last_val;
    var len;
    var ret;
    var hbuf = new utils.Buf8(4);
    var opts;
    var n;
    var order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if (state.mode === TYPE) {
      state.mode = TYPEDO;
    }
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    _in = have;
    _out = left;
    ret = Z_OK;
    inf_leave:
      for (;; ) {
        switch (state.mode) {
          case HEAD:
            if (state.wrap === 0) {
              state.mode = TYPEDO;
              break;
            }
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 2 && hold === 35615) {
              state.check = 0;
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32(state.check, hbuf, 2, 0);
              hold = 0;
              bits = 0;
              state.mode = FLAGS;
              break;
            }
            state.flags = 0;
            if (state.head) {
              state.head.done = false;
            }
            if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
              strm.msg = "incorrect header check";
              state.mode = BAD;
              break;
            }
            if ((hold & 15) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            hold >>>= 4;
            bits -= 4;
            len = (hold & 15) + 8;
            if (state.wbits === 0) {
              state.wbits = len;
            } else if (len > state.wbits) {
              strm.msg = "invalid window size";
              state.mode = BAD;
              break;
            }
            state.dmax = 1 << len;
            strm.adler = state.check = 1;
            state.mode = hold & 512 ? DICTID : TYPE;
            hold = 0;
            bits = 0;
            break;
          case FLAGS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.flags = hold;
            if ((state.flags & 255) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            if (state.flags & 57344) {
              strm.msg = "unknown header flags set";
              state.mode = BAD;
              break;
            }
            if (state.head) {
              state.head.text = hold >> 8 & 1;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = TIME;
          case TIME:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.time = hold;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              hbuf[2] = hold >>> 16 & 255;
              hbuf[3] = hold >>> 24 & 255;
              state.check = crc32(state.check, hbuf, 4, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = OS;
          case OS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.xflags = hold & 255;
              state.head.os = hold >> 8;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = EXLEN;
          case EXLEN:
            if (state.flags & 1024) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length = hold;
              if (state.head) {
                state.head.extra_len = hold;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
            } else if (state.head) {
              state.head.extra = null;
            }
            state.mode = EXTRA;
          case EXTRA:
            if (state.flags & 1024) {
              copy = state.length;
              if (copy > have) {
                copy = have;
              }
              if (copy) {
                if (state.head) {
                  len = state.head.extra_len - state.length;
                  if (!state.head.extra) {
                    state.head.extra = new Array(state.head.extra_len);
                  }
                  utils.arraySet(state.head.extra, input, next, copy, len);
                }
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                state.length -= copy;
              }
              if (state.length) {
                break inf_leave;
              }
            }
            state.length = 0;
            state.mode = NAME;
          case NAME:
            if (state.flags & 2048) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.name += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512) {
                state.check = crc32(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.name = null;
            }
            state.length = 0;
            state.mode = COMMENT;
          case COMMENT:
            if (state.flags & 4096) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.comment += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512) {
                state.check = crc32(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.comment = null;
            }
            state.mode = HCRC;
          case HCRC:
            if (state.flags & 512) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (hold !== (state.check & 65535)) {
                strm.msg = "header crc mismatch";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            if (state.head) {
              state.head.hcrc = state.flags >> 9 & 1;
              state.head.done = true;
            }
            strm.adler = state.check = 0;
            state.mode = TYPE;
            break;
          case DICTID:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            strm.adler = state.check = zswap32(hold);
            hold = 0;
            bits = 0;
            state.mode = DICT;
          case DICT:
            if (state.havedict === 0) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              return Z_NEED_DICT;
            }
            strm.adler = state.check = 1;
            state.mode = TYPE;
          case TYPE:
            if (flush === Z_BLOCK || flush === Z_TREES) {
              break inf_leave;
            }
          case TYPEDO:
            if (state.last) {
              hold >>>= bits & 7;
              bits -= bits & 7;
              state.mode = CHECK;
              break;
            }
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.last = hold & 1;
            hold >>>= 1;
            bits -= 1;
            switch (hold & 3) {
              case 0:
                state.mode = STORED;
                break;
              case 1:
                fixedtables(state);
                state.mode = LEN_;
                if (flush === Z_TREES) {
                  hold >>>= 2;
                  bits -= 2;
                  break inf_leave;
                }
                break;
              case 2:
                state.mode = TABLE;
                break;
              case 3:
                strm.msg = "invalid block type";
                state.mode = BAD;
            }
            hold >>>= 2;
            bits -= 2;
            break;
          case STORED:
            hold >>>= bits & 7;
            bits -= bits & 7;
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
              strm.msg = "invalid stored block lengths";
              state.mode = BAD;
              break;
            }
            state.length = hold & 65535;
            hold = 0;
            bits = 0;
            state.mode = COPY_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case COPY_:
            state.mode = COPY;
          case COPY:
            copy = state.length;
            if (copy) {
              if (copy > have) {
                copy = have;
              }
              if (copy > left) {
                copy = left;
              }
              if (copy === 0) {
                break inf_leave;
              }
              utils.arraySet(output, input, next, copy, put);
              have -= copy;
              next += copy;
              left -= copy;
              put += copy;
              state.length -= copy;
              break;
            }
            state.mode = TYPE;
            break;
          case TABLE:
            while (bits < 14) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.nlen = (hold & 31) + 257;
            hold >>>= 5;
            bits -= 5;
            state.ndist = (hold & 31) + 1;
            hold >>>= 5;
            bits -= 5;
            state.ncode = (hold & 15) + 4;
            hold >>>= 4;
            bits -= 4;
            if (state.nlen > 286 || state.ndist > 30) {
              strm.msg = "too many length or distance symbols";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = LENLENS;
          case LENLENS:
            while (state.have < state.ncode) {
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.lens[order[state.have++]] = hold & 7;
              hold >>>= 3;
              bits -= 3;
            }
            while (state.have < 19) {
              state.lens[order[state.have++]] = 0;
            }
            state.lencode = state.lendyn;
            state.lenbits = 7;
            opts = { bits: state.lenbits };
            ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid code lengths set";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = CODELENS;
          case CODELENS:
            while (state.have < state.nlen + state.ndist) {
              for (;; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_val < 16) {
                hold >>>= here_bits;
                bits -= here_bits;
                state.lens[state.have++] = here_val;
              } else {
                if (here_val === 16) {
                  n = here_bits + 2;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  if (state.have === 0) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  len = state.lens[state.have - 1];
                  copy = 3 + (hold & 3);
                  hold >>>= 2;
                  bits -= 2;
                } else if (here_val === 17) {
                  n = here_bits + 3;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 3 + (hold & 7);
                  hold >>>= 3;
                  bits -= 3;
                } else {
                  n = here_bits + 7;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 11 + (hold & 127);
                  hold >>>= 7;
                  bits -= 7;
                }
                if (state.have + copy > state.nlen + state.ndist) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD;
                  break;
                }
                while (copy--) {
                  state.lens[state.have++] = len;
                }
              }
            }
            if (state.mode === BAD) {
              break;
            }
            if (state.lens[256] === 0) {
              strm.msg = "invalid code -- missing end-of-block";
              state.mode = BAD;
              break;
            }
            state.lenbits = 9;
            opts = { bits: state.lenbits };
            ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid literal/lengths set";
              state.mode = BAD;
              break;
            }
            state.distbits = 6;
            state.distcode = state.distdyn;
            opts = { bits: state.distbits };
            ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
            state.distbits = opts.bits;
            if (ret) {
              strm.msg = "invalid distances set";
              state.mode = BAD;
              break;
            }
            state.mode = LEN_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case LEN_:
            state.mode = LEN;
          case LEN:
            if (have >= 6 && left >= 258) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              inflate_fast(strm, _out);
              put = strm.next_out;
              output = strm.output;
              left = strm.avail_out;
              next = strm.next_in;
              input = strm.input;
              have = strm.avail_in;
              hold = state.hold;
              bits = state.bits;
              if (state.mode === TYPE) {
                state.back = -1;
              }
              break;
            }
            state.back = 0;
            for (;; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_op && (here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (;; ) {
                here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            state.length = here_val;
            if (here_op === 0) {
              state.mode = LIT;
              break;
            }
            if (here_op & 32) {
              state.back = -1;
              state.mode = TYPE;
              break;
            }
            if (here_op & 64) {
              strm.msg = "invalid literal/length code";
              state.mode = BAD;
              break;
            }
            state.extra = here_op & 15;
            state.mode = LENEXT;
          case LENEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            state.was = state.length;
            state.mode = DIST;
          case DIST:
            for (;; ) {
              here = state.distcode[hold & (1 << state.distbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (;; ) {
                here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            if (here_op & 64) {
              strm.msg = "invalid distance code";
              state.mode = BAD;
              break;
            }
            state.offset = here_val;
            state.extra = here_op & 15;
            state.mode = DISTEXT;
          case DISTEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.offset += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            if (state.offset > state.dmax) {
              strm.msg = "invalid distance too far back";
              state.mode = BAD;
              break;
            }
            state.mode = MATCH;
          case MATCH:
            if (left === 0) {
              break inf_leave;
            }
            copy = _out - left;
            if (state.offset > copy) {
              copy = state.offset - copy;
              if (copy > state.whave) {
                if (state.sane) {
                  strm.msg = "invalid distance too far back";
                  state.mode = BAD;
                  break;
                }
              }
              if (copy > state.wnext) {
                copy -= state.wnext;
                from = state.wsize - copy;
              } else {
                from = state.wnext - copy;
              }
              if (copy > state.length) {
                copy = state.length;
              }
              from_source = state.window;
            } else {
              from_source = output;
              from = put - state.offset;
              copy = state.length;
            }
            if (copy > left) {
              copy = left;
            }
            left -= copy;
            state.length -= copy;
            do {
              output[put++] = from_source[from++];
            } while (--copy);
            if (state.length === 0) {
              state.mode = LEN;
            }
            break;
          case LIT:
            if (left === 0) {
              break inf_leave;
            }
            output[put++] = state.length;
            left--;
            state.mode = LEN;
            break;
          case CHECK:
            if (state.wrap) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold |= input[next++] << bits;
                bits += 8;
              }
              _out -= left;
              strm.total_out += _out;
              state.total += _out;
              if (_out) {
                strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
              }
              _out = left;
              if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                strm.msg = "incorrect data check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = LENGTH;
          case LENGTH:
            if (state.wrap && state.flags) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (hold !== (state.total & 4294967295)) {
                strm.msg = "incorrect length check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = DONE;
          case DONE:
            ret = Z_STREAM_END;
            break inf_leave;
          case BAD:
            ret = Z_DATA_ERROR;
            break inf_leave;
          case MEM:
            return Z_MEM_ERROR;
          case SYNC:
          default:
            return Z_STREAM_ERROR;
        }
      }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
        state.mode = MEM;
        return Z_MEM_ERROR;
      }
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap && _out) {
      strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  }
  function inflateEnd(strm) {
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    var state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK;
  }
  function inflateGetHeader(strm, head) {
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if ((state.wrap & 2) === 0) {
      return Z_STREAM_ERROR;
    }
    state.head = head;
    head.done = false;
    return Z_OK;
  }
  function inflateSetDictionary(strm, dictionary) {
    var dictLength = dictionary.length;
    var state;
    var dictid;
    var ret;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR;
    }
    if (state.mode === DICT) {
      dictid = 1;
      dictid = adler32(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR;
      }
    }
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
    state.havedict = 1;
    return Z_OK;
  }
  exports.inflateReset = inflateReset;
  exports.inflateReset2 = inflateReset2;
  exports.inflateResetKeep = inflateResetKeep;
  exports.inflateInit = inflateInit;
  exports.inflateInit2 = inflateInit2;
  exports.inflate = inflate;
  exports.inflateEnd = inflateEnd;
  exports.inflateGetHeader = inflateGetHeader;
  exports.inflateSetDictionary = inflateSetDictionary;
  exports.inflateInfo = "pako inflate (from Nodeca project)";
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/constants.js
var require_constants = __commonJS((exports, module) => {
  module.exports = {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_BUF_ERROR: -5,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    Z_BINARY: 0,
    Z_TEXT: 1,
    Z_UNKNOWN: 2,
    Z_DEFLATED: 8
  };
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = __commonJS((exports, module) => {
  function GZheader() {
    this.text = 0;
    this.time = 0;
    this.xflags = 0;
    this.os = 0;
    this.extra = null;
    this.extra_len = 0;
    this.name = "";
    this.comment = "";
    this.hcrc = 0;
    this.done = false;
  }
  module.exports = GZheader;
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/inflate.js
var require_inflate2 = __commonJS((exports) => {
  var zlib_inflate = require_inflate();
  var utils = require_common();
  var strings = require_strings();
  var c = require_constants();
  var msg = require_messages();
  var ZStream = require_zstream();
  var GZheader = require_gzheader();
  var toString = Object.prototype.toString;
  function Inflate(options) {
    if (!(this instanceof Inflate))
      return new Inflate(options);
    this.options = utils.assign({
      chunkSize: 16384,
      windowBits: 0,
      to: ""
    }, options || {});
    var opt = this.options;
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new ZStream;
    this.strm.avail_out = 0;
    var status = zlib_inflate.inflateInit2(this.strm, opt.windowBits);
    if (status !== c.Z_OK) {
      throw new Error(msg[status]);
    }
    this.header = new GZheader;
    zlib_inflate.inflateGetHeader(this.strm, this.header);
    if (opt.dictionary) {
      if (typeof opt.dictionary === "string") {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== c.Z_OK) {
          throw new Error(msg[status]);
        }
      }
    }
  }
  Inflate.prototype.push = function(data, mode) {
    var strm = this.strm;
    var chunkSize = this.options.chunkSize;
    var dictionary = this.options.dictionary;
    var status, _mode;
    var next_out_utf8, tail, utf8str;
    var allowBufError = false;
    if (this.ended) {
      return false;
    }
    _mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;
    if (typeof data === "string") {
      strm.input = strings.binstring2buf(data);
    } else if (toString.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    do {
      if (strm.avail_out === 0) {
        strm.output = new utils.Buf8(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
      if (status === c.Z_NEED_DICT && dictionary) {
        status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
      }
      if (status === c.Z_BUF_ERROR && allowBufError === true) {
        status = c.Z_OK;
        allowBufError = false;
      }
      if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
        this.onEnd(status);
        this.ended = true;
        return false;
      }
      if (strm.next_out) {
        if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) {
          if (this.options.to === "string") {
            next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
            tail = strm.next_out - next_out_utf8;
            utf8str = strings.buf2string(strm.output, next_out_utf8);
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail) {
              utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
            }
            this.onData(utf8str);
          } else {
            this.onData(utils.shrinkBuf(strm.output, strm.next_out));
          }
        }
      }
      if (strm.avail_in === 0 && strm.avail_out === 0) {
        allowBufError = true;
      }
    } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
    if (status === c.Z_STREAM_END) {
      _mode = c.Z_FINISH;
    }
    if (_mode === c.Z_FINISH) {
      status = zlib_inflate.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === c.Z_OK;
    }
    if (_mode === c.Z_SYNC_FLUSH) {
      this.onEnd(c.Z_OK);
      strm.avail_out = 0;
      return true;
    }
    return true;
  };
  Inflate.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Inflate.prototype.onEnd = function(status) {
    if (status === c.Z_OK) {
      if (this.options.to === "string") {
        this.result = this.chunks.join("");
      } else {
        this.result = utils.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function inflate(input, options) {
    var inflator = new Inflate(options);
    inflator.push(input, true);
    if (inflator.err) {
      throw inflator.msg || msg[inflator.err];
    }
    return inflator.result;
  }
  function inflateRaw(input, options) {
    options = options || {};
    options.raw = true;
    return inflate(input, options);
  }
  exports.Inflate = Inflate;
  exports.inflate = inflate;
  exports.inflateRaw = inflateRaw;
  exports.ungzip = inflate;
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/index.js
var require_pako = __commonJS((exports, module) => {
  var assign = require_common().assign;
  var deflate = require_deflate2();
  var inflate = require_inflate2();
  var constants = require_constants();
  var pako = {};
  assign(pako, deflate, inflate, constants);
  module.exports = pako;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/flate.js
var require_flate = __commonJS((exports) => {
  var USE_TYPEDARRAY = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Uint32Array !== "undefined";
  var pako = require_pako();
  var utils = require_utils();
  var GenericWorker = require_GenericWorker();
  var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";
  exports.magic = "\b\x00";
  function FlateWorker(action, options) {
    GenericWorker.call(this, "FlateWorker/" + action);
    this._pako = null;
    this._pakoAction = action;
    this._pakoOptions = options;
    this.meta = {};
  }
  utils.inherits(FlateWorker, GenericWorker);
  FlateWorker.prototype.processChunk = function(chunk) {
    this.meta = chunk.meta;
    if (this._pako === null) {
      this._createPako();
    }
    this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
  };
  FlateWorker.prototype.flush = function() {
    GenericWorker.prototype.flush.call(this);
    if (this._pako === null) {
      this._createPako();
    }
    this._pako.push([], true);
  };
  FlateWorker.prototype.cleanUp = function() {
    GenericWorker.prototype.cleanUp.call(this);
    this._pako = null;
  };
  FlateWorker.prototype._createPako = function() {
    this._pako = new pako[this._pakoAction]({
      raw: true,
      level: this._pakoOptions.level || -1
    });
    var self2 = this;
    this._pako.onData = function(data) {
      self2.push({
        data,
        meta: self2.meta
      });
    };
  };
  exports.compressWorker = function(compressionOptions) {
    return new FlateWorker("Deflate", compressionOptions);
  };
  exports.uncompressWorker = function() {
    return new FlateWorker("Inflate", {});
  };
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/compressions.js
var require_compressions = __commonJS((exports) => {
  var GenericWorker = require_GenericWorker();
  exports.STORE = {
    magic: "\x00\x00",
    compressWorker: function() {
      return new GenericWorker("STORE compression");
    },
    uncompressWorker: function() {
      return new GenericWorker("STORE decompression");
    }
  };
  exports.DEFLATE = require_flate();
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/signature.js
var require_signature = __commonJS((exports) => {
  exports.LOCAL_FILE_HEADER = "PK\x03\x04";
  exports.CENTRAL_FILE_HEADER = "PK\x01\x02";
  exports.CENTRAL_DIRECTORY_END = "PK\x05\x06";
  exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x06\x07";
  exports.ZIP64_CENTRAL_DIRECTORY_END = "PK\x06\x06";
  exports.DATA_DESCRIPTOR = "PK\x07\b";
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/generate/ZipFileWorker.js
var require_ZipFileWorker = __commonJS((exports, module) => {
  var utils = require_utils();
  var GenericWorker = require_GenericWorker();
  var utf8 = require_utf8();
  var crc32 = require_crc32();
  var signature = require_signature();
  var decToHex = function(dec, bytes) {
    var hex = "", i;
    for (i = 0;i < bytes; i++) {
      hex += String.fromCharCode(dec & 255);
      dec = dec >>> 8;
    }
    return hex;
  };
  var generateUnixExternalFileAttr = function(unixPermissions, isDir) {
    var result = unixPermissions;
    if (!unixPermissions) {
      result = isDir ? 16893 : 33204;
    }
    return (result & 65535) << 16;
  };
  var generateDosExternalFileAttr = function(dosPermissions) {
    return (dosPermissions || 0) & 63;
  };
  var generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
    var file2 = streamInfo["file"], compression = streamInfo["compression"], useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file2.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file2.name)), comment = file2.comment, encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file2.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir = file2.dir, date = file2.date;
    var dataInfo = {
      crc32: 0,
      compressedSize: 0,
      uncompressedSize: 0
    };
    if (!streamedContent || streamingEnded) {
      dataInfo.crc32 = streamInfo["crc32"];
      dataInfo.compressedSize = streamInfo["compressedSize"];
      dataInfo.uncompressedSize = streamInfo["uncompressedSize"];
    }
    var bitflag = 0;
    if (streamedContent) {
      bitflag |= 8;
    }
    if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {
      bitflag |= 2048;
    }
    var extFileAttr = 0;
    var versionMadeBy = 0;
    if (dir) {
      extFileAttr |= 16;
    }
    if (platform === "UNIX") {
      versionMadeBy = 798;
      extFileAttr |= generateUnixExternalFileAttr(file2.unixPermissions, dir);
    } else {
      versionMadeBy = 20;
      extFileAttr |= generateDosExternalFileAttr(file2.dosPermissions, dir);
    }
    dosTime = date.getUTCHours();
    dosTime = dosTime << 6;
    dosTime = dosTime | date.getUTCMinutes();
    dosTime = dosTime << 5;
    dosTime = dosTime | date.getUTCSeconds() / 2;
    dosDate = date.getUTCFullYear() - 1980;
    dosDate = dosDate << 4;
    dosDate = dosDate | date.getUTCMonth() + 1;
    dosDate = dosDate << 5;
    dosDate = dosDate | date.getUTCDate();
    if (useUTF8ForFileName) {
      unicodePathExtraField = decToHex(1, 1) + decToHex(crc32(encodedFileName), 4) + utfEncodedFileName;
      extraFields += "up" + decToHex(unicodePathExtraField.length, 2) + unicodePathExtraField;
    }
    if (useUTF8ForComment) {
      unicodeCommentExtraField = decToHex(1, 1) + decToHex(crc32(encodedComment), 4) + utfEncodedComment;
      extraFields += "uc" + decToHex(unicodeCommentExtraField.length, 2) + unicodeCommentExtraField;
    }
    var header = "";
    header += `
\x00`;
    header += decToHex(bitflag, 2);
    header += compression.magic;
    header += decToHex(dosTime, 2);
    header += decToHex(dosDate, 2);
    header += decToHex(dataInfo.crc32, 4);
    header += decToHex(dataInfo.compressedSize, 4);
    header += decToHex(dataInfo.uncompressedSize, 4);
    header += decToHex(encodedFileName.length, 2);
    header += decToHex(extraFields.length, 2);
    var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;
    var dirRecord = signature.CENTRAL_FILE_HEADER + decToHex(versionMadeBy, 2) + header + decToHex(encodedComment.length, 2) + "\x00\x00" + "\x00\x00" + decToHex(extFileAttr, 4) + decToHex(offset, 4) + encodedFileName + extraFields + encodedComment;
    return {
      fileRecord,
      dirRecord
    };
  };
  var generateCentralDirectoryEnd = function(entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
    var dirEnd = "";
    var encodedComment = utils.transformTo("string", encodeFileName(comment));
    dirEnd = signature.CENTRAL_DIRECTORY_END + "\x00\x00" + "\x00\x00" + decToHex(entriesCount, 2) + decToHex(entriesCount, 2) + decToHex(centralDirLength, 4) + decToHex(localDirLength, 4) + decToHex(encodedComment.length, 2) + encodedComment;
    return dirEnd;
  };
  var generateDataDescriptors = function(streamInfo) {
    var descriptor = "";
    descriptor = signature.DATA_DESCRIPTOR + decToHex(streamInfo["crc32"], 4) + decToHex(streamInfo["compressedSize"], 4) + decToHex(streamInfo["uncompressedSize"], 4);
    return descriptor;
  };
  function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
    GenericWorker.call(this, "ZipFileWorker");
    this.bytesWritten = 0;
    this.zipComment = comment;
    this.zipPlatform = platform;
    this.encodeFileName = encodeFileName;
    this.streamFiles = streamFiles;
    this.accumulate = false;
    this.contentBuffer = [];
    this.dirRecords = [];
    this.currentSourceOffset = 0;
    this.entriesCount = 0;
    this.currentFile = null;
    this._sources = [];
  }
  utils.inherits(ZipFileWorker, GenericWorker);
  ZipFileWorker.prototype.push = function(chunk) {
    var currentFilePercent = chunk.meta.percent || 0;
    var entriesCount = this.entriesCount;
    var remainingFiles = this._sources.length;
    if (this.accumulate) {
      this.contentBuffer.push(chunk);
    } else {
      this.bytesWritten += chunk.data.length;
      GenericWorker.prototype.push.call(this, {
        data: chunk.data,
        meta: {
          currentFile: this.currentFile,
          percent: entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
        }
      });
    }
  };
  ZipFileWorker.prototype.openedSource = function(streamInfo) {
    this.currentSourceOffset = this.bytesWritten;
    this.currentFile = streamInfo["file"].name;
    var streamedContent = this.streamFiles && !streamInfo["file"].dir;
    if (streamedContent) {
      var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
      this.push({
        data: record.fileRecord,
        meta: { percent: 0 }
      });
    } else {
      this.accumulate = true;
    }
  };
  ZipFileWorker.prototype.closedSource = function(streamInfo) {
    this.accumulate = false;
    var streamedContent = this.streamFiles && !streamInfo["file"].dir;
    var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
    this.dirRecords.push(record.dirRecord);
    if (streamedContent) {
      this.push({
        data: generateDataDescriptors(streamInfo),
        meta: { percent: 100 }
      });
    } else {
      this.push({
        data: record.fileRecord,
        meta: { percent: 0 }
      });
      while (this.contentBuffer.length) {
        this.push(this.contentBuffer.shift());
      }
    }
    this.currentFile = null;
  };
  ZipFileWorker.prototype.flush = function() {
    var localDirLength = this.bytesWritten;
    for (var i = 0;i < this.dirRecords.length; i++) {
      this.push({
        data: this.dirRecords[i],
        meta: { percent: 100 }
      });
    }
    var centralDirLength = this.bytesWritten - localDirLength;
    var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);
    this.push({
      data: dirEnd,
      meta: { percent: 100 }
    });
  };
  ZipFileWorker.prototype.prepareNextSource = function() {
    this.previous = this._sources.shift();
    this.openedSource(this.previous.streamInfo);
    if (this.isPaused) {
      this.previous.pause();
    } else {
      this.previous.resume();
    }
  };
  ZipFileWorker.prototype.registerPrevious = function(previous) {
    this._sources.push(previous);
    var self2 = this;
    previous.on("data", function(chunk) {
      self2.processChunk(chunk);
    });
    previous.on("end", function() {
      self2.closedSource(self2.previous.streamInfo);
      if (self2._sources.length) {
        self2.prepareNextSource();
      } else {
        self2.end();
      }
    });
    previous.on("error", function(e) {
      self2.error(e);
    });
    return this;
  };
  ZipFileWorker.prototype.resume = function() {
    if (!GenericWorker.prototype.resume.call(this)) {
      return false;
    }
    if (!this.previous && this._sources.length) {
      this.prepareNextSource();
      return true;
    }
    if (!this.previous && !this._sources.length && !this.generatedError) {
      this.end();
      return true;
    }
  };
  ZipFileWorker.prototype.error = function(e) {
    var sources = this._sources;
    if (!GenericWorker.prototype.error.call(this, e)) {
      return false;
    }
    for (var i = 0;i < sources.length; i++) {
      try {
        sources[i].error(e);
      } catch (e2) {}
    }
    return true;
  };
  ZipFileWorker.prototype.lock = function() {
    GenericWorker.prototype.lock.call(this);
    var sources = this._sources;
    for (var i = 0;i < sources.length; i++) {
      sources[i].lock();
    }
  };
  module.exports = ZipFileWorker;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/generate/index.js
var require_generate = __commonJS((exports) => {
  var compressions = require_compressions();
  var ZipFileWorker = require_ZipFileWorker();
  var getCompression = function(fileCompression, zipCompression) {
    var compressionName = fileCompression || zipCompression;
    var compression = compressions[compressionName];
    if (!compression) {
      throw new Error(compressionName + " is not a valid compression method !");
    }
    return compression;
  };
  exports.generateWorker = function(zip, options, comment) {
    var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
    var entriesCount = 0;
    try {
      zip.forEach(function(relativePath, file2) {
        entriesCount++;
        var compression = getCompression(file2.options.compression, options.compression);
        var compressionOptions = file2.options.compressionOptions || options.compressionOptions || {};
        var { dir, date } = file2;
        file2._compressWorker(compression, compressionOptions).withStreamInfo("file", {
          name: relativePath,
          dir,
          date,
          comment: file2.comment || "",
          unixPermissions: file2.unixPermissions,
          dosPermissions: file2.dosPermissions
        }).pipe(zipFileWorker);
      });
      zipFileWorker.entriesCount = entriesCount;
    } catch (e) {
      zipFileWorker.error(e);
    }
    return zipFileWorker;
  };
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js
var require_NodejsStreamInputAdapter = __commonJS((exports, module) => {
  var utils = require_utils();
  var GenericWorker = require_GenericWorker();
  function NodejsStreamInputAdapter(filename, stream) {
    GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
    this._upstreamEnded = false;
    this._bindStream(stream);
  }
  utils.inherits(NodejsStreamInputAdapter, GenericWorker);
  NodejsStreamInputAdapter.prototype._bindStream = function(stream) {
    var self2 = this;
    this._stream = stream;
    stream.pause();
    stream.on("data", function(chunk) {
      self2.push({
        data: chunk,
        meta: {
          percent: 0
        }
      });
    }).on("error", function(e) {
      if (self2.isPaused) {
        this.generatedError = e;
      } else {
        self2.error(e);
      }
    }).on("end", function() {
      if (self2.isPaused) {
        self2._upstreamEnded = true;
      } else {
        self2.end();
      }
    });
  };
  NodejsStreamInputAdapter.prototype.pause = function() {
    if (!GenericWorker.prototype.pause.call(this)) {
      return false;
    }
    this._stream.pause();
    return true;
  };
  NodejsStreamInputAdapter.prototype.resume = function() {
    if (!GenericWorker.prototype.resume.call(this)) {
      return false;
    }
    if (this._upstreamEnded) {
      this.end();
    } else {
      this._stream.resume();
    }
    return true;
  };
  module.exports = NodejsStreamInputAdapter;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/object.js
var require_object = __commonJS((exports, module) => {
  var utf8 = require_utf8();
  var utils = require_utils();
  var GenericWorker = require_GenericWorker();
  var StreamHelper = require_StreamHelper();
  var defaults = require_defaults();
  var CompressedObject = require_compressedObject();
  var ZipObject = require_zipObject();
  var generate = require_generate();
  var nodejsUtils = require_nodejsUtils();
  var NodejsStreamInputAdapter = require_NodejsStreamInputAdapter();
  var fileAdd = function(name, data, originalOptions) {
    var dataType = utils.getTypeOf(data), parent;
    var o = utils.extend(originalOptions || {}, defaults);
    o.date = o.date || new Date;
    if (o.compression !== null) {
      o.compression = o.compression.toUpperCase();
    }
    if (typeof o.unixPermissions === "string") {
      o.unixPermissions = parseInt(o.unixPermissions, 8);
    }
    if (o.unixPermissions && o.unixPermissions & 16384) {
      o.dir = true;
    }
    if (o.dosPermissions && o.dosPermissions & 16) {
      o.dir = true;
    }
    if (o.dir) {
      name = forceTrailingSlash(name);
    }
    if (o.createFolders && (parent = parentFolder(name))) {
      folderAdd.call(this, parent, true);
    }
    var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
    if (!originalOptions || typeof originalOptions.binary === "undefined") {
      o.binary = !isUnicodeString;
    }
    var isCompressedEmpty = data instanceof CompressedObject && data.uncompressedSize === 0;
    if (isCompressedEmpty || o.dir || !data || data.length === 0) {
      o.base64 = false;
      o.binary = true;
      data = "";
      o.compression = "STORE";
      dataType = "string";
    }
    var zipObjectContent = null;
    if (data instanceof CompressedObject || data instanceof GenericWorker) {
      zipObjectContent = data;
    } else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
      zipObjectContent = new NodejsStreamInputAdapter(name, data);
    } else {
      zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
    }
    var object = new ZipObject(name, zipObjectContent, o);
    this.files[name] = object;
  };
  var parentFolder = function(path9) {
    if (path9.slice(-1) === "/") {
      path9 = path9.substring(0, path9.length - 1);
    }
    var lastSlash = path9.lastIndexOf("/");
    return lastSlash > 0 ? path9.substring(0, lastSlash) : "";
  };
  var forceTrailingSlash = function(path9) {
    if (path9.slice(-1) !== "/") {
      path9 += "/";
    }
    return path9;
  };
  var folderAdd = function(name, createFolders) {
    createFolders = typeof createFolders !== "undefined" ? createFolders : defaults.createFolders;
    name = forceTrailingSlash(name);
    if (!this.files[name]) {
      fileAdd.call(this, name, null, {
        dir: true,
        createFolders
      });
    }
    return this.files[name];
  };
  function isRegExp(object) {
    return Object.prototype.toString.call(object) === "[object RegExp]";
  }
  var out = {
    load: function() {
      throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
    },
    forEach: function(cb) {
      var filename, relativePath, file2;
      for (filename in this.files) {
        file2 = this.files[filename];
        relativePath = filename.slice(this.root.length, filename.length);
        if (relativePath && filename.slice(0, this.root.length) === this.root) {
          cb(relativePath, file2);
        }
      }
    },
    filter: function(search) {
      var result = [];
      this.forEach(function(relativePath, entry) {
        if (search(relativePath, entry)) {
          result.push(entry);
        }
      });
      return result;
    },
    file: function(name, data, o) {
      if (arguments.length === 1) {
        if (isRegExp(name)) {
          var regexp = name;
          return this.filter(function(relativePath, file2) {
            return !file2.dir && regexp.test(relativePath);
          });
        } else {
          var obj = this.files[this.root + name];
          if (obj && !obj.dir) {
            return obj;
          } else {
            return null;
          }
        }
      } else {
        name = this.root + name;
        fileAdd.call(this, name, data, o);
      }
      return this;
    },
    folder: function(arg) {
      if (!arg) {
        return this;
      }
      if (isRegExp(arg)) {
        return this.filter(function(relativePath, file2) {
          return file2.dir && arg.test(relativePath);
        });
      }
      var name = this.root + arg;
      var newFolder = folderAdd.call(this, name);
      var ret = this.clone();
      ret.root = newFolder.name;
      return ret;
    },
    remove: function(name) {
      name = this.root + name;
      var file2 = this.files[name];
      if (!file2) {
        if (name.slice(-1) !== "/") {
          name += "/";
        }
        file2 = this.files[name];
      }
      if (file2 && !file2.dir) {
        delete this.files[name];
      } else {
        var kids = this.filter(function(relativePath, file3) {
          return file3.name.slice(0, name.length) === name;
        });
        for (var i = 0;i < kids.length; i++) {
          delete this.files[kids[i].name];
        }
      }
      return this;
    },
    generate: function() {
      throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
    },
    generateInternalStream: function(options) {
      var worker, opts = {};
      try {
        opts = utils.extend(options || {}, {
          streamFiles: false,
          compression: "STORE",
          compressionOptions: null,
          type: "",
          platform: "DOS",
          comment: null,
          mimeType: "application/zip",
          encodeFileName: utf8.utf8encode
        });
        opts.type = opts.type.toLowerCase();
        opts.compression = opts.compression.toUpperCase();
        if (opts.type === "binarystring") {
          opts.type = "string";
        }
        if (!opts.type) {
          throw new Error("No output type specified.");
        }
        utils.checkSupport(opts.type);
        if (opts.platform === "darwin" || opts.platform === "freebsd" || opts.platform === "linux" || opts.platform === "sunos") {
          opts.platform = "UNIX";
        }
        if (opts.platform === "win32") {
          opts.platform = "DOS";
        }
        var comment = opts.comment || this.comment || "";
        worker = generate.generateWorker(this, opts, comment);
      } catch (e) {
        worker = new GenericWorker("error");
        worker.error(e);
      }
      return new StreamHelper(worker, opts.type || "string", opts.mimeType);
    },
    generateAsync: function(options, onUpdate) {
      return this.generateInternalStream(options).accumulate(onUpdate);
    },
    generateNodeStream: function(options, onUpdate) {
      options = options || {};
      if (!options.type) {
        options.type = "nodebuffer";
      }
      return this.generateInternalStream(options).toNodejsStream(onUpdate);
    }
  };
  module.exports = out;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/reader/DataReader.js
var require_DataReader = __commonJS((exports, module) => {
  var utils = require_utils();
  function DataReader(data) {
    this.data = data;
    this.length = data.length;
    this.index = 0;
    this.zero = 0;
  }
  DataReader.prototype = {
    checkOffset: function(offset) {
      this.checkIndex(this.index + offset);
    },
    checkIndex: function(newIndex) {
      if (this.length < this.zero + newIndex || newIndex < 0) {
        throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
      }
    },
    setIndex: function(newIndex) {
      this.checkIndex(newIndex);
      this.index = newIndex;
    },
    skip: function(n) {
      this.setIndex(this.index + n);
    },
    byteAt: function() {},
    readInt: function(size) {
      var result = 0, i;
      this.checkOffset(size);
      for (i = this.index + size - 1;i >= this.index; i--) {
        result = (result << 8) + this.byteAt(i);
      }
      this.index += size;
      return result;
    },
    readString: function(size) {
      return utils.transformTo("string", this.readData(size));
    },
    readData: function() {},
    lastIndexOfSignature: function() {},
    readAndCheckSignature: function() {},
    readDate: function() {
      var dostime = this.readInt(4);
      return new Date(Date.UTC((dostime >> 25 & 127) + 1980, (dostime >> 21 & 15) - 1, dostime >> 16 & 31, dostime >> 11 & 31, dostime >> 5 & 63, (dostime & 31) << 1));
    }
  };
  module.exports = DataReader;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/reader/ArrayReader.js
var require_ArrayReader = __commonJS((exports, module) => {
  var DataReader = require_DataReader();
  var utils = require_utils();
  function ArrayReader(data) {
    DataReader.call(this, data);
    for (var i = 0;i < this.data.length; i++) {
      data[i] = data[i] & 255;
    }
  }
  utils.inherits(ArrayReader, DataReader);
  ArrayReader.prototype.byteAt = function(i) {
    return this.data[this.zero + i];
  };
  ArrayReader.prototype.lastIndexOfSignature = function(sig) {
    var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
    for (var i = this.length - 4;i >= 0; --i) {
      if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
        return i - this.zero;
      }
    }
    return -1;
  };
  ArrayReader.prototype.readAndCheckSignature = function(sig) {
    var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3), data = this.readData(4);
    return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
  };
  ArrayReader.prototype.readData = function(size) {
    this.checkOffset(size);
    if (size === 0) {
      return [];
    }
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };
  module.exports = ArrayReader;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/reader/StringReader.js
var require_StringReader = __commonJS((exports, module) => {
  var DataReader = require_DataReader();
  var utils = require_utils();
  function StringReader(data) {
    DataReader.call(this, data);
  }
  utils.inherits(StringReader, DataReader);
  StringReader.prototype.byteAt = function(i) {
    return this.data.charCodeAt(this.zero + i);
  };
  StringReader.prototype.lastIndexOfSignature = function(sig) {
    return this.data.lastIndexOf(sig) - this.zero;
  };
  StringReader.prototype.readAndCheckSignature = function(sig) {
    var data = this.readData(4);
    return sig === data;
  };
  StringReader.prototype.readData = function(size) {
    this.checkOffset(size);
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };
  module.exports = StringReader;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/reader/Uint8ArrayReader.js
var require_Uint8ArrayReader = __commonJS((exports, module) => {
  var ArrayReader = require_ArrayReader();
  var utils = require_utils();
  function Uint8ArrayReader(data) {
    ArrayReader.call(this, data);
  }
  utils.inherits(Uint8ArrayReader, ArrayReader);
  Uint8ArrayReader.prototype.readData = function(size) {
    this.checkOffset(size);
    if (size === 0) {
      return new Uint8Array(0);
    }
    var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };
  module.exports = Uint8ArrayReader;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/reader/NodeBufferReader.js
var require_NodeBufferReader = __commonJS((exports, module) => {
  var Uint8ArrayReader = require_Uint8ArrayReader();
  var utils = require_utils();
  function NodeBufferReader(data) {
    Uint8ArrayReader.call(this, data);
  }
  utils.inherits(NodeBufferReader, Uint8ArrayReader);
  NodeBufferReader.prototype.readData = function(size) {
    this.checkOffset(size);
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };
  module.exports = NodeBufferReader;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/reader/readerFor.js
var require_readerFor = __commonJS((exports, module) => {
  var utils = require_utils();
  var support = require_support();
  var ArrayReader = require_ArrayReader();
  var StringReader = require_StringReader();
  var NodeBufferReader = require_NodeBufferReader();
  var Uint8ArrayReader = require_Uint8ArrayReader();
  module.exports = function(data) {
    var type = utils.getTypeOf(data);
    utils.checkSupport(type);
    if (type === "string" && !support.uint8array) {
      return new StringReader(data);
    }
    if (type === "nodebuffer") {
      return new NodeBufferReader(data);
    }
    if (support.uint8array) {
      return new Uint8ArrayReader(utils.transformTo("uint8array", data));
    }
    return new ArrayReader(utils.transformTo("array", data));
  };
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/zipEntry.js
var require_zipEntry = __commonJS((exports, module) => {
  var readerFor = require_readerFor();
  var utils = require_utils();
  var CompressedObject = require_compressedObject();
  var crc32fn = require_crc32();
  var utf8 = require_utf8();
  var compressions = require_compressions();
  var support = require_support();
  var MADE_BY_DOS = 0;
  var MADE_BY_UNIX = 3;
  var findCompression = function(compressionMethod) {
    for (var method in compressions) {
      if (!Object.prototype.hasOwnProperty.call(compressions, method)) {
        continue;
      }
      if (compressions[method].magic === compressionMethod) {
        return compressions[method];
      }
    }
    return null;
  };
  function ZipEntry(options, loadOptions) {
    this.options = options;
    this.loadOptions = loadOptions;
  }
  ZipEntry.prototype = {
    isEncrypted: function() {
      return (this.bitFlag & 1) === 1;
    },
    useUTF8: function() {
      return (this.bitFlag & 2048) === 2048;
    },
    readLocalPart: function(reader) {
      var compression, localExtraFieldsLength;
      reader.skip(22);
      this.fileNameLength = reader.readInt(2);
      localExtraFieldsLength = reader.readInt(2);
      this.fileName = reader.readData(this.fileNameLength);
      reader.skip(localExtraFieldsLength);
      if (this.compressedSize === -1 || this.uncompressedSize === -1) {
        throw new Error("Bug or corrupted zip : didn't get enough information from the central directory " + "(compressedSize === -1 || uncompressedSize === -1)");
      }
      compression = findCompression(this.compressionMethod);
      if (compression === null) {
        throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
      }
      this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
    },
    readCentralPart: function(reader) {
      this.versionMadeBy = reader.readInt(2);
      reader.skip(2);
      this.bitFlag = reader.readInt(2);
      this.compressionMethod = reader.readString(2);
      this.date = reader.readDate();
      this.crc32 = reader.readInt(4);
      this.compressedSize = reader.readInt(4);
      this.uncompressedSize = reader.readInt(4);
      var fileNameLength = reader.readInt(2);
      this.extraFieldsLength = reader.readInt(2);
      this.fileCommentLength = reader.readInt(2);
      this.diskNumberStart = reader.readInt(2);
      this.internalFileAttributes = reader.readInt(2);
      this.externalFileAttributes = reader.readInt(4);
      this.localHeaderOffset = reader.readInt(4);
      if (this.isEncrypted()) {
        throw new Error("Encrypted zip are not supported");
      }
      reader.skip(fileNameLength);
      this.readExtraFields(reader);
      this.parseZIP64ExtraField(reader);
      this.fileComment = reader.readData(this.fileCommentLength);
    },
    processAttributes: function() {
      this.unixPermissions = null;
      this.dosPermissions = null;
      var madeBy = this.versionMadeBy >> 8;
      this.dir = this.externalFileAttributes & 16 ? true : false;
      if (madeBy === MADE_BY_DOS) {
        this.dosPermissions = this.externalFileAttributes & 63;
      }
      if (madeBy === MADE_BY_UNIX) {
        this.unixPermissions = this.externalFileAttributes >> 16 & 65535;
      }
      if (!this.dir && this.fileNameStr.slice(-1) === "/") {
        this.dir = true;
      }
    },
    parseZIP64ExtraField: function() {
      if (!this.extraFields[1]) {
        return;
      }
      var extraReader = readerFor(this.extraFields[1].value);
      if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
        this.uncompressedSize = extraReader.readInt(8);
      }
      if (this.compressedSize === utils.MAX_VALUE_32BITS) {
        this.compressedSize = extraReader.readInt(8);
      }
      if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
        this.localHeaderOffset = extraReader.readInt(8);
      }
      if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
        this.diskNumberStart = extraReader.readInt(4);
      }
    },
    readExtraFields: function(reader) {
      var end = reader.index + this.extraFieldsLength, extraFieldId, extraFieldLength, extraFieldValue;
      if (!this.extraFields) {
        this.extraFields = {};
      }
      while (reader.index + 4 < end) {
        extraFieldId = reader.readInt(2);
        extraFieldLength = reader.readInt(2);
        extraFieldValue = reader.readData(extraFieldLength);
        this.extraFields[extraFieldId] = {
          id: extraFieldId,
          length: extraFieldLength,
          value: extraFieldValue
        };
      }
      reader.setIndex(end);
    },
    handleUTF8: function() {
      var decodeParamType = support.uint8array ? "uint8array" : "array";
      if (this.useUTF8()) {
        this.fileNameStr = utf8.utf8decode(this.fileName);
        this.fileCommentStr = utf8.utf8decode(this.fileComment);
      } else {
        var upath = this.findExtraFieldUnicodePath();
        if (upath !== null) {
          this.fileNameStr = upath;
        } else {
          var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
          this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
        }
        var ucomment = this.findExtraFieldUnicodeComment();
        if (ucomment !== null) {
          this.fileCommentStr = ucomment;
        } else {
          var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
          this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
        }
      }
    },
    findExtraFieldUnicodePath: function() {
      var upathField = this.extraFields[28789];
      if (upathField) {
        var extraReader = readerFor(upathField.value);
        if (extraReader.readInt(1) !== 1) {
          return null;
        }
        if (crc32fn(this.fileName) !== extraReader.readInt(4)) {
          return null;
        }
        return utf8.utf8decode(extraReader.readData(upathField.length - 5));
      }
      return null;
    },
    findExtraFieldUnicodeComment: function() {
      var ucommentField = this.extraFields[25461];
      if (ucommentField) {
        var extraReader = readerFor(ucommentField.value);
        if (extraReader.readInt(1) !== 1) {
          return null;
        }
        if (crc32fn(this.fileComment) !== extraReader.readInt(4)) {
          return null;
        }
        return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
      }
      return null;
    }
  };
  module.exports = ZipEntry;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/zipEntries.js
var require_zipEntries = __commonJS((exports, module) => {
  var readerFor = require_readerFor();
  var utils = require_utils();
  var sig = require_signature();
  var ZipEntry = require_zipEntry();
  var support = require_support();
  function ZipEntries(loadOptions) {
    this.files = [];
    this.loadOptions = loadOptions;
  }
  ZipEntries.prototype = {
    checkSignature: function(expectedSignature) {
      if (!this.reader.readAndCheckSignature(expectedSignature)) {
        this.reader.index -= 4;
        var signature = this.reader.readString(4);
        throw new Error("Corrupted zip or bug: unexpected signature " + "(" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
      }
    },
    isSignature: function(askedIndex, expectedSignature) {
      var currentIndex = this.reader.index;
      this.reader.setIndex(askedIndex);
      var signature = this.reader.readString(4);
      var result = signature === expectedSignature;
      this.reader.setIndex(currentIndex);
      return result;
    },
    readBlockEndOfCentral: function() {
      this.diskNumber = this.reader.readInt(2);
      this.diskWithCentralDirStart = this.reader.readInt(2);
      this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
      this.centralDirRecords = this.reader.readInt(2);
      this.centralDirSize = this.reader.readInt(4);
      this.centralDirOffset = this.reader.readInt(4);
      this.zipCommentLength = this.reader.readInt(2);
      var zipComment = this.reader.readData(this.zipCommentLength);
      var decodeParamType = support.uint8array ? "uint8array" : "array";
      var decodeContent = utils.transformTo(decodeParamType, zipComment);
      this.zipComment = this.loadOptions.decodeFileName(decodeContent);
    },
    readBlockZip64EndOfCentral: function() {
      this.zip64EndOfCentralSize = this.reader.readInt(8);
      this.reader.skip(4);
      this.diskNumber = this.reader.readInt(4);
      this.diskWithCentralDirStart = this.reader.readInt(4);
      this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
      this.centralDirRecords = this.reader.readInt(8);
      this.centralDirSize = this.reader.readInt(8);
      this.centralDirOffset = this.reader.readInt(8);
      this.zip64ExtensibleData = {};
      var extraDataSize = this.zip64EndOfCentralSize - 44, index = 0, extraFieldId, extraFieldLength, extraFieldValue;
      while (index < extraDataSize) {
        extraFieldId = this.reader.readInt(2);
        extraFieldLength = this.reader.readInt(4);
        extraFieldValue = this.reader.readData(extraFieldLength);
        this.zip64ExtensibleData[extraFieldId] = {
          id: extraFieldId,
          length: extraFieldLength,
          value: extraFieldValue
        };
      }
    },
    readBlockZip64EndOfCentralLocator: function() {
      this.diskWithZip64CentralDirStart = this.reader.readInt(4);
      this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
      this.disksCount = this.reader.readInt(4);
      if (this.disksCount > 1) {
        throw new Error("Multi-volumes zip are not supported");
      }
    },
    readLocalFiles: function() {
      var i, file2;
      for (i = 0;i < this.files.length; i++) {
        file2 = this.files[i];
        this.reader.setIndex(file2.localHeaderOffset);
        this.checkSignature(sig.LOCAL_FILE_HEADER);
        file2.readLocalPart(this.reader);
        file2.handleUTF8();
        file2.processAttributes();
      }
    },
    readCentralDir: function() {
      var file2;
      this.reader.setIndex(this.centralDirOffset);
      while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
        file2 = new ZipEntry({
          zip64: this.zip64
        }, this.loadOptions);
        file2.readCentralPart(this.reader);
        this.files.push(file2);
      }
      if (this.centralDirRecords !== this.files.length) {
        if (this.centralDirRecords !== 0 && this.files.length === 0) {
          throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }
      }
    },
    readEndOfCentral: function() {
      var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
      if (offset < 0) {
        var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);
        if (isGarbage) {
          throw new Error("Can't find end of central directory : is this a zip file ? " + "If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
        } else {
          throw new Error("Corrupted zip: can't find end of central directory");
        }
      }
      this.reader.setIndex(offset);
      var endOfCentralDirOffset = offset;
      this.checkSignature(sig.CENTRAL_DIRECTORY_END);
      this.readBlockEndOfCentral();
      if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
        this.zip64 = true;
        offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
        if (offset < 0) {
          throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
        }
        this.reader.setIndex(offset);
        this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
        this.readBlockZip64EndOfCentralLocator();
        if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
          this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
          if (this.relativeOffsetEndOfZip64CentralDir < 0) {
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          }
        }
        this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
        this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
        this.readBlockZip64EndOfCentral();
      }
      var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
      if (this.zip64) {
        expectedEndOfCentralDirOffset += 20;
        expectedEndOfCentralDirOffset += 12 + this.zip64EndOfCentralSize;
      }
      var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
      if (extraBytes > 0) {
        if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {} else {
          this.reader.zero = extraBytes;
        }
      } else if (extraBytes < 0) {
        throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
      }
    },
    prepareReader: function(data) {
      this.reader = readerFor(data);
    },
    load: function(data) {
      this.prepareReader(data);
      this.readEndOfCentral();
      this.readCentralDir();
      this.readLocalFiles();
    }
  };
  module.exports = ZipEntries;
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/load.js
var require_load = __commonJS((exports, module) => {
  var utils = require_utils();
  var external = require_external();
  var utf8 = require_utf8();
  var ZipEntries = require_zipEntries();
  var Crc32Probe = require_Crc32Probe();
  var nodejsUtils = require_nodejsUtils();
  function checkEntryCRC32(zipEntry) {
    return new external.Promise(function(resolve, reject) {
      var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe);
      worker.on("error", function(e) {
        reject(e);
      }).on("end", function() {
        if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
          reject(new Error("Corrupted zip : CRC32 mismatch"));
        } else {
          resolve();
        }
      }).resume();
    });
  }
  module.exports = function(data, options) {
    var zip = this;
    options = utils.extend(options || {}, {
      base64: false,
      checkCRC32: false,
      optimizedBinaryString: false,
      createFolders: false,
      decodeFileName: utf8.utf8decode
    });
    if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
      return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."));
    }
    return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64).then(function(data2) {
      var zipEntries = new ZipEntries(options);
      zipEntries.load(data2);
      return zipEntries;
    }).then(function checkCRC32(zipEntries) {
      var promises = [external.Promise.resolve(zipEntries)];
      var files = zipEntries.files;
      if (options.checkCRC32) {
        for (var i = 0;i < files.length; i++) {
          promises.push(checkEntryCRC32(files[i]));
        }
      }
      return external.Promise.all(promises);
    }).then(function addFiles(results) {
      var zipEntries = results.shift();
      var files = zipEntries.files;
      for (var i = 0;i < files.length; i++) {
        var input = files[i];
        var unsafeName = input.fileNameStr;
        var safeName = utils.resolve(input.fileNameStr);
        zip.file(safeName, input.decompressed, {
          binary: true,
          optimizedBinaryString: true,
          date: input.date,
          dir: input.dir,
          comment: input.fileCommentStr.length ? input.fileCommentStr : null,
          unixPermissions: input.unixPermissions,
          dosPermissions: input.dosPermissions,
          createFolders: options.createFolders
        });
        if (!input.dir) {
          zip.file(safeName).unsafeOriginalName = unsafeName;
        }
      }
      if (zipEntries.zipComment.length) {
        zip.comment = zipEntries.zipComment;
      }
      return zip;
    });
  };
});

// node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/index.js
var require_lib3 = __commonJS((exports, module) => {
  function JSZip() {
    if (!(this instanceof JSZip)) {
      return new JSZip;
    }
    if (arguments.length) {
      throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
    }
    this.files = Object.create(null);
    this.comment = null;
    this.root = "";
    this.clone = function() {
      var newObj = new JSZip;
      for (var i in this) {
        if (typeof this[i] !== "function") {
          newObj[i] = this[i];
        }
      }
      return newObj;
    };
  }
  JSZip.prototype = require_object();
  JSZip.prototype.loadAsync = require_load();
  JSZip.support = require_support();
  JSZip.defaults = require_defaults();
  JSZip.version = "3.10.1";
  JSZip.loadAsync = function(content, options) {
    return new JSZip().loadAsync(content, options);
  };
  JSZip.external = require_external();
  module.exports = JSZip;
});

// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./envelope.ts
var MANUS_ADDON_RESULT_SCHEMA = "manus.addon.result/v1";
var MAX_MANUS_ADDON_INLINE_RESOURCE_BYTES = 32 * 1024;
function createAddonResourceToolResult({
  addonId,
  resource,
  widgetUri,
  title,
  text,
  modelSummary,
  effects,
  version
}) {
  const resourceUri = resource?.resourceUri ?? resource?.uri;
  if (!text.trim()) {
    throw new Error("Addon Resource result text must not be empty");
  }
  if (resource?.preventAutoCollapse !== undefined && typeof resource.preventAutoCollapse !== "boolean") {
    throw new Error("Addon Resource preventAutoCollapse must be a boolean");
  }
  const addonResult = {
    schema: MANUS_ADDON_RESULT_SCHEMA,
    addonId,
    resources: [
      {
        ...resource,
        resourceUri,
        widgetUri,
        ...title ? { title } : {}
      }
    ],
    widgets: widgetUri ? [
      {
        widgetUri,
        resourceUri,
        mode: "show",
        ...version ? { version } : {}
      }
    ] : [],
    ...Array.isArray(effects) && effects.length > 0 ? { effects } : {},
    ...modelSummary ? { modelSummary } : {}
  };
  return {
    content: [{ type: "text", text }],
    structuredContent: {
      addon_result: addonResult,
      resource_uri: resourceUri,
      widget_uri: widgetUri,
      ...modelSummary ? { model_summary: modelSummary } : {}
    },
    _meta: {
      [MANUS_ADDON_RESULT_SCHEMA]: addonResult
    }
  };
}
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./clientContext.ts
function normalizeAddonClientContext(value) {
  if (!value || typeof value !== "object" || !("platform" in value))
    return;
  const { platform } = value;
  if (platform !== "ios" && platform !== "android" && platform !== "web" && platform !== "desktop") {
    return;
  }
  const version = "version" in value && typeof value.version === "string" ? value.version.trim() : "";
  const productName = "productName" in value ? value.productName : undefined;
  return {
    platform,
    ...productName === "manus" || productName === "manus-agents" ? { productName } : {},
    .../^[A-Za-z0-9][A-Za-z0-9._+-]{0,63}$/.test(version) ? { version } : {}
  };
}

// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./invocationContext.ts
var MANUS_ADDON_INVOCATION_CONTEXT_META_KEY = "ai.manus/invocationContext";
function addonInvocationContextFromToolCall(params) {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return;
  }
  const meta = params._meta;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return;
  }
  const value = meta[MANUS_ADDON_INVOCATION_CONTEXT_META_KEY];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return;
  }
  const record = value;
  const sessionId = typeof record.sessionId === "string" ? record.sessionId.trim() : "";
  if (!sessionId) {
    return;
  }
  const workspaceId = typeof record.workspaceId === "string" ? record.workspaceId.trim() || null : null;
  const directoryId = typeof record.directoryId === "string" ? record.directoryId.trim() || null : null;
  const workingDirectory = typeof record.workingDirectory === "string" ? record.workingDirectory.trim() || null : null;
  const dataDirectory = typeof record.dataDirectory === "string" ? record.dataDirectory.trim() || null : null;
  const client = normalizeAddonClientContext(record.client);
  return {
    sessionId,
    workspaceId,
    directoryId,
    workingDirectory,
    dataDirectory,
    ...client ? { client } : {}
  };
}
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./bridge.ts
var MANUS_WIDGET_AUDIO_MAX_BYTES = 25 * 1024 * 1024;
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./oauth.ts
var OAUTH_PROVIDERS = {
  GOOGLE_DRIVE: "google_drive",
  ONE_DRIVE_PERSONAL: "one_drive_personal",
  ONE_DRIVE_BUSINESS: "one_drive_business",
  GOOGLE_GMAIL: "google_gmail",
  GOOGLE_CALENDAR: "google_calendar",
  GOOGLE_ADS: "google_ads",
  GITHUB: "github",
  FIGMA: "figma",
  MICROSOFT_OUTLOOK: "microsoft_outlook",
  MICROSOFT_CALENDAR: "microsoft_calendar",
  META_MARKETING: "meta_marketing",
  META_CREATORS: "meta_creators",
  INSTAGRAM: "instagram",
  SHOPIFY: "shopify",
  X: "x",
  NOTION: "notion"
};
var OAUTH_PROVIDER_VALUES = Object.values(OAUTH_PROVIDERS);
var OAUTH_ENV_SOURCES = {
  ACCESS_TOKEN: "oauth.access_token",
  ACCOUNT: "oauth.account",
  ACCOUNT_UID: "oauth.account_uid",
  ACCOUNTS: "oauth.accounts"
};
var OAUTH_ENV_SOURCE_VALUES = Object.values(OAUTH_ENV_SOURCES);
var MCP_EXECUTION_MODES = {
  RUNTIME: "runtime_mcp",
  DEVICE: "device_mcp",
  CONNECTOR: "connector_mcp"
};
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./executionModes.ts
var MCP_EXECUTION_MODE_VALUES = [
  MCP_EXECUTION_MODES.RUNTIME,
  MCP_EXECUTION_MODES.DEVICE,
  MCP_EXECUTION_MODES.CONNECTOR
];
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./agentHooks.ts
var ADDON_HOOK_TRIGGERS = {
  FILE_EDIT_COMPLETED: "host_file_edit_completed",
  USER_CHAT: "host_user_chat",
  TODO_COMPLETED: "host_todo_completed",
  TERMINAL_PRE_EXEC: "host_terminal_pre_exec",
  TERMINAL_POST_EXEC: "host_terminal_post_exec"
};
var ADDON_HOOK_RESULT_KINDS = {
  AGENT_REMINDER: "agent_reminder",
  MODEL_CALL: "model_call",
  SUBAGENT_START: "subagent_start",
  EXECUTION_BLOCK: "execution_block"
};
var ADDON_SUBAGENT_MAX_INSTRUCTIONS_BYTES = 64 * 1024;
var ADDON_HOOK_RESULT_KINDS_BY_TRIGGER = {
  [ADDON_HOOK_TRIGGERS.FILE_EDIT_COMPLETED]: [
    ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER,
    ADDON_HOOK_RESULT_KINDS.MODEL_CALL
  ],
  [ADDON_HOOK_TRIGGERS.USER_CHAT]: [ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER],
  [ADDON_HOOK_TRIGGERS.TODO_COMPLETED]: [
    ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER,
    ADDON_HOOK_RESULT_KINDS.SUBAGENT_START
  ],
  [ADDON_HOOK_TRIGGERS.TERMINAL_PRE_EXEC]: [
    ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER,
    ADDON_HOOK_RESULT_KINDS.EXECUTION_BLOCK
  ],
  [ADDON_HOOK_TRIGGERS.TERMINAL_POST_EXEC]: [ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER]
};
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./notifications.ts
var ADDON_WIDGET_NOTIFICATION_LIMITS = {
  maxDefinitions: 32,
  maxTextLength: 2000,
  maxPayloadBytes: 32 * 1024
};
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./updateModes.ts
var ADDON_UPDATE_MODES = {
  HOT: "hot",
  RESTART: "restart"
};
var DEFAULT_ADDON_UPDATE_MODE = ADDON_UPDATE_MODES.RESTART;
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-protocol./file.ts
var MANUS_WIDGET_FILE_MAX_BYTES = 256 * 1024 * 1024;
var MANUS_WIDGET_JSON_MAX_BYTES = 64 * 1024;
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-tools./mcpServer.ts
import readline from "node:readline";

// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-tools./mcpConnectionLifecycle.ts
var MCP_CONNECTION_LIFECYCLE_CAPABILITY = "manus.addon.connection-lifecycle/v1";
var MCP_CAN_SHUTDOWN_METHOD = "manus/lifecycle/canShutdown";

class McpConnectionLifecycle {
  leases = 0;
  get isIdle() {
    return this.leases === 0;
  }
  acquire() {
    this.leases += 1;
    let released = false;
    return () => {
      if (released)
        return;
      released = true;
      this.leases -= 1;
    };
  }
}

// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-tools./mcpServer.ts
function createMcpServer(options) {
  const protocolVersion = options.protocolVersion ?? "2024-11-05";
  const capabilities = { ...options.capabilities ?? { tools: {} } };
  if (options.connectionLifecycle) {
    capabilities.experimental = {
      ...capabilities.experimental,
      [MCP_CONNECTION_LIFECYCLE_CAPABILITY]: true
    };
  }
  function respond(id, result) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}
`);
  }
  function fail(id, code, message) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } })}
`);
  }
  async function handleMessage(message, io) {
    const { respond: respond2, fail: fail2 } = io;
    const { id, method, params } = message;
    if (method === "initialize") {
      respond2(id, {
        protocolVersion,
        serverInfo: options.serverInfo,
        capabilities
      });
      return;
    }
    if (method === MCP_CAN_SHUTDOWN_METHOD && options.connectionLifecycle) {
      respond2(id, { idle: options.connectionLifecycle.isIdle });
      return;
    }
    if (method === "tools/list") {
      respond2(id, { tools: options.listTools() });
      return;
    }
    if (method === "tools/call") {
      const release = options.connectionLifecycle?.acquire();
      try {
        await options.callTool(id, params, io);
      } finally {
        release?.();
      }
      return;
    }
    if (method === "ping") {
      respond2(id, {});
      return;
    }
    if (method === "notifications/initialized") {
      return;
    }
    fail2(id, -32601, `unknown method: ${method}`);
  }
  function start() {
    const input = readline.createInterface({ input: process.stdin, terminal: false });
    input.on("line", (line) => {
      if (!line.trim())
        return;
      try {
        const message = JSON.parse(line);
        let responded = false;
        const io = {
          respond: (id, result) => {
            if (responded)
              return;
            respond(id, result);
            responded = true;
          },
          fail: (id, code, message2) => {
            if (responded)
              return;
            fail(id, code, message2);
            responded = true;
          }
        };
        handleMessage(message, io).catch((error) => {
          console.error("[mcp] request handler failed", error instanceof Error ? error.name : typeof error);
          if (error instanceof Error && error.stack)
            console.error(error.stack.split(`
`).slice(1).join(`
`));
          io.fail(message?.id ?? null, -32603, String(error instanceof Error ? error.message : error));
        });
      } catch (error) {
        fail(null, -32700, String(error instanceof Error ? error.message : error));
      }
    });
    let shuttingDown = false;
    function shutdown() {
      if (shuttingDown)
        return;
      shuttingDown = true;
      (async () => {
        await options.onShutdown?.();
      })().finally(() => process.exit(0));
    }
    input.on("close", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }
  return { start, respond, fail };
}
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-tools./backend/runtime-auth.ts
import crypto from "node:crypto";
var SUBJECT_TOKEN_META_KEY = "ai.manus/subjectToken";
var CONTINUATION_META_KEY = "ai.manus/continuation";
var runtimeSessionRefreshMarginMs = 60000;
var maxCachedSessions = 8;
function subjectTokenFromToolCall(params) {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return "";
  }
  const meta = params._meta;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return "";
  }
  const token = meta[SUBJECT_TOKEN_META_KEY];
  return typeof token === "string" ? token.trim() : "";
}
function continuationFromToolCall(params) {
  if (!params || typeof params !== "object" || Array.isArray(params))
    return;
  const meta = params._meta;
  if (!meta || typeof meta !== "object" || Array.isArray(meta))
    return;
  const value = meta[CONTINUATION_META_KEY];
  if (!value || typeof value !== "object" || Array.isArray(value))
    return;
  const record = value;
  const id = String(record.id ?? "").trim();
  const callbackUrl = String(record.callback_url ?? record.callbackUrl ?? "").trim();
  const capability = String(record.capability ?? "").trim();
  const expiresAtMs = Number(record.expires_at ?? record.expiresAt);
  if (!id || !callbackUrl || !capability || !Number.isFinite(expiresAtMs))
    return;
  return { id, callbackUrl, capability, expiresAtMs };
}
function subjectCacheKey(subjectToken) {
  return crypto.createHash("sha256").update(subjectToken).digest("base64url");
}
function canOpenRuntimeConnection(credential, now = Date.now()) {
  return credential.expiresAtMs - now > runtimeSessionRefreshMarginMs;
}

class RuntimeSessionCache {
  bootstrap;
  sessions = new Map;
  inFlight = new Map;
  constructor(bootstrap) {
    this.bootstrap = bootstrap;
  }
  async get(subjectToken) {
    const token = subjectToken.trim();
    if (!token) {
      throw new Error("missing_subject_token");
    }
    const cacheKey = subjectCacheKey(token);
    const cached = this.sessions.get(cacheKey);
    if (cached && canOpenRuntimeConnection(cached)) {
      return cached;
    }
    const pending = this.inFlight.get(cacheKey);
    if (pending) {
      return pending;
    }
    const request = this.bootstrap(token).then((session) => {
      if (!session.token || !Number.isFinite(session.expiresAtMs) || session.expiresAtMs <= Date.now()) {
        throw new Error("invalid_runtime_session");
      }
      const credential = { cacheKey, ...session };
      this.sessions.set(cacheKey, credential);
      this.prune();
      return credential;
    }).finally(() => this.inFlight.delete(cacheKey));
    this.inFlight.set(cacheKey, request);
    return request;
  }
  invalidate(credential) {
    if (credential && this.sessions.get(credential.cacheKey)?.token === credential.token) {
      this.sessions.delete(credential.cacheKey);
    }
  }
  prune() {
    const now = Date.now();
    for (const [key, credential] of this.sessions) {
      if (credential.expiresAtMs <= now) {
        this.sessions.delete(key);
      }
    }
    while (this.sessions.size > maxCachedSessions) {
      const oldest = this.sessions.keys().next().value;
      if (typeof oldest !== "string")
        break;
      this.sessions.delete(oldest);
    }
  }
}
// node_modules/.pnpm/@manus+addon-kit@git+https+++github.com+manus-ai+manus-addon.git+96218400269b418f6c23f659971afa94d029faca/node_modules/@manus/addon-kit/packages/addon-tools./backend/addonServerClient.ts
import { AsyncLocalStorage } from "node:async_hooks";
class AddonServerClient {
  endpoint;
  bootstrapTimeoutMs;
  writeTimeoutMs;
  readTimeoutMs;
  authContext = new AsyncLocalStorage;
  runtimeSessions;
  lastKnownAddonVersion;
  constructor(options) {
    this.endpoint = options.endpoint.replace(/\/$/, "");
    this.bootstrapTimeoutMs = options.bootstrapTimeoutMs ?? options.requestTimeoutMs ?? 5000;
    this.writeTimeoutMs = options.writeTimeoutMs ?? options.requestTimeoutMs ?? 15000;
    this.readTimeoutMs = options.readTimeoutMs ?? options.requestTimeoutMs ?? 5000;
    this.runtimeSessions = new RuntimeSessionCache((subjectToken) => this.bootstrap(subjectToken));
  }
  async runWithSubjectToken(subjectToken, task) {
    const token = String(subjectToken ?? "").trim();
    if (!token)
      throw new Error("missing_subject_token");
    const credential = await this.runtimeSessions.get(token);
    return this.authContext.run({ subjectToken: token, credential }, task);
  }
  currentCredential() {
    const state = this.authContext.getStore();
    if (!state)
      throw new Error("missing_subject_token");
    return state.credential;
  }
  addonVersion() {
    return this.lastKnownAddonVersion;
  }
  canReconnect(credential) {
    return canOpenRuntimeConnection(credential);
  }
  invalidateCredential(credential) {
    this.runtimeSessions.invalidate(credential);
  }
  onWriteConflictResponse(_pathname, _body) {}
  async bootstrap(subjectToken) {
    const controller = new AbortController;
    const timeout = setTimeout(() => controller.abort(), this.bootstrapTimeoutMs);
    try {
      const response = await fetch(`${this.endpoint}/api/v1/runtime/bootstrap`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${subjectToken}`
        },
        body: JSON.stringify({}),
        signal: controller.signal
      });
      if (!response.ok) {
        const details = await response.text().catch(() => "");
        throw new Error(`runtime_bootstrap_http_${response.status}${details ? `: ${details}` : ""}`);
      }
      const payload = await response.json().catch(() => {
        return;
      });
      const token = String(payload?.token ?? "");
      const expiresInSeconds = Number(payload?.expires_in_seconds ?? payload?.expiresInSeconds ?? 0);
      if (!token) {
        throw new Error("runtime_bootstrap_missing_session");
      }
      const addonVersion = payload?.addon_version ?? payload?.addonVersion;
      if (typeof addonVersion === "string" && addonVersion) {
        this.lastKnownAddonVersion = addonVersion;
      }
      return {
        token,
        expiresAtMs: Date.now() + (expiresInSeconds > 0 ? expiresInSeconds : 300) * 1000
      };
    } catch (error) {
      throw new Error(`runtime_bootstrap_failed: ${error instanceof Error ? error.message : error}`);
    } finally {
      clearTimeout(timeout);
    }
  }
  authHeaders(credential = this.currentCredential()) {
    return { authorization: `Bearer ${credential.token}` };
  }
  async refreshCredentialAfterUnauthorized(rejectedCredential) {
    const state = this.authContext.getStore();
    if (!state)
      throw new Error("missing_subject_token");
    if (state.credential.token !== rejectedCredential.token) {
      return state.credential;
    }
    this.runtimeSessions.invalidate(rejectedCredential);
    const refreshed = await this.runtimeSessions.get(state.subjectToken);
    if (state.credential.token === rejectedCredential.token) {
      state.credential = refreshed;
    }
    return state.credential;
  }
  async post(pathname, body, requestTimeoutMs = this.writeTimeoutMs) {
    for (let attempt = 0;attempt < 2; attempt += 1) {
      const controller = new AbortController;
      const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
      const credential = this.currentCredential();
      try {
        const response = await fetch(`${this.endpoint}${pathname}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...this.authHeaders(credential)
          },
          body: JSON.stringify(body ?? {}),
          signal: controller.signal
        });
        if (!response.ok) {
          if (response.status === 401 && attempt === 0) {
            await response.body?.cancel().catch(() => {
              return;
            });
            await this.refreshCredentialAfterUnauthorized(credential);
            continue;
          }
          if (response.status === 401) {
            this.runtimeSessions.invalidate(credential);
          }
          const details = await response.text().catch(() => "");
          if (response.status === 409) {
            this.onWriteConflictResponse(pathname, body);
          }
          throw new Error(`Addon Server returned HTTP ${response.status}${details ? `: ${details}` : ""}`);
        }
        return await response.json();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error(`Addon Server request timed out: POST ${pathname}`);
        }
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new Error("Addon Server request retry exhausted");
  }
  async get(pathname) {
    for (let attempt = 0;attempt < 2; attempt += 1) {
      const controller = new AbortController;
      const timeout = setTimeout(() => controller.abort(), this.readTimeoutMs);
      const credential = this.currentCredential();
      try {
        const response = await fetch(`${this.endpoint}${pathname}`, {
          method: "GET",
          headers: this.authHeaders(credential),
          signal: controller.signal
        });
        if (!response.ok) {
          if (response.status === 401 && attempt === 0) {
            await response.body?.cancel().catch(() => {
              return;
            });
            await this.refreshCredentialAfterUnauthorized(credential);
            continue;
          }
          if (response.status === 401) {
            this.runtimeSessions.invalidate(credential);
          }
          const details = await response.text().catch(() => "");
          throw new Error(`Addon Server returned HTTP ${response.status}${details ? `: ${details}` : ""}`);
        }
        return await response.json();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error(`Addon Server request timed out: GET ${pathname}`);
        }
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new Error("Addon Server request retry exhausted");
  }
}
// mcp/slidesServiceRetry.ts
var SLIDES_SERVICE_MAX_ATTEMPTS = 3;
var SLIDES_SERVICE_GATEWAY_TIMEOUT_MAX_ATTEMPTS = 2;
var SLIDES_SERVICE_SLOW_FAILURE_MS = 5000;
var SLIDES_SERVICE_RETRY_DELAYS_MS = [1000, 2000];
function slidesServiceMaxAttempts(error, elapsedMs = 0) {
  const limit = maxAttemptsByError(error);
  if (elapsedMs >= SLIDES_SERVICE_SLOW_FAILURE_MS)
    return Math.min(limit, SLIDES_SERVICE_GATEWAY_TIMEOUT_MAX_ATTEMPTS);
  return limit;
}
function maxAttemptsByError(error) {
  if (!(error instanceof Error))
    return 1;
  const message = error.message;
  const http = /(?:^Addon Server returned HTTP |runtime_bootstrap_http_)(\d{3})/.exec(message);
  if (http) {
    const status = Number(http[1]);
    if (status === 504)
      return SLIDES_SERVICE_GATEWAY_TIMEOUT_MAX_ATTEMPTS;
    if (status === 502 || status === 503)
      return SLIDES_SERVICE_MAX_ATTEMPTS;
    return 1;
  }
  const bootstrap = message.startsWith("runtime_bootstrap_failed:");
  if ((error instanceof TypeError || bootstrap) && /fetch failed/i.test(message))
    return SLIDES_SERVICE_MAX_ATTEMPTS;
  return 1;
}
async function withSlidesServiceRetry(run, options = {}) {
  for (let attempt = 1;; attempt += 1) {
    const startedAt = Date.now();
    try {
      return await run();
    } catch (error) {
      const limit = slidesServiceMaxAttempts(error, Date.now() - startedAt);
      if (attempt >= limit || options.canRetry?.() === false)
        throw error;
      await new Promise((resolve) => setTimeout(resolve, slidesServiceRetryDelayMs(attempt)));
    }
  }
}
function slidesServiceRetryDelayMs(retry) {
  const base = SLIDES_SERVICE_RETRY_DELAYS_MS[Math.min(retry, SLIDES_SERVICE_RETRY_DELAYS_MS.length) - 1];
  return Math.round(base * (0.75 + Math.random() * 0.5));
}

// mcp/addonServerClient.ts
var defaultHostImageTimeoutMs = 300000;
var defaultDesignBriefTimeoutMs = 300000;
var defaultExportTimeoutMs = 300000;
var defaultBootstrapTimeoutMs = 120000;
var defaultReadTimeoutMs = 120000;
var defaultWriteTimeoutMs = 120000;

class AddonServerClient2 extends AddonServerClient {
  hostImageTimeoutMs;
  constructor(options) {
    super({
      ...options,
      bootstrapTimeoutMs: options.bootstrapTimeoutMs ?? options.requestTimeoutMs ?? defaultBootstrapTimeoutMs,
      readTimeoutMs: options.readTimeoutMs ?? options.requestTimeoutMs ?? defaultReadTimeoutMs,
      writeTimeoutMs: options.writeTimeoutMs ?? options.requestTimeoutMs ?? defaultWriteTimeoutMs
    });
    this.hostImageTimeoutMs = options.hostImageTimeoutMs ?? defaultHostImageTimeoutMs;
  }
  async createProject(resourceKey, project, coverImage) {
    const response = await withSlidesServiceRetry(() => this.post(`/api/v1/resources/${resourceKey}`, { project, coverImage }));
    if (!response?.resource_uri || !response?.resource) {
      throw new Error("Addon Server did not return resource descriptor");
    }
    return response;
  }
  async upsertProject(resourceKey, project, coverImage, source = "runtime_mcp") {
    return withSlidesServiceRetry(() => this.post(`/api/v1/resources/${resourceKey}`, {
      project,
      coverImage,
      source,
      sync: { files: "replace" }
    }));
  }
  async submitProjectVersion(resourceKey, projectId, file2, coverImage) {
    return this.post(`/api/v1/resources/${resourceKey}/${encodeURIComponent(projectId)}/versions`, {
      file: file2,
      coverImage,
      source: "runtime_mcp"
    });
  }
  async getSlideTemplate(templateId) {
    return withSlidesServiceRetry(() => this.get(`/api/v1/slide-templates/${encodeURIComponent(templateId)}`));
  }
  async readProject(resourceKey, projectId) {
    return withSlidesServiceRetry(() => this.get(`/api/v1/resources/${resourceKey}/${encodeURIComponent(projectId)}/read`));
  }
  async startFileEditRepair(input) {
    return this.post("/api/v1/hook-repairs", input);
  }
  async reportRuntimeFailure(kind, detail) {
    return this.post("/api/v1/runtime/telemetry", { kind, ...detail ? { detail } : {} });
  }
  async uploadAssets(resourceKey, projectId, assets) {
    return this.post(`/api/v1/resources/${resourceKey}/assets`, {
      project_id: projectId,
      assets
    });
  }
  async createFileUpload(input) {
    return this.post("/api/v1/files/uploads", input);
  }
  async generateImage(input) {
    return this.post("/api/v1/host/images/generate", input, this.hostImageTimeoutMs);
  }
  async exportDeck(input) {
    return this.post("/api/v1/host/exports", {
      project_id: input.projectId,
      format: input.format,
      ...input.versionId ? { version_id: input.versionId } : {}
    }, defaultExportTimeoutMs);
  }
  async generateDesignBrief(input) {
    return this.post("/api/v1/host/design-briefs", {
      title: input.title,
      generate_mode: input.generateMode,
      outline: input.outline,
      ...input.deckTopic ? { deck_topic: input.deckTopic } : {},
      ...input.styleRequest ? { style_request: input.styleRequest } : {}
    }, defaultDesignBriefTimeoutMs);
  }
}
function versionIDFromPayload(payload) {
  return payload?.version?.version_id ?? payload?.version?.versionId ?? payload?.resource?.version?.version_id;
}

// mcp/browserWorkerInvocation.ts
import { AsyncLocalStorage as AsyncLocalStorage2 } from "node:async_hooks";
var storage = new AsyncLocalStorage2;
function runWithBrowserWorkerInvocation(invocation, callback) {
  return invocation ? storage.run(invocation, callback) : callback();
}
function currentBrowserWorkerInvocation() {
  return storage.getStore();
}

// mcp/projectStore.ts
import crypto2 from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// mcp/pptx/pptxMode.ts
var PPTX_DESIGN_FILE = "design.xml";
var PPTX_RESERVED_SLIDE_IDS = ["design"];
var PPTX_CANVAS_SIZE = [1280, 720];
function isPptxModeProject(project) {
  return project.viewState?.generate_mode === "pptx" || project.viewState?.isPptxSlides === true;
}
function slidePageExtension(project) {
  return isPptxModeProject(project) ? "xml" : "html";
}
function slidePageFileName(project, slideID) {
  return `${slideID}.${slidePageExtension(project)}`;
}
function pptxXmlRootOf(content) {
  const withoutDeclaration = content.replace(/^\uFEFF/, "").trimStart().replace(/^<\?xml\b[^>]*>\s*/i, "");
  const root = withoutDeclaration.match(/^<(?:!doctype\s+)?([a-z][\w-]*)\b/i)?.[1]?.toLowerCase();
  return root === "slide" || root === "design" ? root : undefined;
}
function strayPptxXmlRootOf(project, content) {
  return isPptxModeProject(project) ? undefined : pptxXmlRootOf(String(content ?? ""));
}

// mcp/projectStore.ts
var ADDON_ID = "manus-slides";
var RESOURCE_KEY = "deck";
var WIDGET_ID = "studio";
var CHAT_CARD_WIDGET_ID = "chat-slide-card";
var STARTER_SLIDE_ID = "cover";
var SLIDE_STATE_EDIT_PENDING = "edit_pending";
var SLIDE_STATE_EDITED = "edited";

class ProjectStore {
  projectRoot;
  workspaceRoot;
  projects = new Map;
  constructor(options) {
    this.projectRoot = path.resolve(options.projectRoot);
    this.workspaceRoot = path.dirname(this.projectRoot);
  }
  getProject(projectID) {
    return this.projects.get(projectID);
  }
  cache(project) {
    this.projects.set(project.id, project);
    return project;
  }
  createProjectScaffold(title, outlineInput) {
    const entries = Array.isArray(outlineInput) ? outlineInput : [];
    const slideIds = [];
    const outline = [];
    const taken = new Set;
    if (entries.length === 0) {
      slideIds.push(STARTER_SLIDE_ID);
      outline.push({ id: STARTER_SLIDE_ID, title, summary: "", state: SLIDE_STATE_EDIT_PENDING });
      return { slideIds, outline };
    }
    for (const entry of entries) {
      const record = entry && typeof entry === "object" ? entry : {};
      const slideTitle = safeTitle(record.title ?? record.page_title);
      const id = allocateSlideId(record.id ?? slideTitle, taken);
      taken.add(id);
      slideIds.push(id);
      outline.push({
        id,
        title: slideTitle,
        summary: String(record.summary ?? ""),
        ...record.slide_template_key || record.slideTemplateKey ? { slide_template_key: String(record.slide_template_key ?? record.slideTemplateKey) } : {},
        state: SLIDE_STATE_EDIT_PENDING
      });
    }
    return { slideIds, outline };
  }
  projectDirectory(projectID) {
    return path.join(this.projectRoot, projectID);
  }
  projectDirectoryExists(projectID) {
    return fs.existsSync(this.projectDirectory(projectID));
  }
  writeProjectFiles(project) {
    fs.mkdirSync(project.projectDir, { recursive: true });
    for (const file2 of project.files) {
      this.writeContentFile(project, file2.path, file2.content);
    }
    this.writeProjectConfig(project);
  }
  writeProjectConfig(project) {
    fs.mkdirSync(project.projectDir, { recursive: true });
    const configPath = path.join(project.projectDir, "project.json");
    const tmpPath = `${configPath}.${process.pid}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(projectConfig(project), null, 2)}
`, "utf8");
    const tmpStat = fs.statSync(tmpPath);
    fs.renameSync(tmpPath, configPath);
    project.configMtimeMs = tmpStat.mtimeMs;
  }
  writeContentFile(project, relativePath, content) {
    const filePath = this.safeAbsoluteProjectPath(project.projectDir, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf8");
    return filePath;
  }
  writeBinaryFile(project, relativePath, content) {
    const filePath = this.safeAbsoluteProjectPath(project.projectDir, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
    return filePath;
  }
  snapshotFile(project, relativePath) {
    const filePath = this.safeAbsoluteProjectPath(project.projectDir, relativePath);
    try {
      return fs.readFileSync(filePath);
    } catch (error) {
      if (error?.code === "ENOENT")
        return;
      throw error;
    }
  }
  restoreFileBestEffort(project, relativePath, content) {
    try {
      if (content === undefined) {
        this.deleteContentFile(project, relativePath);
      } else {
        this.writeBinaryFile(project, relativePath, content);
      }
    } catch {}
  }
  deleteContentFile(project, relativePath) {
    const filePath = this.safeAbsoluteProjectPath(project.projectDir, relativePath);
    try {
      fs.rmSync(filePath, { force: true });
    } catch {}
  }
  contentFileExists(project, relativePath) {
    return fs.existsSync(this.safeAbsoluteProjectPath(project.projectDir, relativePath));
  }
  readProjectFile(project, relativePath) {
    const safePath = normalizeRelativePath(relativePath);
    const filePath = this.safeAbsoluteProjectPath(project.projectDir, safePath);
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      return {
        path: safePath,
        mimeType: mimeTypeForPath(safePath),
        title: path.basename(safePath),
        content: /\.html?$/i.test(safePath) ? repairHTMLSnapshot(raw) : raw
      };
    } catch {
      return;
    }
  }
  readProjectConfig(projectID) {
    const id = safeProjectID(projectID);
    if (!id) {
      return;
    }
    const projectDir = this.projectDirectory(id);
    const configPath = path.join(projectDir, "project.json");
    if (!fs.existsSync(configPath)) {
      return;
    }
    try {
      const mtimeMs = this.configMtimeMs(projectDir);
      const parsed = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (String(parsed?.id ?? "") !== id) {
        return;
      }
      return this.hydrateProjectFromDisk({
        ...parsed,
        projectDir,
        files: normalizeProjectFiles(Array.isArray(parsed.files) ? parsed.files : []),
        activeFile: String(parsed.activeFile || "cover.html"),
        configMtimeMs: mtimeMs
      });
    } catch {
      return;
    }
  }
  readProjectConfigFromDir(projectDir) {
    const dir = path.resolve(String(projectDir ?? ""));
    if (!dir || !dir.startsWith(`${this.projectRoot}${path.sep}`)) {
      return;
    }
    return this.readProjectConfig(path.basename(dir));
  }
  listPersistedProjects() {
    const projects = [];
    try {
      for (const entry of fs.readdirSync(this.projectRoot, { withFileTypes: true })) {
        if (!entry.isDirectory())
          continue;
        const project = this.readProjectConfig(entry.name);
        if (project)
          projects.push(project);
      }
    } catch {
      return [];
    }
    return projects;
  }
  resolveProject(args) {
    const projectID = String(args?.project_id ?? args?.projectId ?? "").trim();
    if (projectID) {
      return this.freshProject(projectID);
    }
    const resourceUri = String(args?.resource_uri ?? args?.resourceUri ?? "").trim();
    if (resourceUri) {
      const parsed = parseSlidesResourceURI(resourceUri);
      return this.freshProject(parsed.projectId);
    }
    const projectDir = String(args?.project_dir ?? args?.projectDir ?? "").trim();
    if (projectDir) {
      return this.cacheIfFound(this.readProjectConfigFromDir(projectDir));
    }
    return;
  }
  requireProject(args) {
    const projectID = String(args?.project_id ?? args?.projectId ?? "").trim();
    if (!projectID) {
      throw new Error("project_id is required. Use the project_id returned by slides/init_slides or slides/attach_slides.");
    }
    const project = this.freshProject(projectID);
    if (!project) {
      throw new Error(`Unknown Slides project_id "${projectID}". Use the exact project_id returned by ` + "slides/init_slides or slides/attach_slides.");
    }
    return project;
  }
  applyRemoteProject(projectID, sourceProject, versionId) {
    const projectDir = this.projectDirectory(projectID);
    const files = normalizeProjectFiles(sourceProject.files);
    const expectedPaths = new Set(files.map((file2) => file2.path));
    fs.mkdirSync(projectDir, { recursive: true });
    for (const file2 of files) {
      const filePath = path.join(projectDir, file2.path);
      if (!filePath.startsWith(`${projectDir}${path.sep}`))
        continue;
      this.writeContentFile({ projectDir }, file2.path, file2.content);
    }
    for (const entry of fs.readdirSync(projectDir, { withFileTypes: true })) {
      if (!entry.isFile() || !isProjectContentFile(entry.name) || expectedPaths.has(entry.name))
        continue;
      this.deleteContentFile({ projectDir }, entry.name);
    }
    const previous = this.freshProject(projectID);
    const now = new Date().toISOString();
    const merged = withDerivedOutlineStates({
      ...previous ?? {},
      id: projectID,
      title: sourceProject.title ?? previous?.title ?? "Untitled deck",
      projectDir,
      activeFile: String(sourceProject.activeFile || previous?.activeFile || `${STARTER_SLIDE_ID}.html`),
      files,
      scaffolds: Array.isArray(sourceProject.scaffolds) ? sourceProject.scaffolds.map(String) : previous?.scaffolds ?? [],
      viewState: sourceProject.viewState ?? previous?.viewState ?? { mode: "preview", zoom: 1 },
      versionId: versionId || previous?.versionId,
      createdAt: previous?.createdAt ?? sourceProject.createdAt ?? now,
      updatedAt: now
    });
    this.projects.set(projectID, merged);
    this.writeProjectConfig(merged);
    return merged;
  }
  hydrateProjectFromDisk(project) {
    const diskFiles = [];
    const manifestPaths = new Set((project.files ?? []).map((file2) => String(file2?.path ?? "")));
    for (const id of slideIdsOfProject(project))
      manifestPaths.add(slidePageFileName(project, id));
    if (isPptxModeProject(project))
      manifestPaths.add(PPTX_DESIGN_FILE);
    const restrictToManifest = manifestPaths.size > 0;
    try {
      for (const entry of fs.readdirSync(project.projectDir, { withFileTypes: true })) {
        if (!entry.isFile() || !isProjectContentFile(entry.name))
          continue;
        if (restrictToManifest && !manifestPaths.has(entry.name))
          continue;
        const file2 = this.readProjectFile(project, entry.name);
        if (file2 && strayPptxXmlRootOf(project, file2.content))
          continue;
        if (file2)
          diskFiles.push(file2);
      }
    } catch {}
    return { ...project, files: mergeFiles(project.files ?? [], diskFiles) };
  }
  cacheIfFound(project) {
    return project ? this.cache(project) : undefined;
  }
  freshProject(projectID) {
    const cached = this.projects.get(projectID);
    if (!cached) {
      return this.cacheIfFound(this.readProjectConfig(projectID));
    }
    const diskMtimeMs = this.configMtimeMs(cached.projectDir);
    if (diskMtimeMs === undefined || diskMtimeMs === cached.configMtimeMs) {
      return cached;
    }
    return this.cacheIfFound(this.readProjectConfig(projectID)) ?? cached;
  }
  configMtimeMs(projectDir) {
    try {
      return fs.statSync(path.join(projectDir, "project.json")).mtimeMs;
    } catch {
      return;
    }
  }
  safeAbsoluteProjectPath(projectDir, relativePath) {
    const safePath = normalizeRelativePath(relativePath);
    const filePath = path.join(projectDir, safePath);
    if (!safePath || !filePath.startsWith(`${projectDir}${path.sep}`)) {
      throw new Error("file_path must stay inside the Slides project directory");
    }
    return filePath;
  }
}
function resourceURI(projectID, _title) {
  return new URL(`manus-resource://${encodeURIComponent(ADDON_ID)}/${encodeURIComponent(RESOURCE_KEY)}/${encodeURIComponent(projectID)}`).toString();
}
var URI_VERSION_PARAM_PATTERN = /[?&](?:v|version_id|versionId)=/;
function withoutURIVersionParam(uri2) {
  if (!URI_VERSION_PARAM_PATTERN.test(uri2))
    return uri2;
  try {
    const parsed = new URL(uri2);
    for (const param of ["v", "version_id", "versionId"])
      parsed.searchParams.delete(param);
    return parsed.toString();
  } catch {
    return uri2;
  }
}
function widgetURI(projectID, _title) {
  return new URL(`manus-widget://${encodeURIComponent(ADDON_ID)}/${encodeURIComponent(WIDGET_ID)}/${encodeURIComponent(RESOURCE_KEY)}/${encodeURIComponent(projectID)}`).toString();
}
function parseSlidesResourceURI(input) {
  const url = new URL(input);
  if (url.protocol !== "manus-resource:") {
    throw new Error("resource_uri must use manus-resource://");
  }
  const addon = decodeURIComponent(url.hostname);
  const segments = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  if (addon !== ADDON_ID || segments[0] !== RESOURCE_KEY || !segments[1]) {
    throw new Error(`resource_uri must point to ${ADDON_ID}/${RESOURCE_KEY}`);
  }
  return { projectId: segments[1], title: url.searchParams.get("title") || undefined };
}
function safeTitle(value) {
  return String(value ?? "").trim() || "Untitled deck";
}
function createProjectID(title) {
  const slug = safeTitle(title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "deck";
  return `${slug}-${Date.now().toString(36)}-${crypto2.randomUUID().slice(0, 8)}`;
}
function projectConfig(project) {
  return {
    id: project.id,
    title: project.title,
    designType: "deck",
    resourceUri: project.resourceUri,
    widgetUri: project.widgetUri,
    versionId: project.versionId,
    coverImageUrl: project.coverImageUrl,
    projectDir: project.projectDir,
    activeFile: project.activeFile,
    files: project.files,
    scaffolds: project.scaffolds,
    viewState: project.viewState,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  };
}
function slugifySlideId(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48);
}
function allocateSlideId(preferred, taken) {
  const base = slugifySlideId(preferred) || `slide_${taken.size + 1}`;
  if (!taken.has(base))
    return base;
  for (let n = 2;; n += 1) {
    const candidate = `${base}_${n}`;
    if (!taken.has(candidate))
      return candidate;
  }
}
function slideIdsOfProject(project) {
  const viewState = project?.viewState && typeof project.viewState === "object" ? project.viewState : {};
  return Array.isArray(viewState.slide_ids) ? viewState.slide_ids.map(String) : Array.isArray(viewState.slideIds) ? viewState.slideIds.map(String) : [];
}
function outlineOfProject(project) {
  const viewState = project?.viewState && typeof project.viewState === "object" ? project.viewState : {};
  return Array.isArray(viewState.outline) ? viewState.outline : [];
}
function slidePathForNumber(project, slideNumber) {
  const id = slideIdsOfProject(project)[slideNumber - 1];
  return id ? `${id}.html` : undefined;
}
function resolveSlideId(project, args) {
  const slideIds = slideIdsOfProject(project);
  const rawId = args?.slide_id ?? args?.slideId;
  if (rawId !== undefined && rawId !== null && String(rawId).trim() !== "") {
    const id = slugifySlideId(rawId);
    return slideIds.includes(id) ? id : undefined;
  }
  const slideNumber = optionalPositiveInteger(args?.slide_number ?? args?.slideNumber, "slide_number");
  return slideNumber ? slideIds[slideNumber - 1] : undefined;
}
function withDerivedOutlineStates(project) {
  const outline = outlineOfProject(project);
  const entriesById = new Map(outline.map((entry) => [String(entry.id), entry]));
  const contentByPath = new Map(project.files.map((file2) => [file2.path, String(file2.content ?? "")]));
  const slideIds = slideIdsOfProject(project);
  const derived = slideIds.map((id, index) => {
    const entry = entriesById.get(id) ?? { id, title: `Slide ${index + 1}` };
    const authored = Boolean(contentByPath.get(slidePageFileName(project, id))?.trim());
    return { ...entry, state: authored ? SLIDE_STATE_EDITED : SLIDE_STATE_EDIT_PENDING };
  });
  const registered = new Set(slideIds);
  const extras = outline.filter((entry) => !registered.has(String(entry.id)));
  return {
    ...project,
    viewState: { ...project.viewState, outline: [...derived, ...extras] }
  };
}
function nextPendingSlide(project) {
  const byId = new Map(outlineOfProject(project).map((entry) => [String(entry.id), entry]));
  for (const id of slideIdsOfProject(project)) {
    const entry = byId.get(id);
    if (!entry || entry.state !== SLIDE_STATE_EDITED) {
      return { id, title: String(entry?.title ?? id) };
    }
  }
  return;
}
function mergeFiles(previousFiles = [], nextFiles = []) {
  const files = new Map(previousFiles.map((file2) => [file2.path, file2]));
  for (const file2 of nextFiles) {
    files.set(file2.path, { ...files.get(file2.path) ?? {}, ...file2 });
  }
  return Array.from(files.values());
}
function normalizeRelativePath(filename) {
  return String(filename ?? "").replace(/\\/g, "/").replace(/^\/+/, "");
}
function isProjectContentFile(filename) {
  const relativePath = normalizeRelativePath(filename);
  return /\.(html?|js|css|xml)$/i.test(relativePath) && !relativePath.startsWith("screenshots/");
}
function mimeTypeForPath(filePath) {
  if (/\.html?$/i.test(filePath))
    return "text/html";
  if (/\.js$/i.test(filePath))
    return "text/javascript";
  if (/\.css$/i.test(filePath))
    return "text/css";
  if (/\.xml$/i.test(filePath))
    return "text/xml";
  return "text/plain";
}
function normalizeProjectFiles(files) {
  return files.map((file2) => ({
    path: normalizeRelativePath(file2?.path),
    mimeType: file2?.mimeType || mimeTypeForPath(file2?.path),
    title: file2?.title || path.basename(String(file2?.path ?? "")),
    content: String(file2?.content ?? ""),
    ...typeof file2?.note === "string" ? { note: file2.note } : {}
  })).filter((file2) => file2.path && !file2.path.startsWith("screenshots/"));
}
function safeProjectRelativePath(value, fallback) {
  const normalized = normalizeRelativePath(value || fallback);
  if (!normalized || normalized.includes("..")) {
    throw new Error("file_path must be project-relative");
  }
  return normalized;
}
function repairHTMLSnapshot(input) {
  const html = String(input ?? "");
  if (html.trim() === "")
    return html;
  const tagStart = html.lastIndexOf("<");
  if (tagStart < 0)
    return html;
  const tail = html.slice(tagStart);
  if (tail.includes(">"))
    return html;
  return /^<\s*\/?\s*[a-zA-Z][^>]*$/.test(tail) ? html.slice(0, tagStart) : html;
}
function optionalPositiveInteger(value, name) {
  if (value === undefined || value === null || value === "")
    return;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return number;
}
function safeProjectID(value) {
  const id = String(value ?? "").trim();
  return !id || id.includes("/") || id.includes("\\") || id.includes("..") ? "" : id;
}

// mcp/projectSync.ts
import { createHash } from "node:crypto";
import fs4 from "node:fs";
import path5 from "node:path";

// shared/assetPaths.ts
import path2 from "node:path";

// schema./assetPaths.ts
function isWindowsAssetPath(value) {
  return /^[a-z]:[\\/]/i.test(value);
}
function isAbsoluteAssetPath(value) {
  return !value.includes("\x00") && (isWindowsAssetPath(value) || value.startsWith("/") && !value.startsWith("//"));
}

// shared/assetPaths.ts
function assetPathApi(absolutePath) {
  return isWindowsAssetPath(absolutePath) ? path2.win32 : path2.posix;
}
function resolveAssetPath(filePath, baseDir) {
  return isAbsoluteAssetPath(filePath) ? filePath : assetPathApi(baseDir).resolve(baseDir, filePath);
}
var LEGACY_ASSET_SUBDIR = ".legacy-assets";
var LEGACY_ASSET_FILE_NAME = /^[0-9a-f]{16}(?:\.[a-z0-9]{1,8})?$/;

// shared/assetRefs.ts
var CSS_URL_ENTITY_QUOTE_SOURCE = "&quot;|&#0*39;|&#[xX]0*27;|&apos;";
var URL_OPEN_QUOTE = `(?:["']|${CSS_URL_ENTITY_QUOTE_SOURCE})?`;
var URL_VALUE = `(?:(?!${CSS_URL_ENTITY_QUOTE_SOURCE})[^"')])+`;
var HTML_RESOURCE_REGEX = new RegExp(`(?:(?:src|href)=["']|url\\(${URL_OPEN_QUOTE})(?!(?:https?:|data:|\\/\\/|%23))(${URL_VALUE})(?:["']?\\))?["']?`, "g");
var XML_SRC_REGEX = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')/g;
function isXmlFile(filePath) {
  return /\.xml$/i.test(filePath);
}
function extractLocalResourceRefs(content, filePath, baseDir = "/") {
  const resolvedFilePath = resolveAssetPath(filePath, baseDir);
  const dirPath = assetPathApi(resolvedFilePath).dirname(resolvedFilePath);
  let rawPaths;
  if (isXmlFile(filePath)) {
    rawPaths = [...content.matchAll(XML_SRC_REGEX)].map((m) => m[1] ?? m[2]).filter((p) => Boolean(p && isAbsoluteAssetPath(p)));
  } else {
    rawPaths = [...content.matchAll(HTML_RESOURCE_REGEX)].map((m) => m[1]).filter((p) => Boolean(p));
  }
  const refs = new Map;
  for (const raw of rawPaths) {
    const absolutePath = resolveAssetPath(fileURLPath(raw) ?? raw, dirPath);
    if (!refs.has(raw)) {
      refs.set(raw, { raw, absolutePath });
    }
  }
  return Array.from(refs.values());
}
function fileURLPath(raw) {
  const match = /^file:\/\/(?:localhost)?(\/[^?#]*)/i.exec(raw.trim());
  if (!match?.[1]) {
    return;
  }
  try {
    const pathname = decodeURIComponent(match[1]);
    return /^\/[a-z]:\//i.test(pathname) ? pathname.slice(1) : pathname;
  } catch {
    return;
  }
}
function resolveAssetRefsInContent(content, filePath, lookup, baseDir = "/") {
  const refs = extractLocalResourceRefs(content, filePath, baseDir);
  let updated = content;
  for (const ref of refs) {
    const url = lookup(ref.absolutePath);
    if (!url) {
      continue;
    }
    updated = isXmlFile(filePath) ? replaceXmlSrcPath(updated, ref.raw, url) : replaceHtmlResourcePath(updated, ref.raw, url);
  }
  return updated;
}
function replaceHtmlResourcePath(content, rawPath, url) {
  const escaped = escapeRegExp(rawPath);
  return content.replace(new RegExp(`(src|href)=(["'])${escaped}\\2`, "g"), (_match, attr) => `${attr}="${url}"`).replace(new RegExp(`url\\((${CSS_URL_ENTITY_QUOTE_SOURCE}|["']|)${escaped}\\1\\)`, "g"), (_match, quote) => `url(${quote}${url}${quote})`);
}
function replaceXmlSrcPath(content, rawPath, url) {
  const regex = new RegExp(`(\\bsrc\\s*=\\s*)(["'])${escapeRegExp(rawPath)}\\2`, "g");
  return content.replace(regex, `$1$2${url}$2`);
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function localFileRefKind(raw) {
  const value = raw.trim();
  if (!value || value.startsWith("#") || value.startsWith("%23") || value.startsWith("//")) {
    return;
  }
  if (isWindowsAssetPath(value) || value.startsWith("\\")) {
    return "absolute_path";
  }
  if (/^file:/i.test(value)) {
    return "file_url";
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
    return;
  }
  return isAbsoluteAssetPath(value) ? "absolute_path" : "relative_path";
}
function isLikelyLocalFileRef(raw) {
  return localFileRefKind(raw) !== undefined;
}
var SCRIPT_BODY_REGEX = /(<script\b[^>]*>)[\s\S]*?<\/script\s*>/gi;
var TAG_REGEX = /<([a-z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
var ATTRIBUTE_REGEX = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
var CSS_URL_REGEX = new RegExp(`\\burl\\(\\s*${URL_OPEN_QUOTE}(${URL_VALUE})(?:["']|${CSS_URL_ENTITY_QUOTE_SOURCE})?\\s*\\)`, "gi");
var NAVIGATION_TAGS = new Set(["a", "area"]);
function findLocalResourceReferences(content) {
  const markup = content.replace(SCRIPT_BODY_REGEX, "$1");
  const references = [];
  const add = (value, attribute) => {
    const kind = localFileRefKind(value);
    if (kind) {
      references.push({ value, kind, attribute });
    }
  };
  for (const [, tagName = "", attributes = ""] of markup.matchAll(TAG_REGEX)) {
    for (const [, name = "", doubleQuoted, singleQuoted] of attributes.matchAll(ATTRIBUTE_REGEX)) {
      const attribute = name.toLowerCase();
      const value = doubleQuoted ?? singleQuoted ?? "";
      if (attribute === "src") {
        add(value, "src");
      } else if ((attribute === "href" || attribute === "xlink:href") && !NAVIGATION_TAGS.has(tagName.toLowerCase())) {
        add(value, "href");
      }
    }
  }
  for (const [, value = ""] of markup.matchAll(CSS_URL_REGEX)) {
    add(value, "url");
  }
  return references;
}
var VIEW_STATE_ASSETS_KEY = "assets";
function assetMapFromViewState(viewState) {
  if (typeof viewState !== "object" || viewState === null || Array.isArray(viewState)) {
    return {};
  }
  const raw = viewState[VIEW_STATE_ASSETS_KEY];
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {};
  }
  const map = {};
  for (const [absolutePath, entry] of Object.entries(raw)) {
    if (!isAbsoluteAssetPath(absolutePath) || typeof entry !== "object" || entry === null) {
      continue;
    }
    const key = entry.key;
    const sha256 = entry.sha256;
    if (typeof key === "string" && key && typeof sha256 === "string" && sha256) {
      map[absolutePath] = { key, sha256 };
    }
  }
  return map;
}
function withAssetMap(project, additions) {
  if (Object.keys(additions).length === 0) {
    return project;
  }
  const viewState = { ...project.viewState ?? {} };
  viewState[VIEW_STATE_ASSETS_KEY] = { ...assetMapFromViewState(viewState), ...additions };
  return { ...project, viewState };
}

// mcp/assets.ts
import crypto3 from "node:crypto";
import fs3 from "node:fs";
import path4 from "node:path";

// shared/assetContentType.ts
var SVG_PROLOGUE = /^\s*(?:(?:<\?[\s\S]*?\?>|<!--[\s\S]*?-->|<!DOCTYPE[^>[]*(?:\[[\s\S]*?\])?\s*>)\s*)*<svg[\s>/]/i;
var SVG_SNIFF_BYTES = 16 * 1024;
var BMP_DIB_HEADER_SIZES = new Set([12, 40, 52, 56, 64, 108, 124]);
var PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
function slideAssetContentType(body) {
  const ascii = (start, end) => body.subarray(start, end).toString("latin1");
  if (body.length >= 8 && body.subarray(0, 8).equals(PNG_SIGNATURE))
    return "image/png";
  if (body.length >= 3 && body[0] === 255 && body[1] === 216 && body[2] === 255)
    return "image/jpeg";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP")
    return "image/webp";
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a")
    return "image/gif";
  if (ascii(0, 2) === "BM" && body.length >= 18 && BMP_DIB_HEADER_SIZES.has(body.readUInt32LE(14)))
    return "image/bmp";
  if (ascii(0, 4) === "II*\x00" || ascii(0, 4) === "MM\x00*")
    return "image/tiff";
  if (body.length >= 6 && body.readUInt32BE(0) === 256 && body.readUInt16LE(4) > 0)
    return "image/x-icon";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12)))
    return "image/avif";
  if (body.length >= 12 && body.readUInt32BE(8) === body.length) {
    if (ascii(0, 4) === "wOFF")
      return "font/woff";
    if (ascii(0, 4) === "wOF2")
      return "font/woff2";
  }
  if (body.length >= 12) {
    const tableCount = body.readUInt16BE(4);
    if (body.readUInt32BE(0) === 65536 && tableCount > 0 && tableCount < 64)
      return "font/ttf";
    if (ascii(0, 4) === "OTTO" && tableCount > 0 && tableCount < 64)
      return "font/otf";
    if (ascii(0, 4) === "ttcf" && [65536, 131072].includes(body.readUInt32BE(4)))
      return "font/collection";
  }
  if (SVG_PROLOGUE.test(body.subarray(0, SVG_SNIFF_BYTES).toString("utf8").replace(/^\uFEFF/, ""))) {
    return "image/svg+xml";
  }
  return;
}

// mcp/workspaceFiles.ts
import fs2 from "node:fs";
import path3 from "node:path";
var OUTSIDE_WORKSPACE = Symbol("outside_workspace");
function isInside(root, candidate) {
  const relative = path3.relative(root, candidate);
  return Boolean(relative) && !path3.isAbsolute(relative) && relative.split(path3.sep).every((segment) => segment !== "" && !segment.startsWith("."));
}
function workspaceFilePath(workspaceRoot, filePath) {
  if (!path3.isAbsolute(filePath) || !path3.isAbsolute(workspaceRoot))
    return OUTSIDE_WORKSPACE;
  const root = path3.resolve(workspaceRoot);
  const candidate = path3.resolve(filePath);
  if (!isInside(root, candidate))
    return OUTSIDE_WORKSPACE;
  let realPath;
  try {
    realPath = fs2.realpathSync.native(candidate);
  } catch {
    return;
  }
  try {
    return isInside(fs2.realpathSync.native(root), realPath) ? realPath : OUTSIDE_WORKSPACE;
  } catch {
    return OUTSIDE_WORKSPACE;
  }
}

// mcp/assets.ts
function workspaceAssetReader(workspaceRoot) {
  return (absolutePath) => {
    const realPath = workspaceFilePath(workspaceRoot, absolutePath);
    if (realPath === OUTSIDE_WORKSPACE)
      return OUTSIDE_WORKSPACE;
    if (typeof realPath !== "string")
      return;
    try {
      return fs3.statSync(realPath).isFile() ? fs3.readFileSync(realPath) : undefined;
    } catch {
      return;
    }
  };
}
function collectPendingAssets(project, readFile, include) {
  const known = assetMapFromViewState(project.viewState);
  const projectFilePaths = new Set(project.files.map((file2) => resolveAssetPath(file2.path, project.projectDir || "/")));
  const pendingByPath = new Map;
  const missing = new Set;
  const outsideWorkspace = new Set;
  const unsupported = new Set;
  for (const file2 of project.files) {
    if (!file2.content) {
      continue;
    }
    const refs = extractLocalResourceRefs(file2.content, file2.path, project.projectDir || "/");
    for (const ref of refs) {
      if (!isLikelyLocalFileRef(ref.raw)) {
        continue;
      }
      if (known[ref.absolutePath] || projectFilePaths.has(ref.absolutePath)) {
        continue;
      }
      if (include && !include(ref.absolutePath)) {
        continue;
      }
      if (pendingByPath.has(ref.absolutePath) || missing.has(ref.absolutePath) || outsideWorkspace.has(ref.absolutePath) || unsupported.has(ref.absolutePath)) {
        continue;
      }
      const body = readFile(ref.absolutePath);
      if (body === OUTSIDE_WORKSPACE) {
        outsideWorkspace.add(ref.absolutePath);
        continue;
      }
      if (!body) {
        missing.add(ref.absolutePath);
        continue;
      }
      if (!slideAssetContentType(body)) {
        unsupported.add(ref.absolutePath);
        continue;
      }
      pendingByPath.set(ref.absolutePath, {
        absolutePath: ref.absolutePath,
        contentBase64: body.toString("base64")
      });
    }
  }
  return {
    pending: Array.from(pendingByPath.values()),
    missing: Array.from(missing),
    outsideWorkspace: Array.from(outsideWorkspace),
    unsupported: Array.from(unsupported)
  };
}
var UPLOAD_BATCH_BASE64_LIMIT = 24 * 1024 * 1024;
function batchPendingAssets(pending) {
  const batches = [];
  let current = [];
  let currentSize = 0;
  for (const asset of pending) {
    if (current.length > 0 && currentSize + asset.contentBase64.length > UPLOAD_BATCH_BASE64_LIMIT) {
      batches.push(current);
      current = [];
      currentSize = 0;
    }
    current.push(asset);
    currentSize += asset.contentBase64.length;
  }
  if (current.length > 0) {
    batches.push(current);
  }
  return batches;
}
async function syncProjectAssets(project, client, resourceKey, readFile, include) {
  const { pending, missing, outsideWorkspace, unsupported } = collectPendingAssets(project, readFile, include);
  if (pending.length === 0) {
    return { project, uploaded: [], missing, outsideWorkspace, unsupported };
  }
  const additions = {};
  for (const batch of batchPendingAssets(pending)) {
    const response = await client.uploadAssets(resourceKey, project.id, batch.map((asset) => ({ path: asset.absolutePath, contentBase64: asset.contentBase64 })));
    const returned = Array.isArray(response?.assets) ? response.assets : [];
    for (const entry of returned) {
      const absolutePath = String(entry?.path ?? "");
      const key = String(entry?.key ?? "");
      const sha256 = String(entry?.sha256 ?? "");
      if (isAbsoluteAssetPath(absolutePath) && key && sha256) {
        additions[absolutePath] = { key, sha256 };
      }
    }
  }
  project.viewState = withAssetMap(project, additions).viewState;
  return {
    project,
    uploaded: Object.keys(additions),
    missing,
    outsideWorkspace,
    unsupported
  };
}
function outsideWorkspaceIssue(outsideWorkspace, projectDir) {
  return `The slide references files outside the workspace or in hidden directories: ${outsideWorkspace.join(", ")}. ` + `Slides only uploads files inside the workspace, so these images will appear broken. ` + `Copy each file into "${projectDir}" (for example its images/ folder), reference the copy, and edit the slide again.`;
}
var INLINE_ONLY_ASSET = /\.(?:[cm]?js|css)$/i;
function unsupportedAssetIssue(unsupported) {
  const inlineOnly = unsupported.filter((file2) => INLINE_ONLY_ASSET.test(file2));
  const others = unsupported.filter((file2) => !INLINE_ONLY_ASSET.test(file2));
  const parts = [];
  if (inlineOnly.length > 0) {
    parts.push(`Slides does not upload local scripts or stylesheets: ${inlineOnly.join(", ")}. ` + "Inline their code into a <script> or <style> element in the slide, or load the library from the approved CDN list.");
  }
  if (others.length > 0) {
    parts.push(`These referenced files are not images, SVG or fonts, so Slides does not upload them: ${others.join(", ")}. ` + "Convert them to a supported image format or remove the references.");
  }
  return parts.join(" ");
}
function exportLoadedReferencePaths(pages, baseDir) {
  const paths = new Set;
  for (const { fileName, content } of pages) {
    const pathByRaw = new Map(extractLocalResourceRefs(content, fileName, baseDir).map((ref) => [ref.raw, ref.absolutePath]));
    for (const reference of findLocalResourceReferences(content)) {
      const absolutePath = pathByRaw.get(reference.value);
      if (absolutePath)
        paths.add(absolutePath);
    }
  }
  return paths;
}
function exportBlockingUnsupportedIssue(unsupported, page, baseDir) {
  if (unsupported.length === 0)
    return;
  const loaded = exportLoadedReferencePaths([page], baseDir);
  const blocking = unsupported.filter((file2) => loaded.has(file2));
  if (blocking.length === 0)
    return;
  return `${unsupportedAssetIssue(blocking)} Until then slides/present rejects the deck, because PPTX/PDF export would load these files.`;
}
var BACKFILL_FETCH_TIMEOUT_MS = 30000;
var BACKFILL_CONCURRENCY = 5;
async function backfillProjectAssets(assets, assetUrls, fetchImpl = fetch) {
  const result = { restored: [], skipped: [], failed: [] };
  const entries = Object.entries(assets);
  let next = 0;
  const workers = Array.from({ length: Math.min(BACKFILL_CONCURRENCY, entries.length) }, async () => {
    while (next < entries.length) {
      const [absolutePath, entry] = entries[next];
      next += 1;
      await backfillOneAsset(absolutePath, entry.sha256, assetUrls?.[absolutePath], fetchImpl, result);
    }
  });
  await Promise.all(workers);
  return result;
}
async function backfillOneAsset(absolutePath, expectedSha256, url, fetchImpl, result) {
  if (!isSafeAssetRestorePath(absolutePath)) {
    warnBackfill(absolutePath, "refusing foreign, non-absolute, traversal, hidden, or device path");
    result.failed.push(absolutePath);
    return;
  }
  if (fileMatchesSha256(absolutePath, expectedSha256)) {
    result.skipped.push(absolutePath);
    return;
  }
  if (!url) {
    warnBackfill(absolutePath, "no download url in payload");
    result.failed.push(absolutePath);
    return;
  }
  try {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(BACKFILL_FETCH_TIMEOUT_MS) });
    if (!response.ok) {
      throw new Error(`http ${response.status}`);
    }
    const body = Buffer.from(await response.arrayBuffer());
    const sha256 = sha256Hex(body);
    if (sha256 !== expectedSha256) {
      throw new Error(`checksum mismatch (expected ${expectedSha256}, got ${sha256})`);
    }
    fs3.mkdirSync(path4.dirname(absolutePath), { recursive: true });
    fs3.writeFileSync(absolutePath, body);
    result.restored.push(absolutePath);
  } catch (error) {
    warnBackfill(absolutePath, error instanceof Error ? error.message : String(error));
    result.failed.push(absolutePath);
  }
}
function isSafeAssetRestorePath(value, platform = process.platform) {
  if (!isAbsoluteAssetPath(value))
    return false;
  const windows = isWindowsAssetPath(value);
  if (windows !== (platform === "win32"))
    return false;
  const segments = windows ? value.slice(3).split(/[\\/]/) : value.split("/");
  if (segments.some((segment, index) => segment.startsWith(".") && !isLegacyAssetSegment(segments, index)))
    return false;
  return !windows || segments.every((segment) => !(/[<>:"|?*\u0000-\u001f]/.test(segment) || /[. ]$/.test(segment) || /^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(segment)));
}
function isLegacyAssetSegment(segments, index) {
  return segments[index] === LEGACY_ASSET_SUBDIR && index === segments.length - 2 && LEGACY_ASSET_FILE_NAME.test(segments[index + 1] ?? "");
}
function assetUrlsFromPayload(value, rebaseEndpoint) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return;
  }
  const urls = {};
  for (const [assetPath, url] of Object.entries(value)) {
    if (typeof url !== "string" || !url) {
      continue;
    }
    urls[assetPath] = rebaseEndpoint ? rebaseAssetURL(url, rebaseEndpoint) : url;
  }
  return Object.keys(urls).length > 0 ? urls : undefined;
}
var ASSET_TICKET_PATH = "/api/v1/resource-assets/";
function rebaseAssetURL(url, endpoint) {
  const index = url.indexOf(ASSET_TICKET_PATH);
  if (index < 0) {
    return url;
  }
  return `${endpoint.replace(/\/$/, "")}${url.slice(index)}`;
}
function sha256Hex(body) {
  return crypto3.createHash("sha256").update(body).digest("hex");
}
function fileMatchesSha256(absolutePath, sha256) {
  try {
    if (!fs3.existsSync(absolutePath) || !fs3.statSync(absolutePath).isFile()) {
      return false;
    }
    return sha256Hex(fs3.readFileSync(absolutePath)) === sha256;
  } catch {
    return false;
  }
}
function warnBackfill(absolutePath, reason) {
  console.error(`[slides] asset backfill failed for ${absolutePath}: ${reason}`);
}

// mcp/projectSync.ts
var cursorFileName = ".manus-slides-cursor.json";
var pullBackfillBudgetMs = 20000;
var pullReadBudgetMs = 5000;
function pullBackfillBudgetElapsed() {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, pullBackfillBudgetMs);
    timer.unref?.();
  });
}
function rejectAfter(ms, message) {
  return new Promise((_resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    timer.unref?.();
  });
}

class ProjectSync {
  stopped = false;
  acquireBackgroundLease;
  store;
  client;
  projectQueues = new Map;
  assetBackfills = new Set;
  backfilledVersions = new Map;
  pullReadTimeoutMs;
  constructor(options) {
    this.acquireBackgroundLease = options.acquireBackgroundLease ?? (() => () => {});
    this.store = options.store;
    this.client = options.client;
    this.pullReadTimeoutMs = options.pullReadTimeoutMs ?? pullReadBudgetMs;
  }
  async register(project) {
    const payload = await this.client.createProject(RESOURCE_KEY, projectConfig(project), undefined);
    project.resourceUri = withoutURIVersionParam(payload.resource_uri ?? payload.resource?.resourceUri ?? resourceURI(project.id, project.title));
    project.widgetUri = withoutURIVersionParam(payload.widget_uri ?? payload.resource?.viewer?.widgetUri ?? widgetURI(project.id, project.title));
    project.versionId = versionIDFromPayload(payload);
    project.coverImageUrl = payload.resource?.coverImage?.url ?? payload.resource?.coverImageUrl;
    project.updatedAt = new Date().toISOString();
    this.persistRemoteWrite(project, project.versionId, payload);
    return payload;
  }
  async push(project, source = "runtime_mcp") {
    const payload = await this.client.upsertProject(RESOURCE_KEY, projectConfig(project), undefined, source);
    const versionId = versionIDFromPayload(payload);
    project.versionId = versionId ?? project.versionId;
    project.coverImageUrl = payload?.resource?.coverImage?.url ?? payload?.resource?.coverImageUrl ?? project.coverImageUrl;
    project.updatedAt = new Date().toISOString();
    this.persistRemoteWrite(project, versionId, payload);
    return payload;
  }
  pushEdit(projectID, applyEdit, source = "runtime_mcp") {
    return this.runExclusive(projectID, async () => {
      const latest = this.store.resolveProject({ project_id: projectID });
      if (!latest)
        throw new Error(`Slides project ${projectID} is no longer available in this runtime.`);
      const next = applyEdit(latest);
      if (!next)
        return false;
      await this.push(next, source);
      return true;
    });
  }
  async submitVersion(project, file2, coverImage) {
    const payload = await this.client.submitProjectVersion(RESOURCE_KEY, project.id, file2, coverImage);
    project.versionId = versionIDFromPayload(payload) ?? project.versionId;
    project.coverImageUrl = payload?.resource?.coverImage?.url ?? payload?.resource?.coverImageUrl ?? project.coverImageUrl;
    this.persistRemoteWrite(project, versionIDFromPayload(payload), payload);
    return payload;
  }
  readRemote(projectID) {
    return this.client.readProject(RESOURCE_KEY, projectID);
  }
  seedFromAttach(project, versionId) {
    this.recordAppliedVersion(project, versionId, project);
  }
  async ensureSynchronized(project) {
    if (this.stopped)
      throw new Error("slides_sync_stopped");
    await this.pullRemoteHead(project);
  }
  async pullRemoteHead(project, options = {}) {
    return this.runExclusive(project.id, async () => {
      const projectDir = this.store.projectDirectory(project.id);
      const cursorBeforeRead = this.readCursor(projectDir);
      const payload = options.withinHostHook ? await this.readRemoteWithinBudget(project.id) : await this.readRemote(project.id);
      const sourceProject = payload?.renderData?.project;
      if (!sourceProject?.id || String(sourceProject.id) !== project.id || !Array.isArray(sourceProject.files)) {
        throw new Error("Addon Server did not return a materializable Slides project");
      }
      const versionId = versionIDFromPayload(payload) ?? "";
      const cursor = this.readCursor(projectDir);
      const fingerprint = contentFingerprint(sourceProject);
      const staleRead = cursor.lastAppliedVersionId !== cursorBeforeRead.lastAppliedVersionId;
      const alreadyApplied = Boolean(versionId) && versionId === cursor.lastAppliedVersionId;
      const sameContent = Boolean(cursor.contentFingerprint) && cursor.contentFingerprint === fingerprint;
      const applied = !staleRead && !alreadyApplied && !sameContent;
      const pendingUserEdit = applied ? this.applyRemoteContent(project.id, sourceProject, versionId, cursor.pendingUserEdit) : cursor.pendingUserEdit;
      if (!staleRead && versionId && (applied || sameContent)) {
        this.writeCursor(projectDir, {
          ...cursor,
          lastAppliedVersionId: versionId,
          contentFingerprint: fingerprint,
          pendingUserEdit
        });
      } else if (applied) {
        this.writeCursor(projectDir, { ...cursor, pendingUserEdit });
      }
      const backfillKey = versionId || fingerprint;
      if (applied || this.backfilledVersions.get(project.id) !== backfillKey) {
        this.backfilledVersions.set(project.id, backfillKey);
        const backfill = this.backfillAssets(sourceProject, payload);
        if (applied && !options.withinHostHook)
          await Promise.race([backfill, pullBackfillBudgetElapsed()]);
      }
      return { versionId, applied };
    });
  }
  async takePendingUserEdit(project, invocationId) {
    return this.runExclusive(project.id, async () => {
      const projectDir = this.store.projectDirectory(project.id);
      const cursor = this.readCursor(projectDir);
      if (invocationId && cursor.lastUserEditDelivery?.invocationId === invocationId) {
        return cursor.lastUserEditDelivery.edit;
      }
      if (!cursor.pendingUserEdit)
        return;
      this.writeCursor(projectDir, {
        ...cursor,
        pendingUserEdit: undefined,
        lastUserEditDelivery: invocationId ? { invocationId, edit: cursor.pendingUserEdit } : undefined
      });
      return cursor.pendingUserEdit;
    });
  }
  readRemoteWithinBudget(projectID) {
    const read = this.readRemote(projectID);
    read.catch(() => {
      return;
    });
    return Promise.race([read, rejectAfter(this.pullReadTimeoutMs, "pull_timeout: reading the deck head took too long")]);
  }
  applyRemoteContent(projectID, sourceProject, versionId, previous) {
    const before = this.store.resolveProject({ project_id: projectID });
    const beforeContents = new Map((before?.files ?? []).map((file2) => [file2.path, file2.content]));
    const beforeOrder = before ? slideIdsOfProject(before) : [];
    this.store.applyRemoteProject(projectID, sourceProject, versionId);
    const after = this.store.resolveProject({ project_id: projectID });
    if (!after)
      return previous;
    return mergePendingUserEdit(previous, diffProjectContent(beforeContents, beforeOrder, after.files, slideIdsOfProject(after)));
  }
  backfillAssets(sourceProject, payload) {
    const backfill = backfillProjectAssets(assetMapFromViewState(sourceProject.viewState), assetUrlsFromPayload(payload?.assetUrls, this.client.endpoint)).then((result) => {
      if (result.failed.length > 0) {
        this.trackBackground(this.client.reportRuntimeFailure("asset_backfill_failed", `failed=${result.failed.length}`).catch(() => {
          return;
        }));
      }
      return result;
    }).catch(() => {
      return;
    });
    this.trackBackfill(backfill);
    return backfill;
  }
  async runExclusive(projectID, task) {
    const release = this.acquireBackgroundLease();
    const previous = this.projectQueues.get(projectID) ?? Promise.resolve();
    const current = previous.catch(() => {
      return;
    }).then(task);
    this.projectQueues.set(projectID, current);
    try {
      return await current;
    } finally {
      release();
      if (this.projectQueues.get(projectID) === current) {
        this.projectQueues.delete(projectID);
      }
    }
  }
  async reconcileOnStartup() {
    for (const project of this.store.listPersistedProjects()) {
      this.store.cache(project);
    }
  }
  stop() {
    this.stopped = true;
  }
  trackBackground(work) {
    const release = this.acquireBackgroundLease();
    return work.finally(release);
  }
  trackBackfill(backfill) {
    const tracked = this.trackBackground(backfill).catch(() => {
      return;
    }).finally(() => this.assetBackfills.delete(tracked));
    this.assetBackfills.add(tracked);
  }
  async settleAssetBackfills() {
    while (this.assetBackfills.size > 0) {
      await Promise.all([...this.assetBackfills]);
    }
  }
  persistRemoteWrite(project, versionId, payload) {
    this.store.cache(project);
    try {
      this.store.writeProjectConfig(project);
    } catch (error) {
      console.warn("Slides project config persistence failed after a successful remote write:", error);
      return;
    }
    this.recordAppliedVersion(project, versionId, payload?.renderData?.project ?? projectConfig(project));
  }
  recordAppliedVersion(project, versionId, content) {
    if (!versionId)
      return;
    const cursor = this.readCursor(project.projectDir);
    cursor.lastAppliedVersionId = versionId;
    cursor.contentFingerprint = contentFingerprint(content);
    this.writeCursor(project.projectDir, cursor);
  }
  readCursor(projectDir) {
    try {
      const parsed = JSON.parse(fs4.readFileSync(path5.join(projectDir, cursorFileName), "utf8"));
      return {
        version: 1,
        lastAppliedVersionId: typeof parsed?.lastAppliedVersionId === "string" ? parsed.lastAppliedVersionId : "",
        ...typeof parsed?.contentFingerprint === "string" ? { contentFingerprint: parsed.contentFingerprint } : {},
        pendingUserEdit: parsePendingUserEdit(parsed?.pendingUserEdit),
        lastUserEditDelivery: parseUserEditDelivery(parsed?.lastUserEditDelivery)
      };
    } catch {
      return { version: 1, lastAppliedVersionId: "" };
    }
  }
  writeCursor(projectDir, cursor) {
    try {
      fs4.mkdirSync(projectDir, { recursive: true });
      const target = path5.join(projectDir, cursorFileName);
      const temporary = `${target}.${process.pid}.${Date.now()}.tmp`;
      fs4.writeFileSync(temporary, `${JSON.stringify({
        version: 1,
        lastAppliedVersionId: cursor.lastAppliedVersionId ?? "",
        ...cursor.contentFingerprint ? { contentFingerprint: cursor.contentFingerprint } : {},
        ...cursor.pendingUserEdit ? { pendingUserEdit: cursor.pendingUserEdit } : {},
        ...cursor.lastUserEditDelivery ? { lastUserEditDelivery: cursor.lastUserEditDelivery } : {}
      }, null, 2)}
`, "utf8");
      fs4.renameSync(temporary, target);
    } catch {}
  }
}
function contentFingerprint(project) {
  const viewState = project?.viewState ?? {};
  const files = normalizeProjectFiles(Array.isArray(project?.files) ? project.files : []).map((file2) => [file2.path, sha256(file2.content), file2.note ?? ""]).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
  const outline = (Array.isArray(viewState.outline) ? viewState.outline : []).map((entry) => [
    String(entry?.id ?? ""),
    String(entry?.title ?? ""),
    String(entry?.summary ?? "")
  ]);
  const slideIds = Array.isArray(viewState.slide_ids) ? viewState.slide_ids.map(String) : [];
  return sha256(JSON.stringify({ title: String(project?.title ?? ""), files, slideIds, outline }));
}
function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}
function parseUserEditDelivery(value) {
  const edit = parsePendingUserEdit(value?.edit);
  return typeof value?.invocationId === "string" && value.invocationId && edit ? { invocationId: value.invocationId, edit } : undefined;
}
function parsePendingUserEdit(value) {
  if (!value || typeof value !== "object")
    return;
  const strings = (list) => Array.isArray(list) ? list.filter((item) => typeof item === "string") : [];
  const edit = {
    changedFiles: strings(value.changedFiles),
    deletedFiles: strings(value.deletedFiles),
    orderChanged: value.orderChanged === true
  };
  return isEmptyPendingUserEdit(edit) ? undefined : edit;
}
function isEmptyPendingUserEdit(edit) {
  return edit.changedFiles.length === 0 && edit.deletedFiles.length === 0 && !edit.orderChanged;
}
function diffProjectContent(beforeContents, beforeOrder, afterFiles, afterOrder) {
  const changedFiles = [];
  const afterPaths = new Set;
  for (const file2 of afterFiles) {
    afterPaths.add(file2.path);
    if (beforeContents.get(file2.path) !== file2.content)
      changedFiles.push(file2.path);
  }
  const deletedFiles = [...beforeContents.keys()].filter((filePath) => !afterPaths.has(filePath));
  const orderChanged = beforeOrder.length !== afterOrder.length || beforeOrder.some((id, index) => id !== afterOrder[index]);
  return { changedFiles, deletedFiles, orderChanged };
}
function mergePendingUserEdit(previous, next) {
  const changed = new Set(previous?.changedFiles ?? []);
  const deleted = new Set(previous?.deletedFiles ?? []);
  for (const filePath of next.changedFiles) {
    deleted.delete(filePath);
    changed.add(filePath);
  }
  for (const filePath of next.deletedFiles) {
    changed.delete(filePath);
    deleted.add(filePath);
  }
  const merged = {
    changedFiles: [...changed],
    deletedFiles: [...deleted],
    orderChanged: (previous?.orderChanged ?? false) || next.orderChanged
  };
  return isEmptyPendingUserEdit(merged) ? undefined : merged;
}

// mcp/runtimePool.ts
import os from "node:os";
import path6 from "node:path";
function slidesProjectRoot(params, mode) {
  if (mode === "runtime") {
    return path6.resolve(process.env.MANUS_SLIDES_PROJECT_ROOT ?? path6.join(os.homedir(), "manus-slides"));
  }
  const workingDirectory = addonInvocationContextFromToolCall(params)?.workingDirectory;
  if (!workingDirectory || !path6.isAbsolute(workingDirectory))
    throw new Error("working_directory_unavailable");
  return path6.join(workingDirectory, "manus-slides");
}

class SlidesRuntimePool {
  create;
  limit;
  entries = new Map;
  stopped = false;
  constructor(create, limit = 8) {
    this.create = create;
    this.limit = limit;
    if (!Number.isInteger(limit) || limit < 1)
      throw new Error("invalid runtime pool limit");
  }
  acquire(root) {
    if (this.stopped)
      throw new Error("slides_runtime_stopped");
    const key = path6.resolve(root);
    let entry = this.entries.get(key);
    if (!entry) {
      if (this.entries.size >= this.limit) {
        const idle = [...this.entries].find(([, candidate]) => candidate.users === 0);
        if (!idle)
          throw new Error("slides_runtime_capacity_exceeded");
        idle[1].value.projectSync.stop();
        this.entries.delete(idle[0]);
      }
      entry = { value: this.create(key), users: 0 };
      this.entries.set(key, entry);
    }
    entry.users += 1;
    let released = false;
    return {
      value: entry.value,
      release: () => {
        if (released)
          return;
        released = true;
        entry.users -= 1;
        if (!this.stopped && this.entries.get(key) === entry) {
          this.entries.delete(key);
          this.entries.set(key, entry);
        }
      }
    };
  }
  stop() {
    this.stopped = true;
    for (const { value } of this.entries.values())
      value.projectSync.stop();
    this.entries.clear();
  }
}

// mcp/screenshot.ts
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os2 from "node:os";
import path8 from "node:path";
import { pathToFileURL } from "node:url";

// mcp/browserWorkerHost.ts
import { createHash as createHash2, randomUUID } from "node:crypto";
import net from "node:net";
import path7 from "node:path";
var maxResponseBytes = 2 * 1024 * 1024;
function requiredEnvironment(name) {
  return String(process.env[name] ?? "").trim();
}
function browserWorkerBinding() {
  const invocation = currentBrowserWorkerInvocation();
  const endpoint = requiredEnvironment("MANUS_ADDON_BROWSER_HOST_ENDPOINT");
  const token = requiredEnvironment("MANUS_ADDON_BROWSER_HOST_TOKEN");
  const addonId = requiredEnvironment("MANUS_ADDON_ID");
  const revision = requiredEnvironment("MANUS_ADDON_REVISION");
  const packageRoot = requiredEnvironment("MANUS_ADDON_PACKAGE_ROOT");
  let workers;
  try {
    workers = JSON.parse(requiredEnvironment("MANUS_ADDON_BROWSER_WORKERS"));
  } catch {
    workers = [];
  }
  if (!invocation || !endpoint || !token || !addonId || !revision || !packageRoot || !Array.isArray(workers) || !workers.includes("slides-renderer")) {
    return;
  }
  const workingDirectory = path7.resolve(invocation.workingDirectory);
  return {
    endpoint,
    token,
    packageRoot,
    workingDirectory,
    identity: {
      addonId,
      revision,
      worker: "slides-renderer",
      sessionId: invocation.sessionId,
      rootId: createHash2("sha256").update(workingDirectory).digest("hex")
    }
  };
}
async function callBrowserWorker(binding, method, params) {
  return new Promise((resolve, reject) => {
    const requestId = randomUUID();
    const socket = net.createConnection(binding.endpoint);
    const cleanup = method === "browser_worker.cancel" || method === "browser_worker.close";
    const timer = setTimeout(() => {
      socket.destroy(new Error("browser worker request timed out"));
    }, cleanup ? 5000 : 30000);
    timer.unref();
    socket.once("close", () => clearTimeout(timer));
    let response = "";
    let settled = false;
    socket.setEncoding("utf8");
    socket.once("error", reject);
    const finish = (line) => {
      if (settled)
        return;
      settled = true;
      socket.destroy();
      try {
        const message = JSON.parse(line);
        if (message.id !== requestId) {
          reject(new Error("browser worker response ID mismatch"));
          return;
        }
        if (message.error) {
          reject(new Error(String(message.error.message ?? "browser worker failed")));
          return;
        }
        resolve(message.result);
      } catch (error) {
        reject(error);
      }
    };
    socket.on("data", (chunk) => {
      if (settled)
        return;
      response += chunk;
      if (Buffer.byteLength(response) > maxResponseBytes) {
        settled = true;
        socket.destroy();
        reject(new Error("browser worker response is too large"));
        return;
      }
      const newline = response.indexOf(`
`);
      if (newline !== -1)
        finish(response.slice(0, newline));
    });
    socket.once("end", () => finish(response));
    socket.once("close", () => {
      if (!settled)
        reject(new Error("browser worker connection closed before response"));
    });
    socket.once("connect", () => {
      socket.write(`${JSON.stringify({
        id: requestId,
        authorization: binding.token,
        method,
        identity: binding.identity,
        params
      })}
`);
    });
  });
}
function browserWorkerHostAvailable() {
  return browserWorkerBinding() !== undefined;
}
async function runSlidesBrowserWorkerJob(options) {
  const binding = browserWorkerBinding();
  if (!binding)
    throw new Error("slides browser worker host is unavailable");
  const started = await callBrowserWorker(binding, "browser_worker.start", {
    packageRoot: binding.packageRoot,
    workspaceRoot: binding.workingDirectory,
    width: options.width,
    height: options.height
  });
  const handle = String(started?.handle ?? "");
  if (!handle)
    throw new Error("slides browser worker returned no handle");
  try {
    const result = await callBrowserWorker(binding, "browser_worker.message", {
      handle,
      payload: options.payload
    });
    const capture = options.capture ? await callBrowserWorker(binding, "browser_worker.capture", {
      handle,
      ...options.capturePath ? { outputPath: options.capturePath } : {}
    }) : undefined;
    return { result, capture };
  } catch (error) {
    await callBrowserWorker(binding, "browser_worker.cancel", { handle }).catch(() => {
      return;
    });
    throw error;
  } finally {
    await callBrowserWorker(binding, "browser_worker.close", { handle }).catch(() => {
      return;
    });
  }
}

// mcp/screenshot.ts
var screenshotMaxViewportWidth = 2400;
var screenshotMaxViewportHeight = 2000;
var screenshotMaxCaptureHeight = 12000;
async function captureHTMLScreenshot(request) {
  if (browserWorkerHostAvailable()) {
    return captureHTMLScreenshotWithBrowserWorker(request);
  }
  const chrome = await launchChrome();
  const cdp = new CDPClient(chrome.wsURL);
  try {
    await cdp.open();
    const target = await cdp.send("Target.createTarget", { url: "about:blank" });
    const attached = await cdp.send("Target.attachToTarget", {
      targetId: target.targetId,
      flatten: true
    });
    const sessionId = String(attached.sessionId);
    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    let viewportWidth = clampInteger(request.width, 1440, 320, screenshotMaxViewportWidth);
    let viewportHeight = clampInteger(request.height, 900, 240, screenshotMaxViewportHeight);
    await setViewport(cdp, sessionId, viewportWidth, viewportHeight);
    const targetURL = pathToFileURL(request.htmlPath);
    if (request.slideNumber) {
      targetURL.hash = String(request.slideNumber);
    }
    const loadEvent = cdp.waitForEvent("Page.loadEventFired", sessionId, 12000);
    await cdp.send("Page.navigate", { url: targetURL.href }, sessionId);
    await loadEvent.catch(() => {
      console.error(`[slides] MEASURE_LOAD_TIMEOUT=1 stage=screenshot path=${JSON.stringify(request.htmlPath)}`);
    });
    const delayMs = clampInteger(request.delayMs, 500, 0, 5000);
    if (delayMs > 0) {
      await sleep(delayMs);
    }
    let deck = request.slideNumber ? await prepareDeckSlide(cdp, sessionId, request.slideNumber) : undefined;
    if (deck?.designWidth && deck?.designHeight && (deck.designWidth !== viewportWidth || deck.designHeight !== viewportHeight)) {
      viewportWidth = clampInteger(deck.designWidth, viewportWidth, 320, screenshotMaxViewportWidth);
      viewportHeight = clampInteger(deck.designHeight, viewportHeight, 240, screenshotMaxViewportHeight);
      await setViewport(cdp, sessionId, viewportWidth, viewportHeight);
      deck = await prepareDeckSlide(cdp, sessionId, request.slideNumber);
    }
    const metrics = await cdp.send("Page.getLayoutMetrics", {}, sessionId);
    const contentSize = metrics.cssContentSize ?? metrics.contentSize ?? {};
    const documentWidth = Math.max(viewportWidth, Math.ceil(Number(contentSize.width) || viewportWidth));
    const documentHeight = Math.max(viewportHeight, Math.ceil(Number(contentSize.height) || viewportHeight));
    const fullPage = request.fullPage !== false;
    const captureHeight = fullPage ? Math.min(documentHeight, screenshotMaxCaptureHeight) : viewportHeight;
    const captureWidth = fullPage ? documentWidth : viewportWidth;
    const screenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: 0,
        width: captureWidth,
        height: captureHeight,
        scale: 1
      }
    }, sessionId);
    await mkdir(request.screenshotDir, { recursive: true });
    const screenshotPath = path8.join(request.screenshotDir, `${safeScreenshotName(path8.basename(request.htmlPath, path8.extname(request.htmlPath)))}-${timestampForFilename()}.png`);
    await writeFile(screenshotPath, Buffer.from(String(screenshot.data), "base64"));
    return {
      htmlPath: request.htmlPath,
      screenshotPath,
      imageBase64: String(screenshot.data),
      viewport: { width: viewportWidth, height: viewportHeight },
      document: { width: documentWidth, height: documentHeight },
      capture: { width: captureWidth, height: captureHeight },
      truncated: fullPage && documentHeight > screenshotMaxCaptureHeight,
      deck
    };
  } finally {
    await cdp.close().catch(() => {
      return;
    });
    await chrome.close();
  }
}
async function captureHTMLScreenshotWithBrowserWorker(request) {
  let width = clampInteger(request.width, 1440, 320, screenshotMaxViewportWidth);
  let height = clampInteger(request.height, 900, 240, screenshotMaxViewportHeight);
  await mkdir(request.screenshotDir, { recursive: true });
  const screenshotPath = path8.join(request.screenshotDir, `${safeScreenshotName(path8.basename(request.htmlPath, path8.extname(request.htmlPath)))}-${timestampForFilename()}.png`);
  const execute = (capture) => runSlidesBrowserWorkerJob({
    width,
    height,
    capture,
    capturePath: screenshotPath,
    payload: {
      htmlURL: pathToFileURL(request.htmlPath).href,
      width,
      height,
      fullPage: request.fullPage !== false,
      delayMs: clampInteger(request.delayMs, 500, 0, 5000),
      ...request.slideNumber ? { slideNumber: request.slideNumber } : {}
    }
  });
  let run = await execute(false);
  let prepared = run.result;
  if (prepared.capture.width !== width || prepared.capture.height !== height) {
    width = clampInteger(prepared.capture.width, width, 320, screenshotMaxViewportWidth);
    height = clampInteger(prepared.capture.height, height, 240, screenshotMaxCaptureHeight);
  }
  run = await execute(true);
  prepared = run.result;
  if (prepared.capture.width > width || prepared.capture.height > height) {
    throw new Error("slides browser worker content exceeds the capture window");
  }
  if (String(run.capture?.outputPath ?? "") !== screenshotPath) {
    throw new Error("slides browser worker returned an unexpected capture path");
  }
  const imageBase64 = (await readFile(screenshotPath)).toString("base64");
  return {
    htmlPath: request.htmlPath,
    screenshotPath,
    imageBase64,
    viewport: prepared.viewport,
    document: prepared.document,
    capture: prepared.capture,
    truncated: prepared.truncated,
    ...prepared.deck ? { deck: prepared.deck } : {}
  };
}
async function measureSlideOverflow(htmlPath, canvasWidth = 1280, canvasHeight = 720) {
  if (browserWorkerHostAvailable()) {
    const run = await runSlidesBrowserWorkerJob({
      width: canvasWidth,
      height: canvasHeight,
      payload: {
        htmlURL: pathToFileURL(htmlPath).href,
        width: canvasWidth,
        height: canvasHeight,
        fullPage: false,
        delayMs: 300
      }
    });
    const measured = run.result;
    return {
      height: measured.height,
      overflow: measured.overflow,
      canvasHeight,
      ...measured.loadTimedOut ? { loadTimedOut: true } : {}
    };
  }
  const chrome = await launchChrome();
  const cdp = new CDPClient(chrome.wsURL);
  try {
    await cdp.open();
    const target = await cdp.send("Target.createTarget", { url: "about:blank" });
    const attached = await cdp.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
    const sessionId = String(attached.sessionId);
    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    await setViewport(cdp, sessionId, canvasWidth, canvasHeight);
    const loadEvent = cdp.waitForEvent("Page.loadEventFired", sessionId, 12000);
    await cdp.send("Page.navigate", { url: pathToFileURL(htmlPath).href }, sessionId);
    let loadTimedOut = false;
    await loadEvent.catch(() => {
      loadTimedOut = true;
      console.error(`[slides] MEASURE_LOAD_TIMEOUT=1 stage=measure path=${JSON.stringify(htmlPath)}`);
    });
    await evaluate(cdp, sessionId, `(async () => {
        const style = document.createElement('style');
        style.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; }';
        (document.head || document.documentElement).appendChild(style);
        if (document.fonts?.ready) {
          await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2000))]);
        }
      })()`).catch(() => {
      return;
    });
    await sleep(300);
    const measured = await evaluate(cdp, sessionId, `(() => {
        const root = document.querySelector('.slide-container') || document.body || document.documentElement;
        const rootRect = root.getBoundingClientRect();
        let bottom = Math.max(rootRect.height, root.scrollHeight || 0);
        for (const element of root.querySelectorAll('*')) {
          const style = getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') continue;
          const rect = element.getBoundingClientRect();
          bottom = Math.max(bottom, rect.bottom - rootRect.top);
        }
        return { height: Math.ceil(bottom) };
      })()`);
    const height = Math.max(0, Math.ceil(Number(measured?.height) || 0));
    return {
      height,
      overflow: Math.max(0, height - canvasHeight),
      canvasHeight,
      ...loadTimedOut ? { loadTimedOut } : {}
    };
  } catch (error) {
    console.error(`[slides] MEASURE_OVERFLOW_FAILED=1 path=${JSON.stringify(htmlPath)}`, error instanceof Error ? error : String(error));
    throw error;
  } finally {
    await cdp.close().catch(() => {
      return;
    });
    await chrome.close();
  }
}
async function setViewport(cdp, sessionId, width, height) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false
  }, sessionId);
}
async function prepareDeckSlide(cdp, sessionId, slideNumber) {
  const result = await evaluate(cdp, sessionId, `(${prepareDeckSlideInPage})(${JSON.stringify(slideNumber)})`);
  if (!result || typeof result !== "object") {
    throw new Error("Unable to prepare deck slide for screenshot.");
  }
  return result;
}
async function evaluate(cdp, sessionId, expression) {
  const evaluated = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  }, sessionId);
  if (evaluated.exceptionDetails) {
    const exception = evaluated.exceptionDetails.exception;
    throw new Error(exception?.description || exception?.value || evaluated.exceptionDetails.text || "Page evaluation failed");
  }
  return evaluated.result?.value;
}
async function prepareDeckSlideInPage(slideNumber) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
  const timeout = (promise, ms, message) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
  ]);
  if (!document.querySelector("deck-stage")) {
    throw new Error("slideNumber requires a <deck-stage> element in the screenshot target.");
  }
  if (!customElements.get("deck-stage")) {
    await timeout(customElements.whenDefined("deck-stage"), 3000, "Timed out waiting for <deck-stage> to be defined.");
  }
  const deck = document.querySelector("deck-stage");
  if (!deck) {
    throw new Error("slideNumber requires a <deck-stage> element in the screenshot target.");
  }
  await timeout((async () => {
    while (!Number.isFinite(Number(deck.length)) || Number(deck.length) <= 0) {
      await frame();
    }
  })(), 3000, "Timed out waiting for <deck-stage> slides to be ready.");
  const totalSlides = Number(deck.length);
  if (slideNumber > totalSlides) {
    throw new Error(`slideNumber ${slideNumber} is out of range for deck with ${totalSlides} slide(s).`);
  }
  const targetIndex = slideNumber - 1;
  deck.setAttribute("no-rail", "");
  window.postMessage({ __omelette_presenting: true }, "*");
  window.postMessage({ __omelette_preview_mode: true }, "*");
  if (typeof deck.goTo !== "function") {
    throw new Error("<deck-stage> does not expose goTo(); cannot navigate to requested slide.");
  }
  if (Number(deck.index) !== targetIndex) {
    await timeout(new Promise((resolve, reject) => {
      const finish = () => {
        deck.removeEventListener("slidechange", onSlideChange);
        resolve();
      };
      const onSlideChange = (event) => {
        if (Number(event.detail?.index) === targetIndex)
          finish();
      };
      deck.addEventListener("slidechange", onSlideChange);
      try {
        deck.goTo(targetIndex);
      } catch (error) {
        deck.removeEventListener("slidechange", onSlideChange);
        reject(error);
        return;
      }
      requestAnimationFrame(() => {
        if (Number(deck.index) === targetIndex)
          finish();
      });
    }), 3000, `Timed out navigating to deck slide ${slideNumber}.`);
  } else {
    deck.goTo(targetIndex);
  }
  deck.setAttribute("no-rail", "");
  const overlay = deck.shadowRoot?.querySelector(".overlay");
  if (overlay)
    overlay.removeAttribute("data-visible");
  deck.shadowRoot?.querySelectorAll(".rail, .rail-resize, .ctxmenu, .confirm-backdrop").forEach((element) => {
    element.style.setProperty("display", "none", "important");
  });
  if (document.fonts?.ready) {
    await Promise.race([document.fonts.ready, wait(2000)]);
  }
  await frame();
  await frame();
  const rail = deck.shadowRoot?.querySelector(".rail");
  const railResize = deck.shadowRoot?.querySelector(".rail-resize");
  const cleanCapture = deck.hasAttribute("no-rail") && (!overlay || !overlay.hasAttribute("data-visible")) && (!rail || getComputedStyle(rail).display === "none") && (!railResize || getComputedStyle(railResize).display === "none");
  if (!cleanCapture) {
    throw new Error("Unable to hide deck outline before screenshot capture.");
  }
  return {
    requestedSlideNumber: slideNumber,
    activeSlideNumber: Number(deck.index) + 1,
    totalSlides,
    designWidth: Number(deck.designWidth) || Number(deck.getAttribute("width")) || 0,
    designHeight: Number(deck.designHeight) || Number(deck.getAttribute("height")) || 0,
    cleanCapture
  };
}
var liveChrome = new Map;
async function shutdownAllChrome() {
  const entries = [...liveChrome.entries()];
  liveChrome.clear();
  await Promise.all(entries.map(async ([child, userDataDir]) => {
    if (!child.killed)
      child.kill("SIGKILL");
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {
      return;
    });
  }));
}
async function launchChrome() {
  const executable = findChromeExecutable();
  if (!executable) {
    throw new Error("Could not find Chrome or Chromium for Slides screenshots. Set CHROME_PATH or install Chromium in the sandbox.");
  }
  const userDataDir = await mkdtemp(path8.join(os2.tmpdir(), "slides-addon-chrome-"));
  const child = spawn(executable, [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--no-sandbox",
    `--user-data-dir=${userDataDir}`,
    "--remote-debugging-port=0",
    "about:blank"
  ], {
    stdio: ["ignore", "ignore", "pipe"]
  });
  liveChrome.set(child, userDataDir);
  child.on("exit", () => {
    liveChrome.delete(child);
  });
  const wsURL = await waitForChromeWebSocket(child);
  return {
    wsURL,
    async close() {
      liveChrome.delete(child);
      if (!child.killed)
        child.kill("SIGTERM");
      await rm(userDataDir, { recursive: true, force: true }).catch(() => {
        return;
      });
    }
  };
}
function waitForChromeWebSocket(child) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let output = "";
    const timeout = setTimeout(() => {
      if (settled)
        return;
      settled = true;
      reject(new Error(`Timed out waiting for Chrome DevTools endpoint.${output ? ` Chrome output: ${output}` : ""}`));
    }, 1e4);
    child.stderr?.on("data", (chunk) => {
      const text = chunk.toString("utf8");
      output += text;
      const match = text.match(/DevTools listening on (ws:\/\/[^\s]+)/) || output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match && !settled) {
        settled = true;
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
    child.on("error", (error) => {
      if (settled)
        return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    });
    child.on("exit", (code) => {
      if (settled)
        return;
      settled = true;
      clearTimeout(timeout);
      reject(new Error(`Chrome exited before DevTools was ready: ${code ?? "unknown"}.${output ? ` Chrome output: ${output}` : ""}`));
    });
  });
}

class CDPClient {
  wsURL;
  nextId = 1;
  pending = new Map;
  waiters = new Set;
  socket = null;
  constructor(wsURL) {
    this.wsURL = wsURL;
  }
  open() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.wsURL);
      this.socket.addEventListener("open", () => resolve(), { once: true });
      this.socket.addEventListener("error", reject, { once: true });
      this.socket.addEventListener("message", (event) => this.onMessage(event));
      this.socket.addEventListener("close", () => {
        for (const { reject: rejectPending } of this.pending.values()) {
          rejectPending(new Error("Chrome DevTools connection closed"));
        }
        this.pending.clear();
      });
    });
  }
  send(method, params = {}, sessionId) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("Chrome DevTools connection is not open"));
    }
    const id = this.nextId++;
    const message = {
      id,
      method,
      params
    };
    if (sessionId)
      message.sessionId = sessionId;
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.socket.send(JSON.stringify(message));
    return promise;
  }
  waitForEvent(method, sessionId, timeoutMs) {
    return new Promise((resolve, reject) => {
      const waiter = { method, sessionId, resolve, reject };
      waiter.timeout = setTimeout(() => {
        this.waiters.delete(waiter);
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);
      this.waiters.add(waiter);
    });
  }
  close() {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      return Promise.resolve();
    }
    this.socket.close();
    return Promise.resolve();
  }
  onMessage(event) {
    const message = JSON.parse(event.data.toString());
    if (message.id && this.pending.has(message.id)) {
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (!pending)
        return;
      if (message.error) {
        pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
      } else {
        pending.resolve(message.result || {});
      }
      return;
    }
    for (const waiter of [...this.waiters]) {
      if (message.method === waiter.method && (!waiter.sessionId || waiter.sessionId === message.sessionId)) {
        clearTimeout(waiter.timeout);
        this.waiters.delete(waiter);
        waiter.resolve(message.params || {});
      }
    }
  }
}
function findChromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    ...windowsChromeCandidates(),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium"
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) || "";
}
function windowsChromeCandidates(environment = process.env) {
  return [
    environment.PROGRAMFILES && path8.join(environment.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
    environment["PROGRAMFILES(X86)"] && path8.join(environment["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe"),
    environment.LOCALAPPDATA && path8.join(environment.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
    environment.PROGRAMFILES && path8.join(environment.PROGRAMFILES, "Microsoft", "Edge", "Application", "msedge.exe"),
    environment["PROGRAMFILES(X86)"] && path8.join(environment["PROGRAMFILES(X86)"], "Microsoft", "Edge", "Application", "msedge.exe")
  ].filter(Boolean);
}
function clampInteger(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number))
    return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}
function safeScreenshotName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "screenshot";
}
function timestampForFilename() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// mcp/tools/applyFileEditHookResult.ts
import { createHash as createHash4 } from "node:crypto";
import path11 from "node:path";

// mcp/templates.ts
var import_jszip = __toESM(require_lib3(), 1);
import path10 from "node:path";

// shared/templatePrompts.ts
var SLIDE_STATE_EDITED2 = "edited";
function coverTemplateGuidelines(templateHtml, projectDir) {
  return `# Cover Page Template
## Template HTML Code
${templateHtml}

## Template Guidelines
- Follow the slide template to create the page. You should only replace the content of the slide template, and strictly keep the layout, visual style, color palette, font information, special info like logo in the template.
- ${templateAssetPathGuideline(projectDir)}
- You can only replace the images that exist in the template with other images, but never place an image in a new place.
- For template asset files, you can only use them when they exist in the original template html.
- **NEVER leave gray diagram placeholders in your final slides**. All placeholders MUST be replaced with actual content.
- Gray diagram placeholders indicate where visual elements should be created. You MUST replace EVERY placeholder with meaningful content.`;
}
function nextPageTemplateGuidelines(slide, templateHtml, projectDir) {
  return `# Next Page Template (slide "${slide.id}"${slide.title ? ` — ${slide.title}` : ""})
## Template Requirements
- Follow the slide template below to create "${slide.id}.html". Only replace the content of the template; strictly keep its layout, visual style, color palette, fonts, and special elements like logos.
- ${templateAssetPathGuideline(projectDir)}
- Do not add an image where the template has none; you may only replace images that exist in the template.
- Refer to the template's content density to prevent overflow.
- **NEVER leave gray diagram placeholders in your final slides**; replace every placeholder with meaningful content.

## Template HTML Code
${templateHtml}`;
}
function missingTemplateKeyReminder(slide, templateId) {
  return `# Next Page Template (slide "${slide.id}")
This deck uses template "${templateId}", but slide "${slide.id}" has ${slide.slide_template_key ? `an unknown slide_template_key "${slide.slide_template_key}"` : "no slide_template_key"}. Keep the page visually consistent with the template pages you already authored (same layout system, colors, and fonts).`;
}
function templateSectionForNextPending(input) {
  const byId = new Map(input.outline.map((entry) => [String(entry.id), entry]));
  for (const id of input.slideIds) {
    const entry = byId.get(id);
    if (!entry || entry.state !== SLIDE_STATE_EDITED2) {
      const slide = {
        id,
        ...entry?.title ? { title: String(entry.title) } : {},
        ...entry?.slide_template_key ? { slide_template_key: String(entry.slide_template_key) } : {}
      };
      const html = input.pages.find((page) => page.id === slide.slide_template_key)?.html ?? "";
      return html ? nextPageTemplateGuidelines(slide, html, input.projectDir) : missingTemplateKeyReminder(slide, input.templateId);
    }
  }
  return "";
}
function templateAssetPathGuideline(projectDir) {
  const absoluteAssetPrefix = `${projectDir.replace(/\/+$/, "")}/assets/`;
  return `Template asset files live under the absolute path prefix \`${absoluteAssetPrefix}\`. ` + "The template HTML may contain relative `./assets/...` references; rewrite every retained template asset " + `reference to the corresponding absolute \`${absoluteAssetPrefix}...\` path, and never leave a relative ` + "`./assets/...` reference in the authored page.";
}

// mcp/image/hostFileTransfer.ts
import { createHash as createHash3 } from "node:crypto";
import fs5 from "node:fs";
import path9 from "node:path";
var maxImageReferenceCount = 2;
var maxTransferredFileSize = 25 * 1024 * 1024;
var uploadTimeoutMs = 60000;
async function uploadImageReferences(host, references, workspaceRoot) {
  const paths = Array.isArray(references) ? references.map(String) : [];
  if (paths.length > maxImageReferenceCount) {
    throw new Error(`references accepts at most ${maxImageReferenceCount} images.`);
  }
  const urls = [];
  for (const referencePath of paths) {
    const file2 = readReferenceFile(workspaceReferencePath(referencePath, workspaceRoot));
    const created = await host.createFileUpload({
      filename: file2.filename,
      contentType: file2.contentType,
      sizeBytes: file2.sizeBytes,
      sha256: createHash3("sha256").update(file2.content).digest("hex")
    });
    const uploadUrl = String(created?.uploadUrl ?? created?.upload_url ?? "");
    const fileUrl = String(created?.fileUrl ?? created?.file_url ?? "");
    const requiredHeaders = normalizeRequiredHeaders(created?.requiredHeaders ?? created?.required_headers);
    if (!uploadUrl || !fileUrl || !requiredHeaders) {
      throw new Error(`Host did not create an upload for reference ${file2.absolutePath}.`);
    }
    const uploaded = await fetch(uploadUrl, {
      method: "PUT",
      headers: requiredHeaders,
      body: new Blob([Uint8Array.from(file2.content)]),
      signal: AbortSignal.timeout(uploadTimeoutMs)
    });
    if (!uploaded.ok) {
      await uploaded.body?.cancel().catch(() => {
        return;
      });
      throw new Error(`Reference upload failed for ${file2.absolutePath}: HTTP ${uploaded.status}.`);
    }
    urls.push(fileUrl);
  }
  return urls;
}
function workspaceReferencePath(referencePath, workspaceRoot) {
  const value = String(referencePath ?? "").trim();
  if (!path9.isAbsolute(value))
    return value;
  const scoped = workspaceFilePath(workspaceRoot, value);
  if (scoped === OUTSIDE_WORKSPACE) {
    throw new Error(`Reference image is outside the workspace or in a hidden directory: ${value}. ` + "Copy it into the deck project directory and pass the copy.");
  }
  return scoped ?? value;
}
function normalizeRequiredHeaders(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return;
  const entries = Object.entries(value);
  if (entries.length === 0 || entries.some(([name, item]) => !name || typeof item !== "string" || !item)) {
    return;
  }
  return Object.fromEntries(entries);
}
function readReferenceFile(referencePath) {
  const absolutePath = String(referencePath ?? "").trim();
  if (!path9.isAbsolute(absolutePath)) {
    throw new Error(`Reference path must be an absolute local path: ${absolutePath || "(empty)"}.`);
  }
  let stat;
  try {
    stat = fs5.statSync(absolutePath);
  } catch {
    throw new Error(`Reference image does not exist: ${absolutePath}.`);
  }
  if (!stat.isFile()) {
    throw new Error(`Reference image is not a regular file: ${absolutePath}.`);
  }
  if (stat.size <= 0 || stat.size > maxTransferredFileSize) {
    throw new Error(`Reference image size must be between 1 and ${maxTransferredFileSize} bytes: ${absolutePath}.`);
  }
  const content = fs5.readFileSync(absolutePath);
  if (content.length <= 0 || content.length > maxTransferredFileSize) {
    throw new Error(`Reference image size must be between 1 and ${maxTransferredFileSize} bytes: ${absolutePath}.`);
  }
  const detected = detectRasterImage(content);
  const extension = path9.extname(absolutePath).toLowerCase();
  const expected = contentTypeForExtension(extension);
  if (!detected || !expected || detected.contentType !== expected) {
    throw new Error(`Reference must be a valid PNG, JPEG, or WebP file with a matching extension: ${absolutePath}.`);
  }
  return {
    absolutePath,
    filename: safeUploadFilename(path9.basename(absolutePath), detected.extension),
    contentType: detected.contentType,
    sizeBytes: content.length,
    content
  };
}
function safeUploadFilename(basename, extension) {
  const stem = basename.replace(/\.[^.]*$/, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^[._-]+/, "").replace(/[._-]+$/, "");
  return `${stem || "reference"}.${extension}`;
}
function detectRasterImage(content) {
  if (content.length >= 8 && Buffer.from(content.subarray(0, 8)).equals(Buffer.from("89504e470d0a1a0a", "hex"))) {
    return { contentType: "image/png", extension: "png" };
  }
  if (content.length >= 3 && content[0] === 255 && content[1] === 216 && content[2] === 255) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }
  if (content.length >= 12 && Buffer.from(content.subarray(0, 4)).toString("ascii") === "RIFF" && Buffer.from(content.subarray(8, 12)).toString("ascii") === "WEBP") {
    return { contentType: "image/webp", extension: "webp" };
  }
  return;
}
function contentTypeForExtension(extension) {
  if (extension === ".png")
    return "image/png";
  if (extension === ".jpg" || extension === ".jpeg")
    return "image/jpeg";
  if (extension === ".webp")
    return "image/webp";
  return;
}

// mcp/templates.ts
var NO_TEMPLATE_ID = "deck-stage-basic";
function hasTemplate(templateId) {
  const value = String(templateId ?? "").trim();
  return value !== "" && value !== NO_TEMPLATE_ID;
}
function normalizeTemplateDetail(payload) {
  const templateId = String(payload?.template_id ?? "").trim();
  if (!templateId) {
    throw new Error("Addon Server returned a slide template without template_id");
  }
  const generateMode = payload?.slides_generate_mode === "image" ? "image" : "html";
  const referenceImageUrl = String(payload?.reference_image_url ?? "").trim();
  if (generateMode === "image" && !referenceImageUrl) {
    throw new Error(`Image slide template "${templateId}" has no style reference image`);
  }
  return {
    templateId,
    name: String(payload?.name ?? templateId),
    generateMode,
    imageSlidesModel: String(payload?.image_slides_model ?? ""),
    generalDescription: String(payload?.general_description ?? ""),
    imageUse: String(payload?.image_use ?? ""),
    typography: String(payload?.typography ?? ""),
    colorPalette: String(payload?.color_palette ?? ""),
    pages: Array.isArray(payload?.pages) ? payload.pages.map((page) => ({
      id: String(page?.id ?? ""),
      name: String(page?.name ?? ""),
      description: String(page?.description ?? ""),
      html: String(page?.html ?? "")
    })) : [],
    ...payload?.asset_pack_url ? { assetPackUrl: String(payload.asset_pack_url) } : {},
    ...referenceImageUrl ? { referenceImageUrl } : {}
  };
}
var TEMPLATE_CACHE_TTL_MS = 10 * 60 * 1000;
var templateCache = new Map;
async function fetchTemplateDetail(client, templateId) {
  const cached = templateCache.get(templateId);
  if (cached && Date.now() - cached.fetchedAt < TEMPLATE_CACHE_TTL_MS) {
    return cached.detail;
  }
  const detail = normalizeTemplateDetail(await client.getSlideTemplate(templateId));
  templateCache.set(templateId, { detail, fetchedAt: Date.now() });
  return detail;
}
function templateOfProject(project) {
  const record = project.viewState?.template;
  const id = String(record?.id ?? "").trim();
  if (!id) {
    return;
  }
  const generateMode = String(record?.generate_mode ?? "");
  return { id, ...generateMode ? { generateMode } : {} };
}
function rememberTemplateOnViewState(viewState, detail) {
  return {
    ...viewState,
    template: {
      id: detail.templateId,
      name: detail.name,
      generate_mode: detail.generateMode
    }
  };
}
function templateCatalogText(detail) {
  return detail.generateMode === "image" ? imageTemplateCatalogText(detail) : richTemplateCatalogText(detail);
}
function richTemplateCatalogText(detail) {
  const styleLines = [
    detail.typography ? `## Typography
${detail.typography}` : "",
    detail.colorPalette ? `## Color Palette
${detail.colorPalette}` : ""
  ].filter(Boolean);
  const pageCatalog = detail.pages.map((page, index) => `## Page ${index + 1} ID: "${page.id}"${page.name ? ` (${page.name})` : ""}
## Description: ${page.description}`).join(`

`);
  return `# Slide template "${detail.name}" (template_id: "${detail.templateId}", generate_mode: html)
## General Description
${detail.generalDescription}
${detail.imageUse ? `## Image Use
${detail.imageUse}
` : ""}${styleLines.length ? `${styleLines.join(`
`)}
` : ""}
# Detailed descriptions of the slide template pages
${pageCatalog}

# How to use this template
- Write the deck outline so EVERY slide carries a \`slide_template_key\` chosen from the page IDs above (pick the best-matching template page per slide; reusing a page ID for multiple slides is fine). init_slides rejects templated outlines with missing or unknown keys.
- Call \`slides/init_slides\` with \`template_id: "${detail.templateId}"\`, \`generate_mode: "html"\` (this template requires HTML mode), and that outline. The template page HTML is injected as you author each page — only replace the content of the template, and strictly keep its layout, visual style, color palette, fonts, and special elements like logos.
- Template asset files are extracted to \`assets/\` inside the deck project directory during initialization. The template HTML may contain relative \`./assets/...\` references; when authoring, rewrite each retained template asset reference to an absolute path by appending \`/assets/...\` to the exact \`project_dir\` returned by \`slides/init_slides\`. Never copy a literal placeholder for the directory or leave a relative \`./assets/...\` reference in the authored page.`;
}
function imageTemplateCatalogText(detail) {
  return `# Slide template "${detail.name}" (template_id: "${detail.templateId}", generate_mode: image)
This is an image-style template: every page is generated as a full-slide image with \`slides/generate_image_slide\`.
# How to use this template
- Call \`slides/init_slides\` with \`template_id: "${detail.templateId}"\` and \`generate_mode: "image"\` (this template requires image mode).
- A style reference image is materialized as \`references/slide_template_${detail.templateId}.<png|jpg|webp>\` under the deck project directory. The init_slides or attach_slides result names the exact absolute path. Include it in \`references\` for EVERY page. When available, also include the previous generated slide image for continuity.`;
}
function imageTemplateReferenceText(detail, referenceImagePath) {
  if (detail.generateMode !== "image" || !referenceImagePath) {
    return "";
  }
  return `# Image Template "${detail.name}"

## Style Reference Image
Saved at: ${referenceImagePath}
Include this absolute path in \`references\` for EVERY page. When available, also include the previous generated slide image for continuity.`;
}
function templatePageHtml(detail, pageId) {
  if (!pageId) {
    return "";
  }
  return detail.pages.find((page) => page.id === pageId)?.html ?? "";
}
function requireTemplateOutlineKeys(detail, outline) {
  if (detail.generateMode !== "html" || detail.pages.length === 0) {
    return;
  }
  const known = new Set(detail.pages.map((page) => page.id));
  const problems = outline.map((entry) => {
    const key = String(entry.slide_template_key ?? "").trim();
    if (!key)
      return `"${entry.id}" has no slide_template_key`;
    if (!known.has(key))
      return `"${entry.id}" has unknown slide_template_key "${key}"`;
    return "";
  }).filter(Boolean);
  if (problems.length > 0) {
    throw new Error(`Template "${detail.templateId}" requires a valid slide_template_key on every outline entry: ` + `${problems.join("; ")}. Valid page IDs: ${[...known].join(", ")}. ` + "Call slides/get_template first and tag each outline entry with the best-matching page ID.");
  }
}
async function nextPendingTemplateText(client, project) {
  const bound = templateOfProject(project);
  if (!bound || bound.generateMode === "image") {
    return "";
  }
  try {
    const detail = await fetchTemplateDetail(client, bound.id);
    if (detail.generateMode === "image") {
      return "";
    }
    return templateSectionForNextPending({
      templateId: detail.templateId,
      projectDir: project.projectDir,
      outline: outlineOfProject(project),
      slideIds: slideIdsOfProject(project),
      pages: detail.pages
    });
  } catch {
    return "";
  }
}
var TEMPLATE_REFERENCE_DIR = "references";
var TEMPLATE_ASSETS_DIR = "assets";
function templateReferenceImageRelativePath(templateId, extension = "png") {
  return `${TEMPLATE_REFERENCE_DIR}/slide_template_${templateId}.${extension}`;
}
async function materializeTemplateAssets(store, project, detail) {
  const assetFiles = [];
  let referenceImagePath;
  if (detail.assetPackUrl) {
    const zip = await import_jszip.default.loadAsync(await downloadBinary(detail.assetPackUrl, "template asset pack"));
    for (const entry of Object.values(zip.files)) {
      if (entry.dir) {
        continue;
      }
      const relative = sanitizeZipEntryName(entry.name);
      if (!relative) {
        continue;
      }
      const body = await entry.async("uint8array");
      store.writeBinaryFile(project, `${TEMPLATE_ASSETS_DIR}/${relative}`, body);
      assetFiles.push(`${TEMPLATE_ASSETS_DIR}/${relative}`);
    }
  }
  if (detail.referenceImageUrl) {
    const body = await downloadBinary(detail.referenceImageUrl, "template reference image");
    const detected = detectRasterImage(new Uint8Array(body));
    const relative = templateReferenceImageRelativePath(detail.templateId, detected?.extension ?? "png");
    store.writeBinaryFile(project, relative, new Uint8Array(body));
    referenceImagePath = path10.join(project.projectDir, relative);
  }
  return { assetFiles, ...referenceImagePath ? { referenceImagePath } : {} };
}
function sanitizeZipEntryName(name) {
  const normalized = name.replaceAll("\\", "/").replace(/^\/+/, "");
  const segments = normalized.split("/").filter((segment) => segment !== "" && segment !== ".");
  if (segments.length === 0 || segments.some((segment) => segment === "..")) {
    return "";
  }
  if (segments[0] === TEMPLATE_ASSETS_DIR) {
    segments.shift();
  }
  if (segments.length === 0 || segments.some((segment) => segment.startsWith("__MACOSX"))) {
    return "";
  }
  return segments.join("/");
}
var TEMPLATE_DOWNLOAD_TIMEOUT_MS = 30000;
async function downloadBinary(url, label) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TEMPLATE_DOWNLOAD_TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`Failed to download ${label}: HTTP ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

// mcp/tools/constants.ts
var SLIDES_MCP_SERVER_ID = "slides";
var INSPECT_AFTER_FILE_EDIT_TOOL = "_inspect_after_file_edit";
var APPLY_FILE_EDIT_HOOK_RESULT_TOOL = "_apply_file_edit_hook_result";
var SYNC_USER_EDITS_TOOL = "_sync_user_edits";
var USER_CHAT_SYNC_HOOK_ID = "user-chat-sync";
var DESIGN_BRIEF_FILE = "design.md";

// mcp/tools/applyFileEditHookResult.ts
var applyFileEditHookResultTool = {
  visible: false,
  definition: {
    name: APPLY_FILE_EDIT_HOOK_RESULT_TOOL,
    description: "Apply a completed Slides file-edit hook repair to the runtime working copy.",
    inputSchema: { type: "object", properties: {} }
  },
  async execute({ store, sync, client }, args) {
    if (isHostEffectResumeArgs(args)) {
      try {
        return await executeHostEffectResume({ store, sync, client }, args);
      } catch (error) {
        return hostEffectResumeFailureResult(error);
      }
    }
    const context = args?.context;
    const project = store.resolveProject(context);
    if (!project)
      throw new Error("Slides continuation could not resolve its original project target.");
    const relativePath = safeProjectRelativePath(context?.file_path ?? context?.filePath ?? context?.path, project.activeFile || "cover.html");
    if (String(args?.outcome ?? "") !== "succeeded") {
      const file2 = store.readProjectFile(project, relativePath);
      if (file2) {
        Object.assign(project, projectAfterFileEdit(project, relativePath, file2.content));
        store.cache(project);
        store.writeProjectConfig(project);
      }
      return {
        content: [{ type: "text", text: "Slides repair did not complete; the original file was left unchanged." }],
        structuredContent: { applied: false, error: args?.error }
      };
    }
    const finalContent = String(args?.payload?.final_content ?? args?.payload?.finalContent ?? "");
    if (!finalContent.trim())
      throw new Error("Slides continuation payload is missing final_content.");
    const updated = projectAfterFileEdit(project, relativePath, finalContent);
    Object.assign(project, updated);
    store.writeContentFile(project, relativePath, finalContent);
    store.cache(project);
    store.writeProjectConfig(project);
    const measurement = await withTimeout(measureSlideOverflow(path11.join(project.projectDir, relativePath)), RESUME_MEASURE_TIMEOUT_MS).catch(() => {
      console.error(`[slides] MEASURE_RESUME_FAILED=1 path=${JSON.stringify(relativePath)}`);
      return;
    });
    return {
      content: [{ type: "text", text: `Applied optimized Slides HTML to ${relativePath}.` }],
      structuredContent: {
        applied: true,
        project_id: project.id,
        file_path: relativePath,
        height: measurement?.height
      }
    };
  }
};
var RESUME_ASSET_SYNC_TIMEOUT_MS = 8000;
var RESUME_PUSH_TIMEOUT_MS = 14000;
var RESUME_MEASURE_TIMEOUT_MS = 4000;
var RESUME_TEMPLATE_TIMEOUT_MS = 2000;
var RESUME_RESULT_TEXT = "Slides overflow was optimized to fit the 1280x720 canvas.";
function isHostEffectResumeArgs(args) {
  return args?.input !== undefined && args?.context === undefined;
}
function hostEffectResumeFailureResult(error) {
  const reason = error instanceof Error ? error.message : String(error);
  const reminder = `<system_reminder>Slides could not finalize the last edit (${reason}). The edit is saved in the sandbox ` + "but may not be reflected in the deck yet — rewrite the file (same content is fine) to re-sync, " + "or tell the user and continue.</system_reminder>";
  return {
    content: [{ type: "text", text: `Slides effect resume failed: ${reason}` }],
    structuredContent: { agent_reminder: reminder }
  };
}
async function executeHostEffectResume({ store, sync, client }, args) {
  const input = args?.input ?? {};
  const project = store.resolveProject(input);
  if (!project)
    throw new Error("Slides effect resume could not resolve its project target.");
  const relativePath = safeProjectRelativePath(input?.file_path ?? input?.filePath ?? input?.path, project.activeFile || "cover.html");
  const filePath = path11.join(project.projectDir, relativePath);
  const finalContent = String(args?.outcome ?? "") === "ok" ? extractRepairedHTML(String(args?.result?.content ?? "")) : undefined;
  const stillContains = (content) => store.readProjectFile(project, relativePath)?.content === content;
  if (input.content_sha256 !== undefined) {
    const current = store.readProjectFile(project, relativePath);
    if (!current || createHash4("sha256").update(current.content).digest("hex") !== input.content_sha256) {
      return staleRepairResult();
    }
  }
  if (!finalContent) {
    const extraIssues = [];
    const file2 = store.readProjectFile(project, relativePath);
    if (file2) {
      const updated2 = projectAfterFileEdit(project, relativePath, file2.content);
      Object.assign(project, updated2);
      store.cache(project);
      store.writeProjectConfig(project);
      try {
        const pushed = await withTimeout(sync.pushEdit(project.id, rebaseFileEdit(relativePath, file2.content, updated2), "runtime_mcp_file_edit"), RESUME_PUSH_TIMEOUT_MS);
        if (!pushed)
          extraIssues.push(slideRemovedIssue(relativePath));
      } catch (error) {
        extraIssues.push(`the deck could not be synced (${error instanceof Error ? error.message : error}) — rewrite the file (same content is fine) to retry`);
      }
    }
    if (file2 && !stillContains(file2.content))
      return staleRepairResult();
    const reminder = "<system_reminder>Automatic slide overflow repair did not complete; the slide was kept as written and still " + `overflows the 720px canvas. Rewrite \`${filePath}\` so all content fits inside the 1280x720 .slide-container` + `${extraIssues.length ? `. Also: ${extraIssues.join("; ")}` : ""}.</system_reminder>`;
    return {
      content: [{ type: "text", text: "Slides repair did not complete; the original edit was committed as written." }],
      structuredContent: { agent_reminder: reminder }
    };
  }
  const updated = projectAfterFileEdit(project, relativePath, finalContent);
  Object.assign(project, updated);
  store.writeContentFile(project, relativePath, finalContent);
  store.cache(project);
  store.writeProjectConfig(project);
  const assetIssues = [];
  try {
    const { missing, outsideWorkspace, unsupported } = await withTimeout(syncProjectAssets(updated, client, RESOURCE_KEY, workspaceAssetReader(store.workspaceRoot)), RESUME_ASSET_SYNC_TIMEOUT_MS);
    if (missing.length > 0) {
      assetIssues.push(`The repaired slide references local files that do not exist in the sandbox: ${missing.join(", ")}. ` + "These images will appear broken in the Manus UI — create the files (or fix the references) and edit the slide again.");
    }
    if (outsideWorkspace.length > 0) {
      assetIssues.push(outsideWorkspaceIssue(outsideWorkspace, updated.projectDir));
    }
    const unsupportedIssue = exportBlockingUnsupportedIssue(unsupported, { fileName: relativePath, content: finalContent }, updated.projectDir || "/");
    if (unsupportedIssue)
      assetIssues.push(unsupportedIssue);
  } catch {}
  if (!stillContains(finalContent))
    return staleRepairResult();
  const mergedAssets = assetMapFromViewState(updated.viewState);
  if (Object.keys(mergedAssets).length > 0) {
    project.viewState = {
      ...project.viewState,
      assets: { ...assetMapFromViewState(project.viewState), ...mergedAssets }
    };
  }
  let pushIssue = "";
  try {
    const pushed = await withTimeout(sync.pushEdit(project.id, rebaseFileEdit(relativePath, finalContent, updated), "runtime_mcp_hook_repair"), RESUME_PUSH_TIMEOUT_MS);
    if (!pushed)
      pushIssue = slideRemovedIssue(relativePath);
  } catch (error) {
    pushIssue = `The repaired slide was written to the sandbox, but the deck could not be synced ` + `(${error instanceof Error ? error.message : error}) — rewrite the file (same content is fine) to retry.`;
  }
  if (!stillContains(finalContent))
    return staleRepairResult();
  const measurement = await withTimeout(measureSlideOverflow(filePath), RESUME_MEASURE_TIMEOUT_MS).catch((error) => {
    console.error(`[slides] MEASURE_RESUME_FAILED=1 path=${JSON.stringify(filePath)}`);
    sync.trackBackground(client.reportRuntimeFailure("measure_overflow_failed", `resume: ${error instanceof Error ? error.message : String(error)}`).catch(() => {
      return;
    }));
    return;
  });
  const templateText = await withTimeout(nextPendingTemplateText(client, updated), RESUME_TEMPLATE_TIMEOUT_MS).catch(() => "");
  if (!stillContains(finalContent))
    return staleRepairResult();
  const sections = [
    pushIssue,
    ...assetIssues,
    ...repeatedImageIssues(store, project, relativePath, finalContent),
    measurement?.height && measurement.height > 720 ? `The optimized Slides HTML still measures ${measurement.height}px high. Review the canvas before presenting.` : "",
    templateText
  ].filter(Boolean);
  const agentReminder = sections.length ? `<system_reminder>
${sections.join(`

`)}
</system_reminder>` : undefined;
  return {
    content: [{ type: "text", text: `Applied optimized Slides HTML to ${relativePath}.` }],
    structuredContent: {
      ...agentReminder ? { agent_reminder: agentReminder } : {},
      history_patch: {
        kind: "file_write",
        path: filePath,
        content: finalContent,
        result_text: RESUME_RESULT_TEXT,
        ...measurement?.height ? { height: measurement.height } : {}
      }
    }
  };
}
function staleRepairResult() {
  return {
    content: [{ type: "text", text: "Slides repair skipped because the file changed after inspection." }],
    structuredContent: {
      agent_reminder: "<system_reminder>The slide changed while automatic repair was running. The newer edit was kept; rewrite the file (same content is fine) to re-sync the deck and inspect it again if needed.</system_reminder>"
    }
  };
}
function extractRepairedHTML(value) {
  const fenced = value.match(/```(?:html)?\s*([\s\S]*?)```/i)?.[1];
  const source = (fenced ?? value).trim();
  const start = source.search(/<!doctype\s+html|<html\b/i);
  const html = start >= 0 ? source.slice(start).trim() : source;
  if (!html || !/class=["'][^"']*\bslide-container\b/i.test(html))
    return;
  return html;
}
function withTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("measure_timeout")), timeoutMs);
    timer.unref?.();
    promise.then((value) => {
      clearTimeout(timer);
      resolve(value);
    }, (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}
function projectAfterFileEdit(project, relativePath, content) {
  const isHTML = /\.html?$/i.test(relativePath);
  const normalizedContent = isHTML ? repairHTMLSnapshot(content) : content;
  const slideID = path11.basename(relativePath, path11.extname(relativePath));
  const updatedAt = new Date().toISOString();
  return {
    ...project,
    activeFile: relativePath,
    files: mergeFiles(project.files, [{
      path: relativePath,
      mimeType: mimeTypeForPath(relativePath),
      title: relativePath,
      content: normalizedContent
    }]),
    viewState: {
      ...project.viewState,
      outline: outlineOfProject(project).map((entry) => String(entry.id) === slideID ? { ...entry, state: SLIDE_STATE_EDITED } : entry)
    },
    updatedAt
  };
}
function repeatedImageIssues(store, project, relativePath, content) {
  try {
    if (hasTemplate(templateOfProject(project)?.id))
      return [];
    const generatedDir = path11.join(project.projectDir, "assets", "generated") + path11.sep;
    const assets = assetMapFromViewState(project.viewState);
    const identity = (absolutePath) => assets[absolutePath]?.sha256 ?? absolutePath;
    const extension = path11.extname(relativePath);
    const pagesByImage = new Map;
    for (const slideID of slideIdsOfProject(project)) {
      const slidePath = `${slideID}${extension}`;
      if (slidePath === relativePath)
        continue;
      const other = store.readProjectFile(project, slidePath)?.content;
      if (!other)
        continue;
      for (const ref of extractLocalResourceRefs(other, slidePath, project.projectDir)) {
        const key = identity(ref.absolutePath);
        pagesByImage.set(key, (pagesByImage.get(key) ?? new Set).add(slideID));
      }
    }
    const ownImages = new Set(extractLocalResourceRefs(content, relativePath, project.projectDir).map((ref) => ref.absolutePath).filter((absolutePath) => !absolutePath.startsWith(generatedDir)));
    return [...ownImages].flatMap((absolutePath) => {
      const pages = [...pagesByImage.get(identity(absolutePath)) ?? []];
      if (pages.length < 2)
        return [];
      return [
        `\`${absolutePath}\` is already shown on ${pages.join(", ")}. Show an image that was not generated for ` + "this deck on one or two slides only: for this slide, generate a new scene with it in `references` of " + "slides/generate_fast_cheap_image, or use another image. Ignore this for a logo or small mark, or when " + "the user asked for this image on these slides."
      ];
    });
  } catch {
    return [];
  }
}
function rebaseFileEdit(relativePath, content, edited) {
  return (latest) => {
    const slideID = path11.basename(relativePath, path11.extname(relativePath));
    if (relativePath !== PPTX_DESIGN_FILE && !slideIdsOfProject(latest).includes(slideID))
      return;
    const rebased = projectAfterFileEdit(latest, relativePath, content);
    const assets = assetMapFromViewState(edited.viewState);
    if (Object.keys(assets).length === 0)
      return rebased;
    return {
      ...rebased,
      viewState: {
        ...rebased.viewState,
        assets: { ...assetMapFromViewState(rebased.viewState), ...assets }
      }
    };
  };
}
function slideRemovedIssue(relativePath) {
  return `\`${relativePath}\` is no longer a slide in this deck (it was deleted while this edit was being saved), ` + "so the edit was not synced. If the slide should still exist, add it back to the deck before editing it again.";
}

// mcp/image/imageGeneration.ts
import { execFile } from "node:child_process";
import fs6 from "node:fs";
import os3 from "node:os";
import path12 from "node:path";
import { promisify } from "node:util";
var execFileAsync = promisify(execFile);
var generatedImageDownloadTimeoutMs = 60000;
var webpEncodeQuality = 82;
var webpEncodeTimeoutMs = 30000;
function isImageModeProject(project) {
  return project.viewState?.generate_mode === "image" || project.viewState?.isImageSlides === true;
}
function requireImageMode(project) {
  if (!isImageModeProject(project)) {
    const kind = isPptxModeProject(project) ? "a PPTX deck" : "an HTML deck";
    throw new Error(`Deck "${project.id}" is ${kind}. slides/generate_image_slide only works for a deck initialized with generate_mode="image".`);
  }
}
function requireHTMLMode(project) {
  if (isImageModeProject(project)) {
    throw new Error(`Deck "${project.id}" is an image deck. Use slides/generate_image_slide instead of slides/edit_slide.`);
  }
  if (isPptxModeProject(project)) {
    throw new Error(`Deck "${project.id}" is a PPTX deck. Do not use slides/edit_slide — write the complete manus-pptx XML ` + "directly to the registered `<slide_id>.xml` file with the native file tool (see the skill's pptx-xml-syntax.md).");
  }
}
var INSUFFICIENT_CREDITS_MARKER = "[INSUFFICIENT_CREDITS]";
var confirmedInsufficientCreditsPattern = /host_image_insufficient_credits/;
var suspectedThrottleOrCreditPattern = /host_image_http_429|HTTP 429\b/;
function toImageGenerationError(error) {
  const message = String(error instanceof Error ? error.message : error);
  if (confirmedInsufficientCreditsPattern.test(message)) {
    return new Error(`${INSUFFICIENT_CREDITS_MARKER} Image generation stopped: the user has run out of credits. ` + "Do NOT retry this call and do NOT generate the remaining slides. " + "Stop and tell the user they need more credits to continue this deck.");
  }
  if (suspectedThrottleOrCreditPattern.test(message)) {
    const upstream = message.replaceAll(INSUFFICIENT_CREDITS_MARKER, "[marker-redacted]").slice(0, 400);
    return new Error("Image generation was rejected (rate limited or out of credits). Do NOT retry immediately. " + "If this keeps happening, stop generating the remaining slides and ask the user to check their " + `credit balance. (upstream error: ${upstream})`);
  }
  return error instanceof Error ? error : new Error(message);
}
function buildSlideImageGenerationPrompt(contentPrompt, styleRequest) {
  const visualDirection = String(styleRequest ?? "").trim() || "Professional and clean";
  return `Create a professional presentation slide with the following content:

${contentPrompt}

Hierarchy & Layout Guidance:
- Lead with the most important narrative element (headline / metric) and follow with supporting copy in clear sections
- Any charts should reflect real data provided in the content prompt and stay faithful to the described sources
- Arrange imagery and copy so the viewer can scan left-to-right or top-to-bottom; avoid vertical stacking of charts/images

Visual Direction:
- ${visualDirection}
- Follow the style of the previous slide image (if provided) for visual continuity

Requirements:
- Professional presentation layout with clear visual hierarchy
- Text must be clearly readable with appropriate contrast against the background
- Include title area and content area as appropriate
- Maintain consistent style suitable for a professional presentation
- High quality, publication-ready visual design
- All text should be sharp and legible
- Keep all essential text comfortably inside the frame; avoid placing text at the very edges
- Balance visual elements with whitespace so the slide feels clean and not cluttered`;
}
function createSlideImageHTML(imageURL, contentFingerprint2) {
  const escapedURL = escapeAttribute(imageURL);
  const safeFingerprint = contentFingerprint2.replace(/[^A-Za-z0-9:._-]/g, "");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1280, height=720">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1280px; height: 720px; overflow: hidden; }
    .slide-container { width: 1280px; height: 720px; }
    .slide-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  </style>
</head>
<body>
  <div class="slide-container">
    <!-- generated image content: ${safeFingerprint} -->
    <img src="${escapedURL}" alt="Generated Slide" />
  </div>
</body>
</html>`;
}
async function transcodeGeneratedImageToWebp(image, options = {}) {
  if (image.contentType === "image/webp") {
    return image;
  }
  const run = options.execFileImpl ?? execFileAsync;
  const workDir = fs6.mkdtempSync(path12.join(os3.tmpdir(), "slide-webp-"));
  const sourcePath = path12.join(workDir, `source.${image.extension}`);
  const targetPath = path12.join(workDir, "target.webp");
  try {
    fs6.writeFileSync(sourcePath, image.content);
    await run("vips", ["copy", sourcePath, `${targetPath}[Q=${webpEncodeQuality},strip]`], {
      timeout: webpEncodeTimeoutMs
    });
    const encoded = fs6.readFileSync(targetPath);
    if (encoded.length <= 0 || encoded.length >= image.content.length) {
      return image;
    }
    return { content: new Uint8Array(encoded), contentType: "image/webp", extension: "webp" };
  } catch {
    return image;
  } finally {
    fs6.rmSync(workDir, { recursive: true, force: true });
  }
}
async function downloadGeneratedImage(imageURL) {
  const response = await fetch(imageURL, { signal: AbortSignal.timeout(generatedImageDownloadTimeoutMs) });
  if (!response.ok) {
    await response.body?.cancel().catch(() => {
      return;
    });
    throw new Error(`Generated image download failed: HTTP ${response.status}.`);
  }
  const declaredSize = Number(response.headers.get("content-length") ?? 0);
  if (declaredSize > maxTransferredFileSize) {
    await response.body?.cancel().catch(() => {
      return;
    });
    throw new Error(`Generated image exceeds the ${maxTransferredFileSize}-byte download limit.`);
  }
  const content = await readBodyWithLimit(response, maxTransferredFileSize);
  if (content.length <= 0) {
    throw new Error(`Generated image size must be between 1 and ${maxTransferredFileSize} bytes.`);
  }
  const detected = detectRasterImage(content);
  if (!detected) {
    throw new Error("Host returned an unsupported generated image. Expected PNG, JPEG, or WebP.");
  }
  return { ...detected, content };
}
async function readBodyWithLimit(response, limit) {
  const reader = response.body?.getReader();
  if (!reader) {
    const content2 = new Uint8Array(await response.arrayBuffer());
    if (content2.length > limit) {
      throw new Error(`Generated image exceeds the ${limit}-byte download limit.`);
    }
    return content2;
  }
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done)
      break;
    total += value.length;
    if (total > limit) {
      await reader.cancel().catch(() => {
        return;
      });
      throw new Error(`Generated image exceeds the ${limit}-byte download limit.`);
    }
    chunks.push(value);
  }
  const content = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    content.set(chunk, offset);
    offset += chunk.length;
  }
  return content;
}
function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// mcp/tools/sharedResults.ts
function createSlidesResourceResult(project, registration, mode, options = {}) {
  const resourceDescriptor = registration.resource;
  const deckBaseResourceURI = withoutURIVersionParam(resourceDescriptor?.baseResourceUri ?? resourceDescriptor?.base_resource_uri ?? project.resourceUri ?? registration.resource_uri ?? resourceURI(project.id, project.title));
  const deliveryResourceURI = withoutURIVersionParam(registration.resource_uri ?? resourceDescriptor?.resourceUri ?? deckBaseResourceURI);
  const deliveryWidgetURI = withoutURIVersionParam(registration.widget_uri ?? project.widgetUri ?? widgetURI(project.id, project.title));
  const versionId = versionIDFromPayload(registration) ?? project.versionId;
  const versionedResourceURI = resourceDescriptor?.versionedResourceUri ?? resourceDescriptor?.versioned_resource_uri ?? registration.version?.resource_uri ?? registration.version?.versioned_resource_uri ?? (versionId ? withURIQueryParam(deckBaseResourceURI, "v", versionId) : deliveryResourceURI);
  const deliveryResourceDescriptor = resourceDescriptor ? {
    ...resourceDescriptor,
    resourceUri: deliveryResourceURI,
    baseResourceUri: deckBaseResourceURI,
    versionedResourceUri: versionedResourceURI,
    chatCard: { ...resourceDescriptor.chatCard ?? {}, widgetId: CHAT_CARD_WIDGET_ID },
    viewer: {
      ...resourceDescriptor.viewer ?? {},
      widgetId: WIDGET_ID,
      widgetUri: deliveryWidgetURI
    }
  } : undefined;
  const resultText = createSlidesResultText(project, deliveryResourceURI, mode) + (options.extraText ? `

${options.extraText}` : "");
  const legacySlides = mode === "presented" ? normalizeLegacySlidesForEnvelope(registration.legacy_slides) : undefined;
  const deliveryResource = deliveryResourceDescriptor ?? {
    schema: "manus.addon.resource/v1",
    addonId: ADDON_ID,
    resourceKey: RESOURCE_KEY,
    resourceId: project.id,
    resourceUri: deliveryResourceURI,
    baseResourceUri: deckBaseResourceURI,
    versionedResourceUri: versionedResourceURI,
    title: project.title,
    contentKind: "slides",
    chatCard: { widgetId: CHAT_CARD_WIDGET_ID },
    viewer: {
      type: "addon_widget",
      widgetId: WIDGET_ID,
      widgetUri: deliveryWidgetURI
    }
  };
  const baseResult = createAddonResourceToolResult({
    addonId: ADDON_ID,
    version: options.addonVersion,
    resource: deliveryResource,
    widgetUri: deliveryWidgetURI,
    title: project.title,
    modelSummary: {
      project_id: project.id,
      project_dir: project.projectDir,
      active_file: project.activeFile,
      resource_uri: deliveryResourceURI,
      base_resource_uri: deckBaseResourceURI,
      widget_uri: deliveryWidgetURI,
      base_widget_uri: deliveryWidgetURI,
      version_id: versionId,
      cover_image_url: project.coverImageUrl
    },
    effects: [
      ...isImageModeProject(project) ? [] : [createFileEditHookEffect(project, deckBaseResourceURI)],
      createUserChatHookEffect(project, deckBaseResourceURI)
    ],
    text: resultText
  });
  const content = [
    ...resultText ? [{ type: "text", text: resultText }] : [],
    ...mode === "presented" ? [
      {
        type: "resource_link",
        uri: deliveryResourceURI,
        name: project.title,
        title: project.title,
        annotations: { audience: ["user"] }
      }
    ] : []
  ];
  const widgets = mode === "presented" ? [
    {
      widgetUri: deliveryWidgetURI,
      resourceUri: deliveryResourceURI,
      mode: "show",
      ...options.addonVersion ? { version: options.addonVersion } : {}
    }
  ] : [];
  const addonResult = {
    ...baseResult.structuredContent.addon_result,
    ...legacySlides ? {
      attachments: [
        {
          type: "addon_resource",
          resourceUri: deliveryResourceURI,
          title: project.title,
          contentKind: deliveryResource.contentKind,
          icon: deliveryResource.icon,
          viewer: deliveryResource.viewer,
          legacySlides
        }
      ]
    } : {},
    widgets
  };
  return {
    ...baseResult,
    content,
    structuredContent: {
      ...baseResult.structuredContent,
      addon_result: addonResult
    },
    _meta: {
      ...baseResult._meta,
      [MANUS_ADDON_RESULT_SCHEMA]: addonResult
    }
  };
}
function normalizeLegacySlidesForEnvelope(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return;
  }
  const record = input;
  const manifestUrl = record.manifest_url ?? record.manifestUrl;
  if (typeof manifestUrl !== "string" || !manifestUrl) {
    return;
  }
  return {
    manifestUrl,
    title: typeof record.title === "string" ? record.title : "",
    directory: typeof record.directory === "string" ? record.directory : "",
    outline: Array.isArray(record.outline) ? record.outline : [],
    isImageSlides: (record.is_image_slides ?? record.isImageSlides) === true,
    isPptx: (record.is_pptx ?? record.isPptx) === true
  };
}
function renderOutlineTree(project) {
  const byId = new Map(outlineOfProject(project).map((entry) => [String(entry.id), entry]));
  const notesById = notesBySlideId(project);
  const slideIds = slideIdsOfProject(project);
  const extension = slidePageExtension(project);
  if (!slideIds.length)
    return "(empty deck)";
  return slideIds.map((id, index) => {
    const entry = byId.get(id);
    const state = entry?.state === SLIDE_STATE_EDITED ? "edited" : "edit_pending";
    const noteTag = notesById.get(id)?.trim() ? " [note]" : "";
    const title = entry?.title ? ` — ${entry.title}` : "";
    return `  ${index + 1}. ${id}.${extension} [${state}]${noteTag}${title}`;
  }).join(`
`);
}
function notesBySlideId(project) {
  const notes = new Map;
  const filesByPath = new Map((project.files ?? []).map((file2) => [file2.path, file2]));
  for (const id of slideIdsOfProject(project)) {
    const note = filesByPath.get(slidePageFileName(project, id))?.note;
    if (typeof note === "string")
      notes.set(id, note);
  }
  return notes;
}
function renderNotesOverview(project) {
  const byId = new Map(outlineOfProject(project).map((entry) => [String(entry.id), entry]));
  const notesById = notesBySlideId(project);
  const slideIds = slideIdsOfProject(project);
  if (!slideIds.length)
    return "(empty deck)";
  return slideIds.map((id, index) => {
    const entryTitle = byId.get(id)?.title;
    const title = entryTitle ? ` — ${entryTitle}` : "";
    const note = notesById.get(id)?.trim();
    return `  ${index + 1}. ${id}${title}
     ${note ? note.replace(/\n/g, `
     `) : "(no note)"}`;
  }).join(`
`);
}
function createUserChatHookEffect(project, resourceUri) {
  return {
    type: "agent_hook_register",
    hook: USER_CHAT_SYNC_HOOK_ID,
    resourceUri,
    projectDir: project.projectDir
  };
}
function createFileEditHookEffect(project, resourceUri) {
  return {
    type: "agent_hook_register",
    trigger: "host_file_edit_completed",
    resourceUri,
    projectDir: project.projectDir,
    paths: isPptxModeProject(project) ? ["*.xml"] : ["*.html"],
    handler: {
      mcpServer: SLIDES_MCP_SERVER_ID,
      tool: INSPECT_AFTER_FILE_EDIT_TOOL
    },
    resumeHandler: {
      mcpServer: SLIDES_MCP_SERVER_ID,
      tool: APPLY_FILE_EDIT_HOOK_RESULT_TOOL
    },
    pendingTimeoutMs: 240000
  };
}
function createSlidesResultText(project, projectResourceURI, mode) {
  return mode === "presented" ? presentedResultText(project, projectResourceURI) : authoringResultText(project, mode);
}
function presentedResultText(project, projectResourceURI) {
  const slideCount = slideIdsOfProject(project).length;
  return `Presented Slides deck "${project.title}" (project_id=${project.id}; ${slideCount} slide(s), all edited).

DELIVERY CONTRACT (required): your final message MUST link this deck as a markdown link so legacy clients receive the Slides attachment. Use exactly this form (resource_uri as the href), never paste the bare URI as plain text:
[${project.title}](${projectResourceURI})`;
}
function authoringResultText(project, mode) {
  const verb = mode === "attached" ? "Attached" : "Created";
  const next = nextPendingSlide(project);
  const nextTitle = next?.title ? ` (${next.title})` : "";
  const nextStep = next ? `Next edit_pending slide: "${next.id}.${slidePageExtension(project)}"${nextTitle}. ${authoringModeText(project)}` : `All slides are already edited — call slides/present with project_id="${project.id}" to deliver the deck.`;
  const deckTreeBlock = mode === "attached" ? `Slides:
${renderOutlineTree(project)}

` : "";
  return `${verb} Slides deck "${project.title}" with project_id=${project.id} at ${project.projectDir}. Carry this exact project_id in every later organize and present call for this deck.

${deckTreeBlock}${nextStep}`;
}
function authoringModeText(project) {
  if (isPptxModeProject(project)) {
    return "This is a pptx deck: author it by following the skill's pptx-xml-syntax.md.";
  }
  if (isImageModeProject(project)) {
    return "This is an image deck: produce every page with slides/generate_image_slide.";
  }
  return "This is an HTML deck: author it by following the skill's html-syntax.md. " + "Do not write design.xml or `<id>.xml`.";
}
function withURIQueryParam(uri2, key, value) {
  const parsed = new URL(uri2);
  parsed.searchParams.set(key, String(value));
  return parsed.toString();
}

// mcp/tools/attachSlides.ts
var attachSlidesTool = {
  definition: {
    name: "attach_slides",
    description: "Materialize an existing Slides resource in this runtime and return the project_id required by later deck " + "operations. Attaching one deck does not replace or select any other deck in the session.",
    inputSchema: {
      type: "object",
      properties: {
        resource_uri: { type: "string", description: "Stable manus-resource:// URI for a Slides deck." }
      },
      required: ["resource_uri"]
    }
  },
  async execute({ store, sync, client }, args) {
    const inputResourceURI = String(args?.resource_uri ?? args?.resourceUri ?? "").trim();
    if (!inputResourceURI)
      throw new Error("resource_uri is required");
    const parsed = parseSlidesResourceURI(inputResourceURI);
    const readPayload = await sync.readRemote(parsed.projectId);
    const sourceProject = readPayload?.renderData?.project;
    if (!sourceProject?.id || !Array.isArray(sourceProject.files)) {
      throw new Error("Addon Server did not return a materializable Slides project");
    }
    const title = safeTitle(sourceProject.title ?? readPayload?.resource?.title ?? parsed.title);
    const project = withDerivedOutlineStates({
      id: String(sourceProject.id),
      title,
      resourceUri: withoutURIVersionParam(readPayload.resource_uri ?? readPayload.resource?.resourceUri ?? inputResourceURI),
      widgetUri: withoutURIVersionParam(readPayload.widget_uri ?? readPayload.resource?.viewer?.widgetUri ?? widgetURI(sourceProject.id, title)),
      versionId: versionIDFromPayload(readPayload),
      coverImageUrl: readPayload.resource?.coverImage?.url ?? readPayload.resource?.coverImageUrl,
      projectDir: store.projectDirectory(String(sourceProject.id)),
      activeFile: String(sourceProject.activeFile || `${STARTER_SLIDE_ID}.html`),
      files: normalizeProjectFiles(sourceProject.files),
      scaffolds: Array.isArray(sourceProject.scaffolds) ? sourceProject.scaffolds.map(String) : [],
      viewState: sourceProject.viewState ?? { mode: "preview", zoom: 1 },
      createdAt: sourceProject.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    store.writeProjectFiles(project);
    store.cache(project);
    const boundTemplate = templateOfProject(project);
    let templateAppendText = "";
    if (boundTemplate) {
      await fetchTemplateDetail(client, boundTemplate.id).then(async (detail) => {
        const materialized = await materializeTemplateAssets(store, project, detail);
        templateAppendText = imageTemplateReferenceText(detail, materialized.referenceImagePath);
      }).catch((error) => {
        console.warn(`Slides attach: template assets for "${boundTemplate.id}" could not be re-materialized on project ${project.id}:`, error instanceof Error ? error.message : error);
      });
    }
    const backfill = backfillProjectAssets(assetMapFromViewState(project.viewState), assetUrlsFromPayload(readPayload?.assetUrls, client.endpoint)).catch(() => {
      return;
    });
    await Promise.race([sync.trackBackground(backfill), budgetElapsed(ATTACH_BACKFILL_BUDGET_MS)]);
    sync.seedFromAttach(project, versionIDFromPayload(readPayload));
    const registration = {
      ok: true,
      addon_id: "manus-slides",
      resource_uri: project.resourceUri,
      widget_uri: project.widgetUri,
      resource: readPayload.resource,
      descriptor: readPayload.descriptor,
      renderData: readPayload.renderData,
      version: readPayload.version
    };
    const hasNotes = Array.from(notesBySlideId(project).values()).some((note) => note.trim());
    const extraText = [
      templateAppendText,
      hasNotes ? `Current speaker notes:
${renderNotesOverview(project)}` : ""
    ].filter(Boolean).join(`

`);
    return createSlidesResourceResult(project, registration, "attached", {
      addonVersion: client?.addonVersion?.(),
      ...extraText ? { extraText } : {}
    });
  }
};
var ATTACH_BACKFILL_BUDGET_MS = 60000;
function budgetElapsed(ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    timer.unref?.();
  });
}

// mcp/tools/captureScreenshot.ts
import path13 from "node:path";
var captureScreenshotTool = {
  visible: false,
  definition: {
    name: "capture_screenshot",
    description: "Capture an HTML-mode Slides deck identified by required project_id with the host browser for visual QA. " + "Image-mode decks intentionally skip this QA step and must be presented directly after generation.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          minLength: 1,
          description: "Required exact deck id returned by slides/init_slides or slides/attach_slides."
        },
        file_path: { type: "string", description: "Project-relative HTML file path. Defaults to this deck's active file." },
        slide_number: { type: "number", description: "1-based slide number for a clean deck capture." },
        width: { type: "number", description: "Viewport width." },
        height: { type: "number", description: "Viewport height." },
        full_page: { type: "boolean", description: "Capture the full page. Defaults to true." },
        delay_ms: { type: "number", description: "Delay before capture in milliseconds." }
      },
      required: ["project_id"]
    }
  },
  async execute(context, args) {
    const { store, sync } = context;
    const project = store.requireProject(args);
    if (isImageModeProject(project)) {
      throw new Error(`Image deck "${project.id}" skips screenshot QA. Generate every page, then call slides/present directly.`);
    }
    if (isPptxModeProject(project)) {
      throw new Error(`PPTX deck "${project.id}" does not support slides/capture_screenshot. Author every page as manus-pptx XML ` + "and call slides/present — its validation gate is the delivery confidence check for pptx decks.");
    }
    const slideNumber = optionalPositiveInteger(args?.slide_number ?? args?.slideNumber, "slide_number");
    const fileFromSlideNumber = slideNumber ? slidePathForNumber(project, slideNumber) : undefined;
    if (slideNumber && !fileFromSlideNumber) {
      throw new Error(`slide_number ${slideNumber} is out of range: the deck has ${slideIdsOfProject(project).length} slide(s). ` + "Capture an existing slide number, or add the slide first before screenshotting it.");
    }
    const relativePath = safeProjectRelativePath(args?.file_path ?? args?.filePath ?? fileFromSlideNumber, project.activeFile || "cover.html");
    if (!/\.html?$/i.test(relativePath))
      throw new Error("slides/capture_screenshot requires an HTML file");
    if (!store.contentFileExists(project, relativePath)) {
      throw new Error(`Screenshot target does not exist: ${path13.join(project.projectDir, relativePath)}`);
    }
    const result = await captureHTMLScreenshot({
      htmlPath: path13.join(project.projectDir, relativePath),
      screenshotDir: path13.join(project.projectDir, "screenshots"),
      width: args?.width,
      height: args?.height,
      fullPage: args?.full_page ?? args?.fullPage,
      delayMs: args?.delay_ms ?? args?.delayMs
    });
    const coverImage = {
      data: result.imageBase64,
      mimeType: "image/png",
      fileName: path13.basename(result.screenshotPath),
      slideNumber: result.deck?.activeSlideNumber ?? slideNumber ?? 1,
      width: result.capture.width,
      height: result.capture.height
    };
    let coverUpdate;
    const file2 = store.readProjectFile(project, relativePath);
    if (file2) {
      project.files = mergeFiles(project.files, [file2]);
      project.activeFile = file2.path;
      project.updatedAt = new Date().toISOString();
      store.cache(project);
      store.writeProjectConfig(project);
      try {
        const payload = await sync.submitVersion(project, file2, coverImage);
        coverUpdate = {
          ok: true,
          coverImageUrl: payload?.resource?.coverImage?.url ?? payload?.resource?.coverImageUrl ?? project.coverImageUrl,
          versionId: versionIDFromPayload(payload) ?? project.versionId
        };
      } catch (error) {
        coverUpdate = { ok: false, error: String(error instanceof Error ? error.message : error) };
      }
    }
    return createScreenshotResult({ project, result, coverUpdate });
  }
};
function createScreenshotResult(input) {
  const { project, result, coverUpdate } = input;
  return {
    content: [
      {
        type: "text",
        text: [
          `Deck project_id: ${project.id}`,
          `Captured screenshot for ${result.htmlPath}`,
          `Screenshot file: ${result.screenshotPath}`,
          `Viewport: ${result.viewport.width}x${result.viewport.height}`,
          `Document: ${result.document.width}x${result.document.height}`,
          `Captured: ${result.capture.width}x${result.capture.height}${result.truncated ? " (height capped)" : ""}`,
          result.deck ? `Deck slide: ${result.deck.activeSlideNumber} / ${result.deck.totalSlides}${result.deck.cleanCapture ? " (clean capture)" : ""}` : "",
          coverUpdate?.coverImageUrl ? `Cover image: ${coverUpdate.coverImageUrl}` : "",
          coverUpdate?.error ? `Cover image update failed: ${coverUpdate.error}` : ""
        ].filter(Boolean).join(`
`)
      },
      {
        type: "image",
        data: result.imageBase64,
        mimeType: "image/png",
        name: path13.basename(result.screenshotPath),
        uri: result.screenshotPath
      }
    ],
    structuredContent: {
      project_id: project.id,
      resource_uri: project.resourceUri,
      html_path: result.htmlPath,
      screenshot_path: result.screenshotPath,
      viewport: result.viewport,
      document: result.document,
      capture: result.capture,
      truncated: result.truncated,
      deck: result.deck,
      cover_image_url: coverUpdate?.coverImageUrl,
      cover_update: coverUpdate
    }
  };
}

// mcp/tools/editSlide.ts
var editSlideTool = {
  visible: false,
  definition: {
    name: "edit_slide",
    description: "Write the complete self-contained HTML for one slide in the deck identified by required project_id and mark it edited. The widget updates live. Follow the HTML authoring rules in the slides skill.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          minLength: 1,
          description: "Required exact deck id returned by slides/init_slides or slides/attach_slides."
        },
        slide_id: { type: "string", pattern: "^[a-z0-9_]+$", description: "Target slide id. Provide this OR slide_number." },
        slide_number: {
          type: "integer",
          minimum: 1,
          description: "1-based slide number in deck order. Provide this OR slide_id."
        },
        content_thinking: {
          type: "string",
          minLength: 1,
          description: "Detailed reasoning covering design approach, deck continuity, layout, key content, canvas-fit checks, and technical constraints."
        },
        text_html_code: { type: "string", minLength: 1, description: "The complete self-contained slide HTML document." }
      },
      required: ["project_id", "content_thinking", "text_html_code"],
      anyOf: [{ required: ["slide_id"] }, { required: ["slide_number"] }]
    }
  },
  async execute({ store, sync }, args) {
    const project = store.requireProject(args);
    requireHTMLMode(project);
    const contentThinking = String(args?.content_thinking ?? args?.contentThinking ?? "").trim();
    if (!contentThinking) {
      throw new Error("content_thinking is required: state your design reasoning before writing the slide HTML.");
    }
    const html = args?.text_html_code ?? args?.textHtmlCode ?? args?.html;
    if (typeof html !== "string" || !html.trim()) {
      throw new Error("text_html_code is required: provide the full self-contained slide HTML.");
    }
    const slideId = resolveSlideId(project, args);
    if (!slideId) {
      throw new Error(`Unknown slide. The deck has ${slideIdsOfProject(project).length} slide(s): ` + `${slideIdsOfProject(project).join(", ") || "(none)"}. ` + "Pass an existing slide_id or 1-based slide_number, or add the slide first with slides/organize_slides.");
    }
    const relativePath = `${slideId}.html`;
    store.writeContentFile(project, relativePath, html);
    project.files = mergeFiles(project.files, [
      {
        path: relativePath,
        mimeType: "text/html",
        title: relativePath,
        content: repairHTMLSnapshot(html)
      }
    ]);
    project.activeFile = relativePath;
    project.viewState = {
      ...project.viewState,
      outline: outlineOfProject(project).map((entry) => String(entry.id) === slideId ? { ...entry, state: SLIDE_STATE_EDITED } : entry)
    };
    await sync.push(project);
    return createEditSlideResult(project, slideId);
  }
};
function createEditSlideResult(project, slideId) {
  const next = nextPendingSlide(project);
  const outline = outlineOfProject(project);
  const text = next ? `Edited slide "${slideId}.html". Next, edit the still-pending slide "${next.id}.html"` + `${next.title ? ` (${next.title})` : ""} with slides/edit_slide and project_id="${project.id}".

` + `Deck project_id: ${project.id}
Deck:
${renderOutlineTree(project)}` : `Edited slide "${slideId}.html". All slides are edited — call slides/present with project_id="${project.id}" to QA-gate and deliver the deck.

Deck project_id: ${project.id}
Deck:
${renderOutlineTree(project)}`;
  return {
    content: [{ type: "text", text }],
    structuredContent: {
      project_id: project.id,
      slide_id: slideId,
      state: SLIDE_STATE_EDITED,
      next_pending: next?.id,
      slide_ids: slideIdsOfProject(project),
      outline
    }
  };
}

// mcp/tools/exportSlides.ts
import fs7 from "node:fs/promises";
import path14 from "node:path";
var EXPORT_DOWNLOAD_TIMEOUT_MS = 120000;
var exportSlidesTool = {
  definition: {
    name: "export",
    description: "Call ONLY when the user has explicitly asked in this task for a downloadable PDF/PPTX file that has not been " + "delivered yet, including a request made before clarifying questions or an interruption. " + 'generate_mode "pptx", a Slides scene parameter such as {"mode":"pptx"}, or a file exported in an earlier turn ' + "is NOT such a request; by default deliver only the manus-resource:// link from slides/present. " + "Exports the deck identified by required project_id to PDF or PPTX; saves the file in the configured Slides project root and " + "returns its absolute path. Exports the current version unless version_id is given. If the result is " + '"in_progress", conversion continues server-side — retry the same call after ~30s (resumes from cache).',
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          minLength: 1,
          description: "Required exact deck id returned by slides/init_slides or slides/attach_slides."
        },
        format: {
          type: "string",
          enum: ["pdf", "pptx"],
          description: "Target export format."
        },
        version_id: {
          type: "string",
          description: "Optional historical version id. Defaults to the current version."
        },
        output_dir: {
          type: "string",
          description: "Optional absolute output directory under the Slides project root. Defaults to that root."
        }
      },
      required: ["project_id", "format"]
    }
  },
  async execute({ store, client }, args) {
    const project = store.requireProject(args);
    const format = normalizeFormat(args?.format);
    const versionId = optionalString(args?.version_id ?? args?.versionId);
    const outputDir = resolveOutputDir(args?.output_dir ?? args?.outputDir, store.projectRoot);
    let payload;
    try {
      payload = await client.exportDeck({ projectId: project.id, format, ...versionId ? { versionId } : {} });
    } catch (error) {
      throw translateExportError(error);
    }
    if (payload?.status === "converting") {
      return {
        content: [
          {
            type: "text",
            text: "Still converting server-side — retry the same slides/export call in ~30s (resumes from cache, does not restart)."
          }
        ],
        structuredContent: {
          status: "in_progress",
          project_id: project.id,
          format,
          ...versionId ? { version_id: versionId } : {}
        }
      };
    }
    if (payload?.status !== "ready" || !payload?.downloadUrl) {
      throw new Error(`Unexpected export response (status=${String(payload?.status ?? "unknown")}). Retry the same slides/export call.`);
    }
    const fileName = sanitizeFileName(String(payload.fileName ?? ""), `${project.id}.${format}`);
    const filePath = path14.join(outputDir, fileName);
    await fs7.mkdir(outputDir, { recursive: true });
    const response = await fetch(String(payload.downloadUrl), {
      signal: AbortSignal.timeout(EXPORT_DOWNLOAD_TIMEOUT_MS),
      redirect: "follow"
    });
    if (!response.ok) {
      throw new Error(`Download failed (HTTP ${response.status}). Retry the same slides/export call for a fresh link.`);
    }
    await fs7.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
    return {
      content: [{ type: "text", text: `Exported: ${filePath}` }],
      structuredContent: {
        status: "ready",
        project_id: project.id,
        format,
        file_path: filePath,
        file_name: fileName,
        ...payload.versionId ? { version_id: String(payload.versionId) } : {}
      }
    };
  }
};
function translateExportError(error) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("request timed out")) {
    return new Error("Export request timed out but conversion continues server-side. Retry the same slides/export call in ~30s.");
  }
  if (message.includes("returned HTTP 401")) {
    return new Error("Export credentials rotated. Retry the same slides/export call.");
  }
  if (message.includes("returned HTTP 404")) {
    return new Error("Deck not found on the Slides server. Present the deck first, or it may have been deleted.");
  }
  return error;
}
function normalizeFormat(raw) {
  const format = String(raw ?? "").trim().toLowerCase();
  if (format === "ppt" || format === "pptx")
    return "pptx";
  if (format === "pdf")
    return "pdf";
  throw new Error(`Unsupported format "${String(raw ?? "")}"; use "pdf" or "pptx".`);
}
function optionalString(raw) {
  const value = String(raw ?? "").trim();
  return value ? value : undefined;
}
function resolveOutputDir(raw, defaultOutputDir) {
  const projectRoot = path14.resolve(defaultOutputDir);
  const value = String(raw ?? "").trim();
  if (!value)
    return projectRoot;
  if (!path14.isAbsolute(value)) {
    throw new Error(`output_dir must be an absolute path, got "${value}".`);
  }
  const outputDir = path14.resolve(value);
  const relative = path14.relative(projectRoot, outputDir);
  if (relative === ".." || relative.startsWith(`..${path14.sep}`) || path14.isAbsolute(relative)) {
    throw new Error(`output_dir must be inside the Slides project root "${projectRoot}".`);
  }
  return outputDir;
}
function sanitizeFileName(raw, fallback) {
  const base = path14.basename(raw.trim()).replace(/[\s()[\]]+/g, "_");
  return base && base !== "." && base !== ".." ? base : fallback;
}

// mcp/tools/initSlides.ts
var MAX_INLINE_TEMPLATE_REFERENCE_BYTES = 5 * 1024 * 1024;
var initSlidesTool = {
  definition: {
    name: "init_slides",
    description: "Initialize one HTML, image, or PPTX presentation project and open its live Slides widget. Always pass the complete outline " + "before authoring content; unless the user explicitly requested more, use at most 12 slides. Each outline entry " + "registers one edit_pending page (<id>.html, or <id>.xml in pptx mode) to author afterwards. Collect facts and " + "assets before initialization, use real information, and call this tool once per deck. A session may contain " + "multiple independent decks. Use slides/organize_slides with the returned project_id for later structural " + "changes to this deck. If a previous init attempt was interrupted with an indeterminate transport error, first " + "check the current Slides project root for an existing deck directory and reconnect it with slides/attach_slides " + "instead of re-initializing; if attach fails because the Slides service does not know the deck, the interrupted " + "init never registered remotely — re-init then.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", minLength: 1, description: "Main title of the presentation." },
        template_id: {
          type: "string",
          description: "Official template id when the deck should follow a template (call slides/get_template first to plan " + "the outline against its page catalog). Use deck-stage-basic when no template applies."
        },
        deck_topic: {
          type: "string",
          enum: [
            "analysis",
            "client_proposal",
            "education",
            "general",
            "insight_preview",
            "marketing",
            "pitch",
            "report",
            "research_academic"
          ],
          description: "Topic category used to guide the deck tone and layout conventions."
        },
        style_request: {
          type: "string",
          description: "The user's own words about style and imagery, quoted verbatim from the conversation — palette, fonts, " + "mood, references, and which pages should or should not carry images — plus facts the user gave " + "(brand or organization names, official colors). Do not add your own design choices: the design brief " + "derives palette, type and layout itself. Omit it when the user said nothing about style or imagery."
        },
        generate_mode: {
          type: "string",
          enum: ["html", "image", "pptx"],
          description: "Deck authoring mode; always pass it explicitly. Default to pptx, which authors native PowerPoint " + "pages as manus-pptx XML files. Use html only when the user explicitly asks for HTML, an official " + "HTML template requires it, or pptx is not offered; pages of an html deck follow html-syntax.md, never " + "manus-pptx XML. Image mode always uses gpt-image. " + "The mode only selects how pages are authored; pptx mode is not a request for a .pptx file " + "(see slides/export)."
        },
        outline: {
          type: "array",
          description: "Complete ordered outline. One <id>.html slide is registered per entry with state edit_pending; " + "the file itself is written later when the slide is authored.",
          minItems: 1,
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                pattern: "^[a-z0-9_]+$",
                description: "Unique slide id made of lowercase letters, digits, and underscores. Used as the <id>.html filename."
              },
              title: { type: "string", minLength: 1, description: "Title of this slide." },
              summary: {
                type: "string",
                description: "A one- or two-sentence summary of the content that belongs on this slide."
              },
              slide_template_key: {
                type: "string",
                description: "Template page ID this slide should follow (from the slides/get_template page catalog). Required " + "per slide when initializing with an official template; that page's HTML is injected as you " + "author the slide."
              }
            },
            required: ["id", "title", "summary"]
          }
        }
      },
      required: ["title", "outline", "generate_mode"]
    }
  },
  async execute({ store, sync, host, client }, args) {
    const title = safeTitle(args?.title ?? args?.main_title);
    const templateID = String(args?.template_id ?? args?.templateId ?? "deck-stage-basic");
    const outlineInput = Array.isArray(args?.outline) ? args.outline : undefined;
    const id = createProjectID(title);
    const createdAt = new Date().toISOString();
    const projectDir = store.projectDirectory(id);
    const scaffold = store.createProjectScaffold(title, outlineInput);
    const requestedMode = args?.generate_mode ?? args?.generateMode;
    const generateMode = requestedMode === "image" ? "image" : requestedMode === "pptx" ? "pptx" : "html";
    if (generateMode === "pptx") {
      const invalidIds = scaffold.slideIds.filter((slideID) => PPTX_RESERVED_SLIDE_IDS.includes(slideID));
      if (invalidIds.length) {
        throw new Error(`Invalid slide id(s): ${invalidIds.join(", ")}. The id "design" is reserved and cannot be used as a slide id.`);
      }
    }
    const template = hasTemplate(templateID) ? await fetchTemplateDetailOrExplain(client, templateID) : undefined;
    if (template) {
      requireTemplateModeMatch(template, generateMode);
      requireTemplateOutlineKeys(template, scaffold.outline);
    }
    const pageExtension = generateMode === "pptx" ? "xml" : "html";
    const project = {
      id,
      title,
      templateId: templateID,
      projectDir,
      activeFile: scaffold.slideIds[0] ? `${scaffold.slideIds[0]}.${pageExtension}` : `${STARTER_SLIDE_ID}.${pageExtension}`,
      files: [],
      scaffolds: [],
      viewState: {
        mode: "preview",
        zoom: 1,
        slide_ids: scaffold.slideIds,
        outline: scaffold.outline,
        generate_mode: generateMode,
        ...generateMode === "image" ? { isImageSlides: true, imageSlidesModel: "gpt-image", images: {} } : {},
        ...generateMode === "pptx" ? { isPptxSlides: true } : {},
        ...args?.deck_topic ? { deck_topic: String(args.deck_topic) } : {},
        ...args?.style_request ? { style_request: String(args.style_request) } : {}
      },
      createdAt,
      updatedAt: createdAt
    };
    let templateAppendText = "";
    let templateImageContent;
    if (template) {
      project.viewState = rememberTemplateOnViewState(project.viewState, template);
      let materialized;
      try {
        materialized = await materializeTemplateAssets(store, project, template);
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`Template "${template.templateId}" assets could not be prepared: ${reason}. ` + "Retry slides/init_slides with the same arguments (the deck was not created).");
      }
      templateAppendText = buildInitTemplateText(project, template, materialized.referenceImagePath);
      if (generateMode === "image" && materialized.referenceImagePath) {
        try {
          const referenceImage = readReferenceFile(materialized.referenceImagePath);
          if (referenceImage.sizeBytes > MAX_INLINE_TEMPLATE_REFERENCE_BYTES) {
            throw new Error(`reference image exceeds ${MAX_INLINE_TEMPLATE_REFERENCE_BYTES} inline bytes`);
          }
          templateImageContent = {
            type: "image",
            data: referenceImage.content.toString("base64"),
            mimeType: referenceImage.contentType,
            name: referenceImage.filename,
            uri: referenceImage.absolutePath
          };
        } catch (error) {
          console.warn("Slides init: template reference image could not be inlined:", error instanceof Error ? error.message : error);
        }
      }
    }
    store.writeProjectConfig(project);
    store.cache(project);
    const registration = await sync.register(project);
    const extraText = template ? templateAppendText || undefined : generateMode === "image" ? undefined : await designBriefResultText(store, host, project, scaffold.outline);
    const result = createSlidesResourceResult(project, registration, "created", {
      extraText,
      addonVersion: client?.addonVersion?.()
    });
    return templateImageContent ? { ...result, content: [...result.content, templateImageContent] } : result;
  }
};
async function fetchTemplateDetailOrExplain(client, templateID) {
  try {
    return await fetchTemplateDetail(client, templateID);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Template "${templateID}" could not be loaded: ${reason}. ` + "Verify the id with slides/get_template and retry. Only if the user did NOT explicitly ask for this " + `template, you may initialize without a template using template_id "${NO_TEMPLATE_ID}".`);
  }
}
function requireTemplateModeMatch(template, generateMode) {
  if (template.generateMode === "image" && generateMode !== "image") {
    throw new Error(`Template "${template.templateId}" is an image-style template: call slides/init_slides with ` + 'generate_mode: "image" and the same template_id.');
  }
  if (template.generateMode === "html" && generateMode !== "html") {
    throw new Error(`Template "${template.templateId}" provides HTML template pages: call slides/init_slides with ` + 'generate_mode: "html" and the same template_id.');
  }
}
function buildInitTemplateText(project, template, referenceImagePath) {
  if (template.generateMode === "image") {
    return imageTemplateReferenceText(template, referenceImagePath);
  }
  const outline = Array.isArray(project.viewState.outline) ? project.viewState.outline : [];
  const firstSlide = outline[0];
  if (!firstSlide) {
    return "";
  }
  const html = templatePageHtml(template, firstSlide.slide_template_key);
  return html ? coverTemplateGuidelines(html, project.projectDir) : missingTemplateKeyReminder(firstSlide, template.templateId);
}
var maxInlineBriefChars = 24000;
async function designBriefResultText(store, host, project, outline) {
  let markdown;
  try {
    const response = await host.generateDesignBrief({
      title: project.title,
      generateMode: isPptxModeProject(project) ? "pptx" : "html",
      outline: outline.map((entry) => ({
        id: String(entry.id),
        title: String(entry.title ?? ""),
        summary: String(entry.summary ?? "")
      })),
      ...project.viewState?.deck_topic ? { deckTopic: String(project.viewState.deck_topic) } : {},
      ...project.viewState?.style_request ? { styleRequest: String(project.viewState.style_request) } : {}
    });
    markdown = String(response?.markdown ?? "").trim();
    if (!markdown)
      throw new Error("empty design brief response");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return `Deck design brief generation was unavailable (${reason}). Proceed with the design guidance in the slides skill instead.`;
  }
  let savedCopy = false;
  try {
    store.writeContentFile(project, DESIGN_BRIEF_FILE, `${markdown}
`);
    savedCopy = true;
  } catch (error) {
    console.error("Slides design brief could not be saved to disk", project.id, error);
  }
  const inline = markdown.length > maxInlineBriefChars ? `${markdown.slice(0, maxInlineBriefChars)}

[design brief truncated${savedCopy ? `; the full copy is at ${project.projectDir}/${DESIGN_BRIEF_FILE}` : ""}]` : markdown;
  const savedNote = savedCopy ? ` A copy is saved at ${project.projectDir}/${DESIGN_BRIEF_FILE} — do not read it again, and do not treat it as a slide file.` : "";
  return `A deck-level design brief was generated for this deck. Follow it verbatim when authoring every slide ` + `(palette, typography, per-slide layout patterns, and guardrails).${savedNote}

` + `<design_brief>
${inline}
</design_brief>`;
}

// mcp/tools/generateFastCheapImage.ts
import { createHash as createHash5 } from "node:crypto";

// shared/imageGenerationPolicy.ts
var FORCE_GPT_IMAGE_2 = true;
var LEGACY_IMAGE_SLIDE_POLICY = { model: "gpt-image", quality: "medium" };
var SUNBURST_IMAGE_SLIDE_POLICY = { model: "gpt-image-2.5-sunburst", quality: "medium" };
var SUNBURST_HIGH_IMAGE_SLIDE_POLICY = { model: "gpt-image-2.5-sunburst", quality: "high" };
var NANO_BANANA_FLASH_LITE_IMAGE_POLICY = { model: "nano-banana-2-flash-lite", quality: "1k" };
var FAST_CHEAP_IMAGE_PURPOSE = "fast_cheap_image";
var FAST_CHEAP_IMAGE_POLICY = NANO_BANANA_FLASH_LITE_IMAGE_POLICY;
var FAST_CHEAP_IMAGE_ULTRAWIDE_ASPECT_RATIOS = ["4:1", "1:4"];
var FAST_CHEAP_IMAGE_ASPECT_RATIOS = [
  "16:9",
  "9:16",
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "21:9",
  ...FAST_CHEAP_IMAGE_ULTRAWIDE_ASPECT_RATIOS
];
var DEFAULT_FAST_CHEAP_IMAGE_ASPECT_RATIO = "16:9";
var FAST_CHEAP_IMAGE_ULTRAWIDE_MODELS = new Set([NANO_BANANA_FLASH_LITE_IMAGE_POLICY.model]);
function isFastCheapImageAspectRatio(value) {
  return typeof value === "string" && FAST_CHEAP_IMAGE_ASPECT_RATIOS.includes(value);
}
function hostAspectRatioFor(ratio) {
  return ratio === "16:9" ? "landscape" : ratio;
}
var HOST_SELECTED_IMAGE_SLIDE_POLICIES = [
  LEGACY_IMAGE_SLIDE_POLICY,
  SUNBURST_IMAGE_SLIDE_POLICY,
  SUNBURST_HIGH_IMAGE_SLIDE_POLICY
];
var ALL_HOST_IMAGE_POLICIES = [
  ...new Set([
    ...HOST_SELECTED_IMAGE_SLIDE_POLICIES,
    FAST_CHEAP_IMAGE_POLICY
  ])
];
function resolveImageSlidePolicy(model, quality) {
  if (FORCE_GPT_IMAGE_2)
    return LEGACY_IMAGE_SLIDE_POLICY;
  if (model === undefined && quality === undefined) {
    return LEGACY_IMAGE_SLIDE_POLICY;
  }
  return HOST_SELECTED_IMAGE_SLIDE_POLICIES.find((policy) => policy.model === model && policy.quality === quality);
}

// mcp/tools/generateFastCheapImage.ts
var generatedImageDirectory = "assets/generated";
var maxNameLength = 40;
var fastImageConcurrency = 4;
var maxFastImagesPerCall = fastImageConcurrency;
function imageFileStem(name) {
  const stem = String(name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, maxNameLength).replace(/-+$/g, "");
  return stem || "image";
}
function parseImageRequests(args) {
  const images = args?.images;
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error(`images must be a non-empty list of {prompt, name?, aspect_ratio?, references?}. Batch up to ${maxFastImagesPerCall} images per call, ` + 'e.g. {"project_id": "<deck id>", "images": [{"prompt": "...", "name": "cover-bg"}, ' + '{"prompt": "...", "name": "p03-side-right", "aspect_ratio": "2:3"}]}.');
  }
  if (images.length > maxFastImagesPerCall) {
    throw new Error(`images accepts at most ${maxFastImagesPerCall} items per call; split the rest into another call.`);
  }
  return images.map((image, index) => {
    const prompt = String(image?.prompt ?? "").trim();
    if (!prompt)
      throw new Error(`images[${index}].prompt is required.`);
    const references = image?.references === undefined ? [] : image.references;
    if (!Array.isArray(references) || references.length > maxImageReferenceCount) {
      throw new Error(`images[${index}].references accepts at most ${maxImageReferenceCount} image paths.`);
    }
    const rawRatio = image?.aspect_ratio;
    const aspectRatio = rawRatio === undefined || rawRatio === null || rawRatio === "" ? DEFAULT_FAST_CHEAP_IMAGE_ASPECT_RATIO : String(rawRatio).trim();
    if (!isFastCheapImageAspectRatio(aspectRatio)) {
      throw new Error(`images[${index}].aspect_ratio must be one of ${FAST_CHEAP_IMAGE_ASPECT_RATIOS.join(", ")}; ` + "pick the one closest to the planned frame.");
    }
    return { prompt, name: imageFileStem(image?.name), aspectRatio, references: references.map(String) };
  });
}
async function uploadUniqueReferences(host, requests, workspaceRoot) {
  const urlByPath = new Map;
  for (const referencePath of new Set(requests.flatMap((request) => request.references))) {
    const [url] = await uploadImageReferences(host, [referencePath], workspaceRoot);
    urlByPath.set(referencePath, url);
  }
  return urlByPath;
}
async function generateOne({ store, host }, project, request, referenceUrls) {
  let generated;
  try {
    generated = await host.generateImage({
      prompt: request.prompt,
      referenceUrls,
      aspectRatio: hostAspectRatioFor(request.aspectRatio),
      quality: FAST_CHEAP_IMAGE_POLICY.quality,
      model: FAST_CHEAP_IMAGE_POLICY.model,
      purpose: FAST_CHEAP_IMAGE_PURPOSE
    });
  } catch (error) {
    throw toImageGenerationError(error);
  }
  const imageURL = String(generated?.imageUrl ?? generated?.image_url ?? "");
  const modelUsed = String(generated?.modelUsed ?? generated?.model_used ?? "");
  if (!imageURL) {
    throw new Error("Host returned no image for this item; regenerate only this item.");
  }
  const downloaded = await transcodeGeneratedImageToWebp(await downloadGeneratedImage(imageURL));
  const contentHash = createHash5("sha256").update(downloaded.content).digest("hex").slice(0, 12);
  const relativePath = `${generatedImageDirectory}/${request.name}-${contentHash}.${downloaded.extension}`;
  const absolutePath = store.writeBinaryFile(project, relativePath, downloaded.content);
  return { image_path: absolutePath, image_relative_path: relativePath, model_used: modelUsed };
}
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}
function describeOutcomes(projectId, outcomes) {
  const succeeded = outcomes.filter((outcome) => ("image_path" in outcome)).length;
  const lines = outcomes.map((outcome) => ("image_path" in outcome) ? `${outcome.index + 1}. ${outcome.name} (${outcome.aspect_ratio}): "${outcome.image_path}"` : `${outcome.index + 1}. ${outcome.name} (${outcome.aspect_ratio}): FAILED — ${outcome.error}`);
  return `Generated ${succeeded}/${outcomes.length} images for deck "${projectId}":
${lines.join(`
`)}
` + "Reference each exact absolute path in its page file (HTML <img src> or CSS background; pptx <image src> " + 'or <background type="image" src>). Place each image in the frame it was planned for, keeping the frame ' + "within 10% of the image's aspect ratio on one side so cover fit crops almost nothing. Use each image in " + "exactly one frame. Before writing a page whose layout is marked (overlay) in Image frames, `read` its image " + "and set the text block on the image's calm side — mirror the text box there rather than regenerate.";
}
var generateFastCheapImageTool = {
  definition: {
    name: "generate_fast_cheap_image",
    description: "FAST & CHEAP image generation for slide visuals. Uses a low-cost, high-speed image model whose quality is " + "good enough for deck imagery: full-bleed backgrounds for cover / section-divider / closing pages, " + "supporting illustrations, themed side images, textures, and decorative art for pptx and HTML decks. " + "Use it for every image the design brief's Slide Map plans (without a Slide Map, for most pages that " + "are not chart/table-dominated or text-packed); do not skip planned images. " + "For deck visuals, prefer this tool over any general-purpose image generation tool — those use premium " + "models that are much slower and more expensive, which slide imagery rarely needs. Batch images via " + `\`images\` (up to ${maxFastImagesPerCall} per call); they are generated concurrently inside the tool, ` + "so always fill each call instead of sending one image at a time; split larger sets into a few full " + "calls. One exception: when the same product, character or mascot appears in several images and the " + "user gave no image of it, generate its first image alone, then pass that file in `references` of " + "every later image of it so it looks identical across pages. Give each image the `aspect_ratio` of the frame it will fill (default 16:9) so it fits without " + "heavy cropping. The image is saved under the deck's " + "assets/generated/ directory and each absolute path is returned in list order — reference those exact " + "paths in the page files. One failed item does not discard the others; regenerate only the failed ones. " + "Not for image-mode decks (their pages come from slides/generate_image_slide). For a product, character " + "or mascot the user gave an image of, pass that image in `references` so the model draws it into the " + "scene: with a reference it keeps the subject's shape, colors and main features across images, though " + "fine engraving or printed text may simplify, so use the user's own image for close-ups and pass it in " + "`references` for every other image of the subject, also when the user asks for an exact match. Not for real " + "people, real products or places the user gave no image of, or charts and data — use the user's own " + "photos or real searched images, and native charts. If a call fails with [INSUFFICIENT_CREDITS], stop " + "generating images.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          minLength: 1,
          description: "Exact pptx or HTML deck id returned by slides/init_slides or slides/attach_slides."
        },
        images: {
          type: "array",
          minItems: 1,
          maxItems: maxFastImagesPerCall,
          description: `The images to generate in this call (1-${maxFastImagesPerCall}), one per planned image frame.`,
          items: {
            type: "object",
            properties: {
              prompt: {
                type: "string",
                minLength: 1,
                description: "What to draw: subject, composition, art style, and palette matching the deck design. Only for an " + "overlay layout (text placed on the image) say where to keep calm space for that text; otherwise " + "keep the subject centred and filling the frame. Ask for no text, letters, or logos in the image — " + "this model is not reliable at rendering text; put all words in the slide itself."
              },
              name: {
                type: "string",
                description: 'Optional short English label used in the saved file name, e.g. "cover-bg" or "team-illustration".'
              },
              aspect_ratio: {
                type: "string",
                enum: [...FAST_CHEAP_IMAGE_ASPECT_RATIOS],
                description: "Optional width:height of the frame this image will fill (default 16:9): copy it from the design " + "brief's Image frames section; without one, pick the listed ratio closest to the planned frame, e.g. " + "2:3 for a full-height side column, 21:9 for a band. 4:1 / 1:4 are accepted only when Image frames lists them."
              },
              references: {
                type: "array",
                minItems: 0,
                maxItems: maxImageReferenceCount,
                description: "Optional 0-2 absolute local PNG, JPEG, or WebP paths used as style or subject references.",
                items: { type: "string", minLength: 1 }
              }
            },
            required: ["prompt"]
          }
        }
      },
      required: ["project_id", "images"]
    }
  },
  async execute(context, args) {
    const project = context.store.requireProject(args);
    if (isImageModeProject(project)) {
      throw new Error(`Deck "${project.id}" is an image deck: every page is a full-slide image from slides/generate_image_slide. ` + "slides/generate_fast_cheap_image only produces visuals for pptx and HTML decks.");
    }
    const requests = parseImageRequests(args);
    const referenceUrlByPath = await uploadUniqueReferences(context.host, requests, context.store.workspaceRoot);
    const outcomes = await mapWithConcurrency(requests, fastImageConcurrency, async (request, index) => {
      try {
        const saved = await generateOne(context, project, request, request.references.map((referencePath) => referenceUrlByPath.get(referencePath)));
        return { index, name: request.name, aspect_ratio: request.aspectRatio, ...saved };
      } catch (error) {
        const message = String(error instanceof Error ? error.message : error);
        return {
          index,
          name: request.name,
          aspect_ratio: request.aspectRatio,
          error: message,
          insufficientCredits: message.includes(INSUFFICIENT_CREDITS_MARKER)
        };
      }
    });
    const text = describeOutcomes(project.id, outcomes);
    if (outcomes.some((outcome) => ("insufficientCredits" in outcome) && outcome.insufficientCredits)) {
      throw new Error(`${INSUFFICIENT_CREDITS_MARKER} Image generation stopped: out of credits.
${text}`);
    }
    if (outcomes.every((outcome) => ("error" in outcome))) {
      throw new Error(text);
    }
    return {
      content: [{ type: "text", text }],
      structuredContent: {
        project_id: project.id,
        images: outcomes.map(({ insufficientCredits: _ignored, ...outcome }) => outcome)
      }
    };
  }
};

// mcp/tools/generateImageSlide.ts
import { createHash as createHash6 } from "node:crypto";
import fs8 from "node:fs";
function assertSlideGeneratable(project, slideId) {
  const outline = outlineOfProject(project);
  const hasAnchor = outline.some((item) => item.state === SLIDE_STATE_EDITED);
  if (!hasAnchor) {
    const first = nextPendingSlide(project);
    if (first && first.id !== slideId) {
      throw new Error(`Generate the style anchor "${first.id}.html" first and wait for it to succeed. ` + "After the first slide exists, generate the remaining slides in parallel with its image as reference.");
    }
  }
}
function anchorReferencePaths(project) {
  const outline = new Map(outlineOfProject(project).map((item) => [String(item.id), item]));
  const images = project.viewState?.images && typeof project.viewState.images === "object" ? project.viewState.images : {};
  for (const id of slideIdsOfProject(project)) {
    if (outline.get(id)?.state !== SLIDE_STATE_EDITED)
      continue;
    const imagePath = images[id];
    if (typeof imagePath === "string" && imagePath && fs8.existsSync(imagePath)) {
      return [imagePath];
    }
  }
  return [];
}
var generateImageSlideTool = {
  definition: {
    name: "generate_image_slide",
    description: "Generate one page of an image-mode deck with fixed gpt-image. For a new deck, generate the FIRST page " + "alone and wait for it to succeed — it locks the visual style of the deck (enforced). Then generate the " + "remaining pages by issuing multiple calls of this tool in ONE response (parallel tool calls, at most 10 " + "per response); they run concurrently, out-of-order generation is accepted, and an already generated page " + "may be regenerated. For every page after the first, pass the first generated slide image path in " + "references for visual continuity (when omitted, the tool uses it automatically). References must be 0-2 " + "absolute sandbox PNG/JPEG/WebP paths. The tool uploads references, generates the image, saves it under " + "the deck generated/ directory, updates the 1280x720 slide wrapper and syncs the deck.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          minLength: 1,
          description: "Required exact image deck id returned by slides/init_slides."
        },
        slide_id: { type: "string", pattern: "^[a-z0-9_]+$", description: "Target slide id. Provide this OR slide_number." },
        slide_number: { type: "integer", minimum: 1, description: "1-based slide number. Provide this OR slide_id." },
        content_prompt: {
          type: "string",
          minLength: 1,
          description: "Detailed slide content: title, key points, factual data, visual elements, layout, hierarchy, and continuity note."
        },
        references: {
          type: "array",
          minItems: 0,
          maxItems: maxImageReferenceCount,
          description: "0-2 absolute local paths to PNG, JPEG, or WebP reference images. " + "When empty, defaults to the first generated slide image.",
          items: { type: "string", minLength: 1 }
        }
      },
      required: ["project_id", "content_prompt", "references"],
      anyOf: [{ required: ["slide_id"] }, { required: ["slide_number"] }]
    }
  },
  async execute({ store, sync, host, client }, args) {
    const project = store.requireProject(args);
    requireImageMode(project);
    const slideId = resolveSlideId(project, args);
    if (!slideId) {
      throw new Error(`Unknown slide. The deck has ${slideIdsOfProject(project).length} slide(s): ` + `${slideIdsOfProject(project).join(", ") || "(none)"}.`);
    }
    assertSlideGeneratable(project, slideId);
    const contentPrompt = String(args?.content_prompt ?? args?.contentPrompt ?? "").trim();
    if (!contentPrompt) {
      throw new Error("content_prompt is required for image slide generation.");
    }
    const requestedReferences = Array.isArray(args?.references) ? args.references : [];
    const references = requestedReferences.length > 0 ? requestedReferences : anchorReferencePaths(project);
    const imagePolicy = resolveImageSlidePolicy(args?.model, args?.quality);
    if (!imagePolicy) {
      throw new Error("Unsupported image generation policy.");
    }
    const referenceURLs = await uploadImageReferences(host, references, store.workspaceRoot);
    const prompt = buildSlideImageGenerationPrompt(contentPrompt, project.viewState?.style_request);
    let generated;
    try {
      generated = await host.generateImage({
        prompt,
        referenceUrls: referenceURLs,
        aspectRatio: "landscape",
        quality: imagePolicy.quality,
        model: imagePolicy.model
      });
    } catch (error) {
      throw toImageGenerationError(error);
    }
    const imageURL = String(generated?.imageUrl ?? generated?.image_url ?? "");
    const modelUsed = String(generated?.modelUsed ?? generated?.model_used ?? "");
    if (!imageURL || modelUsed !== imagePolicy.model) {
      throw new Error("Host returned an invalid image generation result.");
    }
    const downloaded = await transcodeGeneratedImageToWebp(await downloadGeneratedImage(imageURL));
    return await sync.runExclusive(project.id, async () => {
      const current = store.requireProject(args);
      const entry = outlineOfProject(current).find((item) => String(item.id) === slideId);
      if (!entry) {
        throw new Error(`Slide "${slideId}" no longer exists in deck "${current.id}". Re-check the outline.`);
      }
      const stagedProject = structuredClone(current);
      const generatedRelativePath = `generated/${slideId}.${downloaded.extension}`;
      const relativePath = `${slideId}.html`;
      const previousGeneratedContent = store.snapshotFile(stagedProject, generatedRelativePath);
      const previousHTMLContent = store.snapshotFile(stagedProject, relativePath);
      const generatedAbsolutePath = store.writeBinaryFile(stagedProject, generatedRelativePath, downloaded.content);
      const contentFingerprint2 = createHash6("sha256").update(downloaded.content).digest("hex").slice(0, 16);
      const html = createSlideImageHTML(generatedAbsolutePath, contentFingerprint2);
      store.writeContentFile(stagedProject, relativePath, html);
      stagedProject.files = mergeFiles(stagedProject.files, [{
        path: relativePath,
        mimeType: "text/html",
        title: relativePath,
        content: html,
        width: 1280,
        height: 720,
        imageSlidesModel: "gpt-image"
      }]);
      stagedProject.activeFile = relativePath;
      stagedProject.viewState = {
        ...stagedProject.viewState,
        generate_mode: "image",
        isImageSlides: true,
        imageSlidesModel: "gpt-image",
        images: { ...stagedProject.viewState?.images ?? {}, [slideId]: generatedAbsolutePath },
        outline: outlineOfProject(stagedProject).map((item) => String(item.id) === slideId ? { ...item, state: SLIDE_STATE_EDITED } : item)
      };
      const stagedAssets = stagedProject.viewState?.assets;
      if (stagedAssets && typeof stagedAssets === "object" && !Array.isArray(stagedAssets)) {
        delete stagedAssets[generatedAbsolutePath];
      }
      try {
        await syncProjectAssets(stagedProject, client, RESOURCE_KEY, workspaceAssetReader(store.workspaceRoot));
        await sync.push(stagedProject);
      } catch (error) {
        store.restoreFileBestEffort(stagedProject, generatedRelativePath, previousGeneratedContent);
        store.restoreFileBestEffort(stagedProject, relativePath, previousHTMLContent);
        throw error;
      }
      Object.assign(current, stagedProject);
      store.cache(current);
      const next = nextPendingSlide(current);
      const completionText = next ? "" : " All slides are generated — call slides/present with this project_id.";
      return {
        content: [{
          type: "text",
          text: `Generated image slide "${slideId}.html" successfully. ` + `Project: "${current.id}". Image: "${generatedAbsolutePath}".${completionText}`
        }],
        structuredContent: {
          project_id: current.id,
          slide_id: slideId,
          state: SLIDE_STATE_EDITED,
          generated_image_path: generatedAbsolutePath,
          generated_image_relative_path: generatedRelativePath,
          image_url: imageURL,
          model_used: modelUsed,
          next_pending: next?.id,
          slide_ids: slideIdsOfProject(current),
          outline: outlineOfProject(current)
        }
      };
    });
  }
};

// mcp/tools/getTemplate.ts
var getTemplateTool = {
  definition: {
    name: "get_template",
    description: "Fetch an official Slides template by its exact template_id: returns the style description and per-page " + "catalog (page IDs + descriptions) used to tag outline entries with slide_template_key. Call it once per " + "deck, BEFORE slides/init_slides, and only when the task context or the user provides an exact template_id. " + "It cannot list or search templates — never guess an id; generic style wishes go to the init_slides " + "style_request parameter instead.",
    inputSchema: {
      type: "object",
      properties: {
        template_id: {
          type: "string",
          minLength: 1,
          description: "Official template id, for example from the New Session scene launch context."
        }
      },
      required: ["template_id"]
    }
  },
  async execute({ client }, args) {
    const templateId = String(args?.template_id ?? args?.templateId ?? "").trim();
    if (!hasTemplate(templateId)) {
      throw new Error(`template_id "${templateId}" does not refer to an official template. ` + "Never guess template ids — use the exact id from the task context or the user. " + "Otherwise proceed without a template and put style preferences in init_slides style_request.");
    }
    const detail = await fetchTemplateDetail(client, templateId).catch((error) => {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Template "${templateId}" could not be loaded: ${reason}. ` + "Never guess template ids — use the exact id from the task context or the user, verbatim. " + "If no exact id was provided, proceed without a template and put style preferences in init_slides style_request.");
    });
    return {
      content: [{ type: "text", text: templateCatalogText(detail) }],
      structuredContent: {
        template_id: detail.templateId,
        name: detail.name,
        generate_mode: detail.generateMode,
        page_ids: detail.pages.map((page) => page.id)
      }
    };
  }
};

// mcp/tools/inspectAfterFileEdit.ts
import { createHash as createHash7 } from "node:crypto";
import path15 from "node:path";

// schema./validation/slideXmlParser.ts
var NAMED_ENTITIES = Object.assign(Object.create(null), {
  lt: "<",
  gt: ">",
  amp: "&",
  quot: '"',
  apos: "'",
  nbsp: " "
});
function decodeXmlEntities(text, errors) {
  return text.replace(/&(#[0-9a-zA-Z]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body) => {
    if (body.startsWith("#")) {
      const hex = body.startsWith("#x");
      const digits = body.slice(hex ? 2 : 1);
      if (!(hex ? /^[0-9a-fA-F]+$/ : /^[0-9]+$/).test(digits)) {
        errors?.push(`Invalid numeric character reference "&${body};"`);
        return match;
      }
      const code = Number.parseInt(digits, hex ? 16 : 10);
      if (code >= 0 && code <= 1114111)
        return String.fromCodePoint(code);
      errors?.push(`Invalid numeric character reference "&${body};"`);
      return match;
    }
    const named = NAMED_ENTITIES[body];
    if (named === undefined) {
      errors?.push(`Unknown XML entity "&${body};" — only &lt; &gt; &amp; &quot; &apos; &nbsp; are supported; ` + "write the character directly (e.g. — … ©) or use a numeric reference (e.g. &#8212;)");
      return match;
    }
    return named;
  });
}
function recoverOverEscapedSlideXml(xml) {
  if (!xml.includes("&lt;"))
    return xml;
  if (parseXml(xml).root)
    return xml;
  const decoded = decodeXmlEntities(xml);
  if (decoded === xml)
    return xml;
  return parseXml(decoded).root ? decoded : xml;
}
function truncateForError(text, max = 40) {
  const collapsed = text.replace(/\s+/g, " ").trim();
  return collapsed.length > max ? `${collapsed.slice(0, max)}…` : collapsed;
}
function scanOpenTag(src, start, errors) {
  let i = start + 1;
  const nameMatch = /^[A-Za-z][\w-]*/.exec(src.slice(i));
  if (!nameMatch) {
    errors.push(`Malformed tag near "${truncateForError(src.slice(start, start + 24))}"`);
    return null;
  }
  const tag = nameMatch[0];
  i += tag.length;
  const attrs = {};
  const rawAttrs = {};
  while (true) {
    while (i < src.length && /\s/.test(src[i]))
      i++;
    if (i >= src.length) {
      errors.push(`Unterminated <${tag}> tag`);
      return null;
    }
    if (src[i] === "/") {
      if (src[i + 1] === ">") {
        return { tag, attrs, rawAttrs, selfClosing: true, end: i + 2 };
      }
      errors.push(`Malformed <${tag}> tag: unexpected "/"`);
      return null;
    }
    if (src[i] === ">") {
      return { tag, attrs, rawAttrs, selfClosing: false, end: i + 1 };
    }
    const attrMatch = /^[A-Za-z][\w-]*/.exec(src.slice(i));
    if (!attrMatch) {
      errors.push(`Malformed attribute in <${tag}> near "${truncateForError(src.slice(i, i + 24))}"`);
      return null;
    }
    const attrName = attrMatch[0];
    i += attrName.length;
    while (i < src.length && /\s/.test(src[i]))
      i++;
    if (src[i] !== "=") {
      errors.push(`<${tag}> attribute "${attrName}" must have a quoted value (attr="value")`);
      return null;
    }
    i++;
    while (i < src.length && /\s/.test(src[i]))
      i++;
    const quote = src[i];
    if (quote !== '"' && quote !== "'") {
      errors.push(`<${tag}> attribute "${attrName}" value must be quoted`);
      return null;
    }
    const closeIdx = src.indexOf(quote, i + 1);
    if (closeIdx === -1) {
      errors.push(`<${tag}> attribute "${attrName}" has an unterminated quote`);
      return null;
    }
    if (attrName in attrs) {
      errors.push(`<${tag}> has duplicate attribute "${attrName}"`);
    }
    rawAttrs[attrName] = src.slice(i + 1, closeIdx);
    attrs[attrName] = decodeXmlEntities(rawAttrs[attrName], errors);
    i = closeIdx + 1;
  }
}
function parseXml(source) {
  const errors = [];
  let src = source.replace(/<!--[\s\S]*?-->/g, "");
  if (src.includes("<!--")) {
    errors.push("Unterminated XML comment (<!-- without -->)");
    return { root: null, errors };
  }
  src = src.replace(/^\s*<\?xml[^>]*\?>/i, "");
  const stack = [];
  let root = null;
  let i = 0;
  while (i < src.length) {
    if (src[i] !== "<") {
      const nextTag = src.indexOf("<", i);
      const rawText = src.slice(i, nextTag === -1 ? undefined : nextTag);
      const parent2 = stack[stack.length - 1];
      if (parent2) {
        if (rawText.trim() !== "") {
          parent2.children.push({ type: "text", text: decodeXmlEntities(rawText, errors) });
        }
      } else if (rawText.trim() !== "") {
        errors.push(`Unexpected content outside the root element: "${truncateForError(rawText)}"`);
      }
      if (nextTag === -1)
        break;
      i = nextTag;
      continue;
    }
    if (src.startsWith("</", i)) {
      const closeMatch = /^<\/\s*([A-Za-z][\w-]*)\s*>/.exec(src.slice(i));
      if (!closeMatch) {
        errors.push(`Malformed closing tag near "${truncateForError(src.slice(i, i + 24))}"`);
        return { root, errors };
      }
      const closingTag = closeMatch[1];
      const current = stack.pop();
      if (!current) {
        errors.push(`Unexpected closing tag </${closingTag}> with no open element`);
        return { root, errors };
      }
      if (current.tag !== closingTag) {
        errors.push(`Mismatched closing tag: expected </${current.tag}> but found </${closingTag}>`);
        return { root, errors };
      }
      i += closeMatch[0].length;
      continue;
    }
    const open = scanOpenTag(src, i, errors);
    if (!open)
      return { root, errors };
    const node = {
      type: "element",
      tag: open.tag,
      attrs: open.attrs,
      rawAttrs: open.rawAttrs,
      children: []
    };
    const parent = stack[stack.length - 1];
    if (parent) {
      parent.children.push(node);
    } else if (root === null) {
      root = node;
    } else {
      errors.push(`Multiple root elements: unexpected <${open.tag}> after </${root.tag}>`);
      return { root, errors };
    }
    if (!open.selfClosing) {
      stack.push(node);
    }
    i = open.end;
  }
  if (stack.length > 0) {
    errors.push(`Unclosed element <${stack[stack.length - 1].tag}> — missing closing tag`);
  }
  if (root === null && errors.length === 0) {
    errors.push("Document contains no XML element");
  }
  return { root, errors };
}
// schema./validation/designValidator.ts
var CODE_FENCE_OPEN_REGEX = /^```(?:xml|yaml|yml)?\s*/i;
var CODE_FENCE_CLOSE_REGEX = /\s*```$/i;
var SIZE_TAG_REGEX = /<size\b[^>]*(?:\/>|>\s*<\/size>)/i;
var VARIABLE_NAME_REGEX = /^[a-z][a-z0-9_-]*$/;
var HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/;
var LANGUAGE_TAG_REGEX = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
var ARABIC_LANGUAGE_TAG_REGEX = /^ar(?:-|$)/i;
var RESERVED_NAMES = new Set(["none", "true", "false"]);
function truncateForError2(text, max = 40) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
function stripCompleteXmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, "");
}
function scanTag(src, start, errors) {
  let i = start + 1;
  const nameMatch = /^[A-Za-z][\w-]*/.exec(src.slice(i));
  if (!nameMatch) {
    errors.push(`Malformed tag near "${truncateForError2(src.slice(start, start + 20))}"`);
    return null;
  }
  const name = nameMatch[0];
  i += name.length;
  const attrs = {};
  while (true) {
    while (i < src.length && /\s/.test(src[i]))
      i++;
    if (i >= src.length) {
      errors.push(`Unterminated <${name}> tag`);
      return null;
    }
    if (src[i] === "/") {
      if (src[i + 1] === ">") {
        return { name, attrs, selfClosing: true, end: i + 2 };
      }
      errors.push(`Malformed <${name}> tag: unexpected "/"`);
      return null;
    }
    if (src[i] === ">") {
      return { name, attrs, selfClosing: false, end: i + 1 };
    }
    const attrMatch = /^[A-Za-z][\w-]*/.exec(src.slice(i));
    if (!attrMatch) {
      errors.push(`Malformed attribute in <${name}> near "${truncateForError2(src.slice(i, i + 20))}"`);
      return null;
    }
    const attrName = attrMatch[0];
    i += attrName.length;
    while (i < src.length && /\s/.test(src[i]))
      i++;
    if (src[i] !== "=") {
      errors.push(`<${name}> attribute "${attrName}" must have a quoted value (attr="value")`);
      return null;
    }
    i++;
    while (i < src.length && /\s/.test(src[i]))
      i++;
    const quote = src[i];
    if (quote !== '"' && quote !== "'") {
      errors.push(`<${name}> attribute "${attrName}" value must be quoted`);
      return null;
    }
    const closeIdx = src.indexOf(quote, i + 1);
    if (closeIdx === -1) {
      errors.push(`<${name}> attribute "${attrName}" has an unterminated quote`);
      return null;
    }
    if (attrName in attrs) {
      errors.push(`<${name}> has duplicate attribute "${attrName}"`);
    }
    attrs[attrName] = src.slice(i + 1, closeIdx);
    i = closeIdx + 1;
  }
}
function parseDesignDocument(xml) {
  const errors = [];
  const elements = [];
  let src = stripCompleteXmlComments(xml);
  if (src.includes("<!--")) {
    errors.push("Unterminated XML comment (<!-- without -->)");
    return { elements, errors };
  }
  src = src.replace(/^\s*<\?xml[^>]*\?>/i, "").trim();
  if (!src.startsWith("<design")) {
    errors.push("design.xml must contain exactly one <design> root element");
    return { elements, errors };
  }
  const root = scanTag(src, 0, errors);
  if (!root)
    return { elements, errors };
  if (root.name !== "design") {
    errors.push("design.xml must contain exactly one <design> root element");
    return { elements, errors };
  }
  validateAllowedAttrs(root, "<design>", ["dir", "lang"], errors);
  const direction = root.attrs.dir;
  const language = root.attrs.lang;
  if (direction !== undefined && direction !== "ltr" && direction !== "rtl") {
    errors.push(`<design>: dir "${direction}" is not supported (allowed: ltr, rtl)`);
  }
  if (language !== undefined && !LANGUAGE_TAG_REGEX.test(language)) {
    errors.push(`<design>: lang "${language}" must be a BCP 47 language tag`);
  }
  if (direction === "rtl" && !ARABIC_LANGUAGE_TAG_REGEX.test(language ?? "")) {
    errors.push('<design>: dir "rtl" requires lang="ar" or an Arabic language subtag');
  }
  if (root.selfClosing) {
    errors.push("<design> must not be self-closing");
    return { elements, errors };
  }
  if (!src.endsWith("</design>")) {
    errors.push("design.xml must end with </design> — no content is allowed after the root element");
    return { elements, errors };
  }
  const inner = src.slice(root.end, src.length - "</design>".length);
  let i = 0;
  while (i < inner.length) {
    const ch = inner[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch !== "<") {
      const nextTag = inner.indexOf("<", i);
      const text = inner.slice(i, nextTag === -1 ? undefined : nextTag).trim();
      errors.push(`Unexpected text content inside <design>: "${truncateForError2(text)}"`);
      if (nextTag === -1)
        break;
      i = nextTag;
      continue;
    }
    if (inner.startsWith("</", i)) {
      errors.push(`Unexpected closing tag inside <design> near "${truncateForError2(inner.slice(i, i + 20))}"`);
      break;
    }
    const tag = scanTag(inner, i, errors);
    if (!tag)
      break;
    i = tag.end;
    if (!tag.selfClosing) {
      const closeToken = `</${tag.name}>`;
      let j = i;
      while (j < inner.length && /\s/.test(inner[j]))
        j++;
      if (!inner.startsWith(closeToken, j)) {
        errors.push(`<${tag.name}> must be self-closing (<${tag.name} .../>) or immediately closed — child content is not allowed`);
        break;
      }
      i = j + closeToken.length;
    }
    elements.push({ name: tag.name, attrs: tag.attrs });
  }
  return { elements, errors };
}
function validateAllowedAttrs(el, label, allowed, errors) {
  for (const key of Object.keys(el.attrs)) {
    if (!allowed.includes(key)) {
      errors.push(`${label}: attribute "${key}" is not supported (allowed: ${allowed.join(", ")})`);
    }
  }
}
function validatePositiveNumber(el, label, attr, errors) {
  const raw = el.attrs[attr];
  if (raw === undefined) {
    errors.push(`${label}: attribute "${attr}" is required`);
    return;
  }
  if (!/^\d+(\.\d+)?$/.test(raw)) {
    errors.push(`${label}: attribute "${attr}" must be a positive number in px (got "${raw}")`);
    return;
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    errors.push(`${label}: attribute "${attr}" must be a positive number in px (got "${raw}")`);
  }
}
function validateVariableName(el, label, seen, errors) {
  const name = el.attrs.name;
  if (name === undefined) {
    errors.push(`${label}: attribute "name" is required`);
    return;
  }
  if (!VARIABLE_NAME_REGEX.test(name)) {
    errors.push(`${label}: name "${name}" must match [a-z][a-z0-9_-]* (lowercase letters, digits, underscores, hyphens)`);
    return;
  }
  if (RESERVED_NAMES.has(name)) {
    errors.push(`${label}: name "${name}" is a reserved word (none/true/false) and cannot be used`);
    return;
  }
  if (seen.has(name)) {
    errors.push(`${label}: duplicate name "${name}"`);
    return;
  }
  seen.add(name);
}
function validateDesignXml(xml) {
  const { elements, errors } = parseDesignDocument(xml);
  let sizeCount = 0;
  let colorCount = 0;
  let fontCount = 0;
  const colorNames = new Set;
  const fontNames = new Set;
  elements.forEach((el, index) => {
    const label = `<${el.name}> #${index + 1}`;
    switch (el.name) {
      case "size": {
        sizeCount++;
        validateAllowedAttrs(el, label, ["width", "height"], errors);
        validatePositiveNumber(el, label, "width", errors);
        validatePositiveNumber(el, label, "height", errors);
        break;
      }
      case "color": {
        colorCount++;
        validateAllowedAttrs(el, label, ["name", "value"], errors);
        validateVariableName(el, label, colorNames, errors);
        const value = el.attrs.value;
        if (value === undefined) {
          errors.push(`${label}: attribute "value" is required`);
        } else if (!HEX_COLOR_REGEX.test(value)) {
          errors.push(`${label}: value "${value}" must be a hex literal #RRGGBB or #RRGGBBAA`);
        }
        break;
      }
      case "font": {
        fontCount++;
        validateAllowedAttrs(el, label, ["name", "family", "size"], errors);
        validateVariableName(el, label, fontNames, errors);
        const family = el.attrs.family;
        if (family === undefined || family.trim() === "") {
          errors.push(`${label}: attribute "family" is required and must be a single Google Fonts name`);
        } else if (family.includes(",")) {
          errors.push(`${label}: family "${family}" must be a single Google Fonts name — comma-separated fallback lists are not supported`);
        }
        validatePositiveNumber(el, label, "size", errors);
        break;
      }
      default:
        errors.push(`${label} is not a supported design element (allowed: size, color, font)`);
    }
  });
  if (errors.length === 0) {
    if (sizeCount === 0)
      errors.push("<design> must define exactly one <size> element");
    if (sizeCount > 1)
      errors.push(`<design> must define exactly one <size> element (found ${sizeCount})`);
    if (colorCount === 0)
      errors.push("<design> must define at least one <color> variable");
    if (fontCount === 0)
      errors.push("<design> must define at least one <font> variable");
  }
  return errors;
}
function normalizePptxDesignXml(text, size) {
  let cleaned = text.trim().replace(CODE_FENCE_OPEN_REGEX, "").replace(CODE_FENCE_CLOSE_REGEX, "").trim();
  cleaned = recoverOverEscapedSlideXml(cleaned);
  cleaned = stripCompleteXmlComments(cleaned).trim();
  if (size) {
    const sizeTag = `<size width="${size[0]}" height="${size[1]}"></size>`;
    if (SIZE_TAG_REGEX.test(cleaned)) {
      cleaned = cleaned.replace(SIZE_TAG_REGEX, sizeTag);
    } else {
      const designOpenTag = cleaned.match(/<design\b[^>]*>/i);
      if (designOpenTag?.index !== undefined) {
        const insertAt = designOpenTag.index + designOpenTag[0].length;
        cleaned = `${cleaned.slice(0, insertAt)}
  ${sizeTag}${cleaned.slice(insertAt)}`;
      }
    }
  }
  const errors = validateDesignXml(cleaned);
  if (errors.length > 0) {
    throw new Error(errors.join(`
`));
  }
  return cleaned;
}
// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js
var exports_external = {};
__export(exports_external, {
  void: () => voidType,
  util: () => util,
  unknown: () => unknownType,
  union: () => unionType,
  undefined: () => undefinedType,
  tuple: () => tupleType,
  transformer: () => effectsType,
  symbol: () => symbolType,
  string: () => stringType,
  strictObject: () => strictObjectType,
  setErrorMap: () => setErrorMap,
  set: () => setType,
  record: () => recordType,
  quotelessJson: () => quotelessJson,
  promise: () => promiseType,
  preprocess: () => preprocessType,
  pipeline: () => pipelineType,
  ostring: () => ostring,
  optional: () => optionalType,
  onumber: () => onumber,
  oboolean: () => oboolean,
  objectUtil: () => objectUtil,
  object: () => objectType,
  number: () => numberType,
  nullable: () => nullableType,
  null: () => nullType,
  never: () => neverType,
  nativeEnum: () => nativeEnumType,
  nan: () => nanType,
  map: () => mapType,
  makeIssue: () => makeIssue,
  literal: () => literalType,
  lazy: () => lazyType,
  late: () => late,
  isValid: () => isValid,
  isDirty: () => isDirty,
  isAsync: () => isAsync,
  isAborted: () => isAborted,
  intersection: () => intersectionType,
  instanceof: () => instanceOfType,
  getParsedType: () => getParsedType,
  getErrorMap: () => getErrorMap,
  function: () => functionType,
  enum: () => enumType,
  effect: () => effectsType,
  discriminatedUnion: () => discriminatedUnionType,
  defaultErrorMap: () => en_default,
  datetimeRegex: () => datetimeRegex,
  date: () => dateType,
  custom: () => custom,
  coerce: () => coerce,
  boolean: () => booleanType,
  bigint: () => bigIntType,
  array: () => arrayType,
  any: () => anyType,
  addIssueToContext: () => addIssueToContext,
  ZodVoid: () => ZodVoid,
  ZodUnknown: () => ZodUnknown,
  ZodUnion: () => ZodUnion,
  ZodUndefined: () => ZodUndefined,
  ZodType: () => ZodType,
  ZodTuple: () => ZodTuple,
  ZodTransformer: () => ZodEffects,
  ZodSymbol: () => ZodSymbol,
  ZodString: () => ZodString,
  ZodSet: () => ZodSet,
  ZodSchema: () => ZodType,
  ZodRecord: () => ZodRecord,
  ZodReadonly: () => ZodReadonly,
  ZodPromise: () => ZodPromise,
  ZodPipeline: () => ZodPipeline,
  ZodParsedType: () => ZodParsedType,
  ZodOptional: () => ZodOptional,
  ZodObject: () => ZodObject,
  ZodNumber: () => ZodNumber,
  ZodNullable: () => ZodNullable,
  ZodNull: () => ZodNull,
  ZodNever: () => ZodNever,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNaN: () => ZodNaN,
  ZodMap: () => ZodMap,
  ZodLiteral: () => ZodLiteral,
  ZodLazy: () => ZodLazy,
  ZodIssueCode: () => ZodIssueCode,
  ZodIntersection: () => ZodIntersection,
  ZodFunction: () => ZodFunction,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodError: () => ZodError,
  ZodEnum: () => ZodEnum,
  ZodEffects: () => ZodEffects,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodDefault: () => ZodDefault,
  ZodDate: () => ZodDate,
  ZodCatch: () => ZodCatch,
  ZodBranded: () => ZodBranded,
  ZodBoolean: () => ZodBoolean,
  ZodBigInt: () => ZodBigInt,
  ZodArray: () => ZodArray,
  ZodAny: () => ZodAny,
  Schema: () => ZodType,
  ParseStatus: () => ParseStatus,
  OK: () => OK,
  NEVER: () => NEVER,
  INVALID: () => INVALID,
  EMPTY_PATH: () => EMPTY_PATH,
  DIRTY: () => DIRTY,
  BRAND: () => BRAND
});

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {};
  function assertIs(_arg) {}
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error;
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};

class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path15, errorMaps, issueData } = params;
  const fullPath = [...path15, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== undefined) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === en_default ? undefined : en_default
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}

class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
class ParseInputLazyPath {
  constructor(parent, value, path15, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path15;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}

class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus,
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(undefined).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}

class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}

class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};

class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};

class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};

class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};

class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};

class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};

class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};

class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};

class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};

class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : undefined,
          maximum: tooBig ? def.exactLength.value : undefined,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}

class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {} else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== undefined ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};

class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = undefined;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [undefined];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [undefined, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};

class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(discriminator, options, params) {
    const optionsMap = new Map;
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}

class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};

class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};

class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}

class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = new Map;
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = new Map;
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};

class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = new Set;
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};

class ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
}

class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};

class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}

class ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
ZodEnum.create = createZodEnum;

class ZodNativeEnum extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};

class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};

class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(undefined);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};

class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};

class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};

class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};

class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");

class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}

class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}

class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
// schema./PptSlideEditorSchema.ts
var boundsSchema = exports_external.tuple([exports_external.number(), exports_external.number(), exports_external.number(), exports_external.number()]);
var alignmentSchema = exports_external.tuple([
  exports_external.enum(["left", "center", "right", "justify"]).optional(),
  exports_external.enum(["top", "middle", "bottom"]).optional()
]);
var borderSchema = exports_external.object({
  style: exports_external.enum(["solid", "dash", "dot", "none"]).optional(),
  width: exports_external.number().optional(),
  color: exports_external.string().optional()
});
var shadowSchema = exports_external.object({
  blur: exports_external.number().optional(),
  color: exports_external.string().optional(),
  offset: exports_external.tuple([exports_external.number(), exports_external.number()]).optional()
});
var gradientStopSchema = exports_external.object({
  position: exports_external.number(),
  color: exports_external.string()
});
var solidFillSchema = exports_external.object({
  type: exports_external.literal("solid"),
  color: exports_external.string()
});
var gradientFillSchema = exports_external.object({
  type: exports_external.literal("gradient"),
  angle: exports_external.number().optional(),
  stops: exports_external.array(gradientStopSchema)
});
var imageFitSchema = exports_external.object({
  mode: exports_external.enum(["fill", "contain", "cover"])
});
var imageCropSchema = exports_external.object({
  left: exports_external.number().optional(),
  top: exports_external.number().optional(),
  right: exports_external.number().optional(),
  bottom: exports_external.number().optional()
});
var imageFillSchema = exports_external.object({
  type: exports_external.literal("image"),
  src: exports_external.string(),
  fit: imageFitSchema.optional(),
  mask: exports_external.union([solidFillSchema, gradientFillSchema]).optional()
});
var fillSchema = exports_external.discriminatedUnion("type", [
  solidFillSchema,
  gradientFillSchema,
  imageFillSchema
]);
var backgroundSchema = fillSchema;
var textStyleSchema = exports_external.object({
  fontFamily: exports_external.string().optional(),
  fontSize: exports_external.number().optional()
});
var tableStyleSchema = exports_external.object({
  fontSize: exports_external.number().optional(),
  fontFamily: exports_external.string().optional(),
  fill: solidFillSchema.optional(),
  headerFill: exports_external.string().optional(),
  bodyFill: exports_external.array(exports_external.string()).optional(),
  bodyColor: exports_external.string().optional(),
  headerBorder: borderSchema.optional(),
  bodyBorder: borderSchema.optional(),
  bodyBorderV: borderSchema.optional(),
  border: borderSchema.optional(),
  borderTop: borderSchema.optional(),
  borderRight: borderSchema.optional(),
  borderBottom: borderSchema.optional(),
  borderLeft: borderSchema.optional(),
  align: exports_external.enum(["left", "center", "right", "justify"]).optional(),
  anchor: exports_external.enum(["top", "middle", "bottom"]).optional(),
  direction: exports_external.enum(["ltr", "rtl"]).optional(),
  language: exports_external.string().optional(),
  lineHeight: exports_external.number().optional(),
  padding: exports_external.union([exports_external.number(), exports_external.array(exports_external.number())]).optional()
});
var themeSchema = exports_external.object({
  colors: exports_external.record(exports_external.string()).default({}),
  direction: exports_external.enum(["ltr", "rtl"]).optional(),
  language: exports_external.string().optional(),
  textStyles: exports_external.record(textStyleSchema).default({})
});
var textContentSchema = exports_external.object({
  text: exports_external.string(),
  style: exports_external.string().optional(),
  color: exports_external.string().optional(),
  fontSize: exports_external.number().optional(),
  fontFamily: exports_external.string().optional(),
  fontStyle: exports_external.string().optional(),
  bold: exports_external.boolean().optional(),
  underline: exports_external.boolean().optional(),
  strike: exports_external.boolean().optional(),
  backgroundColor: exports_external.string().optional(),
  lineHeight: exports_external.number().optional(),
  direction: exports_external.enum(["ltr", "rtl"]).optional(),
  language: exports_external.string().optional(),
  textDirection: exports_external.enum(["horizontal", "vertical"]).optional(),
  align: alignmentSchema.optional(),
  shadow: shadowSchema.optional(),
  autofit: exports_external.enum(["none", "shrink"]).optional(),
  padding: exports_external.union([exports_external.number(), exports_external.array(exports_external.number())]).optional(),
  wrap: exports_external.boolean().optional()
});
var elementBaseSchema = exports_external.object({
  elementId: exports_external.string(),
  bounds: boundsSchema,
  rotation: exports_external.number().optional(),
  opacity: exports_external.number().optional()
});
var flipSchema = exports_external.tuple([exports_external.boolean(), exports_external.boolean()]);
var textElementSchema = elementBaseSchema.extend({
  elementType: exports_external.literal("text"),
  content: textContentSchema
});
var shapeElementSchema = elementBaseSchema.extend({
  elementType: exports_external.literal("shape"),
  shapeName: exports_external.string().optional(),
  adjustments: exports_external.array(exports_external.number()).optional(),
  arrow: exports_external.tuple([
    exports_external.union([exports_external.literal("arrow"), exports_external.null()]),
    exports_external.union([exports_external.literal("arrow"), exports_external.null()])
  ]).optional(),
  fill: fillSchema.optional(),
  border: borderSchema.optional(),
  shadow: shadowSchema.optional(),
  flip: flipSchema.optional()
});
var imageElementSchema = elementBaseSchema.extend({
  elementType: exports_external.literal("image"),
  src: exports_external.string(),
  shapeName: exports_external.string().optional(),
  adjustments: exports_external.array(exports_external.number()).optional(),
  fit: imageFitSchema.optional(),
  crop: imageCropSchema.optional(),
  border: borderSchema.optional(),
  shadow: shadowSchema.optional(),
  flip: flipSchema.optional()
});
var iconElementSchema = elementBaseSchema.extend({
  elementType: exports_external.literal("icon"),
  iconName: exports_external.string().optional(),
  fill: solidFillSchema.optional(),
  shadow: shadowSchema.optional()
});
var tableCellBordersSchema = exports_external.object({
  top: borderSchema.optional(),
  right: borderSchema.optional(),
  bottom: borderSchema.optional(),
  left: borderSchema.optional()
});
var tableCellSchema = exports_external.object({
  content: textContentSchema.optional(),
  fill: solidFillSchema.optional(),
  borders: tableCellBordersSchema.optional(),
  border: borderSchema.optional(),
  rowSpan: exports_external.number().optional(),
  colSpan: exports_external.number().optional()
});
var tableElementSchema = elementBaseSchema.extend({
  elementType: exports_external.literal("table"),
  columnWidths: exports_external.array(exports_external.number()),
  rowHeights: exports_external.array(exports_external.number()).optional(),
  rows: exports_external.array(exports_external.array(tableCellSchema)),
  style: tableStyleSchema.optional(),
  border: borderSchema.optional()
});
var axisLabelSchema = exports_external.object({
  color: exports_external.string().optional(),
  fontSize: exports_external.number().optional()
});
var axisSchema = exports_external.object({
  show: exports_external.boolean().optional(),
  label: axisLabelSchema.optional(),
  gridLine: exports_external.boolean().optional(),
  min: exports_external.number().optional(),
  max: exports_external.number().optional(),
  numberFormat: exports_external.string().optional(),
  title: exports_external.string().optional()
});
var dataLabelSchema = exports_external.object({
  show: exports_external.boolean().optional(),
  color: exports_external.string().optional(),
  fontSize: exports_external.number().optional()
});
var legendSchema = exports_external.object({
  show: exports_external.boolean().optional(),
  position: exports_external.string().optional(),
  color: exports_external.string().optional(),
  fontSize: exports_external.number().optional()
});
var seriesStyleSchema = exports_external.object({
  smooth: exports_external.boolean().optional(),
  type: exports_external.enum(["bar", "line", "area"]).optional(),
  axis: exports_external.enum(["primary", "secondary"]).optional(),
  labels: exports_external.array(exports_external.string()).optional(),
  labelExpression: exports_external.string().optional()
});
var chartOptionsSchema = exports_external.object({
  direction: exports_external.enum(["vertical", "horizontal"]).optional(),
  innerRadius: exports_external.number().optional(),
  stacked: exports_external.union([exports_external.literal(true), exports_external.literal("100%")]).optional(),
  fontFamily: exports_external.string().optional(),
  gapWidth: exports_external.number().optional(),
  fillOpacity: exports_external.number().optional(),
  lineWidth: exports_external.number().optional(),
  lineDash: exports_external.enum(["solid", "dash", "dot"]).optional(),
  marker: exports_external.boolean().optional(),
  markerSize: exports_external.number().optional(),
  gridlineColor: exports_external.string().optional()
});
var chartDataValueSchema = exports_external.union([exports_external.string(), exports_external.number(), exports_external.null()]);
var chartElementSchema = elementBaseSchema.extend({
  elementType: exports_external.literal("chart"),
  type: exports_external.enum(["bar", "line", "area", "scatter", "pie"]),
  data: exports_external.array(exports_external.record(chartDataValueSchema)),
  x: exports_external.string(),
  y: exports_external.array(exports_external.string()),
  names: exports_external.array(exports_external.string()).optional(),
  colors: exports_external.array(exports_external.string()).optional(),
  options: chartOptionsSchema.optional(),
  seriesStyle: exports_external.record(seriesStyleSchema).optional(),
  xAxis: axisSchema.optional(),
  yAxis: axisSchema.optional(),
  secondaryAxis: axisSchema.optional(),
  legend: legendSchema.optional(),
  dataLabels: dataLabelSchema.optional()
});
var elementSchema = exports_external.discriminatedUnion("elementType", [
  textElementSchema,
  shapeElementSchema,
  imageElementSchema,
  iconElementSchema,
  tableElementSchema,
  chartElementSchema
]);
var pageSchema = exports_external.object({
  pageType: exports_external.enum([
    "cover",
    "table_of_contents",
    "chapter",
    "content",
    "final"
  ]),
  background: backgroundSchema.optional(),
  elements: exports_external.array(elementSchema).default([])
});
var presentationSchema = exports_external.object({
  title: exports_external.string().optional(),
  theme: themeSchema,
  size: exports_external.tuple([exports_external.number(), exports_external.number()]),
  pages: exports_external.array(exports_external.string())
});
var slideStatePageSchema = exports_external.object({
  id: exports_external.string(),
  pageNum: exports_external.number().optional()
}).passthrough();
var slideStateProjectInfoSchema = exports_external.object({
  title: exports_external.string().optional()
}).passthrough();
var slideStateSchema = exports_external.object({
  title: exports_external.string().optional(),
  project_info: slideStateProjectInfoSchema.optional(),
  slides: exports_external.array(slideStatePageSchema)
}).passthrough().transform((value) => {
  const slides = [...value.slides].sort((a, b) => (a.pageNum ?? 0) - (b.pageNum ?? 0));
  return {
    ...value,
    pages: slides.map((slide) => slide.id),
    title: value.title ?? value.project_info?.title
  };
});
var PptSlideEditorSchema = {
  background: backgroundSchema,
  element: elementSchema,
  fill: fillSchema,
  gradientFill: gradientFillSchema,
  page: pageSchema,
  presentation: presentationSchema,
  slideState: slideStateSchema,
  tableStyle: tableStyleSchema,
  textContent: textContentSchema,
  textStyle: textStyleSchema,
  theme: themeSchema
};

// schema./PptSlideEditorPptTypes.ts
var PptSlideEditorPptTypes;
((PptSlideEditorPptTypes) => {
  PptSlideEditorPptTypes.schema = PptSlideEditorSchema;
})(PptSlideEditorPptTypes ||= {});

// schema./PptSlideEditorXmlSchema.ts
var xmlNumber = exports_external.union([exports_external.number(), exports_external.string()]).transform((value, ctx) => {
  const numericValue = typeof value === "number" ? value : Number(value.trim());
  if (!Number.isFinite(numericValue)) {
    ctx.addIssue({
      code: exports_external.ZodIssueCode.custom,
      message: `Invalid number: ${value}`
    });
    return exports_external.NEVER;
  }
  return numericValue;
});
var xmlBoolean = exports_external.union([exports_external.boolean(), exports_external.enum(["true", "false"])]).transform((value) => value === true || value === "true");
var xmlColor = exports_external.string().min(1);
var xmlVarName = exports_external.string().regex(/^[a-z][a-z0-9_-]*$/);
var xmlLanguageTag = exports_external.string().regex(/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/);
var xmlFontValue = exports_external.string().min(1).refine((value) => !value.includes(","), {
  message: "font must be a single Google Fonts family name; comma fallback lists are not supported"
});
var xmlNumberList = exports_external.union([exports_external.array(xmlNumber), exports_external.string()]).transform((value, ctx) => {
  const items = typeof value === "string" ? value.split(",").map((item) => item.trim()) : value;
  const numbers = [];
  for (const item of items) {
    const numericValue = typeof item === "number" ? item : Number(item);
    if (!Number.isFinite(numericValue)) {
      ctx.addIssue({
        code: exports_external.ZodIssueCode.custom,
        message: `Invalid number list item: ${item}`
      });
      return exports_external.NEVER;
    }
    numbers.push(numericValue);
  }
  return numbers;
});
var xmlStringList = exports_external.union([exports_external.array(exports_external.string()), exports_external.string()]).transform((value) => typeof value === "string" ? value.split(",").map((item) => item.trim()) : value);
var xmlRowHeightList = exports_external.string().transform((value, ctx) => {
  const items = value.split(",").map((item) => item.trim());
  const heights = [];
  for (const item of items) {
    if (item === "auto") {
      heights.push(null);
      continue;
    }
    const numericValue = Number(item);
    if (!Number.isFinite(numericValue)) {
      ctx.addIssue({
        code: exports_external.ZodIssueCode.custom,
        message: `Invalid row height: ${item}`
      });
      return exports_external.NEVER;
    }
    heights.push(numericValue);
  }
  return heights;
});
var xmlPadding = exports_external.string().transform((value, ctx) => {
  const parts = value.trim().split(/\s+/).map(Number);
  if (parts.some((part) => !Number.isFinite(part))) {
    ctx.addIssue({
      code: exports_external.ZodIssueCode.custom,
      message: `Invalid padding: ${value}`
    });
    return exports_external.NEVER;
  }
  if (parts.length === 1) {
    return parts[0];
  }
  if (parts.length === 2 || parts.length === 4) {
    return parts;
  }
  ctx.addIssue({
    code: exports_external.ZodIssueCode.custom,
    message: `Padding expects 1, 2 or 4 components: ${value}`
  });
  return exports_external.NEVER;
});
var xmlBorderLine = exports_external.string().transform((value, ctx) => {
  const parts = value.trim().split(/\s+/);
  let width = 1;
  let dash = "solid";
  let color;
  for (const part of parts) {
    if (/^\d+(\.\d+)?$/.test(part)) {
      width = Number(part);
      continue;
    }
    if (part === "solid" || part === "dash" || part === "dot") {
      dash = part;
      continue;
    }
    color = part;
  }
  if (!color) {
    ctx.addIssue({
      code: exports_external.ZodIssueCode.custom,
      message: `Border line missing color: ${value}`
    });
    return exports_external.NEVER;
  }
  return { color, dash, width };
});
var gradientStopSchema2 = exports_external.object({
  offset: exports_external.union([exports_external.number(), exports_external.string()]).transform((value, ctx) => {
    if (typeof value === "number") {
      return value;
    }
    const numericValue = Number(value.trim().replace(/%$/, ""));
    if (!Number.isFinite(numericValue)) {
      ctx.addIssue({
        code: exports_external.ZodIssueCode.custom,
        message: `Invalid gradient stop offset: ${value}`
      });
      return exports_external.NEVER;
    }
    return numericValue / 100;
  }),
  color: xmlColor
});
var gradientFillSchema2 = exports_external.object({
  type: exports_external.literal("gradient"),
  direction: xmlNumber.optional(),
  stops: exports_external.array(gradientStopSchema2).min(2)
});
var imageFillSchema2 = exports_external.object({
  type: exports_external.literal("image"),
  src: exports_external.string().min(1),
  fit: exports_external.enum(["cover", "contain", "stretch", "tile"]).default("cover"),
  overlay: xmlColor.optional(),
  overlayOpacity: xmlNumber.optional(),
  overlayGradient: gradientFillSchema2.optional()
});
var solidFillNodeSchema = exports_external.object({
  type: exports_external.literal("solid"),
  color: xmlColor
});
var fillNodeSchema = exports_external.discriminatedUnion("type", [
  solidFillNodeSchema,
  gradientFillSchema2,
  imageFillSchema2
]);
var shadowSchema2 = exports_external.object({
  x: xmlNumber.default(0),
  y: xmlNumber.default(4),
  blur: xmlNumber.default(12),
  color: xmlColor.default("#000000"),
  opacity: xmlNumber.default(0.35)
});
var elementBaseShape = {
  id: exports_external.string().optional(),
  x: xmlNumber.default(0),
  y: xmlNumber.default(0),
  width: xmlNumber.default(0),
  height: xmlNumber.default(0),
  rotation: xmlNumber.optional(),
  opacity: xmlNumber.optional(),
  shadow: shadowSchema2.optional()
};
var alignSchema = exports_external.enum(["left", "center", "right", "justify"]);
var anchorSchema = exports_external.enum(["top", "middle", "bottom"]);
var dirSchema = exports_external.enum(["ltr", "rtl"]);
var runSchema = exports_external.object({
  text: exports_external.string(),
  bold: exports_external.boolean().optional(),
  italic: exports_external.boolean().optional(),
  underline: exports_external.boolean().optional(),
  strike: exports_external.boolean().optional(),
  superscript: exports_external.boolean().optional(),
  subscript: exports_external.boolean().optional(),
  dir: dirSchema.optional(),
  href: exports_external.string().optional(),
  slide: exports_external.string().optional(),
  font: xmlFontValue.optional(),
  size: xmlNumber.optional(),
  color: xmlColor.optional(),
  highlight: xmlColor.optional()
}).refine((value) => value.href === undefined || value.slide === undefined, {
  message: "href and slide are mutually exclusive on <a>"
});
var blockStyleShape = {
  font: xmlFontValue.optional(),
  size: xmlNumber.optional(),
  color: xmlColor.optional(),
  align: alignSchema.optional(),
  dir: dirSchema.optional(),
  lang: xmlLanguageTag.optional(),
  lineHeight: xmlNumber.optional(),
  spaceBefore: xmlNumber.optional(),
  spaceAfter: xmlNumber.optional()
};
var paragraphSchema = exports_external.object({
  kind: exports_external.literal("p"),
  runs: exports_external.array(runSchema),
  ...blockStyleShape
});
var listSchema = exports_external.lazy(() => exports_external.object({
  kind: exports_external.literal("list"),
  ordered: exports_external.boolean(),
  bullet: exports_external.string().optional(),
  items: exports_external.array(listItemSchema)
}));
var listItemSchema = exports_external.lazy(() => exports_external.object({
  kind: exports_external.literal("li"),
  runs: exports_external.array(runSchema),
  children: listSchema.optional(),
  ...blockStyleShape
}));
var blockSchema = exports_external.union([paragraphSchema, listSchema]);
var textElementSchema2 = exports_external.object({
  kind: exports_external.literal("text"),
  ...elementBaseShape,
  font: xmlFontValue,
  size: xmlNumber.optional(),
  color: xmlColor.optional(),
  align: alignSchema.optional(),
  dir: dirSchema.optional(),
  lang: xmlLanguageTag.optional(),
  lineHeight: xmlNumber.optional(),
  anchor: anchorSchema.optional(),
  padding: xmlPadding.optional(),
  autofit: exports_external.enum(["none", "shrink"]).optional(),
  writingMode: exports_external.enum(["horizontal", "vertical"]).optional(),
  wrap: xmlBoolean.optional(),
  fill: xmlColor.optional(),
  fillNode: fillNodeSchema.optional(),
  blocks: exports_external.array(blockSchema)
});
var shapeElementSchema2 = exports_external.object({
  kind: exports_external.literal("shape"),
  ...elementBaseShape,
  type: exports_external.string().min(1),
  fill: xmlColor.optional(),
  fillNode: fillNodeSchema.optional(),
  stroke: xmlColor.optional(),
  strokeWidth: xmlNumber.optional(),
  strokeDash: exports_external.enum(["solid", "dash", "dot"]).optional(),
  cornerRadius: xmlNumber.optional(),
  arrowStart: exports_external.enum(["none", "arrow"]).optional(),
  arrowEnd: exports_external.enum(["none", "arrow"]).optional(),
  headRatio: xmlNumber.optional()
});
var imageElementSchema2 = exports_external.object({
  kind: exports_external.literal("image"),
  ...elementBaseShape,
  src: exports_external.string().min(1),
  fit: exports_external.enum(["cover", "contain", "stretch"]).optional(),
  mask: exports_external.string().optional(),
  cornerRadius: xmlNumber.optional(),
  flipH: xmlBoolean.optional(),
  flipV: xmlBoolean.optional(),
  cropLeft: xmlNumber.optional(),
  cropTop: xmlNumber.optional(),
  cropRight: xmlNumber.optional(),
  cropBottom: xmlNumber.optional(),
  stroke: xmlColor.optional(),
  strokeWidth: xmlNumber.optional(),
  strokeDash: exports_external.enum(["solid", "dash", "dot"]).optional()
});
var iconElementSchema2 = exports_external.object({
  kind: exports_external.literal("icon"),
  ...elementBaseShape,
  name: exports_external.string().min(1),
  color: xmlColor.optional()
});
var tableCellSchema2 = exports_external.object({
  colspan: xmlNumber.optional(),
  rowspan: xmlNumber.optional(),
  fill: xmlColor.optional(),
  border: xmlBorderLine.optional(),
  borderTop: xmlBorderLine.optional(),
  borderRight: xmlBorderLine.optional(),
  borderBottom: xmlBorderLine.optional(),
  borderLeft: xmlBorderLine.optional(),
  font: xmlFontValue.optional(),
  size: xmlNumber.optional(),
  color: xmlColor.optional(),
  align: alignSchema.optional(),
  lineHeight: xmlNumber.optional(),
  anchor: anchorSchema.optional(),
  padding: xmlPadding.optional(),
  wrap: xmlBoolean.optional(),
  blocks: exports_external.array(blockSchema)
});
var tableRowSchema = exports_external.object({
  fill: xmlColor.optional(),
  font: xmlFontValue.optional(),
  size: xmlNumber.optional(),
  color: xmlColor.optional(),
  align: alignSchema.optional(),
  lineHeight: xmlNumber.optional(),
  cells: exports_external.array(tableCellSchema2)
});
var tableElementSchema2 = exports_external.object({
  kind: exports_external.literal("table"),
  ...elementBaseShape,
  columns: xmlNumberList.optional(),
  rows: xmlRowHeightList.optional(),
  font: xmlFontValue,
  size: xmlNumber.optional(),
  color: xmlColor.optional(),
  align: alignSchema.optional(),
  dir: dirSchema.optional(),
  lang: xmlLanguageTag.optional(),
  lineHeight: xmlNumber.optional(),
  padding: xmlPadding.optional(),
  anchor: anchorSchema.optional(),
  fill: xmlColor.optional(),
  headerFill: xmlColor.optional(),
  bandFill: xmlColor.optional(),
  borderH: xmlBorderLine.optional(),
  borderV: xmlBorderLine.optional(),
  borderOuter: xmlBorderLine.optional(),
  borderTop: xmlBorderLine.optional(),
  borderRight: xmlBorderLine.optional(),
  borderBottom: xmlBorderLine.optional(),
  borderLeft: xmlBorderLine.optional(),
  headerBorder: xmlBorderLine.optional(),
  trs: exports_external.array(tableRowSchema)
});
var chartSeriesSchema = exports_external.object({
  name: exports_external.string().optional(),
  values: xmlNumberList.optional(),
  x: xmlNumberList.optional(),
  y: xmlNumberList.optional(),
  color: xmlColor.optional(),
  labels: xmlStringList.optional(),
  labelExpr: exports_external.string().optional(),
  type: exports_external.enum(["column", "line", "area"]).optional(),
  axis: exports_external.enum(["primary", "secondary"]).optional()
});
var chartElementSchema2 = exports_external.object({
  kind: exports_external.literal("chart"),
  ...elementBaseShape,
  type: exports_external.enum(["bar", "column", "line", "area", "pie", "donut", "scatter"]),
  font: xmlFontValue,
  textSize: xmlNumber.optional(),
  textColor: xmlColor.optional(),
  categories: xmlStringList.optional(),
  color: xmlStringList.optional(),
  legend: exports_external.enum(["none", "top", "bottom", "left", "right"]).optional(),
  dataLabels: xmlBoolean.optional(),
  xAxis: xmlBoolean.optional(),
  yAxis: xmlBoolean.optional(),
  yMin: xmlNumber.optional(),
  yMax: xmlNumber.optional(),
  yFormat: exports_external.enum(["number", "percent", "thousands"]).optional(),
  xTitle: exports_external.string().optional(),
  yTitle: exports_external.string().optional(),
  gridlines: exports_external.enum(["none", "h", "v", "hv"]).optional(),
  y2Min: xmlNumber.optional(),
  y2Max: xmlNumber.optional(),
  y2Format: exports_external.enum(["number", "percent", "thousands"]).optional(),
  y2Title: exports_external.string().optional(),
  stack: exports_external.enum(["none", "normal", "percent"]).optional(),
  smooth: xmlBoolean.optional(),
  gapWidth: xmlNumber.optional(),
  fillOpacity: xmlNumber.optional(),
  lineWidth: xmlNumber.optional(),
  lineDash: exports_external.enum(["solid", "dash", "dot"]).optional(),
  marker: xmlBoolean.optional(),
  markerSize: xmlNumber.optional(),
  gridlineColor: xmlColor.optional(),
  holeSize: xmlNumber.optional(),
  series: exports_external.array(chartSeriesSchema)
});
var elementSchema2 = exports_external.discriminatedUnion("kind", [
  textElementSchema2,
  shapeElementSchema2,
  imageElementSchema2,
  iconElementSchema2,
  tableElementSchema2,
  chartElementSchema2
]);
var slideSchema = exports_external.object({
  id: exports_external.string().optional(),
  background: xmlColor.optional(),
  backgroundNode: fillNodeSchema.optional(),
  elements: exports_external.array(elementSchema2)
}).refine((value) => value.background === undefined || value.backgroundNode === undefined, { message: "background attribute and <background> are mutually exclusive" });
var colorVarSchema = exports_external.object({
  name: xmlVarName,
  value: exports_external.string().regex(/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/)
});
var fontVarSchema = exports_external.object({
  name: xmlVarName,
  family: xmlFontValue,
  size: xmlNumber
});
var designSchema = exports_external.object({
  colors: exports_external.array(colorVarSchema),
  dir: dirSchema.optional(),
  fonts: exports_external.array(fontVarSchema),
  lang: xmlLanguageTag.optional(),
  size: exports_external.object({
    width: xmlNumber,
    height: xmlNumber
  }).optional()
});
var PptSlideEditorXmlSchema = {
  block: blockSchema,
  borderLine: xmlBorderLine,
  chartSeries: chartSeriesSchema,
  design: designSchema,
  element: elementSchema2,
  fillNode: fillNodeSchema,
  gradientStop: gradientStopSchema2,
  run: runSchema,
  shadow: shadowSchema2,
  slide: slideSchema
};

// schema./validation/slideSchema.ts
var slideSchema2 = PptSlideEditorXmlSchema.slide;
var ELEMENT_TAGS = new Set(["text", "shape", "image", "table", "chart", "icon"]);
var BLOCK_TAGS = new Set(["p", "ul", "ol"]);
var INLINE_TAGS = new Set(["strong", "em", "u", "s", "sup", "sub", "span", "a"]);
var SHADOW_ATTR_KEYS = new Set(["shadow", "shadowX", "shadowY", "shadowBlur", "shadowColor", "shadowOpacity"]);
var MAX_LIST_DEPTH = 5;
var MAX_INLINE_DEPTH = 20;
function kebabToCamel(key) {
  return key.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}
function mapElementAttrs(attrs) {
  const mapped = {};
  const shadow = {};
  let hasShadow = false;
  let shadowDisabled = false;
  for (const [key, value] of Object.entries(attrs)) {
    const camel = kebabToCamel(key);
    if (SHADOW_ATTR_KEYS.has(camel)) {
      if (camel === "shadow") {
        if (value === "true")
          hasShadow = true;
        else
          shadowDisabled = true;
        continue;
      }
      shadow[camel.slice("shadow".length).replace(/^[A-Z]/, (ch) => ch.toLowerCase())] = value;
      hasShadow = true;
      continue;
    }
    mapped[camel] = value;
  }
  if (hasShadow && !shadowDisabled) {
    mapped.shadow = shadow;
  }
  return mapped;
}
function isWhitespaceText(node) {
  return node.type === "text" && node.text.trim() === "";
}
function elementChildren(node) {
  return node.children.filter((child) => child.type === "element");
}
function checkImageSrcForm(src, label, errors2) {
  if (typeof src !== "string" || src === "") {
    return;
  }
  if (src.startsWith("https://") || src.startsWith("http://") || src.startsWith("data:")) {
    return;
  }
  if (isAbsoluteAssetPath(src)) {
    return;
  }
  const shown = src.length > 80 ? `${src.slice(0, 80)}…` : src;
  errors2.push(`${label}: src "${shown}" must be an absolute local path (POSIX /… or Windows C:\\…), an https:// URL, or a data: URI — anything else is never uploaded and renders as a broken image`);
}
function assembleFillNode(el, label, errors2) {
  const mapped = mapElementAttrs(el.attrs);
  if (mapped.type === undefined) {
    mapped.type = "solid";
  }
  if (mapped.type === "gradient") {
    mapped.stops = assembleGradientStops(el, label, errors2);
  } else if (mapped.type === "image") {
    checkImageSrcForm(el.rawAttrs.src, label, errors2);
    for (const child of el.children) {
      if (isWhitespaceText(child))
        continue;
      if (child.type !== "element" || child.tag !== "overlay") {
        errors2.push(`${label}: image fill only allows an <overlay> child`);
        continue;
      }
      mapped.overlayGradient = {
        type: "gradient",
        ...mapElementAttrs(child.attrs),
        stops: assembleGradientStops(child, `${label} <overlay>`, errors2)
      };
    }
  } else {
    for (const child of el.children) {
      if (!isWhitespaceText(child)) {
        errors2.push(`${label}: <${el.tag}> must not have child content`);
        break;
      }
    }
  }
  return mapped;
}
function assembleGradientStops(el, label, errors2) {
  const stops = [];
  for (const child of el.children) {
    if (isWhitespaceText(child))
      continue;
    if (child.type !== "element" || child.tag !== "stop") {
      errors2.push(`${label}: gradient only allows <stop> children`);
      continue;
    }
    stops.push(mapElementAttrs(child.attrs));
  }
  return stops;
}
var INLINE_STYLE_ATTRS = ["font", "size", "color", "highlight"];
function collectRuns(nodes, inherited, label, errors2, insideLink, depth = 0) {
  const runs = [];
  if (depth > MAX_INLINE_DEPTH) {
    errors2.push(`${label}: inline tag nesting exceeds ${MAX_INLINE_DEPTH} levels`);
    return runs;
  }
  for (const node of nodes) {
    if (node.type === "text") {
      if (node.text.trim() === "")
        continue;
      runs.push({ ...inherited, text: node.text });
      continue;
    }
    const { tag } = node;
    if (BLOCK_TAGS.has(tag)) {
      errors2.push(`${label}: <${tag}> is not allowed inside inline content`);
      continue;
    }
    if (!INLINE_TAGS.has(tag)) {
      errors2.push(`${label}: <${tag}> is not a supported inline tag (allowed: strong, em, u, s, sup, sub, span, a)`);
      continue;
    }
    const next = { ...inherited };
    for (const attr of INLINE_STYLE_ATTRS) {
      const value = node.attrs[attr];
      if (value !== undefined)
        next[attr] = value;
    }
    if (node.attrs.lang !== undefined) {
      errors2.push(`${label}: <${tag}> does not accept lang — put lang on the parent <p>/<li> or the <text> element`);
    }
    if (node.attrs.dir !== undefined) {
      if (tag !== "span") {
        errors2.push(`${label}: <${tag}> does not accept dir — wrap the segment in <span dir="ltr|rtl"> instead`);
      } else if (node.attrs.dir !== "ltr" && node.attrs.dir !== "rtl") {
        errors2.push(`${label}: <span> dir must be "ltr" or "rtl" (got "${node.attrs.dir}")`);
      } else {
        next.dir = node.attrs.dir;
      }
    }
    switch (tag) {
      case "strong":
        next.bold = true;
        break;
      case "em":
        next.italic = true;
        break;
      case "u":
        next.underline = true;
        break;
      case "s":
        next.strike = true;
        break;
      case "sup":
        next.superscript = true;
        break;
      case "sub":
        next.subscript = true;
        break;
      case "a": {
        if (insideLink) {
          errors2.push(`${label}: <a> must not be nested inside another <a>`);
        }
        const { href, slide } = node.attrs;
        if (href === undefined && slide === undefined) {
          errors2.push(`${label}: <a> must have exactly one of href or slide`);
        }
        if (href !== undefined)
          next.href = href;
        if (slide !== undefined)
          next.slide = slide;
        break;
      }
      default:
        break;
    }
    runs.push(...collectRuns(node.children, next, label, errors2, insideLink || tag === "a", depth + 1));
  }
  return runs;
}
function pickBlockStyleAttrs(attrs) {
  const mapped = mapElementAttrs(attrs);
  const style = {};
  for (const key of ["font", "size", "color", "align", "dir", "lang", "lineHeight", "spaceBefore", "spaceAfter"]) {
    if (mapped[key] !== undefined)
      style[key] = mapped[key];
  }
  return style;
}
function assembleList(el, label, errors2, depth) {
  if (depth > MAX_LIST_DEPTH) {
    errors2.push(`${label}: list nesting exceeds ${MAX_LIST_DEPTH} levels`);
    return { kind: "list", ordered: el.tag === "ol", items: [] };
  }
  const items = [];
  for (const child of el.children) {
    if (isWhitespaceText(child))
      continue;
    if (child.type !== "element" || child.tag !== "li") {
      errors2.push(`${label}: <${el.tag}> only allows <li> children`);
      continue;
    }
    const inlineNodes = [];
    const nestedLists = [];
    for (const liChild of child.children) {
      if (liChild.type === "element" && (liChild.tag === "ul" || liChild.tag === "ol")) {
        nestedLists.push(liChild);
      } else {
        inlineNodes.push(liChild);
      }
    }
    if (nestedLists.length > 1) {
      errors2.push(`${label}: <li> allows at most one nested <ul>/<ol>`);
    }
    const item = {
      kind: "li",
      runs: collectRuns(inlineNodes, {}, label, errors2, false),
      ...pickBlockStyleAttrs(child.attrs)
    };
    const nested = nestedLists[0];
    if (nested) {
      item.children = assembleList(nested, label, errors2, depth + 1);
    }
    items.push(item);
  }
  const list = {
    kind: "list",
    ordered: el.tag === "ol",
    items
  };
  if (el.attrs.bullet !== undefined) {
    list.bullet = el.attrs.bullet;
  }
  if (el.attrs.dir !== undefined) {
    errors2.push(`${label}: <${el.tag}> does not accept dir — put dir on <li> items or the parent <text>`);
  }
  if (el.attrs.lang !== undefined) {
    errors2.push(`${label}: <${el.tag}> does not accept lang — put lang on <li> items or the parent <text>`);
  }
  return list;
}
function assembleBlocks(nodes, label, errors2) {
  const blockNodes = [];
  let hasInlineContent = false;
  for (const node of nodes) {
    if (isWhitespaceText(node))
      continue;
    if (node.type === "element" && BLOCK_TAGS.has(node.tag)) {
      blockNodes.push(node);
    } else {
      hasInlineContent = true;
    }
  }
  if (blockNodes.length === 0) {
    const runs = collectRuns(nodes, {}, label, errors2, false);
    return runs.length > 0 ? [{ kind: "p", runs }] : [];
  }
  if (hasInlineContent) {
    errors2.push(`${label}: mixing bare text/inline tags with block tags (<p>/<ul>/<ol>) is not allowed`);
  }
  return blockNodes.map((block) => {
    if (block.tag === "p") {
      return {
        kind: "p",
        runs: collectRuns(block.children, {}, label, errors2, false),
        ...pickBlockStyleAttrs(block.attrs)
      };
    }
    return assembleList(block, label, errors2, 1);
  });
}
function extractFillNode(el, label, errors2) {
  let fillNode;
  const rest = [];
  for (const child of el.children) {
    if (child.type === "element" && child.tag === "fill") {
      if (fillNode) {
        errors2.push(`${label}: duplicate <fill> child`);
        continue;
      }
      fillNode = assembleFillNode(child, label, errors2);
      continue;
    }
    rest.push(child);
  }
  return { fillNode, rest };
}
function expectNoChildren(el, label, errors2) {
  for (const child of el.children) {
    if (!isWhitespaceText(child)) {
      errors2.push(`${label}: <${el.tag}> must not have child content`);
      return;
    }
  }
}
function assembleElement(el, index, errors2, options) {
  const label = `elements[${index}] <${el.tag}>${el.attrs.id ? ` (id: ${el.attrs.id})` : ""}`;
  const base = { ...mapElementAttrs(el.attrs), kind: el.tag };
  switch (el.tag) {
    case "text": {
      const { fillNode, rest } = extractFillNode(el, label, errors2);
      if (fillNode)
        base.fillNode = fillNode;
      base.blocks = assembleBlocks(rest, label, errors2);
      break;
    }
    case "shape": {
      const { fillNode, rest } = extractFillNode(el, label, errors2);
      if (fillNode)
        base.fillNode = fillNode;
      for (const child of rest) {
        if (!isWhitespaceText(child)) {
          errors2.push(`${label}: <shape> must not contain text or child elements — overlay a <text> element instead`);
          break;
        }
      }
      break;
    }
    case "image": {
      expectNoChildren(el, label, errors2);
      checkImageSrcForm(el.rawAttrs.src, label, errors2);
      break;
    }
    case "icon": {
      expectNoChildren(el, label, errors2);
      if (!options?.allowLegacyIconNames && /^fa[srb]:/.test(el.attrs.name ?? "")) {
        errors2.push(`${label}: FontAwesome-prefixed icon names (fas:/far:/fab:) are not supported — use a Lucide kebab-case name`);
      }
      break;
    }
    case "table": {
      const trs = [];
      for (const child of el.children) {
        if (isWhitespaceText(child))
          continue;
        if (child.type !== "element" || child.tag !== "tr") {
          errors2.push(`${label}: <table> only allows <tr> children`);
          continue;
        }
        const cells = [];
        for (const cell of child.children) {
          if (isWhitespaceText(cell))
            continue;
          if (cell.type !== "element" || cell.tag !== "td") {
            errors2.push(`${label}: <tr> only allows <td> children`);
            continue;
          }
          if (cell.attrs.dir !== undefined) {
            errors2.push(`${label}: <td> does not accept dir — use <p dir> inside the cell or dir on <table>`);
          }
          if (cell.attrs.lang !== undefined) {
            errors2.push(`${label}: <td> does not accept lang — use <p lang> inside the cell or lang on <table>`);
          }
          cells.push({
            ...mapElementAttrs(cell.attrs),
            blocks: assembleBlocks(cell.children, label, errors2)
          });
        }
        if (child.attrs.dir !== undefined) {
          errors2.push(`${label}: <tr> does not accept dir — use dir on <table> or <p dir> inside cells`);
        }
        if (child.attrs.lang !== undefined) {
          errors2.push(`${label}: <tr> does not accept lang — use lang on <table> or <p lang> inside cells`);
        }
        trs.push({ ...mapElementAttrs(child.attrs), cells });
      }
      base.trs = trs;
      break;
    }
    case "chart": {
      const series = [];
      for (const child of el.children) {
        if (isWhitespaceText(child))
          continue;
        if (child.type !== "element" || child.tag !== "series") {
          errors2.push(`${label}: <chart> only allows <series> children`);
          continue;
        }
        expectNoChildren(child, label, errors2);
        series.push(mapElementAttrs(child.attrs));
      }
      base.series = series;
      break;
    }
    default:
      errors2.push(`${label} is not a supported slide element`);
  }
  return base;
}
function assembleSlide(root, errors2, options) {
  if (root.tag !== "slide") {
    errors2.push(`Root element must be <slide> (got <${root.tag}>)`);
    return { elements: [] };
  }
  const slide = { elements: [] };
  if (root.attrs.id !== undefined)
    slide.id = root.attrs.id;
  if (root.attrs.background !== undefined)
    slide.background = root.attrs.background;
  for (const child of root.children) {
    if (child.type === "text" && child.text.trim() !== "") {
      errors2.push(`Unexpected text content inside <slide>: "${child.text.trim().slice(0, 40)}"`);
    }
  }
  const children = elementChildren(root);
  const elements = [];
  let sawBackground = false;
  children.forEach((child) => {
    if (child.tag === "background") {
      if (sawBackground) {
        errors2.push("<slide> must have exactly one <background> (duplicate found)");
        return;
      }
      sawBackground = true;
      slide.backgroundNode = assembleFillNode(child, "<background>", errors2);
      return;
    }
    if (!ELEMENT_TAGS.has(child.tag)) {
      errors2.push(`<${child.tag}> is not a supported slide element (allowed: background, text, shape, image, table, chart, icon)`);
      return;
    }
    elements.push(assembleElement(child, elements.length, errors2, options));
  });
  if (!sawBackground && slide.background === undefined) {
    errors2.push("<slide> is missing the required <background> child (write it explicitly, even for white)");
  }
  slide.elements = elements;
  return slide;
}
function formatZodError(zodError) {
  return zodError.issues.map((issue) => {
    const path15 = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    return `${path15}: ${issue.message}`;
  }).join(`
`);
}
function stripSlideXmlCodeFences(text) {
  return text.trim().replace(/^```(?:xml)?\s*/i, "").replace(/\s*```$/i, "").trim();
}
function validatePptxSlideXml(text, options) {
  const cleaned = stripSlideXmlCodeFences(text);
  const { root, errors: errors2 } = parseXml(cleaned);
  if (!root || errors2.length > 0) {
    return {
      success: false,
      error: errors2.length > 0 ? errors2.join(`
`) : "Document contains no XML element"
    };
  }
  const raw = assembleSlide(root, errors2, options);
  const result = slideSchema2.safeParse(raw);
  if (!result.success || errors2.length > 0) {
    const zodErrors = result.success ? [] : [formatZodError(result.error)];
    return {
      success: false,
      error: [...errors2, ...zodErrors].join(`
`)
    };
  }
  return { success: true, data: result.data };
}
var slideStateSchema2 = PptSlideEditorPptTypes.schema.slideState;
// shared/paletteContrast.ts
var TEXT_CONTRAST_NORMAL = 4.5;
var TEXT_CONTRAST_LARGE = 3;
var COLOR_CONTRAST_HEADING = "## Color contrast";
var HEX_PATTERN = /#[0-9a-f]{6}(?![0-9a-f])/i;
function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(a, b) {
  const [high, low] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}
function parseColorContrastSection(markdown) {
  const lines = markdown.split(`
`);
  const start = lines.findIndex((line) => line.trim() === COLOR_CONTRAST_HEADING);
  if (start < 0)
    return [];
  const restricted = [];
  for (let i = start + 1;i < lines.length; i += 1) {
    if (/^#{1,6}\s/.test(lines[i]))
      break;
    const row = splitRow(lines[i]);
    if (!row || row.length < 4)
      continue;
    const [token, hexCell, lowest, use] = row.map(cleanCell);
    const hex = hexCell.match(HEX_PATTERN)?.[0]?.toUpperCase();
    if (!hex || token === "token")
      continue;
    const kind = use.startsWith("large text") ? "large-only" : use.startsWith("graphics and fills only") ? "graphics-only" : undefined;
    if (!kind)
      continue;
    const match = use.match(/use (#[0-9a-f]{6})(?: \(([^)]+)\))?/i);
    restricted.push({
      token,
      hex,
      lowest,
      kind,
      replacement: match ? { hex: match[1].toUpperCase(), token: match[2] } : undefined
    });
  }
  return restricted;
}
function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|"))
    return null;
  const cells = trimmed.replace(/^\|/, "").replace(/\|$/, "").split("|");
  return cells.map((cell) => cell.trim());
}
function cleanCell(cell) {
  return cell.replace(/[`*]/g, "").trim();
}
function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16));
}

// shared/textColorLint.ts
var LARGE_TEXT_PX = 24;
var LARGE_BOLD_TEXT_PX = 19;
var MAX_LISTED = 6;
function isSmallText(sizePx, bold) {
  return bold ? sizePx < LARGE_BOLD_TEXT_PX : sizePx < LARGE_TEXT_PX;
}
function isCandidate(color, sizePx, bold) {
  if (color.kind === "graphics-only")
    return true;
  return sizePx !== undefined && isSmallText(sizePx, bold);
}
function judge(where, color, sizePx, bold, background) {
  if (!isCandidate(color, sizePx, bold))
    return;
  if (background?.kind === "non-solid")
    return;
  if (background?.kind === "solid") {
    const need = sizePx !== undefined && !isSmallText(sizePx, bold) ? TEXT_CONTRAST_LARGE : TEXT_CONTRAST_NORMAL;
    const ratio = contrastRatio(color.hex, background.hex);
    if (ratio >= need)
      return;
    const replacement = color.replacement && contrastRatio(color.replacement.hex, background.hex) >= need ? color.replacement : undefined;
    return {
      where,
      color: { ...color, replacement },
      sizePx,
      bold,
      actual: { ratio: Math.floor(ratio * 100) / 100, background: background.hex }
    };
  }
  return { where, color, sizePx, bold };
}
function normalizeHex(value) {
  const trimmed = value.trim();
  const hex = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i)?.[1];
  if (hex) {
    if (hex.length === 8)
      return /ff$/i.test(hex) ? `#${hex.slice(0, 6).toUpperCase()}` : undefined;
    const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    return `#${full.toUpperCase()}`;
  }
  const rgb = trimmed.match(/^rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/i);
  if (!rgb)
    return;
  if (rgb[4] !== undefined && !/^(1|1\.0+|100%)$/.test(rgb[4]))
    return;
  return `#${rgb.slice(1, 4).map((n) => Math.min(255, Number(n)).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}
function cssDeclarations(block) {
  const declarations = new Map;
  for (const part of block.split(";")) {
    const index = part.indexOf(":");
    if (index < 0)
      continue;
    declarations.set(part.slice(0, index).trim().toLowerCase(), part.slice(index + 1).replace(/!important/i, "").trim());
  }
  return declarations;
}
function cssPx(value) {
  if (!value)
    return;
  const match = value.match(/^(\d+(?:\.\d+)?)(px|rem)$/i);
  if (!match)
    return;
  return Number(match[1]) * (match[2].toLowerCase() === "rem" ? 16 : 1);
}
function cssBold(value) {
  if (!value)
    return false;
  if (/^(bold|bolder)$/i.test(value))
    return true;
  const weight = Number(value);
  return Number.isFinite(weight) && weight >= 700;
}
function lintHtmlTextColors(html, restricted) {
  if (restricted.length === 0)
    return [];
  const byHex = new Map(restricted.map((color) => [color.hex, color]));
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join(`
`).replace(/\/\*[\s\S]*?\*\//g, "");
  const variables = new Map;
  for (const match of css.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-f]{3,8}\b|rgba?\([^)]*\))/gi)) {
    const hex = normalizeHex(match[2]);
    if (hex)
      variables.set(match[1], hex);
  }
  const resolve = (value) => {
    if (!value)
      return;
    const variable = value.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)$/);
    if (variable)
      return variables.get(variable[1]) ?? (variable[2] ? normalizeHex(variable[2]) : undefined);
    return normalizeHex(value);
  };
  const backgroundOf = (declarations) => {
    const value = declarations.get("background-color") ?? declarations.get("background");
    if (!value)
      return declarations.has("background-image") ? { kind: "non-solid" } : undefined;
    if (/url\(|gradient\(/i.test(value) || declarations.has("background-image"))
      return { kind: "non-solid" };
    if (/^(transparent|none|inherit|initial|unset)$/i.test(value))
      return;
    const token = value.match(/var\(\s*--[\w-]+\s*(?:,[^)]*)?\)|#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/i)?.[0];
    const hex = token ? resolve(token) : undefined;
    return hex ? { kind: "solid", hex } : token ? { kind: "non-solid" } : undefined;
  };
  const rules = [];
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1].trim().replace(/\s+/g, " ");
    if (selector.startsWith("@") || /^(from|to|\d+%)$/.test(selector))
      continue;
    rules.push({ selectors: selector.split(",").map((part) => part.trim()), declarations: cssDeclarations(match[2]) });
  }
  const backgroundOfSelector = (compound) => {
    let found;
    for (const rule of rules) {
      if (!rule.selectors.includes(compound))
        continue;
      const background = backgroundOf(rule.declarations);
      if (background)
        found = background;
    }
    return found;
  };
  const pageBackground = [".slide-container", ".slide", "body", "html"].map(backgroundOfSelector).find((background) => background !== undefined);
  const backgroundFor = (selector, declarations) => {
    const own = backgroundOf(declarations);
    if (own)
      return own;
    const compounds = selector.split(/\s*[>+~]\s*|\s+/).filter(Boolean);
    for (let i = compounds.length - 2;i >= 0; i -= 1) {
      const background = backgroundOfSelector(compounds[i]);
      if (background)
        return background;
    }
    return pageBackground;
  };
  const findings = [];
  const seen = new Set;
  const check = (where, declarations, background) => {
    const hex = resolve(declarations.get("color"));
    const color = hex ? byHex.get(hex) : undefined;
    if (!color)
      return;
    const finding = judge(where, color, cssPx(declarations.get("font-size")), cssBold(declarations.get("font-weight")), background);
    if (!finding)
      return;
    const key = `${where}|${hex}`;
    if (seen.has(key))
      return;
    seen.add(key);
    findings.push(finding);
  };
  for (const rule of rules) {
    const selector = rule.selectors.join(", ");
    check(selector, rule.declarations, backgroundFor(rule.selectors[0], rule.declarations));
  }
  for (const match of html.matchAll(/<([a-z][\w-]*)\b[^>]*\sstyle\s*=\s*"([^"]*)"/gi)) {
    const declarations = cssDeclarations(match[2].replace(/&quot;/g, '"'));
    check(`<${match[1].toLowerCase()} style="…">`, declarations, backgroundOf(declarations) ?? pageBackground);
  }
  return findings;
}
var PPTX_TEXT_TAGS = new Set(["text", "p", "ul", "ol", "li", "strong", "em", "u", "s", "sup", "sub", "span", "a", "table", "tr", "td"]);
var PPTX_DEFAULT_SIZE = 18;
function xmlAttributes(source) {
  const attributes = new Map;
  for (const match of source.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g))
    attributes.set(match[1], match[2]);
  return attributes;
}
function numberAttribute(attributes, ...names) {
  for (const name of names) {
    const value = Number(attributes.get(name));
    if (Number.isFinite(value))
      return value;
  }
  return;
}
function lintPptxTextColors(slideXml, designXml, restricted) {
  if (restricted.length === 0)
    return [];
  const byHex = new Map(restricted.map((color) => [color.hex, color]));
  const colors = new Map;
  const fonts = new Map;
  for (const match of designXml.matchAll(/<(color|font)\b([^>]*)\/?>/g)) {
    const attributes = xmlAttributes(match[2]);
    const name = attributes.get("name");
    if (!name)
      continue;
    if (match[1] === "color") {
      const hex = normalizeHex(attributes.get("value") ?? "");
      if (hex)
        colors.set(name, hex);
    } else {
      const size = Number(attributes.get("size"));
      if (Number.isFinite(size) && size > 0)
        fonts.set(name, size);
    }
  }
  const resolveColor = (value) => value === undefined ? undefined : colors.get(value) ?? normalizeHex(value);
  const fillOf = (value) => {
    if (value === undefined || /^(none|transparent)$/i.test(value))
      return;
    const hex = resolveColor(value);
    return hex ? { kind: "solid", hex } : { kind: "non-solid" };
  };
  const source = slideXml.replace(/<!--[\s\S]*?-->/g, "");
  let pageBackground;
  const backgroundTag = source.match(/<background\b([^>]*?)(\/?)>/);
  if (backgroundTag) {
    const attributes = xmlAttributes(backgroundTag[1]);
    const type = attributes.get("type");
    pageBackground = type && type !== "solid" ? { kind: "non-solid" } : fillOf(attributes.get("color"));
  }
  const regions = [];
  for (const match of source.matchAll(/<(shape|image)\b([^>]*?)\/?>/g)) {
    const attributes = xmlAttributes(match[2]);
    const x = numberAttribute(attributes, "x");
    const y = numberAttribute(attributes, "y");
    const width = numberAttribute(attributes, "width", "w");
    const height = numberAttribute(attributes, "height", "h");
    if (x === undefined || y === undefined || !width || !height)
      continue;
    const background = match[1] === "image" ? { kind: "non-solid" } : fillOf(attributes.get("fill"));
    if (background)
      regions.push({ index: match.index ?? 0, x, y, width, height, background });
  }
  const backgroundUnder = (index, attributes) => {
    const x = numberAttribute(attributes, "x");
    const y = numberAttribute(attributes, "y");
    const width = numberAttribute(attributes, "width", "w") ?? 0;
    const height = numberAttribute(attributes, "height", "h") ?? 0;
    if (x === undefined || y === undefined)
      return pageBackground;
    const cx = x + width / 2;
    const cy = y + height / 2;
    let found;
    for (const region of regions) {
      if (region.index > index)
        break;
      if (cx >= region.x && cx <= region.x + region.width && cy >= region.y && cy <= region.y + region.height)
        found = region.background;
    }
    return found ?? pageBackground;
  };
  const findings = [];
  const stack = [];
  const tokens = source.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>|([^<]+)/g);
  for (const match of tokens) {
    const [, closing, rawTag, rawAttributes, selfClosing, text] = match;
    if (text !== undefined) {
      const frame2 = stack.at(-1);
      if (!frame2 || !frame2.owner || frame2.owner.reported || !frame2.hex || !text.trim())
        continue;
      const color = byHex.get(frame2.hex);
      if (!color)
        continue;
      const snippet = text.trim().replace(/\s+/g, " ").slice(0, 24);
      const finding = judge(`<${frame2.where ?? frame2.tag}> "${snippet}"`, color, frame2.sizePx, frame2.bold, frame2.background);
      if (!finding)
        continue;
      frame2.owner.reported = true;
      findings.push(finding);
      continue;
    }
    const tag = rawTag.toLowerCase();
    if (closing) {
      const index = stack.map((frame2) => frame2.tag).lastIndexOf(tag);
      if (index >= 0)
        stack.length = index;
      continue;
    }
    if (!PPTX_TEXT_TAGS.has(tag))
      continue;
    const parent = stack.at(-1);
    const attributes = xmlAttributes(rawAttributes);
    const font = attributes.get("font");
    const explicitSize = Number(attributes.get("size"));
    const sizePx = Number.isFinite(explicitSize) && explicitSize > 0 ? explicitSize : font !== undefined ? fonts.get(font) ?? PPTX_DEFAULT_SIZE : parent?.sizePx;
    let background = fillOf(attributes.get("fill"));
    if (tag === "tr" && parent?.tag === "table") {
      parent.rows = (parent.rows ?? 0) + 1;
      if (!background && parent.rows === 1)
        background = parent.headerFill;
    }
    if (!background)
      background = parent ? parent.background : backgroundUnder(match.index ?? 0, attributes);
    const frame = {
      tag,
      hex: resolveColor(attributes.get("color")) ?? parent?.hex,
      sizePx,
      bold: tag === "strong" || Boolean(parent?.bold),
      owner: attributes.get("color") ? { reported: false } : parent?.owner,
      where: attributes.get("color") ? `${tag} color="${attributes.get("color")}"` : parent?.where,
      background,
      headerFill: tag === "table" ? fillOf(attributes.get("header-fill")) : undefined
    };
    if (!selfClosing)
      stack.push(frame);
  }
  return findings;
}
function describe(finding) {
  const { color, sizePx, bold, actual } = finding;
  const size = sizePx === undefined ? "" : ` at ${sizePx} px${bold ? " bold" : ""}`;
  const measured = actual ? `${actual.ratio}:1 on ${actual.background} here` : color.lowest;
  const limit = actual ? `below the ${sizePx !== undefined && !isSmallText(sizePx, Boolean(bold)) ? TEXT_CONTRAST_LARGE : TEXT_CONTRAST_NORMAL}:1 text minimum` : color.kind === "graphics-only" ? "graphics and fills only, never text" : "large text only (≥ 24 px, or ≥ 19 px at font-weight 700+)";
  const replacement = color.replacement ? `use ${color.replacement.hex}${color.replacement.token ? ` (${color.replacement.token})` : ""}` : 'use a body/muted text token marked "any text"';
  const fix = color.kind === "large-only" ? `${replacement} or set it to ≥ 24 px` : replacement;
  return `- ${finding.where}${size}: ${color.hex} (${color.token}, ${measured}) is ${limit} — ${fix}.`;
}
function formatTextColorIssue(findings, fileLabel) {
  if (findings.length === 0)
    return;
  const listed = findings.slice(0, MAX_LISTED).map(describe);
  const more = findings.length > MAX_LISTED ? `
- …and ${findings.length - MAX_LISTED} more with the same colors.` : "";
  return `Text color check for \`${fileLabel}\` (the design brief's **Color contrast** section): ` + `${findings.length === 1 ? "one text style uses a color" : `${findings.length} text styles use colors`} reserved for large text or graphics.
` + `${listed.join(`
`)}${more}
` + "Change only these text colors in this file; keep the original colors on fills, lines, charts and large numerals. " + "This check reads the source, not the render: if one of these texts actually sits on a dark panel or a photo where it already reads clearly, leave it as is.";
}

// mcp/tools/inspectAfterFileEdit.ts
var inspectAfterFileEditTool = {
  visible: false,
  definition: {
    name: INSPECT_AFTER_FILE_EDIT_TOOL,
    description: "Inspect a Slides HTML file after the host reports a completed file edit.",
    inputSchema: { type: "object", properties: {} }
  },
  async execute({ store, sync, client, callContext }, args) {
    const project = store.resolveProject(args);
    if (!project) {
      throw new Error("Slides file-edit hook requires an exact project_id, resource_uri, or project_dir target.");
    }
    const relativePath = safeProjectRelativePath(args?.file_path ?? args?.filePath ?? args?.path, project.activeFile || "cover.html");
    if (isPptxModeProject(project)) {
      return inspectPptxFileEdit({ store, sync, client, project, relativePath });
    }
    if (!/\.html?$/i.test(relativePath))
      return createHookResult([]);
    const slideID = path15.basename(relativePath, path15.extname(relativePath));
    if (!slideIdsOfProject(project).includes(slideID))
      return createHookResult([]);
    const file2 = store.readProjectFile(project, relativePath);
    const htmlPath = path15.join(project.projectDir, relativePath);
    if (!file2) {
      return createHookResult([`The edited Slides HTML file could not be read: ${htmlPath}.`], { htmlPath });
    }
    const xmlRoot = strayPptxXmlRootOf(project, file2.content);
    if (xmlRoot) {
      const hasSavedVersion = outlineOfProject(project).some((entry) => String(entry.id) === slideID && entry.state === SLIDE_STATE_EDITED);
      return createHookResult([
        `This is an HTML deck, but this page is manus-pptx XML (<${xmlRoot}>), ` + (hasSavedVersion ? "so this edit was not saved; the deck still has the previous version of this page. " : "so it was not saved to the deck. ") + "Rewrite it as a complete HTML document following the skill's html-syntax.md."
      ], { htmlPath });
    }
    const html = repairHTMLSnapshot(file2.content);
    const issues = inspectSlideHTML(html);
    issues.push(...textColorIssues(store, project, relativePath, (restricted) => lintHtmlTextColors(html, restricted)));
    const edited = projectAfterFileEdit(project, relativePath, html);
    const pushEdited = async () => {
      const pushed = await sync.pushEdit(project.id, rebaseFileEdit(relativePath, html, edited), "runtime_mcp_file_edit");
      if (!pushed)
        issues.push(slideRemovedIssue(relativePath));
    };
    const [assetIssues, measured, templateText] = await Promise.all([
      syncAssetsForHook(store, edited, project, client, { fileName: relativePath, content: html }),
      measureSlideOverflow(htmlPath).then((value) => ({ value }), (error) => ({ error })),
      nextPendingTemplateText(client, edited)
    ]);
    issues.push(...assetIssues);
    let measurement;
    if ("value" in measured) {
      measurement = measured.value;
      if (measurement.loadTimedOut) {
        sync.trackBackground(client.reportRuntimeFailure("measure_load_timeout", path15.basename(htmlPath)).catch(() => {
          return;
        }));
      }
    } else {
      const error = measured.error;
      sync.trackBackground(client.reportRuntimeFailure("measure_overflow_failed", error instanceof Error ? error.message : String(error)).catch(() => {
        return;
      }));
      issues.push(`Could not measure the 1280x720 canvas: ${error instanceof Error ? error.message : error}`);
    }
    if (measurement?.overflow) {
      if (args?.supports_effects === "true" || args?.supports_effects === true) {
        return createModelCallEffectResult({
          project,
          relativePath,
          html,
          contentSha256: createHash7("sha256").update(file2.content).digest("hex"),
          height: measurement.height,
          issues
        });
      }
      const continuation = callContext?.continuation;
      if (!continuation) {
        issues.push("The Host did not provide a continuation capability, so automatic overflow repair could not start.");
        await pushEdited().catch(() => {
          return;
        });
        return createHookResult(issues, { htmlPath, height: measurement.height, appendText: templateText });
      }
      try {
        await client.startFileEditRepair({
          invocation_id: continuation.id,
          callback_url: continuation.callbackUrl,
          capability: continuation.capability,
          expires_at: continuation.expiresAtMs,
          project: projectConfig(edited),
          project_id: project.id,
          resource_uri: project.resourceUri,
          file_path: relativePath,
          final_content: html,
          measured_height: measurement.height,
          issues
        });
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        issues.push(`The slide measures ${measurement.height}px (canvas is 720px) and automatic overflow repair could not start ` + `(the Slides addon server is unavailable, its credentials are missing, or it rejected the callback ` + `origin ${callbackOriginLabel(continuation.callbackUrl)}: ${reason}). ` + "Rewrite this slide so all content fits inside the 1280x720 .slide-container, or tell the user the automatic repair service is temporarily unavailable.");
        await pushEdited().catch(() => {
          return;
        });
        return createHookResult(issues, { htmlPath, height: measurement.height });
      }
      return createPendingHookResult(continuation.id, measurement.height);
    }
    await pushEdited();
    issues.push(...repeatedImageIssues(store, project, relativePath, html));
    return createHookResult(issues, { htmlPath, height: measurement?.height, appendText: templateText });
  }
};
async function inspectPptxFileEdit(input) {
  const { store, sync, client, project, relativePath } = input;
  if (!/\.xml$/i.test(relativePath))
    return createHookResult([]);
  const isDesign = relativePath === PPTX_DESIGN_FILE;
  const slideID = path15.basename(relativePath, path15.extname(relativePath));
  if (!isDesign && !slideIdsOfProject(project).includes(slideID))
    return createHookResult([]);
  const filePath = path15.join(project.projectDir, relativePath);
  const file2 = store.readProjectFile(project, relativePath);
  if (!file2) {
    return createHookResult([`The edited Slides XML file could not be read: ${filePath}.`], { htmlPath: filePath });
  }
  const issues = [];
  let content = file2.content;
  if (isDesign) {
    try {
      const normalized = normalizePptxDesignXml(content, PPTX_CANVAS_SIZE);
      if (normalized !== content) {
        store.writeContentFile(project, relativePath, normalized);
        content = normalized;
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      issues.push(`\`${PPTX_DESIGN_FILE}\` failed manus-pptx design validation:
${reason}
` + `Fix \`${filePath}\` with the native file tool before presenting (see the skill's pptx-xml-syntax.md); ` + "slides/present re-validates it and will fail until it passes. Note the deck canvas is fixed at 1280x720.");
    }
  } else {
    const stripped = stripSlideXmlCodeFences(content);
    if (stripped !== content) {
      store.writeContentFile(project, relativePath, stripped);
      content = stripped;
    }
    const recovered = recoverOverEscapedSlideXml(content);
    if (recovered !== content) {
      store.writeContentFile(project, relativePath, recovered);
      content = recovered;
      issues.push(`\`${relativePath}\` was written with the entire XML document entity-escaped (\`&lt;slide&gt;...\`). ` + "It has been auto-recovered to raw markup this time — always write structural tags as raw `<`/`>` and " + "only escape literal `<` `>` `&` inside visible text.");
    }
    const validation = validatePptxSlideXml(content);
    if (validation.success === false) {
      issues.push(`\`${relativePath}\` is not valid manus-pptx XML:
${validation.error}
` + `Rewrite \`${filePath}\` with the native file tool to fix these issues (see the skill's pptx-xml-syntax.md); ` + "slides/present re-validates every page and will fail until it passes.");
    }
    const design = store.readProjectFile(project, PPTX_DESIGN_FILE)?.content ?? "";
    issues.push(...textColorIssues(store, project, relativePath, (restricted) => lintPptxTextColors(content, design, restricted)));
  }
  const edited = projectAfterFileEdit(project, relativePath, content);
  issues.push(...await syncAssetsForHook(store, edited, project, client, { fileName: relativePath, content }));
  if (!isDesign)
    issues.push(...repeatedImageIssues(store, project, relativePath, content));
  const pushed = await sync.pushEdit(project.id, rebaseFileEdit(relativePath, content, edited), "runtime_mcp_file_edit");
  if (!pushed)
    issues.push(slideRemovedIssue(relativePath));
  return createHookResult(issues, { htmlPath: filePath });
}
function textColorIssues(store, project, relativePath, lint) {
  try {
    const brief = store.readProjectFile(project, DESIGN_BRIEF_FILE)?.content;
    if (!brief)
      return [];
    const restricted = parseColorContrastSection(brief);
    if (restricted.length === 0)
      return [];
    const issue = formatTextColorIssue(lint(restricted), relativePath);
    return issue ? [issue] : [];
  } catch {
    return [];
  }
}
async function syncAssetsForHook(store, edited, storeProject, client, page) {
  const issues = [];
  try {
    const { missing, outsideWorkspace, unsupported } = await syncProjectAssets(edited, client, RESOURCE_KEY, workspaceAssetReader(store.workspaceRoot));
    if (missing.length > 0) {
      issues.push(`The slide references local files that do not exist in the sandbox: ${missing.join(", ")}. ` + "These images will appear broken in the Manus UI. Create the files (or fix the references) and edit the slide again.");
    }
    if (outsideWorkspace.length > 0) {
      issues.push(outsideWorkspaceIssue(outsideWorkspace, edited.projectDir));
    }
    const unsupportedIssue = exportBlockingUnsupportedIssue(unsupported, page, edited.projectDir || "/");
    if (unsupportedIssue)
      issues.push(unsupportedIssue);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    issues.push(`Slide image assets could not be uploaded to the Slides addon server (${reason}). ` + "The edit is still saved, but images referenced by this slide may not display in the Manus UI yet. " + "Editing the slide again later will retry the upload.");
  }
  const assets = assetMapFromViewState(edited.viewState);
  if (Object.keys(assets).length > 0) {
    storeProject.viewState = {
      ...storeProject.viewState,
      assets: { ...assetMapFromViewState(storeProject.viewState), ...assets }
    };
  }
  return issues;
}
var APPROVED_SCRIPT_CDN = /^https:\/\/(?:cdn\.jsdelivr\.net|d3js\.org|cdnjs\.cloudflare\.com|cdn\.tailwindcss\.com)(?:[/?#]|$)/i;
function inspectSlideHTML(html) {
  const issues = [];
  const missingDocumentParts = [
    !/<!doctype\s+html/i.test(html) ? "`<!DOCTYPE html>`" : undefined,
    !/<html[\s>]/i.test(html) ? "`<html>`" : undefined,
    !/<body[\s>]/i.test(html) ? "`<body>`" : undefined
  ].filter((part) => part !== undefined);
  if (missingDocumentParts.length > 0) {
    issues.push(`The file is not a complete HTML document (missing ${missingDocumentParts.join(", ")}). ` + "Each slide must be a full standalone document — `<!DOCTYPE html>` + `<html>` + `<head>` (inline styles " + "or approved CDN includes) + `<body>` wrapping the `.slide-container` — a bare markup fragment renders as " + "unstyled text. Rewrite the whole file following the skeleton in the skill's html-syntax.md.");
  }
  if (/<deck-stage\b/i.test(html)) {
    issues.push("Found a `<deck-stage>` element. Slides are standalone self-contained HTML documents — render the slide content directly (wrap it in a `.slide-container`), not via a deck-stage runtime.");
  }
  for (const match of html.matchAll(/<script\b[^>]*\bsrc=["']?([^"'\s>]+)/gi)) {
    if (APPROVED_SCRIPT_CDN.test(match[1]))
      continue;
    issues.push(`Found an external \`<script src="${match[1]}">\` outside the approved CDN list (cdn.jsdelivr.net, d3js.org, cdnjs.cloudflare.com, cdn.tailwindcss.com). ` + "Apart from the approved chart/icon/utility libraries, each slide must be fully self-contained — inline all other scripts and assets.");
    break;
  }
  if (!/class=["'][^"']*\bslide-container\b/i.test(html)) {
    issues.push('No `.slide-container` wrapper found. Wrap the slide content in a single `<div class="slide-container">` (1280x720) so the Studio editor treats it as the slide frame.');
  }
  if (/class=["'][^"']*-\[/i.test(html) && !/<script\b[^>]*\bsrc=["']?https:\/\/cdn\.tailwindcss\.com/i.test(html)) {
    issues.push("Tailwind arbitrary-value classes (e.g. `bg-[#002B5B]`) were found, but the Tailwind Play CDN script is not included — " + 'these classes render with NO styling. Add `<script src="https://cdn.tailwindcss.com"></script>` to `<head>`, ' + "or rewrite the styling as native CSS in the `<style>` block.");
  }
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const bodyText = (bodyMatch?.[1] ?? html).replace(/<[^>]+>/g, "").trim();
  if (!bodyText) {
    issues.push("The slide appears empty. A slide must be a 1280x720 document with visible content.");
  }
  if (/<svg\b/i.test(html)) {
    issues.push("Inline SVG was found. Replace it with HTML/CSS or an image asset.");
  }
  if (/{{\s*[^}]+\s*}}|__[^_]+__|TODO_SLIDE|PLACEHOLDER|LOREM IPSUM/i.test(html)) {
    issues.push("Unreplaced template placeholder text was found. Replace placeholders with final slide content.");
  }
  return issues;
}
function callbackOriginLabel(callbackUrl) {
  try {
    return new URL(callbackUrl).origin;
  } catch {
    return JSON.stringify(callbackUrl.slice(0, 100));
  }
}
function createPendingHookResult(invocationID, height) {
  const pending = { status: "pending", invocation_id: invocationID, height };
  return {
    content: [{ type: "text", text: JSON.stringify(pending) }],
    structuredContent: pending
  };
}
var REPAIR_SYSTEM_PROMPT = "You repair a single self-contained HTML presentation slide. Return only the complete HTML document, with no markdown fence or commentary. Preserve the meaning and visual style while fitting every visible element inside a fixed 1280x720 .slide-container. Prefer tightening spacing, typography, and composition over deleting information. Preserve any existing Chart.js/D3/Font Awesome/Google Fonts CDN references and chart code exactly; they are the only allowed external references. Keep the slide static and otherwise self-contained — no other external scripts, and no inline SVG, animation, transition, or hover-only behavior.";
function createModelCallEffectResult(input) {
  const effect = {
    type: "model_call",
    params: {
      model: "gpt-5-mini",
      system: REPAIR_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `The current slide measures ${input.height}px high and must fit within 720px.` + `${input.issues.length ? `
Inspection notes:
- ${input.issues.join(`
- `)}` : ""}` + `

Current HTML:
${input.html}`
        }
      ]
    },
    input: {
      project_id: input.project.id,
      file_path: input.relativePath,
      content_sha256: input.contentSha256,
      ...input.project.resourceUri ? { resource_uri: input.project.resourceUri } : {}
    },
    resume: { tool: APPLY_FILE_EDIT_HOOK_RESULT_TOOL },
    delivery: "defer_tool_result",
    timeout_ms: 240000,
    idempotency_hint: input.relativePath
  };
  return {
    content: [{ type: "text", text: `Slide overflows (${input.height}px > 720px); host-side repair requested.` }],
    structuredContent: { effects: [effect] }
  };
}
function createHookResult(issues, context = {}) {
  const agentReminder = buildAgentReminder(issues, context);
  return {
    content: [
      {
        type: "text",
        text: agentReminder ?? "Slides inspection passed."
      }
    ],
    structuredContent: {
      ...agentReminder ? { agent_reminder: agentReminder } : {},
      ...context.height ? { height: context.height } : {}
    }
  };
}
function buildAgentReminder(issues, context) {
  const sections = [];
  if (issues.length) {
    const location = context.htmlPath ? ` \`${context.htmlPath}\`` : "";
    const body = issues.map((issue, index) => `${index + 1}. ${issue}`).join(`
`);
    sections.push(`The Slides addon inspected${location} after your edit.
Please fix these issues before presenting the deck:

${body}`);
  }
  if (context.appendText) {
    sections.push(context.appendText);
  }
  if (!sections.length)
    return;
  return `<system_reminder>
${sections.join(`

`)}
</system_reminder>`;
}

// mcp/tools/organizeSlides.ts
var organizeSlidesTool = {
  definition: {
    name: "organize_slides",
    description: "Modify the structure of the Slides project identified by required project_id. Use this instead of calling " + "slides/init_slides again when adding pages to an existing deck. " + "Add all new slides in one call, edit added slides afterward, and provide the complete active slide set when " + "reordering.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          minLength: 1,
          description: "Required exact deck id returned by slides/init_slides or slides/attach_slides."
        },
        operation: {
          type: "string",
          enum: ["add", "delete", "reorder"],
          description: "Structural operation to perform on the identified deck."
        },
        slide_data: {
          type: "array",
          description: "Slide modifications. add: new slide definitions; delete: targets; reorder: every active slide in the " + "desired order.",
          minItems: 1,
          items: {
            type: "object",
            properties: {
              slide_id: {
                type: "string",
                pattern: "^[a-z0-9_]+$",
                description: "Slide id to add, delete, or reorder."
              },
              slide_number: {
                type: "integer",
                minimum: 1,
                description: "Optional 1-based target for delete/reorder. Prefer slide_id."
              },
              page_title: { type: "string", description: "Title of a new slide." },
              summary: { type: "string", description: "One- or two-sentence content summary." },
              slide_template_key: {
                type: "string",
                description: "Template page ID this slide should follow (from the slides/get_template page catalog). On a " + "templated deck, give every added slide a valid key so its template page HTML is injected " + "before you author it."
              },
              position: {
                type: "integer",
                minimum: 1,
                description: "1-based insertion position for add; defaults to the end."
              }
            },
            anyOf: [{ required: ["slide_id"] }, { required: ["slide_number"] }]
          }
        }
      },
      required: ["project_id", "operation", "slide_data"]
    }
  },
  async execute({ store, sync, client }, args) {
    const project = store.requireProject(args);
    const operation = String(args?.operation ?? "").trim();
    let slideIds = [...slideIdsOfProject(project)];
    let outline = outlineOfProject(project).map((entry) => ({ ...entry }));
    const outlineById = new Map(outline.map((entry) => [String(entry.id), entry]));
    const slideData = Array.isArray(args?.slide_data) ? args.slide_data : Array.isArray(args?.slides) ? args.slides : [];
    if (operation === "add") {
      const items = slideData;
      if (!items.length) {
        throw new Error("add requires non-empty slide_data with {slide_id, page_title, summary, position?}.");
      }
      const taken = new Set(slideIds);
      for (const item of items) {
        const record = item && typeof item === "object" ? item : {};
        const slideTitle = safeTitle(record.page_title ?? record.title);
        const rawId = record.id ?? record.slide_id ?? record.slideId;
        let id;
        if (rawId !== undefined && rawId !== null && String(rawId).trim()) {
          id = slugifySlideId(rawId);
          if (!id)
            throw new Error(`Invalid slide id "${rawId}". Use lowercase letters, digits, and underscores.`);
          if (taken.has(id))
            throw new Error(`Duplicate slide id "${id}". Slide ids must be unique within the deck.`);
        } else {
          id = allocateSlideId(slideTitle, taken);
        }
        if (isPptxModeProject(project) && PPTX_RESERVED_SLIDE_IDS.includes(id)) {
          throw new Error(`Invalid slide id(s): ${id}. The id "design" is reserved and cannot be used as a slide id.`);
        }
        taken.add(id);
        const position = optionalPositiveInteger(record.position, "position");
        const insertAt = position ? Math.min(Math.max(position - 1, 0), slideIds.length) : slideIds.length;
        slideIds.splice(insertAt, 0, id);
        const entry = {
          id,
          title: slideTitle,
          summary: String(record.summary ?? ""),
          ...record.slide_template_key || record.slideTemplateKey ? { slide_template_key: String(record.slide_template_key ?? record.slideTemplateKey) } : {},
          state: SLIDE_STATE_EDIT_PENDING
        };
        outline.splice(insertAt, 0, entry);
        outlineById.set(id, entry);
      }
    } else if (operation === "delete") {
      const items = slideData;
      if (!items.length) {
        throw new Error("delete requires non-empty slide_data with {slide_id} or {slide_number}.");
      }
      const removeIds = new Set;
      for (const item of items) {
        const id = resolveSlideId(project, item && typeof item === "object" ? item : {});
        if (!id) {
          throw new Error(`Unknown slide to delete. The deck has slides: ${slideIds.join(", ") || "(none)"}. ` + "Pass an existing slide_id or 1-based slide_number.");
        }
        removeIds.add(id);
      }
      slideIds = slideIds.filter((id) => !removeIds.has(id));
      outline = outline.filter((entry) => !removeIds.has(String(entry.id)));
      for (const id of removeIds)
        store.deleteContentFile(project, slidePageFileName(project, id));
      const removedPaths = new Set([...removeIds].map((id) => slidePageFileName(project, id)));
      project.files = project.files.filter((file2) => !removedPaths.has(file2.path));
    } else if (operation === "reorder") {
      const order = slideData.length ? slideData : Array.isArray(args?.order) ? args.order : [];
      const requested = order.map((value) => {
        if (value && typeof value === "object")
          return resolveSlideId(project, value);
        const asNumber = Number(value);
        if (Number.isInteger(asNumber) && String(value).trim() && asNumber >= 1)
          return slideIds[asNumber - 1];
        const id = slugifySlideId(value);
        return slideIds.includes(id) ? id : undefined;
      });
      const current = new Set(slideIds);
      const seen = new Set;
      const duplicates = [];
      const extra = [];
      requested.forEach((id, index) => {
        if (!id || !current.has(id)) {
          extra.push(String(order[index]));
        } else if (seen.has(id)) {
          duplicates.push(id);
        } else {
          seen.add(id);
        }
      });
      const missing = slideIds.filter((id) => !seen.has(id));
      if (missing.length || extra.length || duplicates.length) {
        const parts = [];
        if (missing.length)
          parts.push(`Missing: ${missing.join(", ")}`);
        if (extra.length)
          parts.push(`Extra/unknown: ${extra.join(", ")}`);
        if (duplicates.length)
          parts.push(`Duplicate: ${duplicates.join(", ")}`);
        throw new Error(`reorder requires the COMPLETE set of active slide ids exactly once. ${parts.join("; ")}. ` + `Active slides: ${slideIds.join(", ")}.`);
      }
      slideIds = requested.filter((id) => Boolean(id));
      outline = slideIds.map((id) => outlineById.get(id) ?? { id, title: id, state: SLIDE_STATE_EDIT_PENDING });
    } else {
      throw new Error(`Unknown operation "${operation}". Use one of: add, delete, reorder.`);
    }
    project.viewState = { ...project.viewState, slide_ids: slideIds, outline };
    const activeId = String(project.activeFile ?? "").replace(/\.(html?|xml)$/i, "");
    if (!slideIds.includes(activeId)) {
      project.activeFile = slideIds[0] ? slidePageFileName(project, slideIds[0]) : project.activeFile;
    }
    await sync.push(project);
    return createOrganizeSlidesResult(project, operation, client);
  }
};
async function createOrganizeSlidesResult(project, operation, client) {
  const outline = outlineOfProject(project);
  const next = outline.find((entry) => entry.state !== "edited");
  const imageMode = isImageModeProject(project);
  const pptxMode = isPptxModeProject(project);
  const nextStep = next ? imageMode ? `Next, generate the still-pending slide "${next.id}.html"${next.title ? ` (${next.title})` : ""} with slides/generate_image_slide and project_id="${project.id}".` : pptxMode ? `Next, write the complete manus-pptx XML for the still-pending slide to "${project.projectDir}/${next.id}.xml"${next.title ? ` (${next.title})` : ""} with the native file tool (see the skill's pptx-xml-syntax.md).` : `Next, write the complete HTML for the still-pending slide to "${project.projectDir}/${next.id}.html"${next.title ? ` (${next.title})` : ""} with the native file tool.` : imageMode ? `All slides are edited — call slides/present with project_id="${project.id}" to deliver the deck.` : `All slides are edited — call slides/present with project_id="${project.id}" to QA-gate and deliver the deck.`;
  const templateText = operation === "add" ? await nextPendingTemplateText(client, project) : "";
  return {
    content: [
      {
        type: "text",
        text: `Deck updated (${operation}). project_id=${project.id}. ${slideIdsOfProject(project).length} slide(s).

` + `Deck:
${renderOutlineTree(project)}

${nextStep}` + (templateText ? `

${templateText}` : "")
      }
    ],
    structuredContent: {
      project_id: project.id,
      operation,
      slide_ids: slideIdsOfProject(project),
      next_pending: next?.id,
      outline
    }
  };
}

// mcp/tools/presentSlides.ts
var presentSlidesTool = {
  definition: {
    name: "present",
    description: "Completion gate + delivery for the deck identified by required project_id. Errors and lists the pending slides if " + "any slide is still edit_pending; otherwise returns its manus-resource:// delivery card.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          minLength: 1,
          description: "Required exact deck id returned by slides/init_slides or slides/attach_slides."
        },
        title: { type: "string", description: "Optional updated deck title." }
      },
      required: ["project_id"]
    }
  },
  async execute({ store, sync, client }, args) {
    let project = store.requireProject(args);
    const slideIds = slideIdsOfProject(project);
    if (!slideIds.length) {
      throw new Error("Cannot present an empty deck. Add slides with slides/init_slides / slides/organize_slides first.");
    }
    const diskFiles = slideIds.map((id) => store.readProjectFile(project, slidePageFileName(project, id))).filter((file2) => file2 !== undefined);
    const previousStates = new Map(outlineOfProject(project).map((entry) => [String(entry.id), entry.state]));
    const derivedProject = withDerivedOutlineStates({
      ...project,
      files: mergeFiles(project.files, diskFiles)
    });
    assertHtmlDeckPagesAreNotPptxXml(derivedProject, slideIds);
    project.files = derivedProject.files;
    project.viewState = {
      ...derivedProject.viewState,
      outline: outlineOfProject(derivedProject).map((entry) => previousStates.get(String(entry.id)) === SLIDE_STATE_EDITED ? { ...entry, state: SLIDE_STATE_EDITED } : entry)
    };
    store.cache(project);
    const title = args?.title ?? args?.deck_title;
    if (typeof title === "string" && title.trim())
      project.title = safeTitle(title);
    const byId = new Map(outlineOfProject(project).map((entry) => [String(entry.id), entry]));
    const pending = slideIds.filter((id) => byId.get(id)?.state !== SLIDE_STATE_EDITED);
    if (pending.length) {
      const extension = slidePageExtension(project);
      const authoringGuidance = isImageModeProject(project) ? `Finish each with slides/generate_image_slide using project_id="${project.id}", then call slides/present with the same project_id.` : isPptxModeProject(project) ? `Write each complete manus-pptx XML document (\`<id>.xml\`) under "${project.projectDir}" with the native file tool ` + `(write \`${PPTX_DESIGN_FILE}\` first if it does not exist yet; see the skill's pptx-xml-syntax.md), ` + `then call slides/present with the same project_id.` : `Write each complete HTML document under "${project.projectDir}" with the native file tool, then call slides/present with the same project_id.` + strayXmlPagesNote(store, project, pending);
      throw new Error(`Cannot present: ${pending.length} slide(s) still edit_pending — ${pending.map((id) => `${id}.${extension}`).join(", ")}. ` + authoringGuidance);
    }
    if (isPptxModeProject(project)) {
      assertPptxDeckPresentable(store, project, slideIds);
    }
    const exportPaths = exportLoadedReferencePaths(slidePages(project, slideIds), project.projectDir || "/");
    let uploadFailure;
    let skipped = { outsideWorkspace: [], unsupported: [] };
    try {
      skipped = await syncProjectAssets(project, client, RESOURCE_KEY, workspaceAssetReader(store.workspaceRoot), (path16) => exportPaths.has(path16));
    } catch (error) {
      uploadFailure = error instanceof Error ? error.message : String(error);
    }
    assertDeckExportable(project, slideIds, uploadFailure, skipped);
    const payload = await sync.push(project, "runtime_mcp_present");
    project.resourceUri = withoutURIVersionParam(payload?.resource_uri ?? payload?.resource?.resourceUri ?? project.resourceUri ?? resourceURI(project.id, project.title));
    project.widgetUri = withoutURIVersionParam(payload?.widget_uri ?? payload?.resource?.viewer?.widgetUri ?? project.widgetUri ?? widgetURI(project.id, project.title));
    store.cache(project);
    store.writeProjectConfig(project);
    return createSlidesResourceResult(project, {
      ok: true,
      addon_id: "manus-slides",
      resource_uri: project.resourceUri,
      widget_uri: project.widgetUri,
      resource: payload?.resource,
      descriptor: payload?.descriptor,
      renderData: payload?.renderData,
      version: payload?.version,
      legacy_slides: payload?.legacy_slides
    }, "presented", {
      addonVersion: client?.addonVersion?.()
    });
  }
};
var UPLOADED_ASSET_PLACEHOLDER = "https://uploaded-asset.invalid/";
function slidePages(project, slideIds) {
  const filesByPath = new Map(project.files.map((file2) => [file2.path, file2]));
  return slideIds.flatMap((id) => {
    const fileName = slidePageFileName(project, id);
    const content = filesByPath.get(fileName)?.content;
    return content ? [{ fileName, content }] : [];
  });
}
function strayXmlPagesNote(store, project, pending) {
  const stray = pending.filter((id) => store.contentFileExists(project, `${id}.xml`)).map((id) => `${id}.xml`);
  if (!stray.length)
    return "";
  return ` Found ${stray.join(", ")}: this is an HTML deck, and renaming .xml files to .html does not convert them. ` + "Write each page as HTML following the skill's html-syntax.md.";
}
function assertHtmlDeckPagesAreNotPptxXml(project, slideIds) {
  const offending = slidePages(project, slideIds).flatMap(({ fileName, content }) => {
    const root = strayPptxXmlRootOf(project, content);
    return root ? [`${fileName} (<${root}>)`] : [];
  });
  if (offending.length) {
    throw new Error(`Cannot present: ${offending.length} page(s) of this HTML deck contain manus-pptx XML instead of HTML — ` + `${offending.join(", ")}. Renaming .xml files to .html does not convert them: rewrite each page as a ` + "complete HTML document following the skill's html-syntax.md, then call slides/present with the same project_id.");
  }
}
function assertDeckExportable(project, slideIds, uploadFailure, { outsideWorkspace, unsupported }) {
  const assets = assetMapFromViewState(project.viewState);
  const uploaded = (absolutePath) => assets[absolutePath] ? UPLOADED_ASSET_PLACEHOLDER : undefined;
  const problems = new Set;
  for (const { fileName, content } of slidePages(project, slideIds)) {
    const projected = resolveAssetRefsInContent(content, fileName, uploaded, project.projectDir || "/");
    for (const reference of findLocalResourceReferences(projected)) {
      problems.add(`${fileName}: ${reference.value}`);
    }
  }
  if (problems.size) {
    throw new Error(`Cannot present: ${problems.size} local file reference(s) were not uploaded and would block PPTX/PDF export — ` + `${[...problems].join(", ")}. ` + (uploadFailure ? `Slide image assets could not be uploaded to the Slides addon server (${uploadFailure}). ` : "") + (outsideWorkspace.length ? `${outsideWorkspaceIssue(outsideWorkspace, project.projectDir)} ` : "") + (unsupported.length ? `${unsupportedAssetIssue(unsupported)} ` : "") + "Create the files (or fix the references), then call slides/present with the same project_id.");
  }
}
function assertPptxDeckPresentable(store, project, slideIds) {
  const problems = [];
  const design = store.readProjectFile(project, PPTX_DESIGN_FILE);
  if (!design) {
    problems.push(`${PPTX_DESIGN_FILE}: file is missing — write the deck-level design file first.`);
  } else {
    try {
      const normalized = normalizePptxDesignXml(design.content, PPTX_CANVAS_SIZE);
      if (normalized !== design.content) {
        problems.push(`${PPTX_DESIGN_FILE}: the file is not in canonical form — code fences, over-escaped markup, XML comments, ` + `or a <size> other than the fixed ${PPTX_CANVAS_SIZE[0]}x${PPTX_CANVAS_SIZE[1]} canvas remain. ` + "Rewrite the file with the native file tool (which re-triggers the Slides hook normalization).");
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      problems.push(`${PPTX_DESIGN_FILE}: ${reason.split(`
`).join("; ")}`);
    }
  }
  let authored = 0;
  for (const id of slideIds) {
    const fileName = slidePageFileName(project, id);
    const file2 = store.readProjectFile(project, fileName);
    if (!file2) {
      problems.push(`${fileName}: file is missing — write this slide's manus-pptx XML.`);
      continue;
    }
    authored += 1;
    if (stripSlideXmlCodeFences(file2.content) !== file2.content) {
      problems.push(`${fileName}: the file is not in canonical form — markdown code fences remain. ` + "Rewrite the file with the native file tool (which re-triggers the Slides hook normalization).");
    }
    const validation = validatePptxSlideXml(file2.content, { allowLegacyIconNames: true });
    if (validation.success === false) {
      problems.push(`${fileName}: ${validation.error.split(`
`).join("; ")}`);
    }
  }
  if (!authored) {
    problems.push("No slide XML has been authored yet: every registered slide is missing its <id>.xml file. " + "A deck cannot be presented with zero authored pages.");
  }
  if (problems.length) {
    throw new Error(`Cannot present PPTX deck "${project.id}": ${problems.length} validation problem(s):
` + problems.map((problem, index) => `${index + 1}. ${problem}`).join(`
`) + `
Fix these files with the native file tool (see the skill's pptx-xml-syntax.md), then call slides/present again.`);
  }
}

// mcp/tools/syncUserEdits.ts
import path16 from "node:path";
var syncUserEditsTool = {
  visible: false,
  definition: {
    name: SYNC_USER_EDITS_TOOL,
    description: "Align the runtime working copies of Slides decks with the latest server versions after user edits.",
    inputSchema: {
      type: "object",
      properties: {
        resource_uris: {
          type: "array",
          items: { type: "string" },
          description: "Stable manus-resource:// URIs for the Slides decks to align."
        },
        resource_uri: { type: "string", description: "Single-deck alternative to resource_uris." },
        project_id: { type: "string", description: "Exact deck id, alternative to resource_uri." },
        invocation_id: {
          type: "string",
          description: "Host invocation id; a replay with the same id returns the same user edits."
        }
      }
    }
  },
  async execute({ store, sync }, args) {
    const locators = collectLocators(args);
    if (locators.length === 0) {
      return {
        content: [{ type: "text", text: "Slides user-edit sync received no resource locators." }],
        structuredContent: { results: [], reason: "invalid_request", detail: "missing resource_uris" }
      };
    }
    const invocationId = typeof args?.invocation_id === "string" && args.invocation_id ? args.invocation_id : undefined;
    const results = await Promise.all(locators.map((locator) => syncOneResource(store, sync, locator, invocationId).catch((error) => ({
      resource_uri: locator.raw,
      applied: false,
      reason: "sync_failed",
      detail: error instanceof Error ? error.message : String(error)
    }))));
    const aligned = results.filter((entry) => entry.applied).length;
    const reminders = results.map((entry) => entry.agent_reminder).filter((text) => Boolean(text));
    return {
      content: [
        {
          type: "text",
          text: `Processed ${results.length} deck(s): ${aligned} aligned, ${reminders.length} with user edits.`
        }
      ],
      structuredContent: { results, ...reminders.length > 0 ? { agent_reminder: reminders.join(`

`) } : {} }
    };
  }
};
function collectLocators(args) {
  const locators = [];
  const seen = new Set;
  const push = (raw, key) => {
    const value = String(raw ?? "").trim();
    if (value && !seen.has(value)) {
      seen.add(value);
      locators.push({ raw: value, args: { [key]: value } });
    }
  };
  if (Array.isArray(args?.resource_uris)) {
    for (const uri2 of args.resource_uris) {
      push(uri2, "resource_uri");
    }
  }
  push(args?.resource_uri ?? args?.resourceUri, "resource_uri");
  push(args?.project_id ?? args?.projectId, "project_id");
  return locators;
}
async function syncOneResource(store, sync, locator, invocationId) {
  let project;
  try {
    project = store.resolveProject(locator.args);
  } catch (error) {
    return {
      resource_uri: locator.raw,
      applied: false,
      reason: "invalid_request",
      detail: error instanceof Error ? error.message : String(error)
    };
  }
  if (!project) {
    return { resource_uri: locator.raw, applied: false, reason: "not_attached" };
  }
  let pulled;
  let pullError;
  try {
    pulled = await sync.pullRemoteHead(project, { withinHostHook: true });
  } catch (error) {
    pullError = error instanceof Error ? error.message : String(error);
  }
  const pending = await sync.takePendingUserEdit(project, invocationId);
  const updated = store.requireProject({ project_id: project.id });
  const result = {
    resource_uri: locator.raw,
    applied: pulled?.applied ?? false,
    ...pullError ? { reason: "pull_failed", detail: pullError } : {},
    ...pulled?.versionId ? { version_id: pulled.versionId } : {},
    project_id: updated.id,
    project_dir: updated.projectDir
  };
  if (!pending) {
    return result;
  }
  return {
    ...result,
    changed_files: pending.changedFiles.map((filePath) => path16.join(updated.projectDir, filePath)),
    deleted_files: pending.deletedFiles.map((filePath) => path16.join(updated.projectDir, filePath)),
    order_changed: pending.orderChanged,
    slide_order: slideIdsOfProject(updated),
    agent_reminder: composeUserEditReminder({
      projectDir: updated.projectDir,
      changedFiles: pending.changedFiles,
      deletedFiles: pending.deletedFiles,
      orderChanged: pending.orderChanged,
      outline: outlineOfProject(updated)
    })
  };
}
function composeUserEditReminder(input) {
  const changedList = input.changedFiles.map(sanitizeInlineForReminder).join(", ");
  const deletedList = input.deletedFiles.map(sanitizeInlineForReminder).join(", ");
  let text = input.changedFiles.length > 0 ? `Files modified by user since last edit under ${input.projectDir}: ${changedList}. Your earlier view of ` + "these files is stale. Read them again before you answer any question about their content or edit " + "them, and build on the user's version." : `The user modified the Slides deck at ${input.projectDir} since last edit. The sandbox working copy has ` + "been refreshed to the latest version.";
  if (input.deletedFiles.length > 0) {
    text += ` The user deleted: ${deletedList}. Do not recreate these files.`;
  }
  if (input.orderChanged) {
    text += " IMPORTANT: The user has reorganized the slides (e.g. reordered or deleted pages).";
    if (input.outline.length > 0) {
      const orderText = input.outline.map((entry, index) => {
        const title = sanitizeTitleForReminder(entry.title);
        return `${index + 1}. ${entry.id}${title ? ` — ${title}` : ""}`;
      }).join(`
`);
      text += `

Current slide order:
${orderText}`;
    }
  }
  return text;
}
var REMINDER_TITLE_MAX_CHARS = 80;
function sanitizeInlineForReminder(text) {
  return (text ?? "").replace(/\s+/g, " ").trim().replaceAll("<", "&lt;");
}
function sanitizeTitleForReminder(title) {
  const collapsed = sanitizeInlineForReminder(title);
  return collapsed.length > REMINDER_TITLE_MAX_CHARS ? `${collapsed.slice(0, REMINDER_TITLE_MAX_CHARS)}…` : collapsed;
}

// mcp/tools/writeNotes.ts
var writeNotesTool = {
  definition: {
    name: "write_notes",
    description: "Write or update speaker notes for slides in the deck identified by required project_id. Use this for every " + "request about presentation notes, speaker scripts, or talking points — generating, rewriting, restyling, or " + 'clearing them. Partial update: slides not listed keep their current notes; pass note="" to clear one. Notes ' + "save live into the studio speaker-notes panel and presenter view and are included in PPTX exports — no " + "slides/present call is needed for notes to appear.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          minLength: 1,
          description: "Required exact deck id returned by slides/init_slides or slides/attach_slides."
        },
        notes: {
          type: "array",
          minItems: 1,
          description: "Speaker notes to write, one entry per targeted slide. Slides not listed are left unchanged.",
          items: {
            type: "object",
            properties: {
              slide_id: { type: "string", description: "Slide id to write the note for." },
              slide_number: {
                type: "integer",
                minimum: 1,
                description: "Optional 1-based target. Prefer slide_id."
              },
              note: {
                type: "string",
                description: "Complete speaker note for this slide in natural speaking voice, plain text only (no Markdown). " + "An empty string clears the note."
              }
            },
            required: ["note"],
            anyOf: [{ required: ["slide_id"] }, { required: ["slide_number"] }]
          }
        }
      },
      required: ["project_id", "notes"]
    }
  },
  async execute({ store, sync }, args) {
    const project = store.requireProject(args);
    const notesInput = Array.isArray(args?.notes) ? args.notes : [];
    if (!notesInput.length) {
      throw new Error("notes requires at least one entry with {slide_id or slide_number, note}.");
    }
    const slideIds = slideIdsOfProject(project);
    const updates = [];
    const seen = new Set;
    for (const item of notesInput) {
      const record = item && typeof item === "object" ? item : {};
      const id = resolveSlideId(project, record);
      if (!id) {
        throw new Error(`Unknown slide in notes. The deck has slides: ${slideIds.join(", ") || "(none)"}. ` + "Pass an existing slide_id or 1-based slide_number.");
      }
      if (seen.has(id)) {
        throw new Error(`Duplicate slide "${id}" in notes. List each slide at most once per call.`);
      }
      seen.add(id);
      if (typeof record.note !== "string") {
        throw new Error(`note for slide "${id}" must be a string (use "" to clear it).`);
      }
      updates.push({ id, note: record.note.trim() ? record.note : "" });
    }
    const filesByPath = new Map(project.files.map((file2) => [file2.path, file2]));
    const pendingTargets = updates.filter(({ id }) => !filesByPath.get(slidePageFileName(project, id)));
    if (pendingTargets.length) {
      throw new Error(`Slide(s) ${pendingTargets.map(({ id }) => id).join(", ")} have no authored content yet ` + "(edit_pending). Author each slide first, then write its speaker note based on the actual content.");
    }
    for (const { id, note } of updates) {
      const file2 = filesByPath.get(slidePageFileName(project, id));
      file2.note = note;
    }
    await sync.push(project);
    return createWriteNotesResult(project, updates);
  }
};
function createWriteNotesResult(project, updates) {
  const slideIds = slideIdsOfProject(project);
  const numbered = updates.map(({ id, note }) => ({ id, note, slideNumber: slideIds.indexOf(id) + 1 }));
  const updatedList = numbered.map(({ id, note, slideNumber }) => `${id} (page ${slideNumber}${note.trim() ? "" : ", cleared"})`).join(", ");
  const outline = outlineOfProject(project);
  const allEdited = outline.length > 0 && outline.every((entry) => entry.state === SLIDE_STATE_EDITED);
  const nextStep = allEdited ? "Notes are live in the studio speaker-notes panel and presenter view, and are included in PPTX " + `exports — no re-present needed. If this deck has not been delivered yet, call slides/present with ` + `project_id="${project.id}" to deliver it.` : "Some slides are still edit_pending — keep authoring them; notes for authored slides are already saved.";
  return {
    content: [
      {
        type: "text",
        text: `Speaker notes updated for ${updates.length} slide(s): ${updatedList}. project_id=${project.id}.

` + `Current notes:
${renderNotesOverview(project)}

${nextStep}`
      }
    ],
    structuredContent: {
      project_id: project.id,
      updated: numbered.map(({ id, slideNumber }) => ({ slide_id: id, slide_number: slideNumber }))
    }
  };
}

// mcp/tools/index.ts
var tools = [
  getTemplateTool,
  initSlidesTool,
  generateImageSlideTool,
  generateFastCheapImageTool,
  editSlideTool,
  organizeSlidesTool,
  writeNotesTool,
  presentSlidesTool,
  exportSlidesTool,
  attachSlidesTool,
  captureScreenshotTool,
  inspectAfterFileEditTool,
  applyFileEditHookResultTool,
  syncUserEditsTool
];
function createSlidesTools(context) {
  const toolsByName = new Map(tools.map((tool) => [tool.definition.name, tool]));
  return {
    list: listSlidesTools,
    async call(name, args, callContext) {
      const tool = toolsByName.get(name);
      if (!tool)
        throw new UnknownToolError(name);
      return tool.execute({ ...context, callContext }, args);
    }
  };
}
function listSlidesTools() {
  return tools.filter((tool) => tool.visible !== false).map((tool) => tool.definition);
}

class UnknownToolError extends Error {
  toolName;
  constructor(toolName) {
    super(`unknown tool: ${toolName}`);
    this.toolName = toolName;
  }
}

// mcp/serverRuntime.ts
var existingProjectTools = new Set([
  "edit_slide",
  "generate_image_slide",
  "organize_slides",
  "present",
  "capture_screenshot",
  "write_notes"
]);
var connectionLifecycle = new McpConnectionLifecycle;
var runtimes = new SlidesRuntimePool(runtimeForProjectRoot);
function runtimeForProjectRoot(projectRoot) {
  const projectStore = new ProjectStore({ projectRoot });
  const addonServerClient2 = new AddonServerClient2({
    endpoint: process.env.ADDON_SERVER_ENDPOINT ?? "http://127.0.0.1:43180"
  });
  const projectSync = new ProjectSync({
    store: projectStore,
    client: addonServerClient2,
    acquireBackgroundLease: () => connectionLifecycle.acquire()
  });
  const slidesTools = createSlidesTools({
    store: projectStore,
    sync: projectSync,
    client: addonServerClient2,
    host: addonServerClient2
  });
  const runtime = { projectStore, addonServerClient: addonServerClient2, projectSync, slidesTools };
  projectSync.reconcileOnStartup();
  return runtime;
}
function inspectionUnavailableResult(error) {
  const reason = String(error instanceof Error ? error.message : error);
  const text = `<system_reminder>
` + `Slides post-edit inspection could not run (${reason}). ` + "The Slides addon server is unavailable or its credentials are missing, so this edit was NOT validated or synchronized. " + `Verify the slide fits the 1280x720 canvas yourself, retry the edit later, or tell the user the Slides validation service is temporarily unavailable.
` + "</system_reminder>";
  return {
    content: [{ type: "text", text }],
    structuredContent: { agent_reminder: text, inspection_error: reason }
  };
}
async function runWithRuntimeCredential(client, subjectToken, fn) {
  let started = false;
  return withSlidesServiceRetry(() => client.runWithSubjectToken(subjectToken, async () => {
    started = true;
    return fn();
  }), { canRetry: () => !started });
}
async function callToolWithContext(id, params, { respond, fail }, mode) {
  const name = String(params?.name ?? "").replace(/^slides\./, "");
  const args = params?.arguments ?? {};
  let lease;
  try {
    lease = runtimes.acquire(slidesProjectRoot(params, mode));
    const { projectStore, addonServerClient: addonServerClient2, projectSync, slidesTools } = lease.value;
    if (name === APPLY_FILE_EDIT_HOOK_RESULT_TOOL) {
      if (!isHostEffectResumeArgs(args)) {
        respond(id, await slidesTools.call(name, args));
        return;
      }
      try {
        const resumeSubjectToken = subjectTokenFromToolCall(params) || String(process.env.ADDON_SUBJECT_TOKEN ?? "").trim();
        if (!resumeSubjectToken)
          throw new Error("missing_subject_token");
        await runWithRuntimeCredential(addonServerClient2, resumeSubjectToken, async () => {
          respond(id, await slidesTools.call(name, args));
        });
      } catch (error) {
        respond(id, hostEffectResumeFailureResult(error));
      }
      return;
    }
    const subjectToken = subjectTokenFromToolCall(params) || String(process.env.ADDON_SUBJECT_TOKEN ?? "").trim();
    if (name === INSPECT_AFTER_FILE_EDIT_TOOL) {
      try {
        if (!subjectToken)
          throw new Error("missing_subject_token");
        await runWithRuntimeCredential(addonServerClient2, subjectToken, async () => {
          respond(id, await slidesTools.call(name, args, { continuation: continuationFromToolCall(params) }));
        });
      } catch (error) {
        respond(id, inspectionUnavailableResult(error));
      }
      return;
    }
    if (!subjectToken)
      throw new Error("missing_subject_token");
    await runWithRuntimeCredential(addonServerClient2, subjectToken, async () => {
      if (existingProjectTools.has(name)) {
        const project = projectStore.requireProject(args);
        await projectSync.ensureSynchronized(project);
        if (name === "generate_image_slide") {
          respond(id, await slidesTools.call(name, args));
          return;
        }
        respond(id, await projectSync.runExclusive(project.id, () => slidesTools.call(name, args)));
        return;
      }
      respond(id, await slidesTools.call(name, args));
    });
  } catch (error) {
    if (name === INSPECT_AFTER_FILE_EDIT_TOOL) {
      respond(id, inspectionUnavailableResult(error));
      return;
    }
    if (name === APPLY_FILE_EDIT_HOOK_RESULT_TOOL) {
      respond(id, hostEffectResumeFailureResult(error));
      return;
    }
    const message = String(error instanceof Error ? error.message : error);
    if (error instanceof UnknownToolError) {
      fail(id, -32602, message);
    } else {
      respond(id, {
        content: [{ type: "text", text: message }],
        isError: true
      });
    }
  } finally {
    lease?.release();
  }
}
async function callTool(id, params, io, mode) {
  const invocationContext2 = addonInvocationContextFromToolCall(params);
  const browserInvocation = invocationContext2?.workingDirectory && invocationContext2.sessionId ? {
    sessionId: invocationContext2.sessionId,
    workingDirectory: invocationContext2.workingDirectory
  } : undefined;
  return runWithBrowserWorkerInvocation(browserInvocation, () => callToolWithContext(id, params, io, mode));
}
function startSlidesMcpServer(mode) {
  const server = createMcpServer({
    connectionLifecycle,
    serverInfo: { name: SLIDES_MCP_SERVER_ID, version: "0.0.1" },
    listTools: listSlidesTools,
    callTool: (id, params, io) => callTool(id, params, io, mode),
    onShutdown: () => {
      runtimes.stop();
      return shutdownAllChrome();
    }
  });
  server.start();
}

// mcp/server.ts
startSlidesMcpServer("runtime");
