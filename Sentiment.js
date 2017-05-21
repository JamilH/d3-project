var margin = {top: 30, right: 80, bottom: 60, left: 80},
    width = 500 - margin.right - margin.left,
    height = 320 - margin.top - margin.bottom,
    circleRadius = 20,
  yScaleValue = 150,
  imageHeight = imageWidth = circleRadius * 2,
  legends = [{'color': 'green', 'text': 'Most Hated'}, {'color': 'red', 'text': 'Most Liked'}];

var tooltip_width = 400;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([20, 0])
  .direction('s')
  .html(function(d) {
    return createTooltipHTML(d);
  })

var tip2 = d3.tip()
  .attr('class', 'd3-tip-top')
  .offset([-140, 0])
  .direction('n')
  .html(function(d) {    
    return createTooltipHTML2(d);
  });

var tip3 = d3.tip()
  .attr('class', 'd3-tip-top')
  .offset([-140, 0])
  .direction('n')
  .html(function(d) {    
    return createTooltipHTML3(d);
  });


var svg = d3.select('.chart')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .call(responsivefy)
  .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.call(tip);
svg.call(tip2);
svg.call(tip3)

d3.csv('./timeline.csv', function(err, data){
  if (err) throw err;

  // clean the data source
  var data = data.map( (d) => {
    var cleanDatum = {};
    d3.keys(d).forEach(function(k) {
      if(d[k])  
        cleanDatum[k.trim()] = d[k].trim();
    });
    return cleanDatum;
  });

  // format the data
  let id = 1; // for image url mapping
  data.forEach( (d) => {
    d.id = id;
    d.Birthdate = +d.Birthdate;
    d.Deathdate = +d.Deathdate;
    d.Rank      = +d.Rank;
    id++;

  });

	
  // build the x axis
  var xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Birthdate), new Date().getFullYear()])
    .range([0, width])
    .nice();

  var xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d3.format("d"));


  var gX = svg
    .append('g')
      .attr('id', 'x-axis')
       .attr("transform", "translate(0," + 3*margin.top + ")")
    .call(xAxis);

  // do the dirty work ;) build the plot
  var content = svg
    .append('g')
      .attr('class', 'content');

  var circles = content
    .selectAll('.clergy')
    .data(data)
    .enter()
    .append('g')
      .attr('class', 'clergy')
      // .attr('x', d => `${xScale(d.Birthdate)}`)
      // .attr('y', `${yScaleValue}`);
      .attr('transform', d => {
        return `translate(${xScale(d.Birthdate)}, ${yScaleValue})`;
      });

  // append the image as pattern
  circles
    .append('pattern')
      .attr('id', d => d.id)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 3)
      .attr('height', 3)
    .append('image')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', imageWidth)
      .attr('height', imageHeight)
      .attr('xlink:href', d => d.Image);


  var tips_show = function(d){
    
    tip.show(d);

    var x = `${xScale(d.Birthdate)}`
    var x2 = `${xScale(d.Deathdate)}`;  
    var delta = x2 - x;

    tip2.show(d);

    if(d.Deathdate){      
      tip3.offset([-140, delta]);
      tip3.show(d);
    }    
    
  }
  var tips_hide = function(d){
    tip.hide(d);
    tip2.hide(d);
    tip3.hide(d);
  }
  // create circles and fill with corresponding images
   circles
    .append('circle')
      .attr('r', circleRadius)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('class', d => d.Rank ? 'clergy-green' : 'clergy-red')
      .style('fill', d => d.Image ?`url(#${d.id})` : 'steelblue')
      .on('mouseover', tips_show)
      .on('mouseout', tips_hide);

    // build legends
  var legend = svg
    .selectAll('.legend')
    .data(legends)
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 20})` );

  // draw legend colored rectangles
  legend
    .append('circle')
      .attr('cx', width - 5)
      .attr('cy', 20)
      .attr('r', 5)
      .style('fill', d => d.color);

  // draw legend text
  legend
  .append('text')
      .attr('x', width - 15)
      .attr('y', 20)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text( d => d.text );

  // build zoom behavior on x-axis
  var zoom = d3.zoom()
    .on("zoom", zoomed);

  //svg.call(zoom);

  function zoomed() {
    gX.transition().duration(50).call(xAxis.scale(d3.event.transform.rescaleX(xScale)));

    var newXScale = d3.event.transform.rescaleX(xScale);
    circles.attr('transform', d => {
      return `translate(${newXScale(d.Birthdate)}, ${yScaleValue})`;
    })
  }
});

// crate tooltip content
function createTooltipHTML(d){
  // vat tweets = '';
  // d.Tweets.forEach(t => {
  //   tweets += t;
  // });
  return (
    `<span style='color:orange'> ${d.ClergyName}  </span>
    <span style="float: right">
      <span style='color:orange'>Birth:</span> ${d.Birthdate}
    </span>    

    <br />

    <span style="float: right">
      <span style='color:orange'>Death:</span> ${d.Deathdate ? d.Deathdate : 'n/a'}
    </span>    

    <br />

    <hr />
    ${d.ClergyDetails}
    <br />
    <hr />
    <span style='color:orange'>Facts:</span> <br />
    1. ${d.F1? d.F1 : 'n/a'}<br />
    2. ${d.F2? d.F2 : 'n/a'}<hr />
    <span style='color:orange'>Preachings:</span> <br />
    1. ${d.P1? d.P1 : 'n/a'}<br />
    2. ${d.P2? d.P2: 'n/a'}<br />
    3. ${d.P3? d.P3: 'n/a'}<hr />
    <span style='color:orange'>Tweets about him:</span> ${d.Tweets ? d.Tweets : '-'} <hr />
    <span style='color:orange'>Tweets:</span> <br />
    1. ${d.T1? d.T1 : 'n/a'}<br />
    2. ${d.T2? d.T2: 'n/a'}<br />
    3. ${d.T3? d.T3: 'n/a'}<hr />`
  );
}


function createTooltipHTML2(d){

  return (
    `<span style='color:black'>\u25BC</span>`
  );

}

function createTooltipHTML3(d){

  return (
    `<span style='color:black'>\u25BC</span>`
  );

}


// Make chart responsive using viewBox
function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMinYMid")
      .call(resize);

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on("resize." + container.attr("id"), resize);

  // get width of container and resize svg to fit it
  function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
  }
}