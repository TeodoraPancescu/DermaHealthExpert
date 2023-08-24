import { Document, Page } from 'react-pdf';

const PDFViewer = ({ visible, onClose, pdfData }) => {
  if (!visible) return null;

  return (
    <div>
      <h1>PDF Viewer</h1>
      <button onClick={onClose}>Close</button>
      <Document file={pdfData}>
        <Page pageNumber={1} width={500} />
      </Document>
    </div>
  );
};

export default PDFViewer;