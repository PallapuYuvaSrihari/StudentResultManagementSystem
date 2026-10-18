package com.sturesultpro.server;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Custom query to find a student by their unique Roll Number
    Optional<Student> findByRollNo(String rollNo);
}
