import { commands, ExtensionContext } from 'vscode'
import { App } from './app'

export function activate(context: ExtensionContext): void {
    const app = new App(context)
    context.subscriptions.push(commands.registerCommand('asurance.vscodeFileSharer', app.active))
}