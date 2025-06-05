export {
    motherQuals,
    fatherQuals,
    drawPiChart,
    drawBarChart,
    translateEducationCode,
    countProportions,
    motherJob,
    fatherJob,
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
        44: "Higher Education - Doctorate (3rd cycle)",
    };
    return codeMap[Number(code)] || "Unknown code";
}

/** * Translate the father's job code to readable text
 * @param {int} code - actual code to translate
 * @returns {string} - readable text for the job code
 */
function translateFatherJobCode(code) {
    const jobMap = {
        0: "Student",
        1: "Representatives of the Legislative Power and Executive Bodies, Directors, Directors and Executive Managers",
        2: "Specialists in Intellectual and Scientific Activities",
        3: "Intermediate Level Technicians and Professions",
        4: "Administrative staff",
        5: "Personal Services, Security and Safety Workers and Sellers",
        6: "Farmers and Skilled Workers in Agriculture, Fisheries and Forestry",
        7: "Skilled Workers in Industry, Construction and Craftsmen",
        8: "Installation and Machine Operators and Assembly Workers",
        9: "Unskilled Workers",
        10: "Armed Forces Professions",
        90: "Other Situation",
        99: "(blank)",
        101: "Armed Forces Officers",
        102: "Armed Forces Sergeants",
        103: "Other Armed Forces personnel",
        112: "Directors of administrative and commercial services",
        114: "Hotel, catering, trade and other services directors",
        121: "Specialists in the physical sciences, mathematics, engineering and related techniques",
        122: "Health professionals",
        123: "teachers",
        124: "Specialists in finance, accounting, administrative organization, public and commercial relations",
        131: "Intermediate level science and engineering technicians and professions",
        132: "Technicians and professionals, of intermediate level of health",
        134: "Intermediate level technicians from legal, social, sports, cultural and similar services",
        135: "Information and communication technology technicians",
        141: "Office workers, secretaries in general and data processing operators",
        143: "Data, accounting, statistical, financial services and registry-related operators",
        144: "Other administrative support staff",
        151: "personal service workers",
        152: "sellers",
        153: "Personal care workers and the like",
        154: "Protection and security services personnel",
        161: "Market-oriented farmers and skilled agricultural and animal production workers",
        163: "Farmers, livestock keepers, fishermen, hunters and gatherers, subsistence",
        171: "Skilled construction workers and the like, except electricians",
        172: "Skilled workers in metallurgy, metalworking and similar",
        174: "Skilled workers in electricity and electronics",
        175: "Workers in food processing, woodworking, clothing and other industries and crafts",
        181: "Fixed plant and machine operators",
        182: "assembly workers",
        183: "Vehicle drivers and mobile equipment operators",
        192: "Unskilled workers in agriculture, animal production, fisheries and forestry",
        193: "Unskilled workers in extractive industry, construction, manufacturing and transport",
        194: "Meal preparation assistants",
        195: "Street vendors (except food) and street service providers"
    };
    return jobMap[Number(code)] || "Unknown code";
}

//shortened labels for rendering in charts to make more readdable
const jobShortLabels = {
    "Student": "Student",
    "Representatives of the Legislative Power and Executive Bodies, Directors, Directors and Executive Managers": "Executives",
    "Specialists in Intellectual and Scientific Activities": "Scientists",
    "Intermediate Level Technicians and Professions": "Technicians",
    "Administrative staff": "Admin",
    "Personal Services, Security and Safety Workers and Sellers": "Service/Security/Sales",
    "Farmers and Skilled Workers in Agriculture, Fisheries and Forestry": "Farmers",
    "Skilled Workers in Industry, Construction and Craftsmen": "Industry/Construction",
    "Installation and Machine Operators and Assembly Workers": "Machine Operators",
    "Unskilled Workers": "Unskilled",
    "Armed Forces Professions": "Military",
    "Other Situation": "Other",
    "(blank)": "(blank)",
    "Health professionals": "Health",
    "teachers": "Teachers",
    "Specialists in information and communication technologies (ICT)": "ICT",
    "Intermediate level science and engineering technicians and professions": "Sci/Eng Techs",
    "Technicians and professionals, of intermediate level of health": "Health Techs",
    "Intermediate level technicians from legal, social, sports, cultural and similar services": "Legal/Social/Sports Techs",
    "Office workers, secretaries in general and data processing operators": "Office/Data",
    "Data, accounting, statistical, financial services and registry-related operators": "Finance/Registry",
    "Other administrative support staff": "Other Admin",
    "personal service workers": "Service Workers",
    "sellers": "Sellers",
    "Personal care workers and the like": "Care Workers",
    "Skilled construction workers and the like, except electricians": "Construction",
    "Skilled workers in printing, precision instrument manufacturing, jewelers, artisans and the like": "Printing/Artisans",
    "Workers in food processing, woodworking, clothing and other industries and crafts": "Food/Wood/Clothing",
    "cleaning workers": "Cleaning",
    "Unskilled workers in agriculture, animal production, fisheries and forestry": "Unskilled Agriculture",
    "Unskilled workers in extractive industry, construction, manufacturing and transport": "Unskilled Industry",
    "Unknown code": "Unknown",
    "Other": "Other" // for consolidated slices
};

