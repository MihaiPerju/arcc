import React, {Component} from "react";
import Badge from "/imports/client/lib/Badge";

export default class MenuItem extends Component {
    render() {
        const {className, href, icon, label, badge, active} = this.props;

        return (
            <li className={className}>
                {
                    <a className="" href={href} onClick={active}>
                        <div className="menu__icon">
                            <i className={"icon-" + icon}/>
                        </div>
                        <span className="menu__label">{label}</span>
                        {
                            badge ? <Badge num={badge}/> : null
                        }
                    </a>
                }
            </li>
        )
    }
}