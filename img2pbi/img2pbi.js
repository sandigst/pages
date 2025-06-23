// sandigst 2025

function img2pbi(imgUrl) {
    const width = 144;
    const height = 168;

    const headerSize = 12;
    const stride = Math.floor(((width * 4) + 3) / 4);
    const dataSize = height * stride;
    const linePadding = stride - width;

    console.log("stride=" + stride);
    console.log("dataSize=" + dataSize);
    console.log("linePadding=" + linePadding);

    var result = new ArrayBuffer(headerSize + dataSize);
    // header
    const header = new Uint16Array(result, 0, 6);
    header[0] = stride; // row_size_bytes
    header[1] = 0b0001000000000010; // info_flags: GBitmapFormat8Bit; version 1
    header[2] = 0;      // bounds.origin.x
    header[3] = 0;      // bounds.origin.y
    header[4] = width;  // bounds.size.w
    header[5] = height; // bounds.size.h

    // image data
    const data = new Uint8Array(result, headerSize, dataSize);
    var pixel = 0;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            data[pixel] = 192 + (x % 64);
            pixel++;
        }
        pixel += linePadding;
    }
    return result;
}

const downloadURL = (url, fileName) => {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.style.display = 'none'
    a.click()
    a.remove()
}

const downloadBlob = (fileName) => {
    var pbiArray = img2pbi("");
    console.log(pbiArray);
    const blob = new Blob([pbiArray], {
        type: "application/octet-stream"
    })

    const url = window.URL.createObjectURL(blob)
    downloadURL(url, fileName)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
}