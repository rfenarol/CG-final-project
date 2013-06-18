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


def prodottoMatVect(mat, vect):
    result = []
    for item in mat:
        result.append(item[0]*vect[0]+item[1]*vect[1]+item[2]*vect[2])
    return result

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
domain2D = DOMAIN([[0,1],[0,1]])([36,36])

#MEASURES
leglenght = 0.79
legsDistance = 0.67
supportsDistance = 0.57

"""LEGS"""
controls0 = [[86,110,0],[95,110,0],[90,112,0],[103,101,0]]
controls0 = controlPointsAdjusterXY(controls0)
mapc0 = BEZIER(S1)(controls0)
curve0 = MAP(mapc0)(domain1D)

controls1 = [[103,101,0],[118,89,0],[108,91,0],[132,91,0]]
controls1 = controlPointsAdjusterXY(controls1)
mapc1 = BEZIER(S1)(controls1)
curve1 = MAP(mapc1)(domain1D)

controls2 = [[132,91,0],[156,91,0],[150,90,0],[156,101,0]]
controls2 = controlPointsAdjusterXY(controls2)
mapc2 = BEZIER(S1)(controls2)
curve2 = MAP(mapc2)(domain1D)

controls3 = [[156,101,0],[162,112,0],[158,110,0],[165,110,0]]
controls3 = controlPointsAdjusterXY(controls3)
mapc3 = BEZIER(S1)(controls3)
curve3 = MAP(mapc3)(domain1D)

leg = rectangularSurfaceFromCP([controls0,controls1,controls2,controls3],-0.1,0.01)
leg = T([X,Y])([-0.86,1.10])(leg)
cap = CUBOID([0.01,0.01,0.1])
cap1 = T([X])([leglenght])(cap)
leg = STRUCT([leg,cap,cap1])

leg1 = T([Z])([legsDistance])(leg)

legs = STRUCT([leg,leg1])
"""LEGS"""

"""SUPPORT"""
verticalSupport = CUBOID([0.01,0.35,0.1])
verticalSupport1 = T([Z])([supportsDistance])(verticalSupport)
part1 = CUBOID([0.01,0.12,supportsDistance])
part1 = T([Y])([0.23])(part1)
horizontalSupport = CUBOID([0.72,0.01,0.1])
horizontalSupport1 = T([Z])([supportsDistance])(horizontalSupport)
part2 = CUBOID([0.10,0.01,supportsDistance])
part2 = T([X])([0.62])(part2)

support = STRUCT([verticalSupport,verticalSupport1,part1,horizontalSupport,horizontalSupport1,part2])
support = T([X,Y,Z])([0.05,0.20,0.05])(support)
"""SUPPORT"""

frame = STRUCT([legs,support])
VIEW(frame)


