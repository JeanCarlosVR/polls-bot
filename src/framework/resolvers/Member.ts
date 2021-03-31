export = (myCollection, search: any) => {
    search = search.toLowerCase();
    const idMatcher = /^([0-9]{15,21})$/;
    const userMentionMatcher = /<@!?([0-9]{15,21})>/;

    const userID = idMatcher.exec(search) || userMentionMatcher.exec(search);
    let Members = null;
    let _member = null;

    if (userID) {
        if(myCollection.get) {
            _member = myCollection.get(userID[1])
        } else {
            _member = myCollection.find(user => user.id === userID[1]);
        }
        return {
            type: 1,
            totalMatches: 1,
            member: _member,
            members: Members
        };
    } else {
        if(search.length > 5 && search.slice(-5, -4) === '#') {
            Members = myCollection.filter(user => (`${user.username}#${user.discriminator}`.toLowerCase()).includes(`${search}`));
        } else if(search.length === 4 && !isNaN(search)) {
            Members = myCollection.filter(user => `${user.discriminator}` === `${search}`);
        } else if(search.startsWith("#") && search.length === 4 && !isNaN(search.slice(1))) {
            Members = myCollection.filter(user => `${user.discriminator}` === `${search}`);
        } else {
            Members = myCollection.filter(user => `${user.username.toLowerCase()}`.includes(`${search}`) || `${user.username.toLowerCase()}`.startsWith(`${search}`));
        }

        return {
            type: 2,
            totalMatches: Members.length,
            member: _member,
            members: Members
        };
    }
}