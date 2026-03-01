import Image from "@tiptap/extension-image";

export const AlignedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        parseHTML: element => element.getAttribute("data-align") || "center",
        renderHTML: attributes => {
          return {
            "data-align": attributes.align,
            style: `display: block; margin-left: ${
              attributes.align === "left" ? "0" : attributes.align === "right" ? "auto" : "auto"
            }; margin-right: ${
              attributes.align === "right" ? "0" : attributes.align === "left" ? "auto" : "auto"
            };`,
          };
        },
      },
    };
  },
});
