import axios from "./axios";

export const addOperation = (newData : any) => {
  return axios.post("/modeleCamion", newData);
};
export const fetchModeleCamions = async () => {
    const response = await axios.get('/modeleCamion');
    return response.data;
  };
export const editOperation = (newData: any, id: number) => {
  return axios.put(`/modeleCamion/${id}`, newData);
};
export const deleteOperation = (id: number) => {
  return axios.delete(
    `/modeleCamion/${id}`
  );
};
