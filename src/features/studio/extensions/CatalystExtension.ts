import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, ReactRenderer } from "@tiptap/react";
import { CatalystNodeView } from "../components/CatalystNodeView";
import suggestion, { SuggestionProps } from "@tiptap/suggestion";
import { SlashCommandList } from "../components/SlashCommandList";
import tippy, { Instance as TippyInstance } from "tippy.js";
import React from "react";
import { Car, Bike, Book, Smartphone } from "lucide-react";
import { Range, Editor } from "@tiptap/core";
import { SlashCommandItem } from "../components/SlashCommandList";

export interface CatalystOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    catalyst: {
      insertCatalyst: (category: "car" | "bike" | "book" | "mobile") => ReturnType;
    };
  }
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

export const CatalystExtension = Node.create<CatalystOptions>({
  name: "catalyst",
  group: "block",
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      category: {
        default: "car",
      },
      data: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "catalyst-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["catalyst-component", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CatalystNodeView);
  },

  addCommands() {
    return {
      insertCatalyst:
        (category: "car" | "bike" | "book" | "mobile") =>
        ({ commands }: { commands: Editor["commands"] }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { category },
          });
        },
    };
  },

  addProseMirrorPlugins() {
    if (!this.editor.isEditable) return [];

    return [
      suggestion({
        editor: this.editor,
        char: "/",
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: SlashCommandItem }) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) => {
          return [
            {
              title: "Cars (Specs)",
              description: "Insert car specifications",
              icon: React.createElement(Car, { className: "h-5 w-5" }),
              category: "Media",
              command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).insertCatalyst("car").run();
              },
            },
            {
              title: "Bikes (Specs)",
              description: "Insert bike specifications",
              icon: React.createElement(Bike, { className: "h-5 w-5" }),
              category: "Media",
              command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).insertCatalyst("bike").run();
              },
            },
            {
              title: "Books (Specs)",
              description: "Insert book specifications",
              icon: React.createElement(Book, { className: "h-5 w-5" }),
              category: "Media",
              command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).insertCatalyst("book").run();
              },
            },
            {
              title: "Mobiles (Specs)",
              description: "Insert mobile specifications",
              icon: React.createElement(Smartphone, { className: "h-5 w-5" }),
              category: "Media",
              command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).insertCatalyst("mobile").run();
              },
            },
          ].filter((item) => 
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer<{ onKeyDown: (props: { event: KeyboardEvent }) => boolean }, SuggestionProps<SlashCommandItem>>;
          let popup: TippyInstance[];

          return {
            onStart: (props: SuggestionProps<SlashCommandItem>) => {
              component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor,
              }) as ReactRenderer<{ onKeyDown: (props: { event: KeyboardEvent }) => boolean }, SuggestionProps<SlashCommandItem>>;

              if (!props.clientRect) {
                return;
              }

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect as () => DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },

            onUpdate(props: SuggestionProps<SlashCommandItem>) {
              component.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect as () => DOMRect,
              });
            },

            onKeyDown(props: { event: KeyboardEvent }) {
              if (props.event.key === "Escape") {
                popup[0].hide();
                return true;
              }

              return (component.ref as { onKeyDown: (props: { event: KeyboardEvent }) => boolean })?.onKeyDown(props);
            },

            onExit() {
              if (popup && popup[0]) {
                popup[0].destroy();
              }
              if (component) {
                component.destroy();
              }
            },
          };
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { $from, empty } = selection;
        if (!empty) return false;

        const textBefore = $from.parent.textBetween(0, $from.parentOffset);
        let category: "car" | "bike" | "book" | "mobile" | null = null;

        if (textBefore.endsWith("/cars")) category = "car";
        else if (textBefore.endsWith("/bikes")) category = "bike";
        else if (textBefore.endsWith("/books")) category = "book";
        else if (textBefore.endsWith("/mobiles")) category = "mobile";

        if (category) {
          editor.commands.deleteRange({
            from: $from.pos - `/${category}s`.length,
            to: $from.pos,
          });
          editor.commands.insertCatalyst(category);
          return true;
        }

        return false;
      },
    };
  },
});
