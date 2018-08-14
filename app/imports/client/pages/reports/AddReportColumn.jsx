import React, { Component } from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import reportColumnEnum, {
  insuranceColumnEnum
} from "../../../api/reports/enums/reportColumn";
import schema from "/imports/api/reports/schemas/reportColumnSchema";
import {
  AutoForm,
  ListField,
  ListItemField,
  NestField,
  BoolField
} from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";

export default class AddReportColumn extends Component {
  constructor() {
    super();
    this.state = {
      accountSimpleColumn: [],
      insuranceColumn: [],
      reportColumnSchema: null
    };
  }

  componentWillMount() {
    this.setState({
      reportColumnSchema: schema
    });
  }

  closeDialog = () => {
    this.props.closeDialog();
  };

  confirm = () => {
    const { form } = this.refs;
    form.submit();
  };

  onSubmit = data => {
    const { closeDialog, report } = this.props;
    const { _id, name } = report;

    Meteor.call("report.updateColumns", _id, name, data, err => {
      if (!err) {
        closeDialog();
      } else {
        Notifier.error(err);
      }
    });
  };

  render() {
    const { report } = this.props;
    const { reportColumnSchema } = this.state;

    if (!reportColumnSchema) {
      return <div />;
    }

    return (
      <div>
        <Dialog
          title="Confirm"
          className="account-dialog"
          closePortal={this.closeDialog}
        >
          <div
            style={{ height: "350px", overflowY: "scroll" }}
            className="form-wrapper"
          >
            <AutoForm
              schema={reportColumnSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
              model={report.reportColumns}
            >
              {reportColumnEnum.map((cols, index) => {
                const { value, label } = cols;
                return (
                  <BoolField
                    key={`normal-${index}`}
                    name={value}
                    label={label}
                  />
                );
              })}
              <ListField name="insurances" showListField={() => {}}>
                <ListItemField name="$">
                  <NestField className="upload-item text-center">
                    {insuranceColumnEnum.map((data, index) => {
                      const { value, label } = data;
                      return (
                        <BoolField
                          key={`insurance-${index}`}
                          name={value}
                          label={label}
                        />
                      );
                    })}
                  </NestField>
                </ListItemField>
              </ListField>
            </AutoForm>
          </div>
          <div className="btn-group">
            <button className="btn-cancel" onClick={this.closeDialog}>
              Cancel
            </button>
            <button className="btn--light-blue" onClick={this.confirm}>
              Confirm & Add
            </button>
          </div>
        </Dialog>
      </div>
    );
  }
}
