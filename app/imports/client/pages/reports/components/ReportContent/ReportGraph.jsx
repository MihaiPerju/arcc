import React from "react";
import SimpleSchema from "simpl-schema";
import ReactHighcharts from "react-highcharts";
import { EJSON } from "meteor/ejson";
import moment from "moment/moment";
import { AutoForm, SelectField } from "/imports/ui/forms";
import accountsQuery from "/imports/api/accounts/queries/accountList";
import reportGraphEnum, { graphTypeEnum } from "../../enums/reportGraph";

export default class ReportEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      accounts: [],
      graphName: "",
      xAxis: "",
      yAxis: "",
      graphType: ""
    };
  }

  componentWillMount() {
    this.getAccounts(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.getAccounts(newProps);
  }

  onSetGraph = () => {
    const { setGraph } = this.props;
    setGraph();
  };

  onSubmit = data => {
    const { xAxis, yAxis, graphType } = data;
    this.setState({
      xAxis,
      yAxis,
      graphType
    });
  };

  getAccounts(props) {
    const { report } = props;
    const filters = EJSON.parse(report.mongoFilters);
    const options = { limit: 20 };
    accountsQuery.clone({ filters, options }).fetch((err, accounts) => {
      if (!err) {
        this.setState({
          accounts,
          loading: false
        });
      } else {
        Notifier.error("Couldn't get sample accounts");
      }
    });
  }

  getGraphData = (xAxis, yAxis) => {
    const { accounts } = this.state;
    const { types } = reportGraphEnum;
    const graphData = [];
    accounts.map(value => {
      const data = [];
      if (types.dates.includes(xAxis)) {
        data.push(value[xAxis] ? +moment(value[xAxis]).format("YYYY") : null);
      }
      if (types.dates.includes(yAxis)) {
        data.push(value[yAxis] ? +moment(value[yAxis]).format("YYYY") : null);
      }
      if (types.strings.includes(xAxis)) {
        data.push(value[xAxis] ? +value[xAxis] : null);
      }
      if (types.strings.includes(yAxis)) {
        data.push(value[yAxis] ? +value[yAxis] : null);
      }
      if (types.numbers.includes(xAxis)) {
        data.push(value[xAxis] ? value[xAxis] : null);
      }
      if (types.numbers.includes(yAxis)) {
        data.push(value[yAxis] ? value[yAxis] : null);
      }
      graphData.push(data);
    });
    return graphData;
  };

  render() {
    const { xAxis, yAxis, graphType } = this.state;
    const graphData = this.getGraphData(xAxis, yAxis);
    const config = {
      chart: {
        type: graphType
      },
      title: {
        text: "Report Graph"
      },
      yAxis: {
        title: {
          text: yAxis
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",

          dataLabels: {
            enabled: true,
            formatter: function() {
              return this.y + " (" + Math.round(this.percentage) + "%)";
            }
          }
        }
      },
      series: [
        {
          name: "Report Data",
          data: graphData
        }
      ]
    };
    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button className="btn-cancel" onClick={this.onSetGraph.bind(this)}>
              Cancel
            </button>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <ReactHighcharts config={config} />
        </div>
        <AutoForm schema={graphSchema} onSubmit={this.onSubmit.bind(this)}>
          <div className="form-wrapper select-item">
            <SelectField
              placeholder="X-Axis"
              labelHidden={true}
              name="xAxis"
              options={reportGraphEnum.axisData}
            />
            <SelectField
              placeholder="Y-Axis"
              labelHidden={true}
              name="yAxis"
              options={reportGraphEnum.axisData}
            />
            <SelectField
              placeholder="Type of graph"
              labelHidden={true}
              name="graphType"
              options={graphTypeEnum}
            />
          </div>
          <div className="btn-group__footer flex--helper flex-justify--end">
            <button type="submit" className="btn--light-blue">
              Submit
            </button>
          </div>
        </AutoForm>
      </div>
    );
  }
}

const graphSchema = new SimpleSchema({
  xAxis: {
    type: String
  },
  yAxis: {
    type: String
  },
  graphType: {
    type: String
  }
});