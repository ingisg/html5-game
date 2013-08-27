/*global define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 400;
  var JUMP_VELOCITY = 1500;
  var GRAVITY = 4000;
  var PLAYER_HALF_WIDTH = 14;

  var Player = function(el, game) {
    this.game = game;
    this.el = el;
    this.pos = { x: 200, y: 400 };
    this.vel = { x: 0, y: 0 };
  };

  Player.prototype.onFrame = function(delta) {
    // Player input
    if (controls.keys.right) {
      this.vel.x = PLAYER_SPEED;
    } else if (controls.keys.left) {
      this.vel.x = -PLAYER_SPEED;
    } else {
      this.vel.x = 0;
    }

    // Jumping
    if (controls.keys.space && this.vel.y === 0) {
      this.vel.y = -JUMP_VELOCITY;
    }

    // Gravity
    this.vel.y += GRAVITY * delta;

    var oldY = this.pos.y;
    this.pos.x += delta * this.vel.x;
    this.pos.y += delta * this.vel.y;

    // Collision detection
    this.checkPlatforms(oldY);

    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');

    this.el.toggleClass('jumping', this.vel.y < 0);
    this.el.toggleClass('walking', this.vel.x !== 0);
  };

  Player.prototype.checkPlatforms = function(oldY) {
    var that = this;

    this.game.forEachPlatform(function(p) {
      // Are we crossing Y.
      if (p.rect.y >= oldY && p.rect.y < that.pos.y) {

        // Are inside X bounds.
        if (that.pos.x + PLAYER_HALF_WIDTH >= p.rect.x && that.pos.x - PLAYER_HALF_WIDTH <= p.rect.right) {
          // COLLISION. Let's stop gravity.
          that.pos.y = p.rect.y;
          that.vel.y = 0;
        }
      }
    });
  };

  return Player;
});
