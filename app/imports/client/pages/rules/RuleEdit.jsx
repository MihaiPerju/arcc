import React from "react";
import RuleSchema from "/imports/api/rules/schemas/schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import RuleGenerator from "./components/RuleGenerator";
import clientsQuery from "/imports/api/clients/queries/clientsWithFacilites";
import { SelectField } from "/imports/ui/forms";

export default class RuleEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      clientOptions: []
    };
  }

  componentWillMount() {
    let clientOptions = [];
    clientsQuery.fetch((err, res) => {
      if (!err) {
        res.map(client => {
          clientOptions.push({ label: client.clientName, value: client._id });
        });
        this.setState({ clientOptions });
      }
    });
  }

  onSubmit(data) {
    Meteor.call("rule.update", data, err => {
      if (!err) {
        Notifier.success("Rule Updated");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onEditRule = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { rule } = this.props;
    const { clientOptions } = this.state;

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button onClick={this.onEditRule} className="btn--green">
              Confirm & save
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block i--block">
            <AutoForm
              model={rule}
              schema={RuleSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
            >
              <div className="form-wrapper">
                <AutoField labelHidden={true} placeholder="Name" name="name" />
                <ErrorField name="name" />
              </div>
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Description"
                  name="description"
                />
                <ErrorField name="description" />

                <div className="select-wrapper">
                  <div className="select-form">
                    <SelectField
                      labelHidden={true}
                      label="Select Client"
                      name="clientId"
                      options={clientOptions}
                    />
                  </div>
                </div>

                <RuleGenerator name="rule" />
                <ErrorField name="description" />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
