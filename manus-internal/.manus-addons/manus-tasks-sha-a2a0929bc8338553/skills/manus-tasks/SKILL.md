---
name: manus-tasks
description: Use Manus Tasks to create, find, rename, hide, share, archive, pin or favorite tasks, check which tasks have unread results, move tasks into, between or out of Projects or sidebar Sections, manage custom Sections, read task history and send task messages. Also manage Projects and obtain temporary Manus API access for scripts.
---

# Manus Tasks Addon

Use the MCP server named exactly `manus-tasks` in a Manus chat, on cloud Sandbox or Manus Desktop. This skill describes the addon's tools and temporary script access, not how to configure API keys or OAuth for external integrations.

## Choose the execution path

The task, section, file and Project tools below need no additional confirmation or `get_access` call and do not install API credentials; the underlying action must still be requested by the user. Use each tool's input schema. For supported script-based HTTP operations, call `get_access` first; its first call asks the user to allow script API access for this chat. Wait for that decision rather than asking for a second verbal confirmation. Denial of script access does not disable the direct tools, but never use them to contradict a refusal of the underlying action.

Only the main conversation agent may call these tools, including `get_access`. Child/workflow subagents and detached executions must return the API work to their main-session coordinator. A tool error is not success. If script approval is pending or rejected, do not read or use credentials or retry automatically. An older host reporting an unsupported direct tool needs updating; do not automatically request script access as a fallback.

## Task management

中文名称统一为“分区”，与主端“新建分区”一致。用户俗称“分组”时也理解为同一分区；工具与参数只使用 Section / `section_id`，不提供第二套英文别名。

| User intent | Direct MCP tool | Workflow |
| --- | --- | --- |
| Find tasks or inspect a Project's tasks | `list_tasks` | For a specific Project, pass both `scope: "project"` and `project_id`; retain returned task IDs for later calls. |
| Read another task's conversation or results | `list_task_messages` | Use its `task_id`; read relevant history before summarizing results or sending a context-dependent follow-up. |
| Continue a task or send it instructions | `send_task_message` | Send `message.content` to the existing `task_id`; do not create a replacement task. |
| Attach local files to a task message | `create_task` or `send_task_message` | Put each file in `message.content` as `{"type":"file","file_path":"<absolute path>"}` next to the text it belongs to; the tool uploads it before sending. Use `upload_file` only to reuse the same files in several messages. |
| Rename, hide, share or favorite a task | `update_task` | Omit `task_id` for the current task; use an explicit ID for another task. Provide only the requested settings. Keep a section change in a separate request. |
| Move a task into, between or out of Projects | `list_projects`, then `update_task` | Set `project_id` to the destination Project's returned ID; set it to an empty string to remove the task from its Project. This requires a task you own. The task keeps its Section. |
| Archive or unarchive a task | `update_task` | Set `is_archived` only when the user asks to archive or unarchive; hiding is a different setting. This requires a task you own. Agent tasks and their subtasks cannot be archived: report that error and do not hide the task instead. To find archived tasks, call `list_tasks` with `is_archived: true`. |
| Find a sidebar Section or move a task by section name | `list_sections`, then `update_task` | Query sections first; match the returned name and pass its ID as `section_id`. The update response confirms the move; verification is optional. |
| Create a custom sidebar section | `create_section` | Pass the requested `name`; retain the returned `section.id`. Creating it does not move tasks. |
| Rename a custom sidebar section | `list_sections`, then `update_section` | Resolve the requested section ID; pass `section_id` and the new `name`. |
| Move a task from section A to section B | `update_task` | Set B’s ID as `section_id` in one separate request; do not remove it from A first. |
| Remove a task from its section | `update_task` | Set `section_id` to an empty string in a separate request. |
| Pin or unpin a task | `update_task` | Set `pinned` to true or false for a task you can access. Other settings require ownership. Keep a section change separate. |
| Query task section membership, pin state or unread results | `list_tasks` | Inspect returned `section_id`, the caller’s personal `pinned` boolean and personal `is_unread` boolean (new results the caller has not opened in Manus); none is a filter argument. A task without `section_id` is not in a custom Section. Listing tasks does not mark them as read. |
| Start an independent job | `create_task` | Supply a self-contained first message; omit `project_id` to inherit the current Project; set an ID or an empty string only to override it. |

Sections are personal partitions in the Manus sidebar, not Projects. A task can be in a Project and a Section at the same time; changing one keeps the other. The sidebar shows each task in one place, in this order: Pinned, then its custom Section, then its Project, then Tasks. A pinned task appears only under Pinned; an unpinned task in a custom Section appears under that Section, not under its Project, and `list_tasks` with `scope: "project"` still returns it. Manage only your custom sections; default sidebar partitions cannot be renamed. Trim names to 1–80 Unicode characters; at most 50 custom sections are allowed. Duplicate names are allowed: resolve by ID and ask the user to choose if ambiguous. Section IDs must be nonempty and at most 128 characters, except `update_task(section_id: "")` to move out. Do not create a section merely because no name matches unless the user asked for one. These tools cannot delete a section or a task; if the user asks, tell them to do it in the Manus sidebar.

