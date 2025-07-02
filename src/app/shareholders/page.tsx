'use client';

import { useState, useEffect } from 'react';

interface Shareholder {
  _id: string;
  walletAddress: string;
  tokenBalance: number;
  joinedAt: string;
  lastVerified: string;
}

export default function ShareholdersPage() {
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShareholders();
  }, []);

  const fetchShareholders = async () => {
    try {
      const response = await fetch('/api/shareholders');
      const data = await response.json();

      if (data.success) {
        // Sort by token balance and take top 25
        const sortedShareholders = data.shareholders
          .sort((a: Shareholder, b: Shareholder) => b.tokenBalance - a.tokenBalance)
          .slice(0, 25);
        setShareholders(sortedShareholders);
      }
    } catch (err) {
      console.error('Error loading shareholders');
    } finally {
      setLoading(false);
    }
  };


  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const totalTokens = shareholders.reduce((sum, shareholder) => sum + shareholder.tokenBalance, 0);

  if (loading) {
    return (
      <div className="bg-[#121212] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-gray-400">
          Loading shareholders...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Shareholders Leaderboard
        </h1>
        
        <p className="text-gray-400 text-center mb-8 text-sm max-w-2xl mx-auto">
          This leaderboard shows the top 25 verified shareholders. All verified shareholders automatically earn proportional fees from our LP based on their holding percentage, regardless of leaderboard position.
        </p>

        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0f0f0f]">
              <tr>
                <th className="text-left text-gray-400 font-medium text-sm p-4">#</th>
                <th className="text-left text-gray-400 font-medium text-sm p-4">Wallet</th>
                <th className="text-right text-gray-400 font-medium text-sm p-4">Tokens</th>
                <th className="text-right text-gray-400 font-medium text-sm p-4">Share</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 25 }, (_, index) => {
                const shareholder = shareholders[index];
                
                if (shareholder) {
                  const sharePercentage = (shareholder.tokenBalance / 1000000000) * 100;
                  
                  return (
                    <tr key={shareholder._id} className={index % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#0f0f0f]'}>
                      <td className="p-4">
                        <span className="text-gray-400 text-sm">
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-mono text-sm">
                          {formatWalletAddress(shareholder.walletAddress)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-white font-semibold">
                          {shareholder.tokenBalance.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-green-400 font-semibold">
                          {sharePercentage.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={`empty-${index}`} className={index % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#0f0f0f]'}>
                      <td className="p-4">
                        <span className="text-gray-400 text-sm">
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-600 text-sm">
                          ——————
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-gray-600 text-sm">
                          ——
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-gray-600 text-sm">
                          ——
                        </span>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
