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

var _AutoForm = _interopRequireDefault(require("uniforms/AutoForm"));

var _ValidatedQuickForm = _interopRequireDefault(require("./ValidatedQuickForm"));

var Auto = function Auto(parent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_AutoForm$Auto) {
    (0, _inherits2.default)(_class, _AutoForm$Auto);

    function _class() {
      (0, _classCallCheck2.default)(this, _class);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
    }

    return _class;
  }(_AutoForm.default.Auto(parent)), _class.Auto = Auto, _temp;
};

var _default = Auto(_ValidatedQuickForm.default);

exports.default = _default;
