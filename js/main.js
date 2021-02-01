
var data;


d3.json("data/data.json", function(json)){
	console.log(json)
	data = json

}


//prepare SVG

var svgWidth = 1080;
var svgHeight = 480;

var width = svgWidth - 64;
var height = (svgHeight - 56) / 2;
var barPadding = 4;
var barWidth = width / 5 - barPadding;
var miniBar = 8;
var barOffsetX = 56;
var barOffsetY = 40;

var svg = d3.select("div.graph")
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight)
		.style("background-color", "#333333")
		.style("border-radius", "8px");

var gAxisY = svg.append("g");
var gAxisX = svg.append("g");


var options;


function updateScaleX(){

	return d3.scaleLinear()
		.domain([0,options.something])
		.range([0, svgWidth-100]);

}

function updateScaleY(){

	return d3.scaleLinear()
		.domain([0,100])
		.range([svgHeight/2,10]);

}

function renderGraph(){

	//create Axis

	var x = updateScaleX();
	var y = updateScaleY();

	var xAxis = d3.axisBottom()
		.scale(x)

	var yAxis = d3.axisLeft()
		.scale(y)

	d3.select(".graph").attr("width", svgWidth);

	var xAxisTranslate = svgHeight/2 + 10;
	
	axisY = gAxisX.attr("class","axis").call(yAxis).attr("transform", "translate(50,10)") //this is for allignment
	axisX = gAxisY.attr("class","axis").call(xAxis).attr("transform", "translate(50, " + xAxisTranslate + ")") //this is for allignment
	
}

function updateGraph(){

	//update Axis

	var x = updateScaleX();
	var y = updateScaleY();

	var xAxis = d3.axisBottom()
		.scale(x)

	var yAxis = d3.axisLeft()
		.scale(y)

	axisY.transition().call(yAxis)
	axisX.transition().call(xAxis)

}

function deserialize(str) {
    var json = `(${str})`
        .replace(/_/g, ' ')
        .replace(/-/g, ',')
        .replace(/\(/g, '{')
        .replace(/\)/g, '}')
        .replace(/([a-z]+)/gi, '"$1":')
        .replace(/"(true|false)":/gi, '$1');

        return JSON.parse(json);
}

function serialize(obj) {

	return Object.keys(obj)
		.reduce((acc, key) => {
			return /^(?:true|false|\d+)$/i.test('' + obj[key])
				? `${acc}-${key}_${obj[key]}`
				: `${acc}-${key}_(${serialize(obj[key])})`;
		}, '')
		.slice(1);
}

function updateData() {

    options.something = parseInt(document.getElementById('select_something').value);
    window.location.hash = encodeURIComponent(serialize(options));

}

function optionsLoad() {

    if (!window.location.hash) return;
    options = deserialize(window.location.hash.slice(1));

    function validBoolean(q) {

		return q == 1;
	}

	function validIntRange(min, max, num) {

		return num < min ? min : num > max ? max : parseInt(num, 10);
	}


    options.something = validIntRange(0, 3, options.something);
	document.getElementById('select_something').value = options.something;


}


function refresh() {
	updateData();
	updateGraph();
}

function rebuild() {


	gAxisX.selectAll("*").remove();
	gAxisY.selectAll("*").remove();

	updateData();
	renderGraph();
}

function initial() {
	optionsLoad();
	updateData();
	renderGraph();
}

document.addEventListener('DOMContentLoaded', initial);
document.addEventListener('click', function (event) {
	if (event.target.id === 'reset') window.location = 'index.html';
});