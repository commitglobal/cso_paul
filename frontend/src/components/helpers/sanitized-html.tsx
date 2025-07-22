import sanitizeHtml, { type IOptions } from "sanitize-html";
import React from "react";

const defaultOptions: IOptions = {
  allowedTags: ["b", "i", "em", "strong", "a"],
  allowedAttributes: {
    a: ["href"],
  },
  allowedIframeHostnames: [""],
};

type SanitizeHTMLProps = {
  html: string;
  options?: IOptions;
};

const sanitize = (dirty: string, options?: IOptions) => ({
  __html: sanitizeHtml(dirty, { ...defaultOptions, ...options }),
});

const SanitizeHTML: React.FC<SanitizeHTMLProps> = ({ html, options }) => (
  <div dangerouslySetInnerHTML={sanitize(html, options)} />
);

export { SanitizeHTML };
