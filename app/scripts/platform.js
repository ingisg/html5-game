/*global define */

define(function() {

  var Platform = function(rect) {
    this.rect = rect;
    this.rect.right = rect.x + rect.width;
    this.pos = {};
    this.pos.x = this.rect.x;
    this.pos.y = this.rect.y;
    this.el = $('<div id="'+rect.id+'" class="platform">');
    this.el.css({
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    });
    this.id = rect.id;
  };

  Platform.prototype.onFrame = function() {};
  Platform.prototype.kill = function(){
    this.el.remove();
  }
  return Platform;
});
