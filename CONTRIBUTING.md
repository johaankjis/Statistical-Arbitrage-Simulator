# Contributing to Statistical Arbitrage Simulator

Thank you for your interest in contributing to the Statistical Arbitrage Simulator! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **Python** 3.8 or higher
- **Git**
- **npm** or **pnpm** package manager
- **pip** for Python packages

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Statistical-Arbitrage-Simulator.git
   cd Statistical-Arbitrage-Simulator
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/johaankjis/Statistical-Arbitrage-Simulator.git
   ```

## 💻 Development Setup

### 1. Install Dependencies

**Node.js dependencies:**
```bash
npm install
# or
pnpm install
```

**Python dependencies:**
```bash
pip install -r requirements.txt
```

### 2. Create Data Directory

```bash
mkdir -p data
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 4. Run Linter

```bash
npm run lint
```

### 5. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
Statistical-Arbitrage-Simulator/
├── app/                          # Next.js app directory
│   ├── api/                      # Backend API routes
│   │   ├── analyze-pairs/        # Cointegration analysis endpoint
│   │   ├── run-backtest/         # Backtest execution endpoint
│   │   ├── run-monte-carlo/      # Monte Carlo simulation endpoint
│   │   └── upload-data/          # Data upload endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── components/                   # React components
│   ├── ui/                       # Reusable UI components (shadcn/ui)
│   ├── data-upload.tsx           # CSV data upload interface
│   ├── pair-selection.tsx        # Cointegration analysis UI
│   ├── backtest-runner.tsx       # Backtest configuration & execution
│   ├── monte-carlo-runner.tsx    # Monte Carlo simulation UI
│   └── performance-dashboard.tsx # Results visualization
├── scripts/                      # Python analysis scripts
│   ├── cointegration_test.py     # Pair analysis logic
│   ├── backtest_engine.py        # Trading strategy backtest
│   └── monte_carlo_simulation.py # Stress testing engine
├── lib/                          # Utility functions
│   └── utils.ts                  # Helper utilities
├── hooks/                        # Custom React hooks
├── styles/                       # Global styles
│   └── globals.css               # Global CSS
├── public/                       # Static assets
└── data/                         # Data storage (gitignored)
```

## 📏 Coding Standards

### TypeScript/JavaScript

- **Formatting**: Follow the existing code style (Prettier/ESLint configured)
- **TypeScript**: Use proper type annotations; avoid `any` when possible
- **Naming Conventions**:
  - Components: PascalCase (e.g., `DataUpload`, `BacktestRunner`)
  - Functions: camelCase (e.g., `runBacktest`, `analyzePairs`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`)
- **Imports**: Group imports logically (React → Third-party → Local)

### Python

- **Style Guide**: Follow PEP 8
- **Docstrings**: Use clear docstrings for functions and classes
- **Type Hints**: Use type hints where appropriate
- **Naming Conventions**:
  - Functions/variables: snake_case (e.g., `calculate_sharpe_ratio`)
  - Classes: PascalCase (e.g., `BacktestEngine`)
  - Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_WINDOW`)

### React Components

- Use functional components with hooks
- Extract complex logic into custom hooks
- Keep components focused and single-purpose
- Use proper TypeScript interfaces for props

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme and design patterns
- Ensure responsive design (mobile-first approach)
- Support both light and dark modes

## 🔄 Pull Request Process

### Before Submitting

1. **Update from upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Write clean, documented code
   - Follow coding standards
   - Test your changes thoroughly

4. **Run linter**:
   ```bash
   npm run lint
   ```

5. **Test the build**:
   ```bash
   npm run build
   ```

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting the Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template:
   - **Title**: Clear, concise description
   - **Description**: Explain what and why
   - **Related Issues**: Link any related issues
   - **Testing**: Describe how you tested
   - **Screenshots**: Add if UI changes

### PR Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged
- Your contribution will be credited

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

- Check if the bug has already been reported
- Ensure you're using the latest version
- Try to reproduce the bug with minimal steps

### How to Submit a Bug Report

Create an issue with the following information:

1. **Title**: Clear, descriptive title
2. **Description**: Detailed description of the bug
3. **Steps to Reproduce**:
   - Step 1
   - Step 2
   - Step 3
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Environment**:
   - OS: (e.g., macOS 14.0)
   - Node.js version: (e.g., 18.17.0)
   - Python version: (e.g., 3.9.6)
   - Browser: (e.g., Chrome 120)
7. **Screenshots**: If applicable
8. **Additional Context**: Any other relevant information

## 💡 Suggesting Enhancements

### Before Submitting an Enhancement

- Check if the enhancement has already been suggested
- Ensure it aligns with the project's goals
- Consider if it could be implemented as a plugin/extension

### How to Submit an Enhancement

Create an issue with the following information:

1. **Title**: Clear, concise feature description
2. **Problem Statement**: What problem does it solve?
3. **Proposed Solution**: How should it work?
4. **Alternatives Considered**: Other approaches you've thought about
5. **Use Cases**: Real-world scenarios where it would be useful
6. **Implementation Notes**: Technical considerations (if any)

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

### Features
- [ ] Live data integration (APIs)
- [ ] Multi-pair portfolio backtesting
- [ ] Advanced risk models (VaR, CVaR)
- [ ] Machine learning pair selection
- [ ] Real-time monitoring dashboard
- [ ] Export functionality (PDF/Excel)
- [ ] Parameter optimization engine

### Technical Improvements
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Caching layer (Redis)
- [ ] Unit and integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Performance optimizations
- [ ] Error handling improvements
- [ ] Accessibility improvements

### Documentation
- [ ] Tutorial videos or walkthroughs
- [ ] More code examples
- [ ] API documentation
- [ ] Architecture diagrams
- [ ] Translation to other languages

## 📞 Getting Help

If you need help with contributing:

- **GitHub Issues**: Ask questions in a new issue
- **Discussions**: Use GitHub Discussions for general questions
- **Documentation**: Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for technical details

## 📜 License

By contributing to Statistical Arbitrage Simulator, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for taking the time to contribute! Every contribution, no matter how small, helps make this project better.

---

**Questions?** Feel free to reach out by opening an issue or discussion on GitHub.
