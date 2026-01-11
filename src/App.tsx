import React, { useState } from 'react';
import { Header } from './components/Header';
import { SpamCheckForm } from './components/SpamCheckForm';
import { HistoryList } from './components/HistoryList';

function App() {
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleClassificationComplete = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Classifier Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-indigo-700 rounded-2xl p-8 text-white shadow-lg bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
              <h2 className="text-3xl font-bold mb-4">Detect Spam Instantly</h2>
              <p className="text-indigo-100 max-w-xl text-lg">
                Our advanced Naive Bayes classifier analyzes message patterns to identify spam with high accuracy. Try it out below.
              </p>
            </div>
            
            <SpamCheckForm onClassificationComplete={handleClassificationComplete} />
          </div>

          {/* Sidebar History Section */}
          <div className="lg:col-span-1 h-full min-h-[500px]">
            <HistoryList refreshTrigger={refreshHistory} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 SpamGuard AI. Built with React, TypeScript & Supabase.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
