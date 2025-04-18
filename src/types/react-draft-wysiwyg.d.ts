import { EditorState } from "draft-js";
import React from "react";

declare module "react-draft-wysiwyg" {
  export interface EditorProps {
    editorState?: EditorState;
    onEditorStateChange?: (editorState: EditorState) => void;
    onContentStateChange?: (contentState: any) => void;
    toolbarClassName?: string;
    wrapperClassName?: string;
    editorClassName?: string;
    toolbar?: any;
    toolbarOnFocus?: boolean;
    toolbarHidden?: boolean;
    locale?: string;
    localization?: {
      [key: string]: any;
    };
    editorStyle?: React.CSSProperties;
    toolbarStyle?: React.CSSProperties;
    mention?: any;
    hashtag?: any;
    textAlignment?: "left" | "center" | "right";
    readOnly?: boolean;
    tabIndex?: number;
    placeholder?: string;
    ariaLabel?: string;
    ariaOwneeID?: string;
    ariaActiveDescendantID?: string;
    ariaAutoComplete?: string;
    ariaExpanded?: boolean;
    ariaHasPopup?: boolean;
    customBlockRenderFunc?: (block: any) => any;
    wrapperId?: number;
    customDecorators?: any[];
    handleKeyCommand?: (command: string, editorState: EditorState) => boolean;
    handlePastedText?: (
      text: string,
      html: string,
      editorState: EditorState
    ) => boolean;
    stripPastedStyles?: boolean;
  }

  export class Editor extends React.Component<EditorProps> {}
}
