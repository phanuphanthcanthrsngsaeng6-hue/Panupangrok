"""E2E: exercise ManusBot exactly the way the web UI/agent loop does."""
import sys, time, json
from models.bot_factory import create_bot
from common import const
from models.openai_compatible_bot import OpenAICompatibleBot

bot = create_bot(const.MANUS)
bot = OpenAICompatibleBot.__new__(OpenAICompatibleBot) if False else bot
print("bot:", type(bot).__name__, "| base:", bot._api_base, "| model:", bot.args.get("model"))

# 1) plain chat through the same client the UI uses
t0=time.time()
resp = bot._http_client.chat_completions(
    model=bot.args.get("model"),
    messages=[{"role":"user","content":"Reply with exactly: UI_OK"}],
    stream=False,
)
msg = resp["choices"][0]["message"]["content"]
print(f"[plain] {time.time()-t0:.1f}s -> {msg!r}")

# 2) tool-calling path (what the agent loop uses)
t0=time.time()
tools = [{
 "type":"function",
 "function":{"name":"get_time","description":"Return current time",
             "parameters":{"type":"object","properties":{},"required":[]}},
}]
r2 = bot.call_with_tools(
    messages=[{"role":"user","content":"What is 3+4? Answer with only the number."}],
    tools=tools, stream=False,
)
if isinstance(r2, dict):
    ch = (r2.get("choices") or [{}])[0]
    m = ch.get("message") or {}
    print(f"[tools] {time.time()-t0:.1f}s -> content={m.get('content')!r} tool_calls={m.get('tool_calls')}")
else:
    print("[tools] returned", type(r2))

# 3) streaming path
t0=time.time()
gen = bot._http_client.chat_completions(
    model=bot.args.get("model"),
    messages=[{"role":"user","content":"Say only: STREAM_UI"}],
    stream=True,
)
chunks=0; text=""
for ev in gen:
    chunks+=1
    if isinstance(ev, dict):
        for c in ev.get("choices") or []:
            text += (c.get("delta") or {}).get("content") or ""
print(f"[stream] {time.time()-t0:.1f}s chunks={chunks} text={text!r}")
