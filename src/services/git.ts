/**
 * Git Service
 * Handles git operations like reading staged changes
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';

const execAsync = promisify(exec);

/**
 * Get the current workspace folder path
 */
function getWorkspacePath(): string {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error('No workspace folder open');
  }
  return workspaceFolders[0].uri.fsPath;
}


/**
 * Get diff of staged changes
 */
export async function getStagedDiff(): Promise<string> {
  const cwd = getWorkspacePath();
  
  try {
    const { stdout } = await execAsync('git diff --cached', { cwd, maxBuffer: 1024 * 1024 });
    return stdout.trim();
  } catch (error) {
    throw new Error(`Failed to get staged diff: ${(error as Error).message}`);
  }
}

/**
 * Get diff of unstaged changes
 */
export async function getUnstagedDiff(): Promise<string> {
  const cwd = getWorkspacePath();
  
  try {
    const { stdout } = await execAsync('git diff', { cwd, maxBuffer: 1024 * 1024 });
    return stdout.trim();
  } catch (error) {
    throw new Error(`Failed to get unstaged diff: ${(error as Error).message}`);
  }
}

/**
 * Get list of staged files
 */
export async function getStagedFiles(): Promise<string[]> {
  const cwd = getWorkspacePath();
  
  try {
    const { stdout } = await execAsync('git diff --cached --name-only', { cwd });
    return stdout.trim().split('\n').filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to get staged files: ${(error as Error).message}`);
  }
}

/**
 * Get list of unstaged files
 */
export async function getUnstagedFiles(): Promise<string[]> {
  const cwd = getWorkspacePath();
  
  try {
    const { stdout } = await execAsync('git diff --name-only', { cwd });
    return stdout.trim().split('\n').filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to get unstaged files: ${(error as Error).message}`);
  }
}

/**
 * Detect tech stack based on file extensions
 */
export function detectTechStack(files: string[]): string {
  const extensions = new Set(files.map(f => {
    const parts = f.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
  }));
  
  // Detection logic
  if (extensions.has('.tsx') || extensions.has('.jsx')) {
    if (files.some(f => f.includes('next.config') || f.includes('app/') || f.includes('pages/'))) {
      return 'Next.js (React)';
    }
    return 'React';
  }
  
  if (extensions.has('.ts') || extensions.has('.js')) {
    if (files.some(f => f.includes('nuxt.config'))) {
      return 'Nuxt.js (Vue)';
    }
    return 'Node.js / TypeScript';
  }
  
  if (extensions.has('.vue')) {
    return 'Vue.js';
  }
  
  if (extensions.has('.py')) {
    if (files.some(f => f.toLowerCase().includes('fastapi') || f.includes('app/api'))) {
      return 'FastAPI (Python)';
    }
    if (files.some(f => f.toLowerCase().includes('django') || f.includes('manage.py'))) {
      return 'Django (Python)';
    }
    return 'Python';
  }
  
  if (extensions.has('.php')) {
    if (files.some(f => f.toLowerCase().includes('laravel') || f.includes('artisan'))) {
      return 'Laravel (PHP)';
    }
    return 'PHP';
  }
  
  if (extensions.has('.go')) {
    return 'Go';
  }
  
  if (extensions.has('.rs')) {
    return 'Rust';
  }
  
  if (extensions.has('.java') || extensions.has('.kt')) {
    return 'Java/Kotlin';
  }
  
  return 'General';
}

/**
 * Get summary stats of the diff
 */
export function getDiffStats(diff: string): { additions: number; deletions: number } {
  const lines = diff.split('\n');
  let additions = 0;
  let deletions = 0;
  
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      additions++;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      deletions++;
    }
  }
  
  return { additions, deletions };
}
