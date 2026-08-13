// ========================================
// ELEMENTS
// ========================================

const totalCount = document.getElementById("totalCount");
const waitingCount = document.getElementById("waitingCount");
const interviewCount = document.getElementById("interviewCount");
const completedCount = document.getElementById("completedCount");

const currentCandidateName =
    document.getElementById("currentCandidateName");

const currentCandidateDetails =
    document.getElementById("currentCandidateDetails");

const completeButton =
    document.getElementById("completeButton");

const callNextButton =
    document.getElementById("callNextButton");

const queueList =
    document.getElementById("queueList");


// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard() {

    try {

        const response =
            await fetch("/api/queue/dashboard");

        if (!response.ok) {
            throw new Error("Unable to load dashboard data.");
        }

        const dashboard =
            await response.json();


        // -------------------------
        // STATISTICS
        // -------------------------

        totalCount.textContent =
            dashboard.totalCandidates;

        waitingCount.textContent =
            dashboard.waitingCandidates;

        interviewCount.textContent =
            dashboard.inInterview;

        completedCount.textContent =
            dashboard.completedCandidates;


        // -------------------------
        // CURRENT INTERVIEW
        // -------------------------

        if (dashboard.currentCandidate) {

            const candidate =
                dashboard.currentCandidate;

            currentCandidateName.textContent =
                candidate.name;

            currentCandidateDetails.textContent =
                `${candidate.appliedRole} • Roll ${candidate.rollNumber}`;

            completeButton.disabled = false;

            completeButton.classList.remove(
                "cursor-not-allowed",
                "bg-emerald-500/40"
            );

            completeButton.classList.add(
                "cursor-pointer",
                "bg-emerald-500",
                "hover:bg-emerald-400"
            );

            // Store the current candidate ID
            completeButton.dataset.candidateId =
                candidate.id;

        } else {

            currentCandidateName.textContent =
                "No candidate";

            currentCandidateDetails.textContent =
                "No interview currently in progress.";

            completeButton.disabled = true;

            completeButton.classList.remove(
                "cursor-pointer",
                "bg-emerald-500",
                "hover:bg-emerald-400"
            );

            completeButton.classList.add(
                "cursor-not-allowed",
                "bg-emerald-500/40"
            );

            completeButton.removeAttribute(
                "data-candidate-id"
            );
        }


        // -------------------------
        // WAITING QUEUE
        // -------------------------

        await loadWaitingQueue();


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );
    }
}


// ========================================
// LOAD WAITING QUEUE
// ========================================

async function loadWaitingQueue() {

    try {

        const response =
            await fetch("/api/candidates/waiting");

        if (!response.ok) {
            throw new Error(
                "Unable to load waiting queue."
            );
        }

        const candidates =
            await response.json();


        if (candidates.length === 0) {

            queueList.innerHTML = `
                <div
                    class="px-6 py-12 text-center text-sm text-slate-500">

                    No candidates are currently waiting.

                </div>
            `;

            return;
        }


        queueList.innerHTML =
            candidates.map((candidate, index) => {

                return `
                    <div
                        class="grid grid-cols-12 items-center border-b border-slate-800 px-6 py-5 transition hover:bg-slate-800/40">

                        <div
                            class="col-span-1 text-sm font-semibold text-indigo-400">

                            ${index + 1}

                        </div>


                        <div class="col-span-5">

                            <p
                                class="font-semibold text-white">

                                ${candidate.name}

                            </p>

                            <p
                                class="mt-1 text-xs text-slate-500">

                                ${candidate.appliedRole}

                            </p>

                        </div>


                        <div
                            class="col-span-3 text-sm text-slate-400">

                            ${candidate.rollNumber}

                        </div>


                        <div class="col-span-3">

                            <span
                                class="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">

                                Waiting

                            </span>

                        </div>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "Queue loading error:",
            error
        );

        queueList.innerHTML = `
            <div
                class="px-6 py-12 text-center text-sm text-red-400">

                Unable to load queue.

            </div>
        `;
    }
}


// ========================================
// CALL NEXT CANDIDATE
// ========================================

callNextButton.addEventListener(
    "click",
    async () => {

        callNextButton.disabled = true;

        callNextButton.textContent =
            "Calling...";


        try {

            const response =
                await fetch(
                    "/api/candidates/next",
                    {
                        method: "POST"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to call next candidate."
                );
            }


            // Refresh everything
            await loadDashboard();


        } catch (error) {

            alert(error.message);

        } finally {

            callNextButton.disabled = false;

            callNextButton.textContent =
                "⚡ Call Next Candidate";
        }
    }
);


// ========================================
// COMPLETE CURRENT INTERVIEW
// ========================================

completeButton.addEventListener(
    "click",
    async () => {

        const candidateId =
            completeButton.dataset.candidateId;


        if (!candidateId) {
            return;
        }


        completeButton.disabled = true;

        completeButton.textContent =
            "Completing...";


        try {

            const response =
                await fetch(
                    `/api/candidates/${candidateId}/complete`,
                    {
                        method: "POST"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to complete interview."
                );
            }


            // Refresh dashboard
            await loadDashboard();


        } catch (error) {

            alert(error.message);

        } finally {

            completeButton.textContent =
                "Complete Interview";
        }
    }
);


// ========================================
// AUTO REFRESH
// ========================================

loadDashboard();

setInterval(
    loadDashboard,
    5000
);