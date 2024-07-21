document.addEventListener("DOMContentLoaded", () => {
    // For fetching and displaying the first movie's details
    fetch('http://localhost:3000/films/1')
      .then(response => response.json())
      .then(movie => displayMovie(movie));
  
    // For fetching and displaying all movies in the menu
    fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(movies => {
        const filmsList = document.getElementById('films');
        movies.forEach(movie => {
          const li = document.createElement('li');
          li.textContent = movie.title;
          li.classList.add('film', 'item');
          li.setAttribute('data-id', movie.id);
          li.addEventListener('click', () => displayMovie(movie));
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteMovie(movie.id);
          });
  
          li.appendChild(deleteButton);
          filmsList.appendChild(li);
        });
      });
  
    document.getElementById('buy-ticket').addEventListener('click', () => {
      const availableTicketsElement = document.getElementById('available-tickets');
      let availableTickets = parseInt(availableTicketsElement.textContent.split(': ')[1]);
  
      if (availableTickets > 0) {
        availableTickets -= 1;
        availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`;
        
        if (availableTickets === 0) {
          document.getElementById('buy-ticket').textContent = 'Sold Out';
          document.querySelector(`li[data-id='${document.getElementById('title').dataset.id}']`).classList.add('sold-out');
        }
  
        // Persist or basically update the server when the tickets bave been purchased
        const movieId = document.getElementById('title').dataset.id;
        fetch(`http://localhost:3000/films/${movieId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tickets_sold: parseInt(document.getElementById('tickets-sold').textContent) + 1
          })
        });
      }
    });
  });
  
  function displayMovie(movie) {
    document.getElementById('poster').src = movie.poster;
    document.getElementById('title').textContent = movie.title;
    document.getElementById('title').dataset.id = movie.id;
    document.getElementById('runtime').textContent = `Runtime: ${movie.runtime} minutes`;
    document.getElementById('showtime').textContent = `Showtime: ${movie.showtime}`;
    const availableTickets = movie.capacity - movie.tickets_sold;
    document.getElementById('available-tickets').textContent = `Available Tickets: ${availableTickets}`;
    document.getElementById('tickets-sold').textContent = movie.tickets_sold;
  }
  
  function deleteMovie(movieId) {
    fetch(`http://localhost:3000/films/${movieId}`, {
      method: 'DELETE'
    }).then(() => {
      document.querySelector(`li[data-id='${movieId}']`).remove();
    });
  }
  