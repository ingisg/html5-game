/*global define, $ */

define(['controls','player', 'platform', 'enemy','laser','intro','Howler','Hammer'], function(controls, Player, Platform, Enemy, Laser, Intro,howler,hammer) {

  var VIEWPORT_PADDING = 200;

  /**
   * Main game class.
   * @param {Element} el DOM element containig the game.
   * @constructor
   */
  var Game = function(el) {
    this.el = el;
   
    this.player = new Player(this.el.find('.player'), this);

    this.intro = new Intro(this.el.find('.intro'),this.el.find('.gameContent'));

    this.entities = [];
    this.platformsEl = el.find('.platforms');
    this.gameoverEl = el.find('.gameoverscreen')
    this.gameContentEl = el.find('.gameContent');
    this.gameContentEl.css('transform', 'translate3d(500,0,0)');
    this.closeBackgroundEl = el.find('.closeBackground');
    this.entitiesEl = el.find('.entities');
    this.scoreEl = el.find('.score');
    this.highscoreEl = el.find('.highscore');
    this.worldEl = el.find('.world');
    this.middleBackground = el.find('.middleBackground');
    this.closeBackgroundX = -1500;

    this.isPlaying = false;
    this.currentMaxPlatformHeight = -300;
    this.currentId = 0;
    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
    this.altitudeScore = 0;
    this.oldScore = -1;
    this.enemyScore = 0;
    this.highScore = 0;
    this.Score = 0;
    this.gameOverState = false;

    controls.on('touch', this.onTouch.bind(this));

    this.introActive = true;
    this.isPlaying = false;

    this.ready = false;

    var that = this;
    this.sound = new howler.Howl({
      urls: ['/sounds/intro.mp3', '/sounds/intro.ogg'],
      onload:function(){
        console.log("test");
         this.ready = true;
         that.sound.play();
         that.start();

      }

    });
   
    
  };
  
  Game.prototype.freezeGame = function() {
    this.isPlaying = false;
  };

  Game.prototype.scoreGain = function(){
      this.Score = this.altitudeScore + this.enemyScore;

      var text = document.createTextNode('Score: '+ this.Score);
      

      document.getElementById("score").innerHTML="Score "+ this.Score;
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
      width: 35,
      height: 5,
      id: this.currentId++
    }));

    // Floating platforms
    this.addPlatform(new Platform({
      x: 300,
      y: 258,
      width: 5,
      height: 1,
      id: this.currentId++
    }));
    this.addPlatform(new Platform({
      x: 100,
      y: 288,
      width: 4,
      height: 1,
      id: this.currentId++,
      moving: true
    }));
    this.addPlatform(new Platform({
      x: 400,
      y: 158,
      width: 5,
      height: 1,
      id: this.currentId++
    }));
    this.addPlatform(new Platform({
      x: 200,
      y: 188,
      width: 5,
      height: 1,
      id: this.currentId++
    }));

    this.addPlatform(new Platform({
      x: 170,
      y: -300,
      width: 5,
      height: 1,
      id: this.currentId++
    }));

    this.addPlatform(new Platform({
      x: 60,
      y: -200,
      width: 5,
      height: 1,
      id: this.currentId++
    }));

    this.addPlatform(new Platform({
      x: 152,
      y: 1,
      width: 5,
      height: 1,
      id: this.currentId++
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
    console.log("over");
    this.freezeGame();
    this.scoreGain();
    console.log(this.Score + '   ' + this.highScore);
    this.altitudeScore = 0;
    this.enemyScore = 0;
    this.oldScore = -1;
    if(this.Score > this.highScore)
    {
      console.log(this.Score + '   ' + this.highScore);
      this.highScore = this.Score;
      console.log(this.Score + '   ' + this.highScore);
    }

    this.gameoverEl.css('display','block');  
    this.scoreEl.css({
        left: 200,
        top: 200
        
      });   

    document.getElementById("highscore").innerHTML="High Score "+ this.highScore;

    
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

    if(!this.intro.done){
      this.intro.onFrame(delta);
    }
    else if(this.intro.done){ //TODO gera bara einusinni
        this.gameContentEl.css({
        left: 0,
        top: 0
      });
     
    
     this.player.onFrame(delta);

  
    for (var i = 0, e; e = this.entities[i]; i++) {
      e.onFrame(delta);

     if(e.pos.y > this.player.pos.y+1000){
        e.dead = true;
        
      }
      if (e.dead) {

        this.entities.splice(i--, 1);
       // console.log(this.el.find("#"+e.id));
        e.kill();
      }
      if(e.readyToFire){
        e.fire();
       this.addLaser(new Laser({
            pos: {x: e.pos.x+e.direction*-1*24, y: e.pos.y+27},
            speed:190,
            direction:e.direction*-1,
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
    if(this.player.pos.y < this.currentMaxPlatformHeight+400){
      newX = (Math.random()*(this.viewport.width)+50)-150;
      newY = this.currentMaxPlatformHeight-(Math.random()*100+42);
      this.platformRandom = Math.random();

    this.addPlatform(new Platform({
      x: newX,
      y: newY,
      width: Math.floor((Math.random()*5)+3),
      height: 1,
      movingY: this.platformRandom > 0.7 && this.platformRandom < 0.8,
      movingX: this.platformRandom > 0.8 && this.platformRandom < 0.9, 
      id:this.currentId++
    }));
    
    if(this.platformRandom > 0.9){
     direction = 1;
     if(newX < 400){
      direction = -1;
     }
     this.addEnemy(new Enemy({
      x: newX,
      y: newY-70,
      direction: direction, 
      id:this.currentId++
    },this));
   }
    
    this.currentMaxPlatformHeight -= 100;

  }
     this.worldEl.css({
      left: -this.viewport.x,
      top: -this.viewport.y
    });
    
    this.middleBackground.css({
      left: -this.viewport.x/30,
      top: -this.viewport.y/50

    })
 
    // Request next frame.
 

}
   requestAnimFrame(this.onFrame);
    
  };


  Game.prototype.updateViewport = function() {
    var minY = this.viewport.y + VIEWPORT_PADDING;
    this.altitudeScore = Math.round(minY * (-1));
    if(minY < 0 && this.altitudeScore > this.oldScore+99)
    {

      this.oldScore = this.altitudeScore;

      this.scoreGain();
          
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
    this.Score = 0;
    this.scoreGain();
    this.scoreEl.css({
        left: 0,
        top: 0
        
      });   
    
    
    console.log("start!");
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