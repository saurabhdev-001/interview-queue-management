package com.vividhita.interview_queue.repository;

import com.vividhita.interview_queue.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import com.vividhita.interview_queue.model.CandidateStatus;
import java.util.List;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    Optional<Candidate> findByRollNumber(String rollNumber);
    List<Candidate> findByStatusOrderByCreatedAtAsc(CandidateStatus status);
    Optional<Candidate> findFirstByStatusOrderByCreatedAtAsc(CandidateStatus status);
    long countByStatus(CandidateStatus status);
    Optional<Candidate> findFirstByStatus(CandidateStatus status);
}