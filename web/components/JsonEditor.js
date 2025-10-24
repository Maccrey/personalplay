import { useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function JsonEditor({ value, onSave }) {
  const [content, setContent] = useState(JSON.stringify(value, null, 2));

  const handleChange = (newValue) => {
    setContent(newValue);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(content);
      onSave(parsed);
    } catch (err) {
      alert("JSON 형식이 올바르지 않습니다");
    }
  };

  return (
    <div className="json-editor-wrapper">
      <Editor
        height="70vh"
        defaultLanguage="json"
        value={content}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
        }}
      />
      <button className="save-button" onClick={handleSave}>
        저장
      </button>
      <style jsx>{`
        .json-editor-wrapper {
          margin: 1rem 0;
        }
        .save-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .save-button:hover {
          background: #0051cc;
        }
      `}</style>
    </div>
  );
}
