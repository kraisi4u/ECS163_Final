/**
 * Contians shell functions for generating the expanded and minimized static visulizations and 
 * associated data processing
 */

import {      //functions that actually draw the charts
    drawPiChart,
    drawBarChart,
    countProportions,    
    showDrilldownChart,
    consolidateSmallSlices } from "./chartGenFunctions.js";
import { //functions to translate int codes to human readable labels
    translateEducationCode,
    jobShortLabels,
    fatherJobShortLabels,
    qualificationShortLabels,
    translateJobCode,
    translateNationalityCode,
    translateYesNo
} from "./translations.js";
 


// Helper to count occurrences in an array
function countOccurrences(arr) {
    const counts = {};
    arr.forEach((val) => {
        counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
}

//declare global variable to hold what chart to show
let motherQualsChartType = "bar";
/**
 * Function to build all static visualizations for the mother's qualifications.
 * Currently will render a pi chart of the distribution of mother's qualification and a bar chart
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
 */
function motherQuals(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    //Process data

    //extract and map data from codes to readble labels
    const motherQuals = data.map((d) =>
        translateEducationCode(d["Mother's qualification"])
    );
    const counts = countOccurrences(motherQuals);

    //count up each of the qualifications
    const qualCountsArray = Object.entries(counts).map(([key, count]) => ({
        key,
        count,
    }));
    console.log("qualCountsArray", qualCountsArray);

    //process data to consolidate small slices
    const processedData = consolidateSmallSlices(qualCountsArray, 40);

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
        "Unknown",
    ];
    //process data with regards to dropout proportion
    const proportionData = countProportions(data, "Mother's qualification");
    const orderedArr = ordering.map((orderKey) => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    });
    console.log("orderedArr", orderedArr);

    //Shorten the labels
    const orderedArrWithShortLabels = orderedArr.map(d => ({
    ...d,
    key: qualificationShortLabels[d.key] 
    }));

    // Draw chart and swap button
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();
        containerSelection.selectAll("#pie-btn, #bar-btn").remove();
        // Buttons

        containerSelection
            .append("button")
            .attr("id", "bar-btn")
            .text("1")
            .style("margin-right", "8px")
            .on("click", () => {
                motherQualsChartType = "bar";
                render();
            });

        containerSelection
            .append("button")
            .attr("id", "pie-btn")
            .text("2")
            .on("click", () => {
                motherQualsChartType = "pie";
                render();
            });

        // Ensure SVG exists before drawing
        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        // Chart
        if (motherQualsChartType === "pie") {
            console.log("drawing pie chart");
            drawPiChart(
                processedData,
                svgElement,
                showDrilldownChart,
                "Mother's Qualifications Distribution",
                expanded
            );
        } else {
            drawBarChart(
                orderedArrWithShortLabels,
                svgElement,
                "Mother's Qualification vs Dropout Rate",
                expanded
            );
        }
    }

    render();
}

//declare global variable to hold what chart to show
let fatherQualsChartType = "bar";
/**
 * Function to build all static visualizations for the father's qualifications.
 * @param data {csv object} raw dataset to draw from
 */
function fatherQuals(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    //Process data

    //extract and map data from codes to readble labels
    const fatherQuals = data.map((d) =>
        translateEducationCode(d["Father's qualification"])
    );
    const counts = countOccurrences(fatherQuals);

    //count up each of the qualifications
    const qualCountsArray = Object.entries(counts).map(([key, count]) => ({
        key,
        count,
    }));
    console.log("qualCountsArray", qualCountsArray);

    //process data to consolidate small slices
    const processedData = consolidateSmallSlices(qualCountsArray, 40);

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
        "Unknown",
    ];
    const proportionData = countProportions(data, "Father's qualification");
    const orderedArr = ordering.map((orderKey) => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    });
    console.log("orderedArr", orderedArr);

    //Shorten the labels
    const orderedArrWithShortLabels = orderedArr.map(d => ({
    ...d,
    key: qualificationShortLabels[d.key] 
    }));
    // Draw chart and swap button
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();
        containerSelection.selectAll("#pie-btn, #bar-btn").remove();
        // Buttons
        containerSelection
            .append("button")
            .attr("id", "bar-btn")
            .text("1")
            .style("margin-right", "8px")
            .on("click", () => {
                fatherQualsChartType = "bar";
                render();
            });

        containerSelection
            .append("button")
            .attr("id", "pie-btn")
            .text("2")
            .on("click", () => {
                fatherQualsChartType = "pie";
                render();
            });

        // Ensure SVG exists before drawing
        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        // Chart
        if (fatherQualsChartType === "pie") {
            console.log("drawing pie chart");
            drawPiChart(
                processedData,
                svgElement,
                showDrilldownChart,
                "Father's Qualifications Distribution",
                expanded
            );
        } else {
            drawBarChart(
                orderedArrWithShortLabels,
                svgElement,
                "Father's Qualification vs Dropout Rate",
                expanded
            );
        }
    }

    render();
}




