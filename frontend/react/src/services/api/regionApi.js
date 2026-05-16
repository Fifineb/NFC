import axios from "axios";

const API = "http://localhost:8081/api/region";

export const regionApi = {
  getAll: () => axios.get(`${API}/getAll`).then(res => res.data),

  add: (data) => axios.post(`${API}/add`, data).then(res => res.data),

  delete: (id) => axios.delete(`${API}/delete/${id}`).then(res => res.data),

  update: (id, data) =>
    axios.put(`${API}/update/${id}`, data).then(res => res.data),
};