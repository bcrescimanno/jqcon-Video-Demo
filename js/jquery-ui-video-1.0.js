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
		controlsHeight: 40
	},
	
	EL_STRING : "<div></div>",
	
	_create : function() {
		if(!this.element) return null;
		this.buttons = {};
		
		this._getDimensions();
		this._renderControls();
		this.element.removeAttr("controls");
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
	
	_renderControls : function() {
		this._renderControlBar();
		this._addPlayButton();
		this._addPlayhead();
		this._addFullScreen();
		this.controlBar.hide();
	},
	
	_renderControlBar : function() {
		this.controlBar = $(this.EL_STRING, {
			id : "testing",
			"class" : "ui-widget ui-widget-content ui-corner-all",
			css : {
				height: this.options.controlsHeight + "px",
				width: this.options.width - 30 + "px",
			}
		});
		this.element.after(this.controlBar);
		this.controlBar.position({
			my: "center bottom",
			at: "center bottom",
			of: this.element,
			offset: "0 -20"
		})
	},
	
	_addPlayButton : function() {
		this.buttons["play"] = $(this.EL_STRING)
			.css({
				height: "28px",
			})
			.appendTo(this.controlBar)
			.button({
				icons: {
					primary: "ui-icon-play"
				},
				text: false
			})
			.position({
				my: "left",
				at: "left", 
				of: "#testing",
				offset: "10 0"
			})
			.click($.proxy(function(e){
				if(this.video.paused) {
					this.video.play();
				} else {
					this.video.pause();
				}
			}, this));
	},
	
	_addPlayhead : function() {
		this.playhead = {};
		this.playhead.container = $(this.EL_STRING, { "class" : "ui-state-default ui-button ui-corner-all" })
							.css({
								width: "510px",
								height: "28px",
							})
							.appendTo(this.controlBar)
							.position({
								my: "left",
								at: "left", 
								of: "#testing",
								offset: "50 0"
							});
							
		this.playhead.slider = $(this.EL_STRING)
			.css("width", this.playhead.container.width() - 20 + "px")
			.slider({
				range: "min"
			})
			.appendTo(this.playhead.container)
			.position({
				my: "left",
				at: "left",
				of: this.playhead.container,
				offset: "10 0"
			})
			.bind("slidechange", $.proxy(function(event, ui) {
				if(event.originalEvent) {
					this.video.currentTime = this.playhead.slider.slider("option", "value");
				}
			}, this))
			.bind("slidestart", $.proxy(function(event, ui) {
				if(this.playing) {
					this.wasPlaying = true;
					this.video.pause();
				}
			}, this))
			.bind("slidestop", $.proxy(function(event, ui) {
				if(this.wasPlaying) {
					this.video.play();
					this.wasPlaying = false;
				}
			}, this))
	},
	
	
	_addFullScreen : function() {
		this.buttons["fullscreen"] = $(this.EL_STRING)
			.css({
				height: "28px",
			})
			.appendTo(this.controlBar)
			.button({
				icons: {
					primary: "ui-icon-plusthick"
				},
				text: false
			})
			.position({
				my: "right",
				at: "right", 
				of: "#testing",
				offset: "-10 0"
			})
			.bind("click", $.proxy(function(){
				try {
					this.video.webkitEnterFullscreen();
				} catch (e) {
					alert("Your browser does not support full screen mode");
				}
					
			}, this));
	},
	
	_addEventListeners : function() {
		this.element
			.bind("play", $.proxy(function(){
				this.buttons.play.button("option", "icons", {primary: "ui-icon-pause"});
				this.playing = true;
			}, this))
			.bind("pause", $.proxy(function(){
				this.buttons.play.button("option", "icons", {primary: "ui-icon-play"});
				this.playing = false;
			}, this))
			.bind("timeupdate", $.proxy(function() {
				console.debug("caught timeupdate")
				this.playhead.slider.slider("option", "value", this.video.currentTime);
			}, this))
			.bind("durationchange", $.proxy(function() {
				this.playhead.slider.slider("option", "min", 0);
				this.playhead.slider.slider("option", "max", this.video.duration);
			}, this));
		
		this.element.parent()
			.bind("mouseenter", $.proxy(function() {
				this.controlBar.show("drop", {direction: "down"})
			}, this))
			.bind("mouseleave", $.proxy(function() {
				this.controlBar.hide("drop", {direction: "down"})
			}, this))
	}
});