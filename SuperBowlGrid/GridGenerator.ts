class GridGenerator
{
	/**
	 * Returns the sum of the number of squares each name has
	 */
	private TotalNumberOfSquaresClaimed(participants: ParticipantInfo[]): number
	{
		var sum = 0;

		for (var participant of participants)
		{
			sum += participant.numberOfSquares;
		}

		return sum;
	}

	/**
	 * Returns a 2D array representing the grid generated from the list of names
	 * and how often each name should occur.
	 * @param size The length of one dimension of the grid eg. 10 for a 10x10 grid
	 * @param names An array of objects describing how many times a given name should occur in the grid
	 */
	public GenerateNamesGrid(size: number, participants: ParticipantInfo[]): string[][]
	{
		var grid = [];
		var namesPool: string[] = [];

		// Build the pool of names
		for (var participant of participants)
		{
			for (var i = 0; i < participant.numberOfSquares; i++)
			{
				namesPool.push(participant.name);
			}
		}

		// Now populate the grid
		for (var i = 0; i < size; i++)
		{
			grid.push([]);
			for (var j = 0; j < size; j++)
			{
				var position = Utilities.GetRandomInt(0, namesPool.length - 1);
				grid[i].push(namesPool[position]);
				namesPool.splice(position, 1);
			}
		}

		return grid;
	}
}

interface ParticipantInfo
{
	name: string;
	numberOfSquares: number;
}