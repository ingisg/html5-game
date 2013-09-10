/*global define */

define(['Howler'],function(howler) {
  var LIFE = 10;
  var DEADLYCOOLDOWN = 1;
  var Laser = function(options) {

    this.el = $('<div class="laser" id="'+options.id+'"></div>');

    this.pos = { x:options.pos.x, y: options.pos.y };
    this.radius = 10;
    this.lifetime = 0;
    this.dead = false;
    this.direction = options.direction;
    this.speed = options.speed;
    this.id = options.id;
    this.deadly = true;
    this.nonDeadlyTimer = 0;


  };

  
  Laser.prototype.deflect = function(){
    this.direction = this.direction*-1;
    this.deadly = false;
   
  }

  Laser.prototype.onFrame = function(delta) {
    
    this.lifetime+=delta;
    if(this.lifetime > LIFE){
      this.dead = true;
    
    }
    if(!this.deadly){
      this.nonDeadlyTimer+=delta;
      if(this.nonDeadlyTimer > DEADLYCOOLDOWN){
        //this.deadly= true;
      }
    }


    this.pos.x+=this.speed*delta*this.direction;

    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px, ' + this.pos.y + 'px,0)');
  };
  Laser.prototype.kill = function(){
    this.el.remove();
  }

  return Laser;
});
