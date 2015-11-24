define(['lib/news_special/bootstrap'], function (news) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;
    

    /*
     * config: Object
     * {
     *    risers: [{
     *            countryName: 'Albania', 
     *            flagAssetPath: 'http://siteAddress.com/img/flagalbania'), 
     *            rankChange: 100
     *        }, 
     *        {
     *            countryName: 'Albania', 
     *            flagAssetPath: 'http://siteAddress.com/img/flagalbania'), 
     *            rankChange: 75
     *    }],
     *    fallers: [{
     *            countryName: 'Albania', 
     *            flagAssetPath: 'http://siteAddress.com/img/flagalbania'), 
     *            rankChange: 75
     *        }, 
     *        {
     *            countryName: 'Albania', 
     *            flagAssetPath: 'http://siteAddress.com/img/flagalbania'), 
     *            rankChange: 100
     *    }]
     * }
    */
    var init = function (config) {

        /*
         * Event Listeners
        */
        news.pubsub.on('user-submitted-country', displayRisersAndFallers);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_risersAndFallersResultsHolder');

    };

    var displayRisersAndFallers = function () {

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