const fatherJobShortLabels = {
    "Student": "Student",
    "Representatives of the Legislative Power and Executive Bodies, Directors, Directors and Executive Managers": "Executives",
    "Specialists in Intellectual and Scientific Activities": "Scientists",
    "Intermediate Level Technicians and Professions": "Technicians",
    "Administrative staff": "Admin",
    "Personal Services, Security and Safety Workers and Sellers": "Service/Security/Sales",
    "Farmers and Skilled Workers in Agriculture, Fisheries and Forestry": "Farmers",
    "Skilled Workers in Industry, Construction and Craftsmen": "Industry/Construction",
    "Installation and Machine Operators and Assembly Workers": "Machine Operators",
    "Unskilled Workers": "Unskilled",
    "Armed Forces Professions": "Military",
    "Other Situation": "Other",
    "(blank)": "(blank)",
    "Armed Forces Officers": "AF Officers",
    "Armed Forces Sergeants": "AF Sergeants",
    "Other Armed Forces personnel": "AF Other",
    "Directors of administrative and commercial services": "Admin/Commercial Dir.",
    "Hotel, catering, trade and other services directors": "Hotel/Trade Dir.",
    "Specialists in the physical sciences, mathematics, engineering and related techniques": "STEM Specialists",
    "Health professionals": "Health",
    "teachers": "Teachers",
    "Specialists in finance, accounting, administrative organization, public and commercial relations": "Finance/Admin Specialists",
    "Intermediate level science and engineering technicians and professions": "Sci/Eng Techs",
    "Technicians and professionals, of intermediate level of health": "Health Techs",
    "Intermediate level technicians from legal, social, sports, cultural and similar services": "Legal/Social/Sports Techs",
    "Information and communication technology technicians": "ICT Techs",
    "Office workers, secretaries in general and data processing operators": "Office/Data",
    "Data, accounting, statistical, financial services and registry-related operators": "Finance/Registry",
    "Other administrative support staff": "Other Admin",
    "personal service workers": "Service Workers",
    "sellers": "Sellers",
    "Personal care workers and the like": "Care Workers",
    "Protection and security services personnel": "Security",
    "Market-oriented farmers and skilled agricultural and animal production workers": "Market Farmers",
    "Farmers, livestock keepers, fishermen, hunters and gatherers, subsistence": "Subsistence Farmers",
    "Skilled construction workers and the like, except electricians": "Construction",
    "Skilled workers in metallurgy, metalworking and similar": "Metalwork",
    "Skilled workers in electricity and electronics": "Electricians/Electronics",
    "Workers in food processing, woodworking, clothing and other industries and crafts": "Food/Wood/Clothing",
    "Fixed plant and machine operators": "Plant Operators",
    "assembly workers": "Assembly",
    "Vehicle drivers and mobile equipment operators": "Drivers/Operators",
    "Unskilled workers in agriculture, animal production, fisheries and forestry": "Unskilled Agriculture",
    "Unskilled workers in extractive industry, construction, manufacturing and transport": "Unskilled Industry",
    "Meal preparation assistants": "Meal Prep",
    "Street vendors (except food) and street service providers": "Street Vendors"
};

