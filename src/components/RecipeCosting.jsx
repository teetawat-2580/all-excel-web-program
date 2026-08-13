import React, { useState } from 'react';
import { Plus, Trash2, Utensils, DollarSign, PieChart, Sparkles, RotateCcw } from 'lucide-react';

export default function RecipeCosting({ data, setData }) {
  const [servings, setServings] = useState(8);
  const [desiredMargin, setDesiredMargin] = useState(60); // 60% profit margin

  const defaultIngredients = [
    { id: 1, name: 'All-Purpose Flour (แป้งสาลีเอนกประสงค์)', purchasedQty: 1500, purchasePrice: 339, recipeAmount: 250 },
    { id: 2, name: 'Butter (เนยสด)', purchasedQty: 2400, purchasePrice: 1094, recipeAmount: 120 },
    { id: 3, name: 'Sugar (น้ำตาลทราย)', purchasedQty: 1000, purchasePrice: 45, recipeAmount: 100 },
    { id: 4, name: 'Cream Cheese (ครีมชีส)', purchasedQty: 1000, purchasePrice: 350, recipeAmount: 200 }
  ];

  const ingredients = data && data.length > 0 ? data : defaultIngredients;

  const handleUpdate = (id, field, value) => {
    const updated = ingredients.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(updated);
  };

  const handleAddIngredient = () => {
    const newItem = {
      id: Date.now(),
      name: `วัตถุดิบใหม่ ${ingredients.length + 1}`,
      purchasedQty: 1000,
      purchasePrice: 100,
      recipeAmount: 50
    };
    setData([...ingredients, newItem]);
  };

  const handleDeleteIngredient = (id) => {
    if (ingredients.length <= 1) return;
    setData(ingredients.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setData(defaultIngredients);
  };

  // Calculations
  const calculatedItems = ingredients.map(item => {
    const qty = parseFloat(item.purchasedQty) || 0;
    const price = parseFloat(item.purchasePrice) || 0;
    const recipeAmt = parseFloat(item.recipeAmount) || 0;
    
    const costPerGram = qty > 0 ? price / qty : 0;
    const ingredientCost = costPerGram * recipeAmt;

    return {
      ...item,
      purchasedQty: qty,
      purchasePrice: price,
      recipeAmount: recipeAmt,
      costPerGram,
      ingredientCost
    };
  });

  const totalRecipeCost = calculatedItems.reduce((acc, curr) => acc + curr.ingredientCost, 0);
  const costPerServing = servings > 0 ? totalRecipeCost / servings : 0;
  const suggestedSellingPrice = (100 - desiredMargin) > 0 ? costPerServing / ((100 - desiredMargin) / 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Utensils className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">คำนวณต้นทุนวัตถุดิบ & สูตรอาหาร (Recipe Costing Calculator)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Excel Sheet #1
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                อ้างอิงจากแผ่นงาน <code className="text-emerald-300 bg-emerald-950/40 border border-emerald-500/30">Recipe Costing</code> คำนวณราคาต่อกรัม (THB/g) และต้นทุนรวมต่อสูตร/ต่อชิ้น
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-slate-900/80">
          <span className="text-xs font-semibold text-slate-400">ต้นทุนสูตรอาหารรวม (Total Cost):</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ฿{totalRecipeCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400">รวมจากวัตถุดิบ {ingredients.length} รายการ</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-400">จำนวนเสิร์ฟ / ชิ้น:</span>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-center text-slate-200 font-bold"
            />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            ฿{costPerServing.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400">ต้นทุนต่อ 1 เสิร์ฟ</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-400">เป้าหมายกำไร (% Margin):</span>
            <input
              type="number"
              value={desiredMargin}
              onChange={(e) => setDesiredMargin(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-center text-slate-200 font-bold"
            />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {desiredMargin}%
          </div>
          <span className="text-[11px] text-slate-400">อัตราส่วนกำไรที่ต้องการ</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 bg-slate-900/80">
          <span className="text-xs font-semibold text-slate-400">ราคาขายแนะนำต่อชิ้น:</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">
            ฿{suggestedSellingPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-indigo-300/80">กำไรสุทธิ ฿{(suggestedSellingPrice - costPerServing).toFixed(2)} / ชิ้น</span>
        </div>
      </div>

      {/* Ingredient Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">รายการวัตถุดิบ (Ingredient Breakdown Table)</h3>
            <p className="text-xs text-slate-400">สูตรคำนวณ: Cost per Gram = Price / Purchased Qty, Ingredient Cost = Cost per Gram × Recipe Amount</p>
          </div>
          <button
            onClick={handleAddIngredient}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            เพิ่มวัตถุดิบ
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4">ชื่อวัตถุดิบ (Ingredient)</th>
                <th className="py-3.5 px-4 w-40">ปริมาณที่ซื้อ (g/ml)</th>
                <th className="py-3.5 px-4 w-40">ราคาซื้อ (THB)</th>
                <th className="py-3.5 px-4 text-right w-40">ราคาต่อกรัม (THB/g)</th>
                <th className="py-3.5 px-4 w-40">ปริมาณในสูตร (g/ml)</th>
                <th className="py-3.5 px-4 text-right w-44">ต้นทุนในสูตร (THB)</th>
                <th className="py-3.5 px-4 text-center w-16">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {calculatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.purchasedQty}
                      onChange={(e) => handleUpdate(item.id, 'purchasedQty', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.purchasePrice}
                      onChange={(e) => handleUpdate(item.id, 'purchasePrice', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono text-sm text-emerald-400">
                      ฿{item.costPerGram.toFixed(4)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.recipeAmount}
                      onChange={(e) => handleUpdate(item.id, 'recipeAmount', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono text-base font-bold text-white">
                      ฿{item.ingredientCost.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteIngredient(item.id)}
                      disabled={ingredients.length <= 1}
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
                <td colSpan={5} className="py-4 px-4 text-right text-slate-300 uppercase tracking-wider">
                  Total Recipe Cost (ต้นทุนวัตถุดิบรุมสูตร):
                </td>
                <td className="py-4 px-4 text-right text-lg text-emerald-400 font-black">
                  ฿{totalRecipeCost.toFixed(2)}
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
