enchant();

var CHARA_IMAGE_NAME = "http://enchantjs.com/assets/images/chara1.gif";
var GAME_LIMIT_TIME = 30;
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

window.onload = function() {
    game = new Game();
    game.preload(CHARA_IMAGE_NAME);
    game.fps = 30;

    game.onload = function() {
        var scene = game.rootScene;
        scene.backgroundColor = "black";

        var scoreLabel = null;
        var timerLabel = null;

        game.frame = 0;
        game.score = 0;

        scoreLabel = new Label();
        scene.addChild(scoreLabel);
        scoreLabel.moveTo(10, 10);
        scoreLabel.color = "white";
        scoreLabel.font = "11px'Consolas','Monaco','MS ゴシック'";
        scoreLabel.text = "Score:";

        timerLabel = new Label();
        scene.addChild(timerLabel);
        timerLabel.moveTo(250, 10);
        timerLabel.color = "white";
        timerLabel.font = "11px'Consolas','Monaco','MS ゴシック'";
        timerLabel.text = "Timer:";

        scene.onenterframe = function() {

            scoreLabel.text = "Score:" + game.score;

            var time = GAME_LIMIT_TIME - Math.floor(game.frame / game.fps);
            timerLabel.text = "Timer:" + time;
            if (time < 10) {
                timerLabel.color = "red";
            }

            if (time <= 0) {
                var score = game.score;
                var message = game.score + "点獲得しました!";
                alert(score + ',' + message);
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