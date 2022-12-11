import { API_KEY } from './requestAPI';

export const markup = {
  
  MOVIE_NAME_LENGTH_LIMIT : 35,
  nameGenre: {},

  gallery(data, genresDataBase) {
    //--------создаем нормализированную базу жанров ------//

    for (const elem of genresDataBase.genres) {
      const id = Object.values(elem)[0];
      const name = Object.values(elem)[1];

      markup.nameGenre = { ...markup.nameGenre, [id]: name };
    }

    //------------------------------------------------------//
    const { results } = data;

    //--------------запускаем редьюс для создания разметки-------------------------------------//
    return results.reduce((acc, film) => {
      //-------запускаем цикл для поска совпадений по жарнрам нормализированной базы и текущих жанров-----------//

      const genresName = [];
      let genre = ``;

      for (const elem of film.genre_ids) {
        if (
          !markup.nameGenre[`${elem}`] ||
          markup.nameGenre[`${elem}`].length > 10
        ) {
          continue;
        }

        genresName.push(markup.nameGenre[`${elem}`]);
      }

      genre =
        genresName.length > 2
          ? genresName.slice(0, 2).join(', ') + `, ...`
          : genresName.slice(0, 2).join(', ');

      //---------------------------------------------------------//
      const defaultUrl =
        'https://cdn-www.comingsoon.net/assets/uploads/2014/09/file_123131_0_defaultposterlarge.jpg';
      const url = film.poster_path
        ? `https://image.tmdb.org/t/p/w500${film.poster_path}?api_key=${API_KEY}&language=en-US"`
        : defaultUrl;
      //----------------возвращаем аккумулированную разметку в метод редьюс---------------//
      return (acc += `<li class="gallery__item" data-id=${film.id}>
      <a class="film" href="#">
        <div class="film__image--wrapper">
          <img
            class="film__image"
            src=${url}
            alt="${film.title || film.name}"
            loading = 'lazy'/>
        </div>
        <div class="film__meta">
          <p class="film__title js-tooltip"><span class="js-tooltiptext">${
            film.title || film.name
          }</span>${cutLongMovieName(film.title || film.name)}</p>
          <p class="film__description">
            <span class="film__genre">${genre || `Other`}</span>
            <span class="film__year">${parseInt(
              film.release_date || film.first_air_date
            )}</span>
            <span class="film__rating">${film?.vote_average?.toFixed(1)}</span>
          </p>
        </div>
      </a>
    </li >`);
    }, '');
  },
};

function cutLongMovieName(name) {
  
  if (name.length < MOVIE_NAME_LENGTH_LIMIT) {
    return name;
  }
  if (name.length >= MOVIE_NAME_LENGTH_LIMIT) {
    return name.slice(0, MOVIE_NAME_LENGTH_LIMIT - 4) + '...';
  }
}
