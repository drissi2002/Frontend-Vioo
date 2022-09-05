import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Modal from "react-modal";
// Alert message
import Swal from 'sweetalert2';
// Animation
import ChangingProgressProvider from "../../helpers/changingProgressProvider";
// Import the main component
import { Viewer } from "@react-pdf-viewer/core";
// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { searchPlugin } from "@react-pdf-viewer/search";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "react-circular-progressbar/dist/styles.css";
// Worker
import { Worker } from "@react-pdf-viewer/core";
// the services
import PdfViewerService from "../../services/viewer.service";
import AuthWord from "../../services/add-word";
import UploadService from "../../services/upload-files.service";
// the helper
import ClassSetter from "../../helpers/costumized-class";
// add word form
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/auth.service";


const PdfViewer = () => {

 
  const navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();
 // Upload files states

  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [msg, setMsg] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

 // add word form states
  const [contenu, setContenu] = useState("");
  const [priority, setPriority] = useState("HIGH");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Keywords list , occurence & score states
  const [keywords, setKeyword] = useState([]);
  const [wordInfos, setWordInfos] = useState([]);
  const [words, setWords] = useState([]);
  const [occurenceWords, setOccurenceWords] = useState(0);
  const [analyseWords, setAnalyseWords] = useState("");
  const [score, setScore] = useState(0);

  // Modal states
  const [modalIsOpen, setIsOpen] = useState(false);

  // for onchange event
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileError, setPdfFileError] = useState("");
  const [viewPdf, setViewPdf] = useState(null);

  //setting key words list related to the selected document
  const [currentList, setCurrentList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      let data = await PdfViewerService.initkeywords(keywords);
      setCurrentList(data);
      data.forEach((word) => {
        setKeyword((keywords) => [...keywords, word.contenu]);
        setWordInfos((wordInfos) => [...wordInfos, word]);
      });
    };
    fetch();
  }, []);

  // upload document states

  useEffect(() => {
    UploadService.getFiles().then((response) => {
      setFileInfos(response.data);
    });
  }, []);
  

  // setting key words occurence list related to the selected document
  useEffect(() => {
    let result = {};
    let profileScore = 0;
    for (var i = 0; i < words.length; ++i) {
      if (!result[words[i]]) 
        result[words[i]] = 0;
      ++result[words[i]];
      profileScore += (result[words[i]] / words.length).toFixed(2) * 100;
    }
    setOccurenceWords(result);
    setScore(profileScore);
  }, [words]);

  // Create new plugins instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const searchPluginInstance = searchPlugin({
    keyword: keywords, //['ANGULAR','JAVA','HTML','CSS']
    onHighlightKeyword: (props) => {
      switch (props.keyword.source) {
        case "ANGULAR":
          props.highlightEle.style.backgroundColor = "rgba(255, 0, 0, .2)";
          break;
        case "SPRINGBOOT":
          props.highlightEle.style.backgroundColor = "rgba(0, 255, 28, .2)";
          break;
        case "HTML":
          props.highlightEle.style.backgroundColor = "rgba(255, 129, 0, .2)";
          break;
        case "CSS":
          props.highlightEle.style.backgroundColor = "rgba(39, 123, 255, .2)";
          break;
        case "BOOTSTRAP":
          props.highlightEle.style.backgroundColor = "rgba(205, 0, 217, .2)";
          break;
        case "JAVA":
          props.highlightEle.style.backgroundColor = "rgba(0, 15, 39, .2)";
          break;
        case "JAVASCRIPT":
          props.highlightEle.style.backgroundColor = "rgba(255, 228, 30, .2)";
          break;
        case "REACT":
          props.highlightEle.style.backgroundColor = "rgba(0, 222, 255, .2)";
          break;
        case "PHP":
          props.highlightEle.style.backgroundColor = "rgba(90, 27, 173, .2)";
          break;
        case "LARAVEL":
          props.highlightEle.style.backgroundColor = "rgba(255, 50, 132, .2)";
          break;
        case "PYTHON":
          props.highlightEle.style.backgroundColor = "rgba(0, 44, 255, .2)";
          break;
        case "FLASK":
          props.highlightEle.style.backgroundColor = "rgba(36, 17, 52, .2)";
          break;
        default:
          props.highlightEle.style.backgroundColor = "rgba(255, 228, 30, .2)";
      }
      setWords((words) => [...words, props.keyword.source]);
    },
  });

  // onchange event
  const fileType = ["application/pdf"];
  const handlePdfFileChange = (e) => {
    let selectedFile = e.target.files[0];
    setSelectedFiles( e.target.files);
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          setPdfFile(e.target.result);
          setCurrentFile(e.target.result);
          setPdfFileError("");
        };
      } else {
        setPdfFile(null);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: ' Please select valid pdf document .. ',
        })
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };

  // pdf upload submit
  const handlePdfFileSubmit = (e) => {
    e.preventDefault();
    if (pdfFile !== null) {
      setViewPdf(pdfFile);
    } else {
      setViewPdf(null);
    }
  };
  console.log(JSON.stringify(occurenceWords));
  // upload pdf into DB 
  
  const upload = () => {
    let currentFile = selectedFiles[0];
    let analyse = JSON.stringify(occurenceWords);
    let scoreDoc = (((score / keywords.length).toFixed(1)) || 0) ;
    setCurrentFile(currentFile);
    setAnalyseWords(analyse);
    UploadService.uploadFile(currentFile,analyse,scoreDoc)
      .then((response) => {
        setMsg(response.data.message);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your document is successfully uploaded ! ',
          showConfirmButton: false,
          timer: 2500
        })
        return UploadService.getFiles();
      })
      .then((files) => {
        setFileInfos(files.data);
      })
      .then(
        ()=>{
          window.location.reload();
        }
      )
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: ' Could not upload the file ..',
        })
        setMsg("Could not upload the file");
        setCurrentFile(undefined);
        setScore(0);
      });
    setSelectedFiles(undefined);
  };

  // word add form onchange
  const onChangeContenu = (e) => {
    const contenu = e.target.value;
    setContenu(contenu);
  };

  const onChangePriority = (e) => {
    const priority = e.target.value;
    setPriority(priority);
  };

  const onChangeUrl = (e) => {
    const url = e.target.value;
    setUrl(url);
  };

  // message for the add word form
  const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };

  // add word form submit
  const handleAddWord = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthWord.addWord(contenu, url, priority).then(
        () => {
          navigate("/user");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  // Modal states
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="row">
      <div className="col">
        <div className="leftside">
          <form className="form-group" onSubmit={handlePdfFileSubmit}>
            <input
              type="file"
              className="form-control input-style"
              onChange={handlePdfFileChange}
            />
            <br />
            <button type="submit" className="btn btn-lg" disabled={!pdfFile}>
              Vizualise document
            </button>
            <button className={`${ClassSetter.setClassUpload(AuthService.getCurrentUser().roles[0])}`
                }  disabled={!pdfFile} onClick={upload}>
              <b>Upload document</b>
            </button>
          </form>
          <br />
          <h5>
            <b>View </b> <i>Document</i> 🔍 :
          </h5>
          <div className="pdf-container">
            {/* show pdf conditionally (if we have one)  */}
            {viewPdf && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={viewPdf}
                  plugins={[
                    defaultLayoutPluginInstance,
                    searchPluginInstance,
                    //dropPluginInstance,
                  ]} //
                />
              </Worker>
            )}
            {/* if we dont have pdf or viewPdf state is null */}
            {!viewPdf && (
              <p className="message-styling"> No pdf file selected !</p>
            )}
          </div>
        </div>
      </div>

      <div className="col">
        <div className="form-add">
          <div className="col">
            <button
              className ={` ${ClassSetter.setClassButton(
                AuthService.getCurrentUser().roles[0]
              )}`}
              data-bs-toggle="modal"
              data-bs-target="#myModal"
              onClick={openModal}
            >
              <b>Add word + </b>
            </button>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="Modal "
            overlayClassName="Overlay"
          >
            <p>Add <b> <i>New Word </i></b> : </p>
            <Form ref={form} onSubmit={handleAddWord}>
              <div className="form-group">
                <label htmlFor="contenu">Contenu</label>
                <Input
                  type="text"
                  className="form-control"
                  name="contenu"
                  onChange={onChangeContenu}
                  value={contenu}
                  placeholder="Contenu"
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="url">Icon Url</label>
                <Input
                  type="text"
                  className="form-control"
                  name="url"
                  onChange={onChangeUrl}
                  value={url}
                  placeholder="Icon Word Url"
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select name="priority " 
                 className="form-control"
                 type="priority"
                 onChange={onChangePriority}
                 value={priority}
                 validations={[required]}
                >
                  <option selected value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div className="form-group">
                <button className="btn  btn-block" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Submit</span>
                </button>
              </div>
              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
              <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
          </Modal>
        </div>

        <div className="rightside">
          <div className="container-fuild">
            <div className="row">
              <div className="col-md-6 ">
                <div className={`score-body word ${ClassSetter.setClassCard(
                              AuthService.getCurrentUser().roles[0]
                            )}`}>
                  <ChangingProgressProvider values={[0, 20, 40, 60, 80, 100]}>
                    {() => (
                      <CircularProgressbar
                        value={((score/keywords.length) || 0).toFixed(1)}
                        maxValue={100}
                        //text={`${ ((score / words.length).toFixed(1) || 0 )}%`}
                        text={`${((score/keywords.length) || 0).toFixed(1)} %`}

                        styles={buildStyles({
                          pathTransitionDuration: 0.15,
                          textColor: "#642583",
                          pathColor: "#642583",
                          trailColor: "#eaeaea",
                        })}
                      />
                    )}
                  </ChangingProgressProvider>
                  <br />
                  <label className="tag-score">
                    Document
                    <b>
                      <i> Average</i>
                    </b>
                  </label>
                </div>
              </div>
              <div className="col-md-6 ">
                <div className={`score-body word ${ClassSetter.setClassCard(
                              AuthService.getCurrentUser().roles[0]
                            )}`}>
                  <ChangingProgressProvider values={[0, 20, 40, 60, 80, 100]}>
                    {() => (
                      <CircularProgressbar
                        value={words.length || 0}
                        maxValue={100}
                        text={`${words.length || 0} `}
                        styles={buildStyles({
                          pathTransitionDuration: 0.15,
                          textColor: "#642583",
                          pathColor: "#642583",
                          trailColor: "#eaeaea",
                        })}
                      />
                    )}
                  </ChangingProgressProvider>
                  <br />
                  <label className="tag-score">
                    Totale{" "}
                    <b>
                      <i>Occurence</i>
                    </b>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bootstrap-wrapper">
            <div className="container-fuild">
              {wordInfos.length > 0 && (
                <div className="row">
                  {wordInfos.map((word, index) => (
                    <div className="col-md-4 " key={index}>
                      <div className="card card-taille word">
                        <div className="card-category">
                          <h5>
                            <i>{word.contenu}</i>
                          </h5>
                          <span
                            className={`tag ${ClassSetter.setClassName(
                              word.priority
                            )}`}
                          >
                            {word.priority}
                          </span>
                        </div>
                        <div className="card-body">
                          <div className="card-content">
                            <div className="card-title">
                              {" "}
                              {(
                                occurenceWords[word.contenu] / words.length
                              ).toFixed(1) * 100 || 0}
                              %
                            </div>
                          </div>
                          <img src={word.url} alt="" className="card-thumb" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
