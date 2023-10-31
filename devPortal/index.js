// const { BlobServiceClient } = require("@azure/storage-blob");
// const blobSasUrl = "https://funtechprodstorage.blob.core.windows.net/assets?sp=racwdli&st=2023-09-20T05:51:21Z&se=2023-10-20T13:51:21Z&sv=2022-11-02&sr=c&sig=vM%2FYgzRzUbN8tI7OrC52r%2FP3SOx4XdZhuPzWphxV1OQ%3D";

// // Create a new BlobServiceClient
// const blobServiceClient = new BlobServiceClient(blobSasUrl);

// Create a unique name for the container by 
// appending the current time to the file name
const containerName = "assets";

const fileInput = document.getElementById("assetFile");
const uploadButton = document.getElementById("upload-button");
// const reportStatus = message => {
//     status.innerHTML += `${message}<br/>`;
//     status.scrollTop = status.scrollHeight;
// }
// Get a container client from the BlobServiceClient
// const containerClient = blobServiceClient.getContainerClient(containerName);

// const listFiles = async () => {
//     fileList.size = 0;
//     fileList.innerHTML = "";
//     try {
//         reportStatus("Retrieving file list...");
//         let iter = containerClient.listBlobsFlat();
//         let blobItem = await iter.next();
//         while (!blobItem.done) {
//             fileList.size += 1;
//             fileList.innerHTML += `<option>${blobItem.value.name}</option>`;


//             blobItem = await iter.next();
//         }
//         if (fileList.size > 0) {
//             reportStatus("Done.");
//         } else {
//             reportStatus("The container does not contain any files.");
//         }
//     } catch (error) {
//         reportStatus(error.message);
//     }
// };

// const uploadFiles = async () => {
//     try {
//         console.log("Uploading files start");
//         const floater = document.getElementById("uploadSuccessFloater");
//         const loader = document.getElementById("loader");
//         loader.style.display = "flex";

        
//         const promises = [];
//         for (const file of fileInput.files) {
//             console.log("Uploading file name  ",file.name);
//             const blockBlobClient = containerClient.getBlockBlobClient(file.name);
//             promises.push(blockBlobClient.uploadBrowserData(file));
//         }
//         setTimeout(function () {
//             floater.style.display = "block";
//             loader.style.display = "none";
//         }, 15000);
//         await Promise.all(promises);
//         floater.style.display = "block";
//         loader.style.display = "none";
        
//         // Hide the floating element after 2 seconds
//         setTimeout(function () {
//             floater.style.display = "none";
//         }, 2000);
//         setTimeout(function () {
//             floater.style.display = "none";
//         }, 18000);
//         console.log("Done.");
//         // listFiles();
//     }
//     catch (error) {
//             console.log(error.message);
//             floater.style.display = "none";
//             loader.style.display = "none";
//     }
// }


// Function to show the floating element
function showUploadSuccessFloater() {
    
    const floater = document.getElementById("uploadSuccessFloater");
    const loader = document.getElementById("loader");
    loader.style.display = "flex";

    setTimeout(function () {
        floater.style.display = "block";
        loader.style.display = "none";
    }, 10000);

    // Hide the floating element after 2 seconds
    setTimeout(function () {
        floater.style.display = "none";
    }, 13000);
}

// Add a click event listener to the button
uploadButton.addEventListener("click", function () {
    // Simulate a successful upload by calling the showUploadSuccessFloater function
    showUploadSuccessFloater();
});

// uploadButton.addEventListener("click", () => fileInput.click());
// fileInput.addEventListener("change", uploadFiles);

uploadButton.addEventListener("click", () => showUploadSuccessFloater);


document.addEventListener("DOMContentLoaded", function () {
    const assetType = document.getElementById("assetType");
    const assetFolder = document.getElementById("assetFolder");
    const assetLink = document.getElementById("assetLink");

    // Initially hide the asset folder input
    assetFolder.style.display = "none";

    // Add a change event listener to the assetType dropdown
    assetType.addEventListener("change", function () {
        if (assetType.value === "webgl") {
            // Show the asset folder input and hide the game link input
            assetFolder.style.display = "block";
            assetLink.style.display = "none";
        } else {
            // Show the game link input and hide the asset folder input
            assetFolder.style.display = "none";
            assetLink.style.display = "block";
        }
    });
});