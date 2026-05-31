import React, { useState } from 'react';
import { Button, Tag, theme, Table, Empty } from 'antd';
import { Package, Search, Plus, SlidersHorizontal, Eye, Trash2, ArrowUpDown } from 'lucide-react';
import { typographyTheme } from '../../../shared/theme/typography';

interface InventoryItem {
  key: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  unitPrice: number;
  totalValue: number;
  lastUpdated: string;
}

const initialItems: InventoryItem[] = [
  { key: '1', name: 'Garlic', category: 'Spices & Condiments', unit: '15 kg', stock: 15, status: 'IN_STOCK', unitPrice: 120, totalValue: 1800, lastUpdated: '24 May, 2024' },
  { key: '2', name: 'Tomato', category: 'Raw Ingredients', unit: '3.5 kg', stock: 3.5, status: 'LOW_STOCK', unitPrice: 40, totalValue: 140, lastUpdated: '24 May, 2024' },
  { key: '3', name: 'Chicken Boneless', category: 'Raw Ingredients', unit: '0 kg', stock: 0, status: 'OUT_OF_STOCK', unitPrice: 260, totalValue: 0, lastUpdated: '24 May, 2024' },
  { key: '4', name: 'Basmati Rice', category: 'Raw Ingredients', unit: '50 kg', stock: 50, status: 'IN_STOCK', unitPrice: 110, totalValue: 5500, lastUpdated: '24 May, 2024' },
  { key: '5', name: 'Sunflower Oil', category: 'Raw Ingredients', unit: '8 L', stock: 8, status: 'LOW_STOCK', unitPrice: 165, totalValue: 1320, lastUpdated: '24 May, 2024' },
  { key: '6', name: 'Red Chili Powder', category: 'Spices & Condiments', unit: '1.5 kg', stock: 1.5, status: 'LOW_STOCK', unitPrice: 220, totalValue: 330, lastUpdated: '24 May, 2024' },
  { key: '7', name: 'Fresh Milk', category: 'Dairy', unit: '25 L', stock: 25, status: 'IN_STOCK', unitPrice: 60, totalValue: 1500, lastUpdated: '24 May, 2024' },
  { key: '8', name: 'Paper Cups 250ml', category: 'Packaging', unit: '980 pcs', stock: 980, status: 'IN_STOCK', unitPrice: 0.8, totalValue: 784, lastUpdated: '24 May, 2024' }
];

