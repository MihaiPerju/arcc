import React, {Component} from 'react';
import {AutoForm, AutoField} from '/imports/ui/forms';
import SimpleSchema from "simpl-schema";
import FilterBar from '/imports/client/lib/FilterBar.jsx';

export default class SearchBar extends Component {
    constructor() {
        super();
        this.state = {
            active: false,
            filter: false
        };
    }

    manageFilterBar() {
        const {active, filter} = this.state;
        this.setState({
            active: !active,
            filter: !filter
        });
        this.props.changeFilters();
    }

    onHandleChange() {
        const {changeFilters} = this.props;
        const newFilters = this.refs.filters.state.modelSync;

        if (!newFilters.facilityId) {
            delete newFilters.facilityId;
        }
        if (!newFilters.assigneeId) {
            delete newFilters.assigneeId;
        }
        if (!newFilters.clientName && newFilters.clientName !== '') {
            delete newFilters.clientName;
            changeFilters(newFilters);
        } else {
            Meteor.call('client.getByName', newFilters.clientName, (err, clients) => {
                if (!err) {
                    let acctNums = [];
                    for (let client of clients) {
                        acctNums.push(client._id);
                    }
                    newFilters.acctNum = {$in: acctNums};
                    delete newFilters.clientName;
                    changeFilters(newFilters);
                }
            })
        }
    }

    render() {
        const {filter, active} = this.state;
        const {options, btnGroup} = this.props;
        return (
            <AutoForm ref="filters" onChange={this.onHandleChange.bind(this)} schema={schema}>
                <div className="search-bar">
                    <div className="select-type">
                        <div className="btn-select"></div>
                    </div>
                    {btnGroup ? <BtnGroup deleteAction={this.props.deleteAction}/> : null}
                    <div className={btnGroup ? "search-input" : "search-input full__width"}>
                        <div className="form-group">
                            <AutoField labelHidden={true} name="clientName" placeholder="Search"/>
                        </div>
                    </div>

                    <div className={active ? "filter-block active" : "filter-block"}
                         onClick={this.manageFilterBar.bind(this)}>
                        <button><i className="icon-filter"/></button>
                    </div>

                </div>
                {
                    filter && <FilterBar options={options}/>
                }
            </AutoForm>
        )
    }
}

class BtnGroup extends Component {
    constructor() {
        super();
        this.state = {
            in: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({in: true});
        }, 1);
    }


    deleteAction() {
        this.props.deleteAction();
    }

    render() {
        const {deleteAction} = this.props;
        return (
            <div className={this.state.in ? "btn-group in" : "btn-group"}>
                <button><i className="icon-archive"/></button>
                {
                    deleteAction &&
                    <button onClick={this.deleteAction.bind(this)}><i className="icon-trash-o"/></button>
                }
            </div>
        )
    }
}


const schema = new SimpleSchema({
    facilityId: {
        type: String,
        optional: true
    },
    assigneeId: {
        type: String,
        optional: true,
        label: 'Filter by assignee'
    },
    clientName: {
        type: String,
        optional: true,
        label: 'Search by patient name'
    }
});