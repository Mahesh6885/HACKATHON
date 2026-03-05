import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Cpu, Database, Zap, Settings, GraduationCap,
    ChevronRight, Home, Eye, Trash2, Pencil, FileSpreadsheet,
    Plus, X, Save, Users
} from 'lucide-react';
import './StudentMaintenance.css';

/* ---- Data ---- */
const DEPARTMENTS = [
    { id: 'CSE', label: 'Computer Science', icon: Cpu, color: '#eff6ff', iconBg: '#2563eb', border: '#bfdbfe', count: 42 },
    { id: 'IT', label: 'Information Technology', icon: Database, color: '#f0fdf4', iconBg: '#16a34a', border: '#bbf7d0', count: 38 },
    { id: 'ECE', label: 'Electronics & Comm.', icon: Zap, color: '#fefce8', iconBg: '#ca8a04', border: '#fef08a', count: 35 },
    { id: 'MECH', label: 'Mechanical Engg.', icon: Settings, color: '#fef2f2', iconBg: '#dc2626', border: '#fecaca', count: 28 },
    { id: 'CIVIL', label: 'Civil Engineering', icon: GraduationCap, color: '#faf5ff', iconBg: '#7c3aed', border: '#e9d5ff', count: 22 },
];

const YEARS = [
    { id: '1', label: '1st Year', sub: 'First Year Students', icon: '①' },
    { id: '2', label: '2nd Year', sub: 'Second Year Students', icon: '②' },
    { id: '3', label: '3rd Year', sub: 'Pre-Final Year', icon: '③' },
    { id: '4', label: '4th Year', sub: 'Final Year Students', icon: '④' },
];

const MOCK_STUDENTS = {
    'CSE-1': [{ id: 'c1', roll: 'CSE-001', name: 'Alice Smith', email: 'alice@uni.edu', cgpa: 9.1, status: 'Completed' }],
    'CSE-2': [{ id: 'c2', roll: 'CSE-002', name: 'Charlie Davis', email: 'charlie@uni.edu', cgpa: 7.8, status: 'Pending' }],
    'CSE-3': [{ id: 'c3', roll: 'CSE-003', name: 'Hannah Rao', email: 'hannah@uni.edu', cgpa: 8.2, status: 'Pending' }],
    'CSE-4': [{ id: 'c4', roll: 'CSE-004', name: 'Eve Thomas', email: 'eve@uni.edu', cgpa: 9.4, status: 'Completed' }],
    'IT-1': [{ id: 'i1', roll: 'IT-001', name: 'Diana Clark', email: 'diana@uni.edu', cgpa: 9.6, status: 'Completed' }],
    'IT-2': [{ id: 'i2', roll: 'IT-002', name: 'Fatima Sheikh', email: 'fatima@uni.edu', cgpa: 8.8, status: 'Completed' }],
    'ECE-1': [{ id: 'e1', roll: 'ECE-001', name: 'Bob Johnson', email: 'bob@uni.edu', cgpa: 7.4, status: 'Pending' }],
    'ECE-2': [{ id: 'e2', roll: 'ECE-002', name: 'George Nair', email: 'george@uni.edu', cgpa: 7.9, status: 'Pending' }],
    'MECH-1': [{ id: 'm1', roll: 'MECH-001', name: 'Ethan Lewis', email: 'ethan@uni.edu', cgpa: 7.0, status: 'Not Started' }],
};

const DEFAULT_STUDENTS = [
    { id: 'def1', roll: 'STU-001', name: 'Student One', email: 'stu1@uni.edu', cgpa: 7.5, status: 'Not Started' },
    { id: 'def2', roll: 'STU-002', name: 'Student Two', email: 'stu2@uni.edu', cgpa: 8.1, status: 'Pending' },
];

