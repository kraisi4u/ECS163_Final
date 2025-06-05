# Life of a student

Final project for ECS 163 Group 16

## Disclaimer

We did use chatgpt to help us understand how to write d3 code for the various visualizations, and commented about them in our code.

## Project Structure

```
MainVisualization/
├── index.html                Imports js and structured slides
├── data.csv                  Data from the UCI repo
├── description.json          Descriptions of the data, map to interpretable catagories
├── readme.md                 You're reading it lol
└── scripts/                  Folder containing all our js
    ├── main.js               The core of our slides, imports all other js, handles slide transitions and calling functions
    ├── dataLoader.js         Loads data and do some processing (eg. numerical to catagorical)
    ├── chart.js              Where the main chart is done
    ├── chartGenFunctions.js  CSAW FILL THIS IN
    ├── staticVizFunctions.js CSAW FILL THIS IN
    └── translations.js       CSAW FILL THIS IN
```

## Description

We aimed to create a continous alluval inspired diagram for our main visualization to illustrate the life of a student through stages. We created sub visualizations for the variables. Numerical variables were processed into bins.

In order to avoid unnessary complexity, we structured our project as a basic html + js project, without external frameworks with the exception of d3. The index.html sets up the slides and styles. It also loads d3, the font, and main.js as an esmodule. All other files are imported within main.js to handle each part of our functionality.

Our data needed additional interpretation beyond what is in the CSV, so we used chatgpt and the data card from the UCI source to create an description.json, used in our visualizations. The dataLoader.js file handles loading and processing data for the main visualization. The chart.js handles drawing the charts

CSAW ADD DETAILS ON THE SUB VIZ

## Installation

As there are no frameworks, this project can be directly cloned.

An http server should be hosted, with the root directory at the root of this project.

Then the user can navigate in a web browser to the url of their webserver, the page will be displayed at `/index.html` or just `/` based on the configuration of your webserver.

## Execution

The user can move between slides by using the left and right arrow keys.

The user can move up and down between slides that are alternatives to each other using the blue button at the bottom of each slide that says "Switch to next alternative".

In the main vusalization, the user can click on any originating box (nodes on the left column), and select it to filter only the flows coming out of that node. The user can deselect the node by clicking in the background, or by clicking on the node box again.

For slides with small (static) visualizations on the left side, users can click the arrow button in the top-right corner of the visualization to expand it to full screen.

Some static visualization have additional buttons to change between alternative static visualizations.

## Credits

ECS 163 Team 16 - Best Group Plus Ultra Beyond

Yunfei, Kian, Tong, Christopher
