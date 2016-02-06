var App = (function () {
    function App() {
        var _this = this;
        window.onload = function () {
            var names = JSON.parse(window.localStorage.getItem("names"));
            new NameInfoList(document.getElementById("ListContainer"), names, function (names) { _this.GenerateGrid(names, false); });
            if (names != null) {
                _this.GenerateGrid(names, true);
            }
        };
    }
    App.prototype.GenerateGrid = function (names, failSilentlyIfDataInvalid) {
        Utilities.SaveNamesToLocalStorage(names);
        var errorText = this.ValidateNameInfo(names);
        if (errorText !== null) {
            if (failSilentlyIfDataInvalid === false) {
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
    };
    App.prototype.ValidateNameInfo = function (nameInfos) {
        var squaresSum = 0;
        var namesSet = {};
        for (var _i = 0; _i < nameInfos.length; _i++) {
            var nameInfo = nameInfos[_i];
            squaresSum += nameInfo.numberOfSquares;
            if (namesSet[nameInfo.name.toLowerCase()] != null) {
                return "Names should be unique";
            }
            namesSet[nameInfo.name.toLowerCase()] = true;
        }
        if (squaresSum !== 100) {
            return "Number of squares should total to 100";
        }
        return null;
    };
    return App;
})();
new App();
var EditableList = (function () {
    function EditableList(container, allowEmpty, afterItemRemoveFunc, headerTitles, rowHeight) {
        this.columns = [];
        this.parentContainer = container;
        this.listContainer = document.createElement("div");
        this.allowEmpty = allowEmpty !== false;
        this.afterItemRemoveFunc = afterItemRemoveFunc;
        this.headerTexts = headerTitles;
        this.rowHeight = rowHeight;
        this.columnVisibilities = [];
        for (var i = 0; i < headerTitles.length; i++)
            this.columnVisibilities.push(true);
        this.AddColumnContainers(headerTitles);
        this.parentContainer.appendChild(this.listContainer);
    }
    EditableList.prototype.AddColumnContainers = function (headerTitles) {
        for (var _i = 0; _i < headerTitles.length; _i++) {
            var title = headerTitles[_i];
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
    };
    EditableList.prototype.CreateHeaderCell = function (title) {
        var headerCell = document.createElement("div");
        headerCell.setAttribute("data-header", "");
        headerCell.innerHTML = title;
        headerCell.style.marginBottom = ".25em";
        return headerCell;
    };
    EditableList.prototype.SetHeaderText = function (columnIndex, text) {
        this.listContainer.querySelectorAll("[data-header]")[columnIndex].innerHTML = text;
    };
    EditableList.prototype.AddRow = function (contentContainers) {
        if (contentContainers.length !== this.columns.length)
            throw "Number of contentContainers provided must match the number of columns in the table (" + this.columns.length + ")";
        for (var i = 0; i < this.columns.length; i++) {
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
        if (this.allowEmpty === false) {
            this.SetFirstDeleteButtonState();
        }
    };
    EditableList.prototype.RemoveRow = function (rowIndex) {
        var columns = this.listContainer.querySelectorAll("[data-column]");
        for (var i = 0; i < this.columns.length; i++) {
            var item = this.columns[i].querySelectorAll("[data-listcontent]")[rowIndex];
            item.parentNode.removeChild(item);
        }
        var deleteButton = this.GetDeleteButton(rowIndex);
        deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);
        if (this.allowEmpty === false && this.NumRows() > 0) {
            this.SetFirstDeleteButtonState();
        }
    };
    EditableList.prototype.SetColumnVisibility = function (columnIndex, visibile) {
        var displayText = visibile === true ? "" : "none";
        this.listContainer.querySelectorAll("[data-header]")[columnIndex].style.display = displayText;
        for (var _i = 0, _a = this.GetAllRows(); _i < _a.length; _i++) {
            var row = _a[_i];
            row[columnIndex].style.display = displayText;
        }
        this.columnVisibilities[columnIndex] = visibile;
    };
    EditableList.prototype.Clear = function () {
        var numItems = this.NumRows();
        for (var i = 0; i < numItems; i++) {
            this.RemoveRow(0);
        }
    };
    EditableList.prototype.GetItemsInRow = function (rowIndex) {
        var items = [];
        for (var i = 0; i < this.columns.length; i++) {
            var item = this.columns[i].querySelectorAll("[data-listcontent]")[rowIndex].firstChild;
            items.push(item);
        }
        return items;
    };
    EditableList.prototype.GetRowItem = function (rowIndex, columnIndex) {
        return this.GetItemsInRow(rowIndex)[columnIndex];
    };
    EditableList.prototype.GetDeleteButton = function (index) {
        return this.deleteButtonColumn.querySelectorAll("[data-deletebutton]")[index];
    };
    EditableList.prototype.GetAllRows = function () {
        var itemsArray = [];
        var numItems = this.NumRows();
        for (var i = 0; i < numItems; i++) {
            var rowItems = [];
            for (var _i = 0, _a = this.columns; _i < _a.length; _i++) {
                var column = _a[_i];
                rowItems.push(column.querySelectorAll("[data-listcontent]")[i].firstChild);
            }
            itemsArray.push(rowItems);
        }
        return itemsArray;
    };
    EditableList.prototype.NumRows = function () {
        return this.columns[0].querySelectorAll("[data-listcontent]").length;
    };
    EditableList.prototype.CreateDeleteButtonContainer = function () {
        var _this = this;
        var deleteButtonContainer = document.createElement("div");
        var deleteImage = document.createElement("img");
        deleteImage.src = "Delete.png";
        deleteImage.setAttribute("data-deletebutton", "");
        deleteImage.onclick = function (evt) {
            var deleteButtons = _this.deleteButtonColumn.querySelectorAll("[data-deletebutton]");
            for (var rowIndex = 0; rowIndex < deleteButtons.length; rowIndex++) {
                if (deleteButtons[rowIndex] === evt.target)
                    break;
            }
            _this.RemoveRow(rowIndex);
            if (_this.allowEmpty === false) {
                _this.SetFirstDeleteButtonState();
            }
            if (_this.afterItemRemoveFunc != null) {
                _this.afterItemRemoveFunc();
            }
        };
        deleteButtonContainer.appendChild(deleteImage);
        deleteButtonContainer.classList.add("EditableListDeleteButtonContainer");
        deleteButtonContainer.style.height = this.rowHeight + "px";
        return deleteButtonContainer;
    };
    EditableList.prototype.SetFirstDeleteButtonState = function () {
        var deleteButton = this.GetDeleteButton(0);
        if (this.NumRows() === 1) {
            deleteButton.style.visibility = "hidden";
        }
        else {
            deleteButton.style.visibility = "";
        }
    };
    return EditableList;
})();
var GridGenerator = (function () {
    function GridGenerator() {
    }
    GridGenerator.prototype.TotalNumberOfSquaresClaimed = function (participants) {
        var sum = 0;
        for (var _i = 0; _i < participants.length; _i++) {
            var participant = participants[_i];
            sum += participant.numberOfSquares;
        }
        return sum;
    };
    GridGenerator.prototype.GenerateNamesGrid = function (size, participants) {
        var grid = [];
        var namesPool = [];
        for (var _i = 0; _i < participants.length; _i++) {
            var participant = participants[_i];
            for (var i = 0; i < participant.numberOfSquares; i++) {
                namesPool.push(participant.name);
            }
        }
        for (var i = 0; i < size; i++) {
            grid.push([]);
            for (var j = 0; j < size; j++) {
                var position = Utilities.GetRandomInt(0, namesPool.length - 1);
                grid[i].push(namesPool[position]);
                namesPool.splice(position, 1);
            }
        }
        return grid;
    };
    return GridGenerator;
})();
var NameInfoList = (function () {
    function NameInfoList(container, participants, generateGridCallback) {
        var _this = this;
        this.container = container;
        this.generateGridCallback = generateGridCallback;
        this.listCtrl = new EditableList(container, false, function () { Utilities.SaveNamesToLocalStorage(_this.GetParticipants()); }, ["Participant Name", "# Squares"], 30);
        var addButton = document.createElement("button");
        addButton.className = "ListButton";
        addButton.innerHTML = "Add Participant";
        this.container.appendChild(addButton);
        addButton.onclick = function (evt) {
            _this.listCtrl.AddRow(_this.CreateBlankRow());
            Utilities.SaveNamesToLocalStorage(_this.GetParticipants());
            evt.preventDefault();
        };
        var generateGridButton = document.createElement("button");
        generateGridButton.className = "ListButton";
        generateGridButton.innerHTML = "Generate Grid";
        this.container.appendChild(generateGridButton);
        generateGridButton.onclick = function (evt) {
            _this.generateGridCallback(_this.GetParticipants());
            evt.preventDefault();
        };
        if (participants != null) {
            for (var _i = 0; _i < participants.length; _i++) {
                var nameInfo = participants[_i];
                var row = this.CreateBlankRow();
                row[0].value = nameInfo.name;
                row[1].value = nameInfo.numberOfSquares == null ? "" : nameInfo.numberOfSquares.toString();
                this.listCtrl.AddRow(row);
            }
        }
        else {
            this.listCtrl.AddRow(this.CreateBlankRow());
        }
    }
    NameInfoList.prototype.GetParticipants = function () {
        var participants = [];
        var participantsSet = {};
        for (var _i = 0, _a = this.listCtrl.GetAllRows(); _i < _a.length; _i++) {
            var row = _a[_i];
            var name = row[0].value;
            var numberOfSquares = parseInt(row[1].value);
            participantsSet[name] = true;
            participants.push({ name: name, numberOfSquares: numberOfSquares });
        }
        return participants;
    };
    NameInfoList.prototype.CreateBlankRow = function () {
        var nameInput = document.createElement("input");
        var numberInput = document.createElement("input");
        nameInput.className = "NameInput";
        numberInput.className = "NumberInput";
        return [nameInput, numberInput];
    };
    return NameInfoList;
})();
var TableBuilder = (function () {
    function TableBuilder() {
    }
    TableBuilder.prototype.GenerateDisplayTable = function (namesGrid, rowHeaders, columnHeaders, rowTeamImageName, columnTeamImageName) {
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
        for (var i = 0; i < namesGrid[0].length; i++) {
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
        for (var i = 0; i < namesGrid.length; i++) {
            var row = document.createElement("tr");
            table.appendChild(row);
            var rowHeaderCell = document.createElement("td");
            row.appendChild(rowHeaderCell);
            rowHeaderCell.innerHTML = rowHeaders[i].toString();
            for (var j = 0; j < namesGrid[0].length; j++) {
                var cell = document.createElement("td");
                row.appendChild(cell);
                cell.innerHTML = namesGrid[i][j].toString();
            }
        }
        return table;
    };
    return TableBuilder;
})();
var Utilities = (function () {
    function Utilities() {
    }
    Utilities.ShuffleArray = function (a) {
        for (var i = 0; i < a.length; i++) {
            var swapIndex = Utilities.GetRandomInt(0, a.length - 1);
            var temp = a[i];
            a[i] = a[swapIndex];
            a[swapIndex] = temp;
        }
        return a;
    };
    Utilities.GetRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Utilities.SaveNamesToLocalStorage = function (participants) {
        window.localStorage.setItem("names", JSON.stringify(participants));
    };
    return Utilities;
})();
