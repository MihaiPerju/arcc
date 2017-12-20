import React from 'react';
import {Segment, Button, Divider} from 'semantic-ui-react'
import ReportsService from '../../../../api/reports/services/ReportsService';
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import TaskReportFields from '../../../../api/tasks/config/tasks';

export default class FiltersSingle extends React.Component {
    constructor() {
        super();
    }

    deleteFilter(name) {
        this.props.deleteFilter(name);
    }

    getOptions() {
        const {name, assigneeIdOptions, facilityIdOptions} = this.props;
        return name === 'assigneeId' ? assigneeIdOptions : facilityIdOptions;
    }

    renderWidget(name, TaskReportFields) {
        if (ReportsService.isEnum(name, TaskReportFields)) {
            return <div>
                <AutoField name={name}/>
                <ErrorField name={name}/>
            </div>
        }
        if (ReportsService.isDate(name, TaskReportFields)) {
            return (
                <div>
                    <AutoField name={`${name}Start`}/>
                    <ErrorField name={`${name}Start`}/>

                    <AutoField name={`${name}End`}/>
                    <ErrorField name={`${name}End`}/>
                </div>
            )
        }

        if (ReportsService.isNumber(name, TaskReportFields)) {
            return (
                <div>
                    <AutoField name={`${name}Start`}/>
                    <ErrorField name={`${name}Start`}/>

                    <AutoField name={`${name}End`}/>
                    <ErrorField name={`${name}End`}/>
                </div>
            )
        }

        if (ReportsService.isLink(name, TaskReportFields)) {
            return (
                <div>
                    <SelectField name={name} options={this.getOptions(name)}/>
                </div>
            )
        }

        return (
            <div>
                <AutoField name={name}/>
                <ErrorField name={name}/>

                <AutoField name={`${name}Match`}/>
                <ErrorField name={`${name}Match`}/>
            </div>
        )
    }

    render() {
        const {name} = this.props;
        const transformedName = name && name.charAt(0).toUpperCase() + name.slice(1);
        return (
            <div>
                <Button onClick={this.deleteFilter.bind(this, name)}
                        attached='top'
                        color="red">
                    Delete
                </Button>
                <Segment attached>

                    {transformedName}

                    {
                        this.renderWidget(name, TaskReportFields)
                    }
                </Segment>
                <Divider/>
            </div>
        )
    }
}