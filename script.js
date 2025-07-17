// Manejo de comentarios con Firebase Realtime Database
const form = document.getElementById('comentario-form');
const lista = document.getElementById('lista-comentarios');
const db = firebase.database();

function getIniciales(nombre) {
  return nombre
    .split(' ')
    .map(p => p[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

function mostrarComentario({nombre, mensaje}) {
  const li = document.createElement('li');
  li.className = 'comentario-item';
  li.innerHTML = `
    <div class="avatar">${getIniciales(nombre)}</div>
    <div class="comentario-contenido">
      <div class="comentario-nombre">${nombre}</div>
      <div class="comentario-mensaje">${mensaje}</div>
    </div>
  `;
  lista.appendChild(li);
}

function cargarComentarios() {
  lista.innerHTML = '';
  db.ref('comentarios').orderByKey().limitToLast(50).on('value', snapshot => {
    lista.innerHTML = '';
    const comentarios = snapshot.val();
    if (comentarios) {
      Object.values(comentarios).forEach(mostrarComentario);
    }
  });
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  if (!nombre || !mensaje) return;
  db.ref('comentarios').push({nombre, mensaje});
  form.reset();
});

document.addEventListener('DOMContentLoaded', cargarComentarios); 