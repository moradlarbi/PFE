import axios from "./axios";

export const addOperation = (newData : any) => {
  return axios.post("/camion", newData);
};
export const editOperation = (newData: any, id: number) => {
  return axios.put(`/camion/${id}`, newData);
};
export const editStatus = (newData: any, id: number) => {
  return axios.put(`/camion/active/${id}`, newData);
};
export const deleteOperation = (id: number) => {
  return axios.put(
    `/camion/${id}`,
    { data: { active: false } }
  );
};
export const fetchCamions = async () => {
  const response = await axios.get('/camion');
  return response.data;
};