// constants
const CHART_VERTICAL_PADDING = 40;
const INTER_ALTERNATIVE_GAP = 50;
const NODE_WIDTH = 220;
const VERT_GAP = 15;
const ABSOLUTE_MIN_NODE_HEIGHT = 10;
const START_NODE_HEIGHT = 40;
const MIN_VIEWPORT_HEIGHT = 400;
const STROKE_COLOR = "black";
const TEXT_COLOR = "white";

// Used the catagorical 10 originally but was too low contrast
// So used chatgpt to generate some higher contrast colors
const COLOR_SCHEME = [
    "#1f77b4", // Steel Blue
    "#d62728", // Crimson Red
    "#2ca02c", // Forest Green
    "#ff7f0e", // Dark Orange
    "#9467bd", // Purple
    "#8c564b", // Brown
];

/**
 * makes nodes for a category
 * @param {string} category - category name
 * @param {array} values - possible values
 * @param {object} categoryCounts - counts for each value
 * @param {number} slideIndex - slide index
 * @param {number} alternativeIndex - index for alts
 * @param {number} totalAlternatives - number of alts
 * @returns {object} node details
 */
const makeNodes = (
    category,
    values,
    categoryCounts,
    slideIndex = 0,
    alternativeIndex = 0,
    totalAlternatives = 1
) => {
    const colorScheme = COLOR_SCHEME;
    const fontSize = 12;

    const colorScale = d3.scaleOrdinal(colorScheme).domain(values);
    const chartArea = d3.select("#permanent-chart");
    let svg = chartArea.select("svg");
    let pannableGroup;

    // calculate chart dimensions
    const { baseChartAreaWidth, slideSpacing, slideXOffset } =
        calculateChartDimensions(slideIndex);
    const {
        actualEffectiveViewportHeight,
        alternativeSlotHeight,
        baseYOffset,
    } = calculateVerticalDimensions(alternativeIndex, totalAlternatives);

    const { targetSumOfNodeHeights, requiredSvgContentHeight, finalSvgHeight } =
        calculateNodeHeights(
            values,
            actualEffectiveViewportHeight,
            totalAlternatives
        );

    // render stuff
    svg = createOrUpdateSVG(
        svg,
        chartArea,
        baseChartAreaWidth,
        slideIndex,
        slideSpacing,
        finalSvgHeight
    );
    pannableGroup = getOrCreatePannableGroup(svg);

    const slideGroup = getOrCreateSlideGroup(pannableGroup, slideIndex);
    const nodeSetGroup = createNodeSetGroup(slideGroup, alternativeIndex);

    const centerX = slideXOffset + slideSpacing / 2;
    const totalCount = categoryCounts
        ? Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
        : 0;

    const finalGetNodeHeight = createNodeHeightCalculator(
        categoryCounts,
        totalCount,
        targetSumOfNodeHeights,
        values
    );
    const nodesData = createNodesData(values, finalGetNodeHeight, baseYOffset);

    const createdNodes = renderNodes(
        nodeSetGroup,
        nodesData,
        centerX,
        colorScale,
        fontSize
    );
    const nodeDetails = extractNodeDetails(createdNodes);

    return {
        svg,
        categoryName: category,
        values: values,
        contentEndY: calculateContentEndY(nodesData),
        slideIndex,
        alternativeIndex,
        slideGroup,
        nodeSetGroup,
        nodeDetails: nodeDetails,
    };
};

/**
 * calculates chart dimensions
 * @param {number} slideIndex - slide index
 * @returns {object} width and spacing info
 */
const calculateChartDimensions = (slideIndex = 0) => {
    const specifiedWidth = window.innerWidth * 0.7;
    const horizontalPadding = 40;
    let baseChartAreaWidth = specifiedWidth - horizontalPadding;
    if (baseChartAreaWidth <= 0) {
        baseChartAreaWidth = 800;
    }
    const slideSpacing = Math.max(baseChartAreaWidth / 2, NODE_WIDTH + 40);
    const slideXOffset = slideIndex * slideSpacing;

    return {
        baseChartAreaWidth,
        slideSpacing,
        slideXOffset,
        dynamicColSpacing: slideSpacing,
    };
};

