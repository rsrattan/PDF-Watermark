import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	watermarkText: string;
	watermarkAngle: number;
	headerText: string;
	footerText: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	watermarkText: 'Obsidian',
	watermarkAngle: -45,
	headerText: '',
	footerText: ''
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (_evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		this.addCommand({
			id: 'print-note-to-pdf',
			name: 'Print current note to PDF with Watermark',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView && markdownView.file) {
					if (!checking) {
						this.createPdf(markdownView.file.basename, markdownView.editor.getValue());
					}
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	async createPdf(title: string, content: string) {
		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage();
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

		const { width, height } = page.getSize();
		const fontSize = 12;
		const margin = 50;

		// Draw header
		if (this.settings.headerText) {
			page.drawText(this.settings.headerText, {
				x: margin,
				y: height - margin / 2,
				size: fontSize,
				font,
				color: rgb(0, 0, 0),
			});
		}

		// Draw footer
		if (this.settings.footerText) {
			page.drawText(this.settings.footerText, {
				x: margin,
				y: margin / 2,
				size: fontSize,
				font,
				color: rgb(0, 0, 0),
			});
		}

		// Draw content
		page.drawText(content, {
			x: margin,
			y: height - margin - (this.settings.headerText ? fontSize + 10 : 0),
			size: fontSize,
			font,
			color: rgb(0, 0, 0),
			maxWidth: width - 2 * margin,
			lineHeight: fontSize * 1.2,
		});

		// Draw watermark
		if (this.settings.watermarkText) {
			const watermarkText = this.settings.watermarkText;
			const watermarkFontSize = 70;
			const textWidth = font.widthOfTextAtSize(watermarkText, watermarkFontSize);
			const textHeight = font.heightAtSize(watermarkFontSize);

			page.drawText(watermarkText, {
				x: width / 2 - textWidth / 2,
				y: height / 2 - textHeight / 2,
				size: watermarkFontSize,
				font,
				color: rgb(0.9, 0.9, 0.9),
				opacity: 0.5,
				rotate: degrees(this.settings.watermarkAngle),
			});
		}

		const pdfBytes = await pdfDoc.save();
		const fileName = `${title}.pdf`;
		await this.app.vault.createBinary(fileName, pdfBytes);
		new Notice(`PDF saved as ${fileName}`);
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Watermark Text')
			.setDesc('Text to use as a watermark on the PDF.')
			.addText(text => text
				.setPlaceholder('Enter watermark text')
				.setValue(this.plugin.settings.watermarkText)
				.onChange(async (value) => {
					this.plugin.settings.watermarkText = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Watermark Angle')
			.setDesc('Angle of the watermark text in degrees (e.g., -45 for diagonal).')
			.addText(text => text
				.setPlaceholder('Enter angle')
				.setValue(this.plugin.settings.watermarkAngle.toString())
				.onChange(async (value) => {
					this.plugin.settings.watermarkAngle = Number(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Header Text')
			.setDesc('Text to display in the header of the PDF.')
			.addText(text => text
				.setPlaceholder('Enter header text')
				.setValue(this.plugin.settings.headerText)
				.onChange(async (value) => {
					this.plugin.settings.headerText = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Footer Text')
			.setDesc('Text to display in the footer of the PDF.')
			.addText(text => text
				.setPlaceholder('Enter footer text')
				.setValue(this.plugin.settings.footerText)
				.onChange(async (value) => {
					this.plugin.settings.footerText = value;
					await this.plugin.saveSettings();
				}));
	}
}
