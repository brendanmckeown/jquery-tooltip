/**
 * jquery.tooltip.js
 * https://github.com/brendanmckeown/jquery-tooltip
 */

/**
 * Usage Example:

	<!DOCTYPE html>
	<html>
		<head>
			<title>jQuery Tooltip Plugin</title>
			<link rel="stylesheet" href="jquery.tooltip.css" type="text/css">
		</head>
		<body>
			<div class="tooltip">
				<button class="tooltip-button" data-tooltip-id="tooltip-content-id">Click</button>
				<div class="tooltip-content" id="tooltip-content-id">
					Fusce tincidunt lacus libero, sit amet malesuada turpis posuere vel.
				</div>
			</div>
			<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
			<script src="jquery.tooltip.js"></script>
			<script type="text/javascript">
				$(function(){
					$('.tooltip-button').tooltip();
				});
			</script>
		</body>
	</html>

 */

/* global jQuery */

var Tooltip;

(function($){
'use strict';

	Tooltip = function(options, el){

		this.$el = $(el);

		// merge specified options and element data attributes with default settings
		this.settings = $.extend({
			tooltipAnimation: 'fade', // 'fade' or 'slide'
			tooltipActiveClass: 'active', // added to button while content is shown
			tooltipShowEvent: 'click', // button event to show content - 'click' or 'mouseover'
			tooltipId: '', // id of content container element
			tooltipAutoHide: true, // false to keep content open unless button is clicked again
			tooltipSpeedIn: 400, // duration of show animation (in milliseconds)
			tooltipSpeedOut: 200, // duration of hide animation (in milliseconds)
			tooltipDelayShow: 500, // delay after button mouseover to show content (in milliseconds)
			tooltipDelayHide: 1400, // delay after button mouseout to hide content (in milliseconds)
			closeButton: false,
			closeButtonClass: 'tooltip-close-button',
			closeButtonText: 'x'
		}, options, this.$el.data());

		this.$content = $('#' + this.settings.tooltipId);

		if (!this.$content.length) {
			return false;
		}

		if (this.settings.closeButton) {
			this.$closeButton = $("<button type='button'></button>").text(this.settings.closeButtonText)
				.addClass(this.settings.closeButtonClass)
				.prependTo(this.$content);
		}

		this.ready = true;
		this.openTimer = null;
		this.closeTimer = null;

		// event bindings
		this.$el.on(this.settings.tooltipShowEvent, $.proxy(tooltipInteraction, this));
		if (this.settings.tooltipAutoHide) {
			this.$el.on('mouseout.tooltip', $.proxy(tooltipMouseout, this));
			this.$content.on('mouseover.tooltip mouseout.tooltip', $.proxy(contentMouseEvent, this));
		}

		return this;
	};

	Tooltip.prototype = {

		show: function() {
			if (!this.ready) return;
			this.ready = false;
			var settings = this.settings,
				showAnimationFn = (settings.tooltipAnimation === 'slide') ? 'slideDown' : 'fadeIn';
			this.openTimer = null;
			this.$content[showAnimationFn](settings.tooltipSpeedIn, $.proxy(function(){
				this.ready = true;
			}, this));
			this.$el.addClass(settings.tooltipActiveClass);
			this.active = true;
			$('body').on('click.tooltip', $.proxy(bodyClick, this));
		},

		hide: function() {
			if (!this.ready) return;
			this.ready = false;
			var settings = this.settings,
				hideAnimationFn = (settings.tooltipAnimation === 'slide') ? 'slideUp' : 'fadeOut';
			this.closeTimer = null;
			this.$content[hideAnimationFn](settings.tooltipSpeedOut, $.proxy(function(){
				this.ready = true;
			}, this));
			this.$el.removeClass(settings.tooltipActiveClass);
			this.active = false;
			$('body').off('click.tooltip');
		}
	};

	function tooltipInteraction(event) {
		event.preventDefault();
		event.stopPropagation();
		switch (event.type) {
			case 'click':
				if (this.active) {
					this.hide();
				} else {
					this.show();
				}
				break;
			case 'mouseover':
				if (this.active) {
					// clear close timer
					setCloseTimer.call(this, event.type);
				} else {
					// set open timer
					this.openTimer = setTimeout($.proxy(function(){
						this.show();
					}, this), this.settings.tooltipDelayShow);
				}
				break;
			default:
		}
	}

	function bodyClick(event) {
		if (event.target !== this.$el.get(0)
			&& event.target !== this.$content.get(0)) {
				clearTimeout(this.closeTimer);
				this.hide();
		}
	}

	function tooltipMouseout(event){
		event.stopPropagation();
		if (this.openTimer) {
			clearTimeout(this.openTimer);
			this.ready = true;
		}
		setCloseTimer.call(this, event.type);
	}

	function contentMouseEvent(event){
		event.stopPropagation();
		setCloseTimer.call(this, event.type);
	}

	function setCloseTimer(eventType) {
		if (eventType === 'mouseover' && this.closeTimer) {
			clearTimeout(this.closeTimer);
		} else if (this.active) {
			this.closeTimer = setTimeout($.proxy(function(){
				this.hide();
			}, this), this.settings.tooltipDelayHide);
		}
	}

	$.fn.tooltip = function(options) {
		return this.each(function(){
			new Tooltip(options, this);
		});
	};

})(jQuery);
