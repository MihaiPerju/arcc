import React, { Component } from "react";
import classNames from "classnames";

export default class TagSingle extends Component {
  constructor(props) {
    super(props);
  }

  onSetTag() {
    const { tag, setTag } = this.props;
    setTag(tag._id);
  }

  onSelectTag(e) {
    e.stopPropagation();
    const { tag, selectTag } = this.props;
    selectTag(tag._id);
  }

  renderTag(moduleName) {
    return (
      <div className="tag-item">
        {moduleName}
      </div>
    );
  }

  render() {
    const { tag, tagsSelected, currentTag } = this.props;
    const checked = tagsSelected.includes(tag._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentTag === tag._id
    });

    return (
      <div className={classes} onClick={this.onSetTag.bind(this)}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectTag.bind(this)} />
        </div>
        <div className="row__block align-center">
          <div className="menu__icon"><i className="icon-tags icon-color"></i></div>
          <div className="item-name">{tag.name}</div>
        </div>
      </div>
    );
  }
}
