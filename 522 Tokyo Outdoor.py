from pyplasm import *
import scipy
from scipy import *
from larpy import *

#ASSI
X=1
Y=2
Z=3

"""UTILS"""

def pointTranslation(points, dx, dy, dz):
    newPoints = []
    for item in points:
        newItem = []
        newItem.append(item[0]+dx)
        newItem.append(item[1]+dy)
        newItem.append(item[2]+dz)
        newPoints.append(newItem)
    return newPoints

def bezierSurfaceInterpolator(curve):
    domain2 = DOMAIN_GRID([36,36])
    #domain2 = DOMAIN([[0,1],[0,1]])([36,36])
    result = None
    for item in curve:
        mappingFunc = BEZIER(S2)(item)
        surface = MAP(mappingFunc)(domain2)
        if result is None:
            result = surface
        else:
            result = STRUCT([result,surface])
    return result

def pointRotation(points, degree, axis):
    result = []
    rm = None
    if axis == X:
        rm = [[1,0,0],[0,COS(degree),-SIN(degree)],[0,SIN(degree),COS(degree)]]
    if axis==Y:
        rm = [[COS(degree),0,SIN(degree)],[0,1,0],[-SIN(degree),0,COS(degree)]]
    if axis==Z:
        rm = [[COS(degree),-SIN(degree),0],[SIN(degree),COS(degree),0],[0,0,1]]
    for item in points:
        result.append(prodottoMatVect(rm,item))
    return result 

def annulus_sector (alpha, r, R):
    domain = DOMAIN([[0,alpha],[r,R]])([36,1])
    def mapping(v):
        a = v[0]
        r = v[1]
        return [r*COS(a), r*SIN(a)]
    model = MAP(mapping)(domain)
    return model

def prodottoMatVect(mat, vect):
    result = []
    for item in mat:
        result.append(item[0]*vect[0]+item[1]*vect[1]+item[2]*vect[2])
    return result

def EXTRUDE(h):
    h0 = h[0]
    def EXTRUDE0(model):
        return PROD([model,Q(h0)])
    return EXTRUDE0

def DOMAIN_GRID(args):
    model = ([[]],[[0]])
    for k,steps in enumerate(args):
        model = lar.larExtrude(model,steps*[1])
    V,cells = model
    verts = AA(list)(scipy.array(V)/AA(float)(args))
    return MKPOL([verts,AA(AA(lambda h:h+1))(cells),None])

def DOMAIN(limits):
    def DOMAIN0(intervals):
        result = []
        for item in limits:
            int1 = INTERVALS(item[0])(intervals[limits.index(item)])
            int2 = INTERVALS(item[1])(intervals[limits.index(item)])
            result.append(DIFFERENCE([int2,int1]))
        return PROD(result)
    return DOMAIN0

def controlPointsAdjusterXY(controls):
    result = []
    for item in controls:
        item[0]=float(item[0])/100
        item[1]=float(item[1])/100
        item[1]=-item[1]
        result.append(item)
    return result

def controlPointsAdjusterXZ(controls):
    result = []
    for item in controls:
        item[0]=float(item[0])/100;
        item[1]=float(item[1])/100;
        item[2] = item[1];
        item[1]=0;
        result.append(item);
    return result

def curveShifter(curve,dh,dv):
  result = []
  result.append(curve)
  curveh = pointTranslation(curve, 0, 0, -dh)
  result.append(curveh)
  curvevh  = pointTranslation(curve, 0, dv, -dh)
  result.append(curvevh)
  curvev = pointTranslation(curve, 0, dv, 0)
  result.append(curvev)
  return result

def rectangularSurfaceFromCP(cp,dh,dv):
  result = None
  for item in cp:
    cp0 = []
    mappings = []
    cp0 = curveShifter(item,dh,dv)
    for item0 in cp0:
      mapc = BEZIER(S1)(item0)
      mappings.append(mapc)
    if(result == None):
      result = bezierSurfaceInterpolator([[mappings[0],mappings[1]],[mappings[1],mappings[2]],[mappings[2],mappings[3]],[mappings[3],mappings[0]]])  
    else:
      result = STRUCT([result, bezierSurfaceInterpolator([[mappings[0],mappings[1]],[mappings[1],mappings[2]],[mappings[2],mappings[3]],[mappings[3],mappings[0]]])])
                                           
  return result

"""UTILS"""


#DOMAINS
domain1D = INTERVALS(1)(36)
domain2D = DOMAIN_GRID([36,36])

"""FRAME"""
"""BOTTOM"""
controls0 = [[96,505,0],[358,753,0],[682,802,0],[1008,556,0],[1008,555,0],[1028,541,0],[1047,550,0],[1104,563,0]]
controls0 = controlPointsAdjusterXY(controls0)
mapc0 = BEZIER(S1)(controls0)
curve0 = MAP(mapc0)(domain1D)

