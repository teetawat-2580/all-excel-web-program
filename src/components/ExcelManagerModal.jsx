import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExcelManagerModal({ isOpen, onClose, activeTab, compareData, percentData, onImportData }) {
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Compare Value
      const compareRows = compareData.map(item => ({
        'ชื่อสินค้า (Item)': item.name,
        'ปริมาณ (Qty)': item.qty,
        'ราคา (Price THB)': item.price,
        'หน่วย (Unit)': item.unit,
        'ปริมาณ/1 บาท (Units/THB)': item.qty && item.price ? (item.qty / item.price).toFixed(3) : 0,
        'ราคา/1 หน่วย (THB/Unit)': item.qty && item.price ? (item.price / item.qty).toFixed(4) : 0,
        'หมายเหตุ (Remark)': item.remark || ''
      }));
      const wsCompare = XLSX.utils.json_to_sheet(compareRows);
      XLSX.utils.book_append_sheet(wb, wsCompare, 'Value Comparison');

      // Sheet 2: Percentage Calculation
      const percentRows = percentData.map(item => ({
        'Label / รายการ': item.label,
        'Total (ค่าเต็ม)': item.total,
        'Result (ค่าที่ได้)': item.result,
        'Percentage (%)': item.total ? ((item.result * 100) / item.total).toFixed(2) + '%' : '0%',
        'Summary 1': `${item.result} is ${item.total ? ((item.result * 100) / item.total).toFixed(2) : 0}% of ${item.total}`,
        'Summary 2': `or ${item.total ? ((item.result * 100) / item.total).toFixed(2) : 0}% of ${item.total} is ${item.result}`
      }));
      const wsPercent = XLSX.utils.json_to_sheet(percentRows);
      XLSX.utils.book_append_sheet(wb, wsPercent, 'Percentage Calculation');

      XLSX.writeFile(wb, `Excel_Web_Suite_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      setImportStatus({ type: 'success', message: 'ส่งออกไฟล์ Excel (.xlsx) รวม 2 แผ่นงานสำเร็จ!' });
    } catch (err) {
      setImportStatus({ type: 'error', message: 'เกิดข้อผิดพลาดขณะส่งออกไฟล์: ' + err.message });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        let count = 0;
        wb.SheetNames.forEach(sheetName => {
          const ws = wb.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(ws);
          if (json && json.length > 0) {
            onImportData(sheetName, json);
            count++;
          }
        });
        
        setImportStatus({ type: 'success', message: `นำเข้าข้อมูลสำเร็จ (${count} แผ่นงาน)!` });
      } catch (err) {
        setImportStatus({ type: 'error', message: 'ไม่สามารถอ่านไฟล์ Excel ได้: ' + err.message });
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative bg-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">จัดการไฟล์ Excel (.xlsx)</h3>
            <p className="text-xs text-slate-400">ส่งออกหรือนำเข้าข้อมูลกับไฟล์ Microsoft Excel</p>
          </div>
        </div>

        {importStatus && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium border ${
            importStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {importStatus.type === 'success' ? <Check className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Export Section */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">ส่งออกเป็นไฟล์ Excel</h4>
                <p className="text-xs text-slate-400">ดาวน์โหลดตารางเปรียบเทียบและเปอร์เซ็นต์</p>
              </div>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลด .xlsx</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 mb-1">นำเข้าไฟล์ Excel (.xlsx / .csv)</h4>
            <p className="text-xs text-slate-400 mb-3">เลือกไฟล์ Excel เพื่อนำเข้าตารางข้อมูล</p>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-800/40 transition-all">
              <Upload className="w-8 h-8 text-purple-400 mb-2" />
              <span className="text-xs font-semibold text-slate-200">คลิกเพื่อเลือกไฟล์ หรือ ลากไฟล์มาวางที่นี่</span>
              <span className="text-[11px] text-slate-500 mt-1">รองรับไฟล์ .xlsx, .xls, .csv</span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
