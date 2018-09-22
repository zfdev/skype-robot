// Move the mouse across the screen as a sine wave.
var robot = require("robotjs");
var Jimp = require('jimp');
var screenshot = require('screenshot-desktop');
var findImagePos = require('./util/findImage');

// Speed up the mouse.
robot.setMouseDelay(500);

var screenSize = robot.getScreenSize();
var screenHeight = screenSize.height;
var screenWidth = screenSize.width;

//
screenshot({ filename: 'screenshot/fullScreenshot.png' });

//
findImagePos('./screenshot/fullScreenshot.png', './screenshot/target.png', function(skypeBasePosition) {
    //Move the mouse to the position.
    var statusPosition = {
        x: skypeBasePosition.posX + 88,
        y: skypeBasePosition.posY + 85
    }
    var statusAvailablePosition = {
        x: statusPosition.x,
        y: statusPosition.y + 20
    }

    var statusAwayPosition = {
        x: statusPosition.x,
        y: statusPosition.y + 150
    }

    //Get skype window focus
    robot.moveMouse(skypeBasePosition.posX, skypeBasePosition.posY);
    robot.mouseClick();
    //Move to the status list menu
    robot.moveMouse(statusPosition.x, statusPosition.y);
    robot.mouseClick();
    //Change the status to available
    robot.moveMouse(statusAvailablePosition.x, statusAvailablePosition.y);
    robot.mouseClick();
    //Move to the status list menu
    robot.moveMouse(statusPosition.x, statusPosition.y);
    robot.mouseClick();
    //Change the status to away
    robot.moveMouse(statusAwayPosition.x, statusAwayPosition.y);
    robot.mouseClick();

});