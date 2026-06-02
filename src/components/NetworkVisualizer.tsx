/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Cpu, Activity, Play, Zap, Info } from 'lucide-react';

interface NetworkVisualizerProps {
  currentPath: 'cascaded' | 'e2e';
  simulateStep?: 'idle' | 'spectrogram' | 'acoustic' | 'tokenization' | 'translation' | 'nlu' | 'completed';
  activeIntent?: string;
}

export default function NetworkVisualizer({ currentPath, simulateStep = 'idle', activeIntent }: NetworkVisualizerProps) {
  const [pulseIndex, setPulseIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<{ layer: string; details: string } | null>(null);

  // Auto animation loop to simulate ongoing layer calculations when active
  useEffect(() => {
    if (simulateStep !== 'idle' && simulateStep !== 'completed') {
      const interval = setInterval(() => {
        setPulseIndex((prev) => (prev + 1) % 5);
      }, 350);
      return () => clearInterval(interval);
    } else {
      setPulseIndex(0);
    }
  }, [simulateStep]);

  // Define neural stages based on Dagem's architectures
  const stages = [
    {
      id: "input",
      title: "Audio Spec",
      type: "Spectrogram Front-End",
      desc: "Raw signals converted to 80-channel Log-Mel slices",
      nodes: [0.8, 0.45, 0.92, 0.31, 0.58],
      color: "border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100",
      active: simulateStep !== 'idle',
    },
    {
      id: "cnn",
      title: "CNN Kernels",
      type: "2D Convolution Filtering",
      desc: "Captures temporal-frequency structures with Pooling",
      nodes: [0.62, 0.77, 0.12, 0.49],
      color: "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
      active: ['acoustic', 'tokenization', 'nlu', 'completed'].includes(simulateStep),
    },
    {
      id: "att",
      title: "Self-Attention",
      type: "Transformer Encoders",
      desc: "Models long-range acoustic interactions dynamically",
      nodes: [0.94, 0.81, 0.53, 0.22, 0.76],
      color: "border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      active: ['acoustic', 'tokenization', 'nlu', 'completed'].includes(simulateStep),
    },
    {
      id: "mid",
      title: currentPath === 'cascaded' ? "CTC Tokens" : "Temporal Pool",
      type: currentPath === 'cascaded' ? "Fidel Char Probabilities" : "Averages Sequence Contexts",
      desc: currentPath === 'cascaded' 
        ? "Translates phonetic clusters to written Amharic text sequences" 
        : "Compresses multidimensional sequence profiles to unique vectors",
      nodes: currentPath === 'cascaded' ? [0.88, 0.15, 0.64] : [0.72, 0.95],
      color: "border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100",
      active: currentPath === 'cascaded' 
        ? ['tokenization', 'nlu', 'completed'].includes(simulateStep)
        : ['nlu', 'completed'].includes(simulateStep),
    },
    {
      id: "output",
      title: currentPath === 'cascaded' ? "NLU Recurrent" : "Intent Direct",
      type: currentPath === 'cascaded' ? "GRU Classification" : "Wav2Vec Dense Out",
      desc: currentPath === 'cascaded'
        ? "Processes texts via BiGRU + Attention for intent target scoring"
        : "Activates explicit intent category layers in single step",
      nodes: [0.99, 0.12, 0.05, 0.23, 0.78],
      color: "border-rose-500 bg-rose-50 text-rose-700 hover:bg-rose-100",
      active: simulateStep === 'completed',
    }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 relative id-net-visualizer">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            Adaptive Layer Weight Activation Visualizer
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            Active Model track: <span className="text-indigo-600 font-bold uppercase">{currentPath} SLU</span>
          </p>
        </div>

        {simulateStep !== 'idle' && simulateStep !== 'completed' && (
          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold animate-pulse">
            <Zap className="w-2.5 h-2.5" /> RUNNING COMPUTE
          </div>
        )}
      </div>

      {/* Layer connections diagram */}
      <div className="relative border border-gray-100 bg-gray-50/50 rounded-xl p-4 min-h-[290px] flex justify-between items-center gap-3 overflow-hidden">
        {stages.map((stage, stageIdx) => {
          const isPulseStage = simulateStep !== 'idle' && simulateStep !== 'completed' && pulseIndex === stageIdx;

          return (
            <div
              key={stage.id}
              className={`flex-1 flex flex-col items-center relative z-10 transition-all duration-300 ${
                stage.active ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
              }`}
            >
              <div 
                className={`w-full py-1.5 px-2 border rounded-lg text-center font-bold text-[10px] shadow-sm select-none transition-all cursor-help ${stage.color} ${
                  isPulseStage ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredNode({ layer: stage.title, details: `${stage.type}: ${stage.desc}` })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {stage.title}
              </div>

              {/* Node weight indicator nodes (glowing circles representing weights) */}
              <div className="flex flex-col gap-2 mt-4">
                {stage.nodes.map((weight, nodeIdx) => {
                  // Determine output stage labels
                  let label = "";
                  if (stage.id === 'output') {
                    const intentLabels = ["FailedTx", "Balance", "WrongTx", "Blocked", "AtmError"];
                    label = intentLabels[nodeIdx];
                  } else if (stage.id === 'mid' && currentPath === 'cascaded') {
                    const fidelChars = ["ሀ", "ለ", "መ"];
                    label = fidelChars[nodeIdx];
                  }

                  const isActiveOutputNode = stage.id === 'output' && activeIntent && (
                    (activeIntent === 'ReportFailedTx' && nodeIdx === 0) ||
                    (activeIntent === 'CheckBalance' && nodeIdx === 1) ||
                    (activeIntent === 'ReportWrongTx' && nodeIdx === 2) ||
                    (activeIntent === 'DeductedNoArrival' && nodeIdx === 3) ||
                    (activeIntent === 'AtmSwallowedCard' && nodeIdx === 4)
                  );

                  return (
                    <div
                      key={nodeIdx}
                      className="relative flex items-center justify-center group"
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-mono font-bold transition-all duration-300 select-none ${
                          isActiveOutputNode 
                            ? 'bg-rose-500 border-rose-600 text-white ring-4 ring-rose-200 scale-120 animate-bounce'
                            : stage.active
                            ? 'bg-white border-indigo-500 text-indigo-700 shadow-sm'
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}
                        title={`Activation Node Weight: ${weight}`}
                      >
                        {label || Math.floor(weight * 100)}
                      </div>

                      {/* Ripple pulsing dot if model is computing */}
                      {isPulseStage && (
                        <span className="absolute -inset-1 rounded-full border border-indigo-500 animate-ping opacity-75 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-[8px] text-gray-500 font-mono mt-3 text-center hidden md:block">
                {stage.nodes.length} nodes
              </div>
            </div>
          );
        })}

        {/* Dynamic network graph links drawn dynamically using absolute SVGs overlaying the layers */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Draw lines between stage centers */}
            <line x1="10%" y1="50%" x2="30%" y2="50%" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="30%" y1="50%" x2="50%" y2="50%" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="70%" y2="50%" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="70%" y1="50%" x2="90%" y2="50%" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>

      {/* Node inspector panel showing details on hover */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-150 rounded-xl min-h-[52px] flex items-start gap-2.5 text-xs text-gray-600">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          {hoveredNode ? (
            <div>
              <span className="font-bold text-gray-800">{hoveredNode.layer}</span> — {hoveredNode.details}
            </div>
          ) : (
            <div className="text-gray-500 font-mono text-[11px]">
              Tip: Hover over any neural layer block above to inspect architectural properties. Trigger speech queries to watch activations ripple in real-time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
