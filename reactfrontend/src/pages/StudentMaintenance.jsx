import { useState, useEffect } from 'react';
import {
    ChevronRight, ChevronDown, Building2, Calendar, Users,
    Trash2, Key, Loader2, AlertTriangle, X, Check, Eye, EyeOff, Plus
} from 'lucide-react';
import './StudentMaintenance.css';

const API = 'http://localhost:8000';

/* ─────────── Confirm Delete Dialog ─────────── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="sm-modal-backdrop">
            <div className="sm-modal-box sm-confirm-box">
                <AlertTriangle size={42} style={{ color: '#ef4444', marginBottom: '1.25rem' }} />
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Are you sure?
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center', lineHeight: 1.5 }}>
                    {message}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <button className="sm-btn sm-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onCancel}>Cancel</button>
                    <button className="sm-btn sm-btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}

/* ─────────── Edit Credentials Modal ─────────── */
function EditModal({ student, onSave, onClose }) {
    const [form, setForm] = useState({ username: student.roll, email: student.email, name: student.name, password: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setSaving(true);
        setErrors({});
        setSuccess('');
        try {
            const res = await fetch(`${API}/api/admin/student/${student.id}/credentials/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: form.username, email: form.email, name: form.name, password: form.password || undefined }),
            });
            const data = await res.json();
            if (!res.ok) { setErrors(data.errors || { general: data.error }); }
            else { setSuccess('Credentials updated!'); onSave(student.id, data); }
        } catch { setErrors({ general: 'Network error.' }); }
        finally { setSaving(false); }
    };

    return (
        <div className="sm-modal-backdrop">
            <div className="sm-modal-box">
                <div className="sm-modal-header">
                    <h2 className="sm-modal-title">Edit Student Credentials</h2>
                    <button className="sm-icon-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="sm-form-body">
                    <label className="sm-label">Roll Number (Username)</label>
                    <input className="sm-input" name="username" value={form.username} onChange={handleChange} placeholder="e.g. 21CS001" />
                    {errors.username && <p className="sm-error">{errors.username}</p>}

                    <label className="sm-label">Full Name</label>
                    <input className="sm-input" name="name" value={form.name} onChange={handleChange} placeholder="Student Name" />

                    <label className="sm-label">Email</label>
                    <input className="sm-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@example.com" />
                    {errors.email && <p className="sm-error">{errors.email}</p>}

                    <label className="sm-label">New Password <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                    <div style={{ position: 'relative' }}>
                        <input className="sm-input" name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min 6 characters" style={{ paddingRight: '2.5rem' }} />
                        <button onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="sm-error">{errors.password}</p>}

                    {errors.general && <p className="sm-error" style={{ marginTop: '0.5rem' }}>{errors.general}</p>}
                    {success && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Check size={14} /> {success}</p>}

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button className="sm-btn sm-btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Key size={16} />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────── Student Row ─────────── */
function StudentRow({ student, onDelete, onEdit }) {
    return (
        <tr className="sm-student-row">
            <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="sm-avatar">{(student.name[0] || '?').toUpperCase()}</div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{student.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.roll}</div>
                    </div>
                </div>
            </td>
            <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{student.email}</td>
            <td>
                <span className={`sm-score-pill ${student.readiness >= 80 ? 'high' : student.readiness >= 60 ? 'med' : 'low'}`}>
                    {student.readiness}%
                </span>
            </td>
            <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{student.last_active}</td>
            <td>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="sm-icon-btn sm-edit-btn" onClick={() => onEdit(student)} title="Edit credentials">
                        <Key size={18} /> Edit
                    </button>
                    <button className="sm-icon-btn sm-delete-btn" onClick={() => onDelete(student)} title="Delete student">
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

/* ─────────── Main StudentMaintenance Page ─────────── */
export default function StudentMaintenance() {
    // Data State
    const [tree, setTree] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    // Drill-down State Machine
    // views: 'DEPARTMENTS' -> 'YEARS' -> 'STUDENTS'
    const [view, setView] = useState('DEPARTMENTS');
    const [activeDept, setActiveDept] = useState(null);
    const [activeYear, setActiveYear] = useState(null);

    // Global Actions States
    const [confirmState, setConfirmState] = useState(null); // { type, id, name, msg }
    const [editStudent, setEditStudent] = useState(null);

    const loadTree = () => {
        setIsLoading(true);
        setFetchError(false);
        fetch(`${API}/api/admin/tree/`)
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => {
                setTree(data);
                // Synchronize active references in case of updates
                if (activeDept) setActiveDept(data.find(d => d.id === activeDept.id) || null);
                if (activeYear) {
                    const matchedDept = data.find(d => d.id === activeDept.id);
                    if (matchedDept) setActiveYear(matchedDept.years.find(y => y.id === activeYear.id) || null);
                }
            })
            .catch(() => setFetchError(true))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => { loadTree(); }, []);

    // Handle back logic
    useEffect(() => {
        if (view === 'DEPARTMENTS') {
            setActiveDept(null);
            setActiveYear(null);
        } else if (view === 'YEARS') {
            setActiveYear(null);
            if (!activeDept) setView('DEPARTMENTS');
        } else if (view === 'STUDENTS') {
            if (!activeYear || !activeDept) setView('DEPARTMENTS');
        }
    }, [view, activeDept, activeYear]);

    /* ── Delete Handlers ── */
    const askDelete = (type, id, name) => {
        const msgs = {
            dept: `This will permanently delete the entire "${name}" department including ALL years and students.`,
            year: `This will permanently delete "${name}" and ALL students enrolled in it.`,
            student: `This will permanently delete student "${name}". Their resumes and data will go away.`,
        };
        setConfirmState({ type, id, name, msg: msgs[type] });
    };

    const handleConfirmDelete = async () => {
        if (!confirmState) return;
        const { type, id } = confirmState;

        // Optimistically navigate down if a parent item is deleted
        if (type === 'dept' && activeDept?.id === id) setView('DEPARTMENTS');
        if (type === 'year' && activeYear?.id === id) setView('YEARS');

        const endpoints = {
            dept: `${API}/api/admin/department/${id}/delete/`,
            year: `${API}/api/admin/year/${id}/delete/`,
            student: `${API}/api/admin/student/${id}/delete/`,
        };
        try {
            const res = await fetch(endpoints[type], { method: 'DELETE' });
            if (res.ok) { setConfirmState(null); loadTree(); }
        } catch { }
    };

    /* ── Add Handlers ── */
    const [addModal, setAddModal] = useState(null); // 'dept' | 'year' | null
    const [addInput, setAddInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAddSubmit = async () => {
        if (!addInput.trim() || !addModal) return;
        setIsSaving(true);
        try {
            if (addModal === 'dept') {
                const res = await fetch(`${API}/api/admin/department/create/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: addInput.trim() })
                });
                if (res.ok) { setAddModal(null); setAddInput(''); loadTree(); }
            } else if (addModal === 'year' && activeDept) {
                const res = await fetch(`${API}/api/admin/year/create/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ year_name: addInput.trim(), department_id: activeDept.id })
                });
                if (res.ok) { setAddModal(null); setAddInput(''); loadTree(); }
            }
        } catch (e) {
            console.error("Add failed", e);
        } finally {
            setIsSaving(false);
        }
    };

    // Update locally so we don't have to wait for network on credential change
    const handleEditSave = (userId, updatedData) => {
        setTree(prev => prev.map(dept => ({
            ...dept,
            years: dept.years.map(year => ({
                ...year,
                students: year.students.map(s =>
                    s.id === userId ? { ...s, roll: updatedData.roll, email: updatedData.email } : s
                )
            }))
        })));
        // also sync active objects
        setActiveYear(prev => !prev ? null : ({
            ...prev,
            students: prev.students.map(s => s.id === userId ? { ...s, roll: updatedData.roll, email: updatedData.email } : s)
        }));
    };

    if (isLoading && tree.length === 0) return (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--primary)', display: 'block' }} />
            <p>Loading management data...</p>
        </div>
    );

    if (fetchError && tree.length === 0) return (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            <AlertTriangle size={40} style={{ color: '#ef4444', margin: '0 auto 1rem', display: 'block' }} />
            <h2>Failed to load data</h2>
            <button onClick={loadTree} className="sm-btn sm-btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
        </div>
    );

    return (
        <div className="sm-page">
            {/* ── Level 1: DEPARTMENTS ── */}
            {view === 'DEPARTMENTS' && (
                <>
                    <div className="sm-page-header">
                        <div>
                            <h1 className="sm-page-title">Select Department</h1>
                            <p className="sm-page-sub">Choose a department to manage staff and students</p>
                        </div>
                        <div className="sm-global-actions">
                            <button className="sm-btn sm-btn-purple" onClick={() => setAddModal('dept')}><Plus size={16} /> Add Department</button>
                        </div>
                    </div>

                    {tree.length === 0 ? (
                        <div className="sm-card-body" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                            <Building2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
                            <p>No departments exist.</p>
                        </div>
                    ) : (
                        <div className="sm-datacard-grid">
                            {tree.map(dept => (
                                <div key={dept.id} className="sm-datacard" onClick={() => { setActiveDept(dept); setView('YEARS'); }}>
                                    <div className="sm-datacard-header">
                                        <h3 className="sm-datacard-title">{dept.name}</h3>
                                        <div className="sm-datacard-icon">🏫</div>
                                    </div>
                                    <div className="sm-datacard-row" style={{ marginTop: '1rem' }}>
                                        <span className="sm-datacard-label">Academic Years</span>
                                        <span className="sm-datacard-val1">{dept.year_count}</span>
                                    </div>
                                    <div className="sm-datacard-row">
                                        <span className="sm-datacard-label">Students Enrolled</span>
                                        <span className="sm-datacard-val2">{dept.student_count}</span>
                                    </div>
                                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                        <button className="sm-icon-btn sm-delete-btn" onClick={(e) => { e.stopPropagation(); askDelete('dept', dept.id, dept.name); }} title="Delete Dept">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── Level 2: YEARS ── */}
            {view === 'YEARS' && activeDept && (
                <>
                    <div className="sm-breadcrumb">
                        <button className="sm-bc-btn" onClick={() => setView('DEPARTMENTS')}>Departments</button>
                        <ChevronRight size={14} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{activeDept.name}</span>
                    </div>

                    <div className="sm-page-header">
                        <div>
                            <h1 className="sm-page-title">Select Academic Year</h1>
                            <p className="sm-page-sub">Manage specific years within {activeDept.name}</p>
                        </div>
                        <div className="sm-global-actions">
                            <button className="sm-btn sm-btn-purple" onClick={() => setAddModal('year')}><Plus size={16} /> Add Year</button>
                        </div>
                    </div>

                    {activeDept.years.length === 0 ? (
                        <div className="sm-card-body" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
                            <p>No academic years configured.</p>
                        </div>
                    ) : (
                        <div className="sm-datacard-grid">
                            {activeDept.years.map(year => (
                                <div key={year.id} className="sm-datacard" onClick={() => { setActiveYear(year); setView('STUDENTS'); }}>
                                    <div className="sm-datacard-header">
                                        <h3 className="sm-datacard-title">{year.year_name}</h3>
                                        <div className="sm-datacard-icon">🎓</div>
                                    </div>
                                    <div className="sm-datacard-row" style={{ marginTop: '1rem' }}>
                                        <span className="sm-datacard-label">Active Students</span>
                                        <span className="sm-datacard-val2">{year.student_count}</span>
                                    </div>
                                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                        <button className="sm-icon-btn sm-delete-btn" onClick={(e) => { e.stopPropagation(); askDelete('year', year.id, year.year_name); }} title="Delete Year">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── Level 3: STUDENTS ── */}
            {view === 'STUDENTS' && activeYear && activeDept && (
                <>
                    <div className="sm-breadcrumb">
                        <button className="sm-bc-btn" onClick={() => setView('DEPARTMENTS')}>Departments</button>
                        <ChevronRight size={14} />
                        <button className="sm-bc-btn" onClick={() => setView('YEARS')}>{activeDept.name}</button>
                        <ChevronRight size={14} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{activeYear.year_name}</span>
                    </div>

                    <div className="sm-page-header">
                        <div>
                            <h1 className="sm-page-title">{activeYear.year_name} Students</h1>
                            <p className="sm-page-sub">Viewing all enrolled students</p>
                        </div>
                        <button className="sm-btn sm-btn-primary"><Plus size={16} /> Add Student</button>
                    </div>

                    <div className="sm-student-table-container">
                        {activeYear.students.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
                                <p>No students enrolled in this year.</p>
                            </div>
                        ) : (
                            <table className="sm-student-table">
                                <thead>
                                    <tr>
                                        <th>Student Details</th>
                                        <th>Email Address</th>
                                        <th>Score</th>
                                        <th>Last Active</th>
                                        <th style={{ textAlign: 'right' }}>Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeYear.students.map(s => (
                                        <StudentRow
                                            key={s.id}
                                            student={s}
                                            onDelete={(sObj) => askDelete('student', sObj.id, sObj.name)}
                                            onEdit={(sObj) => setEditStudent(sObj)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}


            {/* Modals */}
            {confirmState && (
                <ConfirmDialog
                    message={confirmState.msg}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmState(null)}
                />
            )}

            {editStudent && (
                <EditModal
                    student={editStudent}
                    onSave={handleEditSave}
                    onClose={() => setEditStudent(null)}
                />
            )}

            {addModal && (
                <div className="sm-modal-backdrop">
                    <div className="sm-modal-box">
                        <div className="sm-modal-header">
                            <h2 className="sm-modal-title">Add {addModal === 'dept' ? 'Department' : 'Academic Year'}</h2>
                            <button className="sm-icon-btn" onClick={() => { setAddModal(null); setAddInput(''); }}><X size={20} /></button>
                        </div>
                        <div className="sm-form-body">
                            <label className="sm-label">Enter Name</label>
                            <input
                                autoFocus
                                className="sm-input"
                                value={addInput}
                                onChange={e => setAddInput(e.target.value)}
                                placeholder={addModal === 'dept' ? 'e.g. Mechanical Engineering' : 'e.g. First Year'}
                            />
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                <button
                                    className="sm-btn sm-btn-primary"
                                    onClick={handleAddSubmit}
                                    disabled={isSaving || !addInput.trim()}
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                    {isSaving ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
