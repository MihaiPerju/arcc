import React, {Component} from 'react';

export default class ReportHeader extends Component {
    onEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    render() {
        const {code} = this.props;
        return (
            <div className="main-content__header header-block">
                <div className="row__header">
                    <div className="text-light-grey">Code name</div>
                    <div className="title">{code.code}</div>
                </div>
                <div className="row__header">
                    <div className="placement-block">
                        <div className="text-light-grey">Type</div>
                        <div className="label label--grey text-uppercase">{code.type}</div>
                    </div>
                    <div className="btn-group">
                        <button onClick={this.onEdit} className="btn--white">Edit
                            code
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}