interface Tab {
  value: string;
  label: string;
}

interface OrderTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
}

export function OrderTabs({ tabs, activeTab, onChange }: OrderTabsProps) {
  return (
    <div className="mb-6 bg-white border border-slate-100 rounded-xl p-1 shadow-sm flex overflow-x-auto scrollbar-none gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-bold rounded-lg transition-all flex-1 text-center ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
