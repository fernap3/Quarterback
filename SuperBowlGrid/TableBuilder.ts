class TableBuilder
{
	/**
	 * Constructs an table element to display all of the grid information
	 * @param namesGrid The 2D array of names to display
	 * @param rowHeaders A list of numbers 0-9 representing the row headers
	 * @param columnHeaders A list of numbers 0-9 representing the column headers
	 * @param rowTeamImageName The URI of the image to use for the "row" team
	 * @param columnTeamImageName The URI of the image to use for the "column" team
	 */
	public GenerateDisplayTable(namesGrid: string[][], rowHeaders: number[], columnHeaders: number[], rowTeamImageName: string, columnTeamImageName: string): HTMLTableElement
	{
		var blankCell = document.createElement("td");
		blankCell.innerHTML = "&nbsp;";

		var table = document.createElement("table");
		var columnImageRow = document.createElement("tr");
		var columnImageCell = document.createElement("td");
		columnImageCell.colSpan = namesGrid[0].length + 1;

		var columnImage = document.createElement("img");
		columnImage.src = columnTeamImageName;
		columnImageCell.appendChild(columnImage);
		columnImageRow.appendChild(blankCell.cloneNode(true));
		columnImageRow.appendChild(columnImageCell);
		table.appendChild(columnImageRow);

		var columnHeaderRow = document.createElement("tr");
		table.appendChild(columnHeaderRow);

		columnHeaderRow.appendChild(blankCell.cloneNode(true));

		for (var i = 0; i < namesGrid[0].length; i++)
		{
			var cell = document.createElement("td");
			cell.innerHTML = columnHeaders[i].toString();
			columnHeaderRow.appendChild(cell);
		}

		var rowImageCell = document.createElement("td");
		rowImageCell.rowSpan = namesGrid.length + 1;

		var rowImageContainer = document.createElement("div");
		rowImageContainer.className = "RowTeamImageContainer";

		var rowImage = document.createElement("img");
		rowImage.src = rowTeamImageName;
		rowImage.className = "RowTeamImage";
		rowImageContainer.appendChild(rowImage);

		rowImageCell.appendChild(rowImageContainer);
		columnHeaderRow.insertBefore(rowImageCell, columnHeaderRow.firstChild);

		for (var i = 0; i < namesGrid.length; i++)
		{
			var row = document.createElement("tr");
			table.appendChild(row);
			var rowHeaderCell = document.createElement("td");
			row.appendChild(rowHeaderCell);
			rowHeaderCell.innerHTML = rowHeaders[i].toString();

			for (var j = 0; j < namesGrid[0].length; j++)
			{
				var cell = document.createElement("td");
				row.appendChild(cell);
				cell.innerHTML = namesGrid[i][j].toString();
			}
		}

		return table;
	}
}