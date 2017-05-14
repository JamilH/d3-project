var width = document.getElementById('container').offsetWidth,
    height = 1000,
    padding = 6 // separation between nodes
    maxRadius = 12;

var path,circle,force,nodes,locations,color,m,n,newlocations;

var div = d3.select("body").append("div")
    .attr('class', 'tooltip')
    .style("opacity", 0);

var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height);

/******All of the following code up to function create_graph() is for the buttons.
    The same code is copied in the codeChange function because it doesn't
    work without it
******/
var bWidth= 100; //button width
var bHeight= 65; //button height
var bSpace= 20; //space between buttons
var x0= document.getElementById('container').offsetWidth/2-170; //x offset
var y0= 10; //y offset

//button labels


function create_graph(category) {
    d3.csv("timeline.csv", function(d) {
        return {
            id: d.id,
            Birthdate: +d.Birthdate,
            Deathdate: +d.Deathdate,
            Rank: +d.Rank,
        };
    },

    function(data) {
        m = 0;
        n = 0;
        locations = [];
        
        data.forEach(function(d) {
                locations.push(d.Birthdate);
                n = n + 1;
            });
	});
      
        newlocations = locations.filter(function(elem, pos) {
            return locations.indexOf(elem) == pos;
        }); 

        m = newlocations.length;


        var x = d3.scaleLinear()
            .domain(newlocations)
            .rangePoints([0, width], 1).nice();

        
        nodes = data.map(function(d) {
            
            v = d.max;
            return {
                id: d.id,
            Birthdate: +d.Birthdate,
            Deathdate: +d.Deathdate,
            Rank: +d.Rank,
            Image: d.Image
            };
        });

        force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0)
            .charge(0)
            .on("tick", tick)
            .start();

        var gLegend = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height * 0.9 + ")")
            .call(legend);

        gLegend.selectAll(".tick text")
            .attr("fill", function(d, i) {
                return '#000000';
            });

        circle = svg.append("g").selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            
            .on('mouseover', function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("<img src=" + d.image + ">" + "<br/>" + d.id + "<br/>Minimum SHU: " + d.Birthdate + "<br/>Maximum SHU: " + d.Deathdate + "<br/>Average SHU: " + d.Rank + "<br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
            })
            .on('mouseout', function(d) {
                div.transition()
                .duration(500)
                .style("opacity", 0);
            })
            .call(force.drag);

        circle.transition()
            .duration(1000)
            .delay(function(d, i) { return i * 10; })
            .attrTween("r", function(d) {
                var i = d3.interpolate(0, d.radius);
                return function(t) { return d.radius = i(t); };
            });
    } 

           
function tick(e) {
    circle.each(gravity(.2 * e.alpha))
        .each(collide(.5))
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        });
}

// Move nodes toward cluster focus.
function gravity(alpha) {
    return function(d) {
        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
    };
}

// Resolve collisions between nodes.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function(d) {
        var r = d.radius + maxRadius + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}

function updateButtonColors(button, parent) {
    parent.selectAll("rect")
        .attr("fill",defaultColor)
    button.select("rect")
        .attr("fill",pressedColor)
}

function clear_graph() {
    nodes = {};
    links = [];
    newlocations = [];
    svg.selectAll('.tick text').remove();
    svg.selectAll('circle').remove();
    
}

function codeChange(category) {
    clear_graph();
    create_graph(category);
}