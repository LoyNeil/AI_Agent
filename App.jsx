import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import FileUpload from './FileUpload'
import SopGenerate from './SopGenerate'
import CopyRight from './CopyRight'
import LoaderOverlay from "./LoaderOverlay";

function App() {
  const [showLoader, setShowLoader] = useState(false);
  const [sopText,setSopText] = useState("");

  return (
    <div className='min-h-screen w-screen bg-black'>
      <div className='font-bold text-2xl text-center mb-4 p-4 text-neon-green-dark'>AI Agent for Process Design (SOP + Swimlane Diagram)</div>
      <p className='font-bold text-neon-green-heading text-center text-3xl p-4'>Upload Your Transcript File</p>
      <div className="h-px w-1/1 bg-gradient-to-r from-transparent via-[#00FF66] to-transparent my-4 mx-auto"></div>
      <FileUpload
        onStart={() => {
          setSopText("");
          setShowLoader(true);
        }}
        onSOPGenerated={(sop) => {
          setSopText(sop);
          setShowLoader(false);
        }}
        onError={() => {
          setShowLoader(false);
        }}
      />
      <div className="h-px w-1/1 bg-gradient-to-r from-transparent via-[#00FF66] to-transparent my-4 mx-auto"></div>
      <SopGenerate sopText={sopText}/>
      <LoaderOverlay
        open={showLoader}
        totalSeconds={20}
        onDone={() => {
          //setShowLoader(false);
          //setShowSOP(true);
        }}
      />
      <div className="h-px w-1/1 bg-gradient-to-r from-transparent via-[#00FF66] to-transparent my-4 mx-auto"></div>
      <CopyRight />
    </div>
  )
}

export default App
