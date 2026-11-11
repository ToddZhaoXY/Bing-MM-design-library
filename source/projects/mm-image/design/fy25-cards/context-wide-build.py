"""Build native layout descriptors from the inspected FY25 contexts and nested image geometry."""
import json
from pathlib import Path
base=Path(__file__).parent
roots=[]
for i in range(3): roots += json.loads((base/f'context-wide-geometry-{i}.json').read_text())
byid={}
def index(n):
 byid[n['id']]=n
 for c in n.get('children',[]):index(c)
for n in roots:index(n)

def box(w,h,children=(),**style):
 return dict(kind='box',style=dict(position='relative',display='flex',width=w,height=h,flexShrink=0,minWidth=0,minHeight=0,boxSizing='border-box') | style,children=list(children))
def txt(text,w,h,**style):return dict(kind='text',text=text,style=dict(width=w,height=h,flexShrink=0,margin=0,fontFamily='Roboto, Arial, sans-serif',fontSize=14,lineHeight=f'{h}px') | style)
def svg(src):return dict(kind='image',src=src,alt='',style=dict(display='block',flexShrink=0,maxWidth='none'))
def picture(n):
 w,h=n['b'][2:];leaf=n['children'][0];lw,lh=leaf['b'][2:]
 return dict(kind='box',id=n['id'],style=dict(position='relative',display='flex',alignItems='center',justifyContent='center',width=w,height=h,flexShrink=0,minWidth=0,minHeight=0,overflow='hidden',borderRadius=n.get('radius',0),background='#d3dbec'),children=[dict(kind='image',id=leaf['id'],src='./figma/fy25/windows-bloom.png',alt='Windows 11 blue bloom',action='open',style=dict(display='block',width=lw,height=lh,maxWidth='none',flexShrink=0,objectFit='cover',cursor='pointer'))])
def action_more(node_id,x,y):
 return dict(kind='action',id=node_id,action='more',style=dict(position='absolute',left=x,top=y,display='flex',alignItems='center',justifyContent='center',gap=2,width=95,height=28,boxSizing='border-box',padding='4px',border='1px solid rgba(0,0,0,0.1)',borderRadius=9999,background='#000',color='#fff'),children=[box(20,20,[svg('./figma/fy25/wide-all-images.svg')],alignItems='center',justifyContent='center'),dict(kind='text',text='All images',style=dict(fontFamily='Roboto, Arial, sans-serif',fontSize=13,lineHeight='20px',whiteSpace='nowrap',paddingRight=4))])
def convert(n):
 x,y,w,h=n['b'];name=n['n'].strip()
 if name=='Image' and n['t']=='INSTANCE':return picture(n)
 if name=='Top Actions':
  child=n['children'][0];return action_more(child['id'],x,y)
 if name=='Top Button':return action_more(n['id'],x,y)
 if n['t']=='TEXT':
  out=dict(kind='text',id=n['id'],text=n['text'],style=dict(position='absolute',left=x,top=y,width=w,height=h,fontFamily='Inter, Arial, sans-serif',fontSize=n['size'],lineHeight='normal',fontWeight=400,color='#fff',whiteSpace='nowrap',pointerEvents='none'))
  return out
 cs=[convert(c) for c in n.get('children',[]) if 'Background' not in c['n']]
 style=dict(flexDirection='column' if n.get('flex')=='VERTICAL' else 'row',alignItems='flex-start',gap=n.get('gap',0))
 if n.get('radius'):style['borderRadius']=n['radius'];style['overflow']='hidden'
 o=box(w,h,cs,**style);o['id']=n['id'];return o

def rootbox(root,children,bg='#fff',overflow='hidden',radius=16):
 w,h=root['b'][2:]
 out=box(w,h,children,flexDirection='column',borderRadius=radius,overflow=overflow,background=bg,fontFamily='Roboto, Arial, sans-serif',color='#000')
 out['id']=root['id'];return out

def header(w,id):
 arrow=dict(kind='action',id=id+'-browse',action='more',style=dict(display='flex',width=24,height=24,flexShrink=0,alignItems='center',justifyContent='center',background='transparent',border=0,padding=0,borderRadius=8),children=[svg('./figma/fy25/wide-chevron-title.svg')])
 return box(w,24,[txt('Title',w-28,22,fontWeight=700),arrow],gap=4,alignItems='center')