A successful `update_task` response confirms the move. Keep `section_id` separate from all other settings, including `pinned`. Optionally compare `section_id` or personal `pinned` state when the task is already in a retrieved list. Do not paginate just to verify a move. An unavailable optional read-back does not negate a successful update; report any observed mismatch separately. If `update_task` with `is_archived` or `section_id`, or `list_tasks` with `is_archived`, fails with `unsupported manus api argument` on Manus Desktop, nothing was changed and the app predates that setting: tell the user the app is too old and ask them to update it to the latest version, then retry. Elsewhere, that error means an argument outside the tool schema: correct the arguments instead of asking for an update.

Resolve a task from an explicit ID or `list_tasks`; if several tasks match, ask which one before sending a message. Follow `next_cursor` when the requested task/history is not on the first page. A partial page is not the entire history, and an accepted message does not mean the task has finished.

**Send files as attachments.** Another task cannot open this computer's paths, and copied signed URLs break or expire. To share a screenshot, report or other local file, add `{"type":"file","file_path":"<absolute path>"}` to `message.content` of `create_task` or `send_task_message`; the tool uploads the file and sends the message in one call. Do not paste a path or URL into the text, and do not call `upload_file` first for a single message. One message accepts up to 20 local files, each with a file extension; executables, scripts and installers are rejected, and each file must finish uploading within 3 minutes. If an upload fails, nothing is sent: report the error rather than sending the message without the files. To send the same files to several tasks, call `upload_file` once and use the returned `{"type":"file","file_id":"..."}` parts within 48 hours. If a `file_path` part fails with `file content part must have one of`, nothing was sent and the host running this task predates `file_path`: call `upload_file` and send `file_id` parts instead.

**Continue in the current task by default.** Create a separate user-visible task only when the user explicitly asks for one or accepts a new-task suggestion; do not ask for another confirmation after that. A request to continue, implement, test, deploy, or work in parallel does not request a new task. Keep the requested outcome and its necessary follow-up work here, using internal subagents/workflow where appropriate. Standalone value, duration, complexity, parallelism, a new phase, or easier progress tracking alone do not justify creating or suggesting another task. Proactively suggest one only when the conversation establishes a separate user goal outside the current request and a concrete need to manage it independently; otherwise continue here or finish without a suggestion.

New tasks default to the current device, working directory, Project and agent profile, including the Max thinking level. Set `agent_profile` only when the user asks for a mode: `lite`, `standard`, `max`, or `max-medium` / `max-high` / `max-extra` / `max-ultra` for a Max thinking level. They also inherit the current Skill, Connector and Addon selection, including connector_mcp Addons and disabled selections. Explicit nonempty message.connectors replaces the Connector/Addon selection; message.enable_skills replaces the Skill selection; message.force_skills augments it. Credentials are resolved again for the new task. Omit `execution_environment` unless the user specifies another target or asks for a separate Git worktree. `kind: "device"` requires an inherited device or an explicit authorized `device_id`. `working_directory` also requires a device; if the current task uses a sandbox, supply `device_id` as well. Its optional `device_id` and `working_directory` override the selection; changing devices without a directory uses the target device's default workspace, never the source machine's path. `kind: "sandbox"` selects a fresh sandbox and cannot be combined with device, directory or worktree fields. A new task remains independent and receives its own runtime credentials. Report unavailable environments or permissions; do not silently switch devices.

Tasks on the same device and directory share its files. No Git worktree is created unless `execution_environment.worktree` is `true`, which matches the worktree option when a user creates a task. Set it when the user or project instructions ask for a separate worktree, for example for parallel coding tasks on one repository; do not ask the new task to create its own worktree instead. The worktree is created from `working_directory`, or else from the current task's selected folder rather than its current worktree; that folder must be a Git repository root on a Desktop. A sandbox, another device type or a missing folder is rejected, and the new task pauses if the worktree cannot be prepared. Report these failures; do not retry without `worktree` unless the user agrees to share the folder. If a call with `worktree` fails with `unsupported manus api argument`, no task was created and the host running this task predates the option: on Manus Desktop, tell the user the app is too old and ask them to update it to the latest version, then retry.

For `create_task`, omit `title` so Manus generates it unless the user explicitly supplies a title. Leave `hide_in_task_list` unset or false unless the user asks to hide it. The new task does not inherit this chat's full conversation or copy files from an isolated sandbox: put the needed context in the first message or use supported `message.task_references`. Report the returned task ID/link after success; by default, do not poll or wait for it. After a timeout with an unknown outcome, inspect task/history results before retrying a create or send that may already have succeeded.

## Project management

A Manus Project organizes tasks with reusable instructions and shared connector/skill defaults; it is not a webdev project or a separate agent identity. Use a task for one-off work and a Project for persistent behavior shared by multiple tasks.

| User intent | Direct MCP tool | Workflow |
| --- | --- | --- |
| Find or reuse a Project | `list_projects` | Takes no arguments and returns all accessible project summaries; use the returned ID, not a guessed name-derived ID. |
| Create a Project | `create_project` | Provide `name` and optional `instruction`; use `update_project` for other shared settings. |
| Change a Project | `update_project` | Provide `project_id` and only the settings the user wants to change. |

