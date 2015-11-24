define(['lib/news_special/bootstrap', 'module'], function (news, module) {

    /*
     * Variables
    */
    var $shareButton;
    var $shareOverlay;
    var $shareOverlayCloseButton;
    
    var $shareOverlayEmailButton;
    var $shareOverlayFacebookButton;
    var $shareOverlayTwitterButton;

    var shareComponentModelStore = {};

    var appDomain = '';

    var currentResultsBoxId;

    var FACEBOOK_URL = 'https://www.facebook.com/dialog/feed';
    var BBC_FB_APP_ID = '58567469885';
    var BBC_SHARE_TOOLS_URL = 'http://www.bbc.co.uk/modules/sharetools/callback';
    var TWITTER_URL = 'https://twitter.com/intent/tweet';
    var EMAIL_URL = 'mailto:';
    var parentDomain = (window.location != window.parent.location) ? document.referrer : document.location;
    var PAGE_URL = parentDomain;


    
    /*
     * $shareHolderEl : jquery Object
     * shareConfig : Object
     ** { 'emailSubject': '', 'emailBody': '', facebookMessage: '', 'sharedBy': '', 'twitterMessage': '', 'twitterHashTag': '' }
    */
    var init = function ($shareHolderEl, shareConfig) {

        shareComponentModelStore[$shareHolderEl.attr('id')] = shareConfig;

        /*
         * set vars
        */
        $shareButton = $shareHolderEl.find('.ns_shareButton');
        $shareOverlayCloseButton = $shareHolderEl.find('.ns_shareOverlayClose');
        
        $shareOverlayEmailButton = $shareHolderEl.find('.email__share-button');
        $shareOverlayFacebookButton = $shareHolderEl.find('.facebook__share-button');
        $shareOverlayTwitterButton = $shareHolderEl.find('.twitter__share-button');

        /*
         * Event Listeners
        */
        $shareButton.off('click', handleShareButtonClick);
        $shareButton.on('click', handleShareButtonClick);

        $shareOverlayCloseButton.on('click', handleShareOverlayCloseButtonClick);

        $shareOverlayEmailButton.off('click', {config: shareConfig}, handleShareOverlayEmailButtonClick);
        $shareOverlayEmailButton.on('click', {config: shareConfig}, handleShareOverlayEmailButtonClick);
        
        $shareOverlayFacebookButton.off('click', {config: shareConfig}, handleShareOverlayFacebookButtonClick);
        $shareOverlayFacebookButton.on('click', {config: shareConfig}, handleShareOverlayFacebookButtonClick);
        
        $shareOverlayTwitterButton.off('click', {config: shareConfig}, handleShareOverlayTwitterButtonClick);
        $shareOverlayTwitterButton.on('click', {config: shareConfig}, handleShareOverlayTwitterButtonClick);

    };

    var setAppDomain = function (val) {
        appDomain = val;
    };

    var handleShareButtonClick = function (e) {
        //hide all the share overlays before we start

        //find the share overlay
        var $buttonParent = news.$(e.target.parentElement);
        $shareOverlay = $buttonParent.find('.ns_shareOverlay');

        var isSharOverlayAlreadyOpen = !$shareOverlay.hasClass('ns_hideMe');

        $shareOverlay.addClass('ns_hideMe');

        //show the overlay
        if (!isSharOverlayAlreadyOpen) {
            $shareOverlay.removeClass('ns_hideMe');
        }

        //istats call
        news.pubsub.emit('istats', ['ns12522-section-share-button-clicked', 'newsspec-interaction', $buttonParent.attr('id')]);

    };

    var handleShareOverlayCloseButtonClick = function (e) {
        e.preventDefault();
        $shareOverlay.addClass('ns_hideMe');
    };

    var handleShareOverlayEmailButtonClick = function (e) {
        e.preventDefault();

        var emailTarget = emailShareTarget(e.data.config.emailSubject, e.data.config.emailBody);

        var sectionId = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
        
        //istats call
        news.pubsub.emit('istats', ['ns12522-share-email-button-clicked', 'newsspec-interaction', sectionId]);

        shareWindow(emailTarget, 'NSShareWindow', 500, 300, 'no');
    };

    var handleShareOverlayFacebookButtonClick = function (e) {
        e.preventDefault();

        var facebookTarget = facebookShareTarget(e.data.config.facebookMessage);

        var sectionId = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;

        //istats call
        news.pubsub.emit('istats', ['ns12522-share-facebook-button-clicked', 'newsspec-interaction', sectionId]);

        shareWindow(facebookTarget, 'NSShareWindow', 500, 300, 'no');
    };

    var handleShareOverlayTwitterButtonClick = function (e) {
        e.preventDefault();
        
        var twitterTarget = twitterShareTarget(e.data.config.twitterMessage, e.data.config.twitterHashTag);

        var sectionId = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
        
        //istats call
        news.pubsub.emit('istats', ['ns12522-share-twitter-button-clicked', 'newsspec-interaction', sectionId]);

        shareWindow(twitterTarget, 'NSShareWindow', 500, 300, 'no');
    };

    var facebookShareTarget = function (htmlMessage) {
        var message =  news.$('<div/>').html(htmlMessage).text();
        return FACEBOOK_URL + // FACEBOOK URL
        '?app_id=' + BBC_FB_APP_ID + // via BBC APP id
        '&redirect_uri=' + encodeURIComponent(BBC_SHARE_TOOLS_URL) + // Sharetools locations encoded for Query string
        '%3Fst_cb%3Dfacebook%23state%3Dfeed' + // Standard callback parameters "?st_cb=facebook#state=feed"
        '&display=popup' + // Share window type
        '&link=' + PAGE_URL + // URL storypage
        '&name=' + encodeURIComponent(message) + // Custom share message
        '&picture=' + appDomain + '/img/promo624.png'; // Open Graph Protocol Image
    };

    var twitterShareTarget = function (htmlMessage, hashTag) {
        var message =  news.$('<div/>').html(htmlMessage).text();
        return TWITTER_URL + // Twitter API
        '?text=' + encodeURIComponent(message + ' ' + PAGE_URL + ' ' + hashTag); // Custom share message ... include the hash tag at the end
    };

    var emailShareTarget = function (subject, htmlMessage) {
        var message =  news.$('<div/>').html(htmlMessage).text();
        return EMAIL_URL + // Email
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(message + ' ' + PAGE_URL) // Custom share message
    };

    var shareWindow = function (url, winName, width, height, scroll) {
        var popupWindow,
        leftPosition = (screen.width) ? (screen.width - width) / 2 : 0,
        topPosition = (screen.height) ? (screen.height - height) / 2 : 0,
        settings = 'height=' + height +
        ',width=' + width +
        ',top=' + topPosition +
        ',left=' + leftPosition +
        ',scrollbars=' + scroll +
        ',resizable';
        popupWindow = window.open(url, winName, settings);
    };

    var publicApi = {
        init: init,
        setAppDomain: setAppDomain
    };

    return publicApi;

});