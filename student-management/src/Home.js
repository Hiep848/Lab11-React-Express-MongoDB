import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [students, setStudents] = useState([]);
  
  // State cho form
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // State sắp xếp (true = A->Z, false = Z->A)
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/api/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStu = { name, age: Number(age), class: stuClass };
    axios.post('http://localhost:5001/api/students', newStu)
      .then(res => {
        setStudents(prev => [...prev, res.data]);
        setName(""); setAge(""); setStuClass("");
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    axios.delete(`http://localhost:5001/api/students/${id}`)
        .then(() => setStudents(students.filter(s => s._id !== id)))
        .catch(err => console.error(err));
  };

  // --- LOGIC ĐÃ SỬA ---
  const filteredStudents = students
    // 1. Lọc
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // 2. Sắp xếp (Đã thêm toLowerCase để chuẩn hóa)
    .sort((a, b) => {
        // Chuyển tên về chữ thường để so sánh chính xác
        const nameA = a.name.toLowerCase(); 
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) return sortAsc ? -1 : 1;
        if (nameA > nameB) return sortAsc ? 1 : -1;
        return 0;
    });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản Lý Học Sinh</h1>

      {/* Form thêm */}
      <form onSubmit={handleAddStudent} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
        <h3>Thêm học sinh mới</h3>
        <div style={{ marginBottom: "10px" }}>
          <input placeholder="Họ tên" value={name} onChange={e => setName(e.target.value)} required style={{ marginRight: "10px" }} />
          <input type="number" placeholder="Tuổi" value={age} onChange={e => setAge(e.target.value)} required style={{ marginRight: "10px" }} />
          <input placeholder="Lớp" value={stuClass} onChange={e => setStuClass(e.target.value)} required style={{ marginRight: "10px" }} />
          <button type="submit">Thêm học sinh</button>
        </div>
      </form>

      {/* Thanh công cụ */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        <input 
            type="text" 
            placeholder="🔍 Tìm kiếm..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />

        <button 
            onClick={() => setSortAsc(prev => !prev)} 
            style={{ padding: "8px 15px", cursor: "pointer" }}
        >
            Sắp xếp: <strong>{sortAsc ? "A → Z" : "Z → A"}</strong>
        </button>
      </div>

      {/* Bảng danh sách */}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Họ Tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.class}</td>
                <td>
                    <button onClick={() => handleDelete(student._id)} style={{ marginRight: "10px", color: "red", cursor: "pointer" }}>Xóa</button>
                    <Link to={`/edit/${student._id}`}>
                        <button style={{ cursor: "pointer" }}>Sửa</button>
                    </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" style={{textAlign: "center"}}>Không tìm thấy kết quả</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Home;