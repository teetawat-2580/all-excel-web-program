import React, { useState } from 'react';
import { Percent, Plus, Trash2, HelpCircle, BookOpen, CheckCircle2, ArrowUpRight, ArrowDownRight, RotateCcw, Info, Sparkles } from 'lucide-react';

export default function PercentageCalc({ data, setData }) {
  const defaultItems = [
    { id: 1, label: 'ตัวอย่างชุดที่ 1 (Sheet 1)', total: 125, result: 110, target: 122, notes: 'ผลลัพธ์คิดเป็น 88% ของค่าเต็ม' },
    { id: 2, label: 'ตัวอย่างชุดที่ 2 (Sheet 2)', total: 65, result: 90, target: 90, notes: 'ผลลัพธ์สูงกว่าค่าเต็ม (138.46%)' },
    { id: 3, label: 'ตัวอย่างชุดที่ 3 (Sheet 3)', total: 540, result: 500, target: 500, notes: '135x4 = 540, ผลลัพธ์ 92.593%' }
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
      label: `รายการคำนวณที่ ${items.length + 1}`,
      total: 100,
      result: 75,
      target: 75,
      notes: ''
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
    const total = parseFloat(item.total) || 0;
    const result = parseFloat(item.result) || 0;
    const target = parseFloat(item.target) || 0;

    const pctOfTotal = total > 0 ? (result * 100) / total : 0;
    const diffAbs = Math.abs(total - result);
    const diffPct = total > 0 ? (diffAbs * 100) / total : 0;
    const isImproved = result >= total;

    // Summary strings exactly matching Excel CONCATENATE formula
    const summary1 = `${result} is ${pctOfTotal.toFixed(2)}% of ${total}`;
    const summary2 = `or ${pctOfTotal.toFixed(2)}% of ${total} is ${result}`;
    const summary3 = `Diff: ${isImproved ? 'Improved' : 'Decreased'} by ${diffPct.toFixed(2)}% (from ${total} to ${result})`;

    return {
      ...item,
      total,
      result,
      target,
      pctOfTotal,
      diffAbs,
      diffPct,
      isImproved,
      summary1,
      summary2
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Percent className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">เครื่องคำนวณเปอร์เซ็นต์ (Percentage Calculator)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Onenote Excel Function
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                อ้างอิงจากไฟล์ <code className="text-purple-300 bg-purple-950/40 border border-purple-500/30">Percentage calculation - Personal Onenote.xlsx</code> คำนวณสัดส่วน % และผลต่างเปรียบเทียบ
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

      {/* Guide & Documentation Card */}
      <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 bg-slate-900/90 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">คำอธิบายหลักการทำงาน & วิธีใช้งาน (How It Works & Guide)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* How It Works */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-indigo-300 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>1. หลักการและสูตรคำนวณ (Formula Explanation)</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start space-x-2">
                <span className="font-semibold text-amber-400">• สัดส่วนเปอร์เซ็นต์ (Percentage of Total):</span>
                <span>สูตร <code className="bg-slate-900 text-purple-300 px-1 py-0.5 rounded">Result × 100 / Total</code></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-semibold text-emerald-400">• ส่วนต่าง % (Percentage Difference):</span>
                <span>สูตร <code className="bg-slate-900 text-purple-300 px-1 py-0.5 rounded">|Total - Result| × 100 / Total</code></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-semibold text-indigo-300">• ประโยคสรุปภาษาอังกฤษ:</span>
                <span>สร้างสรุปอัตโนมัติ <code className="bg-slate-900 text-slate-200 px-1 py-0.5 rounded">Result is X% of Total</code> หรือ <code className="bg-slate-900 text-slate-200 px-1 py-0.5 rounded">X% of Total is Result</code></span>
              </li>
            </ul>
          </div>

          {/* How To Use */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-indigo-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>2. วิธีการใช้งาน (Step-by-Step Guide)</span>
            </h4>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>กรอกช่อง <strong className="text-white">Total (ค่าเต็ม / เป้าหมาย)</strong> เช่น 125 หรือ 65</li>
              <li>กรอกช่อง <strong className="text-white">Result (ผลลัพธ์ / ค่าที่ได้จริง)</strong> เช่น 110 หรือ 90</li>
              <li>ระบบจะคำนวณอัตราส่วนเปอร์เซ็นต์ (% Of Total) และความเปลี่ยนแปลงให้อัตโนมัติ</li>
              <li>ดูข้อความสรุปสำเร็จรูปที่ตารางด้านล่างเพื่อนำไปใช้งาน หรือคัดลอกข้อความสรุปได้ทันที</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">ตัวอย่างจากไฟล์ Excel:</span>
        <button
          onClick={() => handleUpdate(items[0]?.id || 1, 'total', 125) || handleUpdate(items[0]?.id || 1, 'result', 110)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap"
        >
          Sheet 1: Total=125, Result=110 (88%)
        </button>
        <button
          onClick={() => handleUpdate(items[0]?.id || 1, 'total', 65) || handleUpdate(items[0]?.id || 1, 'result', 90)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap"
        >
          Sheet 2: Total=65, Result=90 (138.46%)
        </button>
        <button
          onClick={() => handleUpdate(items[0]?.id || 1, 'total', 540) || handleUpdate(items[0]?.id || 1, 'result', 500)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap"
        >
          Sheet 3: Total=540, Result=500 (92.59%)
        </button>
      </div>

      {/* Main Calculation Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">ตารางคำนวณเปอร์เซ็นต์ (Percentage Calculation Grid)</h3>
            <p className="text-xs text-slate-400">สูตร: Percentage = Result × 100 / Total</p>
          </div>
          <button
            onClick={handleAddItem}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-500 hover:bg-purple-400 text-slate-950 transition-all shadow-md shadow-purple-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            เพิ่มแถวคำนวณ
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4">ชื่อรายการ / คำอธิบาย</th>
                <th className="py-3.5 px-4 w-36">Total (ค่าเต็ม)</th>
                <th className="py-3.5 px-4 w-36">Result (ค่าที่ได้)</th>
                <th className="py-3.5 px-4 text-right w-40">คิดเป็น % (% of Total)</th>
                <th className="py-3.5 px-4 text-right w-40">ส่วนต่าง % (Diff %)</th>
                <th className="py-3.5 px-4 w-64">สรุปข้อความ (Summary Sentence)</th>
                <th className="py-3.5 px-4 text-center w-16">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {calculatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdate(item.id, 'label', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-purple-500 text-sm font-semibold"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.total}
                      onChange={(e) => handleUpdate(item.id, 'total', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-purple-500 text-sm font-mono"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.result}
                      onChange={(e) => handleUpdate(item.id, 'result', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-purple-500 text-sm font-mono font-bold"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-base font-extrabold text-purple-300">
                        {item.pctOfTotal.toFixed(2)}%
                      </span>
                      <div className="w-24 h-1.5 bg-slate-950 rounded-full overflow-hidden mt-1 border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                          style={{ width: `${Math.min(item.pctOfTotal, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {item.isImproved ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-amber-400" />
                      )}
                      <span className={`font-mono text-sm font-bold ${item.isImproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {item.diffPct.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-xs space-y-1">
                      <div className="text-purple-300 font-mono font-bold">{item.summary1}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{item.summary2}</div>
                      <div className={`font-mono text-[11px] font-semibold ${item.isImproved ? 'text-emerald-400' : 'text-amber-400'}`}>{item.summary3}</div>
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
