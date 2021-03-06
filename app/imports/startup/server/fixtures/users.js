import {Accounts} from 'meteor/accounts-base';
import {Roles} from 'meteor/alanning:roles';
import faker from 'faker';
import UserRoles from '/imports/api/users/enums/roles';
import Counter from './config';

const createUser = (email, password, roles) => {
    const userId = Accounts.createUser({email, password});

    if (roles) {
        Roles.addUsersToRoles(userId, roles);
    }

    Meteor.users.update(userId, {
        $set: {
            profile: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                phoneNumber: faker.phone.phoneNumber()
            }
        }
    });

    return Meteor.users.findOne(userId);
};

Meteor.startup(function () {
    if (Meteor.users.find().count() > 0) {
        return true;
    }

    let userFixtures = [
        {
            name: 'tech',
            role: UserRoles.TECH
        },
        {
            name: 'rep',
            role: UserRoles.REP
        },
        {
            name: 'manager',
            role: UserRoles.MANAGER
        }
    ];

    createUser('admin@app.com', '12345', UserRoles.ADMIN);

    for (let user of userFixtures) {
        for (let i = 0; i < Counter.USERS; i++) {
            createUser(`${user.name}-${i + 1}@app.com`, '12345', user.role);
        }
    }

});