"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

require("core-js/modules/es6.function.name");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _BaseField2 = _interopRequireDefault(require("uniforms/BaseField"));

var _react = _interopRequireDefault(require("react"));

var _filterDOMProps = _interopRequireDefault(require("uniforms/filterDOMProps"));

var _nothing = _interopRequireDefault(require("uniforms/nothing"));

var HiddenField =
/*#__PURE__*/
function (_BaseField) {
  (0, _inherits2.default)(HiddenField, _BaseField);

  function HiddenField() {
    var _this;

    (0, _classCallCheck2.default)(this, HiddenField);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(HiddenField).apply(this, arguments));
    _this.options = {
      ensureValue: true,
      overrideValue: true
    };
    return _this;
  }

  (0, _createClass2.default)(HiddenField, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref) {
      var valueDesired = _ref.value;

      if (valueDesired === undefined) {
        return;
      }

      var props = this.getFieldProps();

      if (props.value !== valueDesired) {
        props.onChange(valueDesired);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.getFieldProps();
      return props.noDOM ? _nothing.default : _react.default.createElement("input", (0, _extends2.default)({
        disabled: props.disabled,
        id: props.id,
        name: props.name,
        ref: props.inputRef,
        type: "hidden",
        value: props.value
      }, (0, _filterDOMProps.default)(props)));
    }
  }]);
  return HiddenField;
}(_BaseField2.default);

exports.default = HiddenField;
HiddenField.displayName = 'HiddenField';