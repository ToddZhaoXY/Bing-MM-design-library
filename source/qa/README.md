# Viewport fixture

`viewport.html` is a development-only 390px nested browsing-context fixture for
checking responsive CSS when the browser integration does not resize its real
viewport. It points to the refined preview at `127.0.0.1:5193`.

It is not a mobile-device test and is not copied into the production `dist/`.
The visual and interaction verification boundaries are documented in
`../VERIFICATION.md`.
