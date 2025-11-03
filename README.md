# PDF Watermark

A powerful Obsidian plugin to export your notes as PDF files, complete with customizable watermarks, headers, and footers.

## Description

The "PDF Watermark" plugin enhances your note-taking workflow by providing a robust solution for exporting your Obsidian notes into professionally formatted PDF documents. You can add a personalized text watermark, set its angle, and include custom header and footer text to each generated PDF. This is ideal for branding, copyright notices, or simply adding contextual information to your exported notes.

## Features

*   **Export Notes to PDF:** Easily convert your active Markdown notes into PDF format.
*   **Customizable Text Watermark:** Add any text as a watermark to your PDF documents.
*   **Adjustable Watermark Angle:** Set the rotation angle of the watermark for unique presentation (e.g., diagonal).
*   **Configurable Header:** Include custom text at the top of each PDF page.
*   **Configurable Footer:** Add custom text to the bottom of each PDF page.
*   **System Save As Dialog:** Utilizes your operating system's native "Save As" dialog, allowing you to choose the save location and filename for your generated PDFs.

## How to Use

1.  **Open a Note:** Navigate to the Markdown note you wish to export.
2.  **Access Command Palette:** Open the Obsidian command palette (default hotkey: `Ctrl/Cmd + P`).
3.  **Run Command:** Search for "Print current note to PDF with Watermark" and execute the command.
4.  **Save PDF:** Your system's "Save As" dialog will appear. Choose your desired location and filename, then click "Save".

## Settings

You can configure the plugin's behavior in Obsidian's settings under "PDF Watermark".

*   **Watermark Text:** The text that will appear as a watermark on your PDF.
*   **Watermark Angle:** The rotation angle of the watermark text in degrees (e.g., `-45` for a diagonal watermark).
*   **Header Text:** Custom text to be displayed in the header section of each PDF page.
*   **Footer Text:** Custom text to be displayed in the footer section of each PDF page.

## Installation

### From Obsidian (Recommended)

1.  Open **Settings** in Obsidian.
2.  Go to **Community plugins**.
3.  Turn off **Restricted mode**.
4.  Browse for "PDF Watermark".
5.  Click **Install**.
6.  Once installed, **Enable** the plugin.

### Manual Installation

1.  Download the `main.js`, `manifest.json`, and `styles.css` files from the [latest release](YOUR_GITHUB_RELEASE_URL_HERE).
2.  Create a new folder named `pdf-watermark` in your vault's `.obsidian/plugins/` directory.
3.  Copy the downloaded files into the `pdf-watermark` folder.
4.  Reload Obsidian.
5.  Go to **Settings** -> **Community plugins** and **Enable** the "PDF Watermark" plugin.

## Development

This plugin uses TypeScript for type checking and documentation, and `esbuild` for bundling.

1.  **Clone the repository:**
    ```bash
    git clone YOUR_GITHUB_REPO_URL_HERE
    cd pdf-watermark
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Build the plugin:**
    ```bash
    npm run build
    ```
    or for watch mode during development:
    ```bash
    npm run dev
    ```

## License

This plugin is licensed under the MIT License. See the `LICENSE` file for more details.