export default function InventoryView(): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a' || token.colorBgBase === '#111827';
  const [activeTab, setActiveTab] = useState<'all' | 'raw' | 'spices' | 'beverages' | 'packaging'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = initialItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'raw') return matchesSearch && item.category === 'Raw Ingredients';
    if (activeTab === 'spices') return matchesSearch && item.category === 'Spices & Condiments';
    if (activeTab === 'beverages') return matchesSearch && item.category === 'Dairy'; // milk represents raw/beverage fallback
    if (activeTab === 'packaging') return matchesSearch && item.category === 'Packaging';
    return matchesSearch;
  });

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span className={`font-semibold ${typographyTheme.colors.primary}`}>{text}</span>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      responsive: ['md'] as ('xs' | 'sm' | 'md' | 'lg' | 'xl')[],
      render: (text: string) => (
        <span className={typographyTheme.colors.secondary}>{text}</span>
      )
    },
    {
      title: 'Current Stock',
      dataIndex: 'unit',
      key: 'unit',
      render: (text: string) => (
        <span className={`font-semibold ${typographyTheme.colors.primary}`}>{text}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK') => {
        let tagColor = '';
        let label = '';
        if (status === 'IN_STOCK') {
          tagColor = isDark ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' : 'bg-emerald-50 text-emerald-700 border-emerald-100';
          label = 'IN STOCK';
        } else if (status === 'LOW_STOCK') {
          tagColor = isDark ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' : 'bg-amber-50 text-amber-700 border-amber-100';
          label = 'LOW STOCK';
        } else {
          tagColor = isDark ? 'bg-rose-950/40 text-rose-400 border-rose-900/30' : 'bg-rose-50 text-rose-700 border-rose-100';
          label = 'OUT OF STOCK';
        }
        return (
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border inline-block ${tagColor}`}>
            {label}
          </span>
        );
      }
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      responsive: ['sm'] as ('xs' | 'sm' | 'md' | 'lg' | 'xl')[],
      render: (price: number) => (
        <span className={`font-medium ${typographyTheme.colors.primary}`}>₹{price.toFixed(2)}</span>
      )
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      responsive: ['md'] as ('xs' | 'sm' | 'md' | 'lg' | 'xl')[],
      render: (val: number) => (
        <span className={`font-bold ${typographyTheme.colors.primary}`}>₹{val.toLocaleString('en-IN')}</span>
      )
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      responsive: ['lg'] as ('xs' | 'sm' | 'md' | 'lg' | 'xl')[],
      render: (text: string) => (
        <span className={typographyTheme.colors.muted}>{text}</span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <div className="flex gap-1.5">
          <Button 
            type="text" 
            size="small" 
            className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg flex items-center justify-center p-0 w-8 h-8"
            icon={<Eye className="w-4 h-4" />} 
          />
          <Button 
            type="text" 
            size="small" 
            danger
            className="hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg flex items-center justify-center p-0 w-8 h-8"
            icon={<Trash2 className="w-4 h-4" />} 
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`${typographyTheme.sizes.h1} ${typographyTheme.colors.primary}`}>Inventory</h2>
          <p className={`${typographyTheme.sizes.body} ${typographyTheme.colors.secondary} mt-0.5`}>
            Track and manage all kitchen ingredients and supplies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            className="bg-orange-500 hover:bg-orange-400 border-none rounded-full flex items-center justify-center font-bold text-xs px-4 h-9 shadow-[0_4px_12px_rgba(249,115,22,0.15)]"
            icon={<Plus className="h-3.5 w-3.5 mr-0.5" />}
          >
            Add Ingredient
          </Button>
        </div>
      </div>

      {/* Metrics Row Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Items', value: '152', bg: 'border-blue-500/10 hover:border-blue-500/20 shadow-blue-500/5', color: 'text-blue-500', barBg: 'bg-blue-500/10' },
          { label: 'In Stock', value: '78', bg: 'border-emerald-500/10 hover:border-emerald-500/20 shadow-emerald-500/5', color: 'text-emerald-500', barBg: 'bg-emerald-500/10' },
          { label: 'Low Stock', value: '18', bg: 'border-amber-500/10 hover:border-amber-500/20 shadow-amber-500/5', color: 'text-amber-500', barBg: 'bg-amber-500/10' },
          { label: 'Out of Stock', value: '3', bg: 'border-rose-500/10 hover:border-rose-500/20 shadow-rose-500/5', color: 'text-rose-500', barBg: 'bg-rose-500/10' },
          { label: 'Total Value', value: '₹48,250', bg: 'border-violet-500/10 hover:border-violet-500/20 shadow-violet-500/5', color: 'text-violet-500', barBg: 'bg-violet-500/10', colSpan: 'col-span-2 md:col-span-1' }
        ].map((c) => (
          <div 
            key={c.label} 
            className={`rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01] ${c.colSpan || ''} ${
              isDark 
                ? `bg-gray-900 border-gray-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.15)]`
                : 'bg-white border-gray-100 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5 mb-2.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${typographyTheme.colors.secondary}`}>
                {c.label}
              </span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.barBg} ${c.color}`}>
                <Package className="w-4 h-4" />
              </span>
            </div>
            <h3 className={`text-xl font-extrabold ${typographyTheme.colors.primary}`}>{c.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Layout Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Table View */}
        <div className={`xl:col-span-2 rounded-2xl border p-5 transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-100 shadow-sm'
        }`}>
          {/* Table Filters Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b pb-4.5 border-gray-100 dark:border-gray-800/60">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-950 focus:border-orange-300 dark:focus:border-orange-700 transition-all text-gray-800 dark:text-gray-100 font-semibold"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: 'All Items', key: 'all' },
                { label: 'Raw Ingredients', key: 'raw' },
                { label: 'Spices & Cond.', key: 'spices' },
                { label: 'Beverages', key: 'beverages' },
                { label: 'Packaging', key: 'packaging' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'all' | 'raw' | 'spices' | 'beverages' | 'packaging')}
                  className={`text-[10px] px-3 py-1.5 font-bold rounded-lg transition-all border ${
                    activeTab === tab.key
                      ? 'bg-orange-500 border-none text-white shadow-md'
                      : 'bg-gray-50 border-gray-100 dark:bg-slate-950 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actual Table */}
          {filteredItems.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className={typographyTheme.colors.secondary}>No inventory ingredients found</span>}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table 
                dataSource={filteredItems} 
                columns={columns} 
                pagination={false} 
                className="custom-inventory-table border-none"
                rowClassName={() => 'hover:bg-slate-50/50 dark:hover:bg-slate-950/20'}
              />
            </div>
          )}
        </div>

        {/* Right 1 Column: breakdown chart legends + stock alert ticks */}
        <div className="space-y-6">
          
          {/* CATEGORY BREAKDOWN VISUALIZATION */}
          <div className={`rounded-2xl border p-5 transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
              <ArrowUpDown className="h-4.5 w-4.5 text-orange-500" />
              <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Category Breakdown</h3>
            </div>

            <div className="flex items-center justify-around py-2 gap-4">
              {/* Fake doughnut diagram rendering */}
              <div className="relative w-28 h-28 rounded-full border-[10px] border-emerald-500 flex items-center justify-center shadow-inner">
                <div className="absolute inset-[-10px] rounded-full border-[10px] border-orange-500 border-t-transparent border-r-transparent" />
                <div className="absolute inset-[-10px] rounded-full border-[10px] border-blue-500 border-b-transparent border-l-transparent rotate-45" />
                <div className="text-center">
                  <span className={`text-base font-extrabold ${typographyTheme.colors.primary}`}>5</span>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 font-extrabold uppercase mt-0.5 leading-none">Types</p>
                </div>
              </div>

              {/* Legends list */}
              <div className="space-y-2 text-[10px] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded bg-blue-500" />
                  <span className={typographyTheme.colors.secondary}>Raw Ingredients (60%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded bg-orange-500" />
                  <span className={typographyTheme.colors.secondary}>Spices & Cond. (20%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded bg-emerald-500" />
                  <span className={typographyTheme.colors.secondary}>Dairy/Beverages (12%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded bg-indigo-500" />
                  <span className={typographyTheme.colors.secondary}>Packaging (8%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* LOW STOCK ALERTS LIST */}
          <div className={`rounded-2xl border p-5 transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
                <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Low Stock Alerts</h3>
              </div>
              <span className="text-[9px] font-extrabold uppercase bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-900/30">
                18 Low
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Tomato', stock: '3.5 kg remaining', badge: 'LOW' },
                { name: 'Sunflower Oil', stock: '8 L remaining', badge: 'LOW' },
                { name: 'Red Chili Powder', stock: '1.5 kg remaining', badge: 'LOW' },
                { name: 'Ginger', stock: '2.0 kg remaining', badge: 'LOW' },
                { name: 'Cilantro Leaves', stock: '0.5 kg remaining', badge: 'CRITICAL' }
              ].map((s, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-[0.75rem] p-2.5 flex items-center justify-between text-[11px] font-medium transition-all hover:scale-[1.01] ${
                    isDark 
                      ? 'border-white/5 bg-gray-950/15 hover:border-white/10' 
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                  }`}
                >
                  <div>
                    <span className={`block font-bold ${typographyTheme.colors.primary}`}>{s.name}</span>
                    <span className={`block text-[10px] mt-0.5 ${typographyTheme.colors.secondary}`}>{s.stock}</span>
                  </div>
                  <Tag className={`rounded font-extrabold text-[8px] tracking-wider border-none px-2 py-0.5 ${
                    s.badge === 'CRITICAL' 
                      ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20' 
                      : 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  }`}>
                    {s.badge}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
