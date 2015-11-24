define(['lib/news_special/bootstrap'], function (news) {

    /*
     * Declare Variables
    */
    var $sectionHolderEl;

    var $femaleBar;
    var $maleBar;

    var $flag;

    var $rankDescription;

    var $seperatorLine;
    

    var init = function () {

        /*
         * Event Listeners
        */
        news.pubsub.on('submit-countryRank-results-model', displayRankResults);

        /*
         * Set Variables
        */
        $sectionHolderEl = news.$('#ns_countryRankResultsHolder');

        $femaleBar = news.$('#ns_countryRankResultFemaleBar');
        $maleBar = news.$('#ns_countryRankResultMaleBar');

        $flag = news.$('#ns_countryResultsRankFlagImg');

        $rankDescription = news.$('#ns_countryRankResultsRankDescription');

        $seperatorLine = news.$('#ns_countryRankResultsSeperator');

    };

    /*
     * rankData:Object
       // EXAMPLE -
       {
         "countryRank": 24,
         "totalCountriesNum": 145,
         "flagAssetName": "flagaustralia",
         "description": "Your country is among the most gender equal countries in the world. It ranks {{countryRank}}",
         "femaleGenderScaleVal": 45,
         "maleGenderScaleVal": 55,
         "topRankedCountries": [
          {
           "rank": 1,
           "countryName": "Iceland"
          },
          {
           "rank": 2,
           "countryName": "Finland"
          },
          {
           "rank": 3,
           "countryName": "Norway"
          },
          {
           "rank": 4,
           "countryName": "Sweden"
          },
          {
           "rank": 5,
           "countryName": "Denmark"
          },
          {
           "rank": 6,
           "countryName": "Nicaragua"
          },
          {
           "rank": 7,
           "countryName": "Rwanda"
          },
          {
           "rank": 8,
           "countryName": "Ireland"
          },
          {
           "rank": 9,
           "countryName": "Philippines"
          },
          {
           "rank": 10,
           "countryName": "Belgium"
          }
         ],
         "bottomRankedCountries": [
          {
           "rank": 145,
           "countryName": "Benin"
          },
          {
           "rank": 144,
           "countryName": "Gambia"
          },
          {
           "rank": 143,
           "countryName": "Cameroon"
          },
          {
           "rank": 142,
           "countryName": "Yemen"
          },
          {
           "rank": 141,
           "countryName": "Pakistan"
          },
          {
           "rank": 140,
           "countryName": "Chad"
          },
          {
           "rank": 139,
           "countryName": "Syria"
          },
          {
           "rank": 138,
           "countryName": "Mali"
          },
          {
           "rank": 137,
           "countryName": "Iran"
          },
          {
           "rank": 136,
           "countryName": "Ivory Coast"
          }
         ]
        }
    */
    var displayRankResults = function (rankData) {

        //set the femaleBar height
        $femaleBar.css('padding-bottom', (rankData.femaleGenderScaleVal * 2) + '%');

        //set the femaleBar height
        $maleBar.css('padding-bottom', (rankData.maleGenderScaleVal * 2) + '%');

        //set the src of the flag image
        $flag.attr('src', rankData.flagAssetPath + '.png');

        //set the rank description text
        $rankDescription.html(rankData.description.replace('{{countryRank}}', '<span>' + rankData.countryRank + '/' + rankData.totalCountriesNum + '</span>'));

        //set the top and bottom 10 countries
        var a;
        for (a = 0; a < 10; a++) {
            news.$('#ns_countryRankingCircleFigureTop' + (a + 1)).text(rankData.topRankedCountries[a].rank + '.');
            news.$('#ns_countryRankingCircleNameTop' + (a + 1)).text(rankData.topRankedCountries[a].countryName);

            news.$('#ns_countryRankingCircleFigureBottom' + (a + 1)).text(rankData.bottomRankedCountries[a].rank + '.');
            news.$('#ns_countryRankingCircleNameBottom' + (a + 1)).text(rankData.bottomRankedCountries[a].countryName);
        }

        /*
         * Show the view!
        */
        $sectionHolderEl.removeClass('ns_hideMe');
        news.$('#ns_risersAndFallersResultsHolder').removeClass('ns_hideMe');
        $seperatorLine.removeClass('ns_hideMe');

        /*
         * now the view is visible set the min height and init the animation
        */

        var $resultsBarHolder = news.$('.ns_countryRankResultsBarHolder'), rankBarsMaxHeight = (news.$($resultsBarHolder[0]).height() >= news.$($resultsBarHolder[1]).height()) ? news.$($resultsBarHolder[0]).height() : news.$($resultsBarHolder[1]).height();
        news.$('.ns_countryRankResultsBarsAndFlagHolder').css('min-height', rankBarsMaxHeight + 'px');

        $femaleBar.css('padding-bottom', 0);
        $maleBar.css('padding-bottom', 0);
        
        //animate the femaleBar height
        $femaleBar.stop(true, true).delay(1000).animate({paddingBottom:(rankData.femaleGenderScaleVal * 2) + '%'}, 600 * (rankData.femaleGenderScaleVal / rankData.maleGenderScaleVal));

        //animate the maleBar height
        $maleBar.stop(true, true).delay(1000).animate({paddingBottom:(rankData.maleGenderScaleVal * 2) + '%'}, 600, function () {
          news.$('.ns_countryRankResultsBarsAndFlagHolder').css('min-height', 0);
        });

    }

    var publicApi = {
        init: init
    };

    return publicApi;

});