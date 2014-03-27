HTMLElement.prototype._karuselo = null;

function Karuselo(element) {
	this.slides = [];
	this.actualSlide = 0;
	this.slidesByPage = 1;

	this._constructor = function(){
		if(element.hasClass('kr-carousel')){
			var anchor = this;
			this._element = element;
			this._element.find('div.kr-slide').each(function(){
				var e = $(this);
				anchor.slides.push(e);
				e.css('background-image',"url('" + e.attr('kr-image') + "')");
			});
			this._element.get(0)._karuselo = this;
			var anims = this._element.attr('kr-anims').split(' ');
			this.inLeftAnim = anims[0];
			this.inRightAnim = anims[1];
			this.outLeftAnim = anims[2];
			this.outRightAnim = anims[3];
			var slidesByPageTemp = this._element.attr('kr-slides-by-page');
			if(slidesByPageTemp){
				slidesByPageTemp = parseInt(slidesByPageTemp);
				if(slidesByPageTemp < this.slides.length){
					this.slidesByPage = slidesByPageTemp;
				}else{
					console.warn("Equal or less slides than slidesByPage, setting default: 1");
				}
			}
			this.drawSlides();
			var c = KaruseloStore.add(this);
			this._id = c;
			this._element.attr('kr-id', c);
			this.buildCSS();
		}
	}

	this.drawSlides = function(enter){
		if(this.slidesByPage == 1){
			this.slides[this.actualSlide].addClass('active');
		}else{
			
			for(var i = 0; i < this.slides.length; i++){
				var thisslide = (this.actualSlide+i+this.slides.length)%this.slides.length;
				this.slides[thisslide]
					.attr('kr-pos', i)
					.attr('kr-enter',enter)
					.attr('kr-out','');
			}

			if(enter=='right'){
				this.slides[ (this.actualSlide-1+this.slides.length)%this.slides.length ]
					.attr('kr-out','left')
					.attr('kr-enter','');
			}else if(enter=='left'){
				this.slides[ (this.actualSlide+this.slidesByPage+this.slides.length)%this.slides.length ]
					.attr('kr-out','right')
					.attr('kr-enter','');
			}

		}
	}

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
						@-webkit-keyframes to"+i+"FromRight {\
							from {\
								-webkit-transform: translate3d(100%,0%,0px);\
							}\
							to {\
								-webkit-transform: translate3d(0%,0%,0px);\
							}\
						}\
					");
				cssElement.append("\
						@-webkit-keyframes to"+i+"FromLeft {\
							from {\
								-webkit-transform: translate3d(-100%,0%,0px);\
							}\
							to {\
								-webkit-transform: translate3d(0%,0%,0px);\
							}\
						}\
					");
				cssElement.append("\
						div.kr-slide[kr-pos='"+i+"']{\
							width: "+widthPerElement+"% !important;\
							left: "+count+"% !important;\
							opacity: 1 !important;\
						}\
					");
				cssElement.append("\
						div.kr-slide[kr-pos='"+i+"'][kr-enter='right']{\
							-webkit-animation: to"+i+"FromRight 0.75s;\
						}\
					");
				cssElement.append("\
						div.kr-slide[kr-pos='"+i+"'][kr-enter='left']{\
							-webkit-animation: to"+i+"FromLeft 0.75s;\
						}\
					");
				count += widthPerElement;
			}
			cssElement.append("\
						div.kr-slide[kr-out='left']{\
							width: "+widthPerElement+"% !important;\
							left: 0% !important;\
							opacity: 1 !important;\
							-webkit-animation: outLeft 0.75s;\
							-webkit-transform: translate3d(-100%,0%,0px);\
						}\
					");
			cssElement.append("\
						div.kr-slide[kr-out='right']{\
							width: "+widthPerElement+"% !important;\
							left: "+(widthPerElement*(this.slidesByPage-1))+"% !important;\
							opacity: 1 !important;\
							-webkit-animation: outRight 0.75s;\
							-webkit-transform: translate3d(100%,0%,0px);\
						}\
					");
			cssElement.append("\
					@-webkit-keyframes outLeft {\
						from {\
							-webkit-transform: translate3d(0%,0%,0px);\
						}\
						to {\
							-webkit-transform: translate3d(-100%,0%,0px);\
						}\
					}\
				");
			cssElement.append("\
					@-webkit-keyframes outRight {\
						from {\
							-webkit-transform: translate3d(0%,0%,0px);\
						}\
						to {\
							-webkit-transform: translate3d(100%,0%,0px);\
						}\
					}\
				");
		}
	}

	this.getElement = function(){
		return this._element;
	}

	this.getActualSlides = function(){
		var res = [];
		for(var i = 0; i < this.slidesByPage; i++){
			res.push(this.slides[this.actualSlide+i]);
		}
		return res;
	}

	this.changeTo = function(sid){
		if(!this.slides[sid]){ return; }
		if(sid > this.actualSlide){
			this.goForward(sid);
		}else if(sid < this.actualSlide){
			this.goBack(sid);
		}
	}
	this.goForward = function(sid){
		if(this.slidesByPage == 1){
			this.slides[this.actualSlide]
				.removeClass('active '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
				.addClass('removing animated ' + this.outLeftAnim);
			this.slides[sid]
				.removeClass('removing '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
				.addClass('active animated ' + this.inRightAnim);
			this.actualSlide = sid;
		}else{
			this.actualSlide = sid;
			this.drawSlides('right');
		}
	}
	this.goBack = function(sid){
		if(this.slidesByPage == 1){
			this.slides[this.actualSlide]
				.removeClass('active '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
				.addClass('removing animated ' + this.outRightAnim);
			this.slides[sid]
				.removeClass('removing '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
				.addClass('active animated ' + this.inLeftAnim);
			this.actualSlide = sid;
		}else{
			this.actualSlide = sid;
			this.drawSlides('left');
		}
	}
	this.next = function(){
		var nextSlide = ((this.actualSlide + this.slides.length + 1) % this.slides.length);
		this.goForward(nextSlide,true);
	}
	this.prev = function(){
		var prevSlide = ((this.actualSlide + this.slides.length - 1) % this.slides.length);
		this.goBack(prevSlide,false);
	}
	this._constructor();
}

var KaruseloStore = {
	store: [],
	add: function(k){
		this.store.push(k);
		return this.store.length - 1;
	}
}

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

$(document).ready(function(){
	$('div.kr-carousel').each(function(){
		var e = $(this);
		var k = new Karuselo(e);
	});
	$(document).on('webkitAnimationEnd','div.kr-slide.removing', function(){
		$(this).removeClass('removing');
	});
	$(document).on('click', 'div.kr-carousel *.kr-next', function(){
		var krid = KaruseloStatic.getCarouselParent($(this)).attr('kr-id');
		KaruseloStore.store[krid].next();
	});
	$(document).on('click', 'div.kr-carousel *.kr-prev', function(){
		var krid = KaruseloStatic.getCarouselParent($(this)).attr('kr-id');
		KaruseloStore.store[krid].prev();
	});
	$(document).on('click', '*.kr-next[kr-ref]', function(){
		var selector = $(this).attr('kr-ref');
		$(selector).get(0)._karuselo.next();
	});
	$(document).on('click', '*.kr-prev[kr-ref]', function(){
		var selector = $(this).attr('kr-ref');
		$(selector).get(0)._karuselo.prev();
	});
});