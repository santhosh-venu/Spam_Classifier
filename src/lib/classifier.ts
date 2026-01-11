import { stopwords } from './stopwords';
import { trainingData } from './trainingData';

type ClassLabel = 'spam' | 'ham';

interface PredictionResult {
  label: 'Spam' | 'Not Spam';
  confidence: number;
}

class NaiveBayesClassifier {
  private wordCounts: Record<ClassLabel, Record<string, number>> = {
    spam: {},
    ham: {}
  };
  private classCounts: Record<ClassLabel, number> = {
    spam: 0,
    ham: 0
  };
  private vocab: Set<string> = new Set();
  private totalDocs: number = 0;

  constructor() {
    this.train();
  }

  private preprocess(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopwords.has(word)); // Remove stopwords and short words
  }

  private train() {
    trainingData.forEach(doc => {
      const tokens = this.preprocess(doc.text);
      const label = doc.label as ClassLabel;
      
      this.classCounts[label]++;
      this.totalDocs++;

      tokens.forEach(token => {
        this.vocab.add(token);
        this.wordCounts[label][token] = (this.wordCounts[label][token] || 0) + 1;
      });
    });
  }

  public predict(text: string): PredictionResult {
    const tokens = this.preprocess(text);
    const scores: Record<ClassLabel, number> = { spam: 0, ham: 0 };

    // Calculate log probabilities
    (['spam', 'ham'] as const).forEach(label => {
      // Prior probability P(Class)
      scores[label] = Math.log(this.classCounts[label] / this.totalDocs);

      // Likelihood P(Word | Class) with Laplace smoothing
      const totalWordsInClass = Object.values(this.wordCounts[label]).reduce((a, b) => a + b, 0);
      const vocabSize = this.vocab.size;

      tokens.forEach(token => {
        const count = this.wordCounts[label][token] || 0;
        // P(w|c) = (count(w, c) + 1) / (count(c) + |V|)
        scores[label] += Math.log((count + 1) / (totalWordsInClass + vocabSize));
      });
    });

    // Convert log scores to probabilities
    // We use the exp-normalize trick to avoid underflow
    const maxScore = Math.max(scores.spam, scores.ham);
    const expSpam = Math.exp(scores.spam - maxScore);
    const expHam = Math.exp(scores.ham - maxScore);
    const sumExp = expSpam + expHam;

    const probSpam = expSpam / sumExp;
    
    // Determine label and confidence
    const isSpam = probSpam > 0.5;
    const confidence = isSpam ? probSpam : (1 - probSpam);

    return {
      label: isSpam ? 'Spam' : 'Not Spam',
      confidence: parseFloat((confidence * 100).toFixed(2))
    };
  }
}

export const classifier = new NaiveBayesClassifier();