def carousel(root,small):
 w=root['b'][2];vw=w-40;content_id='1270:16151' if small else '1270:18503'
 prefix='I1270:16151;1270:15897;96280:371405;' if small else 'I1270:18503;1270:17113;96280:371384;'
 rowA=byid[prefix+'1270:15222'];rowB=byid[prefix+'1270:15227']
 rows=[box(row['b'][2],172,[picture(n) for n in row['children']],gap=8,alignItems='center') for row in [rowA,rowB]]
 rail=box(rowA['b'][2],352,rows,flexDirection='column',gap=8)
 viewport=box(vw,352,[rail],overflowX='auto',overflowY='hidden',scrollbarWidth='none')
 contents=[viewport]
 if small:
  fade=box(20,352,[dict(kind='image',src='./figma/fy25/wide-carousel-fade.png',alt='',style=dict(width=352,height=20,maxWidth='none',flexShrink=0,transform='rotate(-90deg)',objectFit='fill'))],alignItems='center',justifyContent='center')
  contents.append(box(50,352,[fade,box(30,352,background='#f5f5f5')],position='absolute',left=466,top=0,pointerEvents='none'))
  contents.append(dict(kind='action',id='I1270:16151;1270:15897;96280:371409',action='scroll',style=dict(position='absolute',left=484,top=163,width=24,height=24,display='flex',alignItems='center',justifyContent='center',padding=4,border=0,borderRadius=4,background='transparent'),children=[svg('./figma/fy25/wide-chevron-carousel.svg')]))
 content=box(vw,384,[header(vw,content_id),box(vw,352,contents)],flexDirection='column',gap=8)
 out=rootbox(root,[content],bg='#f5f5f5' if small else '#ebf6ff');out['style']['padding']=20
 return out

def rail(root,captions):
 parts=[]
 for child in root['children']:
  if child['n']=='Scroller Button':continue
  if not captions:parts.append(picture(child));continue
  img=picture(child['children'][0]);w=child['b'][2]
  title=txt('Image title',w-8,22,fontWeight=700,color='rgba(0,0,0,0.8)',overflow='hidden',textOverflow='ellipsis',whiteSpace='nowrap')
  favicon=box(16,16,background='rgba(0,0,0,0.6)',borderRadius=4)
  source=box(192,20,[favicon,txt('Source.com',172,20,fontSize=13,fontWeight=400,color='rgba(0,0,0,0.6)',whiteSpace='nowrap')],gap=4,alignItems='center')
  meta=box(w,46,[title,source],flexDirection='column',gap=4,padding='0 4px')
  parts.append(box(w,200,[img,meta],flexDirection='column',gap=8))
 scroll_id=root['children'][-1]['id']
 scroller=dict(kind='action',id=scroll_id,action='scroll',style=dict(position='absolute',left=1190,top=76,width=36,height=48,display='flex',alignItems='center',justifyContent='center',padding='12px 8px',border='1px solid rgba(0,0,0,0.1)',boxSizing='border-box',borderRadius=8,background='#fff',boxShadow='0 4px 12px 1px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)'),children=[svg('./figma/fy25/wide-chevron-scroller.svg')])
 out=rootbox(root,[box(1208,200,parts,gap=16),scroller],bg='transparent',overflow='visible',radius=0)
 return out

labels={
'1270:15035':'Hero 3:4 + two squares','2104:1146':'Half-width hero + two images','2104:1116':'Hero + four images','1270:15143':'Panorama + three images','16:7977':'Two-row carousel','1270:16393':'Two + three images','1270:16460':'Two-thirds hero + two images','1270:16518':'Panorama + three images · alternate','1270:16623':'Four-image grid','1270:16678':'Square hero + two images','1270:16733':'Panorama + three images','1270:16845':'Three + four images','1270:16936':'Square hero + two images · all images','1270:17041':'Four-image grid','1270:18499':'Two-row gallery with title','16:8044':'Eight-image mosaic','16:8068':'Eight-image mosaic','1270:19211':'Nine-image mosaic','16:8153':'Five-image strip','16:8283':'Five-image rail','1270:28792':'Image rail with title and source'}
inv=json.loads((base/'inventory.json').read_text());groups=[]
for size in ['5x4','6x4','8x4','9x4','11x4','11x2']:
 variants=[]
 for item in [i for i in inv if i['size']==size]:
  n=byid[item['id']];nid=n['id']
  if nid in ['16:7977','1270:18499']:tree=carousel(n,nid=='16:7977')
  elif nid in ['16:8283','1270:28792']:tree=rail(n,nid=='1270:28792')
  else:
   if nid=='16:8153':content=[convert(c) for c in n['children']]
   else:
    card=n['children'][0]
    content=[convert(c) for c in card['children'] if 'Background' not in c['n']]
   tree=rootbox(n,content)
  notes=[]
  if nid=='1270:15035':notes=['The three aspect-ratio annotations are visible in the supplied Figma variant.']
  if nid in ['1270:16678','1270:16733']:notes=['This source variant has no All images pill; individual images remain interactive.']
  variants.append(dict(id='figma-'+nid.replace(':','-'),label=labels[nid],nodeId=nid,tree=tree,**({'notes':notes} if notes else {})))
 groups.append(dict(size=size,width=item['width'],height=item['height'],variants=variants))
output="import type { ImageCardGroup } from './types'\n\n/** FY25 Figma source variants. Layout and image bounds are recorded in design/fy25-cards/context-wide-*. */\nexport const wideCardGroups: ImageCardGroup[] = "+json.dumps(groups,ensure_ascii=False,indent=2)+'\n'
(base.parent.parent/'site/src/data/image-cards/wide.ts').write_text(output)
print('Wrote',sum(len(g['variants']) for g in groups),'variants across',len(groups),'groups')
