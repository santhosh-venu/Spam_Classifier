import React, { useState } from 'react';
import { classifier } from '../lib/classifier';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle, CheckCircle, XCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpamCheckFormProps {
  onClassificationComplete: () => void;
}

export function SpamCheckForm({ onClassificationComplete }: SpamCheckFormProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ label: 'Spam' | 'Not Spam'; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1. Predict locally
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      const prediction = classifier.predict(message);
      setResult(prediction);

      // 2. Save to Supabase
      const { error: dbError } = await supabase
        .from('spam_logs')
        .insert([
          {
            message_text: message,
            label: prediction.label,
            confidence: prediction.confidence,
          }
        ]);

      if (dbError) throw dbError;
      
      onClassificationComplete();
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to save result to database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Classify Message</h2>
        <p className="text-sm text-gray-500 mt-1">Paste an email or SMS content below to check for spam.</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Congratulations! You've won a $1000 gift card. Click here to claim..."
              className="w-full h-40 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all text-gray-700 placeholder-gray-400"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all
                ${!message.trim() || loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Check Spam
                </>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-6 p-6 rounded-xl border-2 ${
                result.label === 'Spam' 
                  ? 'bg-red-50 border-red-100' 
                  : 'bg-green-50 border-green-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {result.label === 'Spam' ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    <h3 className={`text-xl font-bold ${
                      result.label === 'Spam' ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {result.label}
                    </h3>
                  </div>
                  <p className={`text-sm ${
                    result.label === 'Spam' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    Confidence: <span className="font-bold">{result.confidence}%</span>
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                   result.label === 'Spam' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                }`}>
                  Model Prediction
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
