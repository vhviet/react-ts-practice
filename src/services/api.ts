import axios from "services/axios.customize";

export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password });
};

export const registerAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user/register";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};

export const fetchAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAcc>>(urlBackend, {
    headers: {
      delay: 1000,
    },
  });
};

export const logoutAPI = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post<IBackendRes<ILogin>>(urlBackend);
};

export const getUsersAPI = (query: string) => {
  const urlBackend = `/api/v1/user?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IUser>>>(urlBackend);
};

export const addUserAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.post<IBackendRes<IUserTable>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};

export const importUserAPI = (
  data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }[]
) => {
  const urlBackend = "/api/v1/user/bulk-create";
  return axios.post<IBackendRes<IUserImport>>(urlBackend, data);
};

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
  const urlBackend = "/api/v1/user";
  return axios.put<IBackendRes<IRegister>>(urlBackend, {
    _id,
    fullName,
    phone,
  });
};

const deleteUserAPI = (_id: string) => {
  const urlBackend = `/api/v1/user/${_id}`;
  return axios.delete<IBackendRes<ILogin>>(urlBackend);
};
export default deleteUserAPI;

export const getBooksAPI = (query: string) => {
  const urlBackend = `/api/v1/book?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
};

export const getCategoryAPI = () => {
  const urlBackend = "/api/v1/database/category";
  return axios.get<IBackendRes<string[]>>(urlBackend);
};

// Upload book images
export const uploadFileBookAPI = (fileImg: any, folderName: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios<IBackendRes<{ fileUploaded: string }>>({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": folderName,
    },
  });
};

export const addBookAPI = (
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string
) => {
  const urlBackend = "/api/v1/book";
  return axios.post<IBackendRes<IBookAdd>>(urlBackend, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  });
};
