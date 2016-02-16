$(window).resize(function () {
    var width = $(window).width() - (88 + $("aside").width());
    var height = $(window).height() - ($("header").height() + 40);

    $("#graph").width(width)
            .height(height);

    d3.select("svg")
            .attr("width", width)
            .attr("height", height);
});

$(document).ready(function () {

    var nodeTip = d3.select("#nodeTip")
            .style("opacity", 0);
    var linkTip = d3.select("#linkTip")
            .style("opacity", 0);

    function writeNodeTip(node) {
        $("#tipNodeName").html(node.name);
        $("#tipNodeType").html(node.type);
        nodeTip.style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY - 20) + "px");
    }

    function writeLinkTip(path) {
        var list = "<tr><th>Link</th><th>Type</th></tr>";
        for (l in path.links) {
            list += "<tr><td>" + path.links[l].name + "</td>"
                    + "<td class=\"inf" + path.links[l].inferred + "\">"
                    + path.links[l].inferred + "</td></tr>";
        }
        list += "</table>";
        $("#tipLinkType").html(list);
        $("#tipSourceName").html(path.source.name);
        $("#tipTargetName").html(path.target.name);
        linkTip.style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
    }
    
    var svg = d3.select("#graph")
            .append("svg");

    $(window).resize();

    $.post("FrontController?action=ReadGraph", function (json) {
        alert(JSON.stringify(json));
        var width = $("#graph").width();
        var height = $("#graph").height();
        var graph = json;

        var force = d3.layout.force()
                .charge(-300)
                .linkDistance(80)
                .linkStrength(0.1)
                .friction(0.9)
                .size([width, height])
                .nodes(graph.nodes)
                .links(graph.paths)
                .start();

        //Defines the arrow for the links
        svg.append("defs").selectAll("marker")
                .data(["inferred", "asserted"])
                .enter().append("marker")
                .attr("id", function (d) {
                    return d;
                })
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 22)
                .attr("refY", -2)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("id", function (d) {
                    return d;
                })
                .attr("d", "M0,-5L10,0L0,5");

        var path = svg.selectAll("path")
                .data(graph.paths)
                .enter().append("path")
                .attr("class", function (p) {
                    var pathClass = "";
                    //if (p.inferred)
                        //pathClass = "inferred";
                    //else
                        pathClass = "asserted";
                    pathClass += " s" + p.source.index + " t" + p.target.index;
                    return pathClass;
                })
                .on("mouseover", function (p) {
                    //alert(JSON.stringify(p));
                })
                .on("mouseout", function () {
                    linkTip.style("opacity", 0);
                })
                .on("click", function (p) {
                    writeLinkTip(p);
                    linkTip.style("opacity", 0.9);

                })
                .attr("marker-end", function (p) {
                    //if (p.inferred)
                        //return "url(#inferred)";
                    //else
                        return "url(#asserted)";
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
                .on("mouseover", function (n) {
                    setOpacity(0.1);
                    d3.select("#node" + n.index).style("opacity", 1.0);
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
                })
                .on("mouseout", function () {
                    setOpacity(1.0);
                    nodeTip.style("opacity", 0);
                })
                .on("click", function (n) {
                    writeNodeTip(n);
                    nodeTip.style("opacity", 0.9);
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
                    })
                    .attr("d", function (d) {
                        var dx = d.target.x - d.source.x,
                                dy = d.target.y - d.source.y,
                                dr = Math.sqrt(dx * dx + dy * dy);
                        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
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

        function setOpacity(value) {
            node.style("opacity", value);
            path.style("opacity", value);
            nodeName.style("opacity", value);
        }

    }, "json");

});
