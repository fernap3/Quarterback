class EditableList
{
	private parentContainer: HTMLElement;
	private listContainer: HTMLElement;
	private allowEmpty: boolean;
	private afterItemRemoveFunc: () => void;
	private headerTexts: string[];
	private columns: HTMLElement[] = [];
	private deleteButtonColumn: HTMLElement;
	private rowHeight: number;
	private columnVisibilities: boolean[];

	/**
	 * Creates a new editable list, a UI element that allows for the adding, removing, and reordering
	 * of content.  An editable list is a grid of items stored in rows and columns, created
	 * with a static number of columns.
	 * @param container The container to which the list will be appended
	 * @param allowEmpty If true, when there is only one item in the list, the item is not deletable
	 */
	constructor(container: HTMLElement, allowEmpty: boolean, afterItemRemoveFunc: () => void, headerTitles: string[], rowHeight: number)
	{
		this.parentContainer = container;

		this.listContainer = document.createElement("div");
		this.allowEmpty = allowEmpty !== false;
		this.afterItemRemoveFunc = afterItemRemoveFunc;
		this.headerTexts = headerTitles;
		this.rowHeight = rowHeight;
		this.columnVisibilities = [];

		for (var i = 0; i < headerTitles.length; i++)
			this.columnVisibilities.push(true);

		this.AddColumnContainers(headerTitles)
		this.parentContainer.appendChild(this.listContainer);
	}

	private AddColumnContainers(headerTitles: string[])
	{
		for (var title of headerTitles)
		{
			var column = document.createElement("div");
			column.style.cssFloat = "left";
			column.setAttribute("data-column", "");

			column.appendChild(this.CreateHeaderCell(title));
			this.listContainer.appendChild(column);
			this.columns.push(column);
		}

		this.deleteButtonColumn = document.createElement("div");
		this.deleteButtonColumn.style.cssFloat = "left";
		this.deleteButtonColumn.setAttribute("data-deletebuttoncolumn", "");
		this.deleteButtonColumn.appendChild(this.CreateHeaderCell("&nbsp;"));
		this.listContainer.appendChild(this.deleteButtonColumn);
	}

	private CreateHeaderCell(title: string): HTMLElement
	{
		var headerCell = document.createElement("div");
		headerCell.setAttribute("data-header", "");
		headerCell.innerHTML = title;
		headerCell.style.marginBottom = ".25em";
		return headerCell;
	}

	/**
	 * Sets the column header text for the given column
	 * @param columnIndex The index of the column with the header text to change
	 * @param text The new header text
	 */
	public SetHeaderText(columnIndex: number, text: string)
	{
		(<HTMLElement>this.listContainer.querySelectorAll("[data-header]")[columnIndex]).innerHTML = text;
	}

	/**
	 * Adds a row of items to the list
	 * @param contentContainers The elements to add as the list item content (one element per column)
	 */
	public AddRow(contentContainers: HTMLElement[]): void
	{
		if (contentContainers.length !== this.columns.length)
			throw "Number of contentContainers provided must match the number of columns in the table (" + this.columns.length + ")";

		for (var i = 0; i < this.columns.length; i++)
		{
			var contentContainerBox = document.createElement("div");
			contentContainerBox.appendChild(contentContainers[i]);
			contentContainerBox.setAttribute("data-listcontent", "");
			contentContainerBox.style.display = "block";
			contentContainerBox.style.height = this.rowHeight + "px";

			if (this.columnVisibilities[i] === false)
				contentContainerBox.style.display = "none";

			this.columns[i].appendChild(contentContainerBox);
		}

		this.deleteButtonColumn.appendChild(this.CreateDeleteButtonContainer());

		if (this.allowEmpty === false)
		{
			this.SetFirstDeleteButtonState();
		}
	}

	/**
	 * Removes the row at the given index
	 * @param index The index of the item to remove
	 */
	public RemoveRow(rowIndex: number): void
	{
		var columns = this.listContainer.querySelectorAll("[data-column]");

		for (var i = 0; i < this.columns.length; i++)
		{
			var item = <HTMLElement>this.columns[i].querySelectorAll("[data-listcontent]")[rowIndex];
			item.parentNode.removeChild(item);
		}

		var deleteButton = this.GetDeleteButton(rowIndex);
		deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);

		if (this.allowEmpty === false && this.NumRows() > 0)
		{
			this.SetFirstDeleteButtonState();
		}
	}

	/**
	 * Shows or hides the column at the given index
	 * @param columnIndex The index of the column to show or hide
	 * @param visibile true to show the column, false to hide
	 */
	public SetColumnVisibility(columnIndex: number, visibile: boolean)
	{
		var displayText = visibile === true ? "" : "none";
		(<HTMLElement>this.listContainer.querySelectorAll("[data-header]")[columnIndex]).style.display = displayText;

		for (var row of this.GetAllRows())
		{
			row[columnIndex].style.display = displayText;
		}

		this.columnVisibilities[columnIndex] = visibile;
	}

	/**
	 * Removes all items from the list
	 */
	public Clear(): void
	{
		var numItems = this.NumRows();

		for (var i = 0; i < numItems; i++)
		{
			this.RemoveRow(0);
		}
	}

	/**
	 * Gets the content from each column at the given row index
	 * @param index The index of the item content to get
	 */
	public GetItemsInRow(rowIndex: number): HTMLElement[]
	{
		var items = [];

		for (var i = 0; i < this.columns.length; i++)
		{
			var item = <HTMLElement>this.columns[i].querySelectorAll("[data-listcontent]")[rowIndex].firstChild;
			items.push(item);
		}

		return items;
	}

	/**
	 * Gets the item in the cell at rowIndex, columnIndex
	 * @param rowIndex The row of the item to retreive
	 * @param columnIndex The column of the item to retreive
	 */
	public GetRowItem(rowIndex: number, columnIndex: number)
	{
		return this.GetItemsInRow(rowIndex)[columnIndex];
	}

	private GetDeleteButton(index: number): HTMLElement
	{
		return <HTMLElement>this.deleteButtonColumn.querySelectorAll("[data-deletebutton]")[index];
	}

	/**
	 * Gets the content from each item in the list
	 */
	public GetAllRows(): HTMLElement[][]
	{
		var itemsArray: HTMLElement[][] = [];
		var numItems = this.NumRows();

		for (var i = 0; i < numItems; i++)
		{
			var rowItems = [];

			for (var column of this.columns)
			{
				rowItems.push(<HTMLElement>column.querySelectorAll("[data-listcontent]")[i].firstChild);
			}

			itemsArray.push(rowItems);
		}

		return itemsArray;
	}

	/**
	 * Returns the number of items in the list
	 */
	public NumRows(): number
	{
		return this.columns[0].querySelectorAll("[data-listcontent]").length;
	}

	private CreateDeleteButtonContainer(): HTMLElement
	{
		var deleteButtonContainer = document.createElement("div");
		var deleteImage = document.createElement("img");
		deleteImage.src = "Delete.png";
		deleteImage.setAttribute("data-deletebutton", "");

		deleteImage.onclick = (evt: MouseEvent) =>
		{
			var deleteButtons = this.deleteButtonColumn.querySelectorAll("[data-deletebutton]");

			for (var rowIndex = 0; rowIndex < deleteButtons.length; rowIndex++)
			{
				if (deleteButtons[rowIndex] === <HTMLElement>evt.target)
					break;
			}

			this.RemoveRow(rowIndex);

			if (this.allowEmpty === false)
			{
				this.SetFirstDeleteButtonState();
			}

			if (this.afterItemRemoveFunc != null)
			{
				this.afterItemRemoveFunc();
			}
		};

		deleteButtonContainer.appendChild(deleteImage);
		deleteButtonContainer.classList.add("EditableListDeleteButtonContainer");
		deleteButtonContainer.style.height = this.rowHeight + "px";

		return deleteButtonContainer;
	}

	/**
	 * If there is only one item in the list, disables the delete button, preventing
	 * the last item from being deleted
	 */
	private SetFirstDeleteButtonState()
	{
		var deleteButton = <HTMLImageElement>this.GetDeleteButton(0);

		if (this.NumRows() === 1)
		{
			deleteButton.style.visibility = "hidden";
		}
		else
		{
			deleteButton.style.visibility = "";
		}
	}
}