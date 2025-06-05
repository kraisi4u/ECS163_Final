function drawBox(data, svg_id, width, height) {
            d3.select(svg_id).selectAll("*").remove();
            const svg = d3.select(svg_id)
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; background-color:rgb(240,255,240)");

            // creata x and y scale
            const x_scale = d3.scaleBand().domain(['x1', 'x2']).range([0, width - 200])
                .padding(0.4)

            const y_scale = d3.scaleLinear().domain([0, 200]).range([height - 200, 0]);

            // creata x and y axis
            const x_axis = d3.axisBottom(x_scale)
            const name_dict = { 'x1': "Previous qualification (grade)", 'x2': "Admission grade" }
            x_axis.tickFormat(i => name_dict[i]);
            const y_axis = d3.axisLeft(y_scale);

            const mainGroup = svg.append("g").attr("transform", "translate(100, 100)");

            // draw x axis and x label
            const gX = mainGroup.append("g")
                .attr("transform", `translate(0, ${height - 200})`)
                .call(x_axis)
            gX.selectAll("text").style("font-size", "24px");

            // draw y axis and y label
            const gY = mainGroup.append("g")
                .call(y_axis)
                .call(
                    (g) => g.append("text")
                        .attr("text-anchor", "middle") // start middle end
                        .attr("x", 0)
                        .attr("y", -20)
                        .attr("fill", "black")
                        .text("Score")
                )
            gY.selectAll("text").style("font-size", "24px");

            // draw title 
            const gTitle = mainGroup.append("g")
                .call(
                    (g) => g.append("text")
                        .attr("text-anchor", "middle") // start middle end
                        .attr("x", width / 2 - 100)
                        .attr("y", -50)
                        .attr("fill", "black")
                        .text("Distribution of Previous qualification (grade) and Admission grade")
                )
            gTitle.selectAll("text")
                .style("font-size", "32px")
                .style("font-weight", "bold")

            // function that return 5 numbers of a dataset.
            function calc5(xs) {
                xs.sort((a, b) => a - b);
                const x0 = xs[0]
                const x1 = xs[xs.length * 1 / 4]
                const x2 = xs[xs.length * 2 / 4]
                const x3 = xs[xs.length * 3 / 4]
                const x4 = xs[xs.length - 1]
                // console.log(x0, x1, x2, x3, x4);
                return [x0, x1, x2, x3, x4]
            }

            const barWidth = x_scale.bandwidth();
            ['x1', 'x2'].forEach((xname, i) => {
                const [y0, y1, y2, y3, y4] = calc5(data.map(d => d[xname]));

                console.log([y0, y1, y2, y3, y4])

                // draw center vertical line
                mainGroup.append('line')
                    .attr('x1', x_scale(xname) + barWidth / 2)
                    .attr('y1', y_scale(y0))
                    .attr('x2', x_scale(xname) + barWidth / 2)
                    .attr('y2', y_scale(y4))
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2)

                // draw the rect
                mainGroup.append("rect")
                    .attr('x', x_scale(xname)).attr('y', y_scale(y3))
                    .attr("width", barWidth).attr("height", y_scale(y1) - y_scale(y3))
                    .attr('fill', 'rgb(100, 200, 255)')
                    .attr('stroke', 'black')

                // draw the center horizontal line
                mainGroup.append('line')
                    .attr('x1', x_scale(xname))
                    .attr('y1', y_scale(y2))
                    .attr('x2', x_scale(xname) + barWidth)
                    .attr('y2', y_scale(y2))
                    .attr('stroke', 'red')
                    .attr('stroke-width', 6)


                // draw the top horizontal line
                mainGroup.append('line')
                    .attr('x1', x_scale(xname) + barWidth * 1 / 4)
                    .attr('y1', y_scale(y4))
                    .attr('x2', x_scale(xname) + barWidth * 3 / 4)
                    .attr('y2', y_scale(y4))
                    .attr('stroke', 'black')
                    .attr('stroke-width', 6)

                // draw the bottom horizontal line
                mainGroup.append('line')
                    .attr('x1', x_scale(xname) + barWidth * 1 / 4)
                    .attr('y1', y_scale(y0))
                    .attr('x2', x_scale(xname) + barWidth * 3 / 4)
                    .attr('y2', y_scale(y0))
                    .attr('stroke', 'black')
                    .attr('stroke-width', 6)
            });
        }

        function drawScatter(data, svg_id, width, height) {
            d3.select(svg_id).selectAll("*").remove();
            const svg = d3.select(svg_id)
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; background-color:rgb(240,255,240)");

            // creata x and y scale
            const x_scale = d3.scaleLinear().domain([0, 200]).range([0, width - 200]);
            const y_scale = d3.scaleLinear().domain([0, 200]).range([height - 200, 0]);

            // creata x and y axis
            const x_axis = d3.axisBottom(x_scale)
            const y_axis = d3.axisLeft(y_scale);

            const mainGroup = svg.append("g").attr("transform", "translate(100, 100)");

            // draw x axis and x label
            const gX = mainGroup.append("g")
                .attr("transform", `translate(0, ${height - 200})`)
                .call(x_axis)
                .call(
                    (g) => g.append("text")
                        .attr("x", (width - 200) / 2)
                        .attr("y", 60)
                        .attr("fill", "black")
                        .attr("text-anchor", "middle") // start middle end
                        .text("Previous qualification (grade)")
                )
            gX.selectAll("text").style("font-size", "24px");

            // draw y axis and y label
            const gY = mainGroup.append("g")
                .call(y_axis)
                .call(
                    (g) => g.append("text")
                        .attr("text-anchor", "middle") // start middle end
                        .attr("x", 0)
                        .attr("y", -20)
                        .attr("fill", "black")
                        .text("Admission grade")
                )
            gY.selectAll("text").style("font-size", "24px");

            // draw title 
            const gTitle = mainGroup.append("g")
                .call(
                    (g) => g.append("text")
                        .attr("text-anchor", "middle") // start middle end
                        .attr("x", width / 2 - 100)
                        .attr("y", -50)
                        .attr("fill", "black")
                        .text("Scatter of 3 Kinds of Target")
                )
            gTitle.selectAll("text")
                .style("font-size", "32px")
                .style("font-weight", "bold")


            const color = d3.scaleOrdinal(d3.schemeCategory10);
            const color_map = {
                'Dropout': color(0),
                'Graduate': color(1),
                'Enrolled': color(2),
            }
            const circle = mainGroup
                .selectAll('circle')
                .data(data)
                .join('circle')
                .attr('cx', (d) => x_scale(d['x1']))
                .attr('cy', (d) => y_scale(d['x2']))
                .attr('r', 3)
                .attr('fill', (d) => color_map[d['y']]);

            // create a legend at right-top of canvas
            const legend = svg
                .append('g')
                .attr("transform", `translate(${width - 140}, ${100})`);

            Object.keys(color_map).forEach((key, i) => {
                const item = legend.append('g').attr('transform', `translate(0, ${i * 25})`)

                // add cube with certain color.
                item.append('rect')
                    .attr('x', 0).attr('y', 0)
                    .attr("width", 20).attr("height", 20)
                    .attr('fill', color_map[key])

                // add legend text
                item.append('text')
                    .attr('x', 25).attr('y', 15)
                    .text(key).attr("style", "font-size:24px");
            });

            // add zoom in/out
            const zoom = d3.zoom().scaleExtent([0.5, 20])
                .on('zoom', (event) => {
                    const xTrans = event.transform.rescaleX(x_scale);
                    const yTrans = event.transform.rescaleY(y_scale);
                    circle
                        .attr("transform", `${event.transform}`)
                        .attr('r', 3 / event.transform.k)
                        // do not show the point if out of bound.
                        .attr('opacity', (d) => {
                            const x = xTrans(d['x1'])
                            const y = yTrans(d['x2'])
                            return 0 <= x && x <= width - 200 && 0 <= y && y <= height - 200 ? 1 : 0;
                        })

                    // rescale x axis and y axis
                    gX.call(x_axis.scale(xTrans))
                    gY.call(y_axis.scale(yTrans))
                    gX.selectAll("text").style("font-size", "24px");
                    gY.selectAll("text").style("font-size", "24px");
                })

            svg.call(zoom);
        }


        async function init() {

            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            // load data from csv.
            // const csv = await d3.dsv(";", 'data_simple.csv');
            const csv = await d3.dsv(";", 'data.csv');
            console.log(csv)

            const data = [];
            for (var row1 of csv) {
                const row2 = {
                    'x1': parseFloat(row1['Admission grade']),
                    'x2': parseFloat(row1['Previous qualification (grade)']),
                    'y': row1['Target']
                }
                data.push(row2)
            }
            console.log(data)

            drawBox(data, '#graph1', winWidth, winWidth / 2);
            drawScatter(data, '#graph2', winWidth, winWidth / 2)
        }

        init();
        window.addEventListener('resize', init);
