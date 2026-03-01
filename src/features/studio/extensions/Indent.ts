import { Extension } from "@tiptap/core";

export interface IndentOptions {
  types: string[];
  indentRange: number;
  minIndent: number;
  maxIndent: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      /**
       * Set the indent attribute
       */
      indent: () => ReturnType;
      /**
       * Set the outdent attribute
       */
      outdent: () => ReturnType;
    };
  }
}

export const Indent = Extension.create<IndentOptions>({
  name: "indent",

  addOptions() {
    return {
      types: ["paragraph", "heading", "blockquote", "bulletList", "orderedList"],
      indentRange: 24,
      minIndent: 0,
      maxIndent: 120,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: element => {
              const paddingLeft = element.style.paddingLeft || "0";
              return parseInt(paddingLeft, 10) || 0;
            },
            renderHTML: attributes => {
              if (attributes.indent === 0) {
                return {};
              }

              return {
                style: `padding-left: ${attributes.indent}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);
          tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const indent = (node.attrs.indent || 0) + this.options.indentRange;
              if (indent <= this.options.maxIndent) {
                tr = tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent,
                });
              }
              return false;
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);
          tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const indent = (node.attrs.indent || 0) - this.options.indentRange;
              if (indent >= this.options.minIndent) {
                tr = tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent,
                });
              }
              return false;
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive("bulletList") || this.editor.isActive("orderedList")) {
          return this.editor.commands.sinkListItem("listItem");
        }
        return this.editor.commands.indent();
      },
      "Shift-Tab": () => {
        if (this.editor.isActive("bulletList") || this.editor.isActive("orderedList")) {
          return this.editor.commands.liftListItem("listItem");
        }
        return this.editor.commands.outdent();
      },
      Backspace: () => {
        const { selection } = this.editor.state;
        if (!selection.empty || selection.from !== selection.$from.start()) {
          return false;
        }

        const node = selection.$from.node();
        if (node.attrs.indent > 0) {
          return this.editor.commands.outdent();
        }

        return false;
      },
      "Alt-ArrowRight": () => this.editor.commands.indent(),
      "Alt-ArrowLeft": () => this.editor.commands.outdent(),
    };
  },
});
