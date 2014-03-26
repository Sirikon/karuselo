HTMLElement.prototype._karuselo = null;

function Karuselo(element) {
	this.slides = [];
	this.actualSlide = 0;

	if(element.hasClass('kr-carousel')){
		var anchor = this;
		this._element = element;
		this._element.find('div.kr-slide').each(function(){
			var e = $(this);
			anchor.slides.push(e)
			e.css('background-image',"url('" + e.attr('kr-image') + "')");
		});
		this._element.get(0)._karuselo = this;
		this.slides[this.actualSlide].addClass('active');
		var anims = this._element.attr('kr-anims').split(' ');
		this.inLeftAnim = anims[0];
		this.inRightAnim = anims[1];
		this.outLeftAnim = anims[2];
		this.outRightAnim = anims[3];
	}
	this.getElement = function(){
		return this._element;
	}
	this.next = function(){
		var nextSlide = ((this.actualSlide + this.slides.length + 1) % this.slides.length);
		this.slides[this.actualSlide]
			.removeClass('active '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
			.addClass('removing animated ' + this.outLeftAnim);
		this.slides[nextSlide]
			.removeClass('removing '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
			.addClass('active animated ' + this.inRightAnim);
		this.actualSlide = nextSlide;
	}
	this.prev = function(){
		var prevSlide = ((this.actualSlide + this.slides.length - 1) % this.slides.length);
		this.slides[this.actualSlide]
			.removeClass('active '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
			.addClass('removing animated ' + this.outRightAnim);
		this.slides[prevSlide]
			.removeClass('removing '+this.inLeftAnim+' '+this.inRightAnim+' '+this.outLeftAnim+' '+this.outRightAnim)
			.addClass('active animated ' + this.inLeftAnim);
		this.actualSlide = prevSlide;
	}
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
		var c = KaruseloStore.add(k);
		e.attr('kr-id', c);
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