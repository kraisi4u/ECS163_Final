function translateEducationCode(code) {
    const codeMap = {
        1: "Secondary Education - 12th Year of Schooling or Eq.",
        2: "Higher Education - Bachelor's Degree",
        3: "Higher Education - Degree",
        4: "Higher Education - Master's",
        5: "Higher Education - Doctorate",
        6: "Frequency of Higher Education",
        9: "12th Year of Schooling - Not Completed",
        10: "11th Year of Schooling - Not Completed",
        11: "7th Year (Old)",
        12: "Other - 11th Year of Schooling",
        14: "10th Year of Schooling",
        18: "General commerce course",
        19: "Basic Education 3rd Cycle (9th/10th/11th Year) or Equiv.",
        22: "Technical-professional course",
        26: "7th year of schooling",
        27: "2nd cycle of the general high school course",
        29: "9th Year of Schooling - Not Completed",
        30: "8th year of schooling",
        34: "Unknown",
        35: "Can't read or write",
        36: "Can read without having a 4th year of schooling",
        37: "Basic education 1st cycle (4th/5th year) or equiv.",
        38: "Basic Education 2nd Cycle (6th/7th/8th Year) or Equiv.",
        39: "Technological specialization course",
        40: "Higher education - degree (1st cycle)",
        41: "Specialized higher studies course",
        42: "Professional higher technical course",
        43: "Higher Education - Master (2nd cycle)",
        44: "Higher Education - Doctorate (3rd cycle)"
    };
    return codeMap[Number(code)] || "Unknown code";
}



// Helper to count occurrences in an array
function countOccurrences(arr) {
    const counts = {};
    arr.forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
}


/**
 * Function to build all static visualizations for the mother's qualifications.
 * @param {raw dataset to draw from} data 
 * @param {x cordinate to draw viz} cordX 
 * @param {y cordinate to draw viz} cordY 
 */
function motherQuals(data, cordX, cordY){
    const motherQuals = data.map(d => translateEducationCode(d["Mother's qualification"]));
    const counts = countOccurrences(motherQuals);

    const qualCountsArray = Object.entries(counts).map(([qualification, count]) => ({
        qualification,
        count
    }));
    console.log("qualCountsArray", qualCountsArray);


    //process data to consolidate small slices
    const processedData = consolidateSmallSlices(qualCountsArray, 40)

    //draw pi chart
    drawPiChart(processedData, '#graph1', cordX, cordY, showDrilldownChart, "Mother's Qualifications Distribution");




      //TODO: Draw bar graph
}

/**
 * Function to build all static visualizations for the father's qualifications.
 * @param {raw dataset to draw from} data 
 * @param {x cordinate to draw viz} cordX 
 * @param {y cordinate to draw viz} cordY 
 */
function fatherQuals(data, cordX, cordY){
    const fatherQuals = data.map(d => translateEducationCode(d["Father's qualification"]));
    const counts = countOccurrences(fatherQuals);

    const qualCountsArray = Object.entries(counts).map(([qualification, count]) => ({
        qualification,
        count
    }));
    console.log("qualCountsArray", qualCountsArray);

    //process data to consolidate small slices
    const processedData = consolidateSmallSlices(qualCountsArray, 40)
    drawPiChart(processedData, '#graph1', cordX, cordY, showDrilldownChart, "Father's Qualifications Distribution");
}

/**
 * Helper function to consolidate slices below threshold into one "other" slice.
 * @param {data to draw from} data 
 * @param {threshold to consolidate} threshold 
 * @returns 
 */
function consolidateSmallSlices(data, threshold) {
  const main = [];
  const small = [];
  let smallSum = 0;
  data.forEach(d => {
    if (d.count < threshold) {
      small.push(d);
      smallSum += d.count;
    } else {
      main.push(d);
    }
  });
  if (small.length) {
    main.push({
      qualification: "Other",
      count: smallSum,
      _otherData: small
    });
  }
  return main;
}

/**
 * Helper function to show drilldown chart of a consolidated slice
 * @param {data to draw from} data
 * @param {id of svg to draw at} svg_id 
 * @param {Original title of the chart} ogTitle
 * @param {X coordinate} cordX
 * @param {Y coordinate} cordY
 */
function showDrilldownChart(data, svg_id, ogTitle, cordX, cordY) {

    console.log("drill called")
    const otherSlice = data.find(d => d.qualification === "Other");
    if (!otherSlice || !otherSlice._otherData) {
        console.error("No _otherData found for label:", label, data);
        return;
    }
    drawPiChart(otherSlice._otherData, svg_id, cordX, cordY, null, "Other");
    // Add a Back button (optional)
    d3.select("#graph1")
      .append("text")
      .attr("x", 20)
      .attr("y", 30)
      .attr("fill", "yellow")
      .attr("font-size", "30px")
      .style("cursor", "pointer")
      .text("← Back")
      .on("click", function(){
        console.log(data);
        drawPiChart(data, svg_id, cordX, cordY, showDrilldownChart, ogTitle)});
}

