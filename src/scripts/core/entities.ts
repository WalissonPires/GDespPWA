export class Expense {
    id: string;
    description: string;
    createDate: string;
    dueDate: string;
    purchaseDate: string;
    paidDate: string;
    price: number;
    originId: number;                
    categoryId: number;
    totalInstallments: number;
    currentInstallment: number;    
    category?: Category;
    origin?: Origin;
    members?: Member[];
    tags?: string;
}

export class Category {
    id: number;
    name: string;
    color: string;
}

export class Origin {
    id: number;
    name: string;
}

export class Member {    
    id: number;
    userId: number;
    guestId: number;
    userGuestId: string;
    name: string;
    price: number;
}

export class DashboardData {
    date: string;
    name: string;
    photoUrl: string;
    value: number;
    color: string;
}


export function parseUserGuestId (userGuestId: string) {

    const splitedIds = userGuestId.split('-').map(x => parseInt(x));
    
    return {
        userId: isNaN(splitedIds[0]) ? null : splitedIds[0],
        guestId: isNaN(splitedIds[1]) ? null : splitedIds[1]
    }
}

export function createUserGuestId (userId: number, guestId: number) {

    return userId + '-' + guestId;
}