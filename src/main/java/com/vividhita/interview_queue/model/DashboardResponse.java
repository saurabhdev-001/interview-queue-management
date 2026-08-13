package com.vividhita.interview_queue.model;

public class DashboardResponse {

    private long totalCandidates;
    private long waitingCandidates;
    private long inInterview;
    private long completedCandidates;
    private Candidate currentCandidate;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalCandidates,
            long waitingCandidates,
            long inInterview,
            long completedCandidates,
            Candidate currentCandidate) {

        this.totalCandidates = totalCandidates;
        this.waitingCandidates = waitingCandidates;
        this.inInterview = inInterview;
        this.completedCandidates = completedCandidates;
        this.currentCandidate = currentCandidate;
    }

    public long getTotalCandidates() {
        return totalCandidates;
    }

    public long getWaitingCandidates() {
        return waitingCandidates;
    }

    public long getInInterview() {
        return inInterview;
    }

    public long getCompletedCandidates() {
        return completedCandidates;
    }

    public Candidate getCurrentCandidate() {
        return currentCandidate;
    }
}