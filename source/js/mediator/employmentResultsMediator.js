define(['lib/news_special/bootstrap', 'mediator/shareButtonsMediator', 'mediator/scrollMediator'], function (news, shareButtonsMediator, scrollMediator) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;
    var $scrollAnimEl;
    var employmentDataStore;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('submit-employment-results-model', handleEmploymentResultsModel);
        news.pubsub.on('employment-results-anim-scroll-el-hit', handleAnimScrollElHit);
        news.pubsub.on('user-submitted-country', handleRegisterScrollElement);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_employmentResultsHolder');
        $scrollAnimEl = news.$('#ns_employmentResultsHolder');

    };

    var handleEmploymentResultsModel = function (employmentData) {

        employmentDataStore = employmentData;

        /*
         * Setup share tools
        */
        var employmentShareConfig = {
            emailSubject: employmentData.emailSubject,
            emailBody: employmentData.shareMessage,
            facebookMessage: employmentData.shareMessage,
            twitterMessage: employmentData.shareMessage,
            twitterHashTag: employmentData.twitterHashTag
        };
        shareButtonsMediator.init(news.$('#ns_employmentShare'), employmentShareConfig);

        news.pubsub.emit('display-basic-employment-results', employmentData);
        if (!scrollMediator.isScrollingAvailable()) {
            news.pubsub.emit('display-scroll-anim-employment-results', employmentData);
        }
    };

    var handleAnimScrollElHit = function () {
        news.pubsub.emit('display-scroll-anim-employment-results', employmentDataStore);
        scrollMediator.unregisterScrollElement($scrollAnimEl);
    };

    var handleRegisterScrollElement = function () {
        /*
         * Scroll mediator registration
        */
        if (scrollMediator.isScrollingAvailable()) {
            scrollMediator.registerScrollElement($scrollAnimEl, 'employment-results-anim-scroll-el-hit');
        }
    };

    var publicApi = {
        init: init
    };

    return publicApi;

});