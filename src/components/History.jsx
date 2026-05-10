import { useState } from 'react'

const MOCK_HISTORY = [
  { id: 1, filename: 'TD_Chequing_Jan2024.pdf', type: 'Bank Statement', pages: 4, date: '2024-01-31', rows: 12, status: 'complete' },
  { id: 2, filename: 'Invoice_INV-2024-0847.pdf', type: 'Invoice', pages: 2, date: '2024-01-28', rows: 4, status: 'complete' },
  { id: 3, filename: 'Q4_2023_FinancialReport.pdf', type: 'Financial Report', pages: 12, date: '2024-01-25', rows: 4, status: 'complete' },
  { id: 4, filename: 'T4_2023_Slips.pdf', type: 'Tax Document', pages: 3, date: '2024-01-22', rows: 6, status: 'complete' },
  { id: 5, filename: 'Receipt_Nordstrom_Jan14.pdf', type: 'Receipt', pages: 1, date: '2024-01-14', rows: 3, status: 'complete' },
  { id: 6, filename: 'BMO_Savings_Dec2023.pdf', type: 'Bank Statement', pages: 6, date: '2024-01-10', rows: 24, status: 'complete' },
  { id: 7, filename: 'Invoice_INV-2024-0831.pdf', type: 'Invoice', pages: 1, date: '2024-01-08', rows: 5, status: 'complete' },
  { id: 8, filename: 'AnnualReport_2023.pdf', type: 'Financial Report', pages: 28, date: '2024-01-05', rows: 18, status: 'review' },
  { id: 9, filename: 'Scotiabank_Nov2023.pdf', type: 'Bank Statement', pages: 4, date: '2023-12-31', rows: 19, status: 'complete' },
  { id: 10, filename: 'Receipt_Costco_Dec28.pdf', type: 'Receipt', pages: 1, date: '2023-12-28', rows: 11, status: 'complete' },
]

const TYPE_COLORS = {
  'Bank Statement': 'bg-blue-100 text-blue-700',
  'Invoice': 'bg-purple-100 text-purple-700',
  'Financial Report': 'bg-indigo-100 text-indigo-700',
  'Tax Document': 'bg-amber-100 text-amber-700',
  'Receipt': 'bg-green-100 text-green-700',
}

const STATUS_CONFIG = {
  complete: { label: 'Complete', cls: 'bg-green-100 text-green-700' },
  review: { label: 'Needs Review', cls: 'bg-amber-100 text-amber-700' },
  error: { label: 'Error', cls: 'bg-red-100 text-red-700' },
}

function DocIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

export default function History() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [selected, setSelected] = useState(new Set())
  const [viewDoc, setViewDoc] = useState(null)

  const types = ['All', ...new Set(MOCK_HISTORY.map(d => d.type))]

  const filtered = MOCK_HISTORY.filter(d => {
    const matchSearch = d.filename.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || d.type === typeFilter
    return matchSearch && matchType
  })

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(d => d.id)))
  }

  if (viewDoc) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setViewDoc(null)} className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to History
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-medium">{viewDoc.filename}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="font-semibold text-gray-800 mb-1">{viewDoc.filename}</h2>
          <p className="text-sm text-gray-500 mb-2">{viewDoc.type} · {viewDoc.pages} pages · {viewDoc.rows} rows · Processed {viewDoc.date}</p>
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[viewDoc.status].cls}`}>
            {STATUS_CONFIG[viewDoc.status].label}
          </span>
          <div className="mt-6 flex justify-center gap-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Re-open in Extractor
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Download CSV
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document History</h1>
          <p className="text-gray-500 mt-1">{MOCK_HISTORY.length} documents processed this month</p>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{selected.size} selected</span>
            <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Download All
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                typeFilter === t
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Pages</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Rows</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50/60 transition-colors group">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selected.has(doc.id)}
                    onChange={() => toggleSelect(doc.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
                      </svg>
                    </div>
                    <span className="font-medium text-gray-800 text-sm truncate max-w-[160px] sm:max-w-[220px]">{doc.filename}</span>
                  </div>
                </td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[doc.type] || 'bg-gray-100 text-gray-600'}`}>
                    {doc.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{doc.pages}</td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{doc.rows}</td>
                <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{doc.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[doc.status].cls}`}>
                    {STATUS_CONFIG[doc.status].label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setViewDoc(doc)}
                      className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors"
                      title="View"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-colors" title="Download CSV">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            No documents found
          </div>
        )}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 text-xs text-gray-500">
          Showing {filtered.length} of {MOCK_HISTORY.length} documents
        </div>
      </div>
    </div>
  )
}
