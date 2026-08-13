const roleCards = document.querySelectorAll(".role-card");
const appliedRoleInput = document.getElementById("appliedRole");
const roleError = document.getElementById("roleError");

roleCards.forEach((card) => {
    card.addEventListener("click", () => {

        // Remove selected appearance from all cards
        roleCards.forEach((otherCard) => {
            otherCard.classList.remove(
                "border-indigo-500",
                "bg-indigo-500/10",
                "ring-2",
                "ring-indigo-500/40"
            );
        });

        // Highlight selected card
        card.classList.add(
            "border-indigo-500",
            "bg-indigo-500/10",
            "ring-2",
            "ring-indigo-500/40"
        );

        // Store selected role
        appliedRoleInput.value = card.dataset.role;

        // Hide error
        roleError.classList.add("hidden");

        // Check whether form is now complete
        updateSubmitButton();
    });
});


// =============================
// FORM VALIDATION
// =============================

const nameInput = document.getElementById("name");
const rollNumberInput = document.getElementById("rollNumber");
const submitButton = document.getElementById("submitButton");

const nameError = document.getElementById("nameError");
const nameSuccess = document.getElementById("nameSuccess");

const rollError = document.getElementById("rollError");
const rollSuccess = document.getElementById("rollSuccess");


function validateName() {

    const name = nameInput.value.trim();

    if (name.length === 0) {

        nameInput.classList.remove("border-emerald-500");
        nameInput.classList.add("border-red-500");

        nameError.textContent = "Name is required.";
        nameError.classList.remove("hidden");

        nameSuccess.classList.add("hidden");

        return false;
    }

    if (name.length < 2) {

        nameInput.classList.remove("border-emerald-500");
        nameInput.classList.add("border-red-500");

        nameError.textContent =
            "Name must contain at least 2 characters.";

        nameError.classList.remove("hidden");

        nameSuccess.classList.add("hidden");

        return false;
    }

    nameInput.classList.remove("border-red-500");
    nameInput.classList.add("border-emerald-500");

    nameError.classList.add("hidden");

    nameSuccess.textContent = "Looks good ✓";
    nameSuccess.classList.remove("hidden");

    return true;
}


function validateRollNumber() {

    const rollNumber = rollNumberInput.value.trim();

    if (rollNumber.length === 0) {

        rollNumberInput.classList.remove("border-emerald-500");
        rollNumberInput.classList.add("border-red-500");

        rollError.textContent = "Roll number is required.";
        rollError.classList.remove("hidden");

        rollSuccess.classList.add("hidden");

        return false;
    }

    if (rollNumber.length < 3) {

        rollNumberInput.classList.remove("border-emerald-500");
        rollNumberInput.classList.add("border-red-500");

        rollError.textContent =
            "Please enter a valid roll number.";

        rollError.classList.remove("hidden");

        rollSuccess.classList.add("hidden");

        return false;
    }

    rollNumberInput.classList.remove("border-red-500");
    rollNumberInput.classList.add("border-emerald-500");

    rollError.classList.add("hidden");

    rollSuccess.textContent = "Valid roll number ✓";
    rollSuccess.classList.remove("hidden");

    return true;
}


function updateSubmitButton() {

    const validName = validateName();
    const validRoll = validateRollNumber();
    const validRole = appliedRoleInput.value !== "";

    if (validName && validRoll && validRole) {

        submitButton.disabled = false;

        submitButton.classList.remove(
            "cursor-not-allowed",
            "bg-indigo-500/40"
        );

        submitButton.classList.add(
            "cursor-pointer",
            "bg-indigo-500",
            "hover:bg-indigo-400"
        );

    } else {

        submitButton.disabled = true;

        submitButton.classList.remove(
            "cursor-pointer",
            "bg-indigo-500",
            "hover:bg-indigo-400"
        );

        submitButton.classList.add(
            "cursor-not-allowed",
            "bg-indigo-500/40"
        );
    }
}


// Validate while typing
nameInput.addEventListener("input", updateSubmitButton);
rollNumberInput.addEventListener("input", updateSubmitButton);


// =============================
// CANDIDATE REGISTRATION
// =============================

const candidateForm = document.getElementById("candidateForm");
const message = document.getElementById("message");


// This stores the candidate ID after successful registration
let registeredCandidateId = null;


candidateForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = nameInput.value.trim();
    const rollNumber = rollNumberInput.value.trim();
    const appliedRole = appliedRoleInput.value;

    submitButton.disabled = true;
    submitButton.textContent = "Joining Queue...";


    try {

        const response = await fetch("/api/candidates", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                rollNumber: rollNumber,
                appliedRole: appliedRole
            })
        });


        const data = await response.json();


        // =============================
        // REGISTRATION ERROR
        // =============================

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to register candidate."
            );
        }


        // =============================
        // REGISTRATION SUCCESS
        // =============================

        // Save the candidate ID
        registeredCandidateId = data.id;


        // Get success card
        const queueStatus =
            document.getElementById("queueStatus");


        // Fill candidate information
        document.getElementById("statusName").textContent =
            data.name;

        document.getElementById("statusRoll").textContent =
            data.rollNumber;

        document.getElementById("statusRole").textContent =
            data.appliedRole;


        // Show queue status card
        queueStatus.classList.remove("hidden");


        // Hide registration form
        candidateForm.classList.add("hidden");


        // =============================
        // GET INITIAL QUEUE POSITION
        // =============================

        const waitingResponse =
            await fetch("/api/candidates/waiting");


        if (!waitingResponse.ok) {
            throw new Error(
                "Unable to load queue position."
            );
        }


        const waitingCandidates =
            await waitingResponse.json();


        const position =
            waitingCandidates.findIndex(
                candidate => candidate.id === data.id
            );


        document.getElementById("queuePosition").textContent =
            position === -1 ? "—" : position + 1;


        // =============================
        // SUCCESS MESSAGE
        // =============================

        message.textContent =
            `You're successfully registered! Your candidate ID is ${data.id}.`;

        message.classList.remove(
            "hidden",
            "border-red-500",
            "text-red-400"
        );

        message.classList.add(
            "border-emerald-500",
            "text-emerald-400"
        );


        submitButton.textContent =
            "Registered ✓";


        // =============================
        // START LIVE QUEUE UPDATES
        // =============================

        updateQueueStatus();

        setInterval(updateQueueStatus, 3000);


    } catch (error) {

        // =============================
        // REGISTRATION FAILED
        // =============================

        message.textContent =
            error.message;

        message.classList.remove(
            "hidden",
            "border-emerald-500",
            "text-emerald-400"
        );

        message.classList.add(
            "border-red-500",
            "text-red-400"
        );

        submitButton.disabled = false;

        submitButton.textContent =
            "Join Interview Queue";
    }
});


// =============================
// LIVE QUEUE STATUS
// =============================

async function updateQueueStatus() {

    // No candidate registered yet
    if (!registeredCandidateId) {
        return;
    }


    try {

        // Get latest candidate information
        const candidateResponse =
            await fetch(
                `/api/candidates/${registeredCandidateId}`
            );


        if (!candidateResponse.ok) {
            return;
        }


        const candidate =
            await candidateResponse.json();


        // Update status badge
        updateStatusBadge(candidate.status);


        // =============================
        // IF NOT WAITING
        // =============================

        if (candidate.status !== "WAITING") {

            document.getElementById(
                "queuePosition"
            ).textContent = "—";

            return;
        }


        // =============================
        // GET CURRENT WAITING QUEUE
        // =============================

        const waitingResponse =
            await fetch("/api/candidates/waiting");


        if (!waitingResponse.ok) {
            return;
        }


        const waitingCandidates =
            await waitingResponse.json();


        // Find this student's position
        const position =
            waitingCandidates.findIndex(
                item => item.id === registeredCandidateId
            );


        // Update queue position
        document.getElementById(
            "queuePosition"
        ).textContent =
            position === -1 ? "—" : position + 1;


    } catch (error) {

        console.error(
            "Unable to update queue status:",
            error
        );
    }
}


// =============================
// UPDATE STATUS BADGE
// =============================

function updateStatusBadge(status) {

    const statusBadge =
        document.getElementById("statusBadge");


    // Reset classes
    statusBadge.className =
        "mt-6 inline-flex rounded-full px-5 py-2 text-sm font-medium";


    // WAITING
    if (status === "WAITING") {

        statusBadge.textContent =
            "🟡 Waiting";

        statusBadge.classList.add(
            "bg-amber-500/10",
            "text-amber-400"
        );
    }


    // IN INTERVIEW
    else if (status === "IN_INTERVIEW") {

        statusBadge.textContent =
            "🟢 Your Interview Is Now";

        statusBadge.classList.add(
            "bg-emerald-500/10",
            "text-emerald-400"
        );
    }


    // COMPLETED
    else if (status === "COMPLETED") {

        statusBadge.textContent =
            "✓ Interview Completed";

        statusBadge.classList.add(
            "bg-blue-500/10",
            "text-blue-400"
        );
    }
}