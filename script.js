document.getElementById("btnNo").style.transition =
  "transform 0.05s ease-in-out";
document.getElementById("btnNo").addEventListener("mouseover", function () {
  const nuevaX = Math.random() * 450 - 225;
  const nuevaY = Math.random() * -300 - 50;

  this.style.transform = `translate(${nuevaX}px, ${nuevaY}px)`;
});

document.getElementById("btnSi").addEventListener("click", function () {
  Swal.fire({
    position: "top-center",
    title: "Me alegras el dia Angelina🥰",
    showConfirmButton: false,
    timer: 1500,
  });

  var parrafo = document.querySelector("#cuadroDialogo p");
  parrafo.textContent = "Esto Continuara...";
  document.getElementById("btnNo").style.display = "none";

  window.requestAnimationFrame =
    window.__requestAnimationFrame ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function () {
      return function (callback, element) {
        var lastTime = element.__lastTime;
        if (lastTime === undefined) {
          lastTime = 0;
        }
        var currTime = Date.now();
        var timeToCall = Math.max(1, 33 - (currTime - lastTime));
        window.setTimeout(callback, timeToCall);
        element.__lastTime = currTime + timeToCall;
      };
    })();
  window.isDevice =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
    );
  var loaded = false;
  var init = function () {
    if (loaded) return;
    loaded = true;
    var mobile = window.isDevice;
    var koef = mobile ? 0.5 : 1;
    var canvas = document.getElementById("heart");
    var ctx = canvas.getContext("2d");
    var width = (canvas.width = koef * innerWidth);
    var height = (canvas.height = koef * innerHeight);
    var rand = Math.random;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    var heartPosition = function (rad) {
      //return [Math.sin(rad), Math.cos(rad)];
      return [
        Math.pow(Math.sin(rad), 3),
        -(
          15 * Math.cos(rad) -
          5 * Math.cos(2 * rad) -
          2 * Math.cos(3 * rad) -
          Math.cos(4 * rad)
        ),
      ];
    };
    var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
      return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    window.addEventListener("resize", function () {
      width = canvas.width = koef * innerWidth;
      height = canvas.height = koef * innerHeight;
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, width, height);
    });

    var traceCount = mobile ? 20 : 50;
    var pointsOrigin = [];
    var i;
    var dr = mobile ? 0.3 : 0.1;
    for (i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
    var heartPointsCount = pointsOrigin.length;

    var targetPoints = [];
    var pulse = function (kx, ky) {
      for (i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
      }
    };

    var e = [];
    for (i = 0; i < heartPointsCount; i++) {
      var x = rand() * width;
      var y = rand() * height;
      e[i] = {
        vx: 0,
        vy: 0,
        R: 2,
        speed: rand() + 5,
        q: ~~(rand() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * rand() + 0.7,
        f:
          "hsla(0," +
          ~~(40 * rand() + 60) +
          "%," +
          ~~(60 * rand() + 20) +
          "%,.3)",
        trace: [],
      };
      for (var k = 0; k < traceCount; k++) e[i].trace[k] = { x: x, y: y };
    }

    var config = {
      traceK: 0.4,
      timeDelta: 0.01,
    };

    var time = 0;
    var loop = function () {
      var n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += (Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * config.timeDelta;
      ctx.fillStyle = "rgba(0,0,0,.1)";
      ctx.fillRect(0, 0, width, height);
      for (i = e.length; i--; ) {
        var u = e[i];
        var q = targetPoints[u.q];
        var dx = u.trace[0].x - q[0];
        var dy = u.trace[0].y - q[1];
        var length = Math.sqrt(dx * dx + dy * dy);
        if (10 > length) {
          if (0.95 < rand()) {
            u.q = ~~(rand() * heartPointsCount);
          } else {
            if (0.99 < rand()) {
              u.D *= -1;
            }
            u.q += u.D;
            u.q %= heartPointsCount;
            if (0 > u.q) {
              u.q += heartPointsCount;
            }
          }
        }
        u.vx += (-dx / length) * u.speed;
        u.vy += (-dy / length) * u.speed;
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;
        u.vx *= u.force;
        u.vy *= u.force;
        for (k = 0; k < u.trace.length - 1; ) {
          var T = u.trace[k];
          var N = u.trace[++k];
          N.x -= config.traceK * (N.x - T.x);
          N.y -= config.traceK * (N.y - T.y);
        }
        ctx.fillStyle = u.f;
        for (k = 0; k < u.trace.length; k++) {
          ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
      }
      //ctx.fillStyle = "rgba(255,255,255,1)";
      //for (i = u.trace.length; i--;) ctx.fillRect(targetPoints[i][0], targetPoints[i][1], 2, 2);

      window.requestAnimationFrame(loop, canvas);
    };
    loop();
  };

  var s = document.readyState;
  if (s === "complete" || s === "loaded" || s === "interactive") init();
  else document.addEventListener("DOMContentLoaded", init, false);
});

document.getElementById("btnNo").addEventListener("click", function () {
  Swal.fire({
    imageUrl: "https://trneodavo.000webhostapp.com/meme/meme%20salvador.png",
    imageHeight: 350,
    imageAlt: "A tall image",
  });
});


	window.addEventListener("load",init,false);

	var x1,y1,x2,y2,radio;

	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");
	var cw, ch;
	var corazon = [];
	var randomX, randomY, randomV;
	var numeroCorazones;

	function init () {
		cw = canvas.width = window.innerWidth;
		ch = canvas.height = window.innerHeight;

		numeroCorazones = 20;

		for (var i = 0; i < numeroCorazones; i++) {

			randomX =Math.floor(Math.random()*cw+90);
			randomY =Math.floor(Math.random()*ch);
			randomV =Math.ceil(Math.random()*4);

			corazon[i] = {
				x: randomX, y:randomY,
				color:"rgba(255,0,100,0.8)",
				down:true, left:true,
				velocidad: randomV
			}
		};


		x1 = corazon.x, y1 = corazon.y;
		x2 = 0, y2 = 0;
		radio = 30;

		setInterval(main,30);
	}
	function main () {
		responsive();
		dibujarFondo();
		moverCorazon();
		dibujarCorazon();
		colisionCorazon();
	}
	function responsive () {
		cw = canvas.width = window.innerWidth;
		ch = canvas.height = window.innerHeight;
	}
	function dibujarFondo () {
		ctx.save();
		ctx.fillStyle = "#fff";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.restore();
	}
	function dibujarCorazon () {
		for (var i = 0; i < corazon.length; i++) {

			x1 = corazon[i].x, y1 = corazon[i].y;
			x2 = 0, y2 = 0;
			radio = 30;

			ctx.save();
			ctx.beginPath();
			ctx.fillStyle =  corazon[i].color;
			ctx.arc(x1,y1,radio,a_radianes(0),a_radianes(150),true);
			x2 = x1+radio, y2 = y1+90;
			ctx.lineTo(x2,y2);
			ctx.moveTo(x1+radio,y1);
			ctx.arc(x1+radio*2,y1,radio,a_radianes(180),a_radianes(30),false);
			ctx.lineTo(x2,y2);
			ctx.fill();
			ctx.restore();
		};
	}
	function moverCorazon () {
		for (var i = 0; i < corazon.length; i++) {
			if (corazon[i].down) {
				corazon[i].y+= corazon[i].velocidad;
				if (corazon[i].left) {
					corazon[i].x+= corazon[i].velocidad;
				}else{
					corazon[i].x-= corazon[i].velocidad;
				}
			}else{
				corazon[i].y-= corazon[i].velocidad;
				if (corazon[i].left) {
					corazon[i].x+= corazon[i].velocidad;
				}else{
					corazon[i].x-= corazon[i].velocidad;
				}
			}
		}
	}
	function colisionCorazon () {
		for (var i = 0; i < corazon.length; i++) {
			if (corazon[i].x+90 >= cw && corazon[i].left) {
				corazon[i].left = false;
			}
			else if(corazon[i].x-30 <= 0 && corazon[i].left != true){
				corazon[i].left = true;
			}

			if (corazon[i].y+90 >= ch && corazon[i].down) {
				corazon[i].down = false;
			}
			else if (corazon[i].y-30 <= 0 && corazon[i].down != true) {
				corazon[i].down =true;
			}
		}
	}

	function a_radianes (grados) {
		return (grados*Math.PI)/180;
	}