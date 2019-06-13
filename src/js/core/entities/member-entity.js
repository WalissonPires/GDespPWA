App.Utils.Namespace.CreateIfNotExists('App.Entities').MemberUtils = {

    parseUserGuestId: function(userGuestId) {

        const splitedIds = userGuestId.split('-').map(x => parseInt(x));
        
        return {
            userId: isNaN(splitedIds[0]) ? null : splitedIds[0],
            guestId: isNaN(splitedIds[1]) ? null : splitedIds[1]
        }
    },

    createUserGuestId: function(userId, guestId) {

        return userId + '-' + guestId;
    }
};