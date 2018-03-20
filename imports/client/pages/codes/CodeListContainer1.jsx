import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/codes/queries/listCodes.js';
import CodeList from './components/CodeList.jsx';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import SearchInput from '/imports/client/lib/SearchInput.jsx';
import { Button } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';
import { Divider } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';
import CodeTypeFilter from './components/CodeTypeFilter.jsx';

export default class CodeListContainer extends Pager {
    constructor () {
        super();

        _.extend(this.state, {
            perPage: 20,
            filters: {},
            sortBy: 'none',
            isSortAscend: true
        });

        this.query = query.clone();
        this.CodeListCont = createQueryContainer(this.query, CodeList, {
            reactive: false
        });
    }

    handleSearch = (searchValue) => {
        let newFilters = this.state.filters.filters || {};
        newFilters.code = {
            '$regex': searchValue,
            '$options': 'i'
        };
        this.updateFilters({
            filters: newFilters
        });
    };

    handleFilter = (type) => {
        let newFilters = this.state.filters.filters || {};
        if (type == '') {
            delete newFilters.type;
        } else {
            newFilters.type = type;
        }
        this.updateFilters({
            filters: newFilters
        });
    };

    handleHeaderClick = (headerName) => {
        const {sortBy, isSortAscend} = this.state;
        if (sortBy === headerName) {
            this.setState({
                isSortAscend: !isSortAscend
            }, this.handleSort);
        } else {
            this.setState({
                sortBy: headerName,
                isSortAscend: true
            }, this.handleSort);
        }
    };

    handleSort = () => {
        const {sortBy, isSortAscend} = this.state;

        this.updateFilters({
            options: {
                sort: {
                    [sortBy]: isSortAscend ? 1 : -1
                }
            }
        });
    };

    render () {
        const params = _.extend({}, this.getPagerOptions());
        const CodeListCont = this.CodeListCont;
        const {sortBy, isSortAscend} = this.state;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Manage CARC/RARC Codes</Header>
                    <SearchInput handleSearch={this.handleSearch}/>
                    <CodeTypeFilter handleFilter={this.handleFilter}/>
                </div>
                <div className='m-t-30'>
                    {this.getPaginator()}
                    <CodeListCont params={params}
                                  sortBy={sortBy}
                                  isSortAscend={isSortAscend}
                                  handleHeaderClick={this.handleHeaderClick}/>
                    {this.getPaginator()}
                </div>
            </Container>
        );
    }
}