import React, {Component} from 'react';
import Dialog from '/imports/client/lib/ui/Dialog';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import DatePicker from 'react-datepicker';
import fieldTypes from '/imports/api/accounts/config/accounts';
import Notifier from '/imports/client/lib/Notifier';
import moment from 'moment';

export default class EditInfoDialog extends Component {
  constructor () {
    super ();
    this.state = {
      dialogIsActive: false,
      selectedDate: null,
      isLoading: false,
      isEnabled: false,
    };
  }

  onSubmit = data => {
    const {accountId} = this.props;
    if ('ptName' in data) {
      data.ptName = data.ptName.replace (/,/g, ', ');
    }
    this.setState ({isLoading: true});
    Meteor.call ('account.update', accountId, data, err => {
      if (!err) {
        Notifier.success ('Account updated!');
        this.setState ({dialogIsActive: false, selectedDate: null});
      } else {
        Notifier.error (err.reason);
      }
      this.setState ({isLoading: false});
    });
  };

  onDateSelect = newDate => {
    this.setState ({selectedDate: moment (newDate), isEnabled: true});
  };

  openDialog = () => {
    this.setState ({
      dialogIsActive: true,
    });
  };

  closeDialog = () => {
    this.setState ({
      dialogIsActive: false,
    });
  };
  getSchema = editField => {
    return new SimpleSchema ({[editField]: {type: String}});
  };

  getEditForm = name => {
    const {editValue, editField} = this.props;
    const {selectedDate, isLoading, isEnabled} = this.state;

    const schema = this.getSchema (name);
    if (fieldTypes.dates.includes (name)) {
      return (
        <div className="edit-info__dialog-wrapper">
          <div className="input-datetime">
            <DatePicker
              calendarClassName="cc-datepicker"
              showMonthDropdown
              showYearDropdown
              yearDropdownItemNumber={4}
              todayButton={'Today'}
              placeholderText="Select New Date"
              onChange={this.onDateSelect}
              selected={selectedDate ? selectedDate : null}
              fixedHeight
            />
          </div>
          {isEnabled &&
            <div className="btn-group__footer flex--helper flex-justify--end">
              <button
                onClick={this.onSubmit.bind (this, {
                  [editField]: selectedDate && selectedDate.toDate (),
                })}
                type="submit"
                className="btn--light-blue"
                style={isLoading ? {cursor: 'not-allowed'} : {}}
                disabled={isLoading}
              >
                {isLoading
                  ? <div> Loading<i className="icon-cog" /></div>
                  : 'Submit'}
              </button>
            </div>}

        </div>
      );
    } else if (fieldTypes.others.includes (name)) {
      if (typeof editValue === 'object') {
        return (
          <div className="edit-info__dialog-wrapper">
            <div className="input-datetime">
              <DatePicker
                calendarClassName="cc-datepicker"
                placeholderText="Select New Date"
                onChange={this.onDateSelect}
                selected={selectedDate ? selectedDate : moment (editValue)}
                fixedHeight
              />
            </div>
            <div className="btn-group__footer flex--helper flex-justify--end">
              <button
                onClick={this.onSubmit.bind (this, {
                  [editField]: selectedDate && selectedDate.toDate (),
                })}
                type="submit"
                className="btn--light-blue"
                style={isLoading ? {cursor: 'not-allowed'} : {}}
                disabled={isLoading}
              >
                {isLoading
                  ? <div> Loading<i className="icon-cog" /></div>
                  : 'Submit'}
              </button>
            </div>
          </div>
        );
      }
    }
    return (
      <AutoForm
        onBlur={this.onBlur}
        model={{[name]: editValue}}
        schema={schema}
        onSubmit={this.onSubmit}
      >
        <div className="form-wrapper">
          <AutoField
            labelHidden={true}
            name={name}
            inputRef={x => {
              if (x) {
                x.focus ();
              }
            }}
          />
          <ErrorField name={name} />
          <div className="btn-group__footer flex--helper flex-justify--end">
            <button
              style={isLoading ? {cursor: 'not-allowed'} : {}}
              disabled={isLoading}
              type="submit"
              className="btn--light-blue"
            >
              {isLoading
                ? <div> Loading<i className="icon-cog" /></div>
                : 'Submit'}
            </button>
          </div>
        </div>
      </AutoForm>
    );
  };

  render () {
    const {dialogIsActive} = this.state;
    const {editField} = this.props;

    return (
      <button
        className="edit-info__btn"
        onClick={this.openDialog.bind (this, editField)}
      >
        <i className="icon-pencil" />
        {dialogIsActive &&
          editField &&
          <Dialog
            className="account-dialog edit-info__dialog"
            closePortal={this.closeDialog}
            title={'Edit info'}
          >
            <button className="close-dialog" onClick={this.closeDialog}>
              <i className="icon-close" />
            </button>
            {this.getEditForm (editField)}
          </Dialog>}
      </button>
    );
  }
}
