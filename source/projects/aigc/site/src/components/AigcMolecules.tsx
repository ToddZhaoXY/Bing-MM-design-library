/**
 * AIGC molecules rebuilt from scoped Figma Plugin API exports.
 * Canonical component sets: MainImage 461:31862; Strip 470:34378; HistoryRail 437:83640.
 * See design/molecule-specs.json for variant and geometry evidence.
 * Native image fills + semantic controls; no flattened specification-card images.
 */
import * as React from 'react'
import { figmaImage } from '../data/assets'

const SOURCE_ICONS = {
  "edit": {
    "size": 16,
    "shapes": [
      {
        "x": 1,
        "y": 0.99609375,
        "paths": [
          "M 13.235956192016602 0.767767071723938 C 12.212267875671387 -0.25592172145843506 10.552539825439453 -0.25592267513275146 9.528850555419922 0.7677661180496216 L 1.6572203636169434 8.639391899108887 C 1.283041000366211 9.013571739196777 1.0162298679351807 9.481383323669434 0.8846703171730042 9.993937492370605 L 0.015709733590483665 13.379400253295898 C -0.02823292650282383 13.550600051879883 0.02147659659385681 13.732280731201172 0.1464574933052063 13.857261657714844 C 0.2714383900165558 13.982242584228516 0.4531182646751404 14.031951904296875 0.6243184208869934 13.988009452819824 L 4.009782791137695 13.119048118591309 C 4.522336959838867 12.987488746643066 4.990148067474365 12.720678329467773 5.364326477050781 12.3464994430542 L 13.235956192016602 4.474874019622803 C 14.25964641571045 3.4511847496032715 14.259645462036133 1.7914559841156006 13.235956192016602 0.767767071723938 Z M 10.235957145690918 1.4748730659484863 C 10.869121551513672 0.841708779335022 11.895684242248535 0.8417090177536011 12.528849601745605 1.4748737812042236 C 13.162014961242676 2.108038902282715 13.162014961242676 3.1346023082733154 12.528849601745605 3.7677669525146484 L 11.750024795532227 4.546591281890869 L 9.457132339477539 2.253697633743286 L 10.235957145690918 1.4748730659484863 Z M 8.750024795532227 2.9608044624328613 L 11.04291820526123 5.253697395324707 L 4.657219886779785 11.639392852783203 C 4.409694671630859 11.886918067932129 4.1002302169799805 12.063417434692383 3.7611677646636963 12.150445938110352 L 1.1944677829742432 12.809250831604004 L 1.8532726764678955 10.242552757263184 C 1.9403014183044434 9.90349006652832 2.1168012619018555 9.594024658203125 2.3643269538879395 9.3464994430542 L 8.750024795532227 2.9608044624328613 Z"
        ],
        "fill": {
          "r": 1,
          "g": 1,
          "b": 1
        },
        "opacity": 0.800000011920929
      }
    ]
  },
  "like": {
    "size": 16,
    "shapes": [
      {
        "x": 2.125,
        "y": 1.0068359375,
        "paths": [
          "M 5.909944534301758 0.9164857268333435 C 6.119108200073242 0.3956456780433655 6.705057621002197 -0.1638360470533371 7.455599308013916 0.04476208984851837 C 8.045899391174316 0.20882414281368256 8.429369926452637 0.5657475888729095 8.648531913757324 1.0412291288375854 C 8.852813720703125 1.4844258427619934 8.902968406677246 2.006096124649048 8.912528991699219 2.5032424926757812 C 8.922812461853027 3.0380020141601562 8.811120986938477 3.6795718669891357 8.679662704467773 4.2406768798828125 C 8.618387222290039 4.502221345901489 8.550859451293945 4.754331111907959 8.484945297241211 4.980963706970215 L 9.869916915893555 4.980963706970215 C 11.204755783081055 4.980963706970215 12.164970397949219 6.263662815093994 11.788902282714844 7.544430255889893 L 10.42469310760498 12.190495491027832 C 10.030534744262695 13.532875061035156 8.6115403175354 14.290523529052734 7.276785850524902 13.871270179748535 L 1.920906662940979 12.188959121704102 C 1.3339083194732666 12.004579544067383 0.8644444346427917 11.560279846191406 0.648038387298584 10.984318733215332 L 0.12804493308067322 9.60036563873291 C -0.21358153223991394 8.691132545471191 0.1474432349205017 7.667892932891846 0.9840019941329956 7.174353122711182 L 2.8558948040008545 6.070003986358643 C 2.8596160411834717 6.067391395568848 2.865023612976074 6.063531875610352 2.872039318084717 6.058363914489746 C 2.8926119804382324 6.043209075927734 2.9270434379577637 6.01677942276001 2.9733545780181885 5.977510929107666 C 3.0659279823303223 5.899014949798584 3.20627760887146 5.768957138061523 3.378495216369629 5.574708461761475 C 3.7225518226623535 5.186638355255127 4.196413040161133 4.539418458938599 4.6706461906433105 3.5302023887634277 C 4.875515460968018 3.0942201614379883 5.0478715896606445 2.751497268676758 5.204405784606934 2.440235137939453 C 5.457425594329834 1.9371159076690674 5.6691083908081055 1.5161938071250916 5.909944534301758 0.9164857268333435 Z M 3.3944578170776367 6.912854194641113 C 3.388783568982035 6.916503595653921 3.3830493087880313 6.920060328906402 3.3772382736206055 6.923488140106201 L 1.4921278953552246 8.035635948181152 C 1.0738482475280762 8.282406330108643 0.8933360576629639 8.794026374816895 1.0641491413116455 9.248642921447754 L 1.5841425657272339 10.632596015930176 C 1.6923456192016602 10.920576095581055 1.9270775318145752 11.14272689819336 2.220576524734497 11.234915733337402 L 7.576456069946289 12.917226791381836 C 8.377309322357178 13.168779373168945 9.228705406188965 12.714189529418945 9.465200424194336 11.90876293182373 L 10.8294095993042 7.262697219848633 C 11.017443656921387 6.622313022613525 10.537335395812988 5.980963706970215 9.869916915893555 5.980963706970215 L 7.800873756408691 5.980963706970215 C 7.638487339019775 5.980963706970215 7.486215114593506 5.902103900909424 7.392512798309326 5.769479751586914 C 7.298810958862305 5.636855602264404 7.275351047515869 5.466986656188965 7.329599380493164 5.313929557800293 C 7.429576396942139 5.031851291656494 7.581721782684326 4.543146848678589 7.706027507781982 4.012569427490234 C 7.832108020782471 3.474416971206665 7.920556545257568 2.9302539825439453 7.91271448135376 2.5224695205688477 C 7.903708457946777 2.05415940284729 7.854065895080566 1.706514596939087 7.740362167358398 1.459829568862915 C 7.641539573669434 1.245429277420044 7.488837242126465 1.0919040441513062 7.187819480895996 1.008242130279541 C 7.14471435546875 0.9962618947029114 7.094483852386475 0.9997591376304626 7.028530120849609 1.0430546998977661 C 6.956488132476807 1.0903466939926147 6.882812976837158 1.177338719367981 6.837912082672119 1.2891472578048706 C 6.58421516418457 1.9208793640136719 6.341506004333496 2.404733657836914 6.07287073135376 2.940274238586426 C 5.918106555938721 3.248805284500122 5.754737377166748 3.574491262435913 5.575704097747803 3.955491542816162 C 5.061811447143555 5.049105882644653 4.535672664642334 5.776885986328125 4.126760959625244 6.238108158111572 C 3.922494411468506 6.468505859375 3.748117446899414 6.631667137145996 3.6200857162475586 6.74022912979126 C 3.556094169616699 6.79448938369751 3.503753423690796 6.835048198699951 3.4651293754577637 6.863499641418457 C 3.445819616317749 6.8777241706848145 3.429945468902588 6.888916969299316 3.4177651405334473 6.897278785705566 L 3.4023003578186035 6.907721042633057 L 3.3967080116271973 6.91139554977417 L 3.3944578170776367 6.912854194641113 Z M 2.8511171340942383 6.0733442306518555 L 2.8499162197113037 6.074131488800049"
        ],
        "fill": {
          "r": 0.8509804010391235,
          "g": 0.8745098114013672,
          "b": 0.9843137264251709
        },
        "opacity": 1
      }
    ]
  },
  "dislike": {
    "size": 16,
    "shapes": [
      {
        "x": 2.0859375,
        "y": 1.763671875,
        "paths": [
          "M 8.491695404052734 8.235843658447266 C 8.508450984954834 8.369290828704834 8.525940895080566 8.521089553833008 8.542380332946777 8.68635082244873 C 8.615917205810547 9.4256010055542 8.673315048217773 10.479108810424805 8.528635025024414 11.363730430603027 C 8.456812381744385 11.802878379821777 8.327784538269043 12.250426292419434 8.08679485321045 12.599888801574707 C 7.830148220062256 12.972055435180664 7.44010591506958 13.23584270477295 6.914226531982422 13.23584270477295 C 6.397634506225586 13.23584270477295 6.083127975463867 12.866109848022461 5.890219688415527 12.544681549072266 C 5.697903156280518 12.224238395690918 5.529336452484131 11.789324760437012 5.35676908493042 11.344090461730957 L 5.343644142150879 11.31023120880127 C 4.796933174133301 9.900036811828613 4.0492777824401855 7.993404865264893 2.0372672080993652 6.652064323425293 C 1.7303335666656494 6.447441577911377 1.438858151435852 6.300185680389404 1.18394935131073 6.194481372833252 C 0.4873649477958679 5.905625820159912 -0.1381241474300623 5.137376070022583 0.02664472721517086 4.2579827308654785 L 0.25061991810798645 3.0625972747802734 C 0.39112389087677 2.3127087354660034 0.9460219144821167 1.7080799341201782 1.681125283241272 1.5038844347000122 L 6.631194591522217 0.1288651078939438 C 8.607429027557373 -0.42008884251117706 10.630013465881348 0.8402397632598877 11.008000373840332 2.8561699390411377 L 11.461554527282715 5.275122165679932 C 11.750029563903809 6.813656330108643 10.569719314575195 8.235843658447266 9.004374504089355 8.235843658447266 L 8.491695404052734 8.235843658447266 Z M 10.025128364562988 3.0404584407806396 C 9.75513744354248 1.6005076169967651 8.310433387756348 0.700273334980011 6.898838520050049 1.0923830270767212 L 1.948769211769104 2.467402219772339 C 1.581216812133789 2.5695000886917114 1.3037676811218262 2.8718154430389404 1.2335158586502075 3.2467589378356934 L 1.0095406770706177 4.442144393920898 C 0.9564164876937866 4.725674867630005 1.1706603169441223 5.1064019203186035 1.5669960975646973 5.270752429962158 C 1.8762859106063843 5.399007320404053 2.226044774055481 5.576065540313721 2.5919675827026367 5.820013999938965 C 4.8788580894470215 7.344608306884766 5.720539093017578 9.515816688537598 6.267937183380127 10.92789077758789 L 6.276027679443359 10.948760032653809 C 6.465575695037842 11.43768310546875 6.604733467102051 11.791951179504395 6.747652530670166 12.030085563659668 C 6.816810607910156 12.145318984985352 6.868447780609131 12.200701713562012 6.899249076843262 12.224940299987793 C 6.9073567390441895 12.23132038116455 6.9126811027526855 12.234468460083008 6.915297508239746 12.235841751098633 C 7.0571722984313965 12.23557186126709 7.160491943359375 12.181649208068848 7.263561725616455 12.032185554504395 C 7.382548809051514 11.859641075134277 7.479850769042969 11.580780982971191 7.541747570037842 11.202323913574219 C 7.664506912231445 10.451735496520996 7.6189045906066895 9.505244255065918 7.547292232513428 8.7853364944458 C 7.518904209136963 8.499959468841553 7.487199306488037 8.257268905639648 7.462681293487549 8.086492538452148 C 7.450432777404785 8.001178741455078 7.44000768661499 7.934016227722168 7.432730674743652 7.888676643371582 L 7.424352169036865 7.837553977966309 L 7.4222517013549805 7.825168132781982 L 7.421778678894043 7.822422504425049 C 7.396337032318115 7.676963806152344 7.4364190101623535 7.5272626876831055 7.531411170959473 7.41420316696167 C 7.582900524139404 7.352921009063721 7.647645473480225 7.3056745529174805 7.719664573669434 7.2752509117126465 C 7.7805269584059715 7.249540209770203 7.846584253013134 7.235843658447266 7.914226531982422 7.235843658447266 L 9.004374504089355 7.235843658447266 C 9.943580627441406 7.235843658447266 10.651766777038574 6.382531642913818 10.478682518005371 5.459411144256592 L 10.025128364562988 3.0404584407806396 Z"
        ],
        "fill": {
          "r": 0.8509804010391235,
          "g": 0.8745098114013672,
          "b": 0.9843137264251709
        },
        "opacity": 1
      }
    ]
  },
  "play": {
    "size": 24,
    "shapes": [
      {
        "x": 5,
        "y": 3.02069091796875,
        "paths": [
          "M 0 2.2531728744506836 C 0 0.5463168621063232 1.826087474822998 -0.5389934480190277 3.3253767490386963 0.27679625153541565 L 15.686956405639648 7.0029497146606445 C 17.253114700317383 7.855123519897461 17.25311851501465 10.103523254394531 15.686956405639648 10.955698013305664 L 3.325380563735962 17.68185043334961 C 1.826094627380371 18.497638702392578 0 17.412334442138672 0 15.705475807189941 L 0 2.2531728744506836 Z"
        ],
        "fill": {
          "r": 1,
          "g": 1,
          "b": 1
        },
        "opacity": 1
      }
    ]
  },
  "check": {
    "size": 28,
    "shapes": [
      {
        "x": 1.75,
        "y": 1.75,
        "paths": [
          "M 0 12.25 C 0 5.484511375427246 5.484511375427246 0 12.25 0 C 19.015487141079372 0 24.5 5.484511375427246 24.5 12.25 C 24.5 19.015487141079372 19.015487141079372 24.5 12.25 24.5 C 5.484511375427246 24.5 0 19.015487141079372 0 12.25 Z"
        ],
        "fill": {
          "r": 0.23529411852359772,
          "g": 0.3176470696926117,
          "b": 0.7058823704719543
        },
        "opacity": 1
      },
      {
        "x": 1.75,
        "y": 1.75,
        "paths": [
          "M 0 12.25 C 0 5.484511375427246 5.484511375427246 0 12.25 0 C 19.0154869556427 0 24.5 5.484511375427246 24.5 12.25 C 24.5 19.0154869556427 19.0154869556427 24.5 12.25 24.5 C 5.484511375427246 24.5 0 19.0154869556427 0 12.25 Z M 17.24371910095215 10.243718266487122 C 17.5854275226593 9.902009844779968 17.5854275226593 9.347990155220032 17.24371910095215 9.006281733512878 C 16.90200901031494 8.664572477340698 16.34799098968506 8.664572477340698 16.00628089904785 9.006281733512878 L 10.9375 14.075063467025757 L 8.493718266487122 11.631281733512878 C 8.152009844779968 11.289572477340698 7.597990155220032 11.289572477340698 7.256281733512878 11.631281733512878 C 6.914572894573212 11.972990155220032 6.914572894573212 12.527009844779968 7.256281733512878 12.868718266487122 L 10.318781733512878 15.931219100952148 C 10.660490155220032 16.2729275226593 11.214509844779968 16.2729275226593 11.556218266487122 15.931219100952148 L 17.24371910095215 10.243718266487122 Z"
        ],
        "fill": {
          "r": 1,
          "g": 1,
          "b": 1
        },
        "opacity": 1
      }
    ]
  }
} as const

