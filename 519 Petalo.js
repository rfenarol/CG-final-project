//ASSI
var X=0;
var Y=1;
var Z=2;

//COLORS

var lightBlack = [0.2,0.2,0.2];
var darkRed = [0.8,0,0];

/******************UTILS******************/
/*Function that translates all the points of an array of the amount indicated along the respective axis.*/
function pointTranslation(points, dx, dy, dz){
  var result = [];
  points.forEach(function(item){
    xpos = item[0]+dx;
    ypos = item[1]+dy;
    zpos = item[2]+dz
    result.push([xpos,ypos,zpos]);
  });
  return result;
}

/*Function that takes an array of bezier curves and interpolate them with a surface*/
function bezierSurfaceInterpolator(curve){
  var result = null;
  curve.forEach(function(item){
      var mappingFunc = BEZIER(S1)(item);
      var surface = MAP(mappingFunc)(domain2D);
      if(result === null)
        result = surface;
      else
        result = STRUCT([result,surface]);
    });
  return result;
}

/*Function that rotates all points of an array, the angle indicated on the axis indicated.*/
function pointRotation(points, degree, axis){
  var rm;
  if(axis===X)
    rm = [[1,0,0],[0,COS(degree),-SIN(degree)],[0,SIN(degree),COS(degree)]];
  if(axis===Y)
    rm = [[COS(degree),0,SIN(degree)],[0,1,0],[-SIN(degree),0,COS(degree)]];
  if(axis===Z)
    rm = [[COS(degree),-SIN(degree),0],[SIN(degree),COS(degree),0],[0,0,1]];
  return points.map(function(item){
      return prodottoMatVect(rm,item);
    });
}

/*Function that perform the product of a matrix and a vector.*/
function prodottoMatVect(mat, vect){
  var result = [];
  mat.forEach(function(item){
    result.push(item[0]*vect[0]+item[1]*vect[1]+item[2]*vect[2])
  });
  return result;
}

function controlPointsAdjusterXY(controls){
    var result = [];
    controls.forEach(function(item){
        item[0]=item[0]/100;
        item[1]=item[1]/100;
        item[1]=-item[1];
        result.push(item);
    });
    return result;
}

function controlPointsAdjusterXZ(controls){
	var result = []
   	controls.forEach(function(item){
    	item[0]=(item[0])/100;
        item[1]=(item[1])/100;
        item[2] = item[1];
        item[1]=0;
        result.push(item);
    });
    return result;
}

/******************UTILS******************/

//DOMAINS
var domain1D = INTERVALS(1)(36);
var domain2D = DOMAIN([[0,1],[0,1]])([36,36]);

/******************PLAN******************/
var controls0 = [[81,290,0],[35,291,0],[30,291,0],[54,260,0],[58,255,0],[76,238,0],[81,238,0]];
controls0 = controlPointsAdjusterXZ(controls0);
controls0 = pointTranslation(controls0, -0.81,0,-2.38);
var mapc0 = BEZIER(S0)(controls0);
var curve0 = MAP(mapc0)(domain1D);

var controls1 = pointRotation(controls0, PI, Z);
var mapc1 = BEZIER(S0)(controls1);
var curve1 = MAP(mapc1)(domain1D);

var controls2 = pointTranslation(controls0, 0,0.04,0);
var mapc2 = BEZIER(S0)(controls2);
var curve2 = MAP(mapc2)(domain1D);

var controls3 = pointTranslation(controls1, 0,0.04,0);
var mapc3 = BEZIER(S0)(controls3);
var curve3 = MAP(mapc3)(domain1D);

var surface = bezierSurfaceInterpolator([[mapc0,mapc1],[mapc2,mapc3],[mapc0,mapc2],[mapc1,mapc3]]);


var controls0 = [[76.5,238,0],[66,245,0],[46,264,0],[42.5,280.5,0]];
controls0 = controlPointsAdjusterXZ(controls0);
var mapc0 = BEZIER(S0)(controls0);
var curve0 = MAP(mapc0)(domain1D);

var controls2 = [[77.5,242,0],[65,248,0],[49,265,0],[44.5,280.5,0]];
controls2 = controlPointsAdjusterXZ(controls2);
var mapc2 = BEZIER(S0)(controls2);
var curve2 = MAP(mapc2)(domain1D);

var sur1 = CUBIC_HERMITE(S1)([mapc0,mapc2,[0,0.025,0],[0,-0.025,0]]);
var out1 = MAP(sur1)(domain2D);
var sur2 = CUBIC_HERMITE(S1)([mapc2,mapc0,[0,-0.025,0],[0,0.025,0]]);
var out2 = MAP(sur2)(domain2D);

