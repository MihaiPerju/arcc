import React, {Component} from 'react';
import ActionSingle from './ActionSingle';

export default class ActionList extends Component {

    constructor() {
        super();
    }

    render() {
//        const {data, loading, error, handleHeaderClick, sortBy, isSortAscend, reasonCodesManage} = this.props;
        const {actions, setAction, selectAction, actionsSelected, currentAction} = this.props;
        const actionList = actions.map(function (action, index) {
            return (
                <ActionSingle
                    actionsSelected={actionsSelected}
                    currentAction={currentAction}
                    selectAction={selectAction}
                    setAction={setAction}
                    action={action}
                    key={action._id}
                />
            )
        }, this)
        return (
            <div className={this.props.class}>
                {actionList}
            </div>
        );
    }
}