/**
 * cache for grade bins so i dont recalculate every time
 */
const gradeBinsCache = {};

/**
 * gets or creates grade bins for column
 * @param {array} allCsvData - the dataset
 * @param {string} columnKey - column to get bins for
 * @returns {array} bin definitions
 */
const getGradeBinsForColumn = (allCsvData, columnKey) => {
    if (gradeBinsCache[columnKey]) {
        return gradeBinsCache[columnKey];
    }

    const allGrades = extractValidGrades(allCsvData, columnKey);
    const bins = createGradeBins(allGrades);
    gradeBinsCache[columnKey] = bins;
    return bins;
};

/**
 * cleans and parses grade value
 * @param {string} rawGrade - raw grade from csv
 * @returns {number} parsed grade
 */
const cleanAndParseGrade = (rawGrade) => {
    if (!rawGrade || rawGrade.toString().trim() === "") {
        return null;
    }

    // basically remove all non-numeric stuff except dots and commas
    let cleanGradeStr = rawGrade
        .toString()
        .trim()
        .replace(/[^\d.,\-]/g, "")
        .replace(",", ".");

    // fix multiple dots cause people are weird with number formatting
    const dotIndex = cleanGradeStr.indexOf(".");
    if (dotIndex !== -1) {
        const beforeDot = cleanGradeStr.substring(0, dotIndex);
        const afterDot = cleanGradeStr
            .substring(dotIndex + 1)
            .replace(/\./g, "");
        cleanGradeStr = beforeDot + "." + afterDot;
    }

    const parsedGrade = parseFloat(cleanGradeStr);
    return !isNaN(parsedGrade) && isFinite(parsedGrade) && parsedGrade >= 0
        ? parsedGrade
        : null;
};

/**
 * extracts valid grades from dataset
 * @param {array} dataset - csv dataset
 * @param {string} columnKey - column name
 * @returns {array} sorted grades
 */
const extractValidGrades = (dataset, columnKey) => {
    const grades = [];
    dataset.forEach((row) => {
        const grade = cleanAndParseGrade(row[columnKey]);
        if (grade !== null) {
            grades.push(grade);
        }
    });
    return grades.sort((a, b) => a - b);
};

/**
 * creates grade bins from sorted grades
 * @param {array} sortedGrades - sorted grades
 * @returns {array} bin definitions
 */
const createGradeBins = (sortedGrades) => {
    if (sortedGrades.length === 0) return [];

    const minGrade = sortedGrades[0];
    const maxGrade = sortedGrades[sortedGrades.length - 1];

    // basically if not enough data just use unique values or single bin
    if (sortedGrades.length < 10 || minGrade === maxGrade) {
        const uniqueGrades = [...new Set(sortedGrades)].sort((a, b) => a - b);
        if (uniqueGrades.length <= 5) {
            return uniqueGrades.map((g) => ({
                label: g.toFixed(1),
                min: g - 0.001,
                max: g + 0.001,
            }));
        } else {
            return [
                {
                    label: `${minGrade.toFixed(1)}-${maxGrade.toFixed(1)}`,
                    min: minGrade,
                    max: maxGrade,
                },
            ];
        }
    }

    // i used chatgpt to help me with quartile calculations cause math is hard
    const q1Index = Math.floor(sortedGrades.length * 0.25);
    const q2Index = Math.floor(sortedGrades.length * 0.5);
    const q3Index = Math.floor(sortedGrades.length * 0.75);
    const q1 = sortedGrades[q1Index];
    const q2 = sortedGrades[q2Index];
    const q3 = sortedGrades[q3Index];

    let bins = [
        {
            label: `${minGrade.toFixed(1)}-${q1.toFixed(1)}`,
            min: minGrade,
            max: q1,
        },
        { label: `${q1.toFixed(1)}-${q2.toFixed(1)}`, min: q1, max: q2 },
        { label: `${q2.toFixed(1)}-${q3.toFixed(1)}`, min: q2, max: q3 },
        {
            label: `${q3.toFixed(1)}-${maxGrade.toFixed(1)}`,
            min: q3,
            max: maxGrade,
        },
    ];

    // remove duplicate bins cause sometimes they happen
    bins = bins.filter((bin, index, array) => {
        if (index === 0) return true;
        return bin.min > array[index - 1].min || bin.max > array[index - 1].max;
    });

    // fix last bin to include max grade
    if (bins.length > 0 && bins[bins.length - 1].max < maxGrade) {
        bins[bins.length - 1].max = maxGrade;
        const lastBinLabelParts = bins[bins.length - 1].label.split("-");
        if (lastBinLabelParts.length === 2) {
            bins[bins.length - 1].label = `${
                lastBinLabelParts[0]
            }-${maxGrade.toFixed(1)}`;
        }
    }

    return bins;
};

/**
 * finds which bin a grade belongs to
 * @param {number} grade - the grade
 * @param {array} bins - bin definitions
 * @returns {string} bin label
 */
const findGradeBin = (grade, bins) => {
    if (bins.length === 0) return null;

    const minGrade = Math.min(...bins.map((b) => b.min));
    const maxGrade = Math.max(...bins.map((b) => b.max));

    // basically check each bin to see where grade fits
    for (const bin of bins) {
        if (bins.length === 1 && grade >= bin.min && grade <= bin.max) {
            return bin.label;
        }

        if (grade === minGrade && bin.min === minGrade) {
            return bin.label;
        }

        const isLastBin = bin.max === maxGrade;
        if (
            grade >= bin.min &&
            (grade < bin.max || (isLastBin && grade <= bin.max))
        ) {
            return bin.label;
        }
    }

    // fallback for edge cases
    for (const bin of bins) {
        if (grade === bin.max) return bin.label;
    }

    return null;
};

