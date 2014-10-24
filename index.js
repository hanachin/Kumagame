// forked from phi's "enchant.js - Sprite クラスを継承して独自のクラスを生成しよう" http://jsdo.it/phi/gidz
// forked from phi's "enchant.js - Sprite を表示しよう" http://jsdo.it/phi/kAKa
// forked from phi's "enchant.js - Entity を生成してSceneに追加しよう" http://jsdo.it/phi/tlgU
// forked from phi's "enchant.js のテンプレートを用意しよう" http://jsdo.it/phi/isoa
// おまじない(using namespace enchant)
enchant();

var CHARA_IMAGE_NAME = "http://enchantjs.com/assets/images/chara1.gif";
var GAME_LIMIT_TIME = 30;
var KUMA_SCORE = 10;
var game = null;

// クマクラス
var KumaSprite = Class.create(Sprite, {
    // 初期化
    initialize: function() {
	Sprite.call(this, 32, 32);	// 親クラスの初期化を忘れないように気をつけよう♪
	
	this.image = game.assets[CHARA_IMAGE_NAME];	// 画像をセット
	var deg = Math.random()*360*Math.PI/180;
	this.vx = Math.cos(deg);
	this.vy = Math.sin(deg);
    },
    
    // 更新処理
    onenterframe: function() {
	// 移動
	this.moveBy(this.vx*4, this.vy*4);
	
	var left = 0;
	var right = game.width-this.width;
	var top = 0;
	var bottom = game.height-this.height;
	if (this.x < left)   { this.x = left;   this.vx*=-1; }
	if (this.x > right)  { this.x = right;  this.vx*=-1; }
	if (this.y < top)    { this.y = top;    this.vy*=-1; }
	if (this.y > bottom) { this.y = bottom; this.vy*=-1; }
    },
    
    // タッチされたら消す
    ontouchstart: function() {
	this.parentNode.removeChild(this);
    }
});

window.onload = function() {
    game = new Game();
    game.preload(CHARA_IMAGE_NAME);	// 画像読み込み
    game.fps = 30;	// fsp を 60 に変更
    
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
	scoreLabel.font = "11px'Consolas','Monaco','MS ゴシック'",
	scoreLabel.text = "Score:"

	timerLabel = new Label();
	scene.addChild(timerLabel);
	timerLabel.moveTo(250,10);
	timerLabel.color = "white"
	timerLabel.font = "11px'Consolas','Monaco','MS ゴシック'",
	timerLabel.text = "Timer:";

	scene.onenterframe = function() {

	  scoreLabel.text = "Score:" + game.score;

	  var time = GAME_LIMIT_TIME - Math.floor(game.frame/game.fps);
	  timerLabel.text = "Timer:" + time;
	  if(time < 10) {
	  timerLabel.color = "red";
	}
	
	if(time <= 0) {
	var score = game.score;
	var message = game.score + "点獲得しました!";
	alert(score + ',' + message);
	scene.onenterframe = null;
	}
};

	// スプライト生成
	for (var i=0; i<16; ++i) {
	    var kuma = new KumaSprite();	// クマスプライト生成
	    kuma.moveTo( Math.random()*(game.width-kuma.width), Math.random()*(game.height-kuma.height) );
	    scene.addChild(kuma);		// シーンに追加
	}
    };
    
    game.start();
};
