const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
  // جدول الكورسات مع إضافة عمود image_url
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    level TEXT,
    duration TEXT,
    instructor TEXT,
    rating REAL,
    students INTEGER,
    lessons_count INTEGER,
    price INTEGER,
    image_url TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    title TEXT,
    content TEXT,
    "order" INTEGER
  )`);

  // حذف البيانات القديمة
  db.run(`DELETE FROM courses`);
  db.run(`DELETE FROM lessons`);

  // إدراج كورسات مع صور حقيقية (روابط picsum)
  const courses = [
    ['React Mastery', 'تعلم React خطوة بخطوة مع مشاريع عملية', 'متقدم', '24h', 'Ahmad Hassan', 4.9, 15420, 48, 99, 'https://picsum.photos/id/106/300/200?grayscale'],
    ['Python for Beginners', 'أساسيات بايثون للمبتدئين', 'مبتدئ', '18h', 'Sarah Mohamed', 4.8, 28500, 36, 0, 'https://picsum.photos/id/20/300/200'],
    ['Advanced TypeScript', 'أنماط متقدمة في TypeScript', 'متقدم', '20h', 'Omar Khalil', 4.9, 8900, 40, 199, 'https://picsum.photos/id/26/300/200'],
    ['Node.js Backend', 'تطوير خلفيات قوية بـ Node.js', 'متوسط', '22h', 'Fatima Ali', 4.7, 12300, 44, 89, 'https://picsum.photos/id/0/300/200'],
    ['CSS & Tailwind Mastery', 'تصميمات حديثة مع Tailwind', 'مبتدئ', '16h', 'Mohammed Ibrahim', 4.8, 19800, 32, 0, 'https://picsum.photos/id/1/300/200'],
    ['Full Stack Development', 'تطوير تطبيقات كاملة', 'متقدم', '40h', 'Layla Ahmed', 4.9, 6500, 80, 199, 'https://picsum.photos/id/155/300/200']
  ];

  courses.forEach(course => {
    db.run(`INSERT INTO courses (title, description, level, duration, instructor, rating, students, lessons_count, price, image_url) VALUES (?,?,?,?,?,?,?,?,?,?)`, course, function(err) {
      if (!err && course[0] === 'React Mastery') {
        // إضافة دروس تجريبية للكورسات
        for (let i = 1; i <= 3; i++) {
          db.run(`INSERT INTO lessons (course_id, title, content, "order") VALUES (?, ?, ?, ?)`, 
            [this.lastID, `الدرس ${i}: مقدمة`, `محتوى الدرس ${i}`, i]);
        }
      }
    });
  });
});

// API لجلب جميع الكورسات
app.get('/api/courses', (req, res) => {
  db.all(`SELECT * FROM courses`, (err, rows) => res.json(rows || []));
});

// API لجلب كورس واحد مع دروسه
app.get('/api/courses/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM courses WHERE id = ?`, [id], (err, course) => {
    if (!course) return res.status(404).json({error: 'not found'});
    db.all(`SELECT * FROM lessons WHERE course_id = ? ORDER BY "order"`, [id], (err, lessons) => {
      course.lessons = lessons || [];
      res.json(course);
    });
  });
});

app.listen(PORT, () => console.log(`✅ Server with images on http://localhost:${PORT}`));