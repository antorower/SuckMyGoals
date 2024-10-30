import { GetDonePayouts } from "@/lib/PayoutActions";
import { Companies } from "@/lib/AppData";
import { GetAllAccountsStats } from "@/lib/AccountActions";

const Stats = async () => {
  const numberOfTraders = 63;
  const payouts = await GetDonePayouts();
  const allAccounts = await GetAllAccountsStats();

  // Αρχικοποίηση ξεχωριστών πινάκων για κάθε ομαδοποίηση
  const byCompany = {};
  const byCapital = {};
  const byPhase = {};
  const byStatus = {};
  const aboveCapital = [];
  const belowCapital = [];
  const equalCapital = [];

  // Ομαδοποίηση του allAccounts με βάση τα κριτήρια
  allAccounts.forEach((account) => {
    // Ομαδοποίηση ανά εταιρεία
    if (!byCompany[account.company]) {
      byCompany[account.company] = [];
    }
    byCompany[account.company].push(account);

    // Ομαδοποίηση ανά κεφάλαιο (capital)
    if (!byCapital[account.capital]) {
      byCapital[account.capital] = [];
    }
    byCapital[account.capital].push(account);

    // Ομαδοποίηση ανά φάση (phaseWeight)
    if (!byPhase[account.phaseWeight]) {
      byPhase[account.phaseWeight] = [];
    }
    byPhase[account.phaseWeight].push(account);

    // Ομαδοποίηση ανά κατάσταση (status)
    if (!byStatus[account.status]) {
      byStatus[account.status] = [];
    }
    byStatus[account.status].push(account);

    // Σύγκριση balance με capital
    if (account.balance > account.capital) {
      aboveCapital.push(account);
    } else if (account.balance < account.capital) {
      belowCapital.push(account);
    } else {
      equalCapital.push(account);
    }
  });

  console.log("Accounts grouped by company:", byCompany);
  console.log("Accounts grouped by capital:", byCapital);
  console.log("Accounts grouped by phase:", byPhase);
  console.log("Accounts grouped by status:", byStatus);
  console.log("Accounts with balance above capital:", aboveCapital);
  console.log("Accounts with balance below capital:", belowCapital);
  console.log("Accounts with balance equal to capital:", equalCapital);
  console.log("BY PHASE", byPhase["3"]);
  // Ελέγχουμε ότι το byPhase["3"] είναι ένας έγκυρος πίνακας
  const totalDifferencePhase3 =
    byPhase["3"]?.reduce((acc, item) => {
      if (item.status === "WaitingPayout") {
        return acc + (item.balance - item.capital);
      }
      return acc;
    }, 0) || 0;

  console.log("Total Difference for Phase 3 with status 'WaitingPayout':", totalDifferencePhase3);

  const activeCompanies = Companies.filter((company) => company.active).map((company) => ({
    name: company.name,
    maxAccounts: company.maxAccounts,
    cost: company.cost,
  }));

  // Ομαδοποίηση και υπολογισμός συνολικών κερδών ανά χρήστη
  const userEarnings = payouts.reduce((acc, payout) => {
    const userId = payout.user._id;
    const userName = `${payout.user.firstName} ${payout.user.lastName}`;

    if (!acc[userId]) {
      acc[userId] = { name: userName, totalEarnings: 0 };
    }
    acc[userId].totalEarnings += payout.payoutAmount;

    return acc;
  }, {});

  console.log(allAccounts.length);

  // Μετατροπή σε πίνακα, ταξινόμηση και επιλογή των τριών πρώτων
  const topEarners = Object.values(userEarnings)
    .sort((a, b) => b.totalEarnings - a.totalEarnings)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-4 p-8 w-full">
      <div className="flex flex-col gap-2 mt-8">
        <div className="w-full text-sm p-2 text-gray-500">Top Earners (MVP)</div>
        <div className="flex gap-4 flex-wrap">
          {topEarners.map((earner, index) => (
            <div key={index} className={`flex gap-2 border border-gray-900 px-4 py-2 ${index === 0 ? "text-amber-500" : null} ${index === 1 ? "text-slate-300" : null} ${index === 2 ? "text-stone-300" : null}`}>
              <div>{earner.name}</div>
              <div>${earner.totalEarnings.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-8">
        <div className="w-full text-sm p-2 text-gray-500">Waiting Profits: {totalDifferencePhase3}</div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full text-sm p-2 text-gray-500">Accounts By Company</div>
        <div className="grid grid-cols-12 max-w-[400px]">
          <div className="col-span-5">Funded Next: </div>
          <div className="col-span-4">
            {byCompany["Funded Next"]?.length + byCompany["Funded Next Stellar"]?.length ? byCompany["Funded Next"]?.length + byCompany["Funded Next Stellar"]?.length : 0}/{numberOfTraders * 3}
          </div>
          <div className="col-span-3">{byCompany["Funded Next"]?.length + byCompany["Funded Next Stellar"]?.length ? Math.floor(((byCompany["Funded Next"]?.length + byCompany["Funded Next Stellar"]?.length) / (numberOfTraders * 3)) * 100) + "%" : "0%"}</div>
        </div>
        <div className="grid grid-cols-12 max-w-[400px]">
          <div className="col-span-5">Funding Pips:</div>
          <div className="col-span-4">
            {byCompany["Funding Pips"]?.length ? byCompany["Funding Pips"]?.length : 0}/{numberOfTraders * 1}
          </div>
          <div className="col-span-3">{byCompany["Funding Pips"]?.length ? Math.floor((byCompany["Funding Pips"]?.length / (numberOfTraders * 1)) * 100) + "%" : "0%"}</div>
        </div>
        <div className="grid grid-cols-12 max-w-[400px]">
          <div className="col-span-5">The5ers:</div>
          <div className="col-span-4">
            {byCompany["The5ers"]?.length ? byCompany["The5ers"]?.length : 0}/{numberOfTraders * 1}
          </div>
          <div className="col-span-3">{byCompany["The5ers"]?.length ? Math.floor((byCompany["The5ers"]?.length / (numberOfTraders * 1)) * 100) + "%" : "0%"}</div>
        </div>
        <div className="grid grid-cols-12 max-w-[400px] animate-pulse">
          <div className="col-span-5">Total:</div>
          <div className="col-span-4">
            {(byCompany["The5ers"]?.length || 0) + (byCompany["Funding Pips"]?.length || 0) + (byCompany["Funded Next"]?.length || 0) + (byCompany["Funded Next Stellar"]?.length || 0)}/ {numberOfTraders * 5}
          </div>

          <div className="col-span-3">{numberOfTraders > 0 ? `${Math.round((((byCompany["The5ers"]?.length || 0) + (byCompany["Funding Pips"]?.length || 0) + (byCompany["Funded Next"]?.length || 0) + (byCompany["Funded Next Stellar"]?.length || 0)) / (numberOfTraders * 5)) * 100)}%` : "0%"}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full text-sm p-2 text-gray-500">Accounts By Capital</div>
        <div className="grid grid-cols-2 max-w-[200px]">
          <div>5000:</div>
          <div>{byCapital["5000"]?.length || 0}</div>
        </div>
        <div className="grid grid-cols-2 max-w-[200px]">
          <div>6000:</div>
          <div>{byCapital["6000"]?.length || 0}</div>
        </div>
        <div className="grid grid-cols-2 max-w-[200px]">
          <div>7500:</div>
          <div>{byCapital["7500"]?.length || 0}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full text-sm p-2 text-gray-500">Accounts By Phase</div>
        <div className="grid grid-cols-2 max-w-[200px]">
          <div>Phase 1:</div>
          <div>{byPhase["1"]?.length || 0}</div>
        </div>
        <div className="grid grid-cols-2 max-w-[200px]">
          <div>Phase 2:</div>
          <div>{byPhase["2"]?.length || 0}</div>
        </div>
        <div className="grid grid-cols-2 max-w-[200px] text-amber-500">
          <div>Funded:</div>
          <div>{byPhase["3"]?.length || 0}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full text-sm p-2 text-gray-500">Most Recent Payouts</div>
        <div className="flex gap-4 flex-wrap">
          {payouts &&
            payouts.map((payout) => (
              <div key={payout._id} className="flex gap-2 border border-gray-900 px-4 py-2">
                <div>
                  {payout.user.firstName} {payout.user.lastName}
                </div>
                <div>${payout.payoutAmount}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
