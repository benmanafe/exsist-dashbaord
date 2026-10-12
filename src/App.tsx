import { createElement, FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

type IconName =
  | "briefcase"
  | "calendar"
  | "chart"
  | "chevron"
  | "claim"
  | "close"
  | "fund"
  | "home"
  | "invest"
  | "maximize"
  | "menu"
  | "minimize"
  | "people"
  | "send"
  | "service"
  | "user";

const iconPaths: Record<IconName, string> = {
  briefcase: "M5 7h14v11H5z M9 7V4h6v3 M5 11h14 M10 11v2h4v-2",
  calendar: "M5 5h14v15H5z M8 3v4 M16 3v4 M5 9h14 M8 13h2 M12 13h2 M16 13h1 M8 16h2 M12 16h2",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2",
  chevron: "m7 9 5 5 5-5",
  claim: "M7 3h8l4 4v14H7z M15 3v5h4 M10 12h6 M10 16h4 M4 7v12",
  close: "M6 6l12 12M18 6 6 18",
  fund: "M5 8h14M7 8l1-4h8l1 4M6 8l1 13h10l1-13 M10 12v5 M14 12v5",
  home: "m3 11 9-8 9 8v10h-6v-6H9v6H3z",
  invest: "M4 19V9 M10 19V5 M16 19v-8 M22 19H2 M3 6l6-3 6 4 6-5",
  maximize: "M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0v6h-6v-2h4v-4h2z",
  menu: "M4 7h16M4 12h16M4 17h16",
  minimize: "M6 6h4v2H8v2H6V6zm8 0v4h-2V8h-2V6h4zM6 14h2v2h2v2H6v-4zm10 0h-2v2h-2v2h4v-4z",
  people: "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 20v-2a4 4 0 0 0-3-3.87 M16 2.13a4 4 0 0 1 0 7.75",
  send: "m22 2-7 20-4-9-9-4z M22 2 11 13",
  service: "M4 14a8 8 0 0 1 16 0 M4 14v5h4v-6H4 M20 14v5h-4v-6h4 M16 20c-1 1-2 1-4 1",
  user: "M20 21a8 8 0 0 0-16 0 M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10",
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d={iconPaths[name]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function Button({
  children,
  className = "",
  onClick,
  title,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  type?: "button" | "submit";
}) {
  return createElement(
    "button",
    { className, onClick, title, type },
    children,
  );
}

const metrics = [
  { icon: "people" as IconName, label: "Tenaga Kerja Aktif", value: "48.629.219", mom: "-1,20%", yoy: "+15,70%" },
  { icon: "claim" as IconName, label: "Penerimaan Iuran", value: "Rp 80.446 M", mom: "-89,62%", yoy: "-1,53%" },
  { icon: "briefcase" as IconName, label: "Nominal Klaim", value: "Rp 49.945 M", mom: "-28.822,08%", yoy: "+7,55%" },
  { icon: "fund" as IconName, label: "Dana Investasi", value: "Rp 944.230 M", mom: "-1,25%", yoy: "+8,29%" },
];

const programs = [
  { code: "JHT", name: "Jaminan Hari Tua", cases: "3.054.872", amount: "43.161 M", tone: "orange" },
  { code: "JKK", name: "Jaminan Kecelakaan Kerja", cases: "860.933", amount: "3.315 M", tone: "cyan" },
  { code: "JKM", name: "Jaminan Kematian", cases: "171.585", amount: "3.433 M", tone: "pink" },
  { code: "JP", name: "Jaminan Pensiun", cases: "85.525", amount: "1.566 M", tone: "olive" },
  { code: "JKP", name: "Jaminan Kehilangan Pekerjaan", cases: "333.221", amount: "861 M", tone: "gold" },
];

function Trend({ mom, yoy }: { mom: string; yoy: string }) {
  return (
    <div className="trend-row">
      <span className={mom.startsWith("+") ? "trend up" : "trend down"}>▾ {mom} MoM</span>
      <span className={yoy.startsWith("+") ? "trend up" : "trend down"}>▴ {yoy} YoY</span>
    </div>
  );
}

function MetricCard({ item }: { item: (typeof metrics)[number] }) {
  return (
    <section className="metric-card">
      <div className="metric-label"><Icon name={item.icon} />{item.label}</div>
      <div className="metric-value">{item.value}</div>
      <Trend mom={item.mom} yoy={item.yoy} />
    </section>
  );
}

function ProgressCard({
  label,
  onClick,
  percent,
  segments,
  target,
  value,
  detailHint,
}: {
  label: string;
  onClick?: () => void;
  percent: string;
  segments: string[];
  target: string;
  value: string;
  detailHint?: boolean;
}) {
  const content = (
    <>
      <div className="section-heading">
        <span className="section-label">
          {label}
          {detailHint && <span className="detail-hint">Lihat Detil</span>}
        </span>
        <strong>{percent}<small>Capaian YTD</small></strong>
      </div>
      <div className="progress-bar">
        {segments.map((segment, index) => <span className={`progress-segment segment-${index + 1}`} key={segment}>{segment}</span>)}
        <span className="progress-rest">Sisa Target</span>
      </div>
      <div className="progress-meta">Realisasi : <b>{value}</b><i />Target : <b>{target}</b></div>
    </>
  );
  if (onClick) {
    return createElement("button", { className: "progress-card interactive-progress", onClick, type: "button" }, content);
  }
  return <section className="progress-card">{content}</section>;
}

function Sidebar({
  active,
  collapsed,
  onChange,
  onCloseSidebar,
  onCollapse,
  onLogout,
}: {
  active: string;
  collapsed: boolean;
  onChange: (item: string) => void;
  onCloseSidebar: () => void;
  onCollapse: () => void;
  onLogout: () => void;
}) {
  const [investOpen, setInvestOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const nav = [
    ["Beranda", "home"],
    ["Kepesertaan", "people"],
    ["Pelayanan", "service"],
  ] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="brand">
        {collapsed ? (
          <img src="/logo-short.svg" alt="EXSIST" className="logo-short" />
        ) : (
          <img src="/logo-full.svg" alt="EXSIST" className="logo-full" />
        )}
      </div>
      <nav className="main-nav" aria-label="Navigasi utama">
        {nav.map(([label, icon]) => (
          <Button className={active === label ? "nav-item active" : "nav-item"} key={label} onClick={() => { onChange(label); onCloseSidebar(); }}>
            <Icon name={icon} /><span>{label}</span>
          </Button>
        ))}
        <Button className={active === "Investasi" ? "nav-item active" : "nav-item"} onClick={() => { onChange("Investasi"); setInvestOpen(!investOpen); }}>
          <Icon name="invest" /><span>Investasi</span><Icon name="chevron" />
        </Button>
        {investOpen && !collapsed && <div className="subnav"><span>Dana</span><span>Hasil</span></div>}
        <Button className="nav-item" onClick={() => { onChange("Channel"); onCloseSidebar(); }}><Icon name="service" /><span>Channel</span><Icon name="chevron" /></Button>
        <Button className="nav-item" onClick={() => { onChange("Profil PK/BU"); onCloseSidebar(); }}><Icon name="briefcase" /><span>Profil PK/BU</span></Button>
      </nav>
      <div className="profile-wrap" ref={profileRef}>
        <Button className="profile-card" onClick={() => setProfileMenuOpen((value) => !value)}>
          <span className="avatar"><Icon name="user" /></span>
          <div><b>Nama Pengguna</b><small>Direktur Utama</small></div>
        </Button>
        {profileMenuOpen && (
          <div className="profile-menu">
            <Button onClick={onLogout}>Keluar</Button>
          </div>
        )}
      </div>
      <Button className="collapse-button" onClick={onCollapse} title={collapsed ? "Buka menu" : "Tutup menu"}><Icon name={collapsed ? "menu" : "chevron"} /></Button>
    </aside>
  );
}

function ProgramBadge({ tone, code }: { tone: string; code: string }) {
  return <span className={`program-badge ${tone}`}>{code.slice(0, 1)}</span>;
}

function ClaimDetails({ tab }: { tab: string }) {
  const multiplier = tab === "Detail Dana Investasi" ? ["933.625 M", "93,25%"] : tab === "Detail Hasil Investasi" ? ["44.133 M", "62,72%"] : ["52.336 M", "4.507.136"];
  return (
    <section className="detail-panel">
      <div className="detail-summary">
        <div><small>{tab.replace("Detail ", "")}</small><strong>{multiplier[0]}</strong></div>
        <div><small>{tab === "Detail Klaim" ? "Jumlah kasus" : "Capaian YTD"}</small><strong>{multiplier[1]}</strong></div>
      </div>
      <div className="detail-grid">
        {programs.map((program, index) => (
          <div className="program-row" key={program.code}>
            <ProgramBadge code={program.code} tone={program.tone} />
            <div className="program-name"><b>{program.code}</b><small>{program.name}</small></div>
            <div><b>{tab === "Detail Klaim" ? program.cases : `${[552470, 80293, 19394, 252524, 17674][index].toLocaleString("id-ID")} M`}</b><small>{tab === "Detail Klaim" ? "Jumlah kasus" : "Realisasi"}</small></div>
            <div><b>{tab === "Detail Klaim" ? program.amount : `${[93.17, 89.66, 100.5, 95.89, 81.82][index].toLocaleString("id-ID")}%`}</b><small>{tab === "Detail Klaim" ? "Nominal" : "Capaian"}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
}

const coverageRows = [
  { name: "Jawa Timur", coverage: 18.4, potential: "29,80 jt", up: true },
  { name: "Jawa Barat", coverage: 30.2, potential: "26,13 jt", up: false },
  { name: "Jawa Tengah", coverage: 31.0, potential: "13,49 jt", up: true },
  { name: "Sumatera Utara", coverage: 24.0, potential: "5,41 jt", up: false },
  { name: "Lampung", coverage: 76.0, potential: "2,29 jt", up: true },
  { name: "Sumatera Selatan", coverage: 46.0, potential: "1,09 jt", up: false },
  { name: "Sulawesi Selatan", coverage: 94.4, potential: "848 rb", up: true },
  { name: "Banten", coverage: 49.4, potential: "830 rb", up: false },
  { name: "Riau", coverage: 30.5, potential: "660 rb", up: false },
  { name: "Kalimantan Barat", coverage: 30.5, potential: "660 rb", up: true },
];

const sectorRows = [
  { name: "Pertanian", coverage: 18.4, potential: "29,80 jt", up: true },
  { name: "Pertambangan", coverage: 30.2, potential: "26,13 jt", up: false },
  { name: "Industri", coverage: 31.0, potential: "13,49 jt", up: true },
  { name: "Listrik", coverage: 24.0, potential: "5,41 jt", up: false },
  { name: "Konstruksi", coverage: 76.0, potential: "2,29 jt", up: true },
  { name: "Perdagangan", coverage: 46.0, potential: "1,09 jt", up: false },
  { name: "Transportasi", coverage: 94.4, potential: "848 rb", up: true },
  { name: "Lembaga", coverage: 49.4, potential: "830 rb", up: false },
  { name: "Jasa", coverage: 30.5, potential: "660 rb", up: false },
];

function CoverageTable({
  rows,
  title,
}: {
  rows: typeof coverageRows;
  title: string;
}) {
  return (
    <section className="coverage-table">
      <div className="coverage-table-title">{title && <b>{title}</b>}<div><span>Coverage</span><span>Sisa Potensi</span></div></div>
      {rows.map((row) => (
        <div className="coverage-row" key={row.name}>
          <span className="coverage-name">{row.name}</span>
          <span className="mini-bar blue"><i /></span>
          <b>{row.coverage.toLocaleString("id-ID", { minimumFractionDigits: 1 })}%</b>
          <span className={row.up ? "direction up" : "direction down"}>{row.up ? "▲" : "▼"}</span>
          <span className="mini-bar orange"><i /></span>
          <span className="potential">{row.potential}</span>
        </div>
      ))}
    </section>
  );
}

function CoveragePage({ onBack }: { onBack: () => void }) {
  const [participant, setParticipant] = useState("Seluruh Peserta");
  const [display, setDisplay] = useState("Visual");
  const [ranking, setRanking] = useState("Peringkat");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("Sisa Potensi (Terbesar)");
  const filters = ["Sisa Potensi (Terbesar)", "Potensi (Terbesar)", "Tenaga Kerja Non-Aktif", "Tenaga Kerja Keluar"];

  return (
    <main className="coverage-page">
      <div className="coverage-toolbar">
        <Button className="back-button" onClick={onBack}>← Kembali ke Beranda</Button>
        <div className="segmented">
          {["Seluruh Peserta", "Peserta Aktif"].map((item) => <Button className={participant === item ? "active" : ""} key={item} onClick={() => setParticipant(item)}>{item}</Button>)}
        </div>
        <div className="segmented">
          {["Visual", "Tabular"].map((item) => <Button className={display === item ? "active" : ""} key={item} onClick={() => setDisplay(item)}>{item}</Button>)}
        </div>
      </div>

      <section className="coverage-hero">
        <div className="coverage-hero-title"><Icon name="chart" /><div><b>COVERAGE SEMESTA {participant.toUpperCase()}</b><span>All Segment</span></div></div>
        <div className="coverage-kpis">
          <div><small>Progress</small><strong className="blue-value">37,57%</strong></div>
          <div><small>Realisasi</small><strong>48.830.183</strong></div>
          <div><small>Potensi</small><strong>129.983.320</strong><i>**Sakernas 2025</i></div>
          <div><small>Sisa</small><strong>81.153.137</strong><i className="blue-value">(62,43%)</i></div>
        </div>
        <div className="coverage-progress">
          <span>TW I: 15,20%</span><span>TW II: 12,37%</span><span>TW III: 10,00%</span><span>Sisa Target: 62,43%</span>
        </div>
      </section>

      <div className="coverage-controls">
        <div className="filter-wrap">
          <Button className="filter-button" onClick={() => setFilterOpen(!filterOpen)}>{filter}<Icon name="chevron" /></Button>
          {filterOpen && <div className="filter-menu">
            <b>Potensi</b>
            {filters.map((item, index) => (
              <Button className={filter === item ? "active" : ""} key={item} onClick={() => { setFilter(item); setFilterOpen(false); }}>
                {index === 2 && <small>Coverage</small>}{item}
              </Button>
            ))}
          </div>}
        </div>
        <div className="coverage-legend">
          <span><i className="legend-blue" />Isi = coverage (pencapaian ÷ potensi)</span>
          <span><i className="legend-orange" />Sisa potensi (peserta belum terjaring)</span>
          <span><i className="legend-line" />Garis = rata-rata nasional</span>
          <span><b className="direction up">▲</b><b className="direction down">▼</b> Di atas / di bawah nasional</span>
        </div>
      </div>

      {display === "Visual" ? (
        <>
          <div className="coverage-grid">
            <div className="coverage-panel">
              <div className="panel-heading"><b>Coverage per sektor usaha</b></div>
              <CoverageTable rows={sectorRows} title="" />
            </div>
            <div className="coverage-panel">
              <div className="panel-heading"><b>Coverage semesta per provinsi</b><div className="segmented compact">
                {["Peringkat", "Peta Prioritas"].map((item) => <Button className={ranking === item ? "active" : ""} key={item} onClick={() => setRanking(item)}>{item}</Button>)}
              </div></div>
              {ranking === "Peringkat" ? (
                <>
                  <CoverageTable rows={coverageRows} title="" />
                  <Button className="show-all">Tampilkan semua 38 propinsi</Button>
                </>
              ) : (
                <div className="bubble-chart">
                  <span className="average horizontal">Nasional 38,03%</span>
                  <span className="average vertical">Rata-rata potensi 3,42 jt</span>
                  {coverageRows.map((row, index) => (
                    <span
                      className={`${index > 4 ? "bubble priority" : "bubble"} bubble-${index + 1}`}
                      key={row.name}
                      title={`${row.name}: ${row.coverage}%`}
                    >{index > 6 ? row.name : ""}</span>
                  ))}
                  <strong>PRIORITAS</strong>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <section className="tabular-card">
          <div className="tabular-head"><span>Provinsi</span><span>Coverage</span><span>Sisa Potensi</span></div>
          {coverageRows.map((row) => <div key={row.name}><b>{row.name}</b><span>{row.coverage.toLocaleString("id-ID")}%</span><span>{row.potential}</span></div>)}
        </section>
      )}
    </main>
  );
}

const segmentOptions = ["All Segmen", "Penerima Upah", "Bukan Penerima Upah", "Pekerja Migran Indonesia", "Jasa Konstruksi"];

const segmentSummary: Record<string, { active: string; incoming: string; contribution: string; target: string; nonActive: string; outgoing: string }> = {
  "All Segmen": { active: "49.435.155", incoming: "20.749.158", contribution: "Rp 85.381.008,96", target: "63.311.789", nonActive: "20.980.245", outgoing: "49.435.155" },
  "Penerima Upah": { active: "27.914.373", incoming: "8.158.256", contribution: "Rp 83.591.599,38", target: "31.460.218", nonActive: "19.379.966", outgoing: "6.892.071" },
  "Bukan Penerima Upah": { active: "12.866.372", incoming: "8.158.256", contribution: "Rp 1.435.671,22", target: "18.220.145", nonActive: "1.214.493", outgoing: "2.493.875" },
  "Pekerja Migran Indonesia": { active: "597.714", incoming: "183.102", contribution: "Rp 189.206,74", target: "920.000", nonActive: "148.907", outgoing: "92.410" },
  "Jasa Konstruksi": { active: "597.714", incoming: "183.102", contribution: "Rp 189.206,74", target: "920.000", nonActive: "148.907", outgoing: "92.410" },
};

const kantorWilayahRows = [
  { name: "Jawa Barat", percent: 61.2, value: "8.123.456" },
  { name: "DKI Jakarta", percent: 57.8, value: "7.654.321" },
  { name: "Jawa Timur", percent: 52.4, value: "6.987.654" },
  { name: "Jawa Tengah", percent: 41.1, value: "5.432.109" },
  { name: "Sumatera Utara", percent: 34.5, value: "4.567.890" },
  { name: "Sulawesi Selatan", percent: 24.3, value: "3.210.987" },
  { name: "Kalimantan Timur", percent: 21.7, value: "2.876.543" },
  { name: "Bali", percent: 12.6, value: "1.654.321" },
  { name: "Papua", percent: 7.8, value: "987.654" },
].sort((a, b) => b.percent - a.percent);

function parseIndonesianPercent(p: string): number {
  const normalized = p.replace(/\./g, "").replace(",", ".").replace("%", "");
  return Math.min(100, Math.max(0, parseFloat(normalized) || 0));
}

function SummaryMetric({
  centered,
  compact,
  label,
  percent,
  target,
  trend,
  value,
}: {
  centered?: boolean;
  compact?: boolean;
  label: string;
  percent?: string;
  target?: string;
  trend?: { text: string; tone: "positive" | "negative" }[];
  value: string;
}) {
  const showProgress = percent && target && target !== "0";
  const classes = [
    "membership-metric",
    compact ? "compact" : "",
    centered ? "centered" : "",
  ].filter(Boolean).join(" ");
  return (
    <section className={classes}>
      <span>{label}</span>
      <strong>{value}</strong>
      {target && <small>Target : <b>{target}</b></small>}
      {showProgress && (
        <div className="metric-progress">
          <span
            className="metric-progress-fill"
            style={{ width: `${parseIndonesianPercent(percent)}%` }}
          >
            {percent}
          </span>
        </div>
      )}
      <div>
        {trend
          ? trend.map((item) => <span className={item.tone} key={item.text}>{item.text}</span>)
          : <><span className="positive">+3,02% vs Kuartal Lalu</span><span className="negative">-0,43% MoM</span></>}
      </div>
    </section>
  );
}

function TrendChart({ label = "Tenaga Kerja Aktif" }: { label?: string }) {
  const bars = [46, 54, 49, 58, 62, 57, 68, 72, 77, 73, 84, 91];
  return (
    <section className="trend-chart-card">
      <div className="analysis-heading">
        <div><b>Tren {label}</b><small>Posisi Akhir Bulan</small></div>
        <span>Jul 2026 <b className="positive">+3,02% vs Bulan Lalu</b></span>
      </div>
      <div className="line-bars">
        {bars.map((height, index) => <i className={`line-bar bar-height-${height}`} key={index} />)}
        <span className="chart-total">27,9 jt<small>Total</small></span>
      </div>
      <div className="chart-months"><span>Agu 2025</span><span>Nov 2025</span><span>Feb 2026</span><span>Mei 2026</span><span>Jul 2026</span></div>
      <small className="chart-note">Sumbu vertikal tidak dimulai dari 0 agar perubahan antarbulan terlihat.</small>
    </section>
  );
}

function SegmentAnalysis({ segment }: { segment: string }) {
  if (segment === "All Segmen") {
    const regions = ["SUMBAGUT", "SUMBAGSEL", "DKI JAKARTA", "JAWA BARAT", "JATENG DAN DIY", "JATIM", "KALIMANTAN", "SULAWESI MALUKU", "SUMBARRIAU", "BANTEN", "BANUSPA", "INISIATIF PUSAT DAN PBI"];
    const trendData = [
      { month: "JAN", value: 24_500_000 },
      { month: "FEB", value: 31_200_000 },
      { month: "MAR", value: 28_700_000 },
      { month: "APR", value: 35_600_000 },
      { month: "MEI", value: 42_100_000 },
      { month: "JUN", value: 38_900_000 },
      { month: "JUL", value: 47_500_000 },
      { month: "AGT", value: 51_200_000 },
      { month: "SEP", value: 56_800_000 },
    ];
    return (
      <div className="konsolidasi-grid">
        <section className="analysis-card placeholder-chart-card">
          <img alt="Plot placeholder" src="/appendix/Halaman testing (5).svg" />
        </section>
        <div className="konsolidasi-right">
          <section className="analysis-card">
            <div className="analysis-heading"><b>Tren Kepesertaan</b><span>JAN - SEP 2026</span></div>
            <SingleLineChart data={trendData} yMax={60_000_000} yInterval={10_000_000} />
          </section>
          <section className="analysis-card">
            <div className="analysis-heading"><b>Analisis Pergerakan & Tren Kepesertaan</b><span>Diurutkan dari terbesar</span></div>
            <div className="region-bars">
              {regions.map((region, index) => <div key={region}><span>{region}</span><i><b className={`region-fill fill-${(index % 6) + 1}`} /></i><small>{index < 4 ? `${37 - index * 4}%` : "0%"}</small></div>)}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (segment === "Bukan Penerima Upah") {
    const lineData = [
      { month: "JAN", value: 18_500 },
      { month: "FEB", value: 19_200 },
      { month: "MAR", value: 18_800 },
      { month: "APR", value: 20_100 },
      { month: "MEI", value: 19_700 },
      { month: "JUN", value: 21_300 },
      { month: "JUL", value: 20_900 },
      { month: "AGT", value: 22_400 },
      { month: "SEP", value: 23_100 },
    ];
    const agentRows = [
      { name: "POS", percent: 92, value: "58.621" },
      { name: "BRILINK", percent: 78, value: "49.250" },
      { name: "AGEN BSI", percent: 62, value: "37.144" },
      { name: "AGEN46", percent: 48, value: "29.920" },
      { name: "PEGADAIAN", percent: 28, value: "16.715" },
    ];
    return (
      <>
        <div className="agent-metrics">
          <SummaryMetric label="Tenaga Kerja Akuisisi" value="191.650" />
          <SummaryMetric label="Tenaga Kerja Membayar" value="1.859.722" />
          <SummaryMetric label="Iuran Keagenan" value="Rp 49.666.263.940" />
        </div>
        <section className="analysis-card bukan-upah-line-card">
          <div className="analysis-heading"><b>Tren Tenaga Kerja Akuisisi</b><span>JAN - SEP 2026</span></div>
          <SingleLineChart data={lineData} yInterval={2_000} yMax={24_000} yMin={18_000} unit="rb" unitDivisor={1_000} />
        </section>
        <div className="chart-row-50-50">
          <section className="analysis-card">
            <div className="analysis-heading"><b>Kepesertaan Performa Agenan</b><span>Jenis Agenan</span></div>
            {agentRows.map((item) => (
              <div className="rank-row" key={item.name}>
                <b>{item.name}</b>
                <i><span className="agent-fill" style={{ width: `${item.percent}%` }} /></i>
                <span>{item.value}</span>
                <strong>{item.percent}%</strong>
              </div>
            ))}
          </section>
          <section className="analysis-card">
            <div className="analysis-heading"><b>Kantor Wilayah</b><span>Diurutkan dari terbesar</span></div>
            {kantorWilayahRows.map((item) => (
              <div className="rank-row" key={item.name}>
                <b>{item.name}</b>
                <i><span className="agent-fill" style={{ width: `${item.percent}%` }} /></i>
                <span>{item.value}</span>
                <strong>{item.percent.toLocaleString("id-ID")}%</strong>
              </div>
            ))}
          </section>
        </div>
      </>
    );
  }

  if (segment === "Pekerja Migran Indonesia" || segment === "Jasa Konstruksi") {
    const lineData = [
      { month: "JAN", value: 18_500 },
      { month: "FEB", value: 19_200 },
      { month: "MAR", value: 18_800 },
      { month: "APR", value: 20_100 },
      { month: "MEI", value: 19_700 },
      { month: "JUN", value: 21_300 },
      { month: "JUL", value: 20_900 },
      { month: "AGT", value: 22_400 },
      { month: "SEP", value: 23_100 },
    ];
    return (
      <>
        <section className="analysis-card pekerja-migran-line-card">
          <div className="analysis-heading"><b>Tren Tenaga Kerja Aktif</b><span>JAN - SEP 2026</span></div>
          <SingleLineChart data={lineData} yInterval={2_000} yMax={24_000} yMin={18_000} unit="rb" unitDivisor={1_000} />
        </section>
        <section className="analysis-card pekerja-migran-region-card">
          <div className="analysis-heading"><b>Kantor Wilayah</b><span>Diurutkan dari terbesar</span></div>
          {kantorWilayahRows.map((item) => (
            <div className="rank-row" key={item.name}>
              <b>{item.name}</b>
              <i><span className="agent-fill" style={{ width: `${item.percent}%` }} /></i>
              <span>{item.value}</span>
              <strong>{item.percent.toLocaleString("id-ID")}%</strong>
            </div>
          ))}
        </section>
      </>
    );
  }

  if (segment === "Penerima Upah") {
    const scaleColors = ["var(--blue-900)", "var(--blue-700)", "var(--green-500)", "var(--lime)"];
    const scaleData = [
      { name: "Besar", value: "11.724.037", percent: 42, color: scaleColors[0] },
      { name: "Menengah", value: "8.653.456", percent: 31, color: scaleColors[1] },
      { name: "Kecil", value: "5.303.731", percent: 19, color: scaleColors[2] },
      { name: "Mikro", value: "2.233.149", percent: 8, color: scaleColors[3] },
    ];

    const fieldColors = ["var(--blue-900)", "var(--blue-700)", "var(--green-500)", "var(--lime)", "var(--red-600)", "var(--line)"];
    const fieldPercents = [53.22, 14.69, 8.99, 7.11, 4.85];
    const fieldTotal = fieldPercents.reduce((sum, p) => sum + p, 0);
    const fieldData = [
      { name: "Perdagangan dan Jasa", value: "53,22%", percent: 53.22, color: fieldColors[0] },
      { name: "Industri Barang Konsumsi", value: "14,69%", percent: 14.69, color: fieldColors[1] },
      { name: "Aneka Industri", value: "8,99%", percent: 8.99, color: fieldColors[2] },
      { name: "Pertanian, Perikanan, Perkebunan", value: "7,11%", percent: 7.11, color: fieldColors[3] },
      { name: "Energi, Telekomunikasi, Transportasi", value: "4,85%", percent: 4.85, color: fieldColors[4] },
      { name: "Lainnya", value: "—", percent: parseFloat((100 - fieldTotal).toFixed(2)), color: fieldColors[5] },
    ];

    const sortedKantorWilayahRows = kantorWilayahRows;

    const lineData = [
      { month: "JAN", value: 25_200_000 },
      { month: "FEB", value: 25_500_000 },
      { month: "MAR", value: 25_900_000 },
      { month: "APR", value: 26_300_000 },
      { month: "MEI", value: 26_700_000 },
      { month: "JUN", value: 27_100_000 },
      { month: "JUL", value: 27_600_000 },
      { month: "AGT", value: 28_200_000 },
      { month: "SEP", value: 28_800_000 },
    ];

    const lapanganUsahaRows = [
      { name: "Perdagangan dan jasa", percent: 68.5, value: "9.245.120" },
      { name: "Industri barang konsumsi", percent: 42.3, value: "4.512.876" },
      { name: "Aneka industri", percent: 36.1, value: "3.891.234" },
      { name: "Pertanian perikanan perkebunan kehutanan", percent: 29.8, value: "3.215.678" },
      { name: "Energi telekomunikasi transportasi", percent: 25.4, value: "2.765.432" },
      { name: "Keuangan dan investasi", percent: 19.7, value: "2.123.987" },
      { name: "Industri dasar kimia", percent: 17.2, value: "1.876.543" },
      { name: "Properti dan real estate", percent: 13.5, value: "1.432.109" },
      { name: "Pertambangan", percent: 9.1, value: "987.654" },
    ].sort((a, b) => b.percent - a.percent);

    return (
      <>
        <div className="analysis-split">
          <section className="analysis-card">
            <div className="analysis-heading"><b>Skala Usaha</b><span>Diurutkan dari terbesar</span></div>
            <SegmentedProgressBar data={scaleData} />
          </section>
          <section className="analysis-card">
            <div className="analysis-heading"><b>Lapangan Usaha</b><span>Top 5</span></div>
            <SegmentedProgressBar data={fieldData} />
          </section>
        </div>
        <div className="chart-row-70-30">
          <section className="analysis-card">
            <div className="analysis-heading"><b>Tren Tenaga Kerja Aktif</b><span>JAN - SEP 2026</span></div>
            <SingleLineChart data={lineData} yInterval={1_000_000} yMax={29_000_000} yMin={25_000_000} />
          </section>
          <section className="analysis-card">
            <div className="analysis-heading"><b>Komposisi Skala Usaha</b></div>
            <PieChart data={scaleData} />
          </section>
        </div>
        <div className="chart-row-50-50">
          <section className="analysis-card">
            <div className="analysis-heading"><b>Lapangan Usaha</b><span>Diurutkan dari terbesar</span></div>
            {lapanganUsahaRows.map((item, index) => (
              <div className="rank-row" key={item.name}>
                <b>{item.name}</b>
                <i><span className="agent-fill" style={{ width: `${item.percent}%` }} /></i>
                <span>{item.value}</span>
                <strong>{item.percent.toLocaleString("id-ID")}%</strong>
              </div>
            ))}
          </section>
          <section className="analysis-card">
            <div className="analysis-heading"><b>Kantor Wilayah</b><span>Diurutkan dari terbesar</span></div>
            {sortedKantorWilayahRows.map((item, index) => (
              <div className="rank-row" key={item.name}>
                <b>{item.name}</b>
                <i><span className="agent-fill" style={{ width: `${item.percent}%` }} /></i>
                <span>{item.value}</span>
                <strong>{item.percent.toLocaleString("id-ID")}%</strong>
              </div>
            ))}
          </section>
        </div>
      </>
    );
  }

  return <TrendChart />;
}

function FilterSelect({
  options,
  value,
  onChange,
  scrollable,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  scrollable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="filter-select-wrap" ref={ref}>
      <button
        className="filter-select"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span>{value}</span>
        <Icon name="chevron" />
      </button>
      {open && (
        <div className={scrollable ? "filter-menu scrollable" : "filter-menu"}>
          {options.map((option) => (
            <button
              className={option === value ? "filter-option selected" : "filter-option"}
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SegmentPage() {
  const [segment, setSegment] = useState("All Segmen");
  const [display, setDisplay] = useState("Visual");
  const [metricFilter, setMetricFilter] = useState("Tenaga Kerja Aktif");
  const [segmentFilter, setSegmentFilter] = useState("All Segmen");
  const summary = segmentSummary[segment];

  const metricOptions = [
    "Tenaga Kerja Aktif",
    "Tenaga Kerja Masuk",
    "Penerimaan Iuran",
    "Tenaga Kerja Non-Aktif",
    "Tenaga Kerja Keluar",
  ];
  const scaleOptions = ["Semua Skala", "Besar", "Menengah", "Kecil", "Mikro"];
  const agentTypeOptions = ["Semua Jenis Agen", "POS", "BRILINK", "AGEN BSI", "AGEN46", "PEGADAIAN"];
  const agentMetricOptions = ["Tenaga Kerja Akuisisi", "Tenaga Kerja Membayar", "Iuran Keagenan"];

  const firstFilterOptions = segment === "Bukan Penerima Upah" ? agentTypeOptions : metricOptions;
  const secondFilterOptions =
    segment === "Penerima Upah"
      ? scaleOptions
      : segment === "Bukan Penerima Upah"
      ? agentMetricOptions
      : segmentOptions;
  const showSecondFilter = true;

  useEffect(() => {
    if (segment === "Penerima Upah") {
      setMetricFilter("Tenaga Kerja Aktif");
      setSegmentFilter("Semua Skala");
    } else if (segment === "Bukan Penerima Upah") {
      setMetricFilter("Semua Jenis Agen");
      setSegmentFilter("Tenaga Kerja Akuisisi");
    } else {
      setMetricFilter("Tenaga Kerja Aktif");
      setSegmentFilter("All Segmen");
    }
  }, [segment]);

  return (
    <>
      <div className="segment-tabs">
        {segmentOptions.map((item) => <Button className={segment === item ? "active" : ""} key={item} onClick={() => setSegment(item)}>{item}</Button>)}
      </div>
      <p className="page-description">Summary data kepesertaan dan iuran Nasional untuk {segment === "All Segmen" ? "seluruh segmen" : segment}</p>
      <div className="membership-summary">
        <SummaryMetric label="Tenaga Kerja Aktif" percent={segment === "All Segmen" ? "78,08%" : "88,73%"} target={summary.target} value={summary.active} />
        <SummaryMetric label="Tenaga Kerja Masuk" target="0" value={summary.incoming} />
        <SummaryMetric label="Penerimaan Iuran (Jutaan)" percent="72,35%" target={segment === "All Segmen" ? "118.013.426" : "115.391.428"} value={summary.contribution} />
        <SummaryMetric compact label="Tenaga Kerja Non Aktif" value={summary.nonActive} />
        <SummaryMetric compact label="Tenaga Kerja Keluar" value={summary.outgoing} />
      </div>
      <div className="analysis-toolbar">
        <b>Analisis Pergerakan & Tren Kepesertaan</b>
        <div className="toolbar-filters">
          <FilterSelect
            onChange={setMetricFilter}
            options={firstFilterOptions}
            value={metricFilter}
          />
          {showSecondFilter && (
            <FilterSelect
              onChange={setSegmentFilter}
              options={secondFilterOptions}
              value={segmentFilter}
            />
          )}
          <div className="segmented compact">{["Visual", "Tabular"].map((item) => <Button className={display === item ? "active" : ""} key={item} onClick={() => setDisplay(item)}>{item}</Button>)}</div>
        </div>
      </div>
      {display === "Visual" ? <SegmentAnalysis segment={segment} /> : (
        <section className="tabular-card">
          <div className="tabular-head"><span>Indikator</span><span>Realisasi</span><span>Target</span></div>
          <div><b>Tenaga Kerja Aktif</b><span>{summary.active}</span><span>{summary.target}</span></div>
          <div><b>Tenaga Kerja Masuk</b><span>{summary.incoming}</span><span>0</span></div>
          <div><b>Penerimaan Iuran</b><span>{summary.contribution}</span><span>115.391.428</span></div>
          <div><b>Tenaga Kerja Keluar</b><span>{summary.outgoing}</span><span>—</span></div>
        </section>
      )}
    </>
  );
}

function Donut({ value, label, tone = "blue" }: { value: string; label: string; tone?: string }) {
  return <div className={`donut ${tone}`}><div><strong>{value}</strong><small>{label}</small></div></div>;
}

function LineChart({
  data,
  yMax,
  yInterval,
}: {
  data: { month: string; berpiutang: number; tertagih: number }[];
  yMax: number;
  yInterval: number;
}) {
  const width = 160;
  const height = 60;
  const padding = { top: 4, right: 8, bottom: 10, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const ySteps = yMax / yInterval;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (value: number) => padding.top + chartHeight - (value / yMax) * chartHeight;

  const berpiutangPoints = data.map((d, i) => `${getX(i)},${getY(d.berpiutang)}`).join(" ");
  const tertagihPoints = data.map((d, i) => `${getX(i)},${getY(d.tertagih)}`).join(" ");

  return (
    <div className="line-chart">
      <svg preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: ySteps + 1 }, (_, i) => {
          const y = padding.top + (i / ySteps) * chartHeight;
          return (
            <g key={i}>
              <line stroke="var(--line)" strokeWidth="0.3" x1={padding.left} x2={width - padding.right} y1={y} y2={y} />
              <text fill="var(--muted)" fontSize="3" textAnchor="end" x={padding.left - 1} y={y + 1}>
                {`${(i * yInterval) / 1000}k`}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text key={d.month} fill="var(--muted)" fontSize="3" textAnchor="middle" x={getX(i)} y={height - 2}>
            {d.month}
          </text>
        ))}
        <polyline fill="none" points={berpiutangPoints} stroke="var(--blue-700)" strokeWidth="0.8" />
        <polyline fill="none" points={tertagihPoints} stroke="var(--green-500)" strokeWidth="0.8" />
        {data.map((d, i) => (
          <g key={`dots-${d.month}`}>
            <circle cx={getX(i)} cy={getY(d.berpiutang)} fill="var(--blue-700)" r="1" />
            <circle cx={getX(i)} cy={getY(d.tertagih)} fill="var(--green-500)" r="1" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function SingleLineChart({
  data,
  yMax,
  yInterval,
  yMin = 0,
  unit = "jt",
  unitDivisor = 1_000_000,
  fill = false,
}: {
  data: { month: string; value: number }[];
  yMax: number;
  yInterval: number;
  yMin?: number;
  unit?: string;
  unitDivisor?: number;
  fill?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1020, height: 140 });
  useEffect(() => {
    if (!fill || !wrapRef.current) return;
    const el = wrapRef.current;
    const update = () => setSize({ width: Math.max(el.clientWidth, 200), height: Math.max(el.clientHeight, 120) });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fill]);
  const { width, height } = fill ? size : { width: 1020, height: 140 };
  const fontSize = fill ? 11 : 6;
  const padding = fill ? { top: 14, right: 20, bottom: 28, left: 52 } : { top: 12, right: 16, bottom: 24, left: 36 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const yRange = yMax - yMin;
  const ySteps = yRange / yInterval;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (value: number) => padding.top + chartHeight - ((value - yMin) / yRange) * chartHeight;

  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(" ");

  return (
    <div className={`single-line-chart${fill ? " fill" : ""}`} ref={wrapRef}>
      <svg viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: ySteps + 1 }, (_, i) => {
          const y = padding.top + (i / ySteps) * chartHeight;
          return (
            <g key={i}>
              <line stroke="var(--line)" strokeWidth="0.6" x1={padding.left} x2={width - padding.right} y1={y} y2={y} />
              <text fill="var(--muted)" fontSize={fontSize} textAnchor="end" x={padding.left - 6} y={y + fontSize / 3}>
                {`${(yMin + i * yInterval) / unitDivisor} ${unit}`}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text key={d.month} fill="var(--muted)" fontSize={fontSize} textAnchor="middle" x={getX(i)} y={height - 8}>
            {d.month}
          </text>
        ))}
        <polyline fill="none" points={points} stroke="var(--blue-700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={fill ? 2.5 : 1.5} />
        {data.map((d, i) => (
          <circle
            key={`dot-${d.month}`}
            cx={getX(i)}
            cy={getY(d.value)}
            fill="var(--blue-700)"
            r={fill ? 4 : 3}
            stroke="var(--surface)"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}

function SegmentedProgressBar({
  data,
}: {
  data: { name: string; value: string; percent: number; color: string }[];
}) {
  return (
    <div className="segmented-progress-bar">
      <div className="segmented-bar-track">
        {data.map((item, index) => {
          const left = data.slice(0, index).reduce((sum, d) => sum + d.percent, 0);
          return (
            <span
              key={item.name}
              className="segmented-bar-segment"
              style={{ background: item.color, left: `${left}%`, width: `${item.percent}%` }}
            />
          );
        })}
      </div>
      <div className="segmented-bar-legend">
        {data.map((item) => (
          <span key={item.name}>
            <i style={{ background: item.color }} />
            <b>{item.name}</b>
            <span>{item.value}</span>
            <strong>{item.percent.toLocaleString("id-ID", { minimumFractionDigits: 2 })}%</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

function HorizontalBarChart({
  data,
  xMax,
  xInterval,
}: {
  data: { name: string; berpiutang: number; tertagih: number }[];
  xMax: number;
  xInterval: number;
}) {
  const width = 160;
  const height = 80;
  const padding = { top: 6, right: 8, bottom: 10, left: 28 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const xSteps = xMax / xInterval;
  const rowHeight = chartHeight / data.length;
  const barHeight = rowHeight * 0.28;
  const gap = rowHeight * 0.12;

  const getX = (value: number) => padding.left + (value / xMax) * chartWidth;

  return (
    <div className="horizontal-bar-chart">
      <svg preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: xSteps + 1 }, (_, i) => {
          const x = padding.left + (i / xSteps) * chartWidth;
          return (
            <g key={i}>
              <line stroke="var(--line)" strokeWidth="0.3" x1={x} x2={x} y1={padding.top} y2={height - padding.bottom} />
              <text fill="var(--muted)" fontSize="3" textAnchor="middle" x={x} y={height - 3}>
                {`${(i * xInterval) / 1000}k`}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const y = padding.top + i * rowHeight + rowHeight / 2;
          return (
            <g key={d.name}>
              <text fill="var(--ink)" fontSize="3" textAnchor="end" x={padding.left - 2} y={y + 1}>
                {d.name}
              </text>
              <rect
                fill="var(--blue-700)"
                height={barHeight}
                width={getX(d.berpiutang) - padding.left}
                x={padding.left}
                y={y - barHeight - gap / 2}
              />
              <rect
                fill="var(--green-500)"
                height={barHeight}
                width={getX(d.tertagih) - padding.left}
                x={padding.left}
                y={y + gap / 2}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function PieChart({
  data,
}: {
  data: { name: string; value: string; percent: number; color: string }[];
}) {
  let accumulatedPercent = 0;
  const gradientStops = data
    .map((item) => {
      const start = accumulatedPercent;
      accumulatedPercent += item.percent;
      return `${item.color} ${start}% ${accumulatedPercent}%`;
    })
    .join(", ");

  return (
    <div className="pie-chart">
      <div
        className="pie"
        style={{ background: `conic-gradient(${gradientStops})` }}
      />
      <div className="pie-chart-legend">
        {data.map((item) => (
          <span key={item.name}>
            <i style={{ background: item.color }} />
            <b>{item.name}</b>
            <span>{item.value}</span>
            <strong>{item.percent.toLocaleString("id-ID", { minimumFractionDigits: 2 })}%</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

function ContributionDonut({
  data,
  tone = "blue",
}: {
  data: { name: string; percent: number; color: string }[];
  tone?: string;
}) {
  return (
    <div className="contribution-donut-wrap">
      <Donut label={data[0].name} value={`${data[0].percent.toLocaleString("id-ID", { minimumFractionDigits: 1 })}%`} tone={tone} />
      <div className="contribution-legend">
        {data.map((item) => (
          <span key={item.name}><i style={{ background: item.color }} />{item.name}</span>
        ))}
      </div>
    </div>
  );
}

function ContributionPage() {
  return (
    <>
      <div className="membership-summary compact-summary">
        <SummaryMetric centered compact label="Tenaga Kerja Aktif by Lap. Usaha" value="27.914.373" />
        <SummaryMetric centered compact label="Tenaga Kerja Aktif by BPS" value="27.914.373" />
      </div>
      <ContributionAnalysis title="Analisis Lap. Usaha" />
    </>
  );
}

const iuranMonthly = [
  { month: "Jan", value: 6812450 },
  { month: "Feb", value: 6935120 },
  { month: "Mar", value: 7021870 },
  { month: "Apr", value: 6958340 },
  { month: "Mei", value: 7084210 },
  { month: "Jun", value: 7012660 },
  { month: "Jul", value: 7103930 },
  { month: "Agu", value: 7045580 },
  { month: "Sep", value: 6987310 },
  { month: "Okt", value: 5874120 },
  { month: "Nov", value: 5312470 },
  { month: "Des", value: 4628950 },
];

function IuranTrendSection() {
  return (
    <div className="contribution-section trend-section">
      <div className="contribution-chart trend-chart">
        <div className="analysis-heading"><b>Tren Iuran Diterima</b><span>Jutaan per bulan</span></div>
        <SingleLineChart fill data={iuranMonthly} unit="T" unitDivisor={1_000_000} yInterval={1_000_000} yMax={8_000_000} yMin={4_000_000} />
      </div>
      <div className="iuran-month-list">
        {iuranMonthly.map((item, index) => {
          const prev = index > 0 ? iuranMonthly[index - 1].value : null;
          const mom = prev === null ? null : ((item.value - prev) / prev) * 100;
          return (
            <div key={item.month}>
              <span>{item.month}</span>
              <b>{item.value.toLocaleString("id-ID")}</b>
              {mom === null ? <small>—</small> : (
                <small className={mom >= 0 ? "positive" : "negative"}>
                  {mom >= 0 ? "▲ +" : "▼ "}{mom.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                </small>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const iuranRegions = ["SUMBAGUT", "SUMBAGSEL", "DKI JAKARTA", "JAWA BARAT", "JATENG DAN DIY", "JATIM", "KALIMANTAN", "SUMBARRIAU", "BANTEN", "BANUSPA"];
const regionLabel = (variant: "iuran" | undefined, index: number, fallback: string) => (variant === "iuran" ? iuranRegions[index] : fallback);

function ContributionAnalysis({ title, variant }: { title: string; variant?: "iuran" }) {
  const [region, setRegion] = useState("Nasional");
  const [display, setDisplay] = useState("Visual");
  const regionOptions = variant === "iuran"
    ? ["Nasional", ...iuranRegions]
    : [
        "Nasional",
        "Sumbagut",
        "Banuspa",
        "Inisiatif Pusat & PBI",
        "Jatim",
        "Banten",
        "Kalimantan",
        "Sulawesi Maluku",
      ];
  return (
    <>
      <div className="analysis-toolbar contribution-toolbar">
        <b>{title}</b>
        <div className="toolbar-filters">
          <FilterSelect
            onChange={setRegion}
            options={regionOptions}
            scrollable
            value={region}
          />
          <div className="segmented compact">{["Visual", "Tabular"].map((item) => <Button className={display === item ? "active" : ""} key={item} onClick={() => setDisplay(item)}>{item}</Button>)}</div>
        </div>
      </div>
      <section className="analysis-card contribution-detail">
        {variant === "iuran" ? <IuranTrendSection /> : (
        <div className="contribution-section">
          <div className="contribution-chart">
            <div className="analysis-heading"><b>Komposisi TK Aktif Lap. Usaha</b></div>
            <ContributionDonut
              data={[
                { name: "Jasa Kemasyarakatan", percent: 22.5, color: "var(--blue-700)" },
                { name: "Perdagangan dan Jasa", percent: 18.3, color: "var(--green-500)" },
                { name: "Industri Pengolahan", percent: 15.7, color: "oklch(72% 0.17 70)" },
                { name: "Pertanian dan Perkebunan", percent: 12.4, color: "var(--red-600)" },
                { name: "Konstruksi", percent: 9.8, color: "var(--line)" },
              ]}
            />
          </div>
          <div className="contribution-bars">
            {[
              { name: "Jasa Kemasyarakatan", percent: 22.5, count: 11250124 },
              { name: "Perdagangan dan Jasa", percent: 18.3, count: 9150033 },
              { name: "Industri Pengolahan", percent: 15.7, count: 7850021 },
              { name: "Pertanian dan Perkebunan", percent: 12.4, count: 6200014 },
              { name: "Konstruksi", percent: 9.8, count: 4900018 },
              { name: "Transportasi dan Pergudangan", percent: 7.2, count: 3600012 },
              { name: "Informasi dan Komunikasi", percent: 5.1, count: 2550009 },
              { name: "Keuangan dan Asuransi", percent: 3.6, count: 1800005 },
              { name: "Real Estat", percent: 2.8, count: 1400003 },
              { name: "Lainnya", percent: 2.1, count: 1050002 },
            ].map((item) => (
              <div className="contribution-bar" key={item.name}>
                <span className="contribution-bar-label">{item.name}</span>
                <div className="contribution-bar-track"><span className="contribution-bar-fill" style={{ width: `${item.percent}%` }} /></div>
                <span className="contribution-bar-count">{item.count.toLocaleString("id-ID")}</span>
                <span className="contribution-bar-value">{item.percent.toLocaleString("id-ID", { minimumFractionDigits: 1 })}%</span>
              </div>
            ))}
          </div>
        </div>
        )}
        <div className="contribution-divider" />
        <div className="contribution-section">
          <div className="contribution-chart">
            <div className="analysis-heading"><b>{variant === "iuran" ? "Komposisi Iuran Diterima" : "Komposisi TK Aktif BPS"}</b></div>
            <ContributionDonut
              data={[
                { name: "Perdagangan dan Jasa", percent: 28.4, color: "var(--green-700)" },
                { name: "Industri Barang Konsumsi", percent: 19.6, color: "var(--blue-700)" },
                { name: "Aneka Industri", percent: 14.2, color: "oklch(72% 0.17 70)" },
                { name: "Pertanian dan Perikanan", percent: 11.5, color: "var(--red-600)" },
                { name: "Konstruksi", percent: 8.9, color: "var(--line)" },
              ].map((item, index) => ({ ...item, name: variant === "iuran" && item.color === "var(--line)" ? "LAINNYA" : regionLabel(variant, index, item.name) }))}
              tone="green"
            />
          </div>
          <div className="contribution-bars">
            {[
              { name: "Perdagangan dan Jasa", percent: 28.4, count: 14200124 },
              { name: "Industri Barang Konsumsi", percent: 19.6, count: 9800056 },
              { name: "Aneka Industri", percent: 14.2, count: 7100021 },
              { name: "Pertanian dan Perikanan", percent: 11.5, count: 5750014 },
              { name: "Konstruksi", percent: 8.9, count: 4450011 },
              { name: "Transportasi dan Pergudangan", percent: 6.3, count: 3150008 },
              { name: "Informasi dan Komunikasi", percent: 4.2, count: 2100005 },
              { name: "Keuangan dan Asuransi", percent: 3.1, count: 1550003 },
              { name: "Real Estat", percent: 2.4, count: 1200002 },
              { name: "Lainnya", percent: 1.4, count: 700001 },
            ].map((item, index) => ({ ...item, name: regionLabel(variant, index, item.name) })).map((item) => (
              <div className="contribution-bar" key={item.name}>
                <span className="contribution-bar-label">{item.name}</span>
                <div className="contribution-bar-track"><span className="contribution-bar-fill" style={{ width: `${item.percent}%` }} /></div>
                <span className="contribution-bar-count">{item.count.toLocaleString("id-ID")}</span>
                <span className="contribution-bar-value">{item.percent.toLocaleString("id-ID", { minimumFractionDigits: 1 })}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ReceivablesPage() {
  const [display, setDisplay] = useState("Visual");
  const [region, setRegion] = useState("Nasional");
  const [startDate, setStartDate] = useState("1 September 2026");
  const [endDate, setEndDate] = useState("1 Oktober 2026");
  const [metricType, setMetricType] = useState("Piutang");
  const metricTypeOptions = ["Piutang", "Tertagih"];
  const [debtPage, setDebtPage] = useState(0);
  const debtsPerPage = 5;
  const regionOptions = [
    "Nasional",
    "Sumbagut",
    "Banuspa",
    "Inisiatif Pusat & PBI",
    "Jatim",
    "Banten",
    "Kalimantan",
    "Sulawesi Maluku",
  ];
  const dateOptions = [
    "1 Agustus 2026",
    "1 September 2026",
    "1 Oktober 2026",
    "1 November 2026",
    "1 Desember 2026",
  ];
  const regionBarData = [
    { name: "JAWA BARAT", berpiutang: 220000, tertagih: 310000 },
    { name: "KALIMANTAN", berpiutang: 180000, tertagih: 260000 },
    { name: "JATIM", berpiutang: 195000, tertagih: 285000 },
    { name: "DKI JAKARTA", berpiutang: 170000, tertagih: 250000 },
    { name: "SULAWESI MALUKU", berpiutang: 150000, tertagih: 230000 },
    { name: "JATENG DAN DIY", berpiutang: 140000, tertagih: 210000 },
    { name: "SUMBAGSEL", berpiutang: 125000, tertagih: 195000 },
  ];
  const lineData = [
    { month: "DEC", berpiutang: 185000, tertagih: 245000 },
    { month: "JAN", berpiutang: 195000, tertagih: 265000 },
    { month: "FEB", berpiutang: 210000, tertagih: 280000 },
    { month: "MAR", berpiutang: 205000, tertagih: 290000 },
    { month: "APR", berpiutang: 225000, tertagih: 310000 },
    { month: "MEI", berpiutang: 240000, tertagih: 325000 },
    { month: "JUN", berpiutang: 235000, tertagih: 340000 },
    { month: "JUL", berpiutang: 255000, tertagih: 355000 },
    { month: "AUG", berpiutang: 270000, tertagih: 370000 },
  ];
  return (
    <>
      <div className="membership-summary receivable-summary">
        <SummaryMetric label="Total Nominal Piutang" value="340,5 M" />
        <SummaryMetric label="Total KPBU Berpiutang" value="340,5 M" />
        <SummaryMetric label="Total Nominal Tertagih" value="340,5 M" />
        <SummaryMetric label="Total KPBU Tertagih" value="340,5 M" />
      </div>
      <div className="analysis-toolbar receivable-toolbar">
        <b>Analisis Piutang</b>
        <div className="toolbar-filters">
          <FilterSelect
            onChange={setRegion}
            options={regionOptions}
            scrollable
            value={region}
          />
          <FilterSelect
            onChange={setStartDate}
            options={dateOptions}
            value={startDate}
          />
          <span className="filter-separator">—</span>
          <FilterSelect
            onChange={setEndDate}
            options={dateOptions}
            value={endDate}
          />
          <div className="segmented compact">{["Visual", "Tabular"].map((item) => <Button className={display === item ? "active" : ""} key={item} onClick={() => setDisplay(item)}>{item}</Button>)}</div>
        </div>
      </div>
      {display === "Visual" ? (
        <>
          <div className="receivable-grid">
            <section className="analysis-card">
              <div className="analysis-heading"><b>KPBU Piutang & Tertagih</b><span>07/09/2026</span></div>
              <LineChart data={lineData} yMax={400000} yInterval={50000} />
              <div className="chart-legend"><span><i className="dot blue" />KPBU Berpiutang</span><span><i className="dot green" />KPBU Tertagih</span></div>
            </section>
            <section className="analysis-card">
              <div className="analysis-heading"><b>Komposisi KPBU Piutang & Tertagih</b></div>
              <div className="donut-content compact-donut">
                <Donut label="Berpiutang" value="79,5%" />
                <div className="composition-list"><span><i className="composition-color color-1" />KPBU Berpiutang<b>8.653.456</b></span><span><i className="composition-color color-2" />KPBU Tertagih<b>2.233.149</b></span></div>
              </div>
            </section>
          </div>
          <div className="analysis-toolbar receivable-toolbar">
            <b>Detail Piutang</b>
            <FilterSelect
              onChange={setMetricType}
              options={metricTypeOptions}
              value={metricType}
            />
          </div>
          <div className="receivable-grid lower">
            <section className="analysis-card">
              <div className="analysis-heading"><b>Region KPBU Piutang & Tertagih</b></div>
              <HorizontalBarChart data={regionBarData} xMax={400000} xInterval={50000} />
              <div className="chart-legend"><span><i className="dot blue" />KPBU Berpiutang</span><span><i className="dot green" />KPBU Tertagih</span></div>
            </section>
            <section className="analysis-card">
              <div className="analysis-heading"><b>Piutang Terurut (Terbesar)</b></div>
              {[
                { name: "Jawa Barat", value: 15234567 },
                { name: "DKI Jakarta", value: 14123890 },
                { name: "Kalimantan", value: 12987654 },
                { name: "Jatim", value: 11876543 },
                { name: "Sulawesi Maluku", value: 10765432 },
                { name: "Sumatera Utara", value: 9654321 },
                { name: "Banten", value: 8543210 },
                { name: "Jateng", value: 7432109 },
                { name: "Sumatera Selatan", value: 6321098 },
                { name: "Papua", value: 5210987 },
              ]
                .slice(debtPage * debtsPerPage, (debtPage + 1) * debtsPerPage)
                .map((item, index) => (
                  <div className="top-debt" key={item.name}>
                    <span>{debtPage * debtsPerPage + index + 1}</span>
                    <b>{item.name}</b>
                    <strong>{item.value.toLocaleString("id-ID")}</strong>
                  </div>
                ))}
              <div className="top-debt-pagination">
                <button disabled={debtPage === 0} onClick={() => setDebtPage(debtPage - 1)} type="button">←</button>
                <span>{debtPage + 1} / 2</span>
                <button disabled={debtPage === 1} onClick={() => setDebtPage(debtPage + 1)} type="button">→</button>
              </div>
            </section>
          </div>
        </>
      ) : (
        <section className="tabular-card">
          <div className="tabular-head"><span>Wilayah</span><span>Berpiutang</span><span>Tertagih</span></div>
          {["Jawa Barat", "Kalimantan", "Jatim", "DKI Jakarta", "Sulawesi Maluku"].map((item, index) => <div key={item}><b>{item}</b><span>{[11724037, 8653456, 5303731, 2233149, 1233149][index].toLocaleString("id-ID")}</span><span>{(20.5 - index).toFixed(1)}%</span></div>)}
        </section>
      )}
    </>
  );
}

function IuranPage() {
  const formatId = (value: number) => Math.round(value).toLocaleString("id-ID");
  const target = 118013426;
  const total = iuranMonthly.reduce((sum, item) => sum + item.value, 0);
  const average = total / iuranMonthly.length;
  const achievement = (total / target) * 100;
  return (
    <>
      <div className="membership-summary two-up">
        <SummaryMetric
          label="Penerimaan Iuran (Jutaan)"
          percent={`${achievement.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}
          target={formatId(target)}
          value={formatId(total)}
        />
        <SummaryMetric
          label="Rata-rata Iuran per Bulan (Jutaan)"
          target={formatId(target / 12)}
          value={formatId(average)}
        />
      </div>
      <ContributionAnalysis title="Analisis Iuran" variant="iuran" />
    </>
  );
}

function MembershipPage() {
  const [category, setCategory] = useState("TK Aktif");
  return (
    <main className="membership-page">
      <div className="membership-categories">
        {["TK Aktif", "Iuran", "Piutang", "Lap. Usaha"].map((item) => <Button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</Button>)}
      </div>
      {category === "TK Aktif" && <SegmentPage />}
      {category === "Lap. Usaha" && <ContributionPage />}
      {category === "Iuran" && <IuranPage />}
      {category === "Piutang" && <ReceivablesPage />}
    </main>
  );
}

const promptReplies: Record<string, string> = {
  "Apa yang bisa kamu lakukan?": "Saya dapat merangkum kinerja, membandingkan realisasi dengan target, dan membantu menemukan indikator yang perlu perhatian.",
  "Jenis pertanyaan apa yang bisa saya ajukan?": "Tanyakan tren bulanan, capaian program, jumlah kasus klaim, atau perbandingan kinerja investasi.",
  "Bantu aku memecahkan masalah": "Tentu. Pilih indikator yang ingin dianalisis, lalu saya bantu mengurai penyebab dan peluang tindak lanjutnya.",
};

function ChatPanel({ fullscreen, onClose, onToggleFullscreen }: { fullscreen: boolean; onClose: () => void; onToggleFullscreen: () => void }) {
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [draft, setDraft] = useState("");

  const ask = (text: string) => {
    if (!text.trim()) return;
    const reply = promptReplies[text] ?? "Saya menemukan capaian target tenaga kerja aktif sebesar 76,81%. Tren tahunan masih positif di +15,70%, meski terjadi koreksi bulanan sebesar -1,20%.";
    setMessages((current) => [...current, { from: "user", text }, { from: "bot", text: reply }]);
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") ask(draft);
  };

  return (
    <aside className={fullscreen ? "chat-panel fullscreen" : "chat-panel"}>
      <div className="chat-header"><span>EXSIST Assistant</span><div className="chat-header-actions"><Button onClick={onToggleFullscreen} title={fullscreen ? "Keluar layar penuh" : "Layar penuh"}><Icon name={fullscreen ? "minimize" : "maximize"} /></Button><Button onClick={onClose} title="Tutup asisten"><Icon name="close" /></Button></div></div>
      <div className="chat-body">
        <div className="assistant-mark">AI</div>
        <div className="chat-greeting"><b>Halo, Nama</b><span>Ada yang bisa saya bantu?</span></div>
        {messages.length === 0 && <div className="prompt-list">
          {Object.keys(promptReplies).map((prompt) => <Button key={prompt} onClick={() => ask(prompt)}>{prompt}</Button>)}
        </div>}
        <div className="messages">
          {messages.map((message, index) => <div className={`message ${message.from}`} key={`${message.from}-${index}`}>{message.text}</div>)}
        </div>
      </div>
      <div className="chat-input">
        {createElement("input", {
          "aria-label": "Tulis pertanyaan",
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => setDraft(event.target.value),
          onKeyDown: handleKeyDown,
          placeholder: "Tulis pertanyaan...",
          value: draft,
        })}
        <Button onClick={() => ask(draft)} title="Kirim pertanyaan"><Icon name="send" /></Button>
      </div>
    </aside>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    if (!form.get("username") || !form.get("password")) {
      setError("Masukkan username dan password untuk melanjutkan.");
      return;
    }
    onLogin();
  };
  return (
    <main className="login-page">
      <div className="login-top"><img src="/login-header-logo.png" alt="BPJS Ketenagakerjaan" className="login-header-logo" /></div>
      {createElement("form", { className: "login-card", onSubmit: submit },
        <div className="login-brand"><img src="/logo-full.svg" alt="EXSIST" className="login-brand-logo" /></div>,
        <label><span><strong>Username</strong></span>{createElement("input", { name: "username", placeholder: "Masukkan username" })}</label>,
        <label><span><strong>Password</strong></span>{createElement("input", { name: "password", placeholder: "Masukkan password", type: "password" })}</label>,
        <div className="captcha-row"><span className="captcha-code">EX26</span>{createElement("input", { name: "captcha", placeholder: "Captcha" })}</div>,
        error && <div className="login-error">{error}</div>,
        <Button className="login-button" type="submit">Login</Button>,
      )}
    </main>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [page, setPage] = useState<"home" | "coverage" | "membership">("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeNav, setActiveNav] = useState("Beranda");
  const [chatOpen, setChatOpen] = useState(true);
  const [chatFullscreen, setChatFullscreen] = useState(false);
  const [tab, setTab] = useState("Detail Klaim");
  const [dateOpen, setDateOpen] = useState(false);
  const tabs = useMemo(() => ["Detail Klaim", "Detail Dana Investasi", "Detail Hasil Investasi"], []);

  useEffect(() => {
    const gapRem = 1.25;
    const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const topGap = gapRem * remPx;
    const bottomGap = gapRem * remPx;
    let rafId: number;

    const update = () => {
      const topbar = document.querySelector(".topbar");
      const headerHeight = topbar ? topbar.getBoundingClientRect().height : 6.6 * remPx;
      const scrollY = window.scrollY;
      const headerVisible = Math.max(0, headerHeight - scrollY);
      const top = headerVisible + topGap;
      const height = window.innerHeight - top - bottomGap;
      document.documentElement.style.setProperty("--chat-top", `${top}px`);
      document.documentElement.style.setProperty("--chat-height", `${height}px`);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const showChat = chatOpen;
  const chatNormal = showChat && !chatFullscreen;

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="app-shell">
      <Sidebar
        active={activeNav}
        collapsed={sidebarCollapsed}
        onChange={(item) => {
          setActiveNav(item);
          if (item === "Beranda") setPage("home");
          else if (item === "Kepesertaan") setPage("membership");
        }}
        onCloseSidebar={() => setSidebarCollapsed(true)}
        onCollapse={() => setSidebarCollapsed((value) => !value)}
        onLogout={() => setLoggedIn(false)}
      />
      {!sidebarCollapsed && <div className="sidebar-backdrop" onClick={() => setSidebarCollapsed(true)} />}
      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">{page === "coverage" ? "Kepesertaan" : activeNav === "Beranda" ? "Data Nasional" : activeNav}</span>
            <b>{page === "coverage" ? "DASHBOARD POTENSI DAN COVERAGE SEMESTA TENAGA KERJA" : page === "membership" ? "TK AKTIF · IURAN · PIUTANG · LAP. USAHA" : "SUMMARY"}</b>
            <small>Terakhir diperbarui: Sep 7, 2026 | 04:50:41</small>
          </div>
          <div className="header-actions">
            <div className="date-wrap">
              <Button className="date-button" onClick={() => setDateOpen(!dateOpen)}><span>07 / 09 / 2026</span><Icon name="calendar" /></Button>
              {dateOpen && <div className="date-menu"><b>Periode laporan</b><Button onClick={() => setDateOpen(false)}>September 2026</Button><Button onClick={() => setDateOpen(false)}>Agustus 2026</Button></div>}
            </div>
          </div>
        </header>
        <div className={chatNormal ? "content-row chat-open" : "content-row"}>
          {page === "coverage" ? (
            <CoveragePage onBack={() => setPage("home")} />
          ) : page === "membership" ? (
            <MembershipPage />
          ) : (
            <main className="dashboard">
              {activeNav !== "Beranda" && <div className="notice">Menampilkan ringkasan <b>{activeNav}</b>. Pilih Beranda untuk kembali ke dashboard nasional.</div>}
              <div className="metric-grid">{metrics.map((item) => <MetricCard item={item} key={item.label} />)}</div>
              <div className="summary-grid">
                <div className="summary-column">
                  <ProgressCard label="Target Tahunan Tenaga Kerja Aktif" percent="76,81%" segments={["TW I: 27,50%", "TW II: 27,50%", "TW III: 21,81%"]} target="63.311.789" value="48.629.219" />
                  <ProgressCard label="Coverage Tenaga Kerja" detailHint onClick={() => setPage("coverage")} percent="37,41%" segments={["TW I: 14,20%", "TW II: 16,50%", "TW III: 6,71%"]} target="129.983.320" value="48.629.219" />
                  <section className="large-stat"><div><Icon name="people" /><span>Tenaga Kerja Masuk</span></div><strong>19.720.544 <small>jiwa</small></strong><Trend mom="-86,60%" yoy="+12,11%" /></section>
                  <section className="large-stat"><div><Icon name="briefcase" /><span>Pemberi Kerja / Badan Usaha Aktif</span></div><strong>898.887 <small>BU</small></strong><Trend mom="+0,01%" yoy="+3,90%" /></section>
                </div>
                <div className="summary-column">
                  <ProgressCard label="Penerimaan Iuran" percent="68,17%" segments={["TW I: 25,40%", "TW II: 30,12%", "TW III: 12,65%"]} target="Rp 118.013 M" value="Rp 80.446 M" />
                  <section className="claim-card">
                    <div className="card-title"><Icon name="claim" />Klaim Terbayar</div>
                    <div className="claim-stats"><div><small>Nominal</small><strong>Rp 49.945 M</strong></div><div><small>Jumlah Kasus</small><strong>4.332.344</strong></div></div>
                    <Trend mom="-28.822,08%" yoy="+7,55%" />
                  </section>
                  <ProgressCard label="Dana Investasi" percent="93,25%" segments={["TW I: 40,00%", "TW II: 35,15%", "TW III: 18,10%"]} target="Rp 1.001.182 M" value="Rp 933.625 M" />
                  <ProgressCard label="Hasil Investasi" percent="61,24%" segments={["TW I: 25,00%", "TW II: 20,24%", "TW III: 16,00%"]} target="Rp 70.364 M" value="Rp 44.133 M" />
                </div>
              </div>
              <div className="tabs" role="tablist">
                {tabs.map((item) => <Button className={tab === item ? "tab active" : "tab"} key={item} onClick={() => setTab(item)}>{item}</Button>)}
              </div>
              <ClaimDetails tab={tab} />
            </main>
          )}
        </div>
        {chatFullscreen && <div className="chat-backdrop" onClick={() => setChatFullscreen(false)} />}
        {showChat && <ChatPanel fullscreen={chatFullscreen} onClose={() => { setChatOpen(false); setChatFullscreen(false); }} onToggleFullscreen={() => setChatFullscreen((value) => !value)} />}
      </div>
      {!showChat && <Button className="chat-fab" onClick={() => { setChatOpen(true); setChatFullscreen(false); }} title="Buka asisten"><span>AI</span></Button>}
    </div>
  );
}
