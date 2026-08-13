import React from 'react';
import { Scale, Download, Upload, Sparkles, FileSpreadsheet } from 'lucide-react';

export default function Navbar({ onExport, onImportClick }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 shadow-lg shadow-amber-500/20">
              <Scale className="w-7 h-7 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Compare Value Web
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-400" /> คุ้มค่าที่สุด
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                เครื่องมือเปรียบเทียบราคาและปริมาณ (อ้างอิง Cal - Compare value.xlsx)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onImportClick}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all duration-200 shadow-sm hover:border-slate-600"
              title="นำเข้าไฟล์ Excel (.xlsx)"
            >
              <Upload className="w-4 h-4 mr-1.5 text-amber-400" />
              นำเข้า Excel
            </button>
            <button
              onClick={onExport}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02]"
              title="ส่งออกเป็นไฟล์ Excel (.xlsx)"
            >
              <Download className="w-4 h-4 mr-1.5" />
              ส่งออก Excel
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
