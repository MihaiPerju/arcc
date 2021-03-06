import Escalations from "../collection";
import RolesEnum from "/imports/api/users/enums/roles";
import NotificationService from "/imports/api/notifications/server/services/NotificationService";
import Accounts from "/imports/api/accounts/collection";
import Users from "/imports/api/users/collection";

Meteor.methods({
  "escalation.addMessage"(message, accountId) {
    const { authorId } = Escalations.findOne({ accountId });
    const { profile } = Users.findOne({ _id: this.userId });
    const userName = `${profile.firstName} ${profile.lastName}`;
    const createdAt = new Date();
    Object.assign(message, { userName, createdAt });

    const employeeToRespond = Roles.userIsInRole(this.userId, RolesEnum.MANAGER)
      ? authorId
      : RolesEnum.MANAGER;

    Escalations.update({ accountId }, { $push: { messages: message } });

    Accounts.update({ _id: accountId }, { $set: { employeeToRespond } });

    //If is a respond from manager, emit global notification for the user.
    if (employeeToRespond !== RolesEnum.MANAGER) {
      NotificationService.createGlobal(authorId);
    }

    NotificationService.createRespondToEscalation(authorId, accountId);
  },

  "escalation.get"(filters = {}) {
    return Escalations.findOne(filters, {
      fields: { open: 1, messages: 1 }
    });
  }
});
