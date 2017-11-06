import React from 'react';
import usersQuery from '/imports/api/users/queries/listUsersByRole';
import UserRolesEnum from '/imports/api/users/enums/roles';
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import {ErrorField} from 'uniforms-unstyled';

export default class SelectUsersContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            users: []
        }
    }

    componentWillMount() {
        usersQuery.clone({
            filters: {
                roles: {
                    $in: [UserRolesEnum.MANAGER, UserRolesEnum.REP]
                }
            }
        }).fetch((err, users) => {
            if (!err) {
                this.setState({
                    users
                })
            }
        })
    }

    getUserOptions(users) {
        return _.map(users, ({profile, roles}) => {
            const value = `${profile.firstName} ${profile.lastName} (${roles[0]})`;
            return {value, label: value};
        })
    }

    render() {
        const users = this.getUserOptions(this.state.users);

        return (
            <div>
                <SelectMulti name="allowedUsers" options={users}/>
                <ErrorField name="allowedUsers"/>
            </div>
        )
    }
}