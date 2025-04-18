import { ContentBlock } from "draft-js";

declare module "html-to-draftjs" {
  interface ConvertedHTML {
    contentBlocks: ContentBlock[];
    entityMap: { [key: string]: any };
  }

  export default function htmlToDraft(html: string): ConvertedHTML;
}
