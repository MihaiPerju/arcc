import React, { Component } from "react";
import NewAction from "./NewAction";
import moment from "moment";
import Dialog from "/imports/client/lib/ui/Dialog";
import classNames from "classnames";
import SimpleSchema from "simpl-schema";
import { AutoForm, ErrorField, LongTextField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";

export default class ActionBlock extends Component {
  constructor() {
    super();
    this.state = {
      createAction: false,
      dialogIsActive: false,
      selectedActionId: null,
      selectedFlag: {},
      isFlagApproved: false
    };
  }

  newAction = () => {
    const { createAction } = this.state;
    this.setState({
      createAction: !createAction
    });
  };

  onOpenDialog = id => {
    const { flags } = this.props.account;
    let selectedFlag = {};
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      selectedFlag =
        flags.filter(flag => flag.flagActionId === id)[0].flag ||
        {};
    }
    this.setState({
      dialogIsActive: true,
      selectedActionId: id,
      selectedFlag,
      isFlagApproved: false
    });
  };

  onCloseDialog = () => {
    this.setState({
      dialogIsActive: false,
      selectedActionId: null,
      selectedFlag: {}
    });
  };

  onFlagAdd = data => {
    const { account } = this.props;
    const { selectedActionId } = this.state;
    const { _id, facilityId } = account;

    Object.assign(data, {
      actionId: selectedActionId,
      accountId: _id,
      facilityId
    });

    Meteor.call("action.createFlag", data, err => {
      if (!err) {
        Notifier.success("Flagged successfully");
      } else {
        Notifier.error(err.error);
      }
      this.onCloseDialog();
    });
  };

  isFlagChecked = actionId => {
    const { flags } = this.props.account;
    const index = flags && flags.flagActionId === actionId && flags.isOpen
    /*   const index = flags.findIndex(flag => {
        const { flagAction } = flag;
        return (
          flagAction && flagAction.actionId === actionId && flagAction.isOpen
        );
      }); */
    return index > -1 ? true : false;
  };

  isDisabledForReps = actionId => {
    const { flags } = this.props.account;
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.REP)) {
      const index = flags.flagActionId === actionId && flags.isOpen;
      /* const index = flags.findIndex(flag => {
        const { flagAction } = flag;
        return flagAction.actionId === actionId && flagAction.isOpen;
      }); */

      return index > -1 ? true : false;
    } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      const index = flags && flags.flagActionId === actionId && flags.isOpen;
      /* const index = flags.findIndex(flag => {
        const { flagAction } = flag;
        return (
          flagAction && flagAction.actionId === actionId && flagAction.isOpen
        );
      }); */
      return index === -1 ? true : false;
    }
  };

  onUnflag = data => {
    const { selectedFlag, isFlagApproved } = this.state;
    const { flagResponse } = data;
    const { closeRightPanel } = this.props;

    Meteor.call(
      "action.respondFlag",
      { _id: selectedFlag._id, flagResponse, isFlagApproved },
      err => {
        if (!err) {
          Notifier.success("Responded");
          closeRightPanel();
        } else {
          Notifier.error(err.error);
        }
        this.onCloseDialog();
      }
    );
  };

  handleFlagApproval = () => {
    const { isFlagApproved } = this.state;
    this.setState({ isFlagApproved: !isFlagApproved });
  };

  showFlags = actionId => {
    const { flags } = this.props.account;
    if (Roles.userIsInRole(Meteor.userId(), roleGroups.MANAGER_REP)) {
      const index = flags && flags.flagActionId === actionId && !flags.isOpen
      /* const index = flags.findIndex(flag => {
        const { flagAction } = flag;
        return (
          flagAction && flagAction.actionId === actionId && !flagAction.isOpen
        );
      }); */
      return index === -1 ? true : false;
    }
    return false;
  };

  getUserInfo(userId) {
    let userList = this.props.account.action_users;
    if (userList && userList.length > 0) {
      let actionUser = userList.filter(user => user._id === userId);
      if (actionUser && actionUser[0]) {
        return actionUser[0].profile.firstName + " " + actionUser[0].profile.lastName
      }
      return "";
    }
  }

  getAction(actionId) {
    let actionList = this.props.account.action_list;
    if (actionList && actionList.length > 0) {
      let actionTitle = actionList.filter(action => action._id === actionId);
      if (actionTitle && actionTitle[0]) {
        return actionTitle[0];
      }
      return "";
    }
  }

  render() {
    const { account, closeRightPanel, freezeAccount } = this.props;
    const actionsPerformed = account.actions;
    const { dialogIsActive, selectedFlag, isFlagApproved } = this.state;
    const dialogClasses = classNames("account-dialog");
    const userId = Meteor.userId();

    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">actions</div>
        </div>
        <div className="main__block">
          <div className="add-content" onClick={this.newAction}>
            <i className="icon-thumb-tack" />
            <div className="text-center">+ Add new action</div>
          </div>
          {this.state.createAction ? (
            <NewAction
              freezeAccount={freezeAccount}
              closeRightPanel={closeRightPanel}
              hide={this.newAction}
              account={account}
              bulkAssign={false}
              params={false}
              accountIds={false}
              bulkOption={false}
            />
          ) : null}
          <div className="action-list">
            {actionsPerformed &&
              actionsPerformed.sort(function(a, b){return b.createdAt - a.createdAt}).map((actionPerformed, key) => {
                const isRep = actionPerformed.userId
                  ? Roles.userIsInRole(actionPerformed.userId, RolesEnum.REP)
                  : false;
                return (
                  <div className="action-item" key={key}>
                    <div className="action-info">
                      <div className="info">
                        <div className="name">
                          {(isRep &&
                            Roles.userIsInRole(
                              userId,
                              roleGroups.ADMIN_TECH_MANAGER
                            )) ||
                            (isRep && userId === actionPerformed.userId)
                            ? actionPerformed.userId && (
                              <a
                                href={`/${actionPerformed.userId}/activity`}
                              >
                                {this.getUserInfo(actionPerformed.userId)}
                              </a>
                            )
                            : actionPerformed.userId &&
                            this.getUserInfo(actionPerformed.userId)}
                        </div>
                        <div className="text text-light-grey">
                          <b>{actionPerformed.reasonCode}</b>:
                          {actionPerformed.actionId &&
                            this.getAction(actionPerformed.actionId).title}
                        </div>
                      </div>
                      <div className="status archived">
                        {actionPerformed.actionId &&
                          this.getAction(actionPerformed.actionId).state}
                      </div>
                    </div>
                    <div className="action-time">
                      {moment(
                        actionPerformed && actionPerformed.createdAt
                      ).format("MMMM Do YYYY, hh:mm a")}
                    </div>
                    {this.showFlags(actionPerformed._id) && (
                      <div className="flag-item">
                        <input
                          checked={this.isFlagChecked(actionPerformed._id)}
                          disabled={this.isDisabledForReps(actionPerformed._id)}
                          onChange={() =>
                            this.onOpenDialog(actionPerformed._id)
                          }
                          type="checkbox"
                          id={`flag-action-${key}`}
                          className="hidden"
                        />
                        <label htmlFor={`flag-action-${key}`} />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          {dialogIsActive && (
            <Dialog
              className={dialogClasses}
              closePortal={this.onCloseDialog}
              title="Flag action"
            >
              {Roles.userIsInRole(userId, RolesEnum.REP) && (
                <AutoForm onSubmit={this.onFlagAdd} schema={flagSchema}>
                  <div className="form-wrapper">
                    <LongTextField
                      labelHidden={true}
                      placeholder="Type flag reason"
                      name="flagReason"
                    />
                    <ErrorField name="flagReason" />
                  </div>
                  <div className="btn-group">
                    <button className="btn-cancel" onClick={this.onCloseDialog}>
                      Cancel
                    </button>
                    <button type="submit" className="btn--light-blue">
                      Confirm & send
                    </button>
                  </div>
                </AutoForm>
              )}
              {Roles.userIsInRole(userId, RolesEnum.MANAGER) && (
                <AutoForm onSubmit={this.onUnflag} schema={unFlagSchema}>
                  <div className="form-wrapper">
                    <b>Flagging reason</b>
                    <div>{selectedFlag.flagReason}</div>
                  </div>
                  <div className="form-wrapper">
                    <LongTextField
                      labelHidden={true}
                      placeholder="Type to respond"
                      name="flagResponse"
                    />
                    <ErrorField name="flagResponse" />
                    <div className="check-group">
                      <input checked={isFlagApproved} type="checkbox" />
                      <label onClick={this.handleFlagApproval}>
                        Mark flag correct
                      </label>
                    </div>
                  </div>
                  <div className="btn-group">
                    <button className="btn-cancel" onClick={this.onCloseDialog}>
                      Cancel
                    </button>
                    <button type="submit" className="btn--light-blue">
                      Confirm & send
                    </button>
                  </div>
                </AutoForm>
              )}
            </Dialog>
          )}
        </div>
      </div>
    );
  }
}

const flagSchema = new SimpleSchema({
  flagReason: {
    type: String
  }
});

const unFlagSchema = new SimpleSchema({
  flagResponse: {
    type: String
  }
});
