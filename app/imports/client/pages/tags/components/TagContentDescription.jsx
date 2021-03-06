import React, { Component } from "react";
import { AutoForm, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import TagContentSingle from "./TagContentSingle";
import Notifier from "/imports/client/lib/Notifier";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";

export default class TagContentDescription extends Component {
  constructor() {
    super();
    this.state = {
      selectedUser: [],
      selectAllChkBox: false,
      isDisabled: false
    };
  }

  getOptions = users => {
    return _.map(users, user => ({
      value: user._id,
      label: `${user.profile.firstName} ${user.profile.lastName}`
    }));
  };

  onSubmit = data => {
    const { userIds } = data;
    const { currentTag } = this.props;
    this.setState({ isDisabled: true });
    Meteor.call(
      "user.addTag",
      { userIds, tagId: currentTag._id },
      (err) => {
        if (!err) {
          Notifier.success("Successfully added !");
          this.refs.form.reset();
        } else {
          Notifier.success(err.reason);
        }
        this.setState({ isDisabled: false });
      }
    );
  };

  handleSelectAll = () => {
    const { taggedUsers } = this.props;
    let { selectAllChkBox } = this.state;
    let selectedUser = [];
    selectAllChkBox = false;
    if (!this.refs.selectAll.checked) {
      selectAllChkBox = true;
      selectedUser = taggedUsers.map(user => user._id);
    }
    this.setState({ selectedUser, selectAllChkBox });
  };

  toggleUser = userId => {
    const { selectedUser } = this.state;
    const index = selectedUser.indexOf(userId);
    if (index === -1) {
      selectedUser.push(userId);
    } else {
      selectedUser.splice(index, 1);
    }
    this.setState({ selectedUser });
  };

  removeTags = userIds => {
    const { currentTag } = this.props;
    this.refs.form.reset();
    if (userIds.length > 0) {
      Meteor.call(
        "user.removeTags",
        { userIds, tagId: currentTag._id },
        (err) => {
          if (!err) {
            Notifier.success("Removed successfully !");
            this.setState({ selectAllChkBox: false, selectedUser: [] });
          } else {
            Notifier.error(err.reason);
          }
        }
      );
    }
  };

  render() {
    const {  untaggedUsers, taggedUsers } = this.props;
    const options = this.getOptions(untaggedUsers);
    const { selectedUser, selectAllChkBox, isDisabled } = this.state;

    return (
      <div className="create-form">
        <div className="action-block i--block">
          <div className="header__block">
            <div className="title-block text-uppercase">Users</div>
          </div>
          <AutoForm
            schema={schema}
            onSubmit={this.onSubmit.bind(this)}
            ref="form"
          >
            <div className="select-group">
              <div className="form-wrapper">
                <SelectMulti
                  className="form-select__multi"
                  placeholder="Select Users"
                  labelHidden={true}
                  name="userIds"
                  options={options}
                />
                <ErrorField name="userIds" />
              </div>
            </div>
            <div className="btn-group-1 flex--helper flex-justify--end">
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
                  "Submit"
                )}
              </button>
            </div>
          </AutoForm>
        </div>

        <div className="select__row flex--helper flex-justify--space-between flex-align--center">
          <div className="check-item">
            <input
              id="selectAll"
              ref="selectAll"
              type="checkbox"
              className="hidden"
              checked={selectAllChkBox}
            />
            <label htmlFor="selectAll" onClick={this.handleSelectAll}>
              Select all
            </label>
          </div>
          <button
            onClick={() => this.removeTags(selectedUser)}
            className="btn-text--grey"
          >
            <i className="icon-trash-o" />
          </button>
        </div>

        <div className="action-table">
          <div className="action-table__wrapper">
            <div className="action-table__row flex--helper">
              <div className="action-table__header action-table__field text-light-grey">
                Name
              </div>
              <div className="action-table__header action-table__field text-center text-light-grey">
                Actions
              </div>
            </div>
            {taggedUsers.map((user, index) => (
              <TagContentSingle
                key={index}
                userName={`${user.profile.firstName} ${user.profile.lastName}`}
                userId={user._id}
                selectedUser={selectedUser}
                toggleUser={this.toggleUser}
                removeTags={this.removeTags}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  userIds: {
    type: Array
  },
  "userIds.$": {
    type: String
  }
});
