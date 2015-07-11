// start slingin' some d3 here.
// <svg> ..<circle cx="220" cy="30" r="20" style="stroke: #000000; stroke-width: 3; fill: #6666ff;"/>
var collisions = 0;

var highScore = d3.select('.high span').data([0]);

var currentScore = d3.select('.current span').data([0]);

var gameOptions = {
  height: 500,
  width: 800,
  numEnemies: 20,
  enemSize: 20
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
    .attr('xlink:href', 'asteroid.png')
    .attr('class','enemy')
    .attr(
    /*  function(d) {
        var obj = {};
        obj['x'] = d.x;
        obj['y'] = d.y;
        obj['height'] = 20;
        obj['width'] = 20;
        return obj;
      }
      */
      // See what's wrong with multiple calling the data function
      // To set height and width attributes
        {
          x: function(d){ return d.x},
          y: function(d){ return d.y},
          height: gameOptions.enemSize,
          width: gameOptions.enemSize
        }

      );


    

var user = svg.data([{cx:400, cy:400, r: 20}]).append('circle')
  .attr({
    cx: function(d){return d.cx},
    cy: function(d){return d.cy},
    r: function(d){return d.r}
  })

var drag = d3.behavior.drag()
  .on('drag', function(d){

    
      d.cx += d3.event.dx;
      d.cy += d3.event.dy;
        
    // d3.select(this).attr('transform', function(d){ // ??
    //   return "translate(" + [d.cx, d.cy] +")"
    // })
    if(d.cx > 0 && d.cx < gameOptions.width)
      d3.select(this).attr('cx',d.cx);

    if(d.cy > 0 && d.cy < gameOptions.height)
      d3.select(this).attr('cy',d.cy);
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

function detectCollision(enemy, user) {
  var userData = user.data()[0];

  var x1 = Number(enemy.attributes.x.value) + (0.5*gameOptions.enemSize)
  var x2 = userData.cx;
  var y1 = Number(enemy.attributes.y.value)  + (0.5*gameOptions.enemSize)
  var y2 = userData.cy;
  //debugger;
  var d = new Date();
  var distance = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)) - (gameOptions.enemSize)/2 - userData.r;
  
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
  // func called collided which adds 1 to collision, and then adds a class of collision

  // if distance > 0 and has Class collision
    // remove class collision
  if (distance < 100)
    console.log(d.getTime(), "distance: "+Math.floor(distance)+", user x: "+x2+", user y: "+y2);
    console.log("enemy x: "+x1+", enemy y: "+y1+"\n\n");
  if(distance <= 0){
    console.log("COLLISION!!");
    
  }
}

setInterval(function() {
  svg.selectAll('.enemy').data(generateEnemies(gameOptions.numEnemies))
    .transition()
    .duration(3000)
    .attr({
      x: function(d){ return d.x},
      y: function(d){ return d.y},
      height: 20,
      width: 20
    });
}, 4000);



setInterval(function() {

  svg.selectAll('.enemy').each(function(d){
    detectCollision(this, user);
  });

}, 75);

setInterval(function() {
  var x = currentScore.data()[0]+1;
  currentScore.data([x])
    .text(function(d){return d});
  // debugger
}, 1000)

/*
At a certain interval (one second), go through all of your enemies,
give them random x and y values, and have them transition to those values

You select svg, selectAll enemies, pass in data that are a new set of
n (number of enemies) random x, y value pairs

A helpful function would be one that spits out an array of objects 
that contain random x, y pairs
*/