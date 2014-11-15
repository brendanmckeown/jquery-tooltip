/**
 * jquery.tooltip.js
 * https://github.com/brendanmckeown/jquery-tooltip
 */

(function($){
'use strict';

var dataKey = 'tooltip';
var ready = true;
var openTimer = null;
var closeTimer = null;

var methods = {

	init: function(options) {
		// merge user options with default settings
		var settings = $.extend({
			tooltipAnimation: 'fade', // 'fade' or 'slide'
			tooltipActiveClass: 'active', // added to button while content is shown
			tooltipShowEvent: 'click', // button event to show content - 'click' or 'mouseover'
			tooltipAutoHide: true, // false to keep content open unless button is clicked again
			tooltipSpeedIn: 500, // duration of show animation (in milliseconds)
			tooltipSpeedOut: 300, // duration of hide animation (in milliseconds)
			tooltipDelayShow: 500, // delay after button mouseover to show content (in milliseconds)
			tooltipDelayHide: 2000 // delay after button mouseout to hide content (in milliseconds)
		}, options);

		return this.each(function(){
			var button = this,
				$button = $(this),
				contentId = $button.data('tooltip-id'),
				$content = $('#' + contentId);
			// check for existance of content element
			if (contentId && $content.length) {
				var data = {
					$content: $content
				};
				// get options set by data attributes
				var dataAttrs = $button.data();
				for (var property in dataAttrs) {
					if (dataAttrs.hasOwnProperty(property)) {
						if (settings.hasOwnProperty(property)) {
							settings[property] = dataAttrs[property];
						}
					}
				}
				// save reference to button on content
				$content.data('tooltip-button', $button);
				// save settings in button data
				$button.data(dataKey, $.extend(data, settings));
				// event bindings
				$button.on(settings.tooltipShowEvent, buttonInteraction);
				if (settings.tooltipAutoHide) {
					$button.on('mouseout.tooltip', buttonMouseout);
					$content.on('mouseover.tooltip mouseout.tooltip', contentMouseEvent);
				}
			}
		});
	},

	showContent: function() {
		if (!ready) return;
		ready = false;
		var $button = $(this),
			data = $button.data(dataKey),
			$content = data.$content,
			showAnimationFn = (data.tooltipAnimation === 'slide') ? 'slideDown' : 'fadeIn';
		openTimer = null;
		// show tooltip content
		$content[showAnimationFn](data.tooltipSpeedIn, function(){
			ready = true;
		});
		// add active class to tooltip button
		$button.addClass(data.tooltipActiveClass);
		// update tooltip data
		data.active = true;
		$button.data(dataKey, data);
	},

	hideContent: function() {
		if (!ready) return;
		ready = false;
		var $button = $(this),
			data = $button.data(dataKey),
			$content = data.$content,
			hideAnimationFn = (data.tooltipAnimation === 'slide') ? 'slideUp' : 'fadeOut';
		closeTimer = null;
		// hide tooltip content
		$content[hideAnimationFn](data.tooltipSpeedOut, function(){
			ready = true;
		});
		// remove active class from tooltip button
		$button.removeClass(data.tooltipActiveClass);
		// update tooltip data
		data.active = false;
		$button.data(dataKey, data);
	}

};

function buttonInteraction(event) {
	event.preventDefault();
	event.stopPropagation();
	var button = this;
	var data = $(button).data(dataKey);
	switch (event.type) {
		case 'click':
			if (data.active) {
				methods.hideContent.call(button);
			} else {
				methods.showContent.call(button);
			}
			break;
		case 'mouseover':
			if (data.active) {
				// clear close timer
				setCloseTimer(event.type);
			} else {
				// set open timer
				openTimer = setTimeout(function(){
					methods.showContent.call(button);
				}, data.tooltipDelayShow);
			}
			break;
		default:
	}
}

function buttonMouseout(event){
	event.stopPropagation();
	if (openTimer) {
		clearTimeout(openTimer);
		ready = true;
	}
	setCloseTimer.call(this, event.type);
}

function contentMouseEvent(event){
	event.stopPropagation();
	var button = $(this).data('tooltip-button');
	setCloseTimer.call(button, event.type);
}

function setCloseTimer(eventType) {
	var button = this,
		data = $(button).data(dataKey);
	if (eventType === 'mouseover' && closeTimer) {
		clearTimeout(closeTimer);
	} else if (data.active) {
		closeTimer = setTimeout(function(){
			methods.hideContent.call(button);
		}, data.tooltipDelayHide);
	}
}

$.fn.tooltip = function(method) {
	if (methods[method]) {
		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else if (typeof method === 'object' || ! method) {
		return methods.init.apply(this, arguments);
	} else {
		$.error( 'Method ' +  method + ' does not exist.' );
	}
};

})(jQuery);
