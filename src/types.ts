/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BudgetItem {
  id: number;
  itemName: string;
  quantity: string;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface GanttTask {
  id: string;
  name: string;
  startMonth: string; // e.g. "Feb", "Mar"
  endMonth: string;
  progress: number; // 0 to 100
  color: string;
  description: string;
}

export interface Hyperparameters {
  learningRate: number;
  batchSize: number;
  transformerLayers: number;
  lstmUnits: number;
  dropout: number;
  epochs: number;
}

export interface TrainingLog {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  wer: number; // Word Error Rate
  cer: number; // Character Error Rate
  intentAccuracy: number;
  latencyMs: number;
}

export interface NetworkLayer {
  id: string;
  name: string;
  type: 'input' | 'convolution' | 'recurrent' | 'transformer' | 'dense' | 'output';
  neuronsCount: number;
  activation: 'none' | 'relu' | 'gelu' | 'softmax' | 'sigmoid' | 'tanh';
  description: string;
  activations: number[]; // Simulated activation values for visualization
}

export interface ColabStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  filePrefix: string;
  objective: string;
  codeSnippet: string;
  notebookUrl?: string;
  keyLibraries: string[];
}

export interface AmharicIntentSample {
  id: string;
  title?: string;
  audioFilename?: string;
  amharicText: string;
  transliteration: string;
  translation: string;
  category: 'Balance Inquiry' | 'Payment Failure' | 'Transaction Issue' | 'Service Complaint' | 'General Inquiry';
  intentLabel: string; // e.g., "CheckBalance", "ReportFailedTx", "CardBlocked"
  audioFileUrl?: string; // or simulated speech
  waveformPoints: number[]; // Array of amplitudes (0 to 1) for rendering beautifully
  estimatedDurationSec: number;
  entities: { name: string; value: string; startIdx: number; endIdx: number }[];
}

export interface SimulationResult {
  step: 'idle' | 'spectrogram' | 'acoustic' | 'tokenization' | 'translation' | 'nlu' | 'completed';
  cascadedPath: {
    wer: number;
    cer: number;
    textResult: string;
    intentLabel: string;
    confidence: number;
    latencyMs: number;
    logTrace: string[];
  };
  e2ePath: {
    intentLabel: string;
    confidence: number;
    latencyMs: number;
    logTrace: string[];
    activationIndices: number[]; // index of highlighted neural nodes
  };
}
