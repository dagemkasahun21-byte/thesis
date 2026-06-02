/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON request parsed structures
  app.use(express.json());

  // Safe initialize GoogleGenAI client
  let aiClient: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Successfully initialized GoogleGenAI server client.');
    } catch (err) {
      console.error('Error during GoogleGenAI compilation check:', err);
    }
  } else {
    console.log('GEMINI_API_KEY is not configured or set to default placeholder. Running in demo mode.');
  }

  // API Route - Academic Advisor Proxy
  app.post('/api/academic-advisor', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        res.status(400).json({ error: 'Query prompt string parameter is required.' });
        return;
      }

      // Predefined educational backups if API Key is not configured
      const fallbackReplies: Record<string, string> = {
        'default': `**Academic Advisor Response (Demo Mode)**

Thank you for your question regarding **Amharic Speech Conversational Agent research**. Currently, the \`GEMINI_API_KEY\` secret is not set in your environment. You can add it in AI Studio under the **Secrets** or **Settings** panel to unlock real-time custom neural consultations!

Here is an expert review regarding your thesis requirements:
1. **Cascaded vs. End-to-End SLU tradeoff**: For Amharic, cascaded pipelines remain more interpretable because you can gauge ASR Word Error Rate (WER) independently. However, cascading propagates errors (e.g. phonetics errors from ASR cause intent classification failure). End-to-End designs completely skip textual tokenization, resolving intents directly from mel spectrogram sequence patterns.
2. **CTC Acoustic Modeling**: Connectionist Temporal Classification loss computes alignment probabilities between speech sequences and written Fidel characters without manual alignment.
3. **Low-Resource Scarcity**: Leveraging pretrained representations like **Wav2Vec2 XLS-R (53 languages)** or **Whisper-Base** and fine-tuning with EthSwitch's financial dataset are the state-of-the-art standards.`,

        'cascaded': `**Academic Advisor Response (Demo Mode)**

Your question concerns the **Cascaded SLU Approach**. In Dagem's thesis proposal:
1. **Acoustic Front-End**: Converts raw Amharic audio to Log-Mel spectrograms.
2. **ASR stage**: Hybrid joint Transformer-CTC model generates Written transcripts. Joint model achieves competitive CER and WER (e.g., ~22.3% WER targets).
3. **Intent Recognition**: A Bidirectional GRU or BiLSTM classifier with Attention decodes transcripts to predict specific EthSwitch intents.

**Pros**: Standard components can be debugging isolatedly.
**Cons**: If ASR output contains grammatical/character errors, downstream intent recognition accuracy degrades.`,

        'e2e': `**Academic Advisor Response (Demo Mode)**

Your question concerns the **End-to-End (E2E) SLU Approach**. In Dagem's proposal:
1. Wave signals bypass intermediate written representations.
2. Acoustic representations map directly to semantic slots (Inquiries, payment details).
3. **Optimization advantages**: Margines execution latency from 315ms down to ~210ms (saving precious computing overhead in high-throughput customer lines).

**Pros**: Low latency, eliminates script error propagation.
**Cons**: Requires massive annotated speech datasets to align complex phonetic features directly to semantics.`
      };

      const lowerPrompt = prompt.toLowerCase();
      let replyStr = fallbackReplies.default;
      if (lowerPrompt.includes('cascad')) {
        replyStr = fallbackReplies.cascaded;
      } else if (lowerPrompt.includes('end-to-end') || lowerPrompt.includes('e2e')) {
        replyStr = fallbackReplies.e2e;
      }

      if (aiClient) {
        try {
          const response = await aiClient.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
              systemInstruction: `You are Dr. Yaregal Assabie, a distinguished professor and academic advisor in Computer Science at Addis Ababa University. 
              You are advising Dagem Kasahun Zewdie (ID: GSE/6437/16) on his Master's Thesis: "Development of a Speech-Based Amharic Conversational Agent for Customer Service in Financial Institutions" using EthSwitch as a case study.
              Respond strictly to academic research queries in professional computational linguistics terms. 
              Explain deep learning, acoustic feature projections, Connectionist Temporal Classification (CTC) loss, BiGRU classifiers, and speech-to-intent mappings. Keep descriptions highly pedagogical, clear, and structured. Encourage the student constructively.`,
            },
          });
          
          if (response.text) {
            res.json({ text: response.text });
          } else {
            res.json({ text: replyStr });
          }
        } catch (apiErr: any) {
          console.error('Gemini API query execution failed:', apiErr);
          res.json({ text: `${replyStr}\n\n*(Note: Gemini query failed due to standard quota/network boundaries: ${apiErr.message ?? 'Unknown'}. Currently displaying local backup answers)*` });
        }
      } else {
        res.json({ text: replyStr });
      }
    } catch (err: any) {
      console.error('Error serving academic advisor endpoint:', err);
      res.status(500).json({ error: 'Internal server error occurred.' });
    }
  });

  // Serve static assets or mount Vite process based on environment
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Dev: Vite middleware mounted onto Express server.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production: Static client bundle directory served.');
  }

  // Bind server listener
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
