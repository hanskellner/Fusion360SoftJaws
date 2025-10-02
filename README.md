# ![SoftJaws](./resources/64x64.png) Fusion360SoftJaws

This script is used for creating a set of "soft jaws" for a hold a part to be machined.

![Image of SoftJaws Dialog](./resources/Fusion360SoftJaws-Dialog.png)

## Installation

Please see the Fusion add-in install instructions here:

https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/How-to-install-an-ADD-IN-and-Script-in-Fusion-360.html

If you are installing manually, then please download the archive file (ZIP) from Github by clicking on the "Clone or download" button and then selecting "Download ZIP".

Once you have the ZIP file, please follow the manual install instructions in the link above.

## Usage

1. Run the "SoftJaws" script from the Script Manager
2. The settings dialog will be shown.  Adjust to your preferences:

  ![Image of SoftJaws Dialog](./resources/Fusion360SoftJaws-Dialog.png)

  - Body : Select the body the soft jaws will hold
  - Vise : Select a specific vise to populate dimensions below
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
2. Open a design containing the part the soft jaws will hold
3. Run the SoftJaws (Javascript) script from the Script Manager.

  ![SoftJaws Script](./resources/Fusion360SoftJaws-Script.png)

4. The settings dialog will be shown.

  ![Image of SoftJaws Dialog](./resources/Fusion360SoftJaws-Dialog.png)

5. TODO
4. Click OK to start the ball rolling

## TODO
- Load the list of vise models and values from an external user editable txt file.
- Integrate "foundary fill" operation once exposed through API.
- Add automatic splitting of soft jaws body after boundary fill operation
- Add mounting holes to the soft jaws

## Issues

- The script uses the Boundary Fill command which is not part of the API. But it can be run as a "command". But this will stop the soft jaws command (script) from running. Therefore the need to manually split the soft jaws after performing the boundary fill.
- Selecting a vise from the list of "Vise" models doesn't always change the other values in the dialog.
