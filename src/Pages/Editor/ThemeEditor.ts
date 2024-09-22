import * as monaco from 'monaco-editor';

class ThemeManager {
    static initTheme() {
        monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark', // Use the dark base
            inherit: true,
            rules: [
                { token: 'comment', foreground: '7F8C99', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'FF7AB2', fontStyle: 'bold' },
                { token: 'variable', foreground: 'FFC799' },
                { token: 'string', foreground: 'FC6A5D' },
                { token: 'number', foreground: 'A79DF8' },
                { token: 'function', foreground: 'FF816F' },
                { token: 'type', foreground: '8AD1C3' },
                { token: 'operator', foreground: 'FFFFFF' },
                { token: 'decorator', foreground: 'FD8F3F' },
                { token: 'css', foreground: 'FC5FA3' },
                { token: 'new.expr', foreground: '8AD1C3' },
                { token: 'constant', foreground: 'FFFFFF' },
                // Add other token colors based on your provided settings
            ],
            colors: {
                'editor.background': '#121316',
                'editor.foreground': '#FFFFFF',
                'editorLineNumber.foreground': '#747478',
                'editorLineNumber.activeForeground': '#FFFFFF',
                'editor.selectionBackground': '#3D4752',
                'editor.lineHighlightBackground': '#2F3239',
                'focusBorder': '#82ADF3',
                'button.background': '#3C93FD',
                'terminal.ansiBlack': '#000000',
                'terminal.ansiBrightBlack': '#666666',
                'terminal.ansiRed': '#990001',
                'terminal.ansiBrightRed': '#990001',
                'terminal.ansiGreen': '#00A600',
                'terminal.ansiBrightGreen': '#00A600',
                'terminal.ansiYellow': '#999900',
                'terminal.ansiBrightYellow': '#999900',
                'terminal.ansiBlue': '#0001B2',
                'terminal.ansiBrightBlue': '#0001B2',
                'terminal.ansiMagenta': '#B301B2',
                'terminal.ansiBrightMagenta': '#B301B2',
                'terminal.ansiCyan': '#01A6B2',
                'terminal.ansiBrightCyan': '#01A6B2',
                'terminal.ansiWhite': '#BFBFBF',
                'terminal.ansiBrightWhite': '#FFFFFF',
                // Add more colors based on your provided settings
            }
        });
    }

    static setTheme() {
        monaco.editor.setTheme("custom-dark");
    }
}

export default ThemeManager;
