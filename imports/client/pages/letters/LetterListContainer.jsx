import React from 'react';
import LetterList from './components/LetterList.jsx';
import Pager from '/imports/client/lib/Pager.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import LetterListQuery from '/imports/api/letters/queries/letterList.js';
import {Button, Container, Divider, Header} from 'semantic-ui-react';

export default class LetterListContainer extends Pager {
    constructor(props) {
        super(props);

        _.extend(this.state, {
            perPage: 10,
            filters: {},
        });

        this.query = LetterListQuery.clone({taskId: props.taskId});
        this.LetterListWrapper = createQueryContainer(this.query, LetterList, {
                reactive: false,
            },
        );
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const LetterListWrapper = this.LetterListWrapper;
        const {taskId} = this.props;

        return (
            <Container className="page-container">
                <Header as="h3" textAlign="center">Letter List</Header>

                <LetterListWrapper params={params}/>
                {this.getPaginator()}

                <Divider/>

                <Button primary fluid onClick={() => {
                    FlowRouter.go('letter.create', {taskId});
                }}>
                    Create
                </Button>

            </Container>
        );
    }
}