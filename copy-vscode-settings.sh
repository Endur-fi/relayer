#!/bin/bash
# Script to copy VS Code configuration files to another project

# Usage: ./copy-vscode-settings.sh /path/to/target/project

if [ -z "$1" ]; then
  echo "Please provide the target project path"
  echo "Usage: ./copy-vscode-settings.sh /path/to/target/project"
  exit 1
fi

TARGET_DIR="$1"

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "Target directory does not exist: $TARGET_DIR"
  exit 1
fi

# Create .vscode directory in target if it doesn't exist
mkdir -p "$TARGET_DIR/.vscode"

# Copy VS Code configuration files
echo "Copying VS Code configuration files..."
cp .vscode/settings.json "$TARGET_DIR/.vscode/"
cp .vscode/extensions.json "$TARGET_DIR/.vscode/"

# Copy coding style configuration files
echo "Copying coding style configuration files..."
cp .prettierrc "$TARGET_DIR/"
cp .eslintrc.json "$TARGET_DIR/"
cp .editorconfig "$TARGET_DIR/"

echo ""
echo "✅ VS Code configuration files copied successfully!"
echo ""
echo "⚠️ Note: You may still need to install the required dependencies in the target project:"
echo "pnpm install -D eslint@^8.56.0 prettier @typescript-eslint/eslint-plugin@^5.62.0 @typescript-eslint/parser@^5.62.0 eslint-config-prettier@^9.1.0 eslint-plugin-import"
echo ""
echo "Don't forget to add the following scripts to your package.json:"
echo '"lint": "eslint . --ext .ts,.js",'
echo '"lint:fix": "eslint . --ext .ts,.js --fix",'
echo '"format": "prettier --write \"**/*.{ts,js,json,md}\"",'
echo '"format:check": "prettier --check \"**/*.{ts,js,json,md}\""'

exit 0
