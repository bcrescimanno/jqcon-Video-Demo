/** 
 * jQueryUI-Video 1.0
 * Copyright 2010 Brian Crescimanno <brian.crescimanno@gmail.com>
 * Distributed under the MIT License
 * http://www.opensource.org/licenses/mit-license.html
 */

$.widget("ui.video", {
	options : {
		height: null,
		width: null,
		controlsHeight: 60,
		controlsHorizontalInset : 30,
		controlsVerticalInset : 20,
		buttonInset: 10,
		controlsDuration: 3000
	},
	
	EL_STRING : "<div></div>",
	
	Alignment : {
		TOP: "top",
		CENTER: "center",
		BOTTOM: "bottom",
		LEFT: "left",
		RIGHT: "right"
	},
	
	_create : function() {
		if(!this.element) return null;
		this.buttons = {};
		
		this._getDimensions();
		this.buttonSize = this._calculateButtonSize();
		this._renderControls();
		this.video = this.element[0];
		this._addEventListeners();
		this.playing = false;
		this.wasPlaying = true;
	},
	
	_getDimensions : function() {
		var dims = ["height", "width"],
			numDims = dims.length;
			
		for(var i = 0 ; i < numDims ; i++) {
			var dimension = dims[i];
			if(!this.options[dimension]) {
				this.options[dimension] = this.element[dimension]();
			} else {
				this.element.attr(dimension, this.options[dimension]);
			}
		}
	},
	
	_calculateButtonSize : function() {
		return this.options.controlsHeight - (this.options.buttonInset * 2);
	},
	
	_renderControls : function() {
		this._renderControlBar();
		this._addPlayButton();
		this._addPlayhead();
		this._addFullScreen();
	},
	
	_renderControlBar : function() {
		this.controlBar = $(this.EL_STRING, {
			"class" : "ui-widget ui-widget-content ui-corner-all",
			css : {
				height: this.options.controlsHeight + "px",
				width: this.options.width - this.options.controlsHorizontalInset + "px",
			}
		})
		.insertAfter(this.element)
		.position({
			my: this.Alignment.CENTER + " " + this.Alignment.BOTTOM,
			at: this.Alignment.CENTER + " " + this.Alignment.BOTTOM,
			of: this.element,
			offset: "0 " + -this.options.controlsVerticalInset
		});
	},
	
	_addPlayButton : function() {
		this.buttons["play"] = $(this.EL_STRING)
			.css({
				height: this.buttonSize + "px",
				width: this.buttonSize + "px"
			})
			.appendTo(this.controlBar)
			.button({
				icons: {
					primary: "ui-icon-play"
				},
				text: false
			})
			.position({
				my: this.Alignment.LEFT,
				at: this.Alignment.LEFT,
				of: this.controlBar,
				offset: this.options.buttonInset + " 0"
			});
	},
	
	_addPlayhead : function() {
		this.playhead = {};
		
		var containerWidth = this.controlBar.width() - (this.options.buttonInset * 4) - (this.buttonSize * 2);
		var containerLeftOffset = this.buttonSize + (this.options.buttonInset * 2);
		
		this.playhead.container = $(this.EL_STRING, { "class" : "ui-state-default ui-button ui-corner-all" })
							.css({
								width: containerWidth + "px",
								height: this.buttonSize + "px",
							})
							.appendTo(this.controlBar)
							.position({
								my: this.Alignment.LEFT,
								at: this.Alignment.LEFT, 
								of: this.controlBar,
								offset: containerLeftOffset + " 0"
							});
							
		this.playhead.slider = $(this.EL_STRING)
			.css({
				width: this.playhead.container.width() - (this.options.buttonInset * 2) + "px",
				height: "10px"
			})
			.progressbar({value: 50})
			.slider({
				range: "min"
			})
			.appendTo(this.playhead.container)
			.position({
				my: this.Alignment.LEFT  + " " + this.Alignment.CENTER,
				at: this.Alignment.LEFT + " " + this.Alignment.CENTER,
				of: this.playhead.container,
				offset: this.options.buttonInset + " 0"
			});
	},
	
	
	_addFullScreen : function() {
		this.buttons["fullscreen"] = $(this.EL_STRING)
			.css({
				height: this.buttonSize + "px",
				width: this.buttonSize + "px"
			})
			.appendTo(this.controlBar)
			.button({
				icons: {
					primary: "ui-icon-plusthick"
				},
				text: false
			})
			.position({
				my: this.Alignment.RIGHT,
				at: this.Alignment.RIGHT, 
				of: this.controlBar,
				offset: -this.options.buttonInset + " 0"
			});
	},
	
	_resetControlsHideTimeout : function() {
		if(this.controlsTimeout) {
			clearTimeout(this.controlsTimeout);
		}
		
		if(!this.video.paused) {
			this.controlsTimeout = setTimeout($.proxy(this._hideControls, this), this.options.controlsDuration);
		}
	},
	
	_addEventListeners : function() {
	},
			
});