// Global variable to hold what chart to show
let motherJobChartType = "bar";
/**
 * Function to build all static visualizations for the mother's occupation.
 * Renders a pie chart of the distribution of mother's occupation and a bar chart.
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
 * @param {HTMLElement} containerElement - container to render viz in 
 */
function motherJob(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    // Extract and map data from codes to readable labels
    const motherJobs = data.map((d) =>
        translateJobCode(d["Mother's occupation"])
    );
    const counts = countOccurrences(motherJobs);

    // Count up each of the occupations
    const jobCountsArray = Object.entries(counts).map(([key, count]) => ({
        key,
        count,
    }));

    // Process data to consolidate small slices
    const processedData = consolidateSmallSlices(jobCountsArray, 40);
    console.log("processedData", processedData);

    // Establish ordering for bar chart
    const ordering = [
        "Student",
        "Representatives of the Legislative Power and Executive Bodies, Directors, Directors and Executive Managers",
        "Specialists in Intellectual and Scientific Activities",
        "Intermediate Level Technicians and Professions",
        "Administrative staff",
        "Personal Services, Security and Safety Workers and Sellers",
        "Farmers and Skilled Workers in Agriculture, Fisheries and Forestry",
        "Skilled Workers in Industry, Construction and Craftsmen",
        "Installation and Machine Operators and Assembly Workers",
        "Unskilled Workers",
        "Armed Forces Professions",
        "Other Situation",
        "(blank)",
        "Health professionals",
        "teachers",
        "Specialists in information and communication technologies (ICT)",
        "Intermediate level science and engineering technicians and professions",
        "Technicians and professionals, of intermediate level of health",
        "Intermediate level technicians from legal, social, sports, cultural and similar services",
        "Office workers, secretaries in general and data processing operators",
        "Data, accounting, statistical, financial services and registry-related operators",
        "Other administrative support staff",
        "personal service workers",
        "sellers",
        "Personal care workers and the like",
        "Skilled construction workers and the like, except electricians",
        "Skilled workers in printing, precision instrument manufacturing, jewelers, artisans and the like",
        "Workers in food processing, woodworking, clothing and other industries and crafts",
        "cleaning workers",
        "Unskilled workers in agriculture, animal production, fisheries and forestry",
        "Unskilled workers in extractive industry, construction, manufacturing and transport",
        "Unknown code",
    ];
    const proportionData = countProportions(data, "Mother's occupation");
    console.log("proportionData", proportionData);
    const orderedArr = ordering
        .map((orderKey) => {
            const value = proportionData[orderKey];
            if (value === undefined) return null;
            return { key: orderKey, ...value };
        })
        .filter((d) => d !== null);
    console.log("orderedArr", orderedArr);

    const orderedArrWithShortLabels = orderedArr.map(d => ({
    ...d,
    key: jobShortLabels[d.key] 
    }));

    console.log("orderedArrWithShortLabels", orderedArrWithShortLabels);
    // Draw chart and swap button
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();
        containerSelection.selectAll("#pie-btn, #bar-btn").remove();

         containerSelection
            .append("button")
            .attr("id", "bar-btn")
            .text("1")
            .style("margin-right", "8px")
            .on("click", () => {
                motherJobChartType = "bar";
                render();
            });

        containerSelection
            .append("button")
            .attr("id", "pie-btn")
            .text("2")
            .on("click", () => {
                motherJobChartType = "pie";
                render();
            });

        // Ensure SVG exists before drawing
        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        // Chart
        if (motherJobChartType === "pie") {
            drawPiChart(
                processedData,
                svgElement,
                showDrilldownChart,
                "Mother's Occupation Distribution",
                expanded
            );
        } else {
            console.log("drawing bar chart");
            drawBarChart(
                orderedArrWithShortLabels,
                svgElement,
                "Mother's Occupation vs Dropout Rate",
                expanded
            );
        }
    }

    render();
}
// Global variable to hold what chart to show
let fatherJobChartType = "bar";

