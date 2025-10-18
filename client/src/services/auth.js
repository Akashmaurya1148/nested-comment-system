import { makeRequest } from "./makeRequest";

export function login({ email, password }) {
  return makeRequest("auth/login", {
    method: "POST",
    data: { email, password },
  });
}

export function logout() {
  return makeRequest("auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return makeRequest("auth/me");
}
