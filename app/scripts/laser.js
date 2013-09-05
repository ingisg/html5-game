/*global define */

define(function() {
  var LIFE = 2;
  var Laser = function(options) {

    this.el = $('<div class="laser" id="'+options.id+'"></div>');

    this.pos = { x:options.pos.x, y: options.pos.y };
    this.radius = 6;
    this.lifetime = 0;
    this.dead = false;
    this.speed = -40;
    this.id = options.id;


  };

  Laser.prototype.onFrame = function(delta) {
    
    this.lifetime+=delta;
    if(this.lifetime > LIFE){
      this.dead = true;
    
    }
   

    this.pos.x+=this.speed*delta;

    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px, 0,0)');
  };

  return Laser;
});
