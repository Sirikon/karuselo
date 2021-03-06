HTMLElement.prototype._karuselo = null;

// Karuselo Class
function Karuselo(element) {

	// Define attributes
	this.slides = [];
	this.actualSlide = 0;
	this.slidesByPage = 1;
	this.timeInterval = 0;
	this.interval = null;

	// Constructor
	this._constructor = function(){
		// Only exec constructor if element has class kr-carousel
		if(element.hasClass('kr-carousel')){
			// Anchor to access class from callbacks
			var anchor = this;
			this._element = element;
			// Find, save and add initial css to every slide
			this._element.find('div.kr-slide').each(function(){
				var e = $(this);
				anchor.slides.push(e);
				e.css('background-image',"url('" + e.attr('kr-image') + "')");
			});
			// Set karuselo attribute to element
			this._element.get(0)._karuselo = this;

			// Read and set animations
			var animsAttr = this._element.attr('kr-anims');
			if(animsAttr){
				var anims = animsAttr.split(' ');
				if(anims.length == 2){
					this.inLeftAnim = anims[0];
					this.inRightAnim = anims[0];
					this.outLeftAnim = anims[1];
					this.outRightAnim = anims[1];
				}else if(anims.length == 4){
					this.inLeftAnim = anims[0];
					this.inRightAnim = anims[1];
					this.outLeftAnim = anims[2];
					this.outRightAnim = anims[3];
				}else{
					console.warn("Wrong composition of animations, setting default ones")
					this.inLeftAnim = "fadeInLeft";
					this.inRightAnim = "fadeInRight";
					this.outLeftAnim = "fadeOutLeft";
					this.outRightAnim = "fadeOutRight";
				}
			}else{
				this.inLeftAnim = "fadeInLeft";
				this.inRightAnim = "fadeInRight";
				this.outLeftAnim = "fadeOutLeft";
				this.outRightAnim = "fadeOutRight";
			}

			// Read and set slides by page
			var slidesByPageTemp = this._element.attr('kr-slides-by-page');
			if(slidesByPageTemp){
				slidesByPageTemp = parseInt(slidesByPageTemp);
				if(slidesByPageTemp <= this.slides.length){
					this.slidesByPage = slidesByPageTemp;
				}else{
					console.warn("Less slides than slidesByPage, setting default: 1");
				}
			}

			// Read and set interval
			var timeIntervalTemp = this._element.attr('kr-interval');
			if(timeIntervalTemp){
				this.timeInterval = parseInt(timeIntervalTemp);
			}

			// Start interval
			this.startInterval();

			// Gen slide buttons
			this.genNavButtons();

			// Draw slides and add this new Karuselo to KaruseloStore
			this.drawSlides();
			var c = KaruseloStore.add(this);
			this._id = c;
			this._element.attr('kr-id', c);
			this.buildCSS();
			this.findNavButtons();
			this.drawNavButtons();
		}
	}

	// Starts the interval
	this.startInterval = function(){
		if(this.timeInterval > 0 && this.slidesByPage < this.slides.length && !this.interval){
			var anchor = this;
			this.interval = setInterval(function(){
				anchor.next();
			}, anchor.timeInterval);
		}
	}

	// Stops the interval
	this.stopInterval = function(){
		clearInterval(this.interval);
		this.interval = null;
	}

	// Refreshes classes and CSS of the slides with actual data
	this.drawSlides = function(enter){
		if(this.slidesByPage == 1){
			this.slides[this.actualSlide].addClass('active');
			this.drawNavButtons();
		}else{
			var thenew;
			if(enter=='right'){
				var thenew = (this.actualSlide-1+this.slides.length)%this.slides.length;
				this.slides[ thenew ]
					.attr('kr-out','left')
					.attr('kr-enter','');
			}else if(enter=='left'){
				var thenew = (this.actualSlide+this.slidesByPage+this.slides.length)%this.slides.length
				this.slides[ thenew ]
					.attr('kr-out','right')
					.attr('kr-enter','');
			}

			for(var i = 0; i < this.slides.length; i++){
				var thisslide = (this.actualSlide+i+this.slides.length)%this.slides.length;
				this.slides[thisslide]
					.attr('kr-pos', i)
					.attr('kr-enter',enter);
				if(thisslide != thenew){
					this.slides[thisslide].attr('kr-out','');
				}
			}
		}
	}

	// Generates slider buttons
	this.genNavButtons = function(){
		var navElement = this._element.find('*.kr-navigation');
		if(navElement.length != 0 && this.slidesByPage == 1){
			for(var i = 0; i<this.slides.length; i++){
				var newButton = $(document.createElement('button'));
				newButton.attr('kr-slide',i);
				newButton.text();
				navElement.append(newButton);
			}
		}
	}

	this.findNavButtons = function(){
		var anchor = this;
		$('*[kr-ref]').each(function(){
			var selector = $(this).attr('kr-ref');
			var el = $(selector);
			if(el.length != 0){
				if(el.get(0)._karuselo){
					if(el.get(0)._karuselo._id == anchor._id){
						$("*[kr-ref='" + selector + "']").attr('kr-ref', anchor._id);
					}
				}
			}
		});
	}

	this.drawNavButtons = function(){
		if(this.slidesByPage == 1){
			this._element.find("*[kr-slide]:not([kr-ref])").removeClass('active_slider');
			$("*[kr-slide][kr-ref='" + this._id + "']").removeClass('active_slider');
			this._element.find("*[kr-slide='" + this.actualSlide + "']:not([kr-ref])").addClass('active_slider');
			$("*[kr-slide='" + this.actualSlide + "'][kr-ref='" + this._id + "']").addClass('active_slider');
		}
	}

	// Build calculated CSS for slides when slidesbypage is greater than 1
	this.buildCSS = function(){
		var cssElement = $("style[kr-style='"+this._id+"']");
		if(cssElement.length == 0){
			var tempCSS = $(document.createElement('style'));
			tempCSS.attr('kr-style', this._id);
			$('head').append(tempCSS);
			cssElement = tempCSS;
		}

		if(this.slidesByPage > 1){
			var count = 0;
			widthPerElement = 100/this.slidesByPage;
			for(var i = 0; i < this.slidesByPage; i++){
				cssElement.append("\
						@-webkit-keyframes to"+i+"FromRight-"+this._id+" {\
							from {\
								-webkit-transform: translate3d(100%,0%,0px);\
							}\
							to {\
								-webkit-transform: translate3d(0%,0%,0px);\
							}\
						}\
					");
				cssElement.append("\
						@keyframes to"+i+"FromRight-"+this._id+" {\
							from {\
								transform: translate3d(100%,0%,0px);\
							}\
							to {\
								transform: translate3d(0%,0%,0px);\
							}\
						}\
					");
				cssElement.append("\
						@-webkit-keyframes to"+i+"FromLeft-"+this._id+" {\
							from {\
								-webkit-transform: translate3d(-100%,0%,0px);\
							}\
							to {\
								-webkit-transform: translate3d(0%,0%,0px);\
							}\
						}\
					");
				cssElement.append("\
						@keyframes to"+i+"FromLeft-"+this._id+" {\
							from {\
								transform: translate3d(-100%,0%,0px);\
							}\
							to {\
								transform: translate3d(0%,0%,0px);\
							}\
						}\
					");
				cssElement.append("\
						div[kr-id='"+this._id+"'] div.kr-slide[kr-pos='"+i+"']{\
							width: "+widthPerElement+"% !important;\
							left: "+count+"% !important;\
							z-index: 7 !important;\
							opacity: 1 !important;\
						}\
					");
				cssElement.append("\
						div[kr-id='"+this._id+"'] div.kr-slide[kr-pos='"+i+"'][kr-enter='right']{\
							z-index: 7 !important;\
							-webkit-animation: to"+i+"FromRight-"+this._id+" 0.75s;\
							-khtml-animation: to"+i+"FromRight-"+this._id+" 0.75s;\
							-moz-animation: to"+i+"FromRight-"+this._id+" 0.75s;\
							-ms-animation: to"+i+"FromRight-"+this._id+" 0.75s;\
							-o-animation: to"+i+"FromRight-"+this._id+" 0.75s;\
							animation: to"+i+"FromRight-"+this._id+" 0.75s;\
						}\
					");
				cssElement.append("\
						div[kr-id='"+this._id+"'] div.kr-slide[kr-pos='"+i+"'][kr-enter='left']{\
							z-index: 7 !important;\
							-webkit-animation: to"+i+"FromLeft-"+this._id+" 0.75s;\
							-khtml-animation: to"+i+"FromLeft-"+this._id+" 0.75s;\
							-moz-animation: to"+i+"FromLeft-"+this._id+" 0.75s;\
							-ms-animation: to"+i+"FromLeft-"+this._id+" 0.75s;\
							-o-animation: to"+i+"FromLeft-"+this._id+" 0.75s;\
							animation: to"+i+"FromLeft-"+this._id+" 0.75s;\
						}\
					");
				count += widthPerElement;
			}
			cssElement.append("\
						div[kr-id='"+this._id+"'] div.kr-slide[kr-out='left']{\
							width: "+widthPerElement+"% !important;\
							left: 0% !important;\
							z-index: 7 !important;\
							opacity: 1 !important;\
							-webkit-animation: outLeft-"+this._id+" 0.75s;\
							-webkit-transform: translate3d(-100%,0%,0px);\
							-khtml-animation: outLeft-"+this._id+" 0.75s;\
							-khtml-transform: translate3d(-100%,0%,0px);\
							-moz-animation: outLeft-"+this._id+" 0.75s;\
							-moz-transform: translate3d(-100%,0%,0px);\
							-ms-animation: outLeft-"+this._id+" 0.75s;\
							-ms-transform: translate3d(-100%,0%,0px);\
							-o-animation: outLeft-"+this._id+" 0.75s;\
							-o-transform: translate3d(-100%,0%,0px);\
							animation: outLeft-"+this._id+" 0.75s;\
							transform: translate3d(-100%,0%,0px);\
						}\
					");
			cssElement.append("\
						div[kr-id='"+this._id+"'] div.kr-slide[kr-out='right']{\
							width: "+widthPerElement+"% !important;\
							left: "+(widthPerElement*(this.slidesByPage-1))+"% !important;\
							z-index: 7 !important;\
							opacity: 1 !important;\
							-webkit-animation: outRight-"+this._id+" 0.75s;\
							-webkit-transform: translate3d(100%,0%,0px);\
							-khtml-animation: outRight-"+this._id+" 0.75s;\
							-khtml-transform: translate3d(100%,0%,0px);\
							-moz-animation: outRight-"+this._id+" 0.75s;\
							-moz-transform: translate3d(100%,0%,0px);\
							-ms-animation: outRight-"+this._id+" 0.75s;\
							-ms-transform: translate3d(100%,0%,0px);\
							-o-animation: outRight-"+this._id+" 0.75s;\
							-o-transform: translate3d(100%,0%,0px);\
							animation: outRight-"+this._id+" 0.75s;\
							transform: translate3d(100%,0%,0px);\
						}\
					");
			cssElement.append("\
					@-webkit-keyframes outLeft-"+this._id+" {\
						from {\
							-webkit-transform: translate3d(0%,0%,0px);\
						}\
						to {\
							-webkit-transform: translate3d(-100%,0%,0px);\
						}\
					}\
				");
			cssElement.append("\
					@keyframes outLeft-"+this._id+" {\
						from {\
							transform: translate3d(0%,0%,0px);\
						}\
						to {\
							transform: translate3d(-100%,0%,0px);\
						}\
					}\
				");
			cssElement.append("\
					@-webkit-keyframes outRight-"+this._id+" {\
						from {\
							-webkit-transform: translate3d(0%,0%,0px);\
						}\
						to {\
							-webkit-transform: translate3d(100%,0%,0px);\
						}\
					}\
				");
			cssElement.append("\
					@keyframes outRight-"+this._id+" {\
						from {\
							transform: translate3d(0%,0%,0px);\
						}\
						to {\
							transform: translate3d(100%,0%,0px);\
						}\
					}\
				");
		}
	}

	// Returns the carousel HTML element
	this.getElement = function(){
		return this._element;
	}

	// Returns list of actual slides
	this.getActualSlides = function(){
		var res = [];
		for(var i = 0; i < this.slidesByPage; i++){
			res.push(this.slides[this.actualSlide+i]);
		}
		return res;
	}

	// Changes the actual slide to given
	this.changeTo = function(sid){
		if(!this.slides[sid]){ return; }
		if(sid > this.actualSlide){
			this.goForward(sid);
		}else if(sid < this.actualSlide){
			this.goBack(sid);
		}
	}

	// Forward the carousel to the given slider
	this.goForward = function(sid){
		if(this.slidesByPage == 1){
			this.slides[this.actualSlide]
				.removeClass('active '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
				.addClass('removing animated ' + this.outLeftAnim);
			this.slides[sid]
				.removeClass('removing '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
				.addClass('active animated ' + this.inRightAnim);
			this.actualSlide = sid;
			this.drawNavButtons();
		}else if(this.slidesByPage < this.slides.length){
			this.actualSlide = sid;
			this.drawSlides('right');
		}
	}

	// Backs te carousel to the given slider
	this.goBack = function(sid){
		if(this.slidesByPage == 1){
			this.slides[this.actualSlide]
				.removeClass('active '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
				.addClass('removing animated ' + this.outRightAnim);
			this.slides[sid]
				.removeClass('removing '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
				.addClass('active animated ' + this.inLeftAnim);
			this.actualSlide = sid;
			this.drawNavButtons();
		}else if(this.slidesByPage < this.slides.length){
			this.actualSlide = sid;
			this.drawSlides('left');
		}
	}

	// Next slider
	this.next = function(){
		var nextSlide = ((this.actualSlide + this.slides.length + 1) % this.slides.length);
		this.goForward(nextSlide,true);
	}

	// Previous slider
	this.prev = function(){
		var prevSlide = ((this.actualSlide + this.slides.length - 1) % this.slides.length);
		this.goBack(prevSlide,false);
	}

	// Run constructor
	this._constructor();
}


// Contains the Karuselo list
var KaruseloStore = {
	store: [],
	add: function(k){
		this.store.push(k);
		return this.store.length - 1;
	}
}

// Usefull static functions
var KaruseloStatic = {
	getCarouselParent: function(element){
		var actualElement = element;
		var found = false;
		while(!found){
			var parent = actualElement.parent();
			if(parent.hasClass('kr-carousel')){
				return parent;
			}else{
				actualElement = parent;
			}
		}
	}
}

// Event handling
$(document).ready(function(){
	$('div.kr-carousel').each(function(){
		var e = $(this);
		var k = new Karuselo(e);
	});
	$(document).on('mouseenter', 'div.kr-carousel', function(){
		this._karuselo.stopInterval();
	});
	$(document).on('mouseleave', 'div.kr-carousel', function(){
		this._karuselo.startInterval();
	});

	function animationEndCallback(){
		$(this).removeClass('removing');
	}

	$(document).on('webkitAnimationEnd','div.kr-slide.removing', animationEndCallback);
	$(document).on('animationend','div.kr-slide.removing', animationEndCallback);
	$(document).on('mozAnimationEnd','div.kr-slide.removing', animationEndCallback);
	$(document).on('oanimationend','div.kr-slide.removing', animationEndCallback);
	$(document).on('MSAnimationEnd','div.kr-slide.removing', animationEndCallback);


	$(document).on('click', 'div.kr-carousel *.kr-next:not([kr-ref])', function(){
		var krid = KaruseloStatic.getCarouselParent($(this)).attr('kr-id');
		KaruseloStore.store[krid].next();
	});
	$(document).on('click', 'div.kr-carousel *.kr-prev:not([kr-ref])', function(){
		var krid = KaruseloStatic.getCarouselParent($(this)).attr('kr-id');
		KaruseloStore.store[krid].prev();
	});
	$(document).on('click', 'div.kr-carousel *[kr-slide]:not([kr-ref])', function(){
		var krid = KaruseloStatic.getCarouselParent($(this)).attr('kr-id');
		KaruseloStore.store[krid].changeTo(parseInt($(this).attr('kr-slide')));
	});
	$(document).on('click', '*[kr-slide][kr-ref]', function(){
		var selector = $(this).attr('kr-ref');
		var k = $("*[kr-id='" + selector + "']").get(0)._karuselo;
		k.changeTo(parseInt($(this).attr('kr-slide')));
		$("*[kr-slide][kr-ref='" + selector + "']").removeClass('active_slider');
		$(this).addClass('active_slider');
		k.stopInterval();
		k.startInterval();
	});
	$(document).on('click', '*.kr-next[kr-ref]', function(){
		var selector = $(this).attr('kr-ref');
		var k = $("*[kr-id='" + selector + "']").get(0)._karuselo;
		k.next();
		k.stopInterval();
		k.startInterval();
	});
	$(document).on('click', '*.kr-prev[kr-ref]', function(){
		var selector = $(this).attr('kr-ref');
		var k = $("*[kr-id='" + selector + "']").get(0)._karuselo;
		k.prev();
		k.stopInterval();
		k.startInterval();
	});
});