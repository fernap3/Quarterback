class Utilities
{
	public static ShuffleArray(a: number[]): number[]
	{
		for (var i = 0; i < a.length; i++)
		{
			var swapIndex = Utilities.GetRandomInt(0, a.length - 1);
			var temp = a[i];
			a[i] = a[swapIndex];
			a[swapIndex] = temp;
		}

		return a;
	}

	public static GetRandomInt(min: number, max: number)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public static SaveNamesToLocalStorage(participants: ParticipantInfo[])
	{
		window.localStorage.setItem("names", JSON.stringify(participants));
	}
}