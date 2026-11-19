// shared/constants.ts
var ADDON_ID = "manus-triggers";
var ADDON_VERSION = "0.0.64";

// mcp/triggerConfiguration.ts
var UINT64_MAX = (1n << 64n) - 1n;
var INT64_MAX = (1n << 63n) - 1n;
var STRING_64 = { type: "string", maxLength: 64 };
var TIMESTAMP = { type: "string", minLength: 1, maxLength: 64, format: "date-time" };
var STRUCT = { type: "object", additionalProperties: true };
var MAX_FILTER_GROUPS = 10;
var MAX_GROUP_CONDITIONS = 20;
var MAX_FILTER_CONDITIONS = 100;
var FILTER_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    groups: {
      type: "array",
      description: "OR across groups; omit groups or use an empty array for no filter.",
      maxItems: MAX_FILTER_GROUPS,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditions: {
            type: "array",
            description: "AND within this group. Empty groups and recursive groups are not allowed.",
            minItems: 1,
            maxItems: MAX_GROUP_CONDITIONS,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                field_key: { type: "string", minLength: 1, maxLength: 64 },
                operator: { type: "string", minLength: 1, maxLength: 32 },
                value: { description: "Exact operand shape from event discovery. Omit for operand-free operators; preserve decimal strings and object keys." },
                case_sensitive: { type: "boolean" }
              },
              required: ["field_key", "operator"]
            }
          }
        },
        required: ["conditions"]
      }
    }
  }
};
var NEW_SESSION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    task_mode: { type: "string", enum: ["", "lite", "standard", "max"] },
    max_effort: {
      type: "string",
      enum: ["", "medium", "high", "extra", "ultra"],
      description: 'Max reasoning effort; only with task_mode "max". Omit unless the user asks for it.'
    },
    cloud_pc_id: STRING_64,
    desktop_binding: {
      type: "object",
      additionalProperties: false,
      properties: {
        device_id: { ...STRING_64, minLength: 1 },
        folder_path: { type: "string", minLength: 1, maxLength: 1024 }
      },
      required: ["device_id", "folder_path"]
    }
  }
};
var TARGET_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: { type: "string", enum: ["current_session", "new_session"] },
    session_uid: STRING_64,
    new_session: NEW_SESSION_SCHEMA
  },
  required: ["mode"]
};
var CONNECTOR_ACCOUNT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    connector_uid: { type: "string", minLength: 1 },
    account_uid: { type: "string" }
  },
  required: ["connector_uid"]
};
var COMMON_PROPERTIES = {
  title: { type: "string", maxLength: 255 },
  description: {
    type: "string",
    maxBytes: 8192,
    description: "User-facing summary of what this Trigger does, separate from the executable instruction."
  },
  instruction: {
    type: "string",
    minLength: 1,
    maxBytes: 8192,
    description: "Executable instruction for the receiving Agent. Use {{payload}} where event data should appear."
  },
  target: TARGET_SCHEMA,
  expires_at: TIMESTAMP,
  connectors: {
    type: "array",
    maxItems: 50,
    items: { type: "string" }
  },
  connector_accounts: {
    type: "array",
    maxItems: 200,
    items: CONNECTOR_ACCOUNT_SCHEMA
  },
  project_id: STRING_64
};
var SCHEDULE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    interval: {
      type: "object",
      additionalProperties: false,
      properties: {
        every_ms: { type: "string", format: "positive-int64" },
        anchor_at: TIMESTAMP
      },
      required: ["every_ms"]
    },
    cron: {
      type: "object",
      additionalProperties: false,
      properties: {
        expression: { type: "string", minLength: 1, maxLength: 128 },
        timezone: { type: "string", minLength: 1, maxLength: 64 }
      },
      required: ["expression", "timezone"]
    },
    once: {
      type: "object",
      additionalProperties: false,
      properties: {
        fire_at: TIMESTAMP,
        timezone: { type: "string", minLength: 1, maxLength: 64 }
      },
      required: ["fire_at", "timezone"]
    }
  },
  oneOf: [
    { required: ["interval"] },
    { required: ["cron"] },
    { required: ["once"] }
  ]
};
var BINDING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    mailbox: {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", enum: ["mail_user", "mail_telecom"] },
        mailbox_uid: { type: "string", minLength: 1, maxLength: 128 }
      },
      required: ["kind", "mailbox_uid"]
    },
    slack: {
      type: "object",
      additionalProperties: false,
      properties: {
        workspace_uid: { type: "string", minLength: 1, maxLength: 128 },
        channel_uid: { type: "string", maxLength: 128 }
      },
      required: ["workspace_uid"]
    },
    connector: {
      type: "object",
      additionalProperties: false,
      properties: {
        account_uid: { type: "string", maxLength: 128 },
        resource_uid: { type: "string", maxLength: 512 }
      }
    }
  },
  oneOf: [
    { required: ["mailbox"] },
    { required: ["slack"] },
    { required: ["connector"] }
  ]
};
var ENTRY_COMMON_PROPERTIES = {
  source: { type: "string", minLength: 1, maxLength: 64 },
  event_type: { type: "string", minLength: 1, maxLength: 64 },
  params: { ...STRUCT, description: "Discovered acquisition settings only; business predicates belong in filter." },
  filter: FILTER_SCHEMA,
  schedule_spec: SCHEDULE_SCHEMA,
  binding: BINDING_SCHEMA,
  enabled: { type: "boolean" }
};
var ENTRY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    entry_uid: { type: "string", maxLength: 65 },
    webhook_suffix: { type: "string", minLength: 1, maxLength: 64 },
    ...ENTRY_COMMON_PROPERTIES
  },
  required: ["source", "event_type"]
};
var ENTRIES_SCHEMA = {
  type: "array",
  minItems: 1,
  maxItems: 10,
  items: ENTRY_SCHEMA
};
var CREATE_ENTRIES_SCHEMA = {
  type: "array",
  minItems: 1,
  maxItems: 10,
  items: {
    type: "object",
    additionalProperties: false,
    properties: ENTRY_COMMON_PROPERTIES,
    required: ["source", "event_type"]
  }
};
var CONFIGURATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: { type: "string", enum: ["fixed", "script"] },
    ...COMMON_PROPERTIES,
    fixed: {
      type: "object",
      additionalProperties: false,
      properties: { entries: ENTRIES_SCHEMA },
      required: ["entries"]
    },
    script: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", minLength: 1, maxBytes: 65536 },
        schedule_spec: SCHEDULE_SCHEMA
      },
      required: ["code", "schedule_spec"]
    }
  },
  required: ["mode", "title", "instruction", "target"],
  oneOf: [{ required: ["fixed"] }, { required: ["script"] }]
};
function validateInput(schema, value) {
  try {
    validateSchema(schema, value, "$");
  } catch (error) {
    throw new InputValidationError(error instanceof Error ? error.message : String(error));
  }
}

