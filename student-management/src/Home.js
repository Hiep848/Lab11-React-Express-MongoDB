import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link để chuyển trang

function Home() {
  const [students, setStudents] = useState([]);
  
  // State cho form thêm mới
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

  // 3. Hàm xóa học sinh (Cần thiết cho nút Xóa)
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;
    
    axios.delete(`http://localhost:5001/api/students/${id}`)
        .then(() => {
            // Lọc bỏ học sinh vừa xóa khỏi danh sách hiện tại
            setStudents(students.filter(s => s._id !== id));
        })
        .catch(err => console.error("Lỗi khi xóa:", err));
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

      {/* --- PHẦN 2: DANH SÁCH HIỂN THỊ --- */}
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
              <th>Hành động</th> {/* Thêm cột này */}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.class}</td>
                <td>
                    {/* Nút Xóa */}
                    <button 
                        onClick={() => handleDelete(student._id)} 
                        style={{ marginRight: "10px", color: "red", cursor: "pointer" }}
                    >
                        Xóa
                    </button>

                    {/* Nút Sửa (Dùng Link để chuyển sang trang Edit) */}
                    <Link to={`/edit/${student._id}`}>
                        <button style={{ cursor: "pointer" }}>Sửa</button>
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;