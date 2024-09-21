import * as monaco from 'monaco-editor';

class ThemeManager {
    static initTheme() {
        monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: 'c7c7c7', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'ff007f' },
                { token: 'number', foreground: 'f78c6c' },
                { token: 'string', foreground: 'ffd866' },
                { token: 'variable', foreground: '9effff' },
                { token: 'type', foreground: 'ff9acd' },
                { token: 'function', foreground: 'c792ea' },
                { token: 'delimiter', foreground: 'a6accd' },
                { token: 'operator', foreground: '89ddff' },
                { token: 'tag', foreground: 'ff6188' },
                { token: 'attribute', foreground: 'ffd700' },
                { token: 'type.identifier', foreground: '82aaff' },
                { token: 'attribute.value', foreground: 'ffcb6b' },
                { token: 'text', foreground: 'd4d4d4' }
            ],
            colors: {
                'editor.background': '#1e1e1e',
                'editor.lineHighlightBackground': '#333333',
                'editorCursor.foreground': '#ffcc00',
                //'editor.foreground': '#d4d4d4',
                'editorIndentGuide.background': '#444444',
                'editorLineNumber.foreground': '#858585',
                'editorLineNumber.activeForeground': '#ffffff',
                'editor.selectionBackground': '#3e3e3e',
                'editor.inactiveSelectionBackground': '#2e2e2e',
                'editorBracketMatch.background': '#2b313a',
                'editorBracketMatch.border': '#ff007f',
                'editorWhitespace.foreground': '#3b3b3b',
                'editorCursor.background': '#1e1e1e'
            }
        });
    }

    static setTheme() {
        monaco.editor.setTheme("custom-dark");
    }
}

export default ThemeManager;
