define(['lib/news_special/bootstrap', 'utils/utils'], function (news, utils) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;

    var $selctedValEl;
    var $selctedValDescripEl;
    var $femaleBarEl;
    var $seperatorLine;
    var valIntervalID;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('display-basic-graduates-results', displayBasicGraduatesResults);
        news.pubsub.on('display-scroll-anim-graduates-results', displayScrollAnimGraduatesResults);
        news.pubsub.on('hide-graduates-results', hideGraduatesResults);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_graduatesResultsHolder');

        $selctedValEl = news.$('#ns_graduatesResultsSelectedVal');
        $selctedValDescripEl = news.$('#ns_graduatesResultsSelectedValDescrip');
        $femaleBarEl = news.$('#ns_graduateResultsFemaleBar');

        $seperatorLine = news.$('#ns_graduatesResultsSeperator');

    };

    /*
     * graduatesData:Object
       // EXAMPLE -
       {
         "selectedVal": '70',
         "maleVal": '30',
         "femaleVal": 70,
         "valDescription": 'of university graduates are women'
        }
    */
    var displayBasicGraduatesResults = function (graduatesData) {
        /*
         * set the selected val
        */
        $selctedValEl.text('00%');
        $selctedValEl.css('opacity', 0);

        /*
         * set the selected val description
        */
        $selctedValDescripEl.text(graduatesData.valDescription);

        /*
         * set the female bar width
        */
        if (utils.iCanHazCalc()) {
            $femaleBarEl.css({
              'width': 'calc(50% - 1px)'
            });
        }
        else {
            $femaleBarEl.css({
              'width': '50%'
            });
        }

        /*
         * Show the view!
        */
        $sectionHolderEl.removeClass('ns_hideMe');
        $seperatorLine.removeClass('ns_hideMe');
    };

    /*
     * graduatesData:Object
       // EXAMPLE -
       {
         "selectedVal": '70',
         "maleVal": '30',
         "femaleVal": 70,
         "valDescription": 'of university graduates are women'
        }
    */
    var displayScrollAnimGraduatesResults = function (graduatesData) {
        /*
         * set the selected val
        */
        // $selctedValEl.text(graduatesData.selectedVal  + '%');
        if (graduatesData) {
            clearInterval(valIntervalID);
            var currentAnimatedVal = 0, valStep = graduatesData.selectedVal / 100, itt = 0;
            valIntervalID = setInterval(function() {
                currentAnimatedVal += valStep; 
                $selctedValEl.text(Math.round(currentAnimatedVal)  + '%');
                $selctedValEl.css('opacity', (itt / 100));
                if (++itt >= 100) {
                    clearInterval(valIntervalID);
                }
            }, 15);

            /*
             * set the female bar width
            */
            if (utils.iCanHazCalc()) {
                $femaleBarEl.css({
                  'width': 'calc(' + graduatesData.femaleVal + '% - 1px)'
                });
            }
            else {
                $femaleBarEl.css({
                  'width': graduatesData.femaleVal + '%'
                });
            }
        }
    };

    var hideGraduatesResults = function () {
        /*
         * Hide the view!
        */
        $sectionHolderEl.addClass('ns_hideMe');
        $seperatorLine.addClass('ns_hideMe');
    }

    var publicApi = {
        init: init
    };

    return publicApi;

});