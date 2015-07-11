// start slingin' some d3 here.
// <svg> ..<circle x="220" y="30" r="20" style="stroke: #000000; stroke-width: 3; fill: #6666ff;"/>
var collisions = 0;
var highScore = d3.select('.high span').data([0]);
var currentScore = d3.select('.current span').data([0]);

var gameOptions = {
  height: 600,
  width: 800,
  numEnemies: 1,
  enemSize: 50
}

var Enemy = function(x, y, size) {
  this.dimensions = [x,y,size];
  this.x = x;
  this.y = y;
  this.size = size;
  this.colliding = false;
}

var svg = d3.select("body")
            .append("svg")
            .attr("width", gameOptions.width)
            .attr("height", gameOptions.height)

svg.selectAll('.enemy').data(generateEnemies(gameOptions.numEnemies))
    .enter()
    .append('svg:image')
    .attr('xlink:href', 'star.png')
    .attr('class','enemy')
    .attr({ x: function(d){ return d.x},
            y: function(d){ return d.y},
            height: gameOptions.enemSize,
            width: gameOptions.enemSize
          });
    

var user = svg.data([{x:400, y:400, size:50}]).append('svg:image')
  .attr('xlink:href', 'user.png')
  .attr({
    x: function(d){return d.x},
    y: function(d){return d.y},
    width: function(d){return d.size},
    height: function(d){return d.size},
  })

var drag = d3.behavior.drag()
  .on('drag', function(d){

    
      d.x += d3.event.dx;
      d.y += d3.event.dy;
        
    // d3.select(this).attr('transform', function(d){ // ??
    //   return "translate(" + [d.x, d.y] +")"
    // })
    if(d.x > 0 && d.x < gameOptions.width)
      d3.select(this).attr('x',d.x);

    if(d.y > 0 && d.y < gameOptions.height)
      d3.select(this).attr('y',d.y);
  })
  .on('dragstart', function(){
    d3.select(this).attr('fill','deepPink');
  })
  .on('dragend', function(){
    d3.select(this).attr('fill','black');
  });

user.call(drag);


function generateEnemies(numEnemies) {
  var results = [];
  for (var i = 0; i < numEnemies; i++) {
    var x = Math.round(Math.random() * gameOptions.width);
    var y = Math.round(Math.random() * gameOptions.height);
    results.push(new Enemy(x, y));
  };
  return results;
}

var speed = 3000;

function detectCollision(enemy, user) {
  var userData = user.data()[0];

  var x1 = Number(enemy.attributes.x.value) + (0.5*gameOptions.enemSize)
  var x2 = userData.x + 25;
  var y1 = Number(enemy.attributes.y.value)  + (0.5*gameOptions.enemSize)
  var y2 = userData.y + 25;
  var d = new Date();
  var distance = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)) - (gameOptions.enemSize)/2 - userData.size/2;
  
  // if distance <=0 and ! has Class collision
  if (distance <= 0 && !enemy.colliding) {
    if (highScore.data()[0] < currentScore.data()[0]){
      highScore.data([currentScore.data()[0]])
        .text(function(d){return d});
    }
    currentScore.data([0])
      .text(function(d){return d});
    collisions++;
    enemy.colliding = true;
    d3.select('svg').classed('collided', true);
    d3.select('.collisions').text("Collisions: "+collisions);
  }
  if (distance > 0 && enemy.colliding) {
    enemy.colliding = false;
    d3.select('svg').classed('collided', false);
  }
}

// Set random enemy positions
setInterval(function() {
  svg.selectAll('.enemy').data(generateEnemies(gameOptions.numEnemies))
    .transition()
    .duration(speed)
    .attr({
      x: function(d){ return d.x},
      y: function(d){ return d.y},
    });
}, 4000);

// Detect Collisions
setInterval(function() {
  svg.selectAll('.enemy').each(function(d){
    detectCollision(this, user);
  });
}, 75);

// Update scores
setInterval(function() {
  var x = currentScore.data()[0]+1;
  currentScore.data([x])
    .text(function(d){return d});
  // debugger
}, 1000)

// setInterval(function(){
//   gameOptions.numEnemies++
// }, 3000);

/*
At a certain interval (one second), go through all of your enemies,
give them random x and y values, and have them transition to those values

You select svg, selectAll enemies, pass in data that are a new set of
n (number of enemies) random x, y value pairs

A helpful function would be one that spits out an array of objects 
that contain random x, y pairs
*/