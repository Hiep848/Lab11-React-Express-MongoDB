const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student'); // Import model vừa tạo

const app = express();
app.use(cors()); // Cho phép frontend gọi API
app.use(express.json()); // Để đọc JSON gửi lên

// 1. Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
    .then(() => console.log("Đã kết nối MongoDB thành công"))
    .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// 2. API GET: Lấy danh sách học sinh
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find(); // Lấy tất cả từ DB
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. API POST: Thêm học sinh mới
app.post('/api/students', async (req, res) => {
    try {
        // Tạo một học sinh mới từ dữ liệu gửi lên (req.body)
        const newStudent = await Student.create(req.body);
        
        // Trả về thông tin học sinh vừa tạo (kèm mã 201 Created)
        res.status(201).json(newStudent);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Chạy server tại cổng 5001
const PORT = 5001;
app.listen(PORT, () => console.log("Server chạy tại port 5001"));