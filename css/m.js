var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
    allSpeedLines = selectAll('.speedLines line'),
    tailColor = select('.tailColor'),
    burnupStop = select('.burnupStop'),
    tailGradOffset = select('.tailGradOffset'),
    ball = select('.ball'),
    tail = select('.tail'),
    burnup = select('.burnup'),
    wholeBall = select('.wholeBall'),
    ballShake = select('.ballShake'),
    lineColorsArr = ['#A9E5BB', '#FCF6B1','#F72C25','#F7B32B'],
    tailColorsArr = ['#F72C25','#A9E5BB', '#FCF6B1','#F72C25','#F7B32B', '#00a9e5'],
    burnupColorsArr = ['#F72C25','#F72C25', '#FBEB22', '#FBEB22', '#FBEB22', '#FFF', '#FFF', '#FFF']
  
//console.log(allSpeedLines.length)
TweenMax.set('svg', {
  visibility: 'visible'
})

TweenMax.set(allSpeedLines, {
 drawSVG:'0% 0%'
})

TweenMax.set(ballShake, {
  transformOrigin:'50% 50%'
})
CustomWiggle.create("ballDrop", {wiggles:60, type:"random"});

var gradShakeTl = new TimelineMax({repeat:-1});
var burnupTl = new TimelineMax({repeat:-1});
var ballPatternXTl = new TimelineMax({repeat:-1, yoyo:false}).timeScale(2);
var ballPatternYTl = new TimelineMax({repeat:-1, yoyo:false}).timeScale(2.82);
var ballShakeTl = new TimelineMax({repeat:-1, onUpdate:function(){
 tailColor.setAttribute('stop-color', tailColorsArr[Math.floor(Math.random() * tailColorsArr.length)])
 burnupStop.setAttribute('stop-color', burnupColorsArr[Math.floor(Math.random() * burnupColorsArr.length)])
 burnupStop.setAttribute('stop-opacity', Math.random())
}});
var ballTl = new TimelineMax({repeat:-1, yoyo:true});
var linesTl = new TimelineMax({repeat:-1});
ballShakeTl.to(ballShake, 1, {
 y:'-=5', 
 scale:1.02,
 ease:'ballDrop'
})
gradShakeTl.to(tailGradOffset, 2, {
 attr:{
  offset:0
 },
 ease:'ballDrop'
})
burnupTl.to(burnup, 2, {
 attr:{
  rx:23
 },
 ease:'ballDrop'
})

ballTl.to(wholeBall, 2, {
 y:73,
 ease:Sine.easeInOut
})
.to(wholeBall, 4, {
 y:-70,
 ease:Sine.easeInOut
},'+=3')
.to(wholeBall, 8, {
 y:110,
 ease:Sine.easeInOut
})
.to(wholeBall, 6, {
 y:0,
 ease:Sine.easeInOut
})

ballPatternYTl.to('#asteroidPattern', 1.05, {
 attr:{
  x:'-=18'
 },
 ease:Linear.easeNone 
})
                  
ballPatternXTl.to('#asteroidPattern', 0.87, {
 attr:{
  y:'-=18'
 },
 ease:Linear.easeNone
})

function makeLines(){
 var tl, line, dur;
 for(var i = 0; i < allSpeedLines.length; i++){
  tl = new TimelineMax({repeat:-1, repeatDelay:randomBetween(6, 19)});
  line = allSpeedLines[i];
  dur = randomBetween(20, 40)/10;
  line.setAttribute('stroke', lineColorsArr[i%lineColorsArr.length]);
  tl.to(line, dur, {
   drawSVG:'0% 60%',
   ease:Linear.easeNone
  })
  .to(line, dur, {
   drawSVG:'100% 100%',
   ease:Linear.easeNone
  })
  .to(line, dur*2, {
   y:'-=200'
  },'-=' + dur*2)
  tl.timeScale(randomBetween(20, 50)/10)
  linesTl.add(tl, i/1.3)
 }
}


makeLines();

linesTl.timeScale(8);
linesTl.seek(200);
var mainTl = new TimelineMax();
mainTl.add([gradShakeTl,ballShakeTl,ballTl,linesTl],0)


function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}  