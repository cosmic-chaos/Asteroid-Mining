var SPAGE_WIDTH=1347;
var SPAGE_HEIGHT=400;

var FPAGE_WIDTH=1347;
var FPAGE_HEIGHT=700;

var SUN_RADIUS=1391684/2;
var FCANVAS_SUN_RADIUS=1;
var SCANVAS_SUN_RADIUS=1;
var KM_IN_PIXEL;
var KM_IN_AU=149597871;

var EARTH_PERIHELION_KM=147090000;
var EARTH_APHELION_KM=152100000;
var EARTH_A_KM=149600000;
var EARTH_E=0.0167;

var EARTH_PERIHELION_PX;
var EARTH_APHELION_PX;
var EARTH_A_PX;

var name=getQueryVariable('name');
var a=Number(getQueryVariable('a'))*KM_IN_AU/KM_IN_PIXEL;
var e=Number(getQueryVariable('e'));
var i=Number(getQueryVariable('i'));
var q=Number(getQueryVariable('q'))*KM_IN_AU/KM_IN_PIXEL;
var Q=Number(getQueryVariable('Q'))*KM_IN_AU/KM_IN_PIXEL;

function recalculate(CANVAS_SUN_RADIUS){
	KM_IN_PIXEL=SUN_RADIUS/CANVAS_SUN_RADIUS;
	
	EARTH_PERIHELION_PX=EARTH_PERIHELION_KM/KM_IN_PIXEL;
	EARTH_APHELION_PX=EARTH_APHELION_KM/KM_IN_PIXEL;
	EARTH_A_PX=EARTH_A_KM/KM_IN_PIXEL;
	
	a=Number(getQueryVariable('a'))*KM_IN_AU/KM_IN_PIXEL;
	q=Number(getQueryVariable('q'))*KM_IN_AU/KM_IN_PIXEL;
	Q=Number(getQueryVariable('Q'))*KM_IN_AU/KM_IN_PIXEL;
}

function onLoad(){
	var i_text = document.getElementById("i-text");	
	i_text.innerHTML = i;
	
	frontview();
	sideview();
}

function findSemiMinorAxis(e,a){
	var x=a*Math.sqrt(1-Math.pow(e,2));
	return x;
}

function drawOrbit(ctx,cx, cy, w, h){
    ctx.beginPath();
    var lx = cx - w/2,
        rx = cx + w/2,
        ty = cy - h/2,
        by = cy + h/2;
    var magic = 0.551784;
    var xmagic = magic*w/2;
    var ymagic = h*magic/2;
    ctx.moveTo(cx,ty);
    ctx.bezierCurveTo(cx+xmagic,ty,rx,cy-ymagic,rx,cy);
    ctx.bezierCurveTo(rx,cy+ymagic,cx+xmagic,by,cx,by);
    ctx.bezierCurveTo(cx-xmagic,by,lx,cy+ymagic,lx,cy);
    ctx.bezierCurveTo(lx,cy-ymagic,cx-xmagic,ty,cx,ty);
    ctx.stroke();
}

function frontview(){
	recalculate(FCANVAS_SUN_RADIUS);
	var c=document.getElementById("frontview");
	var ctx=c.getContext("2d");
	
	ctx.strokeStyle="lightgrey";
	
	//draw earth orbit
	var earth_minor=findSemiMinorAxis(EARTH_E,EARTH_A_PX);
	drawOrbit(ctx,FPAGE_WIDTH/2,FPAGE_HEIGHT/2,EARTH_APHELION_PX+EARTH_PERIHELION_PX,earth_minor*2);
	text(ctx,FPAGE_WIDTH/2-30,FPAGE_HEIGHT/2-earth_minor+15,"Earth's Path","12")
	
	//draw sun
	ctx.beginPath();
	ctx.arc(FPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 +EARTH_APHELION_PX,FPAGE_HEIGHT/2,FCANVAS_SUN_RADIUS,0,2*Math.PI); 
	ctx.stroke();
	ctx.fillStyle="white";
	ctx.fill();
	
	//draw asteroid orbit
	var asteroid_minor=findSemiMinorAxis(e,a);
	
	if (i<1.5){
		starting=FPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 +EARTH_APHELION_PX-q+(q+Q)/2;
	} else {
		starting=FPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 +EARTH_APHELION_PX-Q+(q+Q)/2;
	}
		
	drawOrbit(ctx,starting, FPAGE_HEIGHT/2,q+Q,asteroid_minor*2);
	text(ctx,starting-30, FPAGE_HEIGHT/2+15+asteroid_minor,name+"'s Path","12")
}

