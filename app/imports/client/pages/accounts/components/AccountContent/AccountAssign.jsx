import React from "react";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import WorkQueueService from "../../services/WorkQueueService";
import Notifier from "../../../../lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";
import { moduleNames } from "/imports/api/tags/enums/tags";
import OptionsGenerator from "/imports/api/users/helpers/OptionsGenerator";

export default class AccountAssign extends React.Component {
  constructor() {
    super();
    this.state = {
      assignToUser: true,
      assignToWorkQueue: false,
      workQueueOptions: [],
      loadingWorkQueues: true,
      userOptions: [],
      isDisabled: false
    };
  }

  closeDialog = () => {
    const { close } = this.props;
    close();
  };

  showQueueForm = () => {
    this.setState({
      assignToUser: false,
      assignToWorkQueue: true
    });
  };

  showUserForm = () => {
    this.setState({
      assignToUser: true,
      assignToWorkQueue: false
    });
  };

  componentWillMount() {
    //Get the user options
    const { accountId } = this.props;

    Meteor.call("users.getRepsByFacility", accountId, (err, users) => {
      const userOptions = OptionsGenerator.getUserOptions(users);
      if (!err) {
        this.setState({ userOptions });
      } else {
        Notifier.error(err.reason);
      }
    });

    Meteor.call(
      "tags.get",
      {
        entities: { $in: [moduleNames.WORK_QUEUE] }
      },
      (err, res) => {
        if (!err) {
          const workQueueOptions = WorkQueueService.createOptions(res);
          this.setState({
            workQueueOptions,
            loadingWorkQueues: false
          });
        }
      }
    );
  }

  assignToUser = ({ assigneeId }) => {
    const { accountId, closeRightPanel } = this.props;
    let accountIds = [];
    accountIds.push(accountId);
    this.setState({ isDisabled: true });
    Meteor.call("account.assignUser.bulk", { accountIds, assigneeId }, err => {
      if (!err) {
        Notifier.success("Account assigned to user!");
        this.closeDialog();
        closeRightPanel();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  assignToWorkQueue = ({ workQueueId }) => {
    const { accountId, closeRightPanel } = this.props;
    let accountIds = [];
    accountIds.push(accountId);
    this.setState({ isDisabled: true });
    Meteor.call(
      "account.assignWorkQueue",
      { _id: accountId, workQueueId },
      err => {
        if (!err) {
          Notifier.success("Account assigned to Work Queue!");
          this.closeDialog();
          closeRightPanel();
        } else {
          Notifier.error(err.reason);
        }
        this.setState({ isDisabled: false });
      }
    );
  };

  render() {
    const {
      workQueueOptions,
      assignToUser,
      loadingWorkQueues,
      isDisabled,
      userOptions
    } = this.state;
    const { model } = this.props;

    if (loadingWorkQueues) {
      return <Loading />;
    }

    return (
      <div className="meta-dialog">
        <div className="check-block">
          <div className="check-group" onClick={this.showUserForm}>
            <input
              id="a1"
              type="radio"
              name="assign"
              value="user"
              defaultChecked={assignToUser}
            />
            <label htmlFor="a1">User</label>
          </div>
          <div className="check-group" onClick={this.showQueueForm}>
            <input id="a2" type="radio" name="assign" value="workQueueId" />
            <label htmlFor="a2">Work Queue</label>
          </div>
        </div>
        {assignToUser ? (
          <AutoForm
            model={model}
            schema={assignSchema}
            onSubmit={this.assignToUser}
          >
            <div className="form-wrapper select-item">
              <AutoField
                labelHidden={true}
                name="assigneeId"
                options={userOptions}
              />
              <ErrorField name="assigneeId" />
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                type="submit"
                className="btn--light-blue"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </AutoForm>
        ) : (
          <AutoForm
            model={model}
            schema={workQueueSchema}
            onSubmit={this.assignToWorkQueue}
          >
            <div className="form-wrapper select-item">
              <AutoField
                labelHidden={true}
                name="workQueueId"
                options={workQueueOptions}
              />
              <ErrorField name="workQueueId" />
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                type="submit"
                className="btn--light-blue"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </AutoForm>
        )}
      </div>
    );
  }
}

const assignSchema = new SimpleSchema({
  assigneeId: {
    type: String
  }
});

const workQueueSchema = new SimpleSchema({
  workQueueId: {
    type: String
  }
});
