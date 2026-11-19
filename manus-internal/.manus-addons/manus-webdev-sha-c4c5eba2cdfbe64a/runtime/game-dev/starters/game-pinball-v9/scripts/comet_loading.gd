extends RefCounted
## Frame-staged local preparation, not a claim of worker-thread loading or split downloads.
signal prepared(id:String,resource:Resource)
signal failed(id:String,message:String)
# The only deferred resource is BGM; backgrounds have no loading or preparation stage.
const ITEMS := [
	{"id":"music","path":"res://assets/template/audio/cosmic/celestial-drift.ogg","type":"AudioStreamOggVorbis"}
]
var index:=0
var first_frame:=-1
var last_frame:=-1
var errors:Dictionary={}
var completed:Dictionary={}
var timings_ms:Dictionary={}
var done:=false
var presentation_visible:=false
func tick(safe_window:bool)->void:
	if done:return
	var frame:=Engine.get_process_frames()
	if first_frame<0:first_frame=frame;return
	# On Web, the shell must actually remove its loading overlay first. An engine
	# process frame alone is insufficient: it can occur behind the loading screen.
	if not presentation_visible:
		if OS.has_feature("web"):
			presentation_visible=bool(JavaScriptBridge.eval("window.__cometTitleVisible === true",true))
		else:
			presentation_visible=frame>first_frame
	if not presentation_visible or frame<=first_frame or frame==last_frame or not safe_window:return
	last_frame=frame
	if index>=ITEMS.size():done=true;return
	var item:Dictionary=ITEMS[index]
	index+=1
	var start:=Time.get_ticks_usec()
	var resource:Resource=null
	if ResourceLoader.exists(item.path,item.type):
		resource=ResourceLoader.load(item.path,item.type,ResourceLoader.CACHE_MODE_REUSE)
	timings_ms[item.id]=(Time.get_ticks_usec()-start)/1000.0
	if resource==null:
		var message:String="Optional asset failed: "+item.path+". Keeping the playable base table."
		errors[item.id]=message
		# Explicit diagnostic; optional failure does not abort the game or the remaining queue.
		push_error(message)
		failed.emit(item.id,message)
	else:
		completed[item.id]=true
		prepared.emit(item.id,resource)
	done=index>=ITEMS.size()
func progress()->float:return float(index)/ITEMS.size()
