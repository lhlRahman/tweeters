$(document).ready(function() {
  
  let textarea = $("textarea");
  textarea.on("input", function() {
    const NumOftweets = 140 - $(this).val().length;


    $(".counter").html(`${NumOftweets}`)

    if (NumOftweets < 0) {
      $(".counter").addClass("counter-invalid");
    } else {
      $(".counter").removeClass("counter-invalid")
    }

  });
  
});