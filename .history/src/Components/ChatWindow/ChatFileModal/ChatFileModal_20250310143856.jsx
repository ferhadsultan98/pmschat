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

// src/components/FileModal/FileModal.scss
.fileModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .fileModalContent {
    width: 400px;
    max-height: 80vh;
    background-color: #1a1a1a;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    .fileModalHeader {
      padding: 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #2a2a2a;
      
      .fileBackButton {
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        color: #8a8a8a;
        margin-right: 16px;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          color: #ffffff;
        }
      }
      
      h2 {
        font-size: 16px;
        font-weight: 600;
      }
    }
    
    .fileList {
      overflow-y: auto;
      
      .fileItem {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #2a2a2a;
        cursor: pointer;
        
        &:hover {
          background-color: #222;
        }
        
        .fileIconPdf, .fileIconFolder, .fileIconExcel, .fileIconImage, .fileIcon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .fileIconPdf {
          background-color: #FF5252;
        }
        
        .fileIconFolder {
          background-color: #FFA726;
        }
        
        .fileIconExcel {
          background-color: #66BB6A;
        }
        
        .fileIconImage {
          background-color: #EC407A;
        }
        
        .fileInfo {
          flex: 1;
          
          .fileName {
            font-size: 14px;
            font-weight: 500;
          }
          
          .fileMeta {
            font-size: 12px;
            color: #8a8a8a;
            margin-top: 4px;
          }
        }
        
        .fileMoreButton {
          background: none;
          border: none;
          outline: none;
          cursor: pointer;
          color: #8a8a8a;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:hover {
            color: #ffffff;
          }
        }
      }
    }
  }
}