/**
 * Draw pi chart with d3js
 * @param {Array} data - Array of objects, each with { qualification, count }
 * @param {String} svg_id - SVG selector (e.g., "#mySVG")
 * @param {Number} cordX - X coordinate (not used in this example)
 * @param {Number} cordY - Y coordinate (not used in this example)
 * @param {onOtherClick} onOtherClick -  function to render drill downdisplay when "Other" slice is clicked
 */
function drawPiChart(data, svg_id, cordX, cordY, onOtherClick, title){
    const margin = 150; 
    const width = 1000, height = 1000, radius = Math.min(width, height) / 2 - margin;

    // Select and clear SVG
    const svg = d3.select(svg_id)
        .attr("width", "100%")
        .attr("height", "auto")
        .attr("viewBox", "0 0 1000 1000")
        .attr("style", "max-width: 100%; height: auto; background-color:rgb(255, 255, 255)");
    svg.selectAll("*").remove();

    // Main chart group
    const g = svg.append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

    // Tooltip group (background + text)
    const tooltip = svg.append("g")
    .attr("id", "svg-tooltip")
    .style("pointer-events", "none")
    .style("opacity", 0);

    tooltip.append("rect")
    .attr("fill", "rgba(0,0,0,0.7)")
    .attr("rx", 6);

    tooltip.append("text")
    .attr("fill", "white")
    .attr("font-size", "18px")
    .attr("x", 8)
    .attr("y", 24);
    
    // Pie data
    const pie = d3.pie().value(d => d.count);
    const pieData = pie(data);

    // Use interpolator for gradient colors
    const interpolator = d3.interpolateCool; 
    const numSlices = pieData.length;

    // Arc generator
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Draw pie slices
    g.selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) =>
            numSlices === 1
            ? interpolator(0)
            : interpolator(i / (numSlices - 1))
        )
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(d) { //Interactive tooltip on hover
            tooltip.style("opacity", 1);
            tooltip.select("text")
                .text(`${d.data.qualification} (${d.data.count})`);

                // Get text size for rect
                const textElem = tooltip.select("text").node();
                const bbox = textElem.getBBox();
                const padding = 8;

                tooltip.select("rect")
                    .attr("x", bbox.x - padding)
                    .attr("y", bbox.y - padding)
                    .attr("width", bbox.width + padding * 2)
                    .attr("height", bbox.height + padding * 2);
        })
        .on("mousemove", function(d) {      
            const [x, y] = d3.mouse(svg.node());
            var offsetX = 10, offsetY = 10;
            tooltip.attr("transform", `translate(${x + offsetX},${y + offsetY})`);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(150)
                .attr("transform", `translate(0,0)`)
                .attr("stroke", "white")
                .attr("stroke-width", 2);
            tooltip.style("opacity", 0);
        })
        .on("click", function(d) { //Clicking on Other allows for drill down pi chart of other smaller slices 
        if(d.data.qualification === "Other" && d.data._otherData && typeof onOtherClick === "function") {
            onOtherClick(data, svg_id, title, cordX, cordY);
        }
        })
        .transition() //Animation for drawing pi slices
        .duration(800)
        .attrTween("d", function(d) {
            const i = d3.interpolate(
                { startAngle: d.startAngle, endAngle: d.startAngle },
                d
            );
            return function(t) {
                return arc(i(t));
            }
        });



    // Place labels outside the pie with polylines
    var outerArc = d3.arc()
        .innerRadius(radius * 1.1)
        .outerRadius(radius * 1.1);

    g.selectAll("polyline")
    .data(pieData)
    .enter()
    .append("polyline")
    .attr("points", function(d) {
        var posA = arc.centroid(d); // centroid of arc
        var posB = outerArc.centroid(d); // just outside the arc
        var posC = outerArc.centroid(d); // label position
        posC[0] = radius * 1.2 * (midAngle(d) < Math.PI ? 1 : -1); // align left/right
        return [posA, posB, posC];
    })
    .style("fill", "none")
    .style("stroke", "gray")
    .style("stroke-width", 1)
    .style("display", function(d) {
    // hide for small slices 
    return (d.endAngle - d.startAngle) > 0.2 ? null : "none";
    });

    //render the actual label
    g.selectAll("text")
    .data(pieData)
    .enter()
    .append("text")
    .attr("font-size", "25px")
    .attr("transform", function(d) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 1.25 * (midAngle(d) < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
    })
    .attr("text-anchor", function(d) {
        return midAngle(d) < Math.PI ? "start" : "end";
    })
    .text(function(d) {
      return (d.endAngle - d.startAngle) > 0.2 ? d.data.qualification : "";
    });

    function midAngle(d){ //hide label for small slices
    return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    //render chart title
    svg.append("text")
        .attr("x", width / 2)         // Centered horizontally in the SVG
        .attr("y", margin / 2)        // A bit below the top (adjust as needed)
        .attr("text-anchor", "middle")
        .attr("font-size", "32px")
        .attr("font-weight", "bold")
        .attr("fill", "#222")
        .text(title);
    }

/**
 * Area to test the functions
 */
d3.dsv(";", "data.csv").then(rawData =>{
    console.log("raw data", rawData);
    motherQuals(rawData, 900, 900);
    console.log("Mother's qualifications visualized successfully.");

})

