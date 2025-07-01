import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useId, useState } from "react";

import { PDFDocument } from "pdf-lib";

export async function createPdfFromBase64Images(
  base64Images: string[]
): Promise<Blob> {
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
}

export const Scanner: React.FC = () => {
  const id = useId();
  const [images, setImages] = useState<string[]>([]);
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert("No file selected.");
      return;
    }

    // ✅ Check if it's an image
    if (!file.type.startsWith("image/")) {
      alert("Selected file is not an image.");
      return;
    }

    // prompt("File name", file.name);

    console.log("Valid image file:", file);

    // Optional: read as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = reader.result as string;
      console.log("Image Preview:", imageDataUrl);
      setImages((prev) => [...prev, imageDataUrl]);
    };
    reader.readAsDataURL(file);
  };

  const download = async () => {
    const pdfBlob = await createPdfFromBase64Images(images);
    const url = URL.createObjectURL(pdfBlob);

    // Open in new tab or trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "scanned-document.pdf";
    link.click();
  };
  return (
    <Box w="100%">
      <Flex w="100%">
        <Button size={"lg"} as="label" htmlFor={id} w="full">
          Scan Document
          <input
            type="file"
            hidden
            id={id}
            accept="image/*"
            capture="environment"
            onChange={onChangeHandler}
            multiple={false}
          />
        </Button>
      </Flex>
      <Flex mt={3} direction={"row"} flexWrap={"wrap"} gap={3}>
        {images.map((image) => {
          return (
            <Flex w="100" h="auto" bg="red" display={"inline-flex"} maxW={100}>
              <Image w="100%" h="auto" src={image} />
            </Flex>
          );
        })}
      </Flex>
      <Flex>
        <Button onClick={download}>Download</Button>
      </Flex>
    </Box>
  );
};
