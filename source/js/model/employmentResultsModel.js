define(['lib/news_special/bootstrap'], function (news) {

    /* Vars */
    var translationsData;

    var init = function (translationsDataParam) {

        /*
         * Event Listeners
        */
        news.pubsub.on('user-submitted-country', createEmploymentResultsModel);

        /*
         * Set Variables
        */
        translationsData = translationsDataParam;
    };

    var createEmploymentResultsModel = function (countryData, gender) {

        /*
         * Employment
         
         * what we need:

         * femaleBarFigure: Number
         * maleBarFigure: Number

         * femalePercentBarHeight: Number
         * malePercentBarHeight: Number
         
        */

        var employmentModel = {};

        employmentModel.femaleBarFigure = countryData.womanLabourForcePercent;
        employmentModel.maleBarFigure = countryData.manLabourForcePercent;

        employmentModel.femalePercentBarHeight = (employmentModel.femaleBarFigure > employmentModel.maleBarFigure) ? 100 : (employmentModel.femaleBarFigure / employmentModel.maleBarFigure) * 100;
        employmentModel.malePercentBarHeight = (employmentModel.maleBarFigure > employmentModel.femaleBarFigure) ? 100 : (employmentModel.maleBarFigure / employmentModel.femaleBarFigure) * 100;

        employmentModel.femaleBarFigure = Math.round(employmentModel.femaleBarFigure);
        employmentModel.maleBarFigure = Math.round(employmentModel.maleBarFigure);

        employmentModel.shareMessage = (gender == 'female') ? translationsData.employmentData.shareMessageFemale : translationsData.employmentData.shareMessageMale;

        var twitterCountryName = translationsData['twitterPrefix' + countryData.countryName.replace(/ /g,'_')];

        employmentModel.shareMessage = employmentModel.shareMessage.replace('{{myCountry}}', twitterCountryName || countryData.countryNameTranslation);
        employmentModel.shareMessage = employmentModel.shareMessage.replace('{{employmentPercentageWomen}}', (employmentModel.femaleBarFigure + '%'));
        employmentModel.shareMessage = employmentModel.shareMessage.replace('{{employmentPercentageMen}}', (employmentModel.maleBarFigure + '%'));

        employmentModel.emailSubject = translationsData.emailSubject;
        employmentModel.sharedBy = translationsData.sharedBy;
        employmentModel.twitterHashTag = translationsData.twitterHashTag;

        /*
         * Error handling - if the data is undefined or NaN
        */
        if (isNaN(employmentModel.femaleBarFigure) || isNaN(employmentModel.maleBarFigure)) {
            news.pubsub.emit('hide-employment-results');
            return;
        }

        news.pubsub.emit('submit-employment-results-model', employmentModel);
    }

    var publicApi = {
        init: init
    };

    return publicApi;

});