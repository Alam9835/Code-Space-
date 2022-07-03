import './App1.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import Compiler from './components/Compiler';
import Navbar from './components/Navbar';
import Editor from "@monaco-editor/react";
import Axios from 'axios';



function App() {
    return (
        <>
            <div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        success: {
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                    }}
                ></Toaster>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/editor/:roomId"
                        element={<EditorPage />}
                    ></Route>
                    <Route path="/components/Compiler" element={<Compiler />}></Route>
                    <Route path="/components/Navbar" element={<Navbar />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
