import { loginUser } from "../services/auth";

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser({ username, password });

    // ✅ FIX IS HERE
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
};
