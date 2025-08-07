'use client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [fact, setFact] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFact = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/random-data');
      const data = await res.json();
      setFact(data.fact);
    } catch (err) {
      setError('Failed to load fact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-blue-700">💡 Random Fun Fact</h1>
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-lg">{fact}</p>
        )}
        <button
          onClick={fetchFact}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          🔁 Get New Fact
        </button>
      </div>
    </main>
  );
}