export default function StudentMaintenance() {
    const navigate = useNavigate();

    // Navigation state: 'dept' | 'year' | 'students'
    const [view, setView] = useState('dept');
    const [dept, setDept] = useState(null);
    const [year, setYear] = useState(null);

    // Student list state
    const key = dept && year ? `${dept}-${year}` : null;
    const [studentMap, setStudentMap] = useState(MOCK_STUDENTS);

    // Modal state for Add/Edit
    const [showModal, setShowModal] = useState(false);
    const [editStudent, setEditStudent] = useState(null);
    const [form, setForm] = useState({ name: '', roll: '', email: '', cgpa: '', status: 'Not Started' });

    const students = key ? (studentMap[key] || DEFAULT_STUDENTS) : [];
    const deptObj = DEPARTMENTS.find(d => d.id === dept);

    /* ----- Navigation helpers ----- */
    const selectDept = (d) => { setDept(d.id); setYear(null); setView('year'); };
    const selectYear = (y) => { setYear(y.id); setView('students'); };
    const goBack = () => {
        if (view === 'students') setView('year');
        else if (view === 'year') setView('dept');
    };

    /* ----- CRUD ----- */
    const deleteStudent = (sid) => {
        setStudentMap(prev => ({
            ...prev,
            [key]: (prev[key] || DEFAULT_STUDENTS).filter(s => s.id !== sid)
        }));
    };

    const openAdd = () => {
        setEditStudent(null);
        setForm({ name: '', roll: `${dept}-${String(students.length + 1).padStart(3, '0')}`, email: '', cgpa: '', status: 'Not Started' });
        setShowModal(true);
    };

    const openEdit = (s) => {
        setEditStudent(s);
        setForm({ name: s.name, roll: s.roll, email: s.email, cgpa: s.cgpa, status: s.status });
        setShowModal(true);
    };

    const saveStudent = () => {
        if (!form.name || !form.roll) return;
        if (editStudent) {
            setStudentMap(prev => ({
                ...prev,
                [key]: (prev[key] || DEFAULT_STUDENTS).map(s => s.id === editStudent.id ? { ...s, ...form, cgpa: parseFloat(form.cgpa) || s.cgpa } : s)
            }));
        } else {
            setStudentMap(prev => ({
                ...prev,
                [key]: [...(prev[key] || DEFAULT_STUDENTS), { ...form, id: Date.now().toString(), cgpa: parseFloat(form.cgpa) || 0 }]
            }));
        }
        setShowModal(false);
    };

    const getStatusClass = (st) => {
        if (st === 'Completed') return 'badge-green';
        if (st === 'Pending') return 'badge-yellow';
        return 'badge-gray';
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    /* ----- Breadcrumb ----- */
    const Breadcrumb = () => (
        <nav className="sm-breadcrumb">
            <button onClick={() => setView('dept')} className="sm-bc-btn"><Home size={14} /> Home</button>
            {(view === 'year' || view === 'students') && (
                <><ChevronRight size={13} className="sm-bc-sep" /><button onClick={() => setView('year')} className={`sm-bc-btn ${view === 'year' ? 'active' : ''}`}>{dept}</button></>
            )}
            {view === 'students' && (
                <><ChevronRight size={13} className="sm-bc-sep" /><span className="sm-bc-current">Year {year}</span></>
            )}
        </nav>
    );

    return (
        <div className="student-maintenance">
            {/* Page Header */}
            <div className="sm-page-header">
                <div>
                    <Breadcrumb />
                    <h1 className="sm-title">
                        {view === 'dept' && 'Student Maintenance'}
                        {view === 'year' && `${deptObj?.label} — Select Year`}
                        {view === 'students' && `${deptObj?.label} · Year ${year}`}
                    </h1>
                    <p className="sm-sub">
                        {view === 'dept' && 'Select a department to manage its students.'}
                        {view === 'year' && 'Choose the year of study to view student records.'}
                        {view === 'students' && `${students.length} students enrolled`}
                    </p>
                </div>
                {view !== 'dept' && (
                    <button className="sm-back-btn" onClick={goBack}>← Back</button>
                )}
            </div>

            {/* DEPT VIEW */}
            {view === 'dept' && (
                <div className="sm-dept-grid">
                    {DEPARTMENTS.map(d => {
                        const Icon = d.icon;
                        return (
                            <div key={d.id} className="sm-dept-card" style={{ background: d.color, borderColor: d.border }}>
                                <div className="sm-dept-icon-wrap" style={{ background: d.iconBg }}>
                                    <Icon size={26} color="white" />
                                </div>
                                <div className="sm-dept-body">
                                    <h3 className="sm-dept-name">{d.label}</h3>
                                    <p className="sm-dept-sub">{d.id} Department</p>
                                    <div className="sm-dept-meta">
                                        <Users size={13} /> {d.count} students
                                    </div>
                                </div>
                                <button className="sm-select-btn" onClick={() => selectDept(d)}>
                                    Select <ChevronRight size={15} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* YEAR VIEW */}
            {view === 'year' && (
                <div className="sm-year-grid">
                    {YEARS.map(y => (
                        <div key={y.id} className="sm-year-card" onClick={() => selectYear(y)}>
                            <div className="sm-year-icon">{y.icon}</div>
                            <div>
                                <div className="sm-year-label">{y.label}</div>
                                <div className="sm-year-sub">{y.sub}</div>
                            </div>
                            <ChevronRight size={20} className="sm-year-arrow" />
                        </div>
                    ))}
                </div>
            )}

            {/* STUDENTS VIEW */}
            {view === 'students' && (
                <div className="sm-students-section">
                    {/* Top Action Bar */}
                    <div className="sm-action-bar">
                        <div className="sm-action-bar-left">
                            <span className="sm-count-badge"><Users size={14} /> {students.length} Students</span>
                        </div>
                        <div className="sm-action-bar-right">
                            <label className="sm-import-btn">
                                <FileSpreadsheet size={15} />
                                Bulk Excel Import
                                <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={() => alert('Connects to backend import API')} />
                            </label>
                            <button className="sm-add-btn" onClick={openAdd}>
                                <Plus size={15} /> Add New Student
                            </button>
                        </div>
                    </div>

                    {/* Student Cards */}
                    <div className="sm-student-table-card">
                        <div className="sm-table-header">
                            <span>Student</span>
                            <span>Roll No.</span>
                            <span>CGPA</span>
                            <span>Interview Status</span>
                            <span>Actions</span>
                        </div>

                        {students.length === 0 && (
                            <div className="sm-empty">No students found. Add one!</div>
                        )}

                        {students.map(s => (
                            <div key={s.id} className="sm-student-row">
                                <div className="sm-student-cell">
                                    <div className="sm-thumb">{getInitials(s.name)}</div>
                                    <div>
                                        <div className="sm-sname">{s.name}</div>
                                        <div className="sm-semail">{s.email}</div>
                                    </div>
                                </div>
                                <div className="sm-cell">
                                    <span className="sm-roll-chip">{s.roll}</span>
                                </div>
                                <div className="sm-cell">
                                    <span className="sm-cgpa">{s.cgpa}</span>
                                </div>
                                <div className="sm-cell">
                                    <span className={`sm-badge ${getStatusClass(s.status)}`}>{s.status}</span>
                                </div>
                                <div className="sm-cell sm-row-actions">
                                    <button className="sm-icon-btn-edit" onClick={() => openEdit(s)} title="Edit">
                                        <Pencil size={15} />
                                    </button>
                                    <button className="sm-icon-btn-delete" onClick={() => deleteStudent(s.id)} title="Delete">
                                        <Trash2 size={15} />
                                    </button>
                                    <button className="sm-view-btn" onClick={() => navigate(`/admin/students/${s.id}`)}>
                                        <Eye size={14} /> View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="sm-overlay" onClick={() => setShowModal(false)}>
                    <div className="sm-modal" onClick={e => e.stopPropagation()}>
                        <div className="sm-modal-head">
                            <h3>{editStudent ? 'Edit Student' : 'Add New Student'}</h3>
                            <button onClick={() => setShowModal(false)}><X size={18} /></button>
                        </div>
                        <div className="sm-modal-body">
                            <div className="sm-modal-grid">
                                {[
                                    { label: 'Full Name*', field: 'name', placeholder: 'e.g. John Doe' },
                                    { label: 'Roll Number*', field: 'roll', placeholder: 'e.g. CSE-101' },
                                    { label: 'Email', field: 'email', placeholder: 'john@uni.edu', type: 'email' },
                                    { label: 'CGPA', field: 'cgpa', placeholder: '8.5', type: 'number' },
                                ].map(({ label, field, placeholder, type = 'text' }) => (
                                    <div className="sm-modal-field" key={field}>
                                        <label>{label}</label>
                                        <input
                                            type={type}
                                            placeholder={placeholder}
                                            value={form[field]}
                                            onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                                        />
                                    </div>
                                ))}
                                <div className="sm-modal-field">
                                    <label>Interview Status</label>
                                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        <option>Not Started</option>
                                        <option>Pending</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="sm-modal-foot">
                            <button className="sm-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="sm-modal-save" onClick={saveStudent}>
                                <Save size={15} /> {editStudent ? 'Save Changes' : 'Add Student'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
