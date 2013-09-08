/*global define */

define(['controls'],function(controls) {
  
  var Intro = function(el,gameContainer) {
    this.el = el;
    this.gameContainer = gameContainer;
    this.scrollingText =this.el.find(".scrollingText");
    this.destroyer = this.el.find(".closeBackground");
    this.destroyerTopEl = this.el.find(".starDestroyerTop");
    this.starsEl = this.el.find(".stars");
    this.alderaanEl = this.el.find(".alderaan");
    this.exit = this.el.find(".exit");

    this.pos = {};
    this.pos.x = 1;
    this.pos.y = 500;
    this.timer = 0;
    this.introTime = 40;
    this.titleScale = 3.4;
    this.starDestroyerPos = {};
    this.starDestroyerPos.y= -1500;
    this.starDestroyerPos.x = -200;
    this.stars = {};
    this.stars.y = 0;
    this.done = false;
    this.sideview = false;

    this.title = this.el.find(".scrollingTitle")
     this.scrollingText.css('transform', 'translate3d(0,0,0) ');
     this.destroyer.css('transform', 'translate3d(0,0,0) ');
     this.destroyerTopEl.css('transform', 'translate3d(0,0,0) ');
     this.starsEl.css('transform', 'translate3d(0,0,0) ');
     this.alderaanEl.css('transform translate3d(0,0,0)');

       controls.on('touch', this.onTouch.bind(this));
  // 
  };

Intro.prototype.onTouch = function(){

  this.done = true;
  this.destroyerTopEl.css({
      left: 1000
    });
  this.title.css({
      left: 1000
    });
  this.destroyer.css({
      left: 1000
    });
}
  Intro.prototype.onFrame = function(delta) {
    this.pos.y -=20*delta;
    this.pos.x = 0;
    this.timer += delta;
    this.titleScale-=0.4*delta;

    if(this.titleScale > 0){

     this.title.css('transform', 'translate3d(1000px,0,0) scale3d('+this.titleScale+','+this.titleScale+',1)');
   }
   else{
    this.title.remove();
   }

  
   if(this.pos.y < -500){
      this.starDestroyerPos.y +=60*delta;
      this.destroyerTopEl.css({
      top: this.starDestroyerPos.y
    });
}
    if(this.pos.y < -900){
      this.destroyerTopEl.remove();
      this.sideview = true;
      this.starDestroyerPos.y;
      this.destroyerTopEl.css({
      top: -1000
    });
    }

    if(this.sideview){
      this.sideview = false;
      this.starDestroyerPos.y = 200;
        this.destroyer.css({

        top: this.starDestroyerPos.y
      });

        this.alderaanEl.css({
        left:200,
        top:450
      });
     this.starsEl.css('transform', 'scale3d(1.5,1.5,1)');
     

    }
    if(this.pos.y < -900){
      this.starDestroyerPos.x+=60*delta;
      this.destroyer.css({
        left: this.starDestroyerPos.x
      });
    }


    if(this.pos.y < -1300){
      this.done = true;
    }

    if(this.pos.y >-400)
    {
       this.scrollingText.css({top:this.pos.y})
    }
   if(this.pos.y > -500  && this.pos.y < -350){
     this.stars.y -=40*delta;
      this.starsEl.css({
      top: this.stars.y
    });
    }




  /*  this.current = (this.current + delta) % this.duration;

    var relPosition = Math.sin((Math.PI * 2) * (this.current / this.duration)) / 2 + 0.5;

    this.pos.x = this.start.x + (this.end.x - this.start.x) * relPosition;
    this.pos.y = this.start.y + (this.end.y - this.start.y) * relPosition;*/

    // Update UI
   
  };

  return Intro;
});
