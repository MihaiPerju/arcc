import React, {Component} from 'react';
import PropTypes from 'prop-types';
import UserRoles from '/imports/api/users/enums/roles';
import {createContainer} from 'meteor/react-meteor-data';
import RolesEnum from '/imports/api/users/enums/roles';
import Menu from './Menu';

class LeftMenu extends Component {
	render() {
		const user = this.props.user;
		let routes = [
            {name: "/home", label: "Home"},
            {name: "/tasks", label: "Tasks"},
        ];

		if (user && user.roles && user.roles.includes(RolesEnum.ADMIN)) {
		    routes.push(
		        {name: "/admin/user/list", label: "User Management"},
		        {name: '/region/list', label: 'Regions'},
		        {name: "/letter-templates/list", label: "Letter templates"}
		    )
		}
		if (user && user.roles && user.roles.includes(RolesEnum.TECH)) {
		    routes.push(
		        {name: "/letter-templates/list", label: "Letter templates"}
		    )
		}

		const adminAndTechRoutes = [
		    {name: "/client/list", label: "Clients"},
		    {name: "/code/list", label: "CARC/RARC Codes"},
		    {name: "/reports/list", label: "Reports"},
		    {name: "/action/list", label: "Actions"}
		];

		const managerRoutes = [
		    {name: "/letter-templates/list", label: "Letter templates"},
		    {name: "/reports/list", label: "Reports"}
		];

		if (user && Roles.userIsInRole(user._id, [UserRoles.ADMIN, UserRoles.TECH])) {
		    routes = routes.concat(adminAndTechRoutes);
		}
		if (user && Roles.userIsInRole(user._id, [UserRoles.MANAGER])) {
		    routes = routes.concat(managerRoutes);
		}

		return (
			<div>
				{user &&
					<div className="left-menu">
						<Menu routes={[
							{ name: "tasks", label: "Tasks" , icon: 'tasks' },
							{ name: "review", label: "Review", icon: 'inbox' },
							{ name: "on-hold", label: "On Hold", icon: 'hand-paper-o' },
							{ name: "archived", label: "Archived", icon: 'archive' },
							{ name: "escalations", label: "Escalations", icon: 'info' },
							{ name: "tickles", label: "Tickles", icon: 'comments-o' },
							{ name: "unassigned", label: "Unassigned", icon: 'question-circle-o' },
							{ name: "clients", label: "Clients", icon: 'users' },
							{ name: "user-management", label: "User management", icon: 'user-circle-o' },
							{ name: "codes", label: "Codes", icon: 'code-fork' },
							{ name: "reports", label: "Reports", icon: 'file-text-o' },
							{ name: "regions", label: "Regions", icon: 'globe' },
							{ name: "templates", label: "Templates", icon: 'window-restore' },
							{ name: "actions", label: "Actions", icon: 'thumb-tack' },
							{ name: "logout", label: "Log out", icon: 'sign-out' }
						]}/>
					</div>
				}
			</div>
		)
	}
}

LeftMenu.propTypes = {
    user: React.PropTypes.object,
};
LeftMenu.defaultProps = {};

export default LeftMenuContainer = createContainer(() => {
    const user = Meteor.user();

    return {
        user,
    };
}, LeftMenu);