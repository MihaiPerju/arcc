const States = {
  ACTIVE: "Active",
  ARCHIVED: "Archived",
  HOLD: "Hold",
  ESCALATED: "Escalated",
  REVIEW: "Review"
};

import {
  Substates
} from "./substates";

export const StatesSubstates = {
  [States.HOLD]: [
    Substates.PENDING_PAYMENT,
    Substates.AWAITING_PAYMENT,
    Substates.TOO_SOON_FOR_FOLLOW_UP,
    Substates.BILLED,
    Substates.APPEALED,
    Substates.HOSPITAL_REVIEW
  ],
  [States.ARCHIVED]: [
    Substates.SUCCESSFUL_COLLECTION,
    Substates.FAIL,
    Substates.PAID,
    Substates.REPORTED,
    Substates.SELF_RETURNED,
    Substates.MERGED,
    Substates.UNKNOWN
  ]
};

const StateList = [
  States.HOLD,
  States.ARCHIVED,
  States.ACTIVE,
  States.ESCALATED,
  States.REVIEW
];
const stateOptions = [{
    label: "Active",
    value: States.ACTIVE
  },
  {
    label: "Archive",
    value: States.ARCHIVED
  },
  {
    label: "Hold",
    value: States.HOLD
  },
  {
    label: "Escalated",
    value: States.ESCALATED
  },
  {
    label: "Review",
    value: States.REVIEW
  },
]

export {
  StateList,
  stateOptions
};

export default States;