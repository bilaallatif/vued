# Primary

## Requirements
* login/register process
  * username/password
  * authenticate via JWT
* profile system
  * username, bio, profile picture
  * favourite: director, movie, show
* user content
  * movie/show reviews
  * components:
    * movie, title, text, rating(5 stars)
* user - content interaction
  * likes, comments

## Page by page
* login
* register
* my account
  * profile info
  * my reviews
    * CRUD
  * new review
    * search for movies (and select)
    * creation page
        * Title, review desc, rating
* home
  * listed display of recent reviews (movie poster thumbnails)
  * can eventually show by popularity within the week
  * search by review title/review
* users
  * search by username
* other user page
  * Same as my profile (read-only)

## Scoping
* API to index movies/tv
  * TMDB
    * can index movies by title
    * can access associated movie posters
    * this is what letterboxd uses officially
  * will require some form of caching for key efficiency
    *  essentially use our db as a cache
    * this is actually best done on a request by request basis
    * we want to have a local copy of movies relevant to our users
      * we refernce movies only by our local 'cache'
    * this means we only query TMDB when it doesn't exist in our DB
    * we can invalidate this 'cache' as often as we want
      * honestly this can be cached for a while since move metadata doesn't typically change
    * could have a daily job to remove movie records that are no longer used

## Schema
* user
  * id, profile_id(unique), username, password
* profile
  * id, bio, profile_pic_url, answers...
* review
  * id, movie_id, profile_id, title, desc, rating, likes(pid[]), date
* comment
  * review_id, profile_id, desc, date
* movie
  * id, tmdb_id(unique), title, overview, poster_path(served by CDN i.e. no charge)

### Relations
* user - profile (1-1) "user-profile"
* profile - review (1-many) "profile-review"
* review - movie (many-1) "review"
* review - profile (many - many) "likes"
* review - comment (1-many) "review-comments"
* profile - comment (1-many) "comment"
* movie - TMDB ref (1-1) (virtual)

## Visual
* cinema warmth colour scheme (red, yellow, orange, black)
* very minimalist
* soft shadows

# Extensions
* following/follower system
  * home feed based on followers/following