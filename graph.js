// GRAPH TRAVERSAL LOGIC

class Node{
	constructor(name, neighbours, zone){
  	this.name = name;
    this.neighbours = neighbours;
    this.zone = zone;
  }
}

// generates graph of 2 dimensional array 
// [['name', 'zone', 'neighbourA, neighbourB, ...']]
// => {"a": Node, "b": Node, ...}
exports.generateGraph = function(data){
  graph = {};
  data.forEach(row => {
    var name = row[0];
    var zone = row[1];
    var neighbours = row[2].split(',');
    graph[name] = new Node(name, neighbours, zone);
  });
  return graph;
}

//collect all shortest paths by tracing back to the start node
function findPaths(paths, path, prev, start, u){
  if(u === start){
  	path = path.slice();
  	paths.push(path);
  	return;
  }

	for (var par of prev[u]){
  	path.push(u);
    findPaths(paths, path, prev, start, par);
    path.pop(par);
  }
  return;
}

// breadth first search for finding all shortest paths
exports.bfsAll = function(graph, s, e) {
    var start = graph[s];
    var end = graph[e];
    if(start == null || end == null)
      return [];
    if(s == e)
      return [[start.name]];
    var queue = [start];
    var visited = [];
    visited.push(start);
    var prev = [];
    var dist = [];
    // set all distances to maximum (infinity)
    for (const [key, value] of Object.entries(graph))
    	dist[key] = Infinity;

    dist[start.name] = 0;

    while(queue.length > 0){
    	var node = queue.shift();

      if (node == end)
      	break;

     	for(var next of node.neighbours){
      	if(dist[next] > dist[node.name] + 1){
        	dist[next] = dist[node.name] + 1;
        	visited.push(graph[next]);
        	queue.push(graph[next]);
          prev[next] = [node.name];
        }else if(dist[node.name] === dist[prev[next]]){
        		prev[next].push(node.name);
        }
      }
    }

    // connect the paths
    paths = [];
    path = [];
    findPaths(paths, path, prev, start.name, end.name);

    for (var p of paths){
    	p.push(start.name);
    	p.reverse();
    }

    return paths;
}

//console.log(bfs(graph, f, j));
//console.log(bfsAll(graph, f, j));
