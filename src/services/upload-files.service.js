/*
This service will use Axios to send HTTP requests.
There are 2 functions:

uploadDocument(document): POST form data with a callback for tracking upload progress
getDocuments(): GET list of Files’ information
*/

import http from "../common/http-common";

const uploadFile = (file,analyse,score) => {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("analyse", analyse);
  formData.append("score", score);
  return http.post(
    "/api/document/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const extarctTextFile = async (file) => {
  let formData = new FormData();
  formData.append("file", file);
  return await http.post(
    "/api/document/extractor",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const getFiles = (id,name,type,analyse,url) => {
  return http.get("/api/documents",{
    id,
    name,
    type,
    analyse,
    url
  });
};


const deleteFile =(id) =>{
  return http.delete(`/api/document/${id}`);

};


const FileUploadService = {
  uploadFile,
  getFiles,
  extarctTextFile,
  deleteFile,
};

export default FileUploadService;
