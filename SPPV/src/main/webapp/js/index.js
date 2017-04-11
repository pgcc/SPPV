$(document).ready(function () {
    var startTime = Date.now();

    $("#chartVis").hide();
    $("#graphVis").hide();

    var startTime = Date.now();
    var nodeTip = d3.select("#nodeTip")
            .style("opacity", 0);
    var pathTip = d3.select("#pathTip")
            .style("opacity", 0);
    //-------------------------------------------------------Write Tip Functions
    function writeNodeTip(graph, node) {
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

        var list = "<tr><th>Relation</th><th>Instance</th></tr>";

        for (i = 0; i < graph.paths.length; i++) {

            if (graph.paths[i].source == node) {

                graph.paths[i].links.forEach(function (link) {
                    if (link.sense) {
                        list += "<tr><td";
                        if (link.inferred) {
                            list += " class=\"inftrue\"";
                        }
                        list += ">" + link.name + "</td><td>" + graph.paths[i].target.name + "</td></tr>";
                    }
                });
            } else if (graph.paths[i].target == node) {
                graph.paths[i].links.forEach(function (link) {
                    if (!link.sense) {
                        list += "<tr><td";
                        if (link.inferred) {
                            list += " class=\"inftrue\"";
                        }
                        list += ">" + link.name + "</td><td>" + graph.paths[i].source.name + "</td></tr>";
                    }
                });
            }
        }
        $("#tipNodeLinks").html(list);

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
    //--------------------------------------------------------------SVG Creation

    var w = window.innerWidth;
    var h = window.innerHeight;

    var keyc = true, keys = true, keyt = true, keyr = true, keyx = true, keyd = true, keyl = true, keym = true, keyh = true, key1 = true, key2 = true, key3 = true, key0 = true

    var focus_node = null, highlight_node = null;

    var text_center = false;
    var outline = false;

    var min_score = 0;
    var max_score = 1;


    var color = d3.scale.linear()
            .domain([min_score, (min_score + max_score) / 2, max_score])
            .range(["lime", "yellow", "red"]);


    var highlight_color = "blue";
    var highlight_trans = 0.1;

    var size = d3.scale.pow().exponent(1)
            .domain([1, 100])
            .range([8, 24]);

    var force = d3.layout.force()
            .linkDistance(80)
            .linkStrength(0.3)
            .friction(0.9)
            .charge(-300)
            .size([w, h]);

    var default_node_color = "#CCC";
    var nominal_base_node_size = 8;
    var nominal_text_size = 10;
    var max_text_size = 24;
    var nominal_stroke = 1.5;
    var max_stroke = 4.5;
    var max_base_node_size = 36;
    var min_zoom = 0.5;
    var max_zoom = 5;
    var svg = d3.select("#graph").append("svg");
    var zoom = d3.behavior.zoom().scaleExtent([min_zoom, max_zoom])
    var g = svg.append("g");
    svg.style("cursor", "move");

//graph
//OntologyProvProcess
//ex2
//prov-oext
//provprocess1
//provprocess2

    d3.json("./json/graph.json", function (graph) {
        //$.post("FrontController?action=ReadGraph", function (json) {

        calculus(graph);

        resize();
        var linkedByIndex = {};
        graph.paths.forEach(function (d) {
            linkedByIndex[d.source + "," + d.target] = true;
        });

        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }

        function hasConnections(a) {
            for (var property in linkedByIndex) {
                s = property.split(",");
                if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property])
                    return true;
            }
            return false;
        }

        force.nodes(graph.nodes)
                .links(graph.paths)
                .start();

        var path = g.selectAll(".path")
                .data(graph.paths)
                .enter().append("line")
                .attr("class", function (p) {
                    var pathClass = "path " + p.type;
                    pathClass += " s" + p.source.index + " t" + p.target.index;
                    return pathClass;
                })
                .style("stroke-width", function (p) {
                    return p.links.length * nominal_stroke;
                })
                .style("stroke", function (p) {
                    return pathColor(p);
                });

        var node = g.selectAll(".node")
                .data(graph.nodes)
                .enter().append("g")
                .attr("class", function (n) {
                    return "node keys " + n.type;
                })
                .call(force.drag);

        node.on("dblclick.zoom", function (d) {
            d3.event.stopPropagation();
            var dcx = (window.innerWidth / 2 - d.x * zoom.scale());
            var dcy = (window.innerHeight / 2 - d.y * zoom.scale());
            zoom.translate([dcx, dcy]);
            g.attr("transform", "translate(" + dcx + "," + dcy + ")scale(" + zoom.scale() + ")");
        });

        var tocolor = "fill";
        var towhite = "stroke";
        if (outline) {
            tocolor = "stroke";
            towhite = "fill";
        }

        var circle = node.append("image")
                .attr("d", d3.svg.symbol()
                        .size(function (n) {
                            return Math.PI * Math.pow(size(n.size) || nominal_base_node_size, 2);
                        })

                        .type(function (n) {
                            return nodeType(n);
                        })
                        )
                .attr("width", "24")
                .attr("height", "24")
                .attr("xlink:href", function (n) {
                    return "./images/" + n.type + ".png";
                })
                //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
                .style("stroke-width", nominal_stroke)
                .style(towhite, "#666666");

        var text = g.selectAll(".text")
                .data(graph.nodes)
                .enter().append("text")
                .attr("dy", ".35em")
                .attr("class", function (n) {
                    return n.type
                })
                .style("font-size", nominal_text_size + "px");

        if (text_center)
            text.text(function (d) {
                return d.id;
            })
                    .style("text-anchor", "middle");
        else
            text.attr("dx", function (d) {
                return (size(d.size) || nominal_base_node_size);
            })
                    .text(function (d) {
                        return '\u2002' + d.name;
                    });

        node.on("mouseover", function (d) {
            set_highlight(d);
        })
                .on("mousedown", function (d) {
                    d3.event.stopPropagation();
                    focus_node = d;
                    set_focus(d)
                    if (highlight_node === null)
                        set_highlight(d);

                })
                .on("mouseout", function (d) {
                    exit_highlight();
                    nodeTip.style("opacity", 0);
                })
                .on("click", function (n) {
                    writeNodeTip(graph, n);

                    nodeTip.style("opacity", 0.9);
                });

        path.on("click", function (p) {
            writePathTip(p);
            pathTip.style("opacity", 0.9);
        })
                .on("mouseout", function (p) {
                    pathTip.style("opacity", 0);
                });

        d3.select(window).on("mouseup",
                function () {
                    if (focus_node !== null)
                    {
                        focus_node = null;
                        if (highlight_trans < 1)
                        {
                            circle.style("opacity", 1);
                            text.style("opacity", 1);
                            path.style("opacity", 1);
                        }
                    }

                    if (highlight_node === null)
                        exit_highlight();
                });

        function exit_highlight() {
            highlight_node = null;
            if (focus_node === null) {
                svg.style("cursor", "move");
                if (highlight_color != "#666666") {
                    circle.style(towhite, "#666666");
                    text.style("font-weight", "normal");
                    path.style("stroke", function (p) {
                        return pathColor(p);
                    });
                }
            }
        }

        function set_focus(d) {
            if (highlight_trans < 1) {
                circle.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });

                text.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });

                path.style("opacity", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
                });
            }
        }

        function set_highlight(d) {
            svg.style("cursor", "pointer");
            if (focus_node !== null)
                d = focus_node;
            highlight_node = d;

            if (highlight_color != "#666666") {
                circle.style(towhite, function (o) {
                    return isConnected(d, o) ? highlight_color : "#666666";
                });
                text.style("font-weight", function (o) {
                    return isConnected(d, o) ? "bold" : "normal";
                });
                path.style("stroke", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? highlight_color : function (p) {
                        return pathColor(p);
                    };

                });
            }
        }

        zoom.on("zoom", function () {

            var stroke = nominal_stroke;
            if (nominal_stroke * zoom.scale() > max_stroke)
                stroke = max_stroke / zoom.scale();
            path.style("stroke-width", function (p) {
                return stroke * p.links.length;
            });
            circle.style("stroke-width", stroke);

            var base_radius = nominal_base_node_size;
            if (nominal_base_node_size * zoom.scale() > max_base_node_size)
                base_radius = max_base_node_size / zoom.scale();
            circle.attr("d", d3.svg.symbol()
                    .size(function (n) {
                        return Math.PI * Math.pow(size(n.size) * base_radius / nominal_base_node_size || base_radius, 2);
                    })
                    .type(function (n) {
                        return nodeType(n);
                    }));

            //circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
            if (!text_center)
                text.attr("dx", function (d) {
                    return (size(d.size) * base_radius / nominal_base_node_size || base_radius);
                });

            var text_size = nominal_text_size;
            if (nominal_text_size * zoom.scale() > max_text_size)
                text_size = max_text_size / zoom.scale();
            text.style("font-size", text_size + "px");

            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });

        svg.call(zoom);

        resize();

        d3.select(window).on("resize", resize).on("keydown", keydown);

        force.on("tick", function () {

            node.attr("transform", function (d) {
                return "translate(" + (d.x - 12) + "," + (d.y - 12) + ")";
            });
            text.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

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

            node.attr("cx", function (d) {
                return d.x;
            })
                    .attr("cy", function (d) {
                        return d.y;
                    });
        });

        function resize() {
            var width = $(window).width() - (88 + $("aside").width());
            var height = $(window).height() - ($("header").height() + 54);

            $("#graph").width(width)
                    .height(height);

            $("aside").width(250);

            svg.attr("width", width)
                    .attr("height", height);

            force.size([force.size()[0] + (width - w) / zoom.scale(), force.size()[1] + (height - h) / zoom.scale()]).resume();
            w = width;
            h = height;
        }

        function keydown() {
            if (d3.event.keyCode == 32) {
                force.stop();
            } else if (d3.event.keyCode >= 48 && d3.event.keyCode <= 90 && !d3.event.ctrlKey && !d3.event.altKey && !d3.event.metaKey)
            {
                switch (String.fromCharCode(d3.event.keyCode)) {
                    case "C":
                        keyc = !keyc;
                        break;
                    case "S":
                        keys = !keys;
                        break;
                    case "T":
                        keyt = !keyt;
                        break;
                }
                path.style("display", function (d) {
                    var flag = vis_by_type(d.source.type) && vis_by_type(d.target.type) && vis_by_node_score(d.source.score) && vis_by_node_score(d.target.score) && vis_by_link_score(d.score);
                    linkedByIndex[d.source.index + "," + d.target.index] = flag;
                    return flag ? "inline" : "none";
                });
                node.style("display", function (d) {
                    return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" : "none";
                });
                text.style("display", function (d) {
                    return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" : "none";
                });

                if (highlight_node !== null)
                {
                    if ((key0 || hasConnections(highlight_node)) && vis_by_type(highlight_node.type) && vis_by_node_score(highlight_node.score)) {
                        if (focus_node !== null)
                            set_focus(focus_node);
                        set_highlight(highlight_node);
                    } else {
                        exit_highlight();
                    }
                }

            }
        }
        
        for (var n in graph.nodes) {
            $("#nodeA").append("<option value=\"" + n + "\" data-class=\"" +
                    graph.nodes[n].type + "\">" + graph.nodes[n].name + "</option>");
            $("#nodeB").append("<option value=\"" + n + "\" data-class=\"" +
                    graph.nodes[n].type + "\">" + graph.nodes[n].name + "</option>");
        }
        
        //-------------------------------------------------------Filter Function
    $("#filterNodes")
            .click(function (event) {
            /*    event.preventDefault();

                var nA = $("#nodeA").val();
                var nB = $("#nodeB").val();

                var nodeA = node.selectAll()
                        .filter(function (d) {
                            return d.name === nA;
                        });

                //d3.event.stopPropagation();
                focus_node = nodeA;
                set_focus(nodeA);
                if (highlight_node === null)
                    set_highlight(nodeA);

                /*
                 setOpacity(0.1);
                 var nA = $("#nodeA").val();
                 var nB = $("#nodeB").val();
                 d3.select("#node" + nA).style("opacity", 1.0);
                 d3.select("#name" + nA).style("opacity", 1.0);
                 d3.selectAll(".s" + nA).each(function (p) {
                 d3.select(this).style("opacity", 1.0);
                 d3.select("#node" + p.target.index).style("opacity", 1.0);
                 d3.select("#name" + p.target.index).style("opacity", 1.0);
                 });
                 d3.selectAll(".t" + nA).each(function (p) {
                 d3.select(this).style("opacity", 1.0);
                 d3.select("#node" + p.source.index).style("opacity", 1.0);
                 d3.select("#name" + p.source.index).style("opacity", 1.0);
                 });
                 d3.select("#node" + nB).style("opacity", 1.0);
                 d3.select("#name" + nB).style("opacity", 1.0);
                 d3.selectAll(".s" + nB).each(function (p) {
                 d3.select(this).style("opacity", 1.0);
                 d3.select("#node" + p.target.index).style("opacity", 1.0);
                 d3.select("#name" + p.target.index).style("opacity", 1.0);
                 });
                 d3.selectAll(".t" + nB).each(function (p) {
                 d3.select(this).style("opacity", 1.0);
                 d3.select("#node" + p.source.index).style("opacity", 1.0);
                 d3.select("#name" + p.source.index).style("opacity", 1.0);
                 });
                 $("#hideFilterNodeActive").val("true");*/
            });
        
        renderTime(Date.now() - startTime);
    });

    function vis_by_type(type) {
        switch (type) {
            case "Entity":
                return keyc;
            case "Activity":
                return keys;
            case "Agent":
                return keyt;
            default:
                return true;
        }
    }
    
    function vis_by_node_score(score) {
        if (isNumber(score))
        {
            if (score >= 0.666)
                return keyh;
            else if (score >= 0.333)
                return keym;
            else if (score >= 0)
                return keyl;
        }
        return true;
    }

    function vis_by_link_score(score) {
        if (isNumber(score))
        {
            if (score >= 0.666)
                return key3;
            else if (score >= 0.333)
                return key2;
            else if (score >= 0)
                return key1;
        }
        return true;
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function nodeType(n) {
        if (n.type == "Activity") {
            return "square";
        } else if (n.type == "Entity") {
            return "circle";
        } else {
            return "triangle-up";
        }
    }

    function pathColor(p) {
        if (p.type == "both") {
            return "#ffff40";
        } else if (p.type == "inferred") {
            return "red";
        } else {
            return "green";
        }
    }

    function renderTime(ms) {
        var s = ms / 1000;
        $("#timeRendering").html(s + " s");
    }
});