/**
 * calculates vertical dimensions for alternatives
 * the raw vs actual thing is from chatgpt
 * @param {number} alternativeIndex - index for alts
 * @returns {object} vertical dimensions
 */
const calculateVerticalDimensions = (alternativeIndex) => {
    const rawEffectiveViewportHeight =
        window.innerHeight - CHART_VERTICAL_PADDING;
    const actualEffectiveViewportHeight = Math.max(
        rawEffectiveViewportHeight,
        MIN_VIEWPORT_HEIGHT
    );
    const alternativeSlotHeight =
        actualEffectiveViewportHeight + INTER_ALTERNATIVE_GAP;
    const baseYOffset = alternativeIndex * alternativeSlotHeight;

    return {
        actualEffectiveViewportHeight,
        alternativeSlotHeight,
        baseYOffset,
    };
};

/**
 * calculates node heights and svg dimensions
 */
const calculateNodeHeights = (
    values,
    actualEffectiveViewportHeight,
    totalAlternatives
) => {
    const numGaps = values.length > 1 ? values.length - 1 : 0;
    const totalGapHeight = numGaps * VERT_GAP;
    let targetSumOfNodeHeights = actualEffectiveViewportHeight - totalGapHeight;

    const requiredSvgContentHeight =
        totalAlternatives *
            (actualEffectiveViewportHeight + INTER_ALTERNATIVE_GAP) -
        INTER_ALTERNATIVE_GAP;
    const finalSvgHeight = Math.max(
        requiredSvgContentHeight,
        MIN_VIEWPORT_HEIGHT + INTER_ALTERNATIVE_GAP
    );

    return { targetSumOfNodeHeights, requiredSvgContentHeight, finalSvgHeight };
};

/**
 * creates or updates svg element
 */
const createOrUpdateSVG = (
    svg,
    chartArea,
    baseChartAreaWidth,
    slideIndex,
    slideSpacing,
    finalSvgHeight
) => {
    if (svg.empty()) {
        const svgHorizontalPadding = 40;
        const calculatedSvgWidth = Math.max(
            baseChartAreaWidth - svgHorizontalPadding,
            300
        );
        const totalSvgWidth = Math.max(
            calculatedSvgWidth,
            (slideIndex + 2) * slideSpacing
        );

        return chartArea
            .append("svg")
            .attr("width", totalSvgWidth)
            .attr("height", finalSvgHeight);
    } else {
        // if it already exists, add to it
        const currentSvgWidth = parseFloat(svg.attr("width"));
        const requiredWidth = (slideIndex + 2) * slideSpacing;
        if (requiredWidth > currentSvgWidth) {
            svg.attr("width", requiredWidth);
        }

        const currentSvgHeight = parseFloat(svg.attr("height"));
        if (finalSvgHeight > currentSvgHeight) {
            svg.attr("height", finalSvgHeight);
        }

        return svg;
    }
};

/**
 * get or create dom element
 * this is a hack to make d3 play nice with the html
 * learned from chatgpt
 * @param {object} parent - parent element
 * @param {string} selector - css selector
 * @param {string} elementType - element type
 * @param {object} attributes - optional attributes
 * @returns {object} d3 selection
 */
const getOrCreateElement = (parent, selector, elementType, attributes = {}) => {
    let element = parent.select(selector);
    if (element.empty()) {
        element = parent.append(elementType);
        Object.entries(attributes).forEach(([key, value]) => {
            element.attr(key, value);
        });
    }
    return element;
};

/**
 * gets or creates pannable group
 */
const getOrCreatePannableGroup = (svg) => {
    return getOrCreateElement(svg, "#chart-content-group", "g", {
        id: "chart-content-group",
    });
};

/**
 * gets or creates slide group
 */
const getOrCreateSlideGroup = (pannableGroup, slideIndex) => {
    return getOrCreateElement(
        pannableGroup,
        `.slide-group-${slideIndex}`,
        "g",
        {
            class: `slide-group-${slideIndex}`,
            "data-slide-index": slideIndex,
        }
    );
};

/**
 * creates node set group for alternative
 */
