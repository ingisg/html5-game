/*global define */

define(function() {
  var FIRERATE = 1;
  var FloatingEnemy = function(options, game) {
    this.el = $('<div class="enemy" id="'+options.id+'"></div>');

    this.pos = {};
    this.game = game;
    this.pos.x = options.x;
    this.pos.y = options.y;
    this.radius = 32;
    this.start = options.start;
    this.end = options.end;
    this.duration = options.duration || 5;
    this.current = 0;
    this.fireTimer = 0;
    this.readyToFire = true;
    this.dying = false;
    this.id = options.id;
    this.direction = options.direction;
      this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0) scaleX('+this.direction+')');

  };

  FloatingEnemy.prototype.kill = function(){
    this.el.remove();
  }
  FloatingEnemy.prototype.fire = function(){
    this.readyToFire = false;
  }
  FloatingEnemy.prototype.onFrame = function(delta) {
    this.laserCheck();
    this.fireTimer += delta;
    if(this.fireTimer > 3){
      this.fireTimer = 0;
      this.readyToFire = true;

    }
    if(this.dying){
      this.pos.y+=150*delta;
  this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');

    }

    if(this.dead){
  //    this.el.remove();
    }


  /*  this.current = (this.current + delta) % this.duration;

    var relPosition = Math.sin((Math.PI * 2) * (this.current / this.duration)) / 2 + 0.5;

    this.pos.x = this.start.x + (this.end.x - this.start.x) * relPosition;
    this.pos.y = this.start.y + (this.end.y - this.start.y) * relPosition;*/

    // Update UI
   
  };
  FloatingEnemy.prototype.laserCheck = function() {
    var centerX = this.pos.x;
    var centerY = this.pos.y;
    var that = this;

    this.game.forEachLaser(function(laser) {
    var distanceX = laser.pos.x - centerX;
    var distanceY = laser.pos.y - centerY;

      // Minimum distance squared
    var distanceSq = distanceX * distanceX + distanceY * distanceY;
    var minDistanceSq = (laser.radius + that.radius) * (laser.radius + that.radius);

    if(!laser.deadly){
       if (distanceSq < minDistanceSq) {
          that.dying = true;

      }
     
  }
});
}

  return FloatingEnemy;
});
