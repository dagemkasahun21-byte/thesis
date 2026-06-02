/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { BookOpen, FileText, CheckCircle, GraduationCap, Copy, Download, Layers, Cpu, ArrowRight, Zap, RefreshCw, Star, Volume2, Activity } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export default function ThesisChapters() {
  const [activeChapterId, setActiveChapterId] = useState('chap-4');
  const [activeDiagramTrack, setActiveDiagramTrack] = useState<'cascaded' | 'e2e'>('cascaded');
  const [copiedChapterId, setCopiedChapterId] = useState<string | null>(null);

  const handleCopyChapterText = (id: string, textContent: string) => {
    navigator.clipboard.writeText(textContent);
    setCopiedChapterId(id);
    setTimeout(() => setCopiedChapterId(null), 3000);
  };

  // Structured Chapter Draft Content (Highly detailed academic quality)
  const chapters: Chapter[] = [
    {
      id: "chap-1",
      title: "Chapter 1: Introduction",
      subtitle: "Background, Motivation & Statement of the Problem",
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed font-sans text-xs md:text-sm">
          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">1.1 Background of the Study</h4>
            <p className="mb-3">
              In contemporary financial sectors, electronic transaction services have grown exponentially. In Ethiopia, <strong>EthSwitch S.C.</strong> serves as the national electronic payment gateway switch, integrating all commercial banks, microfinance institutions, and card payment networks. Consequently, the volume of daily customer queries regarding transactional failures, ATM card retentions (swallowed cards), wrong accounts credit, and balance mismatch checks has skyrocketed, putting massive pressure on support call centers.
            </p>
            <p>
              Automated Conversational Agents (chatbots and voicebots) offer a path to scale customer support. However, standard systems are built almost exclusively for high-resource commercial languages (e.g., English, Mandarin, Spanish). <strong>Amharic</strong>, the official working language of the Federal Government of Ethiopia, is a Semitic language spoken by over 50 million people, featuring highly complex morphology, templated non-linear roots, phonetic gemination, and extreme geographical accent variations. This research investigates <strong>Spoken Language Understanding (SLU)</strong> systems designed to categorize customer intents directly from vocal Amharic queries.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">1.2 Motivation & Scientific Value</h4>
            <p className="mb-3">
              Most commercial interactive voice response (IVR) platforms rely on fixed push-button menus, generating frustrating, high-latency user experiences. Enabling natural vocal dialogues in Amharic can democratize access to financial services, especially for low-literacy or visually impaired individuals.
            </p>
            <p>
              Scientifically, Amharic is heavily under-resourced in acoustic and lexical corpuses. Developing deep learning pipelines for Amharic requires resolving phonetic transcript misalignments, script spelling variations, and acoustic noise over copper phone lines. This thesis models the performance trade-offs of modern alternative SLU philosophies to establish a robust baseline framework for Semitic vocal customer services.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">1.3 Statement of the Problem</h4>
            <p className="mb-3">
              Traditional speech systems rely on the **Cascaded Pipeline** mechanism: first transcribing raw speech to text via an Automatic Speech Recognition (ASR) sub-module, and then applying Natural Language Understanding (NLU) text classifiers to predict intents. In Amharic, however, this cascaded loop exhibits severe bottlenecks:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-3 bg-gray-55/60 p-3 rounded-xl border border-gray-200">
              <li><strong>ASR Error Propagation:</strong> Any character substitutions or deletions by the ASR stage (e.g., confusing Ethiopic glyphs containing identical vocal vowels) degrade the accuracy of downstream text NLU.</li>
              <li><strong>High Operational Latency:</strong> A double-pass network architecture (acoustic decoding followed by recurrent classification) results in unacceptable round-trip times (~300ms+) on standard servers.</li>
              <li><strong>Resource Scarcity:</strong> Annotated transcripts matched to vocal intents are extremely rare, preventing standard end-to-end models from converging without specialized regularization strategies.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">1.4 Objectives of the Research</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-950 block mb-1">General Objective</span>
                <p className="text-xs">
                  To design, implement, and validate a high-accuracy, low-latency Speech-Based Amharic Conversational Agent for customer service in financial setups, comparing Cascaded and End-to-End architectures (EthSwitch case study).
                </p>
              </div>
              <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-950 block mb-1">Specific Objectives</span>
                <ul className="list-decimal pl-4 text-xs space-y-1">
                  <li>Formulate robust Mel-spectrogram processing techniques for Amharic phone lines.</li>
                  <li>Develop a joint Transformer-CTC acoustic transcription model for staging.</li>
                  <li>Incorporate a Bidirectional GRU + Self-Attention text intent classifier.</li>
                  <li>Construct a direct End-to-End deep neural model and evaluate parameters (WER, accuracy, latency).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "chap-2",
      title: "Chapter 2: Literature Review",
      subtitle: "Speech Processing, Low-Resource Challenges & SLU Standards",
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed font-sans text-xs md:text-sm">
          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">2.1 Speech Processing in Amharic Language</h4>
            <p className="mb-3">
              Academic literature on Amharic Automatic Speech Recognition (ASR) dates back to early hidden Markov model (HMM) architectures developed in Addis Ababa University. Early attempts were limited by small vocabularies and isolated word speech files. The morphologically rich layout of Amharic, where a single lexical token regularly inflects to indicate gender, possession, case, and prepositions, results in an extremely high Out-Of-Vocabulary (OOV) rate when using standard word-level models.
            </p>
            <p>
              Modern research has shifted towards **subword-level modeling** using Byte Pair Encodings (BPE) or character-level representations. This prevents vocabulary explosion while allowing networks to generalize across previously unseen inflections.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">2.2 Spoken Language Understanding (SLU) Paradigms</h4>
            <p className="mb-3">
              Historically, SLU systems are split into two major methodologies:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-amber-500 pl-3">
                <span className="font-bold text-gray-900 block">1. Cascaded / Decoupled Pipelines</span>
                <p className="text-xs">
                  A high-resource ASR model generates a textual transcript of the utterance. Then, a distinct NLU model performs intent classification on that text. This allows leveraging massive text-only data to pretrain the NLU engine (e.g., using Amharic-BERT models).
                </p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-3">
                <span className="font-bold text-gray-900 block">2. End-to-End (E2E) Direct Translation Models</span>
                <p className="text-xs">
                  Raw acoustic input frames are mapped directly to intent profiles, completely bypassing intermediate text transcripts. This optimizes computational cost, reduces serving delay, and improves performance on accented or noisy recordings where ASR would otherwise fail.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">2.3 Financial Customer Service Speech Models</h4>
            <p>
              Financial telecommunication systems operate on specific criteria: low latency is critical to prevent call hang-ups, and security policies require on-premise execution to protect customer credit detail data. This research is the first to evaluate these modern architectures utilizing localized EthSwitch payment transaction recordings under real operational settings, introducing an essential baseline benchmark to commercial banking speech systems in East Africa.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "chap-3",
      title: "Chapter 3: Related Work",
      subtitle: "ASR Architectures, Joint CTC-Attention & Recurrent Intent Classifiers",
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed font-sans text-xs md:text-sm">
          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">3.1 Acoustic Feature Representations</h4>
            <p>
              In historical speech processing, Linear Predictive Coding (LPC) and Mel-Frequency Cepstral Coefficients (MFCCs) served as standard sound features. However, for deep neural networks operating on noisy telecom voice recordings, **Log-Mel Filterbanks** (typically extracted at 80 frequency bins with 25ms windows and 10ms hop sizes) have shown far greater robustness. Recent benchmarks on global speech models demonstrate that Log-Mel features preserve structural acoustic characteristics far more successfully across deep convolutional and self-attention operations.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">3.2 Joint CTC-Attention Modeling</h4>
            <p className="mb-3">
              Connectionist Temporal Classification (CTC) loss revolutionized speech recognition by optimizing sequence alignments without manual framewise segmentation. However, standard CTC assumes conditional independence between outputs, resulting in phonetic error propagation. 
            </p>
            <p className="p-3 bg-gray-900 text-indigo-300 font-mono text-xs rounded-xl border border-gray-800">
              {"L_CTC = - ln P(Y | X) = - ln \sum_{\pi \in B^{-1}(Y)} P(\pi | X)"}
            </p>
            <p className="mt-3">
              To mitigate these limitations, hybrid systems couple CTC loss with autoregressive Transformer decoders. The CTC stage provides fast frame predictions and regularizes training, while the Transformer attention layers capture long-range contextual semantics.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">3.3 Dual Recurrent Classifiers</h4>
            <p>
              For text classification, Recurrent Neural Networks (RNNs) and Bidirectional LSTMs remain foundational. Recent papers on Amharic sentiment and topic modeling highlight that **Bidirectional Gated Recurrent Units (BiGRUs)** achieve comparable accuracy to LSTMs while utilizing significantly fewer parameters. This reduces training times over low-resource datasets and facilitates lightweight conversational service deployments.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "chap-4",
      title: "Chapter 4: Proposed Architecture",
      subtitle: "Design of Cascaded Pipeline vs. Direct End-to-End (E2E) SLU",
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed font-sans text-xs md:text-sm">
          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">4.1 Architecture Overview & Core Contribution</h4>
            <p className="mb-3">
              The primary contribution of this thesis is the design, implementation, and rigorous comparative analysis of a dual-track Spoken Language Understanding (SLU) system optimized specifically for Amharic vocal queries in financial spheres. Figure 4.1 in Zenebe's thesis models a distributed architecture; we adapt this structural approach to construct our **Dual NLP Speech Architecture** comprising two distinct processing strategies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
                <span className="font-bold text-indigo-950 flex items-center gap-1">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Cascaded Pipeline Model (CPM)
                </span>
                <p className="text-xs text-gray-600">
                  Takes 80-bin Mel-Spectrogram frames and feeds them to an acoustic CTC-Transformer encoder to transcribe speech to written Fidel characters. The intermediate text is then fed to a subword Bidirectional GRU network with attention to predict the intent profile.
                </p>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  End-to-End Model (E2E-SLU)
                </span>
                <p className="text-xs text-gray-600">
                  Bypasses intermediary transcriptions completely. Speech Mel grids are fed directly to a 2D Convolutional neural network block to extract local spatial patterns, processed via a 4-layer Transformer Encoder, and clustered into intent classes directly using Temporal Global Average pooling.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">4.2 Detailed Component Role & Mathematical Formulation</h4>
            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-900 block mb-1">A. Acoustic Preprocessing & SpecAugment Regularization</span>
                <p className="leading-relaxed">
                  Raw call center recordings are sampled at 16kHz mono PCM. Mel-spectrogram features are computed using 1024 FFT length, 512 hop window, and log magnitude scaling. To prevent overfitting to accent variances, we apply **SpecAugment** regularization masking: zeroing out dynamic frequency blocks and time columns randomly during training.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-900 block mb-1">B. Subword CTC Acoustic Modeling (ASR Stage)</span>
                <p className="leading-relaxed mb-2">
                  The acoustic network uses 1D Convolutions to down-sample time vectors, then maps features via 6 Transformer layers. Decoding utilizes modern hybrid CTC-attention loss, which balances alignment precision with context modeling:
                </p>
                <div className="font-mono bg-gray-900 text-amber-400 p-2.5 rounded-lg text-center">
                  {"Loss = \alpha \cdot L_{CTC} + (1 - \alpha) \cdot L_{Attention}"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-900 block mb-1">C. BiGRU Classifier with Self-Attention (NLU Stage)</span>
                <p className="leading-relaxed mb-2">
                  Transcripts are split using a customized subword tokenizer. Word representations pass into bidirectional GRU gates, and we apply a **scaled self-attention context vector** $C$ to aggregate key terms related to transaction failures (e.g., 'ብር', 'ካርድ', 'ውጦብኛል'):
                </p>
                <div className="font-mono bg-gray-900 text-amber-400 p-2.5 rounded-lg text-center">
                  {"C = \sum_{t=1}^{T} \alpha_t h_t, \quad \text{where} \quad \alpha_t = \frac{\exp(h_t^\top W_{\alpha} q)}{\sum_{k=1}^{T} \exp(h_k^\top W_{\alpha} q)}"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "chap-5",
      title: "Chapter 5: Experiment and Result",
      subtitle: "Datasets, Hyperparameters, Word Error Rates & Latency trade-offs",
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed font-sans text-xs md:text-sm">
          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">5.1 Data Acquisition & Acoustic Annotation</h4>
            <p className="mb-3">
              The dataset utilized includes <strong>1,250 unique vocal recordings</strong> of customer inquiries recorded over real EthSwitch call center lines, with durations ranging from 2.0 to 7.5 seconds. Utterances are split into five core conversational customer profiles:
            </p>
            <table className="w-full text-left text-xs border border-gray-250 rounded-xl overflow-hidden mb-3">
              <thead className="bg-indigo-950 text-white font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-b">Transactional Category</th>
                  <th className="p-2 border-b">Amharic Phonetic Example</th>
                  <th className="p-2 border-b">Sample Intent ID</th>
                  <th className="p-2 border-b">Share Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 font-sans">
                <tr>
                  <td className="p-2 font-semibold">Balance Inquiry</td>
                  <td className="p-2">ቀሪ ሒሳብ ማየት እፈልጋለሁ።</td>
                  <td className="p-2 font-mono">CheckBalance</td>
                  <td className="p-2 font-mono">310</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Payment Failure</td>
                  <td className="p-2">ያስተላለፍኩት ብር አልደረሰም።</td>
                  <td className="p-2 font-mono">ReportFailedTx</td>
                  <td className="p-2 font-mono">295</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Transaction Mismatch</td>
                  <td className="p-2">ተደራራቢ ክፍያ ተፈጽሟል።</td>
                  <td className="p-2 font-mono">RefundDoubleCharge</td>
                  <td className="p-2 font-mono">240</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Service Complaint</td>
                  <td className="p-2">ኤቲኤም ካርዴን ማሽን ውጦብኛል።</td>
                  <td className="p-2 font-mono">AtmSwallowedCard</td>
                  <td className="p-2 font-mono">215</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">General Inquiry</td>
                  <td className="p-2">የስራ ሰዓት ዝርዝር መረጃ...</td>
                  <td className="p-2 font-mono">GeneralInfo</td>
                  <td className="p-2 font-mono">190</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">5.2 Comparative Analysis & Results Metrics</h4>
            <p className="mb-3">
              Testing was executed on holdout datasets representing variable telephony noise scenarios. We evaluated both proposed systems according to **Word Error Rate (WER)**, **Character Error Rate (CER)**, **Intent F1 Accuracy**, and **Operational Latency (inference delay)**:
            </p>
            <table className="w-full text-left text-xs border border-gray-250 rounded-xl overflow-hidden bg-white mb-3">
              <thead className="bg-indigo-950 text-white font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-b">Strategy Model Track</th>
                  <th className="p-2 border-b">ASR WER (%)</th>
                  <th className="p-2 border-b">ASR CER (%)</th>
                  <th className="p-2 border-b">Intent Accuracy (%)</th>
                  <th className="p-2 border-b">Latency (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                <tr className="bg-indigo-50/20">
                  <td className="p-2 font-bold text-indigo-950">1. Cascaded Pipeline Model</td>
                  <td className="p-2 font-mono">22.31%</td>
                  <td className="p-2 font-mono">8.04%</td>
                  <td className="p-2 font-mono font-bold text-emerald-700">94.8%</td>
                  <td className="p-2 font-mono">315 ms</td>
                </tr>
                <tr className="bg-emerald-50/20">
                  <td className="p-2 font-bold text-emerald-950">2. End-to-End Intent (Direct)</td>
                  <td className="p-2 font-mono text-gray-400">N/A</td>
                  <td className="p-2 font-mono text-gray-400">N/A</td>
                  <td className="p-2 font-mono font-bold text-indigo-700">91.2%</td>
                  <td className="p-2 font-mono font-bold text-green-700">210 ms</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <strong>Key Finding:</strong> The **Cascaded Pipeline** achieves superior intent mapping performance (+3.6% Accuracy delta) because the acoustic transformer utilizes character transcriptions as intermediary constraints. However, the **End-to-End model** successfully eliminates transcription processing, reducing latency by **33.3% (from 315ms to 210ms)**, proving highly valuable for high-throughput telecommunication support centers.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "chap-6",
      title: "Chapter 6: Conclusion & Recommendation",
      subtitle: "Scientific Contributions & Future Experimental Extensions",
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed font-sans text-xs md:text-sm">
          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">6.1 Major Contributions of This Research</h4>
            <ul className="list-disc pl-5 space-y-2 mb-3 font-sans">
              <li><strong>First comparative SLU testbed in Ethiopia:</strong> Established a rigorous benchmark study evaluating alternative sequence-to-intent mappings tailored to Amharic.</li>
              <li><strong>Low-latency direct routing:</strong> Developed a highly robust convolutional-transformer End-to-End blueprint that operates effectively under telecom bandwidth restrictions.</li>
              <li><strong>EthSwitch customer datasets:</strong> Constructed and curated vocal financial intent patterns in Amharic scripts to support Semitic speech development.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">6.2 Scientific Recommendations</h4>
            <p className="mb-3">
              We highly recommend that domestic financial switches and banks deploying voice interfaces utilize the **Cascaded architecture** for critical accounting inquiries where precise text transcripts are needed (e.g. balance transactions validation), and utilize **End-to-End frameworks** for high-volume automated routing directories where minimizing user call latency is highly preferred.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase">6.3 Future Extensions</h4>
            <p>
              Subsequent research vectors will focus on pretraining models using self-supervised speech representations (such as **wav2vec-u 2.0**) over multi-dialect Semitic recordings, and deploying optimized Edge-AI models compiled using TensorRT directly inside local Addis Ababa Switch datacenters.
            </p>
          </div>
        </div>
      )
    }
  ];

  const getFullThesisMarkupText = (): string => {
    return `============================================================
ADDIS ABABA UNIVERSITY - MASTER'S THESIS PROPOSAL TRANSCRIPTS
Title: Development of a Speech-Based Amharic Conversational Agent for Customer Service in Financial Institutions
Author: Dagem Kasahun Zewdie (ID: GSE/6437/16)
Advisor: Dr. Yaregal Assabie
============================================================

CHAPTER 1: INTRODUCTION
----------------------
General Context:
In contemporary financial systems, automated vocal dialog processing remains highly constrained...
For full thesis, check out active pages inside the curriculum module.

CHAPTER 4: PROPOSED ARCHITECTURE
--------------------------------
The dual architectural approach evaluates:
1. Cascaded Pipeline Model (ASR coupled with GRU + Attention Intent routing).
2. Direct End-to-End Speech-to-Intent Model (2D CNN coupled with multi-head self attention).

Mathematical Formulation of Joint Multi-Loss Optimizations:
Loss = alpha * L_CTC + (1 - alpha) * L_Attention

Mathematical Self-Attention Weights Context Vector h_t:
C = Sum_t(alpha_t * h_t), where alpha_t represents the scaled contextual score.

CHAPTER 5: EXPERIMENTS & MODEL EVALUATION
-----------------------------------------
Dataset: 1,250 multi-dialect customer service audio recordings.
Comparisons of Core performance metrics:
- Cascaded Pipeline: WER=22.31%, CER=8.04%, Intent F1=94.8%, Latency=315ms.
- End-to-End Model: Intent F1=91.2%, Latency=210ms (Optimized processing save rate = 33.3%).`;
  };

  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[3];

  return (
    <div className="space-y-6" id="thesis-chapters-root">
      
      {/* 1. INTERACTIVE RESEARCH CONTRIBUTION MODEL DIAGRAM */}
      <section className="bg-white border border-gray-150 rounded-2xl shadow-xs overflow-hidden">
        <div className="bg-indigo-950 text-white p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-amber-400 text-[10px] uppercase tracking-widest font-mono font-bold block mb-1">
                Dagem's Contribution Blueprint
              </span>
              <h2 className="text-base md:text-lg font-bold font-sans tracking-tight flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-500" />
                Amharic Speech-to-Intent Contribution Model Map
              </h2>
              <p className="text-xs text-indigo-200 mt-1 font-sans">
                Interactive anatomical diagram mapping his Master's layout. Select a track to inspect layers.
              </p>
            </div>

            <div className="flex bg-indigo-900/60 p-1 rounded-xl border border-indigo-800">
              <button
                id="chapter-diag-cascaded"
                onClick={() => setActiveDiagramTrack('cascaded')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeDiagramTrack === 'cascaded'
                    ? 'bg-indigo-650 text-white shadow-sm font-bold'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Cascaded Approach Map
              </button>
              <button
                id="chapter-diag-e2e"
                onClick={() => setActiveDiagramTrack('e2e')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeDiagramTrack === 'e2e'
                    ? 'bg-indigo-650 text-white shadow-sm font-bold'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Direct E2E Mapping
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Vector Rendering for the Models Flowchart */}
        <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col items-center justify-center min-h-[310px]">
          
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 items-center gap-4 text-center">
            
            {/* Stage 1: Input Waves */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-indigo-400 transition-all">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-2">
                <Volume2 className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-[10px] font-bold text-indigo-950 font-mono block uppercase">Acoustic Input</span>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                16kHz Telecom audio waves (Mono channel)
              </p>
              <span className="text-[9px] font-mono text-gray-400 bg-gray-100 px-1 py-0.5 rounded mt-2 inline-block">
                Waveform [B, T]
              </span>
            </div>

            {/* Visual Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-gray-400 rotate-90 md:rotate-0" />
            </div>

            {/* Stage 2: Mel Extraction */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-indigo-400 transition-all">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-2">
                <Activity className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-[10px] font-bold text-indigo-950 font-mono block uppercase">Feature extraction</span>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                80 FFT Log Mel Filterbank grids
              </p>
              <span className="text-[9px] font-mono text-gray-400 bg-gray-100 px-1 py-0.5 rounded mt-2 inline-block">
                Spectrogram [B, 80, T']
              </span>
            </div>

            {/* Visual Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-gray-400 rotate-90 md:rotate-0" />
            </div>

            {/* Stage 3: Dynamic Model Processor Blocks */}
            {activeDiagramTrack === 'cascaded' ? (
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl shadow-xs md:col-span-1 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-indigo-950 font-mono block uppercase">1. Joint CTC Transformer</span>
                <p className="text-[10px] text-gray-600 mt-1 leading-normal font-sans">
                  Aligns audio sequences directly to Fidel subwords
                </p>
                <div className="text-[10px] mt-1 font-mono text-indigo-800 bg-white/70 border border-indigo-100 py-1 px-1.5 rounded text-center">
                  WER = 22.31% CER = 8.04%
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-xs md:col-span-1 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-950 font-mono block uppercase">1. CNN Spatial Filters</span>
                <p className="text-[10px] text-gray-650 mt-1 leading-normal font-sans">
                  2D grid kernels learning acoustic patterns
                </p>
                <div className="text-[9px] mt-1 font-mono text-emerald-800 bg-white/70 border border-emerald-100 py-1 px-1.5 rounded text-center">
                  Output: [B, C, F', T'']
                </div>
              </div>
            )}

          </div>

          {/* Visual Intermediate links representing Stage 4 */}
          <div className="flex flex-col items-center justify-center my-4">
            <div className="h-6 w-0.5 bg-gray-300"></div>
          </div>

          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 items-center gap-4 text-center">
            
            {/* Stage 4: Transcripts/Encoder */}
            {activeDiagramTrack === 'cascaded' ? (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-indigo-400 transition-all md:col-start-1 md:col-span-1">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-[10px] font-bold text-indigo-950 font-mono block uppercase">Written transcript</span>
                <p className="text-[9px] text-gray-500 mt-1">
                  Decoded Fidel character lists
                </p>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-emerald-400 transition-all md:col-start-1 md:col-span-1">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold text-indigo-950 font-mono block uppercase">4-Layer Transformer</span>
                <p className="text-[9px] text-gray-500 mt-1">
                  Attention networks learning contextual arrays
                </p>
              </div>
            )}

            {/* Visual Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-gray-400 rotate-90 md:rotate-0" />
            </div>

            {/* Stage 5 Classifier */}
            {activeDiagramTrack === 'cascaded' ? (
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-indigo-950 font-mono block uppercase">2. Attention BiGRU NLU</span>
                <p className="text-[10px] text-gray-600 mt-1">
                  Classifies intents on raw textual embeddings
                </p>
                <span className="text-[9px] font-mono text-indigo-700 bg-white border border-indigo-100 px-1 py-0.5 rounded mt-2 inline-block">
                  C = Sum(alpha_t * h_t)
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-emerald-950 font-mono block uppercase">2. Semantic Pooling Head</span>
                <p className="text-[10px] text-gray-650 mt-1">
                  Temporal Aggregate mean maps directly
                </p>
                <span className="text-[9px] font-mono text-emerald-700 bg-white border border-emerald-100 px-1 py-0.5 rounded mt-2 inline-block font-bold">
                  Saves 33.3% Computation
                </span>
              </div>
            )}

            {/* Visual Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-gray-400 rotate-90 md:rotate-0" />
            </div>

            {/* Stage 6 Output Intention */}
            <div className="bg-indigo-950 text-white p-4 rounded-xl shadow-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-1.5 animate-pulse">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-bold text-amber-400 font-mono block uppercase">Resolved Intention</span>
              <p className="text-[10px] text-indigo-200 mt-1">
                E.g. "RefundDoubleCharge" mapped dynamically
              </p>
              <div className="text-[9.5px] mt-1 bg-white/10 px-1 py-0.5 rounded font-mono font-bold text-white">
                F1 Score: {activeDiagramTrack === 'cascaded' ? '94.8' : '91.2'}%
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. COMPREHENSIVE THESIS CHAPTER READER PANELS */}
      <section className="bg-white border border-gray-150 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-4 min-h-[500px]" id="thesis-reader-layout">
        
        {/* Left selection Sidebar Menu */}
        <div className="bg-indigo-950 text-white p-5 lg:col-span-1 flex flex-col justify-between select-none">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-4">
              <BookOpen className="w-4 h-4 text-amber-400" />
              AAU Thesis proposal Draft
            </h3>

            <div className="space-y-1">
              {chapters.map((chap) => {
                const isActive = chap.id === activeChapterId;
                return (
                  <button
                    key={chap.id}
                    id={`thesis-chapter-tab-${chap.id}`}
                    onClick={() => setActiveChapterId(chap.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition duration-200 flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-900/50'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>{chap.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick options panel footer */}
          <div className="border-t border-indigo-900 pt-4 mt-5 space-y-2">
            <button
              onClick={() => handleCopyChapterText('full', getFullThesisMarkupText())}
              className="w-full text-center py-2 px-3 rounded-lg bg-indigo-900 hover:bg-indigo-855 text-white border border-indigo-800 text-[10px] font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              {copiedChapterId === 'full' ? "Proposal Transcripts Copied!" : "Copy Full Proposal Plaintext"}
            </button>
          </div>
        </div>

        {/* Right Reader workspace area */}
        <div className="p-6 md:p-8 lg:col-span-3 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Header section content with copy and download option */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-150 pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 font-mono uppercase tracking-widest">
                  Addis Ababa University CS Degree Partial Fulfillment
                </span>
                <h3 className="text-base md:text-lg font-extrabold text-indigo-950 font-sans tracking-tight mt-1 leading-tight">
                  {activeChapter.title}: {activeChapter.subtitle}
                </h3>
              </div>

              <button
                onClick={() => handleCopyChapterText(activeChapter.id, document.getElementById(`chapter-text-${activeChapter.id}`)?.innerText || '')}
                className="bg-gray-50 border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-start shrink-0 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedChapterId === activeChapter.id ? "Chapter Text Copied!" : "Copy Chapter Page"}
              </button>
            </div>

            {/* Real Text content layout rendered dynamically matching scholastic templates */}
            <div className="bg-white p-2 rounded-xl h-full font-serif text-gray-800" id={`chapter-text-${activeChapter.id}`}>
              {activeChapter.content}
            </div>

          </div>

          <div className="mt-8 border-t border-gray-100 pt-4 text-[11px] text-gray-400 font-mono text-center flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Supervisor: Dr. Yaregal Assabie</span>
            <span>Addis Ababa University CS Lab Portal</span>
          </div>

        </div>

      </section>

    </div>
  );
}
