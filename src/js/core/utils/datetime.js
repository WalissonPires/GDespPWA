(function(){

    var Datetime = function() {};

    Datetime.getMonthName = function (month) {

        switch(month) {
            case 1: return 'JAN';
            case 2: return 'FEV';
            case 3: return 'MAR';
            case 4: return 'ABR';
            case 5: return 'MAI';
            case 6: return 'JUN';
            case 7: return 'JUL';
            case 8: return 'AGO';
            case 9: return 'SET';
            case 10: return 'OUT';
            case 11: return 'NOV';
            case 12: return 'DEZ';
        }
    }

    App.Utils.Namespace.CreateIfNotExists('App.Utils').Datetime = Datetime;
})();