class InputValidationError extends Error {
  code = "invalid_argument";
  constructor(message) {
    super(message);
    this.name = "InputValidationError";
  }
}
function validateConfigurationShape(value) {
  if (!isRecord(value))
    throw new Error("$ must be an object");
  const fixed = value.fixed;
  const script = value.script;
  if (value.mode === "fixed") {
    if (!isRecord(fixed) || script !== undefined) {
      throw new Error('$.mode "fixed" requires fixed and forbids script');
    }
    const entries = fixed.entries;
    if (!Array.isArray(entries))
      throw new Error("$.fixed.entries must be an array");
    for (let index = 0;index < entries.length; index += 1) {
      const entry = entries[index];
      if (!isRecord(entry))
        throw new Error(`$.fixed.entries[${index}] must be an object`);
      validateEntryShape(entry, `$.fixed.entries[${index}]`);
    }
    return;
  }
  if (value.mode === "script") {
    if (!isRecord(script) || fixed !== undefined) {
      throw new Error('$.mode "script" requires script and forbids fixed');
    }
    return;
  }
  throw new Error('$.mode must be "fixed" or "script"');
}
function validateEntryShape(entry, path) {
  const source = entry.source;
  const hasSchedule = entry.schedule_spec !== undefined;
  const hasBinding = entry.binding !== undefined;
  const hasWebhookSuffix = entry.webhook_suffix !== undefined;
  if (typeof entry.event_type !== "string" || entry.event_type.length === 0) {
    throw new Error(`${path} source requires the discovered event_type`);
  }
  if (source === "webhook") {
    if (hasSchedule || hasBinding) {
      throw new Error(`${path} source "webhook" forbids schedule_spec and binding`);
    }
    return;
  }
  if (hasWebhookSuffix) {
    throw new Error(`${path} source forbids webhook_suffix`);
  }
  if (source === "schedule") {
    if (!hasSchedule || hasBinding) {
      throw new Error(`${path} source "schedule" requires schedule_spec and forbids binding`);
    }
    return;
  }
  if (hasSchedule) {
    throw new Error(`${path} source forbids schedule_spec`);
  }
}
function validateSchema(schema, value, path) {
  const allOf = schema.allOf;
  if (Array.isArray(allOf)) {
    for (const part of allOf)
      validateSchema(asSchema(part, `${path} allOf`), value, path);
  }
  const oneOf = schema.oneOf;
  if (Array.isArray(oneOf)) {
    let matches = 0;
    for (const option of oneOf) {
      try {
        validateSchema(asSchema(option, `${path} oneOf`), value, path);
        matches += 1;
      } catch {}
    }
    if (matches !== 1)
      throw new Error(`${path} must match exactly one allowed shape`);
  }
  const anyOf = schema.anyOf;
  if (Array.isArray(anyOf)) {
    let matches = 0;
    for (const option of anyOf) {
      try {
        validateSchema(asSchema(option, `${path} anyOf`), value, path);
        matches += 1;
      } catch {}
    }
    if (matches === 0)
      throw new Error(`${path} must match an allowed shape`);
  }
  const expected = schema.type;
  if (typeof expected === "string")
    validateType(expected, value, path);
  if (Array.isArray(expected)) {
    if (!expected.some((type) => typeof type === "string" && typeMatches(type, value))) {
      throw new Error(`${path} has an invalid type`);
    }
  }
  const enumValues = schema.enum;
  if (Array.isArray(enumValues) && !enumValues.some((option) => Object.is(option, value))) {
    throw new Error(`${path} must be one of ${enumValues.map((option) => JSON.stringify(option)).join(", ")}`);
  }
  if (typeof value === "string")
    validateString(schema, value, path);
  if (typeof value === "number")
    validateNumber(schema, value, path);
  if (Array.isArray(value))
    validateArray(schema, value, path);
  if (isRecord(value))
    validateObject(schema, value, path);
  if (schema === FILTER_SCHEMA)
    validateFilterShape(value, path);
  if (schema === CONFIGURATION_SCHEMA)
    validateConfigurationShape(value);
}
function validateFilterShape(filter, path) {
  const groups = filter.groups;
  let total = 0;
  groups?.forEach((group, groupIndex) => {
    total += group.conditions.length;
    if (total > MAX_FILTER_CONDITIONS) {
      throw new Error(`${path} must contain at most ${MAX_FILTER_CONDITIONS} conditions in total`);
    }
    group.conditions.forEach((condition, conditionIndex) => {
      if (Object.hasOwn(condition, "value")) {
        validateJsonValue(condition.value, `${path}.groups[${groupIndex}].conditions[${conditionIndex}].value`);
      }
    });
  });
}
function validateType(type, value, path) {
  if (!typeMatches(type, value))
    throw new Error(`${path} must be ${type}`);
}
function typeMatches(type, value) {
  switch (type) {
    case "object":
      return isRecord(value);
    case "array":
      return Array.isArray(value);
    case "string":
      return typeof value === "string";
    case "integer":
      return typeof value === "number" && Number.isSafeInteger(value);
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "boolean":
      return typeof value === "boolean";
    case "null":
      return value === null;
    default:
      throw new Error(`unsupported schema type ${JSON.stringify(type)}`);
  }
}
function validateString(schema, value, path) {
  const minLength = numberKeyword(schema, "minLength");
  const maxLength = numberKeyword(schema, "maxLength");
  const maxBytes = numberKeyword(schema, "maxBytes");
  if (minLength !== undefined && [...value].length < minLength)
    throw new Error(`${path} must be at least ${minLength} characters`);
  if (maxLength !== undefined && [...value].length > maxLength)
    throw new Error(`${path} must be at most ${maxLength} characters`);
  if (maxBytes !== undefined && Buffer.byteLength(value) > maxBytes)
    throw new Error(`${path} must be at most ${maxBytes} bytes`);
  if (typeof schema.pattern === "string" && !new RegExp(schema.pattern).test(value)) {
    throw new Error(`${path} has an invalid format`);
  }
  if (schema.format === "date-time" && (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value)))) {
    throw new Error(`${path} must be an RFC3339 timestamp with an explicit UTC offset`);
  }
  if (schema.format === "positive-int64")
    validateIntegerString(value, 1n, INT64_MAX, path);
  if (schema.format === "uint64")
    validateIntegerString(value, 0n, UINT64_MAX, path);
}
function validateNumber(schema, value, path) {
  const minimum = numberKeyword(schema, "minimum");
  const maximum = numberKeyword(schema, "maximum");
  const exclusiveMinimum = numberKeyword(schema, "exclusiveMinimum");
  const exclusiveMaximum = numberKeyword(schema, "exclusiveMaximum");
  if (minimum !== undefined && value < minimum)
    throw new Error(`${path} must be >= ${minimum}`);
  if (maximum !== undefined && value > maximum)
    throw new Error(`${path} must be <= ${maximum}`);
  if (exclusiveMinimum !== undefined && value <= exclusiveMinimum)
    throw new Error(`${path} must be > ${exclusiveMinimum}`);
  if (exclusiveMaximum !== undefined && value >= exclusiveMaximum)
    throw new Error(`${path} must be < ${exclusiveMaximum}`);
}
function validateArray(schema, value, path) {
  const minItems = numberKeyword(schema, "minItems");
  const maxItems = numberKeyword(schema, "maxItems");
  if (minItems !== undefined && value.length < minItems)
    throw new Error(`${path} must contain at least ${minItems} items`);
  if (maxItems !== undefined && value.length > maxItems)
    throw new Error(`${path} must contain at most ${maxItems} items`);
  if (schema.items !== undefined) {
    const itemSchema = asSchema(schema.items, `${path} items`);
    value.forEach((item, index) => validateSchema(itemSchema, item, `${path}[${index}]`));
  }
}
function validateObject(schema, value, path) {
  const properties = isRecord(schema.properties) ? schema.properties : {};
  const required = schema.required;
  if (Array.isArray(required)) {
    for (const key of required) {
      if (typeof key !== "string")
        throw new Error(`${path} has an invalid schema`);
      if (!(key in value) || value[key] === undefined)
        throw new Error(`${path}.${key} is required`);
    }
  }
  const additional = schema.additionalProperties;
  for (const [key, item] of Object.entries(value)) {
    const itemPath = `${path}.${key}`;
    if (key in properties) {
      validateSchema(asSchema(properties[key], itemPath), item, itemPath);
      continue;
    }
    if (additional === false)
      throw new Error(`${itemPath} is not allowed`);
    if (isRecord(additional))
      validateSchema(additional, item, itemPath);
    else if (additional === true)
      validateJsonValue(item, itemPath);
  }
}
function validateJsonValue(value, path) {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return;
  if (typeof value === "number") {
    if (!Number.isFinite(value))
      throw new Error(`${path} must be JSON-serializable`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateJsonValue(item, `${path}[${index}]`));
    return;
  }
  if (isRecord(value)) {
    Object.entries(value).forEach(([key, item]) => validateJsonValue(item, `${path}.${key}`));
    return;
  }
  throw new Error(`${path} must be JSON-serializable`);
}
function validateIntegerString(value, minimum, maximum, path) {
  if (!/^(?:0|[1-9][0-9]*)$/.test(value))
    throw new Error(`${path} must be a decimal integer string`);
  const parsed = BigInt(value);
  if (parsed < minimum || parsed > maximum)
    throw new Error(`${path} is outside the supported integer range`);
}
function numberKeyword(schema, key) {
  const value = schema[key];
  if (value === undefined)
    return;
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new Error(`invalid ${key} schema keyword`);
  return value;
}
function asSchema(value, context) {
  if (!isRecord(value))
    throw new Error(`${context} schema must be an object`);
  return value;
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// mcp/bizClient.ts
var SERVICE_PATH = "triggers.v1.TriggersSandboxService";
var CALL_TIMEOUT_MS = 15000;
var PREPARATION_TIMEOUT_MS = 50000;
var DRY_RUN_TIMEOUT_MS = 50000;
var UINT64_MAX2 = (1n << 64n) - 1n;
var INT64_MAX2 = (1n << 63n) - 1n;
var METHOD_TIMEOUT_MS = {
  CreateTrigger: PREPARATION_TIMEOUT_MS,
  UpdateTrigger: PREPARATION_TIMEOUT_MS,
  SetTriggerEnabled: PREPARATION_TIMEOUT_MS,
  DeleteTrigger: CALL_TIMEOUT_MS,
  GetTrigger: CALL_TIMEOUT_MS,
  ListTriggers: CALL_TIMEOUT_MS,
  ListTriggerEventCatalog: CALL_TIMEOUT_MS,
  ListTriggerOptions: CALL_TIMEOUT_MS,
  ListExecutions: CALL_TIMEOUT_MS,
  GetExecution: CALL_TIMEOUT_MS,
  DryRunScript: DRY_RUN_TIMEOUT_MS,
  DryRunEntry: DRY_RUN_TIMEOUT_MS,
  ListDataApis: CALL_TIMEOUT_MS,
  PreviewSchedule: CALL_TIMEOUT_MS
};

class TriggerApiError extends Error {
  code;
  fieldErrors;
  constructor(message, code, fieldErrors = []) {
    super(message);
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.name = "TriggerApiError";
  }
}

class TriggersSandboxClient {
  async call(method, body, auth, options = {}) {
    if (!Object.hasOwn(METHOD_TIMEOUT_MS, method)) {
      throw new TriggerApiError(`Unsupported Trigger sandbox RPC: ${String(method)}`);
    }
    const url = `${auth.endpoint}/${SERVICE_PATH}/${method}`;
    const defaultTimeoutMs = METHOD_TIMEOUT_MS[method];
    const requestedTimeoutMs = options.timeoutMs ?? defaultTimeoutMs;
    if (!Number.isFinite(requestedTimeoutMs) || requestedTimeoutMs <= 0) {
      throw new TriggerApiError("Trigger API timeout must be a positive number");
    }
    const timeoutMs = Math.max(1, Math.min(defaultTimeoutMs, Math.floor(requestedTimeoutMs)));
    let response;
    let text;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(body),
        redirect: "error",
        signal: AbortSignal.timeout(timeoutMs)
      });
      text = await response.text();
    } catch (error) {
      throw transportError(method, error);
    }
    if (!response.ok)
      throwConnectError(response.status, text);
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new TriggerApiError(`${method} returned non-JSON response`);
    }
    if (!isRecord2(parsed))
      throw new TriggerApiError(`${method} returned a non-object JSON response`);
    return normalizeResponse(method, parsed);
  }
}
function normalizeTrigger(raw) {
  const trigger = record(raw, "Trigger response");
  const configuration = normalizeConfiguration(read(trigger, "configuration"));
  const mode = configuration.mode;
  try {
    validateInput(CONFIGURATION_SCHEMA, configuration);
  } catch (error) {
    throw new TriggerApiError(`Trigger response contains an invalid configuration: ${error instanceof Error ? error.message : String(error)}`);
  }
  const normalized = {
    trigger_uid: requiredString(trigger, "trigger_uid", "Trigger response"),
    configuration,
    status: requiredString(trigger, "status", "Trigger response"),
    revision: uint64(read(trigger, "revision"), "Trigger response.revision"),
    entries: repeated(trigger, "entries", (value) => normalizeTriggerEntry(value, mode === "script")),
    sync_state: stringOrDefault(read(trigger, "sync_state")),
    source_session_uid: stringOrDefault(read(trigger, "source_session_uid"))
  };
  addOptionalString(normalized, "created_at", read(trigger, "created_at"), "Trigger response.created_at");
  addOptionalString(normalized, "updated_at", read(trigger, "updated_at"), "Trigger response.updated_at");
  addOptionalString(normalized, "product_name", read(trigger, "product_name"), "Trigger response.product_name");
  return normalized;
}
function normalizeResponse(method, response) {
  switch (method) {
    case "CreateTrigger":
    case "UpdateTrigger":
    case "SetTriggerEnabled":
      return { trigger: normalizeTrigger(read(response, "trigger")) };
    case "DeleteTrigger":
      return {};
    case "GetTrigger":
      return { trigger: normalizeTrigger(read(response, "trigger")) };
    case "ListTriggers":
      return {
        triggers: repeated(response, "triggers", normalizeTrigger),
        next_page_token: stringOrDefault(read(response, "next_page_token"))
      };
    case "ListTriggerEventCatalog":
      return { sources: repeated(response, "sources", normalizeEventSource) };
    case "ListTriggerOptions":
      return {
        options: repeated(response, "options", normalizeEventOption),
        next_page_token: stringOrDefault(read(response, "next_page_token"))
      };
    case "ListExecutions":
      return {
        executions: repeated(response, "executions", normalizeExecution),
        next_page_token: stringOrDefault(read(response, "next_page_token")),
        ...present(response, "stats") ? { stats: normalizeExecutionStats(read(response, "stats")) } : {}
      };
    case "GetExecution":
      return { execution: normalizeExecution(read(response, "execution")) };
    case "DryRunScript":
    case "DryRunEntry":
      return { result: normalizeDryRunResult(read(response, "result")) };
    case "ListDataApis":
      return { apis: repeated(response, "apis", normalizeDataApi) };
    case "PreviewSchedule":
      return { fire_times: repeatedStrings(response, "fire_times") };
  }
}
function normalizeConfiguration(raw) {
  const configuration = record(raw, "Trigger configuration");
  const mode = requiredString(configuration, "mode", "Trigger configuration");
  if (mode !== "fixed" && mode !== "script") {
    throw new TriggerApiError('Trigger configuration.mode must be "fixed" or "script"');
  }
  const normalized = {
    mode,
    title: stringOrDefault(read(configuration, "title")),
    description: stringOrDefault(read(configuration, "description")),
    instruction: requiredString(configuration, "instruction", "Trigger configuration"),
    target: normalizeTarget(read(configuration, "target")),
    connectors: repeatedStrings(configuration, "connectors"),
    connector_accounts: repeated(configuration, "connector_accounts", normalizeConnectorAccount),
    project_id: stringOrDefault(read(configuration, "project_id"))
  };
  addOptionalString(normalized, "expires_at", read(configuration, "expires_at"), "Trigger configuration.expires_at");
  if (mode === "fixed") {
    if (present(configuration, "script"))
      throw new TriggerApiError("Fixed Trigger configuration must not contain script");
    const fixed = record(read(configuration, "fixed"), "Fixed Trigger configuration");
    normalized.fixed = { entries: repeated(fixed, "entries", (value) => normalizeEntryConfiguration(value)) };
  } else {
    if (present(configuration, "fixed"))
      throw new TriggerApiError("Script Trigger configuration must not contain fixed");
    const script = record(read(configuration, "script"), "Script Trigger configuration");
    normalized.script = {
      code: requiredString(script, "code", "Script Trigger configuration"),
      schedule_spec: normalizeSchedule(read(script, "schedule_spec"))
    };
  }
  return normalized;
}
function normalizeTarget(raw) {
  const target = record(raw, "Trigger target");
  const mode = requiredString(target, "mode", "Trigger target");
  if (mode !== "current_session" && mode !== "new_session") {
    throw new TriggerApiError('Trigger target.mode must be "current_session" or "new_session"');
  }
  const normalized = {
    mode,
    session_uid: stringOrDefault(read(target, "session_uid"))
  };
  if (present(target, "new_session"))
    normalized.new_session = normalizeNewSession(read(target, "new_session"));
  return normalized;
}
function normalizeNewSession(raw) {
  const newSession = record(raw, "Trigger new_session");
  const normalized = {
    task_mode: stringOrDefault(read(newSession, "task_mode")),
    cloud_pc_id: stringOrDefault(read(newSession, "cloud_pc_id"))
  };
  addOptionalString(normalized, "max_effort", read(newSession, "max_effort"), "Trigger new_session.max_effort");
  if (present(newSession, "desktop_binding")) {
    const binding = record(read(newSession, "desktop_binding"), "Trigger desktop_binding");
    normalized.desktop_binding = {
      device_id: requiredString(binding, "device_id", "Trigger desktop_binding"),
      folder_path: requiredString(binding, "folder_path", "Trigger desktop_binding")
    };
  }
  return normalized;
}
function normalizeConnectorAccount(raw) {
  const account = record(raw, "Trigger connector account");
  const normalized = {
    connector_uid: requiredString(account, "connector_uid", "Trigger connector account")
  };
  addOptionalString(normalized, "account_uid", read(account, "account_uid"), "Trigger connector account.account_uid");
  return normalized;
}
function normalizeEntryConfiguration(raw, scriptRuntime = false) {
  const entry = record(raw, "Trigger entry configuration");
  const source = requiredString(entry, "source", "Trigger entry configuration");
  const eventType = stringOrDefault(read(entry, "event_type"));
  const normalized = {
    entry_uid: stringOrDefault(read(entry, "entry_uid")),
    source,
    params: present(entry, "params") ? jsonValue(read(entry, "params"), "Trigger entry configuration.params") : {}
  };
  if (scriptRuntime) {
    if (source !== "schedule") {
      throw new TriggerApiError('Script Trigger runtime entry must use source "schedule"');
    }
    if (eventType !== "" || present(entry, "filter")) {
      throw new TriggerApiError("Script Trigger runtime entry must not contain event_type or filter");
    }
    if (!present(entry, "schedule_spec")) {
      throw new TriggerApiError("Script Trigger runtime entry must contain schedule_spec");
    }
  } else {
    if (eventType === "") {
      throw new TriggerApiError("Trigger entry configuration must contain event_type");
    }
    normalized.event_type = eventType;
    if (present(entry, "filter"))
      normalized.filter = normalizeFilter(read(entry, "filter"));
  }
  if (present(entry, "schedule_spec"))
    normalized.schedule_spec = normalizeSchedule(read(entry, "schedule_spec"));
  if (present(entry, "binding"))
    normalized.binding = normalizeBinding(read(entry, "binding"));
  if (present(entry, "enabled"))
    normalized.enabled = requiredBoolean(entry, "enabled", "Trigger entry configuration");
  addOptionalString(normalized, "webhook_suffix", read(entry, "webhook_suffix"), "Trigger entry configuration.webhook_suffix");
  return normalized;
}
function normalizeFilter(raw) {
  const filter = record(raw, "Trigger filter");
  const normalized = {
    ...filter,
    groups: repeated(filter, "groups", (rawGroup) => {
      const group = record(rawGroup, "Trigger filter group");
      return { ...group, conditions: repeated(group, "conditions", (rawCondition) => {
        const condition = record(rawCondition, "Trigger predicate");
        const { fieldKey: _fieldKey, caseSensitive: _caseSensitive, ...fields } = condition;
        const predicate = {
          ...fields,
          field_key: requiredString(condition, "field_key", "Trigger predicate"),
          operator: requiredString(condition, "operator", "Trigger predicate")
        };
        if (present(condition, "value"))
          predicate.value = jsonValue(read(condition, "value"), "Trigger predicate.value");
        if (present(condition, "case_sensitive"))
          predicate.case_sensitive = requiredBoolean(condition, "case_sensitive", "Trigger predicate");
        return predicate;
      }) };
    })
  };
  try {
    validateInput(FILTER_SCHEMA, normalized);
  } catch (error) {
    throw new TriggerApiError(`Trigger response contains an invalid filter: ${error instanceof Error ? error.message : String(error)}`);
  }
  return normalized;
}
function normalizeSchedule(raw) {
  const schedule = record(raw, "Trigger schedule_spec");
  const options = [
    ["interval", read(schedule, "interval")],
    ["cron", read(schedule, "cron")],
    ["once", read(schedule, "once")]
  ].filter(([, value]) => value !== undefined);
  if (options.length !== 1)
    throw new TriggerApiError("Trigger schedule_spec must contain exactly one of interval, cron, or once");
  const [kind, rawSpec] = options[0];
  const spec = record(rawSpec, `Trigger schedule_spec.${kind}`);
  switch (kind) {
    case "interval": {
      const normalized = {
        every_ms: int64Positive(read(spec, "every_ms"), "Trigger schedule_spec.interval.every_ms")
      };
      addOptionalString(normalized, "anchor_at", read(spec, "anchor_at"), "Trigger schedule_spec.interval.anchor_at");
      return { interval: normalized };
    }
    case "cron":
      return { cron: {
        expression: requiredString(spec, "expression", "Trigger schedule_spec.cron"),
        timezone: requiredString(spec, "timezone", "Trigger schedule_spec.cron")
      } };
    case "once": {
      const normalized = {
        fire_at: requiredString(spec, "fire_at", "Trigger schedule_spec.once")
      };
      addOptionalString(normalized, "timezone", read(spec, "timezone"), "Trigger schedule_spec.once.timezone");
      return { once: normalized };
    }
    default:
      throw new TriggerApiError("Trigger schedule_spec contains an unknown shape");
  }
}
function normalizeBinding(raw) {
  const binding = record(raw, "Trigger entry binding");
  const options = [
    ["mailbox", read(binding, "mailbox")],
    ["slack", read(binding, "slack")],
    ["connector", read(binding, "connector")]
  ].filter(([, value]) => value !== undefined);
  if (options.length !== 1)
    throw new TriggerApiError("Trigger entry binding must contain exactly one resource");
  const [kind, rawResource] = options[0];
  const resource = record(rawResource, `Trigger entry binding.${kind}`);
  switch (kind) {
    case "mailbox":
      return { mailbox: {
        kind: requiredString(resource, "kind", "Trigger mailbox binding"),
        mailbox_uid: requiredString(resource, "mailbox_uid", "Trigger mailbox binding")
      } };
    case "slack": {
      const normalized = {
        workspace_uid: requiredString(resource, "workspace_uid", "Trigger Slack binding")
      };
      addOptionalString(normalized, "channel_uid", read(resource, "channel_uid"), "Trigger Slack binding.channel_uid");
      return { slack: normalized };
    }
    case "connector": {
      const normalized = {};
      addOptionalString(normalized, "account_uid", read(resource, "account_uid"), "Trigger connector binding.account_uid");
      addOptionalString(normalized, "resource_uid", read(resource, "resource_uid"), "Trigger connector binding.resource_uid");
      return { connector: normalized };
    }
    default:
      throw new TriggerApiError("Trigger entry binding contains an unknown resource");
  }
}
function normalizeTriggerEntry(raw, scriptRuntime) {
  const entry = record(raw, "Trigger entry");
  const normalized = {
    entry_uid: requiredString(entry, "entry_uid", "Trigger entry"),
    configuration: normalizeEntryConfiguration(read(entry, "configuration"), scriptRuntime),
    runtime_status: stringOrDefault(read(entry, "runtime_status")),
    sync_state: stringOrDefault(read(entry, "sync_state")),
    last_error_code: stringOrDefault(read(entry, "last_error_code")),
    webhook_url: stringOrDefault(read(entry, "webhook_url")),
    auth_required: booleanOrDefault(read(entry, "auth_required")),
    credential_configured: booleanOrDefault(read(entry, "credential_configured"))
  };
  addOptionalString(normalized, "last_polled_at", read(entry, "last_polled_at"), "Trigger entry.last_polled_at");
  addOptionalString(normalized, "credential_rotated_at", read(entry, "credential_rotated_at"), "Trigger entry.credential_rotated_at");
  if (present(entry, "binding_display"))
    normalized.binding_display = normalizeBindingDisplay(read(entry, "binding_display"));
  return normalized;
}
function normalizeBindingDisplay(raw) {
  const display = record(raw, "Trigger entry binding_display");
  const normalized = {};
  addOptionalString(normalized, "workspace_name", read(display, "workspace_name"), "Trigger binding display.workspace_name");
  addOptionalString(normalized, "channel_name", read(display, "channel_name"), "Trigger binding display.channel_name");
  addOptionalString(normalized, "account_name", read(display, "account_name"), "Trigger binding display.account_name");
  addOptionalString(normalized, "resource_name", read(display, "resource_name"), "Trigger binding display.resource_name");
  return normalized;
}
function normalizeEventSource(raw) {
  const source = record(raw, "Trigger source definition");
  return {
    source: requiredString(source, "source", "Trigger source definition"),
    title: stringOrDefault(read(source, "title")),
    description: stringOrDefault(read(source, "description")),
    events: repeated(source, "events", normalizeEventDefinition)
  };
}
function normalizeEventDefinition(raw) {
  const event = record(raw, "Trigger event definition");
  return {
    event_type: requiredString(event, "event_type", "Trigger event definition"),
    source: requiredString(event, "source", "Trigger event definition"),
    title: stringOrDefault(read(event, "title")),
    description: stringOrDefault(read(event, "description")),
    settings: repeated(event, "settings", normalizeSetting),
    filter_fields: repeated(event, "filter_fields", normalizeFilterField),
    delivery_policy: stringOrDefault(read(event, "delivery_policy")),
    poll_interval_seconds: uint32OrDefault(read(event, "poll_interval_seconds"), "Trigger event definition.poll_interval_seconds"),
    available: booleanOrDefault(read(event, "available")),
    unavailable_reason: stringOrDefault(read(event, "unavailable_reason"))
  };
}
function normalizeSetting(raw) {
  const field = record(raw, "Trigger setting definition");
  const normalized = {
    key: requiredString(field, "key", "Trigger setting definition"),
    kind: requiredString(field, "kind", "Trigger setting definition"),
    required: booleanOrDefault(read(field, "required")),
    title: stringOrDefault(read(field, "title")),
    description: stringOrDefault(read(field, "description")),
    options_key: stringOrDefault(read(field, "options_key")),
    depends_on: repeatedStrings(field, "depends_on"),
    value_path: requiredString(field, "value_path", "Trigger setting definition"),
    values: repeatedStrings(field, "values"),
    min: int64OrDefault(read(field, "min"), "Trigger setting definition.min"),
    max: int64OrDefault(read(field, "max"), "Trigger setting definition.max")
  };
  if (present(field, "default_value"))
    normalized.default_value = jsonValue(read(field, "default_value"), "Trigger setting definition.default_value");
  return normalized;
}
function normalizeFilterField(raw) {
  const field = record(raw, "Trigger filter field");
  return {
    key: requiredString(field, "key", "Trigger filter field"),
    kind: requiredString(field, "kind", "Trigger filter field"),
    title: stringOrDefault(read(field, "title")),
    description: stringOrDefault(read(field, "description")),
    operators: repeated(field, "operators", normalizeOperator),
    options_key: stringOrDefault(read(field, "options_key")),
    depends_on: repeatedStrings(field, "depends_on"),
    unit: stringOrDefault(read(field, "unit")),
    values: repeatedStrings(field, "values"),
    supports_case_sensitive: booleanOrDefault(read(field, "supports_case_sensitive"))
  };
}
function normalizeOperator(raw) {
  const operator = record(raw, "Trigger operator");
  const normalized = {
    operator: requiredString(operator, "operator", "Trigger operator"),
    title: stringOrDefault(read(operator, "title")),
    operand_kind: requiredString(operator, "operand_kind", "Trigger operator")
  };
  if (present(operator, "value_schema")) {
    normalized.value_schema = jsonValue(record(read(operator, "value_schema"), "Trigger operator.value_schema"), "Trigger operator.value_schema");
  }
  return normalized;
}
function normalizeEventOption(raw) {
  const option = record(raw, "Trigger option");
  const normalized = {
    value: requiredString(option, "value", "Trigger option"),
    label: stringOrDefault(read(option, "label")),
    description: stringOrDefault(read(option, "description"))
  };
  if (present(option, "is_member"))
    normalized.is_member = requiredBoolean(option, "is_member", "Trigger option");
  const unavailableCode = stringOrDefault(read(option, "unavailable_code"));
  if (unavailableCode)
    normalized.unavailable_code = unavailableCode;
  return normalized;
}
function normalizeExecutionStats(raw) {
  const stats = record(raw, "Trigger execution stats");
  return {
    run_count: int64OrDefault(read(stats, "run_count"), "Trigger execution stats.run_count"),
    triggered_count: int64OrDefault(read(stats, "triggered_count"), "Trigger execution stats.triggered_count"),
    failed_count: int64OrDefault(read(stats, "failed_count"), "Trigger execution stats.failed_count")
  };
}
function normalizeExecution(raw) {
  const execution = record(raw, "Trigger execution");
  const normalized = {
    execution_uid: requiredString(execution, "execution_uid", "Trigger execution"),
    trigger_uid: stringOrDefault(read(execution, "trigger_uid")),
    entry_uid: stringOrDefault(read(execution, "entry_uid")),
    source: stringOrDefault(read(execution, "source")),
    event_type: stringOrDefault(read(execution, "event_type")),
    status: stringOrDefault(read(execution, "status")),
    failed_stage: stringOrDefault(read(execution, "failed_stage")),
    error_code: stringOrDefault(read(execution, "error_code")),
    error_message: stringOrDefault(read(execution, "error_message")),
    title: stringOrDefault(read(execution, "title")),
    payload_preview: stringOrDefault(read(execution, "payload_preview")),
    target_session_uid: stringOrDefault(read(execution, "target_session_uid")),
    materials: repeated(execution, "materials", normalizeMaterial),
    unread: booleanOrDefault(read(execution, "unread")),
    matched_count: uint64OrDefault(read(execution, "matched_count"), "Trigger execution.matched_count"),
    event_id: stringOrDefault(read(execution, "event_id")),
    event_message: stringOrDefault(read(execution, "event_message"))
  };
  addOptionalString(normalized, "created_at", read(execution, "created_at"), "Trigger execution.created_at");
  addOptionalString(normalized, "completed_at", read(execution, "completed_at"), "Trigger execution.completed_at");
  addOptionalString(normalized, "event_timestamp", read(execution, "event_timestamp"), "Trigger execution.event_timestamp");
  return normalized;
}
function normalizeMaterial(raw) {
  const material = record(raw, "Trigger material");
  const normalized = {
    name: stringOrDefault(read(material, "name")),
    content_type: stringOrDefault(read(material, "content_type")),
    size_bytes: int64OrDefault(read(material, "size_bytes"), "Trigger material.size_bytes"),
    download_url: stringOrDefault(read(material, "download_url")),
    expired: booleanOrDefault(read(material, "expired"))
  };
  addOptionalString(normalized, "expires_at", read(material, "expires_at"), "Trigger material.expires_at");
  return normalized;
}
function normalizeDryRunResult(raw) {
  const result = record(raw, "Trigger dry run result");
  return {
    ok: booleanOrDefault(read(result, "ok")),
    fired: booleanOrDefault(read(result, "fired")),
    payload: stringOrDefault(read(result, "payload")),
    rendered_instruction: stringOrDefault(read(result, "rendered_instruction")),
    error: stringOrDefault(read(result, "error")),
    duration_ms: int64OrDefault(read(result, "duration_ms"), "Trigger dry run result.duration_ms")
  };
}
function normalizeDataApi(raw) {
  const api = record(raw, "Data API");
  return {
    api_name: requiredString(api, "api_name", "Data API"),
    provider: stringOrDefault(read(api, "provider")),
    use_when: stringOrDefault(read(api, "use_when")),
    doc: stringOrDefault(read(api, "doc")),
    examples_json: stringOrDefault(read(api, "examples_json")),
    billing_hint: stringOrDefault(read(api, "billing_hint")),
    path_params: repeatedStrings(api, "path_params")
  };
}
var WRITE_METHODS = new Set(["CreateTrigger", "UpdateTrigger", "SetTriggerEnabled", "DeleteTrigger"]);
function transportError(method, error) {
  if (!(error instanceof Error && error.name === "TimeoutError")) {
    return new TriggerApiError(`The trigger service is unreachable: ${error instanceof Error ? error.message : String(error)}`, "unavailable");
  }
  if (WRITE_METHODS.has(method)) {
    return new TriggerApiError("The trigger service did not respond in time; the change may already have been applied. " + "Check with triggers.get_trigger or triggers.list_triggers before retrying, " + "and retry a creation only with the same create_request_uid.", "deadline_exceeded");
  }
  if (method === "DryRunScript") {
    return new TriggerApiError("The dry run did not finish in time; the script is too slow to dry-run.", "deadline_exceeded");
  }
  if (method === "DryRunEntry") {
    return new TriggerApiError("The dry run did not finish in time; the provider read is too slow to dry-run. The entry was not changed.", "deadline_exceeded");
  }
  return new TriggerApiError("The trigger service did not respond in time; try again.", "deadline_exceeded");
}
function throwConnectError(status, text) {
  let code;
  let fieldErrors = [];
  let message = `The trigger service returned HTTP ${status}; try again later.`;
  try {
    const body = JSON.parse(text);
    if (isRecord2(body)) {
      if (typeof body.code === "string")
        code = body.code;
      if (typeof body.message === "string" && body.message)
        message = body.message.slice(0, 500);
      fieldErrors = triggerFieldErrors(body.details);
    }
  } catch {}
  throw new TriggerApiError(message, code, fieldErrors);
}
function triggerFieldErrors(details) {
  if (!Array.isArray(details))
    return [];
  return details.slice(0, 10).flatMap((detail) => {
    if (!isRecord2(detail) || detail.type !== "triggers.v1.TriggerFieldError" || !isRecord2(detail.debug))
      return [];
    const errorCode = read(detail.debug, "error_code");
    const fieldPath = read(detail.debug, "field_path") ?? "";
    if (typeof errorCode !== "string" || !errorCode || errorCode.length > 128 || typeof fieldPath !== "string" || fieldPath.length > 1024)
      return [];
    return [{ error_code: errorCode, field_path: fieldPath }];
  });
}
function read(object, snakeKey) {
  if (snakeKey in object)
    return object[snakeKey];
  const camelKey = snakeKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  return object[camelKey];
}
function present(object, snakeKey) {
  return read(object, snakeKey) !== undefined;
}
function record(value, name) {
  if (!isRecord2(value))
    throw new TriggerApiError(`${name} must be an object`);
  return value;
}
function requiredString(object, key, name) {
  const value = read(object, key);
  if (typeof value !== "string" || value === "")
    throw new TriggerApiError(`${name}.${key} must be a non-empty string`);
  return value;
}
function stringOrDefault(value) {
  if (value === undefined || value === null)
    return "";
  if (typeof value !== "string")
    throw new TriggerApiError("Trigger response contains a non-string field");
  return value;
}
function addOptionalString(target, key, value, name) {
  if (value === undefined || value === null || value === "")
    return;
  if (typeof value !== "string")
    throw new TriggerApiError(`${name} must be a string`);
  target[key] = value;
}
function requiredBoolean(object, key, name) {
  const value = read(object, key);
  if (typeof value !== "boolean")
    throw new TriggerApiError(`${name}.${key} must be a boolean`);
  return value;
}
function booleanOrDefault(value) {
  if (value === undefined || value === null)
    return false;
  if (typeof value !== "boolean")
    throw new TriggerApiError("Trigger response contains a non-boolean field");
  return value;
}
function repeated(object, key, normalize) {
  const value = read(object, key);
  if (value === undefined || value === null)
    return [];
  if (!Array.isArray(value))
    throw new TriggerApiError(`Trigger response.${key} must be an array`);
  return value.map(normalize);
}
function repeatedStrings(object, key) {
  return repeated(object, key, (value) => {
    if (typeof value !== "string")
      throw new TriggerApiError(`Trigger response.${key} must contain only strings`);
    return value;
  });
}
function uint32OrDefault(value, name) {
  if (value === undefined || value === null)
    return 0;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0 || value > 4294967295) {
    throw new TriggerApiError(`${name} must be an unsigned 32-bit integer`);
  }
  return value;
}
function uint64(value, name) {
  if (typeof value !== "string" || !/^(?:0|[1-9][0-9]*)$/.test(value)) {
    throw new TriggerApiError(`${name} must be a lossless decimal uint64 string`);
  }
  if (BigInt(value) > UINT64_MAX2)
    throw new TriggerApiError(`${name} is outside uint64 range`);
  return value;
}
function uint64OrDefault(value, name) {
  return value === undefined || value === null ? "0" : uint64(value, name);
}
function int64Positive(value, name) {
  const parsed = int64(value, name);
  if (BigInt(parsed) <= 0n)
    throw new TriggerApiError(`${name} must be positive`);
  return parsed;
}
function int64OrDefault(value, name) {
  return value === undefined || value === null ? "0" : int64(value, name);
}
function int64(value, name) {
  if (typeof value !== "string" || !/^-?(?:0|[1-9][0-9]*)$/.test(value)) {
    throw new TriggerApiError(`${name} must be a lossless decimal int64 string`);
  }
  const parsed = BigInt(value);
  if (parsed < -INT64_MAX2 - 1n || parsed > INT64_MAX2)
    throw new TriggerApiError(`${name} is outside int64 range`);
  return value;
}
function jsonValue(value, name) {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value))
      throw new TriggerApiError(`${name} must be JSON`);
    return value;
  }
  if (Array.isArray(value))
    return value.map((item, index) => jsonValue(item, `${name}[${index}]`));
  if (isRecord2(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, jsonValue(item, `${name}.${key}`)]));
  }
  throw new TriggerApiError(`${name} must be JSON`);
}
function isRecord2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// shared/lineFrames.ts
function createLineSplitter(onLine) {
  let buffer = "";
  return (chunk) => {
    buffer += chunk;
    let newline = buffer.indexOf(`
`);
    while (newline >= 0) {
      const line = buffer.slice(0, newline).replace(/\r$/, "").trim();
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf(`
`);
      if (line)
        onLine(line);
    }
  };
}

