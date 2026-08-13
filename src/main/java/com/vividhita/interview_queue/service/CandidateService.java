package com.vividhita.interview_queue.service;

import com.vividhita.interview_queue.model.Candidate;
import com.vividhita.interview_queue.model.CandidateStatus;
import com.vividhita.interview_queue.model.DashboardResponse;
import com.vividhita.interview_queue.repository.CandidateRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public Candidate registerCandidate(Candidate candidate) {

        if (candidateRepository.findByRollNumber(candidate.getRollNumber()).isPresent()) {
            throw new IllegalArgumentException("Roll number is already registered.");
        }

        candidate.setStatus(CandidateStatus.WAITING);
        candidate.setCreatedAt(LocalDateTime.now());

        return candidateRepository.save(candidate);
    }
    public List<Candidate> getWaitingCandidates() {
        return candidateRepository
                .findByStatusOrderByCreatedAtAsc(CandidateStatus.WAITING);
    }
    public Candidate callNextCandidate() {

        Optional<Candidate> currentCandidate =
                candidateRepository.findFirstByStatus(CandidateStatus.IN_INTERVIEW);

        if (currentCandidate.isPresent()) {
            throw new IllegalArgumentException(
                    "An interview is already in progress."
            );
        }

        Optional<Candidate> waitingCandidate =
                candidateRepository
                        .findFirstByStatusOrderByCreatedAtAsc(CandidateStatus.WAITING);

        if (waitingCandidate.isEmpty()) {
            throw new IllegalArgumentException(
                    "No candidates are waiting."
            );
        }

        Candidate nextCandidate = waitingCandidate.get();

        nextCandidate.setStatus(CandidateStatus.IN_INTERVIEW);

        return candidateRepository.save(nextCandidate);
    }
    public Candidate completeInterview(Long id) {

        Optional<Candidate> candidate =
                candidateRepository.findById(id);

        if (candidate.isEmpty()) {
            throw new IllegalArgumentException(
                    "Candidate not found."
            );
        }

        Candidate currentCandidate = candidate.get();

        if (currentCandidate.getStatus() != CandidateStatus.IN_INTERVIEW) {
            throw new IllegalArgumentException(
                    "Candidate is not currently in an interview."
            );
        }

        currentCandidate.setStatus(CandidateStatus.COMPLETED);

        return candidateRepository.save(currentCandidate);
    }
    public Candidate getCandidateById(Long id) {

        return candidateRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Candidate not found.")
                );
    }
    public DashboardResponse getDashboardData() {

        long totalCandidates = candidateRepository.count();

        long waitingCandidates =
                candidateRepository.countByStatus(
                        CandidateStatus.WAITING
                );

        long inInterview =
                candidateRepository.countByStatus(
                        CandidateStatus.IN_INTERVIEW
                );

        long completedCandidates =
                candidateRepository.countByStatus(
                        CandidateStatus.COMPLETED
                );

        Optional<Candidate> currentCandidate =
                candidateRepository.findFirstByStatus(
                        CandidateStatus.IN_INTERVIEW
                );

        return new DashboardResponse(
                totalCandidates,
                waitingCandidates,
                inInterview,
                completedCandidates,
                currentCandidate.orElse(null)
        );
    }

}