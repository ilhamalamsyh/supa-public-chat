export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (
  username: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  if (username.length > 20) {
    errors.push("Username must be less than 20 characters long");
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (
  name: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (name.length < 3) {
    errors.push("Name must be at least 3 characters long");
  }

  if (name.length > 50) {
    errors.push("Name must be less than 50 characters long");
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push("Name can only contain letters and spaces");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateMessage = (
  message: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!message.trim()) {
    errors.push("Message cannot be empty");
  }

  if (message.length > 1000) {
    errors.push("Message must be less than 1000 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
