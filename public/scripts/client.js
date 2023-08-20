/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  
  const escape = function(string) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
  };

  const renderTweets = function(tweets) {
    for (let tweet of tweets) {
      let $tweet = createTweetElement(tweet);
      $("#tweets-container").prepend($tweet);
    }
  };
  
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

  // Fetches the Tweets
  const loadTweets = function() {
    $.ajax({
      type: "GET",
      url: "/tweets",
      dataType: "json",
      success: renderTweets
    });
  };
  loadTweets("/tweets", "GET", renderTweets);

  $("form").on("submit", function(event) {
    event.preventDefault();
    
    const text = $("#tweet-text").val();
      
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
    // Data serialization
    let serializedData = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "/tweets",
      data: serializedData,
    })

      .done(function() {
        loadTweets();
        $(".tweet-success").slideDown();
        $(".error-length").slideUp();
        $(".error-empty").slideUp();
        $("textarea").val("");
        $(".counter").text(140);
      })
      .fail(function() {
        console.log("Error!");
      })
      .always(function() {
        console.log("Finished!");
      });
  });
});