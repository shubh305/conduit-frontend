import { Node, mergeAttributes, PasteRule, CommandProps } from "@tiptap/core";

/**
 * Custom Tiptap extension for Ruby (Furigana) support.
 * HTML Structure: <ruby>base text<rt>reading</rt></ruby>
 */

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    ruby: {
      setRuby: (reading: string) => ReturnType;
    };
  }
}

export const Ruby = Node.create({
  name: "ruby",
  group: "inline",
  inline: true,
  content: "text* rt",
  selectable: true,
  isolating: true,

  parseHTML() {
    return [{ tag: "ruby" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["ruby", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setRuby:
        (reading: string) =>
        ({ commands, state }: CommandProps) => {
          const { from, to } = state.selection;
          const content = state.doc.textBetween(from, to);

          return commands.insertContent({
            type: this.name,
            content: [
              ...content ? [{ type: "text", text: content }] : [],
              { type: "rt", content: [{ type: "text", text: reading }] },
            ],
          });
        },
    };
  },

  addPasteRules() {
    return [
      new PasteRule({
        find: /([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u4E00-\u9FFF]+)\(([^)]+)\)/g,
        handler: ({ state, range, match }) => {
          const { tr } = state;
          const [fullMatch, base, reading] = match;

          if (fullMatch) {
            const start = range.from;
            const end = range.to;

            tr.replaceWith(
              start,
              end,
              this.type.create(null, [
                state.schema.text(base),
                state.schema.nodes.rt.create(null, state.schema.text(reading)),
              ]),
            );

            const nextPos = start + base.length + reading.length + 2;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tr.setSelection((state.selection.constructor as any).near(tr.doc.resolve(nextPos)));
          }
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty) return false;

        const parentName = $from.parent.type.name;
        if (parentName === "ruby" || parentName === "rt") {
           const pos = parentName === "ruby" ? $from.after() : $from.after($from.depth - 1);
           return editor.chain().setTextSelection(pos).insertContent(" ").run();
        }
        
        return false;
      },
      " ": ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty) return false;

        const parentName = $from.parent.type.name;
        if (parentName === "ruby" || parentName === "rt") {
          const pos = parentName === "ruby" ? $from.after() : $from.after($from.depth - 1);
          return editor.chain().setTextSelection(pos).insertContent(" ").run();
        }
        return false;
      },
      "Shift-Enter": ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty) return false;

        if ($from.parent.type.name === this.name) {
          const pos = $from.after();
          return editor.commands.setTextSelection(pos);
        }
        return false;
      },
    };
  },
});

export const RubyText = Node.create({
  name: "rt",
  group: "inline",
  content: "text*",
  inline: true,
  selectable: false,
  isolating: true,

  parseHTML() {
    return [{ tag: "rt" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["rt", mergeAttributes(HTMLAttributes), 0];
  },
});

