import { loginUser, signUpUser, getCurrentUser } from "./supabase.js";
import { supabase } from "./supabase.js";

/* =========================
   HELPER FUNCTIONS
========================= */
function showError(message) {
  const errorEl = document.getElementById("errorMsg");

  if (errorEl) {
    errorEl.textContent = message;
  }
}

/* =========================
   ROLE-BASED REDIRECT
========================= */
async function redirectUser() {
  const user = await getCurrentUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    console.error("Role fetch error:", error);
    showError("User profile not found.");
    return;
  }

  if (data.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "vote.html";
  }
}

/* =========================
   LOGIN HANDLER
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput =
      document.getElementById("email").value.trim();

    const passwordInput =
      document.getElementById("password").value.trim();

    const btn =
      loginForm.querySelector("button");

    try {
      btn.disabled = true;
      btn.textContent = "Logging in...";

      const { data, error } =
        await loginUser(
          emailInput,
          passwordInput
        );

      if (error) throw error;

      if (!data?.user) {
        throw new Error(
          "Login failed. User not found."
        );
      }

      setTimeout(async () => {
        await redirectUser();
      }, 800);

    } catch (error) {
      console.error(error);
      showError(
        error.message || "Login failed."
      );

    } finally {
      btn.disabled = false;
      btn.textContent = "Login";
    }
  });
}

/* =========================
   REGISTER HANDLER
========================= */

const registerForm =
  document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const email =
        document.getElementById("email")
        .value.trim();

      const password =
        document.getElementById("password")
        .value.trim();

      const name =
        document.getElementById("name")
        ?.value.trim();

      const district =
        document.getElementById("district")
        ?.value.trim();

      const selectedRole =
        document.getElementById("role")
        ?.value;

      const btn =
        registerForm.querySelector("button");

      try {

        btn.disabled = true;
        btn.textContent =
          "Creating account...";

        const { data, error } =
          await signUpUser(
            email,
            password
          );

        if (error) throw error;

        const user = data.user;

        if (!user) {
          throw new Error(
            "User creation failed."
          );
        }

        let finalRole = "voter";

        const ADMIN_SECRET =
          "12345";

        if (
          selectedRole === "admin"
        ) {

          const code =
            prompt(
              "Enter Admin Secret Code:"
            );

          if (
            code === ADMIN_SECRET
          ) {
            finalRole = "admin";
          } else {
            alert(
              "Invalid code. Registered as voter."
            );
          }
        }

        const {
          error: insertError
        } = await supabase
          .from("users")
          .insert([
            {
              id: user.id,
              name,
              email,
              district,
              role: finalRole
            }
          ]);

        if (insertError)
          throw insertError;

        alert(
          "Account created successfully!"
        );

        window.location.href =
          "login.html";

      } catch (error) {

        console.error(error);

        showError(
          error.message ||
          "Signup failed."
        );

      } finally {

        btn.disabled = false;

        btn.textContent =
          "Register";
      }
    });
}

/* =========================
   SESSION CHECK
========================= */

window.addEventListener(
  "DOMContentLoaded",
  async () => {

    const user =
      await getCurrentUser();

    if (
      user &&
      window.location.pathname
      .includes("login.html")
    ) {

      await redirectUser();
    }
});
