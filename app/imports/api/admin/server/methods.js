import Users from '/imports/api/users/collection.js';
import Security from '/imports/api/security/security.js';
import Settings from '/imports/api/settings/collection.js';

Meteor.methods({
    'admin.createUser'({firstName, lastName, email, phoneNumber, password}) {
        Security.checkAdmin(this.userId);
        
        return Accounts.createUser({
            email,
            password,
            profile: {firstName, lastName, phoneNumber}
        });
    },

    'admin.editUser'(userId, {email, profile, tagIds}) {
        Security.checkAdmin(this.userId);

        if (!userId) {
            throw new Meteor.Error('No user');
        }

        const existingUser = Users.findOne({
            'emails.address': email,
            _id: {
                $ne: userId
            }
        });

        if (existingUser) {
            throw new Meteor.Error('Email already in use!');
        }

        Users.update({_id: userId}, {
            $set: {
                emails: [{
                    address: email,
                    verified: false
                }],
                profile,
                tagIds
            }
        });
    },

    'admin.suspendUser'(userId) {
        Security.checkAdmin(this.userId);

        if (!userId) {
            throw new Meteor.Error('No user');
        }

        const settings = Settings.findOne();

        Settings.update({_id: settings._id}, {
            $addToSet: {
                suspendedUserIds: userId
            }
        });

        Users.update({_id: userId}, {
            $set: {
                'profile.suspended': true
            }
        });
    },

    'admin.resumeUser'(userId) {
        Security.checkAdmin(this.userId);

        if (!userId) {
            throw new Meteor.Error('No user');
        }

        const settings = Settings.findOne();

        Settings.update({_id: settings._id}, {
            $pull: {
                suspendedUserIds: userId
            }
        });

        Users.update({_id: userId}, {
            $set: {
                'profile.suspended': false
            }
        });
    },

    'admin.deleteUser'(userId) {
        Security.checkAdmin(this.userId);

        Users.remove({_id: userId});
    },

    'admin.deleteManyUsers'(userIds) {
        Security.checkAdmin(this.userId);

        _.each(userIds, (_id) => {
            Users.remove({_id});
        });
    }

});