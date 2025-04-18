"use client";

import { useState } from "react";
import RichTextEditor from "reactjs-tiptap-editor";
import {
  BaseKit,
  BulletList,
  Bold,
  Heading,
  Italic,
} from "reactjs-tiptap-editor/extension-bundle";

import "reactjs-tiptap-editor/style.css";

const extensions = [
  Heading.configure({
    toolbar: true,
    levels: [1, 2, 3],
  }),
  Italic,
  Bold,
  BulletList,
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
];

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Editor = ({ value = "", onChange }: EditorProps) => {
  const [content, setContent] = useState(value);

  const onChangeContent = (value: any) => {
    setContent(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <RichTextEditor
      output="html"
      content={content}
      onChangeContent={onChangeContent}
      extensions={extensions}
      toolbar={{
        render: (props, toolbarItems, dom, containerDom) => {
          return containerDom(dom);
        },
      }}
    />
  );
};

export default Editor;
