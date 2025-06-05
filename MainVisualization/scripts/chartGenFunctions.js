/**
 * Contains functions to generate charts
 */


import {
    translateEducationCode,
    translateFatherJobCode,
    translateJobCode
} from "./translations.js";

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
    data.forEach((d) => {
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
            _otherData: small,
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
function showDrilldownChart(data, svg_id_or_element, ogTitle, expanded = false) {
    console.log("drill called");
    const otherSlice = data.find((d) => d.key === "Other");
    if (!otherSlice || !otherSlice._otherData) {
        console.error("No _otherData found for label:Other", data);
        return;
    }

    // Always use a D3 selection for the SVG
    const svg = typeof svg_id_or_element === "string"
        ? d3.select(svg_id_or_element)
        : svg_id_or_element;

    if (expanded) {
        drawPiChart(otherSlice._otherData, svg, null, "Other", expanded);
    } else {
        drawPiChart(otherSlice._otherData, svg, null, "Other");
    }

    // Add a Back button (optional)
    svg.append("text")
        .attr("x", 20)
        .attr("y", 30)
        .attr("fill", "blue")
        .attr("font-size", "10px")
        .style("cursor", "pointer")
        .text("← Back")
        .on("click", function () {
            if (expanded) {
                drawPiChart(
                    data,
                    svg,
                    showDrilldownChart,
                    ogTitle,
                    expanded
                );
            } else {
                drawPiChart(data, svg, showDrilldownChart, ogTitle);
            }
        });
}

/**
 * Draw pi chart with d3js
 * @param {Array} data - Array of objects, each with { key, count }
 * @param {String} svg_id_or_element - SVG to Render the chart in, e.g. "#graph1" or d3 selection
 * @param {onOtherClick} onOtherClick -  function to render drill downdisplay when "Other" slice is clicked
 * @param {String} title - Title of the chart
 * @param {Boolean} expanded - check to see which version to render
 */
function drawPiChart(
    data,
    svg_id_or_element,
    onOtherClick,
    title,
    expanded = false
) {
    //Set default sizes, intended for minimized viz
    let width = 350;
    let height = 350;
    let margin = 80;
    let radius = Math.min(width, height) / 2 - margin;

    let labelFontSize = "5px";
    let titleFontSize = "14px";
    let tooltipFontSize = "6px";
    if (expanded) {
        console.log("expanded version of chart");
        // If expanded, adjust font sizes
        labelFontSize = "18px";
        titleFontSize = "32px";
        tooltipFontSize = "14px";
        //adjust chart sizes
        width = 1800;
        height = 600;
        margin = 120;
        radius = Math.min(width, height) / 2 - margin;
    }
    // Remove existing chart if present - handle both string selectors and D3 selections
    const svg =
        typeof svg_id_or_element === "string"
            ? d3.select(svg_id_or_element)
            : svg_id_or_element;
    svg.selectAll("*").remove();

    // Set SVG attributes for pie chart
    svg.attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr(
            "style",
            "max-width: 100%; height: auto; background-color:rgb(255, 255, 255)"
        );

    // Main chart group
    const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Tooltip group (background + text)
    const tooltip = svg
        .append("g")
        .attr("id", "svg-tooltip")
        .style("pointer-events", "none")
        .style("opacity", 0);

    tooltip.append("rect").attr("fill", "rgba(0,0,0,0.7)").attr("rx", 6);

    tooltip
        .append("text")
        .attr("fill", "white")
        .attr("font-size", tooltipFontSize)
        .attr("x", 8)
        .attr("y", 24);

    // Pie data
    const pie = d3.pie().value((d) => d.count);
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
        .on("mouseover", function (event, d) {
            tooltip.style("opacity", 1);
            tooltip.select("text").text(`${d.data.key} (${d.data.count})`);

            const textElem = tooltip.select("text").node();
            const bbox = textElem.getBBox();
            const padding = 8;

            tooltip
                .select("rect")
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
        .on("mousemove", function (event, d) {
            const [x, y] = d3.pointer(event, svg.node());
            var offsetX = 10,
                offsetY = 10;
            tooltip.attr(
                "transform",
                `translate(${x + offsetX},${y + offsetY})`
            );
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition()
                .duration(150)
                .attr("transform", "translate(0,0)"); // <-- Reset transform
            tooltip.style("opacity", 0);
        })
        .on("click", function (event, d) {
            if (
                d.data.key === "Other" &&
                d.data._otherData &&
                typeof onOtherClick === "function"
            ) {
                if (expanded) {
                    onOtherClick(data, svg_id_or_element, title, expanded);
                } else {
                    onOtherClick(data, svg_id_or_element, title);
                }
            }
        })
        .transition()
        .duration(800)
        .attrTween("d", function (d) {
            const i = d3.interpolate(
                { startAngle: d.startAngle, endAngle: d.startAngle },
                d
            );
            return function (t) {
                return arc(i(t));
            };
        });

    // Place labels outside the pie with polylines
    var outerArc = d3
        .arc()
        .innerRadius(radius * 1.1)
        .outerRadius(radius * 1.1);

    g.selectAll("polyline")
        .data(pieData)
        .enter()
        .append("polyline")
        .attr("points", function (d) {
            var posA = arc.centroid(d); // centroid of arc
            var posB = outerArc.centroid(d); // just outside the arc
            var posC = outerArc.centroid(d); // label position
            posC[0] = radius * 1.05 * (midAngle(d) < Math.PI ? 1 : -1); // align left/right
            return [posA, posB, posC];
        })
        .style("fill", "none")
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .style("display", function (d) {
            // hide for small slices
            if (!expanded) return "none";
            return d.endAngle - d.startAngle > 0.2 ? null : "none";
        });

    //render the actual label
    g.selectAll("text")
        .data(pieData)
        .enter()
        .append("text")
        .attr("font-size", labelFontSize)
        .attr("transform", function (d) {
            var pos = outerArc.centroid(d);
            pos[0] = radius * 1.07 * (midAngle(d) < Math.PI ? 1 : -1);
            return "translate(" + pos + ")";
        })
        .attr("text-anchor", function (d) {
            return midAngle(d) < Math.PI ? "start" : "end";
        })
        .style("display", expanded ? null : "none") //Hide labels if not expanded
        .text(function (d) {
            return d.endAngle - d.startAngle > 0.2 ? d.data.key : "";
        });

    function midAngle(d) {
        //hide label for small slices
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    //render chart title
    svg.append("text")
        .attr("x", width / 2) // Centered horizontally in the SVG
        .attr("y", margin / 2) // A bit below the top (adjust as needed)
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
    data.forEach((d) => {
        let key = d[factor];
        // translate key based on code
        if (
            factor === "Mother's qualification" ||
            factor === "Father's qualification"
        ) {
            key = translateEducationCode(key);
        } else if (factor === "Mother's occupation") {
            key = translateJobCode(key);
        } else if(factor == "Father's occupation") {
            key = translateFatherJobCode(key);
        }
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
    Object.keys(result).forEach((key) => {
        const { enrolledOrGraduate, dropout, total } = result[key];
        result[key].enrolledOrGraduatePct =
            total > 0 ? enrolledOrGraduate / total : 0;
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
function drawBarChart(data, svg_id_or_element, title, expanded = false) {
    // Set up SVG dimensions and margins based on expanded
    let margin, width, height, labelFontSize;
    if (expanded) {
        margin = { top: 150, right: 200, bottom: 250, left: 180 };
        width = 1800 - margin.left - margin.right;
        height = 900 - margin.top - margin.bottom;
        labelFontSize = "18px";
    } else {
        margin = { top: 200, right: 170, bottom: 250, left: 100 };
        width = 1200 - margin.left - margin.right;
        height = 1000 - margin.top - margin.bottom;
        labelFontSize = "16px";
    }

    // Prepare the labels and datasets
    var labels = data.map((d) => d.key);
    var subgroups = ["Enrolled or Graduate", "Dropout"];
    var chartData = data.map((d) => ({
        label: d.key,
        "Enrolled or Graduate": d.enrolledOrGraduatePct * 100,
        Dropout: d.dropoutPct * 100,
        total: d.total,
    }));

    // Remove existing chart if present - handle both string selectors and D3 selections
    const svg =
        typeof svg_id_or_element === "string"
            ? d3.select(svg_id_or_element)
            : svg_id_or_element;
    svg.selectAll("*").remove();

    // Create SVG and chart group
    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr(
            "viewBox",
            `0 0 ${width + margin.left + margin.right} ${
                height + margin.top + margin.bottom
            }`
        )
        .attr(
            "style",
            "max-width: 100%; height: auto; background-color:rgb(255, 255, 255)"
        );

    // Main group for chart content (this is what will be panned)
    var chartGroup = svg
        .append("g")
        .attr("class", "chart-content")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x0 = d3.scaleBand().domain(labels).range([0, width]).paddingInner(0.2);

    var x1 = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, x0.bandwidth()])
        .padding(0.05);

    // Y axis
    var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // Colors
    var color = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range(["#36A2EB", "#FF6384"]);

    // Add X axis
    chartGroup
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start")
        .attr("font-size", labelFontSize);

    // Add Y axis
    chartGroup
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("font-size", labelFontSize);

    // Y axis label
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 50)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", labelFontSize)
        .attr("font-weight", "bold")
        .text("Proportion of Students (%)");

    // X axis label
    chartGroup
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 40)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("font-size", labelFontSize)
        .text("Factor");

    // Title
    chartGroup
        .append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", expanded ? "36px" : "18px")
        .attr("font-weight", "bold")
        .text(title);

    // Draw bars
    var groups = chartGroup
        .selectAll("g.bar-group")
        .data(chartData)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", function (d) {
            return "translate(" + x0(d.label) + ",0)";
        });

    //establish tooltip
    const tooltip = svg
        .append("g")
        .attr("id", "svg-tooltip")
        .style("pointer-events", "none")
        .style("opacity", 0);

    tooltip.append("rect").attr("fill", "rgba(0,0,0,0.7)").attr("rx", 6);

    tooltip
        .append("text")
        .attr("fill", "white")
        .attr("font-size", expanded ? "28px" : "18px")
        .attr("x", 8)
        .attr("y", 24);

    //draw the actual bars
    groups
        .selectAll("rect")
        .data(function (d) {
            return subgroups.map(function (key) {
                return { key: key, value: d[key] };
            });
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x1(d.key);
        })
        .attr("y", function (d) {
            return y(0);
        })
        .attr("width", x1.bandwidth())
        .attr("height", 0)
        .attr("fill", function (d) {
            return color(d.key);
        })
        .on("mouseover", function (event, d) {
            tooltip.style("opacity", 1);
            tooltip.select("text").text(`${d.key} (${d.value.toFixed(1)}%)`);
            var textElem = tooltip.select("text").node();
            var bbox = textElem.getBBox();
            var padding = 8;
            tooltip
                .select("rect")
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + padding * 2)
                .attr("height", bbox.height + padding * 2);
        })
        .on("mousemove", function (event, d) {
            var coords = d3.pointer(event, svg.node());
            var offsetX = 0,
                offsetY = 0;
            tooltip.attr(
                "transform",
                "translate(" +
                    (coords[0] + offsetX) +
                    "," +
                    (coords[1] + offsetY) +
                    ")"
            );
        })
        .on("mouseout", function (event, d) {
            tooltip.style("opacity", 0);
        })
        .transition()
        .duration(800)
        .delay(function (d, i) {
            return i * 80;
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        });

    // Add bar group count labels
    groups
        .append("text")
        .attr("x", x0.bandwidth() / 2)
        .attr("y", function (d) {
            var maxVal = Math.max(d["Enrolled or Graduate"], d["Dropout"]);
            return y(maxVal) - 10;
        })
        .attr("text-anchor", "middle")
        .attr("font-size", expanded ? "8px" : "10px")
        .attr("fill", "#222")
        .text(function (d) {
            return "n=" + d.total;
        });

    // Add legend
    var legend = svg
        .append("g")
        .attr("class", "legend")
        .attr(
            "transform",
            "translate(" +
                margin.left +
                "," +
                (height +
                    margin.top +
                    margin.bottom -
                    subgroups.length * 34 -
                    10) +
                ")"
        );

    legend
        .selectAll("g")
        .data(subgroups)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * (expanded ? 34 : 24) + ")";
        })
        .each(function (d, i) {
            d3.select(this)
                .append("rect")
                .attr("width", expanded ? 28 : 18)
                .attr("height", expanded ? 28 : 18)
                .attr("fill", color(d));
            d3.select(this)
                .append("text")
                .attr("x", expanded ? 36 : 26)
                .attr("y", expanded ? 14 : 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .style("font-size", expanded ? "22px" : "13px")
                .text(d);
        });
}
export {
    consolidateSmallSlices,
    drawPiChart,
    drawBarChart,
    countProportions,
    showDrilldownChart,
};