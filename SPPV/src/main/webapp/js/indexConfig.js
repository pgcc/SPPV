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

$(document).ready(function () {

    //---------- Creating the jQuery-UI widgets
    $("#radioset").buttonset();
    $("button").button();
    $("#nodeA").combobox();
    $("#nodeB").combobox();
    $("#allFilter").buttonset();
    $("#agentFilter").buttonset();
    $("#activityFilter").buttonset();
    $("#entityFilter").buttonset();
    //---------- Loading the Path
    $.post("FrontController?action=ReadOWLPath", function (string) {
        $("#owlPath").html(string);
    }, "text");
    //---------- Function of Display Options widget
    $("input[type=radio][name=icon]").change(function () {
        var images = d3.selectAll("image");
        if (this.value === "prov") {
            images.attr("xlink:href", function (node) {
                if (node.type === "Activity") {
                    $("#taskNameLabel").html("Activities");
                    $("#taskImage").attr("src", "images/activity3.png");
                    return "./images/activity" + calcBrightness(node.index);
                } else if (node.type === "Person" || node.type === "Agent" || node.type === "Organization" || node.type === "SoftwareAgent") {
                    $("#actorNameLabel").html("Agents");
                    $("#actorImage").attr("src", "images/agent3.png");
                    return "./images/agent" + calcBrightness(node.index);
                } else {
                    $("#entityNameLabel").html("Entities");
                    $("#entityImage").attr("src", "images/entity3.png");
                    $("#entityImage").attr("width", "24px");
                    $("#entityImage").attr("height", "");
                    return "./images/entity" + calcBrightness(node.index);
                }
            });
        } else if (this.value === "bpmn") {
            images.attr("xlink:href", function (node) {
                if (node.type === "Activity") {
                    $("#taskNameLabel").html("Task");
                    $("#taskImage").attr("src", "images/task3.png");
                    return "./images/task" + calcBrightness(node.index);
                } else if (node.type === "Person" || node.type === "Agent" || node.type === "Organization" || node.type === "SoftwareAgent") {
                    $("#actorNameLabel").html("Actors");
                    $("#actorImage").attr("src", "images/actor3.png");
                    return "./images/actor" + calcBrightness(node.index);
                } else {
                    $("#entityNameLabel").html("Data Objects");
                    $("#entityImage").attr("src", "images/data3.png");
                    $("#entityImage").attr("height", "24px");
                    $("#entityImage").attr("width", "");
                    return "./images/data" + calcBrightness(node.index);
                }
            });
        }
    });
    //---------- Function of Filter Options widget
    $("input[type=checkbox][id=allNames]").change(function () {
        if ($("input[type=checkbox][id=allNames]").prop("checked")) {
            $("input[type=checkbox][id=agentName]").prop("checked", true);
            $("input[type=checkbox][id=activityName]").prop("checked", true);
            $("input[type=checkbox][id=entityName]").prop("checked", true);
            $("text").fadeIn();
        } else {
            $("input[type=checkbox][id=agentName]").prop("checked", false);
            $("input[type=checkbox][id=activityName]").prop("checked", false);
            $("input[type=checkbox][id=entityName]").prop("checked", false);
            $("text").fadeOut();
        }
    });

    $("input[type=checkbox][id=agentName]").change(function () {
        if ($("input[type=checkbox][id=agentName]").prop("checked")) {
            $("text.PersonName").fadeIn();
        } else {
            $("text.PersonName").fadeOut();
        }
    });

    $("input[type=checkbox][id=activityName]").change(function () {
        if ($("input[type=checkbox][id=activityName]").prop("checked")) {
            $("text.ActivityName").fadeIn();
        } else {
            $("text.ActivityName").fadeOut();
        }
    });

    $("input[type=checkbox][id=entityName]").change(function () {
        if ($("input[type=checkbox][id=entityName]").prop("checked")) {
            $("text.EntityName").fadeIn();
        } else {
            $("text.EntityName").fadeOut();
        }
    });
    //---------- Function of Filter Nodes widget
    $("#filterNodes")
            .click(function (event) {
                event.preventDefault();
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
                $("#hideFilterNodeActive").val("true");
            });

    $("#showAll")
            .click(function (event) {
                event.preventDefault();
                setOpacity(1.0);
                $("#hideFilterNodeActive").val("false");
                $("span input").val("");
            });

    function setOpacity(value) {
        d3.selectAll("image").style("opacity", value);
        d3.selectAll(".path").style("opacity", value);
        d3.selectAll("text").style("opacity", value);
    }
});