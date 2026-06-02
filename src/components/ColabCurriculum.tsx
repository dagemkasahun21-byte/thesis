/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { COLAB_STEPS } from '../data';
import { FileCode, BookOpen, Check, Copy, Award, ArrowRight } from 'lucide-react';

export default function ColabCurriculum() {
  const [activeStepId, setActiveStepId] = useState<string>(COLAB_STEPS[0].id);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const activeStep = COLAB_STEPS.find((s) => s.id === activeStepId) || COLAB_STEPS[0];

  // Helper routine to execute clipboard copy
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy code cell", err);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 id-colab-curriculum">
      <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-6">
        <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-sans tracking-tight">
            Step-by-Step Google Colab Learning Modules
          </h3>
          <p className="text-xs text-gray-500 font-mono">
            Interactive Jupyter Python cells designed for the Addis Ababa University thesis
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Module Selection Navigation Side */}
        <div className="w-full lg:w-1/3 flex flex-col gap-2">
          {COLAB_STEPS.map((step) => {
            const isActive = step.id === activeStepId;
            return (
              <button
                key={step.id}
                id={`colab-menu-${step.id}`}
                onClick={() => {
                  setActiveStepId(step.id);
                  setCopySuccess(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-xs flex items-start gap-3 select-none cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 ring-2 ring-indigo-500/10'
                    : 'border-gray-150 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {step.id.split('-')[1]}
                </div>
                <div>
                  <h4 className="font-bold block text-gray-950 font-sans">{step.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{step.subtitle}</p>
                </div>
              </button>
            );
          })}

          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h5 className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide mb-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              Academic Curriculum Kit
            </h5>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              These cells run natively on free-tier <strong>T4 Tensor GPUs</strong> via Google Colab. Copy blocks directly, or import the pipeline into your notebooks.
            </p>
          </div>
        </div>

        {/* Selected Module Detail & Interactive Code Code display Side */}
        <div className="w-full lg:w-2/3 border border-gray-150 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase tracking-widest">{activeStep.difficulty} MODULE</span>
                <h4 className="text-base font-bold text-gray-900 mt-1">{activeStep.title}</h4>
                <p className="text-xs text-gray-500 font-medium italic">{activeStep.subtitle}</p>
              </div>

              {/* Colab launch button */}
              <a
                href="https://colab.research.google.com/"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-600 text-white rounded-lg text-[11px] font-bold hover:bg-amber-700 transition shadow-sm select-none"
              >
                <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Colab Badge" className="h-4" />
                Launch Empty Colab
              </a>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">{activeStep.description}</p>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider block mb-1">TARGET OBJECTIVE</span>
              <p className="text-[11px] text-gray-700 leading-relaxed bg-indigo-50/20 border-l-2 border-indigo-400 pl-2.5 py-1.5 rounded-r-lg">
                {activeStep.objective}
              </p>
            </div>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider block mb-1.5">REQUIRED PYTHON LIBS</span>
              <div className="flex flex-wrap gap-1.5">
                {activeStep.keyLibraries.map((lib) => (
                  <span key={lib} className="text-[10px] font-semibold font-mono bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md select-none transition-all">
                    {lib}
                  </span>
                ))}
              </div>
            </div>

            {/* Code cell display */}
            <div className="relative border border-gray-200 rounded-xl bg-gray-50 overflow-hidden mt-3 max-h-[350px] flex flex-col justify-between">
              <div className="flex justify-between items-center bg-gray-200/50 px-3.5 py-2 border-b border-gray-200">
                <span className="text-[10px] font-mono font-bold text-gray-500 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-gray-400" />
                  {activeStep.filePrefix}.py
                </span>
                <button
                  id={`btn-copy-code-${activeStep.id}`}
                  onClick={() => handleCopyCode(activeStep.codeSnippet)}
                  className="p-1 px-2 hover:bg-white text-[10px] text-gray-600 hover:text-gray-900 rounded border border-gray-300 hover:border-gray-400 transition flex items-center gap-1 cursor-pointer select-none"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      <span className="text-green-700 font-bold">Copied cell!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Jupyter Cell</span>
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-auto p-4 flex-1">
                <pre className="text-[11px] font-mono leading-relaxed text-gray-800 parser-code-block block whitespace-pre">
                  <code>{activeStep.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
