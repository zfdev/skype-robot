var Jimp = require('jimp');

var findImagePos = function(findImageUrl, targetImageUrl, callback) {
    var targetImageHeight,
        targetImageWidth,
        targetImageBasePixColor,
        targetImageBasePixColorArr,
        findPosX,
        findPosY,
        resultPos,
        targetImageHash,
        findImageWidth,
        findImageHeight;

    var start = new Date();

    var generateBasePixArr = function(posX, posY, targetImage, targetImageWidth, targetImageHeight) {
        var tempPosXWidth = posX + (targetImageWidth - 1);
        var tempPosYHeight = posY + (targetImageHeight - 1);
        return [targetImage.getPixelColor(posX, posY), targetImage.getPixelColor(tempPosXWidth, posY), targetImage.getPixelColor(tempPosXWidth, tempPosYHeight), targetImage.getPixelColor(posX, tempPosYHeight)];
    }

    Jimp.read(findImageUrl)
        .then((image) => {
            findImageWidth = image.getWidth();
            findImageHeight = image.getHeight();

            Jimp.read(targetImageUrl).then((targetImage) => {
                targetImageHash = targetImage.hash();
                targetImageWidth = targetImage.getWidth();
                targetImageHeight = targetImage.getHeight();
                targetImageBasePixColor = targetImage.getPixelColor(0, 0);
                targetImageBasePixColorArr = generateBasePixArr(0, 0, targetImage, targetImageWidth, targetImageHeight);
                //console.log(targetImageBasePixColorArr);
                //image.crop(6, 6, 4, 4).write('./screenshot/test/test.png');
                for (var posX = 0; posX <= findImageWidth - targetImageWidth; posX++) {
                    for (var posY = 0; posY <= findImageHeight - targetImageHeight; posY++) {
                        if (targetImageBasePixColor == image.getPixelColor(posX, posY)) {
                            var findImagePixColor = generateBasePixArr(posX, posY, image, targetImageWidth, targetImageHeight);
                            //console.log(findImagePixColor);
                            if (findImagePixColor.toString() == targetImageBasePixColorArr.toString()) {
                                // console.log('posX:' + posX + " posY:" + posY);
                                var tempImageCrop = image.clone().crop(posX, posY, targetImageWidth, targetImageHeight);
                                if (!Jimp.distance(targetImage, tempImageCrop)) {
                                    console.log('posX:' + posX + " posY:" + posY);
                                    resultPos = {
                                        posX: posX,
                                        posY: posY
                                    }
                                    callback && callback(resultPos);
                                    var end = new Date() - start;
                                    console.info('Execution time: %dms', end);
                                    return;
                                }
                            }
                        }
                    }
                }
                var end = new Date() - start;
                console.info('Execution time: %dms', end);
            });

        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = findImagePos;