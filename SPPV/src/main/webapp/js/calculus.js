function calculus(graph) {

    var maxDegree = calcDegree(graph);
    calcAmount(graph);
    
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

    //calcMetrics(graph);
    
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

function calcMetrics(graph){
    graph.nodes.forEach(function (node, index) {
        var influencyGraph = getInfluencyGraph(graph, node, index);
        insertMetrics(node, influencyGraph);
    });
}

function getInfluencyGraph(graph, node, index){
    var newGraph = JSON.parse('{"nodes":[], "paths":[]}');
    newGraph.nodes[index] = node;
    //verificando conexões do novo no
    graph.paths.forEach(function (path, pathIndex){
        if(path.source == index){
            path.links.forEach(function(link){
                if(link.sense){
                    
                }
            });
        }else if(path.target == index){ 
        }
    });
    
    
    
    //insertNode(index, node, newGraph, graph);

    return influencyGraph;
}

function verifyNode(index, node, newGraph, graph){
    newGraph.node[index] = node;
    graph.paths.forEach(function (path){
        if(path.source == index){
            path.links.forEach(function(link){
                //if
            });
        }else if(path.target == index){
            
        }
    });
    
}

function insertMetrics(node, graph){

}

/*
 * //verificando conexões do novo no
    graph.paths.forEach(function (path, pathIndex){
        if(path.source == index){
            path.links.forEach(function(link){
                if(link.sense){
                    if(!newGraph.paths[pathIndex] == null){
                        newGraph.paths[pathIndex] = path;
                        newGraph.paths[pathIndex].links = [];
                    }
                    newGraph.paths[pathIndex].links.push(link);
                }
            });
        }else if(path.target == index){ 
        }
    });
 */