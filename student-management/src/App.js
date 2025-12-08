import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);

  // Gọi API khi component vừa load
  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
         console.log("Dữ liệu lấy về:", response.data);
         setStudents(response.data);
      })
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách học sinh</h2>
      {/* Hiện bảng danh sách */}
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.class}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && <p>Chưa có dữ liệu học sinh.</p>}
    </div>
  );
}

export default App;