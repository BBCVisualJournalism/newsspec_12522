define(['lib/news_special/bootstrap', 'mediator/shareButtonsMediator'], function (news, shareButtonsMediator) {

    var init = function (translationsData) {

        /*
         * Setup share tools
        */
        var summaryShareConfig = {
            emailSubject: translationsData.emailSubject,
            emailBody: translationsData.globalSummaryData.shareMessage,
            facebookMessage: translationsData.globalSummaryData.shareMessage,
            sharedBy: translationsData.sharedBy,
            twitterMessage: translationsData.globalSummaryData.shareMessage,
            twitterHashTag: translationsData.twitterHashTag
        };
        shareButtonsMediator.init(news.$('#ns_equalityPredictionShare'), summaryShareConfig);
        
    };

    var publicApi = {
        init: init
    };

    return publicApi;

});