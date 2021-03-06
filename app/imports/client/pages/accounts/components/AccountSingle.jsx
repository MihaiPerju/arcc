import React, { Component } from "react";
import classNames from "classnames";
import moment from "moment/moment";
import commaNumber from "comma-number";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";
import { moduleNames } from "/imports/api/tags/enums/tags";
import isPast from 'date-fns/is_past';

export default class AccountSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontNormal: false,
      checked: false
    };
  }

  onCheck(e) {
    if(this.props.bulkAssign) {  e.stopPropagation(); return false; }  
    e.stopPropagation();
    const { checkAccount, account } = this.props;
    checkAccount(account);
  }

  onSelectAccount = () => {
    if(this.props.bulkAssign) { return false; }  
    const { selectAccount, account } = this.props;
    selectAccount(account);
  };

  onSubmitTags = data => {
    const { _id } = this.props.account;
    Object.assign(data, { _id });

    Meteor.call("account.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  onFreeze = e => {
    e.stopPropagation();
    const { _id } = this.props.account;
    Meteor.call("account.freeze", _id, err => {
      if (!err) {
        Notifier.success("Account Sent to be Processed!");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  render() {
    const { account, active, currentAccount, tags } = this.props;

    const classes = classNames("list-item", {
      "bg--yellow": active,
      "tickled-item": isPast(account.tickleDate),
      open: account._id === currentAccount
    });

    return (
      <div className={classes} onClick={this.onSelectAccount}>

        <div className="check-item">
          <input type="checkbox" checked={active} className="hidden" />
          <label onClick={this.onCheck.bind(this)} />
        </div>

        <div onClick={this.onFreeze} className="mark-task">
          <input type="checkbox" className="hidden" />
          <label />
        </div>

        <div className="row__item margin-top-10 ">

          <div className="left__side">
            <div
              className={
                this.state.fontNormal ? "person font-normal" : "person"
              }
            >
              {account.ptName}
            </div>
          </div>

          <div className="right__side">
            <div className="patient-id text-dark-grey">{account.acctNum}</div>
            <div className="substate">{account.substate}</div>
            <div className="time"> 
              {account && moment(account.createdAt).format(" hh:mm")}
            </div>
          </div>

        </div>

        <div className="row__item margin-top-10 ">
          <div className="location">
            {account.facility && account.facility.name}
          </div>
          <div className="price">{commaNumber(account.acctBal)}</div>
        </div>

        <div className="row__item margin-top-10">
          <TagItem
            title="Tag Account"
            tagIds={account.tagIds}
            tags={tags}
            onSubmitTags={this.onSubmitTags.bind(this)}
            entityName={moduleNames.ACCOUNT}
          />
        </div>
      </div>
    );
  }
}
