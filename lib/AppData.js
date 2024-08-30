export const Strategy = {
  maxRiskToRewardRatio: 1.1, // Πάντα μεγαλύτερο του ενός
  extraTakeProfitPoints: 4, // Δίνει παραπάνω take profit & Υπολογίζει μέχρι πόσο δέχομαι να χάσω πάνω από το stop loss
  secondTrade: false, // Αν βάζουμε δεύτερο trade γενικά
};

export const Companies = [
  {
    name: "FTMO",
    commissionFactor: 3,
    active: false,
    link: "https://ftmo.com/",
    maxCapital: 300000,
    maxAccounts: 3,
    phases: [
      {
        name: "Evaluation",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.03,
        instructions: "Pending...",
        weight: 1,
      },
      {
        name: "Verification",
        target: 0.05,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.03,
        instructions: "Pending...",
        weight: 2,
      },
      {
        name: "Funded",
        target: 0.02,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "Pending...",
        weight: 3,
      },
    ],
    accounts: [
      {
        capital: 25000,
        cost: 270,
      },
      {
        capital: 50000,
        cost: 370,
      },
      {
        capital: 100000,
        cost: 570,
      },
      {
        capital: 200000,
        cost: 1200,
      },
    ],
    waitingPurchaseInstructions: "Pending...",
    needUpgradeInstructions: "Pending...",
    waitingPayoutInstructions: "Pending...",
    payoutRequestDoneInstructions: "Pending...",
    moneySendedInstructions: "Pending...",
  },
  {
    name: "Funded Next",
    commissionFactor: 3,
    active: true,
    link: "https://fundednext.com/",
    maxCapital: 300000,
    maxAccounts: 3,
    phases: [
      {
        name: "Evaluation",
        target: 0.1,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.03,
        instructions: "Pending...",
        weight: 1,
      },
      {
        name: "Verification",
        target: 0.05,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.03,
        instructions: "Pending...",
        weight: 2,
      },
      {
        name: "Funded",
        target: 0.02,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "Pending...",
        weight: 3,
      },
    ],
    accounts: [
      {
        capital: 6000,
        cost: 49,
      },
      {
        capital: 15000,
        cost: 99,
      },
      {
        capital: 25000,
        cost: 199,
      },
      {
        capital: 50000,
        cost: 299,
      },
      {
        capital: 100000,
        cost: 549,
      },
      {
        capital: 200000,
        cost: 999,
      },
    ],
    waitingPurchaseInstructions: "Pending...",
    needUpgradeInstructions: "Pending...",
    waitingPayoutInstructions: "Pending...",
    payoutRequestDoneInstructions: "Pending...",
    moneySendedInstructions: "Pending...",
  },
  {
    name: "The5ers",
    commissionFactor: 3,
    active: true,
    link: "https://the5ers.com/",
    maxCapital: 300000,
    maxAccounts: 1,
    phases: [
      {
        name: "Step 1",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.03,
        instructions: "Pending...",
        weight: 1,
      },
      {
        name: "Step 2",
        target: 0.05,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.03,
        instructions: "Pending...",
        weight: 2,
      },
      {
        name: "Funded",
        target: 0.02,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "Pending...",
        weight: 3,
      },
    ],
    accounts: [
      {
        capital: 5000,
        cost: 39,
      },
      {
        capital: 20000,
        cost: 165,
      },
      {
        capital: 60000,
        cost: 300,
      },
      {
        capital: 100000,
        cost: 495,
      },
    ],
    waitingPurchaseInstructions: "Pending...",
    needUpgradeInstructions: "Pending...",
    waitingPayoutInstructions: "Pending...",
    payoutRequestDoneInstructions: "Pending...",
    moneySendedInstructions: "Pending...",
  },
  {
    name: "Funding Pips",
    commissionFactor: 3,
    active: true,
    link: "https://fundednext.com/",
    maxCapital: 300000,
    maxAccounts: 3,
    phases: [
      {
        name: "Evaluation",
        target: 0.08,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.03,
        instructions: "Χρειάζεται minimum 3 trading days και 8% κέρδος για να περάσει φάση 2. Αν δεν ξέρεις τι είναι οι 3 minimum trading days ρώτησε στο group.",
        weight: 1,
      },
      {
        name: "Verification",
        target: 0.05,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.03,
        instructions: "Pending...",
        weight: 2,
      },
      {
        name: "Funded",
        target: 0.02,
        dailyDrawdown: 0.05,
        maxDrawdown: 0.1,
        maxRiskPerTrade: 0.02,
        instructions: "Pending...",
        weight: 3,
      },
    ],
    accounts: [
      {
        capital: 5000,
        cost: 36,
      },
      {
        capital: 10000,
        cost: 66,
      },
      {
        capital: 25000,
        cost: 156,
      },
      {
        capital: 50000,
        cost: 266,
      },
      {
        capital: 100000,
        cost: 444,
      },
    ],
    waitingPurchaseInstructions: "Pending...",
    needUpgradeInstructions: "Pending...",
    waitingPayoutInstructions: "Pending...",
    payoutRequestDoneInstructions: "Pending...",
    moneySendedInstructions: "Pending...",
  },
];

