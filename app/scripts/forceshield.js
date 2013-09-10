/*global define */

define(function() {

  var ForceShield = function(options) {

    this.el = $('<div class="forceshield"></div>');

    this.pos = { x:options.x, y: options.y };
    this.radius = 10;
    this.lifetime = 0;
  };


  ForceShield.prototype.onFrame = function(delta) {
  
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px, ' + this.pos.y + 'px,0)');
  };
 ForceShield.prototype.kill = function(){
  this.el.remove();
 }

  return ForceShield;
});
