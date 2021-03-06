import React from "react";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Notifier from "../../../../lib/Notifier";

export default class AccountEscalation extends React.Component {
  escalate = ({ reason }) => {
    const { accountId, closeRightPanel, escalationId } = this.props;
    if (!escalationId) {
      Meteor.call("account.escalate", { reason, accountId }, err => {
        if (!err) {
          Notifier.success("Account escalated!");
          this.closeDialog();
          closeRightPanel();
        } else {
          Notifier.error(err.reason);
        }
      });
    }
  };

  closeDialog = () => {
    const { close } = this.props;
    close();
  };

  render() {
    return (
      <AutoForm onSubmit={this.escalate} schema={escalateSchema}>
        <div className="form-wrapper">
          <AutoField
            labelHidden={true}
            placeholder="Type Escalation Reason"
            name="reason"
          />
          <ErrorField name="reason" />
        </div>
        <div className="btn-group">
          <button className="btn-cancel" onClick={this.closeDialog}>
            Cancel
          </button>
          <button type="submit" className="btn--light-blue">
            Confirm & send
          </button>
        </div>
      </AutoForm>
    );
  }
}

const escalateSchema = new SimpleSchema({
  reason: {
    type: String
  }
});
