/*global define, $ */

define(['controls','player', 'platform', 'enemy','laser'], function(controls, Player, Platform, Enemy, Laser) {

  var VIEWPORT_PADDING = 200;

  /**
   * Main game class.
   * @param {Element} el DOM element containig the game.
   * @constructor
   */
  var Game = function(el) {
    this.el = el;
    this.player = new Player(this.el.find('.player'), this);
    this.entities = [];
    this.platformsEl = el.find('.platforms');
    this.gameoverEl = el.find('.gameoverscreen')
    this.entitiesEl = el.find('.entities');
    this.scoreEl = el.find('.score');
    this.worldEl = el.find('.world');
    this.middleBackground = el.find('.middleBackground');

    this.isPlaying = false;
    this.currentMaxPlatformHeight = -300;
    this.currentId = 0;
    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
    this.altitudeScore = 0;
    this.oldScore = -1;
    this.enemyScore = 0;
    this.gameOverState = false;

    controls.on('touch', this.onTouch.bind(this));
    
  };

  Game.prototype.freezeGame = function() {
    this.isPlaying = false;
  };

  Game.prototype.unFreezeGame = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;

      // Restart the onFrame loop
      this.lastFrame = +new Date() / 1000;
      requestAnimFrame(this.onFrame);
    }
  };


  Game.prototype.createWorld = function() {
  this.worldEl.css('transform', 'translate3d(0,0,0)');
  this.middleBackground.css('transform', 'translate3d(0,0,0)');
    this.currentMaxPlatformHeight = -300;
    // Ground
    this.addPlatform(new Platform({
      x: 100,
      y: 418,
      width: 800,
      height: 10
    }));

    // Floating platforms
    this.addPlatform(new Platform({
      x: 300,
      y: 258,
      width: 100,
      height: 10
    }));
    this.addPlatform(new Platform({
      x: 100,
      y: 288,
      width: 100,
      height: 10
    }));
    this.addPlatform(new Platform({
      x: 400,
      y: 158,
      width: 100,
      height: 10
    }));
    this.addPlatform(new Platform({
      x: 200,
      y: 188,
      width: 100,
      height: 10
    }));

    this.addPlatform(new Platform({
      x: 170,
      y: -300,
      width: 100,
      height: 10
    }));

    this.addPlatform(new Platform({
      x: 60,
      y: -200,
      width: 100,
      height: 10
    }));

    this.addPlatform(new Platform({
      x: 152,
      y: 1,
      width: 100,
      height: 10
    }));
    this.addEnemy(new Enemy({
      start: {x: 100, y: 100},
      end: {x: 100, y: 100}
    }));
  };

  Game.prototype.onTouch = function(){
    if(this.gameOverState){
      console.log("restart");
       this.gameoverEl.hide();
       this.gameOverState = false;
       var game = this;
        setTimeout(function() {
          game.start();
        }, 0);

    }
  }


  Game.prototype.addPlatform = function(platform) {
    this.entities.push(platform);
    this.platformsEl.append(platform.el);
  };

  Game.prototype.addEnemy = function(enemy) {
    this.entities.push(enemy);
    this.entitiesEl.append(enemy.el);
  };

  Game.prototype.addLaser = function(laser){
    this.entities.push(laser);
    this.entitiesEl.append(laser.el);
  };

  Game.prototype.gameOver = function() {
    this.gameoverEl.css('display','block');
    this.freezeGame();
    this.gameOverState = true;

  
    
  };

  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */

  Game.prototype.onFrame = function() {
    if (!this.isPlaying) {
      return;
    }

    var now = +new Date() / 1000,
        delta = now - this.lastFrame;
    this.lastFrame = now;
 controls.onFrame(delta);

    this.player.onFrame(delta);

    for (var i = 0, e; e = this.entities[i]; i++) {
      e.onFrame(delta);

      if (e.dead) {
        this.entities.splice(i--, 1);
        this.el.find("#"+e.id).remove();
      }
      if(e.readyToFire){
        e.fire();
       this.addLaser(new Laser({
            pos: {x: e.pos.x, y: e.pos.y},
            id:this.currentId++
          }));
      }
      e.onFrame(delta);
    }

    if(this.player.pos.x > this.viewport.width){

      this.player.pos.x = 0;
    }
    else if(this.player.pos.x < 0){
      this.player.pos.x = this.viewport.width;
    }

    this.updateViewport();
    if(this.player.pos.y < this.currentMaxPlatformHeight+200){
      newX = (Math.random()*this.viewport.width-120)+80;
    this.addPlatform(new Platform({
      x: newX,
      y: this.currentMaxPlatformHeight-(Math.random()*100+42),
      width: 100,
      height: 10
    }));
    this.currentMaxPlatformHeight -= 100;

  }
    // Request next frame.
    requestAnimFrame(this.onFrame);
  };

  Game.prototype.updateViewport = function() {
    var minY = this.viewport.y + VIEWPORT_PADDING;
    this.altitudeScore = Math.round(minY * (-1));
    if(minY < 0 && this.altitudeScore > this.oldScore+99)
    {

      this.oldScore = this.altitudeScore;
      var text = document.createTextNode('Score: '+this.altitudeScore);
      

      document.getElementById("score").innerHTML="Score "+this.altitudeScore;

      
    }
    var maxY = this.viewport.y + this.viewport.width - VIEWPORT_PADDING;

    var playerY = this.player.pos.y;


    // Update the viewport if needed.
    if (playerY < minY) {
      this.viewport.y = playerY - VIEWPORT_PADDING;


    } else if (playerY > maxY+450 + 81) {
      //this.viewport.y = playerY - this.viewport.width + VIEWPORT_PADDING;
      this.gameOver();
    }
  
    this.worldEl.css({
      left: -this.viewport.x,
      top: -this.viewport.y
    });
    
    this.middleBackground.css({
      left: -this.viewport.x/30,
      top: -this.viewport.y/30
    })



  };

  /**
   * Starts the game.
   */
  Game.prototype.start = function() {
    // Cleanup last game.
    this.entities.forEach(function(e) { e.el.remove(); });
    this.entities = [];

    // Set the stage.
    this.createWorld();
    this.player.reset();
    this.viewport = {x: 0, y: 0, width: 800, height: 1200};

    // Then start.
    this.unFreezeGame();
  };

  Game.prototype.forEachPlatform = function(handler) {
    for (var i = 0, e; e = this.entities[i]; i++) {
      if (e instanceof Platform) {
        handler(e);
      }
    }
  };

  Game.prototype.forEachEnemy = function(handler) {
    for (var i = 0, e; e = this.entities[i]; i++) {
      if (e instanceof Enemy) {
        handler(e);
      }
    }
  };

  Game.prototype.forEachLaser = function(handler) {
    for (var i = 0, e; e = this.entities[i]; i++) {
      if (e instanceof Laser) {
        handler(e);
      }
    }
  };


  /**
   * Cross browser RequestAnimationFrame
   */
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  return Game;
});