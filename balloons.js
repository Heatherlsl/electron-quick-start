(function () {
  const canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  //初始化气泡数组
  var ballons = [];
  //定义气泡类型
  function Balloon(x, y) {
    this.x = x; //圆心x
    this.y = y; //圆心y
    this.r = 50; //半径
    this.color =
      `rgba(${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},0.8)`; //颜色
    this.vx = parseInt(Math.random() * 14 - 7); //x方向偏移速率
    this.vy = parseInt(Math.random() * 14 - 7); //y方向偏移速率
    ballons.push(this);
  }
  //绘制气泡
  Balloon.prototype.paint = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  //移动气泡
  Balloon.prototype.drift = function () {
    //移动前边界监测，矢量反转
    if (this.x - this.r <= 0 || this.x + this.r >= canvas.width)
      this.vx *= -1;
    if (this.y - this.r <= 0 || this.y + this.r >= canvas.height)
      this.vy *= -1;
    //移动
    this.x += this.vx;
    this.y += this.vy;
    //移动后边界监测
    if (this.x - this.r <= 0)
      this.x = this.r;
    if (this.x + this.r >= canvas.width)
      this.x = canvas.width - this.r;
    if (this.y - this.r <= 0)
      this.y = this.r;
    if (this.y + this.r >= canvas.height)
      this.y = canvas.height - this.r;
    if (!--this.r)
      this.die();
    //js中不存在这种方式 SyntaxError: invalid assignment left-hand side
    // this = null;
  }
  //消除气泡
  Balloon.prototype.die = function () {
    ballons.splice(ballons.indexOf(this), 1);
    //消失一个就生成一个，这样屏幕上的气泡数只增不少，越来越多很快会铺满屏幕
    // new Balloon(parseInt(Math.random() * canvas.width), parseInt(Math.random() * canvas.height));
  }

  //pc端跟踪鼠标移动生成气泡
  canvas.addEventListener('mousemove', function (event) {
    new Balloon(event.clientX, event.clientY);
  });
  //移动端跟踪手指移动事件
  canvas.addEventListener('touchmove', function (event) {
    event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
    var touch = event.targetTouches[0]; //获取当前元素上的触控点
    new Balloon(touch.clientX, touch.clientY);
  });


  //刷新页面方式一
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // //尾巴效果
    // ctx.fillStyle = 'rgba(255,255,255,0)'; //最后一位表示不透明度
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    ballons.forEach((ball, index) => {
      ball.drift();
      ball.paint();
    });
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);


  // //刷新页面方式二
  // function render() {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ballons.forEach((ball, index) => {
  //     ball.drift();
  //     ball.paint();
  //   });
  // }
  // setInterval(function () {
  //   render();
  // }, 20);


}());