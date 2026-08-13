import React, { useState } from 'react';
import { Plus, Trash2, ShoppingBag, TrendingUp, Calendar, DollarSign, RotateCcw } from 'lucide-react';

export default function SalesTracker({ data, setData }) {
  const defaultSales = [
    { id: 1, date: '2026-07-27', product: 'Osaka Cream Puffs', unitsSold: 45, unitPrice: 65 },
    { id: 2, date: '2026-07-27', product: 'Chocolate Cheesecake', unitsSold: 12, unitPrice: 120 },
    { id: 3, date: '2026-07-27', product: 'Signature Cookies', unitsSold: 30, unitPrice: 40 },
    { id: 4, date: '2026-07-28', product: 'Osaka Cream Puffs', unitsSold: 50, unitPrice: 65 },
    { id: 5, date: '2026-07-28', product: 'Matcha Latte Cake', unitsSold: 15, unitPrice: 110 }
  ];

  const salesList = data && data.length > 0 ? data : defaultSales;

  const handleUpdate = (id, field, value) => {
    const updated = salesList.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(updated);
  };

  const handleAddSale = () => {
    const today = new Date().toISOString().split('T')[0];
    const newItem = {
      id: Date.now(),
      date: today,
      product: `สินค้าใหม่ ${salesList.length + 1}`,
      unitsSold: 10,
      unitPrice: 50
    };
    setData([...salesList, newItem]);
  };

  const handleDeleteSale = (id) => {
    if (salesList.length <= 1) return;
    setData(salesList.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setData(defaultSales);
  };

  // Calculations
  const calculatedSales = salesList.map(item => {
    const units = parseFloat(item.unitsSold) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const revenue = units * price;
    return {
      ...item,
      unitsSold: units,
      unitPrice: price,
      revenue
    };
  });

  const totalDailySales = calculatedSales.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalUnitsSold = calculatedSales.reduce((acc, curr) => acc + curr.unitsSold, 0);
  const avgOrderValue = calculatedSales.length > 0 ? totalDailySales / calculatedSales.length : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">ระบบบันทึกยอดขายและรายได้ประจำวัน (Daily Sales & Revenue Tracker)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Excel Sheet #2
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                อ้างอิงจากแผ่นงาน <code className="text-blue-300 bg-blue-950/40 border border-blue-500/30">Market Stall Sales</code> ติดตามยอดขายสินค้า บันทึกจำนวนชิ้น และสรุปรายได้รวม
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-blue-500/30 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">ยอดขายรวมทั้งหมด (Total Revenue):</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400 mt-2">
            ฿{totalDailySales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">คำนวณจากสูตร =SUM(Revenue)</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">จำนวนชิ้นที่ขายได้รวม:</span>
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">
            {totalUnitsSold.toLocaleString()} ชิ้น
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">จากรายการขายทั้งหมด {salesList.length} ออเดอร์</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">รายได้เฉลี่ยต่อรายการ:</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">
            ฿{avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Average Order Value</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">ตารางบันทึกยอดขาย (Sales Log Grid)</h3>
            <p className="text-xs text-slate-400">สูตรคำนวณ: Total Revenue = Units Sold × Unit Price</p>
          </div>
          <button
            onClick={handleAddSale}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-500 hover:bg-blue-400 text-slate-950 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            เพิ่มบันทึกยอดขาย
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4 w-40">วันที่ (Date)</th>
                <th className="py-3.5 px-4">ชื่อสินค้า (Product Item)</th>
                <th className="py-3.5 px-4 w-40">จำนวนขาย (Units)</th>
                <th className="py-3.5 px-4 w-40">ราคาต่อหน่วย (THB)</th>
                <th className="py-3.5 px-4 text-right w-48">รายได้รวม (Total Revenue)</th>
                <th className="py-3.5 px-4 text-center w-16">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {calculatedSales.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => handleUpdate(item.id, 'date', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.product}
                      onChange={(e) => handleUpdate(item.id, 'product', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-blue-500 text-sm font-semibold"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.unitsSold}
                      onChange={(e) => handleUpdate(item.id, 'unitsSold', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdate(item.id, 'unitPrice', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono text-base font-bold text-blue-400">
                      ฿{item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteSale(item.id)}
                      disabled={salesList.length <= 1}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 text-sm font-bold border-t-2 border-slate-800">
                <td colSpan={4} className="py-4 px-4 text-right text-slate-300 uppercase tracking-wider">
                  Total Daily Sales (ยอดขายรวมทั้งหมด):
                </td>
                <td className="py-4 px-4 text-right text-lg text-blue-400 font-black">
                  ฿{totalDailySales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
