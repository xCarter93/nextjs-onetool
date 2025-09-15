"use client";

import React, { useState } from "react";
import Modal from "./modal";
import { Button } from "./button";

const BasicModalView: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="space-y-4">
			<Button onPress={() => setIsOpen(true)} intent="primary">
				Open Basic Modal
			</Button>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Basic Modal"
			>
				<div className="space-y-4">
					<p className="text-gray-700 dark:text-gray-300">
						This is a basic modal example. You can put any content here. The
						modal will close when you click the X button, press ESC, or click
						outside the modal.
					</p>
					<div className="flex justify-end">
						<Button onPress={() => setIsOpen(false)} intent="secondary">
							Close
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default BasicModalView;
