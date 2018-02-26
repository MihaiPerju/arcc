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
                    key={index}
                />
            )
        }, this)
        return (
            <div className={this.props.class}>
                {actionList}
            </div>
/*
                <Table striped>
                    <Table.Header>
                        <ActionHeadList sortBy={sortBy}
                                        isSortAscend={isSortAscend}
                                        handleHeaderClick={handleHeaderClick}/>
                    </Table.Header>
                    {
                        data.length
                            ?
                            <Table.Body>

                                {_.map(data, (action, idx) => {
                                    return <ActionSingle action={action} key={idx} reasonCodesManage={reasonCodesManage}/>;
                                })}
                            </Table.Body>
                            :
                            <Table.Body>
                                <NoDataFoundCell colSpan="100"/>
                            </Table.Body>
                    }
                        <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='100'>
                            <Button href='/action/create' floated='left' icon labelPosition='left' primary size='small'>
                                <Icon name='plus' /> Create
                            </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                        </Table.Footer>
                </Table>
*/
        );
    }
}
