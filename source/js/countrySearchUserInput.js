define(['lib/news_special/bootstrap', 'mediator/countriesAutocompleteMediator'], function (news, CountriesAutocompleteMediator) {

    /* Constants */
    var INPUT_AUTOCOMPLETE = 'autocomplete';
    var INPUT_DROPDOWN = 'dropdown';

    /* Vars */
    var currentInputType;
    var autocompleteSelectedCountry;
    var dropdownSelectedCountry;
    var autocompleteSelected;
    var dropdownSelected;
    var countriesAutocomplete;
    var toggleInputIstats;

    /* Elements */
    var $autocompleteddInput;
    var $autocompleteEl;
    var $dropdownInput;
    var $userInputWrapperEl;
    var $submitButton;

    var init = function (countriesData) {
        /* Set defaults */
        currentInputType = INPUT_AUTOCOMPLETE;
        autocompleteSelectedCountry = null;
        dropdownSelectedCountry = null;
        autocompleteSelected = false;
        dropdownSelected = false;
        toggleInputIstats = false;

        /* Element selectors */
        $autocompleteInput = news.$('#country-search--text-input');
        $autocompleteEl = news.$('.country-search--autocomplete');
        $dropdownEl = news.$('.country-search--dropdown');
        $dropdownInput = news.$('.country-search--dropdown-input');
        $userInputWrapperEl = news.$('.country-search--inputs');
        $submitButton = news.$('.country-search--submit');

        /* Populate the inputs */
        populateInputs(countriesData);

        /* LISTENERS */
        news.$('.country-search--toggle').on('click', toggleInputMethod);
        $dropdownInput.on('change', dropdownInputChanged);
        $autocompleteInput.keypress(autocompleteInputKeypress);
        $submitButton.on('click', submit);

        $('input[type=radio][name=user-gender]').change(genderSelectionUpdate);
    };

    var populateInputs = function (countriesData) {

        //populate the dropdown
        var countryNamesArr = [];
        for (var countryKey in countriesData) {
            // countryNamesArr.push(countryKey);
            countryNamesArr.push({
                countryTranslated: countriesData[countryKey].countryNameTranslation,
                countryName: countryKey
            });
        }
        // countryNamesArr.sort();
        countryNamesArr.sort(function (a, b) {
            if ( a.countryTranslated < b.countryTranslated ) {
                return -1;
            }
            if ( a.countryTranslated > b.countryTranslated ) {
                return 1;
            }
            return 0;
        });


        var i, countriesLength = countryNamesArr.length;
        for (i = 0; i < countriesLength; i++) {
            var countryName = countryNamesArr[i].countryName;
            var countryObj = countriesData[countryName];
            var $countryOption = $('<option>' + countryNamesArr[i].countryTranslated + '</option>');
            $countryOption.data('country', countryObj);
            $dropdownInput.append($countryOption);
        }

        //populate/init the input
        countriesAutocomplete = new CountriesAutocompleteMediator($autocompleteInput, updateButtonState, countriesData);

    };

    var updateButtonState = function () {
        var disabled = true;
        if (currentInputType === INPUT_AUTOCOMPLETE && countriesAutocomplete.getSelectedCountry() !== null) {
            if ($('input[name=user-gender]:checked').length > 0) {
                disabled = false;
            }
        }
        if (currentInputType === INPUT_DROPDOWN && dropdownSelected === true) {
            if ($('input[name=user-gender]:checked').length > 0) {
                disabled = false;
            }
        }

        if (disabled) {
            $submitButton.addClass('disabled');
        } else {
            $submitButton.removeClass('disabled');
            // $submitButton.focus();
        }
    };

    var autocompleteInputKeypress = function (e) {
        var inputText = (e.target.value + String.fromCharCode(e.charCode)).toLowerCase();
        var $suggestionsHolder = news.$('.autocomplete-suggestions');
        var $autoCompletSuggestions = $suggestionsHolder.find('.autocomplete-suggestion');

        var keyCode = (window.event) ? e.which : e.keyCode;

        if (keyCode == 13 && !$submitButton.hasClass('disabled')) {
            //we've got a match and we've hit the enter key!
            if ($suggestionsHolder.css('display') == 'none') {
                $submitButton.trigger("click");
                $autocompleteInput.blur();
            }
            return;
        }

        if ($autoCompletSuggestions.length) {
            if (news.$($autoCompletSuggestions[0]).text().toLowerCase() == inputText) {
                if ($('input[name=user-gender]:checked').length > 0) {
                    $submitButton.removeClass('disabled');
                }
            }
            else {
                $submitButton.addClass('disabled');
            }
        }
    };

    var genderSelectionUpdate = function () {
        updateButtonState();
    };

    var dropdownInputChanged = function () {

        dropdownSelected = (news.$(this).val() !== 'default');
        dropdownSelectedCountry = news.$(this).find(':selected').data('country');
        updateButtonState();
    };

    var toggleInputMethod = function () {
        var $toCollapse = (currentInputType === INPUT_AUTOCOMPLETE) ? $autocompleteEl : $dropdownEl;
        var $toOpen = (currentInputType === INPUT_AUTOCOMPLETE) ? $dropdownEl : $autocompleteEl;

        /* Static height whilst animating */
        $userInputWrapperEl.css('height', $userInputWrapperEl.outerHeight());

        $toCollapse.slideUp(400, function showToOpen() {
            $toOpen.slideDown(400, function animationFinsihed() {
                $userInputWrapperEl.css('height', 'auto');
            });
        });

        currentInputType = (currentInputType === INPUT_AUTOCOMPLETE) ? INPUT_DROPDOWN : INPUT_AUTOCOMPLETE;
        updateButtonState();
        
        if (!toggleInputIstats) {
            news.pubsub.emit('istats', ['ns12522-change-to-dropdown', 'newsspec-interaction']);
            toggleInputIstats = false;
        }

        return false;
    };

    var getUserCountry = function () {
        return (currentInputType === INPUT_AUTOCOMPLETE) ? countriesAutocomplete.getSelectedCountry() : dropdownSelectedCountry;
    };

    var submit = function () {
        news.pubsub.emit('istats', ['ns12522-how-equal-am-I-btn-clicked', 'newsspec-interaction', currentInputType]);

        news.pubsub.emit('user-submitted-country', [getUserCountry(), (news.$('#ns_genderRadioBtnMale').is(':checked')) ? 'male' : 'female']);
    };

    var publicApi = {
        init: init,
        getUserCountry: getUserCountry,
        populateInputs: populateInputs
    };

    return publicApi;

});
