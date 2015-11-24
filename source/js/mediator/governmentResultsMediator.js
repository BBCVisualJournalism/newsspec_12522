define(['lib/news_special/bootstrap', 'mediator/shareButtonsMediator', 'mediator/scrollMediator'], function (news, shareButtonsMediator, scrollMediator) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;
    var $scrollAnimEl;
    var governmentDataStore;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('submit-government-results-model', handleGovernmentResultsModel);
        news.pubsub.on('government-results-anim-scroll-el-hit', handleAnimScrollElHit);
        news.pubsub.on('user-submitted-country', handleRegisterScrollElement);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_governmentResultsHolder');
        $scrollAnimEl = news.$('#ns_governmentResultsDescrip');

    };

    var handleGovernmentResultsModel = function (governmentData) {

        governmentDataStore = governmentData;

        /*
         * Setup share tools
        */
        var governmentShareConfig = {
            emailSubject: governmentData.emailSubject,
            emailBody: governmentData.shareMessage,
            facebookMessage: governmentData.shareMessage,
            twitterMessage: governmentData.shareMessage,
            twitterHashTag: governmentData.twitterHashTag
        };
        shareButtonsMediator.init(news.$('#ns_governmentShare'), governmentShareConfig);

        news.pubsub.emit('display-basic-government-results', governmentData);
        if (!scrollMediator.isScrollingAvailable()) {
            news.pubsub.emit('display-scroll-anim-government-results', governmentData);
        }
    };

    var handleAnimScrollElHit = function () {
        news.pubsub.emit('display-scroll-anim-government-results', governmentDataStore);
        scrollMediator.unregisterScrollElement($scrollAnimEl);
    };

    var handleRegisterScrollElement = function () {
        /*
         * Scroll mediator registration
        */
        if (scrollMediator.isScrollingAvailable()) {
            scrollMediator.registerScrollElement($scrollAnimEl, 'government-results-anim-scroll-el-hit');
        }
    };

    var publicApi = {
        init: init
    };

    return publicApi;

});