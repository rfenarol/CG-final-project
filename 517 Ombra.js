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

//MEASURES
var footlenght = 0.79;
var feetDistance = 0.67;
var supportsDistance = 0.57;

/******************FEET******************/
var controls0 = [[86,110,0],[95,110,0],[90,112,0],[103,101,0]];
controls0 = controlPointsAdjusterXY(controls0);
var mapc0 = BEZIER(S0)(controls0);
var curve0 = MAP(mapc0)(domain1D);

var controls1 = [[103,101,0],[118,89,0],[108,91,0],[132,91,0]];
controls1 = controlPointsAdjusterXY(controls1);
var mapc1 = BEZIER(S0)(controls1);
var curve1 = MAP(mapc1)(domain1D);

var controls2 = [[132,91,0],[156,91,0],[150,90,0],[156,101,0]];
controls2 = controlPointsAdjusterXY(controls2);
var mapc2 = BEZIER(S0)(controls2);
var curve2 = MAP(mapc2)(domain1D);

var controls3 = [[156,101,0],[162,112,0],[158,110,0],[165,110,0]];
controls3 = controlPointsAdjusterXY(controls3);
var mapc3 = BEZIER(S0)(controls3);
var curve3 = MAP(mapc3)(domain1D);

var foot = rectangularSurfaceFromCP([controls0,controls1,controls2,controls3],-0.1,0.01);
foot = T([X,Y])([-0.86,1.10])(foot);
var cap = CUBOID([0.01,0.01,0.1]);
var cap1 = T([X])([footlenght])(cap);
foot = STRUCT([foot,cap,cap1]);

var foot1 = T([Z])([feetDistance])(foot);

var feet = STRUCT([foot,foot1]);
DRAW(feet);
/******************FEET******************/

/******************SUPPORT******************/
var verticalSupport = CUBOID([0.01,0.35,0.1]);
var verticalSupport1 = T([Z])([supportsDistance])(verticalSupport);
var part1 = CUBOID([0.01,0.12,supportsDistance]);
part1 = T([Y])([0.23])(part1);
var horizontalSupport = CUBOID([0.72,0.01,0.1]);
var horizontalSupport1 = T([Z])([supportsDistance])(horizontalSupport);
var part2 = CUBOID([0.10,0.01,supportsDistance]);
part2 = T([X])([0.62])(part2);

var support = STRUCT([verticalSupport,verticalSupport1,part1,horizontalSupport,horizontalSupport1,part2]);
support = T([X,Y,Z])([0.05,0.20,0.05])(support);
DRAW(support);
/******************SUPPORT******************/

/******************PILLOWS******************/
var controls0 = [[89,85,0],[89,79,0],[89,78.5,0],[92,78,0]];
controls0 = controlPointsAdjusterXY(controls0);
controls0 = pointTranslation(controls0,-0.89,0.85,0);
var mapc0 = BEZIER(S0)(controls0);
var curve0 = MAP(mapc0)(domain1D);

var controls1 = [[92,78,0],[116,76,0],[151,76,0],[162,79,0]];
controls1 = controlPointsAdjusterXY(controls1);
controls1 = pointTranslation(controls1,-0.89,0.85,0);
var mapc1 = BEZIER(S0)(controls1);
var curve1 = MAP(mapc1)(domain1D);

var controls2 = [[164,85,0],[164,80,0],[164,79,0],[162,79,0]];
controls2 = controlPointsAdjusterXY(controls2);
controls2 = pointTranslation(controls2,-0.89,0.85,0);
var mapc2 = BEZIER(S0)(controls2);
var curve2 = MAP(mapc2)(domain1D);

var controls01 = pointTranslation(controls0,0,0,feetDistance);
var mapc01= BEZIER(S0)(controls01);
var curve01 = MAP(mapc01)(domain1D);

var controls11 = pointTranslation(controls1,0,0,feetDistance);
var mapc11= BEZIER(S0)(controls11);
var curve11 = MAP(mapc11)(domain1D);

var controls21 = pointTranslation(controls2,0,0,feetDistance);
var mapc21= BEZIER(S0)(controls21);
var curve21 = MAP(mapc21)(domain1D);

var halfpillow = bezierSurfaceInterpolator([[mapc0,mapc01],[mapc1,mapc11],[mapc2,mapc21],
                                            [mapc0,mapc1],[mapc1,mapc2],[mapc0,mapc2],
                                            [mapc01,mapc11],[mapc11,mapc21],[mapc01,mapc21]]);

var halfpillow1 = T([Z])([feetDistance])(R([Y,Z])(PI)(halfpillow)); 
var pillow = STRUCT([halfpillow1,halfpillow]);


var pillow1 = T([X,Y,Z])([0.06,0.29,0.05])(pillow);

var pillow2 = S([X,Y])([0.4,1.1])(pillow);
pillow2 = T([X,Y,Z])([0.15,0.36,0.05])(R([X,Y])(PI/2)(pillow2));

var pillows = STRUCT([pillow1,pillow2]);
pillows = COLOR(lightBlack)(pillows);
DRAW(pillows);
/******************PILLOWS******************/


