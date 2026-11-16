import json
from models.bot_factory import create_bot
from common import const
bot = create_bot(const.MANUS)
bot.args['model']='manus-2.0-lite'
gen = bot._http_client.chat_completions(
    model='manus-2.0-lite',
    messages=[{"role":"user","content":"Say only: PING"}],
    stream=True,
)
for i,ev in enumerate(gen):
    print(f"--- chunk {i} ---")
    print(json.dumps(ev, ensure_ascii=False)[:400])
