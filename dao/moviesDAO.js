let movies;

export default class MoviesDAO {
  static async injectDB(conn) {
    // Check if the movies collection is already defined.
    if (movies) {
      return;
    }

    try {
      // Connect to the movies collection using the provided connection.
      movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection("movies");
    } catch (e) {
      // Log an error message if connection fails.
      console.error(`Unable to connect in MoviesDAO: ${e}`);
    }
  }

  static async getMovies({
    //default filter
    filters = null,
    page = 0,
    moviesPerPage = 20, //will only get 20 movies at once
  } = {}) {
    let query;

    // Check if filters are provided
    if (filters) {
      // Check if the title filter is present
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } };
      } else if ("rated" in filters) {
        query = { rated: { $eq: filters["rated"] } };
      }
    }

    let cursor;

    try {
      // Retrieve movies based on the query
      cursor = await movies
        .find(query)
        .limit(moviesPerPage)
        .skip(moviesPerPage * page);

      // Convert cursor to array
      const moviesList = await cursor.toArray();

      // Count total number of movies based on the query
      const totalNumMovies = await movies.countDocuments(query);

      return { moviesList, totalNumMovies };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);

      return { moviesList: [], totalNumMovies: 0 };
    }
  }
}

/*
We then get the total number of movies by counting the number of documents
in the query and return moviesList and totalNumMovies in an object.
*/
