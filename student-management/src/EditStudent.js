import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditStudent() {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate(); // Dùng để chuyển trang

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [stuClass, setStuClass] = useState("");

    // 1. Khi vào trang, lấy thông tin cũ điền vào form
    useEffect(() => {
        axios.get(`http://localhost:5001/api/students`) // Lấy tất cả rồi lọc (hoặc gọi API get by ID nếu đã viết)
            .then(res => {
                // Tìm học sinh có ID tương ứng trong danh sách trả về
                const student = res.data.find(s => s._id === id);
                if (student) {
                    setName(student.name);
                    setAge(student.age);
                    setStuClass(student.class);
                }
            })
            .catch(err => console.error(err));
    }, [id]);

    // 2. Xử lý khi bấm Lưu
    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedStu = { name, age: Number(age), class: stuClass };

        axios.put(`http://localhost:5001/api/students/${id}`, updatedStu)
            .then(() => {
                alert("Cập nhật thành công!");
                navigate("/"); // Quay về trang chủ
            })
            .catch(err => console.error("Lỗi khi cập nhật:", err));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chỉnh sửa học sinh</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Họ tên: </label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <br/>
                <div>
                    <label>Tuổi: </label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} required />
                </div>
                <br/>
                <div>
                    <label>Lớp: </label>
                    <input type="text" value={stuClass} onChange={e => setStuClass(e.target.value)} required />
                </div>
                <br/>
                <button type="submit">Lưu thay đổi</button>
            </form>
        </div>
    );
}

export default EditStudent;