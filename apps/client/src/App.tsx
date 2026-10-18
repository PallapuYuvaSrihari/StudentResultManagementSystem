import React, { useState } from 'react';

interface Student {
  rollNo: string;
  fullName: string;
  course: string;
  semester: string;
  gender: string;
  email: string;
  dob: string; // Used as student password
}

interface Subject {
  name: string;
  maxMarks: number;
}

interface MarkRecord {
  rollNo: string;
  marks: { [key: string]: number };
  examYear: string;
  revaluationSubjects: string[];
  revaluationApproved: boolean;
  revaluationCompletedMessage?: string;
}

export default function App() {
  const [loginRole, setLoginRole] = useState('Student');
  const [authRoll, setAuthRoll] = useState('student');
  const [authDobOrPass, setAuthDobOrPass] = useState('student123');

  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin123');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserType, setLoggedInUserType] = useState<string | null>(null);
  const [currentStudentObj, setCurrentStudentObj] = useState<Student | null>(null);

  const [activeTab, setActiveTab] = useState('login');
  const [adminSubTab, setAdminSubTab] = useState('add-student');

  // Student navigation tabs: 'dashboard', 'reval-portal', 'student-settings'
  const [studentTab, setStudentTab] = useState('dashboard');
  const [selectedRevalSubject, setSelectedRevalSubject] = useState('');

  // Student self-service password update states
  const [currentStudentPassInput, setCurrentStudentPassInput] = useState('');
  const [newStudentPassInput, setNewStudentPassInput] = useState('');

  // Database State
  const [students, setStudents] = useState<Student[]>([
    { rollNo: '44110562', fullName: 'Pallapu Yuva Srihari', course: 'CSE', semester: 'Semester 4', gender: 'Male', email: 'pyuvasrihari@gmail.com', dob: 'student123' }
  ]);

  const [subjects, setSubjects] = useState<Subject[]>([
    { name: 'Maths', maxMarks: 100 },
    { name: 'Physics', maxMarks: 100 },
    { name: 'Java', maxMarks: 100 },
    { name: 'DBMS', maxMarks: 100 },
    { name: 'Networking', maxMarks: 100 },
    { name: 'Chemistry', maxMarks: 100 }
  ]);

  const [marksData, setMarksData] = useState<MarkRecord[]>([
    { rollNo: '44110562', marks: { 'Maths': 90, 'Physics': 90, 'Java': 90, 'DBMS': 89, 'Networking': 80, 'Chemistry': 85 }, examYear: '2025', revaluationSubjects: [], revaluationApproved: false, revaluationCompletedMessage: '' }
  ]);

  // Form States
  const [newRoll, setNewRoll] = useState('');
  const [newName, setNewName] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newSem, setNewSem] = useState('Semester 1');
  const [newGender, setNewGender] = useState('Male');
  const [newEmail, setNewEmail] = useState('');
  const [newDob, setNewDob] = useState('student123');

  const [subName, setSubName] = useState('');
  const [subMax] = useState(100);

  const [markRoll, setMarkRoll] = useState('');
  const [markYear, setMarkYear] = useState('2025');
  const [currentMarksInput, setCurrentMarksInput] = useState<{ [key: string]: string }>({});

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingMarksRoll, setEditingMarksRoll] = useState<string | null>(null);
  const [editMarksInput, setEditMarksInput] = useState<{ [key: string]: string }>({});

  const [newAdminUser, setNewAdminUser] = useState(adminUser);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [adminNotes, setAdminNotes] = useState('Review pending subject revaluation requests before publishing final sem transcripts.');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginRole === 'Admin') {
      if (authRoll === adminUser && authDobOrPass === adminPass) {
        setIsLoggedIn(true);
        setLoggedInUserType('admin');
        setActiveTab('admin-dashboard');
      } else {
        alert('Invalid Admin Username or Password!');
      }
    } else {
      // Check using RollNo or general default 'student' mapped to first student
      const foundStudent = students.find(s => (s.rollNo === authRoll || authRoll === 'student') && s.dob === authDobOrPass);
      if (foundStudent) {
        setIsLoggedIn(true);
        setLoggedInUserType('student');
        setCurrentStudentObj(foundStudent);
        setStudentTab('dashboard');
        setActiveTab('student-panel');
      } else {
        alert('Invalid Register Number or Password!');
      }
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (students.some(s => s.rollNo === newRoll)) {
      alert('Student with this Register Number already exists!');
      return;
    }
    setStudents([...students, { rollNo: newRoll, fullName: newName, course: newCourse, semester: newSem, gender: newGender, email: newEmail, dob: newDob }]);
    alert('Student added successfully with default/provided password!');
    setNewRoll(''); setNewName(''); setNewCourse(''); setNewEmail(''); setNewDob('student123');
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjects.some(s => s.name.toLowerCase() === subName.toLowerCase())) {
      alert('Subject already exists!');
      return;
    }
    setSubjects([...subjects, { name: subName, maxMarks: Number(subMax) }]);
    alert('Subject added successfully!');
    setSubName('');
  };

  const handleDeleteSubject = (name: string) => {
    setSubjects(subjects.filter(s => s.name !== name));
  };

  const handleDeleteStudent = (rollNo: string) => {
    setStudents(students.filter(s => s.rollNo !== rollNo));
    setMarksData(marksData.filter(m => m.rollNo !== rollNo));
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!students.some(s => s.rollNo === markRoll)) {
      alert('Student Roll Number not found!');
      return;
    }

    const formattedMarks: { [key: string]: number } = {};
    subjects.forEach(sub => {
      formattedMarks[sub.name] = Number(currentMarksInput[sub.name] || 0);
    });

    const existingIndex = marksData.findIndex(m => m.rollNo === markRoll);
    if (existingIndex >= 0) {
      if (marksData[existingIndex].marks && Object.keys(marksData[existingIndex].marks).length > 0 && !marksData[existingIndex].revaluationApproved) {
        alert('Marks are locked! Admin cannot edit marks unless student applies for revaluation and admin approves it.');
        return;
      }
      const updated = [...marksData];
      updated[existingIndex] = { ...updated[existingIndex], marks: formattedMarks, examYear: markYear, revaluationApproved: false, revaluationSubjects: [] };
      setMarksData(updated);
    } else {
      setMarksData([...marksData, { rollNo: markRoll, marks: formattedMarks, examYear: markYear, revaluationSubjects: [], revaluationApproved: false }]);
    }
    alert('Marks saved successfully and locked!');
  };

  const handleUpdateMarksAfterReval = (rollNo: string) => {
    const formattedMarks: { [key: string]: number } = {};
    subjects.forEach(sub => {
      formattedMarks[sub.name] = Number(editMarksInput[sub.name] || 0);
    });

    const record = marksData.find(m => m.rollNo === rollNo);
    const revalSubsStr = record?.revaluationSubjects?.join(', ') || 'requested subjects';

    setMarksData(marksData.map(m => m.rollNo === rollNo ? {
      ...m,
      marks: formattedMarks,
      revaluationApproved: false,
      revaluationSubjects: [],
      revaluationCompletedMessage: `The subject(s) you requested for revaluation (${revalSubsStr}) have been successfully revaluated and updated.`
    } : m));

    setEditingMarksRoll(null);
    alert('Marks updated successfully via Revaluation and locked again!');
  };

  const handleStudentApplyReval = (rollNo: string) => {
    if (!selectedRevalSubject) {
      alert('Please select a subject for revaluation.');
      return;
    }

    const record = marksData.find(m => m.rollNo === rollNo);
    if (!record) return;

    if (record.revaluationSubjects.includes(selectedRevalSubject)) {
      alert('You have already applied for revaluation in this subject.');
      return;
    }

    const updatedSubs = [...record.revaluationSubjects, selectedRevalSubject];
    setMarksData(marksData.map(m => m.rollNo === rollNo ? { ...m, revaluationSubjects: updatedSubs, revaluationCompletedMessage: '' } : m));
    alert(`Revaluation application submitted for ${selectedRevalSubject}!`);
    setSelectedRevalSubject('');
  };

  const handleStudentUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudentObj) return;

    if (currentStudentPassInput !== currentStudentObj.dob) {
      alert('Current password is incorrect!');
      return;
    }

    if (!newStudentPassInput) {
      alert('Please enter a new password.');
      return;
    }

    const updatedStudent = { ...currentStudentObj, dob: newStudentPassInput };
    setStudents(students.map(s => s.rollNo === updatedStudent.rollNo ? updatedStudent : s));
    setCurrentStudentObj(updatedStudent);
    alert('Your password has been updated successfully!');
    setCurrentStudentPassInput('');
    setNewStudentPassInput('');
  };

  const getStudentResultData = (student: Student) => {
    const foundMarks = marksData.find(m => m.rollNo === student.rollNo);
    if (!foundMarks) return null;

    let totalScore = 0;
    const totalMax = subjects.length * 100;
    const subjectBreakdown = subjects.map(sub => {
      const score = foundMarks.marks[sub.name] || 0;
      totalScore += score;
      return { name: sub.name, score, status: score >= 40 ? 'Pass' : 'Fail' };
    });

    const percentage = Number((totalScore / (subjects.length || 1)).toFixed(1));
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 40) grade = 'D';

    const overallStatus = subjectBreakdown.some(s => s.status === 'Fail') ? 'Fail' : 'Pass';

    return {
      ...student,
      examYear: foundMarks.examYear,
      subjectBreakdown,
      totalScore,
      totalMax,
      percentage,
      grade,
      overallStatus,
      revaluationSubjects: foundMarks.revaluationSubjects,
      revaluationApproved: foundMarks.revaluationApproved,
      revaluationCompletedMessage: foundMarks.revaluationCompletedMessage
    };
  };

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', borderBottom: '1px solid #1f2937', backgroundColor: '#0b0f19' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '18px', color: '#fff', cursor: 'pointer' }} onClick={() => { if (!isLoggedIn) setActiveTab('login'); }}>
          <span style={{ background: '#d97706', padding: '4px 8px', borderRadius: '6px' }}>🎓</span> stuResultPro
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              {loggedInUserType === 'student' && (
                <>
                  <button onClick={() => setStudentTab('dashboard')} style={{ background: studentTab === 'dashboard' ? '#d97706' : '#1f2937', color: studentTab === 'dashboard' ? '#000' : '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📊 My Dashboard</button>
                  <button onClick={() => setStudentTab('reval-portal')} style={{ background: studentTab === 'reval-portal' ? '#d97706' : '#1f2937', color: studentTab === 'reval-portal' ? '#000' : '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📝 Revaluation Portal</button>
                  <button onClick={() => setStudentTab('student-settings')} style={{ background: studentTab === 'student-settings' ? '#d97706' : '#1f2937', color: studentTab === 'student-settings' ? '#000' : '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>⚙️ Settings</button>
                </>
              )}
              {loggedInUserType === 'admin' && (
                <button onClick={() => setActiveTab('admin-dashboard')} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>👤 Admin Panel</button>
              )}
              <button onClick={() => { setIsLoggedIn(false); setLoggedInUserType(null); setActiveTab('login'); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🚪 Logout</button>
            </>
          ) : (
            <button onClick={() => setActiveTab('login')} style={{ background: '#d97706', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔐 Portal Login</button>
          )}
        </div>
      </nav>

      {/* Content Area */}
      <div style={{ padding: '30px 40px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* ROLE-BASED LOGIN SCREEN */}
        {!isLoggedIn && activeTab === 'login' && (
          <div style={{ backgroundColor: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid #374151', width: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ background: '#1f2937', padding: '12px', borderRadius: '12px', display: 'inline-block', border: '1px solid #4b5563', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24' }}>stuResultPro</span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Select your role and enter default credentials (`student` / `student123`).</p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <label style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>SELECT ROLE</label>
              <select 
                value={loginRole} 
                onChange={(e) => {
                  setLoginRole(e.target.value);
                  if (e.target.value === 'Admin') {
                    setAuthRoll('admin');
                    setAuthDobOrPass('admin123');
                  } else {
                    setAuthRoll('student');
                    setAuthDobOrPass('student123');
                  }
                }} 
                style={{ width: '100%', padding: '12px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', marginBottom: '15px', boxSizing: 'border-box' }}>
                <option>Student</option>
                <option>Admin</option>
              </select>

              <label style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                {loginRole === 'Admin' ? 'USERNAME' : 'REGISTER NUMBER / ID'}
              </label>
              <input 
                type="text" 
                value={authRoll} 
                onChange={(e) => setAuthRoll(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', marginBottom: '15px', boxSizing: 'border-box' }} 
              />

              <label style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                {loginRole === 'Admin' ? 'PASSWORD' : 'PASSWORD'}
              </label>
              <input 
                type="password" 
                value={authDobOrPass} 
                onChange={(e) => setAuthDobOrPass(e.target.value)} 
                placeholder={loginRole === 'Student' ? 'student123' : 'admin123'} 
                required 
                style={{ width: '100%', padding: '12px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', marginBottom: '25px', boxSizing: 'border-box' }} 
              />

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#d97706', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                LOG IN
              </button>
            </form>
          </div>
        )}

        {/* STUDENT DASHBOARD / REVALUATION / SETTINGS */}
        {isLoggedIn && loggedInUserType === 'student' && currentStudentObj && (
          <div style={{ width: '100%', maxWidth: '850px' }}>
            {studentTab === 'dashboard' && (
              <div>
                <h2 style={{ color: '#fbbf24', marginBottom: '20px', fontSize: '22px' }}>Student Dashboard</h2>

                {(() => {
                  const res = getStudentResultData(currentStudentObj);
                  if (res?.revaluationCompletedMessage) {
                    return (
                      <div style={{ backgroundColor: '#064e3b', border: '1px solid #059669', padding: '14px 20px', borderRadius: '10px', color: '#34d399', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🔔</span> {res.revaluationCompletedMessage}
                      </div>
                    );
                  }
                  return null;
                })()}

                {(() => {
                  const res = getStudentResultData(currentStudentObj);
                  if (!res) return <p style={{ color: '#9ca3af' }}>No marks uploaded yet by admin.</p>;
                  return (
                    <div style={{ backgroundColor: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid #374151' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h2 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '24px' }}>{res.fullName}</h2>
                          <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>Roll No: {res.rollNo} • {res.course} • {res.semester}</p>
                        </div>
                        <div style={{ textAlign: 'center', backgroundColor: '#1f2937', padding: '10px 20px', borderRadius: '12px', border: '1px solid #4b5563' }}>
                          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fbbf24' }}>{res.grade}</div>
                          <div style={{ fontSize: '12px', color: res.overallStatus === 'Pass' ? '#34d399' : '#f87171', fontWeight: 'bold' }}>{res.overallStatus.toUpperCase()}</div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, 1fr)`, gap: '15px', margin: '30px 0' }}>
                        {res.subjectBreakdown.map((sub: any, idx: number) => (
                          <div key={idx} style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '10px', textAlign: 'center', border: '1px solid #374151' }}>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>{sub.name}</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '5px' }}>{sub.score}</div>
                            <div style={{ fontSize: '11px', color: sub.status === 'Pass' ? '#34d399' : '#f87171', fontWeight: 'bold' }}>{sub.status}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', backgroundColor: '#1f2937', padding: '20px', borderRadius: '10px' }}>
                        <div>
                          <div style={{ color: '#9ca3af', fontSize: '12px' }}>Total Marks</div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{res.totalScore} / {res.totalMax}</div>
                        </div>
                        <div>
                          <div style={{ color: '#9ca3af', fontSize: '12px' }}>Percentage</div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{res.percentage}%</div>
                        </div>
                        <div>
                          <div style={{ color: '#9ca3af', fontSize: '12px' }}>Grade</div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{res.grade}</div>
                        </div>
                        <div>
                          <div style={{ color: '#9ca3af', fontSize: '12px' }}>Status</div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: res.overallStatus === 'Pass' ? '#34d399' : '#f87171' }}>{res.overallStatus}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {studentTab === 'reval-portal' && (
              <div>
                <h2 style={{ color: '#fbbf24', marginBottom: '10px', fontSize: '22px' }}>Subject Revaluation Portal</h2>
                <p style={{ color: '#9ca3af', marginBottom: '25px', fontSize: '14px' }}>Select the specific subject you wish to send for revaluation and submit your request.</p>
                
                <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', border: '1px solid #374151', maxWidth: '500px' }}>
                  <label style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>CHOOSE SUBJECT FOR REVALUATION</label>
                  <select 
                    value={selectedRevalSubject} 
                    onChange={(e) => setSelectedRevalSubject(e.target.value)} 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', marginBottom: '20px', boxSizing: 'border-box' }}>
                    <option value="">-- Select Subject --</option>
                    {subjects.map((sub, i) => (
                      <option key={i} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>

                  <button onClick={() => handleStudentApplyReval(currentStudentObj.rollNo)} style={{ padding: '12px 24px', backgroundColor: '#d97706', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Submit Revaluation Request</button>
                </div>
              </div>
            )}

            {studentTab === 'student-settings' && (
              <div>
                <h2 style={{ color: '#fbbf24', marginBottom: '10px', fontSize: '22px' }}>Student Account Settings</h2>
                <p style={{ color: '#9ca3af', marginBottom: '25px', fontSize: '14px' }}>Update your account password securely without admin intervention.</p>
                
                <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', border: '1px solid #374151', maxWidth: '450px' }}>
                  <form onSubmit={handleStudentUpdatePassword}>
                    <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>CURRENT PASSWORD</label>
                    <input 
                      type="password" 
                      value={currentStudentPassInput} 
                      onChange={(e) => setCurrentStudentPassInput(e.target.value)} 
                      placeholder="Enter current password" 
                      required 
                      style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', marginBottom: '15px', boxSizing: 'border-box' }} 
                    />

                    <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>NEW PASSWORD</label>
                    <input 
                      type="password" 
                      value={newStudentPassInput} 
                      onChange={(e) => setNewStudentPassInput(e.target.value)} 
                      placeholder="Enter new password" 
                      required 
                      style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', marginBottom: '25px', boxSizing: 'border-box' }} 
                    />

                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADMIN CONTROL CENTER */}
        {isLoggedIn && loggedInUserType === 'admin' && (
          <div style={{ width: '100%', maxWidth: '900px' }}>
            <h1 style={{ color: '#fbbf24', marginBottom: '20px', fontSize: '26px', fontWeight: 'bold' }}>Admin Control Center</h1>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', backgroundColor: '#111827', padding: '8px', borderRadius: '10px', width: 'fit-content', border: '1px solid #374151' }}>
              <button onClick={() => setAdminSubTab('add-student')} style={{ padding: '8px 16px', backgroundColor: adminSubTab === 'add-student' ? '#d97706' : 'transparent', color: adminSubTab === 'add-student' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Add Student</button>
              <button onClick={() => setAdminSubTab('enter-marks')} style={{ padding: '8px 16px', backgroundColor: adminSubTab === 'enter-marks' ? '#d97706' : 'transparent', color: adminSubTab === 'enter-marks' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Enter Marks</button>
              <button onClick={() => setAdminSubTab('subjects')} style={{ padding: '8px 16px', backgroundColor: adminSubTab === 'subjects' ? '#d97706' : 'transparent', color: adminSubTab === 'subjects' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Subjects</button>
              <button onClick={() => setAdminSubTab('students-list')} style={{ padding: '8px 16px', backgroundColor: adminSubTab === 'students-list' ? '#d97706' : 'transparent', color: adminSubTab === 'students-list' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Students & Reval</button>
              <button onClick={() => setAdminSubTab('admin-settings')} style={{ padding: '8px 16px', backgroundColor: adminSubTab === 'admin-settings' ? '#d97706' : 'transparent', color: adminSubTab === 'admin-settings' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>⚙️ Settings</button>
            </div>

            {adminSubTab === 'add-student' && (
              <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', border: '1px solid #374151' }}>
                <h3 style={{ color: '#fbbf24', marginTop: 0, fontSize: '18px' }}>New Student Registration</h3>
                <form onSubmit={handleAddStudent}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>REGISTER NO / ROLL *</label>
                      <input type="text" value={newRoll} onChange={(e) => setNewRoll(e.target.value)} placeholder="e.g. 44110562" required style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>FULL NAME *</label>
                      <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Pallapu Yuva Srihari" required style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>COURSE *</label>
                      <input type="text" value={newCourse} onChange={(e) => setNewCourse(e.target.value)} placeholder="e.g. CSE" required style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>INITIAL PASSWORD</label>
                      <input type="text" value={newDob} onChange={(e) => setNewDob(e.target.value)} placeholder="student123" required style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>EMAIL</label>
                      <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="student@gmail.com" style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>SEMESTER</label>
                      <select value={newSem} onChange={(e) => setNewSem(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}>
                        <option>Semester 1</option><option>Semester 2</option><option>Semester 3</option><option>Semester 4</option><option>Semester 5</option><option>Semester 6</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Add Student</button>
                </form>
              </div>
            )}

            {adminSubTab === 'enter-marks' && (
              <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', border: '1px solid #374151' }}>
                <h3 style={{ color: '#fbbf24', marginTop: 0, fontSize: '18px' }}>Enter Student Marks (Max 100)</h3>
                <form onSubmit={handleSaveMarks}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>REGISTER NUMBER / ROLL NO</label>
                      <input type="text" value={markRoll} onChange={(e) => setMarkRoll(e.target.value)} placeholder="e.g. 44110562" required style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>EXAM YEAR</label>
                      <input type="text" value={markYear} onChange={(e) => setMarkYear(e.target.value)} placeholder="e.g. 2025" required style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff' }} />
                    </div>
                  </div>

                  <h4 style={{ color: '#fff', marginBottom: '10px' }}>Subject Scores</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
                    {subjects.map((sub, idx) => (
                      <div key={idx} style={{ backgroundColor: '#1f2937', padding: '15px', borderRadius: '8px', border: '1px solid #374151' }}>
                        <label style={{ fontSize: '12px', color: '#fbbf24', display: 'block', marginBottom: '6px' }}>{sub.name} (Max: {sub.maxMarks})</label>
                        <input type="number" max="100" min="0" value={currentMarksInput[sub.name] || ''} onChange={(e) => setCurrentMarksInput({ ...currentMarksInput, [sub.name]: e.target.value })} placeholder="0 - 100" style={{ width: '100%', padding: '8px', backgroundColor: '#111827', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff' }} />
                      </div>
                    ))}
                  </div>
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#d97706', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Save Marks Record</button>
                </form>
              </div>
            )}

            {adminSubTab === 'subjects' && (
              <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', border: '1px solid #374151' }}>
                <h3 style={{ color: '#fbbf24', marginTop: 0, fontSize: '18px' }}>Add New Subject</h3>
                <form onSubmit={handleAddSubject} style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                  <input type="text" value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="Subject Name (e.g. Chemistry)" required style={{ flex: 1, padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff' }} />
                  <input type="number" value={subMax} disabled style={{ width: '100px', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff' }} />
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#d97706', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Add Subject</button>
                </form>

                <h3 style={{ color: '#fff', fontSize: '16px' }}>Current Subjects</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #374151', color: '#9ca3af', fontSize: '12px' }}>
                      <th style={{ padding: '10px' }}>SUBJECT NAME</th>
                      <th style={{ padding: '10px' }}>MAX MARKS</th>
                      <th style={{ padding: '10px' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td style={{ padding: '12px', color: '#fff', fontWeight: 'bold' }}>{s.name}</td>
                        <td style={{ padding: '12px', color: '#fbbf24' }}>{s.maxMarks}</td>
                        <td style={{ padding: '12px' }}><button onClick={() => handleDeleteSubject(s.name)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {adminSubTab === 'students-list' && (
              <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', border: '1px solid #374151' }}>
                <h3 style={{ color: '#fbbf24', marginTop: 0, fontSize: '18px' }}>Registered Students & Subject Revaluation Approvals</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '30px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #374151', color: '#9ca3af', fontSize: '12px' }}>
                      <th style={{ padding: '10px' }}>REG NO</th>
                      <th style={{ padding: '10px' }}>NAME</th>
                      <th style={{ padding: '10px' }}>REVAL REQUESTED SUBJECT(S)</th>
                      <th style={{ padding: '10px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st, idx) => {
                      const record = marksData.find(m => m.rollNo === st.rollNo);
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '12px', color: '#fbbf24' }}>{st.rollNo}</td>
                          <td style={{ padding: '12px', color: '#fff' }}>{st.fullName}</td>
                          <td style={{ padding: '12px', color: '#f59e0b', fontWeight: 'bold' }}>
                            {record?.revaluationSubjects && record.revaluationSubjects.length > 0 
                              ? record.revaluationSubjects.join(', ') 
                              : <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>None</span>}
                          </td>
                          <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                            <button onClick={() => setEditingStudent(st)} style={{ backgroundColor: '#d97706', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Edit Details</button>
                            {record?.revaluationSubjects && record.revaluationSubjects.length > 0 && !record?.revaluationApproved && (
                              <button onClick={() => {
                                setMarksData(marksData.map(m => m.rollNo === st.rollNo ? { ...m, revaluationApproved: true } : m));
                                alert(`Revaluation approved and marks unlocked for Reg No: ${st.rollNo}`);
                              }} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Approve Reval</button>
                            )}
                            {record?.revaluationApproved && (
                              <button onClick={() => setEditingMarksRoll(st.rollNo)} style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Edit Marks</button>
                            )}
                            <button onClick={() => handleDeleteStudent(st.rollNo)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {adminSubTab === 'admin-settings' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', border: '1px solid #374151' }}>
                  <h3 style={{ color: '#fbbf24', marginTop: 0, fontSize: '18px' }}>Admin Security</h3>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setAdminUser(newAdminUser);
                    if (newAdminPass) setAdminPass(newAdminPass);
                    alert('Admin credentials updated successfully!');
                    setNewAdminPass('');
                  }}>
                    <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '10px' }}>Change Admin Credentials</h4>
                    <label style={{ fontSize: '11px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>ADMIN USERNAME</label>
                    <input type="text" value={newAdminUser} onChange={(e) => setNewAdminUser(e.target.value)} required style={{ width: '100%', padding: '8px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />

                    <label style={{ fontSize: '11px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>NEW ADMIN PASSWORD</label>
                    <input type="password" value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} placeholder="New password" required style={{ width: '100%', padding: '8px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff', marginBottom: '15px', boxSizing: 'border-box' }} />

                    <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#d97706', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Update Admin Password</button>
                  </form>
                </div>

                <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', border: '1px solid #374151', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: '#fbbf24', marginTop: 0, fontSize: '18px' }}>📝 Admin Scratchpad & Notes</h3>
                  <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '15px' }}>Use this space to jot down important reminders or pending verifications.</p>
                  <textarea 
                    value={adminNotes} 
                    onChange={(e) => setAdminNotes(e.target.value)} 
                    placeholder="Type your notes here..." 
                    style={{ flex: 1, width: '100%', minHeight: '220px', padding: '12px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'sans-serif', fontSize: '14px', lineHeight: '1.5' }} 
                  />
                  <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => alert('Notes saved successfully!')} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Save Notes</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {editingStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', width: '400px', border: '1px solid #374151' }}>
            <h3 style={{ color: '#fbbf24', marginTop: 0 }}>Edit Student — Reg No: {editingStudent.rollNo}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              setStudents(students.map(s => s.rollNo === editingStudent.rollNo ? editingStudent : s));
              setEditingStudent(null);
              alert('Student details updated successfully!');
            }}>
              <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>FULL NAME</label>
              <input type="text" value={editingStudent.fullName} onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff', marginBottom: '15px' }} />
              
              <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>EMAIL</label>
              <input type="email" value={editingStudent.email} onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff', marginBottom: '15px' }} />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#d97706', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Save Changes</button>
                <button type="button" onClick={() => setEditingStudent(null)} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingMarksRoll && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', width: '450px', border: '1px solid #374151' }}>
            <h3 style={{ color: '#fbbf24', marginTop: 0 }}>Edit Marks (Revaluation Unlocked) — Reg: {editingMarksRoll}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {subjects.map((sub, idx) => (
                <div key={idx}>
                  <label style={{ fontSize: '11px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>{sub.name}</label>
                  <input type="number" max="100" min="0" value={editMarksInput[sub.name] || ''} onChange={(e) => setEditMarksInput({ ...editMarksInput, [sub.name]: e.target.value })} placeholder="0-100" style={{ width: '100%', padding: '8px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleUpdateMarksAfterReval(editingMarksRoll)} style={{ flex: 1, padding: '10px', backgroundColor: '#d97706', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Update & Lock Marks</button>
              <button onClick={() => setEditingMarksRoll(null)} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}