define(['lib/news_special/bootstrap'], function (news) {

    /* Vars */
    var translationsData;
    var femalePercentRanges = [];

    var init = function (translationsDataParam) {

        /*
         * Event Listeners
        */
        news.pubsub.on('user-submitted-country', createOfficialsResultsModel);

        /*
         * Set Variables
        */
        translationsData = translationsDataParam;

        femalePercentRanges.push({ bottom:0, top:10, femaleString:translationsData.officialsData['female0-10'], maleString:translationsData.officialsData['male95-100'] });
        femalePercentRanges.push({ bottom:11, top:15, femaleString:translationsData.officialsData['female11-15'], maleString:translationsData.officialsData['male85-94'] });
        femalePercentRanges.push({ bottom:16, top:24, femaleString:translationsData.officialsData['female16-24'], maleString:translationsData.officialsData['male75-84'] });
        femalePercentRanges.push({ bottom:25, top:34, femaleString:translationsData.officialsData['female25-34'], maleString:translationsData.officialsData['male65-74'] });
        femalePercentRanges.push({ bottom:35, top:44, femaleString:translationsData.officialsData['female35-44'], maleString:translationsData.officialsData['male55-64'] });
        femalePercentRanges.push({ bottom:45, top:50, femaleString:translationsData.officialsData['female45-50'], maleString:translationsData.officialsData['male50-54'] });
        femalePercentRanges.push({ bottom:51, top:100, femaleString:translationsData.officialsData['female51-100'], maleString:translationsData.officialsData['male0-49'] });


    };

    var createOfficialsResultsModel = function (countryData, gender) {

        /*
         * Officials
         
         * what we need:

         * femalePercent: Number
         * malePercent: Number
         
         * topDescrip: String
         
         * femaleImageName: String
         * maleImageName: String
        */

        var officialsModel = {};

        officialsModel.femalePercent = Math.round(countryData.womanSeniorOfficialsPercent);
        officialsModel.malePercent = Math.round(countryData.manSeniorOfficialsPercent);

        //set the officialsModel.topDescrip if the gender selected is female
        var a, arrLength = femalePercentRanges.length;
        if (gender == 'female') {
            for (a = 0; a < arrLength; a++) {
                if (officialsModel.femalePercent >= femalePercentRanges[a].bottom && officialsModel.femalePercent <= femalePercentRanges[a].top) {
                    officialsModel.topDescrip = femalePercentRanges[a].femaleString;
                    break;
                }
            }
        }

        //set the officialsModel.topDescrip if the gender selected is male
        if (gender == 'male') {
            for (a = 0; a < arrLength; a++) {
                if (officialsModel.femalePercent >= femalePercentRanges[a].bottom && officialsModel.femalePercent <= femalePercentRanges[a].top) {
                    officialsModel.topDescrip = femalePercentRanges[a].maleString;
                    break;
                }
            }
        }

        //set the officialsModel.femaleImageName and officialsModel.maleImageName
        arrLength = femalePercentRanges.length;
        for (a = 0; a < arrLength; a++) {
            if (officialsModel.femalePercent >= femalePercentRanges[a].bottom && officialsModel.femalePercent <= femalePercentRanges[a].top) {
                officialsModel.femaleImageName = 'groupf' + femalePercentRanges[a].bottom + 'to' + femalePercentRanges[a].top;
                officialsModel.maleImageName = 'groupm' + femalePercentRanges[a].bottom + 'to' + femalePercentRanges[a].top;
                break;
            }
        }

        officialsModel.shareMessage = (gender == 'female') ? translationsData.officialsData.shareMessageFemale : translationsData.officialsData.shareMessageMale;
        officialsModel.shareMessage = officialsModel.shareMessage.replace('{{seniorOfficialsPercentageWomen}}', (officialsModel.femalePercent + '%'));
        officialsModel.shareMessage = officialsModel.shareMessage.replace('{{seniorOfficialsPercentageMen}}', (officialsModel.malePercent + '%'));
        
        var twitterCountryName = translationsData['twitterPrefix' + countryData.countryName.replace(/ /g,'_')];

        officialsModel.shareMessage = officialsModel.shareMessage.replace('{{myCountry}}', twitterCountryName || countryData.countryNameTranslation);

        officialsModel.emailSubject = translationsData.emailSubject;
        officialsModel.sharedBy = translationsData.sharedBy;
        officialsModel.twitterHashTag = translationsData.twitterHashTag;

        /*
         * Error handling - if the data is undefined or NaN
        */
        if (isNaN(officialsModel.femalePercent) || isNaN(officialsModel.malePercent)) {
            news.pubsub.emit('hide-officials-results');
            return;
        }

        news.pubsub.emit('submit-officials-results-model', officialsModel);
    }

    var publicApi = {
        init: init
    };

    return publicApi;

});