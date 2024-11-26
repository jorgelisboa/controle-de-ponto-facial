import { production, localhost } from ".";

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
export async function register(formData) {
  try {
    // Log the received FormData
    console.log('Sending registration data:', formData);

    const response = await fetch(`${localhost}/register`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true",
        // Remove Content-Type header to let browser set it with boundary
      },
    });

    // Log the response status and headers
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const responseData = await response.json();
    console.log('Response data:', responseData);

    if (response.ok) {
      return responseData;
    } else {
      console.error(`Error ${response.status}:`, responseData);
      return responseData;
    }
  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
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
