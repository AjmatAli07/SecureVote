import {
  getCurrentUser,
  getElections,
  getCandidates,
  submitVote,
  hasUserVoted,
  logoutUser,
  supabase
} from "./supabase.js";

/* =========================
   GLOBAL VARIABLES
========================= */
let currentUser = null;
let currentElection = null;
let selectedCandidate = null;

/* =========================
   ELEMENTS
========================= */

const candidatesContainer =
  document.getElementById(
    "candidatesContainer"
  );

const electionTitle =
  document.getElementById(
    "electionTitle"
  );

const message =
  document.getElementById(
    "message"
  );

const modal =
  document.getElementById(
    "confirmModal"
  );

const confirmBtn =
  document.getElementById(
    "confirmVoteBtn"
  );

const cancelBtn =
  document.getElementById(
    "cancelVoteBtn"
  );

const selectedCandidateName =
  document.getElementById(
    "selectedCandidateName"
  );

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );

/* =========================
   INIT
========================= */

window.addEventListener(
  "DOMContentLoaded",
  async () => {

    await checkAuth();

    await checkRole();

    await loadElection();
  }
);

/* =========================
   AUTH CHECK
========================= */

async function checkAuth() {

  currentUser =
    await getCurrentUser();

  if (!currentUser) {

    window.location.href =
      "login.html";

    return;
  }
}

/* =========================
   ROLE CHECK
========================= */

async function checkRole() {

  const {
    data,
    error
  } = await supabase
    .from("users")
    .select("role")
    .eq(
      "id",
      currentUser.id
    )
    .single();

  if (error) {
    console.error(error);
    return;
  }

  if (
    data?.role === "admin"
  ) {

    alert(
      "Admins cannot vote."
    );

    window.location.href =
      "admin.html";

    return;
  }
}

/* =========================
   LOAD ELECTION
========================= */

async function loadElection() {

  const elections =
    await getElections();

  if (
    elections.length === 0
  ) {

    message.textContent =
      "No active elections available.";

    return;
  }

  currentElection =
    elections[0];

  electionTitle.textContent =
    currentElection.title;

  const voted =
    await hasUserVoted(
      currentUser.id,
      currentElection.id
    );

  if (voted) {

    message.textContent =
      "You have already voted.";

    disableVotingUI();

    return;
  }

  await loadCandidates();
}

/* =========================
   LOAD CANDIDATES
========================= */

async function loadCandidates() {

  const candidates =
    await getCandidates(
      currentElection.id
    );

  if (
    candidates.length === 0
  ) {

    message.textContent =
      "No candidates found.";

    return;
  }

  candidatesContainer.innerHTML =
    "";

  candidates.forEach(
    candidate => {

      const card =
        document.createElement(
          "div"
        );

      card.classList.add(
        "candidate-card"
      );

      card.innerHTML = `
        <div class="candidate-name">
          ${candidate.name}
        </div>

        <div class="candidate-party">
          ${candidate.party || "Independent"}
        </div>
      `;

      card.addEventListener(
        "click",
        () =>
          selectCandidate(
            card,
            candidate
          )
      );

      candidatesContainer
        .appendChild(card);
    }
  );
}

/* =========================
   SELECT CANDIDATE
========================= */

function selectCandidate(
  card,
  candidate
) {

  document
    .querySelectorAll(
      ".candidate-card"
    )
    .forEach(c =>
      c.classList.remove(
        "selected"
      )
    );

  card.classList.add(
    "selected"
  );

  selectedCandidate =
    candidate;

  selectedCandidateName.textContent =
    candidate.name;

  modal.style.display =
    "flex";
}

/* =========================
   CONFIRM VOTE
========================= */

confirmBtn.addEventListener(
  "click",
  async () => {

    if (
      !selectedCandidate
    ) return;

    try {

      const voted =
        await hasUserVoted(
          currentUser.id,
          currentElection.id
        );

      if (voted) {

        message.textContent =
          "You have already voted.";

        modal.style.display =
          "none";

        disableVotingUI();

        return;
      }

      await submitVote(
        currentUser.id,
        selectedCandidate.id,
        currentElection.id
      );

      message.textContent =
        "✅ Vote submitted successfully!";

      modal.style.display =
        "none";

      disableVotingUI();

    } catch (error) {

      console.error(error);

      message.textContent =
        "Error submitting vote.";
    }
  }
);

/* =========================
   CANCEL MODAL
========================= */

cancelBtn.addEventListener(
  "click",
  () => {

    modal.style.display =
      "none";
  }
);

/* =========================
   DISABLE VOTING UI
========================= */

function disableVotingUI() {

  document
    .querySelectorAll(
      ".candidate-card"
    )
    .forEach(card => {

      card.style.pointerEvents =
        "none";

      card.style.opacity =
        "0.6";
    });
}

/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
  "click",
  async () => {

    await logoutUser();

    window.location.href =
      "login.html";
  }
);
