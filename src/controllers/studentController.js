const studentService = require('../services/studentService');

// Add a student and associate them with a cohort and courses
exports.addStudent = async (req, res) => {
  try {
    const student = await studentService.addStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all students with their cohort and courses
exports.getStudents = async (req, res) => {
  try {
    const students = await studentService.getStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getStudentById = async (req, res) => {
    try {
      const student = await studentService.getStudentById(req.params.id);
      res.status(200).json(student);
    } catch (error) {
      res.status(404).json({ error: error.message }); // Return 404 if student is not found
    }
  };
  

// Update student details
exports.updateStudent = async (req, res) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
