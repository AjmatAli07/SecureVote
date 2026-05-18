import { supabase, getCurrentUser, logoutUser } from "./supabase.js";

/* =========================
   INIT
========================= */
window.addEventListener("DOMContentLoaded", async () => {

  const message =
    document.getElementById("message");

  const logoutBtn =
    document.getElementById("logoutBtn");

  const candidateList =
    document.getElementById("candidateList");

  const addCandidateBtn =
    document.getElementById("addCandidate");

  const createBtn =
    document.getElementById("createElection");

  const publishBtn =
    document.getElementById("publishResultsBtn");

  /* =========================
     CHECK ADMIN
  ========================= */

  let user = null;

  for (let i = 0; i < 5; i++) {
    user = await getCurrentUser();

    if (user) break;

    await new Promise(
      resolve =>
        setTimeout(resolve, 300)
    );
  }

  if (!user) {
    window.location.href =
      "login.html";
    return;
  }

  const {
    data: userData,
    error
  } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    error ||
    !userData ||
    userData.role !== "admin"
  ) {
    alert("Access denied");

    window.location.href =
      "vote.html";

    return;
  }

  /* =========================
     ADD CANDIDATE
  ========================= */

  addCandidateBtn.addEventListener(
    "click",
    () => {

      const input =
        document.createElement(
          "input"
        );

      input.placeholder =
        "Candidate Name";

      input.classList.add(
        "candidate-input"
      );

      candidateList
        .appendChild(input);
    }
  );

  /* =========================
     CREATE ELECTION
  ========================= */

  createBtn.addEventListener(
    "click",
    async () => {

      const title =
        document
          .getElementById("title")
          .value
          .trim();

      const district =
        document
          .getElementById("district")
          .value
          .trim();

      const start =
        document
          .getElementById("start")
          .value;

      const end =
        document
          .getElementById("end")
          .value;

      const candidateInputs =
        document.querySelectorAll(
          ".candidate-input"
        );

      if (
        !title ||
        !district ||
        !start ||
        !end ||
        candidateInputs.length === 0
      ) {
        message.textContent =
          "Please fill all fields.";

        return;
      }

      try {

        const {
          data: election,
          error
        } = await supabase
          .from("elections")
          .insert([
            {
              title,
              start_time: start,
              end_time: end,
              is_active: true
            }
          ])
          .select()
          .single();

        if (error)
          throw error;

        const candidates = [];

        candidateInputs.forEach(
          input => {

            const name =
              input.value.trim();

            if (name) {

              candidates.push({
                name,
                election_id:
                  election.id
              });
            }
          }
        );

        const {
          error:
          candidateError
        } = await supabase
          .from("candidates")
          .insert(candidates);

        if (
          candidateError
        ) {
          throw candidateError;
        }

        message.textContent =
          "✅ Election created successfully!";

        candidateList.innerHTML =
          "";

        document.getElementById(
          "title"
        ).value = "";

        document.getElementById(
          "district"
        ).value = "";

        document.getElementById(
          "start"
        ).value = "";

        document.getElementById(
          "end"
        ).value = "";

      } catch (err) {

        console.error(err);

        message.textContent =
          err.message ||
          "Error creating election.";
      }
    }
  );

  /* =========================
     PUBLISH RESULTS
  ========================= */

  publishBtn.addEventListener(
    "click",
    async () => {

      const { data } =
        await supabase
          .from("elections")
          .select("*")
          .order(
            "created_at",
            {
              ascending:
              false
            }
          )
          .limit(1);

      if (
        !data ||
        data.length === 0
      ) {

        message.textContent =
          "No election found.";

        return;
      }

      const {
        error
      } = await supabase
        .from("elections")
        .update({
          is_result_public:
            true
        })
        .eq(
          "id",
          data[0].id
        );

      if (error) {
        console.error(error);

        message.textContent =
          "Failed to publish results.";

        return;
      }

      message.textContent =
        "Results published!";
    }
  );

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

});
