// Search "D3 Margin Convention" on Google to understand margins.

var margin = {top: 50, right: 120, bottom: 100, left: 50},
    width = 1050 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together.

var svg2 = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.

var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.2),
    yScale = d3.scaleLinear().rangeRound([height, 0]);

var tooltip = d3.select("body").append("div").attr("class", "toolTip");
// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
var xAxis = d3.axisBottom(xScale);
    
    

var yAxis = d3.axisLeft(yScale).ticks(20);
    
var g = svg2.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 



// data.csv contains the country name(key) and its GDP(value)

d3.csv("tweetcount1.csv",function(error, data){
    data.forEach(function(d) {
        d.key = d.key;
        d.value = +d.value;
    });

    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
   
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
   
    //draw the bars
    g.selectAll('.bar')
        .data(data)
    .enter().append("rect")
      .attr("class", "bar")
	  .transition().duration(3000)
      .delay(function(d,i) { return i* 200;})
      .attr("x", function(d) { return xScale(d.key); })
      .attr("width", xScale.bandwidth())
      .attr("y", function(d) { return yScale(d.value); })
      .attr("height", function(d) { return height - yScale(d.value); })
	  .style("fill" , function(d,i) {return 'rgb(20,20, ' + ((i*30) +150)+ ')'});
        
    
    // Label the data values(d.value) 
  
    /*g.selectAll('text')
    .data(data)
    .enter()
    .append('text')
	.transition().duration(1000)
        .delay( function(d,i) {
			return i * 200;
		})
    .text(function(d) {return d.value;})
    .attr('x' , function(d) {return xScale(d.key)+   xScale.bandwidth()/2;})
    .attr('y' , function(d) {return yScale(d.value)+11;})
    .style("fill", "white")
    .style("text-anchor", "middle")
	.attr("font-size", "15px");
    
	*/
    
    
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    
	     g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(yScale).ticks(10))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Number of tweets per month");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - y(d.value) ;})
      .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.value));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});
    });
      
