const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let students = [];
let subjects = [
  { id: 1, name: 'Maths', maxMarks: 100 },
  { id: 2, name: 'Physics', maxMarks: 100 },
  { id: 3, name: 'Java', maxMarks: 100 },
  { id: 4, name: 'DBMS', maxMarks: 100 },
  { id: 5, name: 'Networking', maxMarks: 100 }
];
let marks = [];

app.get('/', (req, res) => {
  res.send({ message: 'EduResult Pro Server is running!' });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalStudents: students.length,
    resultsEntered: marks.length,
    passRate: students.length > 0 ? '100%' : '0%',
    avgPercentage: '83.0%'
  });
});

app.get('/api/students', (req, res) => res.json(students));
app.post('/api/students', (req, res) => {
  const student = req.body;
  students.push(student);
  res.json({ success: true, student });
});

app.get('/api/subjects', (req, res) => res.json(subjects));
app.post('/api/subjects', (req, res) => {
  const subject = { id: subjects.length + 1, ...req.body };
  subjects.push(subject);
  res.json({ success: true, subject });
});

app.listen(PORT, () => {
  console.log(`Server connected - http://localhost:${PORT}`);
});