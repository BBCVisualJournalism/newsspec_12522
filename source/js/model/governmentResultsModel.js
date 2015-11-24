define(['lib/news_special/bootstrap'], function (news) {

    /* Vars */
    var translationsData;
    var imagePercentRanges = [
        {
            bottom: 0,
            top: 9,
            name: 'government0in5'
        },
        {
            bottom: 10,
            top: 29,
            name: 'government1in5'
        },
        {
            bottom: 30,
            top: 49,
            name: 'government2in5'
        },
        {
            bottom: 50,
            top: 100,
            name: 'government3in5'
        }
    ];

    var init = function (translationsDataParam) {

        /*
         * Event Listeners
        */
        news.pubsub.on('user-submitted-country', createGovernmentResultsModel);

        /*
         * Set Variables
        */
        translationsData = translationsDataParam;
    };

    var createGovernmentResultsModel = function (countryData, gender) {

        /*
         * Country Rank
         
         * what we need:

         * percentVal: Number
         * description: String
         * imageName: String
         
        */

        var governmentModel = {};

        governmentModel.description = (gender == 'female') ? translationsData.governmentData.femaleDescrip : translationsData.governmentData.maleDescrip;

        // governmentModel.percentVal = (gender == 'female') ? countryData.womanMinistersPercent : countryData.manMinistersPercent;
        governmentModel.percentVal = (gender == 'female') ? Math.round(100 - countryData.manMinistersPercent) : Math.round(countryData.manMinistersPercent);

        var roundedWomanPercent = Math.round(100 - countryData.manMinistersPercent);

        var a, arrLength = imagePercentRanges.length;
        for (a = 0; a < arrLength; a++) {
            if (roundedWomanPercent >= imagePercentRanges[a].bottom && roundedWomanPercent <= imagePercentRanges[a].top) {
                governmentModel.imageName = imagePercentRanges[a].name;
                break;
            }
        }

        governmentModel.shareMessage = (gender == 'female') ? translationsData.governmentData.shareMessageFemale : translationsData.governmentData.shareMessageMale;
        governmentModel.shareMessage = governmentModel.shareMessage.replace('{{governmentMinistersPercentageWomen}}', (governmentModel.percentVal + '%'));
        governmentModel.shareMessage = governmentModel.shareMessage.replace('{{governmentMinistersPercentageMen}}', (governmentModel.percentVal + '%'));
        
        var twitterCountryName = translationsData['twitterPrefix' + countryData.countryName.replace(/ /g,'_')];

        governmentModel.shareMessage = governmentModel.shareMessage.replace('{{myCountry}}', twitterCountryName || countryData.countryNameTranslation);

        governmentModel.emailSubject = translationsData.emailSubject;
        governmentModel.sharedBy = translationsData.sharedBy;
        governmentModel.twitterHashTag = translationsData.twitterHashTag;

        /*
         * Error handling - if the data is undefined or NaN
        */
        if (isNaN(governmentModel.percentVal)) {
            news.pubsub.emit('hide-government-results');
            return;
        }

        news.pubsub.emit('submit-government-results-model', governmentModel);
    }

    var publicApi = {
        init: init
    };

    return publicApi;

});