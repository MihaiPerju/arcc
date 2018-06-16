import React, { Component } from "react";
import NewAction from "./NewAction";
import moment from "moment";

export default class ActionBlock extends Component {
  constructor() {
    super();
    this.state = {
      createAction: false
    };
  }

  newAction = () => {
    const { createAction } = this.state;
    this.setState({
      createAction: !createAction
    });
  };

  render() {
    const { account, closeRightPanel } = this.props;
    const actionsPerformed = account.actions;

    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">actions</div>
        </div>
        <div className="main__block">
          <div className="add-content" onClick={this.newAction}>
            <i className="icon-thumb-tack" />
            <div className="text-center">+ Add new action</div>
          </div>
          {this.state.createAction ? (
            <NewAction
              closeRightPanel={closeRightPanel}
              hide={this.newAction}
              account={account}
            />
          ) : null}
          <div className="action-list">
            {actionsPerformed &&
              actionsPerformed.map((actionPerformed, key) => (
                <div className="action-item" key={key}>
                  <div className="action-info">
                    <div className="info">
                      <div className="name">
                        {actionPerformed.user &&
                        <a href={`/${actionPerformed.user._id}/user-profile`}>{actionPerformed.user.profile.firstName +
                          " " +
                          actionPerformed.user.profile.lastName}
                          </a>}
                      </div>
                      <div className="text text-light-grey">
                        <b>{actionPerformed.reasonCode}</b>:
                        {actionPerformed.action && actionPerformed.action.title}
                      </div>
                    </div>
                    <div className="status archived">
                      {actionPerformed.action && actionPerformed.action.status}
                    </div>
                  </div>
                  <div className="action-time">
                    {moment(
                      actionPerformed && actionPerformed.createdAt
                    ).format("MMMM Do YYYY, hh:mm a")}
                  </div>
                  <div className="flag-item">
                    <input type="checkbox"id={key} className="hidden"/>
                    <label htmlFor={key}/>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}
