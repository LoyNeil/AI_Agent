import React from 'react'
import { useRef, useState } from 'react'

const FileUpload = ({onSOPGenerated}) => {
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setFileObject(file);
    }
  }

  const handleUploadTranscript = async () => {
    if (!fileObject) {
      alert("Please select a file before uploading.");
      return;
    }
    setShowLoader(true);

    const formData = new FormData();
    formData.append("file", fileObject);

    try {
      const res = await fetch("http://localhost:8000/generate-sop", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate SOP");
      }

      const data = await res.json();
      onSOPGenerated(data.sop);     
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <>
     <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
        accept='.txt'
      />
        <div onClick={handleClick} className='p-4 flex box-border h-25 w-200 border-2 border-neon-green border-dashed justify-center items-center mx-auto cursor-pointer'>
            <img src="/Icon.png" alt="Upload Icon" className="w-16 h-16 flex justify-center"/>
            {fileName ? (
               <p className="text-[#00FFA3] text-sm text-center font-semibold">Selected:<span className='text-neon-green-content italic ml-2'>{fileName}</span></p>
              ) : ( 
            <p className="text-neon-green-content text-center flex justify-center"> Drag & Drop or: {""}
                <span className="text-[#00FFA3] font-semibold ml-1">
                    Browse File
                </span>
            </p>
              )}
        </div>
        <button onClick={handleUploadTranscript} className=" border border-neon-green-heading text-neon-green-heading font-semibold py-3 px-6 rounded-lg mt-6 mx-auto block transition-all duration-300 hover:bg-neon-green-heading hover:text-black hover:shadow-[0_0_15px_#00FF66] cursor-pointer">
            Upload Transcript
        </button>
    </>
  )
}

export default FileUpload
