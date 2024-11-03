document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Mencegah refresh halaman

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        document.getElementById('response').innerText = data.message || data.error;
    } catch (error) {
        document.getElementById('response').innerText = 'Terjadi kesalahan saat meng-upload file';
    }
});