/**
 * Function to build all static visualizations for the father's occupation.
 * Renders a pie chart of the distribution of father's occupation and a bar chart.
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
 */
function fatherJob(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    // Extract and map data from codes to readable labels
    const fatherJobs = data.map((d) =>
        translateJobCode(d["Father's occupation"])
    );
    const counts = countOccurrences(fatherJobs);

    // Count up each of the occupations
    const jobCountsArray = Object.entries(counts).map(([key, count]) => ({
        key,
        count,
    }));

    // Process data to consolidate small slices
    const processedData = consolidateSmallSlices(jobCountsArray, 40);
    console.log("processedData", processedData);

    // Establish ordering for bar chart
        const ordering = [
        "Student",
        "Representatives of the Legislative Power and Executive Bodies, Directors, Directors and Executive Managers",
        "Specialists in Intellectual and Scientific Activities",
        "Intermediate Level Technicians and Professions",
        "Administrative staff",
        "Personal Services, Security and Safety Workers and Sellers",
        "Farmers and Skilled Workers in Agriculture, Fisheries and Forestry",
        "Skilled Workers in Industry, Construction and Craftsmen",
        "Installation and Machine Operators and Assembly Workers",
        "Unskilled Workers",
        "Armed Forces Professions",
        "Other Situation",
        "(blank)",
        "Armed Forces Officers",
        "Armed Forces Sergeants",
        "Other Armed Forces personnel",
        "Directors of administrative and commercial services",
        "Hotel, catering, trade and other services directors",
        "Specialists in the physical sciences, mathematics, engineering and related techniques",
        "Health professionals",
        "teachers",
        "Specialists in finance, accounting, administrative organization, public and commercial relations",
        "Intermediate level science and engineering technicians and professions",
        "Technicians and professionals, of intermediate level of health",
        "Intermediate level technicians from legal, social, sports, cultural and similar services",
        "Information and communication technology technicians",
        "Office workers, secretaries in general and data processing operators",
        "Data, accounting, statistical, financial services and registry-related operators",
        "Other administrative support staff",
        "personal service workers",
        "sellers",
        "Personal care workers and the like",
        "Protection and security services personnel",
        "Market-oriented farmers and skilled agricultural and animal production workers",
        "Farmers, livestock keepers, fishermen, hunters and gatherers, subsistence",
        "Skilled construction workers and the like, except electricians",
        "Skilled workers in metallurgy, metalworking and similar",
        "Skilled workers in electricity and electronics",
        "Workers in food processing, woodworking, clothing and other industries and crafts",
        "Fixed plant and machine operators",
        "assembly workers",
        "Vehicle drivers and mobile equipment operators",
        "Unskilled workers in agriculture, animal production, fisheries and forestry",
        "Unskilled workers in extractive industry, construction, manufacturing and transport",
        "Meal preparation assistants",
        "Street vendors (except food) and street service providers",
        "Unknown code"
    ];
    const proportionData = countProportions(data, "Father's occupation");
    console.log("proportionData", proportionData);
    const orderedArr = ordering
        .map((orderKey) => {
            const value = proportionData[orderKey];
            if (value === undefined) return null;
            return { key: orderKey, ...value };
        })
        .filter((d) => d !== null);
    console.log("orderedArr", orderedArr);

    const orderedArrWithShortLabels = orderedArr.map(d => ({
    ...d,
    key: fatherJobShortLabels[d.key] 
    }));

    console.log("orderedArrWithShortLabels", orderedArrWithShortLabels);
    // Draw chart and swap button
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();
        containerSelection.selectAll("#pie-btn, #bar-btn").remove();

         containerSelection
            .append("button")
            .attr("id", "bar-btn")
            .text("1")
            .style("margin-right", "8px")
            .on("click", () => {
                fatherJobChartType = "bar";
                render();
            });

        containerSelection
            .append("button")
            .attr("id", "pie-btn")
            .text("2")
            .on("click", () => {
                fatherJobChartType = "pie";
                render();
            });

        // Ensure SVG exists before drawing
        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        // Chart
        if (fatherJobChartType === "pie") {
            drawPiChart(
                processedData,
                svgElement,
                showDrilldownChart,
                "Father's Occupation Distribution",
                expanded
            );
        } else {
            console.log("drawing bar chart");
            drawBarChart(
                orderedArrWithShortLabels,
                svgElement,
                "Father's Occupation vs Dropout Rate",
                expanded
            );
        }
    }

    render();
}

