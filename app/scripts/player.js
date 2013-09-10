/*global define */

define(['controls','Howler'], function(controls,howler) {

  var PLAYER_SPEED = 400;
  var JUMP_VELOCITY = 1200 ;
  var GRAVITY = 2000;
  var PLAYER_HALF_WIDTH = 14;
  var PLAYER_RADIUS = 40;

  var HELL_Y = 500;



  var Player = function(el, game) {
    this.game = game;
    this.el = el;
    this.hand = el.find(".hand");
    this.shieldEl = el.find(".shieldContainer");
    console.log(this.hand);
    this.swinging = false;
    this.swingTimer = 0.2;
    this.direction = 1;
    this.shield = false;

    this.swing1 = new howler.Howl({
    buffer:true,
    urls: ['/sounds/swing1.mp3', '/sounds/swing1.ogg']  
    });

    this.forcejumpsound = new howler.Howl({
    urls: ['/sounds/forcejump.mp3', '/sounds/forcejump.ogg']  
    });

     this.shieldgainsound = new howler.Howl({
    urls: ['/sounds/shieldgain.mp3', '/sounds/shieldgain.ogg']  
    });

      this.saberhit = new howler.Howl({
    urls: ['/sounds/saberhit.mp3', '/sounds/saberhit.ogg']  
    });
  };

  Player.prototype.reset = function() {
    this.pos = { x: 200, y: 400 };
    this.vel = { x: 0, y: 0 };
  }
  Player.prototype.swing = function(){
    
    this.hand.toggleClass("swing",false);
    this.swinging = true;    
    this.swing1.play();      
  }

  Player.prototype.onFrame = function(delta) {
    
     // Player input
    this.vel.x = controls.inputVec.x * PLAYER_SPEED;

  if (this.vel.y === 0) {
      this.vel.y = -JUMP_VELOCITY;
    }

    // Gravity

    this.vel.y += GRAVITY * delta;

    var oldY = this.pos.y;
    this.pos.x += delta * this.vel.x;
    this.pos.y += delta * this.vel.y;


    if(controls.inputVec.x <  0){
      this.direction = -1;
    
    }
    else if(controls.inputVec.x > 0){
     this.direction = 1;
    }

    this.hand.toggleClass("swing",this.swinging);
    this.shieldEl.toggleClass("forceshieldEffect",this.shield);
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0) scaleX('+this.direction+')');
    // Jumping
    
    

   

    // Collision detection
    this.checkPlatforms(oldY);
    
    this.checkEnemies();
    this.checkForceups();
    this.checkShieldUps();
    this.checkGameOver();

  
   

    this.el.toggleClass('jumping', this.vel.y < 0);
    this.el.toggleClass('walking', this.vel.x !== 0);
  };

  Player.prototype.checkGameOver = function() {
    if (this.pos.y > HELL_Y) {
      this.game.gameOver();
    }
  };

  Player.prototype.checkPlatforms = function(oldY) {
    var that = this;

    this.game.forEachPlatform(function(p) {
      // Are we crossing Y.
     
      if (p.pos.y >= oldY && p.pos.y-10 < that.pos.y) {

        // Are inside X bounds.
        if (that.pos.x + PLAYER_HALF_WIDTH >= p.pos.x && that.pos.x - PLAYER_HALF_WIDTH <= (p.pos.x+p.totalWidth)) {
          console.log("Collision!");
          // COLLISION. Let's stop gravity.
          that.pos.y = p.pos.y;
          that.vel.y = 0;

        }
      }
    });
  };

  Player.prototype.checkForceups  = function(){
     var centerX = this.pos.x;
    var centerY = this.pos.y;
    var that = this;
     this.game.forEachForceup(function(forceup){
      var distanceX = forceup.pos.x - centerX;
      var distanceY = forceup.pos.y - centerY;

      // Minimum distance squared
      var distanceSq = distanceX * distanceX + distanceY * distanceY;
      var minDistanceSq = (forceup.radius + PLAYER_RADIUS) * (forceup.radius + PLAYER_RADIUS);
        if (distanceSq < minDistanceSq) {
          forceup.dead = true;
          that.vel.y = -2500;
          that.forcejumpsound.play();
        }
    });
  }

  Player.prototype.checkShieldUps  = function(){
     var centerX = this.pos.x;
    var centerY = this.pos.y;
    var that = this;
     this.game.forEachForceshield(function(shieldup){
      var distanceX = shieldup.pos.x - centerX;
      var distanceY = shieldup.pos.y - centerY;

      // Minimum distance squared
      var distanceSq = distanceX * distanceX + distanceY * distanceY;
      var minDistanceSq = (shieldup.radius + PLAYER_RADIUS) * (shieldup.radius + PLAYER_RADIUS);
        if (distanceSq < minDistanceSq) {
          shieldup.dead =true;
          that.shield = true;
          that.shieldgainsound.play();
        }
    });
  }
  Player.prototype.checkEnemies = function() {
    var centerX = this.pos.x;
    var centerY = this.pos.y;
    var that = this;
    this.game.forEachEnemy(function(enemy){
      var distanceX = enemy.pos.x - centerX;
      var distanceY = enemy.pos.y - centerY;

      // Minimum distance squared
      var distanceSq = distanceX * distanceX + distanceY * distanceY;
      var minDistanceSq = (enemy.radius + PLAYER_RADIUS) * (enemy.radius + PLAYER_RADIUS);
        if (distanceSq < minDistanceSq) {
          if(!enemy.dying){
           
            
            that.swing();
            that.saberhit.play();
            enemy.hit();
          }
        }
    });
    this.game.forEachLaser(function(laser) {
      // Distance squared
      var distanceX = laser.pos.x - centerX;
      var distanceY = laser.pos.y - centerY;

      // Minimum distance squared
      var distanceSq = distanceX * distanceX + distanceY * distanceY;
      var minDistanceSq = (laser.radius + PLAYER_RADIUS) * (laser.radius + PLAYER_RADIUS);

      // What up?
      if(!laser.deadly){

      }
      else{
        if (distanceSq < minDistanceSq) {
          console.log(that.direction + laser.direction);
        if((that.direction + laser.direction) !== 0){
          if(laser.deadly){
            laser.dead = true;
            if(that.shield){
              laser.deadly = false;
              console.log("SHIELD!");
              that.shield= false;
            }
            else{
              console.log("DEEEEED!");
               that.game.gameOver();
            }
           
          }
         
          

        }
        else{
          if(laser.deadly){
            
           
             laser.deflect();
             that.swing();
           
          }
        }
      }
      }
      
    });
  };

  return Player;
});
