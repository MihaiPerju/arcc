import React, {Component} from 'react';
import classNames from 'classnames';

export default class PaginationBar extends Component {
    constructor() {
        super();
        this.state = {
            tooltip: false
        };
    }

    onNextPage(inc) {
        const {nextPage} = this.props;
        nextPage(inc);
    }

    showTooltip = () => {
        this.setState({
            tooltip: !this.state.tooltip
        })
    };

    closeTooltip = () => {
        this.setState({
            tooltip: false
        })
    };

    render() {
        const {tooltip} = this.state;
        const {create, module, total, range, buttonHidden} = this.props;
        const min = range && range.lowest ? range.lowest : 0;
        let max = range && range.highest ? range.highest : 0;
        if (total && total < max) {
            max = total;
        }
        const btnClasses = classNames({
            'toggle-form': true,
            'invisible': buttonHidden
        });

        return (
            <div className="pagination-bar">
                <div className="pagination-bar__wrapper">
                    <div
                        className="left__side text-dark-grey">{min} - {max}
                        <span className="text-light-grey"> of </span>
                        {total ? total : 0}
                    </div>
                    <div className="btn-group">
                        <button onClick={this.onNextPage.bind(this, -1)} className="btn-prev"><i
                            className="icon-angle-left"/></button>
                        <button onClick={this.onNextPage.bind(this, 1)} className="btn-next"><i
                            className="icon-angle-right"/></button>
                    </div>
                    <div className={btnClasses} onClick={create} onMouseEnter={this.showTooltip}
                         onMouseLeave={this.closeTooltip}>{!buttonHidden && '+'}
                    </div>
                    {tooltip && !buttonHidden && < Tooltip module={module}/>}
                </div>
            </div>
        )
    }
}

class Tooltip extends Component {
    render() {
        const {module} = this.props;
        return (
            <div className="tooltip">Add {module && module}</div>
        )
    }
}