// SERVER FILE

const express = require('express');
const http = require('http');
const fs = require('fs');
var parse = require('csv-parse');
const {bfsAll, generateGraph} = require("./graph");

// parses the csv into and calls the graph generating function (from graph.js) 
async function parseCsvAndGenerateGraph(){
  var graph = {};
  const fileContents = await fs.promises.readFile("./graphData.csv", "utf-8");
  const g = await new Promise((resolve, reject) => {
    parse(fileContents, {delimiter:";", trim: true}, function(err, rows) {
      if (err) {
        reject(err);
      }
      graph = generateGraph(rows);
      resolve(graph);
    })
  });
  return g;
}


// ***
// EXPRESS Section
// ***

const app = express()

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs', { pathData : '' , pathLength : -1, err : ''});
})

// processes input data, generates graph and runs bfs
app.post('/', async (req, res) => {
  var start = req.body.start;
  var end = req.body.end;
  var graph = await parseCsvAndGenerateGraph();
  var pathsArray = bfsAll(graph, start, end); // result paths after bfs
  var pathsArrayFormatted = []; // array of formated paths [a -> b -> c, ...]
  pathsArray.forEach(p => {
    pathsArrayFormatted.push(p.join(" -> "));
  });
  var lengthOfPath = -1;
  var errorMsg = '';
  if(pathsArray.length > 0)
    lengthOfPath = pathsArray[0].length - 1;
  else 
    errorMsg = "No path found";
    
  console.log(pathsArray);
  res.render('index.ejs', { pathData : pathsArrayFormatted, pathLength : lengthOfPath, err : errorMsg});
})

app.listen(3000);
