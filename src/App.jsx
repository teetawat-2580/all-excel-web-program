import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ValueCompare from './components/ValueCompare';
import ExcelManagerModal from './components/ExcelManagerModal';
import { Scale, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [compareData, setCompareData] = useState([]);

  // Handler to import external JSON into Compare Value state
  const handleImportData = (jsonRows) => {
    const mapped = jsonRows.map((row, idx) => ({
      id: Date.now() + idx,
      name: row['ชื่อสินค้า (Item)'] || row['Ingredient'] || row['Item'] || row['ชื่อสินค้า'] || `สินค้า ${idx+1}`,
      qty: parseFloat(row['ปริมาณ (Qty)'] || row['Qty'] || row['ปริมาณ']) || 1000,
      price: parseFloat(row['ราคา (Price THB)'] || row['Price'] || row['ราคา']) || 100,
      unit: row['หน่วย (Unit)'] || row['Unit'] || row['หน่วย'] || 'กรัม (g)',
      remark: row['หมายเหตุ (Remark)'] || row['Remark'] || ''
    }));
    setCompareData(mapped);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header */}
      <Navbar
        onExport={() => setIsExcelModalOpen(true)}
        onImportClick={() => setIsExcelModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ValueCompare data={compareData} setData={setCompareData} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">Compare Value Web</span>
            <span>— เครื่องมือคำนวณและเปรียบเทียบความคุ้มค่า (Cal - Compare value.xlsx)</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
            </span>
            <span>GitHub: <code className="text-amber-300">teetawat-2580/all-excel-web-program</code></span>
          </div>
        </div>
      </footer>

      {/* Excel Import/Export Modal */}
      <ExcelManagerModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        compareData={compareData}
        onImportData={handleImportData}
      />
    </div>
  );
}
