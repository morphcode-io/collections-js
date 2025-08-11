# Contributing to @morphcode/collections

Thank you for your interest in contributing to `@morphcode/collections`! 🎉

This project is a data structures library inspired by Python's `collections` module, designed for JavaScript and TypeScript. We welcome all contributions, from bug fixes to new features and documentation improvements.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Environment Setup](#development-environment-setup)
- [Development Process](#development-process)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code and maintain a respectful and welcoming environment for everyone.

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating an issue:
- Check if a similar issue already exists
- Use the latest version of the library
- Provide a minimal reproducible example

**Bug Report Template:**
```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Import '...'
2. Execute '...'
3. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Environment**
- @morphcode/collections: [e.g. 1.0.0]
- Node.js: [e.g. 18.0.0]
- OS: [e.g. macOS, Windows, Linux]
```

### ✨ Suggesting Enhancements

Enhancement suggestions include:
- New data structures
- Performance optimizations
- API improvements
- Additional functionality

### 💻 Contributing Code

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## ⚙️ Development Environment Setup

### Prerequisites

- Node.js 14+ (as specified in package.json engines)
- npm 8+ or yarn 1.22+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/morphcode-io/collections-js.git
cd collections-js

# Install dependencies
npm install

# Run tests to verify everything works
npm test
```

### Available Scripts

```bash
npm run build         # Build both library and distribution
npm run build:lib     # Compile TypeScript only
npm run build:dist    # Build distribution with Rollup
npm run dev           # Development mode with watch
npm run test          # Run complete test suite
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run lint          # Run ESLint
npm run lint:fix      # Fix linting errors automatically
npm run format        # Format code with Prettier
npm run docs          # Generate documentation with TypeDoc
npm run clean         # Clean build artifacts
npm run prepare       # Set up Husky hooks
```

## 🛠️ Development Process

### Workflow

1. **Assignment**: Comment on the issue you want to work on
2. **Development**: Work on your feature branch
3. **Testing**: Ensure all tests pass
4. **Documentation**: Update docs if necessary
5. **Pull Request**: Create PR with detailed description

### Branch Naming

Use descriptive names for your branches:
- `feature/counter-intersection` - New functionality
- `fix/heap-memory-leak` - Bug fix
- `docs/update-examples` - Documentation update
- `perf/optimize-deque-push` - Performance improvement

## 📝 Code Standards

### TypeScript

- Use **strict mode** enabled
- **Avoid `any`** - prefer specific types or generics
- Prefer **interfaces** over types for objects
- Use **JSDoc** for public methods
- Target ES2020+ features

```typescript
/**
 * Adds an element to the counter with optional count.
 * @param element The element to add
 * @param count Number of times to add the element (default: 1)
 * @returns The counter instance for method chaining
 */
add(element: T, count: number = 1): this {
    // implementation
}
```

### Naming Conventions

- **Classes**: `PascalCase` (e.g. `Counter`, `OrderedDict`)
- **Methods/Functions**: `camelCase` (e.g. `mostCommon`, `moveToEnd`)
- **Variables**: `camelCase` 
- **Constants**: `UPPER_SNAKE_CASE`
- **Private members**: prefix with `_` (e.g. `_items`)

### Code Style

We use **Prettier** and **ESLint** with **Husky** pre-commit hooks:

```typescript
// ✅ Good
const counter = new Counter<string>();
counter.add('hello', 3);

// ❌ Bad
const counter=new Counter<string>()
counter.add('hello',3)
```

## 🧪 Testing

### Testing Principles

- **100% coverage** is the goal
- Use **Jest** for all tests
- Name test files as `*.test.ts`
- Group related tests with `describe()`
- Use descriptive test names

### Test Structure

```typescript
describe('Counter', () => {
    describe('constructor', () => {
        it('should create empty counter when no arguments provided', () => {
            const counter = new Counter();
            expect(counter.size).toBe(0);
        });

        it('should initialize from string', () => {
            const counter = new Counter('hello');
            expect(counter.get('l')).toBe(2);
        });
    });

    describe('add method', () => {
        it('should add element with default count of 1', () => {
            const counter = new Counter<string>();
            counter.add('a');
            expect(counter.get('a')).toBe(1);
        });
    });
});
```

### Running Tests

```bash
# Complete test suite
npm test

# Specific tests
npm test -- Counter.test.ts

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📚 Documentation

### JSDoc

All public methods must have JSDoc comments:

```typescript
/**
 * Returns the n most common elements and their counts.
 * 
 * @example
 * ```typescript
 * const counter = new Counter('abracadabra');
 * counter.mostCommon(2); // [['a', 5], ['b', 2]]
 * ```
 * 
 * @param n Number of most common elements to return
 * @returns Array of [element, count] tuples sorted by count descending
 */
mostCommon(n?: number): Array<[T, number]> {
    // implementation
}
```

### README and Examples

- Keep examples updated in README
- Include real-world use cases
- Use TypeScript in all examples
- Explain the "why", not just the "how"

### TypeDoc

Documentation is automatically generated with:

```bash
npm run docs
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Tests pass locally (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Coverage doesn't decrease
- [ ] Documentation updated
- [ ] CHANGELOG updated (if applicable)

### PR Template

```markdown
## Description

Brief description of the changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?

Describe the tests you ran to verify your changes.

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 📁 Project Structure

```
@morphcode/collections/
├── src
|    ├── collections
│    |    ├── counter.class.ts          # Counter implementation
│    |    ├── deque.class.ts           # Deque implementation  
│    |    ├── heap.class.ts            # Heap implementation
│    |    ├── ordereddict.class.ts    # OrderedDict implementation
│    |    ├── defaultdict.class.ts    # DefaultDict implementation
│    |    └── index.ts           # Main exports
|    ├── interfaces
|    ├── types
|    ├── utils
├── tests/unit             # Test files
│   ├── Counter.test.ts
│   ├── Deque.test.ts
│   └── ...
├── dist/                  # Compiled output (generated)
├── lib/                   # TypeScript compilation output (generated)
├── docs/                  # Generated documentation
├── examples/              # Usage examples
├── .husky/                # Git hooks
├── rollup.config.js       # Rollup configuration
├── jest.config.js         # Jest configuration
├── tsconfig.json          # TypeScript configuration
├── .eslint.config.js      # ESLint configuration
├── .prettierrc            # Prettier configuration
└── README.md
```

## 🚀 Release Process

Releases follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes in the API
- **MINOR**: New backward-compatible functionality
- **PATCH**: Backward-compatible bug fixes

The `prepublishOnly` script ensures quality by running:
1. `npm run clean` - Clean build artifacts
2. `npm run build` - Build the library
3. `npm run test` - Run all tests

## 🔧 Git Hooks

This project uses **Husky** and **lint-staged** for pre-commit hooks:

- **Pre-commit**: Runs ESLint and Prettier on staged TypeScript files
- **Prepare**: Sets up Husky hooks after `npm install`

## 🏗️ Build System

- **TypeScript**: Compiles to `lib/` directory
- **Rollup**: Bundles for distribution with multiple formats:
  - CommonJS (`dist/index.js`)
  - ES Modules (`dist/index.esm.js`)
  - Type definitions (`dist/index.d.ts`)

## ❓ Need Help?

- 📖 Read the [documentation](README.md)
- 💬 Open a [discussion issue](https://github.com/morphcode-io/collections-js/issues)
- 📧 Contact the maintainers

---

## 🙏 Acknowledgments

Thanks to all contributors who make this project possible!

Special thanks to Python's `collections` module for inspiration.

---

**We look forward to your contribution!** 🎉

> **Made with ❤️ by the [@morphcode-io](https://github.com/morphcode-io) community**