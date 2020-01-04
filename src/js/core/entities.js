export class Expense {
}
export class Category {
}
export class Origin {
}
export class Member {
}
export class DashboardData {
}
export function parseUserGuestId(userGuestId) {
    const splitedIds = userGuestId.split('-').map(x => parseInt(x));
    return {
        userId: isNaN(splitedIds[0]) ? null : splitedIds[0],
        guestId: isNaN(splitedIds[1]) ? null : splitedIds[1]
    };
}
export function createUserGuestId(userId, guestId) {
    return userId + '-' + guestId;
}
//# sourceMappingURL=entities.js.map