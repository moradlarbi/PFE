import axios from "./axios";

export const addOperation = (newData : any) => {
  return axios.post("/user", newData);
};
export const editOperation = (newData: any, id: number) => {
  return axios.put(`/user/${id}`, newData);
};
export const editStatus = (newData: any, id: number) => {
  return axios.put(`/user/active/${id}`, newData);
};
export const deleteOperation = (id: number) => {
  return axios.put(
    `/user/${id}`,
    { data: { active: false } }
  );
};
