from pyplasm import *
import scipy
from scipy import *
from larpy import *

#ASSI
X=1
Y=2
Z=3

#COLORS
black = [0,0,0]

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

def controlPointsAdjusterXZ(controls):
    result = []
    for item in controls:
        item[0]=float(item[0])/100;
        item[1]=float(item[1])/100;
        item[2] = item[1];
        item[1]=0;
        result.append(item);
    return result


"""UTILS"""

#DOMAINS
domain1D = INTERVALS(1)(36)
domain2D = DOMAIN_GRID([36,36])

"""PLAN"""
controls0 = [[81,290,0],[35,291,0],[30,291,0],[54,260,0],[58,255,0],[76,238,0],[81,238,0]]
controls0 = controlPointsAdjusterXZ(controls0)
controls0 = pointTranslation(controls0, -0.81,0,-2.38)
mapc0 = BEZIER(S1)(controls0)
curve0 = MAP(mapc0)(domain1D)

controls1 = pointRotation(controls0, PI, Z)
mapc1 = BEZIER(S1)(controls1)
curve1 = MAP(mapc1)(domain1D)

controls2 = pointTranslation(controls0, 0,0.04,0)
mapc2 = BEZIER(S1)(controls2)
curve2 = MAP(mapc2)(domain1D)

controls3 = pointTranslation(controls1, 0,0.04,0)
mapc3 = BEZIER(S1)(controls3)
curve3 = MAP(mapc3)(domain1D)

surface = bezierSurfaceInterpolator([[mapc0,mapc1],[mapc2,mapc3],[mapc0,mapc2],[mapc1,mapc3]])

"""PLAN"""

"""LEGS"""
controls0 = [[77,157,0],[78,184,0],[78,187,0],[82,187,0]]
controls0 = controlPointsAdjusterXY(controls0)
controls0 = pointTranslation(controls0, -0.82,1.57,0)
mapc0 = BEZIER(S1)(controls0)
curve0 = MAP(mapc0)(domain1D)

controls1 = pointRotation(controls0, PI, Y)
mapc1 = BEZIER(S1)(controls1)
curve1 = MAP(mapc1)(domain1D)

controls2 = [[79,157,0],[80,178,0],[80,185.5,0],[83,185.5,0]]
controls2 = controlPointsAdjusterXY(controls2)
controls2 = pointTranslation(controls2, -0.83,1.57,0)
mapc2 = BEZIER(S1)(controls2)
curve2 = MAP(mapc2)(domain1D)

controls3 = pointRotation(controls2, PI, Y)
mapc3 = BEZIER(S1)(controls3)
curve3 = MAP(mapc3)(domain1D)


leg = STRUCT([curve0,curve1,curve2,curve3])
leg1 = R([Y,Z])(PI/22.5)(leg)
leg1 = T([Y,Z])([0.02,0.02])(leg1)
leg2 = R([Y,Z])(PI/22.5)(leg)
leg2 =  R([X,Z])(2*(PI/3))(leg2)
leg2 = T([X,Y,Z])([0.345,0.02,0.465])(leg2)
leg3 = R([Y,Z])(PI/22.5)(leg)
leg3 = R([X,Z])(-2*(PI/3))(leg3)
leg3 = T([X,Y,Z])([-0.345,0.02,0.465])(leg3)


legs = STRUCT([leg1,leg2,leg3])
legs = COLOR(black)(legs)

"""LEGS"""

model = STRUCT([legs, surface])
VIEW(model)



