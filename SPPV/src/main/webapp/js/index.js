$(window).resize(function () {
    var width = $(window).width() - (88 + $("aside").width());
    var height = $(window).height() - ($("header").height() + 69);

    $("#graph").width(width)
            .height(height);

    $("aside").width(250);

    d3.select("svg")
            .attr("width", width)
            .attr("height", height);
});

$(document).ready(function () {
    $("#chartVis").hide();
    $("#graphVis").hide();
    //$("#flowVis").hide();

    var startTime = Date.now();
    var nodeTip = d3.select("#nodeTip")
            .style("opacity", 0);
    var pathTip = d3.select("#pathTip")
            .style("opacity", 0);
    //Auxiliar Tip functions
    function writeNodeTip(node) {
        $("#tipNodeName").html(node.name);
        $("#tipNodeType").html(node.type);
        //Calculating the node tip position
        var width = $(window).width();
        var posX = d3.event.pageX;
        if ($("#nodeTip").width() + posX + 40 > width) {
            posX -= ($("#nodeTip").width() + 20);
        } else {
            posX += 20;
        }
        var height = $(window).height();
        var posY = d3.event.pageY;
        if ($("#nodeTip").height() + posY + 80 > height) {
            posY -= $("#nodeTip").height();
        } else {
            posY -= 20;
        }

        nodeTip.style("left", posX + "px")
                .style("top", posY + "px");
    }

    function writePathTip(path) {
        pathTip.style("left", "0px")
                .style("top", "0px");
        var list = "<tr><th>Link</th><th>Sense</th><th>Type</th></tr>";
        for (l in path.links) {
            list += "<tr><td>" + path.links[l].name + "</td>";
            if (path.links[l].sense) {
                list += "<td class=\"bigfont\">&#8702;</td>";
            } else {
                list += "<td>&#8701;</td>";
            }
            list += "<td class=\"inf" + path.links[l].inferred + "\">";
            if (path.links[l].inferred) {
                list += "Inferred</td></tr>";
            } else {
                list += "Asserted</td></tr>";
            }
        }
        list += "</table>";
        $("#tipLinkType").html(list);
        $("#tipSourceName").html(path.source.name);
        $("#tipTargetName").html(path.target.name);
        //Calculating the path tip position
        var width = $(window).width();
        var posX = d3.event.pageX;
        if ($("#pathTip").width() + posX + 60 > width) {
            posX -= ($("#pathTip").width() + 30);
        } else {
            posX += 30;
        }
        var height = $(window).height();
        var posY = d3.event.pageY;
        if ($("#pathTip").height() + posY > height) {
            posY -= $("#pathTip").height();
        } else {
            posY -= 30;
        }

        pathTip.style("left", posX + "px")
                .style("top", posY + "px");
    }

    var svg = d3.select("#graph")
            .append("svg");
    $(window).resize();
    $.post("FrontController?action=ReadGraph", function (json) {
        alert(JSON.stringify(json));
        //$("#chartVis").html(JSON.stringify(json));
        //json = {"nodes": [{"name": "A"}, {"name": "B"}, {"name": "C"}, {"name": "D"}, {"name": "E"}, {"name": "F"}, {"name": "G"}, {"name": "H"}, {"name": "I"}, {"name": "J"}, {"name": "K"}, {"name": "L"}, {"name": "M"}, {"name": "N"}, {"name": "O"}, {"name": "P"}, {"name": "Q"}, {"name": "R"}, {"name": "S"}, {"name": "T"}, {"name": "U"}, {"name": "V"}, {"name": "W"}, {"name": "X"}, {"name": "Y"}, {"name": "Z"}], "paths": [{"source": 0, "target": 4}, {"source": 0, "target": 5}, {"source": 0, "target": 3}, {"source": 0, "target": 7}, {"source": 0, "target": 6}, {"source": 6, "target": 1}, {"source": 1, "target": 9}, {"source": 1, "target": 11}, {"source": 1, "target": 12}, {"source": 1, "target": 10}, {"source": 10, "target": 2}, {"source": 2, "target": 13}, {"source": 2, "target": 14}, {"source": 2, "target": 16}, {"source": 2, "target": 15}, {"source": 16, "target": 8}, {"source": 8, "target": 17}, {"source": 8, "target": 18}, {"source": 17, "target": 18}, {"source": 15, "target": 19}, {"source": 19, "target": 20}, {"source": 19, "target": 23}, {"source": 20, "target": 21}, {"source": 21, "target": 24}, {"source": 24, "target": 22}, {"source": 22, "target": 25}, {"source": 23, "target": 20}, {"source": 23, "target": 21}, {"source": 23, "target": 24}, {"source": 23, "target": 22}, {"source": 23, "target": 25}]};
        calculus(json);
        var width = $("#graph").width();
        var height = $("#graph").height();
        var graph = json;
        //D3 definittions
        var force = d3.layout.force()
                .charge(-300)
                .linkDistance(80)
                .linkStrength(0.1)
                .friction(0.9)
                .size([width, height])
                .nodes(graph.nodes)
                .links(graph.paths)
                .start();
        var path = svg.selectAll(".path")
                .data(graph.paths)
                .enter().append("line")
                .attr("class", function (p) {
                    var pathClass = "path " + p.type;
                    pathClass += " s" + p.source.index + " t" + p.target.index;
                    return pathClass;
                })
                .on("click", function (p) {
                    writePathTip(p);
                    pathTip.style("opacity", 0.9);
                })
                .on("mouseout", function (p) {
                    pathTip.style("opacity", 0);
                })
                .style("stroke-width", function (p) {
                    if (p.links.length >= 4)
                        return 4;
                    else if (p.links.length >= 2)
                        return 3;
                    else
                        return 2;
                });
        var node = svg.selectAll("image")
                .data(graph.nodes)
                .enter().append("image")
                .attr("class", function (n) {
                    return n.type;
                })
                .attr("xlink:href", function (n) {
                    if (n.type === "Activity") {
                        $("#taskNameLabel").html("Activities");
                        return "./images/activity" + calcBrightness(n.index);
                    } else if (n.type === "Person" || n.type === "Agent" || n.type === "Organization" || n.type === "SoftwareAgent") {
                        $("#actorNameLabel").html("Agents");
                        return "./images/agent" + calcBrightness(n.index);
                    } else {
                        $("#entityNameLabel").html("Entities");
                        return "./images/entity" + calcBrightness(n.index);
                    }
                })
                .attr("id", function (n) {
                    return "node" + n.index;
                })
                .attr("width", "24")
                .attr("height", "24")
                .on("click", function (n) {
                    writeNodeTip(n);
                    nodeTip.style("opacity", 0.9);
                })
                .on("mouseout", function () {
                    nodeTip.style("opacity", 0);
                    if ($("#hideFilterNodeActive").val() === "false") {
                        setOpacity(1.0);
                    }
                })
                .on("mouseover", function (n) {
                    if ($("#hideFilterNodeActive").val() === "false") {
                        setOpacity(0.1);
                        d3.select(this).style("opacity", 1.0);
                        d3.select("#name" + n.index).style("opacity", 1.0);
                        d3.selectAll(".s" + n.index).each(function (p) {
                            d3.select(this).style("opacity", 1.0);
                            d3.select("#node" + p.target.index).style("opacity", 1.0);
                            d3.select("#name" + p.target.index).style("opacity", 1.0);
                        });
                        d3.selectAll(".t" + n.index).each(function (p) {
                            d3.select(this).style("opacity", 1.0);
                            d3.select("#node" + p.source.index).style("opacity", 1.0);
                            d3.select("#name" + p.source.index).style("opacity", 1.0);
                        });
                    }
                })
                .call(force.drag);
        var nodeName = svg.append("g").selectAll("text")
                .data(force.nodes())
                .enter().append("text")
                .attr("class", function (n) {
                    return n.type + "Name";
                })
                .attr("id", function (n) {
                    return "name" + n.index;
                })
                .attr("x", 10)
                .attr("y", ".31em")
                .text(function (d) {
                    return d.name;
                });
        force.on("tick", function () {
            path.attr("x1", function (d) {
                return d.source.x;
            })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });
            node.attr("x", function (d) {
                return d.x - 12;
            })
                    .attr("y", function (d) {
                        return d.y - 12;
                    });
            nodeName.attr("x", function (d) {
                return d.x;
            })
                    .attr("y", function (d) {
                        return d.y;
                    });
        });

        for (var n in graph.nodes) {
            $("#nodeA").append("<option value=\"" + n + "\" data-class=\"" +
                    graph.nodes[n].type + "\">" + graph.nodes[n].name + "</option>");
            $("#nodeB").append("<option value=\"" + n + "\" data-class=\"" +
                    graph.nodes[n].type + "\">" + graph.nodes[n].name + "</option>");
        }

        renderTime(Date.now() - startTime);
    }, "json");

    function setOpacity(value) {
        d3.selectAll("image").style("opacity", value);
        d3.selectAll(".path").style("opacity", value);
        d3.selectAll("text").style("opacity", value);
    }

    function renderTime(ms) {
        var s = ms / 1000;
        $("#timeRendering").html(s + " s");
    }

    function calcBrightness(index) {
        var connections = 0;
        d3.selectAll(".s" + index).each(function () {
            connections++;
        });
        d3.selectAll(".t" + index).each(function () {
            connections++;
        });
        if (connections >= 4) {
            return "3.png";
        } else if (connections >= 2) {
            return "2.png";
        } else {
            return "1.png";
        }
    }
    //------------------------------------------------------------------------//
    function calculus(json) {
        var n = json.nodes.length;
        var betweenness = calcBetweenness(json);
        for (i = 0; i < n; i++) {
            $("#calculus").append("<tr>" +
                    "<td>" + i + "</td>" +
                    "<td>" + json.nodes[i].name + "</td>" +
                    "<td>" + calcGrau(i, json) + "</td>" +
                    "<td>" + calcLocal(i, json) + "</td>" +
                    "<td>" + calcCloseness(i, json) + "</td>" +
                    "<td>" + 1 /*betweenness[i]*/ + "</td>" +
                    "</tr>");
        }
    }

    function calcGrau(i, json) {
        var grau = 0;
        json.paths.forEach(function (path) {
            if (path.source === i || path.target === i)
                grau++;
        });
        return grau;
    }

    function calcLocal(i, json) {
        var n = json.nodes.length;
        return 2 * calcGrau(i, json) / (n * n - 1);
    }

    function calcCloseness(i, json) {
        var n = json.nodes.length;
        if (n <= 1)
            return 0;
        var l = json.paths.length;
        var distArray = new Array();
        for (j = 0; j < n; j++) {
            distArray[j] = l + 1;
        }
        distArray[i] = 0;
        calcDistance(i, json.paths, distArray, 1);
        var sum = 0;
        for (j = 0; j < n; j++) {
            sum += distArray[j];
        }

        return sum / (n * (n - 1));
    }

    function calcDistance(i, paths, distArray, dist) {
        paths.forEach(function (path) {
            if (path.source === i) {
                if (distArray[path.target] > dist) {
                    distArray[path.target] = dist;
                    calcDistance(path.target, paths, distArray, dist++)
                }
            } else if (path.target === i) {
                if (distArray[path.source] > dist) {
                    distArray[path.source] = dist;
                    calcDistance(path.source, paths, distArray, dist++)
                }
            }
        });
    }

    function assertBetweenness(i, paths, distArray, dist) {

    }

    function calcBetweenness(json) {
        /*
         var betweenness = new Array();
         
         json.nodes.forEach(function (node, i) {
         var distArray = new Array();
         
         distArray.forEach(function (element){
         element = json.paths.length + 1;
         });
         distArray[i] = 0;
         
         calcDistance(i, json.paths, distArray, 1);
         
         paths.forEach(function (path) {
         if (path.source === i) {
         if (distArray[path.target] > dist) {
         distArray[path.target] = dist;
         calcDistance(path.target, paths, distArray, dist++)
         }
         } else if (path.target === i) {
         if (distArray[path.source] > dist) {
         distArray[path.source] = dist;
         calcDistance(path.source, paths, distArray, dist++)
         }
         }
         });
         
         
         
         
         
         
         });
         return betweenness;*/
    }

});
