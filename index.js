"use strict";

enchant();

var CHARA_IMAGE_NAME = "http://enchantjs.com/assets/images/chara1.gif";
var KUMA_SCORE = 10;
var game = null;


var KumaSprite = Class.create(Sprite, {

    initialize: function() {
        Sprite.call(this, 32, 32);

        this.image = game.assets[CHARA_IMAGE_NAME];
        var deg = Math.random() * 360 * Math.PI / 180;
        this.vx = Math.cos(deg);
        this.vy = Math.sin(deg);
    },


    onenterframe: function() {

        this.moveBy(this.vx * 4, this.vy * 4);

        var left = 0;
        var right = game.width - this.width;
        var top = 0;
        var bottom = game.height - this.height;
        if (this.x < left) {
            this.x = left;
            this.vx *= -1;
        }
        if (this.x > right) {
            this.x = right;
            this.vx *= -1;
        }
        if (this.y < top) {
            this.y = top;
            this.vy *= -1;
        }
        if (this.y > bottom) {
            this.y = bottom;
            this.vy *= -1;
        }
    },


    ontouchstart: function() {
        this.parentNode.removeChild(this);
    }
});

var ScoreLabel = Class.create(Label, {
    initialize: function(options) {
        Label.call(this);

        this.color = 'white';
        this.font = "11px'Consolas','Monaco','MS ゴシック'";
        this.text = 'Score:';
        this.moveTo(options.x, options.y);
    },
    updateScore: function(score) {
        this.text = 'Score:' + game.score;
    }
});

var TimerLabel = Class.create(Label, {
    initialize: function(options) {
        Label.call(this);

        this.color = 'white';
        this.font = "11px'Consolas','Monaco','MS ゴシック'";
        this.text = 'Timer:';
        this.moveTo(options.x, options.y);
        this.updateTimeLeft(options.timeLeft);
    },
    updateTimeLeft: function(timeLeft) {
        this.text = "Timer:" + timeLeft;

        if (timeLeft < 10) {
            this.color = 'red';
        }
    }
});

var KumaGame = Class.create(Game, {
    initialize: function(options) {
        Game.call(this);

        this.preload(CHARA_IMAGE_NAME);
        this.fps = 30;
        this.frame = 0;
        this.score = 0;
        this.timeLimit = options.timeLimit;

        this.rootScene.backgroundColor = 'black';
    },
    scoreMessage: function() {
        return this.score + '点獲得しました!';
    }
});

window.onload = function() {
    game = new KumaGame({
        timeLimit: 30
    });

    game.onload = function() {
        var scene = game.rootScene;

        var scoreLabel = new ScoreLabel({
            x: 10,
            y: 10
        });
        scene.addChild(scoreLabel);

        var timerLabel = new TimerLabel({
            x: 250,
            y: 10,
            timeLeft: game.timeLimit
        });
        scene.addChild(timerLabel);

        scene.onenterframe = function() {
            scoreLabel.updateScore(game.score);

            var timeLeft = game.timeLimit - Math.floor(game.frame / game.fps);
            timerLabel.updateTimeLeft(timeLeft);

            if (timeLeft <= 0) {
                alert(game.scoreMessage());
                scene.onenterframe = null;
            }
        };


        for (var i = 0; i < 16; ++i) {
            var kuma = new KumaSprite();
            kuma.moveTo(Math.random() * (game.width - kuma.width), Math.random() * (game.height - kuma.height));
            scene.addChild(kuma);
        }
    };

    game.start();
};