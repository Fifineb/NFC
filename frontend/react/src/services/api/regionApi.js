import axios from "axios";

const API = "http://localhost:8081/region";

export const getRegions = () => axios.get(`${API}/getAll`);
export const addRegion = (data) => axios.post(`${API}/add`, data);
export const deleteRegion = (id) => axios.delete(`${API}/delete/${id}`);
export const updateRegion = (id, data) => axios.put(`${API}/update/${id}`, data);
