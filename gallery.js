export function initializeGallery() {
    const imageModal = document.getElementById("imageModal");
    if (!imageModal) return;

    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const imageModalCloseBtn = document.querySelector("#imageModal .close");

    function closeImageModal() {
        imageModal.style.display = "none";
        const video = imageModal.querySelector("video");
        if (video) {
            video.pause();
            video.remove();
        }
        captionText.innerHTML = "";
    }

    document.querySelectorAll(".gallery-item").forEach((item) => {
        item.addEventListener("click", function () {
            imageModal.style.display = "block";

            if (this.classList.contains("video-item")) {
                const videoSrc = this.getAttribute("data-video");
                modalImg.style.display = "none";
                const existingVideo = imageModal.querySelector("video");
                if (existingVideo) {
                    existingVideo.remove();
                }
                const video = document.createElement("video");
                video.src = videoSrc;
                video.controls = true;
                video.autoplay = true;
                video.style.width = "100%";
                video.style.maxHeight = "80vh";
                modalImg.parentNode.insertBefore(video, modalImg);
                captionText.innerHTML = this.getAttribute("data-caption");
                video.addEventListener("ended", function () {
                    closeImageModal();
                });
            } else {
                modalImg.style.display = "block";
                modalImg.src = this.getAttribute("data-img");
                captionText.innerHTML = this.getAttribute("data-caption");
            }
        });
    });

    if (imageModalCloseBtn) {
        imageModalCloseBtn.onclick = closeImageModal;
    }

    window.addEventListener("click", function (event) {
        if (event.target == imageModal) {
            closeImageMceModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && imageModal.style.display === "block") {
            closeImageModal();
        }
    });
} 