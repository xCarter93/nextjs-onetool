interface StickyFormFooterProps {
	onCancel?: () => void;
	onSave?: () => void;
	cancelText?: string;
	saveText?: string;
	isLoading?: boolean;
}

export function StickyFormFooter({
	onCancel,
	onSave,
	cancelText = "Cancel",
	saveText = "Save",
	isLoading = false,
}: StickyFormFooterProps) {
	return (
		<div className="sticky bottom-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
			<div className="w-full px-6">
				<div className="w-full">
					<div className="flex items-center justify-end gap-x-6 py-4">
						<button
							type="button"
							onClick={onCancel}
							disabled={isLoading}
							className="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{cancelText}
						</button>
						<button
							type="submit"
							onClick={onSave}
							disabled={isLoading}
							className="rounded-md bg-blue-600 dark:bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isLoading ? "Saving..." : saveText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
