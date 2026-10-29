/* Layered character animation. All layers use the generated likeness asset. */
(function () {
  'use strict';
  const paths = {
    body: [[410,1024],[414,951],[432,852],[369,745],[360,658],[393,542],[592,421],[600,285],[601,155],[652,45],[803,14],[884,66],[930,154],[905,316],[887,403],[1095,511],[1137,586],[1176,716],[1113,848],[1120,929],[1105,1024]],
    left: [[0,439],[299,439],[320,639],[362,708],[432,844],[420,928],[374,986],[288,984],[208,901],[145,784],[161,695],[100,632],[0,615]],
    right: [[1219,346],[1536,346],[1536,628],[1426,661],[1383,802],[1318,920],[1255,981],[1180,979],[1114,921],[1108,849],[1171,724],[1216,654]]
  };
  function layer(ctx, img, points, angle, pivot, dy) {
    ctx.save();
    if (pivot) { ctx.translate(pivot[0],pivot[1]+dy);ctx.rotate(angle);ctx.translate(-pivot[0],-pivot[1]); }
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.clip();
    ctx.drawImage(img,0,0,1536,1024);ctx.restore();
  }
  window.YuraDance = class {
    constructor(canvas) { this.canvas=canvas;this.ctx=canvas.getContext('2d');this.img=new Image();this.img.src='assets/yura.png';this.running=false;this.frame=0;this.reduce=matchMedia('(prefers-reduced-motion: reduce)').matches; }
    start() { if(this.running)return;this.running=true;this.startAt=performance.now();this.tick(); }
    stop() {this.running=false;cancelAnimationFrame(this.frame);}
    tick = () => {
      if(!this.running)return;
      const t=(performance.now()-this.startAt)/1000;
      const c=this.ctx;c.clearRect(0,0,1536,1024);
      if(this.img.complete&&this.img.naturalWidth){
        c.save();c.translate(77,102);c.scale(.9,.9);c.translate(0,this.reduce?0:Math.sin(t*3.2)*3);
        const wave=this.reduce?0:Math.sin(t*Math.PI*2/1.32);
        layer(c,this.img,paths.left,wave*.13,[385,893],-wave*12);
        layer(c,this.img,paths.right,wave*.13,[1200,888],wave*12);
        layer(c,this.img,paths.body,0,null,0);c.restore();
      }
      this.frame=requestAnimationFrame(this.tick);
    };
  };
  window.Confetti = class {
    constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.running=false;this.frame=0;this.bits=[];this.reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;}
    start(){if(this.running||this.reduce)return;this.running=true;this.canvas.width=innerWidth;this.canvas.height=innerHeight;this.bits=Array.from({length:64},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight-innerHeight,w:3+Math.random()*4,s:20+Math.random()*45,r:Math.random()*6,c:['#deb66e','#d48191','#f3dfaa','#668c86'][Math.floor(Math.random()*4)]}));this.prev=performance.now();this.tick();}
    stop(){this.running=false;cancelAnimationFrame(this.frame);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
    tick=()=>{if(!this.running)return;const now=performance.now(),dt=Math.min((now-this.prev)/1000,.05);this.prev=now;const c=this.ctx;c.clearRect(0,0,this.canvas.width,this.canvas.height);for(const b of this.bits){b.y+=b.s*dt;b.x+=Math.sin(b.y/70+b.r)*dt*12;if(b.y>this.canvas.height+20)b.y=-20;c.save();c.translate(b.x,b.y);c.rotate(b.r+b.y*.008);c.fillStyle=b.c;c.fillRect(-b.w/2,-b.w/2,b.w,b.w*1.8);c.restore();}this.frame=requestAnimationFrame(this.tick);};
  };
})();
