# Convex Hull Demonstration

This is a Node.js program that demonstrates the [Graham's scan] (https://en.wikipedia.org/wiki/Graham_scan)
algorithm to compute the convex hull of a set of points. A convex hull is the
smallest subset of those points that enclose all of the points. Check it
out [here](https://convexhull.herokuapp.com). Works great on mobile!

## Graham's Scan
Pseudocode:
```
S : stack of points initialized to be empty (convex hull)
p[0] : point with lowest y-coordinate
L : list of points sorted in ascending order by polar angle to P

S.push(p[0])

for each point p[i] in L:
    if adding p[i] is a counter clockwise turn:
        S.push(p[i])
    if adding p[i] is a clockwise turn:
        S.pop() until adding p[i] is a counter clockwise turn
        S.push(p[i])
```

## Starting up

In the terminal:

```
npm start
```
