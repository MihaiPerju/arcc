"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _QuickForm = _interopRequireDefault(require("uniforms/QuickForm"));

var _BaseForm = _interopRequireDefault(require("./BaseForm"));

var _AutoField = _interopRequireDefault(require("./AutoField"));

var _ErrorsField = _interopRequireDefault(require("./ErrorsField"));

var _SubmitField = _interopRequireDefault(require("./SubmitField"));

var Quick = function Quick(parent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_QuickForm$Quick) {
    (0, _inherits2.default)(_class, _QuickForm$Quick);

    function _class() {
      (0, _classCallCheck2.default)(this, _class);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
    }

    (0, _createClass2.default)(_class, [{
      key: "getAutoField",
      value: function getAutoField() {
        return _AutoField.default;
      }
    }, {
      key: "getErrorsField",
      value: function getErrorsField() {
        return _ErrorsField.default;
      }
    }, {
      key: "getSubmitField",
      value: function getSubmitField() {
        return _SubmitField.default;
      }
    }]);
    return _class;
  }(_QuickForm.default.Quick(parent)), _class.Quick = Quick, _temp;
};

var _default = Quick(_BaseForm.default);

exports.default = _default;