const FONT = 'Roboto, system-ui, sans-serif'

export type AigcAspectRatio = '3:2' | '1:1' | '2:3'
export type MainImageStatus = 'Default' | 'hover'
export type HistoryImageKind = 'Multi' | 'Single' | 'Video' | 'Loading'
export type HistoryImageState = 'Default' | 'Selected'
export interface AigcImage { hash?: string; src?: string; alt?: string }

export const AIGC_LANDSCAPE_HASHES = [
  '78c3724e4f1be49e35f2f5b02bc334feb500041e',
  'bdaf4e94891b34d77a6aeb5f08d63a78410af701',
  '18d4c9b4598e5f3901f5ed68e1d32f76259427b0',
  'd2f3353cf4c0032723219b92034d4403bcc73d49',
] as const
export const AIGC_SQUARE_HASHES = [
  '3ff315905c14ee837c58ba797ffa6e2ba05337b0',
  '6c5a60f55eb5b7acd57eee2d424220e7f78a07b4',
  '081f9bcc235ae3a6e9acb77087ce8c966882e4eb',
  'c209fdaea75c9296b44d8ac78be6550b33bb8b99',
] as const
export const AIGC_PORTRAIT_HASH = 'a8b4a6117c783b42345ec0c4301e59f97f2230cd'
export const AIGC_HISTORY_SINGLE_HASH = 'df050a5665918fc3b41adb5faea69a791431dcc4'
export const AIGC_SOURCE_PROMPT = 'A cute bear with big sparkling eyes, sitting on a green meadow surrounded by flowers and sun rays. Bright colors, fairy-tale style, soft shadows'

