# Publishing Core Frameworks CLI

To publish this CLI to npm so users can run `npx core-frameworks`:

1.  **Login to npm**:
    ```bash
    npm login
    ```

2.  **Ensure Unique Name**:
    Check if `core-frameworks` is taken on npm. If it is, update the `"name"` field in `package.json` to something unique (e.g., `@your-username/core-frameworks`).

3.  **Publish**:
    Navigate to the `core-frameworks-cli` directory:
    ```bash
    cd core-frameworks-cli
    npm publish --access public
    ```

4.  **Usage**:
    Once published, any user can run:
    ```bash
    npx core-frameworks
    ```
    (Or `npx @your-username/core-frameworks` if scoped).
