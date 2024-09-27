import * as monaco from 'monaco-editor'; // Ensure Monaco is imported
import ThemeEditor from './ThemeEditor';

export default class MonacoEditorManager {
    private editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
    private readonly container: HTMLElement;
    private readonly defaultLanguage: string;
    private readonly defaultValue: string;

    constructor(container: HTMLElement, defaultLanguage: string = 'python', defaultValue: string = '// Start coding here') {
        this.container = container;
        this.defaultLanguage = defaultLanguage;
        this.defaultValue = defaultValue;
    }

    // Method to initialize the Monaco editor
    initEditor(onChangeCallback: (value: string) => void) {
        if (!this.container) throw new Error('Editor container not found');

        this.editorInstance = monaco.editor.create(this.container, {
            value: this.defaultValue,
            language: this.defaultLanguage,
            automaticLayout: true, // Ensures the editor resizes correctly
            minimap: { enabled: false },
            fontSize: 15
        });

        // Apply the custom theme if necessary
        ThemeEditor.initTheme();
        this.setTheme();

        // Listen for content changes in the editor and invoke the callback
        this.editorInstance.onDidChangeModelContent(() => {
            const updatedCode = this.getCode();
            onChangeCallback(updatedCode); // Notify changes to Editor component
        });
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
    public setCode(code: string): void {
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

    public getSelected(): string {
        const selection = this.editorInstance?.getSelection()
        if (selection) {
            return this.editorInstance?.getModel()?.getValueInRange(selection) || '';
        } else {
            return '';
        }
    }
}
