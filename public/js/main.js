$(document).ready(function () {
    // $getJSON("/new", (data) => {})

    // =============== click clear News button ===============
    $("#clearBtn").on("click", () => {
        $.ajax({
            method: "DELETE",
            url: "/clear"
        })
            .then(function (data) {
                window.location.reload();
            });
    });

    // =============== click Scrape News button ===============
    $("#scrapeBtn").on("click", () => {
        $.ajax({
            method: "POST",
            url: "/scrape"
        })
            .then(function (data) {
                window.location.reload();
            });
    });

    // =============== click save button to save news ===============
    $(document).on("click", ".saveBtn", function () {
        let thisId = $(this).attr("data-ObjectId");
        let thisTitle = $(this).attr("data-Title");

        $.ajax({
            method: "PUT",
            url: "/save/" + thisId,
            data: thisTitle
        })
            .then(function (data) {
                window.location.reload()
            });
    });

    // =============== click unSave button to un-save news ===============
    $(document).on("click", ".unSaveBtn", function () {
        let thisId = $(this).attr("data-ObjectId");

        $.ajax({
            method: "PUT",
            url: "/unsave/" + thisId
        })
            .then(function (data) {
                window.location.reload()
            });
    });

    // =============== click note button to pop-up page ===============
    $(document).on("click", ".noteBtn", function () {
        $(".popUp").fadeIn();
        $(".noteList").empty();

        let thisId = $(this).attr("data-ObjectId");
        $(".submitNoteBtn").attr("data-id", thisId);
        // console.log(thisId);

        $.ajax({
            method: "GET",
            url: "/note/" + thisId
        })
            .then(function (data) {
                // console.log(data);

                if (data.note) {
                    data.note.forEach((eachNote) => {
                        $(".noteList").prepend('<li class="newLi">' + eachNote.note + '<button class="btn btn-sm hvr-icon-rotate delNoteBtn" data-id="' + eachNote._id + '"><i class="fas fa-trash hvr-icon"></i></button>');
                    })
                }
            })
    });

    // =============== click note-submit button to post a new note ===============
    $(document).on("click", ".submitNoteBtn", function () {
        event.preventDefault();
        let writeNote = $("#writeNote").val().trim();
        let noteId = $(this).attr("data-id");
        // console.log(noteId);

        if (writeNote.length > 0) {
            $.ajax({
                method: "POST",
                url: "/post/" + noteId,
                data: { note: writeNote }
            })
                .then(function (data) {
                    $("#writeNote").val("");
                    $.ajax({
                        method: "GET",
                        url: "/note/" + noteId
                    })
                        .then(function (data) {
                            $(".noteList").empty();
                            data.note.forEach((eachNote) => {
                                $(".noteList").prepend('<li class="newLi">' + eachNote.note + '<button class="btn btn-sm hvr-icon-rotate delNoteBtn" data-id="' + eachNote._id + '"><i class="fas fa-trash hvr-icon"></i></button>');
                            })
                        })
                });
        }
    });

    // =============== click note-delete button to delete note ===============
    $(document).on("click", ".delNoteBtn", function () {
        let noteId = $(this).attr("data-id");

        $.ajax({
            method: "DELETE",
            url: "/delete/" + noteId,
        })
            .then(function (data) {
                console.log(data._id)

                $.ajax({
                    method: "GET",
                    url: "/note2/" + data._id
                })
                    .then(function (data) {
                        $(".noteList").empty();
                        data.note.forEach((eachNote) => {
                            $(".noteList").prepend('<li class="newLi">' + eachNote.note + '<button class="btn btn-sm hvr-icon-rotate delNoteBtn" data-id="' + eachNote._id + '"><i class="fas fa-trash hvr-icon"></i></button>');
                        })
                    })
            });
    });

    // =============== click X to close pop-up page ===============
    $(document).on("click", ".close", function () {
        $(".popUp").fadeOut();
    });

    // =============== toggle ===============
    $(".smile").on('click', function () {
        if ($(this).attr("data-switch") == "off") {
            $(".list-group").css("background-color", "rgba(255, 255, 255, .9)");
            $(".news-title").css("color", "rgba(0, 0, 0, .9)");
            $("body").css('background-image', 'url(../../../css/2.jpg)');
            $("body").css('background-attachment', 'fixed');
            $(this).attr("data-switch", "on");
        } else {
            $(".list-group").css("background-color", "rgba(0, 0, 0, .9)");
            $(".news-title").css("color", "rgba(255, 255, 255, .9)");
            $("body").css("background", "url(../../../css/1.jpg)");
            $("body").css('background-attachment', 'fixed');
            $(this).attr("data-switch", "off");
        }
    })

})
