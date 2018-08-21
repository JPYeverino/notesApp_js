// Assert function for testing.
function assert(value, desc) {
    var li = document.createElement("li");
    li.className = value ? "pass" : "fail";
    li.appendChild(document.createTextNode(desc));
    document.getElementById("results").appendChild(li);
}

window.onload = function () {
    var button = document.getElementById("controls");
    var tContent = document.querySelector("#templNotes").content;
    var boardDiv = document.querySelector("#notesBoard");
    var save;


    //Retrieve stored notes from local Storage; if the notesData Arr has elements, the DOM is modified with the respective properties.
    if (localStorage.notes) {
        if (JSON.parse(localStorage.getItem("notes")).length > 0) {
            for (
                var i = 0;
                i < JSON.parse(localStorage.getItem("notes")).length;
                i++
            ) {
                var clone = tContent.cloneNode(true);
                clone.querySelector(".note").id = JSON.parse(
                    localStorage.getItem("notes")
                )[i].noteID;
                clone.querySelector(".input1").textContent = JSON.parse(
                    localStorage.getItem("notes")
                )[i].content;
                clone.querySelector(".createD").textContent = "Created: " + JSON.parse(
                    localStorage.getItem("notes")
                )[i].creationDate;
                clone.querySelector(".modifyD").textContent = "Modified: " + JSON.parse(
                    localStorage.getItem("notes")
                )[i].modifyDate;
                boardDiv.appendChild(clone);
            }
        }
    }
    //Add the event listener to the 'New Note' button.
    button.addEventListener("click", function () {
        var clone = tContent.cloneNode(true);
        var d = new Date();
        var id = d.getTime();
        var creationDate = new Date(id).toUTCString();
        board.createNote(id, creationDate);
        clone.querySelector(".createD").textContent = "Created at: " + creationDate;
        clone.querySelector(".note").id = id;
        boardDiv.appendChild(clone);
    });

    //Function to  get the input changes on the note.
    function inputListening(e) {
        var actualNoteId = e.target.parentNode.id;
        var actualNoteContent = e.target.textContent;

        if (save) {
            clearTimeout(save);
            console.log("cancel save");
            save = setTimeout(function () {
                var date = new Date();
                var d = date.getTime();
                var modifyDate = new Date(d).toUTCString();
                board.saveNote(actualNoteId, actualNoteContent, modifyDate);
                e.target.parentNode.querySelector(".modifyD").textContent =
                    "Modified: " + modifyDate;
            }, 1000);
        } else {
            save = setTimeout(function () {
                var date = new Date();
                var modifyDate = date.getTime();
                board.saveNote(actualNoteId, actualNoteContent, modifyDate);
                e.target.parentNode.querySelector(".modifyD").textContent =
                    "Saved: " + modifyDate;
            }, 1000);
        }
    }
    //Add the event listener for each input on the note content using event delegation.
    boardDiv.addEventListener("input", inputListening);

    //Callback function for the "remove button" note from the DOM and from the DB
    function closeNoteBtn(e) {
        var actualNoteId = e.target.parentNode.id;
        //Ensures that the element being clicked is the closing button.
        if (e.target.className != "closebtn") {
            return;
        } else {
            board.removeNote(actualNoteId);
            boardDiv.removeChild(e.target.parentNode);
            console.dir(e.target);
        }
    }

    //Add the envent listener for the closing button using event delegation.
    boardDiv.addEventListener("click", closeNoteBtn);

    // Function to create a Board, which will contain all the note objects.
    var Board = function () {

        var notesData;

        //This detects the content of localStorage; if it has any content, it is transfered to notesData array, if it is not, notesData aray is created.
        if (localStorage.notes) {
            notesData = JSON.parse(localStorage.getItem("notes"));
            console.dir(notesData);
        } else notesData = [];

        //Function that creates a new note Object and push it to the notesData array.
        var createNote = function (id, date) {
            var noteData = {};

            noteData.noteID = id.toString();
            noteData.content = "";
            noteData.creationDate = date;
            noteData.modifyDate = "";

            notesData.push(noteData);
            JSONreadyNotes = JSON.stringify(notesData);
            localStorage.setItem("notes", JSONreadyNotes);
            
            return this;
        };

        //Function that saves the modified Note.
        var saveNote = function (id, content, savedDate) {
            if (findNote(id) >= 0) {
                notesData[findNote(id)].content = content;
                notesData[findNote(id)].modifyDate = savedDate;
                JSONreadyNotes = JSON.stringify(notesData);
                localStorage.setItem("notes", JSONreadyNotes);
                console.dir(localStorage.getItem("notes"));
            } else console.log("not found");
            
            return this;
        };

        //Function that helps to find the index of a note by the given ID.
        var findNote = function (id) {
            for (var i = 0; i < notesData.length; i++) {
                if (notesData[i].noteID === id.toString()) {
                    return i;
                }
            }
            return -1;
        };

        //Function that deletes a note from de notesData array when it is removed from the DOM.
        var removeNote = function (id) {
            if (findNote(id) >= 0) {
                notesData.splice(findNote(id), 1);
                JSONreadyNotes = JSON.stringify(notesData);
                localStorage.setItem("notes", JSONreadyNotes);
            } else console.log("not found to remove");

            return this;
        };

        return {
            createNote: createNote,
            findNote: findNote,
            saveNote: saveNote,
            removeNote: removeNote
        };
    }; //Finishing Board();

    //Create a Notes Board
    var board = Board();
};
