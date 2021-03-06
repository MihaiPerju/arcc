import connectField from "uniforms/connectField";
import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class DatePickerCustom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: props.value ? moment(props.value) : null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    if (value) {
      this.setState({
        startDate: moment(value)
      });
    }
  }

  handleChange = date => {
    if (date) {
      this.setState({
        startDate: date
      });
      this.props.onChange(date.toDate());
    }
  };

  render() {
    const { label, disabled } = this.props;
    return (
      <div>
        {label}
        <DatePicker
          showMonthDropdown
          showYearDropdown
          yearDropdownItemNumber={4}
          todayButton={"Today"}
          selected={this.state.startDate}
          onChange={this.handleChange}
          placeholderText={label}
          disabled={disabled?disabled:false}

        />
      </div>
    );
  }
}

export default connectField(DatePickerCustom, {});
