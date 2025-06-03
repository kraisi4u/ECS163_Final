export {
    motherQuals,
    fatherQuals,
    drawPiChart,
    drawBarChart,
    translateEducationCode,
    countProportions
};

/**
 * Translate the education code to readable text
 * @param {the actual code number to transalte} code 
 * @returns 
 */
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
 * Currently will render a pi chart of the distribution of mother's qualification and a bar chart  
 * @param {raw dataset to draw from} data 
 */
function motherQuals(data){

    //extract and map data from codes to readble labels
    const motherQuals = data.map(d => translateEducationCode(d["Mother's qualification"]));
    const counts = countOccurrences(motherQuals);

    //count up each of the qualifications
    const qualCountsArray = Object.entries(counts).map(([key, count]) => ({
        key,
        count
    }));
    console.log("qualCountsArray", qualCountsArray);


    //process data to consolidate small slices
    const processedData = consolidateSmallSlices(qualCountsArray, 40)

    //draw pi chart
    drawPiChart(processedData, '#graph1',showDrilldownChart, "Mother's Qualifications Distribution");

    //Establish ordering of most qualified to least qualified to prepare data for bar chart
    const ordering = [
        "Higher Education - Doctorate (3rd cycle)",
        "Higher Education - Doctorate",
        "Higher Education - Master (2nd cycle)",
        "Higher Education - Master's",
        "Higher Education - Degree",
        "Higher education - degree (1st cycle)",
        "Higher Education - Bachelor's Degree",
        "Specialized higher studies course",
        "Professional higher technical course",
        "Technological specialization course",
        "Technical-professional course",
        "Frequency of Higher Education",
        "General commerce course",
        "Secondary Education - 12th Year of Schooling or Eq.",
        "12th Year of Schooling - Not Completed",
        "Other - 11th Year of Schooling",
        "11th Year of Schooling - Not Completed",
        "Basic Education 3rd Cycle (9th/10th/11th Year) or Equiv.",
        "10th Year of Schooling",
        "9th Year of Schooling - Not Completed",
        "8th year of schooling",
        "7th Year (Old)",
        "7th year of schooling",
        "Basic Education 2nd Cycle (6th/7th/8th Year) or Equiv.",
        "2nd cycle of the general high school course",
        "Basic education 1st cycle (4th/5th year) or equiv.",
        "Can read without having a 4th year of schooling",
        "Can't read or write",
        "Unknown"
        ];
    const proportionData = countProportions(data, "Mother's qualification");
    const orderedArr = ordering
    .map(orderKey => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    })
    console.log("orderedArr", orderedArr);
    //draw bar chart
    //drawBarChart(orderedArr, "#graph1", cordX, cordY, "Mother's Qualification vs Dropout Rate");
}
     

/**
 * Function to build all static visualizations for the father's qualifications.
 * @param data {csv object} raw dataset to draw from
 */
function fatherQuals(data ){
    const fatherQuals = data.map(d => translateEducationCode(d["Father's qualification"]));
    const counts = countOccurrences(fatherQuals);

    const qualCountsArray = Object.entries(counts).map(([qualification, count]) => ({
        qualification,
        count
    }));
    console.log("qualCountsArray", qualCountsArray);

    //process data to consolidate small slices
    const processedData = consolidateSmallSlices(qualCountsArray, 40)
    drawPiChart(processedData, '#graph1', showDrilldownChart, "Father's Qualifications Distribution");

    //Establish ordering of most qualified to least qualified to prepare data for bar chart
    const ordering = [
        "Higher Education - Doctorate (3rd cycle)",
        "Higher Education - Doctorate",
        "Higher Education - Master (2nd cycle)",
        "Higher Education - Master's",
        "Higher Education - Degree",
        "Higher education - degree (1st cycle)",
        "Higher Education - Bachelor's Degree",
        "Specialized higher studies course",
        "Professional higher technical course",
        "Technological specialization course",
        "Technical-professional course",
        "Frequency of Higher Education",
        "General commerce course",
        "Secondary Education - 12th Year of Schooling or Eq.",
        "12th Year of Schooling - Not Completed",
        "Other - 11th Year of Schooling",
        "11th Year of Schooling - Not Completed",
        "Basic Education 3rd Cycle (9th/10th/11th Year) or Equiv.",
        "10th Year of Schooling",
        "9th Year of Schooling - Not Completed",
        "8th year of schooling",
        "7th Year (Old)",
        "7th year of schooling",
        "Basic Education 2nd Cycle (6th/7th/8th Year) or Equiv.",
        "2nd cycle of the general high school course",
        "Basic education 1st cycle (4th/5th year) or equiv.",
        "Can read without having a 4th year of schooling",
        "Can't read or write",
        "Unknown"
        ];
    const proportionData = countProportions(data, "Father's qualification");
    const orderedArr = ordering
    .map(orderKey => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    })
    console.log("orderedArr", orderedArr);
    //draw bar chart
    //drawBarChart(orderedArr, "#graph1", cordX, cordY, "Father's Qualification vs Dropout Rate");
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
      key: "Other",
      count: smallSum,
      _otherData: small
    });
  }
  return main;
}

