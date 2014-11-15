# jQuery Tooltip Plugin #

A lightweight jQuery tooltip plugin.

## Options ##

All options can be set either on initialization, or by data attribute (e.g. `data-tooltip-show-event`).

- `tooltipAnimation` - (string) animation function, default: "fade", other values: "slide"
- `tooltipActiveClass` - (string) class added to button when content is visible, default: "active"
- `tooltipShowEvent` - (string) type of button event to trigger content visibility, default: "click", other values: "mouseover"
- `tooltipAutoHide` - (boolean) toggle for hiding content automatically on mouseout, default: true
- `tooltipSpeedIn` - (integer) animation duration for showing content, default: 500 (milliseconds)
- `tooltipSpeedOut` - (integer) animation duration for hiding content, default: 300 (milliseconds)
- `tooltipDelayShow` - (integer) delay after button event to show content, default: 500 (milliseconds)
- `tooltipDelayHide` - (integer) delay after mouseout to hide content, default: 2000 (milliseconds)

## Methods ##

- `showContent`
- `hideContent`

## Support ##

Tested and compatible with the following browsers:

- Firefox 34
- Chrome 38
- Safari 7
- IE 8-11