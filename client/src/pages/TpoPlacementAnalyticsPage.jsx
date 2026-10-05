import { useState, useMemo } from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from "recharts";
import {
  statsOverview,
  placementProgressData,
  placementStatusData,
  branchPlacementData,
  packageDistributionData,
  topRecruiters,
  studentsList,
  recentUpdates,
  placementFunnel
} from "../data/tpoPlacementAnalyticsData.js";
import { Button } from "../components/ui.jsx";

export function TpoPlacementAnalyticsPage() {
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [studentSearch, setStudentSearch] = useState("");

  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.id.toLowerCase().includes(studentSearch.toLowerCase());
      const matchBranch = branchFilter === "All" || s.branch === branchFilter;
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchSearch && matchBranch && matchStatus;
    });
  }, [studentSearch, branchFilter, statusFilter]);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HEADER & FILTERS */}
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end justify-between border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">Institutional Dashboard</span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">Placement Analytics</h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Track placement progress, student outcomes, recruiters, and hiring activity across the campus.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={academicYear} 
            onChange={(e) => setAcademicYear(e.target.value)}
            className="rounded-lg border border-[#E4E7EF] bg-white px-3 py-2 text-xs font-medium text-[#0B1020] focus:outline-none focus:ring-2 focus:ring-[#5146E5]"
          >
            <option value="2026-27">2026–27</option>
            <option value="2025-26">2025–26</option>
          </select>
          <select 
            value={branchFilter} 
            onChange={(e) => setBranchFilter(e.target.value)}
            className="rounded-lg border border-[#E4E7EF] bg-white px-3 py-2 text-xs font-medium text-[#0B1020] focus:outline-none focus:ring-2 focus:ring-[#5146E5]"
          >
            <option value="All">All Branches</option>
            <option value="Computer">Computer</option>
            <option value="IT">IT</option>
            <option value="AI & DS">AI & DS</option>
            <option value="Mechanical">Mechanical</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E4E7EF] bg-white px-3 py-2 text-xs font-medium text-[#0B1020] focus:outline-none focus:ring-2 focus:ring-[#5146E5]"
          >
            <option value="All">All Statuses</option>
            <option value="Placed">Placed</option>
            <option value="In Process">In Process</option>
            <option value="Unplaced">Unplaced</option>
          </select>
        </div>
      </section>

      {/* 2. TOP METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Students", value: statsOverview.totalStudents },
          { label: "Students Placed", value: statsOverview.placed, highlight: true },
          { label: "Placement Rate", value: statsOverview.placementRate, highlight: true },
          { label: "In Process", value: statsOverview.inProcess },
          { label: "Unplaced", value: statsOverview.unplaced },
          { label: "Offers Received", value: statsOverview.offersReceived },
          { label: "Highest Package", value: statsOverview.highestPackage, highlight: true },
          { label: "Average Package", value: statsOverview.averagePackage },
          { label: "Median Package", value: statsOverview.medianPackage },
          { label: "Lowest Package", value: statsOverview.lowestPackage }
        ].map((stat, idx) => (
          <div key={idx} className="rounded-xl border border-[#E4E7EF] bg-white p-4 shadow-subtle flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">{stat.label}</span>
            <span className={`mt-1 font-display text-2xl font-extrabold ${stat.highlight ? "text-[#5146E5]" : "text-[#0B1020]"}`}>{stat.value}</span>
          </div>
        ))}
      </section>

      {/* 3. CHARTS ROW 1 */}
      <section className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Placement Progress */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle">
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold text-[#0B1020]">Placement Progress</h3>
            <p className="text-xs text-[#56627A]">Cumulative students placed over time</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={placementProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5146E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#5146E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EF" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#56627A' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#56627A' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E4E7EF', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0B1020', fontWeight: 'bold', fontSize: '13px' }}
                />
                <Area type="monotone" dataKey="placed" stroke="#5146E5" strokeWidth={3} fillOpacity={1} fill="url(#colorPlaced)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placement Status Donut */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle flex flex-col">
          <div className="mb-2">
            <h3 className="font-display text-lg font-bold text-[#0B1020]">Overall Status</h3>
            <p className="text-xs text-[#56627A]">Current distribution</p>
          </div>
          <div className="flex-1 min-h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={placementStatusData} innerRadius={65} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                  {placementStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '13px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-[#0B1020]">{statsOverview.placementRate}</span>
              <span className="text-[10px] font-bold uppercase text-[#56627A]">Placed</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E4E7EF]">
            {placementStatusData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold uppercase text-[#56627A] truncate">{item.name}</span>
                </div>
                <p className="font-bold text-sm text-[#0B1020] mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CHARTS ROW 2 */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Branch-wise Placement */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle">
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold text-[#0B1020]">Placement by Branch</h3>
            <p className="text-xs text-[#56627A]">Percentage of eligible students placed</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPlacementData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E7EF" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#56627A' }} />
                <YAxis dataKey="branch" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#0B1020', fontWeight: 600 }} width={80} />
                <RechartsTooltip cursor={{fill: '#F7F8FC'}} contentStyle={{ borderRadius: '8px', border: '1px solid #E4E7EF' }} />
                <Bar dataKey="rate" fill="#0B1020" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Package Analytics */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle">
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold text-[#0B1020]">Package Distribution</h3>
            <p className="text-xs text-[#56627A]">Volume of offers by compensation range (LPA)</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={packageDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EF" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#56627A' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#56627A' }} />
                <RechartsTooltip cursor={{fill: '#F7F8FC'}} contentStyle={{ borderRadius: '8px', border: '1px solid #E4E7EF' }} />
                <Bar dataKey="count" fill="#5146E5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 5. TABLES ROW */}
      <section className="grid lg:grid-cols-[1fr_2fr] gap-6">
        {/* Top Recruiters */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white overflow-hidden shadow-subtle flex flex-col">
          <div className="p-5 border-b border-[#E4E7EF]">
            <h3 className="font-display text-lg font-bold text-[#0B1020]">Top Recruiters</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8FC] text-[#56627A] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Offers</th>
                  <th className="px-5 py-3 font-semibold text-right">Avg Pkg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EF]">
                {topRecruiters.map((recruiter, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F8FC] transition-colors">
                    <td className="px-5 py-3 font-bold text-[#0B1020]">{recruiter.name}</td>
                    <td className="px-5 py-3 text-[#56627A]">{recruiter.offers}</td>
                    <td className="px-5 py-3 font-mono font-medium text-[#0B1020] text-right">{recruiter.avgPackage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Placement Status Table */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white overflow-hidden shadow-subtle flex flex-col">
          <div className="p-5 border-b border-[#E4E7EF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-display text-lg font-bold text-[#0B1020]">Student Roster</h3>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <input
                type="text"
                placeholder="Search student..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full sm:w-48 rounded-lg border border-[#E4E7EF] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#5146E5]"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8FC] text-[#56627A] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Branch</th>
                  <th className="px-5 py-3 hidden md:table-cell text-center">CGPA</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EF]">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F7F8FC] transition-colors cursor-pointer group">
                      <td className="px-5 py-3">
                        <p className="font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">{s.name}</p>
                        <p className="text-[10px] font-mono text-[#56627A] mt-0.5">{s.id}</p>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell text-[#56627A]">{s.branch}</td>
                      <td className="px-5 py-3 hidden md:table-cell text-center font-medium text-[#0B1020]">{s.cgpa}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.status === 'Placed' ? 'bg-[#E8F6F1] text-[#16886A]' : 
                          s.status === 'In Process' || s.status === 'Interviewing' ? 'bg-[#EEF0FF] text-[#5146E5]' : 
                          'bg-[#F1F5F9] text-[#64748B]'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-medium text-[#0B1020]">{s.package}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-xs text-[#56627A]">No students match your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-[#E4E7EF] bg-[#F7F8FC] text-center">
            <button className="text-xs font-bold text-[#5146E5] hover:underline">View all 1,248 students →</button>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM ROW: FUNNEL & UPDATES */}
      <section className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* Placement Funnel */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle flex flex-col">
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold text-[#0B1020]">Placement Funnel</h3>
            <p className="text-xs text-[#56627A]">Candidate progression through stages</p>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-1">
            {placementFunnel.map((item, idx) => {
              const max = placementFunnel[0].count;
              const width = Math.max(20, (item.count / max) * 100);
              const isLast = idx === placementFunnel.length - 1;
              return (
                <div key={idx} className="flex items-center justify-center gap-4 text-xs">
                  <div className="w-24 text-right font-medium text-[#56627A] truncate">{item.stage}</div>
                  <div className="flex-1 flex justify-center">
                    <div 
                      className={`h-8 flex items-center justify-center rounded-sm transition-all ${isLast ? 'bg-[#16886A]' : 'bg-[#0B1020]'}`}
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-[11px] font-bold text-white tracking-wider">{item.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-[#0B1020]">Live Activity</h3>
              <p className="text-xs text-[#56627A]">Recent placement updates</p>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16886A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16886A]"></span>
            </span>
          </div>
          <div className="flex-1 space-y-4">
            {recentUpdates.map((update) => (
              <div key={update.id} className="flex gap-3 text-xs">
                <span className="shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
                <div>
                  <p className="text-[#0B1020] leading-snug">{update.text}</p>
                  <p className="text-[10px] text-[#56627A] mt-1">{update.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-6 w-full text-xs justify-center py-2">
            View full log
          </Button>
        </div>
      </section>
    </div>
  );
}
