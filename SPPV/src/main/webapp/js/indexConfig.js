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
    $("#visOptions").buttonset();
    //---------- Loading the Path
    $.post("FrontController?action=ReadOWLPath", function (string) {
        $("#owlPath").html(string);
    }, "text");
    //---------- Function of Visualization Option
    $("input[type=radio][name=visOptions]").change(function () {
        if (this.value === "flowLayout") {
            //$("#RadioChartVis").children().hide();
            $("#chartVis").hide();
            $("#graphVis").hide();
            $("#flowVis").show();
        } else if (this.value === "chartsLayout") {
            $("#flowVis").hide();
            $("#graphVis").hide();
            $("#chartVis").show();
        } else if (this.value === "graphLayout") {
            $("#flowVis").hide();
            $("#chartVis").hide();
            $(window).resize();
            $("#graphVis").show();
        }
    });
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
    $("#allNames").change(function () {
        if ($("#allNames").prop("checked")) {
            $("#agentName").prop("checked", true);
            $("#agentName+label").addClass("ui-state-active");
            $("#activityName").prop("checked", true);
            $("#activityName+label").addClass("ui-state-active");
            $("#entityName").prop("checked", true);
            $("#entityName+label").addClass("ui-state-active");
            $("text").fadeIn();
        } else {
            $("#agentName").prop("checked", false);
            $("#agentName+label").removeClass("ui-state-active");
            $("#activityName").prop("checked", false);
            $("#activityName+label").removeClass("ui-state-active");
            $("#entityName").prop("checked", false);
            $("#entityName+label").removeClass("ui-state-active");
            $("text").fadeOut();
        }
    });

    $("#agentName").change(function () {
        if ($("#agentName").prop("checked")) {
            $("text.PersonName").fadeIn();
        } else {
            $("text.PersonName").fadeOut();
        }
    });

    $("#activityName").change(function () {
        if ($("#activityName").prop("checked")) {
            $("text.ActivityName").fadeIn();
        } else {
            $("text.ActivityName").fadeOut();
        }
    });

    $("#entityName").change(function () {
        if ($("#entityName").prop("checked")) {
            $("text.EntityName").fadeIn();
        } else {
            $("text.EntityName").fadeOut();
        }
    });

    $("#allIcons").change(function () {
        if ($("#allIcons").prop("checked")) {
            $("#agentIcon").prop("checked", true);
            $("#agentIcon+label").addClass("ui-state-active");
            $("#activityIcon").prop("checked", true);
            $("#activityIcon+label").addClass("ui-state-active");
            $("#entityIcon").prop("checked", true);
            $("#entityIcon+label").addClass("ui-state-active");
            $("text").fadeIn();
        } else {
            $("#agentIcon").prop("checked", false);
            $("#agentIcon+label").removeClass("ui-state-active");
            $("#activityIcon").prop("checked", false);
            $("#activityIcon+label").removeClass("ui-state-active");
            $("#entityIcon").prop("checked", false);
            $("#entityIcon+label").removeClass("ui-state-active");
            $("text").fadeOut();
        }
    });

    $("#agentIcon").change(function () {
        if ($("#agentIcon").prop("checked")) {
            $("text.PersonIcon").fadeIn();
        } else {
            $("text.PersonIcon").fadeOut();
        }
    });

    $("#activityIcon").change(function () {
        if ($("#activityIcon").prop("checked")) {
            $("text.ActivityIcon").fadeIn();
        } else {
            $("text.ActivityIcon").fadeOut();
        }
    });

    $("#entityIcon").change(function () {
        if ($("#entityIcon").prop("checked")) {
            $("text.EntityIcon").fadeIn();
        } else {
            $("text.EntityIcon").fadeOut();
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