import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">SpamGuard AI</h1>
        </div>
        <div className="text-sm text-gray-500">
          Naive Bayes Classifier
        </div>
      </div>
    </header>
  );
}
