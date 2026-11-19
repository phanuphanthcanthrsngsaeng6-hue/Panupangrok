#!/bin/bash

# Platform-owned topology must survive sudo's env_reset when startup launches
# supervisord. A non-empty launcher value wins; the baked runtime ~/.env is the
# fallback; user-managed ~/.user_env must never replace either. Keep this list
# synchronized with ConfigService's reserved runtime env keys.
readonly SUPERVISOR_RUNTIME_ENV_ALLOWLIST="APP_ENV,RUNTIME_API_HOST,ADDON_WORKSPACE_AUTHORITY_JWKS,ADDON_ALLOW_MULTI_PROJECT_SANDBOX,MANUS_ADDON_PREVIEW_PUBLIC_ORIGIN,MANUS_ADDON_RUNTIME_PUBLIC_ORIGIN,MANUS_ADDON_SERVER_BRANCH"

declare -a SUPERVISOR_RUNTIME_TRUSTED_ENV_VALUES=()
declare -a SUPERVISOR_RUNTIME_TRUSTED_ENV_PRESENT=()
declare -a SUPERVISOR_RUNTIME_AMBIENT_ENV_VALUES=()
declare -a SUPERVISOR_RUNTIME_AMBIENT_ENV_PRESENT=()

capture_supervisor_runtime_ambient_env() {
    local keys=()
    local index
    local key

    IFS=',' read -r -a keys <<<"$SUPERVISOR_RUNTIME_ENV_ALLOWLIST"
    SUPERVISOR_RUNTIME_AMBIENT_ENV_VALUES=()
    SUPERVISOR_RUNTIME_AMBIENT_ENV_PRESENT=()
    for index in "${!keys[@]}"; do
        key="${keys[$index]}"
        if printenv "$key" >/dev/null 2>&1; then
            SUPERVISOR_RUNTIME_AMBIENT_ENV_PRESENT[$index]=1
            SUPERVISOR_RUNTIME_AMBIENT_ENV_VALUES[$index]="${!key}"
        else
            SUPERVISOR_RUNTIME_AMBIENT_ENV_PRESENT[$index]=0
            SUPERVISOR_RUNTIME_AMBIENT_ENV_VALUES[$index]=""
        fi
    done
}

capture_supervisor_runtime_env() {
    local keys=()
    local index
    local key

    IFS=',' read -r -a keys <<<"$SUPERVISOR_RUNTIME_ENV_ALLOWLIST"
    SUPERVISOR_RUNTIME_TRUSTED_ENV_VALUES=()
    SUPERVISOR_RUNTIME_TRUSTED_ENV_PRESENT=()
    for index in "${!keys[@]}"; do
        key="${keys[$index]}"
        if [ "${SUPERVISOR_RUNTIME_AMBIENT_ENV_PRESENT[$index]:-0}" = "1" ] &&
            [ -n "${SUPERVISOR_RUNTIME_AMBIENT_ENV_VALUES[$index]}" ]; then
            # A non-empty launcher override wins over the baked runtime env.
            SUPERVISOR_RUNTIME_TRUSTED_ENV_PRESENT[$index]=1
            SUPERVISOR_RUNTIME_TRUSTED_ENV_VALUES[$index]="${SUPERVISOR_RUNTIME_AMBIENT_ENV_VALUES[$index]}"
        elif printenv "$key" >/dev/null 2>&1; then
            # An unset/empty launcher value intentionally lets the baked,
            # platform-provided ~/.env value win.
            SUPERVISOR_RUNTIME_TRUSTED_ENV_PRESENT[$index]=1
            SUPERVISOR_RUNTIME_TRUSTED_ENV_VALUES[$index]="${!key}"
        else
            SUPERVISOR_RUNTIME_TRUSTED_ENV_PRESENT[$index]=0
            SUPERVISOR_RUNTIME_TRUSTED_ENV_VALUES[$index]=""
        fi
    done
}

supervisor_runtime_reserved_env_key() {
    local key="$1"

    case ",$SUPERVISOR_RUNTIME_ENV_ALLOWLIST," in
        *",$key,"*) return 0 ;;
    esac
    case "$key" in
        SUPERVISOR_RUNTIME_ENV_ALLOWLIST | \
            SUPERVISOR_RUNTIME_TRUSTED_ENV_VALUES | \
            SUPERVISOR_RUNTIME_TRUSTED_ENV_PRESENT | \
            SUPERVISOR_RUNTIME_AMBIENT_ENV_VALUES | \
            SUPERVISOR_RUNTIME_AMBIENT_ENV_PRESENT)
            return 0
            ;;
    esac
    return 1
}

load_user_environment_safely() {
    local user_env_file="$1"
    local entry
    local key
    local value

    while IFS= read -r -d '' entry; do
        key="${entry%%=*}"
        value="${entry#*=}"
        case "$key" in
            "" | [0-9]* | *[!A-Za-z0-9_]*) continue ;;
        esac
        if supervisor_runtime_reserved_env_key "$key"; then
            continue
        fi
        printf -v "$key" '%s' "$value"
        export "$key"
    done < <(
        (
            # Source in a child shell: even a stale pre-fix file cannot mutate
            # the parent snapshot, functions, or platform topology.
            set -a
            source "$user_env_file" >/dev/null 2>&1
            set +a
            env -0
        )
    )
}

restore_supervisor_runtime_env() {
    local keys=()
    local index
    local key
    local value

    IFS=',' read -r -a keys <<<"$SUPERVISOR_RUNTIME_ENV_ALLOWLIST"
    for index in "${!keys[@]}"; do
        key="${keys[$index]}"
        value=""
        if [ "${SUPERVISOR_RUNTIME_TRUSTED_ENV_PRESENT[$index]:-0}" = "1" ]; then
            value="${SUPERVISOR_RUNTIME_TRUSTED_ENV_VALUES[$index]}"
        fi
        printf -v "$key" '%s' "$value"
        export "$key"
    done

    # Do not retain a second in-process copy of the authority material after
    # the trusted values have been restored into the launch environment.
    SUPERVISOR_RUNTIME_TRUSTED_ENV_VALUES=()
    SUPERVISOR_RUNTIME_TRUSTED_ENV_PRESENT=()
    SUPERVISOR_RUNTIME_AMBIENT_ENV_VALUES=()
    SUPERVISOR_RUNTIME_AMBIENT_ENV_PRESENT=()
}
