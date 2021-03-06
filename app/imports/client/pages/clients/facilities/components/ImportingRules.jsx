import React from "react";
import {
  AutoForm,
  AutoField,
  ErrorField,
  RadioField,
  ListField,
  ListItemField,
  NestField
} from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import PropTypes from "prop-types";
import RulesService from "/imports/client/pages/clients/facilities/services/ImportingRulesService";
import Loading from "/imports/client/lib/ui/Loading";
import UploadItem from "./FacilityContent/UploadItem";
import InsuranceRules from "./InsuranceRules";
import classNames from "classnames";
import { roleGroups } from "/imports/api/users/enums/roles";

export default class ImportingRules extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      collapse: false,
      isDisabled: false
    };
  }

  componentWillMount() {
    const { model, rules } = this.props;
    const schema = RulesService.createSchema(
      rules,
      model && model[rules] && model[rules].hasHeader
    );
    this.setState({
      loading: false,
      schema
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.resetImportForm) {
      const { form } = this.refs;
      const { changeResetStatus } = this.props;
      form.reset();
      changeResetStatus();
    }
  }

  onSubmitImportingRules = importRules => {
    this.setState({ isDisabled: true });
    const { rules } = this.props;

    const facilityId = this.props.model._id;

    const newFacility = { _id: facilityId };
    newFacility[rules] = importRules;
    Meteor.call("facility.update", newFacility, err => {
      if (!err) {
        Notifier.success("Facility updated!");
        // this.props.updateFacility();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  onChange(field, value) {
    const { rules } = this.props;
    if (field === "hasHeader") {
      //Change schema
      const newSchema = RulesService.createSchema(rules, value);

      this.setState({ schema: newSchema });
    }
  }

  groupFields(fields) {
    const numInRow = 4;
    const numGroups = Math.round(fields.length / numInRow);
    let result = [];
    for (let i = 0; i < numGroups; i++) {
      const startIndex = i * numInRow;
      const finishIndex = Math.min((i + 1) * numInRow, fields.length);
      const groupOfFields = fields.slice(startIndex, finishIndex);
      result.push(groupOfFields);
    }
    return result;
  }

  toggleInsurances = () => {
    const { collapse } = this.state;

    this.setState({ collapse: !collapse });
  };

  showListField = () => {
    this.setState({ collapse: false });
  };

  onChangeModel = model => {
    const { rules, setTempRules } = this.props;
    if (rules === "placementRules") {
      setTempRules(model);
    }
  };

  getFileName(ruleType) {
    switch (ruleType) {
      case "placementRules":
        return "Placement";
      case "inventoryRules":
        return "Inventory";
      case "paymentRules":
        return "Payment";
    }
  }

  render() {
    const disabled = !Roles.userIsInRole(
      Meteor.userId(),
      roleGroups.ADMIN_TECH
    );
    const { schema, loading, collapse, isDisabled } = this.state;
    const { model, rules, copyRules } = this.props;
    const fields = RulesService.getSchemaFields(rules);
    const options = [
      { value: true, label: "True" },
      { value: false, label: "False" }
    ];

    const fieldGroups = this.groupFields(fields);
    const btnCollapseClasses = classNames({
      "btn-collapse": true,
      rotate: collapse
    });

    return (
      <div>
        {loading ? (
          <Loading />
        ) : (
          <AutoForm
            disabled={disabled}
            model={model && model[rules] ? model[rules] : {}}
            schema={schema}
            onChange={this.onChange.bind(this)}
            onSubmit={this.onSubmitImportingRules}
            onChangeModel={this.onChangeModel}
            ref="form"
          >
            <div className="form-wrapper">
              <div className="upload-section placement-header flex--helper flex-justify--space-between flex-align--center">
                <div className="radio-group flex--helper">
                  <label>File with header:</label>
                  <RadioField
                    className="radio-group__wrapper"
                    name="hasHeader"
                    options={options}
                    labelHidden={true}
                  />
                  <ErrorField name="hasHeader" />
                </div>

                {rules != "paymentRules" && (
                  <button
                    type="button"
                    className="btn--white"
                    onClick={copyRules}
                  >
                    {this.props.rules !== "placementRules"
                      ? "Copy Placement File Headers"
                      : "Copy Inventory File Headers"}
                  </button>
                )}
              </div>
            </div>

            <div className="upload-list">
              {fieldGroups &&
                fieldGroups.map((fields, index) => {
                  return <UploadItem fields={fields} key={index} />;
                })}
            </div>

            <div className="upload-list">
              {schema._schemaKeys.includes("insurances") ? (
                <div className="add-insurance__section">
                  <span
                    className={btnCollapseClasses}
                    onClick={this.toggleInsurances}
                  >
                    {collapse ? "show" : "hide"}
                  </span>
                  <InsuranceRules
                    collapse={collapse}
                    showListField={this.showListField}
                  />
                </div>
              ) : (
                <ListField name="newInsBal" showListField={this.showListField}>
                  <ListItemField name="$">
                    <NestField className="upload-item text-center">
                      <div>
                        <AutoField className="text-light-grey" name="insBal" />
                        <ErrorField name="insBal" />
                      </div>
                    </NestField>
                  </ListItemField>
                </ListField>
              )}
            </div>

            <div className="btn-group">
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
                  `Save ${this.getFileName(this.props.rules)} Mappings`
                )}
              </button>
            </div>
          </AutoForm>
        )}
      </div>
    );
  }
}

ImportingRules.propTypes = {
  model: PropTypes.object
};
