import axios from "./axios";

export const addOperation = (newData : any) => {
  return axios.post("/region", newData);
};
export const editOperation = (newData: any, id: number) => {
  return axios.put(`/region/${id}`, newData);
};

export const fetchRegions = async () => {
  const response = await axios.get('/region');
  return response.data;
};
export const editStatus = (newData: any, id: number) => {
  return axios.put(`/region/active/${id}`, newData);
};
export const fetchSuggestions = async () => {
  const response = await axios.get('/region/predict_all');
  return response.data;
};
export const addSuggestions = (newData: any) => {
  return axios.post('/region/add_suggest', newData);
}
