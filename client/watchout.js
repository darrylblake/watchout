// start slingin' some d3 here.
// <svg> ..<circle cx="220" cy="30" r="20" style="stroke: #000000; stroke-width: 3; fill: #6666ff;"/>

var gameOptions = {
  height: 500,
  width: 800,
  numEnemies: 20
}

var Enemy = function(x, y) {
  this.x = x;
  this.y = y;

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
    .attr({
      x: function(d){ return d.x},
      y: function(d){ return d.y},
      height: 20,
      width: 20
    });

var user = svg.data([{cx:0, cy:0}]).append('circle')
  .attr({
    cx: 350,
    cy: 250,
    r: 20
  })

var drag = d3.behavior.drag()
  .on('drag', function(d){
    d.cx += d3.event.dx;
    d.cy += d3.event.dy;
    
    d3.select(this).attr('transform', function(d){
      return "translate(" + [d.cx, d.cy] +")"
    })
  });

user.call(drag);

user.on("click", function() {
  console.log('clicked');
});


function generateEnemies(numEnemies) {
  var results = [];
  for (var i = 0; i < numEnemies; i++) {
    var x = Math.random() * gameOptions.width;
    var y = Math.random() * gameOptions.height;
    results.push(new Enemy(x, y));
  };
  return results;
}


setInterval(function() {
  svg.selectAll('.enemy').data(generateEnemies(gameOptions.numEnemies))
    .transition()
    .duration(2000)
    .attr({
      x: function(d){ return d.x},
      y: function(d){ return d.y},
      height: 20,
      width: 20
    });
}, 3000);



/*
At a certain interval (one second), go through all of your enemies,
give them random x and y values, and have them transition to those values

You select svg, selectAll enemies, pass in data that are a new set of
n (number of enemies) random x, y value pairs

A helpful function would be one that spits out an array of objects 
that contain random x, y pairs
*/