const createNodeSetGroup = (slideGroup, alternativeIndex) => {
    return slideGroup
        .append("g")
        .attr("class", `node-set-alt-${alternativeIndex}`)
        .attr("data-alternative-index", alternativeIndex);
};

/**
 * creates node height calculator function
 */
const createNodeHeightCalculator = (
    categoryCounts,
    totalCount,
    targetSumOfNodeHeights,
    values
) => {
    const getBaseNodeHeight = (value) => {
        if (
            !categoryCounts ||
            !categoryCounts[value] ||
            totalCount === 0 ||
            targetSumOfNodeHeights <= 0
        ) {
            return START_NODE_HEIGHT;
        }
        const count = categoryCounts[value];
        const proportion = count / totalCount;
        const calculatedHeight = proportion * targetSumOfNodeHeights;
        const minCategoryHeight = Math.max(
            ABSOLUTE_MIN_NODE_HEIGHT,
            targetSumOfNodeHeights * 0.08
        );
        return Math.max(minCategoryHeight, calculatedHeight);
    };

    const calculateTotalHeightNeeded = () => {
        return values.reduce(
            (total, value) => total + getBaseNodeHeight(value),
            0
        );
    };

    const totalNeeded = calculateTotalHeightNeeded();
    const availableForNodes = targetSumOfNodeHeights;

    // basically scale down if too big
    if (totalNeeded > availableForNodes && availableForNodes > 0) {
        const scaleFactor = availableForNodes / totalNeeded;
        return (value) => {
            const baseHeight = getBaseNodeHeight(value);
            return Math.max(ABSOLUTE_MIN_NODE_HEIGHT, baseHeight * scaleFactor);
        };
    }

    return getBaseNodeHeight;
};

/**
 * creates nodes data array
 */
const createNodesData = (values, finalGetNodeHeight, baseYOffset) => {
    if (values.length === 0) return [];

    let currentY = baseYOffset;
    return values.map((value) => {
        const height = finalGetNodeHeight(value);
        const nodeInfo = { value, height, y: currentY + height / 2 };
        currentY += height + VERT_GAP;
        return nodeInfo;
    });
};

/**
 * renders nodes in svg
 */
