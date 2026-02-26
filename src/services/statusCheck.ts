/**
 * Provider Status Check
 * Tests API key validity by making minimal requests to each provider
 */
import * as vscode from 'vscode';
import { getAvailableProviders, AIProvider } from '../providers';

interface ProviderStatus {
  provider: AIProvider;
  status: 'ok' | 'error';
  latency: number;
  message: string;
}

/**
 * Check all configured providers and show results
 */
export async function checkProviderStatus(): Promise<void> {
  const available = getAvailableProviders();

  if (available.length === 0) {
    const action = await vscode.window.showWarningMessage(
      'No API keys configured. Add at least one provider key first.',
      'Manage Keys'
    );
    if (action === 'Manage Keys') {
      vscode.commands.executeCommand('aiCommit.manageKeys');
    }
    return;
  }

  // Test each provider with progress
  const results: ProviderStatus[] = [];

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Checking Provider Status',
      cancellable: true
    },
    async (progress, token) => {
      for (let i = 0; i < available.length; i++) {
        const provider = available[i];

        if (token.isCancellationRequested) { break; }

        progress.report({
          message: `Testing ${provider.name}... (${i + 1}/${available.length})`,
          increment: (100 / available.length)
        });

        const start = Date.now();
        try {
          await provider.call(
            'You are a helpful assistant.',
            'Reply with exactly: OK'
          );
          const latency = Date.now() - start;
          results.push({
            provider,
            status: 'ok',
            latency,
            message: `Working (${(latency / 1000).toFixed(1)}s)`
          });
        } catch (error) {
          const latency = Date.now() - start;
          const errMsg = error instanceof Error ? error.message : 'Unknown error';

          let friendlyMsg = errMsg;
          if (errMsg.includes('401') || errMsg.includes('Unauthorized')) {
            friendlyMsg = 'Invalid API key';
          } else if (errMsg.includes('429') || errMsg.toLowerCase().includes('rate')) {
            friendlyMsg = 'Rate limited';
          } else if (errMsg.includes('timeout') || errMsg.includes('ECONNREFUSED')) {
            friendlyMsg = 'Connection timeout';
          }

          results.push({
            provider,
            status: 'error',
            latency,
            message: friendlyMsg
          });
        }
      }
    }
  );

  if (results.length === 0) { return; }

  // Show results in QuickPick
  const items: vscode.QuickPickItem[] = results.map(r => ({
    label: `${r.status === 'ok' ? '$(pass-filled)' : '$(error)'} ${r.provider.name}`,
    description: r.message,
    detail: r.status === 'ok'
      ? `Latency: ${r.latency}ms — Ready to use`
      : `Failed after ${r.latency}ms`
  }));

  // Add summary at top
  const okCount = results.filter(r => r.status === 'ok').length;
  const totalCount = results.length;

  items.unshift({
    label: `$(info) Summary: ${okCount}/${totalCount} providers working`,
    description: '',
    kind: vscode.QuickPickItemKind.Separator
  });

  await vscode.window.showQuickPick(items, {
    placeHolder: `${okCount}/${totalCount} providers are working`,
    title: '🩺 Provider Status Check'
  });
}
