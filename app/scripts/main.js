require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        eventemitter2: '../bower_components/eventemitter2/lib/eventemitter2'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['game', 'jquery'], function (Game) {
    'use strict';
    var game = new Game($('.game'));
    game.start();
});
