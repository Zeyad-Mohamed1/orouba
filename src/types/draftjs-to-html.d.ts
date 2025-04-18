import { RawDraftContentState } from "draft-js";

declare module "draftjs-to-html" {
  export default function draftToHtml(
    contentState: RawDraftContentState,
    hashtagConfig?: any,
    directional?: boolean,
    customEntityTransform?: any
  ): string;
}
