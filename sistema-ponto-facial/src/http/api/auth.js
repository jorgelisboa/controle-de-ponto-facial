import { production } from ".";

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
  // Criação do FormData
  const formData = new FormData();
  formData.append("email", user.email);
  formData.append("password", user.password);
  formData.append("name", user.name); // Alterado para name como está na interface
  formData.append("document", user.document);
  formData.append("role", user.role);
  formData.append("hourly_value", user.hourly_value);
  formData.append("estimated_journey", user.estimated_journey);

  // Supondo que o profile_photo_path seja um arquivo
  formData.append("profile_photo", user.profile_photo_path);

  try {
    // Configurando a URL e opções da requisição
    const response = await fetch(`${production}/register`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "multipart/form-data"
      },
    });

    // Tratando a resposta
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      console.error(`Erro ${response.status}: ${errorData.message}`);
      return errorData;
    }
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    return null;
  }
}

export async function login({ email, password }) {
  const response = await fetch(`${production}/login`, {
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
  fetch(`${production}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
