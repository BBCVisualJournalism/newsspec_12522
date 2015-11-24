define(['lib/news_special/bootstrap', 'mediator/shareButtonsMediator', 'mediator/scrollMediator'], function (news, shareButtonsMediator, scrollMediator) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;
    var $scrollAnimEl;
    var earningsDataStore;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('submit-earnings-results-model', handleEarningsResultsModel);
        news.pubsub.on('earnings-results-anim-scroll-el-hit', handleAnimScrollElHit);
        news.pubsub.on('user-submitted-country', handleRegisterScrollElement);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_earningsResultsHolder');
        $scrollAnimEl = news.$('#ns_earningsResultsScrollAnimHere');

    };

    var handleEarningsResultsModel = function (earningsData) {

        earningsDataStore = earningsData;

        /*
         * Setup share tools
        */
        var earningsShareConfig = {
            emailSubject: earningsData.emailSubject,
            emailBody: earningsData.shareMessage,
            facebookMessage: earningsData.shareMessage,
            sharedBy: earningsData.sharedBy,
            twitterMessage: earningsData.shareMessage,
            twitterHashTag: earningsData.twitterHashTag
        };


        shareButtonsMediator.init(news.$('#ns_earningsShare'), earningsShareConfig);

        news.pubsub.emit('display-basic-earnings-results', earningsData);
        if (!scrollMediator.isScrollingAvailable()) {
            news.pubsub.emit('display-scroll-anim-earnings-results', earningsData);
        }
    };

    var handleAnimScrollElHit = function () {
        news.pubsub.emit('display-scroll-anim-earnings-results', earningsDataStore);
        scrollMediator.unregisterScrollElement($scrollAnimEl);
    };

    var handleRegisterScrollElement = function () {
        /*
         * Scroll mediator registration
        */
        if (scrollMediator.isScrollingAvailable()) {
            scrollMediator.registerScrollElement($scrollAnimEl, 'earnings-results-anim-scroll-el-hit');
        }
    };

    var publicApi = {
        init: init
    };

    return publicApi;

});