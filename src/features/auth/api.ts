import { fetchApi } from "@/lib/api-client";
import { AuthResponse, LoginDto, RegisterDto, User } from "./types";

export function login(data: LoginDto) {
  return fetchApi<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function register(data: RegisterDto) {
  return fetchApi<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentUser() {
  return fetchApi<User>("/auth/me");
}

export function updateCurrentUser(data: Partial<User>) {
  return fetchApi<{ user: User }>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
