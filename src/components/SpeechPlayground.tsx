/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useEffect, FormEvent, useRef } from 'react';
import { AMHARIC_SAMPLES } from '../data';
import { AmharicIntentSample, SimulationResult } from '../types';
import { Play, Volume2, Mic, Settings, Activity, ArrowRight, CheckCircle, RefreshCw, Layers, UploadCloud, Trash2, HelpCircle } from 'lucide-react';
import NetworkVisualizer from './NetworkVisualizer';

export default function SpeechPlayground() {
  const [samples, setSamples] = useState<AmharicIntentSample[]>(AMHARIC_SAMPLES);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(AMHARIC_SAMPLES[0].id);
  const [pipelineTrack, setPipelineTrack] = useState<'cascaded' | 'e2e'>('cascaded');
  
  // Custom upload and recording state
  const [newTitle, setNewTitle] = useState('');
  const [newAmharicText, setNewAmharicText] = useState('');
  const [newEnglishMeaning, setNewEnglishMeaning] = useState('');
  const [newAudioFilename, setNewAudioFilename] = useState('');
  const [newCategory, setNewCategory] = useState<'Balance Inquiry' | 'Payment Failure' | 'Transaction Issue' | 'Service Complaint' | 'General Inquiry'>('Transaction Issue');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<any | null>(null);
  const audioChunksRef = useRef<any[]>([]);

  // Local file picker helper
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isMicSimulating, setIsMicSimulating] = useState(false);
  const [micSeconds, setMicSeconds] = useState(0);

  const [simState, setSimState] = useState<'idle' | 'spectrogram' | 'acoustic' | 'tokenization' | 'translation' | 'nlu' | 'completed'>('idle');
  const [inferenceResult, setInferenceResult] = useState<SimulationResult | null>(null);

  const activeSample = samples.find((s) => s.id === selectedSampleId) || samples[0];

  // Simulated Mic speaking countdown
  useEffect(() => {
    if (!isMicSimulating) return;

    if (micSeconds > 0) {
      const timer = setTimeout(() => {
        setMicSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsMicSimulating(false);
      // Automatically load a randomized sample as the spoken mic translation
      const randomIndex = Math.floor(Math.random() * samples.length);
      setSelectedSampleId(samples[randomIndex].id);
      triggerInference(samples[randomIndex]);
    }
  }, [isMicSimulating, micSeconds, samples]);

  const triggerMicSimulation = () => {
    setIsMicSimulating(true);
    setMicSeconds(3); // 3 seconds virtual speaking
    setSimState('idle');
  };

  // Run stepping inference simulation
  const triggerInference = (sampleOverride?: AmharicIntentSample) => {
    const targetSample = sampleOverride || activeSample;
    setSimState('spectrogram');
    setInferenceResult(null);

    // Timeline steps for the simulator
    // Total simulated latency calculations
    const cLatency = Math.round(290 + Math.random() * 30);
    const e2eLatency = Math.round(195 + Math.random() * 20);

    const result: SimulationResult = {
      step: 'completed',
      cascadedPath: {
        wer: targetSample.audioFilename ? 18.45 : 22.31,
        cer: targetSample.audioFilename ? 6.12 : 8.04,
        textResult: targetSample.amharicText,
        intentLabel: targetSample.intentLabel,
        confidence: targetSample.audioFilename ? 96.5 : 94.8,
        latencyMs: cLatency,
        logTrace: [
          `[0.0s] Loaded raw custom audio wave metadata: "${targetSample.audioFilename || 'default.wav'}" SR=16kHz, length=${targetSample.estimatedDurationSec}s`,
          `[0.1s] Mel-Spectrogram acoustic analysis complete. Shape=[1, 80, 240]`,
          `[0.15s] Decoding Acoustic parameters using CTC-Transformer layers (Loss optimized)`,
          `[0.21s] Completed prediction matrix output. Generating high-precision written transcriptions...`,
          `[0.26s] Transcribed written Amharic output: "${targetSample.amharicText}"`,
          `[0.29s] Initializing intent resolution with BiGRU + Self-Attention layers`,
          `[0.31s] Successfully resolved customer intent: "${targetSample.intentLabel}" (Confidence=${targetSample.audioFilename ? '96.5' : '94.8'}%)`
        ]
      },
      e2ePath: {
        intentLabel: targetSample.intentLabel,
        confidence: targetSample.audioFilename ? 93.8 : 91.2,
        latencyMs: e2eLatency,
        logTrace: [
          `[0.0s] Loaded raw custom audio wave: "${targetSample.audioFilename || 'default.wav'}" SR=16kHz`,
          `[0.1s] Mel-Spectrogram features extracted. Log-power coordinates normal. Shape=[1, 80, 240]`,
          `[0.13s] Input sequence projection. Processing local grid blocks with 2D-CNN Kernels`,
          `[0.16s] Transformer neural sequencing. Multi-Heads calculating acoustic frame weights`,
          `[0.19s] Temporal compression. Applying linear global Average pooling logic`,
          `[0.21s] Direct intent map matched. Category successfully resolved: "${targetSample.intentLabel}" (Confidence=${targetSample.audioFilename ? '93.8' : '91.2'}%).`
        ],
        activationIndices: [0, 1, 3]
      }
    };

    // Sequential timing transitions for highly immersive visuals represent layers triggering
    setTimeout(() => {
      setSimState('acoustic');
      setTimeout(() => {
        setSimState(pipelineTrack === 'cascaded' ? 'tokenization' : 'nlu');
        setTimeout(() => {
          setSimState('completed');
          setInferenceResult(result);
        }, 500);
      }, 500);
    }, 500);
  };

  // Start micro recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setNewAudioFilename(`recorded_amharic_voice_${Date.now().toString().slice(-4)}.m4a`);
        if (!newTitle.trim()) {
          setNewTitle("Live Recorded Voice Input");
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.warn("Could not start micro recording:", err);
      alert("Microphone permission denied or not supported in this frame. Please select/upload a physical audio file from your device instead or input details manually.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop());
    }
  };

  // Handle local file selection
  const handleLocalFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAudioFilename(file.name);
      if (!newTitle.trim()) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      const fileUrl = URL.createObjectURL(file);
      setRecordedAudioUrl(fileUrl);
    }
  };

  // Delete a customized sample
  const handleDeleteSample = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = samples.filter((s) => s.id !== id);
    setSamples(updated);
    if (selectedSampleId === id && updated.length > 0) {
      setSelectedSampleId(updated[0].id);
      setSimState('idle');
      setInferenceResult(null);
    }
  };

  // Submit handler for adding a new vocal template
  const handleAddNewTemplate = (e: FormEvent) => {
    e.preventDefault();
    if (!newAmharicText.trim() || !newEnglishMeaning.trim() || !newAudioFilename.trim()) {
      alert("Please fill in all requested fields. You can select an audio file, record your voice, or load a preset double charge example.");
      return;
    }

    // Creating beautiful random points for our visualizer
    const customPoints = Array.from({ length: 31 }, () => Math.round((0.1 + Math.random() * 0.85) * 100) / 100);

    const generatedIntent = newCategory === 'Balance Inquiry' ? 'CheckBalance' :
                            newCategory === 'Payment Failure' ? 'RefundDoubleCharge' :
                            newCategory === 'Transaction Issue' ? 'ReportFailedTx' :
                            newCategory === 'Service Complaint' ? 'AtmSwallowedCard' : 'GeneralInquiry';

    const newSample: AmharicIntentSample = {
      id: `custom-${Date.now()}`,
      title: newTitle || `Custom Sound (${newAudioFilename.split('.')[0]})`,
      audioFilename: newAudioFilename,
      amharicText: newAmharicText,
      transliteration: "Custom vocal transcription",
      translation: newEnglishMeaning,
      category: newCategory,
      intentLabel: generatedIntent,
      audioFileUrl: recordedAudioUrl || undefined,
      waveformPoints: customPoints,
      estimatedDurationSec: Math.round((2.5 + Math.random() * 2) * 10) / 10,
      entities: [
        { name: "Input Source", value: "Voice Upload", startIdx: 0, endIdx: 2 }
      ]
    };

    setSamples([...samples, newSample]);
    setSelectedSampleId(newSample.id);
    setNewTitle('');
    setNewAmharicText('');
    setNewEnglishMeaning('');
    setNewAudioFilename('');
    setRecordedAudioUrl(null);
    setUploadSuccessMsg(`Successfully uploaded vocal template "${newSample.title}" linked to file "${newAudioFilename}"!`);
    
    // Clear success message after 5 seconds
    setTimeout(() => setUploadSuccessMsg(''), 5000);
    setShowUploadForm(false);
    
    // Trigger automatically to show the user the custom waveform and simulated execution
    setSimState('idle');
    setInferenceResult(null);
  };

  // Helper template button trigger
  const handleLoadDoubleChargeSample = () => {
    setNewTitle("Double Charge Inquiry");
    setNewAmharicText("ሰላም፣ በሂሳቤ ላይ አንድ አይነት ክፍያ ሁለት ጊዜ ተፈጽሟል። እባካችሁ አንዱን ተመላሽ (refund) አድርጉልኝ።");
    setNewEnglishMeaning("Hello, a single charge was processed twice on my account. Please refund one of them.");
    setNewAudioFilename("The Double Charge.m4a");
    setNewCategory("Payment Failure");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 id-speech-playground">
      <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-sans tracking-tight flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            Spoken Language Understanding (SLU) Sandbox
          </h3>
          <p className="text-xs text-gray-500 font-mono">
            Execute real-time Amharic voice intents trace comparing Cascaded vs. End-to-End neural paths
          </p>
        </div>

        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
          <button
            id="playground-track-cascaded"
            onClick={() => {
              setPipelineTrack('cascaded');
              setSimState('idle');
              setInferenceResult(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all select-none ${
              pipelineTrack === 'cascaded' ? 'bg-white shadow-sm text-indigo-700 font-bold' : 'text-gray-500'
            }`}
          >
            Cascaded Pipeline
          </button>
          <button
            id="playground-track-e2e"
            onClick={() => {
              setPipelineTrack('e2e');
              setSimState('idle');
              setInferenceResult(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all select-none ${
              pipelineTrack === 'e2e' ? 'bg-white shadow-sm text-indigo-700 font-bold' : 'text-gray-500'
            }`}
          >
            End-to-End System
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Sample selection and input control side */}
        <div className="space-y-4">
          <div className="bg-gray-50/50 border border-gray-150 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 font-mono uppercase">
                <Settings className="w-3.5 h-3.5 text-indigo-500" />
                SELECT SPEECH SAMPLE (EthSwitch Customer Inquiries)
              </h4>
              <button
                id="btn-toggle-vocal-upload"
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-150 px-2 py-1 rounded-lg transition-all"
              >
                {showUploadForm ? "Close Form" : "Upload Voice Reference"}
              </button>
            </div>

            {uploadSuccessMsg && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] leading-relaxed">
                {uploadSuccessMsg}
              </div>
            )}

            {/* Expansible Audio Form Imputation Container */}
            {showUploadForm && (
              <form onSubmit={handleAddNewTemplate} className="mb-4 p-3 bg-white rounded-lg border border-indigo-150 space-y-3 shadow-inner">
                <div className="flex justify-between items-center border-b border-indigo-50 pb-1.5">
                  <span className="text-[10px] font-extrabold text-indigo-950 font-mono tracking-wide">NEW AMHARIC VOCAL REFERENCE</span>
                  <button
                    type="button"
                    onClick={handleLoadDoubleChargeSample}
                    className="text-[9px] font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-150"
                  >
                    Load "Double Charge" Preset
                  </button>
                </div>

                {/* 1. File Upload / Mic Recording Tools */}
                <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-150 space-y-2">
                  <span className="block text-[9px] text-gray-500 font-mono font-bold uppercase tracking-wide">
                    Step 1: Input Real Amharic Audio (Microphone or File)
                  </span>
                  
                  <div className="flex gap-2">
                    {/* Hidden Input File Picker */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLocalFileSelection} 
                      accept="audio/*" 
                      className="hidden" 
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold border border-indigo-100 transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload Sound File
                    </button>

                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                        isRecording 
                          ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse font-extrabold' 
                          : 'bg-rose-50/50 border-rose-105 text-rose-800 hover:bg-rose-150/40'
                      }`}
                    >
                      <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-red-505 animate-bounce' : 'text-rose-500'}`} />
                      {isRecording ? "Stop Ingestion..." : "Record Mic Sound"}
                    </button>
                  </div>

                  {/* Dynamic Sound Check Player Preview */}
                  {recordedAudioUrl && (
                    <div className="bg-white p-2 border border-indigo-100 rounded-md flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                        <span>AUDIO INGESTED PREVIEW</span>
                        <button 
                          type="button" 
                          onClick={() => { setRecordedAudioUrl(null); setNewAudioFilename(''); }} 
                          className="text-red-500 hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                      <audio src={recordedAudioUrl} controls className="h-7 w-full max-w-full text-[10px]" />
                    </div>
                  )}
                </div>

                {/* 2. Textual Meta Coordinates */}
                <div className="space-y-2">
                  <span className="block text-[9px] text-gray-500 font-mono font-bold uppercase tracking-wide">
                    Step 2: Define Scientific Transcripts
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8.5px] text-gray-400 font-mono font-bold uppercase mb-0.5">Reference Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Card Swallowed"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full text-[11px] border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] text-gray-400 font-mono font-bold uppercase mb-0.5">Audio File Path</label>
                      <input
                        type="text"
                        placeholder="e.g. CardBlocked.m4a"
                        value={newAudioFilename}
                        onChange={(e) => setNewAudioFilename(e.target.value)}
                        className="w-full text-[11px] border border-gray-200 rounded px-2 py-1 focus:outline-indigo-400 bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8.5px] text-gray-400 font-mono font-bold uppercase mb-0.5">Amharic Voice text script</label>
                    <input
                      type="text"
                      placeholder="በአማርኛ ይጻፉ... (e.g. ቀሪ ሂሳብ ማየት እፈልጋለሁ።)"
                      value={newAmharicText}
                      onChange={(e) => setNewAmharicText(e.target.value)}
                      className="w-full text-[11px] border border-gray-200 rounded px-2 py-1 focus:outline-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[8.5px] text-gray-400 font-mono font-bold uppercase mb-0.5">English Meaning translation</label>
                    <input
                      type="text"
                      placeholder="e.g. I would like to check my overall balance."
                      value={newEnglishMeaning}
                      onChange={(e) => setNewEnglishMeaning(e.target.value)}
                      className="w-full text-[11px] border border-gray-200 rounded px-2 py-1 focus:outline-indigo-400"
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-between pt-1 border-t border-indigo-50">
                  <div>
                    <label className="block text-[8.5px] text-gray-400 font-mono font-bold uppercase mb-0.5">Intent Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="text-[10px] border border-gray-200 rounded p-1 bg-white focus:outline-indigo-400 font-sans"
                    >
                      <option value="Balance Inquiry">Balance Inquiry</option>
                      <option value="Payment Failure">Payment Failure</option>
                      <option value="Transaction Issue">Transaction Issue</option>
                      <option value="Service Complaint">Service Complaint</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3 py-1.5 rounded transition-all cursor-pointer"
                  >
                    Save & Map to Waveform
                  </button>
                </div>
              </form>
            )}
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {samples.map((sample) => {
                const isSelected = sample.id === selectedSampleId;
                const isCustom = sample.id.startsWith('custom-');
                return (
                  <button
                    key={sample.id}
                    id={`speech-sample-btn-${sample.id}`}
                    onClick={() => {
                      setSelectedSampleId(sample.id);
                      setSimState('idle');
                      setInferenceResult(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex justify-between items-center select-none cursor-pointer ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-50/40 font-semibold text-indigo-950'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="max-w-[70%] text-left">
                      <span className="font-bold text-gray-900 block truncate">{sample.title || sample.amharicText}</span>
                      <span className="text-[10px] text-gray-400 block truncate italic font-medium">{sample.amharicText}</span>
                      {sample.audioFilename && (
                        <span className="text-[8.5px] font-mono text-indigo-600 bg-indigo-50/60 px-1.5 py-0.2 rounded mt-0.5 inline-block border border-indigo-100">
                          Wave: {sample.audioFilename}
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-gray-100 rounded-full text-indigo-700 block">
                        {sample.category}
                      </span>
                      <span className="text-[9px] text-gray-400 italic block">
                        {sample.translation.length > 22 ? sample.translation.substring(0, 21) + '...' : sample.translation}
                      </span>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSample(sample.id, e)}
                          className="text-gray-400 hover:text-red-500 p-0.5 rounded transition hover:bg-gray-100 mt-0.5 self-end"
                          title="Remove custom template"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            {/* Live audio simulation start */}
            <button
              id="btn-play-inference"
              onClick={() => triggerInference()}
              disabled={simState !== 'idle' && simState !== 'completed' || isMicSimulating}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-3 px-4 text-xs font-bold shadow-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 select-none cursor-pointer disabled:opacity-40"
            >
              <Play className="w-4 h-4" />
              Run Model Inference Trace
            </button>

            {/* Virtual Amharic mic speech */}
            <button
              id="btn-trigger-mic"
              onClick={triggerMicSimulation}
              disabled={simState !== 'idle' && simState !== 'completed' || isMicSimulating}
              className="px-4 py-3 border border-gray-200 hover:border-indigo-400 text-gray-700 hover:text-indigo-700 bg-white rounded-xl text-xs font-bold hover:bg-indigo-50/20 transition flex items-center gap-2 select-none cursor-pointer disabled:opacity-40"
            >
              <Mic className="w-4 h-4 text-rose-500 shrink-0" />
              {isMicSimulating ? `Speaking... ${micSeconds}s` : "Simulate Amharic Voice"}
            </button>
          </div>

          {/* Active Audio Waveform Graph representation */}
          <div className="border border-gray-150 p-4 rounded-xl relative overflow-hidden bg-gray-950/5 select-none">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-400 font-mono flex items-center gap-1.5 uppercase">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                Speech Vocal Waveform Amplitude Index
              </span>
              <span className="text-[9px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                16kHz PCM
              </span>
            </div>

            <div className="h-16 flex items-center justify-between gap-1 mt-1">
              {activeSample.waveformPoints.map((point, idx) => {
                const isPlaying = simState !== 'idle' && simState !== 'completed';
                // Oscillating bounce height if simulating
                const calculatedHeight = isPlaying 
                  ? `${Math.max(10, point * 100 * (0.8 + 0.4 * Math.sin(Date.now() / 150 + idx)))}%` 
                  : `${Math.max(8, point * 100)}%`;

                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isMicSimulating 
                        ? 'bg-rose-500 opacity-80' 
                        : isPlaying 
                        ? 'bg-indigo-500' 
                        : 'bg-gray-400'
                    }`}
                    style={{ height: calculatedHeight }}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-[9px] font-mono text-gray-400 mt-2.5">
              <span>0.0s</span>
              <span className="italic block max-w-[80%] truncate text-center font-bold text-gray-600">
                "{activeSample.transliteration}"
              </span>
              <span>{activeSample.estimatedDurationSec}s</span>
            </div>

            {/* Dynamic Sound Audition Player */}
            {activeSample.audioFileUrl ? (
              <div className="mt-3 pt-3 border-t border-gray-200/50 flex flex-col gap-1.5">
                <span className="text-[9.5px] font-mono font-bold text-indigo-600 flex items-center gap-1 uppercase tracking-wide">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-505 animate-pulse shrink-0" /> Playback Real Input Wave Track
                </span>
                <audio src={activeSample.audioFileUrl} controls className="h-7 w-full border border-indigo-100/70 rounded bg-white text-xs" />
              </div>
            ) : (
              <div className="mt-3 pt-2.5 border-t border-gray-150 flex items-center justify-between text-[9px] text-gray-400 font-mono">
                <span className="flex items-center gap-1.5 select-none">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                  Operating local digital signal synthesizer
                </span>
                <span className="text-[8px] uppercase font-bold tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">Synthetic</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Live layer graph visualizer triggers */}
        <NetworkVisualizer
          currentPath={pipelineTrack}
          simulateStep={simState}
          activeIntent={simState === 'completed' ? activeSample.intentLabel : undefined}
        />
      </div>

      {/* Simulation Result analysis and step logs */}
      {simState !== 'idle' && (
        <div id="playground-results-board" className="border border-gray-150 bg-gray-50/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
            <h4 className="text-xs font-bold text-gray-700 tracking-wider uppercase font-mono">
              Inference Trace Trace logs & Execution Logs
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Step execution logs lists */}
            <div className="md:col-span-2 bg-gray-950 p-4 rounded-xl text-gray-300 font-mono text-[11px] leading-relaxed max-h-[190px] overflow-auto select-none">
              <span className="text-[9px] text-indigo-400 block mb-2 uppercase tracking-widest font-bold border-b border-gray-800 pb-1">
                SYSTEM DEEP LEARNING SHELL LOGS
              </span>
              
              <div className="space-y-1.5">
                {(pipelineTrack === 'cascaded' ? inferenceResult?.cascadedPath : inferenceResult?.e2ePath)?.logTrace.map((log, i) => (
                  <div key={i} className="flex gap-2 text-indigo-300">
                    <span className="text-gray-500 shrink-0">▸</span>
                    <span>{log}</span>
                  </div>
                ))}
                {simState !== 'completed' && (
                  <div className="text-indigo-400 animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin shrink-0" /> Executing next network node forward passes...
                  </div>
                )}
              </div>
            </div>

            {/* Resolved intents metrics outputs block */}
            <div className="bg-white border border-gray-200/60 p-4 rounded-xl flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[9px] text-gray-400 font-mono tracking-wider font-bold block uppercase mb-1">RESOLVED SEMANTICS</span>
                
                {simState === 'completed' ? (
                  <div className="space-y-2 mt-1.5">
                    <div>
                      <span className="text-[10px] text-gray-500 font-medium">Predicted Intent:</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md ml-1.5 font-mono">
                        {(pipelineTrack === 'cascaded' ? inferenceResult?.cascadedPath.intentLabel : inferenceResult?.e2ePath.intentLabel)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-medium font-sans">Confidence Precision:</span>
                      <span className="text-xs font-bold text-gray-800 ml-1.5 font-mono">
                        {(pipelineTrack === 'cascaded' ? inferenceResult?.cascadedPath.confidence : inferenceResult?.e2ePath.confidence)}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-medium">Latency:</span>
                      <span className={`text-xs font-bold ml-1.5 font-mono ${pipelineTrack === 'e2e' ? 'text-green-600' : 'text-gray-800'}`}>
                        {(pipelineTrack === 'cascaded' ? inferenceResult?.cascadedPath.latencyMs : inferenceResult?.e2ePath.latencyMs)}ms
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-[11px] text-gray-400 font-mono animate-pulse">
                    Computing feed-forward layers...
                  </div>
                )}
              </div>

              {simState === 'completed' && activeSample.entities.length > 0 && (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <span className="text-[9px] text-gray-400 font-mono tracking-wider font-bold block uppercase mb-1">EXTRACTED ENTITIES</span>
                  <div className="space-y-1.5 mt-1.5">
                    {activeSample.entities.map((en, index) => (
                      <div key={index} className="flex flex-wrap items-center justify-between text-[10px]">
                        <span className="text-gray-500 font-medium">{en.name}:</span>
                        <span className="font-mono bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                          {en.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
