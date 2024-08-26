import axios from "./axios";

export const addOperation = (newData : any) => {
  return axios.post("/modeleTrash", newData);
};
export const fetchModeleTrash = async () => {
    const response = await axios.get('/modeleTrash');
    return response.data;
  };
export const editOperation = (newData: any, id: number) => {
  return axios.put(`/modeleTrash/${id}`, newData);
};
export const deleteOperation = (id: number) => {
  return axios.delete(
    `/modeleTrash/${id}`
  );
};
export const addTrash = (newData : any) => {
    return axios.post("/modeleTrash/cans", newData);
  };
  export const getTrash = async () => {
    const response = await axios.get('/trash');
    return response.data;
  };
  export const deleteTrash = (id: number) => {
    return axios.delete(`/trash/${id}`);
  }
