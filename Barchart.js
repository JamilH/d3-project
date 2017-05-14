var margin = {top: 30, right: 30, bottom: 60, left: 80},
    width = 500 - margin.right - margin.left,
    height = 320 - margin.top - margin.bottom;



var x = d3.scaleBand().rangeRound([0, width]).padding(0.1)

var y = d3.scaleLinear().rangeRound([height, 0]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);
    

var svg2 = d3.select("#body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3.select("#body1").append("svg1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg3.append("text")
        .attr("x", (width / 2))             
        .attr("y", (height/2)-5)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "bold") 
        .style("fill", "grey")
        ;


d3.csv("tweetcount1.csv",function(error, data){
    data.forEach(function(d) {
        d.letter= d.letter;
        d.frequency = +d.frequency;
    });

  
  
x.domain(data.map(function(d) { return d.letter; })),
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

	

  svg2.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); })
            // create increasing to decreasing shade of blue as shown on the output (2 points)
       
       
       
  
svg2.selectAll('text')
    .data(data)
    .enter().append('text')
    .text(function(d) {return d.frequency;})
    .attr('x' , function(d) {return x(d.letter)+ x.bandwidth()/2;})
    .attr('y' , function(d) {return y(d.frequency) + 12;})
    .style("fill", "black")
    .style("text-anchor", "middle")
    .attr("dy", "-1.5em")
    .attr("font-size", "11px");

	svg2.append("g")
	  .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
	  .attr("dx", "-.8em")
      .attr("dy", ".25em")
	  .selectAll("text")
	  .attr("transform", "rotate(-60)") 
      .style("text-anchor", "end")
      .attr("font-size", "10px");

  // add the Y Axis
  svg2.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).tickFormat(d3.format("d")))
      .style("font-size", "10px")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".25em")
        .style("text-anchor", "end")
      .text("Number of tweets per month");


});

