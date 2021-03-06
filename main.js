﻿// -global ------------------------------------------------------------------------------------------------------------------------

var screenCanvas;
var run = true;
var fps = 1000 / 60;
var mouse = new Point();
var ctx;
var counter;
var creatF = false;
var prepLF = false;
var prepRF = false;
var fireLF = false;
var fireRF = false;
var lineLF = false;
var lineRF = false;
var kc;
var vector;
var length;
var lenAlt;
var radian;
var keyCode = new Array();
var e = 0.6;
var lastSpace = false;
var pauseF = false;
var collisionC = 0;

// -const -------------------------------------------------------------------------------------------------------------------------

var BALL_MAX_COUNT = 256;
var OBJECT_MAX_COUNT = 15;
var ARC       = 0.55228474983;
var GREEN  　　= "rgba(  0, 255,   0, 0.85)";//緑
var BLUE 　　= "rgba(  0,   0, 255, 0.60)";//青
var RED　　 = "rgba(255,   0,   0, 0.60)";//赤
var GRAY    　　= "rgba( 85,  85,  85, 0.75)";//グレー
var ORANGE = "rgba(255, 140,   0, 0.80)";//オレンジ
var DARK_RED    = "rgba(200,   0, 100, 0.80)";//暗赤



// -main --------------------------------------------------------------------------------------------------------------------------

