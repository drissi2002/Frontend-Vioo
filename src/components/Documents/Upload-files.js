import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import UploadService from "../../services/upload-files.service";
import PdfViewerService from "../../services/viewer.service"

const UploadFiles = () => {

  const [fileInfos, setFileInfos] = useState([]);
  const [ listWord , setListWord ] = useState([]);
  const [wordInfos, setWordInfos] = useState([]);
  const [search, setSearch] = useState("");

    // delete document 
    const deleteDocument = (id) => {
      UploadService.deleteFile(id)
          .then(
            () => {
              window.location.reload();
            },
          )
    };

  const documents =[
    {
      name : "Name",
      selector : (row) => row.name ,
      sortable :true

    },
    {
      name : "Score % ",
      selector : (row) => row.score ,
      sortable: true
    },
    
  ]

  wordInfos.forEach((word) =>{

    documents.push(
    {
      name : word.contenu ,
      selector : (row) => {
        let occur = JSON.parse(row.analyse);
        if(occur.hasOwnProperty(word.contenu)){
          return occur[word.contenu];
        }
        else{
          return 0 ;
        }
      },
      sortable :true
    },

  )});

  documents.push(
    {
      name : "Action",
      cell : row => <button className="btn-delete btn-lg" onClick={()=>{deleteDocument(row.id)}}>Delete</button>
    },
  )

  const customStyles = {
    rows: {
        style: {
            minHeight: '50px', // override the row height
            
        },
    },
    cells: {
        style: {
            paddingLeft: '15px', // override the cell padding for data cells
        },
    },
};
  
  // list of words
  const getWords =() =>{
    const fetch = async () => {
      let data = await PdfViewerService.initkeywords(listWord);
      setWordInfos(data);
      data.forEach((word) => {
        setListWord((listWord) => [...listWord, word.contenu]);
      });
    };
    fetch();
  }
  useEffect(() => {
    getWords();
  },[]);

  // list of documents
  const getDocuments = () => {
    UploadService.getFiles().then((response) => {
      setFileInfos(response.data);
    });
  };

  useEffect(() => {
    getDocuments();
  },[]);

  useEffect(() => {
      const result = fileInfos.filter(
      document => {
        return document.name.toLowerCase().match(search.toLowerCase());
      });
      setFileInfos(result);
  }, [search]);

  return (
  <div>
  <div className="container">
    <div className="list-document">
      <div className="card-header">List of <b><i>Analyzed Documents</i></b> 🗃️ :</div>
      <DataTable 
      columns={documents} 
      customStyles={customStyles}
      data={fileInfos} 
      pagination
      fixedHeader
      
      highlightOnHover
      subHeader
      subHeaderComponent = {
         <input 
           type="text" 
           placeholder="Search Document" 
           className="w-25 form-control"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           />}
      subHeaderAlign="left"
      />
    </div>
  </div>
  </div>
  );
};

export default UploadFiles;