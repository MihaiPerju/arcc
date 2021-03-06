import Accounts from "/imports/api/accounts/collection";
import RolesEnum from "/imports/api/users/enums/roles";

Meteor.publish("unassignedAccounts", () => {
  let unassignedCount = new Counter(
    "unassignedAccounts",
    Accounts.find({
      $and: [
        {
          assigneeId: null
        },
        {
          workQueueId: null
        }
      ]
    }),
    1000
  );
  return unassignedCount;
});

Meteor.publish("escalatedAccounts", userId => {
  let escalationsCount;
  if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {
    escalationsCount = new Counter(
      "escalatedAccounts",
      Accounts.find({
        employeeToRespond: RolesEnum.MANAGER
      }),
      1000
    );
  } else if (Roles.userIsInRole(userId, RolesEnum.REP)) {
    escalationsCount = new Counter(
      "escalatedAccounts",
      Accounts.find({
        employeeToRespond: userId
      }),
      1000
    );
  }

  return escalationsCount;
});

Meteor.publish("tickledAccounts", tickleUserId => {
  let ticklesCount = new Counter(
    "tickledAccounts",
    Accounts.find({
      tickleUserId,
      tickleDate: {
        $lte: new Date()
      }
    }),
    1000
  );

  return ticklesCount;
});

Meteor.publish("flaggedAccounts", flaggedUserId => {
  let flaggedCount = new Counter(
    "flaggedAccounts",
    Accounts.find({
      $and: [
        {
          flagCounter: {
            $gt: 0
          }
        },
        {
          managerIds: {
            $in: [flaggedUserId]
          }
        }
      ]
    })
  );
  return flaggedCount;
});
