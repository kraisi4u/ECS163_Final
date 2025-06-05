import {
    makeNodes,
    animateToAlternative,
    clearFlows,
    drawFlows,
    calculateChartDimensions,
} from "./chart.js";
import {
    loadCategoricalData,
    loadGradeData,
    getRawDataForTwoColumns,
} from "./dataLoader.js";
import { 
    motherQuals, 
    fatherQuals, 
    motherJob, fatherJob, 
    unemploymentRateBar,
    inflationRateBar, 
    nationalityBar,
    internationalStatusBar,
    tuitionPaymentStatusBar,
    debtorStatusBar,
    previousQualificationBar,
    specialNeedsStatusBar,
    attendanceSectionStatusBar,
    ageEnrollmentBar,
    scholarshipStatusBar,
    gdpRateBar,

    showAdmission

} from "./staticVizFunctions.js";

let currentSlide = 0;
const slides = d3.selectAll(".slide");
const totalSlides = slides.size();
const alternateIndices = {};
const permanentChartArea = d3.select("#permanent-chart");
const chartNodesMeta = {};
let allCsvData = null;

const slidePositions = {};

// hide all slides at start so only 1 is visible
slides.style("display", "none");

/**
 * gets slide element by index
 * @param {number} index
 * @returns {object} d3 select
 */
const getSlideElement = (index) => d3.select(slides.nodes()[index]);

/**
 * finds next slide with chart
 * @param {number} startIndex
 * @returns {number} index of next slide with chart
 */
const findNextChartSlide = (startIndex) => {
    for (let i = startIndex + 1; i < totalSlides; i++) {
        if (slidePositions[i] !== undefined) {
            return i;
        }
    }
    // :( no more slides
    return -1;
};

/**
 * gets active alternate from slide
 * @param {object} slide from d3
 * @returns {object} d3 select
 */
const getActiveAlternate = (slide) => slide.select(".alternate.active");

/**
 * updates vertical title on right side of the page for the next col name
 * @param {number} htmlSlideIndex the index of the next slide with chart
 */
const updateVerticalTitle = (htmlSlideIndex) => {
    const titleElement = d3.select("#chart-title-vertical");

    const nextChartSlideIndex = findNextChartSlide(htmlSlideIndex);
    if (nextChartSlideIndex === -1) {
        titleElement.classed("visible", false);
        return;
    }

    const nextSlideElement = getSlideElement(nextChartSlideIndex);
    if (nextSlideElement.attr("data-has-chart") !== "true") {
        titleElement.classed("visible", false);
        return;
    }

    const activeAlternate = getActiveAlternate(nextSlideElement);
    if (activeAlternate.empty()) {
        titleElement.classed("visible", false);
        return;
    }

    const titleText = activeAlternate.select("h1").text();
    titleElement.text(titleText).classed("visible", true);
};

/**
 * Define mapping of of chart targets to static viz functions
 * ADD MORE MAPPINGS HERE
 * IMPORTANT!!! TO DO TO MAKE SURE YOUR VIZ IS DRAWN RIGHT
 * PLEASE ENSURE THAT YOU ARE DRAWING TO #graph1 FOR THE SMALL STATIC VIZ AND
 * #graph1-expanded FOR THE EXPANDED VIZ
 * ALSO YOUR VIZ FUNCTION NEESD TO ACCEPT ONLY TWO PARAMETERS: DATA AND A EXPANED BOOL
 * IF NECCESARY YOU SHOULD MAKE A SHELL HELPER FUNCTION THAT HANDLES THE DATA AND EXPANDED BOOL TO DDRAW
 * THE CORRECT RESPECTIVE VIZ
 * ALSO EXPORT AND IMPORT YOUR VIZ FUNCTIONS AS NEEDED TO BE ABLE TO ACCESS THEM HERE
 */
const chartFunctions = {
    "Mother's qualification": motherQuals,
    "Father's qualification": fatherQuals,
    "Mother's occupation": motherJob,
    "Father's occupation": fatherJob,
    "Unemployment rate": unemploymentRateBar,
    "Inflation rate": inflationRateBar,
    "Nacionality": nationalityBar,
    "International": internationalStatusBar,
    "Tuition fees up to date": tuitionPaymentStatusBar,
    "Debtor": debtorStatusBar,
    "Previous qualification": previousQualificationBar,
    // Add more mappings as needed
    "Educational special needs": specialNeedsStatusBar,
    "Daytime/evening attendance": attendanceSectionStatusBar,
    "Age at enrollment": ageEnrollmentBar,
    "Scholarship holder": scholarshipStatusBar,
    "GDP": gdpRateBar,



    "Admission grade": showAdmission
};

