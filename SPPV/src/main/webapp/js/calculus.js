function calculus(graph) {

    var maxDegree = calcDegree(graph);
    calcAmount(graph);
    graph = reduceGraph(graph, maxDegree);

    $("#flowVis").html(JSON.stringify(graph));

    $("#calculus").html("<tr><th>Node</th><th>Name</th><th>Type</th><th>Degree</th><th>Centralidade Local</th><th>Closeness</th><th>Betweeness</th></tr>");
    graph.nodes.forEach(function (node, index) {
        $("#calculus").append("<tr>" +
                "<td>" + index + "</td>" +
                "<td>" + node.name + "</td>" +
                "<td>" + node.type + "</td>" +
                "<td>" + node.degree + "</td>" +
                "<td> - </td>" +
                "<td> - </td>" +
                "<td> - </td>" +
                "</tr>");
    });

    calcNewAmount(graph);
    return graph;
}

//Create or Refresh all degree property in each node and return the max degree found
function calcDegree(graph) {
    var max = 0;
    graph.nodes.forEach(function (node, index) {
        var degree = 0;
        graph.paths.forEach(function (path) {
            if (path.source === index || path.target === index) {
                degree++;
            }
        });
        node.degree = degree;
        if (degree > max)
            max = degree;
    });
    return max;
}

function calcAmount(graph) {
    var amount = JSON.parse('{"agents":0, "activities":0, "entities":0}');

    amount.agents = 0;
    amount.activities = 0;
    amount.entities = 0;

    graph.nodes.forEach(function (node, index) {
        var degree = 0;
        if (node.type === "Activity")
            amount.activities++;
        else if (node.type === "Entity")
            amount.entities++;
        else if (node.type === "Agent")
            amount.agents++;

    });

    $("#agentAmaunt").html(amount.agents);
    $("#activityAmaunt").html(amount.activities);
    $("#entityAmaunt").html(amount.entities);
    $("#totalAmaunt").html(amount.entities + amount.activities + amount.agents);
}

function calcNewAmount(graph) {
    var amount = JSON.parse('{"agents":0, "activities":0, "entities":0, "groups":0}');

    amount.agents = 0;
    amount.activities = 0;
    amount.entities = 0;

    graph.nodes.forEach(function (node, index) {
        var degree = 0;
        if (node.type === "Activity")
            amount.activities++;
        else if (node.type === "Entity")
            amount.entities++;
        else if (node.type === "Agent")
            amount.agents++;
        else
            amount.groups++;
    });

    $("#agentAfter").html(amount.agents);
    $("#activityAfter").html(amount.activities);
    $("#entityAfter").html(amount.entities);
    $("#totalAfter").html(amount.entities + amount.activities + amount.agents);
}

function reduceGraph(graph, maxDegree) {
    var types = ["Activity", "Entity", "Agent"];
    var degree = 0;
    while (degree <= maxDegree) {
        types.forEach(function (type) {
            graph = groupByDegree(graph, type, degree);
        });
        degree++;
    }
    return graph;
}

function groupByDegree(graph, type, degree) {
    var sameDegree = new Array();
    graph.nodes.forEach(function (node, index) {
        if (node.type == type && node.degree == degree) {
            sameDegree.push(index);
        }
    });
    var grouped = new Array();
    for (var i = 0; i < sameDegree.length; i++) {
        if (grouped.indexOf(sameDegree[i]) == -1) {
            var group = [sameDegree[i]];
            var pattern = getPaths(graph.paths, sameDegree[i]);
            for (var j = i + 1; j < sameDegree.length; j++) {
                var newPattern = getPaths(graph.paths, sameDegree[j]);
                if (testSimilarity(pattern, newPattern)) {
                    grouped.push(sameDegree[j]);//acumula os indices dos nós que já foram agrupados
                    group.push(sameDegree[j]);
                }
            }
            if (group.length > 1) {
                graph = groupNodes(graph, group);//----------------------------------------------------------------------------
                group = [];
            }
        }
    }
    return graph;
}

function getPaths(paths, index) {
    var connections = new Array();
    paths.forEach(function (path) {
        if (path.source == index) {
            connections.push(path.target);
        } else if (path.target == index) {
            connections.push(path.source);
        }
    });
    connections.sort(compare);
    return connections;
}

function compare(a, b) {
    return a - b;
}

// teste de igualdade de arrray automatico no jquery/javascript-----------------
function testSimilarity(pattern, newPattern) {
    var test = true;
    if (pattern.length == newPattern.length) {
        for (var i = 0; i < pattern.length; i++) {
            if (pattern[i] != newPattern[i]) {
                test = false;
            }
        }
    } else {
        test = false;
    }
    return test;
}

//create a new node for a given group of node index
function groupNodes(graph, group) {
    //Save all the json nodes in a the nodeGroup var
    var nodeGroup = new Array();
    group.forEach(function (index) {
        nodeGroup.push(graph.nodes[index]);
    });
    //The group recive new type and name
    var newGroup = JSON.parse('{"name":"","type":"","degree":0, "nodes":[]}');
    newGroup.degree = graph.nodes[group[0]].degree;
    newGroup.nodes = nodeGroup;
    switch (graph.nodes[group[0]].type) {
        case "Activity":
            newGroup.type = "GroupOfActivities";
            newGroup.name = "x " + nodeGroup.length;
            break;
        case "Entity":
            newGroup.type = "GroupOfEntities";
            newGroup.name = "x " + nodeGroup.length;
            break;
        default:
            newGroup.type = "GroupOfAgents";
            newGroup.name = "x " + nodeGroup.length;
            break;
    }
    var groupIndex = graph.nodes.length - 1;
    graph.nodes.push(newGroup);

    //Slice the first node and get its links to the group
    var erase = group[0];
    graph.paths.forEach(function (path, pathIndex) {
        if (path.target > erase) {
            path.target--;
        } else if (path.target == erase) {
            path.target = groupIndex;
        }
        if (path.source > erase) {
            path.source--;
        } else if (path.source == erase) {
            path.source = groupIndex;
        }
    });
    graph.nodes.splice(erase, 1);
    for (var i = 0; i < group.length; i++) {
        if (group[i] > erase) {
            group[i]--;
        } else if (group[i] == erase) {
            group[i] = -1;
        }
    }

    //Slice the other nodes from the group
    for (var i = 1; i < group.length; i++) {
        erase = group[i];
        graph.nodes.splice(erase, 1);

        var newPaths = new Array();

        graph.paths.forEach(function (path) {
            if (path.source != erase && path.target != erase) {
                if (path.source > erase)
                    path.source--;
                if (path.target > erase)
                    path.target--;
                newPaths.push(path);
            }

        });
        graph.paths = newPaths;

        for (var j = 0; j < group.length; j++) {
            if (group[j] > erase) {
                group[j]--;
            } else if (group[j] == erase) {
                group[j] = -1;
            }
        }
    }

    return graph;
}