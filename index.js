// Move the mouse across the screen as a sine wave.
var robot = require("robotjs");
var Jimp = require('jimp');
var screenshot = require('screenshot-desktop');
var findImagePos = require('./util/findImage');
var schedule = require('node-schedule');
var config = require('./data/config.json');
var task = require('./data/task.json');
var schedule = require('node-schedule');

// Speed up the mouse.
robot.setMouseDelay(500);

var doAction = function(actionName) {
    var screenSize = robot.getScreenSize();
    var screenHeight = screenSize.height;
    var screenWidth = screenSize.width;
    var moveRatio = 0.8;
    console.log('Screen Width:' + screenWidth);
    console.log('Screen Height:' + screenHeight);
    //real screen width：819
    //screenshot width: 1024
    //ratio: 819/1024 = 0.7998 = 0.8
    screenshot({
        filename: config.fullScreenshotUrl
    }).then((imgPath) => {
        console.log(imgPath);
        Jimp.read(config.fullScreenshotUrl).then(image => {
            moveRatio = screenWidth / image.getWidth();
            findImagePos(config.fullScreenshotUrl, config.targetUrl, function(skypeBasePosition) {
                //Move the mouse to the position.
                var statusPosition = {
                    x: skypeBasePosition.posX + config.statusPositionOffset.x,
                    y: skypeBasePosition.posY + config.statusPositionOffset.y
                }
                var statusAvailablePosition = {
                    x: statusPosition.x + config.statusAvailablePositionOffset.x,
                    y: statusPosition.y + config.statusAvailablePositionOffset.y
                }

                var statusAwayPosition = {
                    x: statusPosition.x + config.statusAwayPositionOffset.x,
                    y: statusPosition.y + config.statusAwayPositionOffset.y
                }

                //Get skype window focus
                robot.moveMouse(skypeBasePosition.posX * moveRatio, skypeBasePosition.posY * moveRatio);
                robot.mouseClick();
                screenshot({
                    filename: 'screenshot/window-active.png'
                });
                switch (actionName) {
                    case 'online':

                        //Move to the status list menu
                        robot.moveMouse(statusPosition.x * moveRatio, statusPosition.y * moveRatio);
                        robot.mouseClick();
                        screenshot({
                            filename: 'screenshot/status-menu.png'
                        });
                        //Change the status to available
                        robot.moveMouse(statusAvailablePosition.x * moveRatio, statusAvailablePosition.y * moveRatio);
                        robot.mouseClick();
                        screenshot({
                            filename: 'screenshot/status-online.png'
                        });
                        break;

                    case 'away':
                        //Move to the status list menu
                        robot.moveMouse(statusPosition.x * moveRatio, statusPosition.y * moveRatio);
                        robot.mouseClick();

                        //Change the status to away
                        robot.moveMouse(statusAwayPosition.x * moveRatio, statusAwayPosition.y * moveRatio);
                        robot.mouseClick();
                        break;
                }

                //Lose the skype window focus
                robot.moveMouse(0, 0);
                robot.mouseClick();

            });
        });
    });


}

for (var i = 0; i < task.length; i++) {
    var taskItem = task[i];
    taskItem.schedule = (function(taskItem) {
        return schedule.scheduleJob(taskItem.time, function() {
            doAction(taskItem.action);
            console.log('The task ' + taskItem.taskName + 'is done!');
        });
    })(taskItem);
}