define(['lib/news_special/bootstrap'], function (news) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;

    var $femaleBar;
    var $femaleBarVal;

    var $maleBar;
    var $maleBarVal;

    var $seperatorLine;
    

    var init = function () {

        /*
         * Event Listeners
        */
        // news.pubsub.on('submit-employment-results-model', displayEmploymentResults);
        news.pubsub.on('display-basic-employment-results', displayBasicEmploymentResults);
        news.pubsub.on('display-scroll-anim-employment-results', displayScrollAnimEmploymentResults);

        news.pubsub.on('hide-employment-results', hideEmploymentResults);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_employmentResultsHolder');

        $femaleBar = news.$('#ns_employmentResultsFemaleBar');
        $femaleBarVal = news.$('#ns_employmentResultsFemaleBarVal');

        $maleBar = news.$('#ns_employmentResultsMaleBar');
        $maleBarVal = news.$('#ns_employmentResultsMaleBarVal');

        $seperatorLine = news.$('#ns_employmentResultsSeperator');

    };

    /*
     * employmentData:Object
       // EXAMPLE -
       {
         'femaleBarFigure': 78
         'maleBarFigure': 62

         'femalePercentBarHeight': 100
         'malePercentBarHeight': 80
        }
    */
    var displayBasicEmploymentResults = function (employmentData) {

        /*
         * set the female bar height
        */
        $femaleBar.css('height', 0);

        /*
         * set the female bar value
        */
        $femaleBarVal.text('00%');
        $femaleBarVal.css('opacity', 0);

        /*
         * set the male bar height
        */
        $maleBar.css('height', 0);

        /*
         * set the male bar value
        */
        $maleBarVal.text('00%');
        $maleBarVal.css('opacity', 0);

        /*
         * Show the view!
        */
        $sectionHolderEl.removeClass('ns_hideMe');
        $seperatorLine.removeClass('ns_hideMe');

    };

    /*
     * employmentData:Object
       // EXAMPLE -
       {
         'femaleBarFigure': 78
         'maleBarFigure': 62

         'femalePercentBarHeight': 100
         'malePercentBarHeight': 80
        }
    */
    var displayScrollAnimEmploymentResults = function (employmentData) {

        var femaleAnimDuration, maleAnimDuration;
        if (employmentData.femalePercentBarHeight > employmentData.malePercentBarHeight) {
            femaleAnimDuration = 1500;
            maleAnimDuration = 1500 * (employmentData.malePercentBarHeight / employmentData.femalePercentBarHeight);
        }
        else {
            maleAnimDuration = 1500;
            femaleAnimDuration = 1500 * (employmentData.femalePercentBarHeight / employmentData.malePercentBarHeight);
        }

        /*
         * set the female bar height
        */
        //animate the femaleBar height
        $femaleBar.animate({height:employmentData.femalePercentBarHeight + '%'}, { duration: femaleAnimDuration, progress: function (a, p, c) {
            /*
             * set the female bar value
            */
            $femaleBarVal.text(Math.round(employmentData.femaleBarFigure * p) + '%');
            $femaleBarVal.css('opacity', p);
        }});

        /*
         * set the male bar height
        */
        $maleBar.animate({height:employmentData.malePercentBarHeight + '%'}, { duration: maleAnimDuration, progress: function (a, p, c) {
            /*
             * set the male bar value
            */
            $maleBarVal.text(Math.round(employmentData.maleBarFigure * p) + '%');
            $maleBarVal.css('opacity', p);
        }});

    };

    var hideEmploymentResults = function () {
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