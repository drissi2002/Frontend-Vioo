
import http from "../common/http-common";

  const initkeywords = (wId,contenu,url,priority) => {
    return http
    .get("/api/words", {
      wId,
      contenu,
      url,
      priority,
    })
      .then((response) => {
          let val = JSON.stringify(response.data) ;
          window.localStorage.setItem("list",val);

        return response.data;
      }); 
  };
  
  const getWordList = () => {
    return JSON.parse(localStorage.getItem("list"));
  };
  
  const PdfViewerService = {
    getWordList,
    initkeywords
  };
  
  export default PdfViewerService;


