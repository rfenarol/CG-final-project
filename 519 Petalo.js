//ASSI
var X=0;
var Y=1;
var Z=2;

//COLORS
var black = [0,0,0];
var lightBlack = [0.2,0.2,0.2];
var grey = [0.85,0.85,0.85];
var glassBlue = [0,0.8,1,0.8];
var red = [1,0,0];
var green = [0,1,0]
var blue = [0,0,1];
var white = [1,1,1];
var orange = [1,0.6,0];
var darkRed = [0.8,0,0];
var brownWood = [207/255, 137/255, 87/255];

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

/*Function that takes as scale factors only positive values ​​greater than 1 to enlarge
and less than 1 to zoom out. With negative values ​​fore the figure on the opposite quadrant*/
function getScaledObject(scaleFactor, obj){
  obj = S([X,Y,Z])([scaleFactor,scaleFactor,scaleFactor])(obj);
  return obj;
}


/*Function that creates a half-sphere. It takes as parameters the radius, the domain, and the color.*/
function drawCup(r,color,domainCup) {
    var domain = domainCup;
    var mapping = function(p) {
        var u = p[0];
        var v = p[1];
        return [r*COS(u)*COS(v),r*COS(u)*SIN(v),r*SIN(u)];
    }
    var cup = MAP(mapping)(domain);
    return COLOR(color)(cup);
}

/*Function that given a point approaching all the control points of the controlpoints array to the given point */
function controlPointsReducer(point, controlPoints){
  var result = [];
  controlPoints.forEach(function(item){
    xpos = (point[0]+item[0])/2;
    ypos = (point[1]+item[1])/2;
    result.push([xpos,ypos,0]);
  });
  return result;
}

/*Function that given an array of points multiplies them all to a scale factor*/
function pointScale(controlPoints,scaleFactor){
  var result = [];
  controlPoints.forEach(function(item){
    xpos = item[0]*scaleFactor;
    ypos = item[1]*scaleFactor;
    zpos = item[2]*scaleFactor;
    result.push([xpos,ypos,zpos]);
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

/*Function to create a cylinder*/
function CYLINDER(dim){
  function CYLINDER0(intervals){
    var cylinder = DISK(dim[0])(intervals);
    cylinder = EXTRUDE([dim[1]])(cylinder);
    return cylinder;
  }
  return CYLINDER0;
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


function controlPointsAdjusterYZ(controls){
	var result = []
    controls.forEach(function(item){
    	item[0]=(item[0])/100;
        item[1]=(item[1])/100;
        item[1]=-item[1];
        item[2]=item[0];
        item[0]=0;
        result.push(item);
    });
    return result;
}

function annulus_sector (alpha, r, R) {
  var domain = DOMAIN([[0,alpha],[r,R]])([36,1]);
  var mapping = function (v) {
    var a = v[0];
    var r = v[1];
    return [r*COS(a), r*SIN(a)];
  }
  var model = MAP(mapping)(domain);
  return model;
}

function curveShifter(curve,dh,dv){
  var result = [];
  result.push(curve);
  curveh = pointTranslation(curve, 0, 0, -dh);
  result.push(curveh);
  curvevh  = pointTranslation(curve, 0, dv, -dh);
  result.push(curvevh);
  curvev = pointTranslation(curve, 0, dv, 0);
  result.push(curvev);
  return result;
}

function rectangularSurfaceFromCP(cp,dh,dv){
  var result = null;
  cp.forEach(function(item){
    var cp0 = [];
    var mappings = [];
    cp0 = curveShifter(item,dh,dv);
    cp0.forEach(function(item0){
      var mapc = BEZIER(S0)(item0);
      mappings.push(mapc);
    });
    if(result === null){
      result = bezierSurfaceInterpolator([[mappings[0],mappings[1]],[mappings[1],mappings[2]],[mappings[2],mappings[3]],[mappings[3],mappings[0]]]);  
    } else{
      result = STRUCT([result, bezierSurfaceInterpolator([[mappings[0],mappings[1]],[mappings[1],mappings[2]],[mappings[2],mappings[3]],[mappings[3],mappings[0]]])]);
    }
  });
  return result;
}

/******************UTILS******************/

//DOMAINS
var domain1D = INTERVALS(1)(36);
var domain2D = DOMAIN([[0,1],[0,1]])([36,36]);

/******************DESK******************/
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

DRAW(surface);
/******************DESK******************/

/******************FEET******************/
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

var footPart = CUBOID([0.1,0.02,0.01])
footPart = T([X,Y,Z])([-0.05,-0.1,-0.01])(footPart);
var foot = STRUCT([out1,out2,out3,out4,footPart]);
var foot1 = R([Y,Z])([PI/22.5])(foot);
foot1 = T([Y,Z])([0.02,0.02])(foot1);
var foot2 = R([Y,Z])([PI/22.5])(foot);
foot2 =  R([X,Z])([-2*(PI/3)])(foot2);
foot2 = T([X,Y,Z])([0.345,0.02,0.465])(foot2);
var foot3 = R([Y,Z])([PI/22.5])(foot);
foot3 = R([X,Z])([2*(PI/3)])(foot3);
foot3 = T([X,Y,Z])([-0.345,0.02,0.465])(foot3);


var feet = STRUCT([foot1,foot2,foot3]);
feet = COLOR(lightBlack)(feet);

/******************FEET******************/

var model = STRUCT([feet, surface]);

var rotationLeft = R([X,Z])(PI/4);
var scale = S([X,Y,Z])([0.8,0.8,0.8]);
var translDown = T([X,Y])([0.2,-0.06]);
var tranf = COMP([scale,rotationLeft,translDown]);
var model = STRUCT(REPLICA(5)([model,tranf]));

DRAW(model);



