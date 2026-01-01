import api from "./api";

export const createMissingPerson = async (data) => {
  const response = await api.post("/cases/missing/", data);
  return response.data;
};

export const createFoundPerson = async (data) => {
  const response = await api.post("/cases/found/", data);
  return response.data;
};

export const getMissingPersons = async () => {
  const response = await api.get("/cases/missing/");
  return response.data;
};

export const getFoundPersons = async () => {
  const response = await api.get("/cases/found/");
  return response.data;
};

