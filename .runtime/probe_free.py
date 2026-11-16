import requests, concurrent.futures, json, os
BASE='http://127.0.0.1:8741/v1'
ids=sorted({x.get('id') for x in requests.get(BASE+'/models',timeout=30).json().get('data',[]) if x.get('id') and 'free' in x.get('id','').lower()})

def call(mid):
    out={'model':mid}
    try:
        r=requests.post(BASE+'/chat/completions',json={'model':mid,'messages':[{'role':'user','content':'ตอบคำว่า OK เท่านั้น'}],'max_tokens':8,'temperature':0},timeout=20)
        out['http']=r.status_code
        try:
            j=r.json(); c=(j.get('choices') or [{}])[0]; m=c.get('message') or {}
            out['text']=str(m.get('content') or c.get('text') or '').strip()
        except Exception: out['text']=''
        out['ok']=bool(out['text'])
    except Exception as e:
        out.update(http=None,text='',ok=False,error=type(e).__name__+': '+str(e)[:120])
    return out
chunks=[ids[i::3] for i in range(3)]
allres=[]
for idx,ch in enumerate(chunks,1):
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex: rs=list(ex.map(call,ch))
    print(f'CHILD {idx}: tested={len(rs)} passed={sum(x["ok"] for x in rs)}',flush=True)
    allres.extend(rs)
passed=[x for x in allres if x['ok']]
for x in passed:
    x['retries']=[call(x['model']) for _ in range(2)]
    x['stable']=all(y['ok'] for y in x['retries'])
stable=[x['model'] for x in passed if x['stable']]
inter=[x['model'] for x in passed if not x['stable']]
print('CATALOG_FREE_COUNT',len(ids))
print('TOTAL_TESTED',len(allres),'FIRST_PASS',len(passed),'STABLE_3_OF_3',len(stable),'INTERMITTENT',len(inter))
print('STABLE',json.dumps(stable,ensure_ascii=False))
print('INTERMITTENT',json.dumps(inter,ensure_ascii=False))
os.makedirs('knowledge/analysis',exist_ok=True)
with open('knowledge/analysis/free-hierarchy-probe-2026-11-14.json','w') as f: json.dump({'catalog_free_ids':ids,'results':allres,'stable':stable,'intermittent':inter},f,ensure_ascii=False,indent=2)
