export const Strategy = {
  maxRiskToRewardRatio: 1.2, // Πάντα μεγαλύτερο του ενός
  extraTakeProfitPoints: 4, // Δίνει παραπάνω take profit & Υπολογίζει μέχρι πόσο δέχομαι να χάσω πάνω από το stop loss
  secondTrade: false, // Αν βάζουμε δεύτερο trade γενικά
};

export const Companies = [
  {
    name: "FTMO",
    commissionFactor: 3,
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
    waitingPurchaseInstructions: "Await purchase instructions",
    needUpgradeInstructions: "Need Upgrade Instructions",
    waitingPayoutInstructions: "Waiting Payout Instructions",
    payoutRequestDoneInstructions: "Payout Request Done Instructions",
    moneySendedInstructions: "Money Sended Instructions",
  },
  {
    name: "Funding Pips",
    commissionFactor: 3,
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
    waitingPurchaseInstructions: "Await purchase instructions",
    needUpgradeInstructions: "Need Upgrade Instructions",
    waitingPayoutInstructions: "Waiting Payout Instructions",
    payoutRequestDoneInstructions: "Payout Request Done Instructions",
    moneySendedInstructions: "Money Sended Instructions",
  },
];

export const Pairs = [
  {
    pair: "EURUSD",
    slowMode: {
      minimumPoints: 110,
      maximumPoints: 175,
    },
    fastMode: {
      minimumPoints: 75,
      maximumPoints: 115,
    },
    pointValue: 1,
    spread: 3,
  },
];

export const Schedule = {
  monday: {
    dateString: "",
    active: true,
    mode: "fast", // slow or fast
    schedule: {
      startingHour: 2,
      endingHour: 23,
      pairs: ["EURUSD"],
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
    note: "It's Sunday. Market is closed!",
  },
};

export const Payments = {
  userSplit: 0.15,
};

export const ReviewSettings = {
  reviewIfMorePercentageLost: 0.002, // Δηλαδή δέχομαι να χάσω commission * lots + spread * lots + capital * 0.002;
};

export const GetRelatedCapitals = (capital) => {
  if (capital === 5000) {
    return [5000, 6000, 7500];
  }
  if (capital === 6000) {
    return [5000, 6000, 7500];
  }
  if (capital === 7500) {
    return [5000, 6000, 7500, 10000];
  }
  if (capital === 10000) {
    return [7500, 10000, 12500, 15000];
  }
  if (capital === 12500) {
    return [10000, 12500, 15000];
  }
  if (capital === 15000) {
    return [10000, 12500, 15000, 20000];
  }
  if (capital === 20000) {
    return [15000, 20000, 25000];
  }
  if (capital === 25000) {
    return [20000, 25000, 30000];
  }
  if (capital === 30000) {
    return [20000, 25000, 30000, 40000];
  }
  if (capital === 40000) {
    return [25000, 30000, 40000, 50000, 60000];
  }
  if (capital === 50000) {
    return [40000, 50000, 60000];
  }
  if (capital === 60000) {
    return [40000, 50000, 60000, 70000, 80000];
  }
  if (capital === 70000) {
    return [50000, 60000, 70000, 80000];
  }
  if (capital === 80000) {
    return [60000, 70000, 80000, 100000];
  }
  if (capital === 100000) {
    return [80000, 100000, 125000, 150000];
  }
  if (capital === 125000) {
    return [100000, 125000, 150000];
  }
  if (capital === 150000) {
    return [100000, 125000, 150000, 175000, 200000];
  }
  if (capital === 175000) {
    return [150000, 175000, 200000];
  }
  if (capital === 200000) {
    return [150000, 175000, 200000, 250000, 300000];
  }
  if (capital === 250000) {
    return [200000, 250000, 300000];
  }
  if (capital === 300000) {
    return [200000, 250000, 300000];
  }

  // Default case: return all possible capitals if input doesn't match any specific case
  return [5000, 6000, 7500, 10000, 12500, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 70000, 80000, 100000, 125000, 150000, 175000, 200000, 250000, 300000];
};

export const GetDaySchedule = () => {
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const currentDate = new Date();
  const day = daysOfWeek[currentDate.getDay()];
  return Schedule[day];
};

export const GetPairDetails = (pair) => {
  return Pairs.find((pairItem) => pairItem.pair === pair);
};

export const GetCompany = (company) => {
  return Companies.find((companyItem) => companyItem.name === company);
};

export const GetRandomFactor = () => {
  return Math.random() * 0.2 + 0.8;
};
