import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  actionId: {
    type: String,
    optional: true
  },
  reasonCode: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    defaultValue: new Date()
  },
  systemAction: {
    type: Boolean,
    defaultValue: false
  },
  fileId: {
    type: String,
    optional: true
  },
  addedBy: {
    type: String,
    optional: true
  },
  customFields: {
    type: Object,
    optional: true,
    blackbox: true
  },
  type: {
    type: String
  },
  content: {
    type: String,
    optional: true
  },
  accountId: {
    type: String,
    optional: true
  },
  isFlagApproved: {
    type: Boolean,
    optional: true
  },
  isOpen: {
    type: Boolean,
    optional: true
  },
  managerId: {
    type: String,
    optional: true
  },
  flagActionId: {
    type: String,
    optional: true
  },
  flagReason: {
    type: String,
    optional: true
  },
  flagResponse: {
    type: String,
    optional: true
  },
  commentId: {
    type: String,
    optional: true
  },
  letterTemplateId: {
    type: String,
    optional: true
  },
  fileName: {
    type: String,
    optional: true
  },
  filetype: {
    type: String,
    optional: true
  },
  numberOfRecords: {
    type: Number,
    optional: true
  },
  correctComment: {
    type: Boolean,
    defaultValue: false
  },
  clientId: {
    type: String,
    optional: true
  },
  accountField: {
    type: String,
    optional: true
  },
  fieldPreviousValue: {
    type: String,
    optional: true
  },
  fieldUpdatedValue: {
    type: String,
    optional: true
  },
  newState: {
    type: String,
    optional: true
  },
  oldState: {
    type: String,
    optional: true
  }
});
