define(['lib/news_special/bootstrap', 'lib/vendors/autocomplete'], function (news) {
    var CountriesAutocompleteMediator = function ($inputElement, onCountryChange, countriesData) {
        this.$autocompleteInput = $inputElement;
        this.onCountryChange = onCountryChange;
        this.autocompleteSelectedCountry = null;
        this.istatsSent = false;
        this.$submitButton = news.$('.country-search--submit');

        this.countriesData = countriesData;
        
        this.setupAutocomplete();
        
    };

    CountriesAutocompleteMediator.prototype = {
        setupAutocomplete: function () {
            var countriesAutocomplete = this;

            this.$autocompleteInput.autocomplete({
                lookup: this.getAutocompleteData(),
                lookupLimit: 20,
                autoSelectFirst: true,
                onSelect: function (suggestion) {

                    if (suggestion.country !== countriesAutocomplete.autocompleteSelectedCountry) {
                        countriesAutocomplete.autocompleteSelectedCountry = suggestion.country;
                        if (countriesAutocomplete.onCountryChange) {
                            countriesAutocomplete.onCountryChange(suggestion.country);
                        }
                    }

                    if ($('input[name=user-gender]:checked').length > 0) {
                        countriesAutocomplete.$submitButton.removeClass('disabled');   
                    }
                    
                    if (!news.$('#country-search--text-input').is(':focus')) {
                        news.$('#country-search--text-input').focus();
                    }

                    // countriesAutocomplete.$submitButton.trigger("click");

                },
                lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                    if (suggestion.value.toLowerCase().indexOf(queryLowerCase) !== -1) {
                        return true;
                    }

                    countriesAutocomplete.logiStats();

                    if (suggestion.country.search_alternative) {
                        var a, arrLength = suggestion.country.search_alternative.length, returnedVal = false;
                        for (a = 0; a < arrLength; a++) {
                            if (suggestion.country.search_alternative[a].toLowerCase().indexOf(queryLowerCase) !== -1) {
                                returnedVal = (suggestion.country.search_alternative[a].toLowerCase().indexOf(queryLowerCase) !== -1);
                            }
                        }
                        return returnedVal;
                    }
                },
                onInvalidateSelection: function () {
                    countriesAutocomplete.autocompleteSelectedCountry = null;
                    if (countriesAutocomplete.onCountryChange) {
                        countriesAutocomplete.onCountryChange();
                    }
                }

            });
        },
        getAutocompleteData: function () {
            var autocompleteObject = [];
            for (countryKey in this.countriesData) {
                autocompleteObject.push({
                    // value: countryKey,
                    value: this.countriesData[countryKey].countryNameTranslation,
                    country: this.countriesData[countryKey]
                });
            }
            return autocompleteObject;
        },
        getSelectedCountry: function () {
            return this.autocompleteSelectedCountry;
        },
        logiStats: function () {
            if (this.istatsSent === false) {
                var searchType = (this.$autocompleteInput.selector === '#country-search--text-input') ? 'initial-search' : 'animate-table-search';
                news.pubsub.emit('istats', ['autocomplete-used', searchType]);

                this.istatsSent = true;
            }
        }
    };

    return CountriesAutocompleteMediator;
});
