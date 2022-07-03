import { useEffect,useState } from 'react';
import '../Compiler.css';
import Editor from "@monaco-editor/react";
import Navbar from '../components/Navbar';
import Axios from 'axios';
import spinner from '../spinner.svg';


 
function Compiler() {
 
  // State variable to set users source code
  const [userCode, setUserCode] = useState(``);
 
  // State variable to set editors default language
  const [userLang, setUserLang] = useState("C");
 
  // State variable to set editors default theme
  const [userTheme, setUserTheme] = useState("vs-dark");
 
  // State variable to set editors default font size
  const [fontSize, setFontSize] = useState(25);
 
  // State variable to set users input
  const [userInput, setUserInput] = useState("");
 
  // State variable to set users output
  const [userOutput, setUserOutput] = useState("");
 
  // Loading state variable to show spinner
  // while fetching data
  const [loading, setLoading] = useState(false);

  const [width, setWidth] = useState(1000);

  useEffect(() => {
    setWidth(window.innerWidth);
  },[])
   
  const options = {
    fontSize: fontSize
  }
 
  // Function to call the compile endpoint
  function compile() {
    setLoading(true);
    if (userCode === ``) {
      return
    }
 
    // Post request to compile endpoint
    Axios.post(`${URL}/compile`, { code: userCode, language: userLang, input: userInput }).then((res) => {
      // setUserOutput(res);
      console.log(res.data.output);
      setUserOutput(res.data.output);
    }).then(() => {
      setLoading(false);
    })
  }
 
  // Function to clear the output screen
  function clearOutput() {
    setUserOutput("");
  }
 
  return (
    <div className="App">
      {width <= 880 ? (
        <div className="unavailable">
          <span className="text-mask"></span>
        </div>
      ) : (
        <>
          <Navbar
            userLang={userLang} setUserLang={setUserLang}
            userTheme={userTheme} setUserTheme={setUserTheme}
            fontSize={fontSize} setFontSize={setFontSize}
          />
          <div className="main">
            <div className="left-container">
              <Editor
                options={options}
                height="calc(100vh - 50px)"
                width="100%"
                theme={userTheme}
                language={userLang}
                defaultLanguage="python"
                defaultValue="# Enter your code"
                onChange={(value) => { setUserCode(value) }}
              />
              <button className="run-btn" onClick={() => compile()}>Run</button>
            </div>
            <div className="right-container">
              <h4>Input:</h4>
              <div className="input-box">
                <textarea id="code-inp" onChange={(e) => setUserInput(e.target.value)}></textarea>
              </div>
              <h4>Output:</h4>
              {loading ? (
                <div className="spinner-box">
                  <img src={spinner} alt="Loading..." />
                </div>
              ) : (
                <div className="output-box">
                  <pre>{userOutput}</pre>
                  <button onClick={() => { clearOutput() }} className="clear-btn">Clear</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
 
export default Compiler;