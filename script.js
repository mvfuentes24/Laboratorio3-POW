// script.js
// Archivo base para el laboratorio.
// NO deben modificar el HTML ni el CSS, solo trabajar aquí.

// API pública: JSONPlaceholder
// Documentación: https://jsonplaceholder.typicode.com/ (solo lectura)
// Ejemplo de endpoint que usaremos:
//   https://jsonplaceholder.typicode.com/posts?userId=1

// Paso 1: Referencias a elementos del DOM (ya tienes los IDs definidos en index.html).
const postForm = document.getElementById("postForm");
const userIdInput = document.getElementById("userIdInput");
const rememberUserCheckbox = document.getElementById("rememberUser");
const statusArea = document.getElementById("statusArea");
const postsList = document.getElementById("postsList");
const clearResultsBtn = document.getElementById("clearResultsBtn");

// Claves para localStorage
const LAST_USER_ID_KEY = "lab_fetch_last_user_id";
const POSTS_DATA_KEY = "lab_fetch_posts_data";

// TODO 1:
// Al cargar la página:
// - Leer de localStorage el último userId usado (si existe) y colocarlo en el input.
//   Si hay valor, marcar el checkbox "rememberUser".
// - Leer de localStorage los posts guardados (si existen) y mostrarlos en la lista.
//   Si hay posts guardados, actualizar el área de estado indicando que se cargaron desde localStorage.
// Pista: window.addEventListener("DOMContentLoaded", ...)



window.addEventListener("DOMContentLoaded", function () {
  const lastUserId = localStorage.getItem(LAST_USER_ID_KEY);
  if (lastUserId) {
    userIdInput.value = lastUserId; 
    rememberUserCheckbox.checked = true; 
  }
  const savedPosts = localStorage.getItem(POSTS_DATA_KEY);
  if (savedPosts) {
    try {
      const postsArray = JSON.parse(savedPosts); 
      renderPosts(postsArray); 
      updateStatus("publicaciones cargadas desde localStorage.", "success");
    } catch (error) {
      console.error("Error al parsear posts guardados:", error);
      localStorage.removeItem(POSTS_DATA_KEY); 
      updateStatus("Error al cargar publicaciones guardadas. Se limpiaron los datos", "error");
    }
  }
});

//se usa en todo2 
function updateStatus(message, type) {
  statusArea.textContent = message;
  statusArea.className = "status-message"; 
  if (type === "loading") {
    statusArea.classList.add("status-message--loading");
  } else if (type === "success") {
    statusArea.classList.add("status-message--success");
  } else if (type === "error") {
    statusArea.classList.add("status-message--error");
  }
}

// TODO 2:
// Manejar el evento "submit" del formulario.
// - Prevenir el comportamiento por defecto.
// - Leer el valor de userId.
// - Validar que esté entre 1 y 10 (o mostrar mensaje de error).
// - Actualizar el área de estado a "Cargando..." con una clase de loading.
// - Llamar a una función que haga la petición fetch a la API.



postForm.addEventListener("submit", function (event) {
  event.preventDefault(); 

  const userId = parseInt(userIdInput.value.trim(), 10);

  if (isNaN(userId) || userId < 1 || userId > 10) {
    updateStatus("El ID de usuario debe ser un número entre 1 y 10.", "error");
    return; 
  }

  updateStatus("Cargando publicaciones", "loading");

  fetchPostsByUser(userId);
});

// TODO 3:
// Implementar una función async que reciba el userId y:
// - Arme la URL: https://jsonplaceholder.typicode.com/posts?userId=VALOR
// - Use fetch para hacer la petición GET.
// - Valide que la respuesta sea ok (response.ok).
// - Convierta la respuesta a JSON.
// - Actualice el área de estado a "Éxito" o similar.
// - Muestre los resultados en la lista usando otra función (ver TODO 4).
// - Maneje errores (try/catch) y muestre mensaje de error en statusArea.

async function fetchPostsByUser(userId) {
    const url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
    ;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`error en respuesta: ${response.status}`);
    }
    const data = await response.json();

    updateStatus(" publicaciones cargadas correctamente", "success");

    //esta en todo4
    renderPosts(data);

    //esta en todo5
    if (rememberUserCheckbox.checked) {
      localStorage.setItem(LAST_USER_ID_KEY, userId.toString());
    } else {
      localStorage.removeItem(LAST_USER_ID_KEY);
    }

  } catch (error) {
    console.error("error con publicaciones ", error);
    updateStatus("error al cargar publicaciones", "error");
  }


    
}

// TODO 4:
// Crear una función que reciba un arreglo de publicaciones y:
// - Limpie cualquier resultado previo en postsList.
// - Para cada post, cree un <li> con clase "post-item".
// - Dentro agregue un título (h3 o p con clase "post-title") y el cuerpo (p con clase "post-body").
// - Inserte los elementos en el DOM.
// - IMPORTANTE: Después de mostrar los posts, guardarlos en localStorage usando la clave POSTS_DATA_KEY.
//   Recuerda que localStorage solo guarda strings, así que usa JSON.stringify() para convertir el arreglo.

function renderPosts(posts) {
  postsList.innerHTML = "";
  posts.forEach(post => {
    const li = document.createElement("li");
    li.classList.add("post-item");

    const title = document.createElement("h3");
    title.classList.add("post-title");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.classList.add("post-body");
    body.textContent = post.body;

    li.appendChild(title);
    li.appendChild(body);

    postsList.appendChild(li);
  });

  //guarda en localStorage
  try {
    localStorage.setItem(POSTS_DATA_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("error al guardar publicaciones en localStorage:", error);
  }
}

// TODO 5:
// Si el checkbox "rememberUser" está marcado cuando se hace una consulta
// exitosa, guardar el userId en localStorage. Si no, limpiar ese valor.

if (rememberUserCheckbox.checked) {
  localStorage.setItem(LAST_USER_ID_KEY, userId.toString());
} else {
  localStorage.removeItem(LAST_USER_ID_KEY);
}

// TODO 6:
// Agregar un evento al botón "Limpiar resultados" que:
// - Vacíe la lista de publicaciones.
// - Restablezca el mensaje de estado a "Aún no se ha hecho ninguna petición."
// - Elimine los posts guardados en localStorage (usando la clave POSTS_DATA_KEY).

clearResultsBtn.addEventListener("click", function () {
  postsList.innerHTML = "";
  localStorage.removeItem(POSTS_DATA_KEY);

  statusArea.textContent = "no se ha hecho ninguna peticion";
  statusArea.className = "status-message";
});
