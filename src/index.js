let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");

  let addToy = false;
  const toyUrl = "http://localhost:3000/toys";

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch all toys and render them
  function fetchToys() {
    fetch(toyUrl)
      .then(response => response.json())
      .then(toys => {
        toyCollection.innerHTML = ""; // Clear before rendering
        toys.forEach(renderToy);
      })
      .catch(error => console.error("Error fetching toys:", error));
  }

  // Render a toy as a card
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Like button event listener
    toyCard.querySelector(".like-btn").addEventListener("click", () => likeToy(toy));

    toyCollection.appendChild(toyCard);
  }

  // Handle form submission to add a new toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const newToy = {
      name: toyForm.name.value,
      image: toyForm.image.value,
      likes: 0
    };

    fetch(toyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy); // Add to DOM without refreshing
      toyForm.reset(); // Clear form
    })
    .catch(error => console.error("Error adding toy:", error));
  });

  // Handle likes
  function likeToy(toy) {
    const newLikes = toy.likes + 1;

    fetch(`${toyUrl}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      document.getElementById(updatedToy.id).previousElementSibling.textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => console.error("Error updating likes:", error));
  }

  // Initial fetch
  fetchToys();
});
