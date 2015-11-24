define(['lib/news_special/bootstrap'], function (news) {

    /*
     * Declare Variables
    */
    
    /*
     * Methods
    */
    var iCanHazCalc = function () {        
        var prop = 'width: ';
        var value = 'calc(10px);';
        var el = document.createElement('div');

        el.style.cssText = prop + value;

        return !!el.style.length;
    };

    var publicApi = {
        iCanHazCalc: iCanHazCalc
    };

    return publicApi;

});