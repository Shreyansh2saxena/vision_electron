// import React, { useState } from "react";

// const GOOGLE_API_KEY = "AIzaSyBqPV-U4gUAGxWfVqs6KtKcEnf2q47cltE";
// const GOOGLE_VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;
// const BATCH_SIZE = 16;
// const PAGE_SIZE = 10;

// export default function Upload() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const [page, setPage] = useState(1);
//   const [expandedIndex, setExpandedIndex] = useState(null);

//   const fileToBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//   const getImagePreview = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//   const ocrBatchImages = async (base64Images) => {
//     const requests = base64Images.map((base64) => ({
//       image: { content: base64 },
//       features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
//     }));

//     const response = await fetch(GOOGLE_VISION_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ requests }),
//     });

//     const json = await response.json();
//     return json.responses;
//   };

//   const chunkArray = (arr, size) => {
//     const chunks = [];
//     for (let i = 0; i < arr.length; i += size) {
//       chunks.push(arr.slice(i, i + size));
//     }
//     return chunks;
//   };

//   const handleFiles = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     setResults([]);
//     setTimer(0);
//     setPage(1);
//     setLoading(true);
//     const t0 = performance.now();

//     const fileData = [];
//     for (let i = 0; i < files.length; i++) {
//       const base64 = await fileToBase64(files[i]); // sequential, memory-safe
//       const preview = await getImagePreview(files[i]);
//       fileData.push({ file: files[i], base64, preview, index: i });
//     }

//     const batches = chunkArray(fileData, BATCH_SIZE);
//     let finalResults = [];

//     for (const batch of batches) {
//       const base64s = batch.map((f) => f.base64);
//       let responses = [];

//       try {
//         responses = await ocrBatchImages(base64s);
//       } catch (err) {
//         responses = batch.map(() => ({ error: err.message }));
//       }

//       const batchResults = batch.map((data, i) => {
//         const response = responses[i];
//         return {
//           imageNo: data.index + 1,
//           fileName: data.file.name,
//           preview: data.preview,
//           ocrText: response?.fullTextAnnotation?.text || "No text found.",
//           jsonResult: response,
//         };
//       });

//       finalResults = [...finalResults, ...batchResults];
//     }

//     const t1 = performance.now();
//     setTimer(Math.round(t1 - t0));
//     setResults(finalResults);
//     setLoading(false);
//   };

//   const paginatedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Google Vision OCR (Batch Optimized)</h1>

//       <input type="file" accept="image/*" multiple onChange={handleFiles} className="mb-4" />

//       {loading && <p className="text-blue-500 mb-4">Processing...</p>}

//       {timer > 0 && (
//         <p className="text-green-600 font-semibold mb-4">
//           Total Processing Time: {timer} ms
//         </p>
//       )}

//       {/* Pagination Controls */}
//       {results.length > PAGE_SIZE && (
//         <div className="mb-4 flex justify-between items-center">
//           <button
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>Page {page}</span>
//           <button
//             onClick={() => setPage((prev) => (prev * PAGE_SIZE < results.length ? prev + 1 : prev))}
//             disabled={page * PAGE_SIZE >= results.length}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Results */}
//       <div className="space-y-6">
//         {paginatedResults.map((res, index) => (
//           <div key={index} className="border-b pb-6 mb-6 flex flex-col md:flex-row gap-6">
//             <img src={res.preview} alt={res.fileName} className="w-48 h-auto rounded shadow" />
//             <div className="flex-1">
//               <h2 className="font-semibold text-lg mb-2">{res.fileName}</h2>

//               <label className="text-sm font-semibold text-gray-600">OCR Text:</label>
//               <textarea
//                 readOnly
//                 className="w-full h-24 border rounded p-2 text-sm bg-gray-50 mb-2"
//                 value={res.ocrText}
//               />

//               <button
//                 onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
//                 className="text-blue-600 text-sm mb-2"
//               >
//                 {index === expandedIndex ? "Hide JSON" : "Show JSON"}
//               </button>

//               {index === expandedIndex && (
//                 <textarea
//                   readOnly
//                   className="w-full h-48 border rounded p-2 text-xs bg-gray-100"
//                   value={JSON.stringify(res.jsonResult, null, 2)}
//                 />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






// // Uncomment this section if you want to use Electron's saveJson API


// // Add this TypeScript declaration if using JS/TS with type checking
// /**
//  * @typedef {Object} ElectronAPI
//  * @property {(args: { fileName: string, content: any }) => Promise<{ success: boolean, error?: string }>} saveJson
//  */

// /**
//  * @type {Window & typeof globalThis & { electronAPI?: ElectronAPI }}
//  */
 
// import React, { useState } from "react";


// const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY ;
// const GOOGLE_VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;

// export default function VisionOCRJson() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fileToBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//   const chunkArray = (arr, size) => {
//     const chunks = [];
//     for (let i = 0; i < arr.length; i += size) {
//       chunks.push(arr.slice(i, i + size));
//     }
//     return chunks;
//   };

//   const saveJsonToDisk = async (fileName, jsonData) => {
//     if (window.electronAPI?.saveJson) {
//       const result = await window.electronAPI.saveJson({ fileName, content: jsonData });
//       if (!result.success) {
//         console.error(" Failed to save JSON:", result.error);
//       }
//     } else {
//       console.warn("Electron API not available. Falling back to browser download.");
//       const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = fileName;
//       a.click();
//       URL.revokeObjectURL(url);
//     }
//   };

//   const handleFiles = async (e) => {
//     const files = Array.from(e.target.files);
//     setLoading(true);
//     const output = [];

//     const chunks = chunkArray(files, 16);

