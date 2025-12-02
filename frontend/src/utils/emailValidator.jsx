export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

// This version checks:
// At least one character before @
// At least one character between @ and .
// At least one character after the final .