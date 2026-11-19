var __defProp = Object.defineProperty;
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

// shared/gameStarterCatalog.ts
var GAME_STARTER_CATALOG = {
  generic: { id: "game-generic-v56", reference: "game-generic.md" },
  platformer: { id: "game-platformer-v62", reference: "game-platformer.md" },
  "bullet-hell": { id: "game-bullet-hell-v52", reference: "game-bullet-hell.md" },
  "vertical-platformer": { id: "game-vertical-platformer-v63", reference: "game-vertical-platformer.md" },
  scroller: { id: "game-scroller-v63", reference: "game-scroller.md" },
  td: { id: "game-td-v67", reference: "game-td.md" },
  rts: { id: "game-rts-v63", reference: "game-rts.md" },
  "trading-card": { id: "game-trading-card-v56", reference: "game-trading-card.md" },
  "generic-multiplayer": { id: "game-generic-multiplayer-v40", reference: "game-generic-multiplayer.md" },
  puzzle: { id: "game-puzzle-v63", reference: "game-puzzle.md" },
  pinball: { id: "game-pinball-v9", reference: "game-pinball.md" }
};
var GAME_STARTER_CHOICES = Object.keys(GAME_STARTER_CATALOG);
function isGameStarterChoice(value) {
  return typeof value === "string" && (Object.hasOwn(GAME_STARTER_CATALOG, value) || isHistoricalGameStarterChoice(value));
}
function isHistoricalGameStarterChoice(value) {
  return value === "scribble-sky-hop";
}
function gameStarterRevision(choice = "generic") {
  if (!isGameStarterChoice(choice))
    throw new Error("Unknown Game starter");
  return GAME_STARTER_CATALOG[isHistoricalGameStarterChoice(choice) ? "vertical-platformer" : choice].id;
}

// scripts/game-starter-cli.ts
import path3 from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath as fileURLToPath2 } from "node:url";

// mcp/init/gameStarter.ts
import fs3 from "node:fs/promises";
import path2 from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { constants } from "node:fs";

// mcp/init/runner.ts
import { execFile } from "node:child_process";
import { promisify } from "node:util";

// mcp/init/gitPlatform.ts
var gitRejectCommand = process.platform === "win32" ? "exit 1" : "/bin/false";

// mcp/init/runner.ts
var execFileAsync = promisify(execFile);
var STARTER_TEMP_HEX_GLOB = "[0-9a-f]".repeat(16);
var STARTER_TEMP_GIT_PATHSPEC = `:(top,glob)**/*.manus-starter-${STARTER_TEMP_HEX_GLOB}`;
var STARTER_TEMP_GIT_IGNORE_PATTERN = `*.manus-starter-${STARTER_TEMP_HEX_GLOB}`;

// shared/webdev-features.ts
var WEBDEV_FEATURE_KEYS = ["database", "server", "redis"];
var webdevFeatureKeySet = new Set(WEBDEV_FEATURE_KEYS);
function resolveWebdevFeatures(declared) {
  const server = declared?.server === true;
  const database = server ? declared?.database ?? true : false;
  return {
    server,
    database,
    ...declared?.redis !== undefined ? { redis: declared.redis } : {}
  };
}

// shared/webdev-contract-core.ts
var WEBDEV_ADDON_ID = "manus-webdev";
var WEBDEV_RESOURCE_KEY = "project";
var MANUS_ADDON_LAUNCH_INTENT_SCHEMA = "manus.addon.launch_intent/v1";
var WEBDEV_DASHBOARD_LAUNCH_INTENT = Object.freeze({
  schema: MANUS_ADDON_LAUNCH_INTENT_SCHEMA,
  intent: "dashboard"
});
var WEBDEV_PREVIEW_LAUNCH_INTENT = Object.freeze({
  schema: MANUS_ADDON_LAUNCH_INTENT_SCHEMA,
  intent: "preview"
});
var WEBDEV_PUBLISH_LAUNCH_INTENT = Object.freeze({
  schema: MANUS_ADDON_LAUNCH_INTENT_SCHEMA,
  intent: "publish"
});
var WEBDEV_MAKE_COPY_LAUNCH_INTENT = Object.freeze({
  schema: MANUS_ADDON_LAUNCH_INTENT_SCHEMA,
  intent: "make-copy"
});
var WEBDEV_SETTINGS_LAUNCH_INTENT = Object.freeze({
  schema: MANUS_ADDON_LAUNCH_INTENT_SCHEMA,
  intent: "settings"
});
var WEBDEV_SETTINGS_SECRETS_LAUNCH_INTENT = Object.freeze({
  schema: MANUS_ADDON_LAUNCH_INTENT_SCHEMA,
  intent: "settings.secrets"
});
var WEBDEV_SETTINGS_INTEGRATIONS_STRIPE_LAUNCH_INTENT = Object.freeze({
  schema: MANUS_ADDON_LAUNCH_INTENT_SCHEMA,
  intent: "settings.integrations.stripe"
});
var WEBDEV_SETTINGS_INTEGRATIONS_SHOPIFY_LAUNCH_INTENT = Object.freeze({
  schema: MANUS_ADDON_LAUNCH_INTENT_SCHEMA,
  intent: "settings.integrations.shopify"
});
var WEBDEV_SETTINGS_GITHUB_LAUNCH_INTENT = Object.freeze({
  schema: MANUS_ADDON_LAUNCH_INTENT_SCHEMA,
  intent: "settings.github"
});
var WEBDEV_RESOURCE_URI_PREFIX = `manus-resource://${WEBDEV_ADDON_ID}/${WEBDEV_RESOURCE_KEY}/`;
var WEBDEV_WIDGET_ID = "dashboard";
var WEBDEV_STORED_SECRET_KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]{0,127}$/;
// shared/webdev-route-rules.ts
var WEBDEV_ROUTES_MAX_RULES = 32;
var WEBDEV_ROUTE_PATH_MAX_LENGTH = 256;
var WEBDEV_ROUTE_CACHE_MAX_SECONDS = 31536000;
var WEBDEV_ROUTE_SERVER_CACHE_MAX_SECONDS = 600;
var WEBDEV_ROUTE_TARGETS = ["static", "server"];
var WEBDEV_ROUTE_CACHE_KEYWORDS = ["immutable", "no-cache"];
var WEBDEV_ROUTE_RESERVED_PREFIXES = [
  "/favicon.ico",
  "/manus-oauth/",
  "/api/scheduled/",
  "/manus-storage/",
  "/__manus/",
  "/__system__/",
  "/sitemap.xml",
  "/robots.txt"
];
function isReservedWebdevRoutePath(path) {
  return WEBDEV_ROUTE_RESERVED_PREFIXES.some((entry) => {
    const base = entry.endsWith("/") ? entry.slice(0, -1) : entry;
    return path === base || path.startsWith(`${base}/`);
  });
}
var WEBDEV_ROUTE_PATH_JSON_PATTERN = "^/\\*$|^(?:/\\.*[A-Za-z0-9_~-][A-Za-z0-9._~-]*)+(?:/\\*)?$";
// shared/webdev-resource-tiers.ts
var WEBDEV_CONTAINER_RESOURCE_TIERS = [
  { cpu: 0.25, memoryMb: 512 },
  { cpu: 0.5, memoryMb: 1024 },
  { cpu: 1, memoryMb: 2048 },
  { cpu: 2, memoryMb: 4096 },
  { cpu: 4, memoryMb: 8192 },
  { cpu: 8, memoryMb: 16384 }
];
function webdevContainerResourceTier(cpu, memoryMb) {
  return WEBDEV_CONTAINER_RESOURCE_TIERS.find((tier) => tier.cpu === cpu && tier.memoryMb === memoryMb);
}
var WEBDEV_CONTAINER_RESOURCE_TIER_LABELS = WEBDEV_CONTAINER_RESOURCE_TIERS.map((tier) => `${tier.cpu} vCPU / ${tier.memoryMb} MiB`).join(", ");

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js
var exports_external = {};
__export(exports_external, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
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
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
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
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
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
// node_modules/.pnpm/zod@3.25.76/node_modules/zod/index.js
var zod_default = exports_external;

// shared/webdev-stripe-secret-keys.ts
var WEBDEV_STRIPE_FIXED_SECRET_DECLARATIONS = {
  STRIPE_SECRET_KEY: {
    description: "Managed by Stripe integration",
    revision: 1
  },
  VITE_STRIPE_PUBLISHABLE_KEY: {
    description: "Managed by Stripe integration",
    revision: 1
  },
  STRIPE_WEBHOOK_SECRET: {
    description: "Managed by Stripe integration",
    revision: 1
  }
};
var WEBDEV_STRIPE_FIXED_SECRET_KEYS = Object.keys(WEBDEV_STRIPE_FIXED_SECRET_DECLARATIONS);
// shared/webdev-self-config.ts
var WEBDEV_SELF_CONFIG_VERSION = 1;
var secretKeyPattern = /^[A-Z][A-Z0-9_]{0,127}$/;
var safeRelativePathPattern = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))(?!.*\0)[A-Za-z0-9._/-]{1,256}$/;
var safeHealthPathPattern = /^(?=\/)(?!.*(?:^|\/)\.\.(?:\/|$))(?!.*\0)[A-Za-z0-9._/-]{1,256}$/;
function isCanonicalRepoRelativePath(value) {
  if (value === "" || value === "." || value === "..")
    return false;
  return value.split("/").every((segment) => segment !== "" && segment !== "." && segment !== "..");
}
var knownCredentialLiteral = /(?:sk-[A-Za-z0-9_-]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
var WEBDEV_DEFAULT_DOCKERFILE_PATH = "Dockerfile";
var webdevDeployConfigSchema = zod_default.object({
  dockerfilePath: zod_default.string().trim().regex(safeRelativePathPattern).default(WEBDEV_DEFAULT_DOCKERFILE_PATH),
  healthPath: zod_default.string().trim().regex(safeHealthPathPattern)
}).strict();
var webdevFeaturesConfigShape = {
  redis: zod_default.boolean().optional(),
  database: zod_default.boolean().optional(),
  server: zod_default.boolean().optional()
};
var webdevFeaturesConfigSchema = zod_default.object(webdevFeaturesConfigShape).strict();
var webdevBuildConfigSchema = zod_default.object({
  command: zod_default.string().trim().min(1).max(1000).refine((value) => !knownCredentialLiteral.test(value), "inline credentials are forbidden; declare the key under secrets instead"),
  outputDirectory: zod_default.string().trim().regex(safeRelativePathPattern)
}).strict();
var webdevRoutePathPattern = new RegExp(WEBDEV_ROUTE_PATH_JSON_PATTERN);
var webdevRouteRuleSchema = zod_default.object({
  path: zod_default.string().max(WEBDEV_ROUTE_PATH_MAX_LENGTH).regex(webdevRoutePathPattern),
  target: zod_default.enum(WEBDEV_ROUTE_TARGETS),
  cache: zod_default.union([
    zod_default.enum(WEBDEV_ROUTE_CACHE_KEYWORDS),
    zod_default.number().int().min(0).max(WEBDEV_ROUTE_CACHE_MAX_SECONDS)
  ]).optional(),
  spaFallback: zod_default.boolean().optional()
}).strict();
var WEBDEV_PWA_MANIFEST_MODES = [
  "platform_default",
  "application_owned"
];
var webdevPwaConfigSchema = zod_default.object({
  manifestMode: zod_default.enum(WEBDEV_PWA_MANIFEST_MODES)
}).strict();
var WEBDEV_HOSTING_MODES = ["on_demand", "always_on"];
var WEBDEV_HOSTING_IDLE_MINUTES_MIN = 30;
var WEBDEV_HOSTING_IDLE_MINUTES_MAX = 4320;
var webdevHostingConfigSchema = zod_default.object({
  mode: zod_default.enum(WEBDEV_HOSTING_MODES).optional(),
  idleMinutes: zod_default.number().int().min(WEBDEV_HOSTING_IDLE_MINUTES_MIN).max(WEBDEV_HOSTING_IDLE_MINUTES_MAX).optional()
}).strict();
function validateHostingConfig(hosting, context) {
  if (Object.keys(hosting).length === 0) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["hosting"],
      params: { code: "hosting_empty" },
      message: "hosting declares none of the supported keys (mode, idleMinutes); " + "declare at least one or omit the whole section"
    });
    return;
  }
  if (hosting.mode === "always_on" && hosting.idleMinutes !== undefined) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["hosting", "idleMinutes"],
      params: { code: "hosting_idle_minutes_conflicts_always_on" },
      message: 'hosting.idleMinutes only applies to "on_demand" mode; an always-on deployment never ' + "sleeps, so declare exactly one of the two"
    });
  }
}
var WEBDEV_MEMBERSHIP_GATED_TIERS = [{ cpu: 8, memoryMb: 16384 }];
var WEBDEV_MEMBERSHIP_GATED_TIER_LABELS = WEBDEV_MEMBERSHIP_GATED_TIERS.map((tier) => `${tier.cpu} vCPU / ${tier.memoryMb} MiB`).join(", ");
var WEBDEV_DIAGNOSTICS_LANGUAGES = [
  "typescript",
  "pyright",
  "gopls",
  "html",
  "css",
  "json",
  "yaml",
  "vue",
  "astro",
  "svelte",
  "dockerfile",
  "graphql",
  "prisma",
  "php",
  "toml",
  "terraform",
  "markdown",
  "sql",
  "rust-analyzer"
];
var WEBDEV_DIAGNOSTICS_MAX_LANGUAGES = 4;
var WEBDEV_DIAGNOSTICS_LANGUAGE_ALIASES = {
  python: "pyright",
  py: "pyright",
  go: "gopls",
  golang: "gopls",
  rust: "rust-analyzer",
  rs: "rust-analyzer",
  javascript: "typescript",
  js: "typescript",
  ts: "typescript",
  tsx: "typescript",
  scss: "css",
  less: "css",
  md: "markdown",
  yml: "yaml",
  docker: "dockerfile",
  postgres: "sql",
  postgresql: "sql",
  tf: "terraform"
};
var WEBDEV_DIAGNOSTICS_ACCEPTED_LANGUAGE_INPUTS = [
  ...WEBDEV_DIAGNOSTICS_LANGUAGES,
  ...Object.keys(WEBDEV_DIAGNOSTICS_LANGUAGE_ALIASES)
];
function canonicalWebdevDiagnosticsLanguage(value) {
  const normalized = value.trim().toLowerCase();
  return WEBDEV_DIAGNOSTICS_LANGUAGE_ALIASES[normalized] ?? normalized;
}
function webdevDeclaredDiagnosticsLanguages(diagnostics) {
  if (!diagnostics) {
    return [];
  }
  const declared = [];
  for (const raw of diagnostics.languages ?? []) {
    if (!raw) {
      continue;
    }
    const candidate = canonicalWebdevDiagnosticsLanguage(raw);
    if (declared.includes(candidate)) {
      continue;
    }
    declared.push(candidate);
  }
  return declared;
}
var WEBDEV_DIAGNOSTICS_SETTINGS_MAX_BYTES = 8192;
var WEBDEV_DIAGNOSTICS_SETTINGS_MAX_KEYS = 64;
var declaredCommandPattern = /^[A-Za-z0-9][A-Za-z0-9._+-]{0,63}$/;
var declaredArgPattern = /^-{0,2}[A-Za-z0-9][A-Za-z0-9._=+/-]{0,63}$/;
var declaredLanguageIdPattern = /^[A-Za-z0-9][A-Za-z0-9._+-]{0,31}$/;
var declaredServerNamePattern = /^[a-z0-9][a-z0-9-]{0,31}$/;
var diagnosticsLanguageRefPattern = /^[A-Za-z0-9][A-Za-z0-9.+-]{0,31}$/;
var declaredExtensionPattern = /^\.[A-Za-z0-9]{1,15}$/;
var declaredBareFileNamePattern = /^[^/\\\0]{1,64}$/;
var WEBDEV_DIAGNOSTICS_DECLARED_PROBE_MAX_BYTES = 4096;
var webdevDeclaredServerSchema = zod_default.object({
  command: zod_default.string().trim().regex(declaredCommandPattern),
  args: zod_default.array(zod_default.string().trim().regex(declaredArgPattern)).max(4).optional(),
  languageId: zod_default.string().trim().regex(declaredLanguageIdPattern),
  extensions: zod_default.array(zod_default.string().trim().regex(declaredExtensionPattern)).min(1).max(8),
  configFiles: zod_default.array(zod_default.string().trim().regex(declaredBareFileNamePattern)).max(8).optional(),
  requires: zod_default.array(zod_default.string().trim().regex(declaredCommandPattern)).max(4).optional(),
  probe: zod_default.string().max(WEBDEV_DIAGNOSTICS_DECLARED_PROBE_MAX_BYTES).refine((value) => value.trim().length > 0, {
    message: "probe must contain a snippet that provokes an error, not only whitespace"
  })
}).strict();
var webdevRuntimeDiagnosticsSchema = zod_default.object({
  languages: zod_default.array(zod_default.string().trim().regex(diagnosticsLanguageRefPattern)).min(1).max(WEBDEV_DIAGNOSTICS_ACCEPTED_LANGUAGE_INPUTS.length).optional(),
  settings: zod_default.record(zod_default.string(), zod_default.unknown()).optional(),
  servers: zod_default.record(zod_default.string().regex(declaredServerNamePattern), webdevDeclaredServerSchema).optional()
}).strict();
var WEBDEV_INTEGRATIONS = ["stripe", "shopify"];
function webdevIntegrationsDeclarationSchema(members) {
  return zod_default.array(zod_default.enum(members)).min(1).max(members.length).refine((value) => new Set(value).size === value.length, {
    message: "integrations must not repeat an entry"
  });
}
var secretDeclarationSchema = zod_default.object({
  description: zod_default.string().trim().min(1).max(500).refine((value) => !knownCredentialLiteral.test(value), "credential literals are forbidden").optional(),
  revision: zod_default.number().int().positive().optional()
}).strict();
var WEBDEV_RUNTIME_ENDPOINTS_MAX = 4;
var WEBDEV_RUNTIME_ENDPOINT_NAME_PATTERN = /^[a-z](?:[a-z0-9-]{0,30}[a-z0-9])?$/;
var WEBDEV_RUNTIME_ENDPOINT_RESERVED_NAMES = ["preview", "primary"];
var WEBDEV_RUNTIME_ENDPOINT_RESERVED_PORTS = [
  5900,
  5901,
  8328,
  8330,
  8340,
  8350,
  9222,
  9330,
  19780,
  50031
];
var webdevRuntimeEndpointSchema = zod_default.object({
  name: zod_default.string().regex(WEBDEV_RUNTIME_ENDPOINT_NAME_PATTERN),
  port: zod_default.number().int().min(1024).max(65535)
}).strict();
var WEBDEV_PREVIEW_CONNECT_MAX_LENGTH = 500;
var WEBDEV_PREVIEW_CONNECT_PLACEHOLDER_KINDS = ["host", "url", "url_encoded"];
function webdevPreviewConnectPlaceholders(connect) {
  const placeholders = [];
  let index = 0;
  while (index < connect.length) {
    const char = connect[index];
    if (char === "}") {
      return;
    }
    if (char !== "{") {
      index += 1;
      continue;
    }
    const end = connect.indexOf("}", index + 1);
    if (end === -1) {
      return;
    }
    const body = connect.slice(index + 1, end);
    const separator = body.indexOf(":");
    if (separator === -1) {
      return;
    }
    const kind = body.slice(0, separator);
    const endpoint = body.slice(separator + 1);
    if (!WEBDEV_PREVIEW_CONNECT_PLACEHOLDER_KINDS.includes(kind)) {
      return;
    }
    if (!WEBDEV_RUNTIME_ENDPOINT_NAME_PATTERN.test(endpoint)) {
      return;
    }
    placeholders.push({
      token: connect.slice(index, end + 1),
      kind,
      endpoint
    });
    index = end + 1;
  }
  return placeholders;
}
var webdevPreviewDeviceOpenWithSchema = zod_default.object({
  name: zod_default.string().trim().min(1).max(50),
  ios: zod_default.string().url().startsWith("https://").max(500).optional(),
  android: zod_default.string().url().startsWith("https://").max(500).optional()
}).strict();
var webdevPreviewDeviceSchema = zod_default.object({
  connect: zod_default.string().min(1).max(WEBDEV_PREVIEW_CONNECT_MAX_LENGTH),
  openWith: webdevPreviewDeviceOpenWithSchema.optional()
}).strict();
var webdevPreviewConfigSchema = zod_default.object({
  device: webdevPreviewDeviceSchema
}).strict();
var webdevSelfConfigLenientSchema = zod_default.object({
  version: zod_default.literal(WEBDEV_SELF_CONFIG_VERSION),
  build: webdevBuildConfigSchema.optional(),
  deploy: webdevDeployConfigSchema.optional(),
  features: webdevFeaturesConfigSchema.optional(),
  runtime: zod_default.object({
    port: zod_default.number().int().min(1024).max(65535).optional(),
    endpoints: zod_default.array(webdevRuntimeEndpointSchema).min(1).max(WEBDEV_RUNTIME_ENDPOINTS_MAX).optional(),
    diagnostics: webdevRuntimeDiagnosticsSchema.optional(),
    post_edit: zod_default.object({ mode: zod_default.literal("agent") }).strict().optional()
  }).strict(),
  preview: webdevPreviewConfigSchema.optional(),
  resources: zod_default.object({
    cpu: zod_default.number(),
    memoryMb: zod_default.number().int()
  }).strict().optional(),
  routes: zod_default.array(webdevRouteRuleSchema).min(1).optional(),
  pwa: webdevPwaConfigSchema.optional(),
  hosting: webdevHostingConfigSchema.optional(),
  buildCache: zod_default.boolean().optional(),
  integrations: webdevIntegrationsDeclarationSchema(WEBDEV_INTEGRATIONS).optional(),
  secrets: zod_default.record(zod_default.string().regex(WEBDEV_STORED_SECRET_KEY_PATTERN), secretDeclarationSchema).refine((value) => Object.keys(value).length <= 64, "at most 64 secret keys are allowed").default({})
}).strict().superRefine((value, context) => {
  if (value.runtime.post_edit && value.runtime.diagnostics)
    context.addIssue({ code: zod_default.ZodIssueCode.custom, path: ["runtime", "post_edit"], message: "Agent post-edit mode and legacy diagnostics are mutually exclusive" });
  const diagnostics = value.runtime.diagnostics;
  if (diagnostics) {
    const declaredLanguages = webdevDeclaredDiagnosticsLanguages(diagnostics);
    if (declaredLanguages.length === 0) {
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["runtime", "diagnostics"],
        params: { code: "diagnostics_language_required" },
        message: "runtime.diagnostics requires languages; omit the whole section when the project declares no diagnostics language"
      });
    }
    const declaredServerNames = new Set(Object.keys(diagnostics.servers ?? {}).map((name) => name.trim().toLowerCase()));
    for (const language of declaredLanguages) {
      if (WEBDEV_DIAGNOSTICS_LANGUAGES.includes(language)) {
        continue;
      }
      if (declaredServerNames.has(language)) {
        continue;
      }
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["runtime", "diagnostics"],
        params: { code: "diagnostics_language_unknown" },
        message: `runtime.diagnostics references "${language}", which is neither a built-in language nor declared under ` + `runtime.diagnostics.servers. Built-in: ${WEBDEV_DIAGNOSTICS_LANGUAGES.join(", ")}. To use a language the ` + "platform does not preinstall, install its server yourself and describe it under " + 'runtime.diagnostics.servers (a "probe" snippet that provokes an error is required).'
      });
    }
    for (const name of declaredServerNames) {
      if (WEBDEV_DIAGNOSTICS_LANGUAGES.includes(name) || name in WEBDEV_DIAGNOSTICS_LANGUAGE_ALIASES) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["runtime", "diagnostics", "servers", name],
          params: { code: "diagnostics_server_redefines_builtin" },
          message: `runtime.diagnostics.servers cannot redefine "${name}" — it is already a built-in language ` + "(or an alias of one). Pick a different name, or drop the entry and just declare the language."
        });
      }
    }
    if (declaredServerNames.size > WEBDEV_DIAGNOSTICS_MAX_LANGUAGES) {
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["runtime", "diagnostics", "servers"],
        params: { code: "diagnostics_servers_too_many" },
        message: `runtime.diagnostics.servers declares ${declaredServerNames.size} servers; ` + `at most ${WEBDEV_DIAGNOSTICS_MAX_LANGUAGES} language servers can run in one project`
      });
    }
    if (declaredLanguages.length > WEBDEV_DIAGNOSTICS_MAX_LANGUAGES) {
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["runtime", "diagnostics"],
        params: { code: "diagnostics_languages_too_many" },
        message: `runtime.diagnostics declares ${declaredLanguages.length} languages (${declaredLanguages.join(", ")}); ` + `at most ${WEBDEV_DIAGNOSTICS_MAX_LANGUAGES} language servers can run in one project`
      });
    }
    if (diagnostics.settings) {
      if (Object.keys(diagnostics.settings).length > WEBDEV_DIAGNOSTICS_SETTINGS_MAX_KEYS) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["runtime", "diagnostics", "settings"],
          params: { code: "diagnostics_settings_too_many_keys" },
          message: `runtime.diagnostics.settings allows at most ${WEBDEV_DIAGNOSTICS_SETTINGS_MAX_KEYS} top-level keys`
        });
      }
      const settingsBytes = Buffer.byteLength(JSON.stringify(diagnostics.settings), "utf8");
      if (settingsBytes > WEBDEV_DIAGNOSTICS_SETTINGS_MAX_BYTES) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["runtime", "diagnostics", "settings"],
          params: { code: "diagnostics_settings_too_large" },
          message: `runtime.diagnostics.settings must serialize to at most ${WEBDEV_DIAGNOSTICS_SETTINGS_MAX_BYTES} bytes of JSON; got ${settingsBytes}`
        });
      }
    }
  }
  const serverOn = value.features?.server === true;
  if (value.deploy && !serverOn) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["deploy"],
      params: { code: "needs_server_true" },
      message: 'a deploy contract needs a server; declare "features": { "server": true } first'
    });
  }
  if (value.routes) {
    if (value.routes.length > WEBDEV_ROUTES_MAX_RULES) {
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["routes"],
        params: { code: "routes_too_many" },
        message: `routes declares ${value.routes.length} rules; at most ${WEBDEV_ROUTES_MAX_RULES} are allowed`
      });
    }
    const seenPaths = new Map;
    const wildcardPrefixes = [];
    const boundedRoutes = value.routes.length <= WEBDEV_ROUTES_MAX_RULES ? value.routes : [];
    for (const [index, rule] of boundedRoutes.entries()) {
      if (isReservedWebdevRoutePath(rule.path)) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["routes", index, "path"],
          params: { code: "routes_reserved_path" },
          message: `routes[${index}] "${rule.path}" is at or under a platform-reserved prefix ` + `(${WEBDEV_ROUTE_RESERVED_PREFIXES.join(", ")}); the platform answers these paths itself`
        });
      }
      const duplicateOf = seenPaths.get(rule.path);
      if (duplicateOf !== undefined) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["routes", index, "path"],
          params: { code: "routes_duplicate" },
          message: `routes[${index}] repeats the pattern "${rule.path}" already declared at routes[${duplicateOf}]`
        });
      } else {
        seenPaths.set(rule.path, index);
        const covering = wildcardPrefixes.find(({ prefix }) => rule.path.startsWith(`${prefix}/`));
        if (covering) {
          context.addIssue({
            code: zod_default.ZodIssueCode.custom,
            path: ["routes", index, "path"],
            params: { code: "routes_unreachable" },
            message: `routes[${index}] "${rule.path}" can never match: routes[${covering.index}] ` + `"${covering.prefix}/*" already covers it (first hit wins, in declaration order)`
          });
        }
      }
      if (rule.path.endsWith("/*")) {
        wildcardPrefixes.push({ prefix: rule.path.slice(0, -2), index });
      }
      if (rule.target === "server" && !serverOn) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["routes", index, "target"],
          params: { code: "routes_target_needs_server" },
          message: `routes[${index}] targets the server; declare "features": { "server": true } first`
        });
      }
      if (rule.target === "static" && !value.build) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["routes", index, "target"],
          params: { code: "routes_target_needs_build" },
          message: `routes[${index}] targets static output; declare a "build" section first`
        });
      }
      if (rule.target === "server" && (rule.cache === "immutable" || typeof rule.cache === "number" && rule.cache > WEBDEV_ROUTE_SERVER_CACHE_MAX_SECONDS)) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["routes", index, "cache"],
          params: { code: "routes_server_cache_invalid" },
          message: `routes[${index}] server cache must be "no-cache" or integer seconds from 0 to ${WEBDEV_ROUTE_SERVER_CACHE_MAX_SECONDS}`
        });
      }
      if (rule.spaFallback !== undefined && rule.target !== "static") {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["routes", index, "spaFallback"],
          params: { code: "routes_spa_fallback_needs_static" },
          message: `routes[${index}] declares spaFallback on a "${rule.target}" rule; spaFallback only applies to "static" rules`
        });
      }
    }
  }
  if (value.hosting) {
    validateHostingConfig(value.hosting, context);
  }
  if (value.features?.database === true && !serverOn) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["features", "database"],
      params: { code: "needs_server_true" },
      message: 'a managed database needs a server to connect from; declare "features": { "server": true } first'
    });
  }
  if (value.features?.redis === true && !serverOn) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["features", "redis"],
      params: { code: "needs_server_true" },
      message: "managed Redis requires features.server: true"
    });
  }
  if (value.features?.redis === true) {
    for (const key of ["REDIS_URL", "REDIS_REST_URL", "REDIS_REST_TOKEN", "MANUS_REDIS_GENERATION"]) {
      if (value.secrets[key] !== undefined) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["secrets", key],
          params: { code: "invalid_value" },
          message: "managed Redis owns this environment name; remove the conflicting declaration before enabling Redis"
        });
      }
    }
  }
  if (value.runtime.port !== undefined && WEBDEV_RUNTIME_ENDPOINT_RESERVED_PORTS.includes(value.runtime.port)) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["runtime", "port"],
      params: { code: "endpoint_port_reserved" },
      message: `runtime.port declares platform port ${value.runtime.port} ` + `(reserved: ${WEBDEV_RUNTIME_ENDPOINT_RESERVED_PORTS.join(", ")}); ` + "declare the port your own process listens on"
    });
  }
  const declaredEndpoints = value.runtime.endpoints;
  if (declaredEndpoints) {
    const seenNames = new Set;
    const seenPorts = new Set;
    for (const [index, endpoint] of declaredEndpoints.entries()) {
      if (WEBDEV_RUNTIME_ENDPOINT_RESERVED_NAMES.includes(endpoint.name)) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["runtime", "endpoints", index, "name"],
          params: { code: "endpoint_name_reserved" },
          message: `runtime.endpoints[${index}] uses the reserved name "${endpoint.name}": ` + '"preview" resolves to the stable preview origin without a declaration, and ' + '"primary" resolves directly to runtime.port. Pick another name.'
        });
      }
      if (seenNames.has(endpoint.name)) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["runtime", "endpoints", index, "name"],
          params: { code: "endpoint_name_duplicate" },
          message: `runtime.endpoints[${index}] repeats the name "${endpoint.name}"`
        });
      }
      seenNames.add(endpoint.name);
      if (WEBDEV_RUNTIME_ENDPOINT_RESERVED_PORTS.includes(endpoint.port)) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["runtime", "endpoints", index, "port"],
          params: { code: "endpoint_port_reserved" },
          message: `runtime.endpoints[${index}] declares platform port ${endpoint.port} ` + `(reserved: ${WEBDEV_RUNTIME_ENDPOINT_RESERVED_PORTS.join(", ")}); ` + "declare the port your own process listens on"
        });
      }
      if (seenPorts.has(endpoint.port)) {
        context.addIssue({
          code: zod_default.ZodIssueCode.custom,
          path: ["runtime", "endpoints", index, "port"],
          params: { code: "endpoint_port_duplicate" },
          message: `runtime.endpoints[${index}] repeats port ${endpoint.port}`
        });
      }
      seenPorts.add(endpoint.port);
    }
  }
  if (value.preview) {
    const placeholders = webdevPreviewConnectPlaceholders(value.preview.device.connect);
    if (placeholders === undefined) {
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["preview", "device", "connect"],
        params: { code: "device_connect_template_invalid" },
        message: "preview.device.connect placeholders must look like {host:NAME}, {url:NAME} or " + '{url_encoded:NAME}, and literal "{" / "}" are not allowed outside placeholders'
      });
    } else if (placeholders.length === 0) {
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["preview", "device", "connect"],
        params: { code: "device_connect_placeholder_required" },
        message: "preview.device.connect must reference at least one endpoint placeholder — a " + "literal URL bakes in one sandbox's temporary origin and goes stale on the next " + "sandbox. Use {host:NAME}/{url:NAME}/{url_encoded:NAME} with a runtime.endpoints " + "name, the built-in {url:preview} for the stable preview origin, or the built-in " + "{url:primary} for runtime.port."
      });
    } else {
      const referencable = new Set((value.runtime.endpoints ?? []).map((item) => item.name));
      referencable.add("preview");
      referencable.add("primary");
      for (const placeholder of placeholders) {
        if (!referencable.has(placeholder.endpoint)) {
          context.addIssue({
            code: zod_default.ZodIssueCode.custom,
            path: ["preview", "device", "connect"],
            params: { code: "device_connect_unknown_endpoint" },
            message: `preview.device.connect references "${placeholder.endpoint}", which is neither ` + 'a declared runtime.endpoints name nor the built-in "preview"/"primary"; ' + "declare the endpoint first"
          });
        }
      }
    }
  }
  if (value.resources) {
    if (value.deploy === undefined) {
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["resources"],
        params: { code: "resources_needs_deploy" },
        message: "resources requires a deploy contract; declare deploy first"
      });
    } else if (!webdevContainerResourceTier(value.resources.cpu, value.resources.memoryMb)) {
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["resources"],
        params: { code: "resources_tier_invalid" },
        message: `resources must be one of the supported tiers: ${WEBDEV_CONTAINER_RESOURCE_TIER_LABELS}`
      });
    }
  }
});
var WEBDEV_PHASE1_RETIRED_CONFIG_DOMAINS = [
  "gateway",
  "workers",
  "queues",
  "kv",
  "mobileBuild",
  "storage",
  "email",
  "alerts"
];
var WEBDEV_PHASE1_RETIRED_FEATURE_KEYS = [
  "kv",
  "devDatabase",
  "mobileBuild"
];
function phase1Record(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : undefined;
}
function activeStoredConfig(value) {
  const config = phase1Record(value);
  if (!config)
    return value;
  const next = { ...config };
  const deploy = phase1Record(config.deploy);
  if (deploy) {
    const { port: _port, startCommand: _command, ...activeDeploy } = deploy;
    next.deploy = activeDeploy;
  }
  const runtime = phase1Record(config.runtime);
  const diagnostics = phase1Record(runtime?.diagnostics);
  if (runtime && diagnostics) {
    const { language, ...activeDiagnostics } = diagnostics;
    if (language !== undefined && (diagnostics.languages === undefined || Array.isArray(diagnostics.languages))) {
      const languages = [language, ...diagnostics.languages ?? []];
      activeDiagnostics.languages = languages.every((value2) => typeof value2 === "string") ? webdevDeclaredDiagnosticsLanguages({ languages }) : languages;
    }
    const servers = phase1Record(diagnostics.servers);
    if (servers)
      activeDiagnostics.servers = Object.fromEntries(Object.entries(servers).map(([name, value2]) => {
        const spec = phase1Record(value2);
        if (!spec)
          return [name, value2];
        const { settings: _unusedSettings, ...activeSpec } = spec;
        return [name, activeSpec];
      }));
    next.runtime = { ...runtime, diagnostics: activeDiagnostics };
  }
  return next;
}
function phase1StoredConfigProjection(value) {
  const record = phase1Record(activeStoredConfig(value));
  if (!record)
    return value;
  const projected = { ...record };
  for (const domain of WEBDEV_PHASE1_RETIRED_CONFIG_DOMAINS) {
    delete projected[domain];
  }
  const deploy = phase1Record(record.deploy);
  if (deploy) {
    const { port: _retiredPort, ...currentDeploy } = deploy;
    projected.deploy = currentDeploy;
  }
  const features = phase1Record(record.features);
  if (features) {
    const projectedFeatures = { ...features };
    for (const key of WEBDEV_PHASE1_RETIRED_FEATURE_KEYS) {
      delete projectedFeatures[key];
    }
    projected.features = projectedFeatures;
  }
  if (Array.isArray(record.routes) && record.routes.some((route) => {
    const rule = phase1Record(route);
    return !rule || rule.redirect !== undefined || rule.headers !== undefined || rule.target !== "static" && rule.target !== "server";
  })) {
    delete projected.routes;
  }
  return projected;
}
var webdevSelfConfigShapeSchema = zod_default.custom((value) => webdevSelfConfigLenientSchema.safeParse(phase1StoredConfigProjection(value)).success, { message: "stored Webdev configuration has an invalid Phase-1 shape" });
var webdevSelfConfigSchema = webdevSelfConfigLenientSchema.superRefine((value, context) => {
  for (const key of Object.keys(value.secrets)) {
    if (!secretKeyPattern.test(key)) {
      context.addIssue({ code: zod_default.ZodIssueCode.invalid_string, validation: "regex", path: ["secrets", key] });
    }
  }
  for (const [index, endpoint] of (value.runtime.endpoints ?? []).entries()) {
    if (endpoint.port === value.runtime.port) {
      context.addIssue({
        code: zod_default.ZodIssueCode.custom,
        path: ["runtime", "endpoints", index, "port"],
        params: { code: "endpoint_port_conflicts_runtime" },
        message: `runtime.endpoints[${index}] repeats runtime.port ${endpoint.port}: the main ` + "port already has the built-in {url:primary}; declare only extra ports here"
      });
    }
  }
  if (value.build && value.build.outputDirectory !== "." && !isCanonicalRepoRelativePath(value.build.outputDirectory)) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["build", "outputDirectory"],
      params: { code: "build_output_directory_not_canonical" },
      message: 'static publish serves a canonical repository-relative directory (no "./", "//" or ' + 'trailing "/"). Declare the directory in its canonical spelling, e.g. "dist" instead ' + 'of "./dist/". For a site with no build step, move the static files into a ' + "subdirectory such as public/ and declare that directory."
    });
  }
  if (value.deploy && !isCanonicalRepoRelativePath(value.deploy.dockerfilePath)) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["deploy", "dockerfilePath"],
      params: { code: "deploy_dockerfile_path_not_canonical" },
      message: 'dockerfilePath must be a canonical repository-relative file path (no ".", "./", "//" or ' + 'trailing "/"); it is rejected at publish otherwise. The default is "Dockerfile" at the ' + "repository root."
    });
  }
  if (value.hosting !== undefined && value.hosting.mode === undefined) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["hosting", "mode"],
      params: { code: "required" },
      message: "hosting.mode is required whenever the hosting domain is declared; to leave or " + 'return to the default, write "mode": "on_demand" explicitly'
    });
  }
  if (value.buildCache !== undefined && value.deploy === undefined) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["buildCache"],
      params: { code: "build_cache_needs_container" },
      message: "buildCache controls the container image build cache, and a static host build has " + "no cache layer to disable; declare it only alongside a deploy contract, or drop " + "the key"
    });
  }
  if (resolveWebdevFeatures(value.features).database && value.secrets.DATABASE_URL !== undefined) {
    context.addIssue({
      code: zod_default.ZodIssueCode.custom,
      path: ["secrets", "DATABASE_URL"],
      params: { code: "database_url_reserved" },
      message: WEBDEV_DATABASE_URL_RESERVED_GUIDANCE
    });
  }
});
var MOBILE_EXPO_WEBDEV_SELF_CONFIG = webdevSelfConfigSchema.parse({
  version: 1,
  features: { server: true, database: true },
  runtime: {
    port: 8081,
    endpoints: [{ name: "api", port: 3000 }]
  },
  preview: {
    device: {
      connect: "exps://{host:primary}",
      openWith: {
        name: "Expo Go",
        ios: "https://apps.apple.com/app/id982107779",
        android: "https://play.google.com/store/apps/details?id=host.exp.exponent"
      }
    }
  },
  secrets: {}
});
var WEBDEV_STRIPE_FIXED_KEY_GUIDANCE = `${WEBDEV_STRIPE_FIXED_SECRET_KEYS.join(", ")} are provisioned by the Stripe ` + "integration. Do not write these keys or their values yourself: remove them from " + '"secrets", declare "integrations": ["stripe"], and save — the platform adds the fixed ' + "declarations after the owner confirms the card.";
var WEBDEV_DATABASE_URL_RESERVED_GUIDANCE = "DATABASE_URL is injected by the managed database and cannot also be a declared secret. " + 'To bring your own database, store "features": {"server": true, "database": false} first ' + "then declare the DATABASE_URL secret. To use the managed database, " + "drop the DATABASE_URL declaration instead.";

// shared/webProjectFeatures.ts
var requestsServerDependency = (features) => features?.database === true || features?.redis === true;
function selectWebProjectFeatures(requested, previous) {
  const before = resolveWebdevFeatures(previous);
  return {
    server: requested?.server ?? (requestsServerDependency(requested) ? true : before.server),
    database: requested?.database ?? before.database,
    ...(requested?.redis ?? before.redis) !== undefined ? { redis: requested?.redis ?? before.redis } : {}
  };
}

// shared/webDbUserStarter.ts
function webDbUserSelectedFeatures(features) {
  return selectWebProjectFeatures(features);
}
function webDbUserInitialConfig(features) {
  const selected = webDbUserSelectedFeatures(features);
  return webdevSelfConfigSchema.parse({
    version: 1,
    features: selected,
    runtime: { port: 3000 },
    ...selected.server ? { deploy: { dockerfilePath: "Dockerfile", healthPath: "/api/health" } } : { build: { command: "npx --yes pnpm@10.18.0 install --frozen-lockfile && npx --yes pnpm@10.18.0 build:static", outputDirectory: "dist/public" } },
    secrets: {}
  });
}
var WEB_DB_USER_INITIAL_CONFIG = webDbUserInitialConfig();

// mcp/init/mobileExpoStarter.ts
import fs from "node:fs/promises";

// shared/game-cloud-computer-overview.ts
var nonnegative = exports_external.number().finite().nonnegative();
var timestamp = exports_external.string().datetime({ offset: true });
var sample = exports_external.object({ at: timestamp, value: nonnegative });
var capacity = exports_external.object({ usedBytes: nonnegative, totalBytes: nonnegative.positive() }).refine((value) => value.usedBytes <= value.totalBytes);
var gameCloudComputerOverviewSchema = exports_external.object({
  pcId: exports_external.string().regex(/^[A-Za-z0-9_-]{1,128}$/),
  retrievedAt: timestamp,
  cpuUtilization: nonnegative.max(1).nullable(),
  memory: capacity.nullable(),
  storage: capacity.nullable(),
  networkInBytesPerSecond: nonnegative.nullable(),
  networkOutBytesPerSecond: nonnegative.nullable(),
  history: exports_external.object({
    cpu: exports_external.array(sample.extend({ value: nonnegative.max(1) })).max(240),
    memory: exports_external.array(sample).max(240),
    inbound: exports_external.array(sample).max(240),
    outbound: exports_external.array(sample).max(240)
  }),
  outbound: exports_external.object({
    usedGb: nonnegative,
    includedGb: nonnegative,
    overageGb: nonnegative,
    overageCostUsd: nonnegative,
    costUpdatedAt: timestamp.nullable(),
    periodStart: timestamp.nullable(),
    periodEnd: timestamp.nullable()
  }).nullable()
});
// shared/webdev-public-error-contract.ts
var WEBDEV_PUBLIC_ERROR_SCHEMA = "manus.webdev.error/v1";
var WEBDEV_PUBLIC_ERROR_CANONICAL_CONTRACT = {
  unauthenticated: {
    messages: { default: "authentication required" },
    retryable: false
  },
  reauthorization_required: {
    messages: { default: "host authorization expired" },
    retryable: true,
    recoveryAction: "reauthorize"
  },
  permission_denied: {
    messages: { default: "request is not allowed" },
    retryable: false
  },
  resource_not_found: {
    messages: { default: "resource not found" },
    retryable: false
  },
  validation_failed: {
    messages: { default: "request validation failed" },
    retryable: false
  },
  revision_conflict: {
    messages: {
      default: "resource revision conflict",
      database_row_revision_conflict: "database row revision conflict"
    },
    retryable: false,
    recoveryAction: "reread_view"
  },
  database_record_conflict: {
    messages: {
      default: "the record conflicts with an existing row: a unique or primary key value is already taken. Change the conflicting value, or update the existing row instead"
    },
    retryable: false
  },
  publish_contract_missing: {
    messages: {
      default: "this project has no complete publish contract yet — declare a `build` domain (static project) or a `deploy` domain (server project; add `build` too for a hybrid publish) through the Webdev config API, then publish again"
    },
    retryable: false
  },
  required_secret_missing: {
    messages: {
      default: "required secrets have no production or common values; configure them in Secrets before publishing"
    },
    retryable: false
  },
  idempotency_conflict: {
    messages: {
      default: "idempotency key was reused with different input"
    },
    retryable: false
  },
  attachment_required: {
    messages: { default: "an attached session is required" },
    retryable: false
  },
  binding_replaced: {
    messages: { default: "runtime binding was replaced" },
    retryable: false,
    recoveryAction: "resolve_binding"
  },
  not_attached: {
    messages: { default: "no runtime binding is attached for this session" },
    retryable: false
  },
  runtime_not_ready: {
    messages: { default: "project runtime is not ready yet" },
    retryable: true,
    recoveryAction: "retry"
  },
  project_init_failed: {
    messages: { default: "project initialization failed" },
    retryable: false
  },
  resource_session_conflict: {
    messages: {
      default: "session is already attached to another Webdev resource",
      project_deleted: "the Webdev project bound to this session was deleted"
    },
    retryable: false
  },
  git_state_conflict: {
    messages: {
      default: "Git checkpoint state conflicts with current main"
    },
    retryable: false
  },
  publish_confirmation_required: {
    messages: {
      default: "confirm publishing the current main commit without an existing checkpoint"
    },
    retryable: false
  },
  publish_unavailable: {
    messages: {
      default: "publish source unavailable: this project has no usable Addon-owned Git repository"
    },
    retryable: false
  },
  local_first_mobile_unsupported: {
    messages: {
      default: "Local First v1 supports web projects only; create Mobile Dev in Cloud"
    },
    retryable: false
  },
  github_connector_required: {
    messages: { default: "connect GitHub and try again" },
    retryable: false
  },
  github_installation_required: {
    messages: { default: "install or extend the Manus GitHub App and try again" },
    retryable: false
  },
  github_repository_forbidden: {
    messages: { default: "the selected GitHub repository cannot be administered" },
    retryable: false
  },
  github_repository_conflict: {
    messages: { default: "the GitHub repository name is already in use" },
    retryable: false
  },
  github_repository_not_empty: {
    messages: { default: "the selected repository cannot accept this project history" },
    retryable: false
  },
  unrelated_history: {
    messages: { default: "the repositories do not share history" },
    retryable: false
  },
  history_diverged: {
    messages: { default: "the repositories have diverged and cannot be switched safely" },
    retryable: false
  },
  unsupported_branch: {
    messages: { default: "GitHub canonical repositories must use main" },
    retryable: false
  },
  github_repository_detached: {
    messages: { default: "the linked GitHub repository identity changed" },
    retryable: false,
    recoveryAction: "resolve_binding"
  },
  github_unauthorized: {
    messages: { default: "GitHub App access is no longer available" },
    retryable: false,
    recoveryAction: "reauthorize"
  },
  github_unreachable: {
    messages: { default: "GitHub is temporarily unavailable" },
    retryable: true,
    recoveryAction: "retry"
  },
  canonical_changed: {
    messages: { default: "canonical Git changed; refresh and try again" },
    retryable: false,
    recoveryAction: "reread_view"
  },
  checkpoint_restore_required: {
    messages: {
      default: "the latest project checkpoint must be restored to Manus before disconnecting GitHub"
    },
    retryable: false
  },
  filesystem_rebind_required: {
    messages: {
      default: "filesystem binding must be initialized again"
    },
    retryable: false,
    recoveryAction: "resolve_binding"
  },
  self_config_not_managed: {
    messages: { default: "self-config is not managed for this project" },
    retryable: false
  },
  config_revision_required: {
    messages: {
      default: "no self-config revision has been applied yet"
    },
    retryable: false
  },
  secret_input_pending: {
    messages: {
      default: "a secure value input card is open and must be settled first"
    },
    retryable: false
  },
  secret_value_already_set: {
    messages: {
      default: "the secret already holds a value; replacing it needs a new declaration"
    },
    retryable: false
  },
  cursor_expired: {
    messages: { default: "event cursor expired" },
    retryable: false,
    recoveryAction: "resubscribe"
  },
  lease_expired: {
    messages: { default: "lease expired" },
    retryable: false
  },
  owner_unavailable: {
    messages: { default: "upstream service unavailable" },
    retryable: true,
    recoveryAction: "retry"
  },
  rate_limited: {
    messages: { default: "request rate limited" },
    retryable: true,
    recoveryAction: "retry"
  },
  internal_error: {
    messages: { default: "internal service error" },
    retryable: true,
    recoveryAction: "retry"
  }
};
var WEBDEV_PUBLIC_ERROR_CONSUMER_TUPLES = Object.fromEntries(Object.entries(WEBDEV_PUBLIC_ERROR_CANONICAL_CONTRACT).map(([code, contract]) => [
  code,
  {
    messages: Object.values(contract.messages),
    retryable: contract.retryable,
    ..."recoveryAction" in contract ? {
      recoveryAction: contract.recoveryAction
    } : {}
  }
]));

// shared/webdev-s01-idl.ts
var READ_ACTORS = ["web", "node", "runtime"];
var MUTATION_ACTORS = ["web", "node", "runtime"];
var WEBDEV_S01_APP_PREVIEW_PERMISSIONS = ["public", "team_only", "owner_only"];
var WEBDEV_S01_ANALYTICS_DIMENSIONS = [
  "referrer",
  "country",
  "region",
  "browser",
  "os",
  "device",
  "event",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term"
];
var WEBDEV_S01_ANALYTICS_UNAVAILABLE_REASONS = [
  "not_configured",
  "provider_unavailable",
  "provider_unsupported",
  "result_too_large",
  "filters_unsupported"
];
var WEBDEV_S01_DATABASE_ORDER_FIELD_MAX_LENGTH = 64;
var WEBDEV_S01_DATABASE_ORDER_FIELD_PATTERN = `^[A-Za-z0-9_]{1,${WEBDEV_S01_DATABASE_ORDER_FIELD_MAX_LENGTH}}$`;
var WEBDEV_S01_DATABASE_COLUMN_TYPES = [
  "unknown",
  "string",
  "integer",
  "number",
  "boolean",
  "datetime",
  "json",
  "binary"
];
var WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS = 8640000000000000;
var WEBDEV_S01_ANALYTICS_FILTER_VALUE_PATTERN = "^.{1,1024}$";
var field = (type, options = {}) => ({ type, ...options });
var result = (schema, fields) => ({
  schema,
  fields: {
    schema: field("literal", { required: true, values: [schema] }),
    ...fields
  }
});
var websiteIdentityFields = {
  userId: field("string", { required: true, sensitive: true }),
  email: field("string", { required: true, sensitive: true }),
  name: field("string", { required: true, sensitive: true }),
  avatar: field("string", { required: true, sensitive: true })
};
var websiteAccessFields = {
  visibility: field("enum", { required: true, values: ["public", "owner", "team_only"] }),
  teamVisibility: field("enum", { required: true, values: ["visible", "invisible"] }),
  maxTeamAssetPermission: field("enum", { required: true, values: ["public", "team_only", "owner_only"] }),
  owner: field("object", { required: true, sensitive: true, itemFields: websiteIdentityFields }),
  team: field("object", { sensitive: true, itemFields: { name: field("string", { required: true }), avatar: field("string", { required: true }) } }),
  members: field("object[]", { required: true, sensitive: true, itemFields: {
    memberKey: field("string", { required: true }),
    email: websiteIdentityFields.email,
    userId: field("string"),
    name: field("string"),
    avatar: field("string"),
    memberType: field("enum", { required: true, values: ["personal", "team"] }),
    siteTeamMember: field("boolean", { required: true }),
    status: field("enum", { required: true, values: ["normal", "frozen"] }),
    pending: field("boolean", { required: true }),
    canRemove: field("boolean", { required: true })
  } }),
  teamLoginNoticeDismissed: field("boolean"),
  canSelectTeamVisibility: field("boolean"),
  ...Object.fromEntries(["canManage", "canInvite", "canSetPublic", "canToggleTeam", "canInviteExternal", "isPublished", "enableSeo", "seoActive", "actorIsTeamAccount"].map((name) => [name, field("boolean", { required: true })]))
};
var WEBDEV_S01_SCHEDULE_STATUSES = [
  "enabled",
  "paused",
  "disabled"
];
var WEBDEV_S01_SCHEDULE_RUN_STATUSES = [
  "unspecified",
  "running",
  "success",
  "failed",
  "timeout",
  "skipped"
];
var WEBDEV_S01_SCHEDULE_SUMMARY_FIELDS = {
  uid: field("non_empty_string", { required: true }),
  name: field("string", { required: true }),
  description: field("string", { required: true }),
  cronExpression: field("string", { required: true }),
  endpointPath: field("string", { required: true }),
  status: field("enum", {
    required: true,
    values: WEBDEV_S01_SCHEDULE_STATUSES
  }),
  lastRunStatus: field("enum", {
    required: true,
    values: WEBDEV_S01_SCHEDULE_RUN_STATUSES
  }),
  nextRunAt: field("safe_integer", { minimum: 0 }),
  expireAt: field("safe_integer", { minimum: 0 }),
  totalRunCount: field("safe_integer", { required: true, minimum: 0 }),
  successRunCount: field("safe_integer", { required: true, minimum: 0 }),
  failedRunCount: field("safe_integer", { required: true, minimum: 0 }),
  createdBy: field("string", { required: true })
};
var WEBDEV_S01_SCHEDULE_RUN_FIELDS = {
  uid: field("non_empty_string", { required: true }),
  status: field("enum", {
    required: true,
    values: WEBDEV_S01_SCHEDULE_RUN_STATUSES
  }),
  httpStatus: field("safe_integer", { required: true, minimum: 0 }),
  scheduledAt: field("safe_integer", { minimum: 0 }),
  startedAt: field("safe_integer", { minimum: 0 }),
  createdAt: field("safe_integer", { minimum: 0 }),
  durationMs: field("safe_integer", { required: true, minimum: 0 }),
  response: field("string", { required: true })
};
var WEBDEV_S01_CUSTOM_DOMAIN_STATUSES = [
  "pending",
  "verified",
  "active",
  "failed",
  "unknown"
];
var WEBDEV_S01_DOMAIN_SOURCES = [
  "custom",
  "purchased",
  "unknown"
];
var WEBDEV_S01_PURCHASED_DOMAIN_STATUSES = [
  "deployed",
  "expired",
  "available",
  "register_failed",
  "transferred_out",
  "registering",
  "unspecified"
];
var WEBDEV_S01_DOMAIN_RENEWAL_STAGES = [
  "expiring",
  "grace",
  "redemption",
  "released"
];
var WEBDEV_S01_DOMAIN_RENEWAL_PROGRESSES = [
  "processing",
  "failed"
];
var WEBDEV_S01_PROCESSING_DOMAIN_PURCHASE_TYPES = [
  "registration",
  "renewal"
];
var WEBDEV_S01_SUBDOMAIN_AUDIT_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "occupied_during_restore"
];
var WEBDEV_S01_CUSTOM_DOMAIN_FIELDS = {
  domain: field("non_empty_string", { required: true }),
  status: field("enum", {
    required: true,
    values: WEBDEV_S01_CUSTOM_DOMAIN_STATUSES
  }),
  source: field("enum", { required: true, values: WEBDEV_S01_DOMAIN_SOURCES }),
  purchaseStatus: field("enum", {
    required: true,
    values: WEBDEV_S01_PURCHASED_DOMAIN_STATUSES
  }),
  createdAt: field("safe_integer", { minimum: 0 }),
  expirationTime: field("safe_integer", { minimum: 0 }),
  parentDomain: field("string"),
  reason: field("string"),
  renewalStage: field("enum", { values: WEBDEV_S01_DOMAIN_RENEWAL_STAGES }),
  renewalDeadline: field("safe_integer", { minimum: 0 }),
  renewalProgress: field("enum", { values: WEBDEV_S01_DOMAIN_RENEWAL_PROGRESSES })
};
var WEBDEV_S01_PURCHASED_DOMAIN_FIELDS = {
  domainName: field("non_empty_string", { required: true }),
  status: field("enum", {
    required: true,
    values: WEBDEV_S01_PURCHASED_DOMAIN_STATUSES
  }),
  expirationTime: field("safe_integer", { minimum: 0 }),
  projectTitle: field("string"),
  projectUid: field("string"),
  connectedSessionUid: field("string"),
  connectedSessionTitle: field("string"),
  connectedSessionLink: field("string")
};
var WEBDEV_S01_DOMAIN_NAME_PATTERN = "^\\S{1,253}$";
var analyticsFilterArgumentFields = {
  url: field("string", { pattern: WEBDEV_S01_ANALYTICS_FILTER_VALUE_PATTERN }),
  referrer: field("string", { pattern: WEBDEV_S01_ANALYTICS_FILTER_VALUE_PATTERN }),
  country: field("string", { pattern: WEBDEV_S01_ANALYTICS_FILTER_VALUE_PATTERN }),
  device: field("string", { pattern: WEBDEV_S01_ANALYTICS_FILTER_VALUE_PATTERN }),
  os: field("string", { pattern: WEBDEV_S01_ANALYTICS_FILTER_VALUE_PATTERN }),
  browser: field("string", { pattern: WEBDEV_S01_ANALYTICS_FILTER_VALUE_PATTERN })
};
var WEBDEV_S01_DATABASE_DECIMAL_SIZE_FIELDS = {
  precision: field("safe_integer", { required: true, minimum: 0 }),
  scale: field("safe_integer", { required: true, minimum: 0 })
};
var WEBDEV_S01_DATABASE_COLUMN_FIELDS = {
  name: field("string", { required: true }),
  type: field("string", { required: true }),
  nullable: field("boolean", { required: true }),
  databaseTypeName: field("string", { required: true }),
  columnType: field("string"),
  primaryKey: field("boolean"),
  autoIncrement: field("boolean"),
  length: field("safe_integer", { minimum: 0 }),
  decimalSize: field("object", {
    itemFields: WEBDEV_S01_DATABASE_DECIMAL_SIZE_FIELDS
  }),
  required: field("boolean"),
  unique: field("boolean"),
  comment: field("string"),
  defaultValue: field("string"),
  columnTypeEnum: field("enum", {
    required: true,
    values: WEBDEV_S01_DATABASE_COLUMN_TYPES
  })
};
var WEBDEV_S01_DATABASE_TABLE_FIELDS = {
  name: field("string", { required: true }),
  columns: field("database_column_schema[]", {
    required: true,
    itemFields: WEBDEV_S01_DATABASE_COLUMN_FIELDS
  }),
  rowEstimate: field("safe_integer", { required: true, minimum: 0 })
};
var WEBDEV_S01_EXPO_PACK_TYPES = ["apk", "aab", "ipa"];
var WEBDEV_S01_EXPO_BUILD_STATUSES = [
  "pending",
  "building",
  "signing",
  "completed",
  "failed",
  "waiting_2fa_type",
  "waiting_2fa_code",
  "publishing",
  "published",
  "waiting_apple_credentials",
  "canceled",
  "waiting_team",
  "unspecified"
];
var WEBDEV_S01_EXPO_IOS_INPUT_TYPES = [
  "twofa_type",
  "twofa_code",
  "apple_id",
  "password",
  "team"
];
var WEBDEV_S01_EXPO_BUILD_FIELDS = {
  versionName: field("non_empty_string", { required: true }),
  versionId: field("string", { required: true }),
  buildId: field("non_empty_string", { required: true }),
  packType: field("enum", {
    required: true,
    values: WEBDEV_S01_EXPO_PACK_TYPES
  }),
  status: field("enum", {
    required: true,
    values: WEBDEV_S01_EXPO_BUILD_STATUSES
  }),
  progress: field("safe_integer", { required: true, minimum: 0, maximum: 100 }),
  createdAt: field("string", { required: true }),
  isFirst: field("boolean")
};
var GAME_OVERVIEW_SAMPLE_FIELDS = { at: field("rfc3339", { required: true }), value: field("number", { required: true, minimum: 0 }) };
var GAME_OVERVIEW_USAGE_FIELDS = { usedBytes: field("number", { required: true, minimum: 0 }), totalBytes: field("number", { required: true, minimum: 1 }) };
var GAME_OVERVIEW_FIELDS = {
  pcId: field("non_empty_string", { required: true }),
  retrievedAt: field("rfc3339", { required: true }),
  cpuUtilization: field("number|null", { required: true, minimum: 0, maximum: 1 }),
  memory: field("object|null", { required: true, itemFields: GAME_OVERVIEW_USAGE_FIELDS }),
  storage: field("object|null", { required: true, itemFields: GAME_OVERVIEW_USAGE_FIELDS }),
  networkInBytesPerSecond: field("number|null", { required: true, minimum: 0 }),
  networkOutBytesPerSecond: field("number|null", { required: true, minimum: 0 }),
  history: field("object", { required: true, itemFields: Object.fromEntries(["cpu", "memory", "inbound", "outbound"].map((key) => [key, field("object[]", { required: true, maxItems: 240, itemFields: GAME_OVERVIEW_SAMPLE_FIELDS })])) }),
  outbound: field("object|null", { required: true, itemFields: {
    usedGb: field("number", { required: true, minimum: 0 }),
    includedGb: field("number", { required: true, minimum: 0 }),
    overageGb: field("number", { required: true, minimum: 0 }),
    overageCostUsd: field("number", { required: true, minimum: 0 }),
    costUpdatedAt: field("rfc3339|null", { required: true }),
    periodStart: field("rfc3339|null", { required: true }),
    periodEnd: field("rfc3339|null", { required: true })
  } })
};
var GAME_MULTIPLAYER_SELECTION_FIELDS = {
  pcId: field("string|null", { required: true }),
  revision: field("safe_integer", { required: true, minimum: 0 })
};
var GAME_MULTIPLAYER_SERVER_FIELDS = {
  pcId: field("non_empty_string", { required: true }),
  name: field("non_empty_string", { required: true }),
  region: field("non_empty_string", { required: true }),
  plan: field("non_empty_string", { required: true }),
  status: field("enum", { required: true, values: ["ready", "starting", "offline", "stopped", "upgrading", "expired", "failed", "unavailable"] })
};
var WEBDEV_S01_IDL = {
  schema: "manus.webdev.typed_contract_idl/v1",
  requestSchemas: {
    query: "manus.webdev.query_request/v1",
    action: "manus.webdev.action_request/v1"
  },
  policy: {
    source: "biz.H0.ResolveWebdevProject",
    roles: ["owner", "admin", "editor", "viewer"],
    actors: ["web", "node", "runtime", "share"],
    hostPolicySchema: "manus.addon.widget_host_policy/v1",
    ownerSubOverride: false
  },
  catalog: {
    views: {
      website_access: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: ["web"],
        result: result("manus.webdev.view.website_access/v1", { access: field("object", { required: true, sensitive: true, itemFields: websiteAccessFields }) })
      },
      project_overview: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.view.project_overview/v1", {
          title: field("string", { required: true }),
          name: field("string", { required: true }),
          description: field("string", { required: true }),
          logoUrl: field("string", { required: true }),
          visibility: field("string", { required: true }),
          applicationKind: field("enum", {
            required: true,
            values: ["static_web", "fullstack_web", "mobile_app", "game"]
          }),
          features: field("project_features", { required: true }),
          deployment: field("deployment_summary", { required: true }),
          domains: field("domain_summary[]", { required: true }),
          domainRenewalAttention: field("boolean"),
          analyticsEnabled: field("boolean", { required: true }),
          analyticsFiltersSupported: field("boolean"),
          enableSeo: field("boolean"),
          hostingMode: field("enum", { values: ["on_demand", "always_on"] }),
          hostingModeRedeployError: field("boolean"),
          hideManusBadge: field("boolean"),
          platformAnalyticsEnabled: field("boolean"),
          mobilePreviewAccess: field("object", { itemFields: {
            permission: field("enum", { required: true, values: WEBDEV_S01_APP_PREVIEW_PERMISSIONS }),
            allowedPermissions: field("string[]", { required: true, maxItems: 3, values: WEBDEV_S01_APP_PREVIEW_PERMISSIONS })
          } }),
          spaceId: field("string")
        })
      },
      mobile_builds: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: ["web"],
        result: result("manus.webdev.view.mobile_builds/v1", {
          projectTitle: field("string", { required: true }),
          latestVersionId: field("string"),
          builds: field("expo_build[]", {
            required: true,
            itemFields: WEBDEV_S01_EXPO_BUILD_FIELDS
          })
        })
      },
      database_schema: {
        scope: "webdev.database.read",
        minRole: "editor",
        actors: READ_ACTORS,
        result: result("manus.webdev.view.database_schema/v1", {
          available: field("boolean", { required: true }),
          tables: field("database_table_schema[]", {
            required: true,
            itemFields: WEBDEV_S01_DATABASE_TABLE_FIELDS
          })
        })
      },
      database_connection: {
        scope: "webdev.database.read",
        minRole: "owner",
        actors: ["web"],
        result: result("manus.webdev.view.database_connection/v1", {
          connectionUrl: field("string", { required: true }),
          serverHost: field("string", { required: true }),
          port: field("string", { required: true }),
          username: field("string", { required: true }),
          password: field("string", { required: true })
        })
      },
      settings_general: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.view.settings_general/v1", {
          title: field("string", { required: true }),
          name: field("string", { required: true }),
          description: field("string", { required: true }),
          logoUrl: field("string", { required: true }),
          visibility: field("string", { required: true })
        })
      },
      settings_notifications: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.view.settings_notifications/v1", {
          enableEmail: field("boolean", { required: true }),
          enableInApp: field("boolean", { required: true }),
          enablePush: field("boolean", { required: true }),
          revision: field("opaque_revision", { required: true })
        })
      },
      settings_seo: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.view.settings_seo/v1", {
          enableSeo: field("boolean", { required: true }),
          indexed: field("boolean", { required: true }),
          routes: field("string[]", { required: true }),
          visibility: field("string", { required: true }),
          deployment: field("deployment_summary", { required: true }),
          domains: field("domain_summary[]", { required: true })
        })
      },
      current_user: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: ["web"],
        result: result("manus.webdev.view.current_user/v1", {
          userType: field("safe_integer", { required: true })
        })
      },
      publish_settings: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.view.publish_settings/v1", {
          currentUser: field("object", { itemFields: { area: field("safe_integer", { required: true }), userType: field("safe_integer", { required: true }) } }),
          usageStatus: field("enum", { values: ["unknown", "enable_auto_topup", "adjust_spending_limit", "unavailable"] }),
          agentPublishApproval: field("enum", { values: ["ask", "always_allow"] }),
          autoPublish: field("boolean", { required: true }),
          autoPublishDefault: field("boolean"),
          teamLoginNoticeDismissed: field("boolean"),
          canSelectTeamVisibility: field("boolean"),
          visibility: field("string", { required: true }),
          maxTeamAssetPermission: field("enum", {
            required: true,
            values: ["public", "team_only", "owner_only"]
          }),
          checkpointCount: field("safe_integer", { required: true, minimum: 0 })
        })
      },
      deploy_status: {
        scope: "webdev.deploy",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.view.deploy_status/v1", {
          status: field("string", { required: true }),
          published: field("boolean", { required: true }),
          unavailableReason: field("enum", {
            values: ["publish_migration_pending"]
          }),
          publishedUrl: field("string"),
          revision: field("string"),
          publishedVersionId: field("string"),
          diagnostic: field("string", { pattern: "^[\\s\\S]{1,4096}$" }),
          message: field("string")
        })
      }
    },
    queries: {
      website_invitees: {
        scope: "webdev.project.write",
        minRole: "editor",
        actors: ["web"],
        arguments: { email: field("string", { required: true, sensitive: true, pattern: "^.{1,254}$" }) },
        result: result("manus.webdev.query.website_invitees/v1", {
          candidates: field("object[]", { required: true, sensitive: true, itemFields: {
            ...websiteIdentityFields,
            memberType: field("enum", { required: true, values: ["personal", "team"] }),
            teamName: field("string")
          } }),
          canInviteEmail: field("boolean", { required: true })
        })
      },
      project_copies: {
        scope: "webdev.project.read",
        minRole: "owner",
        actors: ["web"],
        arguments: { cursor: field("string", { pattern: "^wdo_[a-f0-9]{24}$" }) },
        result: result("manus.webdev.query.project_copies/v1", {
          copies: field("object[]", { required: true, itemFields: {
            operationId: field("string", { required: true }),
            resourceId: field("string", { required: true }),
            resourceUri: field("string", { required: true }),
            title: field("string", { required: true }),
            createdAt: field("string", { required: true })
          } }),
          nextCursor: field("string")
        })
      },
      project_copy: {
        scope: "webdev.project.read",
        minRole: "owner",
        actors: ["web"],
        arguments: { operationId: field("non_empty_string", { required: true }) },
        result: result("manus.webdev.query.project_copy/v1", {
          operationId: field("string", { required: true }),
          resourceId: field("string", { required: true }),
          resourceUri: field("string", { required: true }),
          status: field("enum", { required: true, values: ["queued", "running", "succeeded", "failed", "cancelled"] }),
          phase: field("string", { required: true }),
          warnings: field("string[]", { required: true }),
          failureCode: field("string")
        })
      },
      database_rows: {
        scope: "webdev.database.read",
        minRole: "editor",
        actors: READ_ACTORS,
        arguments: {
          table: field("table_name", {
            required: true,
            pattern: "^[A-Za-z0-9_]{1,64}$"
          }),
          page: field("safe_integer", { minimum: 1, maximum: 1e5 }),
          pageSize: field("safe_integer", { minimum: 1, maximum: 100 }),
          order: field("object", {
            itemFields: {
              field: field("string", {
                required: true,
                pattern: WEBDEV_S01_DATABASE_ORDER_FIELD_PATTERN
              }),
              direction: field("enum", {
                required: true,
                values: ["ASC", "DESC"]
              })
            }
          })
        },
        result: result("manus.webdev.query.database_rows/v1", {
          columns: field("string[]", { required: true }),
          rows: field("json_object[]", { required: true }),
          rowRevisions: field("opaque_revision[]", { required: true }),
          totalRows: field("safe_integer", { required: true, minimum: 0 }),
          page: field("safe_integer", { required: true, minimum: 1 }),
          pageSize: field("safe_integer", { required: true, minimum: 1 })
        })
      },
      analytics_summary: {
        scope: "webdev.analytics.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          rangeDays: field("safe_integer", { minimum: 1, maximum: 90 }),
          startAt: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          endAt: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          timezone: field("string", { pattern: "^[A-Za-z][A-Za-z0-9_+/-]{0,63}$" }),
          ...analyticsFilterArgumentFields
        },
        result: result("manus.webdev.query.analytics_summary/v1", {
          available: field("boolean", { required: true }),
          pageviews: field("number", { required: true }),
          visitors: field("number", { required: true }),
          rangeDays: field("number", { required: true }),
          visits: field("number"),
          bounces: field("number"),
          totaltime: field("number"),
          prevPageviews: field("number"),
          prevVisitors: field("number"),
          prevVisits: field("number"),
          prevBounces: field("number"),
          prevTotaltime: field("number")
        })
      },
      analytics_series: {
        scope: "webdev.analytics.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          rangeDays: field("safe_integer", { minimum: 1, maximum: 90 }),
          startAt: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          endAt: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          timezone: field("string", { pattern: "^[A-Za-z][A-Za-z0-9_+/-]{0,63}$" }),
          unit: field("enum", { values: ["day", "hour", "month"] }),
          ...analyticsFilterArgumentFields
        },
        result: result("manus.webdev.query.analytics_series/v1", {
          available: field("boolean", { required: true }),
          points: field("analytics_point[]", { required: true })
        })
      },
      analytics_top_pages: {
        scope: "webdev.analytics.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          rangeDays: field("safe_integer", { minimum: 1, maximum: 90 }),
          startAt: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          endAt: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          timezone: field("string", { pattern: "^[A-Za-z][A-Za-z0-9_+/-]{0,63}$" }),
          limit: field("safe_integer", { minimum: 1, maximum: 50 }),
          ...analyticsFilterArgumentFields
        },
        result: result("manus.webdev.query.analytics_top_pages/v1", {
          available: field("boolean", { required: true }),
          pages: field("analytics_page[]", { required: true })
        })
      },
      analytics_metrics: {
        scope: "webdev.analytics.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          dimension: field("enum", {
            required: true,
            values: WEBDEV_S01_ANALYTICS_DIMENSIONS
          }),
          rangeDays: field("safe_integer", { minimum: 1, maximum: 90 }),
          startAt: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          endAt: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          timezone: field("string", { pattern: "^[A-Za-z][A-Za-z0-9_+/-]{0,63}$" }),
          limit: field("safe_integer", { minimum: 1, maximum: 50 }),
          ...analyticsFilterArgumentFields
        },
        result: result("manus.webdev.query.analytics_metrics/v1", {
          dimension: field("enum", {
            required: true,
            values: WEBDEV_S01_ANALYTICS_DIMENSIONS
          }),
          availability: field("enum", {
            required: true,
            values: ["available", "unavailable"]
          }),
          unavailableReason: field("enum", {
            values: WEBDEV_S01_ANALYTICS_UNAVAILABLE_REASONS
          }),
          rangeDays: field("safe_integer", { required: true, minimum: 1 }),
          items: field("analytics_metric[]", { required: true })
        })
      },
      game_multiplayer_overview: {
        scope: "webdev.project.read",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          pcId: field("string", { required: true, pattern: "^[A-Za-z0-9_-]{1,128}$" }),
          expectedRevision: field("safe_integer", { required: true, minimum: 0, maximum: 2147483646 })
        },
        result: result("manus.webdev.query.game_multiplayer_overview/v1", {
          resourceId: field("non_empty_string", { required: true }),
          selection: field("object", { required: true, itemFields: GAME_MULTIPLAYER_SELECTION_FIELDS }),
          overview: field("object", { required: true, itemFields: GAME_OVERVIEW_FIELDS })
        })
      },
      game_multiplayer: {
        scope: "webdev.project.read",
        minRole: "owner",
        actors: ["web"],
        arguments: { offset: field("safe_integer", { minimum: 0, maximum: 1e5 }), limit: field("safe_integer", { minimum: 1, maximum: 100 }) },
        result: result("manus.webdev.query.game_multiplayer/v1", {
          resourceId: field("non_empty_string", { required: true }),
          selection: field("object", { required: true, itemFields: GAME_MULTIPLAYER_SELECTION_FIELDS }),
          selectedServer: field("object|null", { required: true, itemFields: GAME_MULTIPLAYER_SERVER_FIELDS }),
          items: field("object[]", { required: true, maxItems: 100, itemFields: GAME_MULTIPLAYER_SERVER_FIELDS }),
          total: field("safe_integer", { required: true, minimum: 0 })
        })
      },
      game_version_preview: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: ["web", "share"],
        arguments: { versionId: field("git_object_id", { required: true, pattern: "^(?:[a-f0-9]{40}|[a-f0-9]{64})$" }) },
        result: result("manus.webdev.query.game_version_preview/v1", {
          resourceId: field("non_empty_string", { required: true }),
          versionId: field("git_object_id", { required: true }),
          engineVersion: field("non_empty_string", { required: true }),
          files: field("object[]", { required: true, maxItems: 1024, itemFields: {
            path: field("non_empty_string", { required: true }),
            base64: field("string", { required: true, sensitive: true }),
            sha256: field("non_empty_string", { required: true })
          } }),
          artifacts: field("object[]", { required: true, minItems: 0, maxItems: 1024, itemFields: {
            path: field("non_empty_string", { required: true }),
            sha256: field("non_empty_string", { required: true }),
            url: field("non_empty_string", { required: true, sensitive: true })
          } })
        })
      },
      versions_list: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: { limit: field("safe_integer", { minimum: 1, maximum: 100 }) },
        result: result("manus.webdev.query.versions_list/v1", {
          canonicalProvider: field("enum", { required: true, values: ["manus", "github"] }),
          canonicalBranch: field("enum", { required: true, values: ["main"] }),
          historyStatus: field("enum", { required: true, values: ["fresh", "stale", "unavailable"] }),
          historyComplete: field("boolean", { required: true }),
          currentVersionId: field("git_object_id", {
            pattern: "^(?:[0-9a-f]{40}|[0-9a-f]{64})$"
          }),
          versions: field("version_summary[]", {
            required: true,
            itemFields: {
              versionId: field("git_object_id", {
                required: true,
                pattern: "^(?:[0-9a-f]{40}|[0-9a-f]{64})$"
              }),
              hasCheckpoint: field("boolean", { required: true }),
              isInitialCheckpoint: field("boolean"),
              authorName: field("string"),
              authorUsername: field("string", { pattern: "^.{1,256}$" }),
              authorAvatarUrl: field("string", { pattern: "^.{1,4096}$" }),
              authorProfileUrl: field("string", { pattern: "^.{1,4096}$" }),
              committedAt: field("string"),
              checkpointCreatedAt: field("string"),
              rollbackFromVersionId: field("git_object_id", {
                pattern: "^(?:[0-9a-f]{40}|[0-9a-f]{64})$"
              }),
              message: field("string", { required: true }),
              changeType: field("enum", { values: ["both"] }),
              screenshotUrl: field("string"),
              createdAt: field("string"),
              sourceSessionRef: field("string", {
                pattern: "^[A-Za-z0-9][A-Za-z0-9_-]{5,127}$"
              }),
              sourceSessionTitle: field("string", { pattern: "^.{1,256}$" })
            }
          }),
          orphanedCheckpoints: field("orphaned_checkpoint[]", {
            itemFields: {
              isInitialCheckpoint: field("boolean"),
              versionId: field("git_object_id", {
                required: true,
                pattern: "^(?:[0-9a-f]{40}|[0-9a-f]{64})$"
              }),
              message: field("string"),
              checkpointCreatedAt: field("string", { required: true }),
              screenshotUrl: field("string"),
              sourceSessionRef: field("string", {
                pattern: "^[A-Za-z0-9][A-Za-z0-9_-]{5,127}$"
              }),
              sourceSessionTitle: field("string", { pattern: "^.{1,256}$" })
            }
          })
        })
      },
      mobile_ios_build_logs: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: ["web"],
        arguments: {
          buildId: field("non_empty_string", {
            required: true,
            pattern: "^[A-Za-z0-9._-]{1,128}$"
          }),
          offset: field("safe_integer", { minimum: 0 })
        },
        result: result("manus.webdev.query.mobile_ios_build_logs/v1", {
          buildId: field("non_empty_string", { required: true }),
          logs: field("string", { required: true }),
          offset: field("safe_integer", { required: true, minimum: 0 })
        })
      },
      mobile_build_status: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: ["web"],
        arguments: {
          buildId: field("non_empty_string", {
            required: true,
            pattern: "^[A-Za-z0-9._-]{1,128}$"
          })
        },
        result: result("manus.webdev.query.mobile_build_status/v1", {
          buildId: field("non_empty_string", { required: true }),
          status: field("enum", {
            required: true,
            values: WEBDEV_S01_EXPO_BUILD_STATUSES
          }),
          progress: field("safe_integer", {
            required: true,
            minimum: 0,
            maximum: 100
          }),
          sessionUid: field("string", { required: true }),
          downloadUrl: field("string"),
          errorCode: field("string"),
          diagnostic: field("string", { pattern: "^[\\s\\S]{1,4096}$" }),
          androidCertificateSha1: field("string"),
          teams: field("string[]")
        })
      },
      github_binding: {
        scope: "webdev.git.manage",
        minRole: "viewer",
        actors: ["web"],
        arguments: { checkAccess: field("boolean") },
        result: result("manus.webdev.query.github_binding/v1", {
          authorizationStatus: field("enum", { values: ["authorized", "reauthorization_required", "unavailable"] }),
          canonicalProvider: field("enum", { required: true, values: ["manus", "github"] }),
          linkRevision: field("safe_integer", { required: true, minimum: 0 }),
          repository: field("github_repository_binding"),
          operationId: field("string")
        })
      },
      github_owners: {
        scope: "webdev.git.manage",
        minRole: "owner",
        actors: ["web"],
        arguments: {},
        result: result("manus.webdev.query.github_owners/v1", {
          owners: field("github_owner[]", { required: true })
        })
      },
      storage_list: {
        scope: "webdev.storage.read",
        minRole: "editor",
        actors: READ_ACTORS,
        arguments: {
          prefix: field("string"),
          continuationToken: field("string"),
          pageSize: field("safe_integer", { minimum: 1, maximum: 200 }),
          version: field("enum", { values: ["", "v1", "v2"] })
        },
        result: result("manus.webdev.query.storage_list/v1", {
          items: field("storage_item[]", { required: true }),
          nextToken: field("string")
        })
      },
      storage_file_url: {
        scope: "webdev.storage.read",
        minRole: "editor",
        actors: READ_ACTORS,
        arguments: {
          path: field("non_empty_string", { required: true }),
          version: field("enum", { values: ["", "v1", "v2"] })
        },
        result: result("manus.webdev.query.storage_file_url/v1", {
          url: field("string", { required: true })
        })
      },
      code_tree: {
        scope: "webdev.code.read",
        minRole: "editor",
        actors: READ_ACTORS,
        arguments: { path: field("string"), full: field("boolean") },
        result: result("manus.webdev.query.code_tree/v1", {
          items: field("code_tree_item[]", { required: true })
        })
      },
      code_file: {
        scope: "webdev.code.read",
        minRole: "editor",
        actors: READ_ACTORS,
        arguments: { path: field("non_empty_string", { required: true }) },
        result: result("manus.webdev.query.code_file/v1", {
          path: field("string", { required: true }),
          content: field("string", { required: true }),
          truncated: field("boolean", { required: true }),
          sizeBytes: field("number", { required: true })
        })
      },
      code_export_zip: {
        scope: "webdev.code.read",
        minRole: "editor",
        actors: READ_ACTORS,
        arguments: { versionId: field("non_empty_string") },
        result: result("manus.webdev.query.code_export_zip/v1", {
          downloadUrl: field("string", { required: true }),
          versionId: field("string")
        })
      },
      seo_parse_result: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          path: field("site_path", { required: true, pattern: "^/.{0,2047}$" })
        },
        result: result("manus.webdev.query.seo_parse_result/v1", {
          parseResult: field("seo_parse_result")
        })
      },
      schedules_list: {
        scope: "webdev.schedule.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          page: field("safe_integer", { minimum: 1, maximum: 1e5 }),
          pageSize: field("safe_integer", { minimum: 1, maximum: 100 })
        },
        result: result("manus.webdev.query.schedules_list/v1", {
          schedules: field("schedule_summary[]", {
            required: true,
            itemFields: WEBDEV_S01_SCHEDULE_SUMMARY_FIELDS
          }),
          total: field("safe_integer", { required: true, minimum: 0 }),
          page: field("safe_integer", { required: true, minimum: 1 }),
          pageSize: field("safe_integer", { required: true, minimum: 1 })
        })
      },
      schedule_detail: {
        scope: "webdev.schedule.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          scheduleUid: field("non_empty_string", { required: true })
        },
        result: result("manus.webdev.query.schedule_detail/v1", {
          schedule: field("schedule_summary", {
            required: true,
            itemFields: WEBDEV_S01_SCHEDULE_SUMMARY_FIELDS
          })
        })
      },
      schedule_runs: {
        scope: "webdev.schedule.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          scheduleUid: field("non_empty_string", { required: true }),
          page: field("safe_integer", { minimum: 1, maximum: 1e5 }),
          pageSize: field("safe_integer", { minimum: 1, maximum: 100 }),
          status: field("enum", { values: ["success", "failed"] }),
          timeAfter: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          timeBefore: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          })
        },
        result: result("manus.webdev.query.schedule_runs/v1", {
          runs: field("schedule_run[]", {
            required: true,
            itemFields: WEBDEV_S01_SCHEDULE_RUN_FIELDS
          }),
          total: field("safe_integer", { required: true, minimum: 0 })
        })
      },
      domains_subdomain: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.query.domains_subdomain/v1", {
          subDomain: field("string", { required: true }),
          spaceId: field("string", { required: true }),
          spaceDomain: field("non_empty_string", { required: true }),
          published: field("boolean", { required: true }),
          auditStatus: field("enum", {
            values: WEBDEV_S01_SUBDOMAIN_AUDIT_STATUSES
          }),
          auditDomain: field("string"),
          dnsCnameTarget: field("string"),
          dnsARecord1: field("string"),
          dnsARecord2: field("string")
        })
      },
      project_invite_candidates: {
        scope: "webdev.project.write",
        minRole: "editor",
        actors: ["web"],
        arguments: { email: field("string", { required: true, sensitive: true, pattern: "^.{1,254}$" }) },
        result: result("manus.webdev.query.project_invite_candidates/v1", {
          candidates: field("object[]", { required: true, sensitive: true, itemFields: {
            email: field("string", { required: true }),
            userId: field("string", { required: true }),
            name: field("string", { required: true }),
            memberType: field("enum", { required: true, values: ["personal", "team"] }),
            teamName: field("string")
          } })
        })
      },
      project_invite_users: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: ["web"],
        arguments: {},
        result: result("manus.webdev.query.project_invite_users/v1", { inviteUsers: field("object[]", { required: true, sensitive: true, itemFields: { email: field("string", { required: true }), userId: field("string"), name: field("string"), frozen: field("boolean", { required: true }) } }) })
      },
      domains_membership: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.query.domains_membership/v1", {
          isVip: field("boolean", { required: true })
        })
      },
      domains_custom_list: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.query.domains_custom_list/v1", {
          customDomains: field("custom_domain_info[]", {
            required: true,
            itemFields: WEBDEV_S01_CUSTOM_DOMAIN_FIELDS
          })
        })
      },
      domains_purchased_list: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          limit: field("safe_integer", { minimum: 1, maximum: 200 }),
          offset: field("safe_integer", { minimum: 0, maximum: 1e5 })
        },
        result: result("manus.webdev.query.domains_purchased_list/v1", {
          purchasedDomains: field("purchased_domain[]", {
            required: true,
            itemFields: WEBDEV_S01_PURCHASED_DOMAIN_FIELDS
          }),
          total: field("safe_integer", { required: true, minimum: 0 })
        })
      },
      domains_processing: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        result: result("manus.webdev.query.domains_processing/v1", {
          processingDomains: field("processing_domain[]", {
            required: true,
            itemFields: {
              domainName: field("non_empty_string", { required: true }),
              purchaseType: field("enum", {
                required: true,
                values: WEBDEV_S01_PROCESSING_DOMAIN_PURCHASE_TYPES
              })
            }
          })
        })
      },
      domain_status: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          domain: field("non_empty_string", {
            required: true,
            pattern: WEBDEV_S01_DOMAIN_NAME_PATTERN
          })
        },
        result: result("manus.webdev.query.domain_status/v1", {
          domain: field("non_empty_string", { required: true }),
          status: field("enum", {
            required: true,
            values: WEBDEV_S01_CUSTOM_DOMAIN_STATUSES
          }),
          createdAt: field("safe_integer", { minimum: 0 }),
          reason: field("string")
        })
      },
      domain_check: {
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: READ_ACTORS,
        arguments: {
          domain: field("non_empty_string", {
            required: true,
            pattern: WEBDEV_S01_DOMAIN_NAME_PATTERN
          })
        },
        result: result("manus.webdev.query.domain_check/v1", {
          available: field("boolean", { required: true }),
          projectTitle: field("string"),
          connectedToCurrentSession: field("boolean"),
          connectedSessionUid: field("string"),
          connectedSessionTitle: field("string"),
          connectedSessionLink: field("string")
        })
      }
    },
    actions: {
      share_reward_event: {
        effect: "read",
        scope: "webdev.project.read",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          event: field("enum", { required: true, values: ["share_show", "share_X", "share_linkedin", "share_fb", "share_reddit", "share_discord", "share_reward_help_click", "share_reward_account_click"] }),
          entry: field("enum", { required: true, values: ["website_share_popover", "website_share_dialog", "game_share_popover"] })
        },
        result: result("manus.webdev.action.share_reward_event/v1", { ok: field("boolean", { required: true }) })
      },
      update_website_access: {
        scope: "webdev.project.write",
        minRole: "editor",
        actors: ["web"],
        arguments: {
          operation: field("enum", { required: true, values: ["set_visibility", "set_team_visibility", "add_invitee", "remove_invitee"] }),
          visibility: field("enum", { values: ["public", "owner", "team_only"] }),
          teamVisibility: field("enum", { values: ["visible", "invisible"] }),
          disableSeo: field("boolean"),
          email: field("string", { sensitive: true, pattern: "^.{1,254}$" }),
          userId: field("non_empty_string", { sensitive: true, pattern: "^.{1,128}$" }),
          memberKey: field("non_empty_string", { sensitive: true, pattern: "^.{1,1024}$" })
        },
        constraints: ["operation_discriminated_fields", "exact_email_only", "website_or_game"],
        result: result("manus.webdev.action.update_website_access/v1", { updated: field("boolean", { required: true }) })
      },
      set_game_multiplayer_server: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          pcId: field("string|null", { required: true, pattern: "^[A-Za-z0-9_-]{1,128}$" }),
          expectedRevision: field("safe_integer", { required: true, minimum: 0, maximum: 2147483646 })
        },
        result: result("manus.webdev.action.set_game_multiplayer_server/v1", {
          resourceId: field("non_empty_string", { required: true }),
          selection: field("object", { required: true, itemFields: GAME_MULTIPLAYER_SELECTION_FIELDS })
        })
      },
      read_publish_state: {
        effect: "read",
        scope: "webdev.project.read",
        minRole: "viewer",
        actors: ["web"],
        arguments: {},
        result: result("manus.webdev.action.read_publish_state/v1", {
          resourceUri: field("string", { required: true }),
          status: field("string", { required: true }),
          published: field("boolean", { required: true }),
          revision: field("string"),
          publishedVersionId: field("string"),
          publishedUrl: field("string")
        })
      },
      set_app_preview_permission: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          permission: field("enum", { required: true, values: WEBDEV_S01_APP_PREVIEW_PERMISSIONS })
        },
        result: result("manus.webdev.action.set_app_preview_permission/v1", {
          updated: field("boolean", { required: true })
        })
      },
      update_project_invite_users: {
        scope: "webdev.project.write",
        minRole: "editor",
        actors: ["web"],
        arguments: { inviteUsers: field("object[]", { required: true, maxItems: 100, sensitive: true, itemFields: { email: field("string", { required: true }), userId: field("string") } }) },
        result: result("manus.webdev.action.update_project_invite_users/v1", { updated: field("boolean", { required: true }) })
      },
      update_project_metadata: {
        scope: "webdev.project.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          title: field("string"),
          description: field("string"),
          autoPublish: field("boolean"),
          visibility: field("enum", { values: ["public", "owner", "team_only"] }),
          logoUrl: field("string", { pattern: "^https://.{1,2048}$" }),
          hideManusBadge: field("boolean"),
          platformAnalyticsEnabled: field("boolean"),
          enableSeo: field("boolean")
        },
        constraints: [
          "at_least_one:title,description,autoPublish,visibility,logoUrl,hideManusBadge,platformAnalyticsEnabled,enableSeo"
        ],
        result: result("manus.webdev.action.update_project_metadata/v1", {
          updated: field("boolean", { required: true })
        })
      },
      index_project: {
        scope: "webdev.project.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {},
        result: result("manus.webdev.action.index_project/v1", {
          indexed: field("boolean", { required: true })
        })
      },
      update_notification_settings: {
        scope: "webdev.project.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          enableEmail: field("boolean", { required: true }),
          enableInApp: field("boolean", { required: true }),
          enablePush: field("boolean", { required: true }),
          expectedRevision: field("opaque_revision", { required: true })
        },
        constraints: ["attached_session_required"],
        result: result("manus.webdev.action.update_notification_settings/v1", {
          updated: field("boolean", { required: true }),
          revision: field("opaque_revision", { required: true })
        })
      },
      switch_hosting_mode: {
        scope: "webdev.deploy",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          targetMode: field("enum", {
            required: true,
            values: ["on_demand", "always_on"]
          })
        },
        result: result("manus.webdev.action.switch_hosting_mode/v1", {
          updated: field("boolean", { required: true })
        })
      },
      duplicate_project: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          title: field("string", { required: true, pattern: "^.{1,512}$" }),
          copyStripe: field("boolean"),
          copyShopify: field("boolean")
        },
        result: result("manus.webdev.action.duplicate_project/v1", {
          accepted: field("boolean", { required: true }),
          operationId: field("string", { required: true }),
          resourceId: field("string", { required: true }),
          resourceUri: field("string", { required: true }),
          status: field("string", { required: true })
        })
      },
      presign_logo_upload: {
        scope: "webdev.project.write",
        minRole: "editor",
        actors: ["web"],
        arguments: {
          contentType: field("enum", {
            required: true,
            values: ["image/png", "image/jpeg", "image/webp"]
          }),
          sizeBytes: field("safe_integer", {
            required: true,
            minimum: 1,
            maximum: 5242880
          })
        },
        result: result("manus.webdev.action.presign_logo_upload/v1", {
          uploadUrl: field("string", { required: true }),
          assetUrl: field("string", { required: true })
        })
      },
      confirm_stripe_integration: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          operationId: field("non_empty_string", { required: true }),
          inputId: field("non_empty_string", { required: true })
        },
        constraints: ["attached_session_required"],
        result: result("manus.webdev.action.confirm_stripe_integration/v1", {
          provider: field("enum", { required: true, values: ["stripe"] }),
          status: field("enum", { required: true, values: ["ready", "failed"] }),
          revision: field("number"),
          contentHash: field("string"),
          claimUrl: field("string"),
          claimed: field("boolean"),
          reasonCode: field("string"),
          retryable: field("boolean")
        })
      },
      update_stripe_config: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          environment: field("enum", {
            required: true,
            values: ["dev", "prod"]
          }),
          stripeSecretKey: field("string"),
          stripePublishableKey: field("string"),
          webhookSecret: field("string"),
          skipWebhookRegistration: field("boolean"),
          isClaimableSandboxOverridden: field("boolean")
        },
        result: result("manus.webdev.action.update_stripe_config/v1", {
          success: field("boolean", { required: true }),
          message: field("string")
        })
      },
      verify_webhook: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          environment: field("enum", {
            required: true,
            values: ["dev", "prod"]
          })
        },
        result: result("manus.webdev.action.verify_webhook/v1", {
          success: field("boolean", { required: true }),
          message: field("string")
        })
      },
      register_webhook: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          environment: field("enum", {
            required: true,
            values: ["dev", "prod"]
          }),
          baseUrl: field("non_empty_string", { required: true })
        },
        result: result("manus.webdev.action.register_webhook/v1", {
          success: field("boolean", { required: true }),
          webhookId: field("string", { required: true }),
          webhookUrl: field("string", { required: true }),
          message: field("string", { required: true })
        })
      },
      create_coupon: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {},
        result: result("manus.webdev.action.create_coupon/v1", {
          success: field("boolean", { required: true }),
          couponCode: field("string"),
          message: field("string")
        })
      },
      delete_coupon: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {},
        result: result("manus.webdev.action.delete_coupon/v1", {
          success: field("boolean", { required: true }),
          message: field("string")
        })
      },
      database_insert_row: {
        scope: "webdev.database.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          table: field("table_name", { required: true }),
          record: field("non_empty_json_object", { required: true })
        },
        result: result("manus.webdev.action.database_insert_row/v1", {
          inserted: field("boolean", { required: true })
        })
      },
      database_update_row: {
        scope: "webdev.database.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          table: field("table_name", { required: true }),
          id: field("database_id", { required: true }),
          update: field("non_empty_json_object", { required: true }),
          expectedRevision: field("opaque_revision", { required: true })
        },
        constraints: ["update_forbids_case_insensitive:id"],
        result: result("manus.webdev.action.database_update_row/v1", {
          affected: field("safe_integer", { required: true, minimum: 0 }),
          revision: field("opaque_revision", { required: true })
        })
      },
      database_delete_rows: {
        scope: "webdev.database.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          table: field("table_name", { required: true }),
          ids: field("database_id[]", {
            required: true,
            minItems: 1,
            maxItems: 100
          })
        },
        result: result("manus.webdev.action.database_delete_rows/v1", {
          affected: field("safe_integer", { required: true, minimum: 0 })
        })
      },
      database_export: {
        scope: "webdev.database.write",
        minRole: "owner",
        actors: MUTATION_ACTORS,
        arguments: {
          table: field("table_name", { required: true }),
          format: field("enum", { values: ["csv"] })
        },
        result: result("manus.webdev.action.database_export/v1", {
          downloadUrl: field("string", { required: true })
        })
      },
      dismiss_team_login_notice: {
        scope: "webdev.project.write",
        minRole: "editor",
        actors: ["web"],
        arguments: {},
        result: result("manus.webdev.action.dismiss_team_login_notice/v1", { ok: field("boolean", { required: true }) })
      },
      grant_agent_publish_consent: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: ["web"],
        arguments: {},
        result: result("manus.webdev.action.grant_agent_publish_consent/v1", { ok: field("boolean", { required: true }) })
      },
      revoke_agent_publish_consent: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: ["web"],
        arguments: {},
        result: result("manus.webdev.action.revoke_agent_publish_consent/v1", { ok: field("boolean", { required: true }) })
      },
      publish_project: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: ["web"],
        arguments: {
          versionId: field("non_empty_string"),
          confirmUncheckpointedMain: field("boolean")
        },
        result: result("manus.webdev.action.publish_project/v1", {
          deployId: field("string", { required: true }),
          gitSha: field("string"),
          webdevConfigRevision: field("number"),
          webdevConfigDigest: field("string"),
          promoted: field("boolean")
        })
      },
      unpublish_project: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {},
        result: result("manus.webdev.action.unpublish_project/v1", {
          ok: field("boolean", { required: true })
        })
      },
      delete_project: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: {},
        result: result("manus.webdev.action.delete_project/v1", {
          purgeAfter: field("string", { required: true })
        })
      },
      cancel_deploy: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: { versionId: field("non_empty_string") },
        result: result("manus.webdev.action.cancel_deploy/v1", {
          canceled: field("boolean", { required: true })
        })
      },
      mobile_preview_connect: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: ["web"],
        arguments: { expoToken: field("string", { pattern: "^.{1,4096}$", sensitive: true }) },
        constraints: ["attached_session_required"],
        result: result("manus.webdev.action.mobile_preview_connect/v1", {
          state: field("enum", { required: true, values: ["missing", "invalid", "saved", "owner_mismatch", "unavailable"] }),
          username: field("string")
        })
      },
      mobile_build_start: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: ["web"],
        arguments: {
          packType: field("enum", {
            required: true,
            values: WEBDEV_S01_EXPO_PACK_TYPES
          }),
          versionName: field("string", {
            required: true,
            pattern: "^[1-9][0-9]?\\.[0-9]{1,2}\\.[0-9]{1,2}$"
          }),
          appleId: field("string", { pattern: "^.{1,320}$" }),
          password: field("string", { pattern: "^.{1,1024}$", sensitive: true }),
          expoToken: field("string", { pattern: "^.{1,4096}$", sensitive: true })
        },
        constraints: [
          "attached_session_required",
          "same_presence:appleId,password",
          "fields_require_value:appleId,password:packType=ipa"
        ],
        result: result("manus.webdev.action.mobile_build_start/v1", {
          buildId: field("non_empty_string", { required: true })
        })
      },
      mobile_ios_build_input: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: ["web"],
        arguments: {
          buildId: field("non_empty_string", {
            required: true,
            pattern: "^[A-Za-z0-9._-]{1,128}$"
          }),
          inputs: field("ios_build_input[]", {
            required: true,
            minItems: 1,
            maxItems: 2,
            itemFields: {
              inputType: field("enum", {
                required: true,
                values: WEBDEV_S01_EXPO_IOS_INPUT_TYPES
              }),
              value: field("string", {
                required: true,
                pattern: "^.{1,4096}$",
                sensitive: true
              })
            }
          })
        },
        constraints: [
          "unique_items_by:inputs,inputType",
          "paired_input_types:apple_id,password"
        ],
        result: result("manus.webdev.action.mobile_ios_build_input/v1", {
          submitted: field("boolean", { required: true })
        })
      },
      mobile_ios_build_cancel: {
        scope: "webdev.deploy",
        minRole: "editor",
        actors: ["web"],
        arguments: {
          buildId: field("non_empty_string", {
            required: true,
            pattern: "^[A-Za-z0-9._-]{1,128}$"
          })
        },
        result: result("manus.webdev.action.mobile_ios_build_cancel/v1", {
          canceled: field("boolean", { required: true })
        })
      },
      storage_delete_files: {
        scope: "webdev.storage.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          paths: field("storage_delete_item[]", {
            required: true,
            minItems: 1,
            maxItems: 100
          })
        },
        result: result("manus.webdev.action.storage_delete_files/v1", {
          deleted: field("safe_integer", { required: true, minimum: 0 })
        })
      },
      github_create: {
        scope: "webdev.git.manage",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          expectedLinkRevision: field("safe_integer", { required: true, minimum: 0 }),
          target: field("github_create_target", { required: true }),
          confirmationOperationId: field("string")
        },
        result: result("manus.webdev.action.github_canonical_operation/v1", {
          operationId: field("string", { required: true }),
          status: field("enum", {
            required: true,
            values: ["queued", "running", "succeeded", "failed"]
          })
        })
      },
      github_disconnect: {
        scope: "webdev.git.manage",
        minRole: "owner",
        actors: ["web"],
        arguments: {
          confirmationOperationId: field("string"),
          expectedLinkRevision: field("safe_integer", { required: true, minimum: 0 })
        },
        result: result("manus.webdev.action.github_disconnect/v1", {
          disconnected: field("boolean", { required: true })
        })
      },
      schedule_enable: {
        scope: "webdev.schedule.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          scheduleUid: field("non_empty_string", { required: true })
        },
        result: result("manus.webdev.action.schedule_enable/v1", {
          schedule: field("schedule_summary", {
            required: true,
            itemFields: WEBDEV_S01_SCHEDULE_SUMMARY_FIELDS
          })
        })
      },
      schedule_pause: {
        scope: "webdev.schedule.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          scheduleUid: field("non_empty_string", { required: true })
        },
        result: result("manus.webdev.action.schedule_pause/v1", {
          schedule: field("schedule_summary", {
            required: true,
            itemFields: WEBDEV_S01_SCHEDULE_SUMMARY_FIELDS
          })
        })
      },
      schedule_trigger_now: {
        scope: "webdev.schedule.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          scheduleUid: field("non_empty_string", { required: true })
        },
        result: result("manus.webdev.action.schedule_trigger_now/v1", {
          triggered: field("boolean", { required: true })
        })
      },
      schedule_delete: {
        scope: "webdev.schedule.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          scheduleUid: field("non_empty_string", { required: true })
        },
        result: result("manus.webdev.action.schedule_delete/v1", {
          deleted: field("boolean", { required: true })
        })
      },
      schedule_update: {
        scope: "webdev.schedule.write",
        minRole: "editor",
        actors: MUTATION_ACTORS,
        arguments: {
          scheduleUid: field("non_empty_string", { required: true }),
          name: field("string", { pattern: "^.{1,512}$" }),
          description: field("string", { pattern: "^[\\s\\S]{0,4096}$" }),
          cronExpression: field("string", { pattern: "^.{1,256}$" }),
          expireAt: field("safe_integer", {
            minimum: 0,
            maximum: WEBDEV_S01_ANALYTICS_MAX_EPOCH_MS
          }),
          clearExpireAt: field("boolean")
        },
        constraints: [
          "at_least_one:name,description,cronExpression,expireAt,clearExpireAt",
          "mutually_exclusive:expireAt,clearExpireAt"
        ],
        result: result("manus.webdev.action.schedule_update/v1", {
          schedule: field("schedule_summary", {
            required: true,
            itemFields: WEBDEV_S01_SCHEDULE_SUMMARY_FIELDS
          })
        })
      },
      subdomain_update: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: MUTATION_ACTORS,
        arguments: {
          subDomain: field("non_empty_string", {
            required: true,
            pattern: "^\\S{1,63}$"
          })
        },
        result: result("manus.webdev.action.subdomain_update/v1", {
          updated: field("boolean", { required: true })
        })
      },
      domain_connect: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: MUTATION_ACTORS,
        arguments: {
          domain: field("non_empty_string", {
            required: true,
            pattern: WEBDEV_S01_DOMAIN_NAME_PATTERN
          }),
          withWww: field("boolean")
        },
        result: result("manus.webdev.action.domain_connect/v1", {
          connected: field("boolean", { required: true })
        })
      },
      domain_disconnect: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: MUTATION_ACTORS,
        arguments: {
          domain: field("non_empty_string", {
            required: true,
            pattern: WEBDEV_S01_DOMAIN_NAME_PATTERN
          }),
          withWww: field("boolean")
        },
        result: result("manus.webdev.action.domain_disconnect/v1", {
          disconnected: field("boolean", { required: true })
        })
      },
      domain_refund: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: MUTATION_ACTORS,
        arguments: {
          domain: field("non_empty_string", {
            required: true,
            pattern: WEBDEV_S01_DOMAIN_NAME_PATTERN
          })
        },
        result: result("manus.webdev.action.domain_refund/v1", {
          refunded: field("boolean", { required: true })
        })
      },
      domain_recheck: {
        scope: "webdev.project.write",
        minRole: "owner",
        actors: MUTATION_ACTORS,
        arguments: {
          domain: field("non_empty_string", {
            required: true,
            pattern: WEBDEV_S01_DOMAIN_NAME_PATTERN
          })
        },
        result: result("manus.webdev.action.domain_recheck/v1", {
          requested: field("boolean", { required: true })
        })
      }
    }
  },
  publicError: {
    schema: WEBDEV_PUBLIC_ERROR_SCHEMA,
    canonicalTuples: WEBDEV_PUBLIC_ERROR_CONSUMER_TUPLES,
    fields: {
      code: field("enum", {
        required: true,
        values: Object.keys(WEBDEV_PUBLIC_ERROR_CONSUMER_TUPLES)
      }),
      message: field("public_string", { required: true }),
      retryable: field("boolean", { required: true }),
      requestId: field("string", { required: true }),
      recoveryAction: field("enum", {
        values: [
          "reauthorize",
          "reread_view",
          "resolve_binding",
          "resubscribe",
          "reacquire_lease",
          "retry",
          "contact_support"
        ]
      }),
      fieldErrors: field("field_error[]"),
      currentRevision: field("opaque_revision"),
      reasonCode: field("string"),
      proposalId: field("string"),
      operationId: field("string")
    },
    redaction: {
      forbidden: ["credential", "authorization", "token", "secret", "internal_url"],
      upstreamMessages: false
    }
  }
};
var WEBDEV_S01_GOLDENS = {
  schema: "manus.webdev.typed_contract_goldens/v1",
  policy: [
    { role: "owner", actor: "web", mutations: "allowed" },
    { role: "editor", actor: "node", mutations: "allowed" },
    { role: "viewer", actor: "runtime", mutations: "denied" },
    { role: "owner", actor: "share", mutations: "denied" }
  ],
  validRequests: [
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "database_rows",
      arguments: {
        table: "users",
        page: 1,
        pageSize: 25,
        order: { field: "created_at", direction: "DESC" }
      }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "analytics_metrics",
      arguments: { dimension: "utm_source", rangeDays: 30, limit: 20 }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "analytics_summary",
      arguments: {
        startAt: 1755561600000,
        endAt: 1755648000000,
        timezone: "Asia/Shanghai"
      }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "analytics_series",
      arguments: { startAt: 1577836800000, endAt: 1755648000000, unit: "month" }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "analytics_top_pages",
      arguments: {
        rangeDays: 1,
        limit: 20,
        url: "~/blog",
        country: "US",
        browser: "!Chrome",
        referrer: "!~google.com"
      }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "code_tree",
      arguments: { path: "", full: true }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "code_export_zip",
      arguments: {}
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "code_export_zip",
      arguments: { versionId: "a".repeat(40) }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "github_disconnect",
      clientRequestId: "github-disconnect-1",
      arguments: { expectedLinkRevision: 3 }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "database_update_row",
      clientRequestId: "cas-1",
      arguments: {
        table: "users",
        id: 0,
        update: { name: "Ada" },
        expectedRevision: "sha256:before"
      }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "update_notification_settings",
      clientRequestId: "notifications-save-1",
      arguments: {
        enableEmail: true,
        enableInApp: false,
        enablePush: false,
        expectedRevision: "sha256:notifications-before"
      }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "switch_hosting_mode",
      clientRequestId: "hosting-switch-1",
      arguments: { targetMode: "always_on" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "duplicate_project",
      clientRequestId: "duplicate-1",
      arguments: { title: "Copy of Fake project", copyStripe: true }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "presign_logo_upload",
      clientRequestId: "logo-presign-1",
      arguments: { contentType: "image/webp", sizeBytes: 204800 }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "update_stripe_config",
      clientRequestId: "stripe-update-1",
      arguments: {
        environment: "dev",
        skipWebhookRegistration: true,
        isClaimableSandboxOverridden: true
      }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "verify_webhook",
      clientRequestId: "stripe-verify-1",
      arguments: { environment: "dev" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "register_webhook",
      clientRequestId: "stripe-register-1",
      arguments: {
        environment: "dev",
        baseUrl: "https://preview.example.test"
      }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "create_coupon",
      clientRequestId: "stripe-coupon-1",
      arguments: {}
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "delete_coupon",
      clientRequestId: "stripe-coupon-del-1",
      arguments: {}
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "update_project_metadata",
      clientRequestId: "logo-commit-1",
      arguments: { logoUrl: "https://cdn.example/webdev-logo.webp" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "update_project_metadata",
      clientRequestId: "badge-hide-1",
      arguments: { hideManusBadge: true }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "schedules_list",
      arguments: { page: 1, pageSize: 20 }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "schedule_runs",
      arguments: {
        scheduleUid: "sched-1",
        page: 1,
        pageSize: 20,
        status: "failed",
        timeAfter: 1752969600000,
        timeBefore: 1755648000000
      }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "schedule_update",
      clientRequestId: "schedule-save-1",
      arguments: {
        scheduleUid: "sched-1",
        name: "Nightly sync",
        description: "Sync stocks nightly.",
        cronExpression: "5 13 * * 1,2",
        expireAt: 1755648000000
      }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "schedule_trigger_now",
      clientRequestId: "schedule-run-1",
      arguments: { scheduleUid: "sched-1" }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "domains_subdomain",
      arguments: {}
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "domains_membership",
      arguments: {}
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "domains_custom_list",
      arguments: {}
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "domains_purchased_list",
      arguments: { limit: 50, offset: 0 }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "domains_processing",
      arguments: {}
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "domain_status",
      arguments: { domain: "blog.example.com" }
    },
    {
      schema: "manus.webdev.query_request/v1",
      queryName: "domain_check",
      arguments: { domain: "example.com" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "subdomain_update",
      clientRequestId: "subdomain-save-1",
      arguments: { subDomain: "my-cool-site" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "domain_connect",
      clientRequestId: "domain-connect-1",
      arguments: { domain: "example.com", withWww: true }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "domain_disconnect",
      clientRequestId: "domain-disconnect-1",
      arguments: { domain: "example.com", withWww: true }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "domain_refund",
      clientRequestId: "domain-refund-1",
      arguments: { domain: "failed-registration.com" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "domain_recheck",
      clientRequestId: "domain-recheck-1",
      arguments: { domain: "failed-registration.com" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "update_project_metadata",
      clientRequestId: "visibility-write-1",
      arguments: { visibility: "owner" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "update_project_metadata",
      clientRequestId: "visibility-team-write",
      arguments: { visibility: "team_only" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "update_website_access",
      clientRequestId: "website-team-write",
      arguments: { operation: "set_visibility", visibility: "team_only", teamVisibility: "visible" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "update_project_metadata",
      clientRequestId: "auto-publish-toggle-1",
      arguments: { autoPublish: true }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "cancel_deploy",
      clientRequestId: "cancel-deploy-1",
      arguments: { versionId: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
    },
    {
      schema: "manus.webdev.action_request/v1",
      actionName: "cancel_deploy",
      clientRequestId: "cancel-deploy-current-1",
      arguments: {}
    }
  ],
  invalidRequests: [
    {
      name: "subdomain_update rejects an empty subDomain",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "subdomain_update",
        clientRequestId: "subdomain-empty",
        arguments: { subDomain: "" }
      }
    },
    {
      name: "domain_connect rejects whitespace in the domain",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "domain_connect",
        clientRequestId: "domain-connect-space",
        arguments: { domain: "bad domain.com" }
      }
    },
    {
      name: "domains_purchased_list rejects limit 0 (Biz LIMIT 0 = empty list)",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "domains_purchased_list",
        arguments: { limit: 0, offset: 0 }
      }
    },
    {
      name: "domain_status requires a domain argument",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "domain_status",
        arguments: {}
      }
    },
    {
      name: "visibility write only accepts the public/owner/team_only vocabulary",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "update_project_metadata",
        clientRequestId: "visibility-drift",
        arguments: { visibility: "team" }
      }
    },
    {
      name: "cancel_deploy rejects an empty versionId",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "cancel_deploy",
        clientRequestId: "cancel-empty-version",
        arguments: { versionId: "" }
      }
    },
    {
      name: "stale-capable write requires expected revision",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "database_update_row",
        clientRequestId: "cas-missing",
        arguments: { table: "users", id: 1, update: { name: "Ada" } }
      }
    },
    {
      name: "mixed update cannot smuggle primary key",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "database_update_row",
        clientRequestId: "cas-mixed",
        arguments: {
          table: "users",
          id: 1,
          update: { ID: 2, name: "Ada" },
          expectedRevision: "sha256:before"
        }
      }
    },
    {
      name: "notification write requires expected revision",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "update_notification_settings",
        clientRequestId: "notifications-cas-missing",
        arguments: { enableEmail: true, enableInApp: true, enablePush: true }
      }
    },
    {
      name: "notification write requires the enablePush fifth key",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "update_notification_settings",
        clientRequestId: "notifications-push-missing",
        arguments: {
          enableEmail: true,
          enableInApp: true,
          expectedRevision: "sha256:notifications-before"
        }
      }
    },
    {
      name: "hosting mode target is a fixed allowlist",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "switch_hosting_mode",
        clientRequestId: "hosting-switch-bad",
        arguments: { targetMode: "turbo" }
      }
    },
    {
      name: "duplicate title must be non-empty",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "duplicate_project",
        clientRequestId: "duplicate-bad",
        arguments: { title: "" }
      }
    },
    {
      name: "logo presign size is capped at 5MiB",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "presign_logo_upload",
        clientRequestId: "logo-presign-bad",
        arguments: { contentType: "image/webp", sizeBytes: 5242881 }
      }
    },
    {
      name: "logo url must be https",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "update_project_metadata",
        clientRequestId: "logo-commit-bad",
        arguments: { logoUrl: "http://cdn.example/webdev-logo.webp" }
      }
    },
    {
      name: "unknown generic RPC fields are closed",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "database_rows",
        arguments: { table: "users", rpcName: "DeleteEverything" }
      }
    },
    {
      name: "database order nested fields are exact",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "database_rows",
        arguments: {
          table: "users",
          order: { field: "id", direction: "ASC", nulls: "LAST" }
        }
      }
    },
    {
      name: "database order field is non-empty",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "database_rows",
        arguments: { table: "users", order: { field: "", direction: "ASC" } }
      }
    },
    {
      name: "database order field is a safe identifier",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "database_rows",
        arguments: {
          table: "users",
          order: { field: "id; DROP TABLE users", direction: "ASC" }
        }
      }
    },
    {
      name: "database order direction is closed",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "database_rows",
        arguments: {
          table: "users",
          order: { field: "id", direction: "ascending" }
        }
      }
    },
    {
      name: "analytics dimensions are a fixed allowlist",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "analytics_metrics",
        arguments: { dimension: "rpc_name" }
      }
    },
    {
      name: "analytics rangeDays and explicit window are mutually exclusive",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "analytics_summary",
        arguments: { rangeDays: 7, startAt: 1755561600000, endAt: 1755648000000 }
      }
    },
    {
      name: "analytics explicit window requires both bounds",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "analytics_top_pages",
        arguments: { startAt: 1755561600000 }
      }
    },
    {
      name: "analytics window must not end before it starts",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "analytics_series",
        arguments: { startAt: 1755648000000, endAt: 1755561600000 }
      }
    },
    {
      name: "analytics timezone belongs to the explicit window group",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "analytics_metrics",
        arguments: { dimension: "country", rangeDays: 7, timezone: "UTC" }
      }
    },
    {
      name: "analytics month granularity belongs to the explicit window group",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "analytics_series",
        arguments: { rangeDays: 30, unit: "month" }
      }
    },
    {
      name: "analytics filter values must not be empty",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "analytics_summary",
        arguments: { rangeDays: 7, url: "" }
      }
    },
    {
      name: "analytics filter predicate prefix requires a value remainder",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "analytics_metrics",
        arguments: { dimension: "referrer", rangeDays: 7, referrer: "!~" }
      }
    },
    {
      name: "code_tree full must be a boolean",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "code_tree",
        arguments: { path: "", full: "yes" }
      }
    },
    {
      name: "code_export_zip arguments are closed",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "code_export_zip",
        arguments: { format: "zip" }
      }
    },
    {
      name: "github_disconnect requires the expected link revision",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "github_disconnect",
        clientRequestId: "github-disconnect-bad",
        arguments: {}
      }
    },
    {
      name: "schedule run filter is a fixed allowlist",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "schedule_runs",
        arguments: { scheduleUid: "sched-1", status: "running" }
      }
    },
    {
      name: "schedule detail requires a schedule uid",
      value: {
        schema: "manus.webdev.query_request/v1",
        queryName: "schedule_detail",
        arguments: {}
      }
    },
    {
      name: "schedule update needs at least one change",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "schedule_update",
        clientRequestId: "schedule-save-empty",
        arguments: { scheduleUid: "sched-1" }
      }
    },
    {
      name: "schedule update cannot set and clear expiry together",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "schedule_update",
        clientRequestId: "schedule-save-conflict",
        arguments: {
          scheduleUid: "sched-1",
          expireAt: 1755648000000,
          clearExpireAt: true
        }
      }
    },
    {
      name: "schedule trigger arguments are closed",
      value: {
        schema: "manus.webdev.action_request/v1",
        actionName: "schedule_trigger_now",
        clientRequestId: "schedule-run-bad",
        arguments: { scheduleUid: "sched-1", force: true }
      }
    }
  ],
  staleConflict: {
    response: {
      schema: "manus.webdev.error/v1",
      error: {
        code: "revision_conflict",
        message: "database row revision conflict",
        retryable: false,
        requestId: "request-1",
        recoveryAction: "reread_view",
        currentRevision: "sha256:current"
      }
    }
  },
  idempotencyConflict: {
    sameKeyDifferentBody: true,
    code: "idempotency_conflict"
  },
  redaction: {
    upstreamCanary: "postgres://internal/TOKEN_SECRET",
    publicMessage: "upstream service unavailable"
  }
};

// shared/gameShareMetadata.ts
var GAME_SHARE_LIMITS = {
  title: 120,
  description: 1000,
  caption: 4000,
  imageBytes: 8 * 1024 * 1024,
  imagePixels: 16 * 1024 * 1024
};
var digest = exports_external.string().regex(/^sha256:[a-f0-9]{64}$/);
var sha = exports_external.string().regex(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/);
var text = (max, min = 0) => exports_external.string().min(min).max(max).refine((value) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value), "invalid control character");
var projectImagePath = exports_external.string().max(512).regex(/^assets\/(?!.*(?:^|\/)\.\.?(?:\/|$))[^\\%?#\u0000-\u001f]+\.png$/i);
var gameShareCaptionsSchema = exports_external.object({
  x: text(GAME_SHARE_LIMITS.caption).optional(),
  facebook: text(GAME_SHARE_LIMITS.caption).optional(),
  reddit: text(GAME_SHARE_LIMITS.caption).optional(),
  discord: text(GAME_SHARE_LIMITS.caption).optional()
}).strict();
var gameShareProjectSchema = exports_external.object({
  schemaVersion: exports_external.literal(2),
  title: text(GAME_SHARE_LIMITS.title, 1).optional(),
  description: text(GAME_SHARE_LIMITS.description).optional(),
  defaultCaptions: gameShareCaptionsSchema.default({}),
  assets: exports_external.object({ og: projectImagePath.optional(), favicon: projectImagePath.optional() }).strict().default({})
}).strict();
var releaseAssetShape = {
  digest,
  path: exports_external.string().regex(/^share\/[a-f0-9]{64}\.png$/),
  mime: exports_external.literal("image/png"),
  width: exports_external.number().int().positive(),
  height: exports_external.number().int().positive(),
  sizeBytes: exports_external.number().int().positive().max(GAME_SHARE_LIMITS.imageBytes)
};
var gameShareReleaseAssetSchema = exports_external.object({
  ...releaseAssetShape,
  sourcePath: projectImagePath.optional()
}).strict().refine((value) => value.path === `share/${value.digest.slice(7)}.png` && value.width * value.height <= GAME_SHARE_LIMITS.imagePixels, "invalid release image");
var gameSharePublicationOriginSchema = exports_external.string().url().refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.origin === value && !url.username && !url.password && !url.port && !url.hostname.startsWith("[") && url.hostname.includes(".") && !/^[\d.]+$/.test(url.hostname) && !url.hostname.endsWith(".localhost") && !url.hostname.endsWith(".local") && !url.hostname.endsWith(".internal");
  } catch {
    return false;
  }
}, "expected trusted public HTTPS origin");
var legacyAssetSchema = exports_external.object({ assetRef: exports_external.string().regex(/^[a-zA-Z0-9_-]{1,128}$/), ...releaseAssetShape }).strict();
var legacyGameShareReleaseSnapshotSchema = exports_external.object({
  schemaVersion: exports_external.literal(1),
  resourceId: exports_external.string().regex(/^[a-zA-Z0-9_-]{1,128}$/),
  shareRevisionId: exports_external.string().regex(/^[a-zA-Z0-9_-]{1,128}$/),
  shareRevision: exports_external.number().int().positive(),
  contentHash: digest,
  publicationOrigin: gameSharePublicationOriginSchema,
  title: text(GAME_SHARE_LIMITS.title, 1),
  description: text(GAME_SHARE_LIMITS.description),
  defaultCaptions: gameShareCaptionsSchema,
  assets: exports_external.object({ og: legacyAssetSchema, favicon: legacyAssetSchema }).strict()
}).strict();
var currentGameShareReleaseSnapshotSchema = exports_external.object({
  schemaVersion: exports_external.literal(2),
  publicationOrigin: gameSharePublicationOriginSchema,
  title: text(GAME_SHARE_LIMITS.title, 1),
  description: text(GAME_SHARE_LIMITS.description),
  defaultCaptions: gameShareCaptionsSchema,
  assets: exports_external.object({ og: gameShareReleaseAssetSchema.optional(), favicon: gameShareReleaseAssetSchema.optional() }).strict()
}).strict();
var gameShareReleaseSnapshotSchema = exports_external.union([
  legacyGameShareReleaseSnapshotSchema,
  currentGameShareReleaseSnapshotSchema
]);
// shared/webdev-preview-edit.ts
var PREVIEW_EDIT_LIMITS = {
  edits: 20,
  text: 32768,
  html: 12000,
  domNodes: 500,
  textBytes: 256 * 1024,
  imageBytes: 2 * 1024 * 1024,
  totalImageBytes: 8 * 1024 * 1024,
  stageBytes: 16 * 1024 * 1024,
  wireBytes: 32 * 1024 * 1024
};
var encoder = new TextEncoder;
var PRIVATE_AUTH_PARAMETERS = new Set([
  "authorization",
  "cookie",
  "accesstoken",
  "refreshtoken",
  "idtoken",
  "subjecttoken",
  "hostaccesstoken",
  "addonsession",
  "addonsessiontoken",
  "previewref",
  "runtimeref",
  "mountcredential",
  "apikey",
  "accesskey",
  "secretaccesskey",
  "privatekey",
  "clientsecret",
  "clientassertion",
  "codeverifier",
  "oauthtoken",
  "oauthverifier",
  "password",
  "passwd",
  "xamzcredential",
  "xamzsignature",
  "xamzsecuritytoken",
  "xgoogcredential",
  "xgoogsignature"
]);
// shared/webdev-widget-uri.ts
var WEBDEV_WIDGET_URI_PREFIX = `manus-widget://${WEBDEV_ADDON_ID}/${WEBDEV_WIDGET_ID}/${WEBDEV_RESOURCE_KEY}/`;
// shared/webdev-contract.ts
var WEBDEV_MOBILE_EXPO_STARTER_ID = "mobile-expo-v13";
var WEBDEV_MOBILE_EXPO_STARTER_REVISION = "00466b8c366a9421bb2eb296d990f448e07f2404063c1d02fdfbd1afa1471d80";
var WEBDEV_MOBILE_EXPO_PRENEGOTIATION_STARTER_REVISION = "d5c16f689b13050437d1866dbdbba42a8d321d765b6f9f3fdda8b9e793a29b71";
var WEBDEV_MOBILE_EXPO_PRENEGOTIATION_STARTER_ID = "mobile-expo-v11";
var WEBDEV_MOBILE_EXPO_SUPPORTED_STARTERS = Object.freeze([
  Object.freeze({
    id: WEBDEV_MOBILE_EXPO_STARTER_ID,
    revision: WEBDEV_MOBILE_EXPO_STARTER_REVISION
  }),
  Object.freeze({
    id: "mobile-expo-v12",
    revision: "b658829b3febd5cc4c72582299139f861dac3b81d518fd1268d628011bcaf281"
  }),
  Object.freeze({
    id: WEBDEV_MOBILE_EXPO_PRENEGOTIATION_STARTER_ID,
    revision: WEBDEV_MOBILE_EXPO_PRENEGOTIATION_STARTER_REVISION
  })
]);
var WEBDEV_WORKSPACE_FILE_READ_MAX_BYTES = 8 * 1024 * 1024;
var WEBDEV_VIEW_CATALOG = WEBDEV_S01_IDL.catalog.views;
var WEBDEV_QUERY_CATALOG = WEBDEV_S01_IDL.catalog.queries;
var WEBDEV_ACTION_CATALOG = WEBDEV_S01_IDL.catalog.actions;
var WEBDEV_DATABASE_ORDER_FIELD_RE = new RegExp(WEBDEV_S01_DATABASE_ORDER_FIELD_PATTERN);

// mcp/init/mobileExpoStarter.ts
var TEXT_EXTENSIONS = new Set([
  ".css",
  ".env",
  ".go",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".php",
  ".py",
  ".rb",
  ".rs",
  ".scss",
  ".svelte",
  ".ts",
  ".tsx",
  ".txt",
  ".vue",
  ".yaml",
  ".yml"
]);
async function cleanupTemporaryStarterFile(temporary, options = {}) {
  const remove = options.remove ?? ((targetPath) => fs.rm(targetPath, { force: true }));
  try {
    await remove(temporary);
  } catch (error) {
    throw new Error("starter temporary file cleanup failed", { cause: error });
  }
}
// shared/gameStarterFiles.game-generic-v56.json
var gameStarterFiles_game_generic_v56_default = {
  id: "game-generic-v56",
  files: {
    ".gitignore": "d4466616905c9563b7928f929d65d9144a478dcfccc8e30f3b4b572e6e7ed5e9",
    ".manus-game-template.json": "6eb109146204eb011dc49b21864695405362d11bea6c3c842732c3c61c33e50e",
    "README.md": "f3b935f88eb499ef4c876a6035972f8fd1ad14eebf84ac37cf937969870044ac",
    "assets.lock.json": "23e250a4ddcb29a5af336fb01de5fd437ed6c296854e2e8ac19c355714480ff2",
    "assets/template/characters/runner.png.import": "bbad8b049fc9b9755bf3aa36f536304a3ece46073b46f5b1b28266d78e67095a",
    "assets/template/characters/sentinel.png.import": "61742cd4700daf4213b4df885595cba6377893144b925125f15daa149f59cdc7",
    "assets/template/environment/backdrop.png.import": "2b03ecfd8a9d7ec82aefd82c4570b94f4a5a9119e8398460e59b55ff5fbe69d5",
    "assets/template/environment/foreground.png.import": "9f0a8098a4cb363ae349495afaf7c1e98e8e8064e9b8115e60b7033bacf2608a",
    "assets/template/fonts/Figtree-OFL.txt": "140d37233e7f3ce7313798befa9600893bcceaf41a55fa0fa5ad52f7f657a268",
    "assets/template/fonts/Figtree-VF.subset.woff2.import": "81d2b3db00475943c0c20384aeaed2bd8aee858cf488711ca455872f0804d78a",
    "assets/template/fonts/NotoSansCJKsc-Generic2D.corpus.txt": "bb65dedfad824f07a8cbc94af30290bcb3fd190491bae1b3e643fd81eb7cd293",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "b16160761ddf523042abd3bc5be8e304a8636e00c3f70180504459c0c840894c",
    "assets/template/fonts/SOURCES.md": "c6ecad64b823b3e3650bfad27f67fa26b1497daac6e456cc453e1308e8bc65cc",
    "assets/template/fonts/display/Sora-OFL.txt": "ba0b9729c9428ba79a0459ab8ec575791b51509dbec213e383d0316d37fec299",
    "assets/template/fonts/display/Sora-VF.subset.woff2.import": "17b1e275ebdac01bfd6df014731fce385b8ba844c29e7ecae86638c58c12907e",
    "assets/template/fonts/display/generic_eyebrow.tres": "585674422fbaf0e1d60b3b534235cecf3140c89277dc717b5b9923a56a5220c4",
    "assets/template/fonts/display/generic_heading.tres": "ec0870112e08f1e5648cb7cfc6cf2017a5a673df411934f051fb27b8934b5835",
    "assets/template/fonts/display/generic_menu.tres": "11c9d47e5c9527e8e051c64f1dd9b7f133cd7dec3798e60175908d2ae6d5a9bb",
    "assets/template/fonts/display/generic_title.tres": "4067265988b7c9a1e8c5a37d601329532abaa1128e42caaec546f2d998d60b2d",
    "assets/template/fonts/noto_sans_sc_bold.tres": "4fe67cf5a23d3039b97790cdc97480294b719ce9f75492c678ee3e259f69a8d9",
    "assets/template/fonts/noto_sans_sc_medium.tres": "c7a8cb16315fb6f59d85fbd08ea3314421bd6642b9335b75e9751e66ad9864ac",
    "assets/template/fonts/noto_sans_sc_regular.tres": "c6c7da630c0558aad40dd716f561b3da13b0a6806b528d869391ee96909740c0",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "e7543263ad7d756af91b27be83dd72fe3be6a6e1f9ec2d2074f7fb1d657e0ee9",
    "assets/template/fonts/ui_medium.tres": "895ee677adacec5553f3af9aac64e291ff58b85922bf7c577edeec9af4d25e3b",
    "assets/template/fonts/ui_regular.tres": "04b459a8ed9ac7467b3671f57fe574fb8e244b0b122a6ea016f812b84f64cacc",
    "assets/template/powerups/energy.png.import": "17312c18fc75cf67f74684302f585aef2b249c057fbea3876d21e5d30f89e4d3",
    "assets/template/powerups/magnet.png.import": "17350a4ee783681e0e15e4267bb4e24774290fe7718466860636a7e14bcae7cb",
    "assets/template/powerups/overdrive.png.import": "93e2f08f68f7e10981a386818f851ddaba5783b08f8cdd3aee26a30553b8baac",
    "assets/template/powerups/shield.png.import": "72f0219fb804a963f304020cb34a66dd77ffaba14c7644ea9e4390abb717cf02",
    "assets/template/powerups/slow_field.png.import": "d75680905babf1da5485f497030fdcdd3d7873eb08622ab2c5f6ca14586c6975",
    "assets/template/provenance/AUDIO.md": "63fdaa5e91c553d0019a373b42d07ff1f8517b03c1aab43419370fbc79cf1a1b",
    "assets/template/provenance/IMAGEGEN.md": "2e9ccad2167fe99809ad23474151c8edd7f2e29af2a501f291df1fc825f8b9f2",
    "assets/template/ui/loading-background.png": "16dde3061f4e60802f8f0d1a6b875e72b6add05192237b03fef1fd313968a13a",
    "assets/template/ui/loading-background.png.import": "83a03983fcf51fdbfc31cd8b2c9aa89910fdc7f484ecd1112618dcf578f772af",
    "assets/template/ui/pause_glass.png.import": "7b56a8382cbd951a3003251be177ace5ea7a64efccef8fcf1d7a02f93633ad23",
    "assets/template/ui/title_glass.png.import": "cca989225b6e26d3cdc1d52c89eea7addf5a9b089b5d185e64f17554a8339ff2",
    "autoload/audio_director.gd": "a8f2a60837f4241afc2c1cfe4756e993a631d2ff8f9e1c3f703b81ee972ea1d8",
    "autoload/audio_director.gd.uid": "44d11748a40d2efcd0d0a9ef99c475af618e99b6804b0b528685e800d34ade5b",
    "autoload/i18n.gd": "f98f8829bbc302794f3d50e32b92f8881bec58a9fa777dc1fa16a228c4f96b69",
    "autoload/i18n.gd.uid": "6cec4aeaa1f633bc324f1509964187539a57103ae874ad421418072735942ff8",
    "autoload/manus_font_theme.gd": "08a1abcf2bdc4c85f6d1932030e9ffb2c5b856521df2bb98cb2c08d8fb7d17d8",
    "autoload/save_store.gd": "64552086feaad9f7e57027efd25e6d2e9a4e3574fc860f68598a957eef8a3e18",
    "autoload/save_store.gd.uid": "f9b27e52a56257ebca2f6b65ec7bb06a7e23c97a4bbb061ea589d591e6593b39",
    "autoload/tuning_store.gd": "fce3427919aca9411512c8ada12b6b438c25e3d17033ff3dad2d4aadad52c9ad",
    "autoload/tuning_store.gd.uid": "b2f0fdb38316fe788df976aca23da6bd8d0444946ea49be6257f20f8160691f5",
    "build/.gdignore": "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
    "config/tuning.json": "ff507cb64a3ede97092b28025bb23f16ce355649cf4ffd303337ec36d8cf6866",
    "docs/game-multiplayer.md": "55d734144c19a07ffe3bbe02bc7b0100cc0e3ffd5d044ef1423d58416ed0cae9",
    "docs/loading-art-provenance.json": "53d091e3a0e3a90aa9ce2ce6d15150f94c3ad56f2cfb0540376548d32ba36d61",
    "docs/minimalist-redesign.md": "462f068f99ae6fe085ea9ed23f79f9d9e49f8095ed2ce87766947e75c9ecde1a",
    "export_presets.cfg": "457936446ccd30a1545a4856682c31238c02a2aa9bee628d15cffeee1e178af1",
    "game-verification.json": "dcb58f55daaf55b82885e23126fe9ed23e5ca3690ee9d544d12b8c9eca26006a",
    "localization/en.json": "5116203a4ce27d024798014b86938b3d1fd788db0a02eb0f571ec6e34369679f",
    "localization/zh-CN.json": "ef3a16977f0fde769c10a3f8d8f84c1a990bf5ef9dde10ea8dabd2696cebbb9e",
    "package.json": "e5285ae24c86d5b23126af1339ef9d560b89fe02c6cba7dce97f35cc19dc1d41",
    "project.godot": "c70edb2fe986069cab7a9e58b4e92667028ab073d9a49f7a8062a77e4e226ddf",
    "scenes/main.tscn": "2c2f3bb1b1a610ad695f4a05dd6012033ce6dc0c6a158824d4d7db1ff64ad5f4",
    "scripts/effects/effects_director.gd": "d74fd779c662a51826b39a02640154ce2782994ea472e17a7af1ae51fb5e278e",
    "scripts/effects/effects_director.gd.uid": "77c9979a4aef569593eac0e4d9715d848db987c19744e30eb4a5934b39fcb2c3",
    "scripts/entities/runner.gd": "3d5e479b051255525dee91fef3cd5c73f240652a034726046703c3592cc837a7",
    "scripts/entities/runner.gd.uid": "fe4b52d9a88e158037a1d9ea55255a7199689c7a7a62561b18929ecf7f8657f6",
    "scripts/entities/sentinel.gd": "1ce89406ba6a7c80bb6fecac1b380d9c19eb8f76a3198c63f3b550230709397a",
    "scripts/entities/sentinel.gd.uid": "6dcbef6621b7faf4004ae1fcac89cea05aa2e1321e91bb9f2cd6e86637fff8c8",
    "scripts/game/maze_world.gd": "2d4e883cf4ecd7e31d320225b3ef3c917c57c94cf3ba12a9555afff5473ca413",
    "scripts/game/maze_world.gd.uid": "1cb8c791c7e139a6fcd26084c83a2204cf2d9e0d2ff5ec3bcbc417ad40da6673",
    "scripts/game/stage_catalog.gd": "a4d6c7917d1536c6d36b041eb2c10fec5a775c1a1f3ec0734125706224e0e66f",
    "scripts/game/stage_catalog.gd.uid": "c6241397405b9983302b0aac0c0a86b1622f1beac9d228539083576cd9e05bb3",
    "scripts/main.gd": "c3e3f166f79157f920023fe5a9c03e6ce0286d11027065228c7a8b7fdd525256",
    "scripts/main.gd.uid": "aec5eec5c93acebec914a186b8a02aeea46038efbae3ae0b278475025d1de13b",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_player.gd": "3dfbe63c26ce47cd41a1c50c94ad1bc51eb99a3daf494cec3aa81d123865de5f",
    "scripts/manus/game_fonts.gd": "8dd5317e8277d5e548cf6e93210a8d306e1e0c11107067ec936aad5385c0345d",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "6a1e4a653bbc7fafac8fadd709bb4fefbd8dc07d87b2abed6a6f2e6f9cdc9018",
    "scripts/manus/preview/tuning_adapter.gd": "9d067ddcdd0782e9f937cf78a2ff4c43a15a6707b2b160991e4d9552a5d06e84",
    "scripts/manus/preview/tuning_adapter.gd.uid": "0847490ed2147b2a6706213f4b45b3374cfb09b300c9275a70bea7f50f3f46ca",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "21ee9ccd197f0351b167bd28364f1c7c2406a68afb6841236856075bc88da695",
    "scripts/score/run_score_service.gd": "3f6e2dd65d367d371732ec5fe7205aca3e77013907dc6d828e5263458ed66adc",
    "scripts/score/run_score_service.gd.uid": "830240c67dc9e88dcf9826de9e1883f1ef1773b9e8eb497b21df9c5c2c9069cd",
    "scripts/ui/arena_frame.gd": "abe47c76120a88288e17ea71aa1a17bc51e641b216ec6d2e933b2931931e3c97",
    "scripts/ui/arena_frame.gd.uid": "2ff22d2abf656872a4908f77fcff8a9917ddbb7b3f3f721c8852d462211a41be",
    "scripts/ui/menu_list.gd": "c84d843fdc70be370277de46915f5bbd3727e295738c77b0ba352dad4f66fb76",
    "scripts/ui/menu_list.gd.uid": "67a9545f9bb78a14d56ed54d6219d7ae1bd4239d421accaece3ebe396a693556",
    "scripts/ui/screen_factory.gd": "0f13661b4cf821e3240e4528228793e106fc9d951ccbce569d10ed20d33fbe14",
    "scripts/ui/screen_factory.gd.uid": "b59e92ffbbb2a8e5e1157181933b29e1a94a5aab94dac21746f08a896008a97c",
    "scripts/ui/title_art.gd": "7e40b67b3a91e6bab723ff4bd4c0db73dfa0734c771387483a51cca07610963e",
    "scripts/ui/title_art.gd.uid": "c49a79507dc2a528223780703114446945b29d5a7d9a3529c7432e5b71e385af",
    "scripts/ui/tutorial_callout.gd": "3793b809ae71b6c0788584f152a3699259b870eee105f10847595be26d950827",
    "scripts/ui/tutorial_callout.gd.uid": "7fc1ac041bb65f6048779961f1efce7f03db747968e1c0fc3855cd88fe57c335",
    "shaders/arcade_filter.gdshader": "d7e8c81c94b15dba3a968821d0bcf9da1f91fae4ce0414ed949128c195e1d30f",
    "shaders/arcade_filter.gdshader.uid": "67b9c1e0103203879884919f57813391a9f17426b90a90c798337eae39c73408",
    "shaders/holo_panel.gdshader": "e36a55da90e247da23b0402714f10941d75c218c4621e499783a177c3cecb6eb",
    "shaders/holo_panel.gdshader.uid": "ef8b981fd4736477375b15a22c7c7a1810ded78359cad97a8f03824945ff6672",
    "shaders/logo_chrome.gdshader": "aa7b4bf5971146fef29e78a53a74c724bd363f038eda9db390fa13f370a4a91b",
    "shaders/logo_chrome.gdshader.uid": "61a03cf77dde3560fe91622eee86c50e558ade4da1db691aeac70cc424dd7dd9",
    "shaders/modal_backdrop.gdshader": "470264239f4f7b7a896230ece660abaaeccf65b2c8bfc0cb4ac2c48466a8e2d4",
    "shaders/modal_backdrop.gdshader.uid": "7632c09518a22cd6f22cfabd961b0362299826a1b13a61794c71b06d9f96cea1",
    "template-provenance.json": "5290da9f7d173a80b3efb536c799fa8d7237fb8ca79ec55a0cc9fb1006ca33b1",
    "template.json": "f3f9a0f3746f10687ea6903f8f38d17e08e4efc3f2e978cfe5ee2d3b98aef2ea",
    "test/test_suite.gd": "f22002616c3ea427f82495526a984734e9fd7ff368e7a4ab123bb2c10af1c108",
    "test/test_suite.gd.uid": "535e2375d60b20e645f018f4fed693b4e3eb1bd2975c4efd21546780230a5262",
    "test/test_suite.tscn": "da3e7e85de4306ee4688ef157b7c9290a8d03436bb084a997a2a0506b40f3314",
    "test/tuning_bridge_contract.gd": "be084484b675a6bd9557be2ffc3f8bb0bcdd8c388a9e79b461ae4df387e909f1",
    "test/tuning_bridge_contract.gd.uid": "52c4588d95e3ff7be543ed2237cd1685f0d7127d5c31f33f4cea63e4e5b7c75c",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/build_cjk_font_subset.py": "5e4f8032f2a38341e912768a5402dfa050043e562ca92410b201db96f4c7b1cf",
    "tools/capture_native.gd": "96e9660dc0c413b1a0c670c7b4efb76684accbf0cc1694d5b9ed0d2a6be7954e",
    "tools/capture_native.gd.uid": "f4b417256b9452aee391669a59f02506017da12b81bd1438004198e94baed976",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "tools/verify.sh": "1924a5a179755f62e7b8b676d3becb8280ac3ba2b2148a6dea1ea9c5ab1485e1",
    "tools/verify_clean_scaffold.sh": "a28c724bc34d9c5e511bac9edbaa2d9cd56c583716e3cb935247736b3c606a3d",
    "tools/verify_exported_pack.gd": "1ace2038b12319ef2d3538c82d3c20f3669a35cc80d00932df8104a913ec3666",
    "tools/verify_exported_pack.gd.uid": "e5973a18b1fa1a3c0d5ae81d2a6050d08f95b9bb819e458b310268945f445467",
    "web/loader-cjk.json": "cd50bcd0fe25528ae3fe6f8e416b2f29f73b17bd2065ad7a83f334b9db52002b",
    "web/loading.html": "4942dc637e6019bc6358236c855568b64ea3674acfb23d1f35515da6049ed15a"
  }
};
// shared/gameStarterFiles.game-platformer-v62.json
var gameStarterFiles_game_platformer_v62_default = {
  id: "game-platformer-v62",
  files: {
    ".gitignore": "418fd0aaaf0b0eadf5f8967bbd1007b51a01d93580cb35c596ab201b8b9dafab",
    ".manus-game-template.json": "6bc116163839fb002cb19ead52866e2ef06ec4c874332a36fe92a0c981e0c7f6",
    "README.md": "2e2c807e1cb9fc0508664770d001e2ab056f0347cb14b08acc33f6768fca68cc",
    "asset-provenance.json": "9886d4b76c485375453868a877b27caa498f324ed399da0d540ffa2f20dc0467",
    "assets.lock.json": "a1655d03c872a22a0b0c86f33c2e210d0182497ccd584f46f51c912a347cf9c8",
    "assets/template/audio/bgm.ogg.import": "0ea4dc56a3621807cb33e060db3a891fb9c2abdcdcd7b5c2a6a0868bfd76698a",
    "assets/template/audio/checkpoint.ogg.import": "13df3af2cd123771e7ee1c0604b4f053ba7b3a4966307b6886ba1713379999ca",
    "assets/template/audio/coin.ogg.import": "c0b5344e4ac15752d0ca77749e1b5a816ac702e15194233d52922f447dafa555",
    "assets/template/audio/confirm.ogg.import": "f7d5acf9bb9c6beafaf6f34090bc7e21856448a83bdb8bd8fda52d77f56de855",
    "assets/template/audio/death.ogg.import": "5bede7cea33711d086b577493ee99ae417cce828a6c5d0539cd28af35b99bff5",
    "assets/template/audio/jump.ogg.import": "cd8d9759b0c0d3d0477cf5abbc916547c605a96910d05357ac03eaee0bc120f9",
    "assets/template/audio/land.ogg.import": "a80aabc566186b53eff0a3ca9f6eac7b5f12f0aa52d0f6bc6c5ff47fe4341219",
    "assets/template/audio/stomp.ogg.import": "cc8e859298353601dd07d511fb8b10b6e7a98888328aa6006d121513ffbe8a81",
    "assets/template/audio/success.ogg.import": "23a7923c807237dc99f5fa2d4342ad78dbb45321d59fa718ca5a510d28ab0c0a",
    "assets/template/cat/cat-tree.webp.import": "79d37c67bb9bf8a0c6b17c238c171864ed863d8ec1363277b5cb1c58407132fc",
    "assets/template/cat/felt-ground.webp.import": "27ad349fa8d36a45bad2cb35166fa027273d1c50f7a999ae26a7ec210ad0cf2a",
    "assets/template/cat/felt-special-block.webp.import": "f869d308c3daa06476b5fd2e79fdcba78ce649ca8a739050cd88796173d3e984",
    "assets/template/cat/fish.webp.import": "13ea40150905a1791a3c3d96789ea9cb2ef2167cc6054ec82fb2079e41fc4e76",
    "assets/template/cat/idle.webp.import": "ed1f94a522db36e22c75e38a7378bc2f9d1532d3d699bd97e47d6baaca136fa8",
    "assets/template/cat/robot.webp.import": "85c70e06861576659d75ec1911cc02bdea8a0bd42362ca837a9c230fcc701d69",
    "assets/template/cat/run/frame_00.webp.import": "d8c4bae91802e86d81a0059e22a7496b74456cbf0205f29a8ab668a909b496b7",
    "assets/template/cat/run/frame_01.webp.import": "767d7951804ddaf7ea43eab0cdb524987b22152a379063dd5c7c7b3be4c55dd4",
    "assets/template/cat/run/frame_02.webp.import": "6e97fd05acf21741706112c617cd1356ccf0bf85a844f5eca3aab5dc415d17e2",
    "assets/template/cat/run/frame_03.webp.import": "45d6c0b0d98d494926252cfc18a167976611a2800f22240b972d3dd9441bdce9",
    "assets/template/cat/run/frame_04.webp.import": "6aa79fff9bfeafd932c2bc7557f8b0e676b545096e65b425c7b7647c833d387c",
    "assets/template/cat/run/frame_05.webp.import": "d2f801f551c2fe559fd613d6a9156b686f28e89fc553d1aa660afa5addd0203b",
    "assets/template/cat/run/frame_06.webp.import": "c67462a6363f9d022b36bcac8ce1be4311d2d894714965b9a6237c0b56d315ee",
    "assets/template/cat/run/frame_07.webp.import": "4ebb353004bd9ec9fdf7564a09a64801dc15a7226fc18c3a7f375913640eed93",
    "assets/template/cat/run/frame_08.webp.import": "c0492ef88d73b5caa6a103dfd016c4df993dffd93bc06f8acb4861b752bbb082",
    "assets/template/cat/run/frame_09.webp.import": "89a567838cc42e0a1e55a5efef75e38b6da1a252c3e3796342c7c5921f0c7ce0",
    "assets/template/cat/run/frame_10.webp.import": "088bede5442d1e7c7c7d291a12d9db1c513883425395c8a9234234745107df5b",
    "assets/template/cat/run/frame_11.webp.import": "e1229ad9d3755736670a6f827fb2a1517af2ff202341d42be1ae13e40577f76a",
    "assets/template/cat/run/frame_12.webp.import": "36d8d13ab1f5405c78539880b91ab857c4c5750b01da5d4e09a619b1cff59343",
    "assets/template/cat/run/frame_13.webp.import": "1344568e09f465f29ecaa40c50cf545550a6105a45b22877d62e9dc0a6c6276a",
    "assets/template/cat/run/frame_14.webp.import": "78615e81fac20fb3f7743a0675987a29ff430e8bc13ec698bd8d71286e48b98b",
    "assets/template/cat/run/frame_15.webp.import": "f30e18425d468e823999d8d5fddd14eaa8c43d010c8414a0580c433b204c7ea3",
    "assets/template/cat/run/frame_16.webp.import": "1764464bee190c7b152219aef0f1ca916d1b4ef3a0f5fe805c5ef206e4b368af",
    "assets/template/cat/run/frame_17.webp.import": "e4d73ac8792f7d2fd8cc663dece7c08428d7087ea0137b78ab1a2a4851d1a803",
    "assets/template/cat/title-key-art.webp.import": "5ef2f59034c1ca171e882b7c7d55ee25be3bb2b57530939173372c0aa8bfc29b",
    "assets/template/cat/warm-background.webp.import": "8befa995fe8121ee62d464b932409a4b2e090b10346ef4cf3eafe815e50aee89",
    "assets/template/cat/yarn.webp.import": "061dfb67db2802974625706422233113c0de9be30a16b75e1d47cc015296c1b3",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "f0a116c14597864c6111676b040488d39b272c90864bfb4ee8bbb87c188dead8",
    "assets/template/fonts/Nunito-OFL.txt": "580df76c95a1ec5ab878ceb25bb3d85c6a076804e9c970c8c6972aea775fdf65",
    "assets/template/fonts/Nunito-VF.subset.woff2.import": "20d4056ccdd562d30aa53c959a45a5b8dae87e74ad3951cac718a974ba17a96e",
    "assets/template/fonts/display/Baloo2-OFL.txt": "ad09b05dc8bc678c9daf7c4c5f7ef1f55e5726127f4330b2e98e40b9dffcb860",
    "assets/template/fonts/display/Baloo2-VF.subset.woff2.import": "0d02e7e596bd28b359d662efa7012c89ea5d6bda6e5f29bb17423a1060b85b2f",
    "assets/template/fonts/display/ZCOOLQingKeHuangYou-OFL.txt": "f1bce31b817dee01c1e4ef8bc45d8ecb95f01f4abbf0a985007cb3cd0fd8123d",
    "assets/template/fonts/display/ZCOOLQingKeHuangYou-Regular.subset.woff2.import": "639134bafab3066c88aa49eef4cf5f707e7b132714e8b44b3417d74c91282995",
    "assets/template/fonts/display/display_heading.tres": "a38c4170efc793ac6c94cab2e414e33737925c5ff87cc94eeb7e289552635261",
    "assets/template/fonts/display/display_small.tres": "7437ca905d31efddbc5c7fd8b4f9af9e28eb98a33238465cb1e56bb4f06f26c3",
    "assets/template/fonts/display/display_title.tres": "39fd40b637586ae68683e7cf33534a6af21a7a56fb96618dfa5bd94802f1eaf7",
    "assets/template/fonts/noto_sans_sc_bold.tres": "ee74f7ca2a61928772bfa02d5812879dc1a2d4caabf623de0879d25828688ec1",
    "assets/template/fonts/noto_sans_sc_medium.tres": "6712d5035f4aeecb86c652cf5e974f35587362a53be50505c08f5d8f5d5118dc",
    "assets/template/fonts/noto_sans_sc_regular.tres": "b078461a72ba925aaa208eaac202896e88b9f0bd3cfb3d8e15eb7acc3bf25fba",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "40713fd25f2b85bdec30c20ac66b7a329fca33f7024a4bb4767ba2ce3b40d0a5",
    "assets/template/fonts/ui_medium.tres": "8817cb97c0de1e31566bca7b187be2a58e7951cbf7848a64822938c5c0d7cc01",
    "assets/template/fonts/ui_regular.tres": "9f8d48d81c88fc04ddc6a92ff9338fa8e080750fc3e566e6ead2120a5c572470",
    "assets/template/generated/foliage_near.webp.import": "a9225ac46ae28756bcd7ea968b008ffd5cfd0dbf966b6693aaa3003734b7b55c",
    "assets/template/ui/loading-background.png": "3b4b158f93a3e6fc6f866f1b121f106b8e178b2a68a44a2c1dba46cc4c76947e",
    "assets/template/ui/loading-background.png.import": "9abc4a14506b6b497e9bc36e7d1ac29b68fbd3d95edec8671a0fae06c9e54fd1",
    "autoload/i18n.gd": "589aaa4d4ae3eac0e66a423e67e59506db1d12502fe3981a4c0ef20f7e1d8b5c",
    "autoload/i18n.gd.uid": "79315ede2602e22fac8320e05843fe44a25f8e795bc312a3932556e8b75be6dc",
    "autoload/manus_font_theme.gd": "7b0469bda3bf15aa55713bc8c37f158ba32bbc214b9712c118b1e590a4faa6e0",
    "autoload/manus_font_theme.gd.uid": "2aac70bafe2d23401b20b2a79d534a2c5e89aa2455f84af2eee526406ec60fda",
    "config/tuning.json": "a149d1db8c83368cc61454dac83e3102ea3d78e7040284d3fa9a255c13f14ea6",
    "data/stages/lofty_lounge.json": "03dcef55ff6a711310270cb3676367c9de7139991fdbd8d035a09d5236a127e1",
    "data/stages/sunlit_nook.json": "ee106944fd90bff40bf60b7856956d32dd6a43bebefe4055ea419ea8b40dbbfb",
    "docs/GAME_PRODUCTION_PLAYBOOK.md": "c19fb138839356676f9eb14c18e1deb69d02323914cb6fe3d497c10ebadd74ba",
    "docs/game-multiplayer.md": "af4dfd273e65ff5a1a547b7fedf5a61e039b0f8305e5415962533313eca3ad68",
    "docs/loading-art-provenance.json": "1eb787d36338767e78f7629cb29271fc96c199a33699a5ef0a2339dc15084796",
    "export_presets.cfg": "f6298233ec468492652aec7210a81e8963a5785e4e8376916823f87f7043d252",
    "localization/en.json": "3aa065fa7d830b57f6dc832b3c805f8f92116bf6671317fafcfb7c533a9dc6a5",
    "localization/zh-CN.json": "1f60f2cdb1e6f016c46568b9307a4ddc9de159177ee9c90e990673ce1f4d9a69",
    "package.json": "22a8cd114c4854b65fe0655eeccb0242e7b6623a682ad4629ded6a98678ab162",
    "pnpm-lock.yaml": "17c814b167307942d3609c7b9d916ceddb85839573ab39baa114e30edb132a1a",
    "project.godot": "1a9a42cc5d4f8d89fabcbb5b29a008baa4856c9201836cd9b4673c3f66e130e2",
    "scenes/game.tscn": "7281aed6166b68fd3305375bdbba64fb9890dd98960541b5cbdd906c6b9e57a1",
    "scenes/title_screen.tscn": "0d0090a8b8dcc9288a13c3e5b1613c26d7f58f5cd416aff5b1b06ed85e060f15",
    "scripts/audio_catalog.gd": "dc8f4f8a2687f3c9a9d30485a24a550d8cceb7e69898b0e4c822ccb7a916f67e",
    "scripts/audio_catalog.gd.uid": "917e7d3f1e1990347e571f07b13c2f3e3931f2679fa1d2ca93b693bc8b2a4bb5",
    "scripts/brick_surface.gd": "f8218c50abadb0c1f7fc7f259b04f85649557f8c254d67e1ff6285c0134fbfe5",
    "scripts/brick_surface.gd.uid": "961db9768e23a908a27f67925317c6e92318548b753d3597d5a3546e3d74b52d",
    "scripts/check-audio.mjs": "b0b9cc92fea946db5f0bf9bb84e2662e191e9e31caa506d83baebaefc20dd07d",
    "scripts/check-exported-pack.mjs": "17a80af4cb0c7fabc9f94bb21d3ae92c6c8e3f5a896271eb89397056f07f4291",
    "scripts/check.mjs": "62e2f5c876cbae796c68186be7fedb92bb4176ee015d3c29357de8083638774e",
    "scripts/entities.gd": "84a39a31550fdc861e4104acde263a81fcb1c0b955f2a2d892d1b123d6e555bc",
    "scripts/entities.gd.uid": "991cde16f6a1dc417126231a0528cfbf11f1f8f5768ce172d85b642be5b92d2f",
    "scripts/felt_kit.gd": "f6e6f2e3182c272c060d283a3270df33e70dfcb76b356a5e82f0f4febda0447c",
    "scripts/felt_kit.gd.uid": "ad5e5bc1862779118a84e0c875e1072ba4d928b70640b2c42b978b4213efd6a1",
    "scripts/game.gd": "5f9aedb6415fdbcbad323760c8e7242af90e322d5c3713adb7987926b80127b2",
    "scripts/game.gd.uid": "957e2361a12d2d713db7b1d7ee6f5796ca1ac45d72bffb492a2ff9923dbd37f4",
    "scripts/game_audio.gd": "46497132997ee2bfb70276895d457a4ec46357c7ecc5b40a870a63d2c7fc1ed2",
    "scripts/game_audio.gd.uid": "458bcc9b07bb2af42c0ff4b88f802d310bd12d5b02ed7a51a5a355db1f150356",
    "scripts/godot-check.mjs": "cc2ead5ca58f5e27b07448e6946a1f7c1421a1efa2e87d118d79045136d183fd",
    "scripts/leaderboard_panel.gd": "c8aeb3df910729abc9cacdf532e060acf4f67b14cd446f4ea8f96847b2c36ba9",
    "scripts/leaderboard_panel.gd.uid": "1e2f6bb25e0218a612e745660821443aa05bd0dee70aa3353b31e6dc717dd5f7",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_backend.gd.uid": "c47c0e93d53914479b80a23947f5b25e7a11c2188d2a79605a945ff7c544ecb5",
    "scripts/manus/browser_bgm_player.gd": "3dfbe63c26ce47cd41a1c50c94ad1bc51eb99a3daf494cec3aa81d123865de5f",
    "scripts/manus/browser_bgm_player.gd.uid": "5102203696501c5b6972a10b8d89334b048ea237cc54cced935d39efec45d4c0",
    "scripts/manus/game_fonts.gd": "bc39a5bf9a228ff9df356a268b0cd39268f24e7f305da52b6e4198bd8953a2e5",
    "scripts/manus/game_fonts.gd.uid": "385792c5cfc25f40559a2e88bf066c0a78a0040eab88965087f3773564fc6693",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "b3d28bf70d19ebab1a9c9b39f55820c20ae59b7a4ee1acd053ada11a4db98135",
    "scripts/manus/preview/tuning_adapter.gd": "7958d8d9aad46ec0874eb995f48b1f8839dd7632a045a41868006fc51533f919",
    "scripts/manus/preview/tuning_adapter.gd.uid": "59e0ac1a7557ed8d12dc3a8d63a1c1af459479b558d495934e8fee178d234ef0",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "f6610e7c3467468440934dc2ce2082b8880b34b72213ce42b66d50203f414f7d",
    "scripts/menu_modal.gd": "93ae53772e2dfc85f435e041ae3b33256ba66f718550ae370fef47fcc3f6bf23",
    "scripts/menu_modal.gd.uid": "94b750a7eba00adb0723d4e65db6f52bcb5bbefdd807d320a34e30c7f952dc0a",
    "scripts/menu_style.gd": "63e02306d066b2cd0b63a73d55280c54900f83d107b320c533e450cadb98eaf7",
    "scripts/menu_style.gd.uid": "b5f10b1c2674d6f35848c2cd76d75044670c473065434bfcf252b3a479437828",
    "scripts/pause_menu.gd": "8c9fd6058b45e9b1c6e6fdce89806db4b50caed865c579cda54f10b554af9085",
    "scripts/pause_menu.gd.uid": "6dbf53474cacba50559608f574a91bf0bc327bfc2bac42c1bf7ff2c434632123",
    "scripts/player.gd": "955dc3433b551db5ffe2011bc6bf395e4f2130886a525a42cfd20d6fedb77a3e",
    "scripts/player.gd.uid": "1bfcc7dcb3a7cab469f80ef5a63ee51d07940f6840ec5bd388bd30d74356d2ed",
    "scripts/run_score.gd": "21c2b56f6ef558d96047224170ba137281179444ff60bef2163b9acf17e26bef",
    "scripts/run_score.gd.uid": "a489eeee8fef6f1a32734ae4e19c656249c7c10676390186f2a7f547c31f7bf5",
    "scripts/save_store.gd": "239ef08703e10ab1135e31abbd97f09def5e1cd40417e0d5d56ef40219205652",
    "scripts/save_store.gd.uid": "0c24891570d033cd10bb05d352a11cba400e23fb22750b71914415b211d5119f",
    "scripts/settings_panel.gd": "648f599716fb9bf4aa4fc29e85ba685ac11e22acc99bf529784c33628b188f9f",
    "scripts/settings_panel.gd.uid": "5f2222e1826dc8fb1a9edb961f00a391187f4c064bb7bc823461c82fdd060f8d",
    "scripts/sprite_grounding.gd": "3f1c31dfd57b736fddaf2e7129f4ff637b165124161ac711ee031ac3ae111824",
    "scripts/sprite_grounding.gd.uid": "fe50fce46048ab15972a424c4d1c7cf4e56ca401907174b28242ddc60fb14a54",
    "scripts/stage_catalog.gd": "c24ccf25bb54866ea7548faacbe6959a62753e4aecdc1f635252af06f2b834af",
    "scripts/stage_catalog.gd.uid": "8864eda3d3579fe2e96a90f7fbc3fb6a4da2dd656106284e03a1760e3dfee4de",
    "scripts/surface_finish.gd": "9ab431b8d286b1518fba0b9847832276e5ed61a7f3f51c3be16802f2fa35dc52",
    "scripts/surface_finish.gd.uid": "6ec7d587efe6ff886b57b3a73e014a45dd644ff4c4e6dfd94d19cb4be3280964",
    "scripts/title_screen.gd": "873c1972126b2fe16dc6469b0abefbe87aa8817de7f3fc8b86a645073da22cea",
    "scripts/title_screen.gd.uid": "13abf4c54283bc9c3cb8f9e8bddb260134cd2827500daf89228ff227afb3b8cc",
    "scripts/touch_input.gd": "cfb50c0f4459560456461cefcbe851ada72e7d341255f60983376ff19194b4bf",
    "scripts/touch_input.gd.uid": "cfc78af370f9778694505b30ea9cb63eceaf74ca53bcbeed1c280a58daa5d697",
    "scripts/tuning_store.gd": "b6b742311007b1159010db944e241b9c9cd9a79af40b410933d57a4582d74e4e",
    "scripts/tuning_store.gd.uid": "e6c07bec565dfb471d32077259f1096fa2549a965f613d0f741e77a1f821375c",
    "scripts/tutorial_director.gd": "03b16472e93071bc3e6d021708024a69fe8ac7049d172ea0a72e32743a103642",
    "scripts/tutorial_director.gd.uid": "649b70992d7d42081c402ed8d14a6ad82e063ea05b3b9dc8e6f96a0084164cdd",
    "scripts/viewport_policy.gd": "b25b84c751b201f5c66824a8fcdf51dbf6d005f6ed476063cb83aa25388a322f",
    "scripts/viewport_policy.gd.uid": "ad7f0f1a5b661fc4c10318f3cb071c916cb3f287cc1bdc3e91379a06397a50cb",
    "scripts/visual_effects.gd": "68e77956f5d2c679dcda16e381de665c0ce5b557eca1a01fa7b4a2ec1a9cc53d",
    "scripts/visual_effects.gd.uid": "2eaf7c534e247733c276acbe7a65984877ec03ba2187f4cbdf463977ef08f0d0",
    "scripts/world_art.gd": "7e41571725853f9dd057b7d8528a343035cfa7becf49d4eaf2d1d3c3b8f1c3c8",
    "scripts/world_art.gd.uid": "d3c07d6bdd4c8b570123484cc17aa07accc03f0647c7d2fb6434e22d99df81ea",
    "scripts/yarn_ball.gd": "c217051542a32245cbfaa1b58851b52c966c49ed112d2c491dae69e69d999fcf",
    "scripts/yarn_ball.gd.uid": "3db690f5ac3c14497f6ac850a418ad7d3ea3e4118d8a3398ffccdff1ff07bcb3",
    "template-provenance.json": "62aed0537594f123c2fa199ad6f746091831c44f7198137855233d1f79b699bb",
    "template.json": "8f0c9fe6d1685fb2ebd8b8ad90447eab5d51e8a543722f39a46212ec703aa727",
    "test/acceptance_capture.gd": "0fc940bdc1117c4c46c289853f597cc6c99fee9495b4e1e43dbd7310ce77b8af",
    "test/acceptance_capture.gd.uid": "1e9b8e1d998f8d4ea48581f64127fb5ba1a1298ef16cd5852bfb854f9de29f08",
    "test/audio_completion.gd": "df8b8175527c74392f03a4daba593d88ba5724b6d99f3fb70ca38605786d5fda",
    "test/audio_completion.gd.uid": "8a7ee1e6ee35203374dac8215c0ccb2d9be241406526cda47fd4a14dfaaa9f72",
    "test/audio_idle_regression.gd": "c5d7c483d54b82563e7f1090a0386e2e0a0edda6dccc18066c649d16c5d334e6",
    "test/audio_idle_regression.gd.uid": "d00cbc83cd85a60fdb1797df50fd5b24c8d4a65d7bc82e1c4e0e76ccd9041da9",
    "test/debug_capture.gd": "0d846edbb55ba2c15b4247842a02e3e6135f8884bc03cd97a69849740ad4950b",
    "test/debug_capture.gd.uid": "972cca4da2fa4e3d77972003a3bef72130cdbdca8883f6a270fd0fd15196b7ed",
    "test/debug_capture.tscn": "c789b22a9f212cf93338eeeabdf175f4b65ddb1a5bdcd4745ec8036076dfff12",
    "test/exported-pack-profile.test.mjs": "808b3a61a3b58cc03f36b2c607869c2b05965d3a46f13b05cd797aeddcb4c0ee",
    "test/exported_pack_boot.gd": "2689cef2ae8a2abae7030a91453c2218bdb4932e2e6f1c4e11b6830d6004d11c",
    "test/exported_pack_boot.gd.uid": "72c99affedc205bd81a23015931e73b78e52bf5d7802862f1046ef199121a544",
    "test/finish_regression.gd": "4041cd66b64b5c3cf7b061e854cc3ccc2fb2e16e46d1cb56a6cd725f978800ed",
    "test/finish_regression.gd.uid": "03f61453f3fa787398a02269ace8fade120b2f80467b8d55185f8704264cfb1d",
    "test/finish_render.gd": "6caf8d481f43a33680ed26361b259cd052012a5736aea03b929672069f92a288",
    "test/finish_render.gd.uid": "d9b68d62c287073fc74845e54bf02c407da3b3b7f178db2ed56d90052974e320",
    "test/gameplay_contract.gd": "11275d9a928a3d95ac241295585e7a5259e6aeb42b69c3ff3efbfb7d1ee05491",
    "test/gameplay_contract.gd.uid": "b08da51a0866ee36601abd64895d4a2d6925ecf07b3cc98d1316cecef62fead9",
    "test/godot-check.test.mjs": "3bbeb3e76f1578a23ce796e2a87d4d54af259852ecad868c934d5a39619a418e",
    "test/loader-language.test.mjs": "b6ae64f655d340aab1274a57f146d389b387b166ff21e33bc5838230302261f8",
    "test/localization.gd": "7e14fe30682b16d9954c0810650c43e5896e3f14b26cbcd6fac8fc45427bf2cf",
    "test/localization.gd.uid": "3a89578402eb8c9b1872c5750938fd13b3abbffbea413e5aa54fe1df8910509d",
    "test/player_grounding.gd": "721184a8d563c85728ea0ccb8c6f225845073f6ddfcddb65bce1ee3dfa41702a",
    "test/player_grounding.gd.uid": "71bb873e67d04cea704b34993206396f9e04d2ea87a3301bf11480995f20301a",
    "test/player_grounding_render.gd": "1d3b637c32a7cf4ee6d6fe44bd903184a9c5e490607028ff6e25c734894a66cf",
    "test/player_grounding_render.gd.uid": "af1d7f5c6fd5f5601b6c52eef0b7de05f68afc9ade1523e375481ae7e3f7d2ec",
    "test/responsive_layout.gd": "4f641b7204e2e2c08b84757603f628d757dd3f32e7f71759824c0a35a94b2f72",
    "test/responsive_layout.gd.uid": "87a9e5e09c10400c89501021851912773f7cf0a59b422330ff18f1e49b235e68",
    "test/smoke.gd": "3e6930f99ce46c5b0084e79b7fac26b2a626e8229c787a44c0b1e54e021efe6c",
    "test/smoke.gd.uid": "0fe1b472b95a52da3f2bf9f48f6a8f0de09242785eb545d973353acd4cc03f6a",
    "test/startup_audio_override.gd": "25d1785c53d06d306d9d4bbabaad9e31dc62a6f349d62ef396152599967e1f68",
    "test/startup_audio_override.gd.uid": "a1d055def79dee30a90f28c8f18f6288a51865d630f39265dcafd0de7d3cfafb",
    "test/startup_loading.gd": "71067b6d648a5b8629cddae8cb3f59e5481350bd86003f8b83478a143cb0eb1a",
    "test/startup_loading.gd.uid": "68d33d3cb4fbc7d571bbc047b584a79a3de756ca374b2edf5d458ea821f3dea4",
    "test/stomp_regression.gd": "797fe562381b576e516f466a26537be6e6833a19fb224cb50679e334e60ac7e1",
    "test/stomp_regression.gd.uid": "82b44cdcd47bae0a0960c4225900536648d989f11feebf5a5374f00e2616986e",
    "test/terrain_regression.gd": "1183810e3cf8e50a1f09740063e121b660931da4e7dcc5a5e88c4ce06d0cd329",
    "test/terrain_regression.gd.uid": "f50ebafd59d601a77a137cc342c7d7276821ac1df5fd254cee9076308b137921",
    "test/terrain_render.gd": "a8952191c9ee71478b65a64561cf878c1884c4e6277a39bdcb58ab5d5e8e1387",
    "test/terrain_render.gd.uid": "7821eac704ea41840301a294c32a9c9550f52c9b8e2ca21f69714f9422680763",
    "test/title_presentation.gd": "f3fabb6c157a91723af3511ad055a5423f5050c341b4ae406967887813a7d394",
    "test/title_presentation.gd.uid": "d6da880cd223c4f36c42e1095396d57ff538da9a2d2db440ecf45f143bc18df9",
    "test/traversal.gd": "07915002940e08f64ab3e558e30b74268d87b5ba540b0f08d13b1e5b8d69509c",
    "test/traversal.gd.uid": "b0c72d18dcb407bf9020fadc6cd7a36c4edd6451b492a6252087af180691c5e4",
    "test/tweak_regression.gd": "45cfd6f30a70d25b2ac9c6d9b215c0ba8b1fd5b5491ff036edc846377e1568e1",
    "test/tweak_regression.gd.uid": "57f5bcbced582fc79395ca68991817df3eadf6aa457f0216a011d91943c55b1b",
    "test/ui_contract.gd": "b060ddf5e714719196a34764ed7fa545b1312cdeb98ef7bdf5436a458afcf554",
    "test/ui_contract.gd.uid": "a9e0675a8690f0fe73cc213d662174e77de24f67dfc8adfb268afaf495f25d1e",
    "test/vfx_regression.gd": "ea2c3ced118f9effcbfd35c4075384db0213ce1743c4f1b732d0ed8cd380b895",
    "test/vfx_regression.gd.uid": "c5d7520c6d21ba65d02aa2133f3a605c92d16c0b9e7622832c3b175394d2031f",
    "test/viewport_framing.gd": "4001f75e6a59b7d125182e0316d38eecca0c9db52a03fccc6f086ef5594ea431",
    "test/viewport_framing.gd.uid": "da8743e926846cb91492d0bcb62a853835a9d89b6cbf44cb633d05c5f1c9658f",
    "test/yarn_bounce.gd": "8d85cc926cf829b23e1efae1f43664aea2aec4aa9cdf6c119377a5a3aca127c1",
    "test/yarn_bounce.gd.uid": "b4e78acd5e6b16ca3a1ed188651a54cba03cc550b2f12c85ebcba1da9dc6a90e",
    "test/yarn_combat.gd": "d6c00f656f5b0341846290b904c30f03e5510bf9cc51214365f65e30886c91da",
    "test/yarn_combat.gd.uid": "39de178aea987a5316352904031c792c75c8b6ec112bef5bb9826d6068873c9c",
    "tools/art_pipeline/extract_video_frames.py": "bce41f6c3f1aaacd4f0eeb56050262dcfa1c2e45c4bcb6f90d6a8e4a73d79c0d",
    "tools/art_pipeline/process_animation_frames.py": "c8acf1a49aaa21cf6ff956043ba0ccfb92b16197377f6b0a541579b63474942c",
    "tools/art_pipeline/remove_image_background.py": "97f2621c3ed5c67699356078785c599ec35221d28318b118fc5ae105803c42aa",
    "tools/art_pipeline/requirements.txt": "7b366fea93947f29a69e4bc204ae900e7bbe7456427c9ccfe7e36e4f9e31dce1",
    "tools/art_pipeline/test_process_animation_frames.py": "f330280bd8de515fc37cca0836e66c03e26804fbfaed1ab1667e2fa56e0fc73c",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/font_pipeline/build_font_subset.py": "87b0af7b584c6dccff80119d6f446f2fe6435e72b451280ad3ca08c882ff7859",
    "tools/font_pipeline/requirements.txt": "51861701c31a3f3cef722a96955f65f7574cdeb7feea02a4c00cf75f83b47c03",
    "tools/font_pipeline/test_build_font_subset.py": "48e3a640ee93bae9d3bf469789aacb741e8ee452e833110e2f7882d7e61d690d",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "web/loader-cjk.json": "cd50bcd0fe25528ae3fe6f8e416b2f29f73b17bd2065ad7a83f334b9db52002b",
    "web/loading.html": "cc0d18a65ca44826773434cd62f0315b19c53f231956bf0179ce5dbb0a97ba6a"
  }
};
// shared/gameStarterFiles.game-bullet-hell-v52.json
var gameStarterFiles_game_bullet_hell_v52_default = {
  id: "game-bullet-hell-v52",
  files: {
    ".gitignore": "b6bf0ff6a1d56ee2d1d54efe972ab1c72936762ef2f0ec21e929baa0de19452c",
    ".manus-game-template.json": "f844e805fe773b6138b3ee34ff2e2a2861ee0a345416406ca37e6e2fb61be977",
    "README.md": "f905aa8f28972784ea81c0e4c1be0f8ee1145a946b412974e5bfe3f1e4a77a6c",
    "asset-provenance.json": "5caca764ada25773dfb2946f1dfe525df3e92db6e5ae85ce178020f1997c55f9",
    "assets.lock.json": "98ac300197a8689dd88149e21b0ccbfb4418f7aa34188fd261009956c6a733bb",
    "assets/template/ai_drone.webp.import": "263b58dee22e209d2f7d5dfd3852d8627ff940c129e2ba335d7d5626f8e580a1",
    "assets/template/ai_mothership.webp.import": "c56c3562698913c1f190a275b5843b5e00715c3b0a436f35cff79a17cac6c680",
    "assets/template/audio/explosion.ogg.import": "ce6ff21eb6f3959d2b173f5641f631b8b0fb5179c449ca5dfa9699b29ba0d86e",
    "assets/template/audio/hit.ogg.import": "9c9f5be46e52f70525a8eeae7b0232ed0b6c1e2dce4fd438e426be3806e92217",
    "assets/template/audio/shoot.ogg.import": "f9a1d35708899c8bc4a432be698279784411af08ef4313aadbe531f4855fc9d2",
    "assets/template/audio/stargrave_battle.ogg.import": "fbe8938a2eedb1076e6062b63209b5d3a0e8e4cd121c66d10edf5396e7ef3444",
    "assets/template/dog_ship.webp.import": "a3b1631ede9173ac972367bfb9f4131ade3956324a4bb4001e4bf09d560e9110",
    "assets/template/elite_boss_barrage.webp.import": "53231ec3fadacc8008e18f6f8ea839c7347e8db958228470815feadeb0df6ef0",
    "assets/template/elite_boss_geometry.webp.import": "c7f2fb151e9fdb27cf536c220d2dc05ec97725943dc3bf0992fd28cb24250524",
    "assets/template/elite_boss_laser.webp.import": "0a457adbaba2ab5fa4aa7cb9147c8a2097586ef1ae2c07477ff162139b36ebdb",
    "assets/template/fonts/Exo2-OFL.txt": "7f95a8eeecc6904ffc81cd10cc8ebc7fcee72a67922924bf45f02dff03b88127",
    "assets/template/fonts/Exo2-VF.subset.woff2.import": "255aa0b7d83e2a2fe51fae4ba77ccf21e44b9ca2470bf021af8795acd3a21287",
    "assets/template/fonts/ManusCC0-Bold.woff2.import": "5a72b2b63a23448521d31997e1332ef11926c300afa37131ed18b1a8ddd8828f",
    "assets/template/fonts/ManusCC0-CC0.txt": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "assets/template/fonts/ManusCC0SansCJKSC-Bold.woff2.import": "6233c192e137fbf3478f74b96bb994ae0a4a8e0b0ba64356e4deff542b91cae0",
    "assets/template/fonts/ManusCC0SansCJKSC-CC0.txt": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "bfce32776baf21e7b88c645ceea58a585350f2c1691bb5f25fcd0fa43ad1f8d7",
    "assets/template/fonts/SOURCES.md": "d32fe8ca1c77efa88e27117c5e42df1ae0f29254a9a2ac926607b86ce2e8d7cd",
    "assets/template/fonts/display/display_bold.tres": "3f5dadcde60ca4858253669e513513abd5cd3c59f838f52a90eb6d48b8ae7732",
    "assets/template/fonts/display/display_title.tres": "2b95afe1cb3c4190a20ae3686f24c8bfe6ea929af682a5c9d1e0c9402c7738f8",
    "assets/template/fonts/noto_sans_sc_bold.tres": "8af6811827f73a7be5e55f1cf1c32c4ce0250121197bf6ffc50388e9ca45aff6",
    "assets/template/fonts/noto_sans_sc_medium.tres": "8860b803e0baeb33de24bb54c32654b5db2fa180cdfca078c1903e1c718352c5",
    "assets/template/fonts/noto_sans_sc_regular.tres": "76a335c988f923b8091ab5c32c69f019f9995e38680b0cb1557543317193cc6a",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "002b1356f83b4618dc7cd83bc2335c3a783d43e0a4faff18801ef00032828f92",
    "assets/template/fonts/ui_medium.tres": "03980dbf9d72c57e9f4134407cec4d26d64a52f2efd22d791e439de863bcfb76",
    "assets/template/fonts/ui_regular.tres": "0b602256aee01408860df614b1f65fbc19cd5e85f168617c6386ef82b6cc39f0",
    "assets/template/star_graveyard.webp.import": "227a362e8d925567c22bd853e3eec4e5b6bc6cc6303c6d643eed64bbf9c20a25",
    "assets/template/star_graveyard_mid.webp.import": "a6cb23774dab845e1f4a5e29bce10c096b9463f52ba02651317205c54790d345",
    "assets/template/star_graveyard_near.webp.import": "f974fd2d5ba46e4a00827f57c8f687efbcd75965e388ffc4535048fdcfdd9956",
    "autoload/i18n.gd": "d4fdbe338a63b96c6057d9b5773cf0e4558e255183cbf08c8596e1baadc42465",
    "autoload/manus_font_theme.gd": "dea62163556893182b90157050366bb500ed60b2d09ea8d022b5e1b041adc4d4",
    "autoload/tuning_store.gd": "21357a182f986ca9cd1ee5e9af8aec4354277c3d60c073bfb05ee36e8385610f",
    "autoload/tuning_store.gd.uid": "148159075b2e1d00e1bca4d0c3e067e3f1ca4c35267a10cf52a7790fd4ec7f1f",
    "docs/game-multiplayer.md": "af4dfd273e65ff5a1a547b7fedf5a61e039b0f8305e5415962533313eca3ad68",
    "docs/provenance/fonts/manus-cc0-sans-cjk-sc/DESIGN.md": "9b54a42245085a6e15b6e3ab9aa331a3e876a6387ae19fc06161bbc15a7d9412",
    "docs/provenance/fonts/manus-cc0-sans-cjk-sc/LICENSE": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "docs/provenance/fonts/manus-cc0-sans-cjk-sc/PROVENANCE.md": "6c2d29efc62173c9ae4747dc3c0413a643649659168a394d2ac21a482dc91866",
    "docs/provenance/fonts/manus-cc0-sans-cjk-sc/README.md": "8be6d6e5c0c4ef4b794eab3ec5855a3cdee67d9f2910867db47d9da219639e43",
    "docs/provenance/fonts/manus-cc0-sans-cjk-sc/source/GlyphWiki-LICENSE.txt": "1435fc6023e5e48fbf3f98ceeb2b2401a11884bb2d9d9d964a13b539a2e249cc",
    "docs/provenance/fonts/manus-cc0-ui-sans/DESIGN.md": "29120cc83c074b2956f06dedaba405d4984cdd18194b6a36b7605205083c6e09",
    "docs/provenance/fonts/manus-cc0-ui-sans/LICENSE": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "docs/provenance/fonts/manus-cc0-ui-sans/README.md": "73d722b538968f0429ccdc86e8c3d779d801265b78a01b5d88f1bd0e72c9cae5",
    "docs/provenance/fonts/replacement-fonts.json": "4f470e52b7d0f0fb12d084e079cbfdd3ea24d0a1d58ad62397171705b4ee1077",
    "docs/provenance/historical-font-licenses/Orbitron-OFL.txt": "ab609b0e110d622435ff337cdf233288556e011bbf9bd0550be98846c0630819",
    "docs/provenance/historical-font-licenses/SmileySans-OFL.txt": "9401f4050f1b66c26b6ccdc8b0e14a3c1cc37aac122eda84386f25854a9bec72",
    "docs/provenance/historical-font-licenses/index.json": "42b0223d26801f799a6726dda89ece8b70ca7f3ce8c112c981cdeb208f75652e",
    "export_presets.cfg": "8e12627477f15f0bbcb7d5107e8bfb133481773960200f2e5f38ab5a0a672f09",
    "localization/en.json": "3809ef744a5488cb1e98a5aebc051c96b18938d8e783c74a0e96fc4e73bf977a",
    "localization/zh-CN.json": "fdaa106c421472ea438176f6ee5e94770e5bececbd0650566b50b6dae529b0cd",
    "package.json": "27b291bb50bd88ef1951971dba95d6f935ef819eb3808b1142f23659aad2e12a",
    "project.godot": "9c38e822723506d3602b1f585244a3bdcba003885d82b8b62007ce145becff9b",
    "scenes/game.tscn": "308ae9d0f66ce159935c7aba8cb8638c28c21bbd475d8dfcdb02e2d4f7582e79",
    "scenes/title_screen.tscn": "57b6e174e877b1432441fc0fe0d660a0e81a5de97c434f8d7580f17c07275983",
    "scripts/check-exported-pack.mjs": "29b72ec47d3ac5a83dca4af0372dfb5788d4686312e71372d95a9fa82871c04b",
    "scripts/check-game.mjs": "95e7eb4f4f4e5c20ad5fa4eb7a1707f9e2b26955810c72df1a13a937ce9d0ad5",
    "scripts/check.mjs": "62e2f5c876cbae796c68186be7fedb92bb4176ee015d3c29357de8083638774e",
    "scripts/game.gd": "510df670eb754bb8eec09243d3028a01742bf714541e7b044c0d71ea9e17a89b",
    "scripts/game.gd.uid": "505e5018d8a6cdb1f66cd7134fed8f4ccdb3583e60654a288f93d48823c06a86",
    "scripts/godot-check.mjs": "cc2ead5ca58f5e27b07448e6946a1f7c1421a1efa2e87d118d79045136d183fd",
    "scripts/holo_ui.gd": "9cbebd22be5f1d73a1f19c84a99f1666da2eb1a84d06a5327f771c9d8d038ce1",
    "scripts/holo_ui.gd.uid": "f5ead975f6d5e5a0a2a7da5c53e98ab4101a945787112e7615891af6b0be44e5",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_player.gd": "3dfbe63c26ce47cd41a1c50c94ad1bc51eb99a3daf494cec3aa81d123865de5f",
    "scripts/manus/game_fonts.gd": "f54b10601c5e671d6d7c36646094855b5a56d74ce6d2d86eaa46e5e2f9bec7fd",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "fbfe054ff52ba074a75cbf82acccfd6eb8d3e9210edcd90c258e0c0f3e69be02",
    "scripts/manus/preview/tuning_adapter.gd": "4774e27bb8253711b083556cbecf65641468af65dfbe5adeaeaba2ba431db390",
    "scripts/manus/preview/tuning_adapter.gd.uid": "fa88bc178a77fdcf43331db7a61ebab3cd584e7d07b41c74f58e212892b95174",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "eb0d3f17b3097fac0ba6f16e1dfd587627ff62814c9dc527cc335189e40ef870",
    "scripts/title_screen.gd": "29a057e1d321e0518e3de5b87367011e212d47b1a65e9a08ee6d2eaba882d4f7",
    "scripts/title_screen.gd.uid": "a67c223df99fe54fc80932975284e6d41ec0796f956c7816169bddfb02165508",
    "scripts/tuning_defaults.gd": "2f1fcadada1f6a5ca8d89e4f6f4f2d5aaa72ad905bbc0350b8dc08a6edbd0cc7",
    "scripts/tuning_defaults.gd.uid": "21c18ff91520bebbaacf7fe3c0e6063b63df8903dd9d32b037527f92adc184f8",
    "template-provenance.json": "c63c2523c2fc8dbb29eaa249df23bb8f0de9ed2b691235f12825e653bf4adb82",
    "template.json": "94657eac3283cfb777d32a2eb0cb51d52ac9e019efda15a32d131c3245809cf9",
    "test/debug_capture.gd": "ddc91d73e83935b103974f9ea96021b0158237eb6673345746cf845beec385d8",
    "test/debug_capture.gd.uid": "ea195173968ab7ec81c9ae4cdd3f7b41fed426e70767382673720448e82d18a4",
    "test/debug_capture.tscn": "b5f35486b70ab1a82888b0aeb50db73b343d8e9a6bad278c9cde12fbfb349c2b",
    "test/english-copy.test.mjs": "97a5a95335146cf7170a69767e437255ba14059915c6d3e6c84ec4fe0b4ac629",
    "test/exported_pack_boot.gd": "c9c92f3e65d13fd46c8a066d2a48423141ebda5d5f1142a4182aaedf6cf66660",
    "test/exported_pack_boot.gd.uid": "0b9e81f05e2fc7934f577ecd9233a5d90bf34b15c7ecf23b27e4d667b527b1f5",
    "test/localization.gd": "0df249ce517474fda25ea1c9264f13cfbbab682419cd0d98a76e6a2c28f650df",
    "test/localization_capture.gd": "5312a3ae6dc1155c04f169acf5159fd7fb3aea30e6617bbf881caaa7cbf9a6b4",
    "test/release_contract.gd": "917852f69f5514215ca25ee93a5161b418dd0427eeab6a2527018dc23a71333f",
    "test/smoke.gd": "66d261deadd82a744a2d6d927ed29c845d68384639bb93177b57f3ece70db19b",
    "test/smoke.gd.uid": "c932fdde3f0df83b015636723d8b1207871b0da9c0bfcd6cce904880279144cd",
    "test/template_contract.gd": "021c599af8fe0d81b5a3eac551ae199e035ee185128bea228830c70bbe575fcf",
    "test/template_contract.gd.uid": "f2db2bdb25fe2db49456ed05e146297c79299b0368fd57f0ce943777108be10d",
    "test/tweak_controls.gd": "72589cd561b20be0a8ecf37479b75b4380102c59bfbcb3095015ca0744c4b268",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "web/loader-cjk.json": "cd50bcd0fe25528ae3fe6f8e416b2f29f73b17bd2065ad7a83f334b9db52002b",
    "web/loading.html": "2138138540fbb15efb38a4d79c689c78c06391a3c7286025f57c765c3e48d0eb"
  }
};
// shared/gameStarterFiles.game-vertical-platformer-v63.json
var gameStarterFiles_game_vertical_platformer_v63_default = {
  id: "game-vertical-platformer-v63",
  files: {
    ".gitignore": "8e99a8890a08a1d98b1df71525fb95ee49faddc2f099b8ac85606cc17e282fc7",
    ".manus-game-template.json": "6d6d6e2c97b9acb2bd8b11fb51454000ca66a64da3875a4ac0508a83ad3fb200",
    "README.md": "c23f4d019c3e74235dba1b9dbefcbbdc9dbb7e111717ed45adc4757800b80294",
    "asset-provenance.json": "2c46968ec60b485a5a1b5bcb7d74367cb48ccebdb46277ee6d80e5e02db9fa3d",
    "assets.lock.json": "7553656b70b66c2073e0c4e16e54bd0bcfc4fea9f8ca1f4c344606cced0b93c3",
    "assets/template/audio/vertical-platformer-paper-sky.ogg.import": "5dc9a90cac6112668683876fb18d82ae2bec2076639047e04a4258e90ca331a4",
    "assets/template/characters/hero/hero.animation.json": "2f498d38e787a5411e7054a86b2666a1e399c20ee5de5ab2f079dcd11dfcbd4a",
    "assets/template/characters/hero_ink/hero_ink.animation.json": "ae7299cfa5c8aa67cf4e37a29a0c58e0fd92b094d8226c2e750706b4599df2f6",
    "assets/template/characters/hero_sea/hero_sea.animation.json": "a7c339953b7ecb5ea2c55ff60c0772a3d2a86311f618001c4925eb1d98fa6681",
    "assets/template/characters/hero_sunset/hero_sunset.animation.json": "352a7e957f87a83af9992419ebd73cd3a10551c2562c0866c2c2d69cc645e760",
    "assets/template/fonts/ManusCC0-Bold.woff2.import": "5a72b2b63a23448521d31997e1332ef11926c300afa37131ed18b1a8ddd8828f",
    "assets/template/fonts/ManusCC0-CC0.txt": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "assets/template/fonts/ManusCC0-Medium.woff2.import": "391ef7605e14a437955d5cbca0c180f00b736d18953a1d110fb03b59e46865e1",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "c7798215fd1f3f3b75e7995c51f856d034a30a919fa8c8d47119cefce0b7c1d8",
    "assets/template/fonts/SOURCES.md": "a324cd65330b4c250e5a7aa71901bb745294ea19077c58eaf333cd056116febf",
    "assets/template/fonts/display/ZCOOLKuaiLe-OFL.txt": "538078469839b4a2e7ad22bef4ebe41681a4e53749bb2a072144024f1d6d703d",
    "assets/template/fonts/display/ZCOOLKuaiLe-Regular.subset.woff2.import": "58589440b34f9ac5dda1a34cca6705af7d196b9a4cb6ab0e3611586f7bec517c",
    "assets/template/fonts/display/display_doodle.tres": "58a68dbfc80fd5d9e9f7b748e1080f15bd96881a12f9c7b92f94b8536f3670a4",
    "assets/template/fonts/noto_sans_sc_bold.tres": "ee74f7ca2a61928772bfa02d5812879dc1a2d4caabf623de0879d25828688ec1",
    "assets/template/fonts/noto_sans_sc_medium.tres": "6712d5035f4aeecb86c652cf5e974f35587362a53be50505c08f5d8f5d5118dc",
    "assets/template/fonts/noto_sans_sc_regular.tres": "b078461a72ba925aaa208eaac202896e88b9f0bd3cfb3d8e15eb7acc3bf25fba",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "0628dcaf4305686e8e226cf52a620d7bca21bf586d399244aaffaf6d7d79b087",
    "assets/template/fonts/ui_medium.tres": "017ca60bbc76dc768c9aeb519e9d70f24901de86bd87088b0a240e739b7a5d28",
    "assets/template/fonts/ui_regular.tres": "c5dab19aa7c0dfbf71cb1744ece9dc5492a5718f7ea2cc6bb785ff0f4d5a4806",
    "assets/template/generated/run_frames/run.animation.json": "57106681216df87c44712d99bd9b075ccb2cbf35da85fab9a2183db8b02cb502",
    "assets/template/source/audio/make-paper-sky-loop.py": "bfafa7ff1e2b25dfffd803146ad422b031346e7752fc73130e4a0cc24101ca8b",
    "assets/template/source/audio/vertical-platformer-paper-sky.json": "7605dcbe11b3f016f8314fba0d134000ad5a2e5a0bf62761e4675ca4da1a40a8",
    "assets/template/ui/loading-background.png": "b2d55ddb8cee0d280fef6356ddc17b4037dcc18c53219305de88011b290384a7",
    "assets/template/ui/loading-background.png.import": "5210cc606a6e40c73623c01563e358a5172f512946a37439f15f2d947c2419ea",
    "autoload/i18n.gd": "e61f39ca3f4707e0dd9645aaec1383ff783b7cfd67fecca38846a8a8bd0bc507",
    "autoload/i18n.gd.uid": "63f336c0074b65520fffd029bbb4b201d252a4f7cd55578b6ebedffab03d0fce",
    "autoload/manus_font_theme.gd": "021d39d507cb591044f25a5dc9c28d7f2b20b4df0d6f3282051855593a140a6e",
    "autoload/manus_font_theme.gd.uid": "605bb9d8dacb44e3a63bfde0a7edcb0a0e4640e84038f8759ccefd1eec7811eb",
    "docs/GAME_PRODUCTION_PLAYBOOK.md": "24f0993d62734f58e6830db6c0ede61ce412069698bf6fb876b9b7dfcdac8aa8",
    "docs/game-multiplayer.md": "af4dfd273e65ff5a1a547b7fedf5a61e039b0f8305e5415962533313eca3ad68",
    "docs/loading-art-provenance.json": "156081a21a4f01e808172cb70c79bc02eb4805d7fc333780ed89018e65e714dc",
    "docs/provenance/fonts/manus-cc0-ui-sans/DESIGN.md": "29120cc83c074b2956f06dedaba405d4984cdd18194b6a36b7605205083c6e09",
    "docs/provenance/fonts/manus-cc0-ui-sans/LICENSE": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "docs/provenance/fonts/manus-cc0-ui-sans/README.md": "73d722b538968f0429ccdc86e8c3d779d801265b78a01b5d88f1bd0e72c9cae5",
    "docs/provenance/fonts/replacement-fonts.json": "3b49664ab74b6eb8b31de33a027d7bdf247bbb67ab6b0262b4e19dc8957f6c5f",
    "docs/provenance/historical-font-licenses/GochiHand-OFL.txt": "b36cb03d6ddc163452d9935ce6f325741434272d3889acf42cc23584f31a85bf",
    "docs/provenance/historical-font-licenses/Quicksand-OFL.txt": "14d28541780d90f6577bb7abcc6f005bf6969614294e75c82abb8758a696ad46",
    "docs/provenance/historical-font-licenses/index.json": "2eacd16fcf74ee180c77b425126309a0110e40f8e839402d822f3d6f5ac8f690",
    "export_presets.cfg": "e16573d9b45feab336a100788a8a065c6bab056c570fa568f6e9b734e5e38b28",
    "localization/en.json": "641fcf96db839139e65df33a689d86e9475fcd84b88bbcd9a7ee61f185b27c1d",
    "localization/zh-CN.json": "2ddb2ef7f8a515697b3f70c3d60b27dcf4bfa3725c3673c03d5acedd42e9c3dc",
    "package.json": "fbbf6244547ce32115c1675b2304d6145193b28f6e967fd7b97aad944943bdda",
    "pnpm-lock.yaml": "17c814b167307942d3609c7b9d916ceddb85839573ab39baa114e30edb132a1a",
    "project.godot": "4f5d06f7f008d78d279ff4e023f002ed509bc0c74e177853ac9b03444968d319",
    "scenes/game.tscn": "09de69d4166086b7becc305e180773cdc3c1d634e6ded5eb360686ec0c44daa8",
    "scenes/title_screen.tscn": "d29a528a93ec410c461455b3f9bb5ab6a76d1079bcd4c0624f84001cf969db39",
    "scripts/audio_director.gd": "336f9210aaab4dbb37e6f740ebe77882e9b4249d9482c624501e1b3864b9a8c7",
    "scripts/audio_director.gd.uid": "cac9117e971948d844ad54990412a737f20d5d6f01c351142e601a60d0dc5e3e",
    "scripts/check-exported-pack.mjs": "75478c320d210b31378f19a791d48618a60e3a1f0689dd2f8b4a51282e1b0ef0",
    "scripts/check.mjs": "62e2f5c876cbae796c68186be7fedb92bb4176ee015d3c29357de8083638774e",
    "scripts/doodle_kit.gd": "e4047250eb6935fd29527abcf2afba47429453161e1cb0774d97e009de4a2930",
    "scripts/doodle_kit.gd.uid": "0391d14a097befe7492fe7ed58d51e922c50814d5e4106324c6b1c2d6a966795",
    "scripts/doodle_style.gd": "c075e3eb3c1f4c849a8e932302ae9bc2e4a972085445b35c1ebec090f3202d63",
    "scripts/doodle_style.gd.uid": "f1c958a371beef1be51c1e75191ef8db0e11f891e160b2335a77be53cf7e7c66",
    "scripts/entities.gd": "210c34613910f21cadff0f66b4899b839c2442c93ddfdc171798c4a83b7ecc0c",
    "scripts/entities.gd.uid": "bc70ae70f68beded94844ecd38002f8660af07cc1b4b13414e0e4cdce28bbe79",
    "scripts/game.gd": "f42d0fec76dca09c2938816eb12caf38184d8807cb8cccd91a4078f37a0d8c27",
    "scripts/game.gd.uid": "309f1a59ea1dbff3a144ca92b1e523617c708e434f42adc66ebdd2cda7c5fcdc",
    "scripts/godot-check.mjs": "cc2ead5ca58f5e27b07448e6946a1f7c1421a1efa2e87d118d79045136d183fd",
    "scripts/leaderboard_panel.gd": "0cdb0d50f93ffc35a8bfe045f68d899993a592c0b2410e3f242db21610043c00",
    "scripts/leaderboard_panel.gd.uid": "bc2c0b7f6e5389d54dda7c728800b88168541a14624b61209f256ac211dd6a3f",
    "scripts/leaderboard_store.gd": "a3e9c455dbcb80550a9421a13dd35f4ea3ca7359ff1a90d1fd7c372c7100f87e",
    "scripts/leaderboard_store.gd.uid": "3aa41da02ae8f8d6409f878ea581aae11357ccb9baa3824d818bed6bcd783458",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_backend.gd.uid": "f23ca5651c34af99698fb4dfd08975622b8a01526c8f678e0dfe46203bb04eb5",
    "scripts/manus/browser_bgm_player.gd": "3dfbe63c26ce47cd41a1c50c94ad1bc51eb99a3daf494cec3aa81d123865de5f",
    "scripts/manus/browser_bgm_player.gd.uid": "33324a2c3acaa57840b89c60e2ae2ea48716b6e03653c7aeb95894aaf2048d78",
    "scripts/manus/game_fonts.gd": "bc39a5bf9a228ff9df356a268b0cd39268f24e7f305da52b6e4198bd8953a2e5",
    "scripts/manus/game_fonts.gd.uid": "2b6e5478bb77cfa0266f51f70c5c770e9c6d0efc5433db7a28a9f6827fae7d98",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "460d0bc2ef1f4f92adb961ac5a27310e644ad2837994f766068a3db4a91ae0fa",
    "scripts/manus/preview/tuning_adapter.gd": "d869b740071ef56d93103a13352a9525883f9824d06be37f01ab9fe411e97a6d",
    "scripts/manus/preview/tuning_adapter.gd.uid": "39ec9aaae3f06980579f96943ceabf649b20c2b1319ed842c08e33e1a8c30708",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "c1372f569ec84ac48cc9f23e3842f4520beb48ca3f9bba7f0d8007f115aad761",
    "scripts/manus/procedural_sfx.gd": "91bd8364dbb2a65af4cd75d7d5a848b10d1fd52e96d11c528a43ab7e3d38b3ba",
    "scripts/manus/procedural_sfx.gd.uid": "dda71dbeb8cfb627e23abc377286a7b7a9040ff7a6ce1c4179a7268856a0e927",
    "scripts/player.gd": "7b15bd256a4a53a53fa2e5f42e03ad98cd134d4efdb8229f754c81a533792f80",
    "scripts/player.gd.uid": "1a45e84be7ea2bc9951854081556c301e0a729a8d960c4fbc394f12b6b170558",
    "scripts/save_store.gd": "c1d6f94069aedb52e8cf4cb34f21494059fe5c683b400f21af4327fef23d2541",
    "scripts/save_store.gd.uid": "1bc7a07db714dba31b2efaee02fb4cf18dee00af0cc8cd092c40eccca398f9fb",
    "scripts/session_owner.gd": "cf152ae1730b4275e4daafaf565f396021acb4b47e76dbd81483c6183328d14f",
    "scripts/session_owner.gd.uid": "3608fc659793bf7c584c448ce2076f11703723e263c5354e708efba57b1d2498",
    "scripts/session_ui.gd": "5778e12b0f4e02f4bd821311fc4279bdbf2bf800724e5166e592d062419b391b",
    "scripts/session_ui.gd.uid": "cc40f032ba4b1927108e0c730bd63a027bd3999841f4b3867fff0fb90995b368",
    "scripts/title_screen.gd": "48b89ddc965b0c4522895b3932a2588856d40a14abf3ee1169ea4874b83ffe32",
    "scripts/title_screen.gd.uid": "491d0eb16c147aa4ba1d10b2e1c9932c2ddf03f7c46d6e0a26530cc956268b4e",
    "scripts/touch_input.gd": "47174c1845317864b7172b25edd4de9f982a77bbfdf4ae96b57062616f1b5ac9",
    "scripts/touch_input.gd.uid": "12888b28ea21ac26ca83ae4d971aee61a3e77ce0613edd89d8007eaf9a1779dd",
    "scripts/tuning_store.gd": "8e95e18cf6190ef8f8e496dcbf24a27e083664eba48617d07636ef785b88e3d0",
    "scripts/tuning_store.gd.uid": "e2602c91bc61628677bf7181ff27b516415875f4b7a3e0ac79f2e65550e2a272",
    "scripts/tutorial_director.gd": "4adc2eb6158f23af2c6879646f6dedd0f09b6aff21bb7e63e3151fd5a40eb6b0",
    "scripts/tutorial_director.gd.uid": "8d2607488dd0015ef85de8c8120a7bfa484764faaf782e77fb6e1922f0b6b003",
    "scripts/tweak_catalog.gd": "6514a5c206333dd77fad84801bb43a0f410a51a5e83d6e6fb2d144c214d0d20e",
    "scripts/tweak_catalog.gd.uid": "ccfedf1c398eeb80826f631976f4ddbf8d89e0c64682c655be025836d951a942",
    "scripts/world_art.gd": "af8a6af3edf3d9fad281003f4910d9145d1fba599fb13c6958141ffab1183616",
    "scripts/world_art.gd.uid": "bfa69eb5f3fe998c1076dc92a8a52194bd3e70bbaebda1f5c06c5aec8ca2fb4f",
    "template-provenance.json": "72f81356d60abd066f0ec14efbadeee91184fc06b4c4e8381e0bb7582bdcad25",
    "template.json": "b7020a36391f119f8b8e5aa5337fe5d1a816c568e472ed208eb1f42824cf44f6",
    "test/audio.gd": "498fd7dab3c7cff9d2fe5ff65cd14754ed0389af213535080bce11f069d3f25c",
    "test/audio.gd.uid": "6761f61b7d888a1ab3a4070728fd4306b8febf84c15516f7dc9a525150a00190",
    "test/debug_capture.gd": "a9212f2069c988596591343c89c8f4f53ef07c59d1d52a454aaacea56a7a7499",
    "test/debug_capture.gd.uid": "ea195173968ab7ec81c9ae4cdd3f7b41fed426e70767382673720448e82d18a4",
    "test/debug_capture.tscn": "b0359aa686042cd58043f8a84929bbc594e323cdf55e5d6ed957e9dc92a015e3",
    "test/exported_pack_boot.gd": "e51e9d262ac53e4a06c5e1050e1478e10432993f1531f3c05428ef3acc5dc3e1",
    "test/exported_pack_boot.gd.uid": "0b9e81f05e2fc7934f577ecd9233a5d90bf34b15c7ecf23b27e4d667b527b1f5",
    "test/ground_contact.gd": "1fd7bc18c509a1f846c32df78fba39c915d3626482290b029ef3c85ace8e30c6",
    "test/ground_contact.gd.uid": "9e11cf2bb2e98c0f985419befd1b9a24dd373aeb20aa1fecca0b671c1826ebf1",
    "test/ground_contact_probe.gd": "6c92facaeceeb7b73614ff9a7844f5a1ac71655e2c29f0d8563a9c8b45e0ff8b",
    "test/ground_contact_probe.gd.uid": "70f1d29d4d4e7c15a0366ddd44b86537d48313a5c7ac7184f9773cd630ffb832",
    "test/leaderboard_tutorial.gd": "f2aa2749d145f9a6f5c0aba4cdf8b39559446abbf91e8aabf63eb6c26d84b1a3",
    "test/leaderboard_tutorial.gd.uid": "7284e343577ed81fb63c61008eccfe8f0454fab1801f375436e76edf7b960eca",
    "test/leaderboard_tutorial_capture.gd": "cf9cb6923b33205072374b5d134463091cf3333496185bbf4026873b7774fdf2",
    "test/leaderboard_tutorial_capture.gd.uid": "3994743f174fe3ebee58d1a336c0dfa188f8b1ccc1fd73bc31b3886678e91b87",
    "test/loader_locale.test.mjs": "14fa7e03ea1c0451af49a24b27f65357d23bd11ef08e081047f258bf87cf59bd",
    "test/localization.gd": "86392960aa2827aa04896ee6cd769ecc6b7b8cc886257b74e11fada40362bf5c",
    "test/localization.gd.uid": "7845fb5b19cd2d4156b3031964ed26241072762649f8fd19aa850d9c3f15f61f",
    "test/localization_capture.gd": "be21d308718f8c2d491741922984a77882945ec3df83263797eb8a74774c2cd8",
    "test/localization_capture.gd.uid": "850acec1341cf3e328de67b49d6e61a956c5eec3d22a19e7513ab2c080c79b1a",
    "test/production_scaling.gd": "946729a8d910f01cbf1ac5e80a3db4846dd2b1248a5e2036d6e47c8426395c75",
    "test/production_scaling.gd.uid": "367e840a21399bef094a1e259f4ebe15b450f3e7434aeb4390c3525988c26587",
    "test/responsive_layout.gd": "d9930867c1701697e8edcdd4facc9cbb72489cb77425cddc83e2c470c47494e4",
    "test/responsive_layout.gd.uid": "c937e01d69c7ba5c4838101233f84cd210eaf7ee3f63ce3dab8d8c0987faa85c",
    "test/smoke.gd": "e91613e6d2287c8a37b8e133204be07d9d8e84ee0f30108ff8be4d144ee01347",
    "test/smoke.gd.uid": "c932fdde3f0df83b015636723d8b1207871b0da9c0bfcd6cce904880279144cd",
    "test/template_capture.gd": "a201427eff683f84a01e2ade90411ef4074394b3cfe8e8fe229cc7960a70e8a9",
    "test/template_capture.gd.uid": "334e68333641a4be3976bfe4c490b66b97d3c569672d2664f512a46c4a9acffa",
    "test/template_contract.gd": "a6d15583010edfc85442af033cfd7e0ca6a3f1d9ca9f4f23530ef9e054192f3b",
    "test/template_contract.gd.uid": "2876fc933c7f8f4ee3a5cd30c9caa58ba02dc73dfd5c92b3532f081389d92355",
    "test/title_language_input_probe.gd": "bca21fcb82a9122d2021face6d49ce012540ac1dbe394ebcce3d013bc255071d",
    "test/title_language_input_probe.gd.uid": "768d1bc1f96e52a761104d53e0f7a335189051f50c1e461bbb4cb7c70d2b2d55",
    "test/tuning_contract.gd": "a9a0b8407fbb690a9b1711ec84954a7cfea43272827d9aaa7078cd273d92edda",
    "test/tuning_contract.gd.uid": "e07dd0848c142114a4bc250b853f8876e94a53a401547a4899225c94d2e564cb",
    "tools/art_pipeline/extract_video_frames.py": "bce41f6c3f1aaacd4f0eeb56050262dcfa1c2e45c4bcb6f90d6a8e4a73d79c0d",
    "tools/art_pipeline/process_animation_frames.py": "39bed0a77410d156ecf3cf524bed4876fe24e0e5d95008bb4ca6c77fd820b315",
    "tools/art_pipeline/remove_image_background.py": "97f2621c3ed5c67699356078785c599ec35221d28318b118fc5ae105803c42aa",
    "tools/art_pipeline/requirements.txt": "7b366fea93947f29a69e4bc204ae900e7bbe7456427c9ccfe7e36e4f9e31dce1",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "web/loader-cjk.json": "cd50bcd0fe25528ae3fe6f8e416b2f29f73b17bd2065ad7a83f334b9db52002b",
    "web/loading.html": "8b312ff6161ee6e2b9578a5a635ffc2455b21644bc8244bfc15b026932007daf"
  }
};
// shared/gameStarterFiles.game-scroller-v63.json
var gameStarterFiles_game_scroller_v63_default = {
  id: "game-scroller-v63",
  files: {
    ".gitignore": "b20645359580348f67a5dad150c9ec52bda761c8fcb36a1e69ce263048afc8bc",
    ".manus-game-template.json": "397cf9f530e3da2a1ee8b7ef110e2f3674ebbf7a5463017c4233cbc644f9a4b6",
    "README.md": "cd8fe85f012a1789d6a54deec8364c45306d51d61d726b65254a56e8d9d68261",
    "asset-provenance.json": "d5f8be4c19a019112e995a4b9bb5d197563cb9be3630a471aacd71ec6a6eb253",
    "assets.lock.json": "f46d6a5d2a5029e037c6bcf0367db9fd867fe8cfd68b940ceee35a80bccde2b6",
    "assets/template/audio/checkpoint.ogg.import": "13df3af2cd123771e7ee1c0604b4f053ba7b3a4966307b6886ba1713379999ca",
    "assets/template/audio/death.ogg.import": "5bede7cea33711d086b577493ee99ae417cce828a6c5d0539cd28af35b99bff5",
    "assets/template/audio/land.ogg.import": "a80aabc566186b53eff0a3ca9f6eac7b5f12f0aa52d0f6bc6c5ff47fe4341219",
    "assets/template/audio/success.ogg.import": "23a7923c807237dc99f5fa2d4342ad78dbb45321d59fa718ca5a510d28ab0c0a",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "f0a116c14597864c6111676b040488d39b272c90864bfb4ee8bbb87c188dead8",
    "assets/template/fonts/Nunito-OFL.txt": "580df76c95a1ec5ab878ceb25bb3d85c6a076804e9c970c8c6972aea775fdf65",
    "assets/template/fonts/Nunito-VF.subset.woff2.import": "20d4056ccdd562d30aa53c959a45a5b8dae87e74ad3951cac718a974ba17a96e",
    "assets/template/fonts/noto_sans_sc_bold.tres": "ee74f7ca2a61928772bfa02d5812879dc1a2d4caabf623de0879d25828688ec1",
    "assets/template/fonts/noto_sans_sc_medium.tres": "6712d5035f4aeecb86c652cf5e974f35587362a53be50505c08f5d8f5d5118dc",
    "assets/template/fonts/noto_sans_sc_regular.tres": "b078461a72ba925aaa208eaac202896e88b9f0bd3cfb3d8e15eb7acc3bf25fba",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "40713fd25f2b85bdec30c20ac66b7a329fca33f7024a4bb4767ba2ce3b40d0a5",
    "assets/template/fonts/ui_medium.tres": "8817cb97c0de1e31566bca7b187be2a58e7951cbf7848a64822938c5c0d7cc01",
    "assets/template/fonts/ui_regular.tres": "9f8d48d81c88fc04ddc6a92ff9338fa8e080750fc3e566e6ead2120a5c572470",
    "assets/template/game/audio/alarm.ogg.import": "6d0de1a8d50a032d0fd8192783099aa284bd1f638de83157cd5cbc55f03317cb",
    "assets/template/game/audio/banner_slam.ogg.import": "816dfc0d581b74d2fb910ffec8ad14ced9470001ac9babf638ad31fc34ad5e9e",
    "assets/template/game/audio/bgm_boss.ogg.import": "05eb52836c51c2cda465c7e0aa00dbe874701b874074dbf6f7b0aba50958f841",
    "assets/template/game/audio/bgm_stage.ogg.import": "d4e0e181e8d59ea17b57249feaf1f3001f68ef743a2cf8c988abde80cbb722eb",
    "assets/template/game/audio/bgm_stage1.ogg.import": "fa95c162b53c4bf130ea43c35fb0e6a8dc801989211e5963428831de6da0374a",
    "assets/template/game/audio/bgm_title.ogg.import": "1b7cce99292b15b033d58d354b510994c33919dac842c8161a0c614128672d26",
    "assets/template/game/audio/chain_boom.ogg.import": "6bdd785b5928bbf019dc28b1af3f7e733e2903c6c2fcae5341e7c5a9f06788a9",
    "assets/template/game/audio/enemy_die.ogg.import": "7ed5a94b6a2aff2b3ba8d2439229cf60063ae4bffd82c8dc505dbc3f12fd4471",
    "assets/template/game/audio/explosion.ogg.import": "a97f1afe6b35c224a572c96169d3758cc0d743e2a0ef93f19b06b418a10acb89",
    "assets/template/game/audio/fury_off.ogg.import": "56da3aa0f938fcfd04969b27c5cc72657673700cba8fb064fe63719d54be7b49",
    "assets/template/game/audio/fury_on.ogg.import": "441c6ecb7ad69fc123afdd28975794309aea0d1edd114318fc06587feadea382",
    "assets/template/game/audio/game_over.ogg.import": "d235fd313e7f1d513149082be8dd0b80c14228bf89d85cff56947d1bf2f7c7bc",
    "assets/template/game/audio/gameover.ogg.import": "067c1134c4ace25e1774e48738f014bda0a8616513db6fa5b05b7e476cedf9ba",
    "assets/template/game/audio/grab.ogg.import": "9710edac7f31ce4d6b538994ffa3834bef8341cbeaad51c1aec2483bf67e29c4",
    "assets/template/game/audio/grapple_fire.ogg.import": "5b52849b07f60696be3aa8e56a38600f9f43e8e77712d03d070e0961d9947311",
    "assets/template/game/audio/grapple_hit.ogg.import": "8956f1d6a36fb5babab52b64e0a37f6945a02a372ec6ec7eba5826a60b44c533",
    "assets/template/game/audio/heartbeat.ogg.import": "142f4de2a6d953e64d7f1e884bdd1df7eda5c0f7904e65cbd53db7e4903297d0",
    "assets/template/game/audio/hit.ogg.import": "d571b27d466214cfacc7e1eaf56fd56ff43f137aba3d050702faf98c7b3af709",
    "assets/template/game/audio/hmg.ogg.import": "c9d2fadcfc96f034ce42e4bb7986835d6783003d6d9bc9c09e1fc4442bee5cac",
    "assets/template/game/audio/jump.ogg.import": "3d430f044b4b3362b99212371bcc664747153341f0b191541861bd0e705a1fac",
    "assets/template/game/audio/laser_charge.ogg.import": "c2e41e64ec9a44f4a0a7b7529bf1e79dc6aa68c6b216a8bb9a2e3ac59ad7db40",
    "assets/template/game/audio/laser_fire.ogg.import": "c64db4671447e35db70641bee42eb7600d8d1112744168f52e4a7dc34fffba8e",
    "assets/template/game/audio/mg_nest.ogg.import": "9a97abc72c06f1b2ee7a5bfa3d03b2d803c0a9d11db16bc8927195cf7180ec73",
    "assets/template/game/audio/missile.ogg.import": "f9c02008fb572d320ed8f9f234e89411fba6e78d5bc8fefdff11acd9dbdde17e",
    "assets/template/game/audio/mission_complete.ogg.import": "68014b6494f6dc6dcac1477975dc7e841a47714681bf0a6840bd6406807a3f74",
    "assets/template/game/audio/mission_start.ogg.import": "3f09932aa4a4f2da4ead23b07f3395a4ff01f0b678740306b6a85d9d2afb534c",
    "assets/template/game/audio/overheat.ogg.import": "695730db244e193e9778835342c9fa64c571a5eb0ef71b35c5dd8963f20240ef",
    "assets/template/game/audio/panic.ogg.import": "b4371da0dfc1916f756c05352c405633dcd693fdfef0922e6c73c749587b6913",
    "assets/template/game/audio/pickup.ogg.import": "000261800062fa31f66758d95a700a04dab4847fac61ae8ad35c42bf949459c2",
    "assets/template/game/audio/pistol.ogg.import": "426afb3aa761bd9611aa91f8df3d99085b6912ab7ba1edf4d57182f3a4527713",
    "assets/template/game/audio/player_hurt.ogg.import": "340e844fb5b19ddf2f264db481f192c3c97fd98a6cb748a7ac701c20b82b8d6b",
    "assets/template/game/audio/powerup.ogg.import": "0ef6da5f5ee013dec959656a1a2d97afbf045f5dfab884862a9e7f5d9625c74b",
    "assets/template/game/audio/rank_down.ogg.import": "ec2b5f9f5161610c237a267003c30ca8e87be00e9b404c7f0b1980e136990234",
    "assets/template/game/audio/rank_up.ogg.import": "01be07ee0a2d3f16d6ce3348d2de1a3c5c9c2f80e054c674ac993fd1b29da289",
    "assets/template/game/audio/reel_zip.ogg.import": "fb134da909155810815edbed39dbf0b3c2a29ab0a2504c374120f456b27332d6",
    "assets/template/game/audio/ricochet.ogg.import": "0c564f9cc9743feeae552648506e9d8a51282679d6d1c65143d2b72fec15c24d",
    "assets/template/game/audio/rocket.ogg.import": "dcb41369982f30611b6131771ab5ace165d880d06f514a71adcac435ae04ee2e",
    "assets/template/game/audio/slash.ogg.import": "cd9180050540e58c1adb57e607fe347961679af010a9a2544991c7ea3e4093be",
    "assets/template/game/audio/spread.ogg.import": "be24995a3208baa80fdbd4bb7c04cae43fee6df7653c08f0d655149bd49070fd",
    "assets/template/game/audio/stage_clear.ogg.import": "91e736931e5ff08efc6b1872dd1824563186ba8c52111f8696b364a804f1aa61",
    "assets/template/game/audio/tally_tick.ogg.import": "aa08979ea8cff4249e368010f65ad7feb34882e9f9df94ff0cf590b45aedd3d8",
    "assets/template/game/audio/throw.ogg.import": "69da30b3cd20cd01863edb327e077bda093075682f6935790aa27e06d5e3e55b",
    "assets/template/game/audio/ui_confirm.ogg.import": "20455a06ee333f8885ac0324d67e69c5eac89b5b425a335cc4d4b4799977bb51",
    "assets/template/game/audio/ui_hover.ogg.import": "8ce03ad4aa76d9ea17e7fc25cc4827c3111e4b9c4e7c587ba3b9a8823773106a",
    "assets/template/game/audio/ui_pause.ogg.import": "86a85ab1689dd378448cee7a24206f1185540f4e0148187143aac90bbec7dfc4",
    "assets/template/game/audio/vo_chain.ogg.import": "b4cb9e949246f350fe2370668f47051825ffe6758c78bf5dc5a1bdb824586292",
    "assets/template/game/audio/vo_fury.ogg.import": "b53fbdda831bd412233f317dbe036eff00606d2f6579248351a66a096420b286",
    "assets/template/game/audio/vo_go.ogg.import": "3940ee579c16b8d498e95c4fb89331df24acb5294c9baf8a71948cdb2b325c0e",
    "assets/template/game/audio/vo_hmg.ogg.import": "2429b713e0e7016152c862f05e9f21a23bd8c0aa51b3d5716c27b69d4172c13d",
    "assets/template/game/audio/vo_mission_start.ogg.import": "2acb7feada810ddc2cf7430dc37b94003cda00cbbd2fdec32e7b83f473650405",
    "assets/template/game/audio/vo_rocket.ogg.import": "4353d932a5c013aaa51e83cff7ce88c2f31ad547c1227c74016824fb9cef9d2d",
    "assets/template/game/audio/vo_spread.ogg.import": "8a37a1d4ae4f16a698cd6863bfa91bde920974941a69dce4625eeb2e3946a74f",
    "assets/template/game/audio/vo_stage_clear.ogg.import": "714f87ceb821c28c79a3e98eb017529b0bb7e18edd2b2ca7722bddb5fc9729fe",
    "assets/template/game/audio/vo_stylish.ogg.import": "8f4cec079341e6bb44d395589d0659650707015c4340d9996a08decbe180a508",
    "assets/template/game/audio/vo_warning.ogg.import": "bcf112ec22da7bd27023f48b5a069a433e974916edb38f7993e199e656e11852",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/circle_05.png.import": "017a69e048b368a82c46ea59b37bad27a3e607e755237113e5b073dd647dff8b",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/dirt_02.png.import": "b95072a36a16d4a8e01f59bad3ea30865770ace48f1e8c346fb5563f21961b64",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/fire_01.png.import": "f5d318b04e88d92df4a7ceed1265d05fe31eaf52fad541b19b514cc95811c078",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/flare_01.png.import": "b82ef138b3552e771376a0af04672f794b303923ab6e23b9e73326b1a0a1cb84",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/light_02.png.import": "9fd1b4044d3a6d8831e11865bdfc768f255f7488b994bdf99047f6fb7a491209",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/magic_03.png.import": "50c2564a7395796ab4b575fe11513bb654b84631ffbe279b8f77717c898cc957",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/muzzle_02.png.import": "1ef20b14b60ff9d769c78fab5f68deda45bde3eeeaad6f84047ac2bd32ecddac",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/scorch_01.png.import": "a90118e6f6f476c4b31fdbb2849257b6bbcc87b98bd01f8767b7cffaa41947f1",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/slash_03.png.import": "90329b958f981dc826faf1dee9d13423bcf13dbb1b2d2ecf015176c358e118ae",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/smoke_04.png.import": "054cbc176ef7406ed051ce8dc900a1a3e70df0b9e07826af84747e7e7b8350fe",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/spark_05.png.import": "1cf7aa97659b875ab60ca1cf08892e0876fb033b7bbfcd39f5d6755ccdd7c94a",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/spark_06.png.import": "f52721e3b25d2b7e36b2fdef30a55828cacbcb62013075fc09f4797269576542",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/star_06.png.import": "3b0f32c2bd8edbd0b4f0d5fa6c8f75f919f1065c594a424c130e0d0f14e0a872",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/trace_04.png.import": "9e7e6e0a81df577bf02252d00b4f0129897986396e2636048a73c10d90fcd540",
    "assets/template/game/catalog/kenney_particles/PNG (Transparent)/twirl_02.png.import": "8ff7ecdc8cf1acd68ada1daf244f930b4911e03c94d421bc68d22071a3d958a5",
    "assets/template/game/catalog/kenney_smoke/PNG/Black smoke/blackSmoke00.png.import": "4cb0ef7c2ce1822c6d92fb5c23191960c0cd1b0b60e824778a59d6ca89e07163",
    "assets/template/game/catalog/kenney_smoke/PNG/Black smoke/blackSmoke04.png.import": "7d2470d2764a46ce30774297efc542341c0a9201b0e415a322eef24cc43f6128",
    "assets/template/game/catalog/kenney_smoke/PNG/Black smoke/blackSmoke08.png.import": "87e9edc7a65c59bc303b775e89c286f2fefbfebbdc03c64179a944e017c766f1",
    "assets/template/game/catalog/kenney_smoke/PNG/Black smoke/blackSmoke12.png.import": "273ebab9f24d8bdd116e3df456a4e9df14c32bffce999641287f6a84e8e585cf",
    "assets/template/game/catalog/kenney_smoke/PNG/White puff/whitePuff00.png.import": "56149b217eec1462d77fb453439d9798cb34fd021c7a7647329cbafa468c2115",
    "assets/template/game/catalog/kenney_smoke/PNG/White puff/whitePuff03.png.import": "21aef784a3df42411abe1d1c78fb3810f0d8940c991576fe690104555b12c995",
    "assets/template/game/catalog/kenney_smoke/PNG/White puff/whitePuff06.png.import": "c69bb0d4a83ac7d4a3051b4b005753743b139eedaaa440986f705ab6af52bbbb",
    "assets/template/game/catalog/kenney_smoke/PNG/White puff/whitePuff09.png.import": "af937c85a4f1eccd67eda397e31aa0d886a8ec4bf9c5717c93ac0b91390b57ea",
    "assets/template/game/catalog/kenney_smoke/PNG/White puff/whitePuff12.png.import": "2ad6269c870b80cf345d84c8e1980aa3cfcd76f61bdfc906f230165953ef3743",
    "assets/template/game/catalog/kenney_smoke/PNG/White puff/whitePuff15.png.import": "43fef7b26fefef63d17db498bdbc38e0e495b8502a88131e4b7d6f43362f1302",
    "assets/template/game/catalog/sfx_crash/impact-crash-01.wav.import": "5dd5edac5cf69a3f1627feab881e9201254101a60ef025d814f3e44e03f6b284",
    "assets/template/game/catalog/sfx_crash/impact-crash-02.wav.import": "03f0c2df6198e8970fed85a383f094b42c927313a1c57238dd236e583169a733",
    "assets/template/game/catalog/sfx_metal-hit/impact-metal-hit-01.wav.import": "4962ec4deab186586910ddbf32cf65c8de65d9a9981fc550d43458d3b9890733",
    "assets/template/game/catalog/sfx_metal-hit/impact-metal-hit-04.wav.import": "80cbb57051e9464263a162b056ac6d8f86fc8debecbf2bc6ca3c5c2249c0ac8c",
    "assets/template/game/catalog/sfx_metal-hit/impact-metal-hit-07.wav.import": "20af15af4d2ebc69ef94a0335ff676064cd030d0a5565d0c69b7cf9634b32e60",
    "assets/template/game/catalog/sfx_punch/impact-punch-01.wav.import": "45580c42f1055f9399136a78670f4bfe92ee2b13afc09b1f4bebcaff04904979",
    "assets/template/game/catalog/sfx_punch/impact-punch-03.wav.import": "1fbea6f817c93794eb4264307dbb5a7fad69a39daccf634c38862f98acf81329",
    "assets/template/game/catalog/sfx_punch/impact-punch-05.wav.import": "da9207172001e997c8b030b9c2a9ccdc56fd69cca7ff6dd6e4cc0f0865c6624e",
    "assets/template/game/catalog/sfx_thud/impact-thud-01.wav.import": "df4c3fd830e9165ec055e9065484b27f71e7c28d6f6018a6ccff2ff3cdd3e8dd",
    "assets/template/game/catalog/sfx_thud/impact-thud-03.wav.import": "f610c624a80a42a43bdefdbf04f8a7093ea5480df23ad43afd1926ffa7c39ef0",
    "assets/template/game/env/bg_far.webp.import": "fd115ee41fe9326a0960f81fbf8dd67618fdeaea424005e6efc51c54604965e3",
    "assets/template/game/env/bg_mid.webp.import": "d1592340e8763bafaa74dd1d5d2355f2a6b849ccb105c9274aa5e1721691eb3b",
    "assets/template/game/env/ground.webp.import": "45ad4cc2feec1afee6e953265bf88e67ff749a8d566c38a6c85f95a4af75b9bd",
    "assets/template/game/env/platform.webp.import": "a7e12b189477b7f3690a426721c2f54d78b2cfa5ad43b219de62a87e4a24b8a8",
    "assets/template/game/env/title_art.webp.import": "76c1966cff39a89451866400f77aa994b0c26cf7fcad92a506bc6a6ff0f79480",
    "assets/template/game/flash.gdshader": "b6540287a56425297cb1f5229f6b5f35bc396e37338501b8207db2f35b2d156e",
    "assets/template/game/flash.gdshader.uid": "e9a9085fcfd0d92b78c8a5da0af3a90ae1bf8cb57128d650c75cfddfa2d55c12",
    "assets/template/game/fonts/BlackOpsOne-OFL.txt": "f67ca4a200424868ee8fcd5464d7b35ac1cbf7723f6bfdbd19a8524689fab9a8",
    "assets/template/game/fonts/BlackOpsOne-Regular.ttf.import": "cb67625bba1c43bd72016c185007e9643f1a382f1ee20cda0c80c769e2a1f12c",
    "assets/template/game/fonts/ChakraPetch-Bold.ttf.import": "ba6a44c63034e918bba39fa71cbacf335e41f32655f2583e6d179576cddb0d25",
    "assets/template/game/fonts/ChakraPetch-OFL.txt": "13831d02389d917d22fcfa6c79f98f8acbf61d230add0e73a4d4dc5f3bfb9e56",
    "assets/template/game/fonts/ChakraPetch-SemiBold.ttf.import": "0fb9e3dea034a85eae22dba31b3f8f170ef1f77f90eadfbe8d5a07271e0ef0c0",
    "assets/template/game/post.gdshader": "54cde492c403e87c904cb07bd30ef11695e24be604c7f5c593e819cbcc87d2a3",
    "assets/template/game/post.gdshader.uid": "fd5fdabd43d50d039fcd865e03f7bd8a4b0830974ca3cf63b9942ea45665a882",
    "assets/template/game/sprites/boss/frames.json": "e16715b3a99d499867552187d509365f62c10b816bd34a5b651d6006f43e21fb",
    "assets/template/game/sprites/boss/hull.webp.import": "3423460a5eba32b89a9687d059aa8dc17a0df791b7ba6116d93504da55130afb",
    "assets/template/game/sprites/boss_turret/frames.json": "5f1cc89fb72a3c81608365e5804cd9be9dc8cd6866eeb739d0d79c156b57ed2a",
    "assets/template/game/sprites/boss_turret/turret.webp.import": "6b57ee13ee9bc068823422e3b52432155d7e4a24ff7efb2110ce941e6bc4f183",
    "assets/template/game/sprites/brute/dead.webp.import": "267ecdf5f1e1fbb010c2a005ea2338feaab92f679338c4e065e70f7a2016273d",
    "assets/template/game/sprites/brute/frames.json": "81778c2c8f373f74a3a656d8427e39fd1175ee0fa8dc191d578ae45cfd33c72a",
    "assets/template/game/sprites/brute/punch.webp.import": "2bb85207fd14847fe5a8a581b6f12517c4ba6c95203ee82a6d2c9076d9796dde",
    "assets/template/game/sprites/brute/stunned.webp.import": "9f54cb1e7997928f790e8435fa72ccc143939e47d2c328fe0c1d86f5c4805cbc",
    "assets/template/game/sprites/brute/walk0.webp.import": "7b717382209b5f72249d5fe3033a72ffe06c4d6a53eed1d6205eb4d574b39747",
    "assets/template/game/sprites/brute/walk1.webp.import": "d8896392155f2414d12d5f7cac760ba2651b5ecf89d6100e4263a21b031af0bb",
    "assets/template/game/sprites/brute/walk2.webp.import": "b855b8b8966180fa2b0e4ef9fcce171b2e426dd80f6d5d6e8c83cb9ff67c3368",
    "assets/template/game/sprites/brute/walk3.webp.import": "2defdf272b935e20a2e7a6c4c87e8c308f4b20deef71c1d5106f28dd905ca81f",
    "assets/template/game/sprites/brute/windup.webp.import": "68aa1d2f9abbfd7a989d0c642f5e48b977f2671de4cb1aad714745e60ba7abe9",
    "assets/template/game/sprites/decor/agave.webp.import": "f910bfe2de0c4ea1992d55911ece0016af0a2352eb82d02d95c85a8374b4389e",
    "assets/template/game/sprites/decor/frames.json": "e975faff487ef910e6cfa6b3af6f081b959ef92757372113bd3254aec6d2414e",
    "assets/template/game/sprites/decor/jeep.webp.import": "e77324ed11b764e270cd27131b8cbcee42a79899b0d6491e48a409f2ab224fc8",
    "assets/template/game/sprites/decor/palm.webp.import": "081f9c99200f0f5beabeec549c83aa31c7198edfe4fb95c580947771aa69c6c6",
    "assets/template/game/sprites/decor/rubble.webp.import": "ad4f3e131f99f21915eb8f7f2edb9d0a0edafc4ad6faba470978f246f26a3b3e",
    "assets/template/game/sprites/decor/tent.webp.import": "84c0c75ab12f787af1071ee796384c74029ef787ca8c2ec6bb21e923aff9d0d7",
    "assets/template/game/sprites/decor/tower.webp.import": "0e93becd532e404da54c767d2acf789246038f5674848a8077ad4fd35107ac8f",
    "assets/template/game/sprites/decor/wall.webp.import": "5bfc50b118f557670dc4a8a92fe5dfa6d249aa1c5faf49d9e8bd69d5263a14da",
    "assets/template/game/sprites/decor/wire.webp.import": "884a337a37a2a8d5130abdba2fde84ce4f34c88d09a9963420816759fe96f3a3",
    "assets/template/game/sprites/decor_canyon/boulders.webp.import": "e5cfa599666c0af0e909fea1a591438cd4cb6b338ec11a814774408f4fafcfd9",
    "assets/template/game/sprites/decor_canyon/boxcar.webp.import": "0e66177c27ad88f4aa3fa3322849faf7074d17f21e6e15329e3cd81db67c0563",
    "assets/template/game/sprites/decor_canyon/cactus.webp.import": "b815feaf85ac196d4aa4bdd99607f5a3dac9f38368bffc81c1d0bd870dc45863",
    "assets/template/game/sprites/decor_canyon/frames.json": "e1377130b3826cd5fc5aa184b6d4a9bfc564859dda10bbbecbf0fb2a8d392967",
    "assets/template/game/sprites/decor_canyon/hoodoo.webp.import": "bfd8361c0efa638999d260508d596f458896e475a6351e8d2c6d3b3aa7fb4996",
    "assets/template/game/sprites/decor_canyon/minecart.webp.import": "ac83989b589c3f125e556abc4855a924dc9ab47d00c258aa9ca538a3f0c5be37",
    "assets/template/game/sprites/decor_canyon/pier.webp.import": "9a2505fc488f73a818c7090b16ac4c5bc08b9cb65e2b218c284eb46d9febfcca",
    "assets/template/game/sprites/decor_canyon/skull.webp.import": "11ef1631f1f4d5bea59ad77faa1a3741bd3a2662edbb034ae8c794916a762cfe",
    "assets/template/game/sprites/decor_canyon/water_tower.webp.import": "0bc1eabe74a33082b014da77f2ab1f82a666870212bf67ea19d639ac1a4093d9",
    "assets/template/game/sprites/decor_fortress/banner.webp.import": "44d893bac3434ac6fc8c586c68004bea40e87a10641de4cd82854c45e8c0c7c1",
    "assets/template/game/sprites/decor_fortress/crates.webp.import": "b748ad346fd6c9f3eff288bf2ad1db05826daf24b8d7c1baefe095b7e15ef27f",
    "assets/template/game/sprites/decor_fortress/frames.json": "eebef330bb3acea9752511805e40a9fde15486c9b2605595cfbea1fdd3da1fca",
    "assets/template/game/sprites/decor_fortress/hedgehog.webp.import": "9dffc5256866f81473fa06598faf5ad07bae5edef4681e03537d888b34f999f9",
    "assets/template/game/sprites/decor_fortress/jeep.webp.import": "4471ca46d064cca6093cd29ebde9c836716398ee3be0ca5621012bdee7dcd239",
    "assets/template/game/sprites/decor_fortress/pipes.webp.import": "267afecd8ac1dfad807b5d841005430d049d248bf0699abc794733e3ae27d71f",
    "assets/template/game/sprites/decor_fortress/radar.webp.import": "d756ced1cbe1abc0b0f951e6d5510ffb2e5e088908e7feab4f80b627e6bd93c5",
    "assets/template/game/sprites/decor_fortress/silo.webp.import": "6fc3107afb0f36ae848f4fc372bba9108d8bffd2773e33993785e8381b9b1dfa",
    "assets/template/game/sprites/decor_fortress/watchtower.webp.import": "b5cecdcb0d6ee87f9745b68b35b9b124516dfc286bb6be30dd88238bf28de041",
    "assets/template/game/sprites/drone/drop.webp.import": "b3bc7c7140ba263b33e0cc010a62d34191f1b55f74477a9699f4d566623736d6",
    "assets/template/game/sprites/drone/frames.json": "2a528727c2e975068c4c2fe896228d71a89c94943b3c147c9dd1ddcd197c97c9",
    "assets/template/game/sprites/drone/hover0.webp.import": "ca491d7a83681b8a100fb194c4876d34808208f950bdd70efad3778ad5277fc4",
    "assets/template/game/sprites/drone/hover1.webp.import": "51d84b025689d393aaac8df0abdf419d3bacd67f74c85188eefb4a160c9a638a",
    "assets/template/game/sprites/drone/wreck.webp.import": "57c7f5362ad7a0ae57858d85ca7395366c5c1f2436ccfbf26a9da5d34ce272ae",
    "assets/template/game/sprites/explosion/ex0.webp.import": "7bce47362dea790b7b3b07e0b12df6c0959662a89f51a257b5b8319e5be9f3cc",
    "assets/template/game/sprites/explosion/ex1.webp.import": "ac45e9a71379a9d760c737da113b15b38ff9b1cb7c2079369c6d83efa7323ec1",
    "assets/template/game/sprites/explosion/ex2.webp.import": "8adaa04b57cc580c8c771ef43532bd6dbf89e0ee9e9768e224f8946dc0e73a2a",
    "assets/template/game/sprites/explosion/ex3.webp.import": "0195631e9ea4ca6783f93a0d131745d8db52aa17f2eeb61ee177b380c94a52a1",
    "assets/template/game/sprites/explosion/ex4.webp.import": "0f02d7a06ab07ae8f01f9d81e34fed03b38d14680ea4e55fc553309e8b4110c1",
    "assets/template/game/sprites/explosion/ex5.webp.import": "d05ff60fca270822a08861a220736f06ffe442fcd88191a08b8aef9c09f5c127",
    "assets/template/game/sprites/explosion/ex6.webp.import": "1af86e86f65eed8fb88a7ba8619e4e0796784a64df7deb63bf85ee2fd979c1bc",
    "assets/template/game/sprites/explosion/ex7.webp.import": "1e6a230f9e8b0aea561544fbd785184f6648c59424b5abfc8ab333236b3ebfc2",
    "assets/template/game/sprites/explosion/frames.json": "794e601aae926addb78eb3077f23944483c0a432c2d932afdea11296befde917",
    "assets/template/game/sprites/grunt/dead.webp.import": "f355cd1067291e95da31095bef91c2bb0bf3e5864672629caeb2c9cb91b21ab0",
    "assets/template/game/sprites/grunt/fire.webp.import": "cb5a73030a99c2c5ddc6295f8e3d14300cf64ab1cafca67976390e9ad697db26",
    "assets/template/game/sprites/grunt/frames.json": "97b4625d2671cc3a9966484baca1d1d90950b196c00f57b9dad37195162a1376",
    "assets/template/game/sprites/grunt/grabbed.webp.import": "fc3cdfd4b6f3fcee35a94cb663619029b9f10f3015d74b4212955fbb24b53f23",
    "assets/template/game/sprites/grunt/hurt.webp.import": "5669a60ed28020bfdeba770111bb8be851373f5f5cd76daa3a203feb9406116f",
    "assets/template/game/sprites/grunt/walk0.webp.import": "b956ab0a437fe3487ef9524151a0749e7fc55f59c7d9c71a643af1ffa079a044",
    "assets/template/game/sprites/grunt/walk1.webp.import": "9eb48815c8761e16136791292e696160c5eef7d7bd3f2863a4d1626e0b025ea1",
    "assets/template/game/sprites/grunt/walk2.webp.import": "04454938f403879b3edc186d869d04167cfdc9b559f9926f908b929022c2a682",
    "assets/template/game/sprites/grunt/walk3.webp.import": "ce48328cf40b420206baf7c6ddc25a6eb8782fb130e7efdaac6adcfd6fe60b57",
    "assets/template/game/sprites/hero/aim_down.webp.import": "4236a7fac0c95de54de646c012379348c2cd2d9ba01fff183921f16d15ebaf0d",
    "assets/template/game/sprites/hero/aim_up.webp.import": "91bbf54c1cc1559c01983cdbcb017bbfc612852a9f3f8fd7f1a271f55382e63b",
    "assets/template/game/sprites/hero/carry.webp.import": "00ddc3440373fad14acafaf34d238fdd2a99c811b1c8f99a50f1c493fb2d0b9a",
    "assets/template/game/sprites/hero/crouch.webp.import": "d85170b3f1238ea808824356e08ae2832065405307c60256e95dcc83affbf532",
    "assets/template/game/sprites/hero/dead.webp.import": "d377e87320fab1dca79b3d739c15691c18fe3f519cc004bd1d1e36736355a3e2",
    "assets/template/game/sprites/hero/frames.json": "cbd82ce481ccaed1f5a8860d61285c4d683fe46143e85bfccd19a1110d02b970",
    "assets/template/game/sprites/hero/grapple.webp.import": "61529ba5f68f2e343ba6932d2917f224a5586f0e4a65855d5581fbf58b639ff9",
    "assets/template/game/sprites/hero/hurt.webp.import": "f402cc445cfe35aeac1295646ec7d71fc211f39fdac689ab8d4bad5c44c081a5",
    "assets/template/game/sprites/hero/idle.webp.import": "c0d0eb9fb8e5faff5eb8d86c9328f2386eb86b89a8c95d569d410dd1fff0a3ed",
    "assets/template/game/sprites/hero/idle2.webp.import": "6a723db7f6917e4fb0cd77129471daad2845c6413910b5f14a788335faf986c5",
    "assets/template/game/sprites/hero/jump.webp.import": "e9f4ac6e35cbbceabbdfc042eb6868493c5259ff3910762dc2c4b5397aadba49",
    "assets/template/game/sprites/hero/slash.webp.import": "f6aab219dd958235699f7de5f9a122617aa802bfdd671956107c149ab2c9fe10",
    "assets/template/game/sprites/hero/throw.webp.import": "b8c591632986cd94861771df34543c5e9f864540e90e0e8b8295c5bbcaf152a7",
    "assets/template/game/sprites/hero_run/frames.json": "d69a93f3570eff5f76438a4a0cef2a9197b5127fe52481d517902a03647adb53",
    "assets/template/game/sprites/hero_run/run0.webp.import": "b8161cd17ac66ec1012858c11df987b9faf68266a14bac38142ea760924fd0eb",
    "assets/template/game/sprites/hero_run/run1.webp.import": "3231ba882b9eb1b077a08dcabf23cae570fb9c64aceae1e5d1d2e83659a66acb",
    "assets/template/game/sprites/hero_run/run2.webp.import": "f1a22507214231655ed10278e645a1c1bd50564b46a50bc83b570721c1cefd9a",
    "assets/template/game/sprites/hero_run/run3.webp.import": "2c394a7a523ffe6a506b56469f51046dbdf96f25d89ec10bdc314858e0dfcdef",
    "assets/template/game/sprites/hero_run/run4.webp.import": "604874b4011ee87a844fd304c1b5fde9b3c8c3ad9b8361e66e246c0b4481b5b8",
    "assets/template/game/sprites/hero_run/run5.webp.import": "2baf1f54ef1040060f3e2c61bdabb2d78c8bf1e450c0d91789cfdab7f8b7dda1",
    "assets/template/game/sprites/hero_run/run6.webp.import": "b5aebf5228af26d52b2ba3c8c5e0f3b7319a16cf71d33c8e33981ae44529be45",
    "assets/template/game/sprites/hero_run/run7.webp.import": "a8bc70e23ad0461a8267f2afdf71151ce1b0a0c49bee6dcf2178a6add16d0aea",
    "assets/template/game/sprites/items/frames.json": "3e94247c626c6f3504bc556706d25176eff68cb6bbe4be9e0f79d83aac45ef7e",
    "assets/template/game/sprites/items/gold.webp.import": "68f6c4b9d7c9fe56bf46ff7d34846e576a536ba9a90248e4f42273ed651d06ea",
    "assets/template/game/sprites/items/grenades.webp.import": "7c668dc37918aaedc0f0245cc6c3556f34fe8c674158a91da970b8159a8a45af",
    "assets/template/game/sprites/items/hmg.webp.import": "3ed6b5eccc65a8af71cd827afd862ef49714260d764a5219200b4324dd846593",
    "assets/template/game/sprites/items/medal.webp.import": "e9972eb16fcb4d4e0b2508eff0e0ff408aad26030038d8faad1d6eb9afd89512",
    "assets/template/game/sprites/items/medkit.webp.import": "47f908375194b62e1f273770b79a96cbabe5c22a5d83611cd905da13bfdafd95",
    "assets/template/game/sprites/items/rocket.webp.import": "1f77e20381c4af75f05b62c09fcc35dcfa9fa7047b407021363f032c81883b77",
    "assets/template/game/sprites/items/shield.webp.import": "fe60159c0bec3a22925bd34b59363e5a9f22300ce4801c62dd433c7281e73747",
    "assets/template/game/sprites/items/spread.webp.import": "a0a66025bf3deabbdab7a2a7bb40d5209b5e97db2a3752414fdda3f1e5c2dbfa",
    "assets/template/game/sprites/mortar/bunker.webp.import": "a2c30cd04b6dd94312ada5c42921eb02a686edeae1b0dd57cb7e4a780a602744",
    "assets/template/game/sprites/mortar/frames.json": "d05bfb0e819457866a485366aa28d7b8ede5c78b0529d2344de592822c1120e4",
    "assets/template/game/sprites/props/ammo_crate.webp.import": "0d8c181e0b5d951b4a25da4eed4dd7d81c982e4a0519550b9940c023802dbeca",
    "assets/template/game/sprites/props/anchor.webp.import": "3a657748a8a6ebf6c904c83ff49d4c51bf0d3580ade01828ed503ccef0b9cda9",
    "assets/template/game/sprites/props/barrel.webp.import": "165b0d1056da842163f2f8cae1d3e3c623f6f187763643a87b41c403c162e8f9",
    "assets/template/game/sprites/props/crate.webp.import": "18eb99d64cf50227fb5f0f77c2bc2f8c5f0b62937adca336d412fab1ded02804",
    "assets/template/game/sprites/props/flag.webp.import": "adcf17b5bcd92393ab302415c5c8a94fd99da4467b583f524641687f80338995",
    "assets/template/game/sprites/props/frames.json": "db651c4adeebf0925ccc62936ef82fa6dbac970244d5adcedee4153fe3c225f8",
    "assets/template/game/sprites/props/pow_free.webp.import": "90415f94523c22b92d231cdb6587349e180483e66379198f63975ef073774292",
    "assets/template/game/sprites/props/pow_tied.webp.import": "367ed57e0d52f1f8f7eeb1335ab212e3da73934024ad35e506ec1ca64645e94b",
    "assets/template/game/sprites/props/sandbags.webp.import": "4200bd1e372a7fe5b12672e3038e4563a400a836b046d67e47caee0bb102e583",
    "assets/template/game/sprites/props2/ammo_box.webp.import": "8ba24b5498b44dd27d7a2538ccd7fd4d69cd9084c762ea52977f943a4416bb29",
    "assets/template/game/sprites/props2/barriers.webp.import": "2299ed0c98eb841d3af9eafb719eebf7d7cd54502f423d18866e218dfd0d2c80",
    "assets/template/game/sprites/props2/burning_drum.webp.import": "af0aadd3850c11979bbec3ace5446f08ed3c809a191239e807cf6019f4a1d1fb",
    "assets/template/game/sprites/props2/frames.json": "b6a1ee9d623c4aab1c068d8400a8fe213ad8a4910aee8a2f6bcceb450c29867e",
    "assets/template/game/sprites/props2/fuel_tank.webp.import": "c60a45940407696f1292b1c6ca55c84cd36f104ec681a35a33f029cc9625dea1",
    "assets/template/game/sprites/props2/medal.webp.import": "350e5875e4d50dfd532a5b23ee98e266d14f745e30fbaac7ce8e6eb2fc79bef4",
    "assets/template/game/sprites/props2/mg_gun.webp.import": "11d8c0422717299f89f2a925f88cd3071d54c2b8c46107c24dbbf3f9d13a18bb",
    "assets/template/game/sprites/props2/nest_base.webp.import": "fcdd84c793f346c5543b9580b5b58df49f500b46e1a68362add41aba2ac7f3d3",
    "assets/template/game/sprites/props2/sign.webp.import": "99063c45e99e543369de24654892205ae519c679f5ad4d2c43401fa12162b562",
    "assets/template/game/sprites/shield/dead.webp.import": "acf65578f5234a1dce39252af112da8cddbabb06fcc24a9dd532893296a85231",
    "assets/template/game/sprites/shield/fire.webp.import": "a02b8ff3b3536793c3efa637d77b71ca98f30a841ce347aade68ee14965e813a",
    "assets/template/game/sprites/shield/frames.json": "f18bd00cbbc2387eca1c752aa599cd8b4ac433a77f07af9079a6945f54be27e2",
    "assets/template/game/sprites/shield/grabbed.webp.import": "ff27cc123bb4d2bf9769a62207649cfdaf6501407fde2164618621addecdd9ad",
    "assets/template/game/sprites/shield/stagger.webp.import": "133d351a817d003608e07c532861987ea1c7c9f257d2284579cdf87f67597ff5",
    "assets/template/game/sprites/shield/walk0.webp.import": "5dfb5c995986e34c161ab5f2dc304daecd17285c0bb7cc3d47be156f64a80b59",
    "assets/template/game/sprites/shield/walk1.webp.import": "3c97ab5d74c33976d371fe5949a9c540efd35780ff94108a898cf7c05813b6eb",
    "assets/template/game/sprites/shield/walk2.webp.import": "395a04bd19e056158f42f6c765668557b2a24348db7b11d5020ad9fb90fda0bd",
    "assets/template/game/sprites/shield/walk3.webp.import": "c102d46e514bc91b658a9946b7ac172566bb0ab2b648911cbcc700c516d2d797",
    "assets/template/game/sprites/ui_banner/frames.json": "db80be503f903829c27fd5a1a4c3d760c06146a93e18695bafa6f24c7cac4b26",
    "assets/template/game/sprites/ui_banner/lose.webp.import": "545246f552f2a5d0cf3ccc7d700afafc04d37723184095afddfb137888d5299c",
    "assets/template/game/sprites/ui_banner/neutral.webp.import": "57a2488401f8c002821485495d1d5fea569c25709ce263d6c6c9ab620aab7266",
    "assets/template/game/sprites/ui_banner/win.webp.import": "447f28285a2aec54526621da50d3f19645cc8b91775ec6f67a81e34b0ca1019c",
    "assets/template/game/sprites/ui_bar/boss.webp.import": "f67866ee0b2b8572c4156803e9ec701c508610afe00eb2165b1a40585731134e",
    "assets/template/game/sprites/ui_bar/frames.json": "1b526d2d1ab92cc3ada64782e6b3e073a3f2db49f171dab326a4c91862cf4816",
    "assets/template/game/sprites/ui_bar/fury.webp.import": "dac8332765b352f27efa3cdd9afb9b36e1b077b3137ab0a786e54bebb4e3eec0",
    "assets/template/game/sprites/ui_bar/health.webp.import": "37792ff4bc00ca5fa041d214109b26d5d29b18e6859956b40bfcd6c788dd7b77",
    "assets/template/game/sprites/ui_plate/button.webp.import": "d6dfd3548e6dd4fdafb97ba8994f094d766e36337b9c2e343748968eca45e05b",
    "assets/template/game/sprites/ui_plate/button_hi.webp.import": "4c56099da84dfae28e4a3cc40966b256824d9d15af0e9776d828ff21ca33f878",
    "assets/template/game/sprites/ui_plate/frames.json": "47f639b51747c331e8b8da36ce32ff7d76ffdadfed9fd16bff1425fbf9a3ffdb",
    "assets/template/game/sprites/ui_plate/score.webp.import": "e97c5cdc375c311e27ea0eacebc067100b76fc0f67017128be3006646e51bc1f",
    "assets/template/game/sprites/ui_plate/slot.webp.import": "69c61915b3cd37a3fc7e8d29b8a7f8bf888fa43ef8c9d88bedb9790cafbf6548",
    "assets/template/game/sprites/ui_plate/slot_hi.webp.import": "d975fa913fe02514a61b5764d7d9daee440bd7e1508eea83d6d1ae7514aa0b37",
    "assets/template/game/sprites/ui_plate/weapon.webp.import": "e4dff142e5336815c42115ef514575d2fc49c880455845db98c166ac3d51e6d7",
    "assets/template/game/sprites/ui_portrait/frames.json": "458dbd18cfd7901aaf79c1415ebf49fa640afad45487f3a5d45816ed44203d7d",
    "assets/template/game/sprites/ui_portrait/fury.webp.import": "37622151468b76c47a40d261ea5b7b753f3cc7f4e30415a56319437280a6606c",
    "assets/template/game/sprites/ui_portrait/hurt.webp.import": "109edba24381c2f3061753854cc2c6ba54d04b66e283881899f604266a70de71",
    "assets/template/game/sprites/ui_portrait/normal.webp.import": "7c5b89d0792683d038508e11211cda3947c6a36235b9bce81aa0651f951324a7",
    "assets/template/game/sprites/ui_rank/A.webp.import": "630095a9fbbfb731e6496cc0e0dbe15ed177bdc480a6ab6ed968eb023633c0a2",
    "assets/template/game/sprites/ui_rank/B.webp.import": "0f55c64fd0cbdf5c9175f903df7670e682eb15de9dc2f19ecffe494d9bb5930d",
    "assets/template/game/sprites/ui_rank/C.webp.import": "34d8f26cf8c81370d05e2d3e7594cf084b21d22510151361870be42fd0b941e2",
    "assets/template/game/sprites/ui_rank/D.webp.import": "6580a2853e1ea22b2d36ece734c2ca891d6ac2ea7d689c117bc199f7bce9e643",
    "assets/template/game/sprites/ui_rank/S.webp.import": "b6d13d4f46762c39642c85943f4a1e73e24f23343726c9b9a4da5b175e6af24f",
    "assets/template/game/sprites/ui_rank/frames.json": "d1750774f454bb08b1074defcb0eac7ed0bdf9612ab09ea4630c61827c86addd",
    "assets/template/game/sprites/ui_weapon/frames.json": "76542d15e72253a613145a71f301aac1f7da758b1eb9a3cb919c5d9ccb7563eb",
    "assets/template/game/sprites/ui_weapon/hmg.webp.import": "c127bf4a7d9db5a8aa4808182facdf1083ac73db31b1e7d28fb3c599bdcc5a88",
    "assets/template/game/sprites/ui_weapon/mg.webp.import": "5a9ad243099c6c3d7efa57e619936f78075c48e04629498d37f2951c599764fb",
    "assets/template/game/sprites/ui_weapon/pistol.webp.import": "272489a29210748ab03ec30b9e655b3d29cd010d26f94a3567513af8f5468692",
    "assets/template/game/sprites/ui_weapon/rocket.webp.import": "4c588ae8a1c2f193d2ddfff2ce83518e16a1349e5df094e2c7a1f3848a6779e1",
    "assets/template/game/sprites/ui_weapon/spread.webp.import": "bc0b40bb17b65a4a27c2b2d035816cbdc480cbcb58009acf6b01f683c443e7bf",
    "assets/template/game/sprites/vfx_a/flash_hmg.webp.import": "7f4f88da37650dabdfb8933066e47aab2557a18893c5ca24897a68d94a4eae8c",
    "assets/template/game/sprites/vfx_a/flash_pistol.webp.import": "245418cf35432d8542a28c39a8afad8da144a41163586bd34707231f9e8c0c34",
    "assets/template/game/sprites/vfx_a/flash_spread.webp.import": "e96f20c510e47c28cce7c4880912a941447bcf4404a63574252cbec0b50766ad",
    "assets/template/game/sprites/vfx_a/frames.json": "3ccfa4e0c2f2466565d2f0a101e5beb9e6fa436fd3a58041341c57e7d985cd60",
    "assets/template/game/sprites/vfx_a/glint.webp.import": "488503a290bbc5cdb9665483782b83fef3210625a799adac146a9b78478673c6",
    "assets/template/game/sprites/vfx_a/hit_x.webp.import": "95878e396c5ae348768094d90e3a23b30b3eb06340c4952605ce8709397f767f",
    "assets/template/game/sprites/vfx_a/latch.webp.import": "6e2c2b54417d380afdf42991deff0ca4925ba4db7b58db2dfee2d0999aefe3e6",
    "assets/template/game/sprites/vfx_a/spark_burst.webp.import": "f82c244cf1c41f5e63b9893ef0b045e9151a8082b0437598f1f39984611f6ef0",
    "assets/template/game/sprites/vfx_a/sparkle.webp.import": "8c8a251585aa1f2fd9b3b364610bc55241873423524d6114ea7b0db36b75a46e",
    "assets/template/game/sprites/vfx_b/burst.webp.import": "06e1913a43721a3019664245d24d02d053c146b8fe71b16da5ac7a96b2fd163f",
    "assets/template/game/sprites/vfx_b/fireball.webp.import": "68d91651ba8caba5e82d9934dd269c7969826855e41ba81b33ab4e76ac5e4ea5",
    "assets/template/game/sprites/vfx_b/flame.webp.import": "0f162b5677497ca174efeeed6c68fd3260fa461f7fa4647ceb8030bf3b8a7600",
    "assets/template/game/sprites/vfx_b/frames.json": "4b6e248e4b2880b07b755d44b9c2046cf3393b6af1f49521d6b13695fed1bdea",
    "assets/template/game/sprites/vfx_b/heal.webp.import": "e3c9baade5a70409e1b1e68202ffdf8c2feeaea0e7ff677f85520a9793a72088",
    "assets/template/game/sprites/vfx_b/laser.webp.import": "f9e4b571ba8840d87d7f7d81b07b7f249608689afee20f28f357b51784618d00",
    "assets/template/game/sprites/vfx_b/orb.webp.import": "e2e1e01c2395f098f5613b7345d77f4d1d5eec3fca8d9f87c3fc643652bf91ac",
    "assets/template/game/sprites/vfx_b/ring.webp.import": "8deeaa6a8717769bf63e84123447db743133f6660312de6037222e853ac1a883",
    "assets/template/game/sprites/vfx_b/tracer.webp.import": "051fb8822791278e24ebe1812b08865e69454c4ea0cc45629251f7d6aa3ed265",
    "assets/template/game/sprites/vfx_c/casing.webp.import": "ef1b8b18e5261e9f9921d3f638ec1ba66a3ef53f39370c7b19559b4cf3266786",
    "assets/template/game/sprites/vfx_c/dust.webp.import": "7443f78cc4f0efdac85791e7732f55fa4d87c3cb6610d6805fc114cb1a27d0c5",
    "assets/template/game/sprites/vfx_c/frames.json": "022f608d364d834c2c38e895da4d756a597103b05bb6df5c76b59352ffd025b1",
    "assets/template/game/sprites/vfx_c/rocks.webp.import": "4ef4ede0478a610bd1544eff5f54f6bb9bed716fc77d184a7d40b95bc556d8bd",
    "assets/template/game/sprites/vfx_c/scorch.webp.import": "17ba414f4f964fa7c9a8dae3888892a73f9bbc844fc3b363114763a212e824ef",
    "assets/template/game/sprites/vfx_c/shards.webp.import": "f91bad4b4ec86f3ae2b3ffaa3cadefbcb999b7c83b7abe709b56fa1a1cc50721",
    "assets/template/game/sprites/vfx_c/smoke_black.webp.import": "1446b08c4f9af34d5ab56af54a55e5654aa71623648ffcae550aee7f20509a2f",
    "assets/template/game/sprites/vfx_c/smoke_grey.webp.import": "60a60022b385afa5fe1dc16780aa7578563a9275a47288a36b870716db3ad963",
    "assets/template/game/sprites/vfx_c/splinters.webp.import": "c5240443e63e44fbeda328a64eca146448c8610be02a00df8778d98ac02dbba6",
    "assets/template/game/stage2/bg_far.webp.import": "a4d61a0f68dbbe24ec33c868b77fc2aa7a8655c3020b4027e2d39731dea7f548",
    "assets/template/game/stage2/bg_mid.webp.import": "156b1393631b77ac86a6f16d1b4180e598359b2af3727258dbe818c707739562",
    "assets/template/game/stage2/bgm_stage2.ogg.import": "bd6d81b22fcf92b502e9bc7f4c183b12741cbc98c76cf15fa18cdf6067cb09c5",
    "assets/template/game/stage2/ground.webp.import": "69e18be6ccf3f2313b122d3e1798adb5345502f9e1bc6702d9adfb7649f6be61",
    "assets/template/game/stage3/bg_far.webp.import": "37bbed7e5f4246669d0e2cffad9b40c0eb166db81e3d8a36980e507c4ec0694f",
    "assets/template/game/stage3/bg_mid.webp.import": "f081b4272879a6624e08597eeaa6677460adc54ee5cf7248df080a401b1b86dd",
    "assets/template/game/stage3/bgm_boss.ogg.import": "15e991c2bf87c011a5de857b7a914a40cbfdf9c0f90c589d2c22ab9fb23bf26d",
    "assets/template/game/stage3/bgm_stage3.ogg.import": "2d8815a0f13a88abad3e5688c995bfc2edd3fe355c42ac0d4ccfb849e5187b43",
    "assets/template/game/stage3/bgm_victory.ogg.import": "54f591fd9e71712e6b7cec1654fc5188a9a61d709b770f275d33265f5b6e0d58",
    "assets/template/game/stage3/ground.webp.import": "203d2647729b93322e88013b03d88ed10c46a4bdebd5acab22735fc7dd0510bf",
    "assets/template/game/ui/logo.webp.import": "9ef72b0ba1adb38f001a1d9247c3cf350930c9c0e336609a9f67b1acd75fdef5",
    "assets/template/share/favicon.png.import": "060618706810ceab3fc705cc89b55a15fe7a87c2ef7db0b25b3d9e3dbc51d27f",
    "assets/template/share/loading_bg.webp.import": "e27c2909ef2d94d9f443cb099688f15e6454207f6e6901529c1569b6b07acc71",
    "assets/template/share/og.png.import": "12a66021c003568e3829c05c8b20d85a2cd931780e496f09eeb777bb67868701",
    "autoload/i18n.gd": "cfa9b12ad6260bfea9377fa57b2e3c676331847bc9f17593007ef11046c838a8",
    "autoload/i18n.gd.uid": "79315ede2602e22fac8320e05843fe44a25f8e795bc312a3932556e8b75be6dc",
    "autoload/manus_font_theme.gd": "7b0469bda3bf15aa55713bc8c37f158ba32bbc214b9712c118b1e590a4faa6e0",
    "autoload/manus_font_theme.gd.uid": "2aac70bafe2d23401b20b2a79d534a2c5e89aa2455f84af2eee526406ec60fda",
    "config/tuning.json": "219615e7445fbc0f76b31fc9bf2f5322ea45f598fed753d44e7dc2136016562b",
    "docs/CONCEPT_PROPOSAL.md": "f84cd4eb28ee2e087ee2b4234b893aaa1cd7a9d0772b6ee3724b2b50839860b7",
    "docs/game-multiplayer.md": "af4dfd273e65ff5a1a547b7fedf5a61e039b0f8305e5415962533313eca3ad68",
    "docs/provenance/ip-remediation-medkit.json": "e224b80578cbd1c9cf28f58a76fde50a0e507e63ad7ac89ba56b4894ab29742d",
    "docs/provenance/manus-generated-output-rights.json": "4423a68df087cc39180947025d6b967cc56245003bf304f22c71539c98e69308",
    "docs/provenance/scroller-bindings.json": "72f7423ac81c5909ef8ee16004415ecf53d3fb810dc8689671fb1dfb4b5f82ed",
    "docs/provenance/scroller-generation-receipts.json": "2521c960bfe86bb7d6fdbeea6f5a5012a4c8de3c038ccc107ea5b1c0cb5f1e65",
    "docs/provenance/scroller-independent-review.json": "ebd718ba9a0107d7dd35dcbecf09dcf08c5560b850c19cbcd9c4ef5faf7c628b",
    "docs/provenance/scroller-transformation-excerpts.json": "1c9126901a7cc523ff94d7fcae06915276d6c2606eb478e7c7bdb3bbe46c0da4",
    "docs/provenance/unchanged-font-license-evidence.json": "92bf88367395ce00bc45b8f4f55cc169712535f8601f75c583a0ad871c4055e8",
    "docs/research_notes.md": "900d7988025c514f8cc416231bf3d2b683da1eb8390626630a7c107c98f41b09",
    "export_presets.cfg": "0a4c509ba5a3c7857ba30b4b177f5c1f99350d4af67a60fc4c8205fd66e85c6e",
    "game-sharing.json": "9e37a3f56f11e1d425736b865b9a464fb1b3de888d9674c163641bc2c58774d7",
    "localization/en.json": "e76d132f9eb7d5ea059f5b760c7c7622bcd3e40c0d6846c4a4c99328d2a907b7",
    "package.json": "6ebd727c7228a759717bdbaa22b8cba4b7e8b977af4dc0b6577b038e424690be",
    "pnpm-lock.yaml": "17c814b167307942d3609c7b9d916ceddb85839573ab39baa114e30edb132a1a",
    "project.godot": "26f953fa24367c0973a2388b3ebaf69952cf080c2112f5a44aecdeb63d45e82a",
    "scenes/game.tscn": "7281aed6166b68fd3305375bdbba64fb9890dd98960541b5cbdd906c6b9e57a1",
    "scenes/title_screen.tscn": "0d0090a8b8dcc9288a13c3e5b1613c26d7f58f5cd416aff5b1b06ed85e060f15",
    "scripts/actor.gd": "0ae8444caf24f99a298118c342200004acca6e3ea32e1a1a9f81eae2300ef8d5",
    "scripts/actor.gd.uid": "399b79e80857d2c904f9db2c34770ac47242d535e314f318f2669ede7ea0cfc0",
    "scripts/audio_catalog.gd": "82907a5c5a653d1dc88018becf154821f6ac2c80049c8227b72bbac00f99b6bb",
    "scripts/audio_catalog.gd.uid": "917e7d3f1e1990347e571f07b13c2f3e3931f2679fa1d2ca93b693bc8b2a4bb5",
    "scripts/background.gd": "138727ab1ac7cd46281d7408f212c4f3aedb021a8f38c3a0285a4f05112cff4d",
    "scripts/background.gd.uid": "661321fd982515dc248ee43ea1033967ff315e78238ee40304c53364d1f6a9d6",
    "scripts/boss.gd": "61df8c436f8d4839f55f1d4dbc8bf03541d3ee053675afebebc62b6909ce3f10",
    "scripts/boss.gd.uid": "583592e82916c023019ebd31d38628b53280becfebad94e52801b02e865d4582",
    "scripts/check.mjs": "9261e189d02afe9984abf635493f01da9b7c512bb8c67507896acca933d3688a",
    "scripts/decor.gd": "afa5235cd698defdeb6492af629c704c9e8d449eccd53b7f4fd0dfaabb78b878",
    "scripts/decor.gd.uid": "cfaf5bbfa68bcb32987f9403d2e65ac8d1de1f259a7484861d1971c40d6c8b91",
    "scripts/enemy_base.gd": "e2efb1e3255d8b70f75365e43ff01adfd0b6110e785561fe634f0870ba7dff6b",
    "scripts/enemy_base.gd.uid": "e8bb3d3fdf0a960e5e5316200df7e2338d3e5a92382bc020b988920bb3be36fe",
    "scripts/enemy_brute.gd": "5b60e1b04dbd93189747a379f8a97d1acd6b69113435021fc14cc7da9d20d7fd",
    "scripts/enemy_brute.gd.uid": "bc0af4308b01359c8ef5cd99e450d6e1aa18144168eacc70ff040b140feb9536",
    "scripts/enemy_drone.gd": "dd30f567706b95df30b5c9e466823f1634c2102dc199587dfb8e015d41408369",
    "scripts/enemy_drone.gd.uid": "d4a22eb4c20bd17b95056c730f7e64a141d602d4362afa2055dcfcb1f335e827",
    "scripts/enemy_grunt.gd": "42e868835152860c638c6fe0a33bfb0644e9bd43fe9d2a09ec76d5488d00ff8a",
    "scripts/enemy_grunt.gd.uid": "b78f44cbf9e1fb05b9f01daa50d80127a616835c09e96a631f430866f5cb3f94",
    "scripts/enemy_mortar.gd": "9fc08340d8e522036197a8a1d738ba9f017cab7a6666713b7ae3920aa2f9418d",
    "scripts/enemy_mortar.gd.uid": "7f04c6b9ee4b510da9fb2c01bb8da34a98608224bac0cc341b44d580829980e7",
    "scripts/enemy_shield.gd": "6e2d3b70068172ae707609ec54339f12908f5c3a73a9d0adac2b16ade6cf40f9",
    "scripts/enemy_shield.gd.uid": "0e45ac2d8255aa7cc6fe8db44d53cf1ce1b22dd17a55e33e985fb07eb18eaa51",
    "scripts/fx.gd": "9670c89e4e9b836862156acead5013e46aa0e011886df2e744bee8e70d850c78",
    "scripts/fx.gd.uid": "e165d50552da720aead47fce1b5bcbf4198b793de3a0c08a4f57a892708696a9",
    "scripts/game.gd": "bcee74b4e3da6473a3520adcec665e41d4f7efdb61c25440c137387e47251cfe",
    "scripts/game.gd.uid": "957e2361a12d2d713db7b1d7ee6f5796ca1ac45d72bffb492a2ff9923dbd37f4",
    "scripts/game_audio.gd": "73f90fe40762d8973d5771449d8c68f47dbb14c8ed5c07b2c007b17e82154460",
    "scripts/game_audio.gd.uid": "458bcc9b07bb2af42c0ff4b88f802d310bd12d5b02ed7a51a5a355db1f150356",
    "scripts/godot-check.mjs": "e2aa387455db65fa428f23bd7945451f5ef110c1bb2c5ab47431bf10f4c6ad30",
    "scripts/gs.gd": "ee1a872318a2fbcf77083c5da8d2855fd9beb86e4c73416747c950303c852b0f",
    "scripts/gs.gd.uid": "63cc6eb3e3198987ccf0f5435da3652f2877ec575744ef9e48a2354952fba10c",
    "scripts/hero.gd": "76326f67f2021ab019482ca8bf9c177dc5612821bfbe98a546a584096429339e",
    "scripts/hero.gd.uid": "7afb103abce86cc103ee904d5950715d94ba883495e389f58ad7c93466c11913",
    "scripts/hud.gd": "74f101172934e83d140d88a24b234b43b46736219d0439ac96c2e9ebe59819f7",
    "scripts/hud.gd.uid": "71f8698fb60820e9f3b991bd61107cb2fcacff158f181237180ed643a266cb1e",
    "scripts/level_data.gd": "ebb50ab9df374464906401136c64ba06c3ea2c573ea48b932b30cb84454f0722",
    "scripts/level_data.gd.uid": "d70a8c9028e3cf275515f086e5b4d9d1c632d4dafc2ebd70e34e4c3a40730d6f",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_backend.gd.uid": "c47c0e93d53914479b80a23947f5b25e7a11c2188d2a79605a945ff7c544ecb5",
    "scripts/manus/browser_bgm_player.gd": "f71867b01e48604a437eb85cde6d4e9ce4f6eb988fa39328f695f72d8e1f2b91",
    "scripts/manus/browser_bgm_player.gd.uid": "5102203696501c5b6972a10b8d89334b048ea237cc54cced935d39efec45d4c0",
    "scripts/manus/game_fonts.gd": "4c5db7b7e38b34626737b6ac82bb71c4dfab2442cb497aaeff3edf82c291e075",
    "scripts/manus/game_fonts.gd.uid": "385792c5cfc25f40559a2e88bf066c0a78a0040eab88965087f3773564fc6693",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "b3d28bf70d19ebab1a9c9b39f55820c20ae59b7a4ee1acd053ada11a4db98135",
    "scripts/manus/preview/tuning_adapter.gd": "7958d8d9aad46ec0874eb995f48b1f8839dd7632a045a41868006fc51533f919",
    "scripts/manus/preview/tuning_adapter.gd.uid": "59e0ac1a7557ed8d12dc3a8d63a1c1af459479b558d495934e8fee178d234ef0",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "f6610e7c3467468440934dc2ce2082b8880b34b72213ce42b66d50203f414f7d",
    "scripts/manus/procedural_sfx.gd": "91bd8364dbb2a65af4cd75d7d5a848b10d1fd52e96d11c528a43ab7e3d38b3ba",
    "scripts/manus/procedural_sfx.gd.uid": "f17b8f4ec4eb6ed01f985b32eba00d367965a87542611d289227338901e4b513",
    "scripts/pickup.gd": "0f67bbd6cc940e12780d59ec0bb0b52cb6456256746f624c8b0399a5d50401bb",
    "scripts/pickup.gd.uid": "d8b36859996d8efade4657b4f1439dba0909cc6f408fe4d063bda4e7b59800bf",
    "scripts/post.gd": "9741948a589513f854840aa7b3b80eaa20d2ff9863fdd4db88f453b9ae5a2697",
    "scripts/post.gd.uid": "1109535ec2154abec7a0857826d851af99602c9b9e9558ac65aaabd7e48ae0b6",
    "scripts/projectiles.gd": "7032d190b9207f09a262661116917a502a99040fae6242b19e6fa52c3982bd8e",
    "scripts/projectiles.gd.uid": "5a7f8253e6381cf36039be3c89a9b11f51ee700a4895697ce8ffdb9c815e115d",
    "scripts/prop.gd": "00d5333ca9acbd09ad03cdc2420ac6e41a21b7b871439a9055386d3d0fa14288",
    "scripts/prop.gd.uid": "941b17d972dae05f757ea389891d613437f368ad9fbe4ae2944645a5fb2b260e",
    "scripts/segment_manifest.gd": "2b9fcfe7ec354277d32faa0f3caa41eed28a66bc01d687eb3278e0fa6a4faa50",
    "scripts/segment_manifest.gd.uid": "67e641eb9c18218f1d64708d7552ee54fa864eb8d61a639e2deea595c451a919",
    "scripts/segments.gd": "97d9c38a4cefc434705175332b49d56aa64d369792347bd02ef80e6b3d62ade5",
    "scripts/segments.gd.uid": "1135910413645bc5118fa91edb67d020997ad531991c097e63c19eba3e8fbf04",
    "scripts/sprite_db.gd": "3d15ba49df15393bce60a1723492d48184358c5b21249b30d8abe5352b9c5009",
    "scripts/sprite_db.gd.uid": "6e9f43bc0fd4cd7f50b58fea1db114bde98be50990a89ac2254ad0dcad9eabc1",
    "scripts/sprite_lib.gd": "bdcc04fac37e7ec4d602bb1568eb0609663e0ba4cb8e3086ab9db2f5552f91e1",
    "scripts/sprite_lib.gd.uid": "f286a661e0fa7763733ccdfc1063f097032c007d02412419c7d909d2df0dea3f",
    "scripts/style.gd": "8598c6dff18fd887cbf91d8c230b1aedcb4de9306215a37ffe9a425875f251a1",
    "scripts/style.gd.uid": "5cb79e4b77898d6a5449d2b9a33845c2bc0397745a8d2553f6313352cdb5b040",
    "scripts/terrain.gd": "4c0eadd84507fd6b33d05f588412aece7d05de63a58b8e200eb79002557ce456",
    "scripts/terrain.gd.uid": "d6bac669537c321523d220513b3b731f2be8e4e34d52d6d0e84cc6fecf865c45",
    "scripts/title_screen.gd": "49a7f4cad98541ab8b7bde68d38a2548510c74a2c665b2e8e41ea6c0e0b6eed1",
    "scripts/title_screen.gd.uid": "13abf4c54283bc9c3cb8f9e8bddb260134cd2827500daf89228ff227afb3b8cc",
    "scripts/tuning_store.gd": "00efbfeccd6fb27d2deb23edac474a1d27c375de2e2c4dca93158421d6e68d4d",
    "scripts/tuning_store.gd.uid": "e6c07bec565dfb471d32077259f1096fa2549a965f613d0f741e77a1f821375c",
    "scripts/ui_kit.gd": "b6298fcdab9b83655505241e87457bfc085eaea7782fac764bc363389b2644e8",
    "scripts/ui_kit.gd.uid": "25c10fa71fd15bc3e8bf63f9823895ca161916d8abf3f5e8284272413d9abcb4",
    "scripts/viewport_policy.gd": "b25b84c751b201f5c66824a8fcdf51dbf6d005f6ed476063cb83aa25388a322f",
    "scripts/viewport_policy.gd.uid": "ad7f0f1a5b661fc4c10318f3cb071c916cb3f287cc1bdc3e91379a06397a50cb",
    "scripts/world_hints.gd": "8aed0d71b927b4877f4c2fc76370b90164018d5596bff0cbab122b9b6b46f771",
    "scripts/world_hints.gd.uid": "26e9e1d622773b284c8b8fff41261a3842e6ec98988d8dd9a39cd289359b962a",
    "scripts/world_object.gd": "7259f089b94e082b242246ff9ab34d3f5e89cdbe568762156777dcfcfb9a946c",
    "scripts/world_object.gd.uid": "24ff6120aa031c36d8ca84f8322ea9b4c65d11631f0831e7261d91a9914f8a8e",
    "template-provenance.json": "70f00d34b5b35c2467f8f7f7cb6b17fc73cb927f219c9dc71253e4287dc22cfb",
    "template.json": "8febf53458535c275bb253f013eb18a78c9bd534ce30a38e5ba36016716048cc",
    "test/bot.gd": "3a3b97a80a9ec106aef994d909379c7ee12a6efdedad887be554b536bd3c274d",
    "test/bot.gd.uid": "b41998ab252b4cfc6b47d4e2816dd735c1ebae1678b33d3682c58280bf47edd4",
    "test/capture.gd": "7d3b3ff57466704bbcbb9594ce11a97ca1b3722af0d41770889d326e4a9e1dfd",
    "test/capture.gd.uid": "6abaa71cecce57968c6d1123889bddca74a4239be44cddb41d9e9624aa1a689c",
    "test/godot-check.test.mjs": "3bbeb3e76f1578a23ce796e2a87d4d54af259852ecad868c934d5a39619a418e",
    "test/progress.gd": "e1b09a046bd8bd81aee4cf547b0603abacad8b598064fd1294aa1d5cef7df897",
    "test/progress.gd.uid": "1cf930ac34143e3c537d9b015f85c543f7d819fe291be94e85caa2557fd7c768",
    "test/smoke.gd": "ac7064e84b01d13f567d82272fd014bfeffb540f8995e9b7d86c256a7d138d47",
    "test/smoke.gd.uid": "0fe1b472b95a52da3f2bf9f48f6a8f0de09242785eb545d973353acd4cc03f6a",
    "tools/art/black_to_alpha.py": "4e2d3610f1dc927095ad274c02ff42f339727cf2742714c64f17eb20d2f77a5a",
    "tools/art/build_sprite_db.py": "4eb72bdd8a5795665a547477cf3dbd38f3554a7fa43cb19e065c0109e45d3361",
    "tools/art/measure_points.py": "ea2920ba372d27b59f1f1cb00aa33272264b933d4ccfc26d31bd1faffeb833a9",
    "tools/art/process_all.sh": "c848bcc1beb90a9c4e8f14136d9306f7fdfd930378aadda8e5cd8a970c741d09",
    "tools/art/process_backgrounds.py": "9ac447489eadf91dc62fca824841cbadacc71504e7786faa5df17321b0c9de56",
    "tools/art/process_share.py": "4d51a8f93bb2b00460a568032b89cd3a1c87eaa841bc8abde7350dd79e840548",
    "tools/art/process_v2.sh": "e0274228a2edd459984eb7ecaae9e0e1dc182384aa67fa938a566532e7901490",
    "tools/art/process_v2_audio.sh": "8579ab19ce396a3a7276451d00225d66219c537ad8f2414f0699180a50f0f122",
    "tools/art/process_v2_env.py": "6a256d42d45d5c60c964aec5ae196ec360b5e79488aeb33521fc1c057f3aaae0",
    "tools/art/rebuild.sh": "a9856770877083a0df75a33b606b87ad53a60278c84fc9cf071d1967983dc618",
    "tools/art/slice_sheet.py": "a25dd142676b07e81b181a712229b77f6b8d459058e9389f2ac4feb8db2fc09d",
    "tools/art/split_row.py": "c7c6a8e15ff07b44e8b4627b703a2029428d9ee8d5415823aafa891db8d44f2e",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/build_segments.py": "15c8cd746b62d3d2d0e0f17f8e4ecb79994a1f3225b6718b70d26bacd676b47b",
    "tools/capture.mjs": "46370d01c06a86bf355db2b340ff38d039096e7c8d1cb83f8995a948d3a5fc7f",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "tools/optimize_export.py": "3a63b8e59ed9b769eb79ef3d9043af83c202074f01d47b87ed88f49fdd0ec88f",
    "tools/run-native-test.mjs": "d5e3746b95d97e7a81f0a23eaa206c9deb1e79a7fd511700e95753e6f8f1f4bb",
    "tools/set_input_map.py": "fa761ca0a544fca463550f82ca0efcfb025cea54cf3f82c875d4b36e7bcdb13e",
    "tools/write_tuning.py": "e2dc22401b7fd8c22c1d2fce1f0d0bf3a92e808907a6ee2781c8eb43c917f729",
    "web/build-shell.mjs": "f0fbeb049d5146c3c188b1721d6e2bdf73b6083feb8f3122c47a77feeecf5cfc",
    "web/export.json": "abb327da1d19377e04250c0182204136e9f5b47c9e39fae3931820cad0517065",
    "web/loader-cjk.json": "6fce3b5f57c3f9f42f4052a7349abac3052ce3217e54bcc9602ed18abe322648",
    "web/loading.template.html": "8d0bdf43cddbd66f920b0680417f84aed69ec36dcf25ff09dfc29f46e492e74a",
    "web/manus-fonts.css": "4a358732ab3601458cdbffae1b2e15e7028efeb86d6ff3f0a587c353b6257466"
  }
};
// shared/gameStarterFiles.game-td-v67.json
var gameStarterFiles_game_td_v67_default = {
  id: "game-td-v67",
  files: {
    ".gitignore": "a67827c4dc7a6f83ad20d17d86abff7685f865c734084623a4a8c2f8964b5dc2",
    ".manus-game-template.json": "d0ea3d6c7b910c1203d717127c40338a3ebdf8c81fe8f9204e6fd5df8261abe4",
    "README.md": "00025e027558fbd926d2c73aae9fe6c1e1a56c75c64c6fd4107d714a5a099665",
    "THIRD_PARTY_NOTICES.md": "57ff626c03308dc64b595e5c3a71cfae4c0e8f2a4068ed9cdda73f3b95a8d959",
    "asset-provenance.json": "bae6b240d14f79131873b38694017a5863bed7cc41bda4a838516ce514a1669c",
    "assets.lock.json": "21283958815d390c0f12aef3edcbc4636cfe02dcc9794dda10f1f649f9e4779a",
    "assets/template/Audio/elemental_sources.json": "c02f0e2894cbb78163f71217c193dc9ee62c770024879a480aeeebbc0c28885a",
    "assets/template/Audio/illuminated_back.ogg.import": "c1348607dbe0f78410adfb6fd9e82975a7f1618142d1839b3980a4346e8c8b37",
    "assets/template/Audio/illuminated_breach.ogg.import": "9e5fa6b92db911acba0bedd6d771d0d1f8fa353eeade384b1c948d4df50be02a",
    "assets/template/Audio/illuminated_build.ogg.import": "aef47885250e64c160ae6acfcc502d2404b9f0cf8736c2fa852b3c3b0c9472ab",
    "assets/template/Audio/illuminated_confirm.ogg.import": "2cac5e0c1e4abde4cfb782824a854f05088b0079d795c9d2abc44460230f3bc1",
    "assets/template/Audio/illuminated_defeat.ogg.import": "0d6c795a572fca37c6a0a1b6c153d233eb79e289ce9d3d2d84e44b44fe345655",
    "assets/template/Audio/illuminated_earth.ogg.import": "815335c4992a38c7f28e3da8625716ff910651dd6b729a10a2f05fb68834f687",
    "assets/template/Audio/illuminated_earth_hit.ogg.import": "49caa03d0a73e3abd8453feb81160ea0262c9d94443cd3f292e14a6ff11b59a8",
    "assets/template/Audio/illuminated_enemy.ogg.import": "a4236cc9858e69fe9084a261d102af2e0eaf4c880eb087fd6e86a54992369595",
    "assets/template/Audio/illuminated_enemy_brood_spawn.ogg.import": "613cf4e86d06c201ee3bf0c7ad947ae871f915466371ddf2a12c96d00f83913a",
    "assets/template/Audio/illuminated_enemy_harrier_dash.ogg.import": "ad8bf9697da4ad3839be2ee3bc96080e1c0c779f87968055938593678caaefe4",
    "assets/template/Audio/illuminated_enemy_shell_break.ogg.import": "c5dc169f6797e62a05b7134001e1e4ffa64c6974e09d653b27998a79e8e08262",
    "assets/template/Audio/illuminated_fire.ogg.import": "2970b99b34114427f86709dae908fc28214681db95d118c9e40d2127fec0106c",
    "assets/template/Audio/illuminated_fire_hit.ogg.import": "79650433f952d74f95fe92985a8e6a59c121694ab44877026df691164a16da5f",
    "assets/template/Audio/illuminated_frost.ogg.import": "84ed88640b183fc333f9e9c78b3f271079014abb8bcfc31a634033e4404ec40f",
    "assets/template/Audio/illuminated_frost_hit.ogg.import": "285035561677366b9ffca97aed80e80d313dfbeaf1c59b160ad9985d67bc36c2",
    "assets/template/Audio/illuminated_hover.ogg.import": "6d1d7666cab665ace053885a7b71cb5ab59f3296db4ef3d372ac28bfa11baf53",
    "assets/template/Audio/illuminated_invalid.ogg.import": "54b49a294612418829899ad03422086e92e4677f53f8f82fe5f452526efcc90e",
    "assets/template/Audio/illuminated_merge_success.ogg.import": "8f39001b09e765029fd37fe3c949ed48d550532af83601752f9f415390069909",
    "assets/template/Audio/illuminated_meteor_impact.ogg.import": "e55e2551626ff5a4b3fde61941501fd8bbc0524c88719b042597ff113925d9d1",
    "assets/template/Audio/illuminated_storm.ogg.import": "203a199384cfd6f382595ead7ca72cea499b1bba0c8500a242df57df4a4ef73b",
    "assets/template/Audio/illuminated_storm_hit.ogg.import": "ea9c6b9f4de151a5968a13c1ce085c44a53de0faee68cd196ac4f81ea8153681",
    "assets/template/Audio/illuminated_theme.ogg.import": "53ef66fc24c3e276d0c25b5e4480a601d3f7fc81cacfa01eaffd0058e8ed60fc",
    "assets/template/Audio/illuminated_upgrade.ogg.import": "3c5e24613922223e2b694788370f9f7a666c8633d8a33880a8536dba9065c4e6",
    "assets/template/Audio/illuminated_victory.ogg.import": "0b9184ad9f3c3da9cc6edbe5640f211410c827f1fba2f256f785d285da92902d",
    "assets/template/Audio/illuminated_wave.ogg.import": "2a5e8a0605bd1b60a5b056b70cafa885ebeaff3cbd6a4af7d1268f1a353f20a4",
    "assets/template/CombatEffects/blood_splatter.webp.import": "5b57d4957cc08a8216fbfd0e9e18e8403cf78a5d9281535ecde42dcd54f91f20",
    "assets/template/CombatEffects/earth_particle.webp.import": "17dcfe23a80502afcacc1c13f2cae1c07cf49019f9702148acf979b2faec34d7",
    "assets/template/CombatEffects/fire_particle.webp.import": "e2f911b47e7e27da7d90ab052e5a29eb1a674edd9458ae772e8b01b9be8563d7",
    "assets/template/CombatEffects/frost_particle.webp.import": "63292a837963b280e001b008bf93a8669948323ca6c67ca45d75e65c878cf34b",
    "assets/template/CombatEffects/storm_particle.webp.import": "a60e75aa24a29ee8926d1e6e275a483303c37b4a13eb8ef4c672268ea43642c5",
    "assets/template/Cursors/illuminated_cursor_action.png.import": "3a52cfb9184469c6b280900e1ed82d4c1c932f8da04fccfd3ca71ea839ca469f",
    "assets/template/Cursors/illuminated_cursor_busy.png.import": "bb72f0ddd95995078e586b526d3998f8361c2abfffd2eb7f23cea2b8b5d8c8b9",
    "assets/template/Cursors/illuminated_cursor_default.png.import": "53ee342e87fa97ea7f8b22668701d6ec10d3f2b33a69e67e257477a390f5f2be",
    "assets/template/Cursors/illuminated_cursor_deploy.png.import": "52a6e82cc2f44b1464929ba83d2f22ce7d4634b17240b791c136ea429e06fbe2",
    "assets/template/Cursors/illuminated_cursor_heal.png.import": "b17c0a7d946f8f9c485c44a041bb91e49c2f594cf62de9b56f70d1e02000c80e",
    "assets/template/Cursors/illuminated_cursor_invalid.png.import": "f52c40a3b2c989061eb1d85fe7895fecb4ba44df4cd24f86f114943d20f7205a",
    "assets/template/Cursors/illuminated_cursor_pan.png.import": "d98e61aca3cec7547f12c987dca3bfe9edb3486b7b15fea2dbf6efff6f79403c",
    "assets/template/Cursors/illuminated_cursor_pan_grab.png.import": "738e29cfe0a3c615fc575c25bd9d2d60a1969e7cc829c63f504ad35e48d482c4",
    "assets/template/Cursors/illuminated_cursor_select.png.import": "4573522a62a883f1b0404bf48a58a86be2a293e5616c6e32ae72270893633cb3",
    "assets/template/Cursors/illuminated_cursor_text.png.import": "01f409744358e31cecb835f1e47783cbcd7491dce5c84c73678e6c3b2e367985",
    "assets/template/Cursors/illuminated_cursor_trap.png.import": "b5a77ae5f960854139aef083ffa4b11ff43c5a56bf6b2ca0344f331b9aea2800",
    "assets/template/Effects/illuminated_earth_leaf_root_stone_mote.webp.import": "83f868ad98d359216ac2df24da9ea0013ab8d4525c88ba71b95cf59cc7c0d90d",
    "assets/template/Effects/illuminated_ember_flame_mote.webp.import": "43cc05a2cfe9ed0543da2e98ce3859a9d4f409a6df49ceb07a4c655570dcb75f",
    "assets/template/Effects/illuminated_frost_shard_glint.webp.import": "ea407733942c226c1579127d1d34497f068448e97795df747e1077b8fa64f422",
    "assets/template/Effects/illuminated_ink_breakup_splatter.webp.import": "eb16f473530168574b9023bf02bd82404a6d9e7addc04e9685bd9ac218e5e421",
    "assets/template/Effects/illuminated_storm_spark_ribbon.webp.import": "404a019dcfe06863da9b0532837d642845d8d4b93c750757f7f08edfa04dda7b",
    "assets/template/Effects/illuminated_worldheart_convergence_meteor.webp.import": "fee99dba49309a8a32ae460a14f45b1b457e5b8ecd987f472e32886beaee10ca",
    "assets/template/EndpointAnimations/illuminated_gate_idle.webp.import": "ba7051932b77b9e3f3bdd9fb28467a5927c4b3b7d53081e960b5007e9574b693",
    "assets/template/EndpointAnimations/illuminated_vault_idle.webp.import": "29c9fd206f5675f94f98d6c60b4529c826e9be8d0e595f0351bf7371097ed53f",
    "assets/template/GuardianAnimations/illuminated_earth_1_idle.webp.import": "e82e42939588b1342816cb8a5cd6d743150934a541a3415f550e2de7f7c707cb",
    "assets/template/GuardianAnimations/illuminated_earth_2_idle.webp.import": "67bdeda4f6559a66fda6df26badf2d033e9cb14204dd87dd946ddb8f80258451",
    "assets/template/GuardianAnimations/illuminated_earth_3_idle.webp.import": "c5b9ce9896fa06b5872600b7216a2f6f56f490ad2c2547cf9ec7710dccb4356b",
    "assets/template/GuardianAnimations/illuminated_fire_1_idle.webp.import": "4b2f7d68b5899960a9089597dd022ba28aa60b37ba6550825367784f75c8fe76",
    "assets/template/GuardianAnimations/illuminated_fire_2_idle.webp.import": "ce2ba4f65710a8c685e885bc778c60db9f13870bbb3fb9e1f58b52eb18528b1b",
    "assets/template/GuardianAnimations/illuminated_fire_3_idle.webp.import": "6ccddf90b3dee88018407f817768e2d3df3f2fbb48607399e115f5e6c4c322cb",
    "assets/template/GuardianAnimations/illuminated_frost_1_idle.webp.import": "c8a55eb289356ecb37dfd33f3c0035c7f93e8aa00c8f1f523d49f679baf02aca",
    "assets/template/GuardianAnimations/illuminated_frost_2_idle.webp.import": "7aab68f9f9214de1bdbbce6969ec83a1a3069e12db6f6e0dd00243074858c173",
    "assets/template/GuardianAnimations/illuminated_frost_3_idle.webp.import": "55dcf1773ad84d1c17235e8602e34f93b70f96d6e5c29eef527af6a0ad9cb236",
    "assets/template/GuardianAnimations/illuminated_storm_1_idle.webp.import": "65aacca52b03d523eab6a6da9dffda2c68cef4ec17a02f5d7bc24a55c7dbc990",
    "assets/template/GuardianAnimations/illuminated_storm_2_idle.webp.import": "fbc4609589142cf6f545bc24019ad14369f7a730c614a4c5ca125db101a0bcee",
    "assets/template/GuardianAnimations/illuminated_storm_3_idle.webp.import": "f9c5f0fd5624b977866137da7075546ed4e33acf07234655268655e1acac74c8",
    "assets/template/Guardians/illuminated_earth_1.webp.import": "2099fd951817aac1f8ec4b28ecc5be22dad9c03eccd3cac1443ab3931060969d",
    "assets/template/Guardians/illuminated_earth_2.webp.import": "89ac6abeb454fa9d806ae50a77fd4f370dfd7c44635ee5431adb2f2659a1772e",
    "assets/template/Guardians/illuminated_earth_3.webp.import": "025a4cfe37a86441df01c883626ae3c465d6bcb16806f578d65da7da055aaa13",
    "assets/template/Guardians/illuminated_fire_1.webp.import": "e54524c4f4a7a8cd473f99f8417a745464dff010c9998b37a18ddba8889ae778",
    "assets/template/Guardians/illuminated_fire_2.webp.import": "5333b9886f1ca28c902585d0da49c6a346974db5a895edcc17717ee882aea26b",
    "assets/template/Guardians/illuminated_fire_3.webp.import": "6a4ef8694ea51dd1b100e693fb4a40df4e8991f3d3e5508fd39024ac2807f51f",
    "assets/template/Guardians/illuminated_frost_1.webp.import": "7f54361e5b5e92c7c9c5cc5a07f8c611a140ad9af7e353498b55d95683a03a75",
    "assets/template/Guardians/illuminated_frost_2.webp.import": "1a0c1ba28ad6d048f5d75da7fedb64ad83df6d22326ec6607a4b795f3e8bf77c",
    "assets/template/Guardians/illuminated_frost_3.webp.import": "8c1b255050cf48d121f2c18a483b4b4eb2c4e1f3ca7e3f1f0fe02c9a8447f8cd",
    "assets/template/Guardians/illuminated_storm_1.webp.import": "4d0116ed364f6678276ef35f757b5a6e75bfbd61917a3138f26db2cb053bc0ce",
    "assets/template/Guardians/illuminated_storm_2.webp.import": "dbb994aece89d10613a6bc3e2e781780a198efc252aeb21728ca7e1f31c0f1b2",
    "assets/template/Guardians/illuminated_storm_3.webp.import": "e4283e6254b959d3c1a6efb5900b8e4683590e1de816c6b3b9acba158fb1c88b",
    "assets/template/Interface/BRANDING.md": "2264152c80da5d6f7871403e5fbec9ca4ed95d4cd47382ec14e3ed785c39deac",
    "assets/template/Interface/cursor.png.import": "87bca317587ffc1dd2bdca7fc38fc56277593cc538f73fae2f20743ae06117bf",
    "assets/template/Interface/cursor_action.png.import": "567d2f78c33db00e0825ace8876a6edd23555f083a53f597da0f8d97c8f71c82",
    "assets/template/Interface/cursor_invalid.png.import": "289a0231cc7c1f2b33167159d90967bfedcab107a6b32f0de7cf49c04c2f8994",
    "assets/template/Interface/illuminated_act2_restoration_seal.webp.import": "c61497dd97202a82c9a54eb30fb0041ebd638491941c2e0f02e561bf015b71e2",
    "assets/template/Interface/illuminated_chapter_accent.webp.import": "cd8a560be10146033782c569e0e0de51679f772f7dade3d0a4fd9fd07105c253",
    "assets/template/Interface/illuminated_faction_crimson_banner.webp.import": "d95923463728e34776e7e1113a28ecb40abf6415aa0cb8ccac6c10175513ed6a",
    "assets/template/Interface/illuminated_faction_crimson_symbol.webp.import": "084a3f54cac7e66f2fabb453c30347e147893021f704ba38ec86c9d71f5ad51c",
    "assets/template/Interface/illuminated_faction_lunaris_banner.webp.import": "8c44e2be58c91f9c4437787bf40de780c71d42fe42df0ae69906acd1c4e488ee",
    "assets/template/Interface/illuminated_faction_lunaris_symbol.webp.import": "a77b883bef7b1ef060b4dc5e217239e9ccad97f25f93e031499b687b180289a0",
    "assets/template/Interface/illuminated_faction_solcrest_banner.webp.import": "beccbc0479322bafc55d1c73bc5c967cc6f424de6a06794bfca1c03a0e9eb968",
    "assets/template/Interface/illuminated_faction_solcrest_symbol.webp.import": "fb8cab069caea827db83825b1ed570d02b6d2093ae1c32e8b69bc6c1c1ba3e41",
    "assets/template/Interface/illuminated_faction_vesper_banner.webp.import": "ae25c8a860527b45bb43bd8df99180fbcf45e8c9a3490ab93a6ea44fc8b50cf1",
    "assets/template/Interface/illuminated_faction_vesper_symbol.webp.import": "b49a97666eb9334f12591aa328f28bd8a9af815f937d3bb61113d16519e2492a",
    "assets/template/Interface/illuminated_loading_backdrop.webp.import": "266a2f904a5c9c1388bf0558baa66be96c59bce80444fde73dc7cd1e5b505ab2",
    "assets/template/Interface/illuminated_loading_seed.webp.import": "de2a07fe5c84dba3f246f209adda5d6875f88e870c3174572d27f687cd8932ef",
    "assets/template/Interface/illuminated_resource_aether.webp.import": "0eae0654c2a9dfd868d7280dfc95ec65c7acf25690df89867afe31b3f85f80de",
    "assets/template/Interface/illuminated_resource_sigil.webp.import": "1cf4487e9c91f082d967d2352ebb1820cfc14350954f1d951161f768ea45d4b7",
    "assets/template/Interface/illuminated_resource_stamina.webp.import": "6750c888af81b0266c6e319f2488c5708c1addd5c0743092d299a0d7110e11a5",
    "assets/template/Interface/illuminated_result_accent.webp.import": "2b5e6f1f2e5b8ddba38e3ef79ed65cc7f91e55260cc73c241a88e7b572983441",
    "assets/template/Interface/illuminated_seed_emblem.webp.import": "d41553f7abebb9452601c16499c5bee379dceeb3ac4e2c781d4c3ce4defcaf58",
    "assets/template/Interface/illuminated_seed_icon.webp.import": "45bbd41a006983fa44697c2d952718d348116679d33dd3f15a099a0ae1465efe",
    "assets/template/Interface/illuminated_seed_splash.webp.import": "1649bc6e53afdf2fe385babff57a953295e7e09297d8789df9dd5a4c5fe117ce",
    "assets/template/Interface/illuminated_staging_exit.webp.import": "c1eef70e7044a8555fd76a17f283d027a11f6816ed2dafe064d3f159cc66afa0",
    "assets/template/Interface/illuminated_staging_lunaris_seal.webp.import": "0435340a3421839945bcffcc562c451c77d795240bc482ca059c9ba367e99e86",
    "assets/template/Interface/illuminated_staging_mission.webp.import": "e893f2e065c4857973fa755c6905a917140d6800e4a33a0d278bc26253db55df",
    "assets/template/Interface/illuminated_staging_settings.webp.import": "892886f87e08b425434c32009750af732be94ef398f4dc45b280cc82bc2882b8",
    "assets/template/Interface/illuminated_staging_status_diamond.webp.import": "5978582c8a3129454fb7b70231d8206363d8afcdd3fea93c0029f2682e141e66",
    "assets/template/Interface/illuminated_tutorial_block.webp.import": "916b0c8050bacd0d1f874f67cf4ee2d3cce4ed4c9aa5fa4a69c3c5d6965fb3fa",
    "assets/template/Interface/illuminated_tutorial_deploy.webp.import": "81079e3e01e7644284af60401a24e207ced31a9d6ab32a3375c78b0dabaa92f8",
    "assets/template/Interface/illuminated_tutorial_route.webp.import": "bface10ff35618f835d0904bb366def7a18b08ae9701649c755aed374e356bee",
    "assets/template/Interface/seed_icon.webp.import": "0eb3dce170a001942b67af7a480ad0476ad7aad7ec36c209c0a5dc8ccd5bd32f",
    "assets/template/Interface/seed_splash.png.import": "6c5072387055560f155b63cc6d8a63973bc66a38488099e9da1b047cde015d10",
    "assets/template/Interface/social_card.webp.import": "4f55eb4e6d402547cc3ccee8019fe9f81bebee8ac7ddea4a498a2544bc0c642f",
    "assets/template/InvadersIlluminated/broodmother/NE.webp.import": "ce0ec2888c1d5efbc6dd424f986246eeb5c4ad6b2f0d1325fbd1b884e86fdcc0",
    "assets/template/InvadersIlluminated/broodmother/NW.webp.import": "84ccb53396f785f76c99677571b30ddc8445ef7aafe9fba829a2c498dd2555a0",
    "assets/template/InvadersIlluminated/broodmother/SE.webp.import": "830559445e072afd0bc9cb5e1046bbd9bf79e7c75bdc142baf215241eccce278",
    "assets/template/InvadersIlluminated/broodmother/SW.webp.import": "f8ab303cd11f57e158ab0bff0552c9d4f85c387c18812d1f04f5e4d36d570db6",
    "assets/template/InvadersIlluminated/broodmother/icon.webp.import": "6ddc81ebe42d78a215e00ac9c4040579f022dc2b5c8adb08f99e3ee37a4210b9",
    "assets/template/InvadersIlluminated/broodmother/metadata.json": "9d591c710e78d3abec329471f5ebdafc6a322386e55483966ad2cdbe40d2b022",
    "assets/template/InvadersIlluminated/dragon/NE.webp.import": "d49947ecfa28e0ad3f459851720ca5c545e5ac26f361fb18932d6ce924a11322",
    "assets/template/InvadersIlluminated/dragon/NW.webp.import": "bc6c40e372f687362126f55f78f526669c33ebaebc49b69833954d1157393a62",
    "assets/template/InvadersIlluminated/dragon/SE.webp.import": "6d28b49c2f6340bf7c340bd0724c10b39d64eb40fb490260d8eb3e8e51bc4100",
    "assets/template/InvadersIlluminated/dragon/SW.webp.import": "97091e311e5842fb4de0ffc42d9cb021d4ae0e2f38e2e1cb01acef19e6686625",
    "assets/template/InvadersIlluminated/dragon/icon.webp.import": "848ceca24b56f29e1733176d3b0b784c875d3cfc3ecdddb642ac868576adeefe",
    "assets/template/InvadersIlluminated/dragon/metadata.json": "de294ecdf7b9e5f00df6274f3e17a097dbf36061a0efb5e6f5baac09d02293e8",
    "assets/template/InvadersIlluminated/goblin/NE.webp.import": "b73e1f1959e4237095fc56467d675688c103e3c78d0c06b242e54916eb9dc352",
    "assets/template/InvadersIlluminated/goblin/NW.webp.import": "373dcf21a0811e2f09b3e606a6529649f827c9632f7a84983efd3c09e9467291",
    "assets/template/InvadersIlluminated/goblin/SE.webp.import": "c671298acb2a12a41e7956514b6ab3a5271575d5b8db04ee9ea543838616eda1",
    "assets/template/InvadersIlluminated/goblin/SW.webp.import": "e5f3a89efb484be3f438018178fca7444d5d4b7399280754e9533a28f6449a08",
    "assets/template/InvadersIlluminated/goblin/icon.webp.import": "9abb337cb3e279f8db79b3566b538d1b6f14bd6b73ae543b9949657e9146c4db",
    "assets/template/InvadersIlluminated/goblin/metadata.json": "1e36fff711927b65859acd63a1469f3feedace175cb533e6db5a34ac23c6d6fe",
    "assets/template/InvadersIlluminated/harrier/NE.webp.import": "0a108843abd7cf4db240b71864b9682fb70d8acdef198d600f118127f3b3e902",
    "assets/template/InvadersIlluminated/harrier/NW.webp.import": "337357cd03a2adcb709cd2cf4237860c518acc444bf05e1cdf9ef07fc7a596b1",
    "assets/template/InvadersIlluminated/harrier/SE.webp.import": "15913206b9d778dfa1f1911c11cadb9951adc45a73e924ef28d0087797960bdb",
    "assets/template/InvadersIlluminated/harrier/SW.webp.import": "94c2f96478170fc04afba1950cdce1501102597cbb212190b198e784a8a5da34",
    "assets/template/InvadersIlluminated/harrier/icon.webp.import": "7e43ab893c49908e2eeb909a6011ff74ec59129817e7c047e70e509a75177d7c",
    "assets/template/InvadersIlluminated/harrier/metadata.json": "1fa2821f86ebb61f958ec0f65ee11f106b7ee86df28dd2fc8aa7f48fa8296476",
    "assets/template/InvadersIlluminated/orc/NE.webp.import": "f554cf0d0e896d4d624fce174dd133357db60fc18d628736d0259863c81f7344",
    "assets/template/InvadersIlluminated/orc/NW.webp.import": "cd7ce6fbc67507fa314e83894d7ebdaae3f032b10c1e27f00104aeb6619e0f78",
    "assets/template/InvadersIlluminated/orc/SE.webp.import": "e6b254c3d280e2b25a5e5bb559bff84f894a93ee60b50ec1d7b1d3b991593ff0",
    "assets/template/InvadersIlluminated/orc/SW.webp.import": "bc8e5a6e8c12407ca6061c33658d7657ce3a65faca5667d7a82c7ea240c05bd1",
    "assets/template/InvadersIlluminated/orc/icon.webp.import": "f33b205941f02383b4725bb748e64469b24bbdec22298f6b287fd2f9a0ec00f9",
    "assets/template/InvadersIlluminated/prismback/NE.webp.import": "7afa7a89b816c7400b4f96cfbd6f05b95ec030ed1f20329617d0c0ea8ba8c624",
    "assets/template/InvadersIlluminated/prismback/NW.webp.import": "474084ff3b1633ea21773f92839d3dfa402c8bf2bf5b703415d325f57a633451",
    "assets/template/InvadersIlluminated/prismback/SE.webp.import": "820768e3168ccf25f92b46c08aa162ed6713d2665e9fa1cf2214f2d4c3dafe1e",
    "assets/template/InvadersIlluminated/prismback/SW.webp.import": "da377d3163922dc52a947e6e6bf5e65d402840d81223b3ae6e03c9c3681d5654",
    "assets/template/InvadersIlluminated/prismback/icon.webp.import": "670ede44d49fa2c648f2cdfa1e17b691115d775085cb1bc5a8a57e203e5ebef7",
    "assets/template/InvadersIlluminated/prismback/metadata.json": "b5fb33061f75a183e2b3615349b14f9933aa4e90e6167803d7acd351fdf3f073",
    "assets/template/InvadersIlluminated/troll/NE.webp.import": "49b67b271684543c597745f8526b0ae624734c212cfcbfa597c52462fb7e7fd2",
    "assets/template/InvadersIlluminated/troll/NW.webp.import": "da86f6edf2cfd9a1dbadd5acd9202bfcb12fb20730780741ff5e4f05a0484fb0",
    "assets/template/InvadersIlluminated/troll/SE.webp.import": "4954607041a5b4bd7b688a7d43b98582c149ba123ce68a636299021a2fda4585",
    "assets/template/InvadersIlluminated/troll/SW.webp.import": "e78e3ef996b358e42426a51318c16b64a86b8ff11ba3c928dadc73fee89706dd",
    "assets/template/InvadersIlluminated/troll/icon.webp.import": "e37fb3706b8e5b301c933f78b836e1a3957b7c69d62ab39ee057ab67d99aaed1",
    "assets/template/InvadersIlluminated/troll/metadata.json": "52766395248afc25742a084cfd9b4663d3ea9db7c16e5d0764e7db8a700603fe",
    "assets/template/MergedAnimations/illuminated_fire_earth_cast.webp.import": "ae922c101837a896cbfc4c0863ba72df55fdb7d2777d85d597b8b2dd74e97b74",
    "assets/template/MergedAnimations/illuminated_fire_earth_idle.webp.import": "8bc28ee29086f9d2989fe339c4d3e70a3da47d15b8866a038538a51ace5850da",
    "assets/template/MergedAnimations/illuminated_fire_frost_cast.webp.import": "f7655d91169c1fcd294ba8eadb65845ceae89fcd49300e4f9f84eadcbe05975d",
    "assets/template/MergedAnimations/illuminated_fire_frost_idle.webp.import": "a40a86c314cf41c840d32120315fd8bae97a7f2dddab0f54b19429338405be98",
    "assets/template/MergedAnimations/illuminated_fire_frost_layout.json": "7a88c8c6739cb5f4b24ab519486cbbc5391d870efb3ca8756b72dca8d89e0be7",
    "assets/template/MergedAnimations/illuminated_fire_frost_storm_earth_cast.webp.import": "d12ae9587d42c0dcaf5812c291003c48339ebfec71d0d85c9a574e77247231fc",
    "assets/template/MergedAnimations/illuminated_fire_frost_storm_earth_idle.webp.import": "6d1d5845064d954e1aac10cc3e19a13ba9366b6c3c92388cf4512942d2d50173",
    "assets/template/MergedAnimations/illuminated_fire_storm_cast.webp.import": "7e0082732e731ba581676e6c5ac7aca75f4b715c1caf55345550cacf507f0d45",
    "assets/template/MergedAnimations/illuminated_fire_storm_idle.webp.import": "1148425d48c6a9c0e567befe827967a81cfb44676011d96c2f503860bb2215b0",
    "assets/template/MergedAnimations/illuminated_frost_earth_cast.webp.import": "72c005019722bc7d0ae6df4268681a3c7848654ff805a643e397decf18029adb",
    "assets/template/MergedAnimations/illuminated_frost_earth_idle.webp.import": "f00bc0dc399e14b289a61ed5d1452ede36075b92539d35c390ea809270618590",
    "assets/template/MergedAnimations/illuminated_frost_storm_cast.webp.import": "e309d7d908c27f0021a94acbba87375819a34288dd7d46405dc7509fa87eda7f",
    "assets/template/MergedAnimations/illuminated_frost_storm_idle.webp.import": "5b60327287fe0e88eb562a5b2b963d8a3cb2cc3bbd2f00924b2cfb23a530eb57",
    "assets/template/MergedAnimations/illuminated_storm_earth_cast.webp.import": "993e668194fe3372aa7f9786ce59674400eaafd3489cbec6c1dbc3b23cf742b4",
    "assets/template/MergedAnimations/illuminated_storm_earth_idle.webp.import": "2b2508c9c9f14fc9c605887dcb9e9bd7643aee8f7d6dc668776c11e77e7988b9",
    "assets/template/MergedGuardians/illuminated_fire_earth.webp.import": "3dff8fb78ed9b95abfe723e2f33e90bef52e5830eee53eaa9a7ff73c7bff344b",
    "assets/template/MergedGuardians/illuminated_fire_frost.webp.import": "730464bf765a54c898e627e7be2b55f4b819f17fb1b80c2a0916988d69297c7c",
    "assets/template/MergedGuardians/illuminated_fire_frost_storm_earth.webp.import": "fb8a6907ec4a686a87b71250196057b2576a6b635fc878d1fc7a6f5bc9f69c8f",
    "assets/template/MergedGuardians/illuminated_fire_storm.webp.import": "499d8ff7af7f408970ec5bbdc3b967354bb0ed468c53a02dde45bee4ccd8026b",
    "assets/template/MergedGuardians/illuminated_frost_earth.webp.import": "824728d3aadd30d5ba0de472ddde5af3cd24c49f0e050f8a13105315e04c311d",
    "assets/template/MergedGuardians/illuminated_frost_storm.webp.import": "cae231df68781a2ee0222210a1bf547fe2510362f1fdd79107cb6b6c10642956",
    "assets/template/MergedGuardians/illuminated_storm_earth.webp.import": "098ca641b1d47f66a11ca621773d515d0425f9768aaa76b325eecff4eac86f39",
    "assets/template/Typography/NotoSansCJK-COPYRIGHT.txt": "849f4ea9c214fa4ac3593b770c699f387534b11ce671264c1b10d85bdcb5997b",
    "assets/template/World/illuminated_backdrop.webp.import": "fb85b42293b73a872fb00448fa5e8a137bc639a6c2f81b20a8c536bdfd60a846",
    "assets/template/World/illuminated_build_pad.webp.import": "052f01413600e6d257a8726685a567a8de7e6dd8f4c868f643ee5e40bb9e2cbf",
    "assets/template/World/illuminated_ink_gate.webp.import": "562d557e7ae71aef29d050772d2e1de167c447a2f4d61389214c737f6acb5e5b",
    "assets/template/World/illuminated_path_tile.webp.import": "e325081e63f5544b5d9fa6432418ca270dd3007bd538c3ee9b8e7590cfdd0cdf",
    "assets/template/World/illuminated_root_tile.webp.import": "bcac1ec75aa2cb0f001b8ed975a896d2f26fb4cae93829729a13ecb9dd3e9195",
    "assets/template/World/illuminated_seed_vault.webp.import": "3cc9f7dbdeb7fd2d8925c3f98948ddd23cf409a25d8dd0553a611250a29f63cf",
    "assets/template/World/illuminated_title.webp.import": "9083986350ced4573a1a6cf9d727a0b41286a317f31260f22a227423b885d4d4",
    "assets/template/atlas_layout.json": "ce53d9863e2df9eebda308ccf0d34196698df07efeff2d8fccf22f4a4ddefcdd",
    "assets/template/catalog_replacements/audio/impact/.catalog-retrieval-dcd5a59b9811c1ec.json": "e08dc832dfa72bfd0806b1f6eb34d0a53c1715356b5c0777ce0a01371c4dde95",
    "assets/template/catalog_replacements/audio/impact/impact-explosion-01.wav.import": "4087af1247d1c567c85821776078e72a049729982977723e3478ed8b80bda72a",
    "assets/template/catalog_replacements/audio/magic/.catalog-retrieval-74cbde4f82d2fd4f.json": "9999aaf5845537725a4ae936ad1691aedc0e74c47af6924118cf47dcabe2700d",
    "assets/template/catalog_replacements/audio/magic/chimes.wav.import": "b544d652ad971ab9b5051ae0efe1419082e6fba96c13d6e7c06635769fadffb6",
    "assets/template/catalog_replacements/audio/magic/echo1.wav.import": "8dd5bbdb4582b15456ab87f775922b269b642e5c0fb3e336d2365287429a63ad",
    "assets/template/catalog_replacements/audio/magic/echo2.wav.import": "5dedb57d3738305bd98866315c8eb3a758c344e743c2b63e6d4afaace6852442",
    "assets/template/catalog_replacements/audio/magic/locate.wav.import": "e339c4c424771e21b9b4c4ec1c4cc1d79c24667fddc559c49c2234b792549e37",
    "assets/template/catalog_replacements/audio/magic/sonar.wav.import": "dccd1ad9394402b081f244310daffb6066aad9ed1888146cb44d5ac5153b4153",
    "assets/template/catalog_replacements/audio/magic/spell.wav.import": "ae627eaab375a56c7da3c85691cfc3a5e5924dbd364ce1ac051a3c3e77f9742a",
    "assets/template/catalog_replacements/audio/magic/success.wav.import": "148f9ea03760db5c697b41adf3256224c4be4b7c1169d0b3f0068c0cadcfd18a",
    "assets/template/catalog_replacements/audio/monster/.catalog-retrieval-a761e6df1275891d.json": "45ccb7166c715ee46983b62d976fbd7c1990c505e492dcca662819034a49cdbd",
    "assets/template/catalog_replacements/audio/monster/monster.10.ogg.import": "023c5adf48f22fe30ec6dc29400e1ca76c38ca411bfe905fe773ab5b0ff7a888",
    "assets/template/catalog_replacements/audio/monster/monster.14.ogg.import": "5812dfc0f95d54d0064ca2bc7e435c978e09a9ccae7e4fc348046659597e8807",
    "assets/template/catalog_replacements/audio/monster/monster.6.ogg.import": "3692263794cea6f9ff3199f472ebc47667cf66c75b795f6da522829de0d917bb",
    "assets/template/catalog_replacements/audio/music/.catalog-retrieval-364f613a328a8510.json": "560fde120a00260f6d3734479d4cfc48d12147304f317c73d0dbf6c500f3cf2c",
    "assets/template/catalog_replacements/audio/music/combat.ogg.import": "fb6a8bcfb75616d4fd3375f84bee27a09fb007972e6e0730d1b9740541009d14",
    "assets/template/catalog_replacements/audio/td/.catalog-retrieval-bdaed588364e533f.json": "969537bfdef2bd3db0efed9c87d177a8fc8cc91c4ccedfdfaa601269f4d2b74c",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/combat/base_breach.wav.import": "fd3af38cb883e1e1a22d0956db9809cde2f70d5d1142fd8acea8bba832017491",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/combat/defeat.wav.import": "87ab374ab6a4e187dd15f4cd1dc7eb2a2a577676118c78631ffe3cadc0144b76",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/combat/deploy_elevated.wav.import": "2712c7f0d8ff42167219b5dfc64412f04db0168b3de9e075b5600946a4e09fdd",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/combat/deploy_ground.wav.import": "a721f53cc792c45c2e194022cfd178dfcf12925e2d4fb11eb41f4f7ce7741d3d",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/combat/trap_trigger.wav.import": "419b0530cda980a08acd1cbd37a6f2089f76ad276495963fc2dcfae701218925",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/combat/victory.wav.import": "f9bd9111b69bea54aaac455084c8e63c4b0eea32d99a759b238ae83b48b91675",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/ui/ability_ready.wav.import": "a088e213b80c82bdbad77cf2d91699124dd5f1900583321d5581e33c263619e0",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/ui/action_reject.wav.import": "33a480e85546fa8c9fe198b5b09a9c936478e4ad57d0d5316d894be2155aca68",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/ui/placement_ready.wav.import": "ef54334eccca2aca215c214eb1bc589d9bde156e2853742bf3c2c6ec541c6c98",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/ui/ui_back.wav.import": "872c8cf9cdd4789dae4d08590c441e880da3b3ba7859db3b613fedcde56dc8f2",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/ui/ui_confirm.wav.import": "2d75aec64ce61ea1fa6ef1f7fb1640fa15c2dba7959ab110e0af17441654098d",
    "assets/template/catalog_replacements/audio/td/game-td/Assets/Catalog/bundled/sfx/ui/ui_hover.wav.import": "3b04f864c9596f64ce6ac17461a025ad8c2782126f48dc6564a8464c019c2e37",
    "assets/template/catalog_replacements/enemies/early/.catalog-retrieval-9863693c3596b2c9.json": "8fb6ee19f16650c087d2ba29b2cfc9b0d23523caf861035aa08d1a11abae10d3",
    "assets/template/catalog_replacements/enemies/early/.catalog-retrieval-bd93a66caa278f4a.json": "4e1cf3595c713501d240c0f18fed716907719cca2ef747fee33743b2233e62f9",
    "assets/template/catalog_replacements/enemies/early/.catalog-retrieval-ca65241e5389ce3d.json": "14ef0f69f4e42716899edb6b7d4b53f0fe6cbb770446018013e9b0742145ec09",
    "assets/template/catalog_replacements/enemies/early/.catalog-retrieval-fafaed5032e6e45b.json": "45b2ade425c9b8c7e4e70b91faa655d6f52392bc2b7df451bc11581464a00b19",
    "assets/template/catalog_replacements/enemies/early/Pixel_Monsters&Enemies-Asset_Pack/09_goblin/09_goblin_blue_walk.png.import": "f76cb886d1cca5d1d3ef03b487f9156902379e7252fcd54325bdecc52571a94d",
    "assets/template/catalog_replacements/enemies/early/Sprite Pack 5/8 - Orc/Walking_&_Blink_(64 x 32).png.import": "cd1e9517c13bbe290fbd0c9d930ca018eb8968bc44bf0a9f95bda7a3f05a2954",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_00.png.import": "79cf1d761f371c9d2df88bee247491bfcc85d0b9dc66a51bbe3b4a5ed0f91121",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_01.png.import": "fb4106daeeaa1d5dafad2a4e73954b58a2fa4845611829e6bbdc651dc97c864a",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_02.png.import": "a4b2dae92e68ee02f7443ae257e0a5cc8381220cb24beebed5e28f2914c144d1",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_03.png.import": "18306565e7cc09999cbca5055806ad407f70d30e7cdff673d5dc534b8947b5ab",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_04.png.import": "d6d3f48c3cbeecf1b5f7e6a08ff152d00ac8c95e144f81f52e57045e9650ade8",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_05.png.import": "2e9ca5744fa0c81e83ebbd1c01e68baf57ecb4eb04df686645dd9ad3df7587b5",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_06.png.import": "85196e76b3d1e2d27bb43ea2844a1decff5ee009c50f1c7ae87ab9788b7630c5",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_07.png.import": "1d8d48394c192b804ec8437448bc7fe76c6894fc52b4c0c1e96187b4bf86b5fe",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_08.png.import": "900000956123fb4ff221ece7b7f560a882735e680f6228e7c46307ad5917b3c6",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_09.png.import": "c53380a40f2a2c35c8e664ffb191e303ce7fa9f224398e58a8580bf5c9ab7ab7",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_10.png.import": "5008e047e139292d718299911ba63801f61d7346eb1a46ba5c96f5cb1d271264",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_11.png.import": "565620eeaf37b6d01e6887b6a075ce61fa168b61b414d499517e3f9c014e3085",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_12.png.import": "27fcb09571b4c75df8d30361cb97a7cf6a8d770515aceebe5b0dd1cba459f118",
    "assets/template/catalog_replacements/enemies/early/knightprincessanddragon2-green-and-red-update/BoundsOfAnimation/Dragon/Dragon-Attack2_13.png.import": "6e515bfb17e29a44f2d0099659addbfe86b6b4fe89448e4a3e04914555f11c34",
    "assets/template/catalog_replacements/enemies/early/r_1544.png.import": "47afc1a67086c124f775a9d8ea51b8d66b8980463569b8371bb16539f7d44081",
    "assets/template/catalog_replacements/enemies/late/.catalog-retrieval-5f5ea49915fc3f01.json": "5de0e1b1aed16ac34fe657f3d84cd964153184cee608297979f4a38a33802aef",
    "assets/template/catalog_replacements/enemies/late/.catalog-retrieval-b299873a1d02a91d.json": "84077328fec0cc6bc03ba9c3bff8721dc08940d258e9b8d512e221a627e1522e",
    "assets/template/catalog_replacements/enemies/late/.catalog-retrieval-e40001aeafae8179.json": "30ccc675ba8077a8568c97fba080af9ad868b0f137711baaa8c25a2747562a92",
    "assets/template/catalog_replacements/enemies/late/Foozle_2DC0026_Critters_EnemyPack3_Pixel_Art/Turtle King/PNGs/Turtle King Spritesheet.png.import": "5471ed73ac622dc48a5cae20ef7733797c52675d0147f93313b682972f6bff80",
    "assets/template/catalog_replacements/enemies/late/monster_harpy.png.import": "6867a54a20ac9d3f6b00fd727a851a4a539853f517480f307e5948dc1d59fb91",
    "assets/template/catalog_replacements/enemies/late/punymonsters/PunyMonsters/Purple-Spider-32x32.png.import": "2be9184f81582facc2093260a0a01536a4ce03242b29ee77e408ffeaa0a30362",
    "assets/template/catalog_replacements/environment/cursors/.catalog-retrieval-6877afc0f05a3a51.json": "a85dec62518b131322875193bebd38e751a854f22f61a5db2ed0f8d8137d0ae9",
    "assets/template/catalog_replacements/environment/cursors/Tilemap/tilemap.png.import": "0957acdfe357afd56b87e9ba9945d4e12094e722f0bb7dd01fba6b2a434dc6e6",
    "assets/template/catalog_replacements/environment/cursors/Tilemap/tilemap_packed.png.import": "c709cd618cacea97abc527d55e1b42983ea5764ba0311f5e5a9a2699660fd219",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0000.png.import": "82160dca63becefbb2a059344737059cfd6c8a4b9bc375ea77bf6ed8511cece4",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0001.png.import": "a9a3dcbc7b9f2cbef0a82a7a16b3812cc2ec8719ef2eb0ff79f716c626d74d39",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0002.png.import": "762134e16e777da61380e11cf5fda8685396518dc5e4a7a4f78b4d8207a1e7f7",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0003.png.import": "8b0e40de2571b62fd6e2b1b206bafd14d935bb4337c8f91f3dfad65a6f5f46e4",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0004.png.import": "e666964a46ed7e93a9843a7518a483038ba982bb123d57906c3dc2d973720c8c",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0005.png.import": "1d0da9394b8ef3bb4fe3d5c243914bcb0915e2e8162c51b63943a019a67b7f94",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0006.png.import": "4c38a28c925897c8df2de7049a483f644e00b4035b58909eca772235fef7cd21",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0007.png.import": "855fc8c64b7efe10d43dca1b3bbc96fbc105442594659d25e0f413cfc925dd72",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0008.png.import": "3749425b2c069ad5b9541fe335ebfc8267102c70c4edc003abefc68f0aa8df1f",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0009.png.import": "00b25edf71eaaff40294bbcfa3d9143264b86b3eb361ca02fbf72200d67414db",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0010.png.import": "d56e4078857cd72bb2d9ca7508d02fe9bb55cc0f70d848c284972fe403f221a1",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0011.png.import": "f9fd595855e3423899662cf2e4b475441036f703f9691d46c6b03d61597893b1",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0012.png.import": "880138651e73e0b5799af4bda9e640db20122526fd4149c0e4dd83aed9e4f224",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0013.png.import": "1f183b8b1bbb7014ef4b67624fdb20d636a80fd2f0a113d576c06c69a8d50f62",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0014.png.import": "436f65e4bf903723298c33a718f55c0d4b8f88c5a282b1e0415bd6fd755d0331",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0015.png.import": "2322441023bda0319405078957f852d7d2d5ccd2cd321d3592f7f22401a222a7",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0016.png.import": "5fcec79e15b80fe8bf2c97d45a031421b1af2e7cd793309c52e13fee14ae63a5",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0017.png.import": "6b5d1f8eb7f22d139d87bb24d10e5655e560f7d6ebea459963c276c5c4fbab90",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0018.png.import": "ccb8be2498c623c323972f334dbab426df8fcbeff21411c2489613a22a1a5211",
    "assets/template/catalog_replacements/environment/cursors/Tiles/tile_0019.png.import": "b3a3bf750ebdb90780d215e1c972549d4eff966a072049e8f8eaae7471e47266",
    "assets/template/catalog_replacements/environment/fantasy_npc/.catalog-retrieval-f2cb5bdd7884f998.json": "87b8448bdc9fa27f5a28b8099624c81faf4e49953a76ff0e7ff3f6d496b3490d",
    "assets/template/catalog_replacements/environment/fantasy_npc/FANTASY_NCP_SPRITES_PACK/cleric.png.import": "b3c8ebcf597e9998f0cd23e187930a3b994e9fa17a82dc1600ef40aa33d0d3a9",
    "assets/template/catalog_replacements/environment/fantasy_npc/FANTASY_NCP_SPRITES_PACK/female_elf_archer.png.import": "3f2db50b2e621ba6cc5d9c852196acec3c1cb27fa89cfc429b52b34acfdb5d45",
    "assets/template/catalog_replacements/environment/fantasy_npc/FANTASY_NCP_SPRITES_PACK/female_peasant.png.import": "1c2b17957258cbe264675607a9423d62ac5406765786db14ede4dbb5a982480d",
    "assets/template/catalog_replacements/environment/fantasy_npc/FANTASY_NCP_SPRITES_PACK/knight.png.import": "5870297654be5d7ef464514ce9f733485bdc2857d03ce5e104818bbb71027742",
    "assets/template/catalog_replacements/environment/fantasy_npc/FANTASY_NCP_SPRITES_PACK/lancer.png.import": "a4014ba7a4a43a28d33c088e6372a19098c0f3a0566c19fbf543a0ab7ec30c33",
    "assets/template/catalog_replacements/environment/fantasy_npc/FANTASY_NCP_SPRITES_PACK/male_elf_archer.png.import": "8c25862ff05b7b060e3d93d5cc21cfc86d7c4c8f815c04ba79dd1b6a1739f3aa",
    "assets/template/catalog_replacements/environment/fantasy_npc/FANTASY_NCP_SPRITES_PACK/male_peasant.png.import": "d0a9cd70473f8d1518d9536b804e432cb63060a6f2da5881d9424d50f93966fd",
    "assets/template/catalog_replacements/environment/fantasy_npc/FANTASY_NCP_SPRITES_PACK/portraits_base.png.import": "8dd666ce1c37de2c18e7fb812b150013fdec8cd26448024f82ead899e84e70bc",
    "assets/template/catalog_replacements/environment/fantasy_warrior/.catalog-retrieval-eaa282cf4eb7f7f4.json": "009c9d31045066e021e27cf2ecd65edd2a0b17fae3f81e3dd6fdeacdceb15c68",
    "assets/template/catalog_replacements/environment/fantasy_warrior/Fantasy Warrior/Sprites/Attack1.png.import": "a8ad8eca631029addbc9e1f8fa80a77a1b09e420b940ce4bd75b6fce7bdaa869",
    "assets/template/catalog_replacements/environment/fantasy_warrior/Fantasy Warrior/Sprites/Attack2.png.import": "2a5ddf26fcfb52b4deb11c2a300c647c162b3e766bc06d5e7b1b5964ef8b1ead",
    "assets/template/catalog_replacements/environment/fantasy_warrior/Fantasy Warrior/Sprites/Attack3.png.import": "785c4e6be0d2711183c33a801304f182aaaa9218e47287df310d9b8bdd35d00f",
    "assets/template/catalog_replacements/environment/fantasy_warrior/Fantasy Warrior/Sprites/Idle.png.import": "8d2fbd6990f3cd49830f829cf53c0f8d045c5b275bf4a69d12881ea7ceddd1c5",
    "assets/template/catalog_replacements/environment/fantasy_warrior/Fantasy Warrior/Sprites/Run.png.import": "53b4d8a0784029c3402f8ec29e8668948bcdc9c0cc027e2ae354447dc081162b",
    "assets/template/catalog_replacements/environment/isometric_buildings/.catalog-retrieval-5f1793b7ad19c9cc.json": "2841f9ac58c4190dae1d5d58d612cf7099584e1873e767b73ec255e27392d66e",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_000.png.import": "6a55634a559a191227bcd91e587ecc6ee13f5f1250183a36fbd4540e2c932230",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_001.png.import": "e40efab1c9c4128ac63d88b18da86b127c0bfbc9c3278df4573c85be39f55ed7",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_002.png.import": "2736b64c424b6c03a17fd56f30a4652d931a9b5c931bb26dfb8461d1ae66b1bd",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_003.png.import": "66b7516b162b33a694426e3a9e8188120f1d703ed95bcac6a6858f98643a2eb3",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_004.png.import": "6e82052b31573299a6aeb82cb953212f579d058290a06d99c4bf96d70804e51f",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_005.png.import": "1c3402caea912f94a235c97de0038c40dc98d174c81e2dc47c078405a0a7a523",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_006.png.import": "e81c8fa8df1b09bae9406be69c4f02dd39666301c690820742ec2013da027257",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_007.png.import": "c7f778fe5fef4f064cf7b3b4b48488359a568deba28df18922ab9aabc16648a3",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_008.png.import": "1d26bfa5c66f505c5a56c1115ce3544cb0d2c57627f2ed4de9f8767def3fec81",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_009.png.import": "90964692e946dce382c09d90da41b8961fc5efc2b6b4e50ccbd256991cefdeff",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_010.png.import": "1451af8ac1570a171e5dd21ed769bdd997799af6f23670e7775dd87d6f9126bf",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_011.png.import": "d2d777fc179943cec3b79472232b036ab1fae57d99a460e5439ae11935eadeb5",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_012.png.import": "f44e9400854b9393dfcf85b2d89a1229c49a4241c09957ef3a741190edb657f7",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_013.png.import": "d5bcaeda9d8fcb28884883076c1a9f833976105e0874ffa868b51e3e3830fe9c",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_014.png.import": "755e0821e9f2a2879fb8b5772919fc3a8bf3991e289aad245e446e91682e2c74",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_015.png.import": "7b0f3028011c68e8ecec750f3602fde6b153446f0ebd66e575ae9d963f8a0af6",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_016.png.import": "e9b3bd593ac994597493c2c4c6b430d0fd2d2718c4e37b569aa2b692d65302d6",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_017.png.import": "942ab10d263fe15e2e8ed4733c43a83bebc2e22e1b49a8dedaead6d2332c1213",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_018.png.import": "e67206a8596a49abb903ccbc0f9c75d13b91b0b15a7aabc30789102894d056d8",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_019.png.import": "4b265f74792e8b457b90d7dd02d911effb870ee20c96be31602f3f21fca2fdde",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_020.png.import": "1d7554122abcde260cd39746ebde8696edcda492906d3d9ea4b766fe87381628",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_021.png.import": "400bd0c012759ff2beb7a115bee9e59eaae7ab8b6f0549609f9aeb880e19d0a6",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_022.png.import": "a910abe83a0af36beb0b92d592086a32d867699e758865f6aab9bfa6fd04e16e",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_023.png.import": "652f92f2d8990727e88355c0e7029c64fda90e122e5aafc3cdf67b09c1df7306",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_024.png.import": "f1daac92d490cab2082eb2f3fa59d3b72fa89aa8ab713fe6c3e7f872032d06ab",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_025.png.import": "9d4caed52958a2ad8ee57b86a7d30bcf12c48d3c41da70812d5ba0bc33936333",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_026.png.import": "5a578dad42c63fb0809c367164deae5451b6dde7fe9e3678a081750df7419df0",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_027.png.import": "20214d534a5eae6c23d890cd03de20dd3c10d972e99c4c573fbcef991b4a9058",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_028.png.import": "d67cd5b6ef74b023ea5e074ca9e1d4b44591bd9a6b6fdf0d2c9ddb39999d11dc",
    "assets/template/catalog_replacements/environment/isometric_buildings/PNG/buildingTiles_029.png.import": "49848e5e9ddaadb31713f8adca4ea4706a0d2a32ba940bc07aced85a8322e112",
    "assets/template/catalog_replacements/environment/isometric_landscape/.catalog-retrieval-fa0522aec9c3ab73.json": "105ea0ff864af1100bc15c77bb34f7c8a66719b5d9c38571ea352f8cd467b1f8",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_000.png.import": "34bc4ac50fbebaf65aa012ca8e9b107755cc6e04ce70521ddec537c3e3428597",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_001.png.import": "f27969a88870f98c7dadd0e30392787315a8d352dfd135c40a64e926ed3da895",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_002.png.import": "9edb7b8258efd3e79dcb101966f1b5eda1834ab09f3467124683979e599852ff",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_003.png.import": "330b834e5493f32fff2507c7ff20f3b7e8c5d26814c0c90ce38a448169f5a428",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_004.png.import": "25bc9a22ae8762b4b32884c129f3ca23831403edb94e36a4457ba6535c58f593",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_005.png.import": "31625918f5c8594a893b514dcb21114533cf141f17c1cd7166bda6fac1b371e4",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_006.png.import": "8f688a5bae0128a50f1cc09062a4080ba36f7af4ac227c5feb21cf97d19555b9",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_007.png.import": "05ac032eaf99f4d18e5dde2dbc54477596844387c639c8ac20657fe279b7b773",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_008.png.import": "345583a8788b4c786d676d94b9e5d539dd8508ab0dc4e9ac3afd15d30d22182a",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_009.png.import": "5be299b68b0f754d1bd1b13dd1eda6805ea3f7fc98ed828fc808c1ad47601bb4",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_010.png.import": "f1e921849a599ca2c2bc9186c171e178d7638b285be98e6a0129315e8ba4b073",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_011.png.import": "8cc03f42de07b41d915953c7516e2329c0fb30acfa689bb7ac38bc4ac18ba4d9",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_012.png.import": "795334abc54da192f9f67c6b57e8c96e9a6061b42dfc0e5749522215df3f7885",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_013.png.import": "ee588cb35f3fd6ce805b2e095a7c649692557d349f907ad2c54b5a47c0aeba1b",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_014.png.import": "ea7754b50035954f5242d032c8ae5338a9169a0506b47afdcd8278193f18a37f",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_015.png.import": "96c731cf1bcb308f288411604261ace3a49a1c4446148428b5c0fed59b5c9735",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_016.png.import": "5f574062b4a50e0e5b95aa35741c8bc6f2d105080720cb4d312277f210f9a614",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_017.png.import": "d06642e70c396aa9edff18704f9249d98ef1e7d8df53fbd88099764a813c917f",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_018.png.import": "9581e1a70fe77b59ccbe2b3aa494fb7d9a1b17d25ead64adfd03b09f9f4ae173",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_019.png.import": "fd13781356150d3852a7fff2a28c2d197d9affefa55e65281f6aadc78e143eff",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_020.png.import": "f43300cc5c7622a73fb60d7103caf38d9107882cbe29e37d0c615a706ad08943",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_021.png.import": "8cd2151545cd0725961aa2f5f5d940e59cfce3eb72a05fce1f3cd5a20ed1bcb9",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_022.png.import": "894ef33d271caf90d2718f511d7edf8fe29bb1123390fedd1d8f9d41594d426c",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_023.png.import": "3902dc436df34884d65c22e9bc8c7545ccd3cf91c2ce379b14c158a72c9fcadc",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_024.png.import": "b032e88038598958bf49dc4354d06da5166c01d05bc2095162ce9dd9c5e0c22d",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_025.png.import": "eaf302b45a7ce5e1c964226bb4e84da74a46aef0894362ead177d7149d028308",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_026.png.import": "2c181b682ac5fdb26ce5057583f78e5b18a45d34b181117d19f8ea5f50e48fe4",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_027.png.import": "9e2d51db866e3a0b8b685507273ea2e123715e8a4df3ce6e0ba1cb96daebb5e6",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_028.png.import": "8b440a72c306841418fe7a22cd1608acc1b50d19a1b2d718198213926f0b47b2",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_029.png.import": "b29c0676cc450b711b6031e050ea0de58e37bca4956e38acf3c1301c6b7de68c",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_030.png.import": "dad649f1138d71d99ea6ecc48dce67903ecf4ec04f8d4043bd284a896cb59554",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_031.png.import": "1bdf4f09d056d0d62496d7b5d285002fa5988fca1d71036c07f74ea097f266d3",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_032.png.import": "abcca547207b0d3d8a5daf199d1c8e94daf09e68aaa66b2f33a4a5a607055f2b",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_033.png.import": "4f463d676d5c806b15c93680a4f5a77fe9bb9386a96bc2d14a1ed6b24fba9815",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_034.png.import": "e7e7d8588a7c01a9339b4fc022d3d0657dac0e583993814baed6ca044836e300",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_035.png.import": "abe8a08779bf86feaaba08da934fa7a81cb15669aaf8a47681f95949a9d7461f",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_036.png.import": "2d8b714fbcda3201834aa02a9ef0c2c16519dc49a9a0d5f7e11b19495d558469",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_037.png.import": "c580b272d0c7a0be3c3c60cb28f9e514946728e88361bac919b2d2cef5a19095",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_038.png.import": "8cd9282454ec31d7c8f87ed9babd5964a7c2da28e3225deed418c700297deff4",
    "assets/template/catalog_replacements/environment/isometric_landscape/PNG/landscapeTiles_039.png.import": "c52f43cbc0d48f5f5f7cd252a8009a988e44708b925093de97f75a97bd0c83e5",
    "assets/template/catalog_replacements/environment/pixel_magic/.catalog-retrieval-b8f9526792aa6c12.json": "dec4c4604b3921fc628d4a7a76def8043e0e3376c16b8e0db2618ce6a2f5da24",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Earth_Spike/001.png.import": "a8334e1c3eaecd4059d2540621eff7b3746d2e20ff8f1dfeaaea088429045674",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Earth_Spike/002.png.import": "9072609a946168c02d75f3163bfff7e526bd629d4f0062abe336f45e97d2ce6c",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Earth_Spike/003.png.import": "68978d6da64e4b889be57d209d36290d3a7a6760629339ecf6e7f41c38e061d8",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Earth_Spike/004.png.import": "8c077439c873b446927c4e80be823fb673d570d60fad2ce13cb44e54a7a44efb",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Earth_Spike/005.png.import": "39ce11a7230a259c018bb8260a63f6300523a6ddafccee3dd13858aa00b3e2d7",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Earth_Spike/006.png.import": "6b1c2ca52a97609195b1e71188d72cca9757a2eaf6d9ad7fc76a45e5c0f730c1",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Earth_Spike/007.png.import": "31b15db2ff74a9a95686d1c2ffb87c6688d4dfa4c48abf13c2b6fe986cae629b",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Earth_Spike/008.png.import": "695e309197f9cb08f3afd00505701fb043a0160d4354aebf200712e80b73f869",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Earth_Spike/009.png.import": "5fbbc7c6683de7559ca9035c775a78a9dd4bb1b6b377d2c9036d2f8328e411f9",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Explosion/001.png.import": "a1376373229f9189d9bbd01abd7728fd1c291bb0e479a46415a0773dab7c1d48",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Explosion/002.png.import": "3e9f13f2c2e95cfb42d3f3326bd6cfa34f7f011995b1ffd49ac2296ceb6cc61f",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Explosion/003.png.import": "16418bbfbd6533cd1c1518127af9f684174481c1f30f28aed00e976e7d0d9c54",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Explosion/004.png.import": "644d4c23c24c1bd15e39164b0b370fd74dab5589bd77e516021d757cd64355f6",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Explosion/005.png.import": "14b790a42fb5af8d07c18851fade6137165a0f88dcfd1c2c259d28322feb720d",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Explosion/006.png.import": "56f3ad4b545c7601efb7a250242a24db80441cb98a5ee636b52956538b420c79",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Explosion/007.png.import": "42d5f10d0d4e01cc16d23d6fbc67aa281103c6cc53d62eb2d02caf8a6b421d9e",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/001.png.import": "6be87bd0410030707c99e301807647598d1c3a6ce7236be6a29e1b478126300b",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/002.png.import": "f06f92577beef7f7336a11e3e4f42bf9292810448b87850cd3f40ec421c18f4f",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/003.png.import": "e34a06171f4a894f4cf24f23955c64073eb814322585fc15d7c200db002238d1",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/004.png.import": "2ddae54ea12f86d6d1026d9874c3c630f42430d039d2bd61656685940edcebd6",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/005.png.import": "c1ceb4b03d8e87640e74c97ace8cb4d0b03efa5de78c9d0adaf6923c0620fc77",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/006.png.import": "dc774b11bc2b1522e246744f762d112cc6099207e420aeb5f3f63a114a9de44c",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/007.png.import": "48c9e276e947ea97d31c179dcfe27bc474a140b6bda983aad9ad5aca3142c77e",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/008.png.import": "911932554d5c10572b3f1b427e335975f72bc24ce09af2773130099a11e539d5",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/009.png.import": "167526025ed29741becd457b899aa33f05f36d51dcdec6c3da114e2a6926e60a",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Fire_Ball/010.png.import": "fd3fc28ea9abfd9b8381cc537b2bcfbe613befb2000386f890b5c1452cf378a0",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/001.png.import": "e15c25712953f4ecab922c2dbf52d870256f21b449cb7c051cd3504d35adc30c",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/002.png.import": "6e0e34c4f40ef585d70a3532c22b21e1b7777d788aef1d734a28d84334e88fb0",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/003.png.import": "e4808fed4991ec3ffa885dfa86adc56f11d465d93b06f469b2f5f2448ec4720a",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/004.png.import": "9fb1776b23ab3a172617136e4e850c7a22170a0490aaf5db42040376a47dbdf8",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/005.png.import": "a47bb4682e8709f1f9e526a50d3fea55c9ae10ce88ea1a330a7bccd35dccd37a",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/006.png.import": "426f61fa302719049b4a1dab3e5cf3c4c3f980f1aaeae1db3a89cd03c827c268",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/007.png.import": "14af3fc26119937a4a7073f5411b62047d3cd1de7f9609fe6b887b0839307ed3",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/008.png.import": "ac3bcad68d2d8f9f8efc76a6168448c83e5d0ffb6ab1ec2c4b856096cea1d3bf",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/009.png.import": "16fd125a7ce074bfd2b75bc00454be56cf081ec23b6c65adceeb2a13365ab806",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Portal/010.png.import": "b3e0dee10901037d015362b98fc81cd68e5487b7e23f777267bacf4aa79321c9",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/001.png.import": "5e5829735307c4092e089501ed125843065789b3b99e68aa7e789c965bb8da6d",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/002.png.import": "b5321daaf4b22ece550a48d60c8de665654dc762c9f5605ad8bbe680467659b1",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/003.png.import": "0c706a7ff4dbb3edede4fc1c120c5ea778369447d7c5051ac55fc57f43d5f8ab",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/004.png.import": "72938c04146008267cd41d661447561c3a119225c0799ab1c5f471dde47498e8",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/005.png.import": "b9ebe283f368b857e489b90d1508d992d61daab6c282710530019674e4510d1b",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/006.png.import": "ee70a356ea31bf79a4dc114b74f81d6eb2a6891e3fb55d1d86d8a3dbf58d5da0",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/007.png.import": "3b05512faef1d008fe059bd3c83b5f8301fff06c39bc8d1ecb106c273b5b9103",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/008.png.import": "f0d583ff31b43b4bb3efd97b80d188e10d27cca4d69c8f8af7a211efa6c66aa4",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/009.png.import": "d72f20a68feb05a9a224f95578fb296c40dc250c8aacb79104044f3195e7aa9b",
    "assets/template/catalog_replacements/environment/pixel_magic/Foozle_2DE0001_Pixel_Magic_Effects/Wind/010.png.import": "46b3020adff864c05dd66b380666d037219fc53477515d05cf3248674af7b145",
    "assets/template/catalog_replacements/environment/retro_textures/.catalog-retrieval-fb400e4efb2a4794.json": "0a36aaa0be93ed52846918a9caa16d7d51d4c6019cbf30b2625f09fd5039b5bb",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/door_metal_gate.png.import": "0c49d734b1ffc8ec90f411f9e310cd1fdb6c834eca75d612c6b1e02445bfcdbf",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/door_wood_window_lit.png.import": "9eadd92daa0be6c5c6de6a873b2c47fbee60be87ac332219bad0ea08fbf3f547",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_ground_dirt.png.import": "8104548bf9a703c217eab0d14f2b78849964afc15dd141572753fcb015edbe5d",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_ground_grass.png.import": "b55b6de3404d46a50b250c296d876446fc9a46963c574704d55c1a56ec81551e",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_ground_sand.png.import": "d22c230c4b4c47516f1726e2ae1d5f5581d67e1c68a700934f4f872d959e2469",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_ground_water.png.import": "4ea938cc2a200ac96a3aa9d78ad1f7dbe7804037a181653d50304fa19b574f06",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_ground_water_green.png.import": "3d0576ebd00dd93893dea601db90dc8cb32d746c49e726ae4ce94ba2c3fa59e3",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_stone.png.import": "29d4915d56d188cc852c9dc493e807309b7c6bb98b50f781be650f26570d9e5a",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_stone_pattern.png.import": "0426f0caee4e05240895e4a86ae610a3d949574f0c466b759884a38cbe5f7388",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_tiles_blue_large.png.import": "abc204812ee09eca8441e223175c3356b947e69906e6016b9a5f6fd890d4eda5",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_tiles_sand_large.png.import": "b8bd07c2f6b85c06195ab3588d308271be9577f7471b6adf9d20d6e00c7560ad",
    "assets/template/catalog_replacements/environment/retro_textures/PNG/floor_wood_planks.png.import": "93e31eea9a7eb1e23e31f17ee3d51bbdb3a853b329e62eeaafa238edbf1bbfd3",
    "assets/template/catalog_replacements/guardians/dungeon-elemental/.catalog-retrieval-2f83f9f36d5a2dda.json": "768d07b401b5e7fb44b01fb7b189c3284bf21507832711f9a137a455b257fa0d",
    "assets/template/catalog_replacements/guardians/dungeon-elemental/0x72_16x16DungeonTileset.v5/items/monster_elemental_fire.png.import": "33955434e17d08543adeaba5bf3fed56ed3ff47839ed47245a1be2255876ae45",
    "assets/template/catalog_replacements/guardians/golem/.catalog-retrieval-acd1f761a3145570.json": "03f356e76196f4ef33cb372d68aa1044a58701615c76636b82719120c9a77d3f",
    "assets/template/catalog_replacements/guardians/golem/Golem_0.png.import": "db5348d1b19ff9ace009fe5668035819477e64e2f37f061b767062f83fc79c08",
    "assets/template/catalog_replacements/guardians/kenney-meteor/.catalog-retrieval-8fc6f556b63ed331.json": "128ec4ddcbdf5cf4432f5cb260ff7d259cf8bf3e510884ac471027cf93fc20b9",
    "assets/template/catalog_replacements/guardians/kenney-meteor/PNG/Default/meteor_detailedLarge.png.import": "7393d17cbb47b22e15fc304806a7f065f50a772ba8e513622d75f63bdbe71af3",
    "assets/template/catalog_replacements/guardians/purple-mage/.catalog-retrieval-74e294a2a321b27b.json": "65b6e8fe626e8857099da8022324b98b87c9a50d957d5e164c3d4bae40c89448",
    "assets/template/catalog_replacements/guardians/purple-mage/Foozle_2DC0005_Purple_Mage/Fireball all animations.png.import": "33bac28331c8a157380724e79bf303d0eb860d4acb3dd7d06d63ceb77fc881c3",
    "assets/template/catalog_replacements/guardians/rpg-characters/.catalog-retrieval-5365c37245abb092.json": "cd3ed2a73d1b409b3a985afb7908b3edffc3a6c5702c38a71d302831f070b585",
    "assets/template/catalog_replacements/guardians/rpg-characters/monster_air_elemental.png.import": "ce65bd38ef40c4b4040ee08ef6c3349b3308693e38fc6b52babc292652a7224c",
    "assets/template/catalog_replacements/guardians/wizard-pack/.catalog-retrieval-59e4acf9bd1ec839.json": "ba874a17b9379b7b56ba5a11d2c2a4242b6b7ce399dc0238fd0d7aed1810ded7",
    "assets/template/catalog_replacements/guardians/wizard-pack/Wizard Pack/Attack1.png.import": "9d26600ebd93fa194d2193b8d4abbe9ce8a5b52052f08b0c287f6bb9e1dcd71a",
    "assets/template/fonts/Figtree-OFL.txt": "140d37233e7f3ce7313798befa9600893bcceaf41a55fa0fa5ad52f7f657a268",
    "assets/template/fonts/Figtree-VF.subset.woff2.import": "ea52971ed9f74164a155791f4d32496af9592b9b91bc3a73853eb397427ecd17",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "7d5bcdc555d9079b8721799873ad305e73e5dddaa2b17dad35ee58640a35765b",
    "assets/template/fonts/display/noto_sans_sc_bold.tres": "802fc5c1e6d59d751b7a082e97e9d660ee1a80e7df5a8fc0c8ebaee4ba3f48c3",
    "assets/template/fonts/display/noto_sans_sc_medium.tres": "cedb628da4f2581710eeaa6abf86854bb84b430d8a9d5af133a812de20e99ef6",
    "assets/template/fonts/display/noto_sans_sc_regular.tres": "d083b2b1c4993eb3504711457610921a510ef1dc77514d13bbeaac2a0f2627c9",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "3035d1ad27d44b51879fdf155b1623d8c8d510ec970b0c57b65e4cd2805d3ad8",
    "assets/template/fonts/ui_medium.tres": "db63d57eb8bf832029a2c633b542e73fe39a4eea1c6d797eae9970c5825dd6dc",
    "assets/template/fonts/ui_regular.tres": "33818dbb57551568a1e373611cf5b8806ab0cfabf46a33cf75967a6c4251f879",
    "assets/template/legacy_template/act1_shared_manifest.tres": "d73073b573664daedcd0afe08e36d458b22fcad2e258b419d9afc438de0464ad",
    "assets/template/legacy_template/asset_manifest.gd": "a8378fcf4474e7109f46eee912ca88806262f6f13cca97d905d74f295664f908",
    "assets/template/legacy_template/asset_manifest.gd.uid": "9c44455ac1e6bdfbc31d7e658f4169f01af03889651e9d138520f29c03514d12",
    "assets/template/legacy_template/bundled/music/lunaris/act2/s09_return_path.ogg.import": "443f5cd44c3a61faa8a328dc724f57bd73faa5df8074fac9bfeed6e059371a77",
    "assets/template/legacy_template/bundled/music/lunaris/act2/s10_covenant_orchard.ogg.import": "ab6fb4e3b6164fd81f1bf6dd4f3a4865469dbf7d63e67d8f2c0b95c8ab03acd0",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_battle_air_raid_high.ogg.import": "eb1fddc25d9cf3ca034d75fec4a48c9ffb0ff5c1e87235b42afb0364407b0212",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_battle_air_raid_low.ogg.import": "a584aa4344c26974c4033a362ab1daf772ae71b87a5cb48b2b343ec8d42479e6",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_battle_air_raid_medium.ogg.import": "8d37a928cfc05bd99a6c283349c9f77d6c6cd2012123f7d52833912f6a94c4b3",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_battle_gravity_lattice_high.ogg.import": "07afb7977e70071c35f2f4dfc0870a69166f97695973aedb4828d3e533dd16fc",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_battle_gravity_lattice_low.ogg.import": "ca1a7deca5bec33d1337426b9e28df8597a01ec397d4eb49442a2a2f503f0fff",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_battle_gravity_lattice_medium.ogg.import": "a812c2fd5dcbb8d9f87d7b53816a219beed80c5aeebeebd59183cea5627a968f",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_battle_orbit_early_high.ogg.import": "90f894170214275dd38b010887c642dcdf449a2092a36a43e4bbc3261d255137",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_battle_orbit_early_low.ogg.import": "e7339389a9a17b4221497e336af33dbf7e2867da01e987bea8ddc3b256c33a28",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_battle_orbit_early_medium.ogg.import": "94f0ec5615337700de0a3117cc174702698748bb3352e90c19593fb9a2788265",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_boss_gatecrasher.ogg.import": "cf1c8ac9bc0ddc1f3eb04c5ff6930d5fa9068ef197773fadf9e125d001764d13",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_result_defeat.ogg.import": "296209d883056d0bf8ccc95a1954083b43da286b8b8b2d029f4b743f1be1a518",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_result_victory.ogg.import": "250a28e655e41e362f6439c0a78d13c5f1a7de1c068f6c763cf770df8fef910e",
    "assets/template/legacy_template/bundled/music/lunaris/lunaris_staging_archive_command.ogg.import": "4977e7916d2de3899130acb27d8e7ebd583b866a1fdca48d336320ed2fa20cb8",
    "assets/template/legacy_template/bundled/music/lunaris_astra_memoriam_title.ogg.import": "2404b4d5f1d1399359257c7783febfc14d0aec1e0ca23fc27677c983c80404de",
    "assets/template/legacy_template/bundled/sfx/combat/base_breach.wav.import": "4db4d1c527867805130eee5b9b2d46a79f1da842cbab1a26fcd6260b22f379ca",
    "assets/template/legacy_template/bundled/sfx/combat/defeat.wav.import": "b23d0056deb40044eb689a718fdfd7a3e7ede90fadcdb4f5127740b2b226adba",
    "assets/template/legacy_template/bundled/sfx/combat/deploy_elevated.wav.import": "3a2cfbceed326009577e2545dd1cb0c20cbc71c0e50b4be5230543311eacff56",
    "assets/template/legacy_template/bundled/sfx/combat/deploy_ground.wav.import": "dc763c0b323a6f7e39aefddf8599c8593010ec30aeab487ef1bb3b2cfeb2900c",
    "assets/template/legacy_template/bundled/sfx/combat/trap_trigger.wav.import": "ab82509b94acde3316306cff4e74cb8059acffa81669af3caf3b6fe87de0cc08",
    "assets/template/legacy_template/bundled/sfx/combat/victory.wav.import": "b3f2e1cfa738591ff69d058d681d5d7e5306e8f60dd0753c166db6e93644b716",
    "assets/template/legacy_template/bundled/sfx/ui/ability_ready.wav.import": "409f652824e23540c20798db2a249253b58ad9fe0daa85cf1ecf33cdc5169a96",
    "assets/template/legacy_template/bundled/sfx/ui/action_reject.wav.import": "bd94b70c1019678906ed837ff71d4daeff7f303c1414a348db6680ee994048f5",
    "assets/template/legacy_template/bundled/sfx/ui/menu_close.wav.import": "7a87fd4ad9ce02ba514a99a4159538e346991b9e347b978cb45b4aa9fc00a6c7",
    "assets/template/legacy_template/bundled/sfx/ui/menu_open.wav.import": "46bf0d8a8260c03d1c2d3cdbf7d625c6ab29234469a664964391b0cd85620540",
    "assets/template/legacy_template/bundled/sfx/ui/operator_select.wav.import": "4c80c09e73c88cf063d23ac843b800192135d58d1d271ceeee271159a0b84587",
    "assets/template/legacy_template/bundled/sfx/ui/placement_ready.wav.import": "b512490595bcb2f351b1e8975832817492063c1e90b99806f3f46e8bcbfc7a3c",
    "assets/template/legacy_template/bundled/sfx/ui/ui_back.wav.import": "adb4359f54a592db949221e5abea706c4f6509c31e26522b2c0ffa18164c3755",
    "assets/template/legacy_template/bundled/sfx/ui/ui_click.wav.import": "ae982a7ca2cc9ec16c94d8ae4db424c89d8d842f2fdac9eb685b7d0771a06c72",
    "assets/template/legacy_template/bundled/sfx/ui/ui_confirm.wav.import": "9cfc463b64226d6b2c2b2297a488df511668abac465f45a6ba442cbd23d24a98",
    "assets/template/legacy_template/bundled/sfx/ui/ui_hover.wav.import": "23892efad54027f5f7aac9f6ee44e9d1f2801dd5570d046b3bb87566c389ee09",
    "assets/template/legacy_template/enemy_static_manifest.tres": "7eb992ff6cf7058d8183351836942d517ee3a1aa6a33fe76bf332c4be6d799db",
    "assets/template/legacy_template/fonts/Figtree-OFL.txt": "bb272dfcd8801eb31fb98fe51828f76f0e41ac82f89256101df8021aa3d30ce2",
    "assets/template/legacy_template/fonts/Figtree-SOURCE.md": "5d7d6ad9fa09d3e2c646e6673f5758f4ab597a927497f6838f9308221da83ba4",
    "assets/template/legacy_template/fonts/NotoSansCJK-COPYRIGHT.txt": "849f4ea9c214fa4ac3593b770c699f387534b11ce671264c1b10d85bdcb5997b",
    "assets/template/legacy_template/icon.svg.import": "75d31212fa519cbc8eb1242d87036a3f1cab72906258174a1efe1170e730aead",
    "assets/template/legacy_template/loading/command_backdrop.png.import": "a19cd4cc69d50885b4e00ea40888743c64ed023c957b5752a126d9f47f4e3044",
    "assets/template/legacy_template/loading/lunaris_reliquary_loading.png.import": "7d9f5266583bd62c68061611588844a608d7d323edc169d405e3d974d61e21c6",
    "assets/template/legacy_template/manifest.tres": "2c5ba8c76e3d5e4111064414dd125959cba5d406e0131d6e9a55697ac229487b",
    "assets/template/legacy_template/portraits/caster_1.png.import": "7e38c35c4008434c3de993f5e71ae10ea860c52fde2a47b54cf7fedf3309758e",
    "assets/template/legacy_template/portraits/guard_1.png.import": "a99ad937ddcefb4333378d4275250f3b659d2c58342b8758c3035d15fec730b2",
    "assets/template/legacy_template/portraits/recruits/crimson_female.png.import": "0499fd0e3ee14d46385d49c176a89da827114f864e0740a766ff51d3df97c1c8",
    "assets/template/legacy_template/portraits/recruits/crimson_male.png.import": "7af3e7a0bbab660eb991a44533139a6ed72bf26e39e0483d7672c04414dba003",
    "assets/template/legacy_template/portraits/recruits/lunaris_female.png.import": "20ccf8fe682d75af6777bbd01daa737dcc64afb9225ec2a0984bf233470993e5",
    "assets/template/legacy_template/portraits/recruits/lunaris_male.png.import": "1a942fda47e5ade95a6bc34bc33bd1ca7193e6b09224c9e025d92cb215616172",
    "assets/template/legacy_template/portraits/recruits/solcrest_female.png.import": "2d21c2c3e008919987a3c754e9e249879c7bc01167354b92fdcc9d08a0c27f7f",
    "assets/template/legacy_template/portraits/recruits/solcrest_male.png.import": "76e762a38f41943cba0dff717af2df353eb997da897dc27734371540b79d50ed",
    "assets/template/legacy_template/portraits/recruits/vesper_female.png.import": "37764a47b6b2f9abfcef333cc1e28acad59574875cb3ead7a7cac2e2cc5d6a3f",
    "assets/template/legacy_template/portraits/recruits/vesper_male.png.import": "26d45dcfd1906087f536df48bd8e1a3b72dbb8280bfc43dce669f3e0d10a940f",
    "assets/template/legacy_template/portraits/sniper_1.png.import": "675b1594b2cd5a07d779aab0d9ca58ab61702aa3979d506a1162c97fe4eaadee",
    "assets/template/legacy_template/portraits/specializations/gunner_female.png.import": "f62afac114fd98834800a07eb03a33fa7b4d3675ccb6c83cd501989c32a126da",
    "assets/template/legacy_template/portraits/specializations/gunner_male.png.import": "c549ad78f4efce5dfb2779b3c67feec74a73d4f5cd6b830020d95a99d169fa3b",
    "assets/template/legacy_template/portraits/specializations/mage_apprentice_female.png.import": "600b6bc5ffb678ae8d7e720885b2c93f73d3f3544f554c04164b689d666084cb",
    "assets/template/legacy_template/portraits/specializations/mage_apprentice_male.png.import": "559b1e2cca1d02f0c497266100a22e19be37bc0542150106b26b36142d0a1e09",
    "assets/template/legacy_template/portraits/specializations/swordmaster_female.png.import": "140a3d00ab380a02b817166bbcba75f0480838121454ada1974551b807b4cf6b",
    "assets/template/legacy_template/portraits/specializations/swordmaster_male.png.import": "9a2693b89d216a62765251a138e349e7a7ee77d4059d084eedc0d69349ef3bdc",
    "assets/template/legacy_template/sprites/caster_1_0.png.import": "5f3fd361a0a724b6295ef5bf897fe459c1bf3656c44f660eb8bdb9ee9279c315",
    "assets/template/legacy_template/sprites/caster_1_1.png.import": "6352043863dd694b541d5bf913a813a1ae339009d4bbb9a52c6b136ccb3b0d45",
    "assets/template/legacy_template/sprites/caster_1_2.png.import": "8de602703949dc88eb939d04dd599007f2536b02be5222367c2f114c28b3819e",
    "assets/template/legacy_template/sprites/caster_1_3.png.import": "9f72c5b70603bf6864353c2ed12dce9ad867ab9c2c716a24c55325334aa02ad6",
    "assets/template/legacy_template/sprites/caster_1_4.png.import": "68015c07c4334fed079d9cbcd75e4b93e4a13dfbc5c27879655c1110eacb3774",
    "assets/template/legacy_template/sprites/drone_0.png.import": "c9905a0a80bc4be9bcd14c2bc2e770a8f04f7694d644e6e0fc6e381f7d0b599f",
    "assets/template/legacy_template/sprites/drone_1.png.import": "02b78f454daaf6eb331071e1c78dab8754e932f912d04c53af2d07fb801f20ca",
    "assets/template/legacy_template/sprites/enemies/static/breacher.png.import": "b1875a516cd0ef9cf9d0c152c2c7e04c337e192830e654921a1adbb13bf8d221",
    "assets/template/legacy_template/sprites/enemies/static/drone.png.import": "dca58ed58bd006ab5a4e8baf99f8ff0896e73de758d83b411c0e719e51953d4d",
    "assets/template/legacy_template/sprites/enemies/static/heavy.png.import": "c1ddac58c45f3241eeb9199c2790b6791071274823e6b19a83c210805aa886d6",
    "assets/template/legacy_template/sprites/enemies/static/interceptor.png.import": "65ba336e770ee5eadffe078e5d2d1ab511a332eaec3c8330da0eddd632d2450c",
    "assets/template/legacy_template/sprites/enemies/static/mini_boss.png.import": "acb67a3744d371e11bc95a34d208e2a70ff2050840235dad9ce7a6d3d3aa0b7d",
    "assets/template/legacy_template/sprites/enemies/static/runner.png.import": "cfdf4fd0a1e091a70b9bef179a30f4e5a5d72c938ac3bb1fe07933692720be2c",
    "assets/template/legacy_template/sprites/enemies/static/shieldbearer.png.import": "0b728a5c235b53381bdda71440e5a13e4a773bd487ff84a27ce403ce4a984168",
    "assets/template/legacy_template/sprites/enemies/static/spellcaster.png.import": "4e5491713b006bfefef31a8325d9d8978d4aeca973746d0812470fff3193de3e",
    "assets/template/legacy_template/sprites/grunt_0.png.import": "64ad87a8f666712fa0621929946c49417d0a098a53d7d9653b8174b413f76385",
    "assets/template/legacy_template/sprites/grunt_1.png.import": "74f1225a37d5528a865ee78d12549479fa65cbcd121c812d98d3bb3b4485cff0",
    "assets/template/legacy_template/sprites/grunt_anim_attack_ne.png.import": "57bf8638c1efb5ed98494753f611f441ce9d2f4a66f92b7067dc7667ac49d920",
    "assets/template/legacy_template/sprites/grunt_anim_attack_nw.png.import": "faa9c765ab9beea409c782324a940470b687af6050e43447fd2e8e5ecf2becc2",
    "assets/template/legacy_template/sprites/grunt_anim_attack_se.png.import": "3a607b8a21f5afaf898f6ef8e3c7046c7858069e949e2548274c81efb4f25b02",
    "assets/template/legacy_template/sprites/grunt_anim_attack_sw.png.import": "164003cce1a7e094ac5f872a08bacf5b27169704d146b23675dd6900a55c667c",
    "assets/template/legacy_template/sprites/grunt_anim_walk_ne.png.import": "b792cadcdb75be3acc81f0c59781833b5d231131191ee191bba5172114e73f21",
    "assets/template/legacy_template/sprites/grunt_anim_walk_nw.png.import": "e3fbc980d874ade6c47869fd4d1c5c5d54aa129d9e1506293c25d523f05101f7",
    "assets/template/legacy_template/sprites/grunt_anim_walk_se.png.import": "c20cbc039a39e126e85f061f66ea2912a6bf99b000c878b7320a6ecb14a88669",
    "assets/template/legacy_template/sprites/grunt_anim_walk_sw.png.import": "e6c161d9e4247d4a0a80b21d0b3fbba2b4eadc92370322a8709d1f0b08c4c7a8",
    "assets/template/legacy_template/sprites/guard_1_0.png.import": "adbbcb064d1321a3f03e747ff976b7bb6fb41b9032d7aa20851d0e8e2a7db36f",
    "assets/template/legacy_template/sprites/guard_1_1.png.import": "74160b73878b0d202a85de7b7e86770a78a7a1f5b504147276dd25b4aff809cc",
    "assets/template/legacy_template/sprites/guard_1_2.png.import": "aacead710d4f0040f12f9c2b21132b81cea47cc76482275f280c0f7b77016399",
    "assets/template/legacy_template/sprites/guard_1_3.png.import": "e885a0ee841beba76fc789eed8f0a6c68350d3be2009bb84ce01287b45502b0c",
    "assets/template/legacy_template/sprites/guard_1_4.png.import": "8ae44407c3019400d4d23802b230388c753864dd26e05b6e0461b3cc47d346bb",
    "assets/template/legacy_template/sprites/heavy_0.png.import": "e267cb0d2a842ee58ec0c653355ee27aacca54f2ca3b2bb15ddbec5793e39f82",
    "assets/template/legacy_template/sprites/heavy_1.png.import": "a8b8f1c757373b22432264aaf2ab5c46065d55184c4fa9a24fb7d66e984f1372",
    "assets/template/legacy_template/sprites/mini_boss_0.png.import": "5c7f8cfad2d8d6e4cd0be30c997f92494bcd0c2b39f00cc2eae38728708aee8f",
    "assets/template/legacy_template/sprites/mini_boss_1.png.import": "9de3c6ba9162ec8868f1b231fb432752aee85777d4707c129546f9ee2cc8db55",
    "assets/template/legacy_template/sprites/operators/animated/caster_1/attack_ne.png.import": "d4d928dce8be56bfce53caad06f0f358a9e9c060614f40a9ef0a86e5cd16a6a2",
    "assets/template/legacy_template/sprites/operators/animated/caster_1/attack_nw.png.import": "c6d34f1a4609e13c26e9a0df61fe61554a0908e0cc3c4911dd3eb8db536ffae2",
    "assets/template/legacy_template/sprites/operators/animated/caster_1/idle_ne.png.import": "29f5a859d7c03ed9cb576767943a30ebb4b9c629589c0161bf2707672c00a4f6",
    "assets/template/legacy_template/sprites/operators/animated/caster_1/idle_nw.png.import": "204045239923c36069cf8f120280a11089cc1f11cdddd5628f5fd1e8b24c44ec",
    "assets/template/legacy_template/sprites/operators/animated/guard_1/attack_ne.png.import": "2bff4a66ee897152def1e5244ac8d53cbad0b41a2d1c30246c9c7b8164314cb9",
    "assets/template/legacy_template/sprites/operators/animated/guard_1/attack_nw.png.import": "83f0c9de6b46c0d1221f790cfde86c634a5985d213698b20868f168a9c7ffd89",
    "assets/template/legacy_template/sprites/operators/animated/guard_1/idle_ne.png.import": "5c078af8ac0f1af088841e490efcc23d7564286599fd0708ff8d3f1265ee8d00",
    "assets/template/legacy_template/sprites/operators/animated/guard_1/idle_nw.png.import": "f057b7a2c0d9056646e288e111ac9e8268941c5c1e5883fbea28c8b50b23ecb9",
    "assets/template/legacy_template/sprites/operators/animated/gunner/female/attack_ne.webp.import": "c3b1cc959981026c1ec34edc9a96a081c80a84d0d7e5c990194e6e928bec0dcb",
    "assets/template/legacy_template/sprites/operators/animated/gunner/female/attack_nw.webp.import": "4081329a7e7cf20d909ae12ae0348be3478c5dc424287af9c9aa3d20f9c95cd6",
    "assets/template/legacy_template/sprites/operators/animated/gunner/female/idle_ne.webp.import": "473101a43fda1fbe1d3f72dd684c85db00635e458c1134bfdfd6177bbdc0f9f3",
    "assets/template/legacy_template/sprites/operators/animated/gunner/female/idle_nw.webp.import": "c146e2e785f17dda86bc8d36658b5c0bd79f4d18635296e989a6f791fcc1b885",
    "assets/template/legacy_template/sprites/operators/animated/gunner/male/attack_ne.webp.import": "2566b06dec7829cc653cc28afc6beac4c70b0f5ce042972e4a94465f1d4461d1",
    "assets/template/legacy_template/sprites/operators/animated/gunner/male/attack_nw.webp.import": "3e77ae18b3ef432d96fe6620c80030d365b2d7978251c3def9ef50e1c988a16e",
    "assets/template/legacy_template/sprites/operators/animated/gunner/male/idle_ne.webp.import": "4bca3ba11c4377c7ecc21d6c75bed90fd733d7225e53b63e764065e532aac09a",
    "assets/template/legacy_template/sprites/operators/animated/gunner/male/idle_nw.webp.import": "64d1a87f9741e5ddf31124f002c4afc4ef647da78453663ec8f244d9e5fe6aa6",
    "assets/template/legacy_template/sprites/operators/animated/mage_apprentice/female/attack_ne.webp.import": "ab8be2e3b728f0bf9255db8a82418b303223b5198b441f4467bed793adc3032b",
    "assets/template/legacy_template/sprites/operators/animated/mage_apprentice/female/attack_nw.webp.import": "0c0903cac833bc0ed1c0d8ff687dbd86b90f8013c7f609a8815a3d7cfa36bf48",
    "assets/template/legacy_template/sprites/operators/animated/mage_apprentice/female/idle_ne.webp.import": "90ad1042c2fa7d3af0783f36c112c19f39070e39924146e9ecb864f8bba9e848",
    "assets/template/legacy_template/sprites/operators/animated/mage_apprentice/female/idle_nw.webp.import": "d663968ecd2ca3fe8c58e6daa7dd7314cb4160398d4fd60791be2fc2c0dfa5ae",
    "assets/template/legacy_template/sprites/operators/animated/mage_apprentice/male/attack_ne.webp.import": "4c40e8feb751bc011e46052181d02c34b11077e47bbd91fd487f6d9b573bb420",
    "assets/template/legacy_template/sprites/operators/animated/mage_apprentice/male/attack_nw.webp.import": "d6aeba33180bdf893f6d410f796dc118cd93e944fe1d560cfeabfeb9b5928d96",
    "assets/template/legacy_template/sprites/operators/animated/mage_apprentice/male/idle_ne.webp.import": "87b136ace51e156aa223690f4e0ce7c66180aa04e720b70896d8ef907e2f3919",
    "assets/template/legacy_template/sprites/operators/animated/mage_apprentice/male/idle_nw.webp.import": "a95b53dbc19662486d6924754b8e039e2c0d07ac015fa044d39fdd427d56a63e",
    "assets/template/legacy_template/sprites/operators/animated/recruit_female/attack_ne.png.import": "dfd8b3b78acb29a3b3482593cc82eaebda58e793f4c540061aa8b385115a67c4",
    "assets/template/legacy_template/sprites/operators/animated/recruit_female/attack_nw.png.import": "6c56890fce26825c8a737e3993513bec12fb27c8b455348827f028b5a14abfdd",
    "assets/template/legacy_template/sprites/operators/animated/recruit_female/idle_ne.png.import": "86a83beed072cec4d47eccd51ace4e3552ee3cbd65fee26837c270892e712de6",
    "assets/template/legacy_template/sprites/operators/animated/recruit_female/idle_nw.png.import": "a5100f0202782050b37ab92c747a8e006b97029f58531c46737d91594d796dcd",
    "assets/template/legacy_template/sprites/operators/animated/recruit_male/attack_ne.png.import": "95545303452b29d574182dfffc55ee7f08479299c1d525429e69efd19b617e0d",
    "assets/template/legacy_template/sprites/operators/animated/recruit_male/attack_nw.png.import": "54666769ef22b9e8951d78ab6c6ff55daf5a34b9539dfd302df4f4f1cf8115fa",
    "assets/template/legacy_template/sprites/operators/animated/recruit_male/idle_ne.png.import": "9c205092f65755294f1790c169691af610bdeb821fb0f94a6e83666b01317279",
    "assets/template/legacy_template/sprites/operators/animated/recruit_male/idle_nw.png.import": "3e92437332dba049f190d6e0f0dd6b0fef598c373a025cd31951578b2f84d671",
    "assets/template/legacy_template/sprites/operators/animated/sniper_1/attack_ne.png.import": "9fdf5e0097b77a6090c0293c75097cb37eef6ea7f3f03a9d44566d9a3d9c46da",
    "assets/template/legacy_template/sprites/operators/animated/sniper_1/attack_nw.png.import": "53243089ec7aef488890466c7aded0efc7879c0be545a61f37d2047b79ed38ee",
    "assets/template/legacy_template/sprites/operators/animated/sniper_1/idle_ne.png.import": "a1b69d17df9b12ee283a9c857925b4f0771527506b60d12270d659eaf5b41b8b",
    "assets/template/legacy_template/sprites/operators/animated/sniper_1/idle_nw.png.import": "4f52124581e1dce9b14a37b450380139050f46ba014636c3982fc5517218d411",
    "assets/template/legacy_template/sprites/operators/animated/swordmaster/female/attack_ne.webp.import": "5996cd191524220bea7bacb53f7d7e8d6af41c262c8690f2967248ede5040a0a",
    "assets/template/legacy_template/sprites/operators/animated/swordmaster/female/attack_nw.webp.import": "804fc3a5df2e31cfc8b4b5b2c040435aefdf4732d006354a2fd841f14add63a3",
    "assets/template/legacy_template/sprites/operators/animated/swordmaster/female/idle_ne.webp.import": "3b3c0ae5533afd89b1e0f6d222983300bbea31bc5607de09602b8814dacc9481",
    "assets/template/legacy_template/sprites/operators/animated/swordmaster/female/idle_nw.webp.import": "749868a7ca47c15b789d53dc36a72490a946e6d908d2701d01b605107bb9e7fb",
    "assets/template/legacy_template/sprites/operators/animated/swordmaster/male/attack_ne.webp.import": "5e9bcbce85e2259131c73d207f1b361b35a91217433a1f4b2756dce37482b80a",
    "assets/template/legacy_template/sprites/operators/animated/swordmaster/male/attack_nw.webp.import": "c58b2d8435ab68939efb08b85395ca57c17ad0e5b4d1eea7eb9ecf9c85e291c0",
    "assets/template/legacy_template/sprites/operators/animated/swordmaster/male/idle_ne.webp.import": "fc722a1ba5f8fafbdd6006e176b3d35d399f444a68eb106c8290b6531a819a22",
    "assets/template/legacy_template/sprites/operators/animated/swordmaster/male/idle_nw.webp.import": "f2971bbc1c5338a8bd650d49f48eb3d435bd513273978b0e62d4bf9d5c53bc7b",
    "assets/template/legacy_template/sprites/runner_0.png.import": "163c44d2170a66921e229ce59ce85b04d683cd899006d373c5f8415d64bed322",
    "assets/template/legacy_template/sprites/runner_1.png.import": "42ee0901e341169566536c10730814b9df94c1fb71624c86a187b95a8039960e",
    "assets/template/legacy_template/sprites/sniper_1_0.png.import": "1d950a3e310c084f8794a4551ee618f00e2605399ddf9763e8983ee8d5a6207e",
    "assets/template/legacy_template/sprites/sniper_1_1.png.import": "dd3443b87ddd1ce022f01cb644db75cd6a58372f4253cc2afa5838833876d59f",
    "assets/template/legacy_template/sprites/sniper_1_2.png.import": "ce9c95aef7c9552049c4cf74f4bec416d39a46fcb4dcfb5efe325f2b3c756b5e",
    "assets/template/legacy_template/sprites/sniper_1_3.png.import": "52afeb7f4ddc548b3c149240ad31ad782983565f42ac5e4eab2d6b259f2770a8",
    "assets/template/legacy_template/sprites/sniper_1_4.png.import": "e944c17e5bc4a842ebbf46fbc014c6d00ad9d9f744aafa2f1a1acab2f6543d4b",
    "assets/template/legacy_template/sprites/spellcaster_0.png.import": "7d4cd50ec5650437837626b9966e457dd1c6bd70e010a413d8ad11a1860dea62",
    "assets/template/legacy_template/sprites/spellcaster_1.png.import": "b9e98a4722d4a529ff7fcded36f9b32351b5b5d5063094ffda388bc83613660b",
    "assets/template/legacy_template/sprites/trap_spike_armed.png.import": "fe55030aea4f1570337dc4f9f7c9180ab2693c1d0298a2f3955b50e36d835972",
    "assets/template/legacy_template/sprites/trap_spike_sprung.png.import": "65c540d685a755645f7c767615b59c0839ee46d1bd6a0564dd2e90c018ba2845",
    "assets/template/legacy_template/sprites/trap_tar.png.import": "e4c822dccd7e78292aa2b4d2969dfea79479c5363ccb1b7c8861f4dcfdaa0192",
    "assets/template/legacy_template/terrain/proto_isometric/README.md": "4eeb7e8e11c771d7de3ce84fe3b7ba7b6406e4e1172aa99454296e2ea335e139",
    "assets/template/legacy_template/terrain/proto_isometric/ancient_ruin.png.import": "f7e8a6373519cbf6627c4a7f493d4b385f56bb4a5be0c2704a9de31782e858f9",
    "assets/template/legacy_template/terrain/proto_isometric/blue_ice.png.import": "a2fda1e9d4225837908c849fe390ba3fe57dbb8766c1242620695d4e66d1b6fd",
    "assets/template/legacy_template/terrain/proto_isometric/dark_mud.png.import": "1023c46723cf31c19cbc552c99a7c45933554d8cc95c13dc0850c9e652ed6b72",
    "assets/template/legacy_template/terrain/proto_isometric/desert_sand.png.import": "f495facb5cf5f69ced321f061b2123c7654e2fa82e42da95562e97522441cab9",
    "assets/template/legacy_template/terrain/proto_isometric/iron_rock.png.import": "9dbacaac3347fc6fdef701f0c36f9754abf73759c214e993782ec584c7e6251d",
    "assets/template/legacy_template/terrain/proto_isometric/lava_basalt.png.import": "7155c72ead47c6ed26429f2c41378cb33dd8f8a27032d68df60af09650c0adf7",
    "assets/template/legacy_template/terrain/proto_isometric/lava_flow.png.import": "f986661c048ef0169be372d72083f908177c3a362c7c3a56132d6c6aa9098129",
    "assets/template/legacy_template/terrain/proto_isometric/oasis_wetland.png.import": "014514dd9bf7eb37a1e1240e9930e7e1a43befa66066f1cfef06acf307148736",
    "assets/template/legacy_template/terrain/proto_isometric/obstacles/frozen_pine.png.import": "b9c72559039412f07c3164e7d50dd7b27986f61732806ec01a637ae000b3fba1",
    "assets/template/legacy_template/terrain/proto_isometric/obstacles/frozen_snow_rock.png.import": "f05194765e21ec4d05e162c6d662be60a91412010a136cf9dfe4d2302032b9a0",
    "assets/template/legacy_template/terrain/proto_isometric/obstacles/lava_basalt_chimney.png.import": "8d6351fb96043f6cd73b8f44a0ef1fe06e3cf6eb44d16ff84d9ec7486bb5b0a5",
    "assets/template/legacy_template/terrain/proto_isometric/obstacles/lava_obsidian_cluster.png.import": "0e8b94574cb22166512d1385dc57c241af8f9246e41bdc9c74a4efa53c22385e",
    "assets/template/legacy_template/terrain/proto_isometric/obstacles/wetland_mangrove.png.import": "c0fdf233e738de67c9ecf93ff56ce5361b109bfa8b8bc7cf2c78e1b3b45ab309",
    "assets/template/legacy_template/terrain/proto_isometric/obstacles/wetland_stump.png.import": "57c639ac55d5b9e1aa8a53cb1bdf8b35d557953fee4d839330e5fd226031a69c",
    "assets/template/legacy_template/terrain/proto_isometric/salt_crust.png.import": "9db1c51184f9e3242ad14983d44e35e2c4fb452e32a920178e4ba01130fe8630",
    "assets/template/legacy_template/terrain/proto_isometric/tundra_snow.png.import": "08cd98c4f9683116c2226544cd14a65e29e521772f6519f015c916a4e08db085",
    "assets/template/legacy_template/terrain/proto_isometric/volcanic_ash.png.import": "7a5ca707c6ab828013fe498ac5c916a05dc284768e6d5c80d3d08a7c29135ad7",
    "assets/template/legacy_template/tutorial/tutorial_block_shield.png.import": "78e60cd5a3e5b8f75062e4b42568fe12d08b56e314a2afa2ecb5b3fa6b4a179e",
    "assets/template/legacy_template/tutorial/tutorial_deploy_gesture.png.import": "1f3be02e8ac2b8d512896cf87b5bbeb9aaa6db48162687be7c12833056e3ea7d",
    "assets/template/legacy_template/tutorial/tutorial_route_marker.png.import": "aff11bf5561db7b01d545f5a474edf52bfcbad3bd24538f92b15a0d15198dfc2",
    "assets/template/legacy_template/ui/cursors/cursor_action.png.import": "0e16598f494dc0839b1efeb9b8775ef60c4006d848050cc7c96aa3ecb587df2c",
    "assets/template/legacy_template/ui/cursors/cursor_busy.png.import": "d69f2d11df4abfda9d398188f72d776cc2102c174ffb3b204cf56e440524f112",
    "assets/template/legacy_template/ui/cursors/cursor_default.png.import": "80c4c41756c5b4c72fb336675e36f11eacdfd001e54406debb85c17ff2fba902",
    "assets/template/legacy_template/ui/cursors/cursor_deploy.png.import": "d2a7fc1bcd858592c5c6548e21401a33bab1740022504508f6b14a909219b5ce",
    "assets/template/legacy_template/ui/cursors/cursor_heal.png.import": "1fe93d34c252a8576e44caef7ffb12e7b9d016ee205475066a2ed32cdda56ef5",
    "assets/template/legacy_template/ui/cursors/cursor_invalid.png.import": "54cf8ee9c7b94d60f34eaf89a494d9c8ebf7e560b6c1817138b6bfc9e7294d24",
    "assets/template/legacy_template/ui/cursors/cursor_pan.png.import": "d8ba37cbd9992e27cde90437ea09875174a1552459aa4c877f96fe1b20fd1c2d",
    "assets/template/legacy_template/ui/cursors/cursor_pan_grab.png.import": "942e5f65dd0bf10008d2c7edf7c18f9852cfc97ee992263caf4cc53ad688edcf",
    "assets/template/legacy_template/ui/cursors/cursor_select.png.import": "76edc84e62e8dfdbc11b761bc2dddbc163c98f7b3ed077c194242c570f55c6fe",
    "assets/template/legacy_template/ui/cursors/cursor_text.png.import": "b3de3f19d51b9d8875a4a18c4675cf3e5229ed45fc8b63c32c22502ee37215ed",
    "assets/template/legacy_template/ui/cursors/cursor_trap.png.import": "abbd7f53b952c69cbb297f2a70d88fbba563683d340673b3711134b096deb125",
    "assets/template/legacy_template/ui/factions/SHA256SUMS": "2ad797e6fea4ee865e46a1e210b58c846a81acfc42cbe19deac03e6f9d083f01",
    "assets/template/legacy_template/ui/factions/crimson_aegis_banner.webp.import": "c71d12b30dec4118d0bf0a841cbcf171f803ef13f75bc4d0736a6b3b283a89ee",
    "assets/template/legacy_template/ui/factions/crimson_aegis_symbol.webp.import": "01884c3139aefec8f4baec72e5a15fb2d43a31ee5411dc326ceaf9c85ccf2420",
    "assets/template/legacy_template/ui/factions/lunaris_reliquary_banner.webp.import": "f5b000ba5278cb0a684eda8753c86e73561786bb2b87687190571543dbf57d6b",
    "assets/template/legacy_template/ui/factions/lunaris_reliquary_symbol.png.import": "7dc63dc003bfa01c7d1b100923de262dc9fddcd1d6b928374b447ef9ea6d9c3d",
    "assets/template/legacy_template/ui/factions/solcrest_accord_banner.webp.import": "2755fef42242c02fc289669964ece86cd46998c0f4a4eddb73883472e8aa3d6a",
    "assets/template/legacy_template/ui/factions/solcrest_accord_symbol.webp.import": "613650b62337790ab10e1bdc84dfc301486cfca1b94ca4956096fd2b28048a86",
    "assets/template/legacy_template/ui/factions/vesper_circuit_banner.webp.import": "ef7d8c9d0c6de5acd5fea85b85d6e2a89b579226de39fb0803517b2607cd566c",
    "assets/template/legacy_template/ui/factions/vesper_circuit_symbol.webp.import": "5603f10f6e1a8083069c21516f443a4fcc135b179065c3dc45181eddb35a92bf",
    "assets/template/legacy_template/ui/staging/icons/exit.png.import": "fc9334b7a2dbfdb200af01f9ad9072c0a511ae36da2b874fba044a6799c64fa0",
    "assets/template/legacy_template/ui/staging/icons/lunaris_seal.png.import": "c41cafcd2329870482dc738f49373c9af8a41061864c1cc46d1cda3f6b37b741",
    "assets/template/legacy_template/ui/staging/icons/mission.png.import": "37a6b6f89ce3e0fd5f8a05e189506ef0261cab81ddae3aedec37ca59c12f7941",
    "assets/template/legacy_template/ui/staging/icons/resource_aether.png.import": "9e85da8c2a40094d2f93c8cab6c2129a9e235239c8039b1f6f2a72128d9dc3b4",
    "assets/template/legacy_template/ui/staging/icons/resource_sigil.png.import": "5adc3df940bba40538c43c5a2496444b5cf378cfb76ec2d392b1c9651885d165",
    "assets/template/legacy_template/ui/staging/icons/resource_stamina.png.import": "6a2ab95ad46b392e169d2db218d968d306a9efbfd5175f96d8b7361bda7ab192",
    "assets/template/legacy_template/ui/staging/icons/settings.png.import": "f02a3467f673d2dd2dc07400e234534cba3bb9c445f5cf139f43305af71a7be0",
    "assets/template/legacy_template/ui/staging/icons/status_diamond.png.import": "fff946928edb0027e17d5e79985b64f6ab5e78e769892d892f9834dfb5035b4e",
    "assets/template/legacy_template/vfx/high_threat/s9_green_cage_particles.webp.import": "d149800201dc75030475aa25e23f6ba078f731931ca33d76ca312f959dd8112c",
    "assets/template/legacy_template/vfx/high_threat/s9_green_cage_warning.webp.import": "86e8abc726d570a75f7bfd1b1d9da72c9fecb9eec9dd285a98a05814e052cf6c",
    "assets/template/legacy_template/vfx/vfx_deploy_dust.png.import": "83c2270a7ff1fc7238951b734f81de8974396abb1d65f5aea3b094066e8bc19a",
    "assets/template/legacy_template/vfx/vfx_kill_spark.png.import": "29c0ed0cbec852f278ee277558c7bf2114d74cd7a1a3ac29452797b9496ca8e0",
    "assets/template/legacy_template/vfx/vfx_leak_vignette.png.import": "b8524cee5bc58bffdf95028b71ada21ef5aba85d0e93649d8fdc4887a01c61f6",
    "assets/template/legacy_template/vfx/vfx_result_stamp.png.import": "b9efe525bc1b2a084d52e88c8f4fed35e477c4a6f68c58d2c0832ac9352d279b",
    "assets/template/legacy_template/vfx/vfx_wave_banner.png.import": "7afbadbac99bca4897bdf401291480e2bc9a136b2256523a1bf790036106d342",
    "assets/template/legacy_template/world/act2/restoration_lattice_seal.webp.import": "7fb7a5a5139530a649c63479735c9dbdb34f5c2dc1edd00cca2351810fb42f40",
    "assets/template/legacy_template/world/endpoints/holy_crystal_idle.webp.import": "a56c1d64e578e3adf0294e7ccd7ef59e5d5645ff2e86c0358916c626c3291877",
    "assets/template/legacy_template/world/endpoints/photon_portal_idle.webp.import": "c7e8e82fec49091ed8344799f987c749490c6b704b789b370fb5d68ec54a0621",
    "assets/template/merged_animations/fire_earth_cast.json": "6a368db30a8ab53add8ccb318c54325b5a9e0bc00d3101c343ab223f43f1ee4a",
    "assets/template/merged_animations/fire_earth_cast.webp.import": "5132676c6f4a82065a4b7828d06fd927b9a8da7eb958323245e01d10ca37a7f2",
    "assets/template/merged_animations/fire_earth_idle.json": "debafd8eb53c00656fcc5a9703034a75d51512719e6faed6dcefc0a00d0dc6ce",
    "assets/template/merged_animations/fire_earth_idle.webp.import": "9b9ea97f8acfc7e6766fb9d052d7aed970d302413fce904fe9d6574e2e73d6b6",
    "assets/template/merged_animations/fire_frost_cast.json": "ea8f22e49754e496ec3c0107ccc00c99896ddc94889f097a9e921a9cc4b2bc33",
    "assets/template/merged_animations/fire_frost_cast.webp.import": "4b9df83b02836528769307f6f239114dcd506c7398a4d0c0e846a6b5587be143",
    "assets/template/merged_animations/fire_frost_idle.json": "63bad77d1f8c2cd5a48072218619331a3b08a377524d2566ee5b90c18f3bc046",
    "assets/template/merged_animations/fire_frost_idle.webp.import": "0dac2b60cde63053998d1d2213eb0d9461f3028b3b3ec457b97e1c6223c533ba",
    "assets/template/merged_animations/fire_storm_cast.json": "983a9ccf2f0d83c360745fe19f1d87cd1299974600fe43ad9b7ea0443194eb2d",
    "assets/template/merged_animations/fire_storm_cast.webp.import": "c8cba3e0a1048df4d34cc7efaee6f6bbc2d840cc667581cf1a99086c1aad2818",
    "assets/template/merged_animations/fire_storm_idle.json": "f9f58987b49226f7cef621dc09f41a8687ea885788161b7019eed304b4b66230",
    "assets/template/merged_animations/fire_storm_idle.webp.import": "b5446f4714af9f911aaaee206cc1908aa41ffc9a9bf568960e9d683f1530ee91",
    "assets/template/merged_animations/frost_earth_cast.json": "61efad35be85c791cbba6ae3330f959c670686bfe73864122043f1caf535964a",
    "assets/template/merged_animations/frost_earth_cast.webp.import": "bc391581daf238169b2ee8a8e24950476e8ed7426343e6232464400b6a221fbe",
    "assets/template/merged_animations/frost_earth_idle.json": "a271202e63924d5caff1958823305cfd8c698e4f9c07a7d69ef6142414f4ddd3",
    "assets/template/merged_animations/frost_earth_idle.webp.import": "6caa4ddadff650e73549cfe621be341e186dfb2f3d5d71bc38477424c02e43aa",
    "assets/template/merged_animations/frost_storm_cast.json": "1d155b0972436885bbfd5f296e86df6a0723a6c76e8fc856d5708eff14255c88",
    "assets/template/merged_animations/frost_storm_cast.webp.import": "07ee4f033e4b3adc6136246a29aa3f34f1680c396662aefa92598918e2a48ec8",
    "assets/template/merged_animations/frost_storm_idle.json": "c9f432305350d95a6ac014d01d69799e13f5dad832225486ff01944cd1f36455",
    "assets/template/merged_animations/frost_storm_idle.webp.import": "a4cc12426245fec9c24f97de8a374a4112d752d95fde3679cdb41d799e55a378",
    "assets/template/merged_animations/storm_earth_cast.json": "9bfd7759058b175245c1f0b1113da92494dcb7525d602b0273b4d8db7d40bedc",
    "assets/template/merged_animations/storm_earth_cast.webp.import": "c3071eb4e3f5bb493bfdfc258a685cb1b021935fae079e5f5fd568589a6acd4d",
    "assets/template/merged_animations/storm_earth_idle.json": "c43ee91e44011555fea21db181e16e490a7f9b1dd88fed5d39c2e3b91d1ad5ab",
    "assets/template/merged_animations/storm_earth_idle.webp.import": "0e9d3261bb98611d782a0911197b789d5e4e01174d0c4bc900f4ad80070c51fb",
    "assets/template/merged_guardians/geometry.json": "bb14cd89e43e0d9077e7e83e3ded8c5ca22c442fb69d71ce24c68d7edde1c189",
    "assets/template/refined_animation/harrier/NE.webp.import": "6d6d2cf444c6cd2ac5565f7986ef8e3ba94d849615519113a87c03813b516a48",
    "assets/template/refined_animation/harrier/NW.webp.import": "8cc62d8e02d6e4dede76bd23544658ff6c8a10fa565be075193216f6d4572fd7",
    "assets/template/refined_animation/harrier/SE.webp.import": "cea42ed2c0fb2406c97003c645a814f17ba576264910ceedafc32ea6c1259f56",
    "assets/template/refined_animation/harrier/SW.webp.import": "a2752a51f4e4bd89c71973459c9e556983060d5a0e7e54fb9a4330467e8df36c",
    "assets/template/refined_animation/harrier/harrier_runtime_candidate.json": "92a69e6f0c95cf2a29f24fdc556b855217e8a2db5883c211eda2331e28d9af2b",
    "assets/template/refined_animation/worldheart/worldheart_refined_animation_descriptor.json": "9a7012ee824ee795f589ffa299d6dd2e99229b3cf554240f28c4b1d7f585a84f",
    "assets/template/share/grove-20260924/favicon-32.png.import": "392b87a8f2df756a1cac74697569a75bf8317dfe7b5f1e383be46cf3c36d8683",
    "assets/template/share/grove-20260924/favicon.png.import": "88d55b6ab920e9e7e7f76415468e29aecf518ebf856a91c0d8531cc208a23e6f",
    "assets/template/share/grove-20260924/loading-background.webp.import": "59fa055c280d7fe852fbc0a4ebfe32fab3e12cdb33d86058facaa66e00c8a075",
    "assets/template/share/grove-20260924/og.png.import": "2c695b7f030e5392d5b1992048534568065a678cd5167c8bba81fccd1b11d23f",
    "assets/template/share/source/illuminated_gameplay.png.import": "30dd26cf5ac022c804be101ae963c3015bcad67b79732287cfae7d17d60238a5",
    "autoload/manus_font_theme.gd": "f5c18e03351ce489df31cb1d5e0e6ffccd9ba35b3265bc3e94f3f7eb33aa6678",
    "autoload/manus_font_theme.gd.uid": "4497af5b889e552232df028d6cd56573be136ba3f6ba639f1ccc9832f0b6fabd",
    "autoloads/content_pack_loader.gd": "11c3358b314f8b53fb7c06e42032a4b651a0f2fbe8f73aea96fba3e46181b1b9",
    "autoloads/content_pack_loader.gd.uid": "21ff4d88c219d01562aac1105b27d515c1387fb9c198eee40ae55da5c0ec69e1",
    "autoloads/cursor_manager.gd": "ca379e30e14b058f026568892c24713d802c5aa6ca320388c7a5cfef3e54eb28",
    "autoloads/cursor_manager.gd.uid": "afe96aa9f9acd49d5161eb0e58ec493d63198979bd88f0451e9f56bf1fd92c0b",
    "autoloads/game.gd": "21bbcf5e915fefec764c396c949fb0f7c4848492da7a1b40093e6d805cf8d46a",
    "autoloads/game.gd.uid": "5f366f87409b972b420c3ae261490bf995b7c33e4c66f215cee5f66a3028e87a",
    "autoloads/i18n.gd": "22c1a9e43cfafdc7dd7776b844bbba496ea508b1de941b43d22cbe369bd600c5",
    "autoloads/i18n.gd.uid": "20112838fc94e5178b2a102fd4bff3016072e9310f65819a5f6624442bd6fd2a",
    "autoloads/leaderboard.gd": "60a0d6678f14402fe77db0f0e63da62b335478514f2368caecd87af8a53367dd",
    "autoloads/leaderboard.gd.uid": "bb926a43914f17bc9884eaad0d104c258120f83bf84cc2dc876568c543d5477f",
    "autoloads/music.gd": "48360e11c42e4fbf141402a9f6c9f7fb42a187f1f034eb0823a6c2e156849e43",
    "autoloads/music.gd.uid": "639482025c876090624558c9e999e8cce54e7443b93f0a127964510c3a100795",
    "autoloads/sfx.gd": "e9efc9ec2c4f2b833f4b4f1bc492af7e38b976500929240d1fd3568efdec28a5",
    "autoloads/sfx.gd.uid": "64e60cff1fe43a214e8c66ee732a8c5b642862cdcf3296440700c4593231dd21",
    "autoloads/test_run_guard.gd": "6c9bc3ae393203b68935f99d9e28df1229b547385e5a5073bbb0f3b9163312cb",
    "autoloads/test_run_guard.gd.uid": "f947516092901f4fe6f168b6fb64c871e7a4a46fa00523d42848474f1f48ae7f",
    "autoloads/text_scale.gd": "1c995562a872fa413d79394952ca89205b229dafe0187699685eeb97ac69aa7e",
    "autoloads/text_scale.gd.uid": "f87c24962fe6582efff4b1036e36a02733ec5885d2e8ddcf5fd36b0e061a9148",
    "autoloads/ui_feedback.gd": "afd8da7910708712988a46486c34df5710a8605e13dbfc5e1959698713551a6f",
    "autoloads/ui_feedback.gd.uid": "913e1bbaeff134e640a195ec769738805d6ce16b2cd47ccfc1fe808830a8d75d",
    "bundled/fonts/Cinzel-OFL.txt": "f5a242cf68ad6ebd0603b3359a74c593ca080318a681035be5296ba2c6b04ae6",
    "bundled/music/catalog.tres": "1a0b8f65928930cc462b5fda00c1e20b1b8e605b6171cb00d6c2bf68dd2cae23",
    "bundled/music/music_catalog.gd": "152f9b88267ca1988adf19c401ccc081fed29c3f194ab9b2cdedd996c7c5aedc",
    "bundled/music/music_catalog.gd.uid": "d5baa772b118a7faa93ff1ba659f581058f49b520524a2089748935a97fb783c",
    "bundled/sfx/catalog.tres": "c1a48720474747da908f8127a7d40c40fa2c5474942b01a8135cef46a6037bde",
    "bundled/sfx/sfx_catalog.gd": "80c2da32d2cca8ff07a4b7f89a48462a46e78e3b8125522c2d9618053a4fb518",
    "bundled/sfx/sfx_catalog.gd.uid": "f58cd303ad0cd3fba36fe5bae241d0d88f22483797b398ee13f2931806468fad",
    "data/campaign_def.gd": "ddb3e0cde3fdcc8490f0e6463b2a85b1d3a6885234997e50475374b025ad1dae",
    "data/campaign_def.gd.uid": "19242d68dca5dcfa56ff3c5f5f0122a4ccbc28b099e92c1cf76ef3ce22c83f1f",
    "data/campaigns/p16_v1.tres": "ce2a642b7e01efc4551685eb32061ba382960632b37b64e689de102bf1e9d4ba",
    "data/campaigns/p16_v2.tres": "aeaddec6bf06ae71db07ebdefca101b4e3c9c9a49318f6c07867b878176886ca",
    "data/campaigns/p16_v3.tres": "a363038676c30a430d4aca807abe7ead5cb85c3aa4cf160ad65ea34c71599d9d",
    "data/class_def.gd": "5ba3e651ad0beaeef936bab7b4627e89db7923a28588ded17de2c0ac53209243",
    "data/class_def.gd.uid": "5aace6a59bf8ea7e191dae1d28a5dc6f8c371ccd169e9f7e2d84404bf2f1829a",
    "data/classes/gunner.tres": "afd36700324639be079bd1128f044e7b3de2f815a3b73ceea035490b7e44d1e2",
    "data/classes/mage_apprentice.tres": "3706b8165f0356ea7747715a876c45b7e12b4a10abde65df7441d18dfa9b0bdf",
    "data/classes/recruit.tres": "0327b8fa34604ae95698082f75324f8665d7669f87439424771460e17308a8f8",
    "data/classes/swordmaster.tres": "225fdb5fadaab04c17aa94cb3ccbafb86ada7840c4091b79f4b9858bd7ad3774",
    "data/config/game.tres": "c9e725311c2c445acfcf47170b2d8c80d608eb5a902aebebf54e7f74c57c3dd7",
    "data/enemies/breacher.tres": "021a1894aeb301b04029f7c2d68ee56eff0f552fdcdd157b817eaa0e87575acc",
    "data/enemies/broodmother.tres": "ecd4a97a88713e7f41d9b6fb340577074f1c52aff7ca5859184f2c135668b1a8",
    "data/enemies/dragon.tres": "fbe382b9d6837583b5589d6f82bd540595c16bee9d10092b3f2db9d3f40a6729",
    "data/enemies/drone.tres": "09617d564385788aab5e85ff3be794ec4681144190717e2df7f3d14323b2187d",
    "data/enemies/goblin.tres": "4dab36895641e22e48ce0ac3e854a8d9582f12a7e583d7e838703c51f42a46d8",
    "data/enemies/grunt.tres": "938e394dff3b04338bd10fddc155944508b3f7237c05e5b63689edba60f1059c",
    "data/enemies/harrier.tres": "d239ca06b107b02789a9addb1dcf3b4636d9f5f4207ff70fec827da431598218",
    "data/enemies/heavy.tres": "7b8924ec5d6aa879768edef324f714a89493bc3ddf48bc62fcef31654d4698ca",
    "data/enemies/interceptor.tres": "bd8d1caf5dc6113f93c59447998c4895e12daaed4c20876d2c336b2bfa1f6dba",
    "data/enemies/mini_boss.tres": "9229e2cbd3022c1557abbac9f99cc2a31f23ecb4d9d5a575ceed26af29bfdcd7",
    "data/enemies/orc.tres": "9c4c94da087566ec714b4e79e91267822f367b5cca3c9577a1aaeb610293b05a",
    "data/enemies/prismback.tres": "a60911acdd199730cddb7f92904572825a6245ec869fdc2fefa800476765bee5",
    "data/enemies/runner.tres": "b540279ac2c25aab5bfe4e944005ba1f9877f558a900cd18ac4796a25b0fe5f8",
    "data/enemies/shieldbearer.tres": "5dda445027debcfe391f534dc0ff9727924075d0c73d49573cf256e44b55abad",
    "data/enemies/spellcaster.tres": "bf8cb957038df9a8f11d732d7126fd46b6065f824f87f71e2509e7e1e4ad84df",
    "data/enemies/troll.tres": "78987f957b0f968afd541ec4817a5603637698e955a434b13a20a912a3e8cff6",
    "data/enemy_def.gd": "66194dae145596368689f426794399d79b8d47b13117956b255d2820e9e0153f",
    "data/enemy_def.gd.uid": "a7a74b22bd3a8b7903bd27200c0548c4adad18fbc75f98533d6e55fbd9fe8317",
    "data/game_config.gd": "bcbf549f4b3ccaa220eb8bd1ddcbd42f5c371cc13988d78b650eb0ee5299c833",
    "data/game_config.gd.uid": "dfeae4551327539dee388e3221d2524a53e012630bd0e97325343c6ba4ad51ed",
    "data/juice_config.gd": "244407872cbf8c4362a3ca03b7b2fa26da5acaabef56b3cb9d612f057e254a02",
    "data/juice_config.gd.uid": "a5d8dc143ba14666374dc36abe79e9e608afff7e9751213362c690e88f3dc80d",
    "data/juice_config.tres": "eb7bd3838f55383a0ed005ac52d12e98e85200ac1abff95d44395428ea4d1efe",
    "data/names/hero_names_v1.gd": "e6b09ed1212b582d410e1fdca14340caa54199a2977bfacd2dc505431dcee72b",
    "data/names/hero_names_v1.gd.uid": "ffd8c384411e4dc76868d0d72f3e49d0199983f5fa47650dfd953660f135adda",
    "data/operator_def.gd": "f33f45d476bc07071177f3101ab4ffd5af4161faf73e409571862a654a9d1ecb",
    "data/operator_def.gd.uid": "4ef18105c937e1a4ebb41ebc421bdc7851cff3f3502f3aeb88bb804df31244d1",
    "data/operators/caster_1.tres": "cdd64d3af96a214ec879cc798319d7eb7c9c980ba548bb4cfe40ae632eb138f6",
    "data/operators/guard_1.tres": "83d1e8f178a68a9adaa1104ec95bc408ffb4b42d4f043da400f1881de20a2897",
    "data/operators/recruit.tres": "1168553af0e82b0f22732fbc63a9661f0ace228216c3c004244b0482e48e7b5e",
    "data/operators/sniper_1.tres": "e5dc25450f2664026aee01be78164fd6b381f443b59e82d1e451145b92fd9a82",
    "data/presentation/advanced_operator_proportions.json": "013efd1ad9e0929b2af6c74e588e0f927e5972d492d4088fe1757cad70a7ceec",
    "data/presentation/audio/audio_cue.gd": "f65aa823226d70196b9a1a5408415f46389e0c4d039c7a4bb0c354108071c609",
    "data/presentation/audio/audio_cue.gd.uid": "34186bfc5a9b5d12c0a47cc0e856cbe9adea8ac42cc44c98d73590c6b86fab34",
    "data/presentation/audio/cues/act2/lunaris_act2_s09_return_path.tres": "56d6f44093fce96f59076e2180e4b9e999d5fa7f2bb9b3fb5a185c518762e791",
    "data/presentation/audio/cues/act2/lunaris_act2_s10_covenant_orchard.tres": "85b51e0b0f966658e405636e79519cc19f4b5df0796269ba6e9716a76a016421",
    "data/presentation/audio/cues/fablewood.tres": "97c75f10db7c53828a3257cf37ecc5e6273ba323251fc829396f8e9dc84bb9e4",
    "data/presentation/audio/cues/lunaris_battle_air_raid_high.tres": "f0610463c687798b1d4f0ee18691ef3fbaf766d7d0e189633b03004ac42d1cb2",
    "data/presentation/audio/cues/lunaris_battle_air_raid_low.tres": "3a3cbc140cd0306e05beccaf299b3d3a2764d805e17f70c3243b9d5f94890f79",
    "data/presentation/audio/cues/lunaris_battle_air_raid_medium.tres": "63e51967fb5940f113fcd39170305d0c72a67e3c38d46a9cdb50fab9d472b492",
    "data/presentation/audio/cues/lunaris_battle_gravity_lattice_high.tres": "920f9acdeb2b6b7e5ff8fe9e7880d1a85cd73510df8e6161f60d9e4bd5671928",
    "data/presentation/audio/cues/lunaris_battle_gravity_lattice_low.tres": "1284c735ee8690c0d4b03eb33de8f5a9b34179df4ba8e9079f4705dfb22deef6",
    "data/presentation/audio/cues/lunaris_battle_gravity_lattice_medium.tres": "9ca3ae47a3731b087c2ba77bfc9ecb3721c310570902a5dac4ca5e8382823cc6",
    "data/presentation/audio/cues/lunaris_battle_orbit_early_high.tres": "af1faf43824a1c646b89d59958c88140ea9c4d668e6d590d93e0c6b8a52f2153",
    "data/presentation/audio/cues/lunaris_battle_orbit_early_low.tres": "1f4d792950cd3a10558c4de66bd604d5728cb2010b90f682230a93492216d410",
    "data/presentation/audio/cues/lunaris_battle_orbit_early_medium.tres": "dcb78e27bbe212a9328b878e17598156656029ea560941df1f324f028896520c",
    "data/presentation/audio/cues/lunaris_boss_gatecrasher.tres": "aba53920efa47682906328b418a80ce1bdb0a92f89bb84f0c92b6cb9d311f066",
    "data/presentation/audio/cues/lunaris_result_defeat.tres": "f68e350d7fe1926d9804df86c6b5232210f09886b22d34a0cff977ae2a9af4c1",
    "data/presentation/audio/cues/lunaris_result_victory.tres": "17e931f995df0b6f3488b62e6928587f0484caefbbd214ea28287bede0972182",
    "data/presentation/audio/cues/lunaris_staging_archive_command.tres": "9fc564498c895d0076f1f51bb42c6f423c78139f99bfbd80c5b7888c571ce699",
    "data/presentation/audio/cues/title_lunaris.tres": "8c687a5a261cf93e50ca43d03270f6ada131169af7f95933bc9523f026f5dd38",
    "data/presentation/audio/lunaris_profile.tres": "6805a5a2bd3f8e8ec4aa935f95d1867c584fc47b015a14ca7ceb7053b516d44a",
    "data/presentation/audio/music_profile.gd": "ebf6317678590e172ffcc4072700e1bd6d9f58bce2d096a6fadcf77e11a6c9e6",
    "data/presentation/audio/music_profile.gd.uid": "648a66386c54e35a3e35aaab400cd3c8e1af4b23e13d20ad7afe1ca1e2de403a",
    "data/presentation/operator_animation_def.gd": "8494c174103f1050d8208c637735e8bcbb371e7c98d0a7eb5cc34bf5898eb927",
    "data/presentation/operator_animation_def.gd.uid": "633dbb3efe5b65e527c7d213b0b1fcc6495a780202aa6b5883f9841c20f4e228",
    "data/presentation/operator_portrait_catalog.gd": "346bbe1cc14682ad6c06a2594689fb80d566844d4a01f3922b9f54346e6f4c06",
    "data/presentation/operator_portrait_catalog.gd.uid": "1b7cc69bf51bc71c21e28a353b706725df80dc773223f49fc0b50ee4a6430c3f",
    "data/presentation/operator_visual_catalog.gd": "1824957a06a5dda422d14352a7e0f6cd7e13a707e3ac247b0bbe549c997c5d4c",
    "data/presentation/operator_visual_catalog.gd.uid": "00a848dd8e6f3f8a0b78c153e158a4ab80267077de86271ea6d4d3308ebda376",
    "data/presentation/operator_visuals/caster_1.tres": "833de930760a453e7b61ede0f3647fe5d4937a66ec8a7c88df12dd4f6b787420",
    "data/presentation/operator_visuals/guard_1.tres": "308dc2912f82b8e492b5c7c0a8dd2381ad4f1b8ccd3dc56300189e184ed0534d",
    "data/presentation/operator_visuals/gunner_female.tres": "155ccd4896daff7be10da6712e574132451f3e675b96919a45c04b8c88579bd3",
    "data/presentation/operator_visuals/gunner_male.tres": "d02a8be5ea1ea0ed7dcb720d8c17d67790e69da51f238d27488d23ec3f4d43ea",
    "data/presentation/operator_visuals/mage_apprentice_female.tres": "ef5b2b9e6acde8bdf5132a58d0b3685278d8b87737d4f8bb61eff62d28b8b26d",
    "data/presentation/operator_visuals/mage_apprentice_male.tres": "66e2a52c3b55060c368a4dc4849b7a5b95ff6d86f4a26fc0d807c291100626b2",
    "data/presentation/operator_visuals/recruit_female.tres": "be527c6623b4efcd2b0f882beae120ae73e1453455a760f53d99d30746772bef",
    "data/presentation/operator_visuals/recruit_male.tres": "3abf2899be10526c234846f4ceedac1c81b95be2e65a0f3bcb66c8e72d23af6f",
    "data/presentation/operator_visuals/sniper_1.tres": "e4ffbee359f4e453dab6b6b86f308384da626de11d3373ec293e7537ef6a9584",
    "data/presentation/operator_visuals/swordmaster_female.tres": "29446c9c208bef6e30ae971729ef8e1a052fe23c5a582106bdad5c157c04c9f2",
    "data/presentation/operator_visuals/swordmaster_male.tres": "06aa5fa3d8da745eee91d021eb1b3a35fabbce9a5a1e8a48fbab05898235341e",
    "data/presentation/s1_world_theme.tres": "b5741407a8126f019dc107b21ebd0c2acdb4ad362d29581e75d9b85afdcf6186",
    "data/presentation/s2_world_theme.tres": "d0ad6c72fec0fff46d773d9b448218d6bf905b4b5f1074c66fdde64374b0b394",
    "data/presentation/s3_world_theme.tres": "c0442b726b65444c261b94d09d5d21fdc3f6a86179714310d1542f8bf6b208d4",
    "data/presentation/stage_art_theme.gd": "6f2cb46e3797b3e64ad9992d7fe8ce4bc40303460b85c21ad81a48dcb223ca79",
    "data/presentation/stage_art_theme.gd.uid": "92220563d3fdb163644f5489e2ab94ed65ca0c47d22968435bd1205488b0e982",
    "data/presentation/ui/fablewood_theme.tres": "4d645150bec433dc40d449a3dbd1832f9a4fc37ad31e1e41d272504545af3b8e",
    "data/presentation/ui/threshold_material.tres": "4ac6c73262b22843c6e0d1556c0c15cf9436aa6da484330b6b700e5652aa9189",
    "data/presentation/ui/threshold_theme.tres": "b18f867491ac3d3794cff598eb69fe5725de573967f5838d5212d8c58a7d9f36",
    "data/presentation/ui_material_tier.gd": "df8aa8a53312099825ab0e487ae9c9300304c8a3471f016e39d1e7e4329d4a30",
    "data/presentation/ui_material_tier.gd.uid": "0bc02e5e2fdce936df73b74510f922084627c25d43275ee401e1a4da80f5e093",
    "data/skill_def.gd": "301dc6adec7ad1b6146cd183a2e86aa9461b65434d316cd4f5d314579552033f",
    "data/skill_def.gd.uid": "fb8409be55fbade91e893956c456647b1042534602788cfa00a211ffb9f3eeda",
    "data/skills/conflagration.tres": "fdbdba9a0da186903a80aaabd8ed8b564eb5bc41c14dcdd3539c3b90bfd5fc00",
    "data/skills/deadeye.tres": "b106eac8180befe87c8d09e9147766fd942639d0a0fbed33de07959b8ee62c62",
    "data/skills/flurry.tres": "7c79e1a675815ca8706b3c1636a3ff901eacd21a3f90ca0368314f790d9b1531",
    "data/stage_def.gd": "cd5f01a87844805b2d8c90dabd34b5419a74e0a50468d2dfd0ab5ade1ba0702f",
    "data/stage_def.gd.uid": "87015e2090247aed4bf0c604055bb5c8513ef0925cf913649e5126d96c70765b",
    "data/stages/s1.tres": "74ac71ade9d10aba8cd49d02d64e5b571d7e135d29c9271e4b3225b1bfc8bcc2",
    "data/stages/s10.tres": "486ebb560f01867091544a8e8052ab410c99f20a008ae484568855b5e5fbd88f",
    "data/stages/s2.tres": "cda515516963629de07596f5998f1368feea09c4a667b5d931f5e87bdc327338",
    "data/stages/s3.tres": "03dab257c91b07312b74fb0858270e114ae26310e0f03bde79713dbcb21cf123",
    "data/stages/s4.tres": "26e8e0ce036cec76d35492b5ea63a0940d9f55664c59f2db0bbcaac8fc5c3df4",
    "data/stages/s5.tres": "6874468b3c1f93fd0e029a720a6fec21cb5fbfa4193416d5a3a5d8099de7a950",
    "data/stages/s6.tres": "37f967a2648146524d84042d5d03bd22e1e10eb53654f9504c9c2bc43c0ba62c",
    "data/stages/s7.tres": "8c4e793a6deea47a4534aa6a871e4fd865762423ee007707fe0c0915bef04b88",
    "data/stages/s8.tres": "d83c8892e9534bb4b90eddd94c0a8afc818a079e7004cc461dfc795aa2fc72c0",
    "data/stages/s9.tres": "9160d0ed88c2334698df151a212a5347b9eab82dc7ae61e21dc04b1ed2c2100a",
    "data/target_policies/enemy_blocker_only.tres": "522f40bee2d5374fb050260a96be96a0e9c543530d9c2ce37ce7adae1f1811bc",
    "data/target_policies/enemy_blocker_then_nearest.tres": "7152e09a33c7acafdad6ebce88cbdb4309b74448c61775c25c40b9521c2c810d",
    "data/target_policies/no_automatic_target.tres": "ef964a4ef42fb29901ed789c3c083cae76a73611e621241c087a081c151c46de",
    "data/target_policies/operator_aerial_first_frontmost.tres": "d662635bfeb3c919eb4520dc03ceaca768efbf585927db2949dac6587fe72f8d",
    "data/target_policies/operator_blocked_assignment_order.tres": "0383facfc7be2ca821571f2f45ca3cd2c77a8081c1bf7d035582f60b25cba7a2",
    "data/target_policies/operator_ground_only_frontmost.tres": "2ae67aa8be5a0156d77f2084ab8d3d54bd211ffee4b5284bc6baa95dbf4e4af9",
    "data/target_policy_def.gd": "5bd09a0c2fc4d7f8d99f93f3f07cb4830016e6ba1d34c6eba049ab3ec8a2a395",
    "data/target_policy_def.gd.uid": "89e7d8ab8a11d966b5c44d39b43629e59bd53ca7e7f206d4e4e498b6be00420a",
    "data/trap_def.gd": "80d52c4f6872d10798cd1f6b751310fd52892d867e5f4acc65ad7b48bad9a40d",
    "data/trap_def.gd.uid": "ec06e93b928efe494feb009ebc0400db1c07674a49232078b98b4e85654f4b9d",
    "data/traps/spike_plate.tres": "0a860d4442d1d6ad91caed5d1e7f2b0b5af3fd2af7fa414e8b730b93e1da6a7e",
    "data/traps/tar_pit.tres": "2f0bb2e33d9d6ddfcfd63bae8dd8c6d3b9f304bfd1dafa9ca1ff4d2b5ef5612b",
    "docs/FABLEWOOD_VERIFICATION.md": "c1c286963ea2022940be478141dfcf05fae3169a1988be1ec783a25a354e9091",
    "docs/LATE_GAME_ENEMIES_PLAN.md": "35b32983cdfda56d29b8d7ed0234081cc6258186235c8ac2a60deb1c273c2a83",
    "docs/MERGE_IMPLEMENTATION_PLAN.md": "cc6476f265e976e09953dcb4eeaa126d13a62cec2cb9f352b933e76711f28257",
    "docs/ULTIMATE_IMPLEMENTATION_PLAN.md": "44b3277fdfb6048496dc7e78003f5386be4a1c663848eb9e1ceed5febd3bf53d",
    "docs/WALK_LOOP_AUDIT.md": "156d717e9d5a6277fe9a286a29aaccc986bf04c5fb80b381a3f6f715f628ec43",
    "docs/WORLDHEART_IMPLEMENTATION_PLAN.md": "b6513c930a6fa1d2a2134a55f0fe66e7e3849eb2c31a6e2a86bc94c50c30405b",
    "docs/game-multiplayer.md": "af4dfd273e65ff5a1a547b7fedf5a61e039b0f8305e5415962533313eca3ad68",
    "docs/provenance/historical-receipt-corrections.json": "3140f42055ba61f3a4eeab94d69f9e82cfca7df8fec47e232368e50b30a41e44",
    "docs/provenance/historical-sharing/illuminated-v1/render-receipt.json": "c286393630746d25abb79d5f5ddb73ad886aa98f0e9866cee6a58cf781d27657",
    "docs/provenance/historical-sharing/illuminated-v1/retired-assets.json": "9b2daef3e2c3c0dd2e17ebaa66b9f552829b4e2751031e47e0d36a80062e5991",
    "docs/provenance/ip-remediation-td-sharing.json": "a760ee2272daed1b2dc983b3d33c0e3c4f2591baa7cf117aafb7db08fd761416",
    "docs/provenance/manus-generated-output-rights.json": "4423a68df087cc39180947025d6b967cc56245003bf304f22c71539c98e69308",
    "docs/provenance/td64-generation-tool-receipts.json": "0e608e9c7f7de6a88445348a130416a7a8cc69759d5d199ee47f60e6b8da120d",
    "docs/provenance/td64-selected-transform-actions.json": "347c419439c58c9c39f955452326a7765e905737f7f13d06893d5adeecc38f6c",
    "export_presets.cfg": "19e3b447b2116a1528083615e6d84ad93e32b52a08d453be248d0c3ce6dbe8ea",
    "game-sharing.json": "ea1dda948b71ccd26cbaab298383ffe8bc499c6de92e5773001796367c992032",
    "game-verification.json": "e48da3519e1225a45ac5cb971d9ba2b10798620d01079cfd2bffbea571afce48",
    "localization/en-US.json": "b06bd336aa44bef30c9fe3b38fdf021a95938f281426e2ee24f607021eb18c60",
    "localization/zh-CN.json": "8a6121ece87bd36e1f78d4e2cf544eb9efff3c5eb1bb16c6331e824a06282520",
    "package.json": "3f9770e074f676040455bc910a1c1aeb3e6541678c5f5cfdee31d23f8547d2b4",
    "project.godot": "62baa8a0e2e3eafeca79ccbfde10a98a32a56f100c9357874114259cbc3713a4",
    "scenes/battle.tscn": "4e891b87974d261bff99e50b87d91937fbaa234764c93e1a005bd92877c3875e",
    "scenes/loading.tscn": "a8e45960d50f27dce71339dc3b4072fc65840bf311f236385019df05d23dfeab",
    "scenes/results.tscn": "722ec098d7b55fd2edd3f8e81e9453810447ed4c58434bb0fdf253c20758d368",
    "scenes/stage_select.tscn": "f055770d2a4f91678ca9ab4be7ebea837199593d2f362645af70e9a4f70b7962",
    "scenes/title.tscn": "ac3874fdc60f18db7bbd7742fa6bd4cd7bea7bed7763f8d974c65d6f9ba4c0c7",
    "scenes/ui/components/aetheria_locale_selector.tscn": "67c2231beb46b9ae076608ee3e53ffb81e044afdd6f7b17e24a42c153b18ad15",
    "scenes/ui/components/aetheria_screen_shell.tscn": "ffb34e20a9b80c6e0128561cc7570845e64c94e4436c728946f109cd2b3e1a37",
    "scenes/ui/components/leaderboard_dialog.tscn": "f445149613a3a9e3d3066b82bdb015c44f6de4d6186495b79fb99f67d9710a0e",
    "scenes/ui/title_settings.tscn": "3a16e8be5a54ec0d01d2c3c9f8dad9e462339e2bd5817027e89d376cb177f0e4",
    "scripts/fablewood/atlas_layout.gd": "29fb14bc760c4ae8651131b6a9bee0d49d082ea44b2352ac3a1291aada8aca9d",
    "scripts/fablewood/atlas_layout.gd.uid": "f9c4503c6f50aa4c02abf00286ad7a1aad1ecd91d3cd5aa4dcaa0086530d5414",
    "scripts/fablewood/build_placement.gd": "9fbad8762597b0e8623d493aa3518602b5fbb7f7bfa0295ac2ffbd065162ab84",
    "scripts/fablewood/build_placement.gd.uid": "31246c128b92ab559d5d61f1ba3599ad6b7f1e61361918dbc4b4ce7fee1e9743",
    "scripts/fablewood/build_placement.gdshader": "026306f4ca9db902365609fcb7d86b7f51544d6d20e07c6e685323b9b93a5894",
    "scripts/fablewood/build_placement.gdshader.uid": "204d765a7d4b0f6f180f39b0176113997be0a93dbba580acab738f6a5b6a40d7",
    "scripts/fablewood/combat_particles.gd": "6128692e9082225b4e798c71e0cf943d4a72111928d852cad41163ad04d457e0",
    "scripts/fablewood/combat_particles.gd.uid": "0eac827347ccb2415728995f3d15a07c86807b9f96f0ea32a8c0b50845db4790",
    "scripts/fablewood/endpoint_animation.gd": "933807e911a9bd199c31450a7e99725b69e89150e5c74d70c8983bcffcac5bd7",
    "scripts/fablewood/endpoint_animation.gd.uid": "f23fc0cf0372a445fcf34624c8604709c37540dcf0fce6a3ab4207f12b53c6cf",
    "scripts/fablewood/enemy_animation.gd": "4db33a74a0bc147a961da233136fda1c330ad483036ca22161a26cfab34c5a4a",
    "scripts/fablewood/enemy_animation.gd.uid": "8c77f398dca47b24e99e9fe7333f17f675c722659fbc3aae0294dcf7b0cfd7c9",
    "scripts/fablewood/guardian_animation.gd": "886c383c4f0b88c7c0aed0a8ee273da3e1a3cba249bc385b2b309010a2994c19",
    "scripts/fablewood/guardian_animation.gd.uid": "8a9c2bb6c2ec3e6b45b6e2473d581931ce898e01f65eb72021378170451d7d7b",
    "scripts/fablewood/guardian_icon.gd": "8f9127b1d13314fec0fb59494d476f7c30d8b18d0d2a7b76d2c1862323a10335",
    "scripts/fablewood/guardian_icon.gd.uid": "f0639add0d9ad2b70ce4921f126aa29190496a958aa04c2e309d3ffb1369288d",
    "scripts/fablewood/late_enemy_visuals.gd": "d4b7c8f9d3ef6426b50c0fc4ecb8cca139d854ebd8a2beb3db76cd4e4ca6466f",
    "scripts/fablewood/late_enemy_visuals.gd.uid": "e3ab2203d6f9ac98fa1f08119a9b7b9a3645ccbed9b6276552a86e266e21cc85",
    "scripts/fablewood/merge_celebration.gd": "3fbfaf5555a84e0613df01a0c597996e03b7b30973ea1d9a9d218d45bad9b99d",
    "scripts/fablewood/merge_celebration.gd.uid": "a9794051fc589add282025c3380ddb01032e4ded18246f607224bf8650ab2a90",
    "scripts/fablewood/merge_flow.gd": "f9d424f0daf04367d5f2f9ec8e3837dc55a828d82e982e29aadddf666f5c4af7",
    "scripts/fablewood/merge_flow.gd.uid": "af272606a7d72c0f908a0e624beef79d1eb3ec331983d56c511584c5c9f6c789",
    "scripts/fablewood/merged_animation.gd": "005ce7a717c705e055b7e8583ebb761b18eea4afcc8255cf580ba436d538f8eb",
    "scripts/fablewood/merged_animation.gd.uid": "1c2b033190bdd1b251d8cd4a319cf8ca493b7f6d663f427e864d7c9d1c298b93",
    "scripts/fablewood/merged_animation_layout.gd": "74610c1aef4b30c683f782b6868cd30e201df820cd9e856d3466e8f7224e3bb4",
    "scripts/fablewood/merged_animation_layout.gd.uid": "6ff01fef43b5e29a41142916226c4d19ab1b31f6fc3f3ae59808aef83f0eb7cf",
    "scripts/fablewood/merged_art.gd": "122c8d81c2c69e134b608a5735545f3d811cfc3977b43aca46386baf77c8d23d",
    "scripts/fablewood/merged_art.gd.uid": "d91fa0883d77f7b2d284be8f3a8bf1d516a1ad8116d7d9a16511a8a95bd743f4",
    "scripts/fablewood/meteor_effects.gd": "7bdff52e0e735bea3f9d574ba22baa1f87d598f6b763863797749dd3a9431ea3",
    "scripts/fablewood/meteor_effects.gd.uid": "696f2605ceb680a12d0e7d4e1db167f3228b89c175911ee5bb89492df202c0e9",
    "scripts/fablewood/music_impact.gd": "da18538a596214c7b1637e0aa6efd5e64ba526c7ed28db7045c0dd30be11348d",
    "scripts/fablewood/music_impact.gd.uid": "f53a8ef881c8e0261cc76d0e06e6fd454e6fff2573354031369cbb8785adcbf4",
    "scripts/fablewood/music_marker.gd": "4cdbecc6dbaf78b8139d50fa5b4f8c81f0ef5d1076b379c9052b630d68f34eed",
    "scripts/fablewood/music_marker.gd.uid": "fd8095886befacb92072a2042f2711db722bcd3e452e60a8233a725335cdb14c",
    "scripts/fablewood/next_wave_button.gd": "cfaf0e90eacb23cd4c5761a2f6be69bd72ccd06454c8d60e8dd7033b499e0343",
    "scripts/fablewood/next_wave_button.gd.uid": "0d6e3faf0889ffa56b8c6865e81cd927a828c26c92179a6e28bb148447248f7c",
    "scripts/fablewood/organic_terrain.gd": "ad83191094ad1c6ae835b6b09273c4474a632696c4c93cc351075fd1c36be2d3",
    "scripts/fablewood/organic_terrain.gd.uid": "0b4ad4ee3b28dfd16a6161b9a619ddea66f4ebdfd998693d1ce9f81725d0f052",
    "scripts/fablewood/organic_terrain.gdshader": "9d0f83048b4bae455ba5ecafe2dab06467b900dd183c08f1ae38d3bef1591bd3",
    "scripts/fablewood/organic_terrain.gdshader.uid": "ac97c6cdf5486f72bdd8399c4fd33c0746a1d900c1e5d843f1f30156fd2468f2",
    "scripts/fablewood/presentation.gd": "24c8cadb93302ce69232dcf6a2c1ae249c1bc1fb40056bbd183850ced7e0a637",
    "scripts/fablewood/presentation.gd.uid": "8e152b7f0b48e3d369836f8e3d3d5ea1fc0f7612ae85d56ae27729f030548a69",
    "scripts/fablewood/screen.gd": "926eff3332aa53938b061cc94208993b3f89d7a13120c18396033109422c21a7",
    "scripts/fablewood/screen.gd.uid": "31f9fc62261f270233c3e6b91d24e4f0f5a6d27884fda39ae76959a8062c11ae",
    "scripts/fablewood/screen_filter.gd": "e8e1476a904690918039efb313f3d2f461f067f021a13de7a3c1e9c41f1e9cad",
    "scripts/fablewood/screen_filter.gd.uid": "9dd73a2182a2bfc46c30805ecab2a99a42f17f97afb0794b0d34c58728cb54d6",
    "scripts/fablewood/screen_filter.gdshader": "c4e6b9ab623e0ccd33ae90ae6e87d096407563644f2548d5aedd3be249239efc",
    "scripts/fablewood/screen_filter.gdshader.uid": "a5b651edadd7f6d064b7c42dd5f8e6781918553bf8c77cb6bdd0e2c8dc5b36ca",
    "scripts/fablewood/theme.gd": "9372e9e70bdceaf65bc3787bfc3dc02ec0e8be8360325adf4297278e07ce2ab9",
    "scripts/fablewood/theme.gd.uid": "8e713df60bf60297bd2ebf14d7720274e8d1f6d93a0525dbfc9bff3a32f8c992",
    "scripts/fablewood/tuning.gd": "8a7f280bf7d42ea20ae0a917681c100850d4df7b5ba0bf1a97b621a8e02da68b",
    "scripts/fablewood/tuning.gd.uid": "71519259cd82c352a7e35507277ede4a134d848a6f1e250e6c9eb1ad21e80dc8",
    "scripts/fablewood/tuning_catalog.gd": "ffc107501ea5d5adfa2ee9fa420d9b59d95e08302fc10136b743e414153213c4",
    "scripts/fablewood/tuning_catalog.gd.uid": "c278d80a98684123f4e2f248d481f92741927b957e7ea23e6952d6d5a7dfb11e",
    "scripts/fablewood/tutorial_callout.gd": "fc93779c3665f3f7c239e90d63849a1dfaa3efa8d531b903b2b39260a058db7d",
    "scripts/fablewood/tutorial_callout.gd.uid": "4028a8bb0462b6cc6373e7e9acf224dc0e364526d71aac67befbe7054cef6334",
    "scripts/fablewood/ultimate_effects.gd": "4c32b5de69cf2dd740ab2877e174c933160551fbe5ead025aff0869b615aa332",
    "scripts/fablewood/ultimate_effects.gd.uid": "ccba0c4cc849742f83256290677e2140e84d0270ea28514f6254b6a65f4b18c5",
    "scripts/fablewood/upgrade_button.gd": "0a57700385348a399a300a334af5c125d43b38534eae25b2fe19fbf3b17a66cc",
    "scripts/fablewood/upgrade_button.gd.uid": "b58cf4eb03244d65a44ca037915e9abecb0d46aea5fa8c6b2fd5f54490d69fde",
    "scripts/fablewood/world.gd": "161aea4f6aa0087fe031a1d2ad3996de20f36119e36c2c23aa24f508aae2b7fd",
    "scripts/fablewood/world.gd.uid": "b74b3a98a28f6922faac9dc1f39b71368b600f0488fb5500328cc1da9d43c8f8",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_backend.gd.uid": "d08dec0bbdc7da47ae4858e9961cddff68b058fcab1241f3202e0041704fc000",
    "scripts/manus/browser_bgm_player.gd": "3dfbe63c26ce47cd41a1c50c94ad1bc51eb99a3daf494cec3aa81d123865de5f",
    "scripts/manus/browser_bgm_player.gd.uid": "81bc41000704bee2a87b8265c2a7ff4c0387330da74d234536cf9e70e6b91128",
    "scripts/manus/game_fonts.gd": "ad08cd7c0b0f0a6be310ccf54aa971efc4e9b449f194b1a0239b42ae5c7463f9",
    "scripts/manus/game_fonts.gd.uid": "5896d3bb7246d80f553ef96174a7747356e45cdf2bb62a5b6c82cf55370ecfe6",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "086161cda3c89b968d6b59d365ac08ba9067da7037b84768ea78a1fa45a6e568",
    "scripts/manus/preview/tuning_adapter.gd": "400fbd541d4afedf4770448601a5f260f26400ddf3793f82e37289f820acfb3b",
    "scripts/manus/preview/tuning_adapter.gd.uid": "0c3eb67bf977f610f0e21dc585efec7b66649dd4f7f6e670e040d3c15f87ab41",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "4536943c21d6b1296f71912aea6d65dc7b0312f0bc14f907843a6be3d24365af",
    "scripts/player_data_reset.gd": "edf186df535ec7b99100eacd8939e2552bac4fd93c6a96e921ad8979751e2cc9",
    "scripts/player_data_reset.gd.uid": "45104ca073ef1b348dce1d4d3d06dcef0f559f811e705a683d21badadd771f48",
    "scripts/ui/battle_controls.gd": "c788ff4095fc557cf67ff64b8302faad95099c34a356e1c4b9dd48b2343dbd9e",
    "scripts/ui/battle_controls.gd.uid": "3e50cc7b24ac42df74e33f6d2b2b813fc04db2f96534a366f92c6bb5cc54b3da",
    "scripts/ui/components/act2_stage_transition.gd": "7a4fb2c3d988862169c9c365bbe82122666cd657e4965890ad51cc4d0c1de293",
    "scripts/ui/components/act2_stage_transition.gd.uid": "3c95da16f5d1c00faf5bc795244c8ccb857a3348a1025b5c0d26e96b7e289fd7",
    "scripts/ui/components/action_hover_feedback.gd": "b777b3b816778e65340e40b594f8fefaeb24d403106036f7c11d91b0fe15af5d",
    "scripts/ui/components/action_hover_feedback.gd.uid": "f0e50b4b993dd3f58358360ffcbb61596fa1918c92dd7fa7e42286be17c5fe07",
    "scripts/ui/components/aetheria_button.gd": "99cf99fb31bb10194e9764636775e3629bcb557135cd46190bc9dcdda09467c8",
    "scripts/ui/components/aetheria_button.gd.uid": "2a3c45546e87275dad5c6c6d8a21f9569464346e3c7358cde7097f31ce07e4f1",
    "scripts/ui/components/aetheria_label.gd": "a927a1651fa89d87931c61b35d8b88d05377df2ef27ccb663247b579d077dd4c",
    "scripts/ui/components/aetheria_label.gd.uid": "2d1f38297cbf54d53b6b191f3452f616a447b2a4e7bb753afcabe7b6ee692944",
    "scripts/ui/components/aetheria_locale_selector.gd": "1ba1f8d8e20bf2606bc30e4ab9238fb3e85f7a78d2ce4e609e2d979c031719b8",
    "scripts/ui/components/aetheria_locale_selector.gd.uid": "98b3993277b16491f6fa20963af1c0a14414dd8ee0c8c7d6ba471a332d8f03e1",
    "scripts/ui/components/aetheria_panel.gd": "b1bfef58981822ea3262de40becf8966f02a180aeae1b7e507cda0b28510d795",
    "scripts/ui/components/aetheria_panel.gd.uid": "53ec5e48a26d69124c4c7e313b98e516c8f980f3af3b94ebc7539143ee343c33",
    "scripts/ui/components/aetheria_screen_shell.gd": "b71812b061b63e90a7965b30428e843a6eccc466fa5403f1d31ecee761a71974",
    "scripts/ui/components/aetheria_screen_shell.gd.uid": "849c90f2ef3857d249ac8600b81aea7e5a58955601a1ae6a0b871b8dd2be2d27",
    "scripts/ui/components/aetheria_theme.gd": "562004ab323650bc59d1e8c0ab1918615ed8fc42b69d1f24ffed112e970dc583",
    "scripts/ui/components/aetheria_theme.gd.uid": "e797587fb9883abae8be1c68a750237b537cb69e539988a7d44559cc91dbc755",
    "scripts/ui/components/campaign_next_sparkles.gd": "f78e8df6be96c81b99b0fd3232f8e2a76077bbb0ea0fec16650bcdb5c467bd53",
    "scripts/ui/components/campaign_next_sparkles.gd.uid": "20f54dd2890a1bd0eb95b9d39db3c009a6633070b27b9bb35e4f73e5669fd517",
    "scripts/ui/components/campaign_star.gd": "a6a408efcf67705ee205a62a0c4847be60859fc1b3704e7474c702406a2a2fa0",
    "scripts/ui/components/campaign_star.gd.uid": "8be8d18de19706b73b026bc8b06fe66e964173a7da901b524febbb42e4a52ae5",
    "scripts/ui/components/command_center_tutorial.gd": "b1944c70eb8a489c33af68dfb0d4a349850aee831c049568a50ce895a5f81f75",
    "scripts/ui/components/command_center_tutorial.gd.uid": "1e1a9a42f6e83f7f8d53881185562989c8c4f998be9a6fae2fd0d60d675c1274",
    "scripts/ui/components/defeat_ambient_layer.gd": "8528985f7239783d63f3caaf53de9c05f5638cb28ca6788162fc3f6599f563c2",
    "scripts/ui/components/defeat_ambient_layer.gd.uid": "cf72c0add6e57c2ab117013607d6d2505d77d13552deea1feaa9ab855f3c294d",
    "scripts/ui/components/faction_heraldry.gd": "2a58c243fe84167cd014159fa919b51413f282428862b305ade72bb709af2d12",
    "scripts/ui/components/faction_heraldry.gd.uid": "a71c207c0dbc4b9a0146152254396622d6ac0abc4ca1a2917e6f0874fb1cc00e",
    "scripts/ui/components/generated_localization_schema.gd": "fd2abfaf5979b8b44140fcd603557feda6bc1f922c5840f996173e0b6dc88427",
    "scripts/ui/components/generated_localization_schema.gd.uid": "8701f446906228613b8fb86e1c5cb3e37920a604c8c1e618debb679fea8e3159",
    "scripts/ui/components/leaderboard_dialog.gd": "d8c35b3e5df392f83fd95dc9023c6fc1f206a8dd5cd9c2beb515de276108f828",
    "scripts/ui/components/leaderboard_dialog.gd.uid": "4ceb30fef791976d64e14e0952d397a502274844f7339dc512a0ee82453da40b",
    "scripts/ui/components/lunaris_dialog_sheet.gd": "e150711b341c046c065075328c508e0e7ae62e3192a6a52460ad0520d675799e",
    "scripts/ui/components/lunaris_dialog_sheet.gd.uid": "18de77dac795c96f73c1132866a6ba50e7fc1a203b8fef054fed5d2da30fd36c",
    "scripts/ui/components/lunaris_ops_style.gd": "daff420e9e08003062145011146c49fde1980cc97e241d270f3b47f1b272cc5b",
    "scripts/ui/components/lunaris_ops_style.gd.uid": "363d73f97be151a79ee10e04a2237cfe92568dcf4baa2281ec502e936ee1de58",
    "scripts/ui/components/marks_currency_display.gd": "d5b67f87be33e33f9145e85cb34c5a61129c9a625c3e308acf7bfd3d62efb227",
    "scripts/ui/components/marks_currency_display.gd.uid": "4db82661bacc140679d7a09094c34a7252be656bd7e322d2dee6051737ea1b01",
    "scripts/ui/components/roster_filter.gd": "6e842870c9e88e49010582242b3f21f14cae9b4dc04edfbdd13c9b046a070d8b",
    "scripts/ui/components/roster_filter.gd.uid": "09e12c96c42947c411b008af4741afe524045fb3798486910348e8333bd54162",
    "scripts/ui/components/staging_skin.gd": "bd560a3db8c7505043b17723cb692bff4bd2952d8662d63855e549f09b24dff4",
    "scripts/ui/components/staging_skin.gd.uid": "bfdaaaa2bf21056572677ff6703da7d050f69c6c75e4c57321a1bfc1c7661a02",
    "scripts/ui/components/top_aligned_cover.gd": "9056464c979009a5464aade5a4249368a9405e7d1e634dbdbad58f51a67b30ff",
    "scripts/ui/components/top_aligned_cover.gd.uid": "fc6b54f116cac0fb21f02115b311088935b55621ce90051ab924dc0eaf5e91fb",
    "scripts/ui/components/ui_copy.gd": "6b43a3fffe99673e11d3436bb9f878d04910b535573f4ed3671e0c0b5c6a9418",
    "scripts/ui/components/ui_copy.gd.uid": "72fc764166757e9cd2083ebb2e1580aec3ce9fc958b2ad7b28bec44b70f6e4dc",
    "scripts/ui/deploy_bar.gd": "25970cc3e26555542bc36e553b6e7a2a1d11dec6f6ebd6128cae542acbfc451c",
    "scripts/ui/deploy_bar.gd.uid": "ca1dee8d5e9dd60d840543c4871a52da505fd868b4023e55c33bd2c7d890e399",
    "scripts/ui/first_stand_tutorial.gd": "13b9c34d201bc636866d7ed6b54622ee1652bca70d032e212be2263915235eaa",
    "scripts/ui/first_stand_tutorial.gd.uid": "1518fcd2787fae612e5da2891ba533df50719beb4c5ef16cd6214c47e5334401",
    "scripts/ui/game_typography.gd": "a8411eebaa1b557cdf7d2d09dd4c65aaa5ff44b4b0ae00a4432974eb8a2547b2",
    "scripts/ui/game_typography.gd.uid": "b6d672ff8e5bd12c4ab884389a712af897e087d77efce08f7af252bf41b6c383",
    "scripts/ui/loading.gd": "7a0310f874f24346480a3103c751079c75ea44fee06af65e475fc18f5fbb0dcb",
    "scripts/ui/loading.gd.uid": "4c3f26fd08b213d000937cc03f4f740f546cf8fc928975db4510339368e74c62",
    "scripts/ui/map_navigation_overlay.gd": "e5108b7728d346679be5fe3872d05e09bfed6c13483cdc716cf2e286519ef5d8",
    "scripts/ui/map_navigation_overlay.gd.uid": "2541ed2100da5951eb86b0ee5b076813e115f1867c461fdb631a900f5e3f3285",
    "scripts/ui/results.gd": "619cc3529af918297b847b68e0477269be9ca005f516857a1a5d989e873768ce",
    "scripts/ui/results.gd.uid": "6ed5af9693488cd45369cf13f22837d135c183d21c16f6b41c21cc104a16d3dd",
    "scripts/ui/stage_select.gd": "4ebb747358fb4d3b8371bac2e9d8e59eed7f923fb7addf2ee7f3648a31bc2833",
    "scripts/ui/stage_select.gd.uid": "d7c51b6cb3ffe3bdd0ac72343760143403925bfb3dfa74fa440791c6eec416c6",
    "scripts/ui/title_settings.gd": "13056f8d00340222e7aa81e88cd81035be903bc46cce1d516555b09f51a5ea97",
    "scripts/ui/title_settings.gd.uid": "e360a313731613de6549b2fdcc63cfd6f843f0eae6effbca2c90f4b55ae20455",
    "scripts/view/art.gd": "c5882737ca3ea6c35a90a286958eb2d0ed891ba790e7265f0b0f16619d292186",
    "scripts/view/art.gd.uid": "b6b4e2d2f190a62602d41e094a84653737869e1da0b076e56d27771becac18b0",
    "scripts/view/background_download_status.gd": "0e2ccd86d1dbfeb63c27ce236992cd2fe8576d0fb4d2d244f294d3bbe38ee89c",
    "scripts/view/background_download_status.gd.uid": "94693f66308e1e54537e56b17871172a5fbf23099aabc3304cdc04aac83ffe5c",
    "scripts/view/battle_endpoint_landmark.gd": "0f4512d61d63802088eb2e844c9bfa4005726eeed85a3e7fdbf77236d42f46d5",
    "scripts/view/battle_endpoint_landmark.gd.uid": "69ff28669201ea5a4a6466236b2df9997c61b1b673b576c3cd853d4207fffd96",
    "scripts/view/battle_health_bar.gd": "cc64a66338aa1744ba00ad67ba5ccc0e2ca60ed88c08c29cf6cdb118a393cb94",
    "scripts/view/battle_health_bar.gd.uid": "27356667584e5396a9fdaca71da47bb1bbb02a3ab18b86b2d9e8ec5c7a79c010",
    "scripts/view/battle_hud_presenter.gd": "1860915ff191942e36f450a8889cfdc1da9773a267344996e24bad38acf55fee",
    "scripts/view/battle_hud_presenter.gd.uid": "e96bdfeea66012344ae7fe069782b03100d3a86a8f90d68031eaf883e2b9d9bc",
    "scripts/view/battle_palette.gd": "48111f346796e7a2f3bb406d96f7134916d267aed6049598f9d3e6d9b0c5be41",
    "scripts/view/battle_palette.gd.uid": "c9e34f72808dbbd45097b5a0191036d463e3c7f7b5098ffe879d73b690c9f0a2",
    "scripts/view/elevated_platform_occluder.gd": "4075964930e6b18a5063a7a8b69c033d0b4a39581b439d7a29afa6df6b820649",
    "scripts/view/elevated_platform_occluder.gd.uid": "a51607d10c24af89891dbffc006886dd185027de4373220da06637fc28ce74c5",
    "scripts/view/enemy_animator.gd": "34d2886557a8d56e21c6f7d4669ed87b7c9918a7462af3e72ca91d50ac17dff4",
    "scripts/view/enemy_animator.gd.uid": "3a353415cbffddffbb951ad70e5766aa9c5a722fd0152b78d44a44ba78c796e0",
    "scripts/view/enemy_damage_feedback.gd": "9ce13222dc1a6af5f5bd9f883fcc8ccdc86202420c15c4d13e051130ee8ca7a4",
    "scripts/view/enemy_damage_feedback.gd.uid": "9c14c42bbcdbd28cd15c1ce600c73023f2904fa815ad91b723ae25a8858f0378",
    "scripts/view/enemy_death_particles.gd": "62f5e6beedd2b7e1f17d599d3e7cdca55fe516fbbcf0e860cffe5c8ee801e7d1",
    "scripts/view/enemy_death_particles.gd.uid": "f0c419ae7021a8f70f49de876ff316687fb6befaa17b035cd7d9ee55010c3940",
    "scripts/view/iso_grid_builder.gd": "36951a9420c666b92375f9fcf3f5a0a5266f986ba8e8695d5be282639010f729",
    "scripts/view/iso_grid_builder.gd.uid": "accd4257e0802f386667bd8c77bd879065952ebcddf53b27f584d13d707bb7c0",
    "scripts/view/iso_projection.gd": "f330a1028682962584df177c910c12efec4d51a451373578cbc2b2ff24403765",
    "scripts/view/iso_projection.gd.uid": "d55c263624174038d3712b19b47e7917260eebdb95bf6613da754a88dcd0d983",
    "scripts/view/juice_layer.gd": "3edbecb2ac54cd11c20f5aab0157f8aec1b2b28a9aeeb0646b9ef27d79b2e264",
    "scripts/view/juice_layer.gd.uid": "28a13623bc14308622618b9ab78793a73389ba0b64aa3b678cf404c9bbf83387",
    "scripts/view/map_navigator.gd": "d66136f3329bc3dba0986690696e787e2c5b74d06511fd2fa758e7f542f8f248",
    "scripts/view/map_navigator.gd.uid": "e287f24016661576519c1ef3c0a48156d5a3a36e8921d4959cb0dbc2db9d9be1",
    "scripts/view/music_director.gd": "9ff800a1f9d1ac1215ecc1555068a0b63d6fc3d5568e6c7239fc7b660dc6fa5b",
    "scripts/view/music_director.gd.uid": "487418afda8eb1aa0a3e107d74c2963f026483bf8e40f7494561cf9b64c096f0",
    "scripts/view/operator_animator.gd": "8a7832d079ed1c04e418505d3485c12b20d74a4933d5cb4e904bc39ffbb84703",
    "scripts/view/operator_animator.gd.uid": "59886fa694172e496100a2c2a19a9e1b1bf3e1f97efa9c9cc88e3d0f41305734",
    "scripts/view/proto_isometric_terrain.gd": "5cc2094e30cf36a6e41dc410a87c63388d338269ba28532cb74631917c1a8e5e",
    "scripts/view/proto_isometric_terrain.gd.uid": "e7a105663d35e46d9c0e50694cd7197aa0a41a27b1771eadb3c357900dc1c2e6",
    "scripts/view/selection_ring.gd": "b8e40a14a88340d43d94d562cb2ffe2ef40349759a6a83b1098a23605cc4463c",
    "scripts/view/selection_ring.gd.uid": "628e57b64cc8aae5ad3ccc5ca6218c4167e33ab02b06364365e299fbc5827b69",
    "scripts/view/skill_ready_feedback.gd": "892bac178a1a2044afbad901998f7d4548f53faeee84cd3adae677fdd9ae1c81",
    "scripts/view/skill_ready_feedback.gd.uid": "d31b2f0b6217ac5e16462d09e2753c2d6b9162249777c7fe84cc6760afa6efac",
    "scripts/view/view_preferences.gd": "b872e7ef848b8d6ab80ab2db74c97b7c7ad3c0a74fb185c119e9b25ef0b87127",
    "scripts/view/view_preferences.gd.uid": "1f486faf9970949c322ab3011e473ef6af662e95c754bf2b0ac41572b8b565b8",
    "scripts/view/web_map_zoom.gd": "01faf58e8f02fdb1ecea615d8f29b3292b429044593e34cbbe54cb1f718395bf",
    "scripts/view/web_map_zoom.gd.uid": "3309cc6348066d93ff074bc433cd18b5c3818f5379495f8232b03457eca35fe2",
    "sim/battle_hash.gd": "0c2b926e14863eb8a4b8e2d5d17408b72b02e714760d68726014bcaf4a7a439f",
    "sim/battle_hash.gd.uid": "460b705de6d5ab0eeccbf3b7c5fcfe6e76739e99b9dfeb996651c3c369007055",
    "sim/battle_model.gd": "fc1b3a40bf5eb2454c9f5292d4833835e4562561b48a906b56cb626f6732904c",
    "sim/battle_model.gd.uid": "5dd72200acda389fbdc076e8b730bdb86a211a144705194a45d53d35538c1fc7",
    "sim/battle_outcome.gd": "ffae538b463194cab49c0aea34ab8df923fc857a6c883f1928166d3335f2f678",
    "sim/battle_outcome.gd.uid": "ee33047c8dab4f6ac5a93be34ca35c67c019ea84a3c1201fd2abbaf9d9105794",
    "sim/battle_outcome_builder.gd": "fe84efb346c4141c06e61e514dc17ca4b94fbae5729ec84753522c58879c3399",
    "sim/battle_outcome_builder.gd.uid": "e4d71a24ec5e260d09f0ab3d0235bff80c3e9c5666b43887ad98088eb214fa7b",
    "sim/battle_outcome_v3.gd": "a5eb68675ec245d495b5a06a8036122abaad61ce102bb55d5cafbc1f90b87d35",
    "sim/battle_outcome_v3.gd.uid": "68db67ac5a301713c2f5d98708aed172103ae7d8ae31ed4e4ac34ee5346fa423",
    "sim/battle_snapshot.gd": "2de5b27661ede893853fd73196d39dcd386394a522201e016e3e8d77d233a3bb",
    "sim/battle_snapshot.gd.uid": "ac736ce825303bb0657f0694582382d17b799458edebb60139d50f269599857a",
    "sim/battle_ticket.gd": "732014b80ee7ff9f2e1a683f2f31a12b31e6b47dca53aab8fec178ec32a2c71b",
    "sim/battle_ticket.gd.uid": "ee85979b51ce11647fe6bf4824d4112ccc58b7448bbd462578041d172ba3271e",
    "sim/battle_ticket_runtime.gd": "7ae1cb1eccee29e09c6c2c837a1218293fb5db4b7f5dd486d47574e20acab830",
    "sim/battle_ticket_runtime.gd.uid": "936fe1f0cd0b08925d38e8a5082f42561064fcd0a5eb688fd6121cc9eb877b78",
    "sim/campaign_battle_ticket.gd": "386940bbf2eb8de696f75505fd22c5765655240abb8a2eb431c55fd22122b70e",
    "sim/campaign_battle_ticket.gd.uid": "dff47b9a7c5556219c94f50b96c1f4fecb5a969c695b8b577b18601b13bf7d7e",
    "sim/campaign_codec.gd": "2742af3dd351519b0b1335f4c2a3e89ef5fb6f39c352ac47942e0ee79359b72d",
    "sim/campaign_codec.gd.uid": "cba7d9a7ebb7c627b3e213be9de06687d4103d4f13ad9dd2ddb5d622a46c1cbf",
    "sim/campaign_context_validator.gd": "804446580e1f19e357d81cfdc70b81d557e221732501503c4faa6d9baef50365",
    "sim/campaign_context_validator.gd.uid": "2148b68c2990ef39103c79546508b8e55de903e9323b6a570a5a60d218baefbc",
    "sim/campaign_file_ops.gd": "0dacb35febc376369404c4ac064a2473a24e4ec9e26434071945cbb4ae9e646d",
    "sim/campaign_file_ops.gd.uid": "840cc2f3fca0112bd4edf8a85d599783fdf026bb3ba43d108fe394b9353c18e4",
    "sim/campaign_hash.gd": "78ab1d06ec3a3b292fd5a0d8158139843f65c4bc0e93349e5027d8fd476d39f4",
    "sim/campaign_hash.gd.uid": "ef44602132f0186afda564e15590affc48038b707c5aafd01fa9b786834bd791",
    "sim/campaign_hero_codec.gd": "f3d8fe79d687758b28900a3c5324b4b9bd5888a95a31fde1af3a07d54e7f1099",
    "sim/campaign_hero_codec.gd.uid": "cddc7199b40ac42a37c31a1c2911ea18b71b925af0fd80123e6ee024ceb8afe4",
    "sim/campaign_invariants.gd": "74f74855679695bb4125be1f1ed8e57eb53faa4a86554e9871fcd0c90b6eda8d",
    "sim/campaign_invariants.gd.uid": "ffc450974a4a33f177cde71a2dc537ca59836bb30b1935b3b82cc769fa09ae88",
    "sim/campaign_legacy_hash.gd": "3d16f15b4a6b32b321820b3a5010359ec5cf63882af6a0206dd755b2b39125be",
    "sim/campaign_legacy_hash.gd.uid": "7fffe344ae6fdfd19a21e1c0bc74dcee9b22a1e8bd8c617840371332a3b20952",
    "sim/campaign_migration.gd": "a7177fa1c795cc5abb64fce0bdc80f63b373a9ce65abf5fa9c87f6476be03aa1",
    "sim/campaign_migration.gd.uid": "7702a7c13922f25af531854f6c8de72e1756e37c8297d72135f75336fe1d8427",
    "sim/campaign_mutation.gd": "f1807730c605f960909263f486c34eca85a82d9ad086f5c5d6ef7d9ecee12b26",
    "sim/campaign_mutation.gd.uid": "550dd1cc5d0c87ec3a8f6c1147f597fe4d711325ee9ce12c0d56a1b7c08d9fea",
    "sim/campaign_pending_attempt.gd": "de923ddbe343bd94f8fa1001d334775ecbc710da715fc8913b6e6de3be2bb5ea",
    "sim/campaign_pending_attempt.gd.uid": "0c10f7a0b3d60fa22e40d24f279526429485b6aa89449ca2cf439fe67c142c53",
    "sim/campaign_progression.gd": "a1d8796494a423b8686fd7e8ff18381355bd7f31aee2bc89a55d3ff8d5b51a7d",
    "sim/campaign_progression.gd.uid": "2e4c76cfa9de5570247f64ac377d8481b49c1808246dd789f227abbdd0070792",
    "sim/campaign_promotion.gd": "b2f909a9661d987b86462e7d5c399915a82ed87e74dbf80d8c6ec95901b9cfde",
    "sim/campaign_promotion.gd.uid": "043f93a3ccd7348872afd09202d1625c2eb2d9ff208467c0749369909885d0d4",
    "sim/campaign_promotion_history.gd": "cd6c6541fce723794c66828ed31872226a9656e611c1ba948f4b6f974b4c7cdc",
    "sim/campaign_promotion_history.gd.uid": "97ba8c2b74de5067604f87d1568a9f1f7ea8c9d86cda3161b32bb842fd1c1b2b",
    "sim/campaign_promotion_proof_codec.gd": "6199026e40974698c629b8c61043f08375a473176a3832b2f7a63350e8c8f3b0",
    "sim/campaign_promotion_proof_codec.gd.uid": "876f1b04bb9c9482cc61f0a10bd84a6d99be2f97ee048e131b37cc7541ff4d23",
    "sim/campaign_promotion_receipt_codec.gd": "99d32a6bb60a40eebb41fda254498f65f578630a75fc89976cb823dd6535b4d2",
    "sim/campaign_promotion_receipt_codec.gd.uid": "a83f6199d1e6797e153c355718675ff537150d7eb704738349046612705adeda",
    "sim/campaign_promotion_snapshot_codec.gd": "82ca6fbaad176cd39af551185902200aacd8ac9a45d1ebde0586ddc101628784",
    "sim/campaign_promotion_snapshot_codec.gd.uid": "96e07a4ceeb62fb22151ebdb359fe4a584c41bef2403543d65c16a92ef0fb257",
    "sim/campaign_resolution.gd": "5a4d5c3731a117fc5c9a4b2d7cb38f3b2f04dab772011ccfb516cb94aff37d3b",
    "sim/campaign_resolution.gd.uid": "48b32141fb8fcc02408e22d3c429957b651f34d8cbd5e948966a4962954a1b42",
    "sim/campaign_resolution_fields.gd": "a1b08d42af91b22b5c0e0eb1751e414230c1ea4ce92953d267aa1b8d0c79d952",
    "sim/campaign_resolution_fields.gd.uid": "455341e54f17e564a5de4ddacefb378fcb50887f32589edc01b3866bc5a70bed",
    "sim/campaign_runtime_authority.gd": "f8d999f282f486805e5fa97923409b357e5f660016af2936f1adddb50163b5c1",
    "sim/campaign_runtime_authority.gd.uid": "75e9876de55cb9fdc7fbcb0b3c26dba1d63283b243aa718f77b389cb3900b2e9",
    "sim/campaign_runtime_context.gd": "f566b51ff2d8a0ffcc258e147df762a8b84f7fb21ef3c08cc9e1fd97273dfbd0",
    "sim/campaign_runtime_context.gd.uid": "6f635dc8a04847aee06c00bb44a40d9da2a644d7f9f5b246896aefa8f427ea80",
    "sim/campaign_save_store.gd": "fc4b919b170116fee9b969ada1a9ce95b617b3c9db622aa0c8076c60457462a1",
    "sim/campaign_save_store.gd.uid": "522e046c0dc2f3adcd8a0ffaa7551c94893e67c667611eeb4f1adaf74baff10b",
    "sim/campaign_save_upgrade.gd": "d7b491f00d923aee3265f45783f302e52b56f975d695dd377cd0262eb265245b",
    "sim/campaign_save_upgrade.gd.uid": "a5102e3a0715b8cbd31bb1d17eee7983aee1500c9f5a4f6601fafc2723eca42f",
    "sim/campaign_state.gd": "5796dfb6e5976ccfaff5a6f6abd7aefd7f76c2b4d3686669e1393f7b0ea2c6ac",
    "sim/campaign_state.gd.uid": "e8c915b31a5ee79f028c236522dfb7afce16c09eacf775a222e72b1d9163a4a3",
    "sim/campaign_state_v3.gd": "b75b3f8258e2e9e40f10b91e4d2d674777ecba8e8435a74fd21c7543bfb84063",
    "sim/campaign_state_v3.gd.uid": "0b63922b0eac02affafee85bc3db73c672e73c63d1af83129da0cebb745be63d",
    "sim/campaign_strategic_commands.gd": "2668c228087c1e0673f6f95ab1481c3af60bca10e9f7669c447db54fb998025e",
    "sim/campaign_strategic_commands.gd.uid": "be92e43a8bbb4f1c10493f711c00bbf3768f3141f6c2b9688ee9f7faaed190d3",
    "sim/campaign_training_projection.gd": "2bdaf048926e9d181b68743d2a66ed5aa3aa069576ae4e63b23635b01a36b50f",
    "sim/campaign_training_projection.gd.uid": "465c6786e40fa276c5619e50b0fe1920ce93d667de667ffc4bbb730b04192fc8",
    "sim/campaign_v3_attempts.gd": "5ee73d34a8d66b3ec54a4e74244ed3816fa55849baa3cf6e9f5ed0f38efdd984",
    "sim/campaign_v3_attempts.gd.uid": "0bda8465eeaeb85a63b4977121b6c64b4cfdda0d05bfa61b86f921e8c282bf78",
    "sim/campaign_v3_codec.gd": "39bc49c9886d69642157cfd403fe25b8f97423e3a4c53804d654c354d64ebb0b",
    "sim/campaign_v3_codec.gd.uid": "8f2845b71dcdeb09cff0ff468d7b7e2bc91d3d7dc059fded7bb7bce2baefb974",
    "sim/campaign_v3_command_codec.gd": "2a6fe4a1121b43cf46c500120f3504cef0a0cbef8b0491d26f8f55b43527e6eb",
    "sim/campaign_v3_command_codec.gd.uid": "f0862631895bed9d0e88bc99ac7b5cc58e3211205a667a622bcddc8bc55aaf61",
    "sim/campaign_v3_command_history.gd": "5ec65075fc0a9ceab8aac1f1edf9c671aac5a292e3e911c7032d92393b097840",
    "sim/campaign_v3_command_history.gd.uid": "650c6ec26a92c7eb2ad190736e7fd42f6e62133ef5dc574eaf596ee17563cb0d",
    "sim/campaign_v3_commands.gd": "ae3de999b249219e22cdf18a025c93b5112d3d63f45954a38c32af82d314b693",
    "sim/campaign_v3_commands.gd.uid": "44153873f631f638e675baabe5dc99fabb0986375f85cd93aa6e6ec4ced70c9d",
    "sim/campaign_v3_economy.gd": "c544e002821ff1409f51350c643e9792e579f2a5a86677f69df19ddaf453252a",
    "sim/campaign_v3_economy.gd.uid": "6bc6475d0ffc53d6a986874d4727364639a78c5855b3e008add5607bb40b83b0",
    "sim/campaign_v3_hash.gd": "7a0e7f3070dc51db799cef60140170d3537ddbb4f34971a76c505612e86e5eaf",
    "sim/campaign_v3_hash.gd.uid": "3f2e411fe88b76cb46af53d7780e8ffb1bc2c709eaaf82a94cde62ad02ad00cb",
    "sim/campaign_v3_history.gd": "41f3b75f2574af0cfda5e4aba3d378008d7740d04360a2c2151ae97abce3800e",
    "sim/campaign_v3_history.gd.uid": "bbfabb88e403f0cb518595ffde6dcf344d7a8e2e4bf67958cd89715913cef994",
    "sim/campaign_v3_promotion_rules.gd": "321cf6b638554918e03334834d67981d2417a42f39d2583cd3c8d4fee9b1de26",
    "sim/campaign_v3_promotion_rules.gd.uid": "66df53bb03bad1cf900a0310101182887fe4faadf47f2aea4f69a1141accd642",
    "sim/campaign_v3_recruitment.gd": "142c5ca6b4950ef4b24333d312a7888ecdd3e88f00aa1827e830362cbdbc2eba",
    "sim/campaign_v3_recruitment.gd.uid": "9bc4e60c0a1e56d63b3df0beb6b5e517579be6545db7bfa6460323e868e77ffc",
    "sim/campaign_v3_renaming.gd": "47f601dc37a7c68f701eaf442477f1b863a0aba2b0f0be66930245edbc48d638",
    "sim/campaign_v3_renaming.gd.uid": "4ce8e7c13a037319bdfa79b3ccc01f3a67bb929e540cc09e30455ebaf763c06b",
    "sim/campaign_v3_state_codec.gd": "55171e10ff152c0080e43e4d46aec6e7bcda6efcfcfe2e917dc61dcb228636fb",
    "sim/campaign_v3_state_codec.gd.uid": "1d6f8af3bbdbaf176a8164558fa7d428f887b07b88d88e3aa04992a2554dbc03",
    "sim/canonical_json.gd": "72e187b6b0f832e288420d893fbe586fcc8c144934697d1b7370c1e4022621d3",
    "sim/canonical_json.gd.uid": "4cc942e1159341ceeb49b316865bc41c918b06acab86d00e0f84d8fe64d6931b",
    "sim/combat_content_binding.gd": "d688a8288237c0d04b6113d43ee324c3bdf36f82f9d9696e6f893fd99c57e186",
    "sim/combat_content_binding.gd.uid": "1f8e43065807757e1cea1d8ee8256440eedba98062dc7c15b3cfa3485e66bcb8",
    "sim/damage_rules.gd": "bd4c0c083539b0e3899134eb709da3a43a6bfbc839b95b84fadb4e4ddcd9a3a7",
    "sim/damage_rules.gd.uid": "85e4c3935ab8df4176217aa066ed4e4565c995011a9a8c2c8f2666c7bd859a5a",
    "sim/enemy_damage.gd": "30deb94d00218c6cafa9e95daf6a0c1d6fbb66b179073eb67138fc55a32dbe10",
    "sim/enemy_damage.gd.uid": "127d821b707ca3740c0d5234415ad0b068b73ee843b03d2e8e020a39b83edf48",
    "sim/enemy_state.gd": "212afed2064efc7c189481647f2e3274d355f74c42bbf53582308bdc402eda93",
    "sim/enemy_state.gd.uid": "a0c20d8a9d1dfcf50fdbd82be444cb152afab725861a7ca973db3066161c9e6f",
    "sim/fablewood_battle.gd": "158fa88e85d5c2457b667e16f25d6592338a9eb7ff575eb09d07fd6a1b4615f9",
    "sim/fablewood_battle.gd.uid": "b26947d7ff6886af47619c4038a27a4c2a4a025a11549e5952e3a83a7900bab5",
    "sim/fablewood_late_enemies.gd": "471a3887c14c495e2efc835f3c2c8209ef5f8b0f38807ac0d2283d646dfb6aa1",
    "sim/fablewood_late_enemies.gd.uid": "92717f1b4d0d7852979ae565bdf1ed46fe5c516086318515c1abe77da71dc6cb",
    "sim/fablewood_ultimates.gd": "b6c2a00d99a40fd8bd13f847642b3736797c9693d57b8602024cee857b597892",
    "sim/fablewood_ultimates.gd.uid": "874f8da5c775ffd34ce647050787114607e3edafaf1a4445615d71fce76c149d",
    "sim/fablewood_weaknesses.gd": "e06219d0aa84749fb70732b2f3cf6b29564f184763c9b8c4f8bcd4c29003e091",
    "sim/fablewood_weaknesses.gd.uid": "694ffb8e13a6e40d51b7a8c5b93493b73b21790f0e82a8809f17536e6156279b",
    "sim/healing_rules.gd": "32aa5cdeb606f1f95f03d260e19f4476870ac6d639428fffb426ff28431d2c47",
    "sim/healing_rules.gd.uid": "55a16064c9d8b74cb84dd75975e48ceb59ed5979a3b0948fe5643af16cf1e8f5",
    "sim/hero_identity.gd": "db41512fe0f1492094af14b82c0c1d455fae5930149322b0b0a33ccc4889c7d3",
    "sim/hero_identity.gd.uid": "daa6ce9cdc17bd19054991c14632227853b9e66a36c3735ea4343be4f48ec846",
    "sim/hero_names.gd": "4c5c64bba974ac8167fe99f61a7ecd86bfa9d355c2ddbd71b56f6c16ad99d54f",
    "sim/hero_names.gd.uid": "81db21a56e7aee1e18145da3b72fe6ac2cf14ff079744a7308a2f1f361f7075e",
    "sim/hero_state.gd": "9b5c1e508b2e322bb654d497f92bfe0cc716f8d1bf0809eb1ab984504bc23408",
    "sim/hero_state.gd.uid": "a824212eee94328dfd9d204bfb58b005e60861393d9bbd580f68d9dfba4539fd",
    "sim/pathing.gd": "7e3b361686e4bc50dd84d78d191f9f395767aeb0e7e269b2c8e7305ceaea5e19",
    "sim/pathing.gd.uid": "f346211838341ddd91bc6eda8d9b6079551d3b14000773f38f4a9182504ddaff",
    "sim/roster_state.gd": "5a09167bf9c119fe459b00d3d5b67d585abb5aab292bf8d96e0469ba1600e490",
    "sim/roster_state.gd.uid": "28a83c25306ed7a336567bde0cb5628629132ec85c035672a3ce1975233efa40",
    "sim/star_calc.gd": "bbbffa079ab3fd5c273f159cde5ac468e5846003af6747f61bc6f4b6ab135623",
    "sim/star_calc.gd.uid": "cdb1575dc069d78129b05c93f9fb449afa2cb694501894be17e5555e998b6046",
    "sim/target_decision_projection.gd": "7472d241c4b41bab20664d33b060fe28f71ab398af7fa9f61121d42b8dfdda6a",
    "sim/target_decision_projection.gd.uid": "ce7fd21c114a1b979890549fafc5f5b558c16bd7878a2a0b4584e095a1847409",
    "sim/targeting.gd": "aa6ec8c98946906583af0f14db596ccd3d44876ed05195247d9ec65d771580fa",
    "sim/targeting.gd.uid": "7710cbbc9a22f8eca3e3c6b61173836917d711f33a8f7e5606d03b9459d8fdac",
    "sim/trap_state.gd": "28327b63e31359596f6e050aa7fd8456c1024d581f73a1c14231d89ca64b9790",
    "sim/trap_state.gd.uid": "7ad186b3f69a305309be82781c07bda1a83909c7d4a7ece877bbfb9cfc4aa7d7",
    "sim/unit_state.gd": "b373caacbd8464a2a7a43806bbc10a364c7ba0362d03bd996ece90e5397b4777",
    "sim/unit_state.gd.uid": "ca3cd5006bcebc8856cdaa082281b3621965a797f2c209637bf97b8d0b987105",
    "sim/wave_timeline.gd": "5a5b4cfde2f6fc8d833e99edf5ec9238f346da74d987d1b8e3f5e63884cba2f0",
    "sim/wave_timeline.gd.uid": "973ae83a439725b84b23dc10c8bfabf4f6479edb9e010d498a0e6106120ae35c",
    "template-provenance.json": "4018e9885d06e0844e45d36ac56bc90c42cef4003630f0acc18d9c131d3adbb0",
    "template.json": "464745eb606ed5f88389da94f1aefad373643feb6eaab29e150dcef4e9188671",
    "test/advanced_operator_live_quality_harness.gd": "15c1636bd33364768c38c5396acc3e287ce3cc13918700d9330eb2f518346200",
    "test/advanced_operator_live_quality_harness.gd.uid": "c6a36ddb2d6f893d6f45d117614ffd01c312119a52fe2d889f319de1ab00c36e",
    "test/advanced_operator_visual_harness.gd": "a3006cf7d6acf37b66da5c9ca384e5e588dedbbbc62f4981c9b147e5f875ea32",
    "test/advanced_operator_visual_harness.gd.uid": "e847ce11d8062203178adbcb71ac0019c7286c9a85f183147cf0e2e89fc5d0ef",
    "test/agent4_isometric_renderer_smoke.gd": "7110770f2093ecb8497330cda30397800f80e67d6f07d8a6bc7245c0589b3c71",
    "test/agent4_isometric_renderer_smoke.gd.uid": "368274a913bdd374f7b5da62c0431835003d572b8bf5230c259e5688dc92dc88",
    "test/agent4_isometric_visual_harness.gd": "90abc926739ec2ce877118fe9611dfbfb3bc40f764f592fabd5b67eb84c46f57",
    "test/agent4_isometric_visual_harness.gd.uid": "ea1ab9f8ff7aae31b8e7c10b0b6d85f56464e3818246903f5b317dc2e4963cbf",
    "test/agent4_isometric_visual_harness.tscn": "f41fd989a2e0ef6e7b6e595dfa527364fae63c7bd9cf0f3af12620e724b6df22",
    "test/battle_annotation_visual_harness.gd": "d93abe77d423435ac730824f06f68d6fe47fa19712700e6207f4bbb3c2272963",
    "test/battle_annotation_visual_harness.gd.uid": "583e8333878679856ebbb638fd04f2fb07eae7aab2d06f72a236032fefc8f0e6",
    "test/battle_annotation_visual_harness.tscn": "828f36422b0a7cb66dcfc8282cd8bfd0f7057baf09aa8f2d2d7b088e1cfdec9e",
    "test/enemy_roster_visual_harness.tscn": "fa43cfcf47cbfaf9c6d19953e2331fed069957f4785cb3767de282cafca87ea0",
    "test/fablewood_alignment_capture.gd": "10dc581f2349ce4f7d13dbca6cef1db950eb0f9985ee09322ab8ab3b0ebc1494",
    "test/fablewood_alignment_capture.gd.uid": "f36e1ff7b47c5ba49a786b39a300453a7bea16d9c01b5be4950c64bd566c62da",
    "test/fablewood_alignment_capture.tscn": "8969f4f6be69fae84462973e79b993eb2e37cdce3afb9e905041b5dbc460bee1",
    "test/fablewood_animated_capture.gd": "ccdc3cddc42d8ba0f4a6e46855e24f81d2f0fc4c069d041b6337ec02f39fed1d",
    "test/fablewood_animated_capture.gd.uid": "b3c6f88627ede4fc9b93722c0cc7d4f002c327f2bd229d6a8d307a7813faff24",
    "test/fablewood_animated_capture.tscn": "57b8e9850baf11ce293632549b8873ed75ae48fcd9f9eafc17a26fc800c66830",
    "test/fablewood_audio_filter_contract.gd": "22f8a63a0f8b242b511545feb795b395e5e9983656977e3a264c4f805052fb26",
    "test/fablewood_audio_filter_contract.gd.uid": "57a6072bd71a9bff159cd3f2db876301d61ec09f0d8042d4874fcf510ddf36b9",
    "test/fablewood_audio_refresh.gd": "b5d769598563aaf6f5d7d3481815ff1a3f42b9ebe21527a75e3d766d63af83ce",
    "test/fablewood_audio_refresh.gd.uid": "3b5a2c9ada4f125186e3ecc3788bb203f8522e38ccc2082beca63eab14d33192",
    "test/fablewood_audio_refresh.tscn": "d944bfa7922d80f524d1b48547806ec0ddffa5a68c13b2d964e8505714e8af31",
    "test/fablewood_auto_wave.gd": "6361ce5f9d0862071a0ce7c6bd13bdb8ea223bced925d13e3650d75da78c89b5",
    "test/fablewood_auto_wave.gd.uid": "af465218a067b9e616534f0ef08138dfa1d9f150d5fb6e84444d7d17decb84c4",
    "test/fablewood_auto_wave.tscn": "25502a633d3e643f8d1059e411d80bcb1b3ae3517e574f99026984a8645a22e7",
    "test/fablewood_browser_music_marker_test.gd": "006445ae141e158279b31820862e88f5a35e121e2c4b419473ee0aa7cb8cad9e",
    "test/fablewood_browser_music_marker_test.gd.uid": "5cde636da824d0e08c67bf66bd22d53cecd17955b34edb5cf31bce84e8b6a9d1",
    "test/fablewood_build_placement_test.gd": "42382cd9df2ab18d83bbf40a8e4d6619084dc237c7a269b95376bd3ea5c4d219",
    "test/fablewood_build_placement_test.gd.uid": "d8152cceb9cf5253c9be535d58044a72b151ce9895c6d73437c3da6a83bbc01f",
    "test/fablewood_build_placement_test.tscn": "5a1aedde55e2e101033fc2771204d8bd9b2816f1ebedfb919470c42b51321d72",
    "test/fablewood_callout_capture.gd": "0c9a613047f0172afc1eb30501e4454a4a193d6a3cbacb1f0b8f184dfaf90d6a",
    "test/fablewood_callout_capture.gd.uid": "dd62d31361d4e6db1a353c439aabe729d5835d56c69df517ccf657d5b4e5c2b5",
    "test/fablewood_callout_capture.tscn": "ca627737ae4c04e2bedefc490b314c5e1e40cd6125ab630e4550c1efe1d6b912",
    "test/fablewood_callout_input.gd": "41431a7ae5ae09a7c5d5aed8a57afc73c4ba9a38d78e59395deac099a8fae6fe",
    "test/fablewood_callout_input.gd.uid": "370a0802d1d74a9ea3c92f40c3c9da041fca67b7047282c5dfdbdebac6da0e7b",
    "test/fablewood_callout_input.tscn": "2e6b204fa5fcff66339c70c4b9a94e91ad3b2a238b9319494d340455c7ff83af",
    "test/fablewood_capture.gd": "5e893ffdfabcfe1c8afbac6371cbc945fa81647ecabca2c1243dc089831e2067",
    "test/fablewood_capture.gd.uid": "b390ab531be0c096c3a1f54c627015598b73dc27f77f5aab0349f438510db9e2",
    "test/fablewood_capture.tscn": "9cd67dbef78b33e6bdfbedbd28290c66360f7637135b2903dd1e37e0d5533530",
    "test/fablewood_chapter3_regression.gd": "bcc3e2c3ecc3045446be4c881ea4c2f62ea8c01c386679b8aa76b4e244da6183",
    "test/fablewood_chapter3_regression.gd.uid": "2f9fc4c8ea43a5309042da8bcc82498bf510546ad28f69271c2a000209f42fb6",
    "test/fablewood_checks.gd": "1b70af93c484226f66718da3c40f1370a42400f927ac5ba8382e8e7204b62d88",
    "test/fablewood_checks.gd.uid": "02e37e3c2d9eb2321f481369bbfdfda76267c0882755b04d8b5b1f85503f6ad8",
    "test/fablewood_context.gd": "154e3892ef1b411035924a156c4c167a7377888d2ed83263bd48ed3aa2cb8baa",
    "test/fablewood_context.gd.uid": "cb47e7e56ee992ab8df856b49b4255997a5008467412ace46aead8c52dab465b",
    "test/fablewood_dragon_interpolation.gd": "b44bcbcbd0224b3c1ac390aaf38a72e2c58fdee86cd44f711d8552fb2aac1af7",
    "test/fablewood_dragon_interpolation.gd.uid": "23a7b8963cb921d73a5236de6c170ad5fbd89ea668018f5c8477479c3df5415f",
    "test/fablewood_dragon_interpolation.tscn": "1d8d8a597d688109b08905e504a57ad3b9e8ebc650a2359bd0448ac5f98f805d",
    "test/fablewood_elemental_audio.gd": "3a14ec95923cd6d1d538b955de36e6df842030e813fe5cefdc0298ec5c5649d3",
    "test/fablewood_elemental_audio.gd.uid": "431a9ea60d13d6e7ec970ccd7e1bfeb8990c3f2d3aa5fbb1c86e2f0b8cbfbce6",
    "test/fablewood_elemental_audio.tscn": "ca72249bec8b9f09032b38964aed25a00940ca620074af18f1090b38ec6accd4",
    "test/fablewood_endpoint_capture.gd": "dda8b78e18227e4fa8d590794c15522e1877404644ae9cc8b6e8b56b6ae828b5",
    "test/fablewood_endpoint_capture.gd.uid": "855ea80298bfd9c5af735efb37acf3e9c186c4c383a1f8f426d95cce6922cfda",
    "test/fablewood_endpoint_capture.tscn": "8673fedc22a0969f3f98df34514ca3b8312d830ad14f5123a0aa91fea98655dc",
    "test/fablewood_endpoint_test.gd": "c294b0efdc39b756e2449939c47203f561b98f65f2caaedff1faeec6b4831078",
    "test/fablewood_endpoint_test.gd.uid": "5f2c7b2a55acdf87144aec7972de3e03ce41d7b92196018605013e9296a1bdc4",
    "test/fablewood_enemy_animated_capture.gd": "fa0b248553d8a48aada101938a3ce1e6dfbad3d2775d56bf3e4fbefd8b516d5e",
    "test/fablewood_enemy_animated_capture.gd.uid": "3252c25ca685fe4960d1d4f851c4ecdea28b99b3b7184bb8d199685bdf200575",
    "test/fablewood_enemy_animated_capture.tscn": "5c15b2df9a7b2e648af57483df200983a32a7e1591c876d570e96d3556068be1",
    "test/fablewood_enemy_animation_test.gd": "aa6aafccc3e66ba5afb0e9c0af1ab04f8b335caefde4bf408617f13c558d53e0",
    "test/fablewood_enemy_animation_test.gd.uid": "3afc887978836a08bef2dc2ba3347398fc99c77262a996930d31a3a568365f5a",
    "test/fablewood_enter_wave.gd": "2df49b64a3540057d25dac6488fc2a51a294981878f212436ab11eece3837382",
    "test/fablewood_enter_wave.gd.uid": "c1efc9c0d960098432f2c205a6853d2345a691c019d8b84c5fffa1967de2fbfb",
    "test/fablewood_enter_wave.tscn": "7bafb4f8bc49ea180ae8fb820c4f7845ada691218e53f3e40685fc31b0d2bccf",
    "test/fablewood_epic_music.gd": "ea17a75e3e899af81b1bb9db2ad74f58505a761c2445037374e7784e91664833",
    "test/fablewood_epic_music.gd.uid": "66826e9738f3b6d1339a7b121a3bd0a5f4533aab31491d0a13553ca1d52998fe",
    "test/fablewood_epic_music.tscn": "2e2ad9b605d533c630138a8b8fb297066c1b7b2f7e92fd2e64fdffe1d068e120",
    "test/fablewood_facing.gd": "327fd7758b20789da351fdc42966e63917f75fb21cc8c85463a9a38ccae9d3e9",
    "test/fablewood_facing.gd.uid": "9741124eea624a5f1f306a11bff7e0fc6fd2fe8a435f1cb3cf97fcfcd1386475",
    "test/fablewood_facing.tscn": "b36f8cc48725b6a1ceb644ccea4957961182ea72b3e0718688dd1fb044b85bcd",
    "test/fablewood_hard_mode_ui_test.gd": "157f16f51f173cc6809dd9b479869323e792598037c41057251454beead22de7",
    "test/fablewood_hard_mode_ui_test.gd.uid": "9278e017ee1c5e15a9bbaca238dac25f118643eae3b1ca5c03173aeca5035d6f",
    "test/fablewood_hard_mode_ui_test.tscn": "c98411b061bade05046d0e1ca325cca6127c49db66891b5e7dcab76ed791f336",
    "test/fablewood_late_balance.gd": "c3578e5c9a78256a6350628ae720a38fc0368b6bfab4648bc3c17822b0f9c037",
    "test/fablewood_late_balance.gd.uid": "6b17666bd2dc81bc7c31e83bbd8d93da078d66ce65f8185054387874dbf77c5f",
    "test/fablewood_late_enemies_capture.gd": "b16d00102954ea5a4e0fbe6931b6a299337037aaacd32e24cb1b701009a52df1",
    "test/fablewood_late_enemies_capture.gd.uid": "37ec9d67b8e2c045c055ba02b2d210df7282789f36d3fb8fe750456eb03b3c2b",
    "test/fablewood_late_enemies_capture.tscn": "f7ea2ae11b26c6c5488588a5b536f6ec9aed69eea50f596dea4b2c29461d9fce",
    "test/fablewood_late_enemies_test.gd": "831a945d69a80d17ca678c3b9d29a9e524222c256ef43ce4f1dafd3ad84462da",
    "test/fablewood_late_enemies_test.gd.uid": "c847cf81d05fc02c12fc41c50a13292bc1f040ceed36a450f37455e8a40d095e",
    "test/fablewood_late_loops.gd": "e8c024722ee869a0171fa4585a8708ad399d611ae070d752e7c7ad487f773ae5",
    "test/fablewood_late_loops.gd.uid": "809877585b15bb9a3b59bc2d9e8cec368a3cb8dfdf24669e1a90f2f9ede4e471",
    "test/fablewood_late_loops.tscn": "4bbf1bfb2bd92ff492bf49484802c98748139e28057775cbcb620db1089c0feb",
    "test/fablewood_late_save_compat.gd": "8cea0d13477f2f2c7213fc8f57b66ab163b88bed5fa8c141e82fc9713da5378c",
    "test/fablewood_late_save_compat.gd.uid": "3908711a1204799e8ea09402bf8fc7ca2f62221a6b510d757f9f5023d361a2bc",
    "test/fablewood_launch_checks.gd": "c5ca654c553b0567d7b6f23aa078a5b6a466d72f07a2c23f10471321a486ba9e",
    "test/fablewood_launch_checks.gd.uid": "8fc2b990c3cfff70d6d273ddb1e65b3a3db83f1a966805812a4751127d182b1a",
    "test/fablewood_launch_contract.gd": "e69241989c16c2d3cb1a6284cccd0ffc445773a38a72f37f65612d3ee316addb",
    "test/fablewood_launch_contract.gd.uid": "af283dea89b5663aad8a73b632ad624d9cd02e594afd401d1262ac3973501829",
    "test/fablewood_licenses_capture.gd": "0dfa837fdad743da14b35ae601e5263112c9363af576c99837ce4bc5f1b5990e",
    "test/fablewood_licenses_capture.gd.uid": "539c9064bdd2b949a39f3817f4f546a3c560981fb1d1302a7fb301cabc5bb034",
    "test/fablewood_licenses_capture.tscn": "f6e8cfda1ec8b1a2e36d8643541c5c10f339ee82e451f1ee9820432404e8dcbf",
    "test/fablewood_merge_capture.gd": "accfea213b1103891d4515ecdb6d9e2a456ff3d38a148fbc310023e829968c8d",
    "test/fablewood_merge_capture.gd.uid": "b44948c5225129f4261f42f8cce2f31bf8aecb6bfd36b529c59d02ea1367ee62",
    "test/fablewood_merge_capture.tscn": "2bfb09a33c49c4b7228228ee6c226b8d073513e78a35133b110b0fa16f7715e4",
    "test/fablewood_merge_celebration_test.gd": "b139237809dcdf733f47e8f4382c6572a7f6f084c019d7f74ff27d171f285629",
    "test/fablewood_merge_celebration_test.gd.uid": "ec0d342af593749cb6be1692950a13362c1eda78c179b4e0861c9f12b0312e36",
    "test/fablewood_merge_extra.gd": "f0b1bceb34eb7765cabb8a23a681707cd0e1f1b7dd4ac612f650d22fac43436f",
    "test/fablewood_merge_extra.gd.uid": "0b34250a6d1b677d0252725a40029eb1e98e84bfe2fbfd5953a5eb0069021267",
    "test/fablewood_merge_extra.tscn": "0f89f457cd7efbbd45a78b7a0a5aa53f1dcadade31d1aae98dc49a978a50def0",
    "test/fablewood_merge_sound.gd": "418df59deeab0c8c265550bed29198323b32db33a3d284f3c14b5b99d93a1576",
    "test/fablewood_merge_sound.gd.uid": "8f3a906ef090690e329b99fe68c524671c12f8c3e40cc8ada97fbd8866b68a76",
    "test/fablewood_merge_sound.tscn": "28dd6e8cc1be8455242d51384b00ff724d113ee46b48c7dafdebfe188c366abf",
    "test/fablewood_merge_test.gd": "314b49439d6b4b041c839e91351e22c1a59459c4f67fec4852ecc2912590ddff",
    "test/fablewood_merge_test.gd.uid": "65fe69641e0e7eb439c341cc82aafa420f18f0acb9512f952cf9457f5c676b97",
    "test/fablewood_merged_animation_capture.gd": "48494948c63b9ea9ffe6833d3b0c5f19348b2da78f11043be332eafdabd5040d",
    "test/fablewood_merged_animation_capture.gd.uid": "dab4fdcb2a956e4e353b999d21f27f56824c0b324d0b9483880b4f979fc4e62f",
    "test/fablewood_merged_animation_capture.tscn": "01a30727d158795fa081131f26dfd7abd0a84fe94dc8cd7103ab809a543c370f",
    "test/fablewood_merged_resolution_capture.gd": "ba5de359ad6d4d63113b9c328da84b53b845290a4a437909cfed50ac745f923f",
    "test/fablewood_merged_resolution_capture.gd.uid": "cc4d5c2566c4f19e31e17508deae0c2a973c73196595a6ce3327bd4336023031",
    "test/fablewood_merged_resolution_capture.tscn": "0cf2bc7dc9568a01b4fa8ae29854147901e77478d83178cebe3c114c8f776e75",
    "test/fablewood_music_impact_capture.gd": "d89683a09d050d0671055b491078a6bdbb6a918a5c1b8eb275c3923b215cb1aa",
    "test/fablewood_music_impact_capture.gd.uid": "e8365f1acfe55e4e832c8ae9130d671495970f9b64defea2e7564f1f56b23beb",
    "test/fablewood_music_impact_capture.tscn": "4ae35a7b376d51f8a4a9dc784ee088576575f995300c968051663bc839dac0b8",
    "test/fablewood_music_marker_test.gd": "596e3e2ec51b1627e79c78325a4d0905f6c7c173e2ed20e8849539983487c930",
    "test/fablewood_music_marker_test.gd.uid": "0b805f316f315d9adcb8ab66c7336e9b2404dbcaee5c4ade08a53fc9e21a1fbc",
    "test/fablewood_nerf_animation_test.gd": "d38280c7a9f765fc2abdb1a1941ad2bd5d349a1d183972e6dcb96bf164756281",
    "test/fablewood_nerf_animation_test.gd.uid": "c3ad38184a008cd110c2fd0d1bca65f57650ae6d23b72fada41f5b9265d1b77a",
    "test/fablewood_particles_capture.gd": "cb78eb1c830a8de3fef376e55e71ffe61344faaef86f8953918ac74adeb786d6",
    "test/fablewood_particles_capture.gd.uid": "c8be42100554ee128b8be22f77255cd9b4f4e4d34d3b7dccd755578ad183f840",
    "test/fablewood_particles_capture.tscn": "df0d3037a54e411492f838de4b431a4cdedb32882cf8738bc5251f0ce97deab9",
    "test/fablewood_particles_test.gd": "bd74a0bd3638be18b6caa10c0022294854cfe1e1b52248dc3849481aa80fd212",
    "test/fablewood_particles_test.gd.uid": "8f76741e80c97448ea2f32d4bb2a34048a2b08390b7cab2d2900ff721dd2d7b4",
    "test/fablewood_platform_capture.gd": "847ac0928cbbddfd6bb3733d16b22cd45bb069ba623e203f4236bca45d6072a0",
    "test/fablewood_platform_capture.gd.uid": "d135840c7b8b15b705ceaaf94ae69c4c065cff9c71f8b803803ee202208730b9",
    "test/fablewood_platform_capture.tscn": "9ba1ec866f45856608abfc8321b2bd7bd47b9128e32b1134df533fa5bcd30dc9",
    "test/fablewood_pressure_hud.gd": "6a3344d46c5e449244dfa4e9685651ac28045694e831694dfe13fffd90239a5f",
    "test/fablewood_pressure_hud.gd.uid": "faa39eef9c62648b141752daa56dd8995cfb6df34154d32dc7e217eda3924214",
    "test/fablewood_pressure_hud.tscn": "c22ba0f479ddecf7e59a02f9e927435064e4ff4f4fad2537f7ca281c63b842d0",
    "test/fablewood_pressure_live.gd": "0191f5df89c55ccf71407ee8fe74af22a71889e282f7db3cdbd5adc4e2bff53d",
    "test/fablewood_pressure_live.gd.uid": "0f6e1a720a0b73ca937fca4cddf2d7160277741e8ae40de5bfcf94d59559f00c",
    "test/fablewood_pressure_strategy.gd": "8929f23423537805bf54e4a8033c889e307e90b5fadf3e80e5e8a9c2295c7f75",
    "test/fablewood_pressure_strategy.gd.uid": "e4930935bfb8c6b3c3cecbc779a360ad7b3e2cee3c10dbbc2fb4ae48a061a17c",
    "test/fablewood_pressure_upgrades.gd": "fbc1bae2121d07fbb14b61e6673aba1c7567f0b744a3fb47135d8079e9140ded",
    "test/fablewood_pressure_upgrades.gd.uid": "95f6b4f1898300d3c60e34dd1f4aee3ec5e8f2dc6a4e5f3a23efb178d99de62f",
    "test/fablewood_rating_glyphs_test.gd": "082316261593eace4a6895fcc651ff11c8bf4278b55cd18c9798a150b5fcca22",
    "test/fablewood_rating_glyphs_test.gd.uid": "a51eb12ff4a5cd021bc6e6abd96fce606aad34800e7de637ed34f62008e203cb",
    "test/fablewood_rating_glyphs_test.tscn": "e4801f3a8ae9980fdd72545a81060c1618e921b1304c7f1f66b2d65a35b276c0",
    "test/fablewood_ready_controls.gd": "eee1d8f30b30b9ab5e7074f546c96b46a463e5d8e317a4f2d2d4e2b9fe4a6096",
    "test/fablewood_ready_controls.gd.uid": "54be7e7a3700fcafc1a744eb5310b7572c9e059bd8d15c96d7724593673cf23a",
    "test/fablewood_ready_controls.tscn": "c31883628cf2a824cebf80be31cddadd50649eca81ac542622bf9695ec9b6f47",
    "test/fablewood_result_contract.gd": "e3b85e8f29099eda7229ccd0f4376350812f5114b509822d0073ce13134c0d55",
    "test/fablewood_result_contract.gd.uid": "c83d9cad51a97ce4840d57e7405b342719134568df170146d0b786201efaa3cd",
    "test/fablewood_source_contract_suite.gd": "1246f2618839e5e93cb61d2a835cc52f7472f7b820cd813047e3fc810111cfb0",
    "test/fablewood_source_contract_suite.gd.uid": "c4ca39ad6f2cbbd18fe5ce2c0b0710edf726124b5fa3b5a86c8847e9e02dd10f",
    "test/fablewood_speed_controls.gd": "335008c1919b7898b907fd2ba69d72b1c90286ce75b819c3c145115f1378b732",
    "test/fablewood_speed_controls.gd.uid": "73c926e9d54090f144d2d14e5e87c68593ce8a7ff159bfbad5613a7de4f128ed",
    "test/fablewood_speed_controls.tscn": "60d03011288d7f1599657746aff7456d45ba90a0c418e61ce7d44b0bdc3c89b0",
    "test/fablewood_suite_runner.gd": "af33fc3eead7d3c15176c2450c43900f140bba84c91d47bfb9376a0351f7fad3",
    "test/fablewood_suite_runner.gd.uid": "97662f88ecc33bfe0b9617ea6fa9db4f631ec66bb63d46cf729f6606f5a2e3b9",
    "test/fablewood_terrain_capture.gd": "536fe4439dd02a7842ad81eab987ceca96085d97afb469e738fac1377dd5f3f3",
    "test/fablewood_terrain_capture.gd.uid": "c79b68d9d9671930349e2b26065d890d588972e539653797b26cd795827c3d96",
    "test/fablewood_terrain_capture.tscn": "7604d5ef825701199f35137d6a4c6d9ff1ec7102c5a08ca3b1ac13e4883291a0",
    "test/fablewood_terrain_diagnostic.gd": "4105c77caaf4a51b58ad95d7f9c192b88b01b050d9a5b41f62744b2d6da31161",
    "test/fablewood_terrain_diagnostic.gd.uid": "8f8a97992f1871dd4e8357ff59747b0697136bd6dbc2924cd923da8e9d92c7ed",
    "test/fablewood_terrain_diagnostic.tscn": "dd4b40f8f9d43167896c515ff89b71733a927103960b7296c516cc3fb7f4cb43",
    "test/fablewood_test_run_guard_contract.gd": "d4612296d7459962cdd67a20bdef16efa2f13721db29cae0ec5e0f340805df71",
    "test/fablewood_test_run_guard_contract.gd.uid": "fb0d2aa7823fc5bef6c2f2fb1db74960c1fb7fe6ce5fb4342a3171e6d39ecc5d",
    "test/fablewood_tuning_contract.gd": "ed07fb48dc951b731c2b17fa50d6f9ae03e17404662ee64715ca4b7bf3a1ccfa",
    "test/fablewood_tuning_contract.gd.uid": "cbd8aea6c62be2fd6b4c4f11fa664be35ff1e6cb9bd6de2f5df13f5c63e261e7",
    "test/fablewood_ui_contract.gd": "ff197064521391de56e26dc40d8f9e90984d5efc215a168153e294c439b18f52",
    "test/fablewood_ui_contract.gd.uid": "8e01bb8cbbe54afb4dcef92734573ae078b76972aee9c24bb32c7476423b3aeb",
    "test/fablewood_ui_contract.tscn": "c7468797928bb0fe62545bfed428db5a315ebebcc94bcec66e14d4f9d2cdef0c",
    "test/fablewood_ultimate_capture.gd": "0621b295c974553b1b1c2f92668f7a8491aaaf2be5a84b75911bc7829f51491a",
    "test/fablewood_ultimate_capture.gd.uid": "51cae7ac56e1958d89dc0dc73d48634588d8f00143cb577cdee44e95029cbae6",
    "test/fablewood_ultimate_capture.tscn": "a7998499bf6abebe36111168158c8b704be7ed41eea70dc7d6078d8799c5b76b",
    "test/fablewood_ultimate_sound.gd": "829128ead14bc346c7837284bcd3bd32cc5b431ee2f867b9b5e5d028b28a4991",
    "test/fablewood_ultimate_sound.gd.uid": "81a3bdfdab8bf1ff51a2354fb9c02c12dbe8affee17a234502d14f81b09c5d6c",
    "test/fablewood_ultimate_sound.tscn": "35f2d350dbfd878b8c9651b5704850bc5fec0d8b6cf94b928f0ecf1852cfa698",
    "test/fablewood_ultimate_test.gd": "2f1990a57ea6ac01b06d9ab5bb36cce785401abf6f98db1305fa0850b22abb98",
    "test/fablewood_ultimate_test.gd.uid": "990a87041585c00be56b2875eff09eb9da3d0d3472c4e178a00905b6abcdac13",
    "test/fablewood_upgrade_availability.gd": "8a2c36a69af52dcde0cd327629c53802863b163b21aece716e88eb1007a25745",
    "test/fablewood_upgrade_availability.gd.uid": "fc1ebb0762ee15d462dd9133317505f934bfaf92c8cf9f3eecaeeacaf3ed764f",
    "test/fablewood_upgrade_availability.tscn": "ecae8197a651ffa2c022ab13a410958419ed986eb12347c6f86d04dd8d3e6cda",
    "test/fablewood_upgrade_feedback.gd": "38f31678fce81f967efea975060eaab2f5c94663ed090caa45723f9fbb35c0f4",
    "test/fablewood_upgrade_feedback.gd.uid": "90e6ffb2f512fb984c39455ce39f437721daae70a6610544d45103f72249e86b",
    "test/fablewood_upgrade_feedback.tscn": "7a7b1918ef198800b2effb4b62a5e66c41c4d147aee6a0e46785a470eeba4bef",
    "test/fablewood_walk_audit_capture.gd": "7028bae149eac2e41b69205565ec1db9cb87e30f3959546299610dc03c3f8e0a",
    "test/fablewood_walk_audit_capture.gd.uid": "ad541f5b70e6b48ed49d64065a0bf7b473f766889021861ba580222c8fdf558e",
    "test/fablewood_walk_audit_capture.tscn": "ad4220c444a0e46c71b01178add6985ccae45738b8c62cf0e543bfab4c1325c6",
    "test/fablewood_walk_interpolation_test.gd": "89c5cbd845fff8b4272c57be94b49f2b8ee012e9a9a26e1dd51bac41e4e4b2e2",
    "test/fablewood_walk_interpolation_test.gd.uid": "6d55ddc5b0c97da6052992cf4c365ced71e05ac31254e92c4195c121206ec623",
    "test/fablewood_world_input_test.gd": "c441ca40dce92edd08f6c23b78ff5e3c91eb77724fda2a955cad606bb6bcd071",
    "test/fablewood_world_input_test.gd.uid": "820f87d0ba8ed31f5fbeafd7220be3c52fba219ecc58e35b80321bdd662940d4",
    "test/fablewood_worldheart_capture.gd": "e5a37a7bfe319e62cf82298faf97d7ec95acb05ca7def5fcd4eb645f98c8b65b",
    "test/fablewood_worldheart_capture.gd.uid": "ac8889d42ea4ce5ec9311af46613a912bec3a6431da9cbe0dab37c5dc94ddb8a",
    "test/fablewood_worldheart_capture.tscn": "e5cd670702fa94e9b1259efb2b8d7f5f5eb03e23fe26ae7b6907a84351bdb1a1",
    "test/fablewood_worldheart_test.gd": "822e29c8696bc21fb7edf8633566295eee7b31b7d12b2020df7db26c497ce103",
    "test/fablewood_worldheart_test.gd.uid": "77a5705a7e66bd5190d8196e3fdad109f3824b3a840edf9c095247aa4b1b82a2",
    "test/fixtures/fablewood_pre_late_campaign.json": "fd988cedcfcf87af1b1cae70562fdec62b29bd6550aaee4bcac7d6c428f4353c",
    "test/illuminated_atlas_contract_test.gd": "b0b2633628cf33a47a9579ab217a51b87ddc3e11d6b1444d25c8a813fd5c5a12",
    "test/illuminated_atlas_contract_test.gd.uid": "149fc3662f5392f1a7286fac90fd6e079a05d183dd33265f2a5ec273ed35453c",
    "test/illuminated_grove_capture.gd": "628d395a04be192c5e8fcc0fa7e71e71ee54c0f0c401c447a06b6b22e28cbd8b",
    "test/illuminated_grove_capture.gd.uid": "79274fa9f1e5ae7a6bc30f0d3df4bf4a2f809efb0917d2d50cc14a953a1d6c1d",
    "test/illuminated_grove_capture.tscn": "992456f25acd62bc7f00cf28d77cf46871e8c6db8068fa352ff2ee6a775e5df7",
    "test/illuminated_grove_tooltip_test.gd": "9ccb8130a7134898ded2b8cc1ef67ed8cdf3eae5a942d58b7119e433920fee0c",
    "test/illuminated_grove_tooltip_test.gd.uid": "1330aaa675406143ac6a49902e522128a4ccf6aa3214d790bac54b2cae068223",
    "test/illuminated_grove_tooltip_test.tscn": "1da8bee158bf9eb3530afae4f29f27f3c54a364f134d896a4202e075f9650397",
    "test/leaderboard_visual_harness.gd": "83a00a875af7dd42c25b1dc7aa8bfb42f88ab4634ce9b9973c80d0cb39e825c1",
    "test/leaderboard_visual_harness.gd.uid": "8d727dd67410d5731896f93367c0bb3be1988da1ef9971d3e386d0d65a036bb5",
    "test/loading_art_visual_harness.gd": "330432ab10e8fc3be78cde6a48d02342262864326cb5cb9b584cecd73045213f",
    "test/loading_art_visual_harness.gd.uid": "c27d2e77b6c9512272d8a542f5b045383f23695c4ff1c50c80f650e5ebb9d5c0",
    "test/map_navigation_overlay_smoke.gd": "87ce47f27d74ec5793691b78e75ec5628ee6b36f5c14c94e396bf15d4afbdb46",
    "test/map_navigation_overlay_smoke.gd.uid": "4eaff591a53f46c813e344689d476869c3038c3bdcd6fdb6ebca828ad84faa8c",
    "test/map_navigator_orientation_smoke.gd": "ed2ad2f9b3c11a0a91e4e9747adf1af275ef8fbed83e1e98cf0f685ca72c5a9c",
    "test/map_navigator_orientation_smoke.gd.uid": "d664ee60a80639142b88852223fd18b6326f86b4b2fa07d04cf95acb621f788a",
    "test/map_zoom_smoke.gd": "6a4ed6a75aae88206f23fde4a8130297b628cba94874fd6189c1121d133eab2e",
    "test/map_zoom_smoke.gd.uid": "1f10e1a07287f14160bcd9291e123f88fdc445a3f1092cdaa3dde8aa7865deac",
    "test/placement_feedback_smoke.gd": "8df92f7f0653c0c96fed13bb4cefd802dca77ac485462b1117206124a28c5838",
    "test/placement_feedback_smoke.gd.uid": "e266a2f3a16936816c63fe097c774d66552addd818bd6cc381f442b314263c59",
    "test/placement_feedback_visual_harness.gd": "f2bf1cc073b3a58c5aba04a74cc7e8620a3d851f64a6f52001fc8fda4dbeab29",
    "test/placement_feedback_visual_harness.gd.uid": "1c69328c7784549cf035729702a7e24e17a0f8b8ddb7fb4d7d720b851dba76f8",
    "test/placement_feedback_visual_harness.tscn": "c917c9f2cc9228182a305503e31a9fb4a8f6cab7bf9107e7794ff312de08be6a",
    "test/stage_orientation_smoke.gd": "0f3af757384efca4ca83598e2b44275bf99958d26437a40cdd78618a7b95570e",
    "test/stage_orientation_smoke.gd.uid": "63d87b7717c1be71027c892fbb60352a295b5ee7efea27187fbdc030efc075b4",
    "test/stage_redesign_smoke.gd": "509b16247f83fea9982d1778f827347105cda2647c268244bee768b3f350ee1d",
    "test/stage_redesign_smoke.gd.uid": "b684bccb5f3c09db538fa0043cd037046e0565ffb94d34cdd613c437cdf16cde",
    "test/support/authoritative_campaign_fixture.gd": "7d9a0c1a483c2dca2d8136b2d122762f219ce468cacadecd6d166361af18f8f3",
    "test/support/authoritative_campaign_fixture.gd.uid": "defb1a36b6373ae34b3d6de9e9880e050d3c56249973d7750630edbda399fcd7",
    "test/title_responsive_visual_harness.gd": "83f15055af37dd1acb64c72318979a0cbfaec507e19513a67408388d0b413fa1",
    "test/title_responsive_visual_harness.gd.uid": "0c38e6e46d1d31952c52f938f259d726c6a325f0c6b348aea1cf156f8b3dd398",
    "test/title_responsive_visual_harness.tscn": "b0ab912afef97f1713ed538db0e75924462037ce6af28c8081b3d2bf66676791",
    "test/web_map_zoom.test.mjs": "8b134ce9134be2bf53ce9175f983cc2b5b5df61a92f1635c2816c73ae051e753",
    "tests/act2_campaign_test.gd": "ccf00f9a2edfbf7b144a239bbd946b4f5738093dec5e74f397059f1d2ab5aeb1",
    "tests/act2_campaign_test.gd.uid": "33bf6f053d19d80fc582e2b1e3808d9b30f224d60ecb5870e35c118ecb3f9bdc",
    "tests/act2_music_transition_test.gd": "6fa91d2eca81846ee7de873b7a7c19462a714e6d9ac380ee09f65460c97a1e89",
    "tests/act2_music_transition_test.gd.uid": "a9078b6ceb5fcf74b73dca83b3bd23d49a5443230692a7d4bc6d109970363177",
    "tests/advanced_operator_animation_test.gd": "b0680b96051e1215c7eed03b35deefcd0f89301ad0dba7744964a23f814e5729",
    "tests/advanced_operator_animation_test.gd.uid": "80515ef551e868411859836c48762872ee1a25f90b20c430e4ec2fa2c9a9c876",
    "tests/advanced_operator_compression_quality_test.gd": "cbbe1d8f0a6dc665aca777aa53b24072af9ec26374faf1a32fe96f9b13c3bfb7",
    "tests/advanced_operator_compression_quality_test.gd.uid": "39bf45de42ad48ed5bb542bedc1b14a4c7929030e9d50ea4b866bfcd50399ed6",
    "tests/advanced_operator_schema_test.gd": "81976f7e0d5a3de6d19841c42438038e1b13e5103eae6efca36949b9d5202d0d",
    "tests/advanced_operator_schema_test.gd.uid": "e1f1d32f9c716f388566f444ea2945047f3539427701fba8bd9b4b7792bfa260",
    "tests/audio_master_volume_test.gd": "697f9f7f03378e5784c3395afa1a30889569e5d2ea84f3be61178d73c13fc4c8",
    "tests/audio_master_volume_test.gd.uid": "89bf729040b1d6d4169fa2d964fff067d8bc3ff15f72723a87c04a1e0b4d991a",
    "tests/battle_endpoint_landmark_test.gd": "4aa3aaf618734370c0d7e7e82c026a293bd85787352e4bb627625469140bda33",
    "tests/battle_endpoint_landmark_test.gd.uid": "f0c3020efd457dc7487d1e0392dddc6db0d8721dfa111dfddb8992cd537182cc",
    "tests/battle_health_and_depth_test.gd": "52d3877a62a0f436e1b5d3240c7e8e2e5d15f0dd754dbc4cf12533938b473ed1",
    "tests/battle_health_and_depth_test.gd.uid": "558b9d8e561726cbb2e7c32cb60ff495265a8c06b44592f080e20f56568107c8",
    "tests/battle_hud_presenter_test.gd": "55e639f1a7b61e6bafd3534b456eaaee29efdd9e31df4ac09e11c706880bdd6c",
    "tests/battle_hud_presenter_test.gd.uid": "c4630673ed62b851d408f09dea7bc8ff9462b6ead484d6f46dd47a86e2d750df",
    "tests/battle_pause_menu_test.gd": "1f0ca346c92e4ecdd1c2b9028a9f1e2b6cadfd800b0c4b8026526e934909dbb5",
    "tests/battle_pause_menu_test.gd.uid": "61912d680343a3530c99858cd16e0360ffec8e9a6d47f3fad2f2d560878518f6",
    "tests/battle_ui_layout_test.gd": "ceeaeccf5057df96a79d8962eb89740a70f0521d699ac2541e69c33c69b162a5",
    "tests/battle_ui_layout_test.gd.uid": "b339e2ad9ac58ea8adb5d30bb1bdde72a73222667e1ae555f008f9b54c2eda5f",
    "tests/button_focus_style_test.gd": "e8fdffb2d7d2b7f40ac76a2ccadbc8429c212a151906d356107764163f8d9e73",
    "tests/button_focus_style_test.gd.uid": "7fb207589a1899fa050a9d2c07dfaae29231fa228297678f58f9f0d1468a5253",
    "tests/campaign_back_navigation_test.gd": "af4ec79f5fb381fa529678872d83ec209d37f681707b5cb54f7558942136ae75",
    "tests/campaign_back_navigation_test.gd.uid": "479a14126eb574613cef4ed6759ca3e85859d97ffd84ce8950132c938ebc4b16",
    "tests/campaign_save_fast_path_test.gd": "f35206fd5ba9db420eedd59506058ab45f3190ab16b6f986ff8a887a1d47a760",
    "tests/campaign_save_fast_path_test.gd.uid": "017296bbd90f6748c51b42b8fdb085854099553e45c29b92a3482a04713916d6",
    "tests/campaign_settings_navigation_test.gd": "5d48ffcf9f50dd0b2495c1d37b780fbf5b14b8fadcf52b4ebd0da5f98e49c244",
    "tests/campaign_settings_navigation_test.gd.uid": "176cc18df98331db9352f16348ed1351ef76b5f37f7825f9d3e56389f56bf6ac",
    "tests/chinese_primary_flow_ui_test.gd": "caa326a5c0a0ceebe4e3334d0676f48ecf1faed80bbdc91f4f226babe88443ea",
    "tests/chinese_primary_flow_ui_test.gd.uid": "8b4dacc6f2efb5740472a81f5de7fc0df1bddde46ed1678b8c3f49d515d16537",
    "tests/class_roster_prune_test.gd": "0445e0d8861f68c2351f1ff3bfd35afee50e95dfd332b674ff324e65403e9bc4",
    "tests/class_roster_prune_test.gd.uid": "d28c08ce04675071fa43dc6f3a7d038923cf9d8536389fc108f1cd6be3d67224",
    "tests/controller_accessibility_test.gd": "6c42197a95bed27534e75a5e5555fedd2b67b773ea11a1a8c97b593cae904af2",
    "tests/controller_accessibility_test.gd.uid": "d87b6180f2e3e51a72ddf20a7eec774dab46f52d457eb6d91a7fb98db9572b1d",
    "tests/cursor_system_test.gd": "3723dbd866f2923b05a130dad58d1a2d3a674cd7b0ab331b2f60e5d966e351a0",
    "tests/cursor_system_test.gd.uid": "ed868b7ccf5141968c16266381aad7c6b04774375b21d0b6e85b595f816e6f08",
    "tests/custom_naming_roster_test.gd": "105bd138c3b859cef8047f16b7e3a097fd88eefcf276842b916dd92ee43a5706",
    "tests/custom_naming_roster_test.gd.uid": "9e916719c130508397c77178b2f81459d3de94075f5bcdbe7feabb0ea409ff0c",
    "tests/deploy_bar_operator_icon_test.gd": "aac6513ae3f2b47ba90a87b3e07d9493eb5a3eb426a28cd8c9e27e494e28fabd",
    "tests/deploy_bar_operator_icon_test.gd.uid": "31cc1fb3a6629724404dd0b09329dbdb7c944c3f00db32e866135b35aafcc7d1",
    "tests/dialog_typography_scale_test.gd": "e64cfd7fab45ae5069e251d8308af5219554affec26c1e2da655c6b468285dad",
    "tests/dialog_typography_scale_test.gd.uid": "88507b229bab1320b21665522f90ec30b482b01231fd3e91234af4355964af29",
    "tests/direct_mission_fixed_roster_test.gd": "bb25d51f04eed97a86def5f783eb7952f5c59255df0a4b4514ce04636b9e3b2e",
    "tests/direct_mission_fixed_roster_test.gd.uid": "311d4b542b64c6c012386bcf3b3f95c8ecfb248b03e8a0cfc454edf7aaddd030",
    "tests/early_enemy_variety_test.gd": "40eb2213acd2271ba64bb6c2b5b4c49ab8fcc3387b06c920c4de0500d37e3691",
    "tests/early_enemy_variety_test.gd.uid": "471d37071496cd0c744a7c12e2336cadce234b13a2bd7e56fd6fb9d2f909015c",
    "tests/elevated_platform_accessibility_test.gd": "9eac45fa6ebd883e684ec375620df0db63f485f0a85dd07e1c0d9dde04ebd41b",
    "tests/elevated_platform_accessibility_test.gd.uid": "a62541f434a180af26982d77284486534b0628e5d018c4abaa0534c2b914e89c",
    "tests/enemy_static_sprite_test.gd": "69a15696a4723db0d849e5ec758180ec2f941c7e4035050a6cc5f694a1ddccb6",
    "tests/enemy_static_sprite_test.gd.uid": "b08ab363048a69d1e82aefdf13a97fca00cfce9f6b41968d5adb90be77f0a1f8",
    "tests/faction_roster_filter_test.gd": "84e95c9a33e6ab13281129ba61516c128e9ef95d1fa640a03c3f1a4edc2caa22",
    "tests/faction_roster_filter_test.gd.uid": "af9b617f0efe30dc6ee4e02a470d65ba3b3620c825cfede2204284e456a8142f",
    "tests/first_mission_tutorial_replay_test.gd": "5fe890c16820549ede22f6a287adbe07c284aeca1b783c09bae1733b2877604b",
    "tests/first_mission_tutorial_replay_test.gd.uid": "b1e0aa257ae59ecdb363342d8aafc1385e75515dc1b3ae8c5e2cde11133c5589",
    "tests/global_button_press_feedback_test.gd": "49a1830a3cbef2d79a5e5b9d635b99b04592fce469a99502288160dd68372b9a",
    "tests/global_button_press_feedback_test.gd.uid": "4679dab6a3188633b1f8c224a372fb62814b50a172d750cd83d02190440cbac1",
    "tests/global_font_scale_test.gd": "38ea2f6829600dc8952bd7d214845e6aab4409551014507eb4002ecb902955da",
    "tests/global_font_scale_test.gd.uid": "d61c6d1070b061b2686c46a71a26f66e71d974767651325d7aba9f1bf9af18d7",
    "tests/global_text_scale_setting_test.gd": "7909a1c5954a64557bd0050d50220ae723d0c20f06069895df8c475c4ae68fe2",
    "tests/global_text_scale_setting_test.gd.uid": "e973190b0e09be12bd87ce9ae495a7d1b33d12b0077b1440650cab9716b9751e",
    "tests/high_threat_wave_warning_test.gd": "36b490f404e946db259933c6eef5fb9569a7aae598e6d36520a578ff7df064a6",
    "tests/high_threat_wave_warning_test.gd.uid": "8933a579ca60aebc2e3e7f7e63d08d36b96475703b1d7d2c5c6d28dc69ad4ac1",
    "tests/leaderboard_network_test.gd": "2a1437b72e18e1c176b1947aceea04fc2ede4aaca7f2a10ac8a5609c7d936f1c",
    "tests/leaderboard_network_test.gd.uid": "e1cc1d9999b0e22da8d0fb39fdd67f2188bb8319eb1d7c24eefed98486ef7d2c",
    "tests/leaderboard_service_test.gd": "83631a1bcf22129a2e60ca1c159473a0c07df9d2714e1b8d5b3ad4ad5ea2f5ea",
    "tests/leaderboard_service_test.gd.uid": "fd8aaf1740804c7bb0892d29a7aeb168083a42d522541ac0ec79af0650e1d82a",
    "tests/leaderboard_ui_test.gd": "b752f395a35f55a27ef5e28c6f9d7ea831f624c28044414a0187cdd8a35a6b14",
    "tests/leaderboard_ui_test.gd.uid": "fb4aec7a68edb0da30bd5afbefb6e019b6e3afd659fe7ce9e162f58903ddd4f6",
    "tests/loading_art_alignment_test.gd": "e0dd0d6b14e096228a58d9f46b0050c33ecc76f30c79e0b4051edd64bf6adf1d",
    "tests/loading_art_alignment_test.gd.uid": "5b507c96719deb268687b7abd7d86bf0fd094a31b85931f5b70c70403dca38a5",
    "tests/lunaris_ui_foundation_test.gd": "6e9bc90b07acf91408dceb4a98892d4bb1b7b9d1512953524d8bf4ba20ce3f1d",
    "tests/lunaris_ui_foundation_test.gd.uid": "03937e7d9bf88522aff12df036a29b06b43908f69e8c3a37dbd71fcb5dc0fe54",
    "tests/mission_copy_removal_test.gd": "9f26710920b7dadb869bab7bf0eb8acbcab2715f15f155e044a76442a9d933d3",
    "tests/mission_copy_removal_test.gd.uid": "e85bd99f6d7cadea199ab398492d1bc46ca38eb31cda023104edc648449fdb59",
    "tests/music_redesign_test.gd": "ca4023b04fa984d7246086fe9f246f4acc8a90eb7fefd3224b5c14a786b85955",
    "tests/music_redesign_test.gd.uid": "7c72584c14160f47947feed8ec3034bcbdd8793daa35e13caec682c1931b36ef",
    "tests/no_permadeath_test.gd": "9842ae10628cc9517f19f8499f6744dd2b07f86566c5414356870b1530fe22db",
    "tests/no_permadeath_test.gd.uid": "1872a66f1946ae47a63b1845751ed1ddb5e345ec2355563dc325a06bc33d21f8",
    "tests/operator_auto_facing_test.gd": "602219598f6327a3702dad740df92cb32b572af35609bff67ebe8f4a54cfaedb",
    "tests/operator_auto_facing_test.gd.uid": "aac3f1f8f7b8e99ebbced339992c45bbc754b555b0306dd50c93f619ab2f010f",
    "tests/operator_retreat_cooldown_test.gd": "e22a1d93471194ed09649496557036628d830b168d78f084314d56e30d3b4083",
    "tests/operator_retreat_cooldown_test.gd.uid": "e83a19f6a726e011cce506faaf7ddd27c0cb81d26ea672c1429b83b3ef131cdc",
    "tests/operator_sp_bar_layout_test.gd": "3532ca590d05f26d9647b1f5defab98e55ac60f37fcae9644f89b203a7decfd3",
    "tests/operator_sp_bar_layout_test.gd.uid": "81d8680398b5584ac1cf429f35c9ddcf33e41bf110001b87b3c473ee6358fff4",
    "tests/operator_specialization_gender_deployment_test.gd": "05e381af2334aa9851de32a89ea6a3af58efbbbc0b71a0c20c5e429528caf10f",
    "tests/operator_specialization_gender_deployment_test.gd.uid": "fafe630c8903b2675e842725d8af91d3f420828e3404581b7ed584f6e4f30e33",
    "tests/player_data_clear_test.gd": "4b10d8d401b352ac173dffe5b982537523eda3f0f0963e5fb964f8f2f8d90006",
    "tests/player_data_clear_test.gd.uid": "1ac767ba8c11ed0c1c951530abe83c1740d25f26396c6ba50c540e9a2d4e0401",
    "tests/recruit_animation_alignment_test.gd": "16cd42b76689274c0c3e43de0b701d3c936c9d7c9a241c7f831433e0e5c7d39d",
    "tests/recruit_animation_alignment_test.gd.uid": "cdb982a69d38a41b7014104811b949c73fb6bce8f955b3e577922e58d616e46d",
    "tests/restoration_lattice_test.gd": "725e431c70f1c2c10cea8923f269cc723a17d554ae9c953d54a419f42dc7d77e",
    "tests/restoration_lattice_test.gd.uid": "9107e6ad49dbc8ac387208efb253c6221c19af336c05b57753588c3c4824339b",
    "tests/results_simplified_layout_test.gd": "d4c3b77719fcdb742303f366bb30fadceb261544878b26b58569a7993ad9314b",
    "tests/results_simplified_layout_test.gd.uid": "7abfe08d34c1fb19ca1f950a1597877eda6e245e6c0bee6643429ac906fa08e9",
    "tests/runtime_tweak_battle_integration_test.gd": "837f0312128de395caa473bcf66e761d287602dda02a3425a3a1993ca4ebd8db",
    "tests/runtime_tweak_battle_integration_test.gd.uid": "96060aa8486128ea4eb689d5c258d71d89153a85b8544909d40c346003aade93",
    "tests/spike_plate_transparency_test.gd": "21efe7e64e986cc4c3d30dfe781cfa4a9f8f2fe4cbb7f8fe0a067507b944c2dc",
    "tests/spike_plate_transparency_test.gd.uid": "ae81b7efcbd5e656b96d32a1420c65fb29440a31e538495666d930735b2db593",
    "tests/start_screen_flow_test.gd": "bc6f4b287b65a2ff378b6e16a02291fd80c8740936b45d4f7e0a37629a0d1317",
    "tests/start_screen_flow_test.gd.uid": "2cfc8e844982d347ffdc0d5b2ee6d1eb7fb408effcff8a3f117055a859670cc2",
    "tests/terminal_result_flow_test.gd": "e6a9c0e40e57f7663d2fb895bfa99ed502248921acabc48cd417ad9ce18c1a45",
    "tests/terminal_result_flow_test.gd.uid": "30e2b8fd8dc9050fc25fc1192d3630b2ad682bc04264288fcb19773d758d687f",
    "tests/title_settings_style_test.gd": "eb5267b20be7d3c74b83342e7ac8e557f06c6b99af9b8b197a3b63bad7262024",
    "tests/title_settings_style_test.gd.uid": "dac5ed71c639dedb7dee64ed4aa68129efae7fd2fa862206b4c6a98b53618856",
    "tests/tutorial_surface_style_test.gd": "a52ef3c52111d0416d5be09f0e54299a02e6d22308525faa06f9467103d27445",
    "tests/tutorial_surface_style_test.gd.uid": "0134ab8e3d8ee690cbf7fac6c634aeaf192874b27eed5ed9997bbd3b4c816f1e",
    "tests/ui_audio_direction_test.gd": "3122cff740ab4265da2eefda831413ac9f44361d9b6c5102029c53aa65d3fae0",
    "tests/ui_audio_direction_test.gd.uid": "3a4626a3920c2f28f2a11f84ab510d4d9edd50dabe81d5cb5abacd9b60370e90",
    "tests/web_audio_unlock_test.gd": "d3025e2a5c73e6ac1102c6261bfe1283bea94ed0dcc2334d0097a076cd474b9e",
    "tests/web_audio_unlock_test.gd.uid": "1fcfaab709a9acc32bc30d45797b2c44457f695d7973e686126f1b7b3856cde4",
    "tests/web_content_pack_staging_test.sh": "6ce05eb81df7e1243009e947053f16fe89a6b2505a9cbeb84c5488706d724e38",
    "tests/web_content_pack_test.gd": "d50df41397788ab8a33d43a345e1c0409521044b78203990eb4c1fa3c448490f",
    "tests/web_content_pack_test.gd.uid": "4a4d2e9f862f8f09f4334f05407df365f0b884b1491e03967f11bb47c9c1d54f",
    "tools/audio/process_act2_score.sh": "f9f28b6bf5e4acec64a2b7e7d3a61ba62b032ccaccd8e576b27193c6fc88bf9d",
    "tools/audio/process_lunaris_score.sh": "2e3abac2774b49e5d575e9180be6eca0fb6ae5676c8e3591a9ea25de49c7d6e0",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/build_web_content_pack.gd": "bc839f3c8b552b4d035b2fb3f98aaea0b33a3f8b1603bff143c9c96df92a303e",
    "tools/build_web_content_pack.gd.uid": "160041dc8f46fc6374068c871699b477b22b118a81f26f954db3792ff47fc557",
    "tools/check_late_enemy_assets.py": "f1ef1ee121f1ac01d6004bc50a8fd4aba5f3b9b2d72dba710f9ddcf2c0ec94f8",
    "tools/check_merged_animation_assets.py": "26da0a0e691436a507b864e429890acfba7e316d6c6feeb406e5db0428aa0aca",
    "tools/check_walk_cycles.py": "1e3f90c1e4fee081b1dd4415bd80266f9122147416dc8b01b3262e27963a3729",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/generate_pack_checks.py": "9d88392b6314cbf1f790a76ab880cf0a045562317a2b166d9b49ccb127f1e048",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "tools/operator_sprites/audit_operator_proportions.py": "9618ca0f6c326eb09bc47f188f72a4854e6bf867d8d2cc508ebb472a20e65166",
    "tools/operator_sprites/build_advanced_operator_matrix.py": "075fcb4695c5890b021f51d282018647367331e3fc61d8e4a25687945a39b16d",
    "tools/operator_sprites/build_advanced_operator_sprites.py": "5df89215781b76221f425848fe166be29857442abda6673cb575c9051ea14ce9",
    "tools/operator_sprites/capture_advanced_operator_live_quality.sh": "633bdc5dffe940a8c49170911398f3e96724b51d985b900a1bfcb7d0db679694",
    "tools/operator_sprites/capture_advanced_operator_visuals.sh": "152701ee07b6633f7df26260db4589fb0c873b41aa7a47991dafd1ca28757a2d",
    "tools/operator_sprites/configure_advanced_operator_imports.py": "d07d33877bb1bf997067d1558df1e449364e1396ff02a799788bc548635ee2df",
    "tools/operator_sprites/prepare_reference_archive.py": "c62e844ecf96b33f35fc8de94fac6089f6875e0c886bb3f05d58e091ff20a508",
    "tools/operator_sprites/register_advanced_operator_sprites.py": "6d4934a3de72d9702e83baa17f20a5c632d9ad5648c25e6ef973fee1e26825d0",
    "tools/operator_sprites/validate_advanced_operator_sprites.py": "c4a0f9634f4c6f863f9d17a52f40e9b8f895363c09802ddeefa95c17524f3b51",
    "tools/pack_atlas_padding.py": "b288eb6f9f6e6bf2d9f827440a2382a2302f66cd73504c44843f88bec1c2f8cf",
    "tools/refresh_chinese_font.py": "5e4f8032f2a38341e912768a5402dfa050043e562ca92410b201db96f4c7b1cf",
    "tools/refresh_fablewood_font.py": "4528bc9094a9f1017eb3b9dbb44084ee949e20ee87ddc77404149fc1e47e6cce",
    "tools/repair_enemy_walk_cycles.py": "81c6574012f7b96281af5a4e2abceea5b42751df9bbb88df393c26e016657a4f",
    "tools/run_godot_isolated.sh": "a9d8f5e768224e28c6b696ac61efe8c84c235a76876ed2e60777167cc1d815f9",
    "tools/run_godot_test.sh": "1dfc25ce5673865a55379a4277d06cb23209fad3630fdbaa6bf93e93407c2947",
    "tools/stage_web_content_packs.sh": "8ac01221e09749101cc45615292ddf8109b241db7b041d6773ed029e19060bb2",
    "web/loader-cjk.json": "cd50bcd0fe25528ae3fe6f8e416b2f29f73b17bd2065ad7a83f334b9db52002b",
    "web/loading.html": "2718ec9203d418b9950cb38ef040c99bd489074207b9cddfb1b08f82fcaa982b"
  }
};
// shared/gameStarterFiles.game-rts-v63.json
var gameStarterFiles_game_rts_v63_default = {
  id: "game-rts-v63",
  files: {
    ".gitignore": "9ea6e9d127bb1973dc078ebad2a49237972e11c24148ad39dd7cf9c765394b4c",
    ".manus-game-template.json": "64183783d0c0946c1af6b0e1287207c739ddf09942783a7141099a97490747cf",
    "README.md": "1f64d19228d75c0ab7ee4a26de6db0a8a39aeb555c242483b3b5e269655d15dc",
    "asset-provenance.json": "7592d8bb60893e6d45e505401faf24108e2b75797bd30385fb4ddead2b38e84e",
    "assets.lock.json": "535adf24351a369522053f8b14b4f670fcebc9a7295ca18b53508326546028ad",
    "assets/template/catalog/sfxmint-impact-punch/impact-punch-01.wav.import": "c8982af300b1ab476563f45cff3ba86ef718b1a498a52dcbbeb5422bf67b0520",
    "assets/template/catalog/sfxmint-impact-punch/impact-punch-02.wav.import": "735db51e1f65dccdb3cf5b2eb1c2950a079ddfc1bdafe6145ba07fac8e252e90",
    "assets/template/catalog/sfxmint-impact-punch/impact-punch-03.wav.import": "81d6208a0051abf39f73d86643341220fdf377946ac233f6acbfd58ab5608d2d",
    "assets/template/catalog/sfxmint-impact-punch/impact-punch-04.wav.import": "b057da66e6c207d0480921da9828d65ca171065c923347bdded7bf47224efada",
    "assets/template/catalog/sfxmint-ui-click/ui-click-01.wav.import": "02b76f2030f2f232d5ebc14efc1971bfa29afafa4f3c25469c14b05ff44938af",
    "assets/template/catalog/sfxmint-ui-click/ui-click-02.wav.import": "f87c23d8d0dc8dac84ed4fb862173df2caa8f90463414ad1e92c512eadc8f1bc",
    "assets/template/catalog/sfxmint-ui-click/ui-click-03.wav.import": "bec9f6e000bbd15f4ce68d3ead0c8a77541c6e01d1a78e4bf316cd4bafe3889c",
    "assets/template/catalog/sfxmint-ui-hover/ui-hover-01.wav.import": "c9fd4d67fe0338ac2c0d2f9289ca0630bd4ea8c552d1e3d04590f88e88a66d40",
    "assets/template/catalog/sfxmint-ui-hover/ui-hover-02.wav.import": "5e52632936e688c9162daee89e2ca5974c12c7691693719a2b8073fc43470560",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "beae31b2159a4d5d3bef5f23a098a92b96d5b6f252a05d924e970706cd139590",
    "assets/template/fonts/display/noto_sans_sc_bold.tres": "802fc5c1e6d59d751b7a082e97e9d660ee1a80e7df5a8fc0c8ebaee4ba3f48c3",
    "assets/template/fonts/display/noto_sans_sc_medium.tres": "cedb628da4f2581710eeaa6abf86854bb84b430d8a9d5af133a812de20e99ef6",
    "assets/template/fonts/display/noto_sans_sc_regular.tres": "d083b2b1c4993eb3504711457610921a510ef1dc77514d13bbeaac2a0f2627c9",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/game/anim/enemy_blaster.webp.import": "8030c94cbf8e657a29e015f42b46900b345fe8e29435e868c72fb790f2e22182",
    "assets/template/game/anim/enemy_brute.webp.import": "241391a612d909d18b39ed5abb974939496846643d47f0b206dd7105dd5b8408",
    "assets/template/game/anim/enemy_goon.webp.import": "c7e9bdd878c88e0d951aceb3e9ecf7339b8f05c8f75a19bf26844276d72fc04e",
    "assets/template/game/anim/enemy_mech.webp.import": "3b587aaf4b3e645fc4b091a2e9f8dbaf2361e9481d0f498da9f751dee3a739f8",
    "assets/template/game/anim/hero_blaze.webp.import": "93061327e631ef594fb748d9d9e153e69cb632f9d3a26b34b0aae6ae140ff07b",
    "assets/template/game/anim/hero_frost.webp.import": "d133fa4ce341cac259c4bd09743be5262c40f9271d0e8b61d973c3c9cb0ffffc",
    "assets/template/game/anim/hero_monitor.webp.import": "4d4935e9b323501f1d85027f040afb9541c7c5aedeeeb84a48dbb78555dbb59a",
    "assets/template/game/anim/hero_psi.webp.import": "17bf9a1abbe40943da750c9a890c2df649d50b41ceb9afc1d2ee479479eba6bd",
    "assets/template/game/anim/hero_stretch.webp.import": "7638ec8d1a7a01c1b2e81026a70fd7090c9f914ce2b23445c68a719710cb8c49",
    "assets/template/game/audio/music/bgm_battle.ogg.import": "51f1d9e32a826dcaad504c3ce24229e6fe80e5d47393042688f8c8130cb43239",
    "assets/template/game/audio/music/bgm_boss.ogg.import": "ba05f320bc5c3abed44ff7fcd94935c1922bf03f96d425cd9c661d22db0d6218",
    "assets/template/game/audio/music/bgm_title.ogg.import": "c8cf4882a2bde81fbd1f76a303ff920159a76ad214ce054dad799b088cf7dd66",
    "assets/template/game/audio/sfx/ai_alarm.ogg.import": "2f1b2d1a593f85a4dca8856d36b97832461e11c6259de7e6fae07163a6d820a0",
    "assets/template/game/audio/sfx/ai_charge.ogg.import": "8178aa674baa57c82a7f61c1b600e01c47adad841f35465ef286b177b4bdadc0",
    "assets/template/game/audio/sfx/ai_retreat.ogg.import": "c859be05800b54f1af6f806b81c573d5de6041778172ff1c162d88c2ebe7b0eb",
    "assets/template/game/audio/sfx/boss_roar.ogg.import": "73818edcccb12925b82d3409584c8c603cb9faaf92ff926e80d8e2cd7c0b2420",
    "assets/template/game/audio/sfx/boss_stomp.ogg.import": "1dce6488b04fb04e82e5ce6ec7927608776cef6f37d6be49ef1fc6b31ac9dc2b",
    "assets/template/game/audio/sfx/capture.ogg.import": "064a3598ce8e659ed220d6f2ffc2d493707196b7b78bd932cdd3c51094f9892d",
    "assets/template/game/audio/sfx/coin.ogg.import": "4afa3a13d20158a0d6bb674bb4eda347a7e39bbba0c4a6e77d55379d373fa0d0",
    "assets/template/game/audio/sfx/comic_page.ogg.import": "4902339cf6ac3e34219a199d494115dea3ace83cef96123d9d093d51f4af242f",
    "assets/template/game/audio/sfx/comic_slam.ogg.import": "6df79318c6592112c728077a334dd6a0c95cee197b78b88473ee850e5cd5c430",
    "assets/template/game/audio/sfx/comic_sting.ogg.import": "341b003f0d7b7196462bbae42013f99151056c007e97d2d7a6efc51a1e5da786",
    "assets/template/game/audio/sfx/dash.ogg.import": "ffe6177fddd0829030e7ffbfd5055fa3683786776346d24709216032c6d376ad",
    "assets/template/game/audio/sfx/defeat.ogg.import": "34b256594555b3e7a6941fb4713333c241b5d219ce59236cd5d898382c3ddec9",
    "assets/template/game/audio/sfx/fireball.ogg.import": "e3a17ff0cd1e3bb0d9fe2fe42750feb0c3317a9cdb21fe895507c55024507d0e",
    "assets/template/game/audio/sfx/goon_grunt.ogg.import": "a859106630b0e2e5e80b465c046c3ef0214813078cb039ccead92d72aab179c8",
    "assets/template/game/audio/sfx/hall_hit.ogg.import": "de92e10e38219c4cadc6a33d24bce095a58f1b01e5d6d700fb93a6b7ed51fab0",
    "assets/template/game/audio/sfx/ice.ogg.import": "228d74d25c7ff9cc027a73861a6f587f7e46400b9d06d4bc6e3d32b645ed993c",
    "assets/template/game/audio/sfx/ko.ogg.import": "6217d9f6e2dfcb5a0f948cd64935a75a7f41aa2a2423dae2ecb265bf719a7858",
    "assets/template/game/audio/sfx/levelup.ogg.import": "ac4dcdbefa1858b7f15e4fa18e9051960efaef268891c3fe663d59d26ce2b6f7",
    "assets/template/game/audio/sfx/portal.ogg.import": "3a892847a99c139a045398b599f2c2aa74f11f1482c604d5a6ec76bc1275f488",
    "assets/template/game/audio/sfx/psi.ogg.import": "007747a21aabe8fa34e641685af185d8afa28a68431fcb00428c88dc99790ca0",
    "assets/template/game/audio/sfx/rally.ogg.import": "c83b7c54d78e1e8b6686ef48d859569243592e595dcbb5f5e4dd429b54a443c6",
    "assets/template/game/audio/sfx/rockets.ogg.import": "0b493432cf02c05c50ba5688cdf11ae713b8fcca932bfd383b5aeca35811596a",
    "assets/template/game/audio/sfx/slam.ogg.import": "1e1a5119d374aac9c65bcafead007366e2c4d0c5c45cd08caa15fa074e39996a",
    "assets/template/game/audio/sfx/stretch.ogg.import": "4e652c6ccae5f1c116de6d1f6529f8e44d57b01507dab3a841bd90c5d933c668",
    "assets/template/game/audio/sfx/surge.ogg.import": "8737a052e78528c228be2d9021c38a3321a3c380dd2b11c19d9a194848bb0e33",
    "assets/template/game/audio/sfx/train.ogg.import": "f487256c5a2271be770d4b42a26669d3b51574ed6daa3494ea7f29222ea0945f",
    "assets/template/game/audio/sfx/victory.ogg.import": "d9b13a9f906d46b141121144e1566f14299b3f62567a06fc3ae2563c287f9cb9",
    "assets/template/game/audio/sfx/wave_horn.ogg.import": "cbd135f85ee3050be58e091e3bd9a733b54fdc511e3a180ec0d3b210f1fa3fc0",
    "assets/template/game/audio/sfx/zap.ogg.import": "f8187d0147c90107bfcb2dff73fa733350b66d738fdcaf31232d2cf4a367a5c0",
    "assets/template/game/audio/sfx_rescue.ogg.import": "dbbab04bbe5c63d513a5522fbb44c70b689e475f0d983f37f4e12302b5495db6",
    "assets/template/game/audio/sfx_wave_bell.ogg.import": "6dbcda15f94c1b38e07c3f4f8bc316d959fbf26e698cd490b2ccbb41bceb168c",
    "assets/template/game/audio/vo/blaze_level.ogg.import": "96ee7f36d73825115cc5ffd9a11df7727169af6586ac14ba19a356f9007994ef",
    "assets/template/game/audio/vo/blaze_power.ogg.import": "651f8d1f3ba6d4228206bd1a3ebe4d3cab9ff4cecb6b72da194f31330ca3b9f9",
    "assets/template/game/audio/vo/blaze_select.ogg.import": "682ef9a05c847ddd954e727eec3128a2ec904c73ecd98783e172c9d591b3b629",
    "assets/template/game/audio/vo/frost_level.ogg.import": "cbd97216a7e2523207ef5a729e48a3b03c8d2faeb710b310f5f17db0fb02aa72",
    "assets/template/game/audio/vo/frost_power.ogg.import": "c4bb7244a455f084148b09de789eaa3b0be4eee7573dbc57024916667879f86d",
    "assets/template/game/audio/vo/frost_select.ogg.import": "5a2feaa2480254ce6fd54f20d4ca4d75ae5e7365bb2307e169c26f1bcde75e0e",
    "assets/template/game/audio/vo/intro_coach.ogg.import": "aabba0975a6085ab6ef131353a3b61915977a405275005e2f660e67c61979e2c",
    "assets/template/game/audio/vo/intro_n1.ogg.import": "21b7bb2d96254f61677c2e3ad9e595103d8e7c7c0963d3f19694309dce6932a7",
    "assets/template/game/audio/vo/intro_n2.ogg.import": "7ebdadbc4c06c593d2e77e2bb3bbba33c3bad1513cf1049bbda5c65d1aaad8b2",
    "assets/template/game/audio/vo/intro_n3.ogg.import": "cb4a1067d67030b5536958d752a8b70a29a5b7b62011553958e646ba4e638dce",
    "assets/template/game/audio/vo/intro_n5.ogg.import": "334800c4587de6e90493dd9b4556c7b05e2ebd042f3533c3ccbb14cc5e7c10d1",
    "assets/template/game/audio/vo/intro_n6.ogg.import": "55d360d067aa3de523c2bfe4a13cda9dab431fd5c1027176cd76f7fc6ff1d2f7",
    "assets/template/game/audio/vo/intro_principal.ogg.import": "12b9c25ebc8f1420bbb20e2f3587cdc0dc6de37b021b57d5c3beaf0192ca35d5",
    "assets/template/game/audio/vo/monitor_level.ogg.import": "60255d8bdb35545f806b8975c0c945a044eb45935c229d37c88154495b7b6f58",
    "assets/template/game/audio/vo/monitor_power.ogg.import": "f33fe563da43d97ffd296d5cf06f352467bce55dff760199595978353482a08f",
    "assets/template/game/audio/vo/monitor_select.ogg.import": "fd4b93f738dbbea6c1e99eac2eb1a2594249655a114b78cc0b88b42b1bec8f75",
    "assets/template/game/audio/vo/pa_defeat.ogg.import": "b790efed0276043f3b686f7ecde35498dafea8c2f84b246c0705c49940870706",
    "assets/template/game/audio/vo/pa_final.ogg.import": "020a99a1673091ef150bcf5c75b019b40849948048eca6151ceb5b97171d1c93",
    "assets/template/game/audio/vo/pa_room.ogg.import": "6ae529a832d2c8ced436d9c8c5e2bc10554d1a3b3831f523627c99cdbb885cd9",
    "assets/template/game/audio/vo/pa_surge.ogg.import": "fd786024c3ab1e8acd3b4b7889ee7ef04fc152bbd4d818467f9cdca4e0139783",
    "assets/template/game/audio/vo/pa_victory.ogg.import": "b3560dd31305a1aa627a9d395ce9622a62043fe4c869bb2cbdd79a853ace7de3",
    "assets/template/game/audio/vo/pa_wave.ogg.import": "65a6d67e0154f34c11ab9ca33e5f41ccac8a5c6adfa4a65b9aa396ef17b5e85a",
    "assets/template/game/audio/vo/pa_welcome.ogg.import": "880d601f2d9771542f9973dad67f6f7629140242e67604fb208297f010a7b3ac",
    "assets/template/game/audio/vo/psi_level.ogg.import": "a0dcd6c1517d4cd9d0bb0b31cd66209c8575446edcc6d4fb4a2b151babf8166b",
    "assets/template/game/audio/vo/psi_power.ogg.import": "1d805947b168d9925e7b988500ea2acaf4b5c4c11a7b1c66839474eccaa799cf",
    "assets/template/game/audio/vo/psi_select.ogg.import": "e9cb9c437af1ff3ef331c4d6e60ecdbf154fa15a03f78105a63cbe741052fbb6",
    "assets/template/game/audio/vo/stretch_level.ogg.import": "a2125e5a0a0d6f366b52d674a91dfeea5a29e23d04d20c93f594515d21d8e878",
    "assets/template/game/audio/vo/stretch_power.ogg.import": "9c46dc853cd77fb5d90a9c8f1282c65eb958de34002e144a78731c25dd37a94d",
    "assets/template/game/audio/vo/stretch_select.ogg.import": "d333ba92922dd2f9fe1855baa8cad50a0e38f1d5bda77ae65d48287bfc32f8e7",
    "assets/template/game/backgrounds/title_bg.webp.import": "a3e92eb8fd859f7f671b1f911ee5209925767ec21256cc55da918cc3360b1d60",
    "assets/template/game/buildings/bld_cafeteria.png.import": "ea4f7b903d6f18db18bf8e1b5d7eafede234bfdf9a0a0db719e994f413e2da96",
    "assets/template/game/buildings/bld_chem_lab.png.import": "bd9b419e81b562e93dc648f13338682c9ea92bfef8a285206daceef661db1123",
    "assets/template/game/buildings/bld_gym.png.import": "c4115245b0a81ee36b11667a84cdeeaf9bf8b9853a6c20054fc8938355bd96e5",
    "assets/template/game/buildings/bld_library.png.import": "4dba58d759efe1bd0e9c2c5c363204516e1efdf0b34ee5c1f3830a724015b759",
    "assets/template/game/buildings/bld_main_hall.png.import": "356f472345fc6ee3ba547bdb61db860436cfad1a8815fdf7a50c4c1a835971e0",
    "assets/template/game/comic/p1_quad.webp.import": "f2dcec3c53568ce1766bc257f45d7498820d696d2758db41bb43479d53884ed2",
    "assets/template/game/comic/p2_villain.webp.import": "c7ef7030118f604751385a91477c92cae4e487842a0f5c6dd128372e1d0e3a6a",
    "assets/template/game/comic/p3_invasion.webp.import": "bb1583540ec01cd9d986d67b0453b64d00696714e223850d125260e74965744b",
    "assets/template/game/comic/p4_principal.webp.import": "8a66357d69ef102168651151ba3aed6ce4f640cb8c2fa7579be550e27c31e097",
    "assets/template/game/comic/p5_squad.webp.import": "aa3ba1c47b8caa8bda224104d3a035bdbf46a79a5121b7bf0a899089c3dd5338",
    "assets/template/game/comic/p6_splash.webp.import": "ea4c0db29977696b48c98c28daec3d3bb2e4ce30eb30e7e42b9628fa8cf663f6",
    "assets/template/game/fonts/Bangers-OFL.txt": "01f0dea3bc499f7fcc471577fe3a8d7df6e74e6b456d2228b767a239740811ae",
    "assets/template/game/fonts/Bangers-Regular.ttf.import": "6cd9d23b030c2b1824fd5a31ff9000640387ac3362fb02b02da926e34a50ca11",
    "assets/template/game/fonts/Nunito-OFL.txt": "ee9491ad3ea5d390878695bd6cce49beb3cacd5c4312f8ab574b541e9f7afa21",
    "assets/template/game/fonts/Nunito-VF.ttf.import": "036a9f236f0f27a3c12fc6cdaa01880e0a593e0f946b570623f3c6d1bd8da1c5",
    "assets/template/game/fonts/display.tres": "7b910b8648389f2b7f8fcee1b75d2c0f65acc54e4d0d41989579ef7833ff2319",
    "assets/template/game/fonts/nunito_black.tres": "b8a3f664be21808ff468c0642910d2d98b23915263bb3ef4c7e0cfb45db5803f",
    "assets/template/game/fonts/nunito_bold.tres": "85daa27207f3df7e86acb95e8cdc763f3ef5c47581920cb3844ac71586d84826",
    "assets/template/game/fonts/nunito_regular.tres": "a6c112a612d21608ae5e653ac4457b62b83c742c255b06d5bcbf04fb732643fc",
    "assets/template/game/fx/book.png.import": "810c223117842a73a1882e22710a35b2006f3c1daffdb4916b114491fca01bb1",
    "assets/template/game/fx/coin.png.import": "798beb915a1030794d26f8e042d2e2336d2ce0a0292688ea98e1767ef1444f30",
    "assets/template/game/fx/confetti_gold.png.import": "4d7e19cfe30d819f96ddc2e14570e2bebda3b474ee8a3f20033cb14bb9241ce0",
    "assets/template/game/fx/confetti_maroon.png.import": "f8c92f7181da8aa07629de59a1f844b037973082cc67b52ab471d0a01e14d66b",
    "assets/template/game/fx/dust.png.import": "090132ca7c3541bfdc6081f9baa56e815547787cfd85d28b94bdb6a14bac7025",
    "assets/template/game/fx/ember.png.import": "06a77f4f13f64d8ee540b4bae8d39482686a6766d5a34bae065769eff31ff489",
    "assets/template/game/fx/flame.png.import": "dd6d810ef7aaf567273dc9e244ec0d07fd75ae14ca79a11106b86c757c95ad2f",
    "assets/template/game/fx/heart.png.import": "57c25629602aa2c88227ee466e9a65291d0094ae16b55cbc5c1164ba38be0571",
    "assets/template/game/fx/ice_shard.png.import": "1d6651d6258f9333ea8d2091f2bc1b5e1bdba9ac1f9e20243395f5054278372c",
    "assets/template/game/fx/leaf.png.import": "edd2fa13c15999af7581a0e9aa94cd56ec64a5edb920d72794e032acc01694a1",
    "assets/template/game/fx/plus.png.import": "6caa8a278b553e473f65b67cb74bcef9abd0f922c090db90dbe1e47be1da3580",
    "assets/template/game/fx/portal.png.import": "ff1d549910ca4288a43d5f9ea27f6b8b75d1744c16895c13b92ad06517f93ecd",
    "assets/template/game/fx/psi_swirl.png.import": "3133ae02feed4034e20e020b39c6e5873083f02d824ed684bddee828aa1381d4",
    "assets/template/game/fx/scorch.png.import": "d604c500c25a58023bca12bac2219d30015f2147e42b01dec2e255a252d02cb4",
    "assets/template/game/fx/smoke_a.png.import": "3de56aac293b3aec9edd6015b2ea9aac5cd4b5df01b7f7495ff322cc6bee61e9",
    "assets/template/game/fx/smoke_b.png.import": "c2543bb2e395c22b22d67e1a16c751046b7cf4964191c286b4cc9015797f7320",
    "assets/template/game/fx/snowflake.png.import": "94c1a1080c19fe9f05dbaff8addfc4ce08c270f6cf93d6201b179d780c765e13",
    "assets/template/game/fx/star.png.import": "96fb9367974825cbc916a5ae454ef82b9d98bf570ac20becd098d4d38f2bd27d",
    "assets/template/game/fx/sticker_bubble.png.import": "3e28008fe3e35f5cabab60c271bec7d0634f780191a3c8cc83bce2162d95f40b",
    "assets/template/game/fx/sticker_burst.png.import": "82e3ca427c4dafe377b1fb12db8958ee123bf36c8d5f746fc49c94a73f94a5a7",
    "assets/template/game/fx/sticker_combo.png.import": "8d73936de18b15b1dbb2d6ebfbd16253877eb89ded79b3ae28e19aa954c19405",
    "assets/template/game/fx/sticker_help.png.import": "6808026322c5eb496566a2526a897e2171c3b3c45a01da3b2bfe0cfdd6ce73b5",
    "assets/template/game/fx/sticker_kaboom.png.import": "197878f6c3826ad5ec1e9b7af254bf39f788ae91eceeb54ea8bb65b2c367f7af",
    "assets/template/game/fx/sticker_ko.png.import": "ebb1be590f0138c73511ad3dec9d731acf20f2e0346d71e731f6e540ddc8dec4",
    "assets/template/game/fx/sticker_levelup.png.import": "bce2f8221ba2e89d2e993f76791fee5fce608b985d6bb76976b95319d2bc1e02",
    "assets/template/game/fx/sticker_sproing.png.import": "25ccc446c8475bce2eb65bf61c484376b9f30dd5a37156893ef841df9e74ed1e",
    "assets/template/game/fx/sticker_warning.png.import": "a7ae41150e32793cdfa51ac62b7503d2140130ebae07165c1a106112a8adda7f",
    "assets/template/game/fx/telegraph.png.import": "80d9b26ea5f842d7ac7e353667baef6a22ae458797f4da4b4acd7f23cd5b5223",
    "assets/template/game/portraits/portrait_blaster.png.import": "6e094f84e878145af661ec8d6d855acfda1307597a6fd561146897cac522fbaf",
    "assets/template/game/portraits/portrait_blaze.png.import": "1abec6c824568284e9138b2b1e260935b34435be1324641494f4b026f4b1883a",
    "assets/template/game/portraits/portrait_brute.png.import": "287a64830e52d870e3dc532836dcf577e722d13b079e825627bb86c21a216918",
    "assets/template/game/portraits/portrait_frost.png.import": "eaa0fe114e13953802216973d4021ec5ca2e1d137268e16e4dd4478af98adc03",
    "assets/template/game/portraits/portrait_goon.png.import": "6e84a050afd3adced181856a58454cf1f50054bab8baf0fd99e796fbb5ba9dfd",
    "assets/template/game/portraits/portrait_mech.png.import": "a3c0ebcafa4ac1ca0b69eb596161178f525cf17e70238c19d0ec5af5a5c57f17",
    "assets/template/game/portraits/portrait_monitor.png.import": "a27eb439d139b8335572a5da8337b9ea0c1770c990a3cd40d3a1248a0859f732",
    "assets/template/game/portraits/portrait_principal.png.import": "ab12821eacc88e229e7d35dbe09091f38cdf1bfd05df6bf8b585a1270213569a",
    "assets/template/game/portraits/portrait_psi.png.import": "e6684de08ef4fbd98bf1cf4b7842066f4602d7b595f33d0a72e5bde522ff01d6",
    "assets/template/game/portraits/portrait_stretch.png.import": "cd7d2cfdd4a542e71e89c5b4a1c76a965c7b9a2844dcd5634cdb509f33820fab",
    "assets/template/game/props/decal_field.png.import": "85a30beae972de5c41a9b869fd24cdac0844ec4dccb02e89214c305e4ad62fbb",
    "assets/template/game/props/prop_bench.png.import": "62ad4c1ef345394f64ef8ec68a29abe37b7ffd45c9cb5d7d8079f4f2a5af5dd4",
    "assets/template/game/props/prop_bleachers.png.import": "fed1afe8de7c32bd1b605a11931aa0553824f6a3c32b18de05759ec9bf5e5216",
    "assets/template/game/props/prop_bus.png.import": "d9e18404bc2ec40eb63fc2fc9e6c9c602112d408488c536ff54a7f93cf1890ca",
    "assets/template/game/props/prop_flagpole.png.import": "3439190bb7cda40603d047beba343c372fd9ee48e4bd70585400f872a9f3e25f",
    "assets/template/game/props/prop_lockers.png.import": "4fbc3606ae777eaca8999c64887db131e4f1e0259c8f9ce4a41fff9a98410feb",
    "assets/template/game/props/prop_maple.png.import": "1b8ac4f2de6f59cdd0ff29a5acc93018e66c3bb80939a53d12371562dac8cc75",
    "assets/template/game/props/prop_oak.png.import": "108af611880223d4dc32693e5f747acf87bda254d2a41a20ae77156543c39f60",
    "assets/template/game/props/prop_statue.png.import": "33666eb583872ef23898fa25504e7ef29fda0770c35a6d08bc0e3d54bb2fd055",
    "assets/template/game/terrain/terrain_asphalt.webp.import": "dd24955a832cccd924f87ded7495d5d69188b03111bb9c10167c8ec0d60896ba",
    "assets/template/game/terrain/terrain_grass.webp.import": "18d19bf3117d51f321f7c450b8044a53c1052cead6065459d482432d7c6ef481",
    "assets/template/game/terrain/terrain_pavers.webp.import": "5ebf222f69d4038843ca434601106941a4ffd84b1b0d626309940373a069b2a8",
    "assets/template/game/ui/btn_cream_s.png.import": "ed0a4f4fd28640a2e8c4c6bc377caf61b96c5712449b779048cdba252ac28349",
    "assets/template/game/ui/btn_gold_s.png.import": "c2c351242469f395eee473de3e165c05f13a92cbd5174b5e479c8c9faaaef67d",
    "assets/template/game/ui/btn_maroon_s.png.import": "0495023c24d9a1435ede81137069db6c39b68d0dd5abdd73f4565e23e90a4faf",
    "assets/template/game/ui/card_frame_s.png.import": "237f3f7e24d85260b9417800d96cf94625469eb3ca53e6b4decc640127e994ea",
    "assets/template/game/ui/crest.png.import": "f5c3d04f9044322c0856ef7ee130ec05c10e0f19681b39b9360bdf03db26ec50",
    "assets/template/game/ui/icon_bell.png.import": "ef9db541fcff21ecbb05194a773d2ce6a96322edabd086b68d211a45ef07ff7f",
    "assets/template/game/ui/icon_reputation.png.import": "ddf29d04b2952b2175bf82943bd5dee93f2db5e534ea5d262359dc9c991e0c09",
    "assets/template/game/ui/icon_spirit.png.import": "95654308af0abf24fea1eeadfc7f0daaee9eb1bf08ce0c6aca07d4b628a75788",
    "assets/template/game/ui/icon_squad.png.import": "b9fdde51f47815a47f487c0b784c178f64f379cb2cbd83222c8da6fbf582e876",
    "assets/template/game/ui/icon_wave.png.import": "85885625ae5ec70085725a730a1db50a42727739b1609b6bce574d84b29a7b29",
    "assets/template/game/ui/logo.png.import": "92a4e7a890a5aff72741d1e6e0f83871d6b39866d3e9578d03d8a91346020baf",
    "assets/template/game/ui/paper_panel_s.png.import": "166a68ff0dab4cde1bde34e3bcc97146d9ca148bcf79c39cf205615bbae10416",
    "assets/template/game/ui/sticky_note_s.png.import": "04f8c727f89686f3b3c94efea8d745803dcf2025fe1202c3e954158594f4c06c",
    "assets/template/game/units/civ_girl.png.import": "96878f57d92b878593ae82641fe6f19ebe3f986e1ba952cb34fbeedb3630df2c",
    "assets/template/game/units/civ_janitor.png.import": "1f89cee630a97da5f8a5a2a230f91a554353e4604714a0ad60d404515f7076a3",
    "assets/template/game/units/civ_student.png.import": "36e0ee87677c746490aed0dea846cab650caf60a392836a021dfcf4781f2b22c",
    "assets/template/game/units/enemy_blaster.png.import": "85946b3f541021840adf4fab0ca596365b0a0b9ac23b4666597c8c195ca4416c",
    "assets/template/game/units/enemy_brute.png.import": "66b86ee9df9843c3898af852352b2c526cecf739fac9f41e80624ae267311596",
    "assets/template/game/units/enemy_goon.png.import": "ca46ed9cd510e1e81eae4ab7a78bda9566926f66bcabb8ffa75d0b4ad91d3273",
    "assets/template/game/units/enemy_mech.png.import": "9f51fca930093210218949e25e347f075d574063a6e853bbbb02b7f3341b6d02",
    "assets/template/game/units/hero_blaze.png.import": "e45953f3c64c02e98fb3fb3fc9cead2d408d2fcf589880afc9f389fd5e89d13d",
    "assets/template/game/units/hero_frost.png.import": "7676b1afe231bc2e614ea3640614026c1ea4ed1070960ceaa85511d74dd651d1",
    "assets/template/game/units/hero_monitor.png.import": "25dd980229e7c52453a5dd25f2d0351234bc9a0341fb94271d997635d1d41eda",
    "assets/template/game/units/hero_psi.png.import": "8d885ed3791891b84eca17c15e923b93ecd7c492fca7b308867c7d634a1a8e2d",
    "assets/template/game/units/hero_stretch.png.import": "95df7a16d8b095333f105675c89e3d0dbf989171b49737689ca6fd03297e8fea",
    "assets/template/runtime/audio/sfx/attack_magic.ogg.import": "1bf4dc1844c13ef7fff9156cf79a5ae87de060b974e011e5578d38a297f5205b",
    "assets/template/runtime/audio/sfx/attack_ranged.ogg.import": "31052184b9f7822912eb02d553c2746c8d2f34a0f022994b39ed37899711dd28",
    "assets/template/runtime/audio/sfx/impact_damage.ogg.import": "15418661a8c317ea0b9ea69a3ecbd95ed782ec3c2763fa4acbe69438aafd9b55",
    "assets/template/runtime/audio/sfx/objective_secured.ogg.import": "4fd737edbcc31cae0b5eb36f0a4afc38b32130501a93558e817752b9e0d85bc9",
    "assets/template/runtime/audio/sfx/order_attack.ogg.import": "4a37b1707c7b411812e65c6ff1b5f57d1e71dcc05e1b291b34da7121a3fbd919",
    "assets/template/runtime/audio/sfx/order_move.ogg.import": "7b4ad0dc717c6ca76c26c93c7313b3f105e13d351fcf5fb8f8ccd2d714277449",
    "assets/template/runtime/audio/sfx/order_work.ogg.import": "1f8bc8931cce8c5a4e330dc1e468a40cc183db70d29302d445596cc9fa3a86a2",
    "assets/template/runtime/audio/sfx/structure_destroyed.ogg.import": "e6d195fd21cdf64732582f867beebac10d0f36051f25413d61e7986e66c6a190",
    "assets/template/runtime/audio/sfx/ui_cancel.ogg.import": "182b4c8395678449caecbde28458a6fcd5a92f37e05160aa875c338a02666325",
    "assets/template/runtime/audio/sfx/ui_error.ogg.import": "2cfddbc6112ee1e5d58e4f36768c588779213bb829dae40ea6a0754ee930b86e",
    "assets/template/runtime/audio/sfx/unit_death.ogg.import": "e3264ccbcdd97686e449176e1ff728ea8030f7f221b408c6ea979252fc7efc7c",
    "assets/template/runtime/audio/sfx/unit_select.ogg.import": "6d7dfeefcacdc5e87a96ba7af90295cf7e166971d49108ffccc9c73dcabf2e20",
    "assets/template/share/favicon.png.import": "0d4efe67ea9db7dac57d95fda8d1314f6cddbf2064924600901b7d69e9e5b6c7",
    "assets/template/share/og.png.import": "475cb98b6d47b6a55675ff31190c8c9871e76f73ba6f72abcf4719ed6bb529df",
    "assets/template/source/.gdignore": "ae9512354945af8c8e71c8e8fc60823f016145465a74e14b18d843e7d40f66f3",
    "autoload/manus_font_theme.gd": "3241facb331ba5f72126ef9df95abf9b242e6ffc84e52ac5094ebb57b882526c",
    "autoload/manus_font_theme.gd.uid": "d3ed7c0ba4b3a474de7dc2aa3d91f85bb0a69deb894d789d67eedc6d89d20564",
    "config/tweaks/catalog.gd": "bb789272f4201aeb25ae4241e544681e2778436067cc8193984a3818bded8701",
    "config/tweaks/catalog.gd.uid": "6161b13fa445acbb769fe723b45b69d6e0120ebef9ea1949d01f40483d590fad",
    "default_bus_layout.tres": "cd6e1ed747ca623b10b5eb5a83fa45eca8c946f6cb58112eaf7e99ae65059ad4",
    "docs/game-multiplayer.md": "af4dfd273e65ff5a1a547b7fedf5a61e039b0f8305e5415962533313eca3ad68",
    "docs/provenance/ip-remediation-rts-logo.json": "f021087eece7780badf03501407eccf012d5b6a1aac1054ce96f2877f0cee3f5",
    "docs/provenance/ip-remediation-rts-sharing.json": "037adad602b0e01b6b64ce121293d2e906c814564c6afeeecc98ba3fea0caa70",
    "docs/provenance/manus-generated-output-rights.json": "4423a68df087cc39180947025d6b967cc56245003bf304f22c71539c98e69308",
    "docs/provenance/rts61-generation-tool-receipts.json": "e1edd2bc876ecb57f935a528373e52c4587bbd5dfcab0bdd89647db24f3766ab",
    "docs/provenance/rts61-inherited-audio-authoring-evidence.json": "e7ad205c329cfbb419c645b3125d2ec7eaaa713a3035a4083270790b14acb884",
    "docs/provenance/rts61-recovered-generation-evidence.json": "8cfaa30a43663a8d32619f87dafd00aad8d138117561da1c14025b2f29e3eab4",
    "docs/provenance/rts61-selected-transform-actions.json": "3548d54c3ef0b18c751cf72c5917abc340e90833a3e16c5e69853b9fda81990d",
    "docs/provenance/unchanged-font-license-evidence.json": "92bf88367395ce00bc45b8f4f55cc169712535f8601f75c583a0ad871c4055e8",
    "export_presets.cfg": "40cc7d90e2fdb785f8e31a31d57b83991cd226b70ed7bc2e95dc82d5b8b603ae",
    "game-sharing.json": "1dae800a57e67917ae2f3a92407f74e19a6535030c7839b662d8a751ac321775",
    "localization/en-US.json": "1accefb96e9cdb3b4e85ed1848d1b992ac5d2048a595cc0fc43362eff18a4e0b",
    "package.json": "cdb89748a82d5bae02d2b3bdd2c7f464b24269bbfbac1b5b36fa678c8580b126",
    "project.godot": "87760c475f39f8de00948b27593a5956fd44adab19d2c66725ea8e3f026164dc",
    "scenes/main.tscn": "d085197aabfff9215c511acf1fc9d7c402a619ac1404c70399440258a076602f",
    "scripts/audio/audio_director.gd": "2ef8affbcc25d62790a9378bf6f1f84f10b36e3b5f64dec015158ba2ecfff838",
    "scripts/audio/audio_director.gd.uid": "ffca983d582d96b718d0231343eb9bdaeacf127d35b9341b276f0bd83f126d1c",
    "scripts/core/iso_projection.gd": "cabd2006113bf8d79fe3ec99bc04807f34692b9d9e896b2a707c1a720e240c47",
    "scripts/core/iso_projection.gd.uid": "b455d515591ce0faac34c6ecf1a9d34af690fa7239dbcf2c648b2749b5cf40e3",
    "scripts/data/campus_map.gd": "ad28891b963a8acb5004674372d9da8b7417f032be1a8073f4df7c372b240f2c",
    "scripts/data/campus_map.gd.uid": "9d555211bd534a71e93873b08ab8da56c92cf57dd48edea650034e6e26e33ee1",
    "scripts/data/comic_script.gd": "01c70a33cac2c81671a884ae282e3e4b244781d8f7c9598fb960cc04598b1944",
    "scripts/data/comic_script.gd.uid": "6f9bf323699963c5e5735c04db7ae30c956fcc1e28b3f0d79ae56b5651a659ed",
    "scripts/data/hero_catalog.gd": "5adad756b75ff2f3acb3582dc2775ddb967091074bd6400024e6cdfce1db2e35",
    "scripts/data/hero_catalog.gd.uid": "86ea907692da3addc3525258a2eacaaa095720b96e89c7f3683e5a66b941dbae",
    "scripts/data/unit_anim_data.gd": "0d861b6b84ca09499c1c5e6f00b89040610c67611553c18838cdfe1a212e5c07",
    "scripts/data/unit_anim_data.gd.uid": "746514c499f1d57d68583e6e7679b466c79f88a44a50c39a5c9981782437dc83",
    "scripts/main.gd": "4858cd2cb4cea601bc78c885ccc66b944d9eed79676e9f63bffcec6937a16620",
    "scripts/main.gd.uid": "9e3650bf01c160143e600428e28b8adb91b0cbe93fa0c77579c4f3cd4724bac3",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_backend.gd.uid": "802ddf7d33e21629091bb0eb55b8cc92524fac23ef6b3b50da7b07c695adb1b1",
    "scripts/manus/browser_bgm_player.gd": "f71867b01e48604a437eb85cde6d4e9ce4f6eb988fa39328f695f72d8e1f2b91",
    "scripts/manus/browser_bgm_player.gd.uid": "2b576f98374f71709a050fa6cc9e203b0e75a48cff8b5be5f362478a7897c8b0",
    "scripts/manus/game_fonts.gd": "4c5db7b7e38b34626737b6ac82bb71c4dfab2442cb497aaeff3edf82c291e075",
    "scripts/manus/game_fonts.gd.uid": "47d81c753a529065d959e853a79ebb1aea044f774984e342029ccda42527434f",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "e7431d7673f0c78581a108719f2f20d653388fcc4e270affffcfb71ed65c67b4",
    "scripts/manus/preview/tuning_adapter.gd": "39551e9a14fcf16b9459e5846de5c58ec6ac1e39b7da266bd9e9758cca3e1ddc",
    "scripts/manus/preview/tuning_adapter.gd.uid": "48855934654807c78cd96e7d82d8d9a5736df0cd40ead5ad50fc5ab43fe8c1b7",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "2e46135e34280a6ae51d5814bbc0a50f10078611f242c90f03e934d6206fb71e",
    "scripts/services/high_score_store.gd": "cc4289911b20da754146adb1daa574f067a9fa0554179808ecc2bbfa417e792d",
    "scripts/services/high_score_store.gd.uid": "50c1a3440d1e6f22d14943240244402fc0b8539aebc9aca223ac1c48760632e2",
    "scripts/services/localization.gd": "575d8790bfff55cc9ea74d0a9eac97fea2b3a21182da9c82facece66a47975bd",
    "scripts/services/localization.gd.uid": "91dd71a42ce7599e53d3dba100c09ed7abfad23864b80c22d0d0ac499e7eeff0",
    "scripts/sim/invader_ai.gd": "4a150de5b2c557c6708e0e1fee7ef87bd147cdf45570a0e6ba9e66c23edb2f8c",
    "scripts/sim/invader_ai.gd.uid": "e8eb0714b2fa714691dfddd57c1bcda03796c77acd55fb4b30a619abe8071234",
    "scripts/sim/rts_simulation.gd": "babf0dca3abbad196179d75a7209be6a363fa5f2c594b5ddade9dceab0290c2d",
    "scripts/sim/rts_simulation.gd.uid": "67bbcccdaecaf1471a25ed2e5ed84f5341bc1f6a64dd73a73f1d8972ed23dff8",
    "scripts/tuning/tweak_service.gd": "6d1c0cdfaf0283c5d59a6c8522521c39d003f662c09d3ff4e646364f4eb64c28",
    "scripts/tuning/tweak_service.gd.uid": "e41bd9c88ad88996616f4228ed3ea1874f4e16413bc66fa5508c04ad1d0f9b88",
    "scripts/ui/comic_intro.gd": "8f633ea86403306f730b7a8ffbff291fafc0439027da95a0c1bb58eee93b698f",
    "scripts/ui/comic_intro.gd.uid": "fdad99f64751fb27b9d18310141a8df77bc299b655e89645aa43c6beeefb9647",
    "scripts/ui/hero_theme.gd": "7432f7365bc6c1961eb3ee313e84fc8e11061ed1a2cb1cb4032db96b1519b41c",
    "scripts/ui/hero_theme.gd.uid": "16145b466ad56665a391269fa766ed60abf48a329a1a64f3c66ff3d016d367e9",
    "scripts/ui/hud.gd": "5b022880bf8421d4b7522295f59087a86b63aeded7816458df8aff9d7b8d7be0",
    "scripts/ui/hud.gd.uid": "6260547c477d29759156185694869291c9dc6115e0dace55f0ef1ea106516722",
    "scripts/ui/results_screen.gd": "d5c818aa26094e4fb42ddbcbd8a9bbc55fd255304ef8c8fda475ff02c8462ee1",
    "scripts/ui/results_screen.gd.uid": "90b61b37cebe0c265ef941f6b210e3309a1081546eedf439f5d48e4aab3b1ec0",
    "scripts/view/battlefield.gd": "8dd63254a1a0f8b8335d572842ff14a95e3e910edb2ff60984a99907520ebcfe",
    "scripts/view/battlefield.gd.uid": "7b7ea25adb3dbde379827baae9c2ad169b8de53ac38b987e796d5016134d1b3e",
    "scripts/view/campus_minimap.gd": "33111d3ffc6b5ed2341628a619e5ce685b9d15d96bb6b608f979a85498b92435",
    "scripts/view/campus_minimap.gd.uid": "903c234610ea1cdf24d1cd959b30b6508f60d44b30889fbd6195be8b930ab77e",
    "scripts/view/fx_layer.gd": "73fc0274623f8e8afa1c4c079be64ee47645cf24fdfba74856f77ce2054ff34c",
    "scripts/view/fx_layer.gd.uid": "71575c81d9d70a81f352004387d68dd2648b423275646430157349c2d3e4a5e7",
    "scripts/view/unit_animator.gd": "c432bd471b438dcda68d59fe3cb11dfa88f966404e415c3def846796f6ef47be",
    "scripts/view/unit_animator.gd.uid": "59e83e38eb36aa4750c9e1df7123955a043f3ed0d74bad4cd363adf41e0282a8",
    "template-provenance.json": "64097250b1d53be4138402eedd05184e3bbf14e6b994163f3701b5de0f6a0a24",
    "template.json": "6a7f1461dbe430b539c59eecb88a0621db382d5f385a4a35da9c2fff53c29100",
    "tests/ai_capture.gd": "8787a65bf787709e936d5800c684f3d66b2c39b179996e0c9406aa7ce20d62a9",
    "tests/ai_capture.gd.uid": "298f2292af4544d63a555cd506dc52680eeb23bf415f86590cd04bb4f6e5f5d5",
    "tests/anim_capture.gd": "c29491e12564d5d04b7a78353a451fd7e628833e9dbaec92e2e787655187b7b1",
    "tests/anim_capture.gd.uid": "16fb65a48ab6f4b023293cf3f209ab6120b095fe7023a9839b656e9956ee0715",
    "tests/camera_input_test.gd": "eeac4f3e6f9ebffd10c0eb31c747f06b892ed0766d552d368a086f0be39a6a7b",
    "tests/comic_capture.gd": "87d66306ad0a1f30d265fb4f38f3c263c587d5f2069b82c777278e0658b6882b",
    "tests/comic_capture.gd.uid": "a750a6947587f64a51e81d273103718cdc90aed2bbdcd5ae7f28b1864ddc870d",
    "tests/drag_select_probe.gd": "5bec8194851bc9ccdc68848cdcc636afd1f9c3926a51d378a3ca2cb218619d3e",
    "tests/drag_select_probe.gd.uid": "bcc55aa6f74a987d4f3fa445b0fc8acfd67a309c99c01c335f5f393276fd73e8",
    "tests/simulation_test.gd": "19ea2fc01da3762ba91bc2b8d32b5e14b8d454a5275633b8c6222bf4fc69a951",
    "tests/simulation_test.gd.uid": "582c3f8541b688618ace7fcb8bf36857e387c4ccdc437fab1fe5fbdb0f884add",
    "tests/ui_flow_test.gd": "e37ee68f80ab3439b51252ec79d6794b23fa5710bfaabfb795acf98bad7d6af6",
    "tests/visual_capture.gd": "8bfe90d68dcb9955aaaf7ac33bdd06fe17cae257a9180d6cd45512df16f1f8ce",
    "tests/visual_capture.gd.uid": "1cbdd04c92a1154cc789a6ed116e67ee20d316dbfd0acb00e05dfc74ba2bdaf8",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "tools/run_tests.sh": "651fad4d386b46882805a8ed0d43568442e6e5838c54d1832b7250c6f4fa315f",
    "tools/validate_template.sh": "b4191bcb74424e5d8e5d2dbb42f045d6b3205da9e328132f87d576a82b546934",
    "web/loader-cjk.json": "cd50bcd0fe25528ae3fe6f8e416b2f29f73b17bd2065ad7a83f334b9db52002b",
    "web/loading.html": "5834f3bd44a79a7c463117bfab1dadbdbecdac92674449aeff9c0254ea21c14f"
  }
};
// shared/gameStarterFiles.game-trading-card-v56.json
var gameStarterFiles_game_trading_card_v56_default = {
  id: "game-trading-card-v56",
  files: {
    ".gitignore": "20ed630eb7f16f30853cff88f8e277c8ca47c9dce40f2ce731df3840898b0830",
    ".manus-game-template.json": "7305d8f44d69d77efa00099a019c8abffea3d484e4a17b18f7777d7afc64be29",
    "README.md": "4e8d40eaea233ccc4e5b9218dbd39668e42f08ef0c285b1d42a973caf723769a",
    "THIRD_PARTY_NOTICES.md": "a9ede97b59dd51d8c19d646399f9d8bffddb99b30dc620cfe11ffd98b97f796b",
    "asset-provenance.json": "789099640f0c8e24b05e53ced51e193fea5bc77d4431b2fcfe0f7ebb318d1bc0",
    "assets.lock.json": "0b289e9fa9b76444936ba6281d0f75347bfdb4f990b29d1681d5a28a1c9f50f1",
    "assets/template/cardgame/banquet_tyrant.webp.import": "c7299b02c57327b6ba14828767ea1f3258dea11ecd583faa657fed1e563f99c8",
    "assets/template/cardgame/battle_board.webp.import": "1e90b102fe038a626866f96edfa91c6fab1ce7aa9aa0b96099c609ed690d4f5e",
    "assets/template/cardgame/bell_of_the_last_service.png.import": "d37123fdd1e2d270903369b0f89e5fbdaa54ca355419c28801093246b83cb920",
    "assets/template/cardgame/braised_bulwark.webp.import": "67aef6cf05b6942cff93c0db00da55a0e2cb295999e79714d29c69dcbb9ba20a",
    "assets/template/cardgame/broth_elemental.webp.import": "4d3db33c43b98e01cf31b564764c547d1367dcb22cfa855e535d9a0e270a680f",
    "assets/template/cardgame/card_back.webp.import": "7d28aa193dd886bccd25f928b92106f46f56d82a9fa346db3625239e5b225537",
    "assets/template/cardgame/cellar_rat.webp.import": "68f9255c1051b45bbf2cb903c11adf083185aa83e32043898ae9268b256e04b8",
    "assets/template/cardgame/chef_sama.webp.import": "1f939d76c0336194eb45ab446b4cdc4a35873c716b05e5c54f6592c6e1ef4039",
    "assets/template/cardgame/coal_squire.webp.import": "36c2d3bb959675ac448d7d3233b3d9961028375ecff8abbc51cd7f405ecee7a1",
    "assets/template/cardgame/cursed_onion.webp.import": "621a831e4b79ee7acf0f4fc41a51edbac565277bb0995ad68cc0b5dae97cac4c",
    "assets/template/cardgame/cursors/attack.png.import": "238bc06e247cc75244278a4a03c1f37c968992371729a679a382d69270c9d8cd",
    "assets/template/cardgame/cursors/blocked.png.import": "fdce90c5d61c193137464a6d368607d4088f1a4bc17d22a16f4d7b961dd5db48",
    "assets/template/cardgame/cursors/cook.png.import": "cb8a17c17a829450ce7511acaefb1058bfa41717cd5732b413da022d69c16fb1",
    "assets/template/cardgame/cursors/default.png.import": "bd8a23c44c2e9c6ae3213626b91d23d1b4ef4117817ad8a754e5305492063f90",
    "assets/template/cardgame/cursors/grab.png.import": "5388d42b4ab7bf552fa67b581ca9bcf4893f81cd8f51ff702ab33f081142075b",
    "assets/template/cardgame/cursors/grabbing.png.import": "81761adc2ebb0c2a5a3e927b1af19dd3082e62f51b38d88cfada6633b34281ba",
    "assets/template/cardgame/cursors/inspect.png.import": "761230a6c5b5f9fa4cee69828f464765f69b93644abd08a8171c24261cc863ad",
    "assets/template/cardgame/cursors/interact.png.import": "328b640145655de6dc9a2aa275bdec8d421fdd1c4bb46fe5856fd4c71c76cbb6",
    "assets/template/cardgame/cursors/route.png.import": "057ae2f20f975400799bdf04a3096c807f5666993cfd727ceb77c851635b77f6",
    "assets/template/cardgame/cursors/serve.png.import": "c7efedb5dd36ca2663c65926747172e50739ec7bcd52ac4530722202ff50a276",
    "assets/template/cardgame/cursors/support.png.import": "34eec27d7a77489a9e26ae8a0cb002379d876d94e297783e9411cece6ca91520",
    "assets/template/cardgame/cursors/wait.png.import": "adb2b00f93708f9f5c571ca125b280832f1e4b8a5a68907f1030783b6aca7546",
    "assets/template/cardgame/dough_golem.webp.import": "4e1e494a4793f6fe7111e94a6aabeaa44d2fec4b0341ce930ad484ef7b7710aa",
    "assets/template/cardgame/dragonpepper_roast.webp.import": "a5f23c5db888af8624c907cfe8eae9499c17b93029eac15a6388ed1136d611a4",
    "assets/template/cardgame/ember_butcher.webp.import": "d65cdbd4eb92ad5bbfb3a6efeb5bb43cfc02e5300796bddae6a8bccf1f5d5037",
    "assets/template/cardgame/gravy_specter.webp.import": "4799804a18eb87a7cfa6cd967e6766d1ee39d5b1834006f1ab09207f8585e524",
    "assets/template/cardgame/icon_shield.webp.import": "7244e0b0019e88027a6773c263114278cdd29b901d3b15ed7acbfb2220683261",
    "assets/template/cardgame/icon_sword.webp.import": "b2d4224be480b94ff4ac02696ccf62cbbc9217b8205588eafafd0f9c59185b19",
    "assets/template/cardgame/ingredient_ember.png.import": "90d5ef1f6823e7a599f54c853ff3cc75fcfeeb9a197e002b118a511d29839786",
    "assets/template/cardgame/ingredient_fungus.png.import": "421c29b2678620528e7e2f93c05a5eff3a056d94d29a8594a6dac91f514b980f",
    "assets/template/cardgame/ingredient_herb.png.import": "36b2bf32ddbe1330c5fa073c12ac66f218b22d7baa13fe7d4be71339ae3f8e2d",
    "assets/template/cardgame/ingredient_meat.png.import": "11751de832af7af80b19d041e10c1069b3fd2eda40a82bf360030b8df5cd69ba",
    "assets/template/cardgame/juice/armor_pan.png.import": "cb37db92dd83187590bda4e6bc87d133408af2330b041aa0e1b457aff88b45fd",
    "assets/template/cardgame/juice/card_back.png.import": "d71ea664e35f6d023c0d858d531f8049e41662bb805620ad848d75f90b86f3a5",
    "assets/template/cardgame/juice/cooking_cauldron.png.import": "c2bcd8767dde34aaa32614c5501df2f8f40361e7467b3dee3617c12c8a049f95",
    "assets/template/cardgame/juice/encounter_seal.png.import": "537d13e9c316d2d9516bf2df1bd53686e39b17e3dd22d2fb0363e2bef3a6e790",
    "assets/template/cardgame/juice/mana_burner.png.import": "64f5cac410ed5f95aa3f554baada168d011cf96f52aed2eddb2e5babd44a3a1e",
    "assets/template/cardgame/juice/pantry_jar.png.import": "7debd69e1381dac7c56188960578cbea45d9163cbd45ea4fcaf5dd28dbfb88a2",
    "assets/template/cardgame/juice/selection_knife.png.import": "b7fafdd0aaf24baf7cbbc2397d492986f764fb3cd15dd6c3d1edf9430364ab37",
    "assets/template/cardgame/kitchen_break.webp.import": "b2f793606557b2d2629eaa8335727fed687fb93759262f8cd1613312741df713",
    "assets/template/cardgame/kitchen_guard.webp.import": "9ecf4277a3ddad5c0986fe8b99ab45a346951a4d005f6746c1e69d6db494f0f5",
    "assets/template/cardgame/layout/deck_cradle.png.import": "3b1a9487ece9b4396c6a56e2dca60b085c3b833b3659e685b5aededc7fa4c82c",
    "assets/template/cardgame/layout/end_turn_frame.png.import": "14e8874665e3ef1428c2e6f12c9d4f1903fa574c2b2aa45cd18d676bc9f2df5d",
    "assets/template/cardgame/layout/hero_station_frame.png.import": "98a34e29f334dcd94ecc713608fa889ea2e8f554cb26e48fbaf60a07454a637b",
    "assets/template/cardgame/layout/history_ticket_frame.png.import": "e53e97301e2bcb4450cf0c27f0e5b7f83767564f7466823d07f6b486492b8745",
    "assets/template/cardgame/layout/mana_rack_frame.png.import": "065040538b37636ae31943b8b00398e48a4ca9e906071a9e2c71800c642d307b",
    "assets/template/cardgame/layout/pantry_tray_frame.png.import": "a6eb53b019702155a7fbcb430a09fd443717abb07370bbaa892223c82bbb1222",
    "assets/template/cardgame/layout/passive_medallion_frame.png.import": "4e7bfaa07de1ddbecd458f2f885ea717e91c0f9443ebdb8a6e08598b0ab2d12c",
    "assets/template/cardgame/layout/turn_marker.png.import": "0c7a452682d83f6c9ef900d1798da46eb6816fe5271ee7dbc701d796806f9bc9",
    "assets/template/cardgame/layout/unit_plate_frame.png.import": "2bddacf5ba027d57eac3aa6dfe106a9866841b018c3fe1b4bd3117899b652de1",
    "assets/template/cardgame/leaderboard_crest.png.import": "d00cdd71c0be68387031b7004aa95ffdeae4c4a879e4781ad91a14db6429e9e0",
    "assets/template/cardgame/leftover_stew.webp.import": "fd05177a645eb13614cb4dc5e2f564d068ac14538f78758b31d21d57b35ca8b0",
    "assets/template/cardgame/loading/emberpan-loading.png.import": "712dc01e68a16c1b7d67e28942cce4fd2d70f4b2e1ccf80252fe8f318f47946e",
    "assets/template/cardgame/meat_mimic.webp.import": "33aa8774d07b80112ac4fcbde1a5a65219d8e999d0092508399439865bbb77c5",
    "assets/template/cardgame/mise_en_place.webp.import": "1cd6b6be77c5b0fca06b51c55eb6062647e2b0f98b7ca5758060847cd157bb39",
    "assets/template/cardgame/mise_the_thousand_handed.png.import": "bcadd0f12d92eaf9bf75ae578c43774456cdfa0ee42f4691892fc452373f55d3",
    "assets/template/cardgame/mold_monarch.webp.import": "9c04d83be7eb7b27116bbd37665b60e43666c78a6c84bfae2cc5c0bdf36a6f62",
    "assets/template/cardgame/moldling.webp.import": "771b33071a7781066c0d1d97b7c088b5c18b3d5e74947577fca782d4d1de54b4",
    "assets/template/cardgame/mooncap_broth.webp.import": "ac6fe322ab99c5397780a2d26bf42b80fe8c310622460749e8da5161fedbf58d",
    "assets/template/cardgame/music/emberpan_midnight_service.wav.import": "0e6f92def497e2d85a08276a9dd71e669af9d7d64ebab976a111fe279faf0d0c",
    "assets/template/cardgame/pan_paladin.webp.import": "15b257058422ef23e1cbc853113b9daf71236b554887bcaf2f9039501e9d776b",
    "assets/template/cardgame/pepper_mage.webp.import": "e3b25e8bad1dcc119b298f6fc38f139f93a5b803eed938afe896c69a39aee5a8",
    "assets/template/cardgame/pickle_imp.webp.import": "d3a46127707ccb4c78e8177d8e52a76fde472a907187944c812e446f9e707681",
    "assets/template/cardgame/picklemancer.webp.import": "bd7b1083a70a1e15e6fbeb327153efbfdfe82a58e902f3ca1f6e22eaab6b86fc",
    "assets/template/cardgame/precise_chop.webp.import": "5b9550b13d7131a2ac6032e7443c2fcffc933243f5800aec30a56240b669f168",
    "assets/template/cardgame/searing_arc.webp.import": "35295c03f00dca23751a763a6e269162d6903af3283edf63c8f5e58ed7260f20",
    "assets/template/cardgame/seasoned_strike.webp.import": "eb12006e4f997a12ac5224b70847c16412a84dd1452bfc60bb2a285f1a1dab80",
    "assets/template/cardgame/sfx/armor.wav.import": "0d3ba9821b378ca6b31c57b679f42844eed1ef11070551ebbfefa8d51fb69730",
    "assets/template/cardgame/sfx/blade.wav.import": "5373f71cc35d44b8f8289575c99aa2b2d86dc9736e5c4d7b35fa84c93a519eac",
    "assets/template/cardgame/sfx/boss.wav.import": "92fb4778132c18bdc7161af73db6950208655c0e38a78c3a79c0cece904b6ff5",
    "assets/template/cardgame/sfx/broth.wav.import": "276276599469f3091cafa57a0a12f923d73fe1b1092f5243fb073ffc29ea8d65",
    "assets/template/cardgame/sfx/buff.wav.import": "f9482facae20e1289ae937f6a18ea8d89518654bfe706eebb8b3e0b3942d4c8c",
    "assets/template/cardgame/sfx/character_attack.wav.import": "68e14a835e8c8c327f7a87a809e8fc21b491806876bcce7f1228cc3353bee7f8",
    "assets/template/cardgame/sfx/click.wav.import": "4c5bc037cd1255e95316b328611d1aaf1f3e92049b5c9d0e8c687903e3950282",
    "assets/template/cardgame/sfx/cook.wav.import": "c7ddb56386b5b4fa9c4b93168040a869110fb29673044c04b67c988759c6a881",
    "assets/template/cardgame/sfx/defeat.wav.import": "884e03dbb38ab4a7396390d757fb4160048f33ff265770ee3b710e916c6a3aec",
    "assets/template/cardgame/sfx/draw.wav.import": "4011b47160952b7fff960520458dc49dcc90150a73665b6556b24d57ce585b36",
    "assets/template/cardgame/sfx/fire.wav.import": "5e59acb24573f913dad6ec29d3729ebda5a5bc7d103895c41aa7557e0fd66f98",
    "assets/template/cardgame/sfx/fungus.wav.import": "e29272df2228a646f0b57a7f10a44460246b328bb4de44b4a2dde3ad5e49a807",
    "assets/template/cardgame/sfx/heal.wav.import": "78f7562dd1c43697d54989beaaea1f2f6df2cb28864c231c9c8dbf3bd70bef66",
    "assets/template/cardgame/sfx/heavy.wav.import": "345a435c90faf17297807501ff722554128c15c507368adc8e4d2d08916c5965",
    "assets/template/cardgame/sfx/hit.wav.import": "c2c399fee126a7324304a03eb6da7ea335c1ac4d8e78d06b127b079e4f090f71",
    "assets/template/cardgame/sfx/hover.wav.import": "066070c99c8cc94a7f1b5176ffa9d9a40fec4ac6fd6d21c6e92a9ffb85ea42c4",
    "assets/template/cardgame/sfx/invalid.wav.import": "52fc843df58667a79700ec40ed051df06d064800c823310f8d8d1803eced02a1",
    "assets/template/cardgame/sfx/material.wav.import": "35feef70a036659b16cb586250e564d88529eb1a82d324ac24a8f609d7eab98a",
    "assets/template/cardgame/sfx/meat.wav.import": "98d30b07acdf1b2d04c5aec767f603dd6a1465006bdd419bad55df804a5455a9",
    "assets/template/cardgame/sfx/overkill.wav.import": "5441e47fb94f8fd04b162d21c03efda16b37d35add8f37dac8bb3987fd1366ae",
    "assets/template/cardgame/sfx/play.wav.import": "cf093f2cad37a44c7f73e0a6d359d98794154db0c74b8bf7c54176de7940a0f3",
    "assets/template/cardgame/sfx/precise.wav.import": "9af7883b5c8263294363dceb4c6f0c4306191a1927b188869228d77f8a4ef9a4",
    "assets/template/cardgame/sfx/summon.wav.import": "c5c0c10e151287a6d094b6610f8b9e6f540e0541eb4981b17e2817cdcead7657",
    "assets/template/cardgame/sfx/technique_attack.wav.import": "e7cbdf068d26b764f516566124c3618c81603397f74dc643ef94a02f88931fed",
    "assets/template/cardgame/sfx/technique_buff.wav.import": "51ad1ad3df8eef833a36a3fcce8d4659c7e21970f94c31757a4c23230950caf3",
    "assets/template/cardgame/sfx/turn.wav.import": "55bb979bfd105ec75afe36d13fc7cd1adaa20ace836cc85105d0617a24b8c99c",
    "assets/template/cardgame/sfx/victory.wav.import": "0a3292e866ba092f79e2b071c3bd41e06ae6f758199a51f5cc5e648e67dda0cb",
    "assets/template/cardgame/sfx/voice.wav.import": "c2aaac98a5a9951e87a030d7ec0968309bc6f89c722752d8039c7faaa2a532ae",
    "assets/template/cardgame/the_sovereign_cleaver.png.import": "70f24c769992e38a4c51f79a8be3c22d9cb34873747c5704d782590690367623",
    "assets/template/cardgame/title_kitchen.webp.import": "59169b4e3d45b777d54764279cc0418b2a4037c3f2f062baab702a0ec680b9ad",
    "assets/template/cardgame/truffle_knight.webp.import": "9c6d24ed71f5715b26cd4f63be16b418019c06c17e0d46d7dff811727bf556ed",
    "assets/template/cardgame/tutorial/mise_guide.png.import": "637511eab99d2b8e52660771cea7b12312aabb8f6091f057e88773741cea3e5f",
    "assets/template/cardgame/tutorial/spoon_pointer.png.import": "c5a4f4deec75d1453cdd8bbc85e1e23888534f1e02627005cf54f4b50d0fc7f3",
    "assets/template/cardgame/voiceovers/legendary_summon.wav.import": "f8dd27b582d4c75f6124a1d10159a4415dec36003d1e655ab1b2393034c2494a",
    "assets/template/fonts/Figtree-OFL.txt": "140d37233e7f3ce7313798befa9600893bcceaf41a55fa0fa5ad52f7f657a268",
    "assets/template/fonts/Figtree-VF.subset.woff2.import": "9ad4eadb771c258796b43556c1d364d238d53184aac9d9d953fba28f5d6fd97c",
    "assets/template/fonts/ManusCC0-Bold.woff2.import": "5a72b2b63a23448521d31997e1332ef11926c300afa37131ed18b1a8ddd8828f",
    "assets/template/fonts/ManusCC0-CC0.txt": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "57ecc2d64c77a81c7bf7fbf741f214f6dfddfad6351522620bf72f38358bf48b",
    "assets/template/fonts/SOURCES.md": "77fcec89daaa552f112de80aa2e3eb3e12b976b41d7cb0685cb75731242fa6d3",
    "assets/template/fonts/display/Cinzel-OFL.txt": "f2b3029aba64c378bf0963b62945eee15e564fe4330b934c8f2eb058282b5e83",
    "assets/template/fonts/display/Cinzel-VF.subset.woff2.import": "4d7a26206387736e780d05d8841a1dc06b2d611affcdcc39b5e10e1dd0639755",
    "assets/template/fonts/display/NotoSerifSC-OFL.txt": "5e0da210fb04058a8c0087985d2d456b931c2579811a49655721d3cf0c36b6d6",
    "assets/template/fonts/display/NotoSerifSC-VF.subset.woff2.import": "81aef583f73fa1219e38f80761e05fa3488af265e49809b71c8f388ea4034839",
    "assets/template/fonts/display/card_button.tres": "9738db6632fd2d5a65c2764d30dd2c82df84a484eaa53e9e2bf8d051260d2c97",
    "assets/template/fonts/display/card_heading.tres": "38c27575dc3e70554b50cc6a213323313f7f90fc70ae9a994ff93ec215b6c21a",
    "assets/template/fonts/display/card_name.tres": "af7cfc04f761c3ba48d87853bc887abe0c418b6e3563abb7304ff992666a747a",
    "assets/template/fonts/display/card_number.tres": "444246816582cb43f60a0f7bb94428931efb9a492eb17c32c3ac22b1c79dc018",
    "assets/template/fonts/display/card_title.tres": "a8c272be58cd68f2bf82b9e622a6fdf2f39be64ce128ec4e94205065dd5f701c",
    "assets/template/fonts/display/noto_serif_sc_bold.tres": "1ae2a95c600978481e00d5dfc0635b8351d27ce011eea076301098aa04798466",
    "assets/template/fonts/display/noto_serif_sc_heavy.tres": "9693a0266baf994d6f1c32162530c7b56eeeddc3f16f79d67ab552830241c091",
    "assets/template/fonts/noto_sans_sc_bold.tres": "2748a300dd2c9a0e9e9dc74cde49d19610d03c10e5dd51bdb1d3eb8701d5dfcd",
    "assets/template/fonts/noto_sans_sc_medium.tres": "cc759235d56f7aae4300f538c7e07e718fc8bf40f58f0d71b942c1a6c65bb0e9",
    "assets/template/fonts/noto_sans_sc_regular.tres": "ee92c642b35787241dd23ad5163c1ddf54299144412aa55b493ea1ea142d7553",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "8daed3eac7cb8300aedaa27c5f871bb063316cc57939dadb1e9f010aba771d6a",
    "assets/template/fonts/ui_medium.tres": "a5c5ed76c76e3e6b920ca52fe84e91f673ad4c491e8d85ee2c937c40ac8c16c2",
    "assets/template/fonts/ui_regular.tres": "083e03f9a038af63c0e47f1783b1df3082cf21d62c34d995de82d6980e12414e",
    "assets/template/ui/loading-background.png": "b1cdf51b30251bb656540ed63098d45e9063325ead7585ed5afbbc78db2c7a11",
    "assets/template/ui/loading-background.png.import": "490e5cc7db2950891c72db099f6d17e44e8957303b27aaa501f0c9adaa7b0c89",
    "autoload/manus_font_theme.gd": "3dcba5d89c142df7424ef1b83133ba52292552ce48288aa2c575b85873a4ffd9",
    "default_bus_layout.tres": "92560ab1088e0d726f48b1e190b373b201e91112e6229783d19ba0149f1e8a2b",
    "docs/game-multiplayer.md": "af4dfd273e65ff5a1a547b7fedf5a61e039b0f8305e5415962533313eca3ad68",
    "docs/loading-art-provenance.json": "0c88a68f43d44657bbca217d73a007c7f352ba53ff3651e9e2510e39b956b8e4",
    "docs/provenance/fonts/manus-cc0-ui-sans/DESIGN.md": "29120cc83c074b2956f06dedaba405d4984cdd18194b6a36b7605205083c6e09",
    "docs/provenance/fonts/manus-cc0-ui-sans/LICENSE": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "docs/provenance/fonts/manus-cc0-ui-sans/README.md": "73d722b538968f0429ccdc86e8c3d779d801265b78a01b5d88f1bd0e72c9cae5",
    "docs/provenance/fonts/replacement-fonts.json": "97373f615495a7ade50dc82d69578758fa5ffed3b551b45c275c711dc4f235b6",
    "docs/provenance/historical-font-licenses/CinzelDecorative-OFL.txt": "1e5d6660366ddcfca4f2fc10e2acfba9fa4d97d40aec80d7dbfd41d730a420ae",
    "docs/provenance/historical-font-licenses/LilitaOne-OFL.txt": "255d5debbb80eb2ea762644311f266a279e8778f00156655a516e2b7781a63e1",
    "docs/provenance/historical-font-licenses/index.json": "3c93e78487721d8fe831394f5b0e4b5b386a3d5b83a880ef65ec049124883533",
    "export_presets.cfg": "3a94d92b784c2d89e5a96ceea943fc74220c5d6f4b73e6802eb40edc2e97813a",
    "localization/en.json": "332b790c81134bf75347f99cc0d08c1787ac0c8b56bbe6989502daa52d9e7ddc",
    "localization/zh-CN.json": "382f71f0cf20c4628904750b5224519bee7bd3a86826183243fa662696c18af2",
    "multiplayer/README.md": "a34b6deaf3decf580ece0bb261bcc31ba2f1f9c2c4acd5b115132e90bf128053",
    "multiplayer/cards.json": "c6220c682482f628ac5e4e3205d91dbb53cc2e9fb24fca77182b361412ac4c9a",
    "multiplayer/client.js": "a6e89407ed3cae6370475649fe8d741a8d868e135df68461221881783a03138b",
    "multiplayer/config.json": "a6ba26918ddf413f568a77c36d500e2d1c7ba08a1f6d0009d2dbbaf835c89c6a",
    "multiplayer/rules.js": "9f34b23e302c0d687339d21ae3161e896cfd01297510f69c3505a56a43921cb6",
    "package.json": "65a2c0756ed2ec9d87a3f5025469522516adfb11e6f1e4fe15bf37b2082cde13",
    "project.godot": "a2fd4e96124ab4ceb93f07d5765cff564e915615aeaeafc74da73d27f9077dec",
    "scenes/boot.tscn": "1d84000cee6e80f6b81b459353a3c0e9ae89043ffe612446e40f603fd9825665",
    "scenes/card_game.tscn": "c39b87760fb1cc54983fce056594754c8dd325e81d90f0e79e41bbdbeb69b362",
    "scenes/multiplayer.tscn": "8b0ec587fc2412e87402af2e50ac767ae9abe233218a3bcd71cbaeda4a55aa2b",
    "scripts/atomic_json_file.gd": "2d0d09cfd9d72abf8eda00398e188f12cdf91ea6c1a3de748f23056cf757399c",
    "scripts/atomic_json_file.gd.uid": "d410979f3d52cacf2f04f4c49560f97b3b5688b0357009b063681429aed142b8",
    "scripts/battle_layout.gd": "d2b43a8ae6a5f81a78fe7794aa180117e8012a35c5d751fcf97154a4bd2209a0",
    "scripts/battle_layout.gd.uid": "719a110c5b4ee764321fef8c8d4c7cb1d610795cf23bbf192bed0968c1669b69",
    "scripts/boot.gd": "222e70e8c5cfab906195439c23c270d6939d7377f8c4f1c3a425594a2ea7bc9f",
    "scripts/boot.gd.uid": "ffaa2770a581c95f8bf7f8a0fae0f3dd646b2d8b3f835a4ef18149cd57be9654",
    "scripts/card_battle_juice_profiles.gd": "d9ad5e4bb121d3613ed23130dada944c3be27ce98af144f73d09f2cff9349450",
    "scripts/card_battle_juice_profiles.gd.uid": "9a491bd7bc7774a99e3c1a6e2f23f8ea5c8a124f1e950dec8b2ee90e9917eec1",
    "scripts/card_crack_overlay.gd": "5edf6e2e668ab900ae18d4c4fa2ca61dcf1eae70a0ab4968f5841fdba1fbf841",
    "scripts/card_crack_overlay.gd.uid": "c87beb179d824f59c118f3112b3bbd3e61c78965b6a978ed76cf833153c92dc8",
    "scripts/card_database.gd": "2e9d8822a6751565c28dc5256099b904f62d7a7879342bfb642dde95ccdc0562",
    "scripts/card_database.gd.uid": "89869e2c51d55ece701111559183a42e520a982496a2d6a92697ecba39662a90",
    "scripts/card_game.gd": "311819bac832368e46fcb54c04216462651c833ba0cc951eb7912f0197614d42",
    "scripts/card_game.gd.uid": "da5eae1d508881df0c03fe455dc06a4195d7043678f89bd4a798e89aa2e7e714",
    "scripts/cursor_director.gd": "6046c70d1ab10667397c97e949176bacd61bb628f3749432f5429fde3ec89e97",
    "scripts/cursor_director.gd.uid": "4f64adfc6c19f7f997dbbce0a0af0a1666a91d4d020d2acb524f00f95f9084b6",
    "scripts/generate_multiplayer_cards.mjs": "8961e106c7bba1ff6d233e0dd48be798936a991ad0324390161e4a4bb9c6acb6",
    "scripts/juice_director.gd": "30f579181741acf90eaf42a26666f76a3cb46cc832046da35ff87b48f8728a89",
    "scripts/juice_director.gd.uid": "9ec68893222ac7535e9a1232e7c5a187647132bcf236e8124adb2b1dd916df72",
    "scripts/juice_target_line.gd": "88208538ab3c1aa39e3a37bfd7ef7ca3b63639100969512915f88692205c5608",
    "scripts/juice_target_line.gd.uid": "e62d896e489a0e57543abb9e715e7205c20fb9ac9219cfd514d2cc26f59ce886",
    "scripts/leaderboard_client.gd": "d91388a063104973f7b9809711f3bbf62f11c1af3eb9e9e94645b8f24be3bce6",
    "scripts/leaderboard_client.gd.uid": "50cd6211493b1339adac3881b650aa24bf53d10d3d173ecda215e4180858400f",
    "scripts/localization.gd": "6fa3b7c7e8cde20d90e6407ab7bb12a7ffe4caa72f92fce14a4bdd3a3ad7bfc8",
    "scripts/localization.gd.uid": "06ad4db34fd93ca5bb53e26540d6b0d162fd8d3f8d7cd6aa93ee263fccd28bed",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_player.gd": "3dfbe63c26ce47cd41a1c50c94ad1bc51eb99a3daf494cec3aa81d123865de5f",
    "scripts/manus/game_fonts.gd": "4caa03203a41648264ed94849596360992773949b233b02b4e2c77738ee4809a",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "dc3ace455f22a7c1e87a67a33aca3ad6531909ee0381d6c0c0dc47eca328be9c",
    "scripts/manus/preview/tuning_adapter.gd": "6be0960a593a5f8601c7665faf3bcb2b348366ec53b39bdac150e4807dac5870",
    "scripts/manus/preview/tuning_adapter.gd.uid": "bd56c0793cbd2b28216a5152ab8801cc1edbd497a674d83ec5a5d54a7b3be401",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "e65dd1b45a42ce0c7f04c3f28760443538aab26b5136d3ffb85a75c28adacfad",
    "scripts/multiplayer.gd": "38ec0c251b1626fcd86f6005404a34d894640c3de1ed84f3f9d27b83114fef68",
    "scripts/multiplayer.gd.uid": "db890cb7ed2f3bb87ce8e379b0ebb3e76aa92801374063b2a63d1bbd1ebce117",
    "scripts/multiplayer_native_client.gd": "49e7260967a3b9bf27b8d75c1620f086262ce841ca9c4f979ea634c60eeee46e",
    "scripts/multiplayer_native_client.gd.uid": "81c72da6a410d53e757d34763b4e6d59b3baa6372985f0208734949a2f5cf8c7",
    "scripts/pause_input_router.gd": "286a68a11ed583ca5fbf966699f5f6bfdf12fe31d7268f663f549a0bf7c6d217",
    "scripts/pause_input_router.gd.uid": "32d037e6b20e57a96b139df9637bf7f237929fbbcf101410e4f5c0dc6b31b0f2",
    "scripts/runtime_tweak_controls.gd": "cb99ae62bbfe76ba18e91ae606b3db868705874f21a0d1e50cc412738954e3e8",
    "scripts/runtime_tweak_controls.gd.uid": "b0c6a4e8b22a9537575f60ea1b1ba041c818e1631638dbb584a982612d29be41",
    "scripts/sleep_particle_emitter.gd": "bd0f4b4a53d670efdf0102bf544faed5b7a99dbfbd447aac304cf40caed0c8d8",
    "scripts/sleep_particle_emitter.gd.uid": "7c426e258cd25287be812489b805f4667a022c8446b4aa267a34217dc86c891e",
    "scripts/smoke_test.gd": "9ac455219cf94ec3864ac98505250d0feb16c9ce322accfceb0821b15ebd5a95",
    "scripts/smoke_test.gd.uid": "52c1818332dc2d41945572a883ca5269a0441e5949ab434fd6c229776a2cb016",
    "scripts/tavern_ui.gd": "d24abd60683067b78135c6329c7d0bb0c4e51b48d8cf608aa3ed8fe34bf74617",
    "scripts/tavern_ui.gd.uid": "ee71cb4bed88c773d553e14230078d953eaf1fadd05715672d5c2ca599d3615b",
    "scripts/tutorial_callout.gd": "5fd39c88e7af09f474a3b9eaad3f734e26be31f640de5ecd481a0d1bd41628f2",
    "scripts/tutorial_callout.gd.uid": "cd357fbfc2c3cc2cee6585529710f577f4f82757db63bc82d64c2a8083df328e",
    "template-provenance.json": "25243e2acd0b364be76f25388283cf972348807ac42ec2e26174408dca8069fd",
    "template.json": "c31c83614e726571e0ee0d804f2aafaef3fb68098876ad22d976eba6773f72ad",
    "test/atomic_json_file_test.gd": "94baf3b079c874debd809730ae2bcea7c603e993d75692c62581f0437471366d",
    "test/atomic_json_file_test.gd.uid": "733bcbe9dfeafd09fe6c68591bea59ed49c079636da50486c1e5190ccc9008f8",
    "test/battle_layout_test.gd": "dee2bbe89dd4d9b8d6a6ced24f79abd4419b3e8da94dfd3243834a960d753e87",
    "test/battle_layout_test.gd.uid": "1c571964192f7b546668c1b084fc4338e12bfb43bd3a27bf1aa7888fbba3497f",
    "test/boot_loading_test.gd": "cdcc536945bab90dcb4eb02e59e9fbc3b48bc628a5be82526e2b76d9d73ce03c",
    "test/boot_loading_test.gd.uid": "b8608f91772db37fe6912a4fe289905abe95f04854ab270d175b20fe1a37715e",
    "test/card_battle_juice_system_test.gd": "ca13136221eabd393f3d29d5b7decf2bc42381629a3d5a8725a4cd4f2d29cc81",
    "test/card_battle_juice_system_test.gd.uid": "6a2589801e322012d428515e3b0cf6f7e061e136f363f456bfb5ecc45156a00c",
    "test/cursor_system_test.gd": "59b6e5a70d5319cda6358a644d0875ee90acca38108783d0c8484d8f1a96b4d9",
    "test/cursor_system_test.gd.uid": "0cf64909a317d3c7f2dce4fee79897d3e058b3f2028975d635110b99e53f2f43",
    "test/debug_capture.gd": "75e8f2a592a5ee36607fb726918081df8ae050314bdbea474c6325d06eee7a0d",
    "test/debug_capture.gd.uid": "2db11c138f562a1bab70bcaf33879f01bf10f9cb38ec3b806db8875473522a2d",
    "test/debug_capture.tscn": "1f0d63c548404f1ee6947fdf472bad0693a9615f121dfe48cfd9f2ca61606d74",
    "test/exported_pack_boot.gd": "1bceac7274209725a6e759ac06320109dd9639816bca9b4c130ea0d10b0c2f4c",
    "test/exported_pack_boot.gd.uid": "ace7b44cd7203632d3b3aef102f9c8e489391d828d16167857ff91f96aacffc4",
    "test/exported_runtime_test.gd": "621c82e26eb50cea42e9a221170ae8e55707b98d363eb5890bcab8a3a09eca78",
    "test/exported_runtime_test.gd.uid": "5298ed84a62ceea4b579dc885b9041acb52b4a8b894b06eb13580da4d3f974e6",
    "test/juice_runtime_test.gd": "07459529e1e7f38e7b085a2b2b85a1aaa4bd8ad2372ce421201e9b1d1a8a4b19",
    "test/juice_runtime_test.gd.uid": "df9b35905c68e5eee748dd7fdc651634105ce8cbfc78a7ee1b9808ed2b1e48b5",
    "test/layout_asset_test.gd": "1d7115d42233dc7298d8ae8de4a23f157c314f36b8e494bf6c63e281c0e195b6",
    "test/layout_asset_test.gd.uid": "876e5e4636f5618ec7c3877af05f1670b8be47a1a7c7d9a51044b599e40876c0",
    "test/leaderboard_client_test.gd": "21fa690be880e6b4b7972ef2289b58375a336b798adbadad51e182e8fe5c2cdb",
    "test/leaderboard_client_test.gd.uid": "1a0a6f7cb659b77182d15fc24298c72e022fea1abeee30827e74e6ad47fbc288",
    "test/localization_test.gd": "0cc9b1117b847ad914df7e053b72eb42c848b9c8c994ea580c936ac489c5585d",
    "test/localization_test.gd.uid": "3a4293e080acb39a52bb06476bc61ab2758284e264035b67bf0b9ba2e4f69ad7",
    "test/multiplayer_loadout_capture.gd": "ef9c16738ff436a43a3db9e015248f8028abf9c97794895a67737f15a8fc2ad1",
    "test/multiplayer_loadout_capture.gd.uid": "7e51827817abc6a4568bba1c43118257b8427c52c6b635cd2cc1d028422269cb",
    "test/multiplayer_native_test.gd": "8172fa1742508bafff0a8eddd6348694053c1778b4e1923fff243c21b1e9d34a",
    "test/multiplayer_native_test.gd.uid": "6ff9078cba74fe6a1f88f0021f5c062e72888cf5df62d83cefa54673bb7551a9",
    "test/multiplayer_native_test.mjs": "5f4f844acd41ec90b0dd595978c933f51afa34e36e706880a95ba4d656f67ff9",
    "test/multiplayer_rules.test.mjs": "30e8a17f3177b34894d88800f5e97db50185f8c613dde0104765ab030fe5f5b4",
    "test/multiplayer_ui_test.gd": "cde47c65276e09f689e28d94341bbfbd4da4e0f575e9ace88a863f60adefb370",
    "test/multiplayer_ui_test.gd.uid": "64d8448d5c7a9b9c00904c10eb7a4a1bcb50a2918996339193d3e8eefd866a5a",
    "test/player_name_transport.test.mjs": "4fa48e1391a7db04792c057ef60a09c7add0dcb86c2a62e4acfe3ff90dbc11ee",
    "test/player_name_unicode_test.gd": "cee94aaa184038ba776729a150b4b5920c98d493a56b6a93acff6d9d8f01b5a0",
    "test/reliability_regression_test.gd": "a4cf84c6c4cb59bab3ee39f8c07073572968daa3c20d72a2e31fa82b028fedbb",
    "test/reliability_regression_test.gd.uid": "f1913c1032f8cab29c230d7d5ff4996aff54a26ad8f519b347b8fb785a55918f",
    "test/runtime_tweaks_test.gd": "9d5851d2d25aaa0396da79e33d256bc94d96d38f36b3a0556cd1639a4201738e",
    "test/runtime_tweaks_test.gd.uid": "29075a9cbbc35e8db140c2b1aaa6fb80b72d2b5b04de6ec57817a1ba92dbe3c6",
    "test/tutorial_system_test.gd": "33a40f5db185cf203b4d2528d71744c6549af6ca202614fe763dba14e4eb5f00",
    "test/tutorial_system_test.gd.uid": "1cbeeeffa094edc78b055113408cf83d20e6fd76b4434b8fcf4f0e28ca833742",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "web/loader-cjk.json": "cd50bcd0fe25528ae3fe6f8e416b2f29f73b17bd2065ad7a83f334b9db52002b",
    "web/loading.html": "cec34d40c0f84670a99cd484d91a6fdf229669778c25406c8f30dbdb1ab2650e"
  }
};
// shared/gameStarterFiles.game-puzzle-v63.json
var gameStarterFiles_game_puzzle_v63_default = {
  id: "game-puzzle-v63",
  files: {
    ".gitignore": "6263e062807aac2b1b19d730b9f168f041136e504505decb0bd8e90eae18cb20",
    ".manus-game-template.json": "2f609e636dd81da92110d2d2d01113797330c5369e4fa14cb34216484eacafce",
    "README.md": "a73ff23d0874118e75b6f75022619fdb0e6465dc1f374fce4385620469231cc5",
    "addons/mushies_export/plugin.cfg": "2ef4c49c4263bd6f31cf8e9a4b87acacf92865dc89a148dfc77471c2fcbcba63",
    "addons/mushies_export/plugin.gd": "0124608268f89f3fde03986bf2ab996cbd0fe0e1bd5fdef103227dc2897f90b5",
    "addons/mushies_export/plugin.gd.uid": "96b5e908c2149f9f60e59d1d08846a0be8099f4f55914a724a2ed8b44946d81c",
    "assets.lock.json": "5d8901f93454c00e93217d347c42578d9dcf5e84dbcc7b664c0cf9242c2f127b",
    "assets/template/audio_v2/manifest.json": "90a7ee66d4dd36cb2d5be16a91ba7316a981637570c71c502f4060c744946754",
    "assets/template/audio_v2/runtime/bomb_pop.ogg.import": "eb487d956bfe91d6393887e9531915c7f361b848038a31b364bc97019304e2ea",
    "assets/template/audio_v2/runtime/carriage_loop.ogg.import": "229ecb277b7e5060f8149929aa30c457ee539572827ab325aafe274ca929f27d",
    "assets/template/audio_v2/runtime/chain_bonus.ogg.import": "56c1b15d13af388564d31c57a8d8ee3d70ff5e8ec69468eb66eb75a9639d3cc4",
    "assets/template/audio_v2/runtime/claw_close.ogg.import": "b759079981ed5882cc138437e1dd0b55890ff48dd546caf41469894726c10691",
    "assets/template/audio_v2/runtime/claw_open.ogg.import": "a890a9886e18db9929ad81c7ebaa35122feb280dcd98d1d113ab9f1ab484be4a",
    "assets/template/audio_v2/runtime/cotton_candy_circuit.ogg.import": "265c67365bb5434994bda8590a72d4497dc1b5faa5985b63e18005259f5c3774",
    "assets/template/audio_v2/runtime/danger.ogg.import": "2b6d40090df8d1a57d12688526901171ee278628082e41f9214301e1e6c8864c",
    "assets/template/audio_v2/runtime/discovery.ogg.import": "450172966bb11773e6f41f6c74cfee0546a8e11a569cf2229d6b58c938934503",
    "assets/template/audio_v2/runtime/dragon_arrival.ogg.import": "3b85240fc079f0c693b8230d13b562021a1f7f576c402a1f451429018688909c",
    "assets/template/audio_v2/runtime/game_over.ogg.import": "86fd03dd790a5f49109cfa2f9d90d1d16d6a85d1a767243245d32c676b086466",
    "assets/template/audio_v2/runtime/impact_heavy.ogg.import": "23e1131e018a8d04a9b45c1842fd71e6cddec1e81e7c4c7d7e2817d5d7c9d2df",
    "assets/template/audio_v2/runtime/impact_soft_a.ogg.import": "c7f4d1b60d272669e35ffc584d0d6e14e9ddbe1a3cb1fd5dc8ea60261f14c6f1",
    "assets/template/audio_v2/runtime/impact_soft_b.ogg.import": "91b053fc48fd99b70a772a2113c992f5518c73e806a25bdbb0f3947da05bb470",
    "assets/template/audio_v2/runtime/merge_large.ogg.import": "e9046332c3b9e19c20fc193edcde16d4e178bc449706ef776557b00d4961b859",
    "assets/template/audio_v2/runtime/merge_small.ogg.import": "0b4192ad16592e9224a65f85a80abbaf5bc57f28841e6f7c8e25955b65080fe9",
    "assets/template/audio_v2/runtime/release_whoosh.ogg.import": "d85ac3f6b1509ad415518923df8816804362f69b5340437b406159ef92ce859f",
    "assets/template/audio_v2/runtime/restart.ogg.import": "9bb9c95f652c31bf078b106816b93afcde07609c16c34ef4d2e134c10cf63c57",
    "assets/template/audio_v2/runtime/ui_click.ogg.import": "f5a72c6093e4596617152d77b572128197b75abe3cc837f8d2baa9ab4fc7ac5b",
    "assets/template/audio_v2/runtime/ui_open.ogg.import": "66029e80a43847f48336eea23bf25699b6bcbec694da3b730c96291f6e50542e",
    "assets/template/audio_v2/runtime/wall_tap.ogg.import": "55164a3f01e993795111e76c7fd19a08782d74d337f144f10ad130b216199552",
    "assets/template/audio_v2/source/.gdignore": "712c5d895d4973d2f573d7f7bbc7ffb0c1c0895bfd9eab269f454a5e0b185cd9",
    "assets/template/bombs/manifest.json": "eb621547860a5ee8257e621bcc2d8aebe98c0eb0174d31e9e3c872a15f3f8651",
    "assets/template/bombs/puff_bomb.webp.import": "9b4d50cb635c5ada76adb9bd74ef42d5a758c25340785905a3cba20d4362444d",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "2eacabec69efbd8f53cef8db143af6e23673baf483e4b17bdfa3fda5f6da07bc",
    "assets/template/fonts/Nunito-OFL.txt": "580df76c95a1ec5ab878ceb25bb3d85c6a076804e9c970c8c6972aea775fdf65",
    "assets/template/fonts/Nunito-VF.subset.woff2.import": "80c335a1275b21df524c350de80f4337ebdfac8778c964f92cca899e73ce7b4e",
    "assets/template/fonts/display/CherryBombOne-OFL.txt": "0e04cbdaa14fc3e98b6ad1c9156b04d952cbdd0d31845766bae4cb543a71bcba",
    "assets/template/fonts/display/CherryBombOne-Regular.subset.woff2.import": "a82a57eeb3e9d48279cc917a3a00842ef5d53fd1c08050875a7ffbf15dada85a",
    "assets/template/fonts/display/Fredoka-OFL.txt": "5c9e7eee5c6b25f4b05b8d53b2e470ea4962f9ced742d044a98f7d95d1375bab",
    "assets/template/fonts/display/Fredoka-VF.subset.woff2.import": "7ab4ec9f5451ce03b3970a9deeec9a755e354d7b5f749370809dee75cad99745",
    "assets/template/fonts/display/ZCOOLKuaiLe-OFL.txt": "538078469839b4a2e7ad22bef4ebe41681a4e53749bb2a072144024f1d6d703d",
    "assets/template/fonts/display/ZCOOLKuaiLe-Regular.subset.woff2.import": "85c14cccd8ecb288b23f50fc00eef9f9c7b278699965d38f1f214e50d36e2754",
    "assets/template/fonts/display/mushies_heading.tres": "7d6ca7e775d1a46f9d837987be69b17d3ac41f91c7689623e02d086198403674",
    "assets/template/fonts/display/mushies_kuaile.tres": "f0daff16529e30d87d173f84fc44e8e5277e58c84e13d0b3183becc1c1a90c63",
    "assets/template/fonts/display/mushies_title.tres": "561bbde88870d21c753ceca232bd323f953af0efe05ca200653c11e24602486f",
    "assets/template/fonts/display/noto_sans_sc_bold.tres": "f1b69e068eb2469cdcfafc2d56528f6a77e3534f816b88192488f2aba3e0c241",
    "assets/template/fonts/display/noto_sans_sc_medium.tres": "cecac556aeec07590da636e5bc1526c6aed914c19c0bc05d8b515c0984835626",
    "assets/template/fonts/display/noto_sans_sc_regular.tres": "9d5e4628f57655ed17e3d0f0246ad4e0d4ff919a04754a8fa1dc7f3ba8da1e0f",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "6f5a09b33321e3d696e2a439dd2817b0bd11d2caaa62eea646d38bb32a771e34",
    "assets/template/fonts/ui_medium.tres": "88ef7447cae9a9bfcb9772659470cae64d06b2671299112e3e5b83558c42696d",
    "assets/template/fonts/ui_regular.tres": "3f1e8b6cc820fd69aecee0542727f29457d84694da9e8b8d6472d01b7066092f",
    "assets/template/foregrounds/cabinet_trim.webp.import": "8623c0e0ffbac8afc3841c2fd3b227f0e41964b451056567cd172b811ea482ba",
    "assets/template/plushies/background/arcade.webp.import": "998cfff9bc1268c83de1662a05f9e64371524cf76fdca514a3f37fad5c9c9620",
    "assets/template/plushies/runtime/axolotl.webp.import": "d21c90e2336ab4b146a2bcecdf1d179781984692e01c1f64b0c06c527a5b036e",
    "assets/template/plushies/runtime/bunny.webp.import": "7717f2c735247ee756aa012272f65c8966ee1842837ba55dfc4b0b39c90980aa",
    "assets/template/plushies/runtime/cat.webp.import": "c1a20b37a45932681d4945960bec15c827f5db0cb5e53ec77eea7793e5c83cd1",
    "assets/template/plushies/runtime/chick.webp.import": "45907b53ef13e08989d9e45d60ee7ca52f98de5fd64957ed2f50475bb15ca26c",
    "assets/template/plushies/runtime/dragon.webp.import": "6eb385f98ac5857a6dd480faf52aedfa35156225d29b126e97e2308ff4e4bd8d",
    "assets/template/plushies/runtime/manifest.json": "266b880536c3b3fe1c274bbb0c355e23b5f9aa3c89777e2d7d116ffd11dec800",
    "assets/template/plushies/runtime/moth.webp.import": "8fbc62d551c90f6644e43b3feafcdf56cc6d4f83e7b304a0f7a5a76e554f9805",
    "assets/template/plushies/runtime/octo.webp.import": "aa3d5f1e4026db1dcacbc9499a364a28bf6dd393bb71a2d00987d5fb65c15e84",
    "assets/template/plushies/runtime/pup.webp.import": "68d0835ace57eb8b4ae8b7866b9fcff990fd8b7738f5ff5b8b32d6e4ff1b74a7",
    "assets/template/plushies/runtime/sheep.webp.import": "015ec8b7df2a6e9a9b45b311f9d36cccf51d691e1e024ef591877bb3a3d0d6e3",
    "assets/template/plushies/runtime/slime.webp.import": "76eec0e78fe602724f8336070a1d52c4ab632b5a1b570bf74d688a8d6646da93",
    "assets/template/plushies/runtime/star.webp.import": "896c25d1e170be8bc3538df43dbda5783221818f9bdb16639deb324413543411",
    "assets/template/plushies/source/.gdignore": "6b1ba927a1572fc57a35a455340dceeb0fc40a83dd4de4c1bade975930bd0485",
    "assets/template/source/.gdignore": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "assets/template/source/GENERATED_ASSET_PROVENANCE.md": "c3f375e576d1df11f883e25a06198a9eca955a4a0fc37e0878f76073d612693c",
    "assets/template/source/arcade.png.import": "d2f84cb9edfdfd74c7484e15e9f7ac3f742837a72f3b760f2a544dd207da70b4",
    "assets/template/source/generation-prompts/aim_cursor.txt": "198cb76098ba1799cc26b0044495f37ebc8ec4fec1306191834db6a820cfe23d",
    "assets/template/source/generation-prompts/cursor.txt": "b91138f8f3e7f9ce4d20c7429351342637f1a216d7beef58dbb14456685ba239",
    "assets/template/source/generation-prompts/foreground.txt": "787e91e2486d66537ebc4d90f02a0c69e01006b88665e1f3664a0bb88a9c45d6",
    "assets/template/source/generation-prompts/pause.txt": "9de794f8f7c72408cb1e68df5df1bc530468bdce5e8df19f3825edac08f909ba",
    "assets/template/source/generation-prompts/puff_bomb.txt": "5226071a3d14af27513b052c5a92e91fb167e6403b69133e89d08b052ba6f5b0",
    "assets/template/source/generation-prompts/title.txt": "a9c3917063130c313233db0b2e5fda3de41b1c88cb22ff67f8e820dad7116b7c",
    "assets/template/source/normalized/axolotl.png.import": "00e79383af0d7d768b50592a8662bb5f3f1dce7998485534fa0aeaae3bd88912",
    "assets/template/source/normalized/bunny.png.import": "bb46b27ec20660dc06d37121bf98f7f82634af0c95c33789c6a08e32c10eb138",
    "assets/template/source/normalized/cat.png.import": "93f5bb168820a4a8b80866d73632a905cf1ee41abf6959039af86aacff93e7c7",
    "assets/template/source/normalized/chick.png.import": "f1ef54a9fafce2e746abf94a4b26730feb1821336fb055f2bb0817517180e565",
    "assets/template/source/normalized/dragon.png.import": "bb270ca59465902aab8828c0e9129609dbcf0d36905bad8acd6c02d9efccd0b9",
    "assets/template/source/normalized/moth.png.import": "ecba5b365018dd46a1dc23cfa996c696922518cd391bbd6b81cd7703774ecea8",
    "assets/template/source/normalized/octo.png.import": "e4190279f2e14dc97609e7f7efa144a42cfc9bdccbe5d9c21baa99d12b925bde",
    "assets/template/source/normalized/pup.png.import": "9cd73bde0608c8c3a2f39983ac830029e39c81e57f76e18c05160f34a8646342",
    "assets/template/source/normalized/sheep.png.import": "b0a275f406282d36b9dd319c03cd1c5a0c886a0412ad025cf537c64b030b12d7",
    "assets/template/source/normalized/slime.png.import": "e971213356480f708f31af65a5030908b5bd96f9226024dc8bfdc314ce272142",
    "assets/template/source/normalized/star.png.import": "5467205c38ba684aa2416f2ad679178cbd93c115334212f63d52f7725178f12a",
    "assets/template/source/provenance.json": "6503a4af16eb18c1127f7b4ca43d6fbea05254b67ea4d64170753f977948d1ea",
    "assets/template/ui/aim_cursor.png.import": "a0f1b38e01a645f89ee5505de5f5e038593590101cb6d092315bd5246904ce9a",
    "assets/template/ui/app-icon-192.png.import": "65c4d483858e07494b8cf2ed2ef01def0ca485b15460e93e15acdec4bcbf0e6e",
    "assets/template/ui/app-icon-512.png.import": "2795aeb23a551234c2d811bc619975fc866863b1f5617134f18228c00bca59b9",
    "assets/template/ui/boot.png.import": "eec34542d8974cc8a5b953b724603945b27a3daf3af1eec1594e62fd109f6778",
    "assets/template/ui/cursor.png.import": "b7813d8febad57b8682e4606191a139a40b39bcbffb55063f4e37a88880bdad2",
    "assets/template/ui/pause.webp.import": "d4dcef377c82917463f883ed415664a08284420fe95ff989baf18f7f98df0a3b",
    "assets/template/ui/title.webp.import": "4e2465b0789e4931fe1fabc463ccc87a24b25b3386cd9bf67b3c7d4f12ec569c",
    "autoload/manus_font_theme.gd": "49ca1215cf47da120e43639581807e097177877a18a5341e341e423834420a60",
    "config/tweaks/catalog.gd": "139a3d99ff09ad624e50921453fc04ff268de7bb2bfb4dbba21bc943d8290bc3",
    "config/tweaks/catalog.gd.uid": "472d6e0d62243a576f60a597ba1da5119a80a5b3a6738012dad6f7b51426a0b6",
    "config/tweaks/catalog.generated.json": "96072a67782bb60dc2da200dadd387452ff4b1aac96bcb7e7289e4c81b4957ee",
    "data/actors/bomb.gd": "6e2d4431bb0c27518e6aab98a4808e0a3b8608dcc7cd9aea3008a87de21a2f68",
    "data/actors/bomb.gd.uid": "36020fc2ce8a325b689cac84b118a3dad050a551ea1492c9307c0431a5000aaa",
    "data/stages/registry.gd": "936d31c170a3883028dc25c6accd0145bc80ff682d170f8c735206777ddc14b6",
    "data/stages/registry.gd.uid": "784fef4faaa7ede3afb21634e901fd80667f83ac5fec00af6a0c80c1f409c770",
    "default_bus_layout.tres": "c72073e0a1202f4e507ba106c8e44f4424f1d0ced1d36e83b08741b6de6dc703",
    "docs/asset-inventory.json": "3ac3aaac2416b376770d32f355b2bb13f77eff95e742d23be1278e8860d3e57c",
    "docs/audio-cues.md": "9abe1bb5e0ec5b6251f89b1fcb2491cf4b825c83f17ff9ee9f4049caa2406399",
    "docs/game-multiplayer.md": "af4dfd273e65ff5a1a547b7fedf5a61e039b0f8305e5415962533313eca3ad68",
    "docs/local-multiplayer.md": "0d23eefe318e08356392f17e3973278ae7de7345fc5501e8caff8fa707633b42",
    "docs/responsive-hud.md": "efa8a8dd753370727ace1dfe5464a9f96f719ac125a3065d81a677b5eb70aa49",
    "docs/ui-padding/.gdignore": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "export_presets.cfg": "076a4df64c31012720c096ab36f1953494d9192af3f76860fa72b2926f9d6c23",
    "localization/en.json": "a5611ae117d605adb7b61998923768fc5117544780fb124a56968cef5cd11c13",
    "localization/zh_CN.json": "2254d66a9dcb2146996947728af5c8b28c490bdf2149d540786371897fa2c85f",
    "package.json": "7264682ee34c005423e0327d5f5b25a6fb91eb761b4e7392f9a1f3a81a3d5b98",
    "project.godot": "ed9ebe6dacc1134d24615f20e7a508e257f6c61fcf3d274fcd44d96c71536caf",
    "requirements-dev.txt": "f94afaa8e03d093d17bd02c1faeb2ff9f43814dcc265d2f404e7cbfac0e480ac",
    "scenes/main.tscn": "c9f21945c6b6a5a83c364f71414684c6eb4fcffc8b72f3ae0baba91d3d783f04",
    "scripts/bomb_plushie.gd": "d00c846758d50f805fad0e36040de5397849571eac2a63608a3be9c8734c3034",
    "scripts/bomb_plushie.gd.uid": "3010082b95e2ba8eb213c9a6877f13e0c4c1c6eafacebf5145610dffee5f6fb9",
    "scripts/core/device_layout.gd": "6c712c34d4f83bf97f28a6d21af0415cb2b27ba9f3f6884cd277b01b2e4d8a34",
    "scripts/core/device_layout.gd.uid": "b96053ce114ce75d6ae6ce149ed7bf52824d9774a84c0b5d9af3f4e95545072f",
    "scripts/core/localization.gd": "ea714059a728d488a1aca6f76731331310981d0771c6aa76aeaf51f31b98c981",
    "scripts/core/localization.gd.uid": "9dd5be7568b1b4be4f3d65905488087a782e05d8909e737e3a57e248d79928b2",
    "scripts/core/routes.gd": "5bd0ec9bedc2ef7c04f06d23f8467a693cbf09987ea08f63c3ce4a6729f9533b",
    "scripts/core/routes.gd.uid": "661189f92090db6e37a6981b2ea9cb4bd3aa213fcd9c36671bb189c597cca571",
    "scripts/core/session.gd": "fae265a343af976cb6ad672620245c6f1c3f8690d99a7fe95a042ee26e344c17",
    "scripts/core/session.gd.uid": "1f537b678cd4181091b9de39bf18c9370fbf2f572f8d479b908cbb799decd6cf",
    "scripts/core/settings.gd": "adff710cb0d55ec1f96df2b336869ffa70a9a100726078b23027662041e0b024",
    "scripts/core/settings.gd.uid": "b014782603bb1dce16826b9a6841cff02b91bba502e5b5f2527b3ce0a460ed16",
    "scripts/core/storage_migration.gd": "6a11a14e5ea5fe1479f141d88b38803fe575d0b8bc17d3f866da6c05b88dc5e9",
    "scripts/core/storage_migration.gd.uid": "7e795452ab736c77d8c5e0abcde405ec20e09f1e4efe23c8a39b2e9bf9bda9a0",
    "scripts/core/username_input.gd": "95c49b754786afedb313e213a3807a47ca4a850f5dc254e3f419c982373e822d",
    "scripts/core/username_input.gd.uid": "123a9771719149dec14cbbb922cae8f97aec65e4141fd00def6c63678eec80c0",
    "scripts/game/board_simulation.gd": "b07ab7ca2e64dd18f158b4a42304b2dee5b2d212a445d175acfdc80a0ca1cac5",
    "scripts/game/board_simulation.gd.uid": "9fada94733e9513c60e9f44a83e86c3369e236497f28426cc80f1a7ab17f78cc",
    "scripts/game_audio.gd": "f7fab4adc648131d2c93765e9eec8f7de0459c18fd4313b106c8cb8532a7def0",
    "scripts/game_audio.gd.uid": "e022a33a4fe25c9658c285f10f20594c1f340d14dfc6c3da7c70daa0200883ff",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_player.gd": "3dfbe63c26ce47cd41a1c50c94ad1bc51eb99a3daf494cec3aa81d123865de5f",
    "scripts/manus/game_fonts.gd": "2cb222dbd7750f61b0ab8d0c7e82620a26a32741c542f70d3e295961f0e7d0ba",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "a6894cd5b2f968d921e261f52f70e1955d76eb9d0e6e5a0e1d79d5bb75a17142",
    "scripts/manus/preview/tuning_adapter.gd": "569248cc2e95bb43e06b481aac234e8ba57174fb2e2b2c41f89b381e29dfc7dd",
    "scripts/manus/preview/tuning_adapter.gd.uid": "232c2c4831d14b0de72887a1876cecbc2ae8a62807e14272b8c8f7a45e3cba2c",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "efba7e854c486ec11e4fea0c8a9bd2fcab35ad8d8153a0fbdc4bed0aa67f547c",
    "scripts/multiplayer/board_view.gd": "21649f38c290f1411f001052bb2f58b5ad52d9aa3cd7c358bb139f42df563a0b",
    "scripts/multiplayer/board_view.gd.uid": "e825a94062e07e1dfd7c9aef11564bf511b7914d52c241b72655d5dfb18fa98f",
    "scripts/multiplayer/local_match.gd": "e68f719eeb6bed6ea89c8fcbf9ea6a93bac553a518c8a439295c308daaac4f73",
    "scripts/multiplayer/local_match.gd.uid": "9aafb31252732690ddd258916cd7919bbb0d9a3192a6ed049b6aff28b52303f2",
    "scripts/multiplayer/multiplayer_screen.gd": "a10394aec4b2bb87c42e4d6d5ef182ef3bf069d7acf4d4a7b5936041da8f7c7e",
    "scripts/multiplayer/multiplayer_screen.gd.uid": "c87de16a6961747f9032a97d4f2d49e87dd6704a173d387dc82249aa39ddf454",
    "scripts/multiplayer/protocol.gd": "debc6039302f0dfbb39b6866a7b2cc161f007ed132da408395de52d53a9d8dff",
    "scripts/multiplayer/protocol.gd.uid": "4de0c8f23056b621b94c31a8520b90b6f7f3553a5d6cc2e4f6a839d551669ecc",
    "scripts/plushie_body.gd": "2757b13d15a0c6ab548805b2876e923ff536955df7c92524a516bc3418cb7ace",
    "scripts/plushie_body.gd.uid": "1370798aaef42d3c78f93780eb793033e086240a340f0c1d4035910a30ac0936",
    "scripts/plushie_hud.gd": "98c2ece1921b9ab5cff3a99b1cf43f11e8b534acee2c4b00dd67fe3b55e42617",
    "scripts/plushie_hud.gd.uid": "515b8342b4d52d92cb0e94ca80b9c45f1ab43551cc5aa72d19352e3f660f76f4",
    "scripts/plushie_main.gd": "172c7991700cc7a92da4f34d1390dc69ffba219dac335e1749315357bad4b1f3",
    "scripts/plushie_main.gd.uid": "2b67f714dbbd1cfa4f42926743eaa849110993dd596bcb7ea736875d235e2473",
    "scripts/score/leaderboard.gd": "b126ef9979840fc354ad7533c06c700a6fc144f3773ee53eac80abbf3bf5a4bd",
    "scripts/score/leaderboard.gd.uid": "8da8b9555341d34d0ed91f788414a3c4c5adecdc4326790fd09327cbeb79fb45",
    "scripts/score/leaderboard_panel.gd": "cc5b7c2850e7a37d7e3fc556c49f6a39a495cb168411a9d425937361bba2b096",
    "scripts/score/leaderboard_panel.gd.uid": "74373635df5586128a61210d1adf9fdbdc19c2464cfbf49c0db787c18f286841",
    "scripts/score/score_service.gd": "1bb985a9e5cc48d8ce53eea5d249cf5c926775fc2a57a763456a2b5da3bf1013",
    "scripts/score/score_service.gd.uid": "3f57dfab0539107c613d64353533fb4a3caa5147398305d2de8391eeb66d2c48",
    "scripts/sound_bank.gd": "9d2308ec98c0fc62ee9bb740e4bd1974295efdd3b87761437b6fe09cfa1ece49",
    "scripts/sound_bank.gd.uid": "db736fac4a9ffe31085e6dd110a5cfc6c295fdc41cefb85d0d86fe8b4022a5c5",
    "scripts/sprite_silhouette.gd": "70cf8e3908eca1a4a73a9228ff35b86445c576ef5fdf7cededf1849fad8bcf78",
    "scripts/tuning/tweak_service.gd": "97ac9e2b026565c35cda9e1cf5c29ec58bdb89cf5225af15f0e378ee98792d2d",
    "scripts/tuning/tweak_service.gd.uid": "48426af71bf5a568ed3bf7fed46b3f0a64fafc8949a86956d34177d8b2c5c9cb",
    "scripts/ui/menu_cursor.gd": "36bc490da2f0c321a2849501090dbb19d16977d41ae5ec71701bf2005af23031",
    "scripts/ui/menu_cursor.gd.uid": "a292bd04f914e6cec69f41e7c5a4cc04de1f3426720306d70b4940f004e234c7",
    "scripts/ui/mobile_scroll_edge.gd": "840ce76c6bbab64d4ead2bd7a9dd807904fb416682d69ae444f8e6df691f2d99",
    "scripts/ui/mobile_scroll_edge.gd.uid": "0174702a5374d7544f89886971fdc1e7da6be90b06675c92e6d50228c5bff256",
    "scripts/ui/mobile_sheet.gd": "f6ddb3b770124d7e4ab54596a0f46739ffe8a28bcd1200d7f292f4a3e799be53",
    "scripts/ui/mobile_sheet.gd.uid": "8b388f3b1b68ce85fea5603f8609d30e8f2c4c60a7ad7e99cf0eb28b07306fb0",
    "scripts/ui/plush_icons.gd": "9ba15113eb05b9c2aee71b729a4f33fdcaa4de29a4ea3148a3970136798ee247",
    "scripts/ui/plush_icons.gd.uid": "e802733fd5637ac66f827cd271e96b65a66d9c2348cd314d627fc1f9cd09e333",
    "scripts/ui/plush_style.gd": "d02587042b4656a63884c07d2a6941cea992983750e0b8f1accf7d548ae4613e",
    "scripts/ui/plush_style.gd.uid": "bd73ef48db80e7a4018b7b2c75170393d3b87ac61243c7f2fade677228ec4d69",
    "scripts/ui/resize_banner.gd": "1249ce71e08f354c15027f1730f00e0f1d6b2123ad2458fb9a83b77fe9a18944",
    "scripts/ui/resize_banner.gd.uid": "4d78044fd7a8dd1c9019178628fbddc7d6ebdd693a5dd9ce6fb41125797a730e",
    "scripts/ui/settings_dialog.gd": "00504167dfaaa77d087fb5c03c1a6336ac7af6d59e24a08fd6ebfbcc0ef440db",
    "scripts/ui/settings_dialog.gd.uid": "5667a52a92a2e0568a104422f4813b85d46e61af6a593e8ab6c23a3ff5bfb146",
    "scripts/ui/title_fx.gd": "51ec6085c760257ccb67df71edf88f0e0e66125d287918d34d1c22df9deed0d0",
    "scripts/ui/title_fx.gd.uid": "90c23f471753a5ec526253c80ad2256137bfa7af5fec222330101d182fb43477",
    "scripts/ui/title_marquee.gd": "89b67614e1e5ce860dde6c64fbc30ced9b4fbe274f6fad8213651e9171b72f90",
    "scripts/ui/title_marquee.gd.uid": "a63eed8a12a9221da2ed30eb573645db5c89e77d8500625484e33834340e30c8",
    "scripts/ui/title_ribbon.gd": "88e25216d9b134085497305e937cd7088cc7954ac5432454ea385b0d0d479fad",
    "scripts/ui/title_ribbon.gd.uid": "408c965e0012b823142a7c151836d7790ef241478a02a54c9650c5de168f0f29",
    "scripts/vfx/board_ink.gd": "2e39d02d67cce72f9e0be96478f61a1b5314e6679882c257aac5eeed7f7b8b32",
    "scripts/vfx/board_ink.gd.uid": "66e8e25232ac336dbba1472ee4f979b7eb51198246bc4f68e6dc39c7b03464f2",
    "scripts/vfx/feedback.gd": "b217b4952ffd27983dba6c21ee6d916d9d7b559c2462e49cd514febdce79425d",
    "scripts/vfx/feedback.gd.uid": "63f21c0e865d0cf573a0903d83471a687a4ed29eda437a59662cad150590c31d",
    "template-provenance.json": "2919327ab007c5ba777e93fb1fc7d0d7724fad0bcd37166410d1253d3663c9f2",
    "template.json": "62e730011dbd3be1dac2dca0c7339338ef6ad9266b1e12a1ff2454b9f8838332",
    "tests/capture_hud.gd": "12d4322075e12d79d8cdb2daa8bdcb70d1d5f6ca236cde7c6c530c16b384fd5d",
    "tests/capture_hud.gd.uid": "21b0c007565c3fd5c04a91555283800bd2220b81e4dac6182c5b68b834f4d8d9",
    "tests/capture_local_splitscreen.gd": "4dff48c61dcdd2807f665b03b3fd9636ad18a4b6b22500ece3557a114f06ac1c",
    "tests/capture_local_splitscreen.gd.uid": "fbb51ecf26f9a76c4a9462376236bd1efb9bba4a9a30649b16524e37f04c49cd",
    "tests/capture_mushies.gd": "4fca90eae22ec7a256e4b710e9f60b7b70ba95ab5a2958fb8e0fa780fafa4e12",
    "tests/capture_mushies.gd.uid": "c2f9c1d2d3e3392621de1b4863359022797f8b7765f536a918786b9b95fa4cb8",
    "tests/capture_portrait.gd": "4b170ad7a30d4d6ce63803b38a56ac323a81401440c1062b7652d3831cbba73f",
    "tests/capture_portrait.gd.uid": "9e7e1c5dd1f83be681d3fcca9f3bc06a797090b2d123890ef9beb8ba25747e52",
    "tests/capture_release.gd": "b14fabc93737f4ea2024a9f2a2debaab2118f139822d35d7970e1c8a0c6595a9",
    "tests/capture_release.gd.uid": "f1d1e58ec99497be7def366bc90e50a7e5ca18a438d3c483b34f6fdf3be1d005",
    "tests/capture_states.gd": "53186aec37775858e0665f2f340e4fb3b621f763de11a00bd1abe6bfb5610b9d",
    "tests/capture_states.gd.uid": "14be4f932f4793e9f97e5ddf2021fcf7775857b2bd18094b539f5ec0f8fc5177",
    "tests/capture_ui_padding.gd": "954b70fc341bf18ae6b1f5e673acda23a49a995042f59c4a3d5f8a66ab8ca4d1",
    "tests/capture_ui_padding.gd.uid": "aa8589fd0f894946c7cc6e32209a841294dae4b43cb5f5ec0d7e874290b0cffb",
    "tests/pack_probe.gd": "7efe0c51d561845bfca881c48d785c4557c13156c330af7f7acaa186f4ca26db",
    "tests/pack_probe.gd.uid": "b5386c52b1d3bd174c2d47bc1757488cec2942fc4811d90d67911deb6338d6b8",
    "tests/test_asset_retention.py": "865b6b1241e8839287e622a94fef5bf372b5ad0f996eb28422d4a9a8e1ded01c",
    "tests/test_audio_assets.py": "29a6eb6dd15a27b8c967e990a7d138a9537a88d3246bb0d531eb312a532e94c4",
    "tests/test_audio_settings.gd": "10b41aafebab782e5adcdb984ff461bc548c21e48972cce0c18832c82606dcd8",
    "tests/test_audio_settings.gd.uid": "e5b814c79ce48b252076388d18098adf63ec5add2e4258842c4ef4b3d4216358",
    "tests/test_bomb.gd": "a191f5633db34cf5fe772fa7cab367e42b7d4261718ac022619dd96325433b41",
    "tests/test_bomb.gd.uid": "376ee22c507aa459a3a51eed23be482558c1a044237aff43e95fbc07259dcc2c",
    "tests/test_cabinet_layout.gd": "216c9662106561c9057a43b71743379001ee14890cba96f5ee176f71ee6b64ab",
    "tests/test_cabinet_layout.gd.uid": "0c018c6ac4978b42821b1ab06b46ffb6f9b704b7e6f80577afa9620277a47720",
    "tests/test_duel_board.gd": "7ccea4e481d74942b63e7091a301fc6bb6699fd1a8c92f1c056b915f532b7e0e",
    "tests/test_duel_board.gd.uid": "e362304c75d59b2af84783874861e2ec027cc107b558f80f89144cd771eb94a8",
    "tests/test_font_layout.gd": "ff6aa428fa970b9a195ca9d25dede2d1f4d1477123e6dbf61901894ea3e2c46f",
    "tests/test_font_layout.gd.uid": "a13d46d406c4315d963e45c29796afd3b595adcac9525ccd872497aee7413582",
    "tests/test_gameplay.gd": "f7d464652555487b27ec303758615877fe582cc8bb1fc6870f4502ed970d119d",
    "tests/test_gameplay.gd.uid": "3195dad9db30578bd13f06bd773dc95333ae9f5ebfedd91d099ec9bee40058b6",
    "tests/test_grounding.gd": "a449477b3391f11e92ed5c4117275e538caf44c4a9d307755ac3776abf3f2d51",
    "tests/test_grounding_render.gd": "f9d47f16260997ec74cf94b1b8d16afedae7852f6eb557cddca24d7f22236ed8",
    "tests/test_how_to_play.gd": "b4ceb3cdc77a113240fe35493aafc918d00f368ff7ee164b049002c6911b0a73",
    "tests/test_how_to_play.gd.uid": "09a591e6f10c63d0522846929e670296a66c6f19539c7dcc3569216d12b69869",
    "tests/test_hud_lifecycle.gd": "5b3e7f6aea08e38f7a011784bd6eb9dfbb6f2b546db661480aa95b23b67f4d20",
    "tests/test_hud_lifecycle.gd.uid": "f509732d169c8fce9bb3f5f8f292bdcf53eadc82061e2c0faebcca0b223fa2a6",
    "tests/test_loader_handoff.js": "d1df36f65729b8a2231a96116364cfbb11766a5da04b6ae1f2f4d923c1e552ae",
    "tests/test_loader_shell.js": "6f55c0883ec932a0f736f94eb33b516dca3e5089ea4cf38f4d38495042b4eb69",
    "tests/test_local_match.gd": "3c7ba365cde956a3d08acf1f264668840e7a96e6ad2751aeb832310676055432",
    "tests/test_local_match.gd.uid": "41b6e2fc9c3a1e0c363b84a79880199e3f22ebf52792646f5080fcb5d7535143",
    "tests/test_local_splitscreen.gd": "8e7df8021f069831f9959ca79923b56beb35cb1c412e96a6f5cc5daf74cdf765",
    "tests/test_local_splitscreen.gd.uid": "4550c0713e7fa4474f7c1b74ba9fc197557fa161db7f96b6c08bff7280829d71",
    "tests/test_local_template.gd": "6cea4bb8ea1319b405f2938b661901336228b1a8da1d583838d3529719c34645",
    "tests/test_local_template.gd.uid": "ae303accea1f02f8ca69309bfcd7b3929d6b181f8889dc1e0f1350e1a05f6b3e",
    "tests/test_mobile.gd": "2060b93669e5e1bbd925ee0659547bf6ab85ac26b9141866b9077397ff9d07e8",
    "tests/test_mobile.gd.uid": "33f4270252676f2fd586ff1bdc3479400317d17b1c8ab75fc45dcb66915b81fe",
    "tests/test_mobile_layout.gd": "f1b8c4bca37588bcc0b10a12b3da4b47f8d951b372e01ae6d4bbdfd88518d6d2",
    "tests/test_mobile_layout.gd.uid": "54416190f0fbb92c70742346ac2aa1cc0605d5baabbf590236fb200f6f2e699f",
    "tests/test_mobile_shell.js": "a8ea94331d00fddf1c64b9bc53e8b55f032e564ef979ab4bf3bf4834d6ed6907",
    "tests/test_pc_results_fit.gd": "1677503a13a21457362820b17110964a2614ccb9632f73bd4d3f359077a3008a",
    "tests/test_pc_results_fit.gd.uid": "ca9a283956f589a6b77d2b8ff0bc32a6f8f17fb356b2f0c03e2940c5cc3fc729",
    "tests/test_prepare_web_loader.py": "8047a364e95e2018083d85beb0ed3a17e9e8954b014ed0020113387073f84307",
    "tests/test_resize_termination.gd": "84ca37502945ded6ca33d465dab72b025b688e453ccc9ec7821d863c79f7dfb4",
    "tests/test_resize_termination.gd.uid": "2928b0b6b1ae0d42c89f1f9f11ff9997ce715df7aa552ebdb76f9a773982e7df",
    "tests/test_responsive_hud.gd": "cb878b66428ffbccc42b9bf03efe9af6679b6dbd88bd7f4d1492392996ac65f9",
    "tests/test_responsive_hud.gd.uid": "c5052f186adc19868bbaacdabe65545bf3b3d8df6b0a07f0e89690b280ae9cbd",
    "tests/test_scenarios.gd": "e1b18bcc5c8778dce8de6e5bc777a15f1a59df119e3350e9b3771ed6ef11c565",
    "tests/test_scenarios.gd.uid": "38b9dd9f230bc48b580773fabcd885c871f7501ab98636cc6ba468de881f1398",
    "tests/test_settings_dialog.gd": "840bdcb59cea66f5a5b5cf7272ab13f4408c1b13e6f62421c0b29e188a426e73",
    "tests/test_settings_dialog.gd.uid": "0752954dbcb437b278a8287b5a2d8551d572a609b1abec8ec4695dfe34979ab5",
    "tests/test_soundscape.gd": "ea24a5e81910099b572844ba9815fbf837d21ed3b091934b3481c235d5412d76",
    "tests/test_soundscape.gd.uid": "f13b33bbc9f23883251a5a7c5e3d826e8dc07cc37d8a4dba25870da6a4ab71de",
    "tests/test_template.gd": "2ece3121d86f5e7bf1f73dbfa0d94be2f920a605bd4ad404753b9b389f507771",
    "tests/test_template.gd.uid": "57c179ad1deaad31a9932624accf9dc465df7d1c19b60dbd121bad9a4efda146",
    "tests/test_title_language.gd": "22763014de64c7095c560e26d5da8aa3547ca978af4e183a27bb47e12b0adf70",
    "tests/test_title_language.gd.uid": "a1b890adbd9117c124a26f415a693e6bfcae02bd401eab5afb8e885c93520702",
    "tests/test_tweak_controls.gd": "23de61921037c9abb45647e196774884b4873c9c5e006773eae8bab79036c37d",
    "tests/test_username.gd": "9218149749ce1dbf019afe2f78cd5caca7b941862e405ab565a3c0955cc680fd",
    "tests/test_username.gd.uid": "ddca1039d7e72f8e61910f5e1c1182cfbd8931ccd1d5bbf84e1f1fa136308584",
    "tests/test_web_build.py": "adb589357dfa793eb99843f1233fb6756105aa62054f7a3cbafaef43ba3d085d",
    "tools/asset-retirement.json": "4589b6d89aa178a3fb7e566440e3964722535bf120f9d6e23be1edc841ba55f1",
    "tools/asset_inventory.py": "ad526b020089e337afb32a4274c56c9405988e2b9648f327ac64ac9214fe2db2",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/build_font_subset.py": "5e4f8032f2a38341e912768a5402dfa050043e562ca92410b201db96f4c7b1cf",
    "tools/build_web_shell.py": "fb22455ae4ead906fbd8055ced41244935a1121ec7cf881ea206de2f70608870",
    "tools/check_asset_retention.py": "073f95691df362b43f440fcf02ad5077c40b4eaec5940a0ac7d650c0064c845c",
    "tools/check_pack.py": "1c101766e5d8808b4d224e66086e4dbeb6e0a3b5cb13694050c4b8b7ba3078d7",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/generate_localization.py": "1ba839ed943c91df8f7530165ac594083497b57dc34b450a857471d021df68ef",
    "tools/hydrate_assets.py": "bd454bf1b28d87952497ef9d83976c18413d1f6e2812d19da68238bfeb35ca46",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "tools/optimize_runtime_assets.py": "9407cb93fe02276255f7caf00ec1211f80c10d5b516b51ef54884c7dc8ee2d4e",
    "tools/prepare_bomb.py": "7bba2f5e11f0fea5e0092599adf1ca4472906ea304f787fa97b0b7b8e0dc81d9",
    "tools/prepare_bomb_audio.py": "742253c4d741d4d53a5ac0d57d618b9ff7140a1921f7be62c6d67098dcad17ce",
    "tools/prepare_bomb_outline.gd": "160304cabed8c0fc4199b6ca81857470c92621a95b890e87fa653334bcdc7675",
    "tools/prepare_bomb_outline.gd.uid": "8941301cc613b2a7e4e2bda7cd50f94d7daaac268733d0b72d3e630f863b7b9d",
    "tools/prepare_cursors.py": "9b697c85be1920d7eb34d955dd7e62f7f90bbb9bb0d021250eb46f3277c3f5ce",
    "tools/prepare_plushies.py": "5d78e782262761762cdac2fbba9a2f3c54ec1831e3ccc1b950adcbcfeb54104f",
    "tools/prepare_soundscape.py": "67a3b69399ad81decff8d3aea91127668aa6e11b54f5b84002a5b430100d54b7",
    "tools/prepare_template_assets.py": "732f117f17271e44f8ab8b28bd744a2550528f995aa36e881c954e19abb8069d",
    "tools/prepare_web.py": "4eb4b2043908c6052edd0dec354d10dd01803523fec90d029875deafe53d2b0c",
    "tools/serve.py": "7516fcf3e40f190a471b85a029e8ae515938f2e9af0e438c1f0a11d3b784f9fb",
    "tools/sync_preview_archive.py": "f41056ebaa0ec2924ab0babb9bc1d86c200e5117ebf0b9ca70078c3c9fecf11f",
    "tools/verify.py": "71c2e30a4476e03f87cdfd4e6edb6b42f174856de77964c1462d294c6d6cec03",
    "tools/write_provenance.py": "224969998130aeed759e04c854acdee3ebae71c4389cbf7b146a8860b79d37b6",
    "ui/.gdignore": "85bf82458b4dcf2ff9d155fc52789d121a262e79dad95f0b65f968de24ca8b4f",
    "ui/mobile/loader.css": "d8d6f1ecec4971cc8f4fa65305054f1cfa014359dc8afa257b7b44ca3029858c",
    "ui/mobile/loader.js": "76faf8b74b756ce3355f8306340979a8eca30fb51d5818cb90d67c7bd04e603b",
    "ui/mobile/runtime.css": "200201218b61e1a1ce5bd746be93bd6d0e0d992315c39a4186e5c5bcacfb224f",
    "ui/mobile/runtime.js": "24e88e237480cc59b469018e4a39e926085b8188a531e13f8cd56ad89fd04250",
    "ui/web/GODOT-LICENSE.txt": "b0435e3b3e4e55238f05f4b306f30524a1b2e20147810d436eaa554fa6855c80",
    "ui/web/godot.html": "e4c5bfb6496b1d6c7dfd8e82a0a0f094887e65f8dfe3fe319fb429cc855bfa09",
    "ui/web/loader-cjk.json": "d3ba5c31416777a456b7367c11fff7fae99fbf8c893b651a51f10670db8ef55b",
    "ui/web/loader-fonts.css": "36c1f50e448290a4e8ce30934d3c3062763a495a41509108c7b7d8dee5610b74",
    "ui/web/loader-fonts.json": "61dbc9420e32dc6fb90b0760d947d299463b5ff3251ec2045b6d023616710e96",
    "ui/web/shell.html": "eb5e0f36084e8364c1a2351302a9b3ca2a268a21fb5ef71155f93c10cab0452c",
    "web/.gdignore": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
};
// shared/gameStarterFiles.game-pinball-v9.json
var gameStarterFiles_game_pinball_v9_default = {
  id: "game-pinball-v9",
  files: {
    ".gitignore": "42bd43699f9ed861c84ebae38c39a0f841aa3fae5b01430a558e6aa4e4df5b69",
    ".manus-game-template.json": "dee689fc35e0e9f3f7367b16e089fbe51d3bc4f128c90c96f42aaf7a21c6eee5",
    "README.md": "0ad5272c5e656ea40b01df7a3642799b549385bada533f2e4059e0c201c1236f",
    "asset-provenance.json": "d0832a517c31203c9f7976e81be686ec050a4363d25623c57501442dd79293f0",
    "assets.lock.json": "aa9cc3804ecad1c91a2edfc34b202d3813addef6d008324bd5265a7498b2ddbb",
    "assets/template/audio/cosmic/celestial-drift.ogg.import": "81ee6ac8aa94f147d141ddd39a5e481c9853fab80e0c89b38345602cba225f7b",
    "assets/template/audio/cues/enemy-impact.wav.import": "9ceb468f04f9461346ba10d9b59ed4e6710b32c22f5090e6e294c9d41fc5aa84",
    "assets/template/audio/cues/game-defeat.wav.import": "fe00eeca3985bdaeeef19dcdd0bb973f3e16a61f997b44115f9020813e8ad0db",
    "assets/template/audio/cues/game-pause.wav.import": "b472eadaac291e57e6867423ad08fc195ed0c58329bd19a2657a5e5188606318",
    "assets/template/audio/cues/game-victory.wav.import": "d9f97b3fa18f9e93f913dc7eebcdf2bf192a4b90f7b2fc6e55ce9dcaee71784c",
    "assets/template/audio/cues/player-action.wav.import": "b60144fc3c0539435b030c791592fad83da503da37cdcd04257d088bbd0436f4",
    "assets/template/audio/cues/score-reward.wav.import": "e73e7dbd33bfee414059decda12d796978e9dc8457a1f46cc2a523cbdf9f1360",
    "assets/template/audio/cues/ui-cancel.wav.import": "ff021d9a2169510bb831be6c3c3a2383225d587ef79b0482b05273ac983c2c0d",
    "assets/template/audio/cues/ui-confirm.wav.import": "dbc76cf6f0fba06b57f092d9802cfbb31474e6f5b815fcd478a903f922c72abe",
    "assets/template/fonts/Figtree-OFL.txt": "140d37233e7f3ce7313798befa9600893bcceaf41a55fa0fa5ad52f7f657a268",
    "assets/template/fonts/Figtree-VF.subset.woff2.import": "adec6e7ee20d48d73c1fa56d30b5093164109c7b2e75c2dad505a78fb8751b60",
    "assets/template/fonts/ManusCC0-Bold.woff2.import": "5a72b2b63a23448521d31997e1332ef11926c300afa37131ed18b1a8ddd8828f",
    "assets/template/fonts/ManusCC0-CC0.txt": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "3f9a56c2656cbf3b6a5af366a1bef2a0928ec41b7beba8a309cb369de87d568d",
    "assets/template/fonts/SOURCES.md": "0bc81fdd97dbc33415f8155adbd8853ead4ae873fc1d864947fe800289241154",
    "assets/template/fonts/display/Cinzel-OFL.txt": "f2b3029aba64c378bf0963b62945eee15e564fe4330b934c8f2eb058282b5e83",
    "assets/template/fonts/display/Cinzel-VF.subset.woff2.import": "36286129c3f309c92cea7af88520961ec2d47f8e12f3a4abd78eaf9307ba2d12",
    "assets/template/fonts/display/NotoSerifSC-OFL.txt": "5e0da210fb04058a8c0087985d2d456b931c2579811a49655721d3cf0c36b6d6",
    "assets/template/fonts/display/NotoSerifSC-VF.subset.woff2.import": "cfea406999bda0e21da22c7754eede643ece89c3c57ce637ed21923760306a43",
    "assets/template/fonts/display/Oswald-OFL.txt": "0fd731a904b729a4e02eaf5e8ebd06783edd9abe400e8882760160230675b652",
    "assets/template/fonts/display/Oswald-VF.subset.woff2.import": "46cacf62a80c3480344aba60e002e2189468218b1b5e14a1d172afd33875f25d",
    "assets/template/fonts/display/comet_heading.tres": "fe33b3eeb11c7ba0b629d1955fb37fddf7dac2cf9cc5d223593475fcc6f91767",
    "assets/template/fonts/display/comet_label.tres": "50e66caad8c8b8beb0eab1ad1c861d77dedf19504d2ec1529775b9d6813b4619",
    "assets/template/fonts/display/comet_number.tres": "6b884b8270affd60e4609535e217f2fb0a4641c5cd38490e6b28cc5c8c37fb16",
    "assets/template/fonts/display/comet_title.tres": "8439b8cc1a9ad84c22e1274f990d280e02cb5edf8a209ecba4f03cb5b87adf7f",
    "assets/template/fonts/display/comet_title_small.tres": "5b30cca28cb186b1892dbb78e41338fa95a6bd5a361338219a64864a933316a9",
    "assets/template/fonts/display/noto_sans_sc_bold.tres": "f1b69e068eb2469cdcfafc2d56528f6a77e3534f816b88192488f2aba3e0c241",
    "assets/template/fonts/display/noto_sans_sc_medium.tres": "cecac556aeec07590da636e5bc1526c6aed914c19c0bc05d8b515c0984835626",
    "assets/template/fonts/display/noto_sans_sc_regular.tres": "9d5e4628f57655ed17e3d0f0246ad4e0d4ff919a04754a8fa1dc7f3ba8da1e0f",
    "assets/template/fonts/display/noto_serif_sc_bold.tres": "80bcc7c6789790b125068c629a16e4b219aa924679ac2013f076ac3e08681196",
    "assets/template/fonts/display/noto_serif_sc_heavy.tres": "e0af2b80cf9f0137f640161d83897a3e09aec9d0ed6282649cc00a2ebfa11d28",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "5896a002b05dafd5ed3793cc711e04bd9d24cb4acb7f7cca7a8408abfad59939",
    "assets/template/fonts/ui_medium.tres": "e64a80f7efde7bcf8d485c5229392c1646ef52fdd973ddeefef7e706ec168aa9",
    "assets/template/fonts/ui_regular.tres": "546c3228b7453f73af8131a05db727db8f0786f1458f4c6df405acbb1199327f",
    "assets/template/mechanisms/bronze-gears/Cog Wheels - Gears/SpriteSheets/Bronze Gear Wheels/Gear 1 - Bronze_spritesheet.png.import": "bb10459ebd9cddd4ad44a687e9c998b419bf7920f7c5cd67466989835de15a46",
    "assets/template/observatory/background-placeholder.webp.import": "d59aae3f37549bd9f46f9ab2b4a5c2d143c28e5695ea77d66b6a61236d2093fc",
    "assets/template/observatory/bumper.png.import": "5f72622ae96ea220a4ff2be0612039fcfd35c86fc499effabcdb587a55c3fa95",
    "assets/template/provenance/AUDIO.md": "366b315271b7c4d7075ec20f086a6b9ba30b1ee97f397ea9c84a2758426fd510",
    "assets/template/provenance/IMAGEGEN.md": "8f2d280337ed1645d3fb4fcee63baebf50d22cc934672cea446c4e16e78e6ae3",
    "assets/template/provenance/source-session-visual-coverage.json": "55f0dc762b2338e90480ccb8668a76d3410330f561fb46cf07bb4f6edab07faa",
    "assets/template/share/v3/favicon.png.import": "bf43033ff2107e21771e1d4f8e17e06c3943cb61d79a03415ad69c94be130c22",
    "assets/template/share/v5/og.png.import": "2268b2c5246afc5f29474c983e9c8f0c96560de85f116b9b78ec64e97b5963a7",
    "autoload/audio_director.gd": "17e952d974ce40ef2ac86626ef25120ea853b84810345f4f4f00f8c918ad49a8",
    "autoload/audio_director.gd.uid": "44d11748a40d2efcd0d0a9ef99c475af618e99b6804b0b528685e800d34ade5b",
    "autoload/manus_font_theme.gd": "a4229205a6972ee0a3f86d99f8f6ec2900baedb4f24ee145f4c63792a6ef3786",
    "autoload/manus_font_theme.gd.uid": "a6cdbe409b07c2eb14d92919088ce09049eaf618d44f6e8860fa3c8a5a074fa8",
    "autoload/tuning_store.gd": "759dc07d1fd1de9e82b627c7bcda16a7b735778ebcb04a84c2cd9922bcfcb440",
    "autoload/tuning_store.gd.uid": "b2f0fdb38316fe788df976aca23da6bd8d0444946ea49be6257f20f8160691f5",
    "build/.gdignore": "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
    "config/pinball-template.json": "972c245dd89f528798430081f18e2c70efaf3c2affc0944fcef95fbce46949d4",
    "config/pinball-template.schema.json": "72d82443e0c0316ca1979a75c01d6e764c8f34ec4d2783fb284da79f96d03f3a",
    "config/stages.json": "f0b200e6779cbba34e9aa23fba502fce3e2302420935081aed8b57927ca0d95e",
    "config/tuning.json": "4deed4af42a78f922c7b2d363b9e0bcdd6083df7fc9a798baee2d5ef1517f686",
    "docs/configuration.md": "75d06d72b09ac741d6f83b901da3997fc2355fb5c06982b7387937104db38c57",
    "docs/development.md": "90df212581c4893468548fd9912439f8c8c6f44e9eb39776cd1eca622162155f",
    "docs/examples/four-bumper-table.json": "9b36eec1bf41eea77424c4f75ce8ac4b3dddb66086fab4ba094d9b7c061f461c",
    "docs/game-multiplayer.md": "af4dfd273e65ff5a1a547b7fedf5a61e039b0f8305e5415962533313eca3ad68",
    "docs/provenance/fonts/manus-cc0-ui-sans/DESIGN.md": "29120cc83c074b2956f06dedaba405d4984cdd18194b6a36b7605205083c6e09",
    "docs/provenance/fonts/manus-cc0-ui-sans/LICENSE": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "docs/provenance/fonts/manus-cc0-ui-sans/README.md": "73d722b538968f0429ccdc86e8c3d779d801265b78a01b5d88f1bd0e72c9cae5",
    "docs/provenance/fonts/replacement-fonts.json": "46e858bce817ab98405b1301910c5bdd85ffd04f0c96f12293b5d6963845b58c",
    "docs/provenance/historical-font-licenses/CinzelDecorative-OFL.txt": "1e5d6660366ddcfca4f2fc10e2acfba9fa4d97d40aec80d7dbfd41d730a420ae",
    "docs/provenance/ip-remediation-pinball-sharing.json": "095184f27acf6c39505d77329580d379a631339d609f90b92dc146c18dccff43",
    "docs/provenance/manus-generated-output-rights.json": "4423a68df087cc39180947025d6b967cc56245003bf304f22c71539c98e69308",
    "docs/provenance/pinball-ledger-coverage-repair.json": "9f37ff5edd103604a10c52e37e208282c937421c414ea8c17c5d30d2bf71b192",
    "docs/provenance/pinball6-generation-tool-receipts.json": "d8725f79d0c34f3c4755080c371971cd08a8ad1cae645c2f9615e5e8d6aa6e23",
    "docs/provenance/pinball6-recovered-provenance-evidence.json": "55afff89ca17eabf10bc3f3d933e6fd619e9b9285950106f447b6f07c9abb31b",
    "docs/provenance/pinball6-selected-transform-actions.json": "3d973e944d650d3e31d5b92e13bcc72be64cc3934aabcb3ebd695e66d8c9d483",
    "docs/source-game.md": "0ea3185c6b7f509879857b923544d413f7bededa0ec0e8c754e45434b37f2ed7",
    "docs/template-acceptance.md": "f37f823589a3027ae6f9e75356283030b217c029bb2c3180f9f7ac3687485a5b",
    "docs/template-baseline.md": "9ed56a35069a7afddbdcbd02c30e6aa7e054f3a60376d00cf6ecd3174abb2aee",
    "export_presets.cfg": "d18264aa917d85bed4209486fd4a63db705401cfca0639fd7f89b2521d11642e",
    "game-sharing.json": "bc00a47b4e9e3828862265db4a070676736717c1aeb4873e18b04290d0c296c6",
    "game-verification.json": "bbebfc314fb3b5f8e0eeadde8f9a0bc309e3442378e0243963438e7aa33cd910",
    "localization/en.json": "e7b4071af0fe80f993ba24062cb97584dc78ce5b568fe04718e396e6fa3b9ac8",
    "localization/zh_CN.json": "45a86faaa6dc7f5ae3ef2280addae9f72ab7e06ff1696683785b558608b70142",
    "package.json": "2358b7428f71ff49636bee1e4156e61e56676e28d6177d153451ef95ddac28b3",
    "project.godot": "3bdddf0533e7e038b70edd67c05a5b8c5620b829a74674e4d3b3d071916b61d1",
    "scenes/main.tscn": "305a60de51a69389ad27e82b1986c7698e05ff0f6f1d7f11deffcd1439e8d9fe",
    "scripts/comet_cabinet.gd": "744459f848641e1d583d2460211c28aba14a91102dec2a55daa80fb4d0b5738b",
    "scripts/comet_cabinet.gd.uid": "dfa9b9c84f295da800305847c4fdbaf02c369a71a89172c3024da0222ef4ab00",
    "scripts/comet_effects.gd": "a0c784f8d1c983c1caabdbfdc1e159bdb04719027bcd389ba233e6e2cd08daca",
    "scripts/comet_effects.gd.uid": "4c4efcfb6da3364f4cfc70e4705c2a76e8e556c0e810323cc9d56e4f87092055",
    "scripts/comet_juice.gd": "f1bb79d1d518e7edc889494d17cf0dd1031643350f27e0b722ac4074351c10c7",
    "scripts/comet_juice.gd.uid": "13492f0c73051ad130bfb25afbf531e18378ccfa335f3d61dff94f610fa1557f",
    "scripts/comet_loading.gd": "d408430735753e68c57ee941f18ee8d16cba9a9d3da4491e441a04b428e580bd",
    "scripts/comet_loading.gd.uid": "068c77a939491696f765086a8e6b07f2396d6e4d95775abb82f8fa4b72ab2b8c",
    "scripts/comet_main.gd": "1ec6ba395d8f1e7b05d2f6c45b1c46d97a062f4e22673096182ad3c785ca45bb",
    "scripts/comet_main.gd.uid": "4ca0e7c7e296085bf92ca86d8814fa3d47acb4542335fed88383738367f789ff",
    "scripts/comet_observatory.gd": "5686455bc2875bb6095a3eaaba8115fef6395ba9afeeebe3084a498fbd838c84",
    "scripts/comet_observatory.gd.uid": "95c661dc0ddca34774f3facb05367508f0a211d79ffd08f83bdae017b72012be",
    "scripts/comet_physics.gd": "5e8268e9bb95f5a109da9800d8acc05a49ae5f17600ac52d4e58013d299fe3af",
    "scripts/comet_physics.gd.uid": "8398190db17df931a86c845bf688ddff2ec392c8356292936fd5f061d8b35754",
    "scripts/comet_rules.gd": "01cb45a90d82c4cd1c1297efd18784251fc9bd69e05bec1c3a5d76091dc2a781",
    "scripts/comet_rules.gd.uid": "34f3db65f56b23140ea0f38cf47fa489db48462f8d861762a129d4da3ecd156b",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_backend.gd.uid": "7648126fdc4409b0a1dd5c52c75bf03fcefc079a1a1769a39721585e017938f4",
    "scripts/manus/browser_bgm_player.gd": "3dfbe63c26ce47cd41a1c50c94ad1bc51eb99a3daf494cec3aa81d123865de5f",
    "scripts/manus/browser_bgm_player.gd.uid": "f8661df44899a3d88460ae106219f611a2d835ce8b86d3ba163c77ab33faf888",
    "scripts/manus/game_fonts.gd": "5b21b0fced1dc026cd04caacb7b04b2654e30003d3be4df0c2cfd5e5eef09346",
    "scripts/manus/game_fonts.gd.uid": "f30e410b65d1422e8750011343ad2a3ec59ffcba149a590fbe5215ed24214e27",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "34a20d61eed30e833684e5bce7440f887adbe1e729f92f227ed2b4af22a644cb",
    "scripts/manus/preview/tuning_adapter.gd": "e6a467791863877ab2518f09e52b55e7606157add2750de28d2fa682875fb86e",
    "scripts/manus/preview/tuning_adapter.gd.uid": "77d409d83035b04fb304b6a48d782ac1cbf904a1cf94059b47164c1fbfd40727",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "194dcb49fcb6c1fbf1bf383ca7513da542147f965590b0a8d23767964322c1a0",
    "scripts/manus/procedural_sfx.gd": "91bd8364dbb2a65af4cd75d7d5a848b10d1fd52e96d11c528a43ab7e3d38b3ba",
    "scripts/manus/procedural_sfx.gd.uid": "37a03b9d86a442e1dcf5bd41188b285121aeb487e2a9d4f37c63a69d9de85706",
    "scripts/pinball_leaderboard.gd": "558840d152efd00c40501b676b32643957b8cfc5345c82fa08deb96a8101e9a9",
    "scripts/pinball_leaderboard.gd.uid": "728a7162a5b5236aeaf18fb1dc358ecbc2bb52e11e0f2e1686c6c9ce4134c953",
    "scripts/pinball_locale.gd": "ebcacae599c8335ce02fee950bcb9545224343c7c48109e3eb1a96e9a90a2cbe",
    "scripts/pinball_locale.gd.uid": "d6c8b49b37d0c7406ac859a493a9aebc298cf06e7e997e30a6c782dd0ef0b65f",
    "scripts/pinball_run.gd": "0424b2343dd3952445937965c1e2d8b0240e6d6831b5494081db40fc2b5e28fb",
    "scripts/pinball_run.gd.uid": "c440a5a9206bec36b35e7e87473fe15d040e9560477ec58463296cddb836f8ef",
    "scripts/pinball_stages.gd": "22a309e23ca7b95efe4d33fe2fe7345a10ba44c0ed9db76946d5b60212856e45",
    "scripts/pinball_stages.gd.uid": "0697e89bc8f1f35a673dd4e16d8771f81134db152994cd77de1671f20836b8a5",
    "scripts/pinball_template.gd": "a16867010c5d581940cbded69c5fe4f5ed483f5839b27f65004354a8d5a66720",
    "scripts/pinball_template.gd.uid": "04609cf8cd60f02b0bd4bf879151998fbea6a5c92392ad80abd1b609f1fb2f49",
    "scripts/pinball_tutorial.gd": "7f145f77fab2a939490325ebedf4cac19457318e51d35a053733bb16c64ecd47",
    "scripts/pinball_tutorial.gd.uid": "92235c317f5f61ec29c0b799ed27906fb783ecdf6ee7eca229be5b6d18606ccd",
    "scripts/template_config.gd": "6c52196337c1bade9d55cbbdd4e355a2d1dbabebeac4be9b51d8538ea69cfe0c",
    "scripts/template_config.gd.uid": "f2cf8c9801e7b2d6501dc6ab8920ad03c66dc4fb667863c7d7ff1c75bd361dc1",
    "shaders/arcade_filter.gdshader": "d7e8c81c94b15dba3a968821d0bcf9da1f91fae4ce0414ed949128c195e1d30f",
    "shaders/arcade_filter.gdshader.uid": "67b9c1e0103203879884919f57813391a9f17426b90a90c798337eae39c73408",
    "template-provenance.json": "847faba53dd78b9bfd0820133611f1b47d61c2f3e6d106db7532ec703f0b8d96",
    "template.json": "a58b76ae5f5d27c0e06f5fbe5214b5b4eb15c2135e7d552ffa54866cff068cf4",
    "tools/bake_comet_cues.gd": "699ace84782da23dd6ec029e7d2723a726d8f45368046a2f5aca5a717a994dfa",
    "tools/bake_comet_cues.gd.uid": "501da5da3683e56c146a553527ffd257d7e18a344189f68f6ff8919383f4a0b8",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/build_cjk_font_subset.py": "5e4f8032f2a38341e912768a5402dfa050043e562ca92410b201db96f4c7b1cf",
    "tools/capture_native.gd": "b41966ceb8384603049eaeb0d2c0a56f2972cf489ed6d12f71f5f5f645bd0326",
    "tools/capture_native.gd.uid": "f4b417256b9452aee391669a59f02506017da12b81bd1438004198e94baed976",
    "tools/check_stage_routing.py": "5e028c01ea42652ee50d4cac2c121cdcaef30ef4c80f10103cf602e5ddf58623",
    "tools/comet_acceptance.gd": "9f9e748c10265f098d6ba723895ade8fd4014802e2833e209cb24a58dad12176",
    "tools/comet_acceptance.gd.uid": "2e8af4ab8d9869d52806e2fbcc33f6fadf779cdfbc967b3690c2380d49c266b9",
    "tools/comet_pack.gd": "da76d11f696c8c3c5919115b2d32c257688808d352390b9ae1c4a0e301ad0dbc",
    "tools/comet_pack.gd.uid": "40daa8cf9b28ba8e1eb5cd13e39a1a7c0a3f02451f0692c514957c5012373b83",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "tools/juice_check.gd": "215e7859397c7561013aa36b87921163f0f69a3637dd911aa6c7da32e5382dd0",
    "tools/juice_check.gd.uid": "04690bfbd56d7e89dd2526d650ff552161a0df094dd33bb29b74d5bb87404146",
    "tools/measure_optional_startup.py": "bed53a87d3fcc8896fb5e71bb418bbc80e97372ad530550056fbd7fea6bd6872",
    "tools/observatory_acceptance.gd": "7e1adef971da1b05a067b3f27a4422d1b0ba78eb0941549b7f0e306b4c5af369",
    "tools/observatory_acceptance.gd.uid": "3089c79fffb8345ef8df5e46096ab4167aafe8e5a59f69a7bfc9d49cc0bf4e21",
    "tools/observatory_probe.gd": "f3c0facfe0f628f27876e308bd73805f57ec187e6ffbfc95fe42f3b245cdd873",
    "tools/observatory_probe.gd.uid": "2cf0f0982a417226fed93f995f3fec663c75a9a195130baf19427bc906584bb9",
    "tools/physics_probe.gd": "f6affab951cc5d3ad4fef51741e60583fb4c7d7ca75d1b8fd99816b725a53e04",
    "tools/physics_probe.gd.uid": "b9eb52c9bb44ea8911deb7b75ee87c40f7c6424ffcc2fe3b03943409d12e7715",
    "tools/pinball_gameplay_check.gd": "a8944aa20d8496ff57002eac8dff75358d7e7499538812fc21c748efd0456096",
    "tools/pinball_gameplay_check.gd.uid": "41fbe4d48fbe1033f49849027c3fe82f9f28211c9b738139484c4976c13b9e3b",
    "tools/pinball_services_check.gd": "0db1039567cfebffce746a319c43054eb2c53fc4a20d6fed8ae4bfa8b3c44fd3",
    "tools/pinball_services_check.gd.uid": "8e9d32cc406d27e7c0a059898ae8aecd691b07a43375a61ef1f70188de01fe7a",
    "tools/pinball_stage_route_check.gd": "d2fdc00646aa559c261173c746367633560943e6c8f02a1612c8ed6f03f97c77",
    "tools/pinball_stage_route_check.gd.uid": "2b853804b93401fcc5bcb042a4e9dddaf7b65c803ca435c77e2cd7e764f75d28",
    "tools/profile_startup.gd": "e043d86f5fbc5251a687ea7f4d2b774d5e40638c58ee2f1352994315f7c3b54c",
    "tools/profile_startup.gd.uid": "82ef0cc6d66d660cc8d23b6b854db68a55538333a9b32e592db5791213b4378f",
    "tools/template_config_check.gd": "9a3cfebc098089308d09462a7f751544c9327eec031edc0bf58d800e38d1a5c6",
    "tools/template_config_check.gd.uid": "c4e23668a003c78f22a43ce6bd41cff8e77658d012907f1067b9f49908bb230b",
    "tools/tuning_acceptance.gd": "b76c1e1efdb378830a15b3514fed41d638d7039f0f9b7796d9ae9db1a4db10aa",
    "tools/tuning_acceptance.gd.uid": "4575d7dba7d891cb147dee5118fbd0bf7bcc7b4b1b64ca4dfab7054c27dfc52f",
    "tools/tuning_generate_catalog.py": "a01ac8288dfd1dd0bdd9174a735c679141d3e5393816cab9384c443749d56d35",
    "tools/tuning_localization.json": "7ab484b031d3e5d9cd1feae3f053b6dd96efaa37b211c68870c2d1a4233f6254",
    "tools/validate_template.gd": "5c5f05ed0e6fe074d32bd7d0b949e863afed8dfb17dd8ec81f86efa380491a11",
    "tools/validate_template.gd.uid": "a6f0697ca10cfcf1b4ae896a7cdc4910054e9dd83036d0b10021a5d62dbddcee",
    "tools/verify.sh": "1924a5a179755f62e7b8b676d3becb8280ac3ba2b2148a6dea1ea9c5ab1485e1",
    "tools/verify_clean_scaffold.sh": "a28c724bc34d9c5e511bac9edbaa2d9cd56c583716e3cb935247736b3c606a3d",
    "web/loader-cjk.json": "cd50bcd0fe25528ae3fe6f8e416b2f29f73b17bd2065ad7a83f334b9db52002b",
    "web/loading.html": "d21a71fbbc52666ac199b0c71fdab8d1ca965077af822327478f939c64d02cd7"
  }
};
// shared/gameStarterFiles.game-generic-multiplayer-v40.json
var gameStarterFiles_game_generic_multiplayer_v40_default = {
  id: "game-generic-multiplayer-v40",
  files: {
    ".gitignore": "a3bc05e1971a91300c924d25bbd7d470e770ca9f96c3b785fa80fdfa99da2bf5",
    ".manus-game-template.json": "0199c4f7697b085594e97e0bbf122e3c0de6b704a6630f9b6abbd906baae4440",
    "README.md": "e29765e5cc3b0a353922a18db8a269f6bbe6794ebe0a1fe8ac9beea78e046e51",
    "asset-provenance.json": "3ff01edd26097857049aee51d78d64414cb07699042c23cfb147e2c397d82229",
    "assets.lock.json": "f436f42ca4aa0574e1f1aef2877e1121368fc764a887ef3bdd418041d502e03d",
    "assets/template/fonts/ManusCC0-Bold.woff2.import": "5a72b2b63a23448521d31997e1332ef11926c300afa37131ed18b1a8ddd8828f",
    "assets/template/fonts/ManusCC0-CC0.txt": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "assets/template/fonts/NotoSansSC-OFL.txt": "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
    "assets/template/fonts/NotoSansSC-VF.subset.woff2.import": "04e621ac612e139d31787de3026a6bc217a22701366cd6a478ef882367d4b2f8",
    "assets/template/fonts/Rubik-OFL.txt": "472cbe7c25441df63e9c7864b43eb3c0f4b3df950c66a76224e6cfe1eae843fb",
    "assets/template/fonts/Rubik-VF.subset.woff2.import": "6726a23426eca92d5959872a1aa353fb9bbe74968001c342b9cbc5c455f80b30",
    "assets/template/fonts/SOURCES.md": "3aced9b16ba5faea894a1caa603044e8fdb3bd5de0e575056a524c3701379a67",
    "assets/template/fonts/display/ZCOOLQingKeHuangYou-OFL.txt": "f1bce31b817dee01c1e4ef8bc45d8ecb95f01f4abbf0a985007cb3cd0fd8123d",
    "assets/template/fonts/display/ZCOOLQingKeHuangYou-Regular.subset.woff2.import": "496b0ec634230146e8f0eec48299b8bbf378f2208f6180f89e70f4ef0304f796",
    "assets/template/fonts/display/pong_caption.tres": "2a7241af6100280f44858be3bbd27899a302565ed9297f11008e726597d6c856",
    "assets/template/fonts/display/pong_code.tres": "776391c96fd55e8b979be1e0cc662bc4a60b4e14227e5f911ed365af9b5a0241",
    "assets/template/fonts/display/pong_score.tres": "770ba1b95e3b9a1795faecfee67c55bc688826535e842c7e714a8ef9bb6aa06d",
    "assets/template/fonts/display/pong_title.tres": "e9869eab3827354ec597412ca3b31bbb8b0c30510cb9c8f5c0bb2a7c054d5364",
    "assets/template/fonts/display/pong_title_tracked.tres": "01a9e71a63927a6fe01e049e91bfc9841c568d1e3fab963b5492510fbc011785",
    "assets/template/fonts/noto_sans_sc_bold.tres": "4fe67cf5a23d3039b97790cdc97480294b719ce9f75492c678ee3e259f69a8d9",
    "assets/template/fonts/noto_sans_sc_medium.tres": "c7a8cb16315fb6f59d85fbd08ea3314421bd6642b9335b75e9751e66ad9864ac",
    "assets/template/fonts/noto_sans_sc_regular.tres": "c6c7da630c0558aad40dd716f561b3da13b0a6806b528d869391ee96909740c0",
    "assets/template/fonts/runtime-cjk.json": "f7e39c42aefdbc7f5151c2b9dc8c2b79e5734f10854c71003628abf21f46a149",
    "assets/template/fonts/ui_bold.tres": "14d6009142f45f5b473ef04decbd229705290a020fe7661612eaf4e618f79f22",
    "assets/template/fonts/ui_medium.tres": "9b10d68c5bb684b15558b73fb06d1507fa84cef2969432bed210af336b084700",
    "assets/template/fonts/ui_regular.tres": "d57c4eb91d01182b92ff927ec136d0ebde505582c7ddce8d217891b7e8316764",
    "autoload/audio_director.gd": "a8f2a60837f4241afc2c1cfe4756e993a631d2ff8f9e1c3f703b81ee972ea1d8",
    "autoload/audio_director.gd.uid": "44d11748a40d2efcd0d0a9ef99c475af618e99b6804b0b528685e800d34ade5b",
    "autoload/i18n.gd": "f98f8829bbc302794f3d50e32b92f8881bec58a9fa777dc1fa16a228c4f96b69",
    "autoload/manus_font_theme.gd": "08a1abcf2bdc4c85f6d1932030e9ffb2c5b856521df2bb98cb2c08d8fb7d17d8",
    "autoload/save_store.gd": "b1d3d4e8d791104e1653ef724b4979d46d854d77da032b285567d3ffb3b6e843",
    "autoload/tuning_store.gd": "93879b31017c132860d78747702c9a213d518af4b681a084c7692e2c55d07831",
    "autoload/tuning_store.gd.uid": "b2f0fdb38316fe788df976aca23da6bd8d0444946ea49be6257f20f8160691f5",
    "config/tuning.json": "3f507b2373a638061087d666478074b23cf2c297ad15fad77b40fb83fb425beb",
    "docs/game-multiplayer.md": "37d38fb0ae2d6bae0b3ae0b46798edf646ae001184d8c75bec9607f61ee6b95a",
    "docs/provenance/fonts/manus-cc0-ui-sans/DESIGN.md": "29120cc83c074b2956f06dedaba405d4984cdd18194b6a36b7605205083c6e09",
    "docs/provenance/fonts/manus-cc0-ui-sans/LICENSE": "a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499",
    "docs/provenance/fonts/manus-cc0-ui-sans/README.md": "73d722b538968f0429ccdc86e8c3d779d801265b78a01b5d88f1bd0e72c9cae5",
    "docs/provenance/fonts/replacement-fonts.json": "3770ba3a502b63bc4591a5b6f332a1b2def5231973b5c14989977bf9dcd6e593",
    "docs/provenance/historical-font-licenses/Audiowide-OFL.txt": "4fe01b13ffb41faa8f030d84843a95dab32792dfeeca7c072abbfd3f4d6896ad",
    "docs/provenance/historical-font-licenses/RussoOne-OFL.txt": "3ac1301549523d9861fedca12871f24e575fbd26d520632fc00ba849b471d275",
    "docs/provenance/historical-font-licenses/index.json": "6d3f1e8d4cc22d881bc479bb5ff39ea60bbd511d96be82d0888d7643afd642c7",
    "export_presets.cfg": "da583147a6e430c2382a762432d207536e0bfb1a2fd5eaa4bd32771c26d4980a",
    "localization/en.json": "77fa8172f3276e7e40c24be57516828b5b7caedb3730e48cd6fa7c407fc687a3",
    "localization/zh-CN.json": "c6bd8481ce25f7fd7d99cb3077150897022b641a63e0510a98ffd6d30b240795",
    "multiplayer/config.json": "5c238bf7954a674babd5795e5337342badd767afe138daea1d83d2b218cc3f3a",
    "package.json": "6f1942486b6b0517040c3ac550a663efda4a82daea295c8459886c99bcb08d70",
    "project.godot": "439c0723b67a1eefa9ff2d02ac22d03a3fcb58028d7cda945ba897a87e59121d",
    "scenes/main.tscn": "2c2f3bb1b1a610ad695f4a05dd6012033ce6dc0c6a158824d4d7db1ff64ad5f4",
    "scripts/game/local_paddle.gd": "bbd780b961043fab8c80b13743d850ab6687425e2072cd6d2dea5ba0c4111135",
    "scripts/game/local_paddle.gd.uid": "1b3c973b60ca6f3dc4c1a8838e92625ce9fecda6e9acf9da355581be654fda7a",
    "scripts/game/pong_board.gd": "fa62953ac10b9c7c7d6bcb48ae21b5c34d4609ff73c3836da9a97ab5a8bed6e9",
    "scripts/game/pong_board.gd.uid": "e00ae3d97fb99fd89035b6064a2a4d70d29c6b8e1a8992cbb3de630d24ac1354",
    "scripts/game/remote_court.gd": "df03351406fe7c3d599fe09be88c3ec61fed4936b3d8ad31b76a8740397b8a4a",
    "scripts/game/remote_court.gd.uid": "50c88cd43bf27559f7d73420ec331f2d3c68c469586ef58d51a0dd0a5134a540",
    "scripts/main.gd": "b09d495645721a4b088c0005be09fa1dcbe4428dae5b7a5c3ba46a71189db5a5",
    "scripts/main.gd.uid": "aec5eec5c93acebec914a186b8a02aeea46038efbae3ae0b278475025d1de13b",
    "scripts/manus/browser_bgm_backend.gd": "8729604ee5303c35698fe8cfaad32d32995bc3c0dba707eb4ae51cf74d848363",
    "scripts/manus/browser_bgm_player.gd": "3dfbe63c26ce47cd41a1c50c94ad1bc51eb99a3daf494cec3aa81d123865de5f",
    "scripts/manus/game_fonts.gd": "8dd5317e8277d5e548cf6e93210a8d306e1e0c11107067ec936aad5385c0345d",
    "scripts/manus/open_source_licenses.gd": "65b9fa2d91dcf52b610e0322369c59004492370788b00f5a728097726bfee07f",
    "scripts/manus/open_source_licenses.gd.uid": "07045f0c49deef012f67c62b75fe7ebbee9b6e4e488a90199ca83f2d44e11733",
    "scripts/manus/preview/tuning_adapter.gd": "9d067ddcdd0782e9f937cf78a2ff4c43a15a6707b2b160991e4d9552a5d06e84",
    "scripts/manus/preview/tuning_adapter.gd.uid": "187c7cdba4659ed2e775628eea1dabc3ab2807c33e2b11dd467bffaaba3f1ad8",
    "scripts/manus/preview/tuning_transport.gd": "e1798ba46aa817f81eeee933ed461d562113f7eee649036d1ca8d7fa16c54a51",
    "scripts/manus/preview/tuning_transport.gd.uid": "af3ec1f75906d7d3431cc088cbd87d82d9bacc3d38fda12107702a1bca0e7c66",
    "scripts/net/connection.gd": "21ecb90562dd803c5fb4210b15fbd8209017c82cf78b3bccbb2ee980955b9529",
    "scripts/net/connection.gd.uid": "265469c882f779bc60978552f2dbe0e6c16eb94facc1ee32213f0ce4b18fd89e",
    "scripts/net/protocol.gd": "468ca82aeda99532d7d53e892dd58d58a54fd97730b00542ea05c78e5a24fe67",
    "scripts/ui/attract_court.gd": "0aa08d4eb3ed541152ecb32a49352fd242756258ec7d20f4c683d3e7670a2860",
    "scripts/ui/attract_court.gd.uid": "7a6dfa2c407a91f67663c788b68c7e88b3532d94254b2298eabad4f9232828cb",
    "scripts/ui/neon_text.gd": "e086e3154d9e5716ee39b8d0f5eb21efd2df253bf5bde6d6ff0e9570a8804b9b",
    "scripts/ui/neon_text.gd.uid": "d0e2d55d9a7faf0e087d7a758c0033ef2fa68becf7d4440de595ca50626d3a9f",
    "scripts/ui/scoreboard.gd": "a4a3a06c2c7018de83bdeeea8b38542aa85e186c0ba243f4252c813e279534f4",
    "scripts/ui/scoreboard.gd.uid": "7635b745fe72b16409e967877c7899e381fc828a84f64ec762bd430b2de65622",
    "server/README.md": "d5a8cd99558359873630aa15348e4c0adbc35449e08834b7ef2a3aceb72a1010",
    "server/authoritative_server.mjs": "615ae90b696722a08a6e3bc775e2fff3c5278dbb577e8956b59513914df258a7",
    "server/e2e_clients.mjs": "024713dbe97dff80f14170000d3017d39866f0ef50335e13b3fee7e13549e5fb",
    "server/package.json": "192cdc66d63c39e03087e5049bbf6fab366bed2ebdbbe0a3f0f4b6c736399ac9",
    "server/pnpm-lock.yaml": "0581afafc7e17e6dba51d572651040f1944d143df5757f2d74389429f8333ee4",
    "server/pong.service.example": "16cb2fa1a6d2a7312e995e8446d4098a4c0989706bace8c0927cb6f7c98802f8",
    "server/server.test.mjs": "1eadfa909840303f1378549d373b7c502ef7068ed2840db293ad05fd82fae1d9",
    "shaders/crt_overlay.gdshader": "59b361636852f86943de0f088e6d6a8d5238df77607c0de9ec7ac6a23d0307e4",
    "shaders/crt_overlay.gdshader.uid": "a3dad3ef4ae60b6986752f98cdcac62cf2d4caae3087826bf91ff181e8925580",
    "template-provenance.json": "8a896542a45e69b798d8e399570169382513b62acdb4a6aaa6433d8539dc28f0",
    "template.json": "e1ef427d9af3d805c54c143a5031176ca6e2244caab7cf70a8c07a4af18cb80c",
    "test/browser_bgm_regression.gd": "b965bc4d8018f6df3b2750442f95c1dac2dd7e3370241b40c086ab680524a99a",
    "test/native_network.mjs": "41d1cfad2ac6b03a40e19b14fa1fe673715353d127697d025d257246017ba7e3",
    "test/network_client.gd": "36cbf4635f73fd45b360569db67b8b41eb007a44cb5b196258e52084846b248f",
    "test/test_suite.gd": "64111626e2df80d280f9541583232bb6d2910cc4f44ad026d4a881fcca2a9818",
    "test/test_suite.gd.uid": "535e2375d60b20e645f018f4fed693b4e3eb1bd2975c4efd21546780230a5262",
    "test/test_suite.tscn": "b1a8f56955632eaa7a21debdfc0849ad6c2063c1bb73255a7d53ef5b1df2a8ae",
    "test/tweak_controls.gd": "781f4117ea7fa0c1933f37a80825d332a4824afd0a8d9309744a7b4232fc91df",
    "tools/audit_resources.mjs": "5af38e68fb4e8561d512c539970657a7ac9a3e36f65284379fbb37482647810d",
    "tools/build_cjk_font.py": "f7e25809d09aa93d8b6452e39b1c33bd4765ee8e3f52ef8ca84704ab5b781854",
    "tools/capture_native.gd": "ecbf23484c7b79927345ae18e1f5bf56fd3f34f1f4593c3b7d30708b8a5652aa",
    "tools/capture_native.gd.uid": "f4b417256b9452aee391669a59f02506017da12b81bd1438004198e94baed976",
    "tools/game-runtime-font-codepoints.json": "12f677fdbc8c1890f9362d55b5090fc4d1c813f4e0150363bbae19528a82b92b",
    "tools/game-runtime-font.json": "ea70d4ee095fdf4f6759595ebd710f90687c3a23ccba9eada04bf438af9d2a00",
    "tools/game-runtime-font.requirements.txt": "98d59428220e0d21481693d768726d3279459b86f686bfd2588d681fee633b9e",
    "tools/install_cjk_font.py": "1f67d93066891836ac0da74744d106bdec634e5897a4243cc541866f962415df",
    "tools/verify.sh": "97f298aa2438338f3e085df1bf20375bde72c197ca58fdc26e668cc6aaca4b11",
    "tools/verify_clean_scaffold.sh": "f7176c6b1acbe0c8a1122cdce6b35fd2c8b1f5536ce0ca86ffc48305d192b6d0",
    "tools/verify_exported_pack.gd": "5eb50087614c12a5d6fcabcbd0647a65ca6648e73b0564775327cb21f50cedbe",
    "tools/verify_exported_pack.gd.uid": "e5973a18b1fa1a3c0d5ae81d2a6050d08f95b9bb819e458b310268945f445467",
    "web/loader-cjk.json": "cd50bcd0fe25528ae3fe6f8e416b2f29f73b17bd2065ad7a83f334b9db52002b",
    "web/loading.html": "e9d8c117cadd9dc88e060126a6566cf1b86dd7d4b2a8bc61abf3ac8c89f63020"
  }
};

// shared/gameStarterAsset.ts
import fs2 from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
var PACKAGED_GAME_STARTER_MANIFESTS = [
  gameStarterFiles_game_generic_v56_default,
  gameStarterFiles_game_platformer_v62_default,
  gameStarterFiles_game_bullet_hell_v52_default,
  gameStarterFiles_game_vertical_platformer_v63_default,
  gameStarterFiles_game_scroller_v63_default,
  gameStarterFiles_game_td_v67_default,
  gameStarterFiles_game_rts_v63_default,
  gameStarterFiles_game_trading_card_v56_default,
  gameStarterFiles_game_puzzle_v63_default,
  gameStarterFiles_game_pinball_v9_default,
  gameStarterFiles_game_generic_multiplayer_v40_default
];
function gameStarterManifest(id) {
  const selected = PACKAGED_GAME_STARTER_MANIFESTS.find((item) => item.id === id);
  if (!selected)
    throw new Error(`Game starter revision unavailable: ${id}`);
  return selected;
}
var GAME_STARTER_ID = gameStarterFiles_game_generic_v56_default.id;
var GAME_STARTER_FILES = gameStarterFiles_game_generic_v56_default.files;
function assertFrozenGameStarter(root, id = GAME_STARTER_ID) {
  const files = gameStarterManifest(id).files;
  const seen = new Set;
  function visit(relative = "") {
    const directory = path.join(root, relative);
    if (fs2.lstatSync(directory).isSymbolicLink())
      throw new Error("Game starter cannot contain symlinks");
    for (const entry of fs2.readdirSync(directory, { withFileTypes: true })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (name.startsWith("assets/") && name !== "assets/template" && !name.startsWith("assets/template/")) {
        throw new Error(`Game starter assets must be under assets/template/: ${name}`);
      }
      if (entry.isDirectory()) {
        if (!Object.keys(files).some((file) => file.startsWith(`${name}/`)))
          throw new Error(`Unexpected starter directory: ${name}`);
        visit(name);
      } else {
        if (!entry.isFile() || !(name in files))
          throw new Error(`Unexpected starter entry: ${name}`);
        const digest2 = createHash("sha256").update(fs2.readFileSync(path.join(root, name))).digest("hex");
        if (digest2 !== files[name])
          throw new Error(`Game starter content changed: ${name}`);
        seen.add(name);
      }
    }
  }
  visit();
  if (seen.size !== Object.keys(files).length)
    throw new Error("Game starter is incomplete");
  const lock = JSON.parse(fs2.readFileSync(path.join(root, "assets.lock.json"), "utf8"));
  for (const [name, asset] of Object.entries(lock.assets)) {
    if (!name.startsWith("assets/template/") || path.posix.normalize(name) !== name || asset.groupId !== "template") {
      throw new Error(`Game starter media must be under assets/template/ in the template group: ${name}`);
    }
  }
}

// mcp/init/gameStarter.ts
async function materializeGameStarter(projectDirectory, sourceDirectory, starterId = GAME_STARTER_ID, projectFiles = new Map) {
  return materializeGameStarterOnce(projectDirectory, sourceDirectory, starterId, projectFiles);
}
async function materializeGameStarterOnce(projectDirectory, sourceDirectory, starterId, projectFiles) {
  const moduleDirectory = path2.dirname(fileURLToPath(import.meta.url));
  const source = sourceDirectory ?? path2.resolve(moduleDirectory, "../../starters", starterId);
  assertFrozenGameStarter(source, starterId);
  const root = path2.resolve(projectDirectory);
  async function directory(target) {
    const parent = path2.dirname(target);
    if (parent !== target) {
      await directory(parent);
      try {
        await fs3.mkdir(target);
      } catch (error) {
        if (error.code !== "EEXIST")
          throw error;
      }
    }
    const stat = await fs3.lstat(target);
    if (!stat.isDirectory() || stat.isSymbolicLink())
      throw new Error(`Unsafe project directory: ${target}`);
  }
  await directory(root);
  const files = [...new Set([...Object.keys(gameStarterManifest(starterId).files), ...projectFiles.keys()])];
  const expectedFile = async (name) => projectFiles.get(name) ?? await fs3.readFile(path2.join(source, name));
  for (const name of files) {
    const target = path2.join(root, name);
    await directory(path2.dirname(target));
    try {
      const stat = await fs3.lstat(target);
      if (!stat.isFile() || stat.isSymbolicLink() || !(await fs3.readFile(target)).equals(await expectedFile(name))) {
        throw new Error(`Existing project file differs: ${name}`);
      }
    } catch (error) {
      if (error.code !== "ENOENT")
        throw error;
    }
  }
  for (const name of files) {
    const target = path2.join(root, name);
    const expected = await expectedFile(name);
    const temporary = `${target}.starter-${randomUUID()}`;
    try {
      await fs3.writeFile(temporary, expected, { flag: "wx", mode: !projectFiles.has(name) && (await fs3.stat(path2.join(source, name))).mode & 73 ? 493 : 420 });
      try {
        await fs3.copyFile(temporary, target, constants.COPYFILE_EXCL);
      } catch (error) {
        if (error.code !== "EEXIST")
          throw error;
        const stat = await fs3.lstat(target);
        if (!stat.isFile() || stat.isSymbolicLink() || !(await fs3.readFile(target)).equals(expected)) {
          throw new Error(`Existing project file differs: ${name}`);
        }
      }
    } finally {
      await cleanupTemporaryStarterFile(temporary);
    }
  }
  return { starter: starterId, projectDirectory: root, files: files.length };
}

// scripts/game-starter-cli.ts
var project = process.argv[2];
if (!project)
  throw new Error("Usage: game-starter <project-directory>");
var choice = process.argv[3] ?? "generic";
if (!isGameStarterChoice(choice))
  throw new Error("Unknown Game starter");
var starter = gameStarterRevision(choice);
var root = path3.dirname(fileURLToPath2(import.meta.url));
var packaged = path3.resolve(root, "starters", starter);
var source = existsSync(packaged) ? packaged : path3.resolve(root, "../starters", starter);
console.log(JSON.stringify(await materializeGameStarter(project, source, starter)));