function sideview(){
	recalculate(SCANVAS_SUN_RADIUS);
	var c=document.getElementById("sideview");
	var ctx=c.getContext("2d");
	
	//draw sun
	ctx.beginPath();
	ctx.arc(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 +EARTH_APHELION_PX,SPAGE_HEIGHT/2,SCANVAS_SUN_RADIUS,0,2*Math.PI);
	ctx.stroke();
	ctx.fillStyle="white";
	ctx.fill();
	
	//draw Earth path
	
	ctx.beginPath();
	ctx.lineWidth="1";
	ctx.strokeStyle="lightgrey";
	ctx.moveTo(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 ,SPAGE_HEIGHT/2);
	ctx.lineTo(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 +EARTH_APHELION_PX,SPAGE_HEIGHT/2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineWidth="1";
	ctx.strokeStyle="lightgrey";
	ctx.moveTo(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 ,SPAGE_HEIGHT/2);
	ctx.lineTo(SPAGE_WIDTH/2+EARTH_PERIHELION_PX,SPAGE_HEIGHT/2);
	ctx.stroke();
	text(ctx,SPAGE_WIDTH/2+EARTH_PERIHELION_PX-65,SPAGE_HEIGHT/2-5,"Earth's Path","12")
	
	//draw asteroid path
	ctx.beginPath();
	ctx.strokeStyle="white";
	ctx.moveTo(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 +EARTH_APHELION_PX,SPAGE_HEIGHT/2);
        ctx.lineTo(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2+EARTH_APHELION_PX + Q * Math.cos(i), SPAGE_HEIGHT/2 + Q * Math.sin(i));
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle="white";
	ctx.moveTo(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 +EARTH_APHELION_PX,SPAGE_HEIGHT/2);
        ctx.lineTo(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2+EARTH_APHELION_PX + q * Math.cos(Math.PI+i), SPAGE_HEIGHT/2 + q * Math.sin(Math.PI+i));
	ctx.stroke();
	text(ctx,SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2+EARTH_APHELION_PX + q * Math.cos(Math.PI+i),SPAGE_HEIGHT/2 + q * Math.sin(Math.PI+i)-5,name+"'s Path","12")
	
	//draw angles
	ctx.beginPath();
	ctx.strokeStyle="white";
	ctx.arc(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 +EARTH_APHELION_PX,SPAGE_HEIGHT/2,q/2,0,i);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle="white";
	ctx.arc(SPAGE_WIDTH/2-(EARTH_APHELION_PX+EARTH_PERIHELION_PX)/2 +EARTH_APHELION_PX,SPAGE_HEIGHT/2,q/2,Math.PI,Math.PI+i);
	ctx.stroke();
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('+');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

function text(ctx,x,y,text,size){
	ctx.beginPath();
	ctx.font=size+"px monospace";
	ctx.fillStyle="white";
	ctx.fillText(text,x,y);
	ctx.stroke();
}

function zoomInF(){
    FCANVAS_SUN_RADIUS=FCANVAS_SUN_RADIUS+.1;
    var c=document.getElementById("frontview");
    var ctx=c.getContext("2d");
    ctx.clearRect ( 0 , 0 , c.width, c.height );
    frontview();
}

function zoomOutF(){
    if (FCANVAS_SUN_RADIUS > .2){
        FCANVAS_SUN_RADIUS=FCANVAS_SUN_RADIUS-.1;
        var c=document.getElementById("frontview");
	var ctx=c.getContext("2d");
        ctx.clearRect ( 0 , 0 , c.width, c.height );
        frontview();
    }
}

function zoomInS(){
    SCANVAS_SUN_RADIUS=SCANVAS_SUN_RADIUS+.1;
    var c=document.getElementById("sideview");
    var ctx=c.getContext("2d");
    ctx.clearRect ( 0 , 0 , c.width, c.height );
    sideview();
}

function zoomOutS(){
    if (SCANVAS_SUN_RADIUS > .2){
        SCANVAS_SUN_RADIUS=SCANVAS_SUN_RADIUS-.1;
        var c=document.getElementById("sideview");
	var ctx=c.getContext("2d");
        ctx.clearRect ( 0 , 0 , c.width, c.height );
        sideview();
    }
}