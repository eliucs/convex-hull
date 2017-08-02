// Convex Hull
// Demonstration of Graham's scan algorithm to compute the convex
// hull of a set of points
// Source code: https://github.com/eliucs/convex-hull
// Website: http://ericliu.cs
// Author: Eric Liu

var path;

var nodes = [];
var nodeLayer = new Layer();
var convexHullLayer = new Layer();

function onMouseDown(event) {
  nodeLayer.activate();
  path = new Path();
  path.strokeColor = 'white';

  var node = new Path.Circle({
    center: event.point,
    radius: 7
  });

  node.strokeColor = 'black';
	node.fillColor = 'white';

  nodes.push({
    x: event.point.x,
    y: event.point.y,
    equals: function(that) {
      return this.x == that.x && this.y == that.y
    }
  });

  convexHullLayer.activate();
  convexHullLayer.removeChildren();

  grahamScan(nodes, function(res, convexHull) {
    if (!res) {
      // console.log('No nodes on the screen.');
      return;
    } else if (typeof convexHull == 'undefined'){
      // console.log('Cannot make convex hull with 1-2 points.');
      return;
    }

    var convexHullPath = new Path();
    convexHullPath.strokeColor = '#98FB98';
    convexHullPath.strokeWidth = 3;
    convexHull.forEach(function(node) {
      convexHullPath.add(new Point(node.x, node.y));
    });
    convexHullPath.add(new Point(convexHull[0].x, convexHull[0].y));
  });
};

$('#btn-reset').click(function() {
  nodeLayer.removeChildren();
  convexHullLayer.removeChildren();
  paper.view.draw();
  nodes = [];
});

function grahamScan(nodes, callback) {
  if (!nodes) {
    callback(false, undefined);
    return;
  } else if (nodes.length == 1) {
    callback(true, undefined);
    return;
  }

  // Defensive copy
  var points = [];
  for (var i = 0; i < nodes.length; i++) {
    points[i] = nodes[i];
  }
  var n = points.length;

  // Compute convex hull
  var convexHull = [];
  points.sort(yOrder);

  var lowest = points[0];
  points = points.splice(1);

  points.sort(function(a, b) {
    var dx1 = a.x - lowest.x;
    var dy1 = a.y - lowest.y;
    var dx2 = b.x - lowest.x;
    var dy2 = b.y - lowest.y;

    if (dy1 >= 0 && dy2 < 0) {
      return -1;
    } else if (dy2 >= 0 && dy1 < 0) {
      return 1;
    } else if (dy1 == 0 && dy2 == 0) {
      if (dx1 >= 0 && dx2 < 0) {
        return -1;
      } else if (dx2 >= 0 && dx1 < 0) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return -ccw(lowest, a, b);
    }
  });
  convexHull.push(lowest);

  var k1;
  for (k1 = 0; k1 < n-1; k1++) {
    if (!lowest.equals(points[k1])) {
      break;
    }
  }
  if (k1 == n-1) {
    return;
  }

  var k2;
  for (k2 = k1+1; k2 < n-1; k2++) {
    if (ccw(lowest, points[k1], points[k2]) != 0) {
      break;
    }
  }
  convexHull.push(points[k2-1]);

  for (var i = k2; i < n - 1; i++) {
    var top = convexHull.pop();
    while (ccw(convexHull[convexHull.length-1], top, points[i]) <= 0) {
      top = convexHull.pop();
    }
    convexHull.push(top);
    convexHull.push(points[i]);
  }

  callback(true, convexHull);
  return;
}

function yOrder(a, b) {
  if (a.y < b.y) {
    return -1;
  } else if (a.y > b.y) {
    return 1;
  } else if (a.x < b.x) {
    return -1;
  } else if (a.x > b.x) {
    return 1;
  }
  return 0;
}

function ccw(a, b, c) {
  var area2 = (b.x-a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x);
  if (area2 < 0) {
    return -1;
  } else if (area2 > 0) {
    return 1;
  }
  return 0;
}
