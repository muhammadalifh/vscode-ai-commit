# How to Publish VSCode Extension

## Prerequisites
1. **Azure DevOps Account**: You need a Microsoft account.
2. **Publisher ID**: You need to create a publisher on the Marketplace.

## Step 1: Create a Publisher
1. Go to [Visual Studio Marketplace Management](https://marketplace.visualstudio.com/manage).
2. Login with your Microsoft account.
3. Click "Create publisher".
4. Enter a unique ID (e.g., `muhammadalifh`) and name. 
   - *Note: This ID must match the `publisher` field in your `package.json`.*

## Step 2: Install VSCE Tool
Install the Visual Studio Code Extensions CLI globally:
```bash
npm install -g @vscode/vsce
```

## Step 3: Login to VSCE
You need a Personal Access Token (PAT) from Azure DevOps.
1. Go to [Azure DevOps](https://dev.azure.com/).
2. User Settings (top right) -> **Personal Access Tokens**.
3. Create New Token:
   - Name: `vsce`
   - Organization: `All accessible organizations`
   - Scopes: `Marketplace > Manage` (Select 'All scopes' if you can't find it, or look for specific Marketplace write access).
4. Copy the token.

Login in terminal:
```bash
vsce login <your-publisher-id>
# Paste the token when asked
```

## Step 4: Package & Publish

### Option A: Create .vsix File (For manual install)
If you just want to share the file without publishing to the store:
```bash
vsce package
```
This creates a `.vsix` file. You can install it in VSCode via "Extensions: Install from VSIX...".

### Option B: Publish to Marketplace
To make it available for everyone:
```bash
vsce publish
```
*Note: It may take a few minutes for the extension to appear in search.*

## Step 5: Verify
Visit `https://marketplace.visualstudio.com/items?itemName=<publisher>.<extension-name>`
