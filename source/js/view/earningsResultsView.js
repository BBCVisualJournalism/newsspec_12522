define(['lib/news_special/bootstrap'], function (news) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;

    var $resultsDescrip;

    var $femaleCircles;
    var $maleCircles;

    var $flag;

    var femaleBgColor = '#f6b988';
    var maleBgColor = '#89c2c2';
    var neutralBgColor = '#DDDDDD';
    var intervalId;

    var $seperatorLine;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('display-basic-earnings-results', displayBasicEarningsResults);
        news.pubsub.on('display-scroll-anim-earnings-results', displayScrollAnimEarningsResults);
        news.pubsub.on('hide-earnings-results', hideEarningsResults);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_earningsResultsHolder');

        $resultsDescrip = news.$('#ns_earningsResultsDescrip');

        $femaleCircles = news.$('#ns_earningsResultsPersonHolderFemale').find('.ns_earningsResultsCircle');
        $maleCircles = news.$('#ns_earningsResultsPersonHolderMale').find('.ns_earningsResultsCircle');

        $flag = news.$('#ns_earningsResultsFlagImg');

        $seperatorLine = news.$('#ns_earningsResultsSeperator');

    };

    /*
     * earningsData:Object
       // EXAMPLE -
       {
         "earningsDescrip": '24',
         "currencySymbol": '£',
         "femaleEarningsFigure": 0.72,
         "maleEarningsFigure": 1,
         "femaleCirclesNum": 72,
         "maleCirclesNum": 100
        }
    */
    var displayBasicEarningsResults = function (earningsData) {

        //set the resultsDescrip html
        var earningsDescrip = earningsData.earningsDescrip;
        earningsDescrip = earningsDescrip.replace(/{{currencySymbol}}/g,'<span class="ns_earningsResultsSalaryFigureSpan">' + earningsData.currencySymbol);
        earningsDescrip = earningsDescrip.replace(/{{maleEarningsFigure}}/g,earningsData.maleEarningsFigure + '</span>');
        earningsDescrip = earningsDescrip.replace(/{{femaleEarningsFigure}}/g,earningsData.femaleEarningsFigure + '</span>');

        $resultsDescrip.html(earningsDescrip);

        //first reset the circles back to the original colour
        clearInterval(intervalId);
        $femaleCircles.css('background-color', neutralBgColor);
        $maleCircles.css('background-color', neutralBgColor);

        //set the src of the flag image
        $flag.attr('src', earningsData.flagAssetPath + '.png');

        /*
         * Show the view!
        */
        $sectionHolderEl.removeClass('ns_hideMe');
        $seperatorLine.removeClass('ns_hideMe');

    };

    var displayScrollAnimEarningsResults = function (earningsData) {

      if (earningsData) {
        var intervalItt = 0;
        intervalId = setInterval(function () {
          
          //female circle check
          if (intervalItt < earningsData.femaleCirclesNum) {
            $femaleCircles[Math.abs(100 - (intervalItt + 1))].style.backgroundColor = femaleBgColor;
          }

          //male circle check
          if (intervalItt < earningsData.maleCirclesNum) {
            $maleCircles[Math.abs(100 - (intervalItt + 1))].style.backgroundColor = maleBgColor;
          }

          if (++intervalItt === 100) {
            clearInterval(intervalId);
          }
        }, 50);
      }
      
    };

    var hideEarningsResults = function () {
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