$(document).ready(function(){
  $(".translator-section #translateButton").click(function(){
    var sentence = $(".translator-section #inputText").val().trim();
    var translationDirection = $(".translator-section #translationDirection").val();
    var processingMessage = $(".translator-section .processing-message");
    var spinner = $(".translator-section .spinner");

    // Check word count
    var words = sentence.split(' ').filter(function(word) {
      return word.length > 0;
    });

    if (words.length > 15) {
      alert("Please enter words less than 15. Your current word count is " + words.length + ".");
      return;
    }

    if (words.length < 3) {
      alert("Please enter 3 or more words. Your current word count is " + words.length + ".");
      return;
    }

    if (sentence.length === 0) {
      alert("Please enter some text.");
      return;
    }

    // Show processing message and spinner
    processingMessage.show();
    spinner.addClass("spin");

    $.ajax({
      type: "POST",
      url: "https://translator-2s4k4qopcq-as.a.run.app/predict?translation_direction=" + encodeURIComponent(translationDirection),
      data: JSON.stringify({sentence: sentence}),
      contentType: "application/json",
      dataType: "json",
      success: function(data) {
        if (data.error) {
          $("#errorModalMessage").text(data.error);
          $("#errorModal").modal("show");
          $("#outputText").val("");
        } else if (data.warning) {
          $("#errorModalMessage").text(data.warning);
          $("#errorModal").modal("show");
          $("#outputText").val("");
        } else {
          $("#outputText").val(data.prediction);
        }

        // Hide processing message and spinner
        processingMessage.hide();
        spinner.removeClass("spin");
      },
      error: function(err) {
        console.log(err);
        alert("There was an error. Try again later.");

        // Hide processing message and spinner
        processingMessage.hide();
        spinner.removeClass("spin");
      }
    });
  });

  // This is the  delete button click event handler
  $(".translator-section #deleteButton").click(function() {
    $(".translator-section #inputText").val('');
    $(".translator-section #outputText").val('');
  });

  // Copy button click event handler
  $(".translator-section #copyButton").click(function() {
    var copyText = document.getElementById("outputText");
    copyText.select();
    copyText.setSelectionRange(0, 99999);  // For mobile devices
    document.execCommand("copy");
    //alert("Text copied in the clip!");
  });
});