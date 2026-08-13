import React, { useState } from 'react';
import { Plus, Trash2, Trophy, ArrowUpRight, Scale, Info, CheckCircle2, RotateCcw } from 'lucide-react';

export default function ValueCompare({ data, setData }) {
  // Mode: 'unit_per_baht' (ยิ่งมาก ยิ่งคุ้ม) vs 'cost_per_unit' (ยิ่งน้อย ยิ่งคุ้ม)
  const [calcMode, setCalcMode] = useState('unit_per_baht');

  const defaultItems = [
    { id: 1, name: 'สินค้า A (แพ็คใหญ่ 6x1500g)', qty: 1500, pack: 6, price: 1229, unit: 'กรัม (g)', remark: 'คุ้มค่าสำหรับร้านค้า' },
    { id: 2, name: 'สินค้า B (ถุงเดี่ยว 800g)', qty: 800, pack: 1, price: 130, unit: 'กรัม (g)', remark: 'เหมาะสำหรับใช้ทันที' },
    { id: 3, name: 'สินค้า C (โปรโมชั่นพิเศษ 2500g)', qty: 2500, pack: 1, price: 390, unit: 'กรัม (g)', remark: 'แถมฟรี 100g' }
  ];

  const items = data && data.length > 0 ? data : defaultItems;

  const handleUpdate = (id, field, value) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(updated);
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      name: `สินค้าเทียบรายการที่ ${items.length + 1}`,
      qty: 1000,
      pack: 1,
      price: 150,
      unit: 'กรัม (g)',
      remark: ''
    };
    setData([...items, newItem]);
  };

  const handleDeleteItem = (id) => {
    if (items.length <= 1) return;
    setData(items.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setData(defaultItems);
  };

  // Calculations
  const calculatedItems = items.map(item => {
    const qty = parseFloat(item.qty) || 0;
    const pack = parseFloat(item.pack) || 1;
    const totalQty = qty * pack;
    const price = parseFloat(item.price) || 0;
    const unitPerBaht = price > 0 ? totalQty / price : 0;
    const bahtPerUnit = totalQty > 0 ? price / totalQty : 0;
    return {
      ...item,
      qty,
      pack,
      totalQty,
      price,
      unitPerBaht,
      bahtPerUnit
    };
  });

  // Determine Best Item
  let bestId = null;
  let maxRatio = -1;
  let minCost = Infinity;

  calculatedItems.forEach(item => {
    if (calcMode === 'unit_per_baht') {
      if (item.unitPerBaht > maxRatio && item.price > 0) {
        maxRatio = item.unitPerBaht;
        bestId = item.id;
      }
    } else {
      if (item.bahtPerUnit < minCost && item.totalQty > 0 && item.price > 0) {
        minCost = item.bahtPerUnit;
        bestId = item.id;
      }
    }
  });

  const maxChartVal = Math.max(...calculatedItems.map(i => i.unitPerBaht), 1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-amber-500/20 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">เครื่องคำนวณเปรียบเทียบความคุ้มค่า (Price & Value Comparison)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Excel Function #1
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                อ้างอิงจากไฟล์ <code className="text-amber-300 bg-amber-950/40 border border-amber-500/30">Cal - Compare value.xlsx</code> คำนวณอัตราส่วน ปริมาณ/ราคา (ยิ่งมาก ยิ่งคุ้ม) เพื่อค้นหาตัวเลือกที่ดีที่สุด
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 flex items-center space-x-1">
              <button
                onClick={() => setCalcMode('unit_per_baht')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  calcMode === 'unit_per_baht'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                หน่วย / 1 บาท (ยิ่งมาก ยิ่งคุ้ม)
              </button>
              <button
                onClick={() => setCalcMode('cost_per_unit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  calcMode === 'cost_per_unit'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                บาท / 1 หน่วย (ยิ่งน้อย ยิ่งคุ้ม)
              </button>
            </div>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700"
              title="รีเซ็ตเป็นค่าเริ่มต้น"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {calculatedItems.slice(0, 3).map((item, idx) => {
          const isBest = item.id === bestId;
          return (
            <div
              key={item.id}
              className={`glass-panel rounded-2xl p-5 relative transition-all duration-300 ${
                isBest
                  ? 'border-2 border-amber-400/80 bg-slate-900/90 shadow-xl shadow-amber-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {isBest && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black px-3 py-0.5 rounded-full flex items-center space-x-1 shadow-lg shadow-amber-500/30">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>คุ้มค่าที่สุด (BEST VALUE)</span>
                </div>
              )}
              <div className="text-xs text-slate-400 font-semibold mb-1">ตัวเลือกที่ {idx + 1}</div>
              <h3 className="font-bold text-slate-100 text-base line-clamp-1">{item.name}</h3>
              
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">ปริมาณรวม:</span>
                  <span className="text-sm font-semibold text-slate-200">{item.totalQty.toLocaleString()} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">ราคาซื้อ:</span>
                  <span className="text-sm font-semibold text-amber-400">฿{item.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                  <span className="text-xs font-bold text-slate-300">ความคุ้มค่า (หน่วย/บาท):</span>
                  <span className={`text-base font-extrabold ${isBest ? 'text-amber-400' : 'text-slate-200'}`}>
                    {item.unitPerBaht.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>ตารางเปรียบเทียบรายการ (Value Comparison Grid)</span>
            </h3>
            <p className="text-xs text-slate-400">สามารถแก้ไข ปริมาณ ราคา และหน่วย เพื่อคำนวณความคุ้มค่าแบบ Real-time</p>
          </div>
          <button
            onClick={handleAddItem}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            เพิ่มรายการเทียบ
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4">ชื่อสินค้า / รายการ</th>
                <th className="py-3.5 px-4 w-28">แพ็ค (Pack)</th>
                <th className="py-3.5 px-4 w-32">ปริมาณ (Qty)</th>
                <th className="py-3.5 px-4 w-36">ราคา (THB)</th>
                <th className="py-3.5 px-4 w-32">หน่วย</th>
                <th className="py-3.5 px-4 text-right w-44">
                  {calcMode === 'unit_per_baht' ? 'ปริมาณ / 1 บาท (หน่วย/฿)' : 'ราคา / 1 หน่วย (฿/หน่วย)'}
                </th>
                <th className="py-3.5 px-4 w-48">Remark / หมายเหตุ</th>
                <th className="py-3.5 px-4 text-center w-16">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {calculatedItems.map((item) => {
                const isBest = item.id === bestId;
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isBest ? 'bg-amber-500/10 font-semibold' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {isBest && <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                          className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={item.pack}
                        onChange={(e) => handleUpdate(item.id, 'pack', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleUpdate(item.id, 'qty', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleUpdate(item.id, 'price', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleUpdate(item.id, 'unit', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {calcMode === 'unit_per_baht' ? (
                        <div className="flex flex-col items-end">
                          <span className={`font-mono text-base ${isBest ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                            {item.unitPerBaht.toFixed(3)}
                          </span>
                          <span className="text-[11px] text-slate-400">{item.unit} / บาท</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className={`font-mono text-base ${isBest ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                            ฿{item.bahtPerUnit.toFixed(4)}
                          </span>
                          <span className="text-[11px] text-slate-400">บาท / {item.unit}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.remark || ''}
                        onChange={(e) => handleUpdate(item.id, 'remark', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-amber-500 text-xs"
                        placeholder="หมายเหตุ..."
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <span>แผนภูมิเปรียบเทียบความคุ้มค่า (Value Comparison Visualization)</span>
        </h3>
        <div className="space-y-4">
          {calculatedItems.map((item) => {
            const isBest = item.id === bestId;
            const pct = Math.min((item.unitPerBaht / maxChartVal) * 100, 100);
            return (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isBest ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                    {item.name} {isBest && '(🏆 คุ้มที่สุด)'}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {item.unitPerBaht.toFixed(3)} {item.unit}/บาท
                  </span>
                </div>
                <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBest
                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 shadow-md shadow-amber-500/30'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
