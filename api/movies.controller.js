import MoviesDAO from "../dao/moviesDAO.js";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const moviesPerPage = req.query.moviesPerPage
      ? parseInt(req.query.moviesPerPage)
      : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    let filters = {};
    if (req.query.rated) {
      filters.rated = req.query.rated;
    } else if (req.query.title) {
      filters.title = req.query.title;
    }
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
      page,
      moviesPerPage,
    });

    let response = {
      movies: moviesList,
      page: page,
      filters: filters,
      entries_per_page: moviesPerPage,
      total_results: totalNumMovies,
    };
    res.json(response);
  }
}
/*
Whe apiGetMovies is called via a URL, there will be a query string in the
response object (req.query) where certain filter parameters might be specified
and passed in through key-value pairs. For e.g. we have a url.
*/