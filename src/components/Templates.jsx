import { useState } from 'react'

const TEMPLATES = [
  {
    id: 'bank-statement',
    name: 'Bank Statement',
    icon: '🏦',
    color: 'blue',
    description: 'Extract transactions, balances, and categories from personal and business bank statements.',
    fields: ['Date', 'Description', 'Amount', 'Category', 'Balance', 'Transaction ID'],
    sample: [
      { Date: '2024-01-15', Description: 'AMAZON.COM', Amount: '-$89.99', Category: 'Shopping', Balance: '$4,210.01', 'Transaction ID': 'TXN-00192' },
      { Date: '2024-01-14', Description: 'DIRECT DEPOSIT', Amount: '+$3,500.00', Category: 'Income', Balance: '$4,300.00', 'Transaction ID': 'TXN-00191' },
    ],
    uses: 1240,
  },
  {
    id: 'invoice',
    name: 'Invoice',
    icon: '🧾',
    color: 'purple',
    description: 'Parse vendor invoices for line items, tax, totals, and payment terms.',
    fields: ['Vendor', 'Invoice #', 'Date', 'Due Date', 'Line Item', 'Qty', 'Unit Price', 'Tax', 'Total'],
    sample: [
      { Vendor: 'Acme Corp', 'Invoice #': 'INV-001', Date: '2024-01-10', 'Due Date': '2024-02-10', 'Line Item': 'Consulting', Qty: '10h', 'Unit Price': '$150', Tax: '$195', Total: '$1,695' },
    ],
    uses: 3820,
  },
  {
    id: 'pl-statement',
    name: 'P&L Statement',
    icon: '📊',
    color: 'indigo',
    description: 'Extract revenue, expenses, and net income from profit & loss statements.',
    fields: ['Period', 'Revenue', 'COGS', 'Gross Profit', 'Operating Expenses', 'EBITDA', 'Net Income'],
    sample: [
      { Period: 'Q4 2023', Revenue: '$1,890,000', COGS: '$890,000', 'Gross Profit': '$1,000,000', 'Operating Expenses': '$430,000', EBITDA: '$620,000', 'Net Income': '$570,000' },
    ],
    uses: 892,
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    icon: '⚖️',
    color: 'teal',
    description: 'Extract assets, liabilities, and equity from balance sheets.',
    fields: ['Category', 'Line Item', 'Current Period', 'Prior Period', 'Change', 'Change %'],
    sample: [
      { Category: 'Current Assets', 'Line Item': 'Cash & Equivalents', 'Current Period': '$2,840,000', 'Prior Period': '$2,840,000', Change: '+$740,000', 'Change %': '+35.2%' },
    ],
    uses: 445,
  },
  {
    id: 'receipt',
    name: 'Receipt',
    icon: '🛒',
    color: 'green',
    description: 'Extract items, quantities, prices, and totals from retail and restaurant receipts.',
    fields: ['Item', 'SKU', 'Qty', 'Unit Price', 'Discount', 'Total'],
    sample: [
      { Item: 'Laptop Stand', SKU: 'EL-9920', Qty: '1', 'Unit Price': '$49.99', Discount: '$0.00', Total: '$49.99' },
    ],
    uses: 5670,
  },
  {
    id: 'tax-form',
    name: 'Tax Form',
    icon: '📋',
    color: 'amber',
    description: 'Parse T4, T1, W-2 and other tax forms for key income and deduction fields.',
    fields: ['Box', 'Field Description', 'Amount', 'Notes'],
    sample: [
      { Box: '14', 'Field Description': 'Employment Income', Amount: '$82,400.00', Notes: 'Total employment income' },
    ],
    uses: 2110,
  },
]

const COLOR_MAP = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'bg-indigo-100 text-indigo-700', badge: 'bg-indigo-100 text-indigo-700' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', icon: 'bg-teal-100 text-teal-700', badge: 'bg-teal-100 text-teal-700' },
  green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100 text-green-700', badge: 'bg-green-100 text-green-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-700', badge: 'bg-amber-100 text-amber-700' },
}

function SampleTable({ fields, sample }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50">
            {fields.map(f => (
              <th key={f} className="px-3 py-2 text-left font-semibold text-gray-500 whitespace-nowrap">{f}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sample.map((row, i) => (
            <tr key={i} className="border-t border-gray-100">
              {fields.map(f => (
                <td key={f} className="px-3 py-2 text-gray-600 whitespace-nowrap">{row[f] ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CustomTemplateModal({ onClose }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [fields, setFields] = useState([{ name: '', type: 'text' }])
  const [saved, setSaved] = useState(false)

  const addField = () => setFields(f => [...f, { name: '', type: 'text' }])
  const removeField = (i) => setFields(f => f.filter((_, idx) => idx !== i))
  const updateField = (i, key, val) => setFields(f => f.map((field, idx) => idx === i ? { ...field, [key]: val } : field))

  const handleSave = () => {
    setSaved(true)
    setTimeout(onClose, 1200)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Create Custom Template</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Template Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Expense Report"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe what this template extracts..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Fields to Extract</label>
              <button onClick={addField} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Field
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={field.name}
                    onChange={e => updateField(i, 'name', e.target.value)}
                    placeholder={`Field ${i + 1} name`}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={field.type}
                    onChange={e => updateField(i, 'type', e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="currency">Currency</option>
                  </select>
                  {fields.length > 1 && (
                    <button onClick={() => removeField(i)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {saved ? '✓ Template Saved!' : 'Save Template'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Templates() {
  const [expanded, setExpanded] = useState(null)
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      {showModal && <CustomTemplateModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Extraction Templates</h1>
          <p className="text-gray-500 mt-1">Pre-built templates for common financial document types</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Custom Template
        </button>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {TEMPLATES.map(t => {
          const c = COLOR_MAP[t.color]
          const isExpanded = expanded === t.id
          return (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center text-xl`}>
                      {t.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.name}</h3>
                      <span className="text-xs text-gray-400">{t.uses.toLocaleString()} uses</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>Built-in</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{t.description}</p>

                {/* Fields preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {t.fields.slice(0, 4).map(f => (
                    <span key={f} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">{f}</span>
                  ))}
                  {t.fields.length > 4 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-md">+{t.fields.length - 4} more</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : t.id)}
                    className="flex-1 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors font-medium"
                  >
                    {isExpanded ? 'Hide Sample' : 'View Sample'}
                  </button>
                  <button className="flex-1 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                    Use Template
                  </button>
                </div>
              </div>

              {/* Expandable sample */}
              {isExpanded && (
                <div className={`border-t ${c.border} ${c.bg} p-4`}>
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Sample Output</p>
                  <SampleTable fields={t.fields} sample={t.sample} />
                  <p className="text-xs text-gray-400 mt-2">All {t.fields.length} fields · {t.sample.length} sample row(s)</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
