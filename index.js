"use strict";

enchant();

var KumaSprite = Class.create(Sprite, {
    initialize: function(options) {
        Sprite.call(this, 32, 32);

        this.image = options.image;
        var deg = Math.random() * 360 * Math.PI / 180;
        this.vx = Math.cos(deg);
        this.vy = Math.sin(deg);
    },

    onenterframe: function() {
        this.moveBy(this.vx * 4, this.vy * 4);

        var left = 0;
        var right = this.parentNode.width - this.width;
        var top = 0;
        var bottom = this.parentNode.height - this.height;
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
KumaSprite.CHARA_IMAGE_NAME = "http://enchantjs.com/assets/images/chara1.gif";
KumaSprite.KUMA_SCORE = 10;

var ScoreLabel = Class.create(Label, {
    initialize: function(options) {
        Label.call(this);

        this.color = 'white';
        this.font = "11px'Consolas','Monaco','MS ゴシック'";
        this.moveTo(options.x, options.y);
        this.score = options.score;
        this.updateScore();
    },
    onenterframe: function() {
        this.updateScore();
    },
    updateScore: function() {
        this.text = 'Score:' + this.score();
    }
});

var TimerLabel = Class.create(Label, {
    initialize: function(options) {
        Label.call(this);

        this.color = 'white';
        this.font = "11px'Consolas','Monaco','MS ゴシック'";
        this.text = 'Timer:';
        this.moveTo(options.x, options.y);
        this.timeLeft = options.timeLeft

        this.updateTimeLeft();
    },
    onenterframe: function() {
        this.updateTimeLeft();
    },
    updateTimeLeft: function() {
        this.text = "Timer:" + this.timeLeft();

        if (this.timeLeft() < 10) {
            this.color = 'red';
        }
    }
});

var KumaGame = Class.create(Game, {
    initialize: function(options) {
        Game.call(this);

        this.preload(KumaSprite.CHARA_IMAGE_NAME);
        this.fps = 30;
        this.frame = 0;
        this.score = 0;
        this.timeLimit = options.timeLimit;
        this.kumaNum = options.kumaNum;
    },
    scoreMessage: function() {
        return this.score + '点獲得しました!';
    },
    timeLeft: function() {
        var timeLeft = this.timeLimit - Math.floor(this.frame / this.fps);

        if (timeLeft > 0) {
            return timeLeft;
        } else {
            return 0;
        }
    },
    isEnd: function() {
        return this.timeLeft() <= 0;
    },
    end: function() {
        alert(this.scoreMessage());
        this.rootScene.onenterframe = null;
    },
    onload: function() {
        var game = this;
        var scene = this.rootScene;

        scene.backgroundColor = 'black';

        this.initScoreLabel();
        scene.addChild(this.scoreLabel);

        this.initTimerLabel();
        scene.addChild(this.timerLabel);

        for (var i = 0; i < this.kumaNum; ++i) {
            scene.addChild(this.createKuma());
        }

        scene.onenterframe = function() {
            if (game.isEnd()) {
                game.end();
            }
        };
    },
    initScoreLabel: function() {
        var self = this;
        this.scoreLabel = new ScoreLabel({
            x: 10,
            y: 10,
            score: function() {
                return self.score;
            }
        });
    },
    initTimerLabel: function() {
        var self = this;
        this.timerLabel = new TimerLabel({
            x: 250,
            y: 10,
            timeLeft: function() {
                return self.timeLeft();
            }
        });
    },
    createKuma: function() {
        var kuma = new KumaSprite({
            image: this.assets[KumaSprite.CHARA_IMAGE_NAME]
        });
        kuma.moveTo(Math.random() * (this.width - kuma.width), Math.random() * (this.height - kuma.height));
        return kuma;
    }
});

window.onload = function() {
    var game = new KumaGame({
        timeLimit: 30,
        kumaNum: 16
    });

    game.start();
};