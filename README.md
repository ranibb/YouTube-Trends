## Project Assessment:
YouTube Trends is a front-end application that was developed in a hurry to show the latest video trends from YouTube.

## New features:
Right now it's showing the latest trends only for the United States, but we would like to have a possibility of selecting a specific country to see the latest trends there. Also, we want to specify a category of trending videos, selector is already added in filters, but categories are hardcoded, we want to fetch it from Youtube API, see (https://developers.google.com/youtube/v3/docs/videoCategories/list). The last thing is that we want to implement "infinite scroll", so more videos should be loaded when we scroll to the bottom of the page.

## Bug fix:
* When you mouse over the video, you can see on every element of the page "Likes", but it shows always 0, please fix it.
* When we're trying to open some video to play it doesn't work and shows some errors in console, please fix these bugs.
* Slide-nav button (gear) is broken, when you click on it, nothing happens, but it should open filters, please fix it.
* When slide-nav is opened, the close button is also didn't work, fix it also.
* On filters slide-nav, we have "Count of videos on the page" slider, if we trying to select more than 50 videos on the page it throws the error. But expected behavior that we can select more than 50 videos (ex. 148 or 200) and see results on the main page
* When we open the video on a separate page, filters button should be hidden.
* In case if passed wrong video id, the user should be redirected on a page with youtube videos list.
* Selected filters should be saved, so after we will refresh the page, filters should be the same as we chose before.

## Notes:
* List of countries can be found in the app.config file
* List of categories should be loaded from Youtube API
* You may add new dependencies in package.json (if needed)

## Tasks:
* Implement country search and switch YouTube trends by selected country with autocomplete feature in slide-filters.component
* Implement Category selection and show YouTube trends by selected category with autocomplete feature in slide-filters.component
* Implement Infinite scroll and append more videos to the bottom of the page
* Fix bug with likes count
* Fix bug with showing video on a separate page
* Fix bug with opening filter navigation slide
* Fix bug with closing filter navigation slide
* Fix bug with selecting count of videos on the main page, that user be able to select more than 50 videos on the page
* Filters button should be hidden when opened video page
* In case if passed wrong video id, the user should be redirected on a page with youtube videos list
* Filters should be the same as selected before on page refresh
* Unit tests coverage should be not less than 70%, higher -> better

## PLEASE NOTE THAT ALL THE TASKS LISTED ABOVE ARE MANDATORY. We'll be evaluating your submission from the following perspectives:
* Code quality and best practices
* Implementation of new feature
* Bug fixes
* Unit Tests

## Prerequisites:
Any IDE
Node.js v8.9+
NPM v5+

## How to deliver :
This is how we are going to access and evaluate your submission, so please make sure to go through the following steps before submitting your answer.

1) Make sure to run unit tests, ensure that the application is compiling and all dependencies are included.
2) Zip the project without node_modules folder and store it in a shared location where Crossover team can access and download the project for evaluation, and add a link to the shared file in the answer field of this question.