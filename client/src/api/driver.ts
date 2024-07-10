import axios from "./axios";

export const addOperation = (newData : any) => {
  return axios.post("/auth/signup", newData);
};
export const editOperation = (newData: any, id: number) => {
  return axios.put(`/user/${id}`, newData);
};
export const deleteOperation = (id: number) => {
  return axios.put(
    `/user/${id}`,
    { data: { active: false } }
  );
};
