// Counselor auth utilities

export const isCounselorLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("counselor_id");
};

export const getCounselorId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("counselor_id");
};

export const getCounselorUsername = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("counselor_username");
};

export const logoutCounselor = (): void => {
  localStorage.removeItem("counselor_id");
  localStorage.removeItem("counselor_username");
};
