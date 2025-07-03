import { PDFDocument } from "pdf-lib";
export const createPdfFromBase64Images = async (
  base64Images: string[]
): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();

  for (const base64 of base64Images) {
    const cleanedBase64 = base64.replace(/^data:image\/(png|jpeg);base64,/, "");
    const bytes = Uint8Array.from(atob(cleanedBase64), (c) => c.charCodeAt(0));

    let image;
    if (base64.startsWith("data:image/jpeg")) {
      image = await pdfDoc.embedJpg(bytes);
    } else if (base64.startsWith("data:image/png")) {
      image = await pdfDoc.embedPng(bytes);
    } else {
      console.warn("Unsupported image format");
      continue;
    }

    const { width, height } = image.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};

export const swap = (
  array: string[],
  currentIndex: number,
  swapToPosition: number
) => {
  if (
    currentIndex === -1 ||
    swapToPosition < 0 ||
    swapToPosition >= array.length
  ) {
    return array;
  }
  const itemToSwap = array[currentIndex];
  const newArray = [...array];
  newArray.splice(currentIndex, 1);
  newArray.splice(swapToPosition, 0, itemToSwap);

  return newArray;
};
