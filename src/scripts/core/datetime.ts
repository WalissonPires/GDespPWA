
export class Datetime {

    static getMonthName (month: number) {

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

    static ptBrDateToLocaleISO (dataStr: string) {

        const regexDatePtBr = /(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s(\d{2}):(\d{2}):(\d{2}))?/;
        const match = regexDatePtBr.exec(dataStr);

        if (!match)
            return null;

        const day = match[1],
              month = match[2],
              year = match[3],
              hours = match[4],
              minutes = match[5],
              seconds = match[6];

        let dateIsoStr = `${year}-${month}-${day}`;
        if (hours) {
            const offset =  0 - (new Date().getTimezoneOffset() / 60);
            const offsetStr = `${offset > 0 ? '+' : ''}${(offset + '').padStart(2, '0')}:00`;
            dateIsoStr += `T${hours}:${minutes}:${seconds}${offsetStr}`;
        }
        
        return dateIsoStr;
    }
}