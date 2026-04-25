import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';

const INITIAL_BASELINE = {
  easy:   { avg: 0.78, std: 0.21, n: 20 },
  medium: { avg: 0.43, std: 0.18, n: 20 },
  hard:   { avg: 0.29, std: 0.14, n: 20 }
};

const INITIAL_POST_TRAINING = {
  easy:   { avg: 0.91, std: 0.12, n: 20 },
  medium: { avg: 0.67, std: 0.15, n: 20 },
  hard:   { avg: 0.51, std: 0.19, n: 20 }
};

export default function ResultsDashboard() {
  const [baselineStr, setBaselineStr] = useState(JSON.stringify(INITIAL_BASELINE, null, 2));
  const [postTrainingStr, setPostTrainingStr] = useState(JSON.stringify(INITIAL_POST_TRAINING, null, 2));
  
  let baseline = INITIAL_BASELINE;
  let postTraining = INITIAL_POST_TRAINING;
  
  try { baseline = JSON.parse(baselineStr); } catch (e) {}
  try { postTraining = JSON.parse(postTrainingStr); } catch (e) {}

  const data = ["easy", "medium", "hard"].map(level => {
    const b = baseline[level] || { avg: 0, std: 0, n: 0 };
    const p = postTraining[level] || { avg: 0, std: 0, n: 0 };
    const delta = p.avg - b.avg;
    const pctImprovement = b.avg > 0 ? (delta / b.avg) * 100 : 0;
    
    return {
      name: level.toUpperCase(),
      baselineAvg: b.avg,
      postTrainingAvg: p.avg,
      delta: delta,
      pctImprovement: pctImprovement.toFixed(1)
    };
  });

  return (
    <div style={{
      backgroundColor: '#121212', color: '#ffffff', fontFamily: 'system-ui, sans-serif', padding: '2rem', minHeight: '100vh'
    }}>
      <style>{`
        .textarea-input {
          width: 100%; height: 150px; background: #1e1e1e; color: #fff; border: 1px solid #333; padding: 10px; border-radius: 4px; font-family: monospace; resize: none; margin-top: 10px;
        }
        .textarea-input:focus { outline: 1px solid #4ade80; border-color: #4ade80; }
        .card { background: #1e1e1e; padding: 1.5rem; border-radius: 8px; border: 1px solid #333; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        h1, h2, h3 { color: #f0f0f0; margin-top: 0; }
        .metric { font-size: 2.5rem; font-weight: bold; color: #4ade80; }
        .negative-metric { color: #f87171; }
      `}</style>

      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>PR Review RL Agent Results</h1>
      
      <div className="grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3>Paste Baseline JSON</h3>
          <textarea 
            className="textarea-input"
            value={baselineStr} 
            onChange={(e) => setBaselineStr(e.target.value)} 
          />
        </div>
        <div className="card">
          <h3>Paste Post-Training JSON</h3>
          <textarea 
            className="textarea-input"
            value={postTrainingStr} 
            onChange={(e) => setPostTrainingStr(e.target.value)} 
          />
        </div>
      </div>

      <div className="grid" style={{ marginBottom: '2rem' }}>
        {data.map(d => (
          <div className="card" key={d.name} style={{ textAlign: 'center' }}>
            <h3>{d.name} Improvement</h3>
            <div className={`metric ${d.delta < 0 ? 'negative-metric' : ''}`}>
              {d.delta > 0 ? '+' : ''}{d.pctImprovement}%
            </div>
            <div style={{ color: '#888', marginTop: '0.5rem' }}>
              Absolute Delta: {d.delta > 0 ? '+' : ''}{d.delta.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid">
        <div className="card">
          <h3>Average Score (Baseline vs Trained)</h3>
          <div style={{ height: 350, width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                <YAxis stroke="#888" domain={[0, 1]} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="baselineAvg" name="Baseline" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="postTrainingAvg" name="Trained" fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Improvement Delta (Trained - Baseline)</h3>
          <div style={{ height: 350, width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                <YAxis stroke="#888" tickLine={false} axisLine={false} />
                <ReferenceLine y={0} stroke="#f87171" strokeDasharray="3 3" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="delta" name="Score Delta" stroke="#4ade80" strokeWidth={3} dot={{ r: 6, fill: '#1e1e1e', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
