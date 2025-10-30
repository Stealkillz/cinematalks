const form = document.getElementById('uploadForm');
const feedContainer = document.getElementById('feed');
const statusEl = document.getElementById('formStatus');
const regionFilter = document.getElementById('regionFilter');
const categoryFilter = document.getElementById('categoryFilter');

async function fetchPosts() {
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error('Unable to load posts');
  }
  return response.json();
}

function renderMedia(post) {
  if (post.mediaType === 'video') {
    return `
      <video controls preload="metadata">
        <source src="${post.mediaPath}" type="video/mp4" />
        Your browser does not support embedded videos.
      </video>
    `;
  }

  return `<img src="${post.mediaPath}" alt="${post.title}" loading="lazy" />`;
}

function renderPost(post) {
  return `
    <article class="card">
      <div class="card__media">${renderMedia(post)}</div>
      <div class="card__content">
        <h3>${post.title}</h3>
        <p class="meta">${post.cinemaRegion} · ${post.actorCategory}</p>
        <p>${post.description}</p>
        <p class="timestamp">Shared on ${new Date(post.createdAt).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })}</p>
      </div>
    </article>
  `;
}

function applyFilters(posts) {
  return posts.filter((post) => {
    const matchesRegion = regionFilter.value === 'all' || post.cinemaRegion === regionFilter.value;
    const matchesCategory = categoryFilter.value === 'all' || post.actorCategory === categoryFilter.value;
    return matchesRegion && matchesCategory;
  });
}

async function loadFeed() {
  try {
    const posts = await fetchPosts();
    const filtered = applyFilters(posts);
    feedContainer.innerHTML = filtered.length
      ? filtered.map(renderPost).join('')
      : '<p class="empty">No posts yet. Be the first to celebrate your favourite moment!</p>';
  } catch (error) {
    feedContainer.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.textContent = 'Uploading…';
  statusEl.className = 'form-status pending';

  const formData = new FormData(form);

  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Upload failed');
    }

    form.reset();
    statusEl.textContent = 'Shared successfully!';
    statusEl.className = 'form-status success';
    await loadFeed();
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.className = 'form-status error';
  }
});

regionFilter.addEventListener('change', loadFeed);
categoryFilter.addEventListener('change', loadFeed);

loadFeed();
