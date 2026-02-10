/**
 * AI Commit Message Generator - VSCode Extension
 * Main entry point
 */
import * as vscode from 'vscode';
import { callWithFallback } from './providers';
import { getStagedDiff, getStagedFiles, getUnstagedDiff, getUnstagedFiles, stageAllChanges, detectTechStack, getDiffStats } from './services/git';
import { buildSystemPrompt, buildUserPrompt } from './services/prompt';
import { hasAnyProvider } from './config';

/** QuickPick item with custom action property */
interface ActionQuickPickItem extends vscode.QuickPickItem {
  action: string;
}

/** QuickPick item with repository index */
interface RepoQuickPickItem extends vscode.QuickPickItem {
  index: number;
}

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('AI Commit Generator is now active!');
  
  // Register the main command
  const generateCommand = vscode.commands.registerCommand(
    'aiCommit.generate',
    generateCommitMessage
  );
  
  context.subscriptions.push(generateCommand);
}

/**
 * Main command handler - Generate commit message
 */
async function generateCommitMessage() {
  // Check if any provider is configured
  if (!hasAnyProvider()) {
    const action = await vscode.window.showErrorMessage(
      'No AI provider configured. Please set at least one API key in settings.',
      'Open Settings'
    );
    
    if (action === 'Open Settings') {
      vscode.commands.executeCommand('workbench.action.openSettings', 'aiCommit');
    }
    return;
  }
  
  // Show progress
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'AI Commit Generator',
      cancellable: true
    },
    async (progress, token) => {
      try {
        // Step 1: Get staged changes
        progress.report({ message: 'Reading staged changes...' });
        
        let [diff, files] = await Promise.all([
          getStagedDiff(),
          getStagedFiles()
        ]);
        
        let changeSource: 'staged' | 'unstaged' | 'auto-staged' = 'staged';
        
        // If no staged changes, check for unstaged and prompt user
        if (!diff || files.length === 0) {
          const [unstagedDiff, unstagedFiles] = await Promise.all([
            getUnstagedDiff(),
            getUnstagedFiles()
          ]);
          
          if (!unstagedDiff || unstagedFiles.length === 0) {
            vscode.window.showWarningMessage(
              'No changes found (staged or unstaged) to generate a commit message.'
            );
            return;
          }
          
          // Show Quick Pick dialog for user to choose
          const choice = await vscode.window.showQuickPick<ActionQuickPickItem>(
            [
              {
                label: '$(add) Stage All & Generate',
                description: `Stage all ${unstagedFiles.length} changed file(s) and generate commit message`,
                action: 'stage-all'
              },
              {
                label: '$(edit) Use Unstaged Changes',
                description: 'Generate commit message from unstaged changes (without staging)',
                action: 'use-unstaged'
              },
              {
                label: '$(close) Cancel',
                description: 'Do nothing',
                action: 'cancel'
              }
            ],
            {
              placeHolder: `No staged changes found. ${unstagedFiles.length} unstaged file(s) detected. What would you like to do?`,
              title: 'AI Commit Generator — No Staged Changes'
            }
          );
          
          if (!choice || choice.action === 'cancel') {
            return;
          }
          
          if (choice.action === 'stage-all') {
            // Auto-stage all changes
            progress.report({ message: 'Staging all changes...' });
            await stageAllChanges();
            
            // Re-read staged changes after staging
            [diff, files] = await Promise.all([
              getStagedDiff(),
              getStagedFiles()
            ]);
            changeSource = 'auto-staged';
            
            if (!diff || files.length === 0) {
              vscode.window.showWarningMessage(
                'No changes found after staging. Nothing to generate.'
              );
              return;
            }
          } else {
            // Use unstaged changes
            diff = unstagedDiff;
            files = unstagedFiles;
            changeSource = 'unstaged';
          }
        }
        
        if (token.isCancellationRequested) {
          return;
        }
        
        // Step 2: Analyze context
        progress.report({ message: 'Analyzing changes...' });
        
        const techStack = detectTechStack(files);
        const stats = getDiffStats(diff);
        
        // Step 3: Build prompts
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(diff, files, techStack, stats);
        
        if (token.isCancellationRequested) {
          return;
        }
        
        // Step 4: Call AI with fallback
        progress.report({ message: 'Generating commit message...' });
        
        const { response, provider } = await callWithFallback(
          systemPrompt,
          userPrompt,
          (msg) => progress.report({ message: msg })
        );
        
        if (token.isCancellationRequested) {
          return;
        }
        
        // Step 5: Clean up the response
        let commitMessage = response.trim();
        
        // Remove markdown code blocks if present
        if (commitMessage.startsWith('```')) {
          commitMessage = commitMessage
            .replace(/^```[\w]*\n?/, '')
            .replace(/\n?```$/, '')
            .trim();
        }
        
        // Step 6: Direct Fill or Copy
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        
        // Build source label
        let sourceLabel = '';
        if (changeSource === 'unstaged') {
          sourceLabel = ' (from unstaged)';
        } else if (changeSource === 'auto-staged') {
          sourceLabel = ' (auto-staged)';
        }
        
        if (gitExtension) {
          const git = gitExtension.exports.getAPI(1);
          if (git.repositories.length > 1) {
            // Multiple repositories — let user pick
            const repoItems: RepoQuickPickItem[] = git.repositories.map((repo: any, index: number) => ({
              label: repo.rootUri.fsPath.split(/[\\/]/).pop() || `Repository ${index + 1}`,
              description: repo.rootUri.fsPath,
              index
            }));
            
            const selected = await vscode.window.showQuickPick<RepoQuickPickItem>(repoItems, {
              placeHolder: 'Select which repository to use',
              title: 'Multiple Repositories Detected'
            });
            
            if (!selected) {
              await vscode.env.clipboard.writeText(commitMessage);
              vscode.window.showInformationMessage('Cancelled. Commit message copied to clipboard.');
              return;
            }
            
            const selectedRepo = git.repositories[selected.index];
            
            selectedRepo.inputBox.value = commitMessage;
            vscode.window.showInformationMessage(
              `Commit message generated by ${provider.name}${sourceLabel}`
            );
          } else if (git.repositories.length === 1) {
            const repo = git.repositories[0];
            repo.inputBox.value = commitMessage;
            
            vscode.window.showInformationMessage(
              `Commit message generated by ${provider.name}${sourceLabel}`
            );
          } else {
             await vscode.env.clipboard.writeText(commitMessage);
             vscode.window.showInformationMessage('No active repository found. Copied to clipboard instead.');
          }
        } else {
          await vscode.env.clipboard.writeText(commitMessage);
          vscode.window.showInformationMessage('Git extension not found. Copied to clipboard.');
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('No workspace')) {
          vscode.window.showErrorMessage('Please open a folder with a git repository first.');
        } else if (errorMessage.includes('not a git repository')) {
          vscode.window.showErrorMessage('This folder is not a git repository.');
        } else {
          vscode.window.showErrorMessage(`Failed to generate commit message: ${errorMessage}`);
        }
      }
    }
  );
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('AI Commit Generator deactivated');
}
