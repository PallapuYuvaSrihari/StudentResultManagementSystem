package com.sturesultpro.server;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String rollNo; // Unique student ID

    @Column(nullable = false)
    private String fullName;

    private String course;
    private String semester;
    private String gender;
    private String email;

    @Column(nullable = false)
    private String dob; // Acts as the student's secure password

    public Student() {}

    public Student(String rollNo, String fullName, String course, String semester, String gender, String email, String dob) {
        this.rollNo = rollNo;
        this.fullName = fullName;
        this.course = course;
        this.semester = semester;
        this.gender = gender;
        this.email = email;
        this.dob = dob;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }
}