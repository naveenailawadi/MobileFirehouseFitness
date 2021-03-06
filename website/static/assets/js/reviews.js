const MIN_STARS = 1;
const MAX_STARS = 5;

// function toggleChecked(el) {
//   if(el.classList.contains('checked')) {
//     el.classList.remove('checked');
//   } else {
//     el.classList.add('checked');
//   }
// };

function toggleRating(el) {
  const inpId = el.getAttribute('for');
  const starInp = document.getElementById(inpId);
  const rating = parseInt(inpId.replace('star', ''));
  const isChecked = (starInp.getAttribute('checked') === 'true');

  // if already checked reset rating
  const stars = document.querySelectorAll('#starInput label');
  stars.forEach(star => {
    if (Number(star.getAttribute('value')) > Number(el.getAttribute('value'))) {
      star.classList.remove('checked');
      starInp.setAttribute('checked', false);
    }
    else {
      star.setAttribute('checked', true);
      star.classList.add('checked');
    }
  });
};


// create a function to add reviews based on the dropdown menus
function addReviews() {
  // get the value of the dropdowns
  var sortingDropdown = $('#sortingDropdown');
  var limitDropdown = $('#limitDropdown');
  var pastReviewSection = $('#pastReviewSection');

  // get the review template
  var reviewTemplate = $('#reviewTemplate').html();

  // create variable for the date
  var date = new Date();

  // get the correct number of reviews from the API
  $.ajax({
    type: 'POST',
      url: "https://api.mobilefirehousefitness.com/ReviewDisplay",
      data: JSON.stringify(
        {
            min_stars: 1,
            sort_by: sortingDropdown.val(),
            limit: limitDropdown.val()

        }),
      success: function (response) {
        // empty the old reviews
        pastReviewSection.children(":not(#newReview)").remove();

        // add each review
        newReviews = response['reviews'];
        for (var i in newReviews) {
          review = newReviews[i];
          date = new Date(Number(review.creation_date) * 1000);
          review['date'] = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
          reviewElement = $(Mustache.render(reviewTemplate, review));


          // add stars to the review element
          var starSection = reviewElement.find('#starSection');
          var count = 0;

          while (count < review.stars) {
            $('<span class="fa fa-star checked"></span>').insertBefore(reviewElement.find('#dateSection'));
            count += 1;
          }

          // add non stars
          while (count < MAX_STARS) {
            $('<span class="fa fa-star"></span>').insertBefore(reviewElement.find('#dateSection'));
            count += 1;
          }


          reviewElement.insertBefore($('#newReview'));
        }

      },
      error: function () {
        alert('Error in loading reviews. Try again later.');
      }
  });


  return false;
}

// create a function for throwing form errors
function throwFormError(message)
{
  // get the error field
  var formErrors = $('#formErrors');
  formErrors.empty();
  new_error = '<p class="submission-error">' + message + '</p>';
  formErrors.append(new_error);
}


// handle submit form submissions
$('#reviewForm').submit(function (e) {
    e.preventDefault();
    const form = document.querySelector("form");
    var data = new FormData(form);

    // load all the data
    var nameInput = $('#nameInput');
    var reviewInput = $('#reviewInput');

    // get the errors to be able to empty them later
    var formErrors = $('#formErrors');

    // check the inputs to throw errors
    if (nameInput.val().length == 0) {
      throwFormError('Please include your name.');
    }
    else if (reviewInput.val().length == 0) {
      throwFormError('Please write a review.');
    }
    else {
      // send the review via ajax
      $.ajax({
              type: 'POST',
              url: "https://api.mobilefirehousefitness.com/ReviewManagement",
              data: JSON.stringify(
                {
                    name: nameInput.val(),
                    review_text: reviewInput.val(),
                    stars: $('label.checked').length
                }),
              success: function (response) {
                // empty the errors
                $('#formErrors').empty();

                // empty the form
                $('form').find("input[type=text], textarea").val("");

                // submit a success message
                $('#submitField').append('<p>Thank you for your review!</p>');

                // reload the reviews
                addReviews();

              },
              error: function () {
                alert('Error in submitting your review. Try again later.');
              }
        });
    }
});


function rate5() {
  const star5 = document.querySelectorAll('#starInput label[for="star5"]')[0];
  toggleRating(star5)
}


// function to reload reviews on changes
$('#sortingDropdown').change(function (e) {
  e.preventDefault();
  addReviews();
});

// function to reload reviews on changes
$('#limitDropdown').change(function (e) {
  e.preventDefault();
  addReviews();
});


// perform some functions on document load
$(document).ready(function () {
  addReviews();
  rate5();
});


