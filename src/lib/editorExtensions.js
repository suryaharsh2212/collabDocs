import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

export const LineHeight = Extension.create({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: 'normal',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: element => element.style.lineHeight || this.options.defaultLineHeight,
            renderHTML: attributes => {
              if (attributes.lineHeight === this.options.defaultLineHeight) {
                return {};
              }

              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight: lineHeight => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { lineHeight }));
      },
      unsetLineHeight: () => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { lineHeight: this.options.defaultLineHeight }));
      },
    };
  },
});

export const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      minIndent: 0,
      maxIndent: 256,
      step: 32,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: element => parseInt(element.style.marginLeft, 10) || 0,
            renderHTML: attributes => {
              if (!attributes.indent) {
                return {};
              }

              return {
                style: `margin-left: ${attributes.indent}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            const indent = Math.min((node.attrs.indent || 0) + this.options.step, this.options.maxIndent);
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent });
          }
        });
        if (dispatch) dispatch(tr);
        return true;
      },
      outdent: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            const indent = Math.max((node.attrs.indent || 0) - this.options.step, this.options.minIndent);
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent });
          }
        });
        if (dispatch) dispatch(tr);
        return true;
      },
    };
  },
});

export const ParagraphSpacing = Extension.create({
  name: 'paragraphSpacing',

  addOptions() {
    return {
      types: ['paragraph'],
      defaultSpacing: '0px',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          paddingBottom: {
            default: this.options.defaultSpacing,
            parseHTML: element => element.style.paddingBottom || this.options.defaultSpacing,
            renderHTML: attributes => {
              if (attributes.paddingBottom === this.options.defaultSpacing) {
                return {};
              }

              return {
                style: `padding-bottom: ${attributes.paddingBottom}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setParagraphSpacing: paddingBottom => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { paddingBottom }));
      },
    };
  },
});

export const GlobalAlignment = Extension.create({
  name: 'globalAlignment',

  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph', 'image', 'table'],
        attributes: {
          textAlign: {
            default: 'left',
            parseHTML: element => element.style.textAlign || 'left',
            renderHTML: attributes => {
              if (!attributes.textAlign || attributes.textAlign === 'left') {
                return {};
              }

              return {
                style: `text-align: ${attributes.textAlign}`,
              };
            },
          },
        },
      },
    ];
  },
});
