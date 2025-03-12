# Commit After Publish

A VS Code extension that automatically triggers GitHub Copilot to generate a commit message after successfully publishing your extension to the VS Code Marketplace.

## Features

- Automatically generates commit messages using GitHub Copilot after successful extension publishing
- Configurable task detection for different publishing workflows
- Works with both custom tasks and npm scripts

## How It Works

The extension monitors VS Code tasks and when a configured publishing task completes successfully:

1. Waits for a short cooldown period (1 second)
2. Triggers GitHub Copilot to generate a commit message
3. Shows a success notification when complete

## Requirements

- Visual Studio Code
- GitHub Copilot extension
- Git repository

## Configuration

This extension contributes the following settings:

```jsonc
{
  "commit-after-publish.enabled": {
    "type": "boolean",
    "default": true,
    "description": "Enable/disable automatic commit message generation after publishing"
  },
  "commit-after-publish.taskNames": {
    "type": "array",
    "default": ["publish", "vsce publish"],
    "description": "List of task names that trigger commit message generation"
  }
}
```

### Settings Explained

- `commit-after-publish.enabled`: Toggle the extension on/off without uninstalling
- `commit-after-publish.taskNames`: Array of task names that should trigger the commit message generation. The extension checks both task names and npm script names against this list.

## Usage

1. Configure your publishing tasks in `tasks.json`
2. Add the task names to the `commit-after-publish.taskNames` setting
3. Run your publish task
4. The extension will automatically trigger GitHub Copilot to generate a commit message after successful publishing

### Example tasks.json Configuration

```jsonc
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Publish Extension",
      "type": "shell",
      "command": "vsce publish"
    }
  ]
}
```

## Troubleshooting

If commit messages aren't being generated:

1. Verify the extension is enabled in settings
2. Check that your task name is included in `commit-after-publish.taskNames`
3. Ensure GitHub Copilot is installed and properly configured
4. Check the VS Code output panel for any error messages
