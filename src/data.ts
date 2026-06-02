import { BudgetItem, GanttTask, ColabStep, AmharicIntentSample } from './types';

export const BUDGET_ITEMS: BudgetItem[] = [
  { id: 1, itemName: "Paper", quantity: "1", unit: "Pack", unitPrice: 650, totalPrice: 650 },
  { id: 2, itemName: "Printing", quantity: "200-250", unit: "Page", unitPrice: 10, totalPrice: 2250 },
  { id: 3, itemName: "Photocopy", quantity: "150-200", unit: "Page", unitPrice: 5, totalPrice: 875 },
  { id: 4, itemName: "Binding & Laminating", quantity: "2", unit: "Piece", unitPrice: 70, totalPrice: 140 },
  { id: 5, itemName: "Transportation", quantity: "25", unit: "Piece", unitPrice: 35, totalPrice: 875 },
  { id: 6, itemName: "Miscellaneous", quantity: "-", unit: "-", unitPrice: 2000, totalPrice: 2000 }
];

export const GANTT_TASKS: GanttTask[] = [
  {
    id: "t1",
    name: "Literature Review",
    startMonth: "Feb",
    endMonth: "Feb",
    progress: 100,
    color: "#6366f1",
    description: "Systematic review of low-resource speech processing, SLU frameworks, and financial conversational agent structures."
  },
  {
    id: "t2",
    name: "Data Collection & Labeling",
    startMonth: "Feb",
    endMonth: "Mar",
    progress: 100,
    color: "#3b82f6",
    description: "Collecting customer service recordings from EthSwitch call centers, segmenting into utterances, anonymizing personal data, and annotating intents."
  },
  {
    id: "t3",
    name: "Data Analysis",
    startMonth: "Feb",
    endMonth: "Mar",
    progress: 100,
    color: "#f59e0b",
    description: "Analyzing linguistic properties, class distributions, morphological variations in financial vocabulary, and planning the acoustic vocabulary."
  },
  {
    id: "t4",
    name: "Framework Development",
    startMonth: "Mar",
    endMonth: "Apr",
    progress: 100,
    color: "#10b981",
    description: "Setting up deep learning environment, configuring acoustic features, baseline Wav2Vec2 and BiGRU model pipelines in PyTorch."
  },
  {
    id: "t5",
    name: "Implementation & Validation",
    startMonth: "Apr",
    endMonth: "May",
    progress: 90,
    color: "#ef4444",
    description: "Developing Cascaded and End-to-End speech architectures, performance tuning with hyperparameters, comparative validation on holdout tests."
  },
  {
    id: "t6",
    name: "Draft Thesis Writing",
    startMonth: "Apr",
    endMonth: "Jun",
    progress: 75,
    color: "#8b5cf6",
    description: "Structuring and detailing background, methodology, experimental results, drawing robust academic conclusions and drafting thesis defense."
  },
  {
    id: "t7",
    name: "Feedback, Revisions & Defense",
    startMonth: "Jun",
    endMonth: "Jul",
    progress: 20,
    color: "#ec4899",
    description: "Integrating advisor and departmental review comments, finalizing thesis documents, prep for viva voce defense."
  }
];

