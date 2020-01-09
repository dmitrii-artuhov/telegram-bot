// Deploy https://itnext.io/part-2-deploying-a-telegram-bot-using-now-building-a-bookmark-manager-bot-series-9304104a64ae
// Node
const axios = require('axios');
//const config = require('./config.json');
const config = {};
// Telegram
const TelegramBot = require('node-telegram-bot-api');
const token = config.BOT_TOKEN || process.env.BOT_TOKEN; 
const bot = new TelegramBot(token, {polling: true});
// Mongoose
const mongoose = require('mongoose');
const MovieList = require('./models/MovieList');
const WatchList = require('./models/WatchList');

mongoose.connect(config.MongoURI || process.env.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB...');
  })
  .catch((err) => {
    console.log(err);
  });

//start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  // 🔥 ⭐️🌎🚀📅🔷🔹🧩🎮🌟⏱💡🏷📆🗓🗒
  bot.sendMessage(chatId, 
`Here is what you can ask me:\n
🔹 /search + movie title - Get a brief review for the searched movie.
🔥 /trending - View the list of top 20 ranked movies for the past week.
🚀 /upcoming - View recently published and future movies.
⭐️ /toprated - View top 20 films of all times.
🗓 /watchlist - Set up your watchlist.
🎮 /genres - View most popular movies for the particular genre.`
  );
});

// search
bot.onText(/\/search (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const title = match[1];
  
  bot.sendMessage(chatId, 'Loading...');
  
  axios.get('https://api.themoviedb.org/3/search/movie/', {
    params: {
      api_key: config.TMDB_API_KEY || process.env.TMDB_API_KEY,
      language: 'en-US',
      query: title,
      page: 1
    }
  })
    .then((res) => {
      if(!res.data.results.length) {
        return bot.sendMessage(chatId, 'Nothing found, please check the movie title for typos.');
      }

      // save to MongoDB
      // removing old movies record
      MovieList.findOneAndRemove({ userId: chatId })
        .catch((err) => {
          console.log(err);
        });

      // adding a new one
      const List = new MovieList({
        userId: chatId,
        movies: [...res.data.results]
      });

      List.save()
        // .then(() => {
        //   console.log('Saved to MongoDB');
        // })
        .catch((err) => {
          console.log(err);
        });

      // send a reply to the user
      let output = 'Pick the one you are looking for:\n';
      res.data.results.forEach((movie, index) => {
        output += `/${index + 1} ${movie.title} - ${movie.release_date.slice(0, 4)}\n`;        
      });

      bot.sendMessage(chatId, output);
    })
    .catch((err) => {
      console.log(err);
      bot.sendMessage(chatId, 'Nothing found, please check the movie title for typos.');
    })
});

// send tranding movies
bot.onText(/\/trending/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Loading...');
  
  axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${config.TMDB_API_KEY || process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1`)
    .then((res) => {
      // save to MongoDB
      // removing old movies record
      MovieList.findOneAndRemove({ userId: chatId })
        .catch((err) => {
          console.log(err);
        });

      // adding a new one
      const List = new MovieList({
        userId: chatId,
        movies: [...res.data.results]
      });

      List.save()
        // .then(() => {
        //   console.log('Saved to MongoDB');
        // })
        .catch((err) => {
          console.log(err);
        });

      // send a reply to the user
      let output = '';

      res.data.results.forEach((movie, index) => {
        output += `/${index + 1} ${movie.title}\n`;        
      });

      bot.sendMessage(chatId, output);
    })
    .catch((err) => {
      console.log(err);
      bot.sendMessage(chatId, 'Something went kinda wrong');
    });
});

// send upcoming movies
bot.onText(/\/upcoming/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Loading...');
  
  axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${config.TMDB_API_KEY || process.env.TMDB_API_KEY}&language=en-US&page=1`)
    .then((res) => {
      // save to MongoDB
      // removing old movies record
      MovieList.findOneAndRemove({ userId: chatId })
        .catch((err) => {
          console.log(err);
        });

      // adding a new one
      const List = new MovieList({
        userId: chatId,
        movies: [...res.data.results]
      });

      List.save()
        // .then(() => {
        //   console.log('Saved to MongoDB');
        // })
        .catch((err) => {
          console.log(err);
        });

      // send a reply to the user
      let output = '';

      res.data.results.forEach((movie, index) => {
        output += `/${index + 1} ${movie.title}\n`;        
      });

      bot.sendMessage(chatId, output);
    })
    .catch((err) => {
      console.log(err);
      bot.sendMessage(chatId, 'Something went kinda wrong');
    });
});