/**
 * Generic Bar functions. Individual as 
 * the function signature was already prededtermined so a generic general function
 * would not work
 */

/**
 * Build the unemployment rate static vis in designated container
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
 * @param {HTMLElement} containerElement - optional container element
 */
function unemploymentRateBar(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    // Extract and map data
    const unemploymentRates = data.map(d => d["Unemployment rate"]);
    const counts = countOccurrences(unemploymentRates);

    // Prepare data for bar chart
    const rateCountsArray = Object.entries(counts).map(([key, count]) => ({
        key,
        count,
    }));



    // Calculate dropout/enrolled proportions for each unemployment rate
    const proportionData = countProportions(data, "Unemployment rate");
    const ordering = rateCountsArray
        .map(d => d.key)
        .sort((a, b) => parseFloat(a) - parseFloat(b));
    const orderedArr = ordering.map(orderKey => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    }).filter(d => d !== null);

    // Draw the bar chart
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();

        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        drawBarChart(
            orderedArr,
            svgElement,
            "Unemployment Rate vs Dropout Rate",
            expanded
        );
    }

    render();
}

/**
 * Build the inflation rate static bar chart in designated container
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
 * @param {HTMLElement} containerElement - optional container element
 */
function inflationRateBar(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    // Extract and map data
    const inflationRates = data.map(d => d["Inflation rate"]);
    const counts = countOccurrences(inflationRates);

    // Prepare data for bar chart
    const rateCountsArray = Object.entries(counts).map(([key, count]) => ({
        key,
        count,
    }));

    // Calculate dropout/enrolled proportions for each inflation rate
    const proportionData = countProportions(data, "Inflation rate");
    const ordering = rateCountsArray
        .map(d => d.key)
        .sort((a, b) => parseFloat(a) - parseFloat(b));
    const orderedArr = ordering.map(orderKey => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    }).filter(d => d !== null);

    // Draw the bar chart
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();

        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        drawBarChart(
            orderedArr,
            svgElement,
            "Inflation Rate vs Dropout Rate",
            expanded
        );
    }

    render();
}

/**
 * Build the nationality static bar chart in designated container
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
 * @param {HTMLElement} containerElement - optional container element
 */
function nationalityBar(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    // Extract and map data (translate codes to strings)
    const nationalities = data.map(d => translateNationalityCode(d["Nacionality"]));
    const counts = countOccurrences(nationalities);

    // Prepare data for bar chart
    const nationalityCountsArray = Object.entries(counts).map(([key, count]) => ({
        key,
        count,
    }));

    // Calculate dropout/enrolled proportions for each nationality (using translated string)
    // We'll build a lookup from code to string for this
    const codeToString = {};
    data.forEach(d => {
        codeToString[d["Nacionality"]] = translateNationalityCode(d["Nacionality"]);
    });
    // Remap data with translated keys for countProportions
    const translatedData = data.map(d => ({
        ...d,
        "Nacionality": translateNationalityCode(d["Nacionality"])
    }));
    const proportionData = countProportions(translatedData, "Nacionality");

    // Order by count descending, or alphabetically if you prefer
    const ordering = nationalityCountsArray
        .sort((a, b) => b.count - a.count)
        .map(d => d.key);

    const orderedArr = ordering.map(orderKey => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    }).filter(d => d !== null);

    // Draw the bar chart
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();

        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        drawBarChart(
            orderedArr,
            svgElement,
            "Nationality vs Dropout Rate",
            expanded
        );
    }

    render();
}

