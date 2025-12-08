const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: { type: String, required: true },  // Họ tên
    age: { type: Number, required: true },   // Tuổi
    class: { type: String, required: true }  // Lớp
}, { collection: 'students' });

module.exports = mongoose.model('Student', studentSchema);