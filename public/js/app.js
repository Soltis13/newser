//all js in document ready function
$(document).ready(() => {

  //(on click of 'addArticle")
  //************************************************************
  $(".addArticle").on("click", function(event) {
    event.preventDefault();

    // Save the article to the data base
    var article = {
      //headline - aritlelink - summary - url - date
        headline: $(this).attr("data-headline"),
        link: $(this).attr("data-link"),
        summary: $(this).attr("data-summary"),
        imageURL: $(this).attr("data-imageURL"),
        articleDate: $(this).attr("data-articleDate")
    }
    $.ajax({
      method: "POST",
      url: "/saveArticle",
      data: article
    })
    .then ((data) => {
      // Display modal with 'article saved'
      $("#alert-msg").text("Article Saved!")
      $(".alert").show();
    })
  })



  // (on click of deleteArticle class) Delete article
  //************************************************************
  $(".deleteArticle").on("click", function(event) {
    event.preventDefault();

    var id = $(this).attr("data-id")
    $.ajax({
      method: "DELETE",
      url: `/article/${id}`
    })
    .then ((data) => {
      // Display modal with 'article delete'
      $("#alert-msg").text("Article Deleted!")
      $(".alert").show();
      location.reload();
    })
  })

  // Close any alert shown on the screen
  //************************************************************
  $('.close').click(function() {
    $('.alert').hide();
  })

  // (on click of showNote) 
  //************************************************************
  $(".showNote").on("click", function (event) {
    event.preventDefault();

    // Empty the notes from the note section
    $(".modal-body").empty();
    $(".modal-title").text($(this).attr("data-headline"))
    $("#savenote").attr("data-id",$(this).attr("data-id"))

    // Save the article id from note class
    const articleId = $(this).attr("data-id");


    // Now make an ajax call for the notes
    $.ajax({
      method: "GET",
      url: `/notes/${articleId}`
    })
    // With that done, add the note information to the page
    .then(function(data) {
      //TODO
      //create notes array
      //foreach note found, display out in div
      //reference model-body for add comment and add name

    });
  });
//TODO on click of saveNote
  ////pull data-id
  //ajax post request for /note
  //.then clear model body

//ToDO on click of deleteNote
    //pull data-id
    //ajax post call delete
    //


  // (on click of saveNote)
  //************************************************************
  $(document).on("click", "#saveNote", function() {
    
  })

  // (on click of delete-note) 
  //************************************************************
  $(document).on("click", ".delete-note", function(event) {

  })
})