import api from "./api";

export const getMatches = async () => {
  const response = await api.get("/cases/matches/");
  return response.data;
};

export const confirmMatch = async (matchId) => {
  const response = await api.post(`/cases/matches/${matchId}/confirm/`);
  return response.data;
};
