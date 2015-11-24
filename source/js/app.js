define([
    'lib/news_special/bootstrap',
    'module',
    'countrySearchUserInput',
    'model/countryRankResultsModel',
    'model/earningsResultsModel',
    'model/graduatesResultsModel',
    'model/employmentResultsModel',
    'model/officialsResultsModel',
    'model/governmentResultsModel',
    'model/equalityPredictionModel',
    'view/countryRankResultsView',
    'view/earningsResultsView',
    'view/graduatesResultsView',
    'view/employmentResultsView',
    'view/officialsResultsView',
    'view/governmentResultsView',
    'mediator/scrollMediator',
    'mediator/shareButtonsMediator',
    'mediator/countryRankResultsMediator',
    'mediator/earningsResultsMediator',
    'mediator/graduatesResultsMediator',
    'mediator/employmentResultsMediator',
    'mediator/officialsResultsMediator',
    'mediator/governmentResultsMediator',
    'view/equalityPrediction',
    ], function (news, module, countrySearchUserInput, countryRankResultsModel, earningsResultsModel, graduatesResultsModel, employmentResultsModel, officialsResultsModel, governmentResultsModel, equalityPredictionModel, countryRankResultsView, earningsResultsView, graduatesResultsView, employmentResultsView, officialsResultsView, governmentResultsView, scrollMediator, shareButtonsMediator, countryRankResultsMediator, earningsResultsMediator, graduatesResultsMediator, employmentResultsMediator, officialsResultsMediator, governmentResultsMediator, equalityPrediction) {

    var docdomain = getQueryStringValue(window.location.search, 'docdomain');
    if (docdomain) {
        document.domain = docdomain;    
    }

    news.sendMessageToRemoveLoadingImage();

    /*
     * iStats init
    */
    news.pubsub.emit('istats', ['ns12522-app-initiated', 'newsspec-nonuser']);

    /*
     * Variables
    */
    var hasInitedResults;

    /*
     * model components init
    */
    countrySearchUserInput.init(module.config().countriesData);
    countryRankResultsModel.init(module.config().translationsData);
    earningsResultsModel.init(module.config().translationsData);
    graduatesResultsModel.init(module.config().translationsData);
    employmentResultsModel.init(module.config().translationsData);
    officialsResultsModel.init(module.config().translationsData);
    governmentResultsModel.init(module.config().translationsData);
    equalityPredictionModel.init(module.config().translationsData);

    /*
     * view components init
    */
    countryRankResultsView.init();
    earningsResultsView.init();
    graduatesResultsView.init();
    employmentResultsView.init();
    officialsResultsView.init();
    governmentResultsView.init();
    equalityPrediction.init();

    /*
     * mediator components init
    */
    scrollMediator.init();
    shareButtonsMediator.setAppDomain(module.config().translationsData.assetsDomain);
    countryRankResultsMediator.init();
    earningsResultsMediator.init();
    graduatesResultsMediator.init();
    employmentResultsMediator.init();
    officialsResultsMediator.init();
    governmentResultsMediator.init();

    /*
     * Event listeners
    */
    news.pubsub.on('user-submitted-country', handleCountrySelected);

    /*
     * Methods
    */
    function handleCountrySelected(countryObj, genderSelected) {
        
    }

    /*
     * Utils
    */
    function getQueryStringValue(queryString, key) {
        var regex       = new RegExp('(?:[\\?&]|&amp;)' + key + '=([^&#]*)'),
            results     = regex.exec(queryString);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // ###################################################################################################
    // The following is example code and can/should be used where required.
    // ###################################################################################################

    // news.hostPageSetup('' +
    //     'document.body.id = "hostPageCallbackWorks";' +
    //     'document.body.style.background = "lime";'
    // );

    // setTimeout(function () {
    //     news.pubsub.emit('istats', ['panel-clicked', 'newsspec-interaction', 3]);
    // }, 500);
    // setTimeout(function () {
    //     news.pubsub.emit('istats', ['quiz-end', 'newsspec-interaction', true]);
    // }, 2000);
});