For work in a named Project, find it with `list_projects`. To list its tasks, call `list_tasks` with `{"scope":"project","project_id":"<returned ID>"}`: `project_id` alone is ignored because the default scope is `all`. For `create_task`, pass the Project ID when overriding the current Project. Ask for a choice when the target is ambiguous. If the user wants a new Project, create it and use the returned ID for subsequent tasks. Creating a Project does not create a task, and creating a task inherits the current Project when `project_id` is omitted; an explicit empty string creates it outside a Project.

**Update shared settings deliberately.** Use `name` or `description` for organization, `instruction` for persistent behavior, and `connector_ids` / `skill_ids` for shared resource defaults. A one-task preference belongs in that task's message, not shared Project settings. Omitted or null fields stay unchanged; empty text clears a description/instruction, and empty resource arrays clear those defaults.

Resource arrays replace the complete set, not append/remove individual IDs. Project summaries do not provide the full configuration. Before adding/removing a resource, obtain the current set through `project.detail` if script access is already available, or from the user; do not guess or drop existing IDs. A user-specified complete replacement does not require reading unrelated settings. Do not request script access merely to use a direct MCP tool.

Connector assignment does not grant authorization. Personal skills must first be copied/imported into the Project. Clearing defaults does not delete skill content or member overrides. Report permission or resource failures rather than silently dropping requested resources.

## Script API access

Call `get_access` with `{}`. After it returns `ready: true`, read `MANUS_API_BASE_URL`, `MANUS_API_KEY`, and `MANUS_API_KEY_EXPIRES_AT` from the terminal environment without printing their values. If it returns `ready: false`, stop and report that script access is unavailable. Send HTTP requests to the injected base URL with the key in the `x-sandbox-token` header; do not hardcode a production or dev endpoint. Supported HTTP operations, including `task.create` and `agent.create`, need no per-create confirmation.

The host installs the temporary key before reporting readiness, in both cloud Sandbox and Manus Desktop. On Desktop, use the terminal bound to this chat's workspace; credentials are not installed in global environment variables or shared with other chats. The host manages a session environment file named `env`; the terminal loads updated credentials before the next command without restarting the shell. Do not locate, source, or edit this file yourself. Already-running processes keep their inherited environment.

On older Desktop hosts that report a terminal restart after a credential change, restore shell-local setup and retry the unexecuted command. Do not call `get_access` again just to recover that terminal.

Availability: session/project context requires the updated Manus Tasks addon and host to be deployed together. Older installations may omit these fields. Missing `project_id` is not the same as `null`; if a required ID is absent, report that context is unavailable and request an updated installation or an explicit ID—never guess it.

`get_access` also returns `session_id` and `project_id` for the current chat. These values come from the host; `project_id` is `null` when the chat is not in a Manus Project. It is not a webdev project ID. Use these returned fields when an operation needs the current chat or project; do not infer them from token contents, file paths, or terminal session names. They describe the current context, not additional authorization. New tasks inherit the current Project by default.

Access tokens expire after 30 minutes. `MANUS_API_KEY_EXPIRES_AT` is a Unix timestamp in seconds. Call `get_access` again shortly before expiry, after the environment has lost its API credentials (not merely restarted a shell), or once after an API authentication failure. The authorization is remembered for this session, so refreshing or reacquiring access does not require another confirmation. A new session requires its own authorization. If access is rejected, stop the current attempt and do not retry unless the user asks again. If a refresh fails, stop and report the failure.

The temporary API key supports only these HTTP endpoints:

- Tasks: `task.create`, `task.list`, `task.sendMessage`, `task.listMessages`, `task.stop`
- Agents: `agent.create`, `agent.list`, `agent.detail`
- Projects: `project.detail`, `project.update`

Stay within these endpoints. Access approval covers API use in this chat, but does not expand the user's requested scope. Before creating a reusable agent, sending, or stopping a task, ensure the current request calls for it. The Task management lifecycle guidance above also applies to script-created tasks. Never print, echo, log, or repeat credential values.

For a task waiting on a normal question, use `send_task_message`. An action confirmation is different: `task.confirmAction` is not available through this addon, so ask the user to complete it in Manus. To attach files, use `file_path` parts in the direct tools or the `upload_file` tool; the temporary key does not enable HTTP file upload, connector/skill discovery, webhooks, or other unlisted HTTP operations.

## API endpoint details

MCP input schemas are the authority for direct tool arguments; using those tools does not require the `manus-api` skill. For script-based API v2 request/response schemas and integration guidance, use the separate `manus-api` skill when available. This addon does not bundle or install it. If it is unavailable and required endpoint details are unknown, report the missing reference rather than inventing parameters.

When using a temporary key from `get_access`, keep this skill's injected base URL, `x-sandbox-token` header, expiry, and endpoint limits. The API skill's external API-key/OAuth examples and broader endpoint catalog do not change this runtime access contract or authorize additional operations.
