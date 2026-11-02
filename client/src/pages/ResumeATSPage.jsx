import { useEffect, useState } from 'react'
import { DashboardHeader } from '../components/LiveDashboard.jsx'
import { resumesApi } from '../services/resumesApi.js'

const sections = [
  ['Strengths', 'strengths'], ['Weaknesses', 'weaknesses'],
  ['Missing sections', 'missingSections'], ['Keyword feedback', 'keywordFeedback'],
  ['Formatting feedback', 'formattingFeedback'], ['Suggestions', 'suggestions'],
]

export function ResumeATSPage() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analyses, setAnalyses] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    resumesApi.listAnalyses().then((items) => { if (active) { setAnalyses(items); setSelected(items[0] || null) } })
      .catch((failure) => { if (active) setError(failure.response?.data?.message || 'Unable to load previous analyses.') })
      .finally(() => { if (active) setHistoryLoading(false) })
    return () => { active = false }
  }, [])

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!file || file.size === 0 || file.size > 5 * 1024 * 1024 || !/\.(pdf|docx)$/i.test(file.name)) {
      setError('Choose a non-empty PDF or DOCX file up to 5 MB.')
      return
    }
    setLoading(true)
    try {
      const result = await resumesApi.analyze(file, jobDescription)
      setSelected(result)
      setAnalyses((items) => [result, ...items.filter((item) => item.id !== result.id)])
    } catch (failure) {
      setError(failure.response?.data?.message || 'Unable to analyze the resume. Please try again.')
    } finally { setLoading(false) }
  }

  return <div className="mx-auto max-w-5xl space-y-8 pb-16">
    <DashboardHeader eyebrow="Student workspace" title="Resume & ATS" description="Upload a text-based resume for advisory feedback." />
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle">
      <div><h2 className="font-display text-base font-bold">Analyze resume</h2><p className="mt-1 text-sm text-[#56627A]">PDF or DOCX, maximum 5 MB. Scanned image PDFs are not supported. Your document is processed in memory; analysis results are saved.</p></div>
      <label className="block text-sm font-semibold">Resume<input required type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-2 block w-full rounded-xl border border-[#E4E7EF] p-3 text-sm" /></label>
      <label className="block text-sm font-semibold">Job description (optional)<textarea value={jobDescription} maxLength={5000} onChange={(event) => setJobDescription(event.target.value)} rows={5} className="mt-2 block w-full rounded-xl border border-[#E4E7EF] p-3 text-sm" /></label>
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <button type="submit" disabled={loading} className="rounded-xl bg-[#5146E5] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Analyzing…' : 'Analyze resume'}</button>
    </form>
    {historyLoading ? <p className="text-sm text-[#56627A]">Loading previous analyses…</p> : analyses.length > 0 && <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6"><h2 className="font-semibold">Previous analyses</h2><div className="mt-3 flex flex-wrap gap-2">{analyses.map((item) => <button key={item.id} type="button" onClick={() => setSelected(item)} className="rounded-xl border border-[#E4E7EF] px-3 py-2 text-sm">{item.originalFileName} · {new Date(item.createdAt).toLocaleDateString()} · {item.atsScore}/100</button>)}</div></section>}
    {selected && <section className="space-y-6 rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle">
      <div><p className="text-xs text-[#56627A]">{selected.originalFileName}{selected.cached ? ' · Cached analysis' : ''}</p><h2 className="mt-2 font-display text-3xl font-bold">ATS score: {selected.atsScore}/100</h2>{selected.jobMatchScore != null && <p className="mt-2 text-sm">Job match: {selected.jobMatchScore}/100</p>}<p className="mt-2 text-xs text-[#56627A]">AI feedback is advisory and does not determine eligibility or selection.</p></div>
      <div className="grid gap-5 sm:grid-cols-2">{sections.map(([label, key]) => <div key={key}><h3 className="text-sm font-bold">{label}</h3>{selected[key]?.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#56627A]">{selected[key].map((entry, index) => <li key={index}>{entry}</li>)}</ul> : <p className="mt-2 text-sm text-[#56627A]">No feedback in this category.</p>}</div>)}</div>
      {selected.missingKeywords?.length > 0 && <div><h3 className="text-sm font-bold">Missing job keywords</h3><p className="mt-2 text-sm text-[#56627A]">{selected.missingKeywords.join(', ')}</p></div>}
    </section>}
    {!historyLoading && !selected && <p className="text-sm text-[#56627A]">No resume analysis yet.</p>}
  </div>
}