/**
 * Draws corresponding static visualization to current slide
 * @param {object} currentSlideElement the current slide element
 */
const showStaticViz = (currentSlideElement) => {
    // Get the active alternate and its chart target
    const activeAlternate = getActiveAlternate(currentSlideElement);
    const chartTarget = activeAlternate.attr("data-chart-target");
    console.log("Chart target:", chartTarget);
    //Handle static visualizations
    const chartFunc = chartFunctions[chartTarget];
    console.log("Chart function:", chartFunc);
    if (chartFunc) {
        // Find the side chart within the current slide
        const sideChart = currentSlideElement.select(".side-chart");

        //clear side chart
        sideChart.selectAll("*").remove();

        // Add expand button
        sideChart
            .append("button")
            .attr("id", "expand-chart-btn")
            .text("↗")
            .style("font-size", "1em")
            .style("font-size", "1em")
            .style("background", "none")
            .style("border", "none")
            .style("padding", "2px 6px")
            .style("cursor", "pointer")
            .on("click", function () {
                // Show overlay
                d3.select("#chart-overlay").style("display", "flex");
                d3.select("#overlay-chart-container").selectAll("*").remove();
                const w = window.innerWidth;
                const h = window.innerHeight;
                // Draw expanded chart in overlay
                d3.select("#overlay-chart-container")
                    .append("svg")
                    .attr("id", "graph1-expanded")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("viewBox", `0 0 ${w} ${h}`);
                chartFunc(allCsvData, true, null);
            });

        
            chartFunc(allCsvData, false, sideChart.node());
        
    }
};

// Logic to close overlay
d3.select("#close-overlay-btn").on("click", function () {
    d3.select("#chart-overlay").style("display", "none");
    d3.select("#overlay-chart-container").selectAll("*").remove();
});

/**
 * shows specific slide and handles chart visibility
 */
const showSlide = (index) => {
    slides.style("display", "none");

    const currentSlideElement = getSlideElement(index);
    const hasChart = currentSlideElement.attr("data-has-chart") === "true";

    clearFlows();

    // basically if it has chart, show the chart area
    // if not then dont
    if (hasChart) {
        permanentChartArea.classed("visible", true);
        currentSlideElement.classed("with-chart", true);
        panToSlide(index);
        showStaticViz(currentSlideElement);
    } else {
        permanentChartArea.classed("visible", false);
        slides.classed("with-chart", false);
    }

    updateVerticalTitle(index);

    currentSlideElement
        .style("display", "block")
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1);
};

/**
 * pan the chart to show correct slide
 */
const panToSlide = async (htmlSlideIndex) => {
    const pannableGroup = d3.select("#chart-content-group");
    if (pannableGroup.empty()) return;

    const currentChartColumnIndex = slidePositions[htmlSlideIndex];
    if (currentChartColumnIndex === undefined) return;

    const { baseChartAreaWidth, dynamicColSpacing } =
        calculateChartDimensions();

    const nextHtmlSlideWithChartIndex = findNextChartSlide(htmlSlideIndex);

    clearFlows();

    let targetX;
    // last slide is target variable
    // this handles putting 2 cols side by side for the flows
    if (nextHtmlSlideWithChartIndex !== -1) {
        const nextChartColumnIndex =
            slidePositions[nextHtmlSlideWithChartIndex];
        if (nextChartColumnIndex === currentChartColumnIndex + 1) {
            const centerOfCurrentColumnNodesInSVG =
                currentChartColumnIndex * dynamicColSpacing +
                dynamicColSpacing / 2;
            const targetCenterForCurrentColumnInView = baseChartAreaWidth / 4;
            targetX =
                targetCenterForCurrentColumnInView -
                centerOfCurrentColumnNodesInSVG;

            await drawFlowsBetweenColumns(
                currentChartColumnIndex,
                nextChartColumnIndex,
                htmlSlideIndex,
                nextHtmlSlideWithChartIndex
            );
        } else {
            const centerOffset = (baseChartAreaWidth - dynamicColSpacing) / 2;
            targetX =
                -(currentChartColumnIndex * dynamicColSpacing) + centerOffset;
        }
    } else {
        const centerOffset = (baseChartAreaWidth - dynamicColSpacing) / 2;
        targetX = -(currentChartColumnIndex * dynamicColSpacing) + centerOffset;
    }

    pannableGroup
        .transition()
        .duration(750)
        .attr("transform", `translate(${targetX}, 0)`);
};

