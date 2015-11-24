module.exports = function (grunt) {

    grunt.registerTask('data', function () {
        var fs = require('fs');
        var csv = require("fast-csv");
        var basePath = './inputData/';
        // var outPath = './source/js/model/';
        var outPath = './source/tmpl/';
        var pkg = grunt.file.readJSON('package.json');
        var config = grunt.config.get('config');
        var done = this.async();

        var countriesOutputObj = {};
        var inputFiles = fs.readdirSync(basePath);
        var doesCsvExist = false;

        var totalNumOfCountries = 0;
        var countriesRankOrderArr = [];
        var translationsOutputObj = {};

        //look for the csv file
        var a, filesLength = inputFiles.length;
        for (a = 0;a < filesLength; a++) {
            
            if (inputFiles[a] == "2015_gender_data.csv") {
                doesCsvExist = inputFiles[a];
            }
        }

        if (!doesCsvExist) {
            grunt.log.writeln('I can\'t find the csv file, check to make sure it exists and is named correctly: 2015_gender_data.csv');
            done();
            return;
        }

        //looks like the csv files are all present, lets load them

        //load the 2011 file
        csv.fromPath(basePath + doesCsvExist)
            .on("data", function(data){
                
                sortData(data);                

            })
            .on("end", function(){
                CSVLoaded();
            });

        /*
         * Methods
        */
        sortData = function(data) {
            var numOfEmptyCells = 0;

            var a, rowLength = data.length;
            for (a = 0; a < rowLength; a++) {
                if (!data[a]) {
                    numOfEmptyCells ++;
                }
            }

            //is the row blank? if so ignore it and move on to the next one
            if (numOfEmptyCells == rowLength) {
                return;
            }

            //is the current row the headers row? eg Countries  rank    currency    salary_woman    degree_women    degree men etc...
            if (data[0].toLowerCase() == "Countries") {
                //could set a variable here letting the next itteration know the club info is about to start
                return;
            }

            //we require a rank for each country, if it is missing then move on to the next rown
            if (isNaN(parseInt(data[1]))) {
                return;
            }

            //hopefully now the current row is a country row
            var countryName = data[0];

            totalNumOfCountries ++;

            countriesRankOrderArr.push({
                'rank': Number(data[1]),
                'countryName': '<%= ' + countryName.replace(/ /g,"_") + ' %>'
            });

            countriesOutputObj[countryName] = {};

            countriesOutputObj[countryName].countryName = countryName;
            countriesOutputObj[countryName].countryNameTranslation = '<%= ' + countryName.replace(/ /g,"_") + ' %>';

            countriesOutputObj[countryName].rank = Number(data[1]);
            countriesOutputObj[countryName].currency = data[2];
            countriesOutputObj[countryName].womanSalaryDiff = isNaN(parseFloat(data[3])) ? null : Number(data[3]);
            countriesOutputObj[countryName].womanDegree = data[4];
            countriesOutputObj[countryName].manDegree = data[5];
            countriesOutputObj[countryName].womanLabourForcePercent = isNaN(parseFloat(data[6])) ? null : Number(data[6]);
            countriesOutputObj[countryName].manLabourForcePercent = isNaN(parseFloat(data[7])) ? null : Number(data[7]);
            countriesOutputObj[countryName].womanSeniorOfficialsPercent = isNaN(parseFloat(data[8])) ? null : Number(data[8]);
            countriesOutputObj[countryName].manSeniorOfficialsPercent = isNaN(parseFloat(data[9])) ? null : Number(data[9]);
            countriesOutputObj[countryName].womanMpPercent = isNaN(parseFloat(data[10])) ? null : Number(data[10]);
            countriesOutputObj[countryName].manMpPercent = isNaN(parseFloat(data[11])) ? null : Number(data[11]);
            countriesOutputObj[countryName].womanMinistersPercent = isNaN(parseFloat(data[12])) ? null : Number(data[12]);
            countriesOutputObj[countryName].manMinistersPercent = isNaN(parseFloat(data[13])) ? null : Number(data[13]);

            if (data[0] == 'United Kingdom') {
                countriesOutputObj[countryName].search_alternative = ['UK', 'GB', 'GBR'];
            }
            if (data[0] == 'United States') {
                countriesOutputObj[countryName].search_alternative = ['US', 'USA'];
            }
            if (data[0] == 'United Arab Emirates') {
                countriesOutputObj[countryName].search_alternative = ['UAE'];
            }

            
        };

        CSVLoaded = function() {

            //loop through the country objects and delete any null properties
            for (var countryKey in countriesOutputObj) {
                for (var key in countriesOutputObj[countryKey]) {
                    if (!countriesOutputObj[countryKey][key]) {
                        delete countriesOutputObj[countryKey][key];
                    }
                }
            }

            //write out the countries file
            // var countriesDataOutputStr = 'define(function () {\n\n   return ' + JSON.stringify(countriesOutputObj, null, ' ') + ';\n\n});';
            var countriesDataOutputStr = JSON.stringify(countriesOutputObj, null, ' ');

            // fs.writeFileSync(outPath + "countriesData.js", countriesDataOutputStr, {encoding:'utf8'});
            fs.writeFileSync(outPath + "countriesData.json.tmpl", countriesDataOutputStr, {encoding:'utf8'});

            console.log('I\'ve finished loading the csv and I\'ve sorted through it');
            createTranslationJsonFile();
        };

        createTranslationJsonFile = function () {
            
            countriesRankOrderArr.sort(function (a, b) {
                return a.rank - b.rank;
            });

            translationsOutputObj.countryRankData = {
                totalCountriesNum: totalNumOfCountries,
                countryBands: [
                    {
                        topLevel: 33,
                        bottomLevel: 1,
                        message: '<%= countryRankBandMessage1To28 %>',
                        maleBarHeight: 55,
                        femaleBarHeight: 45
                    },
                    {
                        topLevel: 59,
                        bottomLevel: 34,
                        message: '<%= countryRankBandMessage29To57 %>',
                        maleBarHeight: 60,
                        femaleBarHeight: 40
                    },
                    {
                        topLevel: 92,
                        bottomLevel: 60,
                        message: '<%= countryRankBandMessage58To86 %>',
                        maleBarHeight: 70,
                        femaleBarHeight: 30
                    },
                    {
                        topLevel: 111,
                        bottomLevel: 93,
                        message: '<%= countryRankBandMessage87To115 %>',
                        maleBarHeight: 80,
                        femaleBarHeight: 20
                    },
                    {
                        topLevel: 145,
                        bottomLevel: 112,
                        message: '<%= countryRankBandMessage116To145 %>',
                        maleBarHeight: 90,
                        femaleBarHeight: 10
                    }
                ],
                top10Countries: countriesRankOrderArr.slice(0, 10),
                bottom10Countries: countriesRankOrderArr.slice(countriesRankOrderArr.length - 10, countriesRankOrderArr.length).reverse(),
                shareMessage: '<%= shareTextCountryRank %>'
            };

            translationsOutputObj.earningsData = {
                descrip: '<%= earningsDescrip %>',
                shareMessage: '<%= shareTextEarnings %>'
            };

            translationsOutputObj.graduatesData = {
                valDescripFemale: '<%= graduatesTextWomen %>',
                valDescripMale: '<%= graduatesTextMen %>',
                shareMessageFemale: '<%= shareTextGraduatesWomen %>',
                shareMessageMale: '<%= shareTextGraduatesMen %>'
            };

            translationsOutputObj.employmentData = {
                shareMessageFemale: '<%= shareTextEmploymentWomen %>',
                shareMessageMale: '<%= shareTextEmploymentMen %>'
            };

            translationsOutputObj.officialsData = {
                'female0-10': '<%= seniorOfficialsWomenMessage0to10 %>',
                'female11-15': '<%= seniorOfficialsWomenMessage11to15 %>',
                'female16-24': '<%= seniorOfficialsWomenMessage16to24 %>',
                'female25-34': '<%= seniorOfficialsWomenMessage25to34 %>',
                'female35-44': '<%= seniorOfficialsWomenMessage35to44 %>',
                'female45-50': '<%= seniorOfficialsWomenMessage45to50 %>',
                'female51-100': '<%= seniorOfficialsWomenMessageAbove50 %>',
                'male0-49': '<%= seniorOfficialsMenMessageBelow50 %>',
                'male50-54': '<%= seniorOffiicialsMenMessage50to54 %>',
                'male55-64': '<%= seniorOfficialsMenMessage55to64 %>',
                'male65-74': '<%= seniorOfficialsMenMessage65to74 %>',
                'male75-84': '<%= seniorOfficialsMenMessage75to84 %>',
                'male85-94': '<%= seniorOfficialsMenMessage85to94 %>',
                'male95-100': '<%= seniorOfficialsMenMessageAbove95 %>',
                shareMessageFemale: '<%= shareTextSeniorOfficialsWomen %>',
                shareMessageMale: '<%= shareTextSeniorOfficialsMen %>'
            };

            translationsOutputObj.governmentData = {
                'femaleDescrip': '<%= govMinistersDescripFemale %>',
                'maleDescrip': '<%= govMinistersDescripMale %>',
                shareMessageFemale: '<%= shareTextGovernmentMinistersWomen %>',
                shareMessageMale: '<%= shareTextGovernmentMinistersMen %>'
            };

            translationsOutputObj.globalSummaryData = {
                shareMessage: '<%= shareTextGlobalSummary %>'
            };

            translationsOutputObj.assetsDomain = '<%= pathStatic %>/<%= vocab_dir %>';

            translationsOutputObj.emailSubject = '<%= emailSubject %>';
            translationsOutputObj.twitterHashTag = '<%= twitterHashTag %>';

            translationsOutputObj.twitterPrefixUnited_Arab_Emirates = '<%= twitterCountryNameUnited_Arab_Emirates %>';
            translationsOutputObj.twitterPrefixBahamas = '<%= twitterCountryNameBahamas %>';
            translationsOutputObj.twitterPrefixCzech_Republic = '<%= twitterCountryNameCzech_Republic %>';
            translationsOutputObj.twitterPrefixDominican_Republic = '<%= twitterCountryNameDominican_Republic %>';
            translationsOutputObj.twitterPrefixNetherlands = '<%= twitterCountryNameNetherlands %>';
            translationsOutputObj.twitterPrefixUnited_States = '<%= twitterCountryNameUnited_States %>';
            translationsOutputObj.twitterPrefixUnited_Kingdom = '<%= twitterCountryNameUnited_Kingdom %>';

            var translationsOutputObjStr = JSON.stringify(translationsOutputObj, null, ' ');

            fs.writeFileSync(outPath + "translationsData.json.tmpl", translationsOutputObjStr, {encoding:'utf8'});

            console.log('I\'ve finished creating the dynamic translations json file');
            done();
        }
        
    });
};