//     for (let i = 0; i < chunks.length; i++) {
//       const chunk = chunks[i];

//       const batchResults = await Promise.all(
//         chunk.map(async (file, idx) => {
//           const base64 = await fileToBase64(file);

//           const requestBody = {
//             requests: [
//               {
//                 image: { content: base64 },
//                 features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
//               },
//             ],
//           };

//           const response = await fetch(GOOGLE_VISION_URL, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(requestBody),
//           });

//           const resultJson = await response.json();
//           const ocrText =
//             resultJson?.responses?.[0]?.fullTextAnnotation?.text || "No OCR text found.";

//           const fileNameWithoutExt = file.name.split(".")[0];
//           await saveJsonToDisk(`${fileNameWithoutExt}_i1.json`, resultJson);

//           return {
//             fileName: file.name,
//             preview: URL.createObjectURL(file),
//             ocrText,
//             rawJson: resultJson,
//           };
//         })
//       );

//       output.push(...batchResults);
//     }

//     setResults(output);
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Google Vision OCR: Text + JSON Save</h1>

//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleFiles}
//         className="mb-4"
//       />

//       {loading && <p className="text-blue-600 font-medium">Processing images in batches...</p>}

//       {results.map((res, index) => (
//         <div key={index} className="border p-4 my-6 rounded shadow bg-white">
//           <h2 className="font-semibold text-lg mb-2">{res.fileName}</h2>
//           <img src={res.preview} alt={res.fileName} className="w-48 mb-4 rounded shadow" />

//           <h3 className="text-sm font-semibold text-gray-600">🔍 OCR Text:</h3>
//           <textarea
//             readOnly
//             value={res.ocrText}
//             className="w-full h-40 p-2 border bg-gray-50 text-sm mb-4"
//           />

//           <h3 className="text-sm font-semibold text-gray-600"> Raw JSON:</h3>
//           <textarea
//             readOnly
//             value={JSON.stringify(res.rawJson, null, 2)}
//             className="w-full h-64 p-2 border bg-gray-100 text-xs font-mono"
//           />
//         </div>
//       ))}
//     </div>
//   );
// }





import React, { useState } from "react";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY; // Replace with your key
const GOOGLE_VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;
const MAX_FILES = 16;

export default function Upload() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_FILES) {
      alert(`Please select only up to ${MAX_FILES} images.`);
      return;
    }

    setLoading(true);
    setResults([]);
    setProcessingTime(0);
    const t0 = performance.now();

    const processed = await Promise.all(
      files.map(async (file) => {
        const base64 = await fileToBase64(file);

        const requestBody = {
          requests: [
            {
              image: { content: base64 },
              features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
            },
          ],
        };

        const response = await fetch(GOOGLE_VISION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const resultJson = await response.json();
        const ocrText =
          resultJson?.responses?.[0]?.fullTextAnnotation?.text ||
          "No OCR text found.";

        return {
          fileName: file.name,
          imageNo: file.name.replace(/\.[^/.]+$/, ""),
          folioNo: "",
          preview: URL.createObjectURL(file),
          ocrText,
          rawJson: resultJson,
        };
      })
    );

    const t1 = performance.now();
    setProcessingTime(Math.round(t1 - t0));
    setResults(processed);
    setLoading(false);
  };

  const handleFolioChange = (index, value) => {
    const updated = [...results];
    updated[index].folioNo = value;
    setResults(updated);
  };

const handleSubmitAll = async () => {
  // Check for any missing folioNo before sending
  for (const res of results) {
    if (!res.folioNo) {
      alert(`❗ Please enter folio number for image: ${res.fileName}`);
      return;
    }
  }

  // Build the batch array in your desired structure
  const batch = results.map(res => ({
    imageNo: res.imageNo,
    folioNo: res.folioNo,
    text: res.ocrText, // use ocrText as the text field
  }));

  try {
    await fetch("http://localhost:8081/api/bahi/extract/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });
    alert("✅ All OCR results sent to the backend.");
  } catch (err) {
    console.error("API Error:", err);
    alert("❌ API Error: See console for details.");
  }
};

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Google Vision OCR (Max 16 Images)</h1>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="mb-4"
      />

      {loading && <p className="text-blue-500 mb-4">Processing images...</p>}

      {processingTime > 0 && (
        <p className="text-green-600 mb-4 font-semibold">
          Total Processing Time: {processingTime} ms
        </p>
      )}

      {results.length > 0 && (
        <button
          onClick={handleSubmitAll}
          className="mb-6 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ✅ Submit All to API
        </button>
      )}

      {results.map((res, index) => (
        <div key={index} className="border p-4 mb-6 rounded shadow bg-white">
          <h2 className="font-semibold text-lg mb-2">{res.imageNo}</h2>
          <img
            src={res.preview}
            alt={res.fileName}
            className="w-48 mb-4 rounded shadow"
          />

          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mr-2">
              Folio No:
            </label>
            <input
              type="number"
              value={res.folioNo}
              onChange={(e) => handleFolioChange(index, e.target.value)}
              className="p-1 border rounded w-32"
              required
            />
          </div>

          <label className="text-sm font-semibold text-gray-600">🔍 OCR Text:</label>
          <textarea
            readOnly
            value={res.ocrText}
            className="w-full h-40 p-2 border bg-gray-50 text-sm mb-4"
          />

          <label className="text-sm font-semibold text-gray-600">📦 Raw JSON:</label>
          <textarea
            readOnly
            value={JSON.stringify(res.rawJson, null, 2)}
            className="w-full h-64 p-2 border bg-gray-100 text-xs font-mono"
          />
        </div>
      ))}
    </div>
  );
}
