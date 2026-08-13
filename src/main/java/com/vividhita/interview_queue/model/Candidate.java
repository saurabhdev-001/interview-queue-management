package com.vividhita.interview_queue.model;
import jakarta.validation.constraints.NotBlank;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Roll number is required")
    @Column(nullable = false, unique = true)
    private String rollNumber;
    @NotBlank(message = "Applied role is required")
    private String appliedRole;

    @Enumerated(EnumType.STRING)
    private CandidateStatus status;

    private LocalDateTime createdAt;

    public Candidate() {
    }

    public Candidate(String name, String rollNumber, String appliedRole,
                     CandidateStatus status, LocalDateTime createdAt) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.appliedRole = appliedRole;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public String getAppliedRole() {
        return appliedRole;
    }

    public CandidateStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public void setAppliedRole(String appliedRole) {
        this.appliedRole = appliedRole;
    }

    public void setStatus(CandidateStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}