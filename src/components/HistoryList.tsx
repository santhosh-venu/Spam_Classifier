import React, { useEffect, useState } from 'react';
import { supabase, SpamLog } from '../lib/supabase';
import { Clock, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HistoryListProps {
  refreshTrigger: number;
}

export function HistoryList({ refreshTrigger }: HistoryListProps) {
  const [logs, setLogs] = useState<SpamLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('spam_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Recent History</h2>
        </div>
        <button 
          onClick={fetchLogs}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          title="Refresh history"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-0">
        {loading && logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Loading history...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No classification history yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.label === 'Spam' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {log.label === 'Spam' ? <AlertTriangle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    {log.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2 font-medium">
                  "{log.message_text}"
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Confidence: {log.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
