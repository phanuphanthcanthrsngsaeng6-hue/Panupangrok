"use strict";
(() => {
  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/objectSpread2-BvkFp-_Y.mjs
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
      key = keys[i];
      if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
        get: ((k) => from[k]).bind(null, key),
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
    value: mod,
    enumerable: true
  }) : target, mod));
  var require_typeof = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/typeof.js"(exports, module) {
    function _typeof$2(o) {
      "@babel/helpers - typeof";
      return module.exports = _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
        return typeof o$1;
      } : function(o$1) {
        return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof$2(o);
    }
    module.exports = _typeof$2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_toPrimitive = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPrimitive.js"(exports, module) {
    var _typeof$1 = require_typeof()["default"];
    function toPrimitive$1(t, r) {
      if ("object" != _typeof$1(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof$1(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    module.exports = toPrimitive$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_toPropertyKey = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPropertyKey.js"(exports, module) {
    var _typeof = require_typeof()["default"];
    var toPrimitive = require_toPrimitive();
    function toPropertyKey$1(t) {
      var i = toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    module.exports = toPropertyKey$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_defineProperty = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/defineProperty.js"(exports, module) {
    var toPropertyKey = require_toPropertyKey();
    function _defineProperty(e, r, t) {
      return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_objectSpread2 = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectSpread2.js"(exports, module) {
    var defineProperty = require_defineProperty();
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r$1) {
          return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r$1) {
          defineProperty(e, r$1, t[r$1]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r$1) {
          Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
        });
      }
      return e;
    }
    module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });

  // node_modules/.pnpm/@trpc+server@11.6.0_typescript@5.9.3/node_modules/@trpc/server/dist/observable-UMO3vUa_.mjs
  function observable(subscribe) {
    const self = {
      subscribe(observer) {
        let teardownRef = null;
        let isDone = false;
        let unsubscribed = false;
        let teardownImmediately = false;
        function unsubscribe() {
          if (teardownRef === null) {
            teardownImmediately = true;
            return;
          }
          if (unsubscribed) return;
          unsubscribed = true;
          if (typeof teardownRef === "function") teardownRef();
          else if (teardownRef) teardownRef.unsubscribe();
        }
        teardownRef = subscribe({
          next(value) {
            var _observer$next;
            if (isDone) return;
            (_observer$next = observer.next) === null || _observer$next === void 0 || _observer$next.call(observer, value);
          },
          error(err) {
            var _observer$error;
            if (isDone) return;
            isDone = true;
            (_observer$error = observer.error) === null || _observer$error === void 0 || _observer$error.call(observer, err);
            unsubscribe();
          },
          complete() {
            var _observer$complete;
            if (isDone) return;
            isDone = true;
            (_observer$complete = observer.complete) === null || _observer$complete === void 0 || _observer$complete.call(observer);
            unsubscribe();
          }
        });
        if (teardownImmediately) unsubscribe();
        return { unsubscribe };
      },
      pipe(...operations) {
        return operations.reduce(pipeReducer, self);
      }
    };
    return self;
  }
  function pipeReducer(prev, fn) {
    return fn(prev);
  }
  function observableToPromise(observable$1) {
    const ac = new AbortController();
    const promise = new Promise((resolve, reject) => {
      let isDone = false;
      function onDone() {
        if (isDone) return;
        isDone = true;
        obs$.unsubscribe();
      }
      ac.signal.addEventListener("abort", () => {
        reject(ac.signal.reason);
      });
      const obs$ = observable$1.subscribe({
        next(data) {
          isDone = true;
          resolve(data);
          onDone();
        },
        error(data) {
          reject(data);
        },
        complete() {
          ac.abort();
          onDone();
        }
      });
    });
    return promise;
  }

  // node_modules/.pnpm/@trpc+server@11.6.0_typescript@5.9.3/node_modules/@trpc/server/dist/observable-CUiPknO-.mjs
  function share(_opts) {
    return (source) => {
      let refCount = 0;
      let subscription = null;
      const observers = [];
      function startIfNeeded() {
        if (subscription) return;
        subscription = source.subscribe({
          next(value) {
            for (const observer of observers) {
              var _observer$next;
              (_observer$next = observer.next) === null || _observer$next === void 0 || _observer$next.call(observer, value);
            }
          },
          error(error) {
            for (const observer of observers) {
              var _observer$error;
              (_observer$error = observer.error) === null || _observer$error === void 0 || _observer$error.call(observer, error);
            }
          },
          complete() {
            for (const observer of observers) {
              var _observer$complete;
              (_observer$complete = observer.complete) === null || _observer$complete === void 0 || _observer$complete.call(observer);
            }
          }
        });
      }
      function resetIfNeeded() {
        if (refCount === 0 && subscription) {
          const _sub = subscription;
          subscription = null;
          _sub.unsubscribe();
        }
      }
      return observable((subscriber) => {
        refCount++;
        observers.push(subscriber);
        startIfNeeded();
        return { unsubscribe() {
          refCount--;
          resetIfNeeded();
          const index = observers.findIndex((v) => v === subscriber);
          if (index > -1) observers.splice(index, 1);
        } };
      });
    };
  }
  function behaviorSubject(initialValue) {
    let value = initialValue;
    const observerList = [];
    const addObserver = (observer) => {
      if (value !== void 0) observer.next(value);
      observerList.push(observer);
    };
    const removeObserver = (observer) => {
      observerList.splice(observerList.indexOf(observer), 1);
    };
    const obs = observable((observer) => {
      addObserver(observer);
      return () => {
        removeObserver(observer);
      };
    });
    obs.next = (nextValue) => {
      if (value === nextValue) return;
      value = nextValue;
      for (const observer of observerList) observer.next(nextValue);
    };
    obs.get = () => value;
    return obs;
  }

  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/splitLink-B7Cuf2c_.mjs
  function createChain(opts) {
    return observable((observer) => {
      function execute(index = 0, op = opts.op) {
        const next = opts.links[index];
        if (!next) throw new Error("No more links to execute - did you forget to add an ending link?");
        const subscription = next({
          op,
          next(nextOp) {
            const nextObserver = execute(index + 1, nextOp);
            return nextObserver;
          }
        });
        return subscription;
      }
      const obs$ = execute();
      return obs$.subscribe(observer);
    });
  }

  // node_modules/.pnpm/@trpc+server@11.6.0_typescript@5.9.3/node_modules/@trpc/server/dist/utils-CLZnJdb_.mjs
  var TRPC_ERROR_CODES_BY_KEY = {
    PARSE_ERROR: -32700,
    BAD_REQUEST: -32600,
    INTERNAL_SERVER_ERROR: -32603,
    NOT_IMPLEMENTED: -32603,
    BAD_GATEWAY: -32603,
    SERVICE_UNAVAILABLE: -32603,
    GATEWAY_TIMEOUT: -32603,
    UNAUTHORIZED: -32001,
    PAYMENT_REQUIRED: -32002,
    FORBIDDEN: -32003,
    NOT_FOUND: -32004,
    METHOD_NOT_SUPPORTED: -32005,
    TIMEOUT: -32008,
    CONFLICT: -32009,
    PRECONDITION_FAILED: -32012,
    PAYLOAD_TOO_LARGE: -32013,
    UNSUPPORTED_MEDIA_TYPE: -32015,
    UNPROCESSABLE_CONTENT: -32022,
    PRECONDITION_REQUIRED: -32028,
    TOO_MANY_REQUESTS: -32029,
    CLIENT_CLOSED_REQUEST: -32099
  };
  var retryableRpcCodes = [
    TRPC_ERROR_CODES_BY_KEY.BAD_GATEWAY,
    TRPC_ERROR_CODES_BY_KEY.SERVICE_UNAVAILABLE,
    TRPC_ERROR_CODES_BY_KEY.GATEWAY_TIMEOUT,
    TRPC_ERROR_CODES_BY_KEY.INTERNAL_SERVER_ERROR
  ];
  function isObject(value) {
    return !!value && !Array.isArray(value) && typeof value === "object";
  }

  // node_modules/.pnpm/@trpc+server@11.6.0_typescript@5.9.3/node_modules/@trpc/server/dist/getErrorShape-BH60iMC2.mjs
  var __create2 = Object.create;
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __getProtoOf2 = Object.getPrototypeOf;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __commonJS2 = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps2 = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames2(from), i = 0, n = keys.length, key; i < n; i++) {
      key = keys[i];
      if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
        get: ((k) => from[k]).bind(null, key),
        enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
      });
    }
    return to;
  };
  var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", {
    value: mod,
    enumerable: true
  }) : target, mod));
  var require_typeof2 = __commonJS2({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/typeof.js"(exports, module) {
    function _typeof$2(o) {
      "@babel/helpers - typeof";
      return module.exports = _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
        return typeof o$1;
      } : function(o$1) {
        return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof$2(o);
    }
    module.exports = _typeof$2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_toPrimitive2 = __commonJS2({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPrimitive.js"(exports, module) {
    var _typeof$1 = require_typeof2()["default"];
    function toPrimitive$1(t, r) {
      if ("object" != _typeof$1(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof$1(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    module.exports = toPrimitive$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_toPropertyKey2 = __commonJS2({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPropertyKey.js"(exports, module) {
    var _typeof = require_typeof2()["default"];
    var toPrimitive = require_toPrimitive2();
    function toPropertyKey$1(t) {
      var i = toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    module.exports = toPropertyKey$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_defineProperty2 = __commonJS2({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/defineProperty.js"(exports, module) {
    var toPropertyKey = require_toPropertyKey2();
    function _defineProperty(e, r, t) {
      return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_objectSpread22 = __commonJS2({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectSpread2.js"(exports, module) {
    var defineProperty = require_defineProperty2();
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r$1) {
          return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r$1) {
          defineProperty(e, r$1, t[r$1]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r$1) {
          Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
        });
      }
      return e;
    }
    module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var import_objectSpread2 = __toESM2(require_objectSpread22(), 1);

  // node_modules/.pnpm/@trpc+server@11.6.0_typescript@5.9.3/node_modules/@trpc/server/dist/tracked-Blz8XOf1.mjs
  var import_defineProperty = __toESM2(require_defineProperty2(), 1);
  var import_objectSpread2$1 = __toESM2(require_objectSpread22(), 1);
  function transformResultInner(response, transformer) {
    if ("error" in response) {
      const error = transformer.deserialize(response.error);
      return {
        ok: false,
        error: (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, response), {}, { error })
      };
    }
    const result = (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, response.result), (!response.result.type || response.result.type === "data") && {
      type: "data",
      data: transformer.deserialize(response.result.data)
    });
    return {
      ok: true,
      result
    };
  }
  var TransformResultError = class extends Error {
    constructor() {
      super("Unable to transform response from server");
    }
  };
  function transformResult(response, transformer) {
    let result;
    try {
      result = transformResultInner(response, transformer);
    } catch (_unused) {
      throw new TransformResultError();
    }
    if (!result.ok && (!isObject(result.error.error) || typeof result.error.error["code"] !== "number")) throw new TransformResultError();
    if (result.ok && !isObject(result.result)) throw new TransformResultError();
    return result;
  }
  var import_objectSpread22 = __toESM2(require_objectSpread22(), 1);

  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/TRPCClientError-CjKyS10w.mjs
  var import_defineProperty2 = __toESM(require_defineProperty(), 1);
  var import_objectSpread23 = __toESM(require_objectSpread2(), 1);
  function isTRPCClientError(cause) {
    return cause instanceof TRPCClientError;
  }
  function isTRPCErrorResponse(obj) {
    return isObject(obj) && isObject(obj["error"]) && typeof obj["error"]["code"] === "number" && typeof obj["error"]["message"] === "string";
  }
  function getMessageFromUnknownError(err, fallback) {
    if (typeof err === "string") return err;
    if (isObject(err) && typeof err["message"] === "string") return err["message"];
    return fallback;
  }
  var TRPCClientError = class TRPCClientError2 extends Error {
    constructor(message, opts) {
      var _opts$result, _opts$result2;
      const cause = opts === null || opts === void 0 ? void 0 : opts.cause;
      super(message, { cause });
      (0, import_defineProperty2.default)(this, "cause", void 0);
      (0, import_defineProperty2.default)(this, "shape", void 0);
      (0, import_defineProperty2.default)(this, "data", void 0);
      (0, import_defineProperty2.default)(this, "meta", void 0);
      this.meta = opts === null || opts === void 0 ? void 0 : opts.meta;
      this.cause = cause;
      this.shape = opts === null || opts === void 0 || (_opts$result = opts.result) === null || _opts$result === void 0 ? void 0 : _opts$result.error;
      this.data = opts === null || opts === void 0 || (_opts$result2 = opts.result) === null || _opts$result2 === void 0 ? void 0 : _opts$result2.error.data;
      this.name = "TRPCClientError";
      Object.setPrototypeOf(this, TRPCClientError2.prototype);
    }
    static from(_cause, opts = {}) {
      const cause = _cause;
      if (isTRPCClientError(cause)) {
        if (opts.meta) cause.meta = (0, import_objectSpread23.default)((0, import_objectSpread23.default)({}, cause.meta), opts.meta);
        return cause;
      }
      if (isTRPCErrorResponse(cause)) return new TRPCClientError2(cause.error.message, (0, import_objectSpread23.default)((0, import_objectSpread23.default)({}, opts), {}, { result: cause }));
      return new TRPCClientError2(getMessageFromUnknownError(cause, "Unknown error"), (0, import_objectSpread23.default)((0, import_objectSpread23.default)({}, opts), {}, { cause }));
    }
  };

  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/unstable-internals-Bg7n9BBj.mjs
  function getTransformer(transformer) {
    const _transformer = transformer;
    if (!_transformer) return {
      input: {
        serialize: (data) => data,
        deserialize: (data) => data
      },
      output: {
        serialize: (data) => data,
        deserialize: (data) => data
      }
    };
    if ("input" in _transformer) return _transformer;
    return {
      input: _transformer,
      output: _transformer
    };
  }

  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/httpUtils-D61f8fkr.mjs
  var isFunction2 = (fn) => typeof fn === "function";
  function getFetch(customFetchImpl) {
    if (customFetchImpl) return customFetchImpl;
    if (typeof window !== "undefined" && isFunction2(window.fetch)) return window.fetch;
    if (typeof globalThis !== "undefined" && isFunction2(globalThis.fetch)) return globalThis.fetch;
    throw new Error("No fetch implementation found");
  }
  var import_objectSpread24 = __toESM(require_objectSpread2());
  function resolveHTTPLinkOptions(opts) {
    return {
      url: opts.url.toString(),
      fetch: opts.fetch,
      transformer: getTransformer(opts.transformer),
      methodOverride: opts.methodOverride
    };
  }
  function arrayToDict(array) {
    const dict = {};
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      dict[index] = element;
    }
    return dict;
  }
  var METHOD = {
    query: "GET",
    mutation: "POST",
    subscription: "PATCH"
  };
  function getInput(opts) {
    return "input" in opts ? opts.transformer.input.serialize(opts.input) : arrayToDict(opts.inputs.map((_input) => opts.transformer.input.serialize(_input)));
  }
  var getUrl = (opts) => {
    const parts = opts.url.split("?");
    const base = parts[0].replace(/\/$/, "");
    let url = base + "/" + opts.path;
    const queryParts = [];
    if (parts[1]) queryParts.push(parts[1]);
    if ("inputs" in opts) queryParts.push("batch=1");
    if (opts.type === "query" || opts.type === "subscription") {
      const input = getInput(opts);
      if (input !== void 0 && opts.methodOverride !== "POST") queryParts.push(`input=${encodeURIComponent(JSON.stringify(input))}`);
    }
    if (queryParts.length) url += "?" + queryParts.join("&");
    return url;
  };
  var getBody = (opts) => {
    if (opts.type === "query" && opts.methodOverride !== "POST") return void 0;
    const input = getInput(opts);
    return input !== void 0 ? JSON.stringify(input) : void 0;
  };
  var jsonHttpRequester = (opts) => {
    return httpRequest((0, import_objectSpread24.default)((0, import_objectSpread24.default)({}, opts), {}, {
      contentTypeHeader: "application/json",
      getUrl,
      getBody
    }));
  };
  var AbortError = class extends Error {
    constructor() {
      const name = "AbortError";
      super(name);
      this.name = name;
      this.message = name;
    }
  };
  var throwIfAborted = (signal) => {
    var _signal$throwIfAborte;
    if (!(signal === null || signal === void 0 ? void 0 : signal.aborted)) return;
    (_signal$throwIfAborte = signal.throwIfAborted) === null || _signal$throwIfAborte === void 0 || _signal$throwIfAborte.call(signal);
    if (typeof DOMException !== "undefined") throw new DOMException("AbortError", "AbortError");
    throw new AbortError();
  };
  async function fetchHTTPResponse(opts) {
    var _opts$methodOverride;
    throwIfAborted(opts.signal);
    const url = opts.getUrl(opts);
    const body = opts.getBody(opts);
    const method = (_opts$methodOverride = opts.methodOverride) !== null && _opts$methodOverride !== void 0 ? _opts$methodOverride : METHOD[opts.type];
    const resolvedHeaders = await (async () => {
      const heads = await opts.headers();
      if (Symbol.iterator in heads) return Object.fromEntries(heads);
      return heads;
    })();
    const headers = (0, import_objectSpread24.default)((0, import_objectSpread24.default)((0, import_objectSpread24.default)({}, opts.contentTypeHeader && method !== "GET" ? { "content-type": opts.contentTypeHeader } : {}), opts.trpcAcceptHeader ? { "trpc-accept": opts.trpcAcceptHeader } : void 0), resolvedHeaders);
    return getFetch(opts.fetch)(url, {
      method,
      signal: opts.signal,
      body,
      headers
    });
  }
  async function httpRequest(opts) {
    const meta = {};
    const res = await fetchHTTPResponse(opts);
    meta.response = res;
    const json = await res.json();
    meta.responseJSON = json;
    return {
      json,
      meta
    };
  }

  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/httpLink-CBOGz9wP.mjs
  function isOctetType(input) {
    return input instanceof Uint8Array || input instanceof Blob;
  }
  function isFormData(input) {
    return input instanceof FormData;
  }
  var import_objectSpread25 = __toESM(require_objectSpread2(), 1);
  var universalRequester = (opts) => {
    if ("input" in opts) {
      const { input } = opts;
      if (isFormData(input)) {
        if (opts.type !== "mutation" && opts.methodOverride !== "POST") throw new Error("FormData is only supported for mutations");
        return httpRequest((0, import_objectSpread25.default)((0, import_objectSpread25.default)({}, opts), {}, {
          contentTypeHeader: void 0,
          getUrl,
          getBody: () => input
        }));
      }
      if (isOctetType(input)) {
        if (opts.type !== "mutation" && opts.methodOverride !== "POST") throw new Error("Octet type input is only supported for mutations");
        return httpRequest((0, import_objectSpread25.default)((0, import_objectSpread25.default)({}, opts), {}, {
          contentTypeHeader: "application/octet-stream",
          getUrl,
          getBody: () => input
        }));
      }
    }
    return jsonHttpRequester(opts);
  };
  function httpLink(opts) {
    const resolvedOpts = resolveHTTPLinkOptions(opts);
    return () => {
      return (operationOpts) => {
        const { op } = operationOpts;
        return observable((observer) => {
          const { path, input, type } = op;
          if (type === "subscription") throw new Error("Subscriptions are unsupported by `httpLink` - use `httpSubscriptionLink` or `wsLink`");
          const request = universalRequester((0, import_objectSpread25.default)((0, import_objectSpread25.default)({}, resolvedOpts), {}, {
            type,
            path,
            input,
            signal: op.signal,
            headers() {
              if (!opts.headers) return {};
              if (typeof opts.headers === "function") return opts.headers({ op });
              return opts.headers;
            }
          }));
          let meta = void 0;
          request.then((res) => {
            meta = res.meta;
            const transformed = transformResult(res.json, resolvedOpts.transformer.output);
            if (!transformed.ok) {
              observer.error(TRPCClientError.from(transformed.error, { meta }));
              return;
            }
            observer.next({
              context: res.meta,
              result: transformed.result
            });
            observer.complete();
          }).catch((cause) => {
            observer.error(TRPCClientError.from(cause, { meta }));
          });
          return () => {
          };
        });
      };
    };
  }

  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/httpBatchLink-B2CqKGTi.mjs
  var import_objectSpread26 = __toESM(require_objectSpread2(), 1);

  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/loggerLink-ineCN1PO.mjs
  var import_objectSpread27 = __toESM(require_objectSpread2(), 1);

  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/wsLink-H5IjZfJW.mjs
  var resultOf = (value, ...args) => {
    return typeof value === "function" ? value(...args) : value;
  };
  var import_defineProperty$3 = __toESM(require_defineProperty(), 1);
  function withResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve,
      reject
    };
  }
  async function prepareUrl(urlOptions) {
    const url = await resultOf(urlOptions.url);
    if (!urlOptions.connectionParams) return url;
    const prefix2 = url.includes("?") ? "&" : "?";
    const connectionParams = `${prefix2}connectionParams=1`;
    return url + connectionParams;
  }
  async function buildConnectionMessage(connectionParams) {
    const message = {
      method: "connectionParams",
      data: await resultOf(connectionParams)
    };
    return JSON.stringify(message);
  }
  var import_defineProperty$2 = __toESM(require_defineProperty(), 1);
  var import_defineProperty$1 = __toESM(require_defineProperty(), 1);
  function asyncWsOpen(ws) {
    const { promise, resolve, reject } = withResolvers();
    ws.addEventListener("open", () => {
      ws.removeEventListener("error", reject);
      resolve();
    });
    ws.addEventListener("error", reject);
    return promise;
  }
  function setupPingInterval(ws, { intervalMs, pongTimeoutMs }) {
    let pingTimeout;
    let pongTimeout;
    function start() {
      pingTimeout = setTimeout(() => {
        ws.send("PING");
        pongTimeout = setTimeout(() => {
          ws.close();
        }, pongTimeoutMs);
      }, intervalMs);
    }
    function reset() {
      clearTimeout(pingTimeout);
      start();
    }
    function pong() {
      clearTimeout(pongTimeout);
      reset();
    }
    ws.addEventListener("open", start);
    ws.addEventListener("message", ({ data }) => {
      clearTimeout(pingTimeout);
      start();
      if (data === "PONG") pong();
    });
    ws.addEventListener("close", () => {
      clearTimeout(pingTimeout);
      clearTimeout(pongTimeout);
    });
  }
  var WsConnection = class WsConnection2 {
    constructor(opts) {
      var _opts$WebSocketPonyfi;
      (0, import_defineProperty$1.default)(this, "id", ++WsConnection2.connectCount);
      (0, import_defineProperty$1.default)(this, "WebSocketPonyfill", void 0);
      (0, import_defineProperty$1.default)(this, "urlOptions", void 0);
      (0, import_defineProperty$1.default)(this, "keepAliveOpts", void 0);
      (0, import_defineProperty$1.default)(this, "wsObservable", behaviorSubject(null));
      (0, import_defineProperty$1.default)(this, "openPromise", null);
      this.WebSocketPonyfill = (_opts$WebSocketPonyfi = opts.WebSocketPonyfill) !== null && _opts$WebSocketPonyfi !== void 0 ? _opts$WebSocketPonyfi : WebSocket;
      if (!this.WebSocketPonyfill) throw new Error("No WebSocket implementation found - you probably don't want to use this on the server, but if you do you need to pass a `WebSocket`-ponyfill");
      this.urlOptions = opts.urlOptions;
      this.keepAliveOpts = opts.keepAlive;
    }
    get ws() {
      return this.wsObservable.get();
    }
    set ws(ws) {
      this.wsObservable.next(ws);
    }
    /**
    * Checks if the WebSocket connection is open and ready to communicate.
    */
    isOpen() {
      return !!this.ws && this.ws.readyState === this.WebSocketPonyfill.OPEN && !this.openPromise;
    }
    /**
    * Checks if the WebSocket connection is closed or in the process of closing.
    */
    isClosed() {
      return !!this.ws && (this.ws.readyState === this.WebSocketPonyfill.CLOSING || this.ws.readyState === this.WebSocketPonyfill.CLOSED);
    }
    async open() {
      var _this = this;
      if (_this.openPromise) return _this.openPromise;
      _this.id = ++WsConnection2.connectCount;
      const wsPromise = prepareUrl(_this.urlOptions).then((url) => new _this.WebSocketPonyfill(url));
      _this.openPromise = wsPromise.then(async (ws) => {
        _this.ws = ws;
        ws.addEventListener("message", function({ data }) {
          if (data === "PING") this.send("PONG");
        });
        if (_this.keepAliveOpts.enabled) setupPingInterval(ws, _this.keepAliveOpts);
        ws.addEventListener("close", () => {
          if (_this.ws === ws) _this.ws = null;
        });
        await asyncWsOpen(ws);
        if (_this.urlOptions.connectionParams) ws.send(await buildConnectionMessage(_this.urlOptions.connectionParams));
      });
      try {
        await _this.openPromise;
      } finally {
        _this.openPromise = null;
      }
    }
    /**
    * Closes the WebSocket connection gracefully.
    * Waits for any ongoing open operation to complete before closing.
    */
    async close() {
      var _this2 = this;
      try {
        await _this2.openPromise;
      } finally {
        var _this$ws;
        (_this$ws = _this2.ws) === null || _this$ws === void 0 || _this$ws.close();
      }
    }
  };
  (0, import_defineProperty$1.default)(WsConnection, "connectCount", 0);
  var import_defineProperty3 = __toESM(require_defineProperty(), 1);
  var import_objectSpread28 = __toESM(require_objectSpread2(), 1);

  // node_modules/.pnpm/@trpc+client@11.6.0_@trpc+server@11.6.0_typescript@5.9.3__typescript@5.9.3/node_modules/@trpc/client/dist/index.mjs
  var import_defineProperty4 = __toESM(require_defineProperty(), 1);
  var import_objectSpread2$4 = __toESM(require_objectSpread2(), 1);
  var TRPCUntypedClient = class {
    constructor(opts) {
      (0, import_defineProperty4.default)(this, "links", void 0);
      (0, import_defineProperty4.default)(this, "runtime", void 0);
      (0, import_defineProperty4.default)(this, "requestId", void 0);
      this.requestId = 0;
      this.runtime = {};
      this.links = opts.links.map((link) => link(this.runtime));
    }
    $request(opts) {
      var _opts$context;
      const chain$ = createChain({
        links: this.links,
        op: (0, import_objectSpread2$4.default)((0, import_objectSpread2$4.default)({}, opts), {}, {
          context: (_opts$context = opts.context) !== null && _opts$context !== void 0 ? _opts$context : {},
          id: ++this.requestId
        })
      });
      return chain$.pipe(share());
    }
    async requestAsPromise(opts) {
      var _this = this;
      try {
        const req$ = _this.$request(opts);
        const envelope = await observableToPromise(req$);
        const data = envelope.result.data;
        return data;
      } catch (err) {
        throw TRPCClientError.from(err);
      }
    }
    query(path, input, opts) {
      return this.requestAsPromise({
        type: "query",
        path,
        input,
        context: opts === null || opts === void 0 ? void 0 : opts.context,
        signal: opts === null || opts === void 0 ? void 0 : opts.signal
      });
    }
    mutation(path, input, opts) {
      return this.requestAsPromise({
        type: "mutation",
        path,
        input,
        context: opts === null || opts === void 0 ? void 0 : opts.context,
        signal: opts === null || opts === void 0 ? void 0 : opts.signal
      });
    }
    subscription(path, input, opts) {
      const observable$ = this.$request({
        type: "subscription",
        path,
        input,
        context: opts.context,
        signal: opts.signal
      });
      return observable$.subscribe({
        next(envelope) {
          switch (envelope.result.type) {
            case "state": {
              var _opts$onConnectionSta;
              (_opts$onConnectionSta = opts.onConnectionStateChange) === null || _opts$onConnectionSta === void 0 || _opts$onConnectionSta.call(opts, envelope.result);
              break;
            }
            case "started": {
              var _opts$onStarted;
              (_opts$onStarted = opts.onStarted) === null || _opts$onStarted === void 0 || _opts$onStarted.call(opts, { context: envelope.context });
              break;
            }
            case "stopped": {
              var _opts$onStopped;
              (_opts$onStopped = opts.onStopped) === null || _opts$onStopped === void 0 || _opts$onStopped.call(opts);
              break;
            }
            case "data":
            case void 0: {
              var _opts$onData;
              (_opts$onData = opts.onData) === null || _opts$onData === void 0 || _opts$onData.call(opts, envelope.result.data);
              break;
            }
          }
        },
        error(err) {
          var _opts$onError;
          (_opts$onError = opts.onError) === null || _opts$onError === void 0 || _opts$onError.call(opts, err);
        },
        complete() {
          var _opts$onComplete;
          (_opts$onComplete = opts.onComplete) === null || _opts$onComplete === void 0 || _opts$onComplete.call(opts);
        }
      });
    }
  };
  function createTRPCUntypedClient(opts) {
    return new TRPCUntypedClient(opts);
  }
  var import_objectSpread2$3 = __toESM(require_objectSpread2(), 1);
  var import_objectSpread2$2 = __toESM(require_objectSpread2(), 1);
  var require_asyncIterator = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncIterator.js"(exports, module) {
    function _asyncIterator$1(r) {
      var n, t, o, e = 2;
      for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--; ) {
        if (t && null != (n = r[t])) return n.call(r);
        if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
        t = "@@asyncIterator", o = "@@iterator";
      }
      throw new TypeError("Object is not async iterable");
    }
    function AsyncFromSyncIterator(r) {
      function AsyncFromSyncIteratorContinuation(r$1) {
        if (Object(r$1) !== r$1) return Promise.reject(new TypeError(r$1 + " is not an object."));
        var n = r$1.done;
        return Promise.resolve(r$1.value).then(function(r$2) {
          return {
            value: r$2,
            done: n
          };
        });
      }
      return AsyncFromSyncIterator = function AsyncFromSyncIterator$1(r$1) {
        this.s = r$1, this.n = r$1.next;
      }, AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function next() {
          return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        "return": function _return(r$1) {
          var n = this.s["return"];
          return void 0 === n ? Promise.resolve({
            value: r$1,
            done: true
          }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
        },
        "throw": function _throw(r$1) {
          var n = this.s["return"];
          return void 0 === n ? Promise.reject(r$1) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
        }
      }, new AsyncFromSyncIterator(r);
    }
    module.exports = _asyncIterator$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var import_asyncIterator = __toESM(require_asyncIterator(), 1);
  var import_objectSpread2$12 = __toESM(require_objectSpread2(), 1);
  var require_usingCtx = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/usingCtx.js"(exports, module) {
    function _usingCtx() {
      var r = "function" == typeof SuppressedError ? SuppressedError : function(r$1, e$1) {
        var n$1 = Error();
        return n$1.name = "SuppressedError", n$1.error = r$1, n$1.suppressed = e$1, n$1;
      }, e = {}, n = [];
      function using(r$1, e$1) {
        if (null != e$1) {
          if (Object(e$1) !== e$1) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
          if (r$1) var o = e$1[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
          if (void 0 === o && (o = e$1[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r$1)) var t = o;
          if ("function" != typeof o) throw new TypeError("Object is not disposable.");
          t && (o = function o$1() {
            try {
              t.call(e$1);
            } catch (r$2) {
              return Promise.reject(r$2);
            }
          }), n.push({
            v: e$1,
            d: o,
            a: r$1
          });
        } else r$1 && n.push({
          d: e$1,
          a: r$1
        });
        return e$1;
      }
      return {
        e,
        u: using.bind(null, false),
        a: using.bind(null, true),
        d: function d() {
          var o, t = this.e, s = 0;
          function next() {
            for (; o = n.pop(); ) try {
              if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
              if (o.d) {
                var r$1 = o.d.call(o.v);
                if (o.a) return s |= 2, Promise.resolve(r$1).then(next, err);
              } else s |= 1;
            } catch (r$2) {
              return err(r$2);
            }
            if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
            if (t !== e) throw t;
          }
          function err(n$1) {
            return t = t !== e ? new r(n$1, t) : n$1, next();
          }
          return next();
        }
      };
    }
    module.exports = _usingCtx, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_OverloadYield = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/OverloadYield.js"(exports, module) {
    function _OverloadYield(e, d) {
      this.v = e, this.k = d;
    }
    module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_awaitAsyncGenerator = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/awaitAsyncGenerator.js"(exports, module) {
    var OverloadYield$1 = require_OverloadYield();
    function _awaitAsyncGenerator$1(e) {
      return new OverloadYield$1(e, 0);
    }
    module.exports = _awaitAsyncGenerator$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_wrapAsyncGenerator = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/wrapAsyncGenerator.js"(exports, module) {
    var OverloadYield = require_OverloadYield();
    function _wrapAsyncGenerator$1(e) {
      return function() {
        return new AsyncGenerator(e.apply(this, arguments));
      };
    }
    function AsyncGenerator(e) {
      var r, t;
      function resume(r$1, t$1) {
        try {
          var n = e[r$1](t$1), o = n.value, u = o instanceof OverloadYield;
          Promise.resolve(u ? o.v : o).then(function(t$2) {
            if (u) {
              var i = "return" === r$1 ? "return" : "next";
              if (!o.k || t$2.done) return resume(i, t$2);
              t$2 = e[i](t$2).value;
            }
            settle(n.done ? "return" : "normal", t$2);
          }, function(e$1) {
            resume("throw", e$1);
          });
        } catch (e$1) {
          settle("throw", e$1);
        }
      }
      function settle(e$1, n) {
        switch (e$1) {
          case "return":
            r.resolve({
              value: n,
              done: true
            });
            break;
          case "throw":
            r.reject(n);
            break;
          default:
            r.resolve({
              value: n,
              done: false
            });
        }
        (r = r.next) ? resume(r.key, r.arg) : t = null;
      }
      this._invoke = function(e$1, n) {
        return new Promise(function(o, u) {
          var i = {
            key: e$1,
            arg: n,
            resolve: o,
            reject: u,
            next: null
          };
          t ? t = t.next = i : (r = t = i, resume(e$1, n));
        });
      }, "function" != typeof e["return"] && (this["return"] = void 0);
    }
    AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
      return this;
    }, AsyncGenerator.prototype.next = function(e) {
      return this._invoke("next", e);
    }, AsyncGenerator.prototype["throw"] = function(e) {
      return this._invoke("throw", e);
    }, AsyncGenerator.prototype["return"] = function(e) {
      return this._invoke("return", e);
    };
    module.exports = _wrapAsyncGenerator$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var import_usingCtx = __toESM(require_usingCtx(), 1);
  var import_awaitAsyncGenerator = __toESM(require_awaitAsyncGenerator(), 1);
  var import_wrapAsyncGenerator = __toESM(require_wrapAsyncGenerator(), 1);
  var import_objectSpread29 = __toESM(require_objectSpread2(), 1);

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/double-indexed-kv.js
  var DoubleIndexedKV = (
    /** @class */
    (function() {
      function DoubleIndexedKV2() {
        this.keyToValue = /* @__PURE__ */ new Map();
        this.valueToKey = /* @__PURE__ */ new Map();
      }
      DoubleIndexedKV2.prototype.set = function(key, value) {
        this.keyToValue.set(key, value);
        this.valueToKey.set(value, key);
      };
      DoubleIndexedKV2.prototype.getByKey = function(key) {
        return this.keyToValue.get(key);
      };
      DoubleIndexedKV2.prototype.getByValue = function(value) {
        return this.valueToKey.get(value);
      };
      DoubleIndexedKV2.prototype.clear = function() {
        this.keyToValue.clear();
        this.valueToKey.clear();
      };
      return DoubleIndexedKV2;
    })()
  );

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/registry.js
  var Registry = (
    /** @class */
    (function() {
      function Registry2(generateIdentifier) {
        this.generateIdentifier = generateIdentifier;
        this.kv = new DoubleIndexedKV();
      }
      Registry2.prototype.register = function(value, identifier) {
        if (this.kv.getByValue(value)) {
          return;
        }
        if (!identifier) {
          identifier = this.generateIdentifier(value);
        }
        this.kv.set(identifier, value);
      };
      Registry2.prototype.clear = function() {
        this.kv.clear();
      };
      Registry2.prototype.getIdentifier = function(value) {
        return this.kv.getByValue(value);
      };
      Registry2.prototype.getValue = function(identifier) {
        return this.kv.getByKey(identifier);
      };
      return Registry2;
    })()
  );

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/class-registry.js
  var __extends = /* @__PURE__ */ (function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  })();
  var ClassRegistry = (
    /** @class */
    (function(_super) {
      __extends(ClassRegistry2, _super);
      function ClassRegistry2() {
        var _this = _super.call(this, function(c) {
          return c.name;
        }) || this;
        _this.classToAllowedProps = /* @__PURE__ */ new Map();
        return _this;
      }
      ClassRegistry2.prototype.register = function(value, options) {
        if (typeof options === "object") {
          if (options.allowProps) {
            this.classToAllowedProps.set(value, options.allowProps);
          }
          _super.prototype.register.call(this, value, options.identifier);
        } else {
          _super.prototype.register.call(this, value, options);
        }
      };
      ClassRegistry2.prototype.getAllowedProps = function(value) {
        return this.classToAllowedProps.get(value);
      };
      return ClassRegistry2;
    })(Registry)
  );

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/util.js
  var __read = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  function valuesOfObj(record) {
    if ("values" in Object) {
      return Object.values(record);
    }
    var values = [];
    for (var key in record) {
      if (record.hasOwnProperty(key)) {
        values.push(record[key]);
      }
    }
    return values;
  }
  function find(record, predicate) {
    var values = valuesOfObj(record);
    if ("find" in values) {
      return values.find(predicate);
    }
    var valuesNotNever = values;
    for (var i = 0; i < valuesNotNever.length; i++) {
      var value = valuesNotNever[i];
      if (predicate(value)) {
        return value;
      }
    }
    return void 0;
  }
  function forEach(record, run2) {
    Object.entries(record).forEach(function(_a) {
      var _b = __read(_a, 2), key = _b[0], value = _b[1];
      return run2(value, key);
    });
  }
  function includes(arr, value) {
    return arr.indexOf(value) !== -1;
  }
  function findArr(record, predicate) {
    for (var i = 0; i < record.length; i++) {
      var value = record[i];
      if (predicate(value)) {
        return value;
      }
    }
    return void 0;
  }

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/custom-transformer-registry.js
  var CustomTransformerRegistry = (
    /** @class */
    (function() {
      function CustomTransformerRegistry2() {
        this.transfomers = {};
      }
      CustomTransformerRegistry2.prototype.register = function(transformer) {
        this.transfomers[transformer.name] = transformer;
      };
      CustomTransformerRegistry2.prototype.findApplicable = function(v) {
        return find(this.transfomers, function(transformer) {
          return transformer.isApplicable(v);
        });
      };
      CustomTransformerRegistry2.prototype.findByName = function(name) {
        return this.transfomers[name];
      };
      return CustomTransformerRegistry2;
    })()
  );

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/is.js
  var getType = function(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
  };
  var isUndefined = function(payload) {
    return typeof payload === "undefined";
  };
  var isNull = function(payload) {
    return payload === null;
  };
  var isPlainObject = function(payload) {
    if (typeof payload !== "object" || payload === null)
      return false;
    if (payload === Object.prototype)
      return false;
    if (Object.getPrototypeOf(payload) === null)
      return true;
    return Object.getPrototypeOf(payload) === Object.prototype;
  };
  var isEmptyObject = function(payload) {
    return isPlainObject(payload) && Object.keys(payload).length === 0;
  };
  var isArray = function(payload) {
    return Array.isArray(payload);
  };
  var isString = function(payload) {
    return typeof payload === "string";
  };
  var isNumber = function(payload) {
    return typeof payload === "number" && !isNaN(payload);
  };
  var isBoolean = function(payload) {
    return typeof payload === "boolean";
  };
  var isRegExp = function(payload) {
    return payload instanceof RegExp;
  };
  var isMap = function(payload) {
    return payload instanceof Map;
  };
  var isSet = function(payload) {
    return payload instanceof Set;
  };
  var isSymbol = function(payload) {
    return getType(payload) === "Symbol";
  };
  var isDate = function(payload) {
    return payload instanceof Date && !isNaN(payload.valueOf());
  };
  var isError = function(payload) {
    return payload instanceof Error;
  };
  var isNaNValue = function(payload) {
    return typeof payload === "number" && isNaN(payload);
  };
  var isPrimitive = function(payload) {
    return isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
  };
  var isBigint = function(payload) {
    return typeof payload === "bigint";
  };
  var isInfinite = function(payload) {
    return payload === Infinity || payload === -Infinity;
  };
  var isTypedArray = function(payload) {
    return ArrayBuffer.isView(payload) && !(payload instanceof DataView);
  };
  var isURL = function(payload) {
    return payload instanceof URL;
  };

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/pathstringifier.js
  var escapeKey = function(key) {
    return key.replace(/\./g, "\\.");
  };
  var stringifyPath = function(path) {
    return path.map(String).map(escapeKey).join(".");
  };
  var parsePath = function(string) {
    var result = [];
    var segment = "";
    for (var i = 0; i < string.length; i++) {
      var char = string.charAt(i);
      var isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
      if (isEscapedDot) {
        segment += ".";
        i++;
        continue;
      }
      var isEndOfSegment = char === ".";
      if (isEndOfSegment) {
        result.push(segment);
        segment = "";
        continue;
      }
      segment += char;
    }
    var lastSegment = segment;
    result.push(lastSegment);
    return result;
  };

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/transformer.js
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __read2 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = function(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
  function simpleTransformation(isApplicable, annotation, transform, untransform) {
    return {
      isApplicable,
      annotation,
      transform,
      untransform
    };
  }
  var simpleRules = [
    simpleTransformation(isUndefined, "undefined", function() {
      return null;
    }, function() {
      return void 0;
    }),
    simpleTransformation(isBigint, "bigint", function(v) {
      return v.toString();
    }, function(v) {
      if (typeof BigInt !== "undefined") {
        return BigInt(v);
      }
      console.error("Please add a BigInt polyfill.");
      return v;
    }),
    simpleTransformation(isDate, "Date", function(v) {
      return v.toISOString();
    }, function(v) {
      return new Date(v);
    }),
    simpleTransformation(isError, "Error", function(v, superJson) {
      var baseError = {
        name: v.name,
        message: v.message
      };
      superJson.allowedErrorProps.forEach(function(prop) {
        baseError[prop] = v[prop];
      });
      return baseError;
    }, function(v, superJson) {
      var e = new Error(v.message);
      e.name = v.name;
      e.stack = v.stack;
      superJson.allowedErrorProps.forEach(function(prop) {
        e[prop] = v[prop];
      });
      return e;
    }),
    simpleTransformation(isRegExp, "regexp", function(v) {
      return "" + v;
    }, function(regex) {
      var body = regex.slice(1, regex.lastIndexOf("/"));
      var flags = regex.slice(regex.lastIndexOf("/") + 1);
      return new RegExp(body, flags);
    }),
    simpleTransformation(
      isSet,
      "set",
      // (sets only exist in es6+)
      // eslint-disable-next-line es5/no-es6-methods
      function(v) {
        return __spreadArray([], __read2(v.values()));
      },
      function(v) {
        return new Set(v);
      }
    ),
    simpleTransformation(isMap, "map", function(v) {
      return __spreadArray([], __read2(v.entries()));
    }, function(v) {
      return new Map(v);
    }),
    simpleTransformation(function(v) {
      return isNaNValue(v) || isInfinite(v);
    }, "number", function(v) {
      if (isNaNValue(v)) {
        return "NaN";
      }
      if (v > 0) {
        return "Infinity";
      } else {
        return "-Infinity";
      }
    }, Number),
    simpleTransformation(function(v) {
      return v === 0 && 1 / v === -Infinity;
    }, "number", function() {
      return "-0";
    }, Number),
    simpleTransformation(isURL, "URL", function(v) {
      return v.toString();
    }, function(v) {
      return new URL(v);
    })
  ];
  function compositeTransformation(isApplicable, annotation, transform, untransform) {
    return {
      isApplicable,
      annotation,
      transform,
      untransform
    };
  }
  var symbolRule = compositeTransformation(function(s, superJson) {
    if (isSymbol(s)) {
      var isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
      return isRegistered;
    }
    return false;
  }, function(s, superJson) {
    var identifier = superJson.symbolRegistry.getIdentifier(s);
    return ["symbol", identifier];
  }, function(v) {
    return v.description;
  }, function(_, a, superJson) {
    var value = superJson.symbolRegistry.getValue(a[1]);
    if (!value) {
      throw new Error("Trying to deserialize unknown symbol");
    }
    return value;
  });
  var constructorToName = [
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    Uint8ClampedArray
  ].reduce(function(obj, ctor) {
    obj[ctor.name] = ctor;
    return obj;
  }, {});
  var typedArrayRule = compositeTransformation(isTypedArray, function(v) {
    return ["typed-array", v.constructor.name];
  }, function(v) {
    return __spreadArray([], __read2(v));
  }, function(v, a) {
    var ctor = constructorToName[a[1]];
    if (!ctor) {
      throw new Error("Trying to deserialize unknown typed array");
    }
    return new ctor(v);
  });
  function isInstanceOfRegisteredClass(potentialClass, superJson) {
    if (potentialClass === null || potentialClass === void 0 ? void 0 : potentialClass.constructor) {
      var isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
      return isRegistered;
    }
    return false;
  }
  var classRule = compositeTransformation(isInstanceOfRegisteredClass, function(clazz, superJson) {
    var identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
    return ["class", identifier];
  }, function(clazz, superJson) {
    var allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
    if (!allowedProps) {
      return __assign({}, clazz);
    }
    var result = {};
    allowedProps.forEach(function(prop) {
      result[prop] = clazz[prop];
    });
    return result;
  }, function(v, a, superJson) {
    var clazz = superJson.classRegistry.getValue(a[1]);
    if (!clazz) {
      throw new Error("Trying to deserialize unknown class - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564");
    }
    return Object.assign(Object.create(clazz.prototype), v);
  });
  var customRule = compositeTransformation(function(value, superJson) {
    return !!superJson.customTransformerRegistry.findApplicable(value);
  }, function(value, superJson) {
    var transformer = superJson.customTransformerRegistry.findApplicable(value);
    return ["custom", transformer.name];
  }, function(value, superJson) {
    var transformer = superJson.customTransformerRegistry.findApplicable(value);
    return transformer.serialize(value);
  }, function(v, a, superJson) {
    var transformer = superJson.customTransformerRegistry.findByName(a[1]);
    if (!transformer) {
      throw new Error("Trying to deserialize unknown custom value");
    }
    return transformer.deserialize(v);
  });
  var compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
  var transformValue = function(value, superJson) {
    var applicableCompositeRule = findArr(compositeRules, function(rule) {
      return rule.isApplicable(value, superJson);
    });
    if (applicableCompositeRule) {
      return {
        value: applicableCompositeRule.transform(value, superJson),
        type: applicableCompositeRule.annotation(value, superJson)
      };
    }
    var applicableSimpleRule = findArr(simpleRules, function(rule) {
      return rule.isApplicable(value, superJson);
    });
    if (applicableSimpleRule) {
      return {
        value: applicableSimpleRule.transform(value, superJson),
        type: applicableSimpleRule.annotation
      };
    }
    return void 0;
  };
  var simpleRulesByAnnotation = {};
  simpleRules.forEach(function(rule) {
    simpleRulesByAnnotation[rule.annotation] = rule;
  });
  var untransformValue = function(json, type, superJson) {
    if (isArray(type)) {
      switch (type[0]) {
        case "symbol":
          return symbolRule.untransform(json, type, superJson);
        case "class":
          return classRule.untransform(json, type, superJson);
        case "custom":
          return customRule.untransform(json, type, superJson);
        case "typed-array":
          return typedArrayRule.untransform(json, type, superJson);
        default:
          throw new Error("Unknown transformation: " + type);
      }
    } else {
      var transformation = simpleRulesByAnnotation[type];
      if (!transformation) {
        throw new Error("Unknown transformation: " + type);
      }
      return transformation.untransform(json, superJson);
    }
  };

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/accessDeep.js
  var getNthKey = function(value, n) {
    var keys = value.keys();
    while (n > 0) {
      keys.next();
      n--;
    }
    return keys.next().value;
  };
  function validatePath(path) {
    if (includes(path, "__proto__")) {
      throw new Error("__proto__ is not allowed as a property");
    }
    if (includes(path, "prototype")) {
      throw new Error("prototype is not allowed as a property");
    }
    if (includes(path, "constructor")) {
      throw new Error("constructor is not allowed as a property");
    }
  }
  var getDeep = function(object, path) {
    validatePath(path);
    for (var i = 0; i < path.length; i++) {
      var key = path[i];
      if (isSet(object)) {
        object = getNthKey(object, +key);
      } else if (isMap(object)) {
        var row = +key;
        var type = +path[++i] === 0 ? "key" : "value";
        var keyOfRow = getNthKey(object, row);
        switch (type) {
          case "key":
            object = keyOfRow;
            break;
          case "value":
            object = object.get(keyOfRow);
            break;
        }
      } else {
        object = object[key];
      }
    }
    return object;
  };
  var setDeep = function(object, path, mapper) {
    validatePath(path);
    if (path.length === 0) {
      return mapper(object);
    }
    var parent = object;
    for (var i = 0; i < path.length - 1; i++) {
      var key = path[i];
      if (isArray(parent)) {
        var index = +key;
        parent = parent[index];
      } else if (isPlainObject(parent)) {
        parent = parent[key];
      } else if (isSet(parent)) {
        var row = +key;
        parent = getNthKey(parent, row);
      } else if (isMap(parent)) {
        var isEnd = i === path.length - 2;
        if (isEnd) {
          break;
        }
        var row = +key;
        var type = +path[++i] === 0 ? "key" : "value";
        var keyOfRow = getNthKey(parent, row);
        switch (type) {
          case "key":
            parent = keyOfRow;
            break;
          case "value":
            parent = parent.get(keyOfRow);
            break;
        }
      }
    }
    var lastKey = path[path.length - 1];
    if (isArray(parent)) {
      parent[+lastKey] = mapper(parent[+lastKey]);
    } else if (isPlainObject(parent)) {
      parent[lastKey] = mapper(parent[lastKey]);
    }
    if (isSet(parent)) {
      var oldValue = getNthKey(parent, +lastKey);
      var newValue = mapper(oldValue);
      if (oldValue !== newValue) {
        parent["delete"](oldValue);
        parent.add(newValue);
      }
    }
    if (isMap(parent)) {
      var row = +path[path.length - 2];
      var keyToRow = getNthKey(parent, row);
      var type = +lastKey === 0 ? "key" : "value";
      switch (type) {
        case "key": {
          var newKey = mapper(keyToRow);
          parent.set(newKey, parent.get(keyToRow));
          if (newKey !== keyToRow) {
            parent["delete"](keyToRow);
          }
          break;
        }
        case "value": {
          parent.set(keyToRow, mapper(parent.get(keyToRow)));
          break;
        }
      }
    }
    return object;
  };

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/plainer.js
  var __read3 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = function(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
  function traverse(tree, walker2, origin) {
    if (origin === void 0) {
      origin = [];
    }
    if (!tree) {
      return;
    }
    if (!isArray(tree)) {
      forEach(tree, function(subtree, key) {
        return traverse(subtree, walker2, __spreadArray2(__spreadArray2([], __read3(origin)), __read3(parsePath(key))));
      });
      return;
    }
    var _a = __read3(tree, 2), nodeValue = _a[0], children = _a[1];
    if (children) {
      forEach(children, function(child, key) {
        traverse(child, walker2, __spreadArray2(__spreadArray2([], __read3(origin)), __read3(parsePath(key))));
      });
    }
    walker2(nodeValue, origin);
  }
  function applyValueAnnotations(plain, annotations, superJson) {
    traverse(annotations, function(type, path) {
      plain = setDeep(plain, path, function(v) {
        return untransformValue(v, type, superJson);
      });
    });
    return plain;
  }
  function applyReferentialEqualityAnnotations(plain, annotations) {
    function apply(identicalPaths, path) {
      var object = getDeep(plain, parsePath(path));
      identicalPaths.map(parsePath).forEach(function(identicalObjectPath) {
        plain = setDeep(plain, identicalObjectPath, function() {
          return object;
        });
      });
    }
    if (isArray(annotations)) {
      var _a = __read3(annotations, 2), root2 = _a[0], other = _a[1];
      root2.forEach(function(identicalPath) {
        plain = setDeep(plain, parsePath(identicalPath), function() {
          return plain;
        });
      });
      if (other) {
        forEach(other, apply);
      }
    } else {
      forEach(annotations, apply);
    }
    return plain;
  }
  var isDeep = function(object, superJson) {
    return isPlainObject(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
  };
  function addIdentity(object, path, identities) {
    var existingSet = identities.get(object);
    if (existingSet) {
      existingSet.push(path);
    } else {
      identities.set(object, [path]);
    }
  }
  function generateReferentialEqualityAnnotations(identitites, dedupe) {
    var result = {};
    var rootEqualityPaths = void 0;
    identitites.forEach(function(paths) {
      if (paths.length <= 1) {
        return;
      }
      if (!dedupe) {
        paths = paths.map(function(path) {
          return path.map(String);
        }).sort(function(a, b) {
          return a.length - b.length;
        });
      }
      var _a = __read3(paths), representativePath = _a[0], identicalPaths = _a.slice(1);
      if (representativePath.length === 0) {
        rootEqualityPaths = identicalPaths.map(stringifyPath);
      } else {
        result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
      }
    });
    if (rootEqualityPaths) {
      if (isEmptyObject(result)) {
        return [rootEqualityPaths];
      } else {
        return [rootEqualityPaths, result];
      }
    } else {
      return isEmptyObject(result) ? void 0 : result;
    }
  }
  var walker = function(object, identities, superJson, dedupe, path, objectsInThisPath, seenObjects) {
    var _a;
    if (path === void 0) {
      path = [];
    }
    if (objectsInThisPath === void 0) {
      objectsInThisPath = [];
    }
    if (seenObjects === void 0) {
      seenObjects = /* @__PURE__ */ new Map();
    }
    var primitive = isPrimitive(object);
    if (!primitive) {
      addIdentity(object, path, identities);
      var seen = seenObjects.get(object);
      if (seen) {
        return dedupe ? {
          transformedValue: null
        } : seen;
      }
    }
    if (!isDeep(object, superJson)) {
      var transformed_1 = transformValue(object, superJson);
      var result_1 = transformed_1 ? {
        transformedValue: transformed_1.value,
        annotations: [transformed_1.type]
      } : {
        transformedValue: object
      };
      if (!primitive) {
        seenObjects.set(object, result_1);
      }
      return result_1;
    }
    if (includes(objectsInThisPath, object)) {
      return {
        transformedValue: null
      };
    }
    var transformationResult = transformValue(object, superJson);
    var transformed = (_a = transformationResult === null || transformationResult === void 0 ? void 0 : transformationResult.value) !== null && _a !== void 0 ? _a : object;
    var transformedValue = isArray(transformed) ? [] : {};
    var innerAnnotations = {};
    forEach(transformed, function(value, index) {
      var recursiveResult = walker(value, identities, superJson, dedupe, __spreadArray2(__spreadArray2([], __read3(path)), [index]), __spreadArray2(__spreadArray2([], __read3(objectsInThisPath)), [object]), seenObjects);
      transformedValue[index] = recursiveResult.transformedValue;
      if (isArray(recursiveResult.annotations)) {
        innerAnnotations[index] = recursiveResult.annotations;
      } else if (isPlainObject(recursiveResult.annotations)) {
        forEach(recursiveResult.annotations, function(tree, key) {
          innerAnnotations[escapeKey(index) + "." + key] = tree;
        });
      }
    });
    var result = isEmptyObject(innerAnnotations) ? {
      transformedValue,
      annotations: !!transformationResult ? [transformationResult.type] : void 0
    } : {
      transformedValue,
      annotations: !!transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
    };
    if (!primitive) {
      seenObjects.set(object, result);
    }
    return result;
  };

  // node_modules/.pnpm/is-what@4.1.16/node_modules/is-what/dist/index.js
  function getType2(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
  }
  function isArray2(payload) {
    return getType2(payload) === "Array";
  }
  function isPlainObject2(payload) {
    if (getType2(payload) !== "Object")
      return false;
    const prototype = Object.getPrototypeOf(payload);
    return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
  }
  function isNull2(payload) {
    return getType2(payload) === "Null";
  }
  function isOneOf(a, b, c, d, e) {
    return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
  }
  function isUndefined2(payload) {
    return getType2(payload) === "Undefined";
  }
  var isNullOrUndefined = isOneOf(isNull2, isUndefined2);

  // node_modules/.pnpm/copy-anything@3.0.5/node_modules/copy-anything/dist/index.js
  function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
    const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
    if (propType === "enumerable")
      carry[key] = newVal;
    if (includeNonenumerable && propType === "nonenumerable") {
      Object.defineProperty(carry, key, {
        value: newVal,
        enumerable: false,
        writable: true,
        configurable: true
      });
    }
  }
  function copy(target, options = {}) {
    if (isArray2(target)) {
      return target.map((item) => copy(item, options));
    }
    if (!isPlainObject2(target)) {
      return target;
    }
    const props = Object.getOwnPropertyNames(target);
    const symbols = Object.getOwnPropertySymbols(target);
    return [...props, ...symbols].reduce((carry, key) => {
      if (isArray2(options.props) && !options.props.includes(key)) {
        return carry;
      }
      const val = target[key];
      const newVal = copy(val, options);
      assignProp(carry, key, newVal, target, options.nonenumerable);
      return carry;
    }, {});
  }

  // node_modules/.pnpm/superjson@1.13.3/node_modules/superjson/dist/esm/index.js
  var __assign2 = function() {
    __assign2 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  var __read4 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray3 = function(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
  var SuperJSON = (
    /** @class */
    (function() {
      function SuperJSON2(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.dedupe, dedupe = _c === void 0 ? false : _c;
        this.classRegistry = new ClassRegistry();
        this.symbolRegistry = new Registry(function(s) {
          var _a2;
          return (_a2 = s.description) !== null && _a2 !== void 0 ? _a2 : "";
        });
        this.customTransformerRegistry = new CustomTransformerRegistry();
        this.allowedErrorProps = [];
        this.dedupe = dedupe;
      }
      SuperJSON2.prototype.serialize = function(object) {
        var identities = /* @__PURE__ */ new Map();
        var output = walker(object, identities, this, this.dedupe);
        var res = {
          json: output.transformedValue
        };
        if (output.annotations) {
          res.meta = __assign2(__assign2({}, res.meta), { values: output.annotations });
        }
        var equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
        if (equalityAnnotations) {
          res.meta = __assign2(__assign2({}, res.meta), { referentialEqualities: equalityAnnotations });
        }
        return res;
      };
      SuperJSON2.prototype.deserialize = function(payload) {
        var json = payload.json, meta = payload.meta;
        var result = copy(json);
        if (meta === null || meta === void 0 ? void 0 : meta.values) {
          result = applyValueAnnotations(result, meta.values, this);
        }
        if (meta === null || meta === void 0 ? void 0 : meta.referentialEqualities) {
          result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
        }
        return result;
      };
      SuperJSON2.prototype.stringify = function(object) {
        return JSON.stringify(this.serialize(object));
      };
      SuperJSON2.prototype.parse = function(string) {
        return this.deserialize(JSON.parse(string));
      };
      SuperJSON2.prototype.registerClass = function(v, options) {
        this.classRegistry.register(v, options);
      };
      SuperJSON2.prototype.registerSymbol = function(v, identifier) {
        this.symbolRegistry.register(v, identifier);
      };
      SuperJSON2.prototype.registerCustom = function(transformer, name) {
        this.customTransformerRegistry.register(__assign2({ name }, transformer));
      };
      SuperJSON2.prototype.allowErrorProps = function() {
        var _a;
        var props = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          props[_i] = arguments[_i];
        }
        (_a = this.allowedErrorProps).push.apply(_a, __spreadArray3([], __read4(props)));
      };
      SuperJSON2.defaultInstance = new SuperJSON2();
      SuperJSON2.serialize = SuperJSON2.defaultInstance.serialize.bind(SuperJSON2.defaultInstance);
      SuperJSON2.deserialize = SuperJSON2.defaultInstance.deserialize.bind(SuperJSON2.defaultInstance);
      SuperJSON2.stringify = SuperJSON2.defaultInstance.stringify.bind(SuperJSON2.defaultInstance);
      SuperJSON2.parse = SuperJSON2.defaultInstance.parse.bind(SuperJSON2.defaultInstance);
      SuperJSON2.registerClass = SuperJSON2.defaultInstance.registerClass.bind(SuperJSON2.defaultInstance);
      SuperJSON2.registerSymbol = SuperJSON2.defaultInstance.registerSymbol.bind(SuperJSON2.defaultInstance);
      SuperJSON2.registerCustom = SuperJSON2.defaultInstance.registerCustom.bind(SuperJSON2.defaultInstance);
      SuperJSON2.allowErrorProps = SuperJSON2.defaultInstance.allowErrorProps.bind(SuperJSON2.defaultInstance);
      return SuperJSON2;
    })()
  );
  var esm_default = SuperJSON;
  var serialize = SuperJSON.serialize;
  var deserialize = SuperJSON.deserialize;
  var stringify = SuperJSON.stringify;
  var parse = SuperJSON.parse;
  var registerClass = SuperJSON.registerClass;
  var registerCustom = SuperJSON.registerCustom;
  var registerSymbol = SuperJSON.registerSymbol;
  var allowErrorProps = SuperJSON.allowErrorProps;

  // starters/web-db-user-v1/shared/const.ts
  var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
  var OAUTH_STATE_COOKIE = "__Host-oauth_state";
  var encodeOAuthState = (state) => btoa(JSON.stringify(state));

  // starters/web-db-user-v1/client/src/const.ts
  var startLogin = () => {
    const oauthPortalUrl = window.__MANUS_CONFIG__?.oauthPortalUrl;
    const appId = window.__MANUS_CONFIG__?.projectId;
    if (!oauthPortalUrl || !appId) throw new Error("Manus login is not configured");
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const nonce = crypto.randomUUID();
    document.cookie = `${OAUTH_STATE_COOKIE}=${nonce}; Path=/; Max-Age=600; SameSite=None; Secure`;
    const state = encodeOAuthState({ redirectUri, nonce });
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("responseType", "code");
    window.location.href = url.toString();
  };

  // scripts/game-auth-browser-entry.mjs
  var root = window;
  var pathname = new URL(root.location.href).pathname;
  var marker = pathname.indexOf("/__manus__/game-preview/");
  var prefix = marker < 0 ? "" : pathname.slice(0, marker);
  var client = createTRPCUntypedClient({ links: [httpLink({
    url: prefix + "/api/trpc",
    transformer: esm_default,
    async fetch(url, options) {
      const response = await root.fetch(url, { ...options, credentials: "same-origin", cache: "no-store", redirect: "error", signal: AbortSignal.timeout(35e3) });
      if (response.status === 503 && (await response.clone().json().catch(() => null))?.error === "online_preview_requires_checkpoint") {
        throw new Error("online_preview_requires_checkpoint");
      }
      return response;
    }
  })] });
  var current = null;
  var pending = null;
  function publish(user, status = user ? "authenticated" : "logged_out") {
    current = { status, user: user ? { id: user.id, name: user.name } : null };
    root.dispatchEvent(new root.CustomEvent("manus-auth-change", { detail: current }));
    return current;
  }
  function requireOnline() {
    if (current?.status === "offline") throw new Error("online_preview_requires_checkpoint");
  }
  function standaloneUrl(login2 = false) {
    const url = new URL(root.location.origin + root.location.pathname);
    if (login2) url.searchParams.set("manus_login", "1");
    return url.href;
  }
  async function login() {
    requireOnline();
    if (root.self !== root.top) {
      root.open(standaloneUrl(true), "_blank", "noopener");
      return;
    }
    const response = await root.fetch(prefix + "/api/auth/config", { credentials: "same-origin", cache: "no-store", redirect: "error", signal: AbortSignal.timeout(35e3) });
    if (!response.ok) throw new Error("auth_unavailable");
    root.__MANUS_CONFIG__ = await response.json();
    startLogin();
  }
  async function call(kind, procedure, input) {
    requireOnline();
    try {
      return await client[kind](procedure, input);
    } catch (error) {
      if (error.data?.code === "UNAUTHORIZED") publish(null);
      throw error;
    }
  }
  async function prepare() {
    const url = new URL(root.location.href);
    if (url.searchParams.has("code") || url.searchParams.has("state")) throw new Error("oauth_callback_route_invalid");
    if (!pending) pending = client.query("webdev.auth.me").then(publish).catch((error) => {
      if (error.message === "online_preview_requires_checkpoint") return publish(null, "offline");
      throw error;
    }).then(async (state) => {
      if (url.searchParams.get("manus_login") === "1" && root.self === root.top) {
        url.searchParams.delete("manus_login");
        root.history.replaceState(null, "", url.href);
        if (state.status === "logged_out") await login();
      }
      return state;
    }).finally(() => {
      pending = null;
    });
    return pending;
  }
  var ManusAuth = Object.freeze({
    prepare,
    login,
    async startGame(start) {
      const state = await prepare();
      await start(state);
      return state;
    },
    invoke(operation, done) {
      if (!["login", "logout"].includes(operation)) {
        done("auth_operation_invalid");
        return;
      }
      ManusAuth[operation]().then(() => done(""), (error) => done(error.message));
    },
    async logout() {
      await call("mutation", "webdev.auth.logout");
      return publish(null);
    },
    get_session: () => current,
    query: (procedure, input) => call("query", `game.${procedure}`, input),
    mutate: (procedure, input) => call("mutation", `game.${procedure}`, input),
    open_standalone: () => {
      root.open(standaloneUrl(), "_blank", "noopener");
    }
  });
  root.ManusAuth = ManusAuth;
})();
/*! Bundled license information:

@trpc/client/dist/httpLink-CBOGz9wP.mjs:
  (* istanbul ignore if -- @preserve *)
*/
