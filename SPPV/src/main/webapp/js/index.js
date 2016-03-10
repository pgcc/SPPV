$(window).resize(function () {
        var width = $(window).width() - (88 + $("aside").width());
        var height = $(window).height() - ($("header").height() + 40);

        $("#graph").width(width)
                .height(height);

        $("aside").width(250);

        d3.select("svg")
                .attr("width", width)
                .attr("height", height);
});

$(document).ready(function () {

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
        if ($("#nodeTip").height() + posY + 80> height) {
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
        //alert(JSON.stringify(json));
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
                    return p.links.length * 1.5;
                });

        var node = svg.selectAll("image")
                .data(graph.nodes)
                .enter().append("image")
                .attr("class", function (n) {
                    return n.type;
                })
                .attr("xlink:href", "./images/circle.png")
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

    }, "json");

});