/**
 * draws flows between two columns
 */
const drawFlowsBetweenColumns = async (
    sourceColIdx,
    targetColIdx,
    sourceHtmlSlideIdx,
    targetHtmlSlideIdx
) => {
    if (!allCsvData) return;

    // just get all the indexes for the cols (and the alternate cols who slide up)

    const sourceAltIdx = alternateIndices[sourceHtmlSlideIdx] || 0;
    const targetAltIdx = alternateIndices[targetHtmlSlideIdx] || 0;

    const sourceMeta = chartNodesMeta[sourceColIdx]?.[sourceAltIdx];
    const targetMeta = chartNodesMeta[targetColIdx]?.[targetAltIdx];

    if (!sourceMeta || !targetMeta) return;

    const sourceSlideElement = getSlideElement(sourceHtmlSlideIdx);
    const sourceActiveAlternate = getActiveAlternate(sourceSlideElement);
    const targetSlideElement = getSlideElement(targetHtmlSlideIdx);
    const targetActiveAlternate = getActiveAlternate(targetSlideElement);

    if (sourceActiveAlternate.empty() || targetActiveAlternate.empty()) return;

    const column1Info = {
        key: sourceActiveAlternate.attr("data-chart-target"),
        type: sourceActiveAlternate.attr("data-chart-type"),
    };
    const column2Info = {
        key: targetActiveAlternate.attr("data-chart-target"),
        type: targetActiveAlternate.attr("data-chart-type"),
    };

    if (
        !column1Info.key ||
        !column1Info.type ||
        !column2Info.key ||
        !column2Info.type
    )
        return;

    const rawPairs = await getRawDataForTwoColumns(
        "data.csv",
        "description.json",
        column1Info,
        column2Info,
        allCsvData
    );
    if (!rawPairs) return;

    // basically maps processed values back to actual node labels
    const mapToActualNodeLabel = (processedValue, nodeLabels) => {
        if (nodeLabels.includes(processedValue)) return processedValue;
        if (nodeLabels.includes("Other")) return "Other";
        return null;
    };

    const flowCounts = {};
    rawPairs.forEach(([rawVal1, rawVal2]) => {
        const nodeVal1 = mapToActualNodeLabel(rawVal1, sourceMeta.values);
        const nodeVal2 = mapToActualNodeLabel(rawVal2, targetMeta.values);

        if (nodeVal1 && nodeVal2) {
            const key = `${nodeVal1}->${nodeVal2}`;
            flowCounts[key] = (flowCounts[key] || 0) + 1;
        }
    });

    if (Object.keys(flowCounts).length > 0) {
        drawFlows(
            sourceColIdx,
            sourceAltIdx,
            targetColIdx,
            targetAltIdx,
            flowCounts,
            chartNodesMeta
        );
    }
};

// setup alternates and switch buttons
// alternates are diff varaibles that fits into the same narrative
// doesn't make sense for a new slide chronologically
slides.each(function (d, htmlSlideIndex) {
    const slideElement = d3.select(this);
    if (slideElement.attr("data-has-chart") !== "true") return;

    const alternates = slideElement.select(".alternates");
    if (alternates.empty()) return;

    const alternateElements = alternates.selectAll(".alternate");
    const switchButton = alternates.select(".switch-alternate-button");
    alternateIndices[htmlSlideIndex] = 0;

    if (!switchButton.empty() && alternateElements.size() > 1) {
        switchButton.on("click", async () => {
            alternateElements.classed("active", false);
            alternateIndices[htmlSlideIndex] =
                (alternateIndices[htmlSlideIndex] + 1) %
                alternateElements.size();
            const activeAlternateElement = d3.select(
                alternateElements.nodes()[alternateIndices[htmlSlideIndex]]
            );
            activeAlternateElement.classed("active", true);

            updateVerticalTitle(htmlSlideIndex);

            // when click button, shift the col up for alternates
            // also redraw flows
            //also redraw the static viz
            showStaticViz(slideElement);
            const chartColumnIndex = slidePositions[htmlSlideIndex];
            if (chartColumnIndex !== undefined) {
                animateToAlternative(
                    chartColumnIndex,
                    alternateIndices[htmlSlideIndex]
                );
                clearFlows();

                const nextHtmlSlideWithChartIndex =
                    findNextChartSlide(htmlSlideIndex);

                if (nextHtmlSlideWithChartIndex !== -1) {
                    const nextChartColumnIndex =
                        slidePositions[nextHtmlSlideWithChartIndex];
                    if (nextChartColumnIndex === chartColumnIndex + 1) {
                        await drawFlowsBetweenColumns(
                            chartColumnIndex,
                            nextChartColumnIndex,
                            htmlSlideIndex,
                            nextHtmlSlideWithChartIndex
                        );
                    }
                }
            }
        });
    } else if (alternateElements.size() <= 1 && !switchButton.empty()) {
        switchButton.style("display", "none");
    }
});

