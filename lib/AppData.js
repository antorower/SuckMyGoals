export const Strategy = {
  maxRiskToRewardRatio: 2,
  tradesRandomFactor: 0.8,
  extraTakeProfitPoints: 4,
  secondTrade: false,
};

export const Companies = [
  {
    name: "FTMO",
    commissionFactor: 3,
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
        instructions: "This is the first phase",
        weight: 1,
      },
      {
        name: "Phase 2",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "This is the second phase",
        weight: 2,
      },
      {
        name: "Phase 3",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "This is the third phase and you can open a trade to win money and payout themin order to spend them",
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
    commissionFactor: 3,
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
        instructions: "FP First Phase",
        weight: 1,
      },
      {
        name: "Phase 2",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "This is the FP Second Phase instructions and you can read them to know what's next",
        weight: 2,
      },
      {
        name: "Phase 3",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "FP Third Phase",
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
    pair: "EURUSD",
    slowMode: {
      minimumPoints: 120,
      maximumPoints: 180,
    },
    fastMode: {
      minimumPoints: 80,
      maximumPoints: 120,
    },
    pointValue: 0.6,
    spread: 3,
  },
  {
    pair: "GBPUSD",
    slowMode: {
      minimumPoints: 140,
      maximumPoints: 220,
    },
    fastMode: {
      minimumPoints: 190,
      maximumPoints: 250,
    },
    pointValue: 0.8,
    spread: 5,
  },
  {
    pair: "AUDUSD",
    slowMode: {
      minimumPoints: 250,
      maximumPoints: 470,
    },
    fastMode: {
      minimumPoints: 500,
      maximumPoints: 1000,
    },
    pointValue: 0.9,
    spread: 7,
  },
];

export const Schedule = {
  monday: {
    dateString: "",
    active: false,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 2,
      endingHour: 4,
      pairs: [],
    },
    note: "",
  },
  tuesday: {
    dateString: "",
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
    dateString: "",
    active: true,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 2,
      endingHour: 16,
      pairs: ["EURUSD", "GBPUSD"],
    },
    note: "You should close your trades until 14:00 today",
  },
  thursday: {
    dateString: "",
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
    dateString: "",
    active: true,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 2,
      endingHour: 4,
      pairs: [],
    },
    note: "",
  },
  saturday: {
    dateString: "",
    active: false,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 0,
      endingHour: 0,
      pairs: [],
    },
    note: "It's Saturday. Market is closed!",
  },
  sunday: {
    dateString: "",
    active: false,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 0,
      endingHour: 0,
      pairs: [],
    },
    note: "It's Saturday. Market is closed!",
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

export const GetDaySchedule = () => {
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const currentDate = new Date();
  const day = daysOfWeek[currentDate.getDay()];
  return Schedule[day];
};

export const Payments = {
  userSplit: 0.15,
};

export const ReviewSettings = {
  reviewIfMorePercentageLost: 0.002, // Δηλαδή δέχομαι να χάσω commission * lots + spread * lots + capital * 0.002;
};
