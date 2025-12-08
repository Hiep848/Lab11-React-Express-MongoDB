import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  
  // State cho form
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");

  // 1. Lấy danh sách khi vào trang
  useEffect(() => {
    // LƯU Ý: Dùng port 5001 như bạn đã đổi
    axios.get('http://localhost:5001/api/students')
      .then(res => {
        setStudents(res.data);
      })
      .catch(err => console.error("Lỗi lấy danh sách:", err));
  }, []);

  // 2. Hàm thêm học sinh
  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStu = { name, age: Number(age), class: stuClass };

    axios.post('http://localhost:5001/api/students', newStu)
      .then(res => {
        console.log("Đã thêm:", res.data);
        // Cập nhật giao diện: Nối học sinh mới vào danh sách cũ
        setStudents(prev => [...prev, res.data]);
        
        // Reset ô nhập liệu
        setName("");
        setAge("");
        setStuClass("");
      })
      .catch(err => console.error("Lỗi khi thêm:", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản Lý Học Sinh</h1>

      {/* --- PHẦN 1: FORM THÊM --- */}
      <form onSubmit={handleAddStudent} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
        <h3>Thêm học sinh mới</h3>
        <div style={{ marginBottom: "10px" }}>
          <input 
            placeholder="Họ tên" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            style={{ marginRight: "10px" }}
          />
          <input 
            type="number" 
            placeholder="Tuổi" 
            value={age} 
            onChange={e => setAge(e.target.value)} 
            required 
            style={{ marginRight: "10px" }}
          />
          <input 
            placeholder="Lớp" 
            value={stuClass} 
            onChange={e => setStuClass(e.target.value)} 
            required 
            style={{ marginRight: "10px" }}
          />
          <button type="submit">Thêm học sinh</button>
        </div>
      </form>

      {/* --- PHẦN 2: DANH SÁCH HIỂN THỊ (Khả năng bạn bị thiếu đoạn này) --- */}
      <h3>Danh sách lớp học ({students.length} học sinh)</h3>
      
      {students.length === 0 ? (
        <p>Chưa có học sinh nào trong danh sách.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>Họ Tên</th>
              <th>Tuổi</th>
              <th>Lớp</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;