// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const GOOGLE_API_KEY = "AIzaSyBqPV-U4gUAGxWfVqs6KtKcEnf2q47cltE";
// const GOOGLE_VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;

// const columns = [
//   "Image No",
//   "Panda Name",
//   "Bahi Name",
//   "Bahi Number",
//   "Folio Number",
//   "Data Position",
//   "District",
//   "Tehasil",
//   "Station",
//   "Postoffice",
//   "City/Village",
//   "From Which Place",
//   "Caste",
//   "Subcaste",
//   "Individual ID",
//   "Given Name",
//   "Surname",
//   "Relation",
//   "Gender",
//   "Family Id",
//   "Ritual Name",
//   "Date of Ritual",
//   "Date of Ritual 2",
//   "Whose Ritual",
//   "Whose Ritual 2",
//   "Contact Number 1",
//   "Contact Number 2",
//   "Flags & Exception",
//   "Additional Information 1",
//   "Additional Information 2",
//   "Additional Information 3",
//   "Additional Information 4",
// ];

// function getValueForColumn(col, family, member, imageNo, fileName) {
  
//   switch (col) {
//     case "Image No":
//       return imageNo || "";
//     case "Panda Name":
//       return family["Panda Name"] || "";
//     case "Bahi Name":
//       return family["Bahi Name"] || "";
//     case "Bahi Number":
//       return family["Bahi Number"] || "";
//     case "Folio Number":
//       return family["Folio Number"] || "";
//     case "Data Position":
//       return family["Data Position"] || "";
//     case "District":
//       return family["District"] || "";
//     case "Tehasil":
//       return family["Tehasil"] || "";
//     case "Station":
//       return family["Station"] || "";
//     case "Postoffice":
//       return family["Postoffice"] || "";
//     case "City/Village":
//       return family["City/Village"] || "";
//     case "From Which Place":
//       return family["From Which Place"] || "";
//     case "Caste":
//       return family["Caste"] || "";
//     case "Subcaste":
//       return family["Subcaste"] || "";
//     case "Individual ID":
//       return member?.["Individual ID"] || member?.IndividualID || "";
//     case "Given Name":
//       return member?.["Given Name"] || member?.["given Name"] || "";
//     case "Surname":
//       return member?.Surname || "";
//     case "Relation":
//       return member?.Relation || "";
//     case "Gender":
//       return member?.Gender || "";
//     case "Family Id":
//       return family["Family Id"] || family["Family ID"] || "";
//     case "Ritual Name":
//       return member?.["Ritual Name"] || "";
//     case "Date of Ritual":
//       return member?.["Date of Ritual"] || "";
//     case "Date of Ritual 2":
//       return member?.["Date of Ritual 2"] || "";
//     case "Whose Ritual":
//       return member?.["Whose Ritual"] || member?.["Whose Ritual 1"] || "";
//     case "Whose Ritual 2":
//       return member?.["Whose Ritual 2"] || member?.["Whose ritual2"] || "";
//     case "Contact Number 1":
//       return member?.["Contact Number 1"] || member?.["Contact no. 1"] || "";
//     case "Contact Number 2":
//       return member?.["Contact Number 2"] || member?.["contact no.2"] || "";
//     case "Flags & Exception":
//       return (
//         member?.["Flags & Exception"] ||
//         member?.["Flags and Eception(non understandable stuff)"] ||
//         ""
//       );
//     case "Additional Information 1":
//       return member?.["Additional Information 1"] || member?.["additional information1"] || "";
//     case "Additional Information 2":
//       return member?.["Additional Information 2"] || member?.["additional information2"] || "";
//     case "Additional Information 3":
//       return member?.["Additional Information 3"] || "";
//     case "Additional Information 4":
//       return member?.["Additional Information 4"] || "";
//     default:
//       return "";
//   }
// }

// export default function Upload() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(0);

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

//   const ocrImage = async (base64Image) => {
//     const requestBody = {
//       requests: [
//         {
//           image: { content: base64Image },
//           features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
//         },
//       ],
//     };

//     const response = await fetch(GOOGLE_VISION_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });

//     const result = await response.json();
//     return result;
//   };

//   const extractStructuredData = async (ocrString) => {
//     const response = await fetch("http://localhost:8080/api/extract/text", {
//       method: "POST",
//       headers: { "Content-Type": "text/plain" },
//       body: ocrString,
//     });

//     const text = await response.text();
//     let clean = text.trim();
//     if (clean.startsWith("json")) clean = clean.replace("json", "");
//     if (clean.endsWith("")) clean = clean.slice(0, -3);

//     try {
//       return JSON.parse(clean);
//     } catch (e) {
//       return { error: "Invalid JSON from server" };
//     }
//   };

//   const handleFiles = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     setResults([]);
//     setTimer(0);
//     setLoading(true);
//     const t0 = performance.now();

//     const imageResults = await Promise.all(
//       files.map(async (file, index) => {
//         const preview = await getImagePreview(file);
//         let ocrText = "";
//         let extractedData = null;
//         let backendError = null;

//         try {
//           const base64 = await fileToBase64(file);
//           const ocrResult = await ocrImage(base64);
//           ocrText = ocrResult?.responses?.[0]?.fullTextAnnotation?.text || "No text found.";
//           const data = await extractStructuredData(ocrText);
//           extractedData = data;
//         } catch (err) {
//           backendError = err.message;
//         }

