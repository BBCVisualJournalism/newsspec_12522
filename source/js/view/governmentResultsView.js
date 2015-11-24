define(['lib/news_special/bootstrap'], function (news) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;

    var $resultsVal;
    var $resultsDescription;
    var $resultsImage;

    var $seperatorLine;
    var valIntervalID;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('display-basic-government-results', displayBasicGovernmentResults);
        news.pubsub.on('display-scroll-anim-government-results', displayScrollAnimGovernmentResults);
        // news.pubsub.on('submit-government-results-model', displayGovernmentResults);
        news.pubsub.on('hide-government-results', hideGovernmentResults);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_governmentResultsHolder');

        $resultsDescription = news.$('#ns_governmentResultsDescrip');
        $resultsVal = news.$('#ns_governmentResultsVal');
        $resultsImage = news.$('#ns_governmentResultsImg');

        $seperatorLine = news.$('#ns_governmentResultsSeperator');

    };

    /*
     * governmentData:Object
       // EXAMPLE -
       {
         "percentVal": '70',
         "description": 'of ministers are female/male'
         "imageName": 'anImageName'
        }
    */
    var displayBasicGovernmentResults = function (governmentData) {

        /*
         * Set the results Value percent
        */
        $resultsVal.text('00%');
        $resultsVal.css('opacity', 0);

        /*
         * Set the results description
        */
        $resultsDescription.text(governmentData.description);

        /*
         * Set the results image
        */
        var orgImgSrc = $resultsImage.attr('src');
        var newImgSrc = orgImgSrc.substring(0, orgImgSrc.indexOf('government')) + governmentData.imageName + '.png';
        $resultsImage.attr('src', newImgSrc);

        /*
         * Show the view!
        */
        $sectionHolderEl.removeClass('ns_hideMe');
        $seperatorLine.removeClass('ns_hideMe');

    };

    /*
     * governmentData:Object
       // EXAMPLE -
       {
         "percentVal": '70',
         "description": 'of ministers are female/male'
         "imageName": 'anImageName'
        }
    */
    var displayScrollAnimGovernmentResults = function (governmentData) {

        /*
         * Set the results Value percent
        */
        // $resultsVal.text(governmentData.percentVal + '%');
        if (governmentData) {
            clearInterval(valIntervalID);
            var currentAnimatedVal = 0, valStep = governmentData.percentVal / 100, itt = 0;
            valIntervalID = setInterval(function() {
                currentAnimatedVal += valStep; 
                $resultsVal.text(Math.round(currentAnimatedVal)  + '%');
                $resultsVal.css('opacity', (itt / 100));
                if (++itt >= 100) {
                    clearInterval(valIntervalID);
                }
            }, 15);
        }

    };

    var hideGovernmentResults = function () {
        /*
         * Hide the view!
        */
        $sectionHolderEl.addClass('ns_hideMe');
        $seperatorLine.addClass('ns_hideMe');
    };

    var publicApi = {
        init: init
    };

    return publicApi;

});