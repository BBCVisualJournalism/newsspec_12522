define(['lib/news_special/bootstrap', 'mediator/shareButtonsMediator', 'mediator/scrollMediator'], function (news, shareButtonsMediator, scrollMediator) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;
    var $scrollAnimEl;
    var graduatesDataStore;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('submit-graduates-results-model', handleGraduatesResultsModel);
        news.pubsub.on('graduates-results-anim-scroll-el-hit', handleAnimScrollElHit);
        news.pubsub.on('user-submitted-country', handleRegisterScrollElement);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_graduatesResultsHolder');
        $scrollAnimEl = news.$('#ns_graduatesResultsSelectedValDescrip');

    };

    var handleGraduatesResultsModel = function (graduatesData) {

        graduatesDataStore = graduatesData;

        /*
         * Setup share tools
        */
        var graduatesShareConfig = {
            emailSubject: graduatesData.emailSubject,
            emailBody: graduatesData.shareMessage,
            facebookMessage: graduatesData.shareMessage,
            twitterMessage: graduatesData.shareMessage,
            twitterHashTag: graduatesData.twitterHashTag
        };
        shareButtonsMediator.init(news.$('#ns_graduatesShare'), graduatesShareConfig);

        news.pubsub.emit('display-basic-graduates-results', graduatesData);
        if (!scrollMediator.isScrollingAvailable()) {
            news.pubsub.emit('display-scroll-anim-graduates-results', graduatesData);
        }
    };

    var handleAnimScrollElHit = function () {
        news.pubsub.emit('display-scroll-anim-graduates-results', graduatesDataStore);
        scrollMediator.unregisterScrollElement($scrollAnimEl);
    };

    var handleRegisterScrollElement = function () {
        /*
         * Scroll mediator registration
        */
        if (scrollMediator.isScrollingAvailable()) {
            scrollMediator.registerScrollElement($scrollAnimEl, 'graduates-results-anim-scroll-el-hit');
        }
    };

    var publicApi = {
        init: init
    };

    return publicApi;

});