export const COLAB_STEPS: ColabStep[] = [
  {
    id: "colab-1",
    title: "Step 1: Speech Data Preprocessing",
    subtitle: "Waveforms & Mel-Spectrogram Extraction",
    description: "Learn how to load raw call center audio files from EthSwitch (WAV, 16kHz format), handle Amharic linguistic properties, pre-emphasize signals, and extract visual Log-Mel Spectrogram features for deep neural network input.",
    duration: "45 mins",
    difficulty: "Beginner",
    filePrefix: "01_amharic_speech_preprocessing",
    objective: "Implement a fully pipelines custom data pipeline for low-resource Amharic audio data, transforming voice signals into robust 2D time-frequency representations.",
    keyLibraries: ["torchaudio", "librosa", "numpy", "matplotlib"],
    codeSnippet: `import os
import torch
import torchaudio
import numpy as np
import matplotlib.pyplot as plt
from torch.utils.data import Dataset, DataLoader

# 1. Custom Dataset for EthSwitch Amharic Spoken Data
class AmharicSpeechDataset(Dataset):
    def __init__(self, metadata_df, audio_dir, target_sr=16000):
        self.df = metadata_df
        self.audio_dir = audio_dir
        self.target_sr = target_sr
        
        # Define Log-Mel Spectrogram Transformer
        self.mel_spectrogram_transform = torchaudio.transforms.MelSpectrogram(
            sample_rate=target_sr,
            n_fft=1024,
            hop_length=512,
            n_mels=80
        )
        self.amplitude_to_db = torchaudio.transforms.AmplitudeToDB()

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        wav_path = os.path.join(self.audio_dir, row['audio_filename'])
        
        # Load audio (mono channel standard)
        waveform, sr = torchaudio.load(wav_path)
        
        # Resample if needed
        if sr != self.target_sr:
            resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=self.target_sr)
            waveform = resampler(waveform)
            
        # Extract features (Squeezing channels because it's mono)
        mel_spec = self.mel_spectrogram_transform(waveform)
        log_mel_spec = self.amplitude_to_db(mel_spec).squeeze(0)
        
        # Standardize features (Zero-mean unit-variance normalization)
        mean = log_mel_spec.mean()
        std = log_mel_spec.std() + 1e-6
        normalized_spec = (log_mel_spec - mean) / std
        
        intent_label = row['intent_id']
        transcript = row['transcript']
        
        return normalized_spec, torch.tensor(intent_label), transcript

# Example Visualization Routine
def plot_spectrogram(spec, title="Mel-Spectrogram", ylabel="Freq Bin"):
    plt.figure(figsize=(10, 4))
    plt.imshow(spec.numpy(), cmap='viridis', origin='lower', aspect='auto')
    plt.title(title, fontsize=12, fontweight='bold')
    plt.colorbar(format='%+2.0f dB')
    plt.xlabel("Time Frames")
    plt.ylabel(ylabel)
    plt.tight_layout()
    plt.show()`
  },
  {
    id: "colab-2",
    title: "Step 2: Joint Transformer-CTC Speech Recognition",
    subtitle: "Building the Amharic ASR Acoustic Model",
    description: "Implement the Cascaded pipeline's first stage. Here, you define and train a hybrid model matching Alemayehu Yilma's [23] CTC-Transformer architecture for high-accuracy phonetic transcription, outputting Character Error Rates (CER) and Word Error Rates (WER).",
    duration: "90 mins",
    difficulty: "Advanced",
    filePrefix: "02_transformer_ctc_amharic_asr",
    objective: "Optimize subword modeling and token sequences with Connectionist Temporal Classification loss to perform competitive continuous text transcription on raw Amharic audio waves.",
    keyLibraries: ["transformers", "torch.nn", "torchaudio.models", "libeval"],
    codeSnippet: `import torch
import torch.nn as nn
import torch.nn.functional as F

class TransformerCTCModel(nn.Module):
    def __init__(self, input_dim=80, num_classes=145, num_layers=6, d_model=256, nhead=8, dim_feedforward=1024, dropout=0.1):
        """
        Subword/Character Hybrid Transformer Model for Amharic ASR
        num_classes = 145 (Fidel characters count + blank + padding + unk)
        """
        super(TransformerCTCModel, self).__init__()
        # Input linear projection
        self.input_layer = nn.Linear(input_dim, d_model)
        self.pos_encoder = nn.Parameter(torch.zeros(1, 1500, d_model)) # Limit max sequence length
        
        # Transformer Encoder Blocks
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model, 
            nhead=nhead, 
            dim_feedforward=dim_feedforward, 
            dropout=dropout,
            batch_first=True,
            activation='gelu'
        )
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        
        # CTC Linear Projection layer
        self.ctc_projection = nn.Linear(d_model, num_classes)
        self.dropout = nn.Dropout(dropout)

    def forward(self, mel_features, lengths):
        # mel_features: [Batch, Freq(80), Time_Frames]
        x = mel_features.transpose(1, 2) # To [Batch, Time_Frames, Freq(80)]
        x = self.input_layer(x)
        
        # Add Positional Embeddings
        seq_len = x.size(1)
        x = x + self.pos_encoder[:, :seq_len, :]
        x = self.dropout(x)
        
        # Masking for sequence lengths to avoid attention on padding
        mask = self._generate_padding_mask(lengths, seq_len, mel_features.device)
        
        # Self-Attention Feature extraction
        feature_repr = self.transformer_encoder(x, src_key_padding_mask=mask)
        
        # Project representation to character logs for CTC classification
        logits = self.ctc_projection(feature_repr) # [Batch, Time, NumClasses]
        return logits

    def _generate_padding_mask(self, lengths, max_len, device):
        batch_size = lengths.size(0)
        mask = torch.ones(batch_size, max_len, dtype=torch.bool, device=device)
        for i, val in enumerate(lengths):
            mask[i, :val] = False
        return mask

# Initializing and compiling with CTC Loss
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = TransformerCTCModel().to(device)
criterion = nn.CTCLoss(blank=0, zero_infinity=True)`
  },
  {
    id: "colab-3",
    title: "Step 3: Intent Classification on Transcribed Text",
    subtitle: "Bidirectional GRU / BiLSTM Classifier",
    description: "Build the Cascaded pipeline's second stage. Take transcribed customer Amharic queries and feed them to a recurrent Bidirectional GRU network model with standard Attention (Abebu Sintayehu & Eshete Derb [27] architecture) to predict EthSwitch transaction intent profiles.",
    duration: "60 mins",
    difficulty: "Intermediate",
    filePrefix: "03_amharic_cascade_intent_classification",
    objective: "Process textual Amharic transcripts, tokenize into morphological sub-roots, and train a high-accuracy Intent Classifier achieving over 94% on financial complaints.",
    keyLibraries: ["torchtext", "scikit-learn", "numpy", "pandas"],
    codeSnippet: `import torch
import torch.nn as nn

class BiGRUIntentClassifier(nn.Module):
    def __init__(self, vocab_size, embedding_dim=128, hidden_dim=256, num_layers=2, num_classes=5, dropout=0.3):
        super(BiGRUIntentClassifier, self).__init__()
        # Embedding Layer mapping Amharic words to vector representations
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        
        # Recurrent Network
        self.gru = nn.GRU(
            embedding_dim,
            hidden_dim,
            num_layers=num_layers,
            bidirectional=True,
            dropout=dropout,
            batch_first=True
        )
        
        # Self-Attention Layer to identify key financial indicator tokens (e.g., 'ብር', 'አልደረሰም')
        self.attention_query = nn.Parameter(torch.randn(hidden_dim * 2, 1))
        
        # Dense Decision layers
        self.fc1 = nn.Linear(hidden_dim * 2, 64)
        self.fc2 = nn.Linear(64, num_classes)
        self.dropout = nn.Dropout(dropout)

    def forward(self, text_tokens, seq_lengths):
        # text_tokens shape: [Batch, Max_Seq_Len]
        embedded = self.dropout(self.embedding(text_tokens))
        
        # GRU Forward
        gru_out, _ = self.gru(embedded) # [Batch, Seq_Len, Hidden_Dim * 2]
        
        # Simple Softmax Attention weights aggregation
        attn_scores = torch.matmul(gru_out, self.attention_query).squeeze(2) # [Batch, Seq_Len]
        # Mask padded indices
        attn_weights = torch.softmax(attn_scores, dim=1).unsqueeze(2) # [Batch, Seq_Len, 1]
        
        context_vector = torch.sum(gru_out * attn_weights, dim=1) # [Batch, Hidden_Dim * 2]
        
        # Dense logic
        out = torch.relu(self.fc1(context_vector))
        out = self.fc2(self.dropout(out))
        return out`
  },
  {
    id: "colab-4",
    title: "Step 4: End-to-End Spoken Language Understanding",
    subtitle: "Direct Speech-to-Intent Deep Model",
    description: "Set up the novel second strategy - an End-to-End model bypassing the transcription stage entirely. It maps speech frames directly to intent labels. You'll construct a convolutional front-end + transformer encoder layer + MaxPool aggregation to identify financial intent with deep acoustic representations.",
    duration: "100 mins",
    difficulty: "Advanced",
    filePrefix: "04_e2e_speech_to_intent_amharic",
    objective: "Construct and compare a direct neural translation model that preserves robust contextual semantics, completely independent of transcription-based error propagation.",
    keyLibraries: ["torchaudio.models", "torch.nn", "scikit-learn", "tqdm"],
    codeSnippet: `import torch
import torch.nn as nn

class EndToEndSpeechToIntent(nn.Module):
    def __init__(self, input_channels=1, num_mels=80, num_classes=5, num_layers=4, d_model=128, nhead=4, dropout=0.2):
        super(EndToEndSpeechToIntent, self).__init__()
        
        # Convolutional Front-End for Local Pattern Recognition (Time-Freq grids)
        self.conv_block = nn.Sequential(
            nn.Conv2d(input_channels, 32, kernel_size=(3, 3), stride=(1, 2), padding=(1, 1)),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=(2, 2)),
            nn.Conv2d(32, 64, kernel_size=(3, 3), stride=(1, 2), padding=(1, 1)),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=(2, 2))
        )
        
        # Flatten and project to hidden transformer dimensions
        cnn_out_dim = (num_mels // 8) * 64
        self.bn_projection = nn.Linear(cnn_out_dim, d_model)
        
        # Transformer SEMANTIC Block
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=512,
            dropout=dropout,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        
        # Semantic Pooling & Decision
        self.global_pool = nn.AdaptiveAvgPool1d(1)
        self.classifier = nn.Sequential(
            nn.Linear(d_model, 64),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(64, num_classes)
        )

    def forward(self, spectrogram):
        # spectrogram shape: [Batch, Mels(80), Time_Frames]
        x = spectrogram.unsqueeze(1) # Add channel: [Batch, 1, 80, Time]
        
        # CNN Feature Maps
        conv_out = self.conv_block(x) # [Batch, Channels(64), Mels_Reduced, Time_Reduced]
        
        # Rearrange dimensions for Sequence treatment: [Batch, Time_Reduced, Features]
        b, c, m, t = conv_out.shape
        x = conv_out.permute(0, 3, 1, 2).contiguous().view(b, t, -1)
        
        # Linear projections
        x = torch.relu(self.bn_projection(x))
        
        # Multi-head attention sequence semantic modeling
        feat_sequence = self.transformer(x) # [Batch, Time_reduced, d_model]
        
        # Temporal aggregations
        feat_temporal = feat_sequence.transpose(1, 2) # [Batch, d_model, Time_reduced]
        pooled = self.global_pool(feat_temporal).squeeze(2) # [Batch, d_model]
        
        # Classification logits for EthSwitch intents
        logits = self.classifier(pooled)
        return logits`
  }
];

