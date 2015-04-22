# ![SoftJaws](./resources/64x64.png) Fusion360SoftJaws

This script is used for creating a set of "soft jaws" for a hold a part to be machined.

![Image of SoftJaws Dialog]
(./resources/SoftJaws-Dialog.png)

## Installation

Copy the script folder into your Fusion 360 "My Scripts" folder. You may find this folder using the following steps:

1. Start Fusion 360 and then select the File -> Scripts... menu item
2. The Scripts Manager dialog will appear and display the "My Scripts" folder and "Sample Scripts" folders
3. Select one of the "My Scripts" files and then click on the "+" Details icon near the bottom of the dialog.
  - If there are no files in the "My Scripts" folder then create a default one.
  - Click the Create button, select JavaScript, and then OK.
4. With the user script selected, click the Full Path "..." button to display a file explorer window that will display the "My Scripts" folder
5. Copy the folder into this location
  - For example, on my Mac the folder is located in:
    /Users/USERNAME/Library/Application Support/Autodesk/Autodesk Fusion 360/API/Scripts
6. Now click the “+” next to "My Scripts” and in the file dialog, select the SoftJaws.js file.

The script should now be installed and ready to run.  

## Usage

1. Run the "SoftJaws" script from the Script Manager
2. The settings dialog will be shown.  Adjust to your preferences:

  ![Image of SoftJaws Dialog](./resources/SoftJaws-Dialog.png)

  - Body : Select the body the soft jaws will hold
  - Length : Length (x) of soft jaws
  - Width : Width (y) of soft jaws
  - Height : Height (z) of soft jaws
  - Clamp Width : Width of shelf to hold body
  - Clamp Height : Height of shelf to hold body
3. Click OK to begin

Note, after the script has run the design changes may be undone using Edit -> Undo.

### Example Usage

Here is an example of using the script to create a set of soft jaws for a design.

1. Start Fusion 360
2. In a new document, run the SoftJaws (Javascript) script.

  ![SoftJaws Script](./resources/SoftJaws-Step-1.png)

10. Click OK to start the ball rolling

## Issues

- The script uses the Boundary Fill command which is not part of the API. But it can be run as a "command". But this will stop the soft jaws command (script) from running. Therefore the need to manually split the soft jaws after performing the boundary fill.
-
