# One-click deployment ZIP — recovered requirements

Checked against the user's earlier conversation on 2026-10-29.

## Explicit user requirements

2026-09-23:

> 我是想把前面那个压缩包上传到一个平台上可以一键部署，大致上来说应该是根目录下应该有一个html，这样才能在部署后看到我们本地浏览的那个页面效果，请你帮我重新搞一个压缩包，能满足我的这个需求

2026-10-21:

> 你的一件部署包部署完以后看不到其中两个，请你检查一下，你可以加一个首次打开的综合性的首页，上面添加上一些高级的类似瀑布流的组件动态展示效果，然后用户点击三个library中的一个去到每一个子页面

> 部署完了，切去其他library还是报错

After the deployment diagnosis:

> 按你的最优先级的推测改一个部署包出来

## Established packaging implementation

The subsequent compatibility release uses a completely flat ZIP: index.html,
the three library entries, bundled classic JavaScript, CSS, fonts, images and
icons are all at its root. Names are prefixed to avoid collisions. There is no
enclosing folder, iframe, base element, ES-module entry, or required build step
on the hosting platform. Upload the whole archive without mixing releases.

These implementation choices followed the reported VibeHub failures; the
original user wording did not individually prescribe each technical choice.
Preserve the current homepage and all three libraries' preview/edit/export
capabilities, and test the extracted archive at root and nested URL prefixes
under constrained static hosting. Do not equate local compatibility checks with
verification of the user's authenticated VibeHub deployment.

Source conversation: 01a0c9ee-76ca-7002-96d3-28609d4561ab.
Original user-message records: September 23 rollout, line 2742; October 19
continuation rollout ending 01a15371-aa9d-7f03-bc90-d44e0f576b6c, lines 995,
1832 and 1993. The continued rollout's message timestamps are October 21.
Implementation evidence: COMPAT-DEPLOYMENT.md and scripts/package-compat.mjs.
