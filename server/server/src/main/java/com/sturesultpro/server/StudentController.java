package com.sturesultpro.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5175") // Matches your Vite React frontend port
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    // 1. Get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // 2. Register a new student
    @PostMapping
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
        if (studentRepository.findByRollNo(student.getRollNo()).isPresent()) {
            return ResponseEntity.badRequest().body("Student with this Register Number already exists!");
        }
        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.ok(savedStudent);
    }

    // 3. Student Login Verification
    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody Student loginData) {
        Optional<Student> studentOpt = studentRepository.findByRollNo(loginData.getRollNo());
        
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            if (student.getDob().equals(loginData.getDob())) {
                return ResponseEntity.ok(student);
            }
        }
        return ResponseEntity.status(401).body("Invalid Register Number or Date of Birth!");
    }

    // 4. Delete a student
    @DeleteMapping("/{rollNo}")
    public ResponseEntity<?> deleteStudent(@PathVariable String rollNo) {
        Optional<Student> studentOpt = studentRepository.findByRollNo(rollNo);
        if (studentOpt.isPresent()) {
            studentRepository.delete(studentOpt.get());
            return ResponseEntity.ok("Student deleted successfully");
        }
        return ResponseEntity.status(404).body("Student not found");
    }
}