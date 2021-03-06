import { chai } from "meteor/practicalmeteor:chai";
import RulesEngine from "../../../RulesEngine";

//An account object with all the fields
const account = {
  dischrgDate: "Thu Oct 03 2018 22:33:07 GMT+0100 (British Summer Time)",
  fbDate: "Thu Oct 03 2018 22:33:07 GMT+0100 (British Summer Time)",
  admitDate: "Thu Oct 03 2018 22:33:07 GMT+0100 (British Summer Time)",
  acctBal: 9,
  tickleDate: "Thu Oct 03 2018 22:33:07 GMT+0100 (British Summer Time)",
  medNo: 9
};

describe("Rules Engine", function() {
  it("Should Recognise  Less Operator on Discharge Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "dischrgDate",
            operator: "<",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Less Operator on Last Bill Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "fbDate",
            operator: "<",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Less Operator on Account Balance ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "acctBal",
            operator: "<",
            value: 10
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Less Operator on Admit Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "admitDate",
            operator: "<",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Less Operator on Tickle Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "tickleDate",
            operator: "<",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Less Operator on Medical Number ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "medNo",
            operator: "<",
            value: 10
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});
