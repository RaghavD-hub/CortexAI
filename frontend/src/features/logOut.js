import React from "react";
import api from "../../utils/axios";

async function logout() {
  try {
    const data = await api.get("/api/auth/logout");
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

export default logout;
