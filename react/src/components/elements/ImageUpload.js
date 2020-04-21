import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import FormData from 'form-data';
import { Backend } from "../../utils";
import "./ImageUpload.scss";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  maxHeight: "400px",
  overflowY: "scroll",
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "block",
  minWidth: 0,
  overflow: "hidden",
  textAlign: "center",
};

const img = {
  display: "inline-block",
  width: "auto",
  height: "100%",
};


function ImageUpload(props) {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file),
      })));

      acceptedFiles.forEach((file) => {
        let data = new FormData();
        data.append('media', file, file.fileName);

        Backend.postMedia(props.projectId, data).then((response) => {
          // TODO remove console.log
          console.log(response);
          props.callback(response);
        }).catch((error) => {
          // TODO handle error
        });
      });
    },
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          alt="File Preview"
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or <u>click to select files</u></p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  );
}


export default ImageUpload;
