import React from 'react';
import { Scale, Percent, Download, Upload, Sparkles, FileSpreadsheet } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onExport, onImportClick }) {
  const tabs = [
    {
      id: 'compare',
      label: 'เปรียบเทียบความคุ้มค่า',
      sublabel: 'Cal - Compare Value',
      icon: Scale,
      color: 'from-amber-500 to-orange-500',
      badge: 'คุ้มค่าที่สุด'
    },
    {
      id: 'percent',
      label: 'คำนวณเปอร์เซ็นต์',
      sublabel: 'Percentage Calculation',
      icon: Percent,
      color: 'from-purple-500 to-indigo-500',
      badge: '% Of Total'
    }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-500 shadow-lg shadow-indigo-500/20">
              <FileSpreadsheet className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Excel Web Suite
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-400" /> Web Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                เครื่องมือคำนวณเปรียบเทียบความคุ้มค่า และ คำนวณเปอร์เซ็นต์
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
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02]"
              title="ส่งออกเป็นไฟล์ Excel (.xlsx)"
            >
              <Download className="w-4 h-4 mr-1.5" />
              ส่งออก Excel
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 pb-3 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white border border-indigo-500/40 shadow-md shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-sm`
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-100">{tab.label}</span>
                    {isActive && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-normal">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block -mt-0.5">
                    {tab.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
