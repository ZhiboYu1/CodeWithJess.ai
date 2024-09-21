import * as monaco from 'monaco-editor'; // Ensure Monaco is imported
import ThemeEditor from './ThemeEditor';

export default class MonacoEditorManager {
    private editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
    private container: HTMLElement;
    private defaultLanguage: string;
    private defaultValue: string;

    constructor(container: HTMLElement, defaultLanguage: string = 'python', defaultValue: string = '// Start coding here') {
        this.container = container;
        this.defaultLanguage = defaultLanguage;
        this.defaultValue = defaultValue;
    }

    // Method to initialize the Monaco editor
    initEditor() {
        if (!this.container) throw new Error('Editor container not found');

        this.editorInstance = monaco.editor.create(this.container, {
            value: this.defaultValue,
            language: this.defaultLanguage,
            automaticLayout: true, // Ensures the editor resizes correctly
            minimap: { enabled: false }
        });

        // Apply the custom theme if necessary
        ThemeEditor.initTheme();
        this.setTheme()
    }

    // Method to set a theme
    setTheme() {
        ThemeEditor.setTheme()
    }

    // Method to get the current code from the editor
    getCode(): string {
        return this.editorInstance?.getValue() || '';
    }

    // Method to set new code content
    setCode(code: string) {
        this.editorInstance?.setValue(code);
    }

    // Method to handle selection changes
    onSelectionChange(callback: (selection: string) => void) {
        this.editorInstance?.onDidChangeCursorSelection((event) => {
            const selectedText = this.editorInstance?.getModel()?.getValueInRange(event.selection) || '';
            callback(selectedText);
        });
    }

    // Clean up when unmounting or closing the editor
    disposeEditor() {
        this.editorInstance?.dispose();
    }
}