import { localhost, production } from ".";

export async function getColab(token) {
  try {
    console.log("Fetching collaborator data...");
    const response = await fetch(`${production}/collaborators`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Collaborator data fetched successfully");
    return await response.json();
  } catch (error) {
    console.error("Error fetching collaborator:", error);
    throw error;
  }
}

export async function getColabWorkShift({
  collaboratorDocument,
  isPdf = false,
  token,
}) {
  if (!collaboratorDocument) {
    throw new Error("Missing collaboratorDocument parameter");
  }
  if (!token) {
    throw new Error("Missing token parameter");
  }

  try {
    console.log(
      `Fetching work shifts for collaborator: ${collaboratorDocument}`
    );
    const response = await fetch(
      `${production}/shifts/?collaborator_document=${collaboratorDocument}&isPdf=${isPdf}&start=2020-02-02&end=2029-02-02`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Work shifts fetched successfully");
    return await response.json();
  } catch (error) {
    console.error("Error fetching work shifts:", error);
    throw error;
  }
}

export async function fetchUserData(getToken, getUserData) {
  try {
    console.log("Fetching user data...");
    const token = await getToken();
    const { user, collaborator } = await getUserData();
    const workShifts = await getColabWorkShift({
      collaboratorDocument: collaborator.document,
      isPdf: false,
      token,
    });
    console.log("User data fetched successfully");
    return {
      user: {
        ...user,
        ...collaborator,
      },
      workShifts,
      workedTime: workShifts.worked_time || [],
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function getAllCollaborators(token) {
  if (!token) {
    throw new Error("Missing token parameter");
  }

  try {
    console.log("Fetching all collaborators...");
    const response = await fetch(`${production}/collaborators/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("All collaborators fetched successfully");
    return await response.json();
  } catch (error) {
    console.error("Error fetching all collaborators:", error);
    throw error;
  }
}
