/** 
 * jQueryUI Video Player Demonstration
 * Copyright 2010 Brian Crescimanno <brian.crescimanno@gmail.com>
 * Distributed under the MIT License
 * http://www.opensource.org/licenses/mit-license.html
 */

$.widget("jquidemo.video", {
	options : {
		height: null,
		width: null,
		controlsHeight: 60,
		controlsHorizontalInset : 30,
		controlsVerticalInset : 20,
		buttonInset: 10,
		controlsDuration: 5000
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
		this.controlBar.hide();
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
			.progressbar()
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
		this.element
			.bind("play", $.proxy(this._playHandler, this))
			.bind("pause", $.proxy(this._pauseHandler, this))
			.bind("timeupdate", $.proxy(this._timeupdateHandler, this))
			.bind("durationchange", $.proxy(this._durationchangeHandler, this))
			.bind("ended", $.proxy(this._showControls, this));
		
		this.element.parent()
			.bind("mouseenter", $.proxy(this._showControls, this))
			.bind("mouseleave", $.proxy(this._hideControls, this))
			.bind("touchend", $.proxy(this._showControls, this));
			
		this.buttons["fullscreen"]
			.bind("click", $.proxy(this._fullScreen, this));
			
		this.playhead.slider
			.bind("slidechange", $.proxy(this._slidechangeHandler, this))
			.bind("slidestart", $.proxy(this._slidestartHandler, this))
			.bind("slidestop", $.proxy(this._slidestopHandler, this));
			
		this.buttons["play"]
			.bind("click", $.proxy(this._playButtonHandler, this));
	},
			
	_playHandler : function(e) {
		this.element.removeAttr("controls");
		this.buttons.play.button("option", "icons", {primary: "ui-icon-pause"});
		this.playing = true;
		this._resetControlsHideTimeout();
		if(!this.hasStarted) {
			this._showControls();
			this.hasStarted = true;
		}
	},
	
	_pauseHandler : function(e) {
		this.buttons.play.button("option", "icons", {primary: "ui-icon-play"});
		this.playing = false;
		this._resetControlsHideTimeout();
	},
	
	_timeupdateHandler : function(e) {
		this.playhead.slider.slider("option", "value", this.video.currentTime);
	},
	
	_durationchangeHandler : function(e) {
		this.playhead.slider.slider("option", "min", 0);
		this.playhead.slider.slider("option", "max", this.video.duration);
		this._getBuffered();
	},
	
	_getBuffered : function() {
		var bufferedPercent = Math.ceil(((this.video.buffered.end(0) / this.video.duration) * 100));
		this.playhead.slider.progressbar("option", "value", bufferedPercent);
		if(bufferedPercent < 100) {
			setTimeout($.proxy(this._getBuffered, this), 250);
		}
	},
	
	_showControls : function() {
		if(this.controlBar.css("display") == "none") {
			this.controlBar.show("drop", {direction: "down"})
		}
		this._resetControlsHideTimeout();
	},
	
	_hideControls : function() {
		if(this.controlBar.css("display") != "none") {
			this.controlBar.hide("drop", {direction: "down"})
		}
	},
	
	_fullScreen : function() {
		try {
			this.video.webkitEnterFullscreen();
		} catch (e) {
			$(this.EL_STRING)
				.text("Sorry, your browser doesn't support full screen! Kudos to them for following the spec; lame as it is!")
				.dialog();
		}
	},
	
	_slidechangeHandler : function(event, ui) {
		if(event.originalEvent) {
			this.video.currentTime = ui.value;
		}
	},
	
	_slidestartHandler : function(event, ui) {
		if(this.playing) {
			this.wasPlaying = true;
			this.video.pause();
		}
	},
	
	_slidestopHandler : function(event, ui) {
		if(this.wasPlaying) {
			this.video.play();
			this.wasPlaying = false;
		}
	},
	
	_playButtonHandler : function(e) {
		if(this.video.paused) {
			this.video.play();
		} else {
			this.video.pause();
		}
	},
	
	loadUrl : function(url) {
		this.video.pause();
		this._pauseHandler();
		this.playhead.slider.progressbar("option", "value", 0);
		this.playhead.slider.slider("option", "value", 0)
		this.video.src = url;
		setTimeout($.proxy(this.finishUrlLoad, this), 100);
	},
	
	finishUrlLoad : function() {
		this.video.load();
	}

});