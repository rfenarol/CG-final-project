from pyplasm import *

#ASSI
X=1
Y=2
Z=3

#MEASURES
height = 0.2
width = 2.28

def EXTRUDE(h):
    h0 = h[0]
    def EXTRUDE0(model):
        return PROD([model,Q(h0)])
    return EXTRUDE0

"""DESK"""

centralPart11 = CUBOID([width,0.12,height])
verts = [[0,0.12],[width,0.12],[0,5.24]]
cells = [[1,2,3]]
centralPart12 = EXTRUDE([height])(MKPOL([verts,cells,None]))
centralPartLine1 = POLYLINE([[width/4,3.93,0],[width/4,0,0],[width/4,0,height],[width/4,3.93,height]])
centralPartLine2 = POLYLINE([[(width/4)*2,2.67,0],[(width/4)*2,0,0],[(width/4)*2,0,height],[(width/4)*2,2.67,height]])
centralPartLine3 = POLYLINE([[(width/4)*3,1.38,0],[(width/4)*3,0,0],[(width/4)*3,0,height],[(width/4)*3,1.38,height]])

centralParts1 = STRUCT([centralPart11,centralPart12])
centralPartLines1 = STRUCT([centralPartLine1,centralPartLine2,centralPartLine3])

"""************************************************************"""

lateralPart11 = CUBOID([width/4, 7.51,height])
lateralPart12 = T([X])([width/4])(CUBOID([2*width/4, 0.28,height]))
verts = [[0,0.28],[width/2,0.28],[0,1.83]]
cells = [[1,2,3]]
lateralPart13 = T([X])([width/4])(EXTRUDE([height])(MKPOL([verts,cells,None])))
lateralPart14 = CUBOID([width/4, 1.36,height])
verts = [[0,1.36],[width/4,1.36],[width/4,2.65]]
cells = [[1,2,3]]
lateralPart15 = EXTRUDE([height])(MKPOL([verts,cells,None]))
lateralPartLine1415 = POLYLINE([[0.02,1.40,0],[0.02,0,0],[0.02,0,height],[0.02,1.40,height]])
lateralPartLine1415 = R([X,Y])(PI)(lateralPartLine1415)
lateralPartLine1415 = T([X,Y])([2*width/4, 7.51])(lateralPartLine1415)
lateralPart1415 = STRUCT([lateralPart14,lateralPart15])
lateralPart1415 = R([X,Y])(PI)(lateralPart1415)
lateralPart1415 = T([X,Y])([2*width/4, 7.51])(lateralPart1415)
lateralPartLine1 = POLYLINE([[0,7.51,0],[0,0,0],[0,0,height],[0,7.51,height]])
lateralPartLine2 = POLYLINE([[width/4,7.51,0],[width/4,0,0],[width/4,0,height],[width/4,7.51,height]])
lateralPartLine3 = POLYLINE([[width/2,1.03,0],[width/2,0,0],[width/2,0,height],[width/2,1.03,height]])

lateralParts1 = R([X,Y])(PI/7.5)(STRUCT([lateralPart11,lateralPart12,lateralPart13,lateralPart1415]))
lateralParts1 = T([X,Y])([width,0.12])(lateralParts1)
lateralPartLines1 = R([X,Y])(PI/7.5)(STRUCT([lateralPartLine1,lateralPartLine2,lateralPartLine3,lateralPartLine1415]))
lateralPartLines1 = T([X,Y])([width,0.12])(lateralPartLines1)

"""************************************************************"""

lateralPart21 = CUBOID([3*width/4,1.90,height])
verts = [[0,1.90],[3*width/4,1.90],[3*width/4,4.22]]
cells = [[1,2,3]]
lateralPart22 = EXTRUDE([height])(MKPOL([verts,cells,None]))
lateralPartLine1 = POLYLINE([[0,1.90,0],[0,0,0],[0,0,height],[0,1.90,height]])
lateralPartLine2 = POLYLINE([[width/4,2.68,0],[width/4,0,0],[width/4,0,height],[width/4,2.68,height]])
lateralPartLine3 = POLYLINE([[2*width/4,3.46,0],[2*width/4,0,0],[2*width/4,0,height],[2*width/4,3.46,height]])
lateralPartLine4 = POLYLINE([[3*width/4,4.22,0],[3*width/4,0,0],[3*width/4,0,height],[3*width/4,4.22,height]])

lateralParts2 = R([X,Y])(PI/2.98)(STRUCT([lateralPart21,lateralPart22]))
lateralParts2 = T([X,Y])([3.72,1.06])(lateralParts2)
lateralPartLines2 = R([X,Y])(PI/2.98)(STRUCT([lateralPartLine1,lateralPartLine2,lateralPartLine3,lateralPartLine4]))
lateralPartLines2 = T([X,Y])([3.72,1.06])(lateralPartLines2)

"""************************************************************"""

centralPart21 = CUBOID([width/2,2.87,height])
verts = [[0,2.87],[width/2,2.87],[0,3.52]]
cells = [[1,2,3]]
centralPart22 = EXTRUDE([height])(MKPOL([verts,cells,None]))
centralPart23 = T([X])([width/2])(CUBOID([width/4,0.2,height]))
verts = [[0,0.2],[width/4,0.2],[0,1.5]]
cells = [[1,2,3]]
centralPart24 = T([X])([width/2])(EXTRUDE([height])(MKPOL([verts,cells,None])))

centralPartLine1 = POLYLINE([[width/4,3.18,0],[width/4,0,0],[width/4,0,height],[width/4,3.18,height]])
centralPartLine2 = POLYLINE([[2*width/4,2.72,0],[2*width/4,0,0],[2*width/4,0,height],[2*width/4,2.72,height]])

centralParts2 = STRUCT([centralPart21,centralPart22,centralPart23,centralPart24])
centralParts2 = R([X,Y])(PI)(centralParts2)
centralParts2 = T([X,Y])([3*width/4+0.25,7.53])(centralParts2)
centralPartLines2 = STRUCT([centralPartLine1,centralPartLine2])
centralPartLines2 = R([X,Y])(PI)(centralPartLines2)
centralPartLines2 = T([X,Y])([3*width/4+0.25,7.53])(centralPartLines2)

model = STRUCT([centralParts1,lateralParts1,lateralParts2,centralParts2])
lines = STRUCT([centralPartLines1,centralPartLines2,lateralPartLines1,lateralPartLines2])
lines = COLOR([0,0,0])(lines)

"""DESK"""

model = STRUCT([model,lines]);
VIEW(model)
