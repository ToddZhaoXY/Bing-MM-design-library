from pathlib import Path
import json
from PIL import Image
import numpy as np
base=Path('Bing-MM-design-library/source/projects/mm-image/design/fy25-cards');raw=Image.open(base.parent.parent/'site/public/figma/fy25/windows-bloom.png').convert('RGB')
results=[]
for i in range(3):
 for root in json.loads((base/f'context-wide-geometry-{i}.json').read_text()):
  ref=Image.open(base/('context-wide-reference-'+root['id'].replace(':','-')+'.png')).convert('RGB');s=(ref.width/(root['b'][2]+30) if root['id'] in ['16:8283','1270:28792'] else ref.width/root['b'][2]);errors=[]
  def walk(n,px,py):
   x,y,w,h=n['b'];x+=px;y+=py
   if n['t']=='INSTANCE' and n['n'].strip()=='Image':
    leaf=n['children'][0];lx,ly,lw,lh=leaf['b'];resize=max(lw/640,lh/360);iw,ih=round(640*resize),round(360*resize)
    im=raw.resize((iw,ih),Image.Resampling.LANCZOS);left=(iw-w)/2;top=(ih-h)/2
    im=im.crop((round(left),round(top),round(left)+round(w),round(top)+round(h))).resize((round(w*s),round(h*s)),Image.Resampling.LANCZOS)
    # Central area avoids all corner radii, annotations, buttons and scroller fades.
    l,t=round(x*s),round(y*s);right,bottom=l+im.width,t+im.height
    if l<0 or t<0 or right>ref.width or bottom>ref.height:return
    a=np.asarray(ref.crop((l,t,right,bottom))).astype(float);b=np.asarray(im).astype(float)
    ys=slice(round(h*s*.12),round(h*s*.38));xs=slice(round(w*s*.25),round(w*s*.75))
    err=float(np.mean(np.abs(a-b)[ys,xs]));errors.append(round(err,3));return
   for c in n.get('children',[]):
    if 'Background' not in c['n']:walk(c,x,y)
  for child in root.get('children',[]):walk(child,0,0)
  results.append({'nodeId':root['id'],'meanCropMAE':round(float(np.mean(errors)),3) if errors else None,'perVisibleImageMAE':errors})
(base/'context-wide-image-check.json').write_text(json.dumps(results,indent=2))
for r in results:print(r)
