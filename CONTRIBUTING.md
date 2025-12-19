# Contributing to VS Code Sync Storage

Thank you for your interest in contributing! This document provides guidelines for contributing to the VS Code Sync Storage extension.

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- VS Code (v1.85.0 or higher)
- Git

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vscode-sync-storage.git
   cd vscode-sync-storage
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run compile
   ```

4. **Open in VS Code**
   ```bash
   code .
   ```

## Development Workflow

### Running the Extension

1. Press `F5` in VS Code to launch the Extension Development Host
2. In the new window, test your changes
3. Use `Ctrl+R` (Cmd+R on Mac) to reload the extension after making changes

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Edit files in the `src/` directory
   - Follow the existing code style
   - Add comments for complex logic

3. **Test Your Changes**
   - Run the extension in debug mode (F5)
   - Test all affected functionality
   - Verify edge cases

4. **Lint Your Code**
   ```bash
   npm run lint
   ```

5. **Compile**
   ```bash
   npm run compile
   ```

## Project Structure

```
vscode-sync-storage/
├── src/
│   ├── extension.ts           # Main entry point, command registration
│   └── fileSystemProvider.ts  # Virtual file system implementation
├── out/                        # Compiled JavaScript (generated)
├── .vscode/                    # VS Code configuration
│   ├── launch.json            # Debug configuration
│   └── tasks.json             # Build tasks
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Documentation
```

## Code Style Guidelines

### TypeScript
- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Avoid `any` type - use specific types or generics

### Error Handling
- Use VS Code's FileSystemError for file system operations
- Show user-friendly error messages via `vscode.window.showErrorMessage`
- Log detailed errors to the console for debugging

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_CASE for constants
- Prefix private members with `_` (e.g., `_emitter`)

## Testing

### Manual Testing Checklist

Before submitting a PR, test the following:

- [ ] Opening Sync Storage workspace
- [ ] Creating new files via command
- [ ] Creating new files via Explorer
- [ ] Editing and saving files
- [ ] Creating directories
- [ ] Deleting files and directories
- [ ] Renaming files
- [ ] Clearing all storage
- [ ] Workspace persists across VS Code restarts

### Future: Automated Tests

We plan to add automated tests. Contributions for test infrastructure are welcome!

## Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - Update README.md if adding new features
   - Update CHANGELOG.md with your changes
   - Add examples to EXAMPLES.md if applicable

2. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

3. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with details about your changes

### PR Requirements

- [ ] Code compiles without errors
- [ ] Linter passes (`npm run lint`)
- [ ] All manual tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Commits follow conventional commit format

## Feature Requests and Bug Reports

### Reporting Bugs

When reporting bugs, include:
- VS Code version
- Extension version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs if applicable

### Requesting Features

When requesting features, include:
- Use case description
- Why existing features don't solve the problem
- Proposed solution (if any)
- Alternatives considered

## Areas for Contribution

We welcome contributions in these areas:

### High Priority
- Automated test suite
- Better error handling and recovery
- Performance optimizations for large file trees
- Import/export functionality

### Medium Priority
- Support for file watching from external changes
- Compression for large files
- Search and filtering in the workspace
- Keyboard shortcuts

### Documentation
- Video tutorials
- More use case examples
- API documentation
- Localization

## Getting Help

- Open an issue for questions
- Check existing issues and PRs
- Read the code - it's well-commented!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Celebrate contributions of all sizes

Thank you for contributing! 🎉
