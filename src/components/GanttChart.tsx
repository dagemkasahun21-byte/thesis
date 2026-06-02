/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GANTT_TASKS, BUDGET_ITEMS } from '../data';
import { Clock, Calendar, Coins, CheckCircle, HelpCircle } from 'lucide-react';

export default function GanttChart() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'budget'>('timeline');

  // Calculate total budget in Ethiopian Birr
  const totalBudget = BUDGET_ITEMS.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 overflow-hidden id-gantt-root">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-150 pb-4 mb-6 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-sans tracking-tight">
            Thesis Project Governance & Planning
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Addis Ababa University • 6-Month GDS Master's Proposal
          </p>
        </div>

        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200/60 self-start">
          <button
            id="gantt-tab-timeline"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-950'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Timeline Gantt
          </button>
          <button
            id="gantt-tab-budget"
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'budget'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-950'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Estimated Budget
          </button>
        </div>
      </div>

      {activeTab === 'timeline' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-12 gap-2 text-center text-[10px] font-mono font-medium text-gray-500 border-b border-gray-100 pb-2">
            <span className="col-span-4 text-left font-sans pl-2">TASK TITLE</span>
            <span className="col-span-1">FEB</span>
            <span className="col-span-1">MAR</span>
            <span className="col-span-1">APR</span>
            <span className="col-span-1">MAY</span>
            <span className="col-span-1">JUN</span>
            <span className="col-span-1">JUL</span>
            <span className="col-span-2 text-right pr-2">STATUS</span>
          </div>

          <div className="space-y-4">
            {GANTT_TASKS.map((task) => {
              const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
              const startIndex = months.indexOf(task.startMonth);
              const endIndex = months.indexOf(task.endMonth);
              
              // Generate CSS spacing grids 
              const colOffset = startIndex;
              const colSpan = endIndex - startIndex + 1;

              return (
                <div key={task.id} className="grid grid-cols-12 items-center text-xs group py-1 border-b border-gray-50 last:border-0">
                  {/* Task details */}
                  <div className="col-span-4 pl-2 pr-4">
                    <h4 className="font-semibold text-gray-800 font-sans group-hover:text-indigo-600 transition-colors">
                      {task.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                      {task.description}
                    </p>
                  </div>

                  {/* Horizontal Gantt timeline bar representation */}
                  <div className="col-span-6 relative h-6 bg-gray-50 rounded-md overflow-hidden border border-gray-100/50">
                    <div
                      className="absolute h-full rounded-md shadow-sm transition-all duration-300"
                      style={{
                        left: `${(colOffset / 6) * 100}%`,
                        width: `${(colSpan / 6) * 100}%`,
                        backgroundColor: task.color + '20',
                        borderColor: task.color,
                        borderWidth: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}
                    >
                      {/* Active progress segment inside bar */}
                      <div
                        className="h-full rounded-l-md opacity-35 transition-all duration-500"
                        style={{
                          backgroundColor: task.color,
                          width: `${task.progress}%`,
                        }}
                      />
                      <span className="absolute left-2 text-[10px] font-mono font-bold" style={{ color: task.color }}>
                        {task.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Status element */}
                  <div className="col-span-2 text-right pr-2 font-mono text-[10px]">
                    {task.progress === 100 ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full font-sans font-bold inline-flex items-center gap-1 leading-none select-none">
                        <CheckCircle className="w-2.5 h-2.5" /> Done
                      </span>
                    ) : task.progress > 0 ? (
                      <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-sans font-bold inline-flex items-center gap-1 leading-none select-none">
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-400 bg-gray-50 px-2 py-1 rounded-full font-sans inline-flex items-center gap-1 leading-none select-none">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100/60 rounded-xl text-xs text-indigo-950 flex gap-3 items-start">
            <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Thesis Phase Context Overview</span>
              Academic milestones target a structured cascaded vs end-to-end SLU system benchmarking over Amharic acoustics, completing empirical test suites by <strong>late June 2026</strong>.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-[10px] font-mono font-medium text-gray-500 uppercase">
                  <th className="py-2.5 pl-2 font-sans">No.</th>
                  <th className="py-2.5 font-sans">Item Name</th>
                  <th className="py-2.5 text-center font-sans">Quantity</th>
                  <th className="py-2.5 text-center font-sans">Unit</th>
                  <th className="py-2.5 text-right font-sans">Unit Price (Birr)</th>
                  <th className="py-2.5 text-right pr-2 font-sans">Total Price (Birr)</th>
                </tr>
              </thead>
              <tbody>
                {BUDGET_ITEMS.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 pl-2 font-mono text-gray-500">{idx + 1}</td>
                    <td className="py-3 font-semibold text-gray-800">{item.itemName}</td>
                    <td className="py-3 text-center font-mono text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-center text-gray-500">{item.unit}</td>
                    <td className="py-3 text-right font-mono text-gray-600">{item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono text-gray-900 font-semibold pr-2">{item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 border-t-2 border-gray-150 font-semibold text-gray-900">
                  <td className="py-3.5 pl-2" colSpan={4}>TOTAL ACADEMIC BUDGET PROJECTED</td>
                  <td className="py-3.5 text-right text-gray-500 text-[10px] uppercase font-mono font-normal">Ethiopian Birr</td>
                  <td className="py-3.5 text-right font-mono font-bold text-sm text-indigo-700 pr-2">
                    {totalBudget.toLocaleString()} ETB
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 p-4 bg-gray-50 border border-gray-200/50 rounded-xl items-start">
            <HelpCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold block text-gray-800 mb-1">Financial Ingress Ethics Note</span>
              These costs reflect localized stationery, bindings, and commuter fees required to retrieve call recordings from the <strong>EthSwitch</strong> physical infrastructure. Deep computing processing clusters are hosted in local GPU environments.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
