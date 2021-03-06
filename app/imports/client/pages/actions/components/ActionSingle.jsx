import React, { Component } from "react";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";
import { moduleNames } from "/imports/api/tags/enums/tags";

export default class ActionSingle extends Component {
  constructor(props) {
    super(props);
  }

  onSetAction() {
    const { action, setAction } = this.props;
    setAction(action._id);
  }

  onSelectAction(e) {
    e.stopPropagation();
    const { action, selectAction } = this.props;
    selectAction(action._id);
  }

  manageCodes = () => {
    const { action, reasonCodesManage } = this.props;
    reasonCodesManage(action._id);
  };

  onSubmitTags = data => {
    const { _id } = this.props.action;
    Object.assign(data, { _id });

    Meteor.call("action.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  render() {
    const { action, actionsSelected, currentAction, tags } = this.props;
    const checked = actionsSelected.includes(action._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentAction === action._id
    });

    return (
      <div onClick={this.onSetAction.bind(this)} className={classes}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectAction.bind(this)} />
        </div>
        <div className="row__item margin-top-10">
          <div className="item-name">{action.title}</div>
        </div>
        <div className="row__item margin-top-10">
          <TagItem
            title="Tag Action"
            tagIds={action.tagIds}
            tags={tags}
            onSubmitTags={this.onSubmitTags.bind(this)}
            entityName={moduleNames.ACTIONS}
          />
        </div>
      </div>
    );
  }
}