/**
 * maps categorical value using description.json
 * @param {string} rawValue - raw csv value
 * @param {string} columnKey - column name
 * @param {object} description - description json
 * @returns {string} mapped category
 */
const mapCategoricalValue = (rawValue, columnKey, description) => {
    if (!rawValue || rawValue.trim() === "") {
        return "Unknown";
    }

    const categoryMap = description[columnKey]?.categories;
    return categoryMap?.[rawValue] || rawValue.toString().trim() || "Unknown";
};

/**
 * processes single student value
 * @param {string} rawValue - raw csv value
 * @param {object} columnInfo - column info
 * @param {object} description - description json
 * @param {array} allCsvData - entire dataset
 * @returns {string} processed value
 */
const processSingleStudentValue = (
    rawValue,
    columnInfo,
    description,
    allCsvData
) => {
    const { key, type } = columnInfo;

    if (type === "categorical") {
        return mapCategoricalValue(rawValue, key, description);
    }

    if (type === "grade") {
        const grade = cleanAndParseGrade(rawValue);
        const bins = getGradeBinsForColumn(allCsvData, key);
        return findGradeBin(grade, bins);
    }

    return null;
};

/**
 * processes categorical data
 * @param {object} valueCounts - raw value counts
 * @returns {object} final values and counts
 */
const processCategoricalData = (valueCounts) => {
    // fancy sort per chatgpt
    const sortedValues = Object.entries(valueCounts).sort(
        ([, countA], [, countB]) => countB - countA
    );
    let finalCounts = {};
    let otherCount = 0;

    // 5 top catagories + other (if there are more)
    // otherwise too much clutter not useful in the chart
    if (sortedValues.length > 5) {
        sortedValues.slice(0, 5).forEach(([key, value]) => {
            finalCounts[key] = value;
        });
        sortedValues.slice(5).forEach(([, value]) => {
            otherCount += value;
        });
        if (otherCount > 0) {
            finalCounts["Other"] = otherCount;
        }
    } else {
        finalCounts = valueCounts;
    }

    // sort alphabetically but put "other" at end cause it looks better
    let valueKeys = Object.keys(finalCounts);
    const hasOther = valueKeys.includes("Other");

    if (hasOther) {
        valueKeys = valueKeys.filter((key) => key !== "Other");
    }
    valueKeys.sort((a, b) => a.localeCompare(b));
    if (hasOther) {
        valueKeys.push("Other");
    }

    return createFinalDataStructure(valueKeys, finalCounts);
};

/**
 * loads categorical data from column
 * @param {string} dataPath - csv path
 * @param {string} descriptionPath - json path
 * @param {string} columnKey - column key
 * @returns {object} final values
 */
const loadCategoricalData = async (dataPath, descriptionPath, columnKey) => {
    const [data, description] = await Promise.all([
        d3.dsv(";", dataPath),
        d3.json(descriptionPath),
    ]);

    const valueCounts = {};
    data.forEach((row) => {
        const value = mapCategoricalValue(
            row[columnKey],
            columnKey,
            description
        );
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    return processCategoricalData(valueCounts);
};

/**
 * creates final data structure
 * @param {array} finalValues - value labels
 * @param {object} valueCounts - value counts
 * @returns {object} structured data
 */
const createFinalDataStructure = (finalValues, valueCounts) => ({
    finalValues,
    valueCounts,
});

/**
 * processes grade data into bins
 * @param {string} dataPath - csv path
 * @param {string} columnKey - grade column
 * @param {string} chartNameForLogging - chart name
 * @returns {object} final values and counts
 */
const loadGradeData = async (dataPath, columnKey) => {
    const data = await d3.dsv(";", dataPath);
    const grades = extractValidGrades(data, columnKey);

    const bins = getGradeBinsForColumn(data, columnKey);
    const binCounts = {};
    bins.forEach((bin) => {
        binCounts[bin.label] = 0;
    });

    grades.forEach((grade) => {
        const binLabel = findGradeBin(grade, bins);
        if (binLabel) {
            binCounts[binLabel]++;
        }
    });

    // bin grades for the flows
    const finalBins = bins
        .filter((bin) => binCounts[bin.label] > 0)
        .map((bin) => bin.label);
    const finalCounts = {};
    finalBins.forEach((label) => {
        finalCounts[label] = binCounts[label];
    });

    // fallback to categorical if no bins work
    if (finalBins.length === 0) {
        return await loadCategoricalData(
            dataPath,
            "description.json",
            columnKey
        );
    }

    return createFinalDataStructure(finalBins, finalCounts);
};

/**
 * gets raw data for two columns to find pairs
 * @param {string} data - originally was for data, but now not used but take up first arg
 * @param {string} descriptionPath - json path
 * @param {object} column1Info - first column info
 * @param {object} column2Info - second column info
 * @param {array} allCsvData - preloaded csv
 * @returns {array} pairs of values
 */
const getRawDataForTwoColumns = async (
    data,
    descriptionPath,
    column1Info,
    column2Info,
    allCsvData
) => {
    if (!allCsvData) return null;

    const description = await d3.json(descriptionPath);
    const pairedValues = [];

    // basically go through each student and get their values for both columns
    allCsvData.forEach((studentDataRow) => {
        const val1 = processSingleStudentValue(
            studentDataRow[column1Info.key],
            column1Info,
            description,
            allCsvData
        );
        const val2 = processSingleStudentValue(
            studentDataRow[column2Info.key],
            column2Info,
            description,
            allCsvData
        );

        if (val1 !== null && val2 !== null) {
            pairedValues.push([val1, val2]);
        }
    });

    return pairedValues;
};

export { loadCategoricalData, loadGradeData, getRawDataForTwoColumns };
