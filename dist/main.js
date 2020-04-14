/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// const d3 = require('d3');\nlet height = 600;\nlet width = 760;\n\n\nlet projection = d3.geo.mercator().center([-120, 37]).translate([width / 2, height / 2]).scale([width * 3.3]);\nlet path = d3.geo.path().projection(projection);\nlet h1 = document.getElementById('header');\nlet textYear = document.getElementById('formatDataYear');\n\nconst svg = d3.select('div')\n.append('svg')\n.attr('width', width)\n.attr('height', height);\n\nconst div = d3.select('div')\n.append('div')\n.attr('class', 'tooltip')\n.style('opacity', 0);\n\n\n\nlet CrimeTitle = function(str) {\n    let string = str.split('_')\n    let words = [];\n    \n    for (let i = 0; i < string.length; i++){\n        let word = string[i];\n        let firstChar = word[0].toUpperCase();\n        let rest = word.slice(1).toLowerCase();\n        fullWord = firstChar +rest;\n        words.push(fullWord);\n    }\n    \n    return words.join(' ');\n}\n\nconst lowColor = '#f9f9f9';\nconst highColor = '#df002c';\n\nlet d3Mapping = (year, type, lowColor, highColor) =>(\n    d3.csv(`./clean_data/CaliforniaCrimeData-${year}.csv`, function(data){\n        h1.innerHTML = `California ${CrimeTitle(type)}* by County in ${year}`;\n        textYear.innerHTML = `${year}`;\n\n        let dataArr = [];\n        for (let i = 0; i < data.length; i++) {\n            dataArr.push(parseFloat(data[i][`${type}`]))\n        }\n\n        let minValue = d3.min(dataArr);   // Lightest color for min Value\n        let maxValue = d3.max(dataArr);  //darkest color for max Value\n\n        let colorRange = d3.scale.linear().domain([minValue, maxValue]).range([lowColor, highColor])\n\n        //loading geojson data with cali data\n        d3.json(\"./california_counties.json\", function(json){\n            for (let i = 0; i < data.length; i++){\n                let dataCounty = data[i].county;\n                let dataValue = data[i][`${type}`];\n\n                for (let j = 0; j < json.features.length; j++) {\n                    let jsonCounty = json.features[j].properties.NAME;\n\n                    if (dataCounty == jsonCounty) {\n                        json.features[j].properties.value = dataValue;\n\n                        break;\n                    }\n                }\n            }\n\n            svg.selectAll('path')\n                .data(json.features)\n                .enter()\n                .append('path')\n                .attr('d', path)\n                .style('stroke', \"#fff\")\n                .style('stroke-width', '1')\n                .style('fill', function (d) { return colorRange(d.properties.value) })\n                .on('mouseover', function (d) {\n                    div.transition()\n                        .duration(200)\n                        .style('opacity', .9);\n                    div.html(d.properties.NAME + \"<br/>\" + 'Rate: ' + d.properties.value)\n                        .style('left', (event.clientX - 275) + 'px')\n                        .style('top', (event.clientY - 80) + 'px');\n                })\n                .on('mouseout', function (d) {\n                    div.transition()\n                        .duration(500)\n                        .style('opacity', 0);\n                });\n\n                // data legend \n                let w = 140, h= 300;\n            let key = d3.select(\"div\")\n                .append(\"svg\")\n                .attr(\"width\", w)\n                .attr(\"height\", h)\n                .attr(\"class\", \"legend\");\n\n            let legend = key.append(\"defs\")\n                .append(\"svg:linearGradient\")\n                .attr(\"id\", \"gradient\")\n                .attr(\"x1\", \"100%\")\n                .attr(\"y1\", \"0%\")\n                .attr(\"x2\", \"100%\")\n                .attr(\"y2\", \"100%\")\n                .attr(\"spreadMethod\", \"pad\");\n\n            legend.append(\"stop\")\n                .attr(\"offset\", \"0%\")\n                .attr(\"stop-color\", highColor)\n                .attr(\"stop-opacity\", 1);\n\n            legend.append(\"stop\")\n                .attr(\"offset\", \"100%\")\n                .attr(\"stop-color\", lowColor)\n                .attr(\"stop-opacity\", 1);\n\n            key.append(\"rect\")\n                .attr(\"width\", w - 100)\n                .attr(\"height\", h)\n                .style(\"fill\", \"url(#gradient)\")\n                .attr(\"transform\", \"translate(0,10)\");\n\n            let y = d3.scale.linear()\n                .range([h, 0])\n                .domain([minValue, maxValue]);\n\n            let yAxis = d3.svg.axis().scale(y).orient(\"right\");\n\n            key.append(\"g\")\n                .attr(\"class\", \"y axis\")\n                .attr(\"transform\", \"translate(41,10)\")\n                .call(yAxis)\n        });\n\n    })\n\n)\n\nconst slider = document.getElementById('dataYear');\n\nconst radios = document.getElementsByName('crime');\nlet crimeRateType;\n\nfor (let i = 0; i < radios.length; i++) {\n    radios[i].addEventListener('change', function (e) {\n        let radio = event.target;\n        if (radio.checked) {\n            crimeRateType = radio.value;\n            d3.selectAll('svg > *').remove();\n            d3Mapping(slider.value, crimeRateType, lowColor, highColor);\n        }\n    });\n\n    if (radios[i].checked) {\n        crimeRateType = radios[i].value;\n    }\n}\n\n    slider.oninput = function () {\n    d3.selectAll('svg > *').remove();\n    d3.selectAll('table').remove();\n    d3Mapping(slider.value, crimeRateType, lowColor, highColor);\n    yearTable(slider.value);\n    }\n\n\n// Initializing\nd3Mapping(slider.value, crimeRateType, lowColor, highColor);\n\nvar tabulate = function (data, columns) {\n    var table = d3.select('body').append('table')\n    var thead = table.append('thead')\n    var tbody = table.append('tbody')\n\n    thead.append('tr')\n        .selectAll('th')\n        .data(columns)\n        .enter()\n        .append('th')\n        .text(function (d) { return d })\n\n    var rows = tbody.selectAll('tr')\n        .data(data)\n        .enter()\n        .append('tr')\n\n    var cells = rows.selectAll('td')\n        .data(function (row) {\n            return columns.map(function (column) {\n                return { column: column, value: row[column] }\n            })\n        })\n        .enter()\n        .append('td')\n        .text(function (d) { return d.value })\n\n    return table;\n}\n\n\n\nlet yearTable = (year) => (\nd3.csv(`./clean_data/CaliforniaCrimeData-${year}.csv`, function (data) {\n    var columns = ['year', 'county', 'aggravated_assault', 'forcible_rape', 'murder_and_non_negligent_manslaughter', 'robbery', 'total_crimes']\n    tabulate(data, columns)\n})\n)\n\nyearTable(slider.value);\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });