import api from "./api";

export const loginUser = async (data) => {
  console.log("LOGIN PAYLOAD 👉", data);
  const response = await api.post("/accounts/login/", {
    username: data.username,
    password: data.password,
  });
  return response.data;
};
