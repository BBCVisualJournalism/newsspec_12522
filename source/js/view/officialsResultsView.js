define(['lib/news_special/bootstrap'], function (news) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;

    var $descrip;

    var $femaleVal;
    var $femaleImg;

    var $maleVal;
    var $maleImg;

    var $seperatorLine;

    var valIntervalID;
    

    var init = function () {

        /*
         * Event Listeners
        */
        // news.pubsub.on('submit-officials-results-model', displayOfficialsResults);
        news.pubsub.on('display-basic-officials-results', displayBasicOfficialsResults);
        news.pubsub.on('display-scroll-anim-officials-results', displayScrollAnimOfficialsResults);
        news.pubsub.on('hide-officials-results', hideOfficialsResults);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_officialsResultsHolder');

        $descrip = news.$('#ns_officialsResultsDescrip');

        $femaleVal = news.$('#ns_officialsResultsFemaleVal');
        $femaleImg = news.$('#ns_officialsResultsFemaleImg');

        $maleVal = news.$('#ns_officialsResultsMaleVal');
        $maleImg = news.$('#ns_officialsResultsMaleImg');

        $seperatorLine = news.$('#ns_officialsResultsSeperator');

    };

    /*
     * officialsData:Object
       // EXAMPLE -
       {
         "selectedVal": '70',
         "maleVal": '30',
         "femaleVal": 70,
         "valDescription": 'of university officials are women'
        }
    */
    var displayBasicOfficialsResults = function (officialsData) {

        /*
         * Set the description
        */
        $descrip.text(officialsData.topDescrip);

        /*
         * Set the female value
        */
        $femaleVal.text('00%');
        $femaleVal.css('opacity', 0);

        /*
         * Set the female image
        */
        var origFemaleImgSrc = $femaleImg.attr('src');
        var newFemaleImgSrc = origFemaleImgSrc.substring(0, origFemaleImgSrc.indexOf('group')) + officialsData.femaleImageName + '.png';
        $femaleImg.attr('src', newFemaleImgSrc);

        /*
         * Set the male value
        */
        $maleVal.text('00%');
        $maleVal.css('opacity', 0);

        /*
         * Set the male image
        */
        var origMaleImgSrc = $maleImg.attr('src');
        var newMaleImgSrc = origMaleImgSrc.substring(0, origMaleImgSrc.indexOf('group')) + officialsData.maleImageName + '.png';
        $maleImg.attr('src', newMaleImgSrc);

        /*
         * Show the view!
        */
        $sectionHolderEl.removeClass('ns_hideMe');
        $seperatorLine.removeClass('ns_hideMe');

    };

    /*
     * officialsData:Object
       // EXAMPLE -
       {
         "selectedVal": '70',
         "maleVal": '30',
         "femaleVal": 70,
         "valDescription": 'of university officials are women'
        }
    */
    var displayScrollAnimOfficialsResults = function (officialsData) {

        if (officialsData) {
            clearInterval(valIntervalID);
            var currentAnimatedVal = 0, currentAnimatedMaleVal = 0, valStep = officialsData.femalePercent / 100, valMaleStep = officialsData.malePercent / 100, itt = 0;
            valIntervalID = setInterval(function() {
                currentAnimatedVal += valStep;
                currentAnimatedMaleVal += valMaleStep;
                
                /*
                 * Set the female value
                */
                $femaleVal.text(Math.round(currentAnimatedVal)  + '%');
                $femaleVal.css('opacity', (itt / 100));

                /*
                 * Set the male value
                */
                $maleVal.text(Math.round(currentAnimatedMaleVal)  + '%');
                $maleVal.css('opacity', (itt / 100));

                if (++itt >= 100) {
                    clearInterval(valIntervalID);
                }
            }, 15);
        }

    };

    var hideOfficialsResults = function () {
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