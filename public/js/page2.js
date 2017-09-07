

var tau = 2 * Math.PI;

document.body.style.zoom = '50%';

/*
parent = div to append to
y = y coord in div
label = characteristic slider is changing
xScale = scale for this slider
id = slider id
*/

function moveSlider(xScale) {
	group = d3.select(this.parentNode.parentNode.parentNode)
	console.log(group)
	if (group.attr("id") == "race-sliders") {
		var sum = 0
		var sliders = group.selectAll(".slider-result").each(function(d) {
			sum += parseInt(d.text)
		})
		if (sum > 100) {
			return;
		}
	}
	d3.select(this).attr("cx", xScale(xScale.invert(d3.event.x)));
 	result = parseInt(xScale.invert(d3.event.x))
	d3.select(this.parentNode).select(".slider-result").text(result);	
}

function addSlider(parent, x, y, label, xScale, id) {
	var slider = parent.append("g")
		.attr("class", "slider")
		.attr("transform", "translate(" + x + "," + y + ")")

	slider.append("text")
		.attr("class", "slider-label")
		.text(label)
		.attr("text-anchor", "end")
		.attr("x", "-20")
		.attr("y", "4")
	slider.append("text")
		.attr("class", "slider-result")
		.attr("id", id)
		.attr("text-anchor", "start")
		.text("-")
		.attr("transform", "translate(" + (xScale.range()[1]+17) + "," + 7 + ")")
	var sliderTray = slider.append("line")
		.attr("class", "slider-tray")
		.attr("x1", xScale.range()[0])
		.attr("x2", xScale.range()[1])
	slider.append("line")
		.attr("class", "tray-inset")
		.attr("x1", xScale.range()[0])
		.attr("x2", xScale.range()[1])
	var sliderHandle = slider.append("circle")
		.attr("class", "handle")
		.attr("r", 10)
	sliderHandle.call(d3.drag()
	    .on("start", function() {
	      console.log("clicked");
	    })
	    .on("drag", function() {
	    	group = d3.select(this.parentNode.parentNode.parentNode)
			result = parseInt(xScale.invert(d3.event.x))
			curr = d3.select(this.parentNode).select(".slider-result").text();
			d3.select(this.parentNode).select(".slider-result").text(result);
			if (group.attr("id") == "race-sliders") {
				var sum = 0
				var sliders = group.selectAll(".slider-result").each(function(d) {
					val = d3.select(this).text()
					if (val == "-") { val = "0"}
					sum += parseInt(val)
				})
				console.log(sum)
				if (sum > 100) {
					d3.select(this.parentNode).select(".slider-result").text(curr);
					return;
				}
			}
			d3.select(this).attr("cx", xScale(xScale.invert(d3.event.x)));
			if (result == -1) {
				result = "-"
			}
			d3.select(this.parentNode).select(".slider-result").text(result);
		})
		.on("end", function() {
			group = d3.select(this.parentNode.parentNode.parentNode)
			result = parseInt(xScale.invert(d3.event.x))
			curr = d3.select(this.parentNode).select(".slider-result").text();
			d3.select(this.parentNode).select(".slider-result").text(result);
			if (group.attr("id") == "race-sliders") {
				var sum = 0
				var sliders = group.selectAll(".slider-result").each(function(d) {
					val = d3.select(this).text()
					if (val == "-") { val = "0"}
					sum += parseInt(val)
				})
				console.log(sum)
				if (sum > 100) {
					d3.select(this.parentNode).select(".slider-result").text(curr);
					return;
				}
			}
			d3.select(this).attr("cx", xScale(xScale.invert(d3.event.x)));
			if (result == -1) {
				result = "-"
			}
			d3.select(this.parentNode).select(".slider-result").text(result);
		}))
}

function addSelect(parent, y, label, options, id) {
	/*select.append("text")
		.attr("class", "slider-label")
		.text(label)
		.attr("text-anchor", "end")
		.attr("x", "-20")
		.attr("y", "4")
	var result = select.append("text")
		.attr("class", "slider-result")
		.attr("id", id)
		.attr("text-anchor", "start")
		.text("")
		.attr("transform", "translate(" + 20 + "," + 7 + ")")
		.attr("stroke", "white")*/

	selector = d3.select('.selects').append("select")
		.attr("class", "selector")
		.on("change", function(d) {
			val = d3.select(this).attr("id");
			console.log(val)
			//d3.select(id).text(result);
		})
	var options = selector
	  .selectAll('option')
		.data(options).enter()
		.append('option')
			.text(function (d) { return d.label; })
			.attr("id", function (d) { return d.id})
}
//slider arr element: [id, max, label, type of selection, select arr (optional)]
function addSliderGroup(parent, y, label, slider_arr) {
	var width = 250;
	container = parent.append("g")
		.attr("class", "slider-group")
		.attr("transform", "translate(" + 10 + "," + y + ")");
	if (label != "") { 
		container.append("text")
			.attr("transform", "translate(" + 10 + "," + 10 + ")")
			.text(label)
			.attr("class", "group-label")
			
		transform_x = 260
	} else {
		transform_x = 260
	}
	sliders = container.append("g")
		.attr("class", "slider-group")
		.attr("transform", "translate(" + 0 + "," + 50 + ")");
	for (var i = 0; i < slider_arr.length; i++) {
		var scale = d3.scaleLinear()
		    .domain([-1, slider_arr[i][1]])
		    .range([0, width])
		    .clamp(true);
		if (slider_arr[i][3] == "slider") {	
			addSlider(sliders, transform_x, (i)*36, slider_arr[i][2], scale,slider_arr[i][0])
		} else if (slider_arr[i][3] == "select") {
			addSelect(sliders, (i)*36, slider_arr[i][2], slider_arr[i][4],slider_arr[i][0])
		}
	}
	return container
}

