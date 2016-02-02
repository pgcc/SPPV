$(document).ready(function () {
//------------------------------------------------------------------------------
    $("#radioset").buttonset();
    $(".boxGroup").buttonset();
    $("#distanceSlider").slider({
        min: 40,
        max: 200,
        value: 80,
        slide: function (event, ui) {
            $("#distanceValue").html(ui.value);
            d3.layout.force().linkDistance(ui.value);
        }
    });
    $("#distanceValue").html($("#distanceSlider").slider("value"));
    $("#zoomSlider").slider({
        min: 20,
        max: 200,
        value: 100,
        slide: function (event, ui) {
            $("#zoomValue").html(ui.value);
        }
    });
    $("#zoomValue").html($("#zoomSlider").slider("value"));
//------------------------------------------------------------------------------
    $.post("FrontController?action=ReadOWLPath", function (string) {
        $("#owlPath").html(string);
    }, "text");

    $("input[type=checkbox][name=inferredLinks]").change(function () {
        if ($("input[type=checkbox][name=inferredLinks]").prop("checked")) {
            $("path.inferred").fadeIn();
            $("marker.inferred").fadeIn();
        } else {
            $("path.inferred").fadeOut();
            $("marker.inferred").fadeOut();
        }
    });

    $("input[type=checkbox][name=assertedLinks]").change(function () {
        if ($("input[type=checkbox][name=assertedLinks]").prop("checked")) {
            $("path.asserted").fadeIn();
            $("marker.asserted").fadeIn();
        } else {
            $("path.asserted").fadeOut();
            $("marker.asserted").fadeOut();
        }
    });

    $("input[type=checkbox][name=actors]").change(function () {
        if ($("input[type=checkbox][name=actors]").prop("checked")) {
            $("image.Agent").fadeIn();
        } else {
            $("image.Agent").fadeOut();
        }
    });

    $("input[type=checkbox][name=actorsNames]").change(function () {
        if ($("input[type=checkbox][name=actorsNames]").prop("checked")) {
            $("text.AgentName").fadeIn();
        } else {
            $("text.AgentName").fadeOut();
        }
    });

    $("input[type=checkbox][name=tasks]").change(function () {
        if ($("input[type=checkbox][name=tasks]").prop("checked")) {
            $("image.Activity").fadeIn();
        } else {
            $("image.Activity").fadeOut();
        }
    });

    $("input[type=checkbox][name=tasksNames]").change(function () {
        if ($("input[type=checkbox][name=tasksNames]").prop("checked")) {
            $("text.ActivityName").fadeIn();
        } else {
            $("text.ActivityName").fadeOut();
        }
    });

    $("input[type=checkbox][name=entities]").change(function () {
        if ($("input[type=checkbox][name=entities]").prop("checked")) {
            $("image.Entity").fadeIn();
        } else {
            $("image.Entity").fadeOut();
        }
    });

    $("input[type=checkbox][name=entitiesNames]").change(function () {
        if ($("input[type=checkbox][name=entitiesNames]").prop("checked")) {
            $("text.EntityName").fadeIn();
        } else {
            $("text.EntityName").fadeOut();
        }
    });

    $("input[type=radio][name=icon]").change(function () {
        var images = d3.selectAll("image");
        if (this.value === "prov") {
            images.attr("xlink:href", function (node) {
                if (node.type === "Activity") {
                    $("#titleTasks").html("Activities");
                    return "./images/activity.png";
                } else if (node.type === "Person" || node.type === "Agent" || node.type === "Organization" || node.type === "SoftwareAgent") {
                    $("#titleActors").html("Agents");
                    return "./images/agent.png";
                } else {
                    $("#titleEntities").html("Entities");
                    return "./images/entity.png";
                }
            });
        } else if (this.value === "bpmn") {
            images.attr("xlink:href", function (node) {
                if (node.type === "Activity") {
                    $("#titleTasks").html("Task");
                    return "./images/task.png";
                } else if (node.type === "Person" || node.type === "Agent" || node.type === "Organization" || node.type === "SoftwareAgent") {
                    $("#titleActors").html("Actors");
                    return "./images/actor.png";
                } else {
                    $("#titleEntities").html("Data Objects");
                    return "./images/data.png";
                }
            });
        } else {
            $("#titleTasks").html("Tasks/Activities");
            $("#titleActors").html("Actors/Agents");
            $("#titleEntities").html("Data Object/Entities");
            images.attr("xlink:href", "./images/circle.png");
        }
    });
});