var junction = STRUCT([out1,out2]);
junction = T([X,Y,Z])([-0.76-0.045, 0.015, -2.4+0.03])(junction);
var junction1 = R([X,Y])(-PI)(junction);
junction1 = T([Y])([0.03])(junction1);


var controls0 = [[49,287,0],[65,290.5,0],[93.5,290.5,0],[114.5,287,0]];
controls0 = controlPointsAdjusterXZ(controls0);
var mapc0 = BEZIER(S0)(controls0);
var curve0 = MAP(mapc0)(domain1D);

var controls2 = [[50,286,0],[69,288.5,0],[93.5,288.5,0],[113.5,286,0]];
controls2 = controlPointsAdjusterXZ(controls2);
var mapc2 = BEZIER(S0)(controls2);
var curve2 = MAP(mapc2)(domain1D);

var sur1 = CUBIC_HERMITE(S1)([mapc0,mapc2,[0,0.025,0],[0,-0.025,0]]);
var out1 = MAP(sur1)(domain2D);
var sur2 = CUBIC_HERMITE(S1)([mapc2,mapc0,[0,-0.025,0],[0,0.025,0]]);
var out2 = MAP(sur2)(domain2D);
var junction2 = STRUCT([out1,out2]);
junction2 = T([X,Y,Z])([-0.82,0.015,-2.361])(junction2);

var junctions = STRUCT([junction,junction1,junction2]);
junctions = COLOR(lightBlack)(junctions);

surface = COLOR(darkRed)(surface);
surface = STRUCT([surface,junctions]);

/******************PLAN******************/

/******************LEGS******************/
var controls0 = [[77,157,0],[78,184,0],[78,187,0],[82,187,0]];
controls0 = controlPointsAdjusterXY(controls0);
controls0 = pointTranslation(controls0, -0.82,1.57,0);
var mapc0 = BEZIER(S0)(controls0);
var curve0 = MAP(mapc0)(domain1D);

var controls1 = pointRotation(controls0, PI, Y);
var mapc1 = BEZIER(S0)(controls1);
var curve1 = MAP(mapc1)(domain1D);

var controls2 = [[79,157,0],[80,178,0],[80,185.5,0],[83,185.5,0]];
controls2 = controlPointsAdjusterXY(controls2);
controls2 = pointTranslation(controls2, -0.83,1.57,0);
var mapc2 = BEZIER(S0)(controls2);
var curve2 = MAP(mapc2)(domain1D);

var controls3 = pointRotation(controls2, PI, Y);
var mapc3 = BEZIER(S0)(controls3);
var curve3 = MAP(mapc3)(domain1D);


var sur1 = CUBIC_HERMITE(S1)([mapc0,mapc2,[0,0,0.025],[0,0,-0.025]]);
var out1 = MAP(sur1)(domain2D);
var sur2 = CUBIC_HERMITE(S1)([mapc1,mapc3,[0,0,0.025],[0,0,-0.025]]);
var out2 = MAP(sur2)(domain2D);
var sur3 = CUBIC_HERMITE(S1)([mapc0,mapc2,[0,0,-0.025],[0,0,0.025]]);
var out3 = MAP(sur3)(domain2D);
var sur4 = CUBIC_HERMITE(S1)([mapc1,mapc3,[0,0,-0.025],[0,0,0.025]]);
var out4 = MAP(sur4)(domain2D);

var legPart = CUBOID([0.1,0.02,0.01])
legPart = T([X,Y,Z])([-0.05,-0.1,-0.01])(legPart);
var leg = STRUCT([out1,out2,out3,out4,legPart]);
var leg1 = R([Y,Z])([PI/22.5])(leg);
leg1 = T([Y,Z])([0.02,0.02])(leg1);
var leg2 = R([Y,Z])([PI/22.5])(leg);
leg2 =  R([X,Z])([-2*(PI/3)])(leg2);
leg2 = T([X,Y,Z])([0.345,0.02,0.465])(leg2);
var leg3 = R([Y,Z])([PI/22.5])(leg);
leg3 = R([X,Z])([2*(PI/3)])(leg3);
leg3 = T([X,Y,Z])([-0.345,0.02,0.465])(leg3);


var legs = STRUCT([leg1,leg2,leg3]);
legs = COLOR(lightBlack)(legs);

/******************LEGS******************/

var model = STRUCT([legs, surface]);

var rotationLeft = R([X,Z])(PI/4);
var scale = S([X,Y,Z])([0.8,0.8,0.8]);
var translDown = T([X,Y])([0.2,-0.06]);
var tranf = COMP([scale,rotationLeft,translDown]);
var model = STRUCT(REPLICA(5)([model,tranf]));

model = T([X])([2])(model);
DRAW(model);