/** Original exported vector paths, translated within their original 16/24/28px icon boxes. */
function SourceIcon({ name }: { name: keyof typeof SOURCE_ICONS }) {
  const icon = SOURCE_ICONS[name]
  return <svg width={icon.size} height={icon.size} viewBox={'0 0 ' + icon.size + ' ' + icon.size}
    fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
    {icon.shapes.map((shape, index) => <g key={index} transform={'translate(' + shape.x + ' ' + shape.y + ')'}
      fill={'rgb(' + [shape.fill.r, shape.fill.g, shape.fill.b].map(channel => Math.round(channel * 255)).join(',') + ')'}
      opacity={shape.opacity}>{shape.paths.map((data, pathIndex) => <path key={pathIndex} d={data} />)}</g>)}
  </svg>
}

function imageSource(image: AigcImage) { return image.src ?? (image.hash ? figmaImage(image.hash) : undefined) }

const MAIN_GEOMETRY: Record<AigcAspectRatio, { outerWidth: number; imageWidth: number; hash: string; blur: number }> = {
  '3:2': { outerWidth: 909, imageWidth: 909, hash: AIGC_LANDSCAPE_HASHES[0], blur: 0 },
  '1:1': { outerWidth: 982, imageWidth: 608, hash: AIGC_SQUARE_HASHES[0], blur: 90 },
  '2:3': { outerWidth: 982, imageWidth: 404, hash: AIGC_PORTRAIT_HASH, blur: 60 },
}

