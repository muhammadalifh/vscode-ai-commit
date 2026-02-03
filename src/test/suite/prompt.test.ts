import * as assert from 'assert';
import * as vscode from 'vscode';
import { buildSystemPrompt, buildUserPrompt } from '../../services/prompt';

suite('Prompt Service Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('System Prompt should contain Detailed instructions', () => {
        // This test assumes logic builds prompt based on default config (which is usually 'conventional')
        // We can verify it returns a string
		const prompt = buildSystemPrompt();
		assert.ok(prompt.length > 0);
        assert.ok(prompt.includes('expert software developer'));
	});

    test('User Prompt should format diff stats', () => {
        const diff = 'diff --git a/file.ts b/file.ts\nindex 123..456 100644\n--- a/file.ts\n+++ b/file.ts\n@@ -1 +1 @@\n-old\n+new';
        const files = ['file.ts'];
        const techStack = 'TypeScript';
        const stats = { additions: 1, deletions: 1 };

        const prompt = buildUserPrompt(diff, files, techStack, stats);
        
        assert.ok(prompt.includes('**Files Changed:** 1 file(s)'));
        assert.ok(prompt.includes('+1 additions, -1 deletions'));
        assert.ok(prompt.includes('TypeScript'));
    });
});
