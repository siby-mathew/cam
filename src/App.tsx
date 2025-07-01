import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useId, useState } from "react";

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
    </Box>
  );
};
