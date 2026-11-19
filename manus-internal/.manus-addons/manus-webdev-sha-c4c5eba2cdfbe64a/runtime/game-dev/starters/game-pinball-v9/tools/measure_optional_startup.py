from pathlib import Path
p=Path('tools/profile_startup.gd');s=p.read_text();s=s.replace('\tvar files:Array=[]','\tfor i in 8: await process_frame\n\tif "optional_loading" in game:print("OPTIONAL_PROFILE ",JSON.stringify({"timings_ms":game.optional_loading.timings_ms,"done":game.optional_loading.done,"music_ready":game.music_ready}))\n\tvar files:Array=[]');p.write_text(s)