// mcp/mcpServer.ts
var SUPPORTED_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
var DEFAULT_PROTOCOL_VERSION = "2025-11-25";
function startMcpServer(options) {
  const input = options.input ?? process.stdin;
  const output = options.output ?? process.stdout;
  const send = (message) => {
    output.write(`${JSON.stringify(message)}
`);
  };
  const respond = (id, result) => send({ jsonrpc: "2.0", id, result });
  const fail = (id, code, message) => send({ jsonrpc: "2.0", id, error: { code, message } });
  const handleMessage = async (message) => {
    const method = typeof message.method === "string" ? message.method : undefined;
    const hasId = "id" in message && message.id !== undefined;
    const id = hasId ? message.id : null;
    if (!method)
      return;
    if (!hasId)
      return;
    switch (method) {
      case "initialize": {
        const params = message.params ?? {};
        const requested = typeof params.protocolVersion === "string" ? params.protocolVersion : "";
        respond(id, {
          protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : DEFAULT_PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: options.serverInfo
        });
        return;
      }
      case "ping":
        respond(id, {});
        return;
      case "tools/list":
        respond(id, { tools: options.listTools() });
        return;
      case "tools/call": {
        const params = message.params ?? {};
        try {
          respond(id, await options.callTool(params));
        } catch (error) {
          const code = error && typeof error === "object" && typeof error.jsonRpcCode === "number" ? error.jsonRpcCode : -32603;
          fail(id, code, error instanceof Error ? error.message : String(error));
        }
        return;
      }
      default:
        fail(id, -32601, `method not found: ${method}`);
    }
  };
  input.setEncoding("utf8");
  input.on("data", createLineSplitter((line) => {
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      return;
    }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      handleMessage(parsed).catch((error) => {
        console.error("[triggers] unhandled dispatch error:", error);
      });
    }
  }));
  input.on("end", () => {
    options.onExit?.();
    if (input === process.stdin)
      process.exit(0);
  });
}

