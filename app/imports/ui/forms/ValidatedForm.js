"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _ValidatedForm = _interopRequireDefault(require("uniforms/ValidatedForm"));

var _BaseForm = _interopRequireDefault(require("./BaseForm"));

var Validated = function Validated(parent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_ValidatedForm$Valida) {
    (0, _inherits2.default)(_class, _ValidatedForm$Valida);

    function _class() {
      (0, _classCallCheck2.default)(this, _class);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
    }

    return _class;
  }(_ValidatedForm.default.Validated(parent)), _class.Validated = Validated, _temp;
};

var _default = Validated(_BaseForm.default);

exports.default = _default;