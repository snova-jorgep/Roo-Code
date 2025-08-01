import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Gemini } from "../Gemini"
import type { ProviderSettings } from "@roo-code/types"

vi.mock("@vscode/webview-ui-toolkit/react", () => ({
	VSCodeTextField: ({ children, value, onInput, type }: any) => (
		<div>
			{children}
			<input type={type} value={value} onChange={(e) => onInput(e)} />
		</div>
	),
}))

vi.mock("vscrui", () => ({
	Checkbox: ({ children, checked, onChange, "data-testid": testId, _ }: any) => (
		<label data-testid={testId}>
			<input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
			{children}
		</label>
	),
}))

vi.mock("@src/i18n/TranslationContext", () => ({
	useAppTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock("@src/components/common/VSCodeButtonLink", () => ({
	VSCodeButtonLink: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe("Gemini", () => {
	const defaultApiConfiguration: ProviderSettings = {
		geminiApiKey: "",
		enableUrlContext: false,
		enableGrounding: false,
	}

	const mockSetApiConfigurationField = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe("URL Context Checkbox", () => {
		it("should render URL context checkbox unchecked by default", () => {
			render(
				<Gemini
					apiConfiguration={defaultApiConfiguration}
					setApiConfigurationField={mockSetApiConfigurationField}
				/>,
			)

			const urlContextCheckbox = screen.getByTestId("checkbox-url-context")
			const checkbox = urlContextCheckbox.querySelector("input[type='checkbox']") as HTMLInputElement
			expect(checkbox.checked).toBe(false)
		})

		it("should render URL context checkbox checked when enableUrlContext is true", () => {
			const apiConfiguration = { ...defaultApiConfiguration, enableUrlContext: true }
			render(
				<Gemini apiConfiguration={apiConfiguration} setApiConfigurationField={mockSetApiConfigurationField} />,
			)

			const urlContextCheckbox = screen.getByTestId("checkbox-url-context")
			const checkbox = urlContextCheckbox.querySelector("input[type='checkbox']") as HTMLInputElement
			expect(checkbox.checked).toBe(true)
		})

		it("should call setApiConfigurationField with correct parameters when URL context checkbox is toggled", async () => {
			const user = userEvent.setup()
			render(
				<Gemini
					apiConfiguration={defaultApiConfiguration}
					setApiConfigurationField={mockSetApiConfigurationField}
				/>,
			)

			const urlContextCheckbox = screen.getByTestId("checkbox-url-context")
			const checkbox = urlContextCheckbox.querySelector("input[type='checkbox']") as HTMLInputElement

			await user.click(checkbox)

			expect(mockSetApiConfigurationField).toHaveBeenCalledWith("enableUrlContext", true)
		})
	})

	describe("Grounding with Google Search Checkbox", () => {
		it("should render grounding search checkbox unchecked by default", () => {
			render(
				<Gemini
					apiConfiguration={defaultApiConfiguration}
					setApiConfigurationField={mockSetApiConfigurationField}
				/>,
			)

			const groundingCheckbox = screen.getByTestId("checkbox-grounding-search")
			const checkbox = groundingCheckbox.querySelector("input[type='checkbox']") as HTMLInputElement
			expect(checkbox.checked).toBe(false)
		})

		it("should render grounding search checkbox checked when enableGrounding is true", () => {
			const apiConfiguration = { ...defaultApiConfiguration, enableGrounding: true }
			render(
				<Gemini apiConfiguration={apiConfiguration} setApiConfigurationField={mockSetApiConfigurationField} />,
			)

			const groundingCheckbox = screen.getByTestId("checkbox-grounding-search")
			const checkbox = groundingCheckbox.querySelector("input[type='checkbox']") as HTMLInputElement
			expect(checkbox.checked).toBe(true)
		})

		it("should call setApiConfigurationField with correct parameters when grounding search checkbox is toggled", async () => {
			const user = userEvent.setup()
			render(
				<Gemini
					apiConfiguration={defaultApiConfiguration}
					setApiConfigurationField={mockSetApiConfigurationField}
				/>,
			)

			const groundingCheckbox = screen.getByTestId("checkbox-grounding-search")
			const checkbox = groundingCheckbox.querySelector("input[type='checkbox']") as HTMLInputElement

			await user.click(checkbox)

			expect(mockSetApiConfigurationField).toHaveBeenCalledWith("enableGrounding", true)
		})
	})
})
