define(['lib/news_special/bootstrap'], function (news) {

    /* Vars */
    var translationsData;

    var init = function (translationsDataParam) {

        /*
         * Event Listeners
        */
        news.pubsub.on('user-submitted-country', createCountryRankResultsModel);

        /*
         * Set Variables
        */
        translationsData = translationsDataParam;
    };

    var createCountryRankResultsModel = function (countryData, gender) {

        /*
         * Country Rank
         
         * what we need:

         * femaleGenderScaleVal:Number
         * maleGenderScaleVal:Number
         * flag asset name:String
         * countryRank:Number
         * totalCountriesNum:Number
         * description:String
         
         * topRankedCountries:Array of objects
         * * rank:Number
         * * countryName:String

         * bottomRankedCountries:Array of objects
         * * rank:Number
         * * countryName:String
         
        */

        var countryRankModel = {};

        countryRankModel.countryRank = countryData.rank;
        countryRankModel.totalCountriesNum = translationsData.countryRankData.totalCountriesNum;
        countryRankModel.flagAssetPath = translationsData.assetsDomain + '/img/flag' + countryData.countryName.toLowerCase().replace(/ /g,'');

        var a, arrLength = translationsData.countryRankData.countryBands.length;
        for (a = 0; a < arrLength; a++) {
            var countryBandObj = translationsData.countryRankData.countryBands[a];
            if (countryRankModel.countryRank >= countryBandObj.bottomLevel && countryRankModel.countryRank <= countryBandObj.topLevel) {

                countryRankModel.description = countryBandObj.message;
                countryRankModel.femaleGenderScaleVal = countryBandObj.femaleBarHeight;
                countryRankModel.maleGenderScaleVal = countryBandObj.maleBarHeight;

                break;
            }
        }

        countryRankModel.topRankedCountries = translationsData.countryRankData.top10Countries;
        countryRankModel.bottomRankedCountries = translationsData.countryRankData.bottom10Countries;

        countryRankModel.shareMessage = translationsData.countryRankData.shareMessage;

        var twitterCountryName = translationsData['twitterPrefix' + countryData.countryName.replace(/ /g,'_')];

        countryRankModel.shareMessage = countryRankModel.shareMessage.replace('{{myCountry}}', twitterCountryName || countryData.countryNameTranslation);
        countryRankModel.shareMessage = countryRankModel.shareMessage.replace('{{countryRank}}', countryRankModel.countryRank);

        countryRankModel.emailSubject = translationsData.emailSubject;
        countryRankModel.sharedBy = translationsData.sharedBy;
        countryRankModel.twitterHashTag = translationsData.twitterHashTag;

        news.pubsub.emit('submit-countryRank-results-model', countryRankModel);
    }

    var publicApi = {
        init: init
    };

    return publicApi;

});