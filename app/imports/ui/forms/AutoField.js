"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.number.constructor");

require("core-js/modules/es6.function.name");

var _classCallCheck2 = _interopRequireDefault(
  require("@babel/runtime/helpers/classCallCheck")
);

var _createClass2 = _interopRequireDefault(
  require("@babel/runtime/helpers/createClass")
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require("@babel/runtime/helpers/possibleConstructorReturn")
);

var _getPrototypeOf2 = _interopRequireDefault(
  require("@babel/runtime/helpers/getPrototypeOf")
);

var _inherits2 = _interopRequireDefault(
  require("@babel/runtime/helpers/inherits")
);

var _BaseField2 = _interopRequireDefault(require("uniforms/BaseField"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _react = require("react");

var _NumField = _interopRequireDefault(require("./NumField"));

var _BoolField = _interopRequireDefault(require("./BoolField"));

var _DateField = _interopRequireDefault(require("./DateField"));

var _ListField = _interopRequireDefault(require("./ListField"));

var _NestField = _interopRequireDefault(require("./NestField"));

var _TextField = _interopRequireDefault(require("./TextField"));

var _RadioField = _interopRequireDefault(require("./RadioField"));

var _SelectField = _interopRequireDefault(require("./SelectField"));

var AutoField =
  /*#__PURE__*/
  (function(_BaseField) {
    (0, _inherits2.default)(AutoField, _BaseField);

    function AutoField() {
      (0, _classCallCheck2.default)(this, AutoField);
      return (0, _possibleConstructorReturn2.default)(
        this,
        (0, _getPrototypeOf2.default)(AutoField).apply(this, arguments)
      );
    }

    (0, _createClass2.default)(AutoField, [
      {
        key: "getChildContextName",
        value: function getChildContextName() {
          return this.context.uniforms.name;
        }
      },
      {
        key: "render",
        value: function render() {
          var props = this.getFieldProps(undefined, {
            ensureValue: false
          });
          if (props.component === undefined) {
            if (props.allowedValues) {
              if (props.checkboxes && props.fieldType !== Array) {
                props.component = _RadioField.default;
              } else {
                props.component = _SelectField.default;
              }
            } else {
              switch (props.fieldType) {
                case Date:
                  props.component = _DateField.default;
                  break;

                case Array:
                  props.component = _ListField.default;
                  break;

                case Number:
                  props.component = _NumField.default;
                  break;

                case Object:
                  props.component = _NestField.default;
                  break;

                case String:
                  props.component = _TextField.default;
                  break;

                case Boolean:
                  props.component = _BoolField.default;
                  break;
              }
              props.component.labelHidden = props.labelHidden;
              (0, _invariant.default)(
                props.component,
                "Unsupported field type: %s",
                props.fieldType.toString()
              );
            }
          }
          return (0, _react.createElement)(props.component, this.props);
        }
      }
    ]);
    return AutoField;
  })(_BaseField2.default);

exports.default = AutoField;
AutoField.displayName = "AutoField";
