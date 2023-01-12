import * as vscode from 'vscode';
import { GitExtension, Repository } from './api/git';
import emojis from './api/git_emoji_es';
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.gitEmoji.es', (uri?) => {
		const git = getGitExtension();
		if (!git) {
			vscode.window.showErrorMessage('unable to load Git Extension');
			return;
		}
		// init pick items
		let items = [];
		for (let i = 0; i < emojis.length; i++) {
			items.push({ label: `${emojis[i].emoji} ${emojis[i].description}`, code: emojis[i].code, description: '['+ emojis[i].name + ']' });
		}
		vscode.window.showQuickPick(items).then(function (selected?) {
			if (selected) {
				vscode.commands.executeCommand('workbench.view.scm');
				if (uri) {
					let selectedRepository = git.repositories.find(repository => {
						return repository.rootUri.path === uri.rootUri.path;
					});
					if (selectedRepository) {
						prefixCommit(selectedRepository, selected.code);
					}
				} else {
					for (let repo of git.repositories) {
						prefixCommit(repo, selected.code);
					}
				}
			}
		});
	});
	context.subscriptions.push(disposable);
}
function prefixCommit(repository: Repository, prefix: String) {
	repository.inputBox.value = `${prefix} ${repository.inputBox.value}`;
}
function getGitExtension() {
	const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git');
	const gitExtension = vscodeGit && vscodeGit.exports;
	return gitExtension && gitExtension.getAPI(1);
}
// this method is called when your extension is deactivated
export function deactivate() { }
