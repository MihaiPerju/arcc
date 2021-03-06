import React from "react";
import ClientSchema from "/imports/api/clients/schemas/schema";
import {
  AutoForm,
  AutoField,
  ErrorField,
  ListField,
  ListItemField,
  NestField,
  TextField,
  LongTextField
} from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import DropzoneComponent from "react-dropzone-component";
import { getToken } from "/imports/api/uploads/utils";
import { getImagePath } from "/imports/api/utils";

export default class EditClient extends React.Component {
  constructor() {
    super();

    this.state = {
      model: {},
      error: null,
      isDisabled: false
    };
  }

  onRemoveLogo() {
    const { client, setEdit } = this.props;

    Meteor.call("client.removeLogo", client._id, err => {
      if (!err) {
        Notifier.success("Logo removed!");
        setEdit();
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onSubmit = data => {
    const { client, setEdit } = this.props;
    this.setState({ isDisabled: true });

    Meteor.call("client.update", client._id, data, err => {
      if (!err) {
        Notifier.success("Data saved");
        setEdit();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  closeEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  onEditClient = () => {
    const { form } = this.refs;
    form.submit();
  };

  render() {
    const { client } = this.props;
    const { isDisabled } = this.state;

    const componentConfig = {
      postUrl: "/uploads/logo/" + client._id + "/" + getToken()
    };

    const djsConfig = {
      complete(file) {
        Notifier.success("Logo added");
        this.removeFile(file);
      },
      acceptedFiles: "image/*"
    };

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.closeEdit} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              onClick={this.onEditClient}
              disabled={isDisabled}
              className="btn--green"
            >
               {isDisabled?<div> Loading<i className="icon-cog"/></div>:"Confirm & Save"}
            </button>
          </div>
        </div>

        <div className="create-form__wrapper">
          <div className="action-block drop-file">
            <div className="header__block">
              <div className="title-block text-uppercase">
                Client information
              </div>
            </div>
			<div className="arcc-form-wrap">
            <AutoForm
              model={client}
              schema={ClientSchema}
              onSubmit={this.onSubmit}
              ref="form"
            >
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Client name"
                  name="clientName"
                />
                <ErrorField name="clientName" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Email"
                  name="email"
                />
                <ErrorField name="email" />
              </div>

              <div className="form-wrapper">
                <LongTextField
                  labelHidden={true}
                  placeholder="Financial goals"
                  name="financialGoals"
                />
                <ErrorField name="financialGoals" />
              </div>
              <div className="header__block m-t--20">
                <div className="title-block text-uppercase">Client Logo</div>
              </div>
              <div className="main__block">
                {client && client.logoPath ? (
                  <div>
                    <img src={getImagePath(client.logoPath)} />
                    <a href="" onClick={this.onRemoveLogo.bind(this)}>
                      Remove Logo
                    </a>
                  </div>
                ) : (
                  <div className="add-content">
                    <i className="icon-upload" />
                    <div className="drop-file__wrapper">
                      <DropzoneComponent
                        config={componentConfig}
                        djsConfig={djsConfig}
                      />
                    </div>
                  </div>
                )}
              </div>

              <ListField
                name="contacts"
                className="insurance-block"
                showListField={() => {}}
              >
                <ListItemField name="$">
                  <NestField name="">
                    <div className="form-wrapper">
                      <TextField
                        labelHidden={true}
                        placeholder="First Name"
                        name="firstName"
                      />
                      <ErrorField name="firstName" />
                    </div>
                    <div className="form-wrapper">
                      <TextField
                        labelHidden={true}
                        placeholder="Last Name"
                        name="lastName"
                      />
                      <ErrorField name="lastName" />
                    </div>
                    <div className="select-group b-b--0 p-b--0">
                      <div className="form-wrapper m-b--0">
                        <AutoField
                          labelHidden={true}
                          placeholder="Contact type"
                          name="contactType"
                        />
                        <ErrorField name="contactType" />
                      </div>
                    </div>
                    <div className="form-wrapper">
                      <TextField
                        labelHidden={true}
                        placeholder="Phone"
                        name="phone"
                      />
                      <ErrorField name="phone" />
                    </div>
                    <div className="form-wrapper">
                      <TextField
                        labelHidden={true}
                        placeholder="Email"
                        name="email"
                      />
                      <ErrorField name="email" />
                    </div>
                    <div className="form-wrapper">
                      <LongTextField
                        labelHidden={true}
                        placeholder="Notes"
                        name="notes"
                      />
                      <ErrorField name="notes" />
                    </div>
                  </NestField>
                </ListItemField>
              </ListField>
            </AutoForm>
			</div>
          </div>
        </div>
      </div>
    );
  }
}
