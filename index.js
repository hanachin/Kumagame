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
        this.kumaNum = options.kumaNum;

        this.rootScene.backgroundColor = 'black';
    },
    scoreMessage: function() {
        return this.score + '点獲得しました!';
    },
    timeLeft: function() {
        return this.timeLimit - Math.floor(this.frame / this.fps);
    },
    isEnd: function() {
        return this.timeLeft() <= 0;
    },
    end: function() {
        alert(this.scoreMessage());
        this.rootScene.onenterframe = null;
    }
});

window.onload = function() {
    game = new KumaGame({
        timeLimit: 30,
        kumaNum: 16
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

            timerLabel.updateTimeLeft(game.timeLeft());

            if (game.isEnd()) {
                game.end();
            }
        };


        for (var i = 0; i < game.kumaNum; ++i) {
            var kuma = new KumaSprite();
            kuma.moveTo(Math.random() * (game.width - kuma.width), Math.random() * (game.height - kuma.height));
            scene.addChild(kuma);
        }
    };

    game.start();
};
