import axios from "./axios";


export const deleteMessage = ( id: string | number) => {
  return axios.delete(`/contact/${id}`);
};

export const fetchMessages = async () => {
  const response = await axios.get('/contact');
  return response.data;
};
export const fetchKPIs = async () => {
  const response = await axios.get('/params/kpi');
  return response.data;
}
export const fetchCapacity = async () => {
  const response = await axios.get('/params/capacity');
  return response.data;
}