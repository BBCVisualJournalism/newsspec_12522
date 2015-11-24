define(['lib/news_special/bootstrap'], function (news) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('user-submitted-country', displayEqualityPredictionResults);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_equalityPredictionHolder');

    };

    var displayEqualityPredictionResults = function () {

        /*
         * Show the view!
        */
        $sectionHolderEl.removeClass('ns_hideMe');

    }

    var publicApi = {
        init: init
    };

    return publicApi;

});