document.getElementById('glbUpload').addEventListener('change', e => handleUpload(e, 'glb'));
document.getElementById('usdzUpload').addEventListener('change', e => handleUpload(e, 'usdz'));

async function handleUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    // Show model locally
    const modelViewer = document.getElementById('model');
    modelViewer.src = URL.createObjectURL(file);

    // Upload to File.io
    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('https://file.io/?expires=1d', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            const shareURL = `${window.location.origin}${window.location.pathname}?model=${encodeURIComponent(data.link)}`;
            document.getElementById('share-link').value = shareURL;
            document.getElementById('share-section').style.display = 'block';
        } else {
            alert('Upload failed');
        }
    } catch (err) {
        console.error(err);
        alert('Error uploading file');
    }
}

// Copy link button
document.getElementById('copy-link').addEventListener('click', () => {
    const linkInput = document.getElementById('share-link');
    linkInput.select();
    document.execCommand('copy');
    alert('Link copied!');
});

// Load shared model if ?model= is in URL
const params = new URLSearchParams(window.location.search);
if (params.has('model')) {
    document.getElementById('model').src = params.get('model');
}
const glbUpload = document.getElementById('glbUpload');
const usdzUpload = document.getElementById('usdzUpload');
const modelViewer = document.getElementById('model');

let glbUrl = null;
let usdzUrl = null;

glbUpload.addEventListener('change', function(event) {
  var file = event.target.files[0];
  if (file && file.name.endsWith('.glb')) {
    glbUrl = URL.createObjectURL(file);
    modelViewer.setAttribute('src', glbUrl);
  } else {
    alert('Please upload a .glb file.');
  }
});

usdzUpload.addEventListener('change', function(event) {
  var file = event.target.files[0];
  if (file && file.name.endsWith('.usdz')) {
    usdzUrl = URL.createObjectURL(file);
    modelViewer.setAttribute('ios-src', usdzUrl);
  } else {
    alert('Please upload a .usdz file.');
  }
});
