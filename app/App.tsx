import {useState} from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {FaGithub} from 'react-icons/fa';
import monthlyData from './dengue_monthly_2020_2025.json';

type MonthlyRecord = {
  year: number;
  month: number;
  infected: number;
  deaths: number;
};

type DisplayMetric = 'infected' | 'deaths';

const records = monthlyData as MonthlyRecord[];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const trainingStart = 2021;
const trainingEnd = 2024;
const testYear = 2025;
const repositoryUrl = 'https://github.com/Samin-yasar/pai-final-project';
const historicalRows = records.filter(row => row.year < testYear);
const trainingRows = records.filter(row => row.year >= trainingStart && row.year <= trainingEnd);
const testRows = records.filter(row => row.year === testYear);
const annualHistory = Array.from({length: testYear - 2020}, (_, index) => {
  const year = 2020 + index;
  const yearRows = historicalRows.filter(row => row.year === year);
  return {
    year: String(year),
    infected: yearRows.reduce((total, row) => total + row.infected, 0),
    deaths: yearRows.reduce((total, row) => total + row.deaths, 0),
  };
});

function averageForMonth(data: MonthlyRecord[], month: number): number {
  const values = data.filter(row => row.month === month).map(row => row.infected);
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function logFactorial(value: number): number {
  let total = 0;
  for (let count = 2; count <= value; count += 1) {
    total += Math.log(count);
  }
  return total;
}

function poissonLog10Probability(count: number, rate: number): number {
  if (rate === 0) return count === 0 ? 0 : Number.NEGATIVE_INFINITY;
  return (count * Math.log(rate) - rate - logFactorial(count)) / Math.LN10;
}

const forecast = monthNames.map((name, index) => {
  const month = index + 1;
  const expected = averageForMonth(trainingRows, month);
  const observed = testRows.find(row => row.month === month)?.infected;
  return {month, name, expected, observed};
});

const testScore = forecast.reduce((total, row) => {
  if (row.observed === undefined) return total;
  return total + poissonLog10Probability(row.observed, row.expected);
}, 0);

const historicalCaseTotal = annualHistory.reduce((total, row) => total + row.infected, 0);
const historicalDeathTotal = annualHistory.reduce((total, row) => total + row.deaths, 0);
const expectedTestYearTotal = forecast.reduce((total, row) => total + row.expected, 0);
const observedTestYearTotal = testRows.reduce((total, row) => total + row.infected, 0);
const testTotalDifference = expectedTestYearTotal - observedTestYearTotal;
const testPercentDifference = observedTestYearTotal > 0
  ? Math.abs(testTotalDifference / observedTestYearTotal * 100)
  : null;
const formatCount = (value: number) => Math.round(value).toLocaleString('en-US');
const cardStyle = {
  background: '#ffffff',
  border: '1px solid #dce5df',
  borderRadius: 16,
  padding: 22,
  flex: '1 1 190px',
};
const sectionStyle = {
  background: '#ffffff',
  border: '1px solid #dce5df',
  borderRadius: 20,
  padding: '24px clamp(18px, 4vw, 36px)',
  marginTop: 24,
};
const tableCellStyle = {
  borderBottom: '1px solid #dce5df',
  padding: '12px 10px',
  textAlign: 'left' as const,
  minWidth: 110,
};
const chartAxisStyle = {fontSize: 16, fill: '#3e5149'};
const tooltipStyle = {fontSize: 16, borderRadius: 10, border: '1px solid #dce5df'};

export default function App() {
  const [metric, setMetric] = useState<DisplayMetric>('infected');
  const metricLabel = metric === 'infected' ? 'reported cases' : 'reported deaths';
  const chartColor = metric === 'infected' ? '#087f68' : '#b14d3e';

  return (
    <div style={{minHeight: '100vh', background: '#f4f6f1', color: '#18312a', fontFamily: 'system-ui, sans-serif', fontSize: 18}}>
      <header style={{background: '#102d27', color: '#f7fbf8', padding: '14px 22px'}}>
        <div style={{maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap'}}>
          <a href="#top" style={{color: 'inherit', fontWeight: 750, textDecoration: 'none'}}>Dengue in Bangladesh</a>
          <nav aria-label="Main navigation" style={{display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap'}}>
            <a href="#trends" style={{color: 'inherit'}}>Historical trends</a>
            <a href="#model" style={{color: 'inherit'}}>How the model works</a>
            <a href="#test" style={{color: 'inherit'}}>2025 test</a>
            <a
              href={repositoryUrl}
              aria-label="Open the pai-final-project GitHub repository"
              style={{display: 'inline-flex', alignItems: 'center', gap: 8, color: 'inherit', fontWeight: 700}}
            >
              <FaGithub aria-hidden="true" size={22} />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="top" style={{maxWidth: 1120, margin: '0 auto', padding: '28px 20px 56px'}}>
        <section aria-labelledby="page-title" style={{padding: '28px 4px 10px'}}>
          <p style={{fontWeight: 750, letterSpacing: 1.2, color: '#087f68', marginBottom: 10}}>BANGLADESH · PUBLIC HEALTH DATA EXPLORER</p>
          <h1 id="page-title" style={{fontSize: 'clamp(34px, 6vw, 56px)', lineHeight: 1.08, maxWidth: 950, margin: '0 0 18px'}}>
            Dengue in Bangladesh: Trends and a Poisson Model
          </h1>
          <p style={{maxWidth: 800, lineHeight: 1.7}}>
            What can reported dengue cases and deaths tell us? Explore annual trends and test a monthly probability
            model on a year it did not learn from. This is a learning project, not a live alert service.
          </p>
          <p style={{display: 'inline-block', background: '#e1eee8', color: '#174f40', padding: '10px 14px', borderRadius: 999, fontWeight: 700}}>
            Historical dataset · January 2020–December 2025
          </p>
        </section>

        <section aria-label="Historical summary through 2024" style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 18}}>
          <div style={cardStyle}>
            <div style={{color: '#52665e'}}>Reported cases · 2020–2024</div>
            <strong style={{display: 'block', fontSize: 32, marginTop: 8}}>{formatCount(historicalCaseTotal)}</strong>
            <div>Counts in the dataset, not estimates of every infection</div>
          </div>
          <div style={cardStyle}>
            <div style={{color: '#52665e'}}>Reported deaths · 2020–2024</div>
            <strong style={{display: 'block', fontSize: 32, marginTop: 8}}>{formatCount(historicalDeathTotal)}</strong>
            <div>Shown as historical counts; deaths are not forecast here</div>
          </div>
          <div style={cardStyle}>
            <div style={{color: '#52665e'}}>Model training period</div>
            <strong style={{display: 'block', fontSize: 28, marginTop: 8}}>2021–2024</strong>
            <div>2020 excluded; 2025 held back for the test</div>
          </div>
        </section>

        <section id="trends" aria-labelledby="trends-title" style={sectionStyle}>
          <p style={{fontWeight: 750, color: '#087f68', margin: 0}}>THE HISTORICAL PICTURE</p>
          <h2 id="trends-title" style={{fontSize: 30, margin: '8px 0'}}>Reported counts change from year to year</h2>
          <p style={{lineHeight: 1.65}}>
            Switch between cases and deaths. The 2025 counts are kept out of this overview until the final test section.
            Annual totals describe reports in this dataset; they do not measure an individual person’s risk.
          </p>
          <label htmlFor="trend-metric" style={{display: 'block', fontWeight: 700, margin: '18px 0 8px'}}>Choose what to compare</label>
          <select
            id="trend-metric"
            value={metric}
            onChange={event => setMetric(event.target.value === 'deaths' ? 'deaths' : 'infected')}
            style={{font: 'inherit', padding: '10px 12px', border: '1px solid #71857c', borderRadius: 8, background: '#fff', color: '#18312a'}}
          >
            <option value="infected">Reported cases</option>
            <option value="deaths">Reported deaths</option>
          </select>
          <div role="img" aria-label={`Bar chart of annual ${metricLabel} in Bangladesh from 2020 through 2024`} style={{width: '100%', height: 360, marginTop: 14}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={annualHistory} margin={{top: 12, right: 16, bottom: 8, left: 12}}>
                <CartesianGrid stroke="#e4ebe6" strokeDasharray="4 4" />
                <XAxis dataKey="year" tick={chartAxisStyle} />
                <YAxis tick={chartAxisStyle} tickFormatter={value => Number(value).toLocaleString('en-US')} width={90} />
                <Tooltip formatter={value => formatCount(Number(value))} contentStyle={tooltipStyle} />
                <Bar dataKey={metric} name={metricLabel} fill={chartColor} radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{marginBottom: 0}}>
            These are reported counts—not a rate per person. Changes can reflect disease patterns as well as population,
            reporting, and other factors not represented in this simple view.
          </p>
        </section>

        <section id="model" aria-labelledby="model-title" style={sectionStyle}>
          <p style={{fontWeight: 750, color: '#087f68', margin: 0}}>A SIMPLE PROBABILITY MODEL</p>
          <h2 id="model-title" style={{fontSize: 30, margin: '8px 0'}}>Estimate a usual count for each month</h2>
          <p style={{lineHeight: 1.65}}>
            The model’s story: for each month, the reported case count is a Poisson random count with parameter λ
            (lambda), its expected number of reports. Each month has its own λ, estimated by averaging that month’s
            reported counts from 2021–2024. The model assumes monthly counts are independent and the month’s average
            stays stable into the test year.
          </p>
          <p style={{lineHeight: 1.65}}>
            The 2020 counts are shown in the historical chart but left out of the model, following the project’s earlier
            decision that this unusually low year would pull the monthly averages down. The 2025 values have not been
            used to choose the parameters.
          </p>
          <div role="img" aria-label="Chart comparing each 2025 Poisson expected case count with the reported test-set count" style={{width: '100%', height: 380, marginTop: 14}}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecast} margin={{top: 12, right: 18, bottom: 8, left: 12}}>
                <CartesianGrid stroke="#e4ebe6" strokeDasharray="4 4" />
                <XAxis dataKey="name" tick={chartAxisStyle} />
                <YAxis tick={chartAxisStyle} tickFormatter={value => Number(value).toLocaleString('en-US')} width={90} />
                <Tooltip formatter={value => formatCount(Number(value))} contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{fontSize: 16, paddingTop: 10}} />
                <Bar dataKey="expected" name="Model expected cases" fill="#087f68" radius={[5, 5, 0, 0]} />
                <Line dataKey="observed" name="2025 reported cases (test)" stroke="#b14d3e" strokeWidth={3} dot={{r: 4}} connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p style={{marginBottom: 0}}>
            The bars were fixed using 2021–2024 before the 2025 test observations were opened. A bar is an expected
            population count, not a promise or a personal risk estimate.
          </p>
        </section>

        <section id="test" aria-labelledby="test-title" style={{...sectionStyle, borderTop: '5px solid #b14d3e'}}>
          <p style={{fontWeight: 750, color: '#913a30', margin: 0}}>LOCKED TEST SET · OPENED AT THE END</p>
          <h2 id="test-title" style={{fontSize: 30, margin: '8px 0'}}>How did the model score on 2025?</h2>
          <p style={{lineHeight: 1.65}}>
            The model score is the sum of the base-10 logarithms of the probabilities assigned to the 12 observed
            monthly counts. Higher is better. A negative score is normal because each exact-count probability is below 1.
          </p>
          <p style={{lineHeight: 1.65}}>
            The model expected {formatCount(Math.abs(testTotalDifference))} {testTotalDifference >= 0 ? 'more' : 'fewer'} cases
            than were reported for 2025{testPercentDifference === null ? '.' : ` (${testPercentDifference.toFixed(1)}% ${testTotalDifference >= 0 ? 'above' : 'below'} the reported total).`}
            This is one held-out year, not evidence that the same difference will happen again.
          </p>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, margin: '18px 0'}}>
            <div style={cardStyle}>
              <div style={{color: '#52665e'}}>Expected cases from the model</div>
              <strong style={{display: 'block', fontSize: 28, marginTop: 8}}>{formatCount(expectedTestYearTotal)}</strong>
              <div>Sum of the 12 monthly λ parameters</div>
            </div>
            <div style={cardStyle}>
              <div style={{color: '#52665e'}}>Reported cases in the 2025 test</div>
              <strong style={{display: 'block', fontSize: 28, marginTop: 8}}>{formatCount(observedTestYearTotal)}</strong>
              <div>Opened only after the training rule was chosen</div>
            </div>
            <div style={cardStyle}>
              <div style={{color: '#52665e'}}>2025 model score</div>
              <strong style={{display: 'block', fontSize: 28, marginTop: 8}}>{testScore.toFixed(2)}</strong>
              <div>log₁₀ likelihood · higher is better</div>
            </div>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table style={{borderCollapse: 'collapse', width: '100%'}}>
              <caption style={{textAlign: 'left', fontWeight: 700, padding: '8px 0'}}>Monthly expectations and held-out reports</caption>
              <thead>
                <tr>
                  <th scope="col" style={tableCellStyle}>Month</th>
                  <th scope="col" style={tableCellStyle}>Expected cases (λ)</th>
                  <th scope="col" style={tableCellStyle}>2025 reported cases</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map(row => (
                  <tr key={row.month}>
                    <th scope="row" style={tableCellStyle}>{row.name}</th>
                    <td style={tableCellStyle}>{formatCount(row.expected)}</td>
                    <td style={tableCellStyle}>{row.observed === undefined ? 'Not available' : formatCount(row.observed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{lineHeight: 1.65, marginBottom: 0}}>
            The model is deliberately simple. One year of testing is not enough to establish a reliable public-health
            forecast, and this result does not assess deaths or individual outcomes.
          </p>
        </section>

        <section aria-labelledby="watch-title" style={{...sectionStyle, background: '#e8f1ec'}}>
          <h2 id="watch-title" style={{fontSize: 28, marginTop: 0}}>What patients and health teams should keep in mind</h2>
          <ul style={{lineHeight: 1.75, paddingLeft: 26, marginBottom: 0}}>
            <li>Patients: these historical totals cannot tell you whether you have dengue or predict your personal health risk. Contact a qualified health professional or local health service for personal medical guidance.</li>
            <li>Health teams: use current official surveillance and local protocols for operational decisions; this offline classroom dashboard is not updated live.</li>
            <li>Everyone: reported counts may not capture every infection, and the model does not account for changes in weather, population, prevention, or reporting.</li>
          </ul>
        </section>

        <footer style={{marginTop: 28, padding: '18px 4px', borderTop: '1px solid #cbd9d1', lineHeight: 1.7}}>
          <p>
            <strong>Data:</strong> 72 monthly records, January 2020–December 2025, from “Monthly Division-Level Dengue
            Cases &amp; Mortality with Climate and Environmental Indicators in Bangladesh (2020–2025),” version 2.{' '}
            <a href="https://data.mendeley.com/datasets/cgwjshkx5k/2">Dataset page</a>. License: CC BY 4.0.
          </p>
          <p>Data are bundled with the app; the website makes no live data requests. Deaths are shown as historical counts only.</p>
          <p>
            <a href={repositoryUrl} style={{display: 'inline-flex', alignItems: 'center', gap: 8, color: '#075e4d', fontWeight: 700}}>
              <FaGithub aria-hidden="true" size={20} />
              Project repository on GitHub
            </a>
          </p>
          <p style={{marginBottom: 0}}>Classroom exploration only—not an official public-health forecast or medical advice.</p>
        </footer>
      </main>
    </div>
  );
}
