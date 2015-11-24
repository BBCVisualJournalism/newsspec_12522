module.exports = function (grunt) {

    grunt.registerTask('svgImgs2Png', function () {
        var fs = require('fs');
        var execSync = require('child_process').execSync;
        var basePath = './inputSVGs/';
        // var outPath = './source/img/jsonpimg/';
        var outPath = './source/img/';
        var pkg = grunt.file.readJSON('package.json');
        var config = grunt.config.get('config');
        var done = this.async();

        var pngImageScaleFactor = 3;
        var imgSizeLookup = {};
        var svgFiles = fs.readdirSync(basePath);

        /*
         * loop through all the svgs in the base folder and determine their dimensions
        */
        var a, arrLength = svgFiles.length;
        for (a = 0; a < arrLength; a++) {
            var svgFilePath = svgFiles[a];
            var svgFileStr = fs.readFileSync(basePath+svgFilePath, "utf8");
            if (svgFileStr) {
                var viewBoxIndexOf = svgFileStr.indexOf("viewBox=");
                if (viewBoxIndexOf > -1) {
                    var firstViewBoxQuoteIndex = svgFileStr.indexOf('"', viewBoxIndexOf);
                    var lastViewBoxQuoteIndex = svgFileStr.indexOf('"', firstViewBoxQuoteIndex + 1);
                    var viewBoxValStr = svgFileStr.substring(firstViewBoxQuoteIndex + 1, lastViewBoxQuoteIndex);
                    var viewBoxValArr = viewBoxValStr.split(" ");
                    var viewBoxWidth = viewBoxValArr[2].replace(' ', '');
                    var viewBoxHeight = viewBoxValArr[3].replace(' ', '');

                    imgSizeLookup[svgFilePath] = {
                        width: viewBoxWidth,
                        height: viewBoxHeight,
                        ratio: (viewBoxHeight / viewBoxWidth)
                    };

                    var fileNameWithoutExt = svgFilePath.replace(/\.[^/.]+$/, "");

                    var absoluteBasePath = process.cwd() + basePath.replace('.', '');
                    var absoluteOutPath = process.cwd() + outPath.replace('.', '');

                    console.log('working on: ', svgFilePath);

                    //convert the svg's into png images!
                    var pngWidth = (viewBoxWidth * pngImageScaleFactor);
                    var pngHeight = (viewBoxHeight * pngImageScaleFactor);
                    var svg2PngCmd = '/Applications/Inkscape.app/Contents/Resources/bin/inkscape --export-png ' + absoluteOutPath + fileNameWithoutExt + '.png' + ' -w ' + pngWidth + ' -h ' + pngHeight + ' ' + absoluteBasePath + svgFilePath + ';';
                    execSync(svg2PngCmd);

                    imgSizeLookup[fileNameWithoutExt + '.png'] = {
                        width: pngWidth,
                        height: pngHeight,
                        ratio: (pngHeight / pngWidth)
                    };
                }
            }
        }

        /*
         * loop through all the svgs and  newly created pngs in the base folder and convert them to jsonP assets
        */
        // var svgAndPngFiles = fs.readdirSync(basePath);
        // arrLength = svgAndPngFiles.length;
        // for (a = 0; a < arrLength; a++) {
        //     var imgFilePath = svgAndPngFiles[a];
        //     if (imgSizeLookup[imgFilePath]) {
        //         var fileExtension = imgFilePath.substring(imgFilePath.lastIndexOf('.') + 1, imgFilePath.length);
        //         var imgTypeStr = '';
        //         switch (fileExtension) {
        //             case 'svg' :
        //                 imgTypeStr = 'data:image/svg+xml;base64,';
        //             break;
        //             case 'png' :
        //                 imgTypeStr = 'data:image/png;base64,';
        //             break;
        //         }
        //         var absoluteBasePath = process.cwd() + basePath.replace('.', '');
        //         var base64FileCmd = "echo $(openssl base64 < " + absoluteBasePath + imgFilePath + " | tr -d '\n')";
        //         // var base64FileCmd = "echo $(openssl base64 < " + absoluteBasePath + imgFilePath + ")";

        //         var fileBase64 = imgTypeStr + execSync(base64FileCmd);

        //         var fileJsonPOutputStr = "jsonCallback({" + "'ratio':" + imgSizeLookup[imgFilePath].ratio + ", 'width': " + imgSizeLookup[imgFilePath].width + ", 'height': " + imgSizeLookup[imgFilePath].height + ", 'uri':'" + fileBase64 + "'});";
        //         fileJsonPOutputStr = fileJsonPOutputStr.replace(/\r?\n|\r/g, " ");

        //         var outputFilename = imgFilePath.replace(/\.[^/.]+$/, "") + '_' + fileExtension + '.js'
        //         //write out the countries file
        //         fs.writeFileSync(outPath + outputFilename, fileJsonPOutputStr, {encoding:'utf8'});
        //     }

        // }

        /*
         * remove the pngs you created from the basePath
        */
        // var absoluteBasePath = process.cwd() + basePath.replace('.', '');
        // var removeCreatedPngsCmd = "rm " + absoluteBasePath + "*.png";
        // execSync(removeCreatedPngsCmd);

        done();
        
    });
};