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
    //---------- Configuring the functions of each widget
    $.post("FrontController?action=ReadOWLPath", function (string) {
        $("#owlPath").html(string);
    }, "text");

    $("input[type=radio][name=icon]").change(function () {
        var images = d3.selectAll("image");
        if (this.value === "prov") {
            images.attr("xlink:href", function (node) {
                if (node.type === "Activity") {
                    $("#taskNameLabel").html("Activities");
                    return "./images/activity" + calcBrightness(node.index);
                } else if (node.type === "Person" || node.type === "Agent" || node.type === "Organization" || node.type === "SoftwareAgent") {
                    $("#actorNameLabel").html("Agents");
                    return "./images/agent" + calcBrightness(node.index);
                } else {
                    $("#entityNameLabel").html("Entities");
                    return "./images/entity" + calcBrightness(node.index);
                }
            });
        } else if (this.value === "bpmn") {
            images.attr("xlink:href", function (node) {
                if (node.type === "Activity") {
                    $("#taskNameLabel").html("Task");
                    return "./images/task" + calcBrightness(node.index);
                } else if (node.type === "Person" || node.type === "Agent" || node.type === "Organization" || node.type === "SoftwareAgent") {
                    $("#actorNameLabel").html("Actors");
                    return "./images/actor" + calcBrightness(node.index);
                } else {
                    $("#entityNameLabel").html("Data Objects");
                    return "./images/data" + calcBrightness(node.index);
                }
            });
        } else {
            $("#taskNameLabel").html("Tasks/Activities");
            $("#actorNameLabel").html("Actors/Agents");
            $("#entityNameLabel").html("Data Object/Entities");
            images.attr("xlink:href", function (node) {
                return "./images/circle" + calcBrightness(node.index);
            });
        }
    });

    $("input[type=checkbox][name=allNames]").change(function () {
        if ($("input[type=checkbox][name=allNames]").prop("checked")) {
            $("#filterTable input[type=checkbox]").prop("checked", true);
            $("text").fadeIn();
        } else {
            $("#filterTable input[type=checkbox]").prop("checked", false);
            $("text").fadeOut();
        }
    });

    $("input[type=checkbox][name=actorName]").change(function () {
        if ($("input[type=checkbox][name=actorName]").prop("checked")) {
            $("text.PersonName").fadeIn();
        } else {
            $("text.PersonName").fadeOut();
        }
    });

    $("input[type=checkbox][name=taskName]").change(function () {
        if ($("input[type=checkbox][name=taskName]").prop("checked")) {
            $("text.ActivityName").fadeIn();
        } else {
            $("text.ActivityName").fadeOut();
        }
    });

    $("input[type=checkbox][name=entityName]").change(function () {
        if ($("input[type=checkbox][name=entityName]").prop("checked")) {
            $("text.EntityName").fadeIn();
        } else {
            $("text.EntityName").fadeOut();
        }
    });

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