// send top ranked movies
bot.onText(/\/toprated/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Loading...');
  
  axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${config.TMDB_API_KEY || process.env.TMDB_API_KEY}&language=en-US&page=1`)
    .then((res) => {
      // save to MongoDB
      // removing old movies record
      MovieList.findOneAndRemove({ userId: chatId })
        .catch((err) => {
          console.log(err);
        });

      // adding a new one
      const List = new MovieList({
        userId: chatId,
        movies: [...res.data.results]
      });

      List.save()
        // .then(() => {
        //   console.log('Saved to MongoDB');
        // })
        .catch((err) => {
          console.log(err);
        });

      // send a reply to the user
      let output = '';

      res.data.results.forEach((movie, index) => {
        output += `/${index + 1} ${movie.title}\n`;        
      });

      bot.sendMessage(chatId, output);
    })
    .catch((err) => {
      console.log(err);
      bot.sendMessage(chatId, 'Something went kinda wrong');
    });
});

// output available genres
bot.onText(/\/genres/, (msg) => {
  const chadId = msg.chat.id;
  let genres = [];

  axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${config.TMDB_API_KEY || process.env.TMDB_API_KEY}&language=en-US`)
    .then((res) => {
      if(res.data.genres.length > 0) {
        genres = [...res.data.genres];
        let keyboard = [];
        let arr = [];

        genres.forEach((item, index) => {
          const obj = {
            text: item.name,
            callback_data: `genre ${item.id}`
          }
          arr.push(obj);

          if(!(index % 3) && index) {
            keyboard.push(arr);
            arr = [];
          }
        });

        const opts = {
          reply_markup: {
            inline_keyboard: keyboard
          }
        }

        bot.sendMessage(chadId, 'Choose a genre:', opts);

      } else {
        bot.sendMessage('Oops, something went wrong, try again please');
      }
    })
    .catch((err) => {
      console.log(err);
      bot.sendMessage('Oops, something went wrong, try again please');
    })
});

