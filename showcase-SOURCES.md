# Homepage showcase sources

The homepage is a decorative component-preview montage, not a live generation
or playback service. Top-right navigation leads to the original libraries. Local source
artwork was resized with macOS `sips` (JPEG quality 82); originals were not changed.

| Output | Original source in this project | Role |
| --- | --- | --- |
| image-tile.jpg | projects/mm-image/site/public/figma/img/photo-landscape.png | Image Tile |
| image-related.jpg | projects/mm-image/site/public/figma/img/qs-thumb-2.png | RS Card / RS Pill |
| aigc-meadow.jpg | projects/aigc/site/public/figma/optimized-images/78c3724e4f1be49e35f2f5b02bc334feb500041e.webp | Main image area artwork |
| aigc-surf.jpg | projects/aigc/site/public/figma/optimized-images/3ff315905c14ee837c58ba797ffa6e2ba05337b0.webp | Image display list artwork |
| aigc-portrait.jpg | projects/aigc/site/public/figma/optimized-images/987c2e2bd733ab4a428f433683eb25b538717362.webp | Display image artwork |
| video-lake.jpg | projects/video/site/public/figma/molecules/88585.webp | Short Card source thumbnail |

Preview layouts are simplified for the homepage. The underlying component
implementations and their source dimensions remain inside the three libraries.
The video thumbnail uses a source-supported portrait crop; its badge is the
original source placeholder `99:99`, not a claim about a real video's duration.
