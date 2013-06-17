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
var darkBrownWood = [83/255,27/255,0/255];
var darkGrey = [87/255,87/255,87/255]


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
/******************UTILS******************/

//MEASURES
var height = 0.2;
var width = 2.28;

//DOMAINS
var domain1D = INTERVALS(1)(36);
var domain2D = DOMAIN([[0,1],[0,1]])([36,36]);

/*******************DESK*********************/

var centralPart11 = CUBOID([width,0.12,height]);
var verts = [[0,0.12],[width,0.12],[0,5.24]];
var cells = [[0,1,2]];
var centralPart12 = EXTRUDE([height])(SIMPLICIAL_COMPLEX(verts)(cells));
var centralPartLine1 = POLYLINE([[width/4,3.93,0],[width/4,0,0],[width/4,0,height],[width/4,3.93,height]]);
var centralPartLine2 = POLYLINE([[(width/4)*2,2.67,0],[(width/4)*2,0,0],[(width/4)*2,0,height],[(width/4)*2,2.67,height]]);
var centralPartLine3 = POLYLINE([[(width/4)*3,1.38,0],[(width/4)*3,0,0],[(width/4)*3,0,height],[(width/4)*3,1.38,height]]);

var centralParts1 = STRUCT([centralPart11,centralPart12]);
var centralPartLines1 = STRUCT([centralPartLine1,centralPartLine2,centralPartLine3]);

/********************************************/

var lateralPart11 = CUBOID([width/4, 7.51,height]);
var lateralPart12 = T([X])([width/4])(CUBOID([2*width/4, 0.28,height]));
var verts = [[0,0.28],[width/2,0.28],[0,1.83]];
var cells = [[0,1,2]];
var lateralPart13 = T([X])([width/4])(EXTRUDE([height])(SIMPLICIAL_COMPLEX(verts)(cells)));
var lateralPart14 = CUBOID([width/4, 1.36,height]);
var verts = [[0,1.36],[width/4,1.36],[width/4,2.65]];
var cells = [[0,1,2]];
var lateralPart15 = EXTRUDE([height])(SIMPLICIAL_COMPLEX(verts)(cells));
var lateralPartLine1415 = POLYLINE([[0.02,1.40,0],[0.02,0,0],[0.02,0,height],[0.02,1.40,height]]);
lateralPartLine1415 = R([X,Y])(PI)(lateralPartLine1415);
lateralPartLine1415 = T([X,Y])([2*width/4, 7.51])(lateralPartLine1415);
var lateralPart1415 = STRUCT([lateralPart14,lateralPart15]);
lateralPart1415 = R([X,Y])(PI)(lateralPart1415);
lateralPart1415 = T([X,Y])([2*width/4, 7.51])(lateralPart1415);
var lateralPartLine1 = POLYLINE([[0,7.51,0],[0,0,0],[0,0,height],[0,7.51,height]]);
var lateralPartLine2 = POLYLINE([[width/4,7.51,0],[width/4,0,0],[width/4,0,height],[width/4,7.51,height]]);
var lateralPartLine3 = POLYLINE([[width/2,1.03,0],[width/2,0,0],[width/2,0,height],[width/2,1.03,height]]);

var lateralParts1 = R([X,Y])(PI/7.5)(STRUCT([lateralPart11,lateralPart12,lateralPart13,lateralPart1415]));
lateralParts1 = T([X,Y])([width,0.12])(lateralParts1);
var lateralPartLines1 = R([X,Y])(PI/7.5)(STRUCT([lateralPartLine1,lateralPartLine2,lateralPartLine3,lateralPartLine1415]));
lateralPartLines1 = T([X,Y])([width,0.12])(lateralPartLines1);

/********************************************/

var lateralPart21 = CUBOID([3*width/4,1.90,height]);
var verts = [[0,1.90],[3*width/4,1.90],[3*width/4,4.22]];
var cells = [[0,1,2]];
var lateralPart22 = EXTRUDE([height])(SIMPLICIAL_COMPLEX(verts)(cells));
var lateralPartLine1 = POLYLINE([[0,1.90,0],[0,0,0],[0,0,height],[0,1.90,height]]);
var lateralPartLine2 = POLYLINE([[width/4,2.68,0],[width/4,0,0],[width/4,0,height],[width/4,2.68,height]]);
var lateralPartLine3 = POLYLINE([[2*width/4,3.46,0],[2*width/4,0,0],[2*width/4,0,height],[2*width/4,3.46,height]]);
var lateralPartLine4 = POLYLINE([[3*width/4,4.22,0],[3*width/4,0,0],[3*width/4,0,height],[3*width/4,4.22,height]]);

var lateralParts2 = R([X,Y])(PI/2.98)(STRUCT([lateralPart21,lateralPart22]));
lateralParts2 = T([X,Y])([3.72,1.06])(lateralParts2);
var lateralPartLines2 = R([X,Y])(PI/2.98)(STRUCT([lateralPartLine1,lateralPartLine2,lateralPartLine3,lateralPartLine4]));
lateralPartLines2 = T([X,Y])([3.72,1.06])(lateralPartLines2);

/********************************************/

