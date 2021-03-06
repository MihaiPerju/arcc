import React from "react";
import _ from "underscore";
import {
  AutoForm,
  AutoField,
  SelectField,
  ErrorField
} from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import AccountViewService from "/imports/client/pages/accounts/services/AccountViewService";
import { variablesEnum } from "/imports/api/letterTemplates/enums/variablesEnum";
import PdfAttachments from "./PdfAttachments";

export default class GenerateLetterTemplateInputs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schema: null
    };
    this.submit = _.debounce(this.onSubmit, 300);
  }

  componentWillMount() {
    const { account, onChange } = this.props;
    if (account.selectedAttachmentIds && account.selectedAttachmentIds.length) {
      // update
      account.selectedAttachmentIds.forEach(id => {
        this.onSelectAttachment(id);
      });
    } else {
      onChange(account);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { templateKeywords } = nextProps;
    this.setState({
      schema: this.generateSchema(templateKeywords ? templateKeywords : [])
    });
  }

  generateSchema(options) {
    let schema = {};
    schema["attachmentIds"] = {
      label: "Attachments",
      type: String,
      optional: true
    };

    if (!options || !options.length) {
      return new SimpleSchema(schema);
    }
    options.forEach(opt => {
      if (variablesEnum[opt]) {
        schema[variablesEnum[opt].field] = {
          type: String,
          optional: true
        };
      } else {
        schema[opt] = {
          type: String,
          optional: true
        };
      }
    });

    return new SimpleSchema(schema);
  }

  onSubmit = (field, value) => {
    let newState = {};
    newState[field] = value;
    this.props.onChange(newState);
  };

  getAttachmentOptions = enums => {
    return _.map(enums, (value) => {
      return { value: value._id, label: AccountViewService.getPdfName(value) };
    });
  };

  generateFields() {
    const { templateKeywords } = this.props;
    if (templateKeywords) {
      const fields = [];
 
      templateKeywords.forEach((keyword, index) => {
        if (variablesEnum[keyword]) {
          fields.push(
            <div key={index} className="form-group">
              <AutoField
                key={index}
                name={variablesEnum[keyword].field}
                placeholder={keyword}
              />
            </div>
          );
        } else {
          fields.push(
            <div key={index} className="form-group">
              <AutoField key={index} name={keyword} placeholder={keyword} />
            </div>
          );
        }
      });
      return fields;
    }
  }

  getAttachmentIndex = (attachments, attachmentId) => {
    for (let index in attachments) {
      if (attachments[index]._id === attachmentId) {
        //Got the index of selected attachment
        return index;
      }
    }
  };

  swapAttachment = (arrSource, arrDest, elementId) => {
    const index = this.getAttachmentIndex(arrSource, elementId);
    const newElement = arrSource[index];
    arrDest.push(newElement);
    arrSource.splice(index, 1);
    return { arrSource, arrDest };
  };

  onSelectAttachment = attachmentId => {
    const { selectedAttachments, pdfAttachments, onChange } = this.props;
    const { arrSource, arrDest } = this.swapAttachment(
      pdfAttachments,
      selectedAttachments,
      attachmentId
    );
    onChange({
      pdfAttachments: arrSource,
      selectedAttachments: arrDest
    });
  };

  onRemoveAttachment = attachmentId => {
    const { pdfAttachments, selectedAttachments, onChange } = this.props;
    const { arrSource, arrDest } = this.swapAttachment(
      selectedAttachments,
      pdfAttachments,
      attachmentId
    );
    onChange({
      selectedAttachments: arrSource,
      pdfAttachments: arrDest
    });
  };

  onOrderChange = selectedAttachments => {
    const { onChange } = this.props;
    onChange({
      selectedAttachments
    });
  };

  render() {
    const { schema } = this.state;
    const fields = this.generateFields();
    const { account } = this.props;
    const { pdfAttachments, selectedAttachments } = this.props;

    const attachmentOptions = this.getAttachmentOptions(pdfAttachments);

    return (
      <div>
        {schema && (
          <AutoForm
            autosave
            schema={schema}
            model={account}
            onChange={this.onSubmit}
          >
            <SelectField
              className="select-helper"
              name="attachmentIds"
              options={attachmentOptions}
              onChange={this.onSelectAttachment}
            />
            {selectedAttachments.length ? (
              <PdfAttachments
                onRemoveAttachment={this.onRemoveAttachment}
                onOrderChange={this.onOrderChange}
                attachments={selectedAttachments}
              />
            ) : (
              ""
            )}

            <ErrorField name="attachmentIds" />

            {fields}
          </AutoForm>
        )}
      </div>
    );
  }
}
