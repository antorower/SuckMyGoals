"use client";

import { useState, useMemo } from "react";

const accountOptions = {
  fundingPips: [
    { capital: 5000, price: 43 },
    { capital: 10000, price: 73 },
    { capital: 25000, price: 163 },
    { capital: 50000, price: 277 },
    { capital: 100000, price: 452 },
  ],
  fundedNext: [
    { capital: 6000, price: 63 },
    { capital: 15000, price: 123 },
    { capital: 25000, price: 204 },
    { capital: 50000, price: 304 },
    { capital: 100000, price: 565 },
  ],
  the5ers: [
    { capital: 5000, price: 43 },
    { capital: 20000, price: 170 },
    { capital: 60000, price: 310 },
    { capital: 100000, price: 565 },
  ],
  ftmo: [
    { capital: 10000, price: 97 },
    { capital: 25000, price: 275 },
    { capital: 50000, price: 375 },
    { capital: 100000, price: 585 },
  ],
};

function simulateAccount(company, capital) {
  let successRate1, successRate2, successRate3, profitPercentage;

  if (company === "FTMO") {
    successRate1 = 0.47;
    successRate2 = 0.63;
    successRate3 = 0.8;
    profitPercentage = 0.015;
  } else {
    successRate1 = 0.52;
    successRate2 = 0.63;
    successRate3 = 0.8;
    profitPercentage = 0.015;
  }

  const step1Success = Math.random() <= successRate1;
  if (!step1Success) return { profit: 0, steps: 1, payments: 0 };

  const step2Success = Math.random() <= successRate2;
  if (!step2Success) return { profit: 0, steps: 2, payments: 0 };

  let totalProfit = 0;
  let payments = 0;
  while (Math.random() <= successRate3) {
    totalProfit += capital * profitPercentage;
    payments++;
  }

  return { profit: totalProfit, steps: 3, payments };
}

