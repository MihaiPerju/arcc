import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import {
  AutoForm,
  ErrorField,
  AutoField,
  SelectField
} from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import schema from "/imports/api/reasonCodes/schema";
import RolesEnum from "/imports/api/users/enums/roles.js";
import Loading from "/imports/client/lib/ui/Loading";

export default class ReasonCodesBlock extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      clients: [],
      schedule: false,
      blankSchedule: false
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getReasonCodes();
    this.pollingMethod = setInterval(() => {
      this.getReasonCodes();
    }, 3000);
  }

  getReasonCodes() {
    const { action } = this.props;
    let filters = {
      actionId: action._id,
      managerId: this.props.isPrivate ? Meteor.userId() : null
    };

    Meteor.call("reasonCodes.get", filters, (err, reasonCodes) => {
      if (!err) {
        this.setState({ reasonCodes });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  onAddReasonCode = () => {
    this.setState({
      blankSchedule: true
    });
  };

  close = () => {
    this.setState({
      blankSchedule: false
    });
  };

  onDeleteReasonCode = _id => {
    Meteor.call("reasonCode.delete", _id, err => {
      if (!err) {
        Notifier.success("Reason Code removed!");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  render() {
    const { action, isPrivate } = this.props;
    const { blankSchedule, reasonCodes } = this.state;

    if (!reasonCodes) {
      return <Loading />;
    }

    return (
      <div className="action-block reason-code-block">
        <div className="header__block">
          <div className="title-block text-uppercase">
            {isPrivate ? "Private Reason Codes" : "Global Reason Codes"}
          </div>
        </div>
        <div className="main__block">
          {((isPrivate &&
            Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) ||
            (!isPrivate &&
              !Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER))) && (
            <div className="add-content" onClick={this.onAddReasonCode}>
              <i className="icon-calendar-plus-o" />
              <div className="text-center">
                + Add {isPrivate && "Private"} Reason Code
              </div>
            </div>
          )}
          {blankSchedule && (
            <CreateReasonCode
              isPrivate={isPrivate}
              close={this.close}
              action={action}
            />
          )}

          <div className="code-list">
            {reasonCodes.map((reasonCode, index) => {
              return (
                <div key={index} className="code-item">
                  <div className="left__side">
                    <div className="info">
                      <div className="text-light-grey">Reason</div>
                      <div className="info-label">{reasonCode.reason}</div>
                    </div>
                    {isPrivate && (
                      <div className="info">
                        <div className="text-light-grey">Client</div>
                        <div className="info-label">
                          {reasonCode.client && reasonCode.client.clientName}
                        </div>
                      </div>
                    )}
                  </div>
                  {((isPrivate &&
                    Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) ||
                    (!isPrivate &&
                      !Roles.userIsInRole(
                        Meteor.userId(),
                        RolesEnum.MANAGER
                      ))) && (
                    <div className="btn-group-1">
                      <button
                        onClick={this.onDeleteReasonCode.bind(
                          this,
                          reasonCode._id
                        )}
                        className="btn-cancel"
                      >
                        <i className="icon-trash-o" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

class CreateReasonCode extends Component {
  constructor() {
    super();
    this.state = {
      clientOptions: [],
      isDisabled: false
    };
  }

  componentWillMount() {
    const clientOptions = [];
    Meteor.call("clients.getEssential", (err, res) => {
      if (!err) {
        res.map(client => {
          clientOptions.push({ label: client.clientName, value: client._id });
        });
        this.setState({ clientOptions });
      }
    });
  }

  onSubmit = data => {
    const { action, isPrivate } = this.props;
    data.actionId = action._id;
    data.managerId = isPrivate && Meteor.userId();
    this.setState({ isDisabled: true });

    Meteor.call("reasonCode.create", data, err => {
      if (!err) {
        Notifier.success("Reason Code created!");
        this.props.close();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  render() {
    const { close, isPrivate } = this.props;
    const { clientOptions, isDisabled } = this.state;
    return (
      <div className="new-section">
        <div className="text-label">
          Create {isPrivate && "Private"} Reason Code
        </div>
        <div className="reason-code-form">
          <AutoForm
            schema={!isPrivate ? schema : privateReasonSchema}
            onSubmit={this.onSubmit}
            ref="form"
          >
            <div className="form-wrapper">
              <AutoField
                labelHidden={true}
                placeholder="Reason"
                name="reason"
              />
              <ErrorField name="reason" />
            </div>
            {isPrivate && (
              <div className="select-form">
                <SelectField
                  labelHidden={true}
                  placeholder="Select Client"
                  name="clientId"
                  options={clientOptions}
                />
                <ErrorField name="clientId" />
              </div>
            )}

            <div className="btn-group">
              <button type="button" className="btn-cancel" onClick={close}>
                Cancel
              </button>
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                className="btn--green"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </AutoForm>
        </div>
      </div>
    );
  }
}

const privateReasonSchema = new SimpleSchema({
  reason: {
    type: String
  },
  clientId: {
    type: String
  }
});
