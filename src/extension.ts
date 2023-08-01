import * as vscode from 'vscode'
import { SidebarProvider } from './SideBarProvider'
import { spawn } from 'child_process'

let panel: vscode.WebviewPanel | undefined

export function activate (context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  )
  statusBarItem.text = 'npm-browser'
  statusBarItem.tooltip = 'Open npm-browser'
  statusBarItem.command = 'npm-browser.open'
  statusBarItem.show()

  const sidebarProvider = new SidebarProvider(context.extensionUri)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'npm-browser-sidebar',
      sidebarProvider
    )
  )
  const openTerminalCommand = vscode.commands.registerCommand(
    'npm-browser.openTerminal',
    name => {
      try {
        const terminal = vscode.window.createTerminal({
          name: 'npm install'
        })

        terminal.sendText(`npm install ${name}`)
        terminal.show(true)

        terminal.processId.then(pid => {
          console.log({ pid })

          vscode.window
            .showInformationMessage(
              `Started npm install ${name}`,
              'Show Terminal',
              'Cancel'
            )
            .then(value => {
              if (value === 'Show Terminal') {
                terminal.show(true)
              }
              if (value === 'Cancel') {
                terminal.dispose()
              }
            })
        })
      } catch (err: any) {
        vscode.window.showErrorMessage(err.message)
      }
    }
  )

  context.subscriptions.push(openTerminalCommand)

  context.subscriptions.push(statusBarItem)
}

export function deactivate () {}
