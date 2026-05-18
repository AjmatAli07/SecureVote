import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Create client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* =========================
   AUTH
========================= */

export async function signUpUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  return { data, error };
}

export async function loginUser(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  if (error) throw error;

  return { data, error };
}

export async function logoutUser() {
  const { error } =
    await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentUser() {
  const { data, error } =
    await supabase.auth.getUser();

  if (error) return null;

  return data?.user || null;
}

/* =========================
   DATABASE
========================= */

export async function getElections() {
  const { data, error } =
    await supabase
      .from("elections")
      .select("*")
      .eq("is_active", true);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function getCandidates(election_id) {
  const { data, error } =
    await supabase
      .from("candidates")
      .select("*")
      .eq("election_id", election_id);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function submitVote(
  user_id,
  candidate_id,
  election_id
) {
  const { error } =
    await supabase
      .from("votes")
      .insert([
        {
          user_id,
          candidate_id,
          election_id
        }
      ]);

  if (error) throw error;
}

export async function hasUserVoted(
  user_id,
  election_id
) {
  const { data, error } =
    await supabase
      .from("votes")
      .select("*")
      .eq("user_id", user_id)
      .eq("election_id", election_id);

  if (error) return false;

  return data.length > 0;
}

export async function getResults(election_id) {
  const { data, error } =
    await supabase
      .from("votes")
      .select("candidate_id")
      .eq("election_id", election_id);

  if (error) return {};

  const voteMap = {};

  data.forEach(v => {
    voteMap[v.candidate_id] =
      (voteMap[v.candidate_id] || 0) + 1;
  });

  return voteMap;
}
