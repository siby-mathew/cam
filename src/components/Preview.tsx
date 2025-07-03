import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Image,
  Icon,
  Text,
} from "@chakra-ui/react";
import { createPdfFromBase64Images } from "../utils";
import { MdDelete } from "react-icons/md";

export const DocPreview: React.FC<{
  images: string[];
  removeByIndex: (index: number) => void;
  swap: (index: number) => void;
  selected: number;
}> = ({ images, removeByIndex, selected, swap }) => {
  const download = async () => {
    const pdfBlob = await createPdfFromBase64Images(images);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scanned-document.pdf";
    link.click();
  };

  return (
    <>
      {images && images.length > 0 && (
        <SimpleGrid columns={3} spacing={4}>
          {images.map((image, index) => {
            return (
              <Box
                key={index}
                userSelect={"none"}
                position={"relative"}
                border={"solid 3px"}
                borderRadius={5}
                borderColor={selected === index ? "#fff" : "transparent"}
                onClick={() => {
                  swap(index);
                }}
              >
                <Image borderRadius={5} w="100%" h="auto" src={image} />
                <Flex
                  position={"absolute"}
                  right={0}
                  bg="rgba(0,0,0,.6)"
                  left={0}
                  bottom={0}
                  justifyContent={"center"}
                  alignItems={"center"}
                  py={2}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    removeByIndex(index);
                  }}
                >
                  <Icon as={MdDelete} fontSize={20} />
                </Flex>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
      {images && images.length > 0 && (
        <>
          <Flex mt={4}>
            <Text fontSize={12} opacity={0.5}>
              Click an item to select it, then click another to swap their
              positions. You can use this to reorder the list easily.
            </Text>
          </Flex>
          <Flex w="full" mt={4}>
            <Button w="full" size={"lg"} onClick={download}>
              Create Document
            </Button>
          </Flex>
        </>
      )}
    </>
  );
};
