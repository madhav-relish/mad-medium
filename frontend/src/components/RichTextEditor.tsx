import { RichTextEditor, Link } from '@mantine/tiptap';
import { BubbleMenu, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';
import { IconPhoto, IconDeviceDesktop, IconFlame, IconBulb } from '@tabler/icons-react';

interface CustomTextEditorProps {
  content: string;
  setContent: Function;
}

export function CustomTextEditor({ content, setContent }: CustomTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your case study blog here...' }),
    ],
    content,
  });

  const html = editor?.getHTML();

  useEffect(() => {
    setContent((prev: any) => ({ ...prev, content: html }));
  }, [html]);

  const addImageOrGif = () => {
    const url = window.prompt('Enter Image or GIF URL (or paste Base64 Data URL):');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertSandboxShortcode = () => {
    if (editor) {
      editor.chain().focus().insertContent('<p>[WIDGET:CANVAS_SANDBOX]</p>').run();
    }
  };

  const insertVisualizerShortcode = () => {
    if (editor) {
      editor.chain().focus().insertContent('<p>[WIDGET:ARCHITECTURE_VISUALIZER]</p>').run();
    }
  };

  const insertCalloutNote = () => {
    if (editor) {
      editor.chain().focus().insertContent('<blockquote>[DEEP DIVE] Add architectural insight here...</blockquote>').run();
    }
  };

  return (
    <RichTextEditor
      classNames={{
        root: 'max-h-[600px] overflow-y-auto border border-slate-700 rounded-lg shadow-sm',
      }}
      editor={editor}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={0}>
        <BubbleMenu editor={editor}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
          </RichTextEditor.ControlsGroup>
        </BubbleMenu>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.CodeBlock />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        {/* Case Study Custom Helpers */}
        <RichTextEditor.ControlsGroup>
          <button
            type="button"
            onClick={addImageOrGif}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 flex items-center gap-1 text-xs"
            title="Insert Image or GIF Demo"
          >
            <IconPhoto size={16} className="text-amber-400" />
            <span>Image/GIF</span>
          </button>
          <button
            type="button"
            onClick={insertSandboxShortcode}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 flex items-center gap-1 text-xs"
            title="Embed Canvas Sandbox Widget"
          >
            <IconFlame size={16} className="text-blue-400" />
            <span>Live Sandbox</span>
          </button>
          <button
            type="button"
            onClick={insertVisualizerShortcode}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 flex items-center gap-1 text-xs"
            title="Embed Architecture Motion Visualizer"
          >
            <IconDeviceDesktop size={16} className="text-indigo-400" />
            <span>Motion Flow</span>
          </button>
          <button
            type="button"
            onClick={insertCalloutNote}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 flex items-center gap-1 text-xs"
            title="Insert Callout Note"
          >
            <IconBulb size={16} className="text-emerald-400" />
            <span>Callout</span>
          </button>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}