cradle1 = rectangularSurfaceFromCP([controls0],0.4,0.2)
cradle1 = T([X])([-0.96])(cradle1)
cradle2 = R([X,Z])(PI/36)(cradle1)
cradle1 = R([X,Z])(-PI/36)(cradle1)
cradle2 = T([Z])([-4.4])(cradle2)

closingComponent1 = CUBOID([0.6,0.17,4.8])
closingComponent1 = T([X,Z])([-0.6,-4.8])(closingComponent1)
closingComponent1 = R([X,Y])(-PI/4.5)(closingComponent1)

closingComponent2 = CUBOID([0.6,0.18,3.05])
closingComponent21 = T([Y])([0.18+0.6])(CUBOID([0.15,0.18,3.05]))
closingComponent22 = T([Y])([0.18])(CUBOID([0.15,0.6,0.2]))
closingComponent23 = T([Z])([2.85])(closingComponent22)
closingComponent2 = STRUCT([closingComponent2,closingComponent21,closingComponent22,closingComponent23])
closingComponent2 = R([X,Y])(-PI/12.85)(closingComponent2)
closingComponent2 = T([X,Y,Z])([9.9,-0.535,-3.925])(closingComponent2)

closingComponents = STRUCT([closingComponent1,closingComponent2])

cradle = STRUCT([cradle1, cradle2])
cradle = T([Y])([5.05])(cradle)
cradle = STRUCT([cradle,closingComponents])
"""BOTTOM"""

"""TOP"""
controls1 = [[168,399,0],[311,487,0],[233,448,0],[541,570,0]]
controls1 = controlPointsAdjusterXY(controls1)
mapc1 = BEZIER(S1)(controls1)
curve1 = MAP(mapc1)(domain1D)

controls2 = [[541,570,0],[642,609,0],[597,631,0],[832,510,0],[940,450,0],[932,435,0],[1235,488,0]]
controls2 = controlPointsAdjusterXY(controls2)
mapc2 = BEZIER(S1)(controls2)
curve2 = MAP(mapc2)(domain1D)

part0 = rectangularSurfaceFromCP([controls1,controls2],0.2,0.05)
part0 = T([X,Y])([-1.68,3.93])(part0)

part1 = annulus_sector(PI, 0.6,0.65)
part1 = EXTRUDE([0.2])(part1)
part1 = R([X,Y])(PI/3.2)(part1)
part1 = T([X,Y,Z])([-0.275,-0.6,-0.2])(part1)

part2 = annulus_sector(PI, 0.6,0.65)
part2 = EXTRUDE([0.2])(part2)
part2 = R([X,Y])(-PI/1.63)(part2)
part2 = T([X,Y,Z])([10.4,-1.5,-0.2])(part2)

backrest = STRUCT([part1,part2,part0])
backrest = T([X,Y])([0.3,1.55])(backrest)

rotationLeft = R([X,Z])(-PI/180)
traslationLeft = T([Z])([0.45])
tranfLeft = COMP([rotationLeft,traslationLeft])
backrestLeft = STRUCT(NN(6)([backrest,tranfLeft]))
rotationRight = R([X,Z])(PI/180)
traslationRight = T([Z])([-0.45])
tranfRight = COMP([rotationRight,traslationRight])
backrestRight = STRUCT(NN(6)([backrest,tranfRight]))

backrestDetail1 = CUBOID([0.2,0.1,4.7])
backrestDetail1 = R([X,Y])(PI/6)(backrestDetail1)
backrestDetail1 = T([X,Y,Z])([-0.25,1.3,-2.4])(backrestDetail1)
backrestDetail2 = CUBOID([0.2,0.1,4.35])
backrestDetail2 = R([X,Y])(-PI/6)(backrestDetail2)
backrestDetail2 = T([X,Y,Z])([1.5,0.72,-2.3])(backrestDetail2)
backrestDetail3 = CUBOID([0.2,0.1,3.85])
backrestDetail3 = R([X,Y])(-PI/18)(backrestDetail3)
backrestDetail3 = T([X,Y,Z])([4.5,-0.5,-2])(backrestDetail3)
backrestDetail4 = CUBOID([0.2,0.1,3.3])
backrestDetail4 = R([X,Y])(PI/7)(backrestDetail4)
backrestDetail4 = T([X,Y,Z])([7.8,0.57,-1.75])(backrestDetail4)
backrestDetail5 = CUBOID([0.2,0.1,2.8])
backrestDetail5 = R([X,Y])(-PI/18)(backrestDetail5)
backrestDetail5 = T([X,Y,Z])([10.7,0.55,-1.5])(backrestDetail5)

backrestDetails = STRUCT([backrestDetail1,backrestDetail2,backrestDetail3,backrestDetail4,backrestDetail5])

backrest = STRUCT([backrestRight,backrestLeft,backrestDetails])
backrest = T([X,Y,Z])([-0.1,0,-2.3])(backrest)
"""TOP"""
"""FRAME"""

model = STRUCT([cradle, backrest])
VIEW(model)
