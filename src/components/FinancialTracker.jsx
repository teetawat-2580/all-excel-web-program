import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, RotateCcw } from 'lucide-react';

export default function FinancialTracker({ data, setData }) {
  const defaultStocks = [
    { id: 1, ticker: 'JPM', shares: 50, avgCost: 145.0, currentPrice: 195.5, estDividend: 115 },
    { id: 2, ticker: 'AMZN', shares: 100, avgCost: 130.0, currentPrice: 185.2, estDividend: 0 },
    { id: 3, ticker: 'AAPL', shares: 80, avgCost: 170.0, currentPrice: 224.5, estDividend: 80 },
    { id: 4, ticker: 'NVDA', shares: 150, avgCost: 95.0, currentPrice: 128.0, estDividend: 30 }
  ];

  const stocksList = data && data.length > 0 ? data : defaultStocks;

  const handleUpdate = (id, field, value) => {
    const updated = stocksList.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(updated);
  };

  const handleAddStock = () => {
    const newItem = {
      id: Date.now(),
      ticker: `STOCK${stocksList.length + 1}`,
      shares: 10,
      avgCost: 100,
      currentPrice: 110,
      estDividend: 10
    };
    setData([...stocksList, newItem]);
  };

  const handleDeleteStock = (id) => {
    if (stocksList.length <= 1) return;
    setData(stocksList.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setData(defaultStocks);
  };

  // Calculations
  const calculatedStocks = stocksList.map(item => {
    const shares = parseFloat(item.shares) || 0;
    const avgCost = parseFloat(item.avgCost) || 0;
    const currentPrice = parseFloat(item.currentPrice) || 0;
    const div = parseFloat(item.estDividend) || 0;

    const totalCost = shares * avgCost;
    const marketValue = shares * currentPrice;
    const plAmount = marketValue - totalCost;
    const plPercent = totalCost > 0 ? (plAmount / totalCost) * 100 : 0;

    return {
      ...item,
      shares,
      avgCost,
      currentPrice,
      estDividend: div,
      totalCost,
      marketValue,
      plAmount,
      plPercent
    };
  });

  const totalPortfolioValue = calculatedStocks.reduce((acc, curr) => acc + curr.marketValue, 0);
  const totalCostBasis = calculatedStocks.reduce((acc, curr) => acc + curr.totalCost, 0);
  const totalPLAmount = totalPortfolioValue - totalCostBasis;
  const totalPLPercent = totalCostBasis > 0 ? (totalPLAmount / totalCostBasis) * 100 : 0;
  const totalAnnualDividends = calculatedStocks.reduce((acc, curr) => acc + curr.estDividend, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">ระบบติดตามการลงทุน & เงินปันผล (Stock & Dividend Tracker)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Excel Sheet #3
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                อ้างอิงจากแผ่นงาน <code className="text-purple-300 bg-purple-950/40 border border-purple-500/30">Financial Tracker</code> คำนวณมูลค่าตลาด กำไร/ขาดทุน (P/L $) และ (%) และประมาณการปันผลรายปี
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="self-start md:self-auto p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700"
            title="รีเซ็ตเป็นค่าเริ่มต้น"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Financial Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-purple-500/30 bg-slate-900/80">
          <span className="text-xs font-semibold text-slate-400">มูลค่าพอร์ตการลงทุนรวม (Market Value):</span>
          <div className="text-2xl font-black text-purple-300 mt-1">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400">ต้นทุนรวม: ${totalCostBasis.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
          <span className="text-xs font-semibold text-slate-400">กำไร/ขาดทุนรวม (Total P/L $):</span>
          <div className={`text-2xl font-bold mt-1 flex items-center space-x-1 ${totalPLAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPLAmount >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            <span>${Math.abs(totalPLAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <span className="text-[11px] text-slate-400">สูตร: Market Value - Total Cost</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
          <span className="text-xs font-semibold text-slate-400">อัตราผลตอบแทนรวม (Total P/L %):</span>
          <div className={`text-2xl font-bold mt-1 ${totalPLPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
          </div>
          <span className="text-[11px] text-slate-400">สูตร: P/L $ / Total Cost</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-slate-900/80">
          <span className="text-xs font-semibold text-slate-400">ประมาณการเงินปันผลรายปีรวม:</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ${totalAnnualDividends.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-300/80">Est. Annual Dividend Income</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">ตารางหลักทรัพย์ในพอร์ต (Stock Holdings Portfolio)</h3>
            <p className="text-xs text-slate-400">สูตร: Market Value = Shares × Price | P/L ($) = Market Value - (Shares × Avg Cost) | P/L (%) = P/L / Cost</p>
          </div>
          <button
            onClick={handleAddStock}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-500 hover:bg-purple-400 text-slate-950 transition-all shadow-md shadow-purple-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            เพิ่มหุ้น / สินทรัพย์
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4 w-32">Ticker (ชื่อหุ้น)</th>
                <th className="py-3.5 px-4 w-32">จำนวนหุ้น (Shares)</th>
                <th className="py-3.5 px-4 w-36">ต้นทุนเฉลี่ย ($)</th>
                <th className="py-3.5 px-4 w-36">ราคาปัจจุบัน ($)</th>
                <th className="py-3.5 px-4 text-right w-40">มูลค่าตลาด ($)</th>
                <th className="py-3.5 px-4 text-right w-36">P/L ($)</th>
                <th className="py-3.5 px-4 text-right w-32">P/L (%)</th>
                <th className="py-3.5 px-4 w-40">ปันผลรายปี ($)</th>
                <th className="py-3.5 px-4 text-center w-16">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {calculatedStocks.map((item) => {
                const isProfit = item.plAmount >= 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.ticker}
                        onChange={(e) => handleUpdate(item.id, 'ticker', e.target.value.toUpperCase())}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-purple-300 font-extrabold focus:outline-none focus:border-purple-500 text-sm tracking-wider"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={item.shares}
                        onChange={(e) => handleUpdate(item.id, 'shares', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        step="0.01"
                        value={item.avgCost}
                        onChange={(e) => handleUpdate(item.id, 'avgCost', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-purple-500 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        step="0.01"
                        value={item.currentPrice}
                        onChange={(e) => handleUpdate(item.id, 'currentPrice', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-purple-500 text-sm font-semibold"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-sm font-bold text-slate-100">
                        ${item.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-mono text-sm font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? '+' : ''}${item.plAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        isProfit ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {isProfit ? '+' : ''}{item.plPercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        step="0.01"
                        value={item.estDividend}
                        onChange={(e) => handleUpdate(item.id, 'estDividend', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-emerald-300 focus:outline-none focus:border-purple-500 text-sm font-semibold"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteStock(item.id)}
                        disabled={stocksList.length <= 1}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 text-sm font-bold border-t-2 border-slate-800">
                <td colSpan={4} className="py-4 px-4 text-right text-slate-300 uppercase tracking-wider">
                  Portfolio Totals (รวมยอดทั้งพอร์ต):
                </td>
                <td className="py-4 px-4 text-right text-base text-purple-300 font-black">
                  ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className={`py-4 px-4 text-right text-base font-black ${totalPLAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalPLAmount >= 0 ? '+' : ''}${totalPLAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className={`py-4 px-4 text-right text-base font-black ${totalPLPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
                </td>
                <td className="py-4 px-4 text-emerald-400 font-black">
                  ${totalAnnualDividends.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
