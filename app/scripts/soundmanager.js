define(['Howler'], function(howler) {

	



	var SoundManager = function() {




		this.swing1 = new howler.Howl({
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

        this.shieldhit = new howler.Howl({
    urls: ['/sounds/shieldhit.mp3', '/sounds/shieldhit.ogg']  
    });

        this.deflectsound = new howler.Howl({
    urls: ['/sounds/deflect.mp3', '/sounds/deflect.ogg']  
    });
            this.blaster1 = new howler.Howl({
    urls: ['/sounds/blaster1.mp3', '/sounds/blaster1.ogg']  
    });

        this.gameoversound = new howler.Howl({
    urls: ['/sounds/vader.mp3', '/sounds/vader.ogg']  
    });

          this.blasterhitsound = new howler.Howl({
    urls: ['/sounds/blasterhit.mp3', '/sounds/blasterhit.ogg']  
    });



	};

	return SoundManager;
});