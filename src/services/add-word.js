import http from "../common/http-common";

const addWord = async (contenu, url , priority) => {
  const response = await http
        .post("/api/word/upload", {
            contenu,
            url,
            priority
        });
    return response.data;  
};

const AuthWord = {
    addWord,
};

export default AuthWord;