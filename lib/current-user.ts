export const currentUser = {
  id: "demo-admin",
  name: "Eric Bester",
  email: "eric@example.com",
  role: "admin" as const
};

export const isAdmin = currentUser.role === "admin";
