export const Strategy = {
  maxRiskToRewardRatio: 2,
  tradesRandomFactor: 0.8,
  secondTrade: false,
};

export const Companies = [
  {
    name: "FTMO",
    active: true,
    link: String,
    maxCapital: 300000,
    maxAccounts: 3,
    phases: [
      {
        name: "Phase 1",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        note: "",
        action: "Upgrade", 
      },
      {
        name: "Phase 2",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        note: "",
        action: "Upgrade",
      },
      {
        name: "Phase 3",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        note: "",
        action: "Payment",
      },
    ],
    accounts: [
      {
        capital: 10000,
        cost: 99,
      },
      {
        capital: 10000,
        cost: 99,
      },
      {
        capital: 10000,
        cost: 99,
      },
    ],
    note: "",
  },
  {
    name: "Funding Pips",
    active: true,
    link: String,
    maxCapital: 300000,
    maxAccounts: 3,
    phases: [
      {
        name: "Phase 1",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        note: "",
        action: "Upgrade", 
      },
      {
        name: "Phase 2",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        note: "",
        action: "Upgrade",
      },
      {
        name: "Phase 3",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        note: "",
        action: "Payment",
      },
    ],
    accounts: [
      {
        capital: 10000,
        cost: 99,
      },
      {
        capital: 10000,
        cost: 99,
      },
      {
        capital: 10000,
        cost: 99,
      },
    ],
    note: "",
  }
];

export const Pairs = [
  {
    pair: "",
    slowMode: {
      minimumPoints: 1,
      maximumPoints: 2,
    },
    fastMode: {
      minimumPoints: 1,
      maximumPoints: 2,
    },
    pointValue: 0.6,
    spread: 1,
  },
  {
    pair: "",
    slowMode: {
      minimumPoints: 1,
      maximumPoints: 2,
    },
    fastMode: {
      minimumPoints: 1,
      maximumPoints: 2,
    },
    pointValue: 0.6,
    spread: 1,
  },
];

export const Schedule = {
  monday: {
    active: true,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 2,
      endingHour: 4,
      pairs: [],
    },
    note: "",
  },
  tuesday: {
    active: true,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 2,
      endingHour: 4,
      pairs: [],
    },
    note: "",
  },
  wednesday: {
    active: true,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 2,
      endingHour: 4,
      pairs: [],
    },
    note: "",
  },
  thursday: {
    active: true,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 2,
      endingHour: 4,
      pairs: [],
    },
    note: "",
  },
  friday: {
    active: true,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 2,
      endingHour: 4,
      pairs: [],
    },
    note: "",
  },
};
