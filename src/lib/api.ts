export type User = { id: number; name: string; email: string };

const TOKEN_KEY = "examportal_token";
const USER_KEY = "examportal_user";

const jsonHeaders = { "Content-Type": "application/json" };

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const persistSession = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = getToken();
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
};

export const register = async (payload: { name: string; email: string; password: string }) => {
  const data = await request<{ token: string; user: User }>("/api/auth/register", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
  persistSession(data.token, data.user);
  return data;
};

export const login = async (payload: { email: string; password: string }) => {
  const data = await request<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
  persistSession(data.token, data.user);
  return data;
};

export const fetchExams = () =>
  request<{ exams: Array<{ id: string; title: string; subject: string; duration: number; questions: number; status: string; score?: number }> }>(
    "/api/exams",
  );

export const fetchExamQuestions = (examId: string) =>
  request<{ exam: { id: number; title: string; durationMinutes: number }; questions: Array<{ id: number; question: string; options: string[] }> }>(
    `/api/exams/${examId}/questions`,
  );

export const submitExam = (examId: string, payload: { answers: Array<{ questionId: number; selectedOption: number | null }>; durationSeconds: number }) =>
  request<{ score: number; percentage: number; total: number }>(`/api/exams/${examId}/submissions`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
