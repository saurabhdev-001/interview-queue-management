package com.vividhita.interview_queue.controller;

import com.vividhita.interview_queue.model.Candidate;
import com.vividhita.interview_queue.service.CandidateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping
    public ResponseEntity<Candidate> registerCandidate(
            @Valid @RequestBody Candidate candidate) {

        Candidate savedCandidate =
                candidateService.registerCandidate(candidate);

        return ResponseEntity.ok(savedCandidate);
    }
    @GetMapping("/waiting")
    public ResponseEntity<List<Candidate>> getWaitingCandidates() {

        return ResponseEntity.ok(
                candidateService.getWaitingCandidates()
        );
    }
    @PostMapping("/next")
    public ResponseEntity<Candidate> callNextCandidate() {

        Candidate candidate = candidateService.callNextCandidate();

        return ResponseEntity.ok(candidate);
    }
    @PostMapping("/{id}/complete")
    public ResponseEntity<Candidate> completeInterview(
            @PathVariable Long id) {

        Candidate candidate = candidateService.completeInterview(id);

        return ResponseEntity.ok(candidate);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidateById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                candidateService.getCandidateById(id)
        );
    }

}