import SimpleSchema from "simpl-schema";
import ContactSchema from "./contactSchema";

export default new SimpleSchema({
  clientName: {
    type: String
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  logoPath: {
    type: String,
    optional: true
  },
  financialGoals: {
    type: String,
    optional: true
  },
  contacts: {
    type: Array,
    optional: true
  },
  "contacts.$": {
    type: ContactSchema
  },
  status: {
    type: Boolean,
    defaultValue: true
  },
  createdAt: {
    type: Date,
    defaultValue: new Date()
  },
  managerIds: {
    type: Array,
    optional: true
  },
  "managerIds.$": {
    type: String
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
