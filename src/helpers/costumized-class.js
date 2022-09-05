
const setClassName = (status)  => status === "LOW" ? "tag-low" : status === "MEDIUM" ? "tag-medium" : "tag-high" ;
const setClassButton = (role)  =>  role === "ROLE_USER" ? "btn-user" : role === "ROLE_USER" ? "btn-admin" :"btn-word";
const setClassCard = (role)  =>  role === "ROLE_USER" ? "score-user" :"score-card";
const setClassUpload = (role)  =>  role === "ROLE_USER" ? "doc-user" :"btn-upload btn-lg";



const helper = {
    setClassName,
    setClassButton,
    setClassCard,
    setClassUpload,
  };
export default helper;