export const Pairs = [
  {
    pair: "EURUSD",
    fastMode: {
      minimumPoints: 70,
      maximumPoints: 120,
    },
    slowMode: {
      minimumPoints: 120,
      maximumPoints: 170,
    },
    pointValue: 1,
    spread: 2,
  },
  {
    pair: "AUDUSD",
    fastMode: {
      minimumPoints: 70,
      maximumPoints: 120,
    },
    slowMode: {
      minimumPoints: 140,
      maximumPoints: 200,
    },
    pointValue: 1,
    spread: 4,
  },
  {
    pair: "GBPUSD",
    fastMode: {
      minimumPoints: 90,
      maximumPoints: 140,
    },
    slowMode: {
      minimumPoints: 140,
      maximumPoints: 200,
    },
    pointValue: 1,
    spread: 7,
  },
  {
    pair: "USDJPY",
    fastMode: {
      minimumPoints: 350,
      maximumPoints: 550,
    },
    slowMode: {
      minimumPoints: 500,
      maximumPoints: 750,
    },
    pointValue: 0.67,
    spread: 9,
  },
  {
    pair: "USDCAD",
    fastMode: {
      minimumPoints: 80,
      maximumPoints: 120,
    },
    slowMode: {
      minimumPoints: 120,
      maximumPoints: 160,
    },
    pointValue: 0.73,
    spread: 6,
  },
  {
    pair: "NZDUSD",
    fastMode: {
      minimumPoints: 70,
      maximumPoints: 110,
    },
    slowMode: {
      minimumPoints: 100,
      maximumPoints: 150,
    },
    pointValue: 1,
    spread: 6,
  },
  {
    pair: "AUDJPY",
    fastMode: {
      minimumPoints: 350,
      maximumPoints: 450,
    },
    slowMode: {
      minimumPoints: 450,
      maximumPoints: 600,
    },
    pointValue: 0.69,
    spread: 3,
  },
  {
    pair: "USDCHF",
    fastMode: {
      minimumPoints: 100,
      maximumPoints: 130,
    },
    slowMode: {
      minimumPoints: 180,
      maximumPoints: 250,
    },
    pointValue: 0.74,
    spread: 3,
  },
];

export const Schedule = {
  monday: {
    dateString: "12 August",
    active: true,
    mode: "fast", // slow or fast
    schedule: {
      startingHour: 4,
      endingHour: 20,
      pairs: ["EURUSD", "AUDUSD", "GBPUSD", "USDJPY", "USDCAD", "NZDUSD"],
    },
    note: "",
  },
  tuesday: {
    dateString: "27 August",
    active: true,
    mode: "fast",
    schedule: {
      startingHour: 4,
      endingHour: 10,
      pairs: ["EURUSD", "AUDUSD", "GBPUSD", "USDJPY", "USDCAD", "NZDUSD"],
    },
    note: "Πρέπει αν κλείσουμε τα trades 3:30 - 4:30 το απόγευμα αλλιώς θα καούν όλα τα accounts! Μην ξεχάσετε!",
  },
  wednesday: {
    dateString: "28 August",
    active: true,
    mode: "slow",
    schedule: {
      startingHour: 4,
      endingHour: 12,
      pairs: ["EURUSD", "AUDUSD", "GBPUSD", "USDJPY", "USDCAD", "NZDUSD"],
    },
    note: "Κλείνουμε κανονικά τα trades σήμερα, 7-8 το βράδυ. Χαλαρά.",
  },
  thursday: {
    dateString: "29 August",
    active: false,
    mode: "fast",
    schedule: {
      startingHour: 4,
      endingHour: 9,
      pairs: ["AUDUSD", "GBPUSD", "USDJPY", "USDCAD", "NZDUSD"],
    },
    note: "",
  },
  friday: {
    dateString: "30 August",
    active: true,
    mode: "fast",
    schedule: {
      startingHour: 4,
      endingHour: 9,
      pairs: ["AUDUSD", "AUDJPY", "USDCHF", "USDJPY", "USDCAD", "NZDUSD"],
    },
    note: "Πρέπει να κλείσουμε τα trades 2:00 με 3:00 το μεσημέρι αλλιώς θα καούν όλα τα accounts! Μην ξεχάσετε!",
  },
  saturday: {
    dateString: "",
    active: false,
    mode: "slow", // slow or fast
    schedule: {
      startingHour: 4,
      endingHour: 16,
      pairs: ["EURUSD", "AUDUSD", "GBPUSD", "USDJPY", "USDCAD", "NZDUSD"],
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

export const GetDayString = () => {
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const currentDate = new Date();
  const day = daysOfWeek[currentDate.getDay()];
  return day;
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

export const GetCurrentTime = () => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const now = new Date();
  const dayName = daysOfWeek[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${dayName}, ${day} ${month} ${year}, ${hours}:${minutes}`;
};
