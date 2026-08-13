import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ValueCompare from './components/ValueCompare';
import RecipeCosting from './components/RecipeCosting';
import SalesTracker from './components/SalesTracker';
import FinancialTracker from './components/FinancialTracker';
import ExcelManagerModal from './components/ExcelManagerModal';
import { Sparkles, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('compare');
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // States for each module
  const [compareData, setCompareData] = useState([]);
  const [recipeData, setRecipeData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [financialData, setFinancialData] = useState([]);

  // Handler to import external JSON into states
  const handleImportData = (sheetName, jsonRows) => {
    const sName = sheetName.toLowerCase();
    if (sName.includes('compare') || sName.includes('sheet1') || activeTab === 'compare') {
      const mapped = jsonRows.map((row, idx) => ({
        id: Date.now() + idx,
        name: row['ชื่อสินค้า (Item)'] || row['Ingredient'] || row['Item'] || `Item ${idx+1}`,
        qty: parseFloat(row['ปริมาณ (Qty)'] || row['Qty'] || row['Purchased Qty (g)']) || 1000,
        price: parseFloat(row['ราคา (Price THB)'] || row['Price'] || row['Purchase Price (THB)']) || 100,
        unit: row['หน่วย (Unit)'] || row['Unit'] || 'กรัม (g)',
        remark: row['หมายเหตุ (Remark)'] || ''
      }));
      setCompareData(mapped);
    } else if (sName.includes('recipe') || activeTab === 'recipe') {
      const mapped = jsonRows.map((row, idx) => ({
        id: Date.now() + idx,
        name: row['Ingredient'] || row['ชื่อวัตถุดิบ'] || `Ingredient ${idx+1}`,
        purchasedQty: parseFloat(row['Purchased Qty (g)'] || row['Purchased Qty']) || 1000,
        purchasePrice: parseFloat(row['Purchase Price (THB)'] || row['Purchase Price']) || 100,
        recipeAmount: parseFloat(row['Recipe Amount (g)'] || row['Recipe Amount']) || 50
      }));
      setRecipeData(mapped);
    } else if (sName.includes('sales') || sName.includes('market') || activeTab === 'sales') {
      const mapped = jsonRows.map((row, idx) => ({
        id: Date.now() + idx,
        date: row['Date'] || new Date().toISOString().split('T')[0],
        product: row['Product Item'] || row['Product'] || `Product ${idx+1}`,
        unitsSold: parseFloat(row['Units Sold']) || 10,
        unitPrice: parseFloat(row['Unit Price (THB)'] || row['Unit Price']) || 50
      }));
      setSalesData(mapped);
    } else if (sName.includes('finan') || sName.includes('stock') || activeTab === 'financial') {
      const mapped = jsonRows.map((row, idx) => ({
        id: Date.now() + idx,
        ticker: row['Ticker'] || `TICKER${idx+1}`,
        shares: parseFloat(row['Shares']) || 10,
        avgCost: parseFloat(row['Avg Cost ($)']) || 100,
        currentPrice: parseFloat(row['Current Price ($)']) || 110,
        estDividend: parseFloat(row['Est. Annual Dividend ($)']) || 0
      }));
      setFinancialData(mapped);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={() => setIsExcelModalOpen(true)}
        onImportClick={() => setIsExcelModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'compare' && (
          <ValueCompare data={compareData} setData={setCompareData} />
        )}
        {activeTab === 'recipe' && (
          <RecipeCosting data={recipeData} setData={setRecipeData} />
        )}
        {activeTab === 'sales' && (
          <SalesTracker data={salesData} setData={setSalesData} />
        )}
        {activeTab === 'financial' && (
          <FinancialTracker data={financialData} setData={setFinancialData} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">All Excel Web Program</span>
            <span>— รองรับทั้ง Cal - Compare value.xlsx และ Ingredient Costing Calculator.xlsx</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready & Active
            </span>
            <span>GitHub Repository: <code className="text-indigo-300">teetawat-2580/all-excel-web-program</code></span>
          </div>
        </div>
      </footer>

      {/* Excel Import/Export Modal */}
      <ExcelManagerModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        activeTab={activeTab}
        compareData={compareData}
        recipeData={recipeData}
        salesData={salesData}
        financialData={financialData}
        onImportData={handleImportData}
      />
    </div>
  );
}
