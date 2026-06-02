/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sliders, RefreshCw, BarChart2, CheckCircle, HelpCircle, Activity } from 'lucide-react';
import { Hyperparameters, TrainingLog } from '../types';

export default function MetricsPanel() {
  const [params, setParams] = useState<Hyperparameters>({
    learningRate: 0.0005,
    batchSize: 32,
    transformerLayers: 6,
    lstmUnits: 256,
    dropout: 0.2,
    epochs: 10,
  });

  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [logs, setLogs] = useState<TrainingLog[]>([
    { epoch: 1, trainLoss: 1.84, valLoss: 1.95, wer: 45.2, cer: 18.5, intentAccuracy: 64.2, latencyMs: 312 },
    { epoch: 2, trainLoss: 1.22, valLoss: 1.34, wer: 31.8, cer: 12.2, intentAccuracy: 78.5, latencyMs: 315 },
    { epoch: 3, trainLoss: 0.81, valLoss: 0.98, wer: 26.5, cer: 9.8, intentAccuracy: 84.1, latencyMs: 309 },
    { epoch: 4, trainLoss: 0.54, valLoss: 0.72, wer: 24.1, cer: 8.4, intentAccuracy: 89.2, latencyMs: 310 },
    { epoch: 5, trainLoss: 0.38, valLoss: 0.58, wer: 22.8, cer: 8.1, intentAccuracy: 91.8, latencyMs: 314 },
    { epoch: 6, trainLoss: 0.28, valLoss: 0.49, wer: 22.4, cer: 8.0, intentAccuracy: 93.5, latencyMs: 312 },
    { epoch: 7, trainLoss: 0.22, valLoss: 0.44, wer: 22.31, cer: 8.04, intentAccuracy: 94.6, latencyMs: 311 },
    { epoch: 8, trainLoss: 0.18, valLoss: 0.41, wer: 22.31, cer: 8.04, intentAccuracy: 95.1, latencyMs: 315 },
    { epoch: 9, trainLoss: 0.15, valLoss: 0.39, wer: 22.31, cer: 8.04, intentAccuracy: 95.3, latencyMs: 313 },
    { epoch: 10, trainLoss: 0.12, valLoss: 0.38, wer: 22.31, cer: 8.04, intentAccuracy: 95.4, latencyMs: 312 },
  ]);

  const [chartMode, setChartMode] = useState<'loss' | 'accuracy'>('loss');

  // Interactive training loop simulator
  const startSimulation = () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setLogs([]);
  };

  useEffect(() => {
    if (!isTraining) return;

    if (currentEpoch < params.epochs) {
      const timer = setTimeout(() => {
        const nextEpoch = currentEpoch + 1;
        
        // Custom calculations adapting to hyperparameter configurations!
        // High learning rates cause fluctuating divergence losses.
        // Low layers reduce max capacity.
        const rFactor = params.learningRate > 0.001 ? 1.4 : 0.85; 
        const layerFactor = 1.0 + (8 - params.transformerLayers) * 0.08;
        const bsFactor = params.batchSize === 16 ? 0.95 : params.batchSize === 64 ? 1.05 : 1.0;

        // Custom simulated coefficients calculation
        const baseLoss = 2.4 * Math.exp(-0.35 * nextEpoch * rFactor) / layerFactor;
        const trainLoss = Math.max(0.08, baseLoss * (1 - params.dropout * 0.1));
        const valLoss = Math.max(0.18, baseLoss * (1.1 + (params.dropout > 0.3 ? -0.05 : 0.05)) + (nextEpoch > 7 ? 0.02 * (nextEpoch - 7) : 0));
        
        // Decreasing Word Error Rates (WER)
        const baseWer = 55.0 * Math.exp(-0.16 * nextEpoch * layerFactor) + 21.0;
        const wer = Math.max(21.0, baseWer * bsFactor);
        const cer = Math.max(5.0, (baseWer * bsFactor) * 0.4);

        // Rising Intent classifier precision accuracy
        const intentAccuracy = Math.min(99.0, 50.0 + (49.0 * (1 - Math.exp(-0.35 * nextEpoch * rFactor))));

        const latencyMs = Math.round(280 + params.transformerLayers * 12 + params.lstmUnits * 0.1);

        setLogs((prev) => [
          ...prev,
          {
            epoch: nextEpoch,
            trainLoss: parseFloat(trainLoss.toFixed(3)),
            valLoss: parseFloat(valLoss.toFixed(3)),
            wer: parseFloat(wer.toFixed(2)),
            cer: parseFloat(cer.toFixed(2)),
            intentAccuracy: parseFloat(intentAccuracy.toFixed(2)),
            latencyMs,
          },
        ]);
        setCurrentEpoch(nextEpoch);
      }, 250); // 250ms per epoch calculation
      return () => clearTimeout(timer);
    } else {
      setIsTraining(false);
    }
  }, [isTraining, currentEpoch, params]);

  // Handcrafted responsive SVG plotting helpers
  const svgWidth = 500;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const plotLogs = logs.length > 0 ? logs : [{ epoch: 1, trainLoss: 1, valLoss: 1, wer: 50, cer: 20, intentAccuracy: 50, latencyMs: 300 }];

  // Loss curves coordinates calculations
  const getLossCoords = () => {
    const maxX = params.epochs;
    const maxY = Math.max(...plotLogs.map((l) => Math.max(l.trainLoss, l.valLoss, 2.0)));
    
    const getX = (epoch: number) => padding.left + ((epoch - 1) / (maxX - 1 || 1)) * (svgWidth - padding.left - padding.right);
    const getY = (val: number) => svgHeight - padding.bottom - (val / maxY) * (svgHeight - padding.top - padding.bottom);

    let trainPath = "";
    let valPath = "";

    plotLogs.forEach((l, i) => {
      const x = getX(l.epoch);
      const yTrain = getY(l.trainLoss);
      const yVal = getY(l.valLoss);
      if (i === 0) {
        trainPath = `M ${x} ${yTrain}`;
        valPath = `M ${x} ${yVal}`;
      } else {
        trainPath += ` L ${x} ${yTrain}`;
        valPath += ` L ${x} ${yVal}`;
      }
    });

    return { trainPath, valPath, getX, getY, maxX, maxY };
  };

  // Accuracy / WER coordinates calculations
  const getAccCoords = () => {
    const maxX = params.epochs;
    const getX = (epoch: number) => padding.left + ((epoch - 1) / (maxX - 1 || 1)) * (svgWidth - padding.left - padding.right);
    
    // Accuracy spans 0 to 100%
    const getY = (val: number) => svgHeight - padding.bottom - (val / 100) * (svgHeight - padding.top - padding.bottom);

    let accPath = "";
    let werPath = "";

    plotLogs.forEach((l, i) => {
      const x = getX(l.epoch);
      const yAcc = getY(l.intentAccuracy);
      const yWer = getY(l.wer);
      if (i === 0) {
        accPath = `M ${x} ${yAcc}`;
        werPath = `M ${x} ${yWer}`;
      } else {
        accPath += ` L ${x} ${yAcc}`;
        werPath += ` L ${x} ${yWer}`;
      }
    });

    return { accPath, werPath, getX, getY, maxX };
  };

  const lossData = getLossCoords();
  const accData = getAccCoords();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 id-metrics-panel">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Hyperparameters Form Parameters Side */}
        <div className="w-full lg:w-1/3 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Academic Hyperparameters Block
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">Configure network constraints prior to training.</p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block text-gray-600 font-medium mb-1 font-sans">Learning Rate</label>
              <select
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white font-mono"
                value={params.learningRate}
                disabled={isTraining}
                onChange={(e) => setParams({ ...params, learningRate: parseFloat(e.target.value) })}
              >
                <option value={0.001}>0.001 (Fast)</option>
                <option value={0.0005}>0.0005 (Standard)</option>
                <option value={0.0001}>0.0001 (Stable)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1 font-sans">Batch Size</label>
              <select
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white font-mono"
                value={params.batchSize}
                disabled={isTraining}
                onChange={(e) => setParams({ ...params, batchSize: parseInt(e.target.value) })}
              >
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={64}>64</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1 font-sans">Conv/Encoder Layers</label>
              <input
                type="range"
                min={2}
                max={8}
                step={2}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2.5"
                value={params.transformerLayers}
                disabled={isTraining}
                onChange={(e) => setParams({ ...params, transformerLayers: parseInt(e.target.value) })}
              />
              <span className="text-[10px] text-gray-500 font-mono block text-right mt-1">
                {params.transformerLayers} Multi-Heads
              </span>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1 font-sans">Recurrent Units</label>
              <select
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white font-mono"
                value={params.lstmUnits}
                disabled={isTraining}
                onChange={(e) => setParams({ ...params, lstmUnits: parseInt(e.target.value) })}
              >
                <option value={128}>128 (Slim)</option>
                <option value={256}>256 (Base)</option>
                <option value={512}>512 (Wide)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1 font-sans">Dropout Rate</label>
              <input
                type="number"
                min={0}
                max={0.5}
                step={0.1}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white font-mono"
                value={params.dropout}
                disabled={isTraining}
                onChange={(e) => setParams({ ...params, dropout: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1 font-sans">Epochs Limit</label>
              <select
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white font-mono"
                value={params.epochs}
                disabled={isTraining}
                onChange={(e) => setParams({ ...params, epochs: parseInt(e.target.value) })}
              >
                <option value={5}>5 epochs</option>
                <option value={10}>10 epochs</option>
                <option value={15}>15 epochs</option>
              </select>
            </div>
          </div>

          <button
            id="btn-trigger-training"
            onClick={startSimulation}
            disabled={isTraining}
            className="w-full bg-indigo-600 text-white rounded-xl py-2.5 px-4 font-bold text-xs hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2 select-none cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
            {isTraining ? `Training Epoch ${currentEpoch}/${params.epochs}...` : "Compile & Run Tensor Training"}
          </button>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[10px] leading-relaxed text-gray-500">
            <span className="font-bold text-gray-700 block mb-1">Academic Formulas Applied</span>
            <div className="space-y-1 font-mono">
              <div>WER = (Substitutions + Deletions + Insertions) / N</div>
              <div>F1-Score = 2 * (Precision * Recall) / (Precision + Recall)</div>
            </div>
          </div>
        </div>

        {/* Training Plot Monitor Side */}
        <div className="w-full lg:w-2/3 flex flex-col justify-between">
          <div className="flex border-b border-gray-150 pb-2 mb-4 justify-between items-center">
            <h4 className="text-xs font-bold text-gray-700 font-mono flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              Live Tensor Output Plots
            </h4>

            <div className="flex bg-gray-50 p-0.5 rounded-lg border border-gray-200">
              <button
                id="chart-mode-loss"
                onClick={() => setChartMode('loss')}
                className={`py-1 px-3 text-[10px] font-semibold rounded-md transition-all ${
                  chartMode === 'loss' ? 'bg-white shadow-xs text-indigo-600' : 'text-gray-500'
                }`}
              >
                Loss Curves
              </button>
              <button
                id="chart-mode-acc"
                onClick={() => setChartMode('accuracy')}
                className={`py-1 px-3 text-[10px] font-semibold rounded-md transition-all ${
                  chartMode === 'accuracy' ? 'bg-white shadow-xs text-indigo-600' : 'text-gray-500'
                }`}
              >
                WER & Accuracy
              </button>
            </div>
          </div>

          {/* SVG graphing grid plots */}
          <div className="relative border border-gray-50 bg-gray-50/20 rounded-xl p-2 flex justify-center items-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-h-[220px]">
              {/* Horizontal Grid lines */}
              <line x1={padding.left} y1={padding.top} x2={svgWidth - padding.right} y2={padding.top} stroke="#f3f4f6" strokeWidth={1} />
              <line x1={padding.left} y1={padding.top + (svgHeight - padding.top - padding.bottom) / 2} x2={svgWidth - padding.right} y2={padding.top + (svgHeight - padding.top - padding.bottom) / 2} stroke="#f3f4f6" strokeWidth={1} />
              <line x1={padding.left} y1={svgHeight - padding.bottom} x2={svgWidth - padding.right} y2={svgHeight - padding.bottom} stroke="#e5e7eb" strokeWidth={1} />

              {/* Loss Graphs plotting */}
              {chartMode === 'loss' ? (
                <>
                  {/* Paths */}
                  <path d={lossData.trainPath} fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={lossData.valPath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

                  {/* Node point dots */}
                  {plotLogs.map((l) => (
                    <g key={l.epoch}>
                      <circle cx={lossData.getX(l.epoch)} cy={lossData.getY(l.trainLoss)} r={3} fill="#6366f1" />
                      <circle cx={lossData.getX(l.epoch)} cy={lossData.getY(l.valLoss)} r={3} fill="#f59e0b" />
                    </g>
                  ))}

                  {/* X/Y Axis scales labels */}
                  <text x={padding.left - 8} y={padding.top} fontSize={8} fontFamily="monospace" textAnchor="end" fill="#9ca3af">{(lossData.maxY).toFixed(1)}</text>
                  <text x={padding.left - 8} y={padding.top + (svgHeight - padding.top - padding.bottom) / 2} fontSize={8} fontFamily="monospace" textAnchor="end" fill="#9ca3af">{(lossData.maxY / 2).toFixed(1)}</text>
                  <text x={padding.left - 8} y={svgHeight - padding.bottom} fontSize={8} fontFamily="monospace" textAnchor="end" fill="#9ca3af">0.0</text>
                </>
              ) : (
                <>
                  {/* Paths */}
                  <path d={accData.accPath} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={accData.werPath} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

                  {/* Node point dots */}
                  {plotLogs.map((l) => (
                    <g key={l.epoch}>
                      <circle cx={accData.getX(l.epoch)} cy={accData.getY(l.intentAccuracy)} r={3} fill="#10b981" />
                      <circle cx={accData.getX(l.epoch)} cy={accData.getY(l.wer)} r={3} fill="#ef4444" />
                    </g>
                  ))}

                  {/* X/Y Axis scales labels */}
                  <text x={padding.left - 8} y={padding.top} fontSize={8} fontFamily="monospace" textAnchor="end" fill="#9ca3af">100%</text>
                  <text x={padding.left - 8} y={padding.top + (svgHeight - padding.top - padding.bottom) / 2} fontSize={8} fontFamily="monospace" textAnchor="end" fill="#9ca3af">50%</text>
                  <text x={padding.left - 8} y={svgHeight - padding.bottom} fontSize={8} fontFamily="monospace" textAnchor="end" fill="#9ca3af">0%</text>
                </>
              )}

              {/* Epoch scale numbers x-axis */}
              {plotLogs.map((l) => (
                <text
                  key={l.epoch}
                  x={chartMode === 'loss' ? lossData.getX(l.epoch) : accData.getX(l.epoch)}
                  y={svgHeight - 12}
                  fontSize={8}
                  fontFamily="monospace"
                  textAnchor="middle"
                  fill="#9ca3af"
                >
                  E{l.epoch}
                </text>
              ))}
            </svg>
          </div>

          <div className="flex gap-4 mt-3 justify-center text-[10px] font-mono select-none">
            {chartMode === 'loss' ? (
              <>
                <span className="flex items-center gap-1.5 text-indigo-600"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Train Loss</span>
                <span className="flex items-center gap-1.5 text-amber-500"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Val Loss</span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Intent Accuracy</span>
                <span className="flex items-center gap-1.5 text-rose-500"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> ASR WER %</span>
              </>
            )}
          </div>

          {/* Detailed metrics board below charts */}
          <div className="grid grid-cols-4 gap-2 bg-gray-50 border border-gray-200/50 p-3 rounded-xl text-center mt-3 justify-around">
            <div>
              <span className="text-[9px] text-gray-500 font-sans block uppercase">Best WER</span>
              <span className="text-sm font-bold text-gray-800 font-mono">
                {plotLogs[plotLogs.length - 1].wer}%
              </span>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-sans block uppercase">Min CER</span>
              <span className="text-sm font-bold text-gray-800 font-mono">
                {plotLogs[plotLogs.length - 1].cer}%
              </span>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-sans block uppercase">NLU Accuracy</span>
              <span className="text-sm font-shadow-xs font-bold text-green-700 font-mono">
                {plotLogs[plotLogs.length - 1].intentAccuracy}%
              </span>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-sans block uppercase">Avg Latency</span>
              <span className="text-sm font-bold text-gray-800 font-mono">
                {plotLogs[plotLogs.length - 1].latencyMs}ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
