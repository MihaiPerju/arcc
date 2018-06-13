import Tags from '../collection.js';
import Security from '/imports/api/security/security.js';
import Users from '/imports/api/users/collection.js';
import RolesEnum from '/imports/api/users/enums/roles';
import TagService from '/imports/api/tags/server/services/TagService';

Meteor.methods({
    'tag.create'(data) {
        if(Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
            return TagService.createTag(data);
        }
        
        throw new Meteor.Error('not-allowed', 'You do not have the correct roles for this!');
    },

    'tag.delete'(_id) {
        if(Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
            return Tags.remove({ _id });
        }
        throw new Meteor.Error('not-allowed', 'You do not have the correct roles for this!');
    },
    

    'tag.edit' (id, {client, name}) {
        if(Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
            return Tags.update({_id: id}, {
                $set: {
                    client,
                    name
                }
            });
        }
        throw new Meteor.Error('not-allowed', 'You do not have the correct roles for this!');
    },

    'tags.deleteMany' (Ids) {
        if(Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
            _.each(Ids, (_id) => {
                Tags.remove({_id});
            });
        } else {
            throw new Meteor.Error('not-allowed', 'You do not have the correct roles for this!');
        }
    },

    'user.addTag'({userIds, tagId}) {
        if(Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
            _.each(userIds, (_id) => {
                return TagService.addTagToUser({_id, tagId});
            })
        }
        throw new Meteor.Error('not-allowed', 'You do not have the correct roles for this!');
    },

    'user.removeTags'({userIds, tagId}) {
        if(Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
            _.each(userIds,  (_id) => {
                Users.update(
                    {_id},
                    {$pull: {tagIds: tagId}}
                )
            })
        } else {
            throw new Meteor.Error('not-allowed', 'You do not have the correct roles for this!'); 
        }
    }
});