const qualificationShortLabels = {
    "Higher Education - Doctorate (3rd cycle)": "PhD (3rd cycle)",
    "Higher Education - Doctorate": "PhD",
    "Higher Education - Master (2nd cycle)": "Master (2nd)",
    "Higher Education - Master's": "Master",
    "Higher Education - Degree": "Degree",
    "Higher education - degree (1st cycle)": "Degree (1st)",
    "Higher Education - Bachelor's Degree": "Bachelor",
    "Specialized higher studies course": "Specialized",
    "Professional higher technical course": "Prof. Tech.",
    "Technological specialization course": "Tech. Spec.",
    "Technical-professional course": "Tech. Prof.",
    "Frequency of Higher Education": "Some Higher Ed.",
    "General commerce course": "Commerce",
    "Secondary Education - 12th Year of Schooling or Eq.": "12th Grade",
    "12th Year of Schooling - Not Completed": "12th Not Comp.",
    "Other - 11th Year of Schooling": "Other 11th",
    "11th Year of Schooling - Not Completed": "11th Not Comp.",
    "Basic Education 3rd Cycle (9th/10th/11th Year) or Equiv.": "9th-11th",
    "10th Year of Schooling": "10th Grade",
    "9th Year of Schooling - Not Completed": "9th Not Comp.",
    "8th year of schooling": "8th Grade",
    "7th Year (Old)": "7th (Old)",
    "7th year of schooling": "7th Grade",
    "Basic Education 2nd Cycle (6th/7th/8th Year) or Equiv.": "6th-8th",
    "2nd cycle of the general high school course": "2nd Cycle HS",
    "Basic education 1st cycle (4th/5th year) or equiv.": "4th-5th",
    "Can read without having a 4th year of schooling": "Reads, <4th",
    "Can't read or write": "Illiterate",
    "Unknown": "Unknown"
};

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


/**
 *  Translate the job code to readable text
 * @param {Int} code - Int
 * @returns 
 */
function translateJobCode(code) {
    const jobMap = {
        0: "Student",
        1: "Representatives of the Legislative Power and Executive Bodies, Directors, Directors and Executive Managers",
        2: "Specialists in Intellectual and Scientific Activities",
        3: "Intermediate Level Technicians and Professions",
        4: "Administrative staff",
        5: "Personal Services, Security and Safety Workers and Sellers",
        6: "Farmers and Skilled Workers in Agriculture, Fisheries and Forestry",
        7: "Skilled Workers in Industry, Construction and Craftsmen",
        8: "Installation and Machine Operators and Assembly Workers",
        9: "Unskilled Workers",
        10: "Armed Forces Professions",
        90: "Other Situation",
        99: "(blank)",
        122: "Health professionals",
        123: "teachers",
        125: "Specialists in information and communication technologies (ICT)",
        131: "Intermediate level science and engineering technicians and professions",
        132: "Technicians and professionals, of intermediate level of health",
        134: "Intermediate level technicians from legal, social, sports, cultural and similar services",
        141: "Office workers, secretaries in general and data processing operators",
        143: "Data, accounting, statistical, financial services and registry-related operators",
        144: "Other administrative support staff",
        151: "personal service workers",
        152: "sellers",
        153: "Personal care workers and the like",
        171: "Skilled construction workers and the like, except electricians",
        173: "Skilled workers in printing, precision instrument manufacturing, jewelers, artisans and the like",
        175: "Workers in food processing, woodworking, clothing and other industries and crafts",
        191: "cleaning workers",
        192: "Unskilled workers in agriculture, animal production, fisheries and forestry",
        193: "Unskilled workers in extractive industry, construction, manufacturing and transport",
        194: "Meal preparation assistants",
    };
    return jobMap[Number(code)] || "Unknown code";
}


// Global variable to hold what chart to show
let motherJobChartType = "bar";
/**
 * Function to build all static visualizations for the mother's occupation.
 * Renders a pie chart of the distribution of mother's occupation and a bar chart.
 * @param {Array} data - raw dataset to draw from
 * @param {boolean} expanded - whether to render the expanded version of the chart
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
