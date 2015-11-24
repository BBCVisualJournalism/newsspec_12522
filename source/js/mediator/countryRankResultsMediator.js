define(['lib/news_special/bootstrap', 'mediator/shareButtonsMediator'], function (news, shareButtonsMediator) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('submit-countryRank-results-model', handleCountryRankResultsModel);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_countryRankResultsHolder');

    };

    var handleCountryRankResultsModel = function (rankData) {

        /*
         * Setup share tools
        */
        var countryRankShareConfig = {
            emailSubject: rankData.emailSubject,
            emailBody: rankData.shareMessage,
            facebookMessage: rankData.shareMessage,
            twitterMessage: rankData.shareMessage,
            twitterHashTag: rankData.twitterHashTag
        };
        shareButtonsMediator.init(news.$('#ns_countryRankShare'), countryRankShareConfig);
    }

    var publicApi = {
        init: init
    };

    return publicApi;

});