export interface MainImageAreaProps {
  /** Figma Property 1. */
  property1?: AigcAspectRatio
  /** Figma Status; hover also activates on pointer hover or keyboard focus. */
  status?: MainImageStatus
  imageHash?: string
  src?: string
  alt?: string
  width?: number | string
  prompt?: string
  mode?: string
  onSelect?: (src: string) => void
  onEditPrompt?: () => void
  onPromptChange?: (prompt: string) => void
  onFeedback?: (value: 'like' | 'dislike' | null) => void
}

export function MainImageArea({
  property1 = '3:2', status = 'Default', imageHash, src, alt = 'Generated image',
  width, prompt = AIGC_SOURCE_PROMPT, mode = 'Vivid storytelling',
  onSelect, onEditPrompt, onPromptChange, onFeedback,
}: MainImageAreaProps) {
  const geometry = MAIN_GEOMETRY[property1]
  const source = src ?? figmaImage(imageHash ?? geometry.hash)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(prompt)
  const [feedback, setFeedback] = React.useState<'like' | 'dislike' | null>(null)
  React.useEffect(() => { setDraft(prompt); setEditing(false) }, [prompt, property1, imageHash, src])
  const showDetails = status === 'hover' || hovered || focused || editing
  const selectFeedback = (value: 'like' | 'dislike') => {
    const next = feedback === value ? null : value
    setFeedback(next); onFeedback?.(next)
  }
  const foreground: React.CSSProperties = {
    position: 'relative', width: geometry.imageWidth / geometry.outerWidth * 100 + '%',
    height: '100%', objectFit: 'cover', display: 'block', flexShrink: 0,
  }
  const iconButton: React.CSSProperties = {
    width: 28, height: 28, padding: 0, border: 0, borderRadius: 4,
    display: 'grid', placeItems: 'center', color: '#d9dffb', background: '#232738',
    cursor: 'pointer', flexShrink: 0, outlineOffset: 3,
  }
  const badge: React.CSSProperties = {
    background: '#000', color: 'rgba(255,255,255,.8)', borderRadius: 8,
    padding: '2px 8px', fontSize: 13, lineHeight: '20px', whiteSpace: 'nowrap',
  }
  return <figure data-aigc-component="MainImageArea" data-figma-node="461:31862"
    data-aspect-ratio={property1} data-status={showDetails ? 'hover' : 'Default'}
    tabIndex={0} aria-label="Generated image and prompt"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
    style={{ margin: 0, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center',
      width: width ?? geometry.outerWidth, maxWidth: '100%', aspectRatio: geometry.outerWidth + ' / 608',
      fontFamily: FONT, background: 'rgba(0,0,0,.03)', outlineOffset: 3, isolation: 'isolate' }}>
    {geometry.blur > 0 && <div aria-hidden="true" style={{
      position: 'absolute', width: 1091 / geometry.outerWidth * 100 + '%', height: 745 / 608 * 100 + '%',
      left: -55 / geometry.outerWidth * 100 + '%', top: -68.5 / 608 * 100 + '%',
      filter: 'blur(' + geometry.blur + 'px)', backgroundImage: 'linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1)),url(' + JSON.stringify(source) + ')',
      backgroundSize: 'cover', backgroundPosition: 'center',
    }} />}
    {onSelect
      ? <button type="button" aria-label="Open generated image" onClick={() => onSelect(source)}
          style={{ ...foreground, background: 'transparent', padding: 0, border: 0, cursor: 'pointer' }}>
          <img src={source} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </button>
      : <img src={source} alt={alt} style={foreground} />}
    {showDetails && <figcaption style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 108, boxSizing: 'border-box',
      padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, color: '#fff',
      background: 'linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 49.3013%)',
    }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={badge}>Mode: {mode}</span><span style={badge}>{property1}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        {editing ? <textarea aria-label="Edit image prompt" value={draft} autoFocus
          onChange={event => setDraft(event.target.value)} onBlur={() => { setEditing(false); onPromptChange?.(draft) }}
          style={{ flex: 1, minWidth: 0, height: 44, boxSizing: 'border-box', resize: 'vertical', color: '#fff',
            background: 'rgba(0,0,0,.45)', border: '1px solid rgba(255,255,255,.5)', font: '14px/22px ' + FONT }} />
          : <div style={{ flex: 1, minWidth: 0, fontSize: 14, lineHeight: '22px', overflowWrap: 'anywhere' }}>
              {draft}<button type="button" aria-label="Edit prompt" onClick={() => {
                if (onEditPrompt) onEditPrompt(); else setEditing(true)
              }} style={{ display: 'inline-grid', placeItems: 'center', width: 24, height: 22,
                border: 0, padding: 0, background: 'transparent', verticalAlign: 'middle', cursor: 'pointer', outlineOffset: 2 }}>
                <SourceIcon name="edit" />
              </button>
            </div>}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button type="button" aria-label="Like image" aria-pressed={feedback === 'like'} onClick={() => selectFeedback('like')}
            style={{ ...iconButton, boxShadow: feedback === 'like' ? 'inset 0 0 0 1px #d9dffb' : undefined }}><SourceIcon name="like" /></button>
          <button type="button" aria-label="Dislike image" aria-pressed={feedback === 'dislike'} onClick={() => selectFeedback('dislike')}
            style={{ ...iconButton, boxShadow: feedback === 'dislike' ? 'inset 0 0 0 1px #d9dffb' : undefined }}><SourceIcon name="dislike" /></button>
        </div>
      </div>
    </figcaption>}
  </figure>
}

