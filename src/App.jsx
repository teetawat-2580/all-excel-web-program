import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ValueCompare from './components/ValueCompare';
import PercentageCalc from './components/PercentageCalc';
import ExcelManagerModal from './components/ExcelManagerModal';
import { FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('compare');
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  
  const [compareData, setCompareData] = useState([]);
  const [percentData, setPercentData] = useState([]);

  // Handler to import external JSON into active module states
  const handleImportData = (sheetName, jsonRows) => {
    const sName = sheetName ? sheetName.toLowerCase() : '';
    if (sName.includes('percent') || activeTab === 'percent') {
      const mapped = jsonRows.map((row, idx) => ({
        id: Date.now() + idx,
        label: row['Label / รายการ'] || row['Label'] || row['Summary'] || `รายการ ${idx+1}`,
        total: parseFloat(row['Total (ค่าเต็ม)'] || row['Total']) || 100,
        result: parseFloat(row['Result (ค่าที่ได้)'] || row['Result']) || 75,
        target: parseFloat(row['Target']) || 75,
        notes: row['Notes'] || ''
      }));
      setPercentData(mapped);
    } else {
      const mapped = jsonRows.map((row, idx) => ({
        id: Date.now() + idx,
        name: row['ชื่อสินค้า (Item)'] || row['Ingredient'] || row['Item'] || row['ชื่อสินค้า'] || `สินค้า ${idx+1}`,
        qty: parseFloat(row['ปริมาณ (Qty)'] || row['Qty'] || row['ปริมาณ']) || 1000,
        price: parseFloat(row['ราคา (Price THB)'] || row['Price'] || row['ราคา']) || 100,
        unit: row['หน่วย (Unit)'] || row['Unit'] || row['หน่วย'] || 'กรัม (g)',
        remark: row['หมายเหตุ (Remark)'] || row['Remark'] || ''
      }));
      setCompareData(mapped);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header & Tabs */}
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
        {activeTab === 'percent' && (
          <PercentageCalc data={percentData} setData={setPercentData} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">Excel Web Suite</span>
            <span>— รองรับ Cal - Compare value.xlsx และ Percentage calculation - Personal Onenote.xlsx</span>
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
        activeTab={activeTab}
        compareData={compareData}
        percentData={percentData}
        onImportData={handleImportData}
      />
    </div>
  );
}