//         return {
//           imageNo: index + 1,
//           fileName: file.name,
//           preview,
//           ocrText,
//           extractedData,
//           backendError,
//         };
//       })
//     );

//     const t1 = performance.now();
//     setTimer(Math.round(t1 - t0));
//     setResults(imageResults);
//     setLoading(false);
//   };

//   const exportToExcel = (allData) => {
//     const rows = [];

//     allData.forEach((result) => {
//       // If your backend returns an array at the top level
//       if (!Array.isArray(result.extractedData)) return;
//       result.extractedData.forEach((family) => {
//         const members = Array.isArray(family.Members) ? family.Members : [family.Members || {}];
//         members.forEach((member) => {
//           const excelRow = {};
//           columns.forEach((col) => {
//             excelRow[col] = getValueForColumn(col, family, member, result.imageNo, result.fileName);
//           });
//           rows.push(excelRow);
//         });
//       });
//     });

//     if (rows.length === 0) return;

//     // Create worksheet with headers in right order
//     const worksheet = XLSX.utils.json_to_sheet(rows, { header: columns });
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Extracted Data");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, "extracted_data.xlsx");
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Vision OCR + Extract + Excel</h1>

//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleFiles}
//         className="mb-4"
//       />

//       {loading && <p className="text-blue-500 mb-4">Processing...</p>}

//       {timer > 0 && (
//         <div className="font-semibold text-blue-600 mb-4">
//           Processing Time: {timer} ms
//         </div>
//       )}

//       <button
//         onClick={() => exportToExcel(results)}
//         className="px-4 py-2 bg-green-600 text-white rounded mb-6"
//         disabled={results.length === 0}
//       >
//         Download as Excel
//       </button>

//       <div className="space-y-6">
//         {results.map((res, index) => (
//           <div
//             key={index}
//             className="border-b pb-6 mb-6 flex flex-col md:flex-row gap-6"
//           >
//             <img
//               src={res.preview}
//               alt={res.fileName}
//               className="w-48 h-auto rounded shadow"
//             />
//             <div className="flex-1">
//               <h2 className="font-semibold text-lg mb-2">{res.fileName}</h2>
//               <label className="text-sm font-semibold text-gray-600">
//                 Extracted OCR Text:
//               </label>
//               <textarea
//                 readOnly
//                 className="w-full h-32 border rounded p-2 text-sm bg-gray-50 mb-4"
//                 value={res.ocrText}
//               />
//               <label className="text-sm font-semibold text-gray-600">
//                 Backend JSON (cleaned):
//               </label>
//               <textarea
//                 readOnly
//                 className="w-full h-48 border rounded p-2 text-xs bg-gray-100"
//                 value={JSON.stringify(res.extractedData, null, 2)}
//               />
//               {res.backendError && (
//                 <div className="text-red-600 mt-2">
//                   Backend Error: {res.backendError}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




// Add this TypeScript declaration if using JS/TS with type checking
/**
 * @typedef {Object} ElectronAPI
 * @property {(args: { fileName: string, content: any }) => Promise<{ success: boolean, error?: string }>} saveJson
 */

/**
 * @type {Window & typeof globalThis & { electronAPI?: ElectronAPI }}
 */
 
import React, { useState } from "react";
import { api } from "../secrets/Visionapi";

const GOOGLE_API_KEY = api;
const GOOGLE_VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;

export default function VisionOCRJson() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const saveJsonToDisk = async (fileName, jsonData) => {
    if (window.electronAPI?.saveJson) {
      const result = await window.electronAPI.saveJson({ fileName, content: jsonData });
      if (!result.success) {
        console.error(" Failed to save JSON:", result.error);
      }
    } else {
      console.warn("Electron API not available. Falling back to browser download.");
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);
    const output = [];

    const chunks = chunkArray(files, 16);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const batchResults = await Promise.all(
        chunk.map(async (file, idx) => {
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
            resultJson?.responses?.[0]?.fullTextAnnotation?.text || "No OCR text found.";

          const fileNameWithoutExt = file.name.split(".")[0];
          await saveJsonToDisk(`${fileNameWithoutExt}_i1.json`, resultJson);

          return {
            fileName: file.name,
            preview: URL.createObjectURL(file),
            ocrText,
            rawJson: resultJson,
          };
        })
      );

      output.push(...batchResults);
    }

    setResults(output);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Google Vision OCR: Text + JSON Save</h1>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="mb-4"
      />

      {loading && <p className="text-blue-600 font-medium">Processing images in batches...</p>}

      {results.map((res, index) => (
        <div key={index} className="border p-4 my-6 rounded shadow bg-white">
          <h2 className="font-semibold text-lg mb-2">{res.fileName}</h2>
          <img src={res.preview} alt={res.fileName} className="w-48 mb-4 rounded shadow" />

          <h3 className="text-sm font-semibold text-gray-600">🔍 OCR Text:</h3>
          <textarea
            readOnly
            value={res.ocrText}
            className="w-full h-40 p-2 border bg-gray-50 text-sm mb-4"
          />

          <h3 className="text-sm font-semibold text-gray-600"> Raw JSON:</h3>
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