/**
 * Helper function to show drilldown chart of a consolidated slice
 * @param {Array} data - data to draw from
 * @param {String} svg_id  - id of svg to draw at
 * @param {String} ogTitle - Original title of the chart
 */
function showDrilldownChart(data, svg_id, ogTitle) {

    console.log("drill called")
    const otherSlice = data.find(d => d.key === "Other");
    if (!otherSlice || !otherSlice._otherData) {
        console.error("No _otherData found for label:", label, data);
        return;
    }
    drawPiChart(otherSlice._otherData, svg_id, null, "Other");
    // Add a Back button (optional)
    d3.select("#graph1")
      .append("text")
      .attr("x", 20)
      .attr("y", 30)
      .attr("fill", "blue")
      .attr("font-size", "10px")
      .style("cursor", "pointer")
      .text("← Back")
      .on("click", function(){
        console.log(data);
        drawPiChart(data, svg_id, showDrilldownChart, ogTitle)});
}
/**
 * Helper function that readjusts label position based on the x coordinate.
 * @param {Int} x - x coordinate of the label
 * @param {Int} width - width of the chart
 * @param {Int} padding - padding to apply to the label
 * @returns 
 */
function readjustX(x, width, padding = 110) {
    return Math.max(-width/2 + padding, Math.min(width/2 - padding, x));
}

/**
 * Draw pi chart with d3js
 * @param {Array} data - Array of objects, each with { key, count }
 * @param {String} svg_id - SVG to Render the chart in, e.g. "#graph1"
 * @param {onOtherClick} onOtherClick -  function to render drill downdisplay when "Other" slice is clicked
 * @param {object} options - Options for the chart, e.g. { width: 300, height: 300, margin: 60 } For use in expanded version of chart
 */
function drawPiChart(data, svg_id, onOtherClick, title, options = {}) {
    //Set default sizes, intended for minimized viz
    const width = options.width || 350;
    const height = options.height || 350;
    const margin = options.margin || 100;
    const radius = Math.min(width, height) / 2 - margin;

    const labelFontSize = "5px";
    const titleFontSize = "14px";
    const tooltipFontSize = "6px";
    if(options.expanded) {
        // If expanded, adjust font sizes
        labelFontSize = "18px";
        titleFontSize = "32px";
        tooltipFontSize = "14px";
    }
    // Select and clear SVG
    const svg = d3.select(svg_id)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
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
    .attr("font-size", tooltipFontSize)
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
    // --- PIE CHART SLICE EVENTS ---
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
        .attr("transform", "translate(0,0)") // <-- Ensure initial transform is set
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1);
            tooltip.select("text")
                .text(`${d.data.key} (${d.data.count})`);

            const textElem = tooltip.select("text").node();
            const bbox = textElem.getBBox();
            const padding = 8;

            tooltip.select("rect")
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + padding * 2)
                .attr("height", bbox.height + padding * 2);

            // POP OUT EFFECT
            const [x, y] = arc.centroid(d);
            d3.select(this)
                .transition()
                .duration(150)
                .attr("transform", `translate(${x * 0.15},${y * 0.15})`);
        })
        .on("mousemove", function(event, d) {
            const [x, y] = d3.pointer(event, svg.node());
            var offsetX = 10, offsetY = 10;
            tooltip.attr("transform", `translate(${x + offsetX},${y + offsetY})`);
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
                .transition()
                .duration(150)
                .attr("transform", "translate(0,0)"); // <-- Reset transform
            tooltip.style("opacity", 0);
        })
        .on("click", function(event, d) {
            if(d.data.key === "Other" && d.data._otherData && typeof onOtherClick === "function") {
                onOtherClick(data, svg_id, title);
            }
        })
        .transition()
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
        posC[0] = radius * 1.05 * (midAngle(d) < Math.PI ? 1 : -1); // align left/right
        posC[0] = readjustX(posC[0], width); //readjust to make sure it fits
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
    .attr("font-size", labelFontSize)
    .attr("transform", function(d) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 1.07 * (midAngle(d) < Math.PI ? 1 : -1);
        pos[0] = readjustX(pos[0], width);
        return "translate(" + pos + ")";
    })
    .attr("text-anchor", function(d) {
        return midAngle(d) < Math.PI ? "start" : "end";
    })
    .text(function(d) {
      return (d.endAngle - d.startAngle) > 0.2 ? d.data.key : "";
    });

    function midAngle(d){ //hide label for small slices
    return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    //render chart title
    svg.append("text")
        .attr("x", width / 2)         // Centered horizontally in the SVG
        .attr("y", margin / 2)        // A bit below the top (adjust as needed)
        .attr("text-anchor", "middle")
        .attr("font-size", titleFontSize)
        .attr("font-weight", "bold")
        .attr("fill", "#222")
        .text(title);
    }


//Bar chart functionality  

/**
 * Calculates proportions of Enrolled/Graduate vs Dropout for a given factor.
 * @param {Array} data - CSV file
 * @param {String} factor - The factor to calcualte proportions for (e.g., "Mother's qualification" or "Father's qualification").
 * @returns {Object} - An object where each key is a some given factor, and value is { enrolledOrGraduate, dropout, enrolledOrGraduatePct, dropoutPct }
 */
