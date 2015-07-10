// start slingin' some d3 here.
// <svg> ..<circle cx="220" cy="30" r="20" style="stroke: #000000; stroke-width: 3; fill: #6666ff;"/>

var gameOptions = {
  height: 500,
  width: 800,
}

var Circle = function(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;

}

var svg = d3.select("body")
            .append("svg")
            .attr("width", gameOptions.width)
            .attr("height", gameOptions.height)
            .selectAll('.asteroid').data([{x: 100, y:40, r:20}])
            .enter()
            .append('svg:image')
            .attr('xlink:href', 'asteroid.png')
            .attr({width: 50, height: 50});



