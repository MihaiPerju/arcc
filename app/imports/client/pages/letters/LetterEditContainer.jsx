import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import LetterTemplatePreview from './components/LetterTemplatePreview';
import GenerateLetterTemplateInputs from './components/GenerateLetterTemplateInputs';
import accountAttachmentsQuery from '/imports/api/accounts/queries/accountAttachmentsList';
import AccountViewService from '/imports/client/pages/accounts/services/AccountViewService';
import {variablesEnum} from '/imports/api/letterTemplates/enums/variablesEnum';
import Loading from '/imports/client/lib/ui/Loading';

class LetterEditContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            letterTemplates: [],
            selectedTemplate: {},
            pdfAttachments: [],
            selectedAttachments: [],
            attachmentIds: [],
            keywordsValues: {}
        };
    }

    componentWillMount() {
        const {data, account, selectedLetter} = this.props;
        this.setState({letterTemplates: data});
        const {profile} = Meteor.user();
        _.extend(account, profile);

        const clonedAccount = _.clone(account);
        const {letterValues} = selectedLetter;
        Object.assign(clonedAccount, letterValues);
        this.updateState(clonedAccount);

        Meteor.call('letterTemplates.get', (err, letterTemplates) => {
            if (err) {
                return Notifier.error(
                    'Error while trying to get letter templates');
            }
            this.setState({letterTemplates});
        });

        accountAttachmentsQuery.clone({_id: this.props.taskId}).fetchOne((err, data) => {
            if (!err) {
                this.setState({
                    pdfAttachments: data.attachments,
                    loading: false
                });
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    getSelectOptions = (letterTemplates) => {
        let selectOptions = [];

        letterTemplates.forEach(template => {
            selectOptions.push({
                label: template.name,
                value: template.name,
                description: template.description,
                templateData: template,
            });
        });

        return selectOptions;
    };

    getAttachmentOptions = (enums) => {
        return _.map(enums, (value, key) => {
            return {value: value._id, label: AccountViewService.getPdfName(value)};
        });
    };

    onSubmit = (data) => {
        this.setState({
            selectedTemplate: data.letterTemplate.templateData,
            selectedAttachments: data.attachmentIds
        });
    };

    updateState = (data) => {
        this.setState(data);
        this.getKeywordsValues();
    };

    getKeywordsValues = () => {
        const {selectedTemplate} = this.props;
        const {keywords} = selectedTemplate;
        const keywordsValues = {};
        _.each(keywords, (value, index) => {
            if(variablesEnum[value]) {
                keywordsValues[variablesEnum[value].field] = this.state[variablesEnum[value].field];
            } else {
                keywordsValues[value] = this.state[value];
            }
        })
        this.setState({keywordsValues})
    }

    render() {
        const {account, selectedTemplate, reset, selectedLetter} = this.props;
        const {keywords, body, _id: letterId} = selectedTemplate;
        const {letterTemplates, pdfAttachments, selectedAttachments, attachmentIds, keywordsValues, loading} = this.state;
        const model = {letterTemplate: null};
        const options = this.getSelectOptions(letterTemplates);
        const attachmentOptions = this.getAttachmentOptions(pdfAttachments);

        const clonedAccount = _.clone(account);
        const {letterValues} = selectedLetter;
        Object.assign(clonedAccount, letterValues);
        
        if (loading) {
            return <Loading />
        }

        return (
            <div>
                <div className={JSON.stringify(selectedTemplate) !== "{}" && "letter-template"}>
                    <div className="left-col">
                        <GenerateLetterTemplateInputs
                            account={clonedAccount}
                            templateKeywords={keywords}
                            onChange={this.updateState}/>
                    </div>
                    <div className="right-col">
                        <LetterTemplatePreview
                            reset={reset}
                            taskId={account._id}
                            letterTemplateBody={body}
                            letterTemplateId={letterId}
                            parentState={this.state}
                            attachments={attachmentIds}
                            currentComponent='edit'
                            selectedLetter={selectedLetter}
                            keywordsValues={keywordsValues}
                            keywords={keywords} />
                    </div>
                </div>
            </div>
        );
    }
}

export default LetterEditContainer;