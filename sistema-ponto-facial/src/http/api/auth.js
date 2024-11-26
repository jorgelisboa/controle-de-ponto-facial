import { localhost } from ".";

/**
 *
 * @param {
 * - email: string,
 * - password: string,
 * - full_name: string,
 * - document: string,
 * - role: string,
 * - hourly_value: number,
 * - estimated_journey: number
 * }
 * @returns
 */
export async function register(user) {
  // Send request with user data to register endpoint (make with form data because of the file)
  const formData = new FormData();
  formData.append("email", user.email);
  formData.append("password", user.password);
  formData.append("name", user.full_name);
  formData.append("document", user.document);
  formData.append("role", user.role);
  formData.append("hourly_value", user.hourly_value);
  formData.append("estimated_journey", user.estimated_journey);
  formData.append("profile_photo", user.profile_photo_path);

  const response = await fetch(`${localhost}/register`, {
    method: "POST",
    body: formData,
    headers: {
      "Accept": "application/json",
      "Content-Type": "multipart/form-data",
      "ngrok-skip-browser-warning": "true",
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    const errorData = await response.json();
    console.log(response);
    console.error(`Error ${response.status}: ${errorData.message}`);
    return errorData;
  }

  return null;
}

export async function login({ email, password }) {
  const response = await fetch(`${localhost}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return response;
}

export function logout(token) {
  fetch(`${localhost}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
