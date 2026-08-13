package com.vividhita.interview_queue.controller;

import com.vividhita.interview_queue.model.DashboardResponse;
import com.vividhita.interview_queue.service.CandidateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

    private final CandidateService candidateService;

    public QueueController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboardData() {

        return ResponseEntity.ok(
                candidateService.getDashboardData()
        );
    }
}