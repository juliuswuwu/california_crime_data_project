// const d3 = require('d3');
let height = 450;
let width = 600;


let projection = d3.geo.mercator().center([-120, 37]).translate([width / 2, height / 2]).scale([width * 3.3]);
let path = d3.geo.path().projection(projection);
let h1 = document.getElementById('header');
let textYear = document.getElementById('formatDataYear');

const svg = d3.select('div')
.append('svg')
.attr('width', width)
.attr('height', height);

const div = d3.select('div')
.append('div')
.attr('class', 'tooltip')
.style('opacity', 0);



let CrimeTitle = function(str) {
    let string = str.split('_')
    let words = [];
    
    for (let i = 0; i < string.length; i++){
        let word = string[i];
        let firstChar = word[0].toUpperCase();
        let rest = word.slice(1).toLowerCase();
        fullWord = firstChar +rest;
        words.push(fullWord);
    }
    
    return words.join(' ');
}

const highColor = '#C20000';
const lowColor = '#F8B6B5';

let d3Mapping = (year, type, lowColor, highColor) =>(
    d3.csv(`./clean_data/CaliforniaCrimeData-${year}.csv`, function(data){
        textYear.innerHTML = `${year}`;
        let dataArr = [];
        for (let i = 0; i < data.length; i++) {
            dataArr.push(parseFloat(data[i][`${type}`]))
        }

        let minValue = d3.min(dataArr);   // Lightest color for min Value
        let maxValue = d3.max(dataArr);  //darkest color for max Value

        let colorRange = d3.scale.linear().domain([minValue, maxValue]).range([lowColor, highColor])

        //loading geojson data with cali data
        d3.json("./california_counties.json", function(json){
            for (let i = 0; i < data.length; i++){
                let dataCounty = data[i].county;
                let dataValue = data[i][`${type}`];

                for (let j = 0; j < json.features.length; j++) {
                    let jsonCounty = json.features[j].properties.NAME;

                    if (dataCounty == jsonCounty) {
                        json.features[j].properties.value = dataValue;

                        break;
                    }
                }
            }

            svg.selectAll('path')
                .data(json.features)
                .enter()
                .append('path')
                .attr('d', path)
                .style('stroke', "#fff")
                .style('stroke-width', '1')
                .style('fill', function (d) { return colorRange(d.properties.value) })
                .on('mouseover', function (d) {
                    div.transition()
                        .duration(200)
                        .style('opacity', .9);
                    div.html(d.properties.NAME + "<br/>" + 'Cases: ' + d.properties.value)
                        .style('left', 0 + 'px')
                        .style('top', 0 + 'px');
                })
                .on('mouseout', function (d) {
                    div.transition()
                        .duration(500)
                        .style('opacity', 0);
                });

                // data legend 
                let w = 140, h= 200;
            let key = d3.select("div")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("class", "legend");

            let legend = key.append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "100%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            legend.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", highColor)
                .attr("stop-opacity", 1);

            legend.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", lowColor)
                .attr("stop-opacity", 1);

            key.append("rect")
                .attr("width", w - 100)
                .attr("height", h)
                .style("fill", "url(#gradient)")
                .attr("transform", "translate(0,10)");

            let y = d3.scale.linear()
                .range([h, 0])
                .domain([minValue, maxValue]);

            let yAxis = d3.svg.axis().scale(y).orient("right");

            key.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(41,10)")
                .call(yAxis)
        });

    })

)

const slider = document.getElementById('dataYear');

const radios = document.getElementsByName('crime');
let crimeRateType;

for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function (e) {
        let radio = event.target;
        if (radio.checked) {
            crimeRateType = radio.value;
            d3.selectAll('svg > *').remove();
            d3Mapping(slider.value, crimeRateType, lowColor, highColor);
        }
    });

    if (radios[i].checked) {
        crimeRateType = radios[i].value;
    }
}

    slider.oninput = function () {
    d3.selectAll('svg > *').remove();
    d3.selectAll('table').remove();
    d3Mapping(slider.value, crimeRateType, lowColor, highColor);
    yearTable(slider.value);
    }


    
    var tabulate = function (data, columns) {
        var table = d3.select('body').append('table')
        var thead = table.append('thead')
        var tbody = table.append('tbody')
        
        thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function (d) { return d })
        
        var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        
        var cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value })
        
        return table;
    }
      
    let yearTable = (year) => (
        d3.csv(`./clean_data/CaliforniaCrimeData-${year}.csv`, function (data) {
            var columns = ['year', 'county', 'aggravated_assault', 'forcible_rape', 'murder_and_non_negligent_manslaughter', 'robbery', 'total_crimes']
            tabulate(data, columns)
        })
        )
        
d3Mapping(slider.value, crimeRateType, lowColor, highColor);
yearTable(slider.value); 