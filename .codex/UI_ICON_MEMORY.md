# UI icon memory

Use the supplied assets in `public/tmp-icons` for dashboard UI controls. Do not substitute Unicode glyphs such as `+`, `◉`, `▶`, `⋮`, `×`, or text-only action buttons when a matching asset exists.

Relevant mappings:

- create/add: `add-plus.svg`
- blur/obfuscation: `obfuscation.svg`
- play/start: `circle-play.svg` or `play.svg`
- overflow/menu: `overflow-ellipsis.svg`
- edit: `pencil.svg`
- archive: `archive.svg`
- delete: `trash.svg`
- close: `close-x.svg`
- save: `save.svg`

Every icon-only button must retain an accessible `aria-label`, and icon images should use empty alt text when the label is on the button.
