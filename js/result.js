import {
  getCurrentUser,
  getElections,
  getCandidates,
  getResults,
  logoutUser
} from "./supabase.js";

/* =========================
   ELEMENTS
========================= */

const electionTitle =
  document.getElementById(
    "electionTitle"
  );

const resultsList =
  document.getElementById(
    "resultsList"
  );

const message =
  document.getElementById(
    "message"
  );

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );

let currentElection = null;

/* =========================
   INIT
========================= */

window.addEventListener(
  "DOMContentLoaded",
  async () => {

    await checkAuth();

    await loadResults();
  }
);

/* =========================
   AUTH CHECK
========================= */

async function checkAuth() {

  const user =
    await getCurrentUser();

  if (!user) {

    window.location.href =
      "login.html";

    return;
  }
}

/* =========================
   LOAD RESULTS
========================= */

async function loadResults() {

  const elections =
    await getElections();

  if (
    !elections ||
    elections.length === 0
  ) {

    message.textContent =
      "No elections found.";

    return;
  }

  currentElection =
    elections[0];

  electionTitle.textContent =
    currentElection.title;

  if (
    !currentElection
      .is_result_public
  ) {

    message.textContent =
      "Results are not declared yet.";

    return;
  }

  const candidates =
    await getCandidates(
      currentElection.id
    );

  const voteMap =
    await getResults(
      currentElection.id
    );

  const labels = [];
  const voteCounts = [];

  resultsList.innerHTML =
    "";

  let maxVotes = -1;
  let winnerId = null;

  candidates.forEach(
    candidate => {

      const votes =
        voteMap[
          candidate.id
        ] || 0;

      if (
        votes > maxVotes
      ) {

        maxVotes = votes;

        winnerId =
          candidate.id;
      }
    }
  );

  candidates.forEach(
    candidate => {

      const votes =
        voteMap[
          candidate.id
        ] || 0;

      labels.push(
        candidate.name
      );

      voteCounts.push(
        votes
      );

      const card =
        document.createElement(
          "div"
        );

      card.classList.add(
        "result-card"
      );

      if (
        candidate.id ===
        winnerId
      ) {

        card.style.border =
          "2px solid gold";

        card.innerHTML += `
          <div style="color:gold;">
            🏆 Winner
          </div>
        `;
      }

      card.innerHTML += `
        <div class="result-name">
          ${candidate.name}
        </div>

        <div class="result-votes">
          ${votes} Votes
        </div>
      `;

      resultsList
        .appendChild(card);
    });

  if (
    labels.length > 0
  ) {

    renderChart(
      labels,
      voteCounts
    );
  }
}

/* =========================
   RENDER CHART
========================= */

function renderChart(
  labels,
  data
) {

  const ctx =
    document.getElementById(
      "resultsChart"
    );

  if (!ctx) return;

  new Chart(ctx, {

    type: "bar",

    data: {

      labels,

      datasets: [
        {
          label:
            "Votes",

          data,

          backgroundColor:
            "rgba(59,130,246,0.7)",

          borderRadius: 8
        }
      ]
    },

    options: {

      responsive: true,

      plugins: {

        legend: {

          labels: {
            color:
              "#fff"
          }
        }
      },

      scales: {

        x: {
          ticks: {
            color:
              "#fff"
          }
        },

        y: {
          ticks: {
            color:
              "#fff"
          }
        }
      }
    }
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