const renderNodes = (
    nodeSetGroup,
    nodesData,
    centerX,
    colorScale,
    fontSize
) => {
    const nodeGroups = nodeSetGroup
        .selectAll(".node")
        .data(nodesData)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${centerX}, ${d.y})`);

    //  create rectangles for nodes
    nodeGroups
        .append("rect")
        .attr("width", NODE_WIDTH)
        .attr("height", (d) => d.height)
        .attr("x", -NODE_WIDTH / 2)
        .attr("y", (d) => -d.height / 2)
        // originally these are rounded, but didn't look nice
        .attr("rx", 0)
        .attr("ry", 0)
        .attr("fill", (d) => colorScale(d.value))
        .attr("stroke", STROKE_COLOR)
        .attr("stroke-width", 2);

    // add text labels
    nodeGroups
        .append("text")
        .text((d) => d.value)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", 0)
        .attr("y", 0)
        // font size hack from chatgpt so it fits
        .style(
            "font-size",
            (d) => `${Math.max(10, Math.min(fontSize, d.height * 0.35))}px`
        )
        .style("font-family", "Arial, sans-serif")
        .style("fill", TEXT_COLOR)
        .style("font-weight", "500");

    return nodeGroups;
};

/**
 * extracts node details for flow positioning
 */
const extractNodeDetails = (createdNodes) => {
    const nodeDetails = [];
    createdNodes.each(function (d) {
        const group = d3.select(this);
        const transform = group.attr("transform");
        // Originally, since the col is dynamically transformed by the d3
        // its not easy to find out how to draw the flows
        // so instead chatgpt gave me this regex which can extract the transforms
        // and match how to draw the flows
        const translateRegex = /translate\(([^,]+),([^)]+)\)/;
        const match = transform.match(translateRegex);

        let nodeX = 0;
        let nodeY = 0;
        if (match && match.length === 3) {
            nodeX = parseFloat(match[1]);
            nodeY = parseFloat(match[2]);
        }

        nodeDetails.push({
            value: d.value,
            x: nodeX - NODE_WIDTH / 2,
            y: nodeY - d.height / 2,
            width: NODE_WIDTH,
            height: d.height,
            centerX: nodeX,
            centerY: nodeY,
            svgGroup: group,
        });
    });
    return nodeDetails;
};

/**
 * calculates content end y position
 */
const calculateContentEndY = (nodesData) => {
    if (nodesData.length === 0) return 0;
    const lastNode = nodesData[nodesData.length - 1];
    return lastNode.y + lastNode.height / 2;
};

/**
 * animates between alternatives by sliding vertically up or down when button clicked
 * @param {number} slideIndex - slide index
 * @param {number} newAlternativeIndex - alternative to show
 */
const animateToAlternative = (slideIndex, newAlternativeIndex) => {
    const slideGroup = d3.select(`.slide-group-${slideIndex}`);
    if (slideGroup.empty()) return;

    const { actualEffectiveViewportHeight } = calculateVerticalDimensions(0, 1);
    const alternativeSlotHeight =
        actualEffectiveViewportHeight + INTER_ALTERNATIVE_GAP;
    const targetY = -newAlternativeIndex * alternativeSlotHeight;

    slideGroup
        .transition()
        .duration(500)
        .ease(d3.easeQuadInOut)
        .attr("transform", `translate(0, ${targetY})`);
};

/**
 * removes all existing flow links
 */
const clearFlows = () => {
    const pannableGroup = d3.select("#chart-content-group");
    if (!pannableGroup.empty()) {
        pannableGroup.selectAll(".flow-link-group").remove();
    }
};

/**
 * draws flows for the main visualization
 * @param {number} sourceColIdx - source column index
 * @param {number} sourceAltIdx - source alternative index
 * @param {number} targetColIdx - target column index
 * @param {number} targetAltIdx - target alternative index
 * @param {object} flowCounts - flow counts by key
 * @param {object} chartNodes - nodes
 */
const drawFlows = (
    sourceColIdx,
    sourceAltIdx,
    targetColIdx,
    targetAltIdx,
    flowCounts,
    chartNodes
) => {
    clearFlows();

    const pannableGroup = d3.select("#chart-content-group");
    if (pannableGroup.empty()) return;

    const sourceMeta = chartNodes[sourceColIdx]?.[sourceAltIdx];
    const targetMeta = chartNodes[targetColIdx]?.[targetAltIdx];

    if (
        !sourceMeta ||
        !targetMeta ||
        !sourceMeta.nodeDetails ||
        !targetMeta.nodeDetails
    )
        return;

    const sourceNodes = sourceMeta.nodeDetails;
    const targetNodes = targetMeta.nodeDetails;

    const { sourceYOffset, targetYOffset } = calculateAlternativeOffsets(
        sourceAltIdx,
        targetAltIdx
    );
    const flowLinkGroup = pannableGroup
        .append("g")
        .attr("class", "flow-link-group");

    const colorScheme = COLOR_SCHEME;

    const sourceColorScale = d3
        .scaleOrdinal(colorScheme)
        .domain(sourceNodes.map((node) => node.value));

    const { sourceFlowTotals, targetFlowTotals, flowsBySource } =
        organizeFlowData(flowCounts);
    const { sourceCurrentY, targetCurrentY } = initializeNodePositions(
        sourceNodes,
        targetNodes,
        sourceYOffset,
        targetYOffset
    );

    drawFlowPaths(
        sourceNodes,
        targetNodes,
        flowsBySource,
        sourceFlowTotals,
        targetFlowTotals,
        sourceCurrentY,
        targetCurrentY,
        sourceColorScale,
        flowLinkGroup
    );
};

/**
 * calculates y offsets for alts
 * so the flow thing works otherwise it plots based on original location
 *
 */
const calculateAlternativeOffsets = (sourceAltIdx, targetAltIdx) => {
    const { actualEffectiveViewportHeight } = calculateVerticalDimensions(0, 1);
    const alternativeSlotHeight =
        actualEffectiveViewportHeight + INTER_ALTERNATIVE_GAP;

    return {
        sourceYOffset: -sourceAltIdx * alternativeSlotHeight,
        targetYOffset: -targetAltIdx * alternativeSlotHeight,
    };
};

/**
 * calculates how to draw the flows accurately for the data
 */
const organizeFlowData = (flowCounts) => {
    const sourceFlowTotals = {};
    const targetFlowTotals = {};
    const flowsBySource = {};

    Object.entries(flowCounts).forEach(([key, count]) => {
        const [sourceNodeLabel, targetNodeLabel] = key.split("->");

        sourceFlowTotals[sourceNodeLabel] =
            (sourceFlowTotals[sourceNodeLabel] || 0) + count;
        targetFlowTotals[targetNodeLabel] =
            (targetFlowTotals[targetNodeLabel] || 0) + count;

        if (!flowsBySource[sourceNodeLabel]) {
            flowsBySource[sourceNodeLabel] = [];
        }
        flowsBySource[sourceNodeLabel].push({ target: targetNodeLabel, count });
    });

    // sort by target so it doesn't overlap stupidly
    Object.keys(flowsBySource).forEach((sourceLabel) => {
        flowsBySource[sourceLabel].sort((a, b) =>
            a.target.localeCompare(b.target)
        );
    });

    return { sourceFlowTotals, targetFlowTotals, flowsBySource };
};

/**
 * initializes node positions for flow tracking
 */
const initializeNodePositions = (
    sourceNodes,
    targetNodes,
    sourceYOffset,
    targetYOffset
) => {
    const sourceCurrentY = {};
    const targetCurrentY = {};

    sourceNodes.forEach((node) => {
        sourceCurrentY[node.value] =
            node.centerY - node.height / 2 + sourceYOffset;
    });

    targetNodes.forEach((node) => {
        targetCurrentY[node.value] =
            node.centerY - node.height / 2 + targetYOffset;
    });

    return { sourceCurrentY, targetCurrentY };
};

/**
 * draws flow paths between nodes
 */
const drawFlowPaths = (
    sourceNodes,
    targetNodes,
    flowsBySource,
    sourceFlowTotals,
    targetFlowTotals,
    sourceCurrentY,
    targetCurrentY,
    sourceColorScale,
    flowLinkGroup
) => {
    Object.keys(flowsBySource).forEach((sourceNodeLabel) => {
        const sourceNode = sourceNodes.find((n) => n.value === sourceNodeLabel);
        if (!sourceNode) return;

        const outgoingFlows = flowsBySource[sourceNodeLabel];
        const sourceTotal = sourceFlowTotals[sourceNodeLabel];
        const sourceColor = sourceColorScale(sourceNodeLabel);

        outgoingFlows.forEach(({ target: targetNodeLabel, count }) => {
            const targetNode = targetNodes.find(
                (n) => n.value === targetNodeLabel
            );
            if (!targetNode) return;

            // basically calculate flow heights proportionally
            const sourceFlowHeight = sourceNode.height * (count / sourceTotal);
            const targetTotal = targetFlowTotals[targetNodeLabel];
            const targetFlowHeight = targetNode.height * (count / targetTotal);

            const sourceFlowCenterY =
                sourceCurrentY[sourceNodeLabel] + sourceFlowHeight / 2;
            const targetFlowCenterY =
                targetCurrentY[targetNodeLabel] + targetFlowHeight / 2;

            sourceCurrentY[sourceNodeLabel] += sourceFlowHeight;
            targetCurrentY[targetNodeLabel] += targetFlowHeight;

            // i used chatgpt to help me with the link width calculation
            const linkWidth = Math.max(1, Math.sqrt(count) * 2);
            const linkPathData = d3.linkHorizontal()({
                source: [sourceNode.x + sourceNode.width, sourceFlowCenterY],
                target: [targetNode.x, targetFlowCenterY],
            });

            flowLinkGroup
                .append("path")
                .attr("d", linkPathData)
                .attr("stroke", sourceColor)
                .attr("stroke-opacity", 0.6)
                .attr("stroke-width", linkWidth)
                .attr("fill", "none");
        });
    });
};

export {
    makeNodes,
    animateToAlternative,
    clearFlows,
    drawFlows,
    calculateChartDimensions,
};
