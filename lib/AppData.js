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
    phases: [
      {
        name: "Phase 1",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "",
        weight: 1,
      },
      {
        name: "Phase 2",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "",
        weight: 2,
      },
      {
        name: "Phase 3",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "",
        weight: 3,
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
    phases: [
      {
        name: "Phase 1",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "",
        weight: 1,
      },
      {
        name: "Phase 2",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "",
        weight: 2,
      },
      {
        name: "Phase 3",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "",
        weight: 3,
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

export const GetRelatedCapitals = (capital) => {
  if (capital === 5000 || capital === 6000) {
    return [5000, 6000];
  }
  if (capital === 10000 || capital === 15000) {
    return [10000, 15000];
  }
  if (capital === 20000 || capital === 25000) {
    return [20000, 25000];
  }
  if (capital === 50000 || capital === 60000) {
    return [50000, 60000];
  }
  if (capital === 100000) {
    return [100000];
  }
  if (capital === 200000) {
    return [200000];
  }
  return [5000, 6000, 10000, 15000, 20000, 25000, 50000, 60000, 100000, 200000];
};

export const Payments = {
  userSplit: 0.15,
};
