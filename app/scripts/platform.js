/*global define */

define(function() {
  var HEIGHT = 27;
  var WIDTH = 28;

  var Platform = function(rect) {
    this.rect = rect;
    this.movingY = rect.movingY;
    this.movingX = rect.movingX;
    //console.log(this.moving)
    this.totalWidth = this.rect.width * WIDTH;
    this.totalHeight = this.rect.height * HEIGHT;
    this.rect.right = rect.x + this.totalWidth;
    this.pos = {};
    this.pos.x = this.rect.x;
    this.pos.y = this.rect.y;
    this.maxY = this.pos.y - 200;
    this.movement = -100;
    this.el = $('<div id="'+rect.id+'" class="platform">');
    this.el.css({
      left: rect.x,
      top: rect.y,
      width: this.totalWidth,
      height: this.totalHeight
    });
    this.id = rect.id;
      this.el.css('transform', 'translate3d(0,0,0)');
  };

  Platform.prototype.onFrame = function(delta) {

    if(this.movingY){

    if(this.pos.y <= this.maxY) {
        this.movement = this.movement *(-1);
      }
      else if(this.pos.y >= this.maxY + 500){
         this.movement = this.movement *(-1);

      }
      this.pos.y += this.movement * delta; 
  

       this.el.css({
     
      top: this.pos.y
    });

    }
    if(this.movingX){

    if(this.pos.x <= 20) {
        this.movement = this.movement *(-1);
      }
      else if(this.pos.x >= 750){
         this.movement = this.movement *(-1);

      }
      this.pos.x += this.movement * delta; 
  

       this.el.css({
     
      left: this.pos.x
    });

    }
  };

  Platform.prototype.kill = function(){
    this.el.remove();
  }
  return Platform;
});
