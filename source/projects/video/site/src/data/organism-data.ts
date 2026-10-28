export const MAINLINE_CONFIGURATIONS = ["Desktop Generics","Desktop Hero folded","Desktop Hero expanded","Desktop Hero + Shorts","Mobile Generics","Mobile Hero"] as const
export type MainlineConfiguration = typeof MAINLINE_CONFIGURATIONS[number]
export const MAINLINE_SOURCE = {
  "Desktop Generics": {
    "nodeId": "2136:96919",
    "width": 1520,
    "height": 1200,
    "mobile": false,
    "hero": false,
    "folded": false,
    "shorts": false,
    "cards": [
      {
        "width": 690,
        "height": 130.6666717529297,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.66665649414062,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.66665649414062,
        "metadataPosition": "Inline"
      }
    ],
    "titleY": 209,
    "cardY": 305
  },
  "Desktop Hero folded": {
    "nodeId": "2136:98255",
    "width": 1520,
    "height": 1200,
    "mobile": false,
    "hero": true,
    "folded": true,
    "shorts": false,
    "cards": [
      {
        "width": 690,
        "height": 200,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.6666717529297,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.66665649414062,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.66665649414062,
        "metadataPosition": "Inline"
      }
    ],
    "titleY": 209,
    "cardY": 305
  },
  "Desktop Hero expanded": {
    "nodeId": "2136:100440",
    "width": 1520,
    "height": 1200,
    "mobile": false,
    "hero": true,
    "folded": false,
    "shorts": false,
    "cards": [
      {
        "width": 690,
        "height": 200,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.6666717529297,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.66665649414062,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.66665649414062,
        "metadataPosition": "Inline"
      }
    ],
    "titleY": 209,
    "cardY": 305
  },
  "Desktop Hero + Shorts": {
    "nodeId": "2136:101832",
    "width": 1520,
    "height": 1459,
    "mobile": false,
    "hero": true,
    "folded": false,
    "shorts": true,
    "cards": [
      {
        "width": 690,
        "height": 200,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.6666717529297,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.66665649414062,
        "metadataPosition": "Inline"
      },
      {
        "width": 690,
        "height": 130.66665649414062,
        "metadataPosition": "Inline"
      }
    ],
    "titleY": 209,
    "cardY": 305
  },
  "Mobile Generics": {
    "nodeId": "2223:58196",
    "width": 322,
    "height": 1247,
    "mobile": true,
    "hero": false,
    "folded": false,
    "shorts": false,
    "cards": [
      {
        "width": 290,
        "height": 92,
        "metadataPosition": "Inline"
      },
      {
        "width": 290,
        "height": 92,
        "metadataPosition": "Inline"
      },
      {
        "width": 290,
        "height": 92,
        "metadataPosition": "Inline"
      }
    ],
    "titleY": 177,
    "cardY": 215
  },
  "Mobile Hero": {
    "nodeId": "2223:58732",
    "width": 322,
    "height": 1327,
    "mobile": true,
    "hero": true,
    "folded": false,
    "shorts": false,
    "cards": [
      {
        "width": 290,
        "height": 163.1300048828125,
        "metadataPosition": "Overlay"
      },
      {
        "width": 290,
        "height": 92,
        "metadataPosition": "Inline"
      },
      {
        "width": 290,
        "height": 92,
        "metadataPosition": "Inline"
      },
      {
        "width": 290,
        "height": 92,
        "metadataPosition": "Inline"
      }
    ],
    "titleY": 177,
    "cardY": 215
  }
} as const
export const SOURCE_TITLE = 'Clickable text title'
export const SOURCE_QUERY = 'search'
export const VIDEO_TABS = ['Overview', 'Movie', 'Awards', 'TV shows', 'Books'] as const
export const SOURCE_HELPER_COPY = 'Use `direction` to adjust `row` or `column` stacking, then drag your body design into this basic component body (slots). Please feel free to remove this helper text when done.'
export const SOURCE_SNIPPET = 'Snippet lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ipsum nostrud exercitation ullamco laboris sed do eiusmod t...'
export const MAGAZINE_SUGGESTIONS = ['Upcoming Tom Hanks films', 'Tom Hanks Early Career Roles', 'Tom Hanks Early Life Facts'] as const
export const SOURCE_OPEN_QUESTION = 0
export const SOURCE_QUESTIONS = Array.from({ length: 5 }, () => ({ title: 'Accordion header', body: SOURCE_HELPER_COPY }))
export function mainlineScene(configuration: MainlineConfiguration = 'Desktop Generics') { return MAINLINE_SOURCE[configuration] ?? MAINLINE_SOURCE['Desktop Generics'] }
export function shortScene(viewport: 'Desktop' | 'Mobile' = 'Desktop', wide = false) {
  const mobile = viewport === 'Mobile'
  return { mobile, width: mobile ? 322 : 1520, height: mobile ? (wide ? 1269 : 1259) : 1200, contentWidth: mobile ? 290 : wide ? 1200 : 690, nodeId: mobile ? (wide ? '2223:81592' : '2223:60470') : wide ? '2223:81498' : '2223:59764', count: mobile ? 5 : wide ? 7 : 6, cardWidth: mobile ? 160 : 158.6666717529297, thumbnailHeight: 238 }
}