// The reason for the complicated navigation is we want a final slide
// The final slide skips over the slide that just shows the outcomes
// for a coherent story

/**
 * finds the slide index that contains the Target outcome chart
 * @returns {number} index of outcome slide, or -1 if not found
 */
const findOutcomeSlideIndex = () => {
    for (let i = 0; i < totalSlides; i++) {
        const slideElement = getSlideElement(i);
        const targetAlternate = slideElement.select(
            '[data-chart-target="Target"]'
        );
        if (!targetAlternate.empty()) {
            return i;
        }
    }
    return -1;
};

// keyboard navigation
// idk how to do scroll wheel
// asked gpt and it generated something very complex
// this works fine
d3.select("body").on("keydown", (event) => {
    const outcomeSlideIndex = findOutcomeSlideIndex();

    if (event.key === "ArrowRight" && currentSlide < totalSlides - 1) {
        let nextSlide = currentSlide + 1;

        // skip the outcome slide when going forward, go directly to final slide
        if (nextSlide === outcomeSlideIndex && nextSlide < totalSlides - 1) {
            nextSlide = nextSlide + 1;
        }

        currentSlide = nextSlide;
        showSlide(currentSlide);
    } else if (event.key === "ArrowLeft" && currentSlide > 0) {
        let prevSlide = currentSlide - 1;

        // skip the outcome slide when going backward too
        if (prevSlide === outcomeSlideIndex && prevSlide > 0) {
            prevSlide = prevSlide - 1;
        }

        currentSlide = prevSlide;
        showSlide(currentSlide);
    }
});

showSlide(0);

/**
 * loads data based on type
 * @param {string} type either categorical or grade (which is number bins)
 * @param {string} target
 * @returns {object} data for nodes
 */
const loadDataForType = async (type, target) => {
    return type === "grade"
        ? await loadGradeData("data.csv", target, target)
        : await loadCategoricalData(
              "data.csv",
              "description.json",
              target,
              target
          );
};

/**
 * loads data and creates node charts for all slides
 */
const initializeCharts = async () => {
    allCsvData = await d3.dsv(";", "data.csv");
    if (!allCsvData) return;

    d3.select("#permanent-chart").selectAll("svg").remove();

    let chartColumnCounter = 0;

    // go through all slides and make charts for ones that need them
    for (let i = 0; i < slides.nodes().length; i++) {
        const slideElement = getSlideElement(i);
        const htmlSlideIndex = i;

        if (slideElement.attr("data-has-chart") === "true") {
            const alternates = slideElement.selectAll(".alternate");
            const numAlternatives = alternates.size();

            if (numAlternatives === 0) continue;

            slidePositions[htmlSlideIndex] = chartColumnCounter;
            chartNodesMeta[chartColumnCounter] = {};

            for (let altIdx = 0; altIdx < numAlternatives; altIdx++) {
                const alternateElement = d3.select(alternates.nodes()[altIdx]);
                const target = alternateElement.attr("data-chart-target");
                const type = alternateElement.attr("data-chart-type");

                if (!target || !type) continue;

                const dataForNodes = await loadDataForType(type, target);

                if (dataForNodes) {
                    const { finalValues, valueCounts } = dataForNodes;
                    const nodeCreationResult = makeNodes(
                        target,
                        finalValues,
                        valueCounts,
                        chartColumnCounter,
                        altIdx,
                        numAlternatives
                    );

                    if (nodeCreationResult) {
                        chartNodesMeta[chartColumnCounter][altIdx] =
                            nodeCreationResult;
                    }
                }
            }

            // go to first one
            setTimeout(() => {
                animateToAlternative(chartColumnCounter, 0);
            }, 150);

            chartColumnCounter++;
        }
    }

    if (getSlideElement(0).attr("data-has-chart") === "true") {
        showSlide(0);
    }
};

initializeCharts();