function countProportions(data, factor) {
    const result = {};
    data.forEach(d => {
        const qual = d[factor];
        const key = translateEducationCode(qual); // Use translated code as key
        const status = d.Target;
        if (!result[key]) {
            result[key] = { enrolledOrGraduate: 0, dropout: 0, total: 0 };
        }
        if (status === "Enrolled" || status === "Graduate") {
            result[key].enrolledOrGraduate += 1;
        } else if (status === "Dropout") {
            result[key].dropout += 1;
        }
        result[key].total += 1;
    });

    // Calculate proportions
    Object.keys(result).forEach(key => {
        const { enrolledOrGraduate, dropout, total } = result[key];
        result[key].enrolledOrGraduatePct = total > 0 ? enrolledOrGraduate / total : 0;
        result[key].dropoutPct = total > 0 ? dropout / total : 0;
    });

    return result;
}




/**
 * Draws a grouped bar chart about a certain factor mapped to dropout rate,
 * with drag-to-pan enabled via D3 zoom (pan only, no zoom).
 * @param {Object} data - The result object from countProportions().
 * @param {string} svg_id - The id of the SVG element to render the chart in.
 * @param {string} title - The chart title.
 */
function drawBarChart(data, svg_id, title) {
    // Prepare the labels and datasets
    var labels = data.map(d => d.key);
    var subgroups = ["Enrolled or Graduate", "Dropout"];
    var chartData = data.map(d => ({
        label: d.key,
        "Enrolled or Graduate": d.enrolledOrGraduatePct * 100,
        "Dropout": d.dropoutPct * 100,
        total: d.total
    }));

    // Set up SVG dimensions and margins
    var margin = { top: 60, right: 150, bottom: 200, left: 100 },
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Remove existing chart if present
    d3.select(svg_id).selectAll("*").remove();

    // Create SVG and chart group
    var svg = d3.select(svg_id)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Main group for chart content (this is what will be panned)
    var chartGroup = svg.append("g")
        .attr("class", "chart-content")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x0 = d3.scaleBand()
        .domain(labels)
        .range([0, width])
        .paddingInner(0.2);

    var x1 = d3.scaleBand()
        .domain(subgroups)
        .range([0, x0.bandwidth()])
        .padding(0.05);

    // Y axis
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // Colors
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#36A2EB", "#FF6384"]);

    // Add X axis
    chartGroup.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start");

    // Add Y axis
    chartGroup.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Y axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 50)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", labelFontSize)
        .text("Proportion of Students (%)");

    // X axis label
    chartGroup.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 40)
        .attr("text-anchor", "middle")
        .attr("font-size", labelFontSize)
        .text("Factor");

    // Title
    chartGroup.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2 )
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text(title);

    // Draw bars
    var groups = chartGroup.selectAll("g.bar-group")
        .data(chartData)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", function(d) { return "translate(" + x0(d.label) + ",0)"; });

    //establish tooltip
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

    //draw the actual bars
    groups.selectAll("rect")
        .data(function(d) {
            return subgroups.map(function(key) { return { key: key, value: d[key] }; });
        })
        .enter()
        .append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(0); })
        .attr("width", x1.bandwidth())
        .attr("height", 0)
        .attr("fill", function(d) { return color(d.key); })
        .on("mouseover", function(event, d) { // <-- add event
            tooltip.style("opacity", 1);
            tooltip.select("text")
            .text(`${d.key} (${d.value})`);
            
            // Resize rect to fit text
            var textElem = tooltip.select("text").node();
            var bbox = textElem.getBBox();
            var padding = 8;
            tooltip.select("rect")
            .attr("x", bbox.x - padding)
            .attr("y", bbox.y - padding)
            .attr("width", bbox.width + padding * 2)
            .attr("height", bbox.height + padding * 2);
        })
        .on("mousemove", function(event, d) { // <-- add event
            var coords = d3.pointer(event, svg.node());
            var offsetX = 0, offsetY = 0;
            tooltip.attr("transform", "translate(" + (coords[0] + offsetX) + "," + (coords[1] + offsetY) + ")");
        })
        .on("mouseout", function(event, d) { // <-- add event
            tooltip.style("opacity", 0);
        })
        .transition()
        .duration(800)
        .delay(function(d, i) { return i * 80; }) // stagger bars in each group
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });



    // Add bar group count labels
    groups.append("text")
        .attr("x", x0.bandwidth() / 2)
        .attr("y", function(d) { 
            var maxVal = Math.max(d["Enrolled or Graduate"], d["Dropout"]);
            return y(maxVal) - 10; 
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#222")
        .text(function(d) { return "n=" + d.total; });

    // Add legend 
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (margin.left) + "," + (height + margin.top + margin.bottom - subgroups.length * 24 - 10) + ")");

    legend.selectAll("g")
        .data(subgroups)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + (i * 24) + ")"; })
        .each(function(d, i) {
            d3.select(this).append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", color(d));
            d3.select(this).append("text")
                .attr("x", 26)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .style("font-size", "13px")
                .text(d);
        });


}




