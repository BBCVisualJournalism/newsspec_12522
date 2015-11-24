define(['lib/news_special/bootstrap'], function (news) {

    /* Vars */
    var translationsData;

    var init = function (translationsDataParam) {

        /*
         * Event Listeners
        */
        news.pubsub.on('user-submitted-country', createEarningsResultsModel);

        /*
         * Set Variables
        */
        translationsData = translationsDataParam;
    };

    var createEarningsResultsModel = function (countryData, gender) {

        /*
         * Country Rank
         
         * what we need:

         * earningsDescrip: String

         * currencySymbol: String

         * femaleEarningsFigure: Number
         * maleEarningsFigure: Number

         * femaleCirclesNum: Number
         * maleCirclesNum: Number

         * flag asset name:String

         
         
        */

        var earningsModel = {};

        earningsModel.earningsDescrip = translationsData.earningsData.descrip;
        earningsModel.currencySymbol = countryData.currency;

        // earningsModel.femaleEarningsFigure = (countryData.womanSalaryDiff * 100).toFixed(2);
        earningsModel.femaleEarningsFigure = Math.round(countryData.womanSalaryDiff * 100);
        earningsModel.maleEarningsFigure = 100;

        earningsModel.femaleCirclesNum = earningsModel.femaleEarningsFigure;
        earningsModel.maleCirclesNum = earningsModel.maleEarningsFigure;

        earningsModel.flagAssetPath = translationsData.assetsDomain + '/img/flag' + countryData.countryName.toLowerCase().replace(/ /g,'');

        earningsModel.shareMessage = translationsData.earningsData.shareMessage;
        earningsModel.shareMessage = earningsModel.shareMessage.replace('{{currencySymbol}}', earningsModel.currencySymbol);
        earningsModel.shareMessage = earningsModel.shareMessage.replace('{{currencySymbol}}', earningsModel.currencySymbol);
        earningsModel.shareMessage = earningsModel.shareMessage.replace('{{maleEarningsFigure}}', '100');
        earningsModel.shareMessage = earningsModel.shareMessage.replace('{{femaleEarningsFigure}}', earningsModel.femaleEarningsFigure);
        
        var twitterCountryName = translationsData['twitterPrefix' + countryData.countryName.replace(/ /g,'_')];

        earningsModel.shareMessage = earningsModel.shareMessage.replace('{{myCountry}}', twitterCountryName || countryData.countryNameTranslation);

        earningsModel.emailSubject = translationsData.emailSubject;
        earningsModel.sharedBy = translationsData.sharedBy;
        earningsModel.twitterHashTag = translationsData.twitterHashTag;

        /*
         * Error handling - if the data is undefined or NaN
        */
        if (isNaN(earningsModel.femaleEarningsFigure) || !countryData.womanSalaryDiff) {
            news.pubsub.emit('hide-earnings-results');
            return;
        }

        news.pubsub.emit('submit-earnings-results-model', earningsModel);
    }

    var publicApi = {
        init: init
    };

    return publicApi;

});