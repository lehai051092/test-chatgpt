// // import React from 'react'
// // import { Document, Page } from 'react-pdf';

// // function PdfPreview({pdfFile}) {
// //     console.log(pdfFile, 'pdfFile')
// //     return (
// //         <Document file={pdfFile}>
// //             <Page pageNumber={1} />
// //         </Document>
// //     )
// // }
// import React, { useState } from 'react';
// import { Document, Page,pdfjs } from 'react-pdf';
  
  
// const url = 
// "https://cors-anywhere.herokuapp.com/http://www.pdf995.com/samples/pdf.pdf"
  
// export default function Test({pdf}) {
      
//   pdfjs.GlobalWorkerOptions.workerSrc = 
//   `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
  
//   /*To Prevent right click on screen*/
//   document.addEventListener("contextmenu", (event) => {
//     event.preventDefault();
//   });
    
//   /*When document gets loaded successfully*/
//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//     setPageNumber(1);
//   }
  
//   function changePage(offset) {
//     setPageNumber(prevPageNumber => prevPageNumber + offset);
//   }
  
//   function previousPage() {
//     changePage(-1);
//   }
  
//   function nextPage() {
//     changePage(1);
//   }
  
//   return (
//     <>
//     <div className="main">
//       <Document
//         file={pdf}
//         onLoadSuccess={onDocumentLoadSuccess}
//       >
//         <Page pageNumber={pageNumber} />
//       </Document>
//       <div>
//         <div className="pagec">
//           Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
//         </div>
//         <div className="buttonc">
//         <button
//           type="button"
//           disabled={pageNumber <= 1}
//           onClick={previousPage}
//           className="Pre"
            
//         >
//           Previous
//         </button>
//         <button
//           type="button"
//           disabled={pageNumber >= numPages}
//           onClick={nextPage}
           
//         >
//           Next
//         </button>
//         </div>
//       </div>
//       </div>
//     </>
//   );
// }
import React from 'react'

import PDFViewer from 'pdf-viewer-reactjs'

const ExamplePDFViewer = ({pdf}) => {
  return (
    <PDFViewer
      document={{
        url: 'https://arxiv.org/pdf/quant-ph/0410100.pdf',
      }}
    />
  )
}

export default ExamplePDFViewer
