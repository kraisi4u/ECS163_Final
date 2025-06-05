/**
 * Contains functions for translating 
 * coded datapoints from the csv into human readable text
 */


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

/**
 * Translate the nationality code to readable text
 * @param {number|string} code - the code to translate
 * @returns {string} - readable nationality
 */
function translateNationalityCode(code) {
    const codeMap = {
        1: "Portuguese",
        2: "German",
        6: "Spanish",
        11: "Italian",
        13: "Dutch",
        14: "English",
        17: "Lithuanian",
        21: "Angolan",
        22: "Cape Verdean",
        24: "Guinean",
        25: "Mozambican",
        26: "Santomean",
        32: "Turkish",
        41: "Brazilian",
        62: "Romanian",
        100: "Moldova (Republic of)",
        101: "Mexican",
        103: "Ukrainian",
        105: "Russian",
        108: "Cuban",
        109: "Colombian"
    };
    return codeMap[Number(code)] || "Other";
}

/**
 * Translate a yes/no code or value to readable text
 * @param {string|number} value - the value to translate (e.g., "1", "0", 1, 0, "yes", "no", etc.)
 * @returns {string} - "Yes", "No", or "Unknown"
 */
function translateYesNo(value) {
    if (value === 1 || value === "1" || value === "yes" || value === "Yes" || value === "Y" || value === "y" || value === true) {
        return "Yes";
    }
    if (value === 0 || value === "0" || value === "no" || value === "No" || value === "N" || value === "n" || value === false) {
        return "No";
    }
    return "Unknown";
}


/**
 * Translate the previous qualification code to readable text
 * @param {number|string} code - the code to translate
 * @returns {string} - readable previous qualification
 */
function translatePreviousQualification(code) {
    const codeMap = {
        1: "Secondary education",
        2: "Higher education - bachelor's degree",
        3: "Higher education - degree",
        4: "Higher education - master's",
        5: "Higher education - doctorate",
        6: "Frequency of higher education",
        9: "12th year of schooling - not completed",
        10: "11th year of schooling - not completed",
        12: "Other - 11th year of schooling",
        14: "10th year of schooling",
        15: "10th year of schooling - not completed",
        19: "Basic education 3rd cycle (9th/10th/11th year) or equiv.",
        38: "Basic education 2nd cycle (6th/7th/8th year) or equiv.",
        39: "Technological specialization course",
        40: "Higher education - degree (1st cycle)",
        42: "Professional higher technical course",
        43: "Higher education - master (2nd cycle)"
    };
    return codeMap[Number(code)] || "Other";
}

/**
 * Translate a daytime/evening code or value to readable text
 * @param {string|number} value - the value to translate (e.g., "1", "0", 1, 0, etc.)
 * @returns {string} - "Daytime", "Evening", or "Unknown"
 */
function translateAttendanceSection(value) {
    if (value === 1 || value === "1") {
        return "Daytime";
    }
    if (value === 0 || value === "0") {
        return "Evening";
    }
    return "Unknown";
}


/**
 * Translate the gender code to readable text
 * @param {numbers tring} code - the code to translate
 * @returns {string} - "Male" or "Female"
 */
function translateGenderCode(code) {
    const codeMap = {
        1: "Male",
        0: "Female"
    };
    return codeMap[Number(code)] || "Other";
}

/**
 * Translate the marital status code to readable text
 * @param {number|string} code
 * @returns {string}
 */
function translateMaritalStatus(code) {
    const codeMap = {
        1: "Single",
        2: "Married",
        3: "Widower",
        4: "Divorced",
        5: "Facto Union",
        6: "Legally Separated"
    };
    return codeMap[Number(code)] || "Unknown";
}

/**
 * Translate the course code to readable text
 * @param {number|string} code
 * @returns {string}
 */
function translateCourseCode(code) {
    const codeMap = {
        33: "Biofuel Production Technologies",
        171: "Animation and Multimedia Design",
        8014: "Social Service (evening attendance)",
        9003: "Agronomy",
        9070: "Communication Design",
        9085: "Veterinary Nursing",
        9119: "Informatics Engineering",
        9130: "Equinculture",
        9147: "Management",
        9238: "Social Service",
        9254: "Tourism",
        9500: "Nursing",
        9556: "Oral Hygiene",
        9670: "Advertising and Marketing Management",
        9773: "Journalism and Communication",
        9853: "Basic Education",
        9991: "Management (evening attendance)"
    };
    return codeMap[Number(code)] || "Unknown";
}

export {
    translateEducationCode,
    translateFatherJobCode,
    jobShortLabels,
    fatherJobShortLabels,
    qualificationShortLabels,
    translateJobCode,
    translateNationalityCode,
    translateYesNo,
    translatePreviousQualification,
    translateAttendanceSection,
    translateGenderCode,
    translateMaritalStatus,
    translateCourseCode,
};