var svg = d3.select(".sliders-svg")
var svg2 = d3.select(".success-svg")




/*
var options = d3.select("#district-select")
	  .selectAll('option')
		.data(districts).enter()
		.append('option')
			.text(function (d) { return d; })
			.attr("id", function (d) { return d})*/


addSliderGroup(svg, 0, "", [[7, 4500, "enrollment", "slider"]])
addSliderGroup(svg, 100, "Teachers", [[30, 50, "teacher-student ratio", "slider"]])
addSliderGroup(svg, 215, "Selected Population", [[11, 100, "first language not english %", "slider"],
	[13, 100,"english language learner %", "slider"], [15, 100, "students with disabilities %", "slider"],
	 [17, 100, "low income %", "slider"]])
container = addSliderGroup(svg, 430, "Race", [[33, 100, "African American %", "slider"],
	[34, 100, "Asian %", "slider"],[35, 100, "Hispanic %", "slider"]
	,[36, 100, "White %", "slider"],[37, 100, "Native %", "slider"]])
container.attr("id", "race-sliders")
addSliderGroup(svg, 650, "Gender", [[38, 100, "male:female %", "slider"]])
addSliderGroup(svg, 750, "Incidents", [[49, 5000, "# of incidents", "slider"]])

var arc = d3.arc()
    .innerRadius(180)
    .outerRadius(240)
    .startAngle(0);

successPred = svg2.select(".success-vis")
	.attr("transform", "translate(" + 240 + "," + 300 + ")");;

arc1 = successPred.append("path")
	.datum({endAngle: tau})
    .style("fill", "#ddd")
    .attr("d", arc);

arc2 = successPred.append("path")
.datum({endAngle: 0 * tau})
.style("fill", "green")
.attr("d", arc);

prediction = successPred.append("text")
	.text("0.0")
	.attr("class", "predict-label")
	.attr("text-anchor", "middle")
	.attr("transform", "translate(" + 0 + "," + 50 + ")");


var startColor = '#ff0000';
var endColor = '#00ff00';
colorScale = d3.scaleLinear().domain([0, 10]).range([startColor, endColor]);


function getSuccess() {

	fields = ['-fields']
    values = ['-vals']
	var results = d3.selectAll(".slider-result").each(function(d) {
		field = d3.select(this).attr("id")
		value = d3.select(this).text()
		
		if (value == "-"){
			fields.push(field)
			values.push("")
		} else {
			if (field == "38") {
				female = 100 - parseInt(value)
				fields.push("39")
				values.push(female.toString())
			}
			fields.push(field)
			values.push(value)
			
		}
		
	})
	var results = d3.selectAll(".selector").each(function(d) {
		value = d3.select(this).property("value")
		field = d3.select(this).attr("id");
		
		if (value == "None") {
			value = ""
		} else {
			if (field == "56") {
				value = (value == "Charter") ? "1" : "0"
			}
		}
		fields.push(field)
		values.push(value)
	})
	console.log(fields)
	console.log(values)

    $.get('/success', {fields: fields, values: values}, function(res){
        console.log("received success");
        console.log(res/10);
        $("#prediction").text(res)
        arc2.attr("d", function(d) {
        	d.endAngle = res/10 * tau;
        	return arc(d);
        }).style("fill", function(d) {
        	return colorScale(res)
        });
        prediction.text(res)
    });
}

d3.select("#reset").on("click", function(d,i) {
	d3.selectAll(".slider-result").each(function(d) {
		d3.select(this).text("-")
		d3.select(this.parentNode).select(".handle").attr("cx", 0);
	})
	d3.selectAll(".selector").each(function(d) {
		if (d3.select(this).attr("id") == "1") {
			d3.select(this).property("value", "2002")
		} else {
			d3.select(this).property("value", "None")
		}
	})
	getSuccess()
})



