//Author-Hans Kellner
//Description-Generate a set of soft jaws for holding a part

/*!
Copyright (C) 2015 Hans Kellner: https://github.com/hanskellner/Fusion360SoftJaws
MIT License: See https://github.com/hanskellner/Fusion360SoftJaws/LICENSE.md
*/

/*
This is a script for Autodesk Fusion 360 that helps to create "soft jaws" for holding parts.

Installation:

Copy this scripts folder into your Fusion 360 "My Scripts" folder. You may find this folder using the following steps:

1) Start Fusion 360 and then select the File -> Scripts... menu item
2) The Scripts Manager dialog will appear and display the "My Scripts" folder and "Sample Scripts" folders
3) Select one of the "My Scripts" files and then click on the "+" Details icon near the bottom of the dialog.
  a) If there are no files in the "My Scripts" folder then create a default one.
  b) Click the Create button, select JavaScript, and then OK.
5) With the user script selected, click the Full Path "..." button to display a file explorer window that will display the "My Scripts" folder
6) Copy the files into the folder

For example, on a Mac the folder is located in:
/Users/USERNAME/Library/Application Support/Autodesk/Autodesk Fusion 360/API/Scripts

*/

/*globals adsk*/
function run(context) {

    "use strict";

    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }

    // Dimensions are LxWxH (X,Y,Z)
    var VISE_MODEL = {
        GENERIC: 0,
        KURT_6x1x2: 1,
        KURT_6x2x2: 2,
        ORANGE_6x1x2: 3,
        ORANGE_6x2x2: 4,
        LAST: 4
    };

    var appTitle = 'SoftJaws';

    var app = adsk.core.Application.get(), ui;
    if (app) {
        ui = app.userInterface;
        if (!ui) {
            adsk.terminate();
            return;
        }
    }

    var design = adsk.fusion.Design(app.activeProduct);
    if (!design) {
        ui.messageBox('No active design', appTitle);
        adsk.terminate();
        return;
    }

    // Get the root component of the active design.
    var rootComp = design.rootComponent;

    // Create the command definition.
    var createCommandDefinition = function() {
        var commandDefinitions = ui.commandDefinitions;

        // Be fault tolerant in case the command is already added...
        var cmDef = commandDefinitions.itemById('SoftJaws');
        if (!cmDef) {
            cmDef = commandDefinitions.addButtonDefinition('SoftJaws',
                    'SoftJaws',
                    'Generate a set of "soft jaws".',
                    './resources'); // relative resource file path is specified
        }
        return cmDef;
    };


    // CommandCreated event handler.
    var onCommandCreated = function(args) {
        try {
            // Connect to the CommandExecuted event.
            var command = args.command;
            command.execute.add(onCommandExecuted);
            command.inputChanged.add(onInputChanged);

            // Terminate the script when the command is destroyed
            command.destroy.add(function () { adsk.terminate(); });

            // Define the inputs.
            var inputs = command.commandInputs;

            // SelectionCommandInput
            var bodyInput = inputs.addSelectionInput('body', 'Body', 'The solid body the soft jaws will hold');
            bodyInput.addSelectionFilter('SolidBodies');
            bodyInput.setSelectionLimits(1,1);

            var viseInput = inputs.addDropDownCommandInput('vise', 'Vise', adsk.core.DropDownStyles.TextListDropDownStyle );
            viseInput.listItems.add('Generic',true);
            viseInput.listItems.add('Kurt 6x1x2',false);
            viseInput.listItems.add('Kurt 6x2x2',false);
            viseInput.listItems.add('Orange 6x1x2',false);
            viseInput.listItems.add('Orange 6x2x2',false);

            // Dimensions of a jaw
            var initJawsLength = adsk.core.ValueInput.createByString("6 in");
            inputs.addValueInput('length', 'Length', 'in' , initJawsLength);

            var initJawsWidth = adsk.core.ValueInput.createByString("1 in");
            inputs.addValueInput('width', 'Width', 'in' , initJawsWidth);

            var initJawsHeight = adsk.core.ValueInput.createByString("2 in");
            inputs.addValueInput('height', 'Height', 'in' , initJawsHeight);

            var initJawsClampWidth = adsk.core.ValueInput.createByString("0.25 in");
            inputs.addValueInput('clampWidth', 'Clamp Width', 'in' , initJawsClampWidth);

            var initJawsClampHeight = adsk.core.ValueInput.createByString("0.25 in");
            inputs.addValueInput('clampHeight', 'Clamp Height', 'in' , initJawsClampHeight);
        }
        catch (e) {
            ui.messageBox('Failed to create command : ' + (e.description ? e.description : e));
        }
    };

    // InputChanges event handler.
    var onInputChanged = function(args) {
        try
        {
            var command = adsk.core.Command(args.firingEvent.sender);
            var inputs = command.commandInputs;

            var viseInput, lengthJawsInput, widthJawsInput, heightJawsInput;

            for (var n = 0; n < inputs.count; n++) {
                var input = inputs.item(n);
                if (input.id === 'vise') {
                    viseInput = adsk.core.DropDownCommandInput(input);
                }
                else if (input.id === 'length') {
                    lengthJawsInput = adsk.core.ValueCommandInput(input);
                }
                else if (input.id === 'width') {
                    widthJawsInput = adsk.core.ValueCommandInput(input);
                }
                else if (input.id === 'height') {
                    heightJawsInput = adsk.core.ValueCommandInput(input);
                }
            }

            // If vise changed then update the size values
            if (args.input.id == 'vise') {

                // default soft jaw size (inches)
                var l = 6, w = 1, h = 2;

                switch (viseInput.selectedItem.index) {
                    case VISE_MODEL.KURT_6x1x2:
                    l = 6;
                    w = 1;
                    h = 2;
                    break;

                    case VISE_MODEL.KURT_6x2x2:
                    l = 6;
                    w = 2;
                    h = 2;
                    break;

                    case VISE_MODEL.ORANGE_6x1x2:
                    l = 6;
                    w = 1;
                    h = 2;
                    break;

                    case VISE_MODEL.ORANGE_6x2x2:
                    l = 6;
                    w = 2;
                    h = 2;
                    break;

                    case VISE_MODEL.GENERIC:
                    default:
                    break;
                }

                // Convert from IN to CM
                var um = design.unitsManager;
                var lcm = um.convert(l, "in", "cm");
                var wcm = um.convert(w, "in", "cm");
                var hcm = um.convert(h, "in", "cm");

                lengthJawsInput.value = lcm;
                widthJawsInput.value = wcm;
                heightJawsInput.value = hcm;
            }
        }
        catch (e) {
            ui.messageBox('input change failed: ' + (e.description ? e.description : e));
        }
    };

    // CommandExecuted event handler.
    var onCommandExecuted = function(args) {
        try {

            // Extract input values
            var unitsMgr = app.activeProduct.unitsManager;
            var command = adsk.core.Command(args.firingEvent.sender);
            var inputs = command.commandInputs;

            var bodyInput, viseInput, lengthJawsInput, widthJawsInput, heightJawsInput, clampWidthJawsInput, clampHeightJawsInput;

            // REVIEW: Problem with a problem - the inputs are empty at this point. We
            // need access to the inputs within a command during the execute.
            for (var n = 0; n < inputs.count; n++) {
                var input = inputs.item(n);
                if (input.id === 'body') {
                    bodyInput = adsk.core.SelectionCommandInput(input);
                }
                else if (input.id === 'vise') {
                    viseInput = adsk.core.DropDownCommandInput(input);
                }
                else if (input.id === 'length') {
                    lengthJawsInput = adsk.core.ValueCommandInput(input);
                }
                else if (input.id === 'width') {
                    widthJawsInput = adsk.core.ValueCommandInput(input);
                }
                else if (input.id === 'height') {
                    heightJawsInput = adsk.core.ValueCommandInput(input);
                }
                else if (input.id === 'clampWidth') {
                    clampWidthJawsInput = adsk.core.ValueCommandInput(input);
                }
                else if (input.id === 'clampHeight') {
                    clampHeightJawsInput = adsk.core.ValueCommandInput(input);
                }
            }

            if (!bodyInput || !viseInput || !lengthJawsInput || !widthJawsInput || !heightJawsInput || !clampWidthJawsInput || !clampHeightJawsInput) {
                ui.messageBox("One of the inputs does not exist.");
                return;
            }

            // Need to know up direction.  If Y up then will need
            // to adjust orientations.
            // REVIEW : This is only the default setting.  Need a way to
            //          determine design's orientation!
            var isYUp = (app.preferences.generalPreferences.defaultModelingOrientation === adsk.core.DefaultModelingOrientations.YUpModelingOrientation);

            // Get the selected body
            var body = bodyInput.selection(0).entity;
            var bboxBody = body.boundingBox;
            var xMin = bboxBody.minPoint.x, xMax = bboxBody.maxPoint.x;
            var yMin = bboxBody.minPoint.y, yMax = bboxBody.maxPoint.y;
            var zMin = bboxBody.minPoint.z, zMax = bboxBody.maxPoint.z;

            var bboxLength = xMax - xMin;
            var bboxWidth  = isYUp ? zMax - zMin : yMax - yMin;
            var bboxHeight = isYUp ? yMax - yMin : zMax - zMin;

            var vise = viseInput.selectedItem.index;
            if (vise < 0 || vise > VISE_MODEL.LAST) {
                ui.messageBox("Invalid vise");
                return false;
            }

            // Dimensions of jaws
            var lengthJaws = unitsMgr.evaluateExpression(lengthJawsInput.expression);
            if (lengthJaws <= 0.0) {
                ui.messageBox("Invalid length: must be > 0");
                return;
            }

            var widthJaws = unitsMgr.evaluateExpression(widthJawsInput.expression);
            if (widthJaws <= 0.0 || (widthJaws * 2.0 >= bboxWidth)) {
                ui.messageBox("Invalid width: must be > 0 and < body width");
                return;
            }

            var clampWidthJaws = unitsMgr.evaluateExpression(clampWidthJawsInput.expression);
            if (clampWidthJaws <= 0.0 || clampWidthJaws >= widthJaws) {
                ui.messageBox("Invalid clamp width: must be > 0 and < width of jaws");
                return;
            }

            var heightJaws = unitsMgr.evaluateExpression(heightJawsInput.expression);
            if (heightJaws <= 0.0) {
                ui.messageBox("Invalid height: must be > 0");
                return;
            }

            var clampHeightJaws = unitsMgr.evaluateExpression(clampHeightJawsInput.expression);
            if (clampHeightJaws <= 0.0 || clampHeightJaws >= heightJaws) {
                ui.messageBox("Invalid clamp height: must be > 0 and < height of jaws");
                return;
            }

            //
            var widthJawsMinusClamp = widthJaws - clampWidthJaws;
            var heightJawsMinusClamp = heightJaws - clampHeightJaws;

            // Generate the construction planes needed by the "boundary fill" operation
            var cpi = rootComp.constructionPlanes.createInput();

            // Bottom plane
            var bottomOffset = (isYUp ? yMin : zMin) - heightJawsMinusClamp;
            if (!cpi.setByOffset(isYUp ? rootComp.xZConstructionPlane : rootComp.xYConstructionPlane, adsk.core.ValueInput.createByString(""+bottomOffset+"cm") )) {
                ui.messageBox("Failed to create bottom construction plane input");
                return;
            }

            var bottomPlane = rootComp.constructionPlanes.add(cpi);
            if (!bottomPlane) {
                ui.messageBox("Failed to create bottom construction plane");
                return;
            }
            bottomPlane.name = "SoftJaws Bottom";

            // Top plane
            var topOffset = (isYUp ? yMin : zMin) + clampHeightJaws;
            if (!cpi.setByOffset(isYUp ? rootComp.xZConstructionPlane : rootComp.xYConstructionPlane, adsk.core.ValueInput.createByString(""+topOffset+"cm") )) {
                ui.messageBox("Failed to create top construction plane input");
                return;
            }

            var topPlane = rootComp.constructionPlanes.add(cpi);
            if (!topPlane) {
                ui.messageBox("Failed to create top construction plane");
                return;
            }
            topPlane.name = "SoftJaws Top";

            // Back plane
            var backOffset = isYUp ? zMin - widthJawsMinusClamp : yMax + widthJawsMinusClamp;
            if (!cpi.setByOffset(isYUp ? rootComp.xYConstructionPlane : rootComp.xZConstructionPlane, adsk.core.ValueInput.createByString(""+backOffset+"cm") )) {
                ui.messageBox("Failed to create back construction plane input");
                return;
            }

            var backPlane = rootComp.constructionPlanes.add(cpi);
            if (!backPlane) {
                ui.messageBox("Failed to create back construction plane");
                return;
            }
            backPlane.name = "SoftJaws Back";

            // Front plane
            var frontOffset = isYUp ? zMax + widthJawsMinusClamp : yMin - widthJawsMinusClamp;
            if (!cpi.setByOffset(isYUp ? rootComp.xYConstructionPlane : rootComp.xZConstructionPlane, adsk.core.ValueInput.createByString(""+frontOffset+"cm") )) {
                ui.messageBox("Failed to create front construction plane input");
                return;
            }

            var frontPlane = rootComp.constructionPlanes.add(cpi);
            if (!frontPlane) {
                ui.messageBox("Failed to create front construction plane");
                return;
            }
            frontPlane.name = "SoftJaws Front";

            // Left plane
            if (!cpi.setByOffset(rootComp.yZConstructionPlane, adsk.core.ValueInput.createByString(""+(xMin + (bboxLength - lengthJaws)/2.0)+"cm") )) {
                ui.messageBox("Failed to create left construction plane input");
                return;
            }

            var leftPlane = rootComp.constructionPlanes.add(cpi);
            if (!leftPlane) {
                ui.messageBox("Failed to create left construction plane");
                return;
            }
            leftPlane.name = "SoftJaws Left";

            // Right plane
            if (!cpi.setByOffset(rootComp.yZConstructionPlane, adsk.core.ValueInput.createByString(""+(xMax - (bboxLength - lengthJaws)/2.0)+"cm") )) {
                ui.messageBox("Failed to create right construction plane input");
                return;
            }

            var rightPlane = rootComp.constructionPlanes.add(cpi);
            if (!rightPlane) {
                ui.messageBox("Failed to create right construction plane");
                return;
            }
            rightPlane.name = "SoftJaws Right";

            // Preselect the construction planes
            var sel = ui.activeSelections;
            sel.clear();
            sel.add(bottomPlane);
            sel.add(topPlane);
            sel.add(backPlane);
            sel.add(frontPlane);
            sel.add(leftPlane);
            sel.add(rightPlane);

            // Start the boundary fill "SurfaceSculpt" command.
            var bfillCmd = ui.commandDefinitions.itemById('SurfaceSculpt');
            if (!bfillCmd) {
                ui.messageBox("Failed to find boundary fill command.");
                return;
            }
            bfillCmd.execute();

            // NOTE NOTE NOTE - The call above to execute the command will cause
            // the SoftJaws command to be ended.  There's no way at that point to
            // continue the script.  Good news: The boundary fill will be added
            // to the API and that will allow automation.  BUT, until then, this
            // script will be hobbled.
        }
        catch (e) {
            ui.messageBox('Failed to execute command : ' + (e.description ? e.description : e));
        }
    };

    // Create and run command
    try {
        var command = createCommandDefinition();
        var commandCreatedEvent = command.commandCreated;
        commandCreatedEvent.add(onCommandCreated);

        command.execute();
    }
    catch (e) {
        ui.messageBox('Script Failed : ' + (e.description ? e.description : e));
        adsk.terminate();
    }

}
