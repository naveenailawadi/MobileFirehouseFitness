// create a function for throwing form errors
function throwFormError(message)
{
  // get the error field
  var formErrors = $('#formErrors');
  formErrors.empty();
  new_error = '<p class="submission-error">' + message + '</p>'
  formErrors.append(new_error);
}

$('#reviewForm').submit(function (e) {
    e.preventDefault();

    // load all the data
    var nameInput = $('#nameInput');
    var reviewInput = $('#reviewInput');
    var starInput = $('#starInput');

    // get the errors to be able to empty them later
    var formErrors = $('#formErrors');

    // check the inputs to throw errors
    if (nameInput.val().length == 0) {
      throwFormError('Please include your name.');
    }
    else if (reviewInput.val().length == 0) {
      throwFormError('Please write a review.')
    }
    else {
      // send the review via ajax
      $.ajax({
              type: 'POST',
              // THIS WILL NEED TO BE CHANGED!!!
              url: "https://mobilefirehousefitness.com/ReviewManagement",
              data: JSON.stringify(
                {
                    name: nameInput.val(),
                    review_text: reviewInput.val(),
                    stars: starInput.val();
                }),
              success: function (response) {
                // empty the errors
                $('#formErrors').empty();

                // empty the form
                $('form').find("input[type=text], textarea").val("");

                // submit a success message
                $('#submitField').append('<p>Your submission has been recorded. We will contact you soon!</p>');
              },
              error: function () {
                alert('Error in submitting your review. Try again later.');
              }
        });
    }

});
