import React from 'react';
import { ArrowLeft, MoreVertical } from 'react-feather';
import './FileModal.scss';

const FileModal = ({ onClose }) => {
  const files = [
    { id: 1, name: 'Transform_your_Life', type: 'pdf', date: '29 Oct 2023', size: '324.4 MB' },
    { id: 2, name: 'Passwords', type: 'folder', date: '29 Oct 2023', size: '22 MB' },
    { id: 3, name: 'Presentation_Doc', type: 'pdf', date: '28 Oct 2023', size: '122 MB' },
    { id: 4, name: 'Employee Info', type: 'excel', date: '25 Oct 2023', size: '2.4 MB' },
    { id: 5, name: 'Diwali Illustration', type: 'image', date: '24 Oct 2023', size: '11 MB' },
    { id: 6, name: 'Camera Images', type: 'image', date: '19 Oct 2023', size: '34 MB' },
    { id: 7, name: 'Presentation_Doc', type: 'pdf', date: '18 Oct 2023', size: '122 MB' }
  ];

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <div className="fileIconPdf"></div>;
      case 'folder':
        return <div className="fileIconFolder"></div>;
      case 'excel':
        return <div className="fileIconExcel"></div>;
      case 'image':
        return <div className="fileIconImage"></div>;
      default:
        return <div className="fileIcon"></div>;
    }
  };

  return (
    <div className="fileModal">
      <div className="fileModalContent">
        <div className="fileModalHeader">
          <button className="fileBackButton" onClick={onClose}>
            <ArrowLeft size={20} />
          </button>
          <h2>Recent Files</h2>
        </div>
        <div className="fileList">
          {files.map(file => (
            <div key={file.id} className="fileItem">
              {getFileIcon(file.type)}
              <div className="fileInfo">
                <div className="fileName">{file.name}</div>
                <div className="fileMeta">
                  {file.date} | {file.size}
                </div>
              </div>
              <button className="fileMoreButton">
                <MoreVertical size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileModal;