//ページ読み込み時に起動するfunciton
window.onload = function(){

	//ローカル変数の定義
	var i, j;
	var p = new Point();
	var v = new Point();
	vector = new Point();


	//スクリーンの初期化
	screenCanvas = document.getElementById("screen");
	screenCanvas.width = 512;
	screenCanvas.height = 512;


	//2dコンテキスト
	ctx = screenCanvas.getContext("2d");


	//右クリックの禁止
	screenCanvas.addEventListener("contextmenu", function(e){
		e.preventDefault();
	 }, false);

	//イベントの登録
	screenCanvas.addEventListener("mousemove", mouseMove, true);
	screenCanvas.addEventListener("mousedown", mouseDown, true);
	screenCanvas.addEventListener("mouseup", mouseUp, true);
	window.addEventListener("keydown", keyDown, true);
	window.addEventListener("keyup", keyUp, true);


	//エレメント登録
	info = document.getElementById("info");


	//球初期化
	var ball = new Array(BALL_MAX_COUNT);
	for(i = 0; i <= BALL_MAX_COUNT; i++){
		ball[i] = new Character;
	};

	//壁初期化
	var object =new Array(OBJECT_MAX_COUNT);
	for(i = 0; i <= OBJECT_MAX_COUNT; i++){
		object[i] = new Object;
	};


	//自機初期化
	p.x = screenCanvas.width / 2;
	p.y = screenCanvas.height / 2 -15;
	v.x = 0;
	v.y = 0;
	ball[0].set(p, 15, v, 0);
	

	//レンダリング処理を呼び出す-----------------------------------------------------------------------------------------------

	(function(){
		if(keyCode[32] && !lastSpace) pauseF = !pauseF;
		if(!pauseF){
			//カcウンターの値を増やす
			counter ++;





			//入力による変更-------------------------------------------------------------------------------------------

			if(kc){
				//console.log("入力されたキーコードは " + kc)

				if(keyCode[67]) creatF = true;
				if(keyCode[65]) ball[0].velocity.x = -2;
				if(keyCode[87]) ball[0].velocity.y =  2;
				if(keyCode[68]) ball[0].velocity.x =  2;
				if(keyCode[83]) ball[0].velocity.x =  0;

				if(keyCode[39]) ball[0].position.x += 0.3;
				if(keyCode[37]) ball[0].position.x -= 0.3;

				if(keyCode[73]) fps = 1000 / 2 ;
				if(keyCode[79]) fps = 1000 / 20;
				if(keyCode[80]) fps = 1000 / 60;

			}


			if(!keyCode[65] && !keyCode[68]) ball[0].velocity.x *= 0.85;



			//フラグ管理-----------------------------------------------------------------------------------------------

			//他機生成
			if(creatF){
				for(i = 0; i < BALL_MAX_COUNT; i++){
					if(!ball[i].alive){
						p.x = mouse.x;
						p.y = mouse.y;
						v.x = 0;
						v.y = 0;
						var s = 10//Math.floor(Math.random() * 4) + 6;
						var c = Math.floor(Math.random() * 2) + 1;
						ball[i].set(p, s, v, c);
						creatF = false;
						break;
					}
				}
			}
			
			ball[i].collisionC = 0;

//test
object[0].set(   0, 497, 512, 316, 0, 0, 3);
object[1].set(-300,-300, 300, 797, 0, 0, 3);
object[2].set( 512,-300, 300, 797, 0, 0, 3);
object[3].set(  60, 458, 100,  10, Math.PI / 15, 0, 0);
object[4].set( 100, 228,  80,  80, Math.PI / 8,  0, 1);
object[5].set( 270, 350, 170,  75, 0,            0, 2);
object[6].set( 360,  40,  30, 300, 0.1,          0, 3);


			//点線フラグ
			if(prepLF) lineLF = true;
			if(prepRF) lineRF = true;

			//青球発射
			if(fireLF){
				for(i = 1; i < BALL_MAX_COUNT; i++){
					if(!ball[i].alive && ball[0].weight > 225){
						ball[i].color = 1;
						ball[i].shoot(ball[0]);
						break;
					}
				}
				prepLF = false;
				fireLF = false;
				lineLF = false;
			}

			//赤球発射
			if(fireRF){
				for(i = 1; i < BALL_MAX_COUNT; i++){
					if(!ball[i].alive && ball[0].weight > 225){
						ball[i].color = 2;
						ball[i].shoot(ball[0]);
						break;
					}
				}
				prepRF = false;
				fireRF = false;
				lineRF = false;
			}

			//物体の動きを制御-----------------------------------------------------------------------------------------

			for(i = 0; i < BALL_MAX_COUNT; i++){
				if(ball[i].alive){
					//重力を反映
					ball[i].fall();
					//速度を位置情報に変換
					ball[i].move();
					//衝突カウンターと接点、歪フラグを初期化
					ball[i].collisionC = 0;
					for(j=0; j<=7; j++){
						ball[i].contact[j].x = 0;
						ball[i].contact[j].y = 0;
						ball[i].distortionF = false;
					}
				}
			}

			//ボール同士の衝突、結合
			for(i = 0; i < BALL_MAX_COUNT; i++){
				for(j = i + 1; j < BALL_MAX_COUNT; j++){
					if(ball[i].alive && ball[j].alive){
						p = ball[j].position.distance(ball[i].position);
						if( (p.length() < ball[j].size + ball[i].size) && (ball[i].color + ball[j].color == 3|| !i && ball[0].size < ball[j].size + 1) ){
							//ボールのめり込んだ位置関係を元に戻す
							ball[j].positionCorrect(ball[i]);
							//ボールの衝突後の速度を求める
							ball[j].collisionCalculate(ball[i]);
							collisionF = true;
						}
						else if( p.length() < ball[j].size + ball[i].size - 2 && ball[i].color + ball[j].color != 3){
							if(!i && ball[0].size < ball[j].size + 1){
								break;
							}
							//ボール同士を結合する
							ball[j].absorptionCalculate(ball[i]);
							collisionF = true;
						}
					}
				}
			}

			//壁との衝突
			for(i = 0; i < BALL_MAX_COUNT; i++){
				if(ball[i].alive){
					for(j = 0; j < OBJECT_MAX_COUNT; j++){
						if(ball[i].color != object[j].color){
							object[j].collision(ball[i]);
							collisionF = true;
						}
					}
				}
			};


			//自機とマウス位置の相対ベクトル(vector)、距離(length)、角度(radian)をそれぞれ計算する
			vector.x =   mouse.x - ball[0].position.x;
			vector.y = -(mouse.y - ball[0].position.y);
			length = ball[0].position.distance(mouse).length() - ball[0].size;
			radian = Math.atan2(vector.y, vector.x);

			if(keyCode[16]){
				var n = Math.round(Math.atan2(vector.y, vector.x) * 4 / Math.PI);
				radian = n / 4 * Math.PI;
				switch(n % 4){
					case 0:
						length = Math.abs(mouse.x - ball[0].position.x);
						break;

					case 1:
						length = Math.abs(Math.sqrt(1 / 2) * (vector.x + vector.y))
						break;

					case 2:
						length = Math.abs(mouse.y - ball[0].position.y);
						break;

					default:
						length = Math.abs(Math.sqrt(1 / 2) * (vector.x - vector.y))
						break;
				}
			}

			if(length >= 280) length = 280;
		};

		lastSpace = keyCode[32];

console.log(ball[0].collisionC)

		//画面の描画を行う-------------------------------------------------------------------------------------------------


		//スクリーンクリア
		ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

		//背景の描画-------------------------------------------------

		//壁の描画
		for(i = 0;i <= OBJECT_MAX_COUNT; i++){
			if(object[i].alive){
				switch (object[i].color){
				case 0:
					ctx.fillStyle = GREEN;
					break;
				case 1:
					ctx.fillStyle = BLUE;
					break;
				case 2:
					ctx.fillStyle = RED;
					break;
				default:
					ctx.fillStyle = GRAY;
				}
				object[i].draw();
			}
		};

		//動体の描画-------------------------------------------------
		
		//ボールのひずみを計算する
		if(ball[0].collisionC == 3){
			var contact = new Array(3);
			x1=ball[0].contact[0].x;
			y1=ball[0].contact[0].y;
			x2=ball[0].contact[1].x;
			y2=ball[0].contact[1].y;
			x3=ball[0].contact[2].x;
			y3=ball[0].contact[2].y;

			var circumx=((y1-y3)*(y1*y1-y2*y2+x1*x1-x2*x2)-(y1-y2)*(y1*y1-y3*y3+x1*x1-x3*x3))/(2*(y1-y3)*(x1-x2)-2*(y1-y2)*(x1-x3));
			var circumy=((x1-x3)*(x1*x1-x2*x2+y1*y1-y2*y2)-(x1-x2)*(x1*x1-x3*x3+y1*y1-y3*y3))/(2*(x1-x3)*(y1-y2)-2*(x1-x2)*(y1-y3));
			ball[0].contact[0].rad = Math.atan2(y1-circumy, x1-circumx);
			ball[0].contact[1].rad = Math.atan2(y2-circumy, x2-circumx);
			ball[0].contact[2].rad = Math.atan2(y3-circumy, x3-circumx);
			for(i=0; i<=2; i++){
				for(j=2; j>i; j--){
					if(ball[0].contact[j-1].rad > ball[0].contact[j].rad){
						ball[0].contact[7]= ball[0].contact[j];
						ball[0].contact[j] = ball[0].contact[j-1];
						ball[0].contact[j-1] = ball[0].contact[7];
						}
					}
				}
			var rad1_2 = (ball[0].contact[1].rad-ball[0].contact[0].rad+2*Math.PI) % (2*Math.PI);
			var rad2_3 = (ball[0].contact[2].rad-ball[0].contact[1].rad+2*Math.PI) % (2*Math.PI);
			var rad3_1 = (ball[0].contact[0].rad-ball[0].contact[2].rad+2*Math.PI) % (2*Math.PI);
			var r = Math.sqrt((x1-circumx)*(x1-circumx)+(y1-circumy)*(y1-circumy));
			var arc1 = 4*Math.tan(rad1_2/4)/3*ball[0].size*ball[0].size/r;
			var arc2 = 4*Math.tan(rad2_3/4)/3*ball[0].size*ball[0].size/r;
			var arc3 = 4*Math.tan(rad3_1/4)/3*ball[0].size*ball[0].size/r;
			if(r/ball[0].size > 0.85){
				ctx.beginPath()
				ctx.moveTo(ball[0].contact[0].x, ball[0].contact[0].y);
				ctx.bezierCurveTo(ball[0].contact[0].x-arc1*Math.sin(ball[0].contact[0].rad), ball[0].contact[0].y+arc1*Math.cos(ball[0].contact[0].rad), ball[0].contact[1].x+arc1*Math.sin(ball[0].contact[1].rad), ball[0].contact[1].y-arc1*Math.cos(ball[0].contact[1].rad), ball[0].contact[1].x, ball[0].contact[1].y);
				ctx.bezierCurveTo(ball[0].contact[1].x-arc2*Math.sin(ball[0].contact[1].rad), ball[0].contact[1].y+arc2*Math.cos(ball[0].contact[1].rad), ball[0].contact[2].x+arc2*Math.sin(ball[0].contact[2].rad), ball[0].contact[2].y-arc2*Math.cos(ball[0].contact[2].rad), ball[0].contact[2].x, ball[0].contact[2].y);
				ctx.bezierCurveTo(ball[0].contact[2].x-arc3*Math.sin(ball[0].contact[2].rad), ball[0].contact[2].y+arc3*Math.cos(ball[0].contact[2].rad), ball[0].contact[0].x+arc3*Math.sin(ball[0].contact[0].rad), ball[0].contact[0].y-arc3*Math.cos(ball[0].contact[0].rad), ball[0].contact[0].x, ball[0].contact[0].y);
				ctx.fillStyle = GREEN;
				ctx.fill();
				ball[0].distortionF = true;
				ball[0].position.x = circumx;
				ball[0].position.y = circumy;
			}
			else{
				ball[0].alive = false;
				var amount = Math.floor((Math.random()*3) + 4);
				for(i=BALL_MAX_COUNT; i >= BALL_MAX_COUNT - amount; i--){
					ball[i].size = Math.random()*3+Math.sqrt(ball[0].weight/amount)-2
					ball[i].velocity.x = Math.random()*3 + 2;
					ball[i].velocity.y = Math.random()*3 + 2;
					ball[i].set(ball[0].position, ball[i].size, ball[i].velocity, Math.ceil(Math.random()*2));
				}
			}
		}

		//球の描写
		for(i=0; i<BALL_MAX_COUNT; i++){
			if(ball[i].alive　&& !ball[i].distortionF){
				switch(ball[i].color){
					case 0:
					ctx.fillStyle = GREEN;
					break;
			
					case 1:
					ctx.fillStyle = BLUE;
					break;
			
					case 2:
					ctx.fillStyle = RED;
					break;
					
					default:
					ctx.fillStyle = GRAY;
				}
				ctx.beginPath();
				ctx.arc(ball[i].position.x, ball[i].position.y, ball[i].size, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
			}
		}

		//マウスの現在地の描画
		var mx = ball[0].position.x + vector.x;
		var my = ball[0].position.y - vector.y;

		ctx.beginPath();
		ctx.moveTo(mx, my - 15);
		ctx.lineTo(mx + 15, my);
		ctx.lineTo(mx, my + 15);
		ctx.lineTo(mx - 15, my);
		ctx.closePath();
		ctx.arc(mx, my, 10, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.arc(mx, my, 4, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = GREEN;
		ctx.fill();
 
		//点線の描画
		if(lineLF && (ball[0].size + 19 < length)){
 		DOTTED_LINE_COLOR = BLUE;
			ball[0].strokeDottedLine();
		}

		if(lineRF && (ball[0].size + 19 < length)){
 		DOTTED_LINE_COLOR = RED;
			ball[0].strokeDottedLine();
		}

		if(pauseF){
			ctx.beginPath();
			ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2, true);
			ctx.fillStyle = "rgba(  0,   0, 000, 0.5)";
			ctx.fill();
			}

		if(pauseF){
			ctx.fillStyle = DARK_RED;
			ctx.font = "60px 'MSゴシック'"
			ctx.fillText("PAUSE", screenCanvas.width / 2 - 94, screenCanvas.height / 3);
		}








		//その他の設定----------------------------------------------------------------------------------------------------
		//キーコード初期化
		//kc = null;

		//HTMLを更新
		info.innerHTML = "PLAYER WEIGHT: " + ball[0].weight +
				 "<br>PLAYER SIZE &nbsp;&nbsp;&nbsp;&nbsp;:" + ball[0].size




		//フラグにより再起呼び出し-----------------------------------------------------------------------------------------
		if(run){setTimeout(arguments.callee, fps);}
	})();
};




// -event--------------------------------------------------------------------------------------------------------------------------

var mouseMove = function(e){
	//マウスカーソルの座標の更新
	mouse.x = e.clientX - screenCanvas.offsetLeft;
	mouse.y = e.clientY - screenCanvas.offsetTop;
};

var keyDown = function(e){
	kc = e.keyCode;
	keyCode[kc] = true;
	if(keyCode[27]) run = false;
};

var keyUp = function(e){
	keyCode[e.keyCode] = false;
};

var mouseDown = function(e){
	if(e.button == 0) prepLF = true;
	if(e.button == 2) prepRF = true;
};

var mouseUp = function(e){
	if(e.button == 0) fireLF = true;
	if(e.button == 2) fireRF = true;
};
window.onblur = function (){

	// 配列をクリアする
	keyCode.length = 0;
};