const vscode = require("vscode");

/**
 * Extension activation handler
 * @param {vscode.ExtensionContext} context - Extension context
 */
function activate(context) {
  console.log("Activating commit-after-publish extension");

  try {
    registerTaskEvents(context);
    console.log("Commit-after-publish extension activated successfully");
  } catch (error) {
    console.error("Error during extension activation:", error);
    vscode.window.showErrorMessage(
      `Error activating commit-after-publish extension: ${error.message}`
    );
  }
}

/**
 * Register for VS Code task events
 * @param {vscode.ExtensionContext} context
 */
function registerTaskEvents(context) {
  // After task ends
  const onDidEndTaskDisposable = vscode.tasks.onDidEndTaskProcess((event) => {
    if (!event || !event.execution || !event.execution.task) return;

    // Check if extension is enabled
    const config = vscode.workspace.getConfiguration("commit-after-publish");
    if (!config.get("enabled")) return;

    const task = event.execution.task;
    const configTaskNames = config.get("taskNames") || [];

    console.log("Task ended:", task.name, event.exitCode);

    // Check if this is a publish task based on task name or script name
    const isPublishTask =
      configTaskNames.includes(task.name) ||
      (task.definition.script &&
        configTaskNames.includes(task.definition.script.toLowerCase()));

    if (isPublishTask) {
      console.log("Publish task completed with exit code:", event.exitCode);

      if (event.exitCode === 0) {
        // Success handling - defer slightly to ensure VS Code is ready
        setTimeout(() => {
          try {
            // Try to generate commit message with GitHub Copilot
            vscode.commands
              .executeCommand("github.copilot.git.generateCommitMessage")
              .then(() => {
                vscode.window.showInformationMessage(
                  "Commit message generated successfully!"
                );
              })
              .catch((err) => {
                console.error("Error generating commit message:", err);
                vscode.window.showErrorMessage(
                  `Failed to generate commit message: ${err.message}`
                );
              });
          } catch (err) {
            console.error("Failed in commit message generation:", err.message);
            vscode.window.showErrorMessage(
              `Error in commit message workflow: ${err.message}`
            );
          }
        }, 1000);
      } else {
        vscode.window.showErrorMessage(
          `Publishing failed with exit code: ${event.exitCode}`
        );
      }
    }
  });

  context.subscriptions.push(onDidEndTaskDisposable);
}

/**
 * Extension deactivation handler
 */
function deactivate() {
  console.log("Commit-after-publish extension deactivated");
}

module.exports = {
  activate,
  deactivate,
};
