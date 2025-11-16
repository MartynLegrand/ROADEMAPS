# Contributing to Jestfly

Thank you for your interest in contributing to Jestfly! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check the issue tracker to avoid duplicates
2. Collect relevant information (OS, Node version, logs)
3. Create a minimal reproducible example

**Bug Report Template:**
```markdown
**Description:**
Clear description of the bug

**Steps to Reproduce:**
1. Step one
2. Step two
3. ...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [e.g., macOS 14]
- Node.js: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

**Additional Context:**
Screenshots, logs, etc.
```

### Suggesting Features

Feature requests are welcome! Please provide:
- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Examples from other platforms (if applicable)

### Pull Requests

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/jestfly.git
   cd jestfly
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Make Changes**
   - Write clean, maintainable code
   - Follow existing code style
   - Add tests for new features
   - Update documentation

5. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   npm run typecheck
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **Commit Message Format:**
   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

   **Types:**
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks

   **Examples:**
   ```
   feat(auth): add OAuth2 support
   fix(users): resolve profile update issue
   docs(api): update authentication section
   ```

7. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Request review from maintainers

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Redis >= 6
- Git

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone https://github.com/jestfly/jestfly.git
   cd jestfly
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Database Setup**
   ```bash
   # Create database
   createdb jestfly

   # Run migrations
   psql -U postgres -d jestfly -f database/schemas/schema.sql
   ```

4. **Start Development Servers**
   ```bash
   # Start all services
   npm run dev

   # Or start specific service
   cd apps/auth
   npm run dev
   ```

## Project Structure

```
jestfly/
├── apps/              # Microservices
├── packages/          # Shared packages
├── database/          # Database schemas
├── docs/              # Documentation
├── edge-functions/    # Edge functions
└── .github/           # CI/CD workflows
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define types for all function parameters and returns
- Use interfaces for object shapes
- Avoid `any` type

**Good:**
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<UserProfile> {
  // implementation
}
```

**Bad:**
```typescript
function getUser(id: any): any {
  // implementation
}
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons
- Max line length: 100 characters
- Use meaningful variable names

**Formatting:**
```bash
npm run format
```

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

**Test Example:**
```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
      };

      // Act
      const user = await userService.createUser(userData);

      // Assert
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
    });
  });
});
```

### Documentation

- Document public APIs
- Add JSDoc comments for complex functions
- Update README when adding features
- Keep API docs in sync with code

**JSDoc Example:**
```typescript
/**
 * Creates a new user account
 * @param userData - User registration data
 * @returns Promise resolving to created user
 * @throws {ValidationError} If data is invalid
 */
async function createUser(userData: RegisterData): Promise<User> {
  // implementation
}
```

## Architecture Guidelines

### Service Design

- Keep services focused and small
- Use RESTful API design
- Handle errors gracefully
- Log important events
- Validate all inputs

### Database

- Use migrations for schema changes
- Add indexes for frequently queried fields
- Use transactions for multi-step operations
- Avoid N+1 queries

### Security

- Never commit secrets
- Validate and sanitize all inputs
- Use parameterized queries
- Implement rate limiting
- Follow OWASP guidelines

## Testing Guidelines

### Unit Tests

- Test individual functions/methods
- Mock external dependencies
- Fast execution
- High coverage

### Integration Tests

- Test service endpoints
- Use test database
- Test API contracts
- Test error scenarios

### E2E Tests

- Test critical user flows
- Use production-like environment
- Test across services

## Review Process

1. **Automated Checks**
   - Tests must pass
   - Lint must pass
   - Type checking must pass
   - Build must succeed

2. **Code Review**
   - At least one approval required
   - Address all comments
   - Update based on feedback

3. **Merge**
   - Squash commits if needed
   - Merge to main branch
   - Deploy to staging

## Release Process

1. Version bump (semantic versioning)
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to production
5. Monitor for issues

## Getting Help

- **Discord:** [Join our server](https://discord.gg/jestfly)
- **GitHub Discussions:** Ask questions
- **Email:** dev@jestfly.com

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Invited to contributor Discord channel

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask questions! We're here to help.

Thank you for contributing to Jestfly! 🎉