var centralPart21 = CUBOID([width/2,2.87,height]);
var verts = [[0,2.87],[width/2,2.87],[0,3.52]];
var cells = [[0,1,2]];
var centralPart22 = EXTRUDE([height])(SIMPLICIAL_COMPLEX(verts)(cells));
var centralPart23 = T([X])([width/2])(CUBOID([width/4,0.2,height]));
var verts = [[0,0.2],[width/4,0.2],[0,1.5]];
var cells = [[0,1,2]];
var centralPart24 = T([X])([width/2])(EXTRUDE([height])(SIMPLICIAL_COMPLEX(verts)(cells)));

var centralPartLine1 = POLYLINE([[width/4,3.18,0],[width/4,0,0],[width/4,0,height],[width/4,3.18,height]]);
var centralPartLine2 = POLYLINE([[2*width/4,2.72,0],[2*width/4,0,0],[2*width/4,0,height],[2*width/4,2.72,height]]);

var centralParts2 = STRUCT([centralPart21,centralPart22,centralPart23,centralPart24]);
centralParts2 = R([X,Y])(PI)(centralParts2);
centralParts2 = T([X,Y])([3*width/4+0.25,7.53])(centralParts2);
var centralPartLines2 = STRUCT([centralPartLine1,centralPartLine2]);
centralPartLines2 = R([X,Y])(PI)(centralPartLines2);
centralPartLines2 = T([X,Y])([3*width/4+0.25,7.53])(centralPartLines2);

var model = STRUCT([centralParts1,lateralParts1,lateralParts2,centralParts2]);
model = COLOR(brownWood)(model);
var lines = STRUCT([centralPartLines1,centralPartLines2,lateralPartLines1,lateralPartLines2]);
lines = COLOR(darkBrownWood)(lines);

/*******************DESK*********************/

/*******************FEET*********************/
var controls0 = [[544,70,0],[544,65,0],[552,65,0],[558,70,0]];
controls0 = controlPointsAdjusterXY(controls0);
controls0 = pointTranslation(controls0, -5.44,0.7,0);
var mapc0 = BEZIER(S0)(controls0);
var curve0 = MAP(mapc0)(domain1D);

var controls1 = pointRotation(controls0, PI, X);
var mapc1 = BEZIER(S0)(controls1);
var curve1 = MAP(mapc1)(domain1D);

var controls2 = pointTranslation(controls0, 0,0,-2.22 );
var mapc2 = BEZIER(S0)(controls2);
var curve2 = MAP(mapc2)(domain1D);

var controls3 = pointTranslation(controls1, 0,0,-2.22 );
var mapc3 = BEZIER(S0)(controls3);
var curve3 = MAP(mapc3)(domain1D);

var foot = bezierSurfaceInterpolator([[mapc0,mapc1],[mapc2,mapc3],[mapc0,mapc2],[mapc1,mapc3]]);
foot = COLOR(brownWood)(foot);
foot = S([X,Y])([3,3])(foot);

/********************************************/

var foot1 = R([X,Y])(PI/2)(foot);
foot1 = T([X,Y])([width/2-0.2,1])(foot1);

var foot12 = R([X,Y])(PI/1.20)(foot);
foot12 = T([X,Y])([3.5,2.2])(foot12);

/********************************************/

var controls0 = [[566,168,0],[560,168,0],[562,181,0],[568,183,0],[562,183,0],[561,198,0],[566,198,0]];
controls0 = controlPointsAdjusterXY(controls0);
controls0 = pointTranslation(controls0, -5.66,1.68,0);
var mapc0 = BEZIER(S0)(controls0);
var curve0 = MAP(mapc0)(domain1D);

var controls1 = pointRotation(controls0, PI, Y);
var mapc1 = BEZIER(S0)(controls1);
var curve1 = MAP(mapc1)(domain1D);

var controls2 = pointTranslation(controls0, 0,0,-2.22 );
var mapc2 = BEZIER(S0)(controls2);
var curve2 = MAP(mapc2)(domain1D);

var controls3 = pointTranslation(controls1, 0,0,-2.22 );
var mapc3 = BEZIER(S0)(controls3);
var curve3 = MAP(mapc3)(domain1D);

var foot2 = bezierSurfaceInterpolator([[mapc0,mapc1],[mapc2,mapc3],[mapc0,mapc2],[mapc1,mapc3]]);
foot2 = COLOR(brownWood)(foot2);
foot2 = S([X,Y])([3,2])(foot2);
foot2 = R([X,Y])(PI/1.8)(foot2);
foot2 = T([X,Y])([0.5,6])(foot2);

/********************************************/

var feet = STRUCT([foot1,foot12,foot2]);
DRAW(feet)

/*******************FEET*********************/

model = STRUCT([model,feet]);
DRAW(COLOR(darkBrownWood)(lines));
DRAW(model);


var model1 = R([X,Y])(PI)(model);
model1 = T([X,Y])([2*width,7.5+4.5])(model1);
var lines1 = R([X,Y])(PI)(lines);
lines1 = T([X,Y])([2*width,7.5+4.5])(lines1);
DRAW(COLOR(black)(lines1));
DRAW(COLOR(darkGrey)(model1));