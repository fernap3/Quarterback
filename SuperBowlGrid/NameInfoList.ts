class NameInfoList
{
	private container: HTMLElement;
	private listCtrl: EditableList;
	private generateGridCallback: (participants: ParticipantInfo[]) => void;

	/**
	 * Controls the list that allows the user to add and remove participants, and choose to generate a grid
	 * @param container The container in which to render the list
	 * @param participants A list of participant infos with which to prepopulate the grid
	 * @param generateGridCallback Called when the "Generate Grid" button is clicked
	 */
	constructor(container: HTMLElement, participants: ParticipantInfo[], generateGridCallback: (participants: ParticipantInfo[]) => void)
	{
		this.container = container;
		this.generateGridCallback = generateGridCallback;

		this.listCtrl = new EditableList(container, false, () => { Utilities.SaveNamesToLocalStorage(this.GetParticipants()); }, ["Participant Name", "# Squares"], 30);

		var addButton = document.createElement("button");
		addButton.className = "ListButton";
		addButton.innerHTML = "Add Participant";
		this.container.appendChild(addButton);

		addButton.onclick = (evt: MouseEvent) =>
		{
			this.listCtrl.AddRow(this.CreateBlankRow());
			Utilities.SaveNamesToLocalStorage(this.GetParticipants());
			evt.preventDefault();
		};

		var generateGridButton = document.createElement("button");
		generateGridButton.className = "ListButton";
		generateGridButton.innerHTML = "Generate Grid";
		this.container.appendChild(generateGridButton);

		generateGridButton.onclick = (evt: MouseEvent) =>
		{
			this.generateGridCallback(this.GetParticipants());
			evt.preventDefault();
		};

		if (participants != null)
		{
			// Load the initial state of the list
			for (var nameInfo of participants)
			{
				var row = this.CreateBlankRow();
				row[0].value = nameInfo.name;
				row[1].value = nameInfo.numberOfSquares == null ? "" : nameInfo.numberOfSquares.toString();
				this.listCtrl.AddRow(row);
			}
		}
		else
		{
			this.listCtrl.AddRow(this.CreateBlankRow());
		}
	}

	public GetParticipants(): ParticipantInfo[]
	{
		var participants: ParticipantInfo[] = [];
		var participantsSet = {};

		for (var row of this.listCtrl.GetAllRows())
		{
			var name = (<HTMLInputElement>row[0]).value;
			var numberOfSquares = parseInt((<HTMLInputElement>row[1]).value);

			participantsSet[name] = true;
			participants.push({ name: name, numberOfSquares: numberOfSquares });
		}

		return participants;
	}

	private CreateBlankRow(): HTMLInputElement[]
	{
		var nameInput = document.createElement("input");
		var numberInput = document.createElement("input");

		nameInput.className = "NameInput";
		numberInput.className = "NumberInput";

		return [nameInput, numberInput];
	}
}