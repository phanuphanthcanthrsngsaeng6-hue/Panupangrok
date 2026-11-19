#!/usr/bin/env python3
"""Regenerate the pinball owner-preview catalog after baseline gameplay settles."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
cfg = json.loads((ROOT / 'config/pinball-template.json').read_text())
entries = []
translations = {'en': {}, 'zh_CN': {}}
def add(id, category, default, minimum, maximum, step, unit, mode, integrity, en, cn, desc, desc_cn, config_path='', kind='float'):
    key = 'tuning.' + id
    item = dict(id=id, category=category, type=kind, default=default, unit=unit, unit_key=unit, apply_mode=mode, integrity=integrity, label_key=key, description_key=key+'.description', tags=id.split('.'))
    if kind != 'boolean':
        item.update(min=minimum,max=maximum,step=step,decimals=max(0, len(str(step).partition('.')[2])))
    if config_path: item['config_path'] = config_path
    entries.append(item)
    translations['en'].update({key:en,key+'.description':desc})
    translations['zh_CN'].update({key:cn,key+'.description':desc_cn})
def num(id,category,default,lo,hi,step,unit,mode,integrity,en,cn,desc,desc_cn,path='',kind='float'):
    add(id,category,default,lo,hi,step,unit,mode,integrity,en,cn,desc,desc_cn,path,kind)
def flag(id,category,default,en,cn,desc,desc_cn):
    add(id,category,default,None,None,None,'unit.none','LIVE','COSMETIC',en,cn,desc,desc_cn,kind='boolean')
num('ui.hud.opacity','UI',1.0,.5,1,.05,'unit.none','LIVE','COSMETIC','Game text opacity','游戏文字透明度','Opacity of title, table and HUD text; panel widgets keep their own style.','调整标题、球台与状态栏文字的不透明度；面板控件保持原有样式。')
flag('ui.reduced_motion','UI',False,'Reduced motion','减少动态效果','Reduce camera motion and decorative particles.','减少镜头移动与装饰粒子。')
num('gameplay.respawn.delay','GAMEPLAY',cfg['gameplay']['next_ball_delay'],.3,3,.1,'unit.seconds','NEXT_SPAWN','GAMEPLAY','Next-ball delay','下一球等待时间','Delay after the next lost ball.','下一次丢球后等待新球的时间。','gameplay.next_ball_delay')
num('gameplay.ball_save.seconds','GAMEPLAY',cfg['gameplay']['ball_save_seconds'],0,12,.5,'unit.seconds','NEXT_ACTION','GAMEPLAY','Launch ball save','发射救球时间','Safety window beginning at the next launch.','下一次发射后救球保护的持续时间。','gameplay.ball_save_seconds')
num('gameplay.score.combo_window','GAMEPLAY',cfg['scoring']['chain']['seconds'],1,6,.25,'unit.seconds','NEXT_STAGE','SCORE_AFFECTING','Chain window','连击时间','Time allowed between distinct targets in the next mission.','下一任务中击中不同目标的连击有效时间。','scoring.chain.seconds')
num('gameplay.score.combo_bonus','GAMEPLAY',cfg['scoring']['chain']['bonus_per_link'],0,.3,.025,'unit.multiplier','NEXT_STAGE','SCORE_AFFECTING','Chain bonus','连击加分','Extra base-score share per chain link in the next mission.','下一任务中每次连击增加的基础分数比例。','scoring.chain.bonus_per_link')
for bus,default,en,cn in [('master',0,'Master','总音量'),('music',0,'Music','音乐'),('sfx',0,'Effects','音效'),('ui',0,'Interface','界面音效')]:
    num('audio.'+bus+'.volume_db','AUDIO',default,-40,0,1,'unit.db','LIVE','COSMETIC',en+' volume' if bus!='master' else 'Master volume',cn,'Adjust the '+bus+' audio bus.','调整'+cn+'。',kind='integer')
flag('audio.master.muted','AUDIO',False,'Mute all audio','静音','Mute music and all sound effects.','关闭音乐与所有音效。')
num('player.lives','PLAYER',cfg['gameplay']['balls'],1,6,1,'unit.count','NEXT_RUN','GAMEPLAY','Starting balls','初始球数','Number of balls at the start of the next run.','下一局开始时可使用的球数。','gameplay.balls',kind='integer')
num('player.launch.charge_rate','PLAYER',cfg['table']['launcher']['charge_rate'],.4,1.6,.1,'unit.multiplier','NEXT_ACTION','GAMEPLAY','Plunger charge speed','弹射器蓄力速度','Charge speed beginning with the next launch action.','下一次发射操作开始时应用的蓄力速度。','table.launcher.charge_rate')
num('player.flipper.response','PLAYER',cfg['table']['flippers']['left']['response'],10,24,1,'unit.multiplier','LIVE','GAMEPLAY','Flipper response','挡板响应速度','How quickly both flippers reach their active position.','两侧挡板转动到击球位置的速度。')
num('player.nudge.cooldown','PLAYER',cfg['gameplay']['nudge_cooldown'],1,8,.5,'unit.seconds','NEXT_ACTION','GAMEPLAY','Nudge cooldown','震动冷却时间','Cooldown applied after the next table nudge.','下一次震动球台后需要等待的时间。','gameplay.nudge_cooldown')
num('player.nudge.strength','PLAYER',cfg['gameplay']['nudge_y'],80,240,5,'unit.px_per_second','NEXT_ACTION','GAMEPLAY','Nudge strength','震动力度','Upward impulse applied by the next nudge.','下一次震动球台时施加的向上推力。','gameplay.nudge_y')
num('enemies.bumper.kick_multiplier','ENEMIES',1,.5,1.5,.05,'unit.multiplier','LIVE','GAMEPLAY','Bumper kick','弹球器推力','Scale bumper impulses without changing target geometry.','调整弹球器的推力，保持目标形状不变。')
num('enemies.score.multiplier','ENEMIES',1,.5,2,.1,'unit.multiplier','NEXT_STAGE','SCORE_AFFECTING','Target score yield','目标得分倍率','Scale bumper, side-target and sling points in the next mission.','下一任务中弹球器、侧面目标与弹射带的得分倍率。')
num('environment.gravity','ENVIRONMENT',cfg['physics']['gravity'],300,650,10,'unit.px_per_second_squared','LIVE','GAMEPLAY','Table gravity','球台重力','Down-table acceleration applied to every live ball.','所有运动中的球沿球台向下的加速度。','physics.gravity')
num('environment.surface.drag','ENVIRONMENT',cfg['physics']['drag'],0,.1,.005,'unit.none','LIVE','GAMEPLAY','Rolling drag','滚动阻力','Velocity loss over time for every ball.','所有球随时间损失速度的程度。','physics.drag')
flag('environment.filter.enabled','ENVIRONMENT',True,'Screen filter','屏幕滤镜','Enable the cosmetic full-screen color filter.','开启全屏颜色滤镜，仅影响视觉效果。')
num('environment.filter.intensity','ENVIRONMENT',.18,0,.6,.02,'unit.none','LIVE','COSMETIC','Filter intensity','滤镜强度','Blend strength of the full-screen color filter.','全屏颜色滤镜的混合强度。')
num('environment.particles.density','ENVIRONMENT',1,0,2,.1,'unit.multiplier','LIVE','COSMETIC','Particle density','粒子密度','Scale cosmetic emissions within the existing particle cap.','在现有粒子上限内调整装饰粒子的数量。')
num('environment.camera.shake_multiplier','ENVIRONMENT',1,0,1.5,.1,'unit.multiplier','LIVE','COSMETIC','Camera feedback','镜头反馈','Scale impact shake; reduced motion still takes priority.','调整碰撞镜头震动；减少动态效果设置仍优先。')
extra = {
 'tuning.title':('Tweak Controls','调节控制'),
 'tuning.subtitle':('Owner preview · changes save on this device.','创作者预览 · 更改保存在本设备。'),
 'tuning.quick_button':('Tweak Controls','调节控制'),
 'tuning.quick_tooltip':('Open owner-preview controls (F2).','打开创作者预览调节控制（F2）。'),
 'tuning.search':('Search controls','搜索调节项'),
 'tuning.category.all':('All categories','所有类别'),
 'tuning.category.ui':('UI','界面'), 'tuning.category.gameplay':('Gameplay','玩法'),
 'tuning.category.audio':('Audio','音频'), 'tuning.category.player':('Player','玩家'),
 'tuning.category.enemies':('Targets','目标'), 'tuning.category.environment':('Environment','环境'),
 'tuning.apply.live':('Live','立即应用'), 'tuning.apply.next_action':('Next action','下一操作'),
 'tuning.apply.next_spawn':('Next ball','下一球'), 'tuning.apply.next_stage':('Next mission','下一任务'),
 'tuning.apply.next_run':('Next run','下一局'),
 'tuning.value.active':('Active: {value}','当前：{value}'),
 'tuning.value.pending':('Pending · active: {value}','待应用 · 当前：{value}'),
 'tuning.reset_one':('Reset','重置'), 'tuning.reset':('Reset all','全部重置'),
 'tuning.close':('Done','完成'),
 'tuning.saved':('Saved · {count} pending','已保存 · {count} 项待应用'),
 'tuning.save_failed':('Unable to save on this device.','无法在本设备保存。'),
 'tuning.integrity.clean':('Baseline gameplay','标准玩法'),
 'tuning.integrity.practice':('Practice run · tuning history retained','练习局 · 保留本局调节记录'),
 'tuning.no_results':('No matching controls.','没有匹配的调节项。'),
 'common.on':('On','开启'), 'common.off':('Off','关闭'),
 'unit.none':('',''), 'unit.px':(' px',' 像素'), 'unit.db':(' dB',' 分贝'),
 'unit.seconds':(' s',' 秒'), 'unit.count':('',''), 'unit.multiplier':('×','倍'),
 'unit.px_per_second':(' px/s',' 像素/秒'), 'unit.px_per_second_squared':(' px/s²',' 像素/秒²')
}
for key,pair in extra.items():
    translations['en'][key]=pair[0]; translations['zh_CN'][key]=pair[1]
(ROOT/'config/tuning.json').write_text(json.dumps({'version':4,'settings':entries},ensure_ascii=False,indent=2)+'\n')
(ROOT/'tools/tuning_localization.json').write_text(json.dumps(translations,ensure_ascii=False,indent=2)+'\n')
print(f'Generated {len(entries)} pinball controls across six categories.')
