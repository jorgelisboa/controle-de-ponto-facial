import { localhost } from ".";

export async function getColab() {
  // Return a random item from the array from api
  return await fetch(`${localhost}/collaborators`)
    .then((response) => response.json())
    .catch((error) => error);
}

export async function getColabWorkShift({ collaboratorDocument, isPdf }) {
  // Return a random item from the array from api (get with query parameters)
  const url = new URL(`${localhost}/shifts`);
  url.searchParams.append('collaborator_document', collaboratorDocument);
  url.searchParams.append('pdf', isPdf);

  return await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Erro ao buscar os dados");
    })
    .catch((error) => error);
}


