class App
{
	constructor()
	{
		window.onload = () =>
		{
			var names = <ParticipantInfo[]>JSON.parse(window.localStorage.getItem("names"));
			new NameInfoList(document.getElementById("ListContainer"), names, (names: ParticipantInfo[]) => { this.GenerateGrid(names, false); });

			if (names != null)
			{
				this.GenerateGrid(names, true);
			}
		};
	}

	private GenerateGrid(names: ParticipantInfo[], failSilentlyIfDataInvalid: boolean)
	{
		Utilities.SaveNamesToLocalStorage(names);

		var errorText = this.ValidateNameInfo(names);

		if (errorText !== null)
		{
			if (failSilentlyIfDataInvalid === false)
			{
				alert(errorText);
			}

			return;
		}

		var namesGrid = new GridGenerator().GenerateNamesGrid(10, names);
		var rowHeaders = Utilities.ShuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		var columnHeaders = Utilities.ShuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		var table = new TableBuilder().GenerateDisplayTable(namesGrid, rowHeaders, columnHeaders, "denverbroncos.png", "carolinapanthers.png");

		var tableContainer = document.getElementById("TableContainer");
		tableContainer.innerHTML = "";
		tableContainer.appendChild(table);
	}

	private ValidateNameInfo(nameInfos: ParticipantInfo[]): string
	{
		var squaresSum = 0;
		var namesSet = {};

		for (var nameInfo of nameInfos)
		{
			squaresSum += nameInfo.numberOfSquares;

			if (namesSet[nameInfo.name.toLowerCase()] != null)
			{
				return "Names should be unique";
			}

			namesSet[nameInfo.name.toLowerCase()] = true;
		}

		if (squaresSum !== 100)
		{
			return "Number of squares should total to 100";
		}

		return null;
	}
}

new App();