// retrieving the correct movie
bot.onText(/\/\b([1-9]|1[0-9]|20)\b/, (msg) => {
  const chatId = msg.chat.id;
  const command = msg.text.split('').splice(1).join('');

  bot.sendMessage(chatId, 'Loading...');

  MovieList.findOne({ userId: chatId })
    .then((res) => {
      let movie;

      if(!res) {
        bot.sendMessage(chatId, 'Nothing found, please check for typos.');
      } else {
        res.movies.forEach((item, index) => {
          if(index === parseInt(command) - 1) {
            movie = item;
          }
        });
      }

      if(!movie) {
        return bot.sendMessage(chatId, 'Invalid movie ID, try again please.');
      }

      let trailerURL = '';

      axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos`, {
        params: {
          api_key: config.TMDB_API_KEY || process.env.TMDB_API_KEY,
          language: 'en-US'
        }
      })
        .then((res) => {
          trailerURL = res.data.results.length !== 0 ? res.data.results[0].key : '';
          if (!movie.poster_path) {
            return bot.sendMessage(chatId, `
Title: ${movie.title}
Release: ${movie.release_date}
Rating: ${movie.vote_average}/10
Overview: ${movie.overview}
Trailer: ${trailerURL !== '' ? 'https://www.youtube.com/watch?v=' + trailerURL : '-'}
Add to watchlist: /add${command}
`);
          }
          bot.sendPhoto(chatId, `https://image.tmdb.org/t/p/w500${movie.poster_path}`, {caption: `
Title: ${movie.title}
Release: ${movie.release_date}
Rating: ${movie.vote_average}/10
Overview: ${movie.overview}
Trailer: ${trailerURL !== '' ? 'https://www.youtube.com/watch?v=' + trailerURL : '-'}
Add to watchlist: /add${command}
`         });
        })
        .catch((err) => {
          console.log(err);
          bot.sendMessage(chatId, 'Oops, something went completely wrong, try again please.');
        })
      // https://image.tmdb.org/t/p/w500  
    })
    .catch((err) => {
      console.log(err);
    });
});

// use watchlist feature
bot.onText(/\/watchlist/, (msg) => {
  const chatId = msg.chat.id;

  WatchList.findOne({ userId: chatId })
    .then((watchlist) => {
      // watchlist not found
      if (!watchlist) {
        const Watchlist = new WatchList({
          userId: chatId
        });

        Watchlist.save()
          .then(() => {
            bot.sendMessage(chatId, 'Congrats! Your first watch list created. \nTo view /watchlist');
          })
          .catch((err) => {
            bot.sendMessage(chatId, 'Oops, something went completely wrong, did not save a watch list.');
            console.error(err);
          })
        return;
      }
      // watchlist exists
      // remove old movie feed
      MovieList.findOneAndRemove({ userId: chatId })
        .catch((err) => {
          console.log(err);
        });

      // adding a new one
      const List = new MovieList({
        userId: chatId,
        movies: [...watchlist.movielist]
      });

      List.save()
        // .then(() => {
        //   console.log('Saved to MongoDB');
        // })
        .catch((err) => {
          console.log(err);
        });

      let output = '';

      watchlist.movielist.forEach((item, index) => {
        output += `/${index + 1} ${item.title} - ${item.release_date.slice(0, 4)}\n`;
      });

      if (output === '') output = 'Fill it with something!';

      const opts = {
        reply_markup: {
          inline_keyboard: [
            [
              {text: 'add', callback_data: 'watchlist add'},
              {text: 'delete', callback_data: 'watchlist delete'},
            ]
          ]
        }
      }

      bot.sendMessage(chatId, `Your watchlist:\n${output}`, opts);
    })
    .catch((err) => {
      bot.sendMessage(chatId, 'Oops, something went completely wrong, try again please.');
      console.error(err);
    });
});

// adding to watchlist
bot.onText(/\/add(.+)/, (msg) => {
  const chatId = msg.chat.id;
  const number = msg.text.split('').slice(4).join('');
  
  WatchList.findOne({ userId: chatId })
    .then((watchlist) => {
      if (!watchlist) {
        return bot.sendMessage(chatId, 'Your still don\'t have a watchlist? How dare you? \nCreate it now - /watchlist');
      }
      MovieList.findOne({ userId: chatId })
        .then((list) => {
          let flag = 1; // for comparing movies for the same one

          list.movies.forEach((item, index) => {
            if (index + 1 === parseInt(number)) {
              watchlist.movielist.forEach((listItem) => {
                if (item.id === listItem.id && flag) {
                  flag = 0;
                  bot.sendMessage(chatId, 'Your have already added this movie.');
                }
              });
              if (flag) {
                watchlist.movielist.push(item);
                watchlist.save()
                  .then(() => {
                    bot.sendMessage(chatId, 'Added a new movie to your watchlist! \nTo view /watchlist');
                  })
                  .catch((err) => {
                    bot.sendMessage(chatId, 'Oops, somthing went completely wrong. Couldn\'t save to watchlist.');
                    console.error(err);
                  });
              }
            }
          });
        })
        .catch((err) => {
          bot.sendMessage(chatId, 'Couldn\'t add to the watchlist');
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
      bot.sendMessage(chatId, 'Oops, something went completely wrong, try again please.');
    });
});

// Handle callback queries \
bot.on('callback_query', onCallbackQuery = (callbackQuery) => {
  const action = callbackQuery.data.split(' ')[0];
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };

  if (action === 'genre') {
    const genreId = callbackQuery.data.split(' ')[1];

    axios.get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: config.TMDB_API_KEY || process.env.TMDB_API_KEY,
        sort_by: 'popularity.desc',
        page: 1,
        with_genres: genreId
      }
    })
      .then((res) => {
        // save to MongoDB
        // removing old movies record
        MovieList.findOneAndRemove({ userId: msg.chat.id }, { useFindAndModify: true })
          .catch((err) => {
            console.log(err);
          });

        // adding a new one
        const List = new MovieList({
          userId: msg.chat.id,
          movies: [...res.data.results]
        });

        List.save()
          // .then(() => {
          //   console.log('Saved to MongoDB');
          // })
          .catch((err) => {
            console.log(err);
          });

        // send a reply to the user
        let output = '';

        res.data.results.forEach((movie, index) => {
          output += `/${index + 1} ${movie.title}\n`;        
        });

        bot.sendMessage(msg.chat.id, output);
      })
      .catch((err) => {
        console.log(err);
      })
  } else if (action === 'watchlist') {
    const call = callbackQuery.data.split(' ')[1];

    if (call === 'add') {
      bot.sendMessage(msg.chat.id, `Type movie name: `, {
        reply_markup: JSON.stringify({ force_reply: true }),
      })
        .then(reply => {
          bot.onReplyToMessage(
            reply.chat.id,
            reply.message_id,
            (reply) => {
              // outputting all possiable variants for searched movie
              bot.sendMessage(msg.chat.id, 'Loading...');
              axios.get('https://api.themoviedb.org/3/search/movie/', {
                params: {
                  api_key: config.TMDB_API_KEY || process.env.TMDB_API_KEY,
                  language: 'en-US',
                  query: reply.text,
                  page: 1
                }
              })
              .then((res) => {
                if(!res.data.results.length) {
                  return bot.sendMessage(msg.chat.id, 'Nothing found, please check the movie title for typos.');
                }

                // save to MongoDB
                // removing old movies record
                MovieList.findOneAndRemove({ userId: msg.chat.id })
                  .catch((err) => {
                    console.log(err);
                  });

                // adding a new one
                const List = new MovieList({
                  userId: msg.chat.id,
                  movies: [...res.data.results]
                });

                List.save()
                  // .then(() => {
                  //   console.log('Saved to MongoDB');
                  // })
                  .catch((err) => {
                    console.log(err);
                  });

                // send a reply to the user
                let output = 'Pick the one you are looking for:\n';
                res.data.results.forEach((movie, index) => {
                  output += `/${index + 1} ${movie.title} - ${movie.release_date.slice(0, 4)}\n`;        
                });

                bot.sendMessage(msg.chat.id, output);
              })
              .catch((err) => {
                console.log(err);
                bot.sendMessage(msg.chat.id, 'Nothing found, please check the movie title for typos.');
              })
            }
          )
        });
    } else if (call === 'delete') {
      bot.sendMessage(msg.chat.id, `Type movie ID (like, 7): `, {
        reply_markup: JSON.stringify({ force_reply: true }),
      })
      .then((reply) => {
        bot.onReplyToMessage(
          reply.chat.id,
          reply.message_id,
          (reply) => {
            WatchList.findOne({ userId: msg.chat.id })
              .then((watchlist) => {
                let deleted = false;

                watchlist.movielist.forEach((item, index) => {
                  if(index + 1 == parseInt(reply.text)) {
                    watchlist.movielist.splice(index, 1);
                    watchlist.save();
                    bot.sendMessage(msg.chat.id, 'Deleted successfuly.');
                    deleted = true;
                  }
                });

                if(!deleted) {
                  bot.sendMessage(msg.chat.id, 'Invalid movie ID provided, try again please');
                }
              })
              .catch((err) => {
                bot.sendMessage(msg.chat.id, 'Counld\'t delete a movie');
                console.error(err);
              });
          }
        );
      })

    }
  }
});

