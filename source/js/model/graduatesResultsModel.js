define(['lib/news_special/bootstrap'], function (news) {

    /* Vars */
    var translationsData;

    var init = function (translationsDataParam) {

        /*
         * Event Listeners
        */
        news.pubsub.on('user-submitted-country', createGraduatesResultsModel);

        /*
         * Set Variables
        */
        translationsData = translationsDataParam;
    };

    var createGraduatesResultsModel = function (countryData, gender) {

        /*
         * Country Rank
         
         * what we need:

         * selectedVal: Number

         * maleVal: Number

         * femaleVal: Number

         * valDescription: String

         
         
        */

        var graduatesModel = {};

        graduatesModel.selectedVal = (gender == 'female') ? Math.round(countryData.womanDegree) : Math.round(countryData.manDegree);

        graduatesModel.maleVal = countryData.manDegree;
        graduatesModel.femaleVal = countryData.womanDegree;

        graduatesModel.valDescription = (gender == 'female') ? translationsData.graduatesData.valDescripFemale : translationsData.graduatesData.valDescripMale;

        graduatesModel.shareMessage = (gender == 'female') ? translationsData.graduatesData.shareMessageFemale : translationsData.graduatesData.shareMessageMale;
        
        var twitterCountryName = translationsData['twitterPrefix' + countryData.countryName.replace(/ /g,'_')];

        graduatesModel.shareMessage = graduatesModel.shareMessage.replace('{{myCountry}}', twitterCountryName || countryData.countryNameTranslation);
        graduatesModel.shareMessage = graduatesModel.shareMessage.replace('{{graduatesPercentageWomen}}', (Math.round(graduatesModel.femaleVal) + '%'));
        graduatesModel.shareMessage = graduatesModel.shareMessage.replace('{{graduatesPercentageMen}}', (Math.round(graduatesModel.maleVal) + '%'));

        graduatesModel.emailSubject = translationsData.emailSubject;
        graduatesModel.sharedBy = translationsData.sharedBy;
        graduatesModel.twitterHashTag = translationsData.twitterHashTag;

        /*
         * Error handling - if the data is undefined or NaN
        */
        if (isNaN(graduatesModel.maleVal) || isNaN(graduatesModel.femaleVal)) {
            news.pubsub.emit('hide-graduates-results');
            return;
        }

        news.pubsub.emit('submit-graduates-results-model', graduatesModel);
    }

    var publicApi = {
        init: init
    };

    return publicApi;

});