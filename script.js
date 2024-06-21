const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const uploadedImage = document.getElementById('uploadedImage');
const dressedImage = document.getElementById('dressedImage');
const loadingIndicator = document.getElementById('loading');
const snapButton = document.getElementById('snap');
const uploadInput = document.getElementById('upload');
const startCameraButton = document.getElementById('startCamera');
const stopCameraButton = document.getElementById('stopCamera');
const tryOnDressButton = document.getElementById('tryOnDress');
const resetButton = document.getElementById('reset');

let stream;

// Function to start the camera
startCameraButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
            video.style.display = 'block';
            canvas.style.display = 'none';
            uploadedImage.style.display = 'none';
            dressedImage.style.display = 'none';
        })
        .catch(err => {
            console.error("Error accessing camera: ", err);
        });
});

// Function to stop the camera
stopCameraButton.addEventListener('click', () => {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.style.display = 'none';
    }
});

// Take photo from the camera
snapButton.addEventListener('click', () => {
    if (stream) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        uploadedImage.src = dataUrl;
        uploadedImage.style.display = 'block';
        video.style.display = 'none';
        canvas.style.display = 'none';
        dressedImage.style.display = 'none';
    }
});

// Handle image upload
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = 'block';
            video.style.display = 'none';
            canvas.style.display = 'none';
            dressedImage.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
});

// Handle dress try-on using API
tryOnDressButton.addEventListener('click', () => {
    const imageUrl = uploadedImage.src;
    if (!imageUrl) {
        alert('Please upload an image or snap a photo first.');
        return;
    }

    loadingIndicator.style.display = 'block';

    // Call the API to try on the dress
    fetch('https://api.example.com/tryon', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageUrl })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        loadingIndicator.style.display = 'none';
        dressedImage.src = data.dressedImageUrl;
        dressedImage.style.display = 'block';
        uploadedImage.style.display = 'none';
        video.style.display = 'none';
        canvas.style.display = 'none';
    })
    .catch(error => {
        loadingIndicator.style.display = 'none';
        console.error('Error:', error);
        alert('Failed to apply the dress. Please try again.');
    });
});

// Reset the interface
resetButton.addEventListener('click', () => {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    video.style.display = 'none';
    canvas.style.display = 'none';
    uploadedImage.style.display = 'none';
    dressedImage.style.display = 'none';
    loadingIndicator.style.display = 'none';
    uploadInput.value = '';
});