export const AMHARIC_SAMPLES: AmharicIntentSample[] = [
  {
    id: "sample-1",
    amharicText: "ትላንት ያስተላለፍኩት ብር አልደረሰም።",
    transliteration: "T'ilant yastelallefkut birr alderesem.",
    translation: "The money I transferred yesterday hasn't arrived.",
    category: "Payment Failure",
    intentLabel: "ReportFailedTx",
    waveformPoints: [0.12, 0.28, 0.45, 0.15, 0.05, 0.35, 0.72, 0.95, 0.62, 0.18, 0.08, 0.42, 0.82, 0.66, 0.22, 0.05, 0.31, 0.58, 0.49, 0.25, 0.12, 0.38, 0.76, 0.55, 0.14, 0.03, 0.18, 0.48, 0.36, 0.12, 0.05],
    estimatedDurationSec: 3.2,
    entities: [
      { name: "Time", value: "ትላንት (Yesterday)", startIdx: 0, endIdx: 5 },
      { name: "Currency", value: "ብር (Money)", startIdx: 19, endIdx: 22 }
    ]
  },
  {
    id: "sample-2",
    amharicText: "የሂሳብ ቁጥሬን ቀሪ ሒሳብ ማየት እፈልጋለሁ።",
    transliteration: "Yehisab k'ut'iren k'eri hisab mayet ifeligalehu.",
    translation: "I would like to check the current balance of my bank account.",
    category: "Balance Inquiry",
    intentLabel: "CheckBalance",
    waveformPoints: [0.08, 0.18, 0.32, 0.22, 0.12, 0.28, 0.52, 0.48, 0.22, 0.14, 0.38, 0.64, 0.78, 0.54, 0.18, 0.24, 0.58, 0.88, 0.74, 0.32, 0.11, 0.25, 0.48, 0.35, 0.12, 0.08, 0.22, 0.42, 0.31, 0.15, 0.04],
    estimatedDurationSec: 3.8,
    entities: [
      { name: "Service", value: "ቀሪ ሒሳብ (Current Balance)", startIdx: 14, endIdx: 23 }
    ]
  },
  {
    id: "sample-3",
    amharicText: "በስህተት ወደ ሌላ የባንክ አካውንት ብር ልኬአለሁ።",
    transliteration: "Besihitet wode lela yebank account birr lik'ealehu.",
    translation: "I accidentally transferred money to a wrong bank account.",
    category: "Transaction Issue",
    intentLabel: "ReportWrongTx",
    waveformPoints: [0.15, 0.32, 0.54, 0.42, 0.18, 0.25, 0.68, 0.82, 0.45, 0.15, 0.28, 0.58, 0.89, 0.98, 0.72, 0.34, 0.12, 0.42, 0.64, 0.48, 0.22, 0.38, 0.72, 0.62, 0.28, 0.08, 0.18, 0.54, 0.42, 0.18, 0.05],
    estimatedDurationSec: 4.1,
    entities: [
      { name: "Context", value: "በስህተት (By mistake)", startIdx: 0, endIdx: 7 },
      { name: "Target", value: "የባንክ አካውንት (Bank Account)", startIdx: 17, endIdx: 32 }
    ]
  },
  {
    id: "sample-4",
    amharicText: "የላክሁት ብር ከባንክ ሂሳቤ ተቀንሷል ግን አልደረሰም።",
    transliteration: "Yelakhut birr kebank hisabe tek'ensual gin alderesem.",
    translation: "The money I sent was deducted from my account but has not arrived.",
    category: "Payment Failure",
    intentLabel: "DeductedNoArrival",
    waveformPoints: [0.11, 0.24, 0.48, 0.38, 0.15, 0.32, 0.65, 0.78, 0.52, 0.21, 0.39, 0.72, 0.91, 0.85, 0.48, 0.22, 0.38, 0.62, 0.54, 0.28, 0.15, 0.35, 0.68, 0.74, 0.42, 0.18, 0.24, 0.49, 0.38, 0.15, 0.06],
    estimatedDurationSec: 4.5,
    entities: [
      { name: "Amount Status", value: "ተቀንሷል (Deducted)", startIdx: 19, endIdx: 27 },
      { name: "Delivery Status", value: "አልደረሰም (Not arrived)", startIdx: 32, endIdx: 41 }
    ]
  },
  {
    id: "sample-5",
    amharicText: "ኤቲኤም ካርዴን ማሽን ውጦብኛል። መልሱልኝ።",
    transliteration: "ATM carden mashin wit'obignal. Melsulign.",
    translation: "The ATM machine has swallowed my card. Please return it to me.",
    category: "Service Complaint",
    intentLabel: "AtmSwallowedCard",
    waveformPoints: [0.22, 0.45, 0.68, 0.34, 0.12, 0.48, 0.85, 0.99, 0.74, 0.25, 0.18, 0.54, 0.88, 0.65, 0.15, 0.22, 0.62, 0.84, 0.54, 0.21, 0.08, 0.38, 0.72, 0.51, 0.12, 0.05, 0.24, 0.58, 0.35, 0.11, 0.03],
    estimatedDurationSec: 3.5,
    entities: [
      { name: "Card Type", value: "ኤቲኤም ካርድ (ATM Card)", startIdx: 0, endIdx: 9 },
      { name: "Action", value: "ውጦብኛል (Swallowed)", startIdx: 15, endIdx: 23 }
    ]
  }
];
