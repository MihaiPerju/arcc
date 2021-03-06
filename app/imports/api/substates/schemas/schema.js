import SimpleSchema from "simpl-schema";
import { StateList } from "/imports/api/accounts/enums/states";

export default new SimpleSchema({
  name: {
    type: String
  },
  stateName: {
    type: String,
    allowedValues: StateList
  },
  description: {
    type: String,
    optional: true
  },
  actionIds: {
    type: Array,
    optional: true
  },
  "actionIds.$": {
    type: String
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  updatedBy: {
    type: Object,
    optional: true
  },
  "updatedBy.id": {
    type: String,
    optional: true
  },
  "updatedBy.name": {
    type: String,
    optional: true
  },
  status: {
    type: Boolean,
    defaultValue: true
  },
  tagIds: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "tagIds.$": {
    type: String
  }
});
