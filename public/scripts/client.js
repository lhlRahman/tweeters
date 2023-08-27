/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  
  // Function to escape any potentially unsafe characters to prevent Cross-Site Scripting (XSS) attacks
  const escape = function(string) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
  };

  // Function to render tweets to the page
  const renderTweets = function(tweets) {
    $("#tweets-container").empty(); // Clear the container to avoid duplicates
    for (let tweet of tweets) {
      let $tweet = createTweetElement(tweet);
      $("#tweets-container").prepend($tweet);  // Add each tweet to the top of the container
    }
  };
  
  // Function to create a tweet DOM element from a tweet data object
  const createTweetElement = function(tweet) {
    const  { user, content, created_at } = tweet;

    let $tweet = `
      <article class="tweet">
        <header>
          <div class="avatar-container">
            <img src=${escape(user.avatars)}
            <span class="name">${escape(user.name)}</span>            
          </div>
          <span class="handle">${escape(user.handle)}</span>
        </header>
        <span class="user-tweet">${escape(content.text)}</span>
        <footer>
          <span class="creation-date">${timeago.format(created_at)}</span> 
          <div class="icons">
            <i class="fa-solid fa-flag"></i>
            <i class="fa-sharp fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart"></i>
          </div>
        </footer>
      </article>
    `;
    return $tweet;
  };

  // Function to fetch tweets from the server
  const loadTweets = function() {
    $.ajax({
      type: "GET",
      url: "/tweeter/tweets",
      dataType: "json",
      success: renderTweets
    });
  };

  // Initially load tweets when the page loads
  loadTweets("/tweeter/tweets", "GET", renderTweets);

  // Event listener for the tweet submission form
  $("form").on("submit", function(event) {
    event.preventDefault();  // Prevent default form submission behavior
    
    const text = $("#tweet-text").val();
      
    // Check if the tweet is too long or empty and show the appropriate error message
    if (text.length > 140) {
      $(".error-empty").slideUp();
      $(".tweet-success").slideUp();
      $(".error-length").slideDown();
      return;
    }
    if (text.length === 0) {
      $(".error-length").slideUp();
      $(".tweet-success").slideUp();
      $(".error-empty").slideDown();
      return;
    } else {
      $(".error-length").slideUp();
      $(".error-empty").slideUp();
    }

    // Serialize the form data for submission
    let serializedData = $(this).serialize();

    // Submit the tweet to the server
    $.ajax({
      type: "POST",
      url: "/tweeter/tweets",
      data: serializedData,
    })
      .done(function() {
        loadTweets();  // Reload tweets after successful submission
        $(".tweet-success").slideDown();  // Show success message
        $(".error-length").slideUp();
        $(".error-empty").slideUp();
        $("textarea").val("");  // Clear the textarea
        $(".counter").text(140);  // Reset the character counter
      })
      .fail(function() {
        console.log("Error!");  // Log error message on failure
      })
      .always(function() {
        console.log("Finished!");  // Log message once AJAX call is completed
      });
  });
});