export default function Simulator() {
  const [fundedNextAccount, setFundedNextAccount] = useState(accountOptions.fundedNext[0]);
  const [fundedNextQuantity, setFundedNextQuantity] = useState(0);

  const [ftmoAccount, setFtmoAccount] = useState(accountOptions.ftmo[0]);
  const [ftmoQuantity, setFtmoQuantity] = useState(0);

  const [the5ersAccount, setThe5ersAccount] = useState(accountOptions.the5ers[0]);
  const [the5ersQuantity, setThe5ersQuantity] = useState(0);

  const [fundingPipsAccount, setFundingPipsAccount] = useState(accountOptions.fundingPips[0]);
  const [fundingPipsQuantity, setFundingPipsQuantity] = useState(0);

  const [participants, setParticipants] = useState(1);
  const [simulationResults, setSimulationResults] = useState(null);
  const [bestSimulation, setBestSimulation] = useState(null);
  const [worstSimulation, setWorstSimulation] = useState(null);
  const [aggregateStats, setAggregateStats] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);

  const totalCost = useMemo(() => fundedNextAccount.price * fundedNextQuantity + ftmoAccount.price * ftmoQuantity + the5ersAccount.price * the5ersQuantity + fundingPipsAccount.price * fundingPipsQuantity, [fundedNextAccount, fundedNextQuantity, ftmoAccount, ftmoQuantity, the5ersAccount, the5ersQuantity, fundingPipsAccount, fundingPipsQuantity]);

  const totalCapital = useMemo(() => fundedNextAccount.capital * fundedNextQuantity + ftmoAccount.capital * ftmoQuantity + the5ersAccount.capital * the5ersQuantity + fundingPipsAccount.capital * fundingPipsQuantity, [fundedNextAccount, fundedNextQuantity, ftmoAccount, ftmoQuantity, the5ersAccount, the5ersQuantity, fundingPipsAccount, fundingPipsQuantity]);

  const totalAccounts = fundedNextQuantity + ftmoQuantity + the5ersQuantity + fundingPipsQuantity;

  const pricePerThousand = totalCapital > 0 ? (totalCost / totalCapital) * 1000 : 0;

  const costPerParticipant = participants > 0 ? totalCost / participants : 0;
  const accountsPerParticipant = participants > 0 ? totalAccounts / participants : 0;

  const runSingleSimulation = () => {
    let totalProfit = 0;
    let totalAccounts = 0;
    let passedStep1 = 0;
    let passedStep2 = 0;
    let totalPayments = 0;
    let companyResults = {
      "Funded Next": { totalCost: 0, totalProfit: 0, passedStep1: 0, passedStep2: 0, totalPayments: 0, totalAccounts: 0 },
      FTMO: { totalCost: 0, totalProfit: 0, passedStep1: 0, passedStep2: 0, totalPayments: 0, totalAccounts: 0 },
      The5ers: { totalCost: 0, totalProfit: 0, passedStep1: 0, passedStep2: 0, totalPayments: 0, totalAccounts: 0 },
      "Funding Pips": { totalCost: 0, totalProfit: 0, passedStep1: 0, passedStep2: 0, totalPayments: 0, totalAccounts: 0 },
    };

    const simulateForCompany = (company, account, quantity) => {
      companyResults[company].totalCost = account.price * quantity;
      companyResults[company].totalAccounts = quantity;
      for (let i = 0; i < quantity; i++) {
        totalAccounts++;
        const result = simulateAccount(company, account.capital);
        if (result.steps > 1) {
          passedStep1++;
          companyResults[company].passedStep1++;
        }
        if (result.steps > 2) {
          passedStep2++;
          companyResults[company].passedStep2++;
        }
        totalProfit += result.profit;
        companyResults[company].totalProfit += result.profit;
        totalPayments += result.payments;
        companyResults[company].totalPayments += result.payments;
      }
    };

    simulateForCompany("Funded Next", fundedNextAccount, fundedNextQuantity);
    simulateForCompany("FTMO", ftmoAccount, ftmoQuantity);
    simulateForCompany("The5ers", the5ersAccount, the5ersQuantity);
    simulateForCompany("Funding Pips", fundingPipsAccount, fundingPipsQuantity);

    const roi = totalProfit / totalCost;
    const profitPerParticipant = (totalProfit - totalCost) / participants;

    setCompanyStats(companyResults);

    return {
      totalProfit,
      totalAccounts,
      passedStep1,
      passedStep2,
      totalPayments,
      roi,
      profitPerParticipant,
    };
  };

  const runMultipleSimulations = () => {
    let best = null;
    let worst = null;
    let profitableCount = 0;
    let unprofitableCount = 0;

    for (let i = 0; i < 1000; i++) {
      const result = runSingleSimulation();
      if (!best || result.roi > best.roi) {
        best = result;
      }
      if (!worst || result.roi < worst.roi) {
        worst = result;
      }
      if (result.roi >= 1) {
        profitableCount++;
      } else {
        unprofitableCount++;
      }
    }

    setSimulationResults(runSingleSimulation());
    setBestSimulation(best);
    setWorstSimulation(worst);
    setAggregateStats({ profitableCount, unprofitableCount });
  };

  const formatNumber = (number) => {
    return number.toLocaleString("el-GR", { maximumFractionDigits: 2 });
  };

  const SimulationResultsDisplay = ({ title, results }) => {
    if (!results) return null;
    return (
      <div className="mt-6 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p>
          <span className="font-medium">Total Accounts: </span>
          {formatNumber(results.totalAccounts)}
        </p>
        <p>
          <span className="font-medium">Passed Step 1: </span>
          {formatNumber(results.passedStep1)} ({formatNumber((results.passedStep1 / results.totalAccounts) * 100)}%)
        </p>
        <p>
          <span className="font-medium">Passed Step 2: </span>
          {formatNumber(results.passedStep2)} ({formatNumber((results.passedStep2 / results.passedStep1) * 100)}% of Step 1)
        </p>
        <p>
          <span className="font-medium">Total Payments: </span>
          {formatNumber(results.totalPayments)} ({formatNumber((results.totalPayments / (results.totalAccounts * 3)) * 100)}%)
        </p>
        <p>
          <span className="font-medium">Total Profit: </span>${formatNumber(results.totalProfit)}
        </p>
        <p>
          <span className="font-medium">ROI: </span>
          {formatNumber(results.roi * 100)}%
        </p>
        <p>
          <span className="font-medium">Net Profit per Participant: </span>${formatNumber(results.profitPerParticipant)}
        </p>
      </div>
    );
  };

  const AggregateStatsDisplay = ({ stats }) => {
    if (!stats) return null;
    const totalSimulations = stats.profitableCount + stats.unprofitableCount;
    return (
      <div className="mt-6 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Aggregate Statistics (1.000 Simulations)</h2>
        <p>
          <span className="font-medium">Profitable Simulations (ROI ≥ 100%): </span>
          {formatNumber(stats.profitableCount)} ({formatNumber((stats.profitableCount / totalSimulations) * 100)}%)
        </p>
        <p>
          <span className="font-medium">Unprofitable Simulations (ROI &lt; 100%): </span>
          {formatNumber(stats.unprofitableCount)} ({formatNumber((stats.unprofitableCount / totalSimulations) * 100)}%)
        </p>
      </div>
    );
  };

  const CompanyStatsDisplay = ({ stats }) => {
    if (!stats) return null;
    return (
      <div className="mt-6 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Company Statistics</h2>
        {Object.entries(stats).map(([company, data]) => (
          <div key={company} className="mb-4">
            <h3 className="text-lg font-semibold">{company}</h3>
            <p>
              <span className="font-medium">Total Cost: </span>${formatNumber(data.totalCost)}
            </p>
            <p>
              <span className="font-medium">Total Profit: </span>${formatNumber(data.totalProfit)}
            </p>
            <p>
              <span className="font-medium">Total Accounts: </span>
              {formatNumber(data.totalAccounts)}
            </p>
            <p>
              <span className="font-medium">Passed Step 1: </span>
              {formatNumber(data.passedStep1)} ({formatNumber((data.passedStep1 / data.totalAccounts) * 100)}%)
            </p>
            <p>
              <span className="font-medium">Passed Step 2: </span>
              {formatNumber(data.passedStep2)} ({formatNumber((data.passedStep2 / data.passedStep1) * 100)}% of Step 1)
            </p>
            <p>
              <span className="font-medium">Total Payments: </span>
              {formatNumber(data.totalPayments)} ({formatNumber((data.totalPayments / (data.totalAccounts * 3)) * 100)}%)
            </p>
            <p>
              <span className="font-medium">ROI: </span>
              {formatNumber((data.totalProfit / data.totalCost) * 100)}%
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-8 bg-white text-black">
      <div className="mt-6 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Participant Information</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="participants" className="font-medium">
            Number of Participants
          </label>
          <input id="participants" type="number" value={participants} onChange={(e) => setParticipants(Math.max(1, Number(e.target.value)))} min="1" className="p-2 border rounded" />
          <div className="mt-2">
            <p>
              <span className="font-medium">Cost per Participant: </span>${formatNumber(costPerParticipant)}
            </p>
            <p>
              <span className="font-medium">Accounts per Participant: </span>
              {formatNumber(accountsPerParticipant)}
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-center">Prop Trading Companies Simulator</h1>
      <div className="text-center text-xl font-semibold">Total Cost: ${formatNumber(totalCost)}</div>
      <div className="text-center text-lg">Price per $1.000 capital: ${formatNumber(pricePerThousand)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CompanyInputs name="Funded Next" options={accountOptions.fundedNext} selectedAccount={fundedNextAccount} setSelectedAccount={setFundedNextAccount} quantity={fundedNextQuantity} setQuantity={setFundedNextQuantity} formatNumber={formatNumber} />
        <CompanyInputs name="FTMO" options={accountOptions.ftmo} selectedAccount={ftmoAccount} setSelectedAccount={setFtmoAccount} quantity={ftmoQuantity} setQuantity={setFtmoQuantity} formatNumber={formatNumber} />
        <CompanyInputs name="The5ers" options={accountOptions.the5ers} selectedAccount={the5ersAccount} setSelectedAccount={setThe5ersAccount} quantity={the5ersQuantity} setQuantity={setThe5ersQuantity} formatNumber={formatNumber} />
        <CompanyInputs name="Funding Pips" options={accountOptions.fundingPips} selectedAccount={fundingPipsAccount} setSelectedAccount={setFundingPipsAccount} quantity={fundingPipsQuantity} setQuantity={setFundingPipsQuantity} formatNumber={formatNumber} />
      </div>
      <button className="bg-blue-500 p-4 text-3xl text-white font-bold rounded hover:bg-blue-600 transition-colors" onClick={runMultipleSimulations}>
        Run 1.000 Simulations
      </button>
      <AggregateStatsDisplay stats={aggregateStats} />
      <SimulationResultsDisplay title="Latest Simulation Results" results={simulationResults} />
      <SimulationResultsDisplay title="Best Simulation Results (Highest ROI)" results={bestSimulation} />
      <SimulationResultsDisplay title="Worst Simulation Results (Lowest ROI)" results={worstSimulation} />
      <CompanyStatsDisplay stats={companyStats} />
    </div>
  );
}

function CompanyInputs({ name, options, selectedAccount, setSelectedAccount, quantity, setQuantity, formatNumber }) {
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <label htmlFor={`${name}-account`} className="font-medium">
        Account Size
      </label>
      <select id={`${name}-account`} value={selectedAccount.capital} onChange={(e) => setSelectedAccount(options.find((opt) => opt.capital === Number(e.target.value)) || options[0])} className="p-2 border rounded">
        {options.map((option) => (
          <option key={option.capital} value={option.capital}>
            ${formatNumber(option.capital)} - ${formatNumber(option.price)}
          </option>
        ))}
      </select>
      <label htmlFor={`${name}-quantity`} className="font-medium">
        Number of Accounts
      </label>
      <input id={`${name}-quantity`} type="number" value={quantity} onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))} min="0" className="p-2 border rounded" />
      <div className="mt-2">
        <span className="font-medium">Total Cost: </span>${formatNumber(selectedAccount.price * quantity)}
      </div>
      <div>
        <span className="font-medium">Price per $1.000: </span>${formatNumber((selectedAccount.price / selectedAccount.capital) * 1000)}
      </div>
    </div>
  );
}
