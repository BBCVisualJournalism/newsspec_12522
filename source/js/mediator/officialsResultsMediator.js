define(['lib/news_special/bootstrap', 'mediator/shareButtonsMediator', 'mediator/scrollMediator'], function (news, shareButtonsMediator, scrollMediator) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;
    var $scrollAnimEl;
    var officialsDataStore;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('submit-officials-results-model', handleOfficialsResultsModel);
        news.pubsub.on('officials-results-anim-scroll-el-hit', handleAnimScrollElHit);
        news.pubsub.on('user-submitted-country', handleRegisterScrollElement);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_officialsResultsHolder');
        $scrollAnimEl = news.$('#ns_officialsResultsDescrip');

    };

    var handleOfficialsResultsModel = function (officialsData) {

        officialsDataStore = officialsData;

        /*
         * Setup share tools
        */
        var officialsShareConfig = {
            emailSubject: officialsData.emailSubject,
            emailBody: officialsData.shareMessage,
            facebookMessage: officialsData.shareMessage,
            twitterMessage: officialsData.shareMessage,
            twitterHashTag: officialsData.twitterHashTag
        };
        shareButtonsMediator.init(news.$('#ns_officialsShare'), officialsShareConfig);

        news.pubsub.emit('display-basic-officials-results', officialsData);
        if (!scrollMediator.isScrollingAvailable()) {
            news.pubsub.emit('display-scroll-anim-officials-results', officialsData);
        }
    };

    var handleAnimScrollElHit = function () {
        news.pubsub.emit('display-scroll-anim-officials-results', officialsDataStore);
        scrollMediator.unregisterScrollElement($scrollAnimEl);
    };

    var handleRegisterScrollElement = function () {
        /*
         * Scroll mediator registration
        */
        if (scrollMediator.isScrollingAvailable()) {
            scrollMediator.registerScrollElement($scrollAnimEl, 'officials-results-anim-scroll-el-hit');
        }
    };

    var publicApi = {
        init: init
    };

    return publicApi;

});