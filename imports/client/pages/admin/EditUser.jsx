import React, {Component} from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/users/queries/singleUser.js';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import {Button} from 'semantic-ui-react';
import {Container} from 'semantic-ui-react';
import {Divider} from 'semantic-ui-react';
import CreateEditTags from './components/CreateEditTags';
import SelectMulti from '/imports/client/lib/uniforms/SelectMulti.jsx';
import TagsService from './services/TagsService';
import TagsListQuery from '/imports/api/tags/queries/listTags.js';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import queryClients from '../../../api/clients/queries/listClients';

class EditUser extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            clients: []
        };
    }

    componentWillReceiveProps(newProps) {
        // if (!this.props.data && newProps.data) {
        //     this.setState({
        //         email: newProps.data.emails[0].address,
        //         firstName: newProps.data.profile.firstName,
        //         lastName: newProps.data.profile.lastName,
        //         phoneNumber: newProps.data.profile.phoneNumber
        //     });
        // }
    }

    componentWillMount() {
        queryClients.fetch((err, res) => {
            if(!err) {
                this.setState({clients: res})
            }
        })
    }

    onSubmit(formData) {
        const {user} = this.props;
        Meteor.call('admin.editUser', user._id, formData, (err) => {
            if (!err) {
                Notifier.success('Data saved !');
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    onChangeField(fieldName, value) {
        // const stateObj = {};
        // stateObj[fieldName] = value;
        //
        // this.setState(stateObj);
    }

    getTagList = () => {
        const {data} = this.props;

        return data.map((tag, key) => ({value: tag._id, label: TagsService.getTagName(tag)}));
    };

    closeEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    onEditUser = () => {
        const {form} = this.refs;
        form.submit();
    };

    render() {
        const {data, user} = this.props;
        const {clients} = this.state;
        user.email = user.emails[0].address;
        const tags = this.getTagList();


        return (
            <div className="create-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Edit User</button>
                    <div className="btn-group">
                        <button onClick={this.closeEdit} className="btn-cancel">Cancel</button>
                        <button onClick={this.onEditUser} className="btn--green">Confirm & save</button>
                    </div>
                </div>

                <div className="create-form__wrapper">
                    <div className="action-block">
                        <div className="header__block">
                            <div className="title-block text-uppercase">Client information</div>
                        </div>

                        <AutoForm model={user} schema={EditSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                            {this.state.error
                                ? <div className="error">{this.state.error}</div>
                                : ''
                            }

                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="First name" name="profile.firstName"/>
                                <ErrorField name="profile.firstName"/>
                            </div>

                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Last name" name="profile.lastName"/>
                                <ErrorField name="profile.lastName"/>
                            </div>

                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Email" name="email"/>
                                <ErrorField name="email"/>
                            </div>

                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Phone number" name="profile.phoneNumber"/>
                                <ErrorField name="profile.phoneNumber"/>
                            </div>
                            <div className="form-wrapper">
                                <SelectMulti labelHidden={true} placeholder="Tags" name="tagIds" options={tags}/>
                                <ErrorField name="tagIds"/>
                            </div>
                        </AutoForm>
                        <CreateEditTags user={user} clients={clients} tags={data}/>
                    </div>
                </div>
            </div>
        );
    }
}

const EditSchema = new SimpleSchema({
    'profile': {type: Object},
    'profile.firstName': {type: String},
    'profile.lastName': {type: String},
    'profile.phoneNumber': {type: String, optional: true},
    'email': {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    tagIds: {
        label: 'Tags',
        type: Array,
        optional: true
    },
    'tagIds.$': {
        type: String
    }
});

export default withQuery((props) => {
    return TagsListQuery.clone();
}, {reactive: true})(EditUser);