export interface ImageDisplayListProps {
  /** Figma Property 1. */
  property1?: '3:2' | '1:1'
  images?: readonly AigcImage[]
  selectedIndex?: number
  defaultSelectedIndex?: number
  width?: number | string
  height?: number | string
  onSelect?: (index: number, image: AigcImage) => void
}

export function ImageDisplayList({
  property1 = '3:2', images, selectedIndex, defaultSelectedIndex = 0,
  width, height = 608, onSelect,
}: ImageDisplayListProps) {
  const items: readonly AigcImage[] = images ?? (property1 === '1:1' ? AIGC_SQUARE_HASHES : AIGC_LANDSCAPE_HASHES).map(hash => ({ hash }))
  const [active, setActive] = React.useState(defaultSelectedIndex)
  const buttons = React.useRef<Array<HTMLButtonElement | null>>([])
  React.useEffect(() => setActive(defaultSelectedIndex), [defaultSelectedIndex, property1])
  const selected = selectedIndex ?? active
  const choose = (index: number) => { setActive(index); onSelect?.(index, items[index]) }
  return <div role="group" aria-label="Generated image thumbnails" data-aigc-component="ImageDisplayList"
    data-figma-node="470:34378" data-aspect-ratio={property1}
    style={{ display: 'grid', gridTemplateRows: 'repeat(' + Math.max(1, items.length) + ',minmax(0,1fr))',
      gap: 2, width: width ?? (property1 === '1:1' ? 150 : 223), height, maxWidth: '100%', flexShrink: 0 }}>
    {items.map((item, index) => <button key={index} ref={element => { buttons.current[index] = element }}
      type="button" aria-label={'Select generated image ' + (index + 1)} aria-pressed={selected === index}
      onClick={() => choose(index)} onKeyDown={event => {
        let next: number | undefined
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % items.length
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = items.length - 1
        if (next !== undefined) { event.preventDefault(); choose(next); buttons.current[next]?.focus() }
      }} style={{ width: '100%', minHeight: 0, padding: 0, border: 0, borderRadius: 0, position: 'relative',
        overflow: 'hidden', display: 'block', background: '#fff', cursor: 'pointer', outlineOffset: 2 }}>
      <img src={imageSource(item)} alt={item.alt ?? 'Generated image ' + (index + 1)}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
      {selected === index && <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.3)',
      }}><SourceIcon name="check" /></span>}
    </button>)}
  </div>
}