// mcp/tools.ts
import { randomUUID } from "node:crypto";

// mcp/callAuth.ts
var UNAUTHORIZED_MESSAGE = "Trigger tools are not authorized in this conversation; start a new conversation and try again.";
var MISSING_GRANT_MESSAGE = "Trigger tools only accept native MCP tool calls; terminal calls such as `manus-mcp-cli` cannot carry the per-call host authorization. Retry this call as a native MCP tool call, reusing the same create_request_uid for creation. If it already was a native MCP tool call, host authorization is currently unavailable; report that instead of retrying.";
function resolveCallAuth(params) {
  const grant = params._meta?.["ai.manus/hostAccess"];
  if (grant === undefined)
    throw new TriggerApiError(MISSING_GRANT_MESSAGE, "unauthenticated");
  if (!grant || typeof grant !== "object" || Array.isArray(grant)) {
    throw new TriggerApiError(UNAUTHORIZED_MESSAGE, "unauthenticated");
  }
  const value = grant;
  if (value.addonId !== ADDON_ID || typeof value.addonRevision !== "string" || !value.addonRevision.trim() || typeof value.endpoint !== "string" || !isHostEndpoint(value.endpoint) || typeof value.accessToken !== "string" || !value.accessToken.trim() || value.accessToken.length > 32768 || typeof value.expiresAt !== "number" || !Number.isFinite(value.expiresAt) || !Array.isArray(value.grantedScopes) || !value.grantedScopes.length || value.grantedScopes.length > 128 || !value.grantedScopes.every((scope) => typeof scope === "string" && scope.length > 0)) {
    throw new TriggerApiError(UNAUTHORIZED_MESSAGE, "unauthenticated");
  }
  if (value.expiresAt <= Date.now() / 1000) {
    throw new TriggerApiError("Trigger tool authorization expired; try again, or start a new conversation if it keeps failing.", "unauthenticated");
  }
  return { token: value.accessToken, endpoint: value.endpoint.replace(/\/+$/, "") };
}
function isHostEndpoint(value) {
  if (!value || value.length > 2048)
    return false;
  try {
    const endpoint = new URL(value);
    return ["http:", "https:"].includes(endpoint.protocol) && !endpoint.username && !endpoint.password && !endpoint.search && !endpoint.hash && (endpoint.protocol === "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname));
  } catch {
    return false;
  }
}

// mcp/tools.ts
var STRING = (maxLength) => ({
  type: "string",
  ...maxLength === undefined ? {} : { maxLength }
});
var REVISION = { type: "string", pattern: "^[1-9][0-9]{0,19}$", format: "uint64" };
var UID = { ...STRING(65), minLength: 1 };
var PAGE_SIZE = { type: "integer", minimum: 0, maximum: 100 };
var PAGE_TOKEN = STRING(2048);
var SLACK_CHANNEL_MAX_MATCHES = 1000;
var OPTION_QUERY_TIME_BUDGET_MS = 30000;
var OPTION_QUERY_MIN_REQUEST_BUDGET_MS = 250;
var WEBHOOK_RETRIEVE_POLL_EVENT = "webhook.retrieve_poll";
var CREATE_TITLE_SCHEMA = {
  ...COMMON_PROPERTIES.title,
  minLength: 1,
  pattern: "\\S"
};
var CREATE_FIXED_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["create_request_uid", "title", "instruction", "entries"],
  properties: {
    create_request_uid: { type: "string", minLength: 16, maxLength: 64 },
    ...COMMON_PROPERTIES,
    title: CREATE_TITLE_SCHEMA,
    entries: CREATE_ENTRIES_SCHEMA
  }
};
var CREATE_SCRIPT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["create_request_uid", "title", "instruction", "code", "schedule_spec"],
  properties: {
    create_request_uid: { type: "string", minLength: 16, maxLength: 64 },
    ...COMMON_PROPERTIES,
    title: CREATE_TITLE_SCHEMA,
    code: { type: "string", minLength: 1, maxLength: 65536 },
    schedule_spec: SCHEDULE_SCHEMA
  }
};
var UPDATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["trigger_uid", "expected_revision", "configuration"],
  properties: { trigger_uid: UID, expected_revision: REVISION, configuration: CONFIGURATION_SCHEMA }
};
var SET_ENABLED_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["trigger_uid", "expected_revision", "enabled"],
  properties: { trigger_uid: UID, expected_revision: REVISION, enabled: { type: "boolean" } }
};
var DELETE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["trigger_uid", "expected_revision"],
  properties: { trigger_uid: UID, expected_revision: REVISION }
};
var GET_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["trigger_uid"],
  properties: { trigger_uid: UID }
};
var LIST_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: { mode: { type: "string", enum: ["fixed", "script"] }, page_size: PAGE_SIZE, page_token: PAGE_TOKEN }
};
var LIST_EVENTS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: STRING(16),
    event_type: STRING(64),
    dependencies: { type: "object", additionalProperties: true },
    query: {
      anyOf: [
        { type: "string", minLength: 1, maxLength: 128 },
        { type: "array", minItems: 1, maxItems: 10, items: { type: "string", minLength: 1, maxLength: 128 } }
      ]
    },
    field_keys: { type: "array", minItems: 1, maxItems: 50, items: { ...STRING(64), minLength: 1 } }
  }
};
var LIST_EVENT_OPTIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["source", "event_type", "field_key"],
  properties: {
    source: { ...STRING(16), minLength: 1 },
    event_type: { ...STRING(64), minLength: 1 },
    field_key: { ...STRING(64), minLength: 1 },
    dependencies: { type: "object", additionalProperties: true },
    query: STRING(128),
    page_token: PAGE_TOKEN
  }
};
var LIST_EXECUTIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: { trigger_uid: UID, entry_uid: UID, status: STRING(32), page_size: PAGE_SIZE, page_token: PAGE_TOKEN }
};
var GET_EXECUTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["execution_uid"],
  properties: { execution_uid: UID }
};
var DRY_RUN_SCRIPT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["trigger_uid"],
  properties: { trigger_uid: UID }
};
var DRY_RUN_ENTRY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["trigger_uid", "entry_uid"],
  properties: { trigger_uid: UID, entry_uid: UID }
};
var LIST_DATA_APIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: { query: STRING(), limit: { type: "integer", minimum: -2147483648, maximum: 2147483647 } }
};
var PREVIEW_SCHEDULE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["schedule_spec"],
  properties: { schedule_spec: SCHEDULE_SCHEMA, from: STRING(64), limit: { type: "integer", minimum: 0, maximum: 10 } }
};
var TRIGGER_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    trigger: { type: "object" },
    created: { type: "object" },
    updated: { type: "object" },
    resource_uri: { type: "string" },
    next_steps: { type: "string" }
  }
};
var BASIC_OUTPUT_SCHEMA = { type: "object" };
var TOOL_DEFINITIONS = [
  {
    name: "triggers.create_trigger",
    description: "Create an enabled fixed-event trigger. Prefer this tool first: discover events, settings, filter fields and operators with list_events/list_event_options. Each entry requires source and event_type, with acquisition settings in binding/params/schedule_spec and optional predicates in filter.groups. Entries and groups are OR; conditions within a group are AND. Use one entry per listening scope and put alternative conditions in its OR groups. If no discovered event/filter can express the request, propose a scheduled script and obtain explicit user approval before using create_script_trigger. Interval/cron schedules on event triggers need at least a 10-minute gap; once schedules have no recurring-gap minimum. A non-blank title is required. Creation is live immediately. To debug a saved connected-account polling entry without writing test data into the watched resource, use dry_run_entry.",
    inputSchema: CREATE_FIXED_SCHEMA,
    outputSchema: TRIGGER_OUTPUT_SCHEMA
  },
  {
    name: "triggers.create_script_trigger",
    description: "Create an enabled scheduled script trigger only when the discovered events and filters cannot express the request and the user has explicitly approved the proposed script fallback, including its monitoring scope and schedule. If approval is missing, explain the event limitation, propose the script, and ask the user; do not call this tool yet. First check list_events; do not use a script to bypass unavailable resources or permissions. Scripts have no event_type or filter. Interval/cron script schedules need at least a 15-minute gap on free plans or 5 minutes on paid plans; once schedules have no recurring-gap minimum. A non-blank title is required. This creates the live trigger immediately. dry_run_script can optionally debug its stored script after creation and is not required before creating it.",
    inputSchema: CREATE_SCRIPT_SCHEMA,
    outputSchema: TRIGGER_OUTPUT_SCHEMA
  },
  {
    name: "triggers.update_trigger",
    description: "Completely replace a trigger configuration using its current expected_revision. Call get_trigger first and preserve every required or unrelated entry; omitted configuration fields are deleted. The complete replacement is revalidated, including the minimum schedule gap for its mode and plan. This does not fetch, merge, or retry revision conflicts.",
    inputSchema: UPDATE_SCHEMA,
    outputSchema: TRIGGER_OUTPUT_SCHEMA
  },
  {
    name: "triggers.set_trigger_enabled",
    description: "Enable or disable a trigger using its current expected_revision. Enabling a disabled trigger works from any current sign-in of the owner and makes the trigger run as the sign-in of this conversation; it rechecks that sign-in, its delivery target, event resource authorization, and the enabled-trigger limit, but a desktop_binding target is authorized for this sign-in only when the trigger runs, so check its first execution before reporting it as working; enabling a disabled script trigger also rechecks its recurring schedule against the minimum gap of the current plan, while event-trigger schedule gaps are not rechecked. Surface authorization or source-confirmation errors instead of retrying them as revision conflicts. Returns the complete updated trigger.",
    inputSchema: SET_ENABLED_SCHEMA,
    outputSchema: TRIGGER_OUTPUT_SCHEMA
  },
  { name: "triggers.delete_trigger", description: "Delete a trigger using its current expected_revision. This cannot be undone.", inputSchema: DELETE_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA },
  { name: "triggers.get_trigger", description: "Get a complete trigger configuration, including all entries and script code. Use this before a complete update.", inputSchema: GET_SCHEMA, outputSchema: TRIGGER_OUTPUT_SCHEMA },
  { name: "triggers.list_triggers", description: "List trigger summaries filtered by optional mode. Summaries deliberately omit script.code; call get_trigger for a complete editable configuration.", inputSchema: LIST_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA },
  { name: "triggers.list_events", description: "Discover the event catalog, not execution history. Without event_type it returns a compact index of every matching event (source, event_type, title, availability, cadence, setting keys), ranked so source and event matches come before matches found only in settings or filter fields (those list matched_fields, or matched_field_count when capped). Pass source and event_type to get that one full definition: listening settings with value paths, filter fields, and operators, where each filter field names an operator_set to look up in operator_sets. If a definition is too large it comes back as an outline (values_count instead of values); repeat with field_keys naming the settings and filter fields you need to get them in full. Use optional query as one search string or 1–10 strings, ORed case-insensitively. omitted_events means the response was capped; narrow the query instead of concluding that an event is unsupported. For dependent fields (such as Forms answers), select resources then repeat with source, event_type and dependencies keyed by setting key, not value_path. The returned definitions are authoritative.", inputSchema: LIST_EVENTS_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA },
  { name: "triggers.list_event_options", description: "Discover authorized options for an event setting or filter field. Use its source, event_type, field_key and required dependencies keyed by setting key. Pass query to search on the server: labels match as case-insensitive substrings, except Google Drive folders, which match name word prefixes. With a query the tool skips pages without matches; an empty options list with a non-empty next_page_token is still not conclusive, so continue with it before concluding nothing matches. Clear page_token when owner, event, field, dependencies or query changes. Slack channel lookup (by channel name or ID) requires a non-empty query and no page_token; the tool searches every page itself and fails explicitly rather than returning a partial result if the search is too broad. Never select an option with unavailable_code; provider_reauthentication_required means the user must reconnect that account or workspace first.", inputSchema: LIST_EVENT_OPTIONS_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA },
  { name: "triggers.list_executions", description: "List trigger execution summaries with optional trigger, entry, and status filters.", inputSchema: LIST_EXECUTIONS_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA },
  { name: "triggers.get_execution", description: "Get one execution with its bounded preview, failure details, and attachment links. It never returns the raw event body.", inputSchema: GET_EXECUTION_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA },
  { name: "triggers.dry_run_script", description: "Optionally run the stored script for an existing trigger to debug it. It accepts only trigger_uid: draft scripts and dry-run configuration are not supported.", inputSchema: DRY_RUN_SCRIPT_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA },
  { name: "triggers.dry_run_entry", description: 'Read one saved polled event entry of a fixed trigger once, from where its next scheduled check would start, and apply its current filter. Use it to check a new entry or to diagnose one that failed or shows needs_attention: a provider failure returns error as "<error_code>: <detail>"; matches return the payload a real run would deliver. It makes real provider reads that count toward rate limits, but never advances the entry, delivers, records an execution, or clears needs_attention. Supports only connected-account polling entries (Gmail, Google Calendar, Google Workspace, Outlook, Shopify, Meta Ads, Instagram, Google Ads, GitHub, Notion events with poll_interval_seconds > 0 in list_events); RSS, webhook entries including webhook.retrieve_poll, Slack, X and push events are rejected, so inspect their executions instead. Shares the 6-per-minute test-run limit with dry_run_script; a deadline_exceeded timeout after about 50 seconds means the read is too slow to dry-run, not that it failed, so do not retry it. Get entry_uid from get_trigger.', inputSchema: DRY_RUN_ENTRY_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA },
  { name: "triggers.list_data_apis", description: "Discover Data APIs available to scheduled script triggers. Use a concise query; broaden or omit it before concluding that no API fits.", inputSchema: LIST_DATA_APIS_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA },
  { name: "triggers.preview_schedule", description: "Preview upcoming times for a schedule specification without creating or changing a trigger. A preview does not validate plan-specific cadence eligibility.", inputSchema: PREVIEW_SCHEDULE_SCHEMA, outputSchema: BASIC_OUTPUT_SCHEMA }
];
function triggerResourceUri(triggerUid) {
  return `manus-resource://${ADDON_ID}/trigger/${triggerUid}`;
}
function createToolHandler(client = new TriggersSandboxClient, now = Date.now) {
  return async (params) => {
    const definition = TOOL_DEFINITIONS.find((candidate) => candidate.name === params.name);
    if (!definition)
      throw new McpUnknownToolError(String(params.name ?? ""));
    try {
      const args = toolArguments(params);
      const auth = resolveCallAuth(params);
      validateInput(definition.inputSchema, args);
      return await dispatch(client, definition.name, args, auth, now);
    } catch (error) {
      if (error instanceof McpUnknownToolError)
        throw error;
      return errorResult(error);
    }
  };
}
async function dispatch(client, name, args, auth, now) {
  switch (name) {
    case "triggers.create_trigger":
      return triggerMutationResult("created", await callCreate(client, args, "fixed", auth));
    case "triggers.create_script_trigger":
      return triggerMutationResult("created", await callCreate(client, args, "script", auth));
    case "triggers.update_trigger": {
      const configuration = prepareConfiguration(args.configuration);
      const response = await client.call("UpdateTrigger", {
        trigger_uid: args.trigger_uid,
        expected_revision: args.expected_revision,
        configuration
      }, auth);
      return triggerMutationResult("updated", normalizedResponseTrigger(response, "UpdateTrigger"));
    }
    case "triggers.set_trigger_enabled": {
      const response = await client.call("SetTriggerEnabled", args, auth);
      return triggerMutationResult("trigger", normalizedResponseTrigger(response, "SetTriggerEnabled"));
    }
    case "triggers.delete_trigger":
      await client.call("DeleteTrigger", args, auth);
      return jsonResult({ deleted: true, trigger_uid: args.trigger_uid });
    case "triggers.get_trigger": {
      const response = await client.call("GetTrigger", args, auth);
      return triggerReadResult(normalizedResponseTrigger(response, "GetTrigger"));
    }
    case "triggers.list_triggers": {
      const response = await client.call("ListTriggers", args, auth);
      const triggers = readArray(response, "triggers").map((value, index) => {
        try {
          return triggerSummary(normalizeTrigger(value));
        } catch {
          throw new Error(`ListTriggers response has malformed trigger at index ${index}`);
        }
      });
      return jsonResult({ triggers, next_page_token: stringField(response, "next_page_token"), note: "List summaries omit script.code. Call get_trigger to obtain the complete configuration needed for update." });
    }
    case "triggers.list_events":
      return jsonResult(await listEvents(client, args, auth));
    case "triggers.list_event_options":
      return jsonResult(await listEventOptions(client, args, auth, now));
    case "triggers.list_executions":
      return jsonResult(await client.call("ListExecutions", args, auth));
    case "triggers.get_execution": {
      const response = await client.call("GetExecution", args, auth);
      return jsonResult({ execution: sanitizeExecution(response.execution) });
    }
    case "triggers.dry_run_script":
      return jsonResult(await client.call("DryRunScript", args, auth));
    case "triggers.dry_run_entry":
      return jsonResult(await client.call("DryRunEntry", args, auth));
    case "triggers.list_data_apis":
      return jsonResult(await client.call("ListDataApis", args, auth));
    case "triggers.preview_schedule":
      return jsonResult(await client.call("PreviewSchedule", args, auth));
    default:
      throw new McpUnknownToolError(name);
  }
}
async function callCreate(client, args, mode, auth) {
  const { create_request_uid, entries, code, schedule_spec, ...common } = args;
  const configuration = {
    ...common,
    target: common.target ?? { mode: "current_session" },
    mode,
    ...mode === "fixed" ? { fixed: { entries } } : { script: { code, schedule_spec } }
  };
  const prepared = prepareConfiguration(configuration);
  const response = await client.call("CreateTrigger", { create_request_uid, configuration: prepared }, auth);
  return normalizedResponseTrigger(response, "CreateTrigger");
}
function prepareConfiguration(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new InputValidationError("configuration must be an object");
  }
  const configuration = structuredClone(value);
  const fixed = configuration.fixed;
  if (fixed && typeof fixed === "object" && !Array.isArray(fixed)) {
    const entries = fixed.entries;
    if (Array.isArray(entries)) {
      entries.forEach((rawEntry, index) => {
        if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry))
          return;
        const entry = rawEntry;
        if (entry.source !== "webhook")
          return;
        if (entry.event_type === WEBHOOK_RETRIEVE_POLL_EVENT) {
          if (entry.webhook_suffix !== undefined) {
            throw new InputValidationError(`$.fixed.entries[${index}].webhook_suffix is not accepted for ${WEBHOOK_RETRIEVE_POLL_EVENT}; omit it`);
          }
          return;
        }
        const isExisting = typeof entry.entry_uid === "string" && entry.entry_uid !== "";
        const hasSuffix = typeof entry.webhook_suffix === "string" && entry.webhook_suffix !== "";
        if (isExisting && !hasSuffix) {
          throw new InputValidationError(`$.fixed.entries[${index}].webhook_suffix is required for an existing webhook entry`);
        }
        if (!isExisting && entry.webhook_suffix !== undefined) {
          throw new InputValidationError(`$.fixed.entries[${index}].webhook_suffix is generated automatically for a new webhook entry; omit it`);
        }
        if (!isExisting)
          entry.webhook_suffix = randomUUID();
      });
    }
  }
  validateInput(CONFIGURATION_SCHEMA, configuration);
  return configuration;
}
async function listEventOptions(client, args, auth, now) {
  const query = typeof args.query === "string" ? args.query.trim() : "";
  if (!isSlackChannelLookup(args))
    return query ? searchEventOptions(client, args, auth, now) : client.call("ListTriggerOptions", args, auth);
  if (!query)
    throw new InputValidationError("query is required for Slack channel lookup");
  if (typeof args.page_token === "string" && args.page_token !== "") {
    throw new InputValidationError("page_token is not accepted for Slack channel lookup because the tool searches every page itself");
  }
  const { page_token: _pageToken, ...baseRequest } = args;
  const normalizedQuery = query.toLowerCase();
  const matches = [];
  const seenTokens = new Set;
  const startedAt = now();
  let pageToken;
  do {
    const remainingMs = OPTION_QUERY_TIME_BUDGET_MS - (now() - startedAt);
    if (remainingMs < OPTION_QUERY_MIN_REQUEST_BUDGET_MS) {
      throw new TriggerApiError("Slack channel discovery exceeded its total time budget", "slack_channel_timeout");
    }
    const request = { ...baseRequest, ...pageToken ? { page_token: pageToken } : {} };
    const response = await client.call("ListTriggerOptions", request, auth, { timeoutMs: remainingMs });
    const pageOptions = readArray(response, "options");
    for (const option of pageOptions) {
      if (slackOptionSearchText(option).includes(normalizedQuery))
        matches.push(option);
      if (matches.length > SLACK_CHANNEL_MAX_MATCHES) {
        throw new TriggerApiError("Slack channel query matched too many options; use a narrower query", "slack_channel_query_too_broad");
      }
    }
    const nextPageToken = stringField(response, "next_page_token");
    if (!nextPageToken)
      break;
    if (seenTokens.has(nextPageToken)) {
      throw new TriggerApiError("ListTriggerOptions returned a repeated page token while reading Slack channels", "slack_channel_repeated_cursor");
    }
    seenTokens.add(nextPageToken);
    pageToken = nextPageToken;
  } while (pageToken);
  return {
    options: matches,
    next_page_token: ""
  };
}
async function searchEventOptions(client, args, auth, now) {
  const seenTokens = new Set;
  const startedAt = now();
  let request = args;
  let previous;
  for (;; ) {
    const remainingMs = OPTION_QUERY_TIME_BUDGET_MS - (now() - startedAt);
    let response;
    try {
      response = await client.call("ListTriggerOptions", request, auth, { timeoutMs: remainingMs });
    } catch (error) {
      if (previous)
        return previous;
      throw error;
    }
    previous = response;
    const nextPageToken = stringField(response, "next_page_token");
    if (readArray(response, "options").length || !nextPageToken)
      return response;
    if (seenTokens.has(nextPageToken)) {
      throw new TriggerApiError("ListTriggerOptions returned a repeated page token while searching options", "options_repeated_cursor");
    }
    seenTokens.add(nextPageToken);
    if (OPTION_QUERY_TIME_BUDGET_MS - (now() - startedAt) < OPTION_QUERY_MIN_REQUEST_BUDGET_MS)
      return response;
    request = { ...args, page_token: nextPageToken };
  }
}
var LIST_EVENTS_BUDGET_CHARS = 30000;
async function listEvents(client, args, auth) {
  const { query, field_keys: fieldKeys, ...request } = args;
  const exactEvent = typeof request.event_type === "string" && request.event_type !== "";
  if (fieldKeys !== undefined && !exactEvent)
    throw new InputValidationError("field_keys requires event_type");
  const terms = query === undefined ? undefined : (Array.isArray(query) ? query : [query]).map((value, index) => {
    const term = typeof value === "string" ? value.trim().toLowerCase() : "";
    if (!term)
      throw new InputValidationError(`query${Array.isArray(query) ? `[${index}]` : ""} must contain non-whitespace text`);
    return term;
  });
  const response = await client.call("ListTriggerEventCatalog", request, auth);
  const catalogSources = readArray(response, "sources").filter(isPlainRecord);
  if (catalogSources.length === 0)
    return { sources: [] };
  const ranked = rankEvents(catalogSources, terms);
  if (terms !== undefined && ranked.length === 0) {
    const catalogEventCount = catalogSources.reduce((total, source) => total + eventsOf(source).length, 0);
    const sourceLabel = `${catalogSources.length} source${catalogSources.length === 1 ? "" : "s"}`;
    const eventLabel = `${catalogEventCount} event${catalogEventCount === 1 ? "" : "s"}`;
    return {
      sources: [],
      note: `The query matched no events among ${sourceLabel} and ${eventLabel} in the catalog; broaden or omit query before considering create_script_trigger.`
    };
  }
  return exactEvent ? eventDetails(ranked, fieldKeys) : eventIndex(ranked);
}
function rankEvents(sources, terms) {
  const matches = (text) => terms.some((term) => text.includes(term));
  const ranked = [];
  for (const source of sources) {
    const sourceMatch = terms !== undefined && matches(searchText(source, ["source", "title", "description"]));
    for (const event of eventsOf(source)) {
      const order = ranked.length;
      if (terms === undefined) {
        ranked.push({ source, event, score: 0, order, matchedFields: [] });
        continue;
      }
      if (sourceMatch) {
        ranked.push({ source, event, score: 3, order, matchedFields: [] });
        continue;
      }
      if (matches(searchText(event, ["event_type", "source", "title", "description", "delivery_policy"]))) {
        ranked.push({ source, event, score: 2, order, matchedFields: [] });
        continue;
      }
      const matchedFields = fieldsOf(event).filter((field) => matches(fieldSearchText(field))).map((field) => String(field.key));
      if (matchedFields.length > 0)
        ranked.push({ source, event, score: 1, order, matchedFields });
    }
  }
  return ranked.sort((a, b) => b.score - a.score || a.order - b.order);
}
function eventIndex(ranked) {
  const levels = [
    { description: true, settings: "full", matched: "full" },
    { description: true, settings: "keys", matched: "full" },
    { description: false, settings: "keys", matched: "capped" },
    { description: false, settings: "none", matched: "count" }
  ];
  const note = "Index only. Call list_events with this source and event_type to get setting value paths, filter fields and operators before creating a trigger.";
  for (const level of levels) {
    const result = { sources: groupBySource(ranked, (entry) => indexEvent(entry, level)), note };
    if (JSON.stringify(result).length <= LIST_EVENTS_BUDGET_CHARS)
      return result;
  }
  return fitWithinBudget(ranked, (kept) => ({ sources: groupBySource(kept, (entry) => indexEvent(entry, levels[3])), note }));
}
var MATCHED_FIELDS_CAP = 5;
function indexEvent(entry, level) {
  const { event } = entry;
  const summary = { event_type: event.event_type, title: event.title };
  if (level.description && event.description)
    summary.description = event.description;
  if (event.available !== true) {
    summary.available = false;
    if (event.unavailable_reason)
      summary.unavailable_reason = event.unavailable_reason;
  }
  if (event.delivery_policy)
    summary.delivery_policy = event.delivery_policy;
  if (typeof event.poll_interval_seconds === "number" && event.poll_interval_seconds > 0)
    summary.poll_interval_seconds = event.poll_interval_seconds;
  const settings = Array.isArray(event.settings) ? event.settings.filter(isPlainRecord) : [];
  if (level.settings === "full" && settings.length > 0) {
    summary.settings = settings.map((setting) => ({ key: setting.key, title: setting.title, ...setting.required === true ? { required: true } : {} }));
  } else if (level.settings === "keys" && settings.length > 0) {
    summary.setting_keys = settings.map((setting) => String(setting.key));
  }
  const matched = entry.matchedFields;
  if (matched.length > 0) {
    if (level.matched === "full")
      summary.matched_fields = matched;
    else if (level.matched === "capped" && matched.length <= MATCHED_FIELDS_CAP)
      summary.matched_fields = matched;
    else {
      if (level.matched === "capped")
        summary.matched_fields = matched.slice(0, MATCHED_FIELDS_CAP);
      summary.matched_field_count = matched.length;
    }
  }
  return summary;
}
function eventDetails(ranked, fieldKeys) {
  const selected = fieldKeys === undefined ? undefined : new Set(fieldKeys);
  const present2 = new Set(ranked.flatMap(({ event }) => fieldsOf(event).map((field) => String(field.key))));
  const missing = fieldKeys?.filter((key) => !present2.has(key)) ?? [];
  const levels = ["full", "no_descriptions", "outline"];
  let result = {};
  for (const level of levels) {
    result = detailPayload(ranked, level, selected);
    if (missing.length > 0)
      result.missing_field_keys = missing;
    if (JSON.stringify(result).length <= LIST_EVENTS_BUDGET_CHARS)
      break;
  }
  return result;
}
function detailPayload(ranked, level, selected) {
  const operatorSets = {};
  const setNames = new Map;
  const describeField = (field) => {
    const detail = compactRecord(field);
    if (level !== "full")
      delete detail.description;
    if (level === "outline" && Array.isArray(detail.values)) {
      detail.values_count = detail.values.length;
      delete detail.values;
    }
    return detail;
  };
  const keep = (field) => selected === undefined || selected.has(String(field.key));
  const sources = groupBySource(ranked, ({ event }) => {
    const detail = compactRecord(event);
    detail.filter_fields = fieldsOf(event, "filter_fields").filter(keep).map((field) => {
      const { operators, ...rest } = field;
      const list = Array.isArray(operators) ? operators.filter(isPlainRecord).map(compactRecord) : [];
      const signature = JSON.stringify(list);
      let name = setNames.get(signature);
      if (!name) {
        name = `set_${setNames.size + 1}`;
        setNames.set(signature, name);
        operatorSets[name] = list;
      }
      return { ...describeField(rest), operator_set: name };
    });
    if (Array.isArray(event.settings))
      detail.settings = event.settings.filter(isPlainRecord).filter(keep).map(describeField);
    return detail;
  });
  const lookup = "Each filter field lists its operators through operator_set; look the name up in operator_sets for operator, operand_kind and value_schema.";
  const note = level === "full" ? lookup : level === "no_descriptions" ? `${lookup} Field descriptions were dropped to fit the response.` : `${lookup} The definition exceeds the response budget, so field descriptions were dropped and each values list was replaced by values_count. The event is supported: call list_events again with this source, event_type and field_keys naming the settings and filter fields you need to get their full definitions.`;
  return { sources, operator_sets: operatorSets, note };
}
function fitWithinBudget(ranked, build) {
  for (let count = ranked.length;count >= 0; count--) {
    const result = build(ranked.slice(0, count));
    const omitted = ranked.length - count;
    const payload = omitted === 0 ? result : {
      ...result,
      omitted_events: omitted,
      note: `${String(result.note ?? "")} ${omitted} lower-ranked matching event${omitted === 1 ? " was" : "s were"} omitted to fit the response; narrow query, or pass source and event_type.`.trim()
    };
    if (JSON.stringify(payload).length <= LIST_EVENTS_BUDGET_CHARS || count === 0)
      return payload;
  }
  return build([]);
}
function groupBySource(ranked, describe) {
  const groups = new Map;
  for (const entry of ranked) {
    let group = groups.get(entry.source);
    if (!group) {
      group = { source: entry.source.source, title: entry.source.title, events: [] };
      if (entry.source.description)
        group.description = entry.source.description;
      groups.set(entry.source, group);
    }
    group.events.push(describe(entry));
  }
  return [...groups.values()];
}
function eventsOf(source) {
  return Array.isArray(source.events) ? source.events.filter(isPlainRecord) : [];
}
function fieldsOf(event, only) {
  const keys = only ? [only] : ["settings", "filter_fields"];
  return keys.flatMap((key) => Array.isArray(event[key]) ? event[key].filter(isPlainRecord) : []);
}
function fieldSearchText(field) {
  const operators = Array.isArray(field.operators) ? field.operators.filter(isPlainRecord) : [];
  return [
    searchText(field, ["key", "kind", "title", "description", "options_key", "depends_on", "value_path", "unit", "values"]),
    ...operators.map((operator) => searchText(operator, ["operator", "title", "operand_kind"]))
  ].join(`
`);
}
function compactRecord(value) {
  return Object.fromEntries(Object.entries(value).filter(([key, item]) => key === "default_value" || item !== "" && !(Array.isArray(item) && item.length === 0)));
}
function isPlainRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function searchText(value, keys) {
  return keys.flatMap((key) => {
    const candidate = value[key];
    if (typeof candidate === "string")
      return [candidate];
    if (Array.isArray(candidate))
      return candidate.filter((item) => typeof item === "string");
    return [];
  }).join(`
`).toLowerCase();
}
function isSlackChannelLookup(args) {
  return args.source === "slack" && args.field_key === "channel_uid";
}
function slackOptionSearchText(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return "";
  const option = value;
  return ["value", "label"].map((key) => typeof option[key] === "string" ? option[key] : "").join(`
`).toLowerCase();
}
function normalizedResponseTrigger(response, method) {
  if (!("trigger" in response))
    throw new TriggerApiError(`${method} response missing trigger`);
  return normalizeTrigger(response.trigger);
}
function triggerMutationResult(key, trigger) {
  if (!rendersResourceCard(trigger))
    return jsonResult({ [key]: trigger });
  const uri = resourceUriFor(trigger);
  const title = configurationTitle(trigger);
  const envelope = triggerEnvelope(title, uri, trigger);
  return jsonResult({ [key]: trigger, resource_uri: uri, next_steps: `Include the markdown link [${title}](${uri}) in your reply so the user can open the canonical trigger resource.` }, {
    structuredContent: { addon_result: envelope, resource_uri: uri },
    _meta: { "manus.addon.result/v1": envelope }
  });
}
function triggerReadResult(trigger) {
  if (!rendersResourceCard(trigger))
    return jsonResult({ trigger });
  const uri = resourceUriFor(trigger);
  const title = configurationTitle(trigger);
  const envelope = triggerEnvelope(title, uri, trigger);
  return jsonResult({ trigger, resource_uri: uri }, {
    structuredContent: { addon_result: envelope, resource_uri: uri },
    _meta: { "manus.addon.result/v1": envelope }
  });
}
var CUE_PRODUCT_NAME = "manus-agents";
function rendersResourceCard(trigger) {
  return trigger.product_name !== CUE_PRODUCT_NAME;
}
function triggerEnvelope(title, resourceUri, trigger) {
  const modelSummary = {
    trigger_uid: trigger.trigger_uid,
    mode: objectField(trigger, "configuration").mode,
    status: trigger.status,
    revision: trigger.revision,
    resource_uri: resourceUri
  };
  return {
    schema: "manus.addon.result/v1",
    addonId: ADDON_ID,
    resources: [{ resourceUri, title, contentKind: "trigger" }],
    widgets: [],
    attachments: [{ type: "addon_resource", resourceUri, title, contentKind: "trigger" }],
    modelSummary
  };
}
function triggerSummary(trigger) {
  const summary = structuredClone(trigger);
  const configuration = objectField(summary, "configuration");
  const script = configuration.script;
  if (script && typeof script === "object" && !Array.isArray(script))
    delete script.code;
  return summary;
}
function sanitizeExecution(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TriggerApiError("GetExecution response missing execution");
  }
  const execution = structuredClone(value);
  delete execution.raw_receipt;
  delete execution.receipt;
  return execution;
}
function resourceUriFor(trigger) {
  const uid = typeof trigger.trigger_uid === "string" ? trigger.trigger_uid : "";
  if (!uid)
    throw new TriggerApiError("trigger response missing trigger_uid");
  return triggerResourceUri(uid);
}
function configurationTitle(trigger) {
  const title = objectField(trigger, "configuration").title;
  return typeof title === "string" && title.trim() ? title : String(trigger.trigger_uid);
}
function objectField(value, key) {
  const child = value[key];
  return child && typeof child === "object" && !Array.isArray(child) ? child : {};
}
function readArray(value, key) {
  const child = value[key];
  if (!Array.isArray(child))
    throw new TriggerApiError(`response missing ${key}`);
  return child;
}
function stringField(value, key) {
  const child = value[key];
  return typeof child === "string" && child ? child : undefined;
}
function toolArguments(params) {
  if (params.arguments === undefined)
    return {};
  if (!params.arguments || typeof params.arguments !== "object" || Array.isArray(params.arguments)) {
    throw new InputValidationError("tool arguments must be an object");
  }
  return params.arguments;
}
function jsonResult(payload, extras) {
  const { structuredContent: extraStructured, ...rest } = extras ?? {};
  return {
    content: [{ type: "text", text: JSON.stringify(payload) }],
    structuredContent: { ...payload, ...extraStructured },
    ...rest
  };
}
function errorResult(error) {
  const message = error instanceof Error ? error.message : String(error);
  const code = error instanceof TriggerApiError || error instanceof InputValidationError ? error.code : undefined;
  const fieldErrors = error instanceof TriggerApiError ? error.fieldErrors : [];
  const payload = { error: message, ...code ? { code } : {}, ...fieldErrors.length ? { field_errors: fieldErrors } : {} };
  return { content: [{ type: "text", text: JSON.stringify(payload) }], structuredContent: payload, isError: true };
}

class McpUnknownToolError extends Error {
  jsonRpcCode = -32602;
  constructor(name) {
    super(`unknown tool: ${name}`);
  }
}

// mcp/server.ts
var client = new TriggersSandboxClient;
startMcpServer({
  serverInfo: { name: "triggers", version: ADDON_VERSION },
  listTools: () => TOOL_DEFINITIONS,
  callTool: createToolHandler(client)
});
console.error("[triggers] started");