/**
 * Build the international status static bar chart in designated container
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
 * @param {HTMLElement} containerElement - optional container element
 */
function internationalStatusBar(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    // Extract and map data (translate codes to Yes/No)
    const statuses = data.map(d => translateYesNo(d["International"]));
    const counts = countOccurrences(statuses);



    // Remap data with translated keys for countProportions
    const translatedData = data.map(d => ({
        ...d,
        "International": translateYesNo(d["International"])
    }));
    const proportionData = countProportions(translatedData, "International");

    // Order by Yes/No (Yes first, then No, then Unknown)
    const ordering = ["Yes", "No", "Unknown"].filter(k => counts[k] !== undefined);

    const orderedArr = ordering.map(orderKey => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    }).filter(d => d !== null);

    // Draw the bar chart
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();

        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        drawBarChart(
            orderedArr,
            svgElement,
            "International Status vs Dropout Rate",
            expanded
        );
    }

    render();
}


/**
 * Build the tuition payment status static bar chart in designated container
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
 * @param {HTMLElement} containerElement - optional container element
 */
function tuitionPaymentStatusBar(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    // Extract and map data (translate codes to Yes/No)
    const statuses = data.map(d => translateYesNo(d["Tuition fees up to date"]));
    const counts = countOccurrences(statuses);

    // Remap data with translated keys for countProportions
    const translatedData = data.map(d => ({
        ...d,
        "Tuition fees up to date": translateYesNo(d["Tuition fees up to date"])
    }));
    const proportionData = countProportions(translatedData, "Tuition fees up to date");

    // Order by Yes/No (Yes first, then No, then Unknown)
    const ordering = ["Yes", "No", "Unknown"].filter(k => counts[k] !== undefined);

    const orderedArr = ordering.map(orderKey => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    }).filter(d => d !== null);

    // Draw the bar chart
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();

        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        drawBarChart(
            orderedArr,
            svgElement,
            "Tuition Payment Status vs Dropout Rate",
            expanded
        );
    }

    render();
}

/**
 * Build the debtor status static bar chart in designated container
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
 * @param {HTMLElement} containerElement - optional container element
 */
function debtorStatusBar(data, expanded = false, containerElement = null) {
    // Set container and svg_id based on expanded
    let container;
    if (expanded) {
        container = "#overlay-chart-container";
    } else if (containerElement) {
        container = d3.select(containerElement);
    } else {
        container = ".side-chart";
    }
    const svg_id = expanded ? "#graph1-expanded" : "#graph1";

    // Extract and map data (translate codes to Yes/No)
    const statuses = data.map(d => translateYesNo(d["Debtor"]));
    const counts = countOccurrences(statuses);

    // Remap data with translated keys for countProportions
    const translatedData = data.map(d => ({
        ...d,
        "Debtor": translateYesNo(d["Debtor"])
    }));
    const proportionData = countProportions(translatedData, "Debtor");

    // Order by Yes/No (Yes first, then No, then Unknown)
    const ordering = ["Yes", "No", "Unknown"].filter(k => counts[k] !== undefined);

    const orderedArr = ordering.map(orderKey => {
        const value = proportionData[orderKey];
        if (value === undefined) return null;
        return { key: orderKey, ...value };
    }).filter(d => d !== null);

    // Draw the bar chart
    function render() {
        const containerSelection =
            typeof container === "string" ? d3.select(container) : container;
        containerSelection.selectAll("svg").remove();

        let svgElement;
        if (containerSelection.select(svg_id).empty()) {
            svgElement = containerSelection
                .append("svg")
                .attr("id", svg_id.replace("#", ""));
        } else {
            svgElement = containerSelection.select(svg_id);
        }

        drawBarChart(
            orderedArr,
            svgElement,
            "Debtor Status vs Dropout Rate",
            expanded
        );
    }

    render();
}

export {
    motherQuals,
    fatherQuals,
    motherJob,
    fatherJob,
    unemploymentRateBar,
    inflationRateBar,
    nationalityBar,
    internationalStatusBar,
    tuitionPaymentStatusBar,
    debtorStatusBar
};
