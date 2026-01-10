"use client";

import {
	DndContext,
	type DragEndEvent,
	closestCenter,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
	arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

export type { DragEndEvent } from "@dnd-kit/core";
export { arrayMove } from "@dnd-kit/sortable";

export type StyledListItemData = {
	id: string;
	[key: string]: unknown;
};

export type StyledListItemsProps = {
	children: ReactNode;
	className?: string;
};

export const StyledListItems = ({ children, className }: StyledListItemsProps) => (
	<div className={cn("flex flex-col gap-2", className)}>{children}</div>
);

export type StyledListItemProps<T extends StyledListItemData> = {
	item: T;
	renderContent: (item: T, index: number) => ReactNode;
	index: number;
	className?: string;
};

export function StyledListItem<T extends StyledListItemData>({
	item,
	renderContent,
	index,
	className,
}: StyledListItemProps<T>) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"flex items-center gap-3 rounded-lg border bg-background p-3 shadow-sm transition-all",
				"ring-1 ring-border/30",
				isDragging && "opacity-50 shadow-lg ring-primary/50 z-50",
				className
			)}
		>
			<button
				type="button"
				className={cn(
					"flex items-center justify-center p-1 rounded cursor-grab",
					"text-muted-foreground hover:text-foreground hover:bg-muted/50",
					"transition-colors",
					isDragging && "cursor-grabbing"
				)}
				{...attributes}
				{...listeners}
			>
				<GripVertical className="h-4 w-4" />
			</button>
			<div className="flex-1">{renderContent(item, index)}</div>
		</div>
	);
}

export type StyledListProviderProps<T extends StyledListItemData> = {
	items: T[];
	onReorder: (items: T[]) => void;
	renderItem: (item: T, index: number) => ReactNode;
	className?: string;
	itemClassName?: string;
};

export function StyledListProvider<T extends StyledListItemData>({
	items,
	onReorder,
	renderItem,
	className,
	itemClassName,
}: StyledListProviderProps<T>) {
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);
			const newItems = arrayMove(items, oldIndex, newIndex);
			onReorder(newItems);
		}
	};

	return (
		<DndContext
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				<StyledListItems className={className}>
					{items.map((item, index) => (
						<StyledListItem
							key={item.id}
							item={item}
							renderContent={renderItem}
							index={index}
							className={itemClassName}
						/>
					))}
				</StyledListItems>
			</SortableContext>
		</DndContext>
	);
}
