/*global define */

define(function() {

  var ForceUp = function(options) {

    this.el = $('<div class="forceup"></div>');

    this.pos = { x:options.x, y: options.y };
    this.radius = 10;
    this.lifetime = 0;
  };


  ForceUp.prototype.onFrame = function(delta) {
  
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px, ' + this.pos.y + 'px,0)');
  };
 ForceUp.prototype.kill = function(){
  this.el.remove();
 }

  return ForceUp;
});