export interface HistoryPanelImagesProps {
  /** Figma Property 1. This component is the single HistoryRail tile, not the whole rail. */
  property1?: HistoryImageKind
  /** Figma Property 2. */
  property2?: HistoryImageState
  images?: readonly AigcImage[]
  selected?: boolean
  label?: string
  onSelect?: () => void
}

export function HistoryPanelImages({
  property1 = 'Multi', property2 = 'Default', images, selected, label, onSelect,
}: HistoryPanelImagesProps) {
  const [picked, setPicked] = React.useState(false)
  React.useEffect(() => setPicked(false), [property1, property2])
  const isSelected = selected ?? (property2 === 'Selected' || picked)
  const items: readonly AigcImage[] = images ?? (property1 === 'Multi' ? AIGC_LANDSCAPE_HASHES : [AIGC_HISTORY_SINGLE_HASH]).map(hash => ({ hash }))
  const loading = property1 === 'Loading'
  return <button type="button" data-aigc-component="HistoryPanelImages" data-figma-node="437:83640"
    data-kind={property1} aria-label={label ?? (loading ? 'Creation in progress' : property1 === 'Video' ? 'Select video creation' : 'Select image creation')}
    aria-pressed={isSelected} aria-busy={loading}
    onClick={() => { setPicked(true); onSelect?.() }}
    style={{
      width: 54, height: 54, boxSizing: 'border-box', flexShrink: 0, border: 0, borderRadius: 8, padding: 4,
      display: 'block', position: 'relative', cursor: 'pointer', outlineOffset: 3,
      background: isSelected ? 'transparent' : '#fff',
      // Canonical selected paint is gray 1.2528px, despite stale prose claiming 2px blue.
      boxShadow: isSelected ? 'inset 0 0 0 1.2528px #515151' : 'inset 0 0 0 1px rgba(0,0,0,.1)',
    }}>
    <span style={{ display: property1 === 'Multi' ? 'grid' : 'block', position: 'relative',
      width: 46, height: 46, borderRadius: 4, overflow: 'hidden', gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
      gridTemplateRows: 'repeat(2,minmax(0,1fr))', columnGap: 2.142857, rowGap: 2,
      background: loading ? '#f8f4f1' : '#fff' }}>
      {!loading && (property1 === 'Multi' ? items.slice(0, 4) : items.slice(0, 1)).map((item, index) =>
        <img key={index} src={imageSource(item)} alt={item.alt ?? ''} style={{
          display: 'block', width: '100%', height: '100%', minWidth: 0, minHeight: 0, objectFit: 'cover',
        }} />)}
      {property1 === 'Video' && <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <SourceIcon name="play" />
      </span>}
    </span>
  </button>
}
