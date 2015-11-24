define(['lib/news_special/bootstrap', 'mediator/shareButtonsMediator'], function (news, shareButtonsMediator) {

    /*
     * Declare Variables
    */
    var submitElementScrollTarget;
    var $iframeEl;
    var $parentHtmlEl;
    var iframeTopOffset = 0;
    var scrollTimeout;
    var registeredScrollEls = {};
    var $parentPagEl;
    var parentPageWindowHeight;
    // var scrollAnimSupport = true;
    

    var init = function () {


        /*
         * Set Variables
        */
        
        /*
         * Event Listeners
        */
        news.pubsub.on('user-submitted-country', handleCountrySelected);

        //listener for the scroll listener from the parent postmessage
        if (window.addEventListener) {
            window.addEventListener('message', receiveScrollMessage, false);
        }
        else {
            window.attachEvent('onmessage', receiveScrollMessage, false);
        }

    };

    var receiveScrollMessage = function (e) {
        var parsedObject = JSON.parse(e.data);

        if (!parsedObject) {
            return
        }

        /*
         * parsedObject properties:
          * docdomain
          * isScrollEvent
          * parentPageScrollTop
          * parentPageWindowHeight
          * iframeTopOffset
        */
        if (parsedObject.isScrollEvent) {

            for (key in registeredScrollEls) {

                var elTop = (registeredScrollEls[key]['$el'].offset().top + parsedObject.iframeTopOffset) - parsedObject.parentPageWindowHeight;
                // var elBottom = elTop + registeredScrollEls[key]['$el'].height();

                if (parsedObject.parentPageScrollTop >= elTop && elTop > 0) {
                    //One of the scroll elements is in view, fire off the event
                    news.pubsub.emit(registeredScrollEls[key].callbackEventString);

                }
            }

            if (parsedObject.docdomain) {
                document.domain = parsedObject.docdomain;
            }
        }
    };

    var handleCountrySelected = function (countryObj, genderSelected) {
        submitElementScrollTarget = news.$('#ns_countryRankResultsHolder').offset().top;
        news.sendMessageToScrollToPos(submitElementScrollTarget);
    };

    var isScrollingAvailable = function () {
        return (window.postMessage) ? true : false;
    };

    var registerScrollElement = function ($el, callbackEventString) {
        registeredScrollEls[$el.attr('id')] = {
            '$el': $el,
            'callbackEventString': callbackEventString
        }
    };

    var unregisterScrollElement = function ($el) {
        var idStr = $el.attr('id');
        delete registeredScrollEls[idStr];
    };

    var publicApi = {
        init: init,
        isScrollingAvailable: isScrollingAvailable,
        registerScrollElement: registerScrollElement,
        unregisterScrollElement: unregisterScrollElement
    };

    return publicApi;

});