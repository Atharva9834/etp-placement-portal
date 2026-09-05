import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LayoutDashboard, BriefcaseBusiness, CalendarDays, FileText, Bell,
  Search, Filter, MapPin, GraduationCap, Clock3, Users, Plus,
  Trash2, CheckCircle2, X, Menu, LogOut, ShieldCheck
} from 'lucide-react';
import './styles.css';

const seedDrives = [
  {
    id: 1, company: 'TCS', role: 'Software Developer', package: '₹7.5 LPA',
    eligibility: '7.0+ CGPA', branch: 'CSE, IT, ECE', deadline: '2026-09-12',
    testDate: '2026-09-15', interviewDate: '2026-09-20',
    location: 'Hybrid', applicants: 128, status: 'Ongoing'
  },
  {
    id: 2, company: 'Infosys', role: 'Systems Engineer', package: '₹6.5 LPA',
    eligibility: '6.5+ CGPA', branch: 'All Engineering', deadline: '2026-09-14',
    testDate: '2026-09-17', interviewDate: '2026-09-22',
    location: 'Campus', applicants: 94, status: 'Ongoing'
  },
  {
    id: 3, company: 'Deloitte', role: 'Analyst', package: '₹8.0 LPA',
    eligibility: '7.5+ CGPA', branch: 'CSE, IT, EEE', deadline: '2026-09-18',
    testDate: '2026-09-21', interviewDate: '2026-09-26',
    location: 'Campus', applicants: 76, status: 'Ongoing'
  },
  {
    id: 4, company: 'Accenture', role: 'Associate Software Engineer', package: '₹5.8 LPA',
    eligibility: '6.0+ CGPA', branch: 'All Engineering', deadline: '2026-09-20',
    testDate: '2026-09-24', interviewDate: '2026-09-29',
    location: 'Online', applicants: 211, status: 'Ongoing'
  }
];

function loadDrives() {
  try {
    const saved = JSON.parse(localStorage.getItem('etp-drives'));
    return Array.isArray(saved) ? saved : seedDrives;
  } catch { return seedDrives; }
}

function App() {
  const [drives, setDrives] = useState(loadDrives);
  const [page, setPage] = useState('drives');
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState(() => JSON.parse(localStorage.getItem('etp-applied') || '[]'));
  const [admin, setAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem('etp-drives', JSON.stringify(drives)), [drives]);
  useEffect(() => localStorage.setItem('etp-applied', JSON.stringify(applied)), [applied]);

  const filtered = useMemo(() => drives.filter(d =>
    (d.company + d.role).toLowerCase().includes(search.toLowerCase()) &&
    (branch === 'All' || d.branch.toLowerCase().includes(branch.toLowerCase()))
  ), [drives, search, branch]);

  const apply = (id) => {
    if (applied.includes(id)) return;
    setApplied([...applied, id]);
    setToast('Application submitted successfully');
    setSelected(null);
    setTimeout(() => setToast(''), 2500);
  };

  const addDrive = (drive) => {
    setDrives([{...drive, id: Date.now(), status: 'Ongoing', applicants: 0}, ...drives]);
    setToast('Placement drive created');
    setTimeout(() => setToast(''), 2500);
  };

  const deleteDrive = (id) => setDrives(drives.filter(d => d.id !== id));

  return (
    <div className="app">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">ET</div>
          <div><strong>E-T&P</strong><span>Placement Portal</span></div>
        </div>
        <nav>
          <NavItem icon={<LayoutDashboard/>} label="Dashboard" active={page==='dashboard'} onClick={()=>{setPage('dashboard');setMobileOpen(false)}} />
          <NavItem icon={<BriefcaseBusiness/>} label="Ongoing Drives" active={page==='drives'} onClick={()=>{setPage('drives');setMobileOpen(false)}} badge={drives.length}/>
          <NavItem icon={<CalendarDays/>} label="Upcoming Drives" active={page==='upcoming'} onClick={()=>{setPage('upcoming');setMobileOpen(false)}} />
          <NavItem icon={<FileText/>} label="My Applications" active={page==='applications'} onClick={()=>{setPage('applications');setMobileOpen(false)}} badge={applied.length}/>
          <NavItem icon={<Bell/>} label="Announcements" active={page==='announcements'} onClick={()=>{setPage('announcements');setMobileOpen(false)}} />
        </nav>
        <div className="sidebar-bottom">
          <button className="admin-switch" onClick={()=>setAdmin(!admin)}>
            <ShieldCheck size={18}/>{admin ? 'Student View' : 'Admin View'}
          </button>
          <div className="profile-mini"><div className="avatar">AG</div><div><b>Atharva</b><span>Student</span></div><LogOut size={16}/></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}><Menu/></button>
          <div>
            <p className="eyebrow">{admin ? 'ADMIN CONSOLE' : 'STUDENT PORTAL'}</p>
            <h1>{pageTitle(page, admin)}</h1>
          </div>
          <div className="top-actions">
            <div className="notification"><Bell size={19}/><i/></div>
            <div className="avatar">AG</div>
          </div>
        </header>

        {admin ? <AdminPage drives={drives} onAdd={addDrive} onDelete={deleteDrive}/> :
          <>
            {page==='dashboard' && <Dashboard drives={drives} applied={applied} go={()=>setPage('drives')}/>}
            {page==='drives' && <DrivesPage drives={filtered} search={search} setSearch={setSearch} branch={branch} setBranch={setBranch} applied={applied} setSelected={setSelected}/>}
            {page==='upcoming' && <DrivesPage drives={drives} search="" setSearch={()=>{}} branch="All" setBranch={()=>{}} applied={applied} setSelected={setSelected} upcoming/>}
            {page==='applications' && <Applications drives={drives} applied={applied}/>}
            {page==='announcements' && <Announcements/>}
          </>
        }
      </main>

      {selected && <DriveModal drive={selected} applied={applied.includes(selected.id)} onClose={()=>setSelected(null)} onApply={()=>apply(selected.id)}/>}
      {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    </div>
  );
}

function pageTitle(page, admin) {
  if (admin) return 'Placement Administration';
  return ({dashboard:'Dashboard',drives:'Ongoing Drives',upcoming:'Upcoming Drives',applications:'My Applications',announcements:'Announcements'})[page];
}

function NavItem({icon,label,active,onClick,badge}) {
  return <button className={`nav-item ${active?'active':''}`} onClick={onClick}>{icon}<span>{label}</span>{badge>0&&<em>{badge}</em>}</button>
}

function Dashboard({drives, applied, go}) {
  return <section>
    <div className="welcome"><div><span className="pill">2026–27 PLACEMENT SEASON</span><h2>Good afternoon, Atharva 👋</h2><p>Stay on top of opportunities and never miss a placement deadline.</p></div><button className="primary" onClick={go}>Explore Drives</button></div>
    <div className="stats">
      <Stat icon={<BriefcaseBusiness/>} label="Active Drives" value={drives.length}/>
      <Stat icon={<FileText/>} label="Applications" value={applied.length}/>
      <Stat icon={<CalendarDays/>} label="Tests This Week" value="3"/>
      <Stat icon={<CheckCircle2/>} label="Shortlisted" value="1"/>
    </div>
    <div className="section-heading"><div><h3>Latest Opportunities</h3><p>Companies currently accepting applications</p></div><button className="text-btn" onClick={go}>View all →</button></div>
    <div className="drive-grid">{drives.slice(0,3).map(d=><DriveCard key={d.id} drive={d} applied={applied.includes(d.id)} onClick={()=>{}}/>)}</div>
  </section>
}

function Stat({icon,label,value}) { return <div className="stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div> }

function DrivesPage({drives, search, setSearch, branch, setBranch, applied, setSelected, upcoming}) {
  return <section>
    {!upcoming && <div className="filters">
      <div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company or role..."/></div>
      <div className="select"><Filter size={17}/><select value={branch} onChange={e=>setBranch(e.target.value)}><option>All</option><option>CSE</option><option>IT</option><option>ECE</option><option>EEE</option></select></div>
    </div>}
    <div className="drive-grid">{drives.length ? drives.map(d=><DriveCard key={d.id} drive={d} applied={applied.includes(d.id)} onClick={()=>setSelected(d)}/>) : <Empty/>}</div>
  </section>
}

function DriveCard({drive, applied, onClick}) {
  const days = Math.max(0, Math.ceil((new Date(drive.deadline)-new Date())/(1000*60*60*24)));
  return <article className="drive-card">
    <div className="company-row"><div className="company-logo">{drive.company.slice(0,2).toUpperCase()}</div><div><h3>{drive.company}</h3><p>{drive.role}</p></div><span className="status">{drive.status}</span></div>
    <div className="package"><span>Package</span><strong>{drive.package}</strong></div>
    <div className="details">
      <span><GraduationCap/> {drive.eligibility}</span>
      <span><Users/> {drive.branch}</span>
      <span><MapPin/> {drive.location}</span>
    </div>
    <div className="dates"><div><small>APPLICATION DEADLINE</small><b>{formatDate(drive.deadline)}</b></div><div><small>ONLINE TEST</small><b>{formatDate(drive.testDate)}</b></div><div><small>INTERVIEW</small><b>{formatDate(drive.interviewDate)}</b></div></div>
    <div className="card-footer"><span className={days<=7?'urgent':''}><Clock3 size={15}/> {days} days left</span><button className={applied?'secondary':'primary'} onClick={onClick}>{applied?'Applied':'View & Apply'}</button></div>
  </article>
}

function DriveModal({drive, applied, onClose, onApply}) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <button className="close" onClick={onClose}><X/></button>
    <div className="modal-logo">{drive.company.slice(0,2).toUpperCase()}</div><h2>{drive.company}</h2><p className="modal-role">{drive.role}</p>
    <div className="modal-package">{drive.package}<small>Annual CTC</small></div>
    <h4>Eligibility & Schedule</h4>
    <div className="modal-grid"><Info label="Eligibility" value={drive.eligibility}/><Info label="Branches" value={drive.branch}/><Info label="Deadline" value={formatDate(drive.deadline)}/><Info label="Test" value={formatDate(drive.testDate)}/><Info label="Interview" value={formatDate(drive.interviewDate)}/><Info label="Location" value={drive.location}/></div>
    <button className={`primary full ${applied?'disabled':''}`} disabled={applied} onClick={onApply}>{applied?'Application Submitted':'Apply for this Drive'}</button>
  </div></div>
}
function Info({label,value}) { return <div><small>{label}</small><b>{value}</b></div> }

function Applications({drives,applied}) {
  const mine=drives.filter(d=>applied.includes(d.id));
  return <section><div className="section-heading"><div><h3>Your Applications</h3><p>Track the placement drives you have applied to.</p></div></div>{mine.length?<div className="application-list">{mine.map(d=><div className="application" key={d.id}><div className="company-logo">{d.company.slice(0,2)}</div><div className="app-main"><b>{d.company}</b><span>{d.role} · {d.package}</span></div><span className="app-status">Applied</span><span className="app-date">Test: {formatDate(d.testDate)}</span></div>)}</div>:<Empty text="You haven't applied to any drives yet."/>}</section>
}

function Announcements() {
  return <section><div className="announcement"><div className="announce-icon"><Bell/></div><div><span>05 SEP 2026</span><h3>Placement orientation session</h3><p>All final-year students are invited to the placement preparation and registration orientation.</p></div></div><div className="announcement"><div className="announce-icon"><CalendarDays/></div><div><span>03 SEP 2026</span><h3>Resume verification window</h3><p>Submit your latest resume to the T&P cell before participating in upcoming drives.</p></div></div></section>
}

function AdminPage({drives,onAdd,onDelete}) {
  const [form,setForm]=useState({company:'',role:'',package:'',eligibility:'',branch:'',deadline:'',testDate:'',interviewDate:'',location:'Campus'});
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=e=>{e.preventDefault(); if(Object.values(form).some(v=>!v)) return; onAdd(form); setForm({company:'',role:'',package:'',eligibility:'',branch:'',deadline:'',testDate:'',interviewDate:'',location:'Campus'});};
  return <section className="admin">
    <div className="admin-summary"><Stat icon={<BriefcaseBusiness/>} label="Active Drives" value={drives.length}/><Stat icon={<Users/>} label="Total Applicants" value={drives.reduce((a,d)=>a+d.applicants,0)}/></div>
    <div className="admin-panel"><div className="section-heading"><div><h3>Create Placement Drive</h3><p>Publish a new company opportunity for students.</p></div></div>
    <form className="form-grid" onSubmit={submit}>{[['company','Company'],['role','Job Role'],['package','Package'],['eligibility','Eligibility'],['branch','Eligible Branches'],['deadline','Application Deadline'],['testDate','Test Date'],['interviewDate','Interview Date']].map(([n,l])=><label key={n}>{l}<input name={n} type={n.includes('Date')||n==='deadline'?'date':'text'} value={form[n]} onChange={change} placeholder={l}/></label>)}<label>Location<select name="location" value={form.location} onChange={change}><option>Campus</option><option>Online</option><option>Hybrid</option></select></label><button className="primary submit" type="submit"><Plus size={17}/> Publish Drive</button></form></div>
    <div className="admin-panel"><div className="section-heading"><div><h3>Manage Drives</h3><p>Current opportunities visible to students.</p></div></div><div className="admin-table">{drives.map(d=><div className="table-row" key={d.id}><div><b>{d.company}</b><span>{d.role}</span></div><strong>{d.package}</strong><span>{d.eligibility}</span><span>{formatDate(d.deadline)}</span><button className="delete" onClick={()=>onDelete(d.id)}><Trash2 size={17}/></button></div>)}</div></div>
  </section>
}

function Empty({text='No drives found'}) { return <div className="empty"><BriefcaseBusiness size={28}/><h3>{text}</h3><p>Try changing your search or filters.</p></div> }
function formatDate(v) { if(!v) return '—'; return new Date(v+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }

createRoot